# 🗄️ SUPABASE DATABASE - COLUMN MAPPING

**Table:** `posts`
**Date:** 2025-11-06

---

## 📋 N8N OUTPUT → SUPABASE COLUMNS

| N8N Field | Supabase Column | Type | Required | Notes |
|-----------|----------------|------|----------|-------|
| `video_id` | **`id`** | VARCHAR(255) | ✅ | Add prefix: `"video-" + video_id` |
| `video_title` | **`title`** | VARCHAR(500) | ✅ | Direct copy |
| `key_highlights.summary` | **`excerpt`** | TEXT | ⚠️ Recommended | Truncate to 200 chars |
| (Generated from highlights) | **`content`** | TEXT | ⚠️ Recommended | Build Markdown from key_highlights |
| `thumbnail_url` | **`cover_image`** | TEXT | ✅ | Direct copy |
| | **`content_type`** | VARCHAR(20) | ✅ | Fixed value: `"video"` |
| `key_highlights.category` | **`category`** | VARCHAR(100) | ✅ | Map: "Bàn phím cơ" → `"peripherals"` |
| (Generated) | **`tags`** | TEXT[] | ⚠️ Recommended | Array: `["hyperx", "review", "gearvn"]` |
| (Calculated) | **`read_time`** | VARCHAR(50) | ⚠️ Recommended | From duration: `"1 min"` |
| | **`published`** | BOOLEAN | ✅ | Fixed value: `true` |
| `video_url` | **`video_url`** | TEXT | ✅ | Direct copy |
| `thumbnail_url` | **`video_thumbnail`** | TEXT | Optional | Same as cover_image |
| `video_duration` | **`video_duration`** | VARCHAR(20) | ✅ | Convert: `PT1M7S` → `"1:07"` |
| | **`video_platform`** | VARCHAR(50) | Optional | Fixed value: `"youtube"` |
| `full_transcript` | **`transcript`** | TEXT | Optional | Direct copy |
| `channel_id` | **`creator_id`** | VARCHAR(255) | ⚠️ Recommended | Direct copy |
| `channel_name` | **`creator_name`** | VARCHAR(255) | ⚠️ Recommended | Direct copy |
| (Generated) | **`creator_avatar`** | TEXT | Optional | Generate from channel_name |
| | **`source_id`** | INTEGER | Leave NULL | Not used for videos |
| | **`external_url`** | TEXT | Leave NULL | Not used for videos |
| `published_date` | **`published_at`** | TIMESTAMP | Optional | ISO format |
| | **`upvotes`** | INTEGER | Auto | Default: `0` |
| | **`comments_count`** | INTEGER | Auto | Default: `0` |
| | **`created_at`** | TIMESTAMP | Auto | Auto-generated |
| | **`updated_at`** | TIMESTAMP | Auto | Auto-generated |

---

## ✅ REQUIRED FIELDS (MUST HAVE)

```json
{
  "id": "video-ZBXLEqWMvBU",                    // ← video_id with prefix
  "title": "BÀN PHÍM NHÔM giảm 50%...",         // ← video_title
  "content_type": "video",                       // ← Fixed
  "category": "peripherals",                     // ← Map from category
  "cover_image": "https://i.ytimg.com/...",     // ← thumbnail_url
  "video_url": "https://www.youtube.com/...",   // ← video_url
  "video_duration": "1:07",                      // ← Parse PT1M7S
  "published": true                              // ← Fixed
}
```

---

## ⚠️ RECOMMENDED FIELDS (SHOULD HAVE)

```json
{
  "excerpt": "Video giới thiệu bàn phím...",    // ← summary (200 chars)
  "content": "# Full markdown content...",       // ← Build from highlights
  "tags": ["hyperx", "review", "gearvn"],        // ← Generate
  "read_time": "1 min",                          // ← From duration
  "transcript": "Bình thường các bạn...",        // ← full_transcript
  "creator_id": "UCdxRpD_T4-HzPsely-Fcezw",     // ← channel_id
  "creator_name": "Gearvn"                       // ← channel_name
}
```

---

## 🔄 TRANSFORMATIONS NEEDED

### 1. **ID Generation**
```
video_id: "ZBXLEqWMvBU"
→ id: "video-ZBXLEqWMvBU"
```

