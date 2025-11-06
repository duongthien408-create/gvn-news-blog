# 🚀 GearVN Creator Hub - MVP Project

**Một nền tảng tổng hợp tin tức và cộng đồng cho creators, lấy cảm hứng từ daily.dev**

---

## 📊 Project Status

```
Progress:     ██████████████░░░░░░ 70% MVP Ready
Timeline:     2-3 tuần → 100% MVP
Target:       Website tương tự daily.dev cho GearVN
Status:       Backend hoàn thiện, Frontend đồng bộ theme
```

---

## 🎨 Design System - GearVN Red Theme

### ✅ Theme đã hoàn thiện (100%)
- **Dark Mode Only** - Pure black (#000000) background
- **GearVN Red Accent** (#EF4444) - Thay thế hoàn toàn blue theme
- **Responsive Design** - Mobile, tablet, desktop
- **Consistent Colors** - Tất cả components đã đồng bộ

### Color Palette:
```css
--color-surface: #000000        /* Pure black - Main background */
--color-panel: #0F0F0F          /* Almost black - Sidebar, header */
--color-card: #191919           /* Dark gray - Cards, inputs */
--color-border: #323232         /* Border gray */
--color-accent: #EF4444         /* GearVN Red - Primary actions */
--color-accent-hover: #F87171   /* Lighter red - Hover states */
```

---

## 🗂️ Cấu Trúc Dự Án

```
MVP - GVN Blogs/
│
├── 📚 documentation/          ⭐ TÀI LIỆU HƯỚNG DẪN
│   ├── README.md              (Index - Đọc đầu tiên)
│   ├── SUMMARY.md             (Tóm tắt & Next steps)
│   ├── IMPLEMENTATION-GUIDE.md (Hướng dẫn code chi tiết)
│   ├── GAP-ANALYSIS-AND-RECOMMENDATIONS.md
│   └── COMPARISON-CHART.md
│
├── 🎨 FRONTEND (HTML/JS/CSS) ✅ 90% Complete
│   ├── ✅ index.html              (Trang chủ - Feed chính)
│   ├── ✅ login.html              (Đăng nhập)
│   ├── ✅ register.html           (Đăng ký)
│   ├── ✅ profile.html            (Trang cá nhân creator)
│   ├── ✅ bookmarks.html          (Danh sách bookmark)
│   ├── ✅ following.html          (Creators đang follow)
│   ├── ✅ explore.html            (Khám phá nội dung)
│   ├── ✅ settings.html           (Cài đặt người dùng)
│   ├── ✅ folders.html            (Quản lý thư mục)
│   ├── ✅ tags.html               (Quản lý hashtags)
│   ├── ✅ custom-feeds.html       (Tùy chỉnh feed)
│   └── scripts/
│       ├── ✅ theme.js            (Dark mode theme manager)
│       ├── ✅ api-client.js       (REST API client + JWT)
│       ├── ✅ feed.js             (Feed rendering + data loading)
│       ├── ✅ post-modal.js       (Post detail modal)
│       ├── ✅ interactions.js     (Upvote, bookmark, follow, share)
│       ├── ✅ render.js           (UI rendering functions)
│       ├── ✅ detail.js           (Post detail page logic)
│       ├── ✅ bookmarks.js        (Bookmark page logic)
│       ├── ✅ following.js        (Following page logic)
│       ├── ✅ profile.js          (Profile page logic)
│       └── ✅ main.js             (Global utilities)
│
├── 🔧 BACKEND (Go API) ✅ 95% Complete
│   ├── ✅ main.go                (Server entry point)
│   ├── ✅ auth.go                (JWT authentication)
│   ├── ✅ handlers.go            (API endpoints)
│   ├── ✅ cms.go                 (Content management)
│   ├── ✅ database.go            (Database connection)
│   ├── ✅ middleware.go          (Auth middleware)
│   ├── ✅ models.go              (Data models)
│   └── PostgreSQL Schema:
│       ├── ✅ users               (User accounts)
│       ├── ✅ posts               (Blog posts)
│       ├── ✅ comments            (Post comments)
│       ├── ✅ upvotes             (Post upvotes)
│       ├── ✅ bookmarks           (Saved posts)
│       ├── ✅ user_following      (Follow relationships)
│       └── ✅ sources             (RSS feed sources)
│
└── 📖 daily-dev-analysis/     (Tài liệu nghiên cứu daily.dev)
```

---

## 🚀 Quick Start

### 1. Setup Backend (5 phút)

```bash
cd backend

# Copy environment
cp .env.example .env
# Edit .env với database credentials của bạn

# Install dependencies
go mod download

# Run with seed data (first time only)
go run . --seed

# Run server
go run .

# Server sẽ chạy tại: http://localhost:8080
```

### 2. Setup Frontend (2 phút)

```bash
# Mở trực tiếp trong browser
open index.html

# Hoặc dùng local server (recommended)
python3 -m http.server 8000
# → http://localhost:8000
```

### 3. Test Login

```
Demo Account:
Email: admin@gearvn.com
Password: admin123
```

---

## ✅ Features Hoàn Thành

### 🎨 Frontend (90%)
- ✅ **Dark Theme System** - Pure black với GearVN red accent
- ✅ **9 Pages HTML** - Tất cả trang đã hoàn thiện UI/UX
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Post Modal** - Chi tiết bài viết trong modal
- ✅ **User Authentication UI** - Login/Register forms
- ✅ **Feed Grid** - Masonry layout với post cards
- ✅ **Interactions** - Upvote, bookmark, share, follow buttons
- ✅ **Color Consistency** - 100% đồng bộ GearVN red theme

### 🔧 Backend (95%)
- ✅ **REST API** - 30+ endpoints hoàn chỉnh
- ✅ **JWT Authentication** - Secure login/register
- ✅ **PostgreSQL** - Database schema đầy đủ
- ✅ **CRUD Operations** - Posts, comments, users
- ✅ **Social Features** - Upvotes, bookmarks, following
- ✅ **CORS Enabled** - Frontend integration ready
- ✅ **Error Handling** - Comprehensive error responses

### 🔗 Integration (85%)
- ✅ **API Client** - JavaScript wrapper cho tất cả endpoints
- ✅ **JWT Storage** - LocalStorage với auto-refresh
- ✅ **Data Loading** - Async data fetching với error handling
- ✅ **User State** - Login/logout state management
- ✅ **Real-time Updates** - Upvote counts, bookmark states

---

## ❌ Features Còn Thiếu (30%)

### 🔴 Critical (Cần làm ngay):
1. **RSS Content Aggregation** (Chưa có)
   - Auto-fetch từ RSS feeds
   - Parse và lưu vào database
   - Schedule updates (cron job)

2. **Search & Filtering** (Chưa có)
   - Full-text search posts
   - Filter by category, tags
   - Sort by date, upvotes

3. **Admin Dashboard** (Backend có, UI chưa)
   - Quản lý RSS sources
   - Moderate content
   - User management

### 🟡 Important (Có thể làm sau):
4. **Personalization** (Chưa có)
   - Feed recommendations
   - User preferences
   - Custom feed algorithms

5. **Notifications** (Chưa có)
   - Real-time notifications
   - Email notifications
   - In-app notifications

6. **Analytics** (Chưa có)
   - View counts
   - Click tracking
   - User behavior analytics

---

## 📅 Kế Hoạch 3 Tuần (Updated)

| Week | Focus | Goal | Status |
|------|-------|------|--------|
| **1** | Theme Consistency | 100% GearVN red theme | ✅ **DONE** |
| **2** | RSS Aggregation | Auto-fetch nội dung từ RSS | 🔄 **NEXT** |
| **3** | Search & Polish | MVP ready for production | ⏳ Pending |

---

## 💡 Next Steps (Tuần Tới)

### Priority 1: RSS Content Aggregation
```bash
# 1. Install gofeed library
cd backend
go get github.com/mmcdole/gofeed

# 2. Tạo file aggregator.go
# 3. Implement FetchRSSFeeds()
# 4. Add cron job để auto-update
# 5. Test với real RSS feeds
```

**Estimated Time:** 2-3 ngày

### Priority 2: Search Implementation
```bash
# 1. Add full-text search index
# 2. Implement /api/posts/search endpoint
# 3. Add search UI component
# 4. Add filters (category, date, tags)
```

**Estimated Time:** 1-2 ngày

### Priority 3: Admin Dashboard UI
```bash
# 1. Tạo admin.html page
# 2. RSS source management UI
# 3. User moderation interface
# 4. Content approval workflow
```

**Estimated Time:** 2-3 ngày

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Vanilla JavaScript (ES6+)
- **CSS:** Tailwind CSS (JIT mode via CDN)
- **Icons:** Lucide Icons
- **Theme:** Custom CSS variables + dark mode only
- **State:** LocalStorage for auth + cache

### Backend
- **Language:** Go 1.21+
- **Framework:** Fiber v2
- **Database:** PostgreSQL (Supabase)
- **Auth:** JWT (golang-jwt)
- **ORM:** Database/sql (native)
- **CORS:** Fiber CORS middleware

### Deployment (Planned)
- **Frontend:** Vercel / Netlify
- **Backend:** Railway / Render
- **Database:** Supabase (PostgreSQL)
- **CDN:** Cloudflare (optional)

---

## 📈 Progress Tracker

```
Overall:      ██████████████░░░░░░ 70% Complete

Frontend:     ██████████████████░░ 90% ✅
Backend:      ███████████████████░ 95% ✅
Integration:  █████████████████░░░ 85% ✅
Content Agg:  ░░░░░░░░░░░░░░░░░░░░  0% ❌
Search:       ░░░░░░░░░░░░░░░░░░░░  0% ❌
Admin UI:     ░░░░░░░░░░░░░░░░░░░░  0% ❌

Target: 100% in 2-3 weeks 🎯
```

---

## 🎯 Current Status Summary

### ✅ Completed
1. ✅ **Backend API** - 30+ endpoints, JWT auth, PostgreSQL
2. ✅ **Frontend UI** - 11 pages HTML, dark theme, responsive
3. ✅ **Theme System** - GearVN red (#EF4444) 100% consistent
4. ✅ **JavaScript Modules** - api-client, feed, interactions, etc.
5. ✅ **User Features** - Login, register, profile, bookmarks
6. ✅ **Social Features** - Upvote, comment, follow, share

### 🔄 In Progress
1. 🔄 **Testing** - E2E testing với real data
2. 🔄 **Bug Fixes** - Minor UI/UX improvements

### ⏳ Next Up
1. ⏳ **RSS Aggregation** - Priority #1
2. ⏳ **Search & Filter** - Priority #2
3. ⏳ **Admin Dashboard** - Priority #3

---

## 📞 API Endpoints

### Authentication
- `POST /api/register` - Đăng ký tài khoản
- `POST /api/login` - Đăng nhập
- `GET /api/me` - Lấy thông tin user hiện tại

### Posts
- `GET /api/posts` - Lấy danh sách posts (có pagination)
- `GET /api/posts/:id` - Lấy chi tiết post
- `POST /api/posts` - Tạo post mới (creator only)
- `PUT /api/posts/:id` - Cập nhật post
- `DELETE /api/posts/:id` - Xóa post

### Interactions
- `POST /api/posts/:id/upvote` - Upvote/un-upvote post
- `GET /api/posts/:id/comments` - Lấy comments
- `POST /api/posts/:id/comments` - Thêm comment
- `POST /api/bookmarks` - Bookmark post
- `DELETE /api/bookmarks/:id` - Xóa bookmark
- `GET /api/bookmarks` - Lấy danh sách bookmarks

### Social
- `POST /api/follow/:userId` - Follow/unfollow user
- `GET /api/following` - Lấy danh sách đang follow
- `GET /api/users/:id` - Lấy profile user

### Admin (CMS)
- `GET /api/cms/sources` - Lấy danh sách RSS sources
- `POST /api/cms/sources` - Thêm RSS source mới
- `PUT /api/cms/sources/:id` - Cập nhật source
- `DELETE /api/cms/sources/:id` - Xóa source

**Full API Documentation:** See [backend/API.md](backend/API.md)

---

## 📝 Quick Commands

```bash
# Start backend server
cd backend && go run .

# Start backend with seed data
cd backend && go run . --seed

# Start frontend dev server
python3 -m http.server 8000

# Test API
curl http://localhost:8080/api/posts

# Build backend
cd backend && go build -o gearvn-api

# Run tests
cd backend && go test ./...
```

---

## 🎯 Goal & Vision

**Tạo một website giống daily.dev cho GearVN với:**
- ✅ Auto content aggregation từ RSS feeds
- ✅ User authentication & profiles
- ✅ Search & filtering nâng cao
- ✅ Social features: bookmarks, following, upvotes
- ✅ Comments & discussions
- ✅ Creator profiles & personal feeds
- ✅ Dark mode với GearVN branding

**Timeline:** 2-3 tuần nữa → MVP ready for production! 🚀

---

## 📚 Documentation

**All documentation has been moved to `/documentation` folder.**

### Quick Links
- **[📖 Documentation Index](documentation/00-INDEX.md)** - Complete guide index
- **[🚀 Quick Start](documentation/QUICK-START.md)** - 4-step setup (10 minutes)
- **[✅ Final Checklist](documentation/FINAL-CHECKLIST.md)** - Complete testing checklist
- **[🔐 Login Credentials](documentation/AUTH-CREDENTIALS.md)** - Test accounts

### Common Guides
- **[Login & Auth](documentation/LOGIN-GUIDE.md)** - Authentication system
- **[Profile Setup](documentation/PROFILE-SETUP.md)** - User profiles & CMS
- **[Avatar Upload](documentation/AVATAR-UPLOAD-GUIDE.md)** - Upload avatars
- **[Troubleshooting](documentation/AVATAR-UPLOAD-FIX.md)** - Fix common errors

**See [documentation/00-INDEX.md](documentation/00-INDEX.md) for complete list of guides.**

---

## 🎨 Screenshots

### Homepage - Dark Theme
- Pure black background (#000000)
- GearVN red accent (#EF4444)
- Responsive grid layout
- Post cards với hover effects

### Post Modal
- Full-screen overlay
- Post details + comments
- Creator profile sidebar
- Related posts section

### User Features
- Login/Register forms
- Profile pages
- Bookmark collections
- Following feed

---

## 🔧 Troubleshooting

### Backend không chạy được?
```bash
# Check Go version (cần 1.21+)
go version

# Install dependencies
cd backend && go mod download

# Check database connection
# Sửa DATABASE_URL trong .env
```

### Frontend không load được data?
```bash
# Check backend đang chạy
curl http://localhost:8080/api/posts

# Check CORS settings trong backend/main.go
# Check JWT token trong localStorage
```

### Theme bị lỗi màu?
```bash
# Xóa cache browser
# Hard reload (Cmd+Shift+R)
# Check scripts/theme.js đã load chưa
```

---

## 🚀 Deployment Checklist

- [ ] Test tất cả features
- [ ] Add RSS aggregation
- [ ] Implement search
- [ ] Build admin dashboard
- [ ] Setup production database
- [ ] Configure environment variables
- [ ] Deploy backend to Railway/Render
- [ ] Deploy frontend to Vercel
- [ ] Setup custom domain
- [ ] Add analytics (Google Analytics)
- [ ] Add error tracking (Sentry)

---

**⚡ CURRENT STATUS:** Backend 95% + Frontend 90% = **70% MVP Ready**

**🎯 NEXT MILESTONE:** RSS Aggregation (Week 2)

**🚀 LAUNCH TARGET:** 2-3 weeks

---

**Made with ❤️ for GearVN - Last Updated: Jan 11, 2025**
