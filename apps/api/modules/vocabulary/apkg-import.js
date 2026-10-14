const AdmZip = require('adm-zip');
const Database = require('better-sqlite3');

const MB = 1024 * 1024;
const MAX_UPLOAD_BYTES = 250 * MB;
const MAX_COLLECTION_BYTES = 150 * MB;
const MAX_NOTES = 50000;
const invalid = (message) => Object.assign(new Error(message), { status: 400 });

function plain(value) {
    return String(value || '')
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
}

function chooseField(fields, names, patterns, excluded = -1) {
    for (const pattern of patterns) {
        const index = names.findIndex(
            (name, i) => i !== excluded && pattern.test(name) && fields[i],
        );
        if (index >= 0) return index;
    }
    return -1;
}

function extractCards(sqlite) {
    const meta = sqlite.prepare('SELECT decks, models FROM col LIMIT 1').get();
    if (!meta) throw invalid('Anki collection has no metadata');
    const deckNames = new Map(
        Object.entries(JSON.parse(meta.decks)).map(([id, deck]) => [id, deck.name]),
    );
    const models = new Map(
        Object.entries(JSON.parse(meta.models)).map(([id, model]) => [
            id,
            model.flds.map((field) => String(field.name || '').toLowerCase()),
        ]),
    );
    const rows = sqlite
        .prepare(
            `SELECT n.id, n.mid, n.flds, n.tags,
        (SELECT c.did FROM cards c WHERE c.nid=n.id ORDER BY c.ord LIMIT 1) AS did
        FROM notes n WHERE EXISTS (SELECT 1 FROM cards c WHERE c.nid=n.id) LIMIT ?`,
        )
        .all(MAX_NOTES + 1);
    if (rows.length > MAX_NOTES) throw invalid('Anki collection has more than 50,000 notes');
    const cards = [];
    const rootCounts = new Map();
    for (const row of rows) {
        const names = models.get(String(row.mid)) || [];
        const fields = String(row.flds || '')
            .split('\x1f')
            .map(plain);
        const termIndex = chooseField(fields, names, [
            /^word$/,
            /^phrase$/,
            /^front$/,
            /^term$/,
            /^expression$/,
            /^text$/,
        ]);
        const front = termIndex >= 0 ? termIndex : fields.findIndex(Boolean);
        const meaningIndex = chooseField(
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
            meaningIndex >= 0
                ? meaningIndex
                : fields.findIndex((field, index) => index !== front && field);
        const term = fields[front]?.slice(0, 500);
        const meaning = fields[back]?.slice(0, 4000);
        if (!term || !meaning) continue;
        const exampleIndex = chooseField(fields, names, [/^example$/, /example|sentence/], front);
        const deckName = String(deckNames.get(String(row.did)) || 'Imported Anki deck');
        const rootName = deckName.split('::')[0].trim();
        rootCounts.set(rootName, (rootCounts.get(rootName) || 0) + 1);
        cards.push({
            term,
            meaning,
            example:
                exampleIndex >= 0 && exampleIndex !== back
                    ? fields[exampleIndex].slice(0, 4000)
                    : '',
            tags: [
                deckName,
                ...String(row.tags || '')
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean),
            ].slice(0, 30),
        });
    }
    if (!cards.length) throw invalid('No vocabulary notes with a word and meaning were found');
    const name = [...rootCounts].sort((a, b) => b[1] - a[1])[0][0].slice(0, 120);
    return new Map([[name, cards]]);
}

function parseApkg(buffer) {
    if (!Buffer.isBuffer(buffer) || buffer.length < 16) throw invalid('Invalid .apkg file');
    if (buffer.length > MAX_UPLOAD_BYTES) throw invalid('Anki package exceeds 250 MB');
    let zip;
    try {
        zip = new AdmZip(buffer);
    } catch {
        throw invalid('Invalid .apkg ZIP file');
    }
    const entries = ['collection.anki21', 'collection.anki2']
        .map((name) => zip.getEntry(name))
        .filter(Boolean);
    if (!entries.length) throw invalid('This package has no supported Anki collection');
    const errors = [];
    for (const entry of entries) {
        if (entry.header.size > MAX_COLLECTION_BYTES) {
            errors.push('Anki collection exceeds 150 MB');
            continue;
        }
        let sqlite;
        try {
            sqlite = new Database(entry.getData());
            const decks = extractCards(sqlite);
            if (decks.size) return decks;
        } catch (error) {
            errors.push(error.status === 400 ? error.message : 'Unable to read Anki collection');
        } finally {
            sqlite?.close();
        }
    }
    throw invalid(errors[0] || 'No vocabulary cards found');
}

module.exports = { parseApkg, MAX_UPLOAD_BYTES };
