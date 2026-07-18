<template>
  <div class="bg-slate-50 p-2 sm:p-3 md:p-4 print:bg-white print:p-0">
    <!-- Header -->
    <div
      class="mb-3 md:mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 md:gap-3 print:hidden max-w-7xl mx-auto"
    >
      <div
        class="bg-white rounded-xl border border-slate-200 shadow-sm px-2.5 sm:px-3 py-3 md:px-4 w-full"
      >
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 md:gap-3">
          <div class="min-w-0">
            <h1
              class="text-base sm:text-lg md:text-xl font-extrabold text-slate-800 flex items-center gap-2"
            >
              <span
                class="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs sm:text-sm shrink-0"
              >
                <i class="fa-solid fa-clipboard-check"></i>
              </span>

              <span class="truncate">
                របាយការណ៍វត្តមានសិស្ស
              </span>
            </h1>

            <p class="text-slate-500 text-[11px] sm:text-xs mt-1 truncate">
              ពិនិត្យមើល និងទាញយករបាយការណ៍វត្តមានសរុប
            </p>
          </div>

          <div class="grid grid-cols-3 gap-1.5 sm:flex sm:flex-row sm:gap-2 w-full md:w-auto">
            <button
              type="button"
              @click="exportPDF"
              :disabled="!canExport || exportingPdf"
              class="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <i
                class="fa-solid text-[10px] sm:text-xs"
                :class="exportingPdf ? 'fa-circle-notch fa-spin' : 'fa-file-pdf'"
              ></i>
              PDF
            </button>

            <button
              type="button"
              @click="exportExcel"
              :disabled="!canExport || exportingExcel"
              class="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <i
                class="fa-solid text-[10px] sm:text-xs"
                :class="exportingExcel ? 'fa-circle-notch fa-spin' : 'fa-file-excel'"
              ></i>
              Excel
            </button>

            <button
              type="button"
              @click="printReport"
              :disabled="!canExport || exportingPdf"
              class="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <i class="fa-solid fa-print text-[10px] sm:text-xs"></i>
              បោះពុម្ព
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div
      class="bg-white p-2.5 sm:p-3 rounded-xl shadow-sm border border-slate-200 mb-3 md:mb-4 print:hidden max-w-7xl mx-auto"
    >
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <!-- Class -->
        <div class="col-span-2 sm:col-span-1">
          <label class="form-label">
            ជ្រើសរើសថ្នាក់រៀន <span class="text-red-500">*</span>
          </label>

          <select
            v-model="filters.classId"
            @change="onClassChange"
            class="form-input"
          >
            <option value="">-- ជ្រើសរើសថ្នាក់ --</option>
            <option :value="allClassesValue">ថ្នាក់ទាំងអស់</option>

            <option
              v-for="cls in classes"
              :key="cls._id"
              :value="cls._id"
            >
              {{ cls.className }}
            </option>
          </select>
        </div>

        <!-- Year -->
        <div>
          <label class="form-label">
            ឆ្នាំ
          </label>

          <select
            v-model="filters.year"
            @change="fetchReport"
            class="form-input"
          >
            <option value="">ពេញមួយឆ្នាំ</option>

            <option
              v-for="year in yearOptions"
              :key="year"
              :value="year"
            >
              ឆ្នាំ {{ year }}
            </option>
          </select>
        </div>

        <!-- Month -->
        <div>
          <label class="form-label">
            ខែសិក្សា
          </label>

          <select
            v-model="filters.month"
            @change="fetchReport"
            :disabled="!filters.year"
            class="form-input disabled:bg-slate-100 disabled:cursor-not-allowed"
          >
            <option value="">ពេញមួយឆ្នាំ</option>

            <option
              v-for="month in 12"
              :key="month"
              :value="month"
            >
              ខែទី {{ month }} ({{ khmerMonths[month - 1] }})
            </option>
          </select>
        </div>

        <!-- Student Search -->
        <div class="col-span-2 lg:col-span-1">
          <label class="form-label">
            ស្វែងរកតាមឈ្មោះសិស្ស
          </label>

          <div
            ref="studentSearchBox"
            class="relative"
          >
            <i class="search-icon fa-solid fa-magnifying-glass"></i>

            <input
              v-model="studentSearch"
              type="text"
              :disabled="!filters.classId"
              @focus="showStudentDropdown = true"
              @input="onStudentSearchInput"
              placeholder="វាយឈ្មោះសិស្ស..."
              class="form-input search-input disabled:bg-slate-100 disabled:cursor-not-allowed"
            />

            <button
              v-if="studentSearch"
              type="button"
              @click="clearSelectedStudent"
              class="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 text-[10px] flex items-center justify-center"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>

            <div
              v-if="showStudentDropdown && filters.classId"
              class="absolute z-30 mt-1 w-full max-h-52 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg modal-scroll"
            >
              <button
                type="button"
                @click="selectAllStudents"
                class="w-full text-left px-3 py-2 text-[11px] hover:bg-slate-50 border-b border-slate-100 font-bold text-slate-600"
              >
                សិស្សទាំងអស់ក្នុងថ្នាក់
              </button>

              <button
                v-for="student in filteredStudents"
                :key="student._id"
                type="button"
                @click="selectStudent(student)"
                class="w-full text-left px-3 py-2 text-[11px] hover:bg-emerald-50 transition"
              >
                <div class="font-bold text-slate-700 truncate">
                  {{ student.khmerName }}
                </div>

                <div class="text-[10px] text-slate-400 truncate">
                  {{ student.englishName }} · {{ student.studentId }}
                  <span v-if="isAllClassesSelected"> · {{ getStudentClassName(student) }}</span>
                </div>
              </button>

              <div
                v-if="filteredStudents.length === 0"
                class="px-3 py-3 text-[11px] text-slate-400 text-center"
              >
                មិនមានឈ្មោះសិស្សដែលត្រូវនឹងការស្វែងរក
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Screen Content -->
    <div
      class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-7xl mx-auto print:hidden"
    >
      <!-- No Class -->
      <div
        v-if="!filters.classId"
        class="p-7 sm:p-8 text-center text-slate-400"
      >
        <div
          class="mx-auto mb-2 h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center"
        >
          <i class="fa-solid fa-folder-open text-xl"></i>
        </div>

        <p class="font-bold text-xs sm:text-sm text-slate-500">
          សូមជ្រើសរើសថ្នាក់រៀនដើម្បីបង្ហាញរបាយការណ៍
        </p>
      </div>

      <!-- Loading -->
      <div
        v-else-if="loading"
        class="p-7 sm:p-8 text-center text-slate-400"
      >
        <div
          class="mx-auto mb-2 h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"
        >
          <i class="fa-solid fa-circle-notch fa-spin text-lg sm:text-xl"></i>
        </div>

        <p class="font-bold text-xs sm:text-sm text-slate-500">
          កំពុងគណនា និងបង្កើតរបាយការណ៍...
        </p>
      </div>

      <!-- Empty -->
      <div
        v-else-if="reportData.length === 0"
        class="p-7 sm:p-8 text-center text-slate-400"
      >
        <div
          class="mx-auto mb-2 h-10 w-10 rounded-xl bg-yellow-50 text-yellow-500 flex items-center justify-center"
        >
          <i class="fa-solid fa-triangle-exclamation text-lg"></i>
        </div>

        <p class="font-bold text-xs sm:text-sm text-slate-500">
          មិនមានទិន្នន័យវត្តមានក្នុងចន្លោះពេលដែលបានជ្រើសរើសឡើយ។
        </p>
      </div>

      <!-- Report -->
      <template v-else>
        <!-- Screen Report Header -->
        <div
          class="px-2.5 sm:px-3 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
        >
          <div class="min-w-0">
            <h2 class="text-sm sm:text-base font-extrabold text-slate-800 truncate">
              {{ getSelectedClassName }}
            </h2>

            <p class="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">
              {{ selectedPeriodLabel }} · {{ selectedStudentLabel }} · សិស្ស {{ reportData.length }} នាក់
            </p>
          </div>

          <span
            class="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1 w-fit"
          >
            <i class="fa-solid fa-chart-pie text-[10px]"></i>
            មធ្យម {{ summary.averagePercentage }}%
          </span>
        </div>

        <!-- Summary Cards -->
        <div
          class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 p-2.5 sm:p-3 border-b border-slate-200 bg-white"
        >
          <div class="summary-card">
            <p class="summary-label">សរុបថ្ងៃ</p>
            <p class="summary-value text-slate-800">
              {{ summary.totalDays }}
            </p>
          </div>

          <div class="summary-card bg-green-50 border-green-100">
            <p class="summary-label text-green-600">វត្តមាន</p>
            <p class="summary-value text-green-700">
              {{ summary.present }}
            </p>
          </div>

          <div class="summary-card bg-orange-50 border-orange-100">
            <p class="summary-label text-orange-600">យឺត</p>
            <p class="summary-value text-orange-700">
              {{ summary.late }}
            </p>
          </div>

          <div class="summary-card bg-yellow-50 border-yellow-100">
            <p class="summary-label text-yellow-700">ច្បាប់</p>
            <p class="summary-value text-yellow-700">
              {{ summary.permission }}
            </p>
          </div>

          <div class="summary-card bg-red-50 border-red-100">
            <p class="summary-label text-red-600">អវត្តមាន</p>
            <p class="summary-value text-red-700">
              {{ summary.absent }}
            </p>
          </div>

          <div class="summary-card bg-blue-50 border-blue-100">
            <p class="summary-label text-blue-600">ភាគរយមធ្យម</p>
            <p class="summary-value text-blue-700">
              {{ summary.averagePercentage }}%
            </p>
          </div>
        </div>

        <!-- Mobile Cards -->
        <div class="lg:hidden bg-slate-50 p-2.5 space-y-2">
          <div
            v-for="(row, index) in reportData"
            :key="row.student?._id || index"
            class="bg-white rounded-xl border border-slate-200 shadow-sm p-2.5"
          >
            <div class="flex items-start gap-2">
              <div
                class="h-10 w-10 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center font-extrabold shrink-0 overflow-hidden font-khmer"
              >
                {{ getStudentInitial(row.student) }}
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-2">
                  <div class="min-w-0">
                    <p class="text-sm font-extrabold text-slate-800 leading-tight truncate ">
                      {{ row.student?.khmerName || "-" }}
                    </p>

                    <p class="text-[10px] text-slate-500 leading-tight truncate mt-0.5">
                      {{ row.student?.englishName || "-" }}
                    </p>
                  </div>

                  <span
                    class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-bold shrink-0"
                  >
                    #{{ index + 1 }}
                  </span>
                </div>

                <div class="mt-1 flex flex-wrap items-center gap-1 text-[10px] text-slate-500">
                  <span class="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-1.5 py-0.5 font-bold">
                    <i class="fa-solid fa-id-card text-slate-400"></i>
                    {{ row.student?.studentId || "-" }}
                  </span>

                  <span class="inline-flex items-center gap-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100 px-1.5 py-0.5 font-bold">
                    <i class="fa-solid fa-venus-mars text-purple-500"></i>
                    {{ row.student?.gender || "-" }}
                  </span>

                  <span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 font-bold">
                    <i class="fa-solid fa-school text-emerald-500"></i>
                    {{ getRowClassName(row) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="mt-2 grid grid-cols-4 gap-1.5">
              <div class="mobile-count-box bg-green-50 border-green-100">
                <p class="mobile-count-label text-green-600">វត្តមាន</p>
                <p class="mobile-count-value text-green-700">
                  {{ row.present || 0 }}
                </p>
              </div>

              <div class="mobile-count-box bg-orange-50 border-orange-100">
                <p class="mobile-count-label text-orange-600">យឺត</p>
                <p class="mobile-count-value text-orange-700">
                  {{ row.late || 0 }}
                </p>
              </div>

              <div class="mobile-count-box bg-yellow-50 border-yellow-100">
                <p class="mobile-count-label text-yellow-700">ច្បាប់</p>
                <p class="mobile-count-value text-yellow-700">
                  {{ row.permission || 0 }}
                </p>
              </div>

              <div class="mobile-count-box bg-red-50 border-red-100">
                <p class="mobile-count-label text-red-600">អវត្តមាន</p>
                <p class="mobile-count-value text-red-700">
                  {{ row.absent || 0 }}
                </p>
              </div>
            </div>

            <div class="mt-2 grid grid-cols-2 gap-2">
              <div class="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
                <p class="text-[10px] font-bold text-slate-400">សរុបថ្ងៃ</p>
                <p class="text-xs font-extrabold text-slate-700 mt-0.5">
                  {{ row.totalDays || 0 }}
                </p>
              </div>

              <div class="rounded-lg border border-blue-100 bg-blue-50 px-2 py-1.5">
                <p class="text-[10px] font-bold text-blue-600">ភាគរយ</p>

                <span
                  class="inline-flex mt-0.5 rounded-full px-2 py-0.5 text-[11px] font-extrabold"
                  :class="
                    Number(calculatePercentage(row.present, row.totalDays)) >= 75
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-red-100 text-red-700'
                  "
                >
                  {{ calculatePercentage(row.present, row.totalDays) }} %
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop Table -->
        <div class="hidden lg:block overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs min-w-[980px]">
            <thead>
              <tr class="bg-slate-100 text-slate-700 border-b">
                <th class="table-th text-center w-10">ល.រ</th>
                <th class="table-th w-20">អត្តសញ្ញាណ</th>
                <th class="table-th">ឈ្មោះសិស្ស</th>
                <th class="table-th text-center w-14">ភេទ</th>
                <th class="table-th text-center w-24 bg-emerald-50 text-emerald-700">ថ្នាក់</th>
                <th class="table-th text-center text-green-700 bg-green-50 w-16">វត្តមាន</th>
                <th class="table-th text-center text-orange-700 bg-orange-50 w-16">យឺត</th>
                <th class="table-th text-center text-yellow-700 bg-yellow-50 w-16">ច្បាប់</th>
                <th class="table-th text-center text-red-700 bg-red-50 w-16">អវត្តមាន</th>
                <th class="table-th text-center w-20">សរុបថ្ងៃ</th>
                <th class="table-th text-center w-24 bg-blue-50 text-blue-700">ភាគរយ</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(row, index) in reportData"
                :key="row.student?._id || index"
                class="hover:bg-slate-50 transition border-b border-slate-100"
              >
                <td class="table-td text-center text-slate-500">
                  {{ index + 1 }}
                </td>

                <td class="table-td font-mono font-bold text-slate-700">
                  {{ row.student?.studentId || "-" }}
                </td>

                <td class="table-td">
                  <div class="flex items-center gap-2">
                    <div
                      class="h-8 w-8 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center font-extrabold shrink-0 font-khmer"
                    >
                      {{ getStudentInitial(row.student) }}
                    </div>

                    <div class="min-w-0">
                      <div class="font-bold text-slate-800 leading-tight truncate">
                        {{ row.student?.khmerName || "-" }}
                      </div>

                      <div class="text-[10px] text-slate-400 uppercase font-mono leading-tight truncate">
                        {{ row.student?.englishName || "-" }}
                      </div>
                    </div>
                  </div>
                </td>

                <td class="table-td text-center text-slate-700">
                  {{ row.student?.gender || "-" }}
                </td>

                <td class="table-td text-center font-bold text-emerald-700 bg-emerald-50/50">
                  {{ getRowClassName(row) }}
                </td>

                <td class="table-td text-center font-bold text-green-700 bg-green-50/50">
                  {{ row.present || 0 }}
                </td>

                <td class="table-td text-center font-bold text-orange-700 bg-orange-50/50">
                  {{ row.late || 0 }}
                </td>

                <td class="table-td text-center font-bold text-yellow-700 bg-yellow-50/50">
                  {{ row.permission || 0 }}
                </td>

                <td class="table-td text-center font-bold text-red-700 bg-red-50/50">
                  {{ row.absent || 0 }}
                </td>

                <td class="table-td text-center font-mono text-slate-700">
                  {{ row.totalDays || 0 }}
                </td>

                <td class="table-td text-center font-bold bg-blue-50/50">
                  <span
                    class="inline-flex rounded-full px-2 py-0.5 text-[11px] font-extrabold"
                    :class="
                      Number(calculatePercentage(row.present, row.totalDays)) >= 75
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    "
                  >
                    {{ calculatePercentage(row.present, row.totalDays) }} %
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>

    <!-- Same template for Print and PDF -->
    <div class="print-paper-wrap">
      <AttendanceReportPaper
        ref="paperComponentRef"
        :report-data="reportData"
        :class-name="getSelectedClassName"
        :period-label="selectedPeriodLabel"
        :student-label="selectedStudentLabel"
        :exported-at-label="exportedAtLabel"
        :logo-url="schoolLogoUrl"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount, nextTick } from "vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ExcelJS from "exceljs";
import api from "../config/api";
import { useToast } from "vue-toastification";
import AttendanceReportPaper from "../components/reports/AttendanceReportPaper.vue";
import schoolLogoUrl from "../assets/logoRIS.jpg";

const toast = useToast();

const allClassesValue = "all";
const excelFontName = "Khmer OS Battambang";

const classes = ref([]);
const studentsInClass = ref([]);
const reportData = ref([]);
const loading = ref(false);
const exportingPdf = ref(false);
const exportingExcel = ref(false);

const studentSearch = ref("");
const showStudentDropdown = ref(false);
const studentSearchBox = ref(null);
const paperComponentRef = ref(null);


const filters = ref({
  classId: "",
  year: new Date().getFullYear().toString(),
  month: "",
  studentId: ""
});

const startYear = 2026;
const endYear = new Date().getFullYear() + 5;

const yearOptions = Array.from(
  {
    length: endYear - startYear + 1
  },
  (_, index) => (startYear + index).toString()
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

const isAllClassesSelected = computed(() => {
  return filters.value.classId === allClassesValue;
});

const canExport = computed(() => {
  return Boolean(filters.value.classId && reportData.value.length > 0);
});

const getSelectedClassName = computed(() => {
  if (isAllClassesSelected.value) return "ថ្នាក់ទាំងអស់";

  const selectedClass = classes.value.find((classItem) => {
    return classItem._id === filters.value.classId;
  });

  return selectedClass ? selectedClass.className : "";
});

const selectedPeriodLabel = computed(() => {
  if (!filters.value.year) return "ពេញមួយឆ្នាំ";

  if (filters.value.month) {
    return `ខែ ${khmerMonths[Number(filters.value.month) - 1]} ឆ្នាំ ${filters.value.year}`;
  }

  return `ពេញមួយឆ្នាំ ${filters.value.year}`;
});

const selectedStudentLabel = computed(() => {
  if (!filters.value.studentId) return "សិស្សទាំងអស់";

  const student = studentsInClass.value.find((studentItem) => {
    return studentItem._id === filters.value.studentId;
  });

  if (!student) return studentSearch.value || "-";

  return `${student.khmerName || ""} ${student.englishName || ""}`.trim();
});

const exportedAtLabel = computed(() => {
  return new Date().toLocaleString("km-KH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
});

const filteredStudents = computed(() => {
  const keyword = studentSearch.value.trim().toLowerCase();
  const sortedStudents = sortStudentsByKhmerName(studentsInClass.value);

  if (!keyword) {
    return sortedStudents;
  }

  return sortedStudents.filter((student) => {
    const khmerName = student.khmerName?.toLowerCase() || "";
    const englishName = student.englishName?.toLowerCase() || "";
    const studentId = student.studentId?.toLowerCase() || "";
    const className = getStudentClassName(student).toLowerCase();

    return (
      khmerName.includes(keyword) ||
      englishName.includes(keyword) ||
      studentId.includes(keyword) ||
      className.includes(keyword)
    );
  });
});

const summary = computed(() => {
  const total = reportData.value.reduce(
    (acc, row) => {
      acc.present += Number(row.present || 0);
      acc.late += Number(row.late || 0);
      acc.permission += Number(row.permission || 0);
      acc.absent += Number(row.absent || 0);
      acc.totalDays += Number(row.totalDays || 0);

      return acc;
    },
    {
      present: 0,
      late: 0,
      permission: 0,
      absent: 0,
      totalDays: 0
    }
  );

  const averagePercentage =
    total.totalDays > 0
      ? ((total.present / total.totalDays) * 100).toFixed(1)
      : "0.0";

  return {
    ...total,
    averagePercentage
  };
});

const getStudentInitial = (student) => {
  const khmerName = String(student?.khmerName || "").trim();

  if (khmerName) {
    return khmerName.charAt(0);
  }

  const englishName = String(student?.englishName || "").trim();

  if (englishName) {
    return englishName.charAt(0).toUpperCase();
  }

  return "?";
};

const getErrorMessage = (err, fallback = "មានបញ្ហាក្នុងប្រព័ន្ធ") => {
  return (
    err.response?.data?.err ||
    err.response?.data?.message ||
    err.message ||
    fallback
  );
};

const normalizeArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.result)) return payload.result;
  if (Array.isArray(payload?.items)) return payload.items;

  return [];
};

