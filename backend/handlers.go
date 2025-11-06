package main

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/lib/pq"
)

type Post struct {
	ID             string         `json:"id"`
	Title          string         `json:"title"`
	Excerpt        string         `json:"excerpt"`
	Content        string         `json:"content"`
	CoverImage     string         `json:"cover_image"`
	CreatorID      *string        `json:"creator_id"`
	CreatorName    *string        `json:"creator_name"`
	CreatorAvatar  *string        `json:"creator_avatar"`
	SourceID       *int           `json:"source_id"`
	ExternalURL    *string        `json:"external_url"`
	PublishedAt    *time.Time     `json:"published_at"`
	Category       string         `json:"category"`
	Tags           pq.StringArray `json:"tags"`
	Upvotes        int            `json:"upvotes"`
	CommentsCount  int            `json:"comments_count"`
	ReadTime       string         `json:"read_time"`
	Published      bool           `json:"published"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	// Video fields
	ContentType    *string        `json:"content_type"`
	VideoURL       *string        `json:"video_url"`
	VideoThumbnail *string        `json:"video_thumbnail"`
	VideoDuration  *string        `json:"video_duration"`
	VideoPlatform  *string        `json:"video_platform"`
}

type Creator struct {
	ID        string         `json:"id"`
	Name      string         `json:"name"`
	Initials  string         `json:"initials"`
	Avatar    string         `json:"avatar"`
	Banner    string         `json:"banner"`
	Bio       string         `json:"bio"`
	Tags      pq.StringArray `json:"tags"`
	Followers int            `json:"followers"`
	Following int            `json:"following"`
	Similar   pq.StringArray `json:"similar"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
}

type Comment struct {
	ID        int       `json:"id"`
	PostID    string    `json:"post_id"`
	UserID    int       `json:"user_id"`
	Content   string    `json:"content"`
	ParentID  *int      `json:"parent_id,omitempty"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// ============ Posts Handlers ============

func getPosts(c *fiber.Ctx) error {
	rows, err := db.Query(`
		SELECT id, title, excerpt, cover_image, creator_id, creator_name, creator_avatar,
		       source_id, external_url, published_at, category, tags, upvotes,
		       comments_count, read_time, created_at,
		       content_type, video_url, video_thumbnail, video_duration, video_platform
		FROM posts
		WHERE published = true
		ORDER BY created_at DESC
		LIMIT 50
	`)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch posts"})
	}
	defer rows.Close()

	var posts []Post
	for rows.Next() {
		var p Post
		err := rows.Scan(
			&p.ID, &p.Title, &p.Excerpt, &p.CoverImage, &p.CreatorID, &p.CreatorName,
			&p.CreatorAvatar, &p.SourceID, &p.ExternalURL, &p.PublishedAt, &p.Category,
			&p.Tags, &p.Upvotes, &p.CommentsCount, &p.ReadTime, &p.CreatedAt,
			&p.ContentType, &p.VideoURL, &p.VideoThumbnail, &p.VideoDuration, &p.VideoPlatform,
		)
		if err != nil {
			continue
		}
		posts = append(posts, p)
	}

	return c.JSON(posts)
}

func getPost(c *fiber.Ctx) error {
	id := c.Params("id")

	var p Post
	err := db.QueryRow(`
		SELECT id, title, excerpt, content, cover_image, creator_id, creator_name,
		       creator_avatar, category, tags, upvotes, comments_count, read_time,
		       published, created_at, updated_at
		FROM posts WHERE id = $1
	`, id).Scan(
		&p.ID, &p.Title, &p.Excerpt, &p.Content, &p.CoverImage, &p.CreatorID,
		&p.CreatorName, &p.CreatorAvatar, &p.Category, &p.Tags, &p.Upvotes,
		&p.CommentsCount, &p.ReadTime, &p.Published, &p.CreatedAt, &p.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return c.Status(404).JSON(fiber.Map{"error": "Post not found"})
	}
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Database error"})
	}

	return c.JSON(p)
}

// ============ Creators Handlers ============

func getCreators(c *fiber.Ctx) error {
	rows, err := db.Query(`
		SELECT id, name, initials, avatar, banner, bio, tags, followers, following, similar, created_at
		FROM creators
		ORDER BY followers DESC
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
			&cr.Tags, &cr.Followers, &cr.Following, &cr.Similar, &cr.CreatedAt,
		)
		if err != nil {
			continue
		}
		creators = append(creators, cr)
	}

	return c.JSON(creators)
}

