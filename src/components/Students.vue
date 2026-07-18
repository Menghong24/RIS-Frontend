<template>
  <div class="students-page-mobile-safe bg-slate-50 p-2 sm:p-3 md:p-4">
    <div class="max-w-7xl mx-auto space-y-3 md:space-y-4">
      <!-- Header + Filters -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-2.5 sm:p-3 md:p-4">
        <div class="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-2.5 sm:gap-3">
          <div class="min-w-0">
            <h1 class="text-base sm:text-lg md:text-xl font-extrabold text-slate-800 flex items-center gap-2">
              <span class="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs sm:text-sm shrink-0">
                <i class="fa-solid fa-user-graduate"></i>
              </span>
              <span class="truncate">
                បញ្ជីឈ្មោះសិស្សទាំងអស់
              </span>
            </h1>

            <p class="text-[11px] sm:text-xs text-slate-500 mt-1 leading-5">
              ស្វែងរក តម្រង និងគ្រប់គ្រងព័ត៌មានសិស្សទាំងអស់ក្នុងប្រព័ន្ធ
            </p>
          </div>

          <button
            @click="openAddModal"
            class="flex items-center justify-center gap-1.5 sm:gap-2 w-full sm:w-auto bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm text-[11px] sm:text-xs font-bold whitespace-nowrap"
          >
            <i class="fa-solid fa-user-plus text-[11px] sm:text-xs"></i>
            បញ្ចូលសិស្សថ្មី
          </button>
        </div>

        <div class="mt-3 sm:mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          <!-- Search -->
          <div class="relative col-span-2 sm:col-span-1">
            <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] sm:text-xs"></i>

            <input
              v-model="searchQuery"
              type="text"
              placeholder="ស្វែងរកតាមឈ្មោះ ឬអត្តលេខ..."
              class="w-full pl-8 sm:pl-9 pr-3 py-1.5 sm:py-2 border border-slate-200 rounded-lg text-[11px] sm:text-xs text-slate-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
            />
          </div>

          <!-- Class Filter -->
          <select
            v-model="classFilter"
            class="w-full border border-slate-200 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs text-slate-700 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
          >
            <option value="All">ថ្នាក់ទាំងអស់</option>

            <option
              v-for="c in classesList"
              :key="c._id"
              :value="c._id"
            >
              {{ c.className }} ({{ c.classGrade }})
            </option>
          </select>

          <!-- Gender Filter -->
          <select
            v-model="genderFilter"
            class="w-full border border-slate-200 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs text-slate-700 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
          >
            <option value="All">ភេទទាំងអស់</option>
            <option value="ប្រុស">ប្រុស</option>
            <option value="ស្រី">ស្រី</option>
          </select>

          <!-- Total -->
          <div class="col-span-2 sm:col-span-1 flex items-center justify-between bg-blue-50 border border-blue-100 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs">
            <span class="font-bold text-blue-700">
              <i class="fa-solid fa-users mr-1"></i>
              សរុប
            </span>

            <span class="font-extrabold text-blue-700">
              {{ filteredStudents.length }} នាក់
            </span>
          </div>
        </div>
      </div>

      <!-- Mobile Student Cards -->
      <div class="students-mobile-list lg:hidden space-y-2">
        <div
          v-if="paginatedStudents.length > 0"
          class="grid grid-cols-1 gap-2"
        >
          <div
            v-for="student in paginatedStudents"
            :key="student._id"
            class="bg-white rounded-xl border border-slate-200 shadow-sm p-2.5 active:bg-blue-50/40 transition"
            @click="openViewModal(student)"
          >
            <div class="flex items-start gap-2">
              <div
                class="h-9 w-9 rounded-full overflow-hidden border border-blue-100 bg-blue-50 text-blue-700 flex items-center justify-center font-extrabold shrink-0"
              >
                <img
                  v-if="getStudentImageUrl(student)"
                  :src="getStudentImageUrl(student)"
                  class="h-full w-full object-cover"
                  :alt="getStudentFullName(student)"
                />

                <span v-else class="text-[11px]">
                  {{ getStudentInitial(student) }}
                </span>
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-2">
                  <div class="min-w-0">
                    <p class="text-sm font-extrabold text-slate-800 leading-tight truncate">
                      {{ student.khmerName || "-" }}
                    </p>

                    <p
                      v-if="student.englishName"
                      class="text-[10px] text-slate-400 truncate mt-0.5"
                    >
                      {{ student.englishName }}
                    </p>
                  </div>

                  <div class="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      @click.stop="openEditModal(student)"
                      class="h-7 w-7 inline-flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition"
                      title="កែប្រែ"
                    >
                      <i class="fa-solid fa-pen-to-square text-[11px]"></i>
                    </button>

                    <button
                      type="button"
                      @click.stop="openDeleteModal(student)"
                      class="h-7 w-7 inline-flex items-center justify-center rounded-lg bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 transition"
                      title="លុប"
                    >
                      <i class="fa-solid fa-trash text-[11px]"></i>
                    </button>
                  </div>
                </div>

                <div class="mt-1.5 flex flex-wrap items-center gap-1">
                  <span class="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 text-[10px] font-bold leading-none">
                    <i class="fa-solid fa-id-card text-[9px] text-slate-400"></i>
                    {{ student.studentId || "-" }}
                  </span>

                  <span
                    :class="
                      student.gender === 'ស្រី'
                        ? 'bg-pink-50 text-pink-700 border-pink-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    "
                    class="inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-bold leading-none"
                  >
                    <i class="fa-solid fa-user text-[9px]"></i>
                    {{ student.gender || "-" }}
                  </span>

                  <span
                    v-if="getStudentClassName(student)"
                    class="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 text-[10px] font-bold leading-none"
                  >
                    <i class="fa-solid fa-school text-[9px]"></i>
                    {{ getStudentClassName(student) }}
                  </span>

                  <span
                    v-if="getStudentClassGrade(student)"
                    class="inline-flex items-center rounded-full bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.5 text-[10px] font-bold leading-none"
                  >
                    {{ getStudentClassGrade(student) }}
                  </span>
                </div>

                <div class="mt-1.5 grid grid-cols-1 min-[390px]:grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] text-slate-500">
                  <div class="flex items-center gap-1 min-w-0">
                    <i class="fa-solid fa-cake-candles text-[9px] text-slate-400 w-3 shrink-0"></i>
                    <span class="truncate">
                      កំណើត៖ {{ formatDate(student.birthDate || student.dob) }}
                    </span>
                  </div>

                  <div class="flex items-center gap-1 min-w-0">
                    <i class="fa-solid fa-calendar-plus text-[9px] text-slate-400 w-3 shrink-0"></i>
                    <span class="truncate">
                      ចូលរៀន៖ {{ formatDate(student.joinDate) }}
                    </span>
                  </div>

                  <div class="flex items-center gap-1 min-w-0">
                    <i class="fa-solid fa-flag text-[9px] text-slate-400 w-3 shrink-0"></i>
                    <span class="truncate">
                      សញ្ជាតិ៖ {{ student.nationality?.student || "ខ្មែរ" }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-else
          class="text-center text-slate-400 py-8 bg-white rounded-xl border border-dashed border-slate-300"
        >
          <div class="mx-auto mb-2 h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center">
            <i class="fa-solid fa-users-slash text-lg"></i>
          </div>

          <p class="text-xs font-bold text-slate-600">
            មិនមានសិស្សដែលត្រូវនឹងតម្រងទេ
          </p>
        </div>
      </div>

      <!-- Desktop Table -->
      <div class="hidden lg:block overflow-x-auto rounded-xl shadow-sm border border-slate-200 bg-white w-full">
        <table class="w-full text-left border-collapse text-xs min-w-[1050px]">
          <thead>
            <tr class="bg-slate-100 text-slate-700 border-b border-slate-200">
              <th class="p-2 font-bold w-16">រូបថត</th>
              <th class="p-2 font-bold hidden lg:table-cell">អត្តលេខ</th>
              <th class="p-2 font-bold">ឈ្មោះខ្មែរ</th>
              <th class="p-2 font-bold hidden lg:table-cell">ឈ្មោះអង់គ្លេស</th>
              <th class="p-2 font-bold hidden lg:table-cell">ភេទ</th>
              <th class="p-2 font-bold hidden lg:table-cell">ថ្ងៃខែឆ្នាំកំណើត</th>
              <th class="p-2 font-bold hidden lg:table-cell">សញ្ជាតិ</th>
              <th class="p-2 font-bold hidden lg:table-cell">ថ្ងៃចូលរៀន</th>
              <th class="p-2 font-bold hidden lg:table-cell">បន្ទប់</th>
              <th class="p-2 font-bold hidden lg:table-cell">កម្រិត</th>
              <th class="p-2 text-right font-bold">កែប្រែ</th>
              <th class="p-2 text-right font-bold pr-4">លុប</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <StudentCard
              v-for="student in paginatedStudents"
              :key="student._id"
              :student="student"
              @view="openViewModal"
              @edit="openEditModal"
              @delete="openDeleteModal"
            />
          </tbody>
        </table>
      </div>

      <!-- Empty Desktop -->
      <div
        v-if="filteredStudents.length === 0"
        class="hidden lg:block text-center text-slate-400 py-10 bg-white rounded-xl border border-dashed border-slate-300"
      >
        <div class="mx-auto mb-2 h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
          <i class="fa-solid fa-users-slash text-xl"></i>
        </div>

        <p class="text-sm font-bold text-slate-600">
          មិនមានសិស្សដែលត្រូវនឹងតម្រងទេ
        </p>
      </div>

      <!-- Pagination -->
      <div
        v-if="filteredStudents.length > 0"
        class="students-pagination-mobile-safe flex flex-col sm:flex-row flex-wrap items-center justify-between bg-white p-2.5 sm:p-3 rounded-xl shadow-sm border border-slate-200 gap-2 sm:gap-3"
      >
        <div class="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-center sm:justify-start">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-2 sm:px-3 py-1.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold transition text-[11px] sm:text-xs flex items-center gap-1"
          >
            <i class="fa-solid fa-chevron-left text-[10px]"></i>
            <span class="hidden min-[380px]:inline">ថយក្រោយ</span>
          </button>

          <span class="text-slate-700 font-bold text-[11px] sm:text-xs whitespace-nowrap px-1">
            {{ currentPage }} / {{ totalPages }}
          </span>

          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-2 sm:px-3 py-1.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold transition text-[11px] sm:text-xs flex items-center gap-1"
          >
            <span class="hidden min-[380px]:inline">បន្ទាប់</span>
            <i class="fa-solid fa-chevron-right text-[10px]"></i>
          </button>
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
          <label class="text-[11px] sm:text-xs text-slate-600 font-bold whitespace-nowrap">
            បង្ហាញ:
          </label>

          <select
            v-model.number="rowsPerPage"
            class="border border-slate-200 rounded-lg px-2 py-1.5 text-[11px] sm:text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
          >
            <option :value="10">10</option>
            <option :value="15">15</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
        </div>
      </div>

      <!-- Modals -->
      <StudentFormModal
        :is-open="isFormModalOpen"
        :is-editing="isEditing"
        :student="studentToEdit"
        @close="closeFormModal"
        @save="saveStudent"
      />

      <StudentViewModal
        :is-open="isViewModalOpen"
        :student="studentToView"
        @close="closeViewModal"
      />

      <DeleteConfirmationModal
        :is-open="isDeleteModalOpen"
        :item-name="deleteStudentName"
        title="លុបសិស្ស?"
        @close="closeDeleteModal"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useToast } from "vue-toastification";
