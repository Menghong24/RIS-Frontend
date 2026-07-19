<template>
  <div class="gradebook-page-mobile-safe bg-slate-50 p-2 sm:p-3 md:p-4">
    <!-- Header -->
    <div class="max-w-7xl mx-auto mb-3 md:mb-4">
      <div
        class="bg-white rounded-xl border border-slate-200 shadow-sm px-2.5 sm:px-3 py-3 md:px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3"
      >
        <div class="min-w-0">
          <h2
            class="text-base sm:text-lg md:text-xl font-extrabold text-slate-800 flex items-start gap-2 leading-snug"
          >
            <span
              class="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs sm:text-sm shrink-0"
            >
              <i class="fa-solid fa-book-open-reader"></i>
            </span>

            <span class="break-words leading-snug">
              {{
                selectedClass
                  ? `${selectedClass.className} - បញ្ចូលពិន្ទុ`
                  : "ជ្រើសរើសថ្នាក់រៀន"
              }}
            </span>
          </h2>

          <p class="text-[11px] sm:text-xs text-slate-500 mt-1 break-words leading-snug">
            {{
              selectedClass
                ? "គ្រប់គ្រងពិន្ទុសិស្សតាមមុខវិជ្ជា និងខែ"
                : "សូមជ្រើសរើសថ្នាក់ ដើម្បីបញ្ចូល ឬកែប្រែពិន្ទុសិស្ស"
            }}
          </p>
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto">
          <div v-if="!selectedClass" class="relative w-full sm:w-72">
            <i class="search-icon fa-solid fa-magnifying-glass"></i>

            <input
              v-model="classSearch"
              type="text"
              placeholder="ស្វែងរកថ្នាក់រៀន..."
              class="search-input w-full border border-slate-200 rounded-lg bg-white text-[11px] sm:text-xs text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
            />
          </div>

          <button
            v-if="selectedClass"
            @click="clearSelection"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-extrabold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-blue-700 transition shadow-sm whitespace-nowrap"
          >
            <i class="fa-solid fa-arrow-left text-[10px]"></i>
            ត្រឡប់ក្រោយ
          </button>
        </div>
      </div>
    </div>

    <!-- Class Selection -->
    <div v-if="!selectedClass" class="max-w-7xl mx-auto animate-fade-in">
      <!-- Loading Classes -->
      <div
        v-if="!classesList.length"
        class="text-center py-7 sm:py-8 bg-white rounded-xl border border-slate-200 shadow-sm"
      >
        <div
          class="mx-auto mb-2 h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"
        >
          <i class="fa-solid fa-circle-notch fa-spin text-base sm:text-lg"></i>
        </div>

        <p class="text-[11px] sm:text-xs font-bold text-slate-500">
          កំពុងទាញយកថ្នាក់រៀន...
        </p>
      </div>

      <!-- Class Cards -->
      <div
        v-else
        class="gradebook-class-list-mobile-safe grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-3"
      >
        <div
          v-for="cls in filteredClasses"
          :key="cls._id"
          @click="selectClass(cls)"
          class="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer transition-all duration-200 group relative overflow-hidden"
        >
          <div
            class="absolute top-0 left-0 w-full h-1 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
          ></div>

          <div class="flex justify-between items-start mb-2 gap-2">
            <div
              class="w-8 h-8 sm:w-9 sm:h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xs sm:text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0"
            >
              <i class="fa-solid fa-school"></i>
            </div>

            <span
              class="px-1.5 sm:px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-600 rounded-full break-words leading-snug max-w-[110px]"
            >
              {{ cls.timeStudy || "General" }}
            </span>
          </div>

          <h3 class="text-xs sm:text-sm font-extrabold text-slate-800 leading-snug break-words">
            {{ cls.className }}
          </h3>

          <p class="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 break-words leading-snug">
            កម្រិត: {{ cls.classGrade || "N/A" }}
          </p>

          <div
            class="mt-2.5 sm:mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-[11px]"
          >
            <span class="text-slate-400 font-bold">
              <i class="fa-solid fa-users mr-1"></i>
              {{ getClassStudents(cls).length }} នាក់
            </span>

            <span class="text-blue-600 font-extrabold">
              ចូល
              <i class="fa-solid fa-chevron-right ml-1 text-[9px]"></i>
            </span>
          </div>
        </div>
      </div>

      <!-- Empty Search -->
      <div
        v-if="classesList.length && filteredClasses.length === 0"
        class="bg-white border border-slate-200 rounded-xl p-7 sm:p-8 text-center text-slate-400 mt-3"
      >
        <div class="text-xl sm:text-2xl mb-2">
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>

        <p class="text-xs sm:text-sm font-bold text-slate-500">
          មិនមានថ្នាក់រៀនដែលត្រូវនឹងការស្វែងរក
        </p>
      </div>
    </div>

    <!-- Gradebook Panel -->
    <div v-else class="gradebook-panel-mobile-safe animate-fade-in-up max-w-7xl mx-auto">
      <!-- Filters -->
      <div
        class="bg-white p-2.5 sm:p-3 md:p-4 rounded-xl shadow-sm border border-slate-200 mb-3 md:mb-4"
      >
        <div
          class="grid grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] gap-2 items-end"
        >
          <!-- Subject -->
          <div class="col-span-2 lg:col-span-1">
            <label class="form-label">
              មុខវិជ្ជា
            </label>

            <select v-model="filters.subject" class="form-input">
              <option value="" disabled>ជ្រើសរើសមុខវិជ្ជា...</option>
              <option
                v-for="sub in subjectsList"
                :key="sub._id"
                :value="sub._id"
              >
                {{ sub.subjectName }}
              </option>
            </select>
          </div>

          <!-- Year -->
          <div>
            <label class="form-label">
              ឆ្នាំសិក្សា
            </label>

            <input
              type="text"
              v-model="filters.year"
              class="form-input"
              placeholder="2025-2026"
            />
          </div>

          <!-- Month -->
          <div>
            <label class="form-label">
              ខែ
            </label>

            <select v-model="filters.month" class="form-input">
              <option v-for="m in months" :key="m.value" :value="m.value">
                {{ m.label }}
              </option>
            </select>
          </div>
        </div>

        <div
          class="mt-2 flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] font-bold"
        >
          <span
            v-if="isFilterValid && loading"
            class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1"
          >
            <i class="fa-solid fa-circle-notch fa-spin text-[10px]"></i>
            កំពុងទាញទិន្នន័យដោយស្វ័យប្រវត្ត...
          </span>

          <span
            v-else-if="isFilterValid"
            class="inline-flex items-center gap-1.5 rounded-full bg-green-50 text-green-700 border border-green-100 px-2 py-1"
          >
            <i class="fa-solid fa-rotate text-[10px]"></i>
            ទិន្នន័យនឹងទាញដោយស្វ័យប្រវត្ត ពេលផ្លាស់ប្តូរ
          </span>

          <span
            v-else
            class="inline-flex items-center gap-1.5 rounded-full bg-slate-50 text-slate-500 border border-slate-200 px-2 py-1"
          >
            <i class="fa-solid fa-circle-info text-[10px]"></i>
            សូមជ្រើសរើសមុខវិជ្ជា ដើម្បីទាញតារាងពិន្ទុ
          </span>
        </div>
      </div>

      <!-- Summary Cards -->
      <div v-if="tableData.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3 md:mb-4">
        <div class="summary-card border-slate-200 bg-white">
          <p class="summary-label text-slate-400">សិស្សសរុប</p>
          <p class="summary-number text-slate-800">
            {{ tableData.length }}
          </p>
        </div>

        <div class="summary-card border-blue-100 bg-white">
          <p class="summary-label text-blue-500">មុខវិជ្ជា</p>
          <p class="summary-text text-blue-700">
            {{ selectedSubjectName }}
          </p>
        </div>

        <div class="summary-card border-indigo-100 bg-white">
          <p class="summary-label text-indigo-500">ខែ / ឆ្នាំ</p>
          <p class="summary-text text-indigo-700">
            {{ selectedMonthLabel }} · {{ filters.year }}
          </p>
        </div>

        <div
          class="summary-card"
          :class="hasUnsavedChanges ? 'border-amber-200 bg-amber-50' : 'border-green-100 bg-green-50'"
        >
          <p
            class="summary-label"
            :class="hasUnsavedChanges ? 'text-amber-600' : 'text-green-600'"
          >
            ស្ថានភាព
          </p>

          <p
            class="summary-text"
            :class="hasUnsavedChanges ? 'text-amber-700' : 'text-green-700'"
          >
            {{ hasUnsavedChanges ? "មានការកែប្រែ" : "គ្មានការកែប្រែ" }}
          </p>
        </div>
      </div>

      <!-- Loading Gradebook -->
      <div
        v-if="loading"
        class="text-center py-8 bg-white rounded-xl border border-slate-200 shadow-sm"
      >
        <div
          class="mx-auto mb-2 h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"
        >
          <i class="fa-solid fa-circle-notch fa-spin text-lg"></i>
        </div>

        <p class="text-xs font-bold text-slate-500">
          កំពុងទាញយកតារាងពិន្ទុ...
        </p>
      </div>

      <!-- Table / Cards -->
      <div
        v-else-if="tableData.length > 0"
        class="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200"
      >
        <!-- Table Header -->
        <div
          class="px-2.5 sm:px-3 py-2 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:justify-between md:items-center gap-2"
        >
          <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px]">
            <span class="font-extrabold text-slate-700 flex items-center gap-1.5">
              <i class="fa-solid fa-users text-blue-600"></i>
              សិស្សសរុប: {{ tableData.length }}
            </span>

            <span class="hidden sm:inline text-slate-300">|</span>

            <span class="font-bold text-slate-500 break-words leading-snug">
              {{ selectedSubjectName }}
            </span>

            <span class="hidden sm:inline text-slate-300">|</span>

            <span class="font-bold text-slate-500">
              {{ selectedMonthLabel }} · {{ filters.year }}
            </span>

            <span
              v-if="hasUnsavedChanges"
              class="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 font-extrabold"
            >
              <span class="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
              មានការកែប្រែ
            </span>
          </div>

          <button
            @click="saveAllScores"
            :disabled="isSaving || !hasUnsavedChanges"
            class="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-extrabold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <i
              v-if="isSaving"
              class="fa-solid fa-circle-notch fa-spin text-[10px]"
            ></i>

            <i v-else class="fa-solid fa-floppy-disk text-[10px]"></i>

            រក្សាទុកទាំងអស់
          </button>
        </div>

        <!-- Mobile Cards -->
        <div class="gradebook-mobile-list lg:hidden bg-slate-50 p-2.5 space-y-2">
          <div
            v-for="(student, index) in tableData"
            :key="student.student"
            class="bg-white rounded-xl border border-slate-200 shadow-sm p-2.5"
            :class="student.isDirty ? 'border-amber-200 bg-amber-50/40' : ''"
          >
            <div class="flex items-start gap-2">
              <div
                class="w-10 h-10 rounded-full bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center font-extrabold text-sm shrink-0 font-khmer"
              >
                {{ getStudentInitial(student) }}
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-2">
                  <div class="min-w-0">
                    <p class="font-extrabold text-sm text-slate-800 leading-snug break-words">
                      {{ student.khmerName }}
                    </p>

                    <p class="text-[10px] text-slate-400 leading-snug font-mono break-words mt-0.5">
                      {{ index + 1 }}. {{ student.idCode }}
                    </p>
                  </div>

                  <span
                    :class="getScoreStatusClass(student)"
                    class="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-extrabold whitespace-nowrap shrink-0"
                  >
                    <span
                      :class="getScoreStatusDotClass(student)"
                      class="w-1.5 h-1.5 rounded-full"
                    ></span>
                    {{ getScoreStatusLabel(student) }}
                  </span>
                </div>

                <div class="mt-2 grid grid-cols-[96px_1fr] gap-2">
                  <div>
                    <label class="mobile-label">ពិន្ទុ</label>

                    <input
                      type="number"
                      v-model.number="student.score"
                      min="0"
                      max="100"
                      @input="student.isDirty = true"
                      class="score-input w-full"
                      :class="student.isDirty ? 'dirty-input' : ''"
                    />
                  </div>

                  <div>
                    <label class="mobile-label">ផ្សេងៗ</label>

                    <input
                      type="text"
                      v-model="student.remark"
                      placeholder="កំណត់ចំណាំ..."
                      @input="student.isDirty = true"
                      class="remark-input w-full"
                      :class="student.isDirty ? 'dirty-input' : ''"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop Table -->
        <div class="hidden lg:block overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs min-w-[760px]">
            <thead>
              <tr class="bg-slate-100 text-slate-700">
                <th class="table-th text-center w-10">
                  ល.រ
                </th>

                <th class="table-th min-w-[190px]">
                  ឈ្មោះសិស្ស
                </th>

                <th class="table-th text-center w-24">
                  ពិន្ទុ
                </th>

                <th class="table-th min-w-[200px]">
                  ផ្សេងៗ
                </th>

                <th class="table-th text-center w-32">
                  ស្ថានភាព
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(student, index) in tableData"
                :key="student.student"
                class="hover:bg-slate-50 transition border-b border-slate-100"
              >
                <td class="table-td text-center text-slate-500">
                  {{ index + 1 }}
                </td>

                <td class="table-td">
                  <div class="flex items-center gap-2">
                    <div
                      class="w-8 h-8 rounded-full bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center font-extrabold text-[11px] shrink-0 font-khmer"
                    >
                      {{ getStudentInitial(student) }}
                    </div>

                    <div class="min-w-0">
                      <p class="font-extrabold text-slate-800 leading-snug break-words">
                        {{ student.khmerName }}
                      </p>

                      <p class="text-[10px] text-slate-400 leading-snug font-mono break-words">
                        {{ student.idCode }}
                      </p>
                    </div>
                  </div>
                </td>

                <td class="table-td text-center">
                  <input
                    type="number"
                    v-model.number="student.score"
                    min="0"
                    max="100"
                    @input="student.isDirty = true"
                    class="score-input w-20"
                    :class="student.isDirty ? 'dirty-input' : ''"
                  />
                </td>

                <td class="table-td">
                  <input
                    type="text"
                    v-model="student.remark"
                    placeholder="កំណត់ចំណាំ..."
                    @input="student.isDirty = true"
                    class="remark-input w-full"
                    :class="student.isDirty ? 'dirty-input' : ''"
                  />
                </td>

                <td class="table-td text-center">
                  <span
                    :class="getScoreStatusClass(student)"
                    class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold whitespace-nowrap"
                  >
                    <span
                      :class="getScoreStatusDotClass(student)"
                      class="w-1.5 h-1.5 rounded-full"
                    ></span>
                    {{ getScoreStatusLabel(student) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- No Students -->
      <div
        v-else-if="!loading && hasSearched"
        class="gradebook-empty-mobile-safe text-center py-8 bg-white rounded-xl border border-dashed border-slate-300"
      >
        <div
          class="mx-auto mb-2 h-10 w-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center"
        >
          <i class="fa-solid fa-user-slash"></i>
        </div>

        <h3 class="text-sm font-extrabold text-slate-700">
          មិនមានសិស្ស
        </h3>

        <p class="mt-0.5 text-[11px] text-slate-500">
          មិនទាន់មានសិស្សក្នុងថ្នាក់នេះនៅឡើយទេ។
        </p>
      </div>

      <!-- Initial State -->
      <div
        v-else-if="!loading && !hasSearched"
        class="gradebook-empty-mobile-safe text-center py-8 bg-white rounded-xl border border-dashed border-slate-300"
      >
        <div
          class="mx-auto mb-2 h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"
        >
          <i class="fa-solid fa-clipboard-list"></i>
        </div>

        <p class="text-[11px] text-slate-500">
          ជ្រើសរើស <strong>មុខវិជ្ជា</strong> និង
          <strong>ខែ</strong> ខាងលើ ដើម្បីបង្ហាញតារាងពិន្ទុដោយស្វ័យប្រវត្ត។
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import api from "../config/api";
import { useQuery } from "../hooks/useQuery";
import { useToast } from "vue-toastification";

const { data: classes } = useQuery("classes");
const { data: subjects } = useQuery("subjects");
const { data: allStudentsFromQuery } = useQuery("students");

const toast = useToast();


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

const selectedClass = ref(null);
const loading = ref(false);
const isSaving = ref(false);
const hasSearched = ref(false);
const students = ref([]);
const tableData = ref([]);
const classSearch = ref("");

let autoLoadTimer = null;

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

const setCurrentYearAndMonth = () => {
  filters.value.year = getCurrentAcademicYear();
  filters.value.month = getCurrentMonthValue();
};

const filters = ref({
  class: "",
  subject: "",
  year: getCurrentAcademicYear(),
  month: getCurrentMonthValue(),
  semester: "Semester 1",
  examType: "monthly"
});

const normalizeArray = (responseData) => {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.result)) return responseData.result;
  if (Array.isArray(responseData?.data)) return responseData.data;
  if (Array.isArray(responseData?.items)) return responseData.items;

  return [];
};

