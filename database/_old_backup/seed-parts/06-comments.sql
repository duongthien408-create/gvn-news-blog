-- =====================================================
-- PART 6: COMMENTS & REPLIES
-- =====================================================

-- Top-level comments
INSERT INTO comments (id, post_id, user_id, content, upvote_count, downvote_count, created_at) VALUES
-- Comments on Post 1: RTX 4090 Review
('750e8400-e29b-41d4-a716-446655440001',
 '950e8400-e29b-41d4-a716-446655440001',
 '550e8400-e29b-41d4-a716-446655440002',
 'Great review! The RTX 4090 is a beast but the price is insane. I think I will stick with my 3080 for another year.',
 23, 1, NOW() - INTERVAL '6 days'),

('750e8400-e29b-41d4-a716-446655440002',
 '950e8400-e29b-41d4-a716-446655440001',
 '550e8400-e29b-41d4-a716-446655440003',
 'Power consumption is crazy on this card! My 850W PSU barely handles it. Definitely need to upgrade.',
 15, 0, NOW() - INTERVAL '6 days'),

-- Comments on Post 2: ASUS Laptop
('750e8400-e29b-41d4-a716-446655440003',
 '950e8400-e29b-41d4-a716-446655440002',
 '550e8400-e29b-41d4-a716-446655440004',
 'Mình đang dùng con này được 6 tháng rồi, rất hài lòng. Chơi game mượt, màn hình đẹp, tản nhiệt tốt. Recommend!',
 34, 2, NOW() - INTERVAL '4 days'),

('750e8400-e29b-41d4-a716-446655440004',
 '950e8400-e29b-41d4-a716-446655440002',
 '550e8400-e29b-41d4-a716-446655440005',
 'Giá 35 triệu hơi cao so với cấu hình. Em thấy Legion 5 Pro cùng giá có vẻ ngon hơn. Anh em nghĩ sao?',
 12, 5, NOW() - INTERVAL '4 days'),

-- Comments on Post 3: PC Build Guide
('750e8400-e29b-41d4-a716-446655440005',
 '950e8400-e29b-41d4-a716-446655440003',
 '550e8400-e29b-41d4-a716-446655440006',
 'Perfect guide for beginners! I followed this and built my first PC. Everything worked on the first try. Thanks Jay!',
 67, 1, NOW() - INTERVAL '2 days'),

('750e8400-e29b-41d4-a716-446655440006',
 '950e8400-e29b-41d4-a716-446655440003',
 '550e8400-e29b-41d4-a716-446655440007',
 'Nên đầu tư vào case tốt hơn không các bác? Em thấy airflow quan trọng lắm nhưng case đẹp lại đắt.',
 18, 0, NOW() - INTERVAL '2 days'),

-- Comments on Post 4: Logitech Mouse
('750e8400-e29b-41d4-a716-446655440007',
 '950e8400-e29b-41d4-a716-446655440004',
 '550e8400-e29b-41d4-a716-446655440008',
 'Been using this mouse for Valorant and it is amazing. Super lightweight and the sensor is perfect. Worth every penny!',
 29, 2, NOW() - INTERVAL '1 day'),

-- Comments on Post 5: CPU Comparison
('750e8400-e29b-41d4-a716-446655440008',
 '950e8400-e29b-41d4-a716-446655440005',
 '550e8400-e29b-41d4-a716-446655440009',
 'AMD is killing it with the 7950X! Better value than Intel and runs cooler. Team Red for the win!',
 41, 8, NOW() - INTERVAL '9 days'),

('750e8400-e29b-41d4-a716-446655440009',
 '950e8400-e29b-41d4-a716-446655440005',
 '550e8400-e29b-41d4-a716-446655440010',
 'Still prefer Intel for pure gaming performance. The i9-13900K edges out in most games. Productivity is different though.',
 22, 6, NOW() - INTERVAL '9 days'),

-- Comments on Post 6: Monitor Review
('750e8400-e29b-41d4-a716-446655440010',
 '950e8400-e29b-41d4-a716-446655440006',
 '550e8400-e29b-41d4-a716-446655440002',
 '4K 144Hz is the sweet spot for gaming monitors now. This LG is expensive but totally worth it for the quality.',
 31, 1, NOW() - INTERVAL '7 days'),

-- Comments on Post 7: Water Cooling Tutorial
('750e8400-e29b-41d4-a716-446655440011',
 '950e8400-e29b-41d4-a716-446655440007',
 '550e8400-e29b-41d4-a716-446655440003',
 'Water cooling looks amazing but I am too scared to try it. What if it leaks and destroys everything?',
 14, 0, NOW() - INTERVAL '5 days'),

