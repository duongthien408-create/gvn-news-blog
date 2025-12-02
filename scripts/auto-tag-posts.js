/**
 * AUTO-TAG POSTS SCRIPT
 * Tự động gắn tags cho posts dựa trên keywords trong title và summary
 *
 * Cách chạy:
 * node scripts/auto-tag-posts.js [--dry-run] [--limit=N]
 *
 * Options:
 *   --dry-run   Chỉ preview, không ghi vào database
 *   --limit=N   Giới hạn số posts xử lý (mặc định: tất cả)
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

console.log('\n🏷️  AUTO-TAG POSTS SCRIPT');
console.log('========================');
console.log(`Mode: ${DRY_RUN ? '🔍 DRY RUN (preview only)' : '✏️  WRITE MODE'}`);
if (LIMIT) console.log(`Limit: ${LIMIT} posts`);
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

    // 2. Fetch all posts
    console.log('📥 Fetching posts...');
    let query = supabase
      .from('posts')
      .select('id, title, title_vi, summary, summary_vi')
      .order('created_at', { ascending: false });

    if (LIMIT) query = query.limit(LIMIT);

    const { data: posts, error: postsError } = await query;
    if (postsError) throw postsError;
    console.log(`   Found ${posts.length} posts to process\n`);

    // 3. Process each post
    let totalTagsAdded = 0;
    let postsUpdated = 0;
    const results = [];

    for (const post of posts) {
      const text = [
        post.title || '',
        post.title_vi || '',
        post.summary || '',
        post.summary_vi || ''
      ].join(' ').toLowerCase();

      const matchedTags = [];

      // Check each tag's keywords against post content
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
          postId: post.id,
          title: post.title?.substring(0, 60) + (post.title?.length > 60 ? '...' : ''),
          tags: matchedTags
        });
        totalTagsAdded += matchedTags.length;
        postsUpdated++;
      }
    }

    // 4. Show preview
    console.log('📋 RESULTS PREVIEW:');
    console.log('-------------------');

    for (const result of results.slice(0, 20)) {
      console.log(`\n📰 ${result.title}`);
      const tagsByGroup = groupBy(result.tags, 'group');
      for (const [group, groupTags] of Object.entries(tagsByGroup)) {
        const tagSlugs = groupTags.map(t => `#${t.slug}`).join(', ');
        console.log(`   [${group}] ${tagSlugs}`);
      }
    }

    if (results.length > 20) {
      console.log(`\n   ... và ${results.length - 20} posts khác`);
    }

    console.log('\n📊 SUMMARY:');
    console.log(`   Posts to update: ${postsUpdated}/${posts.length}`);
    console.log(`   Total tags to add: ${totalTagsAdded}`);
    console.log(`   Average tags per post: ${(totalTagsAdded / postsUpdated).toFixed(1)}`);

    // 5. Write to database if not dry run
    if (!DRY_RUN && results.length > 0) {
      console.log('\n✏️  Writing to database...');

      // Prepare batch insert data
      const postTagsToInsert = [];
      for (const result of results) {
        for (const tag of result.tags) {
          postTagsToInsert.push({
            post_id: result.postId,
            tag_id: tag.id
          });
        }
      }

      // Delete existing post_tags and insert new ones
      console.log('   Clearing existing post_tags...');
      const { error: deleteError } = await supabase
        .from('post_tags')
        .delete()
        .neq('post_id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (deleteError) throw deleteError;

      console.log(`   Inserting ${postTagsToInsert.length} new post_tags...`);

      // Insert in batches of 500
      const batchSize = 500;
      for (let i = 0; i < postTagsToInsert.length; i += batchSize) {
        const batch = postTagsToInsert.slice(i, i + batchSize);
        const { error: insertError } = await supabase
          .from('post_tags')
          .upsert(batch, { onConflict: 'post_id,tag_id', ignoreDuplicates: true });

        if (insertError) throw insertError;
        console.log(`   Batch ${Math.floor(i/batchSize) + 1}: inserted ${batch.length} records`);
      }

      console.log('\n✅ DONE! Tags updated successfully.');
    } else if (DRY_RUN) {
      console.log('\n💡 This was a dry run. Use without --dry-run to apply changes.');
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
