<template>
  <div class="score-report-page-mobile-safe bg-slate-50 p-2 sm:p-3 md:p-4 overflow-x-hidden">
    <div class="max-w-7xl mx-auto space-y-2.5">
      <!-- Header -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm px-3 py-2.5">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div class="min-w-0">
            <h2 class="text-base md:text-lg font-extrabold text-slate-800 flex items-start gap-2 leading-snug">
              <span class="h-7 w-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs">
                <i class="fa-solid fa-file-lines"></i>
              </span>

              <span class="break-words leading-snug">
                របាយការណ៍ពិន្ទុសិស្ស
              </span>
            </h2>

            <p class="text-[11px] text-slate-500 mt-0.5 break-words leading-snug">
              ជ្រើសរើសមុខវិជ្ជាច្រើន ដើម្បីបង្ហាញពិន្ទុ និងចំណាត់ថ្នាក់
            </p>
          </div>

          <div class="score-report-export-actions grid grid-cols-2 gap-2 w-full sm:flex sm:flex-wrap sm:items-center sm:w-auto">
            <button
              type="button"
              @click="exportPDF"
              :disabled="!canExport || exportingPdf"
              class="mobile-action-btn flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[11px] font-extrabold rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <i
                class="fa-solid text-[10px]"
                :class="exportingPdf ? 'fa-circle-notch fa-spin' : 'fa-file-pdf'"
              ></i>
              PDF
            </button>

            <button
              type="button"
              @click="exportExcel"
              :disabled="!canExport || exportingExcel"
              class="mobile-action-btn flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-[11px] font-extrabold rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <i
                class="fa-solid text-[10px]"
                :class="exportingExcel ? 'fa-circle-notch fa-spin' : 'fa-file-excel'"
              ></i>
              Excel
            </button>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-2.5">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_auto] gap-2 items-end">
          <div>
            <label class="form-label">ថ្នាក់រៀន</label>

            <select
              v-model="filters.classId"
              class="form-input"
            >
              <option
                value=""
                disabled
              >
                ជ្រើសរើសថ្នាក់...
              </option>

              <option
                v-for="cls in classesList"
                :key="cls._id"
                :value="cls._id"
              >
                {{ cls.className }} ({{ cls.timeStudy || "-" }})
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

            <select
              v-model="filters.month"
              class="form-input"
            >
              <option
                v-for="month in months"
                :key="month.value"
                :value="month.value"
              >
                {{ month.label }}
              </option>
            </select>
          </div>

          <button
            type="button"
            @click="generateReport"
            :disabled="!isFilterValid || loading"
            class="report-generate-btn w-full lg:w-auto flex justify-center items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-extrabold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition shadow-sm min-h-[1.95rem] whitespace-nowrap"
          >
            <i
              v-if="loading"
              class="fa-solid fa-circle-notch fa-spin text-[10px]"
            ></i>

            <i
              v-else
              class="fa-solid fa-magnifying-glass-chart text-[10px]"
            ></i>

            {{ loading ? "កំពុងដំណើរការ..." : "មើលរបាយការណ៍" }}
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

                <p class="text-[10px] text-slate-500 break-words leading-snug">
                  បានជ្រើសរើស {{ selectedSubjects.length }} មុខវិជ្ជា
                </p>
              </div>
            </div>

            <div class="subject-bulk-actions grid grid-cols-2 gap-1.5 w-full md:flex md:items-center md:w-auto md:shrink-0">
              <button
                type="button"
                @click="selectAllSubjects"
                class="subject-bulk-btn px-2.5 py-1 text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition whitespace-nowrap"
              >
                ជ្រើសទាំងអស់
              </button>

              <button
                type="button"
                @click="clearSubjects"
                class="subject-bulk-btn px-2.5 py-1 text-[10px] font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition whitespace-nowrap"
              >
                ដកទាំងអស់
              </button>
            </div>
          </div>

          <div class="subject-options-grid grid grid-cols-1 min-[380px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-1.5">
            <label
              v-for="subject in subjectsList"
              :key="subject._id"
              class="subject-option flex items-center gap-2 bg-white border rounded-lg px-2.5 py-2 cursor-pointer transition hover:border-blue-300 min-w-0"
              :class="
                filters.subjectIds.includes(subject._id)
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-slate-200'
              "
            >
              <input
                type="checkbox"
                :value="subject._id"
                v-model="filters.subjectIds"
                class="subject-checkbox h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 shrink-0"
              />

              <span class="subject-option-label text-[11px] font-bold text-slate-700 break-words leading-snug min-w-0">
                {{ subject.subjectName }}
              </span>
            </label>
          </div>
        </div>
      </div>

      <!-- Screen Report -->
      <div
        v-if="reportData.length > 0"
        class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
      >
        <div class="px-3 py-2.5 border-b border-slate-200 bg-slate-50">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div class="min-w-0">
              <h3 class="text-sm font-extrabold text-slate-800 break-words leading-snug">
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

                <p class="text-[11px] text-blue-600 font-bold break-words leading-snug max-w-[500px]">
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
        <div class="report-summary-grid grid grid-cols-2 md:grid-cols-4 gap-2 p-2.5 border-b border-slate-200 bg-white">
          <div class="bg-slate-50 px-2.5 py-2 rounded-lg border border-slate-200 flex items-center justify-between gap-2">
            <p class="text-[10px] text-slate-500 font-bold">
              សិស្សសរុប
            </p>

            <p class="text-base font-extrabold text-slate-800">
              {{ reportData.length }}
            </p>
          </div>

          <div class="bg-blue-50 px-2.5 py-2 rounded-lg border border-blue-100 flex items-center justify-between gap-2">
            <p class="text-[10px] text-blue-600 font-bold">
              មុខវិជ្ជា
            </p>

            <p class="text-base font-extrabold text-blue-700">
              {{ selectedSubjects.length }}
            </p>
          </div>

          <div class="bg-indigo-50 px-2.5 py-2 rounded-lg border border-indigo-100 flex items-center justify-between gap-2">
            <p class="text-[10px] text-indigo-600 font-bold">
              មធ្យមភាគ
            </p>

            <p class="text-base font-extrabold text-indigo-700">
              {{ classAverage }}
            </p>
          </div>

          <div class="bg-emerald-50 px-2.5 py-2 rounded-lg border border-emerald-100 flex items-center justify-between gap-2">
            <p class="text-[10px] text-emerald-600 font-bold">
              ជាប់/ធ្លាក់
            </p>

            <p class="text-base font-extrabold text-emerald-700">
              {{ passCount }}
              <span class="text-slate-400 text-xs">/</span>
              <span class="text-red-500">{{ failCount }}</span>
            </p>
          </div>
        </div>

        <!-- Table -->
        <div class="mobile-table-hint sm:hidden px-3 py-2 bg-blue-50 border-b border-blue-100 text-xs font-bold text-blue-700 flex items-center gap-2">
          <i class="fa-solid fa-arrows-left-right"></i>
          អូសតារាងទៅឆ្វេង ឬស្ដាំ ដើម្បីមើលពិន្ទុទាំងអស់
        </div>

        <div class="report-table-wrap overflow-x-auto overscroll-x-contain">
          <table class="report-table min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-100">
              <tr>
                <th class="table-th mobile-sticky-no text-center w-10">
                  ល.រ
                </th>

                <th class="table-th mobile-sticky-student text-left student-col">
                  ឈ្មោះសិស្ស
                </th>

                <th
                  v-for="subject in selectedSubjects"
                  :key="subject._id"
                  class="table-th text-center score-col"
                >
                  {{ subject.subjectName }}
                </th>

                <th class="table-th text-center avg-col">
                  មធ្យម
                </th>

                <th class="table-th text-center result-col">
                  លទ្ធផល
                </th>

                <th class="table-th text-center rank-col">
                  ចំណាត់ថ្នាក់
                </th>

                <th class="table-th text-left remark-col">
                  ផ្សេងៗ
                </th>
              </tr>
            </thead>

            <tbody class="bg-white divide-y divide-slate-200">
              <tr
                v-for="student in rankedReportData"
                :key="student._id || student.studentId"
                class="hover:bg-slate-50"
              >
                <td class="table-td mobile-sticky-no text-center text-slate-500">
                  {{ student.originalNo }}
                </td>

                <td class="table-td mobile-sticky-student font-bold text-slate-800 break-words leading-snug">
                  {{ student.khmerName || "-" }}
                </td>

                <td
                  v-for="subject in selectedSubjects"
                  :key="subject._id"
                  class="table-td text-center font-extrabold"
                  :class="getScoreClass(getSubjectScore(student, subject._id))"
                >
                  {{ getSubjectScore(student, subject._id) }}
                </td>

                <td
                  class="table-td text-center font-extrabold"
                  :class="getScoreClass(student.averageDisplay)"
                >
                  {{ student.averageDisplay }}
                </td>

                <td class="table-td text-center">
                  {{ student.resultDisplay }}
                </td>

                <td class="table-td text-center font-extrabold text-red-600">
                  {{ student.rankDisplay }}
                </td>

                <td class="table-td text-slate-500 break-words leading-snug">
                  {{ getStudentRemarks(student) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!loading && hasSearched"
        class="text-center py-8 bg-white rounded-xl border border-dashed border-slate-300"
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
        class="text-center py-8 bg-white rounded-xl border border-slate-200"
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

      <!-- Hidden PDF Formal Ranking Report -->
      <div class="pdf-paper-wrap">
        <div
          ref="pdfPaperRef"
          class="pdf-document"
        >
          <div
            v-for="(page, pageIndex) in pdfPages"
            :key="pageIndex"
            class="pdf-page"
          >
            <div class="formal-header">
              <div class="formal-logo-box">
                <img
                  :src="schoolLogoUrl"
                  alt="School Logo"
                  class="formal-logo"
                />
              </div>

              <div class="formal-title">
                <h2>ព្រះរាជាណាចក្រកម្ពុជា</h2>
                <h3>ជាតិ សាសនា ព្រះមហាក្សត្រ</h3>
                <h1>បញ្ជីរាយនាមលទ្ធផលប្រឡង</h1>

                <p>
                  សាលារៀនចំណេះទូទៅ
                  <strong>រ៉ូវ៉ាន អ៊ីនធឺណេសិនណល ស្គូល</strong>
                </p>

                <p>
                  ថ្នាក់៖ <strong>{{ selectedClassName }}</strong>
                  &nbsp;&nbsp;
                  ខែ៖ <strong>{{ selectedMonthLabel }}</strong>
                  &nbsp;&nbsp;
                  ឆ្នាំសិក្សា៖ <strong>{{ filters.academicYear }}</strong>
                </p>

                <p>
                  មុខវិជ្ជា៖ <strong>{{ selectedSubjectNames }}</strong>
                  &nbsp;&nbsp;
                  ទំព័រ៖ <strong>{{ pageIndex + 1 }}/{{ pdfPages.length }}</strong>
                </p>
              </div>

              <div></div>
            </div>

            <div class="formal-table-grid">
              <table class="formal-table">
                <thead>
                  <tr>
                    <th class="no-col">ល.រ</th>
                    <th class="name-col">គោត្តនាម និងនាម</th>
                    <th class="gender-col">ភេទ</th>
                    <th class="avg-col">មធ្យមភាគ</th>
                    <th class="rank-col">ចំណាត់ថ្នាក់</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="row in page.leftRows"
                    :key="`left-${pageIndex}-${row.slotNo}`"
                  >
                    <td class="no-text">{{ row.noText }}</td>
                    <td class="name-text">{{ row.nameText }}</td>
                    <td>{{ row.genderText }}</td>
                    <td class="avg-text">{{ row.averageText }}</td>
                    <td class="rank-text">{{ row.rankText }}</td>
                  </tr>
                </tbody>
              </table>

              <table class="formal-table">
                <thead>
                  <tr>
                    <th class="no-col">ល.រ</th>
                    <th class="name-col">គោត្តនាម និងនាម</th>
                    <th class="gender-col">ភេទ</th>
                    <th class="avg-col">មធ្យមភាគ</th>
                    <th class="rank-col">ចំណាត់ថ្នាក់</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="row in page.rightRows"
                    :key="`right-${pageIndex}-${row.slotNo}`"
                  >
                    <td class="no-text">{{ row.noText }}</td>
                    <td class="name-text">{{ row.nameText }}</td>
                    <td>{{ row.genderText }}</td>
                    <td class="avg-text">{{ row.averageText }}</td>
                    <td class="rank-text">{{ row.rankText }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              v-if="isLastPdfPage(pageIndex)"
              class="formal-bottom"
            >
              <div class="formal-lines">
                <p>
                  បញ្ជាក់ប្រឡងជាប់ចំនួន ............ នាក់ ក្នុងចំណោមសិស្ស ............ នាក់ សិស្សប្រុស ............
                </p>

                <p>
                  សិស្សប្រឡងធ្លាក់ចំនួន ............ នាក់ ក្នុងចំណោមសិស្ស ............ នាក់ សិស្សប្រុស ............
                </p>

                <p>
                  សិស្សអវត្តមានចំនួន ............ នាក់ ក្នុងចំណោមសិស្ស ............ នាក់ សិស្សប្រុស ............
                </p>
              </div>

              <div class="formal-date-row">
                <div class="formal-left-sign">
                  <p>បានឃើញ និងឯកភាព</p>
                  <p class="bold">នាយកសាលា</p>
                </div>

                <div class="formal-right-sign">
                  <p>
                    ថ្ងៃទី ០១ ខែ មករា ឆ្នាំ ២០២៦
                  </p>

                  <p class="bold">
                    អ្នកទទួលបន្ទុកថ្នាក់
                  </p>
                </div>
              </div>

              <div class="formal-name-row">
                <p class="bold">ឈ្មោះ ........................</p>
                <p class="bold">ឈ្មោះ ........................</p>
              </div>
            </div>

            <div
              v-else
              class="formal-next-page"
            >
              បន្តទំព័របន្ទាប់...
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from "vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ExcelJS from "exceljs";
import api from "../config/api";
import { useQuery } from "../hooks/useQuery";
import schoolLogoUrl from "../assets/logoRIS.jpg";

const { data: classes } = useQuery("classes");
const { data: subjects } = useQuery("subjects");

const loading = ref(false);
const hasSearched = ref(false);
const reportData = ref([]);
const exportingPdf = ref(false);
const exportingExcel = ref(false);
const pdfPaperRef = ref(null);

const originalViewportContent = ref("");
const viewportMetaWasCreated = ref(false);

const setNoZoomViewport = () => {
  if (typeof document === "undefined") return;

  let viewportMeta = document.querySelector('meta[name="viewport"]');

  if (!viewportMeta) {
    viewportMeta = document.createElement("meta");
    viewportMeta.setAttribute("name", "viewport");
    document.head.appendChild(viewportMeta);
    viewportMetaWasCreated.value = true;
  } else if (!originalViewportContent.value) {
    viewportMetaWasCreated.value = false;
    originalViewportContent.value = viewportMeta.getAttribute("content") || "";
  }

  viewportMeta.setAttribute(
    "content",
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
  );
};

const restoreViewport = () => {
  if (typeof document === "undefined") return;

  const viewportMeta = document.querySelector('meta[name="viewport"]');

  if (!viewportMeta) return;

  if (viewportMetaWasCreated.value) {
    viewportMeta.remove();
    return;
  }

  viewportMeta.setAttribute(
    "content",
    originalViewportContent.value || "width=device-width, initial-scale=1"
  );
};

const months = [
  { value: "January", label: "មករា" },
  { value: "February", label: "កុម្ភៈ" },
  { value: "March", label: "មីនា" },
  { value: "April", label: "មេសា" },
  { value: "May", label: "ឧសភា" },
  { value: "June", label: "មិថុនា" },
  { value: "July", label: "កក្កដា" },
  { value: "August", label: "សីហា" },
  { value: "September", label: "កញ្ញា" },
  { value: "October", label: "តុលា" },
  { value: "November", label: "វិច្ឆិកា" },
  { value: "December", label: "ធ្នូ" }
];

const getCurrentAcademicYear = () => {
  const currentYear = new Date().getFullYear();
  return `${currentYear}-${currentYear + 1}`;
};

const getCurrentMonthValue = () => {
  const currentMonthIndex = new Date().getMonth();
  return months[currentMonthIndex]?.value || "January";
};

const filters = ref({
  classId: "",
  subjectIds: [],
  academicYear: getCurrentAcademicYear(),
  month: getCurrentMonthValue()
});

const khmerDigitMap = {
  0: "០",
  1: "១",
  2: "២",
  3: "៣",
  4: "៤",
  5: "៥",
  6: "៦",
  7: "៧",
  8: "៨",
  9: "៩"
};

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
  return subjectsList.value.filter((subject) => {
    return filters.value.subjectIds.includes(subject._id);
  });
});

const selectedSubjectNames = computed(() => {
  if (selectedSubjects.value.length === 0) return "-";
  return selectedSubjects.value.map((subject) => subject.subjectName).join(", ");
});

const isFilterValid = computed(() => {
  return (
    filters.value.classId &&
    filters.value.subjectIds.length > 0 &&
    filters.value.academicYear
  );
});

const canExport = computed(() => {
  return reportData.value.length > 0 && selectedSubjects.value.length > 0;
});

const selectedClassName = computed(() => {
  const foundClass = classesList.value.find((classItem) => {
    return String(classItem._id) === String(filters.value.classId);
  });

  return foundClass ? foundClass.className : "";
});

const selectedMonthLabel = computed(() => {
  const month = months.find((monthItem) => monthItem.value === filters.value.month);
  return month ? month.label : filters.value.month;
});

const selectAllSubjects = () => {
  filters.value.subjectIds = subjectsList.value.map((subject) => subject._id);
};

const clearSubjects = () => {
  filters.value.subjectIds = [];
};

const toKhmerNumber = (value) => {
  return String(value).replace(/[0-9]/g, (digit) => khmerDigitMap[digit] || digit);
};

const formatSlotNo = (value) => {
  return toKhmerNumber(String(value).padStart(2, "0"));
};

const formatScoreNumber = (value) => {
  if (value === null || value === undefined || value === "N/A") return "";

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) return "";

  const rounded = Math.round(numberValue * 100) / 100;
  const text = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2).replace(/\.?0+$/, "");

  return toKhmerNumber(text);
};

