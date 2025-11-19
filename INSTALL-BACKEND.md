# 🚀 HƯỚNG DẪN CÀI ĐẶT & CHẠY BACKEND

## BƯỚC 1: Cài đặt Go

### Windows:
1. Download Go từ: https://go.dev/dl/
2. Chọn file: `go1.23.x.windows-amd64.msi`
3. Chạy installer
4. Mở PowerShell MỚI và verify:
   ```powershell
   go version
   ```
   Kết quả: `go version go1.23.x windows/amd64`

---

## BƯỚC 2: Setup Environment Variables

Tạo file `.env` trong thư mục `backend/`:

```env
DATABASE_URL=postgresql://postgres.qibhlrsdykpkbsnelubz:Gearvn%232025@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=8080
ALLOWED_ORIGINS=*
```

**File đã có sẵn:** `backend/.env`

---

## BƯỚC 3: Install Dependencies

Trong thư mục `backend/`:

```powershell
cd backend
go mod tidy
```

Lệnh này sẽ download tất cả packages cần thiết.

---

## BƯỚC 4: Chạy Backend Server

```powershell
cd backend
go run .
```

**Kết quả mong đợi:**
```
Server is running on http://localhost:8080
Database connected successfully
```

---

## BƯỚC 5: Test API

Mở browser hoặc dùng curl:

### 1. Health Check
```
http://localhost:8080/
```

### 2. Get Posts
```
http://localhost:8080/api/posts
```

### 3. Get Creators
```
http://localhost:8080/api/creators
```

### 4. Get Post by Slug
```
http://localhost:8080/api/posts/danh-gia-asus-rog-strix-g15
```

---

## ⚠️ TROUBLESHOOTING

### Lỗi: "go: command not found"
- Đóng PowerShell và mở lại (hoặc restart máy)
- Go cần restart shell để load PATH

### Lỗi: "cannot connect to database"
- Kiểm tra file `.env` có đúng DATABASE_URL
- Test kết nối Supabase trên web

### Lỗi: "port 8080 already in use"
- Đổi PORT trong `.env` thành 8081 hoặc 3000

---

## ✅ VERIFICATION

Sau khi server chạy thành công, test bằng browser:

1. Mở: `http://localhost:8080/api/posts`
2. Xem JSON response với 10 posts
3. Mỗi post có: `id`, `title`, `slug`, `thumbnail_url`, `creators[]`, `tags[]`

---

## 📝 NEXT STEPS

Sau khi backend chạy OK:
1. Update `scripts/api-client.js` để trỏ về `http://localhost:8080`
2. Mở `index.html` trên browser
3. Xem posts hiển thị với hình ảnh
