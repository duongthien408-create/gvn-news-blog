-- BƯỚC 4: Insert Tags
INSERT INTO tags (id, name, slug, icon_name) VALUES
('850e8400-e29b-41d4-a716-446655440001', 'Gaming', 'gaming', 'gamepad-2'),
('850e8400-e29b-41d4-a716-446655440002', 'PC Build', 'pc-build', 'cpu'),
('850e8400-e29b-41d4-a716-446655440003', 'Laptop', 'laptop', 'laptop'),
('850e8400-e29b-41d4-a716-446655440004', 'GPU', 'gpu', 'box'),
('850e8400-e29b-41d4-a716-446655440005', 'CPU', 'cpu', 'cpu'),
('850e8400-e29b-41d4-a716-446655440006', 'Mouse', 'mouse', 'mouse'),
('850e8400-e29b-41d4-a716-446655440007', 'Keyboard', 'keyboard', 'keyboard');

-- Kiểm tra
SELECT name, slug, icon_name FROM tags;
