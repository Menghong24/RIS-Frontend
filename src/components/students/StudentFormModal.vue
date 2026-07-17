<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-2 sm:p-3"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white rounded-t-2xl sm:rounded-xl shadow-xl w-full max-w-5xl max-h-[94dvh] sm:max-h-[88vh] overflow-hidden border border-slate-100 flex flex-col"
    >
      <!-- Header -->
      <div
        class="px-2.5 sm:px-3 py-2.5 border-b border-slate-100 bg-slate-50 flex items-start justify-between gap-2 shrink-0"
      >
        <div class="min-w-0">
          <h2 class="text-sm sm:text-base font-extrabold text-slate-800 flex items-center gap-2">
            <span
              class="h-7 w-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs shrink-0"
            >
              <i :class="isEditing ? 'fa-solid fa-user-pen' : 'fa-solid fa-user-plus'"></i>
            </span>

            <span class="truncate">
              {{ isEditing ? "កែប្រែទិន្នន័យសិស្ស" : "បញ្ចូលសិស្សថ្មី" }}
            </span>
          </h2>

          <p class="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">
            សូមបំពេញព័ត៌មានសិស្ស និងព័ត៌មានអាណាព្យាបាល
          </p>
        </div>

        <button
          type="button"
          @click="$emit('close')"
          class="h-7 w-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition shrink-0"
        >
          <i class="fa-solid fa-xmark text-sm"></i>
        </button>
      </div>

      <form
        @submit.prevent="handleSubmit"
        class="p-2.5 sm:p-3 space-y-2.5 sm:space-y-3 overflow-y-auto modal-scroll"
      >
        <!-- Student Image -->
        <div class="form-section">
          <div class="flex items-center gap-2.5 sm:gap-3">
            <div
              class="h-14 w-14 sm:h-20 sm:w-20 rounded-full overflow-hidden bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0"
            >
              <img
                v-if="imagePreviewUrl"
                :src="imagePreviewUrl"
                class="h-full w-full object-cover"
                alt="Student profile"
              />

              <span
                v-else
                class="text-base sm:text-xl font-extrabold text-blue-600"
              >
                {{ studentInitial }}
              </span>
            </div>

            <div class="min-w-0 flex-1">
              <p class="text-[11px] sm:text-xs font-extrabold text-slate-800">
                រូបសិស្ស
              </p>

              <p class="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 leading-5">
                JPG, PNG ឬ WEBP។ ទំហំមិនលើស 2MB។
              </p>

              <div class="mt-1.5 sm:mt-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
                <label
                  class="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-blue-600 text-white text-[11px] sm:text-xs font-bold cursor-pointer hover:bg-blue-700 transition"
                >
                  <i class="fa-solid fa-camera text-[10px] sm:text-xs"></i>
                  ជ្រើសរូប

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    class="hidden"
                    @change="handleImageChange"
                  />
                </label>

                <button
                  v-if="selectedImageFile"
                  type="button"
                  @click="clearSelectedImage"
                  class="px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-[11px] sm:text-xs font-bold hover:bg-slate-200 transition"
                >
                  សម្អាតរូបថ្មី
                </button>
              </div>

              <p
                v-if="imageError"
                class="text-[10px] sm:text-[11px] font-bold text-red-600 mt-1.5 sm:mt-2"
              >
                {{ imageError }}
              </p>
            </div>
          </div>
        </div>

        <!-- Student Info -->
        <div class="form-section">
          <div class="section-heading">
            <span class="section-icon">
              <i class="fa-solid fa-id-card"></i>
            </span>

            <h3 class="section-title">
              ព័ត៌មានសិស្ស
            </h3>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            <div>
              <label class="field-label">
                ឈ្មោះខ្មែរ <span class="text-red-500">*</span>
              </label>

              <input
                type="text"
                v-model="form.khmerName"
                placeholder="ឈ្មោះខ្មែរ"
                class="form-input"
                required
              />
            </div>

            <div>
              <label class="field-label">
                ឈ្មោះឡាតាំង <span class="text-red-500">*</span>
              </label>

              <input
                type="text"
                v-model="form.englishName"
                placeholder="ឈ្មោះឡាតាំង"
                class="form-input"
                required
              />
            </div>

            <div>
              <label class="field-label">
                អត្តលេខ <span class="text-red-500">*</span>
              </label>

              <input
                type="text"
                v-model="form.studentId"
                placeholder="អត្តលេខ"
                class="form-input"
                required
              />
            </div>

            <div>
              <label class="field-label">
                សញ្ជាតិ <span class="text-red-500">*</span>
              </label>

              <input
                type="text"
                v-model="form.nationality.student"
                placeholder="សញ្ជាតិ"
                class="form-input"
                required
              />
            </div>

            <div>
              <label class="field-label">
                ភេទ <span class="text-red-500">*</span>
              </label>

              <select
                v-model="form.gender"
                class="form-input"
                required
              >
                <option disabled value="">ជ្រើសរើសភេទ</option>
                <option value="ស្រី">ស្រី</option>
                <option value="ប្រុស">ប្រុស</option>
                <option value="Other">ផ្សេងៗ</option>
              </select>
            </div>

            <div>
              <label class="field-label">
                ថ្នាក់រៀន
              </label>

              <select
                v-model="form.grade"
                class="form-input"
              >
                <option value="">មិនទាន់កំណត់ថ្នាក់</option>

                <option
                  v-for="cls in classesOptions"
                  :key="cls._id"
                  :value="cls._id"
                >
                  {{ cls.className }} - {{ cls.classGrade || "N/A" }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Date & Address -->
        <div class="form-section">
          <div class="section-heading">
            <span class="section-icon">
              <i class="fa-solid fa-location-dot"></i>
            </span>

            <h3 class="section-title">
              ថ្ងៃខែឆ្នាំកំណើត និងទីលំនៅបច្ចុប្បន្ន
            </h3>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            <div>
              <label class="field-label">
                ថ្ងៃកំណើត <span class="text-red-500">*</span>
              </label>

              <input
                type="date"
                v-model="form.dob"
                class="form-input"
                required
              />
            </div>

            <div>
              <label class="field-label">
                ភូមិ
              </label>

              <input
                type="text"
                v-model="form.currentResidence.village"
                placeholder="ភូមិ"
                class="form-input"
                required
              />
            </div>

            <div>
              <label class="field-label">
                ឃុំ/សង្កាត់
              </label>

              <input
                type="text"
                v-model="form.currentResidence.commune"
                placeholder="ឃុំ/សង្កាត់"
                class="form-input"
                required
              />
            </div>

            <div>
              <label class="field-label">
                ស្រុក/ខណ្ឌ
              </label>

              <input
                type="text"
                v-model="form.currentResidence.district"
                placeholder="ស្រុក/ខណ្ឌ"
                class="form-input"
                required
              />
            </div>

            <div>
              <label class="field-label">
                ខេត្ត/ក្រុង
              </label>

              <input
                type="text"
                v-model="form.currentResidence.province"
                placeholder="ខេត្ត/ក្រុង"
                class="form-input"
                required
              />
            </div>

            <div>
              <label class="field-label">
                ថ្ងៃចូលរៀន <span class="text-red-500">*</span>
              </label>

              <input
                type="date"
                v-model="form.joinDate"
                class="form-input"
                required
              />
            </div>
          </div>
        </div>

        <!-- Guardian Info -->
        <div class="form-section">
          <div class="section-heading">
            <span class="section-icon">
              <i class="fa-solid fa-user-shield"></i>
            </span>

            <h3 class="section-title">
              ព័ត៌មានអាណាព្យាបាល
            </h3>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div>
              <label class="field-label">
                ឈ្មោះអាណាព្យាបាល
              </label>

              <input
                type="text"
                v-model="form.family.motherName"
                placeholder="ឈ្មោះអាណាព្យាបាល"
                class="form-input"
              />
            </div>

            <div>
              <label class="field-label">
                លេខទូរស័ព្ទ
              </label>

              <input
                type="text"
                v-model="form.family.motherNumber"
                placeholder="លេខទូរស័ព្ទ"
                class="form-input"
              />
            </div>

            <div class="col-span-2 sm:col-span-1">
              <label class="field-label">
                Facebook
              </label>

              <input
                type="text"
                v-model="form.family.motherFacebook"
                placeholder="Facebook Account"
                class="form-input"
              />
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div
          class="sticky bottom-0 -mx-2.5 sm:-mx-3 px-2.5 sm:px-3 py-2.5 bg-white border-t border-slate-100 flex justify-end gap-2"
        >
          <button
            type="button"
            @click="$emit('close')"
            class="px-3 sm:px-3.5 py-1.5 text-[11px] sm:text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            បោះបង់
          </button>

          <button
            type="submit"
            :disabled="isSaving"
            class="px-3.5 sm:px-4 py-1.5 text-[11px] sm:text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 sm:gap-2"
          >
            <i
              v-if="isSaving"
              class="fa-solid fa-circle-notch fa-spin text-[10px] sm:text-xs"
            ></i>

            <i
              v-else
              class="fa-solid fa-floppy-disk text-[10px] sm:text-xs"
            ></i>

            {{ isSaving ? "កំពុងរក្សាទុក..." : (isEditing ? "រក្សាទុកការកែប្រែ" : "បញ្ចូលសិស្សថ្មី") }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from "vue";
import { useCollection } from "../../hooks/useCollection";
import { useQuery } from "../../hooks/useQuery";
import { useToast } from "vue-toastification";
import api from "../../config/api";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  student: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(["close", "save"]);

const students = useCollection("students");
const classesQuery = useQuery("classes");
const toast = useToast();

const initialFormState = {
  khmerName: "",
  englishName: "",
  studentId: "",
  dob: "",
  gender: "",
  joinDate: "",
  grade: "",
  profileImage: "",
  profileImageFile: null,
  nationality: {
    student: "ខ្មែរ"
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
  },
  family: {
    motherName: "",
    motherNumber: "",
    motherFacebook: ""
  },
  status: "active"
};

const form = ref(JSON.parse(JSON.stringify(initialFormState)));
const selectedImageFile = ref(null);
const localImagePreviewUrl = ref("");
const imageError = ref("");

const isSaving = computed(() => {
  return students.loading?.value || students.isLoading?.value || false;
});

const normalizeArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.result)) return value.result;
  if (Array.isArray(value?.items)) return value.items;
  return [];
};

