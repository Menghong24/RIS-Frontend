<template>
 <div class="shrink-0">
    <header class="flex items-center justify-between h-18 px-6 bg-white border-b shadow-sm shrink-0">
      <button @click="$emit('toggle-sidebar')" class="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
        <Menu class="w-6 h-6" />
      </button>
      
      <div class="flex items-center space-x-5">
        <button @click="isNoticeModalOpen = true" class="p-2 rounded-full hover:bg-gray-100 relative transition-colors text-gray-600 group">
          <Bell class="w-6 h-6 group-hover:text-blue-600 transition-colors" />
          <span 
            v-if="unreadAnnouncements.length > 0" 
            class="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-white transform scale-100 animate-pulse"
          >
            {{ unreadAnnouncements.length > 9 ? '9+' : unreadAnnouncements.length }}
          </span>
        </button>

        <div v-if="user" @click="isProfileModalOpen = true" class="flex items-center cursor-pointer group pl-2 border-l border-gray-200">
          <img 
            class="w-9 h-9 rounded-full object-cover ring-2 ring-transparent group-hover:ring-blue-300 transition-all shadow-sm" 
            :src="`https://placehold.co/100x100/3b82f6/ffffff?text=${userInitial}`" 
            alt="User avatar"
          >
          <div class="ml-3 select-none hidden sm:block">
            <span class="font-bold text-sm capitalize text-gray-800 leading-none">{{ user?.username }}</span>
            <p class="text-[11px] text-gray-500 font-medium mt-0.5">{{ formattedRole }}</p>
          </div>
        </div>
      </div>
    </header>

    <div v-if="isNoticeModalOpen" class="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-40 p-4" @click="isNoticeModalOpen = false">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden border border-gray-100 transform transition-all" @click.stop>
        
        <div class="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
          <div class="flex items-center gap-2">
            <div class="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
              <Bell class="w-4 h-4" />
            </div>
            <h3 class="font-bold text-gray-800">សេចក្តីជូនដំណឹង</h3>
            <span v-if="unreadAnnouncements.length > 0" class="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {{ unreadAnnouncements.length }} ថ្មី
            </span>
          </div>
          <button @click="isNoticeModalOpen = false" class="text-gray-400 hover:text-gray-700 hover:bg-gray-200 p-1 rounded-md transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <div class="overflow-y-auto flex-1 p-2 bg-gray-50/50">
          
          <div v-if="unreadAnnouncements.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <CheckCircle2 class="w-8 h-8 text-green-400" />
            </div>
            <p class="text-gray-500 font-medium text-sm">មិនមានសេចក្តីជូនដំណឹងថ្មីទេ</p>
            <p class="text-gray-400 text-xs mt-1">អ្នកបានអានអស់ហើយ!</p>
          </div>

          <div v-else class="space-y-2 p-2">
            <div 
              v-for="notice in unreadAnnouncements" 
              :key="notice._id || notice.id" 
              @click="handleNoticeClick(notice)"
              class="p-4 bg-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all group cursor-pointer relative overflow-hidden"
            >
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
              
              <div class="flex justify-between items-start mb-2 pl-2">
                <h4 class="font-bold text-sm text-gray-800 group-hover:text-blue-600 transition-colors pr-6">
                  {{ notice.title || 'Untitled Notice' }}
                </h4>
                
                <button 
                  @click.stop="clearNotice(notice._id || notice.id)" 
                  class="text-gray-400 hover:text-green-500 bg-gray-50 hover:bg-green-50 p-1.5 rounded-full transition-colors absolute right-3 top-3"
                  title="Mark as read"
                >
                  <Check class="w-3.5 h-3.5" />
                </button>
              </div>
              
              <p class="text-xs text-gray-500 leading-relaxed line-clamp-2 pl-2 mb-2">
                {{ notice.content || notice.description || 'No additional details provided.' }}
              </p>
              
              <div class="pl-2 flex justify-between items-center">
                 <span class="text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                   {{ formatDate(notice.createdAt || notice.date) }}
                 </span>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="unreadAnnouncements.length > 0" class="p-3 border-t border-gray-100 bg-white flex justify-between items-center">
          <button @click="clearAllNotices" class="text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors">
            Clear All
          </button>
          <button @click="handleNoticeClick" class="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">
            View All Notices
          </button>
        </div>
      </div>
    </div>

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// បន្ថែម X, Check, និង CheckCircle2 ពី lucide
import { Menu, Bell, LogOut, AlertTriangle, LoaderCircle, X, Check, CheckCircle2 } from 'lucide-vue-next'; 
import { useQuery } from '../../hooks/useQuery'; 
import { useAuth } from '../../hooks/useAuth';

