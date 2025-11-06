import { renderDetail } from "./render.js";
import { initializeInteractions } from "./interactions.js";

const params = new URLSearchParams(window.location.search);
const postId = params.get("id") ?? "";

const container = document.getElementById("detail-root");

const renderFallback = () => {
  if (!container) return;
  container.innerHTML = `
    <section class="mx-auto max-w-2xl rounded-3xl border border-slate-800 bg-hub-panel/80 p-10 text-center text-slate-300">
      <h1 class="text-2xl font-semibold text-white">Không tìm thấy bài viết</h1>
      <p class="mt-3 text-sm text-slate-400">
        Liên kết bạn truy cập không tồn tại hoặc đã bị gỡ. Vui lòng quay lại trang chủ để tiếp tục khám phá.
      </p>
      <a
        href="index.html"
        class="mt-6 inline-flex items-center gap-2 rounded-full bg-theme-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-theme-accent-hover"
      >
        <i data-lucide="arrow-left" class="h-4 w-4"></i>
        Quay lại trang chủ
      </a>
    </section>
  `;

  // Refresh icons
  if (window.lucide?.createIcons) {
    window.lucide.createIcons();
  }
};

const renderLoading = () => {
  if (!container) return;
  container.innerHTML = `
    <section class="mx-auto max-w-2xl rounded-3xl border border-slate-800 bg-hub-panel/80 p-10 text-center text-slate-300">
      <div class="animate-spin inline-block h-8 w-8 border-4 border-theme-accent border-t-transparent rounded-full"></div>
      <p class="mt-4 text-sm text-slate-400">Đang tải bài viết...</p>
    </section>
  `;
};

async function loadPost() {
  if (!postId || !container) {
    renderFallback();
    return;
  }

  // Show loading state
  renderLoading();

  try {
    // Fetch post and related data from API
    const [post, allPosts, comments] = await Promise.all([
      window.api.getPostById(postId),
      window.api.getPosts({ limit: 10 }),
      window.api.getComments(postId)
    ]);

    if (!post) {
      renderFallback();
      return;
    }

    // Transform post data: convert API fields to expected format
    const transformPost = (p) => {
      // Strip HTML tags from excerpt and truncate
      const plainTextExcerpt = (p.excerpt || '')
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim()
        .substring(0, 150); // Limit to 150 characters

      return {
        ...p,
        // Map API fields to render.js expected fields
        comments: p.comments_count || 0,
        saves: 0, // Not tracked yet
        shares: 0, // Not tracked yet
        time: p.read_time || '5 min read',
        summary: plainTextExcerpt ? plainTextExcerpt + '...' : '',
        image: p.cover_image || 'https://via.placeholder.com/400x300?text=No+Image',
        // Transform creator fields
        creator: p.creator_name ? {
          id: p.creator_id,
          name: p.creator_name,
          initials: p.creator_name?.substring(0, 2).toUpperCase() || '??',
          badge: 'bg-red-500/20 border border-red-500/40 text-red-300'
        } : {
          // Fallback for RSS posts: use category as creator
          id: `source-${p.source_id || 'unknown'}`,
          name: p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : 'RSS Feed',
          initials: p.category?.substring(0, 2).toUpperCase() || 'RS',
          badge: 'bg-slate-700/50 border border-slate-600 text-slate-300'
        }
      };
    };

    const transformedPost = transformPost(post);
    const transformedAllPosts = (allPosts || []).map(transformPost);

    // Render post detail (handle null/undefined comments)
    container.innerHTML = renderDetail(transformedPost, transformedAllPosts, comments || []);

    // Refresh icons
    if (window.lucide?.createIcons) {
      window.lucide.createIcons();
    }

    // Initialize interactions
    initializeInteractions(container);
  } catch (error) {
    console.error('Error loading post:', error);
    renderFallback();
  }
}

// Load post when page loads
loadPost();