const classesOptions = computed(() => {
  return normalizeArray(classesQuery.data?.value || classesQuery.data || []);
});

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

const imagePreviewUrl = computed(() => {
  if (localImagePreviewUrl.value) return localImagePreviewUrl.value;
  return getImageUrl(form.value.profileImage);
});

const studentInitial = computed(() => {
  return (
    form.value.khmerName?.charAt(0) ||
    form.value.englishName?.charAt(0)?.toUpperCase() ||
    "S"
  );
});

function clearLocalPreview() {
  if (localImagePreviewUrl.value) {
    URL.revokeObjectURL(localImagePreviewUrl.value);
  }

  localImagePreviewUrl.value = "";
}

function validateImageFile(file) {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    return "សូមជ្រើសរូបភាពប្រភេទ JPG, PNG ឬ WEBP ប៉ុណ្ណោះ";
  }

  if (file.size > 2 * 1024 * 1024) {
    return "រូបភាពមិនអាចលើស 2MB បានទេ";
  }

  return "";
}

function handleImageChange(event) {
  const file = event.target.files?.[0];

  if (!file) return;

  const validationError = validateImageFile(file);

  if (validationError) {
    imageError.value = validationError;
    event.target.value = "";
    return;
  }

  clearLocalPreview();

  selectedImageFile.value = file;
  form.value.profileImageFile = file;
  localImagePreviewUrl.value = URL.createObjectURL(file);
  imageError.value = "";
}

