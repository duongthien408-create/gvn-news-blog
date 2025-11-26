# Theme Color System - GearVN Creator Hub

## Color Palette

### Dark Mode (Default)
```css
--color-surface: 0 0 0         /* Pure black #000000 - Main background */
--color-panel: 15 15 15        /* Almost black #0F0F0F - Sidebar, header */
--color-card: 25 25 25         /* Dark gray #191919 - Cards, inputs */
--color-border: 50 50 50       /* Border gray #323232 - Borders, dividers */
--color-text-primary: 255 255 255    /* Pure white #FFFFFF - Headings, main text */
--color-text-secondary: 200 200 200  /* Light gray #C8C8C8 - Body text, labels */
--color-text-muted: 150 150 150      /* Muted gray #969696 - Subtle text, placeholders */
--color-accent: 59 130 246           /* Blue #3B82F6 - Primary actions */
--color-accent-hover: 96 165 250     /* Lighter blue #60A5FA - Hover states */
```

### Light Mode
```css
--color-surface: 255 255 255   /* Pure white #FFFFFF - Main background */
--color-panel: 249 250 251     /* Very light gray #F9FAFB - Sidebar, header */
--color-card: 243 244 246      /* Light gray #F3F4F6 - Cards, inputs */
--color-border: 209 213 219    /* Medium gray #D1D5DB - Borders, dividers */
--color-text-primary: 17 24 39       /* Almost black #111827 - Headings, main text */
--color-text-secondary: 55 65 81     /* Dark gray #374151 - Body text, labels */
--color-text-muted: 107 114 128      /* Medium gray #6B7280 - Subtle text, placeholders */
--color-accent: 239 68 68            /* Red #EF4444 - Primary actions */
--color-accent-hover: 220 38 38      /* Darker red #DC2626 - Hover states */
```

---

## Component Color Rules

### 1. Page Background
**Purpose:** Main page container

