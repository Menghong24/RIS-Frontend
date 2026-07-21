<template>
  <div class="teachers-page-mobile-safe bg-slate-50 p-3 md:p-4">
    <div class="max-w-7xl mx-auto space-y-4">
      <!-- Header -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-3 md:p-4">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div class="min-w-0">
            <h1 class="text-xl font-extrabold text-slate-800 flex items-start gap-2 leading-snug">
              <span class="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-sm">
                <i class="fa-solid fa-chalkboard-user"></i>
              </span>
              គ្រូបង្រៀនទាំងអស់
            </h1>

            <p class="text-xs text-slate-500 mt-1 break-words leading-snug">
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
              class="teacher-search-input w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
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
        class="teachers-empty-mobile-safe text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm"
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
        class="teachers-list-mobile-safe grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3"
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
        class="teachers-empty-mobile-safe text-center py-12 bg-white rounded-xl border border-dashed border-slate-300 shadow-sm"
      >
        <div class="mx-auto mb-3 h-12 w-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
          <i class="fa-solid fa-user-slash text-2xl"></i>
        </div>

        <p class="text-sm font-bold text-slate-600">
          មិនមានទិន្នន័យគ្រូបង្រៀនដែលត្រូវនឹងការស្វែងរកទេ
        </p>

        <button
          @click="openAddModal"
          :disabled="isSaving"
          class="mt-3 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-xs hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
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
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useToast } from "vue-toastification";

import { useQuery } from "../hooks/useQuery";
import { useCollection } from "../hooks/useCollection";

import TeacherCard from "./teachers/TeacherCard.vue";
import TeacherFormModal from "./teachers/TeacherFormModal.vue";
import TeacherViewModal from "./teachers/TeacherViewModal.vue";
import DeleteConfirmationModal from "./shared/DeleteConfirmationModal.vue";

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

// Local UI directory: create/edit/delete updates appear immediately.
// The query ref remains the server source of truth and reconciles silently afterward.
const localTeachers = ref([]);

const normalizeArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.result)) return value.result;
  if (Array.isArray(value?.items)) return value.items;
  return [];
};

watch(
  teachers,
  (value) => {
    localTeachers.value = [...normalizeArray(value)];
  },
  {
    immediate: true,
    deep: true
  }
);

const teachersList = computed(() => {
  return localTeachers.value;
});

