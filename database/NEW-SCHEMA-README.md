# GearVN Content Hub - New Database Schema v2.0

## 📋 Tổng quan

Schema mới được thiết kế hoàn toàn dựa trên ERD diagram với **25+ bảng**, hỗ trợ đầy đủ các tính năng:

- ✅ **Gamification System** (Streaks, Levels, Achievements, Points)
- ✅ **Products Integration** (GearVN product catalog)
- ✅ **Community Features** (Squads/Communities)
- ✅ **Advanced Analytics** (Detailed views tracking)
- ✅ **Creator Management** (Social media integration)
- ✅ **Enhanced Engagement** (Voting system with upvote/downvote)

---

## 🗂️ Cấu trúc Database

### 1. 🔐 Authentication & Users (3 bảng)
| Bảng | Mô tả |
|------|-------|
| `users` | Thông tin đăng nhập và xác thực |
| `user_profiles` | Profile mở rộng (avatar, bio, website) |
| `user_preferences` | Cài đặt người dùng (theme, notifications) |

### 2. 📝 Content Management (5 bảng)
| Bảng | Mô tả |
|------|-------|
| `posts` | Bài viết chính |
| `post_media` | Media files (images, videos) |
| `sources` | Nguồn RSS/API |
| `creators` | Content creators |
| `creator_socials` | Social media của creators |

### 3. 🛒 Products - GearVN Integration (3 bảng)
| Bảng | Mô tả |
|------|-------|
| `products` | Sản phẩm GearVN |
| `product_categories` | Danh mục sản phẩm |
| `brands` | Thương hiệu |

### 4. 💬 User Engagement (5 bảng)
| Bảng | Mô tả |
|------|-------|
| `votes` | Upvote/Downvote cho posts |
| `comments` | Bình luận |
| `comment_votes` | Upvote/Downvote cho comments |
| `bookmarks` | Lưu bài viết |
| `views` | Analytics tracking |

### 5. 👥 Community (4 bảng)
| Bảng | Mô tả |
|------|-------|
| `squads` | Communities/Groups |
| `squad_members` | Thành viên trong squad |
| `squad_posts` | Bài viết trong squad |
| `follows` | Follow users/creators |

### 6. 🎮 Gamification (5 bảng)
| Bảng | Mô tả |
|------|-------|
| `streaks` | Streak tracking |
| `user_levels` | Level và points |
| `achievements` | Danh sách thành tựu |
| `user_achievements` | Thành tựu đã đạt được |
| `user_points` | Lịch sử điểm |

### 7. 🏷️ Taxonomy (3 bảng)
| Bảng | Mô tả |
|------|-------|
| `tags` | Tags/Hashtags |
| `post_tags` | Junction: Posts ↔ Tags |
| `post_products` | Junction: Posts ↔ Products |
| `post_creators` | Junction: Posts ↔ Creators |

### 8. 🔔 Notifications (1 bảng)
| Bảng | Mô tả |
|------|-------|
| `notifications` | Thông báo cho users |

---

## 🚀 Cách sử dụng

### ⚡ Setup trên Supabase (Khuyến nghị)

**👉 Xem hướng dẫn chi tiết: [SUPABASE-SETUP.md](SUPABASE-SETUP.md)**

