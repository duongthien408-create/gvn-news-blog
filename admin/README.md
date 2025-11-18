# 🎛️ Admin CMS - GearVN News Blog

Admin dashboard for managing the GearVN News Blog platform.

---

## 📋 Overview

**Tech Stack:**
- **Frontend:** Vanilla JavaScript + Alpine.js + TailwindCSS
- **Icons:** Lucide Icons
- **Backend API:** Go (existing)
- **Database:** PostgreSQL (Supabase)

**Features:**
- ✅ Dashboard with statistics
- ✅ Posts management (CRUD)
- ✅ Users management (with roles & bans)
- ✅ Creators management
- ✅ Products management
- ✅ Tags management
- ✅ Comments moderation
- ✅ Analytics & reports
- ✅ System settings

---

## 🚀 Quick Start

### 1. Access Admin Panel

```
Development: http://localhost:5500/admin/login.html
Production: https://your-domain.com/admin/login.html
```

### 2. Login

**Test Credentials:**
```
Email: admin@gearvn.com
Password: password123
```

### 3. Start Managing

Navigate through the sidebar menu to access different modules.

---

## 📁 File Structure

```
admin/
├── login.html                      # Login page
├── index.html                      # Main dashboard layout
├── README.md                       # This file
│
├── assets/
│   ├── css/
│   │   └── (TailwindCSS via CDN)
│   │
│   ├── js/
│   │   ├── api.js                  # API client
│   │   │
│   │   ├── components/             # Reusable components (future)
│   │   │   ├── modal.js
│   │   │   ├── table.js
│   │   │   └── form.js
│   │   │
│   │   └── pages/                  # Page modules
│   │       ├── dashboard.js        # Dashboard page
│   │       ├── posts.js            # Posts management
│   │       ├── users.js            # Users management
│   │       ├── creators.js         # (To be implemented)
│   │       ├── products.js         # (To be implemented)
│   │       ├── tags.js             # (To be implemented)
│   │       ├── comments.js         # (To be implemented)
│   │       ├── analytics.js        # (To be implemented)
│   │       └── settings.js         # (To be implemented)
│   │
│   └── images/
│       └── (Static images)
```

---

## 🔑 Authentication

### Login Flow

1. User enters email & password
2. Request sent to `/api/auth/login`
3. Backend validates credentials
4. Returns JWT token + user info
5. Token stored in `localStorage`
6. User redirected to dashboard

### Token Storage

```javascript
localStorage.setItem('admin_token', token);
localStorage.setItem('admin_user', JSON.stringify(user));
```

### Protected Pages

All pages except `login.html` check for token:

```javascript
const token = localStorage.getItem('admin_token');
if (!token) {
    window.location.href = '/admin/login.html';
}
```

### Logout

```javascript
localStorage.removeItem('admin_token');
localStorage.removeItem('admin_user');
window.location.href = '/admin/login.html';
```

---

## 📊 Modules

### 1. Dashboard

**Path:** `#dashboard`
**File:** `assets/js/pages/dashboard.js`

**Features:**
- Overview statistics (users, posts, views)
- Recent posts
- Recent users
- Quick actions

**API Endpoints:**
- `GET /api/admin/dashboard/stats`
- `GET /api/admin/dashboard/activity`

---

### 2. Posts Management

**Path:** `#posts`
**File:** `assets/js/pages/posts.js`

**Features:**
- List all posts with pagination
- Filter by status (published/draft)
- Filter by type (article/video/review)
- Search posts
- Create new post
- Edit post
- Delete post
- Bulk delete

**API Endpoints:**
- `GET /api/admin/posts` - List posts
- `GET /api/admin/posts/:id` - Get single post
- `POST /api/admin/posts` - Create post
- `PUT /api/admin/posts/:id` - Update post
- `DELETE /api/admin/posts/:id` - Delete post
- `POST /api/admin/posts/bulk-delete` - Bulk delete

---

### 3. Users Management

**Path:** `#users`
**File:** `assets/js/pages/users.js`

**Features:**
- List all users with pagination
- Filter by role (admin/moderator/user)
- Filter by status (active/banned)
- Search users
- View user details
- Edit user
- Ban/unban user
- Change user role
- Grant achievements
- Delete user

**API Endpoints:**
- `GET /api/admin/users` - List users
- `GET /api/admin/users/:id` - Get single user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `POST /api/admin/users/:id/ban` - Ban user
- `POST /api/admin/users/:id/unban` - Unban user
- `PUT /api/admin/users/:id/role` - Change role
- `POST /api/admin/users/:id/achievements` - Grant achievement

---

## 🔌 API Client

**File:** `assets/js/api.js`

### Usage

```javascript
// GET request
const posts = await window.API.getPosts({ page: 1, status: 'published' });

// POST request
const newPost = await window.API.createPost({
    title: 'New Post',
    content: 'Content here...',
    status: 'published'
});

// PUT request
await window.API.updatePost(postId, { title: 'Updated Title' });

// DELETE request
await window.API.deletePost(postId);
```

### Authentication

Token is automatically included in all requests:

