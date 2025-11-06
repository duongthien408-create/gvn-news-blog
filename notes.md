# GearVN Creator Hub UI Notes

## Mục tiêu tổng thể

- Xây dựng giao diện tham khảo lấy cảm hứng Daily.dev cho “GearVN Creator Hub”.
- Triển khai chế độ đa trang thuần tĩnh (không cần build tools, chỉ HTML/JS/CSS qua Tailwind CDN).
- Đảm bảo các nút quan trọng đều điều hướng được sang trang phù hợp (feed, detail, profile, placeholder).

## Cấu trúc thư mục chính

```
.
├── index.html              # Trang chủ (feed)
├── detail.html             # Trang nội dung chi tiết
├── profile.html            # Trang hồ sơ creator
├── explore.html            # Placeholder Explore
├── following.html          # Placeholder Following
├── bookmarks.html          # Placeholder Bookmarks
├── custom-feeds.html       # Placeholder Custom feeds
├── folders.html            # Placeholder thư mục lưu trữ
├── tags.html               # Placeholder hashtag
├── settings.html           # Placeholder cài đặt feed
└── scripts/
    ├── data.js
    ├── feed.js
    ├── detail.js
    ├── profile.js
    └── render.js
```

## Luồng dữ liệu

- `scripts/data.js`
  - Định nghĩa danh sách creator giả lập (avatar, banner, bio, stats, tag, similar creators).
  - Danh sách bài viết mẫu (id, creatorId, tiêu đề, mô tả, tags, ảnh, thống kê).
  - Các hàm tiện ích:
    - `getAllPosts()`, `getPostById(id)`, `getCreatorPosts(creatorId)`
    - `getCreatorById(id)`, `getCreatorsByIds(ids)` để lấy dữ liệu liên quan.
    - `sampleComments()` trả về bình luận demo mỗi lần render chi tiết.
    - `formatNumber()` format follower count dạng compact.

## Cách render từng trang

### Trang chủ – `index.html`

- Giao diện gồm sidebar cố định, header sticky, section highlight + thông số feed settings.
- Phần feed được render động bởi `scripts/feed.js` thông qua `renderFeed(posts)` (trong `render.js`).
- Các thẻ bài (<article>) chứa:
  - Liên kết tới hồ sơ (`profile.html?creator=...`).
  - Liên kết tới bài viết (`detail.html?id=...`).
  - Thẻ tag, thống kê upvote/comment/save/share.
- Buttons “Đăng bài mới”, “Khám phá feed”, “Tùy chỉnh trải nghiệm” liên kết tới placeholder tương ứng.

### Trang chi tiết – `detail.html`

- Layout tương tự feed, nhưng nội dung chính do `scripts/detail.js` render vào `#detail-root`.
- Đọc `id` từ query string, lấy post qua `getPostById`.
- Nếu không tìm thấy id → fallback card thông báo + link trở lại feed.
- Bên trong chi tiết:
  - Liên kết tên tác giả → `profile.html`.
  - Nút “Theo dõi” trở thành anchor dẫn đến trang profile.
  - Các bài viết gợi ý (`related`) liên kết tới `detail.html?id=...`.

### Trang profile – `profile.html`

- Render bằng `scripts/profile.js`.
- Đọc `creator` từ query string, lấy dữ liệu creator + danh sách bài viết.
- Hiển thị:
  - Banner, avatar, bio, stats (Posts/Follower/Following).
  - Các creator tương tự (button link sang profile của họ).
  - Bài viết nổi bật (top upvote) và grid tất cả bài viết (cùng layout như feed).
- Nếu không có `creator` → fallback thông báo + link về trang chủ.

## Các trang placeholder

- `explore.html`, `following.html`, `bookmarks.html`, `custom-feeds.html`, `folders.html`, `tags.html`, `settings.html`.
- Mỗi trang giữ cùng sidebar/header, dùng card thông báo “đang xây dựng”.
- Cung cấp CTA quay lại `index.html` và gợi ý điều hướng phù hợp (đến profile/bài viết/setting).

## Tương tác & nhúng icon

- Lucide icon gọi lại `window.lucide.createIcons()` sau mỗi render.
- Tất cả liên kết điều hướng sử dụng anchor `<a>` để tránh JavaScript state phức tạp.
- Script mỗi trang đơn giản: lấy dữ liệu → render → refresh icon.

## Ghi chú sử dụng

- Mở `index.html` để truy cập feed.
- Click tên tác giả hoặc avatar → chuyển sang trang profile tương ứng.
- Click tiêu đề/ảnh bài viết → chuyển sang trang detail hiển thị nội dung đầy đủ.
- Các mục sidebar & CTA khác dẫn tới placeholder, phù hợp để tiếp tục phát triển tính năng sau.

## Hướng phát triển tiếp theo

- Bổ sung state thực (localStorage) cho bookmark/follow.
- Thêm tìm kiếm, lọc tag ngay trên `explore.html`.
- Kết nối API thật hoặc CMS để thay thế dữ liệu mock trong `data.js`.
