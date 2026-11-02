import { priorityCatalog } from '../features/vocabulary/content/priority-catalog.js';
const ids = new Set(priorityCatalog.map((word) => word.id));
export const searchText = (value) =>
    String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .toLowerCase();
export function filterPriorityWords(
    words,
    progress,
    { query = '', rounds = '', letter = '', level = '' } = {},
) {
    const q = searchText(query.trim());
    return words.filter(
        (word) =>
            (!q || searchText(word.term).includes(q)) &&
            (!letter || word.letter === letter) &&
            (!level || word.level.includes(level)) &&
            (rounds === '' ||
                Number(progress.get(word.id)?.completed_rounds || 0) === Number(rounds)),
    );
}
export function priorityRequest(path, method, body) {
    if (path === '/api/vocabulary/priority' && method === 'GET')
        return { action: 'load', id: null, payload: {} };
    if (path === '/api/vocabulary/priority' && method === 'POST') {
        const payload = {};
        for (const [key, max] of [
            ['word', 500],
            ['mean', 4000],
            ['example', 4000],
        ]) {
            if (
                typeof body?.[key] !== 'string' ||
                !body[key].trim() ||
                body[key].trim().length > max
            )
                throw Object.assign(new Error('Vui lòng nhập Word, Mean và Example hợp lệ.'), {
                    status: 400,
                });
            payload[key] = body[key].trim();
        }
        return { action: 'create', id: null, payload };
    }
    const match = path.match(/^\/api\/vocabulary\/priority\/(pv-(?:custom-)?[a-f0-9]{16})$/);
    if (!match || method !== 'PUT') return undefined;
    const fail = (message) => {
        throw Object.assign(new Error(message), { status: 400 });
    };
    if (!ids.has(match[1]) && !match[1].startsWith('pv-custom-')) fail('Unknown vocabulary word');
    if (
        !body ||
        !Number.isInteger(body.completed_rounds) ||
        body.completed_rounds < 0 ||
        body.completed_rounds > 5 ||
        !Number.isSafeInteger(body.expected_revision) ||
        body.expected_revision < 0
    )
        fail('Invalid study progress');
    return {
        action: 'save',
        id: match[1],
        payload: {
            completed_rounds: body.completed_rounds,
            expected_revision: body.expected_revision,
        },
    };
}
