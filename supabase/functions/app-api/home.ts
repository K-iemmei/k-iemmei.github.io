import { homeRequest, homeError } from '../../../apps/web/src/domain/home.js';
import { loadNews } from '../../../apps/web/src/domain/home-news.js';
export async function homeApi(admin, user, path, method, body, url) {
    if (path === '/api/home/news' && method === 'GET') return await loadNews(url.searchParams.get('category'));
    const request = homeRequest(path, method, body);
    if (!request) return undefined;
    const result = await admin.rpc('app_home_api', { p_user: user.id, p_action: request.action, p_id: request.id || null, p_payload: request.payload });
    if (result.error) throw homeError(result.error);
    return result.data;
}
