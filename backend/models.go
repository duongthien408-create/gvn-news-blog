package main

import (
	"database/sql"
	"time"
)

// ============================================
// USERS & AUTHENTICATION
// ============================================

type User struct {
	ID              string     `json:"id"`
	Email           string     `json:"email"`
	PasswordHash    string     `json:"-"` // Don't send to frontend
	Username        string     `json:"username"`
	Role            string     `json:"role"` // user, creator, admin
	Status          string     `json:"status"` // active, banned, pending
	EmailVerifiedAt *time.Time `json:"email_verified_at"`
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at"`

	// Populated via JOIN
	Profile     *UserProfile     `json:"profile,omitempty"`
	Preferences *UserPreferences `json:"preferences,omitempty"`
	Level       *UserLevel       `json:"level,omitempty"`
}

type UserProfile struct {
	UserID                string     `json:"user_id"`
	DisplayName           *string    `json:"display_name"`
	AvatarURL             *string    `json:"avatar_url"`
	Bio                   *string    `json:"bio"`
	Website               *string    `json:"website"`
	Location              *string    `json:"location"`
	TotalUpvotesReceived  int        `json:"total_upvotes_received"`
	TotalPostsCreated     int        `json:"total_posts_created"`
	UpdatedAt             time.Time  `json:"updated_at"`
}

type UserPreferences struct {
	UserID             string    `json:"user_id"`
	Theme              string    `json:"theme"` // dark, light
	Language           string    `json:"language"`
	EmailNotifications bool      `json:"email_notifications"`
	PushNotifications  bool      `json:"push_notifications"`
	UpdatedAt          time.Time `json:"updated_at"`
}

