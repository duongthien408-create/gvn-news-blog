# 🔧 Post Detail Modal - Creator Display Fix

**Date:** 2025-11-06
**Status:** ✅ Fixed

---

## 🐛 Problem

Khi click vào bài viết từ trang chủ để xem chi tiết (modal hoặc detail page), thông tin tác giả không hiển thị đúng:

- ✅ **Trang chủ (Homepage)** - Hiển thị tác giả đúng
- ✅ **Trang Profile** - Hiển thị bài viết và tác giả đúng
- ❌ **Post Detail Modal** - Không hiển thị tên tác giả, chỉ hiện category

---

## 🔍 Root Cause Analysis

### File: `scripts/api-client.js`

**Function affected:** `getPostById(id)` (lines 173-223)

**Problem:**
```javascript
// TRƯỚC KHI SỬA (line 173-196):
async getPostById(id) {
    // ... fetch post by id
    const posts = await response.json();
    return posts[0] || null;  // ❌ Chỉ trả về post, không có creator info
}
```

**Tại sao bị lỗi:**
- Function chỉ fetch dữ liệu post từ database
- Post có field `creator_id` (string: "1", "2", "3"...)
- Nhưng KHÔNG fetch thông tin creator (full_name, username, avatar_url)
- `post-modal.js` line 103 check `p.creator_name` → undefined
- Fallback về dùng `category` làm tên creator

**So sánh với `getPosts()`:**
- `getPosts()` (lines 122-169) có fetch creator info:
  1. Fetch posts
  2. Extract unique creator IDs
  3. Fetch all creators in one query
  4. Map creator data vào posts

---

## ✅ Solution Applied

### Updated `getPostById()` function

**File:** `scripts/api-client.js` (lines 173-223)

```javascript
async getPostById(id) {
    try {
        // Try Go backend first
        return await this.request(`/posts/${id}`);
    } catch (error) {
        console.warn('⚠️ Go backend unavailable, using Supabase REST API fallback');

        // Fallback to Supabase REST API
        const url = `${API_CONFIG.supabase.url}/rest/v1/posts?select=*&id=eq.${id}`;

        const response = await fetch(url, {
            headers: {
                'apikey': API_CONFIG.supabase.key,
                'Authorization': `Bearer ${API_CONFIG.supabase.key}`
            }
        });

        if (!response.ok) {
            throw new Error(`Supabase API error: ${response.status}`);
        }

        const posts = await response.json();
        const post = posts[0] || null;

        if (!post) {
            return null;
        }

        // ✅ NEW: Fetch creator info if post has creator_id
        if (post.creator_id) {
            const usersUrl = `${API_CONFIG.supabase.url}/rest/v1/users?select=id,username,full_name,avatar_url&id=eq.${post.creator_id}`;
            const usersResponse = await fetch(usersUrl, {
                headers: {
                    'apikey': API_CONFIG.supabase.key,
                    'Authorization': `Bearer ${API_CONFIG.supabase.key}`
                }
            });

            if (usersResponse.ok) {
                const users = await usersResponse.json();
                const creator = users[0];
                if (creator) {
                    post.creator_name = creator.full_name || creator.username;
                    post.creator_avatar = creator.avatar_url;
                }
            }
        }

        return post;  // ✅ Trả về post với creator info
    }
}
```

---

## 🎯 What Changed

### Before:
```javascript
{
  id: "post-123",
  title: "Post Title",
  creator_id: "1",  // ❌ Chỉ có ID
  // Không có creator_name, creator_avatar
}
```

### After:
```javascript
{
  id: "post-123",
  title: "Post Title",
  creator_id: "1",
  creator_name: "Thuận Nguyễn",  // ✅ Added
  creator_avatar: "https://..."   // ✅ Added
}
```

---

## 📋 Files Changed

### 1. `scripts/api-client.js`
**Lines:** 173-223
**Changes:**
- Added creator fetch logic after fetching post
- Query users table by `creator_id`
- Add `creator_name` and `creator_avatar` to post object

---

## 🧪 Testing

### Test Steps:

1. **Mở trang chủ** → [http://localhost:8000/index.html](http://localhost:8000/index.html)

2. **Click vào bất kỳ post nào** để mở modal

3. **Kiểm tra creator info:**
   - ✅ Hiển thị tên tác giả (Thuận Nguyễn, Bình Bear, etc.)
   - ✅ Hiển thị avatar/initials của tác giả
   - ✅ Badge màu đỏ (red badge) cho user creators
   - ✅ "Follow" button có creator ID đúng

4. **Kiểm tra sidebar author card:**
   - ✅ Creator name hiển thị đúng
   - ✅ Creator initials đúng (TN, BB, TXT, NS, DT)
   - ✅ Red badge styling

5. **Test với các user khác nhau:**
   - Post của Thuận Nguyễn → Show "Thuận Nguyễn"
   - Post của Bình Bear → Show "Bình Bear"
   - Post của Tài Xài Tech → Show "Tài Xài Tech"
   - Post của Ngọc Sang → Show "Ngọc Sang"
   - Post của Dương Thiện → Show "Dương Thiện"

---

## 🔗 Related Files

### Files that use `getPostById()`:

1. **`scripts/post-modal.js`** (line 50)
   - Opens post detail modal
   - Transforms post data including creator info

2. **`scripts/detail.js`** (line 55)
   - Renders full post detail page
   - Also transforms creator data

Both files now receive complete post data with creator info from `getPostById()`.

---

## 📝 Technical Notes

### Type Casting:
- `posts.creator_id` = VARCHAR ("1", "2", "3", "4", "5")
- `users.id` = INTEGER (1, 2, 3, 4, 5)
- Query uses: `id=eq.${post.creator_id}` (Supabase handles type coercion)

### Fallback Behavior:
- If creator_id is NULL → No creator fetch, post.creator_name stays undefined
- `post-modal.js` falls back to category name (RSS Feed behavior)

### Performance:
- Each `getPostById()` call makes 2 queries:
  1. Fetch post
  2. Fetch creator (only if creator_id exists)
- This is acceptable for single post detail views

---

## ✅ Result

**Before:**
- Post detail modal showed category as creator
- Example: "Tech News" instead of "Thuận Nguyễn"

**After:**
- Post detail modal shows actual creator name
- Example: "Thuận Nguyễn" with red badge
- Consistent with homepage and profile pages

---

## 🎉 Status

✅ **FIXED** - Creator info now displays correctly on:
- Homepage feed
- Profile pages
- Post detail modal
- Post detail page

All pages now synchronized! 🚀

---

**Last Updated:** 2025-11-06
