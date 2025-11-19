import { useMemo, useState, useEffect } from "react";
import {
  Home,
  Compass,
  Bookmark,
  Users,
  User,
  Search,
  Bell,
  ArrowUp,
  Bookmark as BookmarkIcon,
  MessageCircle,
  UserCircle,
  Menu,
  Link as LinkIcon,
  X,
  MoreHorizontal,
  Share2,
  Copy,
  Facebook,
  Twitter,
} from "lucide-react";

const navItems = [
  { label: "Home", icon: Home, page: "home" },
  { label: "Explore", icon: Compass, page: "explore" },
  { label: "Bookmarks", icon: Bookmark, page: "bookmarks" },
  { label: "Following", icon: Users, page: "following" },
  { label: "My Profile", icon: User, page: "profile" },
];

const creatorDirectory = {
  mina: {
    id: "mina",
    name: "Mina Review",
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=facearea&w=200&h=200&q=80",
    cover:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    bio: "Chia sẻ trải nghiệm thực tế với các sản phẩm gaming gear & PC build.",
    baseFollowers: 1280,
    followingCount: 142,
  },
  techlab: {
    id: "techlab",
    name: "TechLab VN",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&w=200&h=200&q=80",
    cover:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    bio: "Team đam mê phần cứng, review thiết bị sáng tạo mỗi ngày.",
    baseFollowers: 2045,
    followingCount: 198,
  },
  hydro: {
    id: "hydro",
    name: "Hydro Build",
    avatar:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=facearea&w=200&h=200&q=80",
    cover:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
    bio: "Custom loop, setup tối ưu cho streamer & creator.",
    baseFollowers: 980,
    followingCount: 86,
  },
};

