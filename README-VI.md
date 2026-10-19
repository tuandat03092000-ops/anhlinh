# Flower Liquid Glass — Hoa và thư nhạc

## Chạy dự án
1. Giữ `index.html`, `style.css`, `style.scss`, `main.js` và thư mục `music/` cùng vị trí.
2. Thêm tối đa 5 bài MP3 trong `music/` theo tên `track-01.mp3` đến `track-05.mp3` (xem `music/README-VI.md`).
3. Mở `index.html` hoặc chạy bằng VS Code Live Server.

## Cách hoạt động
- Trang nền chỉ hiển thị hoa và các ô kính nhỏ có icon lá thư; **không tự phát nhạc khi vừa mở trang**.
- Có 12 ô kính thư trên màn hình lớn (48–54 px) và 8 ô trên điện thoại (44–48 px). Ô rơi theo đường thẳng, chia pha đồng đều, dùng chuyển động tối ưu và icon thư lớn hơn để dễ nhấn. Nhấn ô bất kỳ để mở popup.
- Popup theo bố cục tham khảo: máy nghe nhạc/đĩa vinyl ở bên trái và nội dung thư ở bên phải. Các lớp có nền màu bán trong suốt, viền phản chiếu, ánh sáng nội viền và backdrop blur theo phong cách Liquid Glass.
- Khi mở popup, trang thử phát bài hiện tại. Nếu chưa có MP3, trạng thái sẽ cho biết file cần thêm.
- Nút bài trước, phát/tạm dừng, bài tiếp theo, thanh tua và thanh âm lượng được xử lý trong `main.js`. Đóng popup sẽ tạm dừng nhạc. Có thể đóng bằng nút hoa, bấm nền tối hoặc phím Escape.
- Hai nhãn tiến độ hiển thị luôn cố định là `12:9` và `20:10`; thanh tua vẫn phản ánh tiến độ phát thực tế khi file nhạc đã tải.

## Tuỳ chỉnh bài hát
Mở `main.js`, chỉnh các thuộc tính `title` và `artist` trong mảng `TRACKS` ở đầu file, đồng thời giữ đường dẫn MP3 khớp với tên file.

`style.css` là stylesheet dùng bởi trình duyệt; `style.scss` giữ bản nguồn để tiếp tục tuỳ chỉnh.

## Vị trí code để chỉnh giao diện nhanh
- `:root` trong `style.css` / `style.scss`: các biến bo góc chung `--radius-glass-card`, `--radius-glass-panel`, `--radius-glass-content`, `--radius-glass-chip`, `--radius-glass-tile`.
- `[FIND: POPUP OUTER GLASS]` — khung kính ngoài của popup.
- `[FIND: MUSIC PLAYER GLASS]` — panel nghe nhạc bên trái.
- `[FIND: LETTER BODY GLASS]` — panel thư bên phải.
- `[FIND: LETTER CONTENT GLASS]` — ô kính chứa nội dung thư.
- `[FIND: FALLING LETTER TILES]` — giao diện các ô thư rơi.
- `[FIND: THƯ RƠI]` trong HTML / `createLetterRain()` trong `main.js` — số lượng, vị trí và tốc độ rơi.

## Tùy chỉnh nút nhạc

Trong `index.html`, dùng `Ctrl + F` để tìm:
- `[FIND: NÚT BÀI TRƯỚC]` — biểu tượng Back.
- `[FIND: NÚT PLAY / PAUSE]` — biểu tượng phát/tạm dừng.
- `[FIND: NÚT BÀI TIẾP THEO]` — biểu tượng Forward.

Trong `style.css` hoặc `style.scss`, tìm `[FIND: BO TRÒN NÚT PLAY / BACK / FORWARD]` để sửa kích thước, màu kính, độ bo tròn, viền, bóng và hiệu ứng hover của cả ba nút.
