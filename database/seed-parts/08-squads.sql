-- =====================================================
-- PART 8: SQUADS (COMMUNITIES)
-- =====================================================

-- Squads (Communities)
INSERT INTO squads (id, name, slug, description, image_url, member_count, post_count, created_by, created_at) VALUES
('a50e8400-e29b-41d4-a716-446655440011',
 'PC Master Race',
 'pc-master-race',
 'For PC gaming enthusiasts. Discuss builds, hardware, benchmarks, and everything PC gaming related.',
 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400',
 156, 42,
 '550e8400-e29b-41d4-a716-446655440002',
 NOW() - INTERVAL '6 months'),

('a50e8400-e29b-41d4-a716-446655440012',
 'Budget Builds',
 'budget-builds',
 'Building a PC on a budget? Share tips, find deals, and help others build affordable gaming rigs.',
 'https://images.unsplash.com/photo-1591238371612-75cddc937f80?w=400',
 89, 28,
 '550e8400-e29b-41d4-a716-446655440007',
 NOW() - INTERVAL '4 months'),

('a50e8400-e29b-41d4-a716-446655440013',
 'RGB Everything',
 'rgb-everything',
 'Because more RGB = more FPS! Share your colorful builds, RGB setups, and lighting tips.',
 'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?w=400',
 234, 67,
 '550e8400-e29b-41d4-a716-446655440003',
 NOW() - INTERVAL '8 months'),

('a50e8400-e29b-41d4-a716-446655440014',
 'Water Cooling Warriors',
 'water-cooling-warriors',
 'Custom water cooling enthusiasts. Share your loops, ask for advice, show off your builds.',
 'https://images.unsplash.com/photo-1618472611797-38d9e1d00e0e?w=400',
 67, 19,
 '550e8400-e29b-41d4-a716-446655440004',
 NOW() - INTERVAL '5 months'),

('a50e8400-e29b-41d4-a716-446655440015',
 'Laptop Gaming',
 'laptop-gaming',
 'Laptop gamers unite! Reviews, comparisons, cooling tips, and gaming on the go.',
 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400',
 178, 51,
 '550e8400-e29b-41d4-a716-446655440006',
 NOW() - INTERVAL '7 months');

-- Squad Members
INSERT INTO squad_members (squad_id, user_id, role, joined_at) VALUES
-- PC Master Race members
('a50e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440002', 'admin', NOW() - INTERVAL '6 months'),
('a50e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440003', 'member', NOW() - INTERVAL '5 months'),
('a50e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440004', 'moderator', NOW() - INTERVAL '5 months'),
('a50e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440005', 'member', NOW() - INTERVAL '4 months'),
('a50e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440008', 'member', NOW() - INTERVAL '3 months'),
('a50e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440009', 'member', NOW() - INTERVAL '2 months'),

-- Budget Builds members
('a50e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440007', 'admin', NOW() - INTERVAL '4 months'),
('a50e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440010', 'member', NOW() - INTERVAL '3 months'),
('a50e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440002', 'member', NOW() - INTERVAL '2 months'),
('a50e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440004', 'member', NOW() - INTERVAL '1 month'),

-- RGB Everything members
('a50e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440003', 'admin', NOW() - INTERVAL '8 months'),
('a50e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440002', 'member', NOW() - INTERVAL '7 months'),
('a50e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440004', 'member', NOW() - INTERVAL '6 months'),
('a50e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440007', 'member', NOW() - INTERVAL '5 months'),
('a50e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440008', 'member', NOW() - INTERVAL '4 months'),

-- Water Cooling Warriors members
('a50e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440004', 'admin', NOW() - INTERVAL '5 months'),
('a50e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440002', 'moderator', NOW() - INTERVAL '4 months'),
('a50e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440003', 'member', NOW() - INTERVAL '3 months'),
('a50e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440009', 'member', NOW() - INTERVAL '2 months'),

-- Laptop Gaming members
('a50e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440006', 'admin', NOW() - INTERVAL '7 months'),
('a50e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440007', 'member', NOW() - INTERVAL '6 months'),
('a50e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440010', 'member', NOW() - INTERVAL '5 months'),
('a50e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440005', 'member', NOW() - INTERVAL '4 months'),
('a50e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440008', 'member', NOW() - INTERVAL '3 months');

-- Squad Posts (some posts belong to squads)
INSERT INTO squad_posts (squad_id, post_id) VALUES
-- PC Master Race posts
('a50e8400-e29b-41d4-a716-446655440011', '950e8400-e29b-41d4-a716-446655440001'), -- RTX 4090 Review
('a50e8400-e29b-41d4-a716-446655440011', '950e8400-e29b-41d4-a716-446655440003'), -- PC Build Guide
('a50e8400-e29b-41d4-a716-446655440011', '950e8400-e29b-41d4-a716-446655440005'), -- CPU Comparison

-- Budget Builds posts
('a50e8400-e29b-41d4-a716-446655440012', '950e8400-e29b-41d4-a716-446655440003'), -- PC Build Guide
('a50e8400-e29b-41d4-a716-446655440012', '950e8400-e29b-41d4-a716-446655440004'), -- Mouse Review

-- RGB Everything posts
('a50e8400-e29b-41d4-a716-446655440013', '950e8400-e29b-41d4-a716-446655440009'), -- Keyboard Review

-- Water Cooling Warriors posts
('a50e8400-e29b-41d4-a716-446655440014', '950e8400-e29b-41d4-a716-446655440007'), -- Water Cooling Tutorial

-- Laptop Gaming posts
('a50e8400-e29b-41d4-a716-446655440015', '950e8400-e29b-41d4-a716-446655440002'); -- ASUS Laptop Review

-- Verify squads
SELECT
  s.name,
  s.member_count,
  s.post_count,
  u.username as created_by,
  COUNT(sm.user_id) as actual_members
FROM squads s
JOIN users u ON s.created_by = u.id
LEFT JOIN squad_members sm ON s.id = sm.squad_id
GROUP BY s.id, s.name, s.member_count, s.post_count, u.username
ORDER BY s.created_at;

-- Verify squad membership
SELECT
  s.name as squad,
  u.username,
  sm.role
FROM squad_members sm
JOIN squads s ON sm.squad_id = s.id
JOIN users u ON sm.user_id = u.id
ORDER BY s.name, sm.role DESC, sm.joined_at;
