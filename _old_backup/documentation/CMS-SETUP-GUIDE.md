# 🔧 CMS SETUP GUIDE

**Date:** 2025-11-06

---

## 📋 OVERVIEW

Hệ thống CMS quản lý:
- ✅ Video Posts (edit, publish/unpublish, delete)
- ✅ Hashtags (create, edit, delete, color coding)
- ✅ Categories (create, edit, delete, icons, colors)

**Features:**
- 🏷️ Dropdown selection cho tags và categories (không nhập text)
- 🎨 Multi-select tags với color preview
- 📊 Statistics dashboard
- 🔍 Search và filter posts

---

## 🗄️ STEP 1: CREATE DATABASE TABLES

### **Option A: Via Supabase SQL Editor (Recommended)**

1. Truy cập [Supabase Dashboard](https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz)
2. Click **SQL Editor** (sidebar bên trái)
3. Click **New Query**
4. Copy nội dung từ file `database/create_hashtags_categories.sql`
5. Paste vào editor
6. Click **Run** (hoặc Ctrl+Enter)

### **Option B: Via psql CLI**

Nếu bạn đã cài PostgreSQL:

```powershell
.\run-hashtags-migration.ps1
```

---

## ✅ STEP 2: VERIFY TABLES CREATED

Sau khi chạy SQL, verify bằng cách:

### **Check via Supabase Dashboard:**

1. Go to **Table Editor**
2. Bạn sẽ thấy 2 tables mới:
   - `hashtags` (với 10 default hashtags)
   - `categories` (với 4 default categories)

### **Check via SQL:**

```sql
SELECT COUNT(*) FROM hashtags;
-- Expected: 10

SELECT COUNT(*) FROM categories;
-- Expected: 4
```

---

## 🎯 STEP 3: ACCESS CMS

```
http://localhost:5500/admin.html
```

### **Navigation:**

**3 Tabs:**
1. **Video Posts** - Quản lý video posts
2. **Hashtags** - Quản lý hashtags
3. **Categories** - Quản lý categories

---

## 📊 DEFAULT DATA

### **Default Hashtags (10):**

| Name | Slug | Color | Description |
|------|------|-------|-------------|
| Review | review | #ef4444 | Product reviews |
| Gearvn | gearvn | #dc2626 | Gearvn channel content |
| YouTube | youtube | #dc2626 | YouTube videos |
| Windows | windows | #0ea5e9 | Windows OS related |
| Windows 11 | windows-11 | #0284c7 | Windows 11 features |
| Battery | battery | #10b981 | Battery tips and tricks |
| Tips | tips | #f59e0b | Tips and tricks |
| HyperX | hyperx | #b91c1c | HyperX products |
| Gaming | gaming | #8b5cf6 | Gaming related |
| Tech News | tech-news | #f59e0b | Technology news |

### **Default Categories (4):**

| Name | Slug | Icon | Color | Description |
|------|------|------|-------|-------------|
| Peripherals | peripherals | headphones | #ef4444 | Gaming peripherals |
| Hardware | hardware | cpu | #3b82f6 | PC hardware |
| Gaming | gaming | gamepad-2 | #8b5cf6 | Gaming news |
| Tech News | tech-news | newspaper | #f59e0b | Technology news |

---

## 🎨 FEATURES BREAKDOWN

### **1. Video Posts Management**

**Table Columns:**
- Thumbnail preview
- Title + ID
- Category badge
- Creator name
- Duration
- Published status
- Created date
- Actions (Edit, Publish/Unpublish, Delete)

**Edit Modal:**
- ✏️ Title (text input)
- ✏️ Excerpt (textarea)
- 📁 **Category (dropdown)** ← Populated from `categories` table
- 🔘 Status (Published/Draft dropdown)
- 🎬 Video URL (readonly)
- ⏱️ Duration (text input)
- 🏷️ **Tags (multi-select dropdown)** ← Populated from `hashtags` table
- 👤 Creator name (text input)
- 🆔 Creator ID (readonly)

**Filters:**
- Search by title, ID, creator
- Filter by category
- Filter by status (Published/Draft)

---

### **2. Hashtags Management**

**Features:**
- ➕ Add new hashtags
- ✏️ Edit existing hashtags
- 🗑️ Delete hashtags
- 🎨 Color picker for each hashtag
- 📊 Usage count tracking

**Form Fields:**
- Name (e.g., "Review")
- Slug (e.g., "review")
- Color (hex color picker)
- Description (optional)

**Display:**
- Color preview circle
- Usage count (how many posts use this tag)
- Color-coded name

---

### **3. Categories Management**

**Features:**
- ➕ Add new categories
- ✏️ Edit existing categories
- 🗑️ Delete categories
- 🎨 Color picker
- 🎨 Icon selector (Lucide icons)

**Form Fields:**
- Name (e.g., "Peripherals")
- Slug (e.g., "peripherals")
- Icon (Lucide icon name, e.g., "headphones")
- Color (hex color picker)
- Description (optional)

