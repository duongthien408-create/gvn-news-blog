// Edit Post Modal Handler

// Check if user can edit post
function canEditPost(post) {
  if (!window.api?.isLoggedIn()) {
    return false;
  }

  const currentUser = window.api.getCurrentUser();
  if (!currentUser) {
    return false;
  }

  // Admin can edit all posts
  if (currentUser.role === 'admin') {
    return true;
  }

  // User can only edit their own posts
  if (post.creator_id && currentUser.id) {
    return post.creator_id === currentUser.id.toString();
  }

  return false;
}

// Open edit post modal
export async function openEditModal(postId) {
  const post = await window.api.getPostById(postId);

  if (!post) {
    alert('Không thể tải bài viết');
    return;
  }

  if (!canEditPost(post)) {
    alert('Bạn không có quyền chỉnh sửa bài viết này');
    return;
  }

  const currentUser = window.api.getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';

  // Create modal
  const modal = document.createElement('div');
  modal.id = 'edit-post-modal';
  modal.className = 'fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/80 backdrop-blur-sm p-4';

  modal.innerHTML = `
    <div class="relative my-8 w-full max-w-4xl rounded-2xl border border-theme-border bg-theme-surface/98 backdrop-blur p-8">
      <!-- Close Button -->
      <button data-close-edit-modal class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-theme-card text-theme-secondary transition hover:bg-theme-panel hover:text-theme-primary">
        <i data-lucide="x" class="h-6 w-6"></i>
      </button>

      <h2 class="text-2xl font-bold text-theme-primary mb-6">Chỉnh sửa bài viết</h2>

      <form id="edit-post-form" class="space-y-6">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-theme-secondary mb-2">Tiêu đề *</label>
          <input
            type="text"
            name="title"
            value="${post.title || ''}"
            required
            class="w-full rounded-xl border border-theme-border bg-theme-card px-4 py-3 text-theme-primary placeholder:text-theme-muted focus:border-theme-accent focus:outline-none"
          />
        </div>

        <!-- Excerpt -->
        <div>
          <label class="block text-sm font-medium text-theme-secondary mb-2">Mô tả ngắn</label>
          <textarea
            name="excerpt"
            rows="3"
            class="w-full rounded-xl border border-theme-border bg-theme-card px-4 py-3 text-theme-primary placeholder:text-theme-muted focus:border-theme-accent focus:outline-none"
          >${post.excerpt || ''}</textarea>
        </div>

        <!-- Content -->
        <div>
          <label class="block text-sm font-medium text-theme-secondary mb-2">Nội dung</label>
          <textarea
            name="content"
            rows="8"
            class="w-full rounded-xl border border-theme-border bg-theme-card px-4 py-3 text-theme-primary placeholder:text-theme-muted focus:border-theme-accent focus:outline-none"
          >${post.content || ''}</textarea>
        </div>

        <!-- Cover Image -->
        <div>
          <label class="block text-sm font-medium text-theme-secondary mb-2">URL ảnh bìa</label>
          <input
            type="url"
            name="cover_image"
            value="${post.cover_image || ''}"
            class="w-full rounded-xl border border-theme-border bg-theme-card px-4 py-3 text-theme-primary placeholder:text-theme-muted focus:border-theme-accent focus:outline-none"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <!-- Category -->
          <div>
            <label class="block text-sm font-medium text-theme-secondary mb-2">Danh mục</label>
            <input
              type="text"
              name="category"
              value="${post.category || ''}"
              class="w-full rounded-xl border border-theme-border bg-theme-card px-4 py-3 text-theme-primary placeholder:text-theme-muted focus:border-theme-accent focus:outline-none"
            />
          </div>

          <!-- Read Time -->
          <div>
            <label class="block text-sm font-medium text-theme-secondary mb-2">Thời gian đọc</label>
            <input
              type="text"
              name="read_time"
              value="${post.read_time || '5 min read'}"
              placeholder="5 min read"
              class="w-full rounded-xl border border-theme-border bg-theme-card px-4 py-3 text-theme-primary placeholder:text-theme-muted focus:border-theme-accent focus:outline-none"
            />
          </div>
        </div>

        <!-- Tags -->
        <div>
          <label class="block text-sm font-medium text-theme-secondary mb-2">Tags (phân cách bởi dấu phẩy)</label>
          <input
            type="text"
            name="tags"
            value="${post.tags ? post.tags.join(', ') : ''}"
            placeholder="tech, gaming, hardware"
            class="w-full rounded-xl border border-theme-border bg-theme-card px-4 py-3 text-theme-primary placeholder:text-theme-muted focus:border-theme-accent focus:outline-none"
          />
        </div>

        ${isAdmin ? `
          <!-- Creator Selection (Admin only) -->
          <div>
            <label class="block text-sm font-medium text-theme-secondary mb-2">Tác giả (Admin)</label>
            <select
              name="creator_id"
              id="creator-select"
              class="w-full rounded-xl border border-theme-border bg-theme-card px-4 py-3 text-theme-primary focus:border-theme-accent focus:outline-none"
            >
              <option value="">Đang tải...</option>
            </select>
          </div>
        ` : ''}

        <!-- Submit Buttons -->
        <div class="flex items-center gap-4 pt-4 border-t border-theme-border">
          <button
            type="submit"
            class="flex-1 rounded-full bg-theme-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-theme-accent-hover"
          >
            <i data-lucide="save" class="inline h-4 w-4 mr-2"></i>
            Lưu thay đổi
          </button>
          <button
            type="button"
            data-close-edit-modal
            class="px-6 py-3 text-sm font-semibold text-theme-secondary transition hover:text-theme-primary"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  // Initialize Lucide icons
  if (window.lucide?.createIcons) {
    window.lucide.createIcons();
  }

  // Load creators for admin
  if (isAdmin) {
    loadCreatorsForSelect(post.creator_id);
  }

  // Close handlers
  modal.addEventListener('click', (e) => {
    if (e.target.id === 'edit-post-modal' || e.target.closest('[data-close-edit-modal]')) {
      closeEditModal();
    }
  });

  // Form submit handler
  const form = modal.querySelector('#edit-post-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleEditSubmit(postId, form, isAdmin);
  });
}

// Load creators for admin select dropdown
async function loadCreatorsForSelect(currentCreatorId) {
  const select = document.getElementById('creator-select');
  if (!select) return;

  try {
    // Fetch all users who can be creators
    const response = await fetch('https://qibhlrsdykpkbsnelubz.supabase.co/rest/v1/users?select=id,username,full_name&order=full_name', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYmhscnNkeWtwa2JzbmVsdWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNDc4NzEsImV4cCI6MjA3NzkyMzg3MX0.jmwZ8r_7dC8fU5hIlgXrFZUpJBxE07bZyBEuLoG1SrM',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYmhscnNkeWtwa2JzbmVsdWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNDc4NzEsImV4cCI6MjA3NzkyMzg3MX0.jmwZ8r_7dC8fU5hIlgXrFZUpJBxE07bZyBEuLoG1SrM'
      }
    });

    const users = await response.json();

    select.innerHTML = users.map(user => `
      <option value="${user.id}" ${user.id.toString() === currentCreatorId ? 'selected' : ''}>
        ${user.full_name || user.username} (ID: ${user.id})
      </option>
    `).join('');
  } catch (error) {
    console.error('Failed to load creators:', error);
    select.innerHTML = '<option value="">Không thể tải danh sách tác giả</option>';
  }
}

// Handle edit form submission
async function handleEditSubmit(postId, form, isAdmin) {
  const formData = new FormData(form);

  const data = {
    title: formData.get('title'),
    excerpt: formData.get('excerpt'),
    content: formData.get('content'),
    cover_image: formData.get('cover_image'),
    category: formData.get('category'),
    tags: formData.get('tags').split(',').map(t => t.trim()).filter(Boolean),
    read_time: formData.get('read_time'),
  };

  // Admin can change creator
  if (isAdmin && formData.get('creator_id')) {
    data.creator_id = formData.get('creator_id');

    // Fetch creator info
    const creatorResponse = await fetch(`https://qibhlrsdykpkbsnelubz.supabase.co/rest/v1/users?select=id,username,full_name,avatar_url&id=eq.${data.creator_id}`, {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYmhscnNkeWtwa2JzbmVsdWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNDc4NzEsImV4cCI6MjA3NzkyMzg3MX0.jmwZ8r_7dC8fU5hIlgXrFZUpJBxE07bZyBEuLoG1SrM',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYmhscnNkeWtwa2JzbmVsdWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNDc4NzEsImV4cCI6MjA3NzkyMzg3MX0.jmwZ8r_7dC8fU5hIlgXrFZUpJBxE07bZyBEuLoG1SrM'
      }
    });
    const creators = await creatorResponse.json();
    const creator = creators[0];

    if (creator) {
      data.creator_name = creator.full_name || creator.username;
      data.creator_avatar = creator.avatar_url;
    }
  }

  try {
    const endpoint = isAdmin ? `/cms/posts/${postId}` : `/posts/${postId}`;
    const response = await window.api.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });

    if (response.success) {
      alert('Cập nhật bài viết thành công!');
      closeEditModal();

      // Reload page to show updated content
      window.location.reload();
    } else {
      alert('Có lỗi xảy ra: ' + (response.error || 'Unknown error'));
    }
  } catch (error) {
    console.error('Failed to update post:', error);
    alert('Không thể cập nhật bài viết: ' + error.message);
  }
}

// Close edit modal
function closeEditModal() {
  const modal = document.getElementById('edit-post-modal');
  if (modal) {
    modal.remove();
    document.body.style.overflow = '';
  }
}

// Export functions
window.openEditModal = openEditModal;
window.closeEditModal = closeEditModal;
window.canEditPost = canEditPost;
