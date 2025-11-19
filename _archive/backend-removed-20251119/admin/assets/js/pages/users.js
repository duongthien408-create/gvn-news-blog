/**
 * Users Management Page
 */

window.loadUsers = async function() {
    const container = document.getElementById('users-content');

    container.innerHTML = `
        <div x-data="usersPage()" x-init="loadUsers()">
            <!-- Header Actions -->
            <div class="flex justify-between items-center mb-6">
                <div class="flex items-center space-x-4">
                    <select x-model="filters.role" @change="loadUsers()"
                            class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="moderator">Moderator</option>
                        <option value="user">User</option>
                    </select>

                    <select x-model="filters.status" @change="loadUsers()"
                            class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="banned">Banned</option>
                        <option value="suspended">Suspended</option>
                    </select>

                    <input type="text"
                           x-model="search"
                           @input.debounce.500ms="loadUsers()"
                           placeholder="Search users..."
                           class="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
            </div>

            <!-- Loading State -->
            <div x-show="loading" class="text-center py-12">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p class="mt-2 text-gray-600">Loading users...</p>
            </div>

            <!-- Error State -->
            <div x-show="error" class="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4">
                <p x-text="error"></p>
            </div>

            <!-- Users Table -->
            <div x-show="!loading && users.length > 0" class="bg-white rounded-lg shadow overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Level
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Joined
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <template x-for="user in users" :key="user.id">
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <img :src="user.avatar_url || 'https://i.pravatar.cc/40?u=' + user.username"
                                             class="h-10 w-10 rounded-full"
                                             :alt="user.username">
                                        <div class="ml-4">
                                            <div class="text-sm font-medium text-gray-900" x-text="user.username"></div>
                                            <div class="text-sm text-gray-500" x-text="user.display_name"></div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span x-text="user.email"></span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-semibold rounded-full"
                                          :class="{
                                              'bg-purple-100 text-purple-800': user.role === 'admin',
                                              'bg-blue-100 text-blue-800': user.role === 'moderator',
                                              'bg-gray-100 text-gray-800': user.role === 'user'
                                          }"
                                          x-text="user.role"></span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div class="flex items-center">
                                        <i data-lucide="trophy" class="h-4 w-4 mr-1 text-yellow-500"></i>
                                        <span x-text="user.level || 1"></span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-semibold rounded-full"
                                          :class="{
                                              'bg-green-100 text-green-800': user.status === 'active',
                                              'bg-red-100 text-red-800': user.status === 'banned',
                                              'bg-yellow-100 text-yellow-800': user.status === 'suspended'
                                          }"
                                          x-text="user.status"></span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span x-text="formatDate(user.created_at)"></span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div class="flex items-center space-x-2">
                                        <button @click="viewUser(user)" class="text-blue-600 hover:text-blue-900">
                                            <i data-lucide="eye" class="h-4 w-4"></i>
                                        </button>
                                        <button @click="editUser(user)" class="text-green-600 hover:text-green-900">
                                            <i data-lucide="edit" class="h-4 w-4"></i>
                                        </button>
                                        <template x-if="user.status !== 'banned'">
                                            <button @click="banUser(user.id)" class="text-orange-600 hover:text-orange-900">
                                                <i data-lucide="ban" class="h-4 w-4"></i>
                                            </button>
                                        </template>
                                        <template x-if="user.status === 'banned'">
                                            <button @click="unbanUser(user.id)" class="text-green-600 hover:text-green-900">
                                                <i data-lucide="check-circle" class="h-4 w-4"></i>
                                            </button>
                                        </template>
                                        <button @click="deleteUser(user.id)" class="text-red-600 hover:text-red-900">
                                            <i data-lucide="trash-2" class="h-4 w-4"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>

            <!-- Empty State -->
            <div x-show="!loading && users.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
                <i data-lucide="users" class="h-12 w-12 mx-auto text-gray-400"></i>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                <p class="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
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

            <!-- User Detail Modal (placeholder) -->
            <div x-show="showDetailModal" x-cloak
                 class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
                 @click.self="showDetailModal = false">
                <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                    <div class="flex justify-between items-start mb-4">
                        <h3 class="text-lg font-medium text-gray-900">User Details</h3>
                        <button @click="showDetailModal = false" class="text-gray-400 hover:text-gray-600">
                            <i data-lucide="x" class="h-6 w-6"></i>
                        </button>
                    </div>

                    <template x-if="selectedUser">
                        <div>
                            <!-- User info will be displayed here -->
                            <div class="space-y-4">
                                <div class="flex items-center space-x-4">
                                    <img :src="selectedUser.avatar_url || 'https://i.pravatar.cc/80?u=' + selectedUser.username"
                                         class="h-20 w-20 rounded-full"
                                         :alt="selectedUser.username">
                                    <div>
                                        <h4 class="text-xl font-bold" x-text="selectedUser.username"></h4>
                                        <p class="text-gray-600" x-text="selectedUser.email"></p>
                                        <span class="inline-block px-2 py-1 text-xs font-semibold rounded-full mt-1"
                                              :class="{
                                                  'bg-purple-100 text-purple-800': selectedUser.role === 'admin',
                                                  'bg-blue-100 text-blue-800': selectedUser.role === 'moderator',
                                                  'bg-gray-100 text-gray-800': selectedUser.role === 'user'
                                              }"
                                              x-text="selectedUser.role"></span>
                                    </div>
                                </div>

                                <div class="border-t pt-4">
                                    <h5 class="font-semibold mb-2">Stats</h5>
                                    <div class="grid grid-cols-3 gap-4">
                                        <div>
                                            <p class="text-sm text-gray-600">Level</p>
                                            <p class="text-lg font-bold" x-text="selectedUser.level || 1"></p>
                                        </div>
                                        <div>
                                            <p class="text-sm text-gray-600">Points</p>
                                            <p class="text-lg font-bold" x-text="selectedUser.total_points || 0"></p>
                                        </div>
                                        <div>
                                            <p class="text-sm text-gray-600">Streak</p>
                                            <p class="text-lg font-bold" x-text="selectedUser.current_streak || 0"></p>
                                        </div>
                                    </div>
                                </div>

                                <div class="border-t pt-4">
                                    <h5 class="font-semibold mb-2">Actions</h5>
                                    <div class="flex space-x-2">
                                        <button @click="changeRole(selectedUser.id)"
                                                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                            Change Role
                                        </button>
                                        <button @click="grantAchievement(selectedUser.id)"
                                                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                            Grant Achievement
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    `;

    // Initialize icons after rendering
    setTimeout(() => lucide.createIcons(), 100);
};

