# 👤 USER PROFILE & COMPANY PROFILE SYSTEM

**Date:** 2025-11-06
**Status:** 🚧 In Progress

---

## 📋 OVERVIEW

Hệ thống profile cho phép:

### **User Profile:**
- ✅ Edit profile (avatar, bio, social links)
- ✅ View own posts, saved posts, upvoted posts, comments
- ✅ Follow/unfollow users và companies
- ✅ Associate với company (add công ty vào profile)
- ✅ View followers/following lists

### **Company Profile:**
- ✅ Company page với logo, cover image, description
- ✅ Company posts
- ✅ Employees list
- ✅ Followers
- ✅ Social links & contact info

---

## 🗄️ DATABASE SCHEMA

### **Tables Created:**

#### **1. `users` table**
Extended user profile information:

```sql
- id (PK)
- email, username, full_name
- avatar_url, bio
- location, website
- twitter_url, facebook_url, linkedin_url, github_url, youtube_url
- role ('user', 'admin', 'creator')
- is_verified
- company_id (FK → companies)
- job_title
- followers_count, following_count, posts_count
- created_at, updated_at, last_login_at
```

#### **2. `companies` table**
Company profiles:

```sql
- id (PK)
- name, slug
- logo_url, cover_image_url
- description, tagline
- website, email, phone
- address, city, country
- twitter_url, facebook_url, linkedin_url, youtube_url
- industry, company_size, founded_year
- is_verified
- owner_id (FK → users)
- followers_count, posts_count, employees_count
- created_at, updated_at
```

#### **3. `user_followers` table**
User → User follows:

```sql
- id (PK)
- follower_id (FK → users)
- following_id (FK → users)
- created_at
- UNIQUE(follower_id, following_id)
```

#### **4. `company_followers` table**
User → Company follows:

```sql
- id (PK)
- user_id (FK → users)
- company_id (FK → companies)
- created_at
- UNIQUE(user_id, company_id)
```

#### **5. `user_saved_posts` table**
Saved posts:

```sql
- id (PK)
- user_id (FK → users)
- post_id (FK → posts)
- created_at
- UNIQUE(user_id, post_id)
```

#### **6. `user_upvotes` table**
Upvoted posts:

```sql
- id (PK)
- user_id (FK → users)
- post_id (FK → posts)
- created_at
- UNIQUE(user_id, post_id)
```

### **Updated Tables:**

#### **`posts` table** - Added columns:
```sql
- author_type ('user' | 'company')
- author_id (user_id or company_id)
- company_id (nullable)
```

#### **`comments` table** - Added columns:
```sql
- author_type ('user' | 'company')
- company_id (nullable)
```

---

## 🚀 SETUP INSTRUCTIONS

### **STEP 1: Run SQL Migration**

**Via Supabase SQL Editor:**

1. Go to: https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz
2. Click **SQL Editor**
3. Click **New Query**
4. Copy content from `database/create_users_companies.sql`
5. Paste and click **Run**

✅ This will create:
- 6 new tables
- 3 sample users
- 1 sample company (GearVN)
- Triggers for auto-updating counts
- Row Level Security policies

### **STEP 2: Verify Data**

```sql
-- Check users
SELECT id, username, full_name, role FROM users;

-- Check company
SELECT id, name, slug, owner_id FROM companies;
```

Expected results:
- **3 users:** gearvn_admin, duong_gearvn, testuser
- **1 company:** GearVN

---

## 🎨 PAGES TO CREATE

### **1. User Profile Page** (`profile.html`)

**URL Pattern:**
```
/profile.html?user=username
/profile.html?user=gearvn_admin
```

**Features:**
- ✅ Profile header với avatar, cover image
- ✅ User info: name, username, bio, location, website
- ✅ Social links (Twitter, Facebook, LinkedIn, GitHub)
- ✅ Stats: Posts count, Followers, Following
- ✅ Company badge (if user works at a company)
- ✅ Verified badge (if user is verified)
- ✅ Edit Profile button (for own profile)
- ✅ Follow button (for other users)

