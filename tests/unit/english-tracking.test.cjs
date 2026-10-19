const test = require('node:test');
const assert = require('node:assert/strict');

test('English intensity balances submissions and listening without depending on accuracy', async () => {
    const { englishProgress, trackingDate, validateListeningBatch } =
        await import('../../apps/web/src/domain/english-tracking.js');
    assert.equal(englishProgress().level, 0);
    assert.equal(englishProgress({ listening_seconds: 30 }).level, 1);
    assert.equal(englishProgress({ reading_submissions: 1 }).level, 2);
    assert.equal(englishProgress({ listening_submissions: 1 }).level, 2);
    assert.equal(
        englishProgress({
            reading_submissions: 1,
            listening_submissions: 2,
            listening_seconds: 600,
        }).points,
        4,
    );
    assert.equal(englishProgress({ listening_seconds: 600 }).level, 2);
    assert.equal(englishProgress({ reading_submissions: 1, listening_seconds: 600 }).level, 3);
    assert.equal(englishProgress({ reading_submissions: 2, listening_seconds: 600 }).level, 4);
    assert.equal(
        englishProgress({ reading_submissions: -1, listening_seconds: Infinity }).points,
        0,
    );
    assert.equal(trackingDate('2026-10-17T17:00:00Z'), '2026-10-18');
    const row = {
        id: '12345678-1234-4234-8234-123456789abc',
        activity_date: '2026-01-01',
        seconds: 15,
    };
    assert.deepEqual(validateListeningBatch({ events: [{ ...row, user_id: 'spoofed' }] }), [row]);
    for (const change of [
        { seconds: 0 },
        { seconds: Infinity },
        { seconds: 301 },
        { seconds: '15' },
        { activity_date: '2026-02-30' },
        { activity_date: '2999-01-01' },
        { id: 'invalid' },
    ])
        assert.throws(() => validateListeningBatch({ events: [{ ...row, ...change }] }), {
            status: 400,
        });
    assert.throws(() => validateListeningBatch({ events: [] }), { status: 400 });
});

test('playback clock excludes pauses and buffering, splits midnight, and caps batch size', async () => {
    const { createPlaybackClock } =
        await import('../../apps/web/src/features/english/listening-tracker.js');
    let now = Date.parse('2026-10-17T16:59:55Z');
    const clock = createPlaybackClock(() => now);
    assert.deepEqual(clock.take(true), []);
    now += 30000;
    assert.deepEqual(clock.take(), []); // A timer cannot start paused audio.
    now = Date.parse('2026-10-17T16:59:55Z');
    clock.start();
    now += 15000;
    assert.deepEqual(clock.take(), [
        { activity_date: '2026-10-17', seconds: 5 },
        { activity_date: '2026-10-18', seconds: 10 },
    ]);
    now += 60000;
    assert.deepEqual(clock.take(true), []); // Waiting/paused time is excluded.
    clock.start();
    now += 10000;
    clock.start(); // Duplicate playing does not lose accrued seconds.
    now += 5000;
    assert.equal(clock.take(true)[0].seconds, 15);
    now += 5000;
    assert.equal(clock.take()[0].seconds, 5);
    clock.start();
    now += 610000;
    assert.deepEqual(
        clock.take().map((event) => event.seconds),
        [300, 300, 10],
    );
});

test('hosted tracking always binds the authenticated user and retries are idempotent', async () => {
    const { trackingApi } = await import('../../supabase/functions/app-api/tracking.ts');
    const calls = [];
    const admin = {
        rpc: async (...args) => {
            calls.push(args);
            return { data: [], error: null };
        },
        from: (table) => ({
            upsert: async (...args) => {
                calls.push([table, ...args]);
                return { error: null };
            },
        }),
    };
    await trackingApi(admin, { id: 'owner' }, '/api/tracking/english', 'GET');
    assert.deepEqual(calls[0], ['english_tracking_v2', { learner: 'owner' }]);
    await trackingApi(admin, { id: 'owner' }, '/api/tracking/listening', 'POST', {
        events: [
            {
                id: '12345678-1234-4234-8234-123456789abc',
                activity_date: '2026-01-01',
                seconds: 15,
                user_id: 'other',
            },
        ],
    });
    assert.equal(calls[1][1][0].user_id, 'owner');
    assert.deepEqual(calls[1][2], { onConflict: 'user_id,id', ignoreDuplicates: true });
});

test('hosted Hall of Fame loads cross-user daily aggregates with validated dates', async () => {
    const { trackingApi } = await import('../../supabase/functions/app-api/tracking.ts');
    const { leaderboardDate, trackingDate } =
        await import('../../apps/web/src/domain/english-tracking.js');
    const calls = [];
    const users = [{ name: 'Learner', points: 2.25, rank: 1 }];
    const admin = {
        rpc: async (...args) => {
            calls.push(args);
            return { data: users, error: null };
        },
    };
    const result = await trackingApi(
        admin,
        { id: 'owner' },
        '/api/tracking/leaderboard',
        'GET',
        null,
        new URL('https://example.test/?date=2026-01-02'),
    );
    assert.deepEqual(result, { date: '2026-01-02', users });
    assert.deepEqual(calls[0], ['english_hall_of_fame', { log_date: '2026-01-02' }]);
    assert.equal(leaderboardDate(), trackingDate());
    await assert.rejects(
        () =>
            trackingApi(
                admin,
                { id: 'owner' },
                '/api/tracking/leaderboard',
                'GET',
                null,
                new URL('https://example.test/?date=2026-02-30'),
            ),
        { status: 400 },
    );
    assert.equal(calls.length, 1);
    assert.deepEqual(
        await trackingApi(
            admin,
            { id: 'owner' },
            '/api/tracking/leaderboard',
            'GET',
            null,
            new URL('https://example.test/'),
        ),
        { date: null, users },
    );
    assert.deepEqual(calls[1], ['english_hall_of_fame', { log_date: null }]);
});
