# 📝 UPDATE POST CREATORS - Guide

**Date:** 2025-11-06
**Purpose:** Assign all posts to 5 test users evenly

---

## 🎯 What This Does

**Before:**
```
All posts have: creator_id = NULL
```

**After:**
```
Posts distributed evenly:
- ~218 posts → Thuận Nguyễn (ID: 1)
- ~218 posts → Bình Bear (ID: 2)
- ~218 posts → Tài Xài Tech (ID: 3)
- ~218 posts → Ngọc Sang (ID: 4)
- ~218 posts → Dương Thiện (ID: 5)
```

---

## 🚀 Quick Run (Recommended)

### Step 1: Go to Supabase SQL Editor

```
https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz/sql/new
```

### Step 2: Copy & Paste SQL

```sql
-- Quick update using CASE statement
WITH numbered_posts AS (
  SELECT
    id,
    ROW_NUMBER() OVER (ORDER BY created_at) as rn
  FROM posts
)
UPDATE posts
SET creator_id = CASE
  WHEN (numbered_posts.rn % 5) = 1 THEN '1'  -- Thuận Nguyễn
  WHEN (numbered_posts.rn % 5) = 2 THEN '2'  -- Bình Bear
  WHEN (numbered_posts.rn % 5) = 3 THEN '3'  -- Tài Xài Tech
  WHEN (numbered_posts.rn % 5) = 4 THEN '4'  -- Ngọc Sang
  ELSE '5'                                    -- Dương Thiện
END
FROM numbered_posts
WHERE posts.id = numbered_posts.id;

-- Verify distribution
SELECT
  u.full_name,
  COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON p.creator_id::INTEGER = u.id
WHERE u.id IN (1, 2, 3, 4, 5)
GROUP BY u.id, u.full_name
ORDER BY u.id;
```

### Step 3: Click "Run"

Wait ~5-10 seconds for 1090 posts to be updated.

### Step 4: Check Results

You should see output like:
```
full_name        | post_count
-----------------|-----------
Thuận Nguyễn     | 218
Bình Bear        | 218
Tài Xài Tech     | 218
Ngọc Sang        | 218
Dương Thiện      | 218
```

---

## 📁 SQL Files

| File | Description |
|------|-------------|
| [quick_update_creators.sql](database/quick_update_creators.sql) | Fast CASE-based update (recommended) |
| [update_post_creators.sql](database/update_post_creators.sql) | Loop-based update with detailed logging |

---

## 🧪 Verify on Homepage

### After running SQL:

1. **Go to homepage:**
   ```
   http://localhost:5500/index.html
   ```

2. **You should see:**
   - Posts with author names (Bình Bear, Thuận Nguyễn, etc.)
   - Author avatars displayed
   - Links to author profiles work

3. **Test profile pages:**
   ```
   http://localhost:5500/profile.html?user=binh_bear
   → Should show ~218 posts by Bình Bear

   http://localhost:5500/profile.html?user=thuan_nguyen
   → Should show ~218 posts by Thuận Nguyễn
   ```

---

## 📊 Distribution Strategy

**Method:** Round-robin by `created_at` order

```
Post 1 (oldest)  → User 1 (Thuận)
Post 2           → User 2 (Bình)
Post 3           → User 3 (Tài)
Post 4           → User 4 (Sang)
Post 5           → User 5 (Dương)
Post 6           → User 1 (Thuận)  ← cycle repeats
Post 7           → User 2 (Bình)
...
Post 1090        → User 5 (Dương)
```

**Why this way?**
- Ensures even distribution (218 posts each)
- Posts spread over time for each user
- No user gets only old or only new posts

---

## 🔧 Alternative: Manual Distribution

If you want specific topics per user:

```sql
-- Example: Gaming posts for Bình Bear
UPDATE posts
SET creator_id = 2  -- Bình Bear
WHERE title ILIKE '%gaming%' OR title ILIKE '%game%';

-- Example: Tech posts for Thuận
UPDATE posts
SET creator_id = 1  -- Thuận Nguyễn
WHERE title ILIKE '%tech%' OR title ILIKE '%AI%';
```

But **not recommended** - just use the round-robin for even distribution.

---

## ⚠️ Important Notes

### Before Running:

1. **Backup not needed** - creator_id is currently NULL, so it's safe to update
2. **Can re-run** - If you want different distribution, just run again
3. **Won't break existing data** - Only updates creator_id column

### After Running:

1. **Homepage will show authors** - All posts now have creators
2. **Profile pages will work** - Each user has their posts
3. **Feed distribution** - Users will see posts from all 5 creators

---

## 🎯 Expected Results

### Homepage Feed:
```
┌─────────────────────────────────────────┐
│ [Avatar] Bình Bear                      │
│ "Nintendo Store App Lets You Track..."  │
│ Posted 2 hours ago                      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ [Avatar] Thuận Nguyễn                   │
│ "Epic Games Celebrates Fortnite..."     │
│ Posted 3 hours ago                      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ [Avatar] Tài Xài Tech                   │
│ "Call of Duty: Black Ops 7..."          │
│ Posted 4 hours ago                      │
└─────────────────────────────────────────┘
```

### Profile Pages:
```
Bình Bear's Profile
├── Bio: Hardware Specialist @ GearVN
├── Posts: 218
├── Followers: (varies)
└── Post List:
    - Nintendo Store App...
    - Valor Mortis Dev Dares...
    - Epic Games Celebrates...
```

---

## 🧪 Testing Checklist

After running SQL:

- [ ] Homepage shows posts with author names
- [ ] Author avatars displayed correctly
- [ ] Click author name → Goes to profile page
- [ ] Profile page shows post count (~218)
- [ ] Profile page lists all user's posts
- [ ] Each user has roughly equal post count
- [ ] Posts distributed over different dates

---

## 🔄 Need to Re-run?

If you want to change distribution:

```sql
-- Reset all to NULL first
UPDATE posts SET creator_id = NULL;

-- Then run the update script again
-- (Copy from quick_update_creators.sql)
```

---

## 💡 Tips

1. **Run during off-hours** - 1090 updates might take 5-10 seconds
2. **Check query time** - Should complete in under 10 seconds
3. **Verify count** - Make sure all 1090 posts updated
4. **Test one user first** - Check Bình Bear's profile before others

---

## 🚀 Ready to Run!

```
1. Go to: https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz/sql/new
2. Copy SQL from: database/quick_update_creators.sql
3. Click "Run"
4. Wait ~10 seconds
5. Verify: Check post counts for each user
6. Test: http://localhost:5500/index.html
```

**After this, all posts will have creators! 🎉**
