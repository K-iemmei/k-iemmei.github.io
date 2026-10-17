-- Apply after database/migrations/014-notes-and-blog.sql, then deploy app-api.
BEGIN;
REVOKE ALL ON public.personal_notes,public.blog_posts,public.note_assets FROM anon,authenticated;
REVOKE ALL ON FUNCTION public.app_notes_api(UUID,TEXT,UUID,JSONB) FROM anon,authenticated;
GRANT ALL ON public.personal_notes,public.blog_posts,public.note_assets TO service_role;
GRANT EXECUTE ON FUNCTION public.app_notes_api(UUID,TEXT,UUID,JSONB) TO service_role;
COMMIT;
