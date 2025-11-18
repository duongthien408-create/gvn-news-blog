# 🎯 GearVN News Blog - CMS Admin Design Proposal

**Ngày:** 2025-01-18
**Phiên bản:** 1.0
**Trạng thái:** 📝 PROPOSAL

---

## 📊 Tổng Quan Hệ Thống

### Current Database Schema v2.0

Hệ thống hiện có **25+ tables** chia thành 8 nhóm chính:

1. **Users & Authentication** (4 tables): users, user_profiles, user_preferences, user_levels
2. **Content & Creators** (5 tables): creators, creator_socials, sources, posts, post_media
3. **Products** (4 tables): products, product_categories, brands, post_products
4. **Engagement** (6 tables): votes, comments, comment_votes, bookmarks, views, follows
5. **Community** (3 tables): squads, squad_members, squad_posts
6. **Gamification** (5 tables): streaks, achievements, user_achievements, user_levels, user_points
7. **Tags** (2 tables): tags, post_tags
8. **Notifications** (1 table): notifications

---

## 🎯 Mục Tiêu CMS

### Primary Goals

1. **Quản lý Content** - Posts, creators, sources
2. **Quản lý Users** - Users, roles, levels, achievements
3. **Quản lý Products** - Products, categories, brands
4. **Quản lý Community** - Squads, comments, moderation
5. **Analytics & Reports** - Views, engagement, trends
6. **System Settings** - Configurations, notifications

### Success Criteria

- ✅ Admin có thể CRUD tất cả entities
- ✅ UI/UX đơn giản, dễ sử dụng
- ✅ Real-time updates cho data changes
- ✅ Role-based access control (admin, moderator)
- ✅ Audit log cho tất cả actions
- ✅ Responsive design (desktop-first)

---

## 🏗️ Kiến Trúc CMS

### Tech Stack Proposal

#### Option 1: Full Custom (Recommended)
```
Frontend: Vanilla JS + TailwindCSS + Alpine.js
Backend: Go (existing)
Database: PostgreSQL (Supabase)
Auth: JWT (existing)
```

**Pros:**
- Lightweight, no heavy frameworks
- Tận dụng backend Go đã có
- Dễ customize
- Performance tốt

**Cons:**
- Phải build từ đầu
- Mất thời gian hơn

#### Option 2: React Admin Framework
```
Frontend: React + React Admin / Refine
Backend: Go (existing)
Database: PostgreSQL (Supabase)
```

**Pros:**
- Rapid development
- Many built-in components
- Professional UI

**Cons:**
- Heavy bundle size
- Learning curve
- Overkill cho project này

#### Option 3: Low-code Solution
```
Frontend: Retool / Budibase / AppSmith
Backend: Direct DB connection
```

**Pros:**
- Fastest to build
- No coding required

**Cons:**
- Vendor lock-in
- Less customizable
- Monthly cost

### 🎖️ Recommendation: **Option 1 - Full Custom**

Phù hợp nhất vì:
- Project đã có backend Go sẵn
- Team quen với vanilla JS
- Full control over features
- No external dependencies

---

## 🎨 UI/UX Design

### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  Header: Logo | User Menu | Notifications               │
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│ Sidebar  │         Main Content Area                    │
│          │                                              │
│ - Dashboard                                             │
│ - Posts  │  ┌────────────────────────────────┐          │
│ - Creators│  │  Content Header                │          │
│ - Users  │  │  (Title, Actions, Filters)     │          │
│ - Products│  └────────────────────────────────┘          │
│ - Squads │                                              │
│ - Tags   │  ┌────────────────────────────────┐          │
│ - Analytics│ │                                │          │
│ - Settings│  │  Data Table / Cards / Forms   │          │
│          │  │                                │          │
│          │  │                                │          │
│          │  └────────────────────────────────┘          │
│          │                                              │
│          │  [Pagination]                                │
└──────────┴──────────────────────────────────────────────┘
```

### Color Scheme

```css
Primary: #3B82F6 (Blue)
Secondary: #8B5CF6 (Purple)
Success: #10B981 (Green)
Warning: #F59E0B (Orange)
Danger: #EF4444 (Red)
Gray: #6B7280
Background: #F9FAFB
Dark: #111827
```

### Design Principles

1. **Simplicity First** - Clean, minimal interface
2. **Data-Driven** - Focus on information density
3. **Action-Oriented** - Quick access to common tasks
4. **Feedback-Rich** - Clear success/error messages
5. **Responsive** - Works on all screen sizes

---

## 📋 Feature Modules

### 1. 🏠 Dashboard

**Purpose:** Overview của toàn bộ hệ thống

**Key Metrics:**
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Total Users │ Total Posts │ Total Views │ Active Users│
│   1,234     │    567      │   45.6K     │    234      │
└─────────────┴─────────────┴─────────────┴─────────────┘

Recent Activity Timeline:
- User "techguru" created post "RTX 4090 Review"
- Post "Build PC 30M" reached 1000 views
- New user "newbie123" registered

Charts:
- Posts per day (last 30 days)
- User growth (last 90 days)
- Engagement rate trend
- Top performing posts
```

**Actions:**
- Quick create post
- Quick moderate comments
- View pending approvals

---

### 2. 📝 Posts Management

**List View:**
```
Filters: [Status] [Type] [Creator] [Tag] [Date Range]
Search: [Search title, content...]

Table Columns:
┌─────┬──────────────┬──────────┬────────┬──────┬────────────┐
│ ID  │ Title        │ Creator  │ Status │ Views│ Actions    │
├─────┼──────────────┼──────────┼────────┼──────┼────────────┤
│ p01 │ ASUS ROG...  │ Scrapshut│ Pub.   │ 1250 │ Edit│Del   │
│ p02 │ Top 5 Chuột..│ Scrapshut│ Pub.   │ 3200 │ Edit│Del   │
└─────┴──────────────┴──────────┴────────┴──────┴────────────┘
```

**Create/Edit Form:**
```
Title: [________________]
Slug: [________________] (auto-generate)
Description: [________________]
Content: [Rich Text Editor - TinyMCE/QuillJS]

Thumbnail: [Upload Image] [Browse Library]

Type: (•) Article ( ) Video ( ) Review
Status: (•) Published ( ) Draft ( ) Scheduled

Creators: [Select Multiple Creators]
Tags: [Select/Create Tags]
Products: [Select Products to mention]

Featured: [x] Show on homepage

Metadata:
- Source: [Select Source]
- Published Date: [Date Picker]
- View Count: 1250 (read-only)
- Upvotes: 25 (read-only)
- Comments: 6 (read-only)

[Save Draft] [Publish] [Schedule]
```

**Bulk Actions:**
- Publish/Unpublish multiple posts
- Change status
- Assign to creator
- Delete

---

### 3. 👥 Creators Management

**List View:**
```
Filters: [Verified] [Platform]
Search: [Search name...]

Cards View:
┌──────────────────────────────────────┐
│ 📸 [Avatar]                          │
│ Scrapshut ✓                          │
│ 150K followers                       │
│ 3 posts                              │
│ [Edit] [View Profile] [Delete]      │
└──────────────────────────────────────┘
```

**Create/Edit Form:**
```
Name: [________________]
Slug: [________________]
Bio: [________________]
Avatar URL: [________________]

✓ Verified Creator

Website: [________________]
Social Media:
  - YouTube: [________________]
  - Facebook: [________________]
  - Twitter: [________________]

Stats (read-only):
- Total Followers: 150,000
- Total Posts: 3
- Avg. Views per Post: 2,500

[Save] [Cancel]
```

---

### 4. 👤 Users Management

**List View:**
```
Filters: [Role] [Status] [Level] [Registration Date]
Search: [Email, username...]

Table:
┌──────┬─────────┬────────────┬──────┬────────┬─────────┐
│ ID   │ Username│ Email      │ Role │ Level  │ Actions │
├──────┼─────────┼────────────┼──────┼────────┼─────────┤
│ ...01│ admin   │ admin@...  │ Admin│ 10     │ Edit│Ban│
│ ...02│ techguru│ tech@...   │ User │ 8      │ Edit│Ban│
└──────┴─────────┴────────────┴──────┴────────┴─────────┘
```

