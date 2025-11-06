-- ============================================
-- INSERT 30 VIDEO MẪU VỀ TECH/GAMING
-- Date: 2025-11-06
-- Description: 30 video posts với đầy đủ fields
-- ============================================

INSERT INTO posts (
    id,
    title,
    excerpt,
    content,
    cover_image,
    creator_id,
    creator_name,
    creator_avatar,
    category,
    tags,
    read_time,
    published,
    content_type,
    video_url,
    video_thumbnail,
    video_duration,
    video_platform,
    transcript
) VALUES

-- VIDEO 1: RTX 4090 Review
(
    'video-rtx4090-review',
    'Đánh giá chi tiết NVIDIA RTX 4090 - Card đồ họa mạnh nhất thế giới',
    'Trải nghiệm toàn diện về RTX 4090 với benchmark gaming 4K, ray tracing, và DLSS 3. Liệu có đáng giá 40 triệu?',
    '# NVIDIA RTX 4090 Review

## Giới thiệu
RTX 4090 là card đồ họa flagship của NVIDIA thế hệ Ada Lovelace. Với 24GB GDDR6X và 16,384 CUDA cores, đây là monster GPU cho gaming 4K và content creation.

## Benchmark Gaming
- Cyberpunk 2077 (4K Ultra + RT): 120 FPS
- Hogwarts Legacy (4K Ultra): 144 FPS
- Red Dead Redemption 2 (4K Ultra): 165 FPS

## Kết luận
Đây là card đồ họa tốt nhất hiện nay, nhưng giá rất cao. Chỉ phù hợp với người dùng cần sức mạnh tối đa.',
    'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1200',
    'linus-tech',
    'Linus Sebastian',
    'https://ui-avatars.com/api/?name=Linus+Sebastian&background=ef4444&color=fff',
    'hardware',
    ARRAY['rtx4090', 'nvidia', 'gpu', 'gaming', 'benchmark'],
    '15 min',
    true,
    'video',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1200',
    '15:30',
    'youtube',
    'Today we are reviewing the NVIDIA RTX 4090, the most powerful graphics card ever created. With 24GB of GDDR6X memory and 16,384 CUDA cores, this GPU delivers unprecedented performance for 4K gaming and content creation...'
),

-- VIDEO 2: AMD Ryzen 9 7950X3D
(
    'video-ryzen-7950x3d',
    'AMD Ryzen 9 7950X3D - CPU gaming tốt nhất 2024',
    'So sánh hiệu năng gaming giữa Ryzen 9 7950X3D và Intel Core i9-14900K. Kết quả bất ngờ!',
    '# AMD Ryzen 9 7950X3D Review

## Thông số kỹ thuật
- 16 cores / 32 threads
- 3D V-Cache 128MB
- Base clock 4.2GHz, Boost 5.7GHz
- TDP 120W

## Gaming Performance
So với Intel i9-14900K:
- CS:GO: +15% FPS
- Valorant: +12% FPS
- League of Legends: +18% FPS

## Kết luận
CPU gaming tốt nhất hiện nay với 3D V-Cache.',
    'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=1200',
    'hardware-unboxed',
    'Hardware Unboxed',
    'https://ui-avatars.com/api/?name=Hardware+Unboxed&background=10b981&color=fff',
    'hardware',
    ARRAY['amd', 'ryzen', 'cpu', 'gaming', '7950x3d'],
    '18 min',
    true,
    'video',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=1200',
    '18:24',
    'youtube',
    'The AMD Ryzen 9 7950X3D is the ultimate gaming CPU with 3D V-Cache technology...'
),

-- VIDEO 3: Gaming Laptop 2024
(
    'video-gaming-laptop-2024',
    'Top 5 Laptop Gaming Tốt Nhất 2024 - Từ 25 triệu đến 60 triệu',
    'Review chi tiết 5 laptop gaming hot nhất năm 2024 với đầy đủ benchmark, nhiệt độ, và trải nghiệm thực tế.',
    '# Top 5 Gaming Laptop 2024

## 1. ASUS ROG Strix G16 (60 triệu)
- RTX 4070, i9-13980HX
- 165Hz QHD display
- Nhiệt độ tốt, pin 6 giờ

## 2. Lenovo Legion Pro 7i (55 triệu)
- RTX 4060, i7-13700HX
- 240Hz FHD display

## 3. MSI Raider GE78 (58 triệu)
## 4. Acer Predator Helios 16 (45 triệu)
## 5. Dell G15 (25 triệu)

## Kết luận
ASUS ROG Strix G16 là lựa chọn tốt nhất.',
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=1200',
    'dave2d',
    'Dave Lee',
    'https://ui-avatars.com/api/?name=Dave+Lee&background=3b82f6&color=fff',
    'hardware',
    ARRAY['laptop', 'gaming', 'review', '2024', 'asus'],
    '22 min',
    true,
    'video',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=1200',
    '22:15',
    'youtube',
    'Here are the top 5 gaming laptops of 2024 ranging from budget to high-end...'
),

