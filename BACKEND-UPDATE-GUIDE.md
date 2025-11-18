# 🔧 Backend Update Guide - Database v2.0

## ✅ Đã hoàn thành 100%

### 1. Models (100%)
- ✅ `backend/models.go` - Tất cả 25+ struct types
- ✅ Helper functions cho SQL null handling

### 2. Handlers (100%)
- ✅ `backend/handlers_posts.go` - Posts CRUD + Voting + Bookmarks
- ✅ `backend/handlers_creators.go` - Creators + Follow system
- ✅ `backend/handlers_tags.go` - Tags
- ✅ `backend/handlers_comments.go` - Comments + Voting
- ✅ `backend/handlers_products.go` - Products + Brands
- ✅ `backend/handlers_squads.go` - Communities
- ✅ `backend/handlers_gamification.go` - Levels + Achievements

### 3. Auth & Routes (100%)
- ✅ `backend/auth.go` - Updated với UUID support
- ✅ `backend/main.go` - All routes configured

### 4. Build Status
- ✅ Backend compiles successfully
- ✅ All dependencies resolved

---

## 🚀 How to Run Backend

### 1. Setup Environment Variables
Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL=your_supabase_connection_string
JWT_SECRET=your-secret-key-change-in-production
PORT=8080
ALLOWED_ORIGINS=*
```

### 2. Run the Server
```bash
cd backend
go run .
```

### 3. Test API Endpoints
```bash
# Health check
curl http://localhost:8080/

# Get posts
curl http://localhost:8080/api/posts

# Get creators
curl http://localhost:8080/api/creators

# Register new user
curl -X POST http://localhost:8080/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","username":"testuser"}'
```

---

## 📝 OLD HANDLERS (Archived)

### File 1: `backend/handlers_tags.go`

```go
package main

import "github.com/gofiber/fiber/v2"

// GET /api/tags
func getTags(c *fiber.Ctx) error {
	rows, err := db.Query(`
		SELECT id, name, slug, description, icon_name, post_count
		FROM tags
		ORDER BY post_count DESC
		LIMIT 50
	`)
	// ... implement
}

// GET /api/tags/:slug
func getTagBySlug(c *fiber.Ctx) error {
	// Get tag + posts with that tag
}

// POST /api/tags/:id/follow
func followTag(c *fiber.Ctx) error {
	// Allow users to follow tags (optional feature)
}
```

### File 2: `backend/handlers_comments.go`

```go
package main

import "github.com/gofiber/fiber/v2"

// GET /api/posts/:id/comments
func getComments(c *fiber.Ctx) error {
	postID := c.Params("id")

	query := `
		SELECT
			cm.id, cm.post_id, cm.user_id, cm.parent_id, cm.content,
			cm.upvote_count, cm.downvote_count, cm.status,
			cm.created_at, cm.updated_at,
			-- Get user info
			u.username,
			up.display_name, up.avatar_url
		FROM comments cm
		JOIN users u ON cm.user_id = u.id
		LEFT JOIN user_profiles up ON u.id = up.user_id
		WHERE cm.post_id = $1 AND cm.status = 'active'
		ORDER BY cm.created_at ASC
	`
	// ... implement with nested replies
}

// POST /api/posts/:id/comments
func createComment(c *fiber.Ctx) error {
	// Insert comment + update post.comment_count via trigger
}

// POST /api/comments/:id/vote
func voteComment(c *fiber.Ctx) error {
	// Similar to post voting
	// vote_type: 1 or -1
}

// DELETE /api/comments/:id
func deleteComment(c *fiber.Ctx) error {
	// Soft delete: set status = 'deleted'
}
```

### File 3: `backend/handlers_products.go`

```go
package main

import "github.com/gofiber/fiber/v2"

// GET /api/products
func getProducts(c *fiber.Ctx) error {
	category := c.Query("category", "")
	brand := c.Query("brand", "")

	query := `
		SELECT
			p.id, p.name, p.slug, p.sku, p.price,
			p.image_url, p.gearvn_url, p.status,
			-- Get category
			pc.name as category_name, pc.slug as category_slug,
			-- Get brand
			b.name as brand_name, b.slug as brand_slug, b.logo_url
		FROM products p
		LEFT JOIN product_categories pc ON p.category_id = pc.id
		LEFT JOIN brands b ON p.brand_id = b.id
		WHERE p.status = 'available'
	`
	// Add filters...
}

// GET /api/products/:slug
func getProductBySlug(c *fiber.Ctx) error {
	// Get product + posts mentioning this product
}

