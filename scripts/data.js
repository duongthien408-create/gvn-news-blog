const creators = [
  {
    id: "ux-planet",
    name: "UX Planet",
    initials: "UX",
    badge: "border border-rose-500/40 bg-rose-500/10 text-rose-200",
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=facearea&w=200&h=200&q=80",
    banner:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80",
    bio: "Nguồn tổng hợp insight UX/UI, nghiên cứu người dùng và chiến lược trải nghiệm số mới nhất.",
    tags: ["ux", "ui", "research", "career"],
    followers: 92800,
    following: 184,
    similar: ["designops-vn", "workflow-daily", "pixel-stories", "creator-lab"],
  },
  {
    id: "gearvn-studio",
    name: "GearVN Studio",
    initials: "GV",
    badge: "border border-red-500/40 bg-red-500/10 text-red-200",
    avatar:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=facearea&w=200&h=200&q=80",
    banner:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80",
    bio: "Review phần cứng, thiết bị và workflow sản xuất nội dung dành cho creator Việt.",
    tags: ["hardware", "review", "workflow", "rtx"],
    followers: 67800,
    following: 132,
    similar: ["streammaster", "render-vn", "creator-lab", "pixel-stories"],
  },
  {
    id: "creator-lab",
    name: "Creator Lab",
    initials: "CL",
    badge: "border border-green-500/40 bg-green-500/10 text-emerald-200",
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=facearea&w=200&h=200&q=80",
    banner:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80",
    bio: "Phòng thí nghiệm chiến lược nội dung đa nền tảng, nghiên cứu hành vi và mô hình tăng trưởng.",
    tags: ["strategy", "short-form", "marketing", "automation"],
    followers: 58200,
    following: 205,
    similar: ["workflow-daily", "ux-planet", "gearvn-studio"],
  },
  {
    id: "render-vn",
    name: "RenderVN",
    initials: "R",
    badge: "border border-purple-500/40 bg-purple-500/10 text-purple-200",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=facearea&w=200&h=200&q=80",
    banner:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1400&q=80",
    bio: "Studio hậu kỳ chuyên sâu: màu sắc, dựng phim và pipeline phát sóng cho streamer.",
    tags: ["video-editing", "color-grading", "gear", "workflow"],
    followers: 47200,
    following: 118,
    similar: ["gearvn-studio", "streammaster", "designops-vn"],
  },
  {
    id: "workflow-daily",
    name: "Workflow Daily",
    initials: "WD",
    badge: "border border-amber-500/40 bg-amber-500/10 text-amber-200",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&w=200&h=200&q=80",
    banner:
      "https://images.unsplash.com/photo-1527443224154-d9163d91f7d4?auto=format&fit=crop&w=1400&q=80",
    bio: "Daily tips về tối ưu quy trình, tự động hoá và quản lý dự án cho nhà sáng tạo nội dung.",
    tags: ["automation", "productivity", "ai-tools", "management"],
    followers: 52100,
    following: 164,
    similar: ["creator-lab", "ux-planet", "designops-vn"],
  },
  {
    id: "streammaster",
    name: "StreamMaster",
    initials: "SM",
    badge: "border border-cyan-500/40 bg-cyan-500/10 text-cyan-200",
    avatar:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=facearea&w=200&h=200&q=80",
    banner:
      "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1400&q=80",
    bio: "Giải pháp livestream đa nền tảng, setup studio và tối ưu âm thanh hình ảnh chuyên nghiệp.",
    tags: ["livestream", "audio", "lighting", "gear"],
    followers: 43800,
    following: 95,
    similar: ["gearvn-studio", "render-vn", "creator-lab"],
  },
  {
    id: "designops-vn",
    name: "DesignOps VN",
    initials: "DO",
    badge: "border border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-200",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=facearea&w=200&h=200&q=80",
    banner:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1400&q=80",
    bio: "Quản trị hệ thống thiết kế và mở rộng đội ngũ sản xuất nội dung ở quy mô lớn.",
    tags: ["design-system", "ops", "career", "leadership"],
    followers: 38900,
    following: 143,
    similar: ["ux-planet", "workflow-daily", "pixel-stories"],
  },
  {
    id: "pixel-stories",
    name: "Pixel Stories",
    initials: "PS",
    badge: "border border-orange-500/40 bg-orange-500/10 text-orange-200",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&w=200&h=200&q=80",
    banner:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80",
    bio: "Chia sẻ góc nhìn kể chuyện bằng hình ảnh, nhiếp ảnh sản phẩm và kỹ thuật ánh sáng.",
    tags: ["photography", "lighting", "storytelling", "setup"],
    followers: 34700,
    following: 121,
    similar: ["render-vn", "gearvn-studio", "streammaster"],
  },
];

