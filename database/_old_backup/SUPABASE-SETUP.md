# 🚀 Setup Database trên Supabase

## 📋 Hướng dẫn từng bước

### Bước 1: Đăng nhập Supabase Dashboard
1. Truy cập [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Đăng nhập vào project của bạn
3. Click vào project: **GearVN News Blog** (hoặc tên project bạn đang dùng)

---

### Bước 2: Mở SQL Editor

1. Trong dashboard, click **SQL Editor** ở sidebar bên trái
2. Click nút **+ New query** để tạo query mới

---

### Bước 3: Chạy Schema (Tạo bảng)

#### Option 1: Copy/Paste trực tiếp
1. Mở file `02-new-complete-schema.sql`
2. **Copy toàn bộ nội dung**
3. Paste vào SQL Editor trên Supabase
4. Click **Run** (hoặc Ctrl+Enter)
5. Đợi khoảng 10-30 giây để hoàn thành

#### Option 2: Upload file
1. Click **Import SQL** trong SQL Editor
2. Chọn file `02-new-complete-schema.sql`
3. Click **Run**

**⚠️ Lưu ý quan trọng:**
- Schema sẽ tạo **25+ bảng**
- Tự động tạo **indexes** và **triggers**
- Extensions `uuid-ossp` và `pg_trgm` sẽ được enable tự động

---

### Bước 4: Seed dữ liệu mẫu (Optional)

Nếu muốn có dữ liệu mẫu để test:

1. Tạo **New query** mới trong SQL Editor
2. Mở file `03-seed-sample-data.sql`
3. **Copy toàn bộ nội dung**
4. Paste vào SQL Editor
5. Click **Run**

Dữ liệu mẫu bao gồm:
- ✅ 4 Users
- ✅ 3 Creators (Scrapshut, Linus Tech Tips, MKBHD)
- ✅ 3 Posts
- ✅ 3 Products
- ✅ 2 Squads
- ✅ 4 Achievements

---

### Bước 5: Verify (Kiểm tra)

Chạy query sau để kiểm tra:

```sql
-- Kiểm tra số lượng bảng đã tạo
SELECT
    schemaname,
    COUNT(*) as table_count
FROM pg_tables
WHERE schemaname = 'public'
GROUP BY schemaname;

-- Liệt kê tất cả các bảng
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Kiểm tra dữ liệu mẫu
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as post_count FROM posts;
SELECT COUNT(*) as creator_count FROM creators;
SELECT COUNT(*) as product_count FROM products;
```

**Kết quả mong đợi:**
- `table_count`: ~25-30 bảng
- `user_count`: 4 (nếu chạy seed data)
- `post_count`: 3 (nếu chạy seed data)

---

## 🔐 Row Level Security (RLS)

Schema đã **TỰ ĐỘNG** enable RLS và tạo policies. Tuy nhiên, Supabase cần một số điều chỉnh:

### 1. Disable RLS cho development (Tạm thời)

Nếu bạn muốn test nhanh **KHÔNG CẦN** authentication:

```sql
-- CẢNH BÁO: CHỈ DÙNG CHO DEVELOPMENT
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE votes DISABLE ROW LEVEL SECURITY;
-- ... (các bảng khác)
```

### 2. Enable RLS cho Production (Khuyến nghị)

Khi deploy production, **BẮT BUỘC** phải enable RLS và config policies:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy mẫu: Cho phép public đọc posts
CREATE POLICY "Public can read published posts"
ON posts FOR SELECT
USING (status = 'published');

-- Policy: User có thể update posts của mình
CREATE POLICY "Users can update own posts"
ON posts FOR UPDATE
USING (auth.uid()::text = posts.creator_id);
```

---

## 🔗 Kết nối từ ứng dụng

### 1. Lấy connection string

Trong Supabase Dashboard:
1. Click **Settings** → **Database**
2. Scroll xuống phần **Connection string**
3. Copy **Connection pooling** (URI)

### 2. Cấu hình trong `.env`

```env
# Supabase Database
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Supabase API (cho frontend)
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

### 3. Test connection

```javascript
// test-db.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Test query
const { data, error } = await supabase
  .from('posts')
  .select('*')
  .limit(5)

console.log('Posts:', data)
```

---

## 📊 Xem dữ liệu trong Table Editor

1. Click **Table Editor** trong sidebar
2. Chọn bảng muốn xem (VD: `users`, `posts`, `creators`)
3. Có thể **thêm/sửa/xóa** dữ liệu trực tiếp

---

## 🛠️ Troubleshooting

### ❌ Lỗi: "Extension uuid-ossp does not exist"

**Giải pháp:**
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### ❌ Lỗi: "Extension pg_trgm does not exist"

**Giải pháp:**
```sql
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
```

### ❌ Lỗi: "Relation already exists"

**Nghĩa là:** Bảng đã tồn tại rồi

**Giải pháp 1:** Uncomment phần DROP TABLE trong file schema:
```sql
-- Bỏ comment các dòng này trong file 02-new-complete-schema.sql
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
-- ... etc
```

**Giải pháp 2:** Xóa bảng thủ công trong Table Editor

### ❌ Lỗi: "Permission denied"

**Giải pháp:** Đảm bảo bạn đang dùng **Database password** đúng trong Settings → Database

---

## 🎯 Next Steps sau khi setup xong

### 1. Update Backend Code
Cập nhật code backend để sử dụng schema mới:

```typescript
// Ví dụ: Lấy posts với creators
const { data } = await supabase
  .from('posts')
  .select(`
    *,
    post_creators (
      creators (
        id,
        name,
        slug,
        avatar_url,
        verified
      )
    ),
    post_tags (
      tags (
        name,
        slug
      )
    )
  `)
  .eq('status', 'published')
  .order('published_at', { ascending: false })
```

### 2. Setup Authentication
```typescript
// Tạo user mới
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})

// User profile sẽ tự động được tạo bởi trigger
```

### 3. Test Gamification Features
```sql
-- Thêm points cho user
INSERT INTO user_points (user_id, points, action, reference_id)
VALUES ('user-uuid', 10, 'post_created', 'post-uuid');

-- Kiểm tra achievements
SELECT * FROM user_achievements
WHERE user_id = 'user-uuid';
```

---

## 📱 Supabase Studio Features

### 1. Database Backups
- Settings → Database → Backups
- Supabase tự động backup hàng ngày

### 2. Database Webhooks
- Database → Webhooks
- Trigger webhooks khi có INSERT/UPDATE/DELETE

### 3. Database Functions
- SQL Editor → Functions
- Tạo stored procedures và functions

### 4. Database Logs
- Logs → Database
- Xem query performance và errors

---

## ⚡ Performance Tips cho Supabase

### 1. Enable Connection Pooling
- Settings → Database → Connection Pooling
- Dùng **Transaction mode** cho web apps

### 2. Optimize Queries
```sql
-- Sử dụng indexes đã tạo sẵn
EXPLAIN ANALYZE
SELECT * FROM posts
WHERE status = 'published'
ORDER BY published_at DESC
LIMIT 10;
```

### 3. Use Supabase Edge Functions
- Tạo serverless functions để xử lý logic phức tạp
- Giảm tải cho database

---

## 🎉 Hoàn thành!

Sau khi setup xong, bạn đã có:
- ✅ Database với 25+ bảng
- ✅ Auto-triggers cho counting
- ✅ Gamification system hoàn chỉnh
- ✅ Products integration
- ✅ Community features (Squads)
- ✅ RLS policies sẵn sàng

**Ready to code!** 🚀

---

## 📞 Cần hỗ trợ?

1. Check Supabase Docs: [https://supabase.com/docs](https://supabase.com/docs)
2. Supabase Discord: [https://discord.supabase.com](https://discord.supabase.com)
3. Check logs trong Supabase Dashboard → Logs