**Dark Mode:**
- Background: `bg-theme-surface` (#000000)
- Text: `text-theme-primary` (#FFFFFF)

**Light Mode:**
- Background: `bg-theme-surface` (#FFFFFF)
- Text: `text-theme-primary` (#000000)

**Usage:**
```html
<body class="bg-theme-surface text-theme-primary">
```

---

### 2. Sidebar
**Purpose:** Navigation sidebar

**Dark Mode:**
- Background: `bg-theme-panel/90` (#0F0F0F with 90% opacity)
- Border: `border-theme-border` (#323232)
- Text: `text-theme-secondary` (#C8C8C8)
- Hover: `hover:text-theme-primary` (#FFFFFF)

**Light Mode:**
- Background: `bg-theme-panel/90` (#F8F8F8 with 90% opacity)
- Border: `border-theme-border` (#DCDCDC)
- Text: `text-theme-secondary` (#3C3C3C)
- Hover: `hover:text-theme-primary` (#000000)

**Usage:**
```html
<aside class="bg-theme-panel/90 border-theme-border text-theme-secondary">
```

---

### 3. Header / Navbar
**Purpose:** Top navigation bar

**Dark Mode:**
- Background: `bg-theme-panel/80` (#0F0F0F with 80% opacity)
- Border: `border-theme-border` (#323232)
- Text: `text-theme-primary` (#FFFFFF)

**Light Mode:**
- Background: `bg-theme-panel/80` (#F8F8F8 with 80% opacity)
- Border: `border-theme-border` (#DCDCDC)
- Text: `text-theme-primary` (#000000)

**Usage:**
```html
<header class="bg-theme-panel/80 border-b border-theme-border">
```

---

### 4. Post Cards
**Purpose:** Feed post cards

**Dark Mode:**
- Background: `bg-theme-panel/80` (#0F0F0F with 80% opacity)
- Border: `border-theme-border` (#323232)
- Title: `text-theme-primary` (#FFFFFF)
- Meta: `text-theme-secondary` (#C8C8C8)
- Hover Border: `hover:border-theme-border/60`

**Light Mode:**
- Background: `bg-theme-panel/80` (#F8F8F8 with 80% opacity)
- Border: `border-theme-border` (#DCDCDC)
- Title: `text-theme-primary` (#000000)
- Meta: `text-theme-secondary` (#3C3C3C)
- Hover Border: `hover:border-theme-border/60`

**Usage:**
```html
<article class="bg-theme-panel/80 border border-theme-border">
  <h2 class="text-theme-primary">Title</h2>
  <p class="text-theme-secondary">Meta info</p>
</article>
```

---

### 5. Buttons - Primary
**Purpose:** Main call-to-action buttons

**Dark Mode:**
- Background: `bg-theme-accent` (#EF4444)
- Text: `text-white` (#FFFFFF)
- Hover: `hover:bg-theme-accent-hover` (#F87171)

**Light Mode:**
- Background: `bg-theme-accent` (#EF4444)
- Text: `text-white` (#FFFFFF)
- Hover: `hover:bg-theme-accent-hover` (#DC2626)

**Usage:**
```html
<button class="bg-theme-accent text-white hover:bg-theme-accent-hover">
  Action
</button>
```

---

### 6. Buttons - Secondary
**Purpose:** Less prominent actions

**Dark Mode:**
- Background: `bg-theme-card` (#191919)
- Border: `border-theme-border` (#323232)
- Text: `text-theme-secondary` (#C8C8C8)
- Hover Text: `hover:text-theme-primary` (#FFFFFF)
- Hover Background: `hover:bg-theme-panel` (#0F0F0F)

**Light Mode:**
- Background: `bg-theme-card` (#F0F0F0)
- Border: `border-theme-border` (#DCDCDC)
- Text: `text-theme-secondary` (#3C3C3C)
- Hover Text: `hover:text-theme-primary` (#000000)
- Hover Background: `hover:bg-theme-panel` (#F8F8F8)

**Usage:**
```html
<button class="bg-theme-card border border-theme-border text-theme-secondary hover:bg-theme-panel hover:text-theme-primary">
  Secondary Action
</button>
```

---

### 7. Input Fields
**Purpose:** Search bars, text inputs

**Dark Mode:**
- Background: `bg-theme-card` (#191919)
- Border: `border-theme-border` (#323232)
- Text: `text-theme-primary` (#FFFFFF)
- Placeholder: `placeholder:text-theme-muted` (#969696)
- Focus Border: `focus:border-theme-accent` (#EF4444)

**Light Mode:**
- Background: `bg-theme-card` (#F3F4F6)
- Border: `border-theme-border` (#D1D5DB)
- Text: `text-theme-primary` (#111827)
- Placeholder: `placeholder:text-theme-muted` (#6B7280)
- Focus Border: `focus:border-theme-accent` (#EF4444)

**Usage:**
```html
<input class="bg-theme-card border border-theme-border text-theme-primary placeholder:text-theme-muted focus:border-theme-accent">
```

---

### 8. Icon Buttons
**Purpose:** Small action buttons with icons

**Dark Mode:**
- Background: `bg-theme-card` (#191919)
- Border: `border-theme-border` (#323232)
- Icon: `text-theme-secondary` (#C8C8C8)
- Hover Icon: `hover:text-theme-primary` (#FFFFFF)
- Hover Background: `hover:bg-theme-panel` (#0F0F0F)

**Light Mode:**
- Background: `bg-theme-card` (#F0F0F0)
- Border: `border-theme-border` (#DCDCDC)
- Icon: `text-theme-secondary` (#3C3C3C)
- Hover Icon: `hover:text-theme-primary` (#000000)
- Hover Background: `hover:bg-theme-panel` (#F8F8F8)

**Usage:**
```html
<button class="bg-theme-card border border-theme-border text-theme-secondary hover:bg-theme-panel hover:text-theme-primary">
  <i data-lucide="bell"></i>
</button>
```

---

### 9. Tag Pills / Badges
**Purpose:** Hashtags, category labels

**Dark Mode:**
- Background: `bg-theme-card` (#191919)
- Text: `text-theme-muted` (#969696)

**Light Mode:**
- Background: `bg-theme-card` (#F0F0F0)
- Text: `text-theme-muted` (#787878)

**Usage:**
```html
<span class="bg-theme-card text-theme-muted px-2 py-0.5 rounded-md text-xs">
  #tag
</span>
```

---

### 10. Dropdown Menus
**Purpose:** User menu, context menus

**Dark Mode:**
- Background: `bg-theme-panel` (#0F0F0F)
- Border: `border-theme-border` (#323232)
- Text: `text-theme-secondary` (#C8C8C8)
- Hover Background: `hover:bg-white/5`
- Hover Text: `hover:text-theme-primary` (#FFFFFF)

**Light Mode:**
- Background: `bg-theme-panel` (#F8F8F8)
- Border: `border-theme-border` (#DCDCDC)
- Text: `text-theme-secondary` (#3C3C3C)
- Hover Background: `hover:bg-black/5`
- Hover Text: `hover:text-theme-primary` (#000000)

**Usage:**
```html
<div class="bg-theme-panel border border-theme-border">
  <a class="text-theme-secondary hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/5 hover:text-theme-primary">
    Menu Item
  </a>
</div>
```

---

### 11. Modal / Dialog
**Purpose:** Post detail modal, dialogs

**Dark Mode:**
- Background: `bg-theme-surface/98` (#000000 with 98% opacity)
- Border: `border-theme-border` (#323232)
- Overlay: `bg-black/80`

**Light Mode:**
- Background: `bg-theme-surface/98` (#FFFFFF with 98% opacity)
- Border: `border-theme-border` (#DCDCDC)
- Overlay: `bg-black/50`

**Usage:**
```html
<div class="fixed inset-0 bg-black/80 dark:bg-black/80 light:bg-black/50">
  <div class="bg-theme-surface/98 border border-theme-border">
    Modal content
  </div>
</div>
```

---

### 12. Dividers / Borders
**Purpose:** Separators between sections

**Dark Mode:**
- Border: `border-theme-border` (#323232)

**Light Mode:**
- Border: `border-theme-border` (#DCDCDC)

**Usage:**
```html
<div class="border-t border-theme-border"></div>
```

---

### 13. Links
**Purpose:** Text links

**Dark Mode:**
- Default: `text-theme-accent` (#EF4444)
- Hover: `hover:text-theme-accent-hover` (#F87171)

**Light Mode:**
- Default: `text-theme-accent` (#EF4444)
- Hover: `hover:text-theme-accent-hover` (#DC2626)

**Usage:**
```html
<a class="text-theme-accent hover:text-theme-accent-hover">
  Link text
</a>
```

---

### 14. Interaction Buttons (Upvote, Bookmark, Share)
**Purpose:** Post interaction buttons

**Dark Mode:**
- Default Icon: `text-theme-secondary` (#C8C8C8)
- Hover Upvote: `hover:text-theme-accent` (#EF4444)
- Hover Bookmark: `hover:text-amber-300`
- Hover Share: `hover:text-theme-primary` (#FFFFFF)

**Light Mode:**
- Default Icon: `text-theme-secondary` (#374151)
- Hover Upvote: `hover:text-theme-accent` (#EF4444)
- Hover Bookmark: `hover:text-amber-500`
- Hover Share: `hover:text-theme-primary` (#111827)

**Usage:**
```html
<button class="text-theme-secondary hover:text-theme-accent">
  <i data-lucide="arrow-big-up"></i>
</button>
<button class="text-theme-secondary hover:text-amber-300 dark:hover:text-amber-300 light:hover:text-amber-500">
  <i data-lucide="bookmark"></i>
</button>
```

---

### 15. Footer Text
**Purpose:** Copyright, footer links

**Dark Mode:**
- Text: `text-theme-muted` (#969696)
- Link Hover: `hover:text-theme-secondary` (#C8C8C8)

**Light Mode:**
- Text: `text-theme-muted` (#787878)
- Link Hover: `hover:text-theme-secondary` (#3C3C3C)

**Usage:**
```html
<footer>
  <p class="text-theme-muted">© 2025 GearVN</p>
  <a class="text-theme-muted hover:text-theme-secondary">Link</a>
</footer>
```

---

## Special Components

### Theme Toggle Button
**Purpose:** Switch between dark and light modes

```html
<button id="theme-toggle"
  class="bg-theme-card border border-theme-border text-theme-secondary hover:bg-theme-panel hover:text-theme-primary">
  <i data-lucide="sun" class="hidden dark:block"></i>
  <i data-lucide="moon" class="block dark:hidden"></i>
</button>
```

### Status Badges (Success, Error, Warning)
**Success (Green):**
- Dark: `bg-emerald-500/10 border-emerald-500/40 text-emerald-200`
- Light: `bg-emerald-50 border-emerald-300 text-emerald-700`

**Error (Red):**
- Dark: `bg-red-500/10 border-red-500/40 text-red-300`
- Light: `bg-red-50 border-red-300 text-red-700`

**Warning (Amber):**
- Dark: `bg-amber-500/10 border-amber-500/40 text-amber-200`
- Light: `bg-amber-50 border-amber-300 text-amber-700`

---

## Accessibility Guidelines

1. **Contrast Ratios:**
   - Normal text: Minimum 4.5:1 (WCAG AA)
   - Large text: Minimum 3:1 (WCAG AA)
   - All color combinations meet WCAG AA standards

2. **Focus States:**
   - Always include visible focus indicators
   - Use `focus:ring-2 focus:ring-theme-accent`

3. **Interactive Elements:**
   - Minimum touch target size: 44x44px
   - Clear hover/active states
   - Sufficient color contrast for icons

4. **Dark Mode Considerations:**
   - Pure black (#000) reduces eye strain in low light
   - Higher contrast text improves readability
   - Subtle borders (#323232) define boundaries

5. **Light Mode Considerations:**
   - Pure white (#FFF) for clean, professional look
   - Darker text (#000) ensures maximum readability
   - Light gray backgrounds reduce glare

---

## Implementation Checklist

- [ ] All components use theme-aware classes
- [ ] Theme toggle button visible and functional
- [ ] Dark mode defaults on page load
- [ ] Light mode readable and high contrast
- [ ] All interactive elements have hover states
- [ ] Focus states visible for keyboard navigation
- [ ] Modal overlays adapt to theme
- [ ] Icons maintain proper contrast
- [ ] Links distinguishable from body text
- [ ] Form inputs clearly visible in both themes
