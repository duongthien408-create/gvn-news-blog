# 🎨 Frontend Update Guide - Database v2.0

## 📋 Overview

Backend đã hoàn thành 100% với 50+ API endpoints mới. Giờ cần cập nhật frontend để hoạt động với backend mới.

---

## 🔄 Breaking Changes

### 1. API Endpoints Changed

#### Old vs New Routes:

**Authentication:**
```
OLD: POST /api/auth/register
NEW: POST /api/register

OLD: POST /api/auth/login
NEW: POST /api/login

OLD: GET /api/auth/me
NEW: GET /api/me

NEW: PUT /api/me (update profile)
```

**Posts:**
```
OLD: GET /api/posts (simple)
NEW: GET /api/posts (with creators[], tags[], products[])

OLD: GET /api/posts/:id
NEW: GET /api/posts/:slug (changed from ID to slug!)

OLD: POST /api/user/upvotes/:postId
NEW: POST /api/posts/:id/vote (with vote_type: 1 or -1)

OLD: GET /api/user/upvotes (returns array of post IDs)
NEW: GET /api/posts/:id/vote (returns user's vote)

OLD: POST /api/user/bookmarks/:postId
NEW: POST /api/posts/:id/bookmark (toggle)

OLD: GET /api/user/bookmarks (returns array of post IDs)
NEW: GET /api/bookmarks (returns full posts with details)
```

**Creators:**
```
OLD: GET /api/creators/:id
NEW: GET /api/creators/:slug (changed to slug!)

OLD: GET /api/creators/:id/posts
NEW: Included in GET /api/creators/:slug

OLD: POST /api/user/following/:creatorId
NEW: POST /api/creators/:id/follow (toggle)

OLD: GET /api/user/following
NEW: GET /api/following/creators (returns creator objects)

NEW: GET /api/creators/:id/followers
```

**Comments:**
```
OLD: GET /api/posts/:id/comments (flat list)
NEW: GET /api/posts/:id/comments (nested tree structure)

OLD: POST /api/posts/:id/comments
NEW: Same, but supports parent_id for replies

NEW: POST /api/comments/:id/vote (vote on comments)
NEW: PUT /api/comments/:id (edit comment)
NEW: DELETE /api/comments/:id (delete comment)
```

### 2. Data Structure Changes

#### Post Object:
```javascript
// OLD
{
  id: "varchar",
  title: "...",
  excerpt: "...",
  content: "...",
  cover_image: "...",
  creator_id: "varchar",
  creator_name: "string",
  creator_avatar: "string",
  tags: ["tag1", "tag2"], // Array of strings
  upvotes: 10,
  comments_count: 5
}

// NEW
{
  id: "uuid",
  title: "...",
  slug: "post-slug",
  description: "...",
  content: "...",
  thumbnail_url: "...",

  // Creators array (many-to-many)
  creators: [
    {
      id: "uuid",
      name: "Creator Name",
      slug: "creator-slug",
      avatar_url: "...",
      verified: true
    }
  ],

  // Tags array with objects (junction table)
  tags: [
    {
      id: "uuid",
      name: "Gaming",
      slug: "gaming",
      icon_name: "gamepad"
    }
  ],

  // Products mentioned (new!)
  products: [
    {
      id: "uuid",
      name: "RTX 4090",
      slug: "rtx-4090",
      price: 45000000,
      brand: {...}
    }
  ],

  // Vote counts (separate upvote/downvote)
  upvote_count: 10,
  downvote_count: 2,
  comment_count: 5,
  view_count: 100,

  published_at: "2024-01-01T00:00:00Z",
  featured: true
}
```

#### Creator Object:
```javascript
// OLD
{
  id: "varchar",
  name: "...",
  initials: "AB",
  avatar: "...",
  banner: "...",
  bio: "...",
  tags: ["tag1"], // Array
  followers: 1000,
  following: 50,
  similar_creators: ["id1", "id2"]
}

// NEW
{
  id: "uuid",
  name: "...",
  slug: "creator-slug",
  avatar_url: "...",
  bio: "...",
  website: "...",
  verified: true,
  total_followers: 1000,
  total_posts: 50,

  // Social media array
  socials: [
    {
      platform: "youtube",
      url: "...",
      follower_count: 100000
    }
  ],

  // Posts included when fetching single creator
  posts: [...]
}
```

#### Comment Object:
```javascript
// OLD (flat)
{
  id: 1,
  post_id: "...",
  user_id: 1,
  content: "...",
  parent_id: null,
  created_at: "..."
}

// NEW (nested tree)
{
  id: "uuid",
  post_id: "uuid",
  user_id: "uuid",
  content: "...",
  parent_id: "uuid",

  upvote_count: 5,
  downvote_count: 1,
  status: "active",

  // User info
  user: {
    id: "uuid",
    username: "...",
    display_name: "...",
    avatar_url: "..."
  },

  // Nested replies
  replies: [
    {
      id: "...",
      content: "...",
      user: {...},
      replies: []
    }
  ],

  created_at: "...",
  updated_at: "..."
}
```

