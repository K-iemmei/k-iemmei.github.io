-- Apply once to the existing hosted project after database/migrations/011-listening-practice.sql.
BEGIN;
ALTER TABLE public.listening_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listening_attempts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.listening_sessions, public.listening_attempts FROM anon, authenticated;
GRANT ALL ON public.listening_sessions, public.listening_attempts TO service_role;
INSERT INTO storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
VALUES ('listening-audio', 'listening-audio', false, 52428800, ARRAY['audio/mpeg'])
ON CONFLICT (id) DO UPDATE SET public = false, file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;
COMMIT;
