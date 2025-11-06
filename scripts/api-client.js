// API Client for GearVN Blog Backend
// Handles all API requests with authentication

const API_CONFIG = {
    baseURL: 'http://localhost:8080/api',
    timeout: 10000,
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
        const query = new URLSearchParams(params);
        const queryString = query.toString();
        return await this.request(`/posts${queryString ? '?' + queryString : ''}`);
    }

    async getPostById(id) {
        return await this.request(`/posts/${id}`);
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
        return await this.request(`/posts/${postId}/comments`);
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
