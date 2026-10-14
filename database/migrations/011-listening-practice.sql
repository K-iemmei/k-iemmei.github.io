-- One independently playable IELTS Listening part per session.
CREATE TABLE IF NOT EXISTS public.listening_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^cambridge-[0-9]+-test-[1-4]-part-[1-4]$'),
    book_number INTEGER NOT NULL CHECK (book_number BETWEEN 1 AND 21),
    test_number INTEGER NOT NULL CHECK (test_number BETWEEN 1 AND 4),
    part_number INTEGER NOT NULL CHECK (part_number BETWEEN 1 AND 4),
    title TEXT NOT NULL,
    question_text TEXT NOT NULL DEFAULT '',
    first_question INTEGER NOT NULL,
    last_question INTEGER NOT NULL,
    transcript TEXT,
    answer_key JSONB NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(answer_key) = 'object'),
    audio_filename TEXT NOT NULL CHECK (audio_filename ~ '^0-cam[0-9]+-test-[1-4]-part-[1-4][.]mp3$'),
    source_pages JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(source_pages) = 'array'),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (book_number, test_number, part_number),
    CHECK (last_question - first_question = 9)
);

CREATE TABLE IF NOT EXISTS public.listening_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.listening_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    mode TEXT NOT NULL CHECK (mode IN ('exam', 'dictation')),
    responses JSONB NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(responses) = 'object'),
    dictation_text TEXT,
    correct_count INTEGER,
    graded_count INTEGER NOT NULL DEFAULT 0,
    score_percent NUMERIC(5,2),
    completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS listening_attempts_user_session_idx
    ON public.listening_attempts (user_id, session_id, completed_at DESC);
