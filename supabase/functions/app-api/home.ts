import { homeRequest, homeError } from '../../../apps/web/src/domain/home.js';
import { loadNews } from '../../../apps/web/src/domain/home-news.js';
import { loadStandings } from '../../../apps/web/src/domain/home-football.js';
export async function homeApi(admin, user, path, method, body, url) {
    if (path === '/api/home/news' && method === 'GET') return await loadNews(url.searchParams.get('category'));
    if (path === '/api/home/football' && method === 'GET') return await loadStandings(url.searchParams.get('league'));
    const request = homeRequest(path, method, body);
    if (!request) return undefined;
    const result = await admin.rpc('app_home_api', { p_user: user.id, p_action: request.action, p_id: request.id || null, p_payload: request.payload });
    if (result.error) throw homeError(result.error);
    return result.data;
}
