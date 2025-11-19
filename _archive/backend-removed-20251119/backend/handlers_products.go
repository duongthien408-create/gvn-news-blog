package main

import (
	"database/sql"
	"encoding/json"

	"github.com/gofiber/fiber/v2"
)

// ============================================
// PRODUCTS HANDLERS
// ============================================

// GET /api/products - Get all products
func getProducts(c *fiber.Ctx) error {
	category := c.Query("category", "")
	brand := c.Query("brand", "")
	status := c.Query("status", "available")
	limit := c.QueryInt("limit", 50)

	query := `
		SELECT
			p.id, p.name, p.slug, p.sku, p.price,
			p.image_url, p.gearvn_url, p.status, p.created_at,
			pc.name as category_name, pc.slug as category_slug,
			b.name as brand_name, b.slug as brand_slug, b.logo_url as brand_logo
		FROM products p
		LEFT JOIN product_categories pc ON p.category_id = pc.id
		LEFT JOIN brands b ON p.brand_id = b.id
		WHERE p.status = $1
	`

	args := []interface{}{status}
	argPos := 2

	if category != "" {
		query += ` AND pc.slug = $` + string(rune(argPos))
		args = append(args, category)
		argPos++
	}

	if brand != "" {
		query += ` AND b.slug = $` + string(rune(argPos))
		args = append(args, brand)
		argPos++
	}

	query += ` ORDER BY p.created_at DESC LIMIT $` + string(rune(argPos))
	args = append(args, limit)

	rows, err := db.Query(query, args...)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch products"})
	}
	defer rows.Close()

	var products []map[string]interface{}
	for rows.Next() {
		var id, name, slug, productStatus string
		var sku, imageURL, gearvnURL sql.NullString
		var price sql.NullFloat64
		var createdAt interface{}
		var categoryName, categorySlug, brandName, brandSlug, brandLogo sql.NullString

		rows.Scan(
			&id, &name, &slug, &sku, &price,
			&imageURL, &gearvnURL, &productStatus, &createdAt,
			&categoryName, &categorySlug, &brandName, &brandSlug, &brandLogo,
		)

		product := map[string]interface{}{
			"id":         id,
			"name":       name,
			"slug":       slug,
			"sku":        fromNullString(sku),
			"price":      price.Float64,
			"image_url":  fromNullString(imageURL),
			"gearvn_url": fromNullString(gearvnURL),
			"status":     productStatus,
			"created_at": createdAt,
		}

		if categoryName.Valid {
			product["category"] = map[string]interface{}{
				"name": categoryName.String,
				"slug": fromNullString(categorySlug),
			}
		}

		if brandName.Valid {
			product["brand"] = map[string]interface{}{
				"name":     brandName.String,
				"slug":     fromNullString(brandSlug),
				"logo_url": fromNullString(brandLogo),
			}
		}

		products = append(products, product)
	}

	return c.JSON(products)
}

