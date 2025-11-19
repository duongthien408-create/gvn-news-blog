-- =====================================================
-- PART 5: POSTS & RELATIONSHIPS
-- =====================================================

-- Posts
INSERT INTO posts (id, title, slug, content, description, thumbnail_url, status, view_count, upvote_count, downvote_count, comment_count, published_at, created_at) VALUES
-- Post 1: RTX 4090 Review by Linus Tech Tips
('950e8400-e29b-41d4-a716-446655440001',
 'NVIDIA RTX 4090 - The Ultimate Gaming GPU?',
 'nvidia-rtx-4090-review',
 'Comprehensive review of the NVIDIA RTX 4090 graphics card. We tested gaming performance at 4K, ray tracing capabilities, power consumption, and value for money. The RTX 4090 delivers unprecedented performance but comes at a premium price.',
 'Is the RTX 4090 worth the investment for gamers and content creators? We break down the performance benchmarks.',
 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800',
 'published', 15420, 342, 12, 45,
 NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),

-- Post 2: ASUS ROG Laptop Review by Scrapshut
('950e8400-e29b-41d4-a716-446655440002',
 'Đánh giá ASUS ROG Strix G15 - Laptop gaming tầm trung đáng mua',
 'asus-rog-strix-g15-review',
 'ASUS ROG Strix G15 là một trong những laptop gaming phổ biến nhất hiện nay. Với chip AMD Ryzen 9, RTX 3070, màn hình 144Hz, máy cho hiệu năng mượt mà trong mọi tựa game AAA. Thiết kế đẹp, tản nhiệt tốt, giá cả hợp lý.',
 'Review chi tiết laptop gaming ASUS ROG Strix G15 - Liệu có đáng để bỏ 35 triệu?',
 'https://product.hstatic.net/200000722513/product/gearvn-laptop-asus-rog-strix-g15.png',
 'published', 8234, 156, 5, 28,
 NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),

-- Post 3: PC Build Guide by JayzTwoCents
('950e8400-e29b-41d4-a716-446655440003',
 'Ultimate $3000 Gaming PC Build Guide 2024',
 'ultimate-gaming-pc-build-guide-2024',
 'Step-by-step guide to building the perfect gaming PC in 2024. We cover component selection, compatibility, cable management, and BIOS setup. This $3000 build delivers excellent 1440p and 4K gaming performance.',
 'Build the ultimate gaming PC with our comprehensive guide. Components list, assembly tips, and performance benchmarks included.',
 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800',
 'published', 22150, 567, 23, 89,
 NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),

-- Post 4: Logitech Mouse Review by Hardware Unboxed
('950e8400-e29b-41d4-a716-446655440004',
 'Logitech G Pro X Superlight Review - Best Wireless Gaming Mouse?',
 'logitech-g-pro-x-superlight-review',
 'The Logitech G Pro X Superlight is one of the lightest wireless gaming mice at just 63 grams. We tested sensor accuracy, battery life, build quality, and gaming performance across FPS titles. Is it worth the premium price?',
 'In-depth review of the Logitech G Pro X Superlight wireless gaming mouse.',
 'https://product.hstatic.net/200000722513/product/chuot-logitech-g-pro-x-superlight.png',
 'published', 5670, 234, 8, 34,
 NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),

-- Post 5: CPU Comparison by Gamers Nexus
('950e8400-e29b-41d4-a716-446655440005',
 'AMD Ryzen 9 7950X vs Intel Core i9-13900K - The Ultimate Showdown',
 'amd-ryzen-9-7950x-vs-intel-i9-13900k',
 'Detailed benchmarking comparison between AMD Ryzen 9 7950X and Intel Core i9-13900K. We tested gaming performance, productivity workloads, power consumption, temperatures, and value. Which CPU should you buy in 2024?',
 'AMD vs Intel flagship CPUs compared - gaming, productivity, power, and value analysis.',
 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800',
 'published', 18900, 445, 34, 67,
 NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),

-- Post 6: Monitor Review by Hardware Unboxed
('950e8400-e29b-41d4-a716-446655440006',
 'LG UltraGear 27GN950 Review - 4K 144Hz Gaming Perfection',
 'lg-ultragear-27gn950-review',
 'The LG UltraGear 27GN950 is a premium 4K 144Hz gaming monitor with excellent color accuracy and HDR support. We tested response times, input lag, color gamut, and gaming experience. Is this the ultimate gaming monitor?',
 '4K 144Hz gaming monitor review - LG UltraGear 27GN950 tested.',
 'https://product.hstatic.net/200000722513/product/lg-ultragear.png',
 'published', 9340, 278, 12, 41,
 NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),