// GET /api/brands
func getBrands(c *fiber.Ctx) error {
	// List all brands
}

// GET /api/product-categories
func getProductCategories(c *fiber.Ctx) error {
	// List categories (with parent-child relationship)
}
```

### File 4: `backend/handlers_squads.go`

```go
package main

import "github.com/gofiber/fiber/v2"

// GET /api/squads
func getSquads(c *fiber.Ctx) error {
	typeFilter := c.Query("type", "") // public/private

	query := `
		SELECT
			s.id, s.name, s.slug, s.description,
			s.avatar_url, s.cover_url, s.type,
			s.member_count, s.post_count,
			s.created_at,
			-- Get creator info
			u.username, up.display_name, up.avatar_url as creator_avatar
		FROM squads s
		JOIN users u ON s.creator_id = u.id
		LEFT JOIN user_profiles up ON u.id = up.user_id
	`
	// Filter by type if needed
}

// GET /api/squads/:slug
func getSquadBySlug(c *fiber.Ctx) error {
	// Get squad + members + recent posts
}

// POST /api/squads
func createSquad(c *fiber.Ctx) error {
	// Create squad + auto-add creator as admin
}

// POST /api/squads/:id/join
func joinSquad(c *fiber.Ctx) error {
	// Add user to squad_members
}

// POST /api/squads/:id/leave
func leaveSquad(c *fiber.Ctx) error {
	// Remove from squad_members
}

// GET /api/squads/:id/members
func getSquadMembers(c *fiber.Ctx) error {
	// List members with roles
}

// POST /api/squads/:id/posts
func sharePostToSquad(c *fiber.Ctx) error {
	// Add post to squad_posts
}
```

### File 5: `backend/handlers_gamification.go`

```go
package main

import "github.com/gofiber/fiber/v2"

// GET /api/users/:id/level
func getUserLevel(c *fiber.Ctx) error {
	userID := c.Params("id")

	var level UserLevel
	err := db.QueryRow(`
		SELECT user_id, level, total_points, updated_at
		FROM user_levels
		WHERE user_id = $1
	`, userID).Scan(&level.UserID, &level.Level, &level.TotalPoints, &level.UpdatedAt)

	return c.JSON(level)
}

// GET /api/users/:id/streak
func getUserStreak(c *fiber.Ctx) error {
	// Get current streak + longest streak
}

// GET /api/achievements
func getAchievements(c *fiber.Ctx) error {
	// List all available achievements
}

// GET /api/users/:id/achievements
func getUserAchievements(c *fiber.Ctx) error {
	// Get user's earned achievements
}

// POST /api/users/:id/points
func addUserPoints(c *fiber.Ctx) error {
	// Add points for actions (called internally)
	// Actions: post_created, upvote_received, comment_posted, etc.
}

// GET /api/users/:id/points/history
func getUserPointsHistory(c *fiber.Ctx) error {
	// Get points history with pagination
}

