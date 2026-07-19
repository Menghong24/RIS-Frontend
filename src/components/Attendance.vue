<template>
  <div class="attendance-page-mobile-safe bg-slate-50 p-2 sm:p-3 md:p-4">
    <!-- Header -->
    <div class="max-w-7xl mx-auto mb-3 md:mb-4">
      <div
        class="bg-white rounded-xl border border-slate-200 shadow-sm px-2.5 sm:px-3 py-3 md:px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 md:gap-3"
      >
        <div class="min-w-0">
          <h1
            class="text-base sm:text-lg md:text-xl font-extrabold text-slate-800 flex items-start gap-2 leading-snug"
          >
            <span
              class="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs sm:text-sm shrink-0"
            >
              <i class="fa-solid fa-clipboard-check"></i>
            </span>

            <span class="break-words leading-snug">
              គ្រប់គ្រងវត្តមានសិស្ស
            </span>
          </h1>

          <p
            class="text-slate-500 text-[11px] sm:text-xs mt-1 break-words leading-snug"
            v-if="!selectedClass"
          >
            សូមជ្រើសរើសថ្នាក់ដើម្បីកត់ត្រាវត្តមាន
          </p>

          <p
            class="text-slate-500 text-[11px] sm:text-xs mt-1 break-words leading-snug"
            v-else
          >
            ថ្នាក់រៀន៖
            <span class="font-bold text-slate-700">
              {{ selectedClass.className }}
            </span>

            <span class="mx-1 text-slate-300">•</span>

            សិស្សសរុប៖
            <span class="font-bold text-emerald-700">
              {{ attendance.length }}
            </span>
            នាក់
          </p>
        </div>

        <div class="flex items-center gap-2 w-full md:w-auto">
          <div v-if="!selectedClass" class="relative w-full md:w-72">
            <i class="search-icon fa-solid fa-magnifying-glass"></i>

            <input
              v-model="searchQuery"
              type="text"
              placeholder="ស្វែងរកថ្នាក់រៀន..."
              class="search-input w-full border border-slate-200 rounded-lg bg-white text-[11px] sm:text-xs text-slate-700 outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition"
            />
          </div>

          <button
            v-else
            @click="closeAttendance"
            class="whitespace-nowrap flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-[11px] sm:text-xs font-bold transition shadow-sm"
          >
            <i class="fa-solid fa-arrow-left text-[10px] sm:text-xs"></i>
            ត្រឡប់ក្រោយ
          </button>
        </div>
      </div>
    </div>

    <!-- Class Cards -->
    <div v-if="!selectedClass" class="max-w-7xl mx-auto">
      <div
        class="attendance-class-list-mobile-safe grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-3"
      >
        <div
          v-for="cls in filteredClasses"
          :key="cls._id"
          @click="openAttendance(cls)"
          class="bg-white p-2.5 sm:p-3 rounded-xl shadow-sm border border-slate-200 hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all group"
        >
          <div class="flex items-start justify-between gap-2 mb-2">
            <div
              class="w-8 h-8 sm:w-9 sm:h-9 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center text-sm sm:text-base group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0"
            >
              <i class="fa-solid fa-school"></i>
            </div>

            <span
              class="px-1.5 sm:px-2 py-0.5 bg-green-100 text-green-700 text-[10px] rounded-full font-bold"
            >
              សកម្ម
            </span>
          </div>

          <h3 class="font-extrabold text-xs sm:text-sm text-slate-800 leading-snug break-words">
            {{ cls.className }}
          </h3>

          <p class="text-slate-500 text-[10px] sm:text-[11px] mt-1 break-words leading-snug">
            គ្រូបន្ទុក៖ {{ cls.teacherName || getTeacherName(cls.teacher) }}
          </p>

          <div
            class="mt-2.5 sm:mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-400 text-[10px] sm:text-[11px]"
          >
            <span>
              <i class="fa-solid fa-users mr-1"></i>
              {{ cls.students?.length || 0 }} នាក់
            </span>

            <span class="text-emerald-600 font-bold">
              ចូល
              <i class="fa-solid fa-chevron-right ml-1"></i>
            </span>
          </div>
        </div>
      </div>

      <div
        v-if="filteredClasses.length === 0"
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

    <!-- Attendance Panel -->
    <div
      v-else
      class="attendance-panel-mobile-safe bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-7xl mx-auto"
    >
      <!-- Toolbar -->
      <div class="p-2.5 sm:p-3 bg-slate-50 border-b border-slate-200">
        <div
          class="grid grid-cols-2 lg:grid-cols-[180px_180px_1fr_auto] gap-2 items-end"
        >
          <div>
            <label class="form-label">
              កាលបរិច្ឆេទ
            </label>

            <input
              v-model="filters.date"
              type="date"
              @change="fetchData"
              class="form-input"
            />
          </div>

          <div>
            <label class="form-label">
              វេនសិក្សា
            </label>

            <select
              v-model="filters.session"
              @change="fetchData"
              class="form-input"
            >
              <option value="morning">វេនព្រឹក</option>
              <option value="afternoon">វេនរសៀល</option>
              <option value="evening">វេនល្ងាច</option>
            </select>
          </div>

          <div class="col-span-2 lg:col-span-1 grid grid-cols-4 gap-1.5 sm:gap-2">
            <div class="summary-box bg-white border-slate-200">
              <p class="summary-label text-slate-400">សរុប</p>
              <p class="summary-value text-slate-800">
                {{ attendance.length }}
              </p>
            </div>

            <div class="summary-box bg-green-50 border-green-100">
              <p class="summary-label text-green-600">វត្តមាន</p>
              <p class="summary-value text-green-700">
                {{ countByStatus.present }}
              </p>
            </div>

            <div class="summary-box bg-red-50 border-red-100">
              <p class="summary-label text-red-600">អវត្តមាន</p>
              <p class="summary-value text-red-700">
                {{ countByStatus.absent }}
              </p>
            </div>

            <div class="summary-box bg-orange-50 border-orange-100">
              <p class="summary-label text-orange-600">យឺត/ច្បាប់</p>
              <p class="summary-value text-orange-700">
                {{ countByStatus.late + countByStatus.permission }}
              </p>
            </div>
          </div>

          <div class="col-span-2 lg:col-span-1 text-left lg:text-right">
            <p class="text-[10px] text-slate-400 font-bold">ស្ថានភាព</p>

            <span
              v-if="mode === 'edit'"
              class="inline-flex items-center gap-1 mt-1 px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-[10px] sm:text-[11px] font-bold whitespace-nowrap"
            >
              <i class="fa-solid fa-pen-to-square"></i>
              កែប្រែ
            </span>

            <span
              v-else
              class="inline-flex items-center gap-1 mt-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] sm:text-[11px] font-bold whitespace-nowrap"
            >
              <i class="fa-solid fa-plus"></i>
              បង្កើតថ្មី
            </span>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="p-7 sm:p-8 text-center text-slate-400">
        <div
          class="mx-auto mb-2 h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"
        >
          <i class="fa-solid fa-circle-notch fa-spin text-lg sm:text-xl"></i>
        </div>

        <p class="font-bold text-xs sm:text-sm text-slate-500">
          កំពុងទាញយកទិន្នន័យ...
        </p>
      </div>

      <template v-else>
        <!-- Mobile Cards -->
        <div class="attendance-mobile-list lg:hidden p-2.5 space-y-2 bg-slate-50">
          <div
            v-for="(record, index) in attendance"
            :key="getRecordStudentId(record) || index"
            class="bg-white border border-slate-200 rounded-xl p-2.5 shadow-sm"
          >
            <div class="flex items-start gap-2">
              <div
                class="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-extrabold overflow-hidden shrink-0"
              >
                <img
                  v-if="getStudentImageUrl(record.student)"
                  :src="getStudentImageUrl(record.student)"
                  class="w-full h-full object-cover rounded-full"
                  alt="Student"
                />

                <span v-else class="text-sm font-extrabold">
                  {{ getStudentInitial(record.student) }}
                </span>
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-2">
                  <div class="min-w-0">
                    <p class="font-bold text-sm text-slate-800 leading-snug break-words">
                      {{ record.student?.khmerName || "មិនមានឈ្មោះ" }}
                    </p>

                    <p class="text-[10px] text-slate-400 font-mono leading-snug break-words mt-0.5">
                      {{ index + 1 }}.
                      {{ record.student?.studentId || "-" }}
                      •
                      {{ record.student?.gender || "-" }}
                    </p>
                  </div>

                  <span
                    class="shrink-0 px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-bold"
                  >
                    #{{ index + 1 }}
                  </span>
                </div>

                <div class="mt-2 grid grid-cols-2 gap-1.5">
                  <button
                    v-for="status in statusOptions"
                    :key="status.id"
                    @click="setRecordStatus(record, status.id)"
                    :class="[
                      'px-2 py-1.5 rounded-lg text-[10px] font-bold border transition-all whitespace-nowrap flex items-center justify-center gap-1',
                      record.status === status.id
                        ? status.activeClass
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                    ]"
                    type="button"
                  >
                    <i :class="status.icon" class="text-[10px]"></i>
                    {{ status.label }}
                  </button>
                </div>

                <input
                  v-model="record.remark"
                  @input="markAttendanceChanged"
                  placeholder="សម្គាល់..."
                  class="attendance-input-safe mt-2 w-full px-2 py-1.5 text-[11px] border border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none bg-white transition"
                />
              </div>
            </div>
          </div>

          <div
            v-if="attendance.length === 0"
            class="p-8 text-center text-slate-400 bg-white border border-dashed border-slate-300 rounded-xl"
          >
            <div class="text-2xl mb-2">
              <i class="fa-solid fa-clipboard-list"></i>
            </div>

            <p class="text-xs font-bold text-slate-500">
              មិនមានទិន្នន័យសិស្សក្នុងថ្នាក់នេះ
            </p>
          </div>
        </div>

        <!-- Desktop Table -->
        <div class="hidden lg:block overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs min-w-[850px]">
            <thead>
              <tr class="bg-slate-100 text-slate-700">
                <th class="p-2 font-bold border border-slate-200 text-center w-10">
                  ល.រ
                </th>

                <th class="p-2 font-bold border border-slate-200">
                  ព័ត៌មានសិស្ស
                </th>

                <th class="p-2 font-bold border border-slate-200 text-center w-[330px]">
                  ស្ថានភាពវត្តមាន
                </th>

                <th class="p-2 font-bold border border-slate-200 w-52">
                  សម្គាល់
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(record, index) in attendance"
                :key="getRecordStudentId(record) || index"
                class="hover:bg-slate-50 transition border-b border-slate-100"
              >
                <td class="p-2 border border-slate-100 text-center text-slate-500">
                  {{ index + 1 }}
                </td>

                <td class="p-2 border border-slate-100">
                  <div class="flex items-center gap-2">
                    <div
                      class="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-extrabold overflow-hidden shrink-0"
                    >
                      <img
                        v-if="getStudentImageUrl(record.student)"
                        :src="getStudentImageUrl(record.student)"
                        class="w-full h-full object-cover rounded-full"
                        alt="Student"
                      />

                      <span v-else class="text-sm font-extrabold">
                        {{ getStudentInitial(record.student) }}
                      </span>
                    </div>

                    <div class="min-w-0">
                      <p class="font-bold text-slate-800 leading-snug break-words">
                        {{ record.student?.khmerName || "មិនមានឈ្មោះ" }}
                      </p>

                      <p class="text-[10px] text-slate-400 font-mono leading-snug break-words">
                        {{ record.student?.studentId || "-" }} -
                        {{ record.student?.gender || "-" }}
                      </p>
                    </div>
                  </div>
                </td>

                <td class="p-2 border border-slate-100">
                  <div class="flex items-center justify-center gap-1 flex-wrap">
                    <button
                      v-for="status in statusOptions"
                      :key="status.id"
                      @click="setRecordStatus(record, status.id)"
                      :class="[
                        'px-2.5 py-1 rounded-md text-[11px] font-bold border transition-all whitespace-nowrap',
                        record.status === status.id
                          ? status.activeClass
                          : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'
                      ]"
                      type="button"
                    >
                      <i :class="status.icon" class="mr-1"></i>
                      {{ status.label }}
                    </button>
                  </div>
                </td>

                <td class="p-2 border border-slate-100 text-center">
                  <input
                    v-model="record.remark"
                    @input="markAttendanceChanged"
                    placeholder="សម្គាល់..."
                    class="attendance-input-safe w-full px-2 py-1.5 text-xs border border-slate-200 rounded-md focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none bg-white transition"
                  />
                </td>
              </tr>

              <tr v-if="attendance.length === 0">
                <td colspan="4" class="p-8 text-center text-slate-400">
                  <div class="text-2xl mb-2">
                    <i class="fa-solid fa-clipboard-list"></i>
                  </div>

                  <p class="text-sm font-bold text-slate-500">
                    មិនមានទិន្នន័យសិស្សក្នុងថ្នាក់នេះ
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- Footer -->
      <div
        class="attendance-footer-mobile-safe p-2.5 sm:p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3"
      >
        <div
          class="text-[10px] sm:text-[11px] text-slate-500 font-bold flex flex-wrap items-center gap-1.5 sm:gap-2"
        >
          <span>
            <i class="fa-solid fa-users mr-1 text-slate-400"></i>
            សរុបសិស្ស៖ {{ attendance.length }} នាក់
          </span>

          <span class="hidden sm:inline text-slate-300">|</span>

          <span>
            ថ្ងៃទី៖ {{ filters.date }}
          </span>

          <span class="hidden sm:inline text-slate-300">|</span>

          <span>
            វេន៖ {{ sessionLabel }}
          </span>
        </div>

        <button
          @click="onSave"
          :disabled="loading || attendance.length === 0 || !hasAttendanceChanges"
          class="px-4 sm:px-5 py-1.5 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs sm:text-sm font-bold shadow-sm flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <i class="fa-solid fa-floppy-disk text-[11px] sm:text-sm"></i>
          រក្សាទុកវត្តមាន
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useAttendance } from "../hooks/useAttendance";
import { useToast } from "vue-toastification";
import api from "../config/api";

