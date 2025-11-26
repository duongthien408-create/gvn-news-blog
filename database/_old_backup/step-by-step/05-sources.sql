-- BƯỚC 5: Insert Sources
INSERT INTO sources (id, name, type, url, active) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'Scrapshut YouTube', 'api', 'https://www.youtube.com/@scrapshut', true),
('750e8400-e29b-41d4-a716-446655440002', 'Linus Tech Tips', 'api', 'https://www.youtube.com/@LinusTechTips', true);

-- Kiểm tra
SELECT name, type, active FROM sources;
