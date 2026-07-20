<template>
  <Teleport to="body">
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
      class="teacher-form-modal-overlay-mobile-safe fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-[9999] p-2.5 sm:p-4"
      @click.self="handleClose"
    >
      <div
        class="teacher-form-modal-panel-mobile-safe bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95dvh] sm:max-h-[90vh] overflow-hidden border border-slate-100 flex flex-col"
      >
        <!-- Header -->
        <div
          class="px-3.5 sm:px-5 py-3 sm:py-4 border-b border-slate-100 bg-slate-50 flex items-start justify-between gap-3 shrink-0"
        >
          <div class="min-w-0">
            <h1 class="text-base sm:text-lg font-extrabold text-slate-800 flex items-start gap-2.5 leading-snug">
              <span
                class="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-sm shrink-0"
              >
                <i :class="isEditing ? 'fa-solid fa-user-pen' : 'fa-solid fa-user-plus'"></i>
              </span>

              <span class="break-words leading-snug">
                {{ isEditing ? "កែប្រែព័ត៌មានគ្រូ" : "បញ្ចូលគ្រូបង្រៀនថ្មី" }}
              </span>
            </h1>

            <p class="text-xs sm:text-sm text-slate-500 mt-1 break-words leading-snug">
              បំពេញព័ត៌មានគ្រូបង្រៀន
            </p>
          </div>

          <button
            type="button"
            @click="handleClose"
            class="h-8 w-8 sm:h-9 sm:w-9 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition shrink-0"
          >
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        <form
          @submit.prevent="handleSubmit"
          class="teacher-form-modal-body-mobile-safe p-3 sm:p-5 space-y-3 sm:space-y-4 overflow-y-auto modal-scroll"
        >
          <!-- Teacher Image -->
          <div class="form-section">
            <div class="flex items-center gap-3 sm:gap-4">
              <div
                class="h-16 w-16 sm:h-24 sm:w-24 rounded-full overflow-hidden bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0"
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
                <p class="text-sm font-extrabold text-slate-800 break-words leading-snug">
                  រូបគ្រូបង្រៀន
                </p>

                <p class="text-xs sm:text-sm text-slate-500 mt-1 leading-snug break-words">
                  JPG, PNG ឬ WEBP។ ទំហំមិនលើស 2MB។
                </p>

                <div class="mt-1.5 sm:mt-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <label
                    class="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold cursor-pointer hover:bg-blue-700 transition"
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
                    class="px-3 sm:px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-sm font-bold hover:bg-slate-200 transition"
                  >
                    សម្អាតរូបថ្មី
                  </button>
                </div>

                <p
                  v-if="imageError"
                  class="text-xs sm:text-sm font-bold text-red-600 mt-2 break-words leading-snug"
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

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
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

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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

              <div class="sm:col-span-2 md:col-span-1">
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

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
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

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
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

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            class="teacher-form-modal-footer-mobile-safe sticky bottom-0 -mx-3 sm:-mx-5 px-3 sm:px-5 py-3 sm:py-4 bg-white border-t border-slate-100 flex justify-end gap-2.5 sm:gap-3 shrink-0"
          >
            <button
              type="button"
              @click="handleClose"
              class="px-4 sm:px-5 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              បោះបង់
            </button>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-4 sm:px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i
                v-if="isSubmitting"
                class="fa-solid fa-circle-notch fa-spin text-sm"
              ></i>

              <i
                v-else
                class="fa-solid fa-floppy-disk text-sm"
              ></i>

              {{ isSubmitting ? "កំពុងរក្សាទុក..." : (isEditing ? "រក្សាទុក" : "បញ្ចូលគ្រូថ្មី") }}
            </button>
          </div>
        </form>
      </div>
    </div>
    </Transition>
  </Teleport>
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

.teacher-form-modal-panel-mobile-safe {
  font-family: "Noto Sans Khmer", "Khmer OS Battambang", "Battambang", "Khmer OS", system-ui, sans-serif;
}

