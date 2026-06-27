<template>
  <div class=" bg-slate-50 p-2 md:p-3 print:p-0 print:bg-white">
    <div class="max-w-7xl mx-auto space-y-2.5 print:max-w-full print:space-y-0">
      <!-- Header -->
      <div class="no-print bg-white rounded-xl border border-slate-200 shadow-sm px-3 py-2.5">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div class="min-w-0">
            <h2 class="text-base md:text-lg font-extrabold text-slate-800 flex items-center gap-2">
              <span class="h-7 w-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs">
                <i class="fa-solid fa-file-lines"></i>
              </span>
              របាយការណ៍ពិន្ទុសិស្ស
            </h2>

            <p class="text-[11px] text-slate-500 mt-0.5">
              ជ្រើសរើសមុខវិជ្ជាច្រើន ដើម្បីបង្ហាញពិន្ទុតាម column
            </p>
          </div>

          <button
            v-if="reportData.length > 0"
            @click="printReport"
            class="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-extrabold rounded-lg shadow-sm transition"
          >
            <i class="fa-solid fa-print text-[10px]"></i>
            បោះពុម្ព
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="no-print bg-white rounded-xl shadow-sm border border-slate-200 p-2.5">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_auto] gap-2 items-end">
          <div>
            <label class="form-label">ថ្នាក់រៀន</label>
            <select v-model="filters.classId" class="form-input">
              <option value="" disabled>ជ្រើសរើសថ្នាក់...</option>
              <option v-for="cls in classesList" :key="cls._id" :value="cls._id">
                {{ cls.className }} ({{ cls.timeStudy || '-' }})
              </option>
            </select>
          </div>

          <div>
            <label class="form-label">ឆ្នាំសិក្សា</label>
            <input
              type="text"
              v-model="filters.academicYear"
              class="form-input"
              placeholder="2025-2026"
            />
          </div>

          <div>
            <label class="form-label">ខែ</label>
            <select v-model="filters.month" class="form-input">
              <option v-for="m in months" :key="m.value" :value="m.value">
                {{ m.label }}
              </option>
            </select>
          </div>

          <button
            @click="generateReport"
            :disabled="!isFilterValid || loading"
            class="w-full lg:w-auto flex justify-center items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-extrabold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition shadow-sm min-h-[1.95rem] whitespace-nowrap"
          >
            <i v-if="loading" class="fa-solid fa-circle-notch fa-spin text-[10px]"></i>
            <i v-else class="fa-solid fa-magnifying-glass-chart text-[10px]"></i>
            {{ loading ? 'កំពុងដំណើរការ...' : 'មើលរបាយការណ៍' }}
          </button>
        </div>

        <div class="mt-2 border border-slate-200 rounded-xl px-2.5 py-2 bg-slate-50">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
            <div class="flex items-center gap-2 min-w-0">
              <span class="h-6 w-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] shrink-0">
                <i class="fa-solid fa-book"></i>
              </span>

              <div class="min-w-0">
                <p class="text-[11px] font-extrabold text-slate-700">
                  ជ្រើសរើសមុខវិជ្ជា
                </p>
                <p class="text-[10px] text-slate-500 truncate">
                  បានជ្រើសរើស {{ selectedSubjects.length }} មុខវិជ្ជា
                </p>
              </div>
            </div>

            <div class="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                @click="selectAllSubjects"
                class="px-2.5 py-1 text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition whitespace-nowrap"
              >
                ជ្រើសទាំងអស់
              </button>

              <button
                type="button"
                @click="clearSubjects"
                class="px-2.5 py-1 text-[10px] font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition whitespace-nowrap"
              >
                ដកទាំងអស់
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-1.5">
            <label
              v-for="sub in subjectsList"
              :key="sub._id"
              class="flex items-center gap-1.5 bg-white border rounded-lg px-2 py-1.5 cursor-pointer transition hover:border-blue-300 min-w-0"
              :class="filters.subjectIds.includes(sub._id)
                ? 'border-blue-400 bg-blue-50'
                : 'border-slate-200'"
            >
              <input
                type="checkbox"
                :value="sub._id"
                v-model="filters.subjectIds"
                class="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 shrink-0"
              />

              <span class="text-[11px] font-bold text-slate-700 truncate">
                {{ sub.subjectName }}
              </span>
            </label>
          </div>
        </div>
      </div>

      <!-- Printable Report -->
      <div
        id="printable-report"
        v-if="reportData.length > 0"
        class="print-area bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden print:shadow-none print:border-none print:rounded-none print:m-0 print:p-0"
      >
        <div class="print-page">
          <!-- Print Header -->
          <div class="hidden print:block text-center mb-4">
            <h1 class="text-xl font-bold text-gray-900 font-khmer">
              សាលារៀនចំណេះទូទៅ
            </h1>

            <h2 class="text-base font-bold text-gray-800 mt-1">
              បញ្ជីពិន្ទុសិស្សប្រចាំខែ {{ selectedMonthLabel }} ឆ្នាំសិក្សា {{ filters.academicYear }}
            </h2>

            <p class="text-xs text-gray-700 mt-1">
              ថ្នាក់៖ <strong>{{ selectedClassName }}</strong>
            </p>

            <p class="text-xs text-gray-700 mt-1">
              មុខវិជ្ជា៖ <strong>{{ selectedSubjectNames }}</strong>
            </p>
          </div>

          <!-- Screen Report Header -->
          <div class="no-print px-3 py-2.5 border-b border-slate-200 bg-slate-50">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div class="min-w-0">
                <h3 class="text-sm font-extrabold text-slate-800 truncate">
                  {{ selectedClassName }}
                </h3>

                <div class="flex flex-wrap items-center gap-x-2 gap-y-1 mt-0.5">
                  <p class="text-[11px] text-slate-500">
                    ខែ {{ selectedMonthLabel }}
                  </p>
                  <span class="text-slate-300">|</span>
                  <p class="text-[11px] text-slate-500">
                    ឆ្នាំសិក្សា {{ filters.academicYear }}
                  </p>
                  <span class="text-slate-300">|</span>
                  <p class="text-[11px] text-blue-600 font-bold truncate max-w-[500px]">
                    {{ selectedSubjectNames }}
                  </p>
                </div>
              </div>

              <span class="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-1 w-fit shrink-0">
                <i class="fa-solid fa-clipboard-list text-[10px]"></i>
                {{ reportData.length }} នាក់
              </span>
            </div>
          </div>

          <!-- Summary Cards -->
          <div class="no-print grid grid-cols-2 md:grid-cols-4 gap-2 p-2.5 border-b border-slate-200 bg-white">
            <div class="bg-slate-50 px-2.5 py-2 rounded-lg border border-slate-200 flex items-center justify-between gap-2">
              <p class="text-[10px] text-slate-500 font-bold">សិស្សសរុប</p>
              <p class="text-base font-extrabold text-slate-800">{{ reportData.length }}</p>
            </div>

            <div class="bg-blue-50 px-2.5 py-2 rounded-lg border border-blue-100 flex items-center justify-between gap-2">
              <p class="text-[10px] text-blue-600 font-bold">មុខវិជ្ជា</p>
              <p class="text-base font-extrabold text-blue-700">{{ selectedSubjects.length }}</p>
            </div>

            <div class="bg-indigo-50 px-2.5 py-2 rounded-lg border border-indigo-100 flex items-center justify-between gap-2">
              <p class="text-[10px] text-indigo-600 font-bold">មធ្យមភាគ</p>
              <p class="text-base font-extrabold text-indigo-700">{{ classAverage }}</p>
            </div>

            <div class="bg-emerald-50 px-2.5 py-2 rounded-lg border border-emerald-100 flex items-center justify-between gap-2">
              <p class="text-[10px] text-emerald-600 font-bold">ជាប់/ធ្លាក់</p>
              <p class="text-base font-extrabold text-emerald-700">
                {{ passCount }}
                <span class="text-slate-400 text-xs">/</span>
                <span class="text-red-500">{{ failCount }}</span>
              </p>
            </div>
          </div>

          <!-- Table -->
          <div class="report-table-wrap overflow-x-auto">
            <table class="report-table min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-100">
                <tr>
                  <th class="table-th text-center w-10">ល.រ</th>
                  <th class="table-th text-left student-col">ឈ្មោះសិស្ស</th>

                  <th
                    v-for="sub in selectedSubjects"
                    :key="sub._id"
                    class="table-th text-center score-col"
                  >
                    {{ sub.subjectName }}
                  </th>

                  <th class="table-th text-center avg-col">
                    មធ្យម
                  </th>

                  <th class="table-th text-center result-col">
                    លទ្ធផល
                  </th>

                  <th class="table-th text-left remark-col">
                    ផ្សេងៗ
                  </th>
                </tr>
              </thead>

              <tbody class="bg-white divide-y divide-slate-200">
                <tr
                  v-for="(student, index) in reportData"
                  :key="student.studentId"
                  class="hover:bg-slate-50 print:hover:bg-transparent"
                >
                  <td class="table-td text-center text-slate-500">
                    {{ index + 1 }}
                  </td>

                  <td class="table-td font-bold text-slate-800">
                    {{ student.khmerName || '-' }}
                  </td>

                  <td
                    v-for="sub in selectedSubjects"
                    :key="sub._id"
                    class="table-td text-center font-extrabold"
                    :class="getScoreClass(getSubjectScore(student, sub._id))"
                  >
                    {{ getSubjectScore(student, sub._id) }}
                  </td>

                  <td
                    class="table-td text-center font-extrabold"
                    :class="getScoreClass(getStudentAverage(student))"
                  >
                    {{ getStudentAverage(student) }}
                  </td>

                  <td class="table-td text-center">
                    <span
                      v-if="getStudentAverage(student) === 'N/A'"
                      class="text-slate-400 text-[10px] print:text-black"
                    >
                      -
                    </span>

                    <span
                      v-else-if="Number(getStudentAverage(student)) >= 50"
                      class="inline-flex px-1.5 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-100 text-emerald-700 print:bg-transparent print:text-black"
                    >
                      ជាប់
                    </span>

                    <span
                      v-else
                      class="inline-flex px-1.5 py-0.5 text-[10px] font-extrabold rounded-full bg-red-100 text-red-700 print:bg-transparent print:text-black"
                    >
                      ធ្លាក់
                    </span>
                  </td>

                  <td class="table-td text-slate-500">
                    {{ getStudentRemarks(student) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Print Signature -->
          <div class="hidden print:flex justify-between mt-8 px-8 text-xs">
            <div class="text-center">
              <p class="mb-16 font-bold">
                បានឃើញ និងឯកភាព<br />
                នាយកសាលា
              </p>
              <p>.......................................</p>
            </div>

            <div class="text-center">
              <p class="mb-16">
                ថ្ងៃទី........ខែ........ឆ្នាំ........<br />
                <strong class="font-bold">គ្រូបង្រៀន</strong>
              </p>
              <p>.......................................</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!loading && hasSearched"
        class="no-print text-center py-8 bg-white rounded-xl border border-dashed border-slate-300"
      >
        <div class="mx-auto mb-2 h-10 w-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
          <i class="fa-solid fa-file-circle-xmark text-lg"></i>
        </div>

        <p class="text-sm font-extrabold text-slate-600">
          មិនទាន់មានទិន្នន័យពិន្ទុទេ
        </p>

        <p class="text-[11px] text-slate-400 mt-0.5">
          សម្រាប់ខែ និងមុខវិជ្ជាដែលបានជ្រើសរើស
        </p>
      </div>

      <!-- Initial State -->
      <div
        v-else
        class="no-print text-center py-8 bg-white rounded-xl border border-slate-200"
      >
        <div class="mx-auto mb-2 h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <i class="fa-solid fa-chart-simple text-lg"></i>
        </div>

        <p class="text-sm font-extrabold text-slate-700">
          សូមជ្រើសរើស Filter ខាងលើ
        </p>

        <p class="text-[11px] text-slate-400 mt-0.5">
          ជ្រើសថ្នាក់ មុខវិជ្ជា ឆ្នាំសិក្សា និងខែ បន្ទាប់មកចុច “មើលរបាយការណ៍”
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import api from '../config/api';
import { useQuery } from '../hooks/useQuery';

const { data: classes } = useQuery('classes');
const { data: subjects } = useQuery('subjects');

const loading = ref(false);
const hasSearched = ref(false);
const reportData = ref([]);

const months = [
  { value: 'January', label: 'មករា' },
  { value: 'February', label: 'កុម្ភៈ' },
  { value: 'March', label: 'មីនា' },
  { value: 'April', label: 'មេសា' },
  { value: 'May', label: 'ឧសភា' },
  { value: 'June', label: 'មិថុនា' },
  { value: 'July', label: 'កក្កដា' },
  { value: 'August', label: 'សីហា' },
  { value: 'September', label: 'កញ្ញា' },
  { value: 'October', label: 'តុលា' },
  { value: 'November', label: 'វិច្ឆិកា' },
  { value: 'December', label: 'ធ្នូ' }
];

const filters = ref({
  classId: '',
  subjectIds: [],
  academicYear: '2025-2026',
  month: 'January'
});

const normalizeArray = (responseData) => {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.result)) return responseData.result;
  if (Array.isArray(responseData?.data)) return responseData.data;
  if (Array.isArray(responseData?.items)) return responseData.items;
  return [];
};

