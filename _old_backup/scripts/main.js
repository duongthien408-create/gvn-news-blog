import {
  generatePosts,
  sampleComments,
  getCreatorById,
  getCreatorsByIds,
} from "./data.js";
import { renderFeed, renderDetail, renderProfilePage } from "./render.js";

const posts = generatePosts(40);
const postMap = new Map(posts.map((post) => [String(post.id), post]));

const bodyEl = document.body;
const homeViewEl = document.getElementById("home-view");
const profileViewEl = document.getElementById("profile-view");
const gridEl = document.getElementById("feed-grid");
const detailOverlayEl = document.getElementById("detail-overlay");
const detailContentEl = document.getElementById("detail-content");

const refreshIcons = () => {
  if (window.lucide?.createIcons) {
    window.lucide.createIcons();
  }
};

const mountFeed = () => {
  if (!gridEl) return;
  gridEl.innerHTML = renderFeed(posts);
  refreshIcons();
};

const closeDetail = () => {
  if (!detailOverlayEl || !detailContentEl) return;
  detailOverlayEl.classList.add("hidden");
  detailOverlayEl.classList.remove("flex");
  bodyEl.classList.remove("overflow-hidden");
  detailContentEl.innerHTML = "";
};

const openDetail = (postId) => {
  const post = postMap.get(String(postId));
  if (!post || !detailOverlayEl || !detailContentEl) return;
  detailContentEl.innerHTML = renderDetail(post, posts, sampleComments());
  detailOverlayEl.classList.remove("hidden");
  detailOverlayEl.classList.add("flex");
  detailOverlayEl.scrollTop = 0;
  bodyEl.classList.add("overflow-hidden");
  refreshIcons();
};

const showHome = () => {
  closeDetail();
  profileViewEl?.classList.add("hidden");
  if (profileViewEl) profileViewEl.innerHTML = "";
  homeViewEl?.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const openProfile = (creatorId) => {
  const creator = getCreatorById(creatorId);
  if (!creator || !profileViewEl) return;
  closeDetail();
  const creatorPosts = posts.filter((post) => post.creatorId === creator.id);
  const popularPosts = [...creatorPosts].sort((a, b) => b.upvotes - a.upvotes).slice(0, 3);
  const similarCreators = getCreatorsByIds(creator.similar);

  profileViewEl.innerHTML = renderProfilePage({
    creator,
    posts: creatorPosts,
    popularPosts,
    similarCreators,
  });

  homeViewEl?.classList.add("hidden");
  profileViewEl.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
  refreshIcons();
};

const handleFollowToggle = (button) => {
  button.classList.toggle("following");
  const isFollowing = button.classList.contains("following");
  button.innerHTML = isFollowing
    ? '<i data-lucide="check" class="h-4 w-4"></i>Đang theo dõi'
    : '<i data-lucide="plus" class="h-4 w-4"></i>Theo dõi';

  button.classList.toggle("border-red-500/50", !isFollowing);
  button.classList.toggle("bg-red-500/10", !isFollowing);
  button.classList.toggle("text-red-200", !isFollowing);
  button.classList.toggle("border-slate-700", isFollowing);
  button.classList.toggle("bg-slate-900/80", isFollowing);
  button.classList.toggle("text-slate-200", isFollowing);

  refreshIcons();
};

detailOverlayEl?.addEventListener("click", (event) => {
  if (event.target === detailOverlayEl || event.target.closest("[data-close-detail]")) {
    closeDetail();
    return;
  }

  const followBtn = event.target.closest("[data-follow-toggle]");
  if (followBtn) {
    handleFollowToggle(followBtn);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && detailOverlayEl && !detailOverlayEl.classList.contains("hidden")) {
    closeDetail();
  }
});

document.addEventListener("click", (event) => {
  const followBtn = event.target.closest("[data-follow-toggle]");
  if (followBtn && detailOverlayEl?.classList.contains("hidden")) {
    handleFollowToggle(followBtn);
    return;
  }

  const profileTrigger = event.target.closest("[data-profile-trigger]");
  if (profileTrigger) {
    openProfile(profileTrigger.dataset.profileTrigger);
    return;
  }

  const homeTrigger = event.target.closest("[data-view='home']");
  if (homeTrigger) {
    showHome();
    return;
  }

  const postCard = event.target.closest("[data-post-id]");
  if (postCard) {
    openDetail(postCard.dataset.postId);
  }
});

mountFeed();
