CREATE TABLE IF NOT EXISTS public.personal_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT '' CHECK (length(title) <= 160),
    body TEXT NOT NULL DEFAULT '' CHECK (length(body) <= 200000),
    tags TEXT[] NOT NULL DEFAULT '{}' CHECK (cardinality(tags) <= 10),
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS personal_notes_user_updated_idx ON public.personal_notes(user_id, updated_at DESC);
CREATE TABLE IF NOT EXISTS public.blog_posts (
    note_id UUID PRIMARY KEY REFERENCES public.personal_notes(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    note_version INTEGER NOT NULL,
    published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS blog_posts_published_idx ON public.blog_posts(published_at DESC, note_id);
CREATE TABLE IF NOT EXISTS public.note_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    note_id UUID NOT NULL REFERENCES public.personal_notes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    mime_type TEXT NOT NULL CHECK (mime_type IN ('image/png','image/jpeg','image/gif','image/webp')),
    data_base64 TEXT NOT NULL CHECK (length(data_base64) BETWEEN 4 AND 2796204),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS note_assets_note_idx ON public.note_assets(note_id);
ALTER TABLE public.personal_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.note_assets ENABLE ROW LEVEL SECURITY;

-- Both API runtimes use this gateway. Only their server role may execute it.
-- Personal data is scoped by the authenticated p_user, never a client-supplied owner.
CREATE OR REPLACE FUNCTION public.app_notes_api(p_user UUID, p_action TEXT, p_id UUID DEFAULT NULL, p_payload JSONB DEFAULT '{}')
RETURNS JSONB LANGUAGE plpgsql AS $$
DECLARE
    note public.personal_notes%ROWTYPE;
    asset public.note_assets%ROWTYPE;
    result JSONB;
    items JSONB;
    search_text TEXT := coalesce(p_payload->>'q', '');
    search_pattern TEXT;
    page_number INTEGER := coalesce((p_payload->>'page')::integer, 1);
    expected_version INTEGER := coalesce((p_payload->>'version')::integer, 0);
    tag_values TEXT[];
BEGIN
    IF p_user IS NULL OR NOT EXISTS (SELECT 1 FROM public.users WHERE id=p_user) THEN
        RAISE EXCEPTION 'Sign in required' USING ERRCODE='P0002';
    END IF;
    IF length(search_text)>100 OR page_number<1 OR page_number>10000 THEN
        RAISE EXCEPTION 'Invalid search or page' USING ERRCODE='22023';
    END IF;
    search_pattern := '%' || replace(replace(replace(search_text, '\', '\\'), '%', '\%'), '_', '\_') || '%';
    IF p_action='list' THEN
        SELECT coalesce(jsonb_agg(to_jsonb(entry)), '[]'::jsonb) INTO items FROM (
            SELECT n.id,n.title,left(n.body,240) AS excerpt,n.tags,n.version,n.created_at,n.updated_at,
                b.published_at,b.note_version AS published_version
            FROM public.personal_notes n LEFT JOIN public.blog_posts b ON b.note_id=n.id
            WHERE n.user_id=p_user AND (n.title ILIKE search_pattern OR n.body ILIKE search_pattern OR array_to_string(n.tags,' ') ILIKE search_pattern)
                AND (coalesce(p_payload->>'status','all')='all' OR (p_payload->>'status'='private' AND b.note_id IS NULL) OR (p_payload->>'status'='posted' AND b.note_id IS NOT NULL))
            ORDER BY n.updated_at DESC,n.id LIMIT 25 OFFSET (page_number-1)*24
        ) entry;
        RETURN jsonb_build_object('items', CASE WHEN jsonb_array_length(items)>24 THEN items-24 ELSE items END,
            'has_more',jsonb_array_length(items)>24,'page',page_number);
    ELSIF p_action='blog-list' THEN
        SELECT coalesce(jsonb_agg(to_jsonb(entry)), '[]'::jsonb) INTO items FROM (
            SELECT b.note_id AS id,b.title,left(b.body,280) AS excerpt,b.tags,b.author_id,
                coalesce(nullif(u.name,''),'Learner') AS author_name,b.published_at,b.updated_at,
                greatest(1,ceil(length(b.body)/1000.0))::integer AS reading_minutes
            FROM public.blog_posts b JOIN public.users u ON u.id=b.author_id
            WHERE (b.title ILIKE search_pattern OR b.body ILIKE search_pattern OR u.name ILIKE search_pattern OR array_to_string(b.tags,' ') ILIKE search_pattern)
            ORDER BY b.published_at DESC,b.note_id LIMIT 25 OFFSET (page_number-1)*24
        ) entry;
        RETURN jsonb_build_object('items',CASE WHEN jsonb_array_length(items)>24 THEN items-24 ELSE items END,
            'has_more',jsonb_array_length(items)>24,'page',page_number);
    ELSIF p_action='blog-get' THEN
        SELECT jsonb_build_object('id',b.note_id,'title',b.title,'body',b.body,'tags',b.tags,
            'author_id',b.author_id,'author_name',coalesce(nullif(u.name,''),'Learner'),
            'published_at',b.published_at,'updated_at',b.updated_at) INTO result
        FROM public.blog_posts b JOIN public.users u ON u.id=b.author_id WHERE b.note_id=p_id;
        IF result IS NULL THEN RAISE EXCEPTION 'Post not found' USING ERRCODE='P0002'; END IF;
        RETURN result;
    ELSIF p_action='asset-get' THEN
        SELECT a.* INTO asset FROM public.note_assets a LEFT JOIN public.blog_posts b ON b.note_id=a.note_id
        WHERE a.id=p_id AND (a.user_id=p_user OR strpos(lower(b.body),'note-asset:'||a.id::text)>0);
        IF NOT FOUND THEN RAISE EXCEPTION 'Image not found' USING ERRCODE='P0002'; END IF;
        RETURN jsonb_build_object('id',asset.id,'mime_type',asset.mime_type,'data_base64',asset.data_base64);
    ELSIF p_action='save' THEN
        IF jsonb_typeof(p_payload->'title') IS DISTINCT FROM 'string' OR
           jsonb_typeof(p_payload->'body') IS DISTINCT FROM 'string' OR
           jsonb_typeof(p_payload->'tags') IS DISTINCT FROM 'array' OR
           length(p_payload->>'title')>160 OR length(p_payload->>'body')>200000 OR jsonb_array_length(p_payload->'tags')>10 THEN
            RAISE EXCEPTION 'Invalid note content' USING ERRCODE='22023';
        END IF;
        SELECT array_agg(value) INTO tag_values FROM jsonb_array_elements_text(p_payload->'tags');
        IF EXISTS (SELECT 1 FROM unnest(tag_values) tag WHERE length(tag)>32 OR length(tag)=0) THEN
            RAISE EXCEPTION 'Invalid tags' USING ERRCODE='22023';
        END IF;
        IF p_id IS NULL THEN
            INSERT INTO public.personal_notes(user_id,title,body,tags) VALUES(p_user,p_payload->>'title',p_payload->>'body',coalesce(tag_values,'{}')) RETURNING * INTO note;
        ELSE
            SELECT * INTO note FROM public.personal_notes WHERE id=p_id AND user_id=p_user FOR UPDATE;
            IF NOT FOUND THEN RAISE EXCEPTION 'Note not found' USING ERRCODE='P0002'; END IF;
            IF note.version<>expected_version THEN RAISE EXCEPTION 'This note changed in another tab. Reload before saving.' USING ERRCODE='40001'; END IF;
            UPDATE public.personal_notes SET title=p_payload->>'title',body=p_payload->>'body',tags=coalesce(tag_values,'{}'),version=version+1,updated_at=now() WHERE id=p_id RETURNING * INTO note;
        END IF;
        RETURN to_jsonb(note);
    END IF;
    -- All remaining actions require ownership, including publication and uploads.
    SELECT * INTO note FROM public.personal_notes WHERE id=p_id AND user_id=p_user FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Note not found' USING ERRCODE='P0002'; END IF;
    IF p_action='get' THEN
        RETURN to_jsonb(note) || jsonb_build_object('publication', (SELECT jsonb_build_object('published_at',published_at,'updated_at',updated_at,'note_version',note_version) FROM public.blog_posts WHERE note_id=p_id));
    ELSIF p_action='asset-create' THEN
        IF length(p_payload->>'data_base64')>2796204 OR coalesce(p_payload->>'mime_type','') NOT IN ('image/png','image/jpeg','image/gif','image/webp') THEN
            RAISE EXCEPTION 'Invalid image' USING ERRCODE='22023';
        END IF;
        INSERT INTO public.note_assets(note_id,user_id,mime_type,data_base64) VALUES(p_id,p_user,p_payload->>'mime_type',p_payload->>'data_base64') RETURNING * INTO asset;
        RETURN jsonb_build_object('id',asset.id,'mime_type',asset.mime_type);
    END IF;
    IF note.version<>expected_version THEN RAISE EXCEPTION 'This note changed in another tab. Reload before continuing.' USING ERRCODE='40001'; END IF;
    IF p_action='publish' THEN
        IF trim(note.title)='' OR trim(note.body)='' THEN RAISE EXCEPTION 'Add a title and content before posting.' USING ERRCODE='22023'; END IF;
        IF EXISTS (
            SELECT 1 FROM regexp_matches(note.body, 'note-asset:([0-9a-fA-F-]{36})','g') AS match
            WHERE NOT EXISTS (SELECT 1 FROM public.note_assets a WHERE a.id::text=lower(match[1]) AND a.note_id=p_id AND a.user_id=p_user)
        ) THEN RAISE EXCEPTION 'This note references an image that does not belong to it.' USING ERRCODE='22023'; END IF;
        INSERT INTO public.blog_posts(note_id,author_id,title,body,tags,note_version)
        VALUES(p_id,p_user,note.title,note.body,note.tags,note.version)
        ON CONFLICT(note_id) DO UPDATE SET title=EXCLUDED.title,body=EXCLUDED.body,tags=EXCLUDED.tags,note_version=EXCLUDED.note_version,updated_at=now();
        RETURN jsonb_build_object('id',p_id,'published',true);
    ELSIF p_action='unpublish' THEN
        DELETE FROM public.blog_posts WHERE note_id=p_id AND author_id=p_user;
        RETURN jsonb_build_object('id',p_id,'published',false);
    ELSIF p_action='delete' THEN
        DELETE FROM public.personal_notes WHERE id=p_id AND user_id=p_user;
        RETURN jsonb_build_object('deleted',true);
    END IF;
    RAISE EXCEPTION 'Unknown publishing action' USING ERRCODE='22023';
END;
$$;
REVOKE ALL ON FUNCTION public.app_notes_api(UUID,TEXT,UUID,JSONB) FROM PUBLIC;
