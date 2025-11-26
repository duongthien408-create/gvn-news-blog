# 🔧 SQL TYPE FIX - creator_id VARCHAR vs INTEGER

**Date:** 2025-11-06
**Error Fixed:** `operator does not exist: character varying = integer`

---

## ❌ Error Encountered

```
ERROR: 42883: operator does not exist: character varying = integer
LINE 51: LEFT JOIN posts p ON p.creator_id = u.id
HINT: No operator matches the given name and argument types.
You might need to add explicit type casts.
```

---

## 🔍 Root Cause

**Problem:** Type mismatch between two columns:

| Table | Column | Type |
|-------|--------|------|
| `posts` | `creator_id` | `VARCHAR` (string) |
| `users` | `id` | `INTEGER` (number) |

**Why?**
- Posts table uses string IDs (e.g., "rss-5c14122903d843c1")
- `creator_id` column created as VARCHAR to match foreign keys
- But users table uses INTEGER IDs (1, 2, 3, 4, 5)

---

## ✅ Solution

### Change 1: UPDATE statement values

**Before (WRONG):**
```sql
UPDATE posts
SET creator_id = CASE
  WHEN (numbered_posts.rn % 5) = 1 THEN 1  -- INTEGER
  WHEN (numbered_posts.rn % 5) = 2 THEN 2
  ...
END
```

**After (CORRECT):**
```sql
UPDATE posts
SET creator_id = CASE
  WHEN (numbered_posts.rn % 5) = 1 THEN '1'  -- VARCHAR (string)
  WHEN (numbered_posts.rn % 5) = 2 THEN '2'
  ...
END
```

**Key:** Add quotes to make integers → strings.

---

### Change 2: JOIN statements

**Before (WRONG):**
```sql
LEFT JOIN posts p ON p.creator_id = u.id
```

**After (CORRECT):**
```sql
LEFT JOIN posts p ON p.creator_id::INTEGER = u.id
```

**Key:** Cast VARCHAR to INTEGER using `::INTEGER` for comparison.

---

## 📝 Files Updated

All SQL files have been fixed:

1. ✅ [database/quick_update_creators.sql](database/quick_update_creators.sql)
2. ✅ [database/update_post_creators.sql](database/update_post_creators.sql)
3. ✅ [QUICK-START.md](QUICK-START.md)
4. ✅ [UPDATE-POST-CREATORS-GUIDE.md](UPDATE-POST-CREATORS-GUIDE.md)
5. ✅ [POST-CREATOR-UPDATE-SUMMARY.md](POST-CREATOR-UPDATE-SUMMARY.md)
6. ✅ [WHAT-TO-DO-NEXT.md](WHAT-TO-DO-NEXT.md)

---

## 🧪 Correct SQL (Ready to Use)

```sql
-- UPDATE statement with VARCHAR values
WITH numbered_posts AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as rn
  FROM posts
)
UPDATE posts
SET creator_id = CASE
  WHEN (numbered_posts.rn % 5) = 1 THEN '1'  -- ✅ String
  WHEN (numbered_posts.rn % 5) = 2 THEN '2'  -- ✅ String
  WHEN (numbered_posts.rn % 5) = 3 THEN '3'  -- ✅ String
  WHEN (numbered_posts.rn % 5) = 4 THEN '4'  -- ✅ String
  ELSE '5'                                    -- ✅ String
END
FROM numbered_posts
WHERE posts.id = numbered_posts.id;

-- VERIFY with type cast
SELECT
  u.full_name,
  COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON p.creator_id::INTEGER = u.id  -- ✅ Cast to INTEGER
WHERE u.id IN (1, 2, 3, 4, 5)
GROUP BY u.id, u.full_name
ORDER BY u.id;
```

---

## 💡 Why This Matters

### Frontend Code Impact:

**JavaScript/TypeScript:**
```javascript
// Before fix, posts would have:
post.creator_id = 1  // Number

// After fix, posts will have:
post.creator_id = "1"  // String

// So when fetching users, need to handle:
const userId = parseInt(post.creator_id);  // Convert to number
// Or cast in SQL:
WHERE u.id = p.creator_id::INTEGER
```

**No frontend changes needed** because most code already handles this:
```javascript
// scripts/feed.js already does:
const users = await supabaseRequest(`/users?id=eq.${post.creator_id}`);
// Works for both "1" and 1
```

---

## 🎯 Run Updated SQL Now

**Go to:**
```
https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz/sql/new
```

**Copy from:**
```
database/quick_update_creators.sql
```

**Or use:**
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

**Click "Run" → Wait ~10 seconds → Done! ✅**

---

## 📊 Verification

After running, check distribution:

```sql
SELECT
  u.full_name,
  COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON p.creator_id::INTEGER = u.id
WHERE u.id IN (1, 2, 3, 4, 5)
GROUP BY u.id, u.full_name
ORDER BY u.id;
```

**Expected output:**
```
full_name        | post_count
-----------------|------------
Thuận Nguyễn     | 218
Bình Bear        | 218
Tài Xài Tech     | 218
Ngọc Sang        | 218
Dương Thiện      | 218
```

---

## ✅ Error Fixed!

All SQL scripts updated with correct types. Ready to run! 🚀
