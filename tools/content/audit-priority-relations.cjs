const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const root = path.resolve(__dirname, '../..');
async function loadCatalog() {
    const { priorityCatalog } = await import(
        pathToFileURL(
            path.join(root, 'apps/web/src/features/vocabulary/content/priority-catalog.js'),
        )
    );
    const contents = new Map();
    for (const letter of new Set(priorityCatalog.map((word) => word.letter))) {
        const { words } = await import(
            pathToFileURL(
                path.join(root, `apps/web/src/features/vocabulary/content/priority/${letter}.js`),
            )
        );
        for (const word of words) contents.set(word.id, word);
    }
    return { words: priorityCatalog, contents };
}
async function auditRelations() {
    const { words, contents } = await loadCatalog();
    const { createPriorityRelationIndex } = await import(
        pathToFileURL(path.join(root, 'apps/web/src/domain/priority-relations.js'))
    );
    const {
        priorityRelationGroups: groups,
        priorityRelationStandalone: standalone,
        relationSelector,
    } = await import(
        pathToFileURL(
            path.join(root, 'apps/web/src/features/vocabulary/content/priority-relation-groups.js'),
        )
    );
    const selectors = new Map(words.map((word) => [relationSelector(word), word]));
    assert.equal(words.length, 2000, 'Audit must include every built-in card');
    assert.equal(selectors.size, words.length, 'Ambiguous card selector');
    assert.equal(new Set(words.map((word) => word.id)).size, words.length, 'Duplicate card ID');
    const memberships = new Map(words.map((word) => [word.id, []]));
    const validKinds = new Set(['meaning', 'family', 'contrast', 'topic']);
    for (const group of groups) {
        assert(validKinds.has(group.kind), `Unknown kind: ${group.id}`);
        assert(group.label.trim(), `Missing label: ${group.id}`);
        if (group.kind === 'contrast') {
            assert.equal(group.sides?.length, 2, `Contrast needs two sides: ${group.id}`);
            assert(
                group.sides.every((side) => side.length),
                `Empty contrast side: ${group.id}`,
            );
        }
        assert(
            group.members.length >= 2 && group.members.length <= 8,
            `Group must contain 2–8 cards: ${group.id}`,
        );
        assert.equal(
            new Set(group.members).size,
            group.members.length,
            `Duplicate member: ${group.id}`,
        );
        for (const selector of group.members) {
            assert(selectors.has(selector), `Unknown member: ${selector}`);
            memberships.get(selectors.get(selector).id).push(group);
        }
    }
    const index = createPriorityRelationIndex(words, contents);
    for (const group of groups) {
        for (let i = 0; i < group.members.length; i++) {
            for (let j = i + 1; j < group.members.length; j++) {
                const a = group.members[i],
                    b = group.members[j];
                if (group.sides?.some((side) => side.includes(a) && side.includes(b))) continue;
                assert(
                    index
                        .get(selectors.get(a).id)
                        .some(
                            (link) =>
                                link.word.id === selectors.get(b).id &&
                                link.relations.some((relation) => relation.id === group.id),
                        ),
                    `Missing declared relationship: ${group.id}: ${a} / ${b}`,
                );
            }
        }
    }
    const reasons = new Map(standalone.map((item) => [item.member, item.reason]));
    for (const item of standalone) {
        assert(selectors.has(item.member), `Unknown standalone card: ${item.member}`);
        assert(item.reason.trim(), `Missing standalone explanation: ${item.member}`);
        assert.equal(
            index.get(selectors.get(item.member).id).length,
            0,
            `Standalone has links: ${item.member}`,
        );
    }
    for (const word of words) {
        assert(contents.get(word.id)?.senses.length, `Missing meanings: ${word.id}`);
        const links = index.get(word.id);
        assert(
            links.length || reasons.has(relationSelector(word)),
            `Unreviewed card: ${relationSelector(word)}`,
        );
        assert.equal(
            new Set(links.map(({ word: target }) => target.id)).size,
            links.length,
            `Duplicate edge: ${word.id}`,
        );
        for (const link of links) {
            assert.notEqual(link.word.id, word.id, `Self-link: ${word.id}`);
            assert(
                index.get(link.word.id).some(({ word: target }) => target.id === word.id),
                `Asymmetric link: ${word.id}`,
            );
            assert(
                link.relations.every((relation) =>
                    groups.some(
                        (group) =>
                            group.id === relation.id &&
                            group.members.includes(relationSelector(word)) &&
                            group.members.includes(relationSelector(link.word)) &&
                            !group.sides?.some(
                                (side) =>
                                    side.includes(relationSelector(word)) &&
                                    side.includes(relationSelector(link.word)),
                            ),
                    ),
                ),
                `Unexplained link: ${word.id}`,
            );
        }
    }
    const linked = words.filter((word) => index.get(word.id).length).length;
    const pairs = [...index.values()].reduce((sum, links) => sum + links.length, 0) / 2;
    const digest = createHash('sha256')
        .update(JSON.stringify({ words, contents: [...contents], groups, standalone }))
        .digest('hex');
    const cell = (text) => String(text).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
    const lines = [
        '# Priority vocabulary relationship audit',
        '',
        'Generated by `node tools/content/audit-priority-relations.cjs --write`; verify with `--check`.',
        '',
        `Reviewed scope: **${words.length} built-in cards**, **${groups.length} direct study groups**, **${pairs} undirected card pairs**.`,
        `${linked} cards have links; ${words.length - linked} are explicitly reviewed standalones. Custom account data is excluded from this report.`,
        '',
        'Review means each supplied card and its group assignments were considered against the supplied meanings. It is not a claim of exhaustive English synonym coverage or a full dictionary-content audit.',
        '',
        'Built-in links use explicit, labelled groups. Dictionary parentheses, coincidental text matches and transitive group expansion cannot create additional built-in links. Same spelling with different qualifiers identifies separate cards.',
        '',
        'Kinds: `meaning` = related/near meanings, `family` = word family, `contrast` = a deliberate comparison across two sides (shown as A ↔ B), `topic` = shared subject. A contrast group does not label two members of the same side as opposites. Related words are not necessarily interchangeable in a sentence.',
        '',
        'The previous automatic matcher could connect absorb/lighting, beneficiary/coordination, completion/tackle, and constitutional/beneficial through dictionary examples or incidental phrases. Those links are removed. `fit` is the noun card, `prompt` is a verb card and `elaborate` is an adjective card; assignments follow those senses.',
        '',
        'The clearly mismatched definition of `irony` (previously “giống thép; giống gang”) was corrected to its noun senses before linking it to `ironically`. Other source definitions may still need separate editorial work.',
        '',
        `Input SHA-256: \`${digest}\``,
        '',
        '## Reviewed standalone cards',
        '',
        '<!-- prettier-ignore -->',
        '| Card | Reason |',
        '| --- | --- |',
        ...standalone.map((item) => `| ${cell(item.member)} | ${cell(item.reason)} |`),
        '',
        '## All reviewed groups',
        '',
        '<!-- prettier-ignore -->',
        '| Group | Kind | Shared meaning / subject | Exact card selectors |',
        '| --- | --- | --- | --- |',
        ...groups.map(
            (group) =>
                `| ${group.id} | ${group.kind} | ${cell(group.label)} | ${cell(group.sides ? group.sides.map((side) => side.join('; ')).join(' ↔ ') : group.members.join('; '))} |`,
        ),
        '',
        '## Every card and its direct links',
        '',
        '<!-- prettier-ignore -->',
        '| # | Card ID | Card | Supplied meanings | Groups | Related cards |',
        '| --- | --- | --- | --- | --- | --- |',
        ...words.map(
            (word, i) =>
                `| ${i + 1} | ${word.id} | ${cell(relationSelector(word))} | ${cell(
                    contents
                        .get(word.id)
                        .senses.map((sense) => sense.meaning)
                        .join('; '),
                )} | ${
                    memberships
                        .get(word.id)
                        .map((group) => group.id)
                        .join(', ') || 'Reviewed standalone'
                } | ${
                    cell(
                        index
                            .get(word.id)
                            .map(({ word: target }) => relationSelector(target))
                            .join('; '),
                    ) || '—'
                } |`,
        ),
        '',
    ];
    return { report: lines.join('\n'), words, contents, index, groups, linked, pairs };
}
module.exports = { loadCatalog, auditRelations };
if (require.main === module)
    (async () => {
        if (process.argv.includes('--write') || process.argv.includes('--check')) {
            const audit = await auditRelations();
            const file = path.join(root, 'docs/priority-vocabulary-relations-audit.md');
            if (process.argv.includes('--write')) fs.writeFileSync(file, audit.report);
            else
                assert.equal(
                    fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n'),
                    audit.report,
                    'Audit report is stale; run --write',
                );
            console.log(
                `Audited ${audit.words.length} cards, ${audit.groups.length} groups, ${audit.pairs} pairs; ${audit.linked} linked cards.`,
            );
            return;
        }
        const { words, contents } = await loadCatalog();
        const { relatedPriorityWords, createPriorityRelationIndex } = await import(
            pathToFileURL(path.join(root, 'apps/web/src/domain/priority-relations.js'))
        );
        const index = createPriorityRelationIndex(words, contents);
        const start = Number(process.argv[2] || 0),
            count = Number(process.argv[3] || words.length);
        for (const [index, word] of words.slice(start, start + count).entries()) {
            const relations = process.argv.includes('--inventory')
                ? []
                : relatedPriorityWords(word, words, contents, index);
            console.log(
                `${start + index + 1}. ${word.term}${word.qualifier ? ` (${word.qualifier})` : ''} | ${contents
                    .get(word.id)
                    .senses.map((sense) => sense.meaning)
                    .join(
                        '; ',
                    )} | => ${relations.map(({ word: related }) => related.term + (related.qualifier ? ` (${related.qualifier})` : '')).join(', ') || '—'}`,
            );
        }
    })().catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