import StudentCard from "./students/StudentCard.vue";
import StudentFormModal from "./students/StudentFormModal.vue";
import StudentViewModal from "./students/StudentViewModal.vue";
import DeleteConfirmationModal from "./shared/DeleteConfirmationModal.vue";
import api from "../config/api";

import { useQuery } from "../hooks/useQuery.js";
import { useCollection } from "../hooks/useCollection.js";

const toast = useToast();

// --- Modal States ---
const isFormModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isViewModalOpen = ref(false);
const isEditing = ref(false);
const studentToEdit = ref(null);
const studentToDelete = ref(null);
const studentToView = ref(null);

// --- Data Fetching ---
const { data: students, fetchData: refetchStudents } = useQuery("students");
const { data: classesData } = useQuery("classes");

// Collection Actions
const { createDoc, updateDoc, deleteDoc } = useCollection("students", {
  toast: false
});

// --- Filters ---
const searchQuery = ref("");
const statusFilter = ref("All");
const genderFilter = ref("All");
const classFilter = ref("All");

// Safely access list
const normalizeArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.result)) return value.result;
  if (Array.isArray(value?.items)) return value.items;
  return [];
};

const classesList = computed(() => normalizeArray(classesData.value));
const studentsList = computed(() => normalizeArray(students.value));