func getCreator(c *fiber.Ctx) error {
	id := c.Params("id")

	var cr Creator
	err := db.QueryRow(`
		SELECT id, name, initials, avatar, banner, bio, tags, followers, following, similar, created_at, updated_at
		FROM creators WHERE id = $1
	`, id).Scan(
		&cr.ID, &cr.Name, &cr.Initials, &cr.Avatar, &cr.Banner, &cr.Bio,
		&cr.Tags, &cr.Followers, &cr.Following, &cr.Similar, &cr.CreatedAt, &cr.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return c.Status(404).JSON(fiber.Map{"error": "Creator not found"})
	}
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Database error"})
	}

	return c.JSON(cr)
}

func getCreatorPosts(c *fiber.Ctx) error {
	creatorID := c.Params("id")

	rows, err := db.Query(`
		SELECT id, title, excerpt, cover_image, creator_id, creator_name, creator_avatar,
		       category, tags, upvotes, comments_count, read_time, created_at
		FROM posts
		WHERE creator_id = $1 AND published = true
		ORDER BY created_at DESC
	`, creatorID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch posts"})
	}
	defer rows.Close()

	var posts []Post
	for rows.Next() {
		var p Post
		err := rows.Scan(
			&p.ID, &p.Title, &p.Excerpt, &p.CoverImage, &p.CreatorID, &p.CreatorName,
			&p.CreatorAvatar, &p.Category, &p.Tags, &p.Upvotes, &p.CommentsCount,
			&p.ReadTime, &p.CreatedAt,
		)
		if err != nil {
			continue
		}
		posts = append(posts, p)
	}

	return c.JSON(posts)
}

// ============ User Interaction Handlers ============

func getUserBookmarks(c *fiber.Ctx) error {
	user := c.Locals("user").(*JWTClaims)

	rows, err := db.Query(`
		SELECT post_id FROM bookmarks WHERE user_id = $1
	`, user.UserID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch bookmarks"})
	}
	defer rows.Close()

	bookmarked := make(map[string]bool)
	for rows.Next() {
		var postID string
		if err := rows.Scan(&postID); err != nil {
			continue
		}
		bookmarked[postID] = true
	}

	return c.JSON(bookmarked)
}

func addBookmark(c *fiber.Ctx) error {
	user := c.Locals("user").(*JWTClaims)
	postID := c.Params("postId")

	_, err := db.Exec(`
		INSERT INTO bookmarks (user_id, post_id)
		VALUES ($1, $2)
		ON CONFLICT (user_id, post_id) DO NOTHING
	`, user.UserID, postID)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to add bookmark"})
	}

	return c.JSON(fiber.Map{"success": true, "message": "Bookmark added"})
}

func removeBookmark(c *fiber.Ctx) error {
	user := c.Locals("user").(*JWTClaims)
	postID := c.Params("postId")

	_, err := db.Exec(`
		DELETE FROM bookmarks WHERE user_id = $1 AND post_id = $2
	`, user.UserID, postID)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to remove bookmark"})
	}

	return c.JSON(fiber.Map{"success": true, "message": "Bookmark removed"})
}

func getUserFollowing(c *fiber.Ctx) error {
	user := c.Locals("user").(*JWTClaims)

	rows, err := db.Query(`
		SELECT creator_id FROM following WHERE user_id = $1
	`, user.UserID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch following"})
	}
	defer rows.Close()

	following := make(map[string]bool)
	for rows.Next() {
		var creatorID string
		if err := rows.Scan(&creatorID); err != nil {
			continue
		}
		following[creatorID] = true
	}

	return c.JSON(following)
}

func addFollowing(c *fiber.Ctx) error {
	user := c.Locals("user").(*JWTClaims)
	creatorID := c.Params("creatorId")

	_, err := db.Exec(`
		INSERT INTO following (user_id, creator_id)
		VALUES ($1, $2)
		ON CONFLICT (user_id, creator_id) DO NOTHING
	`, user.UserID, creatorID)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to follow creator"})
	}

	// Update creator followers count
	db.Exec(`UPDATE creators SET followers = followers + 1 WHERE id = $1`, creatorID)

	return c.JSON(fiber.Map{"success": true, "message": "Following creator"})
}

func removeFollowing(c *fiber.Ctx) error {
	user := c.Locals("user").(*JWTClaims)
	creatorID := c.Params("creatorId")

	_, err := db.Exec(`
		DELETE FROM following WHERE user_id = $1 AND creator_id = $2
	`, user.UserID, creatorID)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to unfollow creator"})
	}

	// Update creator followers count
	db.Exec(`UPDATE creators SET followers = GREATEST(0, followers - 1) WHERE id = $1`, creatorID)

	return c.JSON(fiber.Map{"success": true, "message": "Unfollowed creator"})
}

