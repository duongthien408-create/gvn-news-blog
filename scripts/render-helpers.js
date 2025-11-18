// Helper functions for rendering with new API v2.0 data structure

/**
 * Build tag pills for display
 * Now handles tag objects with { name, slug, icon_name }
 */
export const buildTagPills = (tags) => {
  if (!tags || tags.length === 0) return '';

  const maxVisible = 3;
  const visibleTags = tags.slice(0, maxVisible);
  const remainingCount = tags.length - maxVisible;

  const tagElements = visibleTags.map((tag) => {
    // Handle both old string format and new object format
    const tagName = typeof tag === 'string' ? tag : tag.name;
    const tagSlug = typeof tag === 'string' ? tag.toLowerCase() : tag.slug;
    const displayName = tagName.startsWith("#") ? tagName : `#${tagName}`;

    return `<a href="tags.html?tag=${tagSlug}" class="rounded-md bg-theme-card px-2 py-0.5 text-[10px] text-theme-muted hover:bg-theme-accent/20 hover:text-theme-accent transition" onclick="event.stopPropagation()">${displayName}</a>`;
  }).join("");

  const plusButton = remainingCount > 0
    ? `<span class="rounded-md bg-theme-card px-2 py-0.5 text-[10px] text-theme-muted">+${remainingCount}</span>`
    : '';

  return tagElements + plusButton;
};

/**
 * Build creators display
 * Now handles creators array (many-to-many relationship)
 */