-- VIDEO 4: Build PC 30 triệu
(
    'video-pc-build-30m',
    'Hướng dẫn Build PC Gaming 30 triệu - Mạnh nhất phân khúc',
    'Build PC gaming 30 triệu với RTX 4060 Ti, i5-13600K. Hướng dẫn chi tiết từng bước và tips tiết kiệm.',
    '# Build PC Gaming 30 Triệu

## Part list
- CPU: Intel i5-13600K (6.5 triệu)
- GPU: RTX 4060 Ti 8GB (10 triệu)
- RAM: 32GB DDR5-6000 (3 triệu)
- SSD: 1TB NVMe Gen4 (2.5 triệu)
- PSU: 750W 80+ Gold (2 triệu)
- Case: NZXT H510 Flow (2 triệu)
- Mobo: Z790 (4 triệu)

**Tổng: 30 triệu**

## Performance
- 1080p Ultra: 144+ FPS
- 1440p High: 100+ FPS

## Tips tiết kiệm
- Mua GPU cũ: tiết kiệm 2-3 triệu',
    'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=1200',
    'bitwit',
    'Kyle (Bitwit)',
    'https://ui-avatars.com/api/?name=Kyle+Bitwit&background=f59e0b&color=fff',
    'hardware',
    ARRAY['pc-build', 'gaming', 'tutorial', 'budget', 'rtx4060'],
    '25 min',
    true,
    'video',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=1200',
    '25:40',
    'youtube',
    'Today I am building a 30 million VND gaming PC with RTX 4060 Ti and i5-13600K...'
),

-- VIDEO 5: Mechanical Keyboard 2024
(
    'video-mechanical-keyboard-2024',
    'Top 10 Bàn phím cơ tốt nhất 2024 - Custom & Pre-built',
    'Review 10 bàn phím cơ hot nhất từ budget đến high-end. Gateron, Cherry MX, Kailh switches so sánh chi tiết.',
    '# Top 10 Mechanical Keyboards 2024

## Custom Keyboards
1. **Mode Sonnet** (8 triệu)
   - Gasket mount, aluminum case
   - Gateron Oil King switches
   - Sound test: Thocky, deep

2. **Keychron Q6 Pro** (4 triệu)
   - QMK/VIA support
   - Hot-swappable

## Pre-built
3. **Logitech G Pro X TKL** (3 triệu)
4. **Razer Huntsman V3 Pro** (5 triệu)
5. **Corsair K70 RGB** (3.5 triệu)

## Budget Options
6. **Royal Kludge RK87** (1.2 triệu)
7. **Keychron K8** (2 triệu)
8. **Akko 3084B** (1.5 triệu)

## Kết luận
Mode Sonnet là tốt nhất nếu có budget.',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200',
    'taeha-types',
    'Taeha Types',
    'https://ui-avatars.com/api/?name=Taeha+Types&background=8b5cf6&color=fff',
    'peripherals',
    ARRAY['keyboard', 'mechanical', 'custom', 'gaming', 'typing'],
    '20 min',
    true,
    'video',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200',
    '20:10',
    'youtube',
    'Here are the top 10 mechanical keyboards of 2024 including custom builds and pre-builts...'
),

-- VIDEO 6: Monitor Gaming 2024
(
    'video-gaming-monitor-2024',
    'Màn hình Gaming 2024: OLED vs Mini-LED vs IPS - Nên chọn loại nào?',
    'So sánh chi tiết 3 công nghệ màn hình gaming phổ biến nhất. Test response time, color accuracy, burn-in.',
    '# Gaming Monitor Technology Comparison 2024

## OLED
**Ưu điểm:**
- Black level hoàn hảo (infinite contrast)
- Response time < 0.1ms
- Color gamut rộng nhất

**Nhược điểm:**
- Burn-in risk
- Giá cao (15-25 triệu)
- Độ sáng thấp hơn Mini-LED

**Recommended:** ASUS ROG Swift OLED PG27AQDM (22 triệu)

## Mini-LED
**Ưu điểm:**
- Độ sáng cao (1000+ nits)
- Không burn-in
- HDR tốt

**Nhược điểm:**
- Blooming effect
- Response time 1-2ms

**Recommended:** Samsung Odyssey Neo G8 (18 triệu)

## IPS
**Ưu điểm:**
- Giá rẻ nhất (4-10 triệu)
- Góc nhìn rộng
- Không burn-in

**Nhược điểm:**
- Black level kém
- Response time 3-5ms

**Recommended:** LG UltraGear 27GP850 (8 triệu)

## Kết luận
- **Competitive gaming:** IPS 360Hz
- **Single-player cinematic:** OLED
- **All-rounder:** Mini-LED',
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1200',
    'hardware-canucks',
    'Hardware Canucks',
    'https://ui-avatars.com/api/?name=Hardware+Canucks&background=ec4899&color=fff',
    'peripherals',
    ARRAY['monitor', 'oled', 'mini-led', 'ips', 'gaming', 'display'],
    '17 min',
    true,
    'video',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1200',
    '17:45',
    'youtube',
    'Comparing OLED vs Mini-LED vs IPS gaming monitors in 2024...'
),

