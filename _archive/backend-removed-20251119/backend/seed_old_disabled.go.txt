package main

import (
	"log"

	"github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

// SeedDatabase populates the database with sample data
func SeedDatabase() error {
	log.Println("🌱 Seeding database with sample data...")

	// Create admin user
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	_, err := db.Exec(`
		INSERT INTO users (email, password_hash, username, role)
		VALUES ($1, $2, $3, $4)
		ON CONFLICT (email) DO NOTHING
	`, "admin@gearvn.com", string(hashedPassword), "Admin", "admin")

	if err != nil {
		log.Printf("Warning: Could not create admin user: %v\n", err)
	}

	// Seed Creators
	creators := []struct {
		ID       string
		Name     string
		Initials string
		Avatar   string
		Banner   string
		Bio      string
		Tags     []string
		Similar  []string
	}{
		{
			ID:       "gearvn-studio",
			Name:     "GearVN Studio",
			Initials: "GS",
			Avatar:   "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=facearea&w=100&q=80",
			Banner:   "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=2000&q=80",
			Bio:      "Nơi chia sẻ kiến thức về gaming gear, công nghệ và xu hướng gaming mới nhất",
			Tags:     []string{"Gaming", "Tech", "Reviews"},
			Similar:  []string{"ux-planet", "techcrunch"},
		},
		{
			ID:       "ux-planet",
			Name:     "UX Planet",
			Initials: "UP",
			Avatar:   "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&w=100&q=80",
			Banner:   "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=2000&q=80",
			Bio:      "Chuyên về UX/UI Design, Product Design và trải nghiệm người dùng",
			Tags:     []string{"UX", "Design", "Product"},
			Similar:  []string{"gearvn-studio"},
		},
		{
			ID:       "techcrunch",
			Name:     "TechCrunch VN",
			Initials: "TC",
			Avatar:   "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&w=100&q=80",
			Banner:   "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80",
			Bio:      "Tin tức công nghệ, startup và innovation hàng đầu Việt Nam",
			Tags:     []string{"Tech", "Startup", "News"},
			Similar:  []string{"gearvn-studio"},
		},
	}

	for _, c := range creators {
		_, err := db.Exec(`
			INSERT INTO creators (id, name, initials, avatar, banner, bio, tags, followers, following, similar)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
			ON CONFLICT (id) DO NOTHING
		`, c.ID, c.Name, c.Initials, c.Avatar, c.Banner, c.Bio,
			pq.Array(c.Tags), 1250, 420, pq.Array(c.Similar))

		if err != nil {
			log.Printf("Warning: Could not seed creator %s: %v\n", c.ID, err)
		}
	}

	// Seed Posts
	posts := []struct {
		ID            string
		Title         string
		Excerpt       string
		Content       string
		CoverImage    string
		CreatorID     string
		CreatorName   string
		CreatorAvatar string
		Category      string
		Tags          []string
		Upvotes       int
		ReadTime      string
		Published     bool
	}{
		{
			ID:            "ai-gaming-trends",
			Title:         "AI đang thay đổi ngành công nghiệp game như thế nào?",
			Excerpt:       "Khám phá cách trí tuệ nhân tạo đang cách mạng hóa phát triển game, NPC thông minh hơn và trải nghiệm cá nhân hóa.",
			Content:       "Nội dung chi tiết về AI trong gaming...",
			CoverImage:    "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1600&q=80",
			CreatorID:     "gearvn-studio",
			CreatorName:   "GearVN Studio",
			CreatorAvatar: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=facearea&w=100&q=80",
			Category:      "Gaming",
			Tags:          []string{"AI", "Gaming", "Technology"},
			Upvotes:       1245,
			ReadTime:      "8 min",
			Published:     true,
		},
		{
			ID:            "mechanical-keyboard-guide",
			Title:         "Hướng dẫn chọn bàn phím cơ cho game thủ",
			Excerpt:       "Tìm hiểu về các loại switch, keycaps và những yếu tố quan trọng khi chọn bàn phím cơ gaming.",
			Content:       "Nội dung chi tiết về bàn phím cơ...",
			CoverImage:    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1600&q=80",
			CreatorID:     "gearvn-studio",
			CreatorName:   "GearVN Studio",
			CreatorAvatar: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=facearea&w=100&q=80",
			Category:      "Hardware",
			Tags:          []string{"Keyboard", "Gaming Gear", "Review"},
			Upvotes:       892,
			ReadTime:      "12 min",
			Published:     true,
		},
		{
			ID:            "ux-design-principles",
			Title:         "10 nguyên tắc UX Design mọi designer cần biết",
			Excerpt:       "Các nguyên tắc thiết kế trải nghiệm người dùng cơ bản nhưng quan trọng để tạo ra sản phẩm tốt.",
			Content:       "Nội dung chi tiết về UX principles...",
			CoverImage:    "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1600&q=80",
			CreatorID:     "ux-planet",
			CreatorName:   "UX Planet",
			CreatorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&w=100&q=80",
			Category:      "Design",
			Tags:          []string{"UX", "Design", "Principles"},
			Upvotes:       2103,
			ReadTime:      "15 min",
			Published:     true,
		},
	}

	for _, p := range posts {
		_, err := db.Exec(`
			INSERT INTO posts (id, title, excerpt, content, cover_image, creator_id, creator_name,
			                   creator_avatar, category, tags, upvotes, read_time, published)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
			ON CONFLICT (id) DO NOTHING
		`, p.ID, p.Title, p.Excerpt, p.Content, p.CoverImage, p.CreatorID,
			p.CreatorName, p.CreatorAvatar, p.Category, pq.Array(p.Tags),
			p.Upvotes, p.ReadTime, p.Published)

		if err != nil {
			log.Printf("Warning: Could not seed post %s: %v\n", p.ID, err)
		}
	}

	log.Println("✅ Database seeded successfully!")
	log.Println("   - Admin user: admin@gearvn.com / admin123")
	log.Println("   - 3 Creators added")
	log.Println("   - 3 Posts added")

	return nil
}
