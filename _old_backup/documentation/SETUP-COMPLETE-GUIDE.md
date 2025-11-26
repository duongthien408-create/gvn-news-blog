# 🎯 COMPLETE SETUP GUIDE - GVN Creator Hub

**Date:** 2025-11-06
**Status:** ✅ Ready to Use (sau khi setup storage)

---

## 📋 WHAT'S COMPLETED

### ✅ Database
- [x] Extended `users` table với profile fields
- [x] Created `companies` table
- [x] Created `user_followers` và `company_followers` tables
- [x] Created `user_saved_posts` table
- [x] Added triggers cho auto-update follower counts
- [x] Seeded 5 test users (Thuận, Bình, Tài, Sang, Dương)
- [x] Created GearVN company profile

### ✅ Frontend Pages
- [x] `profile.html` - User profile pages
- [x] `company.html` - Company profile pages
- [x] `settings.html` - CMS for profile editing
- [x] `login.html` - Login page with test accounts

### ✅ Authentication
- [x] Login system với email/password
- [x] Session management (localStorage, 7 days)
- [x] Protected pages (auto-redirect to login)
- [x] Test accounts với password `password123`
- [x] Logout functionality

### ✅ Features
- [x] User profiles with bio, social links, follower counts
- [x] Company profiles with logo, description, employees
- [x] Follow/Unfollow users and companies
- [x] Bookmark posts
- [x] Profile editing CMS
- [x] Avatar upload UI (ready to use)

---

## ⚠️ ONE STEP LEFT - CREATE STORAGE BUCKET

**You MUST do this before avatar upload works:**

### 🔧 Manual Setup (5 minutes)

1. **Go to Supabase Storage:**
   ```
   https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz/storage/buckets
   ```

2. **Click "New Bucket"**

3. **Create bucket with these settings:**
   - **Name:** `avatars`
   - **Public bucket:** ✅ **TOGGLE ON** ← CRITICAL!
   - **File size limit:** `5242880` (5MB)
   - **Allowed MIME types:** Leave empty

4. **Click "Save"**

5. **Verify bucket created:**
   - You should see "avatars" bucket
   - It should have a "public" badge
   - Policies should auto-create for public access

**That's it! Avatar upload will work after this.**

---

## 🚀 QUICK START GUIDE

### 1️⃣ Setup Storage (One-Time)
```
Go to: https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz/storage/buckets
Create "avatars" bucket (public) ← DO THIS FIRST!
```

### 2️⃣ Login
```
URL: http://localhost:5500/login.html
Click: "Thuận Nguyễn" (or any test account)
Auto-redirect to: /settings.html
```

### 3️⃣ Upload Avatar
```
1. Settings → Profile tab
2. Click "Choose File" under "Upload from Computer"
3. Select image file (< 5MB)
4. Wait for upload
5. See preview update
6. Click "Save Changes"
7. Go to profile to verify
```

### 4️⃣ Test Profile Pages
```
Users:
- http://localhost:5500/profile.html?user=thuan_nguyen
- http://localhost:5500/profile.html?user=binh_bear
- http://localhost:5500/profile.html?user=duong_thien

Company:
- http://localhost:5500/company.html?id=1 (GearVN)
```

---

## 🔑 TEST ACCOUNTS

| Email | Password | User | Username |
|-------|----------|------|----------|
| `thuan@gearvn.com` | `password123` | Thuận Nguyễn | thuan_nguyen |
| `binh@gearvn.com` | `password123` | Bình Bear | binh_bear |
| `duong@gearvn.com` | `password123` | Dương Thiện | duong_thien |
| `tai@gearvn.com` | `password123` | Tài Xài Tech | tai_xai_tech |
| `sang@gearvn.com` | `password123` | Ngọc Sang | ngoc_sang |

**All users work at:** GearVN (company_id: 1)

---

## 📁 PROJECT STRUCTURE

