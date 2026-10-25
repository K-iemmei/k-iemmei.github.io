ALTER TABLE public.grammar_unit_progress
    ADD COLUMN study_rounds SMALLINT NOT NULL DEFAULT 0 CHECK(study_rounds BETWEEN 0 AND 5),
    ADD COLUMN study_session_id UUID,
    ADD COLUMN round_read BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN round_score SMALLINT NOT NULL DEFAULT 0,
    ADD COLUMN last_studied_on DATE,
    ADD COLUMN mastered_at TIMESTAMPTZ;
CREATE TABLE public.grammar_study_rounds (
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    unit_id TEXT NOT NULL,
    round_number SMALLINT NOT NULL CHECK(round_number BETWEEN 1 AND 5),
    session_id UUID,
    score SMALLINT NOT NULL,
    studied_on DATE NOT NULL,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY(user_id,unit_id,round_number),
    UNIQUE(user_id,unit_id,studied_on)
);
ALTER TABLE public.grammar_study_rounds ENABLE ROW LEVEL SECURITY;
-- A previously completed unit is a real first pass, not five remembered passes.
UPDATE public.grammar_unit_progress SET study_rounds=1,last_studied_on=(completed_at AT TIME ZONE 'Asia/Bangkok')::date WHERE completed_at IS NOT NULL;
INSERT INTO public.grammar_study_rounds(user_id,unit_id,round_number,score,studied_on,completed_at)
SELECT user_id,unit_id,1,best_score,last_studied_on,completed_at FROM public.grammar_unit_progress WHERE study_rounds=1;

CREATE OR REPLACE FUNCTION public.app_grammar_rounds_api(p_user UUID,p_action TEXT,p_id TEXT DEFAULT NULL,p_payload JSONB DEFAULT '{}') RETURNS JSONB LANGUAGE plpgsql AS $$
DECLARE entry public.grammar_unit_progress%ROWTYPE; result JSONB; session UUID; fresh BOOLEAN;
    today DATE := (now() AT TIME ZONE 'Asia/Bangkok')::date;
BEGIN
    IF p_action='load' THEN RETURN public.app_grammar_api(p_user,p_action,p_id,p_payload); END IF;
    IF NOT EXISTS(SELECT 1 FROM public.users WHERE id=p_user) THEN RAISE EXCEPTION 'Sign in required' USING ERRCODE='P0002'; END IF;
    IF p_id IS NULL OR p_id !~ '^giu-(00[1-9]|0[1-9][0-9]|1[0-3][0-9]|14[0-5])$' THEN RAISE EXCEPTION 'Invalid unit' USING ERRCODE='22023'; END IF;
    INSERT INTO public.grammar_unit_progress(user_id,unit_id) VALUES(p_user,p_id) ON CONFLICT DO NOTHING;
    SELECT * INTO entry FROM public.grammar_unit_progress WHERE user_id=p_user AND unit_id=p_id FOR UPDATE;
    IF p_action='begin' THEN
        IF entry.study_rounds>=5 THEN RAISE EXCEPTION 'Bài này đã đủ 5 lượt học.' USING ERRCODE='22023'; END IF;
        IF entry.last_studied_on>=today THEN RAISE EXCEPTION 'Hôm nay đã ghi nhận một lượt. Hãy quay lại vào ngày mai.' USING ERRCODE='22023'; END IF;
        IF entry.study_session_id IS NULL THEN
            UPDATE public.grammar_unit_progress SET study_session_id=gen_random_uuid(),round_read=false,round_score=0,updated_at=now() WHERE user_id=p_user AND unit_id=p_id RETURNING * INTO entry;
        END IF;
        RETURN jsonb_build_object('progress',to_jsonb(entry)-'user_id','attempt',NULL);
    END IF;
    session := (p_payload->>'session_id')::uuid;
    IF session IS NOT NULL AND session IS DISTINCT FROM entry.study_session_id THEN
        RAISE EXCEPTION 'Lượt học đã thay đổi. Tải lại bài trước khi tiếp tục.' USING ERRCODE='40001';
    END IF;
    fresh := p_action='attempt' AND NOT EXISTS(SELECT 1 FROM public.grammar_attempts WHERE user_id=p_user AND request_id=(p_payload->>'request_id')::uuid);
    result := public.app_grammar_api(p_user,p_action,p_id,p_payload);
    IF session IS NOT NULL AND session=entry.study_session_id THEN
        IF p_action='save' AND coalesce((p_payload->>'read')::boolean,false) THEN
            UPDATE public.grammar_unit_progress SET round_read=true WHERE user_id=p_user AND unit_id=p_id;
        ELSIF fresh AND result->'attempt'->>'mode'='assessment' THEN
            UPDATE public.grammar_unit_progress SET round_score=greatest(round_score,round(100.0*(result->'attempt'->>'score')::int/(result->'attempt'->>'total')::int)::int) WHERE user_id=p_user AND unit_id=p_id;
        END IF;
    END IF;
    SELECT * INTO entry FROM public.grammar_unit_progress WHERE user_id=p_user AND unit_id=p_id;
    IF entry.study_session_id IS NOT NULL AND entry.round_read AND entry.round_score>=80 AND entry.study_rounds<5 AND (entry.last_studied_on IS NULL OR entry.last_studied_on<today) THEN
        INSERT INTO public.grammar_study_rounds(user_id,unit_id,round_number,session_id,score,studied_on)
        VALUES(p_user,p_id,entry.study_rounds+1,entry.study_session_id,entry.round_score,today);
        UPDATE public.grammar_unit_progress SET study_rounds=study_rounds+1,last_studied_on=today,study_session_id=NULL,mastered_at=CASE WHEN study_rounds=4 THEN now() ELSE NULL END,updated_at=now() WHERE user_id=p_user AND unit_id=p_id RETURNING * INTO entry;
    END IF;
    RETURN result || jsonb_build_object('progress',to_jsonb(entry)-'user_id');
END;
$$;
REVOKE ALL ON FUNCTION public.app_grammar_rounds_api(UUID,TEXT,TEXT,JSONB) FROM PUBLIC;
