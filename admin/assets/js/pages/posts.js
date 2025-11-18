/**
 * Posts Management Page
 */

window.loadPosts = async function() {
    const container = document.getElementById('posts-content');

    container.innerHTML = `
        <div x-data="postsPage()" x-init="loadPosts()">
            <!-- Header Actions -->
            <div class="flex justify-between items-center mb-6">
                <div class="flex items-center space-x-4">
                    <select x-model="filters.status" @change="loadPosts()"
                            class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="scheduled">Scheduled</option>
                    </select>

                    <select x-model="filters.type" @change="loadPosts()"
                            class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">All Types</option>
                        <option value="article">Article</option>
                        <option value="video">Video</option>
                        <option value="review">Review</option>
                    </select>

                    <input type="text"
                           x-model="search"
                           @input.debounce.500ms="loadPosts()"
                           placeholder="Search posts..."
                           class="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>

                <button @click="openCreateModal()"
                        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                    <i data-lucide="plus" class="h-5 w-5"></i>
                    <span>Create Post</span>
                </button>
            </div>

            <!-- Loading State -->
            <div x-show="loading" class="text-center py-12">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p class="mt-2 text-gray-600">Loading posts...</p>
            </div>

            <!-- Error State -->
            <div x-show="error" class="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4">
                <p x-text="error"></p>
            </div>

            <!-- Posts Table -->
            <div x-show="!loading && posts.length > 0" class="bg-white rounded-lg shadow overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <input type="checkbox" @change="toggleSelectAll($event)" class="rounded">
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Title
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Views
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Published
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <template x-for="post in posts" :key="post.id">
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <input type="checkbox" :value="post.id" x-model="selectedPosts" class="rounded">
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center">
                                        <img :src="post.thumbnail_url" class="h-10 w-10 rounded object-cover" :alt="post.title">
                                        <div class="ml-4">
                                            <div class="text-sm font-medium text-gray-900" x-text="post.title"></div>
                                            <div class="text-sm text-gray-500" x-text="post.slug"></div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-semibold rounded-full"
                                          :class="{
                                              'bg-blue-100 text-blue-800': post.type === 'article',
                                              'bg-purple-100 text-purple-800': post.type === 'video',
                                              'bg-green-100 text-green-800': post.type === 'review'
                                          }"
                                          x-text="post.type"></span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-semibold rounded-full"
                                          :class="{
                                              'bg-green-100 text-green-800': post.status === 'published',
                                              'bg-gray-100 text-gray-800': post.status === 'draft',
                                              'bg-yellow-100 text-yellow-800': post.status === 'scheduled'
                                          }"
                                          x-text="post.status"></span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div class="flex items-center">
                                        <i data-lucide="eye" class="h-4 w-4 mr-1"></i>
                                        <span x-text="post.view_count || 0"></span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span x-text="formatDate(post.published_at)"></span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button @click="editPost(post)" class="text-blue-600 hover:text-blue-900">
                                        <i data-lucide="edit" class="h-4 w-4"></i>
                                    </button>
                                    <button @click="deletePost(post.id)" class="text-red-600 hover:text-red-900">
                                        <i data-lucide="trash-2" class="h-4 w-4"></i>
                                    </button>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>

            <!-- Empty State -->
            <div x-show="!loading && posts.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
                <i data-lucide="file-text" class="h-12 w-12 mx-auto text-gray-400"></i>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No posts found</h3>
                <p class="mt-1 text-sm text-gray-500">Get started by creating a new post.</p>
                <div class="mt-6">
                    <button @click="openCreateModal()"
                            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                        <i data-lucide="plus" class="h-5 w-5 mr-2"></i>
                        Create Post
                    </button>
                </div>
            </div>

            <!-- Bulk Actions -->
            <div x-show="selectedPosts.length > 0" class="mt-4 flex items-center space-x-4">
                <span class="text-sm text-gray-700">
                    <span x-text="selectedPosts.length"></span> selected
                </span>
                <button @click="bulkDelete()" class="text-red-600 hover:text-red-900 text-sm font-medium">
                    Delete Selected
                </button>
            </div>

            <!-- Pagination -->
            <div x-show="totalPages > 1" class="mt-6 flex justify-between items-center">
                <div class="text-sm text-gray-700">
                    Showing <span x-text="((currentPage - 1) * perPage) + 1"></span> to
                    <span x-text="Math.min(currentPage * perPage, total)"></span> of
                    <span x-text="total"></span> results
                </div>
                <div class="flex space-x-2">
                    <button @click="prevPage()" :disabled="currentPage === 1"
                            class="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                        Previous
                    </button>
                    <button @click="nextPage()" :disabled="currentPage === totalPages"
                            class="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                        Next
                    </button>
                </div>
            </div>
        </div>
    `;

    // Initialize icons after rendering
    setTimeout(() => lucide.createIcons(), 100);
};

function postsPage() {
    return {
        posts: [],
        selectedPosts: [],
        loading: false,
        error: '',
        search: '',
        filters: {
            status: '',
            type: '',
        },
        currentPage: 1,
        perPage: 20,
        total: 0,
        totalPages: 0,

        async loadPosts() {
            this.loading = true;
            this.error = '';

            try {
                const params = {
                    page: this.currentPage,
                    per_page: this.perPage,
                    search: this.search,
                    ...this.filters,
                };

                // Remove empty filters
                Object.keys(params).forEach(key => {
                    if (params[key] === '' || params[key] === null) delete params[key];
                });

                const data = await window.API.getPosts(params);

                this.posts = data.posts || [];
                this.total = data.total || 0;
                this.totalPages = Math.ceil(this.total / this.perPage);

                // Reinitialize icons
                this.$nextTick(() => lucide.createIcons());

            } catch (err) {
                this.error = err.message;
            } finally {
                this.loading = false;
            }
        },

        toggleSelectAll(event) {
            if (event.target.checked) {
                this.selectedPosts = this.posts.map(p => p.id);
            } else {
                this.selectedPosts = [];
            }
        },

        openCreateModal() {
            alert('Create Post modal - To be implemented');
            // TODO: Open modal for creating post
        },

        editPost(post) {
            alert(`Edit post: ${post.title}`);
            // TODO: Open edit modal
        },

        async deletePost(id) {
            if (!confirm('Are you sure you want to delete this post?')) return;

            try {
                await window.API.deletePost(id);
                await this.loadPosts();
                this.showSuccess('Post deleted successfully');
            } catch (err) {
                this.error = err.message;
            }
        },

        async bulkDelete() {
            if (!confirm(`Delete ${this.selectedPosts.length} posts?`)) return;

            try {
                await window.API.bulkDeletePosts(this.selectedPosts);
                this.selectedPosts = [];
                await this.loadPosts();
                this.showSuccess('Posts deleted successfully');
            } catch (err) {
                this.error = err.message;
            }
        },

        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.loadPosts();
            }
        },

        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.loadPosts();
            }
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

        showSuccess(message) {
            // TODO: Implement toast notification
            alert(message);
        }
    };
}
