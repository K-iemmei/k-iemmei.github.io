const feeds = {
    latest: 'tin-moi-nhat',
    world: 'the-gioi',
    business: 'kinh-doanh',
    technology: 'so-hoa',
    football: 'the-thao',
    sports: 'the-thao',
    science: 'khoa-hoc',
    health: 'suc-khoe',
    lifestyle: 'doi-song',
    entertainment: 'giai-tri',
};
const labels = {
    latest: 'Latest',
    world: 'World',
    business: 'Business',
    technology: 'Technology',
    football: 'Football',
    sports: 'Sports',
    science: 'Science',
    health: 'Health',
    lifestyle: 'Lifestyle',
    entertainment: 'Entertainment',
};
const cache = new Map();
const pending = new Map();
export function isFootballNews(item) {
    return /bóng đá|ngoại hạng|champions league|europa league|la liga|serie a|bundesliga|ligue 1|v-league|world cup|quả bóng vàng|bóng vàng|bàn thắng|thủ môn|phạt đền|việt vị|lđbđ|\b(?:fifa|uefa|afc|vff|var|messi|ronaldo|haaland|mbappe|barca|barcelona|psg|arsenal|liverpool|chelsea|tottenham|man city|man utd|manchester|mourinho|guardiola|arteta|real madrid|bayern)\b/i.test(
        item.title + ' ' + item.summary,
    );
}
function text(value) {
    return value
        .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<[^>]*>/g, ' ')
        .replace(
            /&(?:amp|lt|gt|quot|apos|#39);/g,
            (s) =>
                ({
                    '&amp;': '&',
                    '&lt;': '<',
                    '&gt;': '>',
                    '&quot;': '"',
                    '&apos;': "'",
                    '&#39;': "'",
                })[s],
        )
        .replace(/&#(x[0-9a-f]+|[0-9]+);/gi, (_, n) => {
            const code = n[0].toLowerCase() === 'x' ? parseInt(n.slice(1), 16) : Number(n);
            return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : '';
        })
        .replace(/\s+/g, ' ')
        .trim();
}
export function parseNews(xml, limit = 4) {
    return [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)]
        .map(([, item]) => {
            const field = (name) =>
                text(
                    item.match(
                        new RegExp('<' + name + '[^>]*>([\\s\\S]*?)</' + name + '>', 'i'),
                    )?.[1] || '',
                );
            const title = field('title'),
                link = field('link'),
                published = field('pubDate'),
                summary = field('description').slice(0, 260);
            try {
                const u = new URL(link);
                if (u.protocol !== 'https:' || u.hostname !== 'vnexpress.net') return null;
            } catch {
                return null;
            }
            const timestamp = Date.parse(published);
            return title && Number.isFinite(timestamp)
                ? { title, summary, url: link, published_at: new Date(timestamp).toISOString() }
                : null;
        })
        .filter(Boolean)
        .sort((a, b) => b.published_at.localeCompare(a.published_at))
        .slice(0, limit);
}
async function loadFeed(category, fetcher) {
    category ||= 'latest';
    if (!Object.hasOwn(feeds, category))
        throw Object.assign(new Error('Invalid news category'), { status: 400 });
    const old = cache.get(category);
    if (old && Date.now() - old.time < 300000) return old.data;
    if (pending.has(category)) return pending.get(category);
    const task = (async () => {
        try {
            const response = await fetcher(
                'https://vnexpress.net/rss/' + feeds[category] + '.rss',
                {
                    signal: AbortSignal.timeout(10000),
                },
            );
            if (!response.ok) throw new Error('News source unavailable');
            const parsed = parseNews(await response.text(), category === 'football' ? 60 : 8);
            const items = (
                category === 'football' ? parsed.filter(isFootballNews).slice(0, 8) : parsed
            ).map((item) => ({
                ...item,
                category,
                category_label: labels[category],
            }));
            if (!items.length) throw new Error('No news available');
            const data = {
                items,
                source: 'VnExpress',
                updated_at: new Date().toISOString(),
                stale: false,
            };
            cache.set(category, { time: Date.now(), data });
            return data;
        } catch {
            if (old && Date.now() - old.time < 86400000) return { ...old.data, stale: true };
            throw Object.assign(new Error('Unable to load news. Please retry.'), { status: 400 });
        }
    })();
    pending.set(category, task);
    try {
        return await task;
    } finally {
        pending.delete(category);
    }
}
export function mixNews(feeds) {
    const items = [],
        urls = new Set(),
        titles = new Set();
    const add = (item) => {
        const title = item.title.toLocaleLowerCase();
        if (urls.has(item.url) || titles.has(title)) return;
        urls.add(item.url);
        titles.add(title);
        items.push(item);
    };
    const football = feeds.find((feed) => feed.category === 'football');
    for (const item of football?.items.slice(0, 3) || []) add(item);
    const others = feeds.filter((feed) => feed.category !== 'football');
    for (let index = 0; index < 8 && items.length < 10; index++) {
        for (const feed of others) {
            if (feed.items[index]) add(feed.items[index]);
            if (items.length >= 10) break;
        }
    }
    for (const feed of feeds)
        for (const item of feed.items) {
            if (items.length >= 10) break;
            add(item);
        }
    return items;
}
export async function loadNews(category = 'latest', fetcher = fetch) {
    category ||= 'latest';
    if (category !== 'latest') return loadFeed(category, fetcher);
    const categories = [
        'football',
        'world',
        'business',
        'technology',
        'health',
        'lifestyle',
        'science',
        'latest',
    ];
    const results = await Promise.allSettled(
        categories.map(async (category) => ({ category, ...(await loadFeed(category, fetcher)) })),
    );
    const available = results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => result.value);
    if (!available.length)
        throw Object.assign(new Error('Unable to load news. Please retry.'), { status: 503 });
    return {
        items: mixNews(available),
        source: 'VnExpress',
        updated_at: available.map((feed) => feed.updated_at).sort()[0],
        stale: available.some((feed) => feed.stale),
        partial: available.length < categories.length,
    };
}
