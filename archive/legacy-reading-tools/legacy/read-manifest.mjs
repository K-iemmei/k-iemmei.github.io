export async function loadManifest(fetcher = fetch) {
    let response = await fetcher('data/imports/manifests/manifest_passages.json', {
        cache: 'no-store',
    });
    if (!response.ok)
        response = await fetcher('data/imports/manifests/manifest.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Manifest not found');
    const manifest = await response.json();
    const items = Array.isArray(manifest) ? manifest : manifest.tests;
    if (!Array.isArray(items) || !items.length) throw new Error('No tests available');
    return items.map((item) => ({
        ...item,
        title: item.title || item.name || 'Cambridge IELTS Reading',
        slug: item.slug || (item.file || item.filename || '').replace(/\.(txt|html?)$/i, ''),
        file: item.file || item.filename || '',
        source: item.url || item.link || '',
        passage: item.passage || 1,
        test_slug: item.test_slug || item.slug || (item.file || '').replace(/\.(txt|html?)$/i, ''),
    }));
}