**User Detail View:**
```
Profile:
  - Avatar, Display Name, Bio
  - Email, Username
  - Role, Status

Stats:
  - Level: 8 (3200 XP)
  - Streak: 15 days
  - Total Posts: 0
  - Total Comments: 5
  - Achievements: 3/7

Activity:
  - Recent comments
  - Recent votes
  - Recent bookmarks

Actions:
  - Change role (admin, moderator, user)
  - Ban/Suspend user
  - Reset password
  - View audit log
  - Delete account
```

---

### 5. 🛒 Products Management

**List View:**
```
Filters: [Category] [Brand] [Status] [Price Range]
Search: [Product name...]

Table:
┌─────┬─────────────┬──────────┬────────┬───────────┬────────┐
│ ID  │ Name        │ Category │ Brand  │ Price     │ Actions│
├─────┼─────────────┼──────────┼────────┼───────────┼────────┤
│ b..1│ ASUS ROG... │ Laptop   │ ASUS   │ 35.99M VNĐ│ Edit│Del│
│ b..2│ Logitech... │ Mouse    │ Logitech│3.29M VNĐ │ Edit│Del│
└─────┴─────────────┴──────────┴────────┴───────────┴────────┘
```

**Create/Edit Form:**
```
Name: [________________]
Slug: [________________]
Category: [Select Category]
Brand: [Select Brand]

Price: [________________] VNĐ
Image URL: [________________]
GearVN URL: [________________]

Status: (•) Available ( ) Out of Stock ( ) Discontinued

Description: [Rich Text Editor]

[Save] [Cancel]
```

**Category/Brand Management:**
- Quick add categories
- Quick add brands
- Organize hierarchy

---

### 6. 👨‍👩‍👧‍👦 Squads (Communities) Management

**List View:**
```
Table:
┌─────┬─────────────┬────────┬─────────┬──────┬────────┐
│ ID  │ Name        │ Type   │ Members │ Posts│ Actions│
├─────┼─────────────┼────────┼─────────┼──────┼────────┤
│ sq01│ PC Builders.│ Public │ 3       │ 0    │ Edit│Del│
│ sq02│ Gaming Gear.│ Public │ 3       │ 0    │ Edit│Del│
└─────┴─────────────┴────────┴─────────┴──────┴────────┘
```

**Squad Detail:**
```
Info:
  - Name, Description
  - Avatar, Type (public/private)
  - Creator

Members:
  - List of members
  - Roles (admin, moderator, member)
  - Remove members
  - Ban members

Posts:
  - Posts shared to this squad
  - Moderate posts

Settings:
  - Change type
  - Delete squad
```

---

### 7. 🏷️ Tags Management

**List View:**
```
Table:
┌─────┬─────────┬──────────┬────────┬────────┐
│ ID  │ Name    │ Slug     │ Posts  │ Actions│
├─────┼─────────┼──────────┼────────┼────────┤
│ ...01│ Gaming  │ gaming   │ 2      │ Edit│Del│
│ ...02│ PC Build│ pc-build │ 1      │ Edit│Del│
└─────┴─────────┴──────────┴────────┴────────┘
```

**Quick Actions:**
- Create new tag inline
- Merge tags
- Bulk delete unused tags

---

### 8. 💬 Comments Moderation

**List View:**
```
Filters: [Status] [Post] [User] [Flagged]
Search: [Comment content...]

Table:
┌─────┬─────────┬──────────┬─────────┬──────┬────────┐
│ ID  │ User    │ Post     │ Content │ Votes│ Actions│
├─────┼─────────┼──────────┼─────────┼──────┼────────┤
│ c01 │ techguru│ ASUS ROG │ Laptop..│ 5    │ Edit│Del│
│ c02 │ gamerpro│ ASUS ROG │ Pin có..│ 2    │ Edit│Del│
└─────┴─────────┴──────────┴─────────┴──────┴────────┘
```

