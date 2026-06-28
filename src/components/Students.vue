<template>
  <div class="bg-slate-50 p-3 md:p-4">
    <div class="max-w-7xl mx-auto space-y-4">
      <!-- Header + Filters -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-3 md:p-4">
        <div class="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-3">
          <div>
            <h1 class="text-xl font-extrabold text-slate-800 flex items-center gap-2">
              <span class="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-sm">
                <i class="fa-solid fa-user-graduate"></i>
              </span>
              បញ្ជីឈ្មោះសិស្សទាំងអស់
            </h1>

            <p class="text-xs text-slate-500 mt-1">
              ស្វែងរក តម្រង និងគ្រប់គ្រងព័ត៌មានសិស្សទាំងអស់ក្នុងប្រព័ន្ធ
            </p>
          </div>

          <button
            @click="openAddModal"
            class="flex items-center justify-center gap-2 w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm text-xs font-bold whitespace-nowrap"
          >
            <i class="fa-solid fa-user-plus"></i>
            បញ្ចូលសិស្សថ្មី
          </button>
        </div>

        <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <!-- Search -->
          <div class="relative">
            <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>

            <input
              v-model="searchQuery"
              type="text"
              placeholder="ស្វែងរកតាមឈ្មោះ ឬអត្តលេខ..."
              class="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
            />
          </div>

          <!-- Class Filter -->
          <select
            v-model="classFilter"
            class="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
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
            class="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
          >
            <option value="All">ភេទទាំងអស់</option>
            <option value="ប្រុស">ប្រុស</option>
            <option value="ស្រី">ស្រី</option>
          </select>

          <!-- Total -->
          <div class="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 text-xs">
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

      <!-- Table -->
      <div class="overflow-x-auto rounded-xl shadow-sm border border-slate-200 bg-white w-full">
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

      <!-- Empty -->
      <div
        v-if="filteredStudents.length === 0"
        class="text-center text-slate-400 py-10 bg-white rounded-xl border border-dashed border-slate-300"
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
        class="flex flex-col sm:flex-row flex-wrap items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-slate-200 gap-3"
      >
        <div class="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold transition text-xs flex items-center gap-1"
          >
            <i class="fa-solid fa-chevron-left"></i>
            ថយក្រោយ
          </button>

          <span class="text-slate-700 font-bold text-xs whitespace-nowrap">
            ទំព័រ {{ currentPage }} នៃ {{ totalPages }}
          </span>

          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold transition text-xs flex items-center gap-1"
          >
            បន្ទាប់
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
          <label class="text-xs text-slate-600 font-bold whitespace-nowrap">
            បង្ហាញចំនួន:
          </label>

          <select
            v-model.number="rowsPerPage"
            class="border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
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
        :item-name="`${studentToDelete?.khmerName || ''} ${studentToDelete?.englishName || ''}`"
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

// Safely access classes list
const classesList = computed(() => classesData.value || []);

// --- Pagination ---
const currentPage = ref(1);
const rowsPerPage = ref(10);

// --- Filter + Paginate Logic ---
const filteredStudents = computed(() => {
  if (!students.value) return [];

  return students.value.filter((s) => {
    const fullName = `${s.khmerName || ""} ${s.englishName || ""}`.toLowerCase();

    const nameMatch =
      fullName.includes(searchQuery.value.toLowerCase()) ||
      (s.studentId && s.studentId.toString().includes(searchQuery.value));

    const statusMatch =
      statusFilter.value === "All" ||
      s.status?.toLowerCase() === statusFilter.value.toLowerCase();

    const studentGradeId = s.grade?._id || s.grade;
    const classMatch = classFilter.value === "All" || studentGradeId === classFilter.value;

    const genderMatch = genderFilter.value === "All" || s.gender === genderFilter.value;

    return nameMatch && statusMatch && classMatch && genderMatch;
  });
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredStudents.value.length / rowsPerPage.value))
);

const start = computed(() => (currentPage.value - 1) * rowsPerPage.value);

const paginatedStudents = computed(() =>
  filteredStudents.value.slice(start.value, start.value + rowsPerPage.value)
);

// Reset to page 1 when filters change
watch([searchQuery, statusFilter, genderFilter, classFilter, rowsPerPage], () => {
  currentPage.value = 1;
});

// --- Pagination Actions ---
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
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
};

const getErrorMessage = (error, fallback = "មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ") => {
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
.font-khmer {
  font-family: "Battambang", "Siemreap", sans-serif;
}
</style>