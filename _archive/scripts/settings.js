// Settings Page - User & Company Profile Management
const API_CONFIG = {
  supabase: {
    url: 'https://qibhlrsdykpkbsnelubz.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYmhscnNkeWtwa2JzbmVsdWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNDc4NzEsImV4cCI6MjA3NzkyMzg3MX0.jmwZ8r_7dC8fU5hIlgXrFZUpJBxE07bZyBEuLoG1SrM'
  }
};

let currentUser = null;
let currentTab = 'profile';
let allCompanies = [];

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

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return null;
}

async function getCurrentUser() {
  // Use auth system to get logged in user
  return window.auth?.getCurrentUser() || null;
}

async function updateUser(userId, data) {
  return await supabaseRequest(`/users?id=eq.${userId}`, {
    method: 'PATCH',
    headers: { 'Prefer': 'return=representation' },
    body: JSON.stringify(data)
  });
}

async function getAllCompanies() {
  return await supabaseRequest(`/companies?select=id,name,slug&order=name.asc`);
}

async function getUserCompany(companyId) {
  if (!companyId) return null;
  const companies = await supabaseRequest(`/companies?id=eq.${companyId}&select=*`);
  return companies[0] || null;
}

async function updateCompany(companyId, data) {
  return await supabaseRequest(`/companies?id=eq.${companyId}`, {
    method: 'PATCH',
    headers: { 'Prefer': 'return=representation' },
    body: JSON.stringify(data)
  });
}

async function getUserPosts(userId) {
  try {
    return await supabaseRequest(`/posts?creator_id=eq.${userId}&order=created_at.desc`);
  } catch (error) {
    console.warn('Posts query failed:', error);
    return [];
  }
}

async function deletePost(postId) {
  return await supabaseRequest(`/posts?id=eq.${postId}`, {
    method: 'DELETE'
  });
}

// ============ RENDER FUNCTIONS ============