-- VIDEO 7: Gaming Mouse
(
    'video-gaming-mouse-2024',
    'Top 5 Chuột Gaming Không Dây 2024 - Nhẹ, Nhanh, Chính Xác',
    'Review 5 chuột gaming wireless tốt nhất: Logitech G Pro X Superlight 2, Razer Viper V3 Pro, Finalmouse UltralightX.',
    '# Top 5 Wireless Gaming Mice 2024

## 1. Logitech G Pro X Superlight 2 (3.5 triệu)
- Weight: 60g
- Sensor: HERO 2 (32,000 DPI)
- Battery: 95 hours
- Latency: < 1ms
- **Rating: 10/10**

## 2. Razer Viper V3 Pro (3.2 triệu)
- Weight: 54g (nhẹ nhất)
- Sensor: Focus Pro 30K
- Battery: 90 hours
- **Rating: 9.5/10**

## 3. Finalmouse UltralightX (4 triệu)
- Weight: 55g
- Limited edition
- **Rating: 9/10**

## 4. Pulsar X2V2 (2.5 triệu)
- Best budget option
- Weight: 59g
- **Rating: 9/10**

## 5. Lamzu Atlantis (2.8 triệu)
- Ergo shape
- Weight: 55g
- **Rating: 8.5/10**

## Kết luận
G Pro X Superlight 2 vẫn là vua chuột gaming wireless.',
    'https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200',
    'optimum-tech',
    'Optimum Tech',
    'https://ui-avatars.com/api/?name=Optimum+Tech&background=06b6d4&color=fff',
    'peripherals',
    ARRAY['mouse', 'gaming', 'wireless', 'logitech', 'razer'],
    '14 min',
    true,
    'video',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200',
    '14:30',
    'youtube',
    'Testing the top 5 wireless gaming mice of 2024 including Logitech G Pro X Superlight 2...'
),

-- VIDEO 8: SSD NVMe 2024
(
    'video-nvme-ssd-2024',
    'SSD NVMe Gen5 có đáng mua? So sánh Gen3 vs Gen4 vs Gen5',
    'Benchmark chi tiết tốc độ đọc/ghi, load game, render video giữa 3 thế hệ SSD NVMe. Kết quả bất ngờ!',
    '# NVMe SSD Comparison: Gen3 vs Gen4 vs Gen5

## Test Setup
- CPU: Ryzen 9 7950X
- Mobo: X670E (PCIe 5.0 support)
- RAM: 64GB DDR5-6000

## Sequential Read/Write Speed
- **Gen3 (Samsung 970 EVO Plus):** 3,500 / 3,300 MB/s
- **Gen4 (Samsung 980 Pro):** 7,000 / 5,000 MB/s
- **Gen5 (Crucial T700):** 12,400 / 11,800 MB/s

## Real-world Performance
### Game Loading (Cyberpunk 2077)
- Gen3: 18.5 seconds
- Gen4: 17.2 seconds
- Gen5: 16.8 seconds
**Difference: < 2 seconds**

### Video Render (Adobe Premiere 4K)
- Gen3: 8m 45s
- Gen4: 8m 12s
- Gen5: 7m 58s
**Difference: < 1 minute**

## Giá cả
- Gen3 1TB: 1.8 triệu
- Gen4 1TB: 2.5 triệu
- Gen5 1TB: 4.5 triệu

## Kết luận
**Gen5 không đáng mua** cho gaming/normal use.
**Gen4 là sweet spot** về hiệu năng/giá.
Gen5 chỉ hữu ích cho workstation (large file transfer).',
    'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=1200',
    'linus-tech',
    'Linus Sebastian',
    'https://ui-avatars.com/api/?name=Linus+Sebastian&background=ef4444&color=fff',
    'storage',
    ARRAY['ssd', 'nvme', 'gen5', 'storage', 'benchmark'],
    '12 min',
    true,
    'video',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=1200',
    '12:20',
    'youtube',
    'Is NVMe Gen5 worth it for gaming? We test Gen3 vs Gen4 vs Gen5 SSDs...'
),

