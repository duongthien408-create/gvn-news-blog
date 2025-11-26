-- BƯỚC 3: Insert Creators
INSERT INTO creators (id, name, slug, bio, avatar_url, verified, website, created_at) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Scrapshut', 'scrapshut', 'Kênh YouTube review công nghệ hàng đầu Việt Nam', 'https://ui-avatars.com/api/?name=Scrapshut&background=FF0000&color=fff', true, 'https://www.youtube.com/@scrapshut', NOW()),
('650e8400-e29b-41d4-a716-446655440002', 'Linus Tech Tips', 'linus-tech-tips', 'Tech reviews and PC building', 'https://ui-avatars.com/api/?name=LTT&background=FF6B00&color=fff', true, 'https://www.youtube.com/@LinusTechTips', NOW()),
('650e8400-e29b-41d4-a716-446655440003', 'Gamers Nexus', 'gamers-nexus', 'In-depth hardware analysis', 'https://ui-avatars.com/api/?name=GN&background=1E40AF&color=fff', true, 'https://www.gamersnexus.net', NOW());

-- Kiểm tra
SELECT name, slug, verified FROM creators;
