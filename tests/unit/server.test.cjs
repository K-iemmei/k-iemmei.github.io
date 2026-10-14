const test = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../../apps/api/app');
test('unauthenticated APIs cannot read content, keys or author tests', async (t) => {
    const server = createApp({
        database: {
            query: async () => {
                throw new Error('No DB access should occur');
            },
        },
    }).listen(0, '127.0.0.1');
    await new Promise((resolve) => server.once('listening', resolve));
    t.after(() => new Promise((resolve) => server.close(resolve)));
    const base = 'http://127.0.0.1:' + server.address().port;
    assert.equal((await fetch(base + '/health')).status, 200);
    for (const route of ['/api/tests', '/api/reading/author/tests', '/api/data/reading_questions'])
        assert.equal((await fetch(base + route)).status, 401);
});
