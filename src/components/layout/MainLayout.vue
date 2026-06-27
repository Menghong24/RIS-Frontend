<template>
  <div class="flex h-screen overflow-hidden bg-gray-100 text-gray-800">
    <!-- Mobile Sidebar Overlay -->
    <div
      v-if="isSidebarOpen"
      @click="isSidebarOpen = false"
      class="fixed inset-0 bg-black/30 backdrop-blur-[1px] z-30 lg:hidden"
    ></div>

    <!-- Sidebar -->
    <Sidebar
      :is-sidebar-open="isSidebarOpen"
      :menu-items="visibleMenuItems"
      :active-menu="activeMenu"
      @menu-click="handleNavigation"
      @logout-click="isLogoutModalOpen = true"
    />

    <!-- Main -->
    <div class="flex flex-col flex-1 overflow-hidden min-w-0">
      <Header
        @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
        @navigate="handleNavigation"
      />

      <main class="flex-1 overflow-y-auto p-3 md:p-4 bg-slate-50">
        <component
          :is="activeComponent"
          @navigateTo="handleNavigation"
        />
      </main>
    </div>
<!-- Logout Modal -->
<div
  v-if="isLogoutModalOpen"
  class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 backdrop-blur-sm p-4"
  @click.self="isLogoutModalOpen = false"
>
  <div class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200">
    <!-- Modal Header -->
    <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="h-11 w-11 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
          <LogOut class="h-5 w-5" />
        </div>

        <div class="text-left">
          <h2 class="text-base font-extrabold text-slate-800">
            បញ្ជាក់ការចាកចេញ
          </h2>

          <p class="text-xs text-slate-500 mt-0.5">
            តើអ្នកពិតជាចង់ចាកចេញពីគណនីមែនទេ?
          </p>
        </div>
      </div>

      <button
        @click="isLogoutModalOpen = false"
        class="h-8 w-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 inline-flex items-center justify-center transition"
        aria-label="Close"
      >
        <span class="text-xl leading-none">&times;</span>
      </button>
    </div>

    <!-- Modal Body -->
    <div class="px-5 py-5">
      <div class="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-left">
        <p class="text-sm font-bold text-red-700">
          ចាកចេញពីប្រព័ន្ធ
        </p>

        <p class="text-xs text-red-600 mt-1 leading-relaxed">
          បន្ទាប់ពីចាកចេញ អ្នកត្រូវ login ម្តងទៀត ដើម្បីប្រើប្រាស់ប្រព័ន្ធ។
        </p>
      </div>
    </div>

    <!-- Modal Actions -->
    <div class="px-5 py-4 bg-slate-50 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
      <button
        @click="isLogoutModalOpen = false"
        class="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 text-xs font-extrabold transition"
      >
        បោះបង់
      </button>

      <button
        @click="confirmLogout"
        class="w-full sm:w-auto px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs font-extrabold shadow-sm transition inline-flex items-center justify-center gap-2"
      >
        <LogOut class="h-4 w-4" />
        ចាកចេញ
      </button>
    </div>
  </div>
</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../../hooks/useAuth";

import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  Banknote,
  Megaphone,
  LogOut,
  CalendarClock,
  ClipboardList,
  BookCopy,
  User,
  FileText,
  Receipt
} from "lucide-vue-next";

import Sidebar from "./Sidebar.vue";
import Header from "./Header.vue";

import Dashboard from "../Dashboard.vue";
import Students from "../Students.vue";
import Teachers from "../Teachers.vue";
import Classes from "../Classes.vue";
import Subject from "../Subject.vue";
import Attendance from "../Attendance.vue";
import Finance from "../Finance.vue";
import Notices from "../Notices.vue";
import Schedule from "../Schedule.vue";
import Score from "../Score.vue";
import ScoreReport from "../ScoreReport.vue";
import CreateUsers from "../CreateUsers.vue";
import AttendanceReport from "../AttendanceReport.vue";
import PaymentReport from "../PaymentReport.vue";

const router = useRouter();
const { user, logout } = useAuth();

const STORAGE_KEY = "school_active_menu";

const isSidebarOpen = ref(true);
const isLogoutModalOpen = ref(false);
const activeMenu = ref(localStorage.getItem(STORAGE_KEY) || "គ្រប់គ្រង");