const classesList = computed(() => normalizeArray(classes.value));
const subjectsList = computed(() => normalizeArray(subjects.value));

const selectedSubjects = computed(() => {
  return subjectsList.value.filter((sub) => filters.value.subjectIds.includes(sub._id));
});

const selectedSubjectNames = computed(() => {
  if (selectedSubjects.value.length === 0) return '-';
  return selectedSubjects.value.map((sub) => sub.subjectName).join(', ');
});

const isFilterValid = computed(() => {
  return (
    filters.value.classId &&
    filters.value.subjectIds.length > 0 &&
    filters.value.academicYear
  );
});

const selectedClassName = computed(() => {
  const cls = classesList.value.find((c) => c._id === filters.value.classId);
  return cls ? cls.className : '';
});

const selectedMonthLabel = computed(() => {
  const month = months.find((m) => m.value === filters.value.month);
  return month ? month.label : filters.value.month;
});

const selectAllSubjects = () => {
  filters.value.subjectIds = subjectsList.value.map((sub) => sub._id);
};

const clearSubjects = () => {
  filters.value.subjectIds = [];
};

const getSubjectScore = (student, subjectId) => {
  return student.subjectScores?.[subjectId] ?? 'N/A';
};

const getStudentAverage = (student) => {
  const scores = selectedSubjects.value
    .map((sub) => getSubjectScore(student, sub._id))
    .filter((score) => score !== 'N/A' && score !== '' && !Number.isNaN(Number(score)))
    .map(Number);

  if (scores.length === 0) return 'N/A';

  const total = scores.reduce((sum, score) => sum + score, 0);
  return (total / scores.length).toFixed(2);
};

