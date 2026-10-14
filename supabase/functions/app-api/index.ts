import { createClient } from 'npm:@supabase/supabase-js@2';
import { readingApi } from './reading.ts';
import { vocabularyApi } from './vocabulary.ts';
import { listeningApi } from './listening.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
if (!supabaseUrl || !serviceKey) throw new Error('Supabase project environment is missing');
const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
});
const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};
const json = (data, status = 200) =>
    new Response(JSON.stringify(data), {
        status,
        headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8' },
    });
const checked = (result) => {
    if (result.error) throw new Error(result.error.message);
    return result.data;
};
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
const privateTables = new Set([
    'subject_daily_activity',
    'english_daily_results',
    'chinese_daily_results',
    'chinese_user_answers',
]);
const writable = new Set(['chinese_user_answers', 'chinese_daily_results']);

async function dataApi(user, path, method, body, url) {
    const table = path.split('/')[2];
    if (!readable.has(table)) return undefined;
    let query;
    if (method === 'GET') {
        const select =
            table === 'users'
                ? 'id,username,name'
                : (url.searchParams.get('select') || '*')
                      .split(',')
                      .map((column) => column.trim())
                      .join(',');
        if (!/^(\*|[a-z_]+(?:,[a-z_]+)*)$/.test(select)) throw new Error('Invalid selected fields');
        query = admin.from(table).select(select).limit(5000);
        for (const [key, value] of url.searchParams) {
            if (['select', 'order'].includes(key)) continue;
            if (!/^[a-z_]+$/.test(key) || !value.startsWith('eq.'))
                throw new Error('Invalid filter');
            query = query.eq(key, value.slice(3));
        }
        if (privateTables.has(table)) query = query.eq('user_id', user.id);
        const order = url.searchParams.get('order');
        if (order) {
            const [column, direction] = order.split('.');
            if (!/^[a-z_]+$/.test(column) || !['asc', 'desc'].includes(direction))
                throw new Error('Invalid sort');
            query = query.order(column, { ascending: direction === 'asc' });
        }
        return checked(await query);
    }
    if (!writable.has(table)) throw new Error('Read only table');
    const filters = [...url.searchParams].filter(([key]) => !['select', 'order'].includes(key));
    if (method === 'DELETE') {
        if (!filters.length) throw new Error('Filter required');
        query = admin.from(table).delete().eq('user_id', user.id);
        for (const [key, value] of filters) {
            if (!/^[a-z_]+$/.test(key) || !value.startsWith('eq.'))
                throw new Error('Invalid filter');
            query = query.eq(key, value.slice(3));
        }
        checked(await query);
        return { __noContent: true };
    }
    if (method === 'POST') {
        const rows = Array.isArray(body) ? body : [body];
        if (!rows.length || rows.length > 500 || rows.some((row) => row?.user_id !== user.id))
            throw new Error('Invalid or unauthorized rows');
        return checked(await admin.from(table).insert(rows).select());
    }
    return undefined;
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    try {
        const url = new URL(req.url);
        const path = url.pathname.split('/app-api')[1] || '';
        const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
        if (!token) return json({ error: 'Sign in required' }, 401);
        const {
            data: { user },
            error,
        } = await admin.auth.getUser(token);
        if (error || !user) return json({ error: 'Invalid session' }, 401);
        const member = checked(
            await admin
                .from('hosted_members')
                .select('user_id')
                .eq('user_id', user.id)
                .maybeSingle(),
        );
        if (!member) return json({ error: 'This account has not been granted access' }, 403);
        // Local account IDs are never exported. Hosted profiles share the Auth UUID.
        const profile = checked(
            await admin.from('users').select('id').eq('id', user.id).maybeSingle(),
        );
        if (!profile)
            checked(
                await admin.from('users').insert({
                    id: user.id,
                    email: user.email,
                    name: user.user_metadata?.name || user.email?.split('@')[0] || 'Learner',
                    username: null,
                }),
            );
        const body =
            ['POST', 'PUT', 'PATCH'].includes(req.method) &&
            !path.includes('/source-pages/') &&
            path !== '/api/vocabulary/import-apkg'
                ? await req.json()
                : null;
        let result;
        if (path.startsWith('/api/data/'))
            result = await dataApi(user, path, req.method, body, url);
        else if (path.startsWith('/api/tests') || path.startsWith('/api/reading/'))
            result = await readingApi(admin, user, path.replace(/^\/api\//, ''), req.method, body);
        else if (path.startsWith('/api/vocabulary/'))
            result = await vocabularyApi(
                admin,
                user,
                path.replace(/^\/api\//, ''),
                req.method,
                body,
                url,
            );
        else if (path.startsWith('/api/listening'))
            result = await listeningApi(admin, user, path.replace(/^\/api\//, ''), req.method, body);
        if (result === undefined) return json({ error: 'Unknown API route' }, 404);
        if (result?.__noContent) return new Response(null, { status: 204, headers: cors });
        if (result?.__binary)
            return new Response(result.__binary, {
                headers: { ...cors, 'Content-Type': result.__contentType },
            });
        return json(result, req.method === 'POST' ? 201 : 200);
    } catch (error) {
        console.error(error);
        return json({ error: error instanceof Error ? error.message : 'Request failed' }, 400);
    }
});
