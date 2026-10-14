export function gradeTest(test, responses) {
    if (!responses || typeof responses !== 'object' || Array.isArray(responses))
        throw new Error('Responses must be an object');
    const questions = test.passages.flatMap((passage, pi) =>
        passage.groups.flatMap((group, gi) =>
            group.questions.map((question) => ({ ...question, scope: `${pi}:${gi}` })),
        ),
    );
    const ids = new Set(questions.map((question) => question.id));
    if (Object.keys(responses).some((id) => !ids.has(id)))
        throw new Error('Questions changed. Reload the test.');
    const used = new Map();
    const review = questions.map((question, index) => {
        const response = responses[question.id] ?? '';
        if (
            !(
                typeof response === 'string' ||
                (Array.isArray(response) && response.every((value) => typeof value === 'string'))
            ) ||
            JSON.stringify(response).length > 10000
        )
            throw new Error('Invalid answer');
        const key = question.answer_key || { answers: [] };
        const clean = (value) => {
            const text = String(value ?? '')
                .normalize('NFKC')
                .trim()
                .replace(/\s+/g, ' ');
            return key.case_sensitive ? text : text.toLocaleLowerCase('en');
        };
        const accepted = (key.answers || []).map(clean);
        const alias =
            typeof response === 'string' &&
            (key.aliases || []).find((item) => clean(item.value) === clean(response));
        const canonical = alias ? clean(alias.answer) : clean(response);
        let correct = false;
        if (accepted.length && key.match === 'all') {
            const actual = Array.isArray(response) ? response.map(clean) : [];
            correct =
                actual.length === new Set(actual).size &&
                actual.length === accepted.length &&
                accepted.every((answer) => actual.includes(answer));
        } else
            correct =
                typeof response === 'string' &&
                clean(response) !== '' &&
                accepted.includes(canonical);
        if (correct && key.distinct_group) {
            const scope = `${question.scope}:${key.distinct_group}`;
            if (!used.has(scope)) used.set(scope, new Set());
            if (used.get(scope).has(canonical)) correct = false;
            else used.get(scope).add(canonical);
        }
        return {
            question_id: question.id,
            question_number: question.metadata?.source_number || index + 1,
            prompt: question.prompt,
            response,
            is_graded: accepted.length > 0,
            is_correct: correct,
            correct_answer: key.answers || [],
            explanation: question.metadata?.explanation || '',
        };
    });
    const correct_count = review.filter((row) => row.is_correct).length;
    const graded_count = review.filter((row) => row.is_graded).length;
    return {
        review,
        responses,
        correct_count,
        graded_count,
        total_count: review.length,
        score_percent: graded_count
            ? Math.round((correct_count / graded_count) * 10000) / 100
            : null,
    };
}
