<template>
  <div>
    <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        
        <div class="flex flex-col">
          <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Subject</label>
          <select 
            v-model="filters.subjectId"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border bg-gray-50"
          >
            <option value="" disabled>Choose Subject...</option>
            <option v-for="sub in subjects" :key="sub._id" :value="sub._id">
              {{ sub.subjectName }}
            </option>
          </select>
        </div>

        <div class="flex flex-col">
          <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Year</label>
          <input 
            type="text" 
            v-model="filters.academicYear" 
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border bg-gray-50"
          />
        </div>

        <div class="flex flex-col">
          <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Month</label>
          <select 
            v-model="filters.month"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border bg-gray-50"
          >
            <option v-for="m in months" :key="m" :value="m">{{ m }}</option>
          </select>
        </div>
        
        <button 
          @click="loadGradebook" 
          :disabled="!isFilterValid || loading"
          class="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
        >
          <span v-if="loading" class="flex items-center gap-2">
            <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </span>
          <span v-else>Load Gradebook</span>
        </button>
      </div>
    </div>

    <div v-if="students.length > 0" class="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Code</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remark</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(student, index) in tableData" :key="student.studentId" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ index + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ student.idCode }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ student.englishName }}</td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <input 
                  type="number" 
                  v-model.number="student.score" 
                  min="0" 
                  max="100"
                  @input="student.isDirty = true"
                  class="w-20 text-center font-mono rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-1.5 border transition-all"
                  :class="student.isDirty ? 'border-amber-400 bg-amber-50 ring-2 ring-amber-100' : ''"
                />
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <input 
                  type="text" 
                  v-model="student.remark" 
                  placeholder="..."
                  @input="student.isDirty = true"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-1.5 border"
                />
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <button 
                  v-if="student.isDirty" 
                  @click="handleSave(student)" 
                  :disabled="isSaving"
                  class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all transform active:scale-95"
                >
                  Save
                </button>
                <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  <span class="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                  Saved
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else-if="!loading && hasSearched" class="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No Students Found</h3>
      <p class="mt-1 text-sm text-gray-500">There are no students enrolled in this class yet.</p>
    </div>

    <div v-else-if="!loading && !hasSearched" class="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p class="text-gray-500">Select a <strong>Subject</strong> and <strong>Month</strong> above to load the gradebook.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'; // Added watch
import api from '../../config/api'; 
import { useQuery } from '../../hooks/useQuery';
import { useCollection } from '../../hooks/useCollection';

// 1. PROPS
const props = defineProps({
  selectedClass: {
    type: Object,
    required: true
  }
});

// 2. DATA
const { data: subjects } = useQuery('subjects');
const { createDoc, loading: isSaving } = useCollection('scores');

const filters = ref({
  classId: props.selectedClass?._id || '', 
  subjectId: '',
  academicYear: '2025-2026',
  month: 'January',
  semester: 'Semester 1',
  type: 'monthly'
});

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Local State
const students = ref([]);
const tableData = ref([]);
const loading = ref(false);
const hasSearched = ref(false);

// Watch for selected class changes from the parent component
watch(() => props.selectedClass, (newClass) => {
  if (newClass) {
    // 1. Update the filter to the new class ID
    filters.value.classId = newClass._id;
    
    // 2. Wipe clean the previous class's UI states
    students.value = [];
    tableData.value = [];
    hasSearched.value = false;
  }
}, { immediate: true, deep: true });

// 3. COMPUTED
const isFilterValid = computed(() => {
  return filters.value.classId && filters.value.subjectId && filters.value.academicYear;
});

// 4. ACTIONS
const loadGradebook = async () => {
  if (!isFilterValid.value) return;

  loading.value = true;
  hasSearched.value = true;
  
  // Clear tables instantly before fetching to prevent visual bleeding from the last class
  students.value = [];
  tableData.value = [];
  
  try {
    const [studentsRes, scoresRes] = await Promise.all([
      api.get(`/students?classId=${filters.value.classId}`),
      api.get('/scores', { params: filters.value })
    ]);

    const studentList = studentsRes.data || []; 
    students.value = studentList; 
    const existingScores = scoresRes.data || [];

    // Merge Logic
    tableData.value = studentList.map(stu => {
      const foundScore = existingScores.find(s => {
        const sId = s.studentId?._id || s.studentId;
        return sId === stu._id;
      });
      
      return {
        studentId: stu._id,
        englishName: stu.englishName,
        idCode: stu.idCode || 'N/A', 
        score: foundScore ? foundScore.score : 0,
        remark: foundScore ? foundScore.remark : '',
        isDirty: false 
      };
    });

  } catch (error) {
    console.error("Error loading gradebook", error);
  } finally {
    loading.value = false;
  }
};

const handleSave = async (row) => {
  const payload = {
    studentId: row.studentId,
    classId: filters.value.classId,
    subjectId: filters.value.subjectId,
    academicYear: filters.value.academicYear,
    month: filters.value.month,
    semester: filters.value.semester,
    score: row.score,
    remark: row.remark,
    type: filters.value.type
  };

  const result = await createDoc(payload);
  if (result) {
    row.isDirty = false;
  }
};
</script>