-- VIDEO 9: Headset Gaming
(
    'video-gaming-headset-2024',
    'Tai nghe Gaming vs Audiophile: Nên chọn loại nào cho gaming?',
    'So sánh SteelSeries Arctis Nova Pro vs Sennheiser HD 800S. Gaming headset có thực sự tốt cho gaming?',
    '# Gaming Headset vs Audiophile Headphones

## Gaming Headsets Tested
1. **SteelSeries Arctis Nova Pro** (6 triệu)
   - 7.1 Surround
   - Mic quality: Excellent
   - Comfort: 10/10

2. **HyperX Cloud Alpha Wireless** (4.5 triệu)
   - 300h battery
   - Sound: Good bass

3. **Razer BlackShark V2 Pro** (4 triệu)
   - THX Spatial Audio
   - Lightweight

## Audiophile Headphones
1. **Sennheiser HD 800S** (35 triệu)
   - Soundstage: INSANE
   - Imaging: Perfect
   - **Best for FPS gaming**

2. **Beyerdynamic DT 990 Pro** (3 triệu)
   - Open-back
   - Great for footsteps

## Test: CS2 Competitive
- **HD 800S:** Pinpoint accuracy, hear enemies from far
- **Arctis Nova Pro:** Good but not as accurate
- **HyperX Cloud Alpha:** Average

## Kết luận
**For competitive FPS:** Audiophile open-back + external mic
**For casual gaming + communication:** Gaming headset
**Best value:** Beyerdynamic DT 990 Pro (3 triệu)',
    'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=1200',
    'crinacle',
    'Crinacle',
    'https://ui-avatars.com/api/?name=Crinacle&background=14b8a6&color=fff',
    'audio',
    ARRAY['headset', 'audio', 'gaming', 'audiophile', 'sennheiser'],
    '19 min',
    true,
    'video',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=1200',
    '19:15',
    'youtube',
    'Comparing gaming headsets vs audiophile headphones for gaming performance...'
),

-- VIDEO 10: Webcam 2024
(
    'video-webcam-streaming-2024',
    'Top 5 Webcam cho Streaming & Work From Home 2024',
    'Review webcam từ 1 triệu đến 10 triệu: Logitech, Razer, Sony. So sánh chất lượng video, autofocus, low-light.',
    '# Top 5 Webcams for Streaming 2024

## Premium Tier
1. **Sony ZV-E10** (18 triệu + lens)
   - APS-C sensor (DSLR quality)
   - 4K 30fps
   - Bokeh effect
   - **Best image quality**

2. **Logitech Brio 4K** (5 triệu)
   - 4K 30fps / 1080p 60fps
   - HDR, autofocus
   - Wide FOV

## Mid-range
3. **Razer Kiyo Pro** (4 triệu)
   - 1080p 60fps
   - Adaptive light sensor
   - No ring light

4. **Elgato Facecam** (3.8 triệu)
   - 1080p 60fps
   - Pro software
   - No autofocus

## Budget
5. **Logitech C920** (1.5 triệu)
   - 1080p 30fps
   - Best value
   - Reliable

## Low-light Test
- Sony ZV-E10: A+ (best)
- Logitech Brio: A
- Razer Kiyo Pro: A-
- Elgato Facecam: B+
- Logitech C920: B

## Kết luận
- **Best overall:** Sony ZV-E10 (if have budget)
- **Best value:** Logitech Brio 4K
- **Budget king:** Logitech C920',
    'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=1200',
    'eposvox',
    'EposVox',
    'https://ui-avatars.com/api/?name=EposVox&background=a855f7&color=fff',
    'streaming',
    ARRAY['webcam', 'streaming', 'wfh', 'logitech', '4k'],
    '16 min',
    true,
    'video',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=1200',
    '16:50',
    'youtube',
    'Reviewing the top 5 webcams for streaming and work from home in 2024...'
),

-- VIDEO 11-15: Gaming Content
(
    'video-elden-ring-review',
    'Elden Ring DLC Shadow of the Erdtree - Review sau 100 giờ chơi',
    'Review toàn diện DLC mới nhất của Elden Ring. Boss design, map mới, difficulty, story. Có đáng mua không?',
    '# Elden Ring: Shadow of the Erdtree Review\n\nSau 100 giờ khám phá DLC mới nhất, đây là đánh giá toàn diện về Shadow of the Erdtree.\n\n## Story\nCâu chuyện tiếp nối sau ending của base game...\n\n## New Bosses\n15+ boss mới, trong đó có 8 main boss cực kỳ challenging.\n\n## Map Size\nMap mới lớn bằng 1/3 base game...',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200',
    'fextralife',
    'Fextralife',
    'https://ui-avatars.com/api/?name=Fextralife&background=dc2626&color=fff',
    'gaming',
    ARRAY['elden-ring', 'souls', 'fromsoftware', 'dlc', 'review'],
    '35 min',
    true,
    'video',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200',
    '35:20',
    'youtube',
    'After 100 hours in Elden Ring Shadow of the Erdtree DLC, here is my full review...'
),