const getStudentRemarks = (student) => {
  const remarks = Object.values(student.subjectRemarks || {}).filter(Boolean);
  return remarks.length ? remarks.join(', ') : '-';
};

const classAverage = computed(() => {
  const averages = reportData.value
    .map((student) => getStudentAverage(student))
    .filter((avg) => avg !== 'N/A')
    .map(Number);

  if (averages.length === 0) return 0;

  const total = averages.reduce((sum, avg) => sum + avg, 0);
  return (total / averages.length).toFixed(2);
});

const passCount = computed(() => {
  return reportData.value.filter((student) => {
    const avg = getStudentAverage(student);
    return avg !== 'N/A' && Number(avg) >= 50;
  }).length;
});

const failCount = computed(() => {
  return reportData.value.filter((student) => {
    const avg = getStudentAverage(student);
    return avg !== 'N/A' && Number(avg) < 50;
  }).length;
});

const getScoreClass = (score) => {
  if (score === 'N/A') return 'text-slate-400 print:text-black';
  if (Number(score) < 50) return 'text-red-600 print:text-black';
  return 'text-blue-600 print:text-black';
};

const generateReport = async () => {
  if (!isFilterValid.value) return;

  loading.value = true;
  hasSearched.value = true;
  reportData.value = [];

  try {
    const selectedClassObj = classesList.value.find((c) => c._id === filters.value.classId);
    const enrolledStudentIds = (selectedClassObj?.students || []).map((s) => s._id || s);

    const [studentsRes, ...scoreResponses] = await Promise.all([
      api.get('/students'),
      ...filters.value.subjectIds.map((subjectId) =>
        api.get('/scores', {
          params: {
            classId: filters.value.classId,
            subjectId,
            academicYear: filters.value.academicYear,
            month: filters.value.month
          }
        })
      )
    ]);

    const allStudents = normalizeArray(studentsRes.data);
    const classStudents = allStudents.filter((stu) => enrolledStudentIds.includes(stu._id));

    const scoresBySubject = {};

    filters.value.subjectIds.forEach((subjectId, index) => {
      scoresBySubject[subjectId] = normalizeArray(scoreResponses[index]?.data);
    });

    reportData.value = classStudents.map((stu) => {
      const subjectScores = {};
      const subjectRemarks = {};

      filters.value.subjectIds.forEach((subjectId) => {
        const foundScore = scoresBySubject[subjectId].find((scoreItem) => {
          const sId = scoreItem.studentId?._id || scoreItem.studentId;
          return sId === stu._id;
        });

        subjectScores[subjectId] = foundScore ? foundScore.score : 'N/A';
        subjectRemarks[subjectId] = foundScore ? foundScore.remark : '';
      });

      return {
        studentId: stu._id,
        khmerName: stu.khmerName,
        subjectScores,
        subjectRemarks
      };
    });
  } catch (error) {
    console.error('Error generating report:', error);
  } finally {
    loading.value = false;
  }
};