// RESPONSIVE SIDEBAR
const handleResize = () => {
  isSidebarOpen.value = window.innerWidth >= 1024;
};

const handleKeydown = (event) => {
  if (event.key === "Escape") {
    isLogoutModalOpen.value = false;

    if (window.innerWidth < 1024) {
      isSidebarOpen.value = false;
    }
  }
};

onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  window.removeEventListener("keydown", handleKeydown);
});

// ROLE
const userRole = computed(() => {
  return user.value?.role || "teacher";
});

// MENU
const allMenuItems = [
  {
    name: "គ្រប់គ្រង",
    icon: LayoutDashboard,
    component: Dashboard,
    roles: ["admin", "teacher"]
  },
  {
    name: "សិស្ស",
    icon: Users,
    component: Students,
    roles: ["admin", "teacher"]
  },
  {
    name: "គ្រូបង្រៀន",
    icon: GraduationCap,
    component: Teachers,
    roles: ["admin"]
  },
  {
    name: "ថ្នាក់",
    icon: BookOpen,
    component: Classes,
    roles: ["admin", "teacher"]
  },
  {
    name: "មុខវិជ្ជា",
    icon: BookCopy,
    component: Subject,
    roles: ["admin"]
  },
  {
    name: "កាលវិភាគ",
    icon: CalendarClock,
    component: Schedule,
    roles: ["admin", "teacher"]
  },
  {
    name: "វត្តមានសិស្ស",
    icon: CalendarCheck,
    component: Attendance,
    roles: ["admin", "teacher"]
  },
  {
    name: "របាយការណ៍វត្តមាន",
    icon: CalendarCheck,
    component: AttendanceReport,
    roles: ["admin", "teacher"]
  },
  {
    name: "បញ្ចូលពិន្ទុ",
    icon: ClipboardList,
    component: Score,
    roles: ["admin", "teacher"]
  },
  {
    name: "របាយការណ៍ពិន្ទុ",
    icon: FileText,
    component: ScoreReport,
    roles: ["admin", "teacher"]
  },
  {
    name: "បង់ប្រាក់",
    icon: Banknote,
    component: Finance,
    roles: ["admin"]
  },
  {
    name: "របាយការណ៍បង់ប្រាក់",
    icon: Receipt,
    component: PaymentReport,
    roles: ["admin"]
  },
  {
    name: "សេចក្ដីជូនដំណឹង",
    icon: Megaphone,
    component: Notices,
    roles: ["admin", "teacher"]
  },
  {
    name: "អ្នកប្រើប្រាស់",
    icon: User,
    component: CreateUsers,
    roles: ["admin"]
  }
];

const visibleMenuItems = computed(() => {
  return allMenuItems.filter((item) => item.roles.includes(userRole.value));
});

// SAFE ACTIVE MENU
watch(
  visibleMenuItems,
  (items) => {
    const hasActiveMenu = items.some((item) => item.name === activeMenu.value);

    if (!hasActiveMenu) {
      activeMenu.value = items[0]?.name || "គ្រប់គ្រង";
    }
  },
  {
    immediate: true
  }
);

// SAVE ACTIVE MENU
watch(activeMenu, (menuName) => {
  localStorage.setItem(STORAGE_KEY, menuName);
});

// SAFE COMPONENT RESOLUTION
const activeComponent = computed(() => {
  const item = visibleMenuItems.value.find((menuItem) => menuItem.name === activeMenu.value);

  return item?.component || Dashboard;
});

// NAVIGATION
function handleNavigation(name) {
  if (!name) return;

  const item = visibleMenuItems.value.find((menuItem) => menuItem.name === name);

  if (!item) return;

  activeMenu.value = name;

  if (window.innerWidth < 1024) {
    isSidebarOpen.value = false;
  }
}

// LOGOUT
async function confirmLogout() {
  isLogoutModalOpen.value = false;

  try {
    await logout();
  } catch (error) {
    console.error("Logout error:", error);
  }

  activeMenu.value = "គ្រប់គ្រង";
  localStorage.removeItem(STORAGE_KEY);

  await router.replace("/login");
}
</script>