# GearVN Creator Hub - Database Documentation

## Tổng quan

Database cho GearVN Creator Hub được thiết kế cho một nền tảng tương tự daily.dev, tập trung vào content aggregation, social features, và quản lý người dùng.

### Tech Stack
- **Database**: PostgreSQL (Supabase)
- **ORM/Driver**: Go `lib/pq` driver
- **Migrations**: SQL scripts
- **Seeding**: SQL seed data

---

## Cấu trúc Database

### Các bảng chính

| Bảng | Mô tả | Số cột |
|------|-------|--------|
| `users` | Thông tin người dùng | 20+ |
| `companies` | Thông tin công ty/brands | 20+ |
| `posts` | Bài viết và video content | 25+ |
| `categories` | Danh mục nội dung | 8 |
| `hashtags` | Hashtags/tags | 7 |
| `sources` | RSS feed sources | 9 |
| `comments` | Bình luận trên posts | 8 |
| `user_followers` | Users follow users | 4 |
| `company_followers` | Users follow companies | 4 |
| `bookmarks` | Bài viết đã lưu | 4 |
| `user_upvotes` | Upvotes trên posts | 4 |

### Entity Relationship Diagram

```
users (1) ----< posts (N)
users (1) ----< comments (N)
companies (1) ----< users (N)
sources (1) ----< posts (N)
posts (1) ----< comments (N)
users (N) ----< user_followers >---- users (N)
users (N) ----< company_followers >---- companies (N)
users (N) ----< bookmarks >---- posts (N)
users (N) ----< user_upvotes >---- posts (N)
```

---

## Setup Database

### 1. Tạo Database mới

```sql
CREATE DATABASE gearvn_creator_hub;
```

### 2. Chạy Schema Migration

```bash
# Nếu dùng psql command line
psql -U your_username -d gearvn_creator_hub -f database/00-complete-schema.sql

# Hoặc nếu dùng Supabase SQL Editor
# Copy nội dung file 00-complete-schema.sql và paste vào SQL Editor
```

### 3. Seed dữ liệu mẫu

```bash
# Chạy seed data
psql -U your_username -d gearvn_creator_hub -f database/01-seed-data.sql

# Hoặc copy vào Supabase SQL Editor
```

### 4. Xác nhận setup thành công

```sql
-- Kiểm tra số lượng records trong mỗi bảng
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'posts', COUNT(*) FROM posts
UNION ALL
SELECT 'categories', COUNT(*) FROM categories
UNION ALL
SELECT 'hashtags', COUNT(*) FROM hashtags;
```

Kết quả mong đợi:
- Users: 4
- Posts: 7 (4 articles + 3 videos)
- Categories: 6
- Hashtags: 15
- Comments: 8

---

## Cấu hình cho Backend Go

### Environment Variables

Tạo file `.env` trong thư mục `backend/`:

```env
DATABASE_URL=postgresql://username:password@host:5432/gearvn_creator_hub?sslmode=require
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=8080
```

### Supabase Connection String

Nếu dùng Supabase, connection string có format:

```
postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

Tìm connection string trong Supabase Dashboard:
1. Vào Project Settings
2. Chọn Database
3. Copy Connection String (URI)

---

## Database Schema Chi tiết

### 1. Users Table

**Mô tả**: Lưu trữ thông tin người dùng

**Columns chính**:
- `id` (VARCHAR): Primary key
- `email` (VARCHAR): Email đăng nhập (unique)
- `password_hash` (VARCHAR): Password đã hash bằng bcrypt
- `username` (VARCHAR): Username (unique)
- `role` (VARCHAR): 'user', 'admin', hoặc 'creator'
- `is_verified` (BOOLEAN): Trạng thái xác thực
- `company_id` (INTEGER): Link đến companies table

**Indexes**:
- `idx_users_username`
- `idx_users_email`
- `idx_users_company_id`

**Sample Query**:
```sql
-- Tìm user theo username
SELECT * FROM users WHERE username = 'gearvn_admin';

-- Lấy tất cả creators
SELECT * FROM users WHERE role = 'creator';

-- Lấy users của một company
SELECT u.* FROM users u
JOIN companies c ON u.company_id = c.id
WHERE c.slug = 'gearvn';
```

### 2. Posts Table

**Mô tả**: Lưu trữ bài viết và video content

**Columns chính**:
- `id` (VARCHAR): Primary key
- `title` (VARCHAR): Tiêu đề
- `content_type` (VARCHAR): 'article' hoặc 'video'
- `creator_id` (VARCHAR): Link đến users table
- `category` (VARCHAR): Slug của category
- `tags` (TEXT[]): Array of hashtag slugs
- `published` (BOOLEAN): Trạng thái publish
- `video_url` (TEXT): URL video (nếu content_type = 'video')

**Indexes**:
- `idx_posts_creator`
- `idx_posts_published`
- `idx_posts_content_type`
- `idx_posts_category`
- `idx_posts_tags` (GIN index for array)

**Sample Queries**:
```sql
-- Lấy posts published, sắp xếp theo ngày
SELECT * FROM posts
WHERE published = true
ORDER BY published_at DESC
LIMIT 20;

