import { unit as U } from './extended-builder.js';
export const units = {
    69: U(
        69,
        'Phân biệt danh từ đếm được và không đếm được để chọn mạo từ, số nhiều và lượng từ.|Danh từ đếm được số ít thường cần a/the/my...; danh từ không đếm được không dùng trực tiếp a/an hoặc số đếm.|Dùng a piece of/a glass of để đếm một đơn vị; cách phân loại phụ thuộc nghĩa và ngữ cảnh.',
        `
{person} needs [some~an] advice.|{person} cần một ít lời khuyên.|Advice không đếm được trong nghĩa thông thường.
{person} bought [a~some] new {device}.|{person} mua một {device} mới.|Danh từ đếm được số ít cần a.
{person} has three [suitcases~suitcase].|{person} có ba va li.|Sau three dùng danh từ số nhiều.
{person} would like a glass of [water~waters].|{person} muốn một cốc nước.|Đếm cốc chứ không biến water thành số nhiều ở đây.
How [much~many] information does {person} need?|{person} cần bao nhiêu thông tin?|Information không đếm được nên dùng much.
{person} does not have [many~much] books.|{person} không có nhiều sách.|Books số nhiều đếm được dùng many.
`,
    ),
    70: U(
        70,
        'Nhận biết danh từ thay đổi khả năng đếm theo nghĩa như room, experience, coffee và paper.|Advice, furniture, news, luggage thường không đếm được; cần đơn vị như piece/item khi đếm.|A trip là một chuyến đi, travel là việc đi lại nói chung. Đừng dịch từng từ rồi tự thêm s.',
        `
{person} has [a lot of experience~many experiences in general] in sales.|{person} có nhiều kinh nghiệm làm bán hàng.|Experience chỉ kinh nghiệm chung là không đếm được.
{person} had an unusual [experience~experiences] on the train.|{person} có một trải nghiệm lạ trên tàu.|Một sự kiện cụ thể là a/an experience.
There is not enough [room~rooms] for {person} in the car.|Trong xe không đủ chỗ cho {person}.|Room nghĩa không gian là không đếm được.
{person} booked a [room~room accommodation] near the station.|{person} đặt một phòng gần nhà ga.|Room nghĩa phòng cụ thể đếm được.
The [news is~news are] good, says {person}.|{person} nói tin tức rất tốt.|News có hình thức s nhưng dùng động từ số ít.
{person} is planning a business [trip~travel].|{person} đang lên kế hoạch cho một chuyến công tác.|Một chuyến đi là a trip, không a travel.
`,
    ),
    71: U(
        71,
        'Dùng a/an hoặc một từ hạn định với danh từ đếm được số ít; some có thể nói số lượng không xác định.|A/an dùng khi nói nghề nghiệp, phân loại người/vật; chọn theo âm đầu, không chỉ theo chữ viết.|Some với số nhiều có thể mang nghĩa vài hoặc một số chứ không phải mọi; không thêm a trước danh từ số nhiều.',
        `
{person} is [an~a] engineer.|{person} là kỹ sư.|Engineer bắt đầu bằng âm nguyên âm.
{person} works at [a~an] university.|{person} làm ở một trường đại học.|University bắt đầu bằng âm /j/, nên dùng a.
{person} has [some~a] reliable colleagues.|{person} có một số đồng nghiệp đáng tin.|Danh từ số nhiều có thể đi với some.
{person} bought [an~a] umbrella.|{person} mua một chiếc ô.|Umbrella bắt đầu bằng âm nguyên âm.
{person} has [a~—] long journey tomorrow.|Ngày mai {person} có một hành trình dài.|Journey là danh từ đếm được số ít.
{person} is [a~an] European visitor.|{person} là một du khách châu Âu.|European bắt đầu bằng âm /j/.
`,
    ),
    72: U(
        72,
        'Dùng a/an khi giới thiệu một thành viên chưa xác định; dùng the khi người nghe biết vật nào.|Lần nhắc tiếp theo thường dùng the; điều xác định cũng có thể đến từ tình huống hoặc phần bổ nghĩa.|Once a week và giá mỗi đơn vị dùng a; không biến a/the thành quy tắc chỉ dựa vào lần xuất hiện.',
        `
{person} bought [a~an] {device} yesterday.|Hôm qua {person} mua một {device}.|Giới thiệu một vật đếm được chưa xác định.
{person} bought a {device}; [the~a] {device} was damaged.|{person} mua một {device}; chính chiếc máy đó bị hỏng.|Lần nhắc lại vật đã xác định dùng the.
Please close [the~a] only window, {person}.|{person}, đóng cửa sổ duy nhất giúp nhé.|Only window xác định rõ vật nào.
{person} visits us twice [a~the] month.|{person} thăm chúng tôi hai lần mỗi tháng.|A month diễn tả mỗi tháng.
{person} needs [an~a] answer today.|{person} cần một câu trả lời hôm nay.|Answer bắt đầu bằng âm nguyên âm.
{person} is [the~a] person who approved this {item}.|{person} là người đã duyệt {item} này.|Mệnh đề sau xác định người đang nói đến.
`,
    ),
    73: U(
        73,
        'Dùng the với điều duy nhất trong ngữ cảnh, so sánh nhất và the same.|Không dùng the trước số hiệu như Room 12, platform 3; space nghĩa vũ trụ thường không có the.|Phân biệt the sea/the sky với các cách dùng đặc biệt như at sea; học cả cụm thay vì dịch từng mạo từ.',
        `
{person} says [the~a] sun is bright today.|{person} nói hôm nay mặt trời sáng.|Sun trong ngữ cảnh thông thường được xem là duy nhất.
{person} chose [the~a] cheapest {device} in the shop.|{person} chọn {device} rẻ nhất cửa hàng.|So sánh nhất thường có the.
{person} and I have [the~a] same {device}.|Tôi và {person} có cùng loại {device}.|Cụm cố định là the same.
{person} is waiting on [—~the] platform 4.|{person} đang đợi ở sân ga số 4.|Không có the trước platform + số hiệu.
{person} is staying in [—~the] Room 12.|{person} ở phòng số 12.|Room + số hiệu không cần the.
{person} reads about travel in [—~the] space.|{person} đọc về du hành vũ trụ.|Space nghĩa không gian vũ trụ thường không dùng the.
`,
    ),
    74: U(
        74,
        'Phân biệt trường học/bệnh viện/nhà tù với chức năng chính và một tòa nhà cụ thể.|Go to school, be in prison, go to bed thường không có the khi nói đúng chức năng; đến thăm tòa nhà có thể dùng the.|British English thường dùng in hospital cho bệnh nhân; American English thường có the. Ngữ cảnh và biến thể cần được nói rõ.',
        `
{person} is a pupil and goes to [—~the] school every weekday.|{person} là học sinh và đi học mỗi ngày trong tuần.|School nói hoạt động học tập, không chỉ tòa nhà.
{person} went to [the~—] school to repair its roof.|{person} đến tòa nhà trường để sửa mái.|Ở đây nói tòa nhà cụ thể, không đi học.
{person} usually goes to [—~the] bed at ten.|{person} thường đi ngủ lúc mười giờ.|Go to bed là đi ngủ.
{person} sat on [the~—] bed in the guest room.|{person} ngồi trên chiếc giường trong phòng khách.|Giường là một vật cụ thể.
{person} is in [—~the] prison as a prisoner, using British institutional phrasing.|{person} đang ngồi tù theo cách diễn đạt chức năng.|In prison nói tình trạng tù nhân.
{person} goes to [—~the] work by bus.|{person} đi làm bằng xe buýt.|Go to work không có mạo từ.
`,
    ),
    75: U(
        75,
        'Danh từ số nhiều hoặc không đếm được nói chung thường không có the; nhóm xác định dùng the.|Children need sleep nói chung khác the children in this room. Most people khác most of the people here.|Nghĩa khái quát không đồng nghĩa với mọi danh từ đều đứng trần; danh từ đếm được số ít vẫn có quy tắc riêng.',
        `
{person} believes [—~the] education is important in general.|{person} tin rằng giáo dục nói chung rất quan trọng.|Khái niệm không đếm được nói chung không có the.
{person} likes [the~—] music playing in this café.|{person} thích bản nhạc đang phát trong quán này.|Mệnh đề sau xác định nhạc nào.
{person} thinks [—~the] children need regular sleep in general.|{person} cho rằng trẻ em nói chung cần ngủ đều.|Danh từ số nhiều khái quát không dùng the.
{person} is supervising [the~—] children in this room.|{person} đang trông những đứa trẻ trong phòng này.|Nhóm trẻ cụ thể dùng the.
{person} says [most~the most] people need breaks.|{person} nói phần lớn mọi người cần nghỉ.|Most people là phần lớn nói chung, không the most.
{person} prefers [—~the] coffee to tea as a drink in general.|{person} nhìn chung thích cà phê hơn trà.|Tên thức uống không đếm được dùng theo nghĩa chung.
`,
    ),
    76: U(
        76,
        'Dùng the với một số danh từ chỉ phát minh, nhạc cụ, loài và nhóm tính từ.|The rich/the elderly chỉ nhóm người và đi với động từ số nhiều; không dùng a rich để chỉ một người giàu.|Tên quốc tịch có mẫu khác nhau: the French chỉ người Pháp nói chung, a French person nói một người.',
        `
{person} plays [the~a the] violin.|{person} chơi đàn violin.|Tên nhạc cụ thường dùng the trong mẫu play the violin.
{person} says [the~a] elderly need accessible transport.|{person} nói người cao tuổi cần giao thông dễ tiếp cận.|The elderly là nhóm người.
{person} believes the rich [should~shoulds] pay fairly.|{person} cho rằng người giàu nên đóng góp công bằng.|The rich là nhóm người; should không thêm s.
{person} met a French [person~—] at the workshop.|{person} gặp một người Pháp tại hội thảo.|Một cá nhân là a French person, không a French.
{person} says the telephone [changed~change yesterday] communication.|{person} nói phát minh điện thoại đã thay đổi giao tiếp.|The telephone có thể chỉ một phát minh.
{person} believes [the~a] unemployed need training support.|{person} cho rằng người thất nghiệp cần hỗ trợ đào tạo.|The + tính từ có thể chỉ một nhóm người.
`,
    ),
    77: U(
        77,
        'Học mạo từ với tên người và tên địa lý: phần lớn tên thành phố, hồ, núi đơn không có the.|Sông, biển, đại dương, sa mạc, dãy núi và tên quốc gia số nhiều thường có the.|Tên có republic, kingdom hoặc states thường có the; không suy ra rằng mọi địa danh đều theo cùng một kiểu.',
        `
[—~The] {person} lives in {place}.|{person} sống ở {place}.|Tên người thông thường không có the.
{person} has visited [the~—] United States.|{person} từng đến Hoa Kỳ.|United States dùng the.
{person} sailed across [the~—] Atlantic.|{person} đi tàu qua Đại Tây Dương.|Tên đại dương dùng the.
{person} climbed [—~the] Mount Fuji.|{person} leo núi Phú Sĩ.|Mount + tên riêng thường không có the.
{person} walked beside [the~—] Nile.|{person} đi bộ bên sông Nile.|Tên sông dùng the.
{person} stayed near [—~the] Lake Geneva.|{person} ở gần hồ Geneva.|Lake + tên riêng không dùng the.
`,
    ),
    78: U(
        78,
        'Dùng mạo từ đúng với tên đường, công trình, khách sạn, bảo tàng và tổ chức.|Tên đường/quảng trường phần lớn không có the; nhiều bảo tàng, rạp và khách sạn có the.|Tên sở hữu như St Mary’s và tên công ty có mẫu riêng; cần kiểm tra tên chính thức thay vì thêm the máy móc.',
        `
{person} lives on [—~the] Oxford Street.|{person} sống trên phố Oxford.|Tên phố thường không có the.
{person} visited [the~—] British Museum.|{person} đến Bảo tàng Anh.|Tên bảo tàng này dùng the.
{person} stayed at [the~—] Ritz.|{person} ở khách sạn Ritz.|Tên khách sạn này dùng the.
{person} works for [—~the] Microsoft.|{person} làm cho Microsoft.|Tên công ty này không có the.
{person} met us in [—~the] Trafalgar Square.|{person} gặp chúng tôi ở quảng trường Trafalgar.|Tên quảng trường thường không dùng the.
{person} studied at [—~the] St Mary's College.|{person} học tại trường St Mary's.|Tên sở hữu của trường thường không có the.
`,
    ),
    79: U(
        79,
        'Nhận biết danh từ số nhiều đặc biệt, danh từ có hình thức s nhưng nghĩa số ít và danh từ tập hợp.|Police dùng động từ số nhiều; news dùng số ít; trousers/scissors thường đi với a pair of.|Một số danh từ tập hợp có thể dùng số ít hoặc số nhiều tùy cách nhìn và biến thể Anh–Mỹ.',
        `
{person} says the police [are~is] outside.|{person} nói cảnh sát đang ở ngoài.|Police dùng động từ số nhiều.
{person} says the news [is~are] encouraging.|{person} nói tin tức rất đáng khích lệ.|News dùng động từ số ít.
{person} bought a [pair~piece] of trousers.|{person} mua một chiếc quần dài.|Trousers thường đếm bằng a pair of.
{person} knows three [people~person] on the team.|{person} biết ba người trong nhóm.|Số nhiều thông dụng của person là people.
{person} uses these [scissors~scissor] for paper.|{person} dùng chiếc kéo này cắt giấy.|Scissors có hình thức số nhiều.
{person} says ten kilometres [is~are being always] a long walk.|{person} nói mười kilômét là quãng đi bộ dài.|Một khoảng đo được xem là một tổng thể có thể dùng is.
`,
    ),
    80: U(
        80,
        'Dùng noun + noun để phân loại vật/người; danh từ đầu thường giữ số ít.|A bus driver là người lái xe buýt; a five-minute break có tính từ ghép đơn vị số ít.|Một số cụm cố định có danh từ số nhiều; học cả cụm, không coi quy tắc số ít là tuyệt đối.',
        `
{person} is a [bus~buses] driver.|{person} là tài xế xe buýt.|Danh từ phân loại trước driver thường ở số ít.
{person} bought a [coffee~coffees] cup.|{person} mua một chiếc cốc cà phê.|Coffee phân loại cup.
{person} requested a five-[minute~minutes] break.|{person} xin nghỉ năm phút.|Tính từ ghép đơn vị dùng dạng số ít.
{person} has a [two-bedroom~two-bedrooms] flat.|{person} có căn hộ hai phòng ngủ.|Danh từ trong tính từ ghép dùng số ít.
{person} attended a [staff~staffs] meeting.|{person} dự cuộc họp nhân viên.|Staff meeting là cụm danh từ ghép.
{person} is a [university~universities] student.|{person} là sinh viên đại học.|University phân loại student.
`,
    ),
    81: U(
        81,
        'Dùng sở hữu ’s, s’ hoặc of theo người/vật và cách diễn đạt tự nhiên.|Danh từ số nhiều có s dùng dấu nháy sau s; danh từ bất quy tắc như children dùng ’s.|Of thường dùng với bộ phận/vị trí của vật; sở hữu cũng dùng cho tổ chức và khoảng thời gian như a week’s notice.',
        `
This is [{person}'s~{person}s'] {device}.|Đây là {device} của {person}.|Tên người số ít dùng ’s.
The [children's~childrens'] room is ready, says {person}.|{person} nói phòng của trẻ đã sẵn sàng.|Children là số nhiều không tận cùng s, dùng ’s.
The [students'~students's] bags are here, says {person}.|{person} nói túi của các sinh viên ở đây.|Students số nhiều có s, đặt dấu nháy sau s.
{person} checked the end [of~'s] the {item}.|{person} kiểm tra phần cuối của {item}.|The end of something là mẫu vị trí thông thường.
{person} gave a [week's~weeks'] notice for one week.|{person} báo trước một tuần.|Một tuần số ít dùng a week’s.
This {device} is [mine~my], not {person}'s.|{device} này của tôi, không phải của {person}.|Đại từ sở hữu đứng một mình dùng mine.
`,
    ),
    82: U(
        82,
        'Dùng myself/yourself/... khi tân ngữ quay về chính chủ ngữ; each other là qua lại.|Do it yourself nhấn ai tự làm; by yourself nghĩa một mình. Không tự động thêm đại từ phản thân sau relax/feel/concentrate.|Wash/dress/shave thường không cần phản thân khi không có ý nhấn mạnh.',
        `
{person} cut [herself~her] while cooking.|{person} tự làm đứt tay khi nấu ăn.|Tân ngữ là chính chủ ngữ nên dùng herself.
{person} made the {item} [herself~itself].|{person} tự làm {item}.|Herself nhấn người thực hiện là cô ấy.
{person} and I help [each other~ourselves each] with homework.|Tôi và {person} giúp nhau làm bài.|Each other diễn tả quan hệ qua lại.
{person} repaired the {device} by [herself~her].|{person} tự một mình sửa {device}.|By herself nghĩa một mình.
{person} tried to relax [—~herself always] after work.|{person} cố thư giãn sau giờ làm.|Relax thường không cần đại từ phản thân trong nghĩa này.
{person} looked at [herself~itself] in the mirror.|{person} nhìn chính mình trong gương.|Herself quay về người làm chủ ngữ.
`,
    ),
    83: U(
        83,
        'Dùng a friend of mine và my own đúng chức năng sở hữu; phân biệt own với alone.|Sau of trong a friend of ... dùng mine/yours/hers, không my/your/her.|On my own và by myself đều có thể nghĩa một mình hoặc tự làm, tùy câu; không dùng an own house.',
        `
{person} is a friend of [mine~my].|{person} là một người bạn của tôi.|Of mine là dạng sở hữu đứng độc lập.
{person} has her [own~owner] office.|{person} có văn phòng riêng.|Own nhấn sở hữu riêng sau từ hạn định.
{person} lives on [her own~hers own].|{person} sống một mình.|On her own là cụm cố định.
{person} fixed the {device} by [herself~her own].|{person} tự mình sửa {device}.|By herself, không by her own.
{person} wants a room of [her own~hers own].|{person} muốn một phòng riêng.|A room of her own.
The {device} is [hers~her], says {person}.|{person} nói {device} là của cô ấy.|Hers đứng độc lập, không her.
`,
    ),
    84: U(
        84,
        'Dùng there để giới thiệu sự tồn tại và it để nói về điều đã xác định, thời tiết, thời gian hoặc khoảng cách.|There is/are đổi theo cụm danh từ; modal/hoàn thành tạo there must be/there has been.|There nghĩa ở đó khác there mở câu tồn tại; tránh dùng it is thay mọi there is.',
        `
[There is~It is being] a message for {person}.|Có một tin nhắn cho {person}.|There is giới thiệu sự tồn tại của tin nhắn.
[There are~There is] two files for {person}.|Có hai tệp dành cho {person}.|Danh từ số nhiều dùng are.
{person} says [it~there] is raining.|{person} nói trời đang mưa.|Thời tiết dùng chủ ngữ giả it.
{person} says [it~there] is ten kilometres to the station.|{person} nói đến nhà ga là mười kilômét.|Khoảng cách dùng it.
{person} says there must [be~is] a mistake.|{person} nói chắc phải có lỗi.|Modal + be trong mẫu tồn tại.
{person} says there has [been~being] a delay.|{person} nói đã có chậm trễ.|Hoàn thành của there is là there has been.
`,
    ),
    85: U(
        85,
        'Dùng some/any theo ý khẳng định, phủ định, câu hỏi và kỳ vọng của người nói.|Some thường dùng trong lời mời/yêu cầu khi kỳ vọng có; any dùng trong nhiều câu hỏi mở và phủ định.|Any còn có nghĩa bất kỳ; không áp quy tắc câu hỏi luôn dùng any.',
        `
{person} has [some~any] useful ideas to share.|{person} có vài ý tưởng hữu ích muốn chia sẻ.|Khẳng định thông thường dùng some.
{person} does not have [any~some at all] questions.|{person} không có câu hỏi nào.|Phủ định với nghĩa không có gì dùng any.
Would {person} like [some~any at all] tea?|{person} có muốn dùng chút trà không?|Lời mời thường dùng some.
Does {person} have [any~none] experience with this {device}?|{person} có chút kinh nghiệm nào với {device} này không?|Câu hỏi mở dùng any.
{person} can choose [any~some only every] seat; all are available.|{person} có thể chọn bất cứ ghế nào vì tất cả đều trống.|Any ở đây là bất kỳ.
If {person} needs [anything~nothing], tell me.|Nếu {person} cần bất cứ thứ gì thì nói tôi.|If thường đi với anything trong nghĩa điều kiện mở.
`,
    ),
    86: U(
        86,
        'Dùng no + danh từ, none đứng độc lập hoặc none of; tránh hai lần phủ định không chủ ý.|Nothing/nobody/no one đã có nghĩa phủ định; động từ thường ở dạng khẳng định.|Any/anything trong câu phủ định tương đương nhiều mẫu no/nothing nhưng cấu trúc không giống nhau.',
        `
{person} has [no~none] spare keys.|{person} không có chìa khóa dự phòng.|No đứng trước danh từ.
How many keys does {person} have? [None~No].|{person} có bao nhiêu chìa? Không có chiếc nào.|None đứng độc lập thay cho số lượng.
{person} found [nothing~not nothing] inside the box.|{person} không thấy gì trong hộp.|Nothing đã mang nghĩa phủ định.
{person} did not see [anybody~nobody] in the office.|{person} không thấy ai trong văn phòng.|Động từ phủ định đi với anybody, không thêm phủ định nữa.
[Nobody knows~Nobody know] where {person} is.|Không ai biết {person} ở đâu.|Nobody thường đi với động từ số ít.
{person} says none [of~from] the files are ready.|{person} nói chưa tệp nào sẵn sàng.|None of + cụm xác định.
`,
    ),
    87: U(
        87,
        'Chọn much/little cho không đếm được, many/few cho số nhiều đếm được.|A little/a few nhấn có một ít; little/few thường nhấn thiếu hoặc gần như không có.|A lot of/plenty of dùng với cả hai loại; much trong khẳng định giao tiếp thường kém tự nhiên hơn a lot of.',
        `
{person} does not have [much~many] time.|{person} không có nhiều thời gian.|Time ở nghĩa thời lượng không đếm được.
{person} does not have [many~much] meetings today.|Hôm nay {person} không có nhiều cuộc họp.|Meetings đếm được số nhiều.
{person} has [a few~a little] colleagues nearby.|{person} có một vài đồng nghiệp gần đó.|Colleagues dùng a few.
{person} has [a little~a few] money left.|{person} còn lại một ít tiền.|Money dùng a little.
{person} has [plenty of~plenty] ideas.|{person} có rất nhiều ý tưởng.|Plenty cần of trước danh từ.
{person} made [few~little] mistakes in the {item}.|{person} mắc ít lỗi trong {item}.|Mistakes số nhiều đếm được nên dùng few.
`,
    ),
    88: U(
        88,
        'Phân biệt most people với most of the people, all students với all of them.|Of xuất hiện trước cụm đã xác định như the/my/these và bắt buộc trước us/you/them trong các mẫu này.|Không dùng most of people trần; all/both/half có thể có hoặc không of trước một số cụm danh từ xác định.',
        `
{person} knows most [of~—] the people here.|{person} biết phần lớn người ở đây.|Most of + the + danh từ.
{person} thinks most [—~of] people need breaks.|{person} cho rằng phần lớn mọi người cần nghỉ.|Most people nói chung không có of.
{person} invited all [of~—] us.|{person} mời tất cả chúng tôi.|Trước us cần of.
{person} checked some [of~—] these files.|{person} kiểm tra một số tệp này.|Some of + these.
{person} says none [of~—] them are available.|{person} nói không ai trong họ rảnh.|None of + đại từ.
{person} spent half [of~from] the money on travel.|{person} dùng nửa số tiền cho đi lại.|Half of chỉ một phần của tổng đã xác định.
`,
    ),
    89: U(
        89,
        'Dùng both/neither/either khi nói đúng hai người/vật.|Both là cả hai; neither là không cái/người nào trong hai; either có thể là một trong hai hoặc cả hai cách đều được tùy câu.|Trước us/you/them cần of; either/neither + danh từ số ít. Neither of có thể gặp số ít hoặc số nhiều tùy phong cách.',
        `
{person} has two options; [both~every] are useful.|{person} có hai lựa chọn và cả hai đều hữu ích.|Both nói cả hai đối tượng.
{person} wants neither [option~options].|{person} không muốn lựa chọn nào trong hai.|Neither + danh từ số ít.
{person} can take either [route~routes].|{person} có thể đi một trong hai tuyến.|Either + danh từ số ít.
{person} invited both [of~—] us.|{person} mời cả hai chúng tôi.|Both of + us.
{person} says neither [of~from] the two plans is suitable.|{person} nói không kế hoạch nào trong hai phù hợp.|Neither of + cụm xác định.
{person} can come either today [or~nor] tomorrow.|{person} có thể đến hôm nay hoặc ngày mai.|Cặp cấu trúc either ... or.
`,
    ),
    90: U(
        90,
        'Phân biệt all, every và whole: tổng thể, từng thành viên của nhóm và một vật/khoảng hoàn chỉnh.|Every + danh từ số ít; the whole + danh từ số ít. All day không cần the, the whole day thì có.|Không dùng whole trực tiếp với lượng không đếm được như money theo cùng mẫu với whole day.',
        `
{person} checks [every~all] file before sending it.|{person} kiểm tra từng tệp trước khi gửi.|Every + danh từ số ít.
{person} read the [whole~all] {item}.|{person} đọc toàn bộ {item}.|The whole + danh từ số ít.
{person} spent [all~whole] the money.|{person} dùng hết số tiền.|All the money, không whole the money.
{person} worked [all~every] day without a break.|{person} làm cả ngày không nghỉ.|All day chỉ toàn khoảng thời gian.
{person} visits us every [two~second every] weeks.|{person} thăm chúng tôi hai tuần một lần.|Every + số + đơn vị thời gian số nhiều.
{person} says [everyone~all] was invited, meaning every person.|{person} nói mọi người đều được mời.|Everyone là đại từ chỉ mọi người.
`,
    ),
    91: U(
        91,
        'Each tập trung từng thành viên; every nhìn cả nhóm nhưng vẫn dùng danh từ số ít.|Each dùng được một mình hoặc each of; every cần danh từ, hoặc every one of.|Every dùng cho tần suất; each thường dùng cho hai thành viên riêng biệt và vị trí cuối như five dollars each.',
        `
{person} gave each [student~students] a card.|{person} đưa mỗi học viên một tấm thẻ.|Each + danh từ số ít.
{person} checks every [file~files].|{person} kiểm tra mọi tệp.|Every + danh từ số ít.
{person} spoke to each [of~—] them.|{person} nói chuyện với từng người.|Each of + đại từ.
{person} checked every [one~—] of the files.|{person} kiểm tra từng tệp trong số đó.|Every one of, không every of.
{person} takes a break [every~each of] hour.|{person} nghỉ mỗi giờ một lần.|Tần suất dùng every hour.
{person} bought two tickets at ten dollars [each~every].|{person} mua hai vé, mỗi vé mười đô.|Each có thể ở cuối để nói giá từng món.
`,
    ),
    92: U(
        92,
        'Dùng mệnh đề quan hệ xác định với who/that cho người và which/that cho vật.|Đại từ quan hệ làm chủ ngữ hoặc tân ngữ; không thêm một đại từ thừa trong mệnh đề.|What nghĩa điều mà có cấu trúc riêng, không đứng sau một danh từ làm antecedent như the book what.',
        `
{person} hired someone [who~which] speaks Korean.|{person} thuê người biết tiếng Hàn.|Who thay cho người.
{person} bought a {device} [which~who] works offline.|{person} mua {device} dùng được ngoại tuyến.|Which thay cho vật.
{person} knows the person [that~what] approved the {item}.|{person} biết người đã duyệt {item}.|That nối với danh từ chỉ người trong mệnh đề xác định.
{person} read the {item} that [was~it was] on the desk.|{person} đọc {item} trên bàn.|That đã là chủ ngữ, không thêm it.
{person} kept [what~that what] we sent.|{person} giữ điều chúng tôi gửi.|What có nghĩa the thing that, không cần that trước nó.
{person} chose the file [that~what] contained the answer.|{person} chọn tệp chứa đáp án.|Có danh từ file trước nên dùng that, không what.
`,
    ),
    93: U(
        93,
        'Có thể bỏ đại từ quan hệ khi nó là tân ngữ trong mệnh đề xác định; không bỏ khi là chủ ngữ.|The person I called khác the person who called me. Giới từ thường có thể ở cuối trong giao tiếp.|Không dùng hai tân ngữ cho cùng một vai trò: the file I sent, không the file I sent it.',
        `
{person} kept the {item} I [sent~sent it].|{person} giữ {item} tôi đã gửi.|Không lặp it vì tân ngữ đã là danh từ trước.
{person} met the tutor [who~—] teaches here.|{person} gặp gia sư dạy ở đây.|Who là chủ ngữ nên không được bỏ.
{person} is the colleague I work [with~with her].|{person} là đồng nghiệp tôi làm cùng.|Không lặp thêm her sau with.
{person} bought the {device} we [recommended~recommended it].|{person} mua {device} chúng tôi khuyên dùng.|Tân ngữ quan hệ đã được lược, không thêm it.
{person} read a {item} [that~—] explains the issue.|{person} đọc một {item} giải thích vấn đề.|That là chủ ngữ của explains, không bỏ được.
{person} thanked the person I had spoken [to~to him].|{person} cảm ơn người tôi đã nói chuyện cùng.|Giữ giới từ to, không lặp him.
`,
    ),
    94: U(
        94,
        'Dùng whose để chỉ sở hữu, whom trong kiểu trang trọng và where để chỉ nơi.|Whose + danh từ không phải who’s; whom có thể đi sau giới từ trong văn viết trang trọng.|The day/year khi dùng làm mốc có thể đi trực tiếp với mệnh đề hoặc có that/when tùy cấu trúc.',
        `
{person} knows a tutor [whose~who's] course is popular.|{person} biết gia sư có khóa học nổi tiếng.|Whose là sở hữu; who’s là who is/has.
{person} met the client to [whom~who] we had written.|{person} gặp khách hàng mà chúng tôi đã viết thư cho.|Sau giới từ đặt trước dùng whom trong kiểu trang trọng.
{person} showed us the café [where~which we] she works.|{person} chỉ quán cà phê nơi cô ấy làm.|Where biểu thị quan hệ nơi chốn.
{person} remembers the year she [moved~moved in it] to {place}.|{person} nhớ năm mình chuyển đến {place}.|Không lặp một cụm đại từ thừa cho mốc năm.
{person} knows the person [whose~whom] {device} was stolen.|{person} biết người bị mất {device}.|Whose đứng trước danh từ chỉ vật thuộc sở hữu.
{person} visited the house in [which~where] the artist lived.|{person} thăm ngôi nhà nghệ sĩ từng sống.|Đã có in phía trước thì dùng which, không in where.
`,
    ),
    95: U(
        95,
        'Phân biệt mệnh đề quan hệ xác định và mệnh đề bổ sung thông tin bằng nghĩa và dấu phẩy.|Mệnh đề bổ sung dùng who/which, không dùng that và không bỏ đại từ quan hệ.|Thông tin bổ sung không chọn ra người/vật nào trong một nhóm; tên riêng và ngữ cảnh giúp xác định trước.',
        `
{person}, [who~that] works nearby, joined us.|{person}, người làm gần đây, đã tham gia cùng chúng tôi.|Sau dấu phẩy trong mệnh đề bổ sung dùng who, không that.
The {device}, [which~that] is brand new, has failed.|{device}, vốn mới tinh, đã hỏng.|Mệnh đề bổ sung cho vật dùng which.
{person}, [whose~who's] office is upstairs, called us.|{person}, người có văn phòng trên tầng, đã gọi.|Whose diễn tả sở hữu trong mệnh đề bổ sung.
{person} owns the {device} [that~what] we tested.|{person} sở hữu {device} mà chúng tôi đã thử.|Mệnh đề xác định không dùng what sau danh từ.
{person}, who [is~she is] a tutor, helped us.|{person}, một gia sư, đã giúp chúng tôi.|Who đã là chủ ngữ, không thêm she.
The {item}, which {person} [wrote~wrote it], is ready.|{item}, do {person} viết, đã sẵn sàng.|Không lặp it vì which đã làm tân ngữ.
`,
    ),
    96: U(
        96,
        'Mở rộng mệnh đề bổ sung với giới từ + whom/which và lượng từ như both of whom.|Which còn có thể thay cho toàn bộ sự việc vừa nói, không chỉ danh từ gần nhất.|Không dùng that hoặc what thay which trong mệnh đề nhận xét cả sự việc.',
        `
{person} has two assistants, both of [whom~who] speak Thai.|{person} có hai trợ lý, cả hai đều nói tiếng Thái.|Both of whom nói về người trong mệnh đề bổ sung.
{person} owns two files, neither of [which~them] is complete.|{person} có hai tệp, không tệp nào hoàn chỉnh.|Mệnh đề quan hệ cần which, không đại từ them.
{person} arrived early, [which~what] surprised us.|{person} đến sớm, điều khiến chúng tôi ngạc nhiên.|Which thay cho cả sự việc trước đó.
{person} met the director, with [whom~who] we had worked.|{person} gặp giám đốc, người chúng tôi từng làm cùng.|Giới từ đặt trước đi với whom.
The {item}, most of [which~what] is accurate, needs editing.|{item}, phần lớn nội dung đúng, cần biên tập.|Most of which chỉ một phần của tài liệu.
{person} missed the train, [which~that] meant a delay.|{person} lỡ tàu, điều dẫn đến chậm trễ.|Mệnh đề nhận xét sự việc dùng which.
`,
    ),
    97: U(
        97,
        'Dùng mệnh đề rút gọn V-ing cho nghĩa chủ động và V3 cho nghĩa bị động.|The person talking và the files sent có thể bổ nghĩa danh từ; không bỏ yếu tố làm đổi chủ thể.|There is ... doing và something left là các mẫu hữu ích; left ở đây nghĩa còn lại.',
        `
{person} spoke to the visitor [waiting~waited] outside.|{person} nói chuyện với khách đang đợi bên ngoài.|Người tự đợi nên dùng V-ing chủ động.
{person} checked the {item} [sent~sending] yesterday by our client.|{person} kiểm tra {item} do khách gửi hôm qua.|Tài liệu được gửi nên dùng phân từ bị động.
{person} knows the person [working~worked by] at reception.|{person} biết người đang làm ở lễ tân.|Working bổ nghĩa chủ động cho person.
There are two seats [left~leaving], says {person}.|{person} nói còn lại hai ghế.|Left ở đây có nghĩa còn lại.
{person} read the instructions [printed~printing] on the box.|{person} đọc hướng dẫn in trên hộp.|Instructions được in nên dùng printed.
There is someone [asking~asked] for {person}.|Có người đang tìm gặp {person}.|There is someone doing mô tả hoạt động hiện tại.
`,
    ),
    98: U(
        98,
        'Phân biệt tính từ -ing chỉ điều tạo cảm giác và -ed chỉ người/trạng thái trải nghiệm cảm giác.|Boring làm ai chán; bored là cảm thấy chán. Người cũng có thể là interesting nếu tạo hứng thú.|Chọn giới từ theo cụm như interested in, worried about; không chọn chỉ theo người hay vật một cách máy móc.',
        `
{person} was [bored~boring] because the lecture was dull.|{person} thấy chán vì bài giảng tẻ nhạt.|Cảm giác trải nghiệm dùng bored.
{person} gave an [interesting~interested] presentation.|{person} trình bày một bài thú vị.|Bài trình bày gây hứng thú dùng interesting.
{person} is [interested~interesting] in photography.|{person} quan tâm nhiếp ảnh.|Interested in nói cảm giác quan tâm.
The delay was [frustrating~frustrated] for {person}.|Việc chậm trễ khiến {person} bực bội.|Delay tạo cảm giác nên dùng frustrating.
{person} was [surprised~surprising] by the result.|{person} ngạc nhiên trước kết quả.|Người trải nghiệm cảm giác dùng surprised.
{person} finds the journey [exhausting~exhausted].|{person} thấy hành trình thật mệt mỏi.|Hành trình gây mệt dùng exhausting.
`,
    ),
    99: U(
        99,
        'Sắp xếp tính từ trước danh từ và dùng tính từ sau các động từ nối như look, seem, become.|Thứ tự thường là đánh giá trước đặc điểm như kích thước/tuổi/màu/chất liệu; đây là xu hướng chứ không phải mọi câu đều có tất cả thành phần.|Tính từ đứng sau look/feel nói trạng thái; để nói cách làm việc, thường cần trạng từ.',
        `
{person} bought a [small wooden~wooden small] table.|{person} mua một chiếc bàn gỗ nhỏ.|Kích thước thường đứng trước chất liệu.
{person} looks [tired~tiredly] after the trip.|{person} trông mệt sau chuyến đi.|Look ở nghĩa trông có vẻ đi với tính từ.
{person} bought a [nice new~new nice] {device}.|{person} mua một {device} mới đẹp.|Tính từ đánh giá thường đứng trước tuổi/trạng thái mới.
{person} stayed for the [first two~two first] days.|{person} ở lại hai ngày đầu.|The first two là thứ tự thông thường.
{person} became [confident~confidently] with practice.|{person} trở nên tự tin nhờ luyện tập.|Become là động từ nối nên dùng tính từ.
{person} wore a [long blue~blue long] coat.|{person} mặc một chiếc áo khoác dài màu xanh.|Đặc điểm chiều dài thường trước màu sắc.
`,
    ),
    100: U(
        100,
        'Dùng tính từ bổ nghĩa danh từ/trạng thái và trạng từ bổ nghĩa cách hành động, tính từ hoặc trạng từ khác.|Quick/quickly, careful/carefully thể hiện khác vai trò; không thêm -ly sau mọi từ một cách máy móc.|Sau look/feel/sound với nghĩa động từ nối thường dùng tính từ; sau hành động nhìn/nghe theo cách nào có thể là trạng từ.',
        `
{person} checked the {item} [carefully~careful].|{person} kiểm tra {item} cẩn thận.|Carefully bổ nghĩa hành động checked.
{person} is a [careful~carefully] driver.|{person} là người lái xe cẩn thận.|Careful bổ nghĩa danh từ driver.
{person} looks [happy~happily] today.|Hôm nay {person} trông vui.|Look là động từ nối trong nghĩa này.
{person} explained the issue [clearly~clear].|{person} giải thích vấn đề rõ ràng.|Clearly bổ nghĩa explained.
{person} found the {item} [surprisingly~surprising] useful.|{person} thấy {item} hữu ích đến ngạc nhiên.|Surprisingly bổ nghĩa tính từ useful.
{person} says the {device} works [perfectly~perfect].|{person} nói {device} hoạt động hoàn hảo.|Trạng từ bổ nghĩa works.
`,
    ),
    101: U(
        101,
        'Phân biệt good/well và các cặp không theo mẫu -ly như fast, hard, late, hardly.|Well là trạng từ của good nhưng còn là tính từ khỏe; hard là chăm chỉ/mạnh, hardly là hầu như không.|Hardly any/almost no là nghĩa phủ định; không thêm not gây phủ định kép ngoài ý định.',
        `
{person} speaks English [well~good].|{person} nói tiếng Anh tốt.|Well bổ nghĩa speaks.
{person} is a [good~well] speaker.|{person} là người thuyết trình giỏi.|Good bổ nghĩa danh từ speaker.
{person} works [hard~hardly] every day and puts in great effort.|{person} làm việc chăm chỉ mỗi ngày và rất nỗ lực.|Hard nghĩa chăm chỉ; hardly đổi nghĩa thành hầu như không.
{person} can [hardly~hard] hear the announcement; it is too quiet.|{person} hầu như không nghe được thông báo vì quá nhỏ.|Hardly diễn tả gần như không.
{person} runs [fast~fastly].|{person} chạy nhanh.|Fast vừa là tính từ vừa là trạng từ.
{person} has hardly [any~no] free time.|{person} gần như không có thời gian rảnh.|Hardly đã có nghĩa phủ định nên dùng any.
`,
    ),
    102: U(
        102,
        'Dùng so với tính từ/trạng từ, such với cụm danh từ để nhấn mạnh.|Such a/an + tính từ + danh từ số ít; so much/many cho lượng. So/such ... that nêu kết quả.|Không dùng a such; danh từ số nhiều/không đếm được sau such không có a/an.',
        `
{person} was [so~such] tired that she left early.|{person} mệt đến mức về sớm.|So + tính từ.
{person} gave [such a~a such] useful talk.|{person} có một bài nói rất hữu ích.|Such a + tính từ + danh từ số ít.
{person} speaks [so~such] clearly.|{person} nói rất rõ ràng.|So + trạng từ.
{person} has [so many~such many] ideas.|{person} có rất nhiều ý tưởng.|So many + danh từ số nhiều.
{person} received [such~so] helpful advice.|{person} nhận được lời khuyên rất hữu ích.|Such + cụm danh từ không đếm được.
{person} had [such an~such a] interesting journey.|{person} có chuyến đi rất thú vị.|Interesting bắt đầu bằng âm nguyên âm nên such an.
`,
    ),
    103: U(
        103,
        'Đặt enough sau tính từ/trạng từ nhưng trước danh từ; too nói vượt mức cần thiết.|Too tired to work khác not energetic enough to work về cách cấu trúc; too much/many khác enough.|Đủ cho ai làm gì dùng enough for someone to do; đừng thêm một tân ngữ thừa khi chủ thể đã là vật được nói đến.',
        `
{person} is [old enough~enough old] to drive.|{person} đủ tuổi lái xe.|Enough đứng sau tính từ.
{person} has [enough time~time enough always] to finish.|{person} có đủ thời gian để hoàn tất.|Enough đứng trước danh từ.
{person} is [too~enough] tired to work; she needs rest.|{person} quá mệt để làm việc và cần nghỉ.|Too + tính từ + to do nói mức vượt khả năng.
{person} has [too many~too much] meetings today.|Hôm nay {person} có quá nhiều cuộc họp.|Many dùng với danh từ đếm được số nhiều.
The box is too heavy [for~of] {person} to carry.|Hộp quá nặng để {person} mang.|Too ... for someone to do.
The {device} is simple enough [to use~to use it], says {person}.|{person} nói {device} đủ đơn giản để dùng.|Không lặp it khi device là chủ ngữ.
`,
    ),
};
