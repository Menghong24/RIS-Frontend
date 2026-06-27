<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-3"
  >
    <div
      class="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[86vh] border border-slate-100"
    >
      <!-- Header -->
      <div class="px-3 py-2.5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <div>
          <h2 class="text-sm font-extrabold text-slate-800 flex items-center gap-2">
            <span
              class="h-6 w-6 rounded-lg flex items-center justify-center text-[10px]"
              :class="mode === 'transfer'
                ? 'bg-orange-100 text-orange-600'
                : 'bg-blue-100 text-blue-700'"
            >
              <i :class="mode === 'transfer' ? 'fa-solid fa-right-left' : 'fa-solid fa-user-plus'"></i>
            </span>

            {{ mode === 'transfer' ? 'ផ្លាស់ប្ដូរសិស្សទៅថ្នាក់ផ្សេង' : 'បញ្ចូលសិស្សថ្មី' }}
          </h2>

          <p class="text-[10px] text-slate-500 mt-0.5">
            {{ mode === 'transfer' ? 'ជ្រើសរើសសិស្សសម្រាប់ផ្ទេរទៅថ្នាក់ផ្សេង' : 'ជ្រើសរើសសិស្សដែលមិនទាន់មានថ្នាក់' }}
          </p>
        </div>

        <button
          @click="$emit('close')"
          class="h-7 w-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <i class="fa-solid fa-xmark text-xs"></i>
        </button>
      </div>

      <!-- Student Selection -->
      <template v-if="!showTargetClassSelection">
        <!-- Search -->
        <div class="p-3 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-white">
          <div class="relative flex-1 min-w-[200px]">
            <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>

            <input
              v-model="searchQuery"
              type="text"
              placeholder="ស្វែងរកសិស្សតាមឈ្មោះ ឬ អត្តលេខ..."
              class="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
            />
          </div>

          <div class="flex items-center justify-between sm:justify-end gap-3">
            <span class="text-xs text-slate-500 font-bold">
              សរុប:
              <span class="font-extrabold text-blue-600">{{ filteredCandidates.length }}</span>
              នាក់
            </span>

            <button
              v-if="filteredCandidates.length > 0"
              @click="toggleSelectAll"
              class="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
            >
              <i class="fa-solid fa-check-double mr-1"></i>
              {{ isAllSelected ? 'ដកជម្រើសទាំងអស់' : 'ជ្រើសទាំងអស់' }}
            </button>
          </div>
        </div>

        <!-- List -->
        <div class="overflow-y-auto flex-1 p-3 bg-slate-50">
          <div v-if="loading" class="flex flex-col items-center justify-center py-8">
            <div class="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <i class="fa-solid fa-circle-notch fa-spin text-xl"></i>
            </div>
            <p class="text-xs font-bold text-slate-500 mt-2">កំពុងទាញយកទិន្នន័យ...</p>
          </div>

          <div
            v-else-if="filteredCandidates.length === 0"
            class="text-center py-10 text-slate-400 bg-white rounded-xl border border-dashed border-slate-300"
          >
            <i class="fa-solid fa-users-slash text-2xl mb-2"></i>
            <p class="text-sm font-bold text-slate-600">
              {{ mode === 'enroll'
                ? 'មិនមានសិស្សថ្មីសម្រាប់ជ្រើសរើសទេ'
                : 'មិនមានសិស្សនៅក្នុងថ្នាក់នេះទេ'
              }}
            </p>
          </div>

          <div v-else>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div
                v-for="student in paginatedCandidates"
                :key="student._id"
                @click="toggleSelection(student._id)"
                class="bg-white p-2.5 rounded-lg border shadow-sm flex items-center justify-between cursor-pointer transition select-none group"
                :class="selectedIds.includes(student._id)
                  ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-blue-300'"
              >
                <div class="flex items-center gap-2.5 overflow-hidden">
                  <!-- Checkbox -->
                  <div
                    class="flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition"
                    :class="selectedIds.includes(student._id)
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-slate-300 bg-white text-transparent group-hover:border-blue-400'"
                  >
                    <i
                      v-if="selectedIds.includes(student._id)"
                      class="fa-solid fa-check text-[10px]"
                    ></i>
                  </div>

                  <!-- Avatar -->
                  <img
                    v-if="student.photo"
                    :src="student.photo"
                    class="flex-shrink-0 h-9 w-9 rounded-full object-cover border border-slate-200"
                  />

                  <div
                    v-else
                    class="flex-shrink-0 h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-extrabold text-xs"
                  >
                    {{ student.englishName ? student.englishName.charAt(0).toUpperCase() : (student.khmerName ? student.khmerName.charAt(0) : 'S') }}
                  </div>

                  <!-- Info -->
                  <div class="min-w-0">
                    <h4 class="font-extrabold text-slate-800 truncate text-xs">
                      {{ student.khmerName || 'មិនមានឈ្មោះ' }}
                    </h4>

                    <div class="text-[11px] text-slate-500 flex gap-1 items-center mt-0.5">
                      <span class="font-mono">{{ student.studentId || '-' }}</span>

                      <span
                        v-if="mode === 'transfer'"
                        class="text-orange-600 font-bold truncate"
                      >
                        | កំពុងរៀនទីនេះ
                      </span>

                      <span
                        v-else
                        class="text-green-600 font-bold"
                      >
                        | ទំនេរ
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div
              v-if="totalPages > 1"
              class="flex justify-center items-center gap-2 mt-4 pt-2"
            >
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="px-3 py-1.5 text-xs border border-slate-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition font-bold text-slate-600"
              >
                <i class="fa-solid fa-chevron-left mr-1"></i>
                មុន
              </button>

              <span class="text-xs font-bold text-slate-600">
                ទំព័រ {{ currentPage }} នៃ {{ totalPages }}
              </span>

              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-3 py-1.5 text-xs border border-slate-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition font-bold text-slate-600"
              >
                បន្ទាប់
                <i class="fa-solid fa-chevron-right ml-1"></i>
              </button>
            </div>
          </div>
        </div>
      </template>

      <!-- Target Class Selection -->
      <template v-else>
        <div class="flex-1 bg-slate-50 flex flex-col items-center justify-center p-4">
          <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 w-full max-w-sm text-center">
            <div class="w-12 h-12 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <i class="fa-solid fa-right-left text-xl"></i>
            </div>

            <h3 class="text-sm font-extrabold text-slate-800 mb-1">
              ជ្រើសរើសថ្នាក់គោលដៅ
            </h3>

            <p class="text-slate-500 mb-4 text-xs leading-relaxed">
              អ្នកបានជ្រើសរើសសិស្សចំនួន
              <span class="font-extrabold text-blue-600">{{ selectedIds.length }}</span>
              នាក់ ដើម្បីផ្លាស់ប្ដូរ។
            </p>

            <select
              v-model="targetClassId"
              class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none text-xs text-slate-700 mb-3"
            >
              <option value="" disabled>ជ្រើសរើសថ្នាក់</option>
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
              class="text-slate-500 hover:text-slate-700 text-xs font-bold hover:underline transition"
            >
              <i class="fa-solid fa-arrow-left mr-1"></i>
              ត្រលប់ក្រោយដើម្បីកែប្រែសិស្ស
            </button>
          </div>
        </div>
      </template>

      <!-- Footer -->
      <div class="px-3 py-2.5 bg-white border-t border-slate-100 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.03)]">
        <div class="text-xs font-bold text-slate-600">
          <span v-if="!showTargetClassSelection">
            បានជ្រើសរើស:
            <span class="font-extrabold text-blue-600">{{ selectedIds.length }}</span>
            នាក់
          </span>
        </div>

        <div class="flex gap-2">
          <button
            @click="$emit('close')"
            class="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            បិទ
          </button>

          <button
            v-if="mode === 'enroll'"
            @click="handleBulkEnroll"
            :disabled="selectedIds.length === 0 || isSubmitting"
            class="px-4 py-1.5 text-white text-xs font-bold rounded-lg transition flex items-center gap-2 shadow-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i
              v-if="isSubmitting"
              class="fa-solid fa-circle-notch fa-spin text-[10px]"
            ></i>
            <i
              v-else
              class="fa-solid fa-user-plus text-[10px]"
            ></i>
            បញ្ចូលទាំងអស់
          </button>

          <template v-if="mode === 'transfer'">
            <button
              v-if="!showTargetClassSelection"
              @click="showTargetClassSelection = true"
              :disabled="selectedIds.length === 0"
              class="px-4 py-1.5 text-white text-xs font-bold rounded-lg transition bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              បន្ទាប់
              <i class="fa-solid fa-chevron-right ml-1"></i>
            </button>

            <button
              v-else
              @click="handleBulkEnroll"
              :disabled="!targetClassId || isSubmitting"
              class="px-4 py-1.5 text-white text-xs font-bold rounded-lg transition flex items-center gap-2 shadow-sm bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i
                v-if="isSubmitting"
                class="fa-solid fa-circle-notch fa-spin text-[10px]"
              ></i>
              <i
                v-else
                class="fa-solid fa-right-left text-[10px]"
              ></i>
              បញ្ជាក់ការផ្លាស់ប្ដូរ
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
    default: 'enroll'
  }
})