const normalizeObject = (responseData) => {
  if (!responseData) return null;
  if (responseData?._id) return responseData;
  if (responseData?.result?._id) return responseData.result;
  if (responseData?.data?._id) return responseData.data;

  return null;
};

const getId = (value) => {
  return String(value?._id || value || "");
};

const khmerNameCollator = new Intl.Collator("km-KH", {
  sensitivity: "base",
  numeric: true,
  ignorePunctuation: true
});

const getStudentSortName = (student) => {
  return String(
    student?.khmerName ||
      student?.name ||
      student?.englishName ||
      student?.studentId ||
      student?.idCode ||
      student?.code ||
      ""
  ).trim();
};

const sortStudentsByKhmerName = (studentList = []) => {
  return [...studentList].sort((firstStudent, secondStudent) => {
    const firstName = getStudentSortName(firstStudent);
    const secondName = getStudentSortName(secondStudent);
    const nameCompare = khmerNameCollator.compare(firstName, secondName);

    if (nameCompare !== 0) return nameCompare;

    const firstId = String(
      firstStudent?.studentId || firstStudent?.idCode || firstStudent?.code || firstStudent?._id || ""
    );
    const secondId = String(
      secondStudent?.studentId || secondStudent?.idCode || secondStudent?.code || secondStudent?._id || ""
    );

    return khmerNameCollator.compare(firstId, secondId);
  });
};

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

