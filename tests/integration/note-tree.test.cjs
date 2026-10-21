const test = require('node:test');
const assert = require('node:assert/strict');
const { createTestDatabase } = require('../helpers/test-database.cjs');
test('note hierarchy persists, rejects cycles and other owners, preserves children on deletion', async (t) => {
    const f = await createTestDatabase();
    t.after(() => f.cleanup());
    const call = async (user, action, id = null, payload = {}) =>
        (
            await f.pool.query('SELECT app_note_tree($1,$2,$3,$4::jsonb) AS result', [
                user,
                action,
                id,
                JSON.stringify(payload),
            ])
        ).rows[0].result;
    const create = (parent_id = null) =>
        call(f.userId, 'tree-create', null, { title: 'Note', body: 'Text', tags: [], parent_id });
    const root = await create();
    const child = await create(root.id);
    const grandchild = await create(child.id);
    assert.equal(child.parent_id, root.id);
    assert.equal((await call(f.userId, 'tree-list')).items.length, 3);
    await assert.rejects(
        call(f.userId, 'tree-move', root.id, { parent_id: grandchild.id, version: root.version }),
        /children/,
    );
    await assert.rejects(
        call(f.userId, 'tree-move', root.id, { parent_id: root.id, version: root.version }),
        /children/,
    );
    const other = (await f.pool.query("INSERT INTO users(name) VALUES ('Other') RETURNING id"))
        .rows[0].id;
    assert.equal((await call(other, 'tree-list')).items.length, 0);
    await assert.rejects(
        call(other, 'tree-create', null, { title: 'x', body: '', tags: [], parent_id: root.id }),
        /not found/,
    );
    await assert.rejects(
        call(other, 'tree-move', child.id, { parent_id: null, version: child.version }),
        /not found/,
    );
    await assert.rejects(
        call(f.userId, 'tree-move', child.id, { parent_id: null, version: 99 }),
        /changed/,
    );
    const moved = await call(f.userId, 'tree-move', child.id, {
        parent_id: null,
        version: child.version,
    });
    assert.equal(moved.parent_id, null);
    await f.pool.query("SELECT app_notes_api($1,'delete',$2,$3::jsonb)", [
        f.userId,
        child.id,
        JSON.stringify({ version: moved.version }),
    ]);
    const remaining = (await call(f.userId, 'tree-list')).items;
    assert.equal(remaining.find((n) => n.id === grandchild.id).parent_id, null);
});
