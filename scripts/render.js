// Rendering functions for GearVN Blog v2.0
// Updated for new API data structure with creators[], tags[], products[]

import {
  buildTagPills,
  buildCreatorsDisplay,
  buildVoteStats,
  buildCommentVoteStats,
  buildCommentTree,
  buildProductsDisplay,
  formatTimeAgo,
  formatNumber,
  getInitials
} from './render-helpers.js';

/**
 * Build stats block for post cards
 */
const buildStatsBlock = (post) => `
  <div class="mt-4 flex items-center justify-between text-sm text-theme-muted">
    <div class="flex items-center gap-3">
      ${buildVoteStats(post)}
      <a href="detail.html?slug=${post.slug}#comments"
         class="inline-flex items-center gap-1.5 text-theme-secondary transition hover:text-theme-primary"
         title="Comments">
        <i data-lucide="message-circle" class="h-4 w-4"></i>
        <span class="text-xs">${post.comment_count || 0}</span>
      </a>
      ${post.view_count ? `
        <span class="inline-flex items-center gap-1.5 text-theme-muted" title="Views">
          <i data-lucide="eye" class="h-4 w-4"></i>
          <span class="text-xs">${formatNumber(post.view_count)}</span>
        </span>
      ` : ''}
    </div>
    <div class="flex items-center gap-2">
      <button
        data-action="bookmark"
        data-post-id="${post.id}"
        class="inline-flex items-center justify-center text-theme-secondary transition hover:text-amber-400 cursor-pointer"
        title="Bookmark"
      >
        <i data-lucide="bookmark" class="h-4 w-4"></i>
      </button>
      <button
        data-action="share"
        data-post-id="${post.id}"
        data-post-title="${post.title}"
        class="inline-flex items-center justify-center text-theme-secondary transition hover:text-theme-primary cursor-pointer"
        title="Share"
      >
        <i data-lucide="share-2" class="h-4 w-4"></i>
      </button>
    </div>
  </div>
`;

/**
 * Render feed of posts - Updated for new data structure
 */
export const renderFeed = (posts) =>
  posts
    .map((post) => `
      <article class="group flex h-full flex-col rounded-2xl border border-theme-border bg-theme-panel/80 p-4 backdrop-blur transition hover:-translate-y-0.5 hover:border-theme-border/60 hover:shadow-lg cursor-pointer"
               onclick="window.location.href='detail.html?slug=${post.slug}'">

        <div class="block relative overflow-hidden rounded-xl border border-theme-border mb-3">
          <img src="${post.thumbnail_url || post.image || 'https://via.placeholder.com/400x200'}"
               alt="${post.title}"
               class="w-full h-48 object-cover transition duration-300 group-hover:scale-105" />

          ${post.featured ? `
            <div class="absolute top-2 left-2">
              <span class="inline-flex items-center gap-1 rounded-full bg-amber-500/90 backdrop-blur-sm px-2 py-1 text-[10px] font-bold text-white uppercase">
                <i data-lucide="star" class="h-3 w-3"></i>
                Featured
              </span>
            </div>
          ` : ''}
        </div>

        <div class="block transition hover:text-theme-accent-hover">
          <h2 class="text-base font-semibold text-theme-primary line-clamp-2 leading-snug" title="${post.title}">
            ${post.title}
          </h2>
        </div>

        ${post.description ? `
          <p class="mt-2 text-sm text-theme-secondary line-clamp-2">${post.description}</p>
        ` : ''}

        <div class="mt-2 flex flex-wrap gap-1.5 items-center">
          ${buildTagPills(post.tags || [])}
        </div>

        ${post.products && post.products.length > 0 ? buildProductsDisplay(post.products) : ''}

        <div class="mt-3 flex items-center gap-2 text-sm text-theme-secondary">
          ${buildCreatorsDisplay(post.creators || [])}
          <span class="text-theme-muted">•</span>
          <span class="text-theme-muted">${formatTimeAgo(post.published_at || post.created_at)}</span>
        </div>

        <div onclick="event.stopPropagation()">
          ${buildStatsBlock(post)}
        </div>
      </article>
    `)
    .join("");

const buildCommentMarkup = (comments) => {
  if (!comments || comments.length === 0) {
    return '<p class="text-sm text-theme-muted text-center py-8">No comments yet.</p>';
  }
  return comments.map(comment => buildCommentTree(comment, 0)).join('');
};

