<template>
  <aside
    :class="isSidebarOpen ? 'w-72 max-w-[85vw] border-r' : 'w-0 border-r-0'"
    class="h-screen flex flex-col bg-slate-50 border-slate-200 shadow-xl lg:shadow-sm overflow-hidden shrink-0 transition-all duration-300 print:hidden"
  >
    <div
      v-show="isSidebarOpen"
      class="h-full flex flex-col min-w-72 max-w-[85vw]"
    >
      <!-- Logo -->
      <div
        class="h-16 flex items-center justify-center border-b border-slate-200 shrink-0 px-3 bg-white"
      >
        <div
          class="w-full flex items-center gap-3 rounded-xl bg-blue-50 border border-blue-100 px-3 py-2"
        >
          <div
            class="h-9 w-9 rounded-lg bg-white flex items-center justify-center border border-blue-100 shadow-sm overflow-hidden shrink-0"
          >
            <img
              :src="logoRIS"
              alt="RIS Logo"
              class="h-8 w-8 object-contain"
            />
          </div>

          <div class="min-w-0">
            <p
              class="text-base font-extrabold text-blue-700 tracking-widest leading-none"
            >
              R I S
            </p>
            <p class="text-[10px] text-slate-500 mt-1 truncate">
              សាលាអន្តរជាតិ អា អាយ អេស
            </p>
          </div>
        </div>
      </div>

      <!-- Menu -->
      <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 sidebar-scroll">
        <template
          v-for="item in menuItems"
          :key="item.name"
        >
          <!-- Parent Menu With Children -->
          <button
            v-if="item.children?.length"
            type="button"
            @click="toggleGroup(item.name)"
            class="group w-full flex items-center rounded-xl px-3 py-2.5 justify-start transition-all duration-200 text-sm font-bold border"
            :class="
              isGroupOpen(item.name) || isGroupActive(item)
                ? 'bg-blue-100 text-blue-700 border-blue-200 shadow-sm'
                : 'text-slate-600 hover:bg-white hover:text-blue-600 border-transparent hover:border-slate-200'
            "
            :title="item.name"
          >
            <span class="w-6 flex items-center justify-center shrink-0">
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
              class="fa-solid fa-chevron-down text-[10px] transition-transform duration-200"
              :class="isGroupOpen(item.name) ? 'rotate-180' : ''"
            ></i>
          </button>

          <!-- Children Menu -->
          <Transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 max-h-0"
            enter-to-class="opacity-100 max-h-96"
            leave-active-class="transition-all duration-150 ease-in"
            leave-from-class="opacity-100 max-h-96"
            leave-to-class="opacity-0 max-h-0"
          >
            <div
              v-if="item.children?.length && isGroupOpen(item.name)"
              class="ml-4 pl-3 border-l border-blue-100 space-y-1 overflow-hidden"
            >
              <button
                v-for="child in item.children"
                :key="child.name"
                type="button"
                @click="$emit('menu-click', child.name)"
                class="group w-full flex items-center rounded-xl px-3 py-2.5 justify-start transition-all duration-200 text-sm font-bold border"
                :class="
                  activeMenu === child.name
                    ? 'bg-blue-50 text-blue-700 border-blue-100 shadow-sm'
                    : 'text-slate-500 hover:bg-white hover:text-blue-600 border-transparent hover:border-slate-200'
                "
                :title="child.name"
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
            @click="$emit('menu-click', item.name)"
            class="group w-full flex items-center rounded-xl px-3 py-2.5 justify-start transition-all duration-200 text-sm font-bold border"
            :class="
              activeMenu === item.name
                ? 'bg-blue-100 text-blue-700 border-blue-200 shadow-sm'
                : 'text-slate-600 hover:bg-white hover:text-blue-600 border-transparent hover:border-slate-200'
            "
            :title="item.name"
          >
            <span class="w-6 flex items-center justify-center shrink-0">
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
        </template>

        <div
          v-if="menuItems.length === 0"
          class="rounded-xl border border-dashed border-slate-300 bg-white px-3 py-6 text-center"
        >
          <div
            class="mx-auto mb-2 h-10 w-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center"
          >
            <i class="fa-solid fa-list"></i>
          </div>

          <p class="text-xs font-bold text-slate-400">
            មិនមានម៉ឺនុយសម្រាប់បង្ហាញ
          </p>
        </div>
      </nav>

      <!-- Logout -->
      <div class="px-3 py-3 border-t border-slate-200 shrink-0 bg-white">
        <button
          type="button"
          @click="$emit('logout-click')"
          class="group w-full flex items-center rounded-xl px-3 py-2.5 justify-start text-sm font-bold text-slate-600 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-100 transition-all duration-200"
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
  </aside>
</template>

<script setup>
import { ref } from "vue";
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
  }
});

defineEmits(["menu-click", "logout-click"]);

// Important:
// Refresh page -> submenu is hidden.
// Click parent "របាយការណ៍" -> show children.
const openGroups = ref([]);

const isGroupOpen = (name) => {
  return openGroups.value.includes(name);
};

const toggleGroup = (name) => {
  if (isGroupOpen(name)) {
    openGroups.value = openGroups.value.filter((item) => item !== name);
    return;
  }

  openGroups.value.push(name);
};

const isGroupActive = (item) => {
  return item.children?.some((child) => child.name === props.activeMenu);
};
</script>

<style scoped>
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
</style>