(
    'video-valorant-tips-2024',
    'Valorant: 10 Tips để lên Rank nhanh từ Bronze lên Diamond',
    'Hướng dẫn chi tiết crosshair placement, utility usage, map control, communication. Áp dụng ngay để lên rank!',
    '# Valorant Ranking Up Guide 2024\n\n## Tip 1: Crosshair Placement\nLuôn giữ tâm ngắm ở head level...\n\n## Tip 2: Communication\nCallout đúng, ngắn gọn, rõ ràng...',
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200',
    'tenz',
    'TenZ',
    'https://ui-avatars.com/api/?name=TenZ&background=ef4444&color=fff',
    'esports',
    ARRAY['valorant', 'fps', 'tips', 'competitive', 'guide'],
    '18 min',
    true,
    'video',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200',
    '18:40',
    'youtube',
    'Here are 10 tips to rank up fast in Valorant from Bronze to Diamond...'
),

(
    'video-lol-worlds-2024',
    'League of Legends Worlds 2024 Finals - T1 vs JDG Highlights',
    'Trận chung kết nảy lửa giữa T1 và JDG tại Worlds 2024. Faker thể hiện đẳng cấp GOAT!',
    '# LOL Worlds 2024 Finals\n\n## Game 1: T1 Victory\nFaker pick Azir, clutch teamfight at Baron...\n\n## Game 2: JDG Victory\nKnight on Orianna...',
    'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=1200',
    'ls',
    'LS (Nick De Cesare)',
    'https://ui-avatars.com/api/?name=LS&background=3b82f6&color=fff',
    'esports',
    ARRAY['lol', 'worlds', 't1', 'faker', 'esports'],
    '45 min',
    true,
    'video',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=1200',
    '45:30',
    'youtube',
    'Full highlights and analysis of League of Legends Worlds 2024 Finals between T1 and JDG...'
),

(
    'video-dota2-ti12',
    'Dota 2 The International 12 - Team Liquid vs PSG.LGD Grand Finals',
    'Trận chung kết kịch tính nhất lịch sử TI. Game 5 nghẹt thở kéo dài 90 phút!',
    '# TI12 Grand Finals Analysis\n\n## Draft Phase\nTeam Liquid ban Invoker, pick Morphling...',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200',
    'jenkins',
    'Jenkins',
    'https://ui-avatars.com/api/?name=Jenkins&background=10b981&color=fff',
    'esports',
    ARRAY['dota2', 'ti12', 'esports', 'liquid', 'finals'],
    '52 min',
    true,
    'video',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200',
    '52:15',
    'youtube',
    'Breaking down the most intense TI12 Grand Finals between Team Liquid and PSG.LGD...'
),

(
    'video-baldurs-gate-3-guide',
    'Baldur''s Gate 3 - Hướng dẫn Build Paladin Smite cực mạnh cho Honor Mode',
    'Build Paladin Oath of Vengeance với multiclass Warlock. One-shot boss với Divine Smite combo!',
    '# BG3 Paladin Build Guide\n\n## Class: Paladin 6 / Warlock 2\n\n## Stats\nSTR 17, DEX 10, CON 14...',
    'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=1200',
    'mortismal',
    'Mortismal Gaming',
    'https://ui-avatars.com/api/?name=Mortismal&background=f59e0b&color=fff',
    'gaming',
    ARRAY['baldursgate3', 'rpg', 'build', 'guide', 'paladin'],
    '28 min',
    true,
    'video',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=1200',
    '28:45',
    'youtube',
    'Overpowered Paladin build guide for Baldur''s Gate 3 Honor Mode...'
),

-- VIDEO 16-20: Software & Productivity
(
    'video-windows-11-optimization',
    'Tối ưu Windows 11 cho Gaming - Tăng 30% FPS chỉ với vài thao tác',
    'Hướng dẫn disable bloatware, tweak registry, optimize services để tăng FPS đáng kể trong game.',
    '# Windows 11 Gaming Optimization Guide\n\n## 1. Disable Bloatware\nUninstall Xbox Game Bar, Cortana...\n\n## 2. Registry Tweaks\nDisable Windows Search indexing...',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200',
    'chris-titus',
    'Chris Titus Tech',
    'https://ui-avatars.com/api/?name=Chris+Titus&background=6366f1&color=fff',
    'software',
    ARRAY['windows11', 'optimization', 'gaming', 'fps', 'tweak'],
    '22 min',
    true,
    'video',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200',
    '22:30',
    'youtube',
    'Optimize Windows 11 for gaming and boost FPS by 30% with these tweaks...'
),

