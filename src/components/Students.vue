<template>
  <div>
    <div class="top-18 p-2 md:p-4 backdrop-blur rounded-md z-30 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
      <h1 class="text-xl md:text-2xl font-bold text-blue-600 font-khmer xl:px-8 w-full xl:w-auto text-center xl:text-left">
        បញ្ជីឈ្មោះសិស្សទាំងអស់
      </h1>

      <div class="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center w-full xl:w-auto gap-3 sm:space-x-4">
        <div class="relative w-full sm:w-auto ">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="ស្វែងរកតាមឈ្មោះ.."
            class="pl-10 pr-4 py-2 w-full sm:w-48 lg:w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <select
          v-model="classFilter"
          class="w-full sm:w-auto border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="All">All Classes</option>
          <option
            v-for="c in classesList"
            :key="c._id"
            :value="c._id"
          >
            {{ c.className }} ({{ c.classGrade }})
          </option>
        </select>
        
        <select
          v-model="genderFilter"
          class="w-full sm:w-auto border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="All">All Genders</option>
          <option value="ប្រុស">ប្រុស (Male)</option>
          <option value="ស្រី">ស្រី (Female)</option>
        </select>

        <button
          @click="openAddModal"
          class="flex items-center justify-center w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
        >
          <UserPlus class="w-5 h-5 mr-2" />
          <span class="font-khmer">បញ្ចូលសិស្សថ្មី</span>
        </button>
      </div>
    </div>

    <div class="overflow-x-auto mt-6 rounded-xl shadow-md border border-gray-100 bg-white w-full">
      <table class="w-full text-left bg-white whitespace-nowrap">
        <thead>
          <tr class="bg-gray-100 text-sm text-gray-700 border-b">
            <th class="p-3 font-khmer w-16">រូបថត</th>
            
            <th class="p-3 font-khmer hidden lg:table-cell">អត្តលេខ</th>
            
            <th class="p-3 font-khmer">ឈ្មោះខ្មែរ</th>
            
            <th class="p-3 font-khmer hidden lg:table-cell">ឈ្មោះអង់គ្លេស</th>
            <th class="p-3 font-khmer hidden lg:table-cell">ភេទ</th>
            <th class="p-3 font-khmer hidden lg:table-cell">ថ្ងៃខែឆ្នាំកំណើត</th>
            <th class="p-3 font-khmer hidden lg:table-cell">សញ្ជាតិ</th>
            <th class="p-3 font-khmer hidden lg:table-cell">ថ្ងៃចូលរៀន</th>
            <th class="p-3 font-khmer hidden lg:table-cell">បន្ទប់</th>
            <th class="p-3 font-khmer hidden lg:table-cell">កម្រិត</th>
            
            <th class="p-3 text-right font-khmer">កែប្រែ</th>
            <th class="p-3 text-right font-khmer">លុបចេញ</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-100">
          <StudentCard
            v-for="student in paginatedStudents"
            :key="student._id"
            :student="student"
            @view="openViewModal"
            @edit="openEditModal"
            @delete="openDeleteModal"
          />
        </tbody>
      </table>
    </div>

    <div v-if="filteredStudents.length === 0" class="text-center text-gray-500 mt-10 py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
      <p>No students match the current filters.</p>
    </div>

    <div
      v-if="filteredStudents.length > 0"
      class="flex flex-col sm:flex-row flex-wrap items-center justify-between mt-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100 gap-4"
    >
      <div class="flex items-center space-x-2 w-full sm:w-auto justify-center sm:justify-start">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-3 md:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-khmer transition-colors text-sm md:text-base"
        >
          ថយក្រោយ
        </button>

        <span class="text-gray-700 font-medium font-khmer text-sm md:text-base whitespace-nowrap">
          ទំព័រ {{ currentPage }} នៃ {{ totalPages }}
        </span>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-3 md:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-khmer transition-colors text-sm md:text-base"
        >
          បន្ទាប់
        </button>
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
        <label class="text-sm text-gray-600 font-khmer whitespace-nowrap">បង្ហាញចំនួន:</label>
        <select
          v-model.number="rowsPerPage"
          class="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option :value="10">10</option>
          <option :value="15">15</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
        </select>
      </div>
    </div>

    <StudentFormModal
      :is-open="isFormModalOpen"
      :is-editing="isEditing"
      :student="studentToEdit"
      @close="closeFormModal"
      @save="saveStudent"
    />
    <StudentViewModal
      :is-open="isViewModalOpen"
      :student="studentToView"
      @close="closeViewModal"
    />
    <DeleteConfirmationModal
      :is-open="isDeleteModalOpen"
      :item-name="`${studentToDelete?.khmerName} ${studentToDelete?.englishName}`"
      title="Delete Student?"
      @close="closeDeleteModal"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { UserPlus, Search } from 'lucide-vue-next'