.teacher-form-modal-panel-mobile-safe label,
.teacher-form-modal-panel-mobile-safe p,
.teacher-form-modal-panel-mobile-safe span,
.teacher-form-modal-panel-mobile-safe h1,
.teacher-form-modal-panel-mobile-safe h3,
.teacher-form-modal-panel-mobile-safe button {
  font-family: "Noto Sans Khmer", "Khmer OS Battambang", "Battambang", "Khmer OS", system-ui, sans-serif;
  line-height: 1.45;
}

.teacher-form-modal-panel-mobile-safe .break-words,
.section-title,
.form-label {
  overflow-wrap: anywhere;
  word-break: break-word;
}

input.form-input,
select.form-input,
textarea.form-input,
.form-input::placeholder {
  font-family: "Noto Sans Khmer", "Khmer OS Battambang", "Battambang", "Khmer OS", system-ui, sans-serif !important;
  font-size: 14px !important;
  line-height: 1.7 !important;
  font-weight: 500;
  -webkit-font-smoothing: antialiased;
  text-rendering: geometricPrecision;
}

input.form-input,
select.form-input {
  min-height: 2.68rem !important;
  height: 2.68rem !important;
  padding-top: 0.56rem !important;
  padding-bottom: 0.56rem !important;
  overflow: visible !important;
}

textarea.form-input {
  min-height: 5rem !important;
  padding-top: 0.6rem !important;
  padding-bottom: 0.6rem !important;
  line-height: 1.7 !important;
}


/* Mobile safe modal + balanced Khmer form UI */
@media (max-width: 640px) {
  .teacher-form-modal-overlay-mobile-safe {
    min-height: 100vh;
    min-height: 100dvh;
    align-items: flex-end;
    padding-top: calc(0.5rem + env(safe-area-inset-top));
    padding-bottom: calc(0.5rem + env(safe-area-inset-bottom));
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }

  .teacher-form-modal-panel-mobile-safe {
    max-height: calc(100vh - 1rem);
    max-height: calc(100dvh - 1rem);
  }

  .teacher-form-modal-body-mobile-safe {
    max-height: calc(100vh - 9.75rem);
    max-height: calc(100dvh - 9.75rem);
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
  border-radius: 0.9rem;
  padding: 0.85rem;
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.04);
}

.section-heading {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  margin-bottom: 0.8rem;
}

.section-icon {
  height: 1.8rem;
  width: 1.8rem;
  border-radius: 0.6rem;
  background: #eff6ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.section-title {
  font-size: 15px;
  font-weight: 900;
  color: #1e293b;
  line-height: 1.45;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 800;
  color: #64748b;
  margin-bottom: 0.35rem;
  line-height: 1.45;
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
}

.form-input {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 0.6rem;
  padding: 0.56rem 0.7rem;
  font-size: 14px;
  line-height: 1.7;
  color: #334155;
  background: #ffffff;
  outline: none;
  min-height: 2.68rem;
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
    padding: 1rem;
  }
}

.teacher-form-modal-overlay-mobile-safe {
  position: fixed !important;
  inset: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  height: 100dvh !important;
  z-index: 9999 !important;
  isolation: isolate;
}

.teacher-form-modal-panel-mobile-safe {
  line-height: 1.45;
}

.teacher-form-modal-panel-mobile-safe label,
.teacher-form-modal-panel-mobile-safe p,
.teacher-form-modal-panel-mobile-safe span,
.teacher-form-modal-panel-mobile-safe h1,
.teacher-form-modal-panel-mobile-safe h3,
.teacher-form-modal-panel-mobile-safe button {
  line-height: 1.45;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.teacher-form-modal-panel-mobile-safe input,
.teacher-form-modal-panel-mobile-safe select,
.teacher-form-modal-panel-mobile-safe textarea,
.teacher-form-modal-panel-mobile-safe option,
.teacher-form-modal-panel-mobile-safe input::placeholder,
.teacher-form-modal-panel-mobile-safe textarea::placeholder {
  font-size: 14px !important;
}

.modal-scroll {
  -webkit-overflow-scrolling: touch;
}

</style>