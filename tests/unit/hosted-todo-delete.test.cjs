const test = require('node:test');
const assert = require('node:assert/strict');
test('hosted DELETE preserves the task revision and authenticated owner through the real body parser', async () => {
    const { readApiBody } = await import('../../supabase/functions/app-api/request-body.ts');
    const { homeApi } = await import('../../supabase/functions/app-api/home.ts');
    const path = '/api/home/todos/12345678-1234-4234-8234-123456789abc';
    const req = new Request('https://example.test' + path, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ version: 3, user_id: 'forged' }),
    });
    const body = await readApiBody(req, path);
    let args;
    const result = await homeApi(
        {
            rpc: async (name, payload) => {
                assert.equal(name, 'app_home_api');
                args = payload;
                return { data: { deleted: true } };
            },
        },
        { id: 'real-user' },
        path,
        'DELETE',
        body,
        new URL(req.url),
    );
    assert.deepEqual(args, {
        p_user: 'real-user',
        p_action: 'delete',
        p_id: path.split('/').pop(),
        p_payload: { version: 3 },
    });
    assert.deepEqual(result, { deleted: true });
    assert.equal(
        await readApiBody(
            new Request('https://example.test/api/notes/x?version=2', { method: 'DELETE' }),
            '/api/notes/x',
        ),
        null,
    );
    const edit = new Request('https://example.test' + path, {
        method: 'PUT',
        body: JSON.stringify({ title: 'Updated', version: 3 }),
    });
    assert.deepEqual(await readApiBody(edit, path), { title: 'Updated', version: 3 });
    const upload = new Request('https://example.test/api/vocabulary/import-apkg', {
        method: 'POST',
        body: 'raw file',
    });
    assert.equal(await readApiBody(upload, '/api/vocabulary/import-apkg'), null);
});