const getId = (value) => {
  return String(value?._id || value || "").trim();
};

const compareKhmerText = (firstValue, secondValue) => {
  return String(firstValue || "").localeCompare(String(secondValue || ""), "km", {
    sensitivity: "base"
  });
};

const getClassNameById = (classId) => {
  const id = getId(classId);

  if (!id) return "";

  const foundClass = classes.value.find((classItem) => getId(classItem) === id);

  return foundClass?.className || "";
};

const getStudentClassName = (student) => {
  return (
    student?.className ||
    student?.grade?.className ||
    student?.class?.className ||
    student?.classId?.className ||
    getClassNameById(
      student?.grade?._id ||
        student?.grade ||
        student?.class?._id ||
        student?.class ||
        student?.classId?._id ||
        student?.classId
    ) ||
    "-"
  );
};

const getRowClassName = (row) => {
  return (
    row?.className ||
    row?.class?.className ||
    row?.classId?.className ||
    getClassNameById(row?.classId || row?.class?._id || row?.class) ||
    getStudentClassName(row?.student) ||
    "-"
  );
};


const uniqueStudents = (students) => {
  const seen = new Set();

  return students.filter((student) => {
    const id = getId(student);

    if (!id || seen.has(id)) return false;

    seen.add(id);
    return true;
  });
};

