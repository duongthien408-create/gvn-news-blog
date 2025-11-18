package main

import (
	"log"
)

// SeedSources seeds the database with RSS feed sources
func SeedSources() error {
	log.Println("🌱 Seeding RSS sources...")

	sources := []struct {
		Name     string
		URL      string
		Category string
	}{
		// Gaming News - International
		{
			Name:     "IGN All",
			URL:      "https://feeds.ign.com/ign/all",
			Category: "gaming",
		},
		{
			Name:     "GameSpot News",
			URL:      "https://www.gamespot.com/feeds/news/",
			Category: "gaming",
		},
		{
			Name:     "PC Gamer",
			URL:      "https://www.pcgamer.com/rss/",
			Category: "gaming",
		},
		{
			Name:     "Polygon",
			URL:      "https://www.polygon.com/rss/index.xml",
			Category: "gaming",
		},
		{
			Name:     "Rock Paper Shotgun",
			URL:      "https://www.rockpapershotgun.com/feed",
			Category: "gaming",
		},

		// Hardware & Tech
		{
			Name:     "Tom's Hardware",
			URL:      "https://www.tomshardware.com/feeds/all",
			Category: "hardware",
		},
		{
			Name:     "AnandTech",
			URL:      "https://www.anandtech.com/rss/",
			Category: "hardware",
		},
		{
			Name:     "TechSpot",
			URL:      "https://www.techspot.com/backend.xml",
			Category: "hardware",
		},
		{
			Name:     "TechPowerUp",
			URL:      "https://www.techpowerup.com/rss/news",
			Category: "hardware",
		},

		// General Tech News
		{
			Name:     "TechCrunch",
			URL:      "https://techcrunch.com/feed/",
			Category: "tech",
		},
		{
			Name:     "The Verge",
			URL:      "https://www.theverge.com/rss/index.xml",
			Category: "tech",
		},
		{
			Name:     "Ars Technica",
			URL:      "https://feeds.arstechnica.com/arstechnica/index",
			Category: "tech",
		},
		{
			Name:     "Engadget",
			URL:      "https://www.engadget.com/rss.xml",
			Category: "tech",
		},
		{
			Name:     "CNET News",
			URL:      "https://www.cnet.com/rss/news/",
			Category: "tech",
		},

		// Vietnamese Tech & Gaming
		{
			Name:     "Genk Tech",
			URL:      "https://genk.vn/rss/tech.rss",
			Category: "tech",
		},
		{
			Name:     "VnExpress Số Hóa",
			URL:      "https://vnexpress.net/rss/so-hoa.rss",
			Category: "tech",
		},
		{
			Name:     "VnExpress Game",
			URL:      "https://vnexpress.net/rss/tin-tuc-game.rss",
			Category: "gaming",
		},
		{
			Name:     "Thế Giới PC",
			URL:      "https://thegioipc.vn/feed/",
			Category: "hardware",
		},

		// Esports
		{
			Name:     "Dexerto",
			URL:      "https://www.dexerto.com/feed/",
			Category: "esports",
		},
		{
			Name:     "Dot Esports",
			URL:      "https://dotesports.com/feed/",
			Category: "esports",
		},

		// PC Building & Modding
		{
			Name:     "PCWorld",
			URL:      "https://www.pcworld.com/feed",
			Category: "hardware",
		},
		{
			Name:     "Linus Tech Tips",
			URL:      "https://www.youtube.com/feeds/videos.xml?channel_id=UCXuqSBlHAE6Xw-yeJA0Tunw",
			Category: "hardware",
		},

		// Graphics & Gaming Performance
		{
			Name:     "TweakTown",
			URL:      "https://www.tweaktown.com/rss.xml",
			Category: "hardware",
		},
		{
			Name:     "Guru3D",
			URL:      "https://www.guru3d.com/rss/",
			Category: "hardware",
		},

		// More Gaming Content
		{
			Name:     "Kotaku",
			URL:      "https://kotaku.com/rss",
			Category: "gaming",
		},
		{
			Name:     "Destructoid",
			URL:      "https://www.destructoid.com/feed/",
			Category: "gaming",
		},
		{
			Name:     "GamesRadar",
			URL:      "https://www.gamesradar.com/rss/",
			Category: "gaming",
		},

		// Tech Reviews
		{
			Name:     "TechRadar",
			URL:      "https://www.techradar.com/rss",
			Category: "tech",
		},
		{
			Name:     "Digital Trends",
			URL:      "https://www.digitaltrends.com/feed/",
			Category: "tech",
		},
	}

	successCount := 0
	skipCount := 0

	for _, s := range sources {
		// Check if source already exists
		var existingID int
		err := db.QueryRow("SELECT id FROM sources WHERE url = $1", s.URL).Scan(&existingID)
		if err == nil {
			// Source already exists
			skipCount++
			continue
		}

		// Insert source
		_, err = db.Exec(`
			INSERT INTO sources (name, url, type, category, active, fetch_interval)
			VALUES ($1, $2, $3, $4, $5, $6)
		`, s.Name, s.URL, "rss", s.Category, true, 30)

		if err != nil {
			log.Printf("⚠️  Error inserting source %s: %v", s.Name, err)
			continue
		}

		successCount++
	}

	log.Printf("✅ Seeded %d new sources (%d skipped, already exist)", successCount, skipCount)
	return nil
}
