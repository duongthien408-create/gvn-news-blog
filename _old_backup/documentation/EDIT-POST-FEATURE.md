# ✏️ Edit Post Feature - User & Admin Permissions

**Date:** 2025-11-06
**Status:** ✅ Implemented

---

## 🎯 Feature Overview

Hệ thống edit post với phân quyền 2 cấp:
- **Admin**: Sửa tất cả posts + chọn lại tác giả
- **User**: Chỉ sửa posts của họ (content, title, tags, etc.)

---

## 🔐 Permissions

### Admin (role = 'admin')
✅ Edit tất cả posts
✅ Chọn lại tác giả từ dropdown
✅ Update creator_id, creator_name, creator_avatar
✅ Sử dụng `/cms/posts/:id` endpoint

### User (role = 'user')
✅ Edit chỉ posts của họ (creator_id = user_id)
❌ Không thể đổi tác giả
✅ Update title, content, excerpt, cover_image, category, tags, read_time
✅ Sử dụng `/api/posts/:id` endpoint

---

## 🛠️ Implementation

### 1. Backend API Endpoints

#### **User Endpoint** - `/api/posts/:id` (PUT)
**File:** [backend/handlers.go](../backend/handlers.go#L454-L511)

**Authentication:** Required (JWT token)

**Permission Check:**
```go
// Verify ownership (convert user.UserID to string to compare with creator_id VARCHAR)
if !creatorID.Valid || creatorID.String != fmt.Sprintf("%d", user.UserID) {
    return c.Status(403).JSON(fiber.Map{"error": "You can only edit your own posts"})
}
```

**Request Body:**
```json
{
  "title": "Updated title",
  "excerpt": "Updated excerpt",
  "content": "Updated content",
  "cover_image": "https://...",
  "category": "tech",
  "tags": ["tag1", "tag2"],
  "read_time": "5 min read"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Post updated successfully"
}
```

---

#### **Admin Endpoint** - `/cms/posts/:id` (PUT)
**File:** [backend/cms.go](../backend/cms.go#L86-L130)

**Authentication:** Required (JWT + Admin middleware)

**Additional Fields:**
```json
{
  // ... same as user endpoint, plus:
  "creator_id": "2",
  "creator_name": "Bình Bear",
  "creator_avatar": "https://..."
}
```

---

### 2. Frontend Components

#### **Edit Modal** - `scripts/edit-post-modal.js`

**Main Functions:**

**`canEditPost(post)`** - Check permissions
```javascript
function canEditPost(post) {
  if (!window.api?.isLoggedIn()) return false;

  const currentUser = window.api.getCurrentUser();

  // Admin can edit all
  if (currentUser.role === 'admin') return true;

  // User can only edit their own posts
  return post.creator_id === currentUser.id.toString();
}
```

**`openEditModal(postId)`** - Open edit form
- Fetch post data
- Check permissions
- Load creators dropdown (admin only)
- Render form with current values

**`handleEditSubmit(postId, form, isAdmin)`** - Submit changes
- Parse form data
- Fetch creator info (admin only)
- Call appropriate API endpoint
- Reload page on success

---

#### **Edit Button** - Added to `post-modal.js`

**Location:** [scripts/post-modal.js](../scripts/post-modal.js#L175-L182)

```javascript
${window.canEditPost && window.canEditPost(post) ? `
  <button
    onclick="window.openEditModal('${post.id}'); return false;"
    class="rounded-full border border-amber-500/40 bg-amber-500/20 px-4 py-2 text-sm font-medium text-amber-300 transition hover:bg-amber-500/30 hover:text-amber-200">
    <i data-lucide="edit" class="mr-1 inline h-4 w-4"></i>
    Edit
  </button>
` : ''}
```

Button chỉ hiển thị nếu:
1. User đã đăng nhập
2. User là admin HOẶC creator của post

---

### 3. UI/UX

#### Edit Form Fields

**Basic Fields (All Users):**
- Title * (required)
- Excerpt
- Content
- Cover Image URL
- Category
- Read Time
- Tags (comma-separated)

**Admin Only Fields:**
- Creator Selection (dropdown with all users)

#### Form Styling
- Dark theme (#000000 background)
- GearVN red accent (#EF4444)
- Amber edit button (#F59E0B)
- Responsive modal design

---

## 📝 Usage Guide

### For Users:

1. **Mở post detail modal** (click vào bất kỳ post nào trên homepage)
2. **Kiểm tra quyền**: Nếu đây là post của bạn, sẽ thấy nút "Edit" màu vàng
3. **Click Edit button** → Modal form mở ra
4. **Chỉnh sửa nội dung** (title, content, tags, etc.)
5. **Click "Lưu thay đổi"**
6. **Page refresh** → Post đã được cập nhật

**Note:** Bạn KHÔNG thể thay đổi tác giả của post.

---

### For Admin:

1. **Login với admin account** (email: test@gearvn.com, role: admin)
2. **Mở bất kỳ post nào** (admin có thể edit tất cả)
3. **Click Edit button**
4. **Chỉnh sửa bất kỳ field nào**, bao gồm:
   - Dropdown "Tác giả" để chọn lại creator
   - Tất cả fields như user
5. **Lưu thay đổi**

**Admin có thể:**
- Sửa posts của bất kỳ ai
- Chuyển post từ user này sang user khác
- Update creator info

---

## 🧪 Testing

### Test User Edit:

1. **Login với user account:**
   - Email: thuan_nguyen@gearvn.com
   - ID: 1

2. **Mở post của user đó** (creator_id = "1")
3. **Verify Edit button xuất hiện**
4. **Edit và lưu**
5. **Verify thay đổi được áp dụng**

### Test Admin Edit:

1. **Login với admin account**:
   - Cần tạo admin account hoặc update role trong database:
   ```sql
   UPDATE users SET role = 'admin' WHERE id = 1;
   ```

2. **Mở bất kỳ post nào**
3. **Verify Edit button xuất hiện**
4. **Verify dropdown "Tác giả" có sẵn**
5. **Đổi tác giả sang user khác**
6. **Lưu và verify creator thay đổi**

### Test Permission Denial:

1. **Login với User A**
2. **Mở post của User B**
3. **Verify KHÔNG có Edit button**
4. **Nếu dùng API trực tiếp → 403 Forbidden**

---

## 🔧 Technical Details

### Type Casting

**Problem:** `creator_id` (VARCHAR) vs `user.id` (INTEGER)

**Solution:**
```go
// Backend: Convert user ID to string for comparison
if creatorID.String != fmt.Sprintf("%d", user.UserID) {
    return 403
}
```

```javascript
// Frontend: Compare as strings
return post.creator_id === currentUser.id.toString();
```

---

### Creator Info Update (Admin)

Khi admin đổi creator, cần update 3 fields:
1. `creator_id` - User ID (string)
2. `creator_name` - Full name hoặc username
3. `creator_avatar` - Avatar URL

**Frontend automatically fetches creator info:**
```javascript
const creatorResponse = await fetch(`/users?id=eq.${data.creator_id}`);
const creator = creators[0];
data.creator_name = creator.full_name || creator.username;
data.creator_avatar = creator.avatar_url;
```

---

## 📦 Files Changed

### Backend:

1. **`backend/handlers.go`**
   - Added `updateUserPost()` function (lines 454-511)
   - Added `fmt` import

2. **`backend/main.go`**
   - Added route: `api.Put("/posts/:id", authMiddleware, updateUserPost)`

### Frontend:

1. **`scripts/edit-post-modal.js`** (NEW FILE)
   - `canEditPost()` - Permission check
   - `openEditModal()` - Modal UI
   - `handleEditSubmit()` - Form submission
   - `loadCreatorsForSelect()` - Admin dropdown

2. **`scripts/post-modal.js`**
   - Added Edit button (lines 175-182)

3. **`scripts/api-client.js`**
   - Added `getCurrentUser()` method

4. **`index.html`**
   - Added `<script src="./scripts/edit-post-modal.js">`

---

## 🚀 Future Enhancements

**Possible improvements:**

1. **Rich text editor** - WYSIWYG editor cho content
2. **Image upload** - Upload ảnh trực tiếp thay vì URL
3. **Draft system** - Lưu draft trước khi publish
4. **Version history** - Xem lịch sử chỉnh sửa
5. **Bulk edit** - Admin edit nhiều posts cùng lúc
6. **Post approval** - User submit, admin approve
7. **Markdown support** - Viết content bằng Markdown

---

## ✅ Result

**Before:**
- Không có cách edit posts
- Phải vào database để sửa

**After:**
- ✅ User sửa được posts của họ
- ✅ Admin sửa được tất cả posts
- ✅ Admin chọn lại tác giả
- ✅ UI modal đẹp với dark theme
- ✅ Phân quyền chặt chẽ
- ✅ Type-safe với VARCHAR/INTEGER conversion

---

## 📚 Related Documentation

- [LOGIN-GUIDE.md](LOGIN-GUIDE.md) - Authentication system
- [PROFILE-SETUP.md](PROFILE-SETUP.md) - User profiles
- [POST-DETAIL-CREATOR-FIX.md](POST-DETAIL-CREATOR-FIX.md) - Creator display fix

---

**Last Updated:** 2025-11-06
