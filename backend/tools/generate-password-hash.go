package main

import (
	"fmt"
	"os"

	"golang.org/x/crypto/bcrypt"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage: go run generate-password-hash.go <password>")
		fmt.Println("Example: go run generate-password-hash.go admin123")
		os.Exit(1)
	}

	password := os.Args[1]

	// Generate bcrypt hash
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Printf("Error generating hash: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("Password:", password)
	fmt.Println("Bcrypt Hash:", string(hashedPassword))
	fmt.Println("\nSQL to create admin user:")
	fmt.Printf(`
INSERT INTO users (id, email, password_hash, username, role, status, created_at)
VALUES (
  uuid_generate_v4(),
  'admin@gearvn.com',
  '%s',
  'admin',
  'admin',
  'active',
  NOW()
);
`, string(hashedPassword))
}