const sortStudentsByKhmerName = (students) => {
  return [...students].sort((firstStudent, secondStudent) => {
    const nameCompare = compareKhmerText(firstStudent?.khmerName, secondStudent?.khmerName);

    if (nameCompare !== 0) return nameCompare;

    return compareKhmerText(firstStudent?.englishName, secondStudent?.englishName);
  });
};

const normalizeReportRows = (rows, classItem = null) => {
  return rows.map((row) => {
    const className =
      row?.className ||
      row?.class?.className ||
      classItem?.className ||
      getStudentClassName(row?.student) ||
      "-";

    const classId =
      row?.classId ||
      row?.class?._id ||
      classItem?._id ||
      row?.student?.classId?._id ||
      row?.student?.classId ||
      row?.student?.class?._id ||
      row?.student?.class ||
      "";

    return {
      ...row,
      classId,
      className
    };
  });
};

const sortReportRowsByKhmerName = (rows) => {
  return [...rows].sort((firstRow, secondRow) => {
    const firstClass = getRowClassName(firstRow);
    const secondClass = getRowClassName(secondRow);

    if (isAllClassesSelected.value) {
      const classCompare = compareKhmerText(firstClass, secondClass);

      if (classCompare !== 0) return classCompare;
    }

    const nameCompare = compareKhmerText(
      firstRow?.student?.khmerName,
      secondRow?.student?.khmerName
    );

    if (nameCompare !== 0) return nameCompare;

    return compareKhmerText(firstRow?.student?.englishName, secondRow?.student?.englishName);
  });
};

