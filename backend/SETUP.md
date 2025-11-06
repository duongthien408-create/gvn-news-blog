# 🚀 Quick Setup Guide - GearVN Blog Backend

## Step 1: Tạo Supabase Project (5 phút)

1. **Truy cập Supabase**
   - Vào https://supabase.com
   - Đăng nhập hoặc đăng ký account

2. **Tạo Project Mới**
   - Click "New Project"
   - Đặt tên: `gvn-blog`
   - Chọn region gần Việt Nam nhất (Singapore hoặc Tokyo)
   - Đặt database password (lưu lại!)
   - Click "Create new project"
   - Đợi 2-3 phút để project được tạo

3. **Lấy Thông Tin Kết Nối**

   Vào **Settings > API**:
   - Copy **URL**: `https://xxxxx.supabase.co`
   - Copy **anon/public key**: `eyJhbGc...`
   - Copy **service_role key**: `eyJhbGc...`

   Vào **Settings > Database > Connection String**:
   - Chọn tab **URI**
   - Copy connection string: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`
   - Thay `[YOUR-PASSWORD]` bằng password bạn đã đặt ở bước 2

## Step 2: Cấu Hình Backend (2 phút)

1. **Tạo file .env**

```bash
cd backend
cp .env.example .env
```

2. **Điền thông tin vào .env**

Mở file `.env` và điền các thông tin từ Supabase:

```env
PORT=8080
ENVIRONMENT=development

# Paste từ Supabase Settings > API
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGc...your-anon-key...
SUPABASE_SERVICE_KEY=eyJhbGc...your-service-role-key...

# Paste từ Supabase Settings > Database > Connection String (URI)
DATABASE_URL=postgresql://postgres:your-password@db.xxxxx.supabase.co:5432/postgres

# Tạo một secret key random (hoặc giữ nguyên để test)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend URLs (giữ nguyên)
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:5500

# Admin account (giữ nguyên hoặc đổi)
ADMIN_EMAIL=admin@gearvn.com
ADMIN_PASSWORD=admin123
```

## Step 3: Cài Đặt & Chạy (2 phút)

```bash
# Install dependencies
make install

# Hoặc
go mod download

# Chạy server (sẽ tự động tạo tables)
make run

# Hoặc
go run .
```

Server sẽ chạy tại: **http://localhost:8080**

## Step 4: Seed Sample Data (30 giây)

Mở terminal mới:

```bash
cd backend
make seed

# Hoặc
go run . --seed
```

Lệnh này sẽ tạo:
- ✅ Admin user: `admin@gearvn.com` / `admin123`
- ✅ 3 Creators mẫu
- ✅ 3 Posts mẫu

## Step 5: Test API (1 phút)

### Health Check
```bash
curl http://localhost:8080/
```

### Get Posts
```bash
curl http://localhost:8080/api/posts
```

### Login as Admin
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gearvn.com",
    "password": "admin123"
  }'
```

Copy `token` từ response để dùng cho các request tiếp theo.

### Get CMS Stats (Admin only)
```bash
curl http://localhost:8080/cms/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## ✅ Hoàn Thành!

Backend đã sẵn sàng! Giờ bạn có thể:

1. **Kết nối Frontend với Backend**
   - Update file `scripts/api.js` trong frontend
   - Thay `API_URL` thành `http://localhost:8080/api`

2. **Xem Database trực tiếp trên Supabase**
   - Vào Supabase Dashboard > Table Editor
   - Xem các bảng: `posts`, `creators`, `users`, `bookmarks`, v.v.

3. **Tạo Content mới qua CMS**
   - Dùng Postman hoặc curl
   - Hoặc build CMS frontend sau

## 🔥 Next Steps

- [ ] Build CMS Admin Panel (React/Vue)
- [ ] Kết nối Frontend với Backend
- [ ] Deploy lên Railway/Fly.io
- [ ] Setup CI/CD

## 🆘 Troubleshooting

### Lỗi kết nối database

```
Failed to connect to database
```

**Fix**: Kiểm tra lại `DATABASE_URL` trong `.env`, đảm bảo:
- Password đúng
- Không có khoảng trắng thừa
- Format: `postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres`

### Lỗi JWT

```
Invalid or expired token
```

**Fix**:
- Login lại để lấy token mới
- Check `JWT_SECRET` trong `.env`

### Port đã được sử dụng

```
bind: address already in use
```

**Fix**: Đổi port trong `.env`:
```env
PORT=8081
```

## 📚 Documentation

- [Full API Documentation](./README.md)
- [Supabase Docs](https://supabase.com/docs)
- [Fiber Framework](https://docs.gofiber.io/)
