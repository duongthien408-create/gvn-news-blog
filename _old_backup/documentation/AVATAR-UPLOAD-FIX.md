# 🔧 FIX AVATAR UPLOAD 403 ERROR

**Error:** `Upload Error: {"statusCode":"403","error":"Unauthorized","message":"new row violates row-level security policy"}`

**Root Cause:** Bucket "avatars" chưa được tạo hoặc RLS policies chưa đúng.

---

## ✅ SOLUTION - Manual Setup (RECOMMENDED)

### Step 1: Tạo Storage Bucket

1. **Vào Supabase Storage Dashboard:**
   ```
   https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz/storage/buckets
   ```

2. **Click "New Bucket"**

3. **Nhập thông tin:**
   - **Name:** `avatars`
   - **Public bucket:** ✅ **TOGGLE ON** (QUAN TRỌNG!)
   - **File size limit:** `5242880` (5MB)
   - **Allowed MIME types:** Leave empty (cho phép tất cả image types)

4. **Click "Save"**

---

### Step 2: Kiểm Tra RLS Policies

**Sau khi tạo bucket PUBLIC, Supabase sẽ tự động tạo policies:**

1. Vào tab **"Policies"** của bucket "avatars"

2. Xác nhận có 2 policies:
   - ✅ **"Enable read access for all users"** (SELECT)
   - ✅ **"Enable insert for authenticated users only"** (INSERT)

**Nếu KHÔNG có policies, tạo thủ công:**

#### Policy 1: Public Read
```
Operation: SELECT
Policy name: Public Access
Definition: true
```

#### Policy 2: Authenticated Upload
```
Operation: INSERT
Policy name: Authenticated users can upload
Definition: (bucket_id = 'avatars')
```

---

## 🧪 TEST UPLOAD

### Bước 1: Clear Session (nếu cần)
```javascript
// In browser console (F12)
localStorage.clear();
```

### Bước 2: Login lại
```
1. Go to: http://localhost:5500/login.html
2. Click "Thuận Nguyễn"
3. Auto-redirect to Settings
```

### Bước 3: Upload Avatar
```
1. Settings → Profile tab
2. Section "Upload from Computer"
3. Click "Choose File"
4. Select image (< 5MB)
5. Wait for upload spinner
6. Check for success message: "✓ Avatar uploaded successfully!"
7. Click "Save Changes"
8. Go to profile page to verify
```

---

## 🔍 VERIFY BUCKET SETUP

### Check 1: Bucket exists
```
Go to: https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz/storage/buckets
Should see: "avatars" bucket with "public" badge
```

### Check 2: Public access enabled
```
Click avatars bucket → Configuration
"Public bucket" toggle should be ON
```

### Check 3: Test URL access
```
After upload, copy URL from console:
https://qibhlrsdykpkbsnelubz.supabase.co/storage/v1/object/public/avatars/FILENAME.jpg

Paste in browser → Should show image (not 404)
```

---

## ⚠️ COMMON ISSUES

### Issue 1: Still 403 after creating bucket

**Cause:** Bucket created as PRIVATE instead of PUBLIC

**Fix:**
1. Go to bucket Configuration
2. Toggle "Public bucket" to ON
3. Save and retry upload

---

### Issue 2: CORS error persists

**Cause:** Browser cached the failed request

**Fix:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Retry upload

---

### Issue 3: "Bucket not found"

**Cause:** Bucket name typo (e.g., "avatar" instead of "avatars")

**Fix:**
1. Check bucket name is exactly `avatars` (plural)
2. Re-create with correct name

---

## 🎯 EXPECTED RESULT

### Before Upload:
```
Avatar URL: https://ui-avatars.com/api/?name=Thuan+Nguyen&background=random
```

### After Upload:
```
Avatar URL: https://qibhlrsdykpkbsnelubz.supabase.co/storage/v1/object/public/avatars/1762420550176_avatar.jpg
```

### Database:
```sql
-- Check user's avatar_url updated
SELECT id, full_name, avatar_url
FROM users
WHERE email = 'thuan@gearvn.com';
```

---

## 🚀 QUICK START

```bash
# 1. Create bucket (one-time setup)
Go to: https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz/storage/buckets
Click "New Bucket" → Name: "avatars" → Public: ON → Save

# 2. Login
http://localhost:5500/login.html → Click "Thuận Nguyễn"

# 3. Upload
Settings → Profile → Choose File → Select image → Wait → Save

# 4. Verify
Check profile: http://localhost:5500/profile.html?user=thuan_nguyen
```

---

## 📝 NOTES

- **Public bucket:** REQUIRED để browser có thể access uploaded images
- **File size limit:** 5MB (có thể tăng trong bucket settings)
- **Allowed types:** Tất cả image types (jpeg, png, webp, gif)
- **URL format:** `/storage/v1/object/public/avatars/FILENAME`

---

## ✅ CHECKLIST

- [ ] Bucket "avatars" created
- [ ] Public access enabled
- [ ] RLS policies verified
- [ ] Test upload successful
- [ ] Avatar preview updated
- [ ] Save changes works
- [ ] Profile page shows new avatar

---

**START HERE:** https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz/storage/buckets
