package main

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/lib/pq"
)

// ============ CMS Posts Handlers ============

func cmsGetPosts(c *fiber.Ctx) error {
	rows, err := db.Query(`
		SELECT id, title, excerpt, content, cover_image, creator_id, creator_name,
		       creator_avatar, category, tags, upvotes, comments_count, read_time,
		       published, created_at, updated_at
		FROM posts
		ORDER BY created_at DESC
	`)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch posts"})
	}
	defer rows.Close()

	var posts []Post
	for rows.Next() {
		var p Post
		err := rows.Scan(
			&p.ID, &p.Title, &p.Excerpt, &p.Content, &p.CoverImage, &p.CreatorID,
			&p.CreatorName, &p.CreatorAvatar, &p.Category, &p.Tags, &p.Upvotes,
			&p.CommentsCount, &p.ReadTime, &p.Published, &p.CreatedAt, &p.UpdatedAt,
		)
		if err != nil {
			continue
		}
		posts = append(posts, p)
	}

	return c.JSON(posts)
}

func cmsCreatePost(c *fiber.Ctx) error {
	var req struct {
		ID            string   `json:"id"`
		Title         string   `json:"title"`
		Excerpt       string   `json:"excerpt"`
		Content       string   `json:"content"`
		CoverImage    string   `json:"cover_image"`
		CreatorID     string   `json:"creator_id"`
		CreatorName   string   `json:"creator_name"`
		CreatorAvatar string   `json:"creator_avatar"`
		Category      string   `json:"category"`
		Tags          []string `json:"tags"`
		ReadTime      string   `json:"read_time"`
		Published     bool     `json:"published"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// Validate required fields
	if req.ID == "" || req.Title == "" {
		return c.Status(400).JSON(fiber.Map{"error": "ID and title are required"})
	}

	_, err := db.Exec(`
		INSERT INTO posts (id, title, excerpt, content, cover_image, creator_id, creator_name,
		                   creator_avatar, category, tags, read_time, published)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
	`, req.ID, req.Title, req.Excerpt, req.Content, req.CoverImage, req.CreatorID,
		req.CreatorName, req.CreatorAvatar, req.Category, pq.Array(req.Tags),
		req.ReadTime, req.Published)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create post", "details": err.Error()})
	}

	return c.Status(201).JSON(fiber.Map{
		"success": true,
		"message": "Post created successfully",
		"id":      req.ID,
	})
}

func cmsUpdatePost(c *fiber.Ctx) error {
	id := c.Params("id")

	var req struct {
		Title         string   `json:"title"`
		Excerpt       string   `json:"excerpt"`
		Content       string   `json:"content"`
		CoverImage    string   `json:"cover_image"`
		CreatorID     string   `json:"creator_id"`
		CreatorName   string   `json:"creator_name"`
		CreatorAvatar string   `json:"creator_avatar"`
		Category      string   `json:"category"`
		Tags          []string `json:"tags"`
		ReadTime      string   `json:"read_time"`
		Published     bool     `json:"published"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	result, err := db.Exec(`
		UPDATE posts
		SET title = $1, excerpt = $2, content = $3, cover_image = $4, creator_id = $5,
		    creator_name = $6, creator_avatar = $7, category = $8, tags = $9,
		    read_time = $10, published = $11, updated_at = CURRENT_TIMESTAMP
		WHERE id = $12
	`, req.Title, req.Excerpt, req.Content, req.CoverImage, req.CreatorID,
		req.CreatorName, req.CreatorAvatar, req.Category, pq.Array(req.Tags),
		req.ReadTime, req.Published, id)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update post"})
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return c.Status(404).JSON(fiber.Map{"error": "Post not found"})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Post updated successfully",
	})
}

func cmsDeletePost(c *fiber.Ctx) error {
	id := c.Params("id")

	result, err := db.Exec(`DELETE FROM posts WHERE id = $1`, id)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to delete post"})
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return c.Status(404).JSON(fiber.Map{"error": "Post not found"})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Post deleted successfully",
	})
}

// ============ CMS Creators Handlers ============

