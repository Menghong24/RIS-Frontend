<template>
  <aside
    :class="isSidebarOpen ? 'w-64' : 'w-20'"
    class="h-screen flex flex-col bg-white shadow-2xl transition-all duration-300 overflow-hidden shrink-0 print:hidden"
  >
    <!-- Logo -->
    <div class="flex items-center justify-center h-18 border-b shrink-0">
      <BookMarked v-if="!isSidebarOpen" class="w-8 h-8 text-blue-600" />
      <span
        v-if="isSidebarOpen"
        class="text-2xl font-bold text-blue-600"
      >
        RIS
      </span>
    </div>

    <!-- Menu -->
    <nav class="flex-1 overflow-y-auto px-4 py-4 space-y-2">
      <button
        v-for="item in menuItems"
        :key="item.name"
        type="button"
        @click="$emit('menu-click', item.name)"
        class="w-full flex items-center px-4 py-2 rounded-lg transition-all"
        :class="
          activeMenu === item.name
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-600 hover:bg-blue-50'
        "
      >
        <component :is="item.icon" class="w-6 h-6" />
        <span v-if="isSidebarOpen" class="ml-4 font-medium">
          {{ item.name }}
        </span>
      </button>
    </nav>

    <!-- Logout -->
    <div class="px-4 py-4 border-t shrink-0">
      <button
        type="button"
        @click="$emit('logout-click')"
        class="w-full flex items-center px-4 py-2 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all"
      >
        <LogOut class="w-6 h-6" />
        <span v-if="isSidebarOpen" class="ml-4">
          Logout
        </span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { BookMarked, LogOut } from 'lucide-vue-next';

defineProps({
  isSidebarOpen: Boolean,
  menuItems: Array,
  activeMenu: String,
});

defineEmits(['menu-click', 'logout-click']);
</script>