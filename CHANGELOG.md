# Changelog

## [2024-12-30] - UI/UX Pro Max & G-Auth Integration

### UI/UX Improvements (UI/UX Pro Max Skill)

#### Typography
- Added **Space Grotesk** font for headings (`font-heading` class)
- Keep **Inter** for body text (`font-sans` class)
- Google Fonts preconnect for faster loading

#### Accessibility
- Smooth scrolling with `prefers-reduced-motion` respect
- Better `:focus-visible` outline (red ring) for keyboard users
- Hidden focus ring for mouse users
- Skip link for screen readers ("Bỏ qua đến nội dung chính")
- Proper `lang="vi"` attribute on HTML

#### Visual Polish
- Custom scrollbar (zinc-700 thumb, zinc-950 track)
- Selection color (red-500/30 background)
- `antialiased` text rendering
- Theme color meta tag (#09090b)

### Authentication (G-Auth Integration)

#### New Files
| File | Purpose |
|------|---------|
| `src/lib/auth.js` | G-Auth API functions (login, logout, getMe, token management) |
| `src/contexts/AuthContext.jsx` | React context for global auth state |
| `src/components/ProtectedRoute.jsx` | Route guard for protected pages |
| `src/pages/Login.jsx` | Login page with dark theme UI |

#### Configuration
- **API**: `https://api-gauth.uat.gearvn.xyz`
- **Tenant ID**: `019b01a2-3647-7a8f-98ad-67cc00c35d8c`
- **Token Storage**: localStorage (`g_auth_access_token`, `g_auth_refresh_token`, `g_auth_expires_at`)
- **Vite Proxy**: `/api/gauth` → G-Auth API (fixes CORS in development)

#### Routes
| Route | Component | Protected |
|-------|-----------|-----------|
| `/` | App | No |
| `/articles/:slug` | ArticlePage | No |
| `/login` | Login | No |

#### Usage

**Login page**: Navigate to `/login`

**Protect a route**:
```jsx
import ProtectedRoute from './components/ProtectedRoute';

<Route path="/admin" element={
  <ProtectedRoute>
    <AdminPage />
  </ProtectedRoute>
} />
```

**Use auth in components**:
```jsx
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, loading, login, logout } = useAuth();

  if (loading) return <Spinner />;
  if (!user) return <p>Please login</p>;

  return <p>Welcome, {user.name}</p>;
}
```

### Files Modified

| File | Changes |
|------|---------|
| `index.html` | Font preconnect, meta tags, skip link, `lang="vi"` |
| `src/index.css` | Accessibility CSS, scrollbar, selection styles |
| `tailwind.config.js` | Space Grotesk font family |
| `src/main.jsx` | AuthProvider wrapper, /login route |
| `vite.config.js` | Proxy for G-Auth API |

### Notes

- Login requires a G-Auth account on tenant `019b01a2-3647-7a8f-98ad-67cc00c35d8c`
- Contact G-Auth admin to create user accounts
- CORS proxy only works in development (`npm run dev`)
- Production deployment needs G-Auth CORS whitelist or reverse proxy