const { attendance, mode, loading, getAttendance, saveAttendance } =
  useAttendance();

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

const classes = ref([]);
const selectedClass = ref(null);
const searchQuery = ref("");
const originalAttendanceSignature = ref("");

const filters = ref({
  date: new Date().toISOString().split("T")[0],
  session: "morning"
});

const statusOptions = [
  {
    id: "present",
    label: "វត្តមាន",
    icon: "fa-solid fa-check",
    activeClass: "bg-green-600 text-white border-green-600 shadow-sm"
  },
  {
    id: "absent",
    label: "អវត្តមាន",
    icon: "fa-solid fa-xmark",
    activeClass: "bg-red-600 text-white border-red-600 shadow-sm"
  },
  {
    id: "permission",
    label: "ច្បាប់",
    icon: "fa-solid fa-file-circle-check",
    activeClass: "bg-yellow-500 text-white border-yellow-500 shadow-sm"
  },
  {
    id: "late",
    label: "យឺត",
    icon: "fa-solid fa-clock",
    activeClass: "bg-orange-500 text-white border-orange-500 shadow-sm"
  }
];

const getApiOrigin = () => {
  const baseURL = api.defaults?.baseURL || import.meta.env.VITE_API_URL || "";

  if (!baseURL || baseURL === "/api") {
    return window.location.origin;
  }

  if (baseURL.startsWith("http")) {
    return baseURL.replace(/\/api\/?$/, "").replace(/\/$/, "");
  }

  return window.location.origin;
};