// Background reconciliation must not hide the already-updated list.
const isLoadingTeachers = computed(() => {
  const queryIsBusy = queryLoading?.value || queryIsLoading?.value || false;
  return queryIsBusy && localTeachers.value.length === 0;
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

const getTeacherId = (teacher) => {
  return String(teacher?._id || teacher?.id || "").trim();
};

const payloadToPlainObject = (payload) => {
  if (!payload) return {};

  if (typeof FormData !== "undefined" && payload instanceof FormData) {
    const result = {};

    payload.forEach((value, key) => {
      if (
        (typeof File !== "undefined" && value instanceof File) ||
        (typeof Blob !== "undefined" && value instanceof Blob)
      ) {
        return;
      }

      const nestedMatch = key.match(/^([^\[]+)\[([^\]]+)\]$/);

      if (nestedMatch) {
        const [, parentKey, childKey] = nestedMatch;
        result[parentKey] = {
          ...(result[parentKey] || {}),
          [childKey]: value
        };
        return;
      }

      result[key] = value;
    });

    return result;
  }

  if (typeof payload === "object" && !Array.isArray(payload)) {
    return { ...payload };
  }

  return {};
};

const extractSavedTeacher = (response) => {
  const root = response?.data ?? response;
  const candidates = [
    root?.data,
    root?.result,
    root?.item,
    root?.teacher,
    root
  ];

  return (
    candidates.find((candidate) => {
      return candidate && typeof candidate === "object" && !Array.isArray(candidate);
    }) || {}
  );
};

const mergeTeacherData = (baseTeacher = {}, changes = {}) => {
  return {
    ...baseTeacher,
    ...changes,
    currentResidence: {
      ...(baseTeacher.currentResidence || {}),
      ...(changes.currentResidence || {})
    }
  };
};

const upsertTeacherLocally = (teacher, fallbackId = "") => {
  const teacherId = getTeacherId(teacher) || String(fallbackId || "").trim();
  const nextTeacher = {
    ...teacher,
    ...(teacherId && !teacher?._id && !teacher?.id ? { _id: teacherId } : {})
  };

  const existingIndex = localTeachers.value.findIndex((item) => {
    return getTeacherId(item) === teacherId;
  });

  if (existingIndex >= 0) {
    const nextList = [...localTeachers.value];
    nextList.splice(existingIndex, 1, {
      ...nextList[existingIndex],
      ...nextTeacher
    });
    localTeachers.value = nextList;
    return;
  }

  localTeachers.value = [nextTeacher, ...localTeachers.value];
};

const removeTeacherLocally = (teacherId) => {
  const normalizedId = String(teacherId || "").trim();

  localTeachers.value = localTeachers.value.filter((teacher) => {
    return getTeacherId(teacher) !== normalizedId;
  });
};

let silentSyncPromise = null;

const syncTeachersSilently = () => {
  if (silentSyncPromise) return silentSyncPromise;

  silentSyncPromise = Promise.resolve(fetchData())
    .catch((error) => {
      console.error("Teacher background sync failed:", error);
    })
    .finally(() => {
      silentSyncPromise = null;
    });

  return silentSyncPromise;
};

// useCollection toast is disabled above. This helper prevents duplicate
// success/error messages from the same component action.
const activeToastIds = new Map();
const recentToastSignatures = new Map();

const showToastOnce = (type, message, actionKey) => {
  const normalizedMessage = String(message || "").trim();
  const signature = `${type}:${actionKey}:${normalizedMessage}`;
  const now = Date.now();
  const previousTime = recentToastSignatures.get(signature) || 0;

  if (now - previousTime < 1400) return;

  recentToastSignatures.set(signature, now);

  const previousToastId = activeToastIds.get(actionKey);

  if (previousToastId !== undefined && previousToastId !== null) {
    toast.dismiss(previousToastId);
  }

  const toastMethod = type === "error" ? toast.error : toast.success;
  const toastId = toastMethod(normalizedMessage, {
    timeout: 3500,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true
  });

  activeToastIds.set(actionKey, toastId);
};

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
  if (isSaving.value) return;

  // New Teacher is intentionally not admin-only. The current restriction
  // applies only to new Student, Class, Subject and Schedule.
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
  const payloadObject = payloadToPlainObject(teacherData);
  const editingSnapshot = teacherToEdit.value
    ? JSON.parse(JSON.stringify(teacherToEdit.value))
    : null;

  isSaving.value = true;

  try {
    if (wasEditing) {
      const id = getTeacherId(editingSnapshot);

      if (!id) {
        throw new Error("Teacher ID is missing");
      }

      const response = await updateDoc(id, teacherData);
      const responseTeacher = extractSavedTeacher(response);
      const updatedTeacher = mergeTeacherData(
        editingSnapshot,
        mergeTeacherData(payloadObject, responseTeacher)
      );

      upsertTeacherLocally(updatedTeacher, id);
    } else {
      const response = await createDoc(teacherData);
      const responseTeacher = extractSavedTeacher(response);
      const temporaryId =
        getTeacherId(responseTeacher) ||
        `local-teacher-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      const createdTeacher = mergeTeacherData(
        defaultTeacher(),
        mergeTeacherData(payloadObject, responseTeacher)
      );

      upsertTeacherLocally(createdTeacher, temporaryId);
    }

    forceCloseFormModal();

    showToastOnce(
      "success",
      wasEditing
        ? "បានកែប្រែព័ត៌មានគ្រូដោយជោគជ័យ"
        : "បានបញ្ចូលគ្រូថ្មីដោយជោគជ័យ",
      wasEditing ? "teacher-update" : "teacher-create"
    );

    // Update from the API in the background without blocking or hiding the list.
    void syncTeachersSilently();
  } catch (error) {
    showToastOnce(
      "error",
      getErrorMessage(error),
      wasEditing ? "teacher-update-error" : "teacher-create-error"
    );
  } finally {
    isSaving.value = false;
  }
};

const confirmDelete = async () => {
  if (!teacherToDelete.value || isDeleting.value) return;

  const deletingSnapshot = { ...teacherToDelete.value };
  const id = getTeacherId(deletingSnapshot);

  if (!id) {
    showToastOnce("error", "Teacher ID is missing", "teacher-delete-error");
    return;
  }

  isDeleting.value = true;

  try {
    await deleteDoc(id);

    removeTeacherLocally(id);
    forceCloseDeleteModal();

    showToastOnce(
      "success",
      "បានលុបគ្រូដោយជោគជ័យ",
      "teacher-delete"
    );

    // Reconcile silently; no page refresh and no blocking loading state.
    void syncTeachersSilently();
  } catch (error) {
    showToastOnce(
      "error",
      getErrorMessage(error, "មិនអាចលុបគ្រូបានទេ"),
      "teacher-delete-error"
    );
  } finally {
    isDeleting.value = false;
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

.teachers-page-mobile-safe {
  font-family: "Noto Sans Khmer", "Khmer OS Battambang", "Battambang", "Khmer OS", system-ui, sans-serif;
  line-height: 1.45;
}

.teachers-page-mobile-safe h1,
.teachers-page-mobile-safe p,
.teachers-page-mobile-safe span,
.teachers-page-mobile-safe button {
  line-height: 1.45;
}

.teachers-page-mobile-safe .break-words {
  overflow-wrap: anywhere;
  word-break: break-word;
}

.teacher-search-input,
.teacher-search-input::placeholder {
  font-family: "Noto Sans Khmer", "Khmer OS Battambang", "Battambang", "Khmer OS", system-ui, sans-serif !important;
  font-size: 12px !important;
  line-height: 1.9 !important;
  font-weight: 500;
  -webkit-font-smoothing: antialiased;
  text-rendering: geometricPrecision;
}

.teacher-search-input {
  min-height: 2.65rem !important;
  height: 2.65rem !important;
  padding-top: 0.58rem !important;
  padding-bottom: 0.58rem !important;
  overflow: visible !important;
}

/* Chrome mobile bottom toolbar fix - small screens only, compact spacing */
@media (max-width: 640px) {
  .teachers-page-mobile-safe {
    padding-bottom: calc(2.75rem + env(safe-area-inset-bottom));
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }

  .teachers-page-mobile-safe > .max-w-7xl {
    padding-bottom: calc(1.5rem + env(safe-area-inset-bottom));
  }

  .teachers-list-mobile-safe {
    padding-bottom: calc(1rem + env(safe-area-inset-bottom));
  }

  .teachers-list-mobile-safe > :last-child,
  .teachers-empty-mobile-safe {
    margin-bottom: calc(1.25rem + env(safe-area-inset-bottom));
  }
}

/* Toasts must stay above Header, Sidebar and body-level forms/modals. */
:global(.Vue-Toastification__container) {
  z-index: 12050 !important;
  pointer-events: none;
}

:global(.Vue-Toastification__toast) {
  pointer-events: auto;
  font-family: "Noto Sans Khmer", "Khmer OS Battambang", "Battambang", "Khmer OS", system-ui, sans-serif !important;
  line-height: 1.45 !important;
  overflow-wrap: anywhere;
  word-break: break-word;
}

:global(.Vue-Toastification__toast-body) {
  font-family: inherit !important;
  line-height: 1.45 !important;
}

@media (max-width: 640px) {
  :global(.Vue-Toastification__container.top-right),
  :global(.Vue-Toastification__container.top-center) {
    top: calc(0.75rem + env(safe-area-inset-top)) !important;
    left: 0.75rem !important;
    right: 0.75rem !important;
    width: auto !important;
  }

  :global(.Vue-Toastification__toast) {
    margin-bottom: 0.5rem !important;
  }
}

</style>