**Actions:**
- Approve/Reject comment
- Edit comment
- Delete comment
- Ban user who posted
- View comment thread

---

### 9. 🎮 Gamification Management

**Achievements:**
```
List:
┌─────┬────────────┬──────────┬────────┬─────────┐
│ ID  │ Name       │ Type     │ Points │ Unlocked│
├─────┼────────────┼──────────┼────────┼─────────┤
│ ach1│ First Post │ Contrib. │ 100    │ 3 users │
│ ach2│ 7 Day Streak│ Streak  │ 200    │ 2 users │
└─────┴────────────┴──────────┴────────┴─────────┘

[Create Achievement] [Edit] [Delete]
```

**User Levels:**
```
Configuration:
Level 1: 0-100 XP
Level 2: 101-250 XP
Level 3: 251-500 XP
...

Rewards per Level:
- Level 5: Unlock custom avatar
- Level 10: Moderator privileges
```

**Points System:**
```
Rules:
- Create post: +50 points
- Get upvote: +10 points
- Comment: +5 points
- Daily login: +10 points
- 7 day streak: +200 points bonus
```

---

### 10. 📊 Analytics & Reports

**Overview Dashboard:**
```
Date Range: [Last 30 Days ▼]

User Analytics:
- New signups: 45 (+12%)
- Active users: 234 (-5%)
- Retention rate: 67%

Content Analytics:
- Posts published: 23 (+8%)
- Total views: 45.6K (+15%)
- Avg. engagement: 8.5%

Top Content:
1. "RTX 4090 vs 4080" - 4500 views
2. "Top 5 Chuột Gaming" - 3200 views
3. "Build PC 30 Triệu" - 2800 views

Top Users:
1. techguru - Level 8, 15 day streak
2. gamerpro - Level 7, 10 day streak
3. pcbuilder - Level 6, 7 day streak
```

**Export Options:**
- CSV export
- PDF report
- Schedule weekly reports

---

### 11. ⚙️ System Settings

**General:**
```
Site Name: [GearVN News Blog]
Site URL: [https://news.gearvn.com]
Admin Email: [admin@gearvn.com]

Logo: [Upload]
Favicon: [Upload]
```

**Email Settings:**
```
SMTP Host: [smtp.gmail.com]
SMTP Port: [587]
Username: [________]
Password: [********]

Email Templates:
- Welcome email
- Password reset
- New comment notification
- Achievement unlocked
```

**API Keys:**
```
Supabase API Key: [***********]
JWT Secret: [***********]
YouTube API Key: [___________]
```

**Maintenance Mode:**
```
☐ Enable Maintenance Mode
Message: [We're updating the site...]
```

---

## 🔐 Security & Permissions

### Role-Based Access Control (RBAC)

**Roles:**

1. **Super Admin** (Full Access)
   - All permissions
   - System settings
   - User role management

2. **Admin**
   - CRUD posts, users, products, creators
   - Moderate comments
   - View analytics
   - Cannot change system settings

3. **Moderator**
   - Moderate comments
   - Edit posts (not delete)
   - View analytics (read-only)
   - Cannot manage users/products

4. **Editor**
   - CRUD posts
   - Manage tags
   - Cannot moderate or manage users

### Permission Matrix

```
┌─────────────────┬───────┬───────┬──────────┬────────┐
│ Action          │ Super │ Admin │ Moderator│ Editor │
├─────────────────┼───────┼───────┼──────────┼────────┤
│ Manage Users    │   ✓   │   ✓   │    ✗     │   ✗    │
│ Manage Posts    │   ✓   │   ✓   │    R     │   ✓    │
│ Moderate Comms  │   ✓   │   ✓   │    ✓     │   ✗    │
│ Manage Products │   ✓   │   ✓   │    ✗     │   ✗    │
│ View Analytics  │   ✓   │   ✓   │    R     │   R    │
│ System Settings │   ✓   │   ✗   │    ✗     │   ✗    │
└─────────────────┴───────┴───────┴──────────┴────────┘

✓ = Full Access, R = Read Only, ✗ = No Access
```

