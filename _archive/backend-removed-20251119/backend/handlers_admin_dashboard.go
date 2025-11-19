package main

import (
	"database/sql"
	"time"

	"github.com/gofiber/fiber/v2"
)

// DashboardStats represents the overview statistics for the dashboard
type DashboardStats struct {
	TotalUsers  int `json:"totalUsers"`
	TotalPosts  int `json:"totalPosts"`
	TotalViews  int `json:"totalViews"`
	ActiveUsers int `json:"activeUsers"`
}

// RecentActivity represents recent posts and users
type RecentActivity struct {
	Posts []AdminPost `json:"posts"`
	Users []AdminUser `json:"users"`
}

// GetDashboardStats returns overview statistics for the admin dashboard
func GetDashboardStats(c *fiber.Ctx) error {
	var stats DashboardStats

	// Get total users
	err := db.QueryRow("SELECT COUNT(*) FROM users").Scan(&stats.TotalUsers)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch user count",
		})
	}

	// Get total posts
	err = db.QueryRow("SELECT COUNT(*) FROM posts").Scan(&stats.TotalPosts)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch post count",
		})
	}

	// Get total views
	err = db.QueryRow("SELECT COALESCE(SUM(view_count), 0) FROM posts").Scan(&stats.TotalViews)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch total views",
		})
	}

	// Get active users (users who logged in within the last 7 days)
	sevenDaysAgo := time.Now().AddDate(0, 0, -7)
	err = db.QueryRow(`
		SELECT COUNT(*)
		FROM users
		WHERE last_login_at > $1
	`, sevenDaysAgo).Scan(&stats.ActiveUsers)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch active users",
		})
	}

	return c.JSON(stats)
}

// GetRecentActivity returns recent posts and users for the dashboard
func GetRecentActivity(c *fiber.Ctx) error {
	var activity RecentActivity

	// Get 5 most recent posts
	postsQuery := `
		SELECT id, title, slug, type, status, view_count, thumbnail_url,
		       published_at, created_at, updated_at
		FROM posts
		ORDER BY created_at DESC
		LIMIT 5
	`
	rows, err := db.Query(postsQuery)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch recent posts",
		})
	}
	defer rows.Close()

	activity.Posts = []AdminPost{}
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

		activity.Posts = append(activity.Posts, post)
	}

	// Get 5 most recent users with profile data
	usersQuery := `
		SELECT u.id, u.username, u.email,
		       COALESCE(up.display_name, '') as display_name,
		       COALESCE(up.avatar_url, '') as avatar_url,
		       u.role, u.status, u.created_at
		FROM users u
		LEFT JOIN user_profiles up ON u.id = up.user_id
		ORDER BY u.created_at DESC
		LIMIT 5
	`
	rows, err = db.Query(usersQuery)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch recent users",
		})
	}
	defer rows.Close()

	activity.Users = []AdminUser{}
	for rows.Next() {
		var user AdminUser

		err := rows.Scan(
			&user.ID, &user.Username, &user.Email, &user.DisplayName,
			&user.AvatarURL, &user.Role, &user.Status, &user.CreatedAt,
		)
		if err != nil {
			continue
		}

		activity.Users = append(activity.Users, user)
	}

	return c.JSON(activity)
}
