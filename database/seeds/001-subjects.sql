INSERT INTO public.subjects(slug,name,color,description) VALUES
 ('english','English','#3b82f6','Reading, listening and vocabulary'),
 ('chinese','Chinese','#ef4444','Daily Chinese practice'),
 ('data-ai-ml','Data / AI / ML','#8b5cf6','Concepts, notes and flashcards')
ON CONFLICT(slug) DO NOTHING;
