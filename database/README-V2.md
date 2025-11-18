# GearVN News Blog - Database v2.0 Schema

## 🚀 Quick Start

### 1. Setup Database Schema (Chỉ chạy 1 lần khi khởi tạo)

```bash
# Truy cập Supabase SQL Editor hoặc dùng psql
psql -U postgres -d your_database -f database/02-new-complete-schema.sql
```

### 2. Load Sample Data (Tuỳ chọn - để test)

```bash
# Đầu tiên clean data cũ
psql -U postgres -d your_database -f database/00-clean-with-cascade.sql

# Sau đó load sample data
psql -U postgres -d your_database -f database/04-full-sample-data.sql
```

---

## 📁 File Structure

### Active Files (Schema v2.0)
```
database/
├── 02-new-complete-schema.sql    # ⭐ Main schema file
├── 03-seed-sample-data.sql       # Initial seed data (minimal)
├── 04-full-sample-data.sql       # ⭐ Full sample data (recommended)
├── 05-fresh-sample-data.sql      # Fresh sample data (alternative)
├── 00-clean-data.sql             # Clean all data
├── 00-clean-with-cascade.sql     # Clean all data with CASCADE
└── 00-cleanup-old-schema.sql     # Remove old schema
```

### Archived Files (Schema v1.0)
```
database/v1_archive/              # Old schema files (don't use)
```

---

## 🗂️ Database Schema v2.0 Overview

### Total Tables: 25+

#### 1. **Users & Authentication** (4 tables)
- `users` - User accounts
- `user_profiles` - Extended user info
- `user_preferences` - User settings
- `user_levels` - Level & XP

#### 2. **Creators & Content** (5 tables)
- `creators` - YouTubers/Bloggers
- `creator_socials` - Social media links
- `sources` - RSS/YouTube feeds
- `posts` - Articles & videos
- `post_media` - Images/videos

#### 3. **Products Integration** (4 tables) 🛒
- `products` - GearVN products
- `product_categories` - Product categories
- `brands` - Product brands
- `post_products` - Products mentioned in posts

#### 4. **Engagement** (6 tables)
- `votes` - Post upvotes/downvotes
- `comments` - Comments on posts
- `comment_votes` - Comment votes
- `bookmarks` - Saved posts
- `views` - Analytics
- `follows` - Follow users/creators

#### 5. **Community/Squads** (3 tables) 👥
- `squads` - Communities
- `squad_members` - Squad members
- `squad_posts` - Posts in squads

#### 6. **Gamification** (5 tables) 🎮
- `streaks` - Activity streaks
- `achievements` - Achievement definitions
- `user_achievements` - User's achievements
- `user_levels` - User levels
- `user_points` - Points history

#### 7. **Tags** (2 tables)
- `tags` - Hashtags
- `post_tags` - Tags on posts

#### 8. **Notifications** (1 table) 🔔
- `notifications` - User notifications

---

## 🔧 Key Features

### ✅ Automatic Triggers
Database tự động update counts khi có thay đổi:

- **Post votes** → Auto update `upvote_count`, `downvote_count`
- **Comments** → Auto update `comment_count`
- **Bookmarks** → Auto update `bookmark_count`
- **Squad members** → Auto update `member_count`
- **Creator followers** → Auto update `total_followers`
- **Tag usage** → Auto update `post_count`

### ✅ Auto-created Related Records
Khi tạo user mới, tự động tạo:
- `user_profiles` record
- `user_preferences` record
- `user_levels` record
- `streaks` record

### ✅ Data Types
- **IDs**: UUID (not VARCHAR)
- **Timestamps**: Proper `TIMESTAMP` types
- **Nullability**: Proper `NULL`/`NOT NULL` constraints
- **Foreign Keys**: Full CASCADE support

---

## 📊 Sample Data Overview

File `04-full-sample-data.sql` contains:

- ✅ **10 Users** with profiles, preferences, levels, streaks
- ✅ **5 Creators** (YouTubers: Scrapshut, Linus Tech Tips, etc.)
- ✅ **15 Tags** (Gaming, PC Build, Laptop, GPU, CPU, etc.)
- ✅ **10 Products** (Laptops, mice, keyboards, GPUs, etc.)
- ✅ **5 Sources** (YouTube channels, RSS feeds)
- ✅ **20 Posts** (articles, reviews, videos, tutorials)
- ✅ **30 Comments** (with nested replies)
- ✅ **5 Squads** (communities)
- ✅ **Votes, Bookmarks, Follows** (realistic engagement data)
- ✅ **Achievements & Badges**

---

## 🔐 Database Connection

### Environment Variables (.env)

```env
DATABASE_URL=postgresql://postgres.qibhlrsdykpkbsnelubz:Gearvn%232025@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=8080
```

### Go Backend Connection

```go
import (
    "database/sql"
    _ "github.com/lib/pq"
)

db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
if err != nil {
    log.Fatal("Failed to connect:", err)
}
```

