import { getAllCreators, getAllPosts, getCreatorPosts, formatNumber } from "./data.js";
import { renderFeed } from "./render.js";
import { initializeInteractions, InteractionState } from "./interactions.js";

// Get following data from localStorage
function getFollowingCreators() {
  const following = JSON.parse(localStorage.getItem('following') || '{}');
  const followingIds = Object.keys(following).filter(id => following[id] === true);

  console.log('Following from localStorage:', following);
  console.log('Following IDs:', followingIds);

  // Get all creators and filter by following IDs
  const allCreators = getAllCreators();
  console.log('All creators:', allCreators);

  const filteredCreators = allCreators.filter(creator => followingIds.includes(creator.id));
  console.log('Filtered creators:', filteredCreators);

  return filteredCreators;
}

// Render creator card
function renderCreatorCard(creator) {
  const posts = getCreatorPosts(creator.id);
  const isFollowing = InteractionState.getFollowing(creator.id);

  return `
    <article class="rounded-3xl border border-slate-800/80 bg-hub-panel/80 p-6 transition hover:border-slate-600/60">
      <!-- Banner -->
      <div class="relative h-32 w-full overflow-hidden rounded-2xl">
        <img src="${creator.banner}" alt="${creator.name}" class="h-full w-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-b from-slate-900/10 via-slate-900/25 to-slate-900/70"></div>
      </div>

      <!-- Avatar -->
      <div class="-mt-10 flex items-end justify-between px-2">
        <a href="profile.html?creator=${creator.id}" class="relative">
          <img
            src="${creator.avatar}"
            alt="${creator.name}"
            class="h-20 w-20 rounded-full border-4 border-hub-panel object-cover shadow-lg transition hover:border-red-500/60"
          />
        </a>
        <button
          data-action="follow"
          data-creator-id="${creator.id}"
          data-creator-name="${creator.initials}"
          class="inline-flex items-center gap-2 rounded-full border ${
            isFollowing
              ? 'border-slate-600 bg-slate-700/50 text-slate-300'
              : 'border-red-500/50 bg-red-500/10 text-red-200'
          } px-4 py-2 text-xs font-semibold transition hover:border-red-400/60 hover:text-red-100 cursor-pointer"
        >
          <i data-lucide="${isFollowing ? 'user-check' : 'user-plus'}" class="h-4 w-4"></i>
          ${isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
        </button>
      </div>

      <!-- Info -->
      <div class="mt-4">
        <a href="profile.html?creator=${creator.id}" class="group">
          <h3 class="text-lg font-semibold text-white transition group-hover:text-red-200">
            ${creator.name}
          </h3>
        </a>
        <p class="mt-2 text-sm leading-relaxed text-slate-400 line-clamp-2">
          ${creator.bio}
        </p>

        <!-- Tags -->
        <div class="mt-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-wide text-slate-400">
          ${creator.tags.map(tag => `
            <span class="rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1">
              ${tag.startsWith('#') ? tag : `#${tag}`}
            </span>
          `).join('')}
        </div>

        <!-- Stats -->
        <div class="mt-4 flex items-center gap-6 border-t border-slate-800 pt-4 text-sm text-slate-400">
          <div>
            <p class="text-lg font-semibold text-white">${posts.length}</p>
            <p class="text-xs">Bài viết</p>
          </div>
          <div>
            <p class="text-lg font-semibold text-white">${formatNumber(creator.followers)}</p>
            <p class="text-xs">Followers</p>
          </div>
          <div>
            <p class="text-lg font-semibold text-white">${formatNumber(creator.following)}</p>
            <p class="text-xs">Following</p>
          </div>
        </div>
      </div>
    </article>
  `;
}

// Render empty state
function renderEmptyState() {
  return `
    <div class="mx-auto max-w-2xl rounded-3xl border border-slate-800/80 bg-hub-panel/80 p-10 text-center">
      <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-slate-700 bg-slate-900/50 text-slate-400">
        <i data-lucide="user-x" class="h-8 w-8"></i>
      </div>
      <h2 class="mt-6 text-2xl font-semibold text-white">Bạn chưa theo dõi creator nào</h2>
      <p class="mt-3 text-sm leading-relaxed text-slate-400">
        Khám phá và theo dõi các creator yêu thích để xem nội dung mới nhất từ họ ngay tại đây.
      </p>
      <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
        <a
          href="index.html"
          class="inline-flex items-center gap-2 rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-400"
        >
          <i data-lucide="compass" class="h-4 w-4"></i>
          Khám phá creator
        </a>
        <a
          href="explore.html"
          class="inline-flex items-center gap-2 rounded-full border border-red-400/40 px-5 py-2 text-sm font-semibold text-red-200 transition hover:border-red-300 hover:text-red-100"
        >
          <i data-lucide="search" class="h-4 w-4"></i>
          Tìm kiếm
        </a>
      </div>
    </div>
  `;
}

