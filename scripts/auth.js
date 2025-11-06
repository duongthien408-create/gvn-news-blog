// Authentication System with Avatar Upload
const API_CONFIG = {
  supabase: {
    url: 'https://qibhlrsdykpkbsnelubz.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYmhscnNkeWtwa2JzbmVsdWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNDc4NzEsImV4cCI6MjA3NzkyMzg3MX0.jmwZ8r_7dC8fU5hIlgXrFZUpJBxE07bZyBEuLoG1SrM'
  }
};

const SESSION_KEY = 'gvn_session';

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

async function uploadToSupabaseStorage(file, bucket = 'avatars') {
  const fileName = `${Date.now()}_${file.name}`;
  const filePath = `${bucket}/${fileName}`;

  // Upload to Supabase Storage
  const uploadUrl = `${API_CONFIG.supabase.url}/storage/v1/object/${filePath}`;

  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'apikey': API_CONFIG.supabase.key,
      'Authorization': `Bearer ${API_CONFIG.supabase.key}`,
      'Content-Type': file.type,
    },
    body: file
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Upload failed: ${error}`);
  }

  // Return public URL
  const publicUrl = `${API_CONFIG.supabase.url}/storage/v1/object/public/${filePath}`;
  return publicUrl;
}

async function loginUser(email, password) {
  // Get user by email
  const users = await supabaseRequest(`/users?email=eq.${email}&select=*`);

  if (users.length === 0) {
    throw new Error('User not found');
  }

  const user = users[0];

  // Verify password (simple bcrypt check - in production use proper bcrypt verification)
  // For demo, we just check if password is "password123"
  if (password !== 'password123') {
    throw new Error('Invalid password');
  }

  // Update last_login_at
  await supabaseRequest(`/users?id=eq.${user.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ last_login_at: new Date().toISOString() })
  });

  return user;
}

function saveSession(user) {
  const session = {
    user: user,
    timestamp: Date.now(),
    expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function getSession() {
  const sessionStr = localStorage.getItem(SESSION_KEY);
  if (!sessionStr) return null;

  try {
    const session = JSON.parse(sessionStr);

    // Check if expired
    if (Date.now() > session.expiresAt) {
      clearSession();
      return null;
    }

    return session;
  } catch (error) {
    console.error('Failed to parse session:', error);
    clearSession();
    return null;
  }
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function getCurrentUser() {
  const session = getSession();
  return session ? session.user : null;
}

function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = '/login.html';
    return null;
  }
  return user;
}

// ============ LOGIN PAGE LOGIC ============

if (window.location.pathname.includes('login.html')) {
  // Check if already logged in
  const currentUser = getCurrentUser();
  if (currentUser) {
    window.location.href = '/index.html';
  }

  const loginForm = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');
  const errorText = document.getElementById('error-text');

  function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
    if (window.lucide?.createIcons) {
      window.lucide.createIcons();
    }
  }

  function hideError() {
    errorMessage.classList.add('hidden');
  }

  // Form submit
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideError();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const submitBtn = loginForm.querySelector('[type="submit"]');

      try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing in...';

        const user = await loginUser(email, password);
        saveSession(user);

        // Redirect to homepage
        window.location.href = '/index.html';
      } catch (error) {
        console.error('Login failed:', error);
        showError(error.message);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign in';
      }
    });
  }

  // Test account buttons
  document.querySelectorAll('.test-login-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const email = e.currentTarget.getAttribute('data-test-login');
      document.getElementById('email').value = email;
      document.getElementById('password').value = 'password123';

      // Auto submit
      loginForm.dispatchEvent(new Event('submit'));
    });
  });
}

// ============ AVATAR UPLOAD HELPER ============

window.uploadAvatar = async function(fileInput) {
  const file = fileInput.files[0];
  if (!file) return null;

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select an image file');
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size must be less than 5MB');
  }

  try {
    const url = await uploadToSupabaseStorage(file, 'avatars');
    return url;
  } catch (error) {
    console.error('Upload failed:', error);
    throw new Error('Failed to upload avatar. Please try again.');
  }
};

// ============ EXPORT FOR OTHER SCRIPTS ============

window.auth = {
  getCurrentUser,
  requireAuth,
  saveSession,
  clearSession,
  getSession,
  uploadAvatar: window.uploadAvatar
};

// ============ AUTO-PROTECT CMS PAGES ============

const protectedPages = ['settings.html', 'edit-post.html'];
const currentPage = window.location.pathname.split('/').pop();

if (protectedPages.includes(currentPage)) {
  const user = requireAuth();
  if (!user) {
    // Will redirect to login
  }
}

console.log('Auth system loaded');
