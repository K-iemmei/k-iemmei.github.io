const test = require('node:test'),
    assert = require('node:assert/strict');
const { createTestDatabase } = require('../helpers/test-database.cjs');
const { createApp } = require('../../apps/api/app');
test('Blog searches published snapshots by title, tag and author in publication order across pages', async (t) => {
    const fixture = await createTestDatabase();
    const server = createApp({ database: fixture.pool }).listen(0, '127.0.0.1');
    await new Promise((r) => server.once('listening', r));
    t.after(async () => {
        server.closeAllConnections();
        await new Promise((r) => server.close(r));
        await fixture.cleanup();
    });
    const base = 'http://127.0.0.1:' + server.address().port;
    const login = await fetch(base + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'test-learner', password: 'test-password' }),
    });
    const headers = { Cookie: login.headers.get('set-cookie').split(';')[0] };
    async function list(query = '', status = 200) {
        const response = await fetch(base + '/api/blog' + query, { headers });
        assert.equal(response.status, status);
        return response.json();
    }
    assert.equal((await fetch(base + '/api/blog')).status, 401);
    const other = (
        await fixture.pool.query("INSERT INTO users(name) VALUES ('Ada Reader') RETURNING id")
    ).rows[0].id;
    async function post(owner, title, tags, date) {
        const note = (
            await fixture.pool.query("SELECT app_notes_api($1,'save',NULL,$2::jsonb) AS result", [
                owner,
                JSON.stringify({ title, body: 'Gamma body content', tags }),
            ])
        ).rows[0].result;
        if (date) {
            await fixture.pool.query("SELECT app_notes_api($1,'publish',$2,$3::jsonb)", [
                owner,
                note.id,
                JSON.stringify({ version: note.version }),
            ]);
            await fixture.pool.query('UPDATE blog_posts SET published_at=$2 WHERE note_id=$1', [
                note.id,
                date,
            ]);
        }
        return note;
    }
    const a = await post(fixture.userId, 'Alpha title', ['beta'], '2026-10-01T00:00:00Z');
    const b = await post(fixture.userId, 'Beta title', ['alpha'], '2026-10-03T00:00:00Z');
    const c = await post(other, 'Gamma title', ['misc'], '2026-10-02T00:00:00Z');
    const literal = await post(other, '100% sure_under_score', ['literal'], '2026-09-30T00:00:00Z');
    await post(fixture.userId, 'Private Alpha', ['alpha'], null);
    assert.deepEqual(
        (await list()).items.map((p) => p.id),
        [b.id, c.id, a.id, literal.id],
    );
    assert.deepEqual(
        (await list('?q=ALPHA&field=title')).items.map((p) => p.id),
        [a.id],
    );
    assert.deepEqual(
        (await list('?q=ALPHA&field=tag')).items.map((p) => p.id),
        [b.id],
    );
    assert.deepEqual(
        (await list('?q=Ada&field=author')).items.map((p) => p.id),
        [c.id, literal.id],
    );
    assert.deepEqual(
        (await list('?q=%25&field=title')).items.map((p) => p.id),
        [literal.id],
    );
    assert.deepEqual(
        (await list('?q=_&field=title')).items.map((p) => p.id),
        [literal.id],
    );
    await fixture.pool.query("SELECT app_notes_api($1,'save',$2,$3::jsonb)", [
        fixture.userId,
        a.id,
        JSON.stringify({
            title: 'Hidden private edit',
            body: 'Private draft',
            tags: ['hidden'],
            version: a.version,
        }),
    ]);
    assert.equal((await list('?q=Hidden&field=title')).items.length, 0);
    assert.equal((await list('?q=Alpha&field=title')).items.length, 1);
    for (let i = 0; i < 25; i++)
        await post(other, 'Older article ' + i, ['archive'], '2020-01-01T00:00:00Z');
    const first = await list(),
        second = await list('?page=2');
    assert.equal(first.items.length, 24);
    assert.equal(first.has_more, true);
    assert.equal(second.items.length, 5);
    assert.equal(second.has_more, false);
    assert.equal(new Set([...first.items, ...second.items].map((p) => p.id)).size, 29);
    assert.deepEqual(
        first.items.slice(0, 4).map((p) => p.id),
        [b.id, c.id, a.id, literal.id],
    );
    await list('?field=owner', 400);
    await list('?page=0', 400);
    await list('?q=' + 'a'.repeat(101), 400);
    await fixture.pool.query("SELECT app_notes_api($1,'unpublish',$2,$3::jsonb)", [
        fixture.userId,
        b.id,
        JSON.stringify({ version: b.version }),
    ]);
    assert.equal((await list('?q=alpha&field=tag')).items.length, 0);
});
