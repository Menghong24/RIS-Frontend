<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="isOpen" class="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
      
      <div class=" bg-white/60 rounded-xl shadow-2xl backdrop-blur-sm  w-full max-w-4xl overflow-hidden max-h-[90vh] overflow-y-auto">
        
        <div class="backdrop-blur-sm  p-6 flex items-center space-x-6 border-b border-white">
          <div class="relative">
            <img 
              :src="teacher.avatar || placeholderImage" 
              class="w-14 h-14 rounded-full object-cover ring-4 backdrop-blur-sm  ring-white shadow-md" 
              :alt="teacher.englishName"
            >
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-800 font-khmer mb-2">{{ teacher.khmerName }}</h2>
          </div>
        </div>

        <div class="p-6">
          <div class="bg-white/60 rounded-xl shadow-sm border border-gray-100 p-6">
            
            <h3 class="text-xl font-bold text-gray-800 font-khmer mb-6 border-b pb-2">ព័ត៌មានលំអិតរបស់គ្រូ</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-8 text-sm">
              <div>
                <p class="text-gray-500 font-khmer mb-1">ឈ្មោះគ្រូ (Khmer)</p>
                <p class="font-semibold text-gray-800 text-base font-khmer">{{ teacher.khmerName }}</p>
              </div>

              <div>
                <p class="text-gray-500 font-khmer mb-1">ឈ្មោះជាឡាតាំង</p>
                <p class="font-semibold text-gray-800 text-base">{{ teacher.englishName }}</p>
              </div>

              <div>
                <p class="text-gray-500 font-khmer mb-1">ភេទ</p>
                <p class="font-semibold text-gray-800 text-base font-khmer">{{ teacher.gender }}</p>
              </div>

               <div>
                <p class="text-gray-500 font-khmer mb-1">សញ្ជាតិ</p>
                <p class="font-semibold text-gray-800 text-base font-khmer">{{ teacher.nationality }}</p>
              </div>

              <div>
                <p class="text-gray-500 font-khmer mb-1">ថ្ងៃខែឆ្នាំកំណើត</p>
                <p class="font-semibold text-gray-800 text-base">{{ formatDate(teacher.dateOfBirth) }}</p>
              </div>

              <div>
                <p class="text-gray-500 font-khmer mb-1">លេខទូរស័ព្ទ</p>
                <p class="font-semibold text-gray-800 text-base">{{ teacher.phone }}</p>
              </div>

               <div>
                <p class="text-gray-500 font-khmer mb-1">Email</p>
                <p class="font-semibold text-gray-800 text-base">{{ teacher.email || 'N/A' }}</p>
              </div>
            </div>

            <div class=" space-y-4 pt-4  border-dashed">
              <!-- <div>
                <p class="text-gray-500 font-khmer mb-1">ទីកន្លែងកំណើត:</p>
                <p class="text-gray-800 font-khmer leading-relaxed">
                  <span class="text-gray-500">ភូមិ </span><span class="text-blue-600 font-medium">{{ teacher.placeOfBirth?.village || '...' }}</span>, 
                  <span class="text-gray-500">ឃុំ/សង្កាត់ </span><span class="text-blue-600 font-medium">{{ teacher.placeOfBirth?.commune || '...' }}</span>, 
                  <span class="text-gray-500">ស្រុក/ខណ្ឌ </span><span class="text-blue-600 font-medium">{{ teacher.placeOfBirth?.district || '...' }}</span>, 
                  <span class="text-gray-500">ខេត្ត/ក្រុង </span><span class="text-blue-600 font-medium">{{ teacher.placeOfBirth?.province || '...' }}</span>
                </p>
              </div> -->

              <div>
                <p class="text-gray-500 font-khmer mb-1">លំនៅដ្ឋានបច្ចុប្បន្ន:</p>
                <p class="text-gray-800 font-khmer leading-relaxed">
                  <span class="text-gray-500">ភូមិ </span><span class="text-blue-600 font-medium">{{ teacher.currentResidence?.village || '...' }}</span>, 
                  <span class="text-gray-500">ឃុំ/សង្កាត់ </span><span class="text-blue-600 font-medium">{{ teacher.currentResidence?.commune || '...' }}</span>, 
                  <span class="text-gray-500">ស្រុក/ខណ្ឌ </span><span class="text-blue-600 font-medium">{{ teacher.currentResidence?.district || '...' }}</span>, 
                  <span class="text-gray-500">ខេត្ត/ក្រុង </span><span class="text-blue-600 font-medium">{{ teacher.currentResidence?.province || '...' }}</span>
                </p>
              </div>
            </div>
            
            <div class="mt-8 pt-6 border-t border-gray-200">
               <!-- <h3 class="text-md font-bold text-gray-800 font-khmer mb-6">ព័ត៌មានបន្ថែម</h3> -->
               <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <p class="text-gray-500 font-khmer mb-1">ជំនាញ (Skill)</p>
                    <p class="font-semibold text-gray-800 text-base font-khmer">{{ teacher.skill || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500 font-khmer mb-1">Facebook</p>
                    <p class="font-semibold text-gray-800 text-base">{{ teacher.facebook || 'N/A' }}</p>
                  </div>
                  <!-- <div class="md:col-span-2">
                    <p class="text-gray-500 font-khmer mb-1">ចំណាំ (Note)</p>
                    <p class="font-semibold text-gray-800 text-base font-khmer">{{ teacher.not || '-' }}</p>
                  </div> -->
               </div>
            </div>

          </div>
        </div>

        <div class="p-4 flex justify-end border-t border-gray-200">
          <button 
            @click="$emit('close')" 
            class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-2 border border-gray-400 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  teacher: {
    type: Object,
    default: () => ({})
  },
});

defineEmits(['close']);

// Generate placeholder if avatar is missing
const placeholderImage = computed(() => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(props.teacher.englishName || 'Teacher')}&background=random&color=fff&size=128`;
});

// Simple date formatter
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
};
</script>

<style scoped>
/* Optional: Define Khmer font if imported in global CSS */
/* .font-khmer { font-family: 'Siemreap', sans-serif; } */
</style>