const hasScoreValue = (score) => {
  return score !== "" && score !== null && score !== undefined;
};

const getScoreStatusLabel = (student) => {
  if (student.isDirty) return "មិនទាន់រក្សា";
  if (!hasScoreValue(student.score)) return "មិនទាន់មានពិន្ទុ";
  return "រក្សាទុក";
};

const getScoreStatusClass = (student) => {
  if (student.isDirty) {
    return "bg-amber-100 text-amber-700";
  }

  if (!hasScoreValue(student.score)) {
    return "bg-slate-100 text-slate-500";
  }

  return "bg-green-50 text-green-700";
};

const getScoreStatusDotClass = (student) => {
  if (student.isDirty) {
    return "bg-amber-500";
  }

  if (!hasScoreValue(student.score)) {
    return "bg-slate-400";
  }

  return "bg-green-500";
};

const classesList = computed(() => {
  return normalizeArray(classes.value);
});

const subjectsList = computed(() => {
  return normalizeArray(subjects.value);
});

const allStudentsList = computed(() => {
  return normalizeArray(allStudentsFromQuery.value);
});

const filteredClasses = computed(() => {
  if (!classSearch.value.trim()) return classesList.value;

  const keyword = classSearch.value.trim().toLowerCase();

  return classesList.value.filter((cls) => {
    const className = String(cls.className || "").toLowerCase();
    const classGrade = String(cls.classGrade || "").toLowerCase();
    const timeStudy = String(cls.timeStudy || "").toLowerCase();
    const classNumber = String(cls.classNumber || "").toLowerCase();
    const teacherName = String(
      cls.teacher?.khmerName ||
        cls.teacher?.englishName ||
        cls.teacherName ||
        ""
    ).toLowerCase();

    return (
      className.includes(keyword) ||
      classGrade.includes(keyword) ||
      timeStudy.includes(keyword) ||
      classNumber.includes(keyword) ||
      teacherName.includes(keyword)
    );
  });
});