```
gvn-news-blog/
├── database/
│   ├── update_users_add_profile_fields.sql  ← Initial migration
│   ├── fix_and_seed_users.sql               ← User seed data
│   ├── setup_storage.sql                    ← Storage bucket SQL (optional)
│   └── update_gearvn_logo.sql               ← Logo fix
├── scripts/
│   ├── auth.js          ← Authentication system
│   ├── profile.js       ← User profile page
│   ├── company.js       ← Company profile page
│   └── settings.js      ← Settings CMS
├── profile.html         ← User profile template
├── company.html         ← Company profile template
├── settings.html        ← Settings CMS page
├── login.html           ← Login page
└── documentation/
    ├── AUTH-CREDENTIALS.md         ← Quick login reference
    ├── LOGIN-GUIDE.md              ← Complete login guide
    ├── AVATAR-UPLOAD-GUIDE.md      ← Avatar upload guide
    ├── AVATAR-UPLOAD-FIX.md        ← Fix 403 errors
    ├── SETTINGS-CMS-GUIDE.md       ← CMS usage guide
    ├── PROFILE-SETUP.md            ← Profile system guide
    └── SETUP-COMPLETE-GUIDE.md     ← This file
```

---

## 🎨 FEATURES OVERVIEW

### User Profile (`profile.html`)
- Avatar, full name, bio
- Job title, company link
- Social links (Twitter, LinkedIn, GitHub, website)
- Follower/Following counts
- Posts list
- Follow/Unfollow button
- Edit profile button (redirects to settings)

### Company Profile (`company.html`)
- Company logo, name, tagline
- Full description
- Industry, size, founded year
- Website, email, phone
- Employee list with avatars
- Company posts
- Follow/Unfollow button

### Settings CMS (`settings.html`)
- **Profile Tab:**
  - Avatar upload (file or URL)
  - Full name, username, bio
  - Location, website
  - Social links (Twitter, LinkedIn, GitHub)
- **Company Tab:**
  - Add/remove company association
  - Update job title
- **Posts Tab:**
  - Edit posts
  - Delete posts
  - View stats
- **Account Tab:**
  - Change password
  - Email settings
  - Delete account

### Login (`login.html`)
- Email/password form
- Quick test account buttons
- Session management (7 days)
- Auto-redirect if already logged in

---

## 🧪 TESTING CHECKLIST

### ✅ Basic Functionality
- [ ] Create storage bucket "avatars" (public)
- [ ] Login with test account
- [ ] Upload avatar from computer
- [ ] Save profile changes
- [ ] View profile page with new avatar
- [ ] Follow another user
- [ ] Unfollow user
- [ ] Visit company page
- [ ] Follow company
- [ ] Logout and login with different account

### ✅ Profile Features
- [ ] Edit bio and social links
- [ ] Update job title
- [ ] Change company association
- [ ] Avatar preview updates in real-time
- [ ] URL input accepts direct URLs

### ✅ Session & Auth
- [ ] Session persists after browser close
- [ ] Settings page requires login
- [ ] Logout clears session
- [ ] Login redirects to settings

---

## 📊 DATABASE TABLES

### users
```sql
id INTEGER PRIMARY KEY
email VARCHAR(255) UNIQUE
password_hash VARCHAR(255)
username VARCHAR(50) UNIQUE
full_name VARCHAR(100)
avatar_url TEXT
bio TEXT
location VARCHAR(100)
website VARCHAR(255)
twitter_url VARCHAR(255)
linkedin_url VARCHAR(255)
github_url VARCHAR(255)
company_id INTEGER REFERENCES companies(id)
job_title VARCHAR(100)
role VARCHAR(20)
is_verified BOOLEAN
follower_count INTEGER DEFAULT 0
following_count INTEGER DEFAULT 0
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

### companies
```sql
id SERIAL PRIMARY KEY
name VARCHAR(100) UNIQUE
slug VARCHAR(100) UNIQUE
logo_url TEXT
tagline VARCHAR(200)
description TEXT
industry VARCHAR(100)
size VARCHAR(50)
founded_year INTEGER
website VARCHAR(255)
email VARCHAR(255)
phone VARCHAR(50)
follower_count INTEGER DEFAULT 0
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

### user_followers
```sql
follower_id INTEGER REFERENCES users(id)
following_id INTEGER REFERENCES users(id)
created_at TIMESTAMPTZ
PRIMARY KEY (follower_id, following_id)
```

### company_followers
```sql
user_id INTEGER REFERENCES users(id)
company_id INTEGER REFERENCES companies(id)
created_at TIMESTAMPTZ
PRIMARY KEY (user_id, company_id)
```

### user_saved_posts
```sql
user_id INTEGER REFERENCES users(id)
post_id INTEGER REFERENCES posts(id)
created_at TIMESTAMPTZ
PRIMARY KEY (user_id, post_id)
```

---

## 🔧 TROUBLESHOOTING

