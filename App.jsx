import { useMemo, useState } from "react";
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
    title: "Đánh giá chi tiết RTX 4070 Super",
    excerpt:
      "Thử nghiệm 12 tựa game AAA và đo hiệu năng trên bộ máy thực tế để xem RTX 4070 Super mạnh đến đâu.",
    image:
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80",
    tags: ["review", "rtx4070", "gaming"],
    creatorId: "mina",
    upvotes: 128,
    comments: 26,
    saved: false,
    hasUpvoted: false,
    externalUrl: "https://www.youtube.com/watch?v=example4070",
    createdAt: "2 giờ trước",
  },
  {
    id: 2,
    title: "Set up góc livestream với Elgato Wave XLR",
    excerpt:
      "Sở hữu âm thanh chuyên nghiệp trong không gian nhỏ với giải pháp Wave XLR và mic dynamic.",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80",
    tags: ["livestream", "audio", "gear"],
    creatorId: "techlab",
    upvotes: 94,
    comments: 14,
    saved: true,
    hasUpvoted: true,
    externalUrl: "https://www.youtube.com/watch?v=examplewave",
    createdAt: "4 giờ trước",
  },
  {
    id: 3,
    title: "Build PC 60 triệu cho nhà sáng tạo nội dung 4K",
    excerpt:
      "Danh sách linh kiện tối ưu ngân sách 60 triệu cho nhu cầu dựng video 4K và livestream.",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    tags: ["pcbuild", "workstation", "creator"],
    creatorId: "hydro",
    upvotes: 211,
    comments: 37,
    saved: false,
    hasUpvoted: false,
    externalUrl: "https://www.youtube.com/watch?v=examplebuild",
    createdAt: "Hôm qua",
  },
  {
    id: 4,
    title: "So sánh nhanh mic Shure MV7 vs Rode PodMic",
    excerpt:
      "Hai lựa chọn phổ biến cho podcast: so sánh chất âm, độ tiện dụng và phụ kiện đi kèm.",
    image:
      "https://images.unsplash.com/photo-1590608897129-79da98d159d8?auto=format&fit=crop&w=800&q=80",
    tags: ["podcast", "microphone", "review"],
    creatorId: "techlab",
    upvotes: 76,
    comments: 9,
    saved: false,
    hasUpvoted: false,
    externalUrl: "https://www.youtube.com/watch?v=examplemic",
    createdAt: "2 ngày trước",
  },
  {
    id: 5,
    title: "Setup desk tour 2024: tối giản nhưng hiệu năng",
    excerpt:
      "Chia sẻ góc làm việc mới với màn hình 34 inch, stream deck và giải pháp ánh sáng mềm.",
    image:
      "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=800&q=80",
    tags: ["desktour", "workspace", "gear"],
    creatorId: "mina",
    upvotes: 182,
    comments: 48,
    saved: true,
    hasUpvoted: true,
    externalUrl: "https://www.youtube.com/watch?v=exampledesk",
    createdAt: "3 ngày trước",
  },
];

const formatNumber = (value) =>
  new Intl.NumberFormat("vi-VN", { notation: "compact", compactDisplay: "short" }).format(value);