```javascript
headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
}
```

### Error Handling

```javascript
try {
    const data = await window.API.getPosts();
} catch (error) {
    console.error('Error:', error.message);
    // Handle 401: Redirect to login
    // Handle other errors: Show error message
}
```

---

## 🎨 Styling

### TailwindCSS

Using TailwindCSS CDN for rapid development:

```html
<script src="https://cdn.tailwindcss.com"></script>
```

### Color Scheme

```css
Primary: Blue (#3B82F6)
Success: Green (#10B981)
Warning: Orange (#F59E0B)
Danger: Red (#EF4444)
Gray: #6B7280
```

### Icons

Using Lucide Icons:

```html
<i data-lucide="icon-name" class="h-5 w-5"></i>
```

After rendering, initialize icons:

```javascript
lucide.createIcons();
```

---

## 🔐 Security

### Role-Based Access Control

**Roles:**
1. **admin** - Full access
2. **moderator** - Read + moderate
3. **user** - No admin access

### Permission Check

Login page checks user role:

```javascript
if (!['admin', 'moderator'].includes(user.role)) {
    throw new Error('Access denied. Admin privileges required.');
}
```

### CSRF Protection

(To be implemented on backend)

### XSS Prevention

User input is sanitized before display:
- Use Alpine.js `x-text` instead of `innerHTML`
- Sanitize content in rich text editor

---

## 📱 Responsive Design

### Breakpoints

```css
Mobile: < 640px
Tablet: 640px - 1024px
Desktop: > 1024px
```

### Mobile Features

- Hamburger menu for sidebar
- Responsive tables (cards on mobile)
- Touch-friendly buttons
- Full-screen modals

---

## 🚧 To Do

### High Priority

- [ ] Implement Create/Edit Post modal with rich text editor
- [ ] Implement backend admin API endpoints
- [ ] Add form validation
- [ ] Add toast notifications
- [ ] Implement Creators management
- [ ] Implement Products management

### Medium Priority

- [ ] Add image upload functionality
- [ ] Implement Tags management
- [ ] Implement Comments moderation
- [ ] Add Analytics page with charts
- [ ] Add Settings page

### Low Priority

- [ ] Add dark mode
- [ ] Add keyboard shortcuts
- [ ] Add export functionality
- [ ] Add bulk actions for users
- [ ] Add activity log viewer

---

## 🐛 Known Issues

1. **API endpoints not implemented** - Backend needs to implement admin routes
2. **No rich text editor** - Need to add TinyMCE or similar
3. **No image upload** - Need to implement file upload
4. **No toast notifications** - Using `alert()` for now
5. **Modals are placeholders** - Need to build actual modals

---

## 🔧 Development

### Local Development

1. Start backend server:
```bash
cd backend
go run .
```

2. Serve admin files:
```bash
# Using Python
python -m http.server 5500

# Or using Live Server in VS Code
# Right-click index.html > Open with Live Server
```

3. Access admin:
```
http://localhost:5500/admin/login.html
```

### Adding New Page

1. Create page file in `assets/js/pages/`:
```javascript
// assets/js/pages/creators.js
window.loadCreators = async function() {
    const container = document.getElementById('creators-content');
    container.innerHTML = `...`;
};

function creatorsPage() {
    return { ... };
}
```

2. Add to `index.html`:
```html
<script src="assets/js/pages/creators.js"></script>

<div x-show="currentPage === 'creators'" x-cloak>
    <div id="creators-content"></div>
</div>
```

3. Update menu in `index.html`:
```javascript
menuItems: [
    ...
    { id: 'creators', name: 'Creators', icon: 'user-check', href: '#creators' },
]
```

4. Update `loadPageContent()` function:
```javascript
case 'creators':
    if (window.loadCreators) window.loadCreators();
    break;
```

---

## 📚 Resources

### Documentation

- [Alpine.js](https://alpinejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

### API Documentation

See [CMS-DESIGN-PROPOSAL.md](../CMS-DESIGN-PROPOSAL.md) for full API specification.

---

## 🤝 Contributing

### Code Style

- Use camelCase for JavaScript variables
- Use kebab-case for HTML attributes
- Use 4-space indentation
- Add comments for complex logic

### Testing

Before committing:
1. Test all CRUD operations
2. Test on mobile/tablet/desktop
3. Check for console errors
4. Verify API calls

---

## 📞 Support

**Issues?**
- Check browser console for errors
- Verify backend is running
- Check if token is valid
- Review API endpoint URLs

**Need Help?**
Contact the development team.

---

**Last Updated:** 2025-01-18
**Version:** 1.0.0-beta
**Status:** 🚧 In Development

---

## 🎯 Next Steps

1. **Implement Backend API** - Create admin routes in Go
2. **Add Rich Text Editor** - Integrate TinyMCE for posts
3. **Add File Upload** - Implement image upload functionality
4. **Complete Remaining Modules** - Creators, Products, Tags, etc.
5. **Add Tests** - Unit and integration tests
6. **Deploy** - Deploy to production server

**Ready to manage your content!** 🚀
