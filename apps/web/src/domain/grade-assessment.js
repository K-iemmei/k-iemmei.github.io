// Scoring is independent of subjects, the DOM and persistence.
// Callers provide a normalizer appropriate to the language/question format.
export function gradeAnswers(
    questions,
    answerKey,
    responses,
    normalize = (value) =>
        String(value ?? '')
            .trim()
            .toLowerCase(),
) {
    const results = questions.map((question) => {
        const key = answerKey[question.number];
        const response = responses[question.number] ?? '';
        const accepted = Array.isArray(key?.answer)
            ? key.answer
            : typeof key?.answer === 'string'
              ? [key.answer]
              : [];
        const graded = accepted.length > 0;
        const correct =
            graded &&
            Boolean(String(response).trim()) &&
            accepted.some((answer) => normalize(response) === normalize(answer));
        return { ...question, response, key, graded, correct };
    });
    const graded = results.filter((result) => result.graded).length;
    const correct = results.filter((result) => result.correct).length;
    return {
        results,
        graded,
        correct,
        total: results.length,
        score: graded ? Math.round((correct / graded) * 100) : null,
    };
}
