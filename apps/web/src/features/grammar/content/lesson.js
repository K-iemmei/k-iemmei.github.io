// Original bilingual lessons. Level labels describe this course's learning order.
export function lesson(id, title, subtitle, level, summary, rules, examples, mistake, check) {
    return {
        id,
        title,
        subtitle,
        level,
        summary,
        rules: rules.map(([title, explanation, pattern]) => ({ title, explanation, pattern })),
        examples: examples.map(([context, english, vietnamese]) => ({
            context,
            english,
            vietnamese,
        })),
        mistake: { incorrect: mistake[0], correct: mistake[1], explanation: mistake[2] },
        check: { question: check[0], options: check[1], answer: check[2], explanation: check[3] },
    };
}