### Security Features

1. **Authentication:**
   - JWT-based auth (existing)
   - 2FA for admin accounts (optional)
   - Session timeout (30 mins)

2. **Audit Log:**
   - Track all admin actions
   - Who, what, when, IP address
   - Cannot be deleted (append-only)

3. **Data Protection:**
   - CSRF protection
   - XSS sanitization
   - SQL injection prevention (prepared statements)

---

## 🔄 User Flows

### Flow 1: Create New Post

```
1. Admin clicks "Posts" in sidebar
2. Click "Create New Post" button
3. Fill in form:
   - Title, slug, description
   - Content (rich text)
   - Upload thumbnail
   - Select creators, tags, products
   - Set status (draft/published)
4. Click "Publish"
5. System validates:
   - Required fields filled
   - Slug is unique
6. Success:
   - Post created
   - Redirect to post list
   - Show success message
   - Notification sent to followers (if published)
```

### Flow 2: Moderate Comment

```
1. Admin clicks "Comments" in sidebar
2. See list of recent comments
3. Flagged comments highlighted in red
4. Admin clicks "Review" on flagged comment
5. See comment detail:
   - Full content
   - User info
   - Post context
   - Reason for flag
6. Admin chooses:
   a. Approve → Remove flag
   b. Edit → Fix content
   c. Delete → Remove comment
   d. Ban User → Delete + ban user
7. Action executed
8. Comment status updated
9. User notified (if edited/deleted)
```

### Flow 3: Manage User Levels

```
1. Admin clicks "Users" in sidebar
2. Search for user "techguru"
3. Click "View Details"
4. See user stats:
   - Current level: 8
   - Total points: 3200
   - Achievements: 3/7
5. Admin can:
   - Manually adjust points
   - Grant achievement
   - Change level
6. Click "Grant Achievement"
7. Select achievement from dropdown
8. Confirm
9. User receives notification
10. Achievement appears in user profile
```

### Flow 4: View Analytics

```
1. Admin clicks "Analytics" in sidebar
2. Select date range (last 30 days)
3. See overview metrics:
   - User growth chart
   - Post views chart
   - Engagement rate
4. Click "Export Report"
5. Choose format (CSV/PDF)
6. Download file
7. Optional: Schedule weekly reports
```

---

## 🛠️ Technical Implementation

### Backend API Endpoints

#### Authentication
```
POST   /api/admin/login
POST   /api/admin/logout
GET    /api/admin/me
POST   /api/admin/refresh-token
```

#### Posts
```
GET    /api/admin/posts              # List with pagination, filters
GET    /api/admin/posts/:id          # Get single post
POST   /api/admin/posts              # Create post
PUT    /api/admin/posts/:id          # Update post
DELETE /api/admin/posts/:id          # Delete post
POST   /api/admin/posts/bulk-action  # Bulk operations
```

#### Users
```
GET    /api/admin/users
GET    /api/admin/users/:id
PUT    /api/admin/users/:id
DELETE /api/admin/users/:id
POST   /api/admin/users/:id/ban
POST   /api/admin/users/:id/grant-achievement
```

#### Creators
```
GET    /api/admin/creators
POST   /api/admin/creators
PUT    /api/admin/creators/:id
DELETE /api/admin/creators/:id
```

#### Products
```
GET    /api/admin/products
POST   /api/admin/products
PUT    /api/admin/products/:id
DELETE /api/admin/products/:id
GET    /api/admin/product-categories
POST   /api/admin/product-categories
GET    /api/admin/brands
POST   /api/admin/brands
```

#### Comments
```
GET    /api/admin/comments           # With filters (flagged, etc.)
PUT    /api/admin/comments/:id
DELETE /api/admin/comments/:id
POST   /api/admin/comments/:id/approve
```

#### Analytics
```
GET    /api/admin/analytics/overview
GET    /api/admin/analytics/users
GET    /api/admin/analytics/posts
GET    /api/admin/analytics/engagement
POST   /api/admin/analytics/export
```