-- Lấy video posts
SELECT * FROM posts
WHERE content_type = 'video' AND published = true;

-- Tìm posts theo tag
SELECT * FROM posts
WHERE 'gaming' = ANY(tags);

-- Lấy posts của một creator
SELECT * FROM posts
WHERE creator_id = 'user-1'
ORDER BY published_at DESC;
```

### 3. Comments Table

**Mô tả**: Bình luận trên posts (hỗ trợ threaded comments)

**Columns chính**:
- `id` (SERIAL): Primary key
- `post_id` (VARCHAR): Link đến posts table
- `user_id` (VARCHAR): Link đến users table
- `content` (TEXT): Nội dung comment
- `parent_id` (INTEGER): Link đến parent comment (nullable)

**Sample Queries**:
```sql
-- Lấy comments của một post
SELECT c.*, u.username, u.avatar_url
FROM comments c
JOIN users u ON c.user_id = u.id
WHERE c.post_id = 'post-1'
ORDER BY c.created_at ASC;

-- Lấy replies của một comment
SELECT * FROM comments
WHERE parent_id = 1;
```

### 4. Categories & Hashtags

**Mô tả**: Phân loại nội dung

**Sample Queries**:
```sql
-- Lấy categories kèm số lượng posts
SELECT c.*, COUNT(p.id) as post_count
FROM categories c
LEFT JOIN posts p ON p.category = c.slug
GROUP BY c.id
ORDER BY post_count DESC;

