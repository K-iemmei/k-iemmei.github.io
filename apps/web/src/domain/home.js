const categories = new Set(['latest', 'world', 'business', 'technology']);
export function homeRequest(path, method, body) {
    if (path === '/api/home' && method === 'GET') return { action: 'load', payload: {} };
    if (path === '/api/home/preferences' && method === 'PUT') {
        if (!body || !categories.has(body.news_category))
            throw Object.assign(new Error('Invalid news category'), { status: 400 });
        const city = body.city;
        if (
            city !== null &&
            (!city ||
                typeof city.name !== 'string' ||
                !city.name.trim() ||
                city.name.length > 160 ||
                !Number.isFinite(city.latitude) ||
                Math.abs(city.latitude) > 90 ||
                !Number.isFinite(city.longitude) ||
                Math.abs(city.longitude) > 180)
        )
            throw Object.assign(new Error('Invalid city'), { status: 400 });
        return {
            action: 'preferences',
            payload: {
                city: city
                    ? { name: city.name.trim(), latitude: city.latitude, longitude: city.longitude }
                    : null,
                news_category: body.news_category,
            },
        };
    }
    const match = path.match(/^\/api\/home\/todos(?:\/([0-9a-f-]{36}))?$/i);
    if (!match) return null;
    const action =
        method === 'POST' && !match[1]
            ? 'create'
            : method === 'PUT' && match[1]
              ? 'update'
              : method === 'DELETE' && match[1]
                ? 'delete'
                : null;
    if (!action) return null;
    if (!body || typeof body !== 'object' || Array.isArray(body))
        throw Object.assign(new Error('Invalid task'), { status: 400 });
    const payload = {};
    if (action !== 'create') {
        if (!Number.isInteger(body.version) || body.version < 1)
            throw Object.assign(new Error('Invalid task version'), { status: 400 });
        payload.version = body.version;
    }
    if (action === 'create' || body.title !== undefined) {
        if (typeof body.title !== 'string' || !body.title.trim() || body.title.trim().length > 300)
            throw Object.assign(new Error('Task must contain 1–300 characters'), { status: 400 });
        payload.title = body.title.trim();
    }
    for (const key of ['completed', 'pinned'])
        if (body[key] !== undefined) {
            if (typeof body[key] !== 'boolean')
                throw Object.assign(new Error('Invalid task state'), { status: 400 });
            payload[key] = body[key];
        }
    return { action, id: match[1] || null, payload };
}
export function homeError(error) {
    return Object.assign(new Error(error.message), {
        status: error.code === '40001' ? 409 : error.code === 'P0002' ? 404 : 400,
    });
}
