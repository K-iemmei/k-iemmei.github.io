import { database } from '../../core/database-client.js';
export async function loadDashboardData() {
    const userId = localStorage.getItem('userId');

    if (!userId || !database || typeof database.get !== 'function') {
        const dashboardData = { subjects: [], activities: [], chineseActivities: [] };
        return dashboardData;
    }

    try {
        const subjects = await database.get('subjects', {
            select: 'id, slug, name, color, description',
        });

        const englishSubject = Array.isArray(subjects)
            ? subjects.find(
                  (subject) =>
                      String(subject.slug || subject.name || '').toLowerCase() === 'english',
              )
            : null;

        const englishSubjectId = englishSubject ? englishSubject.id : null;

        const loadActivity = async (resultTable, fallbackSubjectId = null) => {
            try {
                return await database.get(resultTable, {
                    select: '*',
                    filters: { user_id: `eq.${userId}` },
                });
            } catch (resultError) {
                if (!fallbackSubjectId) return [];
                try {
                    return await database.get('subject_daily_activity', {
                        select: '*',
                        filters: {
                            user_id: `eq.${userId}`,
                            subject_id: `eq.${fallbackSubjectId}`,
                        },
                    });
                } catch (fallbackError) {
                    return [];
                }
            }
        };

        const [englishActivities, chineseActivities] = await Promise.all([
            loadActivity('english_daily_results', englishSubjectId),
            loadActivity('chinese_daily_results'),
        ]);

        const dashboardData = {
            subjects: Array.isArray(subjects) ? subjects : [],
            activities: Array.isArray(englishActivities) ? englishActivities : [],
            chineseActivities: Array.isArray(chineseActivities) ? chineseActivities : [],
        };

        return dashboardData;
    } catch (error) {
        console.warn('Unable to load dashboard data from local database:', error);
        const dashboardData = {
            subjects: [],
            activities: [],
            chineseActivities: [],
        };
        return dashboardData;
    }
}

export async function loadLeaderboard() {
    const userId = localStorage.getItem('userId');
    if (!userId || !database || typeof database.get !== 'function') {
        return [];
    }

    try {
        // Fetch daily results from both English and Chinese tables
        const [chineseResults, englishResults] = await Promise.all([
            database
                .get('chinese_daily_results', {
                    select: 'user_id, correct_count, total_count, activity_date, submitted_at',
                })
                .catch(() => []),
            database
                .get('english_daily_results', {
                    select: 'user_id, correct_count, total_count, activity_date, submitted_at',
                })
                .catch(() => []),
        ]);

        const allResults = [
            ...(Array.isArray(chineseResults) ? chineseResults : []),
            ...(Array.isArray(englishResults) ? englishResults : []),
        ];

        if (allResults.length === 0) {
            return [];
        }

        // Group active dates by user
        const userDatesMap = new Map();
        allResults.forEach((result) => {
            const uid = result.user_id;
            if (!uid) return;
            const dateStr = String(result.activity_date || result.submitted_at || '').slice(0, 10);
            if (!dateStr) return;

            if (!userDatesMap.has(uid)) {
                userDatesMap.set(uid, new Set());
            }
            userDatesMap.get(uid).add(dateStr);
        });

        // Calculate consecutive streak for each user
        const userStreaks = new Map();
        userDatesMap.forEach((datesSet, uid) => {
            const sortedDates = [...datesSet].sort();
            let streak = 0;
            if (sortedDates.length > 0) {
                const dateToNumber = (d) => Date.parse(`${d}T00:00:00`);
                let cursor = dateToNumber(sortedDates[sortedDates.length - 1]);
                for (let i = sortedDates.length - 1; i >= 0; i -= 1) {
                    if (dateToNumber(sortedDates[i]) !== cursor) break;
                    streak += 1;
                    cursor -= 86400000;
                }
            }
            userStreaks.set(uid, streak);
        });

        // Get user names
        const userNames = new Map();
        try {
            const users = await database.get('users', {
                select: 'id, name',
            });
            if (Array.isArray(users)) {
                users.forEach((user) => {
                    userNames.set(user.id, user.name || 'Hero');
                });
            }
        } catch (e) {
            console.warn('Could not fetch user names:', e);
        }

        // Convert to array and sort by streak
        const leaderboard = Array.from(userStreaks.entries())
            .map(([uid, streak]) => ({
                userId: uid,
                name: userNames.get(uid) || 'Hero',
                streak: streak,
            }))
            .sort((a, b) => b.streak - a.streak)
            .slice(0, 5);

        return leaderboard;
    } catch (error) {
        console.warn('Could not load leaderboard:', error);
        return [];
    }
}
