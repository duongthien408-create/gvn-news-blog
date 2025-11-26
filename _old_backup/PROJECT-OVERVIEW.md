# GearVN Creator Hub - Project Overview

## 1. Giới thiệu

**GearVN Creator Hub** là một platform cộng đồng cho tech reviewers và content creators Việt Nam, tập trung vào gaming gear, PC builds, và công nghệ.

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite + TailwindCSS |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Hosting | Local dev / Vercel (production) |

---

## 2. Cấu trúc thư mục

```
gvn-news-blog/
├── src/                          # Frontend React
│   ├── App.jsx                   # Main component
│   ├── lib/
│   │   └── supabase.js           # Supabase client & API helpers
│   ├── index.css                 # TailwindCSS styles
│   └── main.jsx                  # Entry point
│
├── database/                     # Database files
│   ├── 00-clean-with-cascade.sql # Reset database
│   ├── 02-new-complete-schema.sql # Full schema v2.0
│   ├── USER-VS-CREATOR-EXPLAINED.md # Documentation
│   └── seed-parts/               # Modular seed files
│       ├── 00-verify-all.sql
│       ├── 01-users-profiles.sql
│       ├── 02-creators.sql
│       ├── 03-tags.sql
│       ├── 04-products.sql
│       ├── 04b-products-only.sql
│       ├── 04c-fix-product-images.sql
│       ├── 05-posts.sql
│       ├── 06-comments.sql
│       ├── 07-interactions.sql
│       ├── 08-squads.sql
│       ├── 09-gamification.sql
│       └── README.md
│
├── public/                       # Static assets
├── .env.local                    # Supabase credentials (not in git)
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## 3. Database Schema (v2.0)

### 3.1 Core Tables

| Table | Description | Key Fields |
|-------|-------------|------------|
| `users` | Platform members | id, email, username, role |
| `user_profiles` | User details | display_name, avatar_url, bio |
| `user_levels` | Gamification | level, total_points |
| `user_preferences` | Settings | theme, language, notifications |
| `streaks` | Login streaks | current_streak, longest_streak |

### 3.2 Content Tables

| Table | Description | Key Fields |
|-------|-------------|------------|
| `creators` | External content sources | name, slug, verified, total_followers |
| `creator_socials` | Social links | platform, url, follower_count |
| `posts` | Articles/videos | title, slug, content, thumbnail_url |
| `post_creators` | Post-Creator relationship | post_id, creator_id |
| `post_tags` | Post-Tag relationship | post_id, tag_id |
| `post_products` | Products in posts | post_id, product_id |
| `post_media` | Images/videos | url, type, caption |
| `tags` | Content categories | name, slug, icon_name |
| `sources` | Content sources | name, url, type |

### 3.3 Interaction Tables

| Table | Description | Key Fields |
|-------|-------------|------------|
| `comments` | User comments | post_id, user_id, content, parent_id |
| `votes` | Post votes | post_id, user_id, vote_type |
| `comment_votes` | Comment votes | comment_id, user_id, vote_type |
| `bookmarks` | Saved posts | user_id, post_id |
| `follows` | Creator follows | follower_id, creator_id |

### 3.4 Product Tables

| Table | Description | Key Fields |
|-------|-------------|------------|
| `products` | GearVN products | name, price, gearvn_url |
| `brands` | Product brands | name, logo_url |
| `product_categories` | Categories | name, slug |

### 3.5 Community Tables

| Table | Description | Key Fields |
|-------|-------------|------------|
| `squads` | Communities/groups | name, description, member_count |
| `squad_members` | Membership | squad_id, user_id, role |
| `squad_posts` | Posts in squads | squad_id, post_id |

### 3.6 Gamification Tables

| Table | Description | Key Fields |
|-------|-------------|------------|
| `achievements` | Unlockable badges | name, requirement_type, points_reward |
| `user_achievements` | Unlocked achievements | user_id, achievement_id |

---

## 4. User vs Creator

### User (Người dùng)
- **Định nghĩa**: Thành viên đăng ký trên platform
- **Actions**: Login, comment, vote, bookmark, follow creators, join squads
- **Gamification**: Earn points, level up, unlock achievements
- **Tables**: `users`, `user_profiles`, `user_levels`, `streaks`

### Creator (Nhà sáng tạo)
- **Định nghĩa**: External content sources (YouTubers, bloggers) được aggregate
- **Không login**: Chỉ là entities để attribute posts
- **Examples**: Scrapshut, Linus Tech Tips, Gamers Nexus
- **Tables**: `creators`, `creator_socials`

### Relationships
```
Users --follow--> Creators
Posts --attributed_to--> Creators
Users --interact_with--> Posts (vote, comment, bookmark)
```

---

## 5. Sample Data

### 5.1 Users (10)
| Username | Display Name | Level |
|----------|--------------|-------|
| admin | Admin GearVN | 10 |
| techguru | Tech Guru | 8 |
| gamerpro | Gamer Pro | 7 |
| pcbuilder | PC Builder | 6 |
| hardwarefan | Hardware Fan | 5 |
| reviewmaster | Review Master | 6 |
| newbie | Newbie | 2 |
| techenthusiast | Tech Enthusiast | 4 |
| veterangamer | Veteran Gamer | 7 |
| techexplorer | Tech Explorer | 1 |

### 5.2 Creators (5)
| Name | Platform | Followers | Verified |
|------|----------|-----------|----------|
| Scrapshut | YouTube | 150K | ✅ |
| Linus Tech Tips | YouTube | 15M | ✅ |
| Gamers Nexus | YouTube | 2M | ✅ |
| JayzTwoCents | YouTube | 3.5M | ✅ |
| Hardware Unboxed | YouTube | 1.8M | ✅ |

### 5.3 Tags (15)
Gaming, PC Build, Laptop, GPU, CPU, Mouse, Keyboard, Monitor, Storage, RAM, Cooling, Case, PSU, Audio, Tutorial

### 5.4 Products (10)
| Product | Brand | Price |
|---------|-------|-------|
| ASUS ROG Strix G15 | ASUS | 35,990,000đ |
| Logitech G Pro X Superlight | Logitech | 3,290,000đ |
| Razer BlackWidow V4 Pro | Razer | 5,990,000đ |
| NVIDIA RTX 4090 | NVIDIA | 45,990,000đ |
| AMD Ryzen 9 7950X | AMD | 15,990,000đ |
| Samsung 990 PRO 2TB | Samsung | 5,490,000đ |
| Corsair Dominator 32GB | Corsair | 4,290,000đ |
| LG UltraGear 27GN950 | LG | 12,990,000đ |
| NZXT Kraken X73 | NZXT | 4,990,000đ |
| HyperX Cloud Alpha Wireless | HyperX | 4,590,000đ |

### 5.5 Posts (10)
1. NVIDIA RTX 4090 Review (Linus Tech Tips)
2. Đánh giá ASUS ROG Strix G15 (Scrapshut)
3. Ultimate $3000 Gaming PC Build Guide (JayzTwoCents)
4. Logitech G Pro X Superlight Review (Hardware Unboxed)
5. AMD Ryzen 9 7950X vs Intel i9-13900K (Gamers Nexus)
6. LG UltraGear 27GN950 Review (Hardware Unboxed)
7. Custom Water Cooling Tutorial (JayzTwoCents)
8. Samsung 990 PRO Review (Linus Tech Tips)
9. Đánh giá Razer BlackWidow V4 Pro (Scrapshut)
10. HyperX Cloud Alpha Wireless Review (Gamers Nexus)

### 5.6 Squads (5)
- PC Master Race (156 members)
- Budget Builds (89 members)
- RGB Everything (234 members)
- Water Cooling Warriors (67 members)
- Laptop Gaming (178 members)

### 5.7 Achievements (7)
| Name | Requirement | Points |
|------|-------------|--------|
| First Steps | 1 comment | 10 |
| Conversation Starter | 10 comments | 50 |
| Bookworm | 5 bookmarks | 25 |
| Dedicated Reader | 50 post views | 100 |
| Community Builder | Join 3 squads | 75 |
| Streak Master | 7-day streak | 150 |
| Tech Influencer | Follow 5 creators | 50 |

---

## 6. Frontend Features

### 6.1 Pages
- **Home**: Post feed với filter Popular/Upvoted
- **Explore**: Discover new content
- **Bookmarks**: Saved posts
- **Following**: Posts from followed creators
- **My Profile**: User profile

### 6.2 Components
- `Header`: Search, notifications, user menu
- `Sidebar`: Navigation, trending tags, featured creators
- `PostCard`: Post preview with thumbnail, tags, engagement
- `DetailPage`: Full post view
- `CreatorProfile`: Creator info, posts, stats
- `LoginModal`: Auth modal

### 6.3 Features
- Dark theme UI
- Real-time data from Supabase
- Upvote/downvote system
- Bookmark posts
- Follow creators
- Comment system (nested replies)
- Tag filtering
- Search functionality

---

## 7. API (Supabase)

### src/lib/supabase.js

```javascript
// Posts
api.getPosts(filters)           // Get all posts
api.getPostBySlug(slug)         // Get single post

