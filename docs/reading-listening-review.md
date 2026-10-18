# Rà soát Reading và Listening — 18/10/2026

Đã cập nhật **database local** bằng 275 thay đổi trường dữ liệu, trên 175 bản ghi thuộc **98 bài Reading và 4 phần Listening**. Theo yêu cầu tiếp theo của người dùng, các thay đổi này cũng đã được đồng bộ lên Supabase ngày 18/10/2026; xem phần triển khai bên dưới.

## Phạm vi và phương pháp

- Quét toàn bộ 138 bản ghi Reading, 147 passage, 433 nhóm câu hỏi và 1.943 câu hỏi; bao gồm 4 bài lưu trữ và các bài tự soạn.
- Kiểm tra cấu trúc, số câu, chỗ trống, lựa chọn, đáp án hiện có, nội dung text so với HTML, chính tả và những dấu hiệu OCR bất thường.
- Đọc ngữ cảnh các từ bị nghi ngờ; giữ cách viết Anh-Anh, tên riêng, thuật ngữ, trích dẫn cổ và các đáp án hợp lệ. Không dùng tự động sửa chính tả hàng loạt theo gợi ý từ điển.
- Đối chiếu các đoạn hỏng với PDF người dùng cung cấp. Với Listening, đã xem đủ 18 trang: đề trang 5–11 và transcript trang 150–160, trong đó trang 160 xác định ranh giới Test 2.
- Dùng suy luận ngữ cảnh cho lỗi rõ ràng trong chính bản PDF; ghi lại các điểm chưa đủ bằng chứng. Đây là quét toàn bộ dữ liệu kèm rà soát sâu các chỗ nghi vấn, không phải chứng nhận mọi từ hoặc mọi đáp án đều trùng bản Cambridge chính thức.

## Nội dung đã sửa

| Phần      | Thay đổi                                                                                                                                       |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Reading   | Sửa lỗi OCR, chữ dính, dấu câu, sở hữu cách và từ ghép trong passage, hướng dẫn, lựa chọn và câu hỏi.                                          |
| Reading   | Phục hồi các câu mất chữ trong Making Every Drop Count, Makete, Europe's forests, Pulling strings to build pyramids và Endless Harvest từ PDF. |
| Reading   | Tách glossary khỏi thân bài Human Genome Project; phục hồi dấu câu của Tourism; đồng bộ nội dung HTML và text.                                 |
| Reading   | Sửa tên kākāpō bị hỏng dấu; liên kết đúng 7 chỗ trống với câu 7–13 trong bài tự soạn.                                                          |
| Reading   | Loại một dòng hướng dẫn bị nhập nhầm thành lựa chọn `NB`; khôi phục các hướng dẫn bị OCR mất chữ bằng số câu và dạng bài thực tế.              |
| Listening | Dựng lại bảng nhà hàng thành các mục dễ đọc, giữ nguyên đủ 10 câu.                                                                             |
| Listening | Khôi phục Part 2, câu 17–18 và nhãn A–E theo thứ tự 5 lựa chọn; sửa tiêu đề Part 4 thành câu 31–40 và phục hồi đủ chỗ trống.                   |
| Listening | Sửa ký tự `I` nhận nhầm thành dấu gạch, từ kiln/kilns, Thames, khoảng trắng, đoạn hội thoại, chữ lặp và các lỗi rõ ràng theo ngữ cảnh.         |
| Giao diện | Sửa regex ô trống Listening để giữ dấu chấm và xuống dòng; thêm test cho lỗi này và kiểm tra lại mobile.                                       |

