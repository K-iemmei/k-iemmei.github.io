const test = require('node:test'),
    assert = require('node:assert/strict');
const { createTestDatabase } = require('../helpers/test-database.cjs');
const { createDevelopmentApp } = require('../../apps/api/development-server');
test('Home tasks and settings persist per account; edits, pins and completion reject stale versions', async (t) => {
    const f = await createTestDatabase();
    t.after(() => f.cleanup());
    const server = createDevelopmentApp({ database: f.pool }).listen(0, '127.0.0.1');
    await new Promise((r) => server.once('listening', r));
    t.after(() => new Promise((r) => server.close(r)));
    const base = 'http://127.0.0.1:' + server.address().port;
    assert.equal((await fetch(base + '/api/home')).status, 401);
    const login = await fetch(base + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'test-learner', password: 'test-password' }),
    });
    const headers = {
        'Content-Type': 'application/json',
        Cookie: login.headers.get('set-cookie').split(';')[0],
    };
    const req = (path, method = 'GET', body) =>
        fetch(base + '/api/home' + path, {
            method,
            headers,
            ...(body ? { body: JSON.stringify(body) } : {}),
        });
    assert.deepEqual((await (await req('')).json()).todos, []);
    assert.equal((await req('/todos', 'POST', { title: '   ' })).status, 400);
    const created = await req('/todos', 'POST', { title: '  Read today  ', user_id: 'forged' });
    assert.equal(created.status, 201);
    const task = await created.json();
    assert.equal(task.title, 'Read today');
    assert.equal(task.pinned, true);
    assert.equal(task.user_id, undefined);
    const done = await req('/todos/' + task.id, 'PUT', {
        version: 1,
        completed: true,
        pinned: false,
        title: 'Read and review',
    });
    assert.equal(done.status, 200);
    assert.equal((await done.json()).version, 2);
    assert.equal(
        (await req('/todos/' + task.id, 'PUT', { version: 1, title: 'stale' })).status,
        409,
    );
    const other = (await f.pool.query("INSERT INTO users(name) VALUES('Other') RETURNING id"))
        .rows[0].id;
    const privateTask = (
        await f.pool.query(
            "INSERT INTO home_todos(user_id,title) VALUES($1,'Private task') RETURNING id",
            [other],
        )
    ).rows[0].id;
    assert.equal(
        (await req('/todos/' + privateTask, 'PUT', { version: 1, title: 'steal' })).status,
        404,
    );
    assert.equal((await req('/todos/' + privateTask, 'DELETE', { version: 1 })).status, 404);
    const prefs = {
        city: { name: 'Hà Nội', latitude: 21.0285, longitude: 105.8542 },
        news_category: 'technology',
    };
    assert.equal((await req('/preferences', 'PUT', prefs)).status, 200);
    const loaded = await (await req('')).json();
    assert.equal(loaded.todos.length, 1);
    assert.equal(loaded.todos[0].completed, true);
    assert.equal(loaded.todos[0].pinned, false);
    assert.equal(loaded.todos[0].title, 'Read and review');
    assert.deepEqual(loaded.preferences, prefs);
    assert.equal(
        (await req('/preferences', 'PUT', { ...prefs, news_category: 'football' })).status,
        200,
    );
    assert.equal((await (await req('')).json()).preferences.news_category, 'football');
    assert.equal((await req('/football?league=invalid')).status, 400);
    assert.equal((await fetch(base + '/api/home/football')).status, 401);
    assert.equal(
        (await req('/preferences', 'PUT', { ...prefs, city: { ...prefs.city, latitude: 999 } }))
            .status,
        400,
    );
    assert.equal((await req('/todos/' + task.id, 'DELETE', { version: 2 })).status, 200);
    assert.equal((await (await req('')).json()).todos.length, 0);
});
