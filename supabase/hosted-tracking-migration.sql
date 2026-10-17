-- Apply after database/migrations/012-english-tracking.sql, then deploy app-api.
BEGIN;
REVOKE ALL ON public.listening_activity FROM anon, authenticated;
GRANT ALL ON public.listening_activity TO service_role;
GRANT EXECUTE ON FUNCTION public.english_tracking(UUID) TO service_role;
COMMIT;
