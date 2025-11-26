-- ============================================
-- CREATE VIEW: posts_with_tags
-- Hiển thị posts kèm danh sách tag names
-- ============================================

CREATE OR REPLACE VIEW posts_with_tags AS
SELECT
    p.*,
    COALESCE(
        array_agg(t.name ORDER BY t.name) FILTER (WHERE t.id IS NOT NULL),
        '{}'
    ) AS tag_names,
    COALESCE(
        array_agg(t.slug ORDER BY t.name) FILTER (WHERE t.id IS NOT NULL),
        '{}'
    ) AS tag_slugs
FROM posts p
LEFT JOIN post_tags pt ON p.id = pt.post_id
LEFT JOIN tags t ON pt.tag_id = t.id
GROUP BY p.id;

-- Giờ query: SELECT * FROM posts_with_tags WHERE status = 'public'
-- Sẽ trả về: { id, title, ..., tag_names: ['CPU', 'VGA'], tag_slugs: ['cpu', 'vga'] }
