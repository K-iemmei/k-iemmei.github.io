-- IELTS Reading content model for Supabase. Run after the existing users table.
-- This migration is additive: it keeps the old daily-English tables intact.
CREATE TABLE IF NOT EXISTS reading_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL, source_name TEXT NOT NULL DEFAULT 'Cambridge', source_url TEXT,
    test_format TEXT NOT NULL DEFAULT 'academic' CHECK (test_format IN ('academic', 'general')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    duration_minutes SMALLINT NOT NULL DEFAULT 60 CHECK (duration_minutes BETWEEN 1 AND 180),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS reading_passages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), test_id UUID NOT NULL REFERENCES reading_tests(id) ON DELETE CASCADE,
    passage_order SMALLINT NOT NULL CHECK (passage_order BETWEEN 1 AND 3), title TEXT, content TEXT NOT NULL,
    word_count INTEGER, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), UNIQUE (test_id, passage_order)
);
CREATE TABLE IF NOT EXISTS reading_question_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), passage_id UUID NOT NULL REFERENCES reading_passages(id) ON DELETE CASCADE,
    group_order SMALLINT NOT NULL CHECK (group_order > 0),
    question_type TEXT NOT NULL CHECK (question_type IN ('matching_headings','matching_information','matching_features','matching_sentence_endings','true_false_not_given','yes_no_not_given','multiple_choice','summary_completion','sentence_completion','note_completion','table_completion','flow_chart_completion','diagram_labelling','short_answer')),
    instruction TEXT NOT NULL, options JSONB NOT NULL DEFAULT '[]'::jsonb, settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    UNIQUE (passage_id, group_order)
);
CREATE TABLE IF NOT EXISTS reading_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), group_id UUID NOT NULL REFERENCES reading_question_groups(id) ON DELETE CASCADE,
    question_number SMALLINT NOT NULL CHECK (question_number BETWEEN 1 AND 40), prompt TEXT NOT NULL,
    answer_key JSONB, explanation TEXT, points SMALLINT NOT NULL DEFAULT 1 CHECK (points > 0),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb, UNIQUE (group_id, question_number)
);
CREATE TABLE IF NOT EXISTS reading_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    test_id UUID NOT NULL REFERENCES reading_tests(id) ON DELETE CASCADE, started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    submitted_at TIMESTAMPTZ, correct_count SMALLINT NOT NULL DEFAULT 0, question_count SMALLINT NOT NULL DEFAULT 0,
    score_percent NUMERIC(5,2), status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted'))
);
CREATE TABLE IF NOT EXISTS reading_attempt_answers (
    attempt_id UUID NOT NULL REFERENCES reading_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES reading_questions(id) ON DELETE CASCADE, answer JSONB NOT NULL DEFAULT 'null'::jsonb,
    is_correct BOOLEAN, answered_at TIMESTAMPTZ NOT NULL DEFAULT now(), PRIMARY KEY (attempt_id, question_id)
);
CREATE INDEX IF NOT EXISTS reading_passages_test_order_idx ON reading_passages(test_id, passage_order);
CREATE INDEX IF NOT EXISTS reading_groups_passage_order_idx ON reading_question_groups(passage_id, group_order);
CREATE INDEX IF NOT EXISTS reading_questions_group_number_idx ON reading_questions(group_id, question_number);
CREATE INDEX IF NOT EXISTS reading_attempts_user_test_idx ON reading_attempts(user_id, test_id, started_at DESC);
