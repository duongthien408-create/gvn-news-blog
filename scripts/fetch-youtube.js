/**
 * YouTube Fetch Script for GearVN Reviews
 *
 * Fetches latest videos from YouTube channels via RSS
 * No API key needed - uses YouTube's public RSS feeds
 *
 * Saves as drafts to Supabase for transcript processing via n8n
 *
 * Usage: node scripts/fetch-youtube.js
 */

import { createClient } from '@supabase/supabase-js'

// ============================================
// CONFIGURATION
// ============================================

const SUPABASE_URL = 'https://qibhlrsdykpkbsnelubz.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYmhscnNkeWtwa2JzbmVsdWJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjM0Nzg3MSwiZXhwIjoyMDc3OTIzODcxfQ.9oq-JCfyLM0pUzSqaScHMXl6vl8nY8tPG563IJFaGys'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// YouTube channels for tech reviews
// channel_id can be found in the channel URL or via YouTube
const YOUTUBE_CHANNELS = [
  {
    name: 'Linus Tech Tips',
    slug: 'linus-tech-tips',
    channel_id: 'UCXuqSBlHAE6Xw-yeJA0Tunw',
    avatar_url: 'https://yt3.googleusercontent.com/Vy6KL7EM_apxPSxF0pPy5w_c87YDTOlBQo3MADZ0rnBB6R2CLXmXYYmqR2eGFnEkjrZ4CkBK=s160-c-k-c0x00ffffff-no-rj'
  },
  {
    name: 'Gamers Nexus',
    slug: 'gamers-nexus',
    channel_id: 'UChIs72whgZI9w6d6FhwGGHA',
    avatar_url: 'https://yt3.googleusercontent.com/ytc/AIdro_niS3VFe0PyqQEoGQGZkStGu-3UYlFpYjJdfJLSdkFB2g=s160-c-k-c0x00ffffff-no-rj'
  },
  {
    name: 'JayzTwoCents',
    slug: 'jayztwocents',
    channel_id: 'UCkWQ0gDrqOCarmUKmppD7GQ',
    avatar_url: 'https://yt3.googleusercontent.com/ytc/AIdro_kMv5MBskXTOqMh-PA9AhfZdOuGHX5p1BkUABx9pw=s160-c-k-c0x00ffffff-no-rj'
  },
  {
    name: 'Hardware Unboxed',
    slug: 'hardware-unboxed',
    channel_id: 'UCI8iQa1hv7oV_Z8D35vVuSg',
    avatar_url: 'https://yt3.googleusercontent.com/ytc/AIdro_nSPKJcaJnYb1cL6PN0mJK7K0w4PqlNKvNx-9nKnMs=s160-c-k-c0x00ffffff-no-rj'
  },
  {
    name: 'Dave2D',
    slug: 'dave2d',
    channel_id: 'UCVYamHliCI9rw1tHR1xbkfw',
    avatar_url: 'https://yt3.googleusercontent.com/ytc/AIdro_lzv0x7LXb3RCp5iG4s0f4cVX4A3iqK4Y0GPWA8Eg=s160-c-k-c0x00ffffff-no-rj'
  },
  {
    name: 'MKBHD',
    slug: 'mkbhd',
    channel_id: 'UCBJycsmduvYEL83R_U4JriQ',
    avatar_url: 'https://yt3.googleusercontent.com/lkH37D712tiyphLBeDvmi5qTnOk8HNPgAi3HzfmJPjVTz-H7mJq6Q_hPqjXQQGq6OPGi_yXB=s160-c-k-c0x00ffffff-no-rj'
  }
]

// ============================================
// YOUTUBE RSS PARSING
// ============================================

/**
 * Get YouTube RSS feed URL from channel ID
 */
function getYouTubeRSSUrl(channelId) {
  return `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
}

/**
 * Extract video ID from YouTube URL
 */
function extractVideoId(url) {
  const match = url.match(/watch\?v=([^&]+)/) || url.match(/\/videos\/([^/?]+)/)
  return match ? match[1] : null
}

/**
 * Get high quality thumbnail URL
 */
function getVideoThumbnail(videoId) {
  // maxresdefault is 1280x720, hqdefault is 480x360
  return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
}

/**
 * Parse YouTube RSS feed (Atom format)
 */
function parseYouTubeRSS(xmlText) {
  const items = []

  // Extract all <entry> blocks
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/gi
  let match

  while ((match = entryRegex.exec(xmlText)) !== null) {
    const entryXml = match[1]

    // Extract video ID
    const videoIdMatch = entryXml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)
    const videoId = videoIdMatch ? videoIdMatch[1] : null

    // Extract title
    const titleMatch = entryXml.match(/<title>([^<]+)<\/title>/)
    const title = titleMatch ? titleMatch[1] : null

    // Extract link
    const linkMatch = entryXml.match(/<link[^>]*href="([^"]+)"/)
    const link = linkMatch ? linkMatch[1] : null

    // Extract published date
    const publishedMatch = entryXml.match(/<published>([^<]+)<\/published>/)
    const published = publishedMatch ? new Date(publishedMatch[1]) : new Date()

    // Extract description/summary
    const descMatch = entryXml.match(/<media:description>([^<]*)<\/media:description>/)
    const description = descMatch ? descMatch[1].trim() : ''

    if (videoId && title && link) {
      items.push({
        videoId,
        title: decodeHtmlEntities(title),
        link,
        description: decodeHtmlEntities(description).substring(0, 500),
        pubDate: published,
        thumbnail: getVideoThumbnail(videoId)
      })
    }
  }

  return items
}

/**
 * Decode HTML entities
 */
function decodeHtmlEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
}

// ============================================
// SUPABASE OPERATIONS
// ============================================

/**
 * Get or create creator
 */
async function getOrCreateCreator(channel) {
  // Try to find existing creator
  const { data: existing } = await supabase
    .from('creators')
    .select('id')
    .eq('slug', channel.slug)
    .single()

  if (existing) {
    return existing.id
  }

  // Create new creator
  const { data: created, error } = await supabase
    .from('creators')
    .insert({
      name: channel.name,
      slug: channel.slug,
      avatar_url: channel.avatar_url,
      channel_url: `https://www.youtube.com/channel/${channel.channel_id}`
    })
    .select('id')
    .single()

  if (error) {
    console.error(`  ❌ Failed to create creator ${channel.name}:`, error.message)
    return null
  }

  console.log(`  ✅ Created creator: ${channel.name}`)
  return created.id
}

