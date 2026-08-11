-- HSK Chinese reading practice schema.
-- One daily passage with approximately ten reading questions.

DROP TABLE IF EXISTS chinese_user_answers CASCADE;
DROP TABLE IF EXISTS chinese_daily_results CASCADE;
DROP TABLE IF EXISTS chinese_questions CASCADE;
DROP TABLE IF EXISTS chinese_lesson_parts CASCADE;
DROP TABLE IF EXISTS chinese_lessons CASCADE;

CREATE TABLE chinese_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_date DATE NOT NULL UNIQUE,
    title TEXT NOT NULL,
    hsk_level TEXT NOT NULL DEFAULT 'HSK 2',
    passage TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE chinese_lesson_parts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES chinese_lessons(id) ON DELETE CASCADE,
    part_order INTEGER NOT NULL CHECK (part_order >= 1),
    part_title TEXT NOT NULL,
    question_instruction TEXT NOT NULL,
    passage TEXT NOT NULL,
    UNIQUE (lesson_id, part_order)
);

CREATE TABLE chinese_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES chinese_lessons(id) ON DELETE CASCADE,
    part_id UUID NOT NULL REFERENCES chinese_lesson_parts(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL CHECK (order_index >= 1),
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'fill_blank', 'true_false')),
    options JSONB NOT NULL DEFAULT '[]'::jsonb,
    answer TEXT NOT NULL,
    points INTEGER NOT NULL DEFAULT 1,
    UNIQUE (lesson_id, order_index)
);

CREATE TABLE chinese_user_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES chinese_lessons(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES chinese_questions(id) ON DELETE CASCADE,
    submitted_answer TEXT NOT NULL DEFAULT '',
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, lesson_id, question_id)
);

CREATE TABLE chinese_daily_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES chinese_lessons(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL,
    correct_count INTEGER NOT NULL DEFAULT 0 CHECK (correct_count >= 0),
    total_count INTEGER NOT NULL DEFAULT 0 CHECK (total_count >= 0),
    score_percent NUMERIC(5, 2) NOT NULL DEFAULT 0 CHECK (score_percent >= 0 AND score_percent <= 100),
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, lesson_id)
);

INSERT INTO chinese_lessons (lesson_date, title, hsk_level, passage)
VALUES (
    CURRENT_DATE,
    '每日中文阅读',
    'HSK 2',
    '顾客朋友们，本店现推出“购书送好礼”活动，购书满 100 元即可获得日记本一个，满 200 元可获得字典一部。另外，部分图书还有打折活动，其中，小说 7.5 折，杂志 8 折，研究生入学考试用书等 6 折。欢迎选购！祝您购物愉快！'
);

WITH lesson AS (SELECT id FROM chinese_lessons WHERE lesson_date = CURRENT_DATE LIMIT 1)
INSERT INTO chinese_lesson_parts (lesson_id, part_order, part_title, question_instruction, passage)
SELECT id, 1, '第一部分', '阅读短文，选择正确的答案或填写答案。', '顾客朋友们，本店现推出“购书送好礼”活动，购书满 100 元即可获得日记本一个，满 200 元可获得字典一部。另外，部分图书还有打折活动，其中，小说 7.5 折，杂志 8 折，研究生入学考试用书等 6 折。欢迎选购！祝您购物愉快！' FROM lesson
UNION ALL SELECT id, 2, '第二部分', '阅读短文，选择正确的答案或填写答案。', '小李每天早上六点半起床。他先喝一杯牛奶，然后骑自行车去公司。公司离他家不远，骑车只需要十五分钟。中午，他通常和同事一起在公司附近吃饭。' FROM lesson
UNION ALL SELECT id, 3, '第三部分', '阅读短文，选择最合适的答案或填写答案。', '周末，天气很好，王老师带学生们去公园。学生们有的在树下看书，有的在草地上踢球，还有的在湖边拍照片。大家玩得很开心，下午五点才一起回家。' FROM lesson;

WITH lesson AS (SELECT id FROM chinese_lessons WHERE lesson_date = CURRENT_DATE LIMIT 1), parts AS (SELECT id, part_order FROM chinese_lesson_parts WHERE lesson_id = (SELECT id FROM lesson))
INSERT INTO chinese_questions (lesson_id, part_id, order_index, question_text, question_type, options, answer)
SELECT l.id, p.id, 1, '购书满 100 元能获得什么礼物？', 'multiple_choice', '["词典","日记本","故事书","汉语书"]'::jsonb, 'B' FROM lesson l JOIN parts p ON p.part_order = 1
UNION ALL SELECT l.id, p.id, 2, '根据这段话，可以知道：', 'multiple_choice', '["小说半价","放寒假了","有些书打折","书店生意很好"]'::jsonb, 'C' FROM lesson l JOIN parts p ON p.part_order = 1
UNION ALL SELECT l.id, p.id, 3, '购书满 ______ 元可以获得一部字典。', 'fill_blank', '[]'::jsonb, '200' FROM lesson l JOIN parts p ON p.part_order = 1
UNION ALL SELECT l.id, p.id, 4, '小李每天几点起床？', 'multiple_choice', '["六点","六点半","七点","七点半"]'::jsonb, 'B' FROM lesson l JOIN parts p ON p.part_order = 2
UNION ALL SELECT l.id, p.id, 5, '小李怎么去公司？', 'multiple_choice', '["坐公共汽车","走路","骑自行车","坐地铁"]'::jsonb, 'C' FROM lesson l JOIN parts p ON p.part_order = 2
UNION ALL SELECT l.id, p.id, 6, '公司离小李家远不远？', 'fill_blank', '[]'::jsonb, '不远' FROM lesson l JOIN parts p ON p.part_order = 2
UNION ALL SELECT l.id, p.id, 7, '小李中午和谁一起吃饭？', 'multiple_choice', '["朋友","家人","同事","老师"]'::jsonb, 'C' FROM lesson l JOIN parts p ON p.part_order = 2
UNION ALL SELECT l.id, p.id, 8, '王老师什么时候带学生去公园？', 'multiple_choice', '["星期一","周末","晚上","放学后"]'::jsonb, 'B' FROM lesson l JOIN parts p ON p.part_order = 3
UNION ALL SELECT l.id, p.id, 9, '学生们没有做什么？', 'multiple_choice', '["看书","踢球","拍照片","游泳"]'::jsonb, 'D' FROM lesson l JOIN parts p ON p.part_order = 3
UNION ALL SELECT l.id, p.id, 10, '大家玩得怎么样？', 'fill_blank', '[]'::jsonb, '很开心' FROM lesson l JOIN parts p ON p.part_order = 3;

-- Add another daily lesson by inserting one lesson row and ten related question rows.
