import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Newspaper,
  Play,
  Calendar,
  ExternalLink,
  Menu,
  X,
  Hash,
  Globe,
  Zap,
  Clock,
  Users,
  TrendingUp,
  Cpu,
  Monitor,
  Gamepad2,
  Plus,
  FileText,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { api } from "./lib/supabase";

// Format tag name (all lowercase)
const formatTagName = (name) => {
  return name.toLowerCase();
};

// Hero config for each tab - tech style with KV
const heroConfig = {
  news: {
    icon: Globe,
    title: "Tech News",
    subtitle: "Tin tức công nghệ mới nhất từ các nguồn uy tín trên thế giới",
    gradient: "from-red-600 via-orange-500 to-yellow-500",
    bgPattern: "news",
    stats: [
      { icon: TrendingUp, label: "Trending", value: "Hot" },
      { icon: Globe, label: "Sources", value: "4+" },
    ],
  },
  review: {
    icon: Play,
    title: "Video Reviews",
    subtitle: "Đánh giá chi tiết từ các YouTuber và reviewer hàng đầu",
    gradient: "from-red-500 via-pink-500 to-purple-500",
    bgPattern: "review",
    stats: [
      { icon: Play, label: "Videos", value: "HD" },
      { icon: Users, label: "Creators", value: "VN" },
    ],
  },
  today: {
    icon: Zap,
    title: "Today's Feed",
    subtitle: "Tất cả nội dung mới được cập nhật trong ngày hôm nay",
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
    bgPattern: "today",
    stats: [
      { icon: Zap, label: "Fresh", value: "24h" },
      { icon: TrendingUp, label: "Updates", value: "Live" },
    ],
  },
  creators: {
    icon: Users,
    title: "Creators",
    subtitle: "Các YouTuber và reviewer công nghệ hàng đầu Việt Nam",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    bgPattern: "creators",
    stats: [
      { icon: Users, label: "Verified", value: "Pro" },
      { icon: Monitor, label: "Content", value: "Tech" },
    ],
  },
  articles: {
    icon: FileText,
    title: "Articles",
    subtitle: "Bài viết chuyên sâu từ các reviewer công nghệ hàng đầu",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    bgPattern: "articles",
    stats: [
      { icon: BookOpen, label: "Deep Dive", value: "Pro" },
      { icon: Users, label: "Reviewers", value: "VN" },
    ],
  },
};

// Sidebar with Tags
const Sidebar = ({ tags, selectedTag, onSelectTag, isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 transform border-r border-zinc-800 bg-zinc-900 transition-transform lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500">
                <span className="text-xs font-bold text-white">G</span>
              </div>
              <div>
                <p className="text-sm font-bold text-white">GearVN</p>
                <p className="text-[10px] text-zinc-500">News & Review</p>
              </div>
            </div>
            <button onClick={onClose} className="text-zinc-500 lg:hidden">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <Hash className="h-4 w-4" />
              Tags
            </p>
            <nav className="space-y-1">
              <button
                onClick={() => {
                  onSelectTag(null);
                  onClose();
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition ${
                  !selectedTag
                    ? "bg-red-500/10 font-medium text-red-500"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                All Posts
              </button>
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => {
                    onSelectTag(tag.slug);
                    onClose();
                  }}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition ${
                    selectedTag === tag.slug
                      ? "bg-red-500/10 font-medium text-red-500"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  #{formatTagName(tag.name)}
                </button>
              ))}
            </nav>
          </div>
          <div className="border-t border-zinc-800 p-3">
            <p className="text-[10px] text-zinc-600">Powered by GearVN</p>
          </div>
        </div>
      </aside>
    </>
  );
};

// Tab Button with dynamic color based on tab type
const tabColors = {
  news: {
    bg: "from-orange-500/20 to-red-500/20",
    border: "border-orange-500/50",
    shadow: "shadow-[0_0_15px_rgba(249,115,22,0.3)]",
    icon: "text-orange-400",
  },
  review: {
    bg: "from-red-500/20 to-rose-500/20",
    border: "border-red-500/50",
    shadow: "shadow-[0_0_15px_rgba(239,68,68,0.3)]",
    icon: "text-red-400",
  },
  articles: {
    bg: "from-purple-500/20 to-fuchsia-500/20",
    border: "border-purple-500/50",
    shadow: "shadow-[0_0_15px_rgba(168,85,247,0.3)]",
    icon: "text-purple-400",
  },
  creators: {
    bg: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/50",
    shadow: "shadow-[0_0_15px_rgba(16,185,129,0.3)]",
    icon: "text-emerald-400",
  },
  today: {
    bg: "from-yellow-500/20 to-amber-500/20",
    border: "border-yellow-500/50",
    shadow: "shadow-[0_0_15px_rgba(234,179,8,0.3)]",
    icon: "text-yellow-400",
  },
};

