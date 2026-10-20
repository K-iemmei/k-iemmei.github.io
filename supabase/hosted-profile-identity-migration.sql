-- Correct an imported development label; ownership and custom display names stay intact.
UPDATE public.users p
SET name = coalesce(nullif(trim(a.raw_user_meta_data->>'name'), ''),
    nullif(split_part(a.email, '@', 1), ''), 'Learner')
FROM auth.users a
WHERE p.id = a.id AND p.name = 'Local Developer';
