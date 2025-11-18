package main

import (
	"database/sql"
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v2"
)

// UsersListResponse represents paginated users response
type UsersListResponse struct {
	Users []AdminUser `json:"users"`
	Total int         `json:"total"`
}

// GetAdminUsers returns a list of users with filters and pagination
func GetAdminUsers(c *fiber.Ctx) error {
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

	role := c.Query("role")
	status := c.Query("status")
	search := strings.TrimSpace(c.Query("search"))

	// Build WHERE clause
	whereConditions := []string{}
	args := []interface{}{}
	argCount := 1

	if role != "" {
		whereConditions = append(whereConditions, "u.role = $"+strconv.Itoa(argCount))
		args = append(args, role)
		argCount++
	}

	if status != "" {
		whereConditions = append(whereConditions, "u.status = $"+strconv.Itoa(argCount))
		args = append(args, status)
		argCount++
	}

	if search != "" {
		whereConditions = append(whereConditions, "(u.username ILIKE $"+strconv.Itoa(argCount)+" OR u.email ILIKE $"+strconv.Itoa(argCount)+" OR up.display_name ILIKE $"+strconv.Itoa(argCount)+")")
		args = append(args, "%"+search+"%")
		argCount++
	}

	whereClause := ""
	if len(whereConditions) > 0 {
		whereClause = "WHERE " + strings.Join(whereConditions, " AND ")
	}

	// Get total count
	var total int
	countQuery := "SELECT COUNT(*) FROM users u LEFT JOIN user_profiles up ON u.id = up.user_id " + whereClause
	err := db.QueryRow(countQuery, args...).Scan(&total)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to count users",
		})
	}

	// Get users with level info
	args = append(args, perPage, offset)
	usersQuery := `
		SELECT u.id, u.username, u.email,
		       COALESCE(up.display_name, '') as display_name,
		       COALESCE(up.avatar_url, '') as avatar_url,
		       u.role, u.status, u.created_at,
		       COALESCE(ul.level, 1) as level,
		       COALESCE(ul.total_points, 0) as total_points,
		       COALESCE(ul.current_streak, 0) as current_streak
		FROM users u
		LEFT JOIN user_profiles up ON u.id = up.user_id
		LEFT JOIN user_levels ul ON u.id = ul.user_id
		` + whereClause + `
		ORDER BY u.created_at DESC
		LIMIT $` + strconv.Itoa(argCount) + ` OFFSET $` + strconv.Itoa(argCount+1)

	rows, err := db.Query(usersQuery, args...)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch users",
		})
	}
	defer rows.Close()

	users := []AdminUser{}
	for rows.Next() {
		var user AdminUser

		err := rows.Scan(
			&user.ID, &user.Username, &user.Email, &user.DisplayName,
			&user.AvatarURL, &user.Role, &user.Status, &user.CreatedAt,
			&user.Level, &user.TotalPoints, &user.CurrentStreak,
		)
		if err != nil {
			continue
		}

		users = append(users, user)
	}

	response := UsersListResponse{
		Users: users,
		Total: total,
	}

	return c.JSON(response)
}

// GetAdminUser returns a single user by ID with full details
func GetAdminUser(c *fiber.Ctx) error {
	userID := c.Params("id")

	var user AdminUser

	query := `
		SELECT u.id, u.username, u.email,
		       COALESCE(up.display_name, '') as display_name,
		       COALESCE(up.avatar_url, '') as avatar_url,
		       COALESCE(up.bio, '') as bio,
		       u.role, u.status, u.created_at, u.last_login_at,
		       COALESCE(ul.level, 1) as level,
		       COALESCE(ul.total_points, 0) as total_points,
		       COALESCE(ul.current_streak, 0) as current_streak
		FROM users u
		LEFT JOIN user_profiles up ON u.id = up.user_id
		LEFT JOIN user_levels ul ON u.id = ul.user_id
		WHERE u.id = $1
	`

	var lastLoginAt sql.NullTime
	err := db.QueryRow(query, userID).Scan(
		&user.ID, &user.Username, &user.Email, &user.DisplayName,
		&user.AvatarURL, &user.Bio, &user.Role, &user.Status,
		&user.CreatedAt, &lastLoginAt, &user.Level, &user.TotalPoints,
		&user.CurrentStreak,
	)

	if err == sql.ErrNoRows {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch user",
		})
	}

	if lastLoginAt.Valid {
		user.LastLoginAt = &lastLoginAt.Time
	}

	return c.JSON(user)
}

