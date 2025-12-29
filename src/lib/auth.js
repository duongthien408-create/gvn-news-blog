// G-Auth API functions
const API_BASE = 'https://api-gauth.uat.gearvn.xyz';
const TENANT_ID = '019b01a2-3647-7a8f-98ad-67cc00c35d8c';
const TOKEN_KEY = 'g_auth_access_token';
const REFRESH_KEY = 'g_auth_refresh_token';
const EXPIRES_KEY = 'g_auth_expires_at';

/**
 * Login with username and password
 */
export async function loginWithUsername(username, password) {
  const res = await fetch(`${API_BASE}/v1/admin/auth/login/username`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Tenant-ID': TENANT_ID,
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Đăng nhập thất bại');
  }

  const { data } = await res.json();
  saveTokens(data);
  return data;
}

/**
 * Get current user info
 */
export async function getMe() {
  const token = getStoredToken();
  if (!token) throw new Error('Chưa đăng nhập');

  const res = await fetch(`${API_BASE}/v1/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    if (res.status === 401) {
      clearStoredTokens();
    }
    throw new Error('Không thể lấy thông tin người dùng');
  }

  const { data } = await res.json();
  return data;
}

/**
 * Logout - clear tokens and call API
 */
export async function logout() {
  const token = getStoredToken();
  if (token) {
    try {
      await fetch(`${API_BASE}/v1/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // Ignore logout API errors
    }
  }
  clearStoredTokens();
}

/**
 * Save tokens to localStorage
 */
function saveTokens(data) {
  const expiresAt = Date.now() + data.expiresIn * 1000;
  localStorage.setItem(TOKEN_KEY, data.accessToken);
  localStorage.setItem(REFRESH_KEY, data.refreshToken);
  localStorage.setItem(EXPIRES_KEY, expiresAt.toString());
}

/**
 * Get stored access token
 */
export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Clear all stored tokens
 */
export function clearStoredTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(EXPIRES_KEY);
}

/**
 * Check if token is expired
 */
export function isTokenExpired() {
  const expiresAt = localStorage.getItem(EXPIRES_KEY);
  if (!expiresAt) return true;
  return Date.now() >= parseInt(expiresAt);
}
