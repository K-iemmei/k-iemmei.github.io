-- Requested one-time reset: remove all legacy/crawled Reading content and its attempts.
-- Back up the local database before applying. Later runs are skipped by the migration ledger.
DROP TABLE IF EXISTS public.reading_attempt_answers;
DROP TABLE IF EXISTS public.reading_attempts;
DROP TABLE IF EXISTS public.english_reading_attempts;
DROP TABLE IF EXISTS public.reading_questions;
DROP TABLE IF EXISTS public.reading_question_groups;
DROP TABLE IF EXISTS public.reading_passages;
DROP TABLE IF EXISTS public.reading_tests;

CREATE TABLE public.reading_tests (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
 category TEXT NOT NULL DEFAULT 'General Reading',
 title TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, description TEXT NOT NULL DEFAULT '',
 status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published','archived')),
 version INTEGER NOT NULL DEFAULT 1,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.reading_passages (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), test_id UUID NOT NULL REFERENCES public.reading_tests(id) ON DELETE CASCADE,
 passage_order INTEGER NOT NULL CHECK(passage_order>0), title TEXT NOT NULL DEFAULT '', content TEXT NOT NULL,
 UNIQUE(test_id,passage_order)
);
CREATE TABLE public.reading_question_groups (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), passage_id UUID NOT NULL REFERENCES public.reading_passages(id) ON DELETE CASCADE,
 group_order INTEGER NOT NULL CHECK(group_order>0), group_type TEXT NOT NULL,
 title TEXT NOT NULL DEFAULT '', instructions TEXT NOT NULL DEFAULT '',
 options JSONB NOT NULL DEFAULT '[]' CHECK(jsonb_typeof(options)='array'),
 metadata JSONB NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(metadata)='object'),
 UNIQUE(passage_id,group_order)
);
CREATE TABLE public.reading_questions (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), group_id UUID NOT NULL REFERENCES public.reading_question_groups(id) ON DELETE CASCADE,
 question_order INTEGER NOT NULL CHECK(question_order>0), question_type TEXT NOT NULL, prompt TEXT NOT NULL,
 options JSONB NOT NULL DEFAULT '[]' CHECK(jsonb_typeof(options)='array'),
 answer_key JSONB NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(answer_key)='object'),
 metadata JSONB NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(metadata)='object'),
 UNIQUE(group_id,question_order)
);
CREATE TABLE public.reading_attempts (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), test_id UUID NOT NULL REFERENCES public.reading_tests(id) ON DELETE CASCADE,
 user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
 test_version INTEGER NOT NULL, test_title TEXT NOT NULL,
 responses JSONB NOT NULL CHECK(jsonb_typeof(responses)='object'),
 review JSONB NOT NULL CHECK(jsonb_typeof(review)='array'),
 correct_count INTEGER NOT NULL, total_count INTEGER NOT NULL, graded_count INTEGER NOT NULL,
 score_percent NUMERIC(5,2), completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 CHECK(correct_count>=0 AND correct_count<=graded_count AND graded_count<=total_count)
);
CREATE INDEX reading_tests_author_idx ON public.reading_tests(created_by,updated_at DESC);
CREATE INDEX reading_attempts_history_idx ON public.reading_attempts(user_id,test_id,completed_at DESC);
