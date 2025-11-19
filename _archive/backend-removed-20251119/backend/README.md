# GearVN Blog Backend API

Backend API server cho GearVN Creator Hub, được xây dựng với Go (Fiber framework) và Supabase PostgreSQL.

## 🚀 Tính năng

- ✅ REST API hoàn chỉnh cho Posts, Creators, Users
- ✅ Authentication với JWT
- ✅ CMS endpoints (admin only)
- ✅ User interactions: Bookmarks, Following, Upvotes, Comments
- ✅ Kết nối Supabase PostgreSQL
- ✅ CORS support
- ✅ Middleware: Auth, Logger, Recovery

## 📋 Prerequisites

- Go 1.21+ ([Download](https://go.dev/dl/))
- Supabase Account ([Sign up](https://supabase.com))

## 🛠️ Setup

### 1. Tạo Supabase Project

1. Truy cập [supabase.com](https://supabase.com)
2. Tạo project mới
3. Lấy các thông tin:
   - Project URL: `https://your-project.supabase.co`
   - Anon Key: Từ Settings > API
   - Service Role Key: Từ Settings > API
   - Database URL: Từ Settings > Database > Connection String (URI)

### 2. Cấu hình Environment

```bash
# Copy file .env.example
cp .env.example .env

# Sửa file .env với thông tin Supabase của bạn
```

**.env:**
```env
PORT=8080
ENVIRONMENT=development

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

DATABASE_URL=postgresql://postgres:your-password@db.your-project.supabase.co:5432/postgres

JWT_SECRET=change-this-to-random-secret-key

ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:5500

ADMIN_EMAIL=admin@gearvn.com
ADMIN_PASSWORD=admin123
```

### 3. Install Dependencies

```bash
go mod download
```

### 4. Chạy Server

```bash
go run .
```

Server sẽ chạy tại `http://localhost:8080`

## 📚 API Endpoints

### Public Endpoints

```
GET  /                          - Health check
GET  /api/posts                 - Lấy tất cả posts
GET  /api/posts/:id             - Lấy post theo ID
GET  /api/creators              - Lấy tất cả creators
GET  /api/creators/:id          - Lấy creator theo ID
GET  /api/creators/:id/posts    - Lấy posts của creator
POST /api/auth/register         - Đăng ký user mới
POST /api/auth/login            - Đăng nhập
```

### Protected Endpoints (Requires JWT Token)

```
GET    /api/auth/me                     - Lấy thông tin user hiện tại
GET    /api/user/bookmarks              - Lấy bookmarks của user
POST   /api/user/bookmarks/:postId      - Thêm bookmark
DELETE /api/user/bookmarks/:postId      - Xóa bookmark
GET    /api/user/following              - Lấy danh sách following
POST   /api/user/following/:creatorId   - Follow creator
DELETE /api/user/following/:creatorId   - Unfollow creator
GET    /api/user/upvotes                - Lấy danh sách upvotes
POST   /api/user/upvotes/:postId        - Upvote post
DELETE /api/user/upvotes/:postId        - Remove upvote
GET    /api/posts/:id/comments          - Lấy comments
POST   /api/posts/:id/comments          - Thêm comment
```

### CMS Endpoints (Admin Only)

```
GET    /cms/posts           - Lấy tất cả posts (bao gồm unpublished)
POST   /cms/posts           - Tạo post mới
PUT    /cms/posts/:id       - Cập nhật post
DELETE /cms/posts/:id       - Xóa post
GET    /cms/creators        - Lấy tất cả creators
POST   /cms/creators        - Tạo creator mới
PUT    /cms/creators/:id    - Cập nhật creator
DELETE /cms/creators/:id    - Xóa creator
GET    /cms/stats           - Lấy thống kê
```

## 🔐 Authentication

### Register

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "username": "johndoe"
  }'
```

### Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "role": "user"
  }
}
```

### Sử dụng Token

```bash
curl -X GET http://localhost:8080/api/user/bookmarks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📝 Examples

### Get All Posts

```bash
curl http://localhost:8080/api/posts
```

### Add Bookmark (Requires Auth)

```bash
curl -X POST http://localhost:8080/api/user/bookmarks/ai-gaming-trends \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Follow Creator (Requires Auth)

```bash
curl -X POST http://localhost:8080/api/user/following/gearvn-studio \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Post (Admin Only)

```bash
curl -X POST http://localhost:8080/cms/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d '{
    "id": "new-post-slug",
    "title": "My New Post",
    "excerpt": "Short description",
    "content": "Full content here...",
    "cover_image": "https://example.com/image.jpg",
    "creator_id": "gearvn-studio",
    "creator_name": "GearVN Studio",
    "creator_avatar": "https://example.com/avatar.jpg",
    "category": "Tech",
    "tags": ["gaming", "ai"],
    "read_time": "5 min",
    "published": true
  }'
```

## 🗃️ Database Schema

### Users
- id, email, password_hash, username, avatar_url, role, created_at, updated_at

### Posts
- id, title, excerpt, content, cover_image, creator_id, creator_name, creator_avatar
- category, tags[], upvotes, comments_count, read_time, published, created_at, updated_at

### Creators
- id, name, initials, avatar, banner, bio, tags[], followers, following, similar[], created_at, updated_at

### Bookmarks
- id, user_id, post_id, created_at

### Following
- id, user_id, creator_id, created_at

### Upvotes
- id, user_id, post_id, created_at

### Comments
- id, post_id, user_id, content, parent_id, created_at, updated_at

## 🔧 Development

### Build

```bash
go build -o server
```

### Run

```bash
./server
```

### Format Code

```bash
go fmt ./...
```

## 🚢 Deployment

### Heroku

```bash
heroku create gvn-blog-api
heroku config:set DATABASE_URL="your-supabase-connection-string"
heroku config:set JWT_SECRET="your-secret"
git push heroku main
```

### Railway

1. Kết nối GitHub repo
2. Thêm environment variables
3. Deploy

### Fly.io

```bash
fly launch
fly secrets set DATABASE_URL="your-connection-string"
fly deploy
```

## 📖 Project Structure

```
backend/
├── main.go           # Entry point, khởi tạo server
├── auth.go           # Authentication logic
├── handlers.go       # API handlers (posts, creators, users)
├── cms.go            # CMS handlers (admin)
├── go.mod            # Dependencies
├── .env              # Environment variables
└── README.md         # Documentation
```

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License

## 📞 Support

- Email: support@gearvn.com
- GitHub Issues: [Create Issue](https://github.com/yourusername/gvn-blog-backend/issues)
