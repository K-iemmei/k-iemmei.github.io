// Anki package parsing stays in the browser on GitHub Pages. Audio/media is not imported.
const MB = 1024 * 1024;
const plain = (value) =>
    String(value || '')
        .replace(/\[sound:[^\]]+\]/gi, '')
        .replace(/<br\s*\/?\s*>/gi, '\n')
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;|&#160;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;|&apos;/gi, "'")
        .trim();
function fieldIndex(fields, names, patterns, excluded = -1) {
    for (const pattern of patterns) {
        const index = names.findIndex(
            (name, i) => i !== excluded && pattern.test(name) && fields[i],
        );
        if (index >= 0) return index;
    }
    return -1;
}
function zipEntries(buffer) {
    const view = new DataView(buffer);
    let end = -1;
    for (let at = buffer.byteLength - 22; at >= Math.max(0, buffer.byteLength - 65557); at--) {
        if (view.getUint32(at, true) === 0x06054b50) {
            end = at;
            break;
        }
    }
    if (end < 0) throw new Error('Invalid .apkg ZIP file');
    const count = view.getUint16(end + 10, true);
    let at = view.getUint32(end + 16, true);
    const entries = new Map();
    const decoder = new TextDecoder();
    for (let index = 0; index < count; index++) {
        if (view.getUint32(at, true) !== 0x02014b50) throw new Error('Invalid ZIP directory');
        const method = view.getUint16(at + 10, true);
        const compressed = view.getUint32(at + 20, true);
        const uncompressed = view.getUint32(at + 24, true);
        const nameLength = view.getUint16(at + 28, true);
        const extraLength = view.getUint16(at + 30, true);
        const commentLength = view.getUint16(at + 32, true);
        const local = view.getUint32(at + 42, true);
        const name = decoder.decode(new Uint8Array(buffer, at + 46, nameLength));
        entries.set(name, { method, compressed, uncompressed, local });
        at += 46 + nameLength + extraLength + commentLength;
    }
    return entries;
}
async function unzipEntry(buffer, entry) {
    if (entry.uncompressed > 150 * MB) throw new Error('Anki collection exceeds 150 MB');
    const view = new DataView(buffer);
    if (view.getUint32(entry.local, true) !== 0x04034b50)
        throw new Error('Invalid collection entry');
    const start =
        entry.local +
        30 +
        view.getUint16(entry.local + 26, true) +
        view.getUint16(entry.local + 28, true);
    const bytes = new Uint8Array(buffer, start, entry.compressed);
    if (entry.method === 0) return bytes.slice();
    if (entry.method !== 8 || !globalThis.DecompressionStream)
        throw new Error('This browser cannot decompress the Anki package');
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    const data = new Uint8Array(await new Response(stream).arrayBuffer());
    if (data.length !== entry.uncompressed) throw new Error('Anki collection size mismatch');
    return data;
}
let sqlEngine;
async function sqlite() {
    if (!sqlEngine)
        sqlEngine = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'vendor/sql-wasm.js';
            script.onload = () =>
                window
                    .initSqlJs({ locateFile: () => 'vendor/sql-wasm.wasm' })
                    .then(resolve, reject);
            script.onerror = () => reject(new Error('Could not load browser SQLite'));
            document.head.append(script);
        });
    return sqlEngine;
}
function query(db, sql) {
    const result = db.exec(sql)[0];
    return result?.values || [];
}
function extract(db) {
    const meta = query(db, 'SELECT decks, models FROM col LIMIT 1')[0];
    if (!meta) throw new Error('Anki collection has no metadata');
    const decks = new Map(Object.entries(JSON.parse(meta[0])).map(([id, item]) => [id, item.name]));
    const models = new Map(
        Object.entries(JSON.parse(meta[1])).map(([id, model]) => [
            id,
            model.flds.map((field) => String(field.name || '').toLowerCase()),
        ]),
    );
    const rows = query(
        db,
        `SELECT n.mid,n.flds,n.tags,(SELECT c.did FROM cards c WHERE c.nid=n.id ORDER BY c.ord LIMIT 1) FROM notes n WHERE EXISTS(SELECT 1 FROM cards c WHERE c.nid=n.id) LIMIT 50001`,
    );
    if (rows.length > 50000) throw new Error('Anki collection has more than 50,000 notes');
    const cards = [],
        counts = new Map();
    for (const [mid, rawFields, rawTags, did] of rows) {
        const names = models.get(String(mid)) || [];
        const fields = String(rawFields || '')
            .split('\x1f')
            .map(plain);
        const termIndex = fieldIndex(fields, names, [
            /^word$/,
            /^phrase$/,
            /^front$/,
            /^term$/,
            /^expression$/,
            /^text$/,
        ]);
        const front = termIndex >= 0 ? termIndex : fields.findIndex(Boolean);
        const meaningIndex = fieldIndex(
            fields,
            names,
            [
                /^meaning$/,
                /definition.*\b(tv|vi|vietnamese)\b/,
                /translation|vietnamese/,
                /^back$/,
                /^definition$/,
                /definition/,
            ],
            front,
        );
        const back =
            meaningIndex >= 0 ? meaningIndex : fields.findIndex((field, i) => i !== front && field);
        const term = fields[front]?.slice(0, 500),
            meaning = fields[back]?.slice(0, 4000);
        if (!term || !meaning) continue;
        const exampleIndex = fieldIndex(fields, names, [/^example$/, /example|sentence/], front);
        const deckName = String(decks.get(String(did)) || 'Imported Anki deck');
        const root = deckName.split('::')[0].trim();
        counts.set(root, (counts.get(root) || 0) + 1);
        cards.push({
            term,
            meaning,
            example:
                exampleIndex >= 0 && exampleIndex !== back
                    ? fields[exampleIndex].slice(0, 4000)
                    : '',
            tags: [
                deckName,
                ...String(rawTags || '')
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean),
            ].slice(0, 30),
        });
    }
    if (!cards.length) throw new Error('No vocabulary notes with a word and meaning were found');
    const name = [...counts].sort((a, b) => b[1] - a[1])[0][0].slice(0, 120);
    return { name, cards };
}
export async function parseApkgInBrowser(file) {
    if (file.size > 250 * MB) throw new Error('Anki package exceeds 250 MB');
    const buffer = await file.arrayBuffer(),
        entries = zipEntries(buffer),
        errors = [];
    const SQL = await sqlite();
    for (const name of ['collection.anki21', 'collection.anki2']) {
        const entry = entries.get(name);
        if (!entry) continue;
        let db;
        try {
            db = new SQL.Database(await unzipEntry(buffer, entry));
            return extract(db);
        } catch (error) {
            errors.push(error.message);
        } finally {
            db?.close();
        }
    }
    throw new Error(errors[0] || 'This package has no supported Anki collection');
}
