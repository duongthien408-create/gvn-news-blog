-- BƯỚC 7: Link Posts với Creators (Many-to-Many)
INSERT INTO post_creators (post_id, creator_id) VALUES
('a50e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001'), -- ASUS laptop by Scrapshut
('a50e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001'), -- Top 5 mouse by Scrapshut
('a50e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440001'), -- PC Build by Scrapshut
('a50e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440002'), -- RTX comparison by LTT
('a50e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440002'), -- AMD CPU by LTT
('a50e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440001'), -- Keyboard by Scrapshut
('a50e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440002'), -- Monitor by LTT
('a50e8400-e29b-41d4-a716-446655440008', '650e8400-e29b-41d4-a716-446655440001'), -- SSD by Scrapshut
('a50e8400-e29b-41d4-a716-446655440009', '650e8400-e29b-41d4-a716-446655440002'), -- Cooling by LTT
('a50e8400-e29b-41d4-a716-446655440010', '650e8400-e29b-41d4-a716-446655440001'); -- Headset by Scrapshut

-- Kiểm tra
SELECT p.title, c.name as creator
FROM posts p
JOIN post_creators pc ON p.id = pc.post_id
JOIN creators c ON pc.creator_id = c.id
ORDER BY p.created_at DESC;
