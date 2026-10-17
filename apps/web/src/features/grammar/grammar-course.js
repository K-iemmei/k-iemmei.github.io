import { units as foundations } from './content/foundations.js';
import { units as time } from './content/time.js';
import { units as verbs } from './content/verbs.js';
import { units as clauses } from './content/clauses.js';
import { units as hypotheticals } from './content/hypotheticals.js';
import { units as advanced } from './content/advanced.js';

export const courseUnits = [
    ...foundations,
    ...time,
    ...verbs,
    ...clauses,
    ...hypotheticals,
    ...advanced,
];
export const lessons = courseUnits.flatMap((unit, unitIndex) =>
    unit.lessons.map((lesson) => ({
        ...lesson,
        unitId: unit.id,
        unitTitle: unit.title,
        unitIndex,
    })),
);
export const lessonById = new Map(
    lessons.map((lesson, index) => [lesson.id, { ...lesson, index }]),
);
export const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];
export const references = [
    {
        title: 'British Council · Grammar reference',
        url: 'https://learnenglish.britishcouncil.org/free-resources/grammar',
    },
    {
        title: 'Cambridge · English Grammar Today',
        url: 'https://dictionary.cambridge.org/grammar/british-grammar/',
    },
];
export function normaliseSearch(value = '') {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase();
}
export function matchesLesson(
    lesson,
    { query = '', level = 'all', status = 'all' } = {},
    progress = {},
) {
    if (level !== 'all' && lesson.level !== level) return false;
    const completed = (progress.completed || []).includes(lesson.id);
    if (status === 'completed' && !completed) return false;
    if (status === 'remaining' && completed) return false;
    if (status === 'saved' && !(progress.saved || []).includes(lesson.id)) return false;
    const text = normaliseSearch(
        [
            lesson.title,
            lesson.subtitle,
            lesson.summary,
            lesson.unitTitle,
            ...lesson.rules.flatMap((rule) => [rule.title, rule.explanation, rule.pattern]),
        ].join(' '),
    );
    return normaliseSearch(query)
        .trim()
        .split(/\s+/)
        .every((term) => text.includes(term));
}

export function readProgress(storage, userId) {
    try {
        const value = JSON.parse(storage.getItem(`grammar-progress:${userId}`) || '{}');
        const valid = (ids) => [
            ...new Set((Array.isArray(ids) ? ids : []).filter((id) => lessonById.has(id))),
        ];
        return {
            completed: valid(value.completed),
            saved: valid(value.saved),
            lastLesson: lessonById.has(value.lastLesson) ? value.lastLesson : null,
        };
    } catch {
        return { completed: [], saved: [], lastLesson: null };
    }
}
