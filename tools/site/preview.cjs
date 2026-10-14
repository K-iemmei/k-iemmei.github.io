const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const dist = path.join(root, 'dist');
if (!fs.existsSync(path.join(dist, 'index.html')))
    throw new Error('Run npm run build:pages before previewing');
const app = express();
app.get('/', (_req, res) => res.redirect('/my-note/'));
app.use('/my-note', express.static(dist, { extensions: ['html'] }));
const port = Number(process.env.PAGES_PORT || 4173);
app.listen(port, '127.0.0.1', () =>
    console.log(`Pages preview: http://127.0.0.1:${port}/my-note/`),
);
