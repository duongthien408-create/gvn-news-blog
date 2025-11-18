# Sample Data Information

## 📊 Overview

File `seed-sample-data.sql` contains clean, realistic sample data for GearVN News Blog v2.0.

---

## 📦 What's Included

### 1. **Users** (10 accounts)
- 1 Admin account
- 9 Regular users
- Full profiles with avatars, bios
- Different levels (1-10)
- Activity streaks
- Preferences (dark/light theme)

**Test Accounts:**
```
Email: admin@gearvn.com
Password: password123
Role: admin

Email: techguru@example.com  
Password: password123
Role: user
```

### 2. **Creators** (5 YouTubers/Bloggers)
- Scrapshut (Vietnamese tech channel)
- Linus Tech Tips
- Gamers Nexus
- JayzTwoCents
- Hardware Unboxed

Each has:
- Avatar, description, verified status
- Social media accounts (YouTube, Facebook, Twitter)
- Follower counts

### 3. **Tags** (15 categories)
Gaming, PC Build, Laptop, GPU, CPU, Mouse, Keyboard, Monitor, Storage, RAM, Cooling, Case, PSU, Audio, Tutorial

### 4. **Products** (10 items)
Complete with:
- Categories (5): Laptop, PC Components, Peripherals, Cooling, Audio
- Brands (10): ASUS, Logitech, Razer, NVIDIA, AMD, Samsung, Corsair, LG, NZXT, HyperX
- Prices in VNĐ
- Images and GearVN URLs

Products include:
- ASUS ROG Strix G15 Laptop (35.99M)
- Logitech G Pro X Superlight (3.29M)
- RTX 4090 (45.99M)
- AMD Ryzen 9 7950X (15.99M)
- And more...

### 5. **Posts** (10 articles/videos)
Mix of:
- 4 Reviews
- 3 Articles  
- 2 Videos
- 1 Tutorial

Topics:
- Laptop reviews
- PC build guides
- Hardware comparisons
- How-to tutorials

Each post has:
- Title, slug, description
- Full HTML content
- Thumbnail
- View counts, vote counts
- Linked to creators
- Tagged appropriately
- Products mentioned

### 6. **Comments** (16 total)
- 10 top-level comments
- 6 nested replies
- Realistic Vietnamese discussions
- Upvote counts

### 7. **Squads** (5 communities)
- PC Builders Vietnam (3 members)
- Gaming Gear Reviews (3 members)
- Laptop Gaming Club (2 members)
- Overclockers VN (2 members)
- Budget PC Builds (3 members)

Each squad has:
- Name, description, avatar
- Creator/owner
- Members with roles (admin, moderator, member)

### 8. **Gamification**
**Achievements** (7):
- First Post (+100 points)
- 10 Posts (+500 points)
- First Comment (+50 points)
- Helpful (50 upvotes, +300 points)
- Popular (100 upvotes, +800 points)
- 7 Day Streak (+200 points)
- 30 Day Streak (+1000 points)

**User achievements:**
- Admin: First Post, 30 Day Streak
- Several users with various achievements

### 9. **Interactions**
- **Votes:** 9 post upvotes from various users
- **Comment Votes:** 4 comment upvotes
- **Bookmarks:** 5 saved posts
- **Follows:** 6 creator follows

### 10. **Sources** (5 feeds)
- Scrapshut YouTube
- Linus Tech Tips YouTube
- Gamers Nexus YouTube
- Tom's Hardware RSS
- AnandTech RSS

---

## 🎯 Data Quality

### Clean & Consistent
✅ All UUIDs are properly formatted  
✅ All foreign keys reference existing records  
✅ No orphaned data  
✅ Proper use of NULL values  
✅ Realistic Vietnamese content  

### Realistic Data
✅ Authentic Vietnamese tech content  
✅ Real YouTuber/brand names  
✅ Actual product prices (approximate)  
✅ Realistic engagement metrics  
✅ Natural comment threads  

### Complete Relationships
✅ Posts → Creators (many-to-many)  
✅ Posts → Tags (many-to-many)  
✅ Posts → Products (many-to-many)  
✅ Posts → Comments (one-to-many)  
✅ Comments → Replies (nested)  
✅ Users → Squads (many-to-many)  
✅ Users → Follows (many-to-many)  

---

## 📈 Statistics

| Entity | Count |
|--------|-------|
| Users | 10 |
| Creators | 5 |
| Tags | 15 |
| Product Categories | 5 |
| Brands | 10 |
| Products | 10 |
| Sources | 5 |
| Posts | 10 |
| Comments | 16 (10 + 6 replies) |
| Squads | 5 |
| Squad Members | 13 |
| Achievements | 7 |
| User Achievements | 7 earned |
| Votes | 9 |
| Bookmarks | 5 |
| Follows | 6 |

---

## 🔄 Usage

### First Time Setup
```sql
-- 1. Create schema
\i database/02-new-complete-schema.sql

-- 2. Load sample data
\i database/seed-sample-data.sql
```

### Reset & Reload
```sql
-- 1. Clean all data
\i database/00-clean-data.sql

-- 2. Load sample data again
\i database/seed-sample-data.sql
```

---

## ✅ Verification

After loading, verify with:

```sql
-- Check record counts
SELECT 'users' as table_name, COUNT(*) FROM users
UNION ALL SELECT 'posts', COUNT(*) FROM posts
UNION ALL SELECT 'creators', COUNT(*) FROM creators
UNION ALL SELECT 'tags', COUNT(*) FROM tags
UNION ALL SELECT 'products', COUNT(*) FROM products
UNION ALL SELECT 'comments', COUNT(*) FROM comments
UNION ALL SELECT 'squads', COUNT(*) FROM squads;
```

**Expected:**
```
users:    10
posts:    10
creators: 5
tags:     15
products: 10
comments: 16
squads:   5
```

---

## 🎨 Customization

Want to add more data? Edit `seed-sample-data.sql`:

1. **Add more users:** Copy user insert pattern
2. **Add more posts:** Use existing post IDs (p11, p12, etc.)
3. **Add more products:** Ensure category_id and brand_id exist
4. **Add more comments:** Reference existing post_id
5. **Add more squads:** Create with unique slug

---

## 📝 Notes

- **Passwords:** All users have password `password123` (bcrypt hashed)
- **UUIDs:** Use standard UUID v4 format
- **Timestamps:** Use PostgreSQL interval syntax
- **Images:** Placeholder URLs (update with real URLs)
- **Prices:** In Vietnamese Dong (VNĐ)

---

**Last Updated:** 2025-01-18  
**Version:** 1.0  
**Schema Version:** 2.0