const getImageUrl = (imagePath = "") => {
  if (!imagePath) return "";

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  return `${getApiOrigin()}${imagePath}`;
};

const getStudentImageUrl = (student) => {
  return getImageUrl(student?.profileImage);
};

const getTeacherName = (teacher) => {
  if (!teacher) return "មិនទាន់កំណត់";

  if (typeof teacher === "string") return "បានកំណត់";

  return teacher.khmerName || teacher.englishName || "បានកំណត់";
};

const normalizeArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.result)) return value.result;
  if (Array.isArray(value?.items)) return value.items;
  return [];
};

const isValidObjectId = (value) => {
  return /^[0-9a-fA-F]{24}$/.test(String(value || ""));
};

const khmerNameCollator = new Intl.Collator("km-KH", {
  numeric: true,
  sensitivity: "base"
});

const getStudentSortText = (record) => {
  const student = record?.student || {};

  return String(
    student.khmerName ||
      student.englishName ||
      student.studentId ||
      student.idCode ||
      getRecordStudentId(record) ||
      ""
  ).trim();
};

const sortAttendanceByStudentName = () => {
  attendance.value = [...attendance.value].sort((firstRecord, secondRecord) => {
    const firstName = getStudentSortText(firstRecord);
    const secondName = getStudentSortText(secondRecord);

    if (!firstName && !secondName) return 0;
    if (!firstName) return 1;
    if (!secondName) return -1;

    const nameCompare = khmerNameCollator.compare(firstName, secondName);

    if (nameCompare !== 0) return nameCompare;

    return String(getRecordStudentId(firstRecord)).localeCompare(
      String(getRecordStudentId(secondRecord))
    );
  });
};

