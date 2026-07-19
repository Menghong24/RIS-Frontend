<template>
  <div
    class="teacher-card-text-safe group flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md border border-slate-200 hover:border-blue-300 transition-all duration-300 cursor-pointer w-full relative overflow-hidden"
    @click="$emit('view', teacher)"
  >
    <!-- Avatar -->
    <div class="relative flex-shrink-0">
      <div
        class="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-100 shadow-sm bg-blue-50 text-blue-700 flex items-center justify-center font-extrabold transition-transform duration-300 group-hover:scale-105"
      >
        <img
          v-if="teacherImageUrl && !imageLoadError"
          :src="teacherImageUrl"
          class="w-full h-full object-cover"
          :alt="teacherFullName || 'Teacher'"
          @error="imageLoadError = true"
        />

        <span v-else class="text-base leading-snug">
          {{ teacherInitial }}
        </span>
      </div>
    </div>

    <!-- Info -->
    <div class="flex-grow min-w-0">
      <div class="flex items-start gap-2 mb-0.5 min-w-0">
        <h3 class="text-sm font-extrabold text-slate-800 break-words font-khmer leading-snug min-w-0 flex-1">
          {{ teacher.khmerName || "ឈ្មោះគ្រូ" }}
        </h3>

        <span
          class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 whitespace-normal leading-snug shrink-0 max-w-[7rem] break-words"
        >
          {{ teacher.skill || "ទូទៅ" }}
        </span>
      </div>

      <p class="text-xs text-slate-500 font-medium break-words leading-snug">
        {{ teacher.englishName || "Teacher Name" }}
      </p>

      <p class="text-[11px] text-slate-400 mt-0.5 break-words leading-snug">
        <i class="fa-solid fa-envelope mr-1"></i>
        {{ teacher.email || "មិនមានអ៊ីមែល" }}
      </p>

      <p class="text-[11px] text-slate-400 mt-0.5 break-words leading-snug">
        <i class="fa-solid fa-phone mr-1"></i>
        {{ teacher.phone || "មិនមានលេខទូរស័ព្ទ" }}
      </p>
    </div>

    <!-- Actions -->
    <div
      class="flex-shrink-0 flex gap-1.5 opacity-100 sm:opacity-0 sm:translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
    >
      <button
        @click.stop="$emit('edit', teacher)"
        class="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition shadow-sm"
        title="កែប្រែ"
      >
        <i class="fa-solid fa-pen-to-square text-xs"></i>
      </button>

      <button
        @click.stop="$emit('delete', teacher)"
        class="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition shadow-sm"
        title="លុប"
      >
        <i class="fa-solid fa-trash text-xs"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import api from "../../config/api";

const props = defineProps({
  teacher: {
    type: Object,
    required: true,
    default: () => ({})
  }
});

defineEmits(["view", "edit", "delete"]);

const imageLoadError = ref(false);

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
</script>

<style scoped>
.teacher-card-text-safe,
.teacher-card-text-safe p,
.teacher-card-text-safe span,
.teacher-card-text-safe h3,
.teacher-card-text-safe button {
  line-height: 1.45;
}

.teacher-card-text-safe {
  font-family: "Noto Sans Khmer", "Khmer OS Battambang", "Battambang", "Khmer OS", system-ui, sans-serif;
}

.teacher-card-text-safe p,
.teacher-card-text-safe span,
.teacher-card-text-safe h3 {
  overflow-wrap: anywhere;
  word-break: break-word;
}

.font-khmer {
  line-height: 1.45;
}
</style>
