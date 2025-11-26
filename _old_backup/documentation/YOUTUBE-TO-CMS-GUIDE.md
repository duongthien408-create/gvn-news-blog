# 🎬 HƯỚNG DẪN: YouTube → n8n → Supabase → CMS

**Ngày tạo:** 6 tháng 11, 2025
**Mục tiêu:** Tự động hóa việc kéo video YouTube, dịch transcript, và đẩy lên CMS

---

## 📊 HIỆN TRẠNG PROJECT

### ✅ ĐÃ CÓ:

1. **Backend Go (Fiber)** - HOÀN CHỈNH
   - API: `/cms/posts` (POST, PUT, DELETE, GET)
   - Database: PostgreSQL qua Supabase
   - Auth: JWT authentication
   - File: `backend/cms.go`, `backend/main.go`

2. **Frontend** - HOÀN CHỈNH
   - Giao diện Daily.dev style
   - File: `index.html`, `bookmarks.html`, `profile.html`
   - Script: `scripts/feed.js`, `scripts/api-client.js`

3. **Database Schema** - ĐÃ CÓ
   - Table `posts` với đầy đủ fields
   - PostgreSQL trên Supabase

### ❌ CHƯA CÓ:

1. **CMS Admin UI** - Chưa có giao diện quản trị visual
2. **Video fields** - Cần thêm vào database
3. **n8n workflow** - Cần tạo mới

---

## 🗄️ BƯỚC 1: CẬP NHẬT DATABASE (SUPABASE)

### 1.1. Thêm Video Fields vào Table Posts

Vào **Supabase Dashboard** → **SQL Editor** → Chạy query sau:

```sql
-- Thêm các cột cho video content
ALTER TABLE posts ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS video_thumbnail TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS video_duration VARCHAR(20);
ALTER TABLE posts ADD COLUMN IF NOT EXISTS video_platform VARCHAR(50) DEFAULT 'youtube';
ALTER TABLE posts ADD COLUMN IF NOT EXISTS transcript TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS content_type VARCHAR(20) DEFAULT 'article';

-- Index để lọc content type (video vs article)
CREATE INDEX IF NOT EXISTS idx_posts_content_type ON posts(content_type);

-- Index để tìm video theo platform
CREATE INDEX IF NOT EXISTS idx_posts_video_platform ON posts(video_platform);
```

### 1.2. Kiểm tra Schema đã update thành công

```sql
-- Verify columns được thêm
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'posts'
  AND column_name IN ('video_url', 'video_thumbnail', 'video_duration', 'video_platform', 'transcript', 'content_type');
```

Kết quả mong đợi:
```
column_name       | data_type  | is_nullable
------------------+------------+-------------
video_url         | text       | YES
video_thumbnail   | text       | YES
video_duration    | varchar    | YES
video_platform    | varchar    | YES
transcript        | text       | YES
content_type      | varchar    | YES
```

---

## 🔧 BƯỚC 2: CẬP NHẬT BACKEND

### 2.1. Update Post Struct

File: `backend/handlers.go`

Thêm các fields mới vào struct `Post`:

```go
type Post struct {
	ID             string         `json:"id"`
	Title          string         `json:"title"`
	Excerpt        string         `json:"excerpt"`
	Content        string         `json:"content"`
	CoverImage     string         `json:"cover_image"`
	CreatorID      *string        `json:"creator_id"`
	CreatorName    *string        `json:"creator_name"`
	CreatorAvatar  *string        `json:"creator_avatar"`
	SourceID       *int           `json:"source_id"`
	ExternalURL    *string        `json:"external_url"`
	PublishedAt    *time.Time     `json:"published_at"`
	Category       string         `json:"category"`
	Tags           pq.StringArray `json:"tags"`
	Upvotes        int            `json:"upvotes"`
	CommentsCount  int            `json:"comments_count"`
	ReadTime       string         `json:"read_time"`
	Published      bool           `json:"published"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`

	// NEW: Video fields
	VideoURL       *string        `json:"video_url"`
	VideoThumbnail *string        `json:"video_thumbnail"`
	VideoDuration  *string        `json:"video_duration"`
	VideoPlatform  *string        `json:"video_platform"`
	Transcript     *string        `json:"transcript"`
	ContentType    string         `json:"content_type"` // "article" or "video"
}
```

### 2.2. Update CMS Create Post Handler

File: `backend/cms.go`

Update function `cmsCreatePost`:

