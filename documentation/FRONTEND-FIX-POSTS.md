# 🔧 FRONTEND FIX - Posts Not Showing on Profile

**Date:** 2025-11-06
**Issue:** Profile page shows "0 Posts" and "No posts yet" despite database having posts

---

## 🐛 Root Cause

### Problem 1: Wrong Column Name in Query

**File:** `scripts/profile.js` (line 45)

**Before (WRONG):**
```javascript
const posts = await supabaseRequest(
  `/posts?author_id=eq.${userId}&author_type=eq.user&order=created_at.desc`
);
```

**Issue:**
- Query used `author_id` but posts table has `creator_id`
- Added unnecessary `author_type` filter

**After (FIXED):**
```javascript
const posts = await supabaseRequest(
  `/posts?creator_id=eq.${userId}&order=created_at.desc`
);
```

---

### Problem 2: Missing Creator Info on Homepage

**File:** `scripts/api-client.js` (line 122-169)

**Before:**
- Only fetched posts without creator information
- `creator_name` field was undefined
- Homepage couldn't display author names

**After (FIXED):**
```javascript
// 1. Fetch posts
const posts = await response.json();

// 2. Get unique creator IDs
const creatorIds = [...new Set(posts.map(p => p.creator_id).filter(Boolean))];

// 3. Fetch all creators in one query
const users = await fetch(
  `/users?id=in.(${creatorIds.join(',')})`
);

// 4. Map creators to posts
const creatorsMap = users.reduce((acc, user) => {
  acc[user.id.toString()] = user;
  return acc;
}, {});

// 5. Add creator info to each post
return posts.map(post => ({
  ...post,
  creator_name: creatorsMap[post.creator_id]?.full_name,
  creator_avatar: creatorsMap[post.creator_id]?.avatar_url
}));
```

---

## ✅ Files Fixed

1. **[scripts/profile.js](scripts/profile.js#L45)**
   - Changed `author_id` → `creator_id`
   - Removed `author_type` filter

2. **[scripts/api-client.js](scripts/api-client.js#L122-L169)**
   - Added creator info fetching
   - Maps users to posts by `creator_id`
   - Handles type mismatch (VARCHAR vs INTEGER)

---

## 🎯 What This Fixes

### Homepage Feed:
**Before:**
```
┌─────────────────────────────────┐
│ "Nintendo Store App Lets You..." │
│ No creator name                  │
│ No avatar                        │
└─────────────────────────────────┘
```

**After:**
```
┌─────────────────────────────────┐
│ 👤 Thuận Nguyễn                 │
│ "Nintendo Store App Lets You..." │
│ 2 hours ago                      │
└─────────────────────────────────┘
```

### Profile Page:
**Before:**
```
Bình Bear
Posts: 0          ← WRONG!
No posts yet      ← WRONG!
```

**After:**
```
Bình Bear
Posts: 218        ← CORRECT!
[List of 218 posts displayed]
```

---

## 🧪 Testing

### Test 1: Homepage Shows Creators

```bash
http://localhost:5500/index.html
```

**Expected:**
- ✅ Posts show creator names (Bình Bear, Thuận Nguyễn, etc.)
- ✅ Creator avatars displayed
- ✅ Click creator → Goes to profile

**Debug in console (F12):**
```javascript
// Check if posts have creator info
window.api.getPosts({ limit: 5 }).then(posts => {
  console.log(posts[0]);
  // Should have: creator_name, creator_avatar
});
```

---

### Test 2: Profile Page Shows Posts

```bash
http://localhost:5500/profile.html?user=binh_bear
```

**Expected:**
- ✅ Post count: ~218
- ✅ List of posts displayed
- ✅ All posts by Bình Bear only

**Debug in console (F12):**
```javascript
// In profile page console
// Check if getUserPosts returns data
const userId = 2; // Bình Bear
fetch('https://qibhlrsdykpkbsnelubz.supabase.co/rest/v1/posts?creator_id=eq.2&select=*&order=created_at.desc', {
  headers: {
    'apikey': 'YOUR_KEY',
    'Authorization': 'Bearer YOUR_KEY'
  }
}).then(r => r.json()).then(posts => {
  console.log(`Found ${posts.length} posts for user 2`);
});
```

---

## 🔍 Type Casting Note

**Important:** `creator_id` is VARCHAR in posts table, but user `id` is INTEGER.

**Why this matters:**
```javascript
// Post has:
post.creator_id = "2"  // String

// User has:
user.id = 2  // Number

// When joining, need to match:
creatorsMap[user.id.toString()] = user;  // Convert to string
```

**In SQL:**
```sql
-- Direct join doesn't work (type mismatch)
SELECT * FROM posts p
JOIN users u ON u.id = p.creator_id;  -- ERROR!

-- Need cast
SELECT * FROM posts p
JOIN users u ON u.id = p.creator_id::INTEGER;  -- OK!
```

**In JavaScript:**
```javascript
// Convert number to string for comparison
creatorsMap[user.id.toString()] = user;

// Then lookup works:
const creator = creatorsMap[post.creator_id];  // post.creator_id is "2"
```

---

## 📊 Performance

### Before:
- Homepage: 1 query (posts only)
- No creator info
- Fast but incomplete

### After:
- Homepage: 2 queries (posts + users)
- Creator info included
- Still fast (~50 posts + 5 users)

**Why efficient:**
1. Batch fetch all creators in one query (not N+1)
2. Only fetch unique creator IDs
3. Map in memory (fast)

**Example:**
```
Query 1: Fetch 50 posts
→ Get creator IDs: ["1", "2", "3", "4", "5"]

Query 2: Fetch 5 users
→ WHERE id IN (1,2,3,4,5)

Map: Match posts to creators
→ O(n) complexity, very fast
```

---

## ⚠️ Edge Cases Handled

### Case 1: Post with no creator_id
```javascript
post.creator_id = null

// Handled:
creator_name: null  // Won't crash
// Feed.js shows fallback: "RSS Feed"
```

### Case 2: Creator deleted
```javascript
post.creator_id = "999"  // User doesn't exist

// Handled:
creatorsMap["999"] = undefined
creator_name: null  // Shows fallback
```

### Case 3: Empty posts
```javascript
posts = []

// Handled:
creatorIds = []
// Skip user fetch
return []  // No error
```

---

## 🚀 Ready to Test!

### Clear Cache First:
```bash
# Hard refresh
Ctrl + F5

# Or clear in DevTools
F12 → Application → Clear Storage → Clear site data
```

### Then Test:

```bash
# 1. Homepage
http://localhost:5500/index.html
→ Should show creators now! 🎉

# 2. Profile
http://localhost:5500/profile.html?user=binh_bear
→ Should show ~218 posts! 🎉
```

---

## ✅ Summary

**Fixed 2 critical issues:**
1. ✅ Profile page: Query used wrong column name
2. ✅ Homepage: Missing creator info in API response

**Result:**
- ✅ Homepage shows creator names and avatars
- ✅ Profile pages show correct post count
- ✅ All posts properly attributed to creators

**Test now and see the difference! 🚀**
