# GearVN News & Review Hub

## Version History

| Version | Ngày | Thay đổi |
|---------|------|----------|
| **v1.0** | 01/12/2025 | Release đầu tiên - Xem chi tiết bên dưới |

---

## V1.0 - Feature Summary

| Category | Feature | Status |
|----------|---------|--------|
| **Frontend** | | |
| | React + Vite + TailwindCSS | ✅ |
| | Dark theme | ✅ |
| | Responsive grid (2-6 cột) | ✅ |
| | 4 Tabs: News / Review / Today / Creators | ✅ |
| | Sidebar lọc theo 13 tags | ✅ |
| | Post detail modal | ✅ |
| | Load More pagination (18 posts/page) | ✅ |
| | Trang Creator riêng | ✅ |
| | Hiển thị tiếng Việt (title_vi, summary_vi) | ✅ |
| **Database** | | |
| | Supabase PostgreSQL | ✅ |
| | 4 bảng: creators, tags, posts, post_tags | ✅ |
| | Row-level security (RLS) | ✅ |
| | 13 tags cố định | ✅ |
| **Data Sources** | | |
| | RSS: Tom's Hardware | ✅ |
| | RSS: TechPowerUp | ✅ |
| | RSS: Engadget | ✅ |
| | Web scrape: TrendForce | ✅ |
| | YouTube: GEARVN (Shorts) | ✅ |
| | YouTube: Tài Xài Tech (Shorts) | ✅ |
| **Automation** | | |
| | GitHub Actions - Daily fetch (7:00 AM VN) | ✅ |
| | GitHub Actions - YouTube fetch (8:00 AM VN) | ✅ |
| | n8n - Dịch tiếng Việt | ✅ |
| | n8n - Gán tags tự động | ✅ |
| | Draft → Public workflow | ✅ |
| **Scripts** | | |
| | fetch-rss.js (Node.js) | ✅ |
| | fetch-youtube.js (Node.js) | ✅ |
| | fetch_trendforce.py (Python) | ✅ |
| | Lọc spam/deals content | ✅ |
| | Chống trùng lặp | ✅ |

---

## Backlog - Tính Năng Tương Lai

| Feature | Priority | Status |
|---------|----------|--------|
| Search full-text | High | ⏳ Pending |
| Filter theo date range | Medium | ⏳ Pending |
| User accounts / favorites | Low | ⏳ Pending |
| Comments system | Low | ⏳ Pending |
| Push notifications | Low | ⏳ Pending |
| Analytics / tracking views | Medium | ⏳ Pending |
| Mobile app (React Native) | Low | ⏳ Pending |
| Thêm nguồn RSS mới | Medium | ⏳ Pending |
| Thêm YouTube channels | Medium | ⏳ Pending |
| Admin dashboard | Medium | ⏳ Pending |

---

## Tổng Quan

**GearVN Creator Hub** là nền tảng tổng hợp tin tức công nghệ và review sản phẩm, được xây dựng bằng React + Vite và Supabase. Hệ thống tự động thu thập nội dung từ nhiều nguồn (RSS feeds, YouTube, web scraping) và hiển thị qua giao diện web responsive với hỗ trợ tiếng Việt.

---

## Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| **Frontend** | React 18, Vite 5, TailwindCSS 3, Lucide Icons |
| **Database** | Supabase (PostgreSQL) |
| **Scripts** | Node.js 20, Python 3.11 |
| **Automation** | GitHub Actions, n8n (external) |

---

## Cấu Trúc Thư Mục

```
gvn-news-blog/
├── .github/workflows/
│   ├── fetch-news.yml          # Fetch RSS + TrendForce (7:00 AM VN)
│   └── fetch-youtube.yml       # Fetch YouTube Shorts (8:00 AM VN)
│
├── database/
│   ├── 01-schema.sql           # Bảng: creators, tags, posts, post_tags
│   ├── 02-rls.sql              # Row-level security
│   ├── 03-seed-tags.sql        # 13 tags cố định
│   └── ...
│
├── scripts/
│   ├── fetch-rss.js            # RSS fetcher (Tom's Hardware, TechPowerUp, Engadget)
│   ├── fetch-youtube.js        # YouTube Shorts fetcher
│   └── python/
│       ├── fetch_trendforce.py # TrendForce scraper
│       └── trendforce_scraper.py
│
├── src/
│   ├── App.jsx                 # Main React app (~740 lines)
│   ├── lib/supabase.js         # Supabase client + API functions
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
│
├── package.json
├── vite.config.js
├── tailwind.config.js
└── index.html
```

