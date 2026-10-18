const test = require('node:test');
const assert = require('node:assert/strict');
const { createTestDatabase } = require('../helpers/test-database.cjs');
const { manualReading } = require('../helpers/reading-fixture.cjs');
const { validateTest } = require('../../apps/api/modules/reading/reading-validation');
const { createReadingRepository } = require('../../apps/api/modules/reading/reading-repository');
const { applyReview } = require('../../tools/database/apply-content-review.cjs');

test('content corrections are transactional, versioned, idempotent and preserve questions and keys', async (t) => {
    const fixture = await createTestDatabase();
    t.after(() => fixture.cleanup());
    const repository = createReadingRepository(fixture.pool);
    const saved = await repository.save(validateTest(manualReading()), fixture.userId);
    const before = await repository.findForAuthor(saved.id, fixture.userId);
    const passage = before.passages[0];
    const plan = [
        {
            table: 'reading_passages',
            id: passage.id,
            field: 'content',
            before: passage.content,
            after: passage.content + '\n\nA corrected sentence.',
            reason: 'Reviewed source',
        },
    ];
    assert.equal((await applyReview(fixture.pool, plan)).applied, false);
    assert.equal(
        (await repository.findForAuthor(saved.id, fixture.userId)).passages[0].content,
        passage.content,
    );
    assert.equal((await applyReview(fixture.pool, plan, { apply: true })).fields, 1);
    const after = await repository.findForAuthor(saved.id, fixture.userId);
    assert.equal(after.version, before.version + 1);
    assert.equal(after.passages[0].id, passage.id);
    assert.deepEqual(after.passages[0].groups, passage.groups);
    assert.equal((await applyReview(fixture.pool, plan, { apply: true })).fields, 0);
    assert.equal((await repository.findForAuthor(saved.id, fixture.userId)).version, after.version);
    await assert.rejects(
        applyReview(fixture.pool, [{ ...plan[0], after: 'Stale replacement' }], { apply: true }),
        /changed since review/,
    );
    assert.equal(
        (await repository.findForAuthor(saved.id, fixture.userId)).passages[0].content,
        plan[0].after,
    );
});
