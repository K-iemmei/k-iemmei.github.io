const test = require('node:test');
const assert = require('node:assert/strict');
const id = '12345678-1234-4234-8234-123456789abc';
test('Publishing requests bind only note data, validate revisions and restrict endpoint shapes', async () => {
    const { publishingRequest, cleanNote, publishingError } =
        await import('../../apps/web/src/domain/publishing.js');
    const value = cleanNote({
        title: ' Title ',
        body: 'Private content',
        tags: [' English ', 'english'],
        user_id: 'another-user',
    });
    assert.deepEqual(value, { title: 'Title', body: 'Private content', tags: ['english'] });
    const parsed = publishingRequest(
        '/api/notes/' + id + '/publish',
        'POST',
        { version: 3, user_id: 'other' },
        new URL('https://example.test/'),
    );
    assert.deepEqual(parsed, { action: 'publish', id, payload: { version: 3 } });
    assert.equal(
        publishingRequest('/api/blog', 'POST', {}, new URL('https://example.test/')),
        undefined,
    );
    assert.equal(
        publishingRequest(
            '/api/notes/' + id + '/other',
            'POST',
            {},
            new URL('https://example.test/'),
        ),
        undefined,
    );
    for (const version of [0, -1, null, '3.5', 2147483647])
        assert.throws(
            () =>
                publishingRequest(
                    '/api/notes/' + id + '/publish',
                    'POST',
                    { version },
                    new URL('https://example.test/'),
                ),
            { status: 400 },
        );
    assert.throws(
        () =>
            publishingRequest(
                '/api/notes/not-an-id',
                'GET',
                null,
                new URL('https://example.test/'),
            ),
        { status: 400 },
    );
    assert.throws(() => cleanNote({ title: 'x'.repeat(161), body: '', tags: [] }), { status: 400 });
    assert.throws(() => cleanNote({ title: '', body: 'x'.repeat(200001), tags: [] }), {
        status: 400,
    });
    assert.throws(() => cleanNote({ title: '', body: '', tags: ['x'.repeat(33)] }), {
        status: 400,
    });
    assert.equal(publishingError({ code: '40001', message: 'Changed' }).status, 409);
    assert.equal(publishingError({ code: 'P0002', message: 'Missing' }).status, 404);
});
test('Image uploads check file bytes, base64, MIME and size instead of trusting filenames', async () => {
    const { cleanImage, MAX_IMAGE_BYTES } = await import('../../apps/web/src/domain/publishing.js');
    const png =
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/c1sAAAAASUVORK5CYII=';
    assert.equal(cleanImage({ mime_type: 'image/png', data_base64: png }).mime_type, 'image/png');
    for (const data of [
        { mime_type: 'image/svg+xml', data_base64: btoa('<svg/>') },
        { mime_type: 'image/png', data_base64: btoa('<script>alert(1)</script>') },
        { mime_type: 'image/jpeg', data_base64: png },
        { mime_type: 'image/png', data_base64: 'not base64' },
    ])
        assert.throws(() => cleanImage(data), { status: 400 });
    const large = Buffer.alloc(MAX_IMAGE_BYTES + 1);
    large.set([137, 80, 78, 71, 13, 10, 26, 10]);
    assert.throws(
        () => cleanImage({ mime_type: 'image/png', data_base64: large.toString('base64') }),
        { status: 400 },
    );
});
test('Chart data has a finite, declarative schema without callbacks or user options', async () => {
    const { chartData } = await import('../../apps/web/src/domain/publishing.js');
    const clean = chartData({
        type: 'bar',
        title: 'Study',
        labels: ['Mon'],
        datasets: [{ label: 'Minutes', data: [25], onClick: 'alert(1)' }],
        options: { onClick: 'alert(1)' },
    });
    assert.deepEqual(clean, {
        type: 'bar',
        title: 'Study',
        labels: ['Mon'],
        datasets: [{ label: 'Minutes', data: [25] }],
    });
    for (const data of [
        { ...clean, type: 'script' },
        { ...clean, datasets: [{ data: [Infinity] }] },
        { ...clean, datasets: [{ data: [] }] },
        { ...clean, labels: [] },
    ])
        assert.throws(() => chartData(data), { status: 400 });
});
test('Hosted Notes gateway always passes authenticated user and maps database conflicts', async () => {
    const { publishingApi } = await import('../../supabase/functions/app-api/publishing.ts');
    const calls = [];
    const admin = {
        rpc: async (...args) => {
            calls.push(args);
            return { data: { id }, error: null };
        },
    };
    await publishingApi(
        admin,
        { id: 'real-user' },
        '/api/notes/' + id + '/publish',
        'POST',
        { version: 1, user_id: 'spoofed' },
        new URL('https://example.test/'),
    );
    assert.equal(calls[0][1].p_user, 'real-user');
    assert.equal(calls[0][1].p_action, 'publish');
    await assert.rejects(
        () =>
            publishingApi(
                { rpc: async () => ({ error: { code: '40001', message: 'Conflict' } }) },
                { id: 'real-user' },
                '/api/notes/' + id + '/publish',
                'POST',
                { version: 1 },
                new URL('https://example.test/'),
            ),
        { status: 409 },
    );
});

test('Blog search fields are validated and hosted listing remains bound to the authenticated reader', async () => {
    const { publishingRequest } = await import('../../apps/web/src/domain/publishing.js');
    const { publishingApi } = await import('../../supabase/functions/app-api/publishing.ts');
    assert.throws(
        () =>
            publishingRequest(
                '/api/blog',
                'GET',
                null,
                new URL('https://example.test/?field=owner'),
            ),
        { status: 400 },
    );
    for (const field of ['all', 'title', 'tag', 'author']) {
        const calls = [];
        const result = await publishingApi(
            {
                rpc: async (...args) => {
                    calls.push(args);
                    return { data: { items: [], has_more: false }, error: null };
                },
            },
            { id: 'reader' },
            '/api/blog',
            'GET',
            null,
            new URL('https://example.test/?field=' + field + '&q=English&page=2&user_id=other'),
        );
        assert.deepEqual(calls[0], [
            'app_blog_list',
            { p_user: 'reader', p_payload: { q: 'English', page: 2, status: 'all', field } },
        ]);
        assert.deepEqual(result.items, []);
    }
});
