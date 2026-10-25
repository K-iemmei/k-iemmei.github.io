import { unit as U } from './extended-builder.js';
export const units = {
    121: U(
        121,
        'Chọn at/on/in cho thời gian: giờ, ngày, tháng/năm và các cụm cố định.|At six, on Monday, in June; on Monday morning khác in the morning. Không thêm giới từ trước last/next/this/every thông thường.|In two hours có thể nghĩa sau hai giờ; thời điểm cụ thể trong ngày và cụm cố định cần được phân biệt.',
        `
{person} starts work [at~on] nine.|{person} bắt đầu làm lúc chín giờ.|At + giờ.
{person} leaves [on~in] Monday.|{person} rời đi vào thứ Hai.|On + ngày.
{person} was born [in~at] June.|{person} sinh vào tháng Sáu.|In + tháng.
{person} is coming [—~on] next Friday.|{person} sẽ đến thứ Sáu tới.|Không dùng on trước next Friday trong mẫu này.
{person} called [on~in] Monday morning.|{person} gọi vào sáng thứ Hai.|Ngày kèm buổi dùng on.
{person} will be ready [in~at] two hours.|Sau hai giờ {person} sẽ sẵn sàng.|In + khoảng thời gian có thể chỉ sau bao lâu.
`,
    ),
    122: U(
        122,
        'On time nghĩa đúng lịch; in time nghĩa kịp trước khi quá muộn.|At the end of chỉ vị trí/thời điểm cuối của một việc; in the end nói kết quả cuối cùng.|Just in time là vừa kịp; không dùng in the end of January để chỉ cuối tháng.',
        `
The train carrying {person} arrived [on time~in the time], exactly as scheduled.|Chuyến tàu chở {person} đến đúng lịch.|On time chỉ đúng giờ quy định.
{person} arrived [in time~on the time] to catch the bus.|{person} đến kịp để bắt xe.|In time to do nói còn kịp trước khi quá muộn.
{person} spoke [at~in] the end of the meeting.|{person} nói vào cuối cuộc họp.|At the end of + sự kiện.
{person} tried several routes; [in the end~at the end of], she walked.|{person} thử nhiều tuyến; cuối cùng đi bộ.|In the end nêu kết quả sau một quá trình.
{person} caught the train just [in time~in times].|{person} vừa kịp tàu.|Just in time là cụm cố định.
{person} will return [at~in] the end of January.|{person} sẽ về vào cuối tháng Một.|At the end of + tháng.
`,
    ),
    123: U(
        123,
        'Dùng in cho không gian bên trong, on cho bề mặt và at cho một điểm/vị trí hoạt động.|At the door khác on the door; in the room khác on the wall. Cùng một nơi có thể được nhìn theo nhiều cách.|Học nghĩa và góc nhìn trước, không ghép mỗi địa danh với một giới từ duy nhất.',
        `
{person} is [in~on] the kitchen.|{person} ở trong bếp.|In nói bên trong không gian.
{person} put the {item} [on~in] the flat tabletop.|{person} đặt {item} trên mặt bàn phẳng.|On chỉ bề mặt tiếp xúc.
{person} is waiting [at~on] the entrance.|{person} đang đợi tại lối vào.|At xem lối vào là một điểm.
{person} hung the {item} [on~at inside] the wall.|{person} treo {item} trên tường.|On chỉ bề mặt tường.
{person} is standing [at~in inside] the bus stop.|{person} đứng ở điểm dừng xe.|At chỉ địa điểm dừng.
{person} found the key [in~on top of inside] her pocket.|{person} tìm thấy chìa trong túi áo.|In chỉ bên trong túi.
`,
    ),
    124: U(
        124,
        'Học các cụm vị trí như at the top, on the left, in a picture, on a page và on the way.|On the coast/river chỉ vị trí dọc bờ; in the corner of a room khác at/on the corner of a street tùy ngữ cảnh.|Phân biệt in the front of a vehicle với in front of vật khác; các cụm dài cần học trọn.',
        `
{person} is [in~on] the photograph.|{person} có trong bức ảnh.|In a photograph/picture.
{person} lives [on~in inside] the coast.|{person} sống ven biển.|On the coast là cụm vị trí.
{person} wrote it [at~in] the top of the {item}.|{person} viết ở đầu {item}.|At the top of + vật/tài liệu.
{person} is sitting [on~in] the left.|{person} ngồi bên trái.|On the left là cụm thông thường.
{person} called [on~in] the way home.|{person} gọi trên đường về nhà.|On the way.
{person} found it [on~in inside] page ten.|{person} thấy nội dung ở trang mười.|On a page.
`,
    ),
    125: U(
        125,
        'Phân biệt at home/work/an event với in bed/hospital/prison theo nghĩa và biến thể.|At a concert/conference nói tham dự sự kiện; in/at một tòa nhà có thể khác trọng tâm hoạt động và không gian.|Trên phương tiện công cộng thường dùng on, trong xe con thường in; không áp quy tắc máy móc cho mọi phương tiện.',
        `
{person} is [at~on] work.|{person} đang ở chỗ làm.|At work là cụm cố định.
{person} stayed [in~at] bed all morning.|{person} nằm trên giường suốt buổi sáng.|In bed chỉ tình trạng nghỉ/ngủ trên giường.
{person} is [at~on] a conference.|{person} đang dự hội nghị.|At + sự kiện tham dự.
{person} is [on~in inside] the bus.|{person} đang trên xe buýt.|On thường dùng với xe buýt như phương tiện công cộng.
{person} is [in~on top of] a taxi.|{person} đang trong taxi.|In thường dùng với ô tô/taxi.
{person} is [at~on] home today.|Hôm nay {person} ở nhà.|At home là cụm thông thường.
`,
    ),
    126: U(
        126,
        'Dùng to cho chuyển động đến nơi, in/at cho vị trí và into cho chuyển động vào trong.|Arrive in thường với thành phố/quốc gia, arrive at với một điểm; không dùng arrive to trong mẫu thông thường.|Go home/get home không có to; been to nói kinh nghiệm đã tới một nơi.',
        `
{person} is going [to~at] {place}.|{person} đang đi đến {place}.|Go to chỉ đích đến.
{person} arrived [in~to] {place} yesterday.|Hôm qua {person} đến {place}.|Arrive in + thành phố.
{person} arrived [at~to] the station.|{person} đến nhà ga.|Arrive at + một điểm.
{person} walked [into~at] the room from the corridor.|{person} đi từ hành lang vào trong phòng.|Into nhấn chuyển động vào bên trong.
{person} went [—~to] home early.|{person} về nhà sớm.|Go home không có to.
{person} has been [to~at as visit] {place} twice.|{person} đã tới {place} hai lần.|Been to nêu kinh nghiệm thăm nơi đó.
`,
    ),
    127: U(
        127,
        'Học các cụm in/on/at ngoài nghĩa vị trí: on holiday, in cash, on purpose, at risk.|Giới từ gắn với cả cụm và nghĩa, không thể suy hoàn toàn từ bản dịch tiếng Việt.|Phân biệt on the phone/on television và in a book/in a newspaper; một số cụm có biến thể theo vùng.',
        `
{person} is [on~in] holiday.|{person} đang nghỉ phép.|On holiday là cụm cố định trong Anh-Anh.
{person} paid [in~on] cash.|{person} trả bằng tiền mặt.|In cash là cụm phương thức thanh toán.
{person} did it [on~in] purpose.|{person} cố ý làm việc đó.|On purpose nghĩa cố tình.
{person} saw the interview [on~at] television.|{person} xem cuộc phỏng vấn trên truyền hình.|On television.
{person} read about it [in~on top of] a newspaper.|{person} đọc về việc đó trên báo.|In a newspaper khi nói nội dung.
{person} is [at~on] risk without protection.|{person} có nguy cơ nếu không được bảo vệ.|At risk là cụm cố định.
`,
    ),
    128: U(
        128,
        'Dùng by cho phương tiện chung, tác nhân bị động, cách xảy ra hoặc độ chênh lệch.|By train khác on the train; by car khác in my car. On foot là cụm ngoại lệ thông thường.|By + người là tác nhân; with + công cụ là phương tiện trực tiếp như with a key.',
        `
{person} travels [by~with] train.|{person} đi bằng tàu.|By + tên phương tiện không có mạo từ.
{person} came [in~by] her car.|{person} đến bằng xe riêng.|Có her car thì dùng in, không by her car.
{person} opened the door [with~by] a key.|{person} mở cửa bằng chìa khóa.|With chỉ công cụ.
The {item} was written [by~with] {person}.|{item} do {person} viết.|By chỉ tác nhân bị động.
{person} met us [by~with] chance.|{person} tình cờ gặp chúng tôi.|By chance nghĩa tình cờ.
{person} went [on~by] foot.|{person} đi bộ.|Cụm thông thường là on foot.
`,
    ),
    129: U(
        129,
        'Học giới từ đi với danh từ như reason for, increase in, picture of và relationship with/between.|Reason for khác cause of; solution to và answer to dùng to. Giới từ không thể đoán chỉ từ một từ tiếng Việt.|Between dùng khi xác định quan hệ giữa các bên; with nói quan hệ với một bên.',
        `
{person} explained the reason [for~of] the delay.|{person} giải thích lý do chậm trễ.|Reason for something.
{person} found the cause [of~for] the error.|{person} tìm ra nguyên nhân lỗi.|Cause of something.
{person} noticed an increase [in~of] prices.|{person} thấy giá tăng.|Increase in + chỉ số/đại lượng.
{person} showed us a picture [of~for] {place}.|{person} cho xem ảnh {place}.|Picture of + đối tượng được chụp.
{person} found a solution [to~of] the problem.|{person} tìm được giải pháp cho vấn đề.|Solution to a problem.
{person} has a good relationship [with~to] the client.|{person} có quan hệ tốt với khách hàng.|Relationship with someone.
`,
    ),
    130: U(
        130,
        'Học adjective + preposition cho cách đối xử, phản ứng và cảm xúc.|Kind of someone to do đánh giá hành vi; kind to someone nói cách đối xử. Happy with nói hài lòng về điều nhận được.|Surprised at/by đều có thể đúng; sorry about sự việc khác sorry for người hoặc hành động tùy mẫu.',
        `
It was kind [of~with] {person} to help.|{person} thật tốt bụng khi giúp.|Kind of someone to do.
{person} is always polite [to~with to] visitors.|{person} luôn lịch sự với khách.|Polite to someone.
{person} is satisfied [with~to] the {item}.|{person} hài lòng với {item}.|Satisfied with something.
{person} was surprised [by~for] the news.|{person} ngạc nhiên trước tin.|Surprised by diễn tả phản ứng với nguyên nhân.
{person} is sorry [about~with] the delay.|{person} xin lỗi về chậm trễ.|Sorry about a situation.
{person} is angry [with~to] the supplier.|{person} giận nhà cung cấp.|Angry with someone.
`,
    ),
    131: U(
        131,
        'Học cụm afraid/proud/capable of, good at, interested in, similar to và dependent on.|Sau giới từ dùng danh từ hoặc V-ing; không tự đổi sang to-infinitive.|Independent of khác dependent on; famous for nói nổi tiếng vì điều gì.',
        `
{person} is good [at~in] explaining ideas.|{person} giỏi giải thích ý tưởng.|Good at + V-ing.
{person} is proud [of~for] the team.|{person} tự hào về nhóm.|Proud of.
{person} is interested [in~on] design.|{person} quan tâm thiết kế.|Interested in.
{person} is capable of [repairing~repair] the {device}.|{person} có khả năng sửa {device}.|Capable of + V-ing.
{person} is dependent [on~of] public transport.|{person} phụ thuộc giao thông công cộng.|Dependent on; independent of là cụm khác.
{person} says this {device} is similar [to~with] ours.|{person} nói {device} này giống của chúng tôi.|Similar to.
`,
    ),
    132: U(
        132,
        'Học talk/listen/apologise/explain to và look/stare/laugh at; tránh thêm giới từ với ask/thank trong mẫu trực tiếp.|Explain something to someone, không explain someone something trong mẫu chuẩn ở đây.|Shout at thường giận dữ; shout to thường để người ở xa nghe. Throw at có thể nhắm trúng; throw to nhằm cho người nhận bắt.',
        `
{person} listened [to~—] the announcement.|{person} nghe thông báo.|Listen to something cần to.
{person} explained the {item} [to~for to] us.|{person} giải thích {item} cho chúng tôi.|Explain something to someone.
{person} looked [at~to] the {device}.|{person} nhìn {device}.|Look at something.
{person} thanked [—~to] the tutor.|{person} cảm ơn gia sư.|Thank someone không thêm to.
{person} apologised [to~at] the client.|{person} xin lỗi khách hàng.|Apologise to someone.
{person} shouted [to~at angrily to] us so we could hear from far away.|{person} gọi to để chúng tôi nghe từ xa.|Shout to nhấn giao tiếp qua khoảng cách.
`,
    ),
    133: U(
        133,
        'Học talk about, apply for, look for, care about/for và look after theo nghĩa.|Discuss something không cần about; ask for xin thứ gì khác ask someone a question.|Care about là quan tâm coi trọng, care for có thể chăm sóc/thích; look after là chăm nom.',
        `
{person} applied [for~to for] the job.|{person} ứng tuyển công việc.|Apply for a job.
{person} is looking [for~after] a lost key.|{person} đang tìm chìa khóa thất lạc.|Look for là tìm kiếm.
{person} looks [after~for] her younger cousin while his parents work.|{person} trông em họ khi bố mẹ em làm việc.|Look after là chăm sóc.
{person} discussed [—~about] the {item}.|{person} thảo luận {item}.|Discuss là ngoại động từ, không thêm about trong mẫu này.
{person} asked [for~to for] a copy.|{person} xin một bản sao.|Ask for something.
{person} cares [about~at] fair treatment.|{person} quan tâm việc đối xử công bằng.|Care about điều mình coi trọng.
`,
    ),
    134: U(
        134,
        'Phân biệt hear about tin tức với hear of biết sự tồn tại; think of/about và dream of/about tùy nghĩa.|Remind someone about nhắc việc cần nhớ; remind someone of gợi nhớ một điều/người khác.|Complain to người nghe và about vấn đề; complain of có thể dùng khi nói triệu chứng.',
        `
{person} heard [about~for] the cancelled meeting.|{person} nghe tin cuộc họp bị hủy.|Hear about + tin/sự kiện.
{person} has never heard [of~from about] that author.|{person} chưa từng biết đến tác giả đó.|Hear of nói biết sự tồn tại/danh tiếng.
{person} reminded me [about~for] tomorrow's meeting.|{person} nhắc tôi cuộc họp ngày mai.|Remind about một việc cần nhớ.
The song reminds {person} [of~for] her childhood.|Bài hát gợi {person} nhớ thời thơ ấu.|Remind someone of một điều gợi nhớ.
{person} complained [to~at] the manager about the noise.|{person} phàn nàn với quản lý về tiếng ồn.|Complain to someone about something.
{person} is thinking [of~for] moving to {place}.|{person} đang cân nhắc chuyển đến {place}.|Think of doing; think about doing cũng là mẫu khác hợp lệ.
`,
    ),
    135: U(
        135,
        'Học accuse/suspect/approve of, thank/forgive for, suffer/protect from và depend/rely on.|Congratulate someone on something khác thank someone for something; động từ quyết định giới từ.|Sau giới từ có thể là V-ing; không thêm to-infinitive sau of/on trong các cụm này.',
        `
{person} was accused [of~for] sharing the code.|{person} bị cáo buộc chia sẻ mã.|Accuse someone of doing.
{person} thanked us [for~of] helping.|{person} cảm ơn chúng tôi vì đã giúp.|Thank someone for doing.
{person} congratulated me [on~for to] the promotion.|{person} chúc mừng tôi được thăng chức.|Congratulate someone on something.
{person} protected the {device} [from~of] dust.|{person} bảo vệ {device} khỏi bụi.|Protect something from something.
We can rely [on~of] {person}.|Chúng tôi có thể tin cậy {person}.|Rely on someone.
{person} does not approve [of~for] the new {item}.|{person} không tán thành {item} mới.|Approve of something nói tán thành.
`,
    ),
    136: U(
        136,
        'Học believe/specialise in, break/divide into, collide with, happen to và concentrate on.|Believe someone là tin lời người đó; believe in someone/something là tin năng lực hoặc giá trị/sự tồn tại.|Insist on, spend money on và divide into cần nhớ cả cụm; không chọn giới từ chỉ theo nghĩa dịch.',
        `
{person} specialises [in~on] finance.|{person} chuyên về tài chính.|Specialise in a subject.
Someone broke [into~in to at] the office while {person} was away.|Có người đột nhập văn phòng khi {person} vắng.|Break into a building.
{person} divided the {item} [into~with] three sections.|{person} chia {item} thành ba phần.|Divide something into parts.
What happened [to~with to] the {device}, {person}?|Chuyện gì xảy ra với {device} vậy, {person}?|Happen to something.
{person} needs to concentrate [on~in] the {item}.|{person} cần tập trung vào {item}.|Concentrate on something.
{person} believes [in~on] fair treatment.|{person} tin vào việc đối xử công bằng.|Believe in nói niềm tin vào một giá trị.
`,
    ),
};
