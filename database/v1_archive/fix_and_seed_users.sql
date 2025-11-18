-- ============================================
-- FIX AND SEED USERS
-- Delete old users and create 5 new ones
-- ============================================

-- Step 1: Delete old users and their relationships
DELETE FROM user_followers WHERE follower_id IN (1,2,3,4,5) OR following_id IN (1,2,3,4,5);
DELETE FROM company_followers WHERE user_id IN (1,2,3,4,5);
DELETE FROM user_saved_posts WHERE user_id IN (1,2,3,4,5);
DELETE FROM users WHERE id IN (1,2,3,4,5);

-- Step 2: Insert 5 new users
-- Note: password_hash is bcrypt hash of "password123" (for testing only)
INSERT INTO users (id, email, password_hash, username, full_name, avatar_url, bio, location, website, role, is_verified, company_id, job_title, created_at) VALUES
  (
    1,
    'thuan@gearvn.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'thuan_nguyen',
    'Thuận Nguyễn',
    'https://ui-avatars.com/api/?name=Thuan+Nguyen&background=3b82f6&color=fff&size=256',
    'Tech reviewer & gaming enthusiast. Chuyên review gear gaming và PC.',
    'Ho Chi Minh City, Vietnam',
    'https://gearvn.com',
    'creator',
    true,
    1,
    'Senior Content Creator',
    NOW()
  ),
  (
    2,
    'binh@gearvn.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'binh_bear',
    'Bình Bear',
    'https://ui-avatars.com/api/?name=Binh+Bear&background=10b981&color=fff&size=256',
    'Gaming guru & hardware specialist. Đam mê PC building và overclocking.',
    'Hanoi, Vietnam',
    'https://gearvn.com',
    'creator',
    true,
    1,
    'Hardware Specialist',
    NOW()
  ),
  (
    3,
    'tai@gearvn.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'tai_xai_tech',
    'Tài Xài Tech',
    'https://ui-avatars.com/api/?name=Tai+Xai+Tech&background=f59e0b&color=fff&size=256',
    'Tech unboxer & budget PC builder. Chuyên tư vấn build PC giá rẻ.',
    'Da Nang, Vietnam',
    'https://gearvn.com',
    'creator',
    true,
    1,
    'Tech Consultant',
    NOW()
  ),
  (
    4,
    'sang@gearvn.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'ngoc_sang',
    'Ngọc Sang',
    'https://ui-avatars.com/api/?name=Ngoc+Sang&background=8b5cf6&color=fff&size=256',
    'Esports analyst & peripherals expert. Chuyên về gaming gear và mechanical keyboards.',
    'Ho Chi Minh City, Vietnam',
    'https://gearvn.com',
    'creator',
    true,
    1,
    'Gaming Peripherals Expert',
    NOW()
  ),
  (
    5,
    'duong@gearvn.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'duong_thien',
    'Dương Thiện',
    'https://ui-avatars.com/api/?name=Duong+Thien&background=ef4444&color=fff&size=256',
    'Tech news & industry insights. Cập nhật tin tức công nghệ mới nhất.',
    'Ho Chi Minh City, Vietnam',
    'https://gearvn.com',
    'creator',
    true,
    1,
    'Tech News Editor',
    NOW()
  );

-- Step 3: Add social links
UPDATE users SET
  twitter_url = 'https://twitter.com/thuan_nguyen',
  facebook_url = 'https://facebook.com/thuan.nguyen',
  youtube_url = 'https://youtube.com/@thuannguyen'
WHERE id = 1;

UPDATE users SET
  twitter_url = 'https://twitter.com/binh_bear',
  youtube_url = 'https://youtube.com/@binhbear',
  github_url = 'https://github.com/binhbear'
WHERE id = 2;

UPDATE users SET
  youtube_url = 'https://youtube.com/@taixaitech',
  facebook_url = 'https://facebook.com/taixaitech'
WHERE id = 3;

UPDATE users SET
  twitter_url = 'https://twitter.com/ngocsang',
  linkedin_url = 'https://linkedin.com/in/ngocsang'
WHERE id = 4;

UPDATE users SET
  twitter_url = 'https://twitter.com/duongthien',
  linkedin_url = 'https://linkedin.com/in/duongthien',
  facebook_url = 'https://facebook.com/duong.thien'
WHERE id = 5;

-- Step 4: Create follow relationships
INSERT INTO user_followers (follower_id, following_id) VALUES
  (1, 2), -- Thuận follows Bình
  (1, 3), -- Thuận follows Tài
  (2, 1), -- Bình follows Thuận
  (2, 4), -- Bình follows Sang
  (3, 1), -- Tài follows Thuận
  (3, 5), -- Tài follows Dương
  (4, 2), -- Sang follows Bình
  (4, 5), -- Sang follows Dương
  (5, 1), -- Dương follows Thuận
  (5, 3); -- Dương follows Tài

-- Step 5: Update company employee count
UPDATE companies SET employees_count = 5 WHERE id = 1;

-- Done! Show results
SELECT 'Created 5 users successfully!' AS status;
SELECT id, username, full_name, job_title, followers_count, following_count FROM users WHERE id IN (1,2,3,4,5) ORDER BY id;
