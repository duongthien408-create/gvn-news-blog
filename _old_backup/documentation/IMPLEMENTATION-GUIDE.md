# 🛠️ HƯỚNG DẪN TRIỂN KHAI CHI TIẾT - GEARVN BLOGS

**Focus:** 3 Priorities quan trọng nhất để hoàn thành MVP

---

## 📋 MỤC LỤC

1. [Priority 1: Content Aggregation System](#priority-1-content-aggregation-system)
2. [Priority 2: Frontend-Backend Integration](#priority-2-frontend-backend-integration)
3. [Priority 3: Search & Filtering](#priority-3-search--filtering)
4. [Testing & Deployment](#testing--deployment)

---

## PRIORITY 1: CONTENT AGGREGATION SYSTEM

### 🎯 Mục tiêu
Xây dựng hệ thống tự động thu thập nội dung từ RSS feeds, lưu vào database, và hiển thị trên UI.

### ⏱️ Thời gian: 2-3 tuần

---

### Step 1: Thêm Sources Table (30 phút)

#### 1.1. Update Database Schema

Tạo file `backend/migrations/002_add_sources.sql`:

```sql
-- Bảng quản lý RSS sources
CREATE TABLE IF NOT EXISTS sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    url VARCHAR(2048) UNIQUE NOT NULL,
    type VARCHAR(20) DEFAULT 'rss', -- rss, atom
    category VARCHAR(100), -- tech, gaming, hardware, etc.
    active BOOLEAN DEFAULT true,
    fetch_interval INTEGER DEFAULT 30, -- phút
    last_fetched_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index để query nhanh
CREATE INDEX idx_sources_active ON sources(active);
CREATE INDEX idx_sources_category ON sources(category);

-- Update posts table để link với sources
ALTER TABLE posts ADD COLUMN IF NOT EXISTS source_id UUID REFERENCES sources(id);
ALTER TABLE posts ADD COLUMN IF NOT EXISTS external_url VARCHAR(2048);
ALTER TABLE posts ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

-- Index để prevent duplicate posts
CREATE UNIQUE INDEX idx_posts_external_url ON posts(external_url) WHERE external_url IS NOT NULL;
```

#### 1.2. Update Main.go để tạo bảng

```go
// backend/main.go

func setupDatabase() {
    // Existing tables...

    // Add sources table
    database.DB.Exec(`
        CREATE TABLE IF NOT EXISTS sources (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) NOT NULL,
            url VARCHAR(2048) UNIQUE NOT NULL,
            type VARCHAR(20) DEFAULT 'rss',
            category VARCHAR(100),
            active BOOLEAN DEFAULT true,
            fetch_interval INTEGER DEFAULT 30,
            last_fetched_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `)

    // Update posts table
    database.DB.Exec(`
        ALTER TABLE posts
        ADD COLUMN IF NOT EXISTS source_id UUID REFERENCES sources(id),
        ADD COLUMN IF NOT EXISTS external_url VARCHAR(2048),
        ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ
    `)
}
```

---

### Step 2: Tạo RSS Aggregator Service (2-3 ngày)

#### 2.1. Install gofeed library

```bash
cd backend
go get github.com/mmcdole/gofeed
```

#### 2.2. Tạo file `backend/aggregator.go`

```go
package main

import (
    "context"
    "log"
    "strings"
    "time"

    "github.com/google/uuid"
    "github.com/mmcdole/gofeed"
)

// Source model
type Source struct {
    ID             string    `json:"id"`
    Name           string    `json:"name"`
    URL            string    `json:"url"`
    Type           string    `json:"type"`
    Category       string    `json:"category"`
    Active         bool      `json:"active"`
    FetchInterval  int       `json:"fetch_interval"`
    LastFetchedAt  *time.Time `json:"last_fetched_at"`
    CreatedAt      time.Time `json:"created_at"`
    UpdatedAt      time.Time `json:"updated_at"`
}

// Content Aggregator
type Aggregator struct {
    parser *gofeed.Parser
}

func NewAggregator() *Aggregator {
    return &Aggregator{
        parser: gofeed.NewParser(),
    }
}

// Start aggregator service
func (a *Aggregator) Start() {
    log.Println("🚀 Starting Content Aggregator...")

    // Initial fetch
    a.FetchAll()

    // Run every 30 minutes
    ticker := time.NewTicker(30 * time.Minute)
    defer ticker.Stop()

    for range ticker.C {
        a.FetchAll()
    }
}

// Fetch all active sources
func (a *Aggregator) FetchAll() {
    log.Println("📡 Fetching content from all sources...")

    var sources []Source
    database.DB.Where("active = ?", true).Find(&sources)

    for _, source := range sources {
        go a.FetchSource(source) // Parallel fetching
    }
}

// Fetch single source
func (a *Aggregator) FetchSource(source Source) {
    log.Printf("📥 Fetching: %s (%s)", source.Name, source.URL)

    ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    defer cancel()

    feed, err := a.parser.ParseURLWithContext(source.URL, ctx)
    if err != nil {
        log.Printf("❌ Error fetching %s: %v", source.Name, err)
        return
    }

    newPostsCount := 0

    for _, item := range feed.Items {
        if a.CreatePostFromFeedItem(source, item) {
            newPostsCount++
        }
    }

    // Update last_fetched_at
    database.DB.Model(&Source{}).
        Where("id = ?", source.ID).
        Update("last_fetched_at", time.Now())

    log.Printf("✅ %s: %d new posts", source.Name, newPostsCount)
}

// Create post from feed item
func (a *Aggregator) CreatePostFromFeedItem(source Source, item *gofeed.Item) bool {
    // Check if post already exists
    var existingPost Post
    result := database.DB.Where("external_url = ?", item.Link).First(&existingPost)
    if result.RowsAffected > 0 {
        return false // Already exists
    }

    // Extract tags from categories
    tags := []string{}
    for _, cat := range item.Categories {
        tag := strings.ToLower(strings.TrimSpace(cat))
        if tag != "" {
            tags = append(tags, tag)
        }
    }

    // Add source category as tag
    if source.Category != "" {
        tags = append(tags, source.Category)
    }

    // Get published date
    publishedAt := time.Now()
    if item.PublishedParsed != nil {
        publishedAt = *item.PublishedParsed
    }

    // Get description/content
    description := item.Description
    if len(description) > 500 {
        description = description[:500] + "..."
    }

    // Get image
    imageURL := ""
    if item.Image != nil {
        imageURL = item.Image.URL
    } else if len(item.Enclosures) > 0 {
        imageURL = item.Enclosures[0].URL
    }

    // Create post
    post := Post{
        ID:          uuid.New().String(),
        SourceID:    &source.ID,
        Title:       item.Title,
        Description: description,
        ExternalURL: item.Link,
        ImageURL:    imageURL,
        Tags:        tags,
        PublishedAt: &publishedAt,
        Upvotes:     0,
        Comments:    0,
        Reads:       0,
        CreatedAt:   time.Now(),
        UpdatedAt:   time.Now(),
    }

    result = database.DB.Create(&post)
    return result.Error == nil
}

// Helper: Extract domain from URL
func extractDomain(url string) string {
    // Simple domain extraction
    parts := strings.Split(url, "//")
    if len(parts) > 1 {
        domain := strings.Split(parts[1], "/")[0]
        return strings.TrimPrefix(domain, "www.")
    }
    return url
}
```

#### 2.3. Update Post model

```go
// backend/handlers.go

type Post struct {
    ID          string     `json:"id" db:"id"`
    SourceID    *string    `json:"source_id" db:"source_id"`
    CreatorID   *string    `json:"creator_id" db:"creator_id"` // Keep for manual posts
    Title       string     `json:"title" db:"title"`
    Description string     `json:"description" db:"description"`
    Content     string     `json:"content" db:"content"`
    ImageURL    string     `json:"image_url" db:"image_url"`
    ExternalURL string     `json:"external_url" db:"external_url"` // NEW
    Tags        []string   `json:"tags" db:"tags"`
    Upvotes     int        `json:"upvotes" db:"upvotes"`
    Comments    int        `json:"comments" db:"comments"`
    Reads       int        `json:"reads" db:"reads"`
    PublishedAt *time.Time `json:"published_at" db:"published_at"` // NEW
    CreatedAt   time.Time  `json:"created_at" db:"created_at"`
    UpdatedAt   time.Time  `json:"updated_at" db:"updated_at"`
}
```

---

### Step 3: Seed RSS Sources (1 giờ)

#### 3.1. Tạo file `backend/seed_sources.go`

```go
package main

import (
    "log"
)

func seedSources() {
    log.Println("🌱 Seeding RSS sources...")

    sources := []Source{
        // Gaming News
        {
            Name:     "IGN Gaming",
            URL:      "http://feeds.ign.com/ign/games-all",
            Type:     "rss",
            Category: "gaming",
            Active:   true,
        },
        {
            Name:     "GameSpot",
            URL:      "https://www.gamespot.com/feeds/news/",
            Type:     "rss",
            Category: "gaming",
            Active:   true,
        },
        {
            Name:     "PC Gamer",
            URL:      "https://www.pcgamer.com/rss/",
            Type:     "rss",
            Category: "gaming",
            Active:   true,
        },

        // Hardware & Tech
        {
            Name:     "Tom's Hardware",
            URL:      "https://www.tomshardware.com/feeds/all",
            Type:     "rss",
            Category: "hardware",
            Active:   true,
        },
        {
            Name:     "AnandTech",
            URL:      "https://www.anandtech.com/rss/",
            Type:     "rss",
            Category: "hardware",
            Active:   true,
        },
        {
            Name:     "TechCrunch",
            URL:      "https://techcrunch.com/feed/",
            Type:     "rss",
            Category: "tech",
            Active:   true,
        },
        {
            Name:     "The Verge",
            URL:      "https://www.theverge.com/rss/index.xml",
            Type:     "rss",
            Category: "tech",
            Active:   true,
        },

        // Vietnamese Tech
        {
            Name:     "Genk",
            URL:      "https://genk.vn/rss/tech.rss",
            Type:     "rss",
            Category: "tech",
            Active:   true,
        },
        {
            Name:     "VnExpress Tech",
            URL:      "https://vnexpress.net/rss/so-hoa.rss",
            Type:     "rss",
            Category: "tech",
            Active:   true,
        },

        // Esports
        {
            Name:     "Dexerto",
            URL:      "https://www.dexerto.com/feed/",
            Type:     "rss",
            Category: "esports",
            Active:   true,
        },
    }

    for _, source := range sources {
        database.DB.FirstOrCreate(&source, Source{URL: source.URL})
    }

    log.Printf("✅ Seeded %d sources", len(sources))
}
```

#### 3.2. Update main.go để chạy aggregator

```go
// backend/main.go

func main() {
    // Load config
    loadConfig()

    // Connect database
    database.ConnectDB()
    setupDatabase()

    // Check if --seed flag
    if len(os.Args) > 1 && os.Args[1] == "--seed" {
        seedData()
        seedSources() // NEW
        return
    }

    // Check if --seed-sources flag
    if len(os.Args) > 1 && os.Args[1] == "--seed-sources" {
        seedSources()
        return
    }

    // Start aggregator in background
    aggregator := NewAggregator()
    go aggregator.Start()

    // Setup Fiber app
    app := fiber.New()
    setupRoutes(app)

    // Start server
    log.Fatal(app.Listen(":8080"))
}
```

---

### Step 4: Test Aggregator (1 giờ)

```bash
# Seed sources
cd backend
go run . --seed-sources

# Start server (aggregator sẽ tự chạy)
go run .

# Check logs
# Bạn sẽ thấy:
# 🚀 Starting Content Aggregator...
# 📡 Fetching content from all sources...
# 📥 Fetching: IGN Gaming (http://feeds.ign.com/ign/games-all)
# ✅ IGN Gaming: 15 new posts
```

---

## PRIORITY 2: FRONTEND-BACKEND INTEGRATION

### 🎯 Mục tiêu
Kết nối frontend với backend API, thay thế localStorage bằng database thật.

### ⏱️ Thời gian: 1-2 tuần

---

### Step 1: Tạo API Client (2-3 giờ)

#### 1.1. Tạo file `scripts/api-client.js`

```javascript
// Base API configuration
const API_CONFIG = {
    baseURL: 'http://localhost:8080/api',
    timeout: 10000,
};

class APIClient {
    constructor() {
        this.token = localStorage.getItem('authToken');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        localStorage.setItem('authToken', token);
    }

    // Set current user
    setUser(user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(user));
    }

    // Clear authentication
    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    }

    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${API_CONFIG.baseURL}${endpoint}`;

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
                timeout: API_CONFIG.timeout,
            });

            // Check if response is ok
            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || `HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    }

    // ============ AUTH ENDPOINTS ============

    async register(email, password, username) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, username }),
        });

        this.setToken(data.token);
        this.setUser(data.user);
        return data;
    }

    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        this.setToken(data.token);
        this.setUser(data.user);
        return data;
    }

    async getMe() {
        const user = await this.request('/auth/me');
        this.setUser(user);
        return user;
    }

    // ============ POSTS ENDPOINTS ============

    async getPosts(params = {}) {
        const query = new URLSearchParams(params);
        return await this.request(`/posts?${query}`);
    }

    async getPostById(id) {
        return await this.request(`/posts/${id}`);
    }

    // ============ BOOKMARKS ENDPOINTS ============

    async getBookmarks() {
        return await this.request('/user/bookmarks');
    }

    async addBookmark(postId) {
        return await this.request(`/user/bookmarks/${postId}`, {
            method: 'POST',
        });
    }

    async removeBookmark(postId) {
        return await this.request(`/user/bookmarks/${postId}`, {
            method: 'DELETE',
        });
    }

    // ============ FOLLOWING ENDPOINTS ============

    async getFollowing() {
        return await this.request('/user/following');
    }

    async followCreator(creatorId) {
        return await this.request(`/user/following/${creatorId}`, {
            method: 'POST',
        });
    }

    async unfollowCreator(creatorId) {
        return await this.request(`/user/following/${creatorId}`, {
            method: 'DELETE',
        });
    }

    // ============ UPVOTES ENDPOINTS ============

    async getUpvotes() {
        return await this.request('/user/upvotes');
    }

    async upvotePost(postId) {
        return await this.request(`/user/upvotes/${postId}`, {
            method: 'POST',
        });
    }

    async removeUpvote(postId) {
        return await this.request(`/user/upvotes/${postId}`, {
            method: 'DELETE',
        });
    }

    // ============ COMMENTS ENDPOINTS ============

    async getComments(postId) {
        return await this.request(`/posts/${postId}/comments`);
    }

    async addComment(postId, content, parentId = null) {
        return await this.request(`/posts/${postId}/comments`, {
            method: 'POST',
            body: JSON.stringify({ content, parent_id: parentId }),
        });
    }

    // ============ CREATORS ENDPOINTS ============

    async getCreators() {
        return await this.request('/creators');
    }

    async getCreatorById(id) {
        return await this.request(`/creators/${id}`);
    }

    async getCreatorPosts(id) {
        return await this.request(`/creators/${id}/posts`);
    }
}

// Export singleton instance
const api = new APIClient();
export default api;
```

---

### Step 2: Tạo Auth UI (1 ngày)

#### 2.1. Tạo file `login.html`

```html
<!DOCTYPE html>
<html lang="vi" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đăng nhập - GearVN Creator Hub</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#0D1117] text-gray-100">
    <div class="min-h-screen flex items-center justify-center px-4">
        <div class="max-w-md w-full">
            <!-- Logo -->
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-blue-500">GearVN Creator Hub</h1>
                <p class="text-gray-400 mt-2">Đăng nhập để tiếp tục</p>
            </div>

            <!-- Login Form -->
            <div class="bg-[#161B22] rounded-lg p-8 border border-gray-800">
                <form id="loginForm">
                    <!-- Email -->
                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            required
                            class="w-full px-4 py-2 bg-[#0D1117] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="your@email.com"
                        >
                    </div>

                    <!-- Password -->
                    <div class="mb-6">
                        <label class="block text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            required
                            class="w-full px-4 py-2 bg-[#0D1117] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="••••••••"
                        >
                    </div>

                    <!-- Error Message -->
                    <div id="errorMessage" class="hidden mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                    </div>

                    <!-- Submit Button -->
                    <button
                        type="submit"
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
                    >
                        Đăng nhập
                    </button>
                </form>

                <!-- Register Link -->
                <div class="mt-6 text-center text-sm">
                    <span class="text-gray-400">Chưa có tài khoản?</span>
                    <a href="register.html" class="text-blue-500 hover:underline ml-1">Đăng ký ngay</a>
                </div>
            </div>
        </div>
    </div>

    <script type="module">
        import api from './scripts/api-client.js';

        const form = document.getElementById('loginForm');
        const errorMessage = document.getElementById('errorMessage');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                await api.login(email, password);

                // Redirect to home
                window.location.href = 'index.html';
            } catch (error) {
                errorMessage.textContent = error.message;
                errorMessage.classList.remove('hidden');
            }
        });
    </script>
</body>
</html>
```

---

### Step 3: Update InteractionState để dùng API (2-3 giờ)

```javascript
// scripts/interactions.js (UPDATE)

import api from './api-client.js';

const InteractionState = {
    bookmarked: {},
    following: {},
    upvoted: {},
    initialized: false,

    async init() {
        if (this.initialized) return;

        try {
            // Check if user is logged in
            if (!api.token) {
                console.log('User not logged in');
                return;
            }

            // Fetch user data
            const [bookmarks, following, upvotes] = await Promise.all([
                api.getBookmarks(),
                api.getFollowing(),
                api.getUpvotes(),
            ]);

            // Convert arrays to objects for fast lookup
            this.bookmarked = bookmarks.reduce((acc, id) => {
                acc[id] = true;
                return acc;
            }, {});

            this.following = following.reduce((acc, id) => {
                acc[id] = true;
                return acc;
            }, {});

            this.upvoted = upvotes.reduce((acc, id) => {
                acc[id] = true;
                return acc;
            }, {});

            this.initialized = true;
            console.log('✅ InteractionState initialized');
        } catch (error) {
            console.error('Failed to initialize InteractionState:', error);
        }
    },

    // Bookmarks
    getBookmarked(postId) {
        return this.bookmarked[postId] || false;
    },

    async setBookmarked(postId, value) {
        try {
            if (value) {
                await api.addBookmark(postId);
            } else {
                await api.removeBookmark(postId);
            }

            this.bookmarked[postId] = value;
        } catch (error) {
            console.error('Bookmark error:', error);
            throw error;
        }
    },

    // Following
    getFollowing(creatorId) {
        return this.following[creatorId] || false;
    },

    async setFollowing(creatorId, value) {
        try {
            if (value) {
                await api.followCreator(creatorId);
            } else {
                await api.unfollowCreator(creatorId);
            }

            this.following[creatorId] = value;
        } catch (error) {
            console.error('Follow error:', error);
            throw error;
        }
    },

    // Upvotes
    getUpvoted(postId) {
        return this.upvoted[postId] || false;
    },

    async setUpvoted(postId, value) {
        try {
            if (value) {
                await api.upvotePost(postId);
            } else {
                await api.removeUpvote(postId);
            }

            this.upvoted[postId] = value;
        } catch (error) {
            console.error('Upvote error:', error);
            throw error;
        }
    },
};

// Auto initialize
InteractionState.init();

export default InteractionState;
```

---

### Step 4: Update Feed để dùng API data (1-2 giờ)

```javascript
// scripts/feed.js (UPDATE)

import api from './api-client.js';
import { renderFeed } from './render.js';

async function loadFeed() {
    try {
        // Show loading state
        document.getElementById('feed-root').innerHTML = `
            <div class="col-span-3 text-center py-20">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 mx-auto"></div>
                <p class="mt-4 text-gray-400">Đang tải...</p>
            </div>
        `;

        // Fetch posts from API
        const posts = await api.getPosts();

        // Render feed
        renderFeed(posts);
    } catch (error) {
        console.error('Failed to load feed:', error);

        // Show error state
        document.getElementById('feed-root').innerHTML = `
            <div class="col-span-3 text-center py-20">
                <p class="text-red-500 mb-4">❌ Không thể tải nội dung</p>
                <button onclick="location.reload()" class="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700">
                    Thử lại
                </button>
            </div>
        `;
    }
}

// Load on page load
loadFeed();
```

---

## PRIORITY 3: SEARCH & FILTERING

### 🎯 Mục tiêu
Cho phép người dùng tìm kiếm và lọc nội dung theo keywords, tags, và creators.

### ⏱️ Thời gian: 1 tuần

---

### Step 1: Backend Search Implementation (1-2 ngày)

#### 1.1. Add search endpoint

```go
// backend/handlers.go

// Search posts
func searchPosts(c *fiber.Ctx) error {
    query := c.Query("q")          // Search query
    tag := c.Query("tag")          // Filter by tag
    creatorID := c.Query("creator") // Filter by creator
    sortBy := c.Query("sort", "latest") // Sort: latest, popular, trending

    var posts []Post

    db := database.DB.Model(&Post{})

    // Full-text search
    if query != "" {
        db = db.Where(
            "to_tsvector('english', title || ' ' || description) @@ plainto_tsquery(?)",
            query,
        )
    }

    // Filter by tag
    if tag != "" {
        db = db.Where("? = ANY(tags)", tag)
    }

    // Filter by creator
    if creatorID != "" {
        db = db.Where("creator_id = ? OR source_id IN (SELECT id FROM sources WHERE creator_id = ?)",
            creatorID, creatorID)
    }

    // Sort
    switch sortBy {
    case "popular":
        db = db.Order("upvotes DESC, reads DESC")
    case "trending":
        // Simple trending: recent + popular
        db = db.Where("created_at > ?", time.Now().Add(-7*24*time.Hour)).
            Order("upvotes DESC")
    default: // latest
        db = db.Order("created_at DESC")
    }

    // Execute query
    db.Limit(50).Find(&posts)

    return c.JSON(posts)
}

// Get all unique tags
func getAllTags(c *fiber.Ctx) error {
    var tags []string

    database.DB.Raw(`
        SELECT DISTINCT unnest(tags) as tag
        FROM posts
        ORDER BY tag
    `).Scan(&tags)

    return c.JSON(tags)
}

// Update routes in main.go
func setupRoutes(app *fiber.App) {
    api := app.Group("/api")

    // Search
    api.Get("/search", searchPosts)
    api.Get("/tags", getAllTags)

    // ... existing routes
}
```

---

### Step 2: Frontend Search UI (1 ngày)

#### 2.1. Update Header với Search Bar

```javascript
// scripts/search.js

import api from './api-client.js';
import { renderFeed } from './render.js';

class SearchManager {
    constructor() {
        this.debounceTimer = null;
        this.currentQuery = '';
        this.currentFilters = {
            tag: null,
            creator: null,
            sort: 'latest',
        };
    }

    init() {
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.debounceSearch(e.target.value);
            });
        }

        if (searchButton) {
            searchButton.addEventListener('click', () => {
                this.search(searchInput.value);
            });
        }
    }

    debounceSearch(query) {
        clearTimeout(this.debounceTimer);

        this.debounceTimer = setTimeout(() => {
            this.search(query);
        }, 500); // Wait 500ms after user stops typing
    }

    async search(query) {
        this.currentQuery = query;

        try {
            const posts = await api.request('/search', {
                method: 'GET',
                params: {
                    q: query,
                    ...this.currentFilters,
                },
            });

            renderFeed(posts);
        } catch (error) {
            console.error('Search error:', error);
        }
    }

    async filterByTag(tag) {
        this.currentFilters.tag = tag;
        await this.search(this.currentQuery);
    }

    async sortBy(sortType) {
        this.currentFilters.sort = sortType;
        await this.search(this.currentQuery);
    }
}

const searchManager = new SearchManager();
export default searchManager;
```

#### 2.2. Update index.html header

```html
<!-- In index.html -->
<header class="sticky top-0 z-40 bg-[#0D1117] border-b border-gray-800">
    <div class="flex items-center justify-between px-6 py-4">
        <!-- Logo -->
        <h1 class="text-xl font-bold text-blue-500">GearVN</h1>

        <!-- Search Bar -->
        <div class="flex-1 max-w-2xl mx-8">
            <div class="relative">
                <input
                    type="text"
                    id="searchInput"
                    placeholder="Tìm kiếm bài viết..."
                    class="w-full px-4 py-2 pl-10 bg-[#161B22] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <i data-lucide="search" class="absolute left-3 top-2.5 w-5 h-5 text-gray-400"></i>
            </div>
        </div>

        <!-- User menu -->
        <div id="userMenu">
            <!-- Will be populated by JS -->
        </div>
    </div>
</header>

<script type="module">
    import searchManager from './scripts/search.js';
    searchManager.init();
</script>
```

---

### Step 3: Feed Filters (1 ngày)

```html
<!-- In index.html, add filter tabs -->
<section class="mb-6">
    <div class="flex items-center justify-between border-b border-gray-800">
        <!-- Feed Tabs -->
        <div class="flex gap-2" id="feedTabs">
            <button class="feed-tab active px-4 py-2 font-medium border-b-2 border-blue-500 text-blue-500" data-feed="my">
                For You
            </button>
            <button class="feed-tab px-4 py-2 font-medium text-gray-400 hover:text-gray-100" data-feed="popular">
                Popular
            </button>
            <button class="feed-tab px-4 py-2 font-medium text-gray-400 hover:text-gray-100" data-feed="latest">
                Latest
            </button>
            <button class="feed-tab px-4 py-2 font-medium text-gray-400 hover:text-gray-100" data-feed="trending">
                Trending
            </button>
        </div>

        <!-- Filter Dropdown -->
        <div class="relative">
            <button id="filterButton" class="px-4 py-2 text-sm text-gray-400 hover:text-gray-100">
                <i data-lucide="filter" class="inline w-4 h-4 mr-1"></i>
                Filters
            </button>
        </div>
    </div>
</section>

<script type="module">
    import api from './scripts/api-client.js';
    import { renderFeed } from './scripts/render.js';

    // Handle feed tabs
    document.querySelectorAll('.feed-tab').forEach(tab => {
        tab.addEventListener('click', async (e) => {
            const feedType = e.target.dataset.feed;

            // Update active state
            document.querySelectorAll('.feed-tab').forEach(t => {
                t.classList.remove('active', 'border-blue-500', 'text-blue-500');
                t.classList.add('text-gray-400');
            });

            e.target.classList.add('active', 'border-blue-500', 'text-blue-500');
            e.target.classList.remove('text-gray-400');

            // Load feed
            const posts = await api.getPosts({ sort: feedType });
            renderFeed(posts);
        });
    });
</script>
```

---

## TESTING & DEPLOYMENT

### 🧪 Testing Checklist

#### Backend Testing
```bash
# Test aggregator
curl http://localhost:8080/api/posts

# Test search
curl "http://localhost:8080/api/search?q=gaming"

# Test filters
curl "http://localhost:8080/api/search?tag=tech&sort=popular"

# Test auth
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gearvn.com","password":"admin123"}'
```

#### Frontend Testing
- [ ] Feed loads with real data
- [ ] Search works with debounce
- [ ] Filter by tags works
- [ ] Login/Register works
- [ ] Bookmarks sync with backend
- [ ] Following sync with backend
- [ ] Upvotes sync with backend
- [ ] Comments work
- [ ] Mobile responsive

---

### 🚀 Deployment

#### Deploy Backend (Railway)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize
railway init

# Add environment variables
railway variables set DATABASE_URL="your-supabase-url"
railway variables set JWT_SECRET="your-secret"

# Deploy
railway up
```

#### Deploy Frontend (Vercel/Netlify)
```bash
# Update API_CONFIG in api-client.js
const API_CONFIG = {
    baseURL: 'https://your-backend.railway.app/api',
};

# Deploy to Vercel
vercel

# Or deploy to Netlify
netlify deploy
```

---

## 📊 PROGRESS TRACKER

### Week 1-2: Content Aggregation
- [ ] Sources table created
- [ ] Aggregator service implemented
- [ ] RSS sources seeded
- [ ] Posts fetching automatically
- [ ] Deduplication working

### Week 3: Frontend Integration
- [ ] API client created
- [ ] Auth UI completed
- [ ] InteractionState uses API
- [ ] Feed loads from API
- [ ] All interactions work

### Week 4: Search & Filtering
- [ ] Search endpoint implemented
- [ ] Search UI working
- [ ] Tag filtering working
- [ ] Multiple feed types working
- [ ] Sort options working

### Week 5: Polish & Deploy
- [ ] All features tested
- [ ] Bug fixes completed
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Production testing done

---

**🎉 Sau khi hoàn thành, bạn sẽ có một MVP đầy đủ tính năng, sẵn sàng cho người dùng thật!**

---

**Made with ❤️ by AI Assistant - Nov 5, 2025**
