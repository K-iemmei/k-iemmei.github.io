-- Apply AFTER database/exports/schema.sql and content.sql to an empty Supabase project.
-- Browser clients use Auth only; the app-api Edge Function checks JWTs and owns data access.
BEGIN;
DO $$ DECLARE item record; BEGIN
  FOR item IN SELECT schemaname, tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', item.schemaname, item.tablename);
    EXECUTE format('REVOKE ALL ON TABLE %I.%I FROM anon, authenticated', item.schemaname, item.tablename);
  END LOOP;
END $$;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT USAGE,SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

CREATE TABLE IF NOT EXISTS public.hosted_members (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  added_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.hosted_members ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.hosted_members FROM anon, authenticated;
GRANT ALL ON public.hosted_members TO service_role;

CREATE OR REPLACE FUNCTION public.app_save_reading_test(p_user uuid, p_test jsonb, p_id uuid DEFAULT NULL, p_version integer DEFAULT NULL)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_id uuid; v_passage jsonb; v_group jsonb; v_question jsonb; v_pid uuid; v_gid uuid; v_pi integer := 0; v_gi integer; v_qi integer;
BEGIN
  IF p_user IS NULL OR p_test IS NULL OR jsonb_typeof(p_test->'passages') <> 'array'
     OR jsonb_array_length(p_test->'passages') NOT BETWEEN 1 AND 20
     OR p_test->>'slug' !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
     OR p_test->>'status' NOT IN ('draft','published','archived') THEN
    RAISE EXCEPTION 'Invalid reading test';
  END IF;
  IF p_id IS NULL THEN
    INSERT INTO reading_tests(created_by,title,slug,category,description,status)
      VALUES(p_user,p_test->>'title',p_test->>'slug',p_test->>'category',coalesce(p_test->>'description',''),p_test->>'status') RETURNING id INTO v_id;
  ELSE
    UPDATE reading_tests SET title=p_test->>'title',slug=p_test->>'slug',category=p_test->>'category',description=coalesce(p_test->>'description',''),status=p_test->>'status',version=version+1,updated_at=now()
      WHERE id=p_id AND created_by=p_user AND version=p_version RETURNING id INTO v_id;
    IF v_id IS NULL THEN RAISE EXCEPTION 'Test missing, not owned, or changed. Reload before saving.'; END IF;
    DELETE FROM reading_passages WHERE test_id=v_id;
  END IF;
  FOR v_passage IN SELECT value FROM jsonb_array_elements(p_test->'passages') LOOP
    v_pi := v_pi + 1; v_gi := 0;
    IF jsonb_typeof(v_passage->'groups') <> 'array' OR jsonb_array_length(v_passage->'groups') < 1 THEN RAISE EXCEPTION 'Passage needs question groups'; END IF;
    INSERT INTO reading_passages(test_id,passage_order,title,content,content_html)
      VALUES(v_id,v_pi,coalesce(v_passage->>'title',''),v_passage->>'content',coalesce(v_passage->>'content_html','')) RETURNING id INTO v_pid;
    FOR v_group IN SELECT value FROM jsonb_array_elements(v_passage->'groups') LOOP
      v_gi := v_gi + 1; v_qi := 0;
      IF jsonb_typeof(v_group->'questions') <> 'array' OR jsonb_array_length(v_group->'questions') < 1 THEN RAISE EXCEPTION 'Group needs questions'; END IF;
      INSERT INTO reading_question_groups(passage_id,group_order,group_type,title,instructions,options,metadata)
        VALUES(v_pid,v_gi,v_group->>'group_type',coalesce(v_group->>'title',''),coalesce(v_group->>'instructions',''),coalesce(v_group->'options','[]'::jsonb),coalesce(v_group->'metadata','{}'::jsonb)) RETURNING id INTO v_gid;
      FOR v_question IN SELECT value FROM jsonb_array_elements(v_group->'questions') LOOP
        v_qi := v_qi + 1;
        IF p_test->>'status' = 'published' AND jsonb_array_length(coalesce(v_question->'answer_key'->'answers','[]'::jsonb)) = 0 THEN RAISE EXCEPTION 'Published questions need answer keys'; END IF;
        INSERT INTO reading_questions(group_id,question_order,question_type,prompt,options,answer_key,metadata)
          VALUES(v_gid,v_qi,v_question->>'question_type',v_question->>'prompt',coalesce(v_question->'options','[]'::jsonb),coalesce(v_question->'answer_key','{}'::jsonb),coalesce(v_question->'metadata','{}'::jsonb));
      END LOOP;
    END LOOP;
  END LOOP;
  RETURN v_id;
END $$;
REVOKE ALL ON FUNCTION public.app_save_reading_test(uuid,jsonb,uuid,integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.app_save_reading_test(uuid,jsonb,uuid,integer) TO service_role;

CREATE OR REPLACE FUNCTION public.app_review_vocabulary_card(p_user uuid,p_card uuid,p_minutes integer)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_card vocabulary_cards%ROWTYPE; v_settings vocabulary_settings%ROWTYPE; v_count integer; v_already boolean; v_result jsonb;
BEGIN
  IF p_minutes NOT IN (3,10,15,1440,4320) THEN RAISE EXCEPTION 'Invalid review interval'; END IF;
  PERFORM pg_advisory_xact_lock(hashtext(p_user::text));
  SELECT * INTO v_settings FROM vocabulary_settings WHERE user_id=p_user;
  SELECT c.* INTO v_card FROM vocabulary_cards c JOIN vocabulary_decks d ON d.id=c.deck_id WHERE c.id=p_card AND d.user_id=p_user FOR UPDATE OF c;
  IF NOT FOUND THEN RAISE EXCEPTION 'Card not found'; END IF;
  SELECT count(DISTINCT card_id), bool_or(card_id=p_card) INTO v_count,v_already FROM vocabulary_reviews WHERE user_id=p_user AND (reviewed_at AT TIME ZONE coalesce(v_settings.timezone,'Asia/Bangkok'))::date=(now() AT TIME ZONE coalesce(v_settings.timezone,'Asia/Bangkok'))::date;
  IF v_settings.daily_limit IS NOT NULL AND v_count >= v_settings.daily_limit AND NOT coalesce(v_already,false) THEN RAISE EXCEPTION 'Daily card limit reached'; END IF;
  IF v_card.due_at > now() THEN RAISE EXCEPTION 'Card is not due yet'; END IF;
  UPDATE vocabulary_cards SET state=CASE WHEN p_minutes<1440 THEN 'learning' ELSE 'review' END,due_at=now()+(p_minutes*interval '1 minute'),interval_days=p_minutes/1440,repetitions=repetitions+1,lapses=lapses+CASE WHEN p_minutes=3 THEN 1 ELSE 0 END,last_reviewed_at=now()
    WHERE id=p_card RETURNING to_jsonb(vocabulary_cards.*) INTO v_result;
  INSERT INTO vocabulary_reviews(card_id,user_id,rating,previous_state,interval_minutes)
    VALUES(p_card,p_user,CASE WHEN p_minutes=3 THEN 'again' WHEN p_minutes>=1440 THEN 'easy' ELSE 'good' END,v_card.state,p_minutes);
  RETURN v_result;
END $$;
REVOKE ALL ON FUNCTION public.app_review_vocabulary_card(uuid,uuid,integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.app_review_vocabulary_card(uuid,uuid,integer) TO service_role;

CREATE OR REPLACE FUNCTION public.app_list_vocabulary_decks(p_user uuid)
RETURNS jsonb LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT coalesce(jsonb_agg(to_jsonb(d) || jsonb_build_object('card_count',coalesce(c.card_count,0),'due_count',coalesce(c.due_count,0)) ORDER BY d.updated_at DESC),'[]'::jsonb)
  FROM vocabulary_decks d LEFT JOIN LATERAL (
    SELECT count(*)::integer card_count,count(*) FILTER (WHERE due_at<=now())::integer due_count
    FROM vocabulary_cards WHERE deck_id=d.id
  ) c ON true WHERE d.user_id=p_user;
$$;
REVOKE ALL ON FUNCTION public.app_list_vocabulary_decks(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.app_list_vocabulary_decks(uuid) TO service_role;

CREATE OR REPLACE FUNCTION public.app_next_vocabulary_card(p_user uuid,p_deck uuid DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_limit integer; v_zone text; v_count integer; v_result jsonb;
BEGIN
  SELECT daily_limit,timezone INTO v_limit,v_zone FROM vocabulary_settings WHERE user_id=p_user;
  v_zone:=coalesce(v_zone,'Asia/Bangkok');
  SELECT count(DISTINCT card_id) INTO v_count FROM vocabulary_reviews WHERE user_id=p_user
    AND (reviewed_at AT TIME ZONE v_zone)::date=(now() AT TIME ZONE v_zone)::date;
  SELECT to_jsonb(c) INTO v_result FROM vocabulary_cards c JOIN vocabulary_decks d ON d.id=c.deck_id
    WHERE d.user_id=p_user AND c.due_at<=now() AND (p_deck IS NULL OR c.deck_id=p_deck)
      AND (v_limit IS NULL OR v_count<v_limit OR EXISTS (
        SELECT 1 FROM vocabulary_reviews r WHERE r.user_id=p_user AND r.card_id=c.id
          AND (r.reviewed_at AT TIME ZONE v_zone)::date=(now() AT TIME ZONE v_zone)::date))
    ORDER BY c.due_at LIMIT 1;
  RETURN v_result;
END $$;
REVOKE ALL ON FUNCTION public.app_next_vocabulary_card(uuid,uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.app_next_vocabulary_card(uuid,uuid) TO service_role;

CREATE OR REPLACE FUNCTION public.app_vocabulary_settings(p_user uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_limit integer; v_zone text; v_today integer;
BEGIN
  SELECT daily_limit,timezone INTO v_limit,v_zone FROM vocabulary_settings WHERE user_id=p_user;
  v_zone:=coalesce(v_zone,'Asia/Bangkok');
  SELECT count(DISTINCT card_id) INTO v_today FROM vocabulary_reviews WHERE user_id=p_user
    AND (reviewed_at AT TIME ZONE v_zone)::date=(now() AT TIME ZONE v_zone)::date;
  RETURN jsonb_build_object('daily_limit',v_limit,'timezone',v_zone,'studied_today',v_today,'remaining',CASE WHEN v_limit IS NULL THEN NULL ELSE greatest(0,v_limit-v_today) END);
END $$;
REVOKE ALL ON FUNCTION public.app_vocabulary_settings(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.app_vocabulary_settings(uuid) TO service_role;

CREATE OR REPLACE FUNCTION public.app_vocabulary_activity(p_user uuid)
RETURNS jsonb LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT app_vocabulary_settings(p_user) || jsonb_build_object('days',coalesce((
    SELECT jsonb_agg(jsonb_build_object('day',activity_day,'reviews',reviews,'cards',cards) ORDER BY activity_day)
    FROM (SELECT (r.reviewed_at AT TIME ZONE coalesce(s.timezone,'Asia/Bangkok'))::date AS activity_day,
      count(*)::integer reviews,count(DISTINCT r.card_id)::integer cards
      FROM vocabulary_reviews r LEFT JOIN vocabulary_settings s ON s.user_id=r.user_id
      WHERE r.user_id=p_user AND r.reviewed_at>=now()-interval '90 days' GROUP BY activity_day) days
  ),'[]'::jsonb));
$$;
REVOKE ALL ON FUNCTION public.app_vocabulary_activity(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.app_vocabulary_activity(uuid) TO service_role;

INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
VALUES('reading-assets','reading-assets',false,20971520,ARRAY['image/png'])
ON CONFLICT(id) DO NOTHING;
UPDATE storage.buckets SET public=false,file_size_limit=20971520,allowed_mime_types=ARRAY['image/png'] WHERE id='reading-assets';
-- Included in a newly exported schema; existing projects use hosted-notes-migration.sql.
REVOKE ALL ON FUNCTION public.app_notes_api(UUID,TEXT,UUID,JSONB) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.app_notes_api(UUID,TEXT,UUID,JSONB) TO service_role;
COMMIT;
