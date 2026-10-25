CREATE TABLE public.vocabulary_priority_progress (
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    word_id TEXT NOT NULL CHECK(word_id ~ '^pv-[a-f0-9]{16}$'),
    completed_rounds SMALLINT NOT NULL DEFAULT 0 CHECK(completed_rounds BETWEEN 0 AND 5),
    studied_at TIMESTAMPTZ[] NOT NULL DEFAULT '{}',
    revision INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY(user_id,word_id),
    CHECK(cardinality(studied_at)=completed_rounds)
);
ALTER TABLE public.vocabulary_priority_progress ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.app_priority_vocabulary(p_user UUID,p_action TEXT,p_id TEXT DEFAULT NULL,p_payload JSONB DEFAULT '{}') RETURNS JSONB LANGUAGE plpgsql AS $$
DECLARE entry public.vocabulary_priority_progress%ROWTYPE; target INTEGER; expected INTEGER;
BEGIN
    IF NOT EXISTS(SELECT 1 FROM public.users WHERE id=p_user) THEN
        RAISE EXCEPTION 'Sign in required' USING ERRCODE='P0002';
    END IF;
    IF p_action='load' THEN
        RETURN jsonb_build_object('progress',coalesce((SELECT jsonb_agg(to_jsonb(p)-'user_id' ORDER BY p.word_id) FROM public.vocabulary_priority_progress p WHERE user_id=p_user),'[]'::jsonb));
    END IF;
    IF p_action<>'save' OR p_id IS NULL OR p_id !~ '^pv-[a-f0-9]{16}$' THEN
        RAISE EXCEPTION 'Invalid vocabulary request' USING ERRCODE='22023';
    END IF;
    target := (p_payload->>'completed_rounds')::integer;
    expected := (p_payload->>'expected_revision')::integer;
    IF target IS NULL OR target NOT BETWEEN 0 AND 5 OR expected IS NULL OR expected<0 THEN
        RAISE EXCEPTION 'Invalid study progress' USING ERRCODE='22023';
    END IF;
    INSERT INTO public.vocabulary_priority_progress(user_id,word_id) VALUES(p_user,p_id) ON CONFLICT DO NOTHING;
    SELECT * INTO entry FROM public.vocabulary_priority_progress WHERE user_id=p_user AND word_id=p_id FOR UPDATE;
    IF entry.revision<>expected THEN
        RAISE EXCEPTION 'Tiến độ đã thay đổi trên thiết bị khác. Đã tải lại; hãy kiểm tra trước khi tích tiếp.' USING ERRCODE='40001';
    END IF;
    IF abs(target-entry.completed_rounds)<>1 THEN
        RAISE EXCEPTION 'Chỉ đánh dấu lượt tiếp theo hoặc bỏ tích lượt cuối.' USING ERRCODE='22023';
    END IF;
    UPDATE public.vocabulary_priority_progress SET
        completed_rounds=target,
        studied_at=CASE WHEN target>entry.completed_rounds THEN array_append(studied_at,now()) ELSE studied_at[1:target] END,
        revision=revision+1,updated_at=now()
    WHERE user_id=p_user AND word_id=p_id RETURNING * INTO entry;
    RETURN to_jsonb(entry)-'user_id';
END;
$$;
REVOKE ALL ON FUNCTION public.app_priority_vocabulary(UUID,TEXT,TEXT,JSONB) FROM PUBLIC;
