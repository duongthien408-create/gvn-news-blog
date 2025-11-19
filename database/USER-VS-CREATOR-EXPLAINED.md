# User vs Creator - Định nghĩa và phân biệt

## 🎯 Tổng quan

Trong hệ thống GearVN Blog, **User** và **Creator** là 2 entities KHÁC NHAU hoàn toàn:

```
User (users table)          Creator (creators table)
├─ Người dùng nền tảng      ├─ Nguồn nội dung bên ngoài
├─ Đăng ký tài khoản        ├─ YouTubers, Bloggers
├─ Comment, vote, bookmark  ├─ Được follow
└─ Role: user/admin         └─ Verified badge
```

## 👤 User - Người dùng nền tảng

### Định nghĩa:
**User** là người đăng ký tài khoản trên website để tương tác với nội dung.

### Đặc điểm:
- ✅ Có tài khoản (email/password)
- ✅ Có profile (display_name, avatar, bio)
- ✅ Có gamification (level, points, achievements, streak)
- ✅ Comment, vote, bookmark posts
- ✅ Join squads (communities)
- ✅ Follow creators

### Database:
```sql
-- Main table
users (id, email, password_hash, username, role, status)

-- Related tables
user_profiles (display_name, avatar_url, bio, website)
user_levels (level, total_points)
user_preferences (theme, language, notifications)
streaks (current_streak, longest_streak)
```

### Roles:
- **user** - Người dùng thường
- **moderator** - Moderator của nền tảng
- **admin** - Admin của nền tảng

### Ví dụ Users:
1. **Admin GearVN** - Administrator của blog
2. **Tech Guru** - User bình thường, thích công nghệ
3. **Gamer Pro** - User chuyên về gaming gear
4. **PC Builder** - User thích build PC
5. **Hardware Fan** - User yêu thích hardware

## 🎬 Creator - Nguồn nội dung

### Định nghĩa:
**Creator** là các YouTuber, Blogger, Tech Reviewer nổi tiếng bên ngoài mà website **aggregate nội dung** từ họ.

### Đặc điểm:
- ❌ KHÔNG có tài khoản trên website
- ❌ KHÔNG thể login
- ✅ Là "entity" để gắn tag với posts
- ✅ Users có thể follow họ
- ✅ Có social links (YouTube, Twitter, Facebook)
- ✅ Có verified badge
- ✅ Posts được attribute về họ

### Database:
```sql
-- Main table
creators (id, name, slug, bio, avatar_url, verified, website, total_followers)

-- Related tables
creator_socials (platform, url, follower_count)
follows (user follow creator)
post_creators (post được tạo bởi creator nào)
```

### Ví dụ Creators:
1. **Scrapshut** - Kênh YouTube review công nghệ VN (150K subs)
2. **Linus Tech Tips** - Tech reviewer nổi tiếng (15M subs)
3. **Gamers Nexus** - Hardware analysis (2M subs)
4. **JayzTwoCents** - PC building expert (3.5M subs)
5. **Hardware Unboxed** - GPU/CPU reviews (1.8M subs)

## 🔀 So sánh trực tiếp

| Feature | User | Creator |
|---------|------|---------|
| **Có tài khoản** | ✅ Có (email/password) | ❌ Không |
| **Login được** | ✅ Login để interact | ❌ Không login |
| **Tạo nội dung** | ❌ Không tạo posts | ✅ Posts attribute về họ |
| **Comment** | ✅ Comment trên posts | ❌ Không |
| **Vote/Bookmark** | ✅ Vote & bookmark | ❌ Không |
| **Được follow** | ❌ Không | ✅ Users follow creators |
| **Gamification** | ✅ Level, points, achievements | ❌ Không |
| **Social links** | ❌ Không | ✅ YouTube, Twitter, etc |
| **Verified badge** | ❌ Không | ✅ Có (nếu nổi tiếng) |
| **Profile** | ✅ user_profiles table | ✅ Trong creators table |

## 🎯 Use Cases

### User Use Cases:
```javascript
// User đăng ký
await api.signUp('user@example.com', 'password', 'username')

// User login
const { user, token } = await api.signIn('user@example.com', 'password')

// User comment
await api.createComment(postId, 'Great review!')

// User vote post
await api.votePost(postId, 1) // upvote

// User bookmark post
await api.bookmarkPost(postId)

// User follow creator
await api.followCreator(creatorId)
```

### Creator Use Cases:
```javascript
// Lấy danh sách creators
const creators = await api.getCreators()

// Xem profile creator
const creator = await api.getCreatorBySlug('scrapshut')

// Get posts của creator
const posts = await api.getPostsByCreator(creatorId)

// Check user có follow creator không
const isFollowing = await api.isFollowingCreator(userId, creatorId)

// Get follower count
const followers = creator.total_followers
```

## 💡 Tại sao tách riêng?