---

## Database Schema

### Bảng Chính

#### 1. `creators` - Nguồn nội dung
```sql
id          UUID PRIMARY KEY
name        VARCHAR(255)      -- "Tom's Hardware", "GEARVN"
slug        VARCHAR(255)      -- "toms-hardware", "gearvn"
avatar_url  TEXT              -- Ảnh đại diện
channel_url TEXT              -- URL nguồn
```

#### 2. `tags` - Thẻ phân loại (13 tags cố định)
```sql
id    UUID PRIMARY KEY
name  VARCHAR(100)    -- "GAME", "AI", "CPU", "VGA"...
slug  VARCHAR(100)    -- "game", "ai", "cpu", "vga"...
```

**Tags**: GAME, AI, PC, RAM, SSD, CPU, VGA, MAINBOARD, LAPTOP, MONITOR, MOUSE, KEYBOARD, HEADSET

#### 3. `posts` - Bài viết
```sql
id            UUID PRIMARY KEY
creator_id    UUID              -- FK → creators
type          VARCHAR(20)       -- 'news' | 'review'
status        VARCHAR(20)       -- 'draft' | 'public'
title         VARCHAR(500)      -- Tiêu đề tiếng Anh
title_vi      VARCHAR(500)      -- Tiêu đề tiếng Việt
summary       TEXT              -- Tóm tắt tiếng Anh
summary_vi    TEXT              -- Tóm tắt tiếng Việt
source_url    TEXT              -- Link gốc
thumbnail_url TEXT              -- Ảnh thumbnail
created_at    TIMESTAMP         -- Thời gian fetch
published_at  TIMESTAMP         -- Thời gian publish
```

#### 4. `post_tags` - Liên kết post-tag
```sql
post_id  UUID    -- FK → posts
tag_id   UUID    -- FK → tags
```

---

## Luồng Dữ Liệu

```
┌─────────────────────────────────────────────────────────┐
│                    NGUỒN NỘI DUNG                       │
├─────────────────────────┬───────────────────────────────┤
│   RSS Feeds (News)      │   YouTube Channels (Review)   │
│   • Tom's Hardware      │   • GEARVN                    │
│   • TechPowerUp         │   • Tài Xài Tech              │
│   • Engadget            │   (Chỉ lấy Shorts)            │
│   • TrendForce (scrape) │                               │
└─────────────────────────┴───────────────────────────────┘
                          ↓
              GitHub Actions (Daily)
                          ↓
         ┌────────────────────────────┐
         │  Insert as DRAFT posts    │
         │  (chưa có title_vi)       │
         └────────────────────────────┘
                          ↓
         ┌────────────────────────────┐
         │  n8n Automation           │
         │  1. Dịch sang tiếng Việt  │
         │  2. Gán tags (AI)         │
         │  3. Set status='public'   │
         └────────────────────────────┘
                          ↓
         ┌────────────────────────────┐
         │  Supabase Database        │
         │  (PostgreSQL + RLS)       │
         └────────────────────────────┘
                          ↓
         ┌────────────────────────────┐
         │  React Frontend           │
         │  Hiển thị bài PUBLIC      │
         └────────────────────────────┘
```

---

## API Functions (supabase.js)

```javascript
// Lấy tất cả posts public
api.getPosts({ type, today })

// Lấy post theo ID
api.getPostById(id)

// Lấy tất cả creators
api.getCreators()

// Lấy creator theo slug
api.getCreatorBySlug(slug)

// Lấy posts của creator
api.getPostsByCreator(creatorId)

// Lấy tất cả tags
api.getTags()

// Lấy posts theo tag
api.getPostsByTag(tagSlug)
```

---

## Frontend Components

### Cấu trúc Component

```
<App>
├── <Sidebar>              -- Bộ lọc tag
├── <Header>
│   └── <TabButton>s       -- News / Review / Today / Creators
└── <main>
    ├── <HeroSection>      -- Header với số lượng post
    ├── <PostsGrid>        -- Lưới posts (18/page, Load More)
    │   └── <PostCard>s
    ├── <CreatorsGrid>     -- Lưới creators
    │   └── <CreatorCard>s
    └── <CreatorPage>      -- Trang riêng của creator

<PostDetailModal>          -- Modal xem chi tiết post
```

