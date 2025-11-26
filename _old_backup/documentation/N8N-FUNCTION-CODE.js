// N8N FUNCTION NODE: Transform YouTube Data to Database Format
// Copy this code vào Function node trong n8n workflow

const item = $input.item.json;

// ============ 1. PARSE VIDEO DURATION ============
// Convert ISO 8601 (PT1M7S) to MM:SS format
function parseDuration(isoDuration) {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";

  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

const videoDuration = parseDuration(item.video_duration);

// ============ 2. GENERATE UNIQUE ID ============
// Format: video-{video_id}
const id = `video-${item.video_id}`;

// ============ 3. DETECT CATEGORY ============
// Map Vietnamese category to English
const categoryMap = {
  // Peripherals
  'bàn phím': 'peripherals',
  'bàn phím cơ': 'peripherals',
  'chuột': 'peripherals',
  'chuột gaming': 'peripherals',
  'tai nghe': 'peripherals',
  'màn hình': 'peripherals',
  'webcam': 'peripherals',
  'loa': 'peripherals',

  // Hardware
  'card đồ họa': 'hardware',
  'gpu': 'hardware',
  'vga': 'hardware',
  'cpu': 'hardware',
  'laptop': 'hardware',
  'pc': 'hardware',
  'case': 'hardware',
  'nguồn': 'hardware',
  'mainboard': 'hardware',
  'ram': 'hardware',
  'ssd': 'hardware',
  'ổ cứng': 'hardware',

  // Gaming
  'game': 'gaming',
  'valorant': 'gaming',
  'league of legends': 'gaming',
  'lol': 'gaming',
  'dota': 'gaming',
  'csgo': 'gaming',

  // Tech News
  'tin tức': 'tech-news',
  'ra mắt': 'tech-news',
  'leak': 'tech-news',
  'thông báo': 'tech-news'
};

function detectCategory(title, productName, categoryName) {
  const searchText = `${title} ${productName} ${categoryName}`.toLowerCase();

  for (const [keyword, cat] of Object.entries(categoryMap)) {
    if (searchText.includes(keyword)) {
      return cat;
    }
  }

  return 'peripherals'; // Default
}

const category = detectCategory(
  item.video_title,
  item.key_highlights.product_name,
  item.key_highlights.category
);

// ============ 4. GENERATE TAGS ============
// Create slug from product name + fixed tags
function createSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const productSlug = createSlug(item.key_highlights.product_name);
const tags = [
  productSlug,
  'review',
  'gearvn',
  category === 'peripherals' ? 'phu-kien' : category,
  'youtube'
];

// ============ 5. BUILD MARKDOWN CONTENT ============
const content = `# ${item.video_title}

## 📋 Tổng quan

${item.key_highlights.summary}

**Sản phẩm:** ${item.key_highlights.product_name}
**Giá:** ${item.key_highlights.price}
**Đối tượng:** ${item.key_highlights.target_audience}

---

## ⚙️ Thông số kỹ thuật

${item.key_highlights.key_specs.map(spec => `- ${spec}`).join('\n')}

---

## ✅ Ưu điểm

${item.key_highlights.pros.map(pro => `✅ ${pro}`).join('\n')}

---

## ❌ Nhược điểm

${item.key_highlights.cons.map(con => `❌ ${con}`).join('\n')}

---

## 💬 Highlights từ video

${item.key_highlights.key_quotes.map(quote => `> "${quote}"`).join('\n\n')}

---

## 📝 Transcript đầy đủ

${item.full_transcript}

---

**Nguồn:** [Xem video gốc trên YouTube](${item.video_url})
**Kênh:** ${item.channel_name}
`;

// ============ 6. CREATE EXCERPT ============
// Truncate summary to 200 chars
const excerpt = item.key_highlights.summary.length > 200
  ? item.key_highlights.summary.substring(0, 197) + "..."
  : item.key_highlights.summary;

// ============ 7. CALCULATE READ TIME ============
// Based on video duration
const durationParts = videoDuration.split(':');
let totalMinutes;
if (durationParts.length === 3) {
  // H:MM:SS
  totalMinutes = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
} else {
  // MM:SS
  totalMinutes = parseInt(durationParts[0]);
}
const readTime = `${totalMinutes} min`;

// ============ 8. CREATE AVATAR URL ============
const creatorAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.channel_name)}&background=ef4444&color=fff&size=128`;

// ============ 9. BUILD FINAL PAYLOAD ============
const payload = {
  // Required fields
  id: id,
  title: item.video_title,
  content_type: "video",
  category: category,
  cover_image: item.thumbnail_url,
  published: true,

  // Content fields
  excerpt: excerpt,
  content: content,
  tags: tags,
  read_time: readTime,

  // Video fields
  video_url: item.video_url,
  video_thumbnail: item.thumbnail_url,
  video_duration: videoDuration,
  video_platform: "youtube",
  transcript: item.full_transcript,

  // Creator fields
  creator_id: item.channel_id,
  creator_name: item.channel_name,
  creator_avatar: creatorAvatar,
  source_id: null,
  external_url: null,

  // Metadata
  published_at: item.published_date,
  upvotes: 0,
  comments_count: 0
};

// ============ 10. RETURN ============
return {
  json: payload
};
