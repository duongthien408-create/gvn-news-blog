-- ============================================
-- MIGRATION: TAGS V2 - FULL MIGRATION
-- ============================================
-- Phương án: Migrate hoàn toàn từ 13 tags cũ sang 85 tags mới
-- Bước 1: Thêm cột mới vào bảng tags
-- Bước 2: Insert tags mới
-- Bước 3: Map và migrate post_tags
-- Bước 4: Xóa tags cũ

-- ============================================
-- STEP 1: ALTER TABLE - Thêm cột tag_group và keywords
-- ============================================

ALTER TABLE tags ADD COLUMN IF NOT EXISTS tag_group VARCHAR(50) DEFAULT 'product_category';
ALTER TABLE tags ADD COLUMN IF NOT EXISTS keywords TEXT[];
ALTER TABLE tags ADD COLUMN IF NOT EXISTS description_vi VARCHAR(255);

-- ============================================
-- STEP 2: MAPPING TAGS CŨ → TAGS MỚI
-- ============================================
-- Tạo bảng tạm để lưu mapping
CREATE TEMP TABLE tag_mapping (
    old_slug VARCHAR(100),
    new_slug VARCHAR(100)
);

INSERT INTO tag_mapping (old_slug, new_slug) VALUES
    ('game', 'game'),           -- giữ nguyên
    ('ai', 'ai'),               -- giữ nguyên
    ('pc', 'pc-build'),         -- PC → pc-build
    ('ram', 'ram'),             -- giữ nguyên
    ('ssd', 'ssd'),             -- giữ nguyên
    ('cpu', 'cpu'),             -- giữ nguyên
    ('vga', 'gpu'),             -- VGA → gpu
    ('mainboard', 'mainboard'), -- giữ nguyên
    ('laptop', 'laptop-gaming'),-- LAPTOP → laptop-gaming (default)
    ('monitor', 'monitor-gaming'), -- MONITOR → monitor-gaming (default)
    ('mouse', 'chuot'),         -- MOUSE → chuot
    ('keyboard', 'ban-phim'),   -- KEYBOARD → ban-phim
    ('headset', 'tai-nghe');    -- HEADSET → tai-nghe

-- ============================================
-- STEP 3: INSERT 85 TAGS MỚI
-- ============================================

-- Xóa tags cũ trước (sẽ cascade xóa post_tags)
-- KHÔNG! Trước tiên phải migrate post_tags

-- Tạo bảng tags_new để insert tags mới
CREATE TEMP TABLE tags_new (
    id UUID DEFAULT uuid_generate_v4(),
    name VARCHAR(100),
    slug VARCHAR(100),
    tag_group VARCHAR(50),
    description_vi VARCHAR(255),
    keywords TEXT[]
);

