<template>
  <div class="layout-root min-h-screen overflow-hidden bg-slate-100 text-slate-800">
    <!-- Loading user role -->
    <Transition name="loading-fade" appear>
      <div
        v-if="!isUserReady"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-white"
      >
        <div class="text-center loading-card">
          <div
            class="mx-auto mb-3 h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 loading-icon"
          >
            <i class="fa-solid fa-circle-notch fa-spin text-xl"></i>
          </div>

          <p class="text-sm font-extrabold text-slate-700">
            កំពុងផ្ទៀងផ្ទាត់សិទ្ធិអ្នកប្រើប្រាស់...
          </p>
        </div>
      </div>
    </Transition>

    <template v-if="isUserReady">
      <!-- Mobile Sidebar Overlay -->
      <Transition
        enter-active-class="transition-opacity duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isMobileSidebarOpen"
          @click="closeSidebar"
          class="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[2px] lg:hidden"
          aria-hidden="true"
        ></div>
      </Transition>

      <!-- Layout Wrapper -->
      <div class="layout-shell flex h-screen overflow-hidden">
        <!-- Sidebar -->
        <aside
          :class="[
            'sidebar-shell fixed inset-y-0 left-0 z-50 shrink-0 transform transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:translate-x-0',
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          ]"
        >
          <Sidebar
            :is-sidebar-open="isSidebarOpen"
            :menu-items="visibleMenuItems"
            :active-menu="activeMenu"
            :auto-close-parent-menu="autoCloseParentMenu"
            :auto-close-parent-menu-key="autoCloseParentMenuKey"
            @menu-click="handleNavigation"
            @logout-click="openLogoutModal"
          />
        </aside>

        <!-- Main -->
        <div class="main-shell flex min-w-0 flex-1 flex-col overflow-hidden">
          <Header
            @toggle-sidebar="toggleSidebar"
            @navigate="handleNavigation"
          />

          <main class="main-content flex-1 overflow-y-auto bg-slate-50 p-3 md:p-4">
            <Transition name="page-fade-slide" mode="out-in" appear>
              <div :key="activeMenu" class="page-switch-wrap">
                <component
                  :is="activeComponent"
                  @navigateTo="handleNavigation"
                />
              </div>
            </Transition>
          </main>
        </div>
      </div>

      <!-- Logout Modal -->
      <Transition name="modal-fade">
        <div
          v-if="isLogoutModalOpen"
          class="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/45 backdrop-blur-sm p-4"
          @click.self="isLogoutModalOpen = false"
        >
          <Transition name="modal-card" appear>
            <div
              v-if="isLogoutModalOpen"
              class="logout-modal-card w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200"
            >
          <!-- Modal Header -->
          <div
            class="px-5 py-4 border-b border-slate-100 flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <div
                class="logout-icon h-11 w-11 rounded-full bg-red-50 text-red-600 flex items-center justify-center"
              >
                <LogOut class="h-5 w-5" />
              </div>

              <div class="text-left">
                <h2 class="text-base font-extrabold text-slate-800 break-words leading-snug">
                  បញ្ជាក់ការចាកចេញ
                </h2>

                <p class="text-xs text-slate-500 mt-0.5 break-words leading-snug">
                  តើអ្នកពិតជាចង់ចាកចេញពីគណនីមែនទេ?
                </p>
              </div>
            </div>

            <button
              @click="isLogoutModalOpen = false"
              class="h-8 w-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 inline-flex items-center justify-center transition-all duration-200 active:scale-95"
              aria-label="Close"
              type="button"
            >
              <span class="text-xl leading-none">&times;</span>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="px-5 py-5">
            <div
              class="logout-warning rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-left"
            >
              <p class="text-sm font-bold text-red-700 break-words leading-snug">
                ចាកចេញពីប្រព័ន្ធ
              </p>

              <p class="text-xs text-red-600 mt-1 leading-relaxed break-words">
                បន្ទាប់ពីចាកចេញ អ្នកត្រូវ login ម្តងទៀត ដើម្បីប្រើប្រាស់ប្រព័ន្ធ។
              </p>
            </div>
          </div>

          <!-- Modal Actions -->
          <div
            class="px-5 py-4 bg-slate-50 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-2"
          >
            <button
              @click="isLogoutModalOpen = false"
              class="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 text-xs font-extrabold transition-all duration-200 active:scale-95"
              type="button"
            >
              បោះបង់
            </button>

            <button
              @click="confirmLogout"
              class="w-full sm:w-auto px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs font-extrabold shadow-sm transition-all duration-200 active:scale-95 inline-flex items-center justify-center gap-2"
              type="button"
            >
              <LogOut class="h-4 w-4" />
              ចាកចេញ
            </button>
          </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
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
const toast = useToast();
const { user, logout } = useAuth();