**Tabs:**
1. **Posts** - User's own posts
2. **Saved** - Saved posts (only visible to owner)
3. **Upvoted** - Upvoted posts (only visible to owner)
4. **Comments** - User's comments
5. **Following** - Users/companies user is following

---

### **2. Company Profile Page** (`company.html`)

**URL Pattern:**
```
/company.html?slug=company-slug
/company.html?slug=gearvn
```

**Features:**
- ✅ Company header với logo, cover image
- ✅ Company info: name, tagline, description
- ✅ Contact info: website, email, phone, address
- ✅ Social links
- ✅ Stats: Posts count, Followers, Employees
- ✅ Industry, company size, founded year
- ✅ Verified badge
- ✅ Edit Company button (for owner)
- ✅ Follow button

**Tabs:**
1. **Posts** - Company posts
2. **About** - Company details & description
3. **Team** - Employees list
4. **Followers** - Company followers

---

### **3. Settings Page** (`settings.html`)

**Sections:**
1. **Profile Settings**
   - Edit avatar, name, bio
   - Social links
   - Location, website

2. **Account Settings**
   - Email, username
   - Password change
   - Delete account

3. **Privacy Settings**
   - Profile visibility
   - Show email publicly
   - Show activity

4. **Company Association**
   - Link to company
   - Job title
   - Unlink from company

---

## 🔄 WORKFLOWS

### **Workflow 1: Edit User Profile**

```
User clicks "Edit Profile" →
Modal opens →
User updates:
  - Avatar URL
  - Full name
  - Bio (max 500 chars)
  - Location
  - Website
  - Social links (Twitter, Facebook, LinkedIn, GitHub) →
Click "Save Changes" →
Profile updated in database →
Modal closes →
Profile page refreshes
```

### **Workflow 2: Follow Another User**

```
User A visits User B's profile →
Click "Follow" button →
Insert into user_followers:
  {follower_id: userA, following_id: userB} →
Update counts:
  - User A: following_count + 1
  - User B: followers_count + 1 →
Button changes to "Following" →
User can click "Following" to unfollow
```

### **Workflow 3: Follow Company**

```
User visits Company page →
Click "Follow" button →
Insert into company_followers:
  {user_id: userId, company_id: companyId} →
Update counts:
  - Company: followers_count + 1 →
Button changes to "Following"
```

### **Workflow 4: Save Post**

```
User clicks Bookmark icon on post →
Insert into user_saved_posts:
  {user_id: userId, post_id: postId} →
Icon changes to filled bookmark →
Post appears in "Saved" tab on profile
```

### **Workflow 5: Associate with Company**

```
User goes to Settings →
Click "Add Company" →
Modal with company search →
Select company →
Enter job title →
Save →
Update users table:
  {company_id: companyId, job_title: "Content Creator"} →
Company badge appears on profile →
User appears in company's "Team" tab
```

---

## 📊 SAMPLE DATA

### **Sample Users:**

#### **User 1: gearvn_admin**
```json
{
  "id": "user-1",
  "username": "gearvn_admin",
  "full_name": "GearVN Admin",
  "email": "admin@gearvn.com",
  "avatar_url": "https://ui-avatars.com/api/?name=GearVN&background=ef4444&color=fff&size=256",
  "bio": "Official GearVN account",
  "role": "admin",
  "is_verified": true
}
```

#### **User 2: duong_gearvn**
```json
{
  "id": "user-2",
  "username": "duong_gearvn",
  "full_name": "Dương Nguyễn",
  "email": "duong@gearvn.com",
  "avatar_url": "https://ui-avatars.com/api/?name=Duong+Nguyen&background=3b82f6&color=fff&size=256",
  "bio": "Tech enthusiast & reviewer",
  "role": "creator",
  "is_verified": true,
  "company_id": 1,
  "job_title": "Content Creator"
}
```

### **Sample Company:**

