<template>
  <tr
    class="student-card-row border-b border-slate-100 hover:bg-blue-50/40 transition-colors cursor-pointer group"
    @click="$emit('view', student)"
  >
    <!-- Photo -->
    <td class="p-1.5 sm:p-2 w-11 sm:w-14 align-top">
      <div
        class="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-blue-100 shadow-sm bg-blue-50 text-blue-700 flex items-center justify-center font-extrabold"
      >
        <img
          v-if="studentImageUrl && !imageLoadError"
          :src="studentImageUrl"
          class="w-full h-full object-cover"
          :alt="studentFullName"
          @error="imageLoadError = true"
        />

        <span v-else class="text-[10px] sm:text-xs">
          {{ studentInitial }}
        </span>
      </div>
    </td>

    <!-- Student ID -->
    <td class="p-2 text-slate-700 text-xs font-bold hidden lg:table-cell">
      {{ student.studentId || "-" }}
    </td>

    <!-- Khmer Name + Mobile Details -->
    <td
      class="p-1.5 sm:p-2 text-slate-800 text-xs sm:text-sm font-bold"
    >
      <div class="min-w-0">
        <p class="leading-snug break-words">
          {{ student.khmerName || "-" }}
        </p>

        <!-- Mobile Details -->
        <div
          class="lg:hidden mt-1.5 space-y-1 text-[10px] sm:text-[11px] font-medium text-slate-500"
        >
          <div class="flex flex-wrap items-center gap-1">
            <span
              class="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 font-bold leading-snug"
            >
              <i class="fa-solid fa-id-card text-[9px] text-slate-400"></i>
              {{ student.studentId || "-" }}
            </span>

            <span
              :class="
                student.gender === 'ស្រី'
                  ? 'text-pink-700 bg-pink-50 border-pink-200'
                  : 'text-blue-700 bg-blue-50 border-blue-200'
              "
              class="inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-bold leading-snug"
            >
              <i class="fa-solid fa-user text-[9px]"></i>
              {{ student.gender || "-" }}
            </span>

            <span
              v-if="studentClassName"
              class="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 font-bold leading-snug"
            >
              <i class="fa-solid fa-school text-[9px]"></i>
              {{ studentClassName }}
            </span>

            <span
              v-if="studentClassGrade"
              class="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.5 font-bold leading-snug"
            >
              {{ studentClassGrade }}
            </span>
          </div>

          <div
            v-if="student.englishName"
            class="flex items-center gap-1 text-slate-500 min-w-0"
          >
            <i class="fa-solid fa-language text-[9px] text-slate-400 w-3 shrink-0"></i>
            <span class="break-words leading-snug">
              {{ student.englishName }}
            </span>
          </div>

          <div
            class="grid grid-cols-1 xs:grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] text-slate-500"
          >
            <div class="flex items-center gap-1 min-w-0">
              <i class="fa-solid fa-cake-candles text-[9px] text-slate-400 w-3 shrink-0"></i>
              <span class="break-words leading-snug">
                កំណើត៖ {{ formatDate(student.birthDate) }}
              </span>
            </div>

            <div class="flex items-center gap-1 min-w-0">
              <i class="fa-solid fa-calendar-plus text-[9px] text-slate-400 w-3 shrink-0"></i>
              <span class="break-words leading-snug">
                ចូលរៀន៖ {{ formatDate(student.joinDate) }}
              </span>
            </div>

            <div class="flex items-center gap-1 min-w-0">
              <i class="fa-solid fa-flag text-[9px] text-slate-400 w-3 shrink-0"></i>
              <span class="break-words leading-snug">
                សញ្ជាតិ៖ {{ student.nationality?.student || "ខ្មែរ" }}
              </span>
            </div>
          </div>

          <!-- Mobile Actions: near student data -->
          <div class="flex items-center gap-1.5 pt-2">
            <button
              @click.stop="$emit('edit', student)"
              class="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg border border-blue-100 transition text-[10px] font-extrabold"
              title="កែប្រែ"
            >
              <i class="fa-solid fa-pen-to-square text-[10px]"></i>
              កែ
            </button>

            <button
              @click.stop="$emit('delete', student)"
              class="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg border border-red-100 transition text-[10px] font-extrabold"
              title="លុប"
            >
              <i class="fa-solid fa-trash text-[10px]"></i>
              លុប
            </button>
          </div>
        </div>
      </div>
    </td>

    <!-- English Name -->
    <td class="p-2 text-slate-600 text-xs hidden lg:table-cell">
      {{ student.englishName || "-" }}
    </td>

    <!-- Gender -->
    <td class="p-2 text-slate-600 text-xs hidden lg:table-cell">
      <span
        :class="
          student.gender === 'ស្រី'
            ? 'text-pink-700 bg-pink-50 border-pink-200'
            : 'text-blue-700 bg-blue-50 border-blue-200'
        "
        class="px-2 py-0.5 rounded-full border text-[11px] font-bold"
      >
        {{ student.gender || "-" }}
      </span>
    </td>

    <!-- Birth Date -->
    <td class="p-2 text-slate-600 text-xs hidden lg:table-cell">
      {{ formatDate(student.birthDate) }}
    </td>

    <!-- Nationality -->
    <td class="p-2 text-slate-600 text-xs hidden lg:table-cell">
      {{ student.nationality?.student || "ខ្មែរ" }}
    </td>

    <!-- Join Date -->
    <td class="p-2 text-slate-600 text-xs hidden lg:table-cell">
      {{ formatDate(student.joinDate) }}
    </td>

    <!-- Class Name -->
    <td class="p-2 text-slate-600 text-xs hidden lg:table-cell">
      <span
        v-if="studentClassName"
        class="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-full text-[11px] font-bold"
      >
        {{ studentClassName }}
      </span>

      <span v-else class="text-slate-400">-</span>
    </td>

    <!-- Grade -->
    <td class="p-2 text-slate-600 text-xs hidden lg:table-cell">
      <span
        v-if="studentClassGrade"
        class="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded-full text-[11px] font-bold"
      >
        {{ studentClassGrade }}
      </span>

      <span v-else class="text-slate-400">-</span>
    </td>

    <!-- Edit: desktop only -->
    <td class="p-2 text-right w-12 align-top hidden lg:table-cell">
      <button
        @click.stop="$emit('edit', student)"
        class="inline-flex items-center justify-center w-8 h-8 bg-blue-50 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition"
        title="កែប្រែ"
      >
        <i class="fa-solid fa-pen-to-square text-sm"></i>
      </button>
    </td>

    <!-- Delete: desktop only -->
    <td class="p-2 text-right pr-4 w-12 align-top hidden lg:table-cell">
      <button
        @click.stop="$emit('delete', student)"
        class="inline-flex items-center justify-center w-8 h-8 bg-red-50 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition"
        title="លុប"
      >
        <i class="fa-solid fa-trash text-sm"></i>
      </button>
    </td>
  </tr>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import api from "../../config/api";

const props = defineProps({
  student: {
    type: Object,
    required: true
  }
});

defineEmits(["view", "edit", "delete"]);

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

const getClassObject = computed(() => {
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
  return getClassObject.value?.className || "";
});

const studentClassGrade = computed(() => {
  return getClassObject.value?.classGrade || "";
});

const formatDate = (date) => {
  if (!date) return "-";

  const d = new Date(date);

  if (Number.isNaN(d.getTime())) {
    return "-";
  }

  return d.toLocaleDateString("km-KH", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
};
</script>

<style scoped>

.student-card-row,
.student-card-row td,
.student-card-row p,
.student-card-row span,
.student-card-row button {
  line-height: 1.45;
}

.student-card-row td {
  vertical-align: middle;
}

.student-card-row .break-words {
  overflow-wrap: anywhere;
  word-break: break-word;
}

.font-khmer {
  font-family: "Battambang", "Siemreap", sans-serif;
}

@media (max-width: 420px) {
  td {
    vertical-align: top;
  }
}
</style>