<template>
  <div class="flex h-screen overflow-hidden bg-gray-100 text-gray-800">

    <!-- Sidebar -->
    <Sidebar
      :is-sidebar-open="isSidebarOpen"
      :menu-items="visibleMenuItems"
      :active-menu="activeMenu"
      @menu-click="handleNavigation"
      @logout-click="isLogoutModalOpen = true"
    />

    <!-- Main -->
    <div class="flex flex-col flex-1 overflow-hidden">

      <Header
        @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
        @navigate="handleNavigation"
      />

      <main class="flex-1 overflow-y-auto p-6">
        <component
          :is="activeComponent"
          @navigateTo="handleNavigation"
        />
      </main>

    </div>

    <!-- Logout Modal -->
    <div
      v-if="isLogoutModalOpen"
      class="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="bg-white/80 rounded-xl shadow-xl p-8 w-full max-w-sm text-center">

        <div class="mx-auto bg-red-100 rounded-full h-16 w-16 flex items-center justify-center">
          <LogOut class="h-8 w-8 text-red-600" />
        </div>

        <h2 class="text-2xl font-bold my-4">Confirm Logout</h2>
        <p class="text-gray-600">Are you sure you want to sign out?</p>

        <div class="mt-8 flex justify-center space-x-4">
          <button
            @click="isLogoutModalOpen = false"
            class="bg-gray-200 text-gray-700 font-semibold px-6 py-2 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            @click="confirmLogout"
            class="bg-red-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../hooks/useAuth';

import {
  LayoutDashboard, Users, GraduationCap, BookOpen,
  CalendarCheck, Banknote, Megaphone, LogOut,
  CalendarClock, ClipboardList, BookCopy, User, FileText
} from 'lucide-vue-next';

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

const router = useRouter();
const { user, logout } = useAuth();

const isSidebarOpen = ref(true);
const isLogoutModalOpen = ref(false);
const activeMenu = ref('គ្រប់គ្រង');

// RESPONSIVE SIDEBAR
const handleResize = () => {
  isSidebarOpen.value = window.innerWidth >= 1024;
};

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// ROLE
const userRole = computed(() => user.value?.role || 'teacher');

// MENU
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

const visibleMenuItems = computed(() =>
  allMenuItems.filter(i => i.roles.includes(userRole.value))
);

// SAFE COMPONENT RESOLUTION (FIX CRASH)
const activeComponent = computed(() => {
  const item = allMenuItems.find(i => i.name === activeMenu.value);

  // IMPORTANT FIX: prevent undefined render crash
  return item?.component || Dashboard;
});

// NAVIGATION (SAFE FIX)
function handleNavigation(name) {
  if (!name) return;

  const exists = allMenuItems.some(i => i.name === name);
  if (!exists) return;

  activeMenu.value = name;

  if (window.innerWidth < 1024) {
    isSidebarOpen.value = false;
  }
}

// 🚨 FIXED LOGOUT (STABLE + NO STUCK STATE)
async function confirmLogout() {
  isLogoutModalOpen.value = false;

  try {
    await logout();
  } catch (e) {
    console.error('Logout error:', e);
  }

  activeMenu.value = 'គ្រប់គ្រង';

  // IMPORTANT: force clean redirect
  await router.replace('/login');
}
</script>