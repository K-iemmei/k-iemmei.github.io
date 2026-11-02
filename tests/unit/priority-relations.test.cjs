const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { auditRelations } = require('../../tools/content/audit-priority-relations.cjs');

test('all 2,000 cards, every declared group and every direct link pass the complete audit', async () => {
    const audit = await auditRelations();
    assert.equal(audit.words.length, 2000);
    assert.equal(audit.linked, 1998);
    assert(audit.groups.length > 900);
    assert(audit.pairs > 3000);
    assert.equal(
        fs
            .readFileSync(
                path.join(__dirname, '../../docs/priority-vocabulary-relations-audit.md'),
                'utf8',
            )
            .replace(/\r\n/g, '\n'),
        audit.report,
    );
    const { relationSelector } =
        await import('../../apps/web/src/features/vocabulary/content/priority-relation-groups.js');
    const byName = new Map(audit.words.map((word) => [relationSelector(word), word]));
    const links = (name) => audit.index.get(byName.get(name).id);
    const has = (a, b) => links(a).some(({ word }) => word.id === byName.get(b).id);
    for (const [a, b] of [
        ['absorb', 'lighting'],
        ['absorb', 'harsh'],
        ['beneficiary', 'coordination'],
        ['beneficiary', 'dynamic'],
        ['completion', 'tackle'],
        ['constitutional', 'beneficial'],
        ['caption', 'disagreement'],
        ['compile', 'simulation'],
        ['cop', 'bug'],
        ['apparel', 'widen'],
        ['contractor', 'evolve'],
        ['fit', 'adequate'],
        ['prompt', 'accelerate'],
        ['elaborate', 'clarify'],
        ['grave (for dead person)', 'grave (serious)'],
        ['counter (argue against)', 'counter (long flat surface)'],
        ['strip (long narrow piece)', 'strip (remove clothes/a layer)'],
        ['sometime', 'occasional'],
    ])
        assert(!has(a, b), `Incorrect relationship: ${a} / ${b}`);
    for (const [a, b, kind] of [
        ['deficiency', 'shortage', 'meaning'],
        ['absence', 'absent', 'family'],
        ['authentic', 'fake', 'contrast'],
        ['kidney', 'liver', 'topic'],
        ['irony', 'ironically', 'family'],
        ['sibling', 'parental', 'topic'],
    ])
        assert(
            links(a)
                .find(({ word }) => word.id === byName.get(b).id)
                ?.relations.some((relation) => relation.kind === kind),
        );
    assert.equal(links('whoever').length, 0);
    assert.equal(links('sometime').length, 0);
    assert(
        !links('authentic')
            .find(({ word }) => word.id === byName.get('genuine').id)
            .relations.some((relation) => relation.kind === 'contrast'),
    );
    assert(
        !links('adequate')
            .find(({ word }) => word.id === byName.get('sufficient').id)
            .relations.some((relation) => relation.kind === 'contrast'),
    );
    assert(
        links('adequate')
            .find(({ word }) => word.id === byName.get('insufficient').id)
            .relations.some((relation) => relation.kind === 'contrast'),
    );
    assert(
        !links('curious')
            .find(({ word }) => word.id === byName.get('intriguing').id)
            .relations.some((relation) => relation.kind === 'family'),
    );
    // A word's unrelated senses must not connect its neighbours transitively.
    assert(has('canvas', 'backdrop'));
    assert(has('canvas', 'scope'));
    assert(!has('backdrop', 'fiber'));
});

test('custom words get symmetric, labelled phrase suggestions without inheriting groups from their spelling', async () => {
    const { createPriorityRelationIndex, relatedPriorityWords } =
        await import('../../apps/web/src/domain/priority-relations.js');
    const words = ['absence', 'absent', 'garden', 'custom', 'absence'].map((term, id) => ({
        id: String(id),
        term,
        custom: id >= 3,
    }));
    const contents = new Map([
        ['0', { senses: [{ meaning: 'sự vắng mặt, sự thiếu vắng' }] }],
        ['1', { senses: [{ meaning: 'vắng mặt' }] }],
        ['2', { senses: [{ meaning: 'khu vườn' }] }],
        ['3', { senses: [{ meaning: 'vắng mặt; không có ở đây' }] }],
        ['4', { senses: [{ meaning: 'an unrelated English phrase' }] }],
    ]);
    const index = createPriorityRelationIndex(words, contents);
    const related = relatedPriorityWords(words[0], words, contents, index);
    assert.deepEqual(
        related.map(({ word }) => word.id),
        ['1', '3'],
    );
    assert.equal(related[0].relations[0].kind, 'family');
    assert.match(related[1].reason, /^Gợi ý/);
    assert(index.get('3').some(({ word }) => word.id === '0'));
    assert.deepEqual(index.get('4'), []);
    assert.deepEqual(index.get('2'), []);
});

test('dictionary parentheses, partial words, accent differences and ordinary built-in text do not create links', async () => {
    const { createPriorityRelationIndex } =
        await import('../../apps/web/src/domain/priority-relations.js');
    const words = ['first', 'second', 'third', 'fourth', 'fifth'].map((term, id) => ({
        id: String(id),
        term,
        custom: id !== 0,
    }));
    const contents = new Map([
        ['0', { senses: [{ meaning: 'hấp thụ (ánh sáng); mất đi; tốt' }] }],
        ['1', { senses: [{ meaning: 'ánh sáng' }] }],
        ['2', { senses: [{ meaning: 'mắt đi' }] }],
        ['3', { senses: [{ meaning: 'tốt' }] }],
        ['4', { senses: [{ meaning: 'mặt trời' }] }],
    ]);
    assert.deepEqual(createPriorityRelationIndex(words, contents).get('0'), []);
    words.forEach((word) => {
        word.custom = false;
    });
    contents.get('1').senses = [{ meaning: 'hấp thụ' }];
    assert.deepEqual(createPriorityRelationIndex(words, contents).get('0'), []);
});