const fetchClasses = async () => {
  try {
    const response = await api.get("/classes");
    classes.value = normalizeArray(response.data);
  } catch (err) {
    toast.error(getErrorMessage(err, "មិនអាចទាញយកទិន្នន័យថ្នាក់រៀនបានទេ"));
  }
};

const fetchAllStudentsForDropdown = async () => {
  const response = await api.get("/students");
  const allStudents = normalizeArray(response.data).map((student) => {
    return {
      ...student,
      className: getStudentClassName(student)
    };
  });

  studentsInClass.value = sortStudentsByKhmerName(uniqueStudents(allStudents));
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
    if (isAllClassesSelected.value) {
      await fetchAllStudentsForDropdown();
      await fetchReport();
      return;
    }

    const response = await api.get(`/classes/${filters.value.classId}`);
    const classDetails = response.data.data || response.data;

    studentsInClass.value = sortStudentsByKhmerName(
      Array.isArray(classDetails.students)
        ? classDetails.students.map((student) => ({
            ...student,
            className: classDetails.className || getSelectedClassName.value
          }))
        : []
    );
  } catch (err) {
    toast.error(getErrorMessage(err, "មិនអាចទាញយកបញ្ជីសិស្សបានទេ"));
  }

  await fetchReport();
};

const fetchReport = async () => {
  if (!filters.value.classId) return;

  loading.value = true;

  try {
    if (isAllClassesSelected.value) {
      const selectedClasses = classes.value.filter((classItem) => classItem?._id);

      const reportResponses = await Promise.all(
        selectedClasses.map(async (classItem) => {
          const response = await api.get("/attendance/report", {
            params: {
              classId: classItem._id,
              year: filters.value.year,
              month: filters.value.month,
              studentId: filters.value.studentId
            }
          });

          return normalizeReportRows(normalizeArray(response.data), classItem);
        })
      );

      reportData.value = sortReportRowsByKhmerName(reportResponses.flat());
      return;
    }

    const selectedClass = classes.value.find((classItem) => {
      return classItem._id === filters.value.classId;
    });

    const response = await api.get("/attendance/report", {
      params: {
        classId: filters.value.classId,
        year: filters.value.year,
        month: filters.value.month,
        studentId: filters.value.studentId
      }
    });

    reportData.value = sortReportRowsByKhmerName(
      normalizeReportRows(normalizeArray(response.data), selectedClass)
    );
  } catch (err) {
    toast.error(getErrorMessage(err, "មានបញ្ហាក្នុងការទាញយករបាយការណ៍"));
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

  const classSuffix = isAllClassesSelected.value ? ` · ${getStudentClassName(student)}` : "";
  studentSearch.value = `${student.khmerName || ""} (${student.englishName || ""})${classSuffix}`;

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
  if (!total) return "0.0";

  return ((Number(present || 0) / Number(total || 0)) * 100).toFixed(1);
};

const buildFileName = (extension) => {
  const className = getSelectedClassName.value || "attendance";
  const year = filters.value.year || "all-year";
  const month = filters.value.month ? `month-${filters.value.month}` : "all-months";
  const safeClassName = className.replace(/[\\/:*?"<>|]/g, "-");

  return `attendance-report-${safeClassName}-${year}-${month}.${extension}`;
};

const parseRowNumber = (value) => {
  const khmerToEnglishDigits = {
    "០": "0",
    "១": "1",
    "២": "2",
    "៣": "3",
    "៤": "4",
    "៥": "5",
    "៦": "6",
    "៧": "7",
    "៨": "8",
    "៩": "9"
  };

  const numberText = String(value || "")
    .replace(/[០-៩]/g, (digit) => khmerToEnglishDigits[digit] || digit)
    .replace(/[^0-9]/g, "");

  const parsed = Number(numberText);

  return Number.isNaN(parsed) || parsed <= 0 ? null : parsed;
};

const addClassColumnToPdfTables = (clonedPaper) => {
  const tables = Array.from(clonedPaper.querySelectorAll(".report-table"));
  let rowIndex = 0;

  tables.forEach((table) => {
    const headerRow = table.querySelector("thead tr");

    if (!headerRow || headerRow.textContent.includes("ថ្នាក់")) return;

    const headerCells = Array.from(headerRow.children);
    const genderIndex = headerCells.findIndex((cell) => cell.textContent.includes("ភេទ"));
    const insertIndex = genderIndex >= 0 ? genderIndex + 1 : Math.min(3, headerCells.length);

    const headerCell = clonedPaper.ownerDocument.createElement("th");
    headerCell.className = "class-col pdf-added-class-col";
    headerCell.innerHTML = '<span class="cell-text">ថ្នាក់</span>';
    headerCell.style.border = "1px solid #475569";
    headerCell.style.background = "#ecfdf5";
    headerCell.style.color = "#047857";
    headerCell.style.fontWeight = "900";
    headerCell.style.textAlign = "center";
    headerCell.style.verticalAlign = "middle";

    headerRow.insertBefore(headerCell, headerCells[insertIndex] || null);

    const bodyRows = Array.from(table.querySelectorAll("tbody tr"));

    bodyRows.forEach((row) => {
      const cells = Array.from(row.children);
      const rowNumber = parseRowNumber(cells[0]?.textContent);
      const dataRow = reportData.value[rowNumber ? rowNumber - 1 : rowIndex];
      const classCell = clonedPaper.ownerDocument.createElement("td");

      classCell.className = "pdf-added-class-col";
      classCell.innerHTML = `<span class="cell-text">${getRowClassName(dataRow)}</span>`;
      classCell.style.border = "1px solid #cbd5e1";
      classCell.style.background = "#f0fdf4";
      classCell.style.color = "#047857";
      classCell.style.fontWeight = "800";
      classCell.style.textAlign = "center";
      classCell.style.verticalAlign = "middle";

      row.insertBefore(classCell, cells[insertIndex] || null);
      rowIndex += 1;
    });

    const footerRows = Array.from(table.querySelectorAll("tfoot tr"));

    footerRows.forEach((row) => {
      const cells = Array.from(row.children);
      const footerCell = clonedPaper.ownerDocument.createElement("td");

      footerCell.className = "pdf-added-class-col";
      footerCell.innerHTML = '<span class="cell-text">-</span>';
      footerCell.style.border = "1px solid #cbd5e1";
      footerCell.style.background = "#f8fafc";
      footerCell.style.textAlign = "center";
      footerCell.style.verticalAlign = "middle";

      row.insertBefore(footerCell, cells[insertIndex] || null);
    });
  });
};

const getNormalizedText = (value) => {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
};

const pageHasReportData = (pageElement) => {
  const text = getNormalizedText(pageElement.innerText || pageElement.textContent || "");

  return reportData.value.some((row) => {
    const khmerName = getNormalizedText(row?.student?.khmerName);
    const englishName = getNormalizedText(row?.student?.englishName);
    const studentId = getNormalizedText(row?.student?.studentId);

    return (
      (khmerName && text.includes(khmerName)) ||
      (englishName && text.includes(englishName)) ||
      (studentId && text.includes(studentId))
    );
  });
};

const isUsablePdfPage = (pageElement) => {
  if (!pageElement) return false;

  const rect = pageElement.getBoundingClientRect();
  const text = getNormalizedText(pageElement.innerText || pageElement.textContent || "");

  return rect.width > 0 && rect.height > 0 && text.length > 0;
};

const getPdfPageSignature = (pageElement) => {
  const text = getNormalizedText(pageElement.innerText || pageElement.textContent || "");

  return text
    .replace(/ទំព័រ\s*[:៖]?\s*[0-9០-៩]+\s*\/\s*[0-9០-៩]+/g, "")
    .replace(/Page\s*[0-9០-៩]+\s*\/\s*[0-9០-៩]+/gi, "")
    .replace(/\s+/g, " ")
    .trim();
};

const removeNestedDuplicatePages = (pages) => {
  return pages.filter((page, index) => {
    return !pages.some((otherPage, otherIndex) => {
      return otherIndex !== index && page.contains(otherPage);
    });
  });
};

const getPdfPageElements = (element) => {
  const pageSelectors = [
    ".paper-page",
    ".pdf-page",
    ".print-page",
    ".paper",
    "[data-pdf-page]"
  ];

  const pages = pageSelectors
    .flatMap((selector) => Array.from(element.querySelectorAll(selector)))
    .filter((page, index, array) => array.indexOf(page) === index)
    .filter(isUsablePdfPage);

  const basePages = pages.length > 0 ? removeNestedDuplicatePages(pages) : [element];
  const dataPages = basePages.filter(pageHasReportData);
  const candidatePages = dataPages.length > 0 ? dataPages : basePages;

  const uniquePages = [];
  const seenSignatures = new Set();

  candidatePages.forEach((page) => {
    const signature = getPdfPageSignature(page);

    if (!signature || seenSignatures.has(signature)) return;

    seenSignatures.add(signature);
    uniquePages.push(page);
  });

  return uniquePages.length > 0 ? uniquePages : [element];
};

const exportPDF = async () => {
  if (!canExport.value) {
    toast.error("សូមជ្រើសរើសថ្នាក់ និងមានទិន្នន័យរបាយការណ៍សិន");
    return;
  }

  exportingPdf.value = true;

  try {
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 300));

    const element = paperComponentRef.value?.getElement?.();

    if (!element) {
      toast.error("រកមិនឃើញ template PDF");
      return;
    }

    const wrapper = element.closest(".print-paper-wrap");

    const originalWrapperStyle = wrapper
      ? {
          display: wrapper.style.display,
          position: wrapper.style.position,
          left: wrapper.style.left,
          top: wrapper.style.top,
          width: wrapper.style.width,
          height: wrapper.style.height,
          overflow: wrapper.style.overflow,
          backgroundColor: wrapper.style.backgroundColor,
          zIndex: wrapper.style.zIndex
        }
      : null;

    const originalElementStyle = {
      width: element.style.width,
      height: element.style.height,
      minHeight: element.style.minHeight,
      maxHeight: element.style.maxHeight,
      overflow: element.style.overflow,
      transform: element.style.transform,
      transformOrigin: element.style.transformOrigin
    };

    try {
      if (wrapper) {
        wrapper.style.display = "block";
        wrapper.style.position = "fixed";
        wrapper.style.left = "-99999px";
        wrapper.style.top = "0";
        wrapper.style.width = "794px";
        wrapper.style.height = "auto";
        wrapper.style.overflow = "visible";
        wrapper.style.backgroundColor = "rgb(255, 255, 255)";
        wrapper.style.zIndex = "-1";
      }

      element.style.width = "794px";
      element.style.height = "auto";
      element.style.minHeight = "1123px";
      element.style.maxHeight = "none";
      element.style.overflow = "visible";
      element.style.transform = "none";
      element.style.transformOrigin = "top left";

      element.classList.add("pdf-capture-source");

      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 250));

      const pageElements = getPdfPageElements(element);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let pageIndex = 0; pageIndex < pageElements.length; pageIndex += 1) {
        const pageElement = pageElements[pageIndex];
        const originalPageStyle = {
          width: pageElement.style.width,
          height: pageElement.style.height,
          minHeight: pageElement.style.minHeight,
          maxHeight: pageElement.style.maxHeight,
          overflow: pageElement.style.overflow
        };

        pageElement.style.width = "794px";
        pageElement.style.height = "1123px";
        pageElement.style.minHeight = "1123px";
        pageElement.style.maxHeight = "1123px";
        pageElement.style.overflow = "hidden";

        await nextTick();

        const canvas = await html2canvas(pageElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "rgb(255, 255, 255)",
          width: 794,
          height: 1123,
          windowWidth: 794,
          windowHeight: 1123,
          scrollX: 0,
          scrollY: 0,
          logging: false,
          onclone: (clonedDocument) => {
            const clonedPaper = clonedDocument.querySelector(".pdf-capture-source") || clonedDocument.body;

            if (!clonedPaper) return;

            addClassColumnToPdfTables(clonedPaper);

            clonedPaper.querySelectorAll(".report-table th, .report-table td").forEach((cell) => {
              cell.style.position = "relative";
              cell.style.overflow = "hidden";
              cell.style.textAlign = "center";
              cell.style.verticalAlign = "middle";
            });

            clonedPaper.querySelectorAll(".cell-text").forEach((text) => {
              text.style.position = "absolute";
              text.style.inset = "0";
              text.style.width = "100%";
              text.style.height = "100%";
              text.style.display = "flex";
              text.style.alignItems = "center";
              text.style.justifyContent = "center";
              text.style.boxSizing = "border-box";
              text.style.textAlign = "center";
              text.style.whiteSpace = "nowrap";
              text.style.overflow = "hidden";
              text.style.textOverflow = "ellipsis";
              text.style.lineHeight = "1.35";
              text.style.padding = "0 2px";
              text.style.transform = "translateY(-2px)";
            });

            clonedPaper.querySelectorAll(".report-table th .cell-text").forEach((text) => {
              text.style.lineHeight = "1.25";
              text.style.transform = "translateY(-1px)";
            });

            clonedPaper.querySelectorAll(".report-table tfoot .cell-text").forEach((text) => {
              text.style.lineHeight = "1.35";
              text.style.transform = "translateY(-2px)";
            });
          }
        });

        pageElement.style.width = originalPageStyle.width;
        pageElement.style.height = originalPageStyle.height;
        pageElement.style.minHeight = originalPageStyle.minHeight;
        pageElement.style.maxHeight = originalPageStyle.maxHeight;
        pageElement.style.overflow = originalPageStyle.overflow;

        const imageData = canvas.toDataURL("image/png");

        if (pageIndex > 0) {
          pdf.addPage();
        }

        pdf.addImage(
          imageData,
          "PNG",
          0,
          0,
          pageWidth,
          pageHeight,
          undefined,
          "FAST"
        );
      }

      pdf.save(buildFileName("pdf"));
      toast.success("បានទាញយក PDF ដោយជោគជ័យ");
    } finally {
      element.classList.remove("pdf-capture-source");

      if (wrapper && originalWrapperStyle) {
        wrapper.style.display = originalWrapperStyle.display;
        wrapper.style.position = originalWrapperStyle.position;
        wrapper.style.left = originalWrapperStyle.left;
        wrapper.style.top = originalWrapperStyle.top;
        wrapper.style.width = originalWrapperStyle.width;
        wrapper.style.height = originalWrapperStyle.height;
        wrapper.style.overflow = originalWrapperStyle.overflow;
        wrapper.style.backgroundColor = originalWrapperStyle.backgroundColor;
        wrapper.style.zIndex = originalWrapperStyle.zIndex;
      }

      element.style.width = originalElementStyle.width;
      element.style.height = originalElementStyle.height;
      element.style.minHeight = originalElementStyle.minHeight;
      element.style.maxHeight = originalElementStyle.maxHeight;
      element.style.overflow = originalElementStyle.overflow;
      element.style.transform = originalElementStyle.transform;
      element.style.transformOrigin = originalElementStyle.transformOrigin;
    }
  } catch (err) {
    console.error("PDF export error:", err);
    toast.error("មិនអាចទាញយក PDF បានទេ");
  } finally {
    exportingPdf.value = false;
  }
};

