/**
 * RSS Fetch Script for GearVN News
 *
 * Fetches tech news from:
 * - Tom's Hardware
 * - TechPowerUp
 * - Engadget
 *
 * Saves as drafts to Supabase for translation via n8n
 *
 * Usage: node scripts/fetch-rss.js
 *
 * Environment variables:
 * - SUPABASE_URL (required)
 * - SUPABASE_SERVICE_KEY (required - use service_role key, not anon key)
 */

import { createClient } from '@supabase/supabase-js'

// ============================================
// CONFIGURATION
// ============================================

const SUPABASE_URL = 'https://qibhlrsdykpkbsnelubz.supabase.co'
// Service role key for insert/update operations
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYmhscnNkeWtwa2JzbmVsdWJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjM0Nzg3MSwiZXhwIjoyMDc3OTIzODcxfQ.9oq-JCfyLM0pUzSqaScHMXl6vl8nY8tPG563IJFaGys'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// RSS Feed sources - TECH news only (not game, not AI)
const RSS_FEEDS = [
  {
    name: 'Tom\'s Hardware',
    slug: 'toms-hardware',
    url: 'https://www.tomshardware.com/feeds/all'
  },
  {
    name: 'TechPowerUp',
    slug: 'techpowerup',
    url: 'https://www.techpowerup.com/rss/news'
  },
  {
    name: 'Engadget',
    slug: 'engadget',
    url: 'https://www.engadget.com/rss.xml'
  }
]

// ============================================
// RSS PARSING
// ============================================

/**
 * Parse XML RSS feed
 */
function parseRSS(xmlText) {
  const items = []

  // Extract all <item> or <entry> blocks
  const itemRegex = /<item>([\s\S]*?)<\/item>|<entry>([\s\S]*?)<\/entry>/gi
  let match

  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemXml = match[1] || match[2]

    const title = extractTag(itemXml, 'title')
    const link = extractTag(itemXml, 'link') || extractAttr(itemXml, 'link', 'href')
    const description = extractTag(itemXml, 'description') || extractTag(itemXml, 'summary') || extractTag(itemXml, 'content')
    const pubDate = extractTag(itemXml, 'pubDate') || extractTag(itemXml, 'published') || extractTag(itemXml, 'updated')

    // Try to find thumbnail
    let thumbnail = null

    // Check enclosure (TechPowerUp style)
    const enclosureMatch = itemXml.match(/<enclosure[^>]*url="([^"]+)"[^>]*type="image/i)
    if (enclosureMatch) {
      thumbnail = enclosureMatch[1]
    }

    // Check media:content (Engadget style)
    if (!thumbnail) {
      const mediaMatch = itemXml.match(/<media:content[^>]*url="([^"]+)"/i)
      if (mediaMatch) {
        thumbnail = mediaMatch[1]
      }
    }

    // Check media:thumbnail
    if (!thumbnail) {
      const thumbMatch = itemXml.match(/<media:thumbnail[^>]*url="([^"]+)"/i)
      if (thumbMatch) {
        thumbnail = thumbMatch[1]
      }
    }

    // Extract from description HTML as fallback
    if (!thumbnail && description) {
      const imgMatch = description.match(/<img[^>]*src="([^"]+)"/i)
      if (imgMatch) {
        thumbnail = imgMatch[1]
      }
    }

    if (title && link) {
      items.push({
        title: cleanText(title),
        link: link,
        description: cleanText(stripHtml(description || '')),
        pubDate: pubDate ? new Date(pubDate) : new Date(),
        thumbnail: cleanThumbnailUrl(thumbnail)
      })
    }
  }

  return items
}

/**
 * Extract content from XML tag
 */
function extractTag(xml, tagName) {
  // Handle CDATA
  const cdataRegex = new RegExp(`<${tagName}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tagName}>`, 'i')
  const cdataMatch = xml.match(cdataRegex)
  if (cdataMatch) return cdataMatch[1]

  // Handle regular content
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i')
  const match = xml.match(regex)
  return match ? match[1] : null
}

/**
 * Extract attribute from XML tag
 */
function extractAttr(xml, tagName, attrName) {
  const regex = new RegExp(`<${tagName}[^>]*${attrName}="([^"]+)"`, 'i')
  const match = xml.match(regex)
  return match ? match[1] : null
}

/**
 * Strip HTML tags
 */
function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
}

/**
 * Clean text (trim, normalize whitespace)
 */
function cleanText(text) {
  return text.replace(/\s+/g, ' ').trim()
}

/**
 * Clean thumbnail URL - decode HTML entities and extract original image
 */
function cleanThumbnailUrl(url) {
  if (!url) return null

  // Decode HTML entities
  let cleaned = url
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')

  // For AOL/Engadget CDN URLs, extract the original image URL
  // Example: https://o.aolcdn.com/images/dims?image_uri=https%3A%2F%2F...&resize=...
  if (cleaned.includes('o.aolcdn.com') || cleaned.includes('dims?image_uri=')) {
    const imageUriMatch = cleaned.match(/image_uri=([^&]+)/)
    if (imageUriMatch) {
      try {
        cleaned = decodeURIComponent(imageUriMatch[1])
      } catch (e) {
        // Keep original if decode fails
      }
    }
  }

  return cleaned
}