### 2. **Duration Parsing**
```
video_duration: "PT1M7S"
→ video_duration: "1:07"

video_duration: "PT15M30S"
→ video_duration: "15:30"

video_duration: "PT1H22M45S"
→ video_duration: "1:22:45"
```

### 3. **Category Mapping**
```
"Bàn phím cơ" → "peripherals"
"Chuột gaming" → "peripherals"
"Card đồ họa" → "hardware"
"CPU" → "hardware"
"Game" → "gaming"
"Tin tức" → "tech-news"
```

### 4. **Tags Generation**
```
product_name: "HyperX Alloy Origins Core"
→ tags: ["hyperx-alloy-origins-core", "review", "gearvn", "peripherals", "youtube"]
```

### 5. **Excerpt**
```
summary: "Video giới thiệu bàn phím cơ HyperX Alloy Origins Core..."
→ excerpt: "Video giới thiệu bàn phím cơ HyperX Alloy Origins Core..." (max 200 chars)
```

### 6. **Content (Markdown)**
```markdown
# [video_title]

## 📋 Tổng quan
[key_highlights.summary]

**Sản phẩm:** [product_name]
**Giá:** [price]

## ⚙️ Thông số kỹ thuật
- [key_specs[0]]
- [key_specs[1]]

## ✅ Ưu điểm
✅ [pros[0]]
✅ [pros[1]]

## ❌ Nhược điểm
❌ [cons[0]]

## 📝 Transcript đầy đủ
[full_transcript]
```

### 7. **Creator Avatar**
```
channel_name: "Gearvn"
→ creator_avatar: "https://ui-avatars.com/api/?name=Gearvn&background=ef4444&color=fff&size=128"
```

---

## 📝 EXAMPLE COMPLETE MAPPING

**N8N Output:**
```json
{
  "video_id": "ZBXLEqWMvBU",
  "video_title": "BÀN PHÍM NHÔM giảm 50%?...",
  "thumbnail_url": "https://i.ytimg.com/vi/ZBXLEqWMvBU/maxresdefault.jpg",
  "video_url": "https://www.youtube.com/shorts/ZBXLEqWMvBU",
  "video_duration": "PT1M7S",
  "channel_name": "Gearvn",
  "channel_id": "UCdxRpD_T4-HzPsely-Fcezw",
  "full_transcript": "...",
  "key_highlights": {
    "category": "Bàn phím cơ",
    "summary": "..."
  }
}
```

**Supabase Insert:**
```json
{
  "id": "video-ZBXLEqWMvBU",
  "title": "BÀN PHÍM NHÔM giảm 50%?...",
  "excerpt": "Video giới thiệu bàn phím...",
  "content": "# BÀN PHÍM NHÔM...\n\n## Tổng quan...",
  "cover_image": "https://i.ytimg.com/vi/ZBXLEqWMvBU/maxresdefault.jpg",
  "content_type": "video",
  "category": "peripherals",
  "tags": ["hyperx-alloy-origins-core", "review", "gearvn", "peripherals"],
  "read_time": "1 min",
  "published": true,

  "video_url": "https://www.youtube.com/shorts/ZBXLEqWMvBU",
  "video_thumbnail": "https://i.ytimg.com/vi/ZBXLEqWMvBU/maxresdefault.jpg",
  "video_duration": "1:07",
  "video_platform": "youtube",
  "transcript": "...",

  "creator_id": "UCdxRpD_T4-HzPsely-Fcezw",
  "creator_name": "Gearvn",
  "creator_avatar": "https://ui-avatars.com/api/?name=Gearvn&background=ef4444&color=fff&size=128",
  "source_id": null,
  "external_url": null,

  "published_at": "2025-11-06T05:03:07Z",
  "upvotes": 0,
  "comments_count": 0
}
```

---

## 🎯 QUICK REFERENCE

### **Minimum Fields to Insert:**
1. `id` ← video_id với prefix
2. `title` ← video_title
3. `content_type` = "video"
4. `category` ← map từ category
5. `cover_image` ← thumbnail_url
6. `video_url` ← video_url
7. `video_duration` ← parse duration
8. `published` = true

### **HTTP Request to Supabase:**
```
POST https://qibhlrsdykpkbsnelubz.supabase.co/rest/v1/posts

Headers:
  apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json
  Prefer: return=minimal

Body: { ... JSON payload ... }
```

---

Đây là mapping đầy đủ! Bạn cần thêm chi tiết nào không?