#### Settings
```
GET    /api/admin/settings
PUT    /api/admin/settings
```

### Frontend Architecture

```
admin/
├── index.html                  # Main layout
├── assets/
│   ├── css/
│   │   ├── tailwind.css       # TailwindCSS
│   │   └── admin.css          # Custom styles
│   └── js/
│       ├── app.js             # Main app initialization
│       ├── router.js          # Client-side routing
│       ├── api.js             # API client
│       ├── auth.js            # Authentication logic
│       ├── components/
│       │   ├── sidebar.js
│       │   ├── header.js
│       │   ├── table.js
│       │   ├── form.js
│       │   ├── modal.js
│       │   └── chart.js
│       └── pages/
│           ├── dashboard.js
│           ├── posts.js
│           ├── users.js
│           ├── products.js
│           ├── creators.js
│           ├── squads.js
│           ├── tags.js
│           ├── comments.js
│           ├── analytics.js
│           └── settings.js
└── login.html                  # Login page
```

### Libraries to Use

```json
{
  "ui": {
    "tailwindcss": "^3.4",
    "alpinejs": "^3.13",        // For reactivity
    "lucide": "^0.292"          // Icons
  },
  "editor": {
    "tinymce": "^6.7"           // Rich text editor
  },
  "charts": {
    "chart.js": "^4.4"          // For analytics charts
  },
  "utilities": {
    "dayjs": "^1.11",           // Date manipulation
    "axios": "^1.6"             // HTTP client
  },
  "tables": {
    "gridjs": "^6.0"            // Advanced data tables
  }
}
```

---

## 📅 Development Roadmap

### Phase 1: Foundation (Week 1-2)

**Backend:**
- [ ] Create admin middleware (auth check, role check)
- [ ] Implement admin API endpoints (CRUD for all entities)
- [ ] Add audit logging
- [ ] Add role-based permissions

**Frontend:**
- [ ] Setup project structure
- [ ] Create layout (sidebar + header + main)
- [ ] Implement authentication (login/logout)
- [ ] Client-side routing
- [ ] API client setup

### Phase 2: Core Features (Week 3-4)

**Posts Management:**
- [ ] Posts list view with filters
- [ ] Create/Edit post form
- [ ] Rich text editor integration
- [ ] Image upload
- [ ] Bulk actions

**Users Management:**
- [ ] Users list view
- [ ] User detail view
- [ ] Role management
- [ ] Ban/suspend functionality

**Creators Management:**
- [ ] Creators list/cards view
- [ ] Create/Edit creator form
- [ ] Social media links management

### Phase 3: Extended Features (Week 5-6)

**Products Management:**
- [ ] Products list view
- [ ] Create/Edit product form
- [ ] Categories/Brands management

**Comments Moderation:**
- [ ] Comments list with filters
- [ ] Flagged comments view
- [ ] Approve/Edit/Delete actions

**Squads Management:**
- [ ] Squads list view
- [ ] Squad detail view
- [ ] Members management

**Tags Management:**
- [ ] Tags list view
- [ ] Quick create/edit
- [ ] Merge functionality

### Phase 4: Analytics & Settings (Week 7-8)

**Dashboard:**
- [ ] Key metrics cards
- [ ] Charts (users, posts, views)
- [ ] Recent activity timeline
- [ ] Quick actions

**Analytics:**
- [ ] User analytics
- [ ] Content analytics
- [ ] Engagement metrics
- [ ] Export functionality

**Gamification:**
- [ ] Achievements management
- [ ] Levels configuration
- [ ] Points rules

**System Settings:**
- [ ] General settings
- [ ] Email configuration
- [ ] API keys management
- [ ] Maintenance mode

### Phase 5: Polish & Testing (Week 9-10)

- [ ] UI/UX improvements
- [ ] Responsive design testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] Documentation
- [ ] User acceptance testing

---

## 🎨 UI Components Library

### Reusable Components

**1. DataTable Component**
```javascript
// Usage
<div x-data="dataTable({
  endpoint: '/api/admin/posts',
  columns: ['id', 'title', 'status', 'views'],
  actions: ['edit', 'delete']
})">
  <!-- Table renders here -->
</div>
```

