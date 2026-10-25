// Original Vietnamese teaching notes and original practice, aligned to book units.
// No book exercises or answer keys are reproduced here.
const q = (type, prompt, answers, explanation, options) => ({
    type,
    prompt,
    answers: Array.isArray(answers) ? answers : [answers],
    explanation,
    options,
});
export const bookLessons = {
    1: {
        objective: 'Mô tả việc đang diễn ra, dự án tạm thời và sự thay đổi bằng am/is/are + V-ing.',
        rules: [
            [
                'Hành động chưa kết thúc',
                'Dùng tiếp diễn cho việc đang xảy ra hoặc đang trong quá trình thực hiện quanh hiện tại; không nhất thiết ngay giây nói.',
                'S + am/is/are (+ not) + V-ing',
            ],
            [
                'Câu hỏi và dạng rút gọn',
                'Đảo am/is/are trước chủ ngữ. I’m = I am, isn’t = is not, aren’t = are not.',
                'Are you working? / I’m not working.',
            ],
            [
                'Tạm thời và thay đổi',
                'Nêu rõ bối cảnh tạm thời: this week, for now. Dùng getting, becoming, improving để mô tả thay đổi; một trạng từ không tự quyết định thì.',
                'We are testing a new workflow this week.',
            ],
        ],
        trap: [
            'I working from home today.',
            'I am working from home today.',
            'V-ing cần trợ động từ be khi tạo thì tiếp diễn.',
        ],
        examples: [
            [
                'Công việc',
                'I am reviewing your application this afternoon.',
                'Tôi đang xem xét hồ sơ của bạn chiều nay.',
                'am reviewing',
                'Việc xem xét đang trong tiến trình hôm nay.',
                'Are you reviewing all the applications?',
            ],
            [
                'Tin nhắn',
                'We are waiting outside the cinema.',
                'Chúng tôi đang đợi bên ngoài rạp phim.',
                'are waiting',
                'Mô tả hoạt động ở thời điểm nhắn tin.',
                'We are not waiting in the café.',
            ],
            [
                'Học tập',
                'She is preparing for her driving test this month.',
                'Tháng này cô ấy đang chuẩn bị cho kỳ thi lái xe.',
                'is preparing',
                'Quá trình kéo dài qua nhiều ngày.',
                'Is she preparing with an instructor?',
            ],
            [
                'Cuộc gọi',
                'I am not driving, so I can talk.',
                'Tôi không đang lái xe nên có thể nói chuyện.',
                'am not driving',
                'Phủ định hoạt động hiện tại.',
                'Are you driving right now?',
            ],
            [
                'Dự án',
                'Our team is building a booking tool.',
                'Nhóm chúng tôi đang xây dựng công cụ đặt lịch.',
                'is building',
                'Dự án chưa hoàn tất, dù lúc này có thể đang nghỉ.',
                'The team is also testing notifications.',
            ],
            [
                'Thay đổi',
                'My pronunciation is improving with daily practice.',
                'Phát âm của tôi đang tiến bộ nhờ luyện mỗi ngày.',
                'is improving',
                'Diễn tả xu hướng thay đổi.',
                'Are your listening skills improving too?',
            ],
        ],
        questions: [
            q(
                'gap',
                'Please wait: I ___ (upload) the invoice now.',
                'am uploading',
                'I đi với am; upload thêm -ing.',
            ),
            q(
                'gap',
                'Our designers ___ (work) on a temporary project this week.',
                'are working',
                'Chủ ngữ số nhiều dùng are; dự án tạm thời.',
            ),
            q(
                'gap',
                'The queue ___ (get) longer as we speak.',
                'is getting',
                'Xu hướng đang xảy ra; get → getting.',
            ),
            q(
                'gap',
                'Look! The bus ___ (come).',
                'is coming',
                'Sự việc đang xảy ra; come bỏ e trước -ing.',
            ),
            q(
                'gap',
                'You can use my desk; I ___ (not/use) it today.',
                ['am not using', "'m not using"],
                'I am not + V-ing cho tình huống hôm nay.',
            ),
            q(
                'choice',
                'Your colleague is on a live call. Which message fits?',
                'She is speaking to the client.',
                'Hoạt động đang diễn ra cần is speaking.',
                [
                    'She speaks to the client every Monday.',
                    'She is speaking to the client.',
                    'She speaking to the client.',
                ],
            ),
            q(
                'gap',
                'Why ___ (you/smile) at your phone?',
                'are you smiling',
                'Câu hỏi đảo are trước you; smile → smiling.',
            ),
            q(
                'gap',
                'I started this course last week and have not finished. I ___ (study) project management.',
                'am studying',
                'Một khóa học đang trong quá trình thực hiện.',
            ),
            q(
                'error',
                'Sửa toàn bộ câu: They waiting for the delivery.',
                'They are waiting for the delivery.',
                'Thiếu are trước waiting.',
            ),
            q(
                'order',
                'Sắp xếp: you / are / what / cooking / ?',
                'What are you cooking?',
                'Từ hỏi + are + chủ ngữ + V-ing.',
            ),
            q(
                'rewrite',
                'Đổi sang phủ định: She is recording the meeting.',
                ['She is not recording the meeting.', "She isn't recording the meeting."],
                'Thêm not sau is.',
            ),
            q(
                'context',
                'A: Can you talk? B: Not now. I ___ (join) a video call.',
                'am joining',
                'Đang tham gia cuộc gọi ở thời điểm nói.',
            ),
            q(
                'gap',
                'The children are quiet because they ___ (draw) in their room.',
                'are drawing',
                'Chủ ngữ số nhiều và hoạt động đang xảy ra.',
            ),
            q(
                'rewrite',
                'Viết câu hỏi yes/no: You are staying with your cousin.',
                'Are you staying with your cousin?',
                'Đảo are; không thêm do.',
            ),
            q(
                'gap',
                'The technician ___ (repair) our router right now.',
                'is repairing',
                'Chủ ngữ số ít: is repairing.',
            ),
            q(
                'gap',
                'We ___ (not/run) the old software during this trial.',
                ['are not running', "aren't running"],
                'Phủ định tạm thời: are not + running.',
            ),
            q(
                'order',
                'Sắp xếp: improving / connection / is / the / ?',
                'Is the connection improving?',
                'Câu hỏi tiếp diễn bắt đầu bằng is.',
            ),
            q(
                'choice',
                'You started a long novel yesterday and are halfway through.',
                'I am reading a long novel this week.',
                'Quá trình chưa kết thúc; không cần đang đọc đúng giây này.',
                [
                    'I reading a long novel this week.',
                    'I am reading a long novel this week.',
                    'I am read a long novel this week.',
                ],
            ),
            q(
                'error',
                'Sửa: He is makeing lunch.',
                'He is making lunch.',
                'Make bỏ e trước khi thêm -ing.',
            ),
        ],
        scenarios: [
            [
                'Tin nhắn tiến độ',
                'Bạn là thành viên nhóm. Viết 3 câu báo việc đang làm, việc chưa làm lúc này và một thay đổi của dự án.',
                'I am checking the payment flow. I am not testing refunds today. The response time is improving.',
            ],
            [
                'Cuộc gọi từ bạn',
                'Bạn đang ở ga tàu. Trả lời câu hỏi “What are you doing?” và hỏi người bạn đang làm gì.',
                'I am waiting for my train. Are you working from home today?',
            ],
            [
                'Email tạm thời',
                'Bạn làm ở văn phòng khác trong tuần này. Viết email ngắn nêu bối cảnh và cách liên hệ.',
                'I am working from our branch office this week. I am using a temporary desk. Please contact me by email.',
            ],
        ],
    },
    2: {
        objective:
            'Nói về thói quen, sự thật và lịch cố định; tạo câu hỏi/phủ định với do và does.',
        rules: [
            [
                'Thói quen và sự thật',
                'Thì đơn nói về điều đúng nói chung, công việc và việc lặp lại. Không dùng nó để thay một hoạt động đang diễn ra chỉ vì động từ quen thuộc.',
                'I/you/we/they work; he/she/it works',
            ],
            [
                'Do và does',
                'Sau does/doesn’t, động từ trở về nguyên mẫu. Be dùng am/is/are riêng, không dùng do với be.',
                'Does she work? / She doesn’t work.',
            ],
            [
                'Tần suất',
                'Usually/often thường đứng trước động từ chính và sau be. Lịch dịch vụ cố định cũng dùng thì đơn.',
                'I usually cycle. / The clinic opens at eight.',
            ],
        ],
        trap: [
            'Does he works remotely?',
            'Does he work remotely?',
            'Does đã mang dấu ngôi; work giữ nguyên mẫu.',
        ],
        examples: [
            [
                'Thói quen',
                'I check my calendar before breakfast.',
                'Tôi xem lịch trước bữa sáng.',
                'check',
                'Thói quen thường xuyên.',
                'Do you check yours in the evening?',
            ],
            [
                'Công việc',
                'She manages a small design team.',
                'Cô ấy quản lý một nhóm thiết kế nhỏ.',
                'manages',
                'Vai trò công việc tương đối ổn định.',
                'She does not manage the sales team.',
            ],
            [
                'Lịch mở cửa',
                'The pharmacy closes at nine.',
                'Hiệu thuốc đóng cửa lúc chín giờ.',
                'closes',
                'Lịch dịch vụ cố định.',
                'What time does it open?',
            ],
            [
                'Đi lại',
                'Our bus stops near the library.',
                'Xe buýt của chúng tôi dừng gần thư viện.',
                'stops',
                'Tuyến xe hoạt động thường lệ.',
                'It does not stop at the stadium.',
            ],
            [
                'Tần suất',
                'We rarely order takeaway during the week.',
                'Chúng tôi hiếm khi gọi đồ ăn mang về trong tuần.',
                'rarely order',
                'Trạng từ trước động từ chính.',
                'Are you usually busy on weekdays?',
            ],
            [
                'Sự thật',
                'Water expands when it freezes.',
                'Nước nở ra khi đóng băng.',
                'expands',
                'Sự thật nói chung.',
                'Does the same happen with every liquid?',
            ],
        ],
        questions: [
            q(
                'gap',
                'My colleague ___ (teach) online on Mondays.',
                'teaches',
                'He/she/it thêm -es sau ch.',
            ),
            q(
                'gap',
                'We ___ (not/charge) a delivery fee.',
                ['do not charge', "don't charge"],
                'We dùng do not + nguyên mẫu.',
            ),
            q(
                'gap',
                '___ (your manager/approve) expenses every Friday?',
                'Does your manager approve',
                'Does + chủ ngữ số ít + nguyên mẫu.',
            ),
            q(
                'gap',
                'The last train ___ (leave) at 10 p.m. every day.',
                'leaves',
                'Lịch trình cố định dùng hiện tại đơn.',
            ),
            q(
                'gap',
                'My sister ___ (study) architecture.',
                'studies',
                'Phụ âm + y chuyển thành -ies.',
            ),
            q(
                'choice',
                'Choose the correct negative.',
                'The shop does not accept cash.',
                'Does not + nguyên mẫu.',
                [
                    'The shop does not accepts cash.',
                    'The shop does not accept cash.',
                    'The shop not accept cash.',
                ],
            ),
            q(
                'gap',
                'How often ___ (you/back up) your files?',
                'do you back up',
                'How often + do + you + động từ.',
            ),
            q(
                'gap',
                'This laptop ___ (have) two USB ports.',
                'has',
                'Have đổi thành has ở ngôi ba số ít.',
            ),
            q(
                'error',
                'Sửa: She don’t drive to work.',
                ['She does not drive to work.', "She doesn't drive to work."],
                'She dùng doesn’t; drive không thêm s.',
            ),
            q(
                'order',
                'Sắp xếp: usually / I / lunch / bring / .',
                'I usually bring lunch.',
                'Usually thường đứng trước bring.',
            ),
            q(
                'rewrite',
                'Đổi thành câu hỏi: They live near the office.',
                'Do they live near the office?',
                'Do + they + live.',
            ),
            q(
                'context',
                'A: What does your brother do? B: He ___ (repair) bicycles.',
                'repairs',
                'Câu hỏi nghề nghiệp, không hỏi việc đang diễn ra.',
            ),
            q(
                'gap',
                'The library ___ (not/open) on public holidays.',
                ['does not open', "doesn't open"],
                'Thói quen lịch hoạt động ở dạng phủ định.',
            ),
            q(
                'rewrite',
                'Đổi sang phủ định: I understand the instructions.',
                ['I do not understand the instructions.', "I don't understand the instructions."],
                'I dùng do not understand.',
            ),
            q(
                'gap',
                'Our accountant ___ (check) invoices every morning.',
                'checks',
                'Công việc lặp lại, chủ ngữ số ít.',
            ),
            q(
                'gap',
                '___ (this app/work) offline?',
                'Does this app work',
                'Does đã mang ngôi, work giữ nguyên.',
            ),
            q(
                'order',
                'Sắp xếp: never / late / is / she / .',
                'She is never late.',
                'Never đứng sau is.',
            ),
            q(
                'choice',
                'Choose a sentence describing a routine.',
                'I walk to the station on weekdays.',
                'On weekdays là bối cảnh việc lặp lại.',
                [
                    'I am walk to the station on weekdays.',
                    'I walk to the station on weekdays.',
                    'I walking to the station on weekdays.',
                ],
            ),
            q(
                'error',
                'Sửa: Where does your parents live?',
                'Where do your parents live?',
                'Parents số nhiều dùng do.',
            ),
        ],
        scenarios: [
            [
                'Giới thiệu công việc',
                'Bạn gặp đồng nghiệp mới. Viết vai trò của mình, một thói quen làm việc và một câu hỏi về họ.',
                'I support our customers. I usually answer emails in the morning. Do you work with the sales team?',
            ],
            [
                'Lịch dịch vụ',
                'Bạn giới thiệu một phòng khám. Nêu giờ mở cửa, ngày nghỉ và đặt một câu hỏi về lịch.',
                'The clinic opens at eight. It does not open on Sundays. Does it close for lunch?',
            ],
            [
                'Phỏng vấn',
                'Nhà tuyển dụng hỏi cách quản lý thời gian. Viết 3 câu về thói quen thực sự của bạn.',
                'I plan my week on Sunday. I check urgent tasks first. I rarely work without a break.',
            ],
        ],
    },
    3: {
        objective:
            'Chọn thì theo ý nghĩa: thường lệ hay tạm thời, đang xảy ra hay đúng nói chung; hiểu always + tiếp diễn.',
        rules: [
            [
                'Ổn định hay tạm thời',
                'Đối chiếu cùng một động từ: thường lệ dùng đơn, tình huống giới hạn quanh hiện tại dùng tiếp diễn.',
                'I work in Hanoi; I am working in Hue this week.',
            ],
            [
                'Hiện tại hay nói chung',
                'Một sự thật không biến thành tiếp diễn chỉ vì có now trong câu khác. Xem người nói đang mô tả hiện tượng hay quy luật.',
                'The kettle is boiling. / Water boils at 100°C at sea level.',
            ],
            [
                'Always với thái độ',
                'Always + tiếp diễn thường thể hiện nhận xét chủ quan về sự lặp lại, có thể khó chịu hoặc khen; không phải mọi always đều cần tiếp diễn.',
                'You are always helping other people.',
            ],
        ],
        trap: [
            'I work at a temporary desk this week.',
            'I am working at a temporary desk this week.',
            'Trong bối cảnh nhấn mạnh sắp xếp tạm thời tuần này, tiếp diễn là lựa chọn tự nhiên hơn; câu thì đơn không phải luôn sai ngoài ngữ cảnh này.',
        ],
        examples: [
            [
                'Đối chiếu công việc',
                'I normally drive, but I am taking the bus this week.',
                'Tôi thường lái xe, nhưng tuần này tôi đang đi xe buýt.',
                'am taking',
                'Đối chiếu thói quen với thay đổi tạm thời.',
                'She usually cooks, but she is ordering dinner tonight.',
            ],
            [
                'Học tập',
                'He studies engineering and is preparing for his final exams.',
                'Anh ấy học kỹ thuật và đang chuẩn bị cho kỳ thi cuối khóa.',
                'is preparing',
                'Ngành học ổn định đối chiếu quá trình ôn hiện tại.',
                'He is not preparing for a language test.',
            ],
            [
                'Dịch vụ',
                'The café serves lunch, but it is not serving food today.',
                'Quán có phục vụ bữa trưa, nhưng hôm nay không phục vụ đồ ăn.',
                'is not serving',
                'Lịch thông thường khác ngoại lệ hôm nay.',
                'Is it serving drinks today?',
            ],
            [
                'Thay đổi',
                'More people are cycling to work in our area.',
                'Ngày càng nhiều người đang đạp xe đi làm ở khu chúng tôi.',
                'are cycling',
                'Xu hướng thay đổi quanh hiện tại.',
                'Do you cycle to work every day?',
            ],
            [
                'Nhận xét',
                'You are always finding practical solutions.',
                'Bạn lúc nào cũng tìm được giải pháp thiết thực.',
                'are always finding',
                'Tiếp diễn thể hiện sự đánh giá tích cực.',
                'He is always losing his travel card.',
            ],
            [
                'Môi trường',
                'It often rains here, but it is not raining now.',
                'Ở đây thường mưa, nhưng hiện giờ không mưa.',
                'is not raining',
                'Tách khí hậu thường lệ khỏi tình hình hiện tại.',
                'Does it rain much in winter?',
            ],
        ],
        questions: [
            q(
                'gap',
                'I usually walk, but today I ___ (take) a taxi.',
                'am taking',
                'Today đối chiếu với thói quen usually walk.',
            ),
            q(
                'gap',
                'This machine ___ (print) labels as its normal function.',
                'prints',
                'Đặc tính/chức năng nói chung.',
            ),
            q(
                'gap',
                'Listen: our neighbour ___ (practise) the piano.',
                'is practising',
                'Âm thanh hiện tại; British spelling practise → practising. Chấp nhận practicing.',
                ['is practising', 'is practicing'],
            ),
            q(
                'gap',
                'We ___ (stay) in a hotel while our flat is being repaired.',
                'are staying',
                'Tình huống có giới hạn thời gian.',
            ),
            q(
                'choice',
                'Which sentence expresses irritation at repeated interruptions?',
                'You are always interrupting me!',
                'Always + tiếp diễn có thể thể hiện khó chịu.',
                [
                    'You are always interrupting me!',
                    'You interrupt me once a year.',
                    'You are interrupt me.',
                ],
            ),
            q(
                'gap',
                'My uncle ___ (run) a bookshop; it is his regular job.',
                'runs',
                'Công việc thường lệ.',
            ),
            q(
                'gap',
                'The number of electric taxis ___ (increase) in our city.',
                'is increasing',
                'Xu hướng đang thay đổi.',
            ),
            q(
                'gap',
                'She usually ___ (have) lunch at her desk.',
                'has',
                'Thói quen với usually; have → has.',
            ),
            q(
                'error',
                'Trong ngữ cảnh đang thấy khói, sửa: Look! The oven smokes.',
                'Look! The oven is smoking.',
                'Look! nhấn mạnh sự việc đang diễn ra.',
            ),
            q(
                'order',
                'Sắp xếp: normally / here / works / he / .',
                'He normally works here.',
                'Trạng từ tần suất trước động từ chính.',
            ),
            q(
                'rewrite',
                'Đổi sang tiếp diễn, thêm today: We work upstairs.',
                'We are working upstairs today.',
                'Đổi be + V-ing cho tình huống tạm thời.',
            ),
            q(
                'context',
                'A: Why are you using my screen? B: Mine ___ (not/work) at the moment.',
                ['is not working', "isn't working"],
                'Thiết bị tạm thời không hoạt động.',
            ),
            q(
                'gap',
                'Our team normally ___ (meet) on Tuesdays.',
                'meets',
                'Lịch họp thường lệ của một nhóm.',
            ),
            q(
                'rewrite',
                'Đổi sang hiện tại đơn, thêm every day: They are checking the stock.',
                'They check the stock every day.',
                'Việc lặp lại khác hoạt động hiện tại.',
            ),
            q(
                'gap',
                'The restaurant usually ___ (close) at ten.',
                'closes',
                'Lịch thông thường, chủ ngữ số ít.',
            ),
            q(
                'gap',
                'For this month only, our department ___ (share) an office with Sales.',
                'is sharing',
                'Giới hạn tạm thời rõ ràng.',
            ),
            q(
                'order',
                'Sắp xếp: always / you / helping / are / people / .',
                'You are always helping people.',
                'Always đứng sau are trong tiếp diễn.',
            ),
            q(
                'choice',
                'Which sentence describes a trend?',
                'Delivery costs are rising this year.',
                'Rising diễn tả xu hướng thay đổi.',
                [
                    'Delivery costs are rising this year.',
                    'Delivery costs rising this year.',
                    'Delivery costs is rise this year.',
                ],
            ),
            q(
                'error',
                'Sửa: We are normally start at nine.',
                'We normally start at nine.',
                'Thói quen dùng hiện tại đơn, không thêm are.',
            ),
        ],
        scenarios: [
            [
                'Cập nhật cách làm việc',
                'Bạn đổi lịch làm trong tháng này. So sánh 2 thói quen cũ với 2 hoạt động tạm thời.',
                'I usually start at nine, but I am starting at eight this month. I normally work alone, but I am sharing an office now.',
            ],
            [
                'Trao đổi với khách',
                'Khách hỏi vì sao quán thay thực đơn hôm nay. Viết 3 câu nêu bình thường và hôm nay.',
                'We normally serve hot meals. We are repairing the kitchen today. We are offering sandwiches instead.',
            ],
            [
                'Góp ý trong nhóm',
                'Nêu một thói quen tốt, một xu hướng đang thay đổi và một lời khen với always + tiếp diễn.',
                'We review our work weekly. Our delivery times are improving. You are always suggesting useful ideas.',
            ],
        ],
    },
    4: {
        objective:
            'Phân biệt động từ trạng thái với hành động; dùng think, have, see và being theo đúng nghĩa.',
        rules: [
            [
                'Trạng thái thường dùng đơn',
                'Know, believe, need, belong, understand thường không dùng tiếp diễn khi mô tả trạng thái. Có biến thể giao tiếp/ý nghĩa đặc biệt; không học một lệnh cấm tuyệt đối.',
                'I know the answer. / This bag belongs to me.',
            ],
            [
                'Nghĩa thay đổi thì có thể thay đổi',
                'Think = có ý kiến thường dùng đơn; think about = cân nhắc có thể tiếp diễn. Have = sở hữu khác have lunch = hoạt động.',
                'I think it is useful. / I am thinking about the proposal.',
            ],
            [
                'Be và giác quan',
                'Is kind nói tính cách; is being kind nói cách cư xử lúc này. Look/feel có thể dùng đơn hoặc tiếp diễn ở một số nghĩa; không suy ra mọi dạng tiếp diễn đều sai.',
                'You are being very patient. / I can see the entrance.',
            ],
        ],
        trap: [
            'I am knowing the password.',
            'I know the password.',
            'Know ở nghĩa biết một thông tin là trạng thái.',
        ],
        examples: [
            [
                'Ý kiến',
                'I think this plan is realistic.',
                'Tôi nghĩ kế hoạch này thực tế.',
                'think',
                'Think ở nghĩa nêu ý kiến.',
                'Do you think the deadline is reasonable?',
            ],
            [
                'Cân nhắc',
                'I am thinking about changing jobs.',
                'Tôi đang cân nhắc đổi việc.',
                'am thinking',
                'Hoạt động cân nhắc đang diễn ra.',
                'She is thinking about renting a smaller flat.',
            ],
            [
                'Sở hữu',
                'We have a shared printer.',
                'Chúng tôi có một máy in dùng chung.',
                'have',
                'Have nói về sở hữu.',
                'Do you have a spare cable?',
            ],
            [
                'Hoạt động',
                'We are having lunch with a supplier.',
                'Chúng tôi đang ăn trưa với nhà cung cấp.',
                'are having',
                'Have lunch là một hoạt động.',
                'Are you having a break?',
            ],
            [
                'Cư xử',
                'He is being unusually quiet today.',
                'Hôm nay anh ấy đang tỏ ra im lặng khác thường.',
                'is being',
                'Nhấn mạnh hành vi hôm nay, không kết luận tính cách.',
                'He is usually very talkative.',
            ],
            [
                'Hiểu biết',
                'I understand the problem, but I need more time.',
                'Tôi hiểu vấn đề nhưng cần thêm thời gian.',
                'understand',
                'Hiểu và cần là trạng thái trong câu này.',
                'Do you understand the next step?',
            ],
        ],
        questions: [
            q(
                'gap',
                'This access card ___ (belong) to our visitor.',
                'belongs',
                'Belong ở nghĩa sở hữu dùng hiện tại đơn.',
            ),
            q(
                'gap',
                'I ___ (not/understand) this abbreviation.',
                ['do not understand', "don't understand"],
                'Understand là trạng thái.',
            ),
            q(
                'choice',
                'You are considering two offers right now.',
                'I am thinking about both offers.',
                'Thinking about diễn tả hoạt động cân nhắc.',
                [
                    'I am thinking about both offers.',
                    'I am knowing both offers.',
                    'I am believing both offers.',
                ],
            ),
            q(
                'gap',
                'We ___ (have) a quick breakfast right now.',
                'are having',
                'Have breakfast là hoạt động, không phải sở hữu.',
            ),
            q(
                'gap',
                'I ___ (believe) your explanation.',
                'believe',
                'Believe ở nghĩa tin tưởng thường dùng thì đơn.',
            ),
            q(
                'gap',
                'She normally helps, but today she ___ (be) uncooperative.',
                'is being',
                'Hành vi tạm thời hôm nay.',
            ),
            q(
                'gap',
                'This box ___ (contain) spare batteries.',
                'contains',
                'Contain diễn tả thành phần/trạng thái.',
            ),
            q(
                'choice',
                'Which sentence describes ownership?',
                'They have two bicycles.',
                'Have với sở hữu thường không dùng tiếp diễn.',
                [
                    'They have two bicycles.',
                    'They are having two bicycles.',
                    'They having two bicycles.',
                ],
            ),
            q(
                'error',
                'Sửa: I am needing your signature.',
                'I need your signature.',
                'Need ở nghĩa cần là trạng thái.',
            ),
            q(
                'order',
                'Sắp xếp: you / do / what / mean / ?',
                'What do you mean?',
                'Mean ở nghĩa muốn nói dùng hiện tại đơn.',
            ),
            q(
                'rewrite',
                'Đổi sang phủ định: She knows the address.',
                ['She does not know the address.', "She doesn't know the address."],
                'Does not + know.',
            ),
            q(
                'context',
                'A: Why is Ben unavailable? B: He ___ (see) a client in his office now.',
                'is seeing',
                'See ở nghĩa gặp theo cuộc hẹn là một hoạt động.',
            ),
            q(
                'gap',
                'I ___ (remember) our first meeting clearly.',
                'remember',
                'Remember ở nghĩa nhớ thông tin là trạng thái.',
            ),
            q(
                'rewrite',
                'Sửa câu sở hữu: I am having a company phone.',
                'I have a company phone.',
                'Have ở đây không phải một hoạt động.',
            ),
            q(
                'gap',
                'The soup ___ (smell) wonderful.',
                'smells',
                'Smell ở nghĩa có mùi là trạng thái/cảm nhận.',
            ),
            q(
                'gap',
                'I ___ (think) about how to respond at the moment.',
                'am thinking',
                'Hoạt động suy nghĩ đang diễn ra.',
            ),
            q(
                'order',
                'Sắp xếp: belongs / this / who / to / does / bag / ?',
                'Who does this bag belong to?',
                'Belong to; does + belong.',
            ),
            q(
                'choice',
                'Which sentence describes behaviour happening now?',
                'You are being very helpful today.',
                'Being mô tả cách cư xử trong bối cảnh hiện tại.',
                [
                    'You are being very helpful today.',
                    'You are knowing the answer today.',
                    'You are having a red car today.',
                ],
            ),
            q(
                'error',
                'Sửa: This key is belonging to Room 4.',
                'This key belongs to Room 4.',
                'Belong ở nghĩa quan hệ sở hữu dùng đơn.',
            ),
        ],
        scenarios: [
            [
                'Phản hồi đề xuất',
                'Bạn nhận một đề xuất. Nêu ý kiến hiện tại, phần đang cân nhắc và thông tin còn cần.',
                'I think the idea is useful. I am thinking about the cost. I need a clearer timeline.',
            ],
            [
                'Lễ tân',
                'Bạn là lễ tân. Nêu công ty có phòng họp, quản lý đang gặp khách, và bạn hiểu yêu cầu.',
                'We have a meeting room. Our manager is seeing a visitor now. I understand your request.',
            ],
            [
                'Nhận xét hành vi',
                'Một đồng nghiệp thường thân thiện nhưng hôm nay cư xử khác. Mô tả thận trọng, không gán tính cách vĩnh viễn.',
                'She is usually helpful. Today she is being rather impatient. I think she needs a break.',
            ],
        ],
    },
    5: {
        objective: 'Kể việc đã kết thúc trong quá khứ; dùng động từ bất quy tắc và did đúng cách.',
        rules: [
            [
                'Sự kiện đã kết thúc',
                'Dùng quá khứ đơn khi đặt sự kiện ở một thời điểm đã kết thúc hoặc kể một chuỗi việc. Động từ thường thêm -ed; nhiều động từ bất quy tắc cần học theo dạng.',
                'We booked a room. / She sent the file.',
            ],
            [
                'Did và didn’t',
                'Sau did/didn’t dùng nguyên mẫu, không lặp dấu quá khứ. Câu hỏi chủ ngữ Who called? không cần did.',
                'Did you send it? / I didn’t send it.',
            ],
            [
                'Be ở quá khứ',
                'Was/were có cấu trúc câu hỏi và phủ định riêng. Đừng dùng did với be trong mẫu này.',
                'Were you busy? / I wasn’t available.',
            ],
        ],
        trap: [
            'Did you went to the workshop?',
            'Did you go to the workshop?',
            'Did đã chỉ quá khứ; go giữ nguyên mẫu.',
        ],
        examples: [
            [
                'Email',
                'I sent the revised quote yesterday.',
                'Hôm qua tôi đã gửi báo giá sửa đổi.',
                'sent',
                'Yesterday đặt sự kiện trong quá khứ đã kết thúc.',
                'Did you receive the quote?',
            ],
            [
                'Cuộc họp',
                'We discussed the budget on Monday.',
                'Chúng tôi đã thảo luận ngân sách vào thứ Hai.',
                'discussed',
                'Sự kiện trong thời gian đã qua.',
                'We did not discuss the schedule.',
            ],
            [
                'Đi lại',
                'She took the early train last Friday.',
                'Thứ Sáu trước cô ấy đi chuyến tàu sớm.',
                'took',
                'Take → took là động từ bất quy tắc.',
                'Which train did she take?',
            ],
            [
                'Mua sắm',
                'The shop did not accept my voucher.',
                'Cửa hàng đã không chấp nhận phiếu giảm giá của tôi.',
                'did not accept',
                'Phủ định dùng did not + nguyên mẫu.',
                'Did the other shop accept it?',
            ],
            [
                'Tình trạng',
                'I was ill during the training day.',
                'Tôi bị ốm vào ngày tập huấn.',
                'was',
                'Be có quá khứ riêng.',
                'Were you at home that day?',
            ],
            [
                'Kể chuyện',
                'We arrived, checked in and called a taxi.',
                'Chúng tôi đến nơi, nhận phòng rồi gọi taxi.',
                'arrived',
                'Chuỗi sự kiện đã kết thúc.',
                'Then we walked to the museum.',
            ],
        ],
        questions: [
            q('gap', 'Yesterday I ___ (send) the signed contract.', 'sent', 'Send → sent.'),
            q(
                'gap',
                'We ___ (not/meet) the director last week.',
                ['did not meet', "didn't meet"],
                'Did not + nguyên mẫu.',
            ),
            q(
                'gap',
                'Where ___ (you/buy) that notebook yesterday?',
                'did you buy',
                'Câu hỏi quá khứ với did.',
            ),
            q('gap', 'They ___ (arrive) at noon last Saturday.', 'arrived', 'Arrive thêm -d.'),
            q(
                'gap',
                'She ___ (leave) her umbrella on the train last night.',
                'left',
                'Leave → left.',
            ),
            q(
                'choice',
                'Choose the correct past question.',
                'Did the courier call you?',
                'Did + chủ ngữ + call.',
                [
                    'Did the courier called you?',
                    'Did the courier call you?',
                    'Does the courier called you?',
                ],
            ),
            q('gap', 'I ___ (be) at the conference yesterday.', 'was', 'I dùng was ở quá khứ.'),
            q(
                'gap',
                'The clients ___ (be) pleased with the demo last month.',
                'were',
                'Chủ ngữ số nhiều dùng were.',
            ),
            q(
                'error',
                'Sửa: He didn’t paid the fee.',
                ['He did not pay the fee.', "He didn't pay the fee."],
                'Sau didn’t dùng pay.',
            ),
            q(
                'order',
                'Sắp xếp: you / when / did / return / ?',
                'When did you return?',
                'When + did + chủ ngữ + nguyên mẫu.',
            ),
            q(
                'rewrite',
                'Đổi sang phủ định: We visited the factory.',
                ['We did not visit the factory.', "We didn't visit the factory."],
                'Visited chuyển về visit sau did.',
            ),
            q(
                'context',
                'A: Who fixed the printer? B: Linh ___ (fix) it this morning before the office opened.',
                'fixed',
                'Sự việc đã hoàn tất trong câu chuyện quá khứ.',
            ),
            q(
                'gap',
                'Our manager ___ (choose) the blue design yesterday.',
                'chose',
                'Choose → chose.',
            ),
            q(
                'rewrite',
                'Đổi thành câu hỏi: They were late.',
                'Were they late?',
                'Đảo were; không dùng did.',
            ),
            q('gap', 'The meeting ___ (begin) at nine yesterday.', 'began', 'Begin → began.'),
            q(
                'gap',
                'I ___ (not/see) your message last night.',
                ['did not see', "didn't see"],
                'Did not + see.',
            ),
            q(
                'order',
                'Sắp xếp: who / the / booked / room / ?',
                'Who booked the room?',
                'Who là chủ ngữ nên không thêm did.',
            ),
            q(
                'choice',
                'Which sentence describes a completed past event?',
                'We completed the audit last month.',
                'Last month là khoảng thời gian đã kết thúc.',
                [
                    'We complete the audit last month.',
                    'We completed the audit last month.',
                    'We did completed the audit last month.',
                ],
            ),
            q(
                'error',
                'Sửa: Did she was at the workshop?',
                'Was she at the workshop?',
                'Be dùng was/were riêng, không dùng did trong mẫu này.',
            ),
        ],
        scenarios: [
            [
                'Báo cáo công việc',
                'Viết 4 câu kể việc đã làm hôm qua: 2 việc hoàn thành, 1 việc chưa làm và 1 câu hỏi gửi đồng nghiệp.',
                'I checked the figures. I sent the summary. I did not call the supplier. Did you approve the order?',
            ],
            [
                'Vấn đề đơn hàng',
                'Bạn nhận một món hàng bị lỗi tuần trước. Viết email ngắn nêu sự kiện và việc đã thử.',
                'I received the keyboard last week. Two keys did not work. I tried another computer, but the problem remained.',
            ],
            [
                'Phỏng vấn',
                'Kể một tình huống bạn giải quyết vấn đề ở công việc trước bằng 3–5 câu quá khứ.',
                'A customer reported an error. I checked the logs and found the cause. We fixed the problem that afternoon.',
            ],
        ],
    },
    6: {
        objective: 'Tạo bối cảnh đang diễn ra trong quá khứ và phân biệt nó với sự kiện xen vào.',
        rules: [
            [
                'Bối cảnh tại một thời điểm',
                'Was/were + V-ing mô tả việc đang trong tiến trình tại mốc quá khứ. Nó không cho biết việc đã kết thúc hay chưa ở một thời điểm sau đó.',
                'At eight, I was preparing dinner.',
            ],
            [
                'Hoạt động và sự kiện xen vào',
                'Hoạt động nền thường dùng tiếp diễn, sự kiện xen vào thường dùng quá khứ đơn. Không phải mọi when đều bắt buộc một thì cố định.',
                'I was driving when the alarm rang.',
            ],
            [
                'Hai hoạt động song song',
                'Có thể dùng tiếp diễn cho hai việc kéo dài cùng lúc; dùng quá khứ đơn cho chuỗi sự kiện kết thúc.',
                'While I was cooking, she was setting the table.',
            ],
        ],
        trap: [
            'I was work when you called.',
            'I was working when you called.',
            'Tiếp diễn cần was/were + V-ing, không dùng nguyên mẫu.',
        ],
        examples: [
            [
                'Cuộc gọi nhỡ',
                'I was presenting when you called.',
                'Tôi đang thuyết trình khi bạn gọi.',
                'was presenting',
                'Thuyết trình là hoạt động nền, called là sự kiện xen vào.',
                'Were you taking notes during the call?',
            ],
            [
                'Sự cố',
                'We were testing the app when the server stopped.',
                'Chúng tôi đang thử ứng dụng thì máy chủ dừng.',
                'were testing',
                'Việc đang diễn ra bị một sự kiện xen vào.',
                'We were not changing the database.',
            ],
            [
                'Song song',
                'She was checking receipts while I was updating the spreadsheet.',
                'Cô ấy đang kiểm tra hóa đơn trong khi tôi cập nhật bảng tính.',
                'was checking',
                'Hai hoạt động có phần thời gian trùng nhau.',
                'What were you checking?',
            ],
            [
                'Mốc giờ',
                'At seven yesterday, I was waiting at the airport.',
                'Lúc bảy giờ hôm qua tôi đang đợi ở sân bay.',
                'was waiting',
                'Nêu hoạt động tại mốc quá khứ cụ thể.',
                'I was not waiting at the hotel.',
            ],
            [
                'Câu chuyện',
                'It was raining, so we stayed inside.',
                'Trời đang mưa nên chúng tôi ở trong nhà.',
                'was raining',
                'Mưa là bối cảnh của quyết định trong câu chuyện.',
                'Was it raining when you arrived?',
            ],
            [
                'Phân biệt',
                'I read the email and then called the client.',
                'Tôi đọc email rồi gọi khách hàng.',
                'read',
                'Chuỗi việc hoàn tất dùng quá khứ đơn, không tự động dùng tiếp diễn vì có nhiều việc.',
                'I was reading the email when the client called.',
            ],
        ],
        questions: [
            q(
                'gap',
                'At nine last night, I ___ (review) the presentation.',
                'was reviewing',
                'Hoạt động đang diễn ra ở mốc quá khứ.',
            ),
            q(
                'gap',
                'We ___ (drive) home when the rain started.',
                'were driving',
                'Drive là hoạt động nền; we dùng were.',
            ),
            q(
                'gap',
                'She ___ (not/listen) when the trainer explained the task.',
                ['was not listening', "wasn't listening"],
                'Phủ định của was listening.',
            ),
            q(
                'gap',
                'What ___ (you/do) at six yesterday?',
                'were you doing',
                'Câu hỏi đảo were trước you.',
            ),
            q(
                'choice',
                'Which sentence sets the background for a sudden event?',
                'I was packing when the taxi arrived.',
                'Was packing là nền; arrived là sự kiện.',
                [
                    'I was packing when the taxi arrived.',
                    'I were packing when the taxi arrived.',
                    'I was pack when the taxi arrived.',
                ],
            ),
            q(
                'gap',
                'While I was cooking, my partner ___ (set) the table.',
                'was setting',
                'Hai hoạt động song song; set → setting.',
            ),
            q(
                'gap',
                'The visitors ___ (wait) in reception at 10 a.m. yesterday.',
                'were waiting',
                'Chủ ngữ số nhiều dùng were.',
            ),
            q(
                'gap',
                'I was typing when my phone ___ (ring).',
                'rang',
                'Sự kiện xen vào dùng quá khứ đơn; ring → rang.',
            ),
            q(
                'error',
                'Sửa: They was discussing the proposal.',
                'They were discussing the proposal.',
                'They dùng were.',
            ),
            q(
                'order',
                'Sắp xếp: you / were / sleeping / ?',
                'Were you sleeping?',
                'Were + chủ ngữ + V-ing.',
            ),
            q(
                'rewrite',
                'Đổi sang phủ định: He was recording the session.',
                ['He was not recording the session.', "He wasn't recording the session."],
                'Thêm not sau was.',
            ),
            q(
                'context',
                'A: Why did you miss the announcement? B: I ___ (talk) to a visitor at the time.',
                'was talking',
                'Giải thích hoạt động nền tại thời điểm đó.',
            ),
            q(
                'gap',
                'The lights went out while we ___ (eat) dinner.',
                'were eating',
                'Ăn tối là hoạt động đang diễn ra.',
            ),
            q(
                'rewrite',
                'Viết câu hỏi: She was using the printer.',
                'Was she using the printer?',
                'Đảo was, giữ using.',
            ),
            q(
                'gap',
                'At noon yesterday, the technician ___ (install) the update.',
                'was installing',
                'Hoạt động ở mốc quá khứ.',
            ),
            q(
                'gap',
                'We were walking home when we ___ (find) the wallet.',
                'found',
                'Find là sự kiện xen vào, dùng found.',
            ),
            q(
                'order',
                'Sắp xếp: raining / it / was / not / .',
                'It was not raining.',
                'Not đứng sau was.',
            ),
            q(
                'choice',
                'Which describes two overlapping activities?',
                'I was reading while my sister was cooking.',
                'Hai vế tiếp diễn mô tả hoạt động chồng thời gian.',
                [
                    'I was reading while my sister was cooking.',
                    'I was read while my sister cooking.',
                    'I were reading while my sister was cooking.',
                ],
            ),
            q(
                'error',
                'Sửa: Was you waiting when I arrived?',
                'Were you waiting when I arrived?',
                'You dùng were trong quá khứ tiếp diễn.',
            ),
        ],
        scenarios: [
            [
                'Giải thích cuộc gọi nhỡ',
                'Bạn đang thuyết trình khi đồng nghiệp gọi. Viết lời giải thích, nêu việc xảy ra sau đó và đề nghị thời gian gọi lại.',
                'I was presenting when you called. I checked my phone after the meeting. Can we talk at three?',
            ],
            [
                'Báo cáo sự cố',
                'Bạn là người chứng kiến sự cố mạng. Viết 4 câu nêu mốc giờ, hoạt động nền và sự kiện xen vào.',
                'At ten, we were testing a video call. The connection suddenly dropped. I was sharing my screen. We restarted the router.',
            ],
            [
                'Kể chuyện',
                'Kể một buổi tối bất ngờ, gồm hai hoạt động diễn ra song song và một sự kiện cắt ngang.',
                'I was reading while my brother was cooking. Someone knocked on the door. It was our neighbour with a parcel.',
            ],
        ],
    },
};

