-- =====================================================
-- FIX: Update Product Images to Unsplash
-- =====================================================
-- Replace 404 GearVN images with working Unsplash images

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800' WHERE slug = 'asus-rog-strix-g15'; -- Gaming laptop
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800' WHERE slug = 'logitech-g-pro-x-superlight'; -- Gaming mouse
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800' WHERE slug = 'razer-blackwidow-v4-pro'; -- Mechanical keyboard
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800' WHERE slug = 'nvidia-rtx-4090'; -- GPU
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800' WHERE slug = 'amd-ryzen-9-7950x'; -- CPU
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800' WHERE slug = 'samsung-990-pro-2tb'; -- SSD
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800' WHERE slug = 'corsair-dominator-32gb'; -- RAM
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800' WHERE slug = 'lg-ultragear-27gn950'; -- Gaming monitor
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1618472661632-90523e125751?w=800' WHERE slug = 'nzxt-kraken-x73'; -- AIO cooler
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800' WHERE slug = 'hyperx-cloud-alpha'; -- Gaming headset

-- Verify
SELECT slug, name, image_url FROM products ORDER BY created_at;
