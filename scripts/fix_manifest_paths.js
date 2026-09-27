const fs = require('fs');
const path = require('path');
const repo = path.resolve(__dirname, '..');
const mf = path.join(repo, 'data', 'cambridge_ielts_reading', 'manifest.json');
if (!fs.existsSync(mf)) { console.error('manifest not found', mf); process.exit(1); }
const raw = fs.readFileSync(mf, 'utf8');
let arr = JSON.parse(raw);
arr = arr.map(item => ({ ...item, file: (item.file || '').replace(/^samples-rendered\//, '../samples-rendered/') }));
fs.writeFileSync(mf, JSON.stringify(arr, null, 2), 'utf8');
console.log('Updated manifest paths to ../samples-rendered/ for', arr.length, 'items');