#### **GearVN**
```json
{
  "id": 1,
  "name": "GearVN",
  "slug": "gearvn",
  "logo_url": "https://ui-avatars.com/api/?name=GearVN&background=ef4444&color=fff&size=256",
  "description": "GearVN - Hệ thống cửa hàng gaming gear, PC, laptop uy tín hàng đầu Việt Nam",
  "tagline": "Your trusted gaming gear store",
  "website": "https://gearvn.com",
  "industry": "Gaming & Technology",
  "company_size": "201-500",
  "founded_year": 2015,
  "owner_id": "user-1",
  "is_verified": true
}
```

---

## 🎯 API ENDPOINTS (Supabase REST)

### **Get User Profile:**
```
GET /rest/v1/users?username=eq.{username}
```

### **Update User Profile:**
```
PATCH /rest/v1/users?id=eq.{userId}
Body: {full_name, bio, avatar_url, ...}
```

### **Follow User:**
```
POST /rest/v1/user_followers
Body: {follower_id, following_id}
```

### **Unfollow User:**
```
DELETE /rest/v1/user_followers?follower_id=eq.{userId}&following_id=eq.{targetUserId}
```

### **Get User's Posts:**
```
GET /rest/v1/posts?author_id=eq.{userId}&author_type=eq.user&order=created_at.desc
```

### **Get User's Saved Posts:**
```
GET /rest/v1/user_saved_posts?user_id=eq.{userId}&select=*,posts(*)
```

### **Get User's Following:**
```
GET /rest/v1/user_followers?follower_id=eq.{userId}&select=*,users!following_id(*)
```

### **Get Company Profile:**
```
GET /rest/v1/companies?slug=eq.{slug}
```

### **Get Company Employees:**
```
GET /rest/v1/users?company_id=eq.{companyId}
```

---

## ✅ FEATURES CHECKLIST

### **User Profile:**
- [ ] Profile header với avatar & cover
- [ ] Edit profile modal
- [ ] Social links display
- [ ] Stats (posts, followers, following)
- [ ] Tabs (Posts, Saved, Upvoted, Comments, Following)
- [ ] Follow/Unfollow button
- [ ] Company badge

### **Company Profile:**
- [ ] Company header với logo & cover
- [ ] Edit company modal
- [ ] Contact info display
- [ ] Stats (posts, followers, employees)
- [ ] Tabs (Posts, About, Team, Followers)
- [ ] Follow button

### **Settings:**
- [ ] Profile settings
- [ ] Account settings
- [ ] Privacy settings
- [ ] Company association

### **Interactions:**
- [ ] Save/unsave posts
- [ ] Upvote/unupvote posts
- [ ] Comment on posts
- [ ] Follow/unfollow users
- [ ] Follow/unfollow companies

---

## 🧪 TESTING

### **Test 1: View User Profile**
```
1. Run SQL migration
2. Access: http://localhost:5500/profile.html?user=duong_gearvn
3. Should see:
   - Avatar, name, bio
   - Company badge (works at GearVN)
   - Role badge (Creator)
   - Verified badge
```

### **Test 2: Edit Profile**
```
1. Click "Edit Profile" button
2. Update bio to "Tech reviewer & gamer"
3. Add Twitter: https://twitter.com/duong
4. Click "Save Changes"
5. Profile should update
```

### **Test 3: Follow User**
```
1. Login as testuser
2. Visit duong_gearvn profile
3. Click "Follow" button
4. Check database:
   SELECT * FROM user_followers WHERE follower_id='user-3' AND following_id='user-2';
5. Button should change to "Following"
```

---

## 🚨 TODO

- [ ] Run SQL migration
- [ ] Create profile.html page
- [ ] Create profile.js logic
- [ ] Create company.html page
- [ ] Create company.js logic
- [ ] Create settings.html page
- [ ] Add avatar upload to cloud storage
- [ ] Add image optimization
- [ ] Add follow suggestions
- [ ] Add activity feed

---

**Next Steps:**
1. Run SQL migration in Supabase
2. Implement profile.js with API calls
3. Create company.html
4. Test all workflows

Would you like me to continue with the implementation?
