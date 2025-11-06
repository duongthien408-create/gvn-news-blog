// Post Modal Handler
export function openPostModal(postId) {
  // Create modal overlay - dark mode only
  const modal = document.createElement('div');
  modal.id = 'post-modal';
  modal.className = `fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 backdrop-blur-sm p-4`;

  // Show loading state
  modal.innerHTML = `
    <div class="my-8 flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-theme-accent"></div>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  // Fetch post data and render
  loadPostModal(postId, modal);

  // Close handlers
  modal.addEventListener('click', (e) => {
    if (e.target.id === 'post-modal' || e.target.closest('[data-close-modal]')) {
      closePostModal();
    }
  });

  document.addEventListener('keydown', handleEscapeKey);
}

export function closePostModal() {
  const modal = document.getElementById('post-modal');
  if (modal) {
    modal.remove();
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleEscapeKey);
  }
}

function handleEscapeKey(e) {
  if (e.key === 'Escape') {
    closePostModal();
  }
}

async function loadPostModal(postId, modal) {
  try {
    // Fetch post and related data
    const [post, allPosts, comments] = await Promise.all([
      window.api.getPostById(postId),
      window.api.getPosts({ limit: 10 }),
      window.api.getComments(postId)
    ]);

    if (!post) {
      modal.innerHTML = renderError();
      return;
    }

    // Transform post data
    const transformedPost = transformPost(post);
    const transformedAllPosts = (allPosts || []).slice(0, 4).map(transformPost);

    // Render modal content
    modal.innerHTML = renderModalContent(transformedPost, transformedAllPosts, comments || []);

    // Initialize icons and interactions
    if (window.lucide?.createIcons) {
      window.lucide.createIcons();
    }

    // Initialize interactions
    if (window.initializeInteractions) {
      window.initializeInteractions(modal);
    }
  } catch (error) {
    console.error('Error loading post modal:', error);
    modal.innerHTML = renderError();
  }
}

function transformPost(p) {
  const plainTextExcerpt = (p.excerpt || '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 300);

  return {
    ...p,
    comments: p.comments_count || 0,
    saves: 0,
    shares: 0,
    time: p.read_time || '5 min read',
    summary: plainTextExcerpt ? plainTextExcerpt + '...' : '',
    image: p.cover_image || 'https://via.placeholder.com/800x400?text=No+Image',
    creator: p.creator_name ? {
      id: p.creator_id,
      name: p.creator_name,
      initials: p.creator_name?.substring(0, 2).toUpperCase() || '??',
      badge: 'bg-red-500/20 border border-red-500/40 text-red-300'
    } : {
      id: `source-${p.source_id || 'unknown'}`,
      name: p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : 'RSS Feed',
      initials: p.category?.substring(0, 2).toUpperCase() || 'RS',
      badge: 'bg-slate-700/50 border border-slate-600 text-slate-300'
    }
  };
}

function renderModalContent(post, relatedPosts, comments) {
  const buildTagPills = (tags) => {
    if (!tags || tags.length === 0) return '';
    const maxVisible = 4;
    const visibleTags = tags.slice(0, maxVisible);
    const remainingCount = tags.length - maxVisible;

    const tagElements = visibleTags.map(tag =>
      `<span class="rounded-md bg-theme-card px-2 py-0.5 text-[10px] text-theme-muted">${
        tag.startsWith("#") ? tag : `#${tag}`
      }</span>`
    ).join("");

    const plusButton = remainingCount > 0
      ? `<span class="rounded-md bg-theme-card px-2 py-0.5 text-[10px] text-theme-muted">+${remainingCount}</span>`
      : '';

    return tagElements + plusButton;
  };

  return `
    <!-- Modal Content - Single Box -->
    <div class="relative my-8 w-full max-w-6xl max-h-[90vh] rounded-2xl border border-theme-border bg-theme-surface/98 backdrop-blur overflow-hidden">
      <!-- Close Button - Inside Box -->
      <button data-close-modal class="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-theme-card text-theme-secondary transition hover:bg-theme-panel hover:text-theme-primary">
        <i data-lucide="x" class="h-6 w-6"></i>
      </button>

      <!-- Scrollable Content -->
      <div class="overflow-y-auto max-h-[90vh] p-6" style="scrollbar-width: thin; scrollbar-color: var(--color-border) var(--color-surface);">
      <div class="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <!-- Main Content -->
        <div class="p-2">
          <!-- Author Header -->
          <div class="flex items-start justify-between">
            <a href="profile.html?creator=${post.creator?.id ?? ""}" class="flex items-center gap-3 transition hover:opacity-80">
              <span class="flex h-12 w-12 items-center justify-center rounded-full ${post.creator?.badge ?? ""} text-sm font-semibold">
                ${post.creator?.initials ?? ""}
              </span>
              <div>
                <p class="font-semibold text-theme-primary">${post.creator?.name ?? "Creator"}</p>
                <p class="text-sm text-theme-muted">${post.category || 'Uncategorized'}</p>
              </div>
            </a>

            <div class="flex items-center gap-3">
              <a href="${post.url || '#'}" target="_blank" class="rounded-full border border-theme-border bg-theme-card px-4 py-2 text-sm font-medium text-theme-secondary transition hover:bg-theme-panel hover:text-theme-primary">
                Read post
                <i data-lucide="external-link" class="ml-1 inline h-4 w-4"></i>
              </a>
              <button class="flex h-10 w-10 items-center justify-center rounded-full border border-theme-border bg-theme-card text-theme-secondary transition hover:bg-theme-panel hover:text-theme-primary">
                <i data-lucide="more-horizontal" class="h-5 w-5"></i>
              </button>
            </div>
          </div>

          <!-- Post Title & Meta -->
          <div class="mt-6">
            <h1 class="text-2xl font-bold text-theme-primary">${post.title}</h1>
            <p class="mt-2 text-sm text-theme-muted">${post.time} • ${new Date(post.published_at || post.created_at).toLocaleDateString('vi-VN')}</p>
          </div>

          <!-- Featured Image -->
          ${post.image ? `
            <div class="mt-6 overflow-hidden rounded-xl border border-theme-border">
              <img src="${post.image}" alt="${post.title}" class="w-full object-cover" />
            </div>
          ` : ''}

          <!-- Tags -->
          ${post.tags && post.tags.length > 0 ? `
            <div class="mt-6 flex flex-wrap gap-2">
              ${buildTagPills(post.tags)}
            </div>
          ` : ''}

          <!-- Post Content -->
          <div class="prose prose-invert dark:prose-invert prose-slate mt-6 max-w-none text-theme-secondary">
            <p>${post.summary}</p>
          </div>

          <!-- Interaction Stats -->
          <div class="mt-8 flex items-center gap-1 text-sm text-theme-muted">
            <span>${post.upvotes || 0} Upvotes</span>
          </div>

          <!-- Action Buttons -->
          <div class="mt-4 flex items-center justify-between border-t border-theme-border pt-4">
            <div class="flex items-center gap-4">
              <button
                data-action="upvote"
                data-post-id="${post.id}"
                class="inline-flex items-center gap-2 text-theme-secondary transition hover:text-theme-accent cursor-pointer">
                <i data-lucide="arrow-big-up" class="h-6 w-6"></i>
                <span class="text-sm upvote-count">${post.upvotes || 0}</span>
              </button>
              <button class="inline-flex items-center gap-2 text-theme-secondary transition hover:text-theme-primary">
                <i data-lucide="message-circle" class="h-6 w-6"></i>
                <span class="text-sm">${post.comments}</span>
              </button>
              <button
                data-action="bookmark"
                data-post-id="${post.id}"
                class="inline-flex items-center gap-2 text-theme-secondary transition hover:text-amber-300 cursor-pointer">
                <i data-lucide="bookmark" class="h-6 w-6"></i>
                <span class="text-sm">Lưu</span>
              </button>
              <button
                data-action="share"
                data-post-id="${post.id}"
                data-post-title="${post.title}"
                class="inline-flex items-center gap-2 text-theme-secondary transition hover:text-theme-primary cursor-pointer">
                <i data-lucide="share-2" class="h-6 w-6"></i>
                <span class="text-sm">Chia sẻ</span>
              </button>
            </div>
          </div>

          <!-- Comment Section -->
          <div class="mt-8 border-t border-theme-border pt-6">
            <div class="flex items-center justify-between mb-4">
              <p class="text-sm font-semibold text-theme-primary">${comments.length} bình luận</p>
            </div>

            <!-- Comment Input -->
            ${window.api?.isLoggedIn() ? `
              <div class="flex items-start gap-3 mb-6">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20 text-sm font-semibold text-red-300">
                  U
                </div>
                <div class="flex-1">
                  <textarea
                    placeholder="Chia sẻ suy nghĩ của bạn..."
                    rows="3"
                    class="w-full rounded-xl border border-theme-border bg-theme-card px-4 py-3 text-sm text-theme-primary placeholder:text-theme-muted focus:border-theme-accent focus:outline-none"
                  ></textarea>
                  <div class="mt-2 flex justify-end">
                    <button
                      data-action="submit-comment"
                      data-post-id="${post.id}"
                      class="rounded-full bg-theme-accent px-6 py-2 text-sm font-semibold text-white transition hover:bg-theme-accent-hover cursor-pointer">
                      Đăng
                    </button>
                  </div>
                </div>
              </div>
            ` : `
              <div class="mb-6 text-center">
                <p class="text-theme-secondary text-sm">Vui lòng <a href="login.html" class="text-theme-accent hover:text-theme-accent-hover">đăng nhập</a> để bình luận</p>
              </div>
            `}

            <!-- Comments List -->
            ${comments.length > 0 ? `
              <div class="space-y-4">
                ${comments.map(comment => `
                  <div class="rounded-xl border border-theme-border bg-theme-card p-4">
                    <div class="flex items-start gap-3">
                      <div class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700/50 text-sm font-semibold text-slate-300">
                        ${comment.user_name?.substring(0, 2).toUpperCase() || 'U'}
                      </div>
                      <div class="flex-1">
                        <div class="flex items-center justify-between">
                          <div>
                            <p class="text-sm font-semibold text-theme-primary">${comment.user_name || 'Anonymous'}</p>
                            <p class="text-xs text-theme-muted">${new Date(comment.created_at).toLocaleDateString('vi-VN')}</p>
                          </div>
                        </div>
                        <p class="mt-2 text-sm text-theme-secondary">${comment.content}</p>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : `
              <div class="text-center text-theme-muted py-8">
                <p>Chưa có bình luận nào. Hãy là người đầu tiên!</p>
              </div>
            `}
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6 p-2">
          <!-- Author Card -->
          <div class="rounded-xl border border-theme-border bg-theme-card p-5">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <span class="flex h-16 w-16 items-center justify-center rounded-full ${post.creator?.badge ?? ""} text-xl font-semibold">
                  ${post.creator?.initials ?? ""}
                </span>
                <div>
                  <p class="font-semibold text-theme-primary">${post.creator?.name ?? "Creator"}</p>
                  <p class="text-sm text-theme-muted">${post.category || 'Uncategorized'}</p>
                </div>
              </div>
              <button
                data-action="follow"
                data-creator-id="${post.creator?.id ?? ""}"
                data-creator-name="${post.creator?.name ?? ""}"
                class="rounded-full bg-theme-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-theme-accent-hover cursor-pointer">
                Follow
              </button>
            </div>
            <p class="mt-4 text-sm text-theme-secondary">
              ${post.category ? `Chuyên mục: ${post.category}` : 'Tech enthusiast'}
            </p>
          </div>

          <!-- Related Posts -->
          ${relatedPosts.length > 0 ? `
            <div class="rounded-xl border border-theme-border bg-theme-card p-5">
              <h3 class="font-semibold text-theme-primary mb-4">Bài viết liên quan</h3>
              <div class="space-y-4">
                ${relatedPosts.map(related => `
                  <a href="#" onclick="window.openPostModal('${related.id}'); return false;" class="block group">
                    <p class="text-sm text-theme-secondary group-hover:text-theme-primary transition line-clamp-2">${related.title}</p>
                    <p class="text-xs text-theme-muted mt-1">${related.comments} Comments</p>
                  </a>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Footer Links -->
          <div class="rounded-xl border border-theme-border bg-theme-card p-5">
            <p class="text-xs text-theme-muted mb-3">© 2025 GearVN Creator Hub</p>
            <div class="flex flex-wrap gap-3 text-xs text-theme-muted">
              <a href="#" class="hover:text-theme-secondary transition">Guidelines</a>
              <a href="#" class="hover:text-theme-secondary transition">Tags</a>
              <a href="#" class="hover:text-theme-secondary transition">Sources</a>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  `;
}

function renderError() {
  return `
    <div class="my-8 w-full max-w-2xl">
      <div class="rounded-2xl border border-theme-border bg-theme-panel p-10 text-center backdrop-blur">
        <p class="text-lg font-semibold text-theme-primary">Không thể tải bài viết</p>
        <p class="mt-2 text-sm text-theme-secondary">Vui lòng thử lại sau</p>
        <button data-close-modal class="mt-6 rounded-full bg-theme-accent px-6 py-2 text-sm font-semibold text-white transition hover:bg-theme-accent-hover">
          Đóng
        </button>
      </div>
    </div>
  `;
}

// Export to global scope
window.openPostModal = openPostModal;
window.closePostModal = closePostModal;
