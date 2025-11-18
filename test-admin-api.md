# Test Admin API

## Setup

### 1. Start Backend Server

```bash
cd backend
go run .
```

Server sẽ chạy tại: http://localhost:8080

### 2. Create Admin User

Có 2 cách:

**Option A: Register qua API**
```bash
curl -X POST http://localhost:8080/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gearvn.com",
    "password": "admin123",
    "username": "admin"
  }'
```

**Option B: Update user hiện có trong database**
```sql
-- Chạy trong Supabase SQL Editor
UPDATE users
SET role = 'admin'
WHERE email = 'test@gearvn.com';
```

### 3. Login và lấy Token

```bash
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gearvn.com",
    "password": "admin123"
  }'
```

Response sẽ có token:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@gearvn.com",
    "username": "admin",
    "role": "admin"
  }
}
```

Lưu token vào biến môi trường:
```bash
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Hoặc trên Windows:
```powershell
$TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Test Admin Endpoints

### Dashboard Stats

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/admin/dashboard/stats
```

Expected response:
```json
{
  "totalUsers": 10,
  "totalPosts": 10,
  "totalViews": 15000,
  "activeUsers": 5
}
```

### Recent Activity

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/admin/dashboard/activity
```

Expected response:
```json
{
  "posts": [
    {
      "id": "...",
      "title": "Post title",
      "slug": "post-slug",
      "type": "article",
      "status": "published",
      "view_count": 100,
      "thumbnail_url": "...",
      "published_at": "...",
      "created_at": "...",
      "updated_at": "..."
    }
  ],
  "users": [
    {
      "id": "...",
      "username": "user1",
      "email": "user1@example.com",
      "display_name": "User One",
      "avatar_url": "...",
      "role": "user",
      "status": "active",
      "created_at": "..."
    }
  ]
}
```

### Get All Posts

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/api/admin/posts?page=1&per_page=20"
```

With filters:
```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/api/admin/posts?status=published&type=article&search=laptop"
```

### Create New Post

```bash
curl -X POST http://localhost:8080/api/admin/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Post from API",
    "slug": "test-post-from-api",
    "content": "This is test content",
    "excerpt": "Test excerpt",
    "type": "article",
    "status": "draft",
    "thumbnail_url": "https://example.com/image.jpg"
  }'
```

### Update Post

```bash
curl -X PUT http://localhost:8080/api/admin/posts/{post_id} \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "slug": "updated-slug",
    "content": "Updated content",
    "excerpt": "Updated excerpt",
    "type": "article",
    "status": "published",
    "thumbnail_url": "https://example.com/new-image.jpg"
  }'
```

### Delete Post

```bash
curl -X DELETE http://localhost:8080/api/admin/posts/{post_id} \
  -H "Authorization: Bearer $TOKEN"
```

### Bulk Delete Posts

```bash
curl -X POST http://localhost:8080/api/admin/posts/bulk-delete \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ids": ["post_id_1", "post_id_2", "post_id_3"]
  }'
```

### Get All Users

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/api/admin/users?page=1&per_page=20"
```

With filters:
```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/api/admin/users?role=user&status=active&search=john"
```

### Get User Details

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/admin/users/{user_id}
```

### Update User

```bash
curl -X PUT http://localhost:8080/api/admin/users/{user_id} \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newusername",
    "email": "newemail@example.com",
    "display_name": "New Display Name",
    "avatar_url": "https://example.com/avatar.jpg",
    "bio": "New bio",
    "status": "active"
  }'
```

### Ban User

```bash
curl -X POST http://localhost:8080/api/admin/users/{user_id}/ban \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Spamming"
  }'
```

### Unban User

```bash
curl -X POST http://localhost:8080/api/admin/users/{user_id}/unban \
  -H "Authorization: Bearer $TOKEN"
```

### Change User Role

```bash
curl -X PUT http://localhost:8080/api/admin/users/{user_id}/role \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "moderator"
  }'
```

Valid roles: `user`, `moderator`, `admin`

### Grant Achievement

```bash
curl -X POST http://localhost:8080/api/admin/users/{user_id}/achievements \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "achievement_id": "achievement_uuid_here"
  }'
```

## Test with Frontend

1. **Start Backend** (if not running):
   ```bash
   cd backend
   go run .
   ```

2. **Open Admin Login Page**:
   - Open: http://localhost:8080/admin/login.html
   - Hoặc mở file trực tiếp: `file:///C:/Users/duong/gvn-news-blog/admin/login.html`

3. **Login**:
   - Email: `admin@gearvn.com`
   - Password: `admin123`

4. **Test các trang**:
   - Dashboard: http://localhost:8080/admin/index.html
   - Posts Management: Click "Posts" trong sidebar
   - Users Management: Click "Users" trong sidebar

## Error Handling

### 401 Unauthorized
```json
{
  "error": "Missing authorization token"
}
```
→ Cần thêm Authorization header với Bearer token

### 403 Forbidden
```json
{
  "error": "Access denied. Admin privileges required."
}
```
→ User không có role admin hoặc moderator

### 404 Not Found
```json
{
  "error": "Post not found"
}
```
→ Resource không tồn tại

### 409 Conflict
```json
{
  "error": "Post with this slug already exists"
}
```
→ Duplicate entry

## Current Status

✅ Backend server running at http://localhost:8080
✅ Admin middleware implemented
✅ All CRUD endpoints implemented
❓ Need to create admin user in database

## Next Steps

1. Tạo admin user (chọn 1 trong 2 cách ở trên)
2. Test tất cả endpoints với curl
3. Test frontend admin panel
4. Add more sample data nếu cần
