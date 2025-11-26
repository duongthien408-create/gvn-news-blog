-- =====================================================
-- PART 4: PRODUCTS, CATEGORIES & BRANDS
-- =====================================================

-- Product Categories
INSERT INTO product_categories (id, name, slug) VALUES
('a50e8400-e29b-41d4-a716-446655440001', 'Laptop', 'laptop'),
('a50e8400-e29b-41d4-a716-446655440002', 'PC Components', 'pc-components'),
('a50e8400-e29b-41d4-a716-446655440003', 'Peripherals', 'peripherals'),
('a50e8400-e29b-41d4-a716-446655440004', 'Cooling', 'cooling'),
('a50e8400-e29b-41d4-a716-446655440005', 'Audio', 'audio');

-- Brands
INSERT INTO brands (id, name, slug, logo_url) VALUES
('c50e8400-e29b-41d4-a716-446655440001', 'ASUS', 'asus', 'https://gearvn.com/brands/asus.png'),
('c50e8400-e29b-41d4-a716-446655440002', 'Logitech', 'logitech', 'https://gearvn.com/brands/logitech.png'),
('c50e8400-e29b-41d4-a716-446655440003', 'Razer', 'razer', 'https://gearvn.com/brands/razer.png'),
('c50e8400-e29b-41d4-a716-446655440004', 'NVIDIA', 'nvidia', 'https://gearvn.com/brands/nvidia.png'),
('c50e8400-e29b-41d4-a716-446655440005', 'AMD', 'amd', 'https://gearvn.com/brands/amd.png'),
('c50e8400-e29b-41d4-a716-446655440006', 'Samsung', 'samsung', 'https://gearvn.com/brands/samsung.png'),
('c50e8400-e29b-41d4-a716-446655440007', 'Corsair', 'corsair', 'https://gearvn.com/brands/corsair.png'),
('c50e8400-e29b-41d4-a716-446655440008', 'LG', 'lg', 'https://gearvn.com/brands/lg.png'),
('c50e8400-e29b-41d4-a716-446655440009', 'NZXT', 'nzxt', 'https://gearvn.com/brands/nzxt.png'),
('c50e8400-e29b-41d4-a716-446655440010', 'HyperX', 'hyperx', 'https://gearvn.com/brands/hyperx.png');

-- Products
INSERT INTO products (id, category_id, brand_id, name, slug, price, image_url, gearvn_url, status) VALUES
('b50e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440001', 'c50e8400-e29b-41d4-a716-446655440001', 'ASUS ROG Strix G15 Gaming Laptop', 'asus-rog-strix-g15', 35990000, 'https://product.hstatic.net/200000722513/product/gearvn-laptop-asus-rog-strix-g15.png', 'https://gearvn.com/products/laptop-asus-rog-strix-g15', 'available'),
('b50e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440003', 'c50e8400-e29b-41d4-a716-446655440002', 'Logitech G Pro X Superlight', 'logitech-g-pro-x-superlight', 3290000, 'https://product.hstatic.net/200000722513/product/chuot-logitech-g-pro-x-superlight.png', 'https://gearvn.com/products/chuot-logitech-g-pro-x-superlight', 'available'),
('b50e8400-e29b-41d4-a716-446655440003', 'a50e8400-e29b-41d4-a716-446655440003', 'c50e8400-e29b-41d4-a716-446655440003', 'Razer BlackWidow V4 Pro', 'razer-blackwidow-v4-pro', 5990000, 'https://product.hstatic.net/200000722513/product/razer-blackwidow-v4-pro.png', 'https://gearvn.com/products/razer-blackwidow-v4-pro', 'available'),
('b50e8400-e29b-41d4-a716-446655440004', 'a50e8400-e29b-41d4-a716-446655440002', 'c50e8400-e29b-41d4-a716-446655440004', 'NVIDIA GeForce RTX 4090', 'nvidia-rtx-4090', 45990000, 'https://product.hstatic.net/200000722513/product/nvidia-rtx-4090.png', 'https://gearvn.com/products/nvidia-rtx-4090', 'available'),
('b50e8400-e29b-41d4-a716-446655440005', 'a50e8400-e29b-41d4-a716-446655440002', 'c50e8400-e29b-41d4-a716-446655440005', 'AMD Ryzen 9 7950X', 'amd-ryzen-9-7950x', 15990000, 'https://product.hstatic.net/200000722513/product/amd-ryzen-9-7950x.png', 'https://gearvn.com/products/amd-ryzen-9-7950x', 'available'),
('b50e8400-e29b-41d4-a716-446655440006', 'a50e8400-e29b-41d4-a716-446655440002', 'c50e8400-e29b-41d4-a716-446655440006', 'Samsung 990 PRO 2TB', 'samsung-990-pro-2tb', 5490000, 'https://product.hstatic.net/200000722513/product/samsung-990-pro.png', 'https://gearvn.com/products/samsung-990-pro-2tb', 'available'),
('b50e8400-e29b-41d4-a716-446655440007', 'a50e8400-e29b-41d4-a716-446655440002', 'c50e8400-e29b-41d4-a716-446655440007', 'Corsair Dominator Platinum RGB 32GB', 'corsair-dominator-32gb', 4290000, 'https://product.hstatic.net/200000722513/product/corsair-dominator.png', 'https://gearvn.com/products/corsair-dominator-32gb', 'available'),
('b50e8400-e29b-41d4-a716-446655440008', 'a50e8400-e29b-41d4-a716-446655440003', 'c50e8400-e29b-41d4-a716-446655440008', 'LG UltraGear 27GN950', 'lg-ultragear-27gn950', 12990000, 'https://product.hstatic.net/200000722513/product/lg-ultragear.png', 'https://gearvn.com/products/lg-ultragear-27gn950', 'available'),
('b50e8400-e29b-41d4-a716-446655440009', 'a50e8400-e29b-41d4-a716-446655440004', 'c50e8400-e29b-41d4-a716-446655440009', 'NZXT Kraken X73', 'nzxt-kraken-x73', 4990000, 'https://product.hstatic.net/200000722513/product/nzxt-kraken.png', 'https://gearvn.com/products/nzxt-kraken-x73', 'available'),
('b50e8400-e29b-41d4-a716-446655440010', 'a50e8400-e29b-41d4-a716-446655440005', 'c50e8400-e29b-41d4-a716-446655440010', 'HyperX Cloud Alpha Wireless', 'hyperx-cloud-alpha', 4590000, 'https://product.hstatic.net/200000722513/product/hyperx-cloud-alpha.png', 'https://gearvn.com/products/hyperx-cloud-alpha-wireless', 'available');

-- Verify
SELECT p.id, p.name, b.name as brand, pc.name as category, p.price
FROM products p
JOIN brands b ON p.brand_id = b.id
JOIN product_categories pc ON p.category_id = pc.id
ORDER BY p.created_at;
