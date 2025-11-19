-- BƯỚC 9: Insert Comments
INSERT INTO comments (id, post_id, user_id, content, upvote_count, created_at) VALUES

('c50e8400-e29b-41d4-a716-446655440001',
'a50e8400-e29b-41d4-a716-446655440001',
'550e8400-e29b-41d4-a716-446655440002',
'Laptop này mình đang dùng, hiệu năng rất tốt cho gaming và render!',
5,
NOW() - INTERVAL '4 days'),

('c50e8400-e29b-41d4-a716-446655440002',
'a50e8400-e29b-41d4-a716-446655440001',
'550e8400-e29b-41d4-a716-446655440003',
'Pin có trụ được bao lâu khi chơi game không bạn?',
2,
NOW() - INTERVAL '4 days'),

('c50e8400-e29b-41d4-a716-446655440003',
'a50e8400-e29b-41d4-a716-446655440002',
'550e8400-e29b-41d4-a716-446655440002',
'G Pro Superlight thật sự xứng đáng top 1!',
8,
NOW() - INTERVAL '3 days'),

('c50e8400-e29b-41d4-a716-446655440004',
'a50e8400-e29b-41d4-a716-446655440003',
'550e8400-e29b-41d4-a716-446655440003',
'Cảm ơn bài hướng dẫn chi tiết, rất hữu ích!',
6,
NOW() - INTERVAL '2 days'),

('c50e8400-e29b-41d4-a716-446655440005',
'a50e8400-e29b-41d4-a716-446655440004',
'550e8400-e29b-41d4-a716-446655440002',
'RTX 4080 đã quá đủ cho gaming 4K, không cần 4090',
12,
NOW() - INTERVAL '6 days');

-- Kiểm tra
SELECT c.content, u.username, p.title
FROM comments c
JOIN users u ON c.user_id = u.id
JOIN posts p ON c.post_id = p.id
ORDER BY c.created_at DESC;
