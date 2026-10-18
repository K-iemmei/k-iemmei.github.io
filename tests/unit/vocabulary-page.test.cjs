const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

async function page() {
    const elements = new Map();
    const element = (id) => {
        if (!elements.has(id))
            elements.set(id, {
                disabled: false,
                hidden: false,
                innerHTML: '',
                textContent: '',
                addEventListener() {},
                insertAdjacentHTML(position, html) {
                    this.innerHTML += html;
                },
            });
        return elements.get(id);
    };
    const pending = [];
    const source = fs
        .readFileSync('apps/web/src/features/vocabulary/vocabulary-deck-page.js', 'utf8')
        .replace(/^import .*;\r?\n/gm, '');
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    const load = await new AsyncFunction(
        'document',
        'location',
        'apiRequest',
        'h',
        source + '\nreturn loadCards;',
    )(
        { getElementById: element, querySelector: element },
        { search: '' },
        (url) => new Promise((resolve, reject) => pending.push({ url, resolve, reject })),
        (value) => value,
    );
    return { load, element, pending };
}
const card = (term) => ({ term, meaning: 'definition', state: 'new' });

test('failed card pagination preserves the offset and enables retry', async () => {
    const { load, element, pending } = await page();
    const initial = load();
    pending.shift().resolve(Array.from({ length: 100 }, (_, index) => card('word' + index)));
    await initial;
    const original = element('cardList').innerHTML;
    const next = load(false);
    assert.equal(element('loadMoreCards').disabled, true);
    const failed = pending.shift();
    assert.match(failed.url, /offset=100$/);
    failed.reject(Error('Offline'));
    await assert.rejects(next, /Offline/);
    assert.equal(element('loadMoreCards').disabled, false);
    assert.equal(element('cardList').innerHTML, original);
    const retry = load(false);
    const request = pending.shift();
    assert.match(request.url, /offset=100$/);
    request.resolve([card('last word')]);
    await retry;
    assert.equal(element('cardCountLabel').textContent, '101 loaded');
    assert.equal(element('loadMoreCards').hidden, true);
});

test('late pagination cannot overwrite a newer card-list refresh', async () => {
    const { load, element, pending } = await page();
    const stale = load(false);
    const refresh = load();
    pending[1].resolve([card('fresh word')]);
    await refresh;
    pending[0].resolve([card('stale word')]);
    await stale;
    assert.match(element('cardList').innerHTML, /fresh word/);
    assert.doesNotMatch(element('cardList').innerHTML, /stale word/);
    assert.equal(element('cardCountLabel').textContent, '1 loaded');
});
