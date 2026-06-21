<template>
  <aside :class="isSidebarOpen ? 'w-64' : 'w-20'" class="flex flex-col bg-white shadow-2xl transition-all duration-300 print:hidden">
    <div class="flex items-center justify-center h-18 border-b">
      <BookMarked v-if="!isSidebarOpen" class="w-8 h-8 text-blue-600" />
      <span v-if="isSidebarOpen" class="text-2xl font-bold text-blue-600">RIS</span>
    </div>
    <nav class="flex-1 px-4 py-4 space-y-2">
      <a v-for="item in menuItems" :key="item.name" href="#" 
         @click="$emit('menu-click', item.name)"
         class="flex items-center px-4 py-2 rounded-lg"
         :class="activeMenu === item.name ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-blue-50'">
        <component :is="item.icon" class="w-6 h-6" />
        <span v-if="isSidebarOpen" class="ml-4 font-medium">{{ item.name }}</span>
      </a>
    </nav>
     <div class="px-4 py-4 border-t">
       <a @click="$emit('logout-click')" href="#" class="flex items-center px-4 py-2 text-gray-600 rounded-lg hover:bg-blue-100 hover:text-blue-700">
          <LogOut class="w-6 h-6" />
          <span v-if="isSidebarOpen" class="ml-4">Logout</span>
      </a>
    </div>
  </aside>
</template>

<script setup>
import { BookMarked, LogOut } from 'lucide-vue-next';

// Define the props this component accepts from its parent
defineProps({
  isSidebarOpen: Boolean,
  menuItems: Array,
  activeMenu: String,
});

// Define the events this component can emit to its parent
defineEmits(['menu-click', 'logout-click']);
</script>