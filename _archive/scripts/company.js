// Company Profile Page - Using Supabase REST API
const API_CONFIG = {
  supabase: {
    url: 'https://qibhlrsdykpkbsnelubz.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYmhscnNkeWtwa2JzbmVsdWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNDc4NzEsImV4cCI6MjA3NzkyMzg3MX0.jmwZ8r_7dC8fU5hIlgXrFZUpJBxE07bZyBEuLoG1SrM'
  }
};

const params = new URLSearchParams(window.location.search);
const slug = params.get("slug") ?? "";
const container = document.getElementById("company-root");

let currentCompany = null;
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

async function getCompanyBySlug(slug) {
  const companies = await supabaseRequest(`/companies?slug=eq.${slug}&select=*`);
  return companies[0] || null;
}

async function getCompanyPosts(companyId) {
  try {
    const posts = await supabaseRequest(`/posts?company_id=eq.${companyId}&author_type=eq.company&order=created_at.desc`);
    return posts;
  } catch (error) {
    console.warn('Company posts query failed:', error);
    return [];
  }
}

async function getCompanyEmployees(companyId) {
  try {
    const employees = await supabaseRequest(`/users?company_id=eq.${companyId}&select=*`);
    return employees;
  } catch (error) {
    console.warn('Employees query failed:', error);
    return [];
  }
}

async function getCompanyFollowers(companyId) {
  try {
    const followers = await supabaseRequest(`/company_followers?company_id=eq.${companyId}&select=user_id,users(*)`);
    return followers.map(f => f.users).filter(Boolean);
  } catch (error) {
    console.warn('Company followers query failed:', error);
    return [];
  }
}

async function followCompany(userId, companyId) {
  return await supabaseRequest(`/company_followers`, {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, company_id: companyId })
  });
}

async function unfollowCompany(userId, companyId) {
  return await supabaseRequest(`/company_followers?user_id=eq.${userId}&company_id=eq.${companyId}`, {
    method: 'DELETE'
  });
}