const posts = [
  {
    id: "gear-rtx4070",
    creatorId: "gearvn-studio",
    title: "Đánh giá chi tiết RTX 4070 Super",
    summary:
      "Benchmark 12 tựa game AAA và workflow dựng video 8K để tìm ra giới hạn của RTX 4070 Super trên build GearVN.",
    tags: ["review", "rtx4070", "gaming"],
    time: "Nov 02 • 6m đọc",
    image:
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=900&q=80",
    upvotes: 182,
    comments: 41,
    saves: 96,
    shares: 18,
  },
  {
    id: "gear-desk-setup",
    creatorId: "gearvn-studio",
    title: "Desk setup 2024 tối giản nhưng hiệu năng",
    summary:
      "Checklist thiết bị và cách bố trí ánh sáng, âm thanh, phụ kiện để tối ưu desk studio trong 8 m².",
    tags: ["setup", "workspace", "gear"],
    time: "Oct 28 • 7m đọc",
    image:
      "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=900&q=80",
    upvotes: 204,
    comments: 38,
    saves: 122,
    shares: 24,
  },
  {
    id: "streammaster-audio-chain",
    creatorId: "streammaster",
    title: "Audio chain sạch cho livestream đa nền tảng",
    summary:
      "So sánh GOXLR Mini và Rode Streamer X, cách routing âm thanh, chống hú và mix nhạc intro/outro.",
    tags: ["audio", "livestream", "gear"],
    time: "Nov 05 • 5m đọc",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    upvotes: 158,
    comments: 19,
    saves: 74,
    shares: 12,
  },
  {
    id: "streammaster-lighting",
    creatorId: "streammaster",
    title: "Đèn key & fill cho phòng livestream nhỏ",
    summary:
      "Ba cấu hình ánh sáng nâng cấp từ budget tới pro, kèm preset nhiệt độ màu cho từng hoàn cảnh.",
    tags: ["lighting", "studio", "livestream"],
    time: "Oct 30 • 6m đọc",
    image:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=900&q=80",
    upvotes: 131,
    comments: 23,
    saves: 69,
    shares: 11,
  },
  {
    id: "rendervn-color-pipeline",
    creatorId: "render-vn",
    title: "Pipeline color grading cinematic trong DaVinci",
    summary:
      "Hướng dẫn LUT, node tree và quản lý project để dựng chuỗi video cinematic consistency trên DaVinci Resolve.",
    tags: ["color-grading", "davinci", "video-editing"],
    time: "Nov 03 • 8m đọc",
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80",
    upvotes: 246,
    comments: 52,
    saves: 132,
    shares: 29,
  },
  {
    id: "rendervn-fast-edit",
    creatorId: "render-vn",
    title: "Tối ưu render real-time cho Premiere & After Effects",
    summary:
      "Kinh nghiệm set cache, dùng proxy và kết hợp GPU giúp rút ngắn 40% thời gian xuất bản của RenderVN.",
    tags: ["premiere", "after-effects", "workflow"],
    time: "Oct 26 • 9m đọc",
    image:
      "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=900&q=80",
    upvotes: 198,
    comments: 34,
    saves: 88,
    shares: 16,
  },
  {
    id: "uxplanet-ai-handbook",
    creatorId: "ux-planet",
    title: "Handbook thiết kế trải nghiệm AI-first",
    summary:
      "Tổng hợp pattern, guideline và checklist đánh giá AI assistant trong sản phẩm số.",
    tags: ["ux", "ai-tools", "handbook"],
    time: "Nov 01 • 10m đọc",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
    upvotes: 221,
    comments: 48,
    saves: 140,
    shares: 33,
  },
  {
    id: "uxplanet-usability-review",
    creatorId: "ux-planet",
    title: "Checklist usability testing cho fintech app",
    summary:
      "15 bước kiểm thử, template ghi chú và chỉ số cần tracking dành cho team fintech vừa scale.",
    tags: ["ux", "usability", "testing"],
    time: "Oct 29 • 7m đọc",
    image:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80",
    upvotes: 176,
    comments: 27,
    saves: 91,
    shares: 17,
  },
  {
    id: "workflow-automation",
    creatorId: "workflow-daily",
    title: "Automation Notion + Zapier cho lịch phát hành",
    summary:
      "Thiết lập pipeline nhận brief, phân công editor và tracking live status bằng Notion API & Zapier.",
    tags: ["automation", "workflow", "notion"],
    time: "Nov 04 • 6m đọc",
    image:
      "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=900&q=80",
    upvotes: 167,
    comments: 21,
    saves: 105,
    shares: 19,
  },
  {
    id: "workflow-ai-coach",
    creatorId: "workflow-daily",
    title: "Dùng AI coach để review nội dung trước khi xuất bản",
    summary:
      "Quy trình xây dựng prompt, cấu trúc feedback và checklist QA giúp tăng tốc vòng duyệt nội dung.",
    tags: ["ai-tools", "productivity", "qa"],
    time: "Oct 27 • 5m đọc",
    image:
      "https://images.unsplash.com/photo-1587614295999-6c0c1c1a6f4d?auto=format&fit=crop&w=900&q=80",
    upvotes: 143,
    comments: 18,
    saves: 77,
    shares: 14,
  },
  {
    id: "creator-shortform-engine",
    creatorId: "creator-lab",
    title: "Engine sản xuất short-form 15 phút/clip",
    summary:
      "Thiết lập đội hình, storyboard mẫu và workflow repurpose để xuất bản 6 clip/ngày.",
    tags: ["short-form", "strategy", "workflow"],
    time: "Oct 31 • 8m đọc",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
    upvotes: 189,
    comments: 32,
    saves: 98,
    shares: 21,
  },
  {
    id: "pixel-lighting-preset",
    creatorId: "pixel-stories",
    title: "Preset ánh sáng giúp sản phẩm nổi bật trong 5 phút",
    summary:
      "3 preset ánh sáng và vật liệu phản quang giúp sản phẩm nhỏ nổi bật mà không cần studio lớn.",
    tags: ["photography", "lighting", "setup"],
    time: "Nov 06 • 4m đọc",
    image:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80",
    upvotes: 156,
    comments: 17,
    saves: 83,
    shares: 13,
  },
];

