<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
      
      <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h2 class="text-xl font-bold text-gray-800 font-khmer">
          {{ mode === 'transfer' ? 'ផ្លាស់ប្ដូរសិស្សទៅថ្នាក់ផ្សេង (Transfer Students Out)' : 'បញ្ចូលសិស្សថ្មី (Enroll New Students)' }}
        </h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <template v-if="!showTargetClassSelection">
        <div class="p-4 border-b border-gray-100 flex flex-wrap gap-4 items-center bg-white">
          <div class="relative flex-1 min-w-[200px]">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="ស្វែងរកសិស្សតាមឈ្មោះ ឬ អត្តលេខ..." 
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-khmer"
            >
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
          </div>
          
          <div class="flex items-center gap-4">
             <span class="text-sm text-gray-500 font-khmer">
               សរុប: <span class="font-bold text-blue-600">{{ filteredCandidates.length }}</span> នាក់
             </span>
             
             <button 
              v-if="filteredCandidates.length > 0"
              @click="toggleSelectAll"
              class="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              {{ isAllSelected ? 'Deselect All' : 'Select All' }}
            </button>
          </div>
        </div>

        <div class="overflow-y-auto flex-1 p-4 bg-gray-50">
          <div v-if="loading" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>

          <div v-else-if="filteredCandidates.length === 0" class="text-center py-10 text-gray-500 font-khmer">
            {{ mode === 'enroll' 
                ? 'មិនមានសិស្សថ្មីសម្រាប់ជ្រើសរើសទេ (No new students available)' 
                : 'មិនមានសិស្សនៅក្នុងថ្នាក់នេះទេ (No students in this class)' 
            }}
          </div>

          <div v-else>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div 
                v-for="student in paginatedCandidates" 
                :key="student._id"
                @click="toggleSelection(student._id)"
                class="bg-white p-3 rounded-lg border shadow-sm flex items-center justify-between cursor-pointer transition-all select-none group"
                :class="selectedIds.includes(student._id) ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'"
              >
                <div class="flex items-center gap-3 overflow-hidden">
                  <div 
                    class="flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors"
                    :class="selectedIds.includes(student._id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white group-hover:border-blue-400'"
                  >
                    <svg v-if="selectedIds.includes(student._id)" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>

                  <img 
                    v-if="student.photo"
                    :src="student.photo"
                    class="flex-shrink-0 h-10 w-10 rounded-full object-cover border border-gray-200"
                  />
                  <div v-else class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {{ student.englishName ? student.englishName.charAt(0).toUpperCase() : (student.khmerName ? student.khmerName.charAt(0) : 'S') }}
                  </div>

                  <div class="min-w-0">
                    <h4 class="font-bold text-gray-800 font-khmer truncate text-sm">
                      {{ student.khmerName }}
                    </h4>
                    
                    <div class="text-xs text-gray-500 flex gap-2 items-center mt-0.5">
                      <span class="font-mono">{{ student.studentId }}</span>
                      <span v-if="mode === 'transfer'" class="text-orange-600 font-medium truncate">
                        | កំពុងរៀនទីនេះ
                      </span>
                      <span v-else class="text-green-600 font-medium">| Available</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="totalPages > 1" class="flex justify-center items-center gap-4 mt-6 pt-2">
              <button 
                @click="prevPage" 
                :disabled="currentPage === 1"
                class="px-3 py-1 text-sm border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span class="text-sm font-medium text-gray-600">
                Page {{ currentPage }} of {{ totalPages }}
              </span>
              <button 
                @click="nextPage" 
                :disabled="currentPage === totalPages"
                class="px-3 py-1 text-sm border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="flex-1 bg-gray-50 flex flex-col items-center justify-center p-8">
          <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full max-w-md text-center">
            <div class="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            
            <h3 class="text-xl font-bold text-gray-800 mb-2 font-khmer">ជ្រើសរើសថ្នាក់គោលដៅ</h3>
            <p class="text-gray-500 mb-6 text-sm">
              អ្នកបានជ្រើសរើសសិស្សចំនួន <span class="font-bold text-blue-600">{{ selectedIds.length }}</span> នាក់ ដើម្បីផ្លាស់ប្ដូរ។ តើអ្នកចង់ប្ដូរពួកគេទៅថ្នាក់ណា?
            </p>

            <select 
              v-model="targetClassId"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none font-khmer mb-4"
            >
              <option value="" disabled>-- សូមជ្រើសរើសថ្នាក់ (Select Class) --</option>
              <option 
                v-for="c in availableTargetClasses" 
                :key="c._id" 
                :value="c._id"
              >
                {{ c.className }} ({{ c.classGrade }}) - {{ c.timeStudy }}
              </option>
            </select>

            <button 
              @click="showTargetClassSelection = false" 
              class="text-gray-500 hover:text-gray-700 underline text-sm font-khmer transition-colors"
            >
              ត្រលប់ក្រោយដើម្បីកែប្រែសិស្ស (Back to Selection)
            </button>
          </div>
        </div>
      </template>

      <div class="px-6 py-4 bg-white border-t border-gray-100 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div class="text-sm font-medium text-gray-600">
          <span v-if="!showTargetClassSelection">
            <span class="font-bold text-blue-600">{{ selectedIds.length }}</span> students selected
          </span>
        </div>

        <div class="flex gap-3">
          <button 
            @click="$emit('close')" 
            class="px-4 py-2 text-gray-600 hover:text-gray-800 font-khmer hover:bg-gray-100 rounded-lg transition-colors"
          >
            បិទ (Close)
          </button>
          
          <button 
            v-if="mode === 'enroll'"
            @click="handleBulkEnroll"
            :disabled="selectedIds.length === 0 || isSubmitting"
            class="px-5 py-2 text-white font-medium rounded-lg transition-all flex items-center gap-2 shadow-md bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isSubmitting" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            <span>បញ្ចូលទាំងអស់ (Enroll All)</span>
          </button>

          <template v-if="mode === 'transfer'">
            <button 
              v-if="!showTargetClassSelection"
              @click="showTargetClassSelection = true"
              :disabled="selectedIds.length === 0"
              class="px-5 py-2 text-white font-medium rounded-lg transition-all bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed font-khmer"
            >
              បន្តទៅជ្រើសរើសថ្នាក់ (Next)
            </button>
            
            <button 
              v-else
              @click="handleBulkEnroll"
              :disabled="!targetClassId || isSubmitting"
              class="px-5 py-2 text-white font-medium rounded-lg transition-all flex items-center gap-2 shadow-md bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed font-khmer"
            >
              <span v-if="isSubmitting" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              <span>បញ្ជាក់ការផ្លាស់ប្ដូរ (Confirm Transfer)</span>
            </button>
          </template>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuery } from '../../hooks/useQuery.js' 
