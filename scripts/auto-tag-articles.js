/**
 * AUTO-TAG ARTICLES SCRIPT
 * Tự động gắn tags cho articles dựa trên keywords trong title và content
 *
 * Cách chạy:
 * node scripts/auto-tag-articles.js [--dry-run] [--limit=N]
 *
 * Options:
 *   --dry-run   Chỉ preview, không ghi vào database
 *   --limit=N   Giới hạn số articles xử lý (mặc định: tất cả)
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Parse command line arguments
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const limitArg = args.find(a => a.startsWith('--limit='));
const LIMIT = limitArg ? parseInt(limitArg.split('=')[1]) : null;

console.log('\n🏷️  AUTO-TAG ARTICLES SCRIPT');
console.log('============================');
console.log(`Mode: ${DRY_RUN ? '🔍 DRY RUN (preview only)' : '✏️  WRITE MODE'}`);
if (LIMIT) console.log(`Limit: ${LIMIT} articles`);
console.log('');

async function main() {
  try {
    // 1. Fetch all tags with keywords
    console.log('📥 Fetching tags with keywords...');
    const { data: tags, error: tagsError } = await supabase
      .from('tags')
      .select('id, slug, name, tag_group, keywords')
      .not('keywords', 'is', null);

    if (tagsError) throw tagsError;
    console.log(`   Found ${tags.length} tags with keywords\n`);

    // 2. Fetch articles without tags (or all articles)
    console.log('📥 Fetching articles...');

    // Get articles that don't have any tags yet
    let query = supabase
      .from('articles')
      .select(`
        id,
        title,
        slug,
        article_tags(tag_id)
      `)
      .order('created_at', { ascending: false });

    if (LIMIT) query = query.limit(LIMIT);

    const { data: articles, error: articlesError } = await query;
    if (articlesError) throw articlesError;

    // Filter to only articles without tags
    const articlesWithoutTags = articles.filter(a => !a.article_tags || a.article_tags.length === 0);
    console.log(`   Found ${articles.length} total articles`);
    console.log(`   Found ${articlesWithoutTags.length} articles without tags\n`);

    if (articlesWithoutTags.length === 0) {
      console.log('✅ All articles already have tags!');
      return;
    }

    // 3. Process each article
    let totalTagsAdded = 0;
    let articlesUpdated = 0;
    const results = [];

    for (const article of articlesWithoutTags) {
      const text = (article.title || '').toLowerCase();

      const matchedTags = [];

      // Check each tag's keywords against article title
      for (const tag of tags) {
        if (!tag.keywords || tag.keywords.length === 0) continue;

        const hasMatch = tag.keywords.some(keyword => {
          const kw = keyword.toLowerCase();
          // Use word boundary matching for short keywords
          if (kw.length <= 3) {
            const regex = new RegExp(`\\b${escapeRegex(kw)}\\b`, 'i');
            return regex.test(text);
          }
          return text.includes(kw);
        });

        if (hasMatch) {
          matchedTags.push({
            id: tag.id,
            slug: tag.slug,
            group: tag.tag_group
          });
        }
      }

      if (matchedTags.length > 0) {
        results.push({
          articleId: article.id,
          title: article.title?.substring(0, 60) + (article.title?.length > 60 ? '...' : ''),
          tags: matchedTags
        });
        totalTagsAdded += matchedTags.length;
        articlesUpdated++;
      }
    }

    // 4. Show preview
    console.log('📋 RESULTS PREVIEW:');
    console.log('-------------------');

    for (const result of results.slice(0, 20)) {
      console.log(`\n📄 ${result.title}`);
      const tagsByGroup = groupBy(result.tags, 'group');
      for (const [group, groupTags] of Object.entries(tagsByGroup)) {
        const tagSlugs = groupTags.map(t => `#${t.slug}`).join(', ');
        console.log(`   [${group}] ${tagSlugs}`);
      }
    }

    if (results.length > 20) {
      console.log(`\n   ... và ${results.length - 20} articles khác`);
    }

    console.log('\n📊 SUMMARY:');
    console.log(`   Articles to update: ${articlesUpdated}/${articlesWithoutTags.length}`);
    console.log(`   Total tags to add: ${totalTagsAdded}`);
    if (articlesUpdated > 0) {
      console.log(`   Average tags per article: ${(totalTagsAdded / articlesUpdated).toFixed(1)}`);
    }

    // 5. Write to database if not dry run
    if (!DRY_RUN && results.length > 0) {
      console.log('\n✏️  Writing to database...');

      // Prepare batch insert data
      const articleTagsToInsert = [];
      for (const result of results) {
        for (const tag of result.tags) {
          articleTagsToInsert.push({
            article_id: result.articleId,
            tag_id: tag.id
          });
        }
      }

      console.log(`   Inserting ${articleTagsToInsert.length} new article_tags...`);

      // Insert in batches of 500
      const batchSize = 500;
      for (let i = 0; i < articleTagsToInsert.length; i += batchSize) {
        const batch = articleTagsToInsert.slice(i, i + batchSize);
        const { error: insertError } = await supabase
          .from('article_tags')
          .upsert(batch, { onConflict: 'article_id,tag_id', ignoreDuplicates: true });

        if (insertError) throw insertError;
        console.log(`   Batch ${Math.floor(i/batchSize) + 1}: inserted ${batch.length} records`);
      }

      console.log('\n✅ DONE! Article tags updated successfully.');
    } else if (DRY_RUN) {
      console.log('\n💡 This was a dry run. Use without --dry-run to apply changes.');
    } else {
      console.log('\n⚠️  No articles matched any tags.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Helper: escape regex special characters
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Helper: group array by key
function groupBy(array, key) {
  return array.reduce((result, item) => {
    const group = item[key] || 'other';
    if (!result[group]) result[group] = [];
    result[group].push(item);
    return result;
  }, {});
}

main();
