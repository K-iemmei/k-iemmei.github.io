// This API deliberately implements only the small query subset used by the app.
const readable = new Set([
    'users',
    'subjects',
    'topics',
    'subject_daily_activity',
    'english_daily_results',
    'chinese_daily_results',
    'chinese_lessons',
    'chinese_lesson_parts',
    'chinese_questions',
    'chinese_user_answers',
]);
const writable = new Set(['chinese_user_answers', 'chinese_daily_results']);
const privateTables = new Set([
    'chinese_user_answers',
    'subject_daily_activity',
    'english_daily_results',
    'chinese_daily_results',
]);
const identifier = (name) => {
    if (!/^[a-z_][a-z0-9_]*$/.test(name))
        throw Object.assign(new Error('Invalid identifier'), { status: 400 });
    return '"' + name + '"';
};
module.exports = { readable, writable, privateTables, identifier };
