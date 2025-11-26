/**
 * interactions.js v2.0
 * Handle all UI interactions for GearVN Blog
 * Updated for new voting system (up/down) and new API structure
 */

// Toast notification helper
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 z-50 rounded-2xl border px-6 py-4 shadow-xl backdrop-blur transition-all duration-300 ${
    type === 'success' ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200' :
    type === 'error' ? 'border-red-500/40 bg-red-500/10 text-red-200' :
    'border-theme-accent/40 bg-theme-accent/10 text-theme-primary'
  }`;

  toast.innerHTML = `
    <div class="flex items-center gap-3">
      <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info'}" class="h-5 w-5"></i>
      <span class="text-sm font-medium">${message}</span>
    </div>
  `;

  document.body.appendChild(toast);

  if (window.lucide?.createIcons) {
    window.lucide.createIcons();
  }

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Interaction State - cache user's votes, bookmarks, following
const InteractionState = {
  _cache: {
    votes: {}, // { postId: 1 | -1 | 0 }
    bookmarked: {},
    following: {}
  },

  async initialize() {
    if (!window.api?.isLoggedIn()) {
      return;
    }

    try {
      // Load user's bookmarks and following
      const [bookmarks, following] = await Promise.all([
        window.api.getBookmarks().catch(() => []),
        window.api.getFollowingCreators().catch(() => [])
      ]);

      // Cache bookmarked posts (now returns full post objects)
      bookmarks.forEach(post => {
        this._cache.bookmarked[post.id] = true;
      });

      // Cache followed creators
      following.forEach(creator => {
        this._cache.following[creator.id] = true;
      });

      console.log('✅ Interaction state initialized');
    } catch (error) {
      console.error('Error initializing interaction state:', error);
    }
  },

  // Votes (new system with up/down)
  async getVote(postId) {
    if (!window.api?.isLoggedIn()) return 0;

    // Check cache first
    if (this._cache.votes[postId] !== undefined) {
      return this._cache.votes[postId];
    }

    // Fetch from API
    try {
      const result = await window.api.getUserVote(postId);
      const voteType = result?.vote_type || 0;
      this._cache.votes[postId] = voteType;
      return voteType;
    } catch {
      return 0;
    }
  },

  async setVote(postId, voteType) {
    if (!window.api?.isLoggedIn()) {
      showToast('Please login to vote', 'error');
      return false;
    }

    try {
      await window.api.votePost(postId, voteType);
      this._cache.votes[postId] = voteType;
      return true;
    } catch (error) {
      console.error('Error updating vote:', error);
      showToast('Failed to update vote', 'error');
      return false;
    }
  },

  // Bookmarks
  getBookmarked(postId) {
    return this._cache.bookmarked[postId] || false;
  },

  async setBookmarked(postId, value) {
    if (!window.api?.isLoggedIn()) {
      showToast('Please login to bookmark', 'error');
      return false;
    }

    try {
      await window.api.bookmarkPost(postId);
      this._cache.bookmarked[postId] = value;
      return true;
    } catch (error) {
      console.error('Error updating bookmark:', error);
      showToast('Failed to update bookmark', 'error');
      return false;
    }
  },

  // Following
  getFollowing(creatorId) {
    return this._cache.following[creatorId] || false;
  },

  async setFollowing(creatorId, value) {
    if (!window.api?.isLoggedIn()) {
      showToast('Please login to follow', 'error');
      return false;
    }

    try {
      await window.api.followCreator(creatorId);
      this._cache.following[creatorId] = value;
      return true;
    } catch (error) {
      console.error('Error updating following:', error);
      showToast('Failed to update following', 'error');
      return false;
    }
  }
};

// Initialize state when page loads
if (window.api?.isLoggedIn()) {
  InteractionState.initialize();
}

/**
 * Handle upvote button click
 */
export async function handleUpvote(postId, element) {
  const currentVote = await InteractionState.getVote(postId);
  const newVote = currentVote === 1 ? 0 : 1; // Toggle: 1 → 0, 0/−1 → 1

  const success = await InteractionState.setVote(postId, newVote);
  if (success) {
    // Update UI
    updateVoteUI(postId, newVote);
    showToast(newVote === 1 ? 'Upvoted!' : 'Removed upvote', 'success');
  }
}

/**
 * Handle downvote button click
 */
export async function handleDownvote(postId, element) {
  const currentVote = await InteractionState.getVote(postId);
  const newVote = currentVote === -1 ? 0 : -1; // Toggle: −1 → 0, 0/1 → −1

  const success = await InteractionState.setVote(postId, newVote);
  if (success) {
    // Update UI
    updateVoteUI(postId, newVote);
    showToast(newVote === -1 ? 'Downvoted' : 'Removed downvote', 'info');
  }
}

/**
 * Update vote button UI states
 */
function updateVoteUI(postId, voteType) {
  const upvoteButtons = document.querySelectorAll(`[data-action="upvote"][data-post-id="${postId}"]`);
  const downvoteButtons = document.querySelectorAll(`[data-action="downvote"][data-post-id="${postId}"]`);

  upvoteButtons.forEach(btn => {
    if (voteType === 1) {
      btn.classList.add('text-green-400');
      btn.classList.remove('text-theme-secondary');
    } else {
      btn.classList.remove('text-green-400');
      btn.classList.add('text-theme-secondary');
    }
  });

  downvoteButtons.forEach(btn => {
    if (voteType === -1) {
      btn.classList.add('text-red-400');
      btn.classList.remove('text-theme-secondary');
    } else {
      btn.classList.remove('text-red-400');
      btn.classList.add('text-theme-secondary');
    }
  });
}

/**
 * Handle bookmark button click
 */
export async function handleBookmark(postId, element) {
  const isBookmarked = InteractionState.getBookmarked(postId);

  const success = await InteractionState.setBookmarked(postId, !isBookmarked);
  if (success) {
    // Update UI
    if (!isBookmarked) {
      element.classList.add('text-amber-400');
      element.classList.remove('text-theme-secondary');
      showToast('Bookmarked!', 'success');
    } else {
      element.classList.remove('text-amber-400');
      element.classList.add('text-theme-secondary');
      showToast('Removed bookmark', 'info');
    }

    // Dispatch event for bookmark page
    window.dispatchEvent(new CustomEvent('bookmarkChanged', {
      detail: { postId, isBookmarked: !isBookmarked }
    }));
  }
}

/**
 * Handle share button click
 */
export function handleShare(postId, postTitle, postSlug) {
  const url = postSlug
    ? `${window.location.origin}/detail.html?slug=${postSlug}`
    : `${window.location.origin}/detail.html?id=${postId}`;

  const shareData = {
    title: postTitle || 'GearVN Blog',
    text: 'Check out this post on GearVN Blog',
    url: url
  };

  if (navigator.share) {
    navigator.share(shareData)
      .then(() => showToast('Shared successfully!', 'success'))
      .catch(() => {});
  } else {
    // Fallback: copy link
    navigator.clipboard.writeText(url)
      .then(() => showToast('Link copied!', 'success'))
      .catch(() => showToast('Failed to copy link', 'error'));
  }
}

/**
 * Handle follow creator button click
 */
export async function handleFollow(creatorId, creatorName, element) {
  const isFollowing = InteractionState.getFollowing(creatorId);

  const success = await InteractionState.setFollowing(creatorId, !isFollowing);
  if (success) {
    // Update UI
    if (!isFollowing) {
      element.innerHTML = `
        <i data-lucide="user-check" class="h-4 w-4"></i>
        Following
      `;
      element.classList.add('bg-theme-accent/20', 'border-theme-accent/60');
      showToast(`Following ${creatorName}!`, 'success');
    } else {
      element.innerHTML = `
        <i data-lucide="user-plus" class="h-4 w-4"></i>
        Follow
      `;
      element.classList.remove('bg-theme-accent/20', 'border-theme-accent/60');
      showToast(`Unfollowed ${creatorName}`, 'info');
    }

    if (window.lucide?.createIcons) {
      window.lucide.createIcons();
    }

    // Dispatch event for following page
    window.dispatchEvent(new CustomEvent('followingChanged', {
      detail: { creatorId, isFollowing: !isFollowing }
    }));
  }
}

/**
 * Handle comment vote (up/down)
 */
export async function handleCommentVote(commentId, voteType) {
  if (!window.api?.isLoggedIn()) {
    showToast('Please login to vote on comments', 'error');
    return;
  }

  try {
    await window.api.voteComment(commentId, voteType);
    showToast(voteType === 1 ? 'Upvoted comment' : 'Downvoted comment', 'success');

    // Reload page to show updated vote counts
    // TODO: Update UI without reload
    setTimeout(() => location.reload(), 500);
  } catch (error) {
    showToast('Failed to vote on comment', 'error');
  }
}

/**
 * Handle reply to comment
 */
export async function handleReplyComment(commentId) {
  // TODO: Show reply form
  showToast('Reply feature coming soon!', 'info');
}

/**
 * Initialize all interactions in a container
 */
export function initializeInteractions(container = document) {
  // Upvote buttons
  container.querySelectorAll('[data-action="upvote"]').forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const postId = button.dataset.postId;
      await handleUpvote(postId, button);
    });
  });

  // Downvote buttons
  container.querySelectorAll('[data-action="downvote"]').forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const postId = button.dataset.postId;
      await handleDownvote(postId, button);
    });
  });

  // Bookmark buttons
  container.querySelectorAll('[data-action="bookmark"]').forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const postId = button.dataset.postId;
      await handleBookmark(postId, button);
    });
  });

  // Share buttons
  container.querySelectorAll('[data-action="share"]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const postId = button.dataset.postId;
      const postTitle = button.dataset.postTitle;
      const postSlug = button.dataset.postSlug;
      handleShare(postId, postTitle, postSlug);
    });
  });

  // Follow buttons
  container.querySelectorAll('[data-action="follow"]').forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const creatorId = button.dataset.creatorId;
      const creatorName = button.dataset.creatorName;
      await handleFollow(creatorId, creatorName, button);
    });
  });

  // Comment vote buttons
  container.querySelectorAll('[data-action="upvote-comment"]').forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const commentId = button.dataset.commentId;
      await handleCommentVote(commentId, 1);
    });
  });

  container.querySelectorAll('[data-action="downvote-comment"]').forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const commentId = button.dataset.commentId;
      await handleCommentVote(commentId, -1);
    });
  });

  // Comment reply buttons
  container.querySelectorAll('[data-action="reply-comment"]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const commentId = button.dataset.commentId;
      handleReplyComment(commentId);
    });
  });

  console.log('✅ Interactions initialized');
}

// Auto-initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initializeInteractions());
} else {
  initializeInteractions();
}

// Export state for debugging
window.InteractionState = InteractionState;
