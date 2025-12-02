#!/usr/bin/env python3
"""
Fetch YouTube transcripts/subtitles for videos in database
Requires: pip install yt-dlp
"""

import os
import json
import subprocess
from datetime import datetime
from supabase import create_client, Client

# Supabase config
SUPABASE_URL = "https://qibhlrsdykpkbsnelubz.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYmhscnNkeWtwa2JzbmVsdWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNDc4NzEsImV4cCI6MjA3NzkyMzg3MX0.jmwZ8r_7dC8fU5hIlgXrFZUpJBxE07bZyBEuLoG1SrM"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Output directory
TRANSCRIPT_DIR = os.path.join(os.path.dirname(__file__), '..', 'data', 'transcripts')
os.makedirs(TRANSCRIPT_DIR, exist_ok=True)


def extract_video_id(url: str) -> str | None:
    """Extract YouTube video ID from URL"""
    import re
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})',
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None


def fetch_transcript(video_url: str, video_id: str) -> dict | None:
    """Fetch transcript using yt-dlp"""
    try:
        # Try to get Vietnamese subtitles first, then auto-generated, then English
        cmd = [
            'yt-dlp',
            '--skip-download',
            '--write-subs',
            '--write-auto-subs',
            '--sub-langs', 'vi,en',
            '--sub-format', 'json3',
            '--output', os.path.join(TRANSCRIPT_DIR, f'{video_id}'),
            video_url
        ]

        result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)

        # Check for subtitle files
        for lang in ['vi', 'en']:
            subtitle_file = os.path.join(TRANSCRIPT_DIR, f'{video_id}.{lang}.json3')
            if os.path.exists(subtitle_file):
                with open(subtitle_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)

                # Parse json3 format to plain text
                transcript_text = parse_json3_subtitles(data)

                return {
                    'video_id': video_id,
                    'language': lang,
                    'transcript': transcript_text,
                    'raw_data': data
                }

        print(f"  No subtitles found for {video_id}")
        return None

    except subprocess.TimeoutExpired:
        print(f"  Timeout fetching {video_id}")
        return None
    except Exception as e:
        print(f"  Error fetching {video_id}: {e}")
        return None


def parse_json3_subtitles(data: dict) -> str:
    """Parse YouTube json3 subtitle format to plain text"""
    if 'events' not in data:
        return ""

    lines = []
    for event in data['events']:
        if 'segs' in event:
            text = ''.join(seg.get('utf8', '') for seg in event['segs'])
            text = text.strip()
            if text and text != '\n':
                lines.append(text)

    return ' '.join(lines)


def save_transcript_to_db(post_id: str, transcript_data: dict):
    """Save transcript to database (add column if needed)"""
    try:
        # Update post with transcript
        supabase.table('posts').update({
            'transcript': transcript_data['transcript'],
            'transcript_lang': transcript_data['language'],
        }).eq('id', post_id).execute()
        print(f"  Saved to database")
    except Exception as e:
        print(f"  Error saving to DB: {e}")
        # Save to file as backup
        output_file = os.path.join(TRANSCRIPT_DIR, f'{transcript_data["video_id"]}.txt')
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(transcript_data['transcript'])
        print(f"  Saved to file: {output_file}")


def main():
    print("=" * 60)
    print("YouTube Transcript Fetcher")
    print("=" * 60)

    # Fetch all YouTube videos from database
    response = supabase.table('posts').select('id, source_url, title_vi').eq('type', 'review').execute()
    posts = response.data

    print(f"Found {len(posts)} review videos")

    success_count = 0
    for i, post in enumerate(posts, 1):
        url = post.get('source_url', '')
        video_id = extract_video_id(url)

        if not video_id:
            continue

        print(f"\n[{i}/{len(posts)}] {post.get('title_vi', '')[:50]}...")
        print(f"  Video ID: {video_id}")

        # Check if already has transcript
        transcript_file = os.path.join(TRANSCRIPT_DIR, f'{video_id}.txt')
        if os.path.exists(transcript_file):
            print(f"  Already fetched, skipping...")
            continue

        transcript_data = fetch_transcript(url, video_id)

        if transcript_data:
            # Save to file
            with open(transcript_file, 'w', encoding='utf-8') as f:
                f.write(transcript_data['transcript'])
            print(f"  Saved transcript ({transcript_data['language']}): {len(transcript_data['transcript'])} chars")
            success_count += 1

            # Optionally save to DB
            # save_transcript_to_db(post['id'], transcript_data)

    print("\n" + "=" * 60)
    print(f"Done! Fetched {success_count} transcripts")
    print(f"Files saved to: {TRANSCRIPT_DIR}")


if __name__ == '__main__':
    main()