**Tóm tắt:**
1. Đăng nhập [Supabase Dashboard](https://supabase.com/dashboard)
2. Mở **SQL Editor** → **New query**
3. Copy nội dung file `02-new-complete-schema.sql`
4. Paste và click **Run**
5. (Optional) Chạy `03-seed-sample-data.sql` để có dữ liệu mẫu

### 🖥️ Setup Local PostgreSQL

### Bước 1: Tạo database mới
```sql
-- Tạo schema hoàn chỉnh
psql -U postgres -d gearvn_hub -f 02-new-complete-schema.sql
```

### Bước 2: Seed dữ liệu mẫu (Optional)
```sql
-- Import dữ liệu mẫu để test
psql -U postgres -d gearvn_hub -f 03-seed-sample-data.sql
```

### Bước 3: Verify
```sql
-- Kiểm tra số lượng bảng
SELECT COUNT(*) FROM information_schema.tables
WHERE table_schema = 'public';

-- Kết quả mong đợi: ~25 bảng
```

---

## 📊 Dữ liệu mẫu bao gồm

Khi chạy seed file, bạn sẽ có:

- ✅ 4 Users (admin, creator, 2 users thường)
- ✅ 3 Creators (Scrapshut, Linus Tech Tips, MKBHD)
- ✅ 3 Sources (GearVN Blog, TechCrunch, The Verge)
- ✅ 6 Tags (Gaming, PC Build, Laptop, Monitor, Keyboard, Mouse)
- ✅ 5 Brands (ASUS, MSI, Logitech, Razer, Corsair)
- ✅ 3 Products (ASUS ROG Laptop, Logitech Mouse, Razer Keyboard)
- ✅ 3 Posts (Reviews, videos)
- ✅ 2 Squads (PC Builders Vietnam, Gaming Gear Reviews)
- ✅ 4 Achievements (First Post, 7 Day Streak, etc.)

---

## 🔥 Tính năng nổi bật

### 1. Gamification System
```sql
-- Người dùng kiếm điểm từ nhiều hành động
INSERT INTO user_points (user_id, points, action) VALUES
    (user_id, 10, 'post_created'),
    (user_id, 5, 'upvote_received'),
    (user_id, 2, 'comment_posted');

-- Tự động cập nhật level khi đủ điểm
```

### 2. Products Integration
```sql
-- Link sản phẩm với bài viết
INSERT INTO post_products (post_id, product_id, mention_type, affiliate_link)
VALUES ('post_id', 'product_id', 'review', 'https://gearvn.com/aff/...');
```

### 3. Advanced Voting
```sql
-- Hỗ trợ cả upvote (1) và downvote (-1)
INSERT INTO votes (user_id, post_id, vote_type) VALUES
    ('user_id', 'post_id', 1);  -- Upvote

-- Tự động cập nhật upvote_count và downvote_count
```

### 4. Community Squads
```sql
-- Tạo communities với members và roles
INSERT INTO squads (name, slug, type, creator_id)
VALUES ('PC Builders', 'pc-builders', 'public', 'user_id');

-- Thêm members với roles khác nhau
INSERT INTO squad_members (squad_id, user_id, role)
VALUES ('squad_id', 'user_id', 'admin');
```

### 5. Creator Social Tracking
```sql
-- Track social media của creators
INSERT INTO creator_socials (creator_id, platform, url, follower_count)
VALUES ('creator_id', 'youtube', 'https://youtube.com/@channel', 1000000);
```

---

## 🎯 Triggers tự động

Schema có sẵn các triggers để tự động:

1. ✅ **Update `updated_at`** khi có thay đổi
2. ✅ **Đếm votes** (upvote/downvote counts)
3. ✅ **Đếm comments** trong posts
4. ✅ **Đếm bookmarks** trong posts
5. ✅ **Đếm followers** của creators
6. ✅ **Đếm members** trong squads
7. ✅ **Đếm posts** trong tags
8. ✅ **Tự động tạo profile** khi tạo user mới

---

## 📈 Performance Optimization

### Indexes đã được tạo cho:
- ✅ All foreign keys
- ✅ Frequently queried columns
- ✅ Full-text search (GIN index on post titles)
- ✅ Date-based queries (published_at DESC)
- ✅ Status filters (published, active, etc.)

### Recommended caching strategy:
```javascript
// Redis cache cho frequently accessed data
- Popular posts (featured, high upvote count)
- User profiles
- Tag lists
- Product catalogs
```

---

## 🔄 So sánh với Schema cũ

| Feature | Schema cũ | Schema mới |
|---------|-----------|------------|
| Bảng | 11 bảng | 25+ bảng |
| Users | 1 bảng | 3 bảng (users, profiles, preferences) |
| Creators | `companies` | `creators` + `creator_socials` |
| Tags | `hashtags` (array) | `tags` + `post_tags` junction |
| Products | ❌ | ✅ 3 bảng đầy đủ |
| Voting | Chỉ upvote | Upvote + Downvote |
| Communities | ❌ | ✅ Squads system |
| Gamification | ❌ | ✅ Đầy đủ (streaks, levels, achievements) |
| Analytics | Basic count | ✅ Views tracking với IP, user agent |
| Notifications | ❌ | ✅ Full notification system |

---

## 🛠️ Migration từ schema cũ

Nếu bạn muốn migrate dữ liệu từ schema cũ:

1. **Backup database cũ**
2. **Tạo database mới** với schema v2.0
3. **Migration script** (cần tạo riêng) để:
   - Map `companies` → `creators`
   - Map `hashtags` → `tags`
   - Map `user_upvotes` → `votes`
   - Tách user data vào `user_profiles` và `user_preferences`

---

## 📞 Support

Nếu có vấn đề khi chạy schema:

1. Kiểm tra PostgreSQL version (khuyến nghị >= 14)
2. Đảm bảo extensions đã được enable (`uuid-ossp`, `pg_trgm`)
3. Kiểm tra permissions của database user

---

## 🎉 Kết luận

Schema mới v2.0 cung cấp:
- ✅ Kiến trúc mở rộng tốt hơn
- ✅ Tách bạch dữ liệu rõ ràng
- ✅ Tính năng gamification hoàn chỉnh
- ✅ Integration với products GearVN
- ✅ Community features (Squads)
- ✅ Advanced analytics và tracking

**Ready for production!** 🚀
