-- ============================================
-- AUTO-TAG ARTICLES
-- Gắn tags cho articles dựa trên title matching keywords
-- ============================================

-- Xem articles chưa có tag
SELECT a.id, a.title, COUNT(at.tag_id) as tag_count
FROM articles a
LEFT JOIN article_tags at ON a.id = at.article_id
GROUP BY a.id, a.title
HAVING COUNT(at.tag_id) = 0;

-- Auto-tag articles dựa trên keywords trong title
-- Insert vào article_tags nếu title chứa keyword của tag

INSERT INTO article_tags (article_id, tag_id)
SELECT DISTINCT a.id, t.id
FROM articles a
CROSS JOIN tags t
WHERE
  -- Check if any keyword matches the title (case insensitive)
  EXISTS (
    SELECT 1 FROM unnest(t.keywords) AS keyword
    WHERE LOWER(a.title) LIKE '%' || LOWER(keyword) || '%'
  )
  -- Avoid duplicates
  AND NOT EXISTS (
    SELECT 1 FROM article_tags at
    WHERE at.article_id = a.id AND at.tag_id = t.id
  );

-- Verify results
SELECT
  a.title,
  array_agg(t.name) as tags
FROM articles a
JOIN article_tags at ON a.id = at.article_id
JOIN tags t ON at.tag_id = t.id
GROUP BY a.id, a.title
ORDER BY a.title;