const applyCellBorder = (cell, color = "FFE2E8F0") => {
  cell.border = {
    top: {
      style: "thin",
      color: {
        argb: color
      }
    },
    left: {
      style: "thin",
      color: {
        argb: color
      }
    },
    bottom: {
      style: "thin",
      color: {
        argb: color
      }
    },
    right: {
      style: "thin",
      color: {
        argb: color
      }
    }
  };
};

const applyCellBaseStyle = (cell, options = {}) => {
  const {
    bold = false,
    fontColor = "FF334155",
    fillColor = null,
    borderColor = "FFE2E8F0",
    fontSize = 11,
    wrapText = true
  } = options;

  cell.font = {
    name: excelFontName,
    size: fontSize,
    bold,
    color: {
      argb: fontColor
    }
  };

  cell.alignment = {
    horizontal: "center",
    vertical: "middle",
    wrapText,
    shrinkToFit: !wrapText
  };

  if (fillColor) {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: fillColor
      }
    };
  }

  applyCellBorder(cell, borderColor);
};

const styleHeaderRow = (row) => {
  row.height = 26;

  row.eachCell((cell, columnNumber) => {
    let fillColor = "FFE0F2FE";
    let fontColor = "FF075985";

    if ([7].includes(columnNumber)) {
      fillColor = "FFDCFCE7";
      fontColor = "FF15803D";
    }

    if ([8].includes(columnNumber)) {
      fillColor = "FFFFEDD5";
      fontColor = "FFC2410C";
    }

    if ([9].includes(columnNumber)) {
      fillColor = "FFFEF9C3";
      fontColor = "FFA16207";
    }

    if ([10].includes(columnNumber)) {
      fillColor = "FFFEE2E2";
      fontColor = "FFB91C1C";
    }

    if ([12].includes(columnNumber)) {
      fillColor = "FFDBEAFE";
      fontColor = "FF1D4ED8";
    }

    if ([13].includes(columnNumber)) {
      fillColor = "FFFCE7F3";
      fontColor = "FFBE185D";
    }

    applyCellBaseStyle(cell, {
      bold: true,
      fontColor,
      fillColor,
      borderColor: "FF93C5FD",
      fontSize: 11
    });
  });
};