const getStudentClassId = (student) => {
  return getId(
    student?.grade?._id ||
      student?.grade ||
      student?.class?._id ||
      student?.class ||
      student?.classId?._id ||
      student?.classId
  );
};

const getStudentClassIds = (student) => {
  const ids = [];

  const directClassId = getStudentClassId(student);
  if (directClassId) ids.push(directClassId);

  if (Array.isArray(student?.classes)) {
    student.classes.forEach((classItem) => {
      const id = getId(classItem);
      if (id) ids.push(id);
    });
  }

  if (Array.isArray(student?.classIds)) {
    student.classIds.forEach((classItem) => {
      const id = getId(classItem);
      if (id) ids.push(id);
    });
  }

  return [...new Set(ids)];
};

const getClassStudentIds = (cls) => {
  return Array.isArray(cls?.students)
    ? cls.students.map((student) => getId(student)).filter(Boolean)
    : [];
};

const getClassPopulatedStudents = (cls) => {
  return Array.isArray(cls?.students)
    ? cls.students.filter((student) => typeof student === "object" && student?._id)
    : [];
};

const uniqueStudents = (studentList) => {
  const seen = new Set();

  return studentList.filter((student) => {
    const id = getId(student);
    if (!id || seen.has(id)) return false;

    seen.add(id);
    return true;
  });
};

