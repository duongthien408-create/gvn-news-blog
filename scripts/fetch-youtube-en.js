/**
 * YouTube Fetch Script for English Tech Channels
 *
 * Fetches latest LONG videos (not Shorts) from English YouTube channels
 * Saves to posts with language='en' for n8n to translate to Vietnamese
 *
 * Usage: node scripts/fetch-youtube-en.js
 */

import { createClient } from '@supabase/supabase-js'

// ============================================
// CONFIGURATION
// ============================================

const SUPABASE_URL = 'https://qibhlrsdykpkbsnelubz.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYmhscnNkeWtwa2JzbmVsdWJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjM0Nzg3MSwiZXhwIjoyMDc3OTIzODcxfQ.9oq-JCfyLM0pUzSqaScHMXl6vl8nY8tPG563IJFaGys'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// English YouTube channels for tech content
const YOUTUBE_CHANNELS_EN = [
  {
    name: 'Just Josh',
    slug: 'just-josh',
    channel_id: 'UCtHm9ai5zSb-yfRnnUBopAg',
    avatar_url: null
  },
  {
    name: "Jarrod's Tech",
    slug: 'jarrods-tech',
    channel_id: 'UC2Rzju32yQPkQ7oIhmeuLwg',
    avatar_url: null
  },
  {
    name: 'NoodleNick',
    slug: 'noodlenick',
    channel_id: 'UCthAJeiDA_7iKyzYElbrgjg',
    avatar_url: null
  }
]

// ============================================
// YOUTUBE RSS PARSING
// ============================================

function getYouTubeRSSUrl(channelId) {
  return `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
}

function getVideoThumbnail(videoId) {
  return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
}

/**
 * Parse YouTube RSS feed - get LONG videos only (not Shorts)
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

    // Skip Shorts - only get long videos
    const isShort = link && link.includes('/shorts/')

    if (videoId && title && link && !isShort) {
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

async function getOrCreateCreator(channel) {
  const { data: existing } = await supabase
    .from('creators')
    .select('id')
    .eq('slug', channel.slug)
    .single()

  if (existing) {
    return existing.id
  }

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
 * Insert video as draft post with language='en'
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
      status: 'draft',
      language: 'en',  // Mark as English
      title: video.title,
      summary: video.description,
      source_url: video.link,
      thumbnail_url: video.thumbnail,
      created_at: video.pubDate.toISOString()
      // title_vi, summary_vi, transcript_vi will be set by n8n after translation
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
// MAIN FETCH FUNCTION
// ============================================

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

    console.log(`  📄 Found ${videos.length} long videos in feed`)

    const recentVideos = videos.filter(isRecentVideo)
    console.log(`  📅 ${recentVideos.length} videos from last 7 days`)

    if (recentVideos.length === 0) {
      console.log(`  ⏭️ No recent videos to process`)
      return { fetched: videos.length, inserted: 0, skipped: 0, errors: 0 }
    }

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

async function main() {
  console.log('🎬 GearVN YouTube Fetcher (English Channels)')
  console.log('='.repeat(50))
  console.log(`📅 Run time: ${new Date().toLocaleString('vi-VN')}`)
  console.log(`📅 Fetching LONG videos from last 7 days`)
  console.log(`🌐 Language: English (will be translated by n8n)`)
  console.log(`🔗 Supabase: ${SUPABASE_URL}`)
  console.log(`📺 Channels: ${YOUTUBE_CHANNELS_EN.length}`)

  const totals = { fetched: 0, inserted: 0, skipped: 0, errors: 0 }

  for (const channel of YOUTUBE_CHANNELS_EN) {
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
  console.log('💡 Next step: n8n will:')
  console.log('   1. Fetch transcript (English)')
  console.log('   2. Translate title/summary/transcript to Vietnamese')
  console.log('   3. Update title_vi, summary_vi, transcript_vi')
}

main().catch(console.error)
