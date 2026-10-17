const test = require('node:test');
const assert = require('node:assert/strict');

test('Grammar curriculum has complete unique lessons across the full learning path', async () => {
    const { courseUnits, lessons, lessonById, levels } =
        await import('../../apps/web/src/features/grammar/grammar-course.js');
    assert.equal(courseUnits.length, 12);
    assert.equal(lessons.length, 72);
    assert.equal(lessonById.size, lessons.length);
    for (const lesson of lessons) {
        assert(levels.includes(lesson.level), lesson.id);
        assert.match(lesson.id, /^[a-z0-9-]+$/);
        assert(lesson.summary.length > 50, lesson.id);
        assert.equal(lesson.rules.length, 3, lesson.id);
        assert.equal(lesson.examples.length, 2, lesson.id);
        for (const rule of lesson.rules) {
            assert(rule.title && rule.explanation.length > 80 && rule.pattern, lesson.id);
        }
        for (const example of lesson.examples)
            assert(example.context && example.english && example.vietnamese, lesson.id);
        assert(lesson.mistake.incorrect !== lesson.mistake.correct, lesson.id);
        assert(lesson.mistake.explanation, lesson.id);
        assert.equal(lesson.check.options.length, 3, lesson.id);
        assert.equal(new Set(lesson.check.options).size, 3, lesson.id);
        assert(
            Number.isInteger(lesson.check.answer) &&
                lesson.check.answer >= 0 &&
                lesson.check.answer < 3,
            lesson.id,
        );
        assert(lesson.check.explanation, lesson.id);
    }
    for (const topic of [
        'word-classes',
        'articles',
        'present-simple',
        'present-continuous',
        'past-simple',
        'past-continuous',
        'present-perfect',
        'present-perfect-continuous',
        'past-perfect',
        'past-perfect-continuous',
        'future-forms',
        'future-continuous',
        'future-perfect',
        'gerunds-infinitives',
        'modal-perfect',
        'passive-voice',
        'reported-statements',
        'mixed-conditionals',
        'negative-inversion',
        'subjunctive',
        'ellipsis-substitution',
        'nominalisation',
    ])
        assert(lessonById.has(topic), topic);
});

test('Grammar search handles Vietnamese accents and combined progress/level filters', async () => {
    const { lessons, lessonById, matchesLesson } =
        await import('../../apps/web/src/features/grammar/grammar-course.js');
    const lesson = lessonById.get('mixed-conditionals');
    assert(matchesLesson(lesson, { query: 'điều kiện hỗn hợp' }));
    assert(matchesLesson(lesson, { query: 'dieu kien hon hop', level: 'B2' }));
    assert(!matchesLesson(lesson, { query: 'dieu kien', level: 'A1' }));
    assert(matchesLesson(lesson, { status: 'saved' }, { saved: [lesson.id] }));
    assert(!matchesLesson(lesson, { status: 'saved' }, { saved: [] }));
    assert(matchesLesson(lesson, { status: 'completed' }, { completed: [lesson.id] }));
    assert(!matchesLesson(lesson, { status: 'remaining' }, { completed: [lesson.id] }));
    assert.equal(
        lessons.filter((lesson) => matchesLesson(lesson, { query: 'no-such-grammar-point-xyz' }))
            .length,
        0,
    );
});

test('Grammar progress is isolated by account and tolerates invalid browser storage', async () => {
    const { readProgress } = await import('../../apps/web/src/features/grammar/grammar-course.js');
    const storage = new Map([
        [
            'grammar-progress:alice',
            JSON.stringify({
                completed: ['articles', 'articles', 'missing'],
                saved: ['subjunctive'],
                lastLesson: 'subjunctive',
            }),
        ],
        [
            'grammar-progress:bob',
            JSON.stringify({ completed: ['pronouns'], saved: [], lastLesson: 'missing' }),
        ],
    ]);
    const adapter = { getItem: (key) => storage.get(key) };
    assert.deepEqual(readProgress(adapter, 'alice'), {
        completed: ['articles'],
        saved: ['subjunctive'],
        lastLesson: 'subjunctive',
    });
    assert.deepEqual(readProgress(adapter, 'bob'), {
        completed: ['pronouns'],
        saved: [],
        lastLesson: null,
    });
    storage.set('grammar-progress:alice', '{broken');
    assert.deepEqual(readProgress(adapter, 'alice'), {
        completed: [],
        saved: [],
        lastLesson: null,
    });
    assert.deepEqual(
        readProgress(
            {
                getItem() {
                    throw Error('blocked');
                },
            },
            'alice',
        ),
        { completed: [], saved: [], lastLesson: null },
    );
});
