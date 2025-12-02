#!/usr/bin/env python3
"""
Fetch YouTube videos with transcripts and save to database
"""

import os
import sys
import json
import re
import time
import tempfile
import yt_dlp
from datetime import datetime
from supabase import create_client, Client

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

# Supabase config
SUPABASE_URL = "https://qibhlrsdykpkbsnelubz.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYmhscnNkeWtwa2JzbmVsdWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNDc4NzEsImV4cCI6MjA3NzkyMzg3MX0.jmwZ8r_7dC8fU5hIlgXrFZUpJBxE07bZyBEuLoG1SrM"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def get_or_create_creator(name: str, channel_url: str) -> str:
    """Get or create creator in database"""
    # Check if exists
    response = supabase.table('creators').select('id').eq('name', name).execute()
    if response.data:
        return response.data[0]['id']

    # Create new
    slug = name.lower().replace(' ', '-')
    response = supabase.table('creators').insert({
        'name': name,
        'slug': slug,
        'channel_url': channel_url,
    }).execute()

    return response.data[0]['id']


def extract_video_id(url: str) -> str:
    """Extract YouTube video ID from URL"""
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})',
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None


def parse_json3_subtitles(data: dict) -> tuple[str, str]:
    """Parse YouTube json3 subtitle format to plain text and timestamped text"""
    if 'events' not in data:
        return "", ""

    plain_lines = []
    timestamped_lines = []

    for event in data.get('events', []):
        if 'segs' in event:
            start_ms = event.get('tStartMs', 0)
            seconds = start_ms // 1000
            minutes = seconds // 60
            secs = seconds % 60
            timestamp = f'{minutes:02d}:{secs:02d}'

            text = ''.join(seg.get('utf8', '') for seg in event['segs'])
            text = text.strip()
            if text and text != '\n':
                plain_lines.append(text)
                timestamped_lines.append(f'[{timestamp}] {text}')

    return ' '.join(plain_lines), '\n'.join(timestamped_lines)


def fetch_transcript(video_id: str, video_url: str) -> dict:
    """Fetch transcript using yt-dlp (no local file storage)"""
    print(f"    Fetching transcript...")

    # Use temp directory for subtitle files
    with tempfile.TemporaryDirectory() as temp_dir:
        ydl_opts = {
            'skip_download': True,
            'writesubtitles': True,
            'writeautomaticsub': True,
            'subtitleslangs': ['vi'],  # Only Vietnamese
            'subtitlesformat': 'json3',
            'outtmpl': os.path.join(temp_dir, video_id),
            'quiet': True,
            'no_warnings': True,
        }

        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.extract_info(video_url, download=True)

            # Check for subtitle file in temp dir
            subtitle_file = os.path.join(temp_dir, f'{video_id}.vi.json3')
            if os.path.exists(subtitle_file):
                with open(subtitle_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)

                plain_text, timestamped_text = parse_json3_subtitles(data)

                print(f"    Transcript: {len(plain_text)} chars")
                return {
                    'transcript': plain_text,
                    'transcript_timestamped': timestamped_text,
                    'language': 'vi'
                }

            print(f"    No subtitles found")
            return None

        except Exception as e:
            print(f"    Error fetching transcript: {e}")
            return None


def fetch_videos_from_channel(channel_url: str, limit: int = 5) -> list:
    """Fetch latest videos from YouTube channel"""
    print(f"Fetching {limit} videos from channel...")

    ydl_opts = {
        'quiet': True,
        'extract_flat': True,
        'playlist_items': f'1-{limit}',
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(channel_url, download=False)

            if 'entries' not in info:
                print("No videos found")
                return []

            videos = []
            for entry in info['entries']:
                if entry:
                    videos.append({
                        'id': entry.get('id'),
                        'title': entry.get('title'),
                        'url': f"https://www.youtube.com/watch?v={entry.get('id')}",
                    })

            print(f"Found {len(videos)} videos")
            return videos

    except Exception as e:
        print(f"Error fetching channel: {e}")
        return []


def get_video_details(video_url: str) -> dict:
    """Get full video details"""
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=False)
            return {
                'id': info.get('id'),
                'title': info.get('title'),
                'description': info.get('description', '')[:500],
                'thumbnail': info.get('thumbnail'),
                'duration': info.get('duration'),
                'upload_date': info.get('upload_date'),
                'view_count': info.get('view_count'),
            }
    except Exception as e:
        print(f"Error getting video details: {e}")
        return None


