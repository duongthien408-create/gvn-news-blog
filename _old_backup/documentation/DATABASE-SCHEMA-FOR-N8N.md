# 📊 DATABASE SCHEMA CHO N8N WORKFLOW

**Date:** 2025-11-06
**Purpose:** Document chi tiết các field trong table `posts` để thiết kế n8n workflow

---

## 🗃️ TABLE: `posts`

### **Core Fields (REQUIRED)**

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `id` | VARCHAR(255) | ✅ Yes | Unique identifier | `"video-rtx4090-review"` hoặc `"rss-5c14122903d843c1"` |
| `title` | VARCHAR(500) | ✅ Yes | Tiêu đề bài viết | `"Đánh giá chi tiết NVIDIA RTX 4090"` |
| `published` | BOOLEAN | ✅ Yes | Trạng thái publish | `true` (hiển thị) hoặc `false` (ẩn) |
| `content_type` | VARCHAR(20) | ✅ Yes | Loại nội dung | `"video"` hoặc `"article"` |
| `category` | VARCHAR(100) | ✅ Yes | Danh mục | `"hardware"`, `"gaming"`, `"tech-news"` |

---

### **Content Fields**

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `excerpt` | TEXT | Optional | Mô tả ngắn (150-300 ký tự) | `"Trải nghiệm toàn diện về RTX 4090 với benchmark gaming 4K..."` |
| `content` | TEXT | Optional | Nội dung đầy đủ (Markdown hoặc HTML) | `"# NVIDIA RTX 4090 Review\n\n## Giới thiệu\n..."` |
| `cover_image` | TEXT | ✅ Yes | URL hình ảnh chính | `"https://images.unsplash.com/photo-xxx?w=1200"` |
| `tags` | TEXT[] | Optional | Array các tag | `["rtx4090", "nvidia", "gpu", "gaming"]` |
| `read_time` | VARCHAR(50) | Optional | Thời gian đọc/xem | `"15 min"` hoặc `"15 min read"` |

---

### **Video-Specific Fields** (Chỉ cho `content_type = "video"`)

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `video_url` | TEXT | ✅ Yes (video) | URL video gốc | `"https://www.youtube.com/watch?v=dQw4w9WgXcQ"` |
| `video_thumbnail` | TEXT | Optional | URL thumbnail riêng (nếu khác cover_image) | `"https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"` |
| `video_duration` | VARCHAR(20) | ✅ Yes (video) | Độ dài video (format: MM:SS) | `"15:30"`, `"1:22:45"` |
| `video_platform` | VARCHAR(50) | Optional | Platform video | `"youtube"` (default) |
| `transcript` | TEXT | Optional | Transcript/phụ đề video | `"Today we are reviewing the NVIDIA RTX 4090..."` |

---

### **Creator/Source Fields**

**Option 1: Creator content** (video từ creator)
| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `creator_id` | VARCHAR(255) | Optional | ID của creator | `"linus-tech"` |
| `creator_name` | VARCHAR(255) | Optional | Tên creator | `"Linus Sebastian"` |
| `creator_avatar` | TEXT | Optional | URL avatar | `"https://ui-avatars.com/api/?name=Linus+Sebastian"` |
| `source_id` | INTEGER | NULL | (không dùng cho creator content) | `null` |
| `external_url` | TEXT | NULL | (không dùng cho creator content) | `null` |

**Option 2: RSS/External content**
| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `creator_id` | VARCHAR(255) | NULL | (không dùng cho RSS) | `null` |
| `creator_name` | VARCHAR(255) | NULL | (không dùng cho RSS) | `null` |
| `creator_avatar` | TEXT | NULL | (không dùng cho RSS) | `null` |
| `source_id` | INTEGER | Optional | ID nguồn RSS | `1` |
| `external_url` | TEXT | Optional | URL bài gốc | `"https://www.ign.com/articles/..."` |

---

### **Metadata Fields**

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `published_at` | TIMESTAMP | Optional | Ngày publish gốc | `"2025-11-05T11:47:24"` |
| `created_at` | TIMESTAMP | Auto | Ngày tạo trong DB | Auto-generated |
| `updated_at` | TIMESTAMP | Auto | Ngày update | Auto-generated |
| `upvotes` | INTEGER | Auto | Số upvote | `0` (default) |
| `comments_count` | INTEGER | Auto | Số comment | `0` (default) |

---

## 🎯 N8N WORKFLOW MAPPING

### **YouTube Video → Database**

Khi bạn pull video từ YouTube qua n8n, map các field như sau:

```json
{
  "id": "video-{{ $json.videoId }}",
  "title": "{{ $json.title_translated }}",  // Sau khi dịch bằng Claude
  "excerpt": "{{ $json.description_translated | truncate(200) }}",
  "content": "{{ $json.content_markdown }}",  // Generated content từ Claude
  "cover_image": "{{ $json.thumbnails.maxres.url }}",
  "content_type": "video",
  "category": "{{ $json.category_detected }}",  // hardware, gaming, etc.
  "tags": "{{ $json.tags }}",
  "read_time": "{{ $json.duration_formatted }}",
  "published": true,

  // Video fields
  "video_url": "https://www.youtube.com/watch?v={{ $json.videoId }}",
  "video_thumbnail": "{{ $json.thumbnails.maxres.url }}",
  "video_duration": "{{ $json.duration }}",  // Format: "15:30"
  "video_platform": "youtube",
  "transcript": "{{ $json.transcript }}",  // YouTube transcript

  // Creator fields
  "creator_id": "{{ $json.channelId }}",
  "creator_name": "{{ $json.channelTitle }}",
  "creator_avatar": "{{ $json.channelThumbnail }}",
  "source_id": null,
  "external_url": null,

  // Metadata
  "published_at": "{{ $json.publishedAt }}",
  "upvotes": 0,
  "comments_count": 0
}
```

