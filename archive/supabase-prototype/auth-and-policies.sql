-- Apply only on Supabase, after schema.sql and before exposing the Data API.
-- Uses real Supabase Auth; never create/replace auth.uid().
CREATE OR REPLACE FUNCTION public.create_learning_profile()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
 INSERT INTO public.users(id,email,username,name)
 VALUES(NEW.id,NEW.email,NEW.email,COALESCE(NEW.raw_user_meta_data->>'name',NEW.email))
 ON CONFLICT(id) DO NOTHING;
 RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS create_learning_profile ON auth.users;
CREATE TRIGGER create_learning_profile AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.create_learning_profile();
-- Also provision profiles for Auth users created before installing this trigger.
INSERT INTO public.users(id,email,username,name)
SELECT id,email,email,COALESCE(raw_user_meta_data->>'name',email) FROM auth.users
ON CONFLICT(id) DO NOTHING;

DO $$
DECLARE table_name text;
BEGIN
 FOREACH table_name IN ARRAY ARRAY['subjects','topics','english_lessons','english_lesson_sections','english_questions','english_listening_lessons','english_listening_questions','chinese_lessons','chinese_lesson_parts','chinese_questions','reading_tests','reading_passages','reading_question_groups','reading_questions'] LOOP
  EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',table_name);
  EXECUTE format('GRANT SELECT ON public.%I TO authenticated',table_name);
  EXECUTE format('DROP POLICY IF EXISTS learning_content_read ON public.%I',table_name);
  -- Published Reading policies are installed separately below.
  IF table_name NOT LIKE 'reading_%' THEN
   EXECUTE format('CREATE POLICY learning_content_read ON public.%I FOR SELECT TO authenticated USING (true)',table_name);
  END IF;
 END LOOP;
 FOREACH table_name IN ARRAY ARRAY['english_reading_attempts','english_user_answers','english_listening_user_answers','chinese_user_answers','english_daily_results','chinese_daily_results','english_daily_results_per_day','chinese_daily_results_per_day','subject_daily_activity','reading_attempts'] LOOP
  EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',table_name);
  EXECUTE format('GRANT SELECT,INSERT,UPDATE,DELETE ON public.%I TO authenticated',table_name);
  EXECUTE format('DROP POLICY IF EXISTS own_learning_data ON public.%I',table_name);
  EXECUTE format('CREATE POLICY own_learning_data ON public.%I TO authenticated USING (user_id=auth.uid()) WITH CHECK (user_id=auth.uid())',table_name);
 END LOOP;
END;
$$;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.users FROM anon,authenticated;
GRANT SELECT(id,username,name) ON public.users TO authenticated;
DROP POLICY IF EXISTS profile_read ON public.users;
CREATE POLICY profile_read ON public.users FOR SELECT TO authenticated USING (id=auth.uid());
DROP POLICY IF EXISTS published_tests ON public.reading_tests;
CREATE POLICY published_tests ON public.reading_tests FOR SELECT TO authenticated USING(status='published');
DROP POLICY IF EXISTS published_passages ON public.reading_passages;
CREATE POLICY published_passages ON public.reading_passages FOR SELECT TO authenticated USING(EXISTS(SELECT 1 FROM public.reading_tests t WHERE t.id=test_id AND t.status='published'));
DROP POLICY IF EXISTS published_groups ON public.reading_question_groups;
CREATE POLICY published_groups ON public.reading_question_groups FOR SELECT TO authenticated USING(EXISTS(SELECT 1 FROM public.reading_passages p JOIN public.reading_tests t ON t.id=p.test_id WHERE p.id=passage_id AND t.status='published'));
DROP POLICY IF EXISTS published_questions ON public.reading_questions;
CREATE POLICY published_questions ON public.reading_questions FOR SELECT TO authenticated USING(EXISTS(SELECT 1 FROM public.reading_question_groups g JOIN public.reading_passages p ON p.id=g.passage_id JOIN public.reading_tests t ON t.id=p.test_id WHERE g.id=group_id AND t.status='published'));
ALTER TABLE public.reading_attempt_answers ENABLE ROW LEVEL SECURITY;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.reading_attempt_answers TO authenticated;
DROP POLICY IF EXISTS own_attempt_answers ON public.reading_attempt_answers;
CREATE POLICY own_attempt_answers ON public.reading_attempt_answers TO authenticated
USING(EXISTS(SELECT 1 FROM public.reading_attempts a WHERE a.id=attempt_id AND a.user_id=auth.uid()))
WITH CHECK(EXISTS(SELECT 1 FROM public.reading_attempts a WHERE a.id=attempt_id AND a.user_id=auth.uid()));
