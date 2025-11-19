package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
)

// ============================================
// POSTS HANDLERS
// ============================================

// GET /api/posts - Get all published posts with creators, tags, products
func getPostsV2(c *fiber.Ctx) error {
	// Query parameters
	limit := c.QueryInt("limit", 50)
	offset := c.QueryInt("offset", 0)
	status := c.Query("status", "published")
	featured := c.Query("featured", "")
	creatorSlug := c.Query("creator", "")
	tagSlug := c.Query("tag", "")

	// Build query with JOINs
	query := `
		WITH post_data AS (
			SELECT DISTINCT
				p.id, p.source_id, p.type, p.title, p.slug, p.description,
				p.external_url, p.thumbnail_url, p.published_at,
				p.read_time_minutes, p.watch_time_minutes,
				p.view_count, p.upvote_count, p.downvote_count,
				p.comment_count, p.bookmark_count,
				p.status, p.featured, p.created_at, p.updated_at
			FROM posts p
			LEFT JOIN post_creators pc ON p.id = pc.post_id
			LEFT JOIN creators c ON pc.creator_id = c.id
			LEFT JOIN post_tags pt ON p.id = pt.post_id
			LEFT JOIN tags t ON pt.tag_id = t.id
			WHERE p.status = $1
	`

	args := []interface{}{status}
	argPos := 2

	// Filter by featured
	if featured != "" {
		query += fmt.Sprintf(" AND p.featured = $%d", argPos)
		args = append(args, featured == "true")
		argPos++
	}

	// Filter by creator
	if creatorSlug != "" {
		query += fmt.Sprintf(" AND c.slug = $%d", argPos)
		args = append(args, creatorSlug)
		argPos++
	}

	// Filter by tag
	if tagSlug != "" {
		query += fmt.Sprintf(" AND t.slug = $%d", argPos)
		args = append(args, tagSlug)
		argPos++
	}

	query += `
			ORDER BY p.published_at DESC NULLS LAST, p.created_at DESC
		)
		SELECT
			pd.*,
			-- Get creators as JSON array
			COALESCE(
				(SELECT json_agg(
					json_build_object(
						'id', c.id,
						'name', c.name,
						'slug', c.slug,
						'avatar_url', c.avatar_url,
						'verified', c.verified
					)
				)
				FROM post_creators pc
				JOIN creators c ON pc.creator_id = c.id
				WHERE pc.post_id = pd.id
				), '[]'
			) as creators,
			-- Get tags as JSON array
			COALESCE(
				(SELECT json_agg(
					json_build_object(
						'id', t.id,
						'name', t.name,
						'slug', t.slug,
						'icon_name', t.icon_name
					)
				)
				FROM post_tags pt
				JOIN tags t ON pt.tag_id = t.id
				WHERE pt.post_id = pd.id
				), '[]'
			) as tags,
			-- Get products as JSON array
			COALESCE(
				(SELECT json_agg(
					json_build_object(
						'id', pr.id,
						'name', pr.name,
						'slug', pr.slug,
						'price', pr.price,
						'image_url', pr.image_url,
						'gearvn_url', pr.gearvn_url
					)
				)
				FROM post_products pp
				JOIN products pr ON pp.product_id = pr.id
				WHERE pp.post_id = pd.id
				), '[]'
			) as products
		FROM post_data pd
	`

	query += fmt.Sprintf(" LIMIT $%d OFFSET $%d", argPos, argPos+1)
	args = append(args, limit, offset)

	rows, err := db.Query(query, args...)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to fetch posts",
			"details": err.Error(),
		})
	}
	defer rows.Close()

	var posts []map[string]interface{}
	for rows.Next() {
		var p Post
		var creatorsJSON, tagsJSON, productsJSON string

		err := rows.Scan(
			&p.ID, &p.SourceID, &p.Type, &p.Title, &p.Slug, &p.Description,
			&p.ExternalURL, &p.ThumbnailURL, &p.PublishedAt,
			&p.ReadTimeMinutes, &p.WatchTimeMinutes,
			&p.ViewCount, &p.UpvoteCount, &p.DownvoteCount,
			&p.CommentCount, &p.BookmarkCount,
			&p.Status, &p.Featured, &p.CreatedAt, &p.UpdatedAt,
			&creatorsJSON, &tagsJSON, &productsJSON,
		)
		if err != nil {
			continue
		}

		// Parse JSON arrays
		postMap := map[string]interface{}{
			"id":                 p.ID,
			"source_id":          p.SourceID,
			"type":               p.Type,
			"title":              p.Title,
			"slug":               p.Slug,
			"description":        p.Description,
			"external_url":       p.ExternalURL,
			"thumbnail_url":      p.ThumbnailURL,
			"published_at":       p.PublishedAt,
			"read_time_minutes":  p.ReadTimeMinutes,
			"watch_time_minutes": p.WatchTimeMinutes,
			"view_count":         p.ViewCount,
			"upvote_count":       p.UpvoteCount,
			"downvote_count":     p.DownvoteCount,
			"comment_count":      p.CommentCount,
			"bookmark_count":     p.BookmarkCount,
			"status":             p.Status,
			"featured":           p.Featured,
			"created_at":         p.CreatedAt,
			"updated_at":         p.UpdatedAt,
		}

		// Parse creators
		var creators []interface{}
		json.Unmarshal([]byte(creatorsJSON), &creators)
		postMap["creators"] = creators

		// Parse tags
		var tags []interface{}
		json.Unmarshal([]byte(tagsJSON), &tags)
		postMap["tags"] = tags

		// Parse products
		var products []interface{}
		json.Unmarshal([]byte(productsJSON), &products)
		postMap["products"] = products

		posts = append(posts, postMap)
	}

	return c.JSON(posts)
}

