// Admin Dashboard Logic
// Handles posts, hashtags, and categories management

// Initialize Lucide icons
lucide.createIcons();

// State
let allPosts = [];
let filteredPosts = [];
let allHashtags = [];
let allCategories = [];
let selectedTags = [];

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
  loadPosts();
  loadHashtags();
  loadCategories();
  setupEventListeners();
});

// ============ EVENT LISTENERS ============

function setupEventListeners() {
  // Tab switching
  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => switchTab(button.dataset.tab));
  });

  // Refresh button
  document.getElementById('refreshBtn').addEventListener('click', () => {
    loadPosts();
    loadHashtags();
    loadCategories();
  });

  // Posts filters
  document.getElementById('searchInput').addEventListener('input', filterPosts);
  document.getElementById('categoryFilter').addEventListener('change', filterPosts);
  document.getElementById('statusFilter').addEventListener('change', filterPosts);

  // Forms
  document.getElementById('editForm').addEventListener('submit', handleEditSubmit);
  document.getElementById('hashtagForm').addEventListener('submit', handleHashtagSubmit);
  document.getElementById('categoryForm').addEventListener('submit', handleCategorySubmit);

  // Color pickers sync
  document.getElementById('hashtagColor').addEventListener('input', (e) => {
    document.getElementById('hashtagColorText').value = e.target.value;
  });
  document.getElementById('hashtagColorText').addEventListener('input', (e) => {
    document.getElementById('hashtagColor').value = e.target.value;
  });
  document.getElementById('categoryColor').addEventListener('input', (e) => {
    document.getElementById('categoryColorText').value = e.target.value;
  });
  document.getElementById('categoryColorText').addEventListener('input', (e) => {
    document.getElementById('categoryColor').value = e.target.value;
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.multiselect-dropdown')) {
      document.getElementById('tagsDropdown').classList.remove('active');
    }
  });
}

// ============ TAB SWITCHING ============

function switchTab(tabName) {
  // Update tab buttons
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  // Update tab content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.toggle('active', content.id === `${tabName}-tab`);
  });

  lucide.createIcons();
}

// ============ POSTS MANAGEMENT ============

async function loadPosts() {
  const loadingState = document.getElementById('loadingStatePosts');
  const tableContainer = document.getElementById('tableContainerPosts');
  const emptyState = document.getElementById('emptyStatePosts');

  loadingState.classList.remove('hidden');
  tableContainer.classList.add('hidden');
  emptyState.classList.add('hidden');

  try {
    const response = await fetch(`${API_CONFIG.supabase.url}/rest/v1/posts?select=*&content_type=eq.video&order=created_at.desc`, {
      headers: {
        'apikey': API_CONFIG.supabase.key,
        'Authorization': `Bearer ${API_CONFIG.supabase.key}`
      }
    });

    if (!response.ok) throw new Error('Failed to load posts');

    allPosts = await response.json();
    filteredPosts = [...allPosts];

    updateStats();
    renderPosts();

    loadingState.classList.add('hidden');
    if (filteredPosts.length > 0) {
      tableContainer.classList.remove('hidden');
    } else {
      emptyState.classList.remove('hidden');
    }

    lucide.createIcons();

  } catch (error) {
    console.error('Error loading posts:', error);
    loadingState.classList.add('hidden');
    emptyState.classList.remove('hidden');
    alert('Failed to load posts. Please try again.');
  }
}

function updateStats() {
  const published = allPosts.filter(p => p.published === true).length;
  const drafts = allPosts.filter(p => p.published === false).length;

  document.getElementById('totalVideos').textContent = allPosts.length;
  document.getElementById('publishedCount').textContent = published;
  document.getElementById('draftsCount').textContent = drafts;
  document.getElementById('totalViews').textContent = allPosts.reduce((sum, p) => sum + (p.upvotes || 0), 0);
}

function filterPosts() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const category = document.getElementById('categoryFilter').value;
  const status = document.getElementById('statusFilter').value;

  filteredPosts = allPosts.filter(post => {
    const matchSearch = !search ||
      post.title?.toLowerCase().includes(search) ||
      post.id?.toLowerCase().includes(search) ||
      post.creator_name?.toLowerCase().includes(search);

    const matchCategory = !category || post.category === category;
    const matchStatus = !status || String(post.published) === status;

    return matchSearch && matchCategory && matchStatus;
  });

  renderPosts();
  lucide.createIcons();
}

