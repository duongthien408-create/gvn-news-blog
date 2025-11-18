# Database Setup - Quick Start Guide 🚀

## ⚡ TL;DR - Chỉ cần 2 bước

### Bước 1: Tạo Schema
Copy và paste vào **Supabase SQL Editor**:
```bash
database/02-new-complete-schema.sql
```

### Bước 2: Load Sample Data
Copy và paste vào **Supabase SQL Editor**:
```bash
database/04-full-sample-data.sql
```

**Done!** ✅

---

## 📋 Chi tiết từng bước

### 1. Chuẩn bị

**Yêu cầu:**
- PostgreSQL 13+ hoặc Supabase account
- psql CLI tool (hoặc Supabase SQL Editor)

### 2. Tạo Database

**Option A: Local PostgreSQL**
```bash
# Tạo database mới
createdb gearvn_creator_hub

# Hoặc dùng psql
psql -U postgres
CREATE DATABASE gearvn_creator_hub;
\q
```

**Option B: Supabase**
1. Đăng ký tài khoản tại [supabase.com](https://supabase.com)
2. Tạo project mới
3. Vào SQL Editor

### 3. Chạy Migration

**Option A: Sử dụng psql (Local)**
```bash
cd database

# Chạy schema
psql -U postgres -d gearvn_creator_hub -f 00-complete-schema.sql

# Chạy seed data
psql -U postgres -d gearvn_creator_hub -f 01-seed-data.sql
```

**Option B: Supabase SQL Editor**
1. Mở file `database/00-complete-schema.sql`
2. Copy toàn bộ nội dung
3. Paste vào Supabase SQL Editor
4. Click "Run"
5. Lặp lại với file `01-seed-data.sql`

### 4. Xác nhận thành công

```sql
-- Kiểm tra số lượng records
SELECT 'Users' as table_name, COUNT(*) FROM users
UNION ALL
SELECT 'Posts', COUNT(*) FROM posts
UNION ALL
SELECT 'Categories', COUNT(*) FROM categories
UNION ALL
SELECT 'Hashtags', COUNT(*) FROM hashtags;
```

**Kết quả mong đợi:**
```
Users: 4
Posts: 7
Categories: 6
Hashtags: 15
```

### 5. Kết nối Backend

**Tạo file `.env`:**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/gearvn_creator_hub
JWT_SECRET=your-super-secret-key
PORT=8080
```

**Supabase Connection String:**
```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

Lấy từ: Project Settings > Database > Connection String

### 6. Test Connection

```bash
cd backend
go run main.go
```

Mở browser: `http://localhost:8080/api/posts`

---

## 📋 Test Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@gearvn.com | password123 | admin |
| duong@gearvn.com | password123 | creator |
| test@example.com | password123 | user |

**⚠️ ĐỔI PASSWORD TRONG PRODUCTION!**

---

## 🛠️ Scripts Tiện ích

### Backup Database
```bash
cd database/scripts
chmod +x backup.sh
./backup.sh
```

### Restore Database
```bash
cd database/scripts
chmod +x restore.sh
./restore.sh
```

### Reset Database (Xóa toàn bộ và tạo lại)
```bash
cd database/scripts
chmod +x reset-db.sh
./reset-db.sh
```

### Chạy Migrations
```bash
cd database/scripts
chmod +x migrate.sh
./migrate.sh
```

---

## 🔍 Test Queries

### Lấy tất cả posts
```sql
SELECT p.*, u.username as creator_name
FROM posts p
LEFT JOIN users u ON p.creator_id = u.id
WHERE p.published = true
ORDER BY p.published_at DESC
LIMIT 10;
```

### Lấy posts của một creator
```sql
SELECT * FROM posts
WHERE creator_id = 'user-1'
ORDER BY published_at DESC;
```

### Lấy bookmarks của user
```sql
SELECT p.* FROM bookmarks b
JOIN posts p ON b.post_id = p.id
WHERE b.user_id = 'user-4';
```

### Lấy users mà user đang follow
```sql
SELECT u.* FROM user_followers uf
JOIN users u ON uf.following_id = u.id
WHERE uf.follower_id = 'user-4';
```

---

## 📊 Database Structure

```
users (4 records)
├── companies (2 records)
├── posts (7 records)
│   ├── comments (8 records)
│   ├── user_upvotes (10+ records)
│   └── bookmarks (4 records)
├── user_followers (4 records)
└── company_followers (4 records)

categories (6 records)
hashtags (15 records)
sources (4 records)
```

---

## ❓ Troubleshooting

### Lỗi: "database does not exist"
```bash
createdb gearvn_creator_hub
```

### Lỗi: "permission denied"
```bash
# Grant permissions
psql -U postgres
GRANT ALL PRIVILEGES ON DATABASE gearvn_creator_hub TO your_user;
```

### Lỗi: "relation already exists"
```bash
# Drop và tạo lại
cd database/scripts
./reset-db.sh
```

### Lỗi khi chạy scripts (.sh)
```bash
# Trên Windows, dùng Git Bash hoặc WSL
# Hoặc convert sang PowerShell script
```

---

## 🎯 Next Steps

1. ✅ Database setup hoàn tất
2. ⏭️ Test backend API endpoints
3. ⏭️ Connect frontend với backend
4. ⏭️ Implement authentication
5. ⏭️ Deploy to production

---

## 📚 Tài liệu đầy đủ

Xem [README.md](README.md) để biết thêm chi tiết về:
- Database schema
- API queries
- Performance optimization
- Migration strategy
- Security policies

---

**Cần trợ giúp?** Kiểm tra [README.md](README.md) hoặc mở GitHub issue.