**Icon Reference:**
Visit [lucide.dev/icons](https://lucide.dev/icons) để tìm icon names

---

## 🔄 WORKFLOW: EDIT VIDEO POST

1. **Open CMS:** `http://localhost:5500/admin.html`
2. **Click Edit** button on any video post
3. **Modal opens** with form

### **Select Category:**
```
[Dropdown] ▼
- Peripherals
- Hardware
- Gaming
- Tech News
```

### **Select Tags (Multi-select):**
```
[Click to open dropdown] ▼
☑ Review
☑ Gearvn
☐ YouTube
☑ Windows
☐ Windows 11
☐ Battery
☐ Tips
☑ HyperX
☐ Gaming
☐ Tech News
```

Selected tags hiển thị dưới dạng colored pills:
```
[Review] [Gearvn] [Windows] [HyperX]
```

4. **Click "Save Changes"**
5. **Post updated** → Refresh page to see changes

---

## 🏷️ TAGS vs CATEGORIES

### **Categories** (Single-select)
- Mỗi video chỉ có **1 category**
- Dùng để phân loại chính: Peripherals, Hardware, Gaming, Tech News
- Hiển thị trên filter dropdown

### **Tags / Hashtags** (Multi-select)
- Mỗi video có thể có **nhiều tags**
- Dùng để phân loại chi tiết: brand names, topics, keywords
- Example: `["hyperx", "review", "gearvn", "peripherals"]`

---

## 🔍 SEARCHING AND FILTERING

### **Posts Tab:**

**Search box:**
- Search by title
- Search by post ID
- Search by creator name

**Category filter:**
- All Categories
- Peripherals
- Hardware
- Gaming
- Tech News

**Status filter:**
- All Status
- Published
- Draft

---

## 🎯 QUICK ACTIONS

### **Publish / Unpublish**
- Click yellow eye icon
- Confirm action
- Status updates immediately
- Published posts appear on website
- Draft posts are hidden

### **Delete Post**
- Click red trash icon
- Confirm deletion (⚠️ Cannot undo!)
- Post removed from database

---

## 🧪 TESTING

### **Test 1: Add New Hashtag**

1. Go to **Hashtags** tab
2. Click **Add Hashtag**
3. Fill in:
   - Name: "Laptop"
   - Slug: "laptop"
   - Color: #3b82f6
   - Description: "Laptop reviews and news"
4. Click **Save Hashtag**
5. ✅ New hashtag appears in table
6. ✅ New hashtag available in post edit modal

### **Test 2: Add New Category**

1. Go to **Categories** tab
2. Click **Add Category**
3. Fill in:
   - Name: "Software"
   - Slug: "software"
   - Icon: "code"
   - Color: #10b981
   - Description: "Software and apps"
4. Click **Save Category**
5. ✅ New category appears in table
6. ✅ New category available in:
   - Post edit modal dropdown
   - Filter dropdown

### **Test 3: Edit Video Post**

1. Go to **Video Posts** tab
2. Find post ID: `1TgwegUv06g`
3. Click blue **Edit** button
4. Change category to "Tech News"
5. Select tags: "windows", "windows-11", "tips"
6. Click **Save Changes**
7. ✅ Post updated
8. ✅ Changes reflected in table

---

## 🚨 TROUBLESHOOTING

### **Issue 1: Tables not found**

```
Error: relation "hashtags" does not exist
```

**Fix:** Run SQL migration in Supabase SQL Editor

### **Issue 2: Dropdown empty**

**Symptoms:** Category dropdown or tags dropdown is empty

**Fix:**
1. Check tables have data: `SELECT * FROM categories;`
2. Re-run default data insertion from SQL file

### **Issue 3: CMS not loading**

**Fix:**
1. Check browser console for errors
2. Verify `scripts/admin.js` is loaded
3. Hard refresh: Ctrl+F5

---

## 📝 DATABASE SCHEMA

### **hashtags table:**

```sql
CREATE TABLE hashtags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#ef4444',
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **categories table:**

```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(7) DEFAULT '#3b82f6',
  post_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔗 USEFUL LINKS

- **CMS Admin:** http://localhost:5500/admin.html
- **Frontend:** http://localhost:5500
- **Supabase Dashboard:** https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz
- **Lucide Icons:** https://lucide.dev/icons

---

## ✅ CHECKLIST

- [ ] Run SQL migration to create tables
- [ ] Verify default hashtags (10) and categories (4)
- [ ] Access CMS at localhost:5500/admin.html
- [ ] Test adding new hashtag
- [ ] Test adding new category
- [ ] Test editing video post with dropdowns
- [ ] Test publish/unpublish
- [ ] Test delete post

---

**Status:** ✅ CMS Ready for Use!
**Last Updated:** 2025-11-06

🎉 **Enjoy your new CMS!**
