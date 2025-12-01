# GearVN Creator Hub - Kế Hoạch Phát Triển

## Mục Tiêu

Chuyển từ mô hình **"Auto Fetch"** sang **"Community-Driven"** (giống daily.dev), cho phép cộng đồng tự PR content của họ, đồng thời vẫn giữ nguyên hệ thống fetch tự động hiện tại.

---

## 1. Tổng Luồng Hệ Thống

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CONTENT SOURCES                                   │
├─────────────────────────────────┬───────────────────────────────────────────┤
│                                 │                                           │
│   🤖 AUTO FETCH (giữ nguyên)    │   👥 COMMUNITY SUBMIT (mới)              │
│   ─────────────────────────     │   ──────────────────────────              │
│                                 │                                           │
│   RSS Feeds:                    │   Yêu cầu: Phải đăng nhập                │
│   • Tom's Hardware              │                                           │
│   • TechPowerUp                 │   Flow:                                   │
│   • Engadget                    │   • User login                            │
│   • TrendForce (scrape)         │   • Paste URL                             │
│                                 │   • Auto-fetch metadata                   │
│   YouTube:                      │   • Chọn tags                             │
│   • GEARVN Shorts               │   • Submit                                │
│   • Tài Xài Tech Shorts         │   • → Pending hoặc Auto-approve           │
│                                 │                                           │
│   source = 'auto'               │   source = 'community'                    │
│   status = 'draft'              │   status = 'pending' | 'approved'         │
│                                 │                                           │
└────────────────┬────────────────┴───────────────────┬───────────────────────┘
                 │                                    │
                 ▼                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              MODERATION                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   AUTO FETCH                        COMMUNITY SUBMIT                        │
│   ──────────                        ────────────────                        │
│   draft → n8n dịch + gán tags       pending ──┬── auto-approve ──→ approved │
│        → status = 'public'                    │   (verified/trusted user)   │
│                                               │                             │
│                                               └── cần duyệt ──→ Admin CMS   │
│                                                   (new user)          │     │
│                                                                       ▼     │
│                                                            approved/rejected│
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           POSTS DATABASE                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Hiển thị: status IN ('public', 'approved')                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Tabs:  News | Review | Today | Creators | Community (mới)                │
│                                                                             │
│   Engagement: Vote | Bookmark | Comment | Share                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Database Schema

### 2.1. Bổ sung bảng `posts` (đã có)

```sql
ALTER TABLE posts ADD COLUMN
  -- Phân biệt nguồn content
  source          VARCHAR(20) DEFAULT 'auto',    -- 'auto' | 'community'
  platform        VARCHAR(20),                    -- 'rss' | 'youtube' | 'tiktok' | 'blog' | 'twitter'
  
  -- Community submission
  submitted_by    UUID REFERENCES profiles(id),   -- User submit (bắt buộc login)
  
  -- Moderation
  auto_approved   BOOLEAN DEFAULT false,
  reviewed_by     UUID REFERENCES profiles(id),
  reviewed_at     TIMESTAMPTZ,
  rejection_reason TEXT,
  
  -- Engagement metrics
  upvotes         INT DEFAULT 0,
  downvotes       INT DEFAULT 0,
  vote_score      INT GENERATED ALWAYS AS (upvotes - downvotes) STORED,
  hot_score       FLOAT DEFAULT 0,
  comment_count   INT DEFAULT 0,
  view_count      INT DEFAULT 0,
  bookmark_count  INT DEFAULT 0;
```

**Status values:**

| Status | Nguồn | Mô tả |
|--------|-------|-------|
| `draft` | Auto fetch | Mới fetch, chờ n8n dịch |
| `public` | Auto fetch | Đã dịch, hiển thị |
| `pending` | Community | Chờ admin duyệt |
| `approved` | Community | Đã duyệt, hiển thị |
| `rejected` | Community | Bị từ chối |

**Query hiển thị:** `WHERE status IN ('public', 'approved')`

---

### 2.2. Bảng mới: `profiles`

