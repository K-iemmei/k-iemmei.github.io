import { publishingRequest, publishingError } from '../../../apps/web/src/domain/publishing.js';
export async function publishingApi(
    admin: any,
    user: { id: string },
    path: string,
    method: string,
    body: any,
    url: URL,
) {
    const request = publishingRequest(path, method, body, url);
    if (!request) return undefined;
    const result = await admin.rpc('app_notes_api', {
        p_user: user.id,
        p_action: request.action,
        p_id: request.id,
        p_payload: request.payload,
    });
    if (result.error) throw publishingError(result.error);
    return result.data;
}
