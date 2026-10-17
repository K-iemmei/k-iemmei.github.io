import { validateListeningBatch, leaderboardDate } from '../../../apps/web/src/domain/english-tracking.js';

export async function trackingApi(admin: any, user: { id: string }, path: string, method: string, body: any, url?: URL) {
    let result;
    if (path === '/api/tracking/leaderboard' && method === 'GET') {
        const date = leaderboardDate(url?.searchParams.get('date') ?? undefined);
        result = await admin.rpc('daily_hall_of_fame', { log_date: date });
        if (result.error) throw new Error(result.error.message);
        return { date, users: result.data };
    } else if (path === '/api/tracking/english' && method === 'GET') {
        result = await admin.rpc('english_tracking', { learner: user.id });
    } else if (path === '/api/tracking/listening' && method === 'POST') {
        const rows = validateListeningBatch(body).map((row: any) => ({ ...row, user_id: user.id }));
        result = await admin.from('listening_activity').upsert(rows, { onConflict: 'user_id,id', ignoreDuplicates: true });
        if (!result.error) return { saved: true };
    } else return undefined;
    if (result.error) throw new Error(result.error.message);
    return result.data;
}
