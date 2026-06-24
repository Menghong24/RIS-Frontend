<template>
  <div class="p-4 md:p-6">
    
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div class="flex items-center gap-4 w-full md:w-auto">
        <button 
          v-if="selectedClass" 
          @click="clearSelection"
          class="flex items-center text-gray-600 hover:text-blue-600 transition-colors bg-white px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm border border-gray-200 whitespace-nowrap"
        >
          <ArrowLeft class="w-5 h-5 mr-1 md:mr-2" />
          <span class="font-khmer text-sm md:text-base">ត្រឡប់ក្រោយ</span>
        </button>

        <h1 class="text-xl​ p-2 md:text-2xl font-bold text-blue-600 font-khmer truncate">
          {{ selectedClass ? `បញ្ជីសិស្សក្នុងថ្នាក់: ${selectedClass.className}` : 'បញ្ជីថ្នាក់រៀនទាំងអស់' }}
        </h1>
      </div>

      <div class="flex items-center gap-2 md:gap-3 w-full md:w-auto">
        <button
          v-if="selectedClass"
          @click="openTransferModal"
          class="flex-1 md:flex-none flex justify-center items-center bg-orange-500 text-white px-3 py-2 md:px-5 md:py-2.5 rounded-lg hover:bg-orange-600 transition-all shadow-md transform active:scale-95 text-sm md:text-base whitespace-nowrap"
        >
          <ArrowRightLeft class="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
          <span class="font-khmer">ផ្លាស់ប្ដូរ (Transfer)</span>
        </button>

        <button
          @click="selectedClass ? openEnrollModal() : openAddClassModal()"
          class="flex-1 md:flex-none flex justify-center items-center bg-blue-600 text-white px-3 py-2 md:px-5 md:py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-md transform active:scale-95 text-sm md:text-base whitespace-nowrap"
        >
          <Plus class="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
          <span class="font-khmer">{{ selectedClass ? 'បញ្ចូលសិស្ស (Enroll)' : 'បង្កើតថ្នាក់ថ្មី' }}</span>
        </button>
      </div>
    </div>

    <div v-if="!selectedClass">
      <div class="flex gap-4 mb-6">
        <div class="relative w-full sm:w-auto">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            v-model="classSearchQuery" 
            type="text" 
            placeholder="ស្វែងរកថ្នាក់..." 
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
          >
        </div>
      </div>

      <div v-if="loadingClasses" class="text-center py-10">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="cls in filteredClassesList" 
          :key="cls._id"
          @click="selectClass(cls)"
          class="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-300 group relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div class="h-2 bg-blue-500 w-full"></div>
            <div class="p-6 pb-2">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors font-khmer">
                    {{ cls.className }}
                  </h3>
                  <span class="text-sm text-gray-500">Grade: {{ cls.classGrade }}</span>
                </div>
                <div class="flex flex-col items-end gap-2">
                  <span class="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded-full border border-blue-100">
                    #{{ cls.classNumber }}
                  </span>
                </div>
              </div>

              <div class="space-y-2 text-sm text-gray-600">
                <div class="flex items-center gap-2">
                  <Clock class="w-4 h-4 text-gray-400" />
                  <span class="font-khmer text-blue-600">{{ cls.timeStudy }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <User class="w-4 h-4 text-gray-400" />
                  <span class="truncate">{{ getTeacherName(cls.teacher) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <div class="flex items-center gap-2 text-gray-700">
              <Users class="w-4 h-4" />
              <span class="font-semibold text-sm">{{ cls.students?.length || 0 }} សិស្ស</span>
            </div>

            <div class="flex items-center gap-2">
               <button 
                  @click.stop="openEditClassModal(cls)"
                  class="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  title="Edit Class"
               >
                  <Edit2 class="w-4 h-4" />
               </button>

               <button 
                  @click.stop="openDeleteClassModal(cls)"
                  class="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Delete Class"
               >
                  <Trash2 class="w-4 h-4" />
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="animate-fade-in-up">
      
      <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 md:mb-6 flex flex-col md:flex-row flex-wrap gap-4 items-stretch md:items-center justify-between">
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
          <div class="relative w-full sm:w-auto">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              v-model="studentSearchQuery"
              type="text"
              placeholder="ស្វែងរកសិស្ស...."
              class="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          
          <div class="flex gap-2 w-full sm:w-auto">
            <select v-model="genderFilter" class="flex-1 sm:flex-none border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="All">ភេទទាំងអស់ (All)</option>
              <option value="ប្រុស">ប្រុស (Male)</option>
              <option value="ស្រី">ស្រី (Female)</option>
            </select>

            <select v-model="statusFilter" class="flex-1 sm:flex-none border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="All">ស្ថានភាព (All)</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        
        <div class="text-sm text-gray-500 font-khmer text-right md:text-left">
          សរុប: <span class="font-bold text-blue-600 text-lg">{{ filteredStudents.length }}</span> នាក់
        </div>
      </div>

      <div class="overflow-x-auto rounded-xl shadow-md border border-gray-100 bg-white">
        <table class="min-w-full text-left">
          <thead class="bg-gray-100 text-sm text-gray-700 uppercase">
             <tr class="border-b">
               <th class="p-3 font-khmer w-20">រូបថត</th>
               <th class="p-3 font-khmer">ឈ្មោះខ្មែរ</th>
               <th class="p-3 font-khmer"></th>
               
               <th class="hidden lg:table-cell p-3 font-khmer">អត្តលេខ</th>
               <th class="hidden lg:table-cell p-3 font-khmer">ឈ្មោះអង់គ្លេស</th>
               <th class="hidden lg:table-cell p-3 font-khmer">ថ្ងៃខែឆ្នាំកំណើត</th>
               <th class="hidden lg:table-cell p-3 font-khmer">សញ្ជាតិ</th>
               <th class="hidden lg:table-cell p-3 font-khmer">លេខទូរស័ព្ទ</th>
               <th class="hidden lg:table-cell p-3 font-khmer">បន្ទប់</th>
               <th class="hidden lg:table-cell p-3 font-khmer">កម្រិត</th>
               <th class="hidden lg:table-cell p-3 text-right font-khmer">មើល</th>
               
               <th class="p-3 text-right font-khmer w-24">លុបចេញ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
             <tr v-if="filteredStudents.length === 0">
                <td colspan="12" class="text-center py-8 text-gray-500 font-khmer">
                  មិនមានទិន្នន័យសិស្សឡើយ។
                </td>
             </tr>
             <StudentCard
              v-for="student in paginatedStudents"
              :key="student._id"
              :student="student"
              @view="openViewModal"
              @delete="openDeleteStudentModal"
            />
          </tbody>
        </table>
      </div>

      <div v-if="filteredStudents.length > 0" class="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 bg-white p-4 rounded-lg shadow-sm">
         <div class="flex items-center gap-2">
            <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 text-sm">Prev</button>
            <span class="text-sm text-gray-600">Page {{ currentPage }} of {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 text-sm">Next</button>
         </div>
         <select v-model.number="rowsPerPage" class="border rounded px-2 py-1 text-sm outline-none w-20">
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
         </select>
      </div>

    </div>

    <EnrollStudentModal 
      :is-open="isEnrollModalOpen"
      :current-class-id="selectedClass ? selectedClass._id : ''"
      :mode="modalMode" 
      @close="closeEnrollModal"
      @refresh="handleRefreshData"
    />

    <ClassFormModal
      :is-open="isClassModalOpen"
      :is-editing="isEditingClass"
      :class-data="classToEdit"
      :teachers="teachersList"
      @close="closeClassModal"
      @save="saveClass"
    />
    
    <StudentViewModal 
      :is-open="isViewModalOpen" 
      :student="studentToView" 
      @close="closeViewModal" 
    />
    
    <DeleteConfirmationModal 
      :is-open="isDeleteStudentModalOpen" 
      :item-name="studentToDelete?.englishName" 
      title="Remove Student from Class" 
      message="Are you sure you want to remove this student from the class? The student record will not be deleted."
      @close="closeDeleteStudentModal" 
      @confirm="confirmDeleteStudent" 
    />

    <DeleteConfirmationModal 
      :is-open="isDeleteClassModalOpen" 
      :item-name="classToDelete?.className" 
      title="Delete Class" 
      @close="closeDeleteClassModal" 
      @confirm="confirmDeleteClass" 
    />

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
// ADDED Edit2 here
import { Plus, Search, ArrowLeft, Users, Clock, User, Trash2, ArrowRightLeft, Edit2 } from 'lucide-vue-next'

// Components
import StudentCard from './students/StudentCard.vue'
import EnrollStudentModal from './classes/EnrollStudentModal.vue' 
import StudentViewModal from './students/StudentViewModal.vue'
import ClassFormModal from './classes/ClassFormModal.vue'
import DeleteConfirmationModal from './shared/DeleteConfirmationModal.vue'

// API & Hooks
import api from '../config/api' 
import { useQuery } from '../hooks/useQuery.js'
import { useCollection } from '../hooks/useCollection.js'
import { useToast } from "vue-toastification"

const toast = useToast()

// --- Data Fetching ---
const { data: classes, loading: loadingClasses, fetchData: refetchClasses } = useQuery('classes')
const { createDoc: createClassDoc, updateDoc: updateClassDoc, deleteDoc: deleteClassDoc } = useCollection('classes')

const { data: students, fetchData: refetchStudents } = useQuery('students')
const { data: teachers } = useQuery('teachers')
const teachersList = computed(() => teachers.value || [])

// --- State Management ---
const selectedClass = ref(null) 
const classSearchQuery = ref('')

// --- Filter States (Student View) ---
const studentSearchQuery = ref('')
const genderFilter = ref('All')
const statusFilter = ref('All')

// --- Modal States ---
const isEnrollModalOpen = ref(false)
const modalMode = ref('enroll') 
const isDeleteStudentModalOpen = ref(false)
const isViewModalOpen = ref(false)
const studentToDelete = ref(null)
const studentToView = ref(null)

// Classes
const isClassModalOpen = ref(false)
const isDeleteClassModalOpen = ref(false)
const isEditingClass = ref(false)
const classToEdit = ref(null)
const classToDelete = ref(null)

// --- Pagination ---
const currentPage = ref(1)
const rowsPerPage = ref(10)

// ==========================================
// 1. CLASS LOGIC
// ==========================================

const filteredClassesList = computed(() => {
  if (!classes.value) return []
  if (!classSearchQuery.value) return classes.value
  
  const query = classSearchQuery.value.toLowerCase()
  return classes.value.filter(c => 
    c.className.toLowerCase().includes(query) || 
    c.classNumber.toString().includes(query)
  )
})

const getTeacherName = (teacher) => {
  if (!teacher) return 'No Teacher'
  return typeof teacher === 'object' ? teacher.englishName : 'Teacher Assigned'
}

const selectClass = (cls) => {
  selectedClass.value = cls
  currentPage.value = 1
  studentSearchQuery.value = ''
}

const clearSelection = () => {
  selectedClass.value = null
}

// --- Class CRUD Actions ---

const openAddClassModal = () => {
  isEditingClass.value = false
  classToEdit.value = null
  isClassModalOpen.value = true
}

// ADDED: Logic to open Edit Modal
const openEditClassModal = (cls) => {
  isEditingClass.value = true
  classToEdit.value = cls
  isClassModalOpen.value = true
}

const openDeleteClassModal = (cls) => {
  classToDelete.value = cls
  isDeleteClassModalOpen.value = true
}

const closeClassModal = () => isClassModalOpen.value = false
const closeDeleteClassModal = () => isDeleteClassModalOpen.value = false

const saveClass = async (classData) => {
  try {
    if (isEditingClass.value && classData._id) {
       await updateClassDoc(classData._id, classData)
       toast.success("Class updated successfully!")
    } else {
       await createClassDoc(classData)
       toast.success("Class created successfully!")
    }
    await refetchClasses()
    closeClassModal()
  } catch (error) {
    console.error("Error saving class:", error)
  }
}

const confirmDeleteClass = async () => {
  if (classToDelete.value && classToDelete.value._id) {
    await deleteClassDoc(classToDelete.value._id)
    await refetchClasses()
    closeDeleteClassModal()
  }
}

// ==========================================
// 2. STUDENT LOGIC
// ==========================================

const filteredStudents = computed(() => {
  if (!students.value) return []
  if (!selectedClass.value) return [] 

  return students.value.filter((s) => {
    // Determine the student's grade ID
    const sClassId = typeof s.grade === 'object' && s.grade !== null ? s.grade._id : s.grade
    if (sClassId !== selectedClass.value._id) return false

    const fullName = `${s.khmerName || ''} ${s.englishName || ''}`.toLowerCase()
    const nameMatch = fullName.includes(studentSearchQuery.value.toLowerCase()) || 
                      (s.studentId && s.studentId.toString().includes(studentSearchQuery.value))

    const genderMatch = genderFilter.value === 'All' || s.gender === genderFilter.value
    const statusMatch = statusFilter.value === 'All' || s.status === statusFilter.value

    return nameMatch && genderMatch && statusMatch
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredStudents.value.length / rowsPerPage.value)))
const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value
  return filteredStudents.value.slice(start, start + rowsPerPage.value)
})

const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }

// --- Student Actions ---

const handleRefreshData = async () => {
  await refetchStudents()
  await refetchClasses()
}

// OPEN ENROLL: Set mode to 'enroll'
const openEnrollModal = () => {
  modalMode.value = 'enroll'
  isEnrollModalOpen.value = true
}

// OPEN TRANSFER: Set mode to 'transfer'
const openTransferModal = () => {
  modalMode.value = 'transfer'
  isEnrollModalOpen.value = true 
}

const closeEnrollModal = () => {
  isEnrollModalOpen.value = false
}

const openViewModal = (s) => { studentToView.value = s; isViewModalOpen.value = true }
const openDeleteStudentModal = (s) => { studentToDelete.value = s; isDeleteStudentModalOpen.value = true }

const closeViewModal = () => isViewModalOpen.value = false
const closeDeleteStudentModal = () => isDeleteStudentModalOpen.value = false

// Confirm Remove from Class
const confirmDeleteStudent = async () => {
  if (studentToDelete.value && selectedClass.value) {
    try {
        await api.delete(`/classes/${selectedClass.value._id}/students/${studentToDelete.value._id}`)
        toast.success("Student removed from class successfully")
        await refetchStudents()
        await refetchClasses()
    } catch (error) {
        console.error("Error removing student:", error)
        toast.error("Failed to remove student from class")
    } finally {
        closeDeleteStudentModal()
    }
  }
}
</script>