const normalizeGender = (gender) => {
  const value = String(gender || "").toLowerCase();

  if (["male", "m", "ប្រុស", "ប"].includes(value)) return "ប្រុស";
  if (["female", "f", "ស្រី", "ស"].includes(value)) return "ស្រី";

  return gender || "";
};

const getSubjectScore = (student, subjectId) => {
  return student.subjectScores?.[subjectId] ?? "N/A";
};

const getStudentAverage = (student) => {
  const scores = selectedSubjects.value
    .map((subject) => getSubjectScore(student, subject._id))
    .filter((score) => score !== "N/A" && score !== "" && !Number.isNaN(Number(score)))
    .map(Number);

  if (scores.length === 0) return "N/A";

  const total = scores.reduce((sum, score) => sum + score, 0);
  return (total / scores.length).toFixed(2);
};

const getStudentAverageNumber = (student) => {
  const average = getStudentAverage(student);

  if (average === "N/A") return null;

  const numberValue = Number(average);

  if (Number.isNaN(numberValue)) return null;

  return numberValue;
};

const getStudentResult = (student) => {
  const average = getStudentAverage(student);

  if (average === "N/A") return "-";
  return Number(average) >= 50 ? "ជាប់" : "ធ្លាក់";
};

const getStudentRemarks = (student) => {
  const remarks = Object.values(student.subjectRemarks || {}).filter(Boolean);
  return remarks.length ? remarks.join(", ") : "-";
};

