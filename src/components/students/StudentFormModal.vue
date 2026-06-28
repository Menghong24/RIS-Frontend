<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-3"
  >
    <div
      class="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[88vh] overflow-y-auto border border-slate-100"
    >
      <!-- Header -->
      <div class="px-3 py-2.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div>
          <h2 class="text-base font-extrabold text-slate-800 flex items-center gap-2">
            <span class="h-7 w-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs">
              <i :class="isEditing ? 'fa-solid fa-user-pen' : 'fa-solid fa-user-plus'"></i>
            </span>
            {{ isEditing ? "កែប្រែទិន្នន័យសិស្ស" : "បញ្ចូលសិស្សថ្មី" }}
          </h2>

          <p class="text-[11px] text-slate-500 mt-0.5">
            សូមបំពេញព័ត៌មានសិស្ស និងព័ត៌មានអាណាព្យាបាល
          </p>
        </div>

        <button
          type="button"
          @click="$emit('close')"
          class="h-7 w-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <i class="fa-solid fa-xmark text-sm"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-3 space-y-3">
        <!-- Student Image -->
        <div class="bg-white border border-slate-200 p-3 rounded-xl">
          <div class="flex items-center gap-3">
            <div class="h-20 w-20 rounded-full overflow-hidden bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
              <img
                v-if="imagePreviewUrl"
                :src="imagePreviewUrl"
                class="h-full w-full object-cover"
                alt="Student profile"
              />

              <span
                v-else
                class="text-xl font-extrabold text-blue-600"
              >
                {{ studentInitial }}
              </span>
            </div>

            <div class="min-w-0">
              <p class="text-xs font-extrabold text-slate-800">
                រូបសិស្ស
              </p>

              <p class="text-[11px] text-slate-500 mt-0.5">
                អាចប្រើ JPG, PNG ឬ WEBP។ ទំហំមិនលើស 2MB។
              </p>

              <div class="mt-2 flex flex-wrap items-center gap-2">
                <label class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold cursor-pointer hover:bg-blue-700 transition">
                  <i class="fa-solid fa-camera"></i>
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
                  class="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition"
                >
                  សម្អាតរូបថ្មី
                </button>
              </div>

              <p
                v-if="imageError"
                class="text-[11px] font-bold text-red-600 mt-2"
              >
                {{ imageError }}
              </p>
            </div>
          </div>
        </div>

        <!-- Student Info -->
        <div class="bg-white border border-slate-200 p-3 rounded-xl">
          <div class="flex items-center gap-2 mb-2">
            <span class="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[10px]">
              <i class="fa-solid fa-id-card"></i>
            </span>

            <h3 class="text-xs font-extrabold text-slate-800">
              ព័ត៌មានសិស្ស
            </h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">
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
              <label class="block text-[11px] font-bold text-slate-600 mb-1">
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
              <label class="block text-[11px] font-bold text-slate-600 mb-1">
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
              <label class="block text-[11px] font-bold text-slate-600 mb-1">
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
              <label class="block text-[11px] font-bold text-slate-600 mb-1">
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
          </div>
        </div>

        <!-- Date & Address -->
        <div class="bg-white border border-slate-200 p-3 rounded-xl">
          <div class="flex items-center gap-2 mb-2">
            <span class="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[10px]">
              <i class="fa-solid fa-location-dot"></i>
            </span>

            <h3 class="text-xs font-extrabold text-slate-800">
              ថ្ងៃខែឆ្នាំកំណើត និងទីលំនៅបច្ចុប្បន្ន
            </h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">
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
              <label class="block text-[11px] font-bold text-slate-600 mb-1">
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
              <label class="block text-[11px] font-bold text-slate-600 mb-1">
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
              <label class="block text-[11px] font-bold text-slate-600 mb-1">
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
              <label class="block text-[11px] font-bold text-slate-600 mb-1">
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
              <label class="block text-[11px] font-bold text-slate-600 mb-1">
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
        <div class="bg-white border border-slate-200 p-3 rounded-xl">
          <div class="flex items-center gap-2 mb-2">
            <span class="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[10px]">
              <i class="fa-solid fa-user-shield"></i>
            </span>

            <h3 class="text-xs font-extrabold text-slate-800">
              ព័ត៌មានអាណាព្យាបាល
            </h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">
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
              <label class="block text-[11px] font-bold text-slate-600 mb-1">
                លេខទូរស័ព្ទ
              </label>

              <input
                type="text"
                v-model="form.family.motherNumber"
                placeholder="លេខទូរស័ព្ទ"
                class="form-input"
              />
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">
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
        <div class="pt-3 flex justify-end gap-2 border-t border-slate-100">
          <button
            type="button"
            @click="$emit('close')"
            class="px-3.5 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            បោះបង់
          </button>

          <button
            type="submit"
            :disabled="students.loading.value"
            class="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <i
              v-if="students.loading.value"
              class="fa-solid fa-circle-notch fa-spin"
            ></i>

            <i
              v-else
              class="fa-solid fa-floppy-disk"
            ></i>

            {{ students.loading.value ? "កំពុងរក្សាទុក..." : (isEditing ? "រក្សាទុកការកែប្រែ" : "បញ្ចូលសិស្សថ្មី") }}
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
const classesList = useQuery("classes");
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

/**
 * IMPORTANT:
 * This function must be declared before watch(..., { immediate: true })
 * because the immediate watcher runs during setup.
 */
const clearLocalPreview = () => {
  if (localImagePreviewUrl.value) {
    URL.revokeObjectURL(localImagePreviewUrl.value);
  }

  localImagePreviewUrl.value = "";
};

const validateImageFile = (file) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    return "សូមជ្រើសរូបភាពប្រភេទ JPG, PNG ឬ WEBP ប៉ុណ្ណោះ";
  }

  if (file.size > 2 * 1024 * 1024) {
    return "រូបភាពមិនអាចលើស 2MB បានទេ";
  }

  return "";
};

const handleImageChange = (event) => {
  const file = event.target.files?.[0];

  if (!file) return;

  const validationError = validateImageFile(file);

  if (validationError) {
    imageError.value = validationError;
    event.target.value = "";
    return;
  }

function clearLocalPreview() {
  if (localImagePreviewUrl.value) {
    URL.revokeObjectURL(localImagePreviewUrl.value);
  }

  localImagePreviewUrl.value = "";
}
};

const clearSelectedImage = () => {
  selectedImageFile.value = null;
  form.value.profileImageFile = null;
  imageError.value = "";
  clearLocalPreview();
};

watch(
  () => props.student,
  (newStudent) => {
    clearLocalPreview();

    if (newStudent) {
      const mergedData = {
        ...JSON.parse(JSON.stringify(initialFormState)),
        ...JSON.parse(JSON.stringify(newStudent))
      };

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

const appendNestedObjectToFormData = (formData, key, value = {}) => {
  Object.entries(value || {}).forEach(([childKey, childValue]) => {
    if (childValue === undefined || childValue === null) return;
    formData.append(`${key}[${childKey}]`, childValue);
  });
};

const buildFormDataPayload = () => {
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
};

const handleSubmit = async () => {
  try {
    const payload = buildFormDataPayload();
    emit("save", payload);
  } catch (err) {
    toast.error(err.message || "មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ");
  }
};

onBeforeUnmount(() => {
  clearLocalPreview();
});
</script>

<style scoped>
.form-input {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 0.45rem;
  padding: 0.38rem 0.6rem;
  font-size: 0.75rem;
  color: #334155;
  background: #ffffff;
  outline: none;
  transition: all 0.2s ease;
}

.form-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.12);
}
</style>