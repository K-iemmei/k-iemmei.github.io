-- Read only published snapshots; private Notes remain behind their existing gateway.
CREATE OR REPLACE FUNCTION public.app_blog_list(p_user UUID, p_payload JSONB DEFAULT '{}')
RETURNS JSONB LANGUAGE plpgsql STABLE AS $$
DECLARE
    search_text TEXT := coalesce(p_payload->>'q', '');
    search_field TEXT := coalesce(p_payload->>'field', 'all');
    page_number INTEGER := coalesce((p_payload->>'page')::integer, 1);
    search_pattern TEXT;
    items JSONB;
BEGIN
    IF p_user IS NULL OR NOT EXISTS (SELECT 1 FROM public.users WHERE id=p_user) THEN
        RAISE EXCEPTION 'Sign in required' USING ERRCODE='P0002';
    END IF;
    IF length(search_text)>100 OR page_number<1 OR page_number>10000
        OR search_field NOT IN ('all','title','tag','author') THEN
        RAISE EXCEPTION 'Invalid blog search' USING ERRCODE='22023';
    END IF;
    search_pattern := '%' || replace(replace(replace(search_text, '\', '\\'), '%', '\%'), '_', '\_') || '%';
    SELECT coalesce(jsonb_agg(to_jsonb(entry) ORDER BY entry.published_at DESC,entry.id), '[]'::jsonb)
    INTO items FROM (
        SELECT b.note_id AS id,b.title,left(b.body,280) AS excerpt,b.tags,b.author_id,
            coalesce(nullif(u.name,''),'Learner') AS author_name,b.published_at,b.updated_at,
            greatest(1,ceil(length(b.body)/1000.0))::integer AS reading_minutes
        FROM public.blog_posts b JOIN public.users u ON u.id=b.author_id
        WHERE b.published_at IS NOT NULL AND (
            search_text='' OR
            (search_field IN ('all','title') AND b.title ILIKE search_pattern) OR
            (search_field IN ('all','tag') AND EXISTS (SELECT 1 FROM unnest(b.tags) AS tag WHERE tag ILIKE search_pattern)) OR
            (search_field IN ('all','author') AND u.name ILIKE search_pattern) OR
            (search_field='all' AND b.body ILIKE search_pattern)
        )
        ORDER BY b.published_at DESC,b.note_id LIMIT 25 OFFSET (page_number-1)*24
    ) entry;
    RETURN jsonb_build_object('items',CASE WHEN jsonb_array_length(items)>24 THEN items-24 ELSE items END,
        'has_more',jsonb_array_length(items)>24,'page',page_number);
END;
$$;
REVOKE ALL ON FUNCTION public.app_blog_list(UUID,JSONB) FROM PUBLIC;