// --- Helpers ---
const getId = (value) => {
  return String(value?._id || value?.id || value || "").trim();
};

const getStudentClassObject = (student) => {
  if (student?.grade && typeof student.grade === "object") return student.grade;
  if (student?.class && typeof student.class === "object") return student.class;
  if (student?.classId && typeof student.classId === "object") return student.classId;
  return null;
};

const getStudentClassId = (student) => {
  return (
    getId(student?.grade) ||
    getId(student?.class) ||
    getId(student?.classId) ||
    ""
  );
};

const getStudentClassName = (student) => {
  const classObject = getStudentClassObject(student);

  if (classObject?.className) return classObject.className;

  const classId = getStudentClassId(student);
  const foundClass = classesList.value.find((cls) => getId(cls) === classId);

  return foundClass?.className || "";
};

const getStudentClassGrade = (student) => {
  const classObject = getStudentClassObject(student);

  if (classObject?.classGrade) return classObject.classGrade;

  const classId = getStudentClassId(student);
  const foundClass = classesList.value.find((cls) => getId(cls) === classId);

  return foundClass?.classGrade || "";
};

const getStudentFullName = (student) => {
  return `${student?.khmerName || ""} ${student?.englishName || ""}`.trim();
};

const getStudentInitial = (student) => {
  return (
    student?.khmerName?.charAt(0) ||
    student?.englishName?.charAt(0)?.toUpperCase() ||
    "S"
  );
};

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

