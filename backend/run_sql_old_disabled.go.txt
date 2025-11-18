package main

import (
	"database/sql"
	"log"
	"os"
)

// RunSQLFile chạy SQL file
func RunSQLFile(db *sql.DB, filepath string) error {
	log.Printf("📄 Running SQL file: %s", filepath)

	// Read SQL file
	content, err := os.ReadFile(filepath)
	if err != nil {
		return err
	}

	// Execute SQL
	_, err = db.Exec(string(content))
	if err != nil {
		return err
	}

	log.Println("✅ SQL executed successfully!")
	return nil
}
