export const ENGLISH_SCRIPT = `-- Inspect Reading content; apply schema changes through npm run db:migrate.
SELECT t.slug,t.title,t.status,count(q.id) AS question_count
FROM public.reading_tests t
LEFT JOIN public.reading_passages p ON p.test_id=t.id
LEFT JOIN public.reading_question_groups g ON g.passage_id=p.id
LEFT JOIN public.reading_questions q ON q.group_id=g.id
GROUP BY t.id ORDER BY t.title;`;
export const CHINESE_SCRIPT = `-- Inspect Chinese lessons.
SELECT l.title,l.lesson_date,count(q.id) AS question_count
FROM public.chinese_lessons l
LEFT JOIN public.chinese_questions q ON q.lesson_id=l.id
GROUP BY l.id ORDER BY l.lesson_date DESC;`;