-- Comments on Post 8: SSD Review
('750e8400-e29b-41d4-a716-446655440012',
 '950e8400-e29b-41d4-a716-446655440008',
 '550e8400-e29b-41d4-a716-446655440004',
 'Gen 4 SSDs are getting so fast! Game loading times are basically instant now. No more waiting screens.',
 19, 0, NOW() - INTERVAL '3 days'),

-- Comments on Post 9: Keyboard Review
('750e8400-e29b-41d4-a716-446655440013',
 '950e8400-e29b-41d4-a716-446655440009',
 '550e8400-e29b-41d4-a716-446655440005',
 'Mình thích Green Switch của Razer, clicky nghe phê. Nhưng 6 triệu hơi đắt, có lựa chọn nào rẻ hơn không?',
 16, 1, NOW() - INTERVAL '8 days'),

-- Comments on Post 10: Headset Review
('750e8400-e29b-41d4-a716-446655440014',
 '950e8400-e29b-41d4-a716-446655440010',
 '550e8400-e29b-41d4-a716-446655440006',
 '300 hours battery life is insane! I charge this headset like once a month. Best wireless headset ever.',
 27, 0, NOW() - INTERVAL '12 hours');

-- Nested replies to comments
INSERT INTO comments (id, post_id, user_id, parent_id, content, upvote_count, downvote_count, created_at) VALUES
-- Reply to comment 1 (RTX 4090 discussion)
('750e8400-e29b-41d4-a716-446655440015',
 '950e8400-e29b-41d4-a716-446655440001',
 '550e8400-e29b-41d4-a716-446655440004',
 '750e8400-e29b-41d4-a716-446655440001',
 'Same here! 3080 is still plenty powerful for 1440p gaming. No need to upgrade yet unless you have money to burn.',
 8, 0, NOW() - INTERVAL '5 days'),

-- Reply to comment 2 (Power consumption)
('750e8400-e29b-41d4-a716-446655440016',
 '950e8400-e29b-41d4-a716-446655440001',
 '550e8400-e29b-41d4-a716-446655440001',
 '750e8400-e29b-41d4-a716-446655440002',
 'We recommend at least 1000W PSU for RTX 4090 builds. Better safe than sorry!',
 12, 0, NOW() - INTERVAL '5 days'),

-- Reply to comment 4 (ASUS vs Legion comparison)
('750e8400-e29b-41d4-a716-446655440017',
 '950e8400-e29b-41d4-a716-446655440002',
 '550e8400-e29b-41d4-a716-446655440002',
 '750e8400-e29b-41d4-a716-446655440004',
 'Legion 5 Pro tốt đấy nhưng thiết kế không đẹp bằng ROG. Còn tùy sở thích từng người thôi bạn.',
 7, 1, NOW() - INTERVAL '3 days'),

-- Reply to comment 6 (Case discussion)
('750e8400-e29b-41d4-a716-446655440018',
 '950e8400-e29b-41d4-a716-446655440003',
 '550e8400-e29b-41d4-a716-446655440008',
 '750e8400-e29b-41d4-a716-446655440006',
 'Airflow > Aesthetics! Get a case with good airflow first. You can add RGB fans later for looks.',
 11, 0, NOW() - INTERVAL '1 day'),

-- Reply to comment 11 (Water cooling fear)
('750e8400-e29b-41d4-a716-446655440019',
 '950e8400-e29b-41d4-a716-446655440007',
 '550e8400-e29b-41d4-a716-446655440004',
 '750e8400-e29b-41d4-a716-446655440011',
 'Just do proper leak testing before powering on! Run the pump for 24 hours with paper towels around all fittings.',
 9, 0, NOW() - INTERVAL '4 days'),

-- Reply to comment 13 (Keyboard alternatives)
('750e8400-e29b-41d4-a716-446655440020',
 '950e8400-e29b-41d4-a716-446655440009',
 '550e8400-e29b-41d4-a716-446655440007',
 '750e8400-e29b-41d4-a716-446655440013',
 'Thử Keychron K2 hoặc Royal Kludge đi bạn. Giá chỉ 2-3 triệu mà switch cũng ngon, có hotswap nữa.',
 13, 0, NOW() - INTERVAL '7 days');

-- Verify
SELECT
  c.id,
  c.content,
  c.upvote_count,
  u.username,
  p.title as post_title,
  CASE WHEN c.parent_id IS NULL THEN 'Top-level' ELSE 'Reply' END as comment_type
FROM comments c
JOIN users u ON c.user_id = u.id
JOIN posts p ON c.post_id = p.id
ORDER BY c.created_at DESC
LIMIT 20;
