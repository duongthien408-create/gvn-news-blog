package main

import (
	"database/sql"
	"encoding/json"

	"github.com/gofiber/fiber/v2"
)

// ============================================
// SQUADS (COMMUNITIES) HANDLERS
// ============================================

// GET /api/squads - Get all squads
func getSquads(c *fiber.Ctx) error {
	typeFilter := c.Query("type", "")
	limit := c.QueryInt("limit", 50)

	query := `
		SELECT
			s.id, s.name, s.slug, s.description,
			s.avatar_url, s.cover_url, s.type,
			s.member_count, s.post_count, s.created_at,
			u.username, up.display_name, up.avatar_url as creator_avatar
		FROM squads s
		JOIN users u ON s.creator_id = u.id
		LEFT JOIN user_profiles up ON u.id = up.user_id
	`

	args := []interface{}{}
	if typeFilter != "" {
		query += ` WHERE s.type = $1`
		args = append(args, typeFilter)
	}

	query += ` ORDER BY s.member_count DESC LIMIT $` + string(rune(len(args)+1))
	args = append(args, limit)

	rows, err := db.Query(query, args...)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch squads"})
	}
	defer rows.Close()

	var squads []map[string]interface{}
	for rows.Next() {
		var id, name, slug, squadType, username string
		var description, avatarURL, coverURL sql.NullString
		var memberCount, postCount int
		var createdAt interface{}
		var displayName, creatorAvatar sql.NullString

		rows.Scan(
			&id, &name, &slug, &description,
			&avatarURL, &coverURL, &squadType,
			&memberCount, &postCount, &createdAt,
			&username, &displayName, &creatorAvatar,
		)

		squads = append(squads, map[string]interface{}{
			"id":           id,
			"name":         name,
			"slug":         slug,
			"description":  fromNullString(description),
			"avatar_url":   fromNullString(avatarURL),
			"cover_url":    fromNullString(coverURL),
			"type":         squadType,
			"member_count": memberCount,
			"post_count":   postCount,
			"created_at":   createdAt,
			"creator": map[string]interface{}{
				"username":     username,
				"display_name": fromNullString(displayName),
				"avatar_url":   fromNullString(creatorAvatar),
			},
		})
	}

	return c.JSON(squads)
}

// GET /api/squads/:slug - Get squad by slug
func getSquadBySlug(c *fiber.Ctx) error {
	slug := c.Params("slug")

	query := `
		SELECT
			s.id, s.name, s.slug, s.description,
			s.avatar_url, s.cover_url, s.type,
			s.creator_id, s.member_count, s.post_count,
			s.created_at, s.updated_at,
			u.username, up.display_name, up.avatar_url as creator_avatar
		FROM squads s
		JOIN users u ON s.creator_id = u.id
		LEFT JOIN user_profiles up ON u.id = up.user_id
		WHERE s.slug = $1
	`

	var id, name, squadSlug, squadType, creatorID, username string
	var description, avatarURL, coverURL sql.NullString
	var memberCount, postCount int
	var createdAt, updatedAt interface{}
	var displayName, creatorAvatar sql.NullString

	err := db.QueryRow(query, slug).Scan(
		&id, &name, &squadSlug, &description,
		&avatarURL, &coverURL, &squadType,
		&creatorID, &memberCount, &postCount,
		&createdAt, &updatedAt,
		&username, &displayName, &creatorAvatar,
	)

	if err == sql.ErrNoRows {
		return c.Status(404).JSON(fiber.Map{"error": "Squad not found"})
	}
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch squad"})
	}

	squad := map[string]interface{}{
		"id":           id,
		"name":         name,
		"slug":         squadSlug,
		"description":  fromNullString(description),
		"avatar_url":   fromNullString(avatarURL),
		"cover_url":    fromNullString(coverURL),
		"type":         squadType,
		"member_count": memberCount,
		"post_count":   postCount,
		"created_at":   createdAt,
		"updated_at":   updatedAt,
		"creator": map[string]interface{}{
			"id":           creatorID,
			"username":     username,
			"display_name": fromNullString(displayName),
			"avatar_url":   fromNullString(creatorAvatar),
		},
	}

	// Get recent posts
	postsQuery := `
		SELECT
			p.id, p.title, p.slug, p.thumbnail_url, p.published_at,
			COALESCE(
				(SELECT json_agg(json_build_object('name', c.name, 'slug', c.slug))
				FROM post_creators pc JOIN creators c ON pc.creator_id = c.id
				WHERE pc.post_id = p.id), '[]'
			) as creators
		FROM posts p
		JOIN squad_posts sp ON p.id = sp.post_id
		WHERE sp.squad_id = $1 AND p.status = 'published'
		ORDER BY sp.created_at DESC
		LIMIT 10
	`

	postsRows, err := db.Query(postsQuery, id)
	if err == nil {
		defer postsRows.Close()

		var posts []map[string]interface{}
		for postsRows.Next() {
			var postID, title, postSlug string
			var thumbnailURL sql.NullString
			var publishedAt interface{}
			var creatorsJSON string

			postsRows.Scan(&postID, &title, &postSlug, &thumbnailURL, &publishedAt, &creatorsJSON)

			var creators []interface{}
			json.Unmarshal([]byte(creatorsJSON), &creators)

			posts = append(posts, map[string]interface{}{
				"id":            postID,
				"title":         title,
				"slug":          postSlug,
				"thumbnail_url": fromNullString(thumbnailURL),
				"published_at":  publishedAt,
				"creators":      creators,
			})
		}

		squad["posts"] = posts
	}

	return c.JSON(squad)
}

