ALTER TABLE public.home_preferences DROP CONSTRAINT home_preferences_news_category_check;
ALTER TABLE public.home_preferences ADD CONSTRAINT home_preferences_news_category_check CHECK (news_category IN ('latest','world','business','technology','football','sports','science','health','lifestyle','entertainment'));
