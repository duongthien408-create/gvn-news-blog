-- =====================================================
-- PART 2: CREATORS
-- =====================================================
-- Insert creator data

INSERT INTO creators (id, name, slug, bio, avatar_url, verified, website, total_followers, created_at) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Scrapshut', 'scrapshut', 'Kênh YouTube review công nghệ hàng đầu Việt Nam với hơn 150K subscribers', 'https://yt3.googleusercontent.com/ytc/scrapshut', true, 'https://www.youtube.com/@scrapshut', 150000, NOW() - INTERVAL '2 years'),
('650e8400-e29b-41d4-a716-446655440002', 'Linus Tech Tips', 'linus-tech-tips', 'Tech reviews, PC builds, and tech news from Linus Sebastian', 'https://yt3.googleusercontent.com/ytc/ltt', true, 'https://www.youtube.com/@LinusTechTips', 15000000, NOW() - INTERVAL '5 years'),
('650e8400-e29b-41d4-a716-446655440003', 'Gamers Nexus', 'gamers-nexus', 'In-depth hardware analysis, reviews, and PC building guides', 'https://yt3.googleusercontent.com/ytc/gn', true, 'https://www.gamersnexus.net', 2000000, NOW() - INTERVAL '4 years'),
('650e8400-e29b-41d4-a716-446655440004', 'JayzTwoCents', 'jayztwocents', 'PC building, custom water cooling, and tech reviews', 'https://yt3.googleusercontent.com/ytc/jay', true, 'https://www.youtube.com/@JayzTwoCents', 3500000, NOW() - INTERVAL '3 years'),
('650e8400-e29b-41d4-a716-446655440005', 'Hardware Unboxed', 'hardware-unboxed', 'Honest GPU and CPU reviews with detailed benchmarks', 'https://yt3.googleusercontent.com/ytc/hwu', true, 'https://www.youtube.com/@HardwareUnboxed', 1800000, NOW() - INTERVAL '3 years');

-- Creator Socials
INSERT INTO creator_socials (creator_id, platform, url, follower_count) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'youtube', 'https://www.youtube.com/@scrapshut', 150000),
('650e8400-e29b-41d4-a716-446655440001', 'facebook', 'https://www.facebook.com/scrapshut', 50000),
('650e8400-e29b-41d4-a716-446655440002', 'youtube', 'https://www.youtube.com/@LinusTechTips', 15000000),
('650e8400-e29b-41d4-a716-446655440002', 'twitter', 'https://twitter.com/linustech', 2000000),
('650e8400-e29b-41d4-a716-446655440003', 'youtube', 'https://www.youtube.com/@GamersNexus', 2000000),
('650e8400-e29b-41d4-a716-446655440003', 'twitter', 'https://twitter.com/gamersnexus', 150000),
('650e8400-e29b-41d4-a716-446655440004', 'youtube', 'https://www.youtube.com/@JayzTwoCents', 3500000),
('650e8400-e29b-41d4-a716-446655440004', 'twitter', 'https://twitter.com/jayztwocents', 400000),
('650e8400-e29b-41d4-a716-446655440005', 'youtube', 'https://www.youtube.com/@HardwareUnboxed', 1800000);

-- Verify
SELECT id, name, slug, verified, total_followers
FROM creators
ORDER BY created_at;
