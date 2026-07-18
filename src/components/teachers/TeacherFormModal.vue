<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="teacher-form-modal-overlay-mobile-safe fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-2 sm:p-3"
      @click.self="handleClose"
    >
      <div
        class="teacher-form-modal-panel-mobile-safe bg-white rounded-t-2xl sm:rounded-xl shadow-xl w-full max-w-4xl max-h-[94dvh] sm:max-h-[86vh] overflow-hidden border border-slate-100 flex flex-col"
      >
        <!-- Header -->
        <div
          class="px-2.5 sm:px-3 py-2.5 border-b border-slate-100 bg-slate-50 flex items-start justify-between gap-2 shrink-0"
        >
          <div class="min-w-0">
            <h1 class="text-sm sm:text-base font-extrabold text-slate-800 flex items-center gap-2">
              <span
                class="h-7 w-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs shrink-0"
              >
                <i :class="isEditing ? 'fa-solid fa-user-pen' : 'fa-solid fa-user-plus'"></i>
              </span>

              <span class="truncate">
                {{ isEditing ? "កែប្រែព័ត៌មានគ្រូ" : "បញ្ចូលគ្រូបង្រៀនថ្មី" }}
              </span>
            </h1>

            <p class="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">
              បំពេញព័ត៌មានគ្រូបង្រៀន
            </p>
          </div>

          <button
            type="button"
            @click="handleClose"
            class="h-7 w-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition shrink-0"
          >
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        <form
          @submit.prevent="handleSubmit"
          class="teacher-form-modal-body-mobile-safe p-2.5 sm:p-3 space-y-2.5 sm:space-y-3 overflow-y-auto modal-scroll"
        >
          <!-- Teacher Image -->
          <div class="form-section">
            <div class="flex items-center gap-2.5 sm:gap-3">
              <div
                class="h-14 w-14 sm:h-20 sm:w-20 rounded-full overflow-hidden bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0"
              >
                <img
                  v-if="imagePreviewUrl"
                  :src="imagePreviewUrl"
                  class="h-full w-full object-cover"
                  alt="Teacher profile"
                />

                <span
                  v-else
                  class="text-base sm:text-xl font-extrabold text-blue-600"
                >
                  {{ teacherInitial }}
                </span>
              </div>

              <div class="min-w-0 flex-1">
                <p class="text-[11px] sm:text-xs font-extrabold text-slate-800">
                  រូបគ្រូបង្រៀន
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

          <!-- Name Info -->
          <div class="form-section">
            <div class="section-heading">
              <span class="section-icon">
                <i class="fa-solid fa-id-card"></i>
              </span>

              <h3 class="section-title">
                ព័ត៌មានឈ្មោះគ្រូ
              </h3>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div>
                <label class="form-label">
                  ឈ្មោះខ្មែរ <span class="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  v-model.trim="form.khmerName"
                  class="form-input"
                  placeholder="ឈ្មោះខ្មែរ"
                  required
                />
              </div>

              <div>
                <label class="form-label">
                  ឈ្មោះឡាតាំង <span class="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  v-model.trim="form.englishName"
                  class="form-input"
                  placeholder="ឈ្មោះឡាតាំង"
                  required
                />
              </div>

              <div>
                <label class="form-label">
                  សញ្ជាតិ <span class="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  v-model.trim="form.nationality"
                  class="form-input"
                  placeholder="សញ្ជាតិ"
                  required
                />
              </div>

              <div>
                <label class="form-label">
                  ភេទ <span class="text-red-500">*</span>
                </label>

                <select
                  v-model="form.gender"
                  class="form-input"
                  required
                >
                  <option value="" disabled>ជ្រើសរើសភេទ</option>
                  <option value="ប្រុស">ប្រុស</option>
                  <option value="ស្រី">ស្រី</option>
                  <option value="other">ផ្សេងៗ</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Contact -->
          <div class="form-section">
            <div class="section-heading">
              <span class="section-icon">
                <i class="fa-solid fa-address-book"></i>
              </span>

              <h3 class="section-title">
                ថ្ងៃកំណើត និងទំនាក់ទំនង
              </h3>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
              <div>
                <label class="form-label">
                  ថ្ងៃកំណើត <span class="text-red-500">*</span>
                </label>

                <input
                  type="date"
                  v-model="form.dateOfBirth"
                  class="form-input"
                  required
                />
              </div>

              <div>
                <label class="form-label">
                  លេខទូរស័ព្ទ <span class="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  v-model.trim="form.phone"
                  class="form-input"
                  placeholder="លេខទូរស័ព្ទ"
                  required
                />
              </div>

              <div class="col-span-2 md:col-span-1">
                <label class="form-label">
                  Telegram
                </label>

                <input
                  type="text"
                  v-model.trim="form.telegram"
                  class="form-input"
                  placeholder="Telegram"
                />
              </div>
            </div>
          </div>

          <!-- Address -->
          <div class="form-section">
            <div class="section-heading">
              <span class="section-icon">
                <i class="fa-solid fa-location-dot"></i>
              </span>

              <h3 class="section-title">
                លំនៅដ្ឋានបច្ចុប្បន្ន
              </h3>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div>
                <label class="form-label">
                  ភូមិ
                </label>

                <input
                  type="text"
                  v-model.trim="form.currentResidence.village"
                  class="form-input"
                  placeholder="ភូមិ"
                />
              </div>

              <div>
                <label class="form-label">
                  ឃុំ/សង្កាត់
                </label>

                <input
                  type="text"
                  v-model.trim="form.currentResidence.commune"
                  class="form-input"
                  placeholder="ឃុំ/សង្កាត់"
                />
              </div>

              <div>
                <label class="form-label">
                  ស្រុក/ខណ្ឌ
                </label>

                <input
                  type="text"
                  v-model.trim="form.currentResidence.district"
                  class="form-input"
                  placeholder="ស្រុក/ខណ្ឌ"
                />
              </div>

              <div>
                <label class="form-label">
                  ខេត្ត/ក្រុង
                </label>

                <input
                  type="text"
                  v-model.trim="form.currentResidence.province"
                  class="form-input"
                  placeholder="ខេត្ត/ក្រុង"
                />
              </div>
            </div>
          </div>

          <!-- Skill -->
          <div class="form-section">
            <div class="section-heading">
              <span class="section-icon">
                <i class="fa-solid fa-briefcase"></i>
              </span>

              <h3 class="section-title">
                ជំនាញ និងព័ត៌មានផ្សេងៗ
              </h3>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-2 gap-2 mb-2">
              <div>
                <label class="form-label">
                  ជំនាញឯកទេស <span class="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  v-model.trim="form.skill"
                  class="form-input"
                  placeholder="ជំនាញឯកទេស"
                  required
                />
              </div>

              <div>
                <label class="form-label">
                  អ៊ីមែល
                </label>

                <input
                  type="email"
                  v-model.trim="form.email"
                  class="form-input"
                  placeholder="Email"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-2 gap-2">
              <div>
                <label class="form-label">
                  Facebook
                </label>

                <input
                  type="text"
                  v-model.trim="form.facebook"
                  class="form-input"
                  placeholder="Facebook"
                />
              </div>

              <div>
                <label class="form-label">
                  កំណត់សម្គាល់
                </label>

                <input
                  type="text"
                  v-model.trim="form.note"
                  class="form-input"
                  placeholder="កំណត់សម្គាល់"
                />
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div
            class="teacher-form-modal-footer-mobile-safe sticky bottom-0 -mx-2.5 sm:-mx-3 px-2.5 sm:px-3 py-2.5 bg-white border-t border-slate-100 flex justify-end gap-2"
          >
            <button
              type="button"
              @click="handleClose"
              class="px-3 py-1.5 text-[11px] sm:text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              បោះបង់
            </button>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-3.5 py-1.5 text-[11px] sm:text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i
                v-if="isSubmitting"
                class="fa-solid fa-circle-notch fa-spin text-[10px] sm:text-xs"
              ></i>

              <i
                v-else
                class="fa-solid fa-floppy-disk text-[10px] sm:text-xs"
              ></i>

              {{ isSubmitting ? "កំពុងរក្សាទុក..." : (isEditing ? "រក្សាទុក" : "បញ្ចូលគ្រូថ្មី") }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from "vue";
import api from "../../config/api";

const props = defineProps({
  isOpen: Boolean,
  isEditing: Boolean,
  teacher: {
    type: Object,
    default: () => null
  }
});

const emit = defineEmits(["close", "save"]);


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

const handleClose = () => {
  restoreViewport();
  emit("close");
};

const defaultForm = {
  khmerName: "",
  englishName: "",
  gender: "",
  nationality: "",
  dateOfBirth: "",
  profileImage: "",
  profileImageFile: null,
  email: "",
  phone: "",
  skill: "",
  facebook: "",
  telegram: "",
  currentResidence: {
    village: "",
    commune: "",
    district: "",
    province: ""
  },
  note: ""
};

const form = ref(JSON.parse(JSON.stringify(defaultForm)));
const selectedImageFile = ref(null);
const localImagePreviewUrl = ref("");
const imageError = ref("");
const isSubmitting = ref(false);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function formatDateInput(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getApiOrigin() {
  const baseURL = api.defaults?.baseURL || import.meta.env.VITE_API_URL || "";

  if (!baseURL || baseURL === "/api") {
    return window.location.origin;
  }

  if (baseURL.startsWith("http")) {
    return baseURL.replace(/\/api\/?$/, "").replace(/\/$/, "");
  }

  return window.location.origin;
}

function getImageUrl(path = "") {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  return `${getApiOrigin()}${path}`;
}

const imagePreviewUrl = computed(() => {
  if (localImagePreviewUrl.value) return localImagePreviewUrl.value;
  return getImageUrl(form.value.profileImage);
});

const teacherInitial = computed(() => {
  return (
    form.value.khmerName?.charAt(0) ||
    form.value.englishName?.charAt(0)?.toUpperCase() ||
    "T"
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

  delete payload.profileImageFile;

  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (key === "currentResidence") {
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
  if (isSubmitting.value) return;

  isSubmitting.value = true;

  try {
    const payload = buildFormDataPayload();
    emit("save", payload);
  } catch (error) {
    isSubmitting.value = false;
  }
}

watch(
  () => props.isOpen,
  (newVal) => {
    if (!newVal) {
      restoreViewport();
      isSubmitting.value = false;
      clearLocalPreview();
      return;
    }

    setNoZoomViewport();
    clearLocalPreview();

    if (props.isEditing && props.teacher) {
      const data = {
        ...clone(defaultForm),
        ...clone(props.teacher)
      };

      if (!data.currentResidence) {
        data.currentResidence = {
          ...defaultForm.currentResidence
        };
      }

      data.dateOfBirth = formatDateInput(data.dateOfBirth);
      data.profileImageFile = null;

      form.value = data;
    } else {
      form.value = clone(defaultForm);
    }

    selectedImageFile.value = null;
    imageError.value = "";
    isSubmitting.value = false;
  },
  {
    immediate: true
  }
);

watch(
  () => props.teacher,
  () => {
    if (!props.isOpen) return;

    if (props.isEditing && props.teacher) {
      const data = {
        ...clone(defaultForm),
        ...clone(props.teacher)
      };

      if (!data.currentResidence) {
        data.currentResidence = {
          ...defaultForm.currentResidence
        };
      }

      data.dateOfBirth = formatDateInput(data.dateOfBirth);
      data.profileImageFile = null;

      form.value = data;
    }
  },
  {
    deep: true
  }
);

onBeforeUnmount(() => {
  restoreViewport();
  clearLocalPreview();
});
</script>

<style scoped>

/* Chrome mobile bottom toolbar fix + no visual input-size changes */
@media (max-width: 640px) {
  .teacher-form-modal-overlay-mobile-safe {
    min-height: 100vh;
    min-height: 100dvh;
    align-items: flex-end;
    padding-bottom: calc(0.5rem + env(safe-area-inset-bottom));
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }

  .teacher-form-modal-panel-mobile-safe {
    max-height: calc(100vh - 0.75rem);
    max-height: calc(100dvh - 0.75rem);
  }

  .teacher-form-modal-body-mobile-safe {
    max-height: calc(100vh - 8.5rem);
    max-height: calc(100dvh - 8.5rem);
    -webkit-overflow-scrolling: touch;
  }

  .teacher-form-modal-footer-mobile-safe {
    position: sticky;
    bottom: 0;
    z-index: 5;
    padding-bottom: calc(0.65rem + env(safe-area-inset-bottom)) !important;
  }
}

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

.form-label {
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

  .form-label {
    font-size: 0.68rem;
  }

  .form-input {
    padding: 0.38rem 0.6rem;
    font-size: 0.75rem;
    min-height: 2.05rem;
  }
}
</style>