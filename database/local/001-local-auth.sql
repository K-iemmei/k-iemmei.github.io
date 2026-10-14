-- Local-only authentication. Never included in Supabase exports.
CREATE SCHEMA IF NOT EXISTS app_private;
CREATE TABLE IF NOT EXISTS app_private.credentials (
 user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
 password_hash TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS app_private.sessions (
 token_hash TEXT PRIMARY KEY, user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
 expires_at TIMESTAMPTZ NOT NULL DEFAULT now() + interval '7 days'
);