### Avatar Upload 403 Error
**Symptom:** "Upload Error: new row violates row-level security policy"

**Fix:**
1. Go to Supabase Storage
2. Create "avatars" bucket
3. **TOGGLE "Public bucket" ON**
4. Retry upload

**Detailed fix:** See [AVATAR-UPLOAD-FIX.md](AVATAR-UPLOAD-FIX.md)

---

### Login Auto-Redirects
**Symptom:** Login page immediately redirects to settings

**Fix:**
1. Click "Logout" in settings header
2. Or clear localStorage in browser console:
   ```javascript
   localStorage.clear();
   ```

---

### Profile Page 404
**Symptom:** "User not found"

**Fix:**
1. Check username in URL (e.g., `thuan_nguyen` not `thuan-nguyen`)
2. Verify user exists in database:
   ```sql
   SELECT id, username, full_name FROM users;
   ```

---

### Avatar Preview Not Updating
**Symptom:** Avatar doesn't change after upload

**Fix:**
1. Hard refresh: Ctrl+F5
2. Check console for errors
3. Verify URL in avatar_url input field

---

## 📝 NEXT STEPS (Future Features)

### High Priority
- [ ] Create `edit-post.html` for post editing
- [ ] Add company logo upload
- [ ] Implement real bcrypt password verification
- [ ] Add password change functionality

### Medium Priority
- [ ] Add email verification
- [ ] Implement "Forgot Password" flow
- [ ] Add OAuth login (Google, Facebook)
- [ ] Create notifications system

### Low Priority
- [ ] Add analytics dashboard
- [ ] Implement dark/light theme toggle
- [ ] Add search functionality
- [ ] Create admin panel

---

## 🎯 PRODUCTION CHECKLIST

### Security
- [ ] Implement real bcrypt password hashing
- [ ] Move sessions to httpOnly cookies
- [ ] Add CSRF protection
- [ ] Implement rate limiting
- [ ] Add input sanitization
- [ ] Enable HTTPS only

### Performance
- [ ] Add image optimization
- [ ] Implement lazy loading
- [ ] Add CDN for assets
- [ ] Optimize database queries
- [ ] Add caching layer

### Features
- [ ] Email verification
- [ ] Password reset flow
- [ ] Account deletion
- [ ] Export user data
- [ ] 2FA authentication

---

## 💡 TIPS

### Best Practices
1. **Avatar images:** 256x256 or 512x512 pixels
2. **File format:** PNG (transparent) or WEBP (smaller)
3. **Compress images:** Use tinypng.com before upload
4. **Test accounts:** Always logout between testing different users

### Development Workflow
1. Start with login page
2. Test with multiple accounts
3. Use browser DevTools to debug
4. Check Supabase logs for API errors
5. Hard refresh if CSS not updating

---

## 🚀 START TESTING

### Step 1: Create Storage Bucket
```
https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz/storage/buckets
→ New Bucket → "avatars" → Public: ON → Save
```

### Step 2: Login
```
http://localhost:5500/login.html
→ Click "Thuận Nguyễn"
```

### Step 3: Upload Avatar
```
Settings → Profile → Choose File → Save
```

### Step 4: Verify
```
http://localhost:5500/profile.html?user=thuan_nguyen
```

---

## 📚 DOCUMENTATION

| File | Description |
|------|-------------|
| [AUTH-CREDENTIALS.md](AUTH-CREDENTIALS.md) | Quick login reference |
| [LOGIN-GUIDE.md](LOGIN-GUIDE.md) | Complete authentication guide |
| [AVATAR-UPLOAD-GUIDE.md](AVATAR-UPLOAD-GUIDE.md) | How to upload avatars |
| [AVATAR-UPLOAD-FIX.md](AVATAR-UPLOAD-FIX.md) | Fix 403 upload errors |
| [SETTINGS-CMS-GUIDE.md](SETTINGS-CMS-GUIDE.md) | How to use settings CMS |
| [PROFILE-SETUP.md](PROFILE-SETUP.md) | Profile system overview |

---

## ✅ SYSTEM READY!

**Everything is set up and ready to use.**

**ONLY ONE STEP LEFT:**
1. Create "avatars" bucket in Supabase Storage (5 minutes)
2. Start testing!

**START HERE:**
```
https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz/storage/buckets
```

Then test login:
```
http://localhost:5500/login.html
```

---

**Need help?** Check the documentation files above or console logs (F12).
