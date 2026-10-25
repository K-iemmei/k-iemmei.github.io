import { bookLessons } from '../features/grammar/content/book-lessons.js';
export function normaliseGrammarAnswer(value = '') {
    return value
        .normalize('NFKC')
        .toLowerCase()
        .replace(/[’‘]/g, "'")
        .replace(/\bcan't\b/g, 'cannot')
        .replace(/\bwon't\b/g, 'will not')
        .replace(/\bshan't\b/g, 'shall not')
        .replace(/\b([a-z]+)n't\b/g, '$1 not')
        .replace(/\bi'm\b/g, 'i am')
        .replace(/\b([a-z]+)'re\b/g, '$1 are')
        .replace(/\b([a-z]+)'ve\b/g, '$1 have')
        .replace(/\b(he|she|it)'s\b/g, '$1 is')
        .replace(/[.,!?;:]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}
export function gradeGrammar(lesson, mode, answers) {
    const questions = lesson.questions.filter((q) =>
        mode === 'review' ? Object.hasOwn(answers, q.id) : q.mode === mode,
    );
    if (
        !questions.length ||
        (mode === 'review' &&
            (questions.length > 20 || questions.length !== Object.keys(answers).length))
    )
        throw Object.assign(Error('Invalid review questions'), { status: 400 });
    return questions.map((q) => ({
        id: q.id,
        answer: answers[q.id] || '',
        correct: q.answers.some(
            (a) => normaliseGrammarAnswer(a) === normaliseGrammarAnswer(answers[q.id] || ''),
        ),
        accepted: q.answers,
        explanation: q.explanation,
    }));
}
export function grammarRequest(path, method, body) {
    if (path === '/api/grammar' && method === 'GET')
        return { action: 'load', id: null, payload: {} };
    const match = path.match(/^\/api\/grammar\/(giu-\d{3})(?:\/(attempts))?$/);
    if (!match) return undefined;
    const lesson = Object.values(bookLessons).find((l) => l.id === match[1]);
    const fail = (message) => {
        throw Object.assign(Error(message), { status: 400 });
    };
    if (!lesson) fail('This unit has no interactive lesson yet');
    if (!body || typeof body !== 'object') fail('Invalid grammar data');
    if (method === 'PUT' && !match[2]) {
        const drafts = body.drafts || {};
        if (
            Object.keys(drafts).length > 30 ||
            Object.entries(drafts).some(
                ([id, value]) =>
                    !lesson.scenarios.some((s) => s.id === id) ||
                    typeof value !== 'string' ||
                    value.length > 5000,
            )
        )
            fail('Invalid writing draft');
        if (body.read !== undefined && typeof body.read !== 'boolean')
            fail('Invalid reading status');
        return { action: 'save', id: lesson.id, payload: { read: body.read === true, drafts } };
    }
    if (method === 'POST' && match[2]) {
        const { mode, answers, request_id } = body;
        if (
            !['quick', 'deep', 'assessment', 'review'].includes(mode) ||
            !answers ||
            typeof answers !== 'object' ||
            Array.isArray(answers) ||
            Object.keys(answers).length > 20 ||
            Object.values(answers).some((v) => typeof v !== 'string' || v.length > 1000) ||
            !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
                request_id || '',
            )
        )
            fail('Invalid practice attempt');
        const results = gradeGrammar(lesson, mode, answers);
        if (
            mode !== 'review' &&
            (results.length !== Object.keys(answers).length ||
                results.some((r) => !Object.hasOwn(answers, r.id)))
        )
            fail('Answer every question in this exercise');
        return {
            action: 'attempt',
            id: lesson.id,
            payload: {
                request_id,
                mode,
                results,
                score: results.filter((r) => r.correct).length,
                total: results.length,
            },
        };
    }
    return undefined;
}
