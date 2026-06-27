<template>
  <div class=" bg-slate-50 p-3 md:p-4 print:bg-white print:p-0">

    <!-- Header -->
    <div class="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 print:hidden max-w-7xl mx-auto space-y-4">
      <div>
        <h1 class="text-xl font-extrabold text-slate-800 flex items-center gap-2">
          <span class="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm">
            ✓
          </span>
          របាយការណ៍វត្តមានសិស្ស
        </h1>
        <p class="text-slate-500 text-xs mt-1">
          ពិនិត្យមើល និងទាញយករបាយការណ៍វត្តមានសរុប
        </p>
      </div>

      <button
        @click="printReport"
        :disabled="!filters.classId || reportData.length === 0"
        class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        🖨️ បោះពុម្ព
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white p-3 rounded-xl shadow-sm border border-slate-200 mb-4 print:hidden max-w-7xl mx-auto space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

        <!-- Class -->
        <div>
          <label class="block text-[11px] font-bold text-slate-500 mb-1">
            ជ្រើសរើសថ្នាក់រៀន <span class="text-red-500">*</span>
          </label>
          <select
            v-model="filters.classId"
            @change="onClassChange"
            class="w-full border border-slate-200 rounded-lg px-2.5 py-2 bg-white outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-xs text-slate-700 transition"
          >
            <option value="">-- ជ្រើសរើសថ្នាក់ --</option>
            <option v-for="cls in classes" :key="cls._id" :value="cls._id">
              {{ cls.className }}
            </option>
          </select>
        </div>

        <!-- Year -->
        <div>
          <label class="block text-[11px] font-bold text-slate-500 mb-1">ឆ្នាំ</label>
          <select
            v-model="filters.year"
            @change="fetchReport"
            class="w-full border border-slate-200 rounded-lg px-2.5 py-2 bg-white outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-xs text-slate-700 transition"
          >
            <option value="">ពេញមួយឆ្នាំ (ទាំងអស់)</option>
            <option v-for="y in yearOptions" :key="y" :value="y">
              ឆ្នាំ {{ y }}
            </option>
          </select>
        </div>

        <!-- Month -->
        <div>
          <label class="block text-[11px] font-bold text-slate-500 mb-1">ខែសិក្សា</label>
          <select
            v-model="filters.month"
            @change="fetchReport"
            :disabled="!filters.year"
            class="w-full border border-slate-200 rounded-lg px-2.5 py-2 bg-white outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-xs text-slate-700 disabled:bg-slate-100 disabled:cursor-not-allowed transition"
          >
            <option value="">ពេញមួយឆ្នាំ</option>
            <option v-for="m in 12" :key="m" :value="m">
              ខែទី {{ m }} ({{ khmerMonths[m - 1] }})
            </option>
          </select>
        </div>

        <!-- Student Search -->
        <div>
          <label class="block text-[11px] font-bold text-slate-500 mb-1">
            ស្វែងរកតាមឈ្មោះសិស្ស
          </label>

          <div class="relative" ref="studentSearchBox">
            <input
              v-model="studentSearch"
              type="text"
              :disabled="!filters.classId"
              @focus="showStudentDropdown = true"
              @input="onStudentSearchInput"
              placeholder="វាយឈ្មោះសិស្ស..."
              class="w-full border border-slate-200 rounded-lg px-2.5 py-2 pr-7 bg-white outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-xs text-slate-700 disabled:bg-slate-100 disabled:cursor-not-allowed transition"
            />

            <button
              v-if="studentSearch"
              type="button"
              @click="clearSelectedStudent"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 text-xs"
            >
              ✕
            </button>

            <div
              v-if="showStudentDropdown && filters.classId"
              class="absolute z-30 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg "
            >
              <button
                type="button"
                @click="selectAllStudents"
                class="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 border-b border-slate-100 font-bold text-slate-600"
              >
                សិស្សទាំងអស់ក្នុងថ្នាក់
              </button>

              <button
                v-for="std in filteredStudents"
                :key="std._id"
                type="button"
                @click="selectStudent(std)"
                class="w-full text-left px-3 py-2 text-xs hover:bg-emerald-50 transition"
              >
                <div class="font-bold text-slate-700">
                  {{ std.khmerName }}
                </div>
                <div class="text-[10px] text-slate-400">
                  {{ std.englishName }} · {{ std.studentId }}
                </div>
              </button>

              <div
                v-if="filteredStudents.length === 0"
                class="px-3 py-3 text-xs text-slate-400 text-center "
              >
                មិនមានឈ្មោះសិស្សដែលត្រូវនឹងការស្វែងរក
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Print Header -->
    <div class="hidden print:block text-center mb-4">
      <h2 class="text-xl font-bold font-moul">ព្រះរាជាណាចក្រកម្ពុជា</h2>
      <h3 class="text-base font-bold font-khmer mb-3">ជាតិ សាសនា ព្រះមហាក្សត្រ</h3>
      <h1 class="text-lg font-bold border-b-2 border-black pb-1 inline-block">
        របាយការណ៍លម្អិតនៃការអវត្តមានសិស្ស
      </h1>

      <div class="flex justify-between text-xs mt-3 text-left px-4">
        <p><strong>ថ្នាក់រៀន៖</strong> {{ getSelectedClassName }}</p>
        <p v-if="filters.year">
          <strong>ប្រចាំ៖</strong>
          {{ filters.month ? 'ខែ ' + khmerMonths[filters.month - 1] : 'ពេញមួយឆ្នាំ' }}
          ឆ្នាំ {{ filters.year }}
        </p>
      </div>
    </div>

    <!-- Content -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden print:shadow-none print:rounded-none print:border-0 max-w-7xl mx-auto space-y-4">

      <!-- No Class -->
      <div v-if="!filters.classId" class="p-8 text-center text-slate-400 print:hidden">
        <div class="mx-auto mb-2 h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
          <span class="text-xl">📁</span>
        </div>
        <p class="font-bold text-sm text-slate-500">
          សូមជ្រើសរើសថ្នាក់រៀនដើម្បីបង្ហាញរបាយការណ៍
        </p>
      </div>

      <!-- Loading -->
      <div v-else-if="loading" class="p-8 text-center text-slate-400">
        <div class="mx-auto mb-2 h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <span class="text-xl animate-spin">◌</span>
        </div>
        <p class="font-bold text-sm text-slate-500">
          កំពុងគណនា និងបង្កើតរបាយការណ៍...
        </p>
      </div>

      <!-- Empty -->
      <div v-else-if="reportData.length === 0" class="p-8 text-center text-slate-400">
        <div class="mx-auto mb-2 h-10 w-10 rounded-xl bg-yellow-50 text-yellow-500 flex items-center justify-center">
          <span class="text-xl">⚠️</span>
        </div>
        <p class="font-bold text-sm text-slate-500">
          មិនមានទិន្នន័យវត្តមានក្នុងចន្លោះពេលដែលបានជ្រើសរើសឡើយ។
        </p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto ">
        <table class="w-full text-left border-collapse text-xs min-w-[900px] ">
          <thead>
            <tr class="bg-slate-100 text-slate-700 border-b">
              <th class="p-2 font-bold border border-slate-200 text-center w-10">ល.រ</th>
              <th class="p-2 font-bold border border-slate-200 w-20">អត្តសញ្ញាណ</th>
              <th class="p-2 font-bold border border-slate-200">ឈ្មោះសិស្ស</th>
              <th class="p-2 font-bold border border-slate-200 text-center w-14">ភេទ</th>
              <th class="p-2 font-bold border border-slate-200 text-center text-green-700 bg-green-50 w-16">វត្តមាន</th>
              <th class="p-2 font-bold border border-slate-200 text-center text-orange-700 bg-orange-50 w-16">យឺត</th>
              <th class="p-2 font-bold border border-slate-200 text-center text-yellow-700 bg-yellow-50 w-16">ច្បាប់</th>
              <th class="p-2 font-bold border border-slate-200 text-center text-red-700 bg-red-50 w-16">អវត្តមាន</th>
              <th class="p-2 font-bold border border-slate-200 text-center w-20">សរុបថ្ងៃ</th>
              <th class="p-2 font-bold border border-slate-200 text-center w-24 bg-blue-50 text-blue-700">ភាគរយ</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(row, idx) in reportData"
              :key="row.student._id"
              class="hover:bg-slate-50 transition border-b border-slate-100"
            >
              <td class="p-2 border border-slate-100 text-center text-slate-500">
                {{ idx + 1 }}
              </td>

              <td class="p-2 border border-slate-100 font-mono font-bold text-slate-700">
                {{ row.student.studentId }}
              </td>

              <td class="p-2 border border-slate-100">
                <div class="font-bold text-slate-800 leading-tight">
                  {{ row.student.khmerName }}
                </div>
                <div class="text-[10px] text-slate-400 uppercase font-mono leading-tight">
                  {{ row.student.englishName }}
                </div>
              </td>

              <td class="p-2 border border-slate-100 text-center text-slate-700">
                {{ row.student.gender }}
              </td>

              <td class="p-2 border border-slate-100 text-center font-bold text-green-700 bg-green-50/50">
                {{ row.present }}
              </td>

              <td class="p-2 border border-slate-100 text-center font-bold text-orange-700 bg-orange-50/50">
                {{ row.late }}
              </td>

              <td class="p-2 border border-slate-100 text-center font-bold text-yellow-700 bg-yellow-50/50">
                {{ row.permission }}
              </td>

              <td class="p-2 border border-slate-100 text-center font-bold text-red-700 bg-red-50/50">
                {{ row.absent }}
              </td>

              <td class="p-2 border border-slate-100 text-center font-mono text-slate-700">
                {{ row.totalDays }}
              </td>

              <td class="p-2 border border-slate-100 text-center font-bold bg-blue-50/50">
                <span
                  class="inline-flex rounded-full px-2 py-0.5 text-[11px] font-extrabold"
                  :class="Number(calculatePercentage(row.present, row.totalDays)) >= 75
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-red-100 text-red-700'"
                >
                  {{ calculatePercentage(row.present, row.totalDays) }} %
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import api from '../config/api';
import { useToast } from 'vue-toastification';