```go
func cmsCreatePost(c *fiber.Ctx) error {
	var req struct {
		ID             string   `json:"id"`
		Title          string   `json:"title"`
		Excerpt        string   `json:"excerpt"`
		Content        string   `json:"content"`
		CoverImage     string   `json:"cover_image"`
		CreatorID      string   `json:"creator_id"`
		CreatorName    string   `json:"creator_name"`
		CreatorAvatar  string   `json:"creator_avatar"`
		Category       string   `json:"category"`
		Tags           []string `json:"tags"`
		ReadTime       string   `json:"read_time"`
		Published      bool     `json:"published"`

		// NEW: Video fields
		VideoURL       string   `json:"video_url"`
		VideoThumbnail string   `json:"video_thumbnail"`
		VideoDuration  string   `json:"video_duration"`
		VideoPlatform  string   `json:"video_platform"`
		Transcript     string   `json:"transcript"`
		ContentType    string   `json:"content_type"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// Validate required fields
	if req.ID == "" || req.Title == "" {
		return c.Status(400).JSON(fiber.Map{"error": "ID and title are required"})
	}

	// Set default content_type
	if req.ContentType == "" {
		req.ContentType = "article"
	}

	// Insert với video fields
	_, err := db.Exec(`
		INSERT INTO posts (
			id, title, excerpt, content, cover_image, creator_id, creator_name,
			creator_avatar, category, tags, read_time, published,
			video_url, video_thumbnail, video_duration, video_platform, transcript, content_type
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
	`,
		req.ID, req.Title, req.Excerpt, req.Content, req.CoverImage, req.CreatorID,
		req.CreatorName, req.CreatorAvatar, req.Category, pq.Array(req.Tags),
		req.ReadTime, req.Published,
		nullString(req.VideoURL), nullString(req.VideoThumbnail), nullString(req.VideoDuration),
		nullString(req.VideoPlatform), nullString(req.Transcript), req.ContentType,
	)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create post", "details": err.Error()})
	}

	return c.Status(201).JSON(fiber.Map{
		"success": true,
		"message": "Post created successfully",
		"id":      req.ID,
	})
}

// Helper function để handle NULL strings
func nullString(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}
```

### 2.3. Test Backend API

```bash
cd backend
go run .
```

Test endpoint với curl:

```bash
curl -X POST http://localhost:8080/cms/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "id": "test-video-1",
    "title": "Test Video Title",
    "excerpt": "This is a test video",
    "content": "Full content here...",
    "cover_image": "https://example.com/thumb.jpg",
    "creator_name": "Test Creator",
    "category": "tech",
    "tags": ["youtube", "video", "test"],
    "published": true,
    "content_type": "video",
    "video_url": "https://youtube.com/watch?v=abc123",
    "video_thumbnail": "https://i.ytimg.com/vi/abc123/maxresdefault.jpg",
    "video_duration": "15:30",
    "video_platform": "youtube"
  }'
```

---

## 🤖 BƯỚC 3: SETUP n8n WORKFLOW

### 3.1. n8n Cloud Setup

1. Đăng ký: https://n8n.io/cloud/
2. Tạo workspace: "GearVN Content Hub"
3. Region: Singapore (gần Việt Nam nhất)

### 3.2. Setup Credentials

Trong n8n, vào **Settings → Credentials**:

1. **Anthropic (Claude AI)**
   - Name: "Claude API"
   - API Key: `sk-ant-...` (từ console.anthropic.com)

2. **Backend API (JWT Token)**
   - Type: Header Auth
   - Name: "GearVN Backend"
   - Header Name: `Authorization`
   - Header Value: `Bearer YOUR_JWT_TOKEN`

**Lấy JWT Token:**
```bash
# Login để lấy token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@gearvn.com", "password": "your-password"}'

# Response sẽ có token:
# {"token": "eyJhbGc..."}
```

### 3.3. n8n Workflow - YouTube to CMS

Tạo workflow mới trong n8n với các nodes sau:

```
┌────────────────────────────────────────────────────┐
│  WORKFLOW: YouTube → AI Translation → Backend      │
└────────────────────────────────────────────────────┘

1. [Manual Trigger]
   Input: YouTube URL
   ↓
2. [Function] Extract Video ID
   ↓
3. [HTTP Request] Get YouTube Video Details
   ↓
4. [HTTP Request] Get YouTube Transcript
   ↓
5. [AI - Claude] Translate + Rewrite Content
   ↓
6. [Function] Prepare Post Data
   ↓
7. [HTTP Request] POST to Backend /cms/posts
   ↓
