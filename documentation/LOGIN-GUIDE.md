# 🔐 LOGIN & AUTH SYSTEM - Complete Guide

**Date:** 2025-11-06
**Status:** ✅ Ready to Use

---

## 🎯 Overview

Hệ thống login đầy đủ với:
- ✅ Email/Password authentication
- ✅ Session management (localStorage)
- ✅ Avatar upload to Supabase Storage
- ✅ Protected CMS pages
- ✅ Test accounts for quick login

---

## 🚀 Quick Start

### 1. Login Page

```
URL: http://localhost:5500/login.html
```

### 2. Test Accounts

| Email | Password | User |
|-------|----------|------|
| `thuan@gearvn.com` | `password123` | Thuận Nguyễn |
| `binh@gearvn.com` | `password123` | Bình Bear |
| `duong@gearvn.com` | `password123` | Dương Thiện |
| `tai@gearvn.com` | `password123` | Tài Xài Tech |
| `sang@gearvn.com` | `password123` | Ngọc Sang |

### 3. Login Flow

```
1. Go to http://localhost:5500/login.html
2. Click any test account button (hoặc nhập email/password)
3. Auto-fill và submit
4. Redirect to /settings.html
```

---

## 📁 Files Created

1. **[login.html](login.html)** - Login page với test accounts
2. **[scripts/auth.js](scripts/auth.js)** - Auth system
3. **[database/setup_storage.sql](database/setup_storage.sql)** - Storage bucket setup

---

## 🔑 Auth System Features

### Session Management

```javascript
// Save session after login
saveSession(user);

// Get current user
const user = getCurrentUser();

// Check if logged in
const session = getSession();

// Logout
clearSession();
```

### Protected Pages

Pages tự động redirect to login nếu chưa đăng nhập:
- `settings.html` - Settings CMS
- `edit-post.html` - Edit post (future)

### Avatar Upload

```javascript
// Upload avatar file
const fileInput = document.querySelector('input[type="file"]');
const avatarUrl = await window.auth.uploadAvatar(fileInput);

// Update user avatar
await updateUser(userId, { avatar_url: avatarUrl });
```

---

## 🛠️ Setup Supabase Storage

### Option 1: SQL Script (Recommended)

```bash
# Run SQL in Supabase SQL Editor
# Copy content from: database/setup_storage.sql
```

### Option 2: Manual Setup

1. Go to Supabase Dashboard:
   ```
   https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz/storage/buckets
   ```

2. Click "New Bucket"

3. Create **avatars** bucket:
   - Name: `avatars`
   - Public: ✅ YES
   - File size limit: 5 MB
   - Allowed types: image/jpeg, image/png, image/webp, image/gif

4. Create **company-logos** bucket:
   - Name: `company-logos`
   - Public: ✅ YES
   - File size limit: 10 MB
   - Allowed types: image/jpeg, image/png, image/webp, image/svg+xml

---

## 📸 Avatar Upload in Settings

### Update settings.js

Replace line 39-43 in `scripts/settings.js`:

```javascript
// OLD:
async function getCurrentUser() {
  const users = await supabaseRequest(`/users?select=*&limit=1`);
  return users[0] || null;
}

// NEW:
async function getCurrentUser() {
  return window.auth?.getCurrentUser() || null;
}
```

### Add file upload UI

In `renderProfileSettings()` function, update avatar section:

```html
<div class="flex-1 space-y-3">
  <div>
    <label class="block text-sm font-medium text-slate-300">Upload Avatar</label>
    <input
      type="file"
      id="avatar-file"
      accept="image/*"
      class="mt-1 w-full rounded-lg border border-slate-700 bg-hub-panel px-4 py-2 text-slate-200 file:mr-4 file:rounded file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-400"
    />
    <p class="mt-1 text-xs text-slate-500">Or enter URL below</p>
  </div>
  <div>
    <label class="block text-sm font-medium text-slate-300">Avatar URL</label>
    <input
      type="url"
      name="avatar_url"
      id="avatar-url"
      value="${user.avatar_url || ''}"
      placeholder="https://example.com/avatar.jpg"
      class="mt-1 w-full rounded-lg border border-slate-700 bg-hub-panel px-4 py-2 text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
    />
  </div>
</div>
```

