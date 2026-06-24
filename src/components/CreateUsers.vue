<template>
  <div class="p-6 md:p-8 max-w-7xl mx-auto bg-gray-50/50">
    
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">User Management</h1>
        <p class="text-gray-500 text-sm mt-1">Manage system administrators, permissions, and institutional staff.</p>
      </div>
      
      <button 
        @click="openAddModal"
        class="flex items-center px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm text-sm"
      >
        <Plus class="w-4 h-4 mr-2" />
        Add New User
      </button>
    </div>

    <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start shadow-sm">
      <AlertCircle class="w-5 h-5 mr-3  text-red-500 mt-0.5" />
      <div>
        <p class="font-medium text-sm">System Error Encountered</p>
        <p class="text-xs text-red-600 mt-0.5">{{ error }}</p>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
      <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
        <div class="relative flex-1 sm:w-72">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            v-model="filters.search"
            @input="debounceSearch"
            type="text" 
            placeholder="Search by username..."
            class="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        
        <select 
          v-model="filters.role"
          @change="handleFilterChange"
          class="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        >
          <option value="">All Account Roles</option>
          <option value="admin">Administrator</option>
          <option value="teacher">Teacher</option>
          <option value="user">Standard User</option>
        </select>
      </div>

      <div class="flex items-center gap-2 self-end md:self-auto text-sm text-gray-600">
        <span>Show</span>
        <select 
          v-model="pagination.limit" 
          @change="handleFilterChange"
          class="px-2 py-1 border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
        </select>
        <span>per page</span>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase font-semibold tracking-wider">
              <th class="p-4 pl-6">Profile Info</th>
              <th class="p-4">Account Privilege</th>
              <th class="p-4">Registered Date</th>
              <th class="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          
          <tbody class="divide-y divide-gray-100 text-sm">
            <tr v-if="isLoading && users.length === 0">
              <td colspan="4" class="p-12 text-center text-gray-400">
                <LoaderCircle class="w-8 h-8 animate-spin mx-auto mb-3 text-blue-600" />
                <span class="text-sm font-medium">Syncing database changes...</span>
              </td>
            </tr>

            <tr v-else-if="users.length === 0">
              <td colspan="4" class="p-16 text-center text-gray-500">
                <UsersIcon class="w-12 h-12 mx-auto mb-4 text-gray-300 stroke-[1.5]" />
                <p class="text-base font-semibold text-gray-900">No records discovered</p>
                <p class="text-xs text-gray-400 mt-1 max-w-xs mx-auto">Try re-adjusting your query parameter strings or assign a brand new account profile.</p>
              </td>
            </tr>

            <tr 
              v-else 
              v-for="user in users" 
              :key="user._id" 
              class="hover:bg-gray-50/40 transition-colors"
            >
              <td class="p-4 pl-6">
                <div class="flex items-center">
                  <div class="w-10 h-10 rounded-xl  from-blue-50 to-indigo-100 text-blue-700 border border-blue-200/50 flex items-center justify-center font-bold mr-3  shadow-sm text-sm">
                    {{ user.username?.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900">{{ user.username }}</p>
                    <p class="text-xs font-mono text-gray-400 mt-0.5">UID: {{ user._id }}</p>
                  </div>
                </div>
              </td>
              
              <td class="p-4">
                <span 
                  :class="[
                    'px-2.5 py-0.5 text-xs font-medium rounded-md capitalize border tracking-wide',
                    user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  ]"
                >
                  {{ user.role || 'user' }}
                </span>
              </td>
              
              <td class="p-4 text-gray-600 font-medium text-xs">
                {{ formatDate(user.createdAt) }}
              </td>
              
              <td class="p-4 pr-6 text-right">
                <div class="flex items-center justify-end space-x-1.5">
                  <button 
                    @click="openEditModal(user)"
                    class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                    title="Modify User Profile"
                  >
                    <Edit class="w-4 h-4" />
                  </button>
                  
                  <button 
                    @click="handleDelete(user._id, user.username)" 
                    class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                    title="Remove System User"
                    :disabled="isDeleting === user._id"
                  >
                    <LoaderCircle v-if="isDeleting === user._id" class="w-4 h-4 animate-spin text-red-600" />
                    <Trash2 v-else class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="users.length > 0" class="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 p-4 px-6 gap-4 bg-gray-50/30">
        <div class="text-xs text-gray-500 font-medium">
          Showing Page <span class="text-gray-800 font-bold">{{ pagination.page }}</span> of <span class="text-gray-800 font-bold">{{ totalPages }}</span>
        </div>
        <div class="flex items-center gap-2">
          <button 
            @click="changePage(pagination.page - 1)" 
            :disabled="pagination.page <= 1 || isLoading"
            class="p-2 border border-gray-200 rounded-lg text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition shadow-sm"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>
          <button 
            @click="changePage(pagination.page + 1)" 
            :disabled="pagination.page >= totalPages || isLoading"
            class="p-2 border border-gray-200 rounded-lg text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition shadow-sm"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="modal.isOpen" class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <Transition name="scale">
          <div class="bg-white rounded-xl shadow-xl max-w-md w-full border border-gray-100 overflow-hidden" @click.stop>
            
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 class="font-bold text-gray-900 text-base">
                {{ modal.mode === 'add' ? 'Register New Account' : 'Update User Attributes' }}
              </h3>
              <button @click="closeModal" class="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition">
                <X class="w-4 h-4" />
              </button>
            </div>

            <form @submit.prevent="handleModalSubmit" class="p-6 space-y-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Username Identifier</label>
                <input 
                  v-model="modal.form.username"
                  type="text"
                  required
                  placeholder="e.g. johndoe"
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div v-if="modal.mode === 'add'">
                <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Secure Password</label>
                <input 
                  v-model="modal.form.password"
                  type="password"
                  required
                  placeholder="••••••••"
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Permission Role Designation</label>
                <select 
                  v-model="modal.form.role"
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  <option value="user">Standard User</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">System Administrator</option>
                </select>
              </div>

              <div class="flex items-center justify-end space-x-2 pt-4 border-t border-gray-100 mt-6">
                <button 
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  :disabled="modal.isSubmitting"
                  class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition flex items-center"
                >
                  <LoaderCircle v-if="modal.isSubmitting" class="w-4 h-4 animate-spin mr-2" />
                  {{ modal.mode === 'add' ? 'Save User' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>
        </Transition>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useUsers } from '../hooks/useUsers'; // Make sure your hook supports pagination/mutations
import { useToast } from 'vue-toastification';
import { 
  Plus, Edit, Trash2, LoaderCircle, AlertCircle, 
  Users as UsersIcon, Search, ChevronLeft, ChevronRight, X 
} from 'lucide-vue-next';

const toast = useToast();

// Destructuring core items from composable hook architecture
// Note: If your hook does not provide custom functions for createUser/updateUser, replace them with straight Axios API calls.
const { users, isLoading, error, totalPage, findAllUser, deleteUser, createUser, updateUser } = useUsers();

const isDeleting = ref(null);
const totalPages = ref(1);

// Operational UI Query Filter State
const filters = reactive({
  search: '',
  role: ''
});

// Structural Pagination Matrix
const pagination = reactive({
  page: 1,
  limit: 10
});

// Unitary Modal Application State
const modal = reactive({
  isOpen: false,
  mode: 'add', // accepts 'add' | 'edit'
  targetId: null,
  isSubmitting: false,
  form: {
    username: '',
    password: '',
    role: 'user'
  }
});

let searchDebounceTimeout = null;

// Core Data Synchronization Routine
const syncUserDirectory = async () => {
  try {
    // Passes structural query definitions straight to your backend controller setup
    await findAllUser({
      search: filters.search || undefined,
      role: filters.role || undefined,
      page: pagination.page,
      limit: pagination.limit
    });
    
    // Fallback sync structure handling total pages
    if (totalPage?.value) {
      totalPages.value = totalPage.value;
    }
  } catch (err) {
    console.error("Critical framework error fetching table payload.", err);
  }
};

onMounted(() => {
  syncUserDirectory();
});

// Debounce processing to optimize query parsing loads on backend regex loops
const debounceSearch = () => {
  clearTimeout(searchDebounceTimeout);
  searchDebounceTimeout = setTimeout(() => {
    pagination.page = 1; // Reset matrix depth back to root page index
    syncUserDirectory();
  }, 400);
};

const handleFilterChange = () => {
  pagination.page = 1;
  syncUserDirectory();
};

const changePage = (targetPageIndex) => {
  if (targetPageIndex >= 1 && targetPageIndex <= totalPages.value) {
    pagination.page = targetPageIndex;
    syncUserDirectory();
  }
};

// Modal Trigger Control Routines
const openAddModal = () => {
  modal.mode = 'add';
  modal.targetId = null;
  modal.form.username = '';
  modal.form.password = '';
  modal.form.role = 'user';
  modal.isOpen = true;
};

const openEditModal = (userData) => {
  modal.mode = 'edit';
  modal.targetId = userData._id;
  modal.form.username = userData.username;
  modal.form.role = userData.role || 'user';
  modal.form.password = ''; // Omit password updates to protect backend filters
  modal.isOpen = true;
};

const closeModal = () => {
  modal.isOpen = false;
  modal.isSubmitting = false;
};

// Processing submissions for Add or Update routines safely
const handleModalSubmit = async () => {
  modal.isSubmitting = true;
  try {
    if (modal.mode === 'add') {
      await createUser({
        username: modal.form.username,
        password: modal.form.password,
        role: modal.form.role
      });
      toast.success(`Account record "${modal.form.username}" initiated!`);
    } else {
      // General modification package - omits plain text password elements completely
      await updateUser(modal.targetId, {
        username: modal.form.username,
        role: modal.form.role
      });
      toast.success("Profile updates successfully deployed!");
    }
    closeModal();
    await syncUserDirectory(); // Refetch active view index context
  } catch (err) {
    toast.error(err.response?.data?.err || "Failed to finalize database mutations.");
  } finally {
    modal.isSubmitting = false;
  }
};

const handleDelete = async (userId, username) => {
  if (!confirm(`Are you certain you want to remove user registry "${username}"? This application change is irreversible.`)) {
    return;
  }

  isDeleting.value = userId; 
  try {
    await deleteUser(userId);
    toast.success(`User data profile context for "${username}" wiped.`);
    await syncUserDirectory();
  } catch (err) {
    toast.error(err.response?.data?.err || "Failed to drop entry reference.");
  } finally {
    isDeleting.value = null; 
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<style scoped>
/* High-fidelity layout transition styles for a native feel */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
}
.scale-enter-from,
.scale-leave-to {
  transform: scale(0.96);
  opacity: 0;
}
</style>