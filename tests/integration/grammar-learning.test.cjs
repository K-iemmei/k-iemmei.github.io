const test = require('node:test'),
    assert = require('node:assert/strict');
const { createTestDatabase } = require('../helpers/test-database.cjs');
const { createApp } = require('../../apps/api/app');
test('Grammar grades on server, persists completion and writing per user, schedules reviews and retries idempotently', async (t) => {
    const f = await createTestDatabase();
    const server = createApp({ database: f.pool }).listen(0, '127.0.0.1');
    await new Promise((r) => server.once('listening', r));
    t.after(async () => {
        server.closeAllConnections();
        await new Promise((r) => server.close(r));
        await f.cleanup();
    });
    const base = 'http://127.0.0.1:' + server.address().port;
    const login = await fetch(base + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'test-learner', password: 'test-password' }),
    });
    const headers = {
        'Content-Type': 'application/json',
        Cookie: login.headers.get('set-cookie').split(';')[0],
    };
    const call = async (path = '', method = 'GET', body) => {
        const r = await fetch(base + '/api/grammar' + path, {
            method,
            headers,
            ...(body ? { body: JSON.stringify(body) } : {}),
        });
        return { status: r.status, data: await r.json() };
    };
    assert.equal((await fetch(base + '/api/grammar')).status, 401);
    const { bookLessons } =
        await import('../../apps/web/src/features/grammar/content/book-lessons.js');
    const lesson = bookLessons[1];
    const answers = Object.fromEntries(
        lesson.questions.filter((q) => q.mode === 'assessment').map((q) => [q.id, q.answers[0]]),
    );
    const payload = {
        mode: 'assessment',
        answers,
        score: 0,
        user_id: 'forged',
        request_id: '12345678-1234-4234-8234-123456789abc',
    };
    let r = await call('/giu-001/attempts', 'POST', payload);
    assert.equal(r.status, 200);
    assert.equal(r.data.progress.best_score, 100);
    assert.equal(r.data.progress.completed_at, null);
    assert.equal(r.data.attempt.score, 5);
    r = await call('/giu-001', 'PUT', {
        read: true,
        drafts: { 'giu-001-s1': 'My original paragraph' },
    });
    assert(r.data.progress.completed_at);
    assert.equal(r.data.progress.drafts['giu-001-s1'], 'My original paragraph');
    await call('/giu-001/attempts', 'POST', payload);
    let all = (await call()).data;
    assert.equal(all.reviews.length, 5);
    assert(all.reviews.every((r) => r.streak === 1));
    const next = {
        ...payload,
        request_id: '22345678-1234-4234-8234-123456789abc',
        answers: Object.fromEntries(Object.keys(answers).map((id) => [id, 'wrong'])),
    };
    await call('/giu-001/attempts', 'POST', next);
    all = (await call()).data;
    assert(all.reviews.every((r) => r.streak === 0 && r.mistakes === 1));
    assert.equal(all.progress[0].best_score, 100);
    const other = (await f.pool.query("INSERT INTO users(name) VALUES('Other') RETURNING id"))
        .rows[0].id;
    const isolated = (await f.pool.query("SELECT app_grammar_api($1,'load') AS result", [other]))
        .rows[0].result;
    assert.deepEqual(isolated.progress, []);
    assert.deepEqual(isolated.reviews, []);
    assert.equal((await call('/giu-146', 'PUT', { read: true })).status, 400);
    assert.equal(
        (await call('/giu-001', 'PUT', { drafts: { 'giu-002-s1': 'forged' } })).status,
        400,
    );
    for (const number of [7, 37, 68, 81, 95, 103, 120, 136, 145]) {
        const unit = bookLessons[number];
        const attempt = await call(`/${unit.id}/attempts`, 'POST', {
            mode: 'assessment',
            request_id: require('node:crypto').randomUUID(),
            answers: Object.fromEntries(
                unit.questions
                    .filter((q) => q.mode === 'assessment')
                    .map((q) => [q.id, q.answers[0]]),
            ),
        });
        assert.equal(attempt.status, 200, unit.id);
        assert.equal(attempt.data.progress.best_score, 100, unit.id);
        const saved = await call(`/${unit.id}`, 'PUT', {
            read: true,
            drafts: { [unit.scenarios[0].id]: 'My practice paragraph' },
        });
        assert(saved.data.progress.completed_at, unit.id);
    }

    // Each pass requires a fresh server session, acknowledgement and assessment.
    assert.equal((await call()).data.progress.find((p) => p.unit_id === 'giu-001').study_rounds, 0);
    let firstRequest;
    for (let round = 1; round <= 5; round++) {
        const started = await call('/giu-001/rounds', 'POST', {});
        assert.equal(started.status, 200);
        const session_id = started.data.progress.study_session_id;
        assert(session_id);
        assert.equal(started.data.progress.round_read, false);
        assert.equal(started.data.progress.round_score, 0);
        assert.equal(
            (await call('/giu-001/rounds', 'POST', {})).data.progress.study_session_id,
            session_id,
        );
        await call('/giu-001', 'PUT', { read: true, session_id });
        if (firstRequest) {
            const duplicate = await call('/giu-001/attempts', 'POST', {
                ...payload,
                request_id: firstRequest,
                session_id,
            });
            assert.equal(duplicate.data.progress.study_rounds, round - 1);
        }
        const request_id = require('node:crypto').randomUUID();
        firstRequest ||= request_id;
        const passed = await call('/giu-001/attempts', 'POST', {
            ...payload,
            request_id,
            session_id,
        });
        assert.equal(passed.status, 200);
        assert.equal(passed.data.progress.study_rounds, round);
        assert.equal(passed.data.progress.study_session_id, null);
        assert.equal(!!passed.data.progress.mastered_at, round === 5);
        assert.notEqual((await call('/giu-001/rounds', 'POST', {})).status, 200);
        const stale = await call('/giu-001', 'PUT', { read: true, session_id });
        assert.notEqual(stale.status, 200);
        // Move previous credit dates back one day to simulate studying tomorrow.
        if (round < 5) {
            await f.pool.query(
                "UPDATE grammar_study_rounds SET studied_on=studied_on-1 WHERE unit_id='giu-001'",
            );
            await f.pool.query(
                "UPDATE grammar_unit_progress SET last_studied_on=last_studied_on-1 WHERE unit_id='giu-001'",
            );
        }
    }
    assert.equal(
        (
            await f.pool.query(
                "SELECT count(*)::int AS n FROM grammar_study_rounds WHERE unit_id='giu-001'",
            )
        ).rows[0].n,
        5,
    );
});
