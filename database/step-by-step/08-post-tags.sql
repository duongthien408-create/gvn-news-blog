-- BƯỚC 8: Link Posts với Tags (Many-to-Many)
INSERT INTO post_tags (post_id, tag_id) VALUES
-- Post 1: ASUS laptop
('a50e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440001'), -- Gaming
('a50e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440003'), -- Laptop

-- Post 2: Top 5 mouse
('a50e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440001'), -- Gaming
('a50e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440006'), -- Mouse

-- Post 3: PC Build
('a50e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440002'), -- PC Build

-- Post 4: RTX comparison
('a50e8400-e29b-41d4-a716-446655440004', '850e8400-e29b-41d4-a716-446655440004'), -- GPU

-- Post 5: AMD CPU
('a50e8400-e29b-41d4-a716-446655440005', '850e8400-e29b-41d4-a716-446655440005'), -- CPU

-- Post 6: Keyboard
('a50e8400-e29b-41d4-a716-446655440006', '850e8400-e29b-41d4-a716-446655440007'), -- Keyboard

-- Post 7: Monitor
('a50e8400-e29b-41d4-a716-446655440007', '850e8400-e29b-41d4-a716-446655440003'), -- Laptop (reuse)

-- Post 8: SSD
('a50e8400-e29b-41d4-a716-446655440008', '850e8400-e29b-41d4-a716-446655440002'), -- PC Build

-- Post 9: Cooling
('a50e8400-e29b-41d4-a716-446655440009', '850e8400-e29b-41d4-a716-446655440002'), -- PC Build

-- Post 10: Headset
('a50e8400-e29b-41d4-a716-446655440010', '850e8400-e29b-41d4-a716-446655440001'); -- Gaming

-- Update tag post_count (tự động bởi trigger, nhưng chạy lại để chắc)
UPDATE tags SET post_count = (
  SELECT COUNT(*) FROM post_tags WHERE post_tags.tag_id = tags.id
);

-- Kiểm tra
SELECT t.name, t.post_count
FROM tags t
ORDER BY t.post_count DESC;
