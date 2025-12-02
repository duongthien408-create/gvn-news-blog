#!/usr/bin/env python3
"""
Fetch transcript from latest GEARVN YouTube video
"""

import os
import json
import yt_dlp

# Output directory
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
TRANSCRIPT_DIR = os.path.join(SCRIPT_DIR, '..', 'data', 'transcripts')
os.makedirs(TRANSCRIPT_DIR, exist_ok=True)


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


def fetch_transcript(video_url: str):
    """Fetch transcript using yt-dlp"""
    print(f"Fetching: {video_url}")

    ydl_opts = {
        'skip_download': True,
        'writesubtitles': True,
        'writeautomaticsub': True,
        'subtitleslangs': ['vi', 'en'],
        'subtitlesformat': 'json3',
        'outtmpl': os.path.join(TRANSCRIPT_DIR, '%(id)s'),
        'quiet': False,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(video_url, download=True)
        video_id = info['id']
        title = info.get('title', 'Unknown')

        print(f"\nVideo ID: {video_id}")
        print(f"Title: {title}")

        # Find subtitle file
        for lang in ['vi', 'en']:
            subtitle_file = os.path.join(TRANSCRIPT_DIR, f'{video_id}.{lang}.json3')
            if os.path.exists(subtitle_file):
                print(f"Found subtitles: {lang}")

                with open(subtitle_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)

                transcript = parse_json3_subtitles(data)

                # Save plain text
                output_file = os.path.join(TRANSCRIPT_DIR, f'{video_id}.txt')
                with open(output_file, 'w', encoding='utf-8') as f:
                    f.write(f"Title: {title}\n")
                    f.write(f"Video ID: {video_id}\n")
                    f.write(f"Language: {lang}\n")
                    f.write(f"URL: {video_url}\n")
                    f.write("=" * 60 + "\n\n")
                    f.write(transcript)

                print(f"Saved transcript to: {output_file}")
                print(f"Transcript length: {len(transcript)} characters")
                print(f"\nFirst 500 chars:\n{transcript[:500]}...")

                return transcript

        print("No subtitles found!")
        return None


def main():
    # Test with specific video URL
    video_url = "https://www.youtube.com/watch?v=4SEqKb77WXQ"

    print("=" * 60)
    print("Fetching transcript from GEARVN video...")
    print("=" * 60)

    fetch_transcript(video_url)


if __name__ == '__main__':
    main()
