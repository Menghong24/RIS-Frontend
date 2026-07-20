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
      class="teacher-view-modal-overlay-mobile-safe fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-2 sm:p-3"
      @click.self="handleClose"
    >
      <div
        class="teacher-view-modal-panel-mobile-safe bg-white rounded-t-2xl sm:rounded-xl shadow-xl w-full max-w-2xl max-h-[94dvh] sm:max-h-[86vh] overflow-hidden border border-slate-100 flex flex-col"
      >
        <!-- Header -->
        <div
          class="px-2.5 sm:px-3 py-2.5 sm:py-3 border-b border-slate-100 bg-slate-50 flex items-start justify-between gap-2 sm:gap-3 shrink-0"
        >
          <div class="flex items-center gap-2 sm:gap-3 min-w-0">
            <div
              class="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden ring-2 ring-blue-100 border border-blue-200 shadow-sm bg-blue-50 text-blue-700 flex items-center justify-center font-extrabold shrink-0"
            >
              <img
                v-if="teacherImageUrl && !imageLoadError"
                :src="teacherImageUrl"
                class="w-full h-full object-cover"
                :alt="teacherFullName || 'Teacher'"
                @error="imageLoadError = true"
              />

              <span v-else class="text-sm sm:text-base">
                {{ teacherInitial }}
              </span>
            </div>

            <div class="min-w-0">
              <h2 class="text-sm sm:text-base font-extrabold text-slate-800 font-khmer break-words leading-snug">
                {{ teacher?.khmerName || "ឈ្មោះគ្រូ" }}
              </h2>

              <p class="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 break-words leading-snug">
                {{ teacher?.englishName || "Teacher Name" }}
              </p>

              <span
                class="inline-flex items-center mt-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[9px] sm:text-[10px] font-bold leading-snug break-words"
              >
                <i class="fa-solid fa-briefcase mr-1"></i>
                {{ teacher?.skill || "ទូទៅ" }}
              </span>
            </div>
          </div>

          <button
            type="button"
            @click="handleClose"
            class="h-7 w-7 sm:h-8 sm:w-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition shrink-0"
          >
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="teacher-view-modal-body-mobile-safe flex-1 min-h-0 p-2.5 sm:p-3 space-y-2.5 sm:space-y-3 overflow-y-auto overscroll-contain modal-scroll">
          <!-- Detail -->
          <div class="section-card">
            <h3 class="section-title">
              <span class="section-icon">
                <i class="fa-solid fa-id-card"></i>
              </span>
              ព័ត៌មានលម្អិតរបស់គ្រូ
            </h3>

            <div class="grid grid-cols-2 lg:grid-cols-3 gap-1.5 sm:gap-2 text-xs">
              <div class="info-box">
                <span class="info-label">ឈ្មោះខ្មែរ</span>
                <p class="info-value font-khmer break-words leading-snug">{{ teacher?.khmerName || "-" }}</p>
              </div>

              <div class="info-box">
                <span class="info-label">ឈ្មោះឡាតាំង</span>
                <p class="info-value">{{ teacher?.englishName || "-" }}</p>
              </div>

              <div class="info-box">
                <span class="info-label">ភេទ</span>
                <p class="info-value">{{ teacher?.gender || "-" }}</p>
              </div>

              <div class="info-box">
                <span class="info-label">សញ្ជាតិ</span>
                <p class="info-value">{{ teacher?.nationality || "-" }}</p>
              </div>

              <div class="info-box">
                <span class="info-label">ថ្ងៃកំណើត</span>
                <p class="info-value">{{ formatDate(teacher?.dateOfBirth) }}</p>
              </div>

              <div class="info-box">
                <span class="info-label">លេខទូរស័ព្ទ</span>
                <p class="info-value">{{ teacher?.phone || "-" }}</p>
              </div>

              <div class="info-box col-span-2 lg:col-span-3">
                <span class="info-label">អ៊ីមែល</span>
                <p class="info-value break-all">{{ teacher?.email || "-" }}</p>
              </div>
            </div>
          </div>

          <!-- Address -->
          <div class="section-card">
            <h3 class="section-title">
              <span class="section-icon">
                <i class="fa-solid fa-location-dot"></i>
              </span>
              លំនៅដ្ឋានបច្ចុប្បន្ន
            </h3>

            <div class="grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-2 text-xs">
              <div class="info-box">
                <span class="info-label">ភូមិ</span>
                <p class="info-value">{{ teacher?.currentResidence?.village || "-" }}</p>
              </div>

              <div class="info-box">
                <span class="info-label">ឃុំ/សង្កាត់</span>
                <p class="info-value">{{ teacher?.currentResidence?.commune || "-" }}</p>
              </div>

              <div class="info-box">
                <span class="info-label">ស្រុក/ខណ្ឌ</span>
                <p class="info-value">{{ teacher?.currentResidence?.district || "-" }}</p>
              </div>

              <div class="info-box">
                <span class="info-label">ខេត្ត/ក្រុង</span>
                <p class="info-value">{{ teacher?.currentResidence?.province || "-" }}</p>
              </div>
            </div>
          </div>

          <!-- More Info -->
          <div class="section-card">
            <h3 class="section-title">
              <span class="section-icon">
                <i class="fa-solid fa-circle-info"></i>
              </span>
              ព័ត៌មានបន្ថែម
            </h3>

            <div class="grid grid-cols-2 gap-1.5 sm:gap-2 text-xs">
              <div class="info-box">
                <span class="info-label">ជំនាញ</span>
                <p class="info-value">{{ teacher?.skill || "-" }}</p>
              </div>

              <div class="info-box">
                <span class="info-label">Facebook</span>
                <p class="info-value break-all">{{ teacher?.facebook || "-" }}</p>
              </div>

              <div class="info-box">
                <span class="info-label">Telegram</span>
                <p class="info-value break-all">{{ teacher?.telegram || "-" }}</p>
              </div>

              <div class="info-box">
                <span class="info-label">កំណត់សម្គាល់</span>
                <p class="info-value">{{ teacher?.note || "-" }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="teacher-view-modal-footer-mobile-safe px-2.5 sm:px-3 py-2.5 border-t border-slate-100 bg-white flex justify-end shrink-0">
          <button
            @click="handleClose"
            class="px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center gap-1.5 sm:gap-2"
          >
            <i class="fa-solid fa-xmark text-[10px] sm:text-xs"></i>
            បិទ
          </button>
        </div>
      </div>
    </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, ref, watch, onBeforeUnmount } from "vue";
