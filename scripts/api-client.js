// API Client for GearVN Blog Backend
// Handles all API requests with authentication

const API_CONFIG = {
    baseURL: 'http://localhost:8080/api',
    timeout: 10000,
    // Supabase REST API fallback
    supabase: {
        url: 'https://qibhlrsdykpkbsnelubz.supabase.co',
        key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYmhscnNkeWtwa2JzbmVsdWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNDc4NzEsImV4cCI6MjA3NzkyMzg3MX0.jmwZ8r_7dC8fU5hIlgXrFZUpJBxE07bZyBEuLoG1SrM'
    }
};

class APIClient {
    constructor() {
        this.token = localStorage.getItem('authToken');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
    }

    // ============ AUTHENTICATION ============

    setToken(token) {
        this.token = token;
        localStorage.setItem('authToken', token);
    }

    setUser(user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(user));
    }

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    }

    isLoggedIn() {
        return !!this.token && !!this.user;
    }

    getUser() {
        return this.user;
    }

    getCurrentUser() {
        return this.user;
    }

    // ============ REQUEST WRAPPER ============

    async request(endpoint, options = {}) {
        const url = `${API_CONFIG.baseURL}${endpoint}`;

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.error || error.message || `HTTP ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    }

    // ============ AUTH ENDPOINTS ============

    async register(email, password, username) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, username }),
        });

        this.setToken(data.token);
        this.setUser(data.user);
        return data;
    }

    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        this.setToken(data.token);
        this.setUser(data.user);
        return data;
    }

    async getMe() {
        const user = await this.request('/auth/me');
        this.setUser(user);
        return user;
    }

    // ============ POSTS ENDPOINTS ============

    async getPosts(params = {}) {
        try {
            // Try Go backend first
            const query = new URLSearchParams(params);
            const queryString = query.toString();
            return await this.request(`/posts${queryString ? '?' + queryString : ''}`);
        } catch (error) {
            console.warn('⚠️ Go backend unavailable, using Supabase REST API fallback');

            // Fallback to Supabase REST API
            const limit = params.limit || 50;
            const postsUrl = `${API_CONFIG.supabase.url}/rest/v1/posts?select=*&published=eq.true&order=created_at.desc&limit=${limit}`;

            const postsResponse = await fetch(postsUrl, {
                headers: {
                    'apikey': API_CONFIG.supabase.key,
                    'Authorization': `Bearer ${API_CONFIG.supabase.key}`
                }
            });

            if (!postsResponse.ok) {
                throw new Error(`Supabase API error: ${postsResponse.status}`);
            }

            const posts = await postsResponse.json();

            // Get unique creator IDs and fetch users
            const creatorIds = [...new Set(posts.map(p => p.creator_id).filter(Boolean))];
            let creatorsMap = {};

            if (creatorIds.length > 0) {
                const usersUrl = `${API_CONFIG.supabase.url}/rest/v1/users?select=id,username,full_name,avatar_url&id=in.(${creatorIds.join(',')})`;
                const usersResponse = await fetch(usersUrl, {
                    headers: {
                        'apikey': API_CONFIG.supabase.key,
                        'Authorization': `Bearer ${API_CONFIG.supabase.key}`
                    }
                });

                if (usersResponse.ok) {
                    const users = await usersResponse.json();
                    creatorsMap = users.reduce((acc, user) => {
                        acc[user.id.toString()] = user;
                        return acc;
                    }, {});
                }
            }

            // Transform posts to include creator info
            return posts.map(post => {
                const creator = creatorsMap[post.creator_id];
                return {
                    ...post,
                    creator_name: creator?.full_name || creator?.username || null,
                    creator_avatar: creator?.avatar_url || null
                };
            });
        }
    }

    async getPostById(id) {
        try {
            // Try Go backend first
            return await this.request(`/posts/${id}`);
        } catch (error) {
            console.warn('⚠️ Go backend unavailable, using Supabase REST API fallback');

            // Fallback to Supabase REST API
            const url = `${API_CONFIG.supabase.url}/rest/v1/posts?select=*&id=eq.${id}`;

            const response = await fetch(url, {
                headers: {
                    'apikey': API_CONFIG.supabase.key,
                    'Authorization': `Bearer ${API_CONFIG.supabase.key}`
                }
            });

            if (!response.ok) {
                throw new Error(`Supabase API error: ${response.status}`);
            }

            const posts = await response.json();
            const post = posts[0] || null;

            if (!post) {
                return null;
            }

            // Fetch creator info if post has creator_id
            if (post.creator_id) {
                const usersUrl = `${API_CONFIG.supabase.url}/rest/v1/users?select=id,username,full_name,avatar_url&id=eq.${post.creator_id}`;
                const usersResponse = await fetch(usersUrl, {
                    headers: {
                        'apikey': API_CONFIG.supabase.key,
                        'Authorization': `Bearer ${API_CONFIG.supabase.key}`
                    }
                });

                if (usersResponse.ok) {
                    const users = await usersResponse.json();
                    const creator = users[0];
                    if (creator) {
                        post.creator_name = creator.full_name || creator.username;
                        post.creator_avatar = creator.avatar_url;
                    }
                }
            }

            return post;
        }
    }

    // ============ CREATORS ENDPOINTS ============

    async getCreators() {
        return await this.request('/creators');
    }

    async getCreatorById(id) {
        return await this.request(`/creators/${id}`);
    }

    async getCreatorPosts(id) {
        return await this.request(`/creators/${id}/posts`);
    }

    // ============ BOOKMARKS ENDPOINTS ============

    async getBookmarks() {
        const bookmarks = await this.request('/user/bookmarks');
        // Convert array to object for easy lookup
        return bookmarks.reduce((acc, postId) => {
            acc[postId] = true;
            return acc;
        }, {});
    }

    async addBookmark(postId) {
        return await this.request(`/user/bookmarks/${postId}`, {
            method: 'POST',
        });
    }

    async removeBookmark(postId) {
        return await this.request(`/user/bookmarks/${postId}`, {
            method: 'DELETE',
        });
    }

    // ============ FOLLOWING ENDPOINTS ============

    async getFollowing() {
        const following = await this.request('/user/following');
        // Convert array to object for easy lookup
        return following.reduce((acc, creatorId) => {
            acc[creatorId] = true;
            return acc;
        }, {});
    }

    async followCreator(creatorId) {
        return await this.request(`/user/following/${creatorId}`, {
            method: 'POST',
        });
    }

    async unfollowCreator(creatorId) {
        return await this.request(`/user/following/${creatorId}`, {
            method: 'DELETE',
        });
    }

    // ============ UPVOTES ENDPOINTS ============

    async getUpvotes() {
        const upvotes = await this.request('/user/upvotes');
        // Convert array to object for easy lookup
        return upvotes.reduce((acc, postId) => {
            acc[postId] = true;
            return acc;
        }, {});
    }

    async upvotePost(postId) {
        return await this.request(`/user/upvotes/${postId}`, {
            method: 'POST',
        });
    }

    async removeUpvote(postId) {
        return await this.request(`/user/upvotes/${postId}`, {
            method: 'DELETE',
        });
    }

    // ============ COMMENTS ENDPOINTS ============

    async getComments(postId) {
        try {
            // Try Go backend first
            return await this.request(`/posts/${postId}/comments`);
        } catch (error) {
            console.warn('⚠️ Go backend unavailable, using Supabase REST API fallback for comments');

            // Fallback to Supabase REST API
            const url = `${API_CONFIG.supabase.url}/rest/v1/comments?select=*&post_id=eq.${postId}&order=created_at.desc`;

            const response = await fetch(url, {
                headers: {
                    'apikey': API_CONFIG.supabase.key,
                    'Authorization': `Bearer ${API_CONFIG.supabase.key}`
                }
            });

            if (!response.ok) {
                // Return empty array if error (comments are optional)
                return [];
            }

            return await response.json();
        }
    }

    async addComment(postId, content, parentId = null) {
        return await this.request(`/posts/${postId}/comments`, {
            method: 'POST',
            body: JSON.stringify({ content, parent_id: parentId }),
        });
    }
}

// Export singleton instance
const api = new APIClient();

// Make available globally
window.api = api;

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
}
