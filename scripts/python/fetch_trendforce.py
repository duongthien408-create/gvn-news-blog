"""
TrendForce News Fetcher for GearVN

Fetches tech news from TrendForce and saves to Supabase posts table.
Similar to fetch-rss.js but for TrendForce (which doesn't have RSS).

Usage: python scripts/python/fetch_trendforce.py

Environment variables (or hardcoded below):
- SUPABASE_URL
- SUPABASE_SERVICE_KEY
"""

import sys
import io
import os
from datetime import datetime, timedelta
from typing import List, Dict, Optional

# Fix encoding for Windows console
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Load .env file if exists
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

try:
    from supabase import create_client, Client
except ImportError:
    print("Chua cai dat supabase library!")
    print("Chay: pip install supabase")
    sys.exit(1)

from trendforce_scraper import TrendForceScraper

# ============================================
# CONFIGURATION
# ============================================

SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://qibhlrsdykpkbsnelubz.supabase.co')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYmhscnNkeWtwa2JzbmVsdWJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjM0Nzg3MSwiZXhwIjoyMDc3OTIzODcxfQ.9oq-JCfyLM0pUzSqaScHMXl6vl8nY8tPG563IJFaGys')

# Creator info for TrendForce
TRENDFORCE_CREATOR = {
    'name': 'TrendForce',
    'slug': 'trendforce',
    'channel_url': 'https://www.trendforce.com/news'
}

# Blacklist keywords (deals, promotions, etc.)
BLACKLIST_KEYWORDS = [
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

# ============================================
# SUPABASE OPERATIONS
# ============================================

def get_or_create_creator(supabase: Client) -> Optional[int]:
    """Get or create TrendForce creator"""

    # Try to find existing creator
    result = supabase.table('creators').select('id').eq('slug', TRENDFORCE_CREATOR['slug']).execute()

    if result.data:
        return result.data[0]['id']

    # Create new creator
    result = supabase.table('creators').insert({
        'name': TRENDFORCE_CREATOR['name'],
        'slug': TRENDFORCE_CREATOR['slug'],
        'channel_url': TRENDFORCE_CREATOR['channel_url']
    }).execute()

    if result.data:
        print(f"  Da tao creator: {TRENDFORCE_CREATOR['name']}")
        return result.data[0]['id']

    print(f"  Loi khi tao creator!")
    return None


def post_exists(supabase: Client, source_url: str) -> bool:
    """Check if post already exists by source_url"""
    result = supabase.table('posts').select('id').eq('source_url', source_url).execute()
    return len(result.data) > 0


def should_filter(article: Dict) -> bool:
    """Check if article should be filtered out (deals, promos, etc.)"""
    title_lower = article.get('title', '').lower()
    summary_lower = article.get('summary', '').lower()

    for keyword in BLACKLIST_KEYWORDS:
        if keyword in title_lower or keyword in summary_lower:
            return True
    return False


def is_recent_article(article: Dict) -> bool:
    """Check if article is from yesterday or today"""
    date_str = article.get('date', '')
    if not date_str:
        return True  # If no date, include it

    try:
        # Parse date (format: YYYY-MM-DD)
        article_date = datetime.strptime(date_str, '%Y-%m-%d')
        yesterday = datetime.now() - timedelta(days=1)
        yesterday = yesterday.replace(hour=0, minute=0, second=0, microsecond=0)
        return article_date >= yesterday
    except:
        return True  # If parse fails, include it


def insert_post(supabase: Client, creator_id: int, article: Dict) -> Dict:
    """Insert article as draft post"""

    # Filter out deals/promos
    if should_filter(article):
        return {'skipped': True, 'reason': 'filtered'}

    # Check for duplicate
    if post_exists(supabase, article['url']):
        return {'skipped': True, 'reason': 'duplicate'}

    # Prepare post data (matching posts table schema)
    post_data = {
        'creator_id': creator_id,
        'type': 'news',
        'status': 'draft',
        'title': article['title'],
        'summary': article.get('summary', '')[:500],  # Limit summary length
        'source_url': article['url'],
        'thumbnail_url': article.get('thumbnail'),
        'created_at': datetime.now().isoformat()
    }

    try:
        result = supabase.table('posts').insert(post_data).execute()
        if result.data:
            return {'success': True, 'id': result.data[0]['id']}
        return {'error': 'Insert failed'}
    except Exception as e:
        return {'error': str(e)}


# ============================================
# MAIN FUNCTION
# ============================================

def main():
    yesterday = datetime.now() - timedelta(days=1)
    yesterday = yesterday.replace(hour=0, minute=0, second=0, microsecond=0)

    print("=" * 50)
    print("GearVN TrendForce Fetcher")
    print("=" * 50)
    print(f"Thoi gian chay: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Lay bai tu: {yesterday.strftime('%Y-%m-%d')} tro di")
    print(f"Supabase: {SUPABASE_URL}")

    # Init Supabase
    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    # Get or create creator
    print("\nDang kiem tra creator...")
    creator_id = get_or_create_creator(supabase)
    if not creator_id:
        print("Khong the tao/tim creator!")
        return
    print(f"Creator ID: {creator_id}")

    # Scrape TrendForce
    print("\nDang scrape TrendForce News...")
    scraper = TrendForceScraper()
    articles = scraper.scrape_multiple_pages(start_page=1, end_page=2, delay=1.5)

    print(f"\nTim thay {len(articles)} bai viet")

    # Filter to recent articles only
    recent_articles = [a for a in articles if is_recent_article(a)]
    print(f"{len(recent_articles)} bai tu hom qua/hom nay")

    if not recent_articles:
        print("Khong co bai moi de xu ly")
        return

    # Insert posts
    inserted = 0
    skipped = 0
    filtered = 0
    errors = 0

    for article in recent_articles:
        result = insert_post(supabase, creator_id, article)

        if result.get('success'):
            inserted += 1
            print(f"  Da them: {article['title'][:60]}...")
        elif result.get('skipped'):
            skipped += 1
            if result.get('reason') == 'filtered':
                filtered += 1
        elif result.get('error'):
            errors += 1
            print(f"  Loi: {result['error']}")

    # Summary
    print("\n" + "=" * 50)
    print("KET QUA")
    print("=" * 50)
    print(f"Tong so bai trong feed: {len(articles)}")
    print(f"Bai moi (hom qua/nay): {len(recent_articles)}")
    print(f"Da them moi: {inserted}")
    print(f"Bo qua (trung): {skipped - filtered}")
    print(f"Bo qua (deals/promo): {filtered}")
    print(f"Loi: {errors}")
    print("=" * 50)
    print("Hoan thanh!")


if __name__ == "__main__":
    main()
