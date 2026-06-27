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
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-3"
      @click.self="$emit('close')"
    >
      <div
        class="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[86vh] overflow-y-auto border border-slate-100"
      >
        <!-- Header -->
        <div class="px-3 py-3 border-b border-slate-100 bg-slate-50 sticky top-0 z-10 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img
              :src="teacher.avatar || placeholderImage"
              class="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100 border border-blue-200 shadow-sm"
              :alt="teacher.englishName || teacher.khmerName"
            />

            <div>
              <h2 class="text-base font-extrabold text-slate-800 font-khmer">
                {{ teacher.khmerName || 'ឈ្មោះគ្រូ' }}
              </h2>

              <p class="text-[11px] text-slate-500 mt-0.5">
                {{ teacher.englishName || 'Teacher Name' }}
              </p>

              <span class="inline-flex items-center mt-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                <i class="fa-solid fa-briefcase mr-1"></i>
                {{ teacher.skill || 'ទូទៅ' }}
              </span>
            </div>
          </div>

          <button
            type="button"
            @click="$emit('close')"
            class="h-7 w-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="p-3 space-y-3">
          <!-- Detail -->
          <div class="bg-white rounded-xl border border-slate-200 p-3">
            <h3 class="text-xs font-extrabold text-slate-800 mb-2 flex items-center gap-2">
              <span class="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[10px]">
                <i class="fa-solid fa-id-card"></i>
              </span>
              ព័ត៌មានលម្អិតរបស់គ្រូ
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
              <div class="info-box">
                <span class="info-label">ឈ្មោះខ្មែរ</span>
                <p class="info-value">{{ teacher.khmerName || '-' }}</p>
              </div>

              <div class="info-box">
                <span class="info-label">ឈ្មោះឡាតាំង</span>
                <p class="info-value">{{ teacher.englishName || '-' }}</p>
              </div>

              <div class="info-box">
                <span class="info-label">ភេទ</span>
                <p class="info-value">{{ teacher.gender || '-' }}</p>
              </div>

              <div class="info-box">
                <span class="info-label">សញ្ជាតិ</span>
                <p class="info-value">{{ teacher.nationality || '-' }}</p>
              </div>

              <div class="info-box">
                <span class="info-label">ថ្ងៃខែឆ្នាំកំណើត</span>
                <p class="info-value">{{ formatDate(teacher.dateOfBirth) }}</p>
              </div>

              <div class="info-box">
                <span class="info-label">លេខទូរស័ព្ទ</span>
                <p class="info-value">{{ teacher.phone || '-' }}</p>
              </div>

              <div class="info-box sm:col-span-2 lg:col-span-3">
                <span class="info-label">អ៊ីមែល</span>
                <p class="info-value break-all">{{ teacher.email || '-' }}</p>
              </div>
            </div>
          </div>

          <!-- Address -->
          <div class="bg-white rounded-xl border border-slate-200 p-3">
            <h3 class="text-xs font-extrabold text-slate-800 mb-2 flex items-center gap-2">
              <span class="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[10px]">
                <i class="fa-solid fa-location-dot"></i>
              </span>
              លំនៅដ្ឋានបច្ចុប្បន្ន
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
              <div class="info-box">
                <span class="info-label">ភូមិ</span>
                <p class="info-value">{{ teacher.currentResidence?.village || '-' }}</p>
              </div>

              <div class="info-box">
                <span class="info-label">ឃុំ/សង្កាត់</span>
                <p class="info-value">{{ teacher.currentResidence?.commune || '-' }}</p>
              </div>

              <div class="info-box">
                <span class="info-label">ស្រុក/ខណ្ឌ</span>
                <p class="info-value">{{ teacher.currentResidence?.district || '-' }}</p>
              </div>

              <div class="info-box">
                <span class="info-label">ខេត្ត/ក្រុង</span>
                <p class="info-value">{{ teacher.currentResidence?.province || '-' }}</p>
              </div>
            </div>
          </div>

          <!-- More Info -->
          <div class="bg-white rounded-xl border border-slate-200 p-3">
            <h3 class="text-xs font-extrabold text-slate-800 mb-2 flex items-center gap-2">
              <span class="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[10px]">
                <i class="fa-solid fa-circle-info"></i>
              </span>
              ព័ត៌មានបន្ថែម
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div class="info-box">
                <span class="info-label">ជំនាញ</span>
                <p class="info-value">{{ teacher.skill || '-' }}</p>
              </div>

              <div class="info-box">
                <span class="info-label">Facebook</span>
                <p class="info-value break-all">{{ teacher.facebook || '-' }}</p>
              </div>

              <div class="info-box">
                <span class="info-label">Telegram</span>
                <p class="info-value break-all">{{ teacher.telegram || '-' }}</p>
              </div>

              <div class="info-box">
                <span class="info-label">កំណត់សម្គាល់</span>
                <p class="info-value">{{ teacher.note || '-' }}</p>
              </div>
            </div>
          </div>

          <!-- Footer -->
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
  </Transition>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  teacher: {
    type: Object,
    default: () => ({})
  },
});

defineEmits(['close']);

const placeholderImage = computed(() => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(props.teacher.englishName || props.teacher.khmerName || 'Teacher')}&background=2563eb&color=fff&size=128`;
});

const formatDate = (dateString) => {
  if (!dateString) return '-';

  return new Date(dateString).toLocaleDateString('km-KH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
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