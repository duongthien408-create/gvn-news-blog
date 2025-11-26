-- Insert video E-Dra EK375v2 của Ngọc Sang
-- Date: 2025-11-06

INSERT INTO posts (
    id,
    title,
    excerpt,
    content,
    cover_image,
    creator_id,
    creator_name,
    creator_avatar,
    category,
    tags,
    read_time,
    published,
    content_type,
    video_url,
    video_thumbnail,
    video_duration,
    video_platform,
    transcript,
    created_at,
    updated_at
) VALUES (
    'Wfba9YqU_Ro',
    'Chỉ cần 500k là có ngay bàn phím cơ chính hãng ngon bổ rẻ rồi - E-Dra EK375v2',
    'Video giới thiệu bàn phím cơ E-Dra EK375 V2 với mức giá khoảng 500,000 VND. Bàn phím có layout 75%, keycap PBT double-shot, switch linear, và thiết kế phối màu tương phản. Đây là lựa chọn phù hợp cho người mới tập chơi bàn phím cơ.',
    '# Review Bàn phím cơ E-Dra EK375 V2

## Giới thiệu
E-Dra EK375 V2 là một chiếc bàn phím cơ giá rẻ tầm 500,000 VND, phù hợp cho người mới tập chơi bàn phím cơ.

## Thông số kỹ thuật
- Layout: 75% (gọn gàng, có đầy đủ phím F và nút vặn âm thanh)
- Case: Nhựa, trọng lượng ~600g
- Keycap: PBT double-shot
- Switch: Linear (chỉ có 1 loại)
- Kết nối: Có dây (USB-C to USB-A)
- Led: Rainbow backlight

## Màu sắc
Có 2 phiên bản:
- **Alpha**: Xanh bên trong, đen bên ngoài
- **Beta**: Đen bên trong, xanh bên ngoài (video này)
- Chữ màu vàng nổi bật, phối màu tương phản đẹp hơn EK375 Pro

## Phụ kiện đi kèm
- Key puller
- Dây USB-C to USB-A

## Trải nghiệm
- Chất âm: Ổn định, cân bằng, khá vang (trong tầm giá 500k)
- Âm giữa các phím đồng đều
- Led rainbow đỡ nhàm chán

## Kết luận
Đây là lựa chọn tốt cho người mới chơi bàn phím cơ với ngân sách hạn chế. Giá ~500,000 VND rất phải chăng cho một bàn phím cơ chính hãng.',
    'https://i.ytimg.com/vi/Wfba9YqU_Ro/maxresdefault.jpg',
    '4',
    'Ngọc Sang',
    'https://ui-avatars.com/api/?name=Ngoc+Sang&background=ef4444&color=fff',
    'hardware',
    ARRAY['keyboard', 'e-dra', 'mechanical-keyboard', 'budget', 'review', 'gaming-gear'],
    '2 min read',
    true,
    'video',
    'https://www.youtube.com/shorts/Wfba9YqU_Ro',
    'https://i.ytimg.com/vi/Wfba9YqU_Ro/maxresdefault.jpg',
    'PT1M30S',
    'youtube',
    'Mình chân thành xin lỗi tất cả các bạn đã vào live của Gearvn hỏi bàn phím 500k nhưng mà không có. Vì bây giờ đây tụi mình đã có E-Dra EK375 V2! Với tầm giá này thì các bạn sẽ nhận về tay một em bàn phím có dây layout 75% với các phím được sắp xếp rất là gọn gàng hợp lý, có cả cụm phím F cũng như là nút vặn chỉnh âm thanh. Case em này được làm bằng nhựa nha. Trọng lượng thì khá là nhẹ, đây chỉ khoảng 600 gram thôi. Keycap cũng được đúc PBT double-shot. Về phụ kiện đi kèm trong hộp thì sẽ bao gồm một cái key puller và một dây C to A. Khác với EK375 Pro có 3 loại switch thì em này chỉ có một loại switch là linear thôi. Màu thì cũng ngược lại nha, ví dụ như alpha thì màu xanh bên trong, màu đen bên ngoài, còn ở đây mình đang có là bản beta với màu đen bên trong và màu xanh bên ngoài. Mình khá là thích cái cách phối màu này nha, hai màu nó tương phản rõ rệt hơn là ở EK375 Pro và phần chữ này cũng được làm màu vàng rất là nổi bật. Tuy là bàn phím giá rẻ thôi nhưng mà hãng cũng làm thêm led rainbow cho nó đỡ nhàm chán. (Âm thanh gõ phím) Đã có cơ hội trải nghiệm qua khá khá các dòng bàn phím rồi thì mình thấy chất âm của em này ở mức khá ổn nha. Âm giữa các phím thì có sự ổn định, cân bằng và khá là vang. À, ở đây mình nói là trên tầm giá chỉ khoảng 500 ngàn thôi nha. Với chất lượng cũng như tầm giá này thì mình nghĩ đây là một sự chọn thích hợp cho những bạn nào mới vừa tập chơi bàn phím cơ mà đang tìm một chiếc bàn phím giá rẻ. Nhấn nút góc trái màn hình để đặt hàng nha!',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    excerpt = EXCLUDED.excerpt,
    content = EXCLUDED.content,
    cover_image = EXCLUDED.cover_image,
    creator_id = EXCLUDED.creator_id,
    creator_name = EXCLUDED.creator_name,
    creator_avatar = EXCLUDED.creator_avatar,
    category = EXCLUDED.category,
    tags = EXCLUDED.tags,
    read_time = EXCLUDED.read_time,
    published = EXCLUDED.published,
    content_type = EXCLUDED.content_type,
    video_url = EXCLUDED.video_url,
    video_thumbnail = EXCLUDED.video_thumbnail,
    video_duration = EXCLUDED.video_duration,
    video_platform = EXCLUDED.video_platform,
    transcript = EXCLUDED.transcript,
    updated_at = CURRENT_TIMESTAMP;

-- Verify insert
SELECT id, title, creator_name, category, content_type, published
FROM posts
WHERE id = 'Wfba9YqU_Ro';
