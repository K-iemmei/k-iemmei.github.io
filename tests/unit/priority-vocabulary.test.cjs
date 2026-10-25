const test = require('node:test'),
    assert = require('node:assert/strict');
const { parsePriorityList } = require('../../tools/content/priority-vocabulary-list.cjs');
test('priority list parser rejoins PDF line wraps and preserves distinct meanings and levels', () => {
    const words = parsePriorityList(
        'Abolish v. C1\nreverse v.\n, n.\n, adj. C1\nfull-time adj.\n/adv. B2\nrecount\n1 v. C1\nstrip (long narrow piece) n. C1\nstrip (remove clothes/a layer)\nv. C1\ntrillion number B2\nspecialize v. B1',
    );
    assert.equal(words.length, 8);
    assert.equal(words.find((w) => w.term === 'reverse').pos, 'v., n., adj.');
    assert.equal(words.find((w) => w.term === 'full-time').pos, 'adj., adv.');
    assert.equal(words.find((w) => w.term === 'recount').level, 'C1');
    assert.equal(words.filter((w) => w.term === 'strip').length, 2);
    assert.notEqual(...words.filter((w) => w.term === 'strip').map((w) => w.id));
    assert.equal(words.find((w) => w.term === 'trillion').pos, 'number');
    assert.equal(words.find((w) => w.term === 'specialize').level, 'B1');
    assert.throws(() => parsePriorityList('term n. B2\nterm n. B2'), /duplicate/);
});
test('priority catalogue has all 2000 cards with Vietnamese senses and contextual examples', async () => {
    const { priorityCatalog } =
        await import('../../apps/web/src/features/vocabulary/content/priority-catalog.js');
    assert.equal(priorityCatalog.length, 2000);
    assert.equal(new Set(priorityCatalog.map((w) => w.id)).size, 2000);
    for (const letter of new Set(priorityCatalog.map((w) => w.letter))) {
        const { words } = await import(
            '../../apps/web/src/features/vocabulary/content/priority/' + letter + '.js'
        );
        assert.equal(words.length, priorityCatalog.filter((w) => w.letter === letter).length);
        for (const word of words) {
            assert(
                word.senses.length > 0 && word.senses.every((s) => s.meaning.trim()),
                word.id + ' meanings',
            );
            assert(
                word.examples.length > 0 &&
                    word.examples.every((e) => e.en.trim().split(/\s+/).length >= 5),
                word.id + ' examples',
            );
            assert(!JSON.stringify(word).includes('\ufffd'), word.id + ' encoding');
        }
    }
});
test('priority filtering uses exact study counts and hosted writes bind authenticated user', async () => {
    const { priorityRequest, filterPriorityWords } =
        await import('../../apps/web/src/domain/priority-vocabulary.js');
    const { priorityCatalog } =
        await import('../../apps/web/src/features/vocabulary/content/priority-catalog.js');
    const progress = new Map(
        priorityCatalog.slice(0, 6).map((w, i) => [w.id, { completed_rounds: i }]),
    );
    for (let rounds = 1; rounds <= 5; rounds++)
        assert.deepEqual(
            filterPriorityWords(priorityCatalog, progress, { rounds: String(rounds) }).map(
                (w) => w.id,
            ),
            [priorityCatalog[rounds].id],
        );
    assert.equal(
        filterPriorityWords(priorityCatalog, progress, { query: '  ABOLISH ' })[0].term,
        'abolish',
    );
    assert(
        filterPriorityWords(priorityCatalog, progress, { letter: 'B' }).every(
            (w) => w.letter === 'B',
        ),
    );
    const id = priorityCatalog[0].id;
    assert.throws(
        () => priorityRequest('/api/vocabulary/priority/' + id, 'PUT', { completed_rounds: 5 }),
        /Invalid/,
    );
    const { vocabularyApi } = await import('../../supabase/functions/app-api/vocabulary.ts');
    let called;
    const admin = {
        rpc: async (name, args) => {
            called = { name, args };
            return { data: { completed_rounds: 1 } };
        },
    };
    await vocabularyApi(admin, { id: 'authenticated' }, 'vocabulary/priority/' + id, 'PUT', {
        completed_rounds: 1,
        expected_revision: 0,
        user_id: 'forged',
    });
    assert.equal(called.args.p_user, 'authenticated');
    assert.equal(called.name, 'app_priority_vocabulary');
    assert(!called.args.p_payload.user_id);
    await assert.rejects(
        () =>
            vocabularyApi(
                { rpc: async () => ({ error: { code: '40001', message: 'conflict' } }) },
                { id: 'authenticated' },
                'vocabulary/priority/' + id,
                'PUT',
                { completed_rounds: 1, expected_revision: 0 },
            ),
        { status: 409 },
    );
});
