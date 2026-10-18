export function parseQuestionGroups(sourceText) {
    // Keep the legacy lightweight extractor for older manifest items.
    // This function is intentionally compact; it attempts to find question blocks and minimal grouping.
    const raw = String(sourceText || '');
    const lines = raw
        .split(/\n/)
        .map((l) => l.trim())
        .filter(Boolean);
    const groups = [];
    // Heuristic: split on lines like "Questions 1-13" or "Questions 14-26"
    const blockIndices = [];
    lines.forEach((line, idx) => {
        if (/^Questions\s+\d+\s*[-–]\s*\d+/i.test(line)) blockIndices.push(idx);
    });

    if (!blockIndices.length) {
        // fallback: put all discovered short-answer-like lines into a single group
        const questions = [];
        lines.forEach((line) => {
            const m = line.match(/^\s*(\d{1,3})\.\s*(.*)$/);
            if (m) {
                questions.push({ number: Number(m[1]), prompt: m[2] });
            }
        });
        if (questions.length)
            groups.push({ id: 'g-legacy-1', title: 'Questions', type: 'short_answer', questions });
        return groups;
    }

    for (let i = 0; i < blockIndices.length; i++) {
        const start = blockIndices[i];
        const end = blockIndices[i + 1] || lines.length;
        const header = lines[start];
        const rangeMatch = header.match(/Questions\s+(\d+)\s*[-–]\s*(\d+)/i);
        const questions = [];
        for (let j = start + 1; j < end; j++) {
            const m = lines[j].match(/^\s*(\d{1,3})\.\s*(.*)$/);
            if (m) questions.push({ number: Number(m[1]), prompt: m[2] });
            else if (/^A\.|^B\.|^C\.|^D\./.test(lines[j])) break; // likely choices begin
        }
        const type = rangeMatch ? 'short_answer' : 'short_answer';
        groups.push({
            id: `g-legacy-${i + 1}`,
            title: header,
            instructions: '',
            question_type: type,
            questions,
        });
    }

    return groups;
}
