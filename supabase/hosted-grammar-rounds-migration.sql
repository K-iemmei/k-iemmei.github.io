REVOKE ALL ON public.grammar_study_rounds FROM anon,authenticated;
REVOKE ALL ON FUNCTION public.app_grammar_rounds_api(UUID,TEXT,TEXT,JSONB) FROM anon,authenticated;
GRANT ALL ON public.grammar_study_rounds TO service_role;
GRANT EXECUTE ON FUNCTION public.app_grammar_rounds_api(UUID,TEXT,TEXT,JSONB) TO service_role;
