-- Additive migration for saved IELTS Reading attempts and per-question reviews.
-- This follows the project's existing custom user_id access pattern.
CREATE TABLE IF NOT EXISTS public.english_reading_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    test_slug TEXT NOT NULL,
    test_title TEXT NOT NULL,
    correct_count INTEGER NOT NULL DEFAULT 0 CHECK (correct_count >= 0),
    graded_count INTEGER NOT NULL DEFAULT 0 CHECK (graded_count >= 0),
    total_count INTEGER NOT NULL CHECK (total_count >= 0),
    score_percent NUMERIC(5, 2) CHECK (score_percent >= 0 AND score_percent <= 100),
    review JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(review) = 'array'),
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS english_reading_attempts_user_test_date_idx
    ON public.english_reading_attempts (user_id, test_slug, completed_at DESC);

GRANT SELECT, INSERT ON TABLE public.english_reading_attempts TO anon, authenticated;