const emit = defineEmits(['close', 'refresh'])
const toast = useToast()

const { data: allStudents, loading } = useQuery('students')
const { data: allClasses } = useQuery('classes')

const searchQuery = ref('')
const selectedIds = ref([])
const isSubmitting = ref(false)

const showTargetClassSelection = ref(false)
const targetClassId = ref('')

const currentPage = ref(1)
const itemsPerPage = 16

const getStudentGradeId = (student) => {
  if (!student.grade) return null
  return (typeof student.grade === 'object') ? student.grade._id : student.grade
}

const availableTargetClasses = computed(() => {
  if (!allClasses.value) return []
  return allClasses.value.filter(c => c._id !== props.currentClassId)
})

const filteredCandidates = computed(() => {
  if (!allStudents.value) return []

  return allStudents.value.filter(s => {
    const studentGradeId = getStudentGradeId(s)

    if (props.mode === 'enroll') {
      if (studentGradeId) return false
    } else if (props.mode === 'transfer') {
      if (studentGradeId !== props.currentClassId) return false
    }

    const query = searchQuery.value.toLowerCase()
    const fullName = `${s.khmerName || ''} ${s.englishName || ''}`.toLowerCase()

    return fullName.includes(query) ||
      (s.studentId && s.studentId.toString().includes(query))
  })
})