function usersPage() {
    return {
        users: [],
        selectedUser: null,
        showDetailModal: false,
        loading: false,
        error: '',
        search: '',
        filters: {
            role: '',
            status: '',
        },
        currentPage: 1,
        perPage: 20,
        total: 0,
        totalPages: 0,

        async loadUsers() {
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

                const data = await window.API.getUsers(params);

                this.users = data.users || [];
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

        viewUser(user) {
            this.selectedUser = user;
            this.showDetailModal = true;
            this.$nextTick(() => lucide.createIcons());
        },

        editUser(user) {
            alert(`Edit user: ${user.username}`);
            // TODO: Open edit modal
        },

        async banUser(id) {
            const reason = prompt('Reason for ban:');
            if (!reason) return;

            try {
                await window.API.banUser(id, reason);
                await this.loadUsers();
                this.showSuccess('User banned successfully');
            } catch (err) {
                this.error = err.message;
            }
        },

        async unbanUser(id) {
            if (!confirm('Unban this user?')) return;

            try {
                await window.API.unbanUser(id);
                await this.loadUsers();
                this.showSuccess('User unbanned successfully');
            } catch (err) {
                this.error = err.message;
            }
        },

        async deleteUser(id) {
            if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

            try {
                await window.API.deleteUser(id);
                await this.loadUsers();
                this.showSuccess('User deleted successfully');
            } catch (err) {
                this.error = err.message;
            }
        },

        async changeRole(id) {
            const role = prompt('Enter new role (admin/moderator/user):');
            if (!role || !['admin', 'moderator', 'user'].includes(role)) {
                alert('Invalid role');
                return;
            }

            try {
                await window.API.changeUserRole(id, role);
                await this.loadUsers();
                this.showDetailModal = false;
                this.showSuccess('Role changed successfully');
            } catch (err) {
                this.error = err.message;
            }
        },

        async grantAchievement(id) {
            alert('Achievement modal - To be implemented');
            // TODO: Open achievement selection modal
        },

        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.loadUsers();
            }
        },

        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.loadUsers();
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
