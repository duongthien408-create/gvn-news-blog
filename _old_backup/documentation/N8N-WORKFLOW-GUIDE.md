# 🔄 N8N WORKFLOW - COMPLETE GUIDE

**Date:** 2025-11-06
**Status:** ✅ Tested & Working

---

## 🎯 WORKFLOW OVERVIEW

```
YouTube Video → Transform Data → Insert Supabase → Success!
```

**Input:** YouTube video data với AI-generated highlights
**Output:** Video post trong Supabase database, hiển thị trên website

---

## 📋 N8N NODES SETUP

### **Node 1: Webhook / Schedule Trigger**
- **Type:** Webhook hoặc Schedule
- **Purpose:** Trigger workflow khi có video mới

### **Node 2: Your Existing AI Processing**
- **Type:** Claude AI / HTTP Request
- **Output:** JSON với structure hiện tại (video_title, key_highlights, etc.)

### **Node 3: Function - Transform Data** ⭐
- **Type:** Function
- **Code:** Copy từ `N8N-FUNCTION-CODE.js`
- **Purpose:** Transform JSON sang database format

**Steps:**
1. Parse video duration (ISO 8601 → MM:SS)
2. Generate unique ID
3. Detect category
4. Create tags
5. Build markdown content
6. Create complete payload

### **Node 4: HTTP Request - Insert Supabase** ⭐
- **Type:** HTTP Request
- **Method:** POST
- **URL:** `https://qibhlrsdykpkbsnelubz.supabase.co/rest/v1/posts`

**Headers:**
```json
{
  "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYmhscnNkeWtwa2JzbmVsdWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNDc4NzEsImV4cCI6MjA3NzkyMzg3MX0.jmwZ8r_7dC8fU5hIlgXrFZUpJBxE07bZyBEuLoG1SrM",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYmhscnNkeWtwa2JzbmVsdWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNDc4NzEsImV4cCI6MjA3NzkyMzg3MX0.jmwZ8r_7dC8fU5hIlgXrFZUpJBxE07bZyBEuLoG1SrM",
  "Content-Type": "application/json",
  "Prefer": "return=minimal"
}
```

**Body:** `{{ $json }}` (from previous node)

---

## 💻 FUNCTION CODE

Copy code từ file `N8N-FUNCTION-CODE.js` vào Function node.

**Key Features:**
- ✅ Parse ISO 8601 duration → MM:SS
- ✅ Generate unique ID from video_id
- ✅ Auto-detect category (hardware/peripherals/gaming/tech-news)
- ✅ Create Vietnamese slug tags
- ✅ Build markdown content with highlights
- ✅ Generate creator avatar URL
- ✅ Calculate read time from video duration

---

## 📥 INPUT FORMAT

Your n8n should output JSON like this:

```json
{
  "video_title": "...",
  "thumbnail_url": "...",
  "video_url": "...",
  "video_id": "...",
  "channel_name": "...",
  "channel_id": "...",
  "published_date": "2025-11-06T05:03:07Z",
  "video_duration": "PT1M7S",
  "full_transcript": "...",
  "key_highlights": {
    "product_name": "...",
    "category": "...",
    "price": "...",
    "summary": "...",
    "key_specs": [...],
    "pros": [...],
    "cons": [...],
    "target_audience": "...",
    "key_quotes": [...],
    "reviewer_rating": "..."
  }
}
```

---

## 📤 OUTPUT FORMAT

After transformation, payload sẽ như này:

```json
{
  "id": "video-ZBXLEqWMvBU",
  "title": "...",
  "content_type": "video",
  "category": "peripherals",
  "cover_image": "...",
  "published": true,

  "excerpt": "...",
  "content": "# Markdown content...",
  "tags": ["hyperx", "review", "gearvn"],
  "read_time": "1 min",

  "video_url": "...",
  "video_thumbnail": "...",
  "video_duration": "1:07",
  "video_platform": "youtube",
  "transcript": "...",

  "creator_id": "...",
  "creator_name": "Gearvn",
  "creator_avatar": "...",
  "source_id": null,
  "external_url": null,

  "published_at": "2025-11-06T05:03:07Z",
  "upvotes": 0,
  "comments_count": 0
}
```

---

## ✅ VALIDATION CHECKLIST

Before deploying workflow, verify:

- [ ] **YouTube API** returns all required fields
  - video_id ✅
  - video_title ✅
  - thumbnail_url ✅
  - channel_name ✅
  - channel_id ✅
  - video_duration (ISO 8601 format) ✅
  - published_date ✅

