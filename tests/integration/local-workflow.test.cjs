const test = require('node:test');
const assert = require('node:assert/strict');
const { createTestDatabase } = require('../helpers/test-database.cjs');
const { createDevelopmentApp } = require('../../apps/api/development-server');
const { manualReading } = require('../helpers/reading-fixture.cjs');
const { migrate } = require('../../tools/database/migrate.cjs');
const { seed } = require('../../tools/database/seed.cjs');
test('login-first, manual authoring, server grading, versioning and session revocation', async (t) => {
    const fixture = await createTestDatabase();
    const server = createDevelopmentApp({
        database: {
            query: (...args) => fixture.pool.query(...args),
            connect: () => fixture.pool.connect(),
        },
    }).listen(0, '127.0.0.1');
    await new Promise((resolve) => server.once('listening', resolve));
    t.after(async () => {
        await new Promise((resolve) => server.close(resolve));
        await fixture.cleanup();
    });
    const base = 'http://127.0.0.1:' + server.address().port;
    assert.match(await (await fetch(base + '/')).text(), /data-page="login"/);
    for (const page of ['dashboard.html', 'home.html', 'admin.html', 'english.html']) {
        const response = await fetch(base + '/' + page, { redirect: 'manual' });
        assert.equal(response.status, 302);
        assert.equal(response.headers.get('location'), '/index.html');
    }
    const login = await fetch(base + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'test-learner', password: 'test-password' }),
    });
    assert.equal(login.status, 200);
    assert.ok(login.headers.get('set-cookie').includes('HttpOnly'));
    const profile = await login.json();
    assert.equal(profile.token, undefined);
    assert.equal(profile.password_hash, undefined);
    const headers = {
        'Content-Type': 'application/json',
        Cookie: login.headers.get('set-cookie').split(';')[0],
    };
    const request = (path, method = 'GET', body) =>
        fetch(base + path, { method, headers, ...(body ? { body: JSON.stringify(body) } : {}) });
    assert.equal((await request('/dashboard.html')).status, 200);
    assert.equal(
        (await fixture.pool.query('SELECT count(*)::int n FROM reading_tests')).rows[0].n,
        0,
    );
    const author = manualReading();
    const created = await request('/api/reading/author/tests', 'POST', author);
    assert.equal(created.status, 201);
    const row = await created.json();
    assert.equal((await request('/api/reading/author/tests', 'POST', author)).status, 409);
    const detail = await (await request('/api/tests/' + author.slug)).json();
    assert.equal(detail.passages.length, 2);
    assert.equal(detail.passages[0].groups.length, 10);
    assert.ok(!JSON.stringify(detail).includes('answer_key'));
    assert.ok(!JSON.stringify(detail).includes('explanation'));
    assert.equal((await request('/api/data/reading_questions')).status, 404);
    const full = await (await request('/api/reading/author/tests/' + row.id)).json();
    const responses = {};
    let count = 0;
    for (const p of full.passages)
        for (const g of p.groups)
            for (const q of g.questions) {
                responses[q.id] =
                    q.answer_key.match === 'all' ? q.answer_key.answers : q.answer_key.answers[0];
                count++;
            }
    const submit = await request('/api/tests/' + author.slug + '/attempts', 'POST', {
        version: detail.version,
        responses,
        score_percent: 0,
    });
    assert.equal(submit.status, 201);
    const result = await submit.json();
    assert.equal(Number(result.score_percent), 100);
    assert.equal(result.total_count, count);
    const library = async () =>
        (await (await request('/api/tests')).json()).find((test) => test.id === row.id);
    assert.equal(Number((await library()).best_score_percent), 100);
    await request('/api/tests/' + author.slug + '/attempts', 'POST', {
        version: detail.version,
        responses: {},
    });
    assert.equal(Number((await library()).best_score_percent), 100);
    assert.equal(
        (await (await request('/api/tests/' + author.slug + '/attempts')).json()).length,
        2,
    );
    const invalid = { ...author, passages: [] };
    assert.equal(
        (
            await request('/api/reading/author/tests/' + row.id, 'PUT', {
                ...invalid,
                version: row.version,
            })
        ).status,
        400,
    );
    assert.equal(
        (
            await request('/api/reading/author/tests/' + row.id, 'PUT', {
                ...author,
                version: row.version,
            })
        ).status,
        200,
    );
    assert.equal(
        (
            await request('/api/tests/' + author.slug + '/attempts', 'POST', {
                version: detail.version,
                responses,
            })
        ).status,
        409,
    );
    assert.equal(
        (await (await request('/api/tests/' + author.slug + '/attempts')).json())[0].review.length,
        count,
    );
    await migrate(fixture.options);
    await seed(fixture.options);
    assert.equal(
        (await fixture.pool.query('SELECT count(*)::int n FROM reading_tests')).rows[0].n,
        1,
    );
    const { importReading } = require('../../tools/database/import-reading.cjs');
    const draft = manualReading('imported-draft');
    draft.status = 'draft';
    for (const p of draft.passages)
        for (const g of p.groups) for (const q of g.questions) q.answer_key.answers = [];
    const imported = await importReading([draft], { database: fixture.pool, userId: profile.id });
    assert.equal(imported[0].action, 'created');
    assert.equal(
        (await importReading([draft], { database: fixture.pool, userId: profile.id }))[0].action,
        'skipped-existing',
    );
    const draftDetail = await (await request('/api/tests/' + draft.slug)).json();
    assert.equal(draftDetail.ungraded_count, 12);
    const ungradedResponse = await request('/api/tests/' + draft.slug + '/attempts', 'POST', {
        version: draftDetail.version,
        responses: {},
    });
    assert.equal(ungradedResponse.status, 201);
    const ungraded = await ungradedResponse.json();
    assert.equal(ungraded.graded_count, 0);
    assert.equal(ungraded.correct_count, 0);
    assert.equal(ungraded.score_percent, null);
    assert.equal(
        (
            await request('/api/reading/author/tests/' + imported[0].id, 'PUT', {
                ...draft,
                status: 'published',
                version: 1,
            })
        ).status,
        400,
    );
    await fixture.pool.query("UPDATE reading_tests SET status='archived' WHERE id=$1", [row.id]);
    assert.ok(!(await (await request('/api/tests')).json()).some((test) => test.id === row.id));
    assert.ok(
        (await (await request('/api/reading/author/tests')).json()).some(
            (test) => test.id === row.id,
        ),
    );
    assert.equal((await request('/api/tests/' + author.slug)).status, 200);
    assert.equal(
        (await (await request('/api/tests/' + author.slug + '/attempts')).json()).length,
        2,
    );
    await request('/api/auth/logout', 'POST');
    assert.equal((await request('/api/auth/session')).status, 401);
    const expired = await fetch(base + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'test-learner', password: 'test-password' }),
    });
    await fixture.pool.query(
        "UPDATE app_private.sessions SET expires_at=now()-interval '1 second'",
    );
    assert.equal(
        (
            await fetch(base + '/api/auth/session', {
                headers: { Cookie: expired.headers.get('set-cookie').split(';')[0] },
            })
        ).status,
        401,
    );
});
