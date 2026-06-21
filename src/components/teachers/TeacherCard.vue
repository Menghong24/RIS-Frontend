<template>
  <div 
    class="group flex flex-col sm:flex-row items-center p-4 sm:p-5 bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-500 sm:hover:-translate-y-1 hover:border-blue-300 cursor-pointer w-full relative overflow-hidden z-0"
    @click="$emit('view', teacher)"
  >
    <div class="absolute inset-0 bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-transparent opacity-0 sm:-translate-x-full group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-700 ease-out -z-10"></div>

    <div class="relative flex-shrink-0 mb-4 sm:mb-0 sm:mr-5">
      <img 
        :src="teacher.avatar || placeholderImage" 
        class="w-20 h-20 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-white shadow-md transition-transform duration-500 group-hover:scale-110" 
        :alt="teacher.englishName"
      >
      <span class="absolute bottom-1 right-1 sm:bottom-0 sm:right-0 flex h-4 w-4 sm:h-4 sm:w-4">
        <span 
          v-if="isActive" 
          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
        ></span>
        <span 
          :class="isActive ? 'bg-green-500' : 'bg-gray-400'"
          class="relative inline-flex rounded-full h-4 w-4 border-2 border-white"
        ></span>
      </span>
    </div>

    <div class="flex-grow min-w-0 w-full flex flex-col items-center sm:items-start text-center sm:text-left transition-transform duration-500 sm:group-hover:translate-x-1">
      <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
        <h3 class="text-lg font-bold text-gray-800 font-khmer break-words">
          {{ teacher.khmerName || 'ឈ្មោះគ្រូ' }}
        </h3>
        <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-600 border border-blue-200 whitespace-nowrap transition-colors duration-300 group-hover:bg-white">
          {{ teacher.skill || 'General' }}
        </span>
      </div>
      
      <p class="text-sm text-gray-500 font-medium break-words">
        {{ teacher.englishName || 'Teacher Name' }}
      </p>
      
      <p class="text-xs text-gray-400 mt-1 break-all">
        {{ teacher.email || 'No email provided' }}
      </p>
    </div>

    <div class="flex-shrink-0 flex gap-3 sm:gap-2 mt-4 sm:mt-0 opacity-100 sm:opacity-0 sm:translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-75">
      <button 
        @click.stop="$emit('edit', teacher)" 
        class="flex items-center justify-center w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-blue-50 sm:bg-white text-blue-600 hover:bg-blue-600 hover:text-white transition-colors shadow-sm border sm:border-none border-blue-100"
        title="Edit"
      >
        <FilePenLine class="w-4 h-4 sm:w-4 sm:h-4" />
      </button>
      
      <button 
        @click.stop="$emit('delete', teacher)" 
        class="flex items-center justify-center w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-red-50 sm:bg-white text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-sm border sm:border-none border-red-100"
        title="Delete"
      >
        <Trash2 class="w-4 h-4 sm:w-4 sm:h-4" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { FilePenLine, Trash2 } from 'lucide-vue-next';

const props = defineProps({
  teacher: {
    type: Object,
    required: true,
    default: () => ({})
  },
});

defineEmits(['view', 'edit', 'delete']);

// Generate placeholder based on English name
const placeholderImage = computed(() => {
  const name = encodeURIComponent(props.teacher.englishName || 'Teacher');
  return `https://ui-avatars.com/api/?name=${name}&background=random&color=fff&size=128`;
});

// Check status
const isActive = computed(() => {
  return (props.teacher.status || 'active').toLowerCase() === 'active';
});
</script>

<style scoped>
/* Ensure fonts load smoothly */
.font-khmer {
  line-height: 1.5;
}
</style>