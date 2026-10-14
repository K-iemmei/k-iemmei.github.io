CREATE TABLE IF NOT EXISTS english_listening_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL UNIQUE REFERENCES english_lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Daily listening',
    audio_path TEXT,
    transcript TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS english_listening_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES english_lessons(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL CHECK (order_index >= 1),
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL DEFAULT 'short_answer' CHECK (question_type IN ('short_answer', 'multiple_choice', 'true_false')),
    options JSONB NOT NULL DEFAULT '[]'::jsonb,
    answer TEXT NOT NULL,
    points INTEGER NOT NULL DEFAULT 1,
    UNIQUE (lesson_id, order_index)
);