function clearSelectedImage() {
  selectedImageFile.value = null;
  form.value.profileImageFile = null;
  imageError.value = "";
  clearLocalPreview();
}

function appendNestedObjectToFormData(formData, key, value = {}) {
  Object.entries(value || {}).forEach(([childKey, childValue]) => {
    if (childValue === undefined || childValue === null) return;
    formData.append(`${key}[${childKey}]`, childValue);
  });
}

function buildFormDataPayload() {
  const payload = {
    ...form.value
  };

  if (payload.dob) {
    payload.birthDate = new Date(payload.dob).toISOString();
  }

  if (payload.joinDate) {
    payload.joinDate = new Date(payload.joinDate).toISOString();
  }

  delete payload.dob;
  delete payload.profileImageFile;

  if (!payload.grade) {
    delete payload.grade;
  }

  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (
      key === "nationality" ||
      key === "placeOfBirth" ||
      key === "currentResidence" ||
      key === "family"
    ) {
      appendNestedObjectToFormData(formData, key, value);
      return;
    }

    formData.append(key, value);
  });

  if (selectedImageFile.value) {
    formData.append("profileImage", selectedImageFile.value);
  }

  return formData;
}

function handleSubmit() {
  try {
    const payload = buildFormDataPayload();
    emit("save", payload);
  } catch (err) {
    toast.error(err.message || "មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ");
  }
}

