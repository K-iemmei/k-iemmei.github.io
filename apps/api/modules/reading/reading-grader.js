function normalize(value, caseSensitive = false) {
    const text = String(value ?? '')
        .normalize('NFKC')
        .trim()
        .replace(/\s+/g, ' ');
    return caseSensitive ? text : text.toLocaleLowerCase('en');
}
function gradeTest(test, responses) {
    if (!responses || typeof responses !== 'object' || Array.isArray(responses))
        throw Object.assign(new Error('Responses must be an object'), { status: 400 });
    const questions = test.passages.flatMap((p, pi) =>
        p.groups.flatMap((g, gi) => g.questions.map((q) => ({ ...q, answerScope: `${pi}:${gi}` }))),
    );
    const usedAnswers = new Map();
    const ids = new Set(questions.map((q) => q.id));
    if (Object.keys(responses).some((id) => !ids.has(id)))
        throw Object.assign(new Error('Questions changed. Reload the test.'), { status: 409 });
    const review = questions.map((question, index) => {
        const response = responses[question.id] ?? '';
        const key = question.answer_key;
        if (
            !(
                typeof response === 'string' ||
                (Array.isArray(response) && response.every((value) => typeof value === 'string'))
            ) ||
            JSON.stringify(response).length > 10000
        )
            throw Object.assign(new Error('Invalid answer'), { status: 400 });
        const clean = (value) => normalize(value, key.case_sensitive);
        const accepted = key.answers.map(clean);
        const alias =
            typeof response === 'string' &&
            (key.aliases || []).find((a) => clean(a.value) === clean(response));
        const canonicalResponse = alias ? clean(alias.answer) : clean(response);
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
                accepted.includes(canonicalResponse);
        if (correct && key.distinct_group) {
            const scope = question.answerScope + ':' + key.distinct_group;
            if (!usedAnswers.has(scope)) usedAnswers.set(scope, new Set());
            const used = usedAnswers.get(scope);
            if (used.has(canonicalResponse)) correct = false;
            else used.add(canonicalResponse);
        }
        return {
            question_id: question.id,
            question_number: question.metadata.source_number || index + 1,
            prompt: question.prompt,
            response,
            is_graded: accepted.length > 0,
            is_correct: correct,
            correct_answer: key.answers,
            explanation: question.metadata.explanation || '',
        };
    });
    const correct = review.filter((row) => row.is_correct).length;
    const graded = review.filter((row) => row.is_graded).length;
    return {
        review,
        responses,
        correct_count: correct,
        total_count: review.length,
        graded_count: graded,
        score_percent: graded ? Math.round((correct / graded) * 10000) / 100 : null,
    };
}
module.exports = { gradeTest };