const TabButton = ({ active, icon: Icon, label, onClick, tabKey }) => {
  const colors = tabColors[tabKey] || tabColors.news;

  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
        active
          ? "text-white"
          : "text-zinc-500 hover:text-zinc-300"
      }`}
    >
      {active && (
        <span className={`absolute inset-0 rounded-lg bg-gradient-to-r ${colors.bg} backdrop-blur-sm`} />
      )}
      {active && (
        <span className={`absolute inset-0 rounded-lg border ${colors.border} ${colors.shadow}`} />
      )}
      <Icon className={`relative h-4 w-4 ${active ? colors.icon : ""}`} />
      <span className="relative">{label}</span>
    </button>
  );
};

// Hero Section - Tech Style with KV
const HeroSection = ({ tab, postCount }) => {
  const config = heroConfig[tab];
  const Icon = config.icon;

  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
      {/* Background Pattern - Circuit/Tech Lines */}
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M0 50 H40 M60 50 H100 M50 0 V40 M50 60 V100" stroke="currentColor" strokeWidth="1" fill="none" className="text-white" />
              <circle cx="50" cy="50" r="4" fill="currentColor" className="text-white" />
              <circle cx="0" cy="50" r="2" fill="currentColor" className="text-white" />
              <circle cx="100" cy="50" r="2" fill="currentColor" className="text-white" />
              <circle cx="50" cy="0" r="2" fill="currentColor" className="text-white" />
              <circle cx="50" cy="100" r="2" fill="currentColor" className="text-white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-10`} />

      {/* Glow Effect */}
      <div className={`absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-r ${config.gradient} opacity-20 blur-3xl`} />
      <div className={`absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-gradient-to-r ${config.gradient} opacity-15 blur-2xl`} />

      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: Icon + Title */}
          <div className="flex items-start gap-4">
            {/* Animated Icon Container */}
            <div className={`relative rounded-2xl bg-gradient-to-br ${config.gradient} p-0.5`}>
              <div className="rounded-2xl bg-zinc-900 p-3">
                <Icon className="h-8 w-8 text-white" />
              </div>
              {/* Pulse ring */}
              <div className={`absolute inset-0 -z-10 animate-ping rounded-2xl bg-gradient-to-br ${config.gradient} opacity-20`} style={{ animationDuration: '3s' }} />
            </div>

            <div className="flex-1">
              {/* Title with gradient */}
              <h1 className={`bg-gradient-to-r ${config.gradient} bg-clip-text text-2xl font-black tracking-tight text-transparent sm:text-3xl`}>
                {config.title}
              </h1>
              <p className="mt-1 max-w-md text-sm text-zinc-400">
                {config.subtitle}
              </p>

              {/* Stats badges */}
              <div className="mt-3 flex flex-wrap gap-2">
                {config.stats.map((stat, idx) => {
                  const StatIcon = stat.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-2.5 py-1 backdrop-blur-sm"
                    >
                      <StatIcon className="h-3.5 w-3.5 text-zinc-400" />
                      <span className="text-xs text-zinc-500">{stat.label}</span>
                      <span className={`bg-gradient-to-r ${config.gradient} bg-clip-text text-xs font-bold text-transparent`}>
                        {stat.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Post Count */}
          <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1">
            <div className="flex items-baseline gap-1">
              <span className={`bg-gradient-to-r ${config.gradient} bg-clip-text text-4xl font-black tabular-nums text-transparent sm:text-5xl`}>
                {postCount}
              </span>
              <span className="text-lg font-medium text-zinc-500">+</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`h-2 w-2 animate-pulse rounded-full bg-gradient-to-r ${config.gradient}`} />
              <span className="text-sm font-medium uppercase tracking-wider text-zinc-500">
                {tab === 'creators' ? 'Creators' : 'Posts'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className={`h-1 w-full bg-gradient-to-r ${config.gradient}`} />
    </div>
  );
};

// Post Detail Modal
const PostDetailModal = ({ post, onClose, onViewCreator }) => {
  if (!post) return null;

  const isReview = post.type === "review";
  const displayTitle = post.title_vi;
  const displaySummary = post.summary_vi;

  const handleCTAClick = () => {
    window.open(post.source_url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-zinc-800 p-2 text-zinc-400 hover:bg-zinc-700 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Thumbnail */}
        {post.thumbnail_url && (
          <div className="relative aspect-video">
            <img
              src={post.thumbnail_url}
              alt={displayTitle}
              className="h-full w-full object-cover"
            />
            <div className="absolute left-4 top-4">
              <span
                className={`rounded-lg px-3 py-1 text-sm font-medium ${
                  isReview ? "bg-red-500 text-white" : "bg-zinc-800 text-zinc-300"
                }`}
              >
                {isReview ? "Review" : "News"}
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Creator */}
          {post.creator && (
            <button
              onClick={() => {
                onViewCreator(post.creator.slug);
                onClose();
              }}
              className="mb-3 flex items-center gap-2 text-sm text-zinc-400 hover:text-red-500"
            >
              {post.creator.avatar_url && (
                <img
                  src={post.creator.avatar_url}
                  alt={post.creator.name}
                  className="h-6 w-6 rounded-full"
                />
              )}
              <span>{post.creator.name}</span>
            </button>
          )}
          {post.created_at && (
            <div className="mb-3 flex items-center gap-1.5 text-sm text-zinc-500">
              <Clock className="h-4 w-4" />
              {new Date(post.created_at).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          )}

          {/* Title */}
          <h2 className="mb-4 text-2xl font-bold text-white">{displayTitle}</h2>

          {/* Summary */}
          {displaySummary && (
            <p className="mb-6 text-base leading-relaxed text-zinc-400">
              {displaySummary}
            </p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-lg bg-zinc-800 px-3 py-1.5 text-base text-zinc-400"
                >
                  #{formatTagName(tag.name)}
                </span>
              ))}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3">
            {/* Read Article button - show if post has linked article */}
            {post.article && post.article.slug && (
              <Link
                to={`/articles/${post.article.slug}`}
                onClick={onClose}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 py-3 text-base font-bold text-white transition hover:from-purple-600 hover:to-fuchsia-600"
              >
                <BookOpen className="h-5 w-5" />
                Read Article
              </Link>
            )}

            {/* View Source button */}
            <button
              onClick={handleCTAClick}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-base font-bold transition ${
                isReview
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "border-2 border-zinc-700 text-zinc-300 hover:border-red-500 hover:text-red-500"
              }`}
            >
              {isReview ? (
                <>
                  <Play className="h-5 w-5" />
                  Watch Video
                </>
              ) : (
                <>
                  <ExternalLink className="h-5 w-5" />
                  Read Original
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Post Card - With Tags
const PostCard = ({ post, onClick }) => {
  const isReview = post.type === "review";
  const displayTitle = post.title_vi;
  const hasArticle = post.article && post.article.slug;

  return (
    <article
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition hover:border-zinc-700"
    >
      {post.thumbnail_url && (
        <div className="relative aspect-video overflow-hidden">
          <img
            src={post.thumbnail_url}
            alt={displayTitle}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
          {isReview && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
              <div className="rounded-full bg-red-500 p-2">
                <Play className="h-4 w-4 text-white" fill="white" />
              </div>
            </div>
          )}
          <div className="absolute left-2 top-2 flex gap-1">
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                isReview ? "bg-red-500 text-white" : "bg-zinc-800/90 text-zinc-300"
              }`}
            >
              {isReview ? "Review" : "News"}
            </span>
            {hasArticle && (
              <span className="flex items-center gap-0.5 rounded bg-purple-500 px-1.5 py-0.5 text-[10px] font-medium text-white">
                <BookOpen className="h-2.5 w-2.5" />
                Article
              </span>
            )}
          </div>
        </div>
      )}
      <div className="p-3">
        {post.creator && (
          <div className="mb-2 flex items-center gap-2 text-xs text-zinc-500">
            {post.creator.avatar_url && (
              <img
                src={post.creator.avatar_url}
                alt={post.creator.name}
                className="h-6 w-6 rounded-full"
              />
            )}
            <span className="truncate font-medium">{post.creator.name}</span>
          </div>
        )}
        <h3 className="mb-2 line-clamp-2 text-sm font-bold leading-snug text-white group-hover:text-red-500">
          {displayTitle}
        </h3>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-400"
              >
                #{formatTagName(tag.name)}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-[10px] text-zinc-500">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

// Posts Grid with Load More
const POSTS_PER_PAGE = 18;

const PostsGrid = ({ posts, onSelectPost, emptyMessage }) => {
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  useEffect(() => {
    setVisibleCount(POSTS_PER_PAGE);
  }, [posts.length]);

  if (posts.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/50">
        <p className="text-sm text-zinc-500">{emptyMessage}</p>
      </div>
    );
  }

  const visiblePosts = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {visiblePosts.map((post) => (
          <PostCard key={post.id} post={post} onClick={() => onSelectPost(post)} />
        ))}
      </div>
      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + POSTS_PER_PAGE)}
            className="rounded-xl border border-zinc-700 px-6 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-red-500 hover:text-red-500"
          >
            Load More ({posts.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </>
  );
};

