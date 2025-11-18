package main

import (
	"database/sql"
	"os"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type RegisterRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Username string `json:"username"`
}

type JWTClaims struct {
	UserID string `json:"user_id"` // Changed to string for UUID
	Email  string `json:"email"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

func register(c *fiber.Ctx) error {
	var req RegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// Validate input
	if req.Email == "" || req.Password == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Email and password are required"})
	}

	if req.Username == "" {
		req.Username = strings.Split(req.Email, "@")[0] // Default username from email
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to hash password"})
	}

	// Generate UUID
	userID := uuid.New().String()

	// Start transaction
	tx, err := db.Begin()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Database error"})
	}
	defer tx.Rollback()

	// Insert user
	_, err = tx.Exec(
		`INSERT INTO users (id, email, password_hash, username, role, status)
		VALUES ($1, $2, $3, $4, $5, $6)`,
		userID, req.Email, string(hashedPassword), req.Username, "user", "active",
	)

	if err != nil {
		if strings.Contains(err.Error(), "duplicate") || strings.Contains(err.Error(), "unique") {
			return c.Status(409).JSON(fiber.Map{"error": "Email already exists"})
		}
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create user"})
	}

	// Create user profile
	_, err = tx.Exec(
		`INSERT INTO user_profiles (user_id, display_name) VALUES ($1, $2)`,
		userID, req.Username,
	)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create profile"})
	}

	// Create user preferences (default values)
	_, err = tx.Exec(
		`INSERT INTO user_preferences (user_id, theme, language, email_notifications, push_notifications)
		VALUES ($1, 'dark', 'en', true, false)`,
		userID,
	)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create preferences"})
	}

	// Create user level (starting at level 1)
	_, err = tx.Exec(
		`INSERT INTO user_levels (user_id, level, total_points) VALUES ($1, 1, 0)`,
		userID,
	)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create level"})
	}

	// Create user streak
	_, err = tx.Exec(
		`INSERT INTO streaks (user_id, current_streak, longest_streak, last_activity_date)
		VALUES ($1, 0, 0, CURRENT_DATE)`,
		userID,
	)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create streak"})
	}

	// Commit transaction
	if err = tx.Commit(); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to commit transaction"})
	}

	// Generate JWT token
	token, err := generateToken(userID, req.Email, "user")
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to generate token"})
	}

	return c.Status(201).JSON(fiber.Map{
		"message": "User registered successfully",
		"token":   token,
		"user": fiber.Map{
			"id":       userID,
			"email":    req.Email,
			"username": req.Username,
			"role":     "user",
		},
	})
}

func login(c *fiber.Ctx) error {
	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// Get user from database
	var userID, email, passwordHash, username, role, status string
	err := db.QueryRow(
		`SELECT id, email, password_hash, username, role, status FROM users WHERE email = $1`,
		req.Email,
	).Scan(&userID, &email, &passwordHash, &username, &role, &status)

	if err == sql.ErrNoRows {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid credentials"})
	}
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Database error"})
	}

	// Check if user is active
	if status != "active" {
		return c.Status(403).JSON(fiber.Map{"error": "Account is not active"})
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(req.Password)); err != nil {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid credentials"})
	}

	// Generate JWT token
	token, err := generateToken(userID, email, role)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to generate token"})
	}

	return c.JSON(fiber.Map{
		"message": "Login successful",
		"token":   token,
		"user": fiber.Map{
			"id":       userID,
			"email":    email,
			"username": username,
			"role":     role,
		},
	})
}

func getMe(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)

	query := `
		SELECT
			u.id, u.email, u.username, u.role, u.status, u.created_at,
			up.display_name, up.avatar_url, up.bio, up.website, up.location,
			up.total_upvotes_received, up.total_posts_created,
			ul.level, ul.total_points
		FROM users u
		LEFT JOIN user_profiles up ON u.id = up.user_id
		LEFT JOIN user_levels ul ON u.id = ul.user_id
		WHERE u.id = $1
	`

	var id, email, username, role, status string
	var createdAt time.Time
	var displayName, avatarURL, bio, website, location sql.NullString
	var totalUpvotes, totalPosts, level, totalPoints sql.NullInt64

	err := db.QueryRow(query, userID).Scan(
		&id, &email, &username, &role, &status, &createdAt,
		&displayName, &avatarURL, &bio, &website, &location,
		&totalUpvotes, &totalPosts,
		&level, &totalPoints,
	)

	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "User not found"})
	}

	return c.JSON(fiber.Map{
		"id":         id,
		"email":      email,
		"username":   username,
		"role":       role,
		"status":     status,
		"created_at": createdAt,
		"profile": fiber.Map{
			"display_name":           fromNullString(displayName),
			"avatar_url":             fromNullString(avatarURL),
			"bio":                    fromNullString(bio),
			"website":                fromNullString(website),
			"location":               fromNullString(location),
			"total_upvotes_received": fromNullInt64(totalUpvotes),
			"total_posts_created":    fromNullInt64(totalPosts),
		},
		"level": fiber.Map{
			"level":        fromNullInt64(level),
			"total_points": fromNullInt64(totalPoints),
		},
	})
}

func updateProfile(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)

	var req struct {
		DisplayName *string `json:"display_name"`
		AvatarURL   *string `json:"avatar_url"`
		Bio         *string `json:"bio"`
		Website     *string `json:"website"`
		Location    *string `json:"location"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	_, err := db.Exec(
		`UPDATE user_profiles
		SET display_name = COALESCE($1, display_name),
			avatar_url = COALESCE($2, avatar_url),
			bio = COALESCE($3, bio),
			website = COALESCE($4, website),
			location = COALESCE($5, location),
			updated_at = NOW()
		WHERE user_id = $6`,
		req.DisplayName, req.AvatarURL, req.Bio, req.Website, req.Location, userID,
	)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update profile"})
	}

	return c.JSON(fiber.Map{
		"message": "Profile updated successfully",
	})
}

func generateToken(userID, email, role string) (string, error) {
	claims := JWTClaims{
		UserID: userID,
		Email:  email,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour * 7)), // 7 days
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "your-secret-key-change-in-production" // Fallback for dev
	}

	return token.SignedString([]byte(jwtSecret))
}

func authMiddleware(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return c.Status(401).JSON(fiber.Map{"error": "Missing authorization header"})
	}

	// Extract token from "Bearer <token>"
	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid authorization header"})
	}

	tokenString := parts[1]

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "your-secret-key-change-in-production"
	}

	// Parse and validate token
	token, err := jwt.ParseWithClaims(tokenString, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(jwtSecret), nil
	})

	if err != nil || !token.Valid {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid or expired token"})
	}

	claims, ok := token.Claims.(*JWTClaims)
	if !ok {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid token claims"})
	}

	// Store user ID in context (new handlers expect userID string)
	c.Locals("userID", claims.UserID)
	c.Locals("user", claims) // Keep for backward compatibility
	return c.Next()
}

func adminMiddleware(c *fiber.Ctx) error {
	user := c.Locals("user").(*JWTClaims)
	if user.Role != "admin" {
		return c.Status(403).JSON(fiber.Map{"error": "Admin access required"})
	}
	return c.Next()
}

// Helper function for nullable int64
func fromNullInt64(ni sql.NullInt64) *int {
	if !ni.Valid {
		return nil
	}
	val := int(ni.Int64)
	return &val
}