const getRecordStudentId = (record) => {
  return String(
    record?.student?._id ||
      record?.student?.id ||
      record?.studentId ||
      record?.student ||
      ""
  ).trim();
};

const filteredClasses = computed(() => {
  if (!searchQuery.value) return classes.value;

  const keyword = searchQuery.value.toLowerCase();

  return classes.value.filter((cls) => {
    const className = cls.className?.toLowerCase() || "";
    const teacherName =
      cls.teacherName?.toLowerCase() ||
      cls.teacher?.khmerName?.toLowerCase() ||
      cls.teacher?.englishName?.toLowerCase() ||
      "";

    return className.includes(keyword) || teacherName.includes(keyword);
  });
});

const countByStatus = computed(() => {
  return attendance.value.reduce(
    (acc, record) => {
      const status = record.status || "present";

      if (acc[status] !== undefined) {
        acc[status] += 1;
      }

      return acc;
    },
    {
      present: 0,
      absent: 0,
      permission: 0,
      late: 0
    }
  );
});

const sessionLabel = computed(() => {
  if (filters.value.session === "afternoon") return "វេនរសៀល";
  if (filters.value.session === "evening") return "វេនល្ងាច";
  return "វេនព្រឹក";
});

const getSchoolYearFromDate = (date) => {
  const d = new Date(date);

  if (Number.isNaN(d.getTime())) {
    const currentYear = new Date().getFullYear();
    return `${currentYear}-${currentYear + 1}`;
  }

  const year = d.getFullYear();

  return `${year}-${year + 1}`;
};

