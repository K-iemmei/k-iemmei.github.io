// Practice data never includes answer keys. IDs are stable for one test version.
export function adaptReadingTest(test) {
    let number = 0;
    const groups = test.passages.flatMap((passage) =>
        passage.groups.map((group) => ({
            ...group,
            passageTitle: passage.title || `Passage ${passage.passage_order}`,
            questions: group.questions.map((question) => ({
                ...question,
                number: question.metadata.source_number || number + 1,
                position: ++number,
                options: question.options.length ? question.options : group.options,
            })),
        })),
    );
    return {
        id: test.id,
        title: test.title,
        description: test.description,
        version: test.version,
        ungradedCount: test.ungraded_count || 0,
        passages: test.passages,
        groups,
    };
}
