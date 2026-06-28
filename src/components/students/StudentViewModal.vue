<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-3"
  >
    <div
      class="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[88vh] overflow-y-auto border border-slate-100"
    >
      <!-- Header -->
      <div class="px-3 py-3 border-b border-slate-100 bg-slate-50 flex items-start justify-between gap-3">
        <div class="flex items-center gap-3">
          <img
            :src="studentImageUrl"
            class="w-14 h-14 rounded-full object-cover ring-2 ring-blue-100 border border-blue-200 shadow-sm"
            :alt="student?.khmerName || 'Student'"
          />

          <div>
            <h2 class="text-base font-extrabold text-slate-800">
              {{ student?.khmerName || "មិនមានឈ្មោះ" }}
            </h2>

            <p class="text-[11px] text-slate-500 mt-0.5">
              {{ student?.englishName || "-" }}
            </p>

            <div class="flex flex-wrap items-center gap-1.5 mt-1.5">
              <span class="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                <i class="fa-solid fa-id-card mr-1"></i>
                {{ student?.studentId || "-" }}
              </span>

              <span
                :class="student?.gender === 'ស្រី'
                  ? 'bg-pink-50 text-pink-700 border-pink-200'
                  : 'bg-blue-50 text-blue-700 border-blue-200'"
                class="border px-2 py-0.5 rounded-full text-[10px] font-bold"
              >
                <i class="fa-solid fa-venus-mars mr-1"></i>
                {{ student?.gender || "-" }}
              </span>
            </div>
          </div>
        </div>

        <button
          @click="$emit('close')"
          class="h-7 w-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <i class="fa-solid fa-xmark text-sm"></i>
        </button>
      </div>

      <!-- Body -->
      <div class="p-3 space-y-3">
        <!-- Student Details -->
        <div class="border border-slate-200 p-3 rounded-xl bg-white">
          <h3 class="text-xs font-extrabold text-slate-800 mb-2 flex items-center gap-2">
            <span class="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[10px]">
              <i class="fa-solid fa-user-graduate"></i>
            </span>
            ព័ត៌មានលម្អិតរបស់សិស្ស
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
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
              <span class="info-label">ថ្ងៃខែឆ្នាំកំណើត</span>
              <p class="info-value">{{ formatDate(student?.birthDate) }}</p>
            </div>

            <div class="info-box">
              <span class="info-label">អត្តលេខ</span>
              <p class="info-value">{{ student?.studentId || "-" }}</p>
            </div>

            <div class="info-box">
              <span class="info-label">ថ្ងៃចូលរៀន</span>
              <p class="info-value">{{ formatDate(student?.joinDate) }}</p>
            </div>

            <div class="info-box">
              <span class="info-label">ថ្នាក់រៀន</span>
              <p class="info-value">{{ student?.grade?.className || "-" }}</p>
            </div>

            <div class="info-box">
              <span class="info-label">កម្រិតថ្នាក់</span>
              <p class="info-value">{{ student?.grade?.classGrade || "-" }}</p>
            </div>
          </div>
        </div>

        <!-- Guardian -->
        <div class="border border-slate-200 p-3 rounded-xl bg-white">
          <h3 class="text-xs font-extrabold text-slate-800 mb-2 flex items-center gap-2">
            <span class="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[10px]">
              <i class="fa-solid fa-user-shield"></i>
            </span>
            ព័ត៌មានអាណាព្យាបាល
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div class="info-box">
              <span class="info-label">ឈ្មោះអាណាព្យាបាល</span>
              <p class="info-value">{{ student?.family?.motherName || "-" }}</p>
            </div>

            <div class="info-box">
              <span class="info-label">លេខទូរស័ព្ទ</span>
              <p class="info-value">{{ student?.family?.motherNumber || "-" }}</p>
            </div>

            <div class="info-box sm:col-span-2">
              <span class="info-label">គណនី Facebook</span>
              <p class="info-value">{{ student?.family?.motherFacebook || "-" }}</p>
            </div>
          </div>
        </div>

        <!-- Current Residence -->
        <div class="border border-slate-200 p-3 rounded-xl bg-white">
          <h3 class="text-xs font-extrabold text-slate-800 mb-2 flex items-center gap-2">
            <span class="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[10px]">
              <i class="fa-solid fa-location-dot"></i>
            </span>
            លំនៅដ្ឋានបច្ចុប្បន្ន
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
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

        <!-- Actions -->
        <div class="pt-2 flex justify-end border-t border-slate-100">
          <button
            @click="$emit('close')"
            class="px-4 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center gap-2"
          >
            <i class="fa-solid fa-xmark"></i>
            បិទ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import api from "../../config/api";

const props = defineProps({
  isOpen: Boolean,
  student: {
    type: Object,
    default: null
  }
});

defineEmits(["close"]);

const avatar =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4cXH1syfrG2BHeN176taDZCnbb5AiP5Y9sw&s";

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
  return getImageUrl(props.student?.profileImage) || avatar;
});

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("km-KH", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
};
</script>

<style scoped>
.info-box {
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 0.6rem;
  padding: 0.45rem 0.6rem;
}

.info-label {
  display: block;
  font-size: 0.62rem;
  font-weight: 700;
  color: #64748b;
  margin-bottom: 0.15rem;
}

.info-value {
  font-size: 0.75rem;
  font-weight: 700;
  color: #1e293b;
}
</style>