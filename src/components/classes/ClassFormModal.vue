<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" @click.self="handleClose">
      
      <Transition name="scale">
        <div v-if="isOpen" class="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h2 class="text-xl font-bold text-gray-800 font-khmer">
              {{ isEditing ? 'កែប្រែព័ត៌មានថ្នាក់ (Edit Class)' : 'បង្កើតថ្នាក់ថ្មី (Create Class)' }}
            </h2>
            <button @click="handleClose" class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="overflow-y-auto flex-1 p-6">
            <form id="classForm" @submit.prevent="submitForm" class="space-y-5">
              
              <div class="grid grid-cols-1 sm:grid-cols-4 gap-5">
                <div class="sm:col-span-1">
                  <label class="block text-sm font-medium text-gray-700 mb-1 font-khmer">លេខថ្នាក់ (No.) <span class="text-red-500">*</span></label>
                  <input
                    ref="firstInput"
                    type="number"
                    v-model.number="form.classNumber"
                    placeholder="101"
                    required
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div class="sm:col-span-3">
                  <label class="block text-sm font-medium text-gray-700 mb-1 font-khmer">ឈ្មោះថ្នាក់ (Class Name) <span class="text-red-500">*</span></label>
                  <input
                    type="text"
                    v-model="form.className"
                    placeholder="ឧ. ភាសាអង់គ្លេស កម្រិតដំបូង"
                    required
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-khmer"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1 font-khmer">កម្រិត (Grade) <span class="text-red-500">*</span></label>
                  <input
                    type="text"
                    v-model="form.classGrade"
                    placeholder="Grade 10 / Year 1"
                    required
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1 font-khmer">ប្រភេទថ្នាក់ (Type) <span class="text-red-500">*</span></label>
                  <input
                    type="text"
                    v-model="form.typeOfClass"
                    placeholder="Part-time / Full-time"
                    required
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1 font-khmer">ឆ្នាំសិក្សា (Year) <span class="text-red-500">*</span></label>
                  <input
                    type="text"
                    v-model="form.yearOnStudy"
                    placeholder="2024-2025"
                    required
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1 font-khmer">វេនសិក្សា (Time) <span class="text-red-500">*</span></label>
                  <select
                    v-model="form.timeStudy"
                    required
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-khmer"
                  >
                    <option disabled value="">ជ្រើសរើសវេន</option>
                    <option value="ព្រឹក">ព្រឹក (Morning)</option>
                    <option value="ល្ងាច">ល្ងាច (Afternoon)</option>
                    <option value="យប់">យប់ (Evening)</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1 font-khmer">គ្រូបង្រៀន (Teacher)</label>
                  <select
                    v-model="form.teacher"
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-khmer"
                  >
                    <option value="">-- មិនទាន់មានគ្រូ (No Teacher) --</option>
                    <option 
                      v-for="t in teachers" 
                      :key="t._id" 
                      :value="t._id"
                    >
                      {{ t.englishName }} ({{ t.khmerName }})
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1 font-khmer">ស្ថានភាព (Status)</label>
                  <select
                    v-model="form.status"
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    <option value="active">Active</option>
                    <option value="finished">Finished</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </form>
          </div>

          <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
            <button 
              type="button"
              @click="handleClose" 
              class="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-khmer"
            >
              បោះបង់ (Cancel)
            </button>
            <button 
              type="submit"
              form="classForm"
              :disabled="isSubmitting"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-khmer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isSubmitting" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              {{ isEditing ? 'រក្សាទុក (Save)' : 'បង្កើត (Create)' }}
            </button>
          </div>

        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { ref, reactive, watch, nextTick, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  isEditing: Boolean,
  classData: Object,
  teachers: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'save'])

const isSubmitting = ref(false)
const firstInput = ref(null)

const initialForm = {
  classNumber: '',
  className: '',
  classGrade: '',
  typeOfClass: '',
  yearOnStudy: '',
  timeStudy: '', 
  teacher: '',
  status: 'active'
}

const form = reactive({ ...initialForm })

// --- Logic ---

// 1. Reset & Populate
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    isSubmitting.value = false

    if (props.isEditing && props.classData) {
      // Edit Mode
      Object.assign(form, {
        classNumber: props.classData.classNumber,
        className: props.classData.className,
        classGrade: props.classData.classGrade,
        typeOfClass: props.classData.typeOfClass,
        yearOnStudy: props.classData.yearOnStudy,
        timeStudy: props.classData.timeStudy,
        status: props.classData.status || 'active',
      })
      // Handle Teacher Population safely
      form.teacher = props.classData.teacher 
        ? (typeof props.classData.teacher === 'object' ? props.classData.teacher._id : props.classData.teacher)
        : ''
    } else {
      // Create Mode
      Object.assign(form, initialForm)
    }

    // Auto focus the first input field
    await nextTick()
    if (firstInput.value) firstInput.value.focus()
  }
})

// 2. Submit Logic
const submitForm = async () => {
  // Native HTML validation handles required fields now.
  isSubmitting.value = true
  
  // Prepare payload
  const payload = { ...form }
  
  // IMPORTANT: If editing, attach the _id
  if (props.isEditing && props.classData?._id) {
    payload._id = props.classData._id
  }

  emit('save', payload)
  
  setTimeout(() => isSubmitting.value = false, 2000) 
}

const handleClose = () => {
  emit('close')
}

// Close on Escape Key
const onKeydown = (e) => {
  if (e.key === 'Escape' && props.isOpen) handleClose()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scale Transition */
.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s ease;
}
.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>