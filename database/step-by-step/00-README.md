# 📚 HƯỚNG DẪN IMPORT DATA TỪNG BƯỚC

## 🎯 Chạy theo thứ tự từ 01 đến 09

### **BƯỚC 1:** Clean data cũ
```sql
-- File: 01-clean.sql
-- Copy và chạy trong Supabase SQL Editor
```

### **BƯỚC 2:** Insert Users (3 users)
```sql
-- File: 02-users.sql
-- Tạo: admin, techguru, gamerpro
```

### **BƯỚC 3:** Insert Creators (3 creators)
```sql
-- File: 03-creators.sql
-- Tạo: Scrapshut, Linus Tech Tips, Gamers Nexus
```

### **BƯỚC 4:** Insert Tags (7 tags)
```sql
-- File: 04-tags.sql
-- Tạo: Gaming, PC Build, Laptop, GPU, CPU, Mouse, Keyboard
```

### **BƯỚC 5:** Insert Sources (2 sources)
```sql
-- File: 05-sources.sql
-- Tạo: YouTube channels
```

### **BƯỚC 6:** Insert Posts (10 posts với hình ảnh)
```sql
-- File: 06-posts.sql
-- ⭐ QUAN TRỌNG: Posts có hình ảnh từ Unsplash
```

### **BƯỚC 7:** Link Posts ↔ Creators
```sql
-- File: 07-post-creators.sql
```

### **BƯỚC 8:** Link Posts ↔ Tags
```sql
-- File: 08-post-tags.sql
```

### **BƯỚC 9:** Insert Comments (5 comments)
```sql
-- File: 09-comments.sql
```

---

## ✅ Kiểm tra kết quả

Sau khi chạy xong tất cả, chạy query này:

```sql
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL SELECT 'creators', COUNT(*) FROM creators
UNION ALL SELECT 'posts', COUNT(*) FROM posts
UNION ALL SELECT 'tags', COUNT(*) FROM tags
UNION ALL SELECT 'comments', COUNT(*) FROM comments;
```

**Kết quả mong đợi:**
- users: 3
- creators: 3
- posts: 10 (✅ có thumbnail_url)
- tags: 7
- comments: 5

---

## 🔍 Test Frontend

Sau khi import xong, test API:

```sql
-- Lấy posts với creators và tags
SELECT
  p.id, p.title, p.slug, p.thumbnail_url,
  p.upvote_count, p.comment_count, p.view_count,
  json_agg(DISTINCT c.*) as creators,
  json_agg(DISTINCT t.*) as tags
FROM posts p
LEFT JOIN post_creators pc ON p.id = pc.post_id
LEFT JOIN creators c ON pc.creator_id = c.id
LEFT JOIN post_tags pt ON p.id = pt.post_id
LEFT JOIN tags t ON pt.tag_id = t.id
WHERE p.status = 'published'
GROUP BY p.id
ORDER BY p.created_at DESC
LIMIT 10;
```

---

## ⚠️ Nếu gặp lỗi

- **Lỗi UUID**: Đảm bảo tất cả ID đều là UUID format (đã fix rồi)
- **Lỗi INTERVAL**: Đã dùng `INTERVAL '5 days'` (đúng format)
- **Lỗi foreign key**: Chạy đúng thứ tự từ 01 → 09

---

Mỗi file đều có query kiểm tra ở cuối để verify dữ liệu đã insert đúng chưa!
