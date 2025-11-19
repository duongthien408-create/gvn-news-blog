-- =====================================================
-- DEBUG: Check Products Data
-- =====================================================

-- Check if products exist
SELECT
  'Products count' as check_type,
  COUNT(*) as count
FROM products;

-- Check specific product IDs used in post_products
SELECT
  'RTX 4090' as product,
  CASE
    WHEN EXISTS (SELECT 1 FROM products WHERE id = 'b50e8400-e29b-41d4-a716-446655440004')
    THEN 'EXISTS ✅'
    ELSE 'MISSING ❌'
  END as status
UNION ALL
SELECT
  'ASUS Laptop',
  CASE
    WHEN EXISTS (SELECT 1 FROM products WHERE id = 'b50e8400-e29b-41d4-a716-446655440001')
    THEN 'EXISTS ✅'
    ELSE 'MISSING ❌'
  END
UNION ALL
SELECT
  'Logitech Mouse',
  CASE
    WHEN EXISTS (SELECT 1 FROM products WHERE id = 'b50e8400-e29b-41d4-a716-446655440002')
    THEN 'EXISTS ✅'
    ELSE 'MISSING ❌'
  END
UNION ALL
SELECT
  'Razer Keyboard',
  CASE
    WHEN EXISTS (SELECT 1 FROM products WHERE id = 'b50e8400-e29b-41d4-a716-446655440003')
    THEN 'EXISTS ✅'
    ELSE 'MISSING ❌'
  END;

-- List all product IDs
SELECT id, name FROM products ORDER BY created_at;
