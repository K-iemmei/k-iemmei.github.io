const { questionTypes } = require('../../apps/api/modules/reading/question-types');
function manualReading(slug = 'manual-reading-check') {
    const options = [
        { id: 'A', text: 'Speed without review' },
        { id: 'B', text: 'Learning with feedback' },
        { id: 'C', text: 'Regular practice' },
    ];
    const groups = questionTypes.map((type) => ({
        group_type: type.id,
        title: type.label,
        instructions:
            type.kind === 'checkbox'
                ? 'Choose TWO options.'
                : 'Answer the question using the passage.',
        options: type.sharedOptions ? options : [],
        metadata: {
            summary: type.summary ? 'Useful ___ identifies mistakes.' : '',
            paragraphs: type.paragraphs
                ? 'A | Feedback identifies mistakes.\nB | Practice strengthens recall.'
                : '',
        },
        questions: [
            {
                question_type: type.id,
                prompt:
                    type.kind === 'text'
                        ? 'What identifies mistakes?'
                        : type.choices
                          ? 'Feedback identifies mistakes.'
                          : 'Choose the heading or statement about learning.',
                options: type.questionOptions ? options : [],
                answer_key: {
                    answers:
                        type.kind === 'text'
                            ? ['feedback']
                            : type.choices
                              ? [type.choices[0]]
                              : type.kind === 'checkbox'
                                ? ['B', 'C']
                                : ['B'],
                    case_sensitive: false,
                },
                metadata: {
                    label: type.sharedOptions ? 'Paragraph A' : '',
                    explanation:
                        'The passage explains the benefits of feedback and regular practice.',
                },
            },
        ],
    }));
    groups[0].questions.push({
        ...structuredClone(groups[0].questions[0]),
        prompt: 'Choose a heading for paragraph B.',
        metadata: { label: 'Paragraph B', explanation: 'Both paragraphs concern learning.' },
    });
    return {
        title: 'Manual Reading: Learning and Feedback',
        slug,
        category: 'General Reading',
        description: 'A manually authored demonstration covering each supported question type.',
        status: 'published',
        passages: [
            {
                title: 'Learning with feedback',
                content:
                    'Feedback identifies mistakes. Regular practice strengthens recall.\n\nLearning improves when people review their work and practise regularly.',
                groups,
            },
            {
                title: 'Reviewing your work',
                content: 'Feedback is useful when reviewing your work.',
                groups: [
                    {
                        group_type: 'short_answer',
                        title: 'Second passage',
                        instructions: 'Use one word.',
                        options: [],
                        metadata: {},
                        questions: [
                            {
                                question_type: 'short_answer',
                                prompt: 'What is useful when reviewing work?',
                                options: [],
                                answer_key: { answers: ['feedback'] },
                                metadata: { explanation: 'The passage says feedback is useful.' },
                            },
                        ],
                    },
                ],
            },
        ],
    };
}
module.exports = { manualReading };
