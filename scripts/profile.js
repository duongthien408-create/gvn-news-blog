import { getCreatorById, getCreatorPosts, getAllPosts, getCreatorsByIds } from "./data.js";
import { renderProfilePage } from "./render.js";
import { initializeInteractions } from "./interactions.js";

const params = new URLSearchParams(window.location.search);
const creatorId = params.get("creator") ?? "";

const container = document.getElementById("profile-root");

const renderFallback = () => {
  if (!container) return;
  container.innerHTML = `
    <section class="mx-auto max-w-2xl rounded-3xl border border-slate-800 bg-hub-panel/80 p-10 text-center text-slate-300">
      <h1 class="text-2xl font-semibold text-white">Không tìm thấy creator</h1>
      <p class="mt-3 text-sm text-slate-400">
        Liên kết không tồn tại hoặc creator đã ngừng hoạt động. Hãy quay lại feed để chọn nguồn khác.
      </p>
      <a
        href="index.html"
        class="mt-6 inline-flex items-center gap-2 rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-400"
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

if (creatorId && container) {
  const creator = getCreatorById(creatorId);
  if (!creator) {
    renderFallback();
  } else {
    const creatorPosts = getCreatorPosts(creatorId);
    const popularPosts = [...creatorPosts].sort((a, b) => b.upvotes - a.upvotes).slice(0, 3);
    const similarCreators = getCreatorsByIds(creator.similar);

    container.innerHTML = renderProfilePage({
      creator,
      posts: creatorPosts,
      popularPosts,
      similarCreators,
    });

    // Refresh icons
    if (window.lucide?.createIcons) {
      window.lucide.createIcons();
    }

    // Initialize interactions
    initializeInteractions(container);
  }
} else {
  renderFallback();
}
