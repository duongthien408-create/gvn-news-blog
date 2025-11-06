# 🎛️ SETTINGS CMS - User Guide

**Date:** 2025-11-06
**Status:** ✅ Complete & Ready to Use

---

## 📋 Overview

CMS Settings page cho phép users quản lý profile cá nhân, company profile, posts và account settings.

**URL:** http://localhost:5500/settings.html

---

## ✨ Tính năng chính

### 1. **Profile Settings** (Tab 1)

Chỉnh sửa thông tin cá nhân:

- ✅ Upload/change avatar (via URL)
- ✅ Edit full name & username
- ✅ Add bio (giới thiệu bản thân)
- ✅ Add location & website
- ✅ Select company từ danh sách
- ✅ Set job title (chức danh)
- ✅ Add social links:
  - Twitter
  - Facebook
  - LinkedIn
  - GitHub
  - YouTube

**Cách sử dụng:**
1. Vào tab "Profile"
2. Chỉnh sửa các field
3. Click "Save Changes"

**Avatar:**
- Nhập URL của ảnh avatar
- Preview sẽ tự động cập nhật
- Để trống sẽ dùng auto-generated avatar

---

### 2. **Company Settings** (Tab 2)

Quản lý company profile (nếu user thuộc công ty):

- ✅ Update company logo
- ✅ Edit company name & slug
- ✅ Update tagline & description
- ✅ Edit website & industry
- ✅ View company info

**Lưu ý:**
- Chỉ hiển thị nếu user đã được assign vào company
- Nếu chưa có company, sẽ hiện thông báo

---

### 3. **Posts Management** (Tab 3)

Quản lý tất cả bài viết của user:

**Features:**
- ✅ List all posts (video & article)
- ✅ View post stats (views, date)
- ✅ Edit post (redirect to edit page)
- ✅ Delete post (with confirmation)

**Post Actions:**
- **Edit:** Click "Edit" button → redirect to `edit-post.html?id={id}`
- **Delete:** Click "Delete" → confirm → xóa post

---

### 4. **Account Settings** (Tab 4)

Cài đặt bảo mật:

- ✅ View email (read-only)
- ✅ Change password button
- ✅ Delete account (danger zone)

---

## 🎯 User Flow

### Flow 1: Edit Profile

```
1. User vào settings.html
2. Mặc định hiển thị tab "Profile"
3. User chỉnh sửa thông tin (name, bio, avatar, social links)
4. User chọn company từ dropdown
5. User click "Save Changes"
6. System update database
7. Redirect về profile.html?user={username}
```

### Flow 2: Edit Company

```
1. User vào tab "Company"
2. Nếu có company → hiển thị form edit
3. User chỉnh sửa company info (logo, tagline, description)
4. User click "Save Changes"
5. System update company trong database
6. Redirect về company.html?slug={slug}
```

### Flow 3: Manage Posts

```
1. User vào tab "Posts"
2. System load all posts của user
3. User thấy danh sách posts với actions (Edit/Delete)
4. User click "Delete" → Confirm → Post bị xóa
5. User click "Edit" → Redirect to edit page
```

---

## 🛠️ Technical Details

### Files Created:

1. **[settings.html](settings.html)** - Main settings page
2. **[scripts/settings.js](scripts/settings.js)** - Settings logic

### API Endpoints Used:

```javascript
// Get current user
GET /users?select=*&limit=1

// Update user profile
PATCH /users?id=eq.{userId}

// Get all companies
GET /companies?select=id,name,slug&order=name.asc

// Get user company
GET /companies?id=eq.{companyId}

// Update company
PATCH /companies?id=eq.{companyId}

// Get user posts
GET /posts?creator_id=eq.{userId}&order=created_at.desc

// Delete post
DELETE /posts?id=eq.{postId}
```

### Database Tables:

**Updated:**
- `users` - profile info, social links
- `companies` - company info, logo

**Read:**
- `posts` - user posts for management

---

## 📸 Screenshot Flow

### Tab 1: Profile Settings
```
+------------------------------------------+
|  Profile Picture                         |
|  [Avatar Preview]  [Avatar URL input]    |
+------------------------------------------+
|  Basic Information                       |
|  [Full Name] [Username]                  |
|  [Bio]                                   |
|  [Location] [Website]                    |
+------------------------------------------+
|  Company & Role                          |
|  [Company dropdown] [Job Title]          |
+------------------------------------------+
|  Social Links                            |
|  [Twitter] [Facebook]                    |
|  [LinkedIn] [GitHub] [YouTube]           |
+------------------------------------------+
|              [Cancel] [Save Changes]     |
+------------------------------------------+
```

