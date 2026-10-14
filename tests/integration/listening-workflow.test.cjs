const test = require('node:test');
const assert = require('node:assert/strict');
const { createTestDatabase } = require('../helpers/test-database.cjs');
const { createDevelopmentApp } = require('../../apps/api/development-server');

test('Listening parts protect keys and transcripts, save exam and dictation attempts', async (t) => {
    const fixture = await createTestDatabase();
    await fixture.pool.query(`INSERT INTO public.listening_sessions
        (slug,book_number,test_number,part_number,title,question_text,first_question,last_question,transcript,answer_key,audio_filename)
        VALUES ('cambridge-20-test-1-part-1',20,1,1,'Cambridge 20 · Test 1 · Part 1','Complete (1) ... and (2) ...',1,10,'The blue train arrives today.','{"1":"blue","2":["train","a train"]}','0-cam20-test-1-part-1.mp3')`);
    const app = createDevelopmentApp({
        database: {
            query: (...args) => fixture.pool.query(...args),
            connect: () => fixture.pool.connect(),
        },
    });
    const server = app.listen(0, '127.0.0.1');
    await new Promise((resolve) => server.once('listening', resolve));
    t.after(async () => {
        await new Promise((resolve) => server.close(resolve));
        await fixture.cleanup();
    });
    const base = `http://127.0.0.1:${server.address().port}`;
    assert.equal((await fetch(base + '/api/listening')).status, 401);
    assert.equal(
        (await fetch(base + '/english-listening-library.html', { redirect: 'manual' })).status,
        302,
    );
    const login = await fetch(base + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'test-learner', password: 'test-password' }),
    });
    const headers = {
        'Content-Type': 'application/json',
        Cookie: login.headers.get('set-cookie').split(';')[0],
    };
    const request = (route, method = 'GET', body) =>
        fetch(base + route, { method, headers, ...(body ? { body: JSON.stringify(body) } : {}) });
    const list = await (await request('/api/listening')).json();
    assert.equal(list.length, 1);
    const slug = list[0].slug;
    const detail = await (await request(`/api/listening/${slug}`)).json();
    assert.ok(detail.question_text.includes('(1)'));
    assert.equal(detail.answer_key, undefined);
    assert.equal(detail.transcript, undefined);
    assert.equal((await (await request(`/api/listening/${slug}/audio-url`)).json()).url, null);
    const exam = await (
        await request(`/api/listening/${slug}/attempts`, 'POST', {
            mode: 'exam',
            responses: { 1: 'Blue', 2: 'train' },
        })
    ).json();
    assert.equal(exam.correct, 2);
    assert.equal(exam.graded, 2);
    assert.equal(exam.score, 100);
    const dictation = await (
        await request(`/api/listening/${slug}/attempts`, 'POST', {
            mode: 'dictation',
            text: 'The blue train arrives today',
        })
    ).json();
    assert.equal(dictation.score, 100);
    assert.match(dictation.transcript, /blue train/);
    assert.equal((await (await request(`/api/listening/${slug}/attempts`)).json()).length, 2);
});
