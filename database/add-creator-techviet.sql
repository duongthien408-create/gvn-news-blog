-- =====================================================
-- ADD 1 CREATOR: TechViet Review + 10 Posts
-- =====================================================

-- Insert creator
INSERT INTO creators (name, slug, bio, avatar_url, verified, website, total_followers, total_posts, created_at)
VALUES (
    'TechViet Review',
    'techviet-review',
    'Kênh review công nghệ uy tín tại Việt Nam. Chuyên đánh giá laptop, PC, gaming gear.',
    'https://ui-avatars.com/api/?name=TechViet&background=FF6B6B&color=fff&size=200',
    true,
    'https://techviet.vn',
    25000,
    10,
    NOW() - INTERVAL '1 year'
)
RETURNING id;

-- Note the ID returned above, then use it in the next steps
-- Or run this to get the ID:
-- SELECT id FROM creators WHERE slug = 'techviet-review';

-- Add social media (replace CREATOR_ID with actual UUID)
-- INSERT INTO creator_socials (creator_id, platform, url, follower_count) VALUES
-- ('CREATOR_ID', 'youtube', 'https://youtube.com/@techvietreview', 25000),
-- ('CREATOR_ID', 'facebook', 'https://facebook.com/techvietreview', 12000);

-- Add 10 posts (replace CREATOR_ID with actual UUID)
-- INSERT INTO posts (title, slug, description, content, thumbnail_url, type, status, featured, upvote_count, comment_count, view_count, created_at, published_at)
-- VALUES ...
-- Then link to creator:
-- INSERT INTO post_creators (post_id, creator_id) VALUES ...