-- PRODUCT_CATEGORY (43 tags)
INSERT INTO tags_new (name, slug, tag_group, description_vi, keywords) VALUES
-- PC Components
('cpu', 'cpu', 'product_category', 'Bộ vi xử lý', ARRAY['CPU', 'processor', 'Core i', 'Ryzen', 'Xeon', 'EPYC', 'vi xử lý', 'nhân']),
('gpu', 'gpu', 'product_category', 'Card đồ họa', ARRAY['GPU', 'graphics card', 'RTX', 'GeForce', 'Radeon', 'RX', 'card đồ họa', 'VGA']),
('ram', 'ram', 'product_category', 'Bộ nhớ RAM', ARRAY['RAM', 'DDR4', 'DDR5', 'memory', 'bộ nhớ']),
('ssd', 'ssd', 'product_category', 'Ổ cứng SSD', ARRAY['SSD', 'NVMe', 'ổ cứng SSD']),
('hdd', 'hdd', 'product_category', 'Ổ cứng HDD', ARRAY['HDD', 'hard drive']),
('mainboard', 'mainboard', 'product_category', 'Bo mạch chủ', ARRAY['mainboard', 'motherboard', 'bo mạch chủ', 'B760', 'Z790', 'X670']),
('psu', 'psu', 'product_category', 'Nguồn máy tính', ARRAY['PSU', 'power supply', 'nguồn']),
('case', 'case', 'product_category', 'Vỏ máy tính', ARRAY['case', 'vỏ máy']),
('cooling', 'cooling', 'product_category', 'Tản nhiệt', ARRAY['cooling', 'cooler', 'AIO', 'tản nhiệt', 'quạt']),
('pc-build', 'pc-build', 'product_category', 'Build PC linh kiện PC', ARRAY['build PC', 'linh kiện', 'PC']),
-- Laptop & PC
('laptop-gaming', 'laptop-gaming', 'product_category', 'Laptop gaming', ARRAY['laptop gaming', 'Legion', 'ROG', 'Predator', 'Helios']),
('laptop-van-phong', 'laptop-van-phong', 'product_category', 'Laptop văn phòng', ARRAY['laptop văn phòng', 'ultrabook', 'ThinkPad']),
('laptop-creator', 'laptop-creator', 'product_category', 'Laptop creator', ARRAY['creator', 'ProArt', 'ZenBook Pro']),
('macbook', 'macbook', 'product_category', 'MacBook', ARRAY['MacBook']),
('mini-pc', 'mini-pc', 'product_category', 'Mini PC', ARRAY['mini PC', 'NUC', 'GEEKOM', 'Minisforum']),
('pc-dong-bo', 'pc-dong-bo', 'product_category', 'PC đồng bộ', ARRAY['PC đồng bộ', 'prebuilt', 'desktop']),
('handheld-pc', 'handheld-pc', 'product_category', 'Handheld PC', ARRAY['ROG Ally', 'Steam Deck', 'handheld', 'cầm tay']),
-- Màn hình
('monitor-gaming', 'monitor-gaming', 'product_category', 'Màn hình gaming', ARRAY['gaming monitor', 'màn hình gaming', '240Hz', '360Hz']),
('monitor-van-phong', 'monitor-van-phong', 'product_category', 'Màn hình văn phòng', ARRAY['màn hình văn phòng']),
('monitor-oled', 'monitor-oled', 'product_category', 'Màn hình OLED', ARRAY['OLED monitor', 'màn hình OLED']),
('monitor-4k', 'monitor-4k', 'product_category', 'Màn hình 4K', ARRAY['4K monitor', 'UHD']),
('monitor-ultrawide', 'monitor-ultrawide', 'product_category', 'Màn hình ultrawide', ARRAY['ultrawide', '21:9', '32:9']),
-- Thiết bị ngoại vi
('chuot', 'chuot', 'product_category', 'Chuột', ARRAY['chuột', 'mouse']),
('ban-phim', 'ban-phim', 'product_category', 'Bàn phím', ARRAY['bàn phím', 'keyboard', 'mechanical']),
('tai-nghe', 'tai-nghe', 'product_category', 'Tai nghe', ARRAY['tai nghe', 'headset', 'headphone']),
('webcam', 'webcam', 'product_category', 'Webcam', ARRAY['webcam']),
('controller', 'controller', 'product_category', 'Tay cầm chơi game', ARRAY['controller', 'tay cầm', 'gamepad']),
('gear-gaming', 'gear-gaming', 'product_category', 'Phụ kiện gaming', ARRAY['gaming gear', 'phụ kiện gaming']),
-- Mobile & Wearable
('smartphone', 'smartphone', 'product_category', 'Điện thoại', ARRAY['smartphone', 'điện thoại']),
('tablet', 'tablet', 'product_category', 'Máy tính bảng', ARRAY['tablet', 'iPad', 'máy tính bảng']),
('smartwatch', 'smartwatch', 'product_category', 'Đồng hồ thông minh', ARRAY['smartwatch', 'đồng hồ thông minh']),
('tws', 'tws', 'product_category', 'Tai nghe TWS', ARRAY['TWS', 'true wireless', 'AirPods']),
('iphone', 'iphone', 'product_category', 'iPhone', ARRAY['iPhone']),
('android', 'android', 'product_category', 'Android', ARRAY['Android', 'Galaxy', 'Pixel']),
-- Console & Gaming
('nintendo', 'nintendo', 'product_category', 'Nintendo', ARRAY['Nintendo', 'Switch']),
('xbox', 'xbox', 'product_category', 'Xbox', ARRAY['Xbox']),
('playstation', 'playstation', 'product_category', 'PlayStation', ARRAY['PlayStation', 'PS5']),
('console', 'console', 'product_category', 'Console', ARRAY['console']),
('game', 'game', 'product_category', 'Game', ARRAY['game', 'DLC', 'expansion', 'sequel']),
-- Server & Enterprise
('server', 'server', 'product_category', 'Server', ARRAY['server', 'workstation']),
('data-center', 'data-center', 'product_category', 'Data center', ARRAY['data center', 'cloud']),
('ai-server', 'ai-server', 'product_category', 'AI Server', ARRAY['AI server', 'GPU server']);

