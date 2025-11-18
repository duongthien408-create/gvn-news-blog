# 🔄 Database Migration Plan - Schema v1 → v2

## 📊 Tổng quan thay đổi

### Schema cũ (v1)
- 11 bảng
- Companies-centric (for businesses)
- Basic features only
- Hashtags as arrays
- Simple voting system

### Schema mới (v2)
- 25+ bảng
- Creators-centric (for content creators)
- Gamification system đầy đủ
- Products integration (GearVN)
- Community features (Squads)
- Advanced analytics

---

## 🔄 Mapping Changes

### 1. **users** table
| Old Schema (v1) | New Schema (v2) | Changes |
|-----------------|-----------------|---------|
| `id` (VARCHAR) | `id` (UUID) | ⚠️ **BREAKING**: Type changed |
| `email` | `email` | ✅ Same |
| `password_hash` | `password_hash` | ✅ Same |
| `username` | `username` | ✅ Same |
| `full_name` | → `user_profiles.display_name` | ⚠️ **MOVED** |
| `avatar_url` | → `user_profiles.avatar_url` | ⚠️ **MOVED** |
| `bio` | → `user_profiles.bio` | ⚠️ **MOVED** |
| `location` | → `user_profiles.location` | ⚠️ **MOVED** |
| `website` | → `user_profiles.website` | ⚠️ **MOVED** |
| Social URLs | ❌ **REMOVED** | Not needed for users |
| `role` | `role` | ✅ Same |
| `is_verified` | → `email_verified_at` | ⚠️ **CHANGED** |
| `company_id` | ❌ **REMOVED** | No more companies |
| NEW: - | `user_preferences` table | ✅ **NEW** |
| NEW: - | `user_levels` table | ✅ **NEW** |
| NEW: - | `streaks` table | ✅ **NEW** |

### 2. **companies** → **creators**
| Old: companies | New: creators | Changes |
|----------------|---------------|---------|
| `id` (SERIAL) | `id` (UUID) | ⚠️ **BREAKING**: Type changed |
| `name` | `name` | ✅ Same |
| `slug` | `slug` | ✅ Same |
| `logo_url` | `avatar_url` | ⚠️ **RENAMED** |
| `cover_image_url` | ❌ **REMOVED** | |
| `description` | `bio` | ⚠️ **RENAMED** |
| `tagline` | ❌ **REMOVED** | |
| `website` | `website` | ✅ Same |
| `email`, `phone`, `address` | ❌ **REMOVED** | |
| Social URLs | → `creator_socials` table | ⚠️ **MOVED** |
| `industry`, `company_size` | ❌ **REMOVED** | |
| `is_verified` | `verified` | ⚠️ **RENAMED** |
| `followers_count` | `total_followers` | ⚠️ **RENAMED** |
| `posts_count` | `total_posts` | ⚠️ **RENAMED** |

### 3. **posts** table
| Old Schema | New Schema | Changes |
|------------|------------|---------|
| `id` (VARCHAR) | `id` (UUID) | ⚠️ **BREAKING**: Type changed |
| `title` | `title` | ✅ Same |
| `excerpt` | `description` | ⚠️ **RENAMED** |
| `content` | `content` | ✅ Same |
| `cover_image` | `thumbnail_url` | ⚠️ **RENAMED** |
| `creator_id` (VARCHAR) | ❌ **REMOVED** | Now in `post_creators` |
| `creator_name` | ❌ **REMOVED** | Get from creators |
| `creator_avatar` | ❌ **REMOVED** | Get from creators |
| `source_id` (INTEGER) | `source_id` (UUID) | ⚠️ **BREAKING** |
| `external_url` | `external_url` | ✅ Same |
| `category` (VARCHAR) | ❌ **REMOVED** | Use tags instead |
| `tags` (TEXT[]) | → `post_tags` junction | ⚠️ **CHANGED** |
| `upvotes` (INTEGER) | `upvote_count` | ⚠️ **RENAMED** |
| NEW: - | `downvote_count` | ✅ **NEW** |
| `comments_count` | `comment_count` | ⚠️ **RENAMED** |
| NEW: - | `bookmark_count` | ✅ **NEW** |
| NEW: - | `view_count` | ✅ **NEW** |
| `read_time` | `read_time_minutes` | ⚠️ **CHANGED** |
| `published` (BOOLEAN) | `status` (ENUM) | ⚠️ **CHANGED** |
| NEW: - | `featured` | ✅ **NEW** |
| Video fields | Video fields | ✅ Keep but move to `post_media` |

