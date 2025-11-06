# 🎯 HƯỚNG DẪN SETUP VIDEO CONTENT

**Date:** 2025-11-06
**Goal:** Thêm 30 video mẫu vào database và hiển thị trên frontend

---

## ✅ ĐIỀU KIỆN TIÊN QUYẾT

Đảm bảo bạn đã cài đặt:
- ✅ **Go** (version 1.20+): https://go.dev/dl/
- ✅ **Git** (đã có)
- ✅ **VS Code** hoặc editor khác

Kiểm tra:
```powershell
go version
# Should output: go version go1.xx.x windows/amd64
```

---

## 🚀 BƯỚC 1: CHẠY MIGRATION & SEED DATA

### Option A: PowerShell Script (RECOMMENDED) ⭐

```powershell
# Mở PowerShell trong folder project
cd C:\Users\duong\gvn-news-blog

# Chạy script
.\run-migration.ps1
```

**Script này sẽ:**
1. ✅ Thêm 6 cột mới cho video vào table `posts`
2. ✅ Tạo indexes
3. ✅ Insert 30 video mẫu
4. ✅ Verify migration thành công

---

### Option B: Manual Commands

```powershell
# Step 1: Run migration
cd backend
go run . --migrate

# Step 2: Seed videos
go run . --seed-videos
```

---

## 🔍 BƯỚC 2: VERIFY DATA

### 2.1. Check trên Supabase Dashboard

1. Vào: https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz/editor
2. Click table `posts`
3. Filter: `content_type = video`
4. Bạn sẽ thấy **30 video posts**

### 2.2. Check qua SQL

```sql
SELECT
    id,
    title,
    content_type,
    video_duration,
    category,
    created_at
FROM posts
WHERE content_type = 'video'
ORDER BY created_at DESC;
```

**Expected output:** 30 rows

---

## 🎨 BƯỚC 3: START BACKEND & FRONTEND

### 3.1. Start Backend

```powershell
cd backend
go run .
```

**Expected output:**
```
✅ Connected to Supabase PostgreSQL
✅ Database tables initialized
🚀 Server starting on port 8080
📍 API: http://localhost:8080/api
🎨 CMS: http://localhost:8080/cms
```

### 3.2. Open Frontend

Mở file `index.html` bằng Live Server hoặc:

```powershell
# If you have Python
python -m http.server 5500

# Or use VS Code Live Server extension
# Right-click index.html → Open with Live Server
```

**Frontend URL:** http://localhost:5500 hoặc http://127.0.0.1:5500

---

## 📹 BƯỚC 4: XEM VIDEO TRÊN HOMEPAGE

1. Mở http://localhost:5500/index.html
2. Scroll xuống feed
3. Bạn sẽ thấy **30 video posts** hiển thị
4. Click vào bất kỳ video nào để xem detail

**Video hiện có:**
- RTX 4090 Review (Hardware)
- Ryzen 7950X3D Review (Hardware)
- Gaming Laptop 2024 (Hardware)
- PC Build 30 triệu (Hardware)
- Mechanical Keyboard 2024 (Peripherals)
- Gaming Monitor: OLED vs Mini-LED (Peripherals)
- Gaming Mouse Wireless 2024 (Peripherals)
- SSD NVMe Gen5 Comparison (Storage)
- Gaming Headset vs Audiophile (Audio)
- Webcam for Streaming 2024 (Streaming)
- Elden Ring DLC Review (Gaming)
- Valorant Tips 2024 (Esports)
- LOL Worlds 2024 Finals (Esports)
- Dota 2 TI12 Finals (Esports)
- Baldur's Gate 3 Build Guide (Gaming)
- Windows 11 Optimization (Software)
- DaVinci Resolve Tutorial (Tutorial)
- OBS Streaming Setup (Streaming)
- ChatGPT Productivity (AI)
- Notion Workspace Setup (Productivity)
- NVIDIA RTX 50 Series Leak (Tech News)
- Apple M4 MacBook Review (Tech News)
- Intel Meteor Lake Review (Tech News)
- PlayStation 5 Pro Announcement (Gaming)
- Starfield DLC Review (Gaming)
- Gaming Setup Tour 2024 (Setup)
- Streaming Setup Guide (Streaming)
- Cable Management Tutorial (Setup)
- Ergonomic Desk Setup (Productivity)
- Minimalist Setup Tour (Setup)

---

## 🐛 TROUBLESHOOTING

### Lỗi: `go: command not found`

**Fix:** Cài đặt Go
```powershell
# Download from: https://go.dev/dl/
# Install và restart terminal
```

---

### Lỗi: `Failed to connect to database`

**Fix:** Check DATABASE_URL trong `.env`
```powershell
cd backend
cat .env | grep DATABASE_URL

# Should be:
DATABASE_URL=postgresql://postgres.qibhlrsdykpkbsnelubz:Gearvn#2025@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

---

### Lỗi: `column "video_url" does not exist`

**Fix:** Run migration lại
```powershell
cd backend
go run . --migrate
```

---

### Video không hiển thị trên frontend

**Fix:**
1. Check backend đang chạy: http://localhost:8080/api/posts
2. Check console log trong browser (F12)
3. Verify data trong Supabase Table Editor

---

## 📊 DATABASE SCHEMA

### Posts Table (After Migration)

```sql
CREATE TABLE posts (
    -- Existing fields
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    excerpt TEXT,
    content TEXT,
    cover_image TEXT,
    creator_id VARCHAR(255),
    creator_name VARCHAR(255),
    creator_avatar TEXT,
    category VARCHAR(100),
    tags TEXT[],
    read_time VARCHAR(50),
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- NEW: Video fields
    video_url TEXT,
    video_thumbnail TEXT,
    video_duration VARCHAR(20),
    video_platform VARCHAR(50) DEFAULT 'youtube',
    transcript TEXT,
    content_type VARCHAR(20) DEFAULT 'article'
);

-- Indexes
CREATE INDEX idx_posts_content_type ON posts(content_type);
CREATE INDEX idx_posts_video_platform ON posts(video_platform);
```

---

## ✨ NEXT STEPS

Sau khi verify video đã hiển thị trên homepage:

1. ✅ **Update Frontend** để hiển thị video tốt hơn
   - Video badge
   - Duration display
   - YouTube embed player

2. ✅ **Build CMS Admin UI** để quản lý video
   - List all videos
   - Edit video metadata
   - Delete videos
   - Upload new videos

3. ✅ **Connect n8n Workflow** để auto-import YouTube videos
   - Setup n8n Cloud
   - Create workflow
   - Test with real YouTube URL

---

## 📞 SUPPORT

Nếu gặp lỗi:
1. Check logs trong terminal
2. Check browser console (F12)
3. Verify Supabase connection
4. Restart backend server

**Database Dashboard:** https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz

---

**Prepared by:** Claude Code Assistant
**Date:** 2025-11-06
