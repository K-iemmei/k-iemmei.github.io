const test = require('node:test');
const assert = require('node:assert/strict');
const { validateTest } = require('../../apps/api/modules/reading/reading-validation');
const { gradeTest } = require('../../apps/api/modules/reading/reading-grader');
const { hashPassword, verifyPassword } = require('../../apps/api/modules/auth/local-auth');
const { manualReading } = require('../helpers/reading-fixture.cjs');
test('all manual question types normalize into a stable contract', () => {
    const model = validateTest(manualReading());
    assert.equal(model.passages.length, 2);
    assert.equal(model.passages[0].groups.length, 10);
    assert.equal(model.passages[0].groups.at(-1).questions[0].answer_key.match, 'all');
});
test('reject missing/invalid answers, types, duplicate options and invalid slugs', () => {
    for (const change of [
        (m) => (m.slug = '../x'),
        (m) => (m.passages[0].groups[0].questions[0].answer_key.answers = ['Z']),
        (m) => (m.passages[0].groups[0].group_type = 'arbitrary'),
        (m) => m.passages[0].groups[0].options.push(m.passages[0].groups[0].options[0]),
        (m) => (m.passages = []),
    ]) {
        const model = manualReading();
        change(model);
        assert.throws(
            () => validateTest(model),
            (error) => error.status === 400,
        );
    }
});
test('grade exact unordered multi-selection, alternatives and blank responses on the server', () => {
    const model = validateTest(manualReading());
    let index = 0;
    const responses = {};
    for (const p of model.passages)
        for (const g of p.groups)
            for (const q of g.questions) {
                q.id = 'q' + index++;
                responses[q.id] =
                    q.answer_key.match === 'all'
                        ? [...q.answer_key.answers].reverse()
                        : q.answer_key.answers[0];
            }
    assert.equal(gradeTest(model, responses).score_percent, 100);
    assert.equal(gradeTest(model, {}).correct_count, 0);
    const multi = model.passages[0].groups.at(-1).questions[0];
    responses[multi.id] = ['B', 'B'];
    assert.equal(gradeTest(model, responses).correct_count, index - 1);
    assert.throws(
        () => gradeTest(model, { unknown: 'x' }),
        (error) => error.status === 409,
    );
});
test('passwords are salted and verified securely', () => {
    const hash = hashPassword('test-only-password');
    assert.notEqual(hash, hashPassword('test-only-password'));
    assert.ok(verifyPassword('test-only-password', hash));
    assert.equal(verifyPassword('wrong', hash), false);
    assert.equal(verifyPassword('x', 'broken'), false);
});

test('draft keys may be absent without inventing a zero score; publication requires every key', () => {
    const model = manualReading();
    model.status = 'draft';
    for (const p of model.passages)
        for (const g of p.groups) for (const q of g.questions) q.answer_key.answers = [];
    const normalized = validateTest(model);
    let i = 0;
    for (const p of normalized.passages)
        for (const g of p.groups) for (const q of g.questions) q.id = 'q' + i++;
    const result = gradeTest(normalized, {});
    assert.equal(result.graded_count, 0);
    assert.equal(result.correct_count, 0);
    assert.equal(result.score_percent, null);
    assert.ok(result.review.every((q) => !q.is_graded && !q.is_correct));
    model.status = 'published';
    assert.throws(
        () => validateTest(model),
        (error) => error.status === 400,
    );
    normalized.passages[0].groups[0].questions[0].answer_key.answers = ['A'];
    const partial = gradeTest(normalized, { q0: 'A' });
    assert.equal(partial.graded_count, 1);
    assert.equal(partial.score_percent, 100);
});

test('linked choose-two slots score distinct answers in either order and preserve book numbers', () => {
    const input = manualReading();
    input.passages = [input.passages[0]];
    input.passages[0].groups = [
        {
            group_type: 'short_answer',
            title: 'Choose two',
            instructions: '',
            options: [],
            metadata: {},
            questions: [23, 24].map((number) => ({
                question_type: 'short_answer',
                prompt: 'Choose a letter',
                options: [],
                answer_key: { answers: ['A', 'C'], distinct_group: 'pair' },
                metadata: { source_number: number },
            })),
        },
    ];
    const model = validateTest(input);
    const group = model.passages[0].groups[0];
    group.questions.forEach((q, i) => (q.id = 'slot' + i));
    assert.equal(gradeTest(model, { slot0: 'c', slot1: ' A ' }).correct_count, 2);
    assert.equal(gradeTest(model, { slot0: 'A', slot1: 'a' }).correct_count, 1);
    assert.equal(gradeTest(model, { slot0: 'B', slot1: 'C' }).correct_count, 1);
    assert.equal(gradeTest(model, { slot0: '', slot1: 'C' }).correct_count, 1);
    assert.equal(gradeTest(model, {}).correct_count, 0);
    assert.deepEqual(
        gradeTest(model, {}).review.map((q) => q.question_number),
        [23, 24],
    );
    input.passages[0].groups[0].questions[1].answer_key.answers = ['B', 'D'];
    assert.throws(
        () => validateTest(input),
        (e) => e.status === 400,
    );
    const second = structuredClone(group);
    second.questions.forEach((q, i) => (q.id = 'other' + i));
    model.passages[0].groups.push(second);
    assert.equal(
        gradeTest(model, { slot0: 'A', slot1: 'C', other0: 'A', other1: 'C' }).correct_count,
        4,
    );
});
