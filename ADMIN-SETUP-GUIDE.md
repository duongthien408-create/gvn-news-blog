# Admin CMS Setup Guide

## ⚠️ Vấn đề hiện tại

Bạn đang gặp lỗi **401 Unauthorized** khi login vì **chưa có admin user trong database**.

## ✅ Giải pháp nhanh (3 bước)

### Bước 1: Chạy SQL trong Supabase

Mở Supabase SQL Editor và chạy file [`quick-setup-admin.sql`](quick-setup-admin.sql):

```sql
-- Copy toàn bộ nội dung file quick-setup-admin.sql và paste vào SQL Editor
```

Hoặc chạy trực tiếp:

```sql
DO $$
BEGIN
    UPDATE users
    SET role = 'admin'
    WHERE email = 'admin@gearvn.com';

    IF NOT FOUND THEN
        INSERT INTO users (id, email, password_hash, username, role, status, created_at)
        VALUES (
            uuid_generate_v4(),
            'admin@gearvn.com',
            '$2a$10$ox9yJi4o4RHHf5285.ccQ.uk5igSnvUW78g7jZ6Jd8z7HGq88EXsS',
            'admin',
            'admin',
            'active',
            NOW()
        );
    END IF;
END $$;

-- Verify
SELECT id, email, username, role, status FROM users WHERE email = 'admin@gearvn.com';
```

### Bước 2: Test Login qua curl

```bash
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gearvn.com","password":"admin123"}'
```

Nếu thành công, bạn sẽ nhận được:
```json
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "email": "admin@gearvn.com",
    "username": "admin",
    "role": "admin"
  }
}
```

### Bước 3: Login vào Admin Panel

1. Mở: http://localhost:8080/admin/login.html
2. Nhập:
   - Email: `admin@gearvn.com`
   - Password: `admin123`
3. Click "Sign in"
4. Sẽ redirect tới Dashboard

## 🔧 Giải pháp thay thế

### Option A: Update user có sẵn thành admin

Nếu bạn đã có users từ sample data:

```sql
-- Xem danh sách users
SELECT id, email, username, role FROM users LIMIT 10;

-- Update 1 user thành admin
UPDATE users SET role = 'admin' WHERE email = 'user_email_nào_đó';
```

### Option B: Tạo admin user mới

```sql
-- Generate password hash mới (nếu muốn đổi password)
-- Chạy trong terminal:
-- cd backend/tools
-- go run generate-password-hash.go your_password

INSERT INTO users (id, email, password_hash, username, role, status, created_at)
VALUES (
  uuid_generate_v4(),
  'your_email@example.com',
  'bcrypt_hash_từ_tool_trên',
  'your_username',
  'admin',
  'active',
  NOW()
);
```

### Option C: Seed sample data

Nếu database trống, chạy sample data:

```bash
# Trong Supabase SQL Editor
# 1. Chạy schema: database/02-new-complete-schema.sql
# 2. Chạy sample data: database/seed-sample-data.sql
```

Sample data đã có sẵn admin user với credentials:
- Email: `admin@gearvn.com`
- Password: `admin123` (bcrypt hash có sẵn trong file)

## 📝 Lỗi thường gặp

### Lỗi: "Failed to create profile"

Nguyên nhân: Trigger tự động tạo profile chưa hoạt động

Giải pháp: Tạo profile manually sau khi insert user:

```sql
-- Sau khi INSERT user, chạy thêm:
INSERT INTO user_profiles (user_id, display_name)
SELECT id, username FROM users WHERE email = 'admin@gearvn.com';

INSERT INTO user_preferences (user_id, theme, language, email_notifications, push_notifications)
SELECT id, 'dark', 'en', true, false FROM users WHERE email = 'admin@gearvn.com';

INSERT INTO user_levels (user_id, level, total_points)
SELECT id, 1, 0 FROM users WHERE email = 'admin@gearvn.com';

INSERT INTO streaks (user_id, current_streak, longest_streak, last_activity_date)
SELECT id, 0, 0, CURRENT_DATE FROM users WHERE email = 'admin@gearvn.com';
```

### Lỗi: "Invalid credentials"

Kiểm tra:
1. Email có tồn tại trong database không?
2. Password hash có đúng không?
3. User status có phải 'active' không?

```sql
SELECT email, password_hash, status FROM users WHERE email = 'admin@gearvn.com';
```

### Lỗi: "Access denied. Admin privileges required"

User tồn tại nhưng không phải admin:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@gearvn.com';
```

## 🔐 Thông tin đăng nhập mặc định

Sau khi chạy [`quick-setup-admin.sql`](quick-setup-admin.sql):

```
Email: admin@gearvn.com
Password: admin123
Role: admin
```

**⚠️ QUAN TRỌNG**: Đổi password sau khi đăng nhập lần đầu!

## 🧪 Test API Endpoints

Sau khi login thành công, lưu token và test:

```bash
# Lưu token
TOKEN="token_từ_login_response"

# Test dashboard stats
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/admin/dashboard/stats

# Test get posts
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/admin/posts

# Test get users
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/admin/users
```

## 📚 Tài liệu liên quan

- [test-admin-api.md](test-admin-api.md) - Hướng dẫn test tất cả API endpoints
- [ADMIN-BACKEND-COMPLETE.md](ADMIN-BACKEND-COMPLETE.md) - Documentation đầy đủ
- [quick-setup-admin.sql](quick-setup-admin.sql) - SQL script tạo admin nhanh
- [create-admin-user.sql](create-admin-user.sql) - SQL với hướng dẫn chi tiết

## 🛠️ Tools

### Generate Password Hash

```bash
cd backend/tools
go run generate-password-hash.go your_password
```

Output:
```
Password: your_password
Bcrypt Hash: $2a$10$...
SQL to create admin user: ...
```

## 🚀 Production Checklist

- [ ] Đổi JWT_SECRET trong .env
- [ ] Đổi password admin mặc định
- [ ] Disable hoặc xóa sample data
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Add rate limiting
- [ ] Setup monitoring
- [ ] Backup database

## 🆘 Cần giúp đỡ?

1. Check xem backend có đang chạy không: http://localhost:8080
2. Check database connection trong backend logs
3. Verify user exists: `SELECT * FROM users WHERE email = 'admin@gearvn.com'`
4. Check browser console for errors
5. Check backend logs for error details

---

**Status**: ✅ Tools sẵn sàng | 🔧 Cần tạo admin user trong database
