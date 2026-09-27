const fs = require('fs');
const path = require('path');
const repo = path.resolve(__dirname, '..');
const mf = path.join(repo, 'data', 'cambridge_ielts_reading', 'manifest.json');
const out = path.join(repo, 'data', 'cambridge_ielts_reading', 'manifest_passages.json');
if (!fs.existsSync(mf)) { console.error('manifest not found', mf); process.exit(1); }
const manifest = JSON.parse(fs.readFileSync(mf, 'utf8'));
const passages = [];
manifest.forEach((item) => {
  // assume 3 passages max — but current import has 1 per test; create a single passage entry per test
  const passageCount = item.passages || 1;
  for (let i = 1; i <= passageCount; i++) {
    passages.push({
      title: `${item.title} — Passage ${i}`,
      slug: `${item.slug}-p${i}`,
      test_slug: item.slug,
      passage: i,
      file: item.file,
    });
  }
});
fs.writeFileSync(out, JSON.stringify(passages, null, 2));
console.log('Wrote', passages.length, 'passage entries to', out);