// Creators
api.getCreators()               // Get all creators
api.getCreatorBySlug(slug)      // Get single creator

// Tags
api.getTags()                   // Get all tags
api.getTagBySlug(slug)          // Get single tag

// Products
api.getProducts()               // Get all products

// Comments
api.getCommentsByPostId(postId) // Get comments for post

// Auth
api.signUp(email, password, username)
api.signIn(email, password)
api.signOut()
api.getCurrentUser()
```

---

## 8. Setup Instructions

### 8.1 Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### 8.2 Installation

```bash
# Clone repo
git clone https://github.com/duongthien408-create/gvn-news-blog.git
cd gvn-news-blog

# Install dependencies
npm install

# Create .env.local
echo "VITE_SUPABASE_URL=your-supabase-url" > .env.local
echo "VITE_SUPABASE_ANON_KEY=your-anon-key" >> .env.local

# Run dev server
npm run dev
```

### 8.3 Database Setup

1. Create Supabase project
2. Run schema: `database/02-new-complete-schema.sql`
3. Run seed files in order:
   - `01-users-profiles.sql`
   - `02-creators.sql`
   - `03-tags.sql`
   - `04-products.sql`
   - `05-posts.sql`
   - `06-comments.sql`
   - `07-interactions.sql`
   - `08-squads.sql`
   - `09-gamification.sql`
4. Verify: `00-verify-all.sql`

### 8.4 Reset Database

```sql
-- Run this to clean all data
database/00-clean-with-cascade.sql
```

---

## 9. Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key |

---

## 10. Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Set environment variables in Vercel dashboard.

---

## 11. Future Improvements

- [ ] Real-time notifications
- [ ] Image upload to Supabase Storage
- [ ] Full-text search
- [ ] RSS feed import
- [ ] Admin CMS dashboard
- [ ] Mobile responsive improvements
- [ ] PWA support
- [ ] Email notifications
- [ ] Social login (Google, Facebook)
- [ ] API rate limiting

---

## 12. Repository

**GitHub**: https://github.com/duongthien408-create/gvn-news-blog

**Live Demo**: http://localhost:5173 (development)

---

*Last updated: November 2025*
