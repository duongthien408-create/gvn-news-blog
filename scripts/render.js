import { formatNumber } from "./data.js";

const buildTagPills = (tags) => {
  if (!tags || tags.length === 0) return '';

  const maxVisible = 3;
  const visibleTags = tags.slice(0, maxVisible);
  const remainingCount = tags.length - maxVisible;

  const tagElements = visibleTags.map(
    (tag) =>
      `<span class="rounded-md bg-theme-card px-2 py-0.5 text-[10px] text-theme-muted">${
        tag.startsWith("#") ? tag : `#${tag}`
      }</span>`
  ).join("");

  const plusButton = remainingCount > 0
    ? `<span class="rounded-md bg-theme-card px-2 py-0.5 text-[10px] text-theme-muted">+${remainingCount}</span>`
    : '';

  return tagElements + plusButton;
};

const buildStatsBlock = (post) => `
  <div class="mt-4 flex items-center justify-between text-sm text-theme-muted">
    <div class="flex items-center gap-2">
      <button
        data-action="upvote"
        data-post-id="${post.id}"
        class="inline-flex items-center gap-1.5 text-theme-secondary transition hover:text-theme-accent cursor-pointer"
        title="Upvote"
      >
        <i data-lucide="arrow-big-up" class="h-5 w-5"></i>
        <span class="upvote-count text-xs">${post.upvotes}</span>
      </button>
      <a href="detail.html?id=${post.id}#comments" class="inline-flex items-center gap-1.5 text-theme-secondary transition hover:text-theme-primary" title="Comments">
        <i data-lucide="message-circle" class="h-5 w-5"></i>
        <span class="text-xs">${post.comments}</span>
      </a>
    </div>
    <div class="flex items-center gap-2">
      <button
        data-action="bookmark"
        data-post-id="${post.id}"
        class="inline-flex items-center justify-center text-theme-secondary transition hover:text-amber-300 cursor-pointer"
        title="Bookmark"
      >
        <i data-lucide="bookmark" class="h-5 w-5"></i>
      </button>
      <button
        data-action="share"
        data-post-id="${post.id}"
        data-post-title="${post.title}"
        class="inline-flex items-center justify-center text-theme-secondary transition hover:text-theme-primary cursor-pointer"
        title="Share"
      >
        <i data-lucide="share-2" class="h-5 w-5"></i>
      </button>
    </div>
  </div>
`;

export const renderFeed = (posts) =>
  posts
    .map(
      (post) => `
      <article class="group flex h-full flex-col rounded-2xl border border-theme-border bg-theme-panel/80 p-4 backdrop-blur transition hover:-translate-y-0.5 hover:border-theme-border/60 hover:shadow-lg cursor-pointer" onclick="window.openPostModal('${post.id}')">
        <div class="block overflow-hidden rounded-xl border border-theme-border mb-3">
          <img src="${post.image}" alt="${post.title}" class="w-full h-48 object-cover transition duration-300 group-hover:scale-105" />
        </div>

        <div class="block transition hover:text-theme-accent-hover">
          <h2 class="text-base font-semibold text-theme-primary line-clamp-2 leading-snug" title="${post.title}">${post.title}</h2>
        </div>

        <div class="mt-2 flex flex-wrap gap-1.5 items-center">
          ${buildTagPills(post.tags)}
        </div>

        <div class="mt-3 flex items-center gap-2 text-sm text-theme-secondary">
          <a href="profile.html?creator=${post.creator?.id ?? ""}" class="flex items-center gap-2 hover:text-theme-primary transition" onclick="event.stopPropagation()">
            <span class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${post.creator?.badge ?? ""} text-[11px] font-semibold">
              ${post.creator?.initials ?? ""}
            </span>
            <span class="font-medium">${post.creator?.name ?? "Creator"}</span>
          </a>
          <span class="text-theme-muted">•</span>
          <span>${post.time}</span>
        </div>

        <div onclick="event.stopPropagation()">
          ${buildStatsBlock(post)}
        </div>
      </article>
    `,
    )
    .join("");

const buildCommentMarkup = (comments) =>
  comments
    .map(
      (comment) => `
      <div class="rounded-3xl border border-slate-800/80 bg-hub-card/70 p-4 transition hover:border-slate-600/60">
        <div class="flex items-start gap-3">
          <img src="${comment.avatar}" alt="${comment.name}" class="h-10 w-10 rounded-full object-cover" />
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-semibold text-slate-200">${comment.name}</p>
                <p class="text-xs text-slate-500">${comment.time}</p>
              </div>
              <button
                data-action="flag"
                data-comment-id="${comment.id || Math.random().toString(36).substr(2, 9)}"
                class="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400 transition hover:border-slate-500 hover:text-slate-200 cursor-pointer"
              >
                <i data-lucide="flag" class="h-3.5 w-3.5"></i>
              </button>
            </div>
            <p class="mt-3 text-sm leading-relaxed text-slate-300">${comment.comment}</p>
            <div class="mt-4 flex items-center gap-4 text-xs text-slate-500">
              <span class="inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1.5">
                <i data-lucide="arrow-big-up" class="h-3.5 w-3.5"></i>
                ${comment.likes}
              </span>
              <button
                data-action="reply"
                data-comment-id="${comment.id || Math.random().toString(36).substr(2, 9)}"
                class="inline-flex items-center gap-1 text-slate-400 transition hover:text-slate-200 cursor-pointer"
              >
                <i data-lucide="corner-up-right" class="h-3.5 w-3.5"></i>
                Trả lời
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
    )
    .join("");