const classAverage = computed(() => {
  const averages = reportData.value
    .map((student) => getStudentAverage(student))
    .filter((average) => average !== "N/A")
    .map(Number);

  if (averages.length === 0) return "0.00";

  const total = averages.reduce((sum, average) => sum + average, 0);
  return (total / averages.length).toFixed(2);
});

const passCount = computed(() => {
  return reportData.value.filter((student) => {
    const average = getStudentAverage(student);
    return average !== "N/A" && Number(average) >= 50;
  }).length;
});

const failCount = computed(() => {
  return reportData.value.filter((student) => {
    const average = getStudentAverage(student);
    return average !== "N/A" && Number(average) < 50;
  }).length;
});

const rankedReportData = computed(() => {
  const rows = reportData.value.map((student, index) => {
    const averageNumber = getStudentAverageNumber(student);

    return {
      ...student,
      originalNo: index + 1,
      averageNumber,
      averageDisplay: averageNumber === null ? "N/A" : formatScoreNumber(averageNumber),
      resultDisplay: getStudentResult(student),
      rankNumber: null,
      rankDisplay: ""
    };
  });

  rows.sort((a, b) => {
    if (a.averageNumber === null && b.averageNumber === null) return a.originalNo - b.originalNo;
    if (a.averageNumber === null) return 1;
    if (b.averageNumber === null) return -1;
    if (b.averageNumber !== a.averageNumber) return b.averageNumber - a.averageNumber;
    return a.originalNo - b.originalNo;
  });

  let previousAverage = null;
  let previousRank = 0;

  rows.forEach((row, index) => {
    if (row.averageNumber === null) {
      row.rankNumber = null;
      row.rankDisplay = "";
      return;
    }

    if (previousAverage !== null && row.averageNumber === previousAverage) {
      row.rankNumber = previousRank;
    } else {
      row.rankNumber = index + 1;
      previousRank = row.rankNumber;
      previousAverage = row.averageNumber;
    }

    row.rankDisplay = toKhmerNumber(row.rankNumber);
  });

  return rows;
});

