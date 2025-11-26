# 🔑 LOGIN CREDENTIALS - Quick Reference

**Login Page:** http://localhost:5500/login.html

---

## 👥 TEST ACCOUNTS

### User 1: Thuận Nguyễn
- **Email:** `thuan@gearvn.com`
- **Password:** `password123`
- **Role:** Senior Content Creator
- **Company:** GearVN

### User 2: Bình Bear
- **Email:** `binh@gearvn.com`
- **Password:** `password123`
- **Role:** Hardware Specialist
- **Company:** GearVN

### User 3: Dương Thiện
- **Email:** `duong@gearvn.com`
- **Password:** `password123`
- **Role:** Tech News Editor
- **Company:** GearVN

### User 4: Tài Xài Tech
- **Email:** `tai@gearvn.com`
- **Password:** `password123`
- **Role:** Tech Consultant
- **Company:** GearVN

### User 5: Ngọc Sang
- **Email:** `sang@gearvn.com`
- **Password:** `password123`
- **Role:** Gaming Peripherals Expert
- **Company:** GearVN

---

## 🎯 Quick Login

1. Vào: http://localhost:5500/login.html
2. Click vào user bất kỳ (auto-fill)
3. Hoặc nhập:
   - Email: `thuan@gearvn.com`
   - Password: `password123`
4. Click "Sign in"
5. Redirect to Settings page

---

## 📍 Protected Pages

Cần login mới access được:
- `/settings.html` - User settings & profile management
- `/edit-post.html` - Edit posts (future)

---

## 🔓 Logout

```javascript
// Clear session và logout
window.auth.clearSession();
window.location.href = '/login.html';
```

Hoặc add logout button trong settings page:

```html
<button onclick="window.auth.clearSession(); window.location.href='/login.html'">
  Logout
</button>
```

---

## ⚡ Avatar Upload

### Setup Storage Bucket:

**Method 1:** Run SQL
```sql
-- Copy from: database/setup_storage.sql
-- Run in Supabase SQL Editor
```

**Method 2:** Manual
1. Go to: https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz/storage/buckets
2. Create bucket "avatars" (public)
3. Create bucket "company-logos" (public)

### Upload Avatar:

```javascript
const fileInput = document.querySelector('input[type="file"]');
const url = await window.auth.uploadAvatar(fileInput);
// url: https://qibhlrsdykpkbsnelubz.supabase.co/storage/v1/object/public/avatars/1699123456_avatar.jpg
```

---

## 💾 Session Storage

**Location:** `localStorage.getItem('gvn_session')`

**Expiry:** 7 days

**Data:**
```json
{
  "user": {
    "id": 1,
    "email": "thuan@gearvn.com",
    "username": "thuan_nguyen",
    "full_name": "Thuận Nguyễn",
    ...
  },
  "timestamp": 1699123456789,
  "expiresAt": 1699728256789
}
```

---

## 🛠️ Usage in Code

```javascript
// Get current user
const user = window.auth.getCurrentUser();

// Require auth (redirect if not logged in)
const user = window.auth.requireAuth();

// Check if logged in
const session = window.auth.getSession();
if (session) {
  console.log('Logged in as:', session.user.email);
}

// Logout
window.auth.clearSession();
```

---

## ✅ What's Working:

- ✅ Login with email/password
- ✅ Quick test account buttons
- ✅ Session management (7 days)
- ✅ Auto-redirect to login for protected pages
- ✅ Avatar upload to Supabase Storage
- ✅ User info in header
- ✅ Remember me (localStorage)

---

## 🎯 Next Steps:

1. **Setup Storage Buckets**
   - Run `database/setup_storage.sql`
   - Or create manually in dashboard

2. **Test Login**
   - Go to login.html
   - Click any test account
   - Verify redirect to settings

3. **Test Avatar Upload**
   - Login → Settings → Profile
   - Upload image file
   - Check Supabase Storage

4. **Add Logout Button**
   - In settings.html header
   - Or in sidebar menu

---

**All test accounts use password:** `password123`

**Remember:** This is for development only. Production needs:
- Real bcrypt verification
- Secure password storage
- HTTPS
- httpOnly cookies
- CSRF protection