Một số lỗi nằm ngay trong PDF. Với Johnson's Dictionary, đã sửa năm xuất bản thành 1755 và ngày ký hợp đồng thành 18/06/1746 theo [Dr Johnson's House](https://www.drjohnsonshouse.org/johnsons-dictionary); số trích dẫn 114.000 được kiểm tra lại trên ảnh PDF và cùng nguồn này. Tên tác giả Paul Wallich được đối chiếu với [bài gốc trên Scientific American](https://www.scientificamerican.com/article/a-workaholic-economy/). Câu cụt trong bài AHI được phục hồi phần kết ngắn theo ngữ cảnh và [bản đối chiếu](https://engnovate.com/ielts-reading-answers/implementing-the-cycle-of-success-a-case-study/); đây vẫn là phục hồi biên tập vì bản PDF local bị thiếu.

## Những điểm còn chưa xác nhận

- 160 câu Cambridge 4 đang dùng chưa có đáp án trong nguồn được cung cấp. 160 câu chưa có đáp án khác thuộc 4 bài Cambridge 20 đã lưu trữ. Không tạo điểm số giả hoặc đổi đáp án hiện có.
- 4 phần Listening vẫn chưa có answer key được xác nhận và không có audio local. Chúng được giữ ở trạng thái draft, bài exam vẫn lưu không chấm điểm.
- Listening Part 3 bắt đầu và kết thúc bằng lời thoại cụt ngay trong PDF. Không tự bịa thêm lời thoại để coi như transcript hoàn chỉnh.
- Tên đầu bếp “Angela Fra” chưa xác minh được. Các cách viết Greyson/Grayson, Edelman/Adelman được thống nhất theo worksheet; Audley được khôi phục theo phần đánh vần trong transcript. Đây là quyết định biên tập, cần audio để xác nhận tuyệt đối.
- Các đáp án Cambridge 20 đã được suy luận trong lần nhập trước vẫn giữ nguyên nguồn gốc suy luận; lần kiểm tra này không biến chúng thành đáp án chính thức.

## An toàn dữ liệu và hiện vật riêng tư

Đã sao lưu trước sửa tại `.local/backups/my-note-2026-10-18T09-52-24-623Z.dump`. Cập nhật theo transaction, kiểm tra nội dung trước sửa để tránh ghi đè thay đổi mới. Giữ nguyên mọi ID, answer key và lịch sử làm bài. Các bài Reading được tăng version để chặn bài nộp dựa trên nội dung cũ.

Các file chứa nội dung sách đều ở `.local/content-review/`, không đưa vào Git hoặc static bundle:

- `before.json`, `after.json`: ảnh chụp dữ liệu trước/sau.
- `final-plan.json`: nhật ký từng trường trước/sau và lý do sửa.
- `reviewed-content-patch.sql`: bản vá cho một database có cùng nội dung. Dùng slug và thứ tự passage/group/question, không yêu cầu UUID giống local. Từ chối nội dung đã thay đổi và chạy lại không tăng version khi không có sửa đổi. Hosted được cập nhật bằng các lô nhỏ tương đương trong `hosted-batches/`.
- `verification.json`, `browser-verification.json`, `browser-targeted-verification.json`: kết quả xác minh và ảnh chụp cùng thư mục.

Chạy lại audit hoặc xem trước một kế hoạch sửa:

```powershell
node tools/database/audit-learning-content.cjs
node tools/database/apply-content-review.cjs .local/content-review/final-plan.json
```

Lệnh thứ hai mặc định chỉ kiểm tra và rollback. Sau lần áp dụng này, nó báo 0 trường cần sửa. Importer Listening cũng đã được sửa để giữ các trường văn bản không rỗng khi chạy OCR lại.

## Kết quả kiểm tra

- Audit sau sửa: không còn lỗi cấu trúc, chỗ trống Listening bị thiếu hoặc HTML lệch text trong phạm vi quy tắc kiểm tra. Các phát hiện còn lại chỉ là những đáp án thiếu đã nêu trên.
- Chấm trong bộ nhớ toàn bộ 1.943 câu: 1.623 câu có key qua kiểm tra hồi quy; 320 câu không key vẫn không chấm. Đây là kiểm tra tính nhất quán của grader với key đang lưu, không phải xác nhận độ đúng của key.
- Trình duyệt: 134 bài Reading đang dùng / 1.783 ô trả lời, 4 phần Listening / 40 ô trả lời, không lỗi JavaScript và không nộp bài thử vào lịch sử người dùng.
- Kiểm tra lại sau sửa cuối: 11 trang Reading / 146 ô và cả 4 phần Listening; giữ nguyên số dòng worksheet, đủ ô inline, không tràn ngang ở 390px.
- `npm.cmd test`: 33/33 đạt, bao gồm build 17 trang trong thư mục tạm.
- `npm.cmd run test:integration`: 5/5 đạt; có test mới cho transaction, version, idempotence và giữ nguyên câu hỏi/đáp án.
- `npm.cmd run check`, `npm.cmd run format:check`: đạt; các file thay đổi sau đó được kiểm tra lại riêng.
- Bản vá SQL được chạy thử trên database local đã sửa: không đổi version hoặc dữ liệu khi áp dụng lại.

## Triển khai Supabase ngày 18/10/2026

- Dự án hiện có: `my-site` (`skqtgplnejbujyejqilu`). Đã sao lưu nội dung hosted vào `.local/content-review/hosted-before.json` trước khi cập nhật.
- Cả 275 trường đều khớp nội dung trước sửa; không có xung đột với thay đổi trên hosted.
- API từ chối yêu cầu SQL 4 MB. Bản vá được chia thành 5 lô nhỏ, giữ toàn bộ sửa đổi của mỗi bài trong cùng transaction. Mỗi lô khóa bản ghi và kiểm tra nội dung; các trường text được đối chiếu bằng SHA-256.
- Cả 5 lô đã qua kiểm tra rollback trước khi ghi chính thức. Đã xác minh lại đủ 275 trường sau cập nhật; 98 bài Reading tăng version đúng một lần, giữ nguyên mọi ID và answer key.
- Checksum lịch sử Reading, Listening, thẻ từ vựng và lượt ôn tập không thay đổi. Không xóa hoặc tạo lại dữ liệu học.
- Notes/Blog và bảng xếp hạng đã có schema cần thiết, nên không chạy lại migration cũ. Đã triển khai lại Edge Function `app-api` từ mã nguồn hiện tại.
- Nhật ký và kết quả xác minh riêng tư: `hosted-deployment-journal.json`, `hosted-verification.json`, `hosted-after.json` trong `.local/content-review/`.
