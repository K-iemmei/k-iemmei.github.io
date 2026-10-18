const test = require('node:test');
const assert = require('node:assert/strict');

test('hosted Reading library uses personal all-time best, including attempts beyond the first page', async () => {
    const { readingApi } = await import('../../supabase/functions/app-api/reading.ts');
    const records = [
        ...Array.from({ length: 1000 }, (_, id) => ({
            id,
            test_id: 'one',
            user_id: 'me',
            correct_count: 3,
            total_count: 13,
        })),
        { id: 1000, test_id: 'one', user_id: 'me', correct_count: 13, total_count: 13 },
        { id: 1001, test_id: 'two', user_id: 'me', correct_count: 3, total_count: 13 },
        { id: 1002, test_id: 'two', user_id: 'other', correct_count: 13, total_count: 13 },
        { id: 1003, test_id: 'ungraded', user_id: 'me', correct_count: 0, total_count: 13 },
    ];
    const rows = ['one', 'two', 'ungraded', 'new'].map((id) => ({ id, status: 'published' }));
    rows.push({ id: 'private', status: 'draft', created_by: 'other' });
    const admin = {
        from(table) {
            let user, ids, selected;
            return {
                select(fields) {
                    selected = fields;
                    return this;
                },
                neq() {
                    return this;
                },
                eq(field, value) {
                    assert.equal(field, 'user_id');
                    user = value;
                    return this;
                },
                in(field, value) {
                    assert.equal(field, 'test_id');
                    ids = value;
                    return this;
                },
                order() {
                    return table === 'reading_tests' ? Promise.resolve({ data: rows }) : this;
                },
                range(start, end) {
                    assert.equal(user, 'me');
                    assert.ok(!ids.includes('private'));
                    assert.equal(selected, 'id,test_id,correct_count,total_count');
                    return Promise.resolve({
                        data: records
                            .filter((a) => a.user_id === user && ids.includes(a.test_id))
                            .slice(start, end + 1),
                    });
                },
            };
        },
    };
    const result = await readingApi(admin, { id: 'me' }, '/tests', 'GET');
    assert.equal(result.length, 4);
    assert.equal(result[0].best_score_percent, 100);
    assert.equal(result[1].best_score_percent, (100 * 3) / 13);
    assert.equal(result[2].best_score_percent, 0);
    assert.equal(result[3].best_score_percent, 0);
});