def check_video_exists(source_url: str) -> bool:
    """Check if video already exists in database"""
    response = supabase.table('posts').select('id').eq('source_url', source_url).execute()
    return len(response.data) > 0


def save_to_database(video: dict, creator_id: str, transcript_data: dict = None):
    """Save video to database with transcript"""

    # Parse upload date
    published_at = None
    if video.get('upload_date'):
        try:
            published_at = datetime.strptime(video['upload_date'], '%Y%m%d').isoformat()
        except:
            published_at = datetime.now().isoformat()
    else:
        published_at = datetime.now().isoformat()

    post_data = {
        'creator_id': creator_id,
        'type': 'review',
        'status': 'draft',
        'source': 'youtube',
        'platform': 'youtube',
        'title': video.get('title', ''),
        'title_vi': video.get('title', ''),  # Vietnamese title
        'summary': video.get('description', '')[:200] if video.get('description') else '',
        'summary_vi': video.get('description', '')[:200] if video.get('description') else '',
        'source_url': video.get('url'),
        'thumbnail_url': video.get('thumbnail'),
        'published_at': published_at,
        'created_at': datetime.now().isoformat(),
    }

    # Add transcript if available
    if transcript_data:
        post_data['transcript'] = transcript_data.get('transcript', '')

    try:
        response = supabase.table('posts').insert(post_data).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        print(f"    Error saving to database: {e}")
        return None


def get_channel_name(channel_url: str) -> str:
    """Get channel name from YouTube channel"""
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'extract_flat': True,
    }
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(channel_url, download=False)
            return info.get('channel', info.get('uploader', 'Unknown'))
    except:
        return None


def process_channel(channel_id: str, limit: int = 5) -> tuple[int, int]:
    """Process a single channel and return (success_count, skip_count)"""
    channel_url = f"https://www.youtube.com/channel/{channel_id}/videos"

    print(f"\n{'='*60}")
    print(f"Processing channel: {channel_id}")

    # Get channel name
    channel_name = get_channel_name(channel_url)
    if not channel_name:
        print(f"  Could not get channel name, skipping...")
        return 0, 0

    print(f"Channel name: {channel_name}")

    # Get or create creator
    creator_id = get_or_create_creator(channel_name, channel_url)
    print(f"Creator ID: {creator_id}")

    # Fetch videos
    videos = fetch_videos_from_channel(channel_url, limit=limit)

    if not videos:
        print("No videos found")
        return 0, 0

    success_count = 0
    skip_count = 0

    for i, video in enumerate(videos, 1):
        title_preview = video['title'][:50] if video.get('title') else 'No title'
        print(f"\n[{i}/{len(videos)}] {title_preview}...")

        # Check if already exists
        if check_video_exists(video['url']):
            print(f"    Already exists, skipping...")
            skip_count += 1
            continue

        # Get full video details
        print(f"    Getting video details...")
        details = get_video_details(video['url'])
        if details:
            video.update(details)

        # Fetch transcript
        transcript_data = fetch_transcript(video['id'], video['url'])

        # Save to database
        print(f"    Saving to database...")
        result = save_to_database(video, creator_id, transcript_data)

        if result:
            print(f"    Saved! Post ID: {result['id']}")
            success_count += 1
        else:
            print(f"    Failed to save")

        # Rate limiting
        time.sleep(2)

    return success_count, skip_count


def main():
    print("=" * 60)
    print("YouTube Video + Transcript Fetcher")
    print("=" * 60)

    # List of channels to fetch (channel IDs)
    channels = [
        "UCdxRpD_T4-HzPsely-Fcezw",   # GEARVN
        "UC3HxHh_jezfVCcXNCyDJHOQ",   # Nguoi Choi Do
        "UCMSDj69umhJodE1BLJNxYIw",   # GenZ Viet
        "UCyqxvGyF5LO67HI6vdE5bfQ",   # Vinh Xo
        "UCEeXA5Tu7n9X5_zkOgGsyww",   # Vat Vo Studio
        "UCTymg6O7vl87L0c5SdZVAeQ",   # Binh Bear
        "UCiYYo7oPjA_MQ9i7-zoNfGA",   # Tai Xai Tech
    ]

    total_success = 0
    total_skip = 0

    for channel_id in channels:
        success, skip = process_channel(channel_id, limit=5)
        total_success += success
        total_skip += skip

    print("\n" + "=" * 60)
    print(f"ALL DONE! Total saved: {total_success}, Total skipped: {total_skip}")
    print("=" * 60)


if __name__ == '__main__':
    main()
