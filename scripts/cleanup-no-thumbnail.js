/**
 * Cleanup Videos Without Thumbnails
 * 
 * Deletes review posts that don't have valid thumbnails
 * 
 * Usage: node scripts/cleanup-no-thumbnail.js
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://qibhlrsdykpkbsnelubz.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYmhscnNkeWtwa2JzbmVsdWJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjM0Nzg3MSwiZXhwIjoyMDc3OTIzODcxfQ.9oq-JCfyLM0pUzSqaScHMXl6vl8nY8tPG563IJFaGys'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function checkThumbnail(url) {
  if (!url) return false
  
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

async function main() {
  console.log('🖼️ Cleanup Videos Without Thumbnails')
  console.log('='.repeat(50))

  // Get all review posts
  const { data: reviews, error } = await supabase
    .from('posts')
    .select('id, title, thumbnail_url, source_url')
    .eq('type', 'review')

  if (error) {
    console.error('❌ Error fetching reviews:', error.message)
    return
  }

  console.log(`📊 Total reviews: ${reviews?.length || 0}`)

  // Check each thumbnail
  const noThumbnail = []
  const withThumbnail = []

  console.log('\n🔍 Checking thumbnails...')

  for (let i = 0; i < reviews.length; i++) {
    const review = reviews[i]
    
    if (!review.thumbnail_url) {
      noThumbnail.push(review)
      continue
    }

    const isValid = await checkThumbnail(review.thumbnail_url)
    
    if (isValid) {
      withThumbnail.push(review)
    } else {
      noThumbnail.push(review)
    }

    // Progress every 10
    if ((i + 1) % 10 === 0) {
      process.stdout.write(`   Checked ${i + 1}/${reviews.length}\r`)
    }
  }

  console.log(`\n\n📊 Results:`)
  console.log(`   ✅ With valid thumbnail: ${withThumbnail.length}`)
  console.log(`   ❌ No/invalid thumbnail: ${noThumbnail.length}`)

  if (noThumbnail.length === 0) {
    console.log('\n✅ All videos have valid thumbnails!')
    return
  }

  // Show examples
  console.log('\n📰 Examples of posts to delete:')
  noThumbnail.slice(0, 5).forEach(post => {
    console.log(`   - ${post.title?.substring(0, 50)}...`)
    console.log(`     Thumbnail: ${post.thumbnail_url || 'NULL'}`)
  })

  // Delete posts without thumbnails
  const postIds = noThumbnail.map(p => p.id)
  const batchSize = 50

  console.log(`\n🗑️ Deleting ${noThumbnail.length} posts without thumbnails...`)

  let deletedCount = 0

  for (let i = 0; i < postIds.length; i += batchSize) {
    const batch = postIds.slice(i, i + batchSize)

    // Delete post_tags first
    await supabase
      .from('post_tags')
      .delete()
      .in('post_id', batch)

    // Delete posts
    const { error: postsError } = await supabase
      .from('posts')
      .delete()
      .in('id', batch)

    if (postsError) {
      console.error(`❌ Error deleting batch ${i}:`, postsError.message)
    } else {
      deletedCount += batch.length
      console.log(`   ✅ Batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(postIds.length/batchSize)} done (${deletedCount}/${postIds.length})`)
    }
  }

  console.log(`\n✅ Deleted ${deletedCount} posts without valid thumbnails!`)
  
  // Show remaining
  const { data: remaining } = await supabase
    .from('posts')
    .select('id')
    .eq('type', 'review')

  console.log(`📊 Remaining reviews: ${remaining?.length || 0}`)
  console.log('='.repeat(50))
}

main().catch(console.error)