const pdfPages = computed(() => {
  const rowsPerPage = 40;
  const rowsPerSide = 20;
  const rows = rankedReportData.value;
  const pages = [];

  if (rows.length === 0) return [];

  for (let start = 0; start < rows.length; start += rowsPerPage) {
    const pageRows = rows.slice(start, start + rowsPerPage);

    const buildSideRows = (sideStart) => {
      return Array.from({ length: rowsPerSide }, (_, index) => {
        const slotNo = start + sideStart + index + 1;
        const student = pageRows[sideStart + index];

        if (!student) {
          return {
            slotNo,
            noText: formatSlotNo(slotNo),
            nameText: "",
            genderText: "",
            averageText: "",
            rankText: ""
          };
        }

        return {
          slotNo,
          noText: formatSlotNo(slotNo),
          nameText: student.khmerName || "",
          genderText: normalizeGender(student.gender),
          averageText: student.averageDisplay === "N/A" ? "" : student.averageDisplay,
          rankText: student.rankDisplay
        };
      });
    };

    pages.push({
      leftRows: buildSideRows(0),
      rightRows: buildSideRows(rowsPerSide)
    });
  }

  return pages;
});

const getScoreClass = (score) => {
  if (score === "N/A") return "text-slate-400";
  if (Number(score) < 50) return "text-red-600";
  return "text-blue-600";
};

