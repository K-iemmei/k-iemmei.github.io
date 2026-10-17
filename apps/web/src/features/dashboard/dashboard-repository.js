import { database, apiRequest } from '../../core/database-client.js';
import { flushListeningActivity } from '../english/listening-tracker.js';
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
        await flushListeningActivity().catch(() => {});
        let englishTrackingError = false;
        const [englishActivities, chineseActivities] = await Promise.all([
            apiRequest('/api/tracking/english').catch((error) => {
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
    const result = await apiRequest('/api/tracking/leaderboard?date=' + encodeURIComponent(date));
    return result.users;
}
