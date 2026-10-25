import { unit as U } from './extended-builder.js';
export const units = {
    104: U(
        104,
        'Dùng quite/pretty/rather/fairly để diễn đạt mức độ có sắc thái, không coi chúng hoàn toàn đồng nghĩa.|Quite với tính từ có mức độ thường nghĩa khá; với impossible/certain có thể nghĩa hoàn toàn. Rather có thể nêu sự vượt kỳ vọng.|Quite a/an + tính từ + danh từ; pretty dùng thân mật hơn và không thay quite trong mọi cụm.',
        `
{person} says the task is quite [impossible~impossibly].|{person} nói nhiệm vụ hoàn toàn bất khả thi.|Quite impossible có nghĩa hoàn toàn; sau is dùng tính từ.
{person} had [quite a~a quite] busy day.|{person} có một ngày khá bận.|Quite a + tính từ + danh từ.
{person} is [fairly~fair] confident now.|Bây giờ {person} khá tự tin.|Fairly là trạng từ mức độ trước confident.
{person} says it was [rather~rathery] expensive.|{person} nói thứ đó đắt hơn mong đợi.|Rather có thể thể hiện mức vượt kỳ vọng.
{person} is [quite~prettyly] sure about the route.|{person} khá chắc về tuyến đường.|Quite là trạng từ hợp lệ; prettyly không phải dạng này.
{person} found the {device} [pretty~prettily] useful.|{person} thấy {device} khá hữu ích.|Pretty ở nghĩa khá bổ nghĩa useful; prettily nghĩa một cách đẹp.
`,
    ),
    105: U(
        105,
        'Tạo so sánh hơn bằng -er hoặc more và dùng dạng bất quy tắc.|Better/worse thay good/bad; farther/further nói khoảng cách, further còn nghĩa thêm nữa.|Không dùng đồng thời more và -er cho cùng một tính từ trong mẫu thông thường.',
        `
{person} found a [cheaper~more cheaper] {device}.|{person} tìm được {device} rẻ hơn.|Cheap dùng cheaper, không more cheaper.
{person} needs a [more reliable~reliabler] {device}.|{person} cần {device} đáng tin hơn.|Tính từ dài thường dùng more.
{person} feels [better~gooder] today.|Hôm nay {person} thấy khỏe hơn.|Good có so sánh hơn là better.
The delay was [worse~badder] than {person} expected.|Chậm trễ tệ hơn {person} tưởng.|Bad có so sánh hơn là worse.
{person} moved [further~more further] from the office.|{person} chuyển ra xa văn phòng hơn.|Further đã là dạng so sánh.
{person} needs [further~fartherly] information.|{person} cần thêm thông tin.|Further có thể nghĩa bổ sung, thêm nữa.
`,
    ),
    106: U(
        106,
        'Nhấn mức khác biệt bằng much/far/a lot/a little + so sánh hơn.|Không dùng very better; any/no + so sánh có các nghĩa như có tốt hơn chút nào/không tốt hơn.|The sooner the better và the more ... the more ... diễn tả quan hệ thay đổi; elder thường chỉ quan hệ gia đình trước danh từ.',
        `
{person} feels [much better~very better] now.|{person} thấy tốt hơn nhiều lúc này.|Much bổ nghĩa so sánh hơn.
{person} found a [slightly cheaper~slightly cheap] {device} than ours.|{person} tìm được {device} rẻ hơn của chúng tôi một chút.|Than và chênh lệch cần dạng cheaper.
Is the {device} [any better~any gooder] now, {person}?|{person}, giờ {device} có tốt hơn chút nào không?|Any có thể bổ nghĩa better trong câu hỏi.
The sooner {person} replies, the [better~best].|{person} trả lời càng sớm càng tốt.|Cụm the sooner ... the better.
The more {person} practises, the [easier~easiest] it becomes.|{person} càng luyện thì việc càng dễ.|The + so sánh hơn ở hai vế.
{person} is [older~elder] than her cousin.|{person} lớn tuổi hơn người em họ.|Sau be và trước than dùng older, không elder.
`,
    ),
    107: U(
        107,
        'So sánh ngang bằng bằng as ... as; phủ định bằng not as/so ... as.|The same as khác similar to; không nói the same like. Than nối hai vế của so sánh hơn.|Đại từ sau than/as có thể có nhiều phong cách; mở rộng mệnh đề giúp tránh mơ hồ.',
        `
{person} is as [careful~more careful] as her colleague.|{person} cẩn thận ngang đồng nghiệp.|As + tính từ nguyên dạng + as.
{person} has the same {device} [as~like] I do.|{person} có cùng loại {device} như tôi.|The same as.
The {device} is not as expensive [as~than] {person} thought.|{device} không đắt như {person} tưởng.|Cặp so sánh ngang bằng là as ... as.
{person} is more experienced [than~as] I am.|{person} có nhiều kinh nghiệm hơn tôi.|More ... than là so sánh hơn.
{person} has as [many~much] meetings as I do.|{person} có nhiều cuộc họp bằng tôi.|Many với danh từ số nhiều meetings.
{person} does not have as [much~many] time as before.|{person} không có nhiều thời gian như trước.|Much với time không đếm được.
`,
    ),
    108: U(
        108,
        'Dùng so sánh nhất để đặt một đối tượng vào vị trí cao/thấp nhất của nhóm.|The + -est/most; good → best, bad → worst. Trong cụm one of the ..., danh từ sau thường số nhiều.|In thường chỉ địa điểm/nhóm như in the team; of thường chỉ tập hợp như of all the applicants.',
        `
{person} chose the [cheapest~most cheapest] {device}.|{person} chọn {device} rẻ nhất.|Không dùng most cùng với cheapest.
{person} is one of the best [tutors~tutor] here.|{person} là một trong những gia sư giỏi nhất ở đây.|One of + nhóm số nhiều.
{person} gave the [most useful~usefulest] advice.|{person} đưa lời khuyên hữu ích nhất.|Tính từ dài dùng most.
{person} is the youngest [in~of] our team.|{person} là người trẻ nhất trong nhóm.|In + tên nhóm.
{person} was the fastest [of~in] all the applicants.|{person} nhanh nhất trong tất cả ứng viên.|Of all + một tập hợp.
It was the [worst~baddest] delay {person} had experienced.|Đó là lần chậm trễ tệ nhất {person} từng trải qua.|Bad có dạng nhất là worst.
`,
    ),
    109: U(
        109,
        'Giữ động từ và tân ngữ gần nhau; đặt cụm nơi chốn và thời gian tự nhiên.|He speaks English well khác speaks well English. Địa điểm thường trước thời gian ở cuối câu.|Trật tự có thể thay để nhấn mạnh, nhưng bài luyện này giữ mẫu trung tính và không tách động từ khỏi tân ngữ.',
        `
{person} [speaks English well~speaks well English].|{person} nói tiếng Anh tốt.|Không chen well giữa động từ và tân ngữ trực tiếp.
{person} [read the {item} carefully~read carefully the {item}].|{person} đọc {item} cẩn thận.|Mẫu trung tính đặt carefully sau tân ngữ.
{person} [put the {device} on the desk~put on the desk the {device}].|{person} đặt {device} trên bàn.|Động từ put đi ngay với tân ngữ trong mẫu này.
{person} [explained the issue clearly~explained clearly the issue].|{person} giải thích vấn đề rõ ràng.|Giữ explain + tân ngữ gần nhau.
{person} [met the client yesterday~met yesterday the client].|{person} gặp khách hàng hôm qua.|Không chen yesterday giữa met và tân ngữ ở mẫu trung tính.
{person} [finished the {item} quickly~finished quickly the {item}].|{person} hoàn tất {item} nhanh chóng.|Trạng từ cách thức ở sau tân ngữ là vị trí trung tính.
`,
    ),
    110: U(
        110,
        'Đặt trạng từ tần suất và các trạng từ giữa câu theo loại động từ.|Usually/often/never thường trước động từ chính, sau be và sau trợ động từ đầu tiên.|Vị trí trạng từ có thể thay theo nhấn mạnh; bài luyện kiểm tra vị trí trung tính, không khẳng định mọi vị trí khác đều sai.',
        `
{person} [usually works~works usually always] from home.|{person} thường làm việc ở nhà.|Usually thường đứng trước động từ chính.
{person} [is often~often is always] busy.|{person} thường bận.|Often thường đứng sau be trong mẫu trung tính.
{person} has [never~not never] used this {device}.|{person} chưa từng dùng {device} này.|Never đứng sau trợ động từ has và đã có nghĩa phủ định.
{person} will [probably~probable] send the {item} tomorrow.|Có lẽ ngày mai {person} sẽ gửi {item}.|Probably là trạng từ, đặt sau will.
{person} can [always~allway] ask for help.|{person} luôn có thể nhờ giúp.|Always có thể đứng sau modal can.
{person} [still works~works still yet] at the same office.|{person} vẫn làm ở văn phòng cũ.|Still thường đứng trước động từ chính.
`,
    ),
    111: U(
        111,
        'Dùng still cho việc tiếp tục, not any more/no longer cho việc đã chấm dứt, yet cho điều còn chờ và already cho điều đã xảy ra.|Still thường ở giữa câu; any more/yet thường ở cuối. No longer mang nghĩa phủ định nên không thêm not.|Not yet khác not any more: một việc chưa bắt đầu/xảy ra so với việc không còn tiếp diễn.',
        `
{person} is [still~yet already] waiting outside.|{person} vẫn đang đợi bên ngoài.|Still chỉ hoạt động còn tiếp tục.
{person} does not work here [any more~still].|{person} không còn làm ở đây nữa.|Not ... any more nói tình trạng đã chấm dứt.
{person} has not sent the {item} [yet~any more].|{person} chưa gửi {item}.|Yet là việc vẫn còn chờ xảy ra.
{person} has [already~not already yet] finished the {item}.|{person} đã làm xong {item} rồi.|Already nhấn kết quả đã có.
{person} [no longer uses~does not no longer use] that {device}.|{person} không còn dùng {device} đó.|No longer đã mang nghĩa phủ định.
Has {person} arrived [yet~still]?|{person} đến chưa?|Yet thường ở cuối câu hỏi về việc đang chờ.
`,
    ),
    112: U(
        112,
        'Dùng even để nêu điều bất ngờ hoặc mạnh hơn kỳ vọng.|Even có thể đứng trước thành phần được nhấn; not even nói ngay cả điều tối thiểu cũng không.|Even though nói sự thật tương phản, even if nói điều kiện giả định, even when nói những lúc như vậy.',
        `
{person} cannot [even~evenly] open the file.|{person} thậm chí không mở nổi tệp.|Even nhấn điều tối thiểu đáng ngạc nhiên.
{person} bought an [even cheaper~even cheap] {device} than ours.|{person} mua {device} còn rẻ hơn của chúng tôi nữa.|Even có thể nhấn so sánh hơn.
Even [though~—] {person} was tired, she helped.|Dù mệt nhưng {person} vẫn giúp.|Even though cần though để nối mệnh đề tương phản.
{person} will come even [if~—] it rains.|{person} vẫn sẽ đến ngay cả nếu trời mưa.|Even if mở điều kiện.
{person} helps even [when~—] she is busy.|{person} giúp ngay cả những lúc bận.|Even when mở mệnh đề thời gian.
Not [even~evenly] {person} knew the answer.|Ngay cả {person} cũng không biết đáp án.|Not even nhấn một thành viên bất ngờ.
`,
    ),
    113: U(
        113,
        'Diễn tả tương phản bằng although/though/even though + mệnh đề hoặc despite/in spite of + danh từ/V-ing.|Despite không có of; in spite of có đủ ba từ. Despite the fact that có thể đi với mệnh đề.|Không dùng although ... but trong cùng một cấu trúc chuẩn; though còn có thể đứng cuối câu trong giao tiếp.',
        `
[Although~Despite] {person} was tired, she stayed.|Dù mệt nhưng {person} vẫn ở lại.|Although đi với chủ ngữ + động từ.
{person} stayed [despite~despite of] the noise.|{person} ở lại bất chấp tiếng ồn.|Despite không có of.
{person} came in spite [of~—] the delay.|{person} vẫn đến mặc dù có chậm trễ.|Cụm đúng là in spite of.
Despite [being~was] tired, {person} continued.|Dù mệt, {person} vẫn tiếp tục.|Sau despite dùng V-ing hoặc danh từ.
Although {person} was busy, [she~but she] replied.|Mặc dù bận, {person} vẫn trả lời.|Không ghép although và but như hai từ nối của cùng cấu trúc.
{person} came despite the [fact that~fact of that] it was raining.|{person} đến dù thực tế trời đang mưa.|Despite the fact that + mệnh đề.
`,
    ),
    114: U(
        114,
        'Dùng in case để nói việc chuẩn bị vì một khả năng có thể xảy ra.|Take an umbrella in case it rains khác take it if it rains: chuẩn bị trước khác phản ứng theo điều kiện.|Không dùng will thông thường sau in case; in case of + danh từ chỉ khi có sự việc, khác in case + mệnh đề.',
        `
{person} took a charger in case the battery [ran~would ran] out.|{person} mang sạc phòng khi pin hết.|Mốc kể quá khứ dùng ran, không would ran.
{person} will take a coat in case it [gets~will gets] cold.|{person} sẽ mang áo phòng khi trời lạnh.|Mệnh đề in case tương lai thường dùng hiện tại.
{person} saved a copy [in case~in case of] the network failed.|{person} lưu bản sao phòng khi mạng hỏng.|Sau in case là một mệnh đề.
In case [of~—] fire, {person} should leave immediately.|Nếu có hỏa hoạn, {person} nên ra ngay.|In case of + danh từ.
{person} wrote the address down [in case~because of if] she forgot it.|{person} ghi địa chỉ để phòng quên.|Chuẩn bị trước một khả năng dùng in case.
{person} carries cash just in case the {device} [fails~will fails].|{person} mang tiền mặt phòng khi {device} trục trặc.|Just in case + hiện tại đơn.
`,
    ),
    115: U(
        115,
        'Dùng unless với nghĩa except if; as long as/provided/providing nêu điều kiện.|Unless đã chứa nghĩa nếu không; không thêm not làm đảo ý ngoài ý định.|Điều kiện tương lai thường dùng hiện tại trong mệnh đề phụ, không will chỉ thời gian tương lai đơn thuần.',
        `
{person} cannot enter [unless~if unless] she has a pass.|{person} không thể vào trừ khi có thẻ.|Unless tự nó là từ nối điều kiện.
{person} can borrow it as long [as~than] she returns it.|{person} có thể mượn miễn trả lại.|Cụm đúng là as long as.
{person} may join provided she [registers~will registers] first.|{person} có thể tham gia miễn đăng ký trước.|Điều kiện tương lai dùng hiện tại.
Unless {person} [calls~does not call], we will assume she is away.|Trừ khi {person} gọi, chúng tôi sẽ cho là cô ấy vắng.|Unless calls nghĩa nếu không gọi.
{person} can stay [providing~providing of] the room is available.|{person} có thể ở miễn phòng còn trống.|Providing + mệnh đề, không thêm of.
{person} can use the {device} so long [as~that] she is careful.|{person} có thể dùng {device} miễn cẩn thận.|So long as là cách nêu điều kiện.
`,
    ),
    116: U(
        116,
        'Nhận biết as ở nghĩa đồng thời và ở nghĩa vì/bởi vì.|As I was leaving ... nêu hai việc chồng thời gian; as the road was closed ... có thể nêu nguyên nhân.|When linh hoạt hơn cho các mốc nối tiếp; không thay mọi when bằng as. Vì as đa nghĩa, cần ngữ cảnh rõ.',
        `
As {person} [was leaving~was leave], the phone rang.|Khi {person} đang rời đi thì điện thoại reo.|As mở hoạt động đồng thời; was + V-ing.
Just [as~as of] {person} entered, the lights went out.|Đúng lúc {person} bước vào thì đèn tắt.|Just as nhấn đúng thời điểm.
As it [was~were] late, {person} called a taxi.|Vì đã muộn nên {person} gọi taxi.|As ở đây nêu nguyên nhân; it dùng was.
{person} smiled as she [read~reading] the {item}.|{person} mỉm cười trong lúc đọc {item}.|Sau as trong mệnh đề cần chủ ngữ và động từ hữu hạn.
As {person} [had~had to has] no cash, we paid by card.|Vì {person} không có tiền mặt nên chúng tôi trả bằng thẻ.|As nêu nguyên nhân trong mệnh đề hoàn chỉnh.
The queue grew as {person} [waited~wait].|Hàng người dài thêm trong lúc {person} chờ.|Hai việc diễn ra trong cùng giai đoạn quá khứ.
`,
    ),
    117: U(
        117,
        'Phân biệt like + danh từ nghĩa giống với as + danh từ nghĩa vai trò/chức năng.|As + mệnh đề có thể nghĩa theo cách, như đã nói; such as đưa ví dụ.|Like + mệnh đề xuất hiện trong giao tiếp, nhưng bài viết trang trọng thường chọn as khi nói cách thực hiện.',
        `
{person} works [as~like only] a tutor; that is her job.|{person} làm gia sư; đó là nghề của cô ấy.|As + danh từ chỉ vai trò thực tế.
{person} looks [like~as] her sister.|{person} trông giống chị gái.|Like + cụm danh từ cho sự giống nhau.
Do [as~as to] {person} says.|Hãy làm theo điều {person} nói.|As + mệnh đề chỉ cách làm.
{person} enjoys sports such [as~like as] tennis.|{person} thích các môn như quần vợt.|Such as giới thiệu ví dụ.
{person} arrived late, [as~like to] usual.|{person} đến muộn như thường lệ.|As usual là cụm cố định.
{person} used a box [as~as if] a temporary table.|{person} dùng hộp làm bàn tạm.|As nói công dụng/vai trò trong tình huống.
`,
    ),
    118: U(
        118,
        'Dùng like/as if/as though để mô tả vẻ ngoài hoặc cách hành xử như thể một điều đúng.|As if + quá khứ có thể nhấn điều không thật ở hiện tại; không phải mọi quá khứ sau as if đều mang nghĩa này.|Look/sound/feel like + danh từ và as if + mệnh đề giúp phân biệt cấu trúc khi viết rõ ràng.',
        `
{person} looks [as if~as] she needs a break.|{person} trông như thể cần nghỉ.|As if mở một mệnh đề so sánh giả định.
{person} acts as if she [owned~would own to] the place.|{person} hành xử như thể là chủ nơi này.|Quá khứ có thể chỉ giả định trái hiện tại.
It sounds [like~as] a good idea to {person}.|Với {person}, nghe có vẻ là ý hay.|Like + cụm danh từ.
{person} talks as [though~than] she knows everyone.|{person} nói như thể quen tất cả.|As though tương đương as if.
{person} looks as if she [has seen~has saw] a ghost.|{person} trông như vừa gặp ma.|Mệnh đề sau as if dùng cấu trúc thì hợp lệ.
{person} treated the {device} as if it [were~will were] unbreakable.|{person} đối xử với {device} như thể không thể hỏng.|Were diễn tả giả định về đặc tính.
`,
    ),
    119: U(
        119,
        'Dùng for cho thời lượng, during + danh từ cho khoảng có sự kiện, while + mệnh đề cho hai việc đồng thời.|During the meeting nói khi nào; for two hours nói bao lâu. Không dùng during two hours để thay for.|While doing có thể lược chủ ngữ khi cùng chủ thể; tránh lẫn while + danh từ trần với during.',
        `
{person} waited [for~during] two hours.|{person} đợi hai giờ.|For + độ dài thời gian.
{person} called [during~while] the meeting.|{person} gọi trong cuộc họp.|During + cụm danh từ.
{person} called [while~during] I was working.|{person} gọi trong lúc tôi đang làm.|While + chủ ngữ + động từ.
{person} read the {item} while [waiting~waited] for the train.|{person} đọc {item} trong lúc đợi tàu.|While doing khi cùng chủ thể.
{person} stayed in {place} [for~during] three weeks.|{person} ở {place} ba tuần.|Nêu độ dài bằng for.
{person} felt ill [during~while] the flight.|{person} thấy mệt trong chuyến bay.|During chỉ khoảng sự kiện với danh từ flight.
`,
    ),
    120: U(
        120,
        'Dùng by cho hạn chót và until/till cho khoảng tiếp tục đến mốc.|By the time + mệnh đề thường đối chiếu điều đã hoàn tất; không đồng nghĩa với until.|By Friday nghĩa không muộn hơn thứ Sáu; until Friday nghĩa tình trạng tiếp tục đến lúc đó.',
        `
{person} must submit the {item} [by~until] Friday.|{person} phải nộp {item} chậm nhất thứ Sáu.|By nêu hạn hoàn thành.
{person} will stay here [until~by] Friday.|{person} sẽ ở đây đến thứ Sáu.|Until nêu thời điểm kết thúc tình trạng kéo dài.
By the time {person} arrived, we [had left~have left].|Lúc {person} đến thì chúng tôi đã đi.|Nhìn ngược từ một mốc quá khứ dùng had left.
{person} will have finished [by~until] then.|Đến lúc đó {person} sẽ làm xong.|By then là trước hoặc đúng mốc đó.
{person} cannot leave [until~by] the {item} is signed.|{person} chưa thể đi cho đến khi {item} được ký.|Not ... until nói phải chờ mốc điều kiện.
By the time {person} [gets~will gets] home, dinner will be ready.|Khi {person} về tới nhà thì bữa tối sẽ sẵn sàng.|Mệnh đề thời gian tương lai thường dùng hiện tại đơn.
`,
    ),
};
