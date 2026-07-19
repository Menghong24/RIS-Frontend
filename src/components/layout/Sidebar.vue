<template>
  <aside
    :class="isSidebarOpen ? 'sidebar-open border-r' : 'sidebar-closed border-r-0'"
    class="sidebar-root print:hidden"
  >
    <Transition name="sidebar-content" appear>
      <div
        v-show="isSidebarOpen"
        class="h-full flex flex-col min-w-72 max-w-[85vw]"
      >
        <!-- Logo -->
        <div class="sidebar-logo-wrap">
          <div class="sidebar-logo-card">
            <div class="sidebar-logo-image">
              <img
                :src="logoRIS"
                alt="RIS Logo"
                class="h-8 w-8 object-contain"
              />
            </div>

            <div class="min-w-0">
              <p class="text-base font-extrabold text-blue-700 tracking-widest leading-none">
                R I S
              </p>

              <p class="text-[10px] text-slate-500 mt-1 truncate">
                សាលាអន្តរជាតិ អា អាយ អេស
              </p>
            </div>
          </div>
        </div>

        <!-- Menu -->
        <nav class="sidebar-scroll flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          <template
            v-for="(item, index) in menuItems"
            :key="item.name"
          >
            <div
              class="menu-row"
              :style="{ '--row-delay': `${Math.min(index * 28, 260)}ms` }"
            >
              <!-- Parent Menu With Children -->
              <button
                v-if="item.children?.length"
                type="button"
                @click="toggleGroup(item.name)"
                class="menu-button"
                :class="
                  isGroupOpen(item.name) || isGroupActive(item)
                    ? 'menu-button-active'
                    : 'menu-button-idle'
                "
                :title="item.name"
                :aria-expanded="isGroupOpen(item.name)"
              >
                <span class="menu-icon-wrap">
                  <component
                    v-if="item.icon"
                    :is="item.icon"
                    class="w-5 h-5"
                  />
                  <i
                    v-else
                    class="fa-solid fa-folder text-sm"
                  ></i>
                </span>

                <span class="ml-3 truncate flex-1 text-left">
                  {{ item.name }}
                </span>

                <i
                  class="fa-solid fa-chevron-down text-[10px] transition-transform duration-300 ease-out"
                  :class="isGroupOpen(item.name) ? 'rotate-180' : ''"
                ></i>
              </button>

              <!-- Children Menu -->
              <Transition
                name="submenu"
                @enter="onSubmenuEnter"
                @after-enter="onSubmenuAfterEnter"
                @leave="onSubmenuLeave"
              >
                <div
                  v-if="item.children?.length && isGroupOpen(item.name)"
                  class="submenu-wrap"
                >
                  <button
                    v-for="(child, childIndex) in item.children"
                    :key="child.name"
                    type="button"
                    @click="handleMenuClick(child.name)"
                    class="submenu-button"
                    :class="
                      activeMenu === child.name
                        ? 'submenu-button-active'
                        : 'submenu-button-idle'
                    "
                    :title="child.name"
                    :style="{ '--child-delay': `${Math.min(childIndex * 24, 160)}ms` }"
                  >
                    <span class="w-5 flex items-center justify-center shrink-0">
                      <component
                        v-if="child.icon"
                        :is="child.icon"
                        class="w-4 h-4"
                      />
                      <i
                        v-else
                        class="fa-solid fa-circle-dot text-[10px]"
                      ></i>
                    </span>

                    <span class="ml-3 truncate">
                      {{ child.name }}
                    </span>
                  </button>
                </div>
              </Transition>

              <!-- Normal Menu -->
              <button
                v-if="!item.children?.length"
                type="button"
                @click="handleMenuClick(item.name)"
                class="menu-button"
                :class="
                  activeMenu === item.name
                    ? 'menu-button-active'
                    : 'menu-button-idle'
                "
                :title="item.name"
              >
                <span class="menu-icon-wrap">
                  <component
                    v-if="item.icon"
                    :is="item.icon"
                    class="w-5 h-5"
                  />
                  <i
                    v-else
                    class="fa-solid fa-circle-dot text-sm"
                  ></i>
                </span>

                <span class="ml-3 truncate">
                  {{ item.name }}
                </span>
              </button>
            </div>
          </template>

          <Transition name="empty-state" appear>
            <div
              v-if="menuItems.length === 0"
              class="rounded-xl border border-dashed border-slate-300 bg-white px-3 py-6 text-center"
            >
              <div class="mx-auto mb-2 h-10 w-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
                <i class="fa-solid fa-list"></i>
              </div>

              <p class="text-xs font-bold text-slate-400">
                មិនមានម៉ឺនុយសម្រាប់បង្ហាញ
              </p>
            </div>
          </Transition>
        </nav>

        <!-- Logout -->
        <div class="sidebar-logout-wrap mobile-safe-bottom">
          <button
            type="button"
            @click="emit('logout-click')"
            class="logout-button"
            title="Logout"
          >
            <span class="w-6 flex items-center justify-center shrink-0">
              <i class="fa-solid fa-right-from-bracket text-base"></i>
            </span>

            <span class="ml-3">
              ចាកចេញ
            </span>
          </button>
        </div>
      </div>
    </Transition>
  </aside>
