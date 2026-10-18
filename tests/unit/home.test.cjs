const test = require('node:test'),
    assert = require('node:assert/strict');
test('news parser accepts publisher links only, preserves headline text and orders by date', async () => {
    const { parseNews, loadNews } = await import('../../apps/web/src/domain/home-news.js');
    const item = (title, link, date) =>
        `<item><title><![CDATA[${title}]]></title><link>${link}</link><pubDate>${date}</pubDate></item>`;
    const xml =
        '<rss>' +
        item('Old &amp; useful', 'https://vnexpress.net/one', 'Sun, 18 Oct 2026 08:00:00 +0700') +
        item('New headline', 'https://vnexpress.net/two', 'Sun, 18 Oct 2026 09:00:00 +0700') +
        item('unsafe', 'javascript:alert(1)', 'Sun, 18 Oct 2026 10:00:00 +0700') +
        '</rss>';
    const rows = parseNews(xml);
    assert.equal(rows.length, 2);
    assert.equal(rows[0].title, 'New headline');
    assert.equal(rows[1].title, 'Old & useful');
    assert.equal(parseNews('<rss>unavailable</rss>').length, 0);
    await assert.rejects(
        loadNews('forged', () => {
            throw Error('must not fetch');
        }),
        /Invalid news category/,
    );
});
test('hosted Home binds tasks to authenticated user, validates input and forwards conflicts', async () => {
    const { homeApi } = await import('../../supabase/functions/app-api/home.ts');
    const { homeRequest } = await import('../../apps/web/src/domain/home.js');
    assert.throws(() => homeRequest('/api/home/todos', 'POST', { title: ' ' }), /Task must/);
    assert.throws(
        () => homeRequest('/api/home/preferences', 'PUT', { city: null, news_category: 'invalid' }),
        /Invalid news/,
    );
    let calls = [];
    const admin = {
        rpc: async (name, args) => {
            calls.push({ name, args });
            return { data: { id: 'saved' } };
        },
    };
    await homeApi(
        admin,
        { id: 'me' },
        '/api/home/todos',
        'POST',
        { title: 'Task', user_id: 'other' },
        new URL('http://local'),
    );
    assert.equal(calls[0].args.p_user, 'me');
    assert.deepEqual(calls[0].args.p_payload, { title: 'Task' });
    const result = await homeApi(
        { rpc: async () => ({ error: { code: '40001', message: 'changed' } }) },
        { id: 'me' },
        '/api/home/todos/12345678-1234-4234-8234-123456789abc',
        'PUT',
        { version: 1, completed: true },
        new URL('http://local'),
    ).catch((e) => e);
    assert.equal(result.status, 409);
});

test('RSS summaries strip images/scripts, decode entities and keep only four stories', async () => {
    const { parseNews } = await import('../../apps/web/src/domain/home-news.js');
    const xml =
        '<rss>' +
        Array.from(
            { length: 8 },
            (_, i) =>
                `<item><title>Story ${i}</title><link>https://vnexpress.net/story-${i}</link><pubDate>Sun, 18 Oct 2026 0${i}:00:00 +0700</pubDate><description><![CDATA[<a href="https://vnexpress.net/"><img src="image.jpg" /></a><br/>A short &amp; useful &#273;escription.<script>alert(1)</script>]]></description></item>`,
        ).join('') +
        '</rss>';
    const rows = parseNews(xml);
    assert.equal(rows.length, 4);
    assert.equal(rows[0].summary, 'A short & useful đescription.');
    assert.equal(rows[0].title, 'Story 7');
    assert.ok(rows.every((row) => !row.summary.includes('<') && !row.summary.includes('alert')));
});
test('forecast shows tomorrow and the following two days, excluding today', async () => {
    const { forecastDays } = await import('../../apps/web/src/features/home/home-weather.js');
    const days = forecastDays({
        time: ['2026-10-18', '2026-10-19', '2026-10-20', '2026-10-21'],
        temperature_2m_min: [20, 21, 22, 23],
        temperature_2m_max: [28, 29, 30, 31],
        weather_code: [0, 1, 2, 3],
        precipitation_probability_max: [10, 20, 30, 40],
    });
    assert.deepEqual(
        days.map((d) => d.date),
        ['2026-10-19', '2026-10-20', '2026-10-21'],
    );
    assert.equal(days[0].low, 21);
    assert.equal(days[2].rain, 40);
    assert.deepEqual(forecastDays(null), []);
});
