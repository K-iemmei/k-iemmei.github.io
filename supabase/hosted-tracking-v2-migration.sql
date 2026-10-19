-- Apply after database/migrations/017-tracking-submissions-and-top-five.sql.
REVOKE ALL ON FUNCTION public.english_tracking_v2(UUID) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.english_hall_of_fame(DATE) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.english_tracking_v2(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.english_hall_of_fame(DATE) TO service_role;
