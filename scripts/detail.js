// Post detail page v2.0 - Updated for slug-based routing and new API structure

import { renderDetail } from "./render.js";
import { initializeInteractions } from "./interactions.js";

// Get slug from URL (changed from ID to slug!)
const params = new URLSearchParams(window.location.search);
const postSlug = params.get("slug") || params.get("id"); // Support old links temporarily

const container = document.getElementById("detail-root");

const renderFallback = (message = "Post not found") => {
  if (!container) return;
  container.innerHTML = `
    <section class="mx-auto max-w-2xl rounded-3xl border border-theme-border bg-theme-panel/80 p-10 text-center">
      <div class="mb-4">
        <i data-lucide="file-x" class="h-16 w-16 text-theme-muted mx-auto"></i>
      </div>
      <h1 class="text-2xl font-semibold text-theme-primary">${message}</h1>
      <p class="mt-3 text-sm text-theme-secondary">
        The post you're looking for doesn't exist or has been removed.
      </p>
      <a
        href="index.html"
        class="mt-6 inline-flex items-center gap-2 rounded-full bg-theme-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-theme-accent-hover"
      >
        <i data-lucide="arrow-left" class="h-4 w-4"></i>
        Back to home
      </a>
    </section>
  `;

  if (window.lucide?.createIcons) {
    window.lucide.createIcons();
  }
};

const renderLoading = () => {
  if (!container) return;
  container.innerHTML = `
    <section class="mx-auto max-w-2xl rounded-3xl border border-theme-border bg-theme-panel/80 p-10 text-center">
      <div class="animate-spin inline-block h-8 w-8 border-4 border-theme-accent border-t-transparent rounded-full"></div>
      <p class="mt-4 text-sm text-theme-muted">Loading post...</p>
    </section>
  `;
};

async function loadPost() {
  if (!postSlug || !container) {
    renderFallback();
    return;
  }

  // Show loading state
  renderLoading();

  try {
    // Fetch post by SLUG (not ID!)
    // Backend returns: { id, slug, title, description, content, thumbnail_url, creators[], tags[], products[], comments[], ... }
    const post = await window.api.getPostBySlug(postSlug);

    if (!post) {
      renderFallback("Post not found");
      return;
    }

    // Fetch related posts (by same creator or tag)
    let relatedPosts = [];
    try {
      const firstCreator = post.creators && post.creators.length > 0 ? post.creators[0] : null;
      const firstTag = post.tags && post.tags.length > 0 ? post.tags[0] : null;

      if (firstCreator) {
        // Get posts by same creator
        relatedPosts = await window.api.getPosts({
          creator: firstCreator.slug,
          limit: 5
        });
        // Remove current post
        relatedPosts = relatedPosts.filter(p => p.id !== post.id);
      } else if (firstTag) {
        // Get posts with same tag
        relatedPosts = await window.api.getPosts({
          tag: firstTag.slug,
          limit: 5
        });
        relatedPosts = relatedPosts.filter(p => p.id !== post.id);
      }

      // If still not enough, just get recent posts
      if (relatedPosts.length < 3) {
        const recentPosts = await window.api.getPosts({ limit: 5 });
        const additionalPosts = recentPosts.filter(p => p.id !== post.id);
        relatedPosts = [...relatedPosts, ...additionalPosts].slice(0, 4);
      }
    } catch (err) {
      console.warn('Failed to load related posts:', err);
    }

    // Fetch comments (nested structure)
    // Backend returns nested tree: { id, content, user: {}, replies: [], upvote_count, downvote_count, ... }
    let comments = [];
    try {
      comments = await window.api.getComments(post.id);
    } catch (err) {
      console.warn('Failed to load comments:', err);
    }

    // Render post detail (no transformation needed - backend returns correct structure)
    container.innerHTML = renderDetail(post, relatedPosts, comments);

    // Refresh Lucide icons
    if (window.lucide?.createIcons) {
      window.lucide.createIcons();
    }

    // Initialize interactions (voting, bookmarks, comments, etc.)
    initializeInteractions(container);

    // Setup comment form handler
    setupCommentForm(post.id);

    console.log(`✅ Loaded post: ${post.title}`);
  } catch (error) {
    console.error('❌ Error loading post:', error);
    renderFallback("Failed to load post");
  }
}

/**
 * Setup comment submission form
 */
function setupCommentForm(postId) {
  const textarea = container.querySelector('#comment-input');
  const submitBtn = container.querySelector('[data-action="submit-comment"]');

  if (!textarea || !submitBtn) return;

  submitBtn.addEventListener('click', async () => {
    const content = textarea.value.trim();

    if (!content) {
      alert('Please write a comment first');
      return;
    }

    if (!window.api.isLoggedIn()) {
      alert('Please login to comment');
      window.location.href = 'login.html';
      return;
    }

    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i data-lucide="loader" class="h-4 w-4 animate-spin"></i> Posting...';

      await window.api.addComment(postId, content);

      // Reload comments
      const comments = await window.api.getComments(postId);

      // Re-render comments section
      const commentsSection = container.querySelector('.space-y-3');
      if (commentsSection) {
        const { buildCommentTree } = await import('./render-helpers.js');
        commentsSection.innerHTML = comments.length > 0
          ? comments.map(c => buildCommentTree(c, 0)).join('')
          : '<p class="text-sm text-theme-muted text-center py-8">No comments yet.</p>';

        if (window.lucide?.createIcons) {
          window.lucide.createIcons();
        }
      }

      // Clear textarea
      textarea.value = '';
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Post Comment';

      alert('Comment posted successfully!');
    } catch (error) {
      console.error('Failed to post comment:', error);
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Post Comment';
      alert('Failed to post comment: ' + error.message);
    }
  });
}

// Load post when page loads
loadPost();

// Export for testing
export { loadPost };