// POST /api/squads - Create squad
func createSquad(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)

	var req struct {
		Name        string  `json:"name"`
		Slug        string  `json:"slug"`
		Description *string `json:"description"`
		Type        string  `json:"type"` // public/private
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	if req.Name == "" || req.Slug == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Name and slug are required"})
	}

	var squadID string
	err := db.QueryRow(`
		INSERT INTO squads (name, slug, description, type, creator_id)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id
	`, req.Name, req.Slug, req.Description, req.Type, userID).Scan(&squadID)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create squad"})
	}

	// Auto-add creator as admin
	_, err = db.Exec(`
		INSERT INTO squad_members (squad_id, user_id, role)
		VALUES ($1, $2, 'admin')
	`, squadID, userID)

	return c.JSON(fiber.Map{
		"success":  true,
		"squad_id": squadID,
	})
}

// POST /api/squads/:id/join - Join squad
func joinSquad(c *fiber.Ctx) error {
	squadID := c.Params("id")
	userID := c.Locals("userID").(string)

	// Check if already member
	var exists bool
	db.QueryRow(`
		SELECT EXISTS(SELECT 1 FROM squad_members WHERE squad_id = $1 AND user_id = $2)
	`, squadID, userID).Scan(&exists)

	if exists {
		return c.Status(400).JSON(fiber.Map{"error": "Already a member"})
	}

	_, err := db.Exec(`
		INSERT INTO squad_members (squad_id, user_id, role)
		VALUES ($1, $2, 'member')
	`, squadID, userID)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to join squad"})
	}

	return c.JSON(fiber.Map{"success": true})
}

// POST /api/squads/:id/leave - Leave squad
func leaveSquad(c *fiber.Ctx) error {
	squadID := c.Params("id")
	userID := c.Locals("userID").(string)

	_, err := db.Exec(`
		DELETE FROM squad_members
		WHERE squad_id = $1 AND user_id = $2
	`, squadID, userID)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to leave squad"})
	}

	return c.JSON(fiber.Map{"success": true})
}

// GET /api/squads/:id/members - Get squad members
func getSquadMembers(c *fiber.Ctx) error {
	squadID := c.Params("id")

	query := `
		SELECT
			sm.user_id, sm.role, sm.joined_at,
			u.username,
			up.display_name, up.avatar_url,
			ul.level
		FROM squad_members sm
		JOIN users u ON sm.user_id = u.id
		LEFT JOIN user_profiles up ON u.id = up.user_id
		LEFT JOIN user_levels ul ON u.id = ul.user_id
		WHERE sm.squad_id = $1
		ORDER BY
			CASE sm.role
				WHEN 'admin' THEN 1
				WHEN 'moderator' THEN 2
				ELSE 3
			END,
			sm.joined_at ASC
	`

	rows, err := db.Query(query, squadID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch members"})
	}
	defer rows.Close()

	var members []map[string]interface{}
	for rows.Next() {
		var userID, role, username string
		var joinedAt interface{}
		var displayName, avatarURL sql.NullString
		var level sql.NullInt64

		rows.Scan(&userID, &role, &joinedAt, &username, &displayName, &avatarURL, &level)

		members = append(members, map[string]interface{}{
			"user_id":      userID,
			"username":     username,
			"display_name": fromNullString(displayName),
			"avatar_url":   fromNullString(avatarURL),
			"level":        fromNullInt(level),
			"role":         role,
			"joined_at":    joinedAt,
		})
	}

	return c.JSON(members)
}

// POST /api/squads/:id/posts - Share post to squad
func sharePostToSquad(c *fiber.Ctx) error {
	squadID := c.Params("id")
	userID := c.Locals("userID").(string)

	var req struct {
		PostID string `json:"post_id"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	// Check if user is member
	var isMember bool
	db.QueryRow(`
		SELECT EXISTS(SELECT 1 FROM squad_members WHERE squad_id = $1 AND user_id = $2)
	`, squadID, userID).Scan(&isMember)

	if !isMember {
		return c.Status(403).JSON(fiber.Map{"error": "Must be a member to share posts"})
	}

	_, err := db.Exec(`
		INSERT INTO squad_posts (squad_id, post_id)
		VALUES ($1, $2)
		ON CONFLICT DO NOTHING
	`, squadID, req.PostID)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to share post"})
	}

	return c.JSON(fiber.Map{"success": true})
}