### Tab 2: Company Settings
```
+------------------------------------------+
|  Company Logo                            |
|  [Logo Preview]  [Logo URL input]        |
+------------------------------------------+
|  Company Information                     |
|  [Name] [Slug]                           |
|  [Tagline]                               |
|  [Description]                           |
|  [Website] [Industry]                    |
+------------------------------------------+
|              [Cancel] [Save Changes]     |
+------------------------------------------+
```

### Tab 3: Posts Management
```
+------------------------------------------+
|  Your Posts (30)                         |
+------------------------------------------+
|  [Thumbnail] RTX 4090 Review             |
|  📅 06/11/2025  👁️ 1.2K  [VIDEO]       |
|                        [Edit] [Delete]   |
+------------------------------------------+
|  [Thumbnail] Ryzen 7950X3D Review        |
|  📅 05/11/2025  👁️ 850  [VIDEO]        |
|                        [Edit] [Delete]   |
+------------------------------------------+
```

---

## 🧪 Testing Guide

### Test 1: Update Profile

```bash
# Step 1: Open settings
http://localhost:5500/settings.html

# Step 2: Update info
- Change full name
- Add bio
- Add social links
- Select company

# Step 3: Save
Click "Save Changes"

# Expected: Redirect to profile page with updated info
```

### Test 2: Update Company

```bash
# Step 1: Go to Company tab
Click "Company" tab

# Step 2: Update company info
- Change tagline
- Update description
- Change logo URL

# Step 3: Save
Click "Save Changes"

# Expected: Redirect to company page with updated info
```

### Test 3: Delete Post

```bash
# Step 1: Go to Posts tab
Click "Posts" tab

# Step 2: Delete a post
Click "Delete" button on any post

# Step 3: Confirm
Click "OK" in confirmation dialog

# Expected: Post removed from list
```

---

## 🔑 Demo User Credentials

**Demo User:** Thuận Nguyễn
- Username: `thuan_nguyen`
- Email: `thuan@gearvn.com`
- Password: `password123` (for testing only)
- Company: GearVN

**Access:**
```
Profile: http://localhost:5500/profile.html?user=thuan_nguyen
Settings: http://localhost:5500/settings.html
```

---

## 🎨 UI Components

### Form Elements:
- Text inputs với Tailwind styling
- Textarea cho bio/description
- Dropdown cho company selection
- Avatar/Logo preview với real-time update
- Save/Cancel buttons

### Sections:
- Profile Picture section
- Basic Information section
- Company & Role section
- Social Links section
- Posts list với edit/delete actions

---

## ⚠️ Important Notes

### Security:
- Password change chỉ là placeholder (cần implement)
- Delete account chỉ là placeholder (cần implement)
- Avatar upload qua URL (chưa có file upload to Supabase Storage)

### Current Limitations:
- Chưa có real authentication (dùng first user as demo)
- Avatar upload via URL only (không có file upload UI)
- Edit post redirect to `edit-post.html` (page này chưa tạo)

### TODO:
- [ ] Implement real authentication
- [ ] Add file upload for avatars/logos to Supabase Storage
- [ ] Create `edit-post.html` page
- [ ] Implement password change functionality
- [ ] Implement account deletion

---

## 📦 Next Steps

Sau khi test settings page:

1. **Create Edit Post Page:**
   ```
   edit-post.html + scripts/edit-post.js
   ```

2. **Add File Upload:**
   - Supabase Storage bucket for avatars
   - File upload UI component
   - Image cropping/resizing

3. **Implement Auth:**
   - Login/Register pages
   - JWT tokens
   - Protected routes

4. **Add More Features:**
   - Followers/Following management
   - Saved posts management
   - Upvoted posts view

---

## 🚀 Quick Start

```bash
# 1. Start backend (if needed)
cd backend
go run .

# 2. Open frontend
http://localhost:5500/settings.html

# 3. Navigate tabs
- Profile: Edit your profile
- Company: Edit company info
- Posts: Manage your posts
- Account: Security settings
```

---

**Ready to use!** 🎉

All forms are fully functional and connected to Supabase REST API.
