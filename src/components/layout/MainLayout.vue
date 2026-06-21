<template>
  <div class="flex h-screen bg-gray-100 text-gray-800">
    <Sidebar 
      :is-sidebar-open="isSidebarOpen"
      :menu-items="visibleMenuItems" 
      :active-menu="activeMenu"
      @menu-click="handleNavigation"
      @logout-click="isLogoutModalOpen = true"
    />
    <div class="flex flex-col flex-1 overflow-y-auto">
      <Header 
        @toggle-sidebar="isSidebarOpen = !isSidebarOpen" 
        @navigate="handleNavigation" 
      />
      <main class="flex-1 p-6">
        <component :is="activeComponent" @navigateTo="handleNavigation" />
      </main>
    </div>

    <div v-if="isLogoutModalOpen" class="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-white/60 rounded-xl shadow-xl p-8 w-full max-w-sm text-center">
            <div class="mx-auto bg-red-100 rounded-full h-16 w-16 flex items-center justify-center">
                <LogOut class="h-8 w-8 text-red-600" />
            </div>
            <h2 class="text-2xl font-bold my-4">Confirm Logout</h2>
            <p class="text-gray-600">Are you sure you want to sign out of your account?</p>
            <div class="mt-8 flex justify-center space-x-4">
                <button @click="isLogoutModalOpen = false" class="bg-gray-200 text-gray-700 font-semibold px-6 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
                <button @click="confirmLogout" class="bg-red-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-red-700">Logout</button>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

// ១. Import useAuth composable របស់អ្នកចូល
import { useAuth } from '../../hooks/useAuth.js'; // ប្ដូរ path ទៅតាមទីតាំង file ជាក់ស្ដែង

// Import Icons
import { 
  LayoutDashboard, Users, GraduationCap, BookOpen, CalendarCheck, Banknote, Megaphone, 
  LogOut, CalendarClock, ClipboardList, BookCopy, User, FileText
} from 'lucide-vue-next';

// Import Layout & Page Components
import Sidebar from './Sidebar.vue';
import Header from './Header.vue';
import Dashboard from '../Dashboard.vue';
import Students from '../Students.vue';
import Teachers from '../Teachers.vue';
import Classes from '../Classes.vue';
import Subject from '../Subject.vue'; 
import Attendance from '../Attendance.vue';
import Finance from '../Finance.vue';
import Notices from '../Notices.vue';
import Schedule from '../Schedule.vue'; 
import Score from '../Score.vue'; 
import ScoreReport from '../ScoreReport.vue'; 
import CreateUsers from '../CreateUsers.vue';

const emit = defineEmits(['logout']);

// ២. ទាញយក user និង logout function ពី useAuth
const { user, logout } = useAuth();

// កំណត់ Default ជា true ប៉ុន្តែវានឹងត្រូវបាន update ពេល component ដំណើរការ
const isSidebarOpen = ref(true); 
const isLogoutModalOpen = ref(false);
const activeMenu = ref('គ្រប់គ្រង'); 

// --- មុខងារ Responsive Sidebar ---
const handleResize = () => {
  // ប្រសិនបើទំហំអេក្រង់តូចជាង 1024px (Tablet/Mobile) នោះបិទ Sidebar Auto
  if (window.innerWidth < 1024) {
    isSidebarOpen.value = false;
  } else {
    isSidebarOpen.value = true;
  }
};

onMounted(() => {
  // ឆែកមើលទំហំអេក្រង់ភ្លាមៗនៅពេលបើកទំព័រ
  handleResize();
  // តាមដានរាល់ពេលដែលអ្នកប្រើប្រាស់ទាញពង្រីក ឬបង្រួញអេក្រង់
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  // ជម្រះ Event Listener វិញពេលចេញពីទំព័រដើម្បីសន្សំសំចៃ Memory
  window.removeEventListener('resize', handleResize);
});
// ----------------------------------

// ៣. ចាប់យក Role ពីទិន្នន័យ User (ប្រើ Optional Chaining `?.` ការពារ Error ពេល user null)
const userRole = computed(() => user.value?.role || 'teacher');

// កំណត់សិទ្ធិទៅឱ្យ Menu នីមួយៗ
const allMenuItems = [
  { name: 'គ្រប់គ្រង', icon: LayoutDashboard, component: Dashboard, roles: ['admin', 'teacher'] },
  { name: 'សិស្ស', icon: Users, component: Students, roles: ['admin', 'teacher'] },
  { name: 'គ្រូបង្រៀន', icon: GraduationCap, component: Teachers, roles: ['admin'] }, 
  { name: 'ថ្នាក់', icon: BookOpen, component: Classes, roles: ['admin', 'teacher'] },
  { name: 'មុខវិជ្ជា', icon: BookCopy, component: Subject, roles: ['admin'] }, 
  { name: 'កាលវិភាគ', icon: CalendarClock, component: Schedule, roles: ['admin', 'teacher'] },
  { name: 'វត្តមានសិស្ស', icon: CalendarCheck, component: Attendance, roles: ['admin', 'teacher'] },
  { name: 'បញ្ចូលពិន្ទុ', icon: ClipboardList, component: Score, roles: ['admin', 'teacher'] }, 
  { name: 'របាយការណ៍ពិន្ទុ', icon: FileText, component: ScoreReport, roles: ['admin', 'teacher'] }, 
  { name: 'Finance', icon: Banknote, component: Finance, roles: ['admin'] }, 
  { name: 'Notices', icon: Megaphone, component: Notices, roles: ['admin', 'teacher'] },
  { name: 'អ្នកប្រើប្រាស់', icon: User, component: CreateUsers, roles: ['admin'] }, 
];

// ៤. Filter Menu ផ្អែកលើ userRole ដែលបានពី useAuth
const visibleMenuItems = computed(() => {
  return allMenuItems.filter(item => item.roles.includes(userRole.value));
});

const activeComponent = computed(() => {
  const currentItem = allMenuItems.find(item => item.name === activeMenu.value);
  if (currentItem && currentItem.roles.includes(userRole.value)) {
    return currentItem.component;
  }
  return Dashboard;
});

function handleNavigation(menuName) {
  activeMenu.value = menuName;
  // ប្រសិនបើចុចលើ Menu ហើយនៅលើអេក្រង់ទូរស័ព្ទ/Tablet គួរតែបិទ Sidebar វិញភ្លាមៗ
  if (window.innerWidth < 1024) {
    isSidebarOpen.value = false;
  }
}

// ៥. កែប្រែមុខងារ Logout ឱ្យហៅ logout() ពី useAuth
async function confirmLogout() {
  isLogoutModalOpen.value = false;
  await logout(); // ជម្រះ token និង user ចេញពី State និង LocalStorage
  emit('logout'); // បញ្ជូន Event ទៅខាងក្រៅដើម្បី Redirect ទៅទំព័រ Login
}
</script>