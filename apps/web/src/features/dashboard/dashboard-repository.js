import { database, apiRequest } from '../../core/database-client.js';
import { flushListeningActivity } from '../english/listening-tracker.js';
export async function loadDashboardData() {
    const userId = localStorage.getItem('userId');

    if (!userId || !database || typeof database.get !== 'function') {
        const dashboardData = { subjects: [], activities: [], chineseActivities: [] };
        return dashboardData;
    }

    try {
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

        // Flush any playback saved before leaving Listening, then fetch authoritative totals.
        let englishTrackingError = false;
        const [subjects, englishActivities, chineseActivities] = await Promise.all([
            database
                .get('subjects', { select: 'id, slug, name, color, description' })
                .catch((error) => {
                    console.warn('Unable to load subjects:', error);
                    return [];
                }),
            flushListeningActivity()
                .catch(() => {})
                .then(() => apiRequest('/api/tracking/english'))
                .catch((error) => {
                    console.warn('Unable to load English tracking:', error);
                    englishTrackingError = true;
                    return [];
                }),
            loadActivity('chinese_daily_results'),
        ]);

        const dashboardData = {
            englishTrackingError,
            subjects: Array.isArray(subjects) ? subjects : [],
            activities: Array.isArray(englishActivities) ? englishActivities : [],
            chineseActivities: Array.isArray(chineseActivities) ? chineseActivities : [],
        };

        return dashboardData;
    } catch (error) {
        console.warn('Unable to load dashboard data from local database:', error);
        const dashboardData = {
            englishTrackingError: true,
            subjects: [],
            activities: [],
            chineseActivities: [],
        };
        return dashboardData;
    }
}

export async function loadLeaderboard(date) {
    await flushListeningActivity().catch(() => {});
    const result = await apiRequest(
        '/api/tracking/leaderboard' + (date ? '?date=' + encodeURIComponent(date) : ''),
    );
    return result.users;
}
