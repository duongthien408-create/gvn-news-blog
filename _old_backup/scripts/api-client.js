// API Client for GearVN Blog Backend v2.0
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

    // ============================================
    // AUTHENTICATION
    // ============================================

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

    // ============================================
    // REQUEST WRAPPER
    // ============================================

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

    // ============================================
    // AUTH ENDPOINTS
    // ============================================

    async register(email, password, username) {
        const data = await this.request('/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, username }),
        });

        this.setToken(data.token);
        this.setUser(data.user);
        return data;
    }

    async login(email, password) {
        const data = await this.request('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        this.setToken(data.token);
        this.setUser(data.user);
        return data;
    }

    async getMe() {
        const user = await this.request('/me');
        this.setUser(user);
        return user;
    }

    async updateProfile(profileData) {
        return await this.request('/me', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    }

    // ============================================
    // POSTS ENDPOINTS
    // ============================================

    async getPosts(params = {}) {
        const query = new URLSearchParams(params);
        const queryString = query.toString();
        return await this.request(`/posts${queryString ? '?' + queryString : ''}`);
    }

    async getPostBySlug(slug) {
        return await this.request(`/posts/${slug}`);
    }

    // Backward compatibility
    async getPostById(id) {
        console.warn('getPostById is deprecated, use getPostBySlug instead');
        return await this.getPostBySlug(id);
    }

    async votePost(postId, voteType) {
        // voteType: 1 (upvote), -1 (downvote), 0 (remove vote)
        return await this.request(`/posts/${postId}/vote`, {
            method: 'POST',
            body: JSON.stringify({ vote_type: voteType }),
        });
    }

    async upvotePost(postId) {
        return await this.votePost(postId, 1);
    }

    async downvotePost(postId) {
        return await this.votePost(postId, -1);
    }

    async removeVote(postId) {
        return await this.votePost(postId, 0);
    }

    async getUserVote(postId) {
        return await this.request(`/posts/${postId}/vote`);
    }

    async bookmarkPost(postId) {
        return await this.request(`/posts/${postId}/bookmark`, {
            method: 'POST',
        });
    }

    // Backward compatibility
    async addBookmark(postId) {
        return await this.bookmarkPost(postId);
    }

    async removeBookmark(postId) {
        return await this.bookmarkPost(postId); // Same endpoint toggles
    }

    // ============================================
    // BOOKMARKS ENDPOINTS
    // ============================================

    async getBookmarks() {
        return await this.request('/bookmarks');
    }

    // ============================================
    // CREATORS ENDPOINTS
    // ============================================

    async getCreators(params = {}) {
        const query = new URLSearchParams(params);
        const queryString = query.toString();
        return await this.request(`/creators${queryString ? '?' + queryString : ''}`);
    }

    async getCreatorBySlug(slug) {
        return await this.request(`/creators/${slug}`);
    }

    // Backward compatibility
    async getCreatorById(id) {
        console.warn('getCreatorById is deprecated, use getCreatorBySlug instead');
        return await this.getCreatorBySlug(id);
    }

    async getCreatorPosts(slug) {
        // Posts are now included in getCreatorBySlug response
        const creator = await this.getCreatorBySlug(slug);
        return creator.posts || [];
    }

    async followCreator(creatorId) {
        return await this.request(`/creators/${creatorId}/follow`, {
            method: 'POST',
        });
    }

    async unfollowCreator(creatorId) {
        return await this.followCreator(creatorId); // Same endpoint toggles
    }

    async getCreatorFollowers(creatorId, params = {}) {
        const query = new URLSearchParams(params);
        const queryString = query.toString();
        return await this.request(`/creators/${creatorId}/followers${queryString ? '?' + queryString : ''}`);
    }

    async getFollowingCreators() {
        return await this.request('/following/creators');
    }

    // Backward compatibility
    async getFollowing() {
        return await this.getFollowingCreators();
    }

    // ============================================
    // TAGS ENDPOINTS
    // ============================================

    async getTags(params = {}) {
        const query = new URLSearchParams(params);
        const queryString = query.toString();
        return await this.request(`/tags${queryString ? '?' + queryString : ''}`);
    }

    async getTagBySlug(slug) {
        return await this.request(`/tags/${slug}`);
    }

    async getTrendingTags(limit = 20) {
        return await this.request(`/tags/trending?limit=${limit}`);
    }

    // ============================================
    // COMMENTS ENDPOINTS
    // ============================================

    async getComments(postId) {
        return await this.request(`/posts/${postId}/comments`);
    }

    async addComment(postId, content, parentId = null) {
        return await this.request(`/posts/${postId}/comments`, {
            method: 'POST',
            body: JSON.stringify({ content, parent_id: parentId }),
        });
    }

    async voteComment(commentId, voteType) {
        // voteType: 1 (upvote), -1 (downvote), 0 (remove vote)
        return await this.request(`/comments/${commentId}/vote`, {
            method: 'POST',
            body: JSON.stringify({ vote_type: voteType }),
        });
    }

    async upvoteComment(commentId) {
        return await this.voteComment(commentId, 1);
    }

    async downvoteComment(commentId) {
        return await this.voteComment(commentId, -1);
    }

    async updateComment(commentId, content) {
        return await this.request(`/comments/${commentId}`, {
            method: 'PUT',
            body: JSON.stringify({ content }),
        });
    }

    async deleteComment(commentId) {
        return await this.request(`/comments/${commentId}`, {
            method: 'DELETE',
        });
    }

    // ============================================
    // PRODUCTS ENDPOINTS
    // ============================================

    async getProducts(params = {}) {
        const query = new URLSearchParams(params);
        const queryString = query.toString();
        return await this.request(`/products${queryString ? '?' + queryString : ''}`);
    }

    async getProductBySlug(slug) {
        return await this.request(`/products/${slug}`);
    }

    async getBrands() {
        return await this.request('/brands');
    }

    async getProductCategories() {
        return await this.request('/product-categories');
    }

    // ============================================
    // SQUADS (COMMUNITIES) ENDPOINTS
    // ============================================

    async getSquads(params = {}) {
        const query = new URLSearchParams(params);
        const queryString = query.toString();
        return await this.request(`/squads${queryString ? '?' + queryString : ''}`);
    }

    async getSquadBySlug(slug) {
        return await this.request(`/squads/${slug}`);
    }

    async createSquad(squadData) {
        return await this.request('/squads', {
            method: 'POST',
            body: JSON.stringify(squadData),
        });
    }

    async joinSquad(squadId) {
        return await this.request(`/squads/${squadId}/join`, {
            method: 'POST',
        });
    }

    async leaveSquad(squadId) {
        return await this.request(`/squads/${squadId}/leave`, {
            method: 'POST',
        });
    }

    async getSquadMembers(squadId, params = {}) {
        const query = new URLSearchParams(params);
        const queryString = query.toString();
        return await this.request(`/squads/${squadId}/members${queryString ? '?' + queryString : ''}`);
    }

    async sharePostToSquad(squadId, postId) {
        return await this.request(`/squads/${squadId}/posts`, {
            method: 'POST',
            body: JSON.stringify({ post_id: postId }),
        });
    }

    // ============================================
    // GAMIFICATION ENDPOINTS
    // ============================================

    async getUserLevel(userId) {
        return await this.request(`/users/${userId}/level`);
    }

    async getUserStreak(userId) {
        return await this.request(`/users/${userId}/streak`);
    }

    async getUserStats(userId) {
        return await this.request(`/users/${userId}/stats`);
    }

    async getAchievements() {
        return await this.request('/achievements');
    }

    async getUserAchievements(userId) {
        return await this.request(`/users/${userId}/achievements`);
    }

    async getUserPointsHistory(userId, params = {}) {
        const query = new URLSearchParams(params);
        const queryString = query.toString();
        return await this.request(`/users/${userId}/points/history${queryString ? '?' + queryString : ''}`);
    }

    async getLeaderboard(params = {}) {
        const query = new URLSearchParams(params);
        const queryString = query.toString();
        return await this.request(`/leaderboard${queryString ? '?' + queryString : ''}`);
    }

    // ============================================
    // HELPER METHODS
    // ============================================

    // Get current user's level
    async getMyLevel() {
        if (!this.isLoggedIn()) return null;
        return await this.getUserLevel(this.user.id);
    }

    // Get current user's achievements
    async getMyAchievements() {
        if (!this.isLoggedIn()) return null;
        return await this.getUserAchievements(this.user.id);
    }

    // Get current user's stats
    async getMyStats() {
        if (!this.isLoggedIn()) return null;
        return await this.getUserStats(this.user.id);
    }

    // Check if current user has voted on a post
    async getMyVoteOnPost(postId) {
        if (!this.isLoggedIn()) return null;
        try {
            return await this.getUserVote(postId);
        } catch {
            return null;
        }
    }

    // ============================================
    // BACKWARD COMPATIBILITY
    // ============================================

    // Old upvotes endpoint compatibility
    async getUpvotes() {
        console.warn('getUpvotes is deprecated, votes are now per-post with getUserVote()');
        // Cannot implement this with new API structure
        return {};
    }

    async removeUpvote(postId) {
        return await this.removeVote(postId);
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
