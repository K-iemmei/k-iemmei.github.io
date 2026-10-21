ALTER TABLE public.personal_notes ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.personal_notes(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS personal_notes_parent_idx ON public.personal_notes(parent_id);

CREATE OR REPLACE FUNCTION public.app_note_tree(p_user UUID, p_action TEXT, p_id UUID DEFAULT NULL, p_payload JSONB DEFAULT '{}')
RETURNS JSONB LANGUAGE plpgsql AS $$
DECLARE
    parent UUID := (p_payload->>'parent_id')::uuid;
    item public.personal_notes%ROWTYPE;
    result JSONB;
BEGIN
    IF p_user IS NULL OR NOT EXISTS (SELECT 1 FROM public.users WHERE id=p_user) THEN
        RAISE EXCEPTION 'Sign in required' USING ERRCODE='P0002';
    END IF;
    -- Serialize hierarchy writes for this owner to prevent concurrent moves making a cycle.
    PERFORM 1 FROM public.users WHERE id=p_user FOR UPDATE;
    IF p_action='tree-list' THEN
        SELECT coalesce(jsonb_agg(to_jsonb(n) ORDER BY n.updated_at DESC,n.id),'[]'::jsonb) INTO result
        FROM (SELECT id,parent_id,title,tags,version,updated_at FROM public.personal_notes WHERE user_id=p_user) n;
        RETURN jsonb_build_object('items',result);
    END IF;
    IF parent IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.personal_notes WHERE id=parent AND user_id=p_user) THEN
        RAISE EXCEPTION 'Parent note not found' USING ERRCODE='P0002';
    END IF;
    IF p_action='tree-create' THEN
        result := public.app_notes_api(p_user,'save',NULL,p_payload);
        UPDATE public.personal_notes SET parent_id=parent WHERE id=(result->>'id')::uuid RETURNING * INTO item;
        RETURN to_jsonb(item);
    ELSIF p_action='tree-move' THEN
        SELECT * INTO item FROM public.personal_notes WHERE id=p_id AND user_id=p_user FOR UPDATE;
        IF NOT FOUND THEN RAISE EXCEPTION 'Note not found' USING ERRCODE='P0002'; END IF;
        IF item.version IS DISTINCT FROM (p_payload->>'version')::integer THEN
            RAISE EXCEPTION 'This note changed. Reload before moving.' USING ERRCODE='40001';
        END IF;
        IF EXISTS (
            WITH RECURSIVE ancestors AS (
                SELECT id,parent_id FROM public.personal_notes WHERE id=parent AND user_id=p_user
                UNION
                SELECT n.id,n.parent_id FROM public.personal_notes n JOIN ancestors a ON n.id=a.parent_id WHERE n.user_id=p_user
            ) SELECT 1 FROM ancestors WHERE id=p_id
        ) THEN RAISE EXCEPTION 'A note cannot be moved into itself or its children.' USING ERRCODE='22023'; END IF;
        UPDATE public.personal_notes SET parent_id=parent,version=version+1,updated_at=now() WHERE id=p_id RETURNING * INTO item;
        RETURN to_jsonb(item);
    END IF;
    RAISE EXCEPTION 'Unknown tree action' USING ERRCODE='22023';
END;
$$;
REVOKE ALL ON FUNCTION public.app_note_tree(UUID,TEXT,UUID,JSONB) FROM PUBLIC;