export const buildCreatorsDisplay = (creators) => {
  if (!creators || creators.length === 0) {
    return `<span class="text-theme-secondary">Unknown Creator</span>`;
  }

  // Show first creator primarily
  const firstCreator = creators[0];
  const hasMore = creators.length > 1;

  return `
    <a href="creator.html?slug=${firstCreator.slug}"
       class="flex items-center gap-2 hover:text-theme-primary transition"
       onclick="event.stopPropagation()">
      ${firstCreator.avatar_url
        ? `<img src="${firstCreator.avatar_url}" alt="${firstCreator.name}" class="h-6 w-6 rounded-full object-cover" />`
        : `<span class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-theme-accent text-[11px] font-semibold">${getInitials(firstCreator.name)}</span>`
      }
      <span class="font-medium">${firstCreator.name}</span>
      ${firstCreator.verified ? `<i data-lucide="badge-check" class="h-4 w-4 text-blue-400"></i>` : ''}
    </a>
    ${hasMore ? `<span class="text-theme-muted">+${creators.length - 1} more</span>` : ''}
  `;
};

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

/**
 * Format time ago
 */
export const formatTimeAgo = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
    }
  }

  return 'just now';
};

/**
 * Build vote stats block with separate up/down counts
 */
export const buildVoteStats = (post) => {
  const netVotes = (post.upvote_count || 0) - (post.downvote_count || 0);
  const totalVotes = (post.upvote_count || 0) + (post.downvote_count || 0);

  return `
    <div class="flex items-center gap-1">
      <button
        data-action="upvote"
        data-post-id="${post.id}"
        class="inline-flex items-center gap-1 text-theme-secondary transition hover:text-green-400 cursor-pointer"
        title="Upvote"
      >
        <i data-lucide="arrow-up" class="h-4 w-4"></i>
        <span class="text-xs">${post.upvote_count || 0}</span>
      </button>

      <span class="text-xs text-theme-muted font-semibold">${netVotes >= 0 ? '+' : ''}${netVotes}</span>

      <button
        data-action="downvote"
        data-post-id="${post.id}"
        class="inline-flex items-center gap-1 text-theme-secondary transition hover:text-red-400 cursor-pointer"
        title="Downvote"
      >
        <i data-lucide="arrow-down" class="h-4 w-4"></i>
        <span class="text-xs">${post.downvote_count || 0}</span>
      </button>
    </div>
  `;
};

/**
 * Build comment vote stats
 */
export const buildCommentVoteStats = (comment) => {
  const netVotes = (comment.upvote_count || 0) - (comment.downvote_count || 0);

  return `
    <div class="flex items-center gap-2">
      <button
        data-action="upvote-comment"
        data-comment-id="${comment.id}"
        class="inline-flex items-center gap-1 text-theme-secondary transition hover:text-green-400 cursor-pointer"
      >
        <i data-lucide="arrow-up" class="h-3.5 w-3.5"></i>
      </button>

      <span class="text-xs font-semibold ${netVotes >= 0 ? 'text-green-400' : 'text-red-400'}">
        ${netVotes >= 0 ? '+' : ''}${netVotes}
      </span>

      <button
        data-action="downvote-comment"
        data-comment-id="${comment.id}"
        class="inline-flex items-center gap-1 text-theme-secondary transition hover:text-red-400 cursor-pointer"
      >
        <i data-lucide="arrow-down" class="h-3.5 w-3.5"></i>
      </button>
    </div>
  `;
};

/**
 * Build products display (new feature)
 */
export const buildProductsDisplay = (products) => {
  if (!products || products.length === 0) return '';

  const maxVisible = 2;
  const visibleProducts = products.slice(0, maxVisible);
  const remainingCount = products.length - maxVisible;

  const productElements = visibleProducts.map((product) => `
    <a href="products.html?slug=${product.slug}"
       class="inline-flex items-center gap-1.5 rounded-md border border-theme-border bg-theme-card/50 px-2 py-1 text-[10px] hover:border-theme-accent hover:bg-theme-accent/10 transition"
       onclick="event.stopPropagation()">
      <i data-lucide="package" class="h-3 w-3"></i>
      ${product.name}
    </a>
  `).join("");

  const plusButton = remainingCount > 0
    ? `<span class="rounded-md bg-theme-card px-2 py-1 text-[10px] text-theme-muted">+${remainingCount} sản phẩm</span>`
    : '';

  return `<div class="flex flex-wrap gap-1.5 items-center mt-2">${productElements}${plusButton}</div>`;
};

/**
 * Format number with K, M suffix
 */
export const formatNumber = (num) => {
  if (!num) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

/**
 * Build nested comment tree recursively
 */
export const buildCommentTree = (comment, depth = 0) => {
  const hasReplies = comment.replies && comment.replies.length > 0;
  const marginLeft = depth > 0 ? `ml-${Math.min(depth * 8, 12)}` : '';

  return `
    <div class="${marginLeft} ${depth > 0 ? 'border-l-2 border-theme-border pl-4' : ''}">
      <div class="rounded-lg border border-theme-border bg-theme-card/50 p-3 transition hover:border-theme-border/60">
        <div class="flex items-start gap-3">
          ${comment.user.avatar_url
            ? `<img src="${comment.user.avatar_url}" alt="${comment.user.display_name || comment.user.username}" class="h-8 w-8 rounded-full object-cover" />`
            : `<div class="flex h-8 w-8 items-center justify-center rounded-full bg-theme-accent text-xs font-semibold">${getInitials(comment.user.display_name || comment.user.username)}</div>`
          }
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-semibold text-theme-primary">${comment.user.display_name || comment.user.username}</p>
                <p class="text-xs text-theme-muted">${formatTimeAgo(comment.created_at)}</p>
              </div>
              ${comment.status === 'deleted' ? `<span class="text-xs text-red-400">Deleted</span>` : ''}
            </div>
            <p class="mt-2 text-sm leading-relaxed text-theme-secondary">${comment.content}</p>
            <div class="mt-3 flex items-center gap-4">
              ${buildCommentVoteStats(comment)}
              <button
                data-action="reply-comment"
                data-comment-id="${comment.id}"
                class="inline-flex items-center gap-1 text-xs text-theme-secondary transition hover:text-theme-primary cursor-pointer"
              >
                <i data-lucide="corner-down-right" class="h-3.5 w-3.5"></i>
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>
      ${hasReplies ? `
        <div class="mt-2 space-y-2">
          ${comment.replies.map(reply => buildCommentTree(reply, depth + 1)).join('')}
        </div>
      ` : ''}
    </div>
  `;
};