-- Lấy top hashtags
SELECT * FROM hashtags
ORDER BY usage_count DESC
LIMIT 10;
```

---

## Triggers & Automatic Updates

Database sử dụng triggers để tự động cập nhật counts:

### 1. User Followers Count

**Trigger**: `trigger_update_user_followers_count`

Tự động cập nhật `followers_count` và `following_count` khi:
- User follow/unfollow user khác

### 2. Company Followers Count

**Trigger**: `trigger_update_company_followers_count`

Tự động cập nhật `followers_count` của company khi:
- User follow/unfollow company

### 3. Post Upvotes Count

**Trigger**: `trigger_update_post_upvotes_count`

Tự động cập nhật `upvotes` count của post khi:
- User upvote/remove upvote

### 4. Post Comments Count

**Trigger**: `trigger_update_post_comments_count`

Tự động cập nhật `comments_count` của post khi:
- Comment được thêm/xóa

### 5. Updated_at Timestamp

**Trigger**: `trigger_users_updated_at`, `trigger_posts_updated_at`, etc.

Tự động cập nhật `updated_at` timestamp khi record được update

---

## Row Level Security (RLS)

Database sử dụng RLS để bảo mật dữ liệu:

### Public Read Policies

Cho phép đọc công khai:
- users
- companies
- posts
- comments
- categories
- hashtags

### Authenticated Policies

Yêu cầu authentication:
- Tạo/sửa/xóa posts
- Tạo/sửa/xóa comments
- Follow/unfollow users/companies
- Bookmark/upvote posts

**Lưu ý**: RLS policies có thể cần điều chỉnh dựa trên authentication method của bạn.

---

## Common Queries

### Feed Posts với Creator Info

```sql
SELECT
  p.*,
  u.username as creator_username,
  u.avatar_url as creator_avatar,
  u.is_verified as creator_verified,
  (SELECT COUNT(*) FROM user_upvotes WHERE post_id = p.id) as upvotes,
  (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
FROM posts p
LEFT JOIN users u ON p.creator_id = u.id
WHERE p.published = true
ORDER BY p.published_at DESC
LIMIT 50;
```

### User Profile với Statistics

```sql
SELECT
  u.*,
  (SELECT COUNT(*) FROM posts WHERE creator_id = u.id AND published = true) as posts_count,
  (SELECT COUNT(*) FROM user_followers WHERE following_id = u.id) as followers_count,
  (SELECT COUNT(*) FROM user_followers WHERE follower_id = u.id) as following_count
FROM users u
WHERE u.id = 'user-1';
```

### Bookmarked Posts của User

```sql
SELECT p.*, u.username as creator_name
FROM bookmarks b
JOIN posts p ON b.post_id = p.id
JOIN users u ON p.creator_id = u.id
WHERE b.user_id = 'user-4'
ORDER BY b.created_at DESC;
```

### Following Feed (Posts từ creators mà user follow)

```sql
SELECT p.*
FROM posts p
JOIN user_followers uf ON p.creator_id = uf.following_id
WHERE uf.follower_id = 'user-4'
  AND p.published = true
ORDER BY p.published_at DESC;
```

---

## Backup & Restore

### Backup Database

```bash
# Backup toàn bộ database
pg_dump -U username -d gearvn_creator_hub -F c -f backup.dump

# Backup chỉ schema (không bao gồm data)
pg_dump -U username -d gearvn_creator_hub -s -f schema.sql

# Backup chỉ data
pg_dump -U username -d gearvn_creator_hub -a -f data.sql
```

### Restore Database

```bash
# Restore từ dump file
pg_restore -U username -d gearvn_creator_hub -c backup.dump

# Restore từ SQL file
psql -U username -d gearvn_creator_hub -f schema.sql
```

### Supabase Backup

Supabase tự động backup daily. Để tạo backup thủ công:

1. Vào Project Dashboard
2. Chọn Database > Backups
3. Click "Create backup"

---

## Migration Strategy

### Thêm Column mới

```sql
-- Thêm column vào bảng hiện có
ALTER TABLE users
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- Thêm index
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
```

### Thêm Table mới

```sql
-- Tạo table mới
CREATE TABLE IF NOT EXISTS user_preferences (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  theme VARCHAR(20) DEFAULT 'dark',
  language VARCHAR(10) DEFAULT 'vi',
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Migrate Data

```sql
-- Migrate dữ liệu cũ sang format mới
UPDATE posts
SET content_type = 'video'
WHERE video_url IS NOT NULL;
```

---

## Performance Optimization

### 1. Indexes

Database đã có indexes cho:
- Foreign keys
- Commonly queried columns
- Array columns (GIN index)

### 2. Query Optimization

**Bad**:
```sql
-- N+1 query problem
SELECT * FROM posts;
-- Sau đó loop và query creator cho mỗi post
```

**Good**:
```sql
-- Join một lần
SELECT p.*, u.username, u.avatar_url
FROM posts p
LEFT JOIN users u ON p.creator_id = u.id;
```

### 3. Pagination

```sql
-- Sử dụng LIMIT và OFFSET
SELECT * FROM posts
WHERE published = true
ORDER BY published_at DESC
LIMIT 20 OFFSET 0;

-- Page 2
LIMIT 20 OFFSET 20;
```

### 4. Count Optimization

```sql
-- Chậm: COUNT(*) trên bảng lớn
SELECT COUNT(*) FROM posts;

-- Nhanh: Sử dụng estimated count
SELECT reltuples AS estimate
FROM pg_class
WHERE relname = 'posts';
```

---

## Troubleshooting

### Lỗi Foreign Key Constraint

```
ERROR: insert or update on table "posts" violates foreign key constraint
```

**Giải pháp**:
- Đảm bảo `creator_id` tồn tại trong bảng `users`
- Hoặc set `creator_id = NULL` nếu creator không tồn tại

### Lỗi Duplicate Key

```
ERROR: duplicate key value violates unique constraint "users_email_key"
```

**Giải pháp**:
- Check email đã tồn tại chưa trước khi insert
- Sử dụng `ON CONFLICT` clause

```sql
INSERT INTO users (id, email, username)
VALUES ('user-5', 'test@example.com', 'testuser')
ON CONFLICT (email) DO UPDATE SET
  username = EXCLUDED.username;
```

### Lỗi Permission Denied

```
ERROR: permission denied for table users
```

**Giải pháp**:
- Check RLS policies
- Đảm bảo user có quyền truy cập
- Disable RLS tạm thời để test:

```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

---

## Test Accounts

Seed data đã tạo các test accounts:

| Email | Password | Role | Username |
|-------|----------|------|----------|
| admin@gearvn.com | password123 | admin | gearvn_admin |
| duong@gearvn.com | password123 | creator | duong_gearvn |
| reviewer@gearvn.com | password123 | creator | tech_reviewer |
| test@example.com | password123 | user | testuser |

**Lưu ý**: Đổi password trong production!

---

## Next Steps

1. **Authentication**: Implement JWT authentication trong Go backend
2. **API Endpoints**: Tạo RESTful API cho CRUD operations
3. **RSS Aggregation**: Implement background job để fetch RSS feeds
4. **Search**: Add full-text search với PostgreSQL
5. **Analytics**: Track views, clicks, engagement metrics
6. **Caching**: Implement Redis cache cho popular queries

---

## Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [Go PostgreSQL Driver](https://github.com/lib/pq)
- [Database Design Best Practices](https://www.postgresql.org/docs/current/ddl-best-practices.html)

---

## Support

Có câu hỏi? Liên hệ:
- Email: admin@gearvn.com
- GitHub Issues: [github.com/gearvn/creator-hub](https://github.com/gearvn/creator-hub)

---

**Last Updated**: 2025-01-14
**Version**: 1.0
**Maintained by**: GearVN Development Team
