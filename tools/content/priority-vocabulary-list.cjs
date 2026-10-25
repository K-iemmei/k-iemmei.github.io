const crypto = require('node:crypto');
const pos = /\b(?:n|v|adj|adv|prep|pron|det|exclam|conj)\.|\bnumber\b/i;
function parsePriorityList(source) {
    const lines = [];
    for (const raw of source.replace(/^\uFEFF/, '').split(/\r?\n/)) {
        const line = raw.trim();
        if (!line) continue;
        if (
            lines.length &&
            (/^(?:[,/]|\d+\s|(?:n|v|adj|adv|prep|pron|det|exclam|conj)\.)/i.test(line) ||
                !pos.test(lines.at(-1)))
        )
            lines[lines.length - 1] += ' ' + line;
        else lines.push(line);
    }
    const seen = new Set();
    return lines
        .map((line) => {
            const position = line.search(pos);
            if (position < 1) throw Error('Cannot parse vocabulary line: ' + line);
            let headword = line
                .slice(0, position)
                .trim()
                .toLowerCase()
                .replace(/\s*\d+$/, '');
            const qualifier = headword.match(/\s+\((.*)\)$/)?.[1] || '';
            const term = headword.replace(/\s+\(.*\)$/, '').trim();
            const metadata = line
                .slice(position)
                .replace(/\s*,\s*/g, ', ')
                .replace(/\s*\/\s*/g, '/');
            const level = [...new Set(metadata.match(/\b(?:A1|A2|B1|B2|C1|C2)\b/g) || [])].join(
                ' / ',
            );
            const parts = [
                ...new Set(
                    metadata.match(/(?:n|v|adj|adv|prep|pron|det|exclam|conj)\.|number\b/g) || [],
                ),
            ].join(', ');
            const identity = term + (qualifier ? ' (' + qualifier + ')' : '');
            if (!term || !level || seen.has(identity))
                throw Error('Missing or duplicate vocabulary: ' + line);
            seen.add(identity);
            return {
                id: 'pv-' + crypto.createHash('sha256').update(identity).digest('hex').slice(0, 16),
                term,
                qualifier,
                pos: parts,
                level,
                letter: term
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .charAt(0)
                    .toUpperCase(),
            };
        })
        .sort(
            (a, b) =>
                a.term.localeCompare(b.term, 'en') || a.qualifier.localeCompare(b.qualifier, 'en'),
        );
}
module.exports = { parsePriorityList };
