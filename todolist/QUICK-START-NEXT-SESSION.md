# ⚡ Quick Start - Next Session

**Last Updated:** 2025-11-06

---

## 🎯 TL;DR - Start Here

**Today we built:** Edit Post feature với phân quyền admin/user
**Status:** ✅ Code complete, ⚠️ Not tested yet
**Next:** Test edit feature + fix bugs

---

## 🚀 Quick Start (5 minutes)

### 1. Start Backend

```bash
cd backend
go run .
```

**Expected Output:**
```
✅ Connected to Supabase PostgreSQL
🔧 Initializing database tables...
✅ Database tables initialized
🚀 Server starting on port 8080
📍 API: http://localhost:8080/api
🎨 CMS: http://localhost:8080/cms
```

---

### 2. Setup Admin User

**Option A - Using psql:**
```bash
psql "postgresql://postgres.qibhlrsdykpkbsnelubz:GearVNStudio2024!@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres" -c "UPDATE users SET role = 'admin' WHERE id = 1;"
```

**Option B - Using Supabase Dashboard:**
1. Go to https://supabase.com/dashboard
2. Open your project
3. Go to Table Editor → users
4. Find user with ID = 1
5. Set `role = 'admin'`

---

### 3. Open Frontend

```bash
# If using VS Code Live Server
# Just open index.html and click "Go Live"

# Or use Python
cd c:\Users\duong\gvn-news-blog
python -m http.server 5500
```

Open: http://localhost:5500/index.html

---

### 4. Login & Test

**Test Accounts:**

| Email | Password | User ID | Role | Posts |
|-------|----------|---------|------|-------|
| test@gearvn.com | password123 | 1 | admin (after setup) | ~218 |
| thuan_nguyen@gearvn.com | password123 | 1 | user | ~218 |

**Login:**
1. Click "Login" button (top right)
2. Enter email & password
3. Should redirect to homepage

---

### 5. Test Edit Feature

**User Test:**
1. Login với thuan_nguyen@gearvn.com
2. Scroll và find một post của user đó (hover để xem creator)
3. Click vào post → Modal mở
4. Should see amber "Edit" button
5. Click Edit → Form mở
6. Change title → Save
7. Verify changes

**Admin Test:**
1. Login với admin account (ID 1 với role = 'admin')
2. Click vào BẤT KỲ post nào
3. Should see Edit button
4. Should see "Tác giả" dropdown
5. Change creator → Save
6. Verify creator changed

---

## 🐛 If Something Breaks

### Backend Not Starting

**Error:** `go: command not found`
**Fix:** Install Go from https://go.dev/dl/

**Error:** `Failed to connect to database`
**Fix:** Check DATABASE_URL in backend/.env

**Error:** `Port 8080 already in use`
**Fix:**
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Kill and restart
```

---

### Frontend Not Loading

**Error:** Blank page
**Fix:** Check browser console (F12) for errors

**Error:** `api is not defined`
**Fix:** Make sure all scripts loaded:
```html
<script src="./scripts/api-client.js"></script>
<script src="./scripts/edit-post-modal.js"></script>
<script src="./scripts/post-modal.js"></script>
```

**Error:** `Failed to fetch`
**Fix:** Backend not running or CORS issue

---

### Edit Button Not Showing

**Check:**
1. User is logged in? `console.log(window.api.isLoggedIn())`
2. User data loaded? `console.log(window.api.getCurrentUser())`
3. Permission check? `console.log(window.canEditPost(post))`

**Debug:**
```javascript
// In browser console
const user = window.api.getCurrentUser();
console.log('User:', user);
console.log('User ID:', user?.id);
console.log('Post creator_id:', post.creator_id);
console.log('Match:', user?.id.toString() === post.creator_id);
```

---

### Edit Modal Not Opening

**Check:**
1. Function exists? `console.log(typeof window.openEditModal)`
2. Post ID valid? `console.log(postId)`
3. Any errors? Check console (F12)

**Fix:**
- Refresh page
- Clear cache (Ctrl+Shift+R)
- Check edit-post-modal.js loaded

---

### Save Fails (403 Forbidden)

**Reason:** Permission check failed on backend

**Debug:**
1. Check user owns the post
2. Check JWT token not expired
3. Check backend logs

**Fix:**
- Re-login to get new token
- Make sure editing own post (user) or any post (admin)

---

## 📁 Key Files to Know

**Backend:**
- `backend/handlers.go` - API endpoints, updateUserPost() function
- `backend/main.go` - Routes, middleware setup
- `backend/auth.go` - JWT authentication

**Frontend:**
- `scripts/edit-post-modal.js` - Edit modal logic **NEW**
- `scripts/post-modal.js` - Post detail modal (added Edit button)
- `scripts/api-client.js` - API wrapper
- `index.html` - Homepage (includes scripts)

**Documentation:**
- `documentation/EDIT-POST-FEATURE.md` - Complete edit feature guide
- `documentation/00-INDEX.md` - Documentation index
- `todolist/2025-11-06-SUMMARY.md` - Today's summary
- `todolist/NEXT-STEPS.md` - Detailed next steps

---

## 🎯 What to Test

### ✅ Must Test:

- [ ] Backend starts without errors
- [ ] Login works
- [ ] Edit button shows for own posts (user)
- [ ] Edit button shows for all posts (admin)
- [ ] Edit button DOESN'T show for other users' posts
- [ ] Edit form loads with current values
- [ ] Admin sees creator dropdown
- [ ] User doesn't see creator dropdown
- [ ] Save updates the post
- [ ] Page refreshes and shows changes

### 🔍 Nice to Test:

- [ ] Form validation (required fields)
- [ ] Tags parsing (comma-separated)
- [ ] Image URL preview
- [ ] Modal closes on Cancel
- [ ] Modal closes on Escape key
- [ ] Icons render (Lucide)
- [ ] Responsive on mobile

---

## 📝 Where to Log Bugs

If you find bugs, add to: `todolist/BUGS.md`

**Format:**
```markdown
## Bug: Edit button không hiện

**Steps to Reproduce:**
1. Login với user A
2. Click post của user A
3. Edit button không hiện

**Expected:** Edit button should show
**Actual:** No button
**Error:** Check console...
**Fix:** TBD
```

---

## 💡 Quick Tips

1. **Check console first** - Most errors show in browser console (F12)
2. **Network tab** - See API calls, check status codes
3. **Backend logs** - Terminal where `go run .` is running
4. **Clear cache often** - Ctrl+Shift+R to hard refresh
5. **Test in incognito** - Isolate localStorage/cookie issues

---

## 🚀 When Everything Works

**Congratulations!** 🎉

**Next priorities:**
1. Fix any bugs found
2. Add Delete Post feature
3. Add Create Post feature
4. Improve mobile responsiveness

See `NEXT-STEPS.md` for full roadmap.

---

## 📞 Quick Reference

**Database:**
```
Host: aws-0-ap-southeast-1.pooler.supabase.com
Port: 6543
Database: postgres
User: postgres.qibhlrsdykpkbsnelubz
Password: GearVNStudio2024!
```

**Supabase API:**
```
URL: https://qibhlrsdykpkbsnelubz.supabase.co
Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Backend API:**
```
Base URL: http://localhost:8080/api
User endpoint: PUT /api/posts/:id
Admin endpoint: PUT /cms/posts/:id
```

---

**Ready to code? Start with step 1 above! 🚀**
