import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'content-type, x-admin-token',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

function response(body: unknown, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}

Deno.serve(async (request) => {
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: corsHeaders
        });
    }
    if (request.method !== 'POST') return response({ error: 'Only POST is supported.' }, 405);

    const adminToken = Deno.env.get('ADMIN_TOKEN');
    const providedToken = request.headers.get('x-admin-token');
    if (!adminToken || !providedToken || providedToken !== adminToken) {
        return response({ error: 'Unauthorized.' }, 401);
    }

    let body: { sql?: string };
    try {
        body = await request.json();
    } catch {
        return response({ error: 'Request body must be valid JSON.' }, 400);
    }

    const sql = body.sql?.trim();
    if (!sql) return response({ error: 'SQL is required.' }, 400);
    if (sql.length > 100_000) return response({ error: 'SQL is too large.' }, 413);

    const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data, error } = await supabase.rpc('execute_admin_sql', { sql_query: sql });
    if (error) return response({ error: error.message }, 400);

    return response({ success: true, result: data });
});