const getClassStudents = (cls, sourceStudents = allStudentsList.value) => {
  if (!cls) return [];

  const classId = getId(cls);
  const classStudentIds = getClassStudentIds(cls);
  const populatedStudents = getClassPopulatedStudents(cls);

  const matchedStudents = sourceStudents.filter((student) => {
    const studentId = getId(student);
    const inClassArray = classStudentIds.includes(studentId);
    const inStudentClassField = getStudentClassIds(student).includes(classId);

    return inClassArray || inStudentClassField;
  });

  return sortStudentsByKhmerName(uniqueStudents([...populatedStudents, ...matchedStudents]));
};

const getLatestClass = async (classId) => {
  try {
    const classesRes = await api.get("/classes");
    const freshClasses = normalizeArray(classesRes.data);

    return (
      freshClasses.find((cls) => getId(cls) === getId(classId)) ||
      selectedClass.value
    );
  } catch (error) {
    return selectedClass.value;
  }
};

watch(selectedClass, (newClass) => {
  students.value = [];
  tableData.value = [];
  hasSearched.value = false;

  if (newClass) {
    filters.value.class = newClass._id;
    setCurrentYearAndMonth();
  } else {
    filters.value.class = "";
    filters.value.subject = "";
  }
});

const isFilterValid = computed(() => {
  return filters.value.class && filters.value.subject && filters.value.year;
});