const toast = useToast();

// --- States ---
const classes = ref([]);
const studentsInClass = ref([]);
const reportData = ref([]);
const loading = ref(false);

const studentSearch = ref("");
const showStudentDropdown = ref(false);
const studentSearchBox = ref(null);

const filters = ref({
  classId: "",
  year: new Date().getFullYear().toString(),
  month: "",
  studentId: ""
});

const startYear = 2026;
const endYear = new Date().getFullYear() + 5;

const yearOptions = Array.from(
  { length: endYear - startYear + 1 },
  (_, i) => (startYear + i).toString()
);

const khmerMonths = [
  "មករា",
  "កុម្ភៈ",
  "មីនា",
  "មេសា",
  "ឧសភា",
  "មិថុនា",
  "កក្កដា",
  "សីហា",
  "កញ្ញា",
  "តុលា",
  "វិច្ឆិកា",
  "ធ្នូ"
];

// --- Computed ---
const getSelectedClassName = computed(() => {
  const cls = classes.value.find(c => c._id === filters.value.classId);
  return cls ? cls.className : '';
});

const filteredStudents = computed(() => {
  const keyword = studentSearch.value.trim().toLowerCase();

  if (!keyword) {
    return studentsInClass.value;
  }

  return studentsInClass.value.filter((std) => {
    const khmerName = std.khmerName?.toLowerCase() || "";
    const englishName = std.englishName?.toLowerCase() || "";
    const studentId = std.studentId?.toLowerCase() || "";

    return (
      khmerName.includes(keyword) ||
      englishName.includes(keyword) ||
      studentId.includes(keyword)
    );
  });
});