8. [Response] Success/Error
```

---

### Node 1: Manual Trigger

```json
{
  "name": "Manual Trigger",
  "type": "n8n-nodes-base.manualTrigger",
  "parameters": {},
  "position": [250, 300]
}
```

**Test với:** URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`

---

### Node 2: Function - Extract Video ID

```javascript
// Extract video ID from YouTube URL
const input = $input.first().json;
const url = input.youtube_url || input.url;

let videoId = '';

if (url.includes('youtu.be/')) {
  videoId = url.split('youtu.be/')[1].split('?')[0];
} else if (url.includes('youtube.com/watch?v=')) {
  videoId = url.split('v=')[1].split('&')[0];
}

return {
  json: {
    video_id: videoId,
    youtube_url: url
  }
};
```

---

### Node 3: HTTP Request - Get YouTube Video Details

**Method:** GET
**URL:** `https://www.googleapis.com/youtube/v3/videos`

**Query Parameters:**
```json
{
  "part": "snippet,contentDetails,statistics",
  "id": "={{$json.video_id}}",
  "key": "YOUR_YOUTUBE_API_KEY"
}
```

**Lấy YouTube API Key:**
1. Vào: https://console.cloud.google.com/
2. Tạo project mới
3. Enable YouTube Data API v3
4. Create credentials → API Key
5. Copy API Key

**Response sẽ có:**
```json
{
  "items": [{
    "snippet": {
      "title": "Video title",
      "description": "Description...",
      "channelTitle": "Channel name",
      "thumbnails": {
        "maxres": {"url": "https://..."}
      }
    },
    "contentDetails": {
      "duration": "PT15M30S"
    }
  }]
}
```

---

### Node 4: HTTP Request - Get YouTube Transcript

**Có 2 cách:**

#### Cách 1: Sử dụng API YouTube Transcript (Miễn phí)

```
URL: https://subtitles-for-youtube.p.rapidapi.com/subtitles/{video_id}.json
Method: GET
Headers:
  X-RapidAPI-Key: YOUR_RAPIDAPI_KEY
  X-RapidAPI-Host: subtitles-for-youtube.p.rapidapi.com
```

**Đăng ký RapidAPI:**
- https://rapidapi.com/
- Subscribe "YouTube Transcript API" (Free tier: 100 requests/day)

#### Cách 2: Sử dụng Third-party Service

```
URL: https://tactiq-apps-prod.tactiq.io/transcript
Method: POST
Headers:
  Content-Type: application/json
Body: {
  "langCode": "en",
  "url": "{{$json.youtube_url}}"
}
```

**Response:**
```json
{
  "transcript": [
    {"text": "Hello everyone", "start": 0.5},
    {"text": "Welcome to this video", "start": 2.1}
  ]
}
```

---

### Node 5: Function - Combine Transcript Text

```javascript
// Combine transcript segments into full text
const data = $input.first().json;
const transcript = data.transcript || [];

const fullTranscript = transcript
  .map(segment => segment.text)
  .join(' ')
  .trim();

return {
  json: {
    ...data,
    full_transcript: fullTranscript
  }
};
```

---

### Node 6: AI - Claude Translation

**Node Type:** HTTP Request
**Method:** POST
**URL:** `https://api.anthropic.com/v1/messages`

**Headers:**
```json
{
  "x-api-key": "={{$credentials.claudeApi}}",
  "anthropic-version": "2023-06-01",
  "content-type": "application/json"
}
```

**Body:**
```json
{
  "model": "claude-3-5-sonnet-20241022",
  "max_tokens": 4000,
  "messages": [{
    "role": "user",
    "content": "Bạn là chuyên gia dịch và viết lại nội dung tech/gaming tiếng Việt.\n\nDựa vào transcript YouTube này, hãy:\n1. Dịch sang tiếng Việt tự nhiên\n2. Viết lại thành bài blog hoàn chỉnh (giữ technical terms tiếng Anh)\n3. Tạo excerpt ngắn gọn (100-150 từ)\n\n## Video Info:\nTitle: {{$json.title}}\nChannel: {{$json.channel}}\nDuration: {{$json.duration}}\n\n## Transcript:\n{{$json.full_transcript}}\n\n## Yêu cầu output:\nTrả về JSON với format:\n{\n  \"title_vi\": \"Tiêu đề tiếng Việt\",\n  \"excerpt_vi\": \"Tóm tắt ngắn 100-150 từ\",\n  \"content_vi\": \"Nội dung đầy đủ (markdown format)\",\n  \"tags\": [\"tag1\", \"tag2\", \"tag3\"]\n}\n\nCHỈ trả về JSON, không có markdown wrapper."
  }]
}
```