const hasUnsavedChanges = computed(() => {
  return tableData.value.some((student) => student.isDirty);
});

const selectedSubjectName = computed(() => {
  const subject = subjectsList.value.find((sub) => {
    return sub._id === filters.value.subject;
  });

  return subject ? subject.subjectName : "មិនទាន់ជ្រើសរើសមុខវិជ្ជា";
});

const selectedMonthLabel = computed(() => {
  const month = months.find((m) => m.value === filters.value.month);
  return month ? month.label : filters.value.month;
});

const selectClass = (cls) => {
  selectedClass.value = cls;
};

const clearSelection = () => {
  selectedClass.value = null;
  classSearch.value = "";
};

const getScoreStudentId = (score) => {
  return getId(
    score.student?._id ||
      score.student ||
      score.studentId?._id ||
      score.studentId
  );
};

const getScoreClassId = (score) => {
  return getId(
    score.class?._id ||
      score.class ||
      score.classId?._id ||
      score.classId
  );
};

const getScoreSubjectId = (score) => {
  return getId(
    score.subject?._id ||
      score.subject ||
      score.subjectId?._id ||
      score.subjectId
  );
};

const scoreMatchesCurrentFilter = (score, student) => {
  const scoreStudentId = getScoreStudentId(score);
  const scoreClassId = getScoreClassId(score);
  const scoreSubjectId = getScoreSubjectId(score);
  const scoreYear = String(score.year || score.academicYear || "");
  const scoreMonth = String(score.month || "");
  const scoreExamType = String(score.examType || "");

  const studentMatch = scoreStudentId === getId(student);
  const classMatch = !scoreClassId || scoreClassId === getId(filters.value.class);
  const subjectMatch = !scoreSubjectId || scoreSubjectId === getId(filters.value.subject);
  const yearMatch = !scoreYear || scoreYear === String(filters.value.year);
  const monthMatch = !scoreMonth || scoreMonth === String(filters.value.month);
  const examTypeMatch = !scoreExamType || scoreExamType === String(filters.value.examType);

  return (
    studentMatch &&
    classMatch &&
    subjectMatch &&
    yearMatch &&
    monthMatch &&
    examTypeMatch
  );
};

const buildTableRow = (student, existingScores) => {
  const foundScore = existingScores.find((score) => {
    return scoreMatchesCurrentFilter(score, student);
  });

  return {
    student: getId(student),
    scoreId: foundScore?._id || null,
    khmerName: student.khmerName || student.name || "-",
    englishName: student.englishName || "",
    idCode: student.studentId || student.idCode || student.code || "N/A",
    score:
      foundScore && foundScore.score !== undefined && foundScore.score !== null
        ? Number(foundScore.score)
        : "",
    remark: foundScore ? foundScore.remark || "" : "",
    isDirty: false
  };
};

