CREATE TABLE IF NOT EXISTS public.home_todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 300),
    completed BOOLEAN NOT NULL DEFAULT false,
    pinned BOOLEAN NOT NULL DEFAULT true,
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS home_todos_user_idx ON public.home_todos(user_id, pinned DESC, created_at DESC);
CREATE TABLE IF NOT EXISTS public.home_preferences (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    city JSONB,
    news_category TEXT NOT NULL DEFAULT 'latest' CHECK (news_category IN ('latest','world','business','technology'))
);
ALTER TABLE public.home_todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_preferences ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.app_home_api(p_user UUID, p_action TEXT, p_id UUID DEFAULT NULL, p_payload JSONB DEFAULT '{}')
RETURNS JSONB LANGUAGE plpgsql AS $$
DECLARE task public.home_todos%ROWTYPE; result JSONB;
BEGIN
    IF p_user IS NULL OR NOT EXISTS (SELECT 1 FROM public.users WHERE id=p_user) THEN
        RAISE EXCEPTION 'Sign in required' USING ERRCODE='P0002';
    END IF;
    IF p_action='load' THEN
        RETURN jsonb_build_object('todos', (SELECT coalesce(jsonb_agg(to_jsonb(t) - 'user_id' ORDER BY t.pinned DESC,t.created_at DESC,t.id), '[]') FROM public.home_todos t WHERE user_id=p_user),
            'preferences', coalesce((SELECT to_jsonb(p) - 'user_id' FROM public.home_preferences p WHERE user_id=p_user), '{"city":null,"news_category":"latest"}'::jsonb));
    ELSIF p_action='preferences' THEN
        INSERT INTO public.home_preferences(user_id,city,news_category) VALUES(p_user,p_payload->'city',p_payload->>'news_category')
        ON CONFLICT(user_id) DO UPDATE SET city=EXCLUDED.city,news_category=EXCLUDED.news_category;
        RETURN p_payload;
    ELSIF p_action='create' THEN
        IF (SELECT count(*) FROM public.home_todos WHERE user_id=p_user)>=500 THEN
            RAISE EXCEPTION 'Keep at most 500 tasks. Delete finished tasks to add more.' USING ERRCODE='22023';
        END IF;
        INSERT INTO public.home_todos(user_id,title,pinned) VALUES(p_user,trim(p_payload->>'title'),coalesce((p_payload->>'pinned')::boolean,true)) RETURNING * INTO task;
        RETURN to_jsonb(task) - 'user_id';
    END IF;
    SELECT * INTO task FROM public.home_todos WHERE id=p_id AND user_id=p_user FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Task not found' USING ERRCODE='P0002'; END IF;
    IF task.version<>coalesce((p_payload->>'version')::integer,0) THEN
        RAISE EXCEPTION 'Task changed in another tab. Refresh and try again.' USING ERRCODE='40001';
    END IF;
    IF p_action='delete' THEN
        DELETE FROM public.home_todos WHERE id=p_id AND user_id=p_user;
        RETURN jsonb_build_object('deleted',true);
    ELSIF p_action='update' THEN
        UPDATE public.home_todos SET title=coalesce(trim(p_payload->>'title'),title),
            completed=coalesce((p_payload->>'completed')::boolean,completed),
            pinned=coalesce((p_payload->>'pinned')::boolean,pinned),version=version+1,updated_at=now()
        WHERE id=p_id AND user_id=p_user RETURNING * INTO task;
        RETURN to_jsonb(task) - 'user_id';
    END IF;
    RAISE EXCEPTION 'Unknown home action' USING ERRCODE='22023';
END;
$$;
REVOKE ALL ON FUNCTION public.app_home_api(UUID,TEXT,UUID,JSONB) FROM PUBLIC;
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='anon') THEN
        REVOKE ALL ON public.home_todos,public.home_preferences FROM anon;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='authenticated') THEN
        REVOKE ALL ON public.home_todos,public.home_preferences FROM authenticated;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='service_role') THEN
        GRANT EXECUTE ON FUNCTION public.app_home_api(UUID,TEXT,UUID,JSONB) TO service_role;
        GRANT ALL ON public.home_todos,public.home_preferences TO service_role;
    END IF;
END $$;