```sql
CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username        VARCHAR(50) UNIQUE NOT NULL,
  display_name    VARCHAR(100),
  avatar_url      TEXT,
  bio             TEXT,
  
  -- Social links
  website_url     TEXT,
  youtube_url     TEXT,
  tiktok_url      TEXT,
  facebook_url    TEXT,
  
  -- Stats & Role
  reputation      INT DEFAULT 0,
  is_verified     BOOLEAN DEFAULT false,
  role            VARCHAR(20) DEFAULT 'user',  -- 'user' | 'creator' | 'moderator' | 'admin'
  
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger: Auto-create profile khi user đăng ký
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

### 2.3. Bảng mới: `votes`

```sql
CREATE TABLE votes (
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  post_id     UUID REFERENCES posts(id) ON DELETE CASCADE,
  value       SMALLINT CHECK (value IN (-1, 1)),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

-- Trigger: Cập nhật upvotes/downvotes
CREATE OR REPLACE FUNCTION update_post_votes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.value = 1 THEN
      UPDATE posts SET upvotes = upvotes + 1 WHERE id = NEW.post_id;
    ELSE
      UPDATE posts SET downvotes = downvotes + 1 WHERE id = NEW.post_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.value = 1 THEN
      UPDATE posts SET upvotes = upvotes - 1 WHERE id = OLD.post_id;
    ELSE
      UPDATE posts SET downvotes = downvotes - 1 WHERE id = OLD.post_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.value = 1 AND NEW.value = -1 THEN
      UPDATE posts SET upvotes = upvotes - 1, downvotes = downvotes + 1 WHERE id = NEW.post_id;
    ELSIF OLD.value = -1 AND NEW.value = 1 THEN
      UPDATE posts SET upvotes = upvotes + 1, downvotes = downvotes - 1 WHERE id = NEW.post_id;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_vote_change
  AFTER INSERT OR UPDATE OR DELETE ON votes
  FOR EACH ROW EXECUTE FUNCTION update_post_votes();
```

---

### 2.4. Bảng mới: `bookmarks`

```sql
CREATE TABLE bookmarks (
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  post_id     UUID REFERENCES posts(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

-- Trigger: Cập nhật bookmark_count
CREATE OR REPLACE FUNCTION update_bookmark_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET bookmark_count = bookmark_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET bookmark_count = bookmark_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_bookmark_change
  AFTER INSERT OR DELETE ON bookmarks
  FOR EACH ROW EXECUTE FUNCTION update_bookmark_count();
```

---

### 2.5. Bảng mới: `comments`

```sql
CREATE TABLE comments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id     UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id   UUID REFERENCES comments(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  upvotes     INT DEFAULT 0,
  is_edited   BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  edited_at   TIMESTAMPTZ
);

-- Trigger: Cập nhật comment_count
CREATE OR REPLACE FUNCTION update_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comment_count = comment_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_comment_change
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_comment_count();
```

---

### 2.6. Bảng mới: `user_follows` & `tag_follows`

```sql
CREATE TABLE user_follows (
  follower_id   UUID REFERENCES profiles(id) ON DELETE CASCADE,
  following_id  UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id)
);

CREATE TABLE tag_follows (
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  tag_id      UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, tag_id)
);
```

---

### 2.7. Bảng mới: `reports`

```sql
CREATE TABLE reports (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id     UUID REFERENCES posts(id) ON DELETE CASCADE,
  reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reason      VARCHAR(50) NOT NULL,
  details     TEXT,
  status      VARCHAR(20) DEFAULT 'pending',
  resolved_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 2.8. Bảng mới: `trusted_domains`

```sql
CREATE TABLE trusted_domains (
  domain        VARCHAR(255) PRIMARY KEY,
  auto_approve  BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO trusted_domains (domain) VALUES
  ('youtube.com'),
  ('youtu.be'),
  ('tiktok.com'),
  ('facebook.com'),
  ('twitter.com'),
  ('x.com');
```

---

## 3. API Functions (supabase.js)

### 3.1. Auth

```javascript
api.auth = {
  signUp(email, password, metadata)
  signIn(email, password)
  signInWithGoogle()
  signInWithFacebook()
  signOut()
  getUser()
  getSession()
  onAuthStateChange(callback)
  resetPassword(email)
  updatePassword(newPassword)
}
```

### 3.2. Profiles

```javascript
api.profiles = {
  get(userId)
  getByUsername(username)
  getMe()
  update(data)
  getStats(userId)
}
```

### 3.3. Submissions

```javascript
api.submissions = {
  create(data)              // { url, tags }
  getMySubmissions(status?)
  update(id, data)
  delete(id)
}
```

### 3.4. Votes

```javascript
api.votes = {
  vote(postId, value)
  removeVote(postId)
  getMyVote(postId)
  getMyVotes(postIds)
}
```

### 3.5. Bookmarks

```javascript
api.bookmarks = {
  add(postId)
  remove(postId)
  toggle(postId)
  getMyBookmarks(page, limit)
  isBookmarked(postId)
  getMyBookmarkStatus(postIds)
}
```

### 3.6. Comments

```javascript
api.comments = {
  getByPost(postId, { sort })
  create(postId, content, parentId?)
  update(commentId, content)
  delete(commentId)
  vote(commentId, value)
}
```

### 3.7. Follows

```javascript
api.follows = {
  followUser(userId)
  unfollowUser(userId)
  followTag(tagId)
  unfollowTag(tagId)
  getFollowers(userId)
  getFollowing(userId)
  getMyFollowedTags()
  isFollowing(userId)
  isFollowingTag(tagId)
}
```

### 3.8. Feed

```javascript
api.feed = {
  getHot(options)
  getNew(options)
  getBest(options)
  getPersonalized(options)
}
```

### 3.9. Admin

```javascript
api.admin = {
  getStats()
  getPendingSubmissions(page, limit)
  approvePost(postId)
  rejectPost(postId, reason)
  bulkApprove(postIds)
  bulkReject(postIds, reason)
  getReports(status?)
  resolveReport(reportId, action)
  getUsers(page, limit, filters?)
  verifyCreator(userId)
  updateUserRole(userId, role)
  banUser(userId, reason)
}
```

---

## 4. Routes

### Public

| Route | Mô tả |
|-------|-------|
| `/` | Home (Hot feed) |
| `/hot` | Trending |
| `/new` | Latest |
| `/best` | Top all-time |
| `/tag/:slug` | Posts theo tag |
| `/creator/:slug` | Trang creator |
| `/post/:id` | Chi tiết post |
| `/u/:username` | Profile user |

### Auth

| Route | Mô tả |
|-------|-------|
| `/login` | Đăng nhập |
| `/register` | Đăng ký |
| `/forgot-password` | Quên mật khẩu |

### Protected (cần login)

| Route | Mô tả |
|-------|-------|
| `/submit` | Form submit |
| `/bookmarks` | Bookmarks của tôi |
| `/settings` | Cài đặt |
| `/dashboard` | Submissions của tôi |

### Admin (role='admin')

| Route | Mô tả |
|-------|-------|
| `/admin` | Dashboard |
| `/admin/pending` | Duyệt bài |
| `/admin/reports` | Reports |
| `/admin/users` | Quản lý users |

---

## 5. Components

```
components/
├── auth/
│   ├── LoginForm.jsx
│   ├── RegisterForm.jsx
│   ├── SocialLoginButtons.jsx
│   └── AuthGuard.jsx
│
├── submit/
│   ├── SubmitForm.jsx
│   ├── UrlPreview.jsx
│   └── TagSelector.jsx
│
├── engagement/
│   ├── VoteButtons.jsx
│   ├── BookmarkButton.jsx
│   ├── CommentSection.jsx
│   └── CommentItem.jsx
│
├── user/
│   ├── UserAvatar.jsx
│   ├── UserProfile.jsx
│   └── FollowButton.jsx
│
└── admin/
    ├── AdminLayout.jsx
    ├── PendingList.jsx
    ├── StatsCards.jsx
    └── RejectModal.jsx
```

---

## 6. Auto-Moderation

```javascript
async function processSubmission(submission, user) {
  const domain = new URL(submission.url).hostname.replace('www.', '');
  
  // 1. Check duplicate
  if (await checkDuplicate(submission.url)) {
    return { status: 'rejected', reason: 'duplicate' };
  }
  
  // 2. Auto-approve nếu:
  //    - Verified creator
  //    - Reputation >= 100
  //    - Trusted domain
  const shouldAutoApprove = 
    user.is_verified ||
    user.reputation >= 100 ||
    await isTrustedDomain(domain);
  
  if (shouldAutoApprove) {
    return { status: 'approved', auto_approved: true };
  }
  
  // 3. Mặc định: pending
  return { status: 'pending' };
}
```

---

## 7. Row Level Security (RLS)

```sql
-- Profiles
CREATE POLICY "Public profiles viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Votes
CREATE POLICY "Users can manage own votes"
  ON votes FOR ALL USING (auth.uid() = user_id);

-- Bookmarks
CREATE POLICY "Users can manage own bookmarks"
  ON bookmarks FOR ALL USING (auth.uid() = user_id);

-- Comments
CREATE POLICY "Comments viewable by everyone"
  ON comments FOR SELECT USING (true);

CREATE POLICY "Users can manage own comments"
  ON comments FOR ALL USING (auth.uid() = user_id);

-- Posts
CREATE POLICY "Published posts viewable"
  ON posts FOR SELECT USING (
    status IN ('public', 'approved')
    OR submitted_by = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can submit"
  ON posts FOR INSERT WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Users can update own pending"
  ON posts FOR UPDATE USING (submitted_by = auth.uid() AND status = 'pending');
```

---

## 8. Roadmap

| Phase | Tuần | Tasks |
|-------|------|-------|
| **1. Auth** | 1-2 | Supabase Auth, profiles, login/register, AuthContext |
| **2. Submit** | 3-4 | Alter posts, submit form, auto-moderation, user dashboard |
| **3. Admin** | 5 | Admin layout, pending queue, approve/reject |
| **4. Votes** | 6 | Votes table, VoteButtons, hot score, feed sorting |
| **5. Comments** | 7 | Comments table, CommentSection, nested replies |
| **6. Social** | 8-9 | Follows, user profile, personalized feed |
| **7. Reports** | 10 | Reports table, report button, admin queue |
| **8. Polish** | 11-12 | Performance, mobile, testing, launch |

---

## 9. Dependencies

```json
{
  "@supabase/auth-ui-react": "^0.4.x",
  "@supabase/auth-ui-shared": "^0.1.x",
  "react-router-dom": "^6.x"
}
```

---

**Cập nhật:** 01/12/2025
