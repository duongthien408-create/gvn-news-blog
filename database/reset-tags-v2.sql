-- ============================================
-- RESET TAGS V2 - Xóa tags cũ, thêm 85 tags mới
-- ============================================

-- STEP 1: Thêm cột mới vào bảng tags
ALTER TABLE tags ADD COLUMN IF NOT EXISTS tag_group VARCHAR(50) DEFAULT 'product_category';
ALTER TABLE tags ADD COLUMN IF NOT EXISTS keywords TEXT[];
ALTER TABLE tags ADD COLUMN IF NOT EXISTS description_vi VARCHAR(255);

-- STEP 2: Xóa toàn bộ post_tags và tags cũ
DELETE FROM post_tags;
DELETE FROM tags;

-- STEP 3: Insert 85 tags mới

-- PRODUCT_CATEGORY (43 tags)
INSERT INTO tags (name, slug, tag_group, description_vi, keywords) VALUES
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
('laptop-gaming', 'laptop-gaming', 'product_category', 'Laptop gaming', ARRAY['laptop gaming', 'Legion', 'ROG', 'Predator', 'Helios']),
('laptop-van-phong', 'laptop-van-phong', 'product_category', 'Laptop văn phòng', ARRAY['laptop văn phòng', 'ultrabook', 'ThinkPad']),
('laptop-creator', 'laptop-creator', 'product_category', 'Laptop creator', ARRAY['creator', 'ProArt', 'ZenBook Pro']),
('macbook', 'macbook', 'product_category', 'MacBook', ARRAY['MacBook']),
('mini-pc', 'mini-pc', 'product_category', 'Mini PC', ARRAY['mini PC', 'NUC', 'GEEKOM', 'Minisforum']),
('pc-dong-bo', 'pc-dong-bo', 'product_category', 'PC đồng bộ', ARRAY['PC đồng bộ', 'prebuilt', 'desktop']),
('handheld-pc', 'handheld-pc', 'product_category', 'Handheld PC', ARRAY['ROG Ally', 'Steam Deck', 'handheld', 'cầm tay']),
('monitor-gaming', 'monitor-gaming', 'product_category', 'Màn hình gaming', ARRAY['gaming monitor', 'màn hình gaming', '240Hz', '360Hz']),
('monitor-van-phong', 'monitor-van-phong', 'product_category', 'Màn hình văn phòng', ARRAY['màn hình văn phòng']),
('monitor-oled', 'monitor-oled', 'product_category', 'Màn hình OLED', ARRAY['OLED monitor', 'màn hình OLED']),
('monitor-4k', 'monitor-4k', 'product_category', 'Màn hình 4K', ARRAY['4K monitor', 'UHD']),
('monitor-ultrawide', 'monitor-ultrawide', 'product_category', 'Màn hình ultrawide', ARRAY['ultrawide', '21:9', '32:9']),
('chuot', 'chuot', 'product_category', 'Chuột', ARRAY['chuột', 'mouse']),
('ban-phim', 'ban-phim', 'product_category', 'Bàn phím', ARRAY['bàn phím', 'keyboard', 'mechanical']),
('tai-nghe', 'tai-nghe', 'product_category', 'Tai nghe', ARRAY['tai nghe', 'headset', 'headphone']),
('webcam', 'webcam', 'product_category', 'Webcam', ARRAY['webcam']),
('controller', 'controller', 'product_category', 'Tay cầm chơi game', ARRAY['controller', 'tay cầm', 'gamepad']),
('gear-gaming', 'gear-gaming', 'product_category', 'Phụ kiện gaming', ARRAY['gaming gear', 'phụ kiện gaming']),
('smartphone', 'smartphone', 'product_category', 'Điện thoại', ARRAY['smartphone', 'điện thoại']),
('tablet', 'tablet', 'product_category', 'Máy tính bảng', ARRAY['tablet', 'iPad', 'máy tính bảng']),
('smartwatch', 'smartwatch', 'product_category', 'Đồng hồ thông minh', ARRAY['smartwatch', 'đồng hồ thông minh']),
('tws', 'tws', 'product_category', 'Tai nghe TWS', ARRAY['TWS', 'true wireless', 'AirPods']),
('iphone', 'iphone', 'product_category', 'iPhone', ARRAY['iPhone']),
('android', 'android', 'product_category', 'Android', ARRAY['Android', 'Galaxy', 'Pixel']),
('nintendo', 'nintendo', 'product_category', 'Nintendo', ARRAY['Nintendo', 'Switch']),
('xbox', 'xbox', 'product_category', 'Xbox', ARRAY['Xbox']),
('playstation', 'playstation', 'product_category', 'PlayStation', ARRAY['PlayStation', 'PS5']),
('console', 'console', 'product_category', 'Console', ARRAY['console']),
('game', 'game', 'product_category', 'Game', ARRAY['game', 'DLC', 'expansion', 'sequel']),
('server', 'server', 'product_category', 'Server', ARRAY['server', 'workstation']),
('data-center', 'data-center', 'product_category', 'Data center', ARRAY['data center', 'cloud']),
('ai-server', 'ai-server', 'product_category', 'AI Server', ARRAY['AI server', 'GPU server']);

