const test = require('node:test');
const assert = require('node:assert/strict');

test('related words combine study groups and complete meaning phrases across letters and custom words', async () => {
    const { relatedPriorityWords } =
        await import('../../apps/web/src/domain/priority-relations.js');
    const words = ['absence', 'absent', 'lack', 'garden', 'custom', 'unrelated'].map(
        (term, id) => ({ id: String(id), term }),
    );
    const contents = new Map([
        ['0', { senses: [{ meaning: 'sự vắng mặt, sự thiếu vắng' }] }],
        ['1', { senses: [{ meaning: 'vắng mặt' }] }],
        ['3', { senses: [{ meaning: 'khu vườn' }] }],
        ['4', { senses: [{ meaning: 'vắng mặt; không có ở đây' }] }],
        ['5', { senses: [{ meaning: 'mặt trời' }] }],
    ]);
    const related = relatedPriorityWords(words[0], words, contents);
    assert.deepEqual(
        related.map(({ word }) => word.term),
        ['absent', 'custom', 'lack'],
    );
    assert.deepEqual(
        related.map(({ reason }) => reason),
        ['Có nghĩa chung', 'Có nghĩa chung', 'Cùng nhóm học'],
    );
    assert(relatedPriorityWords(words[4], words, contents).some(({ word }) => word.id === '0'));
    assert.deepEqual(relatedPriorityWords(words[3], words, contents), []);
});

test('generic single words and Vietnamese accent differences do not create spurious relations', async () => {
    const { relatedPriorityWords } =
        await import('../../apps/web/src/domain/priority-relations.js');
    const words = ['one', 'two', 'three'].map((term) => ({ id: term, term }));
    const contents = new Map(
        words.map((word, i) => [
            word.id,
            { senses: [{ meaning: ['sự tốt; mất đi', 'tốt; mắt đi', 'sự tốt'][i] }] },
        ]),
    );
    assert.deepEqual(relatedPriorityWords(words[0], words, contents), []);
});