func cmsGetCreators(c *fiber.Ctx) error {
	rows, err := db.Query(`
		SELECT id, name, initials, avatar, banner, bio, tags, followers, following,
		       similar, created_at, updated_at
		FROM creators
		ORDER BY created_at DESC
	`)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch creators"})
	}
	defer rows.Close()

	var creators []Creator
	for rows.Next() {
		var cr Creator
		err := rows.Scan(
			&cr.ID, &cr.Name, &cr.Initials, &cr.Avatar, &cr.Banner, &cr.Bio,
			&cr.Tags, &cr.Followers, &cr.Following, &cr.Similar, &cr.CreatedAt, &cr.UpdatedAt,
		)
		if err != nil {
			continue
		}
		creators = append(creators, cr)
	}

	return c.JSON(creators)
}

func cmsCreateCreator(c *fiber.Ctx) error {
	var req struct {
		ID       string   `json:"id"`
		Name     string   `json:"name"`
		Initials string   `json:"initials"`
		Avatar   string   `json:"avatar"`
		Banner   string   `json:"banner"`
		Bio      string   `json:"bio"`
		Tags     []string `json:"tags"`
		Similar  []string `json:"similar"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if req.ID == "" || req.Name == "" {
		return c.Status(400).JSON(fiber.Map{"error": "ID and name are required"})
	}

	_, err := db.Exec(`
		INSERT INTO creators (id, name, initials, avatar, banner, bio, tags, similar)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
	`, req.ID, req.Name, req.Initials, req.Avatar, req.Banner, req.Bio,
		pq.Array(req.Tags), pq.Array(req.Similar))

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create creator", "details": err.Error()})
	}

	return c.Status(201).JSON(fiber.Map{
		"success": true,
		"message": "Creator created successfully",
		"id":      req.ID,
	})
}

func cmsUpdateCreator(c *fiber.Ctx) error {
	id := c.Params("id")

	var req struct {
		Name     string   `json:"name"`
		Initials string   `json:"initials"`
		Avatar   string   `json:"avatar"`
		Banner   string   `json:"banner"`
		Bio      string   `json:"bio"`
		Tags     []string `json:"tags"`
		Similar  []string `json:"similar"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	result, err := db.Exec(`
		UPDATE creators
		SET name = $1, initials = $2, avatar = $3, banner = $4, bio = $5,
		    tags = $6, similar = $7, updated_at = CURRENT_TIMESTAMP
		WHERE id = $8
	`, req.Name, req.Initials, req.Avatar, req.Banner, req.Bio,
		pq.Array(req.Tags), pq.Array(req.Similar), id)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update creator"})
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return c.Status(404).JSON(fiber.Map{"error": "Creator not found"})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Creator updated successfully",
	})
}

func cmsDeleteCreator(c *fiber.Ctx) error {
	id := c.Params("id")

	result, err := db.Exec(`DELETE FROM creators WHERE id = $1`, id)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to delete creator"})
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return c.Status(404).JSON(fiber.Map{"error": "Creator not found"})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Creator deleted successfully",
	})
}

// ============ CMS Stats ============

func cmsGetStats(c *fiber.Ctx) error {
	var stats struct {
		TotalPosts        int       `json:"total_posts"`
		PublishedPosts    int       `json:"published_posts"`
		TotalCreators     int       `json:"total_creators"`
		TotalUsers        int       `json:"total_users"`
		TotalComments     int       `json:"total_comments"`
		TotalBookmarks    int       `json:"total_bookmarks"`
		TotalUpvotes      int       `json:"total_upvotes"`
		RecentPostsCount  int       `json:"recent_posts_count"`
		LastUpdated       time.Time `json:"last_updated"`
	}

	// Get counts
	db.QueryRow(`SELECT COUNT(*) FROM posts`).Scan(&stats.TotalPosts)
	db.QueryRow(`SELECT COUNT(*) FROM posts WHERE published = true`).Scan(&stats.PublishedPosts)
	db.QueryRow(`SELECT COUNT(*) FROM creators`).Scan(&stats.TotalCreators)
	db.QueryRow(`SELECT COUNT(*) FROM users`).Scan(&stats.TotalUsers)
	db.QueryRow(`SELECT COUNT(*) FROM comments`).Scan(&stats.TotalComments)
	db.QueryRow(`SELECT COUNT(*) FROM bookmarks`).Scan(&stats.TotalBookmarks)
	db.QueryRow(`SELECT COUNT(*) FROM upvotes`).Scan(&stats.TotalUpvotes)
	db.QueryRow(`SELECT COUNT(*) FROM posts WHERE created_at > NOW() - INTERVAL '7 days'`).Scan(&stats.RecentPostsCount)

	stats.LastUpdated = time.Now()

	return c.JSON(stats)
}
