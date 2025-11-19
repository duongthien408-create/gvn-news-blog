package main

import "time"

// AdminUser represents a user with flattened profile data for admin dashboard
type AdminUser struct {
	ID           string     `json:"id"`
	Username     string     `json:"username"`
	Email        string     `json:"email"`
	DisplayName  string     `json:"display_name"`
	AvatarURL    string     `json:"avatar_url"`
	Bio          string     `json:"bio"`
	Role         string     `json:"role"`
	Status       string     `json:"status"`
	Level        int        `json:"level,omitempty"`
	TotalPoints  int        `json:"total_points,omitempty"`
	CurrentStreak int       `json:"current_streak,omitempty"`
	CreatedAt    time.Time  `json:"created_at"`
	LastLoginAt  *time.Time `json:"last_login_at,omitempty"`
}

// AdminPost represents a post with minimal data for admin dashboard
type AdminPost struct {
	ID           string     `json:"id"`
	Title        string     `json:"title"`
	Slug         string     `json:"slug"`
	Content      string     `json:"content,omitempty"`
	Excerpt      string     `json:"excerpt,omitempty"`
	Type         string     `json:"type"`
	Status       string     `json:"status"`
	AuthorID     *string    `json:"author_id,omitempty"`
	ThumbnailURL string     `json:"thumbnail_url"`
	ViewCount    int        `json:"view_count"`
	PublishedAt  *time.Time `json:"published_at,omitempty"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
}
