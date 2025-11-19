# Database Seed Parts - Hướng dẫn chạy từng phần

Các file SQL được chia nhỏ để dễ chạy từng phần trong Supabase SQL Editor.

## 📋 Thứ tự chạy

### Bước 1: Chạy Schema trước
Chạy file: `database/02-new-complete-schema.sql`

### Bước 2: Chạy từng part theo thứ tự

1. **01-users-profiles.sql** - User profiles (10 users)
   - Admin, Tech Guru, Gamer Pro, PC Builder, Hardware Fan
   - Review Master, Newbie, Tech Enthusiast, Veteran Gamer, Tech Explorer
   - Auto-generated user_profiles, user_levels, user_preferences, streaks

2. **02-creators.sql** - Creators & socials (5 creators)
   - Scrapshut (150K subs)
   - Linus Tech Tips (15M subs)
   - Gamers Nexus (2M subs)
   - JayzTwoCents (3.5M subs)
   - Hardware Unboxed (1.8M subs)

3. **03-tags.sql** - Tags (15 tags)
   - Gaming, PC Build, Laptop, GPU, CPU, Mouse, Keyboard
   - Monitor, Storage, RAM, Cooling, Case, PSU, Audio, Tutorial

4. **04-products.sql** - Products, categories, brands
   - 5 categories, 10 brands, 10 products
   - ASUS ROG, Logitech, Razer, NVIDIA, AMD, Samsung, etc.

5. **05-posts.sql** - Posts & relationships (10 posts)
   - Posts với content, thumbnails, view counts
   - post_tags (tags for each post)
   - post_creators (creator attribution)
   - post_products (products mentioned in posts)

6. **06-comments.sql** - Comments & replies (20 comments)
   - Top-level comments (14 comments)
   - Nested replies (6 replies)
   - Vietnamese + English comments

7. **07-interactions.sql** - Votes, bookmarks, follows
   - Post votes (upvotes/downvotes)
   - Comment votes
   - Bookmarks (users save posts)
   - Creator follows (users follow creators)

8. **08-squads.sql** - Squads & members (5 communities)
   - PC Master Race, Budget Builds, RGB Everything
   - Water Cooling Warriors, Laptop Gaming
   - Squad members with roles (admin, moderator, member)
   - Squad posts

9. **09-gamification.sql** - Achievements & progress
   - 7 achievements (First Steps, Bookworm, Streak Master, etc.)
   - User achievements unlocked
   - Updated user levels & points
   - Updated streaks

## 🚀 Cách chạy

### Option 1: Chạy trực tiếp trong Supabase

1. Mở Supabase Dashboard → SQL Editor
2. Copy nội dung từng file
3. Paste và Run
4. Check kết quả từ query SELECT cuối file

### Option 2: Chạy tất cả cùng lúc

Nếu muốn chạy tất cả:
```bash
# Trong Supabase SQL Editor
# Copy paste toàn bộ file seed-sample-data.sql
```

## ✅ Verify

Sau khi chạy xong, check:

```sql
-- Count records
SELECT
  (SELECT COUNT(*) FROM users) as users,
  (SELECT COUNT(*) FROM creators) as creators,
  (SELECT COUNT(*) FROM tags) as tags,
  (SELECT COUNT(*) FROM products) as products,
  (SELECT COUNT(*) FROM posts) as posts,
  (SELECT COUNT(*) FROM comments) as comments;
```

Kết quả mong đợi:
- users: 10
- creators: 5
- tags: 15
- products: 10
- posts: 10
- comments: 16

## 🔧 Troubleshooting

### Lỗi: "syntax error at or near"
- Check comment SQL phải có `--` đầu dòng
- Không dùng `/* */` cho multiline comments

### Lỗi: "duplicate key value"
- Data đã tồn tại
- Clean data trước: `TRUNCATE TABLE ... CASCADE`

### Lỗi: "relation does not exist"
- Schema chưa được tạo
- Chạy `02-new-complete-schema.sql` trước

## 📝 Notes

- Mỗi file có query SELECT cuối để verify
- UUID được hard-code để dễ reference
- Timestamps dùng `NOW()` với interval
- Foreign keys đã được setup đúng
