# ✅ Schema v2.0 Migration Complete

**Date:** 2025-01-18
**Status:** READY FOR USE
**Version:** 2.0.0

---

## 🎯 Summary

Database đã được chuyển sang **Schema v2.0** hoàn chỉnh với các tính năng nâng cao:

- ✅ **25+ tables** với full features
- ✅ **Gamification** system (levels, achievements, streaks)
- ✅ **Products integration** (GearVN products)
- ✅ **Squads/Communities** features
- ✅ **Complete sample data** (10 users, 20 posts, 5 creators, etc.)
- ✅ **Backend Go models** tương thích 100%
- ✅ **All triggers** và auto-updates đã setup

---

## 📁 What Changed

### ✅ Completed Tasks

1. **Backend Go Models** → Already compatible with v2.0
2. **Database Connection** → Verified working with Supabase
3. **Old Schema Files** → Archived to `database/v1_archive/`
4. **Documentation** → Created comprehensive guides
5. **Sample Data** → Fixed all schema mismatches

### 📦 New Files Created

```
database/
├── README-V2.md                  ⭐ Main documentation
├── QUICKSTART.md                 ⚡ Quick setup guide (updated)
└── v1_archive/                   📦 Old schema files (archived)
    ├── 00-complete-schema.sql    (old v1.0)
    ├── 01-seed-data.sql
    └── ... (other old files)
```

### 🔧 Fixed Files

- `04-full-sample-data.sql`
  - Fixed `user_preferences` columns
  - Fixed `user_levels.total_points` (was `total_xp`)
  - Fixed `achievements` columns
  - Fixed `follows` table (use `creator_id` instead of `following_id`)

---

## 🚀 Quick Start

### For New Setup:

```bash
# 1. Run schema (in Supabase SQL Editor)
database/02-new-complete-schema.sql

# 2. Load sample data (in Supabase SQL Editor)
database/04-full-sample-data.sql

# 3. Start backend
cd backend && go run .

# 4. Test
curl http://localhost:8080/api/posts
```

### For Existing Setup:

If you already have v1.0 data:

```bash
# 1. Backup first!
pg_dump -U postgres -d your_db > backup.sql

# 2. Clean old schema
database/00-cleanup-old-schema.sql

# 3. Create v2.0 schema
database/02-new-complete-schema.sql

# 4. Load sample data
database/04-full-sample-data.sql
```

---

## 📊 Database Schema v2.0 Features

### Core Features

#### 1. Users & Authentication (4 tables)
- `users` - Core user accounts with UUID
- `user_profiles` - Extended profile info
- `user_preferences` - Settings (theme, language, notifications)
- `user_levels` - Level & XP/points

#### 2. Content & Creators (5 tables)
- `creators` - YouTubers/Bloggers/Content creators
- `creator_socials` - Social media links
- `sources` - RSS/YouTube/API feeds
- `posts` - Articles, videos, reviews
- `post_media` - Images and videos in posts

#### 3. Products (4 tables) 🛒
- `products` - GearVN products catalog
- `product_categories` - Product categorization
- `brands` - Product brands (ASUS, Logitech, etc.)
- `post_products` - Products mentioned in posts

#### 4. Engagement (6 tables)
- `votes` - Upvote/downvote on posts
- `comments` - Comments with threading
- `comment_votes` - Votes on comments
- `bookmarks` - Saved posts with folders
- `views` - View tracking & analytics
- `follows` - Follow users or creators

#### 5. Community (3 tables) 👥
- `squads` - Communities/groups
- `squad_members` - Squad membership
- `squad_posts` - Posts shared to squads

#### 6. Gamification (5 tables) 🎮
- `streaks` - Daily activity streaks
- `achievements` - Achievement definitions
- `user_achievements` - User's earned achievements
- `user_levels` - User level & total points
- `user_points` - Points transaction history

#### 7. Tags (2 tables)
- `tags` - Hashtags/tags
- `post_tags` - Tags associated with posts

#### 8. Notifications (1 table) 🔔
- `notifications` - User notifications

### 🔥 Auto Features

**Database automatically handles:**

- ✅ Vote counts (upvote/downvote) → Auto update on posts
- ✅ Comment counts → Auto update on posts
- ✅ Bookmark counts → Auto update on posts
- ✅ Follower counts → Auto update on creators
- ✅ Squad member counts → Auto update on squads
- ✅ Tag usage counts → Auto update on tags
- ✅ Updated timestamps → Auto update on all tables
- ✅ User creation → Auto create profile, preferences, level, streak