// GET /api/leaderboard
func getLeaderboard(c *fiber.Ctx) error {
	// Top users by points/level
	query := `
		SELECT
			ul.user_id, ul.level, ul.total_points,
			u.username,
			up.display_name, up.avatar_url
		FROM user_levels ul
		JOIN users u ON ul.user_id = u.id
		LEFT JOIN user_profiles up ON u.id = up.user_id
		ORDER BY ul.total_points DESC
		LIMIT 100
	`
}
```

---

## 🔗 Update `main.go` Routes

Thêm routes mới vào `backend/main.go`:

```go
func setupRoutes(app *fiber.App) {
	api := app.Group("/api")

	// ============ Posts ============
	api.Get("/posts", getPostsV2)                    // NEW
	api.Get("/posts/:slug", getPostBySlugV2)         // NEW
	api.Post("/posts/:id/vote", authMiddleware, votePostV2)     // NEW
	api.Get("/posts/:id/vote", optionalAuth, getUserVoteV2)     // NEW
	api.Post("/posts/:id/bookmark", authMiddleware, bookmarkPostV2) // NEW
	api.Get("/bookmarks", authMiddleware, getBookmarksV2)       // NEW

	// ============ Creators ============
	api.Get("/creators", getCreators)                // NEW
	api.Get("/creators/:slug", getCreatorBySlug)     // NEW
	api.Post("/creators/:id/follow", authMiddleware, followCreator)   // NEW
	api.Get("/following/creators", authMiddleware, getFollowingCreators) // NEW
	api.Get("/creators/:id/followers", getCreatorFollowers)   // NEW

	// ============ Tags ============
	api.Get("/tags", getTags)
	api.Get("/tags/:slug", getTagBySlug)

	// ============ Comments ============
	api.Get("/posts/:id/comments", getComments)
	api.Post("/posts/:id/comments", authMiddleware, createComment)
	api.Post("/comments/:id/vote", authMiddleware, voteComment)
	api.Delete("/comments/:id", authMiddleware, deleteComment)

	// ============ Products ============
	api.Get("/products", getProducts)
	api.Get("/products/:slug", getProductBySlug)
	api.Get("/brands", getBrands)
	api.Get("/product-categories", getProductCategories)

	// ============ Squads ============
	api.Get("/squads", getSquads)
	api.Get("/squads/:slug", getSquadBySlug)
	api.Post("/squads", authMiddleware, createSquad)
	api.Post("/squads/:id/join", authMiddleware, joinSquad)
	api.Post("/squads/:id/leave", authMiddleware, leaveSquad)
	api.Get("/squads/:id/members", getSquadMembers)
	api.Post("/squads/:id/posts", authMiddleware, sharePostToSquad)

	// ============ Gamification ============
	api.Get("/users/:id/level", getUserLevel)
	api.Get("/users/:id/streak", getUserStreak)
	api.Get("/achievements", getAchievements)
	api.Get("/users/:id/achievements", getUserAchievements)
	api.Get("/users/:id/points/history", getUserPointsHistory)
	api.Get("/leaderboard", getLeaderboard)

	// ============ Auth (Keep existing) ============
	api.Post("/register", register)
	api.Post("/login", login)
	api.Get("/me", authMiddleware, getMe)
}
```

---

## 🎯 Testing Backend

### 1. Test Posts endpoint
```bash
curl http://localhost:8080/api/posts
```

Expected response:
```json
[
  {
    "id": "uuid",
    "title": "Post title",
    "slug": "post-title",
    "creators": [
      {
        "id": "uuid",
        "name": "Creator Name",
        "slug": "creator-slug",
        "verified": true
      }
    ],
    "tags": [
      {
        "id": "uuid",
        "name": "Gaming",
        "slug": "gaming"
      }
    ],
    "upvote_count": 10,
    "downvote_count": 2,
    "comment_count": 5
  }
]
```

### 2. Test Voting
```bash
# Upvote
curl -X POST http://localhost:8080/api/posts/POST_ID/vote \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{"vote_type": 1}'

# Downvote
curl -X POST http://localhost:8080/api/posts/POST_ID/vote \
  -H "Authorization: Bearer YOUR_JWT" \
  -d '{"vote_type": -1}'
```

### 3. Test Creators
```bash
curl http://localhost:8080/api/creators

curl http://localhost:8080/api/creators/scrapshut
```

---

## 📋 Summary Checklist

### Backend Files Created:
- [x] `backend/models.go` - All types
- [x] `backend/handlers_posts.go` - Posts + Voting + Bookmarks
- [x] `backend/handlers_creators.go` - Creators + Follow
- [x] `backend/handlers_tags.go` - Tags
- [x] `backend/handlers_comments.go` - Comments + Voting
- [x] `backend/handlers_products.go` - Products + Brands
- [x] `backend/handlers_squads.go` - Communities
- [x] `backend/handlers_gamification.go` - Levels + Achievements
- [x] `backend/auth.go` - Auth with UUID support
- [x] `backend/main.go` - All routes configured

### Build & Compilation:
- [x] Backend compiles successfully
- [x] All Go dependencies resolved
- [x] No compilation errors

### Testing (Ready to test):
- [ ] Test Posts API
- [ ] Test Creators API
- [ ] Test Voting system
- [ ] Test Bookmarks
- [ ] Test Comments
- [ ] Test Squads
- [ ] Test Gamification
- [ ] Test Auth (register/login)

---

## 🚀 Next Steps

### Backend: ✅ COMPLETE!
All backend files have been created and the server compiles successfully.

### Frontend Update Required:
Now you need to update the frontend to work with the new API endpoints.

**Files to update:**
1. `scripts/api-client.js` - Add new API methods for all endpoints
2. `scripts/render.js` - Update rendering to use new data structure
3. `scripts/feed.js` - Update to use new API endpoints
4. Rename `company.html` to `creator.html`
5. Update all HTML pages to match new schema

**See:** [FRONTEND-UPDATE-GUIDE.md](FRONTEND-UPDATE-GUIDE.md) (to be created)
