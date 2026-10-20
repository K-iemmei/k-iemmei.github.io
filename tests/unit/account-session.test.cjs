const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const key = 'my_note_supabase_session';
const session = (id) => ({
    user: { id },
    access_token: 'token-' + id,
    refresh_token: 'refresh-' + id,
    expires_at: Date.now() / 1000 + 3600,
});
async function fixture(t, name, initial, fetcher) {
    const previous = { storage: global.localStorage, fetch: global.fetch };
    const values = new Map([[key, JSON.stringify(initial)]]);
    global.localStorage = {
        getItem: (k) => values.get(k) ?? null,
        setItem: (k, v) => values.set(k, v),
        removeItem: (k) => values.delete(k),
    };
    global.fetch =
        fetcher ||
        (() => {
            throw Error('Unexpected network request');
        });
    t.after(() => {
        global.localStorage = previous.storage;
        global.fetch = previous.fetch;
    });
    const source = fs
        .readFileSync('apps/web/src/core/supabase-session.js', 'utf8')
        .replace(
            "import { deployment } from './deployment-config.js';",
            "const deployment={url:'https://test.supabase.co',anonKey:'public-test'};",
        );
    return import(
        'data:text/javascript;base64,' + Buffer.from(source + '\n// ' + name).toString('base64')
    );
}
test('tokens follow shared storage changes and cross-tab logout instead of an old memory cache', async (t) => {
    const api = await fixture(t, 'read storage', session('A'));
    assert.equal(await api.cloudToken(), 'token-A');
    localStorage.setItem(key, JSON.stringify(session('B')));
    assert.equal(await api.cloudToken(), 'token-B');
    localStorage.removeItem(key);
    assert.equal(await api.cloudToken(), null);
});
test('a page verified for A cannot submit using B after another tab switches accounts', async (t) => {
    const api = await fixture(
        t,
        'pin account',
        session('A'),
        async () => new Response(JSON.stringify({ id: 'A', email: 'a@example.test' })),
    );
    assert.equal((await api.cloudUser()).id, 'A');
    localStorage.setItem(key, JSON.stringify(session('B')));
    await assert.rejects(api.cloudToken(), { code: 'ACCOUNT_CHANGED' });
    assert.equal(JSON.parse(localStorage.getItem(key)).user.id, 'B');
});
test('a delayed refresh for A cannot overwrite the new B session', async (t) => {
    let release;
    const api = await fixture(
        t,
        'late refresh',
        { ...session('A'), expires_at: 1 },
        () =>
            new Promise((resolve) => {
                release = resolve;
            }),
    );
    const pending = api.cloudToken();
    localStorage.setItem(key, JSON.stringify(session('B')));
    release(new Response(JSON.stringify(session('A'))));
    assert.equal(await pending, null);
    assert.equal(JSON.parse(localStorage.getItem(key)).user.id, 'B');
});
test('a delayed account check cannot restore a signed-out account or clear a new account', async (t) => {
    let release;
    const api = await fixture(
        t,
        'late user',
        session('A'),
        () =>
            new Promise((resolve) => {
                release = resolve;
            }),
    );
    const pending = api.cloudUser();
    await new Promise((resolve) => setImmediate(resolve));
    localStorage.setItem(key, JSON.stringify(session('B')));
    release(new Response('{}', { status: 403 }));
    await assert.rejects(pending, { code: 'ACCOUNT_CHANGED' });
    assert.equal(JSON.parse(localStorage.getItem(key)).user.id, 'B');
});
