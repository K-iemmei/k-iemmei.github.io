import { unit as U } from './extended-builder.js';
export const units = {
    38: U(
        38,
        'Phân biệt if + hiện tại cho điều kiện thực tế và if + quá khứ cho giả định ít thực tế.|Kết quả thường dùng will trong điều kiện thực tế và would trong giả định; dạng quá khứ không luôn chỉ thời gian quá khứ.|Không đặt would vào mệnh đề if thông thường; ngoại lệ như sự sẵn lòng có nghĩa riêng.',
        `
If {person} [has~will has] time, she will help.|Nếu {person} có thời gian thì sẽ giúp.|Mệnh đề điều kiện thực tế dùng hiện tại.
If {person} [had~would have] more time, she would travel.|Nếu có nhiều thời gian hơn thì {person} sẽ đi du lịch.|Giả định hiện tại dùng had trong mệnh đề if.
{person} [will call~will calls] if the {device} fails.|{person} sẽ gọi nếu {device} hỏng.|Will + nguyên mẫu ở mệnh đề kết quả.
If {person} found the key, she [would return~would returned] it.|Nếu tìm thấy chìa khóa thì {person} sẽ trả lại.|Would + nguyên mẫu trong giả định.
What would {person} [do~did] if the train stopped?|{person} sẽ làm gì nếu tàu dừng?|Sau would dùng do.
Unless {person} calls, we [will wait~will waits] here.|Trừ khi {person} gọi thì chúng tôi sẽ đợi ở đây.|Will không thêm s.
`,
    ),
    39: U(
        39,
        'Diễn tả giả định hiện tại và điều ước trái với thực tế bằng dạng quá khứ.|I wish I knew diễn tả hiện tại chưa biết; if I were ... thường dùng trong giả định, was cũng xuất hiện trong giao tiếp.|Could diễn tả khả năng mong muốn; đừng dùng wish + would cho mọi điều ước về bản thân.',
        `
If {person} [knew~would know] the answer, she would tell us.|Nếu biết đáp án thì {person} sẽ nói.|If + quá khứ diễn tả giả định hiện tại.
{person} wishes she [lived~lives] closer to work.|{person} ước sống gần chỗ làm hơn.|Wish + quá khứ cho điều trái hiện tại.
If I [were~am] {person}, I would ask for help.|Nếu là {person} thì tôi sẽ nhờ giúp.|Were trong giả định không có thật.
{person} wishes she [could~can to] speak Italian.|{person} ước biết nói tiếng Ý.|Could diễn tả khả năng đang thiếu.
{person} would buy the {device} if it [were~would be] cheaper.|{person} sẽ mua {device} nếu rẻ hơn.|Mệnh đề if không dùng would be trong mẫu này.
I wish {person} [were~is] here now.|Tôi ước {person} có mặt ở đây lúc này.|Wish với were nói điều trái hiện tại.
`,
    ),
    40: U(
        40,
        'Dùng if + had done và would/could/might have done để nhìn lại một quá khứ không xảy ra.|Wish + had done bày tỏ hối tiếc quá khứ; không dùng wish would have như một thay thế chung.|Would have nói kết quả giả định; could/might have nêu khả năng, không khẳng định chắc chắn.',
        `
If {person} [had left~would have left] earlier, she would have caught the train.|Nếu đi sớm hơn thì {person} đã kịp tàu.|If + quá khứ hoàn thành.
{person} wishes she [had saved~would have saved] the {item}.|{person} ước trước đó đã lưu {item}.|Wish + had done cho hối tiếc quá khứ.
{person} would have [helped~help] if we had asked.|{person} đã có thể giúp nếu chúng tôi nhờ.|Would have + phân từ.
If {person} had known, she [would not have signed~would not sign yesterday] the {item}.|Nếu biết trước thì {person} đã không ký {item}.|Kết quả giả định trong quá khứ dùng would have.
{person} could have [joined~join] us if the train had arrived.|{person} đã có thể tham gia nếu tàu đến.|Could have cần phân từ.
If {person} [had not forgotten~has not forgotten] the key, she could have entered.|Nếu không quên chìa khóa thì {person} đã vào được.|Điều kiện trái quá khứ dùng had not.
`,
    ),
    41: U(
        41,
        'Phân biệt wish cho điều ước trái thực tế, hope cho một khả năng tương lai và wish someone luck cho lời chúc.|Wish + quá khứ hoặc quá khứ hoàn thành tùy mốc thời gian; wish + could nói khả năng.|Wish + would thường muốn ai/sự việc thay đổi hoặc thể hiện khó chịu, không dùng tùy tiện thay hiện tại đơn.',
        `
I [wish~hope] {person} good luck.|Tôi chúc {person} may mắn.|Wish someone something là mẫu lời chúc.
I [hope~wish] {person} passes the exam tomorrow.|Tôi hy vọng ngày mai {person} thi đỗ.|Hope dùng cho điều tương lai có thể xảy ra.
{person} wishes she [had~has] more free time now.|{person} ước bây giờ có nhiều thời gian hơn.|Wish + quá khứ nói điều trái hiện tại.
{person} wishes she [had not sent~did not send tomorrow] the message yesterday.|{person} ước hôm qua mình đã không gửi tin nhắn.|Hối tiếc quá khứ dùng had not sent.
{person} wishes the neighbours [would stop~will stop] shouting.|{person} mong hàng xóm thôi la hét.|Would nói mong muốn sự thay đổi hành vi.
{person} wishes she [could~can to] attend the concert.|{person} ước có thể dự buổi hòa nhạc.|Could nói khả năng mong muốn.
`,
    ),
    42: U(
        42,
        'Dùng bị động khi tập trung vào người/vật chịu tác động thay vì người thực hiện.|Cấu trúc cơ bản là be + V3; be đổi theo thì và chủ ngữ, phân từ không đổi.|By giới thiệu tác nhân khi cần; không phải động từ nào cũng có thể chuyển sang bị động.',
        `
The {item} [is checked~is check] by {person} every Friday.|{item} được {person} kiểm tra mỗi thứ Sáu.|Bị động hiện tại đơn là is + V3.
The {device} [was repaired~was repair] yesterday for {person}.|Hôm qua {device} đã được sửa cho {person}.|Was + repaired diễn tả bị động quá khứ.
The {item} was written [by~with] {person}.|{item} do {person} viết.|By giới thiệu người thực hiện.
Is the {item} [approved~approve] by {person}?|{item} đã được {person} chấp thuận chưa?|Sau be dùng phân từ approved.
The {device} [is not used~does not used] by {person}.|{person} không sử dụng {device}.|Phủ định bị động dùng be not + V3.
When [was~did] the {item} signed by {person}?|{item} được {person} ký khi nào?|Câu hỏi bị động quá khứ dùng was.
`,
    ),
    43: U(
        43,
        'Tạo bị động với các thì hoàn thành, tiếp diễn và động từ khuyết thiếu.|Have/has been done khác is being done; không lược bỏ been/being khi cấu trúc yêu cầu.|Modal + be done, modal + have been done giúp giữ đúng quan hệ thời gian và khả năng.',
        `
The {item} has [been approved~being approved] by {person}.|{item} đã được {person} chấp thuận.|Hoàn thành bị động cần been + V3.
The {device} is [being repaired~been repaired] for {person} now.|{device} đang được sửa cho {person}.|Tiếp diễn bị động là is being + V3.
The {item} must [be signed~signed] by {person}.|{item} phải được {person} ký.|Modal + be + phân từ.
The {item} should have [been sent~being sent] to {person}.|Đáng lẽ {item} phải được gửi cho {person}.|Should have been + V3.
The {device} will [be delivered~be deliver] to {person} tomorrow.|{device} sẽ được giao cho {person} ngày mai.|Will be + phân từ.
The {item} had [been checked~been checking] before {person} arrived.|{item} đã được kiểm tra trước khi {person} đến.|Chủ thể chịu tác động: had been checked.
`,
    ),
    44: U(
        44,
        'Dùng đúng bị động của động từ có hai tân ngữ, dạng being done và get + V3.|I was given something và something was given to me đều có thể đúng; born thường dùng was/were born.|Get passive thường dùng trong giao tiếp cho sự việc xảy ra, không thay mọi trạng thái be bằng get.',
        `
{person} [was given~was gave] a new {device}.|{person} được cấp một {device} mới.|Give có phân từ given.
{person} dislikes [being interrupted~be interrupted].|{person} không thích bị ngắt lời.|Sau dislikes dùng V-ing: being interrupted.
{person} [was born~is born] in {place} in 1995.|{person} sinh ở {place} năm 1995.|Nói thời điểm sinh bằng was born.
{person} got [promoted~promote] last month.|{person} được thăng chức tháng trước.|Get + V3 diễn tả sự kiện bị động.
The {item} was shown [to~for to] {person}.|{item} được đưa cho {person} xem.|Show something to someone.
{person} hopes [to be selected~to selected] for the team.|{person} mong được chọn vào nhóm.|Bị động của to select là to be selected.
`,
    ),
    45: U(
        45,
        'Tường thuật nhận định bằng It is said that ... hoặc someone is said to ...|To have done chỉ sự việc trước thời điểm nhận định; to be doing chỉ việc đang diễn ra.|Be supposed to còn có nghĩa được kỳ vọng, theo kế hoạch hoặc theo quy định, không chỉ là được đồn.',
        `
{person} is said [to be~be] an excellent tutor.|Người ta nói {person} là gia sư giỏi.|Is said + to-infinitive.
It is [believed~believe] that {person} owns the shop.|Người ta tin rằng {person} sở hữu cửa hàng.|It is believed that + mệnh đề.
{person} is reported to have [left~leave] the country.|Có tin {person} đã rời khỏi đất nước.|To have left nói sự việc xảy ra trước tin báo.
{person} is thought to be [working~worked] abroad.|Người ta cho rằng {person} đang làm ở nước ngoài.|To be working biểu thị hoạt động đang diễn ra.
{person} is supposed [to arrive~arrive] at nine.|Theo kế hoạch {person} phải đến lúc chín.|Supposed to + nguyên mẫu.
{person} is not supposed [to share~sharing] that code.|Theo quy định {person} không được chia sẻ mã đó.|Not supposed to chỉ điều không được kỳ vọng/cho phép.
`,
    ),
    46: U(
        46,
        'Dùng have/get something done khi sắp xếp để người khác làm việc cho mình.|Have + tân ngữ + V3 khác chủ động tự làm; have something done cũng có thể nói trải nghiệm không mong muốn.|Have đổi theo thì; vị trí tân ngữ trước phân từ phải được giữ.',
        `
{person} had the {device} [repaired~repair] yesterday.|Hôm qua {person} nhờ sửa {device}.|Had + tân ngữ + V3.
{person} is having her hair [cut~cutting] today.|Hôm nay {person} đi cắt tóc.|Đối tượng hair chịu tác động nên dùng cut.
{person} will have the {item} [translated~translate].|{person} sẽ thuê dịch {item}.|Will have something translated.
{person} got the {device} [checked~checking] professionally.|{person} đem {device} đi kiểm tra chuyên nghiệp.|Get something checked tương tự have something checked.
{person} had her bag [stolen~steal] on the train.|{person} bị lấy cắp túi trên tàu.|Have something stolen là trải nghiệm, không phải thuê người làm.
Where does {person} have her shoes [repaired~repair]?|{person} thường sửa giày ở đâu?|Have + shoes + repaired.
`,
    ),
    47: U(
        47,
        'Chuyển lời nói trực tiếp sang lời tường thuật, chú ý đại từ, thì và mốc thời gian.|Sau said trong lời kể quá khứ, thì thường lùi: am → was, have done → had done, will → would.|Lùi thì thể hiện điểm nhìn; không máy móc đổi mọi từ thời gian nếu ngữ cảnh vẫn giữ nguyên.',
        `
{person} said she [was~were] busy that morning.|{person} nói sáng hôm đó mình bận.|She đi với was trong lời kể quá khứ.
{person} said she [had finished~has finish] the {item}.|{person} nói mình đã xong {item}.|Lùi hiện tại hoàn thành thành had finished.
{person} said she [would~will to] call later.|{person} nói sẽ gọi sau.|Will thường lùi thành would.
{person} told us that she [could~can to] help.|{person} nói với chúng tôi rằng có thể giúp.|Can lùi thành could, không thêm to.
{person} said she [did not know~did not knew] the answer.|{person} nói mình không biết đáp án.|Did not + nguyên mẫu.
{person} said that the {device} [had stopped~had stop] working.|{person} nói {device} đã ngừng hoạt động.|Had + phân từ stopped.
`,
    ),
    48: U(
        48,
        'Chọn say/tell/ask và quyết định có cần lùi thì theo sự thật còn hiệu lực.|Tell cần người nghe trực tiếp: tell me; say something to me. Tell/ask someone to do dùng cho chỉ dẫn.|Nếu thông tin vẫn đúng có thể giữ thì; khi việc đã thay đổi, lùi thì giúp tránh hiểu nhầm.',
        `
{person} [told~said] me the office was closed.|{person} nói với tôi rằng văn phòng đóng cửa.|Tell đi trực tiếp với người nghe.
{person} said [to~—] me that she was ready.|{person} nói với tôi rằng đã sẵn sàng.|Say to someone cần to.
{person} asked me [to wait~wait] outside.|{person} yêu cầu tôi đợi bên ngoài.|Ask someone to do.
{person} told us [not to touch~to not touching] the {device}.|{person} dặn chúng tôi đừng chạm vào {device}.|Tell someone not to do.
{person} said the earth [is~are] round; this remains true.|{person} nói Trái Đất tròn; điều này vẫn đúng.|Có thể giữ hiện tại cho sự thật còn đúng.
{person} [said~told] that the {item} was complete.|{person} nói rằng {item} đã hoàn tất.|Không có người nghe sau động từ thì dùng said.
`,
    ),
    49: U(
        49,
        'Tạo câu hỏi với trợ động từ; phân biệt hỏi chủ ngữ và hỏi tân ngữ.|Who called? không cần did; Who did you call? cần did vì you là chủ ngữ.|Giới từ thường ở cuối trong giao tiếp; câu hỏi phủ định có thể biểu thị ngạc nhiên hoặc chờ xác nhận.',
        `
Who [sent~did sent] the {item} to {person}?|Ai gửi {item} cho {person}?|Who là chủ ngữ nên không thêm did.
Who [did~—] {person} call yesterday?|Hôm qua {person} đã gọi cho ai?|Who là tân ngữ, cần did.
Why [does~do] {person} work late?|Tại sao {person} làm muộn?|Chủ ngữ số ít dùng does.
What [is~does] {person} looking for?|{person} đang tìm gì?|Looking cần trợ động từ is.
Who was {person} talking [to~—]?|{person} đang nói chuyện với ai?|Talk to; giới từ có thể ở cuối câu hỏi.
Has {person} [finished~finish] the {item}?|{person} đã xong {item} chưa?|Has + chủ ngữ + phân từ.
`,
    ),
    50: U(
        50,
        'Dùng trật tự chủ ngữ–động từ trong câu hỏi gián tiếp và lời thuật lại câu hỏi.|Do you know where she lives? không đảo does she live trong mệnh đề phụ.|Câu hỏi yes/no gián tiếp dùng if/whether; trợ động từ chính vẫn theo cấu trúc câu dẫn.',
        `
Do you know where {person} [lives~does live]?|Bạn có biết {person} sống ở đâu không?|Mệnh đề phụ dùng trật tự trần thuật.
Can you tell me what time {person} [arrives~does arrive]?|Bạn cho biết {person} đến lúc mấy giờ được không?|Không đảo trợ động từ bên trong câu hỏi gián tiếp.
I wonder [if~that] {person} is available.|Tôi tự hỏi {person} có rảnh không.|If mở câu hỏi yes/no gián tiếp.
{person} asked where the station [was~was it].|{person} hỏi nhà ga ở đâu.|Không lặp thêm chủ ngữ it sau was.
Do you know [whether~what whether] {person} has left?|Bạn biết {person} đã đi hay chưa không?|Whether diễn tả có hay không.
{person} asked how much the {device} [cost~did it cost].|{person} hỏi {device} giá bao nhiêu.|Lời thuật câu hỏi dùng chủ ngữ trước động từ.
`,
    ),
    51: U(
        51,
        'Dùng trợ động từ để tránh lặp, đáp lời, nhấn mạnh và diễn tả sự tương đồng.|So do I/Neither do I cần trợ động từ phù hợp thì; câu khẳng định và phủ định dùng mẫu khác nhau.|I think so/I hope so khác I don’t think so/I hope not; không áp dụng một công thức phủ định cho mọi động từ.',
        `
{person} likes tea, and so [do~am] I.|{person} thích trà và tôi cũng vậy.|Hiện tại đơn dùng do trong so do I.
{person} cannot swim, and neither [can~does] I.|{person} không biết bơi và tôi cũng không.|Lặp đúng modal can.
{person} has finished, and so [have~do] we.|{person} đã xong và chúng tôi cũng vậy.|Hoàn thành dùng have.
Will {person} pass? I hope [so~it].|{person} sẽ đỗ chứ? Tôi hy vọng vậy.|Hope so thay cho mệnh đề khẳng định.
Is {person} leaving? I hope [not~do not so].|{person} sắp đi à? Tôi hy vọng không.|Hope not là dạng phủ định thích hợp.
{person} thinks the {device} works, but I do not think [so~it].|{person} nghĩ {device} chạy được nhưng tôi không nghĩ vậy.|Think so thay cho nội dung đã nói.
`,
    ),
    52: U(
        52,
        'Tạo câu hỏi đuôi với trợ động từ, cực tính và đại từ phù hợp.|Câu khẳng định thường đi với đuôi phủ định; câu phủ định đi với đuôi khẳng định. Ý nghĩa còn phụ thuộc ngữ điệu.|I am ... aren’t I? và Let’s ... shall we? là các mẫu cần nhớ; trả lời yes/no theo sự thật.',
        `
{person} is ready, [isn't she~doesn't she]?|{person} sẵn sàng rồi nhỉ?|Động từ be lặp bằng is trong câu hỏi đuôi.
{person} does not drive, [does she~doesn't she]?|{person} không lái xe đúng không?|Mệnh đề phủ định dùng đuôi khẳng định.
{person} has finished, [hasn't she~doesn't she]?|{person} đã xong rồi nhỉ?|Hoàn thành dùng has trong đuôi.
{person} called yesterday, [didn't she~doesn't she]?|Hôm qua {person} có gọi đúng không?|Quá khứ đơn dùng did.
Let us invite {person}, [shall we~do we]?|Mình mời {person} nhé?|Let us mang nghĩa đề nghị dùng shall we.
I am next after {person}, [aren't I~amn't I]?|Sau {person} là đến tôi nhỉ?|Câu hỏi đuôi chuẩn của I am là aren’t I.
`,
    ),
    53: U(
        53,
        'Học các động từ đi với V-ing như enjoy, avoid, finish, suggest và mind.|Dạng phủ định là not doing; having done có thể nhấn mạnh sự việc xảy ra trước.|Không thay V-ing bằng to-infinitive chỉ vì tiếng Việt đều dịch là làm gì.',
        `
{person} enjoys [working~to work] with this team.|{person} thích làm việc với nhóm này.|Enjoy + V-ing.
{person} avoided [answering~to answer] the question.|{person} tránh trả lời câu hỏi.|Avoid + V-ing.
{person} has finished [checking~to check] the {item}.|{person} đã kiểm tra xong {item}.|Finish + V-ing.
{person} suggested [using~to use] another {device}.|{person} đề nghị dùng {device} khác.|Suggest + V-ing khi đề xuất hoạt động.
{person} does not mind [waiting~to wait].|{person} không ngại chờ.|Mind + V-ing.
{person} admitted [making~to make] a mistake.|{person} thừa nhận đã mắc lỗi.|Admit + V-ing.
`,
    ),
    54: U(
        54,
        'Học các động từ đi với to-infinitive như decide, promise, refuse, manage và offer.|To be doing diễn tả hoạt động đang diễn ra; to have done nhìn về sự việc trước đó.|Không dùng quy tắc một kiểu cho mọi động từ: dạng đi sau phụ thuộc từ và nghĩa.',
        `
{person} decided [to apply~applying] for the course.|{person} quyết định đăng ký khóa học.|Decide + to do.
{person} promised [to send~sending] the {item}.|{person} hứa gửi {item}.|Promise + to-infinitive.
{person} refused [to sign~signing] the {item}.|{person} từ chối ký {item}.|Refuse + to do.
{person} managed [to repair~repairing] the {device}.|{person} đã sửa được {device}.|Manage + to do nói một lần làm được.
{person} offered [to help~helping] with the move.|{person} đề nghị giúp chuyển nhà.|Offer + to do.
{person} seems [to have forgotten~to has forgotten] the meeting.|Có vẻ {person} đã quên cuộc họp.|To have + V3 là nguyên mẫu hoàn thành.
`,
    ),
    55: U(
        55,
        'Dùng verb + object + to-infinitive với want, ask, tell, allow và persuade.|Make/let someone do không có to ở chủ động; bị động của make là be made to do.|Help có thể có hoặc không có to; suggest không theo mẫu suggest someone to do.',
        `
I want {person} [to check~check] the {item}.|Tôi muốn {person} kiểm tra {item}.|Want someone to do.
We asked {person} [to wait~waiting] outside.|Chúng tôi yêu cầu {person} đợi bên ngoài.|Ask someone to do.
The manager let {person} [leave~to leave] early.|Quản lý cho {person} về sớm.|Let + tân ngữ + nguyên mẫu không to.
The noise made {person} [wake~to wake] up.|Tiếng ồn làm {person} thức giấc.|Make ở chủ động không có to.
{person} was made [to repeat~repeat] the test.|{person} bị yêu cầu làm lại bài thi.|Bị động của make cần to.
We persuaded {person} [to join~joining] the club.|Chúng tôi thuyết phục {person} tham gia câu lạc bộ.|Persuade someone to do.
`,
    ),
    56: U(
        56,
        'Phân biệt remember/forget/regret/stop + V-ing với to-infinitive theo ý nghĩa.|Remember doing nhớ việc đã làm; remember to do nhớ phải làm. Stop doing dừng việc; stop to do dừng để làm việc khác.|Regret doing hối tiếc điều đã làm; regret to inform dùng khi báo tin đáng tiếc. Begin/start thường linh hoạt hơn.',
        `
{person} remembered [to lock~locking already tomorrow] the door before leaving.|{person} nhớ phải khóa cửa trước khi đi.|Remember to do là nhớ việc cần làm.
{person} remembers [meeting~to meet yesterday already] the tutor last year.|{person} nhớ đã gặp gia sư năm ngoái.|Remember doing là nhớ trải nghiệm trước đó.
{person} stopped [checking~to checking] emails to rest.|{person} ngừng xem email để nghỉ.|Stop doing là dừng hoạt động đó.
{person} stopped [to buy~buying to] some water on the way home.|{person} dừng lại để mua nước trên đường về.|Stop to do là dừng để thực hiện việc khác.
{person} regrets [sharing~to sharing] that message.|{person} hối tiếc vì đã chia sẻ tin nhắn đó.|Regret doing nói điều đã làm.
{person} regrets [to inform~informing to] you that the event is cancelled.|{person} rất tiếc phải thông báo sự kiện bị hủy.|Regret to inform là cách báo tin đáng tiếc.
`,
    ),
    57: U(
        57,
        'Phân biệt try to do cố làm, try doing thử một cách; need doing mang nghĩa cần được làm.|Help do/help to do đều được; can’t help doing nghĩa không nhịn được, không phải không thể trợ giúp.|Need + V-ing nói đối tượng cần được xử lý, tương đương need to be done.',
        `
{person} tried [to open~open to] the jammed window but failed.|{person} cố mở cửa sổ bị kẹt nhưng không được.|Try to do nhấn nỗ lực.
{person} tried [restarting~restart to] the {device} as a possible solution.|{person} thử khởi động lại {device} như một cách xử lý.|Try doing là thử một phương pháp.
The {device} needs [cleaning~to cleaning], says {person}.|{person} nói {device} cần được lau.|Need doing mang nghĩa bị động.
The {device} needs [to be repaired~to repairing], says {person}.|{person} nói {device} cần được sửa.|Need to be + V3 tương đương need repairing.
{person} could not help [laughing~to laugh] at the joke.|{person} không nhịn được cười trước câu đùa.|Can’t help + V-ing.
{person} helped me [carry~carrying] the boxes.|{person} giúp tôi mang các hộp.|Help someone do; to carry cũng có thể dùng trong mẫu khác.
`,
    ),
    58: U(
        58,
        'Phân biệt like/love/hate + V-ing hoặc to-infinitive với would like/love + to-infinitive.|V-ing thường tập trung vào trải nghiệm hoạt động; to do có thể tập trung lựa chọn, thói quen hoặc điều thấy nên làm.|Would like to have done diễn tả mong muốn nhìn lại quá khứ; không dùng would like doing thay cho lời mời thông thường.',
        `
{person} would like [to visit~visiting] {place}.|{person} muốn đến thăm {place}.|Would like + to do.
{person} enjoys [reading~to read] on the train.|{person} thích đọc trên tàu.|Enjoy chỉ đi với V-ing, dù like linh hoạt hơn.
{person} would love [to join~joining] the workshop.|{person} rất muốn tham gia hội thảo.|Would love + to-infinitive.
{person} likes [to check~to checking] the {device} before travelling.|{person} thích kiểm tra {device} trước khi đi.|Like to do có thể nói thói quen có chủ ý.
{person} would hate [to lose~losing to] that {item}.|{person} rất không muốn làm mất {item} đó.|Would hate + to do.
{person} would like to have [attended~attend] the earlier session.|{person} ước đã có thể dự buổi trước.|To have + phân từ nhìn về quá khứ.
`,
    ),
    59: U(
        59,
        'Dùng prefer, would prefer và would rather đúng cấu trúc so sánh hoặc lựa chọn.|Prefer doing to doing; prefer to do rather than do; would rather do than do.|Would rather + người khác + quá khứ thường diễn tả mong muốn hiện tại/tương lai, không phải kể quá khứ.',
        `
{person} prefers tea [to~than] coffee.|{person} thích trà hơn cà phê.|Prefer A to B.
{person} would prefer [to stay~staying to] at home tonight.|Tối nay {person} muốn ở nhà hơn.|Would prefer + to do.
{person} would rather [walk~to walk] than take a taxi.|{person} muốn đi bộ hơn đi taxi.|Would rather + nguyên mẫu không to.
{person} prefers cycling to [driving~drive].|{person} thích đạp xe hơn lái ô tô.|Prefer V-ing to V-ing.
I would rather {person} [came~comes] tomorrow.|Tôi muốn {person} đến ngày mai hơn.|Người khác + quá khứ trong would rather.
{person} would rather not [discuss~to discuss] the {item} now.|{person} không muốn bàn {item} lúc này.|Would rather not + nguyên mẫu.
`,
    ),
    60: U(
        60,
        'Sau giới từ, động từ thường ở dạng V-ing; to không phải lúc nào cũng là dấu nguyên mẫu.|Before/after doing lược mệnh đề khi chủ thể phù hợp; by doing diễn tả phương pháp.|Look forward to và object to có to là giới từ; không dùng nguyên mẫu sau các cụm này.',
        `
{person} left without [saying~to say] goodbye.|{person} đi mà không chào tạm biệt.|Without là giới từ nên theo sau bằng V-ing.
{person} is interested in [learning~learn] Korean.|{person} quan tâm việc học tiếng Hàn.|In + V-ing.
{person} checked the {device} before [leaving~leave].|{person} kiểm tra {device} trước khi đi.|Before doing có cùng chủ thể.
{person} improved by [practising~practise to] daily.|{person} tiến bộ nhờ luyện tập hằng ngày.|By doing chỉ cách thức.
{person} looks forward to [meeting~meet] the team.|{person} mong được gặp nhóm.|To trong look forward to là giới từ.
{person} is tired of [waiting~to wait].|{person} chán việc chờ đợi.|Of + V-ing.
`,
    ),
    61: U(
        61,
        'Be used to + danh từ/V-ing nghĩa quen với; get used to là quá trình trở nên quen.|Used to do diễn tả thói quen đã qua và không có be; hai cấu trúc khác cả nghĩa và dạng động từ.|Sau be/get used to, to là giới từ nên không dùng nguyên mẫu.',
        `
{person} is used to [working~work] at night.|{person} quen làm việc ban đêm.|Be used to + V-ing.
{person} is getting used to [living~live] in {place}.|{person} đang dần quen sống ở {place}.|Get used to nhấn quá trình thích nghi.
{person} used to [live~living] in {place}, but moved away.|{person} trước kia sống ở {place} nhưng đã chuyển đi.|Used to không có be đi với nguyên mẫu.
Is {person} used to [the noise~be noise]?|{person} quen với tiếng ồn chưa?|Sau to có thể là danh từ.
{person} was not used to [driving~drive] on the left.|{person} chưa quen lái xe bên trái.|Be used to + V-ing ở quá khứ.
It took {person} months to get used to [using~use] the {device}.|{person} mất nhiều tháng để quen dùng {device}.|Sau get used to vẫn là V-ing.
`,
    ),
    62: U(
        62,
        'Học cụm động từ + giới từ + V-ing như succeed in, insist on, think of và approve of.|Có thể chèn người thực hiện trước V-ing: someone from doing; chú ý giới từ là thành phần của cụm.|Stop someone doing/from doing đều có thể gặp; không suy ra mọi động từ đều theo mẫu ấy.',
        `
{person} succeeded in [finding~to find] the error.|{person} đã thành công tìm ra lỗi.|Succeed in + V-ing.
{person} insisted on [paying~to pay] the bill.|{person} khăng khăng đòi trả tiền.|Insist on + V-ing.
{person} is thinking of [moving~to move] to {place}.|{person} đang nghĩ tới việc chuyển đến {place}.|Think of + V-ing.
We prevented {person} from [entering~enter].|Chúng tôi ngăn {person} đi vào.|Prevent someone from doing.
{person} apologised for [arriving~to arrive] late.|{person} xin lỗi vì đến muộn.|Apologise for + V-ing.
{person} does not approve of [sharing~share] passwords.|{person} không tán thành việc chia sẻ mật khẩu.|Approve of + V-ing.
`,
    ),
    63: U(
        63,
        'Dùng các cụm no point in doing, worth doing, have difficulty doing và spend time doing.|Worth có nghĩa đáng làm và không dùng to do trong cấu trúc này; danh từ vật có thể làm chủ ngữ của worth reading.|Go + V-ing thường dùng cho hoạt động như shopping/swimming, không áp dụng cho mọi động từ.',
        `
There is no point in [calling~to call] {person} now.|Giờ gọi {person} cũng không ích gì.|No point in + V-ing.
The {item} is worth [reading~to read], says {person}.|{person} nói {item} đáng đọc.|Worth + V-ing.
{person} had difficulty [finding~to find] the office.|{person} gặp khó khăn tìm văn phòng.|Have difficulty + V-ing.
{person} spent an hour [checking~to check] the {item}.|{person} dành một giờ kiểm tra {item}.|Spend time doing.
{person} went [swimming~to swimming] after work.|{person} đi bơi sau giờ làm.|Go swimming là cụm hoạt động.
{person} was busy [repairing~to repair] the {device}.|{person} bận sửa {device}.|Busy + V-ing.
`,
    ),
    64: U(
        64,
        'Dùng to-infinitive để nêu mục đích của hành động; for + V-ing nêu công dụng.|So that + mệnh đề cần khi nói rõ chủ thể khác hoặc khả năng/mục tiêu với can/could/will.|A place to sit, work to do là danh từ + nguyên mẫu; for không thay to trước mục đích của người làm.',
        `
{person} called [to confirm~for confirm] the booking.|{person} gọi để xác nhận đặt chỗ.|To do nêu mục đích hành động.
{person} uses this tool for [cutting~to cut] plastic.|{person} dùng công cụ này để cắt nhựa.|For doing nói công dụng.
{person} spoke slowly so that we [could~to] understand.|{person} nói chậm để chúng tôi có thể hiểu.|So that mở mệnh đề có chủ ngữ và modal.
{person} needs a quiet place [to work~for work to].|{person} cần chỗ yên tĩnh để làm việc.|A place to do.
{person} left early [in order to~in order for to] catch the bus.|{person} đi sớm để kịp xe.|In order to + nguyên mẫu nêu mục đích.
{person} wrote it down so that she [would not~would not to] forget.|{person} ghi lại để không quên.|So that + chủ ngữ + would not + nguyên mẫu.
`,
    ),
    65: U(
        65,
        'Dùng adjective + to-infinitive để nhận xét việc làm hoặc phản ứng của người.|It is kind of someone to do đánh giá người; it is difficult for someone to do nói mức khó với người đó.|Dễ làm/dễ dùng có thể dùng the thing is easy to use, không thêm it sau use khi vật đã là chủ ngữ.',
        `
The {device} is easy [to use~to use it], says {person}.|{person} nói {device} dễ dùng.|Không lặp it khi device đã là chủ ngữ.
It was kind [of~for] {person} to help.|{person} thật tốt bụng khi giúp đỡ.|Kind of đánh giá hành vi của người.
It is difficult [for~of] {person} to arrive before six.|{person} khó đến trước sáu giờ.|Difficult for nói độ khó đối với người.
{person} was surprised [to hear~hearing to] the news.|{person} ngạc nhiên khi nghe tin.|Adjective phản ứng có thể đi với to do.
{person} was the first [to arrive~arriving to].|{person} là người đầu tiên đến.|The first + to-infinitive.
{person} is likely [to accept~accepting to] the offer.|{person} có khả năng chấp nhận đề nghị.|Likely + to do.
`,
    ),
    66: U(
        66,
        'Phân biệt to do và giới từ + V-ing sau afraid, interested và sorry theo nghĩa.|Afraid to do ngại thực hiện hành động; afraid of doing lo điều có thể xảy ra. Sorry for doing thường xin lỗi về việc đã làm.|Sorry to hear thể hiện tiếc khi nhận tin; interested in doing thường nói sự quan tâm hoặc ý định.',
        `
{person} is afraid [to ask~to asking] the director.|{person} ngại hỏi giám đốc.|Afraid to do nói sự ngại hành động.
{person} is afraid of [losing~lose] the key.|{person} sợ sẽ làm mất chìa khóa.|Afraid of + V-ing nói điều lo xảy ra.
{person} is interested in [joining~join] the course.|{person} quan tâm việc tham gia khóa học.|Interested in + V-ing.
{person} is sorry for [interrupting~to interrupting] us.|{person} xin lỗi vì đã ngắt lời chúng tôi.|Sorry for doing nhận lỗi về hành động.
{person} was sorry [to hear~to hearing] about the delay.|{person} tiếc khi nghe tin chậm trễ.|Sorry to hear là phản ứng khi nhận tin.
{person} was interested [to learn~to learning] how the {device} works.|{person} thấy thú vị khi biết {device} hoạt động ra sao.|Interested to learn nêu phản ứng với thông tin.
`,
    ),
    67: U(
        67,
        'Sau see/hear/watch someone, nguyên mẫu không to thường nhìn toàn bộ hành động; V-ing nhìn hoạt động đang diễn ra.|Sự khác biệt là điểm nhìn, không phải luôn một dạng đúng và một dạng sai trong mọi câu.|Ở bị động, see someone do chuyển thành someone was seen to do; không lược to như ở chủ động.',
        `
{person} saw the courier [leave~to leave] the building.|{person} thấy người giao hàng rời tòa nhà.|Sau saw + tân ngữ dùng nguyên mẫu không to cho toàn hành động.
{person} heard someone [knocking~to knocking] at the door.|{person} nghe ai đó đang gõ cửa.|V-ing biểu thị hoạt động đang diễn ra.
We watched {person} [cross~to cross] the road from start to finish.|Chúng tôi thấy {person} băng qua đường từ đầu đến cuối.|Điểm nhìn toàn bộ hành động dùng cross.
{person} was seen [to enter~enter] the office.|Người ta thấy {person} đi vào văn phòng.|Bị động của see cần to-infinitive trong mẫu này.
{person} noticed the {device} [making~to making] a strange noise.|{person} nhận thấy {device} đang phát tiếng lạ.|Notice object doing nói hoạt động đang xảy ra.
I heard {person} [sing~to sing] the whole song.|Tôi nghe {person} hát trọn bài.|Nguyên mẫu không to nhấn toàn bộ bài hát.
`,
    ),
    68: U(
        68,
        'Dùng mệnh đề V-ing để nối hoạt động cùng chủ thể hoặc nêu nguyên nhân/bối cảnh.|Having done nói việc hoàn tất trước hành động chính; after doing cũng có thể diễn tả quan hệ trước sau.|Tránh dangling participle: chủ thể ngầm của cụm V-ing phải khớp chủ ngữ mệnh đề chính.',
        `
[Opening~Opened] the door, {person} heard the alarm.|Khi mở cửa, {person} nghe chuông báo.|Người mở và người nghe cùng là chủ ngữ.
Having [checked~check] the {item}, {person} sent it.|Sau khi kiểm tra xong {item}, {person} gửi nó.|Having + V3 nhấn hành động đã xong trước.
{person} hurt her hand [opening~opened] the box.|{person} bị đau tay trong lúc mở hộp.|V-ing bổ sung hoạt động cùng chủ thể.
[Not knowing~Not knew] the route, {person} asked for directions.|Vì không biết đường, {person} hỏi đường.|Not + V-ing nêu nguyên nhân.
After [leaving~left] work, {person} visited a friend.|Sau khi tan làm, {person} thăm một người bạn.|After + V-ing khi lược chủ ngữ.
While [waiting~waited] for the bus, {person} read the {item}.|Trong lúc đợi xe, {person} đọc {item}.|While doing cùng chủ thể với mệnh đề chính.
`,
    ),
};
