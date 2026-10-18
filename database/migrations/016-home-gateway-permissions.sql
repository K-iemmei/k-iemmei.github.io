-- Supabase grants RPC execution to API roles through default privileges.
-- Keep the Home gateway callable only by the trusted server runtime.
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='anon') THEN
        REVOKE ALL ON FUNCTION public.app_home_api(UUID,TEXT,UUID,JSONB) FROM anon;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='authenticated') THEN
        REVOKE ALL ON FUNCTION public.app_home_api(UUID,TEXT,UUID,JSONB) FROM authenticated;
    END IF;
END $$;
