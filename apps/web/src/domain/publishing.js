export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const fail = (message) => {
    throw Object.assign(new Error(message), { status: 400 });
};
const uuid = (value) => {
    if (
        typeof value !== 'string' ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
    )
        fail('Invalid note or image ID');
    return value;
};
const version = (value) => {
    const number = typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : value;
    if (!Number.isInteger(number) || number < 1 || number > 2147483646)
        fail('Missing or invalid note version');
    return number;
};
export function cleanNote(body) {
    if (
        !body ||
        typeof body.title !== 'string' ||
        typeof body.body !== 'string' ||
        !Array.isArray(body.tags)
    )
        fail('Invalid note content');
    if (body.title.length > 160 || body.body.length > 200000 || body.tags.length > 10)
        fail('Title, content or tag limit exceeded');
    const tags = body.tags.map((tag) => {
        if (typeof tag !== 'string' || !tag.trim() || tag.trim().length > 32)
            fail('Tags must contain 1–32 characters');
        return tag.trim().toLowerCase();
    });
    return { title: body.title.trim(), body: body.body, tags: [...new Set(tags)] };
}
export function cleanImage(body) {
    const mime = body?.mime_type;
    const encoded = body?.data_base64;
    if (
        !['image/png', 'image/jpeg', 'image/gif', 'image/webp'].includes(mime) ||
        typeof encoded !== 'string' ||
        encoded.length > 2796204 ||
        encoded.length % 4 !== 0 ||
        !/^[A-Za-z0-9+/]*={0,2}$/.test(encoded)
    )
        fail('Upload a PNG, JPEG, GIF or WebP image up to 2 MB');
    let data;
    try {
        data = atob(encoded);
    } catch {
        fail('Invalid image encoding');
    }
    if (!data.length || data.length > MAX_IMAGE_BYTES) fail('Image must be at most 2 MB');
    const codes = (start, values) =>
        values.every((value, index) => data.charCodeAt(start + index) === value);
    const valid =
        mime === 'image/png'
            ? codes(0, [137, 80, 78, 71, 13, 10, 26, 10])
            : mime === 'image/jpeg'
              ? codes(0, [255, 216, 255])
              : mime === 'image/gif'
                ? /^GIF8[79]a/.test(data)
                : data.startsWith('RIFF') && data.slice(8, 12) === 'WEBP';
    if (!valid) fail('Image contents do not match its file type');
    return { mime_type: mime, data_base64: encoded };
}
export function publishingRequest(path, method, body, url) {
    const parts = path.split('/').filter(Boolean);
    if (parts[0] !== 'api' || !['notes', 'blog'].includes(parts[1])) return undefined;
    let action,
        id = null,
        payload = {};
    const list = () => {
        const q = url.searchParams.get('q') || '';
        const page = Number(url.searchParams.get('page') || 1);
        if (q.length > 100 || !Number.isInteger(page) || page < 1 || page > 10000)
            fail('Invalid search or page');
        const status = url.searchParams.get('status') || 'all';
        if (!['all', 'private', 'posted'].includes(status)) fail('Invalid note filter');
        return { q, page, status };
    };
    if (parts[1] === 'blog') {
        if (method !== 'GET' || parts.length > 3) return undefined;
        action = parts[2] ? 'blog-get' : 'blog-list';
        if (parts[2]) id = uuid(parts[2]);
        else payload = list();
    } else if (parts[2] === 'assets') {
        if (method === 'GET' && parts.length === 4) {
            action = 'asset-get';
            id = uuid(parts[3]);
        } else if (method === 'POST' && parts.length === 3) {
            action = 'asset-create';
            id = uuid(body?.note_id);
            payload = cleanImage(body);
        } else return undefined;
    } else if (parts.length === 2) {
        if (method === 'GET') {
            action = 'list';
            payload = list();
        } else if (method === 'POST') {
            action = 'save';
            payload = cleanNote(body);
        } else return undefined;
    } else {
        id = uuid(parts[2]);
        if (parts.length === 3 && method === 'GET') action = 'get';
        else if (parts.length === 3 && method === 'PUT') {
            action = 'save';
            payload = { ...cleanNote(body), version: version(body.version) };
        } else if (parts.length === 3 && method === 'DELETE') {
            action = 'delete';
            payload = { version: version(url.searchParams.get('version')) };
        } else if (
            parts.length === 4 &&
            method === 'POST' &&
            ['publish', 'unpublish'].includes(parts[3])
        ) {
            action = parts[3];
            payload = { version: version(body?.version) };
        } else return undefined;
    }
    return { action, id, payload };
}
export function publishingError(error) {
    const status =
        error.status || (error.code === 'P0002' ? 404 : error.code === '40001' ? 409 : 400);
    return Object.assign(new Error(error.message || 'Unable to update note'), { status });
}
export function chartData(value) {
    if (
        !value ||
        !['bar', 'line', 'pie', 'doughnut', 'radar'].includes(value.type) ||
        !Array.isArray(value.labels) ||
        value.labels.length < 1 ||
        value.labels.length > 100 ||
        !Array.isArray(value.datasets) ||
        value.datasets.length < 1 ||
        value.datasets.length > 8
    )
        fail('Chart needs a supported type, 1–100 labels and 1–8 datasets');
    const labels = value.labels.map((label) => String(label).slice(0, 80));
    const datasets = value.datasets.map((dataset) => {
        if (
            !Array.isArray(dataset.data) ||
            dataset.data.length !== labels.length ||
            dataset.data.some((number) => typeof number !== 'number' || !Number.isFinite(number))
        )
            fail('Chart data must contain one finite number per label');
        return { label: String(dataset.label || 'Series').slice(0, 80), data: dataset.data };
    });
    return { type: value.type, title: String(value.title || '').slice(0, 160), labels, datasets };
}