// Render following page
function renderFollowingPage() {
  console.log('=== Rendering Following Page ===');
  const followingCreators = getFollowingCreators();
  console.log('Following creators count:', followingCreators.length);

  const container = document.getElementById('following-root');
  const followingCountEl = document.getElementById('following-count');
  const postsCountEl = document.getElementById('posts-count');
  const feedSection = document.getElementById('feed-section');
  const feedContainer = document.getElementById('following-feed');

  if (!container) {
    console.error('Container #following-root not found!');
    return;
  }

  // Update counts
  if (followingCountEl) {
    followingCountEl.textContent = followingCreators.length;
  }

  // Calculate total posts
  const totalPosts = followingCreators.reduce((sum, creator) => {
    return sum + getCreatorPosts(creator.id).length;
  }, 0);

  if (postsCountEl) {
    postsCountEl.textContent = totalPosts;
  }

  // Render creators or empty state
  if (followingCreators.length === 0) {
    container.innerHTML = renderEmptyState();
  } else {
    // Render creators grid
    container.innerHTML = `
      <div>
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-white">Creators (${followingCreators.length})</h2>
          <button
            id="sort-button"
            class="inline-flex items-center gap-2 rounded-full border border-slate-800 px-4 py-2 text-xs text-slate-400 transition hover:border-slate-600 hover:text-slate-200"
          >
            <i data-lucide="arrow-down-up" class="h-4 w-4"></i>
            Sắp xếp theo tên
          </button>
        </div>
        <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          ${followingCreators.map(creator => renderCreatorCard(creator)).join('')}
        </div>
      </div>
    `;

    // Get all posts from following creators
    const allPosts = [];
    followingCreators.forEach(creator => {
      const posts = getCreatorPosts(creator.id);
      allPosts.push(...posts);
    });

    // Sort by time (newest first) - in real app would use timestamp
    allPosts.sort((a, b) => b.upvotes - a.upvotes);

    // Show feed section if there are posts
    if (allPosts.length > 0 && feedSection && feedContainer) {
      feedSection.classList.remove('hidden');
      feedContainer.innerHTML = renderFeed(allPosts.slice(0, 12)); // Show first 12 posts
    }
  }

  // Refresh icons
  if (window.lucide?.createIcons) {
    window.lucide.createIcons();
  }

  // Initialize interactions
  initializeInteractions(container);
  if (feedContainer) {
    initializeInteractions(feedContainer);
  }

  // Add sort functionality
  const sortButton = document.getElementById('sort-button');
  if (sortButton && followingCreators.length > 0) {
    let sortByName = true;
    sortButton.addEventListener('click', () => {
      sortByName = !sortByName;

      const sorted = [...followingCreators].sort((a, b) => {
        if (sortByName) {
          return a.name.localeCompare(b.name);
        } else {
          return b.followers - a.followers;
        }
      });

      sortButton.innerHTML = `
        <i data-lucide="arrow-down-up" class="h-4 w-4"></i>
        ${sortByName ? 'Sắp xếp theo tên' : 'Sắp xếp theo followers'}
      `;

      const grid = container.querySelector('.grid');
      if (grid) {
        grid.innerHTML = sorted.map(creator => renderCreatorCard(creator)).join('');
      }

      // Refresh icons and interactions
      if (window.lucide?.createIcons) {
        window.lucide.createIcons();
      }
      initializeInteractions(container);
    });
  }
}

// Search functionality
function setupSearch() {
  const searchInput = document.getElementById('search-input');
  const container = document.getElementById('following-root');

  if (!searchInput || !container) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const followingCreators = getFollowingCreators();

    if (!query) {
      // Reset to show all
      renderFollowingPage();
      return;
    }

    // Filter creators
    const filtered = followingCreators.filter(creator => {
      return (
        creator.name.toLowerCase().includes(query) ||
        creator.bio.toLowerCase().includes(query) ||
        creator.tags.some(tag => tag.toLowerCase().includes(query))
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
            Không có creator nào phù hợp với từ khóa "<strong class="text-slate-200">${query}</strong>".
          </p>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div>
          <div class="mb-6 flex items-center justify-between">
            <h2 class="text-xl font-semibold text-white">Tìm thấy ${filtered.length} creator</h2>
            <span class="text-xs text-slate-500">Kết quả cho "${query}"</span>
          </div>
          <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            ${filtered.map(creator => renderCreatorCard(creator)).join('')}
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
renderFollowingPage();
setupSearch();

// Listen for storage changes (when user follows/unfollows from other tabs)
window.addEventListener('storage', (e) => {
  if (e.key === 'following') {
    renderFollowingPage();
  }
});

// Listen for follow/unfollow events in same tab
window.addEventListener('followingChanged', () => {
  renderFollowingPage();
});