// ============================================
// SUPABASE OPERATIONS
// ============================================

/**
 * Get or create creator
 */
async function getOrCreateCreator(feed) {
  // Try to find existing creator
  const { data: existing } = await supabase
    .from('creators')
    .select('id')
    .eq('slug', feed.slug)
    .single()

  if (existing) {
    return existing.id
  }

  // Create new creator
  const { data: created, error } = await supabase
    .from('creators')
    .insert({
      name: feed.name,
      slug: feed.slug,
      channel_url: feed.url
    })
    .select('id')
    .single()

  if (error) {
    console.error(`  ❌ Failed to create creator ${feed.name}:`, error.message)
    return null
  }

  console.log(`  ✅ Created creator: ${feed.name}`)
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
 * Check if post should be filtered out (Black Friday, deals, etc.)
 */
function shouldFilter(item) {
  const blacklist = [
    'black friday',
    'blackfriday',
    'cyber monday',
    'cybermonday',
    'deal alert',
    'deals roundup',
    'best deals',
    'save on',
    'discount',
    'sale:',
    '% off'
  ]

  const titleLower = item.title.toLowerCase()
  const descLower = (item.description || '').toLowerCase()

  return blacklist.some(term => titleLower.includes(term) || descLower.includes(term))
}

/**
 * Insert post as draft (no tags - n8n will add tags later)
 */
async function insertPost(creatorId, item) {
  // Filter out Black Friday / deals content
  if (shouldFilter(item)) {
    return { skipped: true, reason: 'filtered' }
  }

  // Check for duplicate
  if (await postExists(item.link)) {
    return { skipped: true, reason: 'duplicate' }
  }

  // Insert post
  const { data: post, error } = await supabase
    .from('posts')
    .insert({
      creator_id: creatorId,
      type: 'news',
      status: 'draft',
      title: item.title,
      summary: item.description.substring(0, 500), // Limit summary length
      source_url: item.link,
      thumbnail_url: item.thumbnail,
      created_at: new Date().toISOString()
      // published_at, title_vi, summary_vi, and tags will be set by n8n
    })
    .select('id')
    .single()

  if (error) {
    return { error: error.message }
  }

  return { success: true, id: post.id }
}

// ============================================
// MAIN FETCH FUNCTION
// ============================================

/**
 * Fetch and process a single RSS feed
 */
async function fetchFeed(feed) {
  console.log(`\n📡 Fetching: ${feed.name}`)
  console.log(`   URL: ${feed.url}`)

  try {
    const response = await fetch(feed.url, {
      headers: {
        'User-Agent': 'GearVN-RSS-Bot/1.0'
      }
    })

    if (!response.ok) {
      console.error(`  ❌ HTTP ${response.status}: ${response.statusText}`)
      return { fetched: 0, inserted: 0, skipped: 0, errors: 1 }
    }

    const xmlText = await response.text()
    const items = parseRSS(xmlText)

    console.log(`  📄 Found ${items.length} items`)

    // Get or create creator
    const creatorId = await getOrCreateCreator(feed)
    if (!creatorId) {
      return { fetched: items.length, inserted: 0, skipped: 0, errors: 1 }
    }

    let inserted = 0
    let skipped = 0
    let errors = 0

    // Process items (limit to 35 most recent per feed for ~100 total)
    const recentItems = items.slice(0, 35)

    for (const item of recentItems) {
      const result = await insertPost(creatorId, item)

      if (result.success) {
        inserted++
        console.log(`  ✅ Inserted: ${item.title.substring(0, 50)}...`)
      } else if (result.skipped) {
        skipped++
      } else if (result.error) {
        errors++
        console.error(`  ❌ Error: ${result.error}`)
      }
    }

    console.log(`  📊 Results: ${inserted} inserted, ${skipped} skipped, ${errors} errors`)

    return { fetched: items.length, inserted, skipped, errors }

  } catch (err) {
    console.error(`  ❌ Fetch error: ${err.message}`)
    return { fetched: 0, inserted: 0, skipped: 0, errors: 1 }
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 GearVN RSS Fetcher')
  console.log('=' .repeat(50))
  console.log(`📅 Time: ${new Date().toISOString()}`)
  console.log(`🔗 Supabase: ${SUPABASE_URL}`)

  const totals = { fetched: 0, inserted: 0, skipped: 0, errors: 0 }

  for (const feed of RSS_FEEDS) {
    const result = await fetchFeed(feed)
    totals.fetched += result.fetched
    totals.inserted += result.inserted
    totals.skipped += result.skipped
    totals.errors += result.errors
  }

  console.log('\n' + '='.repeat(50))
  console.log('📊 TOTAL RESULTS')
  console.log(`   Fetched: ${totals.fetched}`)
  console.log(`   Inserted: ${totals.inserted}`)
  console.log(`   Skipped (duplicates): ${totals.skipped}`)
  console.log(`   Errors: ${totals.errors}`)
  console.log('✅ Done!')
}

// Run
main().catch(console.error)
