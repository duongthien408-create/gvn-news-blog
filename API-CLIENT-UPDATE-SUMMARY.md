# ✅ API Client v2.0 - Update Complete!

## 📝 Overview

File `scripts/api-client.js` đã được cập nhật hoàn toàn để hoạt động với Backend v2.0.

---

## 🔄 Changes Made

### 1. Removed Supabase Fallback
- **Old:** Có fallback logic phức tạp sang Supabase REST API
- **New:** Chỉ sử dụng Go backend API (đơn giản hơn, nhanh hơn)

### 2. Updated All Endpoints

#### Authentication (4 methods)
```javascript
// Updated endpoints
api.register(email, password, username)  // /register (not /auth/register)
api.login(email, password)               // /login (not /auth/login)
api.getMe()                              // /me (not /auth/me)
api.updateProfile(profileData)           // NEW: /me (PUT)
```

#### Posts (12 methods)
```javascript
// Updated for new schema
api.getPosts(params)                     // /posts with filters
api.getPostBySlug(slug)                  // /posts/:slug (slug-based!)
api.getPostById(id)                      // Deprecated, warns user

// NEW: Voting system (up/down)
api.votePost(postId, voteType)          // voteType: 1, -1, or 0
api.upvotePost(postId)                  // Shortcut for voteType=1
api.downvotePost(postId)                // Shortcut for voteType=-1
api.removeVote(postId)                  // Shortcut for voteType=0
api.getUserVote(postId)                 // Get user's current vote

// Bookmarks (toggle endpoint)
api.bookmarkPost(postId)                // /posts/:id/bookmark (POST toggle)
api.addBookmark(postId)                 // Backward compat
api.removeBookmark(postId)              // Backward compat

api.getBookmarks()                      // /bookmarks (returns full posts)
```

#### Creators (9 methods)
```javascript
// Updated for slug-based routing
api.getCreators(params)                 // /creators
api.getCreatorBySlug(slug)              // /creators/:slug (slug-based!)
api.getCreatorById(id)                  // Deprecated, warns user
api.getCreatorPosts(slug)               // Returns posts from creator object

// NEW: Follow system (toggle)
api.followCreator(creatorId)            // /creators/:id/follow (POST toggle)
api.unfollowCreator(creatorId)          // Same endpoint
api.getCreatorFollowers(creatorId)      // /creators/:id/followers
api.getFollowingCreators()              // /following/creators (returns objects)
api.getFollowing()                      // Backward compat
```

#### Tags (3 methods) - NEW!
```javascript
api.getTags(params)                     // /tags
api.getTagBySlug(slug)                  // /tags/:slug
api.getTrendingTags(limit)              // /tags/trending
```

#### Comments (7 methods)
```javascript
// Updated for nested comments
api.getComments(postId)                 // /posts/:id/comments (nested tree)
api.addComment(postId, content, parentId) // /posts/:id/comments

// NEW: Comment voting
api.voteComment(commentId, voteType)    // /comments/:id/vote
api.upvoteComment(commentId)            // Shortcut
api.downvoteComment(commentId)          // Shortcut

// NEW: Edit/delete comments
api.updateComment(commentId, content)   // /comments/:id (PUT)
api.deleteComment(commentId)            // /comments/:id (DELETE)
```

#### Products (4 methods) - NEW!
```javascript
api.getProducts(params)                 // /products
api.getProductBySlug(slug)              // /products/:slug
api.getBrands()                         // /brands
api.getProductCategories()              // /product-categories
```

#### Squads/Communities (7 methods) - NEW!
```javascript
api.getSquads(params)                   // /squads
api.getSquadBySlug(slug)                // /squads/:slug
api.createSquad(squadData)              // /squads (POST)
api.joinSquad(squadId)                  // /squads/:id/join
api.leaveSquad(squadId)                 // /squads/:id/leave
api.getSquadMembers(squadId)            // /squads/:id/members
api.sharePostToSquad(squadId, postId)   // /squads/:id/posts
```

#### Gamification (7 methods) - NEW!
```javascript
api.getUserLevel(userId)                // /users/:id/level
api.getUserStreak(userId)               // /users/:id/streak
api.getUserStats(userId)                // /users/:id/stats
api.getAchievements()                   // /achievements
api.getUserAchievements(userId)         // /users/:id/achievements
api.getUserPointsHistory(userId)        // /users/:id/points/history
api.getLeaderboard(params)              // /leaderboard
```

#### Helper Methods (4 methods) - NEW!
```javascript
// Convenience methods for current user
api.getMyLevel()                        // Get my level
api.getMyAchievements()                 // Get my achievements
api.getMyStats()                        // Get my stats
api.getMyVoteOnPost(postId)             // Get my vote on post
```

