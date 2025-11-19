package main

import (
	"database/sql"
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v2"
)

// PostsListResponse represents paginated posts response
type PostsListResponse struct {
	Posts []AdminPost `json:"posts"`
	Total int         `json:"total"`
}

// GetAdminPosts returns a list of posts with filters and pagination
func GetAdminPosts(c *fiber.Ctx) error {
	// Parse query parameters
	page, _ := strconv.Atoi(c.Query("page", "1"))
	if page < 1 {
		page = 1
	}
	perPage, _ := strconv.Atoi(c.Query("per_page", "20"))
	if perPage < 1 || perPage > 100 {
		perPage = 20
	}
	offset := (page - 1) * perPage

	status := c.Query("status")
	postType := c.Query("type")
	search := strings.TrimSpace(c.Query("search"))

	// Build WHERE clause
	whereConditions := []string{}
	args := []interface{}{}
	argCount := 1

	if status != "" {
		whereConditions = append(whereConditions, "status = $"+strconv.Itoa(argCount))
		args = append(args, status)
		argCount++
	}

	if postType != "" {
		whereConditions = append(whereConditions, "type = $"+strconv.Itoa(argCount))
		args = append(args, postType)
		argCount++
	}

	if search != "" {
		whereConditions = append(whereConditions, "(title ILIKE $"+strconv.Itoa(argCount)+" OR content ILIKE $"+strconv.Itoa(argCount)+")")
		args = append(args, "%"+search+"%")
		argCount++
	}

	whereClause := ""
	if len(whereConditions) > 0 {
		whereClause = "WHERE " + strings.Join(whereConditions, " AND ")
	}

	// Get total count
	var total int
	countQuery := "SELECT COUNT(*) FROM posts " + whereClause
	err := db.QueryRow(countQuery, args...).Scan(&total)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to count posts",
		})
	}

	// Get posts
	args = append(args, perPage, offset)
	postsQuery := `
		SELECT id, title, slug, type, status, view_count, thumbnail_url,
		       published_at, created_at, updated_at
		FROM posts ` + whereClause + `
		ORDER BY created_at DESC
		LIMIT $` + strconv.Itoa(argCount) + ` OFFSET $` + strconv.Itoa(argCount+1)

	rows, err := db.Query(postsQuery, args...)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch posts",
		})
	}
	defer rows.Close()

	posts := []AdminPost{}
	for rows.Next() {
		var post AdminPost
		var publishedAt sql.NullTime

		err := rows.Scan(
			&post.ID, &post.Title, &post.Slug, &post.Type, &post.Status,
			&post.ViewCount, &post.ThumbnailURL, &publishedAt,
			&post.CreatedAt, &post.UpdatedAt,
		)
		if err != nil {
			continue
		}

		if publishedAt.Valid {
			post.PublishedAt = &publishedAt.Time
		}

		posts = append(posts, post)
	}

	response := PostsListResponse{
		Posts: posts,
		Total: total,
	}

	return c.JSON(response)
}

// GetAdminPost returns a single post by ID
func GetAdminPost(c *fiber.Ctx) error {
	postID := c.Params("id")

	var post AdminPost
	var publishedAt sql.NullTime
	var authorID sql.NullString

	query := `
		SELECT id, title, slug, content, excerpt, type, status, author_id,
		       thumbnail_url, view_count, published_at, created_at, updated_at
		FROM posts
		WHERE id = $1
	`

	err := db.QueryRow(query, postID).Scan(
		&post.ID, &post.Title, &post.Slug, &post.Content, &post.Excerpt,
		&post.Type, &post.Status, &authorID, &post.ThumbnailURL,
		&post.ViewCount, &publishedAt, &post.CreatedAt, &post.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Post not found",
		})
	}

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch post",
		})
	}

	if publishedAt.Valid {
		post.PublishedAt = &publishedAt.Time
	}
	if authorID.Valid {
		post.AuthorID = &authorID.String
	}

	return c.JSON(post)
}

// CreateAdminPost creates a new post
func CreateAdminPost(c *fiber.Ctx) error {
	var post AdminPost
	if err := c.BodyParser(&post); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Validate required fields
	if post.Title == "" || post.Slug == "" || post.Content == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Title, slug, and content are required",
		})
	}

	// Set defaults
	if post.Type == "" {
		post.Type = "article"
	}
	if post.Status == "" {
		post.Status = "draft"
	}

	query := `
		INSERT INTO posts (title, slug, content, excerpt, type, status, author_id, thumbnail_url)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, created_at, updated_at
	`

	err := db.QueryRow(
		query,
		post.Title, post.Slug, post.Content, post.Excerpt,
		post.Type, post.Status, post.AuthorID, post.ThumbnailURL,
	).Scan(&post.ID, &post.CreatedAt, &post.UpdatedAt)

	if err != nil {
		if strings.Contains(err.Error(), "duplicate key") {
			return c.Status(fiber.StatusConflict).JSON(fiber.Map{
				"error": "Post with this slug already exists",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create post",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(post)
}

// UpdateAdminPost updates an existing post
func UpdateAdminPost(c *fiber.Ctx) error {
	postID := c.Params("id")

	var post AdminPost
	if err := c.BodyParser(&post); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	query := `
		UPDATE posts
		SET title = $1, slug = $2, content = $3, excerpt = $4, type = $5,
		    status = $6, thumbnail_url = $7, updated_at = NOW()
		WHERE id = $8
		RETURNING updated_at
	`

	err := db.QueryRow(
		query,
		post.Title, post.Slug, post.Content, post.Excerpt,
		post.Type, post.Status, post.ThumbnailURL, postID,
	).Scan(&post.UpdatedAt)

	if err == sql.ErrNoRows {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Post not found",
		})
	}

	if err != nil {
		if strings.Contains(err.Error(), "duplicate key") {
			return c.Status(fiber.StatusConflict).JSON(fiber.Map{
				"error": "Post with this slug already exists",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update post",
		})
	}

	post.ID = postID
	return c.JSON(post)
}

// DeleteAdminPost deletes a post
func DeleteAdminPost(c *fiber.Ctx) error {
	postID := c.Params("id")

	result, err := db.Exec("DELETE FROM posts WHERE id = $1", postID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete post",
		})
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Post not found",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Post deleted successfully",
	})
}

// BulkDeletePosts deletes multiple posts
func BulkDeletePosts(c *fiber.Ctx) error {
	var request struct {
		IDs []string `json:"ids"`
	}

	if err := c.BodyParser(&request); err != nil || len(request.IDs) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body or empty IDs array",
		})
	}

	// Build placeholders for IN clause
	placeholders := []string{}
	args := []interface{}{}
	for i, id := range request.IDs {
		placeholders = append(placeholders, "$"+strconv.Itoa(i+1))
		args = append(args, id)
	}

	query := "DELETE FROM posts WHERE id IN (" + strings.Join(placeholders, ",") + ")"
	result, err := db.Exec(query, args...)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete posts",
		})
	}

	rowsAffected, _ := result.RowsAffected()
	return c.JSON(fiber.Map{
		"message": "Posts deleted successfully",
		"deleted": rowsAffected,
	})
}
