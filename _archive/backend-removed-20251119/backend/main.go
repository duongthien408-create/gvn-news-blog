package main

import (
	"database/sql"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var db *sql.DB

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	// Connect to database
	var err error
	db, err = sql.Open("postgres", os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	// Test connection
	if err = db.Ping(); err != nil {
		log.Fatal("Failed to ping database:", err)
	}
	log.Println("✅ Connected to Supabase PostgreSQL")

	// Note: Old migration, seeding, and aggregator features are disabled
	// These need to be updated for the new schema
	log.Println("✅ Database connection ready")

	// Create Fiber app
	app := fiber.New(fiber.Config{
		ErrorHandler: customErrorHandler,
	})

	// Middleware
	app.Use(recover.New())
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: getAllowedOrigins(),
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))

	// Routes
	setupRoutes(app)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Server starting on port %s\n", port)
	log.Printf("📍 API: http://localhost:%s/api\n", port)
	log.Printf("🎨 CMS: http://localhost:%s/cms\n", port)

	if err := app.Listen(":" + port); err != nil {
		log.Fatal(err)
	}
}

func getAllowedOrigins() string {
	origins := os.Getenv("ALLOWED_ORIGINS")
	if origins == "" {
		return "*"
	}
	return origins
}

func customErrorHandler(c *fiber.Ctx, err error) error {
	code := fiber.StatusInternalServerError
	message := "Internal Server Error"

	if e, ok := err.(*fiber.Error); ok {
		code = e.Code
		message = e.Message
	}

	return c.Status(code).JSON(fiber.Map{
		"error":   true,
		"message": message,
	})
}

// Note: initDatabase is disabled for new schema
// The new schema is managed via Supabase SQL Editor
// See database/02-new-complete-schema.sql

func setupRoutes(app *fiber.App) {
	// Health check
	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "ok",
			"message": "GearVN Blog API",
			"version": "2.0.0",
		})
	})

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

	// ============================================
	// ADMIN ROUTES (Protected by AdminMiddleware)
	// ============================================
	admin := api.Group("/admin", AdminMiddleware)

	// Dashboard
	admin.Get("/dashboard/stats", GetDashboardStats)
	admin.Get("/dashboard/activity", GetRecentActivity)

	// Posts Management
	admin.Get("/posts", GetAdminPosts)
	admin.Get("/posts/:id", GetAdminPost)
	admin.Post("/posts", CreateAdminPost)
	admin.Put("/posts/:id", UpdateAdminPost)
	admin.Delete("/posts/:id", DeleteAdminPost)
	admin.Post("/posts/bulk-delete", BulkDeletePosts)

	// Users Management
	admin.Get("/users", GetAdminUsers)
	admin.Get("/users/:id", GetAdminUser)
	admin.Put("/users/:id", UpdateAdminUser)
	admin.Delete("/users/:id", DeleteAdminUser)
	admin.Post("/users/:id/ban", BanUser)
	admin.Post("/users/:id/unban", UnbanUser)
	admin.Put("/users/:id/role", ChangeUserRole)
	admin.Post("/users/:id/achievements", GrantAchievement)
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
