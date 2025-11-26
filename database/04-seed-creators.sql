-- ============================================
-- STEP 4: SEED CREATORS
-- ============================================

-- Clear existing data first
DELETE FROM post_tags;
DELETE FROM posts;
DELETE FROM creators;

-- YouTube Channels (for reviews)
INSERT INTO creators (name, slug, avatar_url, channel_url) VALUES
    ('Linus Tech Tips', 'linus-tech-tips', 'https://yt3.googleusercontent.com/Vy6KL7EM_apxPSxF0pPy5w_c87YDTOlBQo3MADZ0rnBB6R2CLXmXYYmqR2eGFnEkjrZ4CkBK=s160-c-k-c0x00ffffff-no-rj', 'https://www.youtube.com/@LinusTechTips'),
    ('GamersNexus', 'gamers-nexus', 'https://yt3.googleusercontent.com/ytc/AIdro_niS3VFe0PyqQEoGQGZkStGu-3UYlFpYjJdfJLSdkFB2g=s160-c-k-c0x00ffffff-no-rj', 'https://www.youtube.com/@GamersNexus'),
    ('Jayz Two Cents', 'jayztwocents', 'https://yt3.googleusercontent.com/ytc/AIdro_kMv5MBskXTOqMh-PA9AhfZdOuGHX5p1BkUABx9pw=s160-c-k-c0x00ffffff-no-rj', 'https://www.youtube.com/@Jayztwocents');

-- RSS News Sources (for tech news)
INSERT INTO creators (name, slug, avatar_url, channel_url) VALUES
    ('Tom''s Hardware', 'toms-hardware', 'https://www.tomshardware.com/favicon.ico', 'https://www.tomshardware.com/feeds/all'),
    ('TechPowerUp', 'techpowerup', 'https://www.techpowerup.com/favicon.ico', 'https://www.techpowerup.com/rss/news'),
    ('Engadget', 'engadget', 'https://www.engadget.com/favicon.ico', 'https://www.engadget.com/rss.xml');
