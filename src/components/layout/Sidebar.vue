<template>
  <aside
    :class="isSidebarOpen ? 'w-64' : 'w-20'"
    class="h-screen flex flex-col bg-slate-50 border-r border-slate-200 shadow-sm transition-all duration-300 overflow-hidden shrink-0 print:hidden"
  >
    <!-- Logo -->
    <div class="h-16 flex items-center justify-center border-b border-slate-200 shrink-0 px-3 bg-white">
      <div
        v-if="isSidebarOpen"
        class="w-full flex items-center gap-3 rounded-xl bg-blue-50 border border-blue-100 px-3 py-2"
      >
        <div class="h-9 w-9 rounded-lg bg-white flex items-center justify-center border border-blue-100 shadow-sm overflow-hidden shrink-0">
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

      <div
        v-else
        class="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center overflow-hidden"
      >
        <img
          :src="logoRIS"
          alt="RIS Logo"
          class="h-9 w-9 object-contain"
        />
      </div>
    </div>

    <!-- Menu -->
    <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 sidebar-scroll">
      <button
        v-for="item in menuItems"
        :key="item.name"
        type="button"
        @click="$emit('menu-click', item.name)"
        class="group w-full flex items-center rounded-xl transition-all duration-200 text-sm font-bold"
        :class="[
          isSidebarOpen ? 'px-3 py-2.5 justify-start' : 'px-0 py-2.5 justify-center',
          activeMenu === item.name
            ? 'bg-blue-100 text-blue-700 border border-blue-200'
            : 'text-slate-600 hover:bg-white hover:text-blue-600 border border-transparent hover:border-slate-200'
        ]"
        :title="!isSidebarOpen ? item.name : ''"
      >
        <span
          class="flex items-center justify-center shrink-0"
          :class="isSidebarOpen ? 'w-6' : 'w-full'"
        >
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

        <span
          v-if="isSidebarOpen"
          class="ml-3 truncate"
        >
          {{ item.name }}
        </span>
      </button>
    </nav>

    <!-- Logout -->
    <div class="px-3 py-3 border-t border-slate-200 shrink-0 bg-white">
      <button
        type="button"
        @click="$emit('logout-click')"
        class="group w-full flex items-center rounded-xl text-sm font-bold text-slate-600 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-100 transition-all duration-200"
        :class="isSidebarOpen ? 'px-3 py-2.5 justify-start' : 'px-0 py-2.5 justify-center'"
        :title="!isSidebarOpen ? 'Logout' : ''"
      >
        <span
          class="flex items-center justify-center shrink-0"
          :class="isSidebarOpen ? 'w-6' : 'w-full'"
        >
          <i class="fa-solid fa-right-from-bracket text-base"></i>
        </span>

        <span
          v-if="isSidebarOpen"
          class="ml-3"
        >
          ចាកចេញ
        </span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import logoRIS from "../../assets/logoRIS.jpg";

defineProps({
  isSidebarOpen: Boolean,
  menuItems: {
    type: Array,
    default: () => []
  },
  activeMenu: String
});

defineEmits(["menu-click", "logout-click"]);
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