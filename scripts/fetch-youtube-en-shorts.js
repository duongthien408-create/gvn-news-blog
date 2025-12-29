/**
 * YouTube Fetch Script - English Shorts
 *
 * Fetches YouTube Shorts from English tech channels
 * Needs translation via n8n before publishing
 *
 * Usage: node scripts/fetch-youtube-en-shorts.js
 */

import { createClient } from '@supabase/supabase-js'

// ============================================
// CONFIGURATION
// ============================================

const SUPABASE_URL = 'https://qibhlrsdykpkbsnelubz.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYmhscnNkeWtwa2JzbmVsdWJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjM0Nzg3MSwiZXhwIjoyMDc3OTIzODcxfQ.9oq-JCfyLM0pUzSqaScHMXl6vl8nY8tPG563IJFaGys'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// English YouTube channels
const CHANNELS = [
  {
    name: 'Marques Brownlee',
    slug: 'mkbhd',
    channel_id: 'UCBJycsmduvYEL83R_U4JriQ',
    avatar_url: null
  },
  {
    name: 'Linus Tech Tips',
    slug: 'linus-tech-tips',
    channel_id: 'UCXuqSBlHAE6Xw-yeJA0Tunw',
    avatar_url: null
  },
  {
    name: 'Dave2D',
    slug: 'dave2d',
    channel_id: 'UCVYamHliCI9rw1tHR1xbkfw',
    avatar_url: null
  }
]

// ============================================
// YOUTUBE HELPERS
// ============================================

function getYouTubeRSSUrl(channelId) {
  return `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
}

function getVideoThumbnail(videoId) {
  return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
}

function decodeHtmlEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
}

/**
 * Parse YouTube RSS feed - get Shorts only
 */
function parseYouTubeRSS(xmlText) {
  const items = []
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/gi
  let match

  while ((match = entryRegex.exec(xmlText)) !== null) {
    const entryXml = match[1]

    const videoIdMatch = entryXml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)
    const videoId = videoIdMatch ? videoIdMatch[1] : null

    const titleMatch = entryXml.match(/<title>([^<]+)<\/title>/)
    const title = titleMatch ? titleMatch[1] : null

    const linkMatch = entryXml.match(/<link[^>]*href="([^"]+)"/)
    const link = linkMatch ? linkMatch[1] : null

    const publishedMatch = entryXml.match(/<published>([^<]+)<\/published>/)
    const published = publishedMatch ? new Date(publishedMatch[1]) : new Date()

    const descMatch = entryXml.match(/<media:description>([^<]*)<\/media:description>/)
    const description = descMatch ? descMatch[1].trim() : ''

    // Only get Shorts
    const isShort =
      title.includes('#shorts') ||
      title.includes('#short') ||
      title.toLowerCase().includes('shorts') ||
      description.includes('#shorts')

    if (videoId && title && link && isShort) {
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

// ============================================
// SUPABASE OPERATIONS
// ============================================

async function getOrCreateCreator(channel) {
  const { data: existing } = await supabase
    .from('creators')
    .select('id')
    .eq('slug', channel.slug)
    .single()

  if (existing) return existing.id

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

async function postExists(sourceUrl) {
  const { data } = await supabase
    .from('posts')
    .select('id')
    .eq('source_url', sourceUrl)
    .single()

  return !!data
}

/**
 * Insert video as draft - needs n8n translation
 */
async function insertVideo(creatorId, video) {
  if (await postExists(video.link)) {
    return { skipped: true, reason: 'duplicate' }
  }

  const { data: post, error } = await supabase
    .from('posts')
    .insert({
      creator_id: creatorId,
      type: 'review',
      status: 'draft',  // Needs translation first
      
      
      title: video.title,
      // title_vi will be set by n8n after translation
      summary: video.description,
      // summary_vi will be set by n8n after translation
      source_url: video.link,
      thumbnail_url: video.thumbnail,
      created_at: video.pubDate.toISOString()
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

function getDaysAgo(days) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  date.setHours(0, 0, 0, 0)
  return date
}

function isRecentVideo(video) {
  const weekAgo = getDaysAgo(7)
  return video.pubDate >= weekAgo
}

// ============================================
// MAIN
// ============================================

async function fetchChannel(channel) {
  console.log(`\n📺 Fetching: ${channel.name}`)
  const rssUrl = getYouTubeRSSUrl(channel.channel_id)

  try {
    const response = await fetch(rssUrl, {
      headers: { 'User-Agent': 'GearVN-Bot/1.0' }
    })

    if (!response.ok) {
      console.error(`  ❌ HTTP ${response.status}`)
      return { fetched: 0, inserted: 0, skipped: 0, errors: 1 }
    }

    const xmlText = await response.text()
    const videos = parseYouTubeRSS(xmlText)

    console.log(`  📄 Found ${videos.length} Shorts`)

    const recentVideos = videos.filter(isRecentVideo)
    console.log(`  📅 ${recentVideos.length} from last 7 days`)

    if (recentVideos.length === 0) {
      return { fetched: videos.length, inserted: 0, skipped: 0, errors: 0 }
    }

    const creatorId = await getOrCreateCreator(channel)
    if (!creatorId) {
      return { fetched: videos.length, inserted: 0, skipped: 0, errors: 1 }
    }

    let inserted = 0, skipped = 0, errors = 0

    for (const video of recentVideos) {
      const result = await insertVideo(creatorId, video)

      if (result.success) {
        inserted++
        console.log(`  ✅ ${video.title.substring(0, 50)}...`)
      } else if (result.skipped) {
        skipped++
      } else if (result.error) {
        errors++
        console.error(`  ❌ ${result.error}`)
      }
    }

    console.log(`  📊 ${inserted} new, ${skipped} duplicates, ${errors} errors`)
    return { fetched: videos.length, inserted, skipped, errors }

  } catch (err) {
    console.error(`  ❌ ${err.message}`)
    return { fetched: 0, inserted: 0, skipped: 0, errors: 1 }
  }
}

async function main() {
  console.log('🎬 YouTube Fetcher - English Shorts')
  console.log('='.repeat(50))
  console.log(`📅 ${new Date().toLocaleString('vi-VN')}`)
  console.log(`📺 Channels: ${CHANNELS.length}`)
  console.log('⚠️  Posts saved as DRAFT - needs n8n translation')

  const totals = { fetched: 0, inserted: 0, skipped: 0, errors: 0 }

  for (const channel of CHANNELS) {
    const result = await fetchChannel(channel)
    totals.fetched += result.fetched
    totals.inserted += result.inserted
    totals.skipped += result.skipped
    totals.errors += result.errors
  }

  console.log('\n' + '='.repeat(50))
  console.log('📊 TOTAL')
  console.log(`   ✅ New (draft): ${totals.inserted}`)
  console.log(`   ⏭️ Skipped: ${totals.skipped}`)
  console.log(`   ❌ Errors: ${totals.errors}`)
  console.log('='.repeat(50))
  console.log('💡 Next: n8n will translate and publish')
}

main().catch(console.error)