---

## 📝 Files to Update

### Priority 1: Core API Client
- ✅ **scripts/api-client.js** - Update all API methods

### Priority 2: Rendering
- ⬜ **scripts/render.js** - Update rendering logic for new data structure
- ⬜ **scripts/feed.js** - Update feed loading
- ⬜ **scripts/detail.js** - Update post detail page

### Priority 3: Interactions
- ⬜ **scripts/interactions.js** - Update voting, bookmarks
- ⬜ **scripts/bookmarks.js** - Update bookmarks page
- ⬜ **scripts/following.js** - Update following page

### Priority 4: Pages
- ⬜ **scripts/company.js** → Rename to **scripts/creator.js**
- ⬜ **company.html** → Rename to **creator.html**
- ⬜ **scripts/auth.js** - Update auth endpoints
- ⬜ **scripts/profile.js** - Update profile page

### Priority 5: New Features
- ⬜ Create **scripts/tags.js** - Tags page
- ⬜ Create **scripts/products.js** - Products page
- ⬜ Create **scripts/squads.js** - Communities page
- ⬜ Create **scripts/gamification.js** - Leaderboard, achievements

---

## 🔧 Update Plan

### Step 1: Update API Client ✅ (In Progress)

File: `scripts/api-client.js`

**Changes:**
1. Update base URL endpoints
2. Add new methods for voting (up/down)
3. Add methods for tags, products, squads, gamification
4. Handle slug-based routing
5. Update data transformations

### Step 2: Update Rendering

File: `scripts/render.js`

**Changes:**
1. `renderPost()` - Handle multiple creators, new tag structure
2. `renderCreator()` - Use new creator object structure
3. `renderComment()` - Handle nested comment tree
4. Add `renderTag()`, `renderProduct()`, `renderSquad()`

### Step 3: Update Feed

File: `scripts/feed.js`

**Changes:**
1. Update API calls to use new endpoints
2. Handle new post structure with creators array
3. Update filtering logic for tags/creators

### Step 4: Update Detail Page

File: `scripts/detail.js`

**Changes:**
1. Use slug instead of ID
2. Fetch post by slug
3. Render nested comments
4. Show vote counts (up/down separately)

### Step 5: Update Interactions

File: `scripts/interactions.js`

**Changes:**
1. Update voting to use vote_type (1 or -1)
2. Update bookmarks to use new endpoint
3. Handle voting on comments

### Step 6: Rename Company to Creator

**Files:**
- `company.html` → `creator.html`
- `scripts/company.js` → `scripts/creator.js`
- Update all links in other HTML files

### Step 7: Add New Features

**New pages:**
1. Tags page - Browse by tags
2. Products page - Product catalog
3. Squads page - Communities
4. Leaderboard - Gamification

---

## 🧪 Testing Checklist

### Authentication
- [ ] Register new user
- [ ] Login
- [ ] Get current user (/me)
- [ ] Update profile

### Posts
- [ ] List posts
- [ ] View post detail (by slug)
- [ ] Upvote post
- [ ] Downvote post
- [ ] Bookmark post
- [ ] View bookmarks

### Creators
- [ ] List creators
- [ ] View creator profile (by slug)
- [ ] Follow creator
- [ ] View following list

### Comments
- [ ] View comments (nested)
- [ ] Add comment
- [ ] Reply to comment
- [ ] Vote on comment
- [ ] Edit comment
- [ ] Delete comment

### Tags
- [ ] List tags
- [ ] View posts by tag
- [ ] See trending tags

### New Features
- [ ] Products page
- [ ] Squads/communities
- [ ] Leaderboard
- [ ] Achievements

---

## 📊 Progress Tracking

### Completed:
- [x] Backend API (100%)
- [x] Database schema migration

### In Progress:
- [ ] API Client update (0%)
- [ ] Rendering logic (0%)
- [ ] Feed page (0%)

### Pending:
- [ ] Detail page
- [ ] Interactions
- [ ] Following/Bookmarks pages
- [ ] Creator pages
- [ ] New feature pages

---

## 🚀 Next Steps

1. ✅ Create this guide
2. ⬜ Update `api-client.js` with all new methods
3. ⬜ Test API client with backend
4. ⬜ Update rendering functions
5. ⬜ Update each page one by one
6. ⬜ Add new feature pages

**Estimated time:** 6-8 hours
**Priority:** Update core features first (posts, creators, auth), then add new features