// GET /api/products/:slug - Get product by slug with posts
func getProductBySlug(c *fiber.Ctx) error {
	slug := c.Params("slug")

	query := `
		SELECT
			p.id, p.name, p.slug, p.sku, p.price,
			p.image_url, p.gearvn_url, p.status, p.created_at,
			pc.id as category_id, pc.name as category_name, pc.slug as category_slug,
			b.id as brand_id, b.name as brand_name, b.slug as brand_slug, b.logo_url as brand_logo
		FROM products p
		LEFT JOIN product_categories pc ON p.category_id = pc.id
		LEFT JOIN brands b ON p.brand_id = b.id
		WHERE p.slug = $1
	`

	var id, name, productSlug, productStatus string
	var sku, imageURL, gearvnURL sql.NullString
	var price sql.NullFloat64
	var createdAt interface{}
	var categoryID, categoryName, categorySlug sql.NullString
	var brandID, brandName, brandSlug, brandLogo sql.NullString

	err := db.QueryRow(query, slug).Scan(
		&id, &name, &productSlug, &sku, &price,
		&imageURL, &gearvnURL, &productStatus, &createdAt,
		&categoryID, &categoryName, &categorySlug,
		&brandID, &brandName, &brandSlug, &brandLogo,
	)

	if err == sql.ErrNoRows {
		return c.Status(404).JSON(fiber.Map{"error": "Product not found"})
	}
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch product"})
	}

	product := map[string]interface{}{
		"id":         id,
		"name":       name,
		"slug":       productSlug,
		"sku":        fromNullString(sku),
		"price":      price.Float64,
		"image_url":  fromNullString(imageURL),
		"gearvn_url": fromNullString(gearvnURL),
		"status":     productStatus,
		"created_at": createdAt,
	}

	if categoryName.Valid {
		product["category"] = map[string]interface{}{
			"id":   fromNullString(categoryID),
			"name": categoryName.String,
			"slug": fromNullString(categorySlug),
		}
	}

	if brandName.Valid {
		product["brand"] = map[string]interface{}{
			"id":       fromNullString(brandID),
			"name":     brandName.String,
			"slug":     fromNullString(brandSlug),
			"logo_url": fromNullString(brandLogo),
		}
	}

	// Get posts mentioning this product
	postsQuery := `
		SELECT
			p.id, p.title, p.slug, p.description, p.thumbnail_url,
			p.published_at, pp.mention_type,
			COALESCE(
				(SELECT json_agg(json_build_object('name', c.name, 'slug', c.slug))
				FROM post_creators pc JOIN creators c ON pc.creator_id = c.id
				WHERE pc.post_id = p.id), '[]'
			) as creators
		FROM posts p
		JOIN post_products pp ON p.id = pp.post_id
		WHERE pp.product_id = $1 AND p.status = 'published'
		ORDER BY p.published_at DESC
		LIMIT 10
	`

	postsRows, err := db.Query(postsQuery, id)
	if err == nil {
		defer postsRows.Close()

		var posts []map[string]interface{}
		for postsRows.Next() {
			var postID, title, postSlug, mentionType string
			var description, thumbnailURL sql.NullString
			var publishedAt interface{}
			var creatorsJSON string

			postsRows.Scan(
				&postID, &title, &postSlug, &description, &thumbnailURL,
				&publishedAt, &mentionType, &creatorsJSON,
			)

			var creators []interface{}
			json.Unmarshal([]byte(creatorsJSON), &creators)

			posts = append(posts, map[string]interface{}{
				"id":            postID,
				"title":         title,
				"slug":          postSlug,
				"description":   fromNullString(description),
				"thumbnail_url": fromNullString(thumbnailURL),
				"published_at":  publishedAt,
				"mention_type":  mentionType,
				"creators":      creators,
			})
		}

		product["posts"] = posts
	}

	return c.JSON(product)
}

// GET /api/brands - Get all brands
func getBrands(c *fiber.Ctx) error {
	query := `
		SELECT b.id, b.name, b.slug, b.logo_url, b.created_at,
		       COUNT(p.id) as product_count
		FROM brands b
		LEFT JOIN products p ON b.id = p.brand_id
		GROUP BY b.id
		ORDER BY product_count DESC, b.name ASC
	`

	rows, err := db.Query(query)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch brands"})
	}
	defer rows.Close()

	var brands []map[string]interface{}
	for rows.Next() {
		var id, name, slug string
		var logoURL sql.NullString
		var createdAt interface{}
		var productCount int

		rows.Scan(&id, &name, &slug, &logoURL, &createdAt, &productCount)

		brands = append(brands, map[string]interface{}{
			"id":            id,
			"name":          name,
			"slug":          slug,
			"logo_url":      fromNullString(logoURL),
			"created_at":    createdAt,
			"product_count": productCount,
		})
	}

	return c.JSON(brands)
}

// GET /api/product-categories - Get all product categories
func getProductCategories(c *fiber.Ctx) error {
	query := `
		SELECT pc.id, pc.name, pc.slug, pc.parent_id, pc.created_at,
		       COUNT(p.id) as product_count
		FROM product_categories pc
		LEFT JOIN products p ON pc.id = p.category_id
		GROUP BY pc.id
		ORDER BY pc.name ASC
	`

	rows, err := db.Query(query)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch categories"})
	}
	defer rows.Close()

	var categories []map[string]interface{}
	for rows.Next() {
		var id, name, slug string
		var parentID sql.NullString
		var createdAt interface{}
		var productCount int

		rows.Scan(&id, &name, &slug, &parentID, &createdAt, &productCount)

		categories = append(categories, map[string]interface{}{
			"id":            id,
			"name":          name,
			"slug":          slug,
			"parent_id":     fromNullString(parentID),
			"created_at":    createdAt,
			"product_count": productCount,
		})
	}

	return c.JSON(categories)
}
