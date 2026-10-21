const test = require('node:test'),
    assert = require('node:assert/strict');
const entry = (id, rank, points) => ({
    team: { id, displayName: 'Club ' + id },
    stats: Object.entries({
        rank,
        points,
        gamesPlayed: 3,
        wins: 2,
        ties: 1,
        losses: 0,
        pointDifferential: 4,
    }).map(([name, value]) => ({ name, value })),
});
const data = {
    season: { displayName: '2026-27' },
    children: [{ standings: { entries: [entry('2', 2, 7), entry('1', 1, 9)] } }],
};
test('standings preserve publisher rank and validate complete single-league data', async () => {
    const { parseStandings, loadStandings } =
        await import('../../apps/web/src/domain/home-football.js');
    assert.deepEqual(
        parseStandings(data).teams.map((t) => t.id),
        ['1', '2'],
    );
    assert.throws(() => parseStandings({}), /incomplete/);
    assert.throws(
        () =>
            parseStandings({
                children: [{ standings: { entries: [entry('1', 1, 3), entry('2', 1, 3)] } }],
            }),
        /groups/,
    );
    await assert.rejects(
        loadStandings('evil', () => {
            throw Error('must not fetch');
        }),
        /Invalid football league/,
    );
    let calls = 0;
    const fetcher = async (url) => {
        calls++;
        assert.match(url, /soccer\/eng\.1\/standings$/);
        return { ok: true, json: async () => data };
    };
    const [a, b] = await Promise.all([
        loadStandings('eng.1', fetcher),
        loadStandings('eng.1', fetcher),
    ]);
    assert.equal(calls, 1);
    assert.deepEqual(a, b);
    assert.equal(a.stale, false);
    assert.equal(a.source, 'ESPN');
});
test('mixed news balances subjects, prioritizes football, and removes duplicate stories', async () => {
    const { mixNews, loadNews } = await import('../../apps/web/src/domain/home-news.js');
    const story = (id) => ({ title: id, url: 'https://vnexpress.net/' + id, summary: 'Summary' });
    const feeds = [
        'football',
        'world',
        'business',
        'technology',
        'health',
        'lifestyle',
        'science',
        'latest',
    ].map((category) => ({
        category,
        items: Array.from({ length: 8 }, (_, i) => story(category + i)),
    }));
    feeds[2].items.unshift(feeds[1].items[0]);
    const items = mixNews(feeds);
    assert.equal(items.length, 10);
    assert.equal(new Set(items.map((i) => i.url)).size, 10);
    assert.deepEqual(
        items.slice(0, 3).map((i) => i.title),
        ['football0', 'football1', 'football2'],
    );
    assert.ok(items.some((i) => i.title === 'science0'));
    const fetcher = async (url) => ({
        ok: true,
        text: async () =>
            '<rss><item><title>' +
            (url.includes('the-thao') ? 'Champions League ' : '') +
            url.split('/').pop() +
            '</title><link>https://vnexpress.net/' +
            url.split('/').pop() +
            '</link><pubDate>Wed, 21 Oct 2026 08:00:00 +0700</pubDate><description>News summary</description></item></rss>',
    });
    const news = await loadNews('latest', fetcher);
    assert.equal(news.items.length, 8);
    assert.equal(news.partial, false);
    assert.ok(news.items.some((i) => i.category === 'football'));
    assert.ok(news.items.every((i) => i.summary));
    const { homeRequest } = await import('../../apps/web/src/domain/home.js');
    assert.equal(
        homeRequest('/api/home/preferences', 'PUT', { city: null, news_category: 'football' })
            .payload.news_category,
        'football',
    );
});

test('football filtering excludes unrelated sports and accepts Vietnamese match news', async () => {
    const { isFootballNews } = await import('../../apps/web/src/domain/home-news.js');
    assert.equal(
        isFootballNews({ title: 'Sinner wins in tennis', summary: 'A strong result.' }),
        false,
    );
    assert.equal(
        isFootballNews({
            title: 'Liverpool progress in Champions League',
            summary: 'Match report.',
        }),
        true,
    );
    assert.equal(
        isFootballNews({
            title: 'Tranh luận về phạt đền',
            summary: 'Một bàn thắng bị hủy vì việt vị.',
        }),
        true,
    );
});
