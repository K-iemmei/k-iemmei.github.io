CREATE TABLE public.vocabulary_settings (
 user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
 daily_limit INTEGER CHECK(daily_limit IS NULL OR daily_limit BETWEEN 1 AND 1000),
 timezone TEXT NOT NULL DEFAULT 'Asia/Bangkok'
);
ALTER TABLE public.vocabulary_reviews ADD COLUMN interval_minutes INTEGER;
CREATE INDEX vocabulary_reviews_user_day_idx ON public.vocabulary_reviews(user_id,reviewed_at DESC);