(
    'video-davinci-resolve-tutorial',
    'DaVinci Resolve 19 - Hướng dẫn Color Grading cho Beginner',
    'Tutorial chi tiết về color grading trong DaVinci Resolve 19. Từ cơ bản đến nâng cao với LUTs và curves.',
    '# DaVinci Resolve Color Grading Tutorial\n\n## Color Wheels\nPrimary correction using Lift/Gamma/Gain...\n\n## Curves\nRGB curves for fine-tuning...',
    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200',
    'casey-faris',
    'Casey Faris',
    'https://ui-avatars.com/api/?name=Casey+Faris&background=ec4899&color=fff',
    'tutorial',
    ARRAY['davinci', 'color-grading', 'video-editing', 'tutorial'],
    '32 min',
    true,
    'video',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200',
    '32:20',
    'youtube',
    'Complete beginner guide to color grading in DaVinci Resolve 19...'
),

(
    'video-obs-streaming-setup',
    'OBS Studio 2024 - Setup tối ưu cho Streaming chất lượng cao',
    'Cấu hình OBS Studio với x264/NVENC encoding, bitrate, output settings cho Twitch/YouTube streaming.',
    '# OBS Studio Streaming Setup 2024\n\n## Encoder Settings\n- NVENC (RTX 40 series): Best quality\n- x264: CPU encoding\n\n## Bitrate\n- Twitch: 6000 kbps\n- YouTube: 8000-12000 kbps',
    'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=1200',
    'eposvox',
    'EposVox',
    'https://ui-avatars.com/api/?name=EposVox&background=a855f7&color=fff',
    'streaming',
    ARRAY['obs', 'streaming', 'twitch', 'youtube', 'tutorial'],
    '26 min',
    true,
    'video',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=1200',
    '26:40',
    'youtube',
    'Complete OBS Studio setup guide for high quality streaming in 2024...'
),

(
    'video-chatgpt-productivity',
    'ChatGPT & AI Tools - Tăng năng suất làm việc 10x với AI',
    'Hướng dẫn sử dụng ChatGPT, Claude, Midjourney, và các AI tools khác để tăng năng suất công việc.',
    '# AI Productivity Tools Guide\n\n## ChatGPT Prompts\n- Code generation\n- Content writing\n- Data analysis\n\n## Claude AI\nLong-form content...',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200',
    'matt-wolfe',
    'Matt Wolfe',
    'https://ui-avatars.com/api/?name=Matt+Wolfe&background=06b6d4&color=fff',
    'ai',
    ARRAY['chatgpt', 'ai', 'productivity', 'automation', 'guide'],
    '24 min',
    true,
    'video',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200',
    '24:15',
    'youtube',
    '10x your productivity with ChatGPT and other AI tools - complete guide...'
),

(
    'video-notion-setup-2024',
    'Notion 2024 - Setup Workspace hoàn hảo cho Creator & Developer',
    'Template Notion cho task management, content calendar, project tracking. Import ngay và dùng!',
    '# Notion Workspace Setup 2024\n\n## Dashboard\nWidgets, calendar, quick links...\n\n## Content Calendar\nNotion database với multiple views...',
    'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200',
    'keep-productive',
    'Keep Productive',
    'https://ui-avatars.com/api/?name=Keep+Productive&background=14b8a6&color=fff',
    'productivity',
    ARRAY['notion', 'productivity', 'template', 'workspace', 'tutorial'],
    '20 min',
    true,
    'video',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200',
    '20:50',
    'youtube',
    'Complete Notion workspace setup for creators and developers in 2024...'
),

-- VIDEO 21-25: Tech News & Updates
(
    'video-nvidia-rtx-50-leak',
    'NVIDIA RTX 50 Series LEAKED - RTX 5090 mạnh gấp 2 lần RTX 4090?',
    'Tin rò rỉ mới nhất về RTX 50 series: specs, giá, ngày ra mắt. Blackwell architecture có gì mới?',
    '# RTX 50 Series Leaks & Rumors\n\n## RTX 5090 Specs (leaked)\n- CUDA Cores: 24,576 (50% more than 4090)\n- VRAM: 32GB GDDR7\n- TDP: 500W\n\n## Release Date\nQ4 2024...',
    'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1200',
    'moore-law-dead',
    'Moore''s Law Is Dead',
    'https://ui-avatars.com/api/?name=Moore+Law&background=ef4444&color=fff',
    'tech-news',
    ARRAY['nvidia', 'rtx5090', 'leak', 'gpu', 'news'],
    '15 min',
    true,
    'video',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1200',
    '15:20',
    'youtube',
    'Latest leaks about NVIDIA RTX 50 series - RTX 5090 specifications and release date...'
),