### Tabs

| Tab | Icon | Filter |
|-----|------|--------|
| News | Globe | `type = 'news'` |
| Review | Play | `type = 'review'` |
| Today | Zap | `published_at >= today` |
| Creators | Users | Hiển thị creators |

### Responsive Grid

| Screen | Columns |
|--------|---------|
| Mobile | 2 |
| Tablet (sm) | 3 |
| Desktop (lg) | 4 |
| Large (xl) | 5 |
| 2XL | 6 |

---

## Scripts

### 1. fetch-rss.js
**Mục đích**: Fetch tin từ RSS feeds
**Chạy**: 7:00 AM VN (GitHub Actions)

**Nguồn**:
- Tom's Hardware
- TechPowerUp
- Engadget

**Tính năng**:
- Parse XML RSS
- Lọc theo ngày (hôm qua + hôm nay)
- Bỏ qua trùng lặp (theo source_url)
- Lọc nội dung khuyến mãi (Black Friday, deals...)

---

### 2. fetch-youtube.js
**Mục đích**: Fetch video review từ YouTube
**Chạy**: 8:00 AM VN (GitHub Actions)

**Channels**:
- GEARVN
- Tài Xài Tech

**Tính năng**:
- Chỉ lấy Shorts (`/shorts/` trong URL)
- Lấy 7 ngày gần nhất
- Thumbnail chất lượng cao

---

### 3. fetch_trendforce.py
**Mục đích**: Scrape tin từ TrendForce
**Chạy**: Cùng với fetch-news workflow

**Tính năng**:
- Web scraping với BeautifulSoup
- Multi-page support
- Lọc theo ngày

---

## GitHub Actions

### fetch-news.yml
```yaml
Schedule: 0 0 * * * (7:00 AM VN)
Steps:
  1. Setup Node.js 20
  2. npm install
  3. node scripts/fetch-rss.js
  4. Setup Python 3.11
  5. pip install -r requirements.txt
  6. python scripts/python/fetch_trendforce.py
```

### fetch-youtube.yml
```yaml
Schedule: 0 1 * * * (8:00 AM VN)
Steps:
  1. Setup Node.js 20
  2. node scripts/fetch-youtube.js
```

---

## npm Scripts

```bash
npm run dev       # Chạy dev server (localhost:5173)
npm run build     # Build production (→ dist/)
npm run preview   # Preview production build
npm run lint      # Kiểm tra ESLint
npm run fetch-rss # Chạy RSS fetcher thủ công
```

---

## Environment Variables

### Frontend (.env)
```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

### Scripts (GitHub Secrets)
```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbG... (service_role key)
```

---

## Tính Năng Chính

### User-Facing
- ✅ 4 tabs: News / Review / Today / Creators
- ✅ Lọc theo 13 tags
- ✅ Grid responsive (2-6 cột)
- ✅ Load More pagination (18 posts/page)
- ✅ Modal xem chi tiết
- ✅ Trang creator riêng
- ✅ Hỗ trợ tiếng Việt (title_vi, summary_vi)
- ✅ Dark theme
- ✅ Mobile responsive

### Backend
- ✅ Tự động fetch nội dung hàng ngày
- ✅ Draft → Public workflow
- ✅ n8n dịch và gán tags
- ✅ Chống trùng lặp
- ✅ Lọc nội dung spam/deals
- ✅ Row-level security

---

## Troubleshooting

| Vấn đề | Giải pháp |
|--------|-----------|
| Posts không hiển thị | Kiểm tra `status='public'` trong database |
| Hiển thị tiếng Anh | Kiểm tra `title_vi` có dữ liệu chưa (n8n cần dịch) |
| RSS fetch lỗi | Kiểm tra Supabase credentials trong GitHub Secrets |
| Trùng posts | Script tự động bỏ qua theo `source_url` |

---

## Creators Hiện Tại

| Tên | Loại | Slug |
|-----|------|------|
| Tom's Hardware | RSS | `toms-hardware` |
| TechPowerUp | RSS | `techpowerup` |
| Engadget | RSS | `engadget` |
| TrendForce | Scrape | `trendforce` |
| GEARVN | YouTube | `gearvn` |
| Tài Xài Tech | YouTube | `tai-xai-tech` |

---

## License

Private - GearVN. All rights reserved.

---

**Cập nhật**: 01/12/2025
