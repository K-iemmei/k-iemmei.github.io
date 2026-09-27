-- Local seed file for Cambridge IELTS Reading 1-20.
-- This is intended for local Postgres/Supabase development and easy copy into a cloud DB.
-- Each test below is inserted as a draft record. Review and set status='published' after QA.

INSERT INTO reading_tests (slug, title, source_name, source_url, test_format, status, duration_minutes)
VALUES
    ('cambridge-ielts-20-academic-reading-test-1', 'Cambridge IELTS 20 Academic Reading Test 1', 'Cambridge', 'https://engnovate.com/cambridge-ielts-20-academic-reading-test-1/', 'academic', 'draft', 60),
    ('cambridge-ielts-20-academic-reading-test-2', 'Cambridge IELTS 20 Academic Reading Test 2', 'Cambridge', 'https://engnovate.com/cambridge-ielts-20-academic-reading-test-2/', 'academic', 'draft', 60),
    ('cambridge-ielts-20-academic-reading-test-3', 'Cambridge IELTS 20 Academic Reading Test 3', 'Cambridge', 'https://engnovate.com/cambridge-ielts-20-academic-reading-test-3/', 'academic', 'draft', 60),
    ('cambridge-ielts-20-academic-reading-test-4', 'Cambridge IELTS 20 Academic Reading Test 4', 'Cambridge', 'https://engnovate.com/cambridge-ielts-20-academic-reading-test-4/', 'academic', 'draft', 60),
    ('cambridge-ielts-19-academic-reading-test-1', 'Cambridge IELTS 19 Academic Reading Test 1', 'Cambridge', 'https://engnovate.com/cambridge-ielts-19-academic-reading-test-1/', 'academic', 'draft', 60),
    ('cambridge-ielts-19-academic-reading-test-2', 'Cambridge IELTS 19 Academic Reading Test 2', 'Cambridge', 'https://engnovate.com/cambridge-ielts-19-academic-reading-test-2/', 'academic', 'draft', 60),
    ('cambridge-ielts-19-academic-reading-test-3', 'Cambridge IELTS 19 Academic Reading Test 3', 'Cambridge', 'https://engnovate.com/cambridge-ielts-19-academic-reading-test-3/', 'academic', 'draft', 60),
    ('cambridge-ielts-19-academic-reading-test-4', 'Cambridge IELTS 19 Academic Reading Test 4', 'Cambridge', 'https://engnovate.com/cambridge-ielts-19-academic-reading-test-4/', 'academic', 'draft', 60),
    ('cambridge-ielts-18-academic-reading-test-1', 'Cambridge IELTS 18 Academic Reading Test 1', 'Cambridge', 'https://engnovate.com/cambridge-ielts-18-academic-reading-test-1/', 'academic', 'draft', 60),
    ('cambridge-ielts-18-academic-reading-test-2', 'Cambridge IELTS 18 Academic Reading Test 2', 'Cambridge', 'https://engnovate.com/cambridge-ielts-18-academic-reading-test-2/', 'academic', 'draft', 60),
    ('cambridge-ielts-18-academic-reading-test-3', 'Cambridge IELTS 18 Academic Reading Test 3', 'Cambridge', 'https://engnovate.com/cambridge-ielts-18-academic-reading-test-3/', 'academic', 'draft', 60),
    ('cambridge-ielts-18-academic-reading-test-4', 'Cambridge IELTS 18 Academic Reading Test 4', 'Cambridge', 'https://engnovate.com/cambridge-ielts-18-academic-reading-test-4/', 'academic', 'draft', 60),
    ('cambridge-ielts-17-academic-reading-test-1', 'Cambridge IELTS 17 Academic Reading Test 1', 'Cambridge', 'https://engnovate.com/cambridge-ielts-17-academic-reading-test-1/', 'academic', 'draft', 60),
    ('cambridge-ielts-17-academic-reading-test-2', 'Cambridge IELTS 17 Academic Reading Test 2', 'Cambridge', 'https://engnovate.com/cambridge-ielts-17-academic-reading-test-2/', 'academic', 'draft', 60),
    ('cambridge-ielts-17-academic-reading-test-3', 'Cambridge IELTS 17 Academic Reading Test 3', 'Cambridge', 'https://engnovate.com/cambridge-ielts-17-academic-reading-test-3/', 'academic', 'draft', 60),
    ('cambridge-ielts-17-academic-reading-test-4', 'Cambridge IELTS 17 Academic Reading Test 4', 'Cambridge', 'https://engnovate.com/cambridge-ielts-17-academic-reading-test-4/', 'academic', 'draft', 60),
    ('cambridge-ielts-16-academic-reading-test-1', 'Cambridge IELTS 16 Academic Reading Test 1', 'Cambridge', 'https://engnovate.com/cambridge-ielts-16-academic-reading-test-1/', 'academic', 'draft', 60),
    ('cambridge-ielts-16-academic-reading-test-2', 'Cambridge IELTS 16 Academic Reading Test 2', 'Cambridge', 'https://engnovate.com/cambridge-ielts-16-academic-reading-test-2/', 'academic', 'draft', 60),
    ('cambridge-ielts-16-academic-reading-test-3', 'Cambridge IELTS 16 Academic Reading Test 3', 'Cambridge', 'https://engnovate.com/cambridge-ielts-16-academic-reading-test-3/', 'academic', 'draft', 60),
    ('cambridge-ielts-16-academic-reading-test-4', 'Cambridge IELTS 16 Academic Reading Test 4', 'Cambridge', 'https://engnovate.com/cambridge-ielts-16-academic-reading-test-4/', 'academic', 'draft', 60)
ON CONFLICT (slug) DO NOTHING;

-- Recommended publish flow after QA:
-- UPDATE reading_tests SET status = 'published' WHERE slug LIKE 'cambridge-ielts-%';

-- To copy into a cloud DB, run this file in local SQL first, then export/import the same rows
-- into the cloud Postgres/Supabase instance, or use the same migration script directly there.