const formatDate = (date) => {
  if (!date) return "-";

  const d = new Date(date);

  if (Number.isNaN(d.getTime())) {
    return "-";
  }

  return d.toLocaleDateString("km-KH", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
};

const deleteStudentName = computed(() => {
  const name = `${studentToDelete.value?.khmerName || ""} ${studentToDelete.value?.englishName || ""}`.trim();

  return name || "សិស្សនេះ";
});

// --- Pagination ---
const currentPage = ref(1);
const rowsPerPage = ref(10);

// --- Filter + Paginate Logic ---
const filteredStudents = computed(() => {
  return studentsList.value.filter((student) => {
    const fullName = `${student.khmerName || ""} ${student.englishName || ""}`.toLowerCase();
    const keyword = searchQuery.value.toLowerCase().trim();

    const nameMatch =
      !keyword ||
      fullName.includes(keyword) ||
      String(student.studentId || "").toLowerCase().includes(keyword);

    const statusMatch =
      statusFilter.value === "All" ||
      student.status?.toLowerCase() === statusFilter.value.toLowerCase();

    const classMatch =
      classFilter.value === "All" ||
      getStudentClassId(student) === String(classFilter.value);

    const genderMatch =
      genderFilter.value === "All" || student.gender === genderFilter.value;

    return nameMatch && statusMatch && classMatch && genderMatch;
  });
});

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredStudents.value.length / rowsPerPage.value));
});

