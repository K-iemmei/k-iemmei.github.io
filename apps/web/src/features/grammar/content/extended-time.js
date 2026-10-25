import { unit as U } from './extended-builder.js';
export const units = {
    7: U(
        7,
        'Liên hệ một việc đã xảy ra với kết quả hiện tại; dùng have/has + quá khứ phân từ.|Just là vừa mới; already là đã rồi; yet thường dùng trong câu hỏi và phủ định với điều còn chờ.|Been to nói đã đi và về; gone to nói đã đi và hiện chưa về. Quá khứ đơn cũng có thể dùng cho tin mới, đặc biệt trong tiếng Anh Mỹ.',
        `
{person} [has completed~have completed] the {item}; it is ready now.|{person} đã hoàn tất {item}; giờ có thể dùng.|Chủ ngữ số ít cần has + V3.
{person} has [just~yet] sent the {item}.|{person} vừa gửi {item}.|Just đứng giữa has và phân từ.
{person} has not received the {item} [yet~already].|{person} vẫn chưa nhận được {item}.|Yet phù hợp điều còn chờ trong câu phủ định.
{person} has [gone~went] to {place} and is still there.|{person} đã đến {place} và vẫn ở đó.|Gone là phân từ của go, với nghĩa chưa về.
{person} has [been~gone] to {place} and is back now.|{person} đã đi {place} và nay đã về.|Been to nhấn mạnh đã đi và về.
Has {person} [checked~check] the {item} yet?|{person} đã kiểm tra {item} chưa?|Sau has trong thì hoàn thành cần phân từ.
`,
    ),
    8: U(
        8,
        'Nói về trải nghiệm và những việc xảy ra trong khoảng thời gian kéo dài đến hiện tại.|Dùng ever trong câu hỏi trải nghiệm, never cho chưa từng; không đi kèm mốc quá khứ đã kết thúc.|Sau This is the first time thường dùng hiện tại hoàn thành; today/this week có thể là khoảng đang tiếp diễn.',
        `
Has {person} [ever~never] worked in {place}?|{person} đã từng làm việc ở {place} chưa?|Ever hỏi về trải nghiệm tính đến nay.
{person} has [never~not never] used this {device}.|{person} chưa từng sử dụng {device} này.|Never đã mang nghĩa phủ định.
This is the first time {person} [has led~led] a workshop.|Đây là lần đầu {person} dẫn dắt hội thảo.|Cấu trúc first time hướng tới trải nghiệm đến hiện tại.
{person} [has sent~have sent] three reminders so far.|Tính đến nay {person} đã gửi ba lời nhắc.|So far và kết quả tích lũy phù hợp hiện tại hoàn thành.
{person} has visited {place} [twice~two time].|{person} đã đến {place} hai lần.|Twice diễn đạt số lần trải nghiệm.
{person} has [seen~saw] several improvements this week.|Tuần này {person} đã thấy nhiều cải tiến.|See có phân từ seen, không phải saw.
`,
    ),
    9: U(
        9,
        'Dùng have/has been + V-ing để diễn tả một hoạt động kéo dài hoặc dấu vết của hoạt động vừa dừng.|Nhấn mạnh quá trình và thời lượng; không nhất thiết khẳng định công việc đã hoàn tất.|Động từ trạng thái như know thường dùng dạng hoàn thành đơn; không chọn thì chỉ bằng một từ khóa.',
        `
{person} has been [reviewing~reviewed] the {item} all morning.|{person} đã xem xét {item} suốt buổi sáng.|Been + V-ing diễn tả quá trình kéo dài.
{person} [has been waiting~have been waiting] for an hour.|{person} đã đợi một giờ rồi.|Tên người số ít đi với has been.
Why [has~have] {person} been calling repeatedly?|Sao {person} gọi đi gọi lại vậy?|Câu hỏi đảo has trước chủ ngữ số ít.
{person} is tired because she has been [travelling~travel] all day.|{person} mệt vì đã đi lại suốt ngày.|Quá trình trước đó giải thích tình trạng hiện tại.
{person} has not [been sleeping~being sleeping] well recently.|Dạo này {person} ngủ không ngon.|Cụm đúng là have/has been sleeping.
How long has {person} [been learning~learning] Spanish?|{person} học tiếng Tây Ban Nha được bao lâu rồi?|Hoàn thành tiếp diễn cần been trước learning.
`,
    ),
    10: U(
        10,
        'Phân biệt kết quả hoàn tất với quá trình đang hoặc vừa diễn ra.|How many/how much thường nhấn mạnh lượng kết quả; how long thường nhấn mạnh quá trình.|Know và believe ở nghĩa trạng thái thường dùng hoàn thành đơn; live/work đôi khi dùng được cả hai dạng tùy trọng tâm.',
        `
{person} has [written~been written] the {item}; here is the finished version.|{person} đã viết xong {item}; đây là bản hoàn tất.|Written diễn tả kết quả; been written ở đây thành bị động sai chủ thể.
{person} has been [writing~written] the {item} for two hours.|{person} đã viết {item} hai giờ rồi.|Been writing nhấn mạnh thời lượng hoạt động.
How many emails has {person} [sent~been sending them]?|{person} đã gửi bao nhiêu email?|Hỏi số kết quả với has sent.
{person} has [known~been knowing] the supplier for years.|{person} đã quen nhà cung cấp nhiều năm.|Know là trạng thái trong ngữ cảnh này.
{person} [has been trying~has trying] to repair the {device}.|{person} vẫn đang cố sửa {device}.|Hoàn thành tiếp diễn cần been.
{person} has [finished~been finishing completely] the {item}, so no more work is needed.|{person} đã hoàn tất {item}, không cần làm thêm.|Kết quả hoàn tất được nêu rõ.
`,
    ),
    11: U(
        11,
        'Hỏi và trả lời về trạng thái hoặc hoạt động bắt đầu trong quá khứ và còn tiếp tục.|Dùng How long have/has ...? thay vì hiện tại đơn khi hỏi thời lượng đến hiện tại.|Dùng hoàn thành đơn với know/be; hoàn thành tiếp diễn với nhiều hoạt động. Câu hỏi when bắt đầu thường dùng quá khứ đơn.',
        `
How long has {person} [worked~work] here?|{person} làm ở đây được bao lâu rồi?|Has cần phân từ; worked dùng được cho thời lượng công việc.
{person} has [been~being] a team leader since June.|{person} làm trưởng nhóm từ tháng Sáu đến nay.|Be có phân từ been.
How long has {person} [known~been knowing] the client?|{person} đã biết khách hàng được bao lâu?|Know chỉ trạng thái nên thường không dùng tiếp diễn.
{person} has been [using~use] this {device} for years.|{person} đã dùng {device} này nhiều năm.|Quá trình kéo dài tới hiện tại.
When [did~has] {person} start the course?|{person} bắt đầu khóa học khi nào?|Start là sự kiện bắt đầu; hỏi mốc quá khứ bằng did.
{person} has not [visited~visit] {place} for a long time.|Đã lâu {person} chưa đến {place}.|Has not + phân từ cho khoảng kéo dài đến nay.
`,
    ),
    12: U(
        12,
        'Dùng for cho độ dài và since cho mốc bắt đầu; phân biệt when với how long.|For two weeks là khoảng thời gian; since Monday là từ một mốc. Không thêm for trước all day/all my life.|When did ...? hỏi lúc bắt đầu; How long have ...? hỏi tổng thời gian tới nay.',
        `
{person} has worked here [for~since] three months.|{person} đã làm ở đây ba tháng.|Three months là độ dài.
{person} has lived in {place} [since~for] 2022.|{person} sống ở {place} từ năm 2022.|2022 là mốc bắt đầu.
How [long~when] has {person} owned this {device}?|{person} có {device} này được bao lâu rồi?|How long hỏi thời lượng.
When [did~has] {person} move to {place}?|{person} chuyển đến {place} khi nào?|When hỏi mốc sự kiện đã xảy ra.
{person} has been busy [—~for] all day.|{person} đã bận suốt cả ngày.|Không thêm for trước all day.
It has been two weeks [since~for] {person} sent the {item}.|Đã hai tuần từ khi {person} gửi {item}.|Since mở mốc bắt đầu của khoảng thời gian.
`,
    ),
    13: U(
        13,
        'Phân biệt tin mới có liên hệ hiện tại và lời kể chi tiết về quá khứ.|Hiện tại hoàn thành có thể báo một kết quả mới; khi chuyển sang hỏi thời điểm hoặc diễn biến đã qua, dùng quá khứ đơn.|Không suy ra rằng mọi sự kiện gần đây đều bắt buộc dùng hiện tại hoàn thành; ngữ cảnh và biến thể tiếng Anh có vai trò.',
        `
{person} [has lost~have lost] the key and cannot enter now.|{person} làm mất chìa khóa nên giờ không vào được.|Chủ ngữ số ít dùng has; kết quả còn hiện tại.
When [did~has] {person} lose the key?|{person} làm mất chìa khóa khi nào?|When hỏi một mốc quá khứ.
{person} [found~has found yesterday] the key yesterday.|Hôm qua {person} tìm thấy chìa khóa.|Yesterday là thời gian đã kết thúc.
{person} has [repaired~repair] the {device}; it works now.|{person} sửa xong {device}; giờ máy chạy được.|Has + phân từ nêu kết quả hiện tại.
What time [did~has] {person} finish the {item}?|{person} hoàn tất {item} lúc mấy giờ?|Hỏi thời điểm đã hoàn thành bằng did.
{person} [sent~has sent last night] the {item} last night.|Tối qua {person} đã gửi {item}.|Last night đi với quá khứ đơn trong câu này.
`,
    ),
    14: U(
        14,
        'Chọn thì theo khoảng thời gian còn mở hay đã kết thúc.|Yesterday, last year và in 2020 là các khoảng/mốc quá khứ đã kết thúc; up to now và so far kéo đến hiện tại.|Today/this morning phụ thuộc thời điểm và góc nhìn của người nói, không phải dấu hiệu cứng của một thì.',
        `
{person} [visited~has visited] {place} in 2020.|{person} đến {place} năm 2020.|Mốc năm đã kết thúc dùng quá khứ đơn.
{person} [has completed~have completed] four tasks so far today.|Tính đến giờ hôm nay {person} đã xong bốn việc.|Tổng kết quả kéo tới hiện tại.
{person} [did not attend~has not attended yesterday] the meeting yesterday.|Hôm qua {person} không dự cuộc họp.|Yesterday cần dạng quá khứ.
Has {person} [checked~check] the {item} today?|Hôm nay {person} kiểm tra {item} chưa?|Has cần phân từ.
{person} [worked~has worked last week] from home last week.|Tuần trước {person} làm ở nhà.|Khoảng last week đã kết thúc.
{person} has [never~not never] visited {place}.|{person} chưa từng đến {place}.|Never diễn tả trải nghiệm đến nay, không thêm not.
`,
    ),
    15: U(
        15,
        'Dùng had + V3 cho sự việc có trước một mốc quá khứ khác.|Quá khứ hoàn thành giúp nhìn ngược từ một thời điểm đã qua; không dùng chỉ vì sự kiện rất xa.|Khi thứ tự đã rõ, quá khứ đơn đôi khi đủ. Dùng had để nhấn mạnh quan hệ xảy ra trước.',
        `
When {person} arrived, the meeting [had started~has started] already.|Khi {person} đến thì cuộc họp đã bắt đầu.|Nhìn ngược từ lúc đến trong quá khứ.
{person} [had saved~had save] the {item} before the power failed.|{person} đã lưu {item} trước khi mất điện.|Had đi với phân từ saved.
{person} could not enter because she [had forgotten~has forgotten] the code.|{person} không vào được vì trước đó đã quên mã.|Nguyên nhân có trước sự việc quá khứ.
Had {person} [used~use] this {device} before that day?|Trước ngày đó {person} đã dùng {device} này chưa?|Câu hỏi quá khứ hoàn thành: had + chủ ngữ + V3.
{person} realised that she [had sent~had send] the wrong {item}.|{person} nhận ra mình đã gửi nhầm {item}.|Việc gửi xảy ra trước khi nhận ra.
By the time {person} called, we [had left~have left].|Lúc {person} gọi thì chúng tôi đã rời đi.|Mốc kể chuyện ở quá khứ, dùng had left.
`,
    ),
    16: U(
        16,
        'Dùng had been + V-ing để nói quá trình kéo dài trước một thời điểm quá khứ.|Đối chiếu was doing tại một mốc với had been doing trước mốc đó; dạng hoàn thành nhấn thời lượng tích lũy.|Động từ trạng thái như know thường vẫn dùng had known, không had been knowing.',
        `
{person} was tired because she [had been travelling~has been travelling] all night.|{person} mệt vì đã đi lại suốt đêm trước đó.|Quá trình nằm trước tình trạng quá khứ.
{person} had been [waiting~waited] for an hour when the bus came.|{person} đã đợi một giờ thì xe buýt đến.|Had been cần V-ing.
How long had {person} [been working~working] there before moving?|Trước khi chuyển đi {person} đã làm ở đó bao lâu?|Cần been trong hoàn thành tiếp diễn.
{person} [had known~had been knowing] the manager for years before joining.|{person} đã biết quản lý nhiều năm trước khi gia nhập.|Know ở nghĩa trạng thái dùng had known.
The floor was wet because {person} had been [cleaning~cleaned] it.|Sàn ướt vì trước đó {person} vừa lau.|Hoạt động trước đó giải thích dấu vết quá khứ.
{person} [had not been sleeping~had not being sleeping] well before the exam.|Trước kỳ thi {person} đã ngủ không ngon.|Cụm đúng là had not been sleeping.
`,
    ),
    17: U(
        17,
        'Phân biệt have/have got ở nghĩa sở hữu và have trong hoạt động.|Have got và have tương đương trong nhiều câu sở hữu; câu hỏi tương ứng là Have you got ...? hoặc Do you have ...?|Have lunch/a break là hoạt động, không thay bằng have got lunch để diễn tả đang ăn. Sở hữu thường không dùng tiếp diễn.',
        `
{person} [has got~have got] a spare {device}.|{person} có một {device} dự phòng.|Tên người số ít dùng has got.
Does {person} [have~has] a spare key?|{person} có chìa khóa dự phòng không?|Sau does dùng have.
Has {person} [got~get] a copy of the {item}?|{person} có bản sao {item} không?|Câu hỏi sở hữu với has got.
{person} is [having~having got] lunch with a client.|{person} đang ăn trưa với khách hàng.|Have lunch là hoạt động.
{person} [had~had got yesterday] a headache yesterday.|Hôm qua {person} bị đau đầu.|Had diễn tả tình trạng quá khứ.
{person} does not [have~has] enough time.|{person} không có đủ thời gian.|Does not + nguyên mẫu have.
`,
    ),
    18: U(
        18,
        'Dùng used to + nguyên mẫu cho thói quen hoặc trạng thái trong quá khứ nay đã đổi.|Sau did/didn’t thường viết use to; used to không có dạng hiện tại mang nghĩa thói quen.|Be used to + danh từ/V-ing nghĩa quen với, khác used to do nghĩa đã từng thường làm.',
        `
{person} used to [work~working] in {place}.|{person} trước kia thường làm ở {place}.|Used to đi với nguyên mẫu.
Did {person} [use~used] to cycle to work?|Trước kia {person} có thường đạp xe đi làm không?|Dạng chuẩn trong bài là did + use to.
{person} did not [use~used] to own a {device}.|Trước kia {person} chưa có {device}.|Did not đã mang dấu quá khứ.
{person} is used to [working~work] late now.|Bây giờ {person} quen làm việc muộn.|Be used to cần V-ing hoặc danh từ.
{person} [used to live~use to lives] near the station.|Trước kia {person} sống gần nhà ga.|Used to có thể diễn tả trạng thái cũ.
{person} usually [walks~used to walks] to work these days.|Dạo này {person} thường đi bộ đi làm.|Thói quen hiện tại dùng hiện tại đơn.
`,
    ),
    19: U(
        19,
        'Dùng hiện tại tiếp diễn cho sắp xếp cá nhân và hiện tại đơn cho lịch trình cố định.|Mốc tương lai làm rõ rằng am/is/are doing đang nói về kế hoạch đã thu xếp.|Không phải mọi câu tương lai đều cần will; lịch tàu và chương trình thường dùng thì đơn.',
        `
{person} [is meeting~is meet] the client tomorrow.|{person} sẽ gặp khách hàng ngày mai theo lịch hẹn.|Sắp xếp đã có dùng is meeting.
{person} says the train [leaves~leave] at six tomorrow.|{person} nói tàu khởi hành lúc sáu giờ ngày mai.|Lịch tàu cố định; chủ ngữ train số ít.
What time [is~does] {person} leaving tomorrow?|Ngày mai {person} sẽ rời đi lúc mấy giờ?|Leaving cần be trong sắp xếp tương lai.
{person} [is not working~not is working] next Monday.|Thứ Hai tới {person} không đi làm theo lịch.|Not đứng sau is.
{person} says the course [starts~start] next week.|{person} nói khóa học bắt đầu tuần tới.|Chương trình cố định dùng starts.
{person} and I [are having~is having] dinner with our tutor tonight.|Tối nay tôi và {person} sẽ ăn tối với gia sư.|Chủ ngữ ghép dùng are having.
`,
    ),
    20: U(
        20,
        'Dùng be going to cho ý định đã có và dự đoán dựa trên bằng chứng hiện tại.|Going to không nhất thiết là kế hoạch đã có lịch hẹn như tiếp diễn; chú ý am/is/are.|Was/were going to có thể diễn tả ý định trước đây không thành hiện thực.',
        `
{person} [is going to~is going] review the {item} tomorrow.|{person} định xem {item} ngày mai.|Be going to + nguyên mẫu.
{person} and I [are going to~is going to] start a club.|Tôi và {person} định lập một câu lạc bộ.|Chủ ngữ ghép cần are.
Look at those clouds, {person}; it [is going to~going to] rain.|Nhìn mây kìa {person}; trời sắp mưa.|Dự đoán có bằng chứng hiện tại vẫn cần is.
{person} was going to [call~called] but lost the number.|{person} đã định gọi nhưng làm mất số.|Sau was going to dùng nguyên mẫu.
What is {person} going to [do~doing] about the delay?|{person} định xử lý sự chậm trễ thế nào?|Going to đi với do.
{person} [is not going to~does not going to] buy that {device}.|{person} không định mua {device} đó.|Phủ định đặt not sau be.
`,
    ),
    21: U(
        21,
        'Dùng will cho quyết định ngay lúc nói, lời đề nghị, hứa hẹn hoặc từ chối.|I’ll có thể phản ứng ngay với nhu cầu; won’t có thể diễn tả không chịu làm.|Shall I/we ...? thường dùng hỏi đề nghị hoặc xin ý kiến; không dùng thì đơn thay cho lời hứa tức thời.',
        `
The phone is ringing; {person} says, I [will answer~answer] it.|Điện thoại reo; {person} nói tôi sẽ nghe máy.|Quyết định ngay lúc nói dùng will.
Shall [we~us] start now, {person}?|Mình bắt đầu bây giờ nhé {person}?|Sau shall cần chủ ngữ we.
{person} promises she [will send~will sends] the {item}.|{person} hứa sẽ gửi {item}.|Sau will dùng nguyên mẫu send.
{person} says the {device} [will not~does not will] turn on.|{person} nói {device} nhất quyết không bật.|Phủ định của will là will not.
Shall I [carry~carrying] that bag for you, {person}?|Để tôi mang túi giúp bạn nhé {person}?|Shall I + nguyên mẫu để đề nghị.
Do not worry, {person}; I [will help~will to help] you.|Đừng lo {person}; tôi sẽ giúp bạn.|Will không cần to trước động từ.
`,
    ),
    22: U(
        22,
        'Dùng will cho điều dự đoán, tin tưởng hoặc biết về tương lai.|Các cụm I think, probably, I’m sure giúp nêu độ chắc chắn, không biến dự đoán thành sự thật tuyệt đối.|Shall trong lời trần thuật chủ yếu với I/we và mang phong cách trang trọng; will phổ biến hơn.',
        `
{person} thinks the new {device} [will last~will lasts] longer.|{person} nghĩ {device} mới sẽ bền hơn.|Will đi với nguyên mẫu.
{person} [will probably~probably will to] arrive after lunch.|Có lẽ {person} sẽ đến sau bữa trưa.|Probably thường đứng giữa will và động từ.
I am sure {person} [will enjoy~will enjoying] the course.|Tôi chắc {person} sẽ thích khóa học.|Dự đoán dùng will enjoy.
Do you think {person} [will agree~will agrees]?|Bạn nghĩ {person} sẽ đồng ý không?|Mệnh đề sau think dùng will agree.
{person} says it [will not~does not will] be easy.|{person} nói việc đó sẽ không dễ.|Will not + be.
{person} and I [will be~will are] ready by noon.|Tôi và {person} sẽ sẵn sàng trước trưa.|Sau will dùng be, không are.
`,
    ),
    23: U(
        23,
        'Phân biệt will cho quyết định ngay lúc nói và going to cho ý định đã có.|Bằng chứng hiện tại thường gợi going to; dự đoán thông thường có thể dùng cả hai tùy góc nhìn.|Không coi will và going to luôn loại trừ nhau; cần hiểu tình huống giao tiếp.',
        `
{person} has already decided: she [is going to~going to] study abroad.|{person} đã quyết định sẽ du học.|Ý định đã có cần be going to.
This bag is heavy; {person} says, I [will carry~will carrying] it.|Túi nặng; {person} nói tôi sẽ mang giúp.|Phản ứng tức thời dùng will carry.
{person}, watch that cup! It [is going to~is going] fall.|{person}, coi chừng cái cốc sắp rơi!|Bằng chứng ngay trước mắt; cấu trúc cần to.
{person} [will~wills] probably call later.|Có lẽ {person} sẽ gọi sau.|Will không thêm s với chủ ngữ số ít.
{person} is going to [replace~replaced] the {device}.|{person} định thay {device}.|Sau going to là nguyên mẫu.
{person} promises she [will not~will not to] forget.|{person} hứa sẽ không quên.|Will not không đi với to.
`,
    ),
    24: U(
        24,
        'Dùng will be doing cho hoạt động tại mốc tương lai và will have done cho kết quả trước một hạn.|Tiếp diễn tương lai nói quá trình; hoàn thành tương lai nhìn lại từ mốc tương lai.|By thường chỉ hạn hoàn tất; at có thể chỉ lúc hoạt động đang diễn ra. Ngữ cảnh vẫn quyết định ý nghĩa.',
        `
At ten tomorrow, {person} will be [presenting~presented] the {item}.|Lúc mười giờ ngày mai {person} sẽ đang trình bày {item}.|Will be cần V-ing cho hoạt động đang diễn ra.
By Friday, {person} will have [finished~finish] the {item}.|Đến thứ Sáu {person} sẽ hoàn tất {item}.|Will have + phân từ.
Will {person} [be using~be use] the {device} at noon?|Trưa mai {person} sẽ đang dùng {device} chứ?|Tiếp diễn tương lai dùng be using.
{person} will have [left~leave] before we arrive.|{person} sẽ rời đi trước khi chúng tôi đến.|Leave có phân từ left.
This time next week, {person} [will be travelling~will be travel] to {place}.|Giờ này tuần tới {person} sẽ đang đi {place}.|Mô tả hoạt động tại mốc tương lai.
By June, {person} [will have worked~will has worked] here for five years.|Đến tháng Sáu {person} sẽ làm ở đây được năm năm.|Will have không đổi thành has.
`,
    ),
    25: U(
        25,
        'Trong mệnh đề thời gian tương lai sau when/as soon as/until, thường dùng hiện tại, không will.|Hiện tại hoàn thành có thể nhấn rằng việc thứ nhất xong trước việc thứ hai.|If nói điều có thể xảy ra; when nói thời điểm của điều được xem là sẽ xảy ra.',
        `
{person} will call when she [arrives~will arrives] in {place}.|{person} sẽ gọi khi đến {place}.|Mệnh đề thời gian dùng hiện tại đơn.
I will wait until {person} [has finished~will has finished] the {item}.|Tôi sẽ đợi đến khi {person} xong {item}.|Hoàn thành hiện tại nhấn việc hoàn tất trước.
As soon as {person} [gets~will gets] home, we will eat.|Ngay khi {person} về nhà, chúng tôi sẽ ăn.|Sau as soon as dùng gets.
{person} will help if she [has~will has] time.|{person} sẽ giúp nếu có thời gian.|Điều kiện có thể xảy ra dùng hiện tại đơn.
{person} will not leave before she [checks~will checks] the {device}.|{person} sẽ không đi trước khi kiểm tra {device}.|Before mở mệnh đề thời gian tương lai dùng hiện tại.
If it [rains~will rains], {person} will stay inside.|Nếu trời mưa thì {person} sẽ ở trong nhà.|Không dùng will rains trong điều kiện thông thường.
`,
    ),
    26: U(
        26,
        'Dùng can/could/be able to diễn tả khả năng; chọn cấu trúc phù hợp với thì.|Could thường nói khả năng chung trong quá khứ; was able to/managed to thường nói một lần đã làm được.|Sau một modal khác hoặc trong hoàn thành, cần be able to thay vì hai modal liền nhau.',
        `
{person} can [repair~to repair] the {device}.|{person} có thể sửa {device}.|Can đi với nguyên mẫu không to.
{person} will be [able to~can] attend tomorrow.|{person} sẽ có thể tham dự ngày mai.|Không xếp will và can cạnh nhau.
{person} [could~can yesterday] swim when she was six.|{person} biết bơi khi sáu tuổi.|Khả năng chung trong quá khứ dùng could.
Despite the lock, {person} managed [to open~open] the door.|Dù khóa bị kẹt, {person} đã mở được cửa.|Managed to nhấn một lần thành công.
{person} has been [able to~can] work again since Monday.|{person} đã có thể làm việc lại từ thứ Hai.|Sau has been dùng able to.
{person} could not [hear~heard] the announcement.|{person} đã không nghe được thông báo.|Sau could not dùng hear.
`,
    ),
    27: U(
        27,
        'Could do diễn tả khả năng, gợi ý hoặc một điều có thể xảy ra; could have done nhìn về quá khứ.|Could have có thể nói cơ hội đã không được dùng hoặc suy đoán, tùy câu.|Couldn’t do khác couldn’t have done: dạng sau thường phủ nhận khả năng xảy ra trong quá khứ.',
        `
{person} could [join~to join] the workshop next week.|{person} có thể tham gia hội thảo tuần tới.|Could + nguyên mẫu.
{person} could have [taken~took] the earlier train.|{person} đã có thể đi chuyến tàu sớm hơn.|Have cần phân từ taken.
{person} could not have [written~wrote] that {item}; she was away.|{person} không thể đã viết {item} đó vì vắng mặt.|Could not have + phân từ để suy luận quá khứ.
We could [ask~asking] {person} for advice.|Chúng ta có thể hỏi {person} để xin lời khuyên.|Could có thể đưa ra gợi ý.
{person} was lucky; she could have [been~being] injured.|{person} may mắn vì đã có thể bị thương.|Could have been chỉ khả năng đã không thành hiện thực.
{person} could not [find~found] the missing {item}.|{person} đã không tìm thấy {item} bị mất.|Could not + nguyên mẫu cho sự không làm được.
`,
    ),
    28: U(
        28,
        'Dùng must và can’t cho suy luận chắc chắn theo bằng chứng, không phải nghĩa bắt buộc hay cấm.|Must be/must have done suy luận điều có hoặc đã có; can’t be/can’t have done phủ nhận khả năng.|Mustn’t nghĩa không được phép, không phải dạng phủ định thông thường của suy luận must.',
        `
{person} has worked all night; she [must~must to] be tired.|{person} làm cả đêm; chắc hẳn rất mệt.|Must + be là suy luận từ bằng chứng.
{person} [cannot~must not to] be at home; she is here.|{person} không thể ở nhà vì đang ở đây.|Cannot be phủ nhận khả năng.
{person} must have [forgotten~forgot] the meeting.|Chắc {person} đã quên cuộc họp.|Have cần phân từ forgotten.
{person} cannot have [sent~send] the {item}; the network was down.|{person} không thể đã gửi {item} vì mạng hỏng.|Cannot have + phân từ.
The lights are on; {person} must [be working~working] inside.|Đèn sáng; chắc {person} đang làm bên trong.|Must be + V-ing cho suy luận hoạt động.
{person} must [have been~has been] relieved when it ended.|Chắc {person} đã nhẹ nhõm khi việc kết thúc.|Sau must dùng have, không has.
`,
    ),
    29: U(
        29,
        'Dùng may/might cho khả năng chưa chắc chắn ở hiện tại hoặc quá khứ.|May/might have done nói khả năng đã xảy ra; may not/might not là có thể không.|Couldn’t thường phủ nhận khả năng, mạnh hơn might not; đừng dịch hai dạng thành cùng một mức chắc chắn.',
        `
{person} [might be~might to be] in a meeting.|Có thể {person} đang họp.|Might + be cho khả năng chưa chắc.
{person} may have [missed~miss] the train.|Có thể {person} đã lỡ tàu.|May have + phân từ.
{person} might not [know~knows] the password.|Có thể {person} không biết mật khẩu.|Might not + nguyên mẫu.
{person} may [be using~using] the {device} now.|Có thể {person} đang dùng {device}.|May be + V-ing.
{person} might have [been~being] asleep when we called.|Có thể {person} đã ngủ lúc chúng tôi gọi.|Have been nói khả năng quá khứ.
{person} may not have [received~receive] the {item}.|Có thể {person} chưa nhận được {item}.|Phủ định khả năng quá khứ: may not have + V3.
`,
    ),
    30: U(
        30,
        'Dùng may/might cho kế hoạch hoặc khả năng tương lai chưa chắc.|Might thường phù hợp tình huống giả định không có thật; may/might be doing nói kế hoạch có thể xảy ra.|Might as well/may as well là làm một việc vì không có lựa chọn tốt hơn, không phải có lẽ cũng làm.',
        `
{person} might [visit~visits] {place} next month.|Có thể {person} sẽ thăm {place} tháng tới.|Modal đi với nguyên mẫu.
{person} may [be working~be work] remotely tomorrow.|Có thể ngày mai {person} sẽ làm từ xa.|May be + V-ing cho kế hoạch chưa chắc.
If the fee were lower, {person} [might~may to] join.|Nếu phí thấp hơn thì có lẽ {person} sẽ tham gia.|Might phù hợp điều kiện giả định.
There is no bus, so {person} might as well [walk~to walk].|Không có xe buýt nên {person} đi bộ cũng được.|Might as well + nguyên mẫu.
{person} may not [come~comes] tomorrow.|Có thể {person} sẽ không đến ngày mai.|May not diễn tả khả năng không xảy ra.
{person} might have to [stay~stayed] late.|Có thể {person} sẽ phải ở lại muộn.|Sau have to dùng nguyên mẫu.
`,
    ),
    31: U(
        31,
        'Dùng have to và must cho sự cần thiết; phân biệt nghĩa phủ định.|Don’t have to là không cần, mustn’t là không được; không hoán đổi hai dạng.|Quá khứ thường dùng had to; tương lai có will have to. Must thường thể hiện yêu cầu hoặc nhận định của người nói.',
        `
{person} [has to~have to] wear a visitor badge.|{person} phải đeo thẻ khách.|Ngôi ba số ít dùng has to.
Does {person} [have to~has to] attend?|{person} có bắt buộc tham dự không?|Sau does dùng have to.
{person} [had to~musted] work late yesterday.|Hôm qua {person} đã phải làm muộn.|Quá khứ của sự cần thiết dùng had to.
{person} does not have to [pay~pays]; admission is free.|{person} không cần trả tiền vì được vào miễn phí.|Không cần khác bị cấm.
{person} must not [share~shares] the password.|{person} không được chia sẻ mật khẩu.|Must not là cấm, sau nó dùng share.
{person} will [have to~must to] replace the {device}.|{person} sẽ phải thay {device}.|Sau will dùng have to.
`,
    ),
    32: U(
        32,
        'Phân biệt must, mustn’t và needn’t theo nghĩa cần thiết, cấm và không cần.|Needn’t + nguyên mẫu tương đương don’t need to trong nhiều tình huống.|Needn’t have done nói việc đã làm nhưng không cần; didn’t need to không tự khẳng định việc có xảy ra hay không.',
        `
{person} [must~must to] submit the {item} today.|{person} phải nộp {item} hôm nay.|Must + nguyên mẫu cho việc cần làm.
{person} [must not~need not] enter; this area is forbidden.|{person} không được vào vì khu vực bị cấm.|Cấm dùng must not, không phải không cần.
{person} [need not~must not] print it; a digital copy is enough.|{person} không cần in vì bản điện tử là đủ.|Need not nghĩa không cần.
{person} need not have [bought~buy] another {device}; we had a spare.|{person} đã mua {device} khác dù không cần vì đã có máy dự phòng.|Need not have + V3 nói việc đã làm thừa.
{person} does not need [to bring~bring] lunch.|{person} không cần mang bữa trưa.|Need dạng động từ thường có to.
{person} need not [wait~to wait] outside.|{person} không cần đợi bên ngoài.|Needn’t dạng modal không có to.
`,
    ),
    33: U(
        33,
        'Dùng should/ought to để khuyên, nêu kỳ vọng hoặc đánh giá việc nên làm.|Should have done nhìn lại việc đáng lẽ nên làm; shouldn’t have done đánh giá việc đã làm là không nên.|Should thường nhẹ hơn must và không đồng nghĩa với một nghĩa vụ bắt buộc.',
        `
{person} should [check~to check] the {item} first.|{person} nên kiểm tra {item} trước.|Should + nguyên mẫu.
{person} ought [to rest~rest] after the journey.|{person} nên nghỉ sau chuyến đi.|Ought cần to.
{person} should have [saved~save] the {item} earlier.|Đáng lẽ {person} nên lưu {item} sớm hơn.|Should have + V3 nhìn về quá khứ.
{person} should not have [shared~share] that private message.|Đáng lẽ {person} không nên chia sẻ tin nhắn riêng đó.|Phê bình việc đã xảy ra bằng should not have.
The train should [arrive~arrives] soon, {person}.|Chắc tàu sẽ sớm đến theo dự kiến, {person}.|Should diễn tả kỳ vọng và dùng nguyên mẫu.
Should {person} [contact~contacts] the supplier?|{person} có nên liên hệ nhà cung cấp không?|Câu hỏi should + chủ ngữ + nguyên mẫu.
`,
    ),
    34: U(
        34,
        'Dùng should trong mệnh đề đề xuất, yêu cầu hoặc phản ứng đáng chú ý.|Suggest that someone should do cũng có dạng giả định someone do; không dùng suggest someone to do.|If ... should hoặc Should ... diễn tả điều có thể xảy ra, thường mang phong cách trang trọng.',
        `
{person} suggested that we [should leave~should to leave] early.|{person} đề nghị chúng tôi nên đi sớm.|Should + nguyên mẫu trong mệnh đề đề xuất.
{person} recommended that the {item} [be~is to be to] revised.|{person} khuyến nghị chỉnh lại {item}.|Dạng giả định dùng be sau recommended that.
{person} suggested [taking~to take] a break.|{person} đề nghị nghỉ một lát.|Suggest có thể đi với V-ing, không to do.
If {person} should [call~calls], take a message.|Nếu {person} có gọi thì ghi lời nhắn giúp.|Sau should dùng nguyên mẫu.
Should {person} [need~needs] assistance, contact reception.|Nếu {person} cần hỗ trợ thì liên hệ lễ tân.|Đảo should thay cho if trong cách viết trang trọng.
It is surprising that {person} should [say~said] that.|Thật ngạc nhiên khi {person} lại nói vậy.|Should biểu thị phản ứng, không phải lời khuyên.
`,
    ),
    35: U(
        35,
        'Had better + nguyên mẫu khuyên hành động cụ thể để tránh hậu quả.|It’s time + chủ ngữ + quá khứ có nghĩa đã đến lúc nên làm bây giờ.|Had better không dùng to; dạng phủ định là had better not. Không dùng cho mọi lời khuyên chung.',
        `
{person} had better [leave~to leave] now or miss the bus.|{person} nên đi ngay kẻo lỡ xe.|Had better + nguyên mẫu.
{person} had better [not forget~do not forget] the key.|{person} tốt hơn là đừng quên chìa khóa.|Not đứng sau had better.
It is time {person} [went~goes] home.|Đã đến lúc {person} nên về nhà.|Cấu trúc it is time + quá khứ mang nghĩa hiện tại.
It is time for {person} [to leave~leave].|Đã đến lúc {person} phải đi.|Time for someone + to-infinitive.
{person} had better [check~checked] the {device}.|{person} nên kiểm tra {device} ngay.|Had ở đây không làm động từ sau thành quá khứ.
It is about time {person} [started~starts] the {item}.|Đã đến lúc {person} bắt đầu {item} rồi.|About time + quá khứ biểu thị việc nên làm ngay.
`,
    ),
    36: U(
        36,
        'Dùng would cho tình huống tưởng tượng, lời tường thuật về tương lai hoặc thói quen cũ.|Would have + V3 nói kết quả giả định trong quá khứ; không thay bằng would + quá khứ.|Would cho thói quen cũ thường hợp hành động lặp lại hơn trạng thái; used to diễn tả được cả hai.',
        `
{person} would [help~helps] if she had time.|{person} sẽ giúp nếu có thời gian.|Would + nguyên mẫu trong giả định.
{person} would have [joined~join] if she had known.|{person} đã có thể tham gia nếu biết trước.|Would have + phân từ.
{person} said she [would~will to] call later.|{person} nói sẽ gọi sau.|Would là tương lai nhìn từ lời nói quá khứ.
Every summer, {person} would [visit~visited] her aunt.|Hè nào trước kia {person} cũng thăm dì.|Would có thể kể hành động lặp lại.
{person} [used to own~would own permanently] a small shop.|Trước kia {person} từng sở hữu một cửa hàng nhỏ.|Trạng thái sở hữu cũ phù hợp used to.
{person} would not [accept~accepted] the offer.|{person} nhất quyết không chấp nhận đề nghị.|Would not + nguyên mẫu có thể nói sự từ chối.
`,
    ),
    37: U(
        37,
        'Đưa ra yêu cầu, xin phép, mời hoặc đề nghị giúp bằng can/could/would và các mẫu liên quan.|Could you ...? thường lịch sự hơn can you; would you like ...? là lời mời hoặc đề nghị.|Do you mind + V-ing; would you mind if + quá khứ là cách xin phép lịch sự, không phải câu chuyện quá khứ.',
        `
Could {person} [send~to send] the {item}, please?|Nhờ {person} gửi {item} được không?|Could you/someone + nguyên mẫu cho yêu cầu.
Would {person} like [to join~joining] us for lunch?|{person} có muốn ăn trưa cùng không?|Would like + to-infinitive.
Can I [borrow~to borrow] your {device}, {person}?|Tôi mượn {device} của bạn được không, {person}?|Can I + nguyên mẫu để xin phép.
Would you mind [helping~to help] {person}?|Bạn có phiền giúp {person} không?|Mind đi với V-ing.
Would you mind if {person} [sat~sits to] here?|Bạn có phiền nếu {person} ngồi đây không?|If + quá khứ trong xin phép lịch sự.
Shall we [invite~inviting] {person} too?|Mình mời cả {person} nữa nhé?|Shall we + nguyên mẫu đề xuất việc cùng làm.
`,
    ),
};
