// Subject identity and practice format are independent: any subject can use flashcards.
export const activityTypes = Object.freeze({
    flashcards: { label: 'Flashcards', status: 'planned' },
    reading: { label: 'Reading', status: 'available' },
    listening: { label: 'Listening', status: 'available' },
    grammar: { label: 'Grammar', status: 'available' },
    vocabulary: { label: 'Vocabulary', status: 'planned' },
});

export const subjects = [
    {
        id: 'english',
        name: 'English',
        icon: 'E',
        href: 'english-home.html',
        description: 'Reading, listening, grammar & vocabulary',
        activities: [
            {
                type: 'reading',
                href: 'english-reading-library.html',
                description: 'Practice your manually authored reading tests.',
            },
            {
                type: 'listening',
                href: 'english-listening-library.html',
                description: 'IELTS parts and dictation practice.',
            },
            {
                type: 'grammar',
                href: 'english-grammar.html',
                description:
                    'English Grammar in Use · 145 units, with interactive practice added in batches.',
            },
            {
                type: 'vocabulary',
                href: 'vocabulary.html',
                description: 'Review useful words, collocations and word patterns.',
            },
        ],
    },
    {
        id: 'chinese',
        name: 'Chinese',
        icon: '中',
        href: 'chinese.html',
        description: 'Daily reading practice',
        activities: [{ type: 'reading', href: 'chinese.html' }],
    },
    {
        id: 'data-ai-ml',
        name: 'Data / AI / ML',
        icon: 'AI',
        description: 'Concepts, notes and flashcards',
        activities: [{ type: 'flashcards' }],
    },
];

export function getSubject(id) {
    return subjects.find((subject) => subject.id === id);
}
