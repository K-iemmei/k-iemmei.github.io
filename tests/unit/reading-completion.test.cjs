const assert = require('node:assert/strict');
const { test } = require('node:test');
test('completion maps numbered and sequential blanks safely without duplicate controls', async () => {
    const { renderCompletion } =
        await import('../../apps/web/src/features/english/reading/reading-completion.js');
    const qs = [24, 25, 26].map((number) => ({
        id: String(number),
        number,
        prompt: 'Blank ' + number,
        metadata: {},
    }));
    const render = (q) => `<input data-id="${q.id}">`;
    const result = renderCompletion(
        '<script>bad</script> (24) ___\n[25] ... {{26}} (24) ___',
        qs,
        render,
    );
    assert.deepEqual([...result.used], ['24', '25', '26']);
    assert.equal((result.html.match(/<input/g) || []).length, 3);
    assert.ok(result.html.includes('&lt;script&gt;'));
    assert.ok(result.html.includes('<br>'));
    assert.ok(result.html.includes('blank-reference'));
    assert.equal(renderCompletion('___ and ___', qs, render).used.size, 2);
    assert.equal(renderCompletion('(99) ___', qs, render).used.size, 0);
    assert.equal(renderCompletion('(1) ___', qs, render).used.has('24'), true);
});