### 4. **hashtags** → **tags**
| Old | New | Changes |
|-----|-----|---------|
| `hashtags` table | `tags` table | ⚠️ **RENAMED** |
| Posts have TEXT[] | `post_tags` junction table | ⚠️ **BREAKING** |

### 5. **user_upvotes** → **votes**
| Old | New | Changes |
|-----|-----|---------|
| `user_upvotes` (upvote only) | `votes` (upvote + downvote) | ⚠️ **ENHANCED** |
| No vote_type field | `vote_type` (1 or -1) | ✅ **NEW** |

### 6. **follows** system
| Old | New | Changes |
|-----|-----|---------|
| `user_followers` (separate) | `follows` (unified) | ⚠️ **MERGED** |
| `company_followers` (separate) | `follows` (unified) | ⚠️ **MERGED** |
| - | Polymorphic: `followee_id` OR `creator_id` | ✅ **NEW** |

---

## ✅ NEW Tables (Not in old schema)

1. **user_profiles** - Extended user information
2. **user_preferences** - User settings (theme, language, notifications)
3. **creator_socials** - Social media links for creators
4. **post_media** - Media files for posts
5. **post_creators** - Many-to-many: posts ↔ creators
6. **post_tags** - Many-to-many: posts ↔ tags
7. **post_products** - Many-to-many: posts ↔ products
8. **product_categories** - Product categories
9. **brands** - Product brands
10. **products** - GearVN products
11. **comment_votes** - Votes for comments
12. **views** - Analytics tracking
13. **squads** - Communities
14. **squad_members** - Community members
15. **squad_posts** - Posts in communities
16. **streaks** - User activity streaks
17. **achievements** - Available achievements
18. **user_achievements** - User earned achievements
19. **user_levels** - User levels and points
20. **user_points** - Points history
21. **notifications** - User notifications

---

## 🚨 BREAKING CHANGES

### 1. **UUID vs VARCHAR/SERIAL**
```sql
-- Old
users.id: VARCHAR(255)
companies.id: SERIAL (INTEGER)
posts.id: VARCHAR(255)

-- New
users.id: UUID
creators.id: UUID
posts.id: UUID
sources.id: UUID
```

**Impact:**
- ⚠️ All foreign keys must be updated
- ⚠️ Frontend code using string IDs needs update
- ⚠️ API responses will have different ID format

### 2. **companies → creators**
```sql
-- Old
companies table (business-focused)

-- New
creators table (content creator-focused)
```

**Impact:**
- ⚠️ All company references must migrate to creators
- ⚠️ Frontend "company" pages → "creator" pages
- ⚠️ API endpoints change: `/companies` → `/creators`

### 3. **Tags as array → Junction table**
```sql
-- Old
posts.tags: TEXT[] (PostgreSQL array)

-- New
tags table + post_tags junction table
```

**Impact:**
- ⚠️ Tag queries completely different
- ⚠️ Need to create tags first, then link via post_tags
- ⚠️ Frontend tag handling logic must change

### 4. **Voting system**
```sql
-- Old
user_upvotes (upvote only)
posts.upvotes (count)

-- New
votes (upvote + downvote)
posts.upvote_count + posts.downvote_count
```

**Impact:**
- ⚠️ Need separate upvote_count and downvote_count
- ⚠️ vote_type: 1 (upvote) or -1 (downvote)
- ⚠️ Frontend voting UI can show both

### 5. **User data split**
```sql
-- Old
users table (all in one)

-- New
users + user_profiles + user_preferences + user_levels + streaks
```

**Impact:**
- ⚠️ JOIN required to get full user data
- ⚠️ Auto-created via trigger when user signs up

---

## 📋 Migration Steps

### Phase 1: Preparation (1-2 hours)
1. ✅ Backup existing database
2. ✅ Document current data structure
3. ✅ Create migration scripts
4. ✅ Test on development database

### Phase 2: Backend Updates (4-6 hours)
1. ⚠️ Update Go models (handlers.go)
2. ⚠️ Update database queries
3. ⚠️ Update API endpoints
4. ⚠️ Add new endpoints for:
   - Creators (instead of companies)
   - Tags (instead of hashtags)
   - Products
   - Squads
   - Gamification (levels, achievements, points)
   - Notifications

### Phase 3: Frontend Updates (6-8 hours)
1. ⚠️ Update JavaScript types/interfaces
2. ⚠️ Update api-client.js
3. ⚠️ Update all HTML pages:
   - company.html → creator.html
   - Update feed rendering
   - Update tag handling
   - Update voting UI (show up/down)
4. ⚠️ Add new pages:
   - Products page
   - Squads page
   - Achievements page

