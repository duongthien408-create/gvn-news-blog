# n8n Workflow: Tạo Articles từ Video Transcripts

## Overview

Workflow này tự động tạo bài viết blog từ transcript video YouTube đã được fetch.

```
Trigger → Lấy posts có transcript → AI generate article → Insert articles → Update post status
```

## Prerequisites

1. Đã tạo bảng `articles` trong Supabase (chạy SQL từ `scripts/sql/create_articles_table.sql`)
2. Có OpenAI API key hoặc Anthropic API key
3. Supabase URL và Service Role Key

---

## Các Nodes trong Workflow

### 1. Trigger Node

**Option A: Schedule Trigger**
- Type: `Schedule Trigger`
- Cron: `0 9 * * *` (9:00 AM hàng ngày, sau khi YouTube fetch lúc 8:00 AM)

**Option B: Webhook Trigger**
- Type: `Webhook`
- Path: `/generate-articles`
- Method: POST

---

### 2. Supabase Node - Lấy Posts cần xử lý

**Settings:**
- Operation: `Select`
- Table: `posts`

**Query Parameters:**
```
Filters:
- status = draft
- transcript IS NOT NULL
- transcript != ''

Limit: 5
Order: created_at DESC
```

**Fields to return:**
```
id, title, title_vi, transcript, thumbnail_url, source_url, creator_id
```

---

### 3. IF Node - Check có posts không

**Condition:**
```javascript
{{ $json.length > 0 }}
```

---

### 4. Loop Over Items (SplitInBatches)

**Settings:**
- Batch Size: 1
- Options: Reset

---

### 5. OpenAI Node - Generate Article

**Settings:**
- Resource: `Chat`
- Model: `gpt-4` hoặc `gpt-4-turbo`
- Temperature: 0.7

**System Message:**
```
Bạn là content writer chuyên về công nghệ tại Việt Nam. Nhiệm vụ của bạn là viết bài blog chuyên sâu dựa trên transcript video review sản phẩm công nghệ.

Yêu cầu:
1. Viết bằng tiếng Việt, giọng văn tự nhiên, dễ đọc
2. Không copy nguyên văn transcript, phải viết lại theo dạng bài viết
3. Chia bài viết thành các section rõ ràng với heading
4. Đưa ra nhận xét khách quan về sản phẩm
5. Output phải là JSON hợp lệ
```

**User Message:**
```
Dựa vào transcript video review sau, viết một bài blog chuyên sâu.

VIDEO TITLE: {{ $json.title_vi }}

TRANSCRIPT:
{{ $json.transcript }}

---

Viết bài với format JSON như sau:
{
  "title": "Tiêu đề bài viết hấp dẫn (khác với title video)",
  "slug": "tieu-de-bai-viet-khong-dau-viet-thuong-ngan-gon",
  "excerpt": "Tóm tắt ngắn 200-300 ký tự về nội dung bài viết",
  "content": "Nội dung đầy đủ bài viết 800-1500 từ, có thể dùng markdown cho heading (##, ###)"
}

Lưu ý:
- slug: viết thường, không dấu, dùng dấu gạch ngang, tối đa 60 ký tự
- excerpt: tóm tắt thu hút người đọc click vào
- content: viết chi tiết, chia sections, có nhận xét và kết luận
```

---

### 6. Function Node - Parse AI Response

**Code:**
```javascript
// Parse JSON từ AI response
const aiText = $input.item.json.message.content;
const post = $('Supabase').item.json;

// Extract JSON từ response (có thể AI wrap trong ```json```)
let jsonStr = aiText;
const jsonMatch = aiText.match(/```json\s*([\s\S]*?)\s*```/);
if (jsonMatch) {
  jsonStr = jsonMatch[1];
}

const article = JSON.parse(jsonStr);

// Tạo slug nếu AI không tạo đúng
let slug = article.slug || '';
if (!slug) {
  slug = article.title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 60);
}

// Thêm timestamp để đảm bảo unique
const timestamp = Date.now().toString(36);
slug = `${slug}-${timestamp}`;

return {
  json: {
    slug: slug,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    creator_id: post.creator_id,
    source_post_id: post.id,
    source_url: post.source_url,
    source_video_title: post.title_vi,
    thumbnail_url: post.thumbnail_url,
    status: 'public',
    ai_model: 'gpt-4',
    ai_prompt_version: 'v1.0',
    published_at: new Date().toISOString()
  }
};
```