for (const [number, lesson] of Object.entries(bookLessons)) {
    lesson.id = `giu-${String(number).padStart(3, '0')}`;
    lesson.questions = lesson.questions.map((question, index) => ({
        ...question,
        id: `${lesson.id}-q${index + 1}`,
        mode: index < 8 ? 'quick' : index < 14 ? 'deep' : 'assessment',
        hint: lesson.rules[index % lesson.rules.length][2],
    }));
    // This comparison has two standard spellings, not two different correct choices.
    if (Number(number) === 3) lesson.questions[2].answers = ['is practising', 'is practicing'];
    if (Number(number) === 4) {
        lesson.questions[5].answers = ['is being', 'is'];
        lesson.questions[5].explanation =
            'Is being nhấn mạnh cách cư xử tạm thời; is cũng đúng khi nhận xét tình trạng hôm nay.';
    }
    if (Number(number) === 6) {
        lesson.questions[5].answers = ['was setting', 'set'];
        lesson.questions[5].explanation =
            'Was setting nhấn mạnh hoạt động song song; set cũng đúng nếu xem việc dọn bàn là sự kiện hoàn tất trong khoảng đang nấu.';
    }
    const target = {
        1: 'hiện tại tiếp diễn',
        2: 'hiện tại đơn',
        5: 'quá khứ đơn',
        6: 'quá khứ tiếp diễn',
    }[Number(number)];
    for (const [index, question] of lesson.questions.entries()) {
        if (
            target &&
            question.type === 'gap' &&
            !(Number(number) === 6 && [5, 7, 15].includes(index))
        )
            question.prompt = `Dùng ${target}: ${question.prompt}`;
    }
    lesson.scenarios = lesson.scenarios.map(([title, prompt, model], index) => ({
        id: `${lesson.id}-s${index + 1}`,
        title,
        prompt,
        model,
        rubric: [
            'Đáp ứng bối cảnh và mục tiêu giao tiếp.',
            'Dùng cấu trúc mục tiêu, kiểm tra chủ ngữ và trợ động từ.',
            'Đọc lại câu để kiểm tra ý nghĩa, chính tả và dấu câu.',
        ],
    }));
}
