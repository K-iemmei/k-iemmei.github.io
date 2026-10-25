REVOKE ALL ON public.vocabulary_priority_progress FROM anon,authenticated;
REVOKE ALL ON FUNCTION public.app_priority_vocabulary(UUID,TEXT,TEXT,JSONB) FROM anon,authenticated;
GRANT ALL ON public.vocabulary_priority_progress TO service_role;
GRANT EXECUTE ON FUNCTION public.app_priority_vocabulary(UUID,TEXT,TEXT,JSONB) TO service_role;