---

### 7. Supabase Node - Insert Article

**Settings:**
- Operation: `Insert`
- Table: `articles`

**Fields:**
| Field | Value |
|-------|-------|
| slug | `{{ $json.slug }}` |
| title | `{{ $json.title }}` |
| excerpt | `{{ $json.excerpt }}` |
| content | `{{ $json.content }}` |
| creator_id | `{{ $json.creator_id }}` |
| source_post_id | `{{ $json.source_post_id }}` |
| source_url | `{{ $json.source_url }}` |
| source_video_title | `{{ $json.source_video_title }}` |
| thumbnail_url | `{{ $json.thumbnail_url }}` |
| status | `{{ $json.status }}` |
| ai_model | `{{ $json.ai_model }}` |
| ai_prompt_version | `{{ $json.ai_prompt_version }}` |
| published_at | `{{ $json.published_at }}` |

---

### 8. Supabase Node - Update Post (status + article_id)

**Settings:**
- Operation: `Update`
- Table: `posts`

**Filter:**
```
id = {{ $('Function').item.json.source_post_id }}
```

**Fields to Update:**
| Field | Value |
|-------|-------|
| status | `public` |
| article_id | `{{ $('Supabase Insert').item.json.id }}` |

> **Lưu ý:** `article_id` link ngược từ post đến article đã generate, để frontend hiển thị nút "Read Article" trên video card.

---

## Flow Diagram

```
┌─────────────────┐
│  Schedule/      │
│  Webhook        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Supabase      │
│   SELECT posts  │
│   (draft +      │
│   transcript)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   IF: has       │──── No ────► END
│   posts?        │
└────────┬────────┘
         │ Yes
         ▼
┌─────────────────┐
│   Loop Each     │◄──────────────┐
│   Post          │               │
└────────┬────────┘               │
         │                        │
         ▼                        │
┌─────────────────┐               │
│   OpenAI        │               │
│   Generate      │               │
│   Article       │               │
└────────┬────────┘               │
         │                        │
         ▼                        │
┌─────────────────┐               │
│   Function      │               │
│   Parse JSON    │               │
└────────┬────────┘               │
         │                        │
         ▼                        │
┌─────────────────┐               │
│   Supabase      │               │
│   INSERT        │               │
│   article       │               │
└────────┬────────┘               │
         │                        │
         ▼                        │
┌─────────────────┐               │
│   Supabase      │               │
│   UPDATE post   │───────────────┘
│   → public      │
└─────────────────┘
```

---

## Error Handling

Thêm **Error Trigger** node để handle các trường hợp:

1. **AI parse error**: Gửi notification (Slack/Discord/Email)
2. **Supabase error**: Retry hoặc log lỗi
3. **Duplicate slug**: Thêm random suffix

**Error Trigger Code:**
```javascript
// Log error to console hoặc gửi notification
const error = $input.item.json;
console.error('Article generation failed:', error);

// Có thể thêm Slack/Discord notification ở đây
return {
  json: {
    error: true,
    message: error.message,
    timestamp: new Date().toISOString()
  }
};
```

---

## Testing

1. **Manual test**: Trigger workflow manually với 1 post
2. **Check Supabase**: Verify article được insert đúng
3. **Check Frontend**: Truy cập `/articles/{slug}` để xem bài viết
4. **Check post status**: Verify post đã được update thành `public`

---

## Credentials cần thiết

| Service | Credential Type | Required Fields |
|---------|-----------------|-----------------|
| Supabase | Supabase API | URL, Service Role Key |
| OpenAI | OpenAI API | API Key |

**Supabase URL:** `https://qibhlrsdykpkbsnelubz.supabase.co`

---

## Tips

1. **Rate limiting**: Thêm `Wait` node 2-3 giây giữa mỗi API call
2. **Cost optimization**: Dùng `gpt-3.5-turbo` cho test, `gpt-4` cho production
3. **Quality check**: Review bài viết đầu tiên trước khi chạy batch lớn
4. **Backup**: Export workflow JSON sau khi setup xong