const getAttendanceSignature = () => {
  return JSON.stringify(
    attendance.value
      .map((record) => ({
        student: getRecordStudentId(record),
        status: record.status || "present",
        remark: String(record.remark || "").trim()
      }))
      .sort((a, b) => a.student.localeCompare(b.student))
  );
};

const syncOriginalAttendanceSignature = () => {
  originalAttendanceSignature.value = getAttendanceSignature();
};

const hasAttendanceChanges = computed(() => {
  if (attendance.value.length === 0) return false;
  return getAttendanceSignature() !== originalAttendanceSignature.value;
});

const markAttendanceChanged = () => {
  // Change tracking is computed from signature.
};

const setRecordStatus = (record, status) => {
  if (record.status === status) return;
  record.status = status;
};

const fetchClasses = async () => {
  try {
    const res = await api.get("/classes");

    classes.value = normalizeArray(res.data);
  } catch (err) {
    toast.error(
      err.response?.data?.err ||
        err.response?.data?.message ||
        "មិនអាចទាញយកបញ្ជីថ្នាក់បានទេ"
    );
  }
};

const openAttendance = (cls) => {
  selectedClass.value = cls;
  fetchData();
};

const closeAttendance = () => {
  selectedClass.value = null;
  attendance.value = [];
  originalAttendanceSignature.value = "";
};

