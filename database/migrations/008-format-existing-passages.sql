UPDATE public.reading_passages
SET content_html = '<p>' || regexp_replace(
    replace(replace(replace(content, '&', '&amp;'), '<', '&lt;'), '>', '&gt;'),
    E'\\n[ \\t]*\\n+',
    '</p><p>',
    'g'
) || '</p>'
WHERE content_html = '' AND content <> '';