const styleDataRow = (row, rowIndex) => {
  row.height = 23;

  row.eachCell((cell, columnNumber) => {
    const isEvenRow = rowIndex % 2 === 0;
    let fillColor = isEvenRow ? "FFFFFFFF" : "FFF8FAFC";
    let fontColor = "FF334155";
    let bold = false;

    if (columnNumber === 7) {
      fillColor = "FFF0FDF4";
      fontColor = "FF15803D";
      bold = true;
    }

    if (columnNumber === 8) {
      fillColor = "FFFFF7ED";
      fontColor = "FFC2410C";
      bold = true;
    }

    if (columnNumber === 9) {
      fillColor = "FFFEFCE8";
      fontColor = "FFA16207";
      bold = true;
    }

    if (columnNumber === 10) {
      fillColor = "FFFEF2F2";
      fontColor = "FFB91C1C";
      bold = true;
    }

    if (columnNumber === 12) {
      fillColor = "FFEFF6FF";
      fontColor = "FF1D4ED8";
      bold = true;
    }

    if (columnNumber === 13) {
      fillColor = "FFFDF2F8";
      fontColor = "FFBE185D";
      bold = true;
    }

    applyCellBaseStyle(cell, {
      bold,
      fontColor,
      fillColor,
      borderColor: "FFE2E8F0",
      fontSize: 10.5,
      wrapText: true
    });
  });
};