type UserLevel struct {
	UserID      string    `json:"user_id"`
	Level       int       `json:"level"`
	TotalPoints int       `json:"total_points"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// ============================================
// CREATORS
// ============================================

type Creator struct {
	ID            string    `json:"id"`
	Name          string    `json:"name"`
	Slug          string    `json:"slug"`
	AvatarURL     *string   `json:"avatar_url"`
	Bio           *string   `json:"bio"`
	Website       *string   `json:"website"`
	Verified      bool      `json:"verified"`
	TotalFollowers int      `json:"total_followers"`
	TotalPosts    int       `json:"total_posts"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`

	// Populated via JOIN
	Socials []CreatorSocial `json:"socials,omitempty"`
}

type CreatorSocial struct {
	ID            string    `json:"id"`
	CreatorID     string    `json:"creator_id"`
	Platform      string    `json:"platform"` // youtube, facebook, tiktok, instagram, twitter
	URL           string    `json:"url"`
	FollowerCount int       `json:"follower_count"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// ============================================
// SOURCES
// ============================================

type Source struct {
	ID            string     `json:"id"`
	Name          string     `json:"name"`
	URL           string     `json:"url"`
	LogoURL       *string    `json:"logo_url"`
	Type          string     `json:"type"` // rss, api, manual
	Active        bool       `json:"active"`
	LastFetchedAt *time.Time `json:"last_fetched_at"`
	CreatedAt     time.Time  `json:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at"`
}

// ============================================
// POSTS & CONTENT
// ============================================

type Post struct {
	ID               string     `json:"id"`
	SourceID         *string    `json:"source_id"`
	Type             string     `json:"type"` // article, video, review, news
	Title            string     `json:"title"`
	Slug             string     `json:"slug"`
	Description      *string    `json:"description"`
	Content          *string    `json:"content"`
	ExternalURL      *string    `json:"external_url"`
	ThumbnailURL     *string    `json:"thumbnail_url"`
	PublishedAt      *time.Time `json:"published_at"`
	ReadTimeMinutes  *int       `json:"read_time_minutes"`
	WatchTimeMinutes *int       `json:"watch_time_minutes"`
	ViewCount        int        `json:"view_count"`
	UpvoteCount      int        `json:"upvote_count"`
	DownvoteCount    int        `json:"downvote_count"`
	CommentCount     int        `json:"comment_count"`
	BookmarkCount    int        `json:"bookmark_count"`
	Status           string     `json:"status"` // draft, published, archived
	Featured         bool       `json:"featured"`
	CreatedAt        time.Time  `json:"created_at"`
	UpdatedAt        time.Time  `json:"updated_at"`

	// Populated via JOIN
	Creators []Creator `json:"creators,omitempty"`
	Tags     []Tag     `json:"tags,omitempty"`
	Products []Product `json:"products,omitempty"`
	Media    []PostMedia `json:"media,omitempty"`
}

type PostMedia struct {
	ID         string    `json:"id"`
	PostID     string    `json:"post_id"`
	Type       string    `json:"type"` // image, video
	URL        string    `json:"url"`
	Caption    *string   `json:"caption"`
	OrderIndex int       `json:"order_index"`
	CreatedAt  time.Time `json:"created_at"`
}

type PostCreator struct {
	PostID    string    `json:"post_id"`
	CreatorID string    `json:"creator_id"`
	Role      string    `json:"role"` // author, collaborator, guest
	CreatedAt time.Time `json:"created_at"`
}

// ============================================
// TAGS
// ============================================

type Tag struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Slug        string    `json:"slug"`
	Description *string   `json:"description"`
	IconName    *string   `json:"icon_name"`
	PostCount   int       `json:"post_count"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type PostTag struct {
	PostID    string    `json:"post_id"`
	TagID     string    `json:"tag_id"`
	CreatedAt time.Time `json:"created_at"`
}

// ============================================
// PRODUCTS (GEARVN INTEGRATION)
// ============================================

type ProductCategory struct {
	ID        string     `json:"id"`
	Name      string     `json:"name"`
	Slug      string     `json:"slug"`
	ParentID  *string    `json:"parent_id"`
	CreatedAt time.Time  `json:"created_at"`
}

type Brand struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Slug      string    `json:"slug"`
	LogoURL   *string   `json:"logo_url"`
	CreatedAt time.Time `json:"created_at"`
}

type Product struct {
	ID         string     `json:"id"`
	CategoryID *string    `json:"category_id"`
	BrandID    *string    `json:"brand_id"`
	Name       string     `json:"name"`
	Slug       string     `json:"slug"`
	SKU        *string    `json:"sku"`
	Price      *float64   `json:"price"`
	ImageURL   *string    `json:"image_url"`
	GearvnURL  *string    `json:"gearvn_url"`
	Status     string     `json:"status"` // available, out_of_stock, discontinued
	CreatedAt  time.Time  `json:"created_at"`
	UpdatedAt  time.Time  `json:"updated_at"`

	// Populated via JOIN
	Category *ProductCategory `json:"category,omitempty"`
	Brand    *Brand           `json:"brand,omitempty"`
}

type PostProduct struct {
	PostID       string    `json:"post_id"`
	ProductID    string    `json:"product_id"`
	MentionType  string    `json:"mention_type"` // review, comparison, mention
	AffiliateLink *string  `json:"affiliate_link"`
	CreatedAt    time.Time `json:"created_at"`
}

// ============================================
// ENGAGEMENT
// ============================================

type Vote struct {
	UserID    string    `json:"user_id"`
	PostID    string    `json:"post_id"`
	VoteType  int       `json:"vote_type"` // 1 = upvote, -1 = downvote
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Comment struct {
	ID            string    `json:"id"`
	PostID        string    `json:"post_id"`
	UserID        string    `json:"user_id"`
	ParentID      *string   `json:"parent_id"`
	Content       string    `json:"content"`
	UpvoteCount   int       `json:"upvote_count"`
	DownvoteCount int       `json:"downvote_count"`
	Status        string    `json:"status"` // active, deleted, hidden
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`

	// Populated via JOIN
	User     *User      `json:"user,omitempty"`
	Replies  []Comment  `json:"replies,omitempty"`
}

type CommentVote struct {
	UserID    string    `json:"user_id"`
	CommentID string    `json:"comment_id"`
	VoteType  int       `json:"vote_type"` // 1 = upvote, -1 = downvote
	CreatedAt time.Time `json:"created_at"`
}

type Bookmark struct {
	UserID     string    `json:"user_id"`
	PostID     string    `json:"post_id"`
	FolderName *string   `json:"folder_name"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`

	// Populated via JOIN
	Post *Post `json:"post,omitempty"`
}

type View struct {
	ID        string    `json:"id"`
	PostID    string    `json:"post_id"`
	UserID    *string   `json:"user_id"`
	IPAddress *string   `json:"ip_address"`
	UserAgent *string   `json:"user_agent"`
	CreatedAt time.Time `json:"created_at"`
}

// ============================================
// FOLLOWS
// ============================================

