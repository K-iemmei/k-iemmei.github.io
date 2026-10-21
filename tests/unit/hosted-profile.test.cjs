const test = require('node:test');
const assert = require('node:assert/strict');
const user = { id: 'new-user', email: 'new@example.test', user_metadata: { name: 'New learner' } };
function client({ member = true, profile = null } = {}) {
    const writes = [];
    return {
        writes,
        from(table) {
            const query = {
                select() {
                    return query;
                },
                eq() {
                    return query;
                },
                maybeSingle: async () => ({
                    data:
                        table === 'hosted_members'
                            ? member
                                ? { user_id: user.id }
                                : null
                            : profile,
                }),
                upsert: async (value, options) => {
                    writes.push({ table, value, options });
                    return { data: null };
                },
                update(value) {
                    writes.push({ table, value });
                    return query;
                },
                then(resolve) {
                    return Promise.resolve({ data: null }).then(resolve);
                },
            };
            return query;
        },
    };
}
test('unapproved accounts are refused without reading or creating a profile', async () => {
    const { ensureHostedProfile } =
        await import('../../supabase/functions/app-api/hosted-profile.ts');
    const admin = client({ member: false });
    const tables = [];
    const original = admin.from;
    admin.from = (table) => {
        tables.push(table);
        return original(table);
    };
    assert.equal(await ensureHostedProfile(admin, user), false);
    assert.deepEqual(tables, ['hosted_members']);
    assert.deepEqual(admin.writes, []);
});
test('parallel first requests safely initialize only the approved Auth identity without overwriting existing content', async () => {
    const { ensureHostedProfile } =
        await import('../../supabase/functions/app-api/hosted-profile.ts');
    const admin = client();
    assert.deepEqual(
        await Promise.all([ensureHostedProfile(admin, user), ensureHostedProfile(admin, user)]),
        [true, true],
    );
    for (const write of admin.writes) {
        assert.equal(write.table, 'users');
        assert.equal(write.value.id, user.id);
        assert.equal(write.value.name, 'New learner');
        assert.deepEqual(write.options, { onConflict: 'id', ignoreDuplicates: true });
    }
    const existing = client({ profile: { id: user.id, name: 'My chosen name' } });
    assert.equal(await ensureHostedProfile(existing, user), true);
    assert.deepEqual(existing.writes, []);
});