watch(
  () => props.student,
  (newStudent) => {
    clearLocalPreview();

    if (newStudent) {
      const mergedData = {
        ...JSON.parse(JSON.stringify(initialFormState)),
        ...JSON.parse(JSON.stringify(newStudent))
      };

      if (!mergedData.nationality) {
        mergedData.nationality = {
          ...initialFormState.nationality
        };
      }

      if (!mergedData.placeOfBirth) {
        mergedData.placeOfBirth = {
          ...initialFormState.placeOfBirth
        };
      }

      if (!mergedData.currentResidence) {
        mergedData.currentResidence = {
          ...initialFormState.currentResidence
        };
      }

      if (!mergedData.family) {
        mergedData.family = {
          ...initialFormState.family
        };
      }

      if (mergedData.birthDate) {
        const dateObj = new Date(mergedData.birthDate);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");

        mergedData.dob = `${year}-${month}-${day}`;
      } else {
        mergedData.dob = "";
      }

      if (mergedData.joinDate) {
        const dateObj = new Date(mergedData.joinDate);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");

        mergedData.joinDate = `${year}-${month}-${day}`;
      } else {
        mergedData.joinDate = "";
      }

      if (mergedData.grade && typeof mergedData.grade === "object") {
        mergedData.grade = mergedData.grade._id;
      }

      mergedData.profileImageFile = null;
      form.value = mergedData;
    } else {
      form.value = JSON.parse(JSON.stringify(initialFormState));
    }

    selectedImageFile.value = null;
    imageError.value = "";
  },
  {
    immediate: true,
    deep: true
  }
);

onBeforeUnmount(() => {
  clearLocalPreview();
});
</script>

<style scoped>
.form-section {
  border: 1px solid #e2e8f0;
  background: #ffffff;
  border-radius: 0.75rem;
  padding: 0.65rem;
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 0.5rem;
}

.section-icon {
  height: 1.45rem;
  width: 1.45rem;
  border-radius: 0.5rem;
  background: #eff6ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.62rem;
  flex-shrink: 0;
}

.section-title {
  font-size: 0.72rem;
  font-weight: 900;
  color: #1e293b;
}

.field-label {
  display: block;
  font-size: 0.62rem;
  font-weight: 800;
  color: #64748b;
  margin-bottom: 0.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.form-input {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 0.45rem;
  padding: 0.36rem 0.52rem;
  font-size: 0.7rem;
  color: #334155;
  background: #ffffff;
  outline: none;
  min-height: 1.95rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.12);
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
  .form-section {
    padding: 0.75rem;
  }

  .field-label {
    font-size: 0.68rem;
  }

  .form-input {
    padding: 0.38rem 0.6rem;
    font-size: 0.75rem;
    min-height: 2.05rem;
  }
}
</style>