import { lesson as L } from './lesson.js';
export const units = [
    {
        id: 'foundations',
        title: 'Sentence foundations',
        subtitle: 'Nền tảng câu tiếng Anh',
        lessons: [
            L(
                'word-classes',
                'Parts of speech',
                'Từ loại và vai trò trong câu',
                'A1',
                'Nhận diện chức năng của từ trước khi ghép thành câu; một từ có thể thuộc nhiều từ loại tùy ngữ cảnh.',
                [
                    [
                        'Từ mang nội dung',
                        'Danh từ gọi tên người, vật hoặc ý tưởng; động từ diễn tả hành động hoặc trạng thái. Tính từ mô tả danh từ, còn trạng từ thường bổ nghĩa cho động từ, tính từ hoặc cả câu.',
                        'a careful driver → drive carefully',
                    ],
                    [
                        'Từ nối và từ chức năng',
                        'Đại từ thay cho cụm danh từ; từ hạn định đứng trước danh từ; giới từ nối danh từ với phần khác; liên từ nối từ hoặc mệnh đề. Không dịch từng từ rồi giữ nguyên trật tự tiếng Việt.',
                        'the report / in the report / because it matters',
                    ],
                    [
                        'Xác định theo vị trí',
                        'Đừng chỉ nhìn đuôi từ: fast vừa là tính từ vừa là trạng từ; work vừa là danh từ vừa là động từ. Hỏi từ đang bổ nghĩa cho thành phần nào để chọn dạng đúng.',
                        'a fast train / travel fast',
                    ],
                ],
                [
                    [
                        'Công việc',
                        'The team carefully reviewed the new proposal.',
                        'Nhóm đã xem xét kỹ đề xuất mới.',
                    ],
                    [
                        'Đời sống',
                        'I work from home, but my work is demanding.',
                        'Tôi làm việc ở nhà, nhưng công việc của tôi khá áp lực.',
                    ],
                ],
                [
                    'She speaks English fluent.',
                    'She speaks English fluently.',
                    'Bổ nghĩa cho speaks cần trạng từ fluently, không dùng tính từ fluent.',
                ],
                [
                    'Choose the word describing the action: She answered ___.',
                    ['polite', 'politely', 'politeness'],
                    1,
                    'Answered là động từ; politely mô tả cách trả lời.',
                ],
            ),
            L(
                'sentence-patterns',
                'Sentence patterns',
                'Chủ ngữ, động từ và bổ ngữ',
                'A1',
                'Ghép câu bằng các thành phần có chức năng rõ ràng thay vì nối những từ đã dịch riêng lẻ.',
                [
                    [
                        'Khung câu cơ bản',
                        'Một mệnh đề trần thuật thường có chủ ngữ và động từ. Nội động từ có thể không cần tân ngữ; ngoại động từ thường cần đối tượng nhận hành động.',
                        'S + V: Birds fly. / S + V + O: We need help.',
                    ],
                    [
                        'Động từ nối',
                        'Sau be, seem, become, feel có thể là bổ ngữ mô tả chủ ngữ, không phải tân ngữ. Dùng tính từ sau động từ nối khi mô tả trạng thái.',
                        'S + linking verb + complement: The soup smells good.',
                    ],
                    [
                        'Hai tân ngữ và trạng ngữ',
                        'Một số động từ như give, send cho phép người nhận rồi đến vật. Trạng ngữ thời gian hoặc nơi chốn bổ sung bối cảnh; một số động từ như put cần vị trí để đủ nghĩa.',
                        'She sent me a file. / She put it on the desk.',
                    ],
                ],
                [
                    [
                        'Email',
                        'I sent the client an updated invoice.',
                        'Tôi gửi cho khách hóa đơn đã cập nhật.',
                    ],
                    ['Ăn uống', 'The noodles smell delicious.', 'Mì có mùi rất thơm.'],
                ],
                [
                    'She very happy today.',
                    'She is very happy today.',
                    'Happy là tính từ, cần be để tạo vị ngữ trong câu này.',
                ],
                [
                    'Choose a complete sentence.',
                    ['The manager busy.', 'The manager is busy.', 'The manager very busy.'],
                    1,
                    'Is nối chủ ngữ với tính từ busy.',
                ],
            ),
            L(
                'be-and-have',
                'Be, have & auxiliaries',
                'Be, have và trợ động từ',
                'A1',
                'Phân biệt động từ mang nghĩa chính với động từ giúp tạo phủ định, câu hỏi và các thì.',
                [
                    [
                        'Be và sự hòa hợp',
                        'Hiện tại dùng am với I, is với he/she/it, are với you/we/they. Quá khứ dùng was hoặc were. Đảo be lên trước chủ ngữ khi hỏi; thêm not khi phủ định.',
                        'I am ready. / Are you ready? / She was not ready.',
                    ],
                    [
                        'Have chỉ sở hữu',
                        'Have/has có thể là động từ chính chỉ sở hữu hoặc trải nghiệm. Dùng do/does/did để hỏi và phủ định theo cách thông dụng; have got cũng diễn tả sở hữu trong hiện tại.',
                        'Do you have a charger? / She has got two sisters.',
                    ],
                    [
                        'Trợ động từ',
                        'Do tạo câu hỏi hoặc phủ định ở hiện tại đơn, quá khứ đơn với động từ thường. Be tạo tiếp diễn và bị động; have tạo hoàn thành. Không thêm do khi đã có be hoặc modal.',
                        'Does he work? / Is he working? / Has he left?',
                    ],
                ],
                [
                    [
                        'Du lịch',
                        'Do you have a room available tonight?',
                        'Khách sạn còn phòng tối nay không?',
                    ],
                    [
                        'Hẹn gặp',
                        'We were late because the train was delayed.',
                        'Chúng tôi muộn vì tàu bị chậm.',
                    ],
                ],
                [
                    'Does she has a laptop?',
                    'Does she have a laptop?',
                    'Sau does dùng dạng nguyên mẫu have.',
                ],
                [
                    '___ your brother at home now?',
                    ['Does', 'Is', 'Has'],
                    1,
                    'At home là cụm chỉ nơi chốn sau be.',
                ],
            ),
            L(
                'pronouns',
                'Personal & reflexive pronouns',
                'Đại từ nhân xưng và phản thân',
                'A1',
                'Chọn đại từ theo vai trò chủ ngữ, tân ngữ hoặc hành động quay lại chính người thực hiện.',
                [
                    [
                        'Chủ ngữ và tân ngữ',
                        'I, he, she, we, they làm chủ ngữ; me, him, her, us, them làm tân ngữ của động từ hoặc giới từ. You và it giữ nguyên hình thức.',
                        'She called me. / This is for us.',
                    ],
                    [
                        'Phản thân',
                        'Dùng myself, yourself, himself… khi chủ ngữ và tân ngữ là cùng một người. Có thể dùng để nhấn mạnh hoặc với by để diễn tả tự làm một mình; không thay I/me chỉ để câu nghe trang trọng.',
                        'I taught myself. / She fixed it herself.',
                    ],
                    [
                        'Tham chiếu rõ ràng',
                        'Đại từ phải chỉ rõ đối tượng. Singular they dùng cho người chưa rõ giới tính hoặc dùng they; sau they vẫn dùng are/have. Tránh để it hoặc they có nhiều tiền tố khả dĩ.',
                        'Someone left their bag. They may come back.',
                    ],
                ],
                [
                    [
                        'Công việc',
                        'Please send the schedule to Mai and me.',
                        'Hãy gửi lịch cho Mai và tôi.',
                    ],
                    [
                        'Tự học',
                        'I taught myself to use the new software.',
                        'Tôi tự học cách dùng phần mềm mới.',
                    ],
                ],
                [
                    'Please contact myself tomorrow.',
                    'Please contact me tomorrow.',
                    'Không có chủ ngữ I cùng chỉ người nhận hành động nên không dùng myself.',
                ],
                [
                    'The children made dinner by ___.',
                    ['them', 'themselves', 'their'],
                    1,
                    'By themselves diễn tả tự làm, không có người giúp.',
                ],
            ),
            L(
                'there-and-it',
                'There is & introductory it',
                'Giới thiệu sự tồn tại và chủ ngữ giả',
                'A1',
                'Dùng there để giới thiệu một sự vật; dùng it cho thời tiết, thời gian, khoảng cách hoặc chủ ngữ giả.',
                [
                    [
                        'Sự tồn tại',
                        'There is đi với danh từ số ít hoặc không đếm được; there are với danh từ số nhiều. Trong văn viết chuẩn nên giữ hòa hợp; không dùng have thay there is chỉ vì tiếng Việt nói có.',
                        'There is a café nearby. / There are two exits.',
                    ],
                    [
                        'Phủ định và câu hỏi',
                        'Đảo is/are hoặc dùng thì phù hợp. Any thường xuất hiện trong câu hỏi trung tính và phủ định. Có thể mở rộng thành there was, there will be, there has been.',
                        'Are there any seats? / There has been a mistake.',
                    ],
                    [
                        'It mở đầu câu',
                        'It có thể không chỉ một vật cụ thể: thời tiết, giờ, khoảng cách. Với đánh giá, đặt chủ ngữ thật ở cuối bằng to-infinitive hoặc that-clause.',
                        'It is important to back up your files.',
                    ],
                ],
                [
                    [
                        'Đi lại',
                        'There are two buses to the airport every hour.',
                        'Mỗi giờ có hai chuyến xe buýt ra sân bay.',
                    ],
                    [
                        'Lên kế hoạch',
                        'It takes twenty minutes to walk to the station.',
                        'Đi bộ tới ga mất hai mươi phút.',
                    ],
                ],
                [
                    'Have many people in the café.',
                    'There are many people in the café.',
                    'Dùng there are để nói có nhiều người ở một nơi.',
                ],
                [
                    '___ is raining outside.',
                    ['There', 'It', 'They'],
                    1,
                    'Thời tiết dùng chủ ngữ giả it.',
                ],
            ),
            L(
                'imperatives',
                'Imperatives & suggestions',
                'Mệnh lệnh, hướng dẫn và gợi ý',
                'A1',
                'Viết hướng dẫn ngắn gọn và điều chỉnh độ lịch sự tùy quan hệ giữa người nói với người nghe.',
                [
                    [
                        'Dạng khẳng định',
                        'Mệnh lệnh thường bắt đầu bằng động từ nguyên mẫu và lược chủ ngữ you. Dùng trong công thức, biển báo hoặc chỉ đường; cách nói trực tiếp có thể mạnh trong hội thoại.',
                        'Turn left. / Keep the receipt.',
                    ],
                    [
                        'Phủ định và nhấn mạnh',
                        'Dùng do not hoặc don’t trước động từ, kể cả be. Please làm lời yêu cầu mềm hơn nhưng không tự động phù hợp mọi tình huống; câu hỏi với could thường lịch sự hơn.',
                        'Please do not enter. / Don’t be late.',
                    ],
                    [
                        'Đề xuất cùng làm',
                        'Let’s đề xuất hành động bao gồm người nói; let’s not phủ định. How about thường theo sau bởi V-ing hoặc danh từ, còn why don’t we theo sau bởi nguyên mẫu.',
                        'Let’s take a break. / How about taking a break?',
                    ],
                ],
                [
                    [
                        'Công nghệ',
                        'Save your changes before closing the window.',
                        'Hãy lưu thay đổi trước khi đóng cửa sổ.',
                    ],
                    [
                        'Bạn bè',
                        'Let’s not discuss work over dinner.',
                        'Đừng bàn chuyện công việc trong bữa tối nhé.',
                    ],
                ],
                [
                    'Don’t to touch the screen.',
                    'Don’t touch the screen.',
                    'Sau don’t trong mệnh lệnh dùng động từ nguyên mẫu không to.',
                ],
                [
                    'How about ___ the earlier train?',
                    ['take', 'taking', 'to take'],
                    1,
                    'How about + V-ing là mẫu đề xuất thông dụng.',
                ],
            ),
        ],
    },
    {
        id: 'noun-phrases',
        title: 'Nouns & determiners',
        subtitle: 'Danh từ và cụm danh từ',
        lessons: [
            L(
                'countable-nouns',
                'Countable & uncountable nouns',
                'Danh từ đếm được và không đếm được',
                'A1',
                'Tính đếm được quyết định mạo từ, lượng từ, số nhiều và động từ đi theo danh từ.',
                [
                    [
                        'Danh từ đếm được',
                        'Danh từ đếm được số ít thường cần từ hạn định như a, the, my. Số nhiều thường thêm -s/-es, nhưng có dạng bất quy tắc như children, people, mice.',
                        'a customer / three customers / two children',
                    ],
                    [
                        'Danh từ không đếm được',
                        'Information, advice, equipment và furniture thường không có -s và không dùng trực tiếp với a/an. Dùng đơn vị để đếm khi cần.',
                        'some advice / two pieces of advice',
                    ],
                    [
                        'Nghĩa thay đổi theo cách dùng',
                        'Coffee có thể chỉ chất lỏng không đếm được, hoặc một suất đồ uống khi gọi món. Experience không đếm được là kinh nghiệm; an experience là một trải nghiệm cụ thể.',
                        'I need experience. / It was an unusual experience.',
                    ],
                ],
                [
                    [
                        'Công việc',
                        'Could you give me some feedback on this draft?',
                        'Bạn có thể góp ý cho bản nháp này không?',
                    ],
                    [
                        'Quán cà phê',
                        'Two coffees and a glass of water, please.',
                        'Cho tôi hai ly cà phê và một ly nước.',
                    ],
                ],
                [
                    'I need an advice.',
                    'I need some advice.',
                    'Advice không đếm được; có thể nói a piece of advice.',
                ],
                [
                    'We bought new ___ for the office.',
                    ['equipments', 'equipment', 'an equipment'],
                    1,
                    'Equipment là danh từ không đếm được.',
                ],
            ),
            L(
                'articles',
                'A, an, the & zero article',
                'Mạo từ và trường hợp không dùng',
                'A1',
                'Chọn mạo từ dựa vào khả năng người nghe nhận diện đối tượng, không chỉ dựa vào lần đầu hay lần sau.',
                [
                    [
                        'A/an: một đối tượng chưa xác định',
                        'Dùng a/an trước danh từ đếm được số ít khi giới thiệu một thành viên của nhóm hoặc nghề nghiệp. Chọn a/an theo âm đầu, không theo chữ cái đầu.',
                        'a university / an hour / She is an architect.',
                    ],
                    [
                        'The: có thể xác định',
                        'Dùng the khi ngữ cảnh, thông tin bổ sung hoặc kiến thức chung xác định được đối tượng. Dùng với so sánh nhất và nhiều tên địa lý, nhưng không phải mọi tên riêng.',
                        'the file you sent / the sun / the United Kingdom',
                    ],
                    [
                        'Không mạo từ',
                        'Danh từ số nhiều hoặc không đếm được nói chung thường không có mạo từ. Các cụm go to school, at work có cách dùng quy ước; the school nhấn mạnh tòa nhà hoặc trường cụ thể.',
                        'Books are useful. / The books on my desk are yours.',
                    ],
                ],
                [
                    [
                        'Nhà ở',
                        'We rented a flat near the station.',
                        'Chúng tôi thuê một căn hộ gần ga.',
                    ],
                    [
                        'Công việc',
                        'The report you requested is ready.',
                        'Báo cáo bạn yêu cầu đã xong.',
                    ],
                ],
                [
                    'She is an university student.',
                    'She is a university student.',
                    'University bắt đầu bằng âm /j/, là phụ âm, nên dùng a.',
                ],
                [
                    'In general, ___ information travels quickly online.',
                    ['an', 'the', 'no article'],
                    2,
                    'Information không đếm được và đang được nói đến nói chung.',
                ],
            ),
            L(
                'determiners',
                'This, that, each & every',
                'Từ hạn định và phạm vi chỉ định',
                'A2',
                'Từ hạn định đứng trước danh từ và xác định người nói đang chỉ đối tượng nào hoặc phạm vi nào.',
                [
                    [
                        'This/that và these/those',
                        'This/these thường chỉ cái gần hoặc nội dung hiện tại; that/those chỉ cái xa hoặc được nhắc lại. This/that đi với số ít; these/those với số nhiều.',
                        'this issue / these issues / those files',
                    ],
                    [
                        'Each và every',
                        'Each tập trung từng thành viên riêng; every bao quát cả nhóm. Cả hai thường đi với danh từ đếm được số ít và động từ số ít. Each of + cụm số nhiều vẫn thường lấy động từ số ít.',
                        'Every participant has a badge. / Each of them has one.',
                    ],
                    [
                        'Another và other',
                        'Another nghĩa là một cái khác hoặc thêm một cái, thường trước danh từ số ít. Other trước danh từ số nhiều hoặc không đếm được; the other(s) chỉ phần còn lại đã xác định.',
                        'another question / other questions / the other option',
                    ],
                ],
                [
                    [
                        'Đào tạo',
                        'Each employee receives a personal access code.',
                        'Mỗi nhân viên được cấp một mã truy cập riêng.',
                    ],
                    [
                        'Mua hàng',
                        'These shoes fit, but I prefer the other colour.',
                        'Đôi giày này vừa, nhưng tôi thích màu còn lại hơn.',
                    ],
                ],
                [
                    'Every students need a pass.',
                    'Every student needs a pass.',
                    'Every đi với danh từ và động từ số ít trong mẫu này.',
                ],
                [
                    'Could I ask ___ question?',
                    ['another', 'other', 'others'],
                    0,
                    'Another đứng trước danh từ đếm được số ít question.',
                ],
            ),
            L(
                'quantifiers',
                'Some, any, much & few',
                'Lượng từ và sắc thái nhiều ít',
                'A2',
                'Lượng từ không chỉ cho biết số lượng; chúng còn thể hiện người nói đánh giá số lượng đó đủ hay thiếu.',
                [
                    [
                        'Much/many và a lot of',
                        'Many đi với danh từ đếm được số nhiều; much đi với danh từ không đếm được. A lot of dùng được với cả hai và tự nhiên trong câu khẳng định thông thường.',
                        'many emails / much time / a lot of work',
                    ],
                    [
                        'Some và any',
                        'Some phổ biến trong khẳng định và lời mời mong câu trả lời thuận; any thường trong phủ định hoặc câu hỏi trung tính. Any cũng có nghĩa bất kỳ trong khẳng định.',
                        'Would you like some tea? / Choose any seat.',
                    ],
                    [
                        'Few/little và a few/a little',
                        'Few và little nhấn mạnh gần như không có; a few và a little nhấn mạnh vẫn có một ít. Few dùng cho danh từ đếm được, little cho danh từ không đếm được; enough nghĩa là đủ.',
                        'few options / a few options / a little time',
                    ],
                ],
                [
                    [
                        'Hẹn gặp',
                        'I have a little time before my next meeting.',
                        'Tôi còn một ít thời gian trước cuộc họp tiếp theo.',
                    ],
                    [
                        'Dự án',
                        'There are few alternatives, so we need a backup plan.',
                        'Có rất ít phương án thay thế, nên cần kế hoạch dự phòng.',
                    ],
                ],
                [
                    'We don’t have many time.',
                    'We don’t have much time.',
                    'Time ở nghĩa thời lượng không đếm được.',
                ],
                [
                    'I have ___ close friends, so I rarely feel lonely.',
                    ['a few', 'little', 'much'],
                    0,
                    'Friends đếm được; a few phù hợp ý vẫn có vài người bạn.',
                ],
            ),
            L(
                'possession',
                'Possessives & noun modifiers',
                'Sở hữu và danh từ bổ nghĩa',
                'A2',
                'Diễn tả quan hệ sở hữu, liên hệ hoặc phân loại mà không đặt thừa từ hạn định.',
                [
                    [
                        'Tính từ và đại từ sở hữu',
                        'My, your, their cần danh từ theo sau; mine, yours, theirs thay cho cả cụm danh từ. Its là sở hữu, còn it’s là viết tắt của it is hoặc it has.',
                        'my charger / This charger is mine.',
                    ],
                    [
                        'Sở hữu cách',
                        'Thêm ’s cho danh từ số ít và số nhiều bất quy tắc; thêm dấu nháy sau số nhiều đã có -s. Với vật, cả sở hữu cách và of có thể dùng tùy cách diễn đạt, không có quy tắc cấm tuyệt đối.',
                        'the manager’s office / the students’ projects',
                    ],
                    [
                        'Danh từ làm bổ nghĩa',
                        'Danh từ đứng trước danh từ khác thường ở số ít để chỉ loại: a shoe shop. Không coi đây là sở hữu. Một số tổ hợp cố định giữ số nhiều như a sports centre.',
                        'a coffee cup / a three-day trip',
                    ],
                ],
                [
                    [
                        'Văn phòng',
                        'Is this your notebook or mine?',
                        'Đây là sổ của bạn hay của tôi?',
                    ],
                    [
                        'Du lịch',
                        'We booked a three-day trip to the coast.',
                        'Chúng tôi đặt chuyến đi biển ba ngày.',
                    ],
                ],
                [
                    'The company changed it’s policy.',
                    'The company changed its policy.',
                    'Its là từ sở hữu; it’s tương đương it is hoặc it has.',
                ],
                [
                    'The desk belongs to both students: it is the ___.',
                    ['students desk', 'students’ desk', 'student’s desks'],
                    1,
                    'Students số nhiều kết thúc bằng s: đặt dấu nháy sau s.',
                ],
            ),
            L(
                'basic-agreement',
                'Subject–verb agreement',
                'Hòa hợp chủ ngữ và động từ',
                'A2',
                'Chia động từ theo trung tâm của chủ ngữ thay vì danh từ đứng gần động từ nhất.',
                [
                    [
                        'Hiện tại đơn và be',
                        'Chủ ngữ ngôi ba số ít dùng động từ thêm -s/-es ở hiện tại đơn; be và have có dạng riêng. I và you có cách chia đặc biệt dù có thể chỉ một người.',
                        'She works. / They work. / You are ready.',
                    ],
                    [
                        'Cụm chen giữa',
                        'Cụm giới từ sau danh từ không làm đổi số của chủ ngữ chính. With, along with và as well as thường không tạo chủ ngữ ghép như and.',
                        'The box of cables is heavy.',
                    ],
                    [
                        'Bất định và chủ ngữ ghép',
                        'Everyone, someone, nobody và each thường dùng số ít. Hai chủ ngữ nối bằng and thường dùng số nhiều, trừ khi là một đơn vị ý nghĩa; both luôn đi với số nhiều trong mẫu thông thường.',
                        'Everyone needs a break. / Both options work.',
                    ],
                ],
                [
                    [
                        'Dự án',
                        'The list of requirements is on the shared drive.',
                        'Danh sách yêu cầu nằm trong ổ đĩa chung.',
                    ],
                    [
                        'Nhóm học',
                        'Everyone in the class has access to the materials.',
                        'Mọi người trong lớp đều truy cập được tài liệu.',
                    ],
                ],
                [
                    'The price of these tickets are high.',
                    'The price of these tickets is high.',
                    'Trung tâm chủ ngữ là price số ít, không phải tickets.',
                ],
                [
                    'Each of the documents ___ a signature.',
                    ['need', 'needs', 'are needing'],
                    1,
                    'Each là trung tâm số ít, nên dùng needs.',
                ],
            ),
        ],
    },
];
