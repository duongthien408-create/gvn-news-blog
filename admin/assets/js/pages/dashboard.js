/**
 * Dashboard Page
 */

window.loadDashboard = async function() {
    const container = document.getElementById('dashboard-content');

    container.innerHTML = `
        <div x-data="dashboardPage()" x-init="loadStats()">
            <!-- Loading State -->
            <div x-show="loading" class="text-center py-12">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p class="mt-2 text-gray-600">Loading dashboard...</p>
            </div>

            <!-- Error State -->
            <div x-show="error" class="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
                <p x-text="error"></p>
            </div>

            <!-- Stats Cards -->
            <div x-show="!loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <!-- Total Users -->
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 bg-blue-500 rounded-md p-3">
                            <i data-lucide="users" class="h-6 w-6 text-white"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600">Total Users</p>
                            <p class="text-2xl font-bold text-gray-900" x-text="stats.totalUsers || 0"></p>
                        </div>
                    </div>
                </div>

                <!-- Total Posts -->
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 bg-green-500 rounded-md p-3">
                            <i data-lucide="file-text" class="h-6 w-6 text-white"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600">Total Posts</p>
                            <p class="text-2xl font-bold text-gray-900" x-text="stats.totalPosts || 0"></p>
                        </div>
                    </div>
                </div>

                <!-- Total Views -->
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 bg-purple-500 rounded-md p-3">
                            <i data-lucide="eye" class="h-6 w-6 text-white"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600">Total Views</p>
                            <p class="text-2xl font-bold text-gray-900" x-text="formatNumber(stats.totalViews || 0)"></p>
                        </div>
                    </div>
                </div>

                <!-- Active Users -->
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 bg-orange-500 rounded-md p-3">
                            <i data-lucide="trending-up" class="h-6 w-6 text-white"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600">Active Users</p>
                            <p class="text-2xl font-bold text-gray-900" x-text="stats.activeUsers || 0"></p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Activity -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Recent Posts -->
                <div class="bg-white rounded-lg shadow">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h3 class="text-lg font-medium text-gray-900">Recent Posts</h3>
                    </div>
                    <div class="p-6">
                        <template x-if="recentPosts.length === 0">
                            <p class="text-gray-500 text-center py-4">No recent posts</p>
                        </template>
                        <div class="space-y-4">
                            <template x-for="post in recentPosts" :key="post.id">
                                <div class="flex items-center space-x-3">
                                    <img :src="post.thumbnail_url" class="h-12 w-12 rounded object-cover" :alt="post.title">
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-medium text-gray-900 truncate" x-text="post.title"></p>
                                        <p class="text-sm text-gray-500">
                                            <span x-text="formatDate(post.created_at)"></span>
                                            · <span x-text="post.view_count || 0"></span> views
                                        </p>
                                    </div>
                                    <span class="px-2 py-1 text-xs font-semibold rounded-full"
                                          :class="{
                                              'bg-green-100 text-green-800': post.status === 'published',
                                              'bg-gray-100 text-gray-800': post.status === 'draft'
                                          }"
                                          x-text="post.status"></span>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>

                <!-- Recent Users -->
                <div class="bg-white rounded-lg shadow">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h3 class="text-lg font-medium text-gray-900">Recent Users</h3>
                    </div>
                    <div class="p-6">
                        <template x-if="recentUsers.length === 0">
                            <p class="text-gray-500 text-center py-4">No recent users</p>
                        </template>
                        <div class="space-y-4">
                            <template x-for="user in recentUsers" :key="user.id">
                                <div class="flex items-center space-x-3">
                                    <img :src="user.avatar_url || 'https://i.pravatar.cc/40?u=' + user.username"
                                         class="h-10 w-10 rounded-full"
                                         :alt="user.username">
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-medium text-gray-900" x-text="user.username"></p>
                                        <p class="text-sm text-gray-500" x-text="user.email"></p>
                                    </div>
                                    <span class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800"
                                          x-text="user.role"></span>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="mt-6 bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button @click="navigateToPage('posts')"
                            class="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <i data-lucide="plus" class="h-5 w-5 mr-2 text-gray-600"></i>
                        <span class="text-sm font-medium text-gray-700">Create Post</span>
                    </button>
                    <button @click="navigateToPage('users')"
                            class="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <i data-lucide="users" class="h-5 w-5 mr-2 text-gray-600"></i>
                        <span class="text-sm font-medium text-gray-700">Manage Users</span>
                    </button>
                    <button @click="navigateToPage('comments')"
                            class="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <i data-lucide="message-square" class="h-5 w-5 mr-2 text-gray-600"></i>
                        <span class="text-sm font-medium text-gray-700">Moderate Comments</span>
                    </button>
                    <button @click="navigateToPage('analytics')"
                            class="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <i data-lucide="bar-chart-2" class="h-5 w-5 mr-2 text-gray-600"></i>
                        <span class="text-sm font-medium text-gray-700">View Analytics</span>
                    </button>
                </div>
            </div>
        </div>
    `;

    // Initialize icons after rendering
    setTimeout(() => lucide.createIcons(), 100);
};

function dashboardPage() {
    return {
        stats: {},
        recentPosts: [],
        recentUsers: [],
        loading: false,
        error: '',

        async loadStats() {
            this.loading = true;
            this.error = '';

            try {
                // Load dashboard stats
                const statsData = await window.API.getDashboardStats();
                this.stats = statsData;

                // Load recent activity
                const activityData = await window.API.getRecentActivity();
                this.recentPosts = activityData.posts || [];
                this.recentUsers = activityData.users || [];

                // Reinitialize icons
                this.$nextTick(() => lucide.createIcons());

            } catch (err) {
                this.error = err.message;
                // Set some default data for demo
                this.stats = {
                    totalUsers: 10,
                    totalPosts: 10,
                    totalViews: 15000,
                    activeUsers: 5
                };
                this.recentPosts = [];
                this.recentUsers = [];
            } finally {
                this.loading = false;
            }
        },

        formatNumber(num) {
            if (num >= 1000000) {
                return (num / 1000000).toFixed(1) + 'M';
            }
            if (num >= 1000) {
                return (num / 1000).toFixed(1) + 'K';
            }
            return num;
        },

        formatDate(dateString) {
            if (!dateString) return '-';
            const date = new Date(dateString);
            return date.toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        },

        navigateToPage(page) {
            window.location.hash = page;
        }
    };
}
