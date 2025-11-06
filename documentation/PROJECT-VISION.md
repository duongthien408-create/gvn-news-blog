# 🎯 GearVN Creator Hub - Project Vision

**Một nền tảng tổng hợp tin tức công nghệ và cộng đồng creator Việt Nam**

---

## 🌟 Core Vision

**Build một hub creator công nghệ**, nơi cộng đồng cùng nhau chia sẻ thông tin, kiến thức hữu ích cho người đọc.

### Mục Tiêu Chính:
- ✅ Người dùng vào web sẽ có được **các thông tin hữu ích và chất lượng cho ngành tech**
- ✅ Tạo cộng đồng creator Việt Nam chuyên về game và công nghệ
- ✅ Hệ thống tương tác xã hội: tài khoản, thảo luận, upvote/downvote, lưu bài, phân loại tags
- ✅ Nội dung tiếng Việt chất lượng cao từ nguồn quốc tế

---

## 📊 Content Strategy - 3 Nguồn Nội Dung

### 1. 🌐 RSS News Aggregation (Auto-translated)

**Flow:** RSS Feeds → n8n Automation → AI Translation → Vietnamese Content → CMS Publish

```
┌─────────────────┐
│  RSS Feeds      │ Tech/Gaming news sources
│  (Game + Tech)  │ (English/International)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  n8n Workflow   │ Automation pipeline
│  - Fetch RSS    │
│  - Parse HTML   │
│  - Extract text │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AI Translation │ Auto translate to Vietnamese
│  (GPT/Claude)   │ Maintain quality + context
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  CMS Submit     │ Publish to database
│  → Database     │ Auto-post to website
└─────────────────┘
```

**Nguồn RSS:**
- Link RSS về game (gaming news, game reviews, esports)
- Link RSS về công nghệ (tech news, hardware, software)
- Thuần tech/gaming content - không spam

**Xử Lý:**
- n8n tự động fetch và parse RSS
- AI dịch sang tiếng Việt (giữ nguyên chất lượng)
- Submit lên CMS database
- Tự động publish với category phù hợp

---

### 2. 🎥 Creator Video Shorts

**Flow:** Video Content → n8n Extract → Transcript + Thumbnail → Database → Creator Posts

```
┌─────────────────┐
│  Creator Videos │ YouTube/TikTok shorts
│  (Reviewers)    │ Tech reviews, unboxing
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  n8n Workflow   │
│  - Get video    │
│  - Extract      │
│    transcript   │
│  - Get          │
│    thumbnail    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Database       │ Store post with:
│  - Title        │ - Video link
│  - Summary      │ - Creator info
│  - Thumbnail    │ - Transcript
│  - Link         │
└─────────────────┘
```

**Nguồn Video:**
- Creators/reviewers content
- Video shorts (TikTok, YouTube Shorts, Reels)
- Tech reviews, unboxing, tutorials

**Xử Lý:**
- n8n extract transcript từ video
- Extract thumbnail làm cover image
- Tạo post link tới video gốc
- Gắn creator profile
- Auto-categorize theo nội dung

---

### 3. 📝 Text-Based Tech Reviews

**Flow:** Original Articles → Link to Source → Branding Attribution

```
┌─────────────────┐
│  Tech Articles  │ Blog posts, reviews
│  (Original)     │ Detailed content
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Post Creation  │ Create post with:
│  - Summary      │ - Link to original
│  - Cover image  │ - Attribution
│  - Tags         │ - Category
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Source Link    │ Drive traffic to
│  Attribution    │ original creator
└─────────────────┘
```

**Nguồn Content:**
- Text-based tech reviews
- Blog posts từ creators
- Long-form articles

**Xử Lý:**
- Post summary + excerpt
- Link tới bài viết gốc
- Attribution rõ ràng (branding)
- Không copy full content - respect IP

---

## 🤝 Social Features - Community Hub

### User Features:
- ✅ **Tài Khoản Người Dùng** - Đăng ký, đăng nhập, profile
- ✅ **Follow Creators** - Theo dõi creators yêu thích
- ✅ **Upvote/Downvote** - Voting system cho posts
- ✅ **Bookmark** - Lưu bài viết để đọc sau
- ✅ **Comments** - Thảo luận, trao đổi ý kiến
- ✅ **Tags/Categories** - Phân loại nội dung
- ✅ **Custom Feeds** - Tùy chỉnh feed theo sở thích
- ✅ **Folders** - Tổ chức bookmarks

### Creator Features:
- ✅ **Creator Profiles** - Trang cá nhân với badge
- ✅ **Post Creation** - Creators có thể đăng bài
- ✅ **Analytics** (planned) - View counts, engagement
- ✅ **Follower Count** - Tracking audience
- ✅ **Verified Badges** - Creator verification

---

## 🔧 Technical Architecture

### n8n Automation Workflows:

#### Workflow 1: RSS Auto-Aggregation
```
Trigger: Cron (every 15 mins)
  ↓
Fetch RSS feeds
  ↓
Parse HTML content
  ↓
AI Translation (GPT/Claude API)
  ↓
Submit to Backend API
  ↓
Database → Posts table
```

#### Workflow 2: Video Processing
```
Trigger: Manual/Webhook
  ↓
Get video URL
  ↓
Extract transcript (YouTube API)
  ↓
Get thumbnail image
  ↓
Create post with video link
  ↓
Database → Posts table
```

