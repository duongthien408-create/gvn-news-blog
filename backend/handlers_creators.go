package main

import (
	"database/sql"
	"encoding/json"

	"github.com/gofiber/fiber/v2"
)

// ============================================
// CREATORS HANDLERS
// ============================================

// GET /api/creators - Get all creators
func getCreators(c *fiber.Ctx) error {
	verified := c.Query("verified", "")
	limit := c.QueryInt("limit", 50)

	query := `
		SELECT
			c.id, c.name, c.slug, c.avatar_url, c.bio, c.website,
			c.verified, c.total_followers, c.total_posts,
			c.created_at, c.updated_at,
			-- Get social media
			COALESCE(
				(SELECT json_agg(
					json_build_object(
						'platform', cs.platform,
						'url', cs.url,
						'follower_count', cs.follower_count
					)
				)
				FROM creator_socials cs
				WHERE cs.creator_id = c.id
				), '[]'
			) as socials
		FROM creators c
	`

	args := []interface{}{}
	if verified != "" {
		query += " WHERE c.verified = $1"
		args = append(args, verified == "true")
	}

	query += " ORDER BY c.total_followers DESC LIMIT $" + string(rune(len(args)+1))
	args = append(args, limit)

	rows, err := db.Query(query, args...)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to fetch creators",
			"details": err.Error(),
		})
	}
	defer rows.Close()

	var creators []map[string]interface{}
	for rows.Next() {
		var id, name, slug string
		var avatarURL, bio, website sql.NullString
		var verified bool
		var totalFollowers, totalPosts int
		var createdAt, updatedAt interface{}
		var socialsJSON string

		err := rows.Scan(
			&id, &name, &slug, &avatarURL, &bio, &website,
			&verified, &totalFollowers, &totalPosts,
			&createdAt, &updatedAt, &socialsJSON,
		)
		if err != nil {
			continue
		}

		var socials []interface{}
		json.Unmarshal([]byte(socialsJSON), &socials)

		creators = append(creators, map[string]interface{}{
			"id":              id,
			"name":            name,
			"slug":            slug,
			"avatar_url":      fromNullString(avatarURL),
			"bio":             fromNullString(bio),
			"website":         fromNullString(website),
			"verified":        verified,
			"total_followers": totalFollowers,
			"total_posts":     totalPosts,
			"created_at":      createdAt,
			"updated_at":      updatedAt,
			"socials":         socials,
		})
	}

	return c.JSON(creators)
}

// GET /api/creators/:slug - Get creator by slug with posts
func getCreatorBySlug(c *fiber.Ctx) error {
	slug := c.Params("slug")

	// Get creator info
	query := `
		SELECT
			c.id, c.name, c.slug, c.avatar_url, c.bio, c.website,
			c.verified, c.total_followers, c.total_posts,
			c.created_at, c.updated_at,
			-- Get social media
			COALESCE(
				(SELECT json_agg(
					json_build_object(
						'id', cs.id,
						'platform', cs.platform,
						'url', cs.url,
						'follower_count', cs.follower_count
					)
				)
				FROM creator_socials cs
				WHERE cs.creator_id = c.id
				), '[]'
			) as socials
		FROM creators c
		WHERE c.slug = $1
	`

	var id, name, creatorSlug string
	var avatarURL, bio, website sql.NullString
	var verified bool
	var totalFollowers, totalPosts int
	var createdAt, updatedAt interface{}
	var socialsJSON string

	err := db.QueryRow(query, slug).Scan(
		&id, &name, &creatorSlug, &avatarURL, &bio, &website,
		&verified, &totalFollowers, &totalPosts,
		&createdAt, &updatedAt, &socialsJSON,
	)

	if err == sql.ErrNoRows {
		return c.Status(404).JSON(fiber.Map{"error": "Creator not found"})
	}
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to fetch creator",
			"details": err.Error(),
		})
	}

	var socials []interface{}
	json.Unmarshal([]byte(socialsJSON), &socials)

	creator := map[string]interface{}{
		"id":              id,
		"name":            name,
		"slug":            creatorSlug,
		"avatar_url":      fromNullString(avatarURL),
		"bio":             fromNullString(bio),
		"website":         fromNullString(website),
		"verified":        verified,
		"total_followers": totalFollowers,
		"total_posts":     totalPosts,
		"created_at":      createdAt,
		"updated_at":      updatedAt,
		"socials":         socials,
	}

	// Get creator's posts
	postsQuery := `
		SELECT
			p.id, p.title, p.slug, p.description, p.thumbnail_url,
			p.upvote_count, p.downvote_count, p.comment_count,
			p.published_at, p.featured,
			-- Get tags
			COALESCE(
				(SELECT json_agg(json_build_object('name', t.name, 'slug', t.slug))
				FROM post_tags pt JOIN tags t ON pt.tag_id = t.id
				WHERE pt.post_id = p.id), '[]'
			) as tags
		FROM posts p
		JOIN post_creators pc ON p.id = pc.post_id
		WHERE pc.creator_id = $1 AND p.status = 'published'
		ORDER BY p.published_at DESC
		LIMIT 20
	`

	postsRows, err := db.Query(postsQuery, id)
	if err == nil {
		defer postsRows.Close()

		var posts []map[string]interface{}
		for postsRows.Next() {
			var postID, title, postSlug string
			var description, thumbnailURL sql.NullString
			var upvotes, downvotes, comments int
			var publishedAt interface{}
			var featured bool
			var tagsJSON string

			postsRows.Scan(
				&postID, &title, &postSlug, &description, &thumbnailURL,
				&upvotes, &downvotes, &comments, &publishedAt, &featured,
				&tagsJSON,
			)

			var tags []interface{}
			json.Unmarshal([]byte(tagsJSON), &tags)

			posts = append(posts, map[string]interface{}{
				"id":             postID,
				"title":          title,
				"slug":           postSlug,
				"description":    fromNullString(description),
				"thumbnail_url":  fromNullString(thumbnailURL),
				"upvote_count":   upvotes,
				"downvote_count": downvotes,
				"comment_count":  comments,
				"published_at":   publishedAt,
				"featured":       featured,
				"tags":           tags,
			})
		}

		creator["posts"] = posts
	}

	return c.JSON(creator)
}