function renderPosts() {
  const tbody = document.getElementById('postsTableBody');
  const tableContainer = document.getElementById('tableContainerPosts');
  const emptyState = document.getElementById('emptyStatePosts');

  if (filteredPosts.length === 0) {
    tableContainer.classList.add('hidden');
    emptyState.classList.remove('hidden');
    return;
  }

  tableContainer.classList.remove('hidden');
  emptyState.classList.add('hidden');

  tbody.innerHTML = filteredPosts.map(post => `
    <tr class="border-b border-slate-700 hover:bg-slate-700/50 transition">
      <td class="px-6 py-4">
        <img
          src="${post.cover_image || post.video_thumbnail || 'https://via.placeholder.com/120x80?text=No+Image'}"
          alt="${post.title}"
          class="w-20 h-12 object-cover rounded"
        />
      </td>
      <td class="px-6 py-4 max-w-md">
        <p class="font-semibold text-white truncate">${post.title}</p>
        <p class="text-xs text-slate-400 mt-1">ID: ${post.id}</p>
      </td>
      <td class="px-6 py-4">
        <span class="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs font-medium">
          ${post.category || 'N/A'}
        </span>
      </td>
      <td class="px-6 py-4">
        <p class="text-sm text-slate-300">${post.creator_name || 'Unknown'}</p>
      </td>
      <td class="px-6 py-4">
        <span class="flex items-center gap-1 text-sm text-slate-300">
          <i data-lucide="clock" class="h-3 w-3"></i>
          ${post.video_duration || 'N/A'}
        </span>
      </td>
      <td class="px-6 py-4">
        <span class="status-badge ${post.published ? 'status-published' : 'status-draft'}">
          <i data-lucide="${post.published ? 'check-circle' : 'circle'}" class="h-3 w-3"></i>
          ${post.published ? 'Published' : 'Draft'}
        </span>
      </td>
      <td class="px-6 py-4">
        <p class="text-sm text-slate-300">${new Date(post.created_at).toLocaleDateString('vi-VN')}</p>
      </td>
      <td class="px-6 py-4">
        <div class="flex items-center gap-2">
          <button
            onclick="openEditModal('${post.id}')"
            class="p-2 bg-blue-600 hover:bg-blue-700 rounded transition"
            title="Edit"
          >
            <i data-lucide="edit-2" class="h-4 w-4"></i>
          </button>
          <button
            onclick="togglePublish('${post.id}', ${!post.published})"
            class="p-2 bg-yellow-600 hover:bg-yellow-700 rounded transition"
            title="${post.published ? 'Unpublish' : 'Publish'}"
          >
            <i data-lucide="${post.published ? 'eye-off' : 'eye'}" class="h-4 w-4"></i>
          </button>
          <button
            onclick="deletePost('${post.id}')"
            class="p-2 bg-red-600 hover:bg-red-700 rounded transition"
            title="Delete"
          >
            <i data-lucide="trash-2" class="h-4 w-4"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

async function openEditModal(postId) {
  const post = allPosts.find(p => p.id === postId);
  if (!post) return;

  // Populate category dropdown
  const categorySelect = document.getElementById('editCategory');
  categorySelect.innerHTML = allCategories.map(cat =>
    `<option value="${cat.slug}" ${post.category === cat.slug ? 'selected' : ''}>${cat.name}</option>`
  ).join('');

  // Populate form
  document.getElementById('editPostId').value = post.id;
  document.getElementById('editTitle').value = post.title || '';
  document.getElementById('editExcerpt').value = post.excerpt || '';
  document.getElementById('editPublished').value = String(post.published);
  document.getElementById('editVideoUrl').value = post.video_url || '';
  document.getElementById('editDuration').value = post.video_duration || '';
  document.getElementById('editCreatorName').value = post.creator_name || '';
  document.getElementById('editCreatorId').value = post.creator_id || '';

  // Populate tags dropdown
  selectedTags = post.tags || [];
  populateTagsDropdown();
  updateTagsDisplay();

  document.getElementById('editModal').classList.add('active');
  lucide.createIcons();
}

function populateTagsDropdown() {
  const dropdown = document.getElementById('tagsDropdown');
  dropdown.innerHTML = allHashtags.map(tag => `
    <div class="multiselect-option ${selectedTags.includes(tag.slug) ? 'selected' : ''}" onclick="toggleTag('${tag.slug}')">
      <span style="color: ${tag.color}">●</span> ${tag.name}
    </div>
  `).join('');
}

function toggleTagsDropdown() {
  document.getElementById('tagsDropdown').classList.toggle('active');
}

function toggleTag(tagSlug) {
  const index = selectedTags.indexOf(tagSlug);
  if (index > -1) {
    selectedTags.splice(index, 1);
  } else {
    selectedTags.push(tagSlug);
  }
  populateTagsDropdown();
  updateTagsDisplay();
}

function updateTagsDisplay() {
  const display = document.getElementById('tagsDisplay');
  const hiddenInput = document.getElementById('editTags');

  if (selectedTags.length === 0) {
    display.innerHTML = '<span class="text-slate-400">Select tags...</span>';
  } else {
    const tagElements = selectedTags.map(slug => {
      const tag = allHashtags.find(t => t.slug === slug);
      return tag ? `<span class="inline-block px-2 py-1 rounded text-xs mr-2 mb-2" style="background-color: ${tag.color}20; color: ${tag.color}; border: 1px solid ${tag.color}40">${tag.name}</span>` : '';
    }).join('');
    display.innerHTML = tagElements;
  }

  hiddenInput.value = selectedTags.join(',');
}

function closeEditModal() {
  document.getElementById('editModal').classList.remove('active');
  document.getElementById('editForm').reset();
  selectedTags = [];
}

async function handleEditSubmit(e) {
  e.preventDefault();

  const postId = document.getElementById('editPostId').value;
  const payload = {
    title: document.getElementById('editTitle').value,
    excerpt: document.getElementById('editExcerpt').value,
    category: document.getElementById('editCategory').value,
    published: document.getElementById('editPublished').value === 'true',
    video_duration: document.getElementById('editDuration').value,
    tags: selectedTags,
    creator_name: document.getElementById('editCreatorName').value
  };

  try {
    const response = await fetch(`${API_CONFIG.supabase.url}/rest/v1/posts?id=eq.${postId}`, {
      method: 'PATCH',
      headers: {
        'apikey': API_CONFIG.supabase.key,
        'Authorization': `Bearer ${API_CONFIG.supabase.key}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error('Failed to update post');

    alert('Post updated successfully!');
    closeEditModal();
    loadPosts();

  } catch (error) {
    console.error('Error updating post:', error);
    alert('Failed to update post. Please try again.');
  }
}