// GET /api/posts/:slug - Get single post by slug with full details
func getPostBySlugV2(c *fiber.Ctx) error {
	slug := c.Params("slug")

	query := `
		SELECT
			p.id, p.source_id, p.type, p.title, p.slug, p.description, p.content,
			p.external_url, p.thumbnail_url, p.published_at,
			p.read_time_minutes, p.watch_time_minutes,
			p.view_count, p.upvote_count, p.downvote_count,
			p.comment_count, p.bookmark_count,
			p.status, p.featured, p.created_at, p.updated_at,
			-- Get creators
			COALESCE(
				(SELECT json_agg(
					json_build_object(
						'id', c.id,
						'name', c.name,
						'slug', c.slug,
						'avatar_url', c.avatar_url,
						'bio', c.bio,
						'verified', c.verified,
						'total_followers', c.total_followers
					)
				)
				FROM post_creators pc
				JOIN creators c ON pc.creator_id = c.id
				WHERE pc.post_id = p.id
				), '[]'
			) as creators,
			-- Get tags
			COALESCE(
				(SELECT json_agg(
					json_build_object(
						'id', t.id,
						'name', t.name,
						'slug', t.slug,
						'icon_name', t.icon_name
					)
				)
				FROM post_tags pt
				JOIN tags t ON pt.tag_id = t.id
				WHERE pt.post_id = p.id
				), '[]'
			) as tags,
			-- Get products
			COALESCE(
				(SELECT json_agg(
					json_build_object(
						'id', pr.id,
						'name', pr.name,
						'slug', pr.slug,
						'price', pr.price,
						'image_url', pr.image_url,
						'gearvn_url', pr.gearvn_url,
						'mention_type', pp.mention_type,
						'affiliate_link', pp.affiliate_link
					)
				)
				FROM post_products pp
				JOIN products pr ON pp.product_id = pr.id
				WHERE pp.post_id = p.id
				), '[]'
			) as products,
			-- Get media
			COALESCE(
				(SELECT json_agg(
					json_build_object(
						'id', pm.id,
						'type', pm.type,
						'url', pm.url,
						'caption', pm.caption,
						'order_index', pm.order_index
					) ORDER BY pm.order_index
				)
				FROM post_media pm
				WHERE pm.post_id = p.id
				), '[]'
			) as media
		FROM posts p
		WHERE p.slug = $1
	`

	var p Post
	var creatorsJSON, tagsJSON, productsJSON, mediaJSON string
	var content sql.NullString

	err := db.QueryRow(query, slug).Scan(
		&p.ID, &p.SourceID, &p.Type, &p.Title, &p.Slug, &p.Description, &content,
		&p.ExternalURL, &p.ThumbnailURL, &p.PublishedAt,
		&p.ReadTimeMinutes, &p.WatchTimeMinutes,
		&p.ViewCount, &p.UpvoteCount, &p.DownvoteCount,
		&p.CommentCount, &p.BookmarkCount,
		&p.Status, &p.Featured, &p.CreatedAt, &p.UpdatedAt,
		&creatorsJSON, &tagsJSON, &productsJSON, &mediaJSON,
	)

	if err == sql.ErrNoRows {
		return c.Status(404).JSON(fiber.Map{"error": "Post not found"})
	}
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to fetch post",
			"details": err.Error(),
		})
	}

	// Build response
	response := map[string]interface{}{
		"id":                 p.ID,
		"source_id":          p.SourceID,
		"type":               p.Type,
		"title":              p.Title,
		"slug":               p.Slug,
		"description":        p.Description,
		"content":            fromNullString(content),
		"external_url":       p.ExternalURL,
		"thumbnail_url":      p.ThumbnailURL,
		"published_at":       p.PublishedAt,
		"read_time_minutes":  p.ReadTimeMinutes,
		"watch_time_minutes": p.WatchTimeMinutes,
		"view_count":         p.ViewCount,
		"upvote_count":       p.UpvoteCount,
		"downvote_count":     p.DownvoteCount,
		"comment_count":      p.CommentCount,
		"bookmark_count":     p.BookmarkCount,
		"status":             p.Status,
		"featured":           p.Featured,
		"created_at":         p.CreatedAt,
		"updated_at":         p.UpdatedAt,
	}

	// Parse JSON arrays
	var creators, tags, products, media []interface{}
	json.Unmarshal([]byte(creatorsJSON), &creators)
	json.Unmarshal([]byte(tagsJSON), &tags)
	json.Unmarshal([]byte(productsJSON), &products)
	json.Unmarshal([]byte(mediaJSON), &media)

	response["creators"] = creators
	response["tags"] = tags
	response["products"] = products
	response["media"] = media

	// Track view (async)
	go trackPostView(p.ID, c)

	return c.JSON(response)
}

