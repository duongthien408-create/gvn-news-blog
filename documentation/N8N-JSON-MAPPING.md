# 🔄 N8N JSON MAPPING TO DATABASE

**Date:** 2025-11-06
**Purpose:** Map n8n output JSON vào Supabase `posts` table

---

## 📥 N8N OUTPUT (Current)

```json
{
  "video_title": "BÀN PHÍM NHÔM giảm 50%? HyperX Alloy Origins Core...",
  "thumbnail_url": "https://i.ytimg.com/vi/ZBXLEqWMvBU/maxresdefault.jpg",
  "video_url": "https://www.youtube.com/shorts/ZBXLEqWMvBU",
  "video_id": "ZBXLEqWMvBU",
  "full_transcript": "Bình thường các bạn mua bàn phím HyperX...",
  "key_highlights": {
    "product_name": "HyperX Alloy Origins Core",
    "category": "Bàn phím cơ",
    "price": "Dưới 1 triệu đồng (giá khuyến mãi)",
    "summary": "Video giới thiệu về bàn phím HyperX Alloy Origins Core...",
    "key_specs": ["Layout TKL", "Vỏ nhôm chắc chắn", ...],
    "pros": ["Giá khuyến mãi rất rẻ", ...],
    "cons": ["Chỉ có một chế độ kết nối", ...],
    "target_audience": "Game thủ, người dùng thích bàn phím cơ giá rẻ...",
    "key_quotes": ["Nghe là thấy có cái mùi 'lút ga' liền.", ...],
    "reviewer_rating": "Không có đánh giá cụ thể từ reviewer"
  }
}
```

---

## 📤 DATABASE PAYLOAD (Target)

### **Function Node in n8n:**

```javascript
// N8N Function Node: Transform to Database Format
const item = $input.item.json;

// Generate ID from video_id
const id = `video-${item.video_id}`;

// Generate tags from product name + category
const tags = [
  item.key_highlights.product_name.toLowerCase().replace(/\s+/g, '-'),
  'ban-phim',
  'gaming',
  'review',
  'hyperx'
];

// Build content markdown
const content = `# ${item.video_title}

## Tổng quan
${item.key_highlights.summary}

## Thông số kỹ thuật
${item.key_highlights.key_specs.map(spec => `- ${spec}`).join('\n')}

## Ưu điểm
${item.key_highlights.pros.map(pro => `✅ ${pro}`).join('\n')}

## Nhược điểm
${item.key_highlights.cons.map(con => `❌ ${con}`).join('\n')}

## Đối tượng phù hợp
${item.key_highlights.target_audience}

