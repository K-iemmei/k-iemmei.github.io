// Subject identity and practice format are independent: any subject can use flashcards.
export const activityTypes = Object.freeze({
    flashcards: { label: 'Flashcards', status: 'planned' },
    reading: { label: 'Reading', status: 'available' },
    listening: { label: 'Listening', status: 'planned' },
    grammar: { label: 'Grammar', status: 'planned' },
    vocabulary: { label: 'Vocabulary', status: 'planned' },
});

export const subjects = [
    {
        id: 'english',
        name: 'English',
        icon: 'E',
        href: 'english-home.html',
        description: 'Reading, listening and vocabulary',
        activities: [
            {
                type: 'reading',
                href: 'english-reading-library.html',
                description: 'Practice your manually authored reading tests.',
            },
            { type: 'listening', description: 'Audio practice and submitted answers.' },
            { type: 'grammar', description: 'Practice sentence patterns and common errors.' },
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