const initialPosts = [
  {
    id: 1,
    title: "SuperTuxKart 1.5 Released with Improved Graphics + More",
    excerpt: "The open-source racing game gets a massive update with new tracks and visual improvements.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
    tags: ["open-source", "linux", "gaming"],
    creatorId: "mina",
    upvotes: 42,
    comments: 3,
    saved: false,
    hasUpvoted: false,
    externalUrl: "#",
    createdAt: "Oct 22",
    readTime: "5m",
  },
  {
    id: 2,
    title: "Cloudflare Adds Node.js HTTP Servers to Cloudflare Workers",
    excerpt: "Run existing Node.js applications on the edge with minimal configuration.",
    image: "https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&w=800&q=80",
    tags: ["nodejs", "serverless", "cloud"],
    creatorId: "techlab",
    upvotes: 58,
    comments: 2,
    saved: true,
    hasUpvoted: true,
    externalUrl: "#",
    createdAt: "Oct 23",
    readTime: "3m",
  },
  {
    id: 3,
    title: "Node.js — Node.js v25.1.0 (Current)",
    excerpt: "Latest features and security updates in the Node.js ecosystem.",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=800&q=80",
    tags: ["javascript", "nodejs", "release"],
    creatorId: "hydro",
    upvotes: 82,
    comments: 9,
    saved: false,
    hasUpvoted: false,
    externalUrl: "#",
    createdAt: "Oct 29",
    readTime: "8m",
  },
  {
    id: 4,
    title: "2025 programming trends",
    excerpt: "Predictions for the next big things in software development: AI, Rust, and more.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    tags: ["trends", "career", "future"],
    creatorId: "techlab",
    upvotes: 53,
    comments: 7,
    saved: false,
    hasUpvoted: false,
    externalUrl: "#",
    createdAt: "Nov 03",
    readTime: "1m",
  },
  {
    id: 5,
    title: "I built an actually faster Notion in Rust",
    excerpt: "A deep dive into performance optimization and building native apps with Rust.",
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=800&q=80",
    tags: ["rust", "productivity", "performance"],
    creatorId: "mina",
    upvotes: 154,
    comments: 25,
    saved: true,
    hasUpvoted: true,
    externalUrl: "#",
    createdAt: "Oct 29",
    readTime: "10m",
  },
  {
    id: 6,
    title: "Self-driving SaaS: When software runs itself",
    excerpt: "The future of autonomous agents in enterprise software.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    tags: ["ai", "automation", "saas"],
    creatorId: "hydro",
    upvotes: 41,
    comments: 1,
    saved: false,
    hasUpvoted: false,
    externalUrl: "#",
    createdAt: "Oct 22",
    readTime: "5m",
  },
  {
    id: 7,
    title: "Sidemail: Email delivery made simple for startups",
    excerpt: "How we scaled our email infrastructure to handle millions of requests.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    tags: ["automation", "marketing", "startup"],
    creatorId: "techlab",
    upvotes: 63,
    comments: 2,
    saved: false,
    hasUpvoted: false,
    externalUrl: "#",
    createdAt: "Nov 02",
    readTime: "4m",
  },
  {
    id: 8,
    title: "No Code Is Dead",
    excerpt: "Why the low-code/no-code movement is evolving into something new.",
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80",
    tags: ["nocode", "development", "opinion"],
    creatorId: "mina",
    upvotes: 56,
    comments: 5,
    saved: false,
    hasUpvoted: false,
    externalUrl: "#",
    createdAt: "Oct 03",
    readTime: "20m",
  },
  {
    id: 9,
    title: "Yes, you should upgrade to TypeScript 5.9 — here's why",
    excerpt: "Exploring the new features that make the upgrade worth it.",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=800&q=80",
    tags: ["typescript", "javascript", "guide"],
    creatorId: "hydro",
    upvotes: 37,
    comments: 2,
    saved: false,
    hasUpvoted: false,
    externalUrl: "#",
    createdAt: "Oct 12",
    readTime: "11m",
  },
  {
    id: 10,
    title: "How I Learned to Stop Worrying and Trust AI Coding Agents",
    excerpt: "My journey from skeptic to power user of AI development tools.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
    tags: ["ai", "devtools", "trust"],
    creatorId: "techlab",
    upvotes: 48,
    comments: 7,
    saved: true,
    hasUpvoted: false,
    externalUrl: "#",
    createdAt: "Oct 08",
    readTime: "5m",
  },
  {
    id: 11,
    title: "A browser extension for automating your browser by connecting blocks",
    excerpt: "Introducing AutomaApp: The visual automation tool for the web.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
    tags: ["devtools", "automation", "vuejs"],
    creatorId: "mina",
    upvotes: 97,
    comments: 3,
    saved: false,
    hasUpvoted: true,
    externalUrl: "#",
    createdAt: "Sep 15",
    readTime: "2m",
  },
  {
    id: 12,
    title: "I predicted the future",
    excerpt: "Looking back at my 2020 tech predictions. What did I get right?",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    tags: ["ai", "gpt", "future"],
    creatorId: "hydro",
    upvotes: 13,
    comments: 0,
    saved: false,
    hasUpvoted: false,
    externalUrl: "#",
    createdAt: "Oct 28",
    readTime: "1m",
  },
];

const formatNumber = (value) =>
  new Intl.NumberFormat("vi-VN", { notation: "compact", compactDisplay: "short" }).format(value);

