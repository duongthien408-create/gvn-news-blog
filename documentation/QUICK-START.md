# 🚀 QUICK START - GVN Creator Hub

**Updated:** 2025-11-06
**Status:** ✅ Ready to Use

---

## ⚡ 4-Step Setup

### 1️⃣ Update Post Creators (One-Time, 1 minute)

```
Go to: https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz/sql/new

Copy & paste this SQL:

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

Click "Run" → Wait ~10 seconds
```

**Why?** Để posts hiển thị tên creator trên homepage.

**Result:** 1,090 posts assigned to 5 users (~218 each).

---

### 2️⃣ Create Storage Bucket (One-Time, 2 minutes)

```
Go to: https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz/storage/buckets

Click "New Bucket"
→ Name: avatars
→ Public: ✅ TOGGLE ON
→ File size: 5242880 (5MB)
→ Click "Save"
```

**Why?** Để upload avatar từ máy lên được.

---

### 3️⃣ Login

```
URL: http://localhost:5500/login.html

Click any test account:
→ Bình Bear (binh@gearvn.com)
→ Thuận Nguyễn (thuan@gearvn.com)
→ Dương Thiện (duong@gearvn.com)

Password (all): password123
```

**Result:** Auto-redirect to homepage with feed.

---

### 4️⃣ Explore!

**Homepage:** `http://localhost:5500/index.html`
- ✅ View feed
- ✅ Like, comment, bookmark posts
- ✅ See avatar in header (top-right)

**Settings:** `http://localhost:5500/settings.html`
- ✅ Edit profile
- ✅ Upload avatar
- ✅ Update bio, social links
- ✅ Change company

**Profile:** `http://localhost:5500/profile.html?user=binh_bear`
- ✅ View public profile
- ✅ See posts
- ✅ Follow/Unfollow

---

## 🎯 Common Tasks

### Upload Avatar
```
1. Login
2. Click avatar → Settings (or sidebar → Settings)
3. Profile tab → "Upload from Computer"
4. Choose image (< 5MB)
5. Wait for upload
6. Click "Save Changes"
```

### Edit Profile
```
1. Settings → Profile tab
2. Update: Full name, bio, location, website
3. Add social links (Twitter, LinkedIn, GitHub)
4. Click "Save Changes"
```

### Navigate
```
Homepage → Click avatar → Dropdown menu:
  → Profile (your profile)
  → Bookmarks
  → Settings
  → Logout

Or use Sidebar:
  → For you (homepage)
  → Following
  → Explore
  → Bookmarks
  → Settings (bottom)
```

---

## 👥 Test Accounts

| User | Email | Username | Role |
|------|-------|----------|------|
| Bình Bear | binh@gearvn.com | binh_bear | Hardware Specialist |
| Thuận Nguyễn | thuan@gearvn.com | thuan_nguyen | Senior Creator |
| Dương Thiện | duong@gearvn.com | duong_thien | Tech Editor |
| Tài Xài Tech | tai@gearvn.com | tai_xai_tech | Tech Consultant |
| Ngọc Sang | sang@gearvn.com | ngoc_sang | Gaming Expert |

**Password for all:** `password123`

**Company:** All work at GearVN

---

## 📚 Documentation

| Guide | Description |
|-------|-------------|
| [SETUP-COMPLETE-GUIDE.md](SETUP-COMPLETE-GUIDE.md) | Complete system overview |
| [LOGIN-GUIDE.md](LOGIN-GUIDE.md) | Login system guide |
| [AVATAR-UPLOAD-GUIDE.md](AVATAR-UPLOAD-GUIDE.md) | How to upload avatars |
| [AVATAR-UPLOAD-FIX.md](AVATAR-UPLOAD-FIX.md) | Fix 403 upload errors |
| [HOMEPAGE-AUTH-UPDATE.md](HOMEPAGE-AUTH-UPDATE.md) | Homepage auth integration |
| [AUTH-CREDENTIALS.md](AUTH-CREDENTIALS.md) | Quick credentials reference |

---

## 🎨 Features

### Homepage
- ✅ Daily feed với posts từ YouTube, Medium, blogs
- ✅ Like, comment, bookmark posts
- ✅ Follow users và companies
- ✅ User menu với avatar (top-right)
- ✅ Settings link trong sidebar

### Settings CMS
- ✅ Profile editing (avatar, bio, social)
- ✅ Company management (add/remove company)
- ✅ Posts management (edit, delete)
- ✅ Account settings

### Profile Pages
- ✅ User profiles: `profile.html?user=username`
- ✅ Company profiles: `company.html?id=1`
- ✅ Follower/Following counts
- ✅ Posts list
- ✅ Follow/Unfollow buttons

---

## 🔧 Troubleshooting

### Avatar Upload 403?
→ Create "avatars" bucket (public) in Supabase Storage
→ See: [AVATAR-UPLOAD-FIX.md](AVATAR-UPLOAD-FIX.md)

### Can't see avatar in header?
→ Hard refresh: Ctrl+F5
→ Check console for errors

### Login redirect to wrong page?
→ Should redirect to `index.html` (homepage)
→ If goes to settings, check [scripts/auth.js](scripts/auth.js#L143)

### Profile page 404?
→ Check username format: `binh_bear` not `binh-bear`
→ Verify user exists: See [AUTH-CREDENTIALS.md](AUTH-CREDENTIALS.md)

---

## 💡 Tips

1. **Test with multiple accounts** - Logout and login with different users to see different profiles
2. **Use browser DevTools** - F12 to check console for errors
3. **Hard refresh if CSS broken** - Ctrl+F5 to clear cache
4. **Compress images before upload** - Use tinypng.com for avatars
5. **Best avatar size** - 256x256 or 512x512 pixels

---

## 🎉 You're Ready!

**Start here:**
```
http://localhost:5500/login.html
→ Click "Bình Bear"
→ Explore homepage
→ Edit profile in Settings
→ Have fun! 🚀
```

**Need help?** Check the documentation above or look at browser console (F12).