**2. Modal Component**
```javascript
// Usage
<div x-data="modal">
  <button @click="open()">Open Modal</button>
  <div x-show="isOpen">Modal Content</div>
</div>
```

**3. Form Component**
```javascript
// Usage
<form x-data="adminForm({
  endpoint: '/api/admin/posts',
  method: 'POST',
  fields: {...}
})">
  <!-- Form fields -->
</form>
```

**4. Alert/Toast Component**
```javascript
// Usage
toast.success('Post created successfully!');
toast.error('Failed to delete user');
toast.warning('Unsaved changes');
```

**5. Pagination Component**
```javascript
// Usage
<div x-data="pagination({
  total: 100,
  perPage: 20,
  current: 1
})">
  <!-- Pagination controls -->
</div>
```

---

## 🔍 Search & Filters

### Global Search

```javascript
// Top header search bar
Search: [🔍 Quick search posts, users, products...]

Results:
┌────────────────────────────────┐
│ Posts (3)                      │
│ - RTX 4090 vs 4080             │
│ - Top 5 Chuột Gaming           │
│                                │
│ Users (2)                      │
│ - techguru                     │
│ - gamerpro                     │
│                                │
│ Products (1)                   │
│ - ASUS ROG Strix G15           │
└────────────────────────────────┘
```

### Advanced Filters (Per Page)

**Posts:**
- Status: All, Published, Draft, Scheduled
- Type: All, Article, Video, Review
- Creator: All, Scrapshut, Linus, etc.
- Tags: All, Gaming, PC Build, etc.
- Date Range: Last 7 days, 30 days, Custom

**Users:**
- Role: All, Admin, Moderator, User
- Status: All, Active, Banned, Suspended
- Level: All, 1-3, 4-6, 7-10
- Registration: Last 7 days, 30 days, etc.

---

## 📱 Responsive Design

### Breakpoints

```css
Mobile: < 640px
Tablet: 640px - 1024px
Desktop: > 1024px
```

### Mobile Adaptations

**Sidebar:**
- Hidden by default on mobile
- Toggle with hamburger menu
- Full-screen overlay when open

**Tables:**
- Convert to cards on mobile
- Horizontal scroll for complex tables
- Sticky headers

**Forms:**
- Full-width inputs on mobile
- Stack fields vertically
- Larger touch targets

---

## ⚡ Performance Optimizations

### Backend

1. **Pagination**
   - Default: 20 items per page
   - Max: 100 items per page

2. **Database Indexes**
   - Add indexes on frequently queried fields
   - Composite indexes for filter combinations

3. **Caching**
   - Cache analytics data (1 hour)
   - Cache settings (until updated)
   - Redis for session storage

4. **API Response**
   - GZIP compression
   - Partial responses (field selection)
   - ETag for caching

### Frontend

1. **Lazy Loading**
   - Load pages on demand
   - Lazy load images
   - Infinite scroll for long lists

2. **Debouncing**
   - Search input (300ms)
   - Filter changes (500ms)

3. **Code Splitting**
   - Separate bundles per page
   - Load TinyMCE only when needed

4. **Asset Optimization**
   - Minify CSS/JS
   - Compress images
   - Use CDN for libraries

---

## 🧪 Testing Strategy

### Backend Tests

```go
// Unit tests
func TestCreatePost(t *testing.T) {...}
func TestDeleteUser(t *testing.T) {...}

// Integration tests
func TestAdminPostWorkflow(t *testing.T) {...}
```

### Frontend Tests

```javascript
// Component tests (Jest)
test('DataTable renders correctly', () => {...});
test('Form validation works', () => {...});

// E2E tests (Cypress)
describe('Admin Login', () => {
  it('logs in successfully', () => {...});
});
```

### Manual Testing Checklist

- [ ] All CRUD operations work
- [ ] Permissions respected for each role
- [ ] Responsive on mobile/tablet/desktop
- [ ] Forms validate correctly
- [ ] Bulk actions work
- [ ] Search and filters work
- [ ] Audit log records actions
- [ ] Session timeout works