// POST /api/creators/:id/follow - Follow/unfollow creator
func followCreator(c *fiber.Ctx) error {
	creatorID := c.Params("id")
	userID := c.Locals("userID").(string)

	// Check if already following
	var exists bool
	err := db.QueryRow(`
		SELECT EXISTS(
			SELECT 1 FROM follows
			WHERE follower_id = $1 AND creator_id = $2
		)
	`, userID, creatorID).Scan(&exists)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Database error"})
	}

	if exists {
		// Unfollow
		_, err = db.Exec(`
			DELETE FROM follows
			WHERE follower_id = $1 AND creator_id = $2
		`, userID, creatorID)

		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to unfollow"})
		}

		return c.JSON(fiber.Map{
			"success": true,
			"action": "unfollowed",
		})
	}

	// Follow
	_, err = db.Exec(`
		INSERT INTO follows (follower_id, creator_id)
		VALUES ($1, $2)
	`, userID, creatorID)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to follow"})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"action": "followed",
	})
}

// GET /api/following/creators - Get creators user is following
func getFollowingCreators(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)

	query := `
		SELECT
			c.id, c.name, c.slug, c.avatar_url, c.verified,
			c.total_followers, c.total_posts,
			f.created_at as followed_at
		FROM follows f
		JOIN creators c ON f.creator_id = c.id
		WHERE f.follower_id = $1
		ORDER BY f.created_at DESC
	`

	rows, err := db.Query(query, userID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch following"})
	}
	defer rows.Close()

	var following []map[string]interface{}
	for rows.Next() {
		var id, name, slug string
		var avatarURL sql.NullString
		var verified bool
		var totalFollowers, totalPosts int
		var followedAt interface{}

		rows.Scan(
			&id, &name, &slug, &avatarURL, &verified,
			&totalFollowers, &totalPosts, &followedAt,
		)

		following = append(following, map[string]interface{}{
			"id":              id,
			"name":            name,
			"slug":            slug,
			"avatar_url":      fromNullString(avatarURL),
			"verified":        verified,
			"total_followers": totalFollowers,
			"total_posts":     totalPosts,
			"followed_at":     followedAt,
		})
	}

	return c.JSON(following)
}

// GET /api/creators/:id/followers - Get creator's followers
func getCreatorFollowers(c *fiber.Ctx) error {
	creatorID := c.Params("id")
	limit := c.QueryInt("limit", 50)

	query := `
		SELECT
			u.id, u.username, u.created_at,
			up.display_name, up.avatar_url,
			f.created_at as followed_at
		FROM follows f
		JOIN users u ON f.follower_id = u.id
		LEFT JOIN user_profiles up ON u.id = up.user_id
		WHERE f.creator_id = $1
		ORDER BY f.created_at DESC
		LIMIT $2
	`

	rows, err := db.Query(query, creatorID, limit)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch followers"})
	}
	defer rows.Close()

	var followers []map[string]interface{}
	for rows.Next() {
		var id, username string
		var userCreatedAt, followedAt interface{}
		var displayName, avatarURL sql.NullString

		rows.Scan(
			&id, &username, &userCreatedAt,
			&displayName, &avatarURL, &followedAt,
		)

		followers = append(followers, map[string]interface{}{
			"id":           id,
			"username":     username,
			"display_name": fromNullString(displayName),
			"avatar_url":   fromNullString(avatarURL),
			"followed_at":  followedAt,
		})
	}

	return c.JSON(followers)
}
