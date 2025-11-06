# 📸 AVATAR UPLOAD - Quick Guide

**Date:** 2025-11-06
**Status:** ✅ Ready to Test

---

## 🎯 Cách Upload Avatar

### Bước 1: Setup Supabase Storage Bucket

**Cần làm 1 lần duy nhất:**

#### Option A: Manual (Recommended)

1. Vào Supabase Dashboard:
   ```
   https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz/storage/buckets
   ```

2. Click **"New Bucket"**

3. Tạo bucket với config:
   - **Name:** `avatars`
   - **Public:** ✅ **YES** (toggle ON)
   - **File size limit:** `5 MB`
   - **Allowed MIME types:**
     - `image/jpeg`
     - `image/png`
     - `image/webp`
     - `image/gif`

4. Click **"Create Bucket"**

5. Bucket policies (auto-set với public):
   - ✅ Public read access
   - ✅ Authenticated uploads

#### Option B: SQL Script

```sql
-- Run in Supabase SQL Editor
-- Copy from: database/setup_storage.sql

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;
```

---

### Bước 2: Login

```
1. Go to: http://localhost:5500/login.html
2. Click any test account (e.g., "Thuận Nguyễn")
3. Auto-redirect to Settings
```

---

### Bước 3: Upload Avatar từ máy

```
1. Go to Settings → Profile tab
2. Section "Profile Picture"
3. Click "Upload from Computer" button
4. Select image file (< 5MB)
5. Wait for upload (loading spinner xuất hiện)
6. Preview tự động update
7. Click "Save Changes" ở cuối form
8. Redirect to profile page với avatar mới
```

---

## 🎨 UI Upload

### File Input:
```
┌─────────────────────────────────────────┐
│  [Avatar Preview 24x24]                 │
│                                         │
│  Upload from Computer                   │
│  [Choose File] No file chosen           │
│  Max 5MB. JPG, PNG, WEBP or GIF        │
│                                         │
│  ─────────────── OR ──────────────────  │
│                                         │
│  Avatar URL                             │
│  [https://example.com/avatar.jpg      ] │
│  Paste image URL directly               │
└─────────────────────────────────────────┘
```

### Upload Flow:
1. **Before:** Avatar preview showing current avatar
2. **Click "Choose File":** File picker opens
3. **Select file:** Validate size/type
4. **Upload:** Loading spinner on avatar
5. **Success:** Green checkmark message + preview updates
6. **Save form:** Avatar URL saved to database

---

## 🔧 Technical Details

### File Validation:

```javascript
// Type check
if (!file.type.startsWith('image/')) {
  alert('Please select an image file');
  return;
}

// Size check (5MB)
if (file.size > 5 * 1024 * 1024) {
  alert('File size must be less than 5MB');
  return;
}
```

### Upload Function:

```javascript
// From auth.js
const url = await window.auth.uploadAvatar(fileInput);

// Returns public URL:
// https://qibhlrsdykpkbsnelubz.supabase.co/storage/v1/object/public/avatars/1699123456_avatar.jpg
```

### Storage URL Format:

```
Upload endpoint:
POST https://qibhlrsdykpkbsnelubz.supabase.co/storage/v1/object/avatars/FILENAME

Public URL:
GET https://qibhlrsdykpkbsnelubz.supabase.co/storage/v1/object/public/avatars/FILENAME
```

---

## ✅ Features

- ✅ File picker với custom button style
- ✅ Type validation (image/* only)
- ✅ Size validation (max 5MB)
- ✅ Loading spinner during upload
- ✅ Auto-update preview after upload
- ✅ Success message (3s timeout)
- ✅ Error handling with alerts
- ✅ URL auto-filled to input field
- ✅ Option to paste URL directly
- ✅ Preview for both file upload & URL paste

---

## 🧪 Test Steps

### Test 1: Upload Valid Image

```bash
1. Login: http://localhost:5500/login.html
2. Go to: Settings → Profile tab
3. Click "Choose File"
4. Select image (e.g., avatar.jpg < 5MB)
5. Wait for upload
6. Check preview updated
7. Check URL field filled
8. Click "Save Changes"
9. Verify on profile page
```

**Expected:**
- ✅ Upload success
- ✅ Preview shows new image
- ✅ URL field contains Supabase URL
- ✅ Save works
- ✅ Profile page shows new avatar

---

### Test 2: Invalid File Type

```bash
1. Try upload .txt file
2. Should show alert: "Please select an image file"
```

---

### Test 3: File Too Large

```bash
1. Try upload image > 5MB
2. Should show alert: "File size must be less than 5MB"
```

---

### Test 4: URL Direct Paste

```bash
1. Paste URL in "Avatar URL" field
2. Preview should update real-time
3. Click "Save Changes"
4. Avatar saved from URL
```

---

## 🎯 Upload Result

### Before:
```
Avatar URL: https://ui-avatars.com/api/?name=Thuan+Nguyen...
```

### After Upload:
```
Avatar URL: https://qibhlrsdykpkbsnelubz.supabase.co/storage/v1/object/public/avatars/1699123456_avatar.jpg
```

### Database:
```sql
UPDATE users
SET avatar_url = 'https://qibhlrsdykpkbsnelubz.supabase.co/storage/v1/object/public/avatars/1699123456_avatar.jpg'
WHERE id = 1;
```

---

## 🔥 Quick Test

```bash
# 1. Setup bucket (one-time)
Go to: https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz/storage/buckets
Create "avatars" bucket (public)

# 2. Login
http://localhost:5500/login.html
Click "Thuận Nguyễn"

# 3. Upload
Settings → Profile → Upload from Computer
Choose image → Wait → Save

# 4. Verify
Check profile page: http://localhost:5500/profile.html?user=thuan_nguyen
```

---

## ⚠️ Troubleshooting

### Error: "Failed to upload avatar"

**Cause:** Bucket "avatars" chưa tạo

**Fix:**
1. Go to Supabase Storage
2. Create bucket "avatars" (public)
3. Retry upload

---

### Error: "File size must be less than 5MB"

**Cause:** File quá lớn

**Fix:**
1. Resize image trước khi upload
2. Compress image
3. Or use URL paste instead

---

### Preview không update

**Cause:** Browser cache

**Fix:**
1. Hard refresh: Ctrl+F5
2. Clear cache
3. Check console for errors

---

## 💡 Tips

1. **Best image size:** 256x256 or 512x512 pixels
2. **Best format:** PNG (transparent background) or WEBP (smaller size)
3. **Compress images:** Use tinypng.com before upload
4. **Avatar URL option:** Nếu đã có URL hosting sẵn, paste trực tiếp thay vì upload

---

## 🚀 Ready to Use!

Avatar upload system hoàn chỉnh:
- ✅ File upload from computer
- ✅ Direct URL paste
- ✅ Real-time preview
- ✅ Validation (type & size)
- ✅ Loading states
- ✅ Error handling
- ✅ Success feedback

**Start testing:** http://localhost:5500/login.html
