# 📊 POST CREATOR UPDATE - Summary

**Date:** 2025-11-06
**Total Posts:** 1,090
**Users:** 5 (Thuận, Bình, Tài, Sang, Dương)

---

## 🎯 Quick Summary

**Problem:** All 1,090 posts have `creator_id = NULL`, so they don't show creators on homepage.

**Solution:** Assign posts evenly to 5 test users using round-robin distribution.

**Result:** Each user gets ~218 posts spread across all time periods.

---

## 🚀 How to Run (3 Steps)

### 1. Go to Supabase SQL Editor
```
https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz/sql/new
```

### 2. Copy & Paste This SQL
```sql
WITH numbered_posts AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as rn
  FROM posts
)
UPDATE posts
SET creator_id = CASE
  WHEN (numbered_posts.rn % 5) = 1 THEN '1'
  WHEN (numbered_posts.rn % 5) = 2 THEN '2'
  WHEN (numbered_posts.rn % 5) = 3 THEN '3'
  WHEN (numbered_posts.rn % 5) = 4 THEN '4'
  ELSE '5'
END
FROM numbered_posts
WHERE posts.id = numbered_posts.id;
```

### 3. Click "Run" → Wait ~10 seconds

---

## ✅ Expected Results

### Post Distribution:
```
User ID | Name            | Posts
--------|-----------------|------
1       | Thuận Nguyễn    | 218
2       | Bình Bear       | 218
3       | Tài Xài Tech    | 218
4       | Ngọc Sang       | 218
5       | Dương Thiện     | 218
```

### Homepage Feed:
- ✅ Shows author names and avatars
- ✅ Links to author profiles work
- ✅ Posts from all 5 users mixed

### Profile Pages:
- ✅ Each user has ~218 posts
- ✅ Post count displayed correctly
- ✅ Post list shows all user's posts

---

## 📁 Files Created

| File | Purpose |
|------|---------|
| [database/quick_update_creators.sql](database/quick_update_creators.sql) | Fast SQL update (recommended) |
| [database/update_post_creators.sql](database/update_post_creators.sql) | Detailed version with logging |
| [UPDATE-POST-CREATORS-GUIDE.md](UPDATE-POST-CREATORS-GUIDE.md) | Complete guide with examples |
| [POST-CREATOR-UPDATE-SUMMARY.md](POST-CREATOR-UPDATE-SUMMARY.md) | This file |

---

## 🧪 After Running - Test These

### 1. Check Homepage
```bash
http://localhost:5500/index.html
```
**Expected:**
- Posts show "by Bình Bear", "by Thuận Nguyễn", etc.
- Author avatars displayed
- Click author → Goes to profile

### 2. Check Profile Pages
```bash
http://localhost:5500/profile.html?user=binh_bear
http://localhost:5500/profile.html?user=thuan_nguyen
```
**Expected:**
- Post count: ~218 per user
- List of posts displayed
- User info correct

### 3. Verify Distribution
```sql
-- Run in SQL Editor to verify
SELECT
  u.full_name,
  COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON p.creator_id = u.id
WHERE u.id IN (1,2,3,4,5)
GROUP BY u.id, u.full_name
ORDER BY u.id;
```

---

## 💡 Distribution Strategy

**Method:** Round-robin by post creation time

```
Oldest post (1)    → Thuận Nguyễn
Post 2             → Bình Bear
Post 3             → Tài Xài Tech
Post 4             → Ngọc Sang
Post 5             → Dương Thiện
Post 6             → Thuận Nguyễn  ← Cycle repeats
...
Newest post (1090) → Dương Thiện
```

**Benefits:**
- Even distribution (218 each)
- Each user has mix of old + new posts
- No bias toward any topic/category

---

## ⚠️ Important Notes

### Safe to Run:
- ✅ No data loss (only setting NULL → user IDs)
- ✅ Can re-run if needed
- ✅ Doesn't affect other tables

### Performance:
- ⏱️ Takes ~5-10 seconds for 1090 posts
- 🔄 Updates happen in transaction (all or nothing)
- ✅ No downtime needed

---

## 🔄 Need to Change Distribution?

### Reset to NULL:
```sql
UPDATE posts SET creator_id = NULL;
```

### Assign by Topic (Alternative):
```sql
-- Gaming posts → Bình Bear
UPDATE posts
SET creator_id = 2
WHERE title ILIKE '%gaming%' OR title ILIKE '%game%';

-- Tech posts → Thuận Nguyễn
UPDATE posts
SET creator_id = 1
WHERE title ILIKE '%tech%' OR title ILIKE '%AI%';
```

But **round-robin is recommended** for even distribution.

---

## 🎉 You're Ready!

**Run the SQL now, then:**
1. Refresh homepage → See creators
2. Check profile pages → See posts
3. Test interactions → Like, comment, bookmark

**Everything will work with real user data! 🚀**