---

## 🧪 Sample Data Overview

File `04-full-sample-data.sql` includes:

- **10 Users** (admin + 9 regular users)
  - With profiles, preferences, levels, and streaks
- **5 Creators** (Scrapshut, Linus Tech Tips, Gamers Nexus, etc.)
  - With social media accounts
- **15 Tags** (Gaming, PC Build, GPU, CPU, etc.)
- **10 Products** (Laptops, mice, keyboards, GPUs, etc.)
- **5 Sources** (YouTube channels, RSS feeds)
- **20 Posts** (mix of articles, videos, reviews, tutorials)
- **30+ Comments** (with nested replies)
- **5 Squads** (PC Builders VN, Gaming Gear Reviews, etc.)
- **Realistic engagement data** (votes, bookmarks, follows)
- **7 Achievements** (First Post, 7 Day Streak, etc.)

---

## 🔐 Database Connection

### Environment Variables

Already configured in `backend/.env`:

```env
DATABASE_URL=postgresql://postgres.qibhlrsdykpkbsnelubz:Gearvn%232025@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=8080
```

### Test Connection

```bash
cd backend
go run .
```

Expected output:
```
✅ Connected to Supabase PostgreSQL
✅ Database connection ready
🚀 Server starting on port 8080
```

---

## 🧪 Test Accounts

Use these to test login/features:

| Email | Password | Username | Role | Level |
|-------|----------|----------|------|-------|
| admin@gearvn.com | `password123` | admin | admin | 10 |
| user1@example.com | `password123` | techguru | user | 8 |
| user2@example.com | `password123` | gamerpro | user | 7 |

**Note:** Passwords are bcrypt hashed. For actual login, you'll need to handle bcrypt comparison in your auth handler.

---

## 📚 Documentation

### Main Docs
- [README-V2.md](database/README-V2.md) - Complete documentation
- [QUICKSTART.md](database/QUICKSTART.md) - Quick setup guide
- [gearvn-erd-diagram.md](gearvn-erd-diagram.md) - ERD diagram

### Technical Files
- [02-new-complete-schema.sql](database/02-new-complete-schema.sql) - Schema definition
- [04-full-sample-data.sql](database/04-full-sample-data.sql) - Sample data
- [models.go](backend/models.go) - Go models (already compatible)

---

## ✅ Verification Checklist

Run this query to verify everything is set up:

```sql
-- Check table counts
SELECT
  'users' as table_name, COUNT(*) as count FROM users
UNION ALL SELECT 'posts', COUNT(*) FROM posts
UNION ALL SELECT 'creators', COUNT(*) FROM creators
UNION ALL SELECT 'tags', COUNT(*) FROM tags
UNION ALL SELECT 'products', COUNT(*) FROM products
UNION ALL SELECT 'squads', COUNT(*) FROM squads
UNION ALL SELECT 'comments', COUNT(*) FROM comments
UNION ALL SELECT 'achievements', COUNT(*) FROM achievements;
```

Expected results:
```
users:        10
posts:        20
creators:     5
tags:         15
products:     10
squads:       5
comments:     30+
achievements: 7
```

✅ If all counts match → Setup is perfect!

---

## 🎯 Next Steps

### Immediate
1. ✅ Database schema → DONE
2. ✅ Sample data → DONE
3. ✅ Backend models → DONE
4. ⏳ API endpoints → Already implemented in handlers
5. ⏳ Frontend integration → Next task

### Future Enhancements
- [ ] Implement all API routes
- [ ] Add more sample data
- [ ] Setup Redis caching
- [ ] Add full-text search
- [ ] Implement notifications system
- [ ] Add admin dashboard

---

## 🆘 Troubleshooting

### Common Issues

**Q: "relation does not exist" error?**
A: Run schema file first: `02-new-complete-schema.sql`

**Q: "duplicate key violation" error?**
A: Clean data first: `00-clean-with-cascade.sql`

**Q: Backend can't connect?**
A: Check `DATABASE_URL` in `.env` file

**Q: Sample data fails to insert?**
A: Make sure schema is created first, then run full file (don't run partial)

---

## 📞 Support

Need help?
- Check [README-V2.md](database/README-V2.md) for detailed docs
- Check [QUICKSTART.md](database/QUICKSTART.md) for setup steps
- Review error messages in Supabase SQL Editor

---

**🎉 Congratulations! Your database is now running Schema v2.0!**

---

**Last Updated:** 2025-01-18
**Schema Version:** 2.0.0
**Migration Status:** COMPLETE ✅