function renderProfileSettings(user, companies) {
  const avatar = user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=3b82f6&color=fff&size=256`;

  return `
    <form id="profile-form" class="space-y-8">
      <!-- Avatar Section -->
      <section class="rounded-2xl border border-slate-800 bg-hub-card/50 p-6">
        <h2 class="mb-4 text-lg font-semibold text-white">Profile Picture</h2>
        <div class="flex items-center gap-6">
          <div class="relative">
            <img
              id="avatar-preview"
              src="${avatar}"
              alt="${user.full_name || user.username}"
              class="h-24 w-24 rounded-2xl border-2 border-slate-700 object-cover"
            />
            <div id="avatar-upload-progress" class="hidden absolute inset-0 flex items-center justify-center rounded-2xl bg-black/60">
              <div class="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500"></div>
            </div>
          </div>
          <div class="flex-1 space-y-3">
            <div>
              <label class="block text-sm font-medium text-slate-300">Upload from Computer</label>
              <input
                type="file"
                id="avatar-file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                class="mt-1 w-full rounded-lg border border-slate-700 bg-hub-panel px-4 py-2 text-slate-200 file:mr-4 file:rounded file:border-0 file:bg-blue-500 file:px-4 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-blue-400 file:cursor-pointer"
              />
              <p class="mt-1 text-xs text-slate-500">Max 5MB. JPG, PNG, WEBP or GIF</p>
            </div>
            <div class="flex items-center gap-2">
              <div class="flex-1 border-t border-slate-700"></div>
              <span class="text-xs text-slate-500">OR</span>
              <div class="flex-1 border-t border-slate-700"></div>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300">Avatar URL</label>
              <input
                type="url"
                name="avatar_url"
                id="avatar-url-input"
                value="${user.avatar_url || ''}"
                placeholder="https://example.com/avatar.jpg"
                class="mt-1 w-full rounded-lg border border-slate-700 bg-hub-panel px-4 py-2 text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
              />
              <p class="mt-1 text-xs text-slate-500">Paste image URL directly</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Basic Info -->
      <section class="rounded-2xl border border-slate-800 bg-hub-card/50 p-6">
        <h2 class="mb-4 text-lg font-semibold text-white">Basic Information</h2>
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-slate-300">Full Name</label>
            <input
              type="text"
              name="full_name"
              value="${user.full_name || ''}"
              placeholder="Your full name"
              class="mt-1 w-full rounded-lg border border-slate-700 bg-hub-panel px-4 py-2 text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300">Username</label>
            <input
              type="text"
              name="username"
              value="${user.username}"
              placeholder="username"
              class="mt-1 w-full rounded-lg border border-slate-700 bg-hub-panel px-4 py-2 text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-slate-300">Bio</label>
            <textarea
              name="bio"
              rows="3"
              placeholder="Tell us about yourself..."
              class="mt-1 w-full rounded-lg border border-slate-700 bg-hub-panel px-4 py-2 text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
            >${user.bio || ''}</textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300">Location</label>
            <input
              type="text"
              name="location"
              value="${user.location || ''}"
              placeholder="City, Country"
              class="mt-1 w-full rounded-lg border border-slate-700 bg-hub-panel px-4 py-2 text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300">Website</label>
            <input
              type="url"
              name="website"
              value="${user.website || ''}"
              placeholder="https://example.com"
              class="mt-1 w-full rounded-lg border border-slate-700 bg-hub-panel px-4 py-2 text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      <!-- Company Info -->
      <section class="rounded-2xl border border-slate-800 bg-hub-card/50 p-6">
        <h2 class="mb-4 text-lg font-semibold text-white">Company & Role</h2>
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-slate-300">Company</label>
            <select
              name="company_id"
              class="mt-1 w-full rounded-lg border border-slate-700 bg-hub-panel px-4 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="">No company</option>
              ${companies.map(c => `
                <option value="${c.id}" ${c.id === user.company_id ? 'selected' : ''}>${c.name}</option>
              `).join('')}
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300">Job Title</label>
            <input
              type="text"
              name="job_title"
              value="${user.job_title || ''}"
              placeholder="e.g. Content Creator"
              class="mt-1 w-full rounded-lg border border-slate-700 bg-hub-panel px-4 py-2 text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      <!-- Social Links -->
      <section class="rounded-2xl border border-slate-800 bg-hub-card/50 p-6">
        <h2 class="mb-4 text-lg font-semibold text-white">Social Links</h2>
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="flex items-center gap-2 text-sm font-medium text-slate-300">
              <i data-lucide="twitter" class="h-4 w-4"></i>
              Twitter
            </label>
            <input
              type="url"
              name="twitter_url"
              value="${user.twitter_url || ''}"
              placeholder="https://twitter.com/username"
              class="mt-1 w-full rounded-lg border border-slate-700 bg-hub-panel px-4 py-2 text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="flex items-center gap-2 text-sm font-medium text-slate-300">
              <i data-lucide="facebook" class="h-4 w-4"></i>
              Facebook
            </label>
            <input
              type="url"
              name="facebook_url"
              value="${user.facebook_url || ''}"
              placeholder="https://facebook.com/username"
              class="mt-1 w-full rounded-lg border border-slate-700 bg-hub-panel px-4 py-2 text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="flex items-center gap-2 text-sm font-medium text-slate-300">
              <i data-lucide="linkedin" class="h-4 w-4"></i>
              LinkedIn
            </label>
            <input
              type="url"
              name="linkedin_url"
              value="${user.linkedin_url || ''}"
              placeholder="https://linkedin.com/in/username"
              class="mt-1 w-full rounded-lg border border-slate-700 bg-hub-panel px-4 py-2 text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="flex items-center gap-2 text-sm font-medium text-slate-300">
              <i data-lucide="github" class="h-4 w-4"></i>
              GitHub
            </label>
            <input
              type="url"
              name="github_url"
              value="${user.github_url || ''}"
              placeholder="https://github.com/username"
              class="mt-1 w-full rounded-lg border border-slate-700 bg-hub-panel px-4 py-2 text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div class="md:col-span-2">
            <label class="flex items-center gap-2 text-sm font-medium text-slate-300">
              <i data-lucide="youtube" class="h-4 w-4"></i>
              YouTube
            </label>
            <input
              type="url"
              name="youtube_url"
              value="${user.youtube_url || ''}"
              placeholder="https://youtube.com/@username"
              class="mt-1 w-full rounded-lg border border-slate-700 bg-hub-panel px-4 py-2 text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      <!-- Save Button -->
      <div class="flex justify-end gap-3">
        <a
          href="profile.html?user=${user.username}"
          class="rounded-lg border border-slate-700 bg-hub-card px-6 py-2 text-sm font-medium text-slate-200 transition hover:bg-hub-card/80"
        >
          Cancel
        </a>
        <button
          type="submit"
          class="rounded-lg bg-blue-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-400"
        >
          Save Changes
        </button>
      </div>
    </form>
  `;
}

function renderCompanySettings(company) {
  if (!company) {
    return `
      <div class="rounded-2xl border border-slate-800 bg-hub-card/50 p-8 text-center">
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
          <i data-lucide="building-2" class="h-8 w-8 text-slate-500"></i>
        </div>
        <h3 class="text-lg font-semibold text-white">No Company Assigned</h3>
        <p class="mt-2 text-sm text-slate-400">
          You haven't been assigned to a company yet. Contact an admin to get added to a company.
        </p>
      </div>
    `;
  }

  const logo = company.logo_url || `https://placehold.co/400x400/ef4444/ffffff?text=${encodeURIComponent(company.name)}`;

  return `
    <form id="company-form" class="space-y-8">
      <!-- Company Logo -->
      <section class="rounded-2xl border border-slate-800 bg-hub-card/50 p-6">
        <h2 class="mb-4 text-lg font-semibold text-white">Company Logo</h2>
        <div class="flex items-center gap-6">
          <img
            id="company-logo-preview"
            src="${logo}"
            alt="${company.name}"
            class="h-24 w-24 rounded-2xl border-2 border-slate-700 object-cover"
          />
          <div class="flex-1">
            <label class="block text-sm font-medium text-slate-300">Logo URL</label>
            <input
              type="url"
              name="logo_url"
              value="${company.logo_url || ''}"
              placeholder="https://example.com/logo.png"
              class="mt-1 w-full rounded-lg border border-slate-700 bg-hub-panel px-4 py-2 text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      <!-- Company Info -->
      <section class="rounded-2xl border border-slate-800 bg-hub-card/50 p-6">
        <h2 class="mb-4 text-lg font-semibold text-white">Company Information</h2>
        <div class="space-y-4">
          <div class="grid gap-4 md:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-slate-300">Company Name</label>
              <input
                type="text"
                name="name"
                value="${company.name}"
                placeholder="Company Name"
                class="mt-1 w-full rounded-lg border border-slate-700 bg-hub-panel px-4 py-2 text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300">Slug</label>
              <input
                type="text"
                name="slug"
                value="${company.slug}"
                placeholder="company-slug"
                class="mt-1 w-full rounded-lg border border-slate-700 bg-hub-panel px-4 py-2 text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300">Tagline</label>
            <input
              type="text"
              name="tagline"
              value="${company.tagline || ''}"
              placeholder="Short tagline"
              class="mt-1 w-full rounded-lg border border-slate-700 bg-hub-panel px-4 py-2 text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300">Description</label>
            <textarea
              name="description"
              rows="3"
              placeholder="Company description..."
              class="mt-1 w-full rounded-lg border border-slate-700 bg-hub-panel px-4 py-2 text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
            >${company.description || ''}</textarea>
          </div>
          <div class="grid gap-4 md:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-slate-300">Website</label>
              <input
                type="url"
                name="website"
                value="${company.website || ''}"
                placeholder="https://company.com"
                class="mt-1 w-full rounded-lg border border-slate-700 bg-hub-panel px-4 py-2 text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300">Industry</label>
              <input
                type="text"
                name="industry"
                value="${company.industry || ''}"
                placeholder="e.g. Gaming & Technology"
                class="mt-1 w-full rounded-lg border border-slate-700 bg-hub-panel px-4 py-2 text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Save Button -->
      <div class="flex justify-end gap-3">
        <a
          href="company.html?slug=${company.slug}"
          class="rounded-lg border border-slate-700 bg-hub-card px-6 py-2 text-sm font-medium text-slate-200 transition hover:bg-hub-card/80"
        >
          Cancel
        </a>
        <button
          type="submit"
          class="rounded-lg bg-blue-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-400"
        >
          Save Changes
        </button>
      </div>
    </form>
  `;
}

