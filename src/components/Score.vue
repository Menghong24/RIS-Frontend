<template>
  <div class="p-6 max-w-7xl mx-auto">
    
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">
          {{ selectedClass ? `${selectedClass.className} Gradebook` : 'Class Selection' }}
        </h2>
        <p class="text-sm text-gray-500 mt-1">
          {{ selectedClass ? 'Manage student scores for this class.' : 'Select a class to start grading.' }}
        </p>
      </div>

      <button 
        v-if="selectedClass" 
        @click="clearSelection"
        class="group flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm"
      >
        <span class="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
        Back to Classes
      </button>
    </div>

    <div v-if="!selectedClass" class="animate-fade-in">
      <div v-if="!classes.length" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
        <p class="text-gray-500">Loading classes...</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="cls in classes" 
          :key="cls._id" 
          @click="selectClass(cls)"
          class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-400 cursor-pointer transition-all duration-200 group relative overflow-hidden"
        >
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

          <div class="flex justify-between items-start mb-4">
            <div class="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span class="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-md">
              {{ cls.timeStudy || 'General' }}
            </span>
          </div>

          <h3 class="text-lg font-bold text-gray-900 mb-1">{{ cls.className }}</h3>
          <p class="text-sm text-gray-500">Grade: {{ cls.classGrade }}</p>
        </div>
      </div>
    </div>

    <div v-else class="animate-fade-in-up">
      
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
        
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <span class="text-sm text-gray-600 font-medium">
            Total Students: {{ tableData.length }}
          </span>
          <button 
            @click="saveAllScores" 
            :disabled="isSaving || !hasUnsavedChanges"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isSaving" class="animate-spin mr-2">⏳</span>
            <span v-else class="mr-2">💾</span>
            Save All Changes
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-white">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remark</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(student, index) in tableData" :key="student.studentId" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ index + 1 }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{{ student.khmerName }}</td>
                
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
                  <span v-if="student.isDirty" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    <span class="w-1.5 h-1.5 bg-amber-500 rounded-full mr-1.5"></span>
                    Unsaved
                  </span>
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

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import api from '../config/api'; 
import { useQuery } from '../hooks/useQuery';
import { useCollection } from '../hooks/useCollection';
import { useToast } from 'vue-toastification'; // Added Toast import for frontend validation

// 1. ASYNC DATA HOOKS
const { data: classes } = useQuery('classes'); 
const { data: subjects } = useQuery('subjects');
const { createDoc, loading: isSaving } = useCollection('scores');
const toast = useToast();

// 2. ROOT STATES
const selectedClass = ref(null);
const loading = ref(false);
const hasSearched = ref(false);
const students = ref([]);
const tableData = ref([]);

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const filters = ref({
  classId: '', 
  subjectId: '',
  academicYear: '2025-2026',
  month: 'January',
  semester: 'Semester 1',
  type: 'monthly'
});

// 3. WATCHERS
watch(selectedClass, (newClass) => {
  students.value = [];
  tableData.value = [];
  hasSearched.value = false;

  if (newClass) {
    filters.value.classId = newClass._id;
  } else {
    filters.value.classId = '';
    filters.value.subjectId = ''; 
  }
}, { deep: true });

// 4. COMPUTED VALIDATIONS
const isFilterValid = computed(() => {
  return filters.value.classId && filters.value.subjectId && filters.value.academicYear;
});

const hasUnsavedChanges = computed(() => {
  return tableData.value.some(student => student.isDirty);
});

// 5. USER HANDLER METHODS
const selectClass = (cls) => {
  selectedClass.value = cls;
};

const clearSelection = () => {
  selectedClass.value = null;
};

const loadGradebook = async () => {
  if (!isFilterValid.value) return;

  loading.value = true;
  hasSearched.value = true;
  
  students.value = [];
  tableData.value = [];
  
  try {
    const [studentsRes, scoresRes] = await Promise.all([
      api.get('/students'), 
      api.get('/scores', { params: filters.value })
    ]);

    const allStudents = studentsRes.data || []; 
    const existingScores = scoresRes.data || [];

    const enrolledStudentIds = (selectedClass.value.students || []).map(s => s._id || s);

    const classStudents = allStudents.filter(stu => enrolledStudentIds.includes(stu._id));
    students.value = classStudents; 

    tableData.value = classStudents.map(stu => {
      const foundScore = existingScores.find(s => {
        const sId = s.studentId?._id || s.studentId;
        return sId === stu._id;
      });
      
      return {
        studentId: stu._id,
        khmerName: stu.khmerName,
        idCode: stu.idCode || 'N/A', 
        score: foundScore ? foundScore.score : 0,
        remark: foundScore ? foundScore.remark : '',
        isDirty: false 
      };
    });

  } catch (error) {
    console.error("Error loading gradebook data arrays:", error);
    toast.error("Failed to load gradebook.");
  } finally {
    loading.value = false;
  }
};

// NEW: Batch Save Method
const saveAllScores = async () => {
  // 1. Gather only the rows that were edited
  const dirtyStudents = tableData.value.filter(stu => stu.isDirty);

  if (dirtyStudents.length === 0) return;

  // 2. Validate before sending to the backend
  const invalidStudent = dirtyStudents.find(stu => 
    stu.score === '' || stu.score === null || stu.score < 0 || stu.score > 100
  );

  if (invalidStudent) {
    toast.warning(`Please enter a valid score (0-100) for ${invalidStudent.khmerName}.`);
    return;
  }

  // 3. Map into the standardized backend format
  const payload = dirtyStudents.map(stu => ({
    studentId: stu.studentId,
    classId: filters.value.classId,
    subjectId: filters.value.subjectId,
    academicYear: filters.value.academicYear,
    month: filters.value.month,
    semester: filters.value.semester,
    type: filters.value.type,
    score: Number(stu.score),
    remark: stu.remark || ''
  }));
console.log("Data sending to backend:", payload);
  // 4. Send directly to your updated useCollection 
  // (Because your backend checks Array.isArray(req.body.scores) || req.body)
  const result = await createDoc({ scores: payload });
  
  if (result) {
    // Reset borders and update badges
    dirtyStudents.forEach(stu => {
      stu.isDirty = false;
    });
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>