/**
 * Check if post already exists (by source_url)
 */
async function postExists(sourceUrl) {
  const { data } = await supabase
    .from('posts')
    .select('id')
    .eq('source_url', sourceUrl)
    .single()

  return !!data
}

/**
 * Insert video as draft post
 */
async function insertVideo(creatorId, video) {
  // Check for duplicate
  if (await postExists(video.link)) {
    return { skipped: true, reason: 'duplicate' }
  }

  // Insert post as review type
  const { data: post, error } = await supabase
    .from('posts')
    .insert({
      creator_id: creatorId,
      type: 'review',
      status: 'draft',
      title: video.title,
      summary: video.description,
      source_url: video.link,
      thumbnail_url: video.thumbnail,
      created_at: video.pubDate.toISOString()
      // title_vi, summary_vi will be set by n8n after transcript processing
    })
    .select('id')
    .single()

  if (error) {
    return { error: error.message }
  }

  return { success: true, id: post.id }
}

// ============================================
// DATE FILTERING
// ============================================

/**
 * Get date from N days ago at 00:00:00
 */
function getDaysAgo(days) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  date.setHours(0, 0, 0, 0)
  return date
}

/**
 * Check if video is recent (within last 7 days)
 */
function isRecentVideo(video) {
  const weekAgo = getDaysAgo(7)
  return video.pubDate >= weekAgo
}

// ============================================
// MAIN FETCH FUNCTION
// ============================================

/**
 * Fetch and process a single YouTube channel
 */
async function fetchChannel(channel) {
  console.log(`\n📺 Fetching: ${channel.name}`)
  const rssUrl = getYouTubeRSSUrl(channel.channel_id)
  console.log(`   RSS: ${rssUrl}`)

  try {
    const response = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'GearVN-YouTube-Bot/1.0'
      }
    })

    if (!response.ok) {
      console.error(`  ❌ HTTP ${response.status}: ${response.statusText}`)
      return { fetched: 0, inserted: 0, skipped: 0, errors: 1 }
    }

    const xmlText = await response.text()
    const videos = parseYouTubeRSS(xmlText)

    console.log(`  📄 Found ${videos.length} videos in feed`)

    // Filter to only recent videos (last 7 days)
    const recentVideos = videos.filter(isRecentVideo)
    console.log(`  📅 ${recentVideos.length} videos from last 7 days`)

    if (recentVideos.length === 0) {
      console.log(`  ⏭️ No recent videos to process`)
      return { fetched: videos.length, inserted: 0, skipped: 0, errors: 0 }
    }

    // Get or create creator
    const creatorId = await getOrCreateCreator(channel)
    if (!creatorId) {
      return { fetched: videos.length, inserted: 0, skipped: 0, errors: 1 }
    }

    let inserted = 0
    let skipped = 0
    let errors = 0

    for (const video of recentVideos) {
      const result = await insertVideo(creatorId, video)

      if (result.success) {
        inserted++
        console.log(`  ✅ Inserted: ${video.title.substring(0, 50)}...`)
      } else if (result.skipped) {
        skipped++
      } else if (result.error) {
        errors++
        console.error(`  ❌ Error: ${result.error}`)
      }
    }

    console.log(`  📊 Results: ${inserted} new, ${skipped} duplicates, ${errors} errors`)

    return { fetched: videos.length, inserted, skipped, errors }

  } catch (err) {
    console.error(`  ❌ Fetch error: ${err.message}`)
    return { fetched: 0, inserted: 0, skipped: 0, errors: 1 }
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🎬 GearVN YouTube Fetcher')
  console.log('='.repeat(50))
  console.log(`📅 Run time: ${new Date().toLocaleString('vi-VN')}`)
  console.log(`📅 Fetching videos from last 7 days`)
  console.log(`🔗 Supabase: ${SUPABASE_URL}`)
  console.log(`📺 Channels: ${YOUTUBE_CHANNELS.length}`)

  const totals = { fetched: 0, inserted: 0, skipped: 0, errors: 0 }

  for (const channel of YOUTUBE_CHANNELS) {
    const result = await fetchChannel(channel)
    totals.fetched += result.fetched
    totals.inserted += result.inserted
    totals.skipped += result.skipped
    totals.errors += result.errors
  }

  console.log('\n' + '='.repeat(50))
  console.log('📊 TOTAL RESULTS')
  console.log(`   Total videos in feeds: ${totals.fetched}`)
  console.log(`   ✅ New videos inserted: ${totals.inserted}`)
  console.log(`   ⏭️ Duplicates skipped: ${totals.skipped}`)
  console.log(`   ❌ Errors: ${totals.errors}`)
  console.log('='.repeat(50))
  console.log('✅ Done!')
  console.log('')
  console.log('💡 Next step: Use n8n to process transcripts for new videos')
}

// Run
main().catch(console.error)