**Response format:**
```json
{
  "content": [{
    "text": "{\"title_vi\": \"...\", \"excerpt_vi\": \"...\", \"content_vi\": \"...\", \"tags\": [...]}"
  }]
}
```

---

### Node 7: Function - Parse AI Response & Prepare Post

```javascript
const videoData = $input.first().json;
const aiResponse = $node["AI - Claude"].json;

// Parse AI response
const aiText = aiResponse.content[0].text;
const translated = JSON.parse(aiText);

// Extract video details from YouTube API response
const videoItem = videoData.items[0];
const snippet = videoItem.snippet;
const duration = videoItem.contentDetails.duration;

// Convert ISO 8601 duration (PT15M30S) to readable format
function parseDuration(iso8601Duration) {
  const match = iso8601Duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const hours = match[1] || 0;
  const minutes = match[2] || 0;
  const seconds = match[3] || 0;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Prepare post data
const postData = {
  id: `youtube-${videoData.video_id}`,
  title: translated.title_vi,
  excerpt: translated.excerpt_vi,
  content: translated.content_vi,
  cover_image: snippet.thumbnails.maxres?.url || snippet.thumbnails.high.url,
  creator_name: snippet.channelTitle,
  creator_avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(snippet.channelTitle)}`,
  category: "tech", // or "gaming" based on video
  tags: [...translated.tags, "youtube", "video"],
  read_time: `${Math.ceil(parseInt(duration.match(/\d+/)[0]) / 60)} min`,
  published: true,

  // Video specific fields
  content_type: "video",
  video_url: videoData.youtube_url,
  video_thumbnail: snippet.thumbnails.maxres?.url || snippet.thumbnails.high.url,
  video_duration: parseDuration(duration),
  video_platform: "youtube",
  transcript: videoData.full_transcript
};

return {
  json: postData
};
```

---

### Node 8: HTTP Request - POST to Backend

**Method:** POST
**URL:** `{{$env.BACKEND_API}}/cms/posts`
**Authentication:** Use "GearVN Backend" credential
**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body:** `{{$json}}`

**Settings:**
- Response Format: JSON
- Timeout: 30000ms

---

### Node 9: IF - Check Success

```json
{
  "name": "Check Success",
  "type": "n8n-nodes-base.if",
  "parameters": {
    "conditions": {
      "number": [{
        "value1": "={{$statusCode}}",
        "operation": "equal",
        "value2": 201
      }]
    }
  }
}
```

**True branch:** Success notification
**False branch:** Error notification

---

## 🧪 BƯỚC 4: TEST WORKFLOW

### 4.1. Test với Video ngắn

Input URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`

Kiểm tra từng node:
1. ✅ Video ID extracted: `dQw4w9WgXcQ`
2. ✅ YouTube API response có data
3. ✅ Transcript lấy được
4. ✅ AI dịch thành công
5. ✅ POST lên backend success (201)

### 4.2. Check Database

```sql
SELECT id, title, content_type, video_url, video_duration, created_at
FROM posts
WHERE content_type = 'video'
ORDER BY created_at DESC
LIMIT 5;
```

### 4.3. Check Frontend

1. Mở http://localhost:3000 (hoặc URL của bạn)
2. Tìm bài post mới trong feed
3. Click vào post → Kiểm tra hiển thị
4. Nếu có video_url → Show embed player

---

## 🎨 BƯỚC 5: XEM GIAO DIỆN CMS

**Hiện tại chưa có CMS Admin UI visual**. Bạn có 3 options:

### Option 1: Sử dụng Supabase Table Editor (QUICKEST)

1. Vào Supabase Dashboard
2. **Table Editor** → Chọn table `posts`
3. Xem tất cả posts với visual interface
4. Edit, Delete trực tiếp từ đây

**Pros:**
- ✅ Không cần code
- ✅ Có sẵn ngay
- ✅ Full CRUD operations

**Cons:**
- ❌ Không custom được UI
- ❌ Không có analytics

---

### Option 2: Tạo Simple CMS Admin Page (RECOMMENDED)

Tôi có thể tạo 1 trang admin đơn giản với:
- List tất cả posts (table view)
- Edit post (form modal)
- Delete post
- Filter by content_type (video/article)
- Preview post

**File structure:**
```
admin.html          (Admin dashboard)
admin-posts.html    (Manage posts)
admin-videos.html   (Manage video content)
scripts/admin.js    (Admin logic)
```