// បន្ថែម 'navigate' ទៅក្នុង emit ដើម្បីអាចបញ្ជាទៅកាន់ Layout អោយប្តូរ Menu
const emit = defineEmits(['toggle-sidebar', 'navigate']);

const router = useRouter();
const { user, logout } = useAuth(); 
const { data: announcements } = useQuery('announcements');

// State
const isNoticeModalOpen = ref(false);
const isProfileModalOpen = ref(false);
const isLogoutConfirmOpen = ref(false);
const isLoggingOut = ref(false);

// --- មុខងាររៀបចំការ Clear សេចក្តីជូនដំណឹង ---
const clearedNoticeIds = ref([]);

onMounted(() => {
  // ទាញយក ID របស់ការជូនដំណឹងដែលបានអានរួចពី localStorage ដោយផ្អែកលើ User នីមួយៗ
  const userId = user.value?._id || user.value?.id || 'guest';
  const savedClearedNotices = localStorage.getItem(`cleared_notices_${userId}`);
  if (savedClearedNotices) {
    clearedNoticeIds.value = JSON.parse(savedClearedNotices);
  }
});

// តម្រៀបយកតែសេចក្តីជូនដំណឹងណាដែលមិនទាន់មានក្នុង `clearedNoticeIds`
const unreadAnnouncements = computed(() => {
  if (!announcements.value) return [];
  return announcements.value.filter(notice => {
    const id = notice._id || notice.id;
    return !clearedNoticeIds.value.includes(id);
  });
});

// មុខងារ Clear ម្តងមួយ
const clearNotice = (id) => {
  if (!id) return;
  clearedNoticeIds.value.push(id);
  const userId = user.value?._id || user.value?.id || 'guest';
  localStorage.setItem(`cleared_notices_${userId}`, JSON.stringify(clearedNoticeIds.value));
};

// មុខងារ Clear ទាំងអស់
const clearAllNotices = () => {
  if (!announcements.value) return;
  const allIds = announcements.value.map(n => n._id || n.id);
  // រួមបញ្ចូល ID ថ្មីៗដោយមិនឱ្យជាន់គ្នា (Unique)
  clearedNoticeIds.value = [...new Set([...clearedNoticeIds.value, ...allIds])];
  
  const userId = user.value?._id || user.value?.id || 'guest';
  localStorage.setItem(`cleared_notices_${userId}`, JSON.stringify(clearedNoticeIds.value));
};
// -------------------------------------------

// --- មុខងារពេលចុចលើ Notice ---
const handleNoticeClick = (notice) => {
  // ១. បិទផ្ទាំង Modal មុនសិន
  isNoticeModalOpen.value = false;
  
  // ២. បញ្ជូន Event ទៅកាន់ Parent (Layout) ដើម្បីប្តូរ Active Menu ទៅកាន់ 'Notices'
  emit('navigate', 'Notices');
  
  // ៣. (ស្រេចចិត្ត) ប្រសិនបើ App របស់អ្នកប្រើប្រាស់ vue-router សម្រាប់ Route នេះ អ្នកអាចប្រើ៖
  // router.push('/notices'); 
};
// ------------------------------

const formattedRole = computed(() => {
  if (!user.value?.role) return 'User';
  return user.value.role.charAt(0).toUpperCase() + user.value.role.slice(1);
});

const userInitial = computed(() => {
  return user.value?.username ? user.value.username.charAt(0).toUpperCase() : 'U';
});

const formatDate = (dateString) => {
  if (!dateString) return 'Just now';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  } catch (e) {
    return 'Recent';
  }
};

const handleLogout = async () => {
  isLoggingOut.value = true;
  try {
    await logout();
    isLogoutConfirmOpen.value = false;
    isProfileModalOpen.value = false;
    router.push('/login'); 
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    isLoggingOut.value = false;
  }
};
</script>