---

## 📖 Documentation Plan

### Admin User Guide

1. **Getting Started**
   - Login
   - Dashboard overview
   - Navigation

2. **Managing Content**
   - Create/Edit posts
   - Upload images
   - Assign creators/tags

3. **User Management**
   - View user profiles
   - Change roles
   - Ban users

4. **Moderation**
   - Review comments
   - Handle flags
   - Ban abusive users

5. **Analytics**
   - View reports
   - Export data

### Developer Docs

1. **API Reference**
   - All endpoints
   - Request/response formats
   - Authentication

2. **Architecture**
   - Project structure
   - Component hierarchy
   - State management

3. **Deployment**
   - Build process
   - Environment variables
   - Server setup

---

## 🚀 Deployment

### Build Process

```bash
# Frontend
npm run build:admin

# Output
admin/dist/
├── index.html
├── assets/
│   ├── css/admin.min.css
│   └── js/admin.min.js
└── login.html
```

### Deployment Options

**Option 1: Same Server as Main App**
```
/public/
├── index.html          # Main app
├── admin/              # Admin CMS
│   ├── index.html
│   └── assets/
└── scripts/
```

**Option 2: Separate Subdomain**
```
Main App: https://news.gearvn.com
Admin CMS: https://admin.news.gearvn.com
```

**Option 3: Separate Server**
```
Main App: Server A
Admin CMS: Server B (more secure)
```

### Environment Variables

```env
# Admin-specific
ADMIN_BASE_URL=https://admin.news.gearvn.com
ADMIN_API_URL=https://api.news.gearvn.com
ADMIN_SESSION_TIMEOUT=1800
```

---

## 💰 Cost Estimation

### Development Time

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Phase 1 | Foundation | 2 weeks |
| Phase 2 | Core Features | 2 weeks |
| Phase 3 | Extended Features | 2 weeks |
| Phase 4 | Analytics & Settings | 2 weeks |
| Phase 5 | Polish & Testing | 2 weeks |
| **Total** | | **10 weeks** |

### Infrastructure Cost (Monthly)

| Service | Cost |
|---------|------|
| Supabase (existing) | $0 (Free tier) |
| Hosting (if separate) | ~$10-20 |
| CDN | ~$5 |
| **Total** | **~$15-25/month** |

---

## ✅ Success Metrics

### KPIs to Track

1. **Admin Efficiency**
   - Time to create post: < 5 mins
   - Time to moderate comment: < 30 secs
   - Time to manage user: < 1 min

2. **System Performance**
   - Page load time: < 2 secs
   - API response time: < 500ms
   - Error rate: < 0.1%

3. **User Satisfaction**
   - Admin user feedback score: > 4/5
   - Feature adoption rate: > 80%
   - Support tickets: < 5/month

---

## 🎯 Next Steps

### Immediate Actions

1. **Review & Approve**
   - [ ] Review this proposal
   - [ ] Provide feedback
   - [ ] Approve to proceed

2. **Preparation**
   - [ ] Setup development environment
   - [ ] Create admin database user
   - [ ] Setup admin API routes structure

3. **Start Development**
   - [ ] Phase 1: Foundation
   - [ ] Begin with backend API
   - [ ] Then frontend layout

---

## 📞 Questions & Feedback

### Decision Points

1. **Design Choice:** Option 1 (Full Custom) hoặc Option 2 (React Admin)?
2. **Deployment:** Same server hay separate subdomain?
3. **Features Priority:** Có features nào cần ưu tiên trước không?
4. **Timeline:** 10 weeks có acceptable không?

### Optional Features

- [ ] Real-time notifications (WebSocket)
- [ ] Dark mode
- [ ] Activity feed
- [ ] Scheduled posts
- [ ] Draft preview
- [ ] Version history

---

**Prepared by:** AI Assistant
**Date:** 2025-01-18
**Status:** Awaiting Review

**👉 Next:** Please review and provide feedback để bắt đầu implementation!
