-- Apply after database/migrations/021-grammar-learning.sql.
REVOKE ALL ON public.grammar_unit_progress,public.grammar_attempts,public.grammar_reviews FROM anon,authenticated;
REVOKE ALL ON FUNCTION public.app_grammar_api(UUID,TEXT,TEXT,JSONB) FROM anon,authenticated;
GRANT ALL ON public.grammar_unit_progress,public.grammar_attempts,public.grammar_reviews TO service_role;
GRANT EXECUTE ON FUNCTION public.app_grammar_api(UUID,TEXT,TEXT,JSONB) TO service_role;
