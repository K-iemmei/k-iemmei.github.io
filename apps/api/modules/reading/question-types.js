const questionTypes = [
    {
        id: 'matching_headings',
        label: 'Matching heading',
        kind: 'select',
        sharedOptions: true,
        paragraphs: true,
    },
    {
        id: 'choose_heading',
        label: 'Choose heading',
        kind: 'select',
        sharedOptions: true,
        paragraphs: true,
    },
    { id: 'classification', label: 'Classification', kind: 'select', sharedOptions: true },
    { id: 'summary_completion', label: 'Complete the summary', kind: 'text', summary: true },
    { id: 'sentence_completion', label: 'Sentence completion', kind: 'text' },
    {
        id: 'true_false_not_given',
        label: 'True / False / Not Given',
        kind: 'select',
        choices: ['True', 'False', 'Not Given'],
    },
    {
        id: 'yes_no_not_given',
        label: 'Yes / No / Not Given',
        kind: 'select',
        choices: ['Yes', 'No', 'Not Given'],
    },
    { id: 'multiple_choice', label: 'Multiple choice', kind: 'radio', questionOptions: true },
    { id: 'short_answer', label: 'Short answer', kind: 'text' },
    {
        id: 'list_selection',
        label: 'List selection (choose several)',
        kind: 'checkbox',
        questionOptions: true,
    },
];
const typeMap = new Map(questionTypes.map((type) => [type.id, type]));
module.exports = { questionTypes, typeMap };
