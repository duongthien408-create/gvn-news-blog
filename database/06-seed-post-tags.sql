-- ============================================
-- STEP 6: LINK POSTS TO TAGS
-- ============================================

-- RTX 5090 news -> vga, pc, game
INSERT INTO post_tags (post_id, tag_id)
SELECT p.id, t.id FROM posts p, tags t
WHERE p.title = 'NVIDIA announces RTX 5090 with 32GB GDDR7 memory'
AND t.slug = 'vga';

INSERT INTO post_tags (post_id, tag_id)
SELECT p.id, t.id FROM posts p, tags t
WHERE p.title = 'NVIDIA announces RTX 5090 with 32GB GDDR7 memory'
AND t.slug = 'pc';

INSERT INTO post_tags (post_id, tag_id)
SELECT p.id, t.id FROM posts p, tags t
WHERE p.title = 'NVIDIA announces RTX 5090 with 32GB GDDR7 memory'
AND t.slug = 'game';

-- Ryzen 9000 news -> cpu, pc, game
INSERT INTO post_tags (post_id, tag_id)
SELECT p.id, t.id FROM posts p, tags t
WHERE p.title = 'AMD Ryzen 9000 Series crushes Intel in gaming benchmarks'
AND t.slug = 'cpu';

INSERT INTO post_tags (post_id, tag_id)
SELECT p.id, t.id FROM posts p, tags t
WHERE p.title = 'AMD Ryzen 9000 Series crushes Intel in gaming benchmarks'
AND t.slug = 'pc';

INSERT INTO post_tags (post_id, tag_id)
SELECT p.id, t.id FROM posts p, tags t
WHERE p.title = 'AMD Ryzen 9000 Series crushes Intel in gaming benchmarks'
AND t.slug = 'game';

-- RTX comparison review -> vga, pc, game
INSERT INTO post_tags (post_id, tag_id)
SELECT p.id, t.id FROM posts p, tags t
WHERE p.title = 'RTX 4090 vs RTX 5090 - Is it worth the upgrade?'
AND t.slug = 'vga';

INSERT INTO post_tags (post_id, tag_id)
SELECT p.id, t.id FROM posts p, tags t
WHERE p.title = 'RTX 4090 vs RTX 5090 - Is it worth the upgrade?'
AND t.slug = 'pc';

INSERT INTO post_tags (post_id, tag_id)
SELECT p.id, t.id FROM posts p, tags t
WHERE p.title = 'RTX 4090 vs RTX 5090 - Is it worth the upgrade?'
AND t.slug = 'game';

-- Gaming Mouse review -> mouse, game
INSERT INTO post_tags (post_id, tag_id)
SELECT p.id, t.id FROM posts p, tags t
WHERE p.title = 'Best Budget Gaming Mouse 2024 - Top 5 Picks'
AND t.slug = 'mouse';

INSERT INTO post_tags (post_id, tag_id)
SELECT p.id, t.id FROM posts p, tags t
WHERE p.title = 'Best Budget Gaming Mouse 2024 - Top 5 Picks'
AND t.slug = 'game';

-- 4K Gaming PC review -> pc, vga, cpu, ram, game
INSERT INTO post_tags (post_id, tag_id)
SELECT p.id, t.id FROM posts p, tags t
WHERE p.title = 'Building the Ultimate 4K Gaming PC in 2024'
AND t.slug = 'pc';

INSERT INTO post_tags (post_id, tag_id)
SELECT p.id, t.id FROM posts p, tags t
WHERE p.title = 'Building the Ultimate 4K Gaming PC in 2024'
AND t.slug = 'vga';

INSERT INTO post_tags (post_id, tag_id)
SELECT p.id, t.id FROM posts p, tags t
WHERE p.title = 'Building the Ultimate 4K Gaming PC in 2024'
AND t.slug = 'cpu';

INSERT INTO post_tags (post_id, tag_id)
SELECT p.id, t.id FROM posts p, tags t
WHERE p.title = 'Building the Ultimate 4K Gaming PC in 2024'
AND t.slug = 'ram';

INSERT INTO post_tags (post_id, tag_id)
SELECT p.id, t.id FROM posts p, tags t
WHERE p.title = 'Building the Ultimate 4K Gaming PC in 2024'
AND t.slug = 'game';
