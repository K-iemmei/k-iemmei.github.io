const test = require('node:test');
const assert = require('node:assert/strict');
const { validateTest } = require('../../apps/api/modules/reading/reading-validation');
const { gradeTest } = require('../../apps/api/modules/reading/reading-grader');
const { manualReading } = require('../helpers/reading-fixture.cjs');
function linkedFixture() {
    const data = manualReading();
    data.passages = [data.passages[1]];
    const group = data.passages[0].groups[0];
    const question = group.questions[0];
    question.answer_key = {
        answers: ['sensory leakage', 'fraud'],
        distinct_group: 'pair',
        aliases: [{ value: 'outright fraud', answer: 'fraud' }],
    };
    group.questions = [question, structuredClone(question)];
    return data;
}
test('official linked answer variants accept either order without duplicate credit', () => {
    const data = validateTest(linkedFixture());
    data.passages[0].groups[0].questions.forEach((q, i) => (q.id = 'q' + i));
    assert.equal(
        gradeTest(data, { q0: 'OUTRIGHT   FRAUD', q1: 'sensory leakage' }).correct_count,
        2,
    );
    assert.equal(gradeTest(data, { q0: 'fraud', q1: 'outright fraud' }).correct_count, 1);
    assert.equal(gradeTest(data, { q0: 'wrong', q1: 'sensory leakage' }).correct_count, 1);
});
test('answer aliases must reference existing answers and remain consistent across linked slots', () => {
    const data = linkedFixture();
    const questions = data.passages[0].groups[0].questions;
    questions[0].answer_key.aliases[0].answer = 'unknown';
    assert.throws(() => validateTest(data), /aliases must uniquely/);
    questions[0].answer_key.aliases[0].answer = 'fraud';
    questions[0].answer_key.aliases[0].value = 'FRAUD';
    assert.throws(() => validateTest(data), /aliases must uniquely/);
    questions[0].answer_key.aliases[0].value = 'another form';
    assert.throws(() => validateTest(data), /linked slots must share/);
});
