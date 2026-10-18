const test = require('node:test'),
    assert = require('node:assert/strict');
const fs = require('node:fs');
function storage() {
    const values = new Map();
    return {
        getItem: (k) => values.get(k) ?? null,
        setItem: (k, v) => values.set(k, String(v)),
        removeItem: (k) => values.delete(k),
        get length() {
            return values.size;
        },
    };
}
test('public feed cache coalesces requests, expires, refreshes and never caches failures', async (t) => {
    const original = global.sessionStorage;
    const data = {};
    global.sessionStorage = {
        getItem: (k) => data[k] ?? null,
        setItem: (k, v) => (data[k] = v),
        removeItem: (k) => delete data[k],
        key: (index) => Object.keys(data)[index] ?? null,
        get length() {
            return Object.keys(data).length;
        },
    };
    t.after(() => (global.sessionStorage = original));
    const { cachedLoad, readCache, writeCache, clearPreferenceCache } =
        await import('../../apps/web/src/core/page-cache.js');
    let calls = 0;
    const loader = async () => {
        calls++;
        await new Promise((r) => setTimeout(r, 10));
        return { count: calls };
    };
    const results = await Promise.all([
        cachedLoad('feed', loader, { maxAge: 1000 }),
        cachedLoad('feed', loader, { maxAge: 1000 }),
    ]);
    assert.equal(calls, 1);
    assert.deepEqual(results[0], results[1]);
    await cachedLoad('feed', loader, { maxAge: 1000 });
    assert.equal(calls, 1);
    await cachedLoad('feed', loader, { maxAge: 1000, force: true });
    assert.equal(calls, 2);
    await cachedLoad('feed', loader, { maxAge: 0 });
    assert.equal(calls, 3);
    await assert.rejects(
        cachedLoad(
            'failed',
            async () => {
                throw Error('offline');
            },
            { maxAge: 1000 },
        ),
        /offline/,
    );
    assert.equal(readCache('failed', 1000), null);
    writeCache('home-preferences:user-a', { city: 'A' });
    writeCache('home-preferences:user-b', { city: 'B' });
    assert.equal(readCache('home-preferences:user-c', 1000), null);
    clearPreferenceCache();
    assert.equal(readCache('home-preferences:user-a', 1000), null);
    assert.notEqual(readCache('feed', 1000), null);
    global.sessionStorage = {
        getItem() {
            throw Error('blocked');
        },
        setItem() {
            throw Error('blocked');
        },
    };
    assert.deepEqual(await cachedLoad('blocked', async () => ({ ok: true }), { maxAge: 1000 }), {
        ok: true,
    });
});
test('parallel cloud requests refresh an expired token only once; transient auth failures retain session', async (t) => {
    const oldStorage = global.localStorage,
        oldFetch = global.fetch;
    global.localStorage = storage();
    t.after(() => {
        global.localStorage = oldStorage;
        global.fetch = oldFetch;
    });
    localStorage.setItem(
        'my_note_supabase_session',
        JSON.stringify({ access_token: 'old', refresh_token: 'refresh', expires_at: 1 }),
    );
    let calls = 0;
    global.fetch = async () => {
        calls++;
        await new Promise((r) => setTimeout(r, 10));
        return new Response(
            JSON.stringify({
                access_token: 'new',
                refresh_token: 'next',
                expires_at: Date.now() / 1000 + 3600,
            }),
            { status: 200 },
        );
    };
    const source = fs
        .readFileSync('apps/web/src/core/supabase-session.js', 'utf8')
        .replace(
            "import { deployment } from './deployment-config.js';",
            "const deployment={url:'https://test.supabase.co',anonKey:'public-test'};",
        );
    const api = await import(
        'data:text/javascript;base64,' + Buffer.from(source).toString('base64')
    );
    assert.deepEqual(await Promise.all([api.cloudToken(), api.cloudToken(), api.cloudToken()]), [
        'new',
        'new',
        'new',
    ]);
    assert.equal(calls, 1);
    global.fetch = async () => new Response('{}', { status: 503 });
    await assert.rejects(api.cloudUser(), /temporarily unavailable/);
    assert.notEqual(localStorage.getItem('my_note_supabase_session'), null);
});
