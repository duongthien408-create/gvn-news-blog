package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

// RunMigration chạy migration để thêm video fields
func RunMigration(db *sql.DB) error {
	log.Println("🔧 Starting migration: Add video fields to posts table...")

	migrations := []string{
		// 1. Add video fields
		`ALTER TABLE posts ADD COLUMN IF NOT EXISTS video_url TEXT`,
		`ALTER TABLE posts ADD COLUMN IF NOT EXISTS video_thumbnail TEXT`,
		`ALTER TABLE posts ADD COLUMN IF NOT EXISTS video_duration VARCHAR(20)`,
		`ALTER TABLE posts ADD COLUMN IF NOT EXISTS video_platform VARCHAR(50) DEFAULT 'youtube'`,
		`ALTER TABLE posts ADD COLUMN IF NOT EXISTS transcript TEXT`,
		`ALTER TABLE posts ADD COLUMN IF NOT EXISTS content_type VARCHAR(20) DEFAULT 'article'`,

		// 2. Create indexes
		`CREATE INDEX IF NOT EXISTS idx_posts_content_type ON posts(content_type)`,
		`CREATE INDEX IF NOT EXISTS idx_posts_video_platform ON posts(video_platform)`,
	}

	for i, query := range migrations {
		log.Printf("   Running migration %d/%d...", i+1, len(migrations))
		if _, err := db.Exec(query); err != nil {
			return fmt.Errorf("migration %d failed: %v", i+1, err)
		}
	}

	log.Println("✅ Migration completed successfully!")
	return nil
}

// VerifyMigration kiểm tra xem các cột đã được tạo chưa
func VerifyMigration(db *sql.DB) error {
	log.Println("🔍 Verifying migration...")

	requiredColumns := []string{
		"video_url",
		"video_thumbnail",
		"video_duration",
		"video_platform",
		"transcript",
		"content_type",
	}

	for _, col := range requiredColumns {
		var exists bool
		query := `
			SELECT EXISTS (
				SELECT 1
				FROM information_schema.columns
				WHERE table_name = 'posts' AND column_name = $1
			)
		`
		if err := db.QueryRow(query, col).Scan(&exists); err != nil {
			return fmt.Errorf("failed to check column %s: %v", col, err)
		}

		if !exists {
			return fmt.Errorf("column %s does not exist", col)
		}
		log.Printf("   ✓ Column '%s' exists", col)
	}

	log.Println("✅ All columns verified!")
	return nil
}
