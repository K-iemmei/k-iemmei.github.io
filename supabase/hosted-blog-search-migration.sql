-- Apply after database/migrations/018-blog-search.sql.
REVOKE ALL ON FUNCTION public.app_blog_list(UUID,JSONB) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.app_blog_list(UUID,JSONB) TO service_role;
