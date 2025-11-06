# 🚀 START HERE - Test Video Display

**Date:** 2025-11-06
**Status:** ✅ Ready to test!

---

## ✅ WHAT'S DONE:

1. ✅ **Database:** 30 video posts inserted
2. ✅ **Backend:** Updated to return video fields (content_type, video_url, video_duration, etc.)
3. ✅ **Frontend:** Updated to display VIDEO badge and duration overlay

---

## 🎯 NOW YOU NEED TO:

### **STEP 1: Start Backend**

```cmd
cd backend
go run .
```

**Expected output:**
```
✅ Connected to Supabase PostgreSQL
✅ Database tables initialized
🚀 Server starting on port 8080
📍 API: http://localhost:8080/api
```

---

### **STEP 2: Open Frontend**

**Option A: Live Server (VS Code)**
1. Install "Live Server" extension
2. Right-click `index.html`
3. Click "Open with Live Server"
4. Opens at http://127.0.0.1:5500

**Option B: Python HTTP Server**
```cmd
python -m http.server 5500
```

**Option C: Direct file**
```
Double-click index.html (may have CORS issues)
```

---

### **STEP 3: Verify Video Display**

1. Homepage loads with feed
2. Look for posts with **RED "VIDEO" badge** (top-left)
3. Look for **duration** (bottom-right, e.g. "15:30")
4. You should see 30 video posts mixed in the feed

**Example visual:**
```
┌─────────────────────────────────┐
│  [VIDEO 🔴]              [15:30]│
│                                 │
│    [Thumbnail Image]            │
│                                 │
├─────────────────────────────────┤
│ Đánh giá NVIDIA RTX 4090...     │
│ #rtx4090 #nvidia #gpu           │
│ Linus Sebastian • 15 min        │
└─────────────────────────────────┘
```

---

## 📸 SCREENSHOT FOR ME:

Chụp màn hình homepage với video posts hiển thị!

---

## 🐛 IF YOU SEE ERRORS:

### Error: "Failed to fetch posts"

**Check:**
1. Backend đang chạy? (http://localhost:8080/api/posts)
2. CORS enabled? (check backend logs)
3. Database connected? (check backend startup logs)

---

### Error: "No video badge showing"

**Check:**
1. Open browser console (F12)
2. Check API response: Does it have `content_type: "video"`?
3. Check network tab: `/api/posts` returns video fields?

---

### Error: "Icons not showing"

**Fix:** Lucide icons need to be initialized
```javascript
// Check in browser console
if (window.lucide) {
  window.lucide.createIcons();
}
```

---

## 🎨 NEXT STEPS (After testing):

1. ✅ Video posts hiển thị OK → Đi tiếp build Admin CMS UI
2. ✅ Click vào video → Mở detail page với YouTube embed
3. ✅ Filter by content type → Show only videos

---

## 📝 FILES MODIFIED:

```
✅ backend/handlers.go      - Added video fields to Post struct & getPosts()
✅ backend/.env              - Fixed DATABASE_URL with password
✅ scripts/render.js         - Added VIDEO badge & duration display
✅ scripts/feed.js           - Map video fields from API
✅ database/01-add-video-fields.sql    - Migration
✅ database/02-insert-sample-videos.sql - 30 sample videos
```

---

**Chạy backend, mở frontend, chụp ảnh cho tôi xem! 📸**