const generateReport = async () => {
  if (!isFilterValid.value) return;

  loading.value = true;
  hasSearched.value = true;
  reportData.value = [];

  try {
    const selectedClassObj = classesList.value.find((classItem) => {
      return String(classItem._id) === String(filters.value.classId);
    });

    const enrolledStudentIds = (selectedClassObj?.students || []).map((student) => {
      return String(student._id || student);
    });

    const [studentsRes, ...scoreResponses] = await Promise.all([
      api.get("/students"),
      ...filters.value.subjectIds.map((subjectId) => {
        return api.get("/scores", {
          params: {
            classId: filters.value.classId,
            subjectId,
            academicYear: filters.value.academicYear,
            month: filters.value.month
          }
        });
      })
    ]);

    const allStudents = normalizeArray(studentsRes.data);

    const classStudents = allStudents.filter((student) => {
      return enrolledStudentIds.includes(String(student._id));
    });

    const scoresBySubject = {};

    filters.value.subjectIds.forEach((subjectId, index) => {
      scoresBySubject[subjectId] = normalizeArray(scoreResponses[index]?.data);
    });

    reportData.value = classStudents.map((student) => {
      const subjectScores = {};
      const subjectRemarks = {};

      filters.value.subjectIds.forEach((subjectId) => {
        const foundScore = scoresBySubject[subjectId].find((scoreItem) => {
          const studentId = scoreItem.studentId?._id || scoreItem.studentId;
          return String(studentId) === String(student._id);
        });

        subjectScores[subjectId] = foundScore ? foundScore.score : "N/A";
        subjectRemarks[subjectId] = foundScore ? foundScore.remark : "";
      });

      return {
        _id: student._id,
        studentId: student.studentId || student.idCode || student._id,
        khmerName: student.khmerName,
        englishName: student.englishName || "",
        gender: student.gender || "",
        subjectScores,
        subjectRemarks
      };
    });
  } catch (error) {
    console.error("Error generating report:", error);
  } finally {
    loading.value = false;
  }
};

