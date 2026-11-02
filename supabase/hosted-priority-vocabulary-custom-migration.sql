CREATE TABLE public.vocabulary_priority_words (
    id TEXT PRIMARY KEY DEFAULT ('pv-custom-' || substr(replace(gen_random_uuid()::text,'-',''),1,16)),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    word TEXT NOT NULL CHECK(length(trim(word)) BETWEEN 1 AND 500),
    mean TEXT NOT NULL CHECK(length(trim(mean)) BETWEEN 1 AND 4000),
    example TEXT NOT NULL CHECK(length(trim(example)) BETWEEN 1 AND 4000),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX vocabulary_priority_words_user_idx ON public.vocabulary_priority_words(user_id);
ALTER TABLE public.vocabulary_priority_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary_priority_progress DROP CONSTRAINT vocabulary_priority_progress_word_id_check;
ALTER TABLE public.vocabulary_priority_progress ADD CHECK(word_id ~ '^pv-(custom-)?[a-f0-9]{16}$');
CREATE OR REPLACE FUNCTION public.app_priority_vocabulary(p_user UUID,p_action TEXT,p_id TEXT DEFAULT NULL,p_payload JSONB DEFAULT '{}') RETURNS JSONB LANGUAGE plpgsql AS $$
DECLARE entry public.vocabulary_priority_progress%ROWTYPE; target INTEGER; expected INTEGER; created public.vocabulary_priority_words%ROWTYPE;
BEGIN
    IF NOT EXISTS(SELECT 1 FROM public.users WHERE id=p_user) THEN
        RAISE EXCEPTION 'Sign in required' USING ERRCODE='P0002';
    END IF;
    IF p_action='load' THEN
        RETURN jsonb_build_object('words',coalesce((SELECT jsonb_agg(to_jsonb(w)-'user_id' ORDER BY w.created_at,w.id) FROM public.vocabulary_priority_words w WHERE user_id=p_user),'[]'::jsonb),'progress',coalesce((SELECT jsonb_agg(to_jsonb(p)-'user_id' ORDER BY p.word_id) FROM public.vocabulary_priority_progress p WHERE user_id=p_user),'[]'::jsonb));
    END IF;
    IF p_action='create' THEN
        IF jsonb_typeof(p_payload->'word') IS DISTINCT FROM 'string'
            OR jsonb_typeof(p_payload->'mean') IS DISTINCT FROM 'string'
            OR jsonb_typeof(p_payload->'example') IS DISTINCT FROM 'string'
            OR length(trim(p_payload->>'word')) NOT BETWEEN 1 AND 500
            OR length(trim(p_payload->>'mean')) NOT BETWEEN 1 AND 4000
            OR length(trim(p_payload->>'example')) NOT BETWEEN 1 AND 4000 THEN
            RAISE EXCEPTION 'Invalid vocabulary input' USING ERRCODE='22023';
        END IF;
        INSERT INTO public.vocabulary_priority_words(user_id,word,mean,example)
        VALUES(p_user,trim(p_payload->>'word'),trim(p_payload->>'mean'),trim(p_payload->>'example')) RETURNING * INTO created;
        RETURN to_jsonb(created)-'user_id';
    END IF;
    IF p_id LIKE 'pv-custom-%' AND NOT EXISTS(SELECT 1 FROM public.vocabulary_priority_words WHERE id=p_id AND user_id=p_user) THEN
        RAISE EXCEPTION 'Unknown vocabulary word' USING ERRCODE='22023';
    END IF;
    IF p_action<>'save' OR p_id IS NULL OR p_id !~ '^pv-(custom-)?[a-f0-9]{16}$' THEN
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

REVOKE ALL ON public.vocabulary_priority_words FROM anon,authenticated;
GRANT ALL ON public.vocabulary_priority_words TO service_role;
