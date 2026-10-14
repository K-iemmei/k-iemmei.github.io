const test = require('node:test');
const assert = require('node:assert/strict');
const { validateTest } = require('../../apps/api/modules/reading/reading-validation');
const { manualReading } = require('../helpers/reading-fixture.cjs');
test('source-page references survive validation without accepting paths or remote URLs', () => {
    const data = manualReading();
    const metadata = data.passages[0].groups[0].metadata;
    metadata.source_pages = [{ file: 'cambridge-2-p006-l.png', label: 'Original exercise' }];
    assert.deepEqual(
        validateTest(data).passages[0].groups[0].metadata.source_pages,
        metadata.source_pages,
    );
    for (const file of [
        '../secret.png',
        'https://example.com/image.png',
        'cambridge-2-p006-l.png/../key',
        '/key.png',
    ]) {
        metadata.source_pages[0].file = file;
        assert.throws(() => validateTest(data), /invalid source page filename/);
    }
    metadata.source_pages = new Array(21).fill({
        file: 'cambridge-1-p026.png',
        label: 'Original exercise',
    });
    assert.throws(() => validateTest(data), /at most 20 source pages/);
});

test('native reading diagrams retain their captions and reject unsafe asset paths', () => {
    const data = manualReading();
    const metadata = data.passages[0].groups[0].metadata;
    metadata.figures = [{ file: 'cambridge-2-p007-r-figure.png', label: 'Airport cross-section' }];
    const validated = validateTest(data);
    assert.deepEqual(validated.passages[0].groups[0].metadata.figures, metadata.figures);
    assert.equal(validated.passages[0].content, data.passages[0].content);
    for (const file of [
        '../key.png',
        'https://example.com/figure.png',
        'cambridge-2-p007-r-figure.png/../key',
    ]) {
        metadata.figures[0].file = file;
        assert.throws(() => validateTest(data), /invalid figure filename/);
    }
});

test('private Cambridge assets support books 1 through 21 only', () => {
    const data = manualReading();
    const metadata = data.passages[0].groups[0].metadata;
    for (const book of [1, 4, 5, 10, 19, 20, 21]) {
        metadata.figures = [{ file: `cambridge-${book}-p062-figure.png`, label: 'Diagram' }];
        metadata.source_pages = [{ file: `cambridge-${book}-p062.png`, label: 'Source' }];
        assert.doesNotThrow(() => validateTest(data));
    }
    for (const book of [0, 22, 101, '05']) {
        metadata.figures = [{ file: `cambridge-${book}-p062-figure.png` }];
        delete metadata.source_pages;
        assert.throws(() => validateTest(data), /invalid figure filename/);
        delete metadata.figures;
        metadata.source_pages = [{ file: `cambridge-${book}-p062.png` }];
        assert.throws(() => validateTest(data), /invalid source page filename/);
    }
});