const printReport = () => {
  window.print();
};
</script>

<style scoped>
.form-label {
  display: block;
  font-size: 0.62rem;
  font-weight: 800;
  color: #64748b;
  margin-bottom: 0.16rem;
}

.form-input {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 0.45rem;
  padding: 0.36rem 0.52rem;
  font-size: 0.68rem;
  color: #334155;
  background: #ffffff;
  outline: none;
  min-height: 1.9rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
}

.table-th {
  padding: 0.42rem 0.55rem;
  font-size: 0.62rem;
  font-weight: 900;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.table-td {
  padding: 0.42rem 0.55rem;
  border: 1px solid #f1f5f9;
  font-size: 0.68rem;
}

@media print {
  @page {
    size: A4 portrait;
    margin: 8mm;
  }

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    box-sizing: border-box !important;
  }

  html,
  body {
    width: 210mm !important;
    min-height: 297mm !important;
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
    overflow: visible !important;
  }

  body {
    font-family: 'Kantumruy Pro', sans-serif !important;
  }

  body * {
    visibility: hidden !important;
  }

  .print-area,
  .print-area * {
    visibility: visible !important;
  }

  .no-print,
  .no-print *,
  header,
  nav,
  aside,
  .sidebar,
  .navbar,
  button {
    display: none !important;
    visibility: hidden !important;
  }

  .print-area {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    box-shadow: none !important;
    background: white !important;
    overflow: visible !important;
  }

  .print-page {
    width: 194mm !important;
    max-width: 194mm !important;
    margin: 0 auto !important;
    padding: 0 !important;
    background: white !important;
    overflow: visible !important;
  }

  .report-table-wrap,
  .overflow-x-auto,
  .overflow-auto,
  .overflow-scroll {
    overflow: visible !important;
    width: 100% !important;
    max-width: 100% !important;
  }

  .report-table,
  table {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    border-collapse: collapse !important;
    table-layout: fixed !important;
    page-break-inside: auto !important;
    font-size: 8.5px !important;
  }

  thead {
    display: table-header-group !important;
  }

  tfoot {
    display: table-footer-group !important;
  }

  tr {
    page-break-inside: avoid !important;
    page-break-after: auto !important;
  }

  th,
  td {
    border: 1px solid #334155 !important;
    padding: 3px 3px !important;
    font-size: 8.5px !important;
    color: #000 !important;
    white-space: normal !important;
    word-break: break-word !important;
    overflow-wrap: anywhere !important;
    vertical-align: middle !important;
  }

  th {
    background: #e5e7eb !important;
    font-weight: 800 !important;
  }

  .table-th,
  .table-td {
    padding: 3px 3px !important;
    font-size: 8.5px !important;
  }

  .student-col {
    width: 34mm !important;
  }

  .score-col {
    width: auto !important;
  }

  .avg-col {
    width: 15mm !important;
  }

  .result-col {
    width: 16mm !important;
  }

  .remark-col {
    width: 24mm !important;
  }

  .rounded-xl,
  .rounded-lg,
  .rounded-md,
  .rounded-full {
    border-radius: 0 !important;
  }

  .shadow-sm,
  .shadow,
  .shadow-md,
  .shadow-lg {
    box-shadow: none !important;
  }

  .divide-y > :not([hidden]) ~ :not([hidden]) {
    border-top-width: 0 !important;
  }

  .min-w-full,
  .min-w-\[720px\],
  .min-w-\[760px\],
  .min-w-\[780px\],
  .min-w-\[850px\],
  .min-w-\[900px\],
  .min-w-\[1000px\] {
    min-width: 0 !important;
  }
}
</style>