(
    'video-apple-m4-macbook',
    'Apple M4 MacBook Pro Review - Có đáng nâng cấp từ M3?',
    'Review chi tiết MacBook Pro M4: hiệu năng CPU/GPU, battery life, thermal, so sánh với M3 và Windows laptop.',
    '# MacBook Pro M4 Review\n\n## Performance\n- CPU: 30% faster than M3\n- GPU: 25% faster\n- Neural Engine: 2x faster\n\n## Battery Life\n18 hours video playback...',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200',
    'mkbhd',
    'MKBHD',
    'https://ui-avatars.com/api/?name=MKBHD&background=dc2626&color=fff',
    'tech-news',
    ARRAY['apple', 'm4', 'macbook', 'review', 'laptop'],
    '18 min',
    true,
    'video',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200',
    '18:30',
    'youtube',
    'Full review of the new Apple MacBook Pro with M4 chip - is it worth upgrading from M3?'
),

(
    'video-intel-meteor-lake',
    'Intel Core Ultra (Meteor Lake) - Có cứu được Intel?',
    'Review Intel Core Ultra 7 và Ultra 9: hiệu năng, hiệu suất năng lượng, AI performance. So sánh với AMD Ryzen.',
    '# Intel Core Ultra (Meteor Lake) Review\n\n## Architecture\n- Tiled design: Compute + Graphics + SoC + IO\n- NPU for AI acceleration\n\n## Performance vs AMD\n- Gaming: Still behind Ryzen\n- Efficiency: Better than 13th gen',
    'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=1200',
    'hardware-unboxed',
    'Hardware Unboxed',
    'https://ui-avatars.com/api/?name=Hardware+Unboxed&background=10b981&color=fff',
    'tech-news',
    ARRAY['intel', 'meteor-lake', 'cpu', 'review', 'core-ultra'],
    '22 min',
    true,
    'video',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=1200',
    '22:40',
    'youtube',
    'Reviewing Intel Core Ultra (Meteor Lake) - can it save Intel from AMD dominance?'
),

(
    'video-ps5-pro-announcement',
    'PlayStation 5 Pro CHÍNH THỨC - Giá 700 USD, 8K Gaming, Ray Tracing nâng cấp',
    'Sony công bố PS5 Pro với GPU mạnh gấp 2 lần PS5. Specs, giá, ngày ra mắt, và so sánh với Xbox Series X.',
    '# PlayStation 5 Pro Official Announcement\n\n## Specs\n- GPU: RDNA 3, 60 CUs\n- Ray Tracing: 2x performance\n- 8K gaming support\n- 2TB SSD\n\n## Price\n$700 USD (23 triệu VND)',
    'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=1200',
    'digital-foundry',
    'Digital Foundry',
    'https://ui-avatars.com/api/?name=Digital+Foundry&background=3b82f6&color=fff',
    'gaming',
    ARRAY['ps5-pro', 'playstation', 'console', 'gaming', 'news'],
    '25 min',
    true,
    'video',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=1200',
    '25:15',
    'youtube',
    'PlayStation 5 Pro officially announced - full specs, price, and comparison with PS5...'
),

(
    'video-starfield-dlc',
    'Starfield: Shattered Space DLC - Review sau 40 giờ chơi',
    'DLC đầu tiên của Starfield có cứu được game không? New planet, quests, weapons, và story analysis.',
    '# Starfield Shattered Space DLC Review\n\n## New Content\n- Planet: Va''ruun Homeworld\n- Main quest: 12 hours\n- Side quests: 15+\n- New weapons: 25+\n\n## Story\nVa''ruun religious cult...',
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200',
    'skillup',
    'Skill Up',
    'https://ui-avatars.com/api/?name=Skill+Up&background=f59e0b&color=fff',
    'gaming',
    ARRAY['starfield', 'dlc', 'bethesda', 'review', 'rpg'],
    '38 min',
    true,
    'video',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200',
    '38:50',
    'youtube',
    'Complete review of Starfield Shattered Space DLC after 40 hours of gameplay...'
),

-- VIDEO 26-30: Setup & Room Tours
(
    'video-gaming-setup-2024',
    'Gaming Setup Tour 2024 - Budget 100 triệu: PC, Monitor, Desk, Chair',
    'Tour chi tiết gaming setup với RTX 4080, Odyssey OLED, Herman Miller chair. Link mua mọi thiết bị trong description.',
    '# Gaming Setup Tour 2024\n\n## PC Build\n- GPU: RTX 4080\n- CPU: i7-14700K\n- RAM: 64GB DDR5\n\n## Peripherals\n- Monitor: Samsung Odyssey OLED\n- Keyboard: Mode Sonnet\n- Mouse: G Pro X Superlight 2',
    'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=1200',
    'randomfrankp',
    'randomfrankp',
    'https://ui-avatars.com/api/?name=randomfrankp&background=8b5cf6&color=fff',
    'setup',
    ARRAY['setup', 'gaming-room', 'tour', 'desk-setup', 'battlestation'],
    '20 min',
    true,
    'video',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=1200',
    '20:30',
    'youtube',
    'Full gaming setup tour 2024 with 100 million VND budget including PC, monitor, and peripherals...'
),