import api from "../../config/api";

const props = defineProps({
  isOpen: Boolean,
  teacher: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(["close"]);

let pageScrollLocked = false;
let lockedScrollY = 0;
let originalHtmlOverflow = "";
let originalBodyStyles = null;

const lockPageScroll = () => {
  if (typeof window === "undefined" || typeof document === "undefined" || pageScrollLocked) return;

  const html = document.documentElement;
  const body = document.body;
  lockedScrollY = window.scrollY || window.pageYOffset || 0;
  originalHtmlOverflow = html.style.overflow;
  originalBodyStyles = {
    position: body.style.position,
    top: body.style.top,
    left: body.style.left,
    right: body.style.right,
    width: body.style.width,
    overflow: body.style.overflow,
    paddingRight: body.style.paddingRight
  };

  const scrollbarWidth = window.innerWidth - html.clientWidth;
  html.style.overflow = "hidden";
  body.style.position = "fixed";
  body.style.top = `-${lockedScrollY}px`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";
  body.style.overflow = "hidden";

  if (scrollbarWidth > 0) {
    body.style.paddingRight = `${scrollbarWidth}px`;
  }

  pageScrollLocked = true;
};

const unlockPageScroll = () => {
  if (typeof window === "undefined" || typeof document === "undefined" || !pageScrollLocked) return;

  const html = document.documentElement;
  const body = document.body;
  html.style.overflow = originalHtmlOverflow;

  if (originalBodyStyles) {
    body.style.position = originalBodyStyles.position;
    body.style.top = originalBodyStyles.top;
    body.style.left = originalBodyStyles.left;
    body.style.right = originalBodyStyles.right;
    body.style.width = originalBodyStyles.width;
    body.style.overflow = originalBodyStyles.overflow;
    body.style.paddingRight = originalBodyStyles.paddingRight;
  }

  pageScrollLocked = false;
  window.scrollTo(0, lockedScrollY);
};

const handleClose = () => {
  unlockPageScroll();
  emit("close");
};

const imageLoadError = ref(false);

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      lockPageScroll();
    } else {
      unlockPageScroll();
    }
  },
  { immediate: true }
);

