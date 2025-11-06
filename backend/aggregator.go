package main

import (
	"context"
	"crypto/md5"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/lib/pq"
	"github.com/mmcdole/gofeed"
)

// Source represents an RSS feed source
type Source struct {
	ID            int        `json:"id"`
	Name          string     `json:"name"`
	URL           string     `json:"url"`
	Type          string     `json:"type"`
	Category      string     `json:"category"`
	Active        bool       `json:"active"`
	FetchInterval int        `json:"fetch_interval"`
	LastFetchedAt *time.Time `json:"last_fetched_at"`
	CreatedAt     time.Time  `json:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at"`
}

// Aggregator handles RSS feed fetching
type Aggregator struct {
	parser *gofeed.Parser
}

// NewAggregator creates a new aggregator instance
func NewAggregator() *Aggregator {
	return &Aggregator{
		parser: gofeed.NewParser(),
	}
}

// Start begins the aggregation service
func (a *Aggregator) Start() {
	log.Println("🚀 Starting Content Aggregator...")

	// Initial fetch
	a.FetchAll()

	// Run every 30 minutes
	ticker := time.NewTicker(30 * time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		a.FetchAll()
	}
}

// FetchAll fetches content from all active sources
func (a *Aggregator) FetchAll() {
	log.Println("📡 Fetching content from all sources...")

	sources, err := a.getActiveSources()
	if err != nil {
		log.Printf("❌ Error getting sources: %v", err)
		return
	}

	if len(sources) == 0 {
		log.Println("⚠️  No active sources found. Run 'go run . --seed-sources' to add sources.")
		return
	}

	successCount := 0
	totalNewPosts := 0

	for _, source := range sources {
		newPosts, err := a.FetchSource(source)
		if err != nil {
			log.Printf("❌ Error fetching %s: %v", source.Name, err)
			continue
		}
		successCount++
		totalNewPosts += newPosts
	}

	log.Printf("✅ Fetch complete: %d/%d sources successful, %d new posts",
		successCount, len(sources), totalNewPosts)
}

// getActiveSources retrieves all active sources from database
func (a *Aggregator) getActiveSources() ([]Source, error) {
	rows, err := db.Query(`
		SELECT id, name, url, type, category, active, fetch_interval, last_fetched_at, created_at, updated_at
		FROM sources
		WHERE active = true
		ORDER BY id
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var sources []Source
	for rows.Next() {
		var s Source
		err := rows.Scan(&s.ID, &s.Name, &s.URL, &s.Type, &s.Category, &s.Active,
			&s.FetchInterval, &s.LastFetchedAt, &s.CreatedAt, &s.UpdatedAt)
		if err != nil {
			return nil, err
		}
		sources = append(sources, s)
	}

	return sources, nil
}

// FetchSource fetches content from a single source
func (a *Aggregator) FetchSource(source Source) (int, error) {
	log.Printf("📥 Fetching: %s (%s)", source.Name, source.URL)

	// Create context with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// Parse feed
	feed, err := a.parser.ParseURLWithContext(source.URL, ctx)
	if err != nil {
		return 0, err
	}

	newPostsCount := 0

	// Process each item
	for _, item := range feed.Items {
		if a.createPostFromFeedItem(source, item) {
			newPostsCount++
		}
	}

	// Update last_fetched_at
	_, err = db.Exec(`
		UPDATE sources
		SET last_fetched_at = $1, updated_at = $2
		WHERE id = $3
	`, time.Now(), time.Now(), source.ID)

	if err != nil {
		log.Printf("⚠️  Warning: Could not update last_fetched_at for %s", source.Name)
	}

	log.Printf("✅ %s: %d new posts", source.Name, newPostsCount)
	return newPostsCount, nil
}

// createPostFromFeedItem creates a post from an RSS feed item
func (a *Aggregator) createPostFromFeedItem(source Source, item *gofeed.Item) bool {
	// Check if post already exists by external URL
	var existingID string
	err := db.QueryRow("SELECT id FROM posts WHERE external_url = $1", item.Link).Scan(&existingID)
	if err == nil {
		// Post already exists
		return false
	}

	// Generate unique ID from URL
	postID := generateIDFromURL(item.Link)

	// Extract tags from categories
	tags := []string{}
	for _, cat := range item.Categories {
		tag := strings.ToLower(strings.TrimSpace(cat))
		if tag != "" && len(tag) < 50 {
			tags = append(tags, tag)
		}
	}

	// Add source category as tag
	if source.Category != "" {
		tags = append(tags, source.Category)
	}

	// Limit tags to 10
	if len(tags) > 10 {
		tags = tags[:10]
	}

	// Get published date
	publishedAt := time.Now()
	if item.PublishedParsed != nil {
		publishedAt = *item.PublishedParsed
	}

	// Get description/excerpt
	excerpt := item.Description
	if len(excerpt) > 500 {
		excerpt = excerpt[:500] + "..."
	}

	// Get content
	content := item.Content
	if content == "" {
		content = item.Description
	}

	// Get image URL
	imageURL := ""
	if item.Image != nil {
		imageURL = item.Image.URL
	} else if len(item.Enclosures) > 0 {
		for _, enc := range item.Enclosures {
			if strings.HasPrefix(enc.Type, "image/") {
				imageURL = enc.URL
				break
			}
		}
	}

	// Estimate read time (simple: ~200 words per minute)
	wordCount := len(strings.Fields(content))
	readTime := fmt.Sprintf("%d min read", max(1, wordCount/200))

	// Insert post
	_, err = db.Exec(`
		INSERT INTO posts (
			id, title, excerpt, content, cover_image,
			source_id, external_url, published_at,
			category, tags, read_time, published,
			upvotes, comments_count, created_at, updated_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
	`,
		postID, item.Title, excerpt, content, imageURL,
		source.ID, item.Link, publishedAt,
		source.Category, pq.Array(tags), readTime, true,
		0, 0, time.Now(), time.Now(),
	)

	if err != nil {
		log.Printf("⚠️  Error saving post '%s': %v", item.Title, err)
		return false
	}

	return true
}

// generateIDFromURL generates a consistent ID from a URL
func generateIDFromURL(url string) string {
	hash := md5.Sum([]byte(url))
	return fmt.Sprintf("rss-%x", hash[:8])
}

// max returns the maximum of two integers
func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}