const STORAGE_KEY = "school_active_menu";
const DESKTOP_WIDTH = 1024;

const isDesktop = ref(false);
const isSidebarOpen = ref(false);
const isLogoutModalOpen = ref(false);
const activeMenu = ref(localStorage.getItem(STORAGE_KEY) || "គ្រប់គ្រង");

const REPORT_MENU_NAME = "របាយការណ៍";
const REPORT_CHILD_MENU_NAMES = [
  "របាយការណ៍វត្តមាន",
  "របាយការណ៍ពិន្ទុ",
  "របាយការណ៍បង់ប្រាក់"
];

const autoCloseParentMenu = ref("");
const autoCloseParentMenuKey = ref(0);

const isReportMenuName = (menuName) => {
  return REPORT_MENU_NAME === menuName || REPORT_CHILD_MENU_NAMES.includes(menuName);
};

const closeReportMenuWhenLeavingReports = (nextMenuName) => {
  if (isReportMenuName(nextMenuName)) return;

  autoCloseParentMenu.value = REPORT_MENU_NAME;
  autoCloseParentMenuKey.value += 1;
};



const normalizeRole = (role) => {
  return String(role || "").trim().toLowerCase();
};

// ROLE
const userRole = computed(() => {
  return normalizeRole(user.value?.role);
});

const isUserReady = computed(() => {
  return Boolean(userRole.value);
});

// SIDEBAR
const isMobileSidebarOpen = computed(() => {
  return !isDesktop.value && isSidebarOpen.value;
});

const lockBodyScroll = () => {
  if (typeof document === "undefined") return;

  document.body.style.overflow =
    isMobileSidebarOpen.value || isLogoutModalOpen.value ? "hidden" : "";
};

const syncScreenSize = () => {
  if (typeof window === "undefined") return;

  const wasDesktop = isDesktop.value;
  isDesktop.value = window.innerWidth >= DESKTOP_WIDTH;

  if (isDesktop.value && !wasDesktop) {
    isSidebarOpen.value = true;
  }

  if (!isDesktop.value && wasDesktop) {
    isSidebarOpen.value = false;
  }

  lockBodyScroll();
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  if (!isDesktop.value) {
    isSidebarOpen.value = false;
  }
};

const openLogoutModal = () => {
  closeSidebar();
  isLogoutModalOpen.value = true;
};

const handleKeydown = (event) => {
  if (event.key === "Escape") {
    isLogoutModalOpen.value = false;

    if (!isDesktop.value) {
      isSidebarOpen.value = false;
    }
  }
};

onMounted(() => {
  isDesktop.value = window.innerWidth >= DESKTOP_WIDTH;
  isSidebarOpen.value = isDesktop.value;

  window.addEventListener("resize", syncScreenSize);
  window.addEventListener("keydown", handleKeydown);

  lockBodyScroll();
});

onUnmounted(() => {
  window.removeEventListener("resize", syncScreenSize);
  window.removeEventListener("keydown", handleKeydown);

  if (typeof document !== "undefined") {
    document.body.style.overflow = "";
  }
});