(
    'video-streaming-setup-guide',
    'Streaming Setup 2024 - Camera, Mic, Lighting cho Twitch/YouTube',
    'Hướng dẫn setup streaming studio từ đầu: Sony A6400, Shure SM7B, Elgato Key Light, Stream Deck.',
    '# Complete Streaming Setup Guide\n\n## Camera\n- Sony A6400 + Sigma 16mm f/1.4\n- Elgato Cam Link 4K\n\n## Audio\n- Mic: Shure SM7B\n- Interface: GoXLR\n\n## Lighting\n- Elgato Key Light x2',
    'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=1200',
    'harris-heller',
    'Harris Heller (Alpha Gaming)',
    'https://ui-avatars.com/api/?name=Harris+Heller&background=a855f7&color=fff',
    'streaming',
    ARRAY['streaming-setup', 'twitch', 'camera', 'microphone', 'lighting'],
    '28 min',
    true,
    'video',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=1200',
    '28:45',
    'youtube',
    'Complete streaming setup guide for Twitch and YouTube with camera, mic, and lighting recommendations...'
),

(
    'video-cable-management',
    'Cable Management Tutorial - Hướng dẫn sắp xếp dây cáp gọn gàng',
    'Tips & tricks để ẩn và sắp xếp dây cáp trên bàn làm việc. Sử dụng cable raceway, velcro, và under-desk tray.',
    '# Cable Management Guide\n\n## Tools Needed\n- Cable raceway\n- Velcro straps\n- Cable clips\n- Under-desk tray\n\n## Step-by-step\n1. Plan cable routing\n2. Use IKEA Signum\n3. Group cables by type',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
    'tech-source',
    'TechSource',
    'https://ui-avatars.com/api/?name=TechSource&background=06b6d4&color=fff',
    'setup',
    ARRAY['cable-management', 'desk-setup', 'tutorial', 'organization'],
    '15 min',
    true,
    'video',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
    '15:20',
    'youtube',
    'Complete cable management tutorial for clean desk setup - hide all cables...'
),

(
    'video-ergonomic-setup',
    'Ergonomic Desk Setup - Tránh đau lưng, đau cổ khi làm việc lâu',
    'Hướng dẫn setup bàn làm việc đúng tư thế: chiều cao màn hình, ghế, bàn phím, chuột. Phòng tránh chấn thương.',
    '# Ergonomic Setup Guide\n\n## Monitor Height\n- Top of screen at eye level\n- 50-70cm distance\n\n## Chair Setup\n- Feet flat on ground\n- 90° angle at knees\n- Lumbar support\n\n## Keyboard/Mouse\n- Elbows 90°',
    'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=1200',
    'branch-education',
    'Branch Education',
    'https://ui-avatars.com/api/?name=Branch+Education&background=14b8a6&color=fff',
    'productivity',
    ARRAY['ergonomic', 'health', 'desk-setup', 'posture', 'guide'],
    '18 min',
    true,
    'video',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=1200',
    '18:10',
    'youtube',
    'Complete ergonomic desk setup guide to prevent back pain and neck pain...'
),

(
    'video-minimalist-setup',
    'Minimalist Setup Tour - Clean, Simple, Aesthetic',
    'Setup tối giản với aesthetic hoàn hảo. White desk, minimal RGB, cable-free, plants. Link đồ decor trong description.',
    '# Minimalist Setup Tour 2024\n\n## Philosophy\n"Less is more" - Only essential items on desk\n\n## Color Scheme\n- White/beige theme\n- Natural wood accent\n- Minimal RGB (white only)\n\n## Desk Items\n- Monitor: LG UltraFine\n- Keyboard: HHKB\n- Mouse: MX Master 3\n- Lamp: BenQ ScreenBar\n- Plant: Monstera',
    'https://images.unsplash.com/photo-1547082661-6bb0e2600807?w=1200',
    'minimal-desk-setups',
    'Minimal Desk Setups',
    'https://ui-avatars.com/api/?name=Minimal+Setups&background=ec4899&color=fff',
    'setup',
    ARRAY['minimalist', 'aesthetic', 'setup-tour', 'desk-setup', 'decor'],
    '12 min',
    true,
    'video',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1547082661-6bb0e2600807?w=1200',
    '12:50',
    'youtube',
    'Minimalist desk setup tour - clean, simple, and aesthetic workspace...'
);

-- Verify insert thành công
SELECT
    id,
    title,
    content_type,
    video_platform,
    video_duration,
    category,
    array_length(tags, 1) as tag_count,
    created_at
FROM posts
WHERE content_type = 'video'
ORDER BY created_at DESC;

-- ============================================
-- HOÀN TẤT! Đã insert 30 video posts
-- Tiếp theo: Update frontend để hiển thị video
-- ============================================