const totalPages = computed(() =>
  Math.ceil(filteredCandidates.value.length / itemsPerPage)
)

const paginatedCandidates = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredCandidates.value.slice(start, end)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

watch([searchQuery, () => props.mode], () => {
  currentPage.value = 1
})

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

watch(() => props.isOpen, (newVal) => {
  if (!newVal) {
    selectedIds.value = []
    searchQuery.value = ''
    currentPage.value = 1
    showTargetClassSelection.value = false
    targetClassId.value = ''
  }
})

const handleBulkEnroll = async () => {
  if (selectedIds.value.length === 0) return

  let endpointClassId = props.currentClassId

  if (props.mode === 'transfer') {
    if (!targetClassId.value) {
      toast.error("សូមជ្រើសរើសថ្នាក់គោលដៅជាមុនសិន")
      return
    }

    endpointClassId = targetClassId.value
  }

  isSubmitting.value = true

  try {
    await api.post(`/classes/${endpointClassId}/enroll`, {
      studentIds: selectedIds.value
    })

    toast.success(
      props.mode === 'transfer'
        ? `បានផ្លាស់ប្ដូរសិស្ស ${selectedIds.value.length} នាក់ដោយជោគជ័យ`
        : `បានបញ្ចូលសិស្ស ${selectedIds.value.length} នាក់ដោយជោគជ័យ`
    )

    emit('refresh')
    emit('close')
  } catch (error) {
    console.error("Bulk action error:", error)
    toast.error(error.response?.data?.message || "មិនអាចដំណើរការសំណើបានទេ")
  } finally {
    isSubmitting.value = false
  }
}
</script>