</template>

<script setup>
import { ref, watch } from "vue";
import logoRIS from "../../assets/logoRIS.jpg";

const props = defineProps({
  isSidebarOpen: {
    type: Boolean,
    default: false
  },
  menuItems: {
    type: Array,
    default: () => []
  },
  activeMenu: {
    type: String,
    default: ""
  },
  autoCloseParentMenu: {
    type: String,
    default: ""
  },
  autoCloseParentMenuKey: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(["menu-click", "logout-click"]);

// Refresh page -> submenu is hidden.
// Click parent "របាយការណ៍" -> show children.
const openGroups = ref([]);

const isGroupOpen = (name) => {
  return openGroups.value.includes(name);
};

const openGroup = (name) => {
  if (!name || isGroupOpen(name)) return;

  openGroups.value = [...openGroups.value, name];
};

const closeGroup = (name) => {
  if (!name) return;

  openGroups.value = openGroups.value.filter((item) => item !== name);
};

const getParentMenuNameByChildName = (childName) => {
  const parentMenu = props.menuItems.find((item) => {
    return item.children?.some((child) => child.name === childName);
  });

  return parentMenu?.name || "";
};

const toggleGroup = (name) => {
  if (isGroupOpen(name)) {
    closeGroup(name);
    return;
  }

  openGroup(name);
};

const isGroupActive = (item) => {
  return item.children?.some((child) => child.name === props.activeMenu);
};

const syncOpenGroupsWithActiveMenu = (menuName) => {
  const activeParentName = getParentMenuNameByChildName(menuName);

  if (activeParentName) {
    openGroup(activeParentName);
    return;
  }

  openGroups.value = [];
};

const handleMenuClick = (name) => {
  emit("menu-click", name);
};

const onSubmenuEnter = (element) => {
  element.style.height = "0px";
  element.style.opacity = "0";

  requestAnimationFrame(() => {
    element.style.height = `${element.scrollHeight}px`;
    element.style.opacity = "1";
  });
};

const onSubmenuAfterEnter = (element) => {
  element.style.height = "auto";
};

const onSubmenuLeave = (element) => {
  element.style.height = `${element.scrollHeight}px`;
  element.style.opacity = "1";

  requestAnimationFrame(() => {
    element.style.height = "0px";
    element.style.opacity = "0";
  });
};

watch(
  () => props.menuItems,
  () => {
    const validGroupNames = props.menuItems
      .filter((item) => item.children?.length)
      .map((item) => item.name);

    openGroups.value = openGroups.value.filter((name) => {
      return validGroupNames.includes(name);
    });

    syncOpenGroupsWithActiveMenu(props.activeMenu);
  },
  {
    immediate: true
  }
);

watch(
  () => props.activeMenu,
  (menuName) => {
    syncOpenGroupsWithActiveMenu(menuName);
  }
);

watch(
  () => props.autoCloseParentMenuKey,
  () => {
    closeGroup(props.autoCloseParentMenu);
  }
);
</script>

<style scoped>
.sidebar-root {
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  border-color: #e2e8f0;
  box-shadow: 0 20px 25px -5px rgb(15 23 42 / 0.12), 0 8px 10px -6px rgb(15 23 42 / 0.12);
  overflow: hidden;
  flex-shrink: 0;
  transition:
    width 300ms cubic-bezier(0.22, 1, 0.36, 1),
    max-width 300ms cubic-bezier(0.22, 1, 0.36, 1),
    border-color 220ms ease,
    box-shadow 220ms ease;
  will-change: width, max-width;
  font-family: "Khmer OS Battambang", "Battambang", "Noto Sans Khmer", system-ui, sans-serif;
}

@media (min-width: 1024px) {
  .sidebar-root {
    box-shadow: 0 1px 2px rgb(15 23 42 / 0.05);
  }
}

.sidebar-open {
  width: 18rem;
  max-width: 85vw;
}

.sidebar-closed {
  width: 0;
  max-width: 0;
}

.sidebar-logo-wrap {
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
  padding: 0 0.75rem;
  background: #ffffff;
}

.sidebar-logo-card {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 0.75rem;
  background: #eff6ff;
  border: 1px solid #dbeafe;
  padding: 0.5rem 0.75rem;
  animation: logoIn 360ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.sidebar-logo-image {
  height: 2.25rem;
  width: 2.25rem;
  border-radius: 0.5rem;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dbeafe;
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.05);
  overflow: hidden;
  flex-shrink: 0;
}

.menu-row {
  animation: menuRowIn 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: var(--row-delay, 0ms);
}

.menu-button,
.submenu-button,
.logout-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-radius: 0.75rem;
  border-width: 1px;
  font-size: 0.875rem;
  font-weight: 800;
  min-height: 2.55rem;
  transition:
    transform 180ms ease,
    background-color 180ms ease,
    color 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.menu-button {
  padding: 0.625rem 0.75rem;
}

.submenu-button {
  padding: 0.58rem 0.75rem;
  animation: childItemIn 260ms ease both;
  animation-delay: var(--child-delay, 0ms);
}

.menu-button:active,
.submenu-button:active,
.logout-button:active {
  transform: scale(0.985);
}

.menu-button:hover,
.submenu-button:hover,
.logout-button:hover {
  transform: translateX(2px);
}

.menu-button-active {
  background: #dbeafe;
  color: #1d4ed8;
  border-color: #bfdbfe;
  box-shadow: 0 1px 2px rgb(37 99 235 / 0.12);
}

.menu-button-idle {
  color: #475569;
  border-color: transparent;
}

.menu-button-idle:hover {
  background: #ffffff;
  color: #2563eb;
  border-color: #e2e8f0;
}

.submenu-button-active {
  background: #eff6ff;
  color: #1d4ed8;
  border-color: #dbeafe;
  box-shadow: 0 1px 2px rgb(37 99 235 / 0.08);
}

.submenu-button-idle {
  color: #64748b;
  border-color: transparent;
}

.submenu-button-idle:hover {
  background: #ffffff;
  color: #2563eb;
  border-color: #e2e8f0;
}

.menu-icon-wrap {
  width: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.submenu-wrap {
  margin-left: 1rem;
  padding-left: 0.75rem;
  border-left: 1px solid #dbeafe;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  overflow: hidden;
  transition:
    height 260ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 220ms ease;
}

.sidebar-logout-wrap {
  padding: 0.75rem;
  border-top: 1px solid #e2e8f0;
  flex-shrink: 0;
  background: #ffffff;
}

.logout-button {
  padding: 0.625rem 0.75rem;
  color: #475569;
  border-color: transparent;
}

.logout-button:hover {
  background: #fef2f2;
  color: #dc2626;
  border-color: #fee2e2;
}

.mobile-safe-bottom {
  padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));
}

.sidebar-scroll {
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

.sidebar-scroll::-webkit-scrollbar {
  width: 4px;
}

.sidebar-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 999px;
}

.sidebar-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-content-enter-active,
.sidebar-content-leave-active {
  transition:
    opacity 240ms ease,
    transform 280ms cubic-bezier(0.22, 1, 0.36, 1);
}

.sidebar-content-enter-from,
.sidebar-content-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.empty-state-enter-active,
.empty-state-leave-active {
  transition: all 220ms ease;
}

.empty-state-enter-from,
.empty-state-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
}

@keyframes logoIn {
  from {
    opacity: 0;
    transform: translateY(-6px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes menuRowIn {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes childItemIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .sidebar-root,
  .sidebar-root button,
  .sidebar-root input,
  .sidebar-root select,
  .sidebar-root textarea {
    font-size: 16px;
  }

  .menu-button,
  .submenu-button,
  .logout-button {
    font-size: 0.86rem;
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