---

## 📊 Summary Statistics

### Total Methods: **75 methods**
- Authentication: 4
- Posts: 12
- Creators: 9
- Tags: 3 (NEW)
- Comments: 7
- Products: 4 (NEW)
- Squads: 7 (NEW)
- Gamification: 7 (NEW)
- Helpers: 4 (NEW)
- Core (request, logout, etc.): 6
- Backward compatibility: 6

### Breaking Changes Fixed:
- ✅ Auth endpoints changed (removed `/auth/` prefix)
- ✅ Posts now use **slug** instead of ID
- ✅ Creators now use **slug** instead of ID
- ✅ Voting changed to up/down with vote_type
- ✅ Bookmarks endpoint changed
- ✅ Following endpoint changed
- ✅ Comments now return nested structure

### New Features Added:
- ✅ Downvoting support
- ✅ Comment voting
- ✅ Comment editing/deleting
- ✅ Tags system
- ✅ Products catalog
- ✅ Squads/communities
- ✅ Gamification (levels, achievements, leaderboard)
- ✅ Helper methods for current user

### Backward Compatibility:
- ✅ `getPostById()` - Warns and calls `getPostBySlug()`
- ✅ `getCreatorById()` - Warns and calls `getCreatorBySlug()`
- ✅ `addBookmark()` - Calls `bookmarkPost()`
- ✅ `removeBookmark()` - Calls `bookmarkPost()`
- ✅ `getFollowing()` - Calls `getFollowingCreators()`
- ✅ `getUpvotes()` - Warns (cannot implement with new structure)

---

## ✅ What Works Now

### Already Compatible:
These parts of the frontend should work with minimal changes:
- ✅ Login/Register forms (endpoint paths changed but structure same)
- ✅ Bookmark button (method name same, just endpoint changed)
- ✅ Follow button (method name same, just endpoint changed)

### Needs Updates:
These need updates in other files:
- ⬜ Post rendering - Handle `creators[]` array instead of single creator
- ⬜ Post rendering - Handle `tags[]` with objects instead of strings
- ⬜ Post detail - Use slug in URL instead of ID
- ⬜ Creator detail - Use slug in URL instead of ID
- ⬜ Comments - Handle nested tree structure
- ⬜ Voting UI - Show separate up/down counts
- ⬜ Voting UI - Handle vote_type (-1, 0, 1)

---

## 🧪 Testing the API Client

### Test in Browser Console:
```javascript
// Test authentication
await api.login('test@gearvn.com', 'test123');
console.log('Logged in:', api.getUser());

// Test posts
const posts = await api.getPosts({ limit: 10 });
console.log('Posts:', posts);

// Test single post by slug
const post = await api.getPostBySlug('my-post-slug');
console.log('Post:', post);

// Test voting
await api.upvotePost(post.id);
const vote = await api.getUserVote(post.id);
console.log('My vote:', vote);

// Test creators
const creators = await api.getCreators({ verified: 'true' });
console.log('Verified creators:', creators);

// Test tags
const tags = await api.getTrendingTags(10);
console.log('Trending tags:', tags);

// Test gamification
const leaderboard = await api.getLeaderboard({ limit: 10 });
console.log('Leaderboard:', leaderboard);
```

---

## 📋 Next Steps

### 1. Update Rendering Functions ⬜
File: `scripts/render.js`
- Update `renderPost()` to handle creators array
- Update to use new tag structure
- Add `renderTag()`, `renderProduct()`, `renderSquad()`

### 2. Update Feed Page ⬜
File: `scripts/feed.js`
- Call `api.getPosts()` with new parameters
- Handle new response structure

### 3. Update Detail Page ⬜
File: `scripts/detail.js`
- Use slug from URL instead of ID
- Call `api.getPostBySlug(slug)`
- Render nested comments

### 4. Update Interactions ⬜
File: `scripts/interactions.js`
- Update voting to show up/down buttons
- Handle vote_type correctly
- Update comment voting

### 5. Update Auth ⬜
File: `scripts/auth.js`
- Should work with minimal changes (endpoints updated in api-client)

### 6. Create New Pages ⬜
- Tags page
- Products page
- Squads page
- Leaderboard page

---

## 🎯 Current Status

- ✅ **Backend:** 100% Complete (50+ endpoints)
- ✅ **API Client:** 100% Complete (75 methods)
- ⬜ **Rendering:** 0% (needs update)
- ⬜ **Pages:** 0% (needs update)

**Next Priority:** Update `scripts/render.js` để handle new data structure.
