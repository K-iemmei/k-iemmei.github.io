const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

test('Pages build includes authenticated Grammar route, course data and pale-blue styles', (t) => {
    const root = path.resolve(__dirname, '../..');
    const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'my-note-grammar-build-'));
    t.after(() => {
        if (
            !path.resolve(workspace).startsWith(path.resolve(os.tmpdir()) + path.sep) ||
            !path.basename(workspace).startsWith('my-note-grammar-build-')
        )
            throw Error('Unsafe temporary build path');
        fs.rmSync(workspace, { recursive: true, force: true });
    });
    fs.cpSync(path.join(root, 'apps/web'), path.join(workspace, 'apps/web'), { recursive: true });
    fs.mkdirSync(path.join(workspace, 'tools/site'), { recursive: true });
    fs.copyFileSync(
        path.join(root, 'tools/site/build.cjs'),
        path.join(workspace, 'tools/site/build.cjs'),
    );
    fs.mkdirSync(path.join(workspace, 'node_modules/sql.js/dist'), { recursive: true });
    for (const file of ['sql-wasm.js', 'sql-wasm.wasm'])
        fs.copyFileSync(
            path.join(root, 'node_modules/sql.js/dist', file),
            path.join(workspace, 'node_modules/sql.js/dist', file),
        );
    require(path.join(workspace, 'tools/site/build.cjs')).buildSite({
        url: 'https://grammar-build-test.supabase.co',
        key: 'public-test-anon-key-for-packaging',
        prepareRichAssets: require('../../tools/site/rich-assets.cjs').buildRichAssets,
    });
    const html = fs.readFileSync(path.join(workspace, 'dist/english-grammar.html'), 'utf8');
    assert.match(html, /data-page="grammar"/);
    assert.match(html, /data-auth-pending/);
    for (const file of [
        'src/features/grammar/grammar-page.js',
        'src/features/grammar/book-page.js',
        'src/features/grammar/content/book-curriculum.js',
        'src/features/grammar/content/book-lessons.js',
        'src/domain/grammar.js',
        'src/features/grammar/content/advanced.js',
        'src/features/grammar/content/foundations.js',
        'styles/pages/grammar.css',
        'notes.html',
        'note.html',
        'blog.html',
        'post.html',
        'vendor/rich/rendering.js',
        'vendor/rich/rendering.css',
    ])
        assert(fs.existsSync(path.join(workspace, 'dist', file)), file);
    assert(!fs.existsSync(path.join(workspace, 'dist/data/imports/EngInUse.pdf')));
    for (const name of ['notes', 'note', 'blog', 'post']) {
        assert.match(
            fs.readFileSync(path.join(workspace, 'dist', name + '.html'), 'utf8'),
            /data-auth-pending/,
        );
    }
    assert(
        fs
            .readdirSync(path.join(workspace, 'dist/vendor/rich/assets'))
            .some((name) => name.endsWith('.woff2')),
    );
    assert.match(
        fs.readFileSync(
            path.join(workspace, 'dist/src/features/catalog/subject-catalog.js'),
            'utf8',
        ),
        /english-grammar\.html/,
    );
});