## Transcript gốc
${item.full_transcript}
`;

// Detect category from key_highlights.category
const categoryMap = {
  'Bàn phím cơ': 'peripherals',
  'Chuột gaming': 'peripherals',
  'Tai nghe': 'peripherals',
  'Card đồ họa': 'hardware',
  'CPU': 'hardware',
  'Laptop': 'hardware',
  'Gaming': 'gaming'
};

const category = categoryMap[item.key_highlights.category] || 'peripherals';

// Calculate video duration from transcript
// (n8n should get this from YouTube API, but if not available, estimate from transcript length)
const estimatedDuration = Math.ceil(item.full_transcript.length / 15); // ~15 chars per second
const minutes = Math.floor(estimatedDuration / 60);
const seconds = estimatedDuration % 60;
const videoDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

// Get channel info (add this to n8n YouTube node output)
const channelName = item.channel_name || "GearVN Review"; // Fallback
const channelId = item.channel_id || "unknown";

return {
  json: {
    // Required fields
    id: id,
    title: item.video_title,
    content_type: "video",
    category: category,
    cover_image: item.thumbnail_url,
    published: true,

    // Content fields
    excerpt: item.key_highlights.summary.substring(0, 200) + "...",
    content: content,
    tags: tags,
    read_time: `${minutes} min`,

    // Video fields
    video_url: item.video_url,
    video_thumbnail: item.thumbnail_url,
    video_duration: videoDuration,
    video_platform: "youtube",
    transcript: item.full_transcript,

    // Creator fields
    creator_id: channelId,
    creator_name: channelName,
    creator_avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(channelName)}&background=ef4444&color=fff`,
    source_id: null,
    external_url: null,

    // Metadata
    published_at: new Date().toISOString(),
    upvotes: 0,
    comments_count: 0
  }
};
```

---

## 🎯 RESULT JSON FOR SUPABASE

```json
{
  "id": "video-ZBXLEqWMvBU",
  "title": "BÀN PHÍM NHÔM giảm 50%? HyperX Alloy Origins Core này có gì mờ ám không mà rẻ vậy?",
  "excerpt": "Video giới thiệu về bàn phím HyperX Alloy Origins Core với mức giá khuyến mãi dưới 1 triệu đồng. Bàn phím có layout TKL, vỏ nhôm chắc chắn, thiết kế hở chân switch giúp đèn LED tỏa sáng tốt hơn...",
  "content": "# BÀN PHÍM NHÔM giảm 50%? HyperX Alloy Origins Core này có gì mờ ám không mà rẻ vậy?\n\n## Tổng quan\nVideo giới thiệu về bàn phím HyperX Alloy Origins Core...\n\n## Thông số kỹ thuật\n- Layout TKL (Tenkeyless)\n- Vỏ nhôm chắc chắn\n- Thiết kế hở chân switch\n- Ba loại switch (trong video là switch tactile)\n- Kết nối qua cổng Type-C\n\n## Ưu điểm\n✅ Giá khuyến mãi rất rẻ (dưới 1 triệu đồng)\n✅ Vỏ nhôm chắc chắn\n✅ Thiết kế hở chân switch giúp LED tỏa sáng tốt\n✅ Phù hợp cho game thủ\n✅ Kết nối Type-C giảm độ trễ\n\n## Nhược điểm\n❌ Chỉ có một chế độ kết nối (Type-C)\n❌ Không có switch linear hoặc clicky trong phiên bản được nhắc đến\n\n## Đối tượng phù hợp\nGame thủ, người dùng thích bàn phím cơ giá rẻ, người thích tùy chỉnh LED\n\n## Transcript gốc\nBình thường các bạn mua bàn phím HyperX Alloy Origins Core này...",
  "cover_image": "https://i.ytimg.com/vi/ZBXLEqWMvBU/maxresdefault.jpg",
  "content_type": "video",
  "category": "peripherals",
  "tags": ["hyperx-alloy-origins-core", "ban-phim", "gaming", "review", "hyperx"],
  "read_time": "3 min",
  "published": true,

  "video_url": "https://www.youtube.com/shorts/ZBXLEqWMvBU",
  "video_thumbnail": "https://i.ytimg.com/vi/ZBXLEqWMvBU/maxresdefault.jpg",
  "video_duration": "3:45",
  "video_platform": "youtube",
  "transcript": "Bình thường các bạn mua bàn phím HyperX Alloy Origins Core này...",

  "creator_id": "UC1234567890",
  "creator_name": "GearVN Review",
  "creator_avatar": "https://ui-avatars.com/api/?name=GearVN+Review&background=ef4444&color=fff",
  "source_id": null,
  "external_url": null,

  "published_at": "2025-11-06T12:00:00Z",
  "upvotes": 0,
  "comments_count": 0
}
```

---

## 🔧 N8N WORKFLOW ADJUSTMENTS NEEDED

### **1. Add YouTube API Node Fields**

Hiện tại output thiếu:
- ❌ `channel_name` - Tên kênh YouTube
- ❌ `channel_id` - ID kênh YouTube
- ❌ `video_duration` - Thời lượng video thực tế (hiện đang estimate từ transcript)
- ❌ `published_date` - Ngày publish video gốc

**Fix:** Thêm vào YouTube API node output:

```javascript
// In n8n YouTube API node
{
  ...existing_fields,
  channel_name: "{{ $json.snippet.channelTitle }}",
  channel_id: "{{ $json.snippet.channelId }}",
  channel_thumbnail: "{{ $json.snippet.thumbnails.default.url }}",
  video_duration_seconds: "{{ $json.contentDetails.duration }}",  // ISO 8601 format: PT3M45S
  published_date: "{{ $json.snippet.publishedAt }}"
}
```

### **2. Add Duration Parser Node**

Convert ISO 8601 duration (PT3M45S) → "3:45"

```javascript
// N8N Function Node: Parse Duration
const duration = $input.item.json.video_duration_seconds; // "PT3M45S"

// Parse ISO 8601 duration
const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
const hours = parseInt(match[1]) || 0;
const minutes = parseInt(match[2]) || 0;
const seconds = parseInt(match[3]) || 0;

