-- =====================================================
-- PART 3: TAGS
-- =====================================================
-- Insert tags for categorizing posts

INSERT INTO tags (id, name, slug, description, icon_name, post_count) VALUES
('850e8400-e29b-41d4-a716-446655440001', 'Gaming', 'gaming', 'Gaming hardware and accessories', 'gamepad-2', 0),
('850e8400-e29b-41d4-a716-446655440002', 'PC Build', 'pc-build', 'PC building guides and tips', 'cpu', 0),
('850e8400-e29b-41d4-a716-446655440003', 'Laptop', 'laptop', 'Laptop reviews and comparisons', 'laptop', 0),
('850e8400-e29b-41d4-a716-446655440004', 'GPU', 'gpu', 'Graphics cards reviews', 'box', 0),
('850e8400-e29b-41d4-a716-446655440005', 'CPU', 'cpu', 'Processor reviews and benchmarks', 'cpu', 0),
('850e8400-e29b-41d4-a716-446655440006', 'Mouse', 'mouse', 'Gaming mouse reviews', 'mouse', 0),
('850e8400-e29b-41d4-a716-446655440007', 'Keyboard', 'keyboard', 'Mechanical keyboard reviews', 'keyboard', 0),
('850e8400-e29b-41d4-a716-446655440008', 'Monitor', 'monitor', 'Monitor reviews and guides', 'monitor', 0),
('850e8400-e29b-41d4-a716-446655440009', 'Storage', 'storage', 'SSD and HDD reviews', 'hard-drive', 0),
('850e8400-e29b-41d4-a716-446655440010', 'RAM', 'ram', 'Memory reviews', 'microchip', 0),
('850e8400-e29b-41d4-a716-446655440011', 'Cooling', 'cooling', 'PC cooling solutions', 'wind', 0),
('850e8400-e29b-41d4-a716-446655440012', 'Case', 'case', 'PC case reviews', 'box', 0),
('850e8400-e29b-41d4-a716-446655440013', 'PSU', 'psu', 'Power supply reviews', 'zap', 0),
('850e8400-e29b-41d4-a716-446655440014', 'Audio', 'audio', 'Headsets and speakers', 'headphones', 0),
('850e8400-e29b-41d4-a716-446655440015', 'Tutorial', 'tutorial', 'How-to guides', 'book-open', 0);

-- Verify
SELECT id, name, slug, description
FROM tags
ORDER BY name;