const buildFileName = (extension) => {
  const safeClassName = (selectedClassName.value || "score-report").replace(/[\\/:*?"<>|]/g, "-");
  const safeYear = String(filters.value.academicYear || "year").replace(/[\\/:*?"<>|]/g, "-");
  const safeMonth = String(filters.value.month || "month").replace(/[\\/:*?"<>|]/g, "-");

  return `score-rank-report-${safeClassName}-${safeMonth}-${safeYear}.${extension}`;
};

const isLastPdfPage = (pageIndex) => {
  return pageIndex === pdfPages.value.length - 1;
};

const exportPDF = async () => {
  if (!canExport.value || exportingPdf.value) return;

  exportingPdf.value = true;

  try {
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 250));

    const element = pdfPaperRef.value;

    if (!element) return;

    const wrapper = element.closest(".pdf-paper-wrap");

    const originalWrapperStyle = wrapper
      ? {
          display: wrapper.style.display,
          position: wrapper.style.position,
          left: wrapper.style.left,
          top: wrapper.style.top,
          width: wrapper.style.width,
          height: wrapper.style.height,
          overflow: wrapper.style.overflow,
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
        wrapper.style.zIndex = "-1";
      }

      element.style.width = "794px";
      element.style.height = "auto";
      element.style.minHeight = "1123px";
      element.style.maxHeight = "none";
      element.style.overflow = "visible";
      element.style.transform = "none";
      element.style.transformOrigin = "top left";

      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 250));

      const pages = Array.from(element.querySelectorAll(".pdf-page"));

      if (pages.length === 0) return;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let pageIndex = 0; pageIndex < pages.length; pageIndex += 1) {
        const pageElement = pages[pageIndex];

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
          logging: false
        });

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
    } finally {
      if (wrapper && originalWrapperStyle) {
        wrapper.style.display = originalWrapperStyle.display;
        wrapper.style.position = originalWrapperStyle.position;
        wrapper.style.left = originalWrapperStyle.left;
        wrapper.style.top = originalWrapperStyle.top;
        wrapper.style.width = originalWrapperStyle.width;
        wrapper.style.height = originalWrapperStyle.height;
        wrapper.style.overflow = originalWrapperStyle.overflow;
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
  } catch (error) {
    console.error("PDF export error:", error);
  } finally {
    exportingPdf.value = false;
  }
};

const exportExcel = async () => {
  if (!canExport.value || exportingExcel.value) return;

  exportingExcel.value = true;

  const excelFontName = "Khmer OS Battambang";
  const titleFill = "FFEFF6FF";
  const metaFill = "FFF8FAFC";
  const headerFill = "FFDBEAFE";
  const borderColor = "FFCBD5E1";
  const textColor = "FF334155";
  const blueColor = "FF1D4ED8";
  const purpleColor = "FF7C3AED";
  const redColor = "FFDC2626";
  const greenColor = "FF15803D";

  const getColumnLetter = (columnNumber) => {
    let letter = "";
    let value = columnNumber;

    while (value > 0) {
      const remainder = (value - 1) % 26;
      letter = String.fromCharCode(65 + remainder) + letter;
      value = Math.floor((value - 1) / 26);
    }

    return letter;
  };

  const applyBorder = (cell, color = borderColor) => {
    cell.border = {
      top: { style: "thin", color: { argb: color } },
      left: { style: "thin", color: { argb: color } },
      bottom: { style: "thin", color: { argb: color } },
      right: { style: "thin", color: { argb: color } }
    };
  };

  const applyBaseFont = (cell, options = {}) => {
    cell.font = {
      name: excelFontName,
      size: options.size || 11,
      bold: options.bold || false,
      color: { argb: options.color || textColor }
    };
  };

  const applyCenter = (cell, options = {}) => {
    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: options.wrapText !== false,
      shrinkToFit: options.shrinkToFit === true
    };
  };

  const getScoreFontColor = (value) => {
    const score = Number(value);

    if (Number.isNaN(score)) return textColor;
    if (score < 50) return redColor;

    return blueColor;
  };

  const getResultFill = (result) => {
    if (result === "ជាប់") return "FFDCFCE7";
    if (result === "ធ្លាក់") return "FFFEE2E2";

    return "FFF1F5F9";
  };

  const getResultFont = (result) => {
    if (result === "ជាប់") return greenColor;
    if (result === "ធ្លាក់") return redColor;

    return textColor;
  };

  try {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "RIS School Management System";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Score Report", {
      views: [{ state: "frozen", ySplit: 7 }]
    });

    worksheet.properties.defaultRowHeight = 24;

    const subjectColumns = selectedSubjects.value.map((subject, index) => {
      return {
        header: subject.subjectName,
        key: `subject_${index}`,
        width: 12
      };
    });

    worksheet.columns = [
      { header: "ល.រ", key: "no", width: 7 },
      { header: "ឈ្មោះខ្មែរ", key: "khmerName", width: 21 },
      { header: "ឈ្មោះឡាតាំង", key: "englishName", width: 21 },
      { header: "ភេទ", key: "gender", width: 8 },
      { header: "អត្តលេខ", key: "studentId", width: 14 },
      ...subjectColumns,
      { header: "មធ្យម", key: "average", width: 11 },
      { header: "ចំណាត់ថ្នាក់", key: "rank", width: 12 },
      { header: "លទ្ធផល", key: "result", width: 11 },
      { header: "ផ្សេងៗ", key: "remarks", width: 22 }
    ];

    const lastColumnNumber = worksheet.columnCount;
    const lastColumnLetter = getColumnLetter(lastColumnNumber);
    const subjectStartColumn = 6;
    const subjectEndColumn = subjectStartColumn + selectedSubjects.value.length - 1;
    const averageColumn = subjectEndColumn + 1;
    const rankColumn = averageColumn + 1;
    const resultColumn = rankColumn + 1;
    const remarksColumn = resultColumn + 1;

    worksheet.spliceRows(
      1,
      0,
      ["របាយការណ៍ពិន្ទុសិស្ស"],
      [`ថ្នាក់រៀន: ${selectedClassName.value || "-"}`],
      [`ខែ: ${selectedMonthLabel.value}`],
      [`ឆ្នាំសិក្សា: ${filters.value.academicYear}`],
      [`មុខវិជ្ជា: ${selectedSubjectNames.value}`],
      []
    );

    worksheet.mergeCells(`A1:${lastColumnLetter}1`);

    for (let rowIndex = 2; rowIndex <= 5; rowIndex += 1) {
      worksheet.mergeCells(`A${rowIndex}:${lastColumnLetter}${rowIndex}`);
    }

    worksheet.getRow(1).height = 28;
    worksheet.getRow(2).height = 22;
    worksheet.getRow(3).height = 22;
    worksheet.getRow(4).height = 22;
    worksheet.getRow(5).height = 22;
    worksheet.getRow(6).height = 7;

    const titleCell = worksheet.getCell("A1");
    applyBaseFont(titleCell, { bold: true, size: 16, color: blueColor });
    applyCenter(titleCell, { wrapText: true });
    titleCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: titleFill }
    };
    applyBorder(titleCell, "FFBFDBFE");

    for (let rowIndex = 2; rowIndex <= 5; rowIndex += 1) {
      const metaCell = worksheet.getCell(`A${rowIndex}`);
      applyBaseFont(metaCell, { bold: true, size: 11, color: textColor });
      applyCenter(metaCell, { wrapText: true });
      metaCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: metaFill }
      };
      applyBorder(metaCell, "FFE2E8F0");
    }

    const headerRow = worksheet.getRow(7);
    headerRow.height = 30;

    headerRow.eachCell((cell) => {
      applyBaseFont(cell, { bold: true, size: 11, color: "FF1E3A8A" });
      applyCenter(cell, { wrapText: true, shrinkToFit: true });
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: headerFill }
      };
      applyBorder(cell, "FF93C5FD");
    });

    rankedReportData.value.forEach((student, index) => {
      const rowPayload = {
        no: index + 1,
        khmerName: student.khmerName || "",
        englishName: student.englishName || "",
        gender: normalizeGender(student.gender),
        studentId: student.studentId || "",
        average: student.averageNumber === null ? "" : student.averageNumber,
        rank: student.rankNumber || "",
        result: student.resultDisplay,
        remarks: getStudentRemarks(student)
      };

      selectedSubjects.value.forEach((subject, subjectIndex) => {
        const score = getSubjectScore(student, subject._id);
        rowPayload[`subject_${subjectIndex}`] = score === "N/A" ? "" : Number(score);
      });

      const dataRow = worksheet.addRow(rowPayload);
      const longestTextLength = Math.max(
        String(rowPayload.khmerName || "").length,
        String(rowPayload.englishName || "").length,
        String(rowPayload.remarks || "").length
      );

      dataRow.height = longestTextLength > 28 ? 34 : longestTextLength > 16 ? 28 : 24;

      dataRow.eachCell((cell) => {
        applyBaseFont(cell, { size: 11, color: textColor });
        applyCenter(cell, { wrapText: true, shrinkToFit: true });
        applyBorder(cell);

        if (index % 2 === 1) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF8FAFC" }
          };
        }
      });


      for (let columnIndex = subjectStartColumn; columnIndex <= subjectEndColumn; columnIndex += 1) {
        const scoreCell = dataRow.getCell(columnIndex);
        scoreCell.numFmt = "0.##";
        applyBaseFont(scoreCell, {
          bold: true,
          size: 11,
          color: getScoreFontColor(scoreCell.value)
        });
      }

      const averageCell = dataRow.getCell(averageColumn);
      averageCell.numFmt = "0.##";
      applyBaseFont(averageCell, { bold: true, size: 11, color: purpleColor });

      const rankCell = dataRow.getCell(rankColumn);
      applyBaseFont(rankCell, { bold: true, size: 11, color: redColor });

      const resultCell = dataRow.getCell(resultColumn);
      applyBaseFont(resultCell, {
        bold: true,
        size: 11,
        color: getResultFont(student.resultDisplay)
      });
      resultCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: getResultFill(student.resultDisplay) }
      };
    });

    const summaryRow = worksheet.addRow({
      studentId: "សរុប",
      average: classAverage.value,
      result: ` ${passCount.value} /  ${failCount.value}`
    });

    summaryRow.height = 26;

    summaryRow.eachCell((cell) => {
      applyBaseFont(cell, { bold: true, size: 11, color: textColor });
      applyCenter(cell, { wrapText: true, shrinkToFit: true });
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF1F5F9" }
      };
      applyBorder(cell, borderColor);
    });

    const summaryAverageCell = summaryRow.getCell(averageColumn);
    summaryAverageCell.numFmt = "0.##";
    applyBaseFont(summaryAverageCell, { bold: true, size: 11, color: purpleColor });

    const summaryResultCell = summaryRow.getCell(resultColumn);
    applyBaseFont(summaryResultCell, { bold: true, size: 11, color: greenColor });
    summaryResultCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFDCFCE7" }
    };

    for (let columnIndex = 1; columnIndex <= lastColumnNumber; columnIndex += 1) {
      worksheet.getColumn(columnIndex).alignment = {
        vertical: "middle"
      };
    }

    worksheet.getColumn(1).width = 7;
    worksheet.getColumn(2).width = 21;
    worksheet.getColumn(3).width = 21;
    worksheet.getColumn(4).width = 8;
    worksheet.getColumn(5).width = 14;

    for (let columnIndex = subjectStartColumn; columnIndex <= subjectEndColumn; columnIndex += 1) {
      worksheet.getColumn(columnIndex).width = 12;
    }

    worksheet.getColumn(averageColumn).width = 11;
    worksheet.getColumn(rankColumn).width = 12;
    worksheet.getColumn(resultColumn).width = 11;
    worksheet.getColumn(remarksColumn).width = 22;

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber >= 7) {
        row.eachCell((cell) => {
          applyCenter(cell, { wrapText: true, shrinkToFit: true });
        });
      }
    });

    worksheet.pageSetup = {
      paperSize: 9,
      orientation: "landscape",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      horizontalCentered: true,
      margins: {
        left: 0.25,
        right: 0.25,
        top: 0.35,
        bottom: 0.35,
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
  } catch (error) {
    console.error("Excel export error:", error);
  } finally {
    exportingExcel.value = false;
  }
};

