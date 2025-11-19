/**
 * Admin API Client
 * Handles all API requests to the backend
 */

class AdminAPI {
    constructor() {
        this.baseURL = 'http://localhost:8080/api';
        this.token = localStorage.getItem('admin_token');
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('admin_token', token);
    }

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: this.getHeaders(),
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                // Handle authentication errors
                if (response.status === 401) {
                    localStorage.removeItem('admin_token');
                    window.location.href = '/admin/login.html';
                    throw new Error('Session expired. Please login again.');
                }

                throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
            }

            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    // Generic CRUD operations
    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        return this.request(url, { method: 'GET' });
    }

    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE',
        });
    }

    // ==================== POSTS ====================

    async getPosts(params = {}) {
        return this.get('/admin/posts', params);
    }

    async getPost(id) {
        return this.get(`/admin/posts/${id}`);
    }

    async createPost(data) {
        return this.post('/admin/posts', data);
    }

    async updatePost(id, data) {
        return this.put(`/admin/posts/${id}`, data);
    }

    async deletePost(id) {
        return this.delete(`/admin/posts/${id}`);
    }

    async bulkDeletePosts(ids) {
        return this.post('/admin/posts/bulk-delete', { ids });
    }

    async publishPost(id) {
        return this.put(`/admin/posts/${id}/publish`, {});
    }

    async unpublishPost(id) {
        return this.put(`/admin/posts/${id}/unpublish`, {});
    }

    // ==================== USERS ====================

    async getUsers(params = {}) {
        return this.get('/admin/users', params);
    }

    async getUser(id) {
        return this.get(`/admin/users/${id}`);
    }

    async updateUser(id, data) {
        return this.put(`/admin/users/${id}`, data);
    }

    async deleteUser(id) {
        return this.delete(`/admin/users/${id}`);
    }

    async banUser(id, reason) {
        return this.post(`/admin/users/${id}/ban`, { reason });
    }

    async unbanUser(id) {
        return this.post(`/admin/users/${id}/unban`, {});
    }

    async changeUserRole(id, role) {
        return this.put(`/admin/users/${id}/role`, { role });
    }

    async grantAchievement(userId, achievementId) {
        return this.post(`/admin/users/${userId}/achievements`, { achievement_id: achievementId });
    }

    // ==================== CREATORS ====================

    async getCreators(params = {}) {
        return this.get('/admin/creators', params);
    }

    async getCreator(id) {
        return this.get(`/admin/creators/${id}`);
    }

    async createCreator(data) {
        return this.post('/admin/creators', data);
    }

    async updateCreator(id, data) {
        return this.put(`/admin/creators/${id}`, data);
    }

    async deleteCreator(id) {
        return this.delete(`/admin/creators/${id}`);
    }

    // ==================== PRODUCTS ====================

    async getProducts(params = {}) {
        return this.get('/admin/products', params);
    }

    async getProduct(id) {
        return this.get(`/admin/products/${id}`);
    }

    async createProduct(data) {
        return this.post('/admin/products', data);
    }

    async updateProduct(id, data) {
        return this.put(`/admin/products/${id}`, data);
    }

    async deleteProduct(id) {
        return this.delete(`/admin/products/${id}`);
    }

    async getProductCategories() {
        return this.get('/admin/product-categories');
    }

    async getBrands() {
        return this.get('/admin/brands');
    }

    // ==================== TAGS ====================

    async getTags(params = {}) {
        return this.get('/admin/tags', params);
    }

    async createTag(data) {
        return this.post('/admin/tags', data);
    }

    async updateTag(id, data) {
        return this.put(`/admin/tags/${id}`, data);
    }

    async deleteTag(id) {
        return this.delete(`/admin/tags/${id}`);
    }

    async mergeTags(sourceIds, targetId) {
        return this.post('/admin/tags/merge', { source_ids: sourceIds, target_id: targetId });
    }

    // ==================== COMMENTS ====================

    async getComments(params = {}) {
        return this.get('/admin/comments', params);
    }

    async updateComment(id, data) {
        return this.put(`/admin/comments/${id}`, data);
    }

    async deleteComment(id) {
        return this.delete(`/admin/comments/${id}`);
    }

    async approveComment(id) {
        return this.post(`/admin/comments/${id}/approve`, {});
    }

    async flagComment(id, reason) {
        return this.post(`/admin/comments/${id}/flag`, { reason });
    }

    // ==================== ANALYTICS ====================

    async getOverviewStats() {
        return this.get('/admin/analytics/overview');
    }

    async getUserStats(params = {}) {
        return this.get('/admin/analytics/users', params);
    }

    async getPostStats(params = {}) {
        return this.get('/admin/analytics/posts', params);
    }

    async getEngagementStats(params = {}) {
        return this.get('/admin/analytics/engagement', params);
    }

    async exportAnalytics(type, params = {}) {
        return this.get(`/admin/analytics/export/${type}`, params);
    }

    // ==================== SETTINGS ====================

    async getSettings() {
        return this.get('/admin/settings');
    }

    async updateSettings(data) {
        return this.put('/admin/settings', data);
    }

    // ==================== DASHBOARD ====================

    async getDashboardStats() {
        return this.get('/admin/dashboard/stats');
    }

    async getRecentActivity() {
        return this.get('/admin/dashboard/activity');
    }
}

// Create global instance
window.API = new AdminAPI();