### Phase 4: Testing (2-3 hours)
1. ✅ Test all API endpoints
2. ✅ Test all UI flows
3. ✅ Test data integrity
4. ✅ Performance testing

---

## 🎯 Code Changes Required

### Backend (Go)

#### 1. Update models in `handlers.go`
```go
// OLD
type Post struct {
    ID            string    `json:"id"` // VARCHAR
    CreatorID     *string   `json:"creator_id"`
    Tags          pq.StringArray `json:"tags"` // Array
    Upvotes       int       `json:"upvotes"`
}

// NEW
type Post struct {
    ID              string    `json:"id"` // UUID
    SourceID        *string   `json:"source_id"` // UUID
    Type            string    `json:"type"`
    Title           string    `json:"title"`
    Slug            string    `json:"slug"`
    Description     *string   `json:"description"`
    Content         *string   `json:"content"`
    ExternalURL     *string   `json:"external_url"`
    ThumbnailURL    *string   `json:"thumbnail_url"`
    PublishedAt     *time.Time `json:"published_at"`
    ReadTimeMinutes *int      `json:"read_time_minutes"`
    WatchTimeMinutes *int     `json:"watch_time_minutes"`
    ViewCount       int       `json:"view_count"`
    UpvoteCount     int       `json:"upvote_count"`
    DownvoteCount   int       `json:"downvote_count"`
    CommentCount    int       `json:"comment_count"`
    BookmarkCount   int       `json:"bookmark_count"`
    Status          string    `json:"status"`
    Featured        bool      `json:"featured"`
    CreatedAt       time.Time `json:"created_at"`
    UpdatedAt       time.Time `json:"updated_at"`

    // Relationships (populated via JOIN)
    Creators        []Creator `json:"creators,omitempty"`
    Tags            []Tag     `json:"tags,omitempty"`
    Products        []Product `json:"products,omitempty"`
}

type Creator struct {
    ID            string    `json:"id"` // UUID
    Name          string    `json:"name"`
    Slug          string    `json:"slug"`
    AvatarURL     *string   `json:"avatar_url"`
    Bio           *string   `json:"bio"`
    Website       *string   `json:"website"`
    Verified      bool      `json:"verified"`
    TotalFollowers int      `json:"total_followers"`
    TotalPosts    int       `json:"total_posts"`
    CreatedAt     time.Time `json:"created_at"`
    UpdatedAt     time.Time `json:"updated_at"`

    Socials       []CreatorSocial `json:"socials,omitempty"`
}

type Tag struct {
    ID          string    `json:"id"` // UUID
    Name        string    `json:"name"`
    Slug        string    `json:"slug"`
    Description *string   `json:"description"`
    IconName    *string   `json:"icon_name"`
    PostCount   int       `json:"post_count"`
}

type Product struct {
    ID          string    `json:"id"` // UUID
    CategoryID  *string   `json:"category_id"`
    BrandID     *string   `json:"brand_id"`
    Name        string    `json:"name"`
    Slug        string    `json:"slug"`
    SKU         *string   `json:"sku"`
    Price       *float64  `json:"price"`
    ImageURL    *string   `json:"image_url"`
    GearvnURL   *string   `json:"gearvn_url"`
    Status      string    `json:"status"`
}

type Squad struct {
    ID          string    `json:"id"`
    Name        string    `json:"name"`
    Slug        string    `json:"slug"`
    Description *string   `json:"description"`
    AvatarURL   *string   `json:"avatar_url"`
    CoverURL    *string   `json:"cover_url"`
    Type        string    `json:"type"`
    CreatorID   string    `json:"creator_id"`
    MemberCount int       `json:"member_count"`
    PostCount   int       `json:"post_count"`
}
```

#### 2. Update queries
```go
// OLD
func getPosts(c *fiber.Ctx) error {
    rows, err := db.Query(`
        SELECT id, title, creator_id, tags, upvotes
        FROM posts
        WHERE published = true
    `)
}

// NEW
func getPosts(c *fiber.Ctx) error {
    rows, err := db.Query(`
        SELECT
            p.id, p.title, p.slug, p.description, p.thumbnail_url,
            p.upvote_count, p.downvote_count, p.comment_count,
            p.view_count, p.bookmark_count, p.featured, p.published_at,

            -- Get creators via JOIN
            COALESCE(
                json_agg(
                    DISTINCT jsonb_build_object(
                        'id', c.id,
                        'name', c.name,
                        'slug', c.slug,
                        'avatar_url', c.avatar_url,
                        'verified', c.verified
                    )
                ) FILTER (WHERE c.id IS NOT NULL),
                '[]'
            ) as creators,

            -- Get tags via JOIN
            COALESCE(
                json_agg(
                    DISTINCT jsonb_build_object(
                        'id', t.id,
                        'name', t.name,
                        'slug', t.slug
                    )
                ) FILTER (WHERE t.id IS NOT NULL),
                '[]'
            ) as tags

        FROM posts p
        LEFT JOIN post_creators pc ON p.id = pc.post_id
        LEFT JOIN creators c ON pc.creator_id = c.id
        LEFT JOIN post_tags pt ON p.id = pt.post_id
        LEFT JOIN tags t ON pt.tag_id = t.id
        WHERE p.status = 'published'
        GROUP BY p.id
        ORDER BY p.published_at DESC
        LIMIT 50
    `)
}
```