-- BRAND (30 tags)
INSERT INTO tags_new (name, slug, tag_group, description_vi, keywords) VALUES
-- CPU & Chip
('intel', 'intel', 'brand', 'Intel', ARRAY['Intel', 'Core i', 'Core Ultra', 'Xeon']),
('amd', 'amd', 'brand', 'AMD', ARRAY['AMD', 'Ryzen', 'EPYC', 'Threadripper']),
('qualcomm', 'qualcomm', 'brand', 'Qualcomm', ARRAY['Qualcomm', 'Snapdragon']),
('apple-silicon', 'apple-silicon', 'brand', 'Apple Silicon', ARRAY['Apple M', 'M1', 'M2', 'M3', 'M4']),
-- GPU
('nvidia', 'nvidia', 'brand', 'NVIDIA', ARRAY['NVIDIA', 'GeForce', 'RTX', 'Quadro', 'DLSS']),
('radeon', 'radeon', 'brand', 'AMD Radeon', ARRAY['Radeon', 'RX', 'FSR']),
-- Foundry & Memory
('tsmc', 'tsmc', 'brand', 'TSMC', ARRAY['TSMC']),
('samsung', 'samsung', 'brand', 'Samsung', ARRAY['Samsung']),
('sk-hynix', 'sk-hynix', 'brand', 'SK Hynix', ARRAY['SK Hynix', 'SK hynix']),
('micron', 'micron', 'brand', 'Micron', ARRAY['Micron']),
-- Laptop & PC
('lenovo', 'lenovo', 'brand', 'Lenovo', ARRAY['Lenovo', 'ThinkPad', 'IdeaPad', 'Legion']),
('asus', 'asus', 'brand', 'ASUS', ARRAY['ASUS', 'ZenBook', 'VivoBook']),
('rog', 'rog', 'brand', 'ROG', ARRAY['ROG', 'Republic of Gamers']),
('hp', 'hp', 'brand', 'HP', ARRAY['HP', 'Pavilion', 'Omen', 'Spectre']),
('dell', 'dell', 'brand', 'Dell', ARRAY['Dell', 'XPS', 'Alienware']),
('acer', 'acer', 'brand', 'Acer', ARRAY['Acer', 'Predator', 'Nitro']),
('msi', 'msi', 'brand', 'MSI', ARRAY['MSI']),
('apple', 'apple', 'brand', 'Apple', ARRAY['Apple', 'iPhone', 'MacBook', 'iPad']),
('gigabyte', 'gigabyte', 'brand', 'Gigabyte', ARRAY['Gigabyte', 'AORUS']),
-- Gaming Gear
('logitech', 'logitech', 'brand', 'Logitech', ARRAY['Logitech']),
('razer', 'razer', 'brand', 'Razer', ARRAY['Razer']),
('steelseries', 'steelseries', 'brand', 'SteelSeries', ARRAY['SteelSeries']),
('cooler-master', 'cooler-master', 'brand', 'Cooler Master', ARRAY['Cooler Master']),
('corsair', 'corsair', 'brand', 'Corsair', ARRAY['Corsair']),
-- Software & Gaming
('microsoft', 'microsoft', 'brand', 'Microsoft', ARRAY['Microsoft', 'Windows', 'Xbox']),
('google', 'google', 'brand', 'Google', ARRAY['Google', 'Android', 'Pixel']),
('meta', 'meta', 'brand', 'Meta', ARRAY['Meta', 'Facebook']),
('valve', 'valve', 'brand', 'Valve', ARRAY['Valve', 'Steam']),
('ubisoft', 'ubisoft', 'brand', 'Ubisoft', ARRAY['Ubisoft', 'Assassin''s Creed']),
('ea', 'ea', 'brand', 'EA', ARRAY['EA', 'Electronic Arts', 'Battlefield']);