function renderPostsManagement(posts) {
  if (posts.length === 0) {
    return `
      <div class="rounded-2xl border border-slate-800 bg-hub-card/50 p-8 text-center">
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
          <i data-lucide="file-text" class="h-8 w-8 text-slate-500"></i>
        </div>
        <h3 class="text-lg font-semibold text-white">No Posts Yet</h3>
        <p class="mt-2 text-sm text-slate-400">You haven't created any posts yet.</p>
      </div>
    `;
  }

  return `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-white">Your Posts (${posts.length})</h2>
      </div>
      <div class="space-y-3">
        ${posts.map(post => `
          <article class="flex items-start gap-4 rounded-2xl border border-slate-800 bg-hub-card/50 p-4 transition hover:border-slate-700">
            ${post.video_thumbnail ? `
              <img src="${post.video_thumbnail}" alt="${post.title}" class="h-16 w-24 rounded-lg object-cover" />
            ` : ''}
            <div class="flex-1">
              <h3 class="font-semibold text-white">
                <a href="detail.html?id=${post.id}" class="hover:text-blue-400">${post.title}</a>
              </h3>
              <div class="mt-2 flex items-center gap-4 text-xs text-slate-500">
                <span>${new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                <span class="flex items-center gap-1">
                  <i data-lucide="eye" class="h-3 w-3"></i>
                  ${post.views || 0}
                </span>
                ${post.content_type === 'video' ? '<span class="rounded bg-red-500/20 px-2 py-0.5 text-red-300">Video</span>' : ''}
              </div>
            </div>
            <div class="flex items-center gap-2">
              <a
                href="edit-post.html?id=${post.id}"
                class="rounded-lg border border-slate-700 bg-hub-panel px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-hub-card"
              >
                <i data-lucide="edit-2" class="inline h-3 w-3"></i>
                Edit
              </a>
              <button
                data-action="delete-post"
                data-post-id="${post.id}"
                class="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 transition hover:bg-red-500/20"
              >
                <i data-lucide="trash-2" class="inline h-3 w-3"></i>
                Delete
              </button>
            </div>
          </article>
        `).join('')}
      </div>
    </div>
  `;
}

function renderAccountSettings(user) {
  return `
    <div class="space-y-8">
      <!-- Email & Password -->
      <section class="rounded-2xl border border-slate-800 bg-hub-card/50 p-6">
        <h2 class="mb-4 text-lg font-semibold text-white">Account Security</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-300">Email</label>
            <input
              type="email"
              value="${user.email}"
              disabled
              class="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-slate-400"
            />
            <p class="mt-1 text-xs text-slate-500">Email cannot be changed</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300">Change Password</label>
            <button
              type="button"
              class="mt-1 rounded-lg border border-slate-700 bg-hub-panel px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-hub-card"
            >
              Change Password
            </button>
          </div>
        </div>
      </section>

      <!-- Danger Zone -->
      <section class="rounded-2xl border border-red-500/40 bg-red-500/10 p-6">
        <h2 class="mb-4 text-lg font-semibold text-red-400">Danger Zone</h2>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-red-300">Delete Account</p>
              <p class="text-sm text-red-400/70">Permanently delete your account and all data</p>
            </div>
            <button
              type="button"
              class="rounded-lg border border-red-500 bg-red-500/20 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/30"
            >
              Delete Account
            </button>
          </div>
        </div>
      </section>
    </div>
  `;
}

// ============ MAIN LOGIC ============

async function loadSettings() {
  try {
    // Load current user
    currentUser = await getCurrentUser();
    if (!currentUser) {
      document.getElementById('settings-content').innerHTML = `
        <div class="rounded-2xl border border-red-500/50 bg-red-500/10 p-8 text-center">
          <p class="text-red-400">Please login to access settings</p>
        </div>
      `;
      return;
    }

    // Load companies
    allCompanies = await getAllCompanies();

    // Update header
    const profileLink = document.getElementById('user-profile-link');
    if (profileLink) {
      const avatar = currentUser.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.username)}&background=3b82f6&color=fff&size=128`;
      profileLink.innerHTML = `
        <img src="${avatar}" alt="${currentUser.username}" class="h-8 w-8 rounded-full object-cover" />
        <span>${currentUser.full_name || currentUser.username}</span>
      `;
      profileLink.setAttribute('href', `profile.html?user=${currentUser.username}`);
      profileLink.classList.remove('cursor-default');
      profileLink.classList.add('cursor-pointer');
    }

    // Load initial tab
    await switchTab('profile');

  } catch (error) {
    console.error('Failed to load settings:', error);
    document.getElementById('settings-content').innerHTML = `
      <div class="rounded-2xl border border-red-500/50 bg-red-500/10 p-8 text-center">
        <p class="text-red-400">Failed to load settings. Please try again.</p>
      </div>
    `;
  }
}

async function switchTab(tabId) {
  currentTab = tabId;

  const container = document.getElementById('settings-content');
  if (!container) return;

  // Show loading
  container.innerHTML = `
    <div class="flex items-center justify-center py-20">
      <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-800 border-t-blue-500"></div>
    </div>
  `;

  try {
    let content = '';

    switch (tabId) {
      case 'profile':
        content = renderProfileSettings(currentUser, allCompanies);
        break;

      case 'company':
        const company = await getUserCompany(currentUser.company_id);
        content = renderCompanySettings(company);
        break;

      case 'posts':
        const posts = await getUserPosts(currentUser.id);
        content = renderPostsManagement(posts);
        break;

      case 'account':
        content = renderAccountSettings(currentUser);
        break;
    }

    container.innerHTML = content;

    // Update tab styles
    document.querySelectorAll('.settings-tab-btn').forEach(btn => {
      const btnTabId = btn.getAttribute('data-settings-tab');
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

    // Attach event listeners
    attachEventListeners();

  } catch (error) {
    console.error('Failed to load tab:', error);
    container.innerHTML = `<p class="text-center text-red-400">Failed to load content</p>`;
  }
}

function attachEventListeners() {
  // Tab switching
  document.querySelectorAll('[data-settings-tab]').forEach(button => {
    button.addEventListener('click', (e) => {
      const tabId = e.currentTarget.getAttribute('data-settings-tab');
      switchTab(tabId);
    });
  });

  // Profile form submit
  const profileForm = document.getElementById('profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(profileForm);
      const data = Object.fromEntries(formData.entries());

      // Convert empty strings to null
      Object.keys(data).forEach(key => {
        if (data[key] === '') data[key] = null;
        if (key === 'company_id' && data[key]) {
          data[key] = parseInt(data[key]);
        }
      });

      try {
        const submitBtn = profileForm.querySelector('[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';

        await updateUser(currentUser.id, data);

        alert('Profile updated successfully!');
        window.location.href = `profile.html?user=${data.username || currentUser.username}`;
      } catch (error) {
        console.error('Failed to update profile:', error);
        alert('Failed to update profile. Please try again.');
      }
    });

    // Avatar URL preview
    const avatarInput = profileForm.querySelector('#avatar-url-input');
    const avatarPreview = document.getElementById('avatar-preview');
    if (avatarInput && avatarPreview) {
      avatarInput.addEventListener('input', (e) => {
        const url = e.target.value;
        if (url) {
          avatarPreview.src = url;
        }
      });
    }

    // Avatar file upload
    const avatarFile = document.getElementById('avatar-file');
    const avatarUrlInput = document.getElementById('avatar-url-input');
    const uploadProgress = document.getElementById('avatar-upload-progress');

    if (avatarFile) {
      avatarFile.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert('Please select an image file (JPG, PNG, WEBP, GIF)');
          avatarFile.value = '';
          return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('File size must be less than 5MB');
          avatarFile.value = '';
          return;
        }

        try {
          // Show loading
          avatarFile.disabled = true;
          uploadProgress.classList.remove('hidden');

          // Upload to Supabase Storage
          const url = await window.auth.uploadAvatar(avatarFile);

          // Update preview and input
          avatarPreview.src = url;
          avatarUrlInput.value = url;

          // Success message
          const successMsg = document.createElement('p');
          successMsg.className = 'text-xs text-green-400 mt-1';
          successMsg.textContent = '✓ Avatar uploaded successfully!';
          avatarFile.parentElement.appendChild(successMsg);

          setTimeout(() => successMsg.remove(), 3000);

        } catch (error) {
          console.error('Upload failed:', error);
          alert(error.message || 'Failed to upload avatar. Please try again.');
        } finally {
          // Hide loading
          uploadProgress.classList.add('hidden');
          avatarFile.disabled = false;
          avatarFile.value = ''; // Clear file input
        }
      });
    }
  }

  // Company form submit
  const companyForm = document.getElementById('company-form');
  if (companyForm) {
    companyForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(companyForm);
      const data = Object.fromEntries(formData.entries());

      // Convert empty strings to null
      Object.keys(data).forEach(key => {
        if (data[key] === '') data[key] = null;
      });

      try {
        const submitBtn = companyForm.querySelector('[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';

        await updateCompany(currentUser.company_id, data);

        alert('Company updated successfully!');
        window.location.href = `company.html?slug=${data.slug}`;
      } catch (error) {
        console.error('Failed to update company:', error);
        alert('Failed to update company. Please try again.');
      }
    });

    // Logo preview
    const logoInput = companyForm.querySelector('[name="logo_url"]');
    const logoPreview = document.getElementById('company-logo-preview');
    if (logoInput && logoPreview) {
      logoInput.addEventListener('input', (e) => {
        const url = e.target.value;
        if (url) {
          logoPreview.src = url;
        }
      });
    }
  }

  // Delete post buttons
  document.querySelectorAll('[data-action="delete-post"]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const postId = e.currentTarget.getAttribute('data-post-id');
      if (!confirm('Are you sure you want to delete this post?')) return;

      try {
        await deletePost(postId);
        alert('Post deleted successfully!');
        switchTab('posts'); // Reload posts
      } catch (error) {
        console.error('Failed to delete post:', error);
        alert('Failed to delete post. Please try again.');
      }
    });
  });
}

// Initialize
loadSettings();