### Frontend (JavaScript)

#### 1. Update `scripts/api-client.js`
```javascript
// OLD
const API_BASE = 'http://localhost:8080/api';

async function getPosts() {
    const response = await fetch(`${API_BASE}/posts`);
    return response.json();
}

// NEW - Add more endpoints
const apiClient = {
    // Posts
    getPosts: async (params = {}) => {
        const query = new URLSearchParams(params);
        const response = await fetch(`${API_BASE}/posts?${query}`);
        return response.json();
    },

    // Creators (instead of companies)
    getCreators: async () => {
        const response = await fetch(`${API_BASE}/creators`);
        return response.json();
    },

    getCreator: async (slug) => {
        const response = await fetch(`${API_BASE}/creators/${slug}`);
        return response.json();
    },

    // Tags (instead of hashtags)
    getTags: async () => {
        const response = await fetch(`${API_BASE}/tags`);
        return response.json();
    },

    // Products
    getProducts: async () => {
        const response = await fetch(`${API_BASE}/products`);
        return response.json();
    },

    // Squads
    getSquads: async () => {
        const response = await fetch(`${API_BASE}/squads`);
        return response.json();
    },

    // Gamification
    getUserLevel: async (userId) => {
        const response = await fetch(`${API_BASE}/users/${userId}/level`);
        return response.json();
    },

    getAchievements: async () => {
        const response = await fetch(`${API_BASE}/achievements`);
        return response.json();
    },

    // Voting (with up/down)
    vote: async (postId, voteType) => {
        // voteType: 1 (upvote) or -1 (downvote)
        const response = await fetch(`${API_BASE}/posts/${postId}/vote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vote_type: voteType })
        });
        return response.json();
    }
};
```

#### 2. Update UI rendering
```javascript
// OLD - in feed.js
function renderPost(post) {
    return `
        <div class="post-card">
            <h3>${post.title}</h3>
            <div class="creator">${post.creator_name}</div>
            <div class="upvotes">${post.upvotes}</div>
        </div>
    `;
}

// NEW
function renderPost(post) {
    return `
        <div class="post-card">
            <h3>${post.title}</h3>

            <!-- Creators (can be multiple) -->
            <div class="creators">
                ${post.creators.map(c => `
                    <a href="/creator.html?slug=${c.slug}">
                        <img src="${c.avatar_url}" alt="${c.name}">
                        ${c.name}
                        ${c.verified ? '<svg>verified icon</svg>' : ''}
                    </a>
                `).join('')}
            </div>

            <!-- Tags -->
            <div class="tags">
                ${post.tags.map(t => `
                    <a href="/tags.html?tag=${t.slug}">#${t.name}</a>
                `).join('')}
            </div>

            <!-- Voting (up/down) -->
            <div class="voting">
                <button onclick="vote('${post.id}', 1)">
                    ▲ ${post.upvote_count}
                </button>
                <button onclick="vote('${post.id}', -1)">
                    ▼ ${post.downvote_count}
                </button>
            </div>

            <!-- Stats -->
            <div class="stats">
                <span>${post.view_count} views</span>
                <span>${post.comment_count} comments</span>
                <span>${post.bookmark_count} bookmarks</span>
            </div>
        </div>
    `;
}
```

---

## 🎯 NEXT STEPS

Bạn muốn tôi làm gì tiếp theo:

1. **Tạo migration script** để migrate data từ schema cũ sang mới?
2. **Cập nhật Go backend** với models và handlers mới?
3. **Cập nhật JavaScript frontend** với API client và UI mới?
4. **Tạo file README chi tiết** cho từng module cần update?

Tôi khuyến nghị làm theo thứ tự:
1. ✅ Chạy schema mới trên Supabase (database mới sạch)
2. ✅ Update Go backend models + handlers
3. ✅ Update JavaScript API client
4. ✅ Update UI pages từng cái một
5. ✅ Test và fix bugs

Bạn muốn bắt đầu từ đâu?