const Sidebar = ({ currentPage, onNavigate }) => {
  return (
    <aside className="hidden border-r border-gray-200 bg-white px-6 py-8 lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
          <UserCircle className="h-6 w-6" />
        </div>
        <div>
          <p className="text-lg font-semibold">GearVN Creator Hub</p>
          <p className="text-sm text-gray-500">Không gian của reviewer Việt</p>
        </div>
      </div>

      <nav className="mt-10 flex flex-1 flex-col gap-1">
        {navItems.map(({ label, icon: Icon, page }) => {
          const isActive = currentPage === page || (page === "profile" && currentPage === "profile");
          return (
            <button
              key={label}
              onClick={() => onNavigate(page)}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="rounded-xl bg-blue-50 p-4">
        <p className="text-sm font-semibold text-blue-700">Gợi ý</p>
        <p className="mt-2 text-sm text-blue-600">
          Tham gia cộng đồng Creator Hub để kết nối với reviewer hàng đầu.
        </p>
      </div>
    </aside>
  );
};

const Header = ({ onNavigateProfile }) => {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3 lg:hidden">
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600">
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-lg font-semibold text-gray-900">Creator Hub</span>
        </div>

        <div className="flex flex-1 items-center gap-3 sm:max-w-xl">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 focus-within:border-blue-500">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm gear, creator hoặc hashtag..."
              className="w-full bg-transparent text-sm text-gray-700 outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-blue-200 hover:text-blue-600">
            <Bell className="h-5 w-5" />
          </button>
          <button
            onClick={onNavigateProfile}
            className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-blue-200 hover:text-blue-600"
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
    <article className="mb-6 break-inside-avoid rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center gap-3 px-5 py-4">
        <img src={creator.avatar} alt={creator.name} className="h-9 w-9 rounded-full object-cover" />
        <div>
          <button
            onClick={() => onViewCreator(creator.id)}
            className="text-sm font-semibold text-gray-900 hover:text-blue-600"
          >
            {creator.name}
          </button>
          <p className="text-xs text-gray-500">{post.createdAt}</p>
        </div>
      </div>

      <button onClick={() => onViewPost(post.id)} className="w-full text-left">
        {post.image && (
          <div className="h-48 w-full overflow-hidden border-y border-gray-200">
            <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
          </div>
        )}
        <div className="px-5 py-4">
          <h3 className="text-lg font-semibold text-gray-900 transition hover:text-blue-600">
            {post.title}
          </h3>
          {post.excerpt && <p className="mt-2 text-sm text-gray-600">{post.excerpt}</p>}
        </div>
      </button>

      <div className="px-5 pb-4">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <button
            onClick={() => onToggleUpvote(post.id)}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              post.hasUpvoted
                ? "border-blue-100 bg-blue-50 text-blue-600"
                : "border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600"
            }`}
          >
            <ArrowUp className="h-4 w-4" />
            {post.upvotes}
          </button>

          <div className="flex items-center gap-3 text-gray-500">
            <button
              onClick={() => onToggleSave(post.id)}
              className={`inline-flex items-center gap-2 text-sm transition ${
                post.saved ? "text-blue-600" : "hover:text-blue-600"
              }`}
            >
              <BookmarkIcon className={`h-4 w-4 ${post.saved ? "fill-current" : ""}`} />
              Lưu
            </button>
            <button className="inline-flex items-center gap-2 text-sm hover:text-blue-600">
              <MessageCircle className="h-4 w-4" />
              {post.comments}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

const HomePage = ({ posts, onViewPost, onViewCreator, onToggleUpvote, onToggleSave }) => {
  return (
    <section>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bản tin nổi bật</h1>
          <p className="mt-1 text-sm text-gray-500">
            Cập nhật review mới nhất từ cộng đồng GearVN Creator.
          </p>
        </div>
        <button className="hidden items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:flex">
          Đăng review
        </button>
      </div>

      <div className="mt-8 columns-1 gap-6 sm:columns-2 xl:columns-3">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            creator={creatorDirectory[post.creatorId]}
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

const DetailPage = ({ post, creator, onViewCreator, onToggleUpvote, onToggleSave }) => {
  if (!post) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">
        Chọn một bài viết để xem chi tiết.
      </div>
    );
  }

  return (
    <article className="max-w-3xl space-y-6">
      <div>
        <button
          onClick={() => onViewCreator(creator.id)}
          className="inline-flex items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 transition hover:border-blue-200 hover:text-blue-600"
        >
          <img src={creator.avatar} alt={creator.name} className="h-8 w-8 rounded-full object-cover" />
          <div className="text-left">
            <p className="font-semibold text-gray-900">{creator.name}</p>
            <p className="text-xs text-gray-500">Xem profile</p>
          </div>
        </button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
        <p className="mt-3 text-sm text-gray-500">
          Xuất bản {post.createdAt} · {post.tags.map((tag) => `#${tag}`).join(" ")}
        </p>
      </div>

      {post.image && (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <img src={post.image} alt={post.title} className="w-full object-cover" />
        </div>
      )}

      <p className="text-base leading-relaxed text-gray-700">
        {post.excerpt ||
          "Bài review cung cấp góc nhìn chi tiết về trải nghiệm sản phẩm thực tế, kèm thông số benchmark và các mẹo tối ưu cho creator."}
      </p>

      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <a
          href={post.externalUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <LinkIcon className="h-4 w-4" />
          Xem bài review gốc tại kênh của creator
        </a>
        <button
          onClick={() => onToggleUpvote(post.id)}
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
            post.hasUpvoted
              ? "border-blue-100 bg-blue-50 text-blue-600"
              : "border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600"
          }`}
        >
          <ArrowUp className="h-4 w-4" />
          Ủng hộ · {post.upvotes}
        </button>
        <button
          onClick={() => onToggleSave(post.id)}
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
            post.saved
              ? "border-blue-100 bg-blue-50 text-blue-600"
              : "border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600"
          }`}
        >
          <BookmarkIcon className={`h-4 w-4 ${post.saved ? "fill-current" : ""}`} />
          {post.saved ? "Đã lưu" : "Lưu bài"}
        </button>
      </div>
    </article>
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
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
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
              className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-md"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{creator.name}</h2>
              <p className="text-sm text-gray-500">{creator.bio}</p>
            </div>
          </div>
          <div className="flex flex-1 flex-wrap items-center justify-between gap-4">
            <div className="flex gap-6 text-sm text-gray-600">
              <div>
                <p className="font-semibold text-gray-900">{posts.length}</p>
                <p>Bài viết</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{formatNumber(followerCount)}</p>
                <p>Người theo dõi</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {formatNumber(creator.followingCount)}
                </p>
                <p>Đang theo dõi</p>
              </div>
            </div>
            <button
              onClick={() => onToggleFollow(creator.id)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${
                isFollowing
                  ? "border border-blue-200 bg-blue-50 text-blue-600"
                  : "bg-blue-600 text-white hover:bg-blue-700"
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
            <h3 className="text-lg font-semibold text-gray-900">Bài viết</h3>
            <p className="text-sm text-gray-500">Tổng hợp review mới nhất từ {creator.name}.</p>
          </div>
          <div className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-500">
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
              onViewCreator={() => {}}
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
  const [posts, setPosts] = useState(initialPosts);
  const [selectedPostId, setSelectedPostId] = useState(initialPosts[0]?.id ?? null);
  const [selectedCreatorId, setSelectedCreatorId] = useState(initialPosts[0]?.creatorId ?? null);
  const [followingState, setFollowingState] = useState(() => {
    const initial = {};
    Object.keys(creatorDirectory).forEach((id) => {
      initial[id] = id === "mina";
    });
    return initial;
  });

  const selectedPost = posts.find((post) => post.id === selectedPostId) ?? null;
  const selectedCreator =
    creatorDirectory[selectedCreatorId ?? selectedPost?.creatorId] ??
    creatorDirectory[initialPosts[0].creatorId];

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
    setSelectedCreatorId(post.creatorId);
    setCurrentPage("detail");
  };

  const handleViewCreator = (creatorId) => {
    setSelectedCreatorId(creatorId);
    setCurrentPage("profile");
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
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="lg:flex">
        <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
        <div className="flex min-h-screen flex-1 flex-col lg:ml-72">
          <Header onNavigateProfile={() => handleNavigate("profile")} />
          <div className="flex-1 px-4 py-6 sm:px-6 lg:px-10">
            {currentPage === "home" && (
              <HomePage
                posts={filteredPosts}
                onViewPost={handleViewPost}
                onViewCreator={handleViewCreator}
                onToggleUpvote={handleToggleUpvote}
                onToggleSave={handleToggleSave}
              />
            )}

            {currentPage === "detail" && selectedPost && (
              <DetailPage
                post={selectedPost}
                creator={creatorDirectory[selectedPost.creatorId]}
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
              <div className="flex h-[60vh] flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white text-center">
                <p className="text-lg font-semibold text-gray-900">
                  Tính năng đang được phát triển
                </p>
                <p className="mt-2 max-w-sm text-sm text-gray-500">
                  Chúng tôi đang hoàn thiện trải nghiệm {currentPage}. Vui lòng quay lại bản tin để
                  khám phá review mới nhất.
                </p>
                <button
                  onClick={() => setCurrentPage("home")}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  Quay lại Home
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