import api from '../../config/api.js' 
import { useToast } from "vue-toastification"

const props = defineProps({
  isOpen: Boolean,
  currentClassId: String,
  mode: { 
    type: String, 
    default: 'enroll' // 'enroll' or 'transfer'
  }
})

const emit = defineEmits(['close', 'refresh'])
const toast = useToast()

// Data fetching
const { data: allStudents, loading } = useQuery('students')
const { data: allClasses } = useQuery('classes') // Fetch classes for target selection

const searchQuery = ref('')
const selectedIds = ref([]) 
const isSubmitting = ref(false)

// Transfer Mode Specific State
const showTargetClassSelection = ref(false)
const targetClassId = ref('')

// Pagination State
const currentPage = ref(1)
const itemsPerPage = 16

const getStudentGradeId = (student) => {
  if (!student.grade) return null
  return (typeof student.grade === 'object') ? student.grade._id : student.grade
}

// 1. Filter Available Target Classes
const availableTargetClasses = computed(() => {
  if (!allClasses.value) return []
  // Hide current class from dropdown
  return allClasses.value.filter(c => c._id !== props.currentClassId)
})

// 2. Filter Students Logic
const filteredCandidates = computed(() => {
  if (!allStudents.value) return []
  
  return allStudents.value.filter(s => {
    const studentGradeId = getStudentGradeId(s)
    
    // ENROLL MODE: Show students with NO class yet
    if (props.mode === 'enroll') {
       if (studentGradeId) return false
    } 
    // TRANSFER MODE: Show ONLY students currently in THIS class
    else if (props.mode === 'transfer') {
       if (studentGradeId !== props.currentClassId) return false
    }

    // Search Filter
    const query = searchQuery.value.toLowerCase()
    const fullName = `${s.khmerName || ''} ${s.englishName || ''}`.toLowerCase()
    return fullName.includes(query) || (s.studentId && s.studentId.toString().includes(query))
  })
})

// 3. Pagination Logic
const totalPages = computed(() => Math.ceil(filteredCandidates.value.length / itemsPerPage))

const paginatedCandidates = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredCandidates.value.slice(start, end)
})

const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }

watch([searchQuery, () => props.mode], () => { currentPage.value = 1 })

// 4. Selection Logic
const toggleSelection = (id) => {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter(selectedId => selectedId !== id)
  } else {
    selectedIds.value.push(id)
  }
}

const isAllSelected = computed(() => {
  if (filteredCandidates.value.length === 0) return false
  return filteredCandidates.value.every(s => selectedIds.value.includes(s._id))
})

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = filteredCandidates.value.map(s => s._id)
  }
}

// Reset everything when modal closes/opens
watch(() => props.isOpen, (newVal) => {
  if (!newVal) {
    selectedIds.value = []
    searchQuery.value = ''
    currentPage.value = 1
    showTargetClassSelection.value = false
    targetClassId.value = ''
  }
})

// 5. Submit Action
const handleBulkEnroll = async () => {
  if (selectedIds.value.length === 0) return
  
  // Determine which class ID receives the students
  let endpointClassId = props.currentClassId;

  if (props.mode === 'transfer') {
    if (!targetClassId.value) {
      toast.error("Please select a target class first.");
      return;
    }
    // We send the students to the NEW class ID
    endpointClassId = targetClassId.value;
  }

  isSubmitting.value = true

  try {
    // Assuming backend enroll pushes students into the target class 
    // and updates their 'grade' reference
    await api.post(`/classes/${endpointClassId}/enroll`, {
       studentIds: selectedIds.value 
    })

    toast.success(`Successfully ${props.mode === 'transfer' ? 'transferred' : 'enrolled'} ${selectedIds.value.length} students!`)
    emit('refresh')
    emit('close')

  } catch (error) {
    console.error("Bulk action error:", error)
    toast.error(error.response?.data?.message || "Failed to process request")
  } finally {
    isSubmitting.value = false
  }
}
</script>