const start = computed(() => {
  return (currentPage.value - 1) * rowsPerPage.value;
});

const paginatedStudents = computed(() => {
  return filteredStudents.value.slice(start.value, start.value + rowsPerPage.value);
});

// Reset to page 1 when filters change
watch([searchQuery, statusFilter, genderFilter, classFilter, rowsPerPage], () => {
  currentPage.value = 1;
});

// --- Pagination Actions ---
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// --- Modal Handlers ---
const openAddModal = () => {
  isEditing.value = false;

  studentToEdit.value = {
    khmerName: "",
    englishName: "",
    studentId: "",
    gender: "ប្រុស",
    dob: "",
    joinDate: "",
    grade: "",
    email: "",
    status: "active",
    profileImage: "",
    nationality: {
      student: "ខ្មែរ"
    },
    family: {
      motherFacebook: "",
      motherName: "",
      motherNumber: ""
    },
    placeOfBirth: {
      village: "",
      commune: "",
      district: "",
      province: ""
    },
    currentResidence: {
      village: "",
      commune: "",
      district: "",
      province: ""
    }
  };

  isFormModalOpen.value = true;
};

const openEditModal = (student) => {
  isEditing.value = true;
  studentToEdit.value = JSON.parse(JSON.stringify(student));

  if (studentToEdit.value.grade && typeof studentToEdit.value.grade === "object") {
    studentToEdit.value.grade = studentToEdit.value.grade._id;
  }

  isFormModalOpen.value = true;
};

const openViewModal = (student) => {
  studentToView.value = student;
  isViewModalOpen.value = true;
};

const openDeleteModal = (student) => {
  studentToDelete.value = student;
  isDeleteModalOpen.value = true;
};

const closeFormModal = () => {
  isFormModalOpen.value = false;
};

const closeViewModal = () => {
  isViewModalOpen.value = false;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  studentToDelete.value = null;
};

const getErrorMessage = (
  error,
  fallback = "មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ"
) => {
  return (
    error.response?.data?.err ||
    error.response?.data?.message ||
    error.message ||
    fallback
  );
};

// --- CRUD Actions ---
const saveStudent = async (studentData) => {
  try {
    if (isEditing.value) {
      const studentId = studentToEdit.value?._id || studentToEdit.value?.id;

      if (!studentId) {
        throw new Error("Student ID is missing");
      }

      await updateDoc(studentId, studentData);
    } else {
      await createDoc(studentData);
    }

    await refetchStudents();
    closeFormModal();

    toast.success(
      isEditing.value
        ? "បានកែប្រែសិស្សដោយជោគជ័យ"
        : "បានបញ្ចូលសិស្សថ្មីដោយជោគជ័យ"
    );
  } catch (error) {
    toast.error(getErrorMessage(error));
  }
};

const confirmDelete = async () => {
  if (!studentToDelete.value?._id) return;

  try {
    await deleteDoc(studentToDelete.value._id);
    await refetchStudents();
    closeDeleteModal();

    toast.success("បានលុបសិស្សដោយជោគជ័យ");
  } catch (error) {
    toast.error(getErrorMessage(error, "មិនអាចលុបសិស្សបានទេ"));
  }
};
</script>

<style scoped>

/* Chrome mobile bottom toolbar fix - small screens only, compact spacing */
@media (max-width: 640px) {
  .students-page-mobile-safe {
    padding-bottom: calc(2.75rem + env(safe-area-inset-bottom));
  }

  .students-page-mobile-safe > .max-w-7xl {
    padding-bottom: calc(1.5rem + env(safe-area-inset-bottom));
  }

  .students-mobile-list {
    padding-bottom: calc(1rem + env(safe-area-inset-bottom));
  }

  .students-pagination-mobile-safe {
    padding-bottom: calc(0.75rem + env(safe-area-inset-bottom)) !important;
    margin-bottom: calc(1.5rem + env(safe-area-inset-bottom));
  }
}

.font-khmer {
  font-family: "Battambang", "Siemreap", sans-serif;
}
</style>