-- TECHNOLOGY (12 tags)
INSERT INTO tags_new (name, slug, tag_group, description_vi, keywords) VALUES
('ai', 'ai', 'technology', 'Trí tuệ nhân tạo', ARRAY['AI', 'artificial intelligence', 'machine learning', 'trí tuệ nhân tạo']),
('dlss', 'dlss', 'technology', 'NVIDIA DLSS', ARRAY['DLSS']),
('fsr', 'fsr', 'technology', 'AMD FSR', ARRAY['FSR']),
('ray-tracing', 'ray-tracing', 'technology', 'Ray Tracing', ARRAY['ray tracing']),
('hbm', 'hbm', 'technology', 'High Bandwidth Memory', ARRAY['HBM', 'HBM3', 'HBM4']),
('ddr5', 'ddr5', 'technology', 'DDR5 RAM', ARRAY['DDR5']),
('pcie-5', 'pcie-5', 'technology', 'PCIe 5.0', ARRAY['PCIe 5', 'Gen 5']),
('nvme', 'nvme', 'technology', 'NVMe SSD', ARRAY['NVMe']),
('wifi-7', 'wifi-7', 'technology', 'WiFi 7', ARRAY['WiFi 7', 'Wi-Fi 7']),
('oled', 'oled', 'technology', 'Công nghệ OLED', ARRAY['OLED']),
('usb-c', 'usb-c', 'technology', 'USB Type-C', ARRAY['USB-C', 'USB Type-C']),
('thunderbolt', 'thunderbolt', 'technology', 'Thunderbolt', ARRAY['Thunderbolt']);

-- ============================================
-- STEP 4: EXECUTE MIGRATION
-- ============================================

-- 4.1 Backup post_tags trước khi migrate
CREATE TEMP TABLE post_tags_backup AS
SELECT pt.post_id, t.slug as old_slug, tm.new_slug
FROM post_tags pt
JOIN tags t ON pt.tag_id = t.id
LEFT JOIN tag_mapping tm ON t.slug = tm.old_slug;

-- 4.2 Insert tags mới vào bảng tags chính
INSERT INTO tags (name, slug, tag_group, description_vi, keywords)
SELECT name, slug, tag_group, description_vi, keywords FROM tags_new
ON CONFLICT (slug) DO UPDATE SET
    tag_group = EXCLUDED.tag_group,
    description_vi = EXCLUDED.description_vi,
    keywords = EXCLUDED.keywords;

-- 4.3 Xóa tất cả post_tags cũ
DELETE FROM post_tags;

-- 4.4 Insert lại post_tags với tag_id mới
INSERT INTO post_tags (post_id, tag_id)
SELECT DISTINCT ptb.post_id, t.id
FROM post_tags_backup ptb
JOIN tags t ON t.slug = ptb.new_slug
WHERE ptb.new_slug IS NOT NULL;

-- 4.5 Xóa tags cũ không còn trong danh sách mới
DELETE FROM tags WHERE slug NOT IN (SELECT slug FROM tags_new);

-- ============================================
-- STEP 5: VERIFY
-- ============================================
-- Kiểm tra số lượng tags
SELECT 'Total tags' as metric, COUNT(*) as count FROM tags
UNION ALL
SELECT tag_group, COUNT(*) FROM tags GROUP BY tag_group
UNION ALL
SELECT 'Total post_tags', COUNT(*) FROM post_tags;

-- Cleanup temp tables
DROP TABLE IF EXISTS tag_mapping;
DROP TABLE IF EXISTS tags_new;
DROP TABLE IF EXISTS post_tags_backup;