const exportExcel = async () => {
  if (!canExport.value || exportingExcel.value) return;

  exportingExcel.value = true;

  try {
    const workbook = new ExcelJS.Workbook();

    workbook.creator = "RIS School Management System";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Attendance Report", {
      properties: {
        defaultRowHeight: 22
      }
    });

    worksheet.columns = [
      { header: "ល.រ", key: "no", width: 7 },
      { header: "អត្តសញ្ញាណ", key: "studentId", width: 14 },
      { header: "ឈ្មោះខ្មែរ", key: "khmerName", width: 20 },
      { header: "ឈ្មោះឡាតាំង", key: "englishName", width: 20 },
      { header: "ភេទ", key: "gender", width: 8 },
      { header: "ថ្នាក់", key: "className", width: 15 },
      { header: "វត្តមាន", key: "present", width: 10 },
      { header: "យឺត", key: "late", width: 9 },
      { header: "ច្បាប់", key: "permission", width: 9 },
      { header: "អវត្តមាន", key: "absent", width: 11 },
      { header: "សរុបថ្ងៃ", key: "totalDays", width: 11 },
      { header: "ភាគរយ", key: "percentage", width: 10 }
    ];

    const lastColumnLetter = worksheet.getColumn(worksheet.columnCount).letter;

    worksheet.spliceRows(
      1,
      0,
      ["របាយការណ៍លម្អិតនៃការវត្តមានសិស្ស"],
      [`ថ្នាក់រៀន: ${getSelectedClassName.value || "-"}`],
      [`រយៈពេល: ${selectedPeriodLabel.value}`],
      [`សិស្ស: ${selectedStudentLabel.value}`],
      [`បានបង្កើតនៅ: ${exportedAtLabel.value}`],
      []
    );

    [1, 2, 3, 4, 5].forEach((rowNumber) => {
      worksheet.mergeCells(`A${rowNumber}:${lastColumnLetter}${rowNumber}`);
    });

    worksheet.getRow(1).height = 28;
    worksheet.getRow(1).eachCell((cell) => {
      applyCellBaseStyle(cell, {
        bold: true,
        fontColor: "FF065F46",
        fillColor: "FFD1FAE5",
        borderColor: "FF6EE7B7",
        fontSize: 16
      });
    });

    [2, 3, 4, 5].forEach((rowNumber) => {
      const infoRow = worksheet.getRow(rowNumber);
      infoRow.height = 21;

      infoRow.eachCell((cell) => {
        applyCellBaseStyle(cell, {
          bold: true,
          fontColor: "FF334155",
          fillColor: "FFF8FAFC",
          borderColor: "FFE2E8F0",
          fontSize: 11
        });
      });
    });

    const headerRow = worksheet.getRow(7);
    styleHeaderRow(headerRow);

    reportData.value.forEach((row, index) => {
      const dataRow = worksheet.addRow({
        no: index + 1,
        studentId: row.student?.studentId || "",
        khmerName: row.student?.khmerName || "",
        englishName: row.student?.englishName || "",
        gender: row.student?.gender || "",
        className: getRowClassName(row),
        present: Number(row.present || 0),
        late: Number(row.late || 0),
        permission: Number(row.permission || 0),
        absent: Number(row.absent || 0),
        totalDays: Number(row.totalDays || 0),
        percentage: `${calculatePercentage(row.present, row.totalDays)}%`
      });

      styleDataRow(dataRow, index);
    });

    const totalRow = worksheet.addRow({
      className: "សរុប",
      present: summary.value.present,
      late: summary.value.late,
      permission: summary.value.permission,
      absent: summary.value.absent,
      totalDays: summary.value.totalDays,
      percentage: `${summary.value.averagePercentage}%`
    });

    totalRow.height = 24;

    totalRow.eachCell((cell, columnNumber) => {
      let fillColor = "FFF1F5F9";
      let fontColor = "FF0F172A";

      if (columnNumber === 7) {
        fillColor = "FFDCFCE7";
        fontColor = "FF15803D";
      }

      if (columnNumber === 8) {
        fillColor = "FFFFEDD5";
        fontColor = "FFC2410C";
      }

      if (columnNumber === 9) {
        fillColor = "FFFEF9C3";
        fontColor = "FFA16207";
      }

      if (columnNumber === 10) {
        fillColor = "FFFEE2E2";
        fontColor = "FFB91C1C";
      }

      if (columnNumber === 12) {
        fillColor = "FFDBEAFE";
        fontColor = "FF1D4ED8";
      }

      applyCellBaseStyle(cell, {
        bold: true,
        fontColor,
        fillColor,
        borderColor: "FFCBD5E1",
        fontSize: 11
      });
    });

    worksheet.views = [
      {
        state: "frozen",
        ySplit: 7
      }
    ];

    worksheet.autoFilter = {
      from: "A7",
      to: `${lastColumnLetter}7`
    };

    worksheet.pageSetup = {
      paperSize: 9,
      orientation: "landscape",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      margins: {
        left: 0.25,
        right: 0.25,
        top: 0.3,
        bottom: 0.3,
        header: 0.2,
        footer: 0.2
      }
    };

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = buildFileName("xlsx");

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);

    toast.success("បានទាញយក Excel ដោយជោគជ័យ");
  } catch (err) {
    console.error("Excel export error:", err);
    toast.error("មិនអាច Export Excel បានទេ");
  } finally {
    exportingExcel.value = false;
  }
};