### Add upload logic

In `attachEventListeners()` function, add:

```javascript
// Avatar file upload
const avatarFile = document.getElementById('avatar-file');
const avatarUrlInput = document.getElementById('avatar-url');
const avatarPreview = document.getElementById('avatar-preview');

if (avatarFile) {
  avatarFile.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Show loading
      avatarFile.disabled = true;
      const loadingDiv = document.createElement('p');
      loadingDiv.className = 'text-xs text-blue-400';
      loadingDiv.textContent = 'Uploading...';
      avatarFile.parentElement.appendChild(loadingDiv);

      // Upload to Supabase
      const url = await window.auth.uploadAvatar(avatarFile);

      // Update preview and input
      avatarPreview.src = url;
      avatarUrlInput.value = url;

      // Remove loading
      loadingDiv.remove();
      avatarFile.disabled = false;

      alert('Avatar uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert(error.message);
      avatarFile.disabled = false;
    }
  });
}
```

---

## 🔐 Session Structure

```json
{
  "user": {
    "id": 1,
    "email": "thuan@gearvn.com",
    "username": "thuan_nguyen",
    "full_name": "Thuận Nguyễn",
    "avatar_url": "...",
    "role": "creator",
    "company_id": 1
  },
  "timestamp": 1699123456789,
  "expiresAt": 1699728256789
}
```

**Storage:** `localStorage.getItem('gvn_session')`

**Expiry:** 7 days

---

## 🧪 Testing

### Test 1: Login

```bash
1. Go to http://localhost:5500/login.html
2. Click "Thuận Nguyễn" test account
3. Wait for redirect to /settings.html
4. Check if logged in (see avatar in header)
```

### Test 2: Session Persistence

```bash
1. Login as any user
2. Close browser
3. Open browser again
4. Go to http://localhost:5500/settings.html
5. Should still be logged in
```

### Test 3: Avatar Upload

```bash
1. Login and go to settings
2. Click "Profile" tab
3. Click "Upload Avatar" file input
4. Select an image file (< 5MB)
5. Wait for upload
6. See preview update
7. Click "Save Changes"
8. Check profile page for new avatar
```

### Test 4: Protected Pages

```bash
1. Clear localStorage (F12 → Application → Local Storage → Clear)
2. Go to http://localhost:5500/settings.html
3. Should redirect to /login.html
```

---

## 🎨 UI Features

### Login Page:
- Clean centered design
- Email/Password form
- Test account quick buttons
- Error messages
- "Remember me" checkbox

### Protected Pages:
- Auto-redirect if not logged in
- User info in header
- Logout button (add manually)

---

## 🔧 Integration Steps

### Step 1: Load auth.js in HTML

```html
<script type="module" src="./scripts/auth.js"></script>
```

### Step 2: Check auth in settings.js

```javascript
// At top of loadSettings()
const user = window.auth?.requireAuth();
if (!user) return; // Will redirect to login
```

### Step 3: Add logout button

```html
<button
  onclick="window.auth.clearSession(); window.location.href='/login.html'"
  class="text-sm text-red-400 hover:text-red-300"
>
  Logout
</button>
```

---

## ⚠️ Important Notes

### Password Hashing:
- Current: Simple check for "password123"
- Production: Use bcrypt verification on backend

### Avatar Upload:
- Requires Supabase Storage bucket "avatars"
- Max file size: 5MB
- Allowed types: image/*

### Session Security:
- Stored in localStorage (not secure for sensitive data)
- Production: Use httpOnly cookies + JWT

---

## 📝 To-Do (Future Enhancements)

- [ ] Implement real bcrypt password verification
- [ ] Add "Forgot Password" flow
- [ ] Add "Change Password" functionality
- [ ] Implement email verification
- [ ] Add OAuth login (Google, Facebook)
- [ ] Move session to httpOnly cookies
- [ ] Add CSRF protection
- [ ] Implement refresh tokens

---

## 🚀 Ready to Use!

Login system is fully functional:
- ✅ Login với email/password
- ✅ Test accounts for quick access
- ✅ Session management (7 days)
- ✅ Protected CMS pages
- ✅ Avatar upload ready (after storage setup)

**Test now:** http://localhost:5500/login.html