// Article Card - Grid card layout like PostCard
const ArticleCard = ({ article }) => {
  return (
    <Link
      to={`/articles/${article.slug}`}
      className="group block overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition hover:border-zinc-700"
    >
      {article.thumbnail_url && (
        <div className="relative aspect-video overflow-hidden">
          <img
            src={article.thumbnail_url}
            alt={article.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
          <div className="absolute left-2 top-2">
            <span className="flex items-center gap-0.5 rounded bg-purple-500 px-1.5 py-0.5 text-[10px] font-medium text-white">
              <FileText className="h-2.5 w-2.5" />
              Article
            </span>
          </div>
        </div>
      )}
      <div className="p-3">
        {article.creator && (
          <div className="mb-2 flex items-center gap-2 text-xs text-zinc-500">
            {article.creator.avatar_url && (
              <img
                src={article.creator.avatar_url}
                alt={article.creator.name}
                className="h-6 w-6 rounded-full"
              />
            )}
            <span className="truncate font-medium">{article.creator.name}</span>
          </div>
        )}
        <h3 className="mb-2 line-clamp-2 text-sm font-bold leading-snug text-white group-hover:text-purple-500">
          {article.title}
        </h3>
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-400"
              >
                #{formatTagName(tag.name)}
              </span>
            ))}
            {article.tags.length > 3 && (
              <span className="text-[10px] text-zinc-500">
                +{article.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

// Articles Grid - Grid layout like PostsGrid
const ARTICLES_PER_PAGE = 18;

const ArticlesGrid = ({ articles, emptyMessage }) => {
  const [visibleCount, setVisibleCount] = useState(ARTICLES_PER_PAGE);

  useEffect(() => {
    setVisibleCount(ARTICLES_PER_PAGE);
  }, [articles.length]);

  if (articles.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/50">
        <FileText className="mb-2 h-8 w-8 text-zinc-600" />
        <p className="text-sm text-zinc-500">{emptyMessage}</p>
        <p className="mt-1 text-xs text-zinc-600">Bài viết sẽ xuất hiện khi có nội dung mới</p>
      </div>
    );
  }

  const visibleArticles = articles.slice(0, visibleCount);
  const hasMore = visibleCount < articles.length;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {visibleArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + ARTICLES_PER_PAGE)}
            className="rounded-xl border border-zinc-700 px-6 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-purple-500 hover:text-purple-500"
          >
            Load More ({articles.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </>
  );
};

// Creator Card for grid
const CreatorCard = ({ creator, postCount, isYouTuber, onClick }) => {
  return (
    <article
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition hover:border-zinc-700"
    >
      <div className="flex flex-col items-center text-center">
        {creator.avatar_url ? (
          <img
            src={creator.avatar_url}
            alt={creator.name}
            className="mb-3 h-16 w-16 rounded-full object-cover ring-2 ring-zinc-700 transition group-hover:ring-red-500"
          />
        ) : (
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 ring-2 ring-zinc-700 transition group-hover:ring-red-500">
            <Users className="h-8 w-8 text-zinc-500" />
          </div>
        )}
        <h3 className="mb-1 text-sm font-bold text-white group-hover:text-red-500">
          {creator.name}
        </h3>
        <p className="text-xs text-zinc-500">
          {postCount} {isYouTuber ? "videos" : "articles"}
        </p>
        {creator.channel_url && (
          <a
            href={creator.channel_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-2 text-[10px] text-red-500 hover:underline"
          >
            {isYouTuber ? "YouTube Channel →" : "Website →"}
          </a>
        )}
      </div>
    </article>
  );
};

// Creators Grid
const CreatorsGrid = ({ creators, postCounts, creatorTypes, onSelectCreator }) => {
  if (creators.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/50">
        <p className="text-sm text-zinc-500">No creators found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {creators.map((creator) => (
        <CreatorCard
          key={creator.id}
          creator={creator}
          postCount={postCounts[creator.id] || 0}
          isYouTuber={creatorTypes[creator.id] === "review"}
          onClick={() => onSelectCreator(creator.slug)}
        />
      ))}
    </div>
  );
};

// Creator Profile Page
const CreatorPage = ({ creator, posts, onBack, onSelectPost }) => {
  if (!creator) {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-zinc-500">Creator not found</p>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 text-xs text-zinc-500 hover:text-white"
      >
        ← Back
      </button>
      <div className="mb-6 flex items-center gap-3">
        {creator.avatar_url && (
          <img
            src={creator.avatar_url}
            alt={creator.name}
            className="h-12 w-12 rounded-full"
          />
        )}
        <div>
          <h1 className="text-xl font-bold text-white">{creator.name}</h1>
          {creator.channel_url && (
            <a
              href={creator.channel_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-red-500 hover:underline"
            >
              View Channel →
            </a>
          )}
        </div>
      </div>
      <h2 className="mb-3 text-sm font-semibold text-white">
        Posts ({posts.length})
      </h2>
      <PostsGrid
        posts={posts}
        onSelectPost={onSelectPost}
        emptyMessage="No posts from this creator yet"
      />
    </div>
  );
};

// Import Auth components
import AuthModal from './components/auth/AuthModal';
import UserMenu from './components/auth/UserMenu';
import SubmitModal from './components/submit/SubmitModal';
import AdminPanel from './components/admin/AdminPanel';

// Main App
const App = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [currentTab, setCurrentTab] = useState(tabFromUrl || "news");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Update tab when URL changes
  useEffect(() => {
    if (tabFromUrl && ["news", "review", "today", "creators", "articles"].includes(tabFromUrl)) {
      setCurrentTab(tabFromUrl);
    }
  }, [tabFromUrl]);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [creators, setCreators] = useState([]);
  const [creatorPostCounts, setCreatorPostCounts] = useState({});
  const [creatorTypes, setCreatorTypes] = useState({});
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [creatorPosts, setCreatorPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, tagsData, creatorsData, articlesData] = await Promise.all([
          api.getPosts(),
          api.getTags(),
          api.getCreators(),
          api.getArticles(),
        ]);
        setPosts(postsData);
        setTags(tagsData);
        setCreators(creatorsData);
        setArticles(articlesData || []);

        // Calculate post counts and types per creator
        const counts = {};
        const types = {};
        postsData.forEach((post) => {
          if (post.creator_id) {
            counts[post.creator_id] = (counts[post.creator_id] || 0) + 1;
            // Set type based on post type (review = YouTuber, news = news source)
            if (!types[post.creator_id]) {
              types[post.creator_id] = post.type;
            }
          }
        });
        setCreatorPostCounts(counts);
        setCreatorTypes(types);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getFilteredPosts = () => {
    let filtered = posts;
    if (currentTab === "news") {
      filtered = filtered.filter((p) => p.type === "news");
    } else if (currentTab === "review") {
      filtered = filtered.filter((p) => p.type === "review");
    } else if (currentTab === "today") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filtered = filtered.filter((p) => {
        const postDate = new Date(p.published_at);
        return postDate >= today;
      });
    }
    if (selectedTag) {
      filtered = filtered.filter((p) =>
        p.tags?.some((t) => t.slug === selectedTag)
      );
    }
    return filtered;
  };

  const handleViewCreator = async (creatorSlug) => {
    try {
      const creator = await api.getCreatorBySlug(creatorSlug);
      const posts = await api.getPostsByCreator(creator.id);
      setSelectedCreator(creator);
      setCreatorPosts(posts);
    } catch (error) {
      console.error("Failed to fetch creator:", error);
    }
  };

  // Refresh posts after submit
  const handleSubmitSuccess = async () => {
    try {
      const postsData = await api.getPosts();
      setPosts(postsData);
    } catch (error) {
      console.error("Failed to refresh posts:", error);
    }
  };

  const filteredPosts = getFilteredPosts();

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Sidebar
        tags={tags}
        selectedTag={selectedTag}
        onSelectTag={setSelectedTag}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
          <div className="flex items-center gap-3 px-3 py-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-zinc-400 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="text-sm font-bold lg:hidden">GearVN</div>
            <div className="flex flex-1 items-center justify-center">
              <div className="relative flex gap-1 rounded-xl border border-zinc-800/80 bg-zinc-900/90 p-1 backdrop-blur-md">
                {/* Tech glow effect */}
                <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10 opacity-50" />
                <TabButton
                  active={currentTab === "news"}
                  icon={Newspaper}
                  label="News"
                  tabKey="news"
                  onClick={() => {
                    setCurrentTab("news");
                    setSelectedCreator(null);
                  }}
                />
                <TabButton
                  active={currentTab === "review"}
                  icon={Play}
                  label="Review"
                  tabKey="review"
                  onClick={() => {
                    setCurrentTab("review");
                    setSelectedCreator(null);
                  }}
                />
                <TabButton
                  active={currentTab === "articles"}
                  icon={FileText}
                  label="Articles"
                  tabKey="articles"
                  onClick={() => {
                    setCurrentTab("articles");
                    setSelectedCreator(null);
                  }}
                />
                <TabButton
                  active={currentTab === "creators"}
                  icon={Users}
                  label="Creators"
                  tabKey="creators"
                  onClick={() => {
                    setCurrentTab("creators");
                    setSelectedCreator(null);
                  }}
                />
                <TabButton
                  active={currentTab === "today"}
                  icon={Calendar}
                  label="Today"
                  tabKey="today"
                  onClick={() => {
                    setCurrentTab("today");
                    setSelectedCreator(null);
                  }}
                />
              </div>
            </div>
            {/* Submit + User Menu */}
            <div className="hidden items-center gap-3 lg:flex">
              <button
                onClick={() => setSubmitModalOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:from-red-600 hover:to-orange-600"
              >
                <Plus className="h-4 w-4" />
                Submit
              </button>
              <UserMenu
                onOpenAuth={() => setAuthModalOpen(true)}
                onOpenAdmin={() => setShowAdminPanel(true)}
              />
            </div>
            <div className="w-5 lg:hidden" />
          </div>
        </header>

        <main className="p-3 lg:p-4">
          {showAdminPanel ? (
            <AdminPanel onBack={() => setShowAdminPanel(false)} />
          ) : isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="text-sm text-zinc-500">Loading...</div>
            </div>
          ) : selectedCreator ? (
            <CreatorPage
              creator={selectedCreator}
              posts={creatorPosts}
              onBack={() => setSelectedCreator(null)}
              onSelectPost={setSelectedPost}
            />
          ) : currentTab === "creators" ? (
            <>
              <HeroSection tab={currentTab} postCount={creators.length} />
              <CreatorsGrid
                creators={creators}
                postCounts={creatorPostCounts}
                creatorTypes={creatorTypes}
                onSelectCreator={handleViewCreator}
              />
            </>
          ) : currentTab === "articles" ? (
            <>
              <HeroSection tab={currentTab} postCount={articles.length} />
              {selectedTag && (
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-xs text-zinc-500">Filtering:</span>
                  <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-xs font-medium text-purple-500">
                    #{formatTagName(selectedTag)}
                  </span>
                  <button
                    onClick={() => setSelectedTag(null)}
                    className="text-[10px] text-zinc-500 hover:text-white"
                  >
                    Clear
                  </button>
                </div>
              )}
              <ArticlesGrid
                articles={selectedTag ? articles.filter(a => a.tags?.some(t => t.slug === selectedTag)) : articles}
                emptyMessage="No articles found"
              />
            </>
          ) : (
            <>
              <HeroSection tab={currentTab} postCount={filteredPosts.length} />
              {selectedTag && (
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-xs text-zinc-500">Filtering:</span>
                  <span className="rounded-md bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-500">
                    #{formatTagName(selectedTag)}
                  </span>
                  <button
                    onClick={() => setSelectedTag(null)}
                    className="text-[10px] text-zinc-500 hover:text-white"
                  >
                    Clear
                  </button>
                </div>
              )}
              <PostsGrid
                posts={filteredPosts}
                onSelectPost={setSelectedPost}
                emptyMessage={`No ${currentTab} posts found`}
              />
            </>
          )}
        </main>
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onViewCreator={handleViewCreator}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Submit Modal */}
      <SubmitModal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        tags={tags}
        onSuccess={handleSubmitSuccess}
      />
    </div>
  );
};

export default App;
