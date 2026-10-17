import { lesson as L } from './lesson.js';
export const units = [
    {
        id: 'modal-verbs',
        title: 'Modal verbs',
        subtitle: 'Khả năng, nghĩa vụ và suy đoán',
        lessons: [
            L(
                'ability',
                'Can, could & be able to',
                'Diễn tả khả năng',
                'A2',
                'Chọn dạng diễn tả khả năng chung, thành công trong một tình huống hoặc khả năng ở thì khác.',
                [
                    [
                        'Can và could',
                        'Can nói về khả năng hiện tại; could thường nói khả năng chung trong quá khứ. Modal không thêm -s và đi với động từ nguyên mẫu không to.',
                        'She can swim. / He could read at four.',
                    ],
                    [
                        'Một lần thành công',
                        'Với một hành động chủ động thành công ở một dịp cụ thể trong quá khứ, thường dùng was/were able to hoặc managed to. Could vẫn tự nhiên với tri giác như see/hear hoặc dạng phủ định couldn’t.',
                        'We managed to fix it. / I could hear the music.',
                    ],
                    [
                        'Các thì khác',
                        'Be able to dùng khi cần nguyên mẫu hoặc hoàn thành, vì không ghép hai modal trực tiếp. Could cũng có thể diễn tả khả năng giả định hoặc một lựa chọn hiện tại.',
                        'I’ll be able to help. / We could try another route.',
                    ],
                ],
                [
                    [
                        'Kỹ năng',
                        'I can read technical English, but I’m still practising speaking.',
                        'Tôi đọc được tiếng Anh kỹ thuật nhưng vẫn đang luyện nói.',
                    ],
                    [
                        'Sự cố',
                        'Despite the outage, we managed to restore the backup.',
                        'Dù mất điện, chúng tôi vẫn khôi phục được bản sao lưu.',
                    ],
                ],
                ['She can to drive.', 'She can drive.', 'Sau can dùng nguyên mẫu không to.'],
                [
                    'Next month, I will ___ join the evening class.',
                    ['can', 'be able to', 'could'],
                    1,
                    'Sau will không dùng thêm modal can; dùng be able to.',
                ],
            ),
            L(
                'permission-requests',
                'Permission & polite requests',
                'Xin phép và yêu cầu lịch sự',
                'A2',
                'Ngữ pháp và giọng điệu cùng quyết định một lời xin phép có phù hợp hay không.',
                [
                    [
                        'Xin phép',
                        'Can I…? tự nhiên trong nhiều tình huống; could I…? thường lịch sự hơn; may I…? thường trang trọng. Khi cho phép, can/may phù hợp hơn could nếu chỉ xác nhận quyền được làm.',
                        'Could I leave a little early? / Yes, you can.',
                    ],
                    [
                        'Nhờ người khác làm',
                        'Could you…? và would you…? làm yêu cầu mềm hơn. Không cần hiểu could là quá khứ ở đây. Will you…? có thể trực tiếp hơn tùy ngữ điệu.',
                        'Could you check this total, please?',
                    ],
                    [
                        'Would you mind',
                        'Would you mind + V-ing là mẫu yêu cầu. Khi xin phép bản thân, dùng would you mind if I + quá khứ; câu trả lời No, not at all nghĩa là không phiền, tức đồng ý.',
                        'Would you mind opening the window?',
                    ],
                ],
                [
                    [
                        'Văn phòng',
                        'Could you send me the final version by noon?',
                        'Bạn gửi tôi bản cuối trước trưa được không?',
                    ],
                    [
                        'Thư viện',
                        'Would you mind if I sat here?',
                        'Bạn có phiền nếu tôi ngồi đây không?',
                    ],
                ],
                [
                    'Would you mind to help me?',
                    'Would you mind helping me?',
                    'Mind đi với V-ing trong mẫu yêu cầu này.',
                ],
                [
                    'Would you mind ___ the door?',
                    ['close', 'closing', 'to close'],
                    1,
                    'Would you mind + V-ing.',
                ],
            ),
            L(
                'obligation',
                'Must, have to & need to',
                'Bắt buộc, cấm và không cần thiết',
                'A2',
                'Phân biệt nghĩa phải làm, không được làm và không cần làm để tránh hiểu nhầm quy định.',
                [
                    [
                        'Must và have to',
                        'Cả hai đều diễn tả nghĩa vụ. Must thường hợp với yêu cầu mạnh hoặc quy định người nói nêu; have to thường nêu một yêu cầu thực tế. Ranh giới không tuyệt đối; have to linh hoạt hơn về thì.',
                        'You must wear a helmet. / I had to leave early.',
                    ],
                    [
                        'Mustn’t khác don’t have to',
                        'Mustn’t là cấm; don’t have to và needn’t là không bắt buộc. Đây là khác biệt về nghĩa chứ không chỉ mức độ lịch sự.',
                        'You mustn’t park here. / You don’t have to book ahead.',
                    ],
                    [
                        'Nhu cầu trong quá khứ',
                        'Had to diễn tả nghĩa vụ quá khứ. Didn’t need to không tự khẳng định việc có được làm hay không; needn’t have + V3 thường cho biết đã làm nhưng không cần thiết.',
                        'I needn’t have printed it; they accepted a digital copy.',
                    ],
                ],
                [
                    [
                        'An toàn',
                        'Visitors must sign in before entering the lab.',
                        'Khách phải đăng ký trước khi vào phòng thí nghiệm.',
                    ],
                    [
                        'Sự kiện',
                        'You don’t have to bring food; lunch is provided.',
                        'Bạn không cần mang đồ ăn; đã có bữa trưa.',
                    ],
                ],
                [
                    'You mustn’t pay; the event is free.',
                    'You don’t have to pay; the event is free.',
                    'Miễn phí nghĩa là không cần trả tiền, không phải bị cấm trả tiền.',
                ],
                [
                    'Photography is forbidden. You ___ take photos.',
                    ['mustn’t', 'don’t have to', 'needn’t'],
                    0,
                    'Mustn’t thể hiện sự cấm đoán.',
                ],
            ),
            L(
                'advice',
                'Should, ought to & had better',
                'Khuyên, kỳ vọng và cảnh báo',
                'B1',
                'Điều chỉnh độ mạnh của lời khuyên và phân biệt khuyến nghị với nghĩa vụ.',
                [
                    [
                        'Should và ought to',
                        'Should + nguyên mẫu, ought to + nguyên mẫu thường diễn tả lời khuyên hoặc điều được xem là đúng. Should còn chỉ kỳ vọng có cơ sở: the parcel should arrive tomorrow.',
                        'You should check the details. / You ought to rest.',
                    ],
                    [
                        'Had better',
                        'Had better + nguyên mẫu thường khuyên trong một tình huống cụ thể có hậu quả nếu không làm. Dù có had, cấu trúc này thường hướng đến hiện tại hoặc tương lai.',
                        'We’d better leave now, or we’ll miss the train.',
                    ],
                    [
                        'Lời khuyên về quá khứ',
                        'Should/ought to have + V3 nói điều đáng lẽ nên làm; shouldn’t have nói điều không nên làm. Trong ngữ cảnh khác, should have còn có thể là kỳ vọng đã hoàn tất.',
                        'I should have saved a copy.',
                    ],
                ],
                [
                    [
                        'Sức khỏe',
                        'You should take regular breaks when working at a screen.',
                        'Bạn nên nghỉ định kỳ khi làm việc với màn hình.',
                    ],
                    [
                        'Du lịch',
                        'We’d better book now; only two seats are left.',
                        'Ta nên đặt ngay; chỉ còn hai chỗ.',
                    ],
                ],
                [
                    'You had better to call her.',
                    'You had better call her.',
                    'Had better theo sau bởi nguyên mẫu không to.',
                ],
                [
                    'You ___ checked the address before leaving; now we’re lost.',
                    ['should have', 'should to', 'had better to'],
                    0,
                    'Should have + V3 nói lời khuyên hoặc tiếc nuối về quá khứ.',
                ],
            ),
            L(
                'modal-deduction',
                'Must, might & can’t: deduction',
                'Suy đoán dựa trên bằng chứng',
                'B1',
                'Thể hiện mức chắc chắn thay vì dùng will hoặc must cho mọi dự đoán.',
                [
                    [
                        'Suy đoán hiện tại',
                        'Must + nguyên mẫu diễn tả kết luận rất có khả năng đúng; might/may/could diễn tả khả năng; can’t diễn tả kết luận không thể đúng dựa trên bằng chứng.',
                        'She must be busy. / She might be at home.',
                    ],
                    [
                        'Không nhầm mustn’t',
                        'Phủ định của suy đoán must thường là can’t, không phải mustn’t. Mustn’t chủ yếu mang nghĩa cấm đoán trong ngữ cảnh học cơ bản.',
                        'That can’t be his car; he sold it.',
                    ],
                    [
                        'Suy đoán hoạt động',
                        'Modal + be + V-ing nói một hoạt động có thể đang diễn ra. Dùng modal + have + V3 khi suy đoán sự kiện đã xảy ra, không lùi modal theo cách máy móc.',
                        'They might be waiting downstairs.',
                    ],
                ],
                [
                    [
                        'Công việc',
                        'The lights are on; someone must be working late.',
                        'Đèn còn sáng; chắc có người đang làm muộn.',
                    ],
                    [
                        'Đời sống',
                        'That can’t be Linh; she’s abroad this week.',
                        'Đó không thể là Linh; tuần này cô ấy ở nước ngoài.',
                    ],
                ],
                [
                    'He mustn’t be home; all the lights are off.',
                    'He might not be home; all the lights are off.',
                    'Might not nói khả năng không ở nhà; mustn’t thường là cấm. Đèn tắt chưa đủ để kết luận tuyệt đối.',
                ],
                [
                    'She has just run ten kilometres. She ___ be tired.',
                    ['must', 'mustn’t', 'has to not'],
                    0,
                    'Must be tired là suy đoán mạnh từ bằng chứng vừa chạy xa.',
                ],
            ),
            L(
                'modal-perfect',
                'Modal + have + participle',
                'Suy đoán, tiếc nuối và cơ hội quá khứ',
                'B2',
                'Cùng dạng modal + have + V3 nhưng ý nghĩa thay đổi theo modal và ngữ cảnh.',
                [
                    [
                        'Suy đoán đã xảy ra',
                        'Must have + V3 là kết luận mạnh về quá khứ; may/might/could have là khả năng; can’t/couldn’t have là suy đoán không thể xảy ra.',
                        'She must have forgotten. / It might have been delayed.',
                    ],
                    [
                        'Đáng lẽ nên làm',
                        'Should have hoặc ought to have thường đánh giá một hành động quá khứ, nhất là điều chưa làm. Needn’t have nói đã làm một việc không cần thiết.',
                        'We should have tested the link.',
                    ],
                    [
                        'Cơ hội không thực hiện',
                        'Could have còn chỉ khả năng hoặc cơ hội đã có nhưng không thực hiện. Would have thường xuất hiện trong kết quả giả định; không coi mọi could have đều là một suy đoán.',
                        'I could have taken a taxi, but I walked.',
                    ],
                ],
                [
                    [
                        'Lỡ hẹn',
                        'He may have sent the message to the wrong number.',
                        'Có thể anh ấy đã gửi tin nhầm số.',
                    ],
                    [
                        'Rút kinh nghiệm',
                        'We should have checked the backup before updating.',
                        'Đáng lẽ chúng ta nên kiểm tra bản sao lưu trước khi cập nhật.',
                    ],
                ],
                [
                    'She must have went home.',
                    'She must have gone home.',
                    'Sau modal + have cần quá khứ phân từ gone.',
                ],
                [
                    'The office was locked. They ___ gone home already.',
                    ['must have', 'must to have', 'must had'],
                    0,
                    'Must have + V3 diễn tả suy đoán về quá khứ.',
                ],
            ),
        ],
    },
    {
        id: 'verb-patterns',
        title: 'Verb patterns',
        subtitle: 'Mẫu động từ và cụm động từ',
        lessons: [
            L(
                'gerunds-infinitives',
                'Gerunds & to-infinitives',
                'V-ing và to + động từ',
                'B1',
                'Học động từ cùng mẫu bổ ngữ đi sau; không có một quy tắc nghĩa chung giải quyết được mọi trường hợp.',
                [
                    [
                        'Động từ + V-ing',
                        'Enjoy, avoid, finish, suggest và mind thường đi với V-ing. Sau giới từ cũng dùng V-ing, kể cả to trong look forward to hoặc be used to.',
                        'I enjoy cooking. / We look forward to meeting you.',
                    ],
                    [
                        'Động từ + to-infinitive',
                        'Want, decide, hope, plan và agree thường đi với to + nguyên mẫu. Một số động từ cần người làm ở giữa như want someone to do hoặc ask someone to do.',
                        'We decided to leave. / They asked us to wait.',
                    ],
                    [
                        'Chủ ngữ và mục đích',
                        'V-ing có thể làm chủ ngữ khi nói về hoạt động nói chung; to-infinitive thường diễn tả mục đích. Không thêm to sau modal hoặc let trong mẫu thông thường.',
                        'Swimming keeps me fit. / I called to confirm the booking.',
                    ],
                ],
                [
                    [
                        'Du lịch',
                        'We decided to rent a car for the weekend.',
                        'Chúng tôi quyết định thuê xe cho cuối tuần.',
                    ],
                    [
                        'Email',
                        'I look forward to hearing from you.',
                        'Tôi mong nhận được phản hồi của bạn.',
                    ],
                ],
                [
                    'I enjoy to learn English.',
                    'I enjoy learning English.',
                    'Enjoy thường theo sau bởi V-ing.',
                ],
                [
                    'They suggested ___ the launch.',
                    ['postponing', 'to postpone', 'postpone to'],
                    0,
                    'Suggest + V-ing khi đề xuất một hành động.',
                ],
            ),
            L(
                'verb-pattern-meaning',
                'Remember, stop & try',
                'Đổi dạng động từ, đổi nghĩa',
                'B2',
                'Một số động từ đi được với cả V-ing và to-infinitive nhưng sự kiện được hiểu khác nhau.',
                [
                    [
                        'Remember/forget',
                        'Remember doing là nhớ một việc đã làm; remember to do là nhớ thực hiện việc cần làm. Forget doing là không nhớ trải nghiệm, còn forget to do thường là quên nên đã không làm.',
                        'I remember locking it. / Remember to lock it.',
                    ],
                    [
                        'Stop và try',
                        'Stop doing là dừng hành động đó; stop to do là dừng việc khác để làm việc mới. Try doing là thử một giải pháp; try to do là cố gắng thực hiện.',
                        'Stop talking. / We stopped to get fuel.',
                    ],
                    [
                        'Regret, mean và go on',
                        'Regret doing thường tiếc việc đã làm; regret to inform là cách báo tin xấu trang trọng. Mean doing là kéo theo việc gì; mean to do là có ý định. Go on doing tiếp tục việc cũ; go on to do chuyển sang việc tiếp theo.',
                        'This job means travelling. / I didn’t mean to interrupt.',
                    ],
                ],
                [
                    [
                        'Công nghệ',
                        'Try restarting the router before calling support.',
                        'Hãy thử khởi động lại bộ định tuyến trước khi gọi hỗ trợ.',
                    ],
                    [
                        'Sinh hoạt',
                        'I stopped to buy some groceries on my way home.',
                        'Tôi dừng lại mua ít thực phẩm trên đường về.',
                    ],
                ],
                [
                    'Remember locking the door before you leave tomorrow.',
                    'Remember to lock the door before you leave tomorrow.',
                    'Việc cần nhớ làm trong tương lai dùng remember to do.',
                ],
                [
                    'The printer is stuck. Try ___ it off and on again.',
                    ['turning', 'to have turned', 'turn'],
                    0,
                    'Try doing đề xuất thử một giải pháp.',
                ],
            ),
            L(
                'causatives',
                'Have, get, make & let',
                'Nhờ, khiến, buộc và cho phép',
                'B2',
                'Chọn cấu trúc theo việc người khác làm hộ, bị buộc làm hay được cho phép làm.',
                [
                    [
                        'Nhờ làm dịch vụ',
                        'Have/get + vật + V3 diễn tả sắp xếp để việc được làm; thì thể hiện ở have/get. Cấu trúc cũng có thể diễn tả trải nghiệm không mong muốn như bị lấy mất đồ.',
                        'I had my laptop repaired. / She had her bag stolen.',
                    ],
                    [
                        'Người thực hiện',
                        'Have + người + nguyên mẫu là giao hoặc nhờ làm; get + người + to-infinitive là thuyết phục/sắp xếp. Không nhầm với mẫu có vật và V3.',
                        'I had Sam check it. / I got Sam to check it.',
                    ],
                    [
                        'Make và let',
                        'Make/let + người + nguyên mẫu không to. Khi make chuyển sang bị động, to quay lại: was made to wait. Let thường được diễn đạt bị động bằng be allowed to.',
                        'They made us wait. / We were made to wait.',
                    ],
                ],
                [
                    [
                        'Dịch vụ',
                        'I’m having my passport photo taken tomorrow.',
                        'Ngày mai tôi đi chụp ảnh hộ chiếu.',
                    ],
                    [
                        'Công việc',
                        'The manager let us leave early after the event.',
                        'Sau sự kiện quản lý cho chúng tôi về sớm.',
                    ],
                ],
                [
                    'They made me to work late.',
                    'They made me work late.',
                    'Make ở thể chủ động theo sau bằng tân ngữ + nguyên mẫu không to.',
                ],
                [
                    'I got the technician ___ the connection.',
                    ['check', 'to check', 'checked to'],
                    1,
                    'Get + người + to-infinitive.',
                ],
            ),
            L(
                'phrasal-verbs',
                'Phrasal verbs',
                'Động từ kết hợp tiểu từ',
                'B1',
                'Học cả nghĩa lẫn cách đặt tân ngữ của phrasal verb, không dịch riêng từng thành tố.',
                [
                    [
                        'Nghĩa tổ hợp',
                        'Turn on, give up, find out có thể mang nghĩa khó đoán từ từng từ. Ghi lại theo ngữ cảnh thực tế và chú ý xem cụm đó có cần tân ngữ không.',
                        'The plane took off. / I found out the answer.',
                    ],
                    [
                        'Cụm có thể tách',
                        'Với nhiều phrasal verb có tân ngữ, danh từ có thể đứng giữa hoặc sau tiểu từ. Nếu tân ngữ là đại từ như it/them thì phải đứng giữa trong mẫu có thể tách.',
                        'Turn the light off. / Turn off the light. / Turn it off.',
                    ],
                    [
                        'Cụm không tách',
                        'Một số cụm không tách tân ngữ như look after hoặc run into. Cụm ba thành phần như put up with cũng giữ thứ tự; cần kiểm tra từng động từ thay vì áp dụng quy tắc tách cho tất cả.',
                        'She looks after him. / I can’t put up with the noise.',
                    ],
                ],
                [
                    [
                        'Công nghệ',
                        'Please turn it down; I’m on a call.',
                        'Vặn nhỏ nó xuống nhé; tôi đang gọi điện.',
                    ],
                    [
                        'Sinh hoạt',
                        'Can you pick me up at the station?',
                        'Bạn đón tôi ở ga được không?',
                    ],
                ],
                [
                    'Please turn off it.',
                    'Please turn it off.',
                    'Đại từ làm tân ngữ của turn off đứng giữa động từ và tiểu từ.',
                ],
                [
                    'The music is too loud. Please ___.',
                    ['turn down it', 'turn it down', 'turn it to down'],
                    1,
                    'Turn down có thể tách và đại từ it phải ở giữa.',
                ],
            ),
            L(
                'prepositional-patterns',
                'Verb & adjective prepositions',
                'Giới từ theo động từ và tính từ',
                'B1',
                'Học các kết hợp cố định như depend on, interested in và apologise for cùng mẫu câu đầy đủ.',
                [
                    [
                        'Động từ + giới từ',
                        'Listen to, depend on, belong to, wait for có giới từ gắn với nghĩa cụ thể. Discuss và enter thường nhận tân ngữ trực tiếp trong các nghĩa thảo luận và đi vào, nên không thêm about/to máy móc.',
                        'We discussed the budget. / It depends on the weather.',
                    ],
                    [
                        'Tính từ + giới từ',
                        'Interested in, good at, responsible for, similar to là các kết hợp thường gặp. Cùng một tính từ có thể kết hợp giới từ khác khi nghĩa đổi: angry with someone, angry about something.',
                        'She is responsible for training new staff.',
                    ],
                    [
                        'Sau giới từ',
                        'Theo sau giới từ là danh từ, đại từ tân ngữ hoặc V-ing. Một số mẫu có cả đối tượng và giới từ: apologise to someone for doing something.',
                        'I apologised to her for arriving late.',
                    ],
                ],
                [
                    [
                        'Công việc',
                        'Who is responsible for updating the schedule?',
                        'Ai chịu trách nhiệm cập nhật lịch?',
                    ],
                    [
                        'Sở thích',
                        'I’m interested in learning about local history.',
                        'Tôi quan tâm đến việc tìm hiểu lịch sử địa phương.',
                    ],
                ],
                [
                    'We discussed about the problem.',
                    'We discussed the problem.',
                    'Discuss thường nhận tân ngữ trực tiếp, không cần about.',
                ],
                [
                    'She is good ___ explaining complex ideas.',
                    ['in', 'at', 'for'],
                    1,
                    'Good at + danh từ hoặc V-ing diễn tả giỏi một việc.',
                ],
            ),
            L(
                'verb-complements',
                'Objects & verb complements',
                'Tân ngữ và bổ ngữ của động từ',
                'B2',
                'Mỗi động từ có thể yêu cầu kiểu bổ ngữ khác; mẫu đúng không chỉ phụ thuộc nghĩa tiếng Việt.',
                [
                    [
                        'Nội động và ngoại động',
                        'Arrive không nhận tân ngữ trực tiếp chỉ địa điểm; reach thường có. Raise là ngoại động từ, rise là nội động từ. Không tự thêm tân ngữ hay chuyển bị động cho mọi động từ.',
                        'Prices rose. / The shop raised its prices.',
                    ],
                    [
                        'Người nhận và vật',
                        'Give/send có thể dùng hai tân ngữ hoặc cụm to; buy/make thường dùng for cho người hưởng lợi. Explain thường cần explain something to someone, không explain someone something.',
                        'Explain the steps to me. / Buy her a ticket.',
                    ],
                    [
                        'Tân ngữ + bổ ngữ',
                        'Keep, find, consider có thể theo sau bằng tân ngữ + tính từ hoặc danh từ. Một số động từ cho phép that-clause hoặc wh-clause làm bổ ngữ; chọn đúng mẫu của từng động từ.',
                        'Keep the door closed. / I found the instructions useful.',
                    ],
                ],
                [
                    [
                        'Báo cáo',
                        'Transport costs have risen, so we raised our delivery fee.',
                        'Chi phí vận tải tăng nên chúng tôi tăng phí giao hàng.',
                    ],
                    [
                        'Đào tạo',
                        'Could you explain the process to the new employee?',
                        'Bạn giải thích quy trình cho nhân viên mới được không?',
                    ],
                ],
                [
                    'Please explain me the rule.',
                    'Please explain the rule to me.',
                    'Explain thường dùng tân ngữ chỉ nội dung rồi to + người nghe.',
                ],
                [
                    'Please keep the documents ___.',
                    ['safe', 'safely', 'safety'],
                    0,
                    'Safe bổ nghĩa cho documents sau keep + tân ngữ + tính từ.',
                ],
            ),
        ],
    },
];