const buildRelatedMarkup = (items) =>
  items
    .map((item) => `
      <a href="detail.html?slug=${item.slug}"
         class="flex w-full items-start gap-3 rounded-2xl border border-theme-border bg-theme-card/60 p-4 text-left transition hover:border-theme-border/80">
        ${item.creators && item.creators.length > 0 && item.creators[0].avatar_url
          ? `<img src="${item.creators[0].avatar_url}" alt="${item.creators[0].name}" class="h-10 w-10 rounded-full object-cover" />`
          : `<span class="flex h-10 w-10 items-center justify-center rounded-full bg-theme-accent text-xs font-semibold">${item.creators && item.creators.length > 0 ? getInitials(item.creators[0].name) : '?'}</span>`
        }
        <div class="flex-1">
          <p class="text-sm font-semibold text-theme-primary line-clamp-2">${item.title}</p>
          ${item.tags && item.tags.length > 0 ? `
            <p class="mt-1 text-xs text-theme-muted">${item.tags.slice(0, 3).map(t => `#${typeof t === 'string' ? t : t.name}`).join(' · ')}</p>
          ` : ''}
        </div>
        <i data-lucide="arrow-up-right" class="h-4 w-4 text-theme-muted"></i>
      </a>
    `)
    .join("");

export const renderDetail = (post, relatedPosts, comments) => {
  const related = relatedPosts.slice(0, 4);
  const firstCreator = post.creators && post.creators.length > 0 ? post.creators[0] : null;

  return `
    <section class="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <article class="rounded-3xl border border-theme-border bg-theme-panel/90 p-8 text-theme-primary shadow-xl">
        <div class="flex flex-wrap items-start justify-between gap-4">
          ${firstCreator ? `
            <a href="creator.html?slug=${firstCreator.slug}" class="flex items-center gap-3">
              ${firstCreator.avatar_url
                ? `<img src="${firstCreator.avatar_url}" alt="${firstCreator.name}" class="h-12 w-12 rounded-full" />`
                : `<span class="flex h-12 w-12 items-center justify-center rounded-full bg-theme-accent text-sm font-semibold">${getInitials(firstCreator.name)}</span>`
              }
              <div>
                <p class="text-sm font-semibold">${firstCreator.name}</p>
                <p class="text-xs text-theme-muted">${formatTimeAgo(post.published_at)}</p>
              </div>
            </a>
          ` : ''}
        </div>

        <h1 class="mt-6 text-3xl font-bold">${post.title}</h1>

        <div class="mt-4 flex flex-wrap gap-2">
          ${buildTagPills(post.tags || [])}
        </div>

        ${post.thumbnail_url ? `
          <div class="mt-6 rounded-2xl border border-theme-border overflow-hidden">
            <img src="${post.thumbnail_url}" alt="${post.title}" class="w-full" />
          </div>
        ` : ''}

        <div class="mt-6 prose max-w-none text-theme-secondary">
          ${post.content || post.description || ''}
        </div>

        <div class="mt-6 flex gap-3">
          ${buildVoteStats(post)}
        </div>

        <div class="mt-8 rounded-2xl border border-theme-border bg-theme-card/70 p-6">
          <textarea
            id="comment-input"
            rows="3"
            placeholder="Write a comment..."
            class="w-full rounded-xl bg-transparent px-4 py-3 text-sm focus:outline-none"
          ></textarea>
          <button
            data-action="submit-comment"
            data-post-id="${post.id}"
            class="mt-3 rounded-full bg-theme-accent px-4 py-2 text-sm font-semibold text-white"
          >
            Post Comment
          </button>
        </div>

        <div class="mt-6 space-y-3">
          ${buildCommentMarkup(comments)}
        </div>
      </article>

      <aside class="space-y-4">
        ${related.length > 0 ? `
          <div class="rounded-2xl border border-theme-border bg-theme-panel/90 p-6">
            <p class="text-sm font-semibold mb-4">Related Posts</p>
            <div class="space-y-3">
              ${buildRelatedMarkup(related)}
            </div>
          </div>
        ` : ''}
      </aside>
    </section>
  `;
};

export const renderProfilePage = ({ creator, posts }) => `
  <section class="space-y-8">
    <div class="rounded-3xl border border-theme-border bg-theme-panel/90 p-6">
      <div class="flex items-center gap-4">
        ${creator.avatar_url ? `
          <img src="${creator.avatar_url}" alt="${creator.name}" class="h-24 w-24 rounded-full" />
        ` : `
          <div class="flex h-24 w-24 items-center justify-center rounded-full bg-theme-accent text-2xl font-bold">
            ${getInitials(creator.name)}
          </div>
        `}
        <div>
          <h1 class="text-2xl font-bold">${creator.name}</h1>
          ${creator.bio ? `<p class="mt-2 text-sm text-theme-secondary">${creator.bio}</p>` : ''}
          <div class="mt-3 flex gap-4 text-sm">
            <div>
              <p class="font-semibold">${posts.length}</p>
              <p class="text-theme-muted">Posts</p>
            </div>
            <div>
              <p class="font-semibold">${formatNumber(creator.total_followers || 0)}</p>
              <p class="text-theme-muted">Followers</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      ${renderFeed(posts)}
    </div>
  </section>
`;