// UpdateAdminUser updates user information
func UpdateAdminUser(c *fiber.Ctx) error {
	userID := c.Params("id")

	var request struct {
		Username    string `json:"username"`
		Email       string `json:"email"`
		DisplayName string `json:"display_name"`
		AvatarURL   string `json:"avatar_url"`
		Bio         string `json:"bio"`
		Status      string `json:"status"`
	}

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Update users table
	_, err := db.Exec(
		`UPDATE users SET username = $1, email = $2, status = $3 WHERE id = $4`,
		request.Username, request.Email, request.Status, userID,
	)

	if err != nil {
		if strings.Contains(err.Error(), "duplicate key") {
			return c.Status(fiber.StatusConflict).JSON(fiber.Map{
				"error": "Username or email already exists",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update user",
		})
	}

	// Update user_profiles table
	_, err = db.Exec(
		`UPDATE user_profiles
		 SET display_name = $1, avatar_url = $2, bio = $3, updated_at = NOW()
		 WHERE user_id = $4`,
		request.DisplayName, request.AvatarURL, request.Bio, userID,
	)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update user profile",
		})
	}

	return c.JSON(fiber.Map{
		"message": "User updated successfully",
	})
}

// DeleteAdminUser deletes a user
func DeleteAdminUser(c *fiber.Ctx) error {
	userID := c.Params("id")

	result, err := db.Exec("DELETE FROM users WHERE id = $1", userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete user",
		})
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	return c.JSON(fiber.Map{
		"message": "User deleted successfully",
	})
}

// BanUser bans a user with a reason
func BanUser(c *fiber.Ctx) error {
	userID := c.Params("id")

	var request struct {
		Reason string `json:"reason"`
	}

	if err := c.BodyParser(&request); err != nil || request.Reason == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Reason is required",
		})
	}

	// Update user status to banned
	result, err := db.Exec(
		"UPDATE users SET status = 'banned' WHERE id = $1",
		userID,
	)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to ban user",
		})
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	// TODO: Store ban reason in a moderation_logs table

	return c.JSON(fiber.Map{
		"message": "User banned successfully",
	})
}

// UnbanUser removes ban from a user
func UnbanUser(c *fiber.Ctx) error {
	userID := c.Params("id")

	result, err := db.Exec(
		"UPDATE users SET status = 'active' WHERE id = $1",
		userID,
	)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to unban user",
		})
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	return c.JSON(fiber.Map{
		"message": "User unbanned successfully",
	})
}

// ChangeUserRole changes a user's role
func ChangeUserRole(c *fiber.Ctx) error {
	userID := c.Params("id")

	var request struct {
		Role string `json:"role"`
	}

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Validate role
	validRoles := map[string]bool{
		"user":      true,
		"moderator": true,
		"admin":     true,
	}

	if !validRoles[request.Role] {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid role. Must be user, moderator, or admin",
		})
	}

	result, err := db.Exec(
		"UPDATE users SET role = $1 WHERE id = $2",
		request.Role, userID,
	)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to change user role",
		})
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	return c.JSON(fiber.Map{
		"message": "User role changed successfully",
	})
}

// GrantAchievement grants an achievement to a user
func GrantAchievement(c *fiber.Ctx) error {
	userID := c.Params("id")

	var request struct {
		AchievementID string `json:"achievement_id"`
	}

	if err := c.BodyParser(&request); err != nil || request.AchievementID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "achievement_id is required",
		})
	}

	// Check if achievement exists
	var achievementExists bool
	err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM achievements WHERE id = $1)", request.AchievementID).Scan(&achievementExists)
	if err != nil || !achievementExists {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Achievement not found",
		})
	}

	// Check if user already has this achievement
	var alreadyHas bool
	err = db.QueryRow(
		"SELECT EXISTS(SELECT 1 FROM user_achievements WHERE user_id = $1 AND achievement_id = $2)",
		userID, request.AchievementID,
	).Scan(&alreadyHas)

	if alreadyHas {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "User already has this achievement",
		})
	}

	// Grant achievement
	_, err = db.Exec(
		"INSERT INTO user_achievements (user_id, achievement_id) VALUES ($1, $2)",
		userID, request.AchievementID,
	)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to grant achievement",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Achievement granted successfully",
	})
}