func getUserUpvotes(c *fiber.Ctx) error {
	user := c.Locals("user").(*JWTClaims)

	rows, err := db.Query(`
		SELECT post_id FROM upvotes WHERE user_id = $1
	`, user.UserID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch upvotes"})
	}
	defer rows.Close()

	upvoted := make(map[string]bool)
	for rows.Next() {
		var postID string
		if err := rows.Scan(&postID); err != nil {
			continue
		}
		upvoted[postID] = true
	}

	return c.JSON(upvoted)
}

func addUpvote(c *fiber.Ctx) error {
	user := c.Locals("user").(*JWTClaims)
	postID := c.Params("postId")

	_, err := db.Exec(`
		INSERT INTO upvotes (user_id, post_id)
		VALUES ($1, $2)
		ON CONFLICT (user_id, post_id) DO NOTHING
	`, user.UserID, postID)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to add upvote"})
	}

	// Update post upvotes count
	db.Exec(`UPDATE posts SET upvotes = upvotes + 1 WHERE id = $1`, postID)

	return c.JSON(fiber.Map{"success": true, "message": "Upvote added"})
}

func removeUpvote(c *fiber.Ctx) error {
	user := c.Locals("user").(*JWTClaims)
	postID := c.Params("postId")

	_, err := db.Exec(`
		DELETE FROM upvotes WHERE user_id = $1 AND post_id = $2
	`, user.UserID, postID)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to remove upvote"})
	}

	// Update post upvotes count
	db.Exec(`UPDATE posts SET upvotes = GREATEST(0, upvotes - 1) WHERE id = $1`, postID)

	return c.JSON(fiber.Map{"success": true, "message": "Upvote removed"})
}

// ============ Comments Handlers ============

func getComments(c *fiber.Ctx) error {
	postID := c.Params("id")

	rows, err := db.Query(`
		SELECT id, post_id, user_id, content, parent_id, created_at, updated_at
		FROM comments
		WHERE post_id = $1
		ORDER BY created_at DESC
	`, postID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch comments"})
	}
	defer rows.Close()

	var comments []Comment
	for rows.Next() {
		var cm Comment
		err := rows.Scan(&cm.ID, &cm.PostID, &cm.UserID, &cm.Content, &cm.ParentID, &cm.CreatedAt, &cm.UpdatedAt)
		if err != nil {
			continue
		}
		comments = append(comments, cm)
	}

	return c.JSON(comments)
}

func addComment(c *fiber.Ctx) error {
	user := c.Locals("user").(*JWTClaims)
	postID := c.Params("id")

	var req struct {
		Content  string `json:"content"`
		ParentID *int   `json:"parent_id"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if req.Content == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Content is required"})
	}

	var commentID int
	err := db.QueryRow(`
		INSERT INTO comments (post_id, user_id, content, parent_id)
		VALUES ($1, $2, $3, $4)
		RETURNING id
	`, postID, user.UserID, req.Content, req.ParentID).Scan(&commentID)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to add comment"})
	}

	// Update post comments count
	db.Exec(`UPDATE posts SET comments_count = comments_count + 1 WHERE id = $1`, postID)

	return c.Status(201).JSON(fiber.Map{
		"success": true,
		"message": "Comment added",
		"id":      commentID,
	})
}

// ============ User Post Management ============

func updateUserPost(c *fiber.Ctx) error {
	user := c.Locals("user").(*JWTClaims)
	postID := c.Params("id")

	var req struct {
		Title      string   `json:"title"`
		Excerpt    string   `json:"excerpt"`
		Content    string   `json:"content"`
		CoverImage string   `json:"cover_image"`
		Category   string   `json:"category"`
		Tags       []string `json:"tags"`
		ReadTime   string   `json:"read_time"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// Check if post exists and belongs to user
	var creatorID sql.NullString
	err := db.QueryRow(`SELECT creator_id FROM posts WHERE id = $1`, postID).Scan(&creatorID)
	if err == sql.ErrNoRows {
		return c.Status(404).JSON(fiber.Map{"error": "Post not found"})
	}
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to check post ownership"})
	}

	// Verify ownership (convert user.UserID to string to compare with creator_id VARCHAR)
	if !creatorID.Valid || creatorID.String != fmt.Sprintf("%d", user.UserID) {
		return c.Status(403).JSON(fiber.Map{"error": "You can only edit your own posts"})
	}

	// Update post (user cannot change creator_id)
	result, err := db.Exec(`
		UPDATE posts
		SET title = $1, excerpt = $2, content = $3, cover_image = $4,
		    category = $5, tags = $6, read_time = $7, updated_at = CURRENT_TIMESTAMP
		WHERE id = $8 AND creator_id = $9
	`, req.Title, req.Excerpt, req.Content, req.CoverImage,
		req.Category, pq.Array(req.Tags), req.ReadTime, postID, creatorID.String)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update post"})
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return c.Status(403).JSON(fiber.Map{"error": "You can only edit your own posts"})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Post updated successfully",
	})
}
