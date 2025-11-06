package main

import (
	"database/sql"
	"fmt"
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

	// Initialize database tables
	if err := initDatabase(); err != nil {
		log.Fatal("Failed to initialize database:", err)
	}

	// Check for migrate flag
	if len(os.Args) > 1 && os.Args[1] == "--migrate" {
		if err := RunMigration(db); err != nil {
			log.Fatal("Failed to run migration:", err)
		}
		if err := VerifyMigration(db); err != nil {
			log.Fatal("Failed to verify migration:", err)
		}
		log.Println("🎉 Migration complete! Exiting...")
		return
	}

	// Check for seed-videos flag
	if len(os.Args) > 1 && os.Args[1] == "--seed-videos" {
		if err := RunSQLFile(db, "../database/02-insert-sample-videos.sql"); err != nil {
			log.Fatal("Failed to seed videos:", err)
		}
		log.Println("🎉 Video seeding complete! Exiting...")
		return
	}

	// Check for seed flag
	if len(os.Args) > 1 && os.Args[1] == "--seed" {
		if err := SeedDatabase(); err != nil {
			log.Fatal("Failed to seed database:", err)
		}
		log.Println("🎉 Seeding complete! Exiting...")
		return
	}

	// Check for seed-sources flag
	if len(os.Args) > 1 && os.Args[1] == "--seed-sources" {
		if err := SeedSources(); err != nil {
			log.Fatal("Failed to seed sources:", err)
		}
		log.Println("🎉 Sources seeding complete! Exiting...")
		return
	}

	// Start content aggregator in background
	aggregator := NewAggregator()
	go aggregator.Start()

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

func initDatabase() error {
	log.Println("🔧 Initializing database tables...")

	queries := []string{
		// Users table
		`CREATE TABLE IF NOT EXISTS users (
			id SERIAL PRIMARY KEY,
			email VARCHAR(255) UNIQUE NOT NULL,
			password_hash VARCHAR(255) NOT NULL,
			username VARCHAR(100),
			avatar_url TEXT,
			role VARCHAR(50) DEFAULT 'user',
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,

		// Posts table
		`CREATE TABLE IF NOT EXISTS posts (
			id VARCHAR(255) PRIMARY KEY,
			title VARCHAR(500) NOT NULL,
			excerpt TEXT,
			content TEXT,
			cover_image TEXT,
			creator_id VARCHAR(255),
			creator_name VARCHAR(255),
			creator_avatar TEXT,
			source_id INTEGER,
			external_url TEXT,
			published_at TIMESTAMP,
			category VARCHAR(100),
			tags TEXT[],
			upvotes INTEGER DEFAULT 0,
			comments_count INTEGER DEFAULT 0,
			read_time VARCHAR(50),
			published BOOLEAN DEFAULT false,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,

		// Creators table
		`CREATE TABLE IF NOT EXISTS creators (
			id VARCHAR(255) PRIMARY KEY,
			name VARCHAR(255) NOT NULL,
			initials VARCHAR(10),
			avatar TEXT,
			banner TEXT,
			bio TEXT,
			tags TEXT[],
			followers INTEGER DEFAULT 0,
			following INTEGER DEFAULT 0,
			similar_creators TEXT[],
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,

		// Bookmarks table
		`CREATE TABLE IF NOT EXISTS bookmarks (
			id SERIAL PRIMARY KEY,
			user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
			post_id VARCHAR(255) REFERENCES posts(id) ON DELETE CASCADE,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			UNIQUE(user_id, post_id)
		)`,

		// Following table
		`CREATE TABLE IF NOT EXISTS following (
			id SERIAL PRIMARY KEY,
			user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
			creator_id VARCHAR(255) REFERENCES creators(id) ON DELETE CASCADE,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			UNIQUE(user_id, creator_id)
		)`,

		// Upvotes table
		`CREATE TABLE IF NOT EXISTS upvotes (
			id SERIAL PRIMARY KEY,
			user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
			post_id VARCHAR(255) REFERENCES posts(id) ON DELETE CASCADE,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			UNIQUE(user_id, post_id)
		)`,

		// Comments table
		`CREATE TABLE IF NOT EXISTS comments (
			id SERIAL PRIMARY KEY,
			post_id VARCHAR(255) REFERENCES posts(id) ON DELETE CASCADE,
			user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
			content TEXT NOT NULL,
			parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,

		// Sources table (for RSS feeds)
		`CREATE TABLE IF NOT EXISTS sources (
			id SERIAL PRIMARY KEY,
			name VARCHAR(255) NOT NULL,
			url TEXT UNIQUE NOT NULL,
			type VARCHAR(20) DEFAULT 'rss',
			category VARCHAR(100),
			active BOOLEAN DEFAULT true,
			fetch_interval INTEGER DEFAULT 30,
			last_fetched_at TIMESTAMP,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,

		// Create indexes
		`CREATE INDEX IF NOT EXISTS idx_posts_creator ON posts(creator_id)`,
		`CREATE INDEX IF NOT EXISTS idx_posts_source ON posts(source_id)`,
		`CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published)`,
		`CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id)`,
		`CREATE INDEX IF NOT EXISTS idx_following_user ON following(user_id)`,
		`CREATE INDEX IF NOT EXISTS idx_upvotes_user ON upvotes(user_id)`,
		`CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id)`,
		`CREATE INDEX IF NOT EXISTS idx_sources_active ON sources(active)`,
		`CREATE INDEX IF NOT EXISTS idx_sources_category ON sources(category)`,
	}

	for _, query := range queries {
		if _, err := db.Exec(query); err != nil {
			return fmt.Errorf("failed to execute query: %v", err)
		}
	}

	log.Println("✅ Database tables initialized")
	return nil
}

func setupRoutes(app *fiber.App) {
	// Health check
	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "ok",
			"message": "GearVN Blog API",
			"version": "1.0.0",
		})
	})

	// API routes
	api := app.Group("/api")

	// Public routes
	api.Get("/posts", getPosts)
	api.Get("/posts/:id", getPost)
	api.Get("/creators", getCreators)
	api.Get("/creators/:id", getCreator)
	api.Get("/creators/:id/posts", getCreatorPosts)

	// Auth routes
	api.Post("/auth/register", register)
	api.Post("/auth/login", login)
	api.Get("/auth/me", authMiddleware, getCurrentUser)

	// User interaction routes (requires auth)
	api.Get("/user/bookmarks", authMiddleware, getUserBookmarks)
	api.Post("/user/bookmarks/:postId", authMiddleware, addBookmark)
	api.Delete("/user/bookmarks/:postId", authMiddleware, removeBookmark)

	api.Get("/user/following", authMiddleware, getUserFollowing)
	api.Post("/user/following/:creatorId", authMiddleware, addFollowing)
	api.Delete("/user/following/:creatorId", authMiddleware, removeFollowing)

	api.Get("/user/upvotes", authMiddleware, getUserUpvotes)
	api.Post("/user/upvotes/:postId", authMiddleware, addUpvote)
	api.Delete("/user/upvotes/:postId", authMiddleware, removeUpvote)

	api.Get("/posts/:id/comments", getComments)
	api.Post("/posts/:id/comments", authMiddleware, addComment)

	// User post management (edit own posts)
	api.Put("/posts/:id", authMiddleware, updateUserPost)

	// CMS routes (admin only)
	cms := app.Group("/cms", authMiddleware, adminMiddleware)

	cms.Get("/posts", cmsGetPosts)
	cms.Post("/posts", cmsCreatePost)
	cms.Put("/posts/:id", cmsUpdatePost)
	cms.Delete("/posts/:id", cmsDeletePost)

	cms.Get("/creators", cmsGetCreators)
	cms.Post("/creators", cmsCreateCreator)
	cms.Put("/creators/:id", cmsUpdateCreator)
	cms.Delete("/creators/:id", cmsDeleteCreator)

	cms.Get("/stats", cmsGetStats)
}
