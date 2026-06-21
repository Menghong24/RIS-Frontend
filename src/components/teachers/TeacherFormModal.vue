<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="isOpen" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      
      <div class="bg-[#f3f4f6] rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto border border-gray-200">
        
        <div class="text-center py-6 border-b border-gray-300 bg-[#f3f4f6] sticky top-0 z-10">
          <h1 class="text-2xl font-bold text-gray-800 font-khmer">
            {{ isEditing ? 'កែប្រែព័ត៌មានគ្រូ' : 'បញ្ចូលគ្រូបង្រៀនថ្មី' }}
          </h1>
        </div>

        <form @submit.prevent="handleSubmit" class="p-8 space-y-6 ">
          
          <div>
            <h3 class="text-gray-600 font-medium mb-3 font-khmer">ឈ្មោះរបស់គ្រូ</h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 ">
              <input 
                type="text" 
                v-model="form.khmerName" 
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " 
                placeholder="ឈ្មោះ(ជាភាសាខ្មែរ)*" 
                required
              >
              <input 
                type="text" 
                v-model="form.englishName" 
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                placeholder="ឈ្មោះ(ជាភាសាឡាតាំង)*" 
                required
              >
              <input 
                type="text" 
                v-model="form.nationality" 
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                placeholder="សញ្ជាតិ *" 
                required
              >
              <select v-model="form.gender" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required>
                <option value="" disabled selected>ភេទ *</option>
                <option value="ប្រុស">ប្រុស (Male)</option>
                <option value="ស្រី">ស្រី (Female)</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <h3 class="text-gray-600 font-medium mb-3 font-khmer">ថ្ងៃខែឆ្នាំកំណើត និង ទំនាក់ទំនង</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="relative">
                <input 
                  type="date" 
                  v-model="form.dateOfBirth" 
                  class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                  required
                >
              </div>
              <input type="text" v-model="form.phone" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="លេខទូរស័ព្ទ *" required>
              <input type="text" v-model="form.telegram" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Telegram">
            </div>
          </div>

          <div>
            <h3 class="text-gray-600 font-medium mb-3 font-khmer">លំនៅដ្ឋានបច្ចុប្បន្ន</h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input type="text" v-model="form.currentResidence.village" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="ភូមិបច្ចុប្បន្ន">
              <input type="text" v-model="form.currentResidence.commune" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="ឃុំ/សង្កាត់បច្ចុប្បន្ន">
              <input type="text" v-model="form.currentResidence.district" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="ស្រុកបច្ចុប្បន្ន">
              <input type="text" v-model="form.currentResidence.province" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="ខេត្តបច្ចុប្បន្ន">
            </div>
          </div>

          <div>
             <h3 class="text-gray-600 font-medium mb-3 font-khmer">ជំនាញ និង ព័ត៌មានផ្សេងៗ</h3>
             <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input type="text" v-model="form.skill" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="ជំនាញឯកទេស *" required>
                <input type="email" v-model="form.email" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Email Address">
             </div>
             <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" v-model="form.facebook" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Facebook Name/Link">
                <input type="text" v-model="form.note" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="កំណត់សម្គាល់ (Note)">
             </div>
          </div>

        </form>

        <div class="bg-[#e5e7eb] p-4 flex justify-end space-x-3 rounded-b-xl mt-4">
          <button 
            type="button" 
            @click="$emit('close')" 
            class="bg-gray-200 text-gray-700 font-bold font-khmer px-6 py-2.5 rounded hover:bg-gray-300 transition-colors"
          >
            ថយក្រោយ
          </button>
          <button 
            @click="handleSubmit"
            class="bg-blue-600 text-white font-bold font-khmer px-6 py-2.5 rounded hover:bg-blue-700 shadow transition-all"
          >
            {{ isEditing ? 'រក្សាទុក' : 'បញ្ចូលគ្រូថ្មី' }} </button>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  isEditing: Boolean,
  teacher: {
    type: Object,
    default: () => null
  },
});

const emit = defineEmits(['close', 'save']);

// UPDATED: Matches teacher.model.js exactly (Removed placeOfBirth)
const defaultForm = {
  khmerName: '',
  englishName: '',
  gender: '',
  nationality: '',
  dateOfBirth: '',
  email: '',
  phone: '',
  skill: '',
  facebook: '',
  telegram: '', 
  currentResidence: {
    village: '',
    commune: '',
    district: '',
    province: ''
  },
  note: ''
};

const form = ref(JSON.parse(JSON.stringify(defaultForm)));

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.isEditing && props.teacher) {
      // Create a copy of the teacher object
      const data = JSON.parse(JSON.stringify(props.teacher));
      
      // Ensure currentResidence object exists (in case DB has missing fields)
      if (!data.currentResidence) {
        data.currentResidence = { ...defaultForm.currentResidence };
      }
      
      form.value = data;
    } else {
      // Reset to default for new entry
      form.value = JSON.parse(JSON.stringify(defaultForm));
    }
  }
}, { immediate: true });

const handleSubmit = () => {
  emit('save', form.value);
};
</script>