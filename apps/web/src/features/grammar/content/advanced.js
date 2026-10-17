import { lesson as L } from './lesson.js';
export const units = [
    {
        id: 'advanced-structures',
        title: 'Advanced sentence structures',
        subtitle: 'Cấu trúc nhấn mạnh và rút gọn',
        lessons: [
            L(
                'negative-inversion',
                'Negative & restrictive inversion',
                'Đảo ngữ sau thành phần phủ định',
                'C1',
                'Đưa một cụm phủ định hoặc hạn định lên đầu để nhấn mạnh trong văn viết hoặc lời nói trang trọng.',
                [
                    [
                        'Trật tự đảo',
                        'Khi never, rarely, seldom, little ở nghĩa phủ định đứng đầu, đặt trợ động từ trước chủ ngữ. Nếu câu gốc không có trợ động từ, thêm do/does/did và đưa động từ chính về nguyên mẫu.',
                        'Never have I seen such a result. / Rarely does she complain.',
                    ],
                    [
                        'Only và not until',
                        'Only after/when/by… và not until… đứng đầu thường gây đảo ở mệnh đề chính, không đảo trong mệnh đề phụ. Only bổ nghĩa cho chủ ngữ như Only Lan knew không gây đảo.',
                        'Only after we tested it did we find the error.',
                    ],
                    [
                        'Các cặp cố định',
                        'No sooner…than và hardly/scarcely…when thường kể hai sự kiện quá khứ nối sát nhau, với quá khứ hoàn thành ở vế đầu. Under no circumstances là giới hạn mạnh, phù hợp quy định trang trọng.',
                        'No sooner had we arrived than it started raining.',
                    ],
                ],
                [
                    [
                        'Báo cáo',
                        'Only after reviewing the logs did we identify the cause.',
                        'Chỉ sau khi xem nhật ký, chúng tôi mới xác định nguyên nhân.',
                    ],
                    [
                        'Nhấn mạnh',
                        'Never have I felt so well prepared for an interview.',
                        'Chưa bao giờ tôi cảm thấy sẵn sàng cho phỏng vấn như thế.',
                    ],
                ],
                [
                    'Only when did she arrive we started.',
                    'Only when she arrived did we start.',
                    'Đảo ngữ nằm ở mệnh đề chính sau cụm Only when…, không ở mệnh đề when.',
                ],
                [
                    'Rarely ___ such a clear explanation.',
                    ['we hear', 'do we hear', 'we do hear'],
                    1,
                    'Rarely đầu câu cần trợ động từ trước chủ ngữ.',
                ],
            ),
            L(
                'conditional-inversion',
                'Inverted conditionals',
                'Đảo ngữ điều kiện với should, were, had',
                'C1',
                'Bỏ if bằng cách đảo một số trợ động từ; cấu trúc thường trang trọng và cần giữ đúng thời gian giả định.',
                [
                    [
                        'Should',
                        'Should + chủ ngữ + nguyên mẫu có thể thay một điều kiện tương lai kiểu if… trong ngữ cảnh phù hợp. Thường dùng trong hướng dẫn hoặc lời đề nghị lịch sự, với sắc thái khả năng tùy tình huống.',
                        'Should you need assistance, contact reception.',
                    ],
                    [
                        'Were',
                        'Were + chủ ngữ + to-infinitive diễn tả điều kiện giả định. Nếu câu gốc dùng be thì có thể dùng Were + chủ ngữ + bổ ngữ mà không thêm to be.',
                        'Were I in your position, I would wait.',
                    ],
                    [
                        'Had',
                        'Had + chủ ngữ + V3 thay if + quá khứ hoàn thành. Với phủ định, đặt not sau chủ ngữ. Không đặt if và đảo ngữ cùng lúc trong mẫu này.',
                        'Had we known, we would have acted. / Had she not called…',
                    ],
                ],
                [
                    [
                        'Email',
                        'Should you require further details, please contact our team.',
                        'Nếu cần thêm chi tiết, vui lòng liên hệ nhóm chúng tôi.',
                    ],
                    [
                        'Phân tích',
                        'Had we tested the backup, we would have noticed the issue.',
                        'Nếu đã thử bản sao lưu, ta đã phát hiện vấn đề.',
                    ],
                ],
                [
                    'If had I known, I would have helped.',
                    'Had I known, I would have helped.',
                    'Bỏ if khi dùng đảo ngữ điều kiện với had.',
                ],
                [
                    '___ I known about the delay, I would have stayed home.',
                    ['Had', 'Were', 'Should'],
                    0,
                    'Known là V3, giả định quá khứ cần Had I known.',
                ],
            ),
            L(
                'cleft-sentences',
                'Cleft sentences & emphasis',
                'Câu chẻ và trọng tâm thông tin',
                'C1',
                'Tách một ý thành hai phần để đặt sự chú ý vào người, thời gian, lý do hoặc hành động quan trọng.',
                [
                    [
                        'It-cleft',
                        'It + be + phần nhấn mạnh + that/who… giúp nêu tương phản hoặc sửa thông tin. That dùng rộng; who phù hợp khi nhấn mạnh người. Giữ mối quan hệ ngữ pháp của mệnh đề sau.',
                        'It was Lan who solved the problem.',
                    ],
                    [
                        'Wh-cleft',
                        'What + mệnh đề + be + phần được nhấn mạnh thường đặt thông tin cần nhấn ở cuối. Với do trong vế what, động từ sau be có thể dùng nguyên mẫu, có hoặc không to tùy cấu trúc.',
                        'What we need is more time. / What I did was (to) call support.',
                    ],
                    [
                        'Không lạm dụng',
                        'Câu chẻ hữu ích khi thật sự có tương phản hoặc muốn điều chỉnh trọng tâm; nếu dùng mọi câu sẽ dài và nặng. Giữ hòa hợp phù hợp, nhất là khi phần nhấn mạnh số nhiều.',
                        'It was the timing, not the price, that concerned us.',
                    ],
                ],
                [
                    [
                        'Cuộc họp',
                        'What concerns me is the lack of a backup plan.',
                        'Điều khiến tôi lo là thiếu kế hoạch dự phòng.',
                    ],
                    [
                        'Làm rõ',
                        'It was yesterday that I sent the invoice, not today.',
                        'Tôi đã gửi hóa đơn hôm qua, không phải hôm nay.',
                    ],
                ],
                [
                    'What I need it is a break.',
                    'What I need is a break.',
                    'What I need đã là chủ ngữ của is; không thêm it.',
                ],
                [
                    '___ we need is a clearer deadline.',
                    ['What', 'Which that', 'That what'],
                    0,
                    'What we need là mệnh đề danh từ trong wh-cleft.',
                ],
            ),
            L(
                'participle-clauses',
                'Participle & non-finite clauses',
                'Mệnh đề phân từ và phi hữu hạn',
                'C1',
                'Viết gọn quan hệ thời gian, nguyên nhân hoặc bối cảnh nhưng không làm mơ hồ ai đang thực hiện hành động.',
                [
                    [
                        'V-ing và V3',
                        'Mệnh đề V-ing thường mang nghĩa chủ động; V3 thường mang nghĩa bị động. Động từ phi hữu hạn không tự thể hiện đầy đủ thì; thời gian được suy từ mệnh đề chính và ngữ cảnh.',
                        'Feeling tired, I left. / Written clearly, the guide is easy to follow.',
                    ],
                    [
                        'Hoàn thành và cùng chủ ngữ',
                        'Having + V3 nhấn mạnh hành động hoàn thành trước hành động chính; having been + V3 là bị động. Chủ ngữ được hiểu của cụm mở đầu thường phải cùng với chủ ngữ mệnh đề chính.',
                        'Having checked the figures, she sent the report.',
                    ],
                    [
                        'Tránh dangling participles',
                        'Nếu cụm phân từ dường như bổ nghĩa cho một chủ ngữ không hợp lý, viết lại thành mệnh đề đầy đủ. After/before/while + V-ing cũng cần kiểm soát người thực hiện.',
                        'After finishing the call, I wrote a summary.',
                    ],
                ],
                [
                    [
                        'Công việc',
                        'Having reviewed the contract, we requested two changes.',
                        'Sau khi xem hợp đồng, chúng tôi yêu cầu sửa hai điểm.',
                    ],
                    [
                        'Thông báo',
                        'Built in 1920, the station is now a museum.',
                        'Được xây năm 1920, ga nay là bảo tàng.',
                    ],
                ],
                [
                    'Walking to work, the rain soaked my coat.',
                    'While I was walking to work, the rain soaked my coat.',
                    'Câu ban đầu khiến the rain thành chủ thể đang đi bộ.',
                ],
                [
                    '___ the report, she sent it to her manager.',
                    ['Having finished', 'Having been finished by her', 'Finished she'],
                    0,
                    'She là người hoàn thành; having finished nêu việc xong trước khi gửi.',
                ],
            ),
            L(
                'subjunctive',
                'Subjunctive & formal recommendations',
                'Giả định thức sau đề nghị và yêu cầu',
                'C1',
                'Dùng dạng nguyên mẫu trong mệnh đề that để diễn tả điều được đề nghị, yêu cầu hoặc xem là cần thiết.',
                [
                    [
                        'Mandative subjunctive',
                        'Sau recommend, suggest, insist, demand hoặc essential có thể dùng that + chủ ngữ + nguyên mẫu không to. Dạng này không thêm -s ở ngôi ba và be giữ nguyên.',
                        'We recommend that she be present.',
                    ],
                    [
                        'Phủ định và biến thể',
                        'Đặt not trước nguyên mẫu: that he not leave. Trong Anh-Anh, should + nguyên mẫu cũng phổ biến cho nghĩa đề nghị. Không phải mọi suggest/insist đều mang nghĩa yêu cầu nên phải xét ngữ cảnh.',
                        'It is essential that the form not be altered.',
                    ],
                    [
                        'Nghĩa thực tế và công thức',
                        'Insist that có thể khăng khăng một sự thật, khi đó dùng thì thông thường. Một số cụm cố định như if need be hoặc so be it giữ dạng be; không suy từ đó rằng mọi mệnh đề đều dùng nguyên mẫu.',
                        'She insists that she is right. / They insisted that he leave.',
                    ],
                ],
                [
                    [
                        'Quy định',
                        'The committee recommended that each applicant submit a portfolio.',
                        'Hội đồng đề nghị mỗi ứng viên nộp hồ sơ sản phẩm.',
                    ],
                    [
                        'An toàn',
                        'It is vital that the emergency exit remain clear.',
                        'Lối thoát hiểm nhất thiết phải luôn thông thoáng.',
                    ],
                ],
                [
                    'They demanded that he leaves immediately.',
                    'They demanded that he leave immediately.',
                    'Trong giả định thức yêu cầu, leave giữ nguyên mẫu không -s.',
                ],
                [
                    'It is essential that she ___ informed.',
                    ['be', 'is being to', 'to be'],
                    0,
                    'Be là dạng nguyên mẫu trong mandative subjunctive.',
                ],
            ),
            L(
                'ellipsis-substitution',
                'Ellipsis & substitution',
                'Lược bỏ và thay thế để tránh lặp',
                'C1',
                'Bỏ phần đã rõ hoặc thay bằng một thành phần ngắn hơn, nhưng phải giữ đủ thông tin để người đọc khôi phục nghĩa.',
                [
                    [
                        'Trợ động từ thay cụm động từ',
                        'Có thể lược cụm động từ sau be, have, modal hoặc do nếu ngữ cảnh rõ. Giữ đúng trợ động từ và thì của ý muốn diễn đạt.',
                        'She can drive, and I can too. / I didn’t call, but he did.',
                    ],
                    [
                        'One/ones và so/not',
                        'One/ones thay danh từ đếm được khi tránh lặp; không dùng như vậy cho danh từ không đếm được. Think so, hope so, hope not thay một nhận định đã nhắc.',
                        'I prefer the blue one. / Will it work? I hope so.',
                    ],
                    [
                        'Lược có điều kiện',
                        'Có thể lược phần lặp trong mệnh đề phối hợp hoặc cấu trúc so sánh khi người nghe khôi phục được. Không lược chủ ngữ hoặc động từ tùy tiện trong văn viết chuẩn nếu gây câu thiếu hoặc mơ hồ.',
                        'I ordered tea, and Lan coffee.',
                    ],
                ],
                [
                    ['Hội thoại', '“Have you finished?” “Yes, I have.”', '“Bạn xong chưa?” “Rồi.”'],
                    [
                        'Mua sắm',
                        'These shoes are too small. Do you have larger ones?',
                        'Giày này nhỏ quá. Có đôi lớn hơn không?',
                    ],
                ],
                [
                    'I need some information. Do you have any ones?',
                    'I need some information. Do you have any?',
                    'One/ones không thay danh từ không đếm được information theo mẫu này.',
                ],
                [
                    '“Will the shop be open?” “I hope ___.”',
                    ['so', 'one', 'it open'],
                    0,
                    'Hope so thay cho một mệnh đề khẳng định đã rõ.',
                ],
            ),
        ],
    },
    {
        id: 'grammar-in-context',
        title: 'Grammar in context',
        subtitle: 'Văn phong, lập luận và diễn đạt chính xác',
        lessons: [
            L(
                'hedging',
                'Hedging & degrees of certainty',
                'Diễn đạt thận trọng và mức chắc chắn',
                'C1',
                'Điều chỉnh sức mạnh của nhận định theo bằng chứng thay vì luôn dùng cấu trúc khẳng định tuyệt đối.',
                [
                    [
                        'Modal và động từ đánh giá',
                        'May, might, could diễn tả khả năng; appear, seem, tend to giới hạn mức khẳng định. Dùng để phản ánh điều chưa chắc, không chỉ để câu nghe học thuật.',
                        'The results may indicate a change. / Costs tend to rise in winter.',
                    ],
                    [
                        'Phạm vi nhận định',
                        'Some, in many cases, generally, to some extent làm rõ nhận định áp dụng tới đâu. Hạn chế all, always, prove nếu dữ liệu chỉ hỗ trợ xu hướng hoặc một nhóm nhỏ.',
                        'The approach appears useful in some contexts.',
                    ],
                    [
                        'Tránh chồng lớp',
                        'Too many hedges như might possibly perhaps làm câu thiếu rõ ràng. Một nhận định nên thể hiện được điều gì đã quan sát, điều gì là suy luận và mức chắc chắn có căn cứ.',
                        'The survey suggests…, rather than The survey proves…',
                    ],
                ],
                [
                    [
                        'Báo cáo',
                        'The shorter response time may have improved customer satisfaction.',
                        'Thời gian phản hồi ngắn hơn có thể đã cải thiện sự hài lòng.',
                    ],
                    [
                        'Thảo luận',
                        'This seems to be a practical option, although costs remain uncertain.',
                        'Đây có vẻ là phương án thực tế, dù chi phí vẫn chưa chắc.',
                    ],
                ],
                [
                    'This small survey proves that everyone prefers remote work.',
                    'This small survey suggests that some respondents prefer remote work.',
                    'Mẫu nhỏ không đủ cơ sở để khẳng định tuyệt đối về tất cả mọi người.',
                ],
                [
                    'Which wording best reflects limited evidence?',
                    [
                        'This proves it always works.',
                        'This may indicate an improvement.',
                        'This must definitely prove everything.',
                    ],
                    1,
                    'May indicate nêu khả năng mà không khẳng định vượt bằng chứng.',
                ],
            ),
            L(
                'information-structure',
                'Fronting & information structure',
                'Đặt trọng tâm và sắp xếp thông tin',
                'C1',
                'Đưa thông tin đã biết làm cầu nối, rồi đặt phần mới ở vị trí người đọc dễ tiếp nhận.',
                [
                    [
                        'Thông tin cũ → mới',
                        'Thông thường bắt đầu từ ý người đọc đã biết, rồi mở rộng sang thông tin mới. Có thể dùng bị động để chủ đề cũ tiếp tục làm chủ ngữ, không đổi chủ thể đột ngột liên tục.',
                        'We tested a new method. The method was then reviewed.',
                    ],
                    [
                        'Fronting',
                        'Đưa trạng ngữ hoặc tân ngữ ra đầu để tạo bối cảnh hay tương phản. Fronting thông thường không tự động gây đảo ngữ; đảo phụ thuộc cấu trúc như phủ định hoặc một số mẫu chỉ nơi chốn.',
                        'This proposal I can support; the other one I cannot.',
                    ],
                    [
                        'Đưa phần nặng ra sau',
                        'Dùng it làm chủ ngữ giả để tránh một chủ ngữ quá dài; cấu trúc there giới thiệu đối tượng mới. Câu cần hợp ngữ cảnh hơn là chỉ đúng dạng trên giấy.',
                        'It is difficult to estimate the final cost accurately.',
                    ],
                ],
                [
                    [
                        'Thuyết trình',
                        'As for the budget, we still need the finance team’s approval.',
                        'Về ngân sách, chúng ta vẫn cần nhóm tài chính phê duyệt.',
                    ],
                    [
                        'Email',
                        'The revised schedule we can accept; the extra fee we cannot.',
                        'Lịch sửa đổi thì chúng tôi chấp nhận; phí bổ sung thì không.',
                    ],
                ],
                [
                    'Only this proposal do works for us.',
                    'Only this proposal works for us.',
                    'Only bổ nghĩa cho chủ ngữ không gây đảo; động từ phải chia works.',
                ],
                [
                    'Choose the natural extraposition.',
                    [
                        'It is important to check the source.',
                        'It important check the source.',
                        'Is important it checking the source.',
                    ],
                    0,
                    'It + be + tính từ + to-infinitive đặt nội dung dài ra sau.',
                ],
            ),
            L(
                'nominalisation',
                'Nominalisation & concise writing',
                'Danh hóa và viết súc tích',
                'C1',
                'Chuyển hành động hoặc phẩm chất thành danh từ khi cần khái quát, nhưng tránh che mất ai làm gì.',
                [
                    [
                        'Chuyển loại ý nghĩa',
                        'Động từ hoặc tính từ có thể chuyển sang danh từ: decide → decision, accurate → accuracy. Cấu trúc danh từ thường cho phép gom cả một quá trình làm chủ ngữ hoặc đối tượng thảo luận.',
                        'The team decided. → The team’s decision…',
                    ],
                    [
                        'Hòa hợp và giới từ',
                        'Khi danh hóa, cần thêm từ hạn định, số và giới từ phù hợp. Trung tâm chủ ngữ là danh từ mới, nên động từ theo số của danh từ đó.',
                        'The evaluation of the proposals takes time.',
                    ],
                    [
                        'Cân bằng độ rõ',
                        'Danh hóa hữu ích trong báo cáo nhưng có thể khiến văn dài hoặc mơ hồ. Khi cần giao việc, câu chủ động có chủ thể rõ thường hiệu quả hơn một chuỗi danh từ trừu tượng.',
                        'Please review the file, rather than Please carry out a review of the file.',
                    ],
                ],
                [
                    [
                        'Báo cáo',
                        'The introduction of flexible hours improved staff retention.',
                        'Việc áp dụng giờ linh hoạt giúp giữ nhân viên tốt hơn.',
                    ],
                    [
                        'Chỉ dẫn',
                        'Please approve the request today.',
                        'Hãy phê duyệt yêu cầu hôm nay.',
                    ],
                ],
                [
                    'The analysis of the results show a trend.',
                    'The analysis of the results shows a trend.',
                    'Analysis là trung tâm số ít; results không quyết định động từ chính.',
                ],
                [
                    'Choose the clearest direct instruction.',
                    [
                        'Make a completion of the form.',
                        'Complete the form.',
                        'The form completion should be undertaken by you.',
                    ],
                    1,
                    'Động từ trực tiếp thường rõ và ngắn hơn danh hóa không cần thiết.',
                ],
            ),
            L(
                'reference-cohesion',
                'Reference & cohesive grammar',
                'Liên kết câu bằng tham chiếu',
                'B2',
                'Dùng đại từ, từ chỉ định và phép thay thế để đoạn văn liền mạch mà không đánh mất đối tượng được nói tới.',
                [
                    [
                        'Đại từ có tiền tố rõ',
                        'It/they phải chỉ một đối tượng dễ xác định. Nếu một câu có nhiều danh từ cùng có thể làm tiền tố, lặp lại danh từ thường tốt hơn sự mơ hồ.',
                        'The supplier contacted the buyer because the buyer had a question.',
                    ],
                    [
                        'This/that + danh từ',
                        'This issue, this change, that decision có thể gom ý của câu trước và định danh lại rõ ràng. Tránh dùng this đứng một mình khi người đọc không biết nó chỉ phần nào.',
                        'Sales fell in June. This decline affected the forecast.',
                    ],
                    [
                        'Such, one và tham chiếu nhóm',
                        'Such a change chỉ một thay đổi thuộc loại vừa nêu; the former/the latter phù hợp khi có đúng hai đối tượng rõ ràng nhưng dễ gây nặng văn. Dùng lặp có chủ đích nếu đoạn dài.',
                        'We compared rail and air travel. The latter was faster.',
                    ],
                ],
                [
                    [
                        'Công việc',
                        'The server was unavailable for an hour. This outage delayed the release.',
                        'Máy chủ ngừng hoạt động một giờ. Sự cố này làm chậm đợt phát hành.',
                    ],
                    [
                        'Học thuật',
                        'Both methods reduced errors, but the second method was easier to apply.',
                        'Cả hai cách đều giảm lỗi, nhưng cách thứ hai dễ áp dụng hơn.',
                    ],
                ],
                [
                    'Lan told Mai that she had won. (unclear)',
                    'Lan told Mai, “You have won.”',
                    'Khi she có thể chỉ Lan hoặc Mai, nêu rõ người thắng thay vì để người đọc đoán.',
                ],
                [
                    'Sales dropped sharply. ___ prompted a review.',
                    ['This decline', 'These decline', 'Those decline'],
                    0,
                    'This decline gom và gọi tên rõ ý giảm doanh số trước đó.',
                ],
            ),
            L(
                'complex-agreement',
                'Complex agreement',
                'Hòa hợp trong cấu trúc phức tạp',
                'C1',
                'Xử lý chủ ngữ tập hợp, tỷ lệ, số lượng và liên từ tương quan mà không chỉ đếm danh từ gần động từ.',
                [
                    [
                        'A number và the number',
                        'A number of + danh từ số nhiều thường dùng động từ số nhiều. The number of nhấn mạnh một con số, dùng động từ số ít. Phân số/tỷ lệ theo sau of thường hòa hợp theo danh từ được đo.',
                        'A number of people are waiting. / The number is rising.',
                    ],
                    [
                        'Tập hợp và biến thể',
                        'Team, family, committee có thể dùng số ít khi xem là một đơn vị; Anh-Anh còn thường dùng số nhiều khi nhấn các thành viên. Chọn cách nhìn và giữ đại từ, động từ nhất quán trong đoạn.',
                        'The team is ready. / The team are discussing their options.',
                    ],
                    [
                        'Either/neither và khoảng lượng',
                        'Với either…or/neither…nor có chủ ngữ khác số, động từ thường theo thành phần gần nhất; có thể viết lại để tránh nặng. Thời gian, tiền hoặc khoảng cách xem như một đơn vị có thể dùng số ít.',
                        'Ten minutes is enough. / Neither the manager nor the assistants are available.',
                    ],
                ],
                [
                    [
                        'Báo cáo',
                        'The number of applications has increased this year.',
                        'Số lượng hồ sơ năm nay đã tăng.',
                    ],
                    [
                        'Kế hoạch',
                        'A number of colleagues have offered to help.',
                        'Một số đồng nghiệp đã đề nghị giúp.',
                    ],
                ],
                [
                    'The number of users are growing.',
                    'The number of users is growing.',
                    'The number là trung tâm số ít, nên dùng is.',
                ],
                [
                    'A number of students ___ absent today.',
                    ['are', 'is', 'has'],
                    0,
                    'A number of students mang nghĩa một số học sinh, dùng số nhiều.',
                ],
            ),
            L(
                'register',
                'Register & grammar choices',
                'Chọn ngữ pháp theo văn phong',
                'C1',
                'Một câu có thể đúng ngữ pháp nhưng không phù hợp tình huống; chọn độ trực tiếp, độ trang trọng và mức chi tiết theo người đọc.',
                [
                    [
                        'Nói và viết',
                        'Dạng rút gọn như I’m, we’ve tự nhiên trong giao tiếp và nhiều email. Văn bản pháp lý hoặc học thuật có thể ưu tiên dạng đầy đủ. Câu tỉnh lược trong hội thoại không tự động là mẫu nên dùng trong mọi báo cáo.',
                        'I’m checking it. / We are reviewing the evidence.',
                    ],
                    [
                        'Lịch sự và khoảng cách',
                        'Could, would, I was wondering… thường làm yêu cầu mềm hơn. Quá khứ trong I was wondering đôi khi tạo khoảng cách lịch sự, không chỉ kể một suy nghĩ đã kết thúc.',
                        'I was wondering whether you could clarify the deadline.',
                    ],
                    [
                        'Rõ hơn phức tạp',
                        'Không cần thay mọi câu bằng bị động, đảo ngữ hoặc danh hóa để viết hay. Xác định người đọc cần biết gì, dùng chủ thể rõ, tránh mơ hồ về thời gian và giới hạn độ dài câu.',
                        'Please send the invoice by Friday.',
                    ],
                ],
                [
                    [
                        'Email khách hàng',
                        'Could you confirm whether the revised schedule works for you?',
                        'Bạn xác nhận lịch sửa đổi có phù hợp không được chứ?',
                    ],
                    ['Nhắn bạn bè', 'Can you send me the address?', 'Gửi tôi địa chỉ được không?'],
                ],
                [
                    'You must send me this now. (to a new client)',
                    'Could you send me the file today, please?',
                    'Câu gốc không sai cấu trúc nhưng có thể quá áp đặt với khách mới; chọn yêu cầu lịch sự khi không phải quy định.',
                ],
                [
                    'Which is the best neutral request to a client?',
                    [
                        'Send it now!',
                        'Could you send the revised file today, please?',
                        'You must obey and send it.',
                    ],
                    1,
                    'Could you…please phù hợp yêu cầu lịch sự; thời hạn today vẫn rõ.',
                ],
            ),
        ],
    },
];