async function togglePublish(postId, newStatus) {
  if (!confirm(`Are you sure you want to ${newStatus ? 'publish' : 'unpublish'} this post?`)) return;

  try {
    const response = await fetch(`${API_CONFIG.supabase.url}/rest/v1/posts?id=eq.${postId}`, {
      method: 'PATCH',
      headers: {
        'apikey': API_CONFIG.supabase.key,
        'Authorization': `Bearer ${API_CONFIG.supabase.key}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ published: newStatus })
    });

    if (!response.ok) throw new Error('Failed to update status');

    alert(`Post ${newStatus ? 'published' : 'unpublished'} successfully!`);
    loadPosts();

  } catch (error) {
    console.error('Error updating status:', error);
    alert('Failed to update status. Please try again.');
  }
}

async function deletePost(postId) {
  if (!confirm('Are you sure you want to DELETE this post? This action cannot be undone!')) return;

  try {
    const response = await fetch(`${API_CONFIG.supabase.url}/rest/v1/posts?id=eq.${postId}`, {
      method: 'DELETE',
      headers: {
        'apikey': API_CONFIG.supabase.key,
        'Authorization': `Bearer ${API_CONFIG.supabase.key}`
      }
    });

    if (!response.ok) throw new Error('Failed to delete post');

    alert('Post deleted successfully!');
    loadPosts();

  } catch (error) {
    console.error('Error deleting post:', error);
    alert('Failed to delete post. Please try again.');
  }
}

// ============ HASHTAGS MANAGEMENT ============

async function loadHashtags() {
  const loadingState = document.getElementById('loadingStateHashtags');
  const tableContainer = document.getElementById('tableContainerHashtags');

  loadingState.classList.remove('hidden');
  tableContainer.classList.add('hidden');

  try {
    const response = await fetch(`${API_CONFIG.supabase.url}/rest/v1/hashtags?select=*&order=name.asc`, {
      headers: {
        'apikey': API_CONFIG.supabase.key,
        'Authorization': `Bearer ${API_CONFIG.supabase.key}`
      }
    });

    if (!response.ok) throw new Error('Failed to load hashtags');

    allHashtags = await response.json();
    renderHashtags();

    loadingState.classList.add('hidden');
    tableContainer.classList.remove('hidden');

    lucide.createIcons();

  } catch (error) {
    console.error('Error loading hashtags:', error);
    loadingState.classList.add('hidden');
    // Still show table even if empty
    tableContainer.classList.remove('hidden');
  }
}

function renderHashtags() {
  const tbody = document.getElementById('hashtagsTableBody');

  if (allHashtags.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="px-6 py-12 text-center text-slate-400">
          No hashtags yet. Click "Add Hashtag" to create one.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = allHashtags.map(tag => `
    <tr class="border-b border-slate-700 hover:bg-slate-700/50 transition">
      <td class="px-6 py-4">
        <span class="font-semibold" style="color: ${tag.color}">${tag.name}</span>
      </td>
      <td class="px-6 py-4">
        <code class="text-xs text-slate-400">${tag.slug}</code>
      </td>
      <td class="px-6 py-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded" style="background-color: ${tag.color}"></div>
          <code class="text-xs text-slate-400">${tag.color}</code>
        </div>
      </td>
      <td class="px-6 py-4">
        <span class="text-sm text-slate-300">${tag.usage_count || 0} posts</span>
      </td>
      <td class="px-6 py-4 max-w-xs">
        <p class="text-sm text-slate-400 truncate">${tag.description || 'No description'}</p>
      </td>
      <td class="px-6 py-4">
        <div class="flex items-center gap-2">
          <button
            onclick="openEditHashtagModal(${tag.id})"
            class="p-2 bg-blue-600 hover:bg-blue-700 rounded transition"
            title="Edit"
          >
            <i data-lucide="edit-2" class="h-4 w-4"></i>
          </button>
          <button
            onclick="deleteHashtag(${tag.id})"
            class="p-2 bg-red-600 hover:bg-red-700 rounded transition"
            title="Delete"
          >
            <i data-lucide="trash-2" class="h-4 w-4"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openAddHashtagModal() {
  document.getElementById('hashtagModalTitle').textContent = 'Add Hashtag';
  document.getElementById('hashtagId').value = '';
  document.getElementById('hashtagForm').reset();
  document.getElementById('hashtagColor').value = '#ef4444';
  document.getElementById('hashtagColorText').value = '#ef4444';
  document.getElementById('hashtagModal').classList.add('active');
  lucide.createIcons();
}

function openEditHashtagModal(tagId) {
  const tag = allHashtags.find(t => t.id === tagId);
  if (!tag) return;

  document.getElementById('hashtagModalTitle').textContent = 'Edit Hashtag';
  document.getElementById('hashtagId').value = tag.id;
  document.getElementById('hashtagName').value = tag.name;
  document.getElementById('hashtagSlug').value = tag.slug;
  document.getElementById('hashtagColor').value = tag.color;
  document.getElementById('hashtagColorText').value = tag.color;
  document.getElementById('hashtagDescription').value = tag.description || '';
  document.getElementById('hashtagModal').classList.add('active');
  lucide.createIcons();
}

function closeHashtagModal() {
  document.getElementById('hashtagModal').classList.remove('active');
  document.getElementById('hashtagForm').reset();
}

async function handleHashtagSubmit(e) {
  e.preventDefault();

  const tagId = document.getElementById('hashtagId').value;
  const payload = {
    name: document.getElementById('hashtagName').value,
    slug: document.getElementById('hashtagSlug').value,
    color: document.getElementById('hashtagColor').value,
    description: document.getElementById('hashtagDescription').value
  };

  try {
    let response;
    if (tagId) {
      // Update existing
      response = await fetch(`${API_CONFIG.supabase.url}/rest/v1/hashtags?id=eq.${tagId}`, {
        method: 'PATCH',
        headers: {
          'apikey': API_CONFIG.supabase.key,
          'Authorization': `Bearer ${API_CONFIG.supabase.key}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(payload)
      });
    } else {
      // Create new
      response = await fetch(`${API_CONFIG.supabase.url}/rest/v1/hashtags`, {
        method: 'POST',
        headers: {
          'apikey': API_CONFIG.supabase.key,
          'Authorization': `Bearer ${API_CONFIG.supabase.key}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(payload)
      });
    }

    if (!response.ok) throw new Error('Failed to save hashtag');

    alert(`Hashtag ${tagId ? 'updated' : 'created'} successfully!`);
    closeHashtagModal();
    loadHashtags();

  } catch (error) {
    console.error('Error saving hashtag:', error);
    alert('Failed to save hashtag. Please try again.');
  }
}

async function deleteHashtag(tagId) {
  if (!confirm('Are you sure you want to delete this hashtag?')) return;

  try {
    const response = await fetch(`${API_CONFIG.supabase.url}/rest/v1/hashtags?id=eq.${tagId}`, {
      method: 'DELETE',
      headers: {
        'apikey': API_CONFIG.supabase.key,
        'Authorization': `Bearer ${API_CONFIG.supabase.key}`
      }
    });

    if (!response.ok) throw new Error('Failed to delete hashtag');

    alert('Hashtag deleted successfully!');
    loadHashtags();

  } catch (error) {
    console.error('Error deleting hashtag:', error);
    alert('Failed to delete hashtag. Please try again.');
  }
}

// ============ CATEGORIES MANAGEMENT ============

async function loadCategories() {
  const loadingState = document.getElementById('loadingStateCategories');
  const tableContainer = document.getElementById('tableContainerCategories');

  loadingState.classList.remove('hidden');
  tableContainer.classList.add('hidden');

  try {
    const response = await fetch(`${API_CONFIG.supabase.url}/rest/v1/categories?select=*&order=name.asc`, {
      headers: {
        'apikey': API_CONFIG.supabase.key,
        'Authorization': `Bearer ${API_CONFIG.supabase.key}`
      }
    });

    if (!response.ok) throw new Error('Failed to load categories');

    allCategories = await response.json();
    renderCategories();
    updateCategoryFilters();

    loadingState.classList.add('hidden');
    tableContainer.classList.remove('hidden');

    lucide.createIcons();

  } catch (error) {
    console.error('Error loading categories:', error);
    loadingState.classList.add('hidden');
    tableContainer.classList.remove('hidden');
  }
}

function updateCategoryFilters() {
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.innerHTML = `
    <option value="">All Categories</option>
    ${allCategories.map(cat => `<option value="${cat.slug}">${cat.name}</option>`).join('')}
  `;
}

function renderCategories() {
  const tbody = document.getElementById('categoriesTableBody');

  if (allCategories.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="px-6 py-12 text-center text-slate-400">
          No categories yet. Click "Add Category" to create one.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = allCategories.map(cat => `
    <tr class="border-b border-slate-700 hover:bg-slate-700/50 transition">
      <td class="px-6 py-4">
        <span class="font-semibold" style="color: ${cat.color}">${cat.name}</span>
      </td>
      <td class="px-6 py-4">
        <code class="text-xs text-slate-400">${cat.slug}</code>
      </td>
      <td class="px-6 py-4">
        ${cat.icon ? `<i data-lucide="${cat.icon}" class="h-5 w-5" style="color: ${cat.color}"></i>` : '<span class="text-slate-500">-</span>'}
      </td>
      <td class="px-6 py-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded" style="background-color: ${cat.color}"></div>
          <code class="text-xs text-slate-400">${cat.color}</code>
        </div>
      </td>
      <td class="px-6 py-4">
        <span class="text-sm text-slate-300">${cat.post_count || 0} posts</span>
      </td>
      <td class="px-6 py-4 max-w-xs">
        <p class="text-sm text-slate-400 truncate">${cat.description || 'No description'}</p>
      </td>
      <td class="px-6 py-4">
        <div class="flex items-center gap-2">
          <button
            onclick="openEditCategoryModal(${cat.id})"
            class="p-2 bg-blue-600 hover:bg-blue-700 rounded transition"
            title="Edit"
          >
            <i data-lucide="edit-2" class="h-4 w-4"></i>
          </button>
          <button
            onclick="deleteCategory(${cat.id})"
            class="p-2 bg-red-600 hover:bg-red-700 rounded transition"
            title="Delete"
          >
            <i data-lucide="trash-2" class="h-4 w-4"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openAddCategoryModal() {
  document.getElementById('categoryModalTitle').textContent = 'Add Category';
  document.getElementById('categoryId').value = '';
  document.getElementById('categoryForm').reset();
  document.getElementById('categoryColor').value = '#3b82f6';
  document.getElementById('categoryColorText').value = '#3b82f6';
  document.getElementById('categoryModal').classList.add('active');
  lucide.createIcons();
}

function openEditCategoryModal(catId) {
  const cat = allCategories.find(c => c.id === catId);
  if (!cat) return;

  document.getElementById('categoryModalTitle').textContent = 'Edit Category';
  document.getElementById('categoryId').value = cat.id;
  document.getElementById('categoryName').value = cat.name;
  document.getElementById('categorySlug').value = cat.slug;
  document.getElementById('categoryIcon').value = cat.icon || '';
  document.getElementById('categoryColor').value = cat.color;
  document.getElementById('categoryColorText').value = cat.color;
  document.getElementById('categoryDescription').value = cat.description || '';
  document.getElementById('categoryModal').classList.add('active');
  lucide.createIcons();
}

function closeCategoryModal() {
  document.getElementById('categoryModal').classList.remove('active');
  document.getElementById('categoryForm').reset();
}

async function handleCategorySubmit(e) {
  e.preventDefault();

  const catId = document.getElementById('categoryId').value;
  const payload = {
    name: document.getElementById('categoryName').value,
    slug: document.getElementById('categorySlug').value,
    icon: document.getElementById('categoryIcon').value || null,
    color: document.getElementById('categoryColor').value,
    description: document.getElementById('categoryDescription').value
  };

  try {
    let response;
    if (catId) {
      // Update existing
      response = await fetch(`${API_CONFIG.supabase.url}/rest/v1/categories?id=eq.${catId}`, {
        method: 'PATCH',
        headers: {
          'apikey': API_CONFIG.supabase.key,
          'Authorization': `Bearer ${API_CONFIG.supabase.key}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(payload)
      });
    } else {
      // Create new
      response = await fetch(`${API_CONFIG.supabase.url}/rest/v1/categories`, {
        method: 'POST',
        headers: {
          'apikey': API_CONFIG.supabase.key,
          'Authorization': `Bearer ${API_CONFIG.supabase.key}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(payload)
      });
    }

    if (!response.ok) throw new Error('Failed to save category');

    alert(`Category ${catId ? 'updated' : 'created'} successfully!`);
    closeCategoryModal();
    loadCategories();

  } catch (error) {
    console.error('Error saving category:', error);
    alert('Failed to save category. Please try again.');
  }
}

async function deleteCategory(catId) {
  if (!confirm('Are you sure you want to delete this category?')) return;

  try {
    const response = await fetch(`${API_CONFIG.supabase.url}/rest/v1/categories?id=eq.${catId}`, {
      method: 'DELETE',
      headers: {
        'apikey': API_CONFIG.supabase.key,
        'Authorization': `Bearer ${API_CONFIG.supabase.key}`
      }
    });

    if (!response.ok) throw new Error('Failed to delete category');

    alert('Category deleted successfully!');
    loadCategories();

  } catch (error) {
    console.error('Error deleting category:', error);
    alert('Failed to delete category. Please try again.');
  }
}

// Make functions global
window.openEditModal = openEditModal;
window.closeEditModal = closeEditModal;
window.togglePublish = togglePublish;
window.deletePost = deletePost;
window.toggleTagsDropdown = toggleTagsDropdown;
window.toggleTag = toggleTag;
window.openAddHashtagModal = openAddHashtagModal;
window.openEditHashtagModal = openEditHashtagModal;
window.closeHashtagModal = closeHashtagModal;
window.deleteHashtag = deleteHashtag;
window.openAddCategoryModal = openAddCategoryModal;
window.openEditCategoryModal = openEditCategoryModal;
window.closeCategoryModal = closeCategoryModal;
window.deleteCategory = deleteCategory;
