package main

import (
	"database/sql"
	"encoding/json"

	"github.com/gofiber/fiber/v2"
)

// ============================================
// TAGS HANDLERS
// ============================================

// GET /api/tags - Get all tags
func getTags(c *fiber.Ctx) error {
	limit := c.QueryInt("limit", 50)

	query := `
		SELECT id, name, slug, description, icon_name, post_count, created_at
		FROM tags
		ORDER BY post_count DESC
		LIMIT $1
	`

	rows, err := db.Query(query, limit)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch tags"})
	}
	defer rows.Close()

	var tags []map[string]interface{}
	for rows.Next() {
		var id, name, slug string
		var description, iconName sql.NullString
		var postCount int
		var createdAt interface{}

		err := rows.Scan(&id, &name, &slug, &description, &iconName, &postCount, &createdAt)
		if err != nil {
			continue
		}

		tags = append(tags, map[string]interface{}{
			"id":          id,
			"name":        name,
			"slug":        slug,
			"description": fromNullString(description),
			"icon_name":   fromNullString(iconName),
			"post_count":  postCount,
			"created_at":  createdAt,
		})
	}

	return c.JSON(tags)
}

// GET /api/tags/:slug - Get tag by slug with posts
func getTagBySlug(c *fiber.Ctx) error {
	slug := c.Params("slug")

	// Get tag info
	var id, name, tagSlug string
	var description, iconName sql.NullString
	var postCount int
	var createdAt interface{}

	err := db.QueryRow(`
		SELECT id, name, slug, description, icon_name, post_count, created_at
		FROM tags
		WHERE slug = $1
	`, slug).Scan(&id, &name, &tagSlug, &description, &iconName, &postCount, &createdAt)

	if err == sql.ErrNoRows {
		return c.Status(404).JSON(fiber.Map{"error": "Tag not found"})
	}
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch tag"})
	}

	tag := map[string]interface{}{
		"id":          id,
		"name":        name,
		"slug":        tagSlug,
		"description": fromNullString(description),
		"icon_name":   fromNullString(iconName),
		"post_count":  postCount,
		"created_at":  createdAt,
	}

	// Get posts with this tag
	postsQuery := `
		SELECT
			p.id, p.title, p.slug, p.description, p.thumbnail_url,
			p.upvote_count, p.downvote_count, p.comment_count,
			p.published_at, p.featured,
			-- Get creators
			COALESCE(
				(SELECT json_agg(json_build_object('name', c.name, 'slug', c.slug, 'verified', c.verified))
				FROM post_creators pc JOIN creators c ON pc.creator_id = c.id
				WHERE pc.post_id = p.id), '[]'
			) as creators
		FROM posts p
		JOIN post_tags pt ON p.id = pt.post_id
		WHERE pt.tag_id = $1 AND p.status = 'published'
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
			var creatorsJSON string

			postsRows.Scan(
				&postID, &title, &postSlug, &description, &thumbnailURL,
				&upvotes, &downvotes, &comments, &publishedAt, &featured,
				&creatorsJSON,
			)

			var creators []interface{}
			json.Unmarshal([]byte(creatorsJSON), &creators)

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
				"creators":       creators,
			})
		}

		tag["posts"] = posts
	}

	return c.JSON(tag)
}

// GET /api/tags/trending - Get trending tags
func getTrendingTags(c *fiber.Ctx) error {
	limit := c.QueryInt("limit", 10)

	query := `
		SELECT
			t.id, t.name, t.slug, t.icon_name, t.post_count,
			COUNT(pt.post_id) as recent_posts
		FROM tags t
		LEFT JOIN post_tags pt ON t.id = pt.tag_id
		LEFT JOIN posts p ON pt.post_id = p.id AND p.created_at > NOW() - INTERVAL '7 days'
		GROUP BY t.id
		ORDER BY recent_posts DESC, t.post_count DESC
		LIMIT $1
	`

	rows, err := db.Query(query, limit)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch trending tags"})
	}
	defer rows.Close()

	var tags []map[string]interface{}
	for rows.Next() {
		var id, name, slug string
		var iconName sql.NullString
		var postCount, recentPosts int

		rows.Scan(&id, &name, &slug, &iconName, &postCount, &recentPosts)

		tags = append(tags, map[string]interface{}{
			"id":           id,
			"name":         name,
			"slug":         slug,
			"icon_name":    fromNullString(iconName),
			"post_count":   postCount,
			"recent_posts": recentPosts,
		})
	}

	return c.JSON(tags)
}
