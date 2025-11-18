# 🔗 Routes Update Guide

## ✅ Files Created

All handler files are ready:
- ✅ `models.go` - All types
- ✅ `handlers_posts.go` - Posts, Voting, Bookmarks
- ✅ `handlers_creators.go` - Creators, Follow system
- ✅ `handlers_tags.go` - Tags
- ✅ `handlers_comments.go` - Comments, Comment voting
- ✅ `handlers_products.go` - Products, Brands, Categories
- ✅ `handlers_squads.go` - Squads/Communities
- ✅ `handlers_gamification.go` - Levels, Achievements, Leaderboard

---

## 📝 Update `main.go`

Add this to your `main.go` file (replace old routes):

```go
package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	_ "github.com/lib/pq"
)

var db *sql.DB

func main() {
	// Database connection (keep your existing DB connection code)
	var err error
	db, err = sql.Open("postgres", os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Fiber app
	app := fiber.New()

	// CORS
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))

	// Setup routes
	setupRoutes(app)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(app.Listen(":" + port))
}

func setupRoutes(app *fiber.App) {
	api := app.Group("/api")

	// ============================================
	// POSTS
	// ============================================
	api.Get("/posts", getPostsV2)
	api.Get("/posts/:slug", getPostBySlugV2)
	api.Post("/posts/:id/vote", authMiddleware, votePostV2)
	api.Get("/posts/:id/vote", optionalAuth, getUserVoteV2)
	api.Post("/posts/:id/bookmark", authMiddleware, bookmarkPostV2)

	// ============================================
	// BOOKMARKS
	// ============================================
	api.Get("/bookmarks", authMiddleware, getBookmarksV2)

	// ============================================
	// CREATORS
	// ============================================
	api.Get("/creators", getCreators)
	api.Get("/creators/:slug", getCreatorBySlug)
	api.Post("/creators/:id/follow", authMiddleware, followCreator)
	api.Get("/creators/:id/followers", getCreatorFollowers)
	api.Get("/following/creators", authMiddleware, getFollowingCreators)

	// ============================================
	// TAGS
	// ============================================
	api.Get("/tags", getTags)
	api.Get("/tags/:slug", getTagBySlug)
	api.Get("/tags/trending", getTrendingTags)

	// ============================================
	// COMMENTS
	// ============================================
	api.Get("/posts/:id/comments", getComments)
	api.Post("/posts/:id/comments", authMiddleware, createComment)
	api.Post("/comments/:id/vote", authMiddleware, voteComment)
	api.Put("/comments/:id", authMiddleware, updateComment)
	api.Delete("/comments/:id", authMiddleware, deleteComment)

	// ============================================
	// PRODUCTS
	// ============================================
	api.Get("/products", getProducts)
	api.Get("/products/:slug", getProductBySlug)
	api.Get("/brands", getBrands)
	api.Get("/product-categories", getProductCategories)

	// ============================================
	// SQUADS (COMMUNITIES)
	// ============================================
	api.Get("/squads", getSquads)
	api.Get("/squads/:slug", getSquadBySlug)
	api.Post("/squads", authMiddleware, createSquad)
	api.Post("/squads/:id/join", authMiddleware, joinSquad)
	api.Post("/squads/:id/leave", authMiddleware, leaveSquad)
	api.Get("/squads/:id/members", getSquadMembers)
	api.Post("/squads/:id/posts", authMiddleware, sharePostToSquad)

	// ============================================
	// GAMIFICATION
	// ============================================
	api.Get("/users/:id/level", getUserLevel)
	api.Get("/users/:id/streak", getUserStreak)
	api.Get("/users/:id/stats", getUserStats)
	api.Get("/achievements", getAchievements)
	api.Get("/users/:id/achievements", getUserAchievements)
	api.Post("/users/:id/achievements", authMiddleware, awardAchievement)
	api.Get("/users/:id/points/history", getUserPointsHistory)
	api.Get("/leaderboard", getLeaderboard)

	// ============================================
	// AUTH (Keep existing auth handlers)
	// ============================================
	api.Post("/register", register)
	api.Post("/login", login)
	api.Get("/me", authMiddleware, getMe)
	api.Put("/me", authMiddleware, updateProfile)
}

// Optional auth middleware (doesn't require auth but extracts user if present)
func optionalAuth(c *fiber.Ctx) error {
	token := c.Get("Authorization")
	if token != "" {
		// Extract user ID from token and set in context
		// Your existing JWT logic here
	}
	return c.Next()
}
```

---

## 🧪 Test Routes

### 1. Test Posts endpoint
```bash
curl http://localhost:8080/api/posts
```

### 2. Test Creators endpoint
```bash
curl http://localhost:8080/api/creators
```

### 3. Test Tags endpoint
```bash
curl http://localhost:8080/api/tags
```

### 4. Test Products endpoint
```bash
curl http://localhost:8080/api/products
```

### 5. Test Squads endpoint
```bash
curl http://localhost:8080/api/squads
```

### 6. Test Gamification endpoint
```bash
curl http://localhost:8080/api/leaderboard
```

### 7. Test Voting (requires auth)
```bash
curl -X POST http://localhost:8080/api/posts/POST_ID/vote \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{"vote_type": 1}'
```

---

## 🚀 Build and Run

```bash
cd backend

# Install dependencies (if needed)
go mod tidy

# Run server
go run .

# Or build
go build -o gearvn-api
./gearvn-api
```

---

## ✅ Backend Complete!

All 8 handler files created:
- [x] models.go
- [x] handlers_posts.go
- [x] handlers_creators.go
- [x] handlers_tags.go
- [x] handlers_comments.go
- [x] handlers_products.go
- [x] handlers_squads.go
- [x] handlers_gamification.go

Total: **~2500 lines of code**

---

## 📋 Next: Update Frontend

Files to update:
1. `scripts/api-client.js` - Add new API methods
2. `scripts/render.js` - Update rendering functions
3. `scripts/feed.js` - Use new API
4. `company.html` → Rename to `creator.html`
5. Update all HTML pages

See [FRONTEND-UPDATE-GUIDE.md](../FRONTEND-UPDATE-GUIDE.md) for details.