const Sidebar = ({ currentPage, onNavigate }) => {
  return (
    <aside className="hidden border-r border-theme-border bg-theme-panel px-6 py-8 lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-theme-accent/10 text-theme-accent">
          <UserCircle className="h-6 w-6" />
        </div>
        <div>
          <p className="text-lg font-semibold">GearVN Creator Hub</p>
          <p className="text-sm text-theme-secondary">Không gian của reviewer Việt</p>
        </div>
      </div>

      <nav className="mt-10 flex flex-1 flex-col gap-1">
        {navItems.map(({ label, icon: Icon, page }) => {
          const isActive = currentPage === page || (page === "profile" && currentPage === "profile");
          return (
            <button
              key={label}
              onClick={() => onNavigate(page)}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${isActive
                ? "bg-theme-accent/10 text-theme-accent"
                : "text-theme-secondary hover:bg-theme-accent/5 hover:text-theme-primary"
                }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="rounded-xl bg-theme-card p-4 border border-theme-border">
        <p className="text-sm font-semibold text-theme-accent">Gợi ý</p>
        <p className="mt-2 text-sm text-theme-secondary">
          Tham gia cộng đồng Creator Hub để kết nối với reviewer hàng đầu.
        </p>
      </div>
    </aside>
  );
};

const Header = ({ onNavigateProfile }) => {
  return (
    <header className="sticky top-0 z-10 border-b border-theme-border bg-theme-panel/95 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3 lg:hidden">
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-theme-border text-theme-secondary">
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-lg font-semibold text-theme-primary">Creator Hub</span>
        </div>

        <div className="flex flex-1 items-center gap-3 sm:max-w-xl">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-theme-border bg-theme-card px-3 py-2 focus-within:border-theme-accent">
            <Search className="h-5 w-5 text-theme-muted" />
            <input
              type="text"
              placeholder="Tìm kiếm gear, creator hoặc hashtag..."
              className="w-full bg-transparent text-sm text-theme-primary outline-none placeholder:text-theme-muted"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-theme-border text-theme-secondary transition hover:border-theme-accent hover:text-theme-accent">
            <Bell className="h-5 w-5" />
          </button>
          <button
            onClick={onNavigateProfile}
            className="flex items-center gap-2 rounded-full border border-theme-border bg-theme-card px-3 py-1.5 text-sm font-medium text-theme-primary transition hover:border-theme-accent hover:text-theme-accent"
          >
            <img
              src={creatorDirectory.mina.avatar}
              alt="Mina Review"
              className="h-7 w-7 rounded-full object-cover"
            />
            <span>Mina Review</span>
          </button>
        </div>
      </div>
    </header>
  );
};

const PostCard = ({
  post,
  creator,
  onViewPost,
  onViewCreator,
  onToggleUpvote,
  onToggleSave,
}) => {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-theme-border bg-theme-card transition hover:border-theme-border/80 hover:shadow-xl hover:shadow-theme-accent/5">
      {/* Card Header: Creator & Date */}
      <div className="flex items-center gap-2.5 px-4 pt-4">
        <img
          src={creator.avatar}
          alt={creator.name}
          className="h-6 w-6 rounded-full object-cover"
        />
        <div className="flex flex-1 items-center gap-2 overflow-hidden">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewCreator(creator.id);
            }}
            className="truncate text-xs font-bold text-theme-primary hover:text-theme-accent"
          >
            {creator.name}
          </button>
          <span className="text-xs text-theme-border">•</span>
          <span className="whitespace-nowrap text-xs text-theme-muted">{post.createdAt}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <button onClick={() => onViewPost(post.id)} className="flex flex-1 flex-col text-left">
        <div className="flex h-24 shrink-0 items-start px-4 py-3">
          <h3 className="line-clamp-3 text-base font-bold leading-snug text-theme-primary group-hover:text-theme-accent">
            {post.title}
          </h3>
        </div>

        {/* Image (if exists) */}
        {post.image && (
          <div className="relative aspect-[1.91/1] w-full overflow-hidden bg-theme-panel">
            <img
              src={post.image}
              alt={post.title}
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
        )}

        {/* Tags */}
        <div className="mt-auto px-4 py-3">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-md bg-theme-panel px-2 py-1 text-[10px] font-medium text-theme-secondary transition group-hover:bg-theme-border/50"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </button>

      {/* Card Footer: Actions */}
      <div className="flex items-center justify-between border-t border-theme-border bg-theme-card/50 px-4 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleUpvote(post.id);
            }}
            className={`group/upvote flex items-center gap-1.5 text-xs font-bold transition ${post.hasUpvoted ? "text-theme-accent" : "text-theme-secondary hover:text-theme-primary"
              }`}
          >
            <ArrowUp className={`h-4 w-4 transition ${post.hasUpvoted ? "" : "group-hover/upvote:-translate-y-0.5"}`} />
            {post.upvotes}
          </button>

          <button className="flex items-center gap-1.5 text-xs font-bold text-theme-secondary transition hover:text-theme-primary">
            <MessageCircle className="h-4 w-4" />
            {post.comments}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(post.id);
            }}
            className={`transition ${post.saved ? "text-theme-accent" : "text-theme-secondary hover:text-theme-primary"
              }`}
          >
            <BookmarkIcon className={`h-4 w-4 ${post.saved ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>
    </article>
  );
};

const HomePage = ({ posts, onViewPost, onViewCreator, onToggleUpvote, onToggleSave }) => {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-theme-primary">My Feed</h1>
        <div className="flex gap-2">
          <button className="rounded-lg bg-theme-card px-3 py-1.5 text-sm font-medium text-theme-secondary hover:bg-theme-border hover:text-theme-primary">
            Popular
          </button>
          <button className="rounded-lg bg-theme-card px-3 py-1.5 text-sm font-medium text-theme-secondary hover:bg-theme-border hover:text-theme-primary">
            Upvoted
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            creator={creatorDirectory[post.creatorId] || creatorDirectory.mina}
            onViewPost={onViewPost}
            onViewCreator={onViewCreator}
            onToggleUpvote={onToggleUpvote}
            onToggleSave={onToggleSave}
          />
        ))}
      </div>
    </section>
  );
};

const DetailPage = ({ post, creator, onClose, onViewCreator, onToggleUpvote, onToggleSave, isFollowing, onToggleFollow }) => {
  if (!post) return null;

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6" onClick={onClose}>
      <div
        className="relative flex h-full max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-3xl border border-theme-border bg-theme-panel shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white backdrop-blur-md transition hover:bg-black/70"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex h-full w-full flex-col lg:flex-row">
          {/* Left Column: Content */}
          <div className="flex-1 overflow-y-auto bg-theme-surface custom-scrollbar">
            <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
              {/* Post Header */}
              <div className="mb-6 flex items-center gap-3 text-sm text-theme-secondary">
                <span className="font-semibold text-theme-primary">{creator.name}</span>
                <span>•</span>
                <span>{post.createdAt}</span>
                <span>•</span>
                <span>{post.readTime} read</span>
              </div>

              <h1 className="mb-8 text-3xl font-bold leading-tight text-theme-primary lg:text-4xl">
                {post.title}
              </h1>

              {/* Action Bar */}
              <div className="mb-8 flex items-center gap-4">
                <button className="flex items-center gap-2 rounded-full bg-theme-accent px-6 py-2.5 text-sm font-bold text-white transition hover:bg-theme-accent-hover">
                  <LinkIcon className="h-4 w-4" />
                  Read post
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-theme-border bg-theme-card text-theme-secondary transition hover:border-theme-accent hover:text-theme-accent">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>

              {/* Featured Image */}
              {post.image && (
                <div className="mb-10 overflow-hidden rounded-2xl border border-theme-border">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-auto w-full object-cover"
                  />
                </div>
              )}

              {/* Post Content */}
              <div className="space-y-6 text-lg leading-relaxed text-theme-secondary">
                <p>{post.excerpt}</p>
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>

              {/* Tags */}
              {post.tags && (
                <div className="mt-10 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-theme-card px-3 py-1.5 text-sm font-medium text-theme-secondary"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <hr className="my-10 border-theme-border" />

              {/* Comments Section Placeholder */}
              <div>
                <h3 className="mb-6 text-xl font-bold text-theme-primary">Comments ({post.comments})</h3>
                <div className="rounded-xl border border-theme-border bg-theme-card p-8 text-center">
                  <p className="text-theme-secondary">Join the discussion...</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar (Desktop only) */}
          <div className="hidden w-96 flex-col border-l border-theme-border bg-theme-panel lg:flex">
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {/* Creator Profile */}
              <div className="mb-8 rounded-2xl border border-theme-border bg-theme-card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                  <button
                    onClick={() => onToggleFollow(creator.id)}
                    className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${isFollowing
                      ? "border border-theme-border bg-transparent text-theme-primary"
                      : "bg-white text-black hover:bg-gray-200"
                      }`}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                </div>
                <h3 className="text-lg font-bold text-theme-primary">{creator.name}</h3>
                <p className="mt-2 text-sm text-theme-secondary">{creator.bio}</p>
                <div className="mt-4 flex items-center gap-4 text-sm text-theme-secondary">
                  <span className="font-medium text-theme-primary">{formatNumber(creator.baseFollowers)} <span className="font-normal text-theme-muted">Followers</span></span>
                  <span className="font-medium text-theme-primary">{formatNumber(creator.followingCount)} <span className="font-normal text-theme-muted">Upvotes</span></span>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <p className="mb-4 text-sm font-medium text-theme-secondary">Would you recommend this post?</p>
                <div className="grid grid-cols-4 gap-2">
                  <button className="flex flex-col items-center gap-2 rounded-xl bg-theme-card p-3 transition hover:bg-theme-border">
                    <Copy className="h-5 w-5 text-theme-secondary" />
                    <span className="text-[10px] text-theme-secondary">Copy link</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 rounded-xl bg-theme-card p-3 transition hover:bg-theme-border">
                    <MessageCircle className="h-5 w-5 text-theme-secondary" />
                    <span className="text-[10px] text-theme-secondary">WhatsApp</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 rounded-xl bg-theme-card p-3 transition hover:bg-theme-border">
                    <Facebook className="h-5 w-5 text-theme-secondary" />
                    <span className="text-[10px] text-theme-secondary">Facebook</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 rounded-xl bg-theme-card p-3 transition hover:bg-theme-border">
                    <Twitter className="h-5 w-5 text-theme-secondary" />
                    <span className="text-[10px] text-theme-secondary">X</span>
                  </button>
                </div>
              </div>

              <hr className="my-8 border-theme-border" />

              {/* Related Posts */}
              <div>
                <h4 className="mb-4 text-sm font-bold text-theme-secondary">You might like</h4>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="group flex gap-3 cursor-pointer">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-theme-accent/10 text-xs font-bold text-theme-accent">
                        TW
                      </div>
                      <div>
                        <h5 className="line-clamp-2 text-sm font-bold text-theme-primary group-hover:text-theme-accent">
                          Is the generative AI bubble about to burst?
                        </h5>
                        <p className="mt-1 text-xs text-theme-muted">58 Upvotes • 2 Comments</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-4 text-xs font-bold text-theme-secondary hover:text-theme-primary">
                  View all &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = ({
  creator,
  posts,
  isFollowing,
  onToggleFollow,
  onViewPost,
  onToggleUpvote,
  onToggleSave,
}) => {
  const followerCount = useMemo(
    () => creator.baseFollowers + (isFollowing ? 1 : 0),
    [creator.baseFollowers, isFollowing],
  );

  return (
    <section className="space-y-8">
      <div className="overflow-hidden rounded-3xl border border-theme-border bg-theme-card shadow-sm">
        {creator.cover && (
          <div className="h-48 w-full">
            <img src={creator.cover} alt={creator.name} className="h-full w-full object-cover" />
          </div>
        )}
        <div className="flex flex-col gap-6 px-6 pb-6 sm:flex-row sm:items-end sm:gap-8">
          <div className="-mt-12 flex items-center gap-4">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="h-24 w-24 rounded-full border-4 border-theme-card object-cover shadow-md"
            />
            <div>
              <h2 className="text-2xl font-bold text-theme-primary">{creator.name}</h2>
              <p className="text-sm text-theme-secondary">{creator.bio}</p>
            </div>
          </div>
          <div className="flex flex-1 flex-wrap items-center justify-between gap-4">
            <div className="flex gap-6 text-sm text-theme-secondary">
              <div>
                <p className="font-semibold text-theme-primary">{posts.length}</p>
                <p>Bài viết</p>
              </div>
              <div>
                <p className="font-semibold text-theme-primary">{formatNumber(followerCount)}</p>
                <p>Người theo dõi</p>
              </div>
              <div>
                <p className="font-semibold text-theme-primary">
                  {formatNumber(creator.followingCount)}
                </p>
                <p>Đang theo dõi</p>
              </div>
            </div>
            <button
              onClick={() => onToggleFollow(creator.id)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${isFollowing
                ? "border border-theme-accent/20 bg-theme-accent/10 text-theme-accent"
                : "bg-theme-accent text-white hover:bg-theme-accent-hover"
                }`}
            >
              {isFollowing ? "Đang theo dõi" : "Theo dõi"}
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-theme-primary">Bài viết</h3>
            <p className="text-sm text-theme-secondary">Tổng hợp review mới nhất từ {creator.name}.</p>
          </div>
          <div className="inline-flex rounded-full border border-theme-border bg-theme-panel px-3 py-1 text-xs font-semibold text-theme-secondary">
            Posts
          </div>
        </div>

        <div className="mt-6 columns-1 gap-6 sm:columns-2 xl:columns-3">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              creator={creator}
              onViewPost={onViewPost}
              onViewCreator={() => { }}
              onToggleUpvote={onToggleUpvote}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const App = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedCreatorId, setSelectedCreatorId] = useState(null);
  const [followingState, setFollowingState] = useState({});
  const [creators, setCreators] = useState([]);

  // Fetch posts from Supabase
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { api } = await import('./lib/supabase');
        const data = await api.getPosts({ limit: 50 });

        if (Array.isArray(data)) {
          // Transform Supabase data to match UI component structure
          const transformedPosts = data.map((post) => ({
            id: post.id,
            title: post.title,
            excerpt: post.excerpt || post.description || "",
            image: post.thumbnail_url,
            tags: post.post_tags?.map(pt => pt.tags?.name || pt.tags?.slug) || ["tech"],
            creatorId: post.post_creators?.[0]?.creators?.slug || "unknown",
            upvotes: post.upvote_count || 0,
            comments: post.comment_count || 0,
            saved: false,
            hasUpvoted: false,
            externalUrl: "#",
            createdAt: new Date(post.created_at).toLocaleDateString(),
            readTime: "5m",
            content: post.content,
          }));
          setPosts(transformedPosts);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        // Set sample posts on error for demo
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCreators = async () => {
      try {
        const { api } = await import('./lib/supabase');
        const data = await api.getCreators();

        if (Array.isArray(data)) {
          setCreators(data);
        }
      } catch (error) {
        console.error("Failed to fetch creators:", error);
        setCreators([]);
      }
    };

    fetchPosts();
    fetchCreators();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        setIsLoginModalOpen(false);
      } else {
        alert(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const handleCreatePost = async (postData) => {
    try {
      const response = await fetch("http://localhost:8080/api/admin/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });
      const data = await response.json();
      if (response.ok) {
        // Refresh posts
        const newPost = {
          id: data.id,
          title: postData.title,
          excerpt: postData.excerpt,
          image: postData.thumbnail_url,
          tags: ["new"],
          creatorId: "techlab",
          upvotes: 0,
          comments: 0,
          saved: false,
          hasUpvoted: false,
          createdAt: "Just now",
          readTime: "1m",
          content: postData.content,
        };
        setPosts([newPost, ...posts]);
        setIsCreateModalOpen(false);
      } else {
        alert(data.error || "Failed to create post");
      }
    } catch (error) {
      console.error("Create post error:", error);
      alert("Failed to create post");
    }
  };

  const selectedPost = posts.find((post) => post.id === selectedPostId) ?? null;
  const selectedCreator =
    creatorDirectory[selectedCreatorId ?? selectedPost?.creatorId] ??
    creatorDirectory["techlab"];

  const handleNavigate = (page) => {
    if (page === "profile") {
      setCurrentPage("profile");
      setSelectedCreatorId("mina");
      return;
    }
    if (page === "home") {
      setCurrentPage("home");
      return;
    }
    setCurrentPage(page);
  };

  const handleViewPost = (postId) => {
    const post = posts.find((item) => item.id === postId);
    if (!post) return;
    setSelectedPostId(postId);
  };

  const handleClosePost = () => {
    setSelectedPostId(null);
  };

  const handleViewCreator = (creatorId) => {
    setSelectedCreatorId(creatorId);
    setCurrentPage("profile");
    setSelectedPostId(null);
  };

  const handleToggleUpvote = (postId) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const hasUpvoted = !post.hasUpvoted;
        return {
          ...post,
          hasUpvoted,
          upvotes: post.upvotes + (hasUpvoted ? 1 : -1),
        };
      }),
    );
  };

  const handleToggleSave = (postId) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          saved: !post.saved,
        };
      }),
    );
  };

  const handleToggleFollow = (creatorId) => {
    setFollowingState((prev) => ({
      ...prev,
      [creatorId]: !prev[creatorId],
    }));
  };

  const filteredPosts = useMemo(() => posts, [posts]);

  const profilePosts = useMemo(() => {
    if (!selectedCreatorId) return [];
    return posts.filter((post) => post.creatorId === selectedCreatorId);
  }, [posts, selectedCreatorId]);

  return (
    <div className="min-h-screen bg-theme-surface text-theme-primary">
      <div className="lg:flex">
        <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
        <div className="flex min-h-screen flex-1 flex-col lg:ml-72">
          <header className="sticky top-0 z-10 border-b border-theme-border bg-theme-panel/95 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
              <div className="flex items-center gap-3 lg:hidden">
                <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-theme-border text-theme-secondary">
                  <Menu className="h-5 w-5" />
                </button>
                <span className="text-lg font-semibold text-theme-primary">Creator Hub</span>
              </div>

              <div className="flex flex-1 items-center gap-3 sm:max-w-xl">
                <div className="flex flex-1 items-center gap-2 rounded-xl border border-theme-border bg-theme-card px-3 py-2 focus-within:border-theme-accent">
                  <Search className="h-5 w-5 text-theme-muted" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm gear, creator hoặc hashtag..."
                    className="w-full bg-transparent text-sm text-theme-primary outline-none placeholder:text-theme-muted"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                {user?.role === "admin" && (
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="hidden sm:flex items-center gap-2 rounded-lg bg-theme-accent px-4 py-2 text-sm font-bold text-white hover:bg-theme-accent-hover"
                  >
                    Create Post
                  </button>
                )}

                <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-theme-border text-theme-secondary transition hover:border-theme-accent hover:text-theme-accent">
                  <Bell className="h-5 w-5" />
                </button>

                {user ? (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleLogout}
                      className="text-xs font-medium text-theme-secondary hover:text-theme-primary"
                    >
                      Logout
                    </button>
                    <button
                      onClick={() => handleNavigate("profile")}
                      className="flex items-center gap-2 rounded-full border border-theme-border bg-theme-card px-3 py-1.5 text-sm font-medium text-theme-primary transition hover:border-theme-accent hover:text-theme-accent"
                    >
                      <div className="h-7 w-7 rounded-full bg-theme-accent/20 flex items-center justify-center text-theme-accent font-bold">
                        {user.username[0].toUpperCase()}
                      </div>
                      <span className="hidden sm:inline">{user.username}</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="rounded-lg bg-theme-card px-4 py-2 text-sm font-bold text-theme-primary hover:bg-theme-border"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </header>

          <div className="flex-1 px-4 py-6 sm:px-6 lg:px-10">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center text-theme-secondary">
                Loading posts...
              </div>
            ) : (
              <>
                {currentPage === "home" && (
                  <HomePage
                    posts={filteredPosts}
                    onViewPost={handleViewPost}
                    onViewCreator={handleViewCreator}
                    onToggleUpvote={handleToggleUpvote}
                    onToggleSave={handleToggleSave}
                  />
                )}

                {currentPage === "profile" && selectedCreator && (
                  <ProfilePage
                    creator={selectedCreator}
                    posts={profilePosts}
                    isFollowing={followingState[selectedCreator.id]}
                    onToggleFollow={handleToggleFollow}
                    onViewPost={handleViewPost}
                    onToggleUpvote={handleToggleUpvote}
                    onToggleSave={handleToggleSave}
                  />
                )}

                {["explore", "bookmarks", "following"].includes(currentPage) && (
                  <div className="flex h-[60vh] flex-col items-center justify-center rounded-3xl border border-dashed border-theme-border bg-theme-card text-center">
                    <p className="text-lg font-semibold text-theme-primary">
                      Tính năng đang được phát triển
                    </p>
                    <p className="mt-2 max-w-sm text-sm text-theme-secondary">
                      Chúng tôi đang hoàn thiện trải nghiệm {currentPage}. Vui lòng quay lại bản tin để
                      khám phá review mới nhất.
                    </p>
                    <button
                      onClick={() => setCurrentPage("home")}
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-theme-accent px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-theme-accent-hover"
                    >
                      Quay lại Home
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedPost && (
        <DetailPage
          post={selectedPost}
          creator={creatorDirectory[selectedPost.creatorId] || creatorDirectory["techlab"]}
          onClose={handleClosePost}
          onViewCreator={handleViewCreator}
          onToggleUpvote={handleToggleUpvote}
          onToggleSave={handleToggleSave}
          isFollowing={followingState[selectedPost.creatorId]}
          onToggleFollow={handleToggleFollow}
        />
      )}

      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-theme-border bg-theme-panel p-6 shadow-2xl">
            <h2 className="mb-6 text-2xl font-bold text-theme-primary">Login</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleLogin(formData.get("email"), formData.get("password"));
              }}
              className="space-y-4"
            >
              <div>
                <label className="mb-1.5 block text-sm font-medium text-theme-secondary">Email</label>
                <input
                  name="email"
                  type="email"
                  defaultValue="admin@gearvn.com"
                  className="w-full rounded-lg border border-theme-border bg-theme-surface px-4 py-2.5 text-theme-primary outline-none focus:border-theme-accent"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-theme-secondary">Password</label>
                <input
                  name="password"
                  type="password"
                  defaultValue="changeme123"
                  className="w-full rounded-lg border border-theme-border bg-theme-surface px-4 py-2.5 text-theme-primary outline-none focus:border-theme-accent"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLoginModalOpen(false)}
                  className="flex-1 rounded-lg border border-theme-border bg-transparent py-2.5 font-bold text-theme-secondary hover:bg-theme-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-theme-accent py-2.5 font-bold text-white hover:bg-theme-accent-hover"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-theme-border bg-theme-panel p-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="mb-6 text-2xl font-bold text-theme-primary">Create New Post</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleCreatePost({
                  title: formData.get("title"),
                  slug: formData.get("title").toLowerCase().replace(/ /g, "-") + "-" + Date.now(),
                  excerpt: formData.get("excerpt"),
                  content: formData.get("content"),
                  thumbnail_url: formData.get("thumbnail_url"),
                  status: "published",
                  type: "article",
                  author_id: formData.get("author_id"),
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="mb-1.5 block text-sm font-medium text-theme-secondary">Title</label>
                <input
                  name="title"
                  required
                  className="w-full rounded-lg border border-theme-border bg-theme-surface px-4 py-2.5 text-theme-primary outline-none focus:border-theme-accent"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-theme-secondary">Author (Creator)</label>
                <select
                  name="author_id"
                  required
                  className="w-full rounded-lg border border-theme-border bg-theme-surface px-4 py-2.5 text-theme-primary outline-none focus:border-theme-accent"
                >
                  <option value="">Select a creator</option>
                  {creators.map((creator) => (
                    <option key={creator.id} value={creator.id}>
                      {creator.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-theme-secondary">Excerpt</label>
                <textarea
                  name="excerpt"
                  rows="2"
                  className="w-full rounded-lg border border-theme-border bg-theme-surface px-4 py-2.5 text-theme-primary outline-none focus:border-theme-accent"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-theme-secondary">Image URL</label>
                <input
                  name="thumbnail_url"
                  placeholder="https://..."
                  className="w-full rounded-lg border border-theme-border bg-theme-surface px-4 py-2.5 text-theme-primary outline-none focus:border-theme-accent"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-theme-secondary">Content</label>
                <textarea
                  name="content"
                  required
                  rows="10"
                  className="w-full rounded-lg border border-theme-border bg-theme-surface px-4 py-2.5 text-theme-primary outline-none focus:border-theme-accent"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 rounded-lg border border-theme-border bg-transparent py-2.5 font-bold text-theme-secondary hover:bg-theme-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-theme-accent py-2.5 font-bold text-white hover:bg-theme-accent-hover"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