---

## 🔄 N8N WORKFLOW STEPS

### **Step 1: Fetch YouTube Video Data**
- **Node:** YouTube (HTTP Request)
- **Output:** videoId, title, description, duration, thumbnails, channelTitle, transcript

### **Step 2: Translate to Vietnamese**
- **Node:** Claude AI / OpenAI
- **Input:** title, description
- **Output:** title_translated, description_translated

### **Step 3: Generate Content**
- **Node:** Claude AI
- **Prompt:** "Based on this video transcript, write a Vietnamese blog post with summary, key points, and conclusion"
- **Output:** content_markdown

### **Step 4: Format Duration**
- **Node:** Function / Code
- **Input:** duration (seconds)
- **Output:** duration_formatted (MM:SS format)
- **Example:** `925 seconds → "15:25"`

### **Step 5: Detect Category**
- **Node:** Function / Claude AI
- **Logic:**
  - Video about GPU/CPU → `"hardware"`
  - Video about games → `"gaming"`
  - News/announcements → `"tech-news"`

### **Step 6: Insert to Supabase**
- **Node:** Supabase / HTTP Request
- **Method:** POST
- **URL:** `https://qibhlrsdykpkbsnelubz.supabase.co/rest/v1/posts`
- **Headers:**
  ```json
  {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
  }
  ```
- **Body:** JSON object với tất cả fields trên

---

## ⚠️ IMPORTANT NOTES

### **1. Required Fields for Video Posts**
Đảm bảo các field này KHÔNG được NULL:
- ✅ `id` - Unique, format: `video-{slug}`
- ✅ `title` - Tiêu đề bằng tiếng Việt
- ✅ `content_type` - Phải là `"video"`
- ✅ `category` - Phải thuộc: `hardware`, `gaming`, `tech-news`, `peripherals`, `software`
- ✅ `cover_image` - URL hợp lệ
- ✅ `video_url` - URL YouTube hợp lệ
- ✅ `video_duration` - Format: `"MM:SS"` hoặc `"H:MM:SS"`
- ✅ `published` - Phải là `true` để hiển thị

### **2. Tags Format**
PostgreSQL array:
```sql
ARRAY['rtx4090', 'nvidia', 'gpu', 'gaming', 'benchmark']
```

n8n JSON:
```json
["rtx4090", "nvidia", "gpu", "gaming", "benchmark"]
```

### **3. Thumbnail Priority**
- Ưu tiên dùng `maxres` (1280x720) từ YouTube
- Fallback: `high` (480x360)
- Lưu vào cả `cover_image` VÀ `video_thumbnail`

### **4. ID Generation**
```javascript
// Example n8n function
const slug = $json.title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

return {
  id: `video-${slug.substring(0, 50)}`
};
```

### **5. Content Markdown Example**
```markdown
# NVIDIA RTX 4090 Review

## Giới thiệu
RTX 4090 là card đồ họa flagship của NVIDIA...

## Benchmark Gaming
- Cyberpunk 2077 (4K Ultra + RT): 120 FPS
- Hogwarts Legacy (4K Ultra): 144 FPS

## Kết luận
Đây là card đồ họa tốt nhất hiện nay...
```

---

## 📝 EXAMPLE COMPLETE PAYLOAD

```json
{
  "id": "video-danh-gia-nvidia-rtx-4090",
  "title": "Đánh giá chi tiết NVIDIA RTX 4090 - Card đồ họa mạnh nhất thế giới",
  "excerpt": "Trải nghiệm toàn diện về RTX 4090 với benchmark gaming 4K, ray tracing, và DLSS 3. Liệu có đáng giá 40 triệu?",
  "content": "# NVIDIA RTX 4090 Review\n\n## Giới thiệu\nRTX 4090 là card đồ họa flagship...",
  "cover_image": "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  "content_type": "video",
  "category": "hardware",
  "tags": ["rtx4090", "nvidia", "gpu", "gaming", "benchmark"],
  "read_time": "15 min",
  "published": true,

  "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "video_thumbnail": "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  "video_duration": "15:30",
  "video_platform": "youtube",
  "transcript": "Today we are reviewing the NVIDIA RTX 4090...",

  "creator_id": "UCXuqSBlHAE6Xw-yeJA0Tunw",
  "creator_name": "Linus Tech Tips",
  "creator_avatar": "https://yt3.ggpht.com/...",
  "source_id": null,
  "external_url": null,

  "published_at": "2025-11-05T10:00:00Z",
  "upvotes": 0,
  "comments_count": 0
}
```

---

## 🔗 SUPABASE API ENDPOINT

**Insert new post:**
```bash
POST https://qibhlrsdykpkbsnelubz.supabase.co/rest/v1/posts
```

**Headers:**
```
apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYmhscnNkeWtwa2JzbmVsdWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNDc4NzEsImV4cCI6MjA3NzkyMzg3MX0.jmwZ8r_7dC8fU5hIlgXrFZUpJBxE07bZyBEuLoG1SrM
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYmhscnNkeWtwa2JzbmVsdWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNDc4NzEsImV4cCI6MjA3NzkyMzg3MX0.jmwZ8r_7dC8fU5hIlgXrFZUpJBxE07bZyBEuLoG1SrM
Content-Type: application/json
Prefer: return=minimal
```

---

**Prepared by:** Claude Code Assistant
**Last updated:** 2025-11-06
