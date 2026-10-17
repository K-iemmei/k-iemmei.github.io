import { deployment } from './deployment-config.js';
import { cloudLogin, cloudToken } from './supabase-session.js';

// Local Express and hosted Supabase Edge Function share the existing API contract.
export async function apiRequest(path, options = {}) {
    const hosted = deployment.mode === 'supabase';
    const token = hosted ? await cloudToken() : null;
    if (hosted && !token) {
        window.location.replace('index.html');
        throw new Error('Please sign in');
    }
    const url = hosted ? `${deployment.url}/functions/v1/app-api${path}` : path;
    const response = await fetch(url, {
        ...options,
        ...(hosted ? {} : { credentials: 'same-origin' }),
        headers: {
            'Content-Type': 'application/json',
            ...(hosted ? { apikey: deployment.anonKey, Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });
    if (response.status === 204) return null;
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
        throw new Error(
            hosted
                ? `Supabase API returned ${response.status}. Check that the app-api Edge Function is deployed.`
                : response.status === 404
                  ? 'Vocabulary API is unavailable. Restart the local server to load the latest routes.'
                  : `Local API returned an unexpected response (${response.status}). Check that the app is running with npm run dev.`,
        );
    }
    const result = await response.json();
    if (response.status === 401 && !path.endsWith('/login')) {
        window.location.replace(hosted ? 'index.html' : '/index.html');
    }
    if (!response.ok)
        throw Object.assign(new Error(result.error || 'Request failed'), {
            status: response.status,
        });
    return result;
}
function request(table, options = {}) {
    const { select = '*', filters = {}, order, method = 'GET', body } = options;
    const params = new URLSearchParams();
    if (method === 'GET') params.set('select', select);
    for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null && value !== '')
            params.set(key, String(value).startsWith('eq.') ? value : `eq.${value}`);
    }
    if (order) params.set('order', `${order.column}.${order.direction || 'asc'}`);
    return apiRequest(`/api/data/${encodeURIComponent(table)}?${params}`, {
        method,
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
}
export const database = {
    get: (table, options = {}) => request(table, options),
    create: (table, body) => request(table, { method: 'POST', body }),
    delete: (table, options = {}) => request(table, { ...options, method: 'DELETE' }),
    async loginUser(username, password) {
        if (deployment.mode === 'supabase') return cloudLogin(username, password);
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        if (response.status === 400 || response.status === 401) return null;
        if (!response.ok) throw new Error('Cannot connect to local authentication service');
        return response.json();
    },
};
