<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-blue-800 font-khmer">គ្រប់គ្រងវត្តមាន</h1>
      <p class="text-gray-500 p-4">សូមជ្រើសរើសថ្នាក់ និងកាលបរិច្ឆេទ ដើម្បីកត់ត្រា ឬមើលវត្តមានសិស្ស</p>
    </div>

    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end mb-6">
      
      <div class="flex-1 min-w-[200px]">
        <label class="block text-sm font-bold text-gray-700 font-khmer mb-1">ជ្រើសរើសថ្នាក់</label>
        <select 
          v-model="selectedClassId" 
          @change="hasLoaded = false"
          class="block w-full rounded-lg border-gray-300 border p-2.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="" disabled>-- ជ្រើសរើសថ្នាក់ --</option>
          <option v-for="cls in classes" :key="cls._id" :value="cls._id">
            {{ cls.className }} ({{ cls.classGrade }})
          </option>
        </select>
      </div>

      <div class="flex-1 min-w-[200px]">
        <label class="block text-sm font-bold text-gray-700 font-khmer mb-1">កាលបរិច្ឆេទ</label>
        <input 
          type="date" 
          v-model="selectedDate" 
          @change="hasLoaded = false"
          class="block w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
        >
      </div>

      <button 
        @click="loadData"
        :disabled="!selectedClassId || !selectedDate || loading"
        class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-khmer font-bold flex items-center gap-2 shadow-sm transition-all"
      >
        <Search v-if="!loading" class="w-5 h-5" />
        <span v-else class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
        {{ loading ? 'Loading...' : 'បង្ហាញទិន្នន័យ' }}
      </button>
    </div>

    <div v-if="hasLoaded" class="animate-fade-in-up">
      
      <div class="flex flex-wrap justify-between items-center mb-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
        <div>
          <span class="font-bold text-gray-700 font-khmer mr-4">សរុប: {{ localRecords.length }} នាក់</span>
          <span class="text-green-600 font-bold mr-3">Present: {{ countStatus('present') }}</span>
          <span class="text-red-600 font-bold mr-3">Absent: {{ countStatus('absent') }}</span>
          <span class="text-yellow-600 font-bold mr-3">Permission: {{ countStatus('permission') }}</span>
          <span class="text-purple-600 font-bold">Late: {{ countStatus('late') }}</span>
        </div>
        
        <button 
          @click="markAllPresent"
          class="text-sm bg-white border border-green-200 text-green-700 px-3 py-1 rounded-lg hover:bg-green-50 transition-colors font-medium shadow-sm"
        >
          Mark All Present
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-khmer">សិស្ស</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider font-khmer">ស្ថានភាព</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-khmer">ផ្សេងៗ</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(record, index) in localRecords" :key="record.student?._id || index" class="hover:bg-gray-50 transition-colors">
              
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 overflow-hidden shadow-sm border border-gray-100">
                    <img v-if="record.student?.photo" :src="record.student.photo" alt="Student" class="h-full w-full object-cover">
                    <User v-else class="w-6 h-6 text-gray-400" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-bold text-gray-900 font-khmer">
                      {{ getStudentName(record.student) }}
                    </div>
                    <div class="text-xs text-gray-500 mt-0.5">
                      ID: {{ record.student?.studentId || 'N/A' }}
                    </div>
                  </div>
                </div>
              </td>

              <td class="px-4 py-3">
                <div class="flex justify-center gap-2">
                  <button @click="record.status = 'present'" :class="getButtonClass(record.status, 'present', 'green')" title="Present">
                    <CheckCircle class="w-6 h-6" />
                  </button>
                  <button @click="record.status = 'absent'" :class="getButtonClass(record.status, 'absent', 'red')" title="Absent">
                    <XCircle class="w-6 h-6" />
                  </button>
                  <button @click="record.status = 'permission'" :class="getButtonClass(record.status, 'permission', 'yellow')" title="Permission">
                    <FileText class="w-6 h-6" />
                  </button>
                  <button @click="record.status = 'late'" :class="getButtonClass(record.status, 'late', 'purple')" title="Late">
                    <Clock class="w-6 h-6" />
                  </button>
                </div>
              </td>

              <td class="px-4 py-3">
                <input 
                  type="text" 
                  v-model="record.remark"
                  placeholder="Note..."
                  class="w-full text-sm border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none py-1 bg-transparent placeholder-gray-400 transition-colors"
                >
              </td>

            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-6 flex justify-end gap-4">
        <button 
          @click="resetForm"
          class="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-khmer font-bold transition-colors"
        >
          បោះបង់
        </button>
        <button 
          @click="saveAttendance"
          :disabled="isSaving"
          class="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-khmer font-bold shadow-md flex items-center gap-2 transition-all"
        >
          <Save v-if="!isSaving" class="w-5 h-5" />
          <span v-else class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
          {{ currentMode === 'edit' ? 'កែប្រែ' : 'រក្សាទុក' }}
        </button>
      </div>

    </div>

    <div v-else-if="!loading && !hasLoaded" class="flex flex-col items-center justify-center mt-20 text-gray-400">
       <CalendarDays class="w-16 h-16 mb-4 opacity-30" />
       <p class="text-lg font-medium">Please select a class and date to begin.</p>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search, CalendarDays, User, CheckCircle, XCircle, FileText, Clock, Save } from 'lucide-vue-next'