const fetchData = async () => {
  if (!selectedClass.value) return;

  try {
    await getAttendance(
      selectedClass.value._id,
      filters.value.date,
      filters.value.session
    );

    sortAttendanceByStudentName();
    syncOriginalAttendanceSignature();
  } catch (err) {
    toast.error(
      err.response?.data?.err ||
        err.response?.data?.message ||
        "មិនអាចទាញយកវត្តមានបានទេ"
    );
  }
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

const onSave = async () => {
  try {
    if (!selectedClass.value?._id) {
      toast.error("សូមជ្រើសរើសថ្នាក់");
      return;
    }

    if (!isValidObjectId(selectedClass.value._id)) {
      toast.error("Class ID មិនត្រឹមត្រូវ");
      return;
    }

    if (!filters.value.date) {
      toast.error("សូមជ្រើសរើសកាលបរិច្ឆេទ");
      return;
    }

    if (!hasAttendanceChanges.value) {
      return;
    }

    const records = attendance.value
      .map((record) => {
        const studentId = getRecordStudentId(record);

        return {
          student: studentId,
          status: record.status || "present",
          remark: record.remark || ""
        };
      })
      .filter((record) => isValidObjectId(record.student));

    if (records.length === 0) {
      toast.error("មិនមានសិស្សត្រឹមត្រូវសម្រាប់រក្សាទុកវត្តមានទេ");
      return;
    }

    const payload = {
      class: selectedClass.value._id,
      classId: selectedClass.value._id,
      date: filters.value.date,
      session: filters.value.session || "morning",
      schoolYear: getSchoolYearFromDate(filters.value.date),
      records
    };

    await saveAttendance(payload);

    await fetchData();
  } catch (err) {
    toast.error(
      err.response?.data?.err ||
        err.response?.data?.message ||
        err.message ||
        "មិនអាចរក្សាទុកវត្តមានបានទេ"
    );
  }
};

onMounted(() => {
  setNoZoomViewport();
  fetchClasses();
});

onBeforeUnmount(() => {
  restoreViewport();
});
</script>

<style scoped>

.attendance-page-mobile-safe {
  font-family: "Noto Sans Khmer", "Khmer OS Battambang", "Battambang", "Khmer OS", system-ui, sans-serif;
  line-height: 1.45;
}

.attendance-page-mobile-safe h1,
.attendance-page-mobile-safe h3,
.attendance-page-mobile-safe p,
.attendance-page-mobile-safe span,
.attendance-page-mobile-safe label,
.attendance-page-mobile-safe button,
.attendance-page-mobile-safe th,
.attendance-page-mobile-safe td {
  line-height: 1.45;
}

.attendance-page-mobile-safe .break-words {
  overflow-wrap: anywhere;
  word-break: break-word;
}

.attendance-page-mobile-safe input,
.attendance-page-mobile-safe select,
.attendance-page-mobile-safe textarea,
.attendance-page-mobile-safe option,
.attendance-page-mobile-safe input::placeholder {
  font-family: "Noto Sans Khmer", "Khmer OS Battambang", "Battambang", "Khmer OS", system-ui, sans-serif !important;
  font-size: 12px !important;
  line-height: 1.9 !important;
  font-weight: 500;
  -webkit-font-smoothing: antialiased;
  text-rendering: geometricPrecision;
}

.attendance-page-mobile-safe input,
.attendance-page-mobile-safe select {
  min-height: 2.65rem !important;
  height: 2.65rem !important;
  padding-top: 0.58rem !important;
  padding-bottom: 0.58rem !important;
  overflow: visible !important;
}

.attendance-input-safe {
  min-height: 2.65rem !important;
  height: 2.65rem !important;
}

.form-label {
  display: block;
  font-size: 0.64rem;
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
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgb(16 185 129 / 0.12);
}

.summary-box {
  border-width: 1px;
  border-radius: 0.55rem;
  padding: 0.42rem 0.5rem;
  min-width: 0;
}

.summary-label {
  font-size: 0.58rem;
  font-weight: 800;
  line-height: 1.35;
  white-space: nowrap;
}

.summary-value {
  margin-top: 0.2rem;
  font-size: 0.82rem;
  font-weight: 900;
  line-height: 1.25;
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
  padding-left: 2.1rem !important;
  padding-right: 0.75rem !important;
  min-height: 2rem;
}


/* Chrome mobile bottom toolbar fix + no visual input-size changes */
@media (max-width: 640px) {
  .attendance-page-mobile-safe {
    padding-bottom: calc(2.75rem + env(safe-area-inset-bottom));
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }

  .attendance-page-mobile-safe > .max-w-7xl {
    padding-bottom: calc(1.5rem + env(safe-area-inset-bottom));
  }

  .attendance-class-list-mobile-safe,
  .attendance-mobile-list {
    padding-bottom: calc(1rem + env(safe-area-inset-bottom));
  }

  .attendance-class-list-mobile-safe > :last-child,
  .attendance-mobile-list > :last-child,
  .attendance-footer-mobile-safe {
    margin-bottom: calc(1.25rem + env(safe-area-inset-bottom));
  }
}

@media (min-width: 640px) {
  .form-label {
    font-size: 0.68rem;
  }

  .form-input {
    padding: 0.62rem 0.65rem;
    font-size: 12px !important;
    line-height: 1.9 !important;
    min-height: 2.65rem !important;
    height: auto;
  }

  .summary-box {
    padding: 0.5rem 0.75rem;
  }

  .summary-label {
    font-size: 0.62rem;
  }

  .summary-value {
    font-size: 0.9rem;
  }

  .search-input {
    min-height: 2.65rem !important;
  }
}
</style>