-- BRAND (30 tags)
INSERT INTO tags (name, slug, tag_group, description_vi, keywords) VALUES
('intel', 'intel', 'brand', 'Intel', ARRAY['Intel', 'Core i', 'Core Ultra', 'Xeon']),
('amd', 'amd', 'brand', 'AMD', ARRAY['AMD', 'Ryzen', 'EPYC', 'Threadripper']),
('qualcomm', 'qualcomm', 'brand', 'Qualcomm', ARRAY['Qualcomm', 'Snapdragon']),
('apple-silicon', 'apple-silicon', 'brand', 'Apple Silicon', ARRAY['Apple M', 'M1', 'M2', 'M3', 'M4']),
('nvidia', 'nvidia', 'brand', 'NVIDIA', ARRAY['NVIDIA', 'GeForce', 'RTX', 'Quadro', 'DLSS']),
('radeon', 'radeon', 'brand', 'AMD Radeon', ARRAY['Radeon', 'RX', 'FSR']),
('tsmc', 'tsmc', 'brand', 'TSMC', ARRAY['TSMC']),
('samsung', 'samsung', 'brand', 'Samsung', ARRAY['Samsung']),
('sk-hynix', 'sk-hynix', 'brand', 'SK Hynix', ARRAY['SK Hynix', 'SK hynix']),
('micron', 'micron', 'brand', 'Micron', ARRAY['Micron']),
('lenovo', 'lenovo', 'brand', 'Lenovo', ARRAY['Lenovo', 'ThinkPad', 'IdeaPad', 'Legion']),
('asus', 'asus', 'brand', 'ASUS', ARRAY['ASUS', 'ZenBook', 'VivoBook']),
('rog', 'rog', 'brand', 'ROG', ARRAY['ROG', 'Republic of Gamers']),
('hp', 'hp', 'brand', 'HP', ARRAY['HP', 'Pavilion', 'Omen', 'Spectre']),
('dell', 'dell', 'brand', 'Dell', ARRAY['Dell', 'XPS', 'Alienware']),
('acer', 'acer', 'brand', 'Acer', ARRAY['Acer', 'Predator', 'Nitro']),
('msi', 'msi', 'brand', 'MSI', ARRAY['MSI']),
('apple', 'apple', 'brand', 'Apple', ARRAY['Apple', 'iPhone', 'MacBook', 'iPad']),
('gigabyte', 'gigabyte', 'brand', 'Gigabyte', ARRAY['Gigabyte', 'AORUS']),
('logitech', 'logitech', 'brand', 'Logitech', ARRAY['Logitech']),
('razer', 'razer', 'brand', 'Razer', ARRAY['Razer']),
('steelseries', 'steelseries', 'brand', 'SteelSeries', ARRAY['SteelSeries']),
('cooler-master', 'cooler-master', 'brand', 'Cooler Master', ARRAY['Cooler Master']),
('corsair', 'corsair', 'brand', 'Corsair', ARRAY['Corsair']),
('microsoft', 'microsoft', 'brand', 'Microsoft', ARRAY['Microsoft', 'Windows', 'Xbox']),
('google', 'google', 'brand', 'Google', ARRAY['Google', 'Android', 'Pixel']),
('meta', 'meta', 'brand', 'Meta', ARRAY['Meta', 'Facebook']),
('valve', 'valve', 'brand', 'Valve', ARRAY['Valve', 'Steam']),
('ubisoft', 'ubisoft', 'brand', 'Ubisoft', ARRAY['Ubisoft', 'Assassin''s Creed']),
('ea', 'ea', 'brand', 'EA', ARRAY['EA', 'Electronic Arts', 'Battlefield']);

-- TECHNOLOGY (12 tags)
INSERT INTO tags (name, slug, tag_group, description_vi, keywords) VALUES
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

-- VERIFY
SELECT tag_group, COUNT(*) as count FROM tags GROUP BY tag_group ORDER BY tag_group;
