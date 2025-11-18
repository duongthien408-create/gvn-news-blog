// User Profile Page - Using Supabase REST API
const API_CONFIG = {
  supabase: {
    url: 'https://qibhlrsdykpkbsnelubz.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYmhscnNkeWtwa2JzbmVsdWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNDc4NzEsImV4cCI6MjA3NzkyMzg3MX0.jmwZ8r_7dC8fU5hIlgXrFZUpJBxE07bZyBEuLoG1SrM'
  }
};

const params = new URLSearchParams(window.location.search);
const username = params.get("user") ?? "";
const container = document.getElementById("profile-root");

let currentUser = null;
let currentTab = 'posts';

// ============ API FUNCTIONS ============

async function supabaseRequest(endpoint, options = {}) {
  const url = `${API_CONFIG.supabase.url}/rest/v1${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'apikey': API_CONFIG.supabase.key,
      'Authorization': `Bearer ${API_CONFIG.supabase.key}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${error}`);
  }

  return await response.json();
}

async function getUserByUsername(username) {
  const users = await supabaseRequest(`/users?username=eq.${username}&select=*`);
  return users[0] || null;
}

async function getUserPosts(userId) {
  try {
    // Convert userId to string because creator_id is VARCHAR
    const posts = await supabaseRequest(`/posts?creator_id=eq.${userId.toString()}&order=created_at.desc`);
    return posts;
  } catch (error) {
    console.warn('Posts query failed, user might not have posts yet:', error);
    return [];
  }
}

async function getUserSavedPosts(userId) {
  try {
    const saved = await supabaseRequest(`/user_saved_posts?user_id=eq.${userId}&select=post_id,posts(*)`);
    return saved.map(s => s.posts).filter(Boolean);
  } catch (error) {
    console.warn('Saved posts query failed:', error);
    return [];
  }
}

async function getUserUpvotedPosts(userId) {
  try {
    const upvoted = await supabaseRequest(`/user_upvotes?user_id=eq.${userId}&select=post_id`);
    const postIds = upvoted.map(u => u.post_id);
    if (postIds.length === 0) return [];

    const posts = await supabaseRequest(`/posts?id=in.(${postIds.join(',')})&order=created_at.desc`);
    return posts;
  } catch (error) {
    console.warn('Upvoted posts query failed:', error);
    return [];
  }
}

async function getUserFollowers(userId) {
  try {
    const followers = await supabaseRequest(`/user_followers?following_id=eq.${userId}&select=follower_id,users!follower_id(*)`);
    return followers.map(f => f.users).filter(Boolean);
  } catch (error) {
    console.warn('Followers query failed:', error);
    return [];
  }
}

async function getUserFollowing(userId) {
  try {
    const following = await supabaseRequest(`/user_followers?follower_id=eq.${userId}&select=following_id,users!following_id(*)`);
    return following.map(f => f.users).filter(Boolean);
  } catch (error) {
    console.warn('Following query failed:', error);
    return [];
  }
}

async function getCompanyById(companyId) {
  try {
    const companies = await supabaseRequest(`/companies?id=eq.${companyId}&select=*`);
    return companies[0] || null;
  } catch (error) {
    console.warn('Company query failed:', error);
    return null;
  }
}

async function followUser(followerId, followingId) {
  return await supabaseRequest(`/user_followers`, {
    method: 'POST',
    body: JSON.stringify({ follower_id: followerId, following_id: followingId })
  });
}

async function unfollowUser(followerId, followingId) {
  return await supabaseRequest(`/user_followers?follower_id=eq.${followerId}&following_id=eq.${followingId}`, {
    method: 'DELETE'
  });
}

async function checkIsFollowing(followerId, followingId) {
  try {
    const result = await supabaseRequest(`/user_followers?follower_id=eq.${followerId}&following_id=eq.${followingId}`);
    return result.length > 0;
  } catch (error) {
    return false;
  }
}

// ============ RENDER FUNCTIONS ============

function renderFallback() {
  if (!container) return;
  container.innerHTML = `
    <section class="mx-auto max-w-2xl rounded-3xl border border-slate-800 bg-hub-panel/80 p-10 text-center text-slate-300">
      <h1 class="text-2xl font-semibold text-white">Không tìm thấy người dùng</h1>
      <p class="mt-3 text-sm text-slate-400">
        Tài khoản không tồn tại hoặc đã bị xóa. Hãy quay lại trang chủ.
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

  if (window.lucide?.createIcons) {
    window.lucide.createIcons();
  }
}