const buildRelatedMarkup = (items) =>
  items
    .map(
      (item) => `
      <a href="detail.html?id=${item.id}" class="flex w-full items-start gap-3 rounded-2xl border border-slate-800/80 bg-hub-card/60 p-4 text-left transition hover:border-slate-600/60">
        <span class="flex h-10 w-10 items-center justify-center rounded-full ${item.creator?.badge ?? ""} text-xs font-semibold">
          ${item.creator?.initials ?? ""}
        </span>
        <div class="flex-1">
          <p class="text-sm font-semibold text-slate-200">${item.title}</p>
          <p class="mt-1 text-xs text-slate-500">#${item.tags.join(" · #")}</p>
        </div>
        <i data-lucide="arrow-up-right" class="h-4 w-4 text-slate-600"></i>
      </a>
    `,
    )
    .join("");

export const renderDetail = (post, posts, comments) => {
  const related = posts
    .filter((item) => item.id !== post.id && item.creator?.id === post.creator?.id)
    .concat(posts.filter((item) => item.id !== post.id && item.creator?.id !== post.creator?.id))
    .slice(0, 4);

  return `
    <section class="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <article class="rounded-3xl border border-slate-800/80 bg-hub-panel/90 p-8 text-slate-200 shadow-xl">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <a href="profile.html?creator=${post.creator?.id ?? ""}" class="flex items-center gap-3 text-left transition hover:text-red-200">
            <span class="flex h-12 w-12 items-center justify-center rounded-full ${post.creator?.badge ?? ""} text-sm font-semibold">
              ${post.creator?.initials ?? ""}
            </span>
            <div>
              <p class="text-sm font-semibold text-white">${post.creator?.name ?? "Creator"}</p>
              <p class="text-xs text-slate-500">${post.category} · ${post.time}</p>
            </div>
          </a>
          <div class="flex items-center gap-3">
            <button
              data-action="follow"
              data-creator-id="${post.creator?.id ?? ""}"
              data-creator-name="${post.creator?.initials ?? ""}"
              class="inline-flex items-center gap-2 rounded-full border border-red-500/50 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-200 transition hover:border-red-400/60 hover:text-red-100 cursor-pointer"
            >
              <i data-lucide="user-plus" class="h-4 w-4"></i>
              Theo dõi ${post.creator?.initials ?? ""}
            </button>
            <span class="rounded-full border border-slate-700 px-3 py-1 text-[11px] uppercase tracking-wide text-slate-400">
              Bài viết
            </span>
          </div>
        </div>

        <h1 class="mt-6 text-3xl font-semibold text-white">${post.title}</h1>

        <div class="mt-4 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-widest text-slate-400">
          ${buildTagPills(post.tags.map((tag) => `#${tag}`))}
          <span class="rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1">Nguồn tuyển chọn</span>
        </div>

        <div class="mt-6 overflow-hidden rounded-3xl border border-slate-800/80">
          <img src="${post.image}" alt="${post.title}" class="w-full object-cover" />
        </div>

        <div class="mt-6 grid gap-4 text-sm leading-relaxed text-slate-300">
          <p>${post.summary}</p>
          <p>
            Bài viết đào sâu vào quy trình triển khai thực tế, liệt kê các công cụ thay thế và đưa ra checklist để bạn thử nghiệm ngay.
            Nếu bạn đang muốn nâng cấp workflow cho mùa review cuối năm, đây là tài liệu không thể bỏ qua.
          </p>
          <p>
            Ngoài ra, tác giả còn cung cấp bộ preset miễn phí và gợi ý cách phân bổ ngân sách phù hợp khi nâng cấp thiết bị
            tại thị trường Việt Nam.
          </p>
        </div>

        <div class="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-400">
          <button
            data-action="upvote"
            data-post-id="${post.id}"
            class="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2 transition hover:bg-red-500/20 hover:border-red-500/60 hover:text-red-200 cursor-pointer"
          >
            <i data-lucide="arrow-big-up" class="h-4 w-4"></i>
            Ủng hộ · <span class="upvote-count">${post.upvotes}</span>
          </button>
          <button
            data-action="bookmark"
            data-post-id="${post.id}"
            class="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2 transition hover:bg-amber-500/20 hover:border-amber-500/60 hover:text-amber-200 cursor-pointer"
          >
            <i data-lucide="bookmark" class="h-4 w-4"></i>
            Lưu lại · <span class="bookmark-count">${post.saves}</span>
          </button>
          <button
            data-action="share"
            data-post-id="${post.id}"
            data-post-title="${post.title}"
            class="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2 transition hover:bg-slate-800 cursor-pointer"
          >
            <i data-lucide="share-2" class="h-4 w-4"></i>
            Chia sẻ
          </button>
          <span class="ml-auto inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
            <i data-lucide="shield-check" class="h-4 w-4"></i>
            Được xác minh bởi GearVN
          </span>
        </div>

        <div class="mt-8 rounded-3xl border border-slate-800/80 bg-hub-card/70 p-6 comment-form">
          <p class="text-sm font-semibold text-slate-200">Chia sẻ suy nghĩ của bạn</p>
          <div class="mt-4 rounded-2xl border border-slate-800 bg-hub-panel/80">
            <textarea
              rows="3"
              placeholder="Viết bình luận của bạn..."
              class="w-full rounded-2xl bg-transparent px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none"
            ></textarea>
            <div class="flex items-center justify-between border-t border-slate-800 px-4 py-3">
              <div class="flex items-center gap-3 text-slate-500">
                <button class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 transition hover:border-slate-600 hover:text-slate-200">
                  <i data-lucide="image-plus" class="h-4 w-4"></i>
                </button>
                <button class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 transition hover:border-slate-600 hover:text-slate-200">
                  <i data-lucide="smile" class="h-4 w-4"></i>
                </button>
              </div>
              <button
                data-action="submit-comment"
                data-post-id="${post.id}"
                class="rounded-full bg-red-500/90 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-400 cursor-pointer"
              >
                Đăng bình luận
              </button>
            </div>
          </div>
        </div>

        <div class="mt-6 space-y-4">
          <div class="flex items-center justify-between text-sm text-slate-400">
            <span>${post.comments} bình luận</span>
            <span class="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs">
              <i data-lucide="sort-desc" class="h-4 w-4"></i>
              Mới nhất
            </span>
          </div>
          ${buildCommentMarkup(comments)}
        </div>
      </article>

      <aside class="space-y-4">
        <div class="rounded-3xl border border-slate-800/80 bg-hub-panel/90 p-6">
          <div class="flex items-center justify-between">
            <p class="text-sm font-semibold text-white">Bạn có thích bài viết này?</p>
            <span class="rounded-full border border-slate-700 px-3 py-1 text-xs uppercase tracking-widest text-slate-400">
              Khảo sát
            </span>
          </div>
          <div class="mt-4 grid gap-3 text-sm text-slate-400">
            <button
              data-action="survey"
              data-rating="helpful"
              class="inline-flex items-center justify-between rounded-2xl border border-slate-800/80 bg-hub-card/70 px-4 py-3 transition hover:border-slate-600 hover:text-slate-100 cursor-pointer"
            >
              👍 Rất hữu ích
              <i data-lucide="arrow-right" class="h-4 w-4"></i>
            </button>
            <button
              data-action="survey"
              data-rating="okay"
              class="inline-flex items-center justify-between rounded-2xl border border-slate-800/80 bg-hub-card/70 px-4 py-3 transition hover:border-slate-600 hover:text-slate-100 cursor-pointer"
            >
              👌 Đủ dùng
              <i data-lucide="arrow-right" class="h-4 w-4"></i>
            </button>
            <button
              data-action="survey"
              data-rating="improve"
              class="inline-flex items-center justify-between rounded-2xl border border-slate-800/80 bg-hub-card/70 px-4 py-3 transition hover:border-slate-600 hover:text-slate-100 cursor-pointer"
            >
              🙁 Cần cải thiện
              <i data-lucide="arrow-right" class="h-4 w-4"></i>
            </button>
          </div>
        </div>

        <div class="rounded-3xl border border-slate-800/80 bg-hub-panel/90 p-6">
          <p class="text-sm font-semibold text-white">Mục lục nội dung</p>
          <ul class="mt-4 space-y-3 text-sm text-slate-400">
            <li class="flex items-center gap-2">
              <i data-lucide="dot" class="h-5 w-5"></i>
              Tổng quan xu hướng
            </li>
            <li class="flex items-center gap-2">
              <i data-lucide="dot" class="h-5 w-5"></i>
              Checklist triển khai
            </li>
            <li class="flex items-center gap-2">
              <i data-lucide="dot" class="h-5 w-5"></i>
              Thiết bị khuyến nghị
            </li>
            <li class="flex items-center gap-2">
              <i data-lucide="dot" class="h-5 w-5"></i>
              Bộ preset miễn phí
            </li>
            <li class="flex items-center gap-2">
              <i data-lucide="dot" class="h-5 w-5"></i>
              Lộ trình áp dụng 30 ngày
            </li>
          </ul>
        </div>

        <div class="rounded-3xl border border-slate-800/80 bg-hub-panel/90 p-6">
          <p class="text-sm font-semibold text-white">Có thể bạn quan tâm</p>
          <div class="mt-4 space-y-3">
            ${buildRelatedMarkup(related)}
          </div>
        </div>

        <div class="rounded-3xl border border-slate-800/80 bg-hub-panel/90 p-6 text-sm text-slate-400">
          <p class="font-semibold text-white">Thông tin nhanh</p>
          <ul class="mt-3 space-y-2">
            <li class="flex items-center gap-2">
              <i data-lucide="clock" class="h-4 w-4 text-slate-500"></i>
              Cập nhật lần cuối: 24 phút trước
            </li>
            <li class="flex items-center gap-2">
              <i data-lucide="users" class="h-4 w-4 text-slate-500"></i>
              ${Math.floor(Math.random() * 900) + 120} người đã lưu bài viết
            </li>
            <li class="flex items-center gap-2">
              <i data-lucide="link" class="h-4 w-4 text-slate-500"></i>
              Nguồn gốc: GearVN Creator Feed
            </li>
          </ul>
        </div>
      </aside>
    </section>
  `;
};

const buildSimilarCreators = (similarCreators) =>
  similarCreators
    .map(
      (creator) => `
      <a
        href="profile.html?creator=${creator.id}"
        class="flex flex-col items-center gap-2 rounded-2xl border border-slate-800/80 bg-hub-card/70 px-4 py-3 text-center text-sm text-slate-300 transition hover:border-slate-600 hover:text-white"
      >
        <span class="flex h-12 w-12 items-center justify-center rounded-full ${creator.badge} text-sm font-semibold">
          ${creator.initials}
        </span>
        <span>${creator.name}</span>
      </a>
    `,
    )
    .join("");

export const renderProfilePage = ({ creator, posts, popularPosts, similarCreators }) => `
  <section class="space-y-8">
    <div class="overflow-hidden rounded-3xl border border-slate-800 bg-hub-panel/90">
      <div class="relative h-56 w-full">
        <img src="${creator.banner}" alt="${creator.name}" class="h-full w-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-b from-slate-900/10 via-slate-900/25 to-slate-900/70"></div>
        <div class="absolute left-6 right-6 bottom-6 flex flex-wrap items-end justify-between gap-4">
          <div class="flex items-end gap-4">
            <img
              src="${creator.avatar}"
              alt="${creator.name}"
              class="h-24 w-24 rounded-full border-4 border-white/10 object-cover shadow-lg"
            />
            <div>
              <h1 class="text-2xl font-semibold text-white">${creator.name}</h1>
              <p class="mt-2 max-w-xl text-sm text-slate-200">${creator.bio}</p>
              <div class="mt-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-widest text-slate-300">
                ${buildTagPills(creator.tags)}
              </div>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <a
              href="index.html"
              class="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
            >
              <i data-lucide="arrow-left" class="h-4 w-4"></i>
              Quay lại feed
            </a>
            <button
              data-action="follow"
              data-creator-id="${creator.id}"
              data-creator-name="${creator.initials}"
              class="inline-flex items-center gap-2 rounded-full border border-red-500/50 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-200 transition hover:border-red-400/60 hover:text-red-100 cursor-pointer"
            >
              <i data-lucide="user-plus" class="h-4 w-4"></i>
              Theo dõi ${creator.initials}
            </button>
          </div>
        </div>
      </div>
      <div class="flex flex-wrap items-center justify-between gap-6 px-6 pb-6">
        <div class="flex gap-6 text-sm text-slate-400">
          <div>
            <p class="text-lg font-semibold text-white">${posts.length}</p>
            <p>Bài viết</p>
          </div>
          <div>
            <p class="text-lg font-semibold text-white">${formatNumber(creator.followers)}</p>
            <p>Người theo dõi</p>
          </div>
          <div>
            <p class="text-lg font-semibold text-white">${formatNumber(creator.following)}</p>
            <p>Đang theo dõi</p>
          </div>
        </div>
        <div class="text-xs uppercase tracking-widest text-slate-500">
          Cập nhật gần nhất ${posts[0]?.time ?? "Hôm nay"}
        </div>
      </div>
    </div>

    ${
      similarCreators.length
        ? `
        <section class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-semibold text-white">Nguồn tương tự</h2>
            <span class="text-xs text-slate-500">Khám phá thêm creator liên quan</span>
          </div>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            ${buildSimilarCreators(similarCreators)}
          </div>
        </section>
      `
        : ""
    }

    ${
      popularPosts.length
        ? `
        <section class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-semibold text-white">Bài viết nổi bật</h2>
            <span class="text-xs text-slate-500">Lọc theo lượt ủng hộ cao nhất</span>
          </div>
          <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            ${renderFeed(popularPosts)}
          </div>
        </section>
      `
        : ""
    }

    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-semibold text-white">Tất cả bài viết</h2>
        <span class="text-xs text-slate-500">${posts.length} bài được hiển thị</span>
      </div>
      <div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        ${renderFeed(posts)}
      </div>
    </section>
  </section>
`;
