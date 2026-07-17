<template>
  <div class="bg-slate-50 p-3 md:p-4">
    <div class="max-w-7xl mx-auto space-y-4">
      <!-- Header -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-3 md:p-4">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 class="text-xl font-extrabold text-slate-800 flex items-center gap-2">
              <span class="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-sm">
                <i class="fa-solid fa-chalkboard-user"></i>
              </span>
              គ្រូបង្រៀនទាំងអស់
            </h1>

            <p class="text-xs text-slate-500 mt-1">
              គ្រប់គ្រងព័ត៌មានគ្រូបង្រៀន បន្ថែម កែប្រែ មើលព័ត៌មានលម្អិត និងលុប
            </p>
          </div>

          <button
            @click="openAddModal"
            :disabled="isSaving"
            class="flex items-center justify-center gap-2 bg-blue-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm w-full sm:w-auto text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="fa-solid fa-user-plus"></i>
            បញ្ចូលគ្រូថ្មី
          </button>
        </div>

        <!-- Search + Total -->
        <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div class="relative">
            <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>

            <input
              v-model="searchQuery"
              type="text"
              placeholder="ស្វែងរកតាមឈ្មោះគ្រូ លេខទូរស័ព្ទ ឬជំនាញ..."
              class="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
            />
          </div>

          <div class="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 text-xs">
            <span class="font-bold text-blue-700">
              <i class="fa-solid fa-users mr-1"></i>
              ចំនួនគ្រូសរុប
            </span>

            <span class="font-extrabold text-blue-700">
              {{ filteredTeachers.length }} នាក់
            </span>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div
        v-if="isLoadingTeachers"
        class="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm"
      >
        <div class="mx-auto mb-3 h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <i class="fa-solid fa-circle-notch fa-spin text-2xl"></i>
        </div>

        <p class="text-sm font-bold text-slate-500">
          កំពុងទាញយកទិន្នន័យគ្រូ...
        </p>
      </div>

      <!-- Teacher Cards -->
      <div
        v-else-if="filteredTeachers.length > 0"
        class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3"
      >
        <TeacherCard
          v-for="teacher in filteredTeachers"
          :key="teacher._id || teacher.id"
          :teacher="teacher"
          @view="openViewModal"
          @edit="openEditModal"
          @delete="openDeleteModal"
        />
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300 shadow-sm"
      >
        <div class="mx-auto mb-3 h-12 w-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
          <i class="fa-solid fa-user-slash text-2xl"></i>
        </div>

        <p class="text-sm font-bold text-slate-600">
          មិនមានទិន្នន័យគ្រូបង្រៀនដែលត្រូវនឹងការស្វែងរកទេ
        </p>

        <button
          @click="openAddModal"
          class="mt-3 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-xs hover:underline"
        >
          <i class="fa-solid fa-plus"></i>
          ចុចទីនេះដើម្បីបញ្ចូលថ្មី
        </button>
      </div>

      <!-- Modals -->
      <TeacherFormModal
        v-if="isFormModalOpen"
        :is-open="isFormModalOpen"
        :is-editing="isEditing"
        :teacher="teacherToEdit"
        @close="closeFormModal"
        @save="saveTeacher"
      />

      <TeacherViewModal
        :is-open="isViewModalOpen"
        :teacher="teacherToView"
        @close="closeViewModal"
      />

      <DeleteConfirmationModal
        :is-open="isDeleteModalOpen"
        :item-name="`${teacherToDelete?.khmerName || ''} ${teacherToDelete?.englishName || ''}`"
        title="លុបគ្រូបង្រៀន?"
        @close="closeDeleteModal"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useToast } from "vue-toastification";

import { useQuery } from "../hooks/useQuery";
import { useCollection } from "../hooks/useCollection";

import TeacherCard from "./teachers/TeacherCard.vue";
import TeacherFormModal from "./teachers/TeacherFormModal.vue";
import TeacherViewModal from "./teachers/TeacherViewModal.vue";
import DeleteConfirmationModal from "./shared/DeleteConfirmationModal.vue";

const toast = useToast();

const {
  data: teachers,
  fetchData,
  loading: queryLoading,
  isLoading: queryIsLoading
} = useQuery("teachers");

const {
  createDoc,
  updateDoc,
  deleteDoc
} = useCollection("teachers", {
  toast: false
});

const isFormModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isViewModalOpen = ref(false);
const isEditing = ref(false);
const teacherToEdit = ref(null);
const teacherToDelete = ref(null);
const teacherToView = ref(null);

const searchQuery = ref("");
const isSaving = ref(false);
const isDeleting = ref(false);

const normalizeArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.result)) return value.result;
  if (Array.isArray(value?.items)) return value.items;
  return [];
};

const teachersList = computed(() => {
  return normalizeArray(teachers.value);
});

const isLoadingTeachers = computed(() => {
  return queryLoading?.value || queryIsLoading?.value || false;
});

const filteredTeachers = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();

  if (!query) return teachersList.value;

  return teachersList.value.filter((teacher) => {
    const khmerName = teacher.khmerName || "";
    const englishName = teacher.englishName || "";
    const phone = teacher.phone || "";
    const telegram = teacher.telegram || "";
    const skill = teacher.skill || "";
    const email = teacher.email || "";

    const searchableText = `
      ${khmerName}
      ${englishName}
      ${phone}
      ${telegram}
      ${skill}
      ${email}
    `.toLowerCase();

    return searchableText.includes(query);
  });
});

const defaultTeacher = () => ({
  khmerName: "",
  englishName: "",
  gender: "ប្រុស",
  nationality: "ខ្មែរ",
  dateOfBirth: "",
  profileImage: "",
  profileImageFile: null,
  email: "",
  phone: "",
  telegram: "",
  skill: "",
  facebook: "",
  currentResidence: {
    village: "",
    commune: "",
    district: "",
    province: ""
  },
  note: ""
});

const openAddModal = () => {
  isEditing.value = false;
  teacherToEdit.value = defaultTeacher();
  isFormModalOpen.value = true;
};

const openEditModal = (teacher) => {
  isEditing.value = true;
  teacherToEdit.value = JSON.parse(JSON.stringify(teacher));
  isFormModalOpen.value = true;
};

const openViewModal = (teacher) => {
  teacherToView.value = teacher;
  isViewModalOpen.value = true;
};

const openDeleteModal = (teacher) => {
  teacherToDelete.value = teacher;
  isDeleteModalOpen.value = true;
};

const forceCloseFormModal = () => {
  isFormModalOpen.value = false;
  isEditing.value = false;
  teacherToEdit.value = null;
};

const closeFormModal = () => {
  if (isSaving.value) return;
  forceCloseFormModal();
};

const closeViewModal = () => {
  isViewModalOpen.value = false;
  teacherToView.value = null;
};

const forceCloseDeleteModal = () => {
  isDeleteModalOpen.value = false;
  teacherToDelete.value = null;
};

const closeDeleteModal = () => {
  if (isDeleting.value) return;
  forceCloseDeleteModal();
};

const getErrorMessage = (
  error,
  fallback = "មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យគ្រូ"
) => {
  return (
    error.response?.data?.err ||
    error.response?.data?.message ||
    error.message ||
    fallback
  );
};

const saveTeacher = async (teacherData) => {
  if (isSaving.value) return;

  const wasEditing = isEditing.value;

  isSaving.value = true;

  try {
    if (wasEditing) {
      const id = teacherToEdit.value?._id || teacherToEdit.value?.id;

      if (!id) {
        throw new Error("Teacher ID is missing");
      }

      await updateDoc(id, teacherData);
    } else {
      await createDoc(teacherData);
    }

    await fetchData();

    forceCloseFormModal();

    toast.success(
      wasEditing
        ? "បានកែប្រែព័ត៌មានគ្រូដោយជោគជ័យ"
        : "បានបញ្ចូលគ្រូថ្មីដោយជោគជ័យ"
    );
  } catch (error) {
    toast.error(getErrorMessage(error));
  } finally {
    isSaving.value = false;
  }
};

const confirmDelete = async () => {
  if (!teacherToDelete.value || isDeleting.value) return;

  isDeleting.value = true;

  try {
    const id = teacherToDelete.value._id || teacherToDelete.value.id;

    if (!id) {
      throw new Error("Teacher ID is missing");
    }

    await deleteDoc(id);
    await fetchData();

    forceCloseDeleteModal();

    toast.success("បានលុបគ្រូដោយជោគជ័យ");
  } catch (error) {
    toast.error(getErrorMessage(error, "មិនអាចលុបគ្រូបានទេ"));
  } finally {
    isDeleting.value = false;
  }
};
</script>