-- ============================================
-- STEP 5: SEED SAMPLE POSTS
-- ============================================

INSERT INTO posts (creator_id, type, status, title, title_vi, summary, summary_vi, source_url, thumbnail_url, published_at) VALUES
    -- News (public)
    ((SELECT id FROM creators WHERE slug = 'the-verge'), 'news', 'public',
     'NVIDIA announces RTX 5090 with 32GB GDDR7 memory',
     'NVIDIA công bố RTX 5090 với 32GB bộ nhớ GDDR7',
     'NVIDIA has officially unveiled its next-generation flagship GPU, the GeForce RTX 5090, featuring 32GB of cutting-edge GDDR7 memory.',
     'NVIDIA chính thức ra mắt GPU flagship thế hệ mới, GeForce RTX 5090, với 32GB bộ nhớ GDDR7 tiên tiến.',
     'https://www.theverge.com/2024/nvidia-rtx-5090',
     'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800',
     NOW() - INTERVAL '2 hours');

INSERT INTO posts (creator_id, type, status, title, title_vi, summary, summary_vi, source_url, thumbnail_url, published_at) VALUES
    -- News (draft)
    ((SELECT id FROM creators WHERE slug = 'toms-hardware'), 'news', 'draft',
     'AMD Ryzen 9000 Series crushes Intel in gaming benchmarks',
     NULL,
     'New benchmarks show AMD Ryzen 9000 series outperforming Intel latest offerings by up to 25% in gaming workloads.',
     NULL,
     'https://www.tomshardware.com/amd-ryzen-9000-benchmarks',
     'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800',
     NULL);

INSERT INTO posts (creator_id, type, status, title, title_vi, summary, summary_vi, source_url, thumbnail_url, published_at) VALUES
    -- Review (public)
    ((SELECT id FROM creators WHERE slug = 'linus-tech-tips'), 'review', 'public',
     'RTX 4090 vs RTX 5090 - Is it worth the upgrade?',
     'RTX 4090 vs RTX 5090 - Có đáng để nâng cấp?',
     'We test NVIDIA new flagship against its predecessor to see if the performance gains justify the price.',
     'Chúng tôi so sánh flagship mới của NVIDIA với phiên bản trước để xem hiệu năng có xứng đáng với giá tiền.',
     'https://www.youtube.com/watch?v=example1',
     'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800',
     NOW() - INTERVAL '1 day');

INSERT INTO posts (creator_id, type, status, title, title_vi, summary, summary_vi, source_url, thumbnail_url, published_at) VALUES
    -- Review (public)
    ((SELECT id FROM creators WHERE slug = 'gamers-nexus'), 'review', 'public',
     'Best Budget Gaming Mouse 2024 - Top 5 Picks',
     'Chuột Gaming Giá Rẻ Tốt Nhất 2024 - Top 5 Lựa Chọn',
     'We have tested over 30 budget gaming mice to find the best options under $50.',
     'Chúng tôi đã test hơn 30 chuột gaming giá rẻ để tìm ra lựa chọn tốt nhất dưới $50.',
     'https://www.youtube.com/watch?v=example2',
     'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800',
     NOW() - INTERVAL '3 hours');

INSERT INTO posts (creator_id, type, status, title, title_vi, summary, summary_vi, source_url, thumbnail_url, published_at) VALUES
    -- Review (public) - Today
    ((SELECT id FROM creators WHERE slug = 'jayztwocents'), 'review', 'public',
     'Building the Ultimate 4K Gaming PC in 2024',
     'Xây Dựng PC Gaming 4K Đỉnh Cao Năm 2024',
     'Step by step guide to building a monster 4K gaming rig without breaking the bank.',
     'Hướng dẫn từng bước xây dựng PC gaming 4K khủng mà không tốn quá nhiều tiền.',
     'https://www.youtube.com/watch?v=example3',
     'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800',
     NOW());