---

## 🚨 Important Notes

### ⚠️ Schema Version
- **Active**: v2.0 (`02-new-complete-schema.sql`)
- **Archived**: v1.0 (in `v1_archive/` folder)

### ⚠️ Before Loading Sample Data
```sql
-- Always clean data first to avoid conflicts
TRUNCATE TABLE votes, comment_votes, bookmarks, follows,
  squad_members, user_achievements, comments, post_products,
  post_tags, post_creators, posts, products, tags, squad_posts,
  squads, sources, creator_socials, creators, streaks,
  user_levels, user_preferences, user_profiles, users, achievements
RESTART IDENTITY CASCADE;
```

### ⚠️ Row Level Security (RLS)
Schema v2.0 KHÔNG bật RLS mặc định. Nếu cần bảo mật, thêm policies:

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON users
  FOR SELECT USING (true);

CREATE POLICY "Allow users to update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);
```

---

## 🔍 Common Queries

### Get Posts with Creator Info
```sql
SELECT
  p.*,
  json_agg(DISTINCT c.*) as creators,
  json_agg(DISTINCT t.*) as tags
FROM posts p
LEFT JOIN post_creators pc ON p.id = pc.post_id
LEFT JOIN creators c ON pc.creator_id = c.id
LEFT JOIN post_tags pt ON p.id = pt.post_id
LEFT JOIN tags t ON pt.tag_id = t.id
WHERE p.status = 'published'
GROUP BY p.id
ORDER BY p.published_at DESC
LIMIT 20;
```

### Get User's Bookmarked Posts
```sql
SELECT p.*, u.display_name as creator_name
FROM bookmarks b
JOIN posts p ON b.post_id = p.id
JOIN user_profiles u ON p.creator_id = u.user_id
WHERE b.user_id = 'user-uuid-here'
ORDER BY b.created_at DESC;
```

### Get User Stats
```sql
SELECT
  u.username,
  up.display_name,
  ul.level,
  ul.total_points,
  s.current_streak,
  s.longest_streak,
  (SELECT COUNT(*) FROM posts WHERE creator_id = u.id) as total_posts,
  (SELECT COUNT(*) FROM user_achievements WHERE user_id = u.id) as total_achievements
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN user_levels ul ON u.id = ul.user_id
LEFT JOIN streaks s ON u.id = s.user_id
WHERE u.id = 'user-uuid-here';
```

---

## 🛠️ Migration from v1.0 to v2.0

If you have existing data in v1.0 schema:

### Option 1: Fresh Start (Recommended)
```bash
# 1. Backup old data
pg_dump -U postgres -d your_db -f backup-v1.sql

# 2. Drop old schema
psql -U postgres -d your_db -f database/00-cleanup-old-schema.sql

# 3. Create v2.0 schema
psql -U postgres -d your_db -f database/02-new-complete-schema.sql

# 4. Load sample data
psql -U postgres -d your_db -f database/04-full-sample-data.sql
```

### Option 2: Data Migration (Advanced)
Create custom migration script to map v1.0 → v2.0 data.

---

## 📚 Related Documentation

- [Schema ERD Diagram](gearvn-erd-diagram.md)
- [Database Setup Guide](SUPABASE-SETUP.md)
- [Backend API Routes](backend/ROUTES-UPDATE.md)
- [Migration Plan](DATABASE-MIGRATION-PLAN.md)

---

## 🆘 Troubleshooting

### Error: "relation does not exist"
**Solution**: Run schema file first
```bash
psql -U postgres -d your_db -f database/02-new-complete-schema.sql
```

### Error: "duplicate key violates unique constraint"
**Solution**: Clean data before loading sample data
```bash
psql -U postgres -d your_db -f database/00-clean-with-cascade.sql
```

### Error: "foreign key constraint violation"
**Solution**: Load data in correct order (check `04-full-sample-data.sql`)

---

## ✅ Verification Checklist

After setup, verify:

```sql
-- Check table count (should be 25+)
SELECT COUNT(*) FROM information_schema.tables
WHERE table_schema = 'public';

-- Check sample data
SELECT 'users' as table_name, COUNT(*) FROM users
UNION ALL SELECT 'posts', COUNT(*) FROM posts
UNION ALL SELECT 'creators', COUNT(*) FROM creators
UNION ALL SELECT 'tags', COUNT(*) FROM tags
UNION ALL SELECT 'products', COUNT(*) FROM products;

-- Expected results:
-- users: 10
-- posts: 20
-- creators: 5
-- tags: 15
-- products: 10
```

---

## 📞 Support

Questions? Check:
- [Main README](README.md)
- [Database Schema](02-new-complete-schema.sql)
- [Sample Data](04-full-sample-data.sql)

---

**Last Updated**: 2025-01-18
**Schema Version**: 2.0
**Maintained by**: GearVN Development Team
