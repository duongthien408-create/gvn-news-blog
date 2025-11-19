# GearVN News Blog - Frontend Only

Blog về công nghệ, gaming gear và PC building với dữ liệu từ Supabase.

## 🚀 Tech Stack

- **Frontend**: React + Vite + TailwindCSS
- **Database**: Supabase (PostgreSQL)
- **UI Components**: Headless UI + Lucide Icons
- **Styling**: TailwindCSS

## 📦 Setup

### 1. Clone repository

```bash
git clone https://github.com/duongthien408-create/gvn-news-blog.git
cd gvn-news-blog
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create `.env.local` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Setup database

1. Create Supabase project
2. Run schema: [`database/02-new-complete-schema.sql`](database/02-new-complete-schema.sql)
3. (Optional) Run sample data: [`database/seed-sample-data.sql`](database/seed-sample-data.sql)

### 5. Start development server

```bash
npm run dev
```

Open http://localhost:5173

## 🗂️ Project Structure

```
gvn-news-blog/
├── src/
│   ├── components/      # React components
│   ├── lib/
│   │   └── supabase.js # Supabase client & API helpers
│   ├── App.jsx
│   └── main.jsx
├── database/
│   ├── 02-new-complete-schema.sql  # Database schema
│   └── seed-sample-data.sql        # Sample data
├── public/              # Static assets
└── index.html
```

## 📚 Database Schema

Database có 25+ tables bao gồm:

- **Core**: posts, users, creators, tags
- **Engagement**: comments, votes, bookmarks, follows
- **Products**: products, brands, categories
- **Gamification**: achievements, user_levels, streaks
- **Communities**: squads, squad_members

Xem chi tiết: [database/README-V2.md](database/README-V2.md)

## 🔧 Features

- ✅ Hiển thị danh sách bài viết
- ✅ Chi tiết bài viết với tags và products
- ✅ Danh sách creators
- ✅ Comments system
- ✅ Authentication (Supabase Auth)
- ✅ Bookmarks và votes
- ✅ Responsive design

## 📖 API Usage

Sử dụng Supabase client:

```javascript
import { api } from './lib/supabase'

// Get all posts
const posts = await api.getPosts()

// Get post by slug
const post = await api.getPostBySlug('post-slug')

// Get creators
const creators = await api.getCreators()

// Authentication
await api.signIn(email, password)
await api.signOut()
```

## 🔐 Supabase Configuration

### Enable Row Level Security (RLS)

Supabase tự động bật RLS cho tất cả tables. Cần tạo policies:

```sql
-- Allow public to read published posts
CREATE POLICY "Public can read published posts"
ON posts FOR SELECT
TO anon
USING (status = 'published');

-- Allow authenticated users to create comments
CREATE POLICY "Authenticated users can create comments"
ON comments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
```

### Setup Authentication

Supabase Auth đã được tích hợp sẵn. Cấu hình trong Supabase Dashboard:
- Authentication > Providers
- Enable Email provider
- Configure redirect URLs

## 📝 Documentation

- [DATABASE-SETUP-SUMMARY.md](DATABASE-SETUP-SUMMARY.md) - Database setup guide
- [database/README-V2.md](database/README-V2.md) - Schema documentation

## 🚧 Roadmap

- [ ] Admin CMS (build sau)
- [ ] Real-time updates với Supabase Realtime
- [ ] Image upload với Supabase Storage
- [ ] Full-text search
- [ ] SEO optimization
- [ ] PWA support

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push và create Pull Request

## 📄 License

MIT License

---

**Note**: Project này đã được đơn giản hóa bằng cách loại bỏ backend Go. Mọi API calls giờ được thực hiện trực tiếp từ frontend → Supabase.
