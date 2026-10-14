INSERT INTO public.chinese_lessons(id,lesson_date,title,hsk_level,passage,is_active)
VALUES ('10000000-0000-4000-8000-000000000001', DATE '2026-01-01','Local Chinese Demo','HSK 1','Local sample: the answer is B.',TRUE)
ON CONFLICT DO NOTHING;
INSERT INTO public.chinese_lesson_parts(id,lesson_id,part_order,part_title,question_instruction,passage)
SELECT '10000000-0000-4000-8000-000000000002',id,1,'Part 1','Choose the correct answer.','Local sample: the answer is B.'
FROM public.chinese_lessons WHERE id='10000000-0000-4000-8000-000000000001' ON CONFLICT DO NOTHING;
INSERT INTO public.chinese_questions(id,lesson_id,part_id,order_index,question_text,question_type,options,answer)
SELECT '10000000-0000-4000-8000-000000000003',lesson_id,id,1,'Choose B.','multiple_choice','["A","B"]'::jsonb,'"B"'::jsonb
FROM public.chinese_lesson_parts WHERE id='10000000-0000-4000-8000-000000000002' ON CONFLICT DO NOTHING;
