const test = require('node:test');
const assert = require('node:assert/strict');
const { createTestDatabase } = require('../helpers/test-database.cjs');
const { createApp } = require('../../apps/api/app');
const { hashPassword } = require('../../apps/api/modules/auth/local-auth');
const png =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/c1sAAAAASUVORK5CYII=';
test('Notes and image privacy, publication snapshots, version conflicts and unpublish work across accounts', async (t) => {
    const fixture = await createTestDatabase();
    const server = createApp({ database: fixture.pool }).listen(0, '127.0.0.1');
    await new Promise((resolve) => server.once('listening', resolve));
    t.after(async () => {
        await new Promise((resolve) => server.close(resolve));
        await fixture.cleanup();
    });
    const base = 'http://127.0.0.1:' + server.address().port;
    const second = (
        await fixture.pool.query(
            "INSERT INTO public.users(username,name) VALUES('second-writer','Second Writer') RETURNING id",
        )
    ).rows[0].id;
    await fixture.pool.query(
        'INSERT INTO app_private.credentials(user_id,password_hash) VALUES($1,$2)',
        [second, hashPassword('second-password')],
    );
    async function login(username, password) {
        const r = await fetch(base + '/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        assert.equal(r.status, 200);
        return r.headers.get('set-cookie').split(';')[0];
    }
    const alice = await login('test-learner', 'test-password'),
        bob = await login('second-writer', 'second-password');
    async function request(cookie, path, method = 'GET', body, status = 200) {
        const r = await fetch(base + path, {
            method,
            headers: { 'Content-Type': 'application/json', Cookie: cookie },
            ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
        });
        const value = await r.json();
        assert.equal(r.status, status, JSON.stringify(value));
        return value;
    }
    assert.equal((await fetch(base + '/api/notes')).status, 401);
    assert.equal((await fetch(base + '/api/blog')).status, 401);
    let note = await request(
        alice,
        '/api/notes',
        'POST',
        { title: 'First note', body: 'Private first draft', tags: ['ideas'], user_id: second },
        201,
    );
    assert.equal(note.user_id, fixture.userId);
    assert.equal((await request(bob, '/api/notes')).items.length, 0);
    assert.equal((await request(bob, '/api/blog')).items.length, 0);
    for (const [path, method, body] of [
        ['/api/notes/' + note.id, 'GET'],
        ['/api/notes/' + note.id, 'PUT', { title: 'hacked', body: 'hacked', tags: [], version: 1 }],
        ['/api/notes/' + note.id + '/publish', 'POST', { version: 1 }],
        ['/api/notes/' + note.id + '?version=1', 'DELETE'],
    ])
        await request(bob, path, method, body, 404);
    const image1 = await request(
        alice,
        '/api/notes/assets',
        'POST',
        { note_id: note.id, mime_type: 'image/png', data_base64: png },
        201,
    );
    await request(bob, '/api/notes/assets/' + image1.id, 'GET', undefined, 404);
    await request(
        bob,
        '/api/notes/assets',
        'POST',
        { note_id: note.id, mime_type: 'image/png', data_base64: png },
        404,
    );
    note = await request(alice, '/api/notes/' + note.id, 'PUT', {
        title: 'First post',
        body: `Published content\n![Image](note-asset:${image1.id})`,
        tags: ['ideas'],
        version: note.version,
    });
    await request(
        alice,
        '/api/notes/' + note.id + '/publish',
        'POST',
        { version: note.version },
        201,
    );
    const publicFirst = await request(bob, '/api/blog/' + note.id);
    assert.equal(publicFirst.body, note.body);
    assert.equal(publicFirst.author_id, fixture.userId);
    assert.equal((await request(bob, '/api/blog')).items.length, 1);
    assert.equal((await request(bob, '/api/notes/assets/' + image1.id)).mime_type, 'image/png');
    const image2 = await request(
        alice,
        '/api/notes/assets',
        'POST',
        { note_id: note.id, mime_type: 'image/png', data_base64: png },
        201,
    );
    const oldVersion = note.version;
    note = await request(alice, '/api/notes/' + note.id, 'PUT', {
        title: 'Private revision',
        body: `Unposted private changes\n![Private image](note-asset:${image2.id})`,
        tags: ['private'],
        version: note.version,
    });
    assert.equal((await request(bob, '/api/blog/' + note.id)).body, publicFirst.body);
    await request(bob, '/api/notes/assets/' + image2.id, 'GET', undefined, 404);
    await request(
        alice,
        '/api/notes/' + note.id + '/publish',
        'POST',
        { version: oldVersion },
        409,
    );
    await request(
        alice,
        '/api/notes/' + note.id,
        'PUT',
        { title: 'Stale write', body: 'stale', tags: [], version: oldVersion },
        409,
    );
    await request(
        alice,
        '/api/notes/' + note.id + '/publish',
        'POST',
        { version: note.version },
        201,
    );
    assert.equal((await request(bob, '/api/blog/' + note.id)).body, note.body);
    await request(bob, '/api/notes/assets/' + image1.id, 'GET', undefined, 404);
    await request(bob, '/api/notes/assets/' + image2.id);
    const list = await request(bob, '/api/blog?q=Private');
    assert.equal(list.items.length, 1);
    assert.equal('user_id' in list.items[0], false);
    assert.equal((await request(alice, '/api/notes?status=posted')).items.length, 1);
    assert.equal((await request(alice, '/api/notes?status=private')).items.length, 0);
    assert.equal((await request(alice, '/api/notes?q=%25')).items.length, 0);
    await request(
        alice,
        '/api/notes/' + note.id + '/unpublish',
        'POST',
        { version: note.version },
        201,
    );
    await request(bob, '/api/blog/' + note.id, 'GET', undefined, 404);
    await request(bob, '/api/notes/assets/' + image2.id, 'GET', undefined, 404);
    assert.equal((await request(alice, '/api/notes/' + note.id)).body, note.body);
    const another = await request(
        alice,
        '/api/notes',
        'POST',
        { title: 'Other private note', body: 'secret', tags: [] },
        201,
    );
    const foreignImage = await request(
        alice,
        '/api/notes/assets',
        'POST',
        { note_id: another.id, mime_type: 'image/png', data_base64: png },
        201,
    );
    note = await request(alice, '/api/notes/' + note.id, 'PUT', {
        title: 'Wrong asset',
        body: `![Not this note](note-asset:${foreignImage.id})`,
        tags: [],
        version: note.version,
    });
    await request(
        alice,
        '/api/notes/' + note.id + '/publish',
        'POST',
        { version: note.version },
        400,
    );
    await request(
        alice,
        '/api/notes/' + note.id + '?version=' + oldVersion,
        'DELETE',
        undefined,
        409,
    );
    await request(alice, '/api/notes/' + note.id + '?version=' + note.version, 'DELETE');
    await request(alice, '/api/notes/' + note.id, 'GET', undefined, 404);
    await request(alice, '/api/notes/assets/' + image1.id, 'GET', undefined, 404);
    const empty = await request(
        alice,
        '/api/notes',
        'POST',
        { title: '', body: '', tags: [] },
        201,
    );
    await request(
        alice,
        '/api/notes/' + empty.id + '/publish',
        'POST',
        { version: empty.version },
        400,
    );
});
