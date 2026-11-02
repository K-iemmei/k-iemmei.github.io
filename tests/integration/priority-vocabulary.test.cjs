const test = require('node:test'),
    assert = require('node:assert/strict');
const { createTestDatabase } = require('../helpers/test-database.cjs');
const { createApp } = require('../../apps/api/app');
test('priority vocabulary persists five manual passes, isolates users and rejects stale or duplicate writes', async (t) => {
    const f = await createTestDatabase(),
        server = createApp({ database: f.pool }).listen(0, '127.0.0.1');
    await new Promise((r) => server.once('listening', r));
    t.after(async () => {
        server.closeAllConnections();
        await new Promise((r) => server.close(r));
        await f.cleanup();
    });
    const base = 'http://127.0.0.1:' + server.address().port;
    assert.equal((await fetch(base + '/api/vocabulary/priority')).status, 401);
    const login = await fetch(base + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'test-learner', password: 'test-password' }),
    });
    const headers = {
        'Content-Type': 'application/json',
        Cookie: login.headers.get('set-cookie').split(';')[0],
    };
    const { priorityCatalog } =
        await import('../../apps/web/src/features/vocabulary/content/priority-catalog.js');
    const id = priorityCatalog[0].id;
    async function call(path = '', method = 'GET', body) {
        const response = await fetch(base + '/api/vocabulary/priority' + path, {
            method,
            headers,
            ...(body ? { body: JSON.stringify(body) } : {}),
        });
        return { status: response.status, data: await response.json() };
    }
    assert.deepEqual((await call()).data.progress, []);
    const payload = { completed_rounds: 1, expected_revision: 0, user_id: 'forged' };
    const concurrent = await Promise.all([
        call('/' + id, 'PUT', payload),
        call('/' + id, 'PUT', payload),
    ]);
    assert.deepEqual(concurrent.map((r) => r.status).sort(), [200, 409]);
    let entry = (await call()).data.progress[0];
    assert.equal(entry.completed_rounds, 1);
    assert.equal(entry.studied_at.length, 1);
    assert(!entry.user_id);
    assert.equal(
        (await call('/' + id, 'PUT', { completed_rounds: 5, expected_revision: 1 })).status,
        400,
    );
    for (let count = 2; count <= 5; count++) {
        const result = await call('/' + id, 'PUT', {
            completed_rounds: count,
            expected_revision: entry.revision,
        });
        assert.equal(result.status, 200);
        entry = result.data;
        assert.equal(entry.completed_rounds, count);
        assert.equal(entry.studied_at.length, count);
    }
    assert.equal(
        (await call('/' + id, 'PUT', { completed_rounds: 6, expected_revision: entry.revision }))
            .status,
        400,
    );
    entry = (
        await call('/' + id, 'PUT', { completed_rounds: 4, expected_revision: entry.revision })
    ).data;
    assert.equal(entry.completed_rounds, 4);
    assert.equal(entry.studied_at.length, 4);
    assert.equal((await call()).data.progress[0].completed_rounds, 4);
    const other = (
        await f.pool.query("INSERT INTO users(name) VALUES('Other priority learner') RETURNING id")
    ).rows[0].id;
    assert.deepEqual(
        (await f.pool.query("SELECT app_priority_vocabulary($1,'load') AS result", [other])).rows[0]
            .result.progress,
        [],
    );
    assert.equal((await call('/pv-0000000000000000', 'PUT', payload)).status, 400);
    assert.equal(
        (await call('', 'POST', { word: ' ', mean: 'meaning', example: 'Example.' })).status,
        400,
    );
    const created = await call('', 'POST', {
        word: ' zephyr ',
        mean: 'a gentle breeze',
        example: 'A zephyr blew through the garden.',
        user_id: other,
    });
    assert.equal(created.status, 200);
    assert.equal(created.data.word, 'zephyr');
    assert(!created.data.user_id);
    const customId = created.data.id;
    assert.match(customId, /^pv-custom-[a-f0-9]{16}$/);
    assert.equal((await call()).data.words[0].id, customId);
    assert.equal(
        (await call('/' + customId, 'PUT', { completed_rounds: 1, expected_revision: 0 })).status,
        200,
    );
    assert.equal(
        (await call()).data.progress.find((p) => p.word_id === customId).completed_rounds,
        1,
    );
    const isolated = (
        await f.pool.query("SELECT app_priority_vocabulary($1,'load') AS result", [other])
    ).rows[0].result;
    assert.deepEqual(isolated.words, []);
    await assert.rejects(
        () =>
            f.pool.query("SELECT app_priority_vocabulary($1,'save',$2,$3::jsonb)", [
                other,
                customId,
                JSON.stringify({ completed_rounds: 1, expected_revision: 0 }),
            ]),
        /Unknown vocabulary word/,
    );
});