#### Workflow 3: Content Curation
```
Trigger: Manual review
  ↓
Check content quality
  ↓
Add tags/categories
  ↓
Approve/Reject
  ↓
Publish to feed
```

---

## 🎨 Brand Identity - GearVN

### Design Philosophy:
- **Dark Mode Only** - Pure black background (#000000)
- **GearVN Red** - Primary accent color (#EF4444)
- **Tech-focused** - Clean, modern, minimalist
- **Mobile-first** - Responsive design
- **Fast** - Performance optimized

### Color System:
```css
--color-surface: #000000        /* Pure black background */
--color-panel: #0F0F0F          /* Sidebar, header */
--color-card: #191919           /* Cards, inputs */
--color-border: #323232         /* Borders */
--color-accent: #EF4444         /* GearVN Red - CTA */
--color-accent-hover: #F87171   /* Hover states */
```

---

## 🚀 Implementation Roadmap

### Phase 1: RSS Aggregation (Week 2) 🔄 Current
- [ ] Setup n8n instance
- [ ] Create RSS fetch workflow
- [ ] Integrate AI translation (GPT-4/Claude)
- [ ] Connect to backend API
- [ ] Seed initial RSS sources (game + tech)
- [ ] Test auto-publishing

### Phase 2: Video Integration (Week 3)
- [ ] Video transcript extraction
- [ ] Thumbnail extraction
- [ ] Creator linking system
- [ ] Video embed support
- [ ] Test with real creator content

### Phase 3: Community Features (Week 4)
- [ ] Comments system UI
- [ ] Notification system
- [ ] Advanced search
- [ ] Content moderation
- [ ] User analytics

### Phase 4: Advanced Features (Week 5+)
- [ ] Personalized recommendations
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Mobile app (PWA)
- [ ] API for 3rd party integrations

---

## 📈 Success Metrics

### Content Quality:
- ✅ 100+ quality tech/gaming posts per week
- ✅ Vietnamese translation accuracy > 95%
- ✅ Content diversity (news, reviews, tutorials)

### Community Growth:
- 🎯 1,000 registered users (first month)
- 🎯 10,000 monthly active users (3 months)
- 🎯 50+ verified creators (6 months)

### Engagement:
- 🎯 Average 5+ upvotes per post
- 🎯 10+ comments per day
- 🎯 50%+ user retention (monthly)

### Technical Performance:
- ✅ Page load < 2 seconds
- ✅ 99.9% uptime
- ✅ Mobile-responsive design

---

## 🌍 Target Audience

### Primary:
- **Tech Enthusiasts** - Người yêu công nghệ
- **Gamers** - Cộng đồng game thủ Việt Nam
- **Content Creators** - Reviewers, YouTubers
- **Students** - Học sinh, sinh viên IT

### Secondary:
- **Professionals** - Developers, designers
- **Tech Shoppers** - Người mua sắm tech
- **Media** - Tech journalists, bloggers

---

## 💡 Unique Value Propositions

### For Readers:
1. **Tiếng Việt Quality** - Nội dung tech chất lượng bằng tiếng Việt
2. **One-stop Hub** - Tất cả tin tech/gaming ở 1 nơi
3. **Community-driven** - Upvote/downvote giúp lọc content
4. **Personalized** - Custom feed theo sở thích

### For Creators:
1. **Audience** - Tiếp cận cộng đồng tech Việt Nam
2. **Attribution** - Link nguồn, branding rõ ràng
3. **Analytics** - Tracking engagement, views
4. **Monetization** (future) - Revenue sharing

### For GearVN:
1. **Brand Awareness** - Trở thành hub tech hàng đầu VN
2. **Community** - Xây dựng loyal user base
3. **Content** - User-generated + auto-aggregated
4. **Traffic** - SEO-friendly content → organic growth

---

## 🔮 Future Vision (6-12 months)

### Advanced Features:
- 🔮 **AI Recommendations** - Personalized feed algorithm
- 🔮 **Newsletter** - Weekly digest email
- 🔮 **Podcast Integration** - Audio content
- 🔮 **Events** - Tech meetups, webinars
- 🔮 **Marketplace** - Creator services
- 🔮 **Premium** - Ad-free, early access

### Expansion:
- 🔮 **Mobile App** - Native iOS/Android
- 🔮 **Regional** - Expand to SEA markets
- 🔮 **Partnerships** - Tech brands, publishers
- 🔮 **API** - Public API for developers

---

## 📚 References

### Inspiration:
- **daily.dev** - Tech news aggregation model
- **Product Hunt** - Upvote/comment system
- **Reddit** - Community-driven content
- **Medium** - Creator platform

### Tech Stack:
- **Frontend:** Vanilla JS, Tailwind CSS
- **Backend:** Go, Fiber framework
- **Database:** PostgreSQL (Supabase)
- **Automation:** n8n workflows
- **AI:** GPT-4/Claude for translation
- **Hosting:** Vercel (frontend) + Railway (backend)

---

**Last Updated:** Jan 11, 2025

**Status:** 70% MVP Ready → Implementing RSS Aggregation

**Next Milestone:** n8n RSS workflow + AI translation

---

**Made with ❤️ for GearVN - Building the future of Vietnamese tech content**
