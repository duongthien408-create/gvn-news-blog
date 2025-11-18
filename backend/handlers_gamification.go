package main

import (
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

// ============================================
// GAMIFICATION HANDLERS
// ============================================

// GET /api/users/:id/level - Get user level and points
func getUserLevel(c *fiber.Ctx) error {
	userID := c.Params("id")

	var level, totalPoints int
	var updatedAt interface{}

	err := db.QueryRow(`
		SELECT level, total_points, updated_at
		FROM user_levels
		WHERE user_id = $1
	`, userID).Scan(&level, &totalPoints, &updatedAt)

	if err == sql.ErrNoRows {
		return c.Status(404).JSON(fiber.Map{"error": "User not found"})
	}
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch level"})
	}

	return c.JSON(fiber.Map{
		"user_id":      userID,
		"level":        level,
		"total_points": totalPoints,
		"updated_at":   updatedAt,
	})
}

// GET /api/users/:id/streak - Get user streak
func getUserStreak(c *fiber.Ctx) error {
	userID := c.Params("id")

	var currentStreak, longestStreak int
	var lastActivityDate sql.NullTime
	var updatedAt interface{}

	err := db.QueryRow(`
		SELECT current_streak, longest_streak, last_activity_date, updated_at
		FROM streaks
		WHERE user_id = $1
	`, userID).Scan(&currentStreak, &longestStreak, &lastActivityDate, &updatedAt)

	if err == sql.ErrNoRows {
		return c.Status(404).JSON(fiber.Map{"error": "User not found"})
	}
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch streak"})
	}

	return c.JSON(fiber.Map{
		"user_id":            userID,
		"current_streak":     currentStreak,
		"longest_streak":     longestStreak,
		"last_activity_date": fromNullTime(lastActivityDate),
		"updated_at":         updatedAt,
	})
}

// GET /api/achievements - Get all achievements
func getAchievements(c *fiber.Ctx) error {
	achType := c.Query("type", "")

	query := `
		SELECT id, name, description, icon_name, points_reward, type, created_at
		FROM achievements
	`

	args := []interface{}{}
	if achType != "" {
		query += ` WHERE type = $1`
		args = append(args, achType)
	}

	query += ` ORDER BY points_reward DESC`

	rows, err := db.Query(query, args...)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch achievements"})
	}
	defer rows.Close()

	var achievements []map[string]interface{}
	for rows.Next() {
		var id, name, achType string
		var description, iconName sql.NullString
		var pointsReward int
		var createdAt interface{}

		rows.Scan(&id, &name, &description, &iconName, &pointsReward, &achType, &createdAt)

		achievements = append(achievements, map[string]interface{}{
			"id":            id,
			"name":          name,
			"description":   fromNullString(description),
			"icon_name":     fromNullString(iconName),
			"points_reward": pointsReward,
			"type":          achType,
			"created_at":    createdAt,
		})
	}

	return c.JSON(achievements)
}

// GET /api/users/:id/achievements - Get user's earned achievements
func getUserAchievements(c *fiber.Ctx) error {
	userID := c.Params("id")

	query := `
		SELECT
			a.id, a.name, a.description, a.icon_name, a.points_reward, a.type,
			ua.earned_at
		FROM user_achievements ua
		JOIN achievements a ON ua.achievement_id = a.id
		WHERE ua.user_id = $1
		ORDER BY ua.earned_at DESC
	`

	rows, err := db.Query(query, userID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch achievements"})
	}
	defer rows.Close()

	var achievements []map[string]interface{}
	for rows.Next() {
		var id, name, achType string
		var description, iconName sql.NullString
		var pointsReward int
		var earnedAt interface{}

		rows.Scan(&id, &name, &description, &iconName, &pointsReward, &achType, &earnedAt)

		achievements = append(achievements, map[string]interface{}{
			"id":            id,
			"name":          name,
			"description":   fromNullString(description),
			"icon_name":     fromNullString(iconName),
			"points_reward": pointsReward,
			"type":          achType,
			"earned_at":     earnedAt,
		})
	}

	return c.JSON(achievements)
}

