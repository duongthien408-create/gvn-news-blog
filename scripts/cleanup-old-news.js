/**
 * Cleanup Old News Script
 *
 * Deletes news posts older than 7 days
 * Keeps only recent news
 *
 * Usage: node scripts/cleanup-old-news.js
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://qibhlrsdykpkbsnelubz.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYmhscnNkeWtwa2JzbmVsdWJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjM0Nzg3MSwiZXhwIjoyMDc3OTIzODcxfQ.9oq-JCfyLM0pUzSqaScHMXl6vl8nY8tPG563IJFaGys'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function main() {
  console.log('🧹 Cleanup Old News')
  console.log('='.repeat(50))

  // Get date 7 days ago
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  console.log(`📅 Deleting news older than: ${sevenDaysAgo.toISOString()}`)

  // First, count how many will be deleted
  const { data: oldNews, error: countError } = await supabase
    .from('posts')
    .select('id, title, created_at')
    .eq('type', 'news')
    .lt('created_at', sevenDaysAgo.toISOString())

  if (countError) {
    console.error('❌ Error counting old news:', countError.message)
    return
  }

  console.log(`📊 Found ${oldNews?.length || 0} old news posts to delete`)

  if (!oldNews || oldNews.length === 0) {
    console.log('✅ No old news to delete!')
    return
  }

  // Show some examples
  console.log('\n📰 Examples of posts to delete:')
  oldNews.slice(0, 5).forEach(post => {
    console.log(`   - ${post.title?.substring(0, 50)}... (${post.created_at})`)
  })

  // Delete in batches to avoid issues
  const postIds = oldNews.map(p => p.id)
  const batchSize = 50

  console.log(`\n🗑️ Deleting in batches of ${batchSize}...`)

  let deletedCount = 0

  for (let i = 0; i < postIds.length; i += batchSize) {
    const batch = postIds.slice(i, i + batchSize)

    // Delete post_tags for this batch
    await supabase
      .from('post_tags')
      .delete()
      .in('post_id', batch)

    // Delete posts for this batch
    const { error: postsError } = await supabase
      .from('posts')
      .delete()
      .in('id', batch)

    if (postsError) {
      console.error(`❌ Error deleting posts batch ${i}:`, postsError.message)
    } else {
      deletedCount += batch.length
      console.log(`   ✅ Batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(postIds.length/batchSize)} done (${deletedCount}/${postIds.length})`)
    }
  }

  console.log(`\n✅ Successfully deleted ${deletedCount} old news posts!`)

  // Show remaining count
  const { data: remaining } = await supabase
    .from('posts')
    .select('id')
    .eq('type', 'news')

  console.log(`📊 Remaining news posts: ${remaining?.length || 0}`)
  console.log('='.repeat(50))
}

main().catch(console.error)
