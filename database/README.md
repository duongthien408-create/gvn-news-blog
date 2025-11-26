# GearVN News & Review - Database Schema

## Overview

Simplified database with only 4 tables:

| Table | Purpose |
|-------|---------|
| `creators` | News sources / YouTube channels |
| `tags` | 13 fixed tags (GAME, AI, PC, RAM, SSD, CPU, VGA, MAINBOARD, LAPTOP, MONITOR, MOUSE, KEYBOARD, HEADSET) |
| `posts` | News articles and video reviews |
| `post_tags` | Many-to-many relationship |

## Setup - Chạy từng file theo thứ tự

Vào Supabase SQL Editor, chạy từng file:

```
01-schema.sql      → Tạo 4 tables + indexes
02-rls.sql         → Row Level Security policies
03-seed-tags.sql   → 13 tags cố định
04-seed-creators.sql → Sample creators (optional)
05-seed-posts.sql    → Sample posts (optional)
06-seed-post-tags.sql → Link posts to tags (optional)
```

## Schema Details

### Posts Table
```sql
- id: UUID
- creator_id: FK to creators
- type: 'news' | 'review'
- status: 'draft' | 'public'
- title: Original title (English)
- title_vi: Vietnamese title (after translation)
- summary: Original summary
- summary_vi: Vietnamese summary
- source_url: Original article URL / YouTube video URL
- thumbnail_url: Image URL
- created_at, published_at: Timestamps
```

### Flow

```
RSS/YouTube → n8n fetch → Insert (status='draft')
                              ↓
                    n8n translate
                              ↓
                    Update (status='public')
                              ↓
                    Frontend displays
```

## For n8n Integration

Use Supabase service_role key to:
1. INSERT new posts with `status='draft'`
2. UPDATE translated content (`title_vi`, `summary_vi`)
3. UPDATE `status='public'` when ready