// Format to MM:SS or H:MM:SS
let formatted;
if (hours > 0) {
  formatted = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
} else {
  formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

return {
  json: {
    ...$input.item.json,
    video_duration: formatted
  }
};
```

### **3. Category Mapping Enhancement**

```javascript
// Better category detection
const categoryMap = {
  // Peripherals
  'bàn phím': 'peripherals',
  'chuột': 'peripherals',
  'tai nghe': 'peripherals',
  'màn hình': 'peripherals',
  'webcam': 'peripherals',

  // Hardware
  'card đồ họa': 'hardware',
  'gpu': 'hardware',
  'cpu': 'hardware',
  'laptop': 'hardware',
  'pc': 'hardware',
  'case': 'hardware',
  'nguồn': 'hardware',

  // Gaming
  'game': 'gaming',
  'valorant': 'gaming',
  'league of legends': 'gaming',
  'dota': 'gaming',

  // Tech News
  'tin tức': 'tech-news',
  'ra mắt': 'tech-news',
  'leak': 'tech-news'
};

// Check title + product_name
const titleLower = item.video_title.toLowerCase();
const productLower = item.key_highlights.product_name.toLowerCase();
const categoryLower = item.key_highlights.category.toLowerCase();

let detectedCategory = 'peripherals'; // default

for (const [keyword, cat] of Object.entries(categoryMap)) {
  if (titleLower.includes(keyword) || productLower.includes(keyword) || categoryLower.includes(keyword)) {
    detectedCategory = cat;
    break;
  }
}
```

---

## 📋 CHECKLIST FOR N8N

- [ ] **YouTube API Node** outputs:
  - `channel_name`
  - `channel_id`
  - `channel_thumbnail`
  - `video_duration_seconds` (ISO 8601)
  - `published_date`

- [ ] **Duration Parser Node** converts:
  - `PT3M45S` → `"3:45"`
  - `PT1H22M30S` → `"1:22:30"`

- [ ] **Transform Function Node** generates:
  - Unique `id` from `video_id`
  - Proper `tags` array
  - Markdown `content` from `key_highlights`
  - Correct `category` mapping
  - 200-char `excerpt`

- [ ] **Supabase Insert Node**:
  - URL: `https://qibhlrsdykpkbsnelubz.supabase.co/rest/v1/posts`
  - Headers: `apikey`, `Authorization`, `Content-Type`, `Prefer`
  - Body: Full JSON payload

---

## 🧪 TEST PAYLOAD

Dùng payload này để test trong Supabase SQL Editor:

```sql
INSERT INTO posts (
  id, title, excerpt, content, cover_image,
  content_type, category, tags, read_time, published,
  video_url, video_thumbnail, video_duration, video_platform, transcript,
  creator_id, creator_name, creator_avatar,
  published_at, upvotes, comments_count
) VALUES (
  'video-ZBXLEqWMvBU',
  'BÀN PHÍM NHÔM giảm 50%? HyperX Alloy Origins Core này có gì mờ ám không mà rẻ vậy?',
  'Video giới thiệu về bàn phím HyperX Alloy Origins Core với mức giá khuyến mãi dưới 1 triệu đồng...',
  '# BÀN PHÍM NHÔM giảm 50%?

## Tổng quan
Video giới thiệu về bàn phím HyperX Alloy Origins Core...',
  'https://i.ytimg.com/vi/ZBXLEqWMvBU/maxresdefault.jpg',
  'video',
  'peripherals',
  ARRAY['hyperx-alloy-origins-core', 'ban-phim', 'gaming', 'review', 'hyperx'],
  '3 min',
  true,
  'https://www.youtube.com/shorts/ZBXLEqWMvBU',
  'https://i.ytimg.com/vi/ZBXLEqWMvBU/maxresdefault.jpg',
  '3:45',
  'youtube',
  'Bình thường các bạn mua bàn phím HyperX Alloy Origins Core này...',
  'UC1234567890',
  'GearVN Review',
  'https://ui-avatars.com/api/?name=GearVN+Review&background=ef4444&color=fff',
  CURRENT_TIMESTAMP,
  0,
  0
);
```

---

## 🚨 IMPORTANT NOTES

1. **Video Duration:** Phải get từ YouTube API, KHÔNG estimate từ transcript
2. **Channel Info:** Bắt buộc có `channel_name`, `channel_id` từ YouTube API
3. **Category:** Dùng logic mapping từ `product_name` + `category` + `title`
4. **Tags:** Generate từ product name slug + category + fixed tags như "review", "gaming"
5. **ID Format:** `video-{video_id}` - unique, không trùng
6. **Content:** Build từ `key_highlights` với Markdown format chuẩn

---

**Next Step:** Adjust n8n workflow theo checklist trên và test insert vào Supabase!
