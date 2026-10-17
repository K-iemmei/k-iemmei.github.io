import { lesson as L } from './lesson.js';
export const units = [
    {
        id: 'questions-and-reporting',
        title: 'Questions & reported speech',
        subtitle: 'Câu hỏi, phủ định và lời nói gián tiếp',
        lessons: [
            L(
                'reported-statements',
                'Reported statements',
                'Tường thuật lời nói',
                'B1',
                'Thuật lại nội dung lời nói từ góc nhìn và thời điểm của người kể, không chỉ thay đổi thì theo bảng.',
                [
                    [
                        'Say và tell',
                        'Say thường theo sau bằng lời nói hoặc that-clause; tell cần người nghe khi tường thuật nội dung. Đổi I/you, my/your dựa vào người được nhắc thực tế.',
                        'She said (that) she was busy. / She told me she was busy.',
                    ],
                    [
                        'Lùi thì',
                        'Sau động từ tường thuật quá khứ, hiện tại thường chuyển quá khứ, quá khứ hoặc hiện tại hoàn thành thường chuyển quá khứ hoàn thành; will thường thành would. Lùi thì không bắt buộc nếu thông tin vẫn đúng và người nói giữ góc nhìn hiện tại.',
                        '“I’m tired.” → He said he was tired.',
                    ],
                    [
                        'Thời gian và địa điểm',
                        'This/that, here/there, today/that day chỉ đổi khi điểm nhìn đã thay đổi. Không đổi tomorrow thành the next day nếu người kể vẫn nói cùng ngày và tomorrow vẫn rõ nghĩa.',
                        '“I’ll call tomorrow.” → She said she would call the following day.',
                    ],
                ],
                [
                    [
                        'Cuộc họp',
                        'Minh told me that the supplier had changed the delivery date.',
                        'Minh nói với tôi rằng nhà cung cấp đã đổi ngày giao.',
                    ],
                    [
                        'Gia đình',
                        'She said her brother lives in Canada.',
                        'Cô ấy nói anh trai sống ở Canada; người kể xem thông tin vẫn đúng.',
                    ],
                ],
                [
                    'She said me that she was busy.',
                    'She told me that she was busy.',
                    'Dùng tell + người; với say có thể nói said to me.',
                ],
                [
                    'He ___ me that the meeting was cancelled.',
                    ['said', 'told', 'spoke'],
                    1,
                    'Tell nhận người nghe me làm tân ngữ.',
                ],
            ),
            L(
                'reported-questions',
                'Reported questions & requests',
                'Tường thuật câu hỏi và yêu cầu',
                'B1',
                'Câu hỏi gián tiếp giữ ý hỏi nhưng không giữ trật tự đảo của câu hỏi trực tiếp.',
                [
                    [
                        'Câu hỏi có/không',
                        'Dùng asked + if/whether + chủ ngữ + động từ. Bỏ do/does/did nếu chúng chỉ là trợ động từ của câu hỏi; xử lý lùi thì và đại từ theo ngữ cảnh.',
                        '“Do you work here?” → She asked if I worked there.',
                    ],
                    [
                        'Câu hỏi wh-',
                        'Giữ từ hỏi nhưng dùng trật tự trần thuật. Who là chủ ngữ thì hình thức có thể không đổi về trật tự; không thêm dấu hỏi chỉ vì nội dung vốn là câu hỏi.',
                        'He asked where the station was.',
                    ],
                    [
                        'Yêu cầu, mệnh lệnh',
                        'Ask/tell + người + to-infinitive tường thuật lời yêu cầu hoặc chỉ dẫn; dùng not to cho phủ định. Warn, remind, advise cũng có mẫu tương tự nhưng nghĩa khác.',
                        'She reminded me not to forget my passport.',
                    ],
                ],
                [
                    [
                        'Phỏng vấn',
                        'They asked whether I had managed a team before.',
                        'Họ hỏi tôi đã từng quản lý nhóm chưa.',
                    ],
                    [
                        'Hướng dẫn',
                        'The receptionist asked us to wait in the lobby.',
                        'Lễ tân yêu cầu chúng tôi đợi ở sảnh.',
                    ],
                ],
                [
                    'She asked where did I live.',
                    'She asked where I lived.',
                    'Mệnh đề được tường thuật không đảo did trước chủ ngữ.',
                ],
                [
                    'He told us ___ the restricted area.',
                    ['not to enter', 'to not entered', 'don’t enter'],
                    0,
                    'Tường thuật mệnh lệnh phủ định: told + người + not to + nguyên mẫu.',
                ],
            ),
            L(
                'question-formation',
                'Direct questions',
                'Cách lập câu hỏi trực tiếp',
                'A2',
                'Phân biệt câu hỏi về chủ ngữ, tân ngữ và câu hỏi có/không.',
                [
                    [
                        'Đảo trợ động từ',
                        'Với be, have hoàn thành và modal, đặt trợ động từ đầu tiên trước chủ ngữ. Với động từ thường ở hiện tại/quá khứ đơn, thêm do/does/did và đưa động từ chính về nguyên mẫu.',
                        'Are you ready? / Has she arrived? / Where did you go?',
                    ],
                    [
                        'Hỏi chủ ngữ',
                        'Khi who/what là chủ ngữ, không dùng do chỉ để tạo câu hỏi. So sánh Who called you? với Who did you call? vì vai trò của who khác nhau.',
                        'Who broke the window? / What happened?',
                    ],
                    [
                        'Từ hỏi và giới từ',
                        'How often hỏi tần suất, how long hỏi thời lượng hoặc chiều dài, how far hỏi khoảng cách. Giới từ thường đứng cuối khi hỏi tự nhiên; giới từ + whom phổ biến hơn trong văn viết trang trọng.',
                        'Who are you waiting for?',
                    ],
                ],
                [
                    [
                        'Dịch vụ',
                        'How long does the repair usually take?',
                        'Việc sửa chữa thường mất bao lâu?',
                    ],
                    ['Văn phòng', 'Who sent the updated schedule?', 'Ai đã gửi lịch cập nhật?'],
                ],
                [
                    'Where you work?',
                    'Where do you work?',
                    'Động từ thường hiện tại đơn cần do trong câu hỏi tân ngữ/trạng ngữ này.',
                ],
                [
                    '___ called while I was out?',
                    ['Who', 'Who did', 'Who does'],
                    0,
                    'Who làm chủ ngữ của called, không cần did.',
                ],
            ),
            L(
                'indirect-questions-tags',
                'Indirect questions & question tags',
                'Hỏi gián tiếp và câu hỏi đuôi',
                'B1',
                'Dùng câu hỏi gián tiếp để lịch sự và câu hỏi đuôi để kiểm tra hoặc tìm sự đồng thuận.',
                [
                    [
                        'Hỏi gián tiếp',
                        'Could you tell me…? hoặc Do you know…? theo sau bằng mệnh đề trần thuật. Với có/không dùng if/whether. Chỉ phần câu hỏi bên ngoài được đảo chủ ngữ.',
                        'Could you tell me where the lift is?',
                    ],
                    [
                        'Câu hỏi đuôi',
                        'Thông thường câu khẳng định đi với đuôi phủ định và ngược lại. Dùng cùng trợ động từ và đại từ phù hợp. Hiện tại đơn không có trợ động từ thì đuôi dùng do/does.',
                        'You work here, don’t you? / She isn’t coming, is she?',
                    ],
                    [
                        'Ngoại lệ và ngữ điệu',
                        'I am… thường có đuôi aren’t I?; Let’s… thường đi với shall we?; mệnh lệnh có thể dùng will you? Never, nobody mang nghĩa phủ định nên đuôi thường khẳng định. Ngữ điệu quyết định đang thật sự hỏi hay mong đồng ý.',
                        'You’ve never met her, have you?',
                    ],
                ],
                [
                    [
                        'Hỏi đường',
                        'Do you know what time the last train leaves?',
                        'Bạn biết chuyến tàu cuối chạy lúc mấy giờ không?',
                    ],
                    [
                        'Cuộc họp',
                        'We’ve already agreed on the deadline, haven’t we?',
                        'Ta đã thống nhất hạn chót rồi, đúng không?',
                    ],
                ],
                [
                    'Could you tell me where is the bank?',
                    'Could you tell me where the bank is?',
                    'Phần where… dùng trật tự trần thuật.',
                ],
                [
                    'She doesn’t drive, ___?',
                    ['does she', 'doesn’t she', 'is she'],
                    0,
                    'Mệnh đề phủ định hiện tại đơn cần đuôi khẳng định does she.',
                ],
            ),
            L(
                'negatives',
                'Negatives & negative scope',
                'Phủ định và phạm vi phủ định',
                'B2',
                'Hiểu not đang phủ định phần nào để tránh đổi ý hoặc vô tình tạo nghĩa khác.',
                [
                    [
                        'Tạo phủ định',
                        'Not đứng sau trợ động từ đầu tiên hoặc be; động từ thường hiện tại/quá khứ đơn dùng do-support. Never, nobody, nothing tự mang nghĩa phủ định, nên trong tiếng Anh chuẩn thông thường không thêm not để diễn tả cùng một phủ định.',
                        'Nobody called. / I didn’t see anything.',
                    ],
                    [
                        'Not all khác none',
                        'Not all chỉ không phải tất cả, vẫn có một phần đúng. None là không có cái/người nào trong nhóm. Both…not có thể mơ hồ; not both hoặc neither làm rõ ý hơn.',
                        'Not all the files are public. / None of the files are public.',
                    ],
                    [
                        'Either/neither và câu trả lời',
                        'Too/so dùng cho ý khẳng định; either/neither cho ý phủ định. Neither + trợ động từ + chủ ngữ mang nghĩa cũng không; tránh nhầm với neither…nor tạo chủ ngữ ghép.',
                        'I don’t smoke. Neither do I. / I don’t either.',
                    ],
                ],
                [
                    [
                        'Báo cáo',
                        'Not all customers chose the cheapest plan.',
                        'Không phải mọi khách hàng đều chọn gói rẻ nhất.',
                    ],
                    ['Hội thoại', 'I haven’t seen that film either.', 'Tôi cũng chưa xem phim đó.'],
                ],
                [
                    'I didn’t see nobody.',
                    'I didn’t see anybody.',
                    'Trong tiếng Anh chuẩn thông thường, không dùng hai dấu phủ định cho cùng ý.',
                ],
                [
                    '“I don’t eat meat.” “Neither ___ I.”',
                    ['do', 'don’t', 'am'],
                    0,
                    'Neither đã phủ định; dùng trợ động từ khẳng định do và đảo trước I.',
                ],
            ),
            L(
                'coordination-punctuation',
                'Coordination & punctuation',
                'Nối mệnh đề và dấu câu',
                'B2',
                'Viết câu ghép rõ ràng, tránh câu thiếu mệnh đề chính hoặc ghép hai câu chỉ bằng dấu phẩy.',
                [
                    [
                        'Liên từ đẳng lập',
                        'And, but, or, so, yet nối các thành phần tương đương. Khi nối hai mệnh đề độc lập, thường có dấu phẩy trước liên từ, đặc biệt nếu câu dài.',
                        'I checked the figures, but I haven’t sent the report.',
                    ],
                    [
                        'Trạng từ nối',
                        'However, therefore, moreover không hoạt động hệt but/so. Dùng dấu chấm hoặc chấm phẩy giữa hai mệnh đề độc lập, rồi phẩy sau trạng từ nối khi thích hợp.',
                        'The figures look right; however, we need to verify them.',
                    ],
                    [
                        'Song song và câu thiếu',
                        'Giữ dạng ngữ pháp tương đương trong danh sách: planning, writing and editing. Because/although thường tạo mệnh đề phụ; nếu đứng riêng trong văn viết học thuật, câu có thể bị thiếu ý chính.',
                        'The role involves planning, writing and editing.',
                    ],
                ],
                [
                    [
                        'Email',
                        'The draft is ready; however, the budget still needs approval.',
                        'Bản nháp đã xong; tuy nhiên ngân sách vẫn cần phê duyệt.',
                    ],
                    [
                        'Mô tả việc',
                        'You will organise meetings, prepare notes and track actions.',
                        'Bạn sẽ tổ chức họp, chuẩn bị ghi chú và theo dõi việc cần làm.',
                    ],
                ],
                [
                    'It was late, we went home.',
                    'It was late, so we went home.',
                    'Hai mệnh đề độc lập không nên chỉ nối bằng dấu phẩy trong văn viết chuẩn.',
                ],
                [
                    'Choose the correctly linked sentence.',
                    [
                        'I was tired, however I continued.',
                        'I was tired; however, I continued.',
                        'I was tired however, I continued.',
                    ],
                    1,
                    'Chấm phẩy tách hai mệnh đề độc lập; however theo sau bằng phẩy.',
                ],
            ),
        ],
    },
    {
        id: 'hypotheticals',
        title: 'Conditionals & unreal meanings',
        subtitle: 'Điều kiện, mong ước và giả định',
        lessons: [
            L(
                'zero-first-conditionals',
                'Zero & first conditionals',
                'Điều kiện sự thật và tương lai khả thi',
                'A2',
                'Phân biệt quy luật chung với kết quả cụ thể có thể xảy ra trong tương lai.',
                [
                    [
                        'Điều kiện loại không',
                        'If/when + hiện tại, hiện tại thường diễn tả quan hệ lặp lại hoặc quy luật. When nhấn mạnh thời điểm xảy ra; if nhấn mạnh điều kiện có thể có hoặc không.',
                        'If you heat ice, it melts.',
                    ],
                    [
                        'Điều kiện loại một',
                        'If + hiện tại thường đi với will + nguyên mẫu ở mệnh đề kết quả. Kết quả cũng có thể dùng can, may hoặc mệnh lệnh, tùy ý nghĩa; không giới hạn duy nhất ở will.',
                        'If you finish early, you can leave.',
                    ],
                    [
                        'Unless và vị trí',
                        'Unless thường nghĩa là if not trong điều kiện phù hợp. Mệnh đề if có thể đứng trước hoặc sau; đứng trước thường dùng dấu phẩy. Will vẫn có thể xuất hiện trong if-clause với nghĩa sẵn lòng, không phải quy tắc cấm tuyệt đối.',
                        'Unless we hurry, we’ll miss it.',
                    ],
                ],
                [
                    [
                        'Công nghệ',
                        'If you press this button, the device restarts.',
                        'Nếu bấm nút này, thiết bị khởi động lại.',
                    ],
                    [
                        'Hẹn gặp',
                        'If the weather is good tomorrow, we’ll meet outside.',
                        'Nếu ngày mai thời tiết tốt, ta gặp nhau ngoài trời.',
                    ],
                ],
                [
                    'If it will rain tomorrow, we’ll stay in.',
                    'If it rains tomorrow, we’ll stay in.',
                    'Điều kiện tương lai thông thường dùng hiện tại đơn trong mệnh đề if.',
                ],
                [
                    'If she arrives early, ___ her to wait here.',
                    ['ask', 'asked', 'asking'],
                    0,
                    'Mệnh đề kết quả có thể là mệnh lệnh ask.',
                ],
            ),
            L(
                'second-conditional',
                'Second conditional',
                'Giả định không thực ở hiện tại hoặc tương lai',
                'B1',
                'Dùng dạng quá khứ để tạo khoảng cách với thực tế, không phải lúc nào để nói thời gian đã qua.',
                [
                    [
                        'Cấu trúc',
                        'If + quá khứ đơn, would + nguyên mẫu thường diễn tả một tình huống tưởng tượng hoặc ít khả năng. Could/might có thể thay would nếu muốn nói khả năng hoặc mức chắc chắn khác.',
                        'If I had more time, I would travel more.',
                    ],
                    [
                        'Were và was',
                        'If I were you là mẫu khuyên phổ biến. Were có thể dùng với mọi chủ ngữ trong giả định trang trọng; was cũng phổ biến trong lời nói với I/he/she/it, nhưng were phù hợp khi cần nhấn mạnh tính không thực.',
                        'If she were here, she could help.',
                    ],
                    [
                        'Đối chiếu điều kiện một',
                        'First conditional nhìn điều kiện như khả thi; second conditional tạo khoảng cách hoặc giả định. Sự khác biệt không chỉ là xác suất khách quan mà còn là thái độ người nói.',
                        'If I get the role… / If I got the role…',
                    ],
                ],
                [
                    [
                        'Lời khuyên',
                        'If I were you, I would ask for written confirmation.',
                        'Nếu là bạn, tôi sẽ xin xác nhận bằng văn bản.',
                    ],
                    [
                        'Ước muốn',
                        'If we lived closer, we could meet more often.',
                        'Nếu sống gần hơn, chúng ta có thể gặp nhau thường xuyên hơn.',
                    ],
                ],
                [
                    'If I would have more money, I would travel.',
                    'If I had more money, I would travel.',
                    'Mẫu điều kiện hai thông thường dùng quá khứ trong mệnh đề if.',
                ],
                [
                    'If I ___ you, I would apologise.',
                    ['were', 'am', 'will be'],
                    0,
                    'If I were you là mẫu giả định đưa lời khuyên.',
                ],
            ),
            L(
                'third-conditional',
                'Third conditional',
                'Giả định trái với quá khứ',
                'B2',
                'Tưởng tượng lại một điều kiện quá khứ và kết quả quá khứ đã không xảy ra theo cách đó.',
                [
                    [
                        'Điều kiện quá khứ',
                        'If + had + V3 tạo giả định về quá khứ; would have + V3 nêu kết quả quá khứ giả định. Câu không thay đổi quá khứ thực, chỉ xem xét kịch bản khác.',
                        'If we had left earlier, we would have caught the train.',
                    ],
                    [
                        'Could và might',
                        'Could have nhấn mạnh khả năng có thể đạt; might have nhấn mạnh kết quả có thể xảy ra nhưng không chắc. Chọn modal theo điều thật sự muốn nói.',
                        'If you had called, I could have helped.',
                    ],
                    [
                        'Rút gọn và ngữ cảnh',
                        'I’d had = I had had, còn I’d have = I would have. Dùng đầy đủ khi dễ nhầm. Loại ba có thể thể hiện tiếc nuối, giải thích hoặc phê bình, nên chú ý giọng điệu.',
                        'If I’d known, I’d have waited.',
                    ],
                ],
                [
                    [
                        'Du lịch',
                        'If we had checked the timetable, we wouldn’t have missed the ferry.',
                        'Nếu đã kiểm tra lịch, ta đã không lỡ phà.',
                    ],
                    [
                        'Công việc',
                        'If you had shared the draft, I could have reviewed it.',
                        'Nếu bạn đã gửi bản nháp, tôi đã có thể xem lại.',
                    ],
                ],
                [
                    'If I would have known, I would have helped.',
                    'If I had known, I would have helped.',
                    'Mệnh đề if thông thường dùng had + V3, không would have.',
                ],
                [
                    'If she had saved the file, she ___ her work.',
                    ['wouldn’t have lost', 'won’t lose', 'wouldn’t lost'],
                    0,
                    'Kết quả giả định quá khứ: would not have + V3.',
                ],
            ),
            L(
                'mixed-conditionals',
                'Mixed conditionals',
                'Điều kiện hỗn hợp',
                'B2',
                'Kết nối điều kiện và kết quả thuộc các mốc thời gian khác nhau.',
                [
                    [
                        'Quá khứ → hiện tại',
                        'If + had + V3 nêu quá khứ khác thực tế; would + nguyên mẫu nói kết quả hiện tại. Các từ now/today giúp làm rõ mốc nhưng ý nghĩa mới quyết định.',
                        'If I had slept earlier, I wouldn’t be so tired now.',
                    ],
                    [
                        'Hiện tại → quá khứ',
                        'If + quá khứ đơn có thể nêu một đặc điểm hiện tại hoặc ổn định; would have + V3 nói kết quả quá khứ. Đặc điểm đó cần có liên hệ hợp lý với quá khứ.',
                        'If I were more organised, I wouldn’t have missed the deadline.',
                    ],
                    [
                        'Chọn từ trục thời gian',
                        'Xác định lúc xảy ra điều kiện và lúc xảy ra kết quả trước khi chọn dạng. Không trộn hai cấu trúc chỉ để câu nghe nâng cao; kiểm tra ý nghĩa giả định của từng vế.',
                        'past cause → present result / lasting trait → past result',
                    ],
                ],
                [
                    [
                        'Nghề nghiệp',
                        'If I had accepted that offer, I would be living abroad now.',
                        'Nếu đã nhận đề nghị đó, giờ tôi đang sống ở nước ngoài.',
                    ],
                    [
                        'Rút kinh nghiệm',
                        'If he were more careful, he wouldn’t have sent the wrong attachment.',
                        'Nếu anh ấy cẩn thận hơn, anh ấy đã không gửi nhầm tệp.',
                    ],
                ],
                [
                    'If I had studied medicine, I would have been a doctor now.',
                    'If I had studied medicine, I might be a doctor now.',
                    'Kết quả ở hiện tại dùng would/might + nguyên mẫu; might cũng tránh khẳng định chắc một kết quả không đảm bảo.',
                ],
                [
                    'If I had brought my charger, my phone ___ dead now.',
                    ['wouldn’t be', 'wouldn’t have been yesterday', 'won’t have'],
                    0,
                    'Điều kiện quá khứ và kết quả hiện tại tạo điều kiện hỗn hợp.',
                ],
            ),
            L(
                'wish-if-only',
                'Wish & if only',
                'Ước muốn trái thực tế',
                'B2',
                'Diễn tả điều muốn khác với thực tế hiện tại, quá khứ hoặc hành vi đang gây khó chịu.',
                [
                    [
                        'Hiện tại và khả năng',
                        'Wish/if only + quá khứ đơn nêu mong ước khác hiện tại. Wish + could diễn tả mong có khả năng hoặc cơ hội. Were thường dùng trong văn phong trang trọng.',
                        'I wish I had more time. / If only I could stay.',
                    ],
                    [
                        'Tiếc nuối quá khứ',
                        'Wish + had + V3 nói điều ước về quá khứ. Đừng dùng would have như mẫu kết quả điều kiện khi đứng sau wish trong cách dùng chuẩn này.',
                        'I wish I had checked the address.',
                    ],
                    [
                        'Mong thay đổi',
                        'Wish + would thường diễn tả mong người hoặc sự việc thay đổi, đôi khi kèm khó chịu. Không thường dùng I wish I would để nói về quyết định chủ động của chính mình. Dùng hope cho tương lai thực sự có thể xảy ra.',
                        'I wish the neighbours would turn the music down.',
                    ],
                ],
                [
                    [
                        'Công việc',
                        'I wish I had asked for feedback before submitting.',
                        'Ước gì tôi đã xin góp ý trước khi nộp.',
                    ],
                    [
                        'Gia đình',
                        'I wish we lived closer to each other.',
                        'Ước gì chúng ta sống gần nhau hơn.',
                    ],
                ],
                [
                    'I wish I know the answer.',
                    'I wish I knew the answer.',
                    'Ước trái hiện tại dùng dạng quá khứ knew.',
                ],
                [
                    'I missed the meeting. I wish I ___ the reminder.',
                    ['had seen', 'would see yesterday', 'see'],
                    0,
                    'Tiếc điều đã xảy ra dùng wish + quá khứ hoàn thành.',
                ],
            ),
            L(
                'unreal-past',
                'Would rather & it’s time',
                'Quá khứ giả định trong lựa chọn và thúc giục',
                'B2',
                'Một số cấu trúc dùng dạng quá khứ để thể hiện mong muốn về hiện tại hoặc tương lai.',
                [
                    [
                        'Cùng chủ ngữ',
                        'Would rather + nguyên mẫu không to nói lựa chọn của chính chủ ngữ. Dùng rather not + nguyên mẫu cho phủ định và rather have + V3 khi nói lựa chọn quá khứ khác thực tế.',
                        'I’d rather stay home. / I’d rather not discuss it.',
                    ],
                    [
                        'Khác chủ ngữ',
                        'Would rather + người khác + quá khứ đơn thường nói mong muốn hiện tại/tương lai. Với mong muốn khác quá khứ đã xảy ra, dùng quá khứ hoàn thành.',
                        'I’d rather you sent it tomorrow. / I’d rather you hadn’t said that.',
                    ],
                    [
                        'It’s time và as if',
                        'It’s time + chủ ngữ + quá khứ diễn tả đã đến lúc, đôi khi là muộn rồi. It’s time to do dùng nguyên mẫu. As if/as though dùng dạng quá khứ khi tạo khoảng cách với thực tế; không bắt buộc nếu người nói xem điều đó có thể đúng.',
                        'It’s time we left. / He talks as if he knew everything.',
                    ],
                ],
                [
                    [
                        'Công việc',
                        'I’d rather you checked the figures before sending the email.',
                        'Tôi muốn bạn kiểm tra số liệu trước khi gửi email.',
                    ],
                    [
                        'Sinh hoạt',
                        'It’s time we took a proper break.',
                        'Đến lúc chúng ta nghỉ cho ra nghỉ rồi.',
                    ],
                ],
                [
                    'I’d rather to stay here.',
                    'I’d rather stay here.',
                    'Would rather cùng chủ ngữ dùng nguyên mẫu không to.',
                ],
                [
                    'It’s time we ___ home.',
                    ['went', 'will go', 'going'],
                    0,
                    'It’s time + chủ ngữ + dạng quá khứ dùng cho ý hiện tại.',
                ],
            ),
        ],
    },
];