function renderProfileHeader(user, company, isOwnProfile, isFollowing) {
  const avatar = user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=3b82f6&color=fff&size=256`;

  return `
    <section class="relative overflow-hidden rounded-3xl border border-slate-800 bg-hub-panel/80">
      <!-- Cover Image -->
      <div class="h-48 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-red-500/20"></div>

      <!-- Profile Info -->
      <div class="relative px-8 pb-8">
        <!-- Avatar -->
        <div class="absolute -top-16 left-8">
          <img
            src="${avatar}"
            alt="${user.full_name || user.username}"
            class="h-32 w-32 rounded-3xl border-4 border-hub-panel object-cover"
          />
          ${user.is_verified ? `
            <div class="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 border-2 border-hub-panel">
              <i data-lucide="check" class="h-4 w-4 text-white"></i>
            </div>
          ` : ''}
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-4">
          ${isOwnProfile ? `
            <button
              data-action="edit-profile"
              class="flex items-center gap-2 rounded-full border border-slate-700 bg-hub-card px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-hub-card/80"
            >
              <i data-lucide="edit-2" class="h-4 w-4"></i>
              Edit Profile
            </button>
          ` : `
            <button
              data-action="follow-user"
              data-user-id="${user.id}"
              data-following="${isFollowing}"
              class="flex items-center gap-2 rounded-full ${isFollowing ? 'border border-slate-700 bg-hub-card text-slate-200' : 'bg-blue-500 text-white'} px-4 py-2 text-sm font-semibold transition hover:opacity-90"
            >
              <i data-lucide="${isFollowing ? 'user-check' : 'user-plus'}" class="h-4 w-4"></i>
              ${isFollowing ? 'Following' : 'Follow'}
            </button>
          `}
        </div>

        <!-- User Info -->
        <div class="mt-4 space-y-3">
          <div>
            <h1 class="text-2xl font-bold text-white">${user.full_name || user.username}</h1>
            <p class="text-sm text-slate-400">@${user.username}</p>
          </div>

          ${user.bio ? `
            <p class="text-slate-300">${user.bio}</p>
          ` : ''}

          ${user.job_title && company ? `
            <div class="flex items-center gap-2 text-sm text-slate-400">
              <i data-lucide="briefcase" class="h-4 w-4"></i>
              <span>${user.job_title} at</span>
              <a href="company.html?slug=${company.slug}" class="font-medium text-blue-400 hover:underline">${company.name}</a>
            </div>
          ` : ''}

          ${user.location ? `
            <div class="flex items-center gap-2 text-sm text-slate-400">
              <i data-lucide="map-pin" class="h-4 w-4"></i>
              <span>${user.location}</span>
            </div>
          ` : ''}

          ${user.website ? `
            <div class="flex items-center gap-2 text-sm">
              <i data-lucide="link" class="h-4 w-4 text-slate-400"></i>
              <a href="${user.website}" target="_blank" class="text-blue-400 hover:underline">${user.website}</a>
            </div>
          ` : ''}

          <!-- Social Links -->
          <div class="flex gap-3">
            ${user.twitter_url ? `<a href="${user.twitter_url}" target="_blank" class="text-slate-400 hover:text-blue-400"><i data-lucide="twitter" class="h-5 w-5"></i></a>` : ''}
            ${user.facebook_url ? `<a href="${user.facebook_url}" target="_blank" class="text-slate-400 hover:text-blue-400"><i data-lucide="facebook" class="h-5 w-5"></i></a>` : ''}
            ${user.linkedin_url ? `<a href="${user.linkedin_url}" target="_blank" class="text-slate-400 hover:text-blue-400"><i data-lucide="linkedin" class="h-5 w-5"></i></a>` : ''}
            ${user.github_url ? `<a href="${user.github_url}" target="_blank" class="text-slate-400 hover:text-gray-300"><i data-lucide="github" class="h-5 w-5"></i></a>` : ''}
            ${user.youtube_url ? `<a href="${user.youtube_url}" target="_blank" class="text-slate-400 hover:text-red-400"><i data-lucide="youtube" class="h-5 w-5"></i></a>` : ''}
          </div>

          <!-- Stats -->
          <div class="flex gap-6 text-sm">
            <div>
              <span class="font-semibold text-white">${user.posts_count || 0}</span>
              <span class="text-slate-400"> Posts</span>
            </div>
            <button data-tab="followers" class="hover:underline">
              <span class="font-semibold text-white">${user.followers_count || 0}</span>
              <span class="text-slate-400"> Followers</span>
            </button>
            <button data-tab="following" class="hover:underline">
              <span class="font-semibold text-white">${user.following_count || 0}</span>
              <span class="text-slate-400"> Following</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderTabs(isOwnProfile) {
  const tabs = [
    { id: 'posts', label: 'Posts', icon: 'file-text' },
    { id: 'following', label: 'Following', icon: 'user-check' },
  ];

  if (isOwnProfile) {
    tabs.push(
      { id: 'saved', label: 'Saved', icon: 'bookmark' },
      { id: 'upvoted', label: 'Upvoted', icon: 'thumbs-up' }
    );
  }

  return `
    <div class="flex gap-2 border-b border-slate-800">
      ${tabs.map(tab => `
        <button
          data-tab="${tab.id}"
          class="tab-button flex items-center gap-2 px-4 py-3 text-sm font-medium transition ${currentTab === tab.id ? 'border-b-2 border-blue-500 text-blue-400' : 'text-slate-400 hover:text-slate-200'}"
        >
          <i data-lucide="${tab.icon}" class="h-4 w-4"></i>
          ${tab.label}
        </button>
      `).join('')}
    </div>
  `;
}

function renderPostCard(post) {
  return `
    <article class="rounded-2xl border border-slate-800 bg-hub-card/50 p-6 transition hover:border-slate-700">
      <div class="flex items-start gap-4">
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-white hover:text-blue-400">
            <a href="detail.html?id=${post.id}">${post.title}</a>
          </h3>
          ${post.summary ? `<p class="mt-2 text-sm text-slate-400">${post.summary}</p>` : ''}
          <div class="mt-4 flex items-center gap-4 text-sm text-slate-500">
            <span>${new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
            ${post.upvotes ? `<span class="flex items-center gap-1"><i data-lucide="thumbs-up" class="h-3 w-3"></i> ${post.upvotes}</span>` : ''}
            ${post.comments_count ? `<span class="flex items-center gap-1"><i data-lucide="message-circle" class="h-3 w-3"></i> ${post.comments_count}</span>` : ''}
          </div>
        </div>
        ${post.video_thumbnail ? `
          <img src="${post.video_thumbnail}" alt="${post.title}" class="h-20 w-32 rounded-lg object-cover" />
        ` : ''}
      </div>
    </article>
  `;
}

function renderUserCard(user) {
  const avatar = user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=3b82f6&color=fff&size=128`;

  return `
    <article class="rounded-2xl border border-slate-800 bg-hub-card/50 p-4 transition hover:border-slate-700">
      <div class="flex items-center gap-3">
        <img src="${avatar}" alt="${user.username}" class="h-12 w-12 rounded-full object-cover" />
        <div class="flex-1">
          <a href="profile.html?user=${user.username}" class="font-semibold text-white hover:text-blue-400">
            ${user.full_name || user.username}
          </a>
          <p class="text-sm text-slate-400">@${user.username}</p>
        </div>
      </div>
    </article>
  `;
}

function renderTabContent(content) {
  return `
    <div id="tab-content" class="space-y-4">
      ${content}
    </div>
  `;
}

// ============ MAIN LOGIC ============

async function loadProfile() {
  if (!username || !container) {
    renderFallback();
    return;
  }

  try {
    // Show loading
    container.innerHTML = `
      <div class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-slate-800 border-t-blue-500"></div>
          <p class="text-slate-400">Loading profile...</p>
        </div>
      </div>
    `;

    const user = await getUserByUsername(username);
    if (!user) {
      renderFallback();
      return;
    }

    currentUser = user;

    // Get company info if user has one
    let company = null;
    if (user.company_id) {
      company = await getCompanyById(user.company_id);
    }

    // Check if viewing own profile
    const loggedInUser = window.api?.getUser();
    const isOwnProfile = loggedInUser && loggedInUser.id === user.id;

    // Check if following
    let isFollowing = false;
    if (loggedInUser && !isOwnProfile) {
      isFollowing = await checkIsFollowing(loggedInUser.id, user.id);
    }

    // Load initial posts
    const posts = await getUserPosts(user.id);

    // Render profile
    container.innerHTML = `
      ${renderProfileHeader(user, company, isOwnProfile, isFollowing)}
      <div class="mt-8 rounded-3xl border border-slate-800 bg-hub-panel/80">
        ${renderTabs(isOwnProfile)}
        <div class="p-6">
          ${renderTabContent(posts.length > 0 ? posts.map(renderPostCard).join('') : '<p class="text-center text-slate-400">No posts yet</p>')}
        </div>
      </div>
    `;

    // Refresh Lucide icons
    if (window.lucide?.createIcons) {
      window.lucide.createIcons();
    }

    // Attach event listeners
    attachEventListeners();

  } catch (error) {
    console.error('Failed to load profile:', error);
    container.innerHTML = `
      <div class="rounded-3xl border border-red-500/50 bg-red-500/10 p-8 text-center">
        <p class="text-red-400">Failed to load profile. Please try again.</p>
        <p class="mt-2 text-sm text-slate-400">${error.message}</p>
      </div>
    `;
  }
}

async function switchTab(tabId) {
  currentTab = tabId;

  const tabContent = document.getElementById('tab-content');
  if (!tabContent) return;

  // Show loading
  tabContent.innerHTML = `
    <div class="flex items-center justify-center py-10">
      <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-800 border-t-blue-500"></div>
    </div>
  `;

  try {
    let content = '';

    switch (tabId) {
      case 'posts':
        const posts = await getUserPosts(currentUser.id);
        content = posts.length > 0 ? posts.map(renderPostCard).join('') : '<p class="text-center text-slate-400">No posts yet</p>';
        break;

      case 'saved':
        const saved = await getUserSavedPosts(currentUser.id);
        content = saved.length > 0 ? saved.map(renderPostCard).join('') : '<p class="text-center text-slate-400">No saved posts yet</p>';
        break;

      case 'upvoted':
        const upvoted = await getUserUpvotedPosts(currentUser.id);
        content = upvoted.length > 0 ? upvoted.map(renderPostCard).join('') : '<p class="text-center text-slate-400">No upvoted posts yet</p>';
        break;

      case 'followers':
        const followers = await getUserFollowers(currentUser.id);
        content = followers.length > 0 ? followers.map(renderUserCard).join('') : '<p class="text-center text-slate-400">No followers yet</p>';
        break;

      case 'following':
        const following = await getUserFollowing(currentUser.id);
        content = following.length > 0 ? following.map(renderUserCard).join('') : '<p class="text-center text-slate-400">Not following anyone yet</p>';
        break;
    }

    tabContent.innerHTML = content;

    // Update tab styles
    document.querySelectorAll('.tab-button').forEach(btn => {
      const btnTabId = btn.getAttribute('data-tab');
      if (btnTabId === tabId) {
        btn.classList.add('border-b-2', 'border-blue-500', 'text-blue-400');
        btn.classList.remove('text-slate-400');
      } else {
        btn.classList.remove('border-b-2', 'border-blue-500', 'text-blue-400');
        btn.classList.add('text-slate-400');
      }
    });

    // Refresh icons
    if (window.lucide?.createIcons) {
      window.lucide.createIcons();
    }

  } catch (error) {
    console.error('Failed to load tab content:', error);
    tabContent.innerHTML = `<p class="text-center text-red-400">Failed to load content</p>`;
  }
}

function attachEventListeners() {
  // Tab switching
  document.querySelectorAll('[data-tab]').forEach(button => {
    button.addEventListener('click', (e) => {
      const tabId = e.currentTarget.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  // Follow button
  const followBtn = document.querySelector('[data-action="follow-user"]');
  if (followBtn) {
    followBtn.addEventListener('click', async (e) => {
      const btn = e.currentTarget;
      const userId = btn.getAttribute('data-user-id');
      const isFollowing = btn.getAttribute('data-following') === 'true';

      const loggedInUser = window.api?.getUser();
      if (!loggedInUser) {
        alert('Please login to follow users');
        return;
      }

      try {
        btn.disabled = true;

        if (isFollowing) {
          await unfollowUser(loggedInUser.id, userId);
          btn.setAttribute('data-following', 'false');
          btn.innerHTML = '<i data-lucide="user-plus" class="h-4 w-4"></i> Follow';
          btn.classList.remove('border', 'border-slate-700', 'bg-hub-card', 'text-slate-200');
          btn.classList.add('bg-blue-500', 'text-white');
        } else {
          await followUser(loggedInUser.id, userId);
          btn.setAttribute('data-following', 'true');
          btn.innerHTML = '<i data-lucide="user-check" class="h-4 w-4"></i> Following';
          btn.classList.add('border', 'border-slate-700', 'bg-hub-card', 'text-slate-200');
          btn.classList.remove('bg-blue-500', 'text-white');
        }

        if (window.lucide?.createIcons) {
          window.lucide.createIcons();
        }
      } catch (error) {
        console.error('Follow action failed:', error);
        alert('Failed to follow/unfollow user');
      } finally {
        btn.disabled = false;
      }
    });
  }

  // Edit profile button
  const editBtn = document.querySelector('[data-action="edit-profile"]');
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      alert('Edit profile modal - Coming soon!');
      // TODO: Open edit profile modal
    });
  }
}

// Initialize
loadProfile();