import StudentCard from './students/StudentCard.vue'
import StudentFormModal from './students/StudentFormModal.vue'
import StudentViewModal from './students/StudentViewModal.vue'
import DeleteConfirmationModal from './shared/DeleteConfirmationModal.vue'

// Import Composables
import { useQuery } from '../hooks/useQuery.js'
import { useCollection } from '../hooks/useCollection.js'

// --- Modal States ---
const isFormModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isViewModalOpen = ref(false)
const isEditing = ref(false)
const studentToEdit = ref(null)
const studentToDelete = ref(null)
const studentToView = ref(null)

// --- Data Fetching ---
const { data: students, fetchData: refetchStudents } = useQuery('students')
const { data: classesData } = useQuery('classes')

// Initialize Collection Actions
const { createDoc, updateDoc, deleteDoc } = useCollection('students')

// --- Filters ---
const searchQuery = ref('')
const statusFilter = ref('All')
const genderFilter = ref('All')
const classFilter = ref('All')

// Safely access classes list
const classesList = computed(() => classesData.value || [])

// --- Pagination ---
const currentPage = ref(1)
const rowsPerPage = ref(10)

// --- Filter + Paginate Logic ---
const filteredStudents = computed(() => {
  if (!students.value) return []

  return students.value.filter((s) => {
    // 1. Name Filter
    const fullName = `${s.khmerName || ''} ${s.englishName || ''}`.toLowerCase()
    const nameMatch = fullName.includes(searchQuery.value.toLowerCase()) || 
                      (s.studentId && s.studentId.toString().includes(searchQuery.value))

    // 2. Status Filter
    const statusMatch = statusFilter.value === 'All' || 
                        s.status?.toLowerCase() === statusFilter.value.toLowerCase()

    // 3. Class Filter
    const studentGradeId = s.grade?._id || s.grade 
    const classMatch = classFilter.value === 'All' || studentGradeId === classFilter.value

    // 4. Gender Filter
    const genderMatch = genderFilter.value === 'All' || s.gender === genderFilter.value

    return nameMatch && statusMatch && classMatch && genderMatch
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredStudents.value.length / rowsPerPage.value)))
const start = computed(() => (currentPage.value - 1) * rowsPerPage.value)
const paginatedStudents = computed(() => filteredStudents.value.slice(start.value, start.value + rowsPerPage.value))

// Reset to page 1 when filters change
watch([searchQuery, statusFilter, genderFilter, classFilter, rowsPerPage], () => {
  currentPage.value = 1
})

// --- Pagination Actions ---
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }

// --- Modal Handlers ---
const openAddModal = () => {
  isEditing.value = false
  studentToEdit.value = {
    khmerName: '',
    englishName: '',
    studentId: '',
    gender: 'ប្រុស',
    dob: '',
    phone: '',
    email: '',
    status: 'active',
    photo: '',
    nationality: { student: 'ខ្មែរ' },
    family: { 
      motherFacebook: '', 
      motherName: '', motherNumber: '' 
    },
    placeOfBirth: { village: '', commune: '', district: '', province: '' },
    currentResidence: { village: '', commune: '', district: '', province: '' },
  }
  isFormModalOpen.value = true
}

const openEditModal = (student) => {
  isEditing.value = true
  studentToEdit.value = JSON.parse(JSON.stringify(student))
  
  if (studentToEdit.value.grade && typeof studentToEdit.value.grade === 'object') {
     studentToEdit.value.grade = studentToEdit.value.grade._id
  }
  isFormModalOpen.value = true
}

const openViewModal = (student) => {
  studentToView.value = student
  isViewModalOpen.value = true
}

const openDeleteModal = (student) => {
  studentToDelete.value = student
  isDeleteModalOpen.value = true
}

const closeFormModal = () => (isFormModalOpen.value = false)
const closeViewModal = () => (isViewModalOpen.value = false)
const closeDeleteModal = () => (isDeleteModalOpen.value = false)

// --- CRUD Actions ---
const saveStudent = async (studentData) => {
  try {
    if (isEditing.value && studentData._id) {
      await updateDoc(studentData._id, studentData)
    } else {
      await createDoc(studentData)
    }
    await refetchStudents() 
    closeFormModal()
  } catch (error) {
    console.error("Error saving student:", error)
  }
}

const confirmDelete = async () => {
  if (!studentToDelete.value?._id) return
  try {
    await deleteDoc(studentToDelete.value._id)
    await refetchStudents()
    closeDeleteModal()
  } catch (error) {
    console.error("Error deleting student:", error)
  }
}
</script>

<style scoped>
/* Optional: Add Khmer font family if available */
</style>