const printReport = async () => {
  if (!canExport.value) {
    toast.error("សូមជ្រើសរើសថ្នាក់ និងមានទិន្នន័យរបាយការណ៍សិន");
    return;
  }

  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 100));

  document.body.classList.add("attendance-print-one-page");

  const removePrintMode = () => {
    document.body.classList.remove("attendance-print-one-page");
    window.removeEventListener("afterprint", removePrintMode);
  };

  window.addEventListener("afterprint", removePrintMode);
  window.print();

  setTimeout(removePrintMode, 1200);
};

const handleClickOutside = (event) => {
  if (
    studentSearchBox.value &&
    !studentSearchBox.value.contains(event.target)
  ) {
    showStudentDropdown.value = false;
  }
};

onMounted(() => {
  fetchClasses();
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.print-paper-wrap {
  display: none;
}

.form-label {
  display: block;
  font-size: 0.62rem;
  font-weight: 800;
  color: #64748b;
  margin-bottom: 0.2rem;
}

.form-input {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.36rem 0.55rem;
  font-size: 0.7rem;
  color: #334155;
  background: #ffffff;
  outline: none;
  min-height: 1.95rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  border-color: #10b981;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgb(16 185 129 / 0.12);
}

.search-icon {
  position: absolute;
  left: 0.72rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 0.68rem;
  pointer-events: none;
  z-index: 2;
}

.search-input {
  padding-left: 2.15rem !important;
  padding-right: 2rem !important;
}

.summary-card {
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 0.75rem;
  padding: 0.48rem 0.55rem;
  min-width: 0;
}

.summary-label {
  font-size: 0.58rem;
  font-weight: 800;
  color: #64748b;
  line-height: 1;
  white-space: nowrap;
}

.summary-value {
  font-size: 0.82rem;
  font-weight: 900;
  line-height: 1.2;
  margin-top: 0.18rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mobile-count-box {
  border-width: 1px;
  border-radius: 0.6rem;
  padding: 0.42rem 0.45rem;
  min-width: 0;
  text-align: center;
}

.mobile-count-label {
  font-size: 0.56rem;
  font-weight: 900;
  line-height: 1;
  white-space: nowrap;
}

.mobile-count-value {
  margin-top: 0.2rem;
  font-size: 0.86rem;
  font-weight: 900;
  line-height: 1.1;
}

.table-th {
  padding: 0.5rem 0.6rem;
  font-size: 0.68rem;
  font-weight: 900;
  color: #475569;
  border: 1px solid #e2e8f0;
  white-space: nowrap;
}

.table-td {
  padding: 0.5rem 0.6rem;
  border: 1px solid #f1f5f9;
  font-size: 0.7rem;
  vertical-align: middle;
}

.font-khmer {
  font-family: "Battambang", "Siemreap", "Kantumruy Pro", sans-serif;
}

.modal-scroll::-webkit-scrollbar {
  width: 4px;
}

.modal-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 999px;
}

.modal-scroll::-webkit-scrollbar-track {
  background: transparent;
}

@media (min-width: 640px) {
  .form-label {
    font-size: 0.68rem;
  }

  .form-input {
    padding: 0.44rem 0.6rem;
    font-size: 0.75rem;
    min-height: 2.25rem;
  }

  .summary-card {
    padding: 0.6rem 0.7rem;
  }

  .summary-label {
    font-size: 0.62rem;
  }

  .summary-value {
    font-size: 1rem;
  }
}
</style>

<style>
@media print {
  @page {
    size: A4 portrait;
    margin: 0;
  }

  html,
  body,
  #app {
    width: 794px !important;
    min-width: 794px !important;
    max-width: 794px !important;
    height: auto !important;
    min-height: 0 !important;
    max-height: none !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    background-color: rgb(255, 255, 255) !important;
  }

  body * {
    visibility: hidden !important;
  }

  .print-paper-wrap,
  .print-paper-wrap * {
    visibility: visible !important;
  }

  .print-paper-wrap {
    display: block !important;
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 794px !important;
    height: auto !important;
    min-width: 794px !important;
    min-height: 0 !important;
    max-width: 794px !important;
    max-height: none !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: visible !important;
    background-color: rgb(255, 255, 255) !important;
    z-index: 999999 !important;
  }

  .print-paper-wrap .paper,
  .print-paper-wrap .paper-page,
  .print-paper-wrap .pdf-page,
  .print-paper-wrap .print-page,
  .print-paper-wrap [data-pdf-page] {
    width: 794px !important;
    height: 1123px !important;
    min-width: 794px !important;
    min-height: 1123px !important;
    max-width: 794px !important;
    max-height: 1123px !important;
    margin: 0 !important;
    overflow: hidden !important;
    background-color: rgb(255, 255, 255) !important;
    break-after: avoid !important;
    page-break-after: avoid !important;
  }

  body.attendance-print-one-page .print-paper-wrap .paper:nth-of-type(n + 2),
  body.attendance-print-one-page .print-paper-wrap .paper-page:nth-of-type(n + 2),
  body.attendance-print-one-page .print-paper-wrap .pdf-page:nth-of-type(n + 2),
  body.attendance-print-one-page .print-paper-wrap .print-page:nth-of-type(n + 2),
  body.attendance-print-one-page .print-paper-wrap [data-pdf-page]:nth-of-type(n + 2) {
    display: none !important;
    visibility: hidden !important;
  }

  header,
  nav,
  aside,
  footer,
  .navbar,
  .sidebar,
  .main-header,
  .main-sidebar,
  .layout-header,
  .layout-sidebar,
  .app-header,
  .app-sidebar,
  .topbar,
  .side-menu,
  .print\:hidden {
    display: none !important;
    visibility: hidden !important;
  }

  .print\:block {
    display: block !important;
  }
}

/* PDF-only Khmer vertical alignment fix */
.paper.pdf-export-mode .cell-text {
  transform: translateY(-4px) !important;
  padding-bottom: 3px !important;
}

.paper.pdf-export-mode .report-table th .cell-text {
  transform: translateY(-2px) !important;
  padding-bottom: 2px !important;
}

.paper.pdf-export-mode .report-table tfoot .cell-text {
  transform: translateY(-4px) !important;
  padding-bottom: 3px !important;
}

.paper.pdf-export-mode .report-table {
  -webkit-font-smoothing: antialiased;
  text-rendering: geometricPrecision;
}
</style>