onMounted(() => {
  setNoZoomViewport();
});

onBeforeUnmount(() => {
  restoreViewport();
});
</script>

<style scoped>

.score-report-page-mobile-safe {
  font-family: "Noto Sans Khmer", "Khmer OS Battambang", "Battambang", "Khmer OS", system-ui, sans-serif;
  line-height: 1.45;
}

.score-report-page-mobile-safe h2,
.score-report-page-mobile-safe h3,
.score-report-page-mobile-safe p,
.score-report-page-mobile-safe span,
.score-report-page-mobile-safe label,
.score-report-page-mobile-safe button,
.score-report-page-mobile-safe th,
.score-report-page-mobile-safe td {
  line-height: 1.45;
}

.score-report-page-mobile-safe .break-words {
  overflow-wrap: anywhere;
  word-break: break-word;
}

.score-report-page-mobile-safe input:not([type="checkbox"]):not([type="radio"]),
.score-report-page-mobile-safe select,
.score-report-page-mobile-safe textarea,
.score-report-page-mobile-safe option,
.score-report-page-mobile-safe input::placeholder {
  font-family: "Noto Sans Khmer", "Khmer OS Battambang", "Battambang", "Khmer OS", system-ui, sans-serif !important;
  font-size: 14px !important;
  line-height: 1.45 !important;
  font-weight: 500;
  -webkit-font-smoothing: antialiased;
  text-rendering: geometricPrecision;
}

.score-report-page-mobile-safe input:not([type="checkbox"]):not([type="radio"]),
.score-report-page-mobile-safe select {
  min-height: 35px !important;
  height: 35px !important;
  padding: 0 0.625rem !important;
  overflow: visible !important;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 800;
  color: #64748b;
  margin-bottom: 0.3rem;
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
}

.form-input {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 0.45rem;
  padding: 0 0.625rem;
  font-size: 14px;
  line-height: 1.45;
  color: #334155;
  background: #ffffff;
  outline: none;
  min-height: 35px;
  height: 35px;
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
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.table-td {
  padding: 0.42rem 0.55rem;
  border: 1px solid #f1f5f9;
  font-size: 0.68rem;
  vertical-align: middle;
}

.pdf-paper-wrap {
  position: fixed;
  left: -99999px;
  top: 0;
  display: block;
  width: 794px;
  height: auto;
  min-height: 1123px;
  overflow: visible;
  background-color: rgb(255, 255, 255);
  z-index: -1;
  pointer-events: none;
}

.pdf-document {
  width: 794px;
  height: auto;
  min-height: 1123px;
  overflow: visible;
  background-color: rgb(255, 255, 255);
  color: rgb(0, 0, 0);
  font-family: "Khmer OS Muol Light", "Khmer OS Battambang", "Noto Sans Khmer", Arial, sans-serif;
}

.pdf-page {
  width: 794px;
  height: 1123px;
  min-height: 1123px;
  max-height: 1123px;
  box-sizing: border-box;
  padding: 14px 12px 12px;
  overflow: hidden;
  background-color: rgb(255, 255, 255);
}

.formal-header {
  display: grid;
  grid-template-columns: 130px 1fr 130px;
  align-items: start;
  margin-bottom: 5px;
}

.formal-logo-box {
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.formal-logo {
  width: 100px;
  height: 100px;
  object-fit: contain;
}

.formal-title {
  text-align: center;
  color: #111111;
}

.formal-title h2 {
  margin: 4px 0 0;
  font-size: 18px;
  line-height: 1.25;
  font-weight: 900;
}

.formal-title h3 {
  margin: 2px 0 0;
  font-size: 16px;
  line-height: 1.25;
  font-weight: 900;
}

.formal-title h1 {
  margin: 4px 0 2px;
  font-size: 15px;
  line-height: 1.25;
  font-weight: 900;
}

.formal-title p {
  margin: 2px 0;
  font-family: "Khmer OS Battambang", "Noto Sans Khmer", Arial, sans-serif;
  font-size: 12px;
  line-height: 1.25;
  font-weight: 700;
}

.formal-table-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  width: 100%;
  margin-top: 4px;
}

.formal-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  font-family: "Khmer OS Battambang", "Noto Sans Khmer", Arial, sans-serif;
  font-size: 13px;
  color: #111111;
}