**Bạn có muốn tôi tạo không?**

---

### Option 3: Sử dụng Third-party CMS (ADVANCED)

Install **Strapi**, **Directus**, hoặc **KeystoneJS** làm headless CMS:

```bash
# Ví dụ với Directus
npx create-directus-project my-cms
```

Connect tới Supabase PostgreSQL database.

---

## 📈 BƯỚC 6: AUTOMATION - SCHEDULE n8n

Sau khi test thành công, schedule workflow chạy tự động:

### 6.1. Thay Manual Trigger → Schedule Trigger

```json
{
  "name": "Schedule Trigger",
  "type": "n8n-nodes-base.scheduleTrigger",
  "parameters": {
    "rule": {
      "interval": [{
        "field": "hours",
        "hoursInterval": 6
      }]
    }
  }
}
```

**Chạy mỗi 6 giờ** để kéo video mới.

### 6.2. Thêm Node Get YouTube Channel Videos

Thay vì input manual URL, fetch tất cả video mới từ channel:

```
URL: https://www.googleapis.com/youtube/v3/search
Query: {
  "part": "snippet",
  "channelId": "YOUR_CHANNEL_ID",
  "order": "date",
  "maxResults": 10,
  "publishedAfter": "{{$now().minus(6, 'hours').toISO()}}",
  "key": "YOUR_API_KEY"
}
```

### 6.3. Loop qua tất cả videos

Add **Split In Batches** node để process từng video.

---

## 💰 CHI PHÍ ƯỚC TÍNH

### n8n Cloud
- **Starter Plan:** $20/month
- Unlimited workflows
- 2,500 executions/month

### Anthropic Claude API
- **Model:** claude-3-5-sonnet-20241022
- **Cost:** $3/1M input tokens, $15/1M output tokens
- **Per video (~10k tokens):** $0.03 + $0.15 = ~$0.18/video
- **100 videos/month:** ~$18/month

### YouTube API
- **Free tier:** 10,000 quota units/day
- 1 video = ~5 units
- **Unlimited (trong free quota)**

### Supabase
- **Free tier:** 500MB database, 2GB bandwidth
- **Pro (nếu cần):** $25/month

**Total:** ~$40-65/month

---

## ✅ CHECKLIST HOÀN THÀNH

```
Database Setup:
□ Chạy SQL migration (thêm video fields)
□ Verify schema updated
□ Test insert 1 video post manually

Backend Update:
□ Update Post struct
□ Update cmsCreatePost handler
□ Test API endpoint với Postman/curl
□ Backend running ổn định

n8n Workflow:
□ Setup n8n Cloud account
□ Add credentials (Claude API, Backend JWT)
□ Create workflow với 8-9 nodes
□ Test với 1 video
□ Verify data vào database
□ Verify hiển thị trên frontend

Automation:
□ Schedule trigger setup
□ Test auto-run
□ Monitor success rate
□ Error notification (email/Slack)

CMS Admin:
□ Decide: Supabase Table Editor hoặc Custom Admin Page
□ (Optional) Build admin UI
```

---

## 🆘 TROUBLESHOOTING

### Lỗi: "JWT Token invalid"

**Nguyên nhân:** Token expired hoặc sai format

**Fix:**
```bash
# Generate new token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@gearvn.com", "password": "password"}'
```

Copy token mới vào n8n credentials.

---

### Lỗi: "Failed to get transcript"

**Nguyên nhân:** Video không có subtitle/transcript

**Fix:**
- Skip videos without transcript
- Add IF node check transcript exists
- Use AI to transcribe audio (tốn phí hơn)

---

### Lỗi: "Database connection refused"

**Nguyên nhân:** Supabase connection string sai

**Fix:**
```bash
# Verify DATABASE_URL in .env
DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres

# Test connection
psql $DATABASE_URL -c "SELECT 1;"
```

---

## 📞 HỖ TRỢ

Nếu gặp lỗi hoặc cần hỗ trợ:

1. **n8n Issues:** https://community.n8n.io/
2. **Supabase Docs:** https://supabase.com/docs
3. **Claude API:** https://docs.anthropic.com/

---

## 🚀 NEXT STEPS

1. ✅ Hoàn thành setup cơ bản (Database + Backend + n8n)
2. ⏳ Test với 10 videos thật
3. ⏳ Build CMS Admin UI (optional)
4. ⏳ Schedule automation chạy mỗi 6h
5. ⏳ Monitor quality & fix bugs

**Bạn muốn tôi giúp bước nào tiếp theo?**