- [ ] **AI Processing** generates:
  - full_transcript ✅
  - key_highlights object ✅
  - All nested fields (pros, cons, specs, etc.) ✅

- [ ] **Function Node** produces:
  - Unique ID (no duplicates) ✅
  - Correct category mapping ✅
  - Valid tags array ✅
  - Properly formatted duration (MM:SS) ✅

- [ ] **Supabase Insert**:
  - Returns 200/201 status ✅
  - Data appears in database ✅
  - Data displays on website ✅

---

## 🧪 TESTING

### **Test 1: Transform Function**

Input test data vào Function node:
```javascript
// Use your actual YouTube video JSON
const testInput = { /* your JSON */ };
```

Expected output: Complete database payload

### **Test 2: Supabase Insert**

```bash
curl -X POST "https://qibhlrsdykpkbsnelubz.supabase.co/rest/v1/posts" \
  -H "apikey: YOUR_KEY" \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  --data "@test-insert.json"
```

Expected: 200 OK response

### **Test 3: Verify on Website**

1. Go to: http://localhost:5500 (or your frontend URL)
2. Look for video with RED "VIDEO" badge
3. Click video → Should open modal
4. "Watch on YouTube" button → Should link to YouTube

---

## 🔄 WORKFLOW EXAMPLES

### **Example 1: Single Video**

```
Manual Trigger → YouTube API → AI Process → Transform → Insert Supabase
```

### **Example 2: Bulk Import**

```
Schedule (daily) → YouTube RSS → Loop Videos → AI Process → Transform → Insert Supabase
```

### **Example 3: Webhook from External**

```
Webhook → Parse Video URL → YouTube API → AI Process → Transform → Insert Supabase
```

---

## 🚨 ERROR HANDLING

### **Error: Duplicate ID**

```
Supabase error: duplicate key value violates unique constraint "posts_pkey"
```

**Fix:** Check if video already exists before insert
```javascript
// Add this check before insert
const existingCheck = await fetch(`${SUPABASE_URL}/rest/v1/posts?id=eq.${id}`);
if (existingCheck.length > 0) {
  return { skip: true, reason: 'Already exists' };
}
```

### **Error: Invalid Duration Format**

```
Cannot parse duration: PT1M7S
```

**Fix:** Check parseDuration function in transform code

### **Error: Missing Required Fields**

```
Supabase error: null value in column "title" violates not-null constraint
```

**Fix:** Verify all required fields are in payload:
- id, title, content_type, category, cover_image, published

---

## 📊 CATEGORY MAPPING

```javascript
{
  'bàn phím cơ': 'peripherals',
  'chuột gaming': 'peripherals',
  'tai nghe': 'peripherals',
  'màn hình': 'peripherals',

  'card đồ họa': 'hardware',
  'gpu': 'hardware',
  'cpu': 'hardware',
  'laptop': 'hardware',

  'game': 'gaming',
  'valorant': 'gaming',
  'league of legends': 'gaming',

  'tin tức': 'tech-news',
  'ra mắt': 'tech-news',
  'leak': 'tech-news'
}
```

**Add more keywords as needed!**

---

## 🎨 FRONTEND DISPLAY

After insert, video will display on website with:

**Homepage Feed:**
- ✅ Red VIDEO badge (top-left)
- ✅ Duration overlay (bottom-right)
- ✅ Thumbnail image
- ✅ Title + tags + creator

**Modal (Click to open):**
- ✅ Large thumbnail with badges
- ✅ "Watch on YouTube" button
- ✅ Full markdown content
- ✅ Tags + metadata
- ✅ Comments section

---

## 📝 NEXT STEPS

1. **Deploy n8n workflow** to production
2. **Setup webhook** từ YouTube hoặc RSS feed
3. **Monitor logs** để catch errors
4. **Adjust categories** theo nhu cầu
5. **Build Admin CMS** để manage videos manually

---

## 🔗 USEFUL LINKS

- **Supabase Dashboard:** https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz
- **Frontend:** http://localhost:5500
- **Backend API:** http://localhost:8080/api/posts
- **Documentation:**
  - DATABASE-SCHEMA-FOR-N8N.md
  - N8N-JSON-MAPPING.md
  - N8N-FUNCTION-CODE.js

---

**Status:** ✅ Tested & Working
**Last Test:** 2025-11-06
**Result:** Video "video-ZBXLEqWMvBU-test" inserted successfully!

🎉 **Ready for production!**
