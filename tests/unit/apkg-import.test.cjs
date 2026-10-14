const { test } = require('node:test');
const assert = require('node:assert/strict');
const AdmZip = require('adm-zip');
const Database = require('better-sqlite3');
const { parseApkg } = require('../../apps/api/modules/vocabulary/apkg-import');

function collection({ placeholder = false } = {}) {
    const sqlite = new Database(':memory:');
    sqlite.exec(
        'CREATE TABLE col (decks TEXT, models TEXT); CREATE TABLE notes (id INTEGER, mid INTEGER, flds TEXT, tags TEXT); CREATE TABLE cards (nid INTEGER, did INTEGER, ord INTEGER)',
    );
    const deckName = placeholder ? 'Default' : 'Daily words::Verbs';
    sqlite.prepare('INSERT INTO col VALUES (?,?)').run(
        JSON.stringify({ 1: { name: deckName } }),
        JSON.stringify({
            2: {
                flds: (placeholder
                    ? ['Front', 'Back']
                    : ['Word', 'Part of speech', 'Definition (TV)', 'Example']
                ).map((name) => ({ name })),
            },
        }),
    );
    sqlite
        .prepare('INSERT INTO notes VALUES (1,2,?,?)')
        .run(
            placeholder
                ? 'Please update Anki\x1f'
                : 'resilient\x1fadjective\x1fkiên cường\x1fShe is resilient.',
            '',
        );
    sqlite.prepare('INSERT INTO cards VALUES (1,1,0)').run();
    sqlite.prepare('INSERT INTO cards VALUES (1,1,1)').run();
    const bytes = sqlite.serialize();
    sqlite.close();
    return bytes;
}

test('modern .apkg collection takes precedence over legacy placeholder and maps named fields', () => {
    const zip = new AdmZip();
    zip.addFile('collection.anki2', collection({ placeholder: true }));
    zip.addFile('collection.anki21', collection());
    const decks = parseApkg(zip.toBuffer());
    assert.equal(decks.size, 1);
    assert.deepEqual(
        decks.get('Daily words').map(({ term, meaning, example }) => ({ term, meaning, example })),
        [{ term: 'resilient', meaning: 'kiên cường', example: 'She is resilient.' }],
    );
});
