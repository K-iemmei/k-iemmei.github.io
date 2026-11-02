import {
    priorityRelationGroups,
    relationSelector,
} from '../features/vocabulary/content/priority-relation-groups.js';

const kinds = {
    meaning: { label: 'Gần nghĩa', score: 4 },
    family: { label: 'Họ từ', score: 3 },
    contrast: { label: 'Tương phản', score: 2 },
    topic: { label: 'Cùng chủ đề', score: 1 },
};

// Parenthetical dictionary notes and examples are not separate definitions.
// Keep accents and whole phrases; matching isolated syllables is too noisy.
function phrases(content) {
    return new Set(
        (content?.senses || []).flatMap(({ meaning }) =>
            String(meaning)
                .normalize('NFC')
                .toLocaleLowerCase('vi')
                .replace(/\([^)]*\)/g, '')
                .split(/[;,]/)
                .map((part) =>
                    part
                        .trim()
                        .replace(/^(sự|việc|tính|một cách)\s+/, '')
                        .replace(/\s+/g, ' '),
                )
                .filter((part) => part.length >= 5 && part.split(' ').length >= 2),
        ),
    );
}

export function createPriorityRelationIndex(words, contents) {
    const selectors = new Map(
        words.filter((word) => !word.custom).map((word) => [relationSelector(word), word]),
    );
    const edges = new Map(words.map((word) => [word.id, new Map()]));
    function connect(a, b, relation) {
        if (a.id === b.id) return;
        for (const [from, to] of [
            [a, b],
            [b, a],
        ]) {
            const targets = edges.get(from.id);
            if (!targets.has(to.id)) targets.set(to.id, { word: to, relations: [] });
            const entry = targets.get(to.id);
            if (!entry.relations.some((item) => item.id === relation.id))
                entry.relations.push(relation);
        }
    }
    for (const group of priorityRelationGroups) {
        const members = group.members.map((member) => selectors.get(member)).filter(Boolean);
        const relation = { id: group.id, kind: group.kind, label: group.label };
        for (let i = 0; i < members.length; i++)
            for (let j = i + 1; j < members.length; j++) {
                if (
                    group.sides?.some(
                        (side) =>
                            side.includes(relationSelector(members[i])) &&
                            side.includes(relationSelector(members[j])),
                    )
                )
                    continue;
                connect(members[i], members[j], relation);
            }
    }
    // User-created cards cannot be pre-reviewed. Show an explicitly labelled
    // phrase suggestion only when at least one endpoint is a custom card.
    const meanings = new Map();
    for (const word of words)
        for (const phrase of phrases(contents.get(word.id))) {
            if (!meanings.has(phrase)) meanings.set(phrase, []);
            meanings.get(phrase).push(word);
        }
    for (const [phrase, members] of meanings) {
        for (const custom of members.filter((word) => word.custom))
            for (const other of members)
                connect(custom, other, {
                    id: `phrase:${phrase}`,
                    kind: 'suggestion',
                    label: `Cùng cụm nghĩa: ${phrase}`,
                });
    }
    return new Map(
        [...edges].map(([id, targets]) => [
            id,
            [...targets.values()]
                .map((entry) => {
                    entry.relations.sort(
                        (a, b) =>
                            (kinds[b.kind]?.score || 0) - (kinds[a.kind]?.score || 0) ||
                            a.label.localeCompare(b.label, 'vi'),
                    );
                    const first = entry.relations[0];
                    return {
                        ...entry,
                        reason:
                            first.kind === 'suggestion'
                                ? `Gợi ý · ${first.label}`
                                : `${kinds[first.kind].label} · ${first.label}`,
                        score: kinds[first.kind]?.score || 0,
                    };
                })
                .sort(
                    (a, b) =>
                        b.score - a.score ||
                        a.word.term.localeCompare(b.word.term, 'en') ||
                        a.word.id.localeCompare(b.word.id),
                ),
        ]),
    );
}

export function relatedPriorityWords(selected, words, contents, index) {
    return (index || createPriorityRelationIndex(words, contents)).get(selected.id) || [];
}
