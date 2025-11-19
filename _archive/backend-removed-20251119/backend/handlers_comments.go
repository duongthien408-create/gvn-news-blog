package main

import (
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

// ============================================
// COMMENTS HANDLERS
// ============================================

// GET /api/posts/:id/comments - Get all comments for a post
func getComments(c *fiber.Ctx) error {
	postID := c.Params("id")

	query := `
		SELECT
			cm.id, cm.post_id, cm.user_id, cm.parent_id, cm.content,
			cm.upvote_count, cm.downvote_count, cm.status,
			cm.created_at, cm.updated_at,
			u.username,
			up.display_name, up.avatar_url,
			ul.level
		FROM comments cm
		JOIN users u ON cm.user_id = u.id
		LEFT JOIN user_profiles up ON u.id = up.user_id
		LEFT JOIN user_levels ul ON u.id = ul.user_id
		WHERE cm.post_id = $1 AND cm.status = 'active'
		ORDER BY cm.created_at ASC
	`

	rows, err := db.Query(query, postID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch comments"})
	}
	defer rows.Close()

	var comments []map[string]interface{}
	for rows.Next() {
		var id, postID, userID, content, username string
		var parentID sql.NullString
		var upvotes, downvotes int
		var status string
		var createdAt, updatedAt interface{}
		var displayName, avatarURL sql.NullString
		var level sql.NullInt64

		err := rows.Scan(
			&id, &postID, &userID, &parentID, &content,
			&upvotes, &downvotes, &status,
			&createdAt, &updatedAt,
			&username, &displayName, &avatarURL, &level,
		)
		if err != nil {
			continue
		}

		comment := map[string]interface{}{
			"id":             id,
			"post_id":        postID,
			"user_id":        userID,
			"parent_id":      fromNullString(parentID),
			"content":        content,
			"upvote_count":   upvotes,
			"downvote_count": downvotes,
			"status":         status,
			"created_at":     createdAt,
			"updated_at":     updatedAt,
			"user": map[string]interface{}{
				"username":     username,
				"display_name": fromNullString(displayName),
				"avatar_url":   fromNullString(avatarURL),
				"level":        fromNullInt(level),
			},
		}

		comments = append(comments, comment)
	}

	// Build threaded structure
	threaded := buildCommentTree(comments)

	return c.JSON(threaded)
}

// Helper: Build comment tree
func buildCommentTree(comments []map[string]interface{}) []map[string]interface{} {
	commentMap := make(map[string]map[string]interface{})
	var rootComments []map[string]interface{}

	// First pass: index all comments
	for _, comment := range comments {
		id := comment["id"].(string)
		comment["replies"] = []map[string]interface{}{}
		commentMap[id] = comment
	}

	// Second pass: build tree
	for _, comment := range comments {
		parentID := comment["parent_id"]
		if parentID == nil {
			rootComments = append(rootComments, comment)
		} else {
			parent := commentMap[parentID.(string)]
			if parent != nil {
				replies := parent["replies"].([]map[string]interface{})
				parent["replies"] = append(replies, comment)
			}
		}
	}

	return rootComments
}

// POST /api/posts/:id/comments - Create comment
func createComment(c *fiber.Ctx) error {
	postID := c.Params("id")
	userID := c.Locals("userID").(string)

	var req struct {
		Content  string  `json:"content"`
		ParentID *string `json:"parent_id"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	if req.Content == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Content is required"})
	}

	var commentID string
	err := db.QueryRow(`
		INSERT INTO comments (post_id, user_id, parent_id, content)
		VALUES ($1, $2, $3, $4)
		RETURNING id
	`, postID, userID, req.ParentID, req.Content).Scan(&commentID)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create comment"})
	}

	// Award points (async)
	go addUserPoints(userID, 2, "comment_posted", &commentID)

	return c.JSON(fiber.Map{
		"success":    true,
		"comment_id": commentID,
	})
}

// POST /api/comments/:id/vote - Vote on comment
func voteComment(c *fiber.Ctx) error {
	commentID := c.Params("id")
	userID := c.Locals("userID").(string)

	var req struct {
		VoteType int `json:"vote_type"` // 1 or -1
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	if req.VoteType != 1 && req.VoteType != -1 {
		return c.Status(400).JSON(fiber.Map{"error": "vote_type must be 1 or -1"})
	}

	// Check existing vote
	var existingVoteType int
	err := db.QueryRow(`
		SELECT vote_type FROM comment_votes
		WHERE user_id = $1 AND comment_id = $2
	`, userID, commentID).Scan(&existingVoteType)

	if err == sql.ErrNoRows {
		// Insert new vote
		_, err = db.Exec(`
			INSERT INTO comment_votes (user_id, comment_id, vote_type)
			VALUES ($1, $2, $3)
		`, userID, commentID, req.VoteType)

		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to vote"})
		}

		return c.JSON(fiber.Map{"success": true, "action": "voted"})
	}

	// Existing vote
	if existingVoteType == req.VoteType {
		// Remove vote
		_, err = db.Exec(`
			DELETE FROM comment_votes
			WHERE user_id = $1 AND comment_id = $2
		`, userID, commentID)

		return c.JSON(fiber.Map{"success": true, "action": "unvoted"})
	}

	// Update vote
	_, err = db.Exec(`
		UPDATE comment_votes SET vote_type = $1
		WHERE user_id = $2 AND comment_id = $3
	`, req.VoteType, userID, commentID)

	return c.JSON(fiber.Map{"success": true, "action": "changed"})
}

// DELETE /api/comments/:id - Delete comment
func deleteComment(c *fiber.Ctx) error {
	commentID := c.Params("id")
	userID := c.Locals("userID").(string)

	// Check ownership
	var ownerID string
	err := db.QueryRow(`
		SELECT user_id FROM comments WHERE id = $1
	`, commentID).Scan(&ownerID)

	if err == sql.ErrNoRows {
		return c.Status(404).JSON(fiber.Map{"error": "Comment not found"})
	}

	if ownerID != userID {
		return c.Status(403).JSON(fiber.Map{"error": "Unauthorized"})
	}

	// Soft delete
	_, err = db.Exec(`
		UPDATE comments SET status = 'deleted', content = '[deleted]'
		WHERE id = $1
	`, commentID)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to delete comment"})
	}

	return c.JSON(fiber.Map{"success": true})
}

// PUT /api/comments/:id - Update comment
func updateComment(c *fiber.Ctx) error {
	commentID := c.Params("id")
	userID := c.Locals("userID").(string)

	var req struct {
		Content string `json:"content"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	// Check ownership
	var ownerID string
	err := db.QueryRow(`
		SELECT user_id FROM comments WHERE id = $1
	`, commentID).Scan(&ownerID)

	if err == sql.ErrNoRows {
		return c.Status(404).JSON(fiber.Map{"error": "Comment not found"})
	}

	if ownerID != userID {
		return c.Status(403).JSON(fiber.Map{"error": "Unauthorized"})
	}

	// Update
	_, err = db.Exec(`
		UPDATE comments SET content = $1, updated_at = NOW()
		WHERE id = $2
	`, req.Content, commentID)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update comment"})
	}

	return c.JSON(fiber.Map{"success": true})
}