// POST /api/posts/:id/vote - Vote on post (upvote or downvote)
func votePostV2(c *fiber.Ctx) error {
	postID := c.Params("id")
	userID := c.Locals("userID").(string)

	var req struct {
		VoteType int `json:"vote_type"` // 1 = upvote, -1 = downvote
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	if req.VoteType != 1 && req.VoteType != -1 {
		return c.Status(400).JSON(fiber.Map{"error": "vote_type must be 1 (upvote) or -1 (downvote)"})
	}

	// Check if user already voted
	var existingVoteType int
	err := db.QueryRow(`
		SELECT vote_type FROM votes WHERE user_id = $1 AND post_id = $2
	`, userID, postID).Scan(&existingVoteType)

	if err == sql.ErrNoRows {
		// No existing vote, insert new
		_, err = db.Exec(`
			INSERT INTO votes (user_id, post_id, vote_type)
			VALUES ($1, $2, $3)
		`, userID, postID, req.VoteType)

		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to vote"})
		}

		return c.JSON(fiber.Map{
			"success": true,
			"action": "voted",
			"vote_type": req.VoteType,
		})
	}

	// Existing vote found
	if existingVoteType == req.VoteType {
		// Same vote type, remove vote
		_, err = db.Exec(`
			DELETE FROM votes WHERE user_id = $1 AND post_id = $2
		`, userID, postID)

		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to remove vote"})
		}

		return c.JSON(fiber.Map{
			"success": true,
			"action": "unvoted",
		})
	}

	// Different vote type, update
	_, err = db.Exec(`
		UPDATE votes SET vote_type = $1, updated_at = NOW()
		WHERE user_id = $2 AND post_id = $3
	`, req.VoteType, userID, postID)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update vote"})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"action": "changed",
		"vote_type": req.VoteType,
	})
}

// GET /api/posts/:id/vote - Get user's vote on post
func getUserVoteV2(c *fiber.Ctx) error {
	postID := c.Params("id")
	userID := c.Locals("userID")

	if userID == nil {
		return c.JSON(fiber.Map{"vote_type": nil})
	}

	var voteType int
	err := db.QueryRow(`
		SELECT vote_type FROM votes WHERE user_id = $1 AND post_id = $2
	`, userID, postID).Scan(&voteType)

	if err == sql.ErrNoRows {
		return c.JSON(fiber.Map{"vote_type": nil})
	}

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch vote"})
	}

	return c.JSON(fiber.Map{"vote_type": voteType})
}

