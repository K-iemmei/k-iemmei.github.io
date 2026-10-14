import { database } from '../../core/database-client.js';

export const lessons = {
    async latest() {
        const rows = await database.get('chinese_lessons', {
            filters: { is_active: 'eq.true' },
            order: { column: 'lesson_date', direction: 'desc' },
        });
        return Array.isArray(rows) ? rows[0] : null;
    },
    parts(lessonId) {
        return database.get('chinese_lesson_parts', {
            filters: { lesson_id: `eq.${lessonId}` },
            order: { column: 'part_order', direction: 'asc' },
        });
    },
    questions(lessonId) {
        return database.get('chinese_questions', {
            filters: { lesson_id: `eq.${lessonId}` },
            order: { column: 'order_index', direction: 'asc' },
        });
    },
    answers(userId, lessonId) {
        return database.get('chinese_user_answers', {
            filters: { user_id: `eq.${userId}`, lesson_id: `eq.${lessonId}` },
        });
    },
    // Retains the existing backend contract. A future RPC should make this atomic.
    async saveResult(userId, lessonId, activityDate, answers) {
        const filters = { user_id: `eq.${userId}`, lesson_id: `eq.${lessonId}` };
        const correct = answers.filter((answer) => answer.is_correct).length;
        await database.delete('chinese_user_answers', { filters });
        await database.create('chinese_user_answers', answers);
        await database.delete('chinese_daily_results', { filters });
        await database.create('chinese_daily_results', {
            user_id: userId,
            lesson_id: lessonId,
            activity_date: activityDate,
            correct_count: correct,
            total_count: answers.length,
            score_percent: answers.length
                ? Number(((correct / answers.length) * 100).toFixed(2))
                : 0,
            submitted_at: new Date().toISOString(),
        });
    },
};
