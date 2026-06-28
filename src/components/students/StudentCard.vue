<template>
  <tr
    class="border-b border-slate-100 hover:bg-blue-50/40 transition-colors cursor-pointer group"
    @click="$emit('view', student)"
  >
    <!-- Photo -->
    <td class="p-2 w-14">
      <img
        :src="studentImageUrl"
        class="w-9 h-9 rounded-full object-cover border border-blue-100 shadow-sm"
        :alt="`${student.khmerName || ''} ${student.englishName || ''}`"
      />
    </td>

    <!-- Student ID -->
    <td class="p-2 text-slate-700 text-xs font-bold hidden lg:table-cell">
      {{ student.studentId }}
    </td>

    <!-- Khmer Name -->
    <td class="p-2 text-slate-800 text-sm font-bold font-khmer">
      {{ student.khmerName }}
    </td>

    <!-- English Name -->
    <td class="p-2 text-slate-600 text-xs hidden lg:table-cell">
      {{ student.englishName }}
    </td>

    <!-- Gender -->
    <td class="p-2 text-slate-600 text-xs hidden lg:table-cell">
      <span
        :class="student.gender === 'ស្រី'
          ? 'text-pink-700 bg-pink-50 border-pink-200'
          : 'text-blue-700 bg-blue-50 border-blue-200'"
        class="px-2 py-0.5 rounded-full border text-[11px] font-bold"
      >
        {{ student.gender }}
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
        v-if="student.grade && typeof student.grade === 'object'"
        class="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-full text-[11px] font-bold"
      >
        {{ student.grade.className }}
      </span>

      <span v-else class="text-slate-400">-</span>
    </td>

    <!-- Grade -->
    <td class="p-2 text-slate-600 text-xs hidden lg:table-cell">
      <span
        v-if="student.grade && typeof student.grade === 'object'"
        class="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded-full text-[11px] font-bold"
      >
        {{ student.grade.classGrade }}
      </span>

      <span v-else class="text-slate-400">-</span>
    </td>

    <!-- Edit -->
    <td class="p-2 text-right w-12">
      <button
        @click.stop="$emit('edit', student)"
        class="inline-flex items-center justify-center p-2 bg-blue-50 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition"
        title="កែប្រែ"
      >
        <i class="fa-solid fa-pen-to-square text-sm"></i>
      </button>
    </td>

    <!-- Delete -->
    <td class="p-2 text-right pr-4 w-12">
      <button
        @click.stop="$emit('delete', student)"
        class="inline-flex items-center justify-center p-2 bg-red-50 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition"
        title="លុប"
      >
        <i class="fa-solid fa-trash text-sm"></i>
      </button>
    </td>
  </tr>
</template>

<script setup>
import { computed } from "vue";
import api from "../../config/api";

const props = defineProps({
  student: {
    type: Object,
    required: true
  }
});

defineEmits(["view", "edit", "delete"]);

const placeholderAvatar =
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
  return getImageUrl(props.student?.profileImage) || placeholderAvatar;
});

const formatDate = (date) => {
  if (!date) return "-";

  const d = new Date(date);

  return d.toLocaleDateString("km-KH", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
};
</script>

<style scoped>
.font-khmer {
  font-family: "Battambang", "Siemreap", sans-serif;
}
</style>