// Helper: Track post view
func trackPostView(postID string, c *fiber.Ctx) {
	userID := c.Locals("userID")
	ip := c.IP()
	userAgent := c.Get("User-Agent")

	var userIDPtr *string
	if userID != nil {
		uid := userID.(string)
		userIDPtr = &uid
	}

	_, err := db.Exec(`
		INSERT INTO views (post_id, user_id, ip_address, user_agent)
		VALUES ($1, $2, $3, $4)
	`, postID, userIDPtr, ip, userAgent)

	if err != nil {
		// Log error but don't fail the request
		fmt.Printf("Error tracking view: %v\n", err)
	}
}

// POST /api/posts/:id/bookmark - Bookmark post
func bookmarkPostV2(c *fiber.Ctx) error {
	postID := c.Params("id")
	userID := c.Locals("userID").(string)

	var req struct {
		FolderName *string `json:"folder_name"`
	}
	c.BodyParser(&req)

	// Check if already bookmarked
	var exists bool
	err := db.QueryRow(`
		SELECT EXISTS(SELECT 1 FROM bookmarks WHERE user_id = $1 AND post_id = $2)
	`, userID, postID).Scan(&exists)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Database error"})
	}

	if exists {
		// Remove bookmark
		_, err = db.Exec(`
			DELETE FROM bookmarks WHERE user_id = $1 AND post_id = $2
		`, userID, postID)

		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to remove bookmark"})
		}

		return c.JSON(fiber.Map{
			"success": true,
			"action": "removed",
		})
	}

	// Add bookmark
	_, err = db.Exec(`
		INSERT INTO bookmarks (user_id, post_id, folder_name)
		VALUES ($1, $2, $3)
	`, userID, postID, req.FolderName)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to bookmark"})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"action": "added",
	})
}

// GET /api/bookmarks - Get user's bookmarks
func getBookmarksV2(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	folder := c.Query("folder", "")

	query := `
		SELECT
			b.post_id, b.folder_name, b.created_at,
			p.id, p.title, p.slug, p.description, p.thumbnail_url,
			p.upvote_count, p.downvote_count, p.comment_count,
			p.published_at,
			-- Get creators
			COALESCE(
				(SELECT json_agg(json_build_object('name', c.name, 'slug', c.slug))
				FROM post_creators pc JOIN creators c ON pc.creator_id = c.id
				WHERE pc.post_id = p.id), '[]'
			) as creators
		FROM bookmarks b
		JOIN posts p ON b.post_id = p.id
		WHERE b.user_id = $1
	`

	args := []interface{}{userID}
	if folder != "" {
		query += " AND b.folder_name = $2"
		args = append(args, folder)
	}

	query += " ORDER BY b.created_at DESC"

	rows, err := db.Query(query, args...)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch bookmarks"})
	}
	defer rows.Close()

	var bookmarks []map[string]interface{}
	for rows.Next() {
		var postID, title, slug string
		var description, thumbnailURL, folderName sql.NullString
		var upvotes, downvotes, comments int
		var publishedAt, bookmarkedAt time.Time
		var creatorsJSON string

		rows.Scan(
			&postID, &folderName, &bookmarkedAt,
			&postID, &title, &slug, &description, &thumbnailURL,
			&upvotes, &downvotes, &comments, &publishedAt,
			&creatorsJSON,
		)

		var creators []interface{}
		json.Unmarshal([]byte(creatorsJSON), &creators)

		bookmarks = append(bookmarks, map[string]interface{}{
			"post_id":       postID,
			"folder_name":   fromNullString(folderName),
			"bookmarked_at": bookmarkedAt,
			"post": map[string]interface{}{
				"id":             postID,
				"title":          title,
				"slug":           slug,
				"description":    fromNullString(description),
				"thumbnail_url":  fromNullString(thumbnailURL),
				"upvote_count":   upvotes,
				"downvote_count": downvotes,
				"comment_count":  comments,
				"published_at":   publishedAt,
				"creators":       creators,
			},
		})
	}

	return c.JSON(bookmarks)
}