// --- Methods ---
const fetchClasses = async () => {
  try {
    const res = await api.get('/classes');
    classes.value = res.data.data || res.data;
  } catch (err) {
    toast.error("មិនអាចទាញយកទិន្នន័យថ្នាក់រៀនបានទេ");
  }
};

const onClassChange = async () => {
  filters.value.studentId = "";
  studentSearch.value = "";
  showStudentDropdown.value = false;
  reportData.value = [];

  if (!filters.value.classId) {
    studentsInClass.value = [];
    return;
  }

  try {
    const res = await api.get(`/classes/${filters.value.classId}`);
    const classDetails = res.data.data || res.data;
    studentsInClass.value = classDetails.students || [];
  } catch (err) {
    console.error(err);
    toast.error("មិនអាចទាញយកបញ្ជីសិស្សបានទេ");
  }

  fetchReport();
};

const fetchReport = async () => {
  if (!filters.value.classId) return;

  loading.value = true;

  try {
    const res = await api.get('/attendance/report', {
      params: {
        classId: filters.value.classId,
        year: filters.value.year,
        month: filters.value.month,
        studentId: filters.value.studentId
      }
    });

    reportData.value = res.data.data || [];
  } catch (err) {
    toast.error(err.response?.data?.message || "មានបញ្ហាក្នុងការទាញយករបាយការណ៍");
  } finally {
    loading.value = false;
  }
};

const onStudentSearchInput = () => {
  filters.value.studentId = "";
  showStudentDropdown.value = true;
};

const selectStudent = (student) => {
  filters.value.studentId = student._id;
  studentSearch.value = `${student.khmerName} (${student.englishName})`;
  showStudentDropdown.value = false;
  fetchReport();
};

const selectAllStudents = () => {
  filters.value.studentId = "";
  studentSearch.value = "";
  showStudentDropdown.value = false;
  fetchReport();
};

const clearSelectedStudent = () => {
  filters.value.studentId = "";
  studentSearch.value = "";
  showStudentDropdown.value = true;
  fetchReport();
};

const calculatePercentage = (present, total) => {
  if (!total) return '0.0';
  return ((present / total) * 100).toFixed(1);
};

const printReport = () => {
  window.print();
};

const handleClickOutside = (event) => {
  if (
    studentSearchBox.value &&
    !studentSearchBox.value.contains(event.target)
  ) {
    showStudentDropdown.value = false;
  }
};

// --- Lifecycle ---
onMounted(() => {
  fetchClasses();
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
@media print {
  @page {
    size: A4 landscape;
    margin: 10mm;
  }

  .print\:hidden {
    display: none !important;
  }

  .print\:block {
    display: block !important;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11px;
  }

  th,
  td {
    border: 1px solid #000 !important;
    padding: 6px !important;
  }

  tr {
    page-break-inside: avoid;
  }
}
</style>