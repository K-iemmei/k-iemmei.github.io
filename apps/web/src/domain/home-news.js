const feeds = {
    latest: 'tin-moi-nhat',
    world: 'the-gioi',
    business: 'kinh-doanh',
    technology: 'so-hoa',
};
const cache = new Map();
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
export function parseNews(xml) {
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
        .slice(0, 4);
}
export async function loadNews(category = 'latest', fetcher = fetch) {
    category ||= 'latest';
    if (!Object.hasOwn(feeds, category))
        throw Object.assign(new Error('Invalid news category'), { status: 400 });
    const old = cache.get(category);
    if (old && Date.now() - old.time < 300000) return old.data;
    try {
        const response = await fetcher('https://vnexpress.net/rss/' + feeds[category] + '.rss', {
            signal: AbortSignal.timeout(10000),
        });
        if (!response.ok) throw new Error('News source unavailable');
        const items = parseNews(await response.text());
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
}