watch(
  () => props.teacher?.profileImage,
  () => {
    imageLoadError.value = false;
  }
);

const teacherFullName = computed(() => {
  return `${props.teacher?.khmerName || ""} ${props.teacher?.englishName || ""}`.trim();
});

const teacherInitial = computed(() => {
  return (
    props.teacher?.khmerName?.charAt(0) ||
    props.teacher?.englishName?.charAt(0)?.toUpperCase() ||
    "T"
  );
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

const teacherImageUrl = computed(() => {
  return getImageUrl(props.teacher?.profileImage);
});

const formatDate = (dateString) => {
  if (!dateString) return "-";

  const parsedDate = new Date(dateString);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("km-KH", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};

onBeforeUnmount(() => {
  unlockPageScroll();
});
</script>

<style scoped>

.teacher-view-modal-panel-mobile-safe {
  font-family: "Noto Sans Khmer", "Khmer OS Battambang", "Battambang", "Khmer OS", system-ui, sans-serif;
  line-height: 1.45;
}

.teacher-view-modal-panel-mobile-safe h2,
.teacher-view-modal-panel-mobile-safe h3,
.teacher-view-modal-panel-mobile-safe p,
.teacher-view-modal-panel-mobile-safe span,
.teacher-view-modal-panel-mobile-safe button {
  line-height: 1.45;
}

.teacher-view-modal-panel-mobile-safe .break-words,
.section-title,
.info-label,
.info-value {
  overflow-wrap: anywhere;
  word-break: break-word;
}

.section-card {
  border: 1px solid #e2e8f0;
  background: #ffffff;
  border-radius: 0.75rem;
  padding: 0.65rem;
}

.section-title {
  font-size: 0.72rem;
  font-weight: 900;
  color: #1e293b;
  margin-bottom: 0.45rem;
  display: flex;
  align-items: flex-start;
  gap: 0.45rem;
  line-height: 1.45;
  overflow-wrap: anywhere;
  word-break: break-word;
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

.info-box {
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 0.55rem;
  padding: 0.4rem 0.48rem;
  min-width: 0;
}

.info-label {
  display: block;
  font-size: 0.58rem;
  font-weight: 700;
  color: #64748b;
  margin-bottom: 0.1rem;
  line-height: 1.45;
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
}

.info-value {
  font-size: 0.68rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1.45;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.font-khmer {
  font-family: "Noto Sans Khmer", "Khmer OS Battambang", "Battambang", "Siemreap", "Kantumruy Pro", sans-serif;
  line-height: 1.45;
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
  .section-card {
    padding: 0.75rem;
  }

  .info-box {
    padding: 0.45rem 0.6rem;
  }

  .info-label {
    font-size: 0.62rem;
  }

  .info-value {
    font-size: 0.75rem;
  }
}

@media (max-width: 640px) {
  .teacher-view-modal-overlay-mobile-safe {
    min-height: 100vh;
    min-height: 100dvh;
    align-items: flex-end;
    padding-bottom: calc(0.5rem + env(safe-area-inset-bottom));
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }

  .teacher-view-modal-panel-mobile-safe {
    max-height: calc(100vh - 0.75rem);
    max-height: calc(100dvh - 0.75rem);
  }

  .teacher-view-modal-body-mobile-safe {
    flex: 1 1 auto;
    min-height: 0;
    max-height: none;
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
  }

  .teacher-view-modal-footer-mobile-safe {
    position: relative;
    bottom: auto;
    z-index: 5;
    padding-bottom: calc(0.65rem + env(safe-area-inset-bottom)) !important;
    box-shadow: 0 -8px 20px rgb(15 23 42 / 0.05);
  }

  .teacher-view-modal-panel-mobile-safe h2 {
    font-size: 16px !important;
  }

  .teacher-view-modal-panel-mobile-safe .section-title {
    font-size: 14px !important;
  }

  .teacher-view-modal-panel-mobile-safe .info-label {
    font-size: 12px !important;
  }

  .teacher-view-modal-panel-mobile-safe .info-value {
    font-size: 14px !important;
  }

  .teacher-view-modal-footer-mobile-safe button {
    min-height: 35px;
    padding: 0 0.875rem !important;
    font-size: 14px !important;
  }
}

</style>