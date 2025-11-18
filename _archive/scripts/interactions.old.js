/**
 * interactions.js
 * Xử lý tất cả các sự kiện tương tác UI cho GearVN Creator Hub
 */

// Hàm hiển thị thông báo toast
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

  // Refresh icons cho toast
  if (window.lucide?.createIcons) {
    window.lucide.createIcons();
  }

  // Auto remove sau 3 giây
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// State quản lý tương tác (sử dụng API + localStorage cache)
const InteractionState = {
  // Cache for performance
  _cache: {
    upvoted: {},
    bookmarked: {},
    following: {}
  },

  // Initialize cache from API
  async initialize() {
    if (!window.api?.isLoggedIn()) {
      return;
    }

    try {
      // Load user's bookmarks, following, and upvoted posts
      const [bookmarks, following] = await Promise.all([
        window.api.getBookmarks().catch(() => []),
        window.api.getFollowing().catch(() => [])
      ]);

      // Cache bookmarked posts
      bookmarks.forEach(post => {
        this._cache.bookmarked[post.id] = true;
      });

      // Cache followed creators
      following.forEach(creator => {
        this._cache.following[creator.id] = true;
      });
    } catch (error) {
      console.error('Error initializing interaction state:', error);
    }
  },

  // Upvotes
  getUpvoted(postId) {
    return this._cache.upvoted[postId] || false;
  },

  async setUpvoted(postId, value) {
    if (!window.api?.isLoggedIn()) {
      showToast('Vui lòng đăng nhập để ủng hộ bài viết', 'error');
      return false;
    }

    try {
      if (value) {
        await window.api.upvotePost(postId);
      } else {
        await window.api.removeUpvote(postId);
      }
      this._cache.upvoted[postId] = value;
      return true;
    } catch (error) {
      console.error('Error updating upvote:', error);
      showToast('Không thể cập nhật ủng hộ', 'error');
      return false;
    }
  },

  // Bookmarks
  getBookmarked(postId) {
    return this._cache.bookmarked[postId] || false;
  },

  async setBookmarked(postId, value) {
    if (!window.api?.isLoggedIn()) {
      showToast('Vui lòng đăng nhập để lưu bài viết', 'error');
      return false;
    }

    try {
      if (value) {
        await window.api.addBookmark(postId);
      } else {
        await window.api.removeBookmark(postId);
      }
      this._cache.bookmarked[postId] = value;
      return true;
    } catch (error) {
      console.error('Error updating bookmark:', error);
      showToast('Không thể cập nhật bookmark', 'error');
      return false;
    }
  },

  // Following
  getFollowing(creatorId) {
    return this._cache.following[creatorId] || false;
  },

  async setFollowing(creatorId, value) {
    if (!window.api?.isLoggedIn()) {
      showToast('Vui lòng đăng nhập để theo dõi creator', 'error');
      return false;
    }

    try {
      if (value) {
        await window.api.followCreator(creatorId);
      } else {
        await window.api.unfollowCreator(creatorId);
      }
      this._cache.following[creatorId] = value;
      return true;
    } catch (error) {
      console.error('Error updating following:', error);
      showToast('Không thể cập nhật theo dõi', 'error');
      return false;
    }
  }
};

// Initialize state when page loads
if (window.api?.isLoggedIn()) {
  InteractionState.initialize();
}

// Xử lý upvote
export async function handleUpvote(postId, element) {
  const isUpvoted = InteractionState.getUpvoted(postId);
  const countElement = element.querySelector('.upvote-count') || element;
  let currentCount = parseInt(countElement.textContent.replace(/[^0-9]/g, '')) || 0;

  if (isUpvoted) {
    // Remove upvote
    const success = await InteractionState.setUpvoted(postId, false);
    if (success) {
      currentCount--;
      element.classList.remove('bg-red-500/20', 'border-red-500/60', 'text-red-200');
      element.classList.add('border-slate-800', 'bg-slate-900/80', 'text-slate-300');
      countElement.textContent = currentCount;
      showToast('Đã bỏ ủng hộ', 'info');
    }
  } else {
    // Add upvote
    const success = await InteractionState.setUpvoted(postId, true);
    if (success) {
      currentCount++;
      element.classList.remove('border-slate-800', 'bg-slate-900/80', 'text-slate-300');
      element.classList.add('bg-red-500/20', 'border-red-500/60', 'text-red-200');
      countElement.textContent = currentCount;
      showToast('Đã ủng hộ bài viết!', 'success');
    }
  }
}

