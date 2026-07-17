<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-2 sm:p-3"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white rounded-t-2xl sm:rounded-xl shadow-xl w-full max-w-2xl max-h-[92dvh] sm:max-h-[88vh] overflow-hidden border border-slate-100 flex flex-col"
    >
      <!-- Header -->
      <div
        class="px-2.5 sm:px-3 py-2.5 sm:py-3 border-b border-slate-100 bg-slate-50 flex items-start justify-between gap-2 sm:gap-3 shrink-0"
      >
        <div class="flex items-center gap-2 sm:gap-3 min-w-0">
          <div
            class="w-11 h-11 sm:w-14 sm:h-14 rounded-full overflow-hidden ring-2 ring-blue-100 border border-blue-200 shadow-sm bg-blue-50 text-blue-700 flex items-center justify-center font-extrabold shrink-0"
          >
            <img
              v-if="studentImageUrl && !imageLoadError"
              :src="studentImageUrl"
              class="w-full h-full object-cover"
              :alt="studentFullName || 'Student'"
              @error="imageLoadError = true"
            />

            <span v-else class="text-sm sm:text-lg">
              {{ studentInitial }}
            </span>
          </div>

          <div class="min-w-0">
            <h2 class="text-sm sm:text-base font-extrabold text-slate-800 truncate">
              {{ student?.khmerName || "មិនមានឈ្មោះ" }}
            </h2>

            <p class="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">
              {{ student?.englishName || "-" }}
            </p>

            <div class="flex flex-wrap items-center gap-1 sm:gap-1.5 mt-1.5">
              <span
                class="bg-blue-50 text-blue-700 border border-blue-200 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold leading-none"
              >
                <i class="fa-solid fa-id-card mr-0.5 sm:mr-1"></i>
                {{ student?.studentId || "-" }}
              </span>

              <span
                :class="
                  student?.gender === 'ស្រី'
                    ? 'bg-pink-50 text-pink-700 border-pink-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                "
                class="border px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold leading-none"
              >
                <i class="fa-solid fa-venus-mars mr-0.5 sm:mr-1"></i>
                {{ student?.gender || "-" }}
              </span>

              <span
                :class="statusClass"
                class="border px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold leading-none"
              >
                <i class="fa-solid fa-circle-info mr-0.5 sm:mr-1"></i>
                {{ statusLabel }}
              </span>
            </div>
          </div>
        </div>

        <button
          @click="$emit('close')"
          class="h-7 w-7 sm:h-8 sm:w-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition shrink-0"
        >
          <i class="fa-solid fa-xmark text-sm"></i>
        </button>
      </div>

      <!-- Body -->
      <div class="p-2.5 sm:p-3 space-y-2.5 sm:space-y-3 overflow-y-auto modal-scroll">
        <!-- Student Details -->
        <div class="section-card">
          <h3 class="section-title">
            <span class="section-icon">
              <i class="fa-solid fa-user-graduate"></i>
            </span>
            ព័ត៌មានលម្អិតរបស់សិស្ស
          </h3>

          <div class="grid grid-cols-2 lg:grid-cols-3 gap-1.5 sm:gap-2 text-xs">
            <div class="info-box">
              <span class="info-label">ឈ្មោះខ្មែរ</span>
              <p class="info-value">{{ student?.khmerName || "-" }}</p>
            </div>

            <div class="info-box">
              <span class="info-label">ឈ្មោះឡាតាំង</span>
              <p class="info-value">{{ student?.englishName || "-" }}</p>
            </div>

            <div class="info-box">
              <span class="info-label">ភេទ</span>
              <p class="info-value">{{ student?.gender || "-" }}</p>
            </div>

            <div class="info-box">
              <span class="info-label">សញ្ជាតិ</span>
              <p class="info-value">{{ student?.nationality?.student || "ខ្មែរ" }}</p>
            </div>

            <div class="info-box">
              <span class="info-label">ថ្ងៃកំណើត</span>
              <p class="info-value">{{ formatDate(student?.birthDate || student?.dob) }}</p>
            </div>

            <div class="info-box">
              <span class="info-label">អាយុ</span>
              <p class="info-value">{{ studentAge }}</p>
            </div>

            <div class="info-box">
              <span class="info-label">អត្តលេខ</span>
              <p class="info-value">{{ student?.studentId || student?.idCode || "-" }}</p>
            </div>

            <div class="info-box">
              <span class="info-label">ថ្ងៃចូលរៀន</span>
              <p class="info-value">{{ formatDate(student?.joinDate) }}</p>
            </div>

            <div class="info-box">
              <span class="info-label">ស្ថានភាព</span>
              <p class="info-value">{{ statusLabel }}</p>
            </div>

            <div class="info-box">
              <span class="info-label">ថ្នាក់រៀន</span>
              <p class="info-value">{{ studentClassName }}</p>
            </div>

            <div class="info-box">
              <span class="info-label">កម្រិតថ្នាក់</span>
              <p class="info-value">{{ studentClassGrade }}</p>
            </div>

            <div class="info-box">
              <span class="info-label">ម៉ោងសិក្សា</span>
              <p class="info-value">{{ studentClassTime }}</p>
            </div>
          </div>
        </div>

        <!-- Guardian -->
        <div class="section-card">
          <h3 class="section-title">
            <span class="section-icon">
              <i class="fa-solid fa-user-shield"></i>
            </span>
            ព័ត៌មានអាណាព្យាបាល
          </h3>

          <div class="grid grid-cols-2 gap-1.5 sm:gap-2 text-xs">
            <div class="info-box">
              <span class="info-label">ឈ្មោះអាណាព្យាបាល</span>
              <p class="info-value">{{ student?.family?.motherName || "-" }}</p>
            </div>

            <div class="info-box">
              <span class="info-label">លេខទូរស័ព្ទ</span>
              <p class="info-value">{{ student?.family?.motherNumber || "-" }}</p>
            </div>

            <div class="info-box col-span-2">
              <span class="info-label">គណនី Facebook</span>
              <p class="info-value">{{ student?.family?.motherFacebook || "-" }}</p>
            </div>
          </div>
        </div>

        <!-- Current Residence -->
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
              <p class="info-value">{{ student?.currentResidence?.village || "-" }}</p>
            </div>

            <div class="info-box">
              <span class="info-label">ឃុំ/សង្កាត់</span>
              <p class="info-value">{{ student?.currentResidence?.commune || "-" }}</p>
            </div>

            <div class="info-box">
              <span class="info-label">ស្រុក/ខណ្ឌ</span>
              <p class="info-value">{{ student?.currentResidence?.district || "-" }}</p>
            </div>

            <div class="info-box">
              <span class="info-label">ខេត្ត/ក្រុង</span>
              <p class="info-value">{{ student?.currentResidence?.province || "-" }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="px-2.5 sm:px-3 py-2.5 border-t border-slate-100 bg-white flex justify-end shrink-0">
        <button
          @click="$emit('close')"
          class="px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center gap-1.5 sm:gap-2"
        >
          <i class="fa-solid fa-xmark text-[10px] sm:text-xs"></i>
          បិទ
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import api from "../../config/api";

const props = defineProps({
  isOpen: Boolean,
  student: {
    type: Object,
    default: null
  }
});

defineEmits(["close"]);

const imageLoadError = ref(false);

watch(
  () => props.student?.profileImage,
  () => {
    imageLoadError.value = false;
  }
);

const studentFullName = computed(() => {
  return `${props.student?.khmerName || ""} ${props.student?.englishName || ""}`.trim();
});

const studentInitial = computed(() => {
  return (
    props.student?.khmerName?.charAt(0) ||
    props.student?.englishName?.charAt(0)?.toUpperCase() ||
    "S"
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

const studentImageUrl = computed(() => {
  return getImageUrl(props.student?.profileImage);
});

const studentClassObject = computed(() => {
  if (props.student?.grade && typeof props.student.grade === "object") {
    return props.student.grade;
  }

  if (props.student?.class && typeof props.student.class === "object") {
    return props.student.class;
  }

  if (props.student?.classId && typeof props.student.classId === "object") {
    return props.student.classId;
  }

  return null;
});

const studentClassName = computed(() => {
  return studentClassObject.value?.className || "-";
});

const studentClassGrade = computed(() => {
  return studentClassObject.value?.classGrade || "-";
});

const studentClassTime = computed(() => {
  return studentClassObject.value?.timeStudy || "-";
});

const studentAge = computed(() => {
  if (props.student?.age !== undefined && props.student?.age !== null) {
    return `${props.student.age} ឆ្នាំ`;
  }

  const dateValue = props.student?.birthDate || props.student?.dob;

  if (!dateValue) {
    return "-";
  }

  const birthDate = new Date(dateValue);

  if (Number.isNaN(birthDate.getTime())) {
    return "-";
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return `${age} ឆ្នាំ`;
});

const statusLabel = computed(() => {
  const status = props.student?.status || "active";

  if (status === "active") return "កំពុងសិក្សា";
  if (status === "inactive") return "ផ្អាក";
  if (status === "suspended") return "ផ្អាកការសិក្សា";
  if (status === "dropped") return "ឈប់រៀន";
  if (status === "graduated") return "បញ្ចប់ការសិក្សា";

  return status;
});

const statusClass = computed(() => {
  const status = props.student?.status || "active";

  if (status === "active") {
    return "bg-green-50 text-green-700 border-green-200";
  }

  if (status === "inactive" || status === "suspended") {
    return "bg-orange-50 text-orange-700 border-orange-200";
  }

  if (status === "dropped") {
    return "bg-red-50 text-red-700 border-red-200";
  }

  if (status === "graduated") {
    return "bg-purple-50 text-purple-700 border-purple-200";
  }

  return "bg-slate-50 text-slate-700 border-slate-200";
});

const formatDate = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("km-KH", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
};
</script>

<style scoped>
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
  align-items: center;
  gap: 0.45rem;
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info-value {
  font-size: 0.68rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1.35;
  word-break: break-word;
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
</style>