import { useQuery } from '../hooks/useQuery'
import api from '../config/api'
import { useToast } from "vue-toastification"; 

const toast = useToast();

// --- Data Fetching ---
const { data: classes } = useQuery('classes')

// --- State ---
const selectedClassId = ref('')
const selectedDate = ref(new Date().toISOString().split('T')[0]) 
const loading = ref(false)
const isSaving = ref(false)
const hasLoaded = ref(false)
const currentMode = ref('create') // 'create' or 'edit'

// Main data array
const localRecords = ref([])

// --- Helpers ---
const getStudentName = (studentObj) => {
  // កែប្រែដើម្បីការពារ Error ពេល studentObj ជា null ហើយបន្ថែម englishName បើអត់មាន khmerName
  if (studentObj && typeof studentObj === 'object') {
    return studentObj.khmerName || studentObj.englishName || 'Unknown Name';
  }
  return 'Unknown';
}

const getButtonClass = (currentStatus, targetStatus, color) => {
  const base = 'p-2 rounded-full transition-all border-2 '
  if (currentStatus === targetStatus) {
    if(color === 'green') return base + 'bg-green-100 border-green-500 text-green-700 scale-110'
    if(color === 'red') return base + 'bg-red-100 border-red-500 text-red-700 scale-110'
    if(color === 'yellow') return base + 'bg-yellow-100 border-yellow-500 text-yellow-700 scale-110'
    if(color === 'purple') return base + 'bg-purple-100 border-purple-500 text-purple-700 scale-110'
  }
  return base + 'bg-white border-transparent text-gray-400 hover:bg-gray-100'
}

const countStatus = (status) => localRecords.value.filter(r => r.status === status).length

// --- Core Logic ---

// 1. Smart Load 
const loadData = async () => {
  if (!selectedClassId.value || !selectedDate.value) return;
  
  loading.value = true;
  hasLoaded.value = false;
  localRecords.value = [];

  try {
    const response = await api.get('/attendance', {
      params: {
        classId: selectedClassId.value,
        date: selectedDate.value
      }
    });

    // បន្ថែម ? ដើម្បីការពារការគាំងបើសិនជា data ពី API អត់មានទម្រង់ដូចការរំពឹងទុក
    const resData = response.data || {};
    
    currentMode.value = resData.mode || 'create';
    // ទាញយក records ដោយសុវត្ថិភាព
    localRecords.value = resData.data?.records || resData.records || []; 

    if (currentMode.value === 'create') {
        toast.info("Generated blank attendance sheet.");
    } else {
        toast.success("Loaded existing attendance.");
    }

    hasLoaded.value = true;

  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.error || "Error loading data.");
  } finally {
    loading.value = false;
  }
}

// 2. Helper
const markAllPresent = () => {
  localRecords.value.forEach(r => r.status = 'present');
}

// 3. Upsert Save
const saveAttendance = async () => {
  if (localRecords.value.length === 0) return;
  
  isSaving.value = true;

  try {
    const payload = {
      class: selectedClassId.value,
      date: selectedDate.value,
      records: localRecords.value
    };

    await api.post('/attendance', payload);

    toast.success("Attendance saved successfully!");
    
    // Refresh to stay in sync
    await loadData();

  } catch (error) {
    console.error("Save error:", error);
    toast.error(error.response?.data?.error || "Failed to save attendance.");
  } finally {
    isSaving.value = false;
  }
}

const resetForm = () => {
  hasLoaded.value = false;
  localRecords.value = [];
}
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.4s ease-out;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>