// Xử lý bookmark
export async function handleBookmark(postId, element) {
  const isBookmarked = InteractionState.getBookmarked(postId);
  const countElement = element.querySelector('.bookmark-count') || element;
  let currentCount = parseInt(countElement.textContent.replace(/[^0-9]/g, '')) || 0;

  if (isBookmarked) {
    // Remove bookmark
    const success = await InteractionState.setBookmarked(postId, false);
    if (success) {
      currentCount--;
      element.classList.remove('bg-amber-500/20', 'border-amber-500/60', 'text-amber-200');
      element.classList.add('border-slate-800', 'bg-slate-900/80', 'text-slate-500');
      countElement.textContent = currentCount;
      showToast('Đã bỏ lưu bài viết', 'info');

      // Dispatch custom event for bookmarks page to listen
      window.dispatchEvent(new CustomEvent('bookmarkChanged', {
        detail: { postId, isBookmarked: false }
      }));
    }
  } else {
    // Add bookmark
    const success = await InteractionState.setBookmarked(postId, true);
    if (success) {
      currentCount++;
      element.classList.remove('border-slate-800', 'bg-slate-900/80', 'text-slate-500');
      element.classList.add('bg-amber-500/20', 'border-amber-500/60', 'text-amber-200');
      countElement.textContent = currentCount;
      showToast('Đã lưu bài viết!', 'success');

      // Dispatch custom event for bookmarks page to listen
      window.dispatchEvent(new CustomEvent('bookmarkChanged', {
        detail: { postId, isBookmarked: true }
      }));
    }
  }
}

// Xử lý share
export function handleShare(postId, postTitle) {
  const shareData = {
    title: postTitle || 'GearVN Creator Hub',
    text: 'Xem bài viết hay này trên GearVN Creator Hub',
    url: `${window.location.origin}/detail.html?id=${postId}`
  };

  if (navigator.share) {
    navigator.share(shareData)
      .then(() => showToast('Đã chia sẻ thành công!', 'success'))
      .catch(() => {});
  } else {
    // Fallback: copy link
    const url = shareData.url;
    navigator.clipboard.writeText(url)
      .then(() => showToast('Đã sao chép link!', 'success'))
      .catch(() => showToast('Không thể sao chép link', 'error'));
  }
}

// Xử lý follow creator
export async function handleFollow(creatorId, creatorName, element) {
  const isFollowing = InteractionState.getFollowing(creatorId);

  if (isFollowing) {
    // Unfollow
    const success = await InteractionState.setFollowing(creatorId, false);
    if (success) {
      element.innerHTML = `
        <i data-lucide="user-plus" class="h-4 w-4"></i>
        Theo dõi ${creatorName}
      `;
      element.classList.remove('bg-slate-700/50', 'border-slate-600', 'text-slate-300');
      element.classList.add('bg-red-500/10', 'border-red-500/50', 'text-red-200');
      showToast(`Đã bỏ theo dõi ${creatorName}`, 'info');

      // Refresh icons
      if (window.lucide?.createIcons) {
        window.lucide.createIcons();
      }

      // Dispatch custom event for following page to listen
      window.dispatchEvent(new CustomEvent('followingChanged', {
        detail: { creatorId, isFollowing: false }
      }));
    }
  } else {
    // Follow
    const success = await InteractionState.setFollowing(creatorId, true);
    if (success) {
      element.innerHTML = `
        <i data-lucide="user-check" class="h-4 w-4"></i>
        Đang theo dõi
      `;
      element.classList.remove('bg-red-500/10', 'border-red-500/50', 'text-red-200');
      element.classList.add('bg-slate-700/50', 'border-slate-600', 'text-slate-300');
      showToast(`Đã theo dõi ${creatorName}!`, 'success');

      // Refresh icons
      if (window.lucide?.createIcons) {
        window.lucide.createIcons();
      }

      // Dispatch custom event for following page to listen
      window.dispatchEvent(new CustomEvent('followingChanged', {
        detail: { creatorId, isFollowing: true }
      }));
    }
  }
}

// Xử lý comment form
export async function handleCommentSubmit(postId, textarea, event) {
  if (event) event.preventDefault();

  const content = textarea.value.trim();

  if (!content) {
    showToast('Vui lòng nhập nội dung bình luận', 'error');
    return;
  }

  if (!window.api?.isLoggedIn()) {
    showToast('Vui lòng đăng nhập để bình luận', 'error');
    return;
  }

  try {
    await window.api.addComment(postId, content);
    showToast('Đã đăng bình luận!', 'success');
    textarea.value = '';

    // Có thể thêm logic reload comments ở đây
  } catch (error) {
    console.error('Error submitting comment:', error);
    showToast('Không thể đăng bình luận', 'error');
  }
}

