// Feed loader v2.0 - Updated for new API structure
// No data transformation needed - backend returns correct structure

import { renderFeed } from "./render.js";
import { initializeInteractions } from "./interactions.js";

const gridEl = document.getElementById("feed-grid");

async function loadFeed(filters = {}) {
  if (!gridEl) return;

  try {
    // Show loading state
    gridEl.innerHTML = `
      <div class="col-span-full flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-theme-accent mb-4"></div>
        <p class="text-theme-muted">Loading posts...</p>
      </div>
    `;

    // Fetch posts from API v2.0
    // Backend returns: { id, slug, title, description, thumbnail_url, creators[], tags[], products[], ... }
    const posts = await window.api.getPosts({
      limit: filters.limit || 50,
      creator: filters.creator || '',
      tag: filters.tag || '',
      status: 'published',
      featured: filters.featured || '',
      ...filters
    });

    if (!posts || posts.length === 0) {
      // No posts found
      gridEl.innerHTML = `
        <div class="col-span-full text-center py-20">
          <p class="text-theme-muted mb-4">No posts found</p>
          <button
            onclick="location.reload()"
            class="px-4 py-2 bg-theme-accent rounded-lg hover:bg-theme-accent-hover transition text-white"
          >
            Reload page
          </button>
        </div>
      `;
      return;
    }

    // Render posts (no transformation needed - backend returns correct structure)
    gridEl.innerHTML = renderFeed(posts);

    // Refresh Lucide icons
    if (window.lucide?.createIcons) {
      window.lucide.createIcons();
    }

    // Initialize interactions (voting, bookmarks, share, etc.)
    initializeInteractions(gridEl);

    console.log(`✅ Loaded ${posts.length} posts from API v2.0`);
  } catch (error) {
    console.error('❌ Failed to load feed:', error);

    // Show error state
    gridEl.innerHTML = `
      <div class="col-span-full text-center py-20">
        <div class="mb-4">
          <i data-lucide="alert-circle" class="h-12 w-12 text-red-500 mx-auto"></i>
        </div>
        <p class="text-red-500 mb-2 font-semibold">Failed to load posts</p>
        <p class="text-theme-muted mb-4 text-sm">${error.message}</p>
        <div class="flex gap-3 justify-center">
          <button
            onclick="location.reload()"
            class="px-4 py-2 bg-theme-accent rounded-lg hover:bg-theme-accent-hover transition text-white"
          >
            Try again
          </button>
          <a
            href="index.html"
            class="px-4 py-2 border border-theme-border rounded-lg hover:border-theme-accent transition"
          >
            Go home
          </a>
        </div>
      </div>
    `;

    if (window.lucide?.createIcons) {
      window.lucide.createIcons();
    }
  }
}

// Filter functions
window.filterByCreator = (creatorSlug) => {
  loadFeed({ creator: creatorSlug });
};

window.filterByTag = (tagSlug) => {
  loadFeed({ tag: tagSlug });
};

window.filterFeatured = () => {
  loadFeed({ featured: 'true' });
};

window.clearFilters = () => {
  loadFeed();
};

// Load feed on page load
loadFeed();

// Export for use in other modules
export { loadFeed };