type Follow struct {
	ID         string    `json:"id"`
	FollowerID string    `json:"follower_id"`
	FolloweeID *string   `json:"followee_id"` // Following a user
	CreatorID  *string   `json:"creator_id"`  // Following a creator
	CreatedAt  time.Time `json:"created_at"`

	// Populated via JOIN
	Followee *User    `json:"followee,omitempty"`
	Creator  *Creator `json:"creator,omitempty"`
}

// ============================================
// SQUADS (COMMUNITIES)
// ============================================

type Squad struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Slug        string    `json:"slug"`
	Description *string   `json:"description"`
	AvatarURL   *string   `json:"avatar_url"`
	CoverURL    *string   `json:"cover_url"`
	Type        string    `json:"type"` // public, private
	CreatorID   string    `json:"creator_id"`
	MemberCount int       `json:"member_count"`
	PostCount   int       `json:"post_count"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`

	// Populated via JOIN
	Creator *User         `json:"creator,omitempty"`
	Members []SquadMember `json:"members,omitempty"`
}

type SquadMember struct {
	SquadID   string    `json:"squad_id"`
	UserID    string    `json:"user_id"`
	Role      string    `json:"role"` // admin, moderator, member
	JoinedAt  time.Time `json:"joined_at"`
	UpdatedAt time.Time `json:"updated_at"`

	// Populated via JOIN
	User *User `json:"user,omitempty"`
}

type SquadPost struct {
	SquadID   string    `json:"squad_id"`
	PostID    string    `json:"post_id"`
	CreatedAt time.Time `json:"created_at"`
}

// ============================================
// GAMIFICATION
// ============================================

type Streak struct {
	UserID           string     `json:"user_id"`
	CurrentStreak    int        `json:"current_streak"`
	LongestStreak    int        `json:"longest_streak"`
	LastActivityDate *time.Time `json:"last_activity_date"`
	UpdatedAt        time.Time  `json:"updated_at"`
}

type Achievement struct {
	ID           string    `json:"id"`
	Name         string    `json:"name"`
	Description  *string   `json:"description"`
	IconName     *string   `json:"icon_name"`
	PointsReward int       `json:"points_reward"`
	Type         string    `json:"type"` // streak, engagement, contribution
	CreatedAt    time.Time `json:"created_at"`
}

type UserAchievement struct {
	UserID        string    `json:"user_id"`
	AchievementID string    `json:"achievement_id"`
	EarnedAt      time.Time `json:"earned_at"`

	// Populated via JOIN
	Achievement *Achievement `json:"achievement,omitempty"`
}

type UserPoint struct {
	ID          string    `json:"id"`
	UserID      string    `json:"user_id"`
	Points      int       `json:"points"`
	Action      string    `json:"action"`
	ReferenceID *string   `json:"reference_id"`
	CreatedAt   time.Time `json:"created_at"`
}

// ============================================
// NOTIFICATIONS
// ============================================

type Notification struct {
	ID            string    `json:"id"`
	UserID        string    `json:"user_id"`
	Type          string    `json:"type"` // comment, upvote, follow, mention, squad_invite
	Title         string    `json:"title"`
	Message       *string   `json:"message"`
	ReferenceType *string   `json:"reference_type"`
	ReferenceID   *string   `json:"reference_id"`
	Read          bool      `json:"read"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// ============================================
// DATABASE HELPER FUNCTIONS
// ============================================

// NullString helper
func toNullString(s *string) sql.NullString {
	if s == nil {
		return sql.NullString{Valid: false}
	}
	return sql.NullString{String: *s, Valid: true}
}

func fromNullString(ns sql.NullString) *string {
	if !ns.Valid {
		return nil
	}
	return &ns.String
}

// NullInt helper
func toNullInt(i *int) sql.NullInt64 {
	if i == nil {
		return sql.NullInt64{Valid: false}
	}
	return sql.NullInt64{Int64: int64(*i), Valid: true}
}

func fromNullInt(ni sql.NullInt64) *int {
	if !ni.Valid {
		return nil
	}
	val := int(ni.Int64)
	return &val
}

// NullTime helper
func toNullTime(t *time.Time) sql.NullTime {
	if t == nil {
		return sql.NullTime{Valid: false}
	}
	return sql.NullTime{Time: *t, Valid: true}
}

func fromNullTime(nt sql.NullTime) *time.Time {
	if !nt.Valid {
		return nil
	}
	return &nt.Time
}