watch([isMobileSidebarOpen, isLogoutModalOpen], () => {
  lockBodyScroll();
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
    name: "វត្តមានសិស្ស",
    icon: CalendarCheck,
    component: Attendance,
    roles: ["admin", "teacher"]
  },
  {
    name: "បញ្ចូលពិន្ទុ",
    icon: ClipboardList,
    component: Score,
    roles: ["admin", "teacher"]
  },
  {
    name: "បង់ប្រាក់",
    icon: Banknote,
    component: Finance,
    roles: ["admin"]
  },
  {
    name: "របាយការណ៍",
    icon: FileText,
    roles: ["admin", "teacher"],
    children: [
      {
        name: "របាយការណ៍វត្តមាន",
        icon: CalendarCheck,
        component: AttendanceReport,
        roles: ["admin"]
      },
      {
        name: "របាយការណ៍ពិន្ទុ",
        icon: FileText,
        component: ScoreReport,
        roles: ["admin", "teacher"]
      },
      {
        name: "របាយការណ៍បង់ប្រាក់",
        icon: Receipt,
        component: PaymentReport,
        roles: ["admin"]
      }
    ]
  },
  {
    name: "កាលវិភាគ",
    icon: CalendarClock,
    component: Schedule,
    roles: ["admin", "teacher"]
  },
  {
    name: "មុខវិជ្ជា",
    icon: BookCopy,
    component: Subject,
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

const filterMenuByRole = (items) => {
  return items
    .map((item) => {
      const children = item.children ? filterMenuByRole(item.children) : [];

      const canSeeSelf = item.roles?.includes(userRole.value);

      if (children.length > 0) {
        return {
          ...item,
          children
        };
      }

      if (canSeeSelf) {
        return {
          ...item,
          children: undefined
        };
      }

      return null;
    })
    .filter(Boolean);
};

const visibleMenuItems = computed(() => {
  if (!isUserReady.value) return [];

  return filterMenuByRole(allMenuItems);
});

const flattenMenuItems = (items = []) => {
  return items.flatMap((item) => {
    if (item.children?.length) {
      return flattenMenuItems(item.children);
    }

    return [item];
  });
};

const visibleLeafMenuItems = computed(() => {
  return flattenMenuItems(visibleMenuItems.value);
});

const canOpenMenu = (name) => {
  return visibleLeafMenuItems.value.some((menuItem) => menuItem.name === name);
};

// SAFE ACTIVE MENU
watch(
  visibleMenuItems,
  () => {
    if (!isUserReady.value) return;

    const hasActiveMenu = canOpenMenu(activeMenu.value);

    if (!hasActiveMenu) {
      activeMenu.value = visibleLeafMenuItems.value[0]?.name || "គ្រប់គ្រង";
    }
  },
  {
    immediate: true
  }
);

// SAVE ACTIVE MENU
watch(activeMenu, (menuName) => {
  if (!isUserReady.value) return;

  if (canOpenMenu(menuName)) {
    localStorage.setItem(STORAGE_KEY, menuName);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
});

// SAFE COMPONENT RESOLUTION
const activeComponent = computed(() => {
  const item = visibleLeafMenuItems.value.find(
    (menuItem) => menuItem.name === activeMenu.value
  );

  return item?.component || Dashboard;
});

// NAVIGATION
function handleNavigation(name) {
  if (!name) return;

  if (!canOpenMenu(name)) {
    const fallbackMenu = visibleLeafMenuItems.value[0]?.name || "គ្រប់គ្រង";

    closeReportMenuWhenLeavingReports(fallbackMenu);
    activeMenu.value = fallbackMenu;
    closeSidebar();
    return;
  }

  closeReportMenuWhenLeavingReports(name);
  activeMenu.value = name;
  closeSidebar();
}

// LOGOUT
async function confirmLogout() {
  isLogoutModalOpen.value = false;

  try {
    await logout();

    closeReportMenuWhenLeavingReports("គ្រប់គ្រង");
    activeMenu.value = "គ្រប់គ្រង";
    localStorage.removeItem(STORAGE_KEY);

    await router.replace("/login");
  } catch (error) {
    toast.error(
      error?.response?.data?.err ||
        error?.message ||
        "មិនអាចចាកចេញបានទេ"
    );
  }
}
</script>

<style scoped>
.layout-root {
  font-family: "Noto Sans Khmer", "Khmer OS Battambang", "Battambang", "Khmer OS", system-ui, sans-serif;
  line-height: 1.45;
}

.layout-root h2,
.layout-root p,
.layout-root span,
.layout-root button {
  line-height: 1.45;
}

.layout-root .break-words {
  overflow-wrap: anywhere;
  word-break: break-word;
}

.layout-shell {
  height: 100vh;
  height: 100dvh;
}

.main-shell {
  animation: mainShellIn 0.28s ease-out both;
}

.main-content {
  padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));
  -webkit-overflow-scrolling: touch;
}

.page-switch-wrap {
  min-width: 0;
}

.page-fade-slide-enter-active,
.page-fade-slide-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.page-fade-slide-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.sidebar-shell {
  will-change: transform;
}

.loading-card {
  animation: loadingCardIn 0.28s ease-out both;
}

.loading-icon {
  animation: softPulse 1.6s ease-in-out infinite;
}

.logout-modal-card {
  transform-origin: center;
}

.logout-icon {
  animation: softPop 0.25s ease-out both;
}

.logout-warning {
  animation: softRise 0.24s ease-out both;
}

.loading-fade-enter-active,
.loading-fade-leave-active,
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.22s ease;
}

.loading-fade-enter-from,
.loading-fade-leave-to,
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-card-enter-active,
.modal-card-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-card-enter-from,
.modal-card-leave-to {
  opacity: 0;
  transform: translateY(14px) scale(0.97);
}


@keyframes mainShellIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes loadingCardIn {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes softPulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(1.05);
    opacity: 0.86;
  }
}

@keyframes softPop {
  from {
    opacity: 0;
    transform: scale(0.92);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes softRise {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .modal-card-enter-from,
  .modal-card-leave-to {
    transform: translateY(22px) scale(0.98);
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
