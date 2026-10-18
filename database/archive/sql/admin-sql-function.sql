-- Run this once in Supabase SQL Editor.
-- The Edge Function calls this function with the service role key.

CREATE OR REPLACE FUNCTION public.execute_admin_sql(sql_query TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result JSONB;
    normalized_sql TEXT := btrim(sql_query);
BEGIN
    IF normalized_sql = '' THEN
        RAISE EXCEPTION 'SQL is empty';
    END IF;

    -- Return rows for a SELECT; return an execution status for writes.
    IF upper(normalized_sql) LIKE 'SELECT %' OR upper(normalized_sql) LIKE 'WITH %' THEN
        EXECUTE format(
            'SELECT COALESCE(jsonb_agg(row_to_json(result_row)), ''[]''::jsonb) FROM (%s) result_row',
            normalized_sql
        ) INTO result;
        RETURN result;
    END IF;

    EXECUTE normalized_sql;
    RETURN jsonb_build_object('status', 'ok');
END;
$$;

REVOKE ALL ON FUNCTION public.execute_admin_sql(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.execute_admin_sql(TEXT) FROM anon;
REVOKE ALL ON FUNCTION public.execute_admin_sql(TEXT) FROM authenticated;
GRANT USAGE ON SCHEMA public TO service_role;
GRANT EXECUTE ON FUNCTION public.execute_admin_sql(TEXT) TO service_role;

-- Refresh PostgREST's function schema cache immediately.
SELECT pg_notify('pgrst', 'reload schema');

-- Verification: this should return execute_admin_sql with argument sql_query.
SELECT
    specific_schema,
    specific_name,
        parameter_name,
        data_type
FROM information_schema.parameters
WHERE specific_schema = 'public'
    AND specific_name LIKE 'execute_admin_sql%'
ORDER BY ordinal_position;
