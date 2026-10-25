CREATE TABLE public.grammar_unit_progress (
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    unit_id TEXT NOT NULL CHECK(unit_id ~ '^giu-00[1-6]$'),
    read BOOLEAN NOT NULL DEFAULT false,
    best_score INTEGER NOT NULL DEFAULT 0,
    completed_at TIMESTAMPTZ,
    drafts JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY(user_id,unit_id)
);
CREATE TABLE public.grammar_attempts (
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    request_id UUID NOT NULL,
    unit_id TEXT NOT NULL,
    mode TEXT NOT NULL,
    score INTEGER NOT NULL,
    total INTEGER NOT NULL,
    results JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY(user_id,request_id)
);
CREATE TABLE public.grammar_reviews (
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    unit_id TEXT NOT NULL,
    question_id TEXT NOT NULL,
    streak INTEGER NOT NULL DEFAULT 0,
    mistakes INTEGER NOT NULL DEFAULT 0,
    due_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY(user_id,question_id)
);
ALTER TABLE public.grammar_unit_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grammar_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grammar_reviews ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.app_grammar_api(p_user UUID,p_action TEXT,p_id TEXT DEFAULT NULL,p_payload JSONB DEFAULT '{}') RETURNS JSONB LANGUAGE plpgsql AS $$
DECLARE entry public.grammar_unit_progress%ROWTYPE; answer JSONB; attempt public.grammar_attempts%ROWTYPE;
BEGIN
    IF NOT EXISTS(SELECT 1 FROM public.users WHERE id=p_user) THEN RAISE EXCEPTION 'Sign in required' USING ERRCODE='P0002'; END IF;
    IF p_action='load' THEN
        RETURN jsonb_build_object('progress',coalesce((SELECT jsonb_agg(to_jsonb(p)-'user_id') FROM public.grammar_unit_progress p WHERE user_id=p_user),'[]'::jsonb),'reviews',coalesce((SELECT jsonb_agg(to_jsonb(r)-'user_id' ORDER BY due_at) FROM public.grammar_reviews r WHERE user_id=p_user),'[]'::jsonb));
    END IF;
    IF p_id !~ '^giu-00[1-6]$' OR p_id IS NULL THEN RAISE EXCEPTION 'Interactive unit unavailable' USING ERRCODE='22023'; END IF;
    INSERT INTO public.grammar_unit_progress(user_id,unit_id) VALUES(p_user,p_id) ON CONFLICT DO NOTHING;
    SELECT * INTO entry FROM public.grammar_unit_progress WHERE user_id=p_user AND unit_id=p_id FOR UPDATE;
    IF p_action='save' THEN
        UPDATE public.grammar_unit_progress SET read=read OR coalesce((p_payload->>'read')::boolean,false),drafts=drafts || coalesce(p_payload->'drafts','{}'),updated_at=now() WHERE user_id=p_user AND unit_id=p_id;
    ELSIF p_action='attempt' THEN
        SELECT * INTO attempt FROM public.grammar_attempts WHERE user_id=p_user AND request_id=(p_payload->>'request_id')::uuid;
        IF NOT FOUND THEN
            INSERT INTO public.grammar_attempts(user_id,request_id,unit_id,mode,score,total,results) VALUES(p_user,(p_payload->>'request_id')::uuid,p_id,p_payload->>'mode',(p_payload->>'score')::int,(p_payload->>'total')::int,p_payload->'results') RETURNING * INTO attempt;
            IF attempt.mode='assessment' THEN
                UPDATE public.grammar_unit_progress SET best_score=greatest(best_score,round(100.0*attempt.score/attempt.total)::int),updated_at=now() WHERE user_id=p_user AND unit_id=p_id;
            END IF;
            FOR answer IN SELECT value FROM jsonb_array_elements(attempt.results) LOOP
                INSERT INTO public.grammar_reviews(user_id,unit_id,question_id,streak,mistakes,due_at)
                VALUES(p_user,p_id,answer->>'id',CASE WHEN (answer->>'correct')::boolean THEN 1 ELSE 0 END,CASE WHEN (answer->>'correct')::boolean THEN 0 ELSE 1 END,now()+interval '1 day')
                ON CONFLICT(user_id,question_id) DO UPDATE SET
                    streak=CASE WHEN (answer->>'correct')::boolean THEN grammar_reviews.streak+1 ELSE 0 END,
                    mistakes=grammar_reviews.mistakes+CASE WHEN (answer->>'correct')::boolean THEN 0 ELSE 1 END,
                    due_at=now()+make_interval(days=>CASE WHEN NOT (answer->>'correct')::boolean THEN 1 WHEN grammar_reviews.streak=0 THEN 1 WHEN grammar_reviews.streak=1 THEN 3 WHEN grammar_reviews.streak=2 THEN 7 WHEN grammar_reviews.streak=3 THEN 14 ELSE 30 END);
            END LOOP;
        ELSIF attempt.unit_id<>p_id THEN RAISE EXCEPTION 'Attempt belongs to another unit' USING ERRCODE='22023';
        END IF;
    ELSE RAISE EXCEPTION 'Invalid grammar action' USING ERRCODE='22023'; END IF;
    UPDATE public.grammar_unit_progress SET completed_at=CASE WHEN read AND best_score>=80 THEN coalesce(completed_at,now()) ELSE NULL END WHERE user_id=p_user AND unit_id=p_id RETURNING * INTO entry;
    RETURN jsonb_build_object('progress',to_jsonb(entry)-'user_id','attempt',CASE WHEN attempt.request_id IS NULL THEN NULL ELSE to_jsonb(attempt)-'user_id' END);
END;
$$;
REVOKE ALL ON FUNCTION public.app_grammar_api(UUID,TEXT,TEXT,JSONB) FROM PUBLIC;