-- Post 7: Water Cooling Tutorial by JayzTwoCents
('950e8400-e29b-41d4-a716-446655440007',
 'Custom Water Cooling for Beginners - Complete Tutorial',
 'custom-water-cooling-tutorial',
 'Learn how to build your first custom water cooling loop. We cover parts selection (pump, radiator, reservoir, blocks), loop planning, installation, leak testing, and maintenance. Transform your PC with beautiful custom water cooling.',
 'Step-by-step guide to custom water cooling - from planning to installation.',
 'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?w=800',
 'published', 12450, 389, 15, 52,
 NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),

-- Post 8: SSD Review by Linus Tech Tips
('950e8400-e29b-41d4-a716-446655440008',
 'Samsung 990 PRO Review - Fastest PCIe 4.0 SSD?',
 'samsung-990-pro-review',
 'The Samsung 990 PRO promises to be the fastest PCIe 4.0 SSD on the market. We tested sequential and random speeds, real-world game loading, video editing performance, and endurance. How does it compare to competitors?',
 'Samsung 990 PRO SSD review - speed tests, gaming, and productivity benchmarks.',
 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800',
 'published', 7890, 198, 6, 29,
 NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),

-- Post 9: Mechanical Keyboard Review by Scrapshut
('950e8400-e29b-41d4-a716-446655440009',
 'Đánh giá Razer BlackWidow V4 Pro - Bàn phím cơ cao cấp',
 'razer-blackwidow-v4-pro-review',
 'Razer BlackWidow V4 Pro là flagship keyboard với Green Switch, RGB đẹp mắt, command dial, và build quality cao cấp. Chúng tôi test trải nghiệm đánh máy, gaming, phần mềm, và giá trị đồng tiền. Liệu có đáng 6 triệu?',
 'Review bàn phím cơ Razer BlackWidow V4 Pro - Đánh máy, gaming, RGB.',
 'https://product.hstatic.net/200000722513/product/razer-blackwidow-v4-pro.png',
 'published', 6230, 167, 9, 23,
 NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),

