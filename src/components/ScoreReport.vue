<template>
  <div class="p-6 max-w-7xl mx-auto print:p-0 print:max-w-full">
    
    <div class="flex items-center justify-between mb-8 print:hidden">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">របាយការណ៍ពិន្ទុសិស្ស</h2>
        <p class="text-sm text-gray-500 mt-1">មើល និងបោះពុម្ពបញ្ជីពិន្ទុប្រចាំខែសម្រាប់ថ្នាក់នីមួយៗ</p>
      </div>
      
      <button 
        v-if="reportData.length > 0"
        @click="printReport"
        class="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md shadow-sm transition-all"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
        បោះពុម្ព (Print)
      </button>
    </div>

    <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-6 print:hidden">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        
        <div class="flex flex-col">
          <label class="text-xs font-semibold text-gray-500 uppercase mb-1">ថ្នាក់រៀន (Class)</label>
          <select v-model="filters.classId" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border bg-gray-50">
            <option value="" disabled>ជ្រើសរើសថ្នាក់...</option>
            <option v-for="cls in classes" :key="cls._id" :value="cls._id">
              {{ cls.className }} ({{ cls.timeStudy }})
            </option>
          </select>
        </div>

        <div class="flex flex-col">
          <label class="text-xs font-semibold text-gray-500 uppercase mb-1">មុខវិជ្ជា (Subject)</label>
          <select v-model="filters.subjectId" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border bg-gray-50">
            <option value="" disabled>ជ្រើសរើសមុខវិជ្ជា...</option>
            <option v-for="sub in subjects" :key="sub._id" :value="sub._id">
              {{ sub.subjectName }}
            </option>
          </select>
        </div>

        <div class="flex flex-col">
          <label class="text-xs font-semibold text-gray-500 uppercase mb-1">ឆ្នាំសិក្សា (Year)</label>
          <input type="text" v-model="filters.academicYear" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border bg-gray-50" />
        </div>

        <div class="flex flex-col">
          <label class="text-xs font-semibold text-gray-500 uppercase mb-1">ខែ (Month)</label>
          <select v-model="filters.month" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border bg-gray-50">
            <option v-for="m in months" :key="m" :value="m">{{ m }}</option>
          </select>
        </div>
        
        <button 
          @click="generateReport" 
          :disabled="!isFilterValid || loading"
          class="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 transition-all"
        >
          <span v-if="loading" class="animate-spin">⏳</span>
          <span v-else>មើលរបាយការណ៍</span>
        </button>
      </div>
    </div>

    <div id="printable-report" v-if="reportData.length > 0" class="bg-white rounded-lg shadow-sm border border-gray-200 print:shadow-none print:border-none print:m-0 print:p-0">
      
      <div class="hidden print:block text-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900 font-khmer">សាលារៀនចំណេះទូទៅ</h1>
        <h2 class="text-xl font-bold text-gray-800 mt-2">បញ្ជីពិន្ទុសិស្សប្រចាំខែ {{ filters.month }} ឆ្នាំសិក្សា {{ filters.academicYear }}</h2>
        <p class="text-md text-gray-600 mt-1">ថ្នាក់៖ <strong>{{ selectedClassName }}</strong> | មុខវិជ្ជា៖ <strong>{{ selectedSubjectName }}</strong></p>
      </div>

      <div class="grid grid-cols-3 gap-4 p-6 border-b border-gray-200 bg-gray-50 print:hidden">
        <div class="bg-white p-4 rounded-lg border border-gray-200 print:border-gray-800">
          <p class="text-sm text-gray-500 print:text-black">សិស្សសរុប</p>
          <p class="text-2xl font-bold text-gray-800">{{ reportData.length }} នាក់</p>
        </div>
        <div class="bg-white p-4 rounded-lg border border-gray-200 print:border-gray-800">
          <p class="text-sm text-gray-500 print:text-black">មធ្យមភាគថ្នាក់</p>
          <p class="text-2xl font-bold text-blue-600 print:text-black">{{ classAverage }}</p>
        </div>
        <div class="bg-white p-4 rounded-lg border border-gray-200 print:border-gray-800">
          <p class="text-sm text-gray-500 print:text-black">សិស្សជាប់ / ធ្លាក់</p>
          <p class="text-2xl font-bold text-emerald-600 print:text-black">
            {{ passCount }} <span class="text-gray-400 text-lg print:text-black">/</span> <span class="text-red-500 print:text-black">{{ failCount }}</span>
          </p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 print:border-collapse print:border print:border-gray-800">
          <thead class="bg-gray-100 print:bg-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider print:border print:border-gray-800 print:text-black">ល.រ</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider print:border print:border-gray-800 print:text-black">ឈ្មោះសិស្ស</th>
              <th class="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider print:border print:border-gray-800 print:text-black">ពិន្ទុ</th>
              <th class="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider print:border print:border-gray-800 print:text-black">និទ្ទេស (Grade)</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider print:border print:border-gray-800 print:text-black">ផ្សេងៗ</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 print:divide-gray-800">
            <tr v-for="(student, index) in reportData" :key="student.studentId" class="hover:bg-gray-50 print:hover:bg-transparent">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 print:border print:border-gray-800 print:text-black">{{ index + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 print:border print:border-gray-800 print:text-black">{{ student.khmerName }}</td>
              
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-bold print:border print:border-gray-800 print:text-black" 
                  :class="student.score === 'N/A' ? 'text-gray-400' : (student.score < 50 ? 'text-red-600' : 'text-blue-600')">
                {{ student.score }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-center print:border print:border-gray-800">
                <span v-if="student.score === 'N/A'" class="text-gray-400 text-sm print:text-black">-</span>
                <span v-else-if="student.score >= 50" class="inline-flex px-2 py-1 text-xs font-bold rounded bg-emerald-100 text-emerald-800 print:bg-transparent print:text-black">ជាប់ (Pass)</span>
                <span v-else class="inline-flex px-2 py-1 text-xs font-bold rounded bg-red-100 text-red-800 print:bg-transparent print:text-black">ធ្លាក់ (Fail)</span>
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 print:border print:border-gray-800 print:text-black">{{ student.remark }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="hidden print:flex justify-between mt-12 px-10">
        <div class="text-center">
          <p class="mb-20 font-bold">បានឃើញ និងឯកភាព<br>នាយកសាលា</p>
          <p>.......................................</p>
        </div>
        <div class="text-center">
          <p class="mb-20">ថ្ងៃទី........ខែ........ឆ្នាំ........<br><strong class="font-bold">គ្រូបង្រៀនមុខវិជ្ជា</strong></p>
          <p>.......................................</p>
        </div>
      </div>

    </div>

    <div v-else-if="!loading && hasSearched" class="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300 print:hidden">
      <p class="text-gray-500">មិនទាន់មានទិន្នន័យពិន្ទុសម្រាប់ខែ និងមុខវិជ្ជានេះទេ។</p>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import api from '../config/api'; 
import { useQuery } from '../hooks/useQuery';

// 1. ទាញយក Classes និង Subjects សម្រាប់ធ្វើ Filter
const { data: classes } = useQuery('classes'); 
const { data: subjects } = useQuery('subjects');

// 2. State គ្រប់គ្រងទិន្នន័យ
const loading = ref(false);
const hasSearched = ref(false);
const reportData = ref([]);

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const filters = ref({
  classId: '', 
  subjectId: '',
  academicYear: '2025-2026',
  month: 'January'
});

// 3. Computed Properties
const isFilterValid = computed(() => {
  return filters.value.classId && filters.value.subjectId && filters.value.academicYear;
});

const selectedClassName = computed(() => {
  const cls = classes.value.find(c => c._id === filters.value.classId);
  return cls ? cls.className : '';
});

const selectedSubjectName = computed(() => {
  const sub = subjects.value.find(s => s._id === filters.value.subjectId);
  return sub ? sub.subjectName : '';
});

const classAverage = computed(() => {
  const gradedStudents = reportData.value.filter(s => s.score !== 'N/A');
  if (gradedStudents.length === 0) return 0;
  const total = gradedStudents.reduce((sum, s) => sum + Number(s.score), 0);
  return (total / gradedStudents.length).toFixed(2);
});

const passCount = computed(() => reportData.value.filter(s => s.score !== 'N/A' && s.score >= 50).length);
const failCount = computed(() => reportData.value.filter(s => s.score !== 'N/A' && s.score < 50).length);

// 4. Methods
const generateReport = async () => {
  if (!isFilterValid.value) return;

  loading.value = true;
  hasSearched.value = true;
  reportData.value = [];
  
  try {
    const [studentsRes, scoresRes] = await Promise.all([
      api.get('/students'), 
      api.get('/scores', { params: filters.value })
    ]);

    const allStudents = studentsRes.data || []; 
    const existingScores = scoresRes.data || [];

    const selectedClassObj = classes.value.find(c => c._id === filters.value.classId);
    const enrolledStudentIds = (selectedClassObj?.students || []).map(s => s._id || s);

    const classStudents = allStudents.filter(stu => enrolledStudentIds.includes(stu._id));

    reportData.value = classStudents.map(stu => {
      const foundScore = existingScores.find(s => {
        const sId = s.studentId?._id || s.studentId;
        return sId === stu._id;
      });
      
      return {
        studentId: stu._id,
        khmerName: stu.khmerName,
        score: foundScore ? foundScore.score : 'N/A', 
        remark: foundScore ? foundScore.remark : ''
      };
    });

  } catch (error) {
    console.error("Error generating report:", error);
  } finally {
    loading.value = false;
  }
};

const printReport = () => {
  window.print();
};
</script>

<style>
/* តម្រូវការ Animation */
.animate-spin { animation: spin 1s linear infinite; }
@keyframes spin { 100% { transform: rotate(360deg); } }

/* 🌟 ការកំណត់ CSS ពិសេសសម្រាប់តែពេល Print (A4 Format) 🌟 */
@media print {
  @page {
    size: A4 portrait;
    margin: 1cm; /* កំណត់ទំហំគែមក្រដាស 1cm ជុំវិញ */
  }

  /* លាក់ Background ពណ៌ប្រផេះរបស់ប្រព័ន្ធ */
  body, html {
    background-color: white !important;
  }

  /* បទបញ្ជាដ៏មានឥទ្ធិពល: ទាញយកតែតារាងរបាយការណ៍មកបង្ហាញឱ្យពេញអេក្រង់ និងបិទបាំងអ្វីៗផ្សេងទៀតដូចជា Sidebar ខាងក្រោយ */
  #printable-report {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background-color: white;
    z-index: 9999;
  }

  /* ធានាថាពណ៌អក្សរនឹង Print ចេញមកពណ៌ខ្មៅច្បាស់ល្អ */
  .print\:text-black {
    color: black !important;
  }
  
  /* បិទ Background ពណ៌នៅពេល Print */
  .print\:bg-transparent {
    background-color: transparent !important;
  }
}
</style>