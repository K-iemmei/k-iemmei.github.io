const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const samplesDir = path.join(repoRoot, 'data', 'samples-rendered');
const outDir = path.join(repoRoot, 'data', 'cambridge_ielts_reading');
const outFile = path.join(outDir, 'manifest.json');

if (!fs.existsSync(samplesDir)) {
  console.error('Samples directory not found:', samplesDir);
  process.exit(1);
}

const files = fs.readdirSync(samplesDir).filter(f => f.toLowerCase().endsWith('.html'));
if (!files.length) {
  console.error('No sample HTML files found in', samplesDir);
  process.exit(1);
}

function titleFromFilename(fn) {
  // cambridge-ielts-20-academic-reading-test-4.html
  const name = fn.replace(/\.html$/i, '').replace(/[-_]+/g, ' ');
  return name.replace(/\b(ielts)\b/ig, 'IELTS').replace(/\b(cambridge)\b/ig, 'Cambridge');
}

const manifest = files.map((f) => {
  const slug = f.replace(/\.html$/i, '');
  return {
    title: titleFromFilename(f),
    slug,
    file: `samples-rendered/${f}`,
  };
});

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(manifest, null, 2), 'utf8');
console.log('Wrote manifest with', manifest.length, 'entries to', outFile);
