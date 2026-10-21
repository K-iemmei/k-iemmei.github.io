-- Apply after database/migrations/019-note-tree.sql.
REVOKE ALL ON FUNCTION public.app_note_tree(UUID,TEXT,UUID,JSONB) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.app_note_tree(UUID,TEXT,UUID,JSONB) TO service_role;