// POST /api/users/:id/achievements - Award achievement (internal/admin only)
func awardAchievement(c *fiber.Ctx) error {
	userID := c.Params("id")

	var req struct {
		AchievementID string `json:"achievement_id"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	// Check if already earned
	var exists bool
	db.QueryRow(`
		SELECT EXISTS(SELECT 1 FROM user_achievements WHERE user_id = $1 AND achievement_id = $2)
	`, userID, req.AchievementID).Scan(&exists)

	if exists {
		return c.Status(400).JSON(fiber.Map{"error": "Achievement already earned"})
	}

	// Award achievement
	_, err := db.Exec(`
		INSERT INTO user_achievements (user_id, achievement_id)
		VALUES ($1, $2)
	`, userID, req.AchievementID)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to award achievement"})
	}

	// Add points
	var pointsReward int
	db.QueryRow(`SELECT points_reward FROM achievements WHERE id = $1`, req.AchievementID).Scan(&pointsReward)

	addUserPoints(userID, pointsReward, "achievement_earned", &req.AchievementID)

	return c.JSON(fiber.Map{"success": true})
}

// GET /api/users/:id/points/history - Get points history
func getUserPointsHistory(c *fiber.Ctx) error {
	userID := c.Params("id")
	limit := c.QueryInt("limit", 50)

	query := `
		SELECT id, points, action, reference_id, created_at
		FROM user_points
		WHERE user_id = $1
		ORDER BY created_at DESC
		LIMIT $2
	`

	rows, err := db.Query(query, userID, limit)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch points history"})
	}
	defer rows.Close()

	var history []map[string]interface{}
	for rows.Next() {
		var id, action string
		var points int
		var referenceID sql.NullString
		var createdAt interface{}

		rows.Scan(&id, &points, &action, &referenceID, &createdAt)

		history = append(history, map[string]interface{}{
			"id":           id,
			"points":       points,
			"action":       action,
			"reference_id": fromNullString(referenceID),
			"created_at":   createdAt,
		})
	}

	return c.JSON(history)
}

// Helper function: Add points to user (called internally)
func addUserPoints(userID string, points int, action string, referenceID *string) error {
	// Insert points history
	_, err := db.Exec(`
		INSERT INTO user_points (user_id, points, action, reference_id)
		VALUES ($1, $2, $3, $4)
	`, userID, points, action, referenceID)

	if err != nil {
		return err
	}

	// Update user total points and level
	_, err = db.Exec(`
		UPDATE user_levels
		SET total_points = total_points + $1,
		    level = CASE
		        WHEN total_points + $1 >= 1000 THEN (total_points + $1) / 100
		        ELSE level
		    END,
		    updated_at = NOW()
		WHERE user_id = $2
	`, points, userID)

	return err
}

// GET /api/leaderboard - Get top users by points
func getLeaderboard(c *fiber.Ctx) error {
	limit := c.QueryInt("limit", 100)
	timeframe := c.Query("timeframe", "all") // all, week, month

	query := `
		SELECT
			ul.user_id, ul.level, ul.total_points,
			u.username,
			up.display_name, up.avatar_url
		FROM user_levels ul
		JOIN users u ON ul.user_id = u.id
		LEFT JOIN user_profiles up ON u.id = up.user_id
	`

	// Filter by timeframe for recent points
	if timeframe == "week" {
		query += `
			WHERE ul.user_id IN (
				SELECT user_id FROM user_points
				WHERE created_at > NOW() - INTERVAL '7 days'
				GROUP BY user_id
			)
		`
	} else if timeframe == "month" {
		query += `
			WHERE ul.user_id IN (
				SELECT user_id FROM user_points
				WHERE created_at > NOW() - INTERVAL '30 days'
				GROUP BY user_id
			)
		`
	}

	query += ` ORDER BY ul.total_points DESC LIMIT $1`

	rows, err := db.Query(query, limit)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch leaderboard"})
	}
	defer rows.Close()

	var leaderboard []map[string]interface{}
	rank := 1

	for rows.Next() {
		var userID, username string
		var level, totalPoints int
		var displayName, avatarURL sql.NullString

		rows.Scan(&userID, &level, &totalPoints, &username, &displayName, &avatarURL)

		leaderboard = append(leaderboard, map[string]interface{}{
			"rank":         rank,
			"user_id":      userID,
			"username":     username,
			"display_name": fromNullString(displayName),
			"avatar_url":   fromNullString(avatarURL),
			"level":        level,
			"total_points": totalPoints,
		})

		rank++
	}

	return c.JSON(leaderboard)
}

// GET /api/users/:id/stats - Get user stats (comprehensive)
func getUserStats(c *fiber.Ctx) error {
	userID := c.Params("id")

	// Get basic stats
	query := `
		SELECT
			ul.level, ul.total_points,
			s.current_streak, s.longest_streak,
			up.total_upvotes_received, up.total_posts_created,
			(SELECT COUNT(*) FROM user_achievements WHERE user_id = $1) as achievements_count,
			(SELECT COUNT(*) FROM comments WHERE user_id = $1) as comments_count,
			(SELECT COUNT(*) FROM follows WHERE follower_id = $1) as following_count
		FROM user_levels ul
		LEFT JOIN streaks s ON ul.user_id = s.user_id
		LEFT JOIN user_profiles up ON ul.user_id = up.user_id
		WHERE ul.user_id = $1
	`

	var level, totalPoints int
	var currentStreak, longestStreak sql.NullInt64
	var totalUpvotes, totalPosts, achievementsCount, commentsCount, followingCount int

	err := db.QueryRow(query, userID).Scan(
		&level, &totalPoints,
		&currentStreak, &longestStreak,
		&totalUpvotes, &totalPosts,
		&achievementsCount, &commentsCount, &followingCount,
	)

	if err == sql.ErrNoRows {
		return c.Status(404).JSON(fiber.Map{"error": "User not found"})
	}
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch stats"})
	}

	// Get recent achievements
	achQuery := `
		SELECT
			a.name, a.icon_name, ua.earned_at
		FROM user_achievements ua
		JOIN achievements a ON ua.achievement_id = a.id
		WHERE ua.user_id = $1
		ORDER BY ua.earned_at DESC
		LIMIT 5
	`

	achRows, _ := db.Query(achQuery, userID)
	defer achRows.Close()

	var recentAchievements []map[string]interface{}
	for achRows.Next() {
		var name string
		var iconName sql.NullString
		var earnedAt interface{}

		achRows.Scan(&name, &iconName, &earnedAt)

		recentAchievements = append(recentAchievements, map[string]interface{}{
			"name":      name,
			"icon_name": fromNullString(iconName),
			"earned_at": earnedAt,
		})
	}

	return c.JSON(fiber.Map{
		"user_id":              userID,
		"level":                level,
		"total_points":         totalPoints,
		"current_streak":       fromNullInt(currentStreak),
		"longest_streak":       fromNullInt(longestStreak),
		"total_upvotes":        totalUpvotes,
		"total_posts":          totalPosts,
		"achievements_count":   achievementsCount,
		"comments_count":       commentsCount,
		"following_count":      followingCount,
		"recent_achievements":  recentAchievements,
	})
}
