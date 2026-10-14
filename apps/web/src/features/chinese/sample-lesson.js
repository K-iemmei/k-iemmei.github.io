export function buildFallbackLesson() {
    const parts = [
        {
            id: 'fallback-part-1',
            part_order: 1,
            part_title: '第一部分',
            question_instruction: '阅读短文，选择正确的答案。',
            passage:
                '顾客朋友们，本店现推出“购书送好礼”活动，购书满 100 元即可获得日记本一个，满 200 元可获得字典一部。另外，部分图书还有打折活动，其中，小说 7.5 折，杂志 8 折，研究生入学考试用书等 6 折。欢迎选购！祝您购物愉快！',
            questions: [
                [
                    '购书满 100 元能获得什么礼物？',
                    ['词典', '日记本', '故事书', '汉语书'],
                    'B',
                    'multiple_choice',
                ],
                [
                    '根据这段话，可以知道：',
                    ['小说半价', '放寒假了', '有些书打折', '书店生意很好'],
                    'C',
                    'multiple_choice',
                ],
                ['购书满 ______ 元可以获得一本字典。', [], '200', 'fill_blank'],
            ],
        },
        {
            id: 'fallback-part-2',
            part_order: 2,
            part_title: '第二部分',
            question_instruction: '阅读短文，选择正确的答案或填写答案。',
            passage:
                '小李每天早上六点半起床。他先喝一杯牛奶，然后骑自行车去公司。公司离他家不远，骑车只需要十五分钟。中午，他通常和同事一起在公司附近吃饭。',
            questions: [
                [
                    '小李每天几点起床？',
                    ['六点', '六点半', '七点', '七点半'],
                    'B',
                    'multiple_choice',
                ],
                [
                    '小李怎么去公司？',
                    ['坐公共汽车', '走路', '骑自行车', '坐地铁'],
                    'C',
                    'multiple_choice',
                ],
                ['公司离小李家远不远？', [], '不远', 'fill_blank'],
                [
                    '小李中午和谁一起吃饭？',
                    ['朋友', '家人', '同事', '老师'],
                    'C',
                    'multiple_choice',
                ],
            ],
        },
        {
            id: 'fallback-part-3',
            part_order: 3,
            part_title: '第三部分',
            question_instruction: '阅读短文，选择最合适的答案。',
            passage:
                '周末，天气很好，王老师带学生们去公园。学生们有的在树下看书，有的在草地上踢球，还有的在湖边拍照片。大家玩得很开心，下午五点才一起回家。',
            questions: [
                [
                    '王老师什么时候带学生去公园？',
                    ['星期一', '周末', '晚上', '放学后'],
                    'B',
                    'multiple_choice',
                ],
                ['学生们没有做什么？', ['看书', '踢球', '拍照片', '游泳'], 'D', 'multiple_choice'],
                ['大家玩得怎么样？', [], '很开心', 'fill_blank'],
            ],
        },
    ];

    let questionNumber = 1;
    return {
        lesson: {
            id: null,
            lesson_date: new Date().toISOString().slice(0, 10),
            title: '每日中文阅读',
        },
        parts: parts.map((part) => ({
            ...part,
            questions: part.questions.map((question) => ({
                id: `fallback-chinese-${questionNumber}`,
                order_index: questionNumber++,
                question_text: question[0],
                options: question[1],
                answer: question[2],
                question_type: question[3],
            })),
        })),
    };
}
