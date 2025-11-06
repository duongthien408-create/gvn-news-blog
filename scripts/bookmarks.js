import { getAllPosts, formatNumber } from "./data.js";
import { renderFeed } from "./render.js";
import { initializeInteractions, InteractionState } from "./interactions.js";

// Get bookmarked posts from localStorage
function getBookmarkedPosts() {
  const bookmarked = JSON.parse(localStorage.getItem('bookmarked') || '{}');
  const bookmarkedIds = Object.keys(bookmarked).filter(id => bookmarked[id] === true);

  console.log('Bookmarked from localStorage:', bookmarked);
  console.log('Bookmarked IDs:', bookmarkedIds);

  // Get all posts and filter by bookmarked IDs
  const allPosts = getAllPosts();
  console.log('All posts:', allPosts);

  const filteredPosts = allPosts.filter(post => bookmarkedIds.includes(post.id));
  console.log('Filtered bookmarked posts:', filteredPosts);

  return filteredPosts;
}

// Render empty state
function renderEmptyState() {
  return `
    <div class="mx-auto max-w-2xl rounded-3xl border border-slate-800/80 bg-hub-panel/80 p-10 text-center">
      <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-slate-700 bg-slate-900/50 text-amber-400">
        <i data-lucide="bookmark-x" class="h-8 w-8"></i>
      </div>
      <h2 class="mt-6 text-2xl font-semibold text-white">Chưa có bookmark nào</h2>
      <p class="mt-3 text-sm leading-relaxed text-slate-400">
        Khi lưu lại bài viết, chúng sẽ xuất hiện tại đây kèm tag, nguồn và thời gian cập nhật gần nhất.
        Quay lại feed chính để tiếp tục khám phá và lưu các bài review/insight bạn yêu thích.
      </p>
      <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
        <a
          href="index.html"
          class="inline-flex items-center gap-2 rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-400"
        >
          <i data-lucide="arrow-left" class="h-4 w-4"></i>
          Quay lại trang chủ
        </a>
        <a
          href="explore.html"
          class="inline-flex items-center gap-2 rounded-full border border-red-400/40 px-5 py-2 text-sm font-semibold text-red-200 transition hover:border-red-300 hover:text-red-100"
        >
          <i data-lucide="compass" class="h-4 w-4"></i>
          Khám phá bài viết
        </a>
      </div>
    </div>
  `;
}

// Render bookmarks page
function renderBookmarksPage() {
  console.log('=== Rendering Bookmarks Page ===');
  const bookmarkedPosts = getBookmarkedPosts();
  console.log('Bookmarked posts count:', bookmarkedPosts.length);

  const container = document.getElementById('bookmarks-root');
  const bookmarksCountEl = document.getElementById('bookmarks-count');
  const totalUpvotesEl = document.getElementById('total-upvotes');

  if (!container) {
    console.error('Container #bookmarks-root not found!');
    return;
  }

  // Update counts
  if (bookmarksCountEl) {
    bookmarksCountEl.textContent = bookmarkedPosts.length;
  }

  // Calculate total upvotes
  const totalUpvotes = bookmarkedPosts.reduce((sum, post) => sum + post.upvotes, 0);
  if (totalUpvotesEl) {
    totalUpvotesEl.textContent = formatNumber(totalUpvotes);
  }

  // Render posts or empty state
  if (bookmarkedPosts.length === 0) {
    container.innerHTML = renderEmptyState();
  } else {
    // Render posts grid
    container.innerHTML = `
      <div>
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-white">Bài viết đã lưu (${bookmarkedPosts.length})</h2>
          <button
            id="sort-button"
            class="inline-flex items-center gap-2 rounded-full border border-slate-800 px-4 py-2 text-xs text-slate-400 transition hover:border-slate-600 hover:text-slate-200"
          >
            <i data-lucide="arrow-down-up" class="h-4 w-4"></i>
            Sắp xếp theo mới nhất
          </button>
        </div>
        <div id="bookmarks-grid" class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          ${renderFeed(bookmarkedPosts)}
        </div>
      </div>
    `;

    // Add sort functionality
    const sortButton = document.getElementById('sort-button');
    if (sortButton) {
      let sortByUpvotes = false;
      sortButton.addEventListener('click', () => {
        sortByUpvotes = !sortByUpvotes;

        const sorted = [...bookmarkedPosts].sort((a, b) => {
          if (sortByUpvotes) {
            return b.upvotes - a.upvotes;
          } else {
            // Sort by recent (default - can use upvotes as proxy for recency in this demo)
            return b.upvotes - a.upvotes;
          }
        });

        sortButton.innerHTML = `
          <i data-lucide="arrow-down-up" class="h-4 w-4"></i>
          ${sortByUpvotes ? 'Sắp xếp theo upvotes' : 'Sắp xếp theo mới nhất'}
        `;

        const grid = document.getElementById('bookmarks-grid');
        if (grid) {
          grid.innerHTML = renderFeed(sorted);
        }

        // Refresh icons and interactions
        if (window.lucide?.createIcons) {
          window.lucide.createIcons();
        }
        initializeInteractions(container);
      });
    }
  }

  // Refresh icons
  if (window.lucide?.createIcons) {
    window.lucide.createIcons();
  }

  // Initialize interactions
  initializeInteractions(container);
}

// Search functionality
function setupSearch() {
  const searchInput = document.getElementById('search-input');
  const container = document.getElementById('bookmarks-root');

  if (!searchInput || !container) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const bookmarkedPosts = getBookmarkedPosts();

    if (!query) {
      // Reset to show all
      renderBookmarksPage();
      return;
    }

    // Filter posts
    const filtered = bookmarkedPosts.filter(post => {
      return (
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query)) ||
        post.creator.toLowerCase().includes(query)
      );
    });

    // Update display
    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="mx-auto max-w-2xl rounded-3xl border border-slate-800/80 bg-hub-panel/80 p-10 text-center">
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-slate-700 bg-slate-900/50 text-slate-400">
            <i data-lucide="search-x" class="h-8 w-8"></i>
          </div>
          <h2 class="mt-6 text-2xl font-semibold text-white">Không tìm thấy kết quả</h2>
          <p class="mt-3 text-sm leading-relaxed text-slate-400">
            Không có bài viết nào phù hợp với từ khóa "<strong class="text-slate-200">${query}</strong>".
          </p>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div>
          <div class="mb-6 flex items-center justify-between">
            <h2 class="text-xl font-semibold text-white">Tìm thấy ${filtered.length} bài viết</h2>
            <span class="text-xs text-slate-500">Kết quả cho "${query}"</span>
          </div>
          <div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            ${renderFeed(filtered)}
          </div>
        </div>
      `;
    }

    // Refresh icons and interactions
    if (window.lucide?.createIcons) {
      window.lucide.createIcons();
    }
    initializeInteractions(container);
  });
}

// Initialize
renderBookmarksPage();
setupSearch();

// Listen for storage changes (when user bookmarks/unbookmarks from other tabs)
window.addEventListener('storage', (e) => {
  if (e.key === 'bookmarked') {
    renderBookmarksPage();
  }
});

// Listen for bookmark/unbookmark events in same tab
// We need to add this event dispatch to interactions.js
window.addEventListener('bookmarkChanged', () => {
  renderBookmarksPage();
});
