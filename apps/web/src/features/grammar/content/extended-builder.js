// Authoring format: six topic-specific bilingual frames, each with an explicit contrast.
// Variants change the situation and the response task, while preserving the grammar target.
const names = ['Linh', 'Mai', 'Trang', 'Hoa'];
const words = {
    person: names.map((n) => [n, n]),
    item: [
        ['report', 'báo cáo'],
        ['proposal', 'đề xuất'],
        ['contract', 'hợp đồng'],
        ['plan', 'kế hoạch'],
    ],
    place: [
        ['Hanoi', 'Hà Nội'],
        ['Da Nang', 'Đà Nẵng'],
        ['Hue', 'Huế'],
        ['Hai Phong', 'Hải Phòng'],
    ],
    device: [
        ['printer', 'máy in'],
        ['laptop', 'máy tính xách tay'],
        ['monitor', 'màn hình'],
        ['tablet', 'máy tính bảng'],
    ],
};
function fill(text, variant, vi = false) {
    return text.replace(
        /\{(person|item|place|device)\}/g,
        (_, key) => words[key][variant % 4][vi ? 1 : 0],
    );
}
const clean = (s) => s.replace(/\s+/g, ' ').trim();
export function unit(number, notes, source) {
    const rules = notes.split('|');
    if (rules.length !== 3) throw Error(`Unit ${number}: expected three teaching notes`);
    const frames = source
        .trim()
        .split('\n')
        .map((line) => {
            const [en, vi, why] = line.trim().split('|');
            const match = en?.match(/\[([^\]]+)\]/);
            if (!match || !vi || !why)
                throw Error(`Unit ${number}: incomplete bilingual frame ${line}`);
            const [answer, wrong] = match[1].split('~');
            if (!answer || !wrong || answer === wrong)
                throw Error(`Unit ${number}: missing explicit contrast`);
            return { en, vi, why, answer, wrong, marker: match[0] };
        });
    if (frames.length !== 6) throw Error(`Unit ${number}: expected six distinct patterns`);
    const sentence = (frame, variant, wrong = false) =>
        clean(
            fill(
                frame.en.replace(
                    frame.marker,
                    (wrong ? frame.wrong : frame.answer) === '—'
                        ? ''
                        : wrong
                          ? frame.wrong
                          : frame.answer,
                ),
                variant,
            ),
        );
    const examples = frames.map((f, i) => [
        'Tình huống ' + (i + 1),
        sentence(f, 0),
        fill(f.vi, 0, true),
        f.answer === '—' ? '' : fill(f.answer, 0),
        f.why,
        sentence(f, 1),
    ]);
    const questions = Array.from({ length: 19 }, (_, i) => {
        const index = i < 8 ? i % 6 : i < 14 ? i - 8 : i - 14,
            f = frames[index];
        const variant = i < 6 ? 0 : i < 8 ? 1 : i < 14 ? 2 : 3;
        const correct = sentence(f, variant),
            incorrect = sentence(f, variant, true);
        const target = fill(f.vi, variant, true);
        const common = {
            hint: f.why,
            explanation: f.why + ' ' + rules[index % 3],
            punctuationSensitive: [95, 96].includes(number),
        };
        if (i >= 8 && i < 14) {
            if (i % 2 === 0)
                return {
                    ...common,
                    type: 'error',
                    prompt: `${[109, 110].includes(number) ? 'Chỉnh về mẫu trật tự trung tính trong bài' : 'Sửa đúng phần sai, giữ nguyên các từ khác'}: ${incorrect} (Ý cần diễn đạt: ${target})`,
                    answers: [correct],
                };
            return {
                ...common,
                type: 'order',
                prompt: `Sắp xếp và giữ dấu câu phù hợp: ${correct
                    .replace(/[.!?]$/, '')
                    .split(' ')
                    .reverse()
                    .join(' / ')} (Ý cần diễn đạt: ${target})`,
                answers: [correct],
            };
        }
        if (i >= 14) {
            const options = i % 2 ? [incorrect, correct] : [correct, incorrect];
            return {
                ...common,
                type: 'choice',
                prompt: `${[109, 110].includes(number) ? 'Chọn mẫu trật tự trung tính theo bài' : 'Chọn câu phù hợp với ý'}: ${target}`,
                answers: [correct],
                options,
            };
        }
        return {
            ...common,
            type: 'gap',
            prompt: `Điền phần còn thiếu (— = không cần từ): ${fill(f.en.replace(f.marker, '___'), variant)} (Ý cần diễn đạt: ${target})`,
            answers:
                f.answer === '—' ? ['—', '-', 'none', 'no article'] : [fill(f.answer, variant)],
        };
    });
    const scenarios = [
        [
            'Email công việc',
            `Bạn cần diễn đạt các ý sau trong một email ngắn: ${fill(frames[0].vi, 1, true)} ${fill(frames[1].vi, 1, true)} Thêm lời mở đầu và một câu hỏi phù hợp.`,
            `Hi team,\n${sentence(frames[0], 1)} ${sentence(frames[1], 1)}\nCould you confirm the next step?\nThanks.`,
        ],
        [
            'Hội thoại theo tình huống',
            `Đóng vai người đang trao đổi với một người bạn. Viết 2 lượt nói sử dụng các ý: ${fill(frames[2].vi, 2, true)} ${fill(frames[3].vi, 2, true)} Tự thêm lời đáp theo bối cảnh.`,
            `A: ${sentence(frames[2], 2)}\nB: ${sentence(frames[3], 2)}`,
        ],
        [
            'Vận dụng cá nhân',
            `Viết 3–5 câu cho một tình huống của chính bạn, vận dụng hai mẫu: ${fill(frames[4].vi, 3, true)} ${fill(frames[5].vi, 3, true)} Thay tên, thông tin và bối cảnh cho phù hợp.`,
            `${sentence(frames[4], 3)} ${sentence(frames[5], 3)} ${sentence(frames[0], 3)}`,
        ],
    ];
    return {
        objective: rules[0],
        rules: rules.map((text, i) => [
            ['Nghĩa và cách dùng', 'Cấu trúc và lựa chọn', 'Phân biệt và lưu ý'][i],
            text,
            frames[i * 2].answer === '—'
                ? 'Không dùng từ ở vị trí này'
                : fill(frames[i * 2].answer, 0),
        ]),
        trap: [sentence(frames[0], 2, true), sentence(frames[0], 2), frames[0].why],
        examples,
        questions,
        scenarios,
    };
}