const loadGradebook = async () => {
  if (!isFilterValid.value) return;

  loading.value = true;
  hasSearched.value = true;

  students.value = [];
  tableData.value = [];

  try {
    const [studentsRes, scoresRes, latestClass] = await Promise.all([
      api.get("/students"),
      api.get("/scores", {
        params: {
          class: filters.value.class,
          classId: filters.value.class,
          subject: filters.value.subject,
          subjectId: filters.value.subject,
          year: filters.value.year,
          academicYear: filters.value.year,
          month: filters.value.month,
          examType: filters.value.examType
        }
      }),
      getLatestClass(filters.value.class)
    ]);

    const allStudents = normalizeArray(studentsRes.data);
    const existingScores = normalizeArray(scoresRes.data);
    const classForStudents =
      normalizeObject(latestClass) ||
      latestClass ||
      selectedClass.value;

    const classStudents = sortStudentsByKhmerName(
      getClassStudents(classForStudents, allStudents)
    );

    students.value = classStudents;

    tableData.value = classStudents.map((student) => {
      return buildTableRow(student, existingScores);
    });

    if (classStudents.length === 0) {
      toast.info("មិនមានសិស្សក្នុងថ្នាក់នេះទេ");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.err ||
        error.response?.data?.message ||
        "មិនអាចទាញយកតារាងពិន្ទុបានទេ"
    );
  } finally {
    loading.value = false;
  }
};

const scheduleAutoLoadGradebook = () => {
  if (autoLoadTimer) {
    clearTimeout(autoLoadTimer);
  }

  if (!isFilterValid.value) {
    students.value = [];
    tableData.value = [];
    hasSearched.value = false;
    loading.value = false;
    return;
  }

  autoLoadTimer = setTimeout(() => {
    loadGradebook();
  }, 300);
};

watch(
  () => [
    filters.value.class,
    filters.value.subject,
    filters.value.year,
    filters.value.month,
    filters.value.semester,
    filters.value.examType
  ],
  () => {
    scheduleAutoLoadGradebook();
  }
);

const saveAllScores = async () => {
  const studentsToSave = tableData.value.filter((student) => {
    return hasScoreValue(student.score);
  });

  if (studentsToSave.length === 0) {
    toast.warning("សូមបញ្ចូលពិន្ទុយ៉ាងហោចណាស់ម្នាក់");
    return;
  }

  const invalidStudent = studentsToSave.find((student) => {
    return (
      Number.isNaN(Number(student.score)) ||
      Number(student.score) < 0 ||
      Number(student.score) > 100
    );
  });

  if (invalidStudent) {
    toast.warning(
      `សូមបញ្ចូលពិន្ទុត្រឹមត្រូវ 0-100 សម្រាប់ ${invalidStudent.khmerName}`
    );
    return;
  }

  const payload = studentsToSave.map((student) => ({
    scoreId: student.scoreId,
    student: student.student,
    studentId: student.student,
    class: filters.value.class,
    classId: filters.value.class,
    subject: filters.value.subject,
    subjectId: filters.value.subject,
    year: filters.value.year,
    academicYear: filters.value.year,
    month: filters.value.month,
    semester: filters.value.semester,
    examType: filters.value.examType,
    score: Number(student.score),
    remark: student.remark || ""
  }));

  isSaving.value = true;

  try {
    await api.post("/scores", {
      scores: payload
    });

    tableData.value.forEach((student) => {
      student.isDirty = false;
    });

    toast.success(`បានរក្សាទុកពិន្ទុ ${studentsToSave.length} នាក់ដោយជោគជ័យ`);

    await loadGradebook();
  } catch (error) {
    toast.error(
      error.response?.data?.err ||
        error.response?.data?.message ||
        "មិនអាចរក្សាទុកពិន្ទុបានទេ"
    );
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  setNoZoomViewport();
});

onBeforeUnmount(() => {
  restoreViewport();

  if (autoLoadTimer) {
    clearTimeout(autoLoadTimer);
  }
});
</script>

<style scoped>

.gradebook-page-mobile-safe {
  font-family: "Noto Sans Khmer", "Khmer OS Battambang", "Battambang", "Khmer OS", system-ui, sans-serif;
  line-height: 1.45;
}

.gradebook-page-mobile-safe h2,
.gradebook-page-mobile-safe h3,
.gradebook-page-mobile-safe p,
.gradebook-page-mobile-safe span,
.gradebook-page-mobile-safe label,
.gradebook-page-mobile-safe button,
.gradebook-page-mobile-safe th,
.gradebook-page-mobile-safe td {
  line-height: 1.45;
}

.gradebook-page-mobile-safe .break-words {
  overflow-wrap: anywhere;
  word-break: break-word;
}

.gradebook-page-mobile-safe input,
.gradebook-page-mobile-safe select,
.gradebook-page-mobile-safe textarea,
.gradebook-page-mobile-safe option,
.gradebook-page-mobile-safe input::placeholder {
  font-family: "Noto Sans Khmer", "Khmer OS Battambang", "Battambang", "Khmer OS", system-ui, sans-serif !important;
  font-size: 12px !important;
  line-height: 1.9 !important;
  font-weight: 500;
  -webkit-font-smoothing: antialiased;
  text-rendering: geometricPrecision;
}

