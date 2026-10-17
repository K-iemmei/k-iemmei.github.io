const test = require('node:test');
const assert = require('node:assert/strict');
const { createTestDatabase } = require('../helpers/test-database.cjs');
const { createDevelopmentApp } = require('../../apps/api/development-server');

test('English log aggregates submitted Reading and idempotent playback by Bangkok date, isolated per user', async (t) => {
    const fixture = await createTestDatabase();
    t.after(() => fixture.cleanup());
    const server = createDevelopmentApp({ database: fixture.pool }).listen(0, '127.0.0.1');
    await new Promise((resolve) => server.once('listening', resolve));
    t.after(() => new Promise((resolve) => server.close(resolve)));
    const base = `http://127.0.0.1:${server.address().port}`;
    assert.equal((await fetch(base + '/api/tracking/english')).status, 401);
    assert.equal((await fetch(base + '/api/tracking/leaderboard')).status, 401);
    const login = await fetch(base + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'test-learner', password: 'test-password' }),
    });
    const headers = {
        'Content-Type': 'application/json',
        Cookie: login.headers.get('set-cookie').split(';')[0],
    };
    const other = (
        await fixture.pool.query("INSERT INTO public.users(name) VALUES('Other') RETURNING id")
    ).rows[0].id;
    const reading = (
        await fixture.pool.query(
            "INSERT INTO public.reading_tests(slug,title) VALUES('tracking-test','Tracking test') RETURNING id",
        )
    ).rows[0].id;
    await fixture.pool.query(
        `INSERT INTO public.reading_attempts(user_id,test_id,test_version,test_title,responses,review,correct_count,total_count,graded_count,completed_at) VALUES
        ($1,$3,1,'Tracking test','{}','[]',0,10,10,'2026-01-01T16:59:00Z'),
        ($1,$3,1,'Tracking test','{}','[]',0,10,10,'2026-01-01T17:01:00Z'),
        ($1,$3,1,'Tracking test','{}','[]',0,10,10,'2026-01-01T17:02:00Z'),
        ($2,$3,1,'Tracking test','{}','[]',0,10,10,'2026-01-01T17:01:00Z')`,
        [fixture.userId, other, reading],
    );
    const body = {
        events: [
            {
                id: '12345678-1234-4234-8234-123456789abc',
                activity_date: '2026-01-02',
                seconds: 150,
                user_id: other,
            },
        ],
    };
    for (let i = 0; i < 2; i++)
        assert.equal(
            (
                await fetch(base + '/api/tracking/listening', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(body),
                })
            ).status,
            201,
        );
    const response = await fetch(base + '/api/tracking/english', { headers });
    assert.equal(response.status, 200);
    const rows = await response.json();
    assert.equal(rows.length, 2);
    assert.equal(String(rows[0].activity_date).slice(0, 10), '2026-01-01');
    assert.equal(Number(rows[0].reading_submissions), 1);
    assert.equal(Number(rows[1].reading_submissions), 2);
    assert.equal(Number(rows[1].listening_seconds), 150);
    const inactive = (
        await fixture.pool.query(
            "INSERT INTO public.users(name) VALUES('Inactive learner') RETURNING id",
        )
    ).rows[0].id;
    const daily = await (
        await fetch(base + '/api/tracking/leaderboard?date=2026-01-02', { headers })
    ).json();
    assert.equal(daily.date, '2026-01-02');
    const learnerRank = daily.users.find((row) => row.user_id === fixture.userId);
    assert.equal(Number(learnerRank.points), 2.25);
    assert.equal(Number(learnerRank.rank), 1);
    assert.equal(Number(daily.users.find((row) => row.user_id === other).points), 1);
    assert.equal(Number(daily.users.find((row) => row.user_id === inactive).points), 0);
    assert.equal(Number(daily.users.find((row) => row.user_id === inactive).rank), 3);
    for (const row of daily.users) {
        assert.deepEqual(Object.keys(row).sort(), [
            'listening_seconds',
            'name',
            'points',
            'rank',
            'reading_submissions',
            'user_id',
        ]);
    }
    const previous = await (
        await fetch(base + '/api/tracking/leaderboard?date=2026-01-01', { headers })
    ).json();
    assert.equal(Number(previous.users.find((row) => row.user_id === fixture.userId).points), 1);
    assert.equal(Number(previous.users.find((row) => row.user_id === other).rank), 2);
    assert.equal(Number(previous.users.find((row) => row.user_id === inactive).rank), 2);
    assert.equal(
        (await fetch(base + '/api/tracking/leaderboard?date=2026-02-30', { headers })).status,
        400,
    );
    assert.equal(
        (await fetch(base + '/api/tracking/leaderboard?date=invalid', { headers })).status,
        400,
    );
    assert.equal(
        Number(
            (
                await fixture.pool.query(
                    'SELECT count(*) FROM public.listening_activity WHERE user_id=$1',
                    [other],
                )
            ).rows[0].count,
        ),
        0,
    );
    assert.equal(
        (
            await fetch(base + '/api/tracking/listening', {
                method: 'POST',
                headers,
                body: JSON.stringify({ events: [{ ...body.events[0], seconds: -1 }] }),
            })
        ).status,
        400,
    );
});
