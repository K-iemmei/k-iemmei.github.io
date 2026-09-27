-- Create placeholder auth schema and helper used by policies in local dev
CREATE SCHEMA IF NOT EXISTS auth;

-- auth.uid() helper. In local dev this returns NULL unless the session sets app.current_user_id via set_config.
CREATE OR REPLACE FUNCTION auth.uid()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULL::uuid;
$$;

-- Create placeholder roles used by some migrations/grants (anon/authenticated) so GRANT statements don't fail locally
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOINHERIT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOINHERIT;
  END IF;
END$$;
