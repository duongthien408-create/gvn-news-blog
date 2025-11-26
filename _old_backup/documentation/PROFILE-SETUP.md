# 🚀 SETUP INSTRUCTIONS - User & Company Profiles

**Date:** 2025-11-06
**Status:** ✅ Code Ready - Needs Database Migration

---

## ✅ COMPLETED

1. **User Profile Page** ([profile.html](profile.html))
   - Full profile UI with avatar, bio, social links
   - Activity tabs: Posts, Saved, Upvoted, Following
   - Follow/unfollow functionality
   - Works with Supabase REST API

2. **Company Profile Page** ([company.html](company.html))
   - Company header with logo and cover image
   - Company info, stats, social links
   - Tabs: Posts, About, Team, Followers
   - Follow company functionality

3. **JavaScript Implementation**
   - [scripts/profile.js](scripts/profile.js) - User profile logic
   - [scripts/company.js](scripts/company.js) - Company profile logic
   - Full CRUD operations via Supabase REST API

---

## 🔴 CRITICAL: RUN SQL MIGRATION FIRST

Before testing the profile pages, you MUST run the SQL migration to create the necessary database tables.

### **Step 1: Copy SQL Migration**

Open the file: [database/update_users_add_profile_fields.sql](database/update_users_add_profile_fields.sql)

Copy **ALL** content from this file.

### **Step 2: Run in Supabase SQL Editor**

1. Go to: https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz/sql
2. Click **"New Query"**
3. Paste the SQL content
4. Click **"Run"** (or press `Ctrl+Enter`)

### **Step 3: Verify Tables Created**

After running the migration, verify the tables exist:

```sql
-- Check users table has new columns
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'users'
AND column_name IN ('full_name', 'bio', 'company_id', 'followers_count');

-- Check companies table exists
SELECT * FROM companies LIMIT 1;

-- Check relationship tables exist
SELECT * FROM user_followers LIMIT 1;
SELECT * FROM company_followers LIMIT 1;
SELECT * FROM user_saved_posts LIMIT 1;
```

**Expected Results:**
- Users table should have 4 rows returned (full_name, bio, company_id, followers_count)
- Companies table should have 1 row (GearVN)
- Relationship tables should exist (may be empty)

---

## 🧪 TESTING THE PROFILE PAGES

### **Test 1: View Sample User Profile**

After running the migration, check if users exist:

```sql
SELECT id, username, email, role FROM users LIMIT 5;
```

**Access a profile:**

```
http://localhost:5500/profile.html?user=[username]
```

Example (if admin user exists):
```
http://localhost:5500/profile.html?user=admin
```

**Expected Result:**
- Profile page loads
- Shows user avatar, username
- Shows tabs: Posts, Following (Saved/Upvoted if own profile)

### **Test 2: View Company Profile**

**Check if sample company exists:**

```sql
SELECT id, name, slug FROM companies LIMIT 1;
```

**Access company profile:**

```
http://localhost:5500/company.html?slug=gearvn
```

**Expected Result:**
- Company page loads
- Shows company logo, name, description
- Shows tabs: Posts, About, Team, Followers

---

## 📝 DATABASE STRUCTURE

After running the migration, you'll have:

### **Extended `users` table:**
```
- id (INTEGER) - Primary Key
- email, username, avatar_url - Existing
- full_name, bio, location, website - NEW
- twitter_url, facebook_url, linkedin_url, github_url, youtube_url - NEW
- is_verified, company_id, job_title - NEW
- followers_count, following_count, posts_count - NEW
```

### **New `companies` table:**
```
- id (SERIAL) - Primary Key
- name, slug, logo_url, cover_image_url
- description, tagline
- website, email, phone
- address, city, country
- social URLs
- industry, company_size, founded_year
- is_verified, owner_id
- followers_count, posts_count, employees_count
```

### **New relationship tables:**
- `user_followers` - User-to-user follows
- `company_followers` - User-to-company follows
- `user_saved_posts` - Bookmarked posts

---

## 🔧 TROUBLESHOOTING

### **Error: "column users.full_name does not exist"**

**Solution:** You haven't run the SQL migration yet. Go back to Step 1 above.

### **Error: "Could not find the table 'public.companies'"**

**Solution:** The migration didn't complete successfully. Check for SQL errors in Supabase SQL Editor.

### **Error: "User not found" on profile page**

**Check:**
1. Username doesn't exist in database
2. Run: `SELECT * FROM users WHERE username = 'your-username';`
3. Create a test user if needed

---

## 🎯 NEXT STEPS (AFTER MIGRATION)

1. **Create/Update sample users:**
   ```sql
   UPDATE users SET
     full_name = 'Your Name',
     bio = 'Your bio here',
     location = 'Ho Chi Minh City'
   WHERE id = 1;
   ```

2. **Test follow functionality:**
   - Login as a user
   - Visit another user's profile
   - Click "Follow" button

3. **Add profile edit modal** (Future task)

---

## 📚 RELATED FILES

- **Documentation:** [documentation/USER-PROFILE-GUIDE.md](documentation/USER-PROFILE-GUIDE.md)
- **SQL Migration:** [database/update_users_add_profile_fields.sql](database/update_users_add_profile_fields.sql) ⭐
- **Pages:** [profile.html](profile.html), [company.html](company.html)
- **Scripts:** [scripts/profile.js](scripts/profile.js), [scripts/company.js](scripts/company.js)

---

## ✅ CHECKLIST

- [ ] Run SQL migration in Supabase
- [ ] Verify tables created
- [ ] Check sample data exists
- [ ] Access user profile page
- [ ] Access company profile page
- [ ] Test tab switching

---

**👉 NEXT ACTION:** Run the SQL migration!

Copy: `database/update_users_add_profile_fields.sql`
Paste into: https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz/sql