// Xử lý khảo sát (Survey buttons)
export function handleSurvey(rating) {
  const messages = {
    'helpful': 'Cảm ơn! Rất vui vì bài viết hữu ích với bạn.',
    'okay': 'Cảm ơn phản hồi! Chúng tôi sẽ cải thiện nội dung.',
    'improve': 'Cảm ơn! Chúng tôi sẽ cải thiện chất lượng bài viết.'
  };

  showToast(messages[rating] || 'Cảm ơn phản hồi của bạn!', 'success');
}

// Xử lý notification bell
export function handleNotification() {
  showToast('Bạn không có thông báo mới', 'info');
}

// Xử lý Level Up button
export function handleLevelUp() {
  showToast('Tính năng Level Up đang được phát triển', 'info');
}

// Xử lý Flame button (Streak)
export function handleStreak() {
  showToast('Bạn đã duy trì chuỗi 7 ngày liên tiếp!', 'success');
}

// Xử lý Wallet button
export function handleWallet() {
  showToast('Ví của bạn: 1,250 GVN Points', 'info');
}

// Xử lý flag comment
export function handleFlagComment(commentId) {
  showToast('Đã báo cáo bình luận vi phạm', 'success');
}

// Xử lý nút "Đăng bài mới"
export function handleNewPost() {
  showToast('Tính năng đăng bài đang trong giai đoạn Beta', 'info');
}

// Xử lý reply comment
export function handleReplyComment(commentId) {
  showToast('Tính năng trả lời đang được phát triển', 'info');
}

// Khởi tạo tất cả event listeners cho một container
export function initializeInteractions(container = document) {
  // Upvote buttons
  container.querySelectorAll('[data-action="upvote"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const postId = btn.dataset.postId;
      if (postId) handleUpvote(postId, btn);
    });
  });

  // Bookmark buttons
  container.querySelectorAll('[data-action="bookmark"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const postId = btn.dataset.postId;
      if (postId) handleBookmark(postId, btn);
    });
  });

  // Share buttons
  container.querySelectorAll('[data-action="share"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const postId = btn.dataset.postId;
      const postTitle = btn.dataset.postTitle;
      if (postId) handleShare(postId, postTitle);
    });
  });

  // Follow buttons
  container.querySelectorAll('[data-action="follow"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const creatorId = btn.dataset.creatorId;
      const creatorName = btn.dataset.creatorName;
      if (creatorId) handleFollow(creatorId, creatorName, btn);
    });
  });

  // Comment submit buttons
  container.querySelectorAll('[data-action="submit-comment"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const postId = btn.dataset.postId;
      const textarea = btn.closest('.comment-form')?.querySelector('textarea');
      if (textarea && postId) handleCommentSubmit(postId, textarea, e);
    });
  });

  // Survey buttons
  container.querySelectorAll('[data-action="survey"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const rating = btn.dataset.rating;
      if (rating) handleSurvey(rating);
    });
  });

  // Flag comment buttons
  container.querySelectorAll('[data-action="flag"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const commentId = btn.dataset.commentId;
      if (commentId) handleFlagComment(commentId);
    });
  });

  // Reply comment buttons
  container.querySelectorAll('[data-action="reply"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const commentId = btn.dataset.commentId;
      if (commentId) handleReplyComment(commentId);
    });
  });

  // New post button
  container.querySelectorAll('[data-action="new-post"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      handleNewPost();
    });
  });

  // Notification button
  container.querySelectorAll('[data-action="notification"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      handleNotification();
    });
  });

  // Level up button
  container.querySelectorAll('[data-action="level-up"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      handleLevelUp();
    });
  });

  // Streak button
  container.querySelectorAll('[data-action="streak"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      handleStreak();
    });
  });

  // Wallet button
  container.querySelectorAll('[data-action="wallet"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      handleWallet();
    });
  });
}

// Auto-init khi DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initializeInteractions());
} else {
  initializeInteractions();
}

// Export InteractionState as named export
export { InteractionState };

// Export để sử dụng trong các module khác
export default {
  initializeInteractions,
  handleUpvote,
  handleBookmark,
  handleShare,
  handleFollow,
  handleCommentSubmit,
  handleSurvey,
  handleNotification,
  handleLevelUp,
  handleStreak,
  handleWallet,
  handleFlagComment,
  handleNewPost,
  handleReplyComment,
  showToast,
  InteractionState
};
