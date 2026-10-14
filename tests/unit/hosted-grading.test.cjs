const test = require('node:test');
const assert = require('node:assert/strict');
const { gradeTest: gradeLocal } = require('../../apps/api/modules/reading/reading-grader');
const { manualReading } = require('../helpers/reading-fixture.cjs');

test('hosted Reading grading matches the local server for all question types', async () => {
    const { gradeTest: gradeHosted } = await import('../../supabase/functions/app-api/grade.ts');
    const reading = manualReading();
    let next = 0;
    const responses = {};
    for (const passage of reading.passages)
        for (const group of passage.groups)
            for (const question of group.questions) {
                question.id = String(++next);
                if (question.question_type === 'list_selection') {
                    question.answer_key.match = 'all';
                    responses[question.id] = ['C', 'B'];
                } else responses[question.id] = question.answer_key.answers[0];
            }
    assert.deepEqual(gradeHosted(reading, responses), gradeLocal(reading, responses));
});
