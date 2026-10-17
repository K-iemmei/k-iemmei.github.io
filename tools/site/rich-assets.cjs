const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
let localAssets;
function buildOptions(output) {
    fs.mkdirSync(output, { recursive: true });
    return {
        entryPoints: {
            rendering: path.join(root, 'apps/web/src/features/publishing/rich-renderer.js'),
        },
        outdir: output,
        bundle: true,
        format: 'esm',
        splitting: true,
        platform: 'browser',
        target: ['es2022'],
        minify: true,
        chunkNames: 'chunks/[name]-[hash]',
        assetNames: 'assets/[name]-[hash]',
        loader: { '.woff': 'file', '.woff2': 'file', '.ttf': 'file' },
        logLevel: 'warning',
        legalComments: 'linked',
    };
}
function buildRichAssets(output) {
    require('esbuild').buildSync(buildOptions(output));
}
async function getLocalRichAssets() {
    if (!localAssets) {
        const directory = path.join(root, '.local');
        fs.mkdirSync(directory, { recursive: true });
        const target = fs.mkdtempSync(path.join(directory, 'rich-assets-'));
        localAssets = require('esbuild')
            .build(buildOptions(target))
            .then(() => target)
            .catch((error) => {
                localAssets = null;
                throw error;
            });
    }
    return localAssets;
}
module.exports = { buildRichAssets, getLocalRichAssets };
