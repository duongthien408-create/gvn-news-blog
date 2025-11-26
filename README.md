# GearVN News & Review

A simple news and review aggregation website for GearVN.

## Features

- **News**: Tech news fetched from RSS feeds (auto-translated via n8n)
- **Review**: Video reviews from YouTube creators
- **Today**: All content published today
- **Tags**: Filter by 13 fixed tags (GAME, AI, PC, RAM, SSD, CPU, VGA, MAINBOARD, LAPTOP, MONITOR, MOUSE, KEYBOARD, HEADSET)

## Tech Stack

- **Frontend**: React + Vite + TailwindCSS
- **Database**: Supabase (PostgreSQL)
- **Automation**: n8n (RSS fetch + translation)

## Project Structure

```
gvn-news-blog/
├── src/
│   ├── App.jsx          # Main React app (~470 lines)
│   ├── lib/supabase.js  # Supabase client & API
│   ├── main.jsx         # Entry point
│   └── index.css        # Tailwind + custom styles
├── database/
│   ├── schema.sql       # Database schema (4 tables)
│   └── README.md        # Database docs
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── postcss.config.js
```

## Database Schema (4 tables)

| Table | Purpose |
|-------|---------|
| `creators` | News sources / YouTube channels |
| `tags` | 13 fixed tags |
| `posts` | News & Reviews |
| `post_tags` | Many-to-many |

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Setup Supabase
- Create a Supabase project
- Run `database/schema.sql` in SQL Editor
- Copy your project URL and anon key to `.env.local`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Run development server
```bash
npm run dev
```

### 4. Build for production
```bash
npm run build
```

## Content Flow

```
RSS Feeds (News)          YouTube (Review)
       │                        │
       └────────┬───────────────┘
                ▼
              n8n
     1. Fetch content
     2. Create post (status='draft')
     3. Translate (for news)
     4. Update status='public'
                │
                ▼
           Supabase
                │
                ▼
        React Frontend
```

## License

Private - GearVN