### 1. Khác nhau về bản chất
- **User**: Thành viên của nền tảng, tương tác nội dung
- **Creator**: Nguồn nội dung từ bên ngoài (YouTube, blog)

### 2. Khác nhau về quyền
- **User**: Login, comment, vote, tạo profile
- **Creator**: Chỉ là "tag" gắn với posts, không login

### 3. Khác nhau về data structure
- **User**: Cần authentication, preferences, gamification
- **Creator**: Cần social links, verification, follower count

### 4. Khác nhau về flow
```
User Flow:
Register → Login → Interact (comment, vote) → Earn points → Level up

Creator Flow:
Website scrapes content → Attribute to creator → User follow creator → Show creator posts
```

## 🔄 Relationships

### Posts & Creators:
```sql
-- Post thuộc về creator nào
post_creators (
  post_id → posts
  creator_id → creators
)

-- Ví dụ:
Post "RTX 4090 Review" → Created by "Linus Tech Tips"
Post "PC Build Guide" → Created by "JayzTwoCents"
```

### Users & Creators:
```sql
-- User follow creator
follows (
  follower_id → users
  creator_id → creators
)

-- Ví dụ:
User "Tech Guru" follows Creator "Scrapshut"
User "Gamer Pro" follows Creator "Linus Tech Tips"
```

### Posts & Users:
```sql
-- User comment trên post
comments (
  post_id → posts
  user_id → users
  content TEXT
)

-- User vote post
votes (
  post_id → posts
  user_id → users
  vote_type INT
)

-- User bookmark post
bookmarks (
  post_id → posts
  user_id → users
)
```

## 📊 Data Flow Example

### Content Aggregation Flow:
```
1. Scrapshut (Creator) đăng video "RTX 4090 Review" lên YouTube
   ↓
2. Website scrape/import video này
   ↓
3. Tạo Post với post_creators link tới Scrapshut
   ↓
4. Tech Guru (User) xem post này
   ↓
5. Tech Guru vote, comment, bookmark
   ↓
6. Tech Guru follow Scrapshut để nhận updates
```

## ❓ FAQ

### Q: User có thể trở thành Creator không?
**A:** Về mặt kỹ thuật: KHÔNG. Đây là 2 entities khác nhau.
- Nếu muốn User tạo content → Cần thêm role `creator` cho User
- Hoặc tạo 1 Creator record riêng link tới User (dual identity)

### Q: Creator có thể có tài khoản User không?
**A:** Có thể! Ví dụ:
```sql
-- Scrapshut (Creator) có thể đăng ký User account để interact
User: email="scrapshut@youtube.com", role="user"
Creator: name="Scrapshut", slug="scrapshut"

-- Link giữa User và Creator (optional)
creators.user_id = users.id
```

### Q: Posts được tạo bởi ai?
**A:** Posts được:
- **Aggregated/Scraped** từ creators (YouTube, blogs)
- Hoặc **manually created** bởi admin users
```sql
posts (
  author_id → users (nullable) -- Nếu admin tạo
)
post_creators (
  creator_id → creators -- Attribution
)
```

### Q: Tại sao cần `follows` table?
**A:** Users follow Creators để:
- Nhận thông báo khi creator có post mới
- Personalized feed (show posts from followed creators)
- Community features (show popular creators)

## 🎨 UI/UX Implications

### Hiển thị Creator:
```jsx
// Post card
<PostCard>
  <Creator>
    <Avatar src={creator.avatar_url} />
    <Name>{creator.name}</Name>
    {creator.verified && <VerifiedBadge />}
  </Creator>
  <Title>{post.title}</Title>
  <Tags>{post.tags}</Tags>
</PostCard>
```

### Hiển thị User:
```jsx
// Comment
<Comment>
  <Avatar src={user.profile.avatar_url} />
  <Name>{user.profile.display_name}</Name>
  <Level>Lv {user.level.level}</Level>
  <Content>{comment.content}</Content>
</Comment>
```

## 📝 Summary

```
┌─────────────────────────────────────────┐
│           GearVN Blog System            │
├─────────────────────────────────────────┤
│                                         │
│  Users (Người dùng)                     │
│  ├─ Register/Login                      │
│  ├─ Comment, Vote, Bookmark             │
│  ├─ Follow Creators                     │
│  └─ Earn Points & Level Up              │
│                                         │
│  Creators (Nguồn content)               │
│  ├─ YouTubers, Bloggers                 │
│  ├─ Posts attribute về họ               │
│  ├─ Được users follow                   │
│  └─ Không login, chỉ là "tag"          │
│                                         │
│  Posts (Nội dung)                       │
│  ├─ Từ Creators (scraped)               │
│  ├─ Hoặc từ Admin (manual)              │
│  ├─ Users interact với posts            │
│  └─ Link với Creator qua post_creators  │
│                                         │
└─────────────────────────────────────────┘
```

---

**Kết luận**: User và Creator là 2 concepts hoàn toàn khác nhau. User = người dùng platform, Creator = nguồn content được aggregate.
