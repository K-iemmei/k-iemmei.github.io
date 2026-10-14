const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '../..');
function walk(directory) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const file = path.join(directory, entry.name);
        return entry.isDirectory()
            ? ['env', '.venv', 'node_modules', '__pycache__'].includes(entry.name)
                ? []
                : walk(file)
            : [file];
    });
}
const files = ['apps', 'tools', 'tests']
    .flatMap((dir) => walk(path.join(root, dir)))
    .filter((file) => /\.(js|cjs|mjs)$/.test(file));
for (const file of files)
    execFileSync(process.execPath, ['--check', file], { stdio: 'inherit', windowsHide: true });
for (const file of files.filter((file) => file.includes(path.join('apps', 'web', 'src')))) {
    const source = fs.readFileSync(file, 'utf8');
    for (const match of source.matchAll(
        /(?:from\s*|import\s*\(\s*|import\s*)['"](\.[^'"]+)['"]/g,
    )) {
        if (!fs.existsSync(path.resolve(path.dirname(file), match[1])))
            throw new Error('Broken import: ' + file + ' -> ' + match[1]);
    }
}
console.log(`Checked ${files.length} JavaScript files and browser imports`);