async function checkIsFollowingCompany(userId, companyId) {
  try {
    const result = await supabaseRequest(`/company_followers?user_id=eq.${userId}&company_id=eq.${companyId}`);
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
      <h1 class="text-2xl font-semibold text-white">Không tìm thấy công ty</h1>
      <p class="mt-3 text-sm text-slate-400">
        Công ty không tồn tại hoặc đã bị xóa. Hãy quay lại trang chủ.
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

function renderCompanyHeader(company, isOwner, isFollowing) {
  const logo = company.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=ef4444&color=fff&size=256`;
  const cover = company.cover_image_url || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgb(239,68,68);stop-opacity:0.3" /%3E%3Cstop offset="50%25" style="stop-color:rgb(168,85,247);stop-opacity:0.3" /%3E%3Cstop offset="100%25" style="stop-color:rgb(59,130,246);stop-opacity:0.3" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="1200" height="400" fill="url(%23grad)" /%3E%3C/svg%3E';

  return `
    <section class="relative overflow-hidden rounded-3xl border border-slate-800 bg-hub-panel/80">
      <!-- Cover Image -->
      <div class="h-64 bg-gradient-to-br from-red-500/20 via-purple-500/20 to-blue-500/20 bg-cover bg-center" style="background-image: url('${cover}')"></div>

      <!-- Company Info -->
      <div class="relative px-8 pb-8">
        <!-- Logo -->
        <div class="absolute -top-20 left-8">
          <img
            src="${logo}"
            alt="${company.name}"
            class="h-40 w-40 rounded-3xl border-4 border-hub-panel object-cover bg-hub-panel"
          />
          ${company.is_verified ? `
            <div class="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 border-2 border-hub-panel">
              <i data-lucide="check" class="h-5 w-5 text-white"></i>
            </div>
          ` : ''}
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-4">
          ${isOwner ? `
            <button
              data-action="edit-company"
              class="flex items-center gap-2 rounded-full border border-slate-700 bg-hub-card px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-hub-card/80"
            >
              <i data-lucide="edit-2" class="h-4 w-4"></i>
              Edit Company
            </button>
          ` : `
            <button
              data-action="follow-company"
              data-company-id="${company.id}"
              data-following="${isFollowing}"
              class="flex items-center gap-2 rounded-full ${isFollowing ? 'border border-slate-700 bg-hub-card text-slate-200' : 'bg-blue-500 text-white'} px-4 py-2 text-sm font-semibold transition hover:opacity-90"
            >
              <i data-lucide="${isFollowing ? 'check' : 'plus'}" class="h-4 w-4"></i>
              ${isFollowing ? 'Following' : 'Follow'}
            </button>
          `}
          ${company.website ? `
            <a
              href="${company.website}"
              target="_blank"
              class="flex items-center gap-2 rounded-full border border-slate-700 bg-hub-card px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-600"
            >
              <i data-lucide="external-link" class="h-4 w-4"></i>
              Website
            </a>
          ` : ''}
        </div>

        <!-- Company Details -->
        <div class="mt-28 space-y-4">
          <div>
            <h1 class="text-3xl font-bold text-white">${company.name}</h1>
            ${company.tagline ? `
              <p class="text-lg text-slate-300">${company.tagline}</p>
            ` : ''}
          </div>

          ${company.description ? `
            <p class="text-slate-400">${company.description}</p>
          ` : ''}

          <!-- Company Info Grid -->
          <div class="grid gap-3 text-sm md:grid-cols-2">
            ${company.industry ? `
              <div class="flex items-center gap-2 text-slate-400">
                <i data-lucide="briefcase" class="h-4 w-4"></i>
                <span>${company.industry}</span>
              </div>
            ` : ''}
            ${company.company_size ? `
              <div class="flex items-center gap-2 text-slate-400">
                <i data-lucide="users" class="h-4 w-4"></i>
                <span>${company.company_size} employees</span>
              </div>
            ` : ''}
            ${company.founded_year ? `
              <div class="flex items-center gap-2 text-slate-400">
                <i data-lucide="calendar" class="h-4 w-4"></i>
                <span>Founded in ${company.founded_year}</span>
              </div>
            ` : ''}
            ${company.city || company.country ? `
              <div class="flex items-center gap-2 text-slate-400">
                <i data-lucide="map-pin" class="h-4 w-4"></i>
                <span>${[company.city, company.country].filter(Boolean).join(', ')}</span>
              </div>
            ` : ''}
            ${company.email ? `
              <div class="flex items-center gap-2 text-slate-400">
                <i data-lucide="mail" class="h-4 w-4"></i>
                <a href="mailto:${company.email}" class="text-blue-400 hover:underline">${company.email}</a>
              </div>
            ` : ''}
            ${company.phone ? `
              <div class="flex items-center gap-2 text-slate-400">
                <i data-lucide="phone" class="h-4 w-4"></i>
                <a href="tel:${company.phone}" class="text-blue-400 hover:underline">${company.phone}</a>
              </div>
            ` : ''}
          </div>

          <!-- Social Links -->
          <div class="flex gap-3">
            ${company.twitter_url ? `<a href="${company.twitter_url}" target="_blank" class="text-slate-400 hover:text-blue-400"><i data-lucide="twitter" class="h-5 w-5"></i></a>` : ''}
            ${company.facebook_url ? `<a href="${company.facebook_url}" target="_blank" class="text-slate-400 hover:text-blue-400"><i data-lucide="facebook" class="h-5 w-5"></i></a>` : ''}
            ${company.linkedin_url ? `<a href="${company.linkedin_url}" target="_blank" class="text-slate-400 hover:text-blue-400"><i data-lucide="linkedin" class="h-5 w-5"></i></a>` : ''}
            ${company.youtube_url ? `<a href="${company.youtube_url}" target="_blank" class="text-slate-400 hover:text-red-400"><i data-lucide="youtube" class="h-5 w-5"></i></a>` : ''}
          </div>

          <!-- Stats -->
          <div class="flex gap-6 text-sm">
            <div>
              <span class="font-semibold text-white">${company.posts_count || 0}</span>
              <span class="text-slate-400"> Posts</span>
            </div>
            <button data-tab="followers" class="hover:underline">
              <span class="font-semibold text-white">${company.followers_count || 0}</span>
              <span class="text-slate-400"> Followers</span>
            </button>
            <button data-tab="team" class="hover:underline">
              <span class="font-semibold text-white">${company.employees_count || 0}</span>
              <span class="text-slate-400"> Team</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderTabs() {
  const tabs = [
    { id: 'posts', label: 'Posts', icon: 'file-text' },
    { id: 'about', label: 'About', icon: 'info' },
    { id: 'team', label: 'Team', icon: 'users' },
    { id: 'followers', label: 'Followers', icon: 'user-check' },
  ];

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

function renderEmployeeCard(employee) {
  const avatar = employee.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.username)}&background=3b82f6&color=fff&size=128`;

  return `
    <article class="rounded-2xl border border-slate-800 bg-hub-card/50 p-4 transition hover:border-slate-700">
      <div class="flex items-center gap-3">
        <img src="${avatar}" alt="${employee.username}" class="h-12 w-12 rounded-full object-cover" />
        <div class="flex-1">
          <a href="profile.html?user=${employee.username}" class="font-semibold text-white hover:text-blue-400">
            ${employee.full_name || employee.username}
          </a>
          ${employee.job_title ? `
            <p class="text-sm text-slate-400">${employee.job_title}</p>
          ` : `
            <p class="text-sm text-slate-400">@${employee.username}</p>
          `}
        </div>
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

function renderAboutTab(company) {
  return `
    <div class="space-y-6">
      ${company.description ? `
        <div>
          <h3 class="mb-3 text-lg font-semibold text-white">About</h3>
          <p class="text-slate-300">${company.description}</p>
        </div>
      ` : ''}

      <div>
        <h3 class="mb-3 text-lg font-semibold text-white">Company Info</h3>
        <div class="grid gap-4 text-sm md:grid-cols-2">
          ${company.industry ? `
            <div>
              <span class="text-slate-500">Industry</span>
              <p class="text-slate-200">${company.industry}</p>
            </div>
          ` : ''}
          ${company.company_size ? `
            <div>
              <span class="text-slate-500">Company Size</span>
              <p class="text-slate-200">${company.company_size} employees</p>
            </div>
          ` : ''}
          ${company.founded_year ? `
            <div>
              <span class="text-slate-500">Founded</span>
              <p class="text-slate-200">${company.founded_year}</p>
            </div>
          ` : ''}
          ${company.website ? `
            <div>
              <span class="text-slate-500">Website</span>
              <p><a href="${company.website}" target="_blank" class="text-blue-400 hover:underline">${company.website}</a></p>
            </div>
          ` : ''}
        </div>
      </div>

      ${company.address || company.city || company.country ? `
        <div>
          <h3 class="mb-3 text-lg font-semibold text-white">Location</h3>
          <div class="space-y-1 text-sm text-slate-300">
            ${company.address ? `<p>${company.address}</p>` : ''}
            ${company.city || company.country ? `<p>${[company.city, company.country].filter(Boolean).join(', ')}</p>` : ''}
          </div>
        </div>
      ` : ''}

      ${company.email || company.phone ? `
        <div>
          <h3 class="mb-3 text-lg font-semibold text-white">Contact</h3>
          <div class="space-y-2 text-sm">
            ${company.email ? `
              <div class="flex items-center gap-2 text-slate-300">
                <i data-lucide="mail" class="h-4 w-4 text-slate-500"></i>
                <a href="mailto:${company.email}" class="text-blue-400 hover:underline">${company.email}</a>
              </div>
            ` : ''}
            ${company.phone ? `
              <div class="flex items-center gap-2 text-slate-300">
                <i data-lucide="phone" class="h-4 w-4 text-slate-500"></i>
                <a href="tel:${company.phone}" class="text-blue-400 hover:underline">${company.phone}</a>
              </div>
            ` : ''}
          </div>
        </div>
      ` : ''}
    </div>
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

async function loadCompany() {
  if (!slug || !container) {
    renderFallback();
    return;
  }

  try {
    // Show loading
    container.innerHTML = `
      <div class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-slate-800 border-t-blue-500"></div>
          <p class="text-slate-400">Loading company...</p>
        </div>
      </div>
    `;

    const company = await getCompanyBySlug(slug);
    if (!company) {
      renderFallback();
      return;
    }

    currentCompany = company;

    // Check if user is owner
    const loggedInUser = window.api?.getUser();
    const isOwner = loggedInUser && loggedInUser.id === company.owner_id;

    // Check if following
    let isFollowing = false;
    if (loggedInUser && !isOwner) {
      isFollowing = await checkIsFollowingCompany(loggedInUser.id, company.id);
    }

    // Load initial posts
    const posts = await getCompanyPosts(company.id);

    // Render company
    container.innerHTML = `
      ${renderCompanyHeader(company, isOwner, isFollowing)}
      <div class="mt-8 rounded-3xl border border-slate-800 bg-hub-panel/80">
        ${renderTabs()}
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
    console.error('Failed to load company:', error);
    container.innerHTML = `
      <div class="rounded-3xl border border-red-500/50 bg-red-500/10 p-8 text-center">
        <p class="text-red-400">Failed to load company. Please try again.</p>
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
        const posts = await getCompanyPosts(currentCompany.id);
        content = posts.length > 0 ? posts.map(renderPostCard).join('') : '<p class="text-center text-slate-400">No posts yet</p>';
        break;

      case 'about':
        content = renderAboutTab(currentCompany);
        break;

      case 'team':
        const employees = await getCompanyEmployees(currentCompany.id);
        content = employees.length > 0 ? employees.map(renderEmployeeCard).join('') : '<p class="text-center text-slate-400">No team members yet</p>';
        break;

      case 'followers':
        const followers = await getCompanyFollowers(currentCompany.id);
        content = followers.length > 0 ? followers.map(renderUserCard).join('') : '<p class="text-center text-slate-400">No followers yet</p>';
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
  const followBtn = document.querySelector('[data-action="follow-company"]');
  if (followBtn) {
    followBtn.addEventListener('click', async (e) => {
      const btn = e.currentTarget;
      const companyId = btn.getAttribute('data-company-id');
      const isFollowing = btn.getAttribute('data-following') === 'true';

      const loggedInUser = window.api?.getUser();
      if (!loggedInUser) {
        alert('Please login to follow companies');
        return;
      }

      try {
        btn.disabled = true;

        if (isFollowing) {
          await unfollowCompany(loggedInUser.id, companyId);
          btn.setAttribute('data-following', 'false');
          btn.innerHTML = '<i data-lucide="plus" class="h-4 w-4"></i> Follow';
          btn.classList.remove('border', 'border-slate-700', 'bg-hub-card', 'text-slate-200');
          btn.classList.add('bg-blue-500', 'text-white');
        } else {
          await followCompany(loggedInUser.id, companyId);
          btn.setAttribute('data-following', 'true');
          btn.innerHTML = '<i data-lucide="check" class="h-4 w-4"></i> Following';
          btn.classList.add('border', 'border-slate-700', 'bg-hub-card', 'text-slate-200');
          btn.classList.remove('bg-blue-500', 'text-white');
        }

        if (window.lucide?.createIcons) {
          window.lucide.createIcons();
        }
      } catch (error) {
        console.error('Follow action failed:', error);
        alert('Failed to follow/unfollow company');
      } finally {
        btn.disabled = false;
      }
    });
  }

  // Edit company button
  const editBtn = document.querySelector('[data-action="edit-company"]');
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      alert('Edit company modal - Coming soon!');
      // TODO: Open edit company modal
    });
  }
}

// Initialize
loadCompany();
