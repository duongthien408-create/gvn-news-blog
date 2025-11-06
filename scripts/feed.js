// Feed loader - Fetches posts from API and renders them

import { renderFeed } from "./render.js";
import { initializeInteractions } from "./interactions.js";

const gridEl = document.getElementById("feed-grid");

async function loadFeed() {
  if (!gridEl) return;

  try {
    // Show loading state
    gridEl.innerHTML = `
      <div class="col-span-3 flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 mb-4"></div>
        <p class="text-gray-400">Đang tải nội dung...</p>
      </div>
    `;

    // Fetch posts from API
    const posts = await window.api.getPosts({ limit: 50 });

    if (!posts || posts.length === 0) {
      // No posts found
      gridEl.innerHTML = `
        <div class="col-span-3 text-center py-20">
          <p class="text-gray-400 mb-4">Chưa có bài viết nào</p>
          <a href="index.html" class="text-blue-500 hover:underline">Tải lại trang</a>
        </div>
      `;
      return;
    }

    // Transform posts data: convert API fields to expected format
    const transformedPosts = posts.map(post => {
      // Strip HTML tags from excerpt and truncate
      const plainTextExcerpt = (post.excerpt || '')
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim()
        .substring(0, 150); // Limit to 150 characters

      return {
        ...post,
        // Map API fields to render.js expected fields
        comments: post.comments_count || 0,
        saves: 0, // Not tracked yet
        shares: 0, // Not tracked yet
        time: post.read_time || '5 min read',
        summary: plainTextExcerpt ? plainTextExcerpt + '...' : '',
        image: post.cover_image || 'https://via.placeholder.com/400x300?text=No+Image',
        // Transform creator fields
        creator: post.creator_name ? {
          id: post.creator_id,
          name: post.creator_name,
          initials: post.creator_name?.substring(0, 2).toUpperCase() || '??',
          badge: 'bg-red-500/20 border border-red-500/40 text-red-300'
        } : {
          // Fallback for RSS posts: use category as creator
          id: `source-${post.source_id || 'unknown'}`,
          name: post.category ? post.category.charAt(0).toUpperCase() + post.category.slice(1) : 'RSS Feed',
          initials: post.category?.substring(0, 2).toUpperCase() || 'RS',
          badge: 'bg-slate-700/50 border border-slate-600 text-slate-300'
        }
      };
    });

    // Render posts
    gridEl.innerHTML = renderFeed(transformedPosts);

    // Refresh Lucide icons
    if (window.lucide?.createIcons) {
      window.lucide.createIcons();
    }

    // Initialize interactions (bookmarks, upvotes, etc.)
    initializeInteractions(gridEl);

    console.log(`✅ Loaded ${posts.length} posts from API`);
  } catch (error) {
    console.error('❌ Failed to load feed:', error);

    // Show error state
    gridEl.innerHTML = `
      <div class="col-span-3 text-center py-20">
        <p class="text-red-500 mb-4">❌ Không thể tải nội dung</p>
        <p class="text-gray-400 mb-4 text-sm">${error.message}</p>
        <button
          onclick="location.reload()"
          class="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
        >
          Thử lại
        </button>
      </div>
    `;
  }
}

// Load feed on page load
loadFeed();
