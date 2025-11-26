-- ============================================
-- STEP 2: ROW LEVEL SECURITY
-- ============================================

ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read creators" ON creators FOR SELECT USING (true);
CREATE POLICY "Public read tags" ON tags FOR SELECT USING (true);
CREATE POLICY "Public read public posts" ON posts FOR SELECT USING (status = 'public');
CREATE POLICY "Public read post_tags" ON post_tags FOR SELECT USING (true);

-- Service role full access (for n8n)
CREATE POLICY "Service role full access creators" ON creators FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access tags" ON tags FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access posts" ON posts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access post_tags" ON post_tags FOR ALL USING (auth.role() = 'service_role');