.formal-table th,
.formal-table td {
  border: 1px solid #555555;
  height: 28px;
  line-height: 1.32;
  padding: 0 3px;
  text-align: center;
  vertical-align: middle;
  box-sizing: border-box;
  overflow: hidden;
}

.formal-table th {
  height: 32px;
  font-weight: 900;
  background-color: #ffffff;
}

.no-col {
  width: 39px;
}

.name-col {
  width: 125px;
}

.gender-col {
  width: 42px;
}

.avg-col {
  width: 70px;
}

.rank-col {
  width: 80px;
}

.no-text {
  color: #0e9cc0;
  font-weight: 900;
}

.name-text {
  text-align: center !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: 700;
}

.avg-text {
  color: #7c3a98;
  font-weight: 900;
}

.rank-text {
  color: #df2228;
  font-weight: 900;
}

.formal-bottom {
  margin-top: 8px;
  font-family: "Khmer OS Battambang", "Noto Sans Khmer", Arial, sans-serif;
  font-size: 12px;
  line-height: 1.5;
}

.formal-lines {
  text-align: right;
  padding-right: 8px;
}

.formal-lines p {
  margin: 2px 0;
}

.formal-date-row {
  margin-top: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  text-align: center;
}

.formal-date-row p {
  margin: 2px 0;
}

.formal-name-row {
  margin-top: 22px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  text-align: center;
  font-size: 14px;
}

.formal-name-row p {
  margin: 0;
}

.formal-next-page {
  margin-top: 14px;
  text-align: center;
  font-family: "Khmer OS Battambang", "Noto Sans Khmer", Arial, sans-serif;
  font-size: 11px;
  color: #64748b;
}

.bold {
  font-weight: 900;
}

@media (max-width: 640px) {
  .score-report-page-mobile-safe {
    padding-bottom: calc(2.75rem + env(safe-area-inset-bottom));
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }

  .score-report-page-mobile-safe > .max-w-7xl {
    padding-bottom: calc(1.5rem + env(safe-area-inset-bottom));
  }

  .score-report-page-mobile-safe h2 {
    font-size: 16px;
  }

  .score-report-export-actions,
  .subject-bulk-actions {
    width: 100%;
  }

  .mobile-action-btn,
  .report-generate-btn,
  .subject-bulk-btn {
    min-height: 35px;
    font-size: 14px !important;
    line-height: 1.35 !important;
  }

  .subject-option {
    min-height: 42px;
  }

  .subject-option-label {
    font-size: 13px !important;
  }

  .subject-checkbox {
    width: 16px !important;
    height: 16px !important;
    min-height: 16px !important;
    padding: 0 !important;
  }

  .report-summary-grid > div {
    min-height: 60px;
    padding: 0.65rem;
    align-items: center;
  }

  .report-summary-grid > div > p:first-child {
    font-size: 12px !important;
  }

  .report-summary-grid > div > p:last-child {
    font-size: 18px !important;
  }

  .mobile-table-hint {
    font-size: 12px;
    line-height: 1.45;
  }

  .score-report-page-mobile-safe .report-table-wrap {
    margin-bottom: calc(1.25rem + env(safe-area-inset-bottom));
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
  }

  .report-table-wrap::-webkit-scrollbar {
    height: 6px;
  }

  .report-table-wrap::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 999px;
  }

  .report-table {
    width: max-content;
    min-width: 100%;
  }

  .report-table .table-th,
  .report-table .table-td {
    white-space: nowrap;
    font-size: 12px;
  }

  .report-table .score-col {
    min-width: 76px;
  }

  .report-table .avg-col {
    min-width: 72px;
  }

  .report-table .result-col {
    min-width: 76px;
  }

  .report-table .rank-col {
    min-width: 88px;
  }

  .report-table .remark-col {
    min-width: 150px;
    white-space: normal;
  }

  .mobile-sticky-no {
    position: sticky;
    left: 0;
    z-index: 4;
    min-width: 44px;
    width: 44px;
    background: #ffffff;
  }

  .mobile-sticky-student {
    position: sticky;
    left: 44px;
    z-index: 3;
    min-width: 145px;
    max-width: 165px;
    white-space: normal !important;
    background: #ffffff;
    box-shadow: 5px 0 8px -7px rgb(15 23 42 / 0.45);
  }

  thead .mobile-sticky-no,
  thead .mobile-sticky-student {
    z-index: 7;
    background: #f1f5f9;
  }

  tbody tr:hover .mobile-sticky-no,
  tbody tr:hover .mobile-sticky-student {
    background: #f8fafc;
  }
}

@media (min-width: 640px) {
  .score-report-page-mobile-safe input:not([type="checkbox"]):not([type="radio"]),
  .score-report-page-mobile-safe select {
    min-height: 2.65rem !important;
    height: 2.65rem !important;
    padding-top: 0.58rem !important;
    padding-bottom: 0.58rem !important;
  }

  .score-report-page-mobile-safe input:not([type="checkbox"]):not([type="radio"]),
  .score-report-page-mobile-safe select,
  .score-report-page-mobile-safe textarea,
  .score-report-page-mobile-safe option,
  .score-report-page-mobile-safe input::placeholder {
    font-size: 12px !important;
    line-height: 1.9 !important;
  }

  .form-label {
    font-size: 0.62rem;
    margin-bottom: 0.16rem;
  }

  .form-input {
    padding: 0.62rem 0.6rem;
    font-size: 12px !important;
    line-height: 1.9 !important;
    min-height: 2.65rem !important;
    height: 2.65rem;
  }
}

</style>