.gradebook-page-mobile-safe input,
.gradebook-page-mobile-safe select {
  min-height: 2.65rem !important;
  height: 2.65rem !important;
  padding-top: 0.58rem !important;
  padding-bottom: 0.58rem !important;
  overflow: visible !important;
}

.gradebook-page-mobile-safe .score-input,
.gradebook-page-mobile-safe .remark-input {
  min-height: 2.65rem !important;
  height: 2.65rem !important;
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
  padding: 0.58rem 0.55rem;
  font-size: 12px;
  line-height: 1.9;
  color: #334155;
  background: #ffffff;
  outline: none;
  min-height: 2.65rem;
  height: auto;
  transition: all 0.2s ease;
}

.form-input:focus {
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
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
  padding-right: 0.75rem !important;
  min-height: 2rem;
}

.summary-card {
  border-width: 1px;
  border-radius: 0.75rem;
  padding: 0.5rem 0.65rem;
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.04);
  min-width: 0;
}

.summary-label {
  font-size: 0.58rem;
  font-weight: 800;
  line-height: 1.35;
  white-space: nowrap;
}

.summary-number {
  margin-top: 0.22rem;
  font-size: 1rem;
  font-weight: 900;
  line-height: 1.1;
}

.summary-text {
  margin-top: 0.22rem;
  font-size: 0.72rem;
  font-weight: 900;
  line-height: 1.45;
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
}

.table-th {
  padding: 0.46rem 0.6rem;
  font-size: 0.66rem;
  font-weight: 900;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.table-td {
  padding: 0.46rem 0.6rem;
  border: 1px solid #f1f5f9;
  font-size: 0.72rem;
}

.mobile-label {
  display: block;
  font-size: 0.58rem;
  font-weight: 800;
  color: #64748b;
  margin-bottom: 0.15rem;
}

.score-input,
.remark-input {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.58rem 0.5rem;
  font-size: 12px;
  line-height: 1.9;
  outline: none;
  background: #ffffff;
  min-height: 2.65rem;
  height: auto;
  transition: all 0.2s ease;
}

.score-input {
  text-align: center;
  font-weight: 800;
}

.score-input:focus,
.remark-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
}

.dirty-input {
  border-color: #f59e0b !important;
  background: #fffbeb !important;
  box-shadow: 0 0 0 2px rgb(251 191 36 / 0.25);
}

.font-khmer {
  font-family: "Noto Sans Khmer", "Khmer OS Battambang", "Battambang", "Siemreap", "Kantumruy Pro", sans-serif;
  line-height: 1.45;
}

.animate-fade-in {
  animation: fadeIn 0.25s ease-out forwards;
}

.animate-fade-in-up {
  animation: fadeInUp 0.25s ease-out forwards;
}


/* Chrome mobile bottom toolbar fix + no visual input-size changes */
@media (max-width: 640px) {
  .gradebook-page-mobile-safe {
    padding-bottom: calc(2.75rem + env(safe-area-inset-bottom));
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }

  .gradebook-page-mobile-safe > .max-w-7xl {
    padding-bottom: calc(1.5rem + env(safe-area-inset-bottom));
  }

  .gradebook-class-list-mobile-safe,
  .gradebook-mobile-list {
    padding-bottom: calc(1rem + env(safe-area-inset-bottom));
  }

  .gradebook-class-list-mobile-safe > :last-child,
  .gradebook-mobile-list > :last-child,
  .gradebook-empty-mobile-safe {
    margin-bottom: calc(1.25rem + env(safe-area-inset-bottom));
  }
}

@media (min-width: 640px) {
  .form-label {
    font-size: 0.68rem;
  }

  .form-input {
    padding: 0.62rem 0.6rem;
    font-size: 12px !important;
    line-height: 1.9 !important;
    min-height: 2.65rem !important;
    height: auto;
  }

  .summary-card {
    padding: 0.65rem 0.75rem;
  }

  .summary-label {
    font-size: 0.62rem;
  }

  .summary-number {
    font-size: 1.125rem;
  }

  .summary-text {
    font-size: 0.82rem;
  }

  .score-input,
  .remark-input {
    padding: 0.62rem 0.55rem;
    font-size: 12px !important;
    line-height: 1.9 !important;
    min-height: 2.65rem !important;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>