export const getAllPosts = () =>
  posts.map((post) => ({
    ...post,
    creator: getCreatorById(post.creatorId),
  }));

export const getPostById = (id) => {
  const post = posts.find((item) => String(item.id) === String(id));
  return post ? { ...post, creator: getCreatorById(post.creatorId) } : null;
};

export const getCreatorPosts = (creatorId) =>
  posts
    .filter((post) => post.creatorId === creatorId)
    .map((post) => ({
      ...post,
      creator: getCreatorById(post.creatorId),
    }));

export const sampleComments = () =>
  [
    {
      name: "Fabian Letch",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&w=120&h=120&q=80",
      time: "2 giờ trước",
      comment:
        "Thử nghiệm thực tế rất chi tiết. Mình thích phần so sánh preset và workflow, giúp đưa ra lựa chọn rõ ràng.",
      likes: 42,
    },
    {
      name: "Charlotte Hudson",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&w=120&h=120&q=80",
      time: "4 giờ trước",
      comment:
        "Chiến lược tối ưu chi phí này sẽ rất hữu ích cho team nhỏ. Cảm ơn vì chia sẻ checklist cụ thể!",
      likes: 35,
    },
    {
      name: "Kyle McFerrin",
      avatar:
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=facearea&w=120&h=120&q=80",
      time: "Hôm qua",
      comment:
        "Mình đã áp dụng workflow tương tự và thấy tốc độ xử lý tăng đáng kể. Bài viết tổng hợp rất chuẩn.",
      likes: 28,
    },
    {
      name: "Martina Owusu",
      avatar:
        "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=facearea&w=120&h=120&q=80",
      time: "1 ngày trước",
      comment:
        "Đề xuất setup ánh sáng rất hợp lý cho phòng nhỏ. Mong bạn chia sẻ thêm preset color grading!",
      likes: 18,
    },
    {
      name: "Huy Bùi",
      avatar:
        "https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=facearea&w=120&h=120&q=80",
      time: "3 ngày trước",
      comment: "Benchmark cực kỳ hữu ích. Mình sẽ thử áp dụng pipeline render mà bạn giới thiệu.",
      likes: 22,
    },
    {
      name: "Lan Lê",
      avatar:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=facearea&w=120&h=120&q=80",
      time: "5 ngày trước",
      comment:
        "Phần automation giúp tiết kiệm rất nhiều thời gian. Cám ơn bạn đã chia sẻ chi tiết từng bước.",
      likes: 15,
    },
  ]
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

export const getAllCreators = () => creators;

export const getCreatorById = (id) => creators.find((creator) => creator.id === id) ?? null;

export const getCreatorsByIds = (ids = []) =>
  ids
    .map((creatorId) => getCreatorById(creatorId))
    .filter(Boolean)
    .map((creator) => ({
      id: creator.id,
      name: creator.name,
      initials: creator.initials,
      badge: creator.badge,
      avatar: creator.avatar,
    }));

export const formatNumber = (value) =>
  new Intl.NumberFormat("vi-VN", { notation: "compact", compactDisplay: "short" }).format(value);

export { creators };
