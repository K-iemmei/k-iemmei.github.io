CREATE TABLE public.vocabulary_decks (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
 name TEXT NOT NULL CHECK(char_length(name) BETWEEN 1 AND 120), description TEXT NOT NULL DEFAULT '',
 source_type TEXT NOT NULL DEFAULT 'manual' CHECK(source_type IN ('manual','apkg')),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.vocabulary_cards (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), deck_id UUID NOT NULL REFERENCES public.vocabulary_decks(id) ON DELETE CASCADE,
 term TEXT NOT NULL CHECK(char_length(term) BETWEEN 1 AND 500), meaning TEXT NOT NULL CHECK(char_length(meaning) BETWEEN 1 AND 4000),
 example TEXT NOT NULL DEFAULT '', audio_path TEXT NOT NULL DEFAULT '', tags JSONB NOT NULL DEFAULT '[]' CHECK(jsonb_typeof(tags)='array'),
 state TEXT NOT NULL DEFAULT 'new' CHECK(state IN ('new','learning','review')), due_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 interval_days INTEGER NOT NULL DEFAULT 0 CHECK(interval_days>=0), ease_factor NUMERIC(4,2) NOT NULL DEFAULT 2.50 CHECK(ease_factor BETWEEN 1.30 AND 3.00),
 repetitions INTEGER NOT NULL DEFAULT 0 CHECK(repetitions>=0), lapses INTEGER NOT NULL DEFAULT 0 CHECK(lapses>=0), last_reviewed_at TIMESTAMPTZ
);
CREATE TABLE public.vocabulary_reviews (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), card_id UUID NOT NULL REFERENCES public.vocabulary_cards(id) ON DELETE CASCADE,
 user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE, rating TEXT NOT NULL CHECK(rating IN ('again','good','easy')),
 previous_state TEXT NOT NULL, reviewed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX vocabulary_decks_user_idx ON public.vocabulary_decks(user_id,updated_at DESC);
CREATE INDEX vocabulary_cards_due_idx ON public.vocabulary_cards(deck_id,due_at);