-- Post 10: Headset Review by Gamers Nexus
('950e8400-e29b-41d4-a716-446655440010',
 'HyperX Cloud Alpha Wireless Review - Best Wireless Gaming Headset?',
 'hyperx-cloud-alpha-wireless-review',
 'HyperX Cloud Alpha Wireless boasts 300 hours of battery life - the longest on the market. We tested sound quality, microphone clarity, comfort for long sessions, and wireless range. Is this the ultimate wireless gaming headset?',
 'HyperX Cloud Alpha Wireless headset review - 300 hour battery tested.',
 'https://product.hstatic.net/200000722513/product/hyperx-cloud-alpha.png',
 'published', 4560, 142, 7, 19,
 NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');

-- Post Tags (many-to-many relationship)
INSERT INTO post_tags (post_id, tag_id) VALUES
-- Post 1: RTX 4090 Review
('950e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440004'), -- GPU
('950e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440001'), -- Gaming
('950e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440002'), -- PC Build

-- Post 2: ASUS Laptop
('950e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440003'), -- Laptop
('950e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440001'), -- Gaming

-- Post 3: PC Build Guide
('950e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440002'), -- PC Build
('950e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440015'), -- Tutorial
('950e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440001'), -- Gaming

-- Post 4: Logitech Mouse
('950e8400-e29b-41d4-a716-446655440004', '850e8400-e29b-41d4-a716-446655440006'), -- Mouse
('950e8400-e29b-41d4-a716-446655440004', '850e8400-e29b-41d4-a716-446655440003'), -- Peripherals
('950e8400-e29b-41d4-a716-446655440004', '850e8400-e29b-41d4-a716-446655440001'), -- Gaming

-- Post 5: CPU Comparison
('950e8400-e29b-41d4-a716-446655440005', '850e8400-e29b-41d4-a716-446655440005'), -- CPU
('950e8400-e29b-41d4-a716-446655440005', '850e8400-e29b-41d4-a716-446655440002'), -- PC Build

-- Post 6: Monitor Review
('950e8400-e29b-41d4-a716-446655440006', '850e8400-e29b-41d4-a716-446655440008'), -- Monitor
('950e8400-e29b-41d4-a716-446655440006', '850e8400-e29b-41d4-a716-446655440001'), -- Gaming

-- Post 7: Water Cooling Tutorial
('950e8400-e29b-41d4-a716-446655440007', '850e8400-e29b-41d4-a716-446655440011'), -- Cooling
('950e8400-e29b-41d4-a716-446655440007', '850e8400-e29b-41d4-a716-446655440015'), -- Tutorial
('950e8400-e29b-41d4-a716-446655440007', '850e8400-e29b-41d4-a716-446655440002'), -- PC Build

-- Post 8: SSD Review
('950e8400-e29b-41d4-a716-446655440008', '850e8400-e29b-41d4-a716-446655440009'), -- Storage
('950e8400-e29b-41d4-a716-446655440008', '850e8400-e29b-41d4-a716-446655440002'), -- PC Build

-- Post 9: Keyboard Review
('950e8400-e29b-41d4-a716-446655440009', '850e8400-e29b-41d4-a716-446655440007'), -- Keyboard
('950e8400-e29b-41d4-a716-446655440009', '850e8400-e29b-41d4-a716-446655440003'), -- Peripherals
('950e8400-e29b-41d4-a716-446655440009', '850e8400-e29b-41d4-a716-446655440001'), -- Gaming

-- Post 10: Headset Review
('950e8400-e29b-41d4-a716-446655440010', '850e8400-e29b-41d4-a716-446655440014'), -- Audio
('950e8400-e29b-41d4-a716-446655440010', '850e8400-e29b-41d4-a716-446655440001'); -- Gaming

-- Post Creators (posts attributed to creators)
INSERT INTO post_creators (post_id, creator_id) VALUES
('950e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002'), -- RTX 4090 → Linus Tech Tips
('950e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001'), -- ASUS Laptop → Scrapshut
('950e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440004'), -- PC Build → JayzTwoCents
('950e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440005'), -- Mouse → Hardware Unboxed
('950e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440003'), -- CPU Comparison → Gamers Nexus
('950e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440005'), -- Monitor → Hardware Unboxed
('950e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440004'), -- Water Cooling → JayzTwoCents
('950e8400-e29b-41d4-a716-446655440008', '650e8400-e29b-41d4-a716-446655440002'), -- SSD → Linus Tech Tips
('950e8400-e29b-41d4-a716-446655440009', '650e8400-e29b-41d4-a716-446655440001'), -- Keyboard → Scrapshut
('950e8400-e29b-41d4-a716-446655440010', '650e8400-e29b-41d4-a716-446655440003'); -- Headset → Gamers Nexus

-- Post Products (products mentioned in posts)
INSERT INTO post_products (post_id, product_id) VALUES
('950e8400-e29b-41d4-a716-446655440001', 'b50e8400-e29b-41d4-a716-446655440004'), -- RTX 4090 post → RTX 4090 product
('950e8400-e29b-41d4-a716-446655440002', 'b50e8400-e29b-41d4-a716-446655440001'), -- ASUS Laptop post → ASUS Laptop product
('950e8400-e29b-41d4-a716-446655440003', 'b50e8400-e29b-41d4-a716-446655440004'), -- PC Build → RTX 4090
('950e8400-e29b-41d4-a716-446655440003', 'b50e8400-e29b-41d4-a716-446655440005'), -- PC Build → Ryzen 9 7950X
('950e8400-e29b-41d4-a716-446655440003', 'b50e8400-e29b-41d4-a716-446655440006'), -- PC Build → Samsung SSD
('950e8400-e29b-41d4-a716-446655440004', 'b50e8400-e29b-41d4-a716-446655440002'), -- Mouse post → Logitech Mouse
('950e8400-e29b-41d4-a716-446655440005', 'b50e8400-e29b-41d4-a716-446655440005'), -- CPU Comparison → Ryzen 9 7950X
('950e8400-e29b-41d4-a716-446655440006', 'b50e8400-e29b-41d4-a716-446655440008'), -- Monitor post → LG Monitor
('950e8400-e29b-41d4-a716-446655440007', 'b50e8400-e29b-41d4-a716-446655440009'), -- Water Cooling → NZXT Kraken
('950e8400-e29b-41d4-a716-446655440008', 'b50e8400-e29b-41d4-a716-446655440006'), -- SSD post → Samsung SSD
('950e8400-e29b-41d4-a716-446655440009', 'b50e8400-e29b-41d4-a716-446655440003'), -- Keyboard post → Razer Keyboard
('950e8400-e29b-41d4-a716-446655440010', 'b50e8400-e29b-41d4-a716-446655440010'); -- Headset post → HyperX Headset

-- Verify
SELECT
  p.id,
  p.title,
  p.view_count,
  p.upvote_count,
  p.comment_count,
  c.name as creator,
  COUNT(DISTINCT pt.tag_id) as tag_count,
  COUNT(DISTINCT pp.product_id) as product_count
FROM posts p
LEFT JOIN post_creators pc ON p.id = pc.post_id
LEFT JOIN creators c ON pc.creator_id = c.id
LEFT JOIN post_tags pt ON p.id = pt.post_id
LEFT JOIN post_products pp ON p.id = pp.post_id
GROUP BY p.id, p.title, p.view_count, p.upvote_count, p.comment_count, c.name
ORDER BY p.created_at DESC;
