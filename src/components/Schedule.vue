<template>
  <div class=" bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 p-3 md:p-4">
    <div class="max-w-7xl mx-auto space-y-4">
      <!-- Header -->
      <div class="bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-sm p-3 md:p-4">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div class="flex items-start gap-3 min-w-0">
            <div class="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <i class="fa-solid fa-calendar-days text-base"></i>
            </div>

            <div class="min-w-0">
              <h1 class="text-xl font-extrabold text-slate-800 truncate">
                {{ classFilter ? `កាលវិភាគ - ${selectedClassName}` : 'ជ្រើសរើសថ្នាក់' }}
              </h1>
              <p class="text-xs text-slate-500 mt-1">
                {{ classFilter
                  ? 'គ្រប់គ្រងម៉ោងសិក្សា មុខវិជ្ជា គ្រូបង្រៀន និងបន្ទប់រៀនតាមថ្ងៃ'
                  : 'ជ្រើសរើសថ្នាក់មួយ ដើម្បីមើល ឬបង្កើតកាលវិភាគសិក្សា'
                }}
              </p>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              v-if="classFilter"
              @click="goBackToClasses"
              class="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-extrabold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-blue-600 transition"
            >
              <i class="fa-solid fa-arrow-left"></i>
              ត្រឡប់ក្រោយ
            </button>

            <button
              v-if="classFilter"
              @click="openCreateModal"
              class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition"
            >
              <i class="fa-solid fa-plus"></i>
              បន្ថែមកាលវិភាគ
            </button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div
        v-if="loading"
        class="bg-white rounded-2xl border border-slate-200 shadow-sm py-14 flex flex-col items-center justify-center"
      >
        <div class="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <i class="fa-solid fa-circle-notch fa-spin text-xl"></i>
        </div>
        <p class="text-xs font-bold text-slate-500 mt-3">
          កំពុងទាញយកកាលវិភាគ...
        </p>
      </div>

      <!-- Class Selection -->
      <template v-else-if="!classFilter">
        <!-- Search -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-3">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div class="relative flex-1">
              <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              <input
                v-model="classSearchQuery"
                type="text"
                placeholder="ស្វែងរកថ្នាក់តាមឈ្មោះ កម្រិត ឬម៉ោងសិក្សា..."
                class="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
              />
            </div>

            <div class="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
              សរុបថ្នាក់:
              <span class="text-blue-600 font-extrabold">{{ filteredClasses.length }}</span>
            </div>
          </div>
        </div>

        <!-- Classes Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          <div
            v-for="c in filteredClasses"
            :key="c._id"
            @click="selectClass(c._id)"
            class="group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-200 p-4 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 hover:border-blue-300 transition-all"
          >
            <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>

            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="h-12 w-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-sm font-black mb-3 group-hover:bg-blue-600 group-hover:text-white transition">
                  {{ c.className?.substring(0, 2).toUpperCase() || 'CL' }}
                </div>

                <h3 class="text-sm font-extrabold text-slate-800 truncate group-hover:text-blue-600 transition">
                  {{ c.className || 'មិនមានឈ្មោះថ្នាក់' }}
                </h3>

                <div class="flex flex-wrap gap-1.5 mt-2">
                  <span class="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                    <i class="fa-solid fa-layer-group text-[10px]"></i>
                    {{ c.classGrade || '-' }}
                  </span>

                  <span class="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-1 rounded-full">
                    <i class="fa-regular fa-clock text-[10px]"></i>
                    {{ c.timeStudy || '-' }}
                  </span>
                </div>
              </div>

              <div class="h-8 w-8 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 flex items-center justify-center transition">
                <i class="fa-solid fa-chevron-right text-xs"></i>
              </div>
            </div>
          </div>

          <div
            v-if="filteredClasses.length === 0"
            class="col-span-full bg-white rounded-2xl border border-dashed border-slate-300 py-12 text-center"
          >
            <div class="h-14 w-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <i class="fa-solid fa-school-circle-xmark text-2xl"></i>
            </div>
            <p class="text-sm font-extrabold text-slate-600">
              មិនមានថ្នាក់ត្រូវនឹងការស្វែងរកទេ
            </p>
            <p class="text-xs text-slate-400 mt-1">
              សូមសាកល្បងពាក្យស្វែងរកផ្សេងទៀត
            </p>
          </div>
        </div>
      </template>

      <!-- Schedule Board -->
      <template v-else>
        <!-- Summary -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-3">
            <p class="text-[11px] font-bold text-slate-500">ថ្នាក់</p>
            <p class="text-sm font-extrabold text-slate-800 mt-1 truncate">{{ selectedClassName }}</p>
          </div>

          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-3">
            <p class="text-[11px] font-bold text-slate-500">ចំនួនកាលវិភាគ</p>
            <p class="text-sm font-extrabold text-blue-600 mt-1">{{ schedules.length }} មុខ</p>
          </div>

          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-3">
            <p class="text-[11px] font-bold text-slate-500">ថ្ងៃសិក្សា</p>
            <p class="text-sm font-extrabold text-slate-800 mt-1">{{ activeDaysCount }} ថ្ងៃ</p>
          </div>
        </div>

        <!-- Days -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          <div
            v-for="day in daysOfWeek"
            :key="day"
            class="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden min-h-[230px]"
          >
            <div class="px-3 py-2.5 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
              <h3 class="font-extrabold text-blue-800 text-sm flex items-center gap-2">
                <i class="fa-solid fa-calendar-day text-xs"></i>
                {{ translateDay(day) }}
              </h3>

              <span class="h-6 min-w-6 px-2 rounded-full bg-white text-blue-600 border border-blue-100 text-[11px] font-extrabold flex items-center justify-center">
                {{ getSchedulesForDay(day).length }}
              </span>
            </div>

            <div class="p-3 space-y-2.5 flex-grow">
              <div
                v-if="getSchedulesForDay(day).length === 0"
                class="h-full min-h-[150px] flex flex-col items-center justify-center text-center text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50"
              >
                <i class="fa-regular fa-calendar-xmark text-2xl mb-2"></i>
                <p class="text-xs font-bold">មិនមានម៉ោងសិក្សា</p>
              </div>

              <div
                v-for="item in getSchedulesForDay(day)"
                :key="item._id"
                class="group relative bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:shadow-md hover:border-blue-200 transition"
              >
                <div class="flex items-start justify-between gap-2 mb-2">
                  <span class="inline-flex items-center gap-1 text-[11px] font-extrabold text-blue-700 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                    <i class="fa-regular fa-clock text-[10px]"></i>
                    {{ item.startTime }} - {{ item.endTime }}
                  </span>

                  <span class="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
                    <i class="fa-solid fa-door-open text-[10px]"></i>
                    {{ item.room || '-' }}
                  </span>
                </div>

                <h4 class="font-extrabold text-slate-800 text-sm truncate pr-12">
                  {{ item.subject?.subjectName || 'មិនមានមុខវិជ្ជា' }}
                </h4>

                <p class="text-xs text-slate-500 truncate mt-1">
                  <i class="fa-solid fa-chalkboard-user mr-1 text-slate-400"></i>
                  {{ item.teacher?.khmerName || item.teacher?.englishName || 'មិនទាន់មានគ្រូ' }}
                </p>

                <div class="absolute top-2 right-2 flex bg-white shadow-sm rounded-lg border border-slate-200 overflow-hidden opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                  <button
                    @click="openEditModal(item)"
                    class="h-7 w-7 text-blue-600 hover:bg-blue-50 transition"
                    title="កែប្រែ"
                  >
                    <i class="fa-solid fa-pen-to-square text-xs"></i>
                  </button>

                  <div class="w-px bg-slate-200"></div>

                  <button
                    @click="openDeleteModal(item)"
                    class="h-7 w-7 text-red-500 hover:bg-red-50 transition"
                    title="លុប"
                  >
                    <i class="fa-solid fa-trash text-xs"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Create/Edit Modal -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-3"
        @click="showModal = false"
      >
        <div
          class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100"
          @click.stop
        >
          <div class="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div>
              <h3 class="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <span class="h-8 w-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-xs">
                  <i :class="isEditing ? 'fa-solid fa-pen-to-square' : 'fa-solid fa-plus'"></i>
                </span>
                {{ isEditing ? 'កែប្រែកាលវិភាគ' : 'បន្ថែមកាលវិភាគ' }}
              </h3>
              <p class="text-[11px] text-slate-500 mt-0.5">
                បំពេញព័ត៌មានកាលវិភាគសិក្សា
              </p>
            </div>

            <button
              @click="showModal = false"
              class="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <i class="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="p-4 space-y-3">
            <div>
              <label class="form-label">មុខវិជ្ជា <span class="text-red-500">*</span></label>
              <select v-model="form.subject" required class="form-input">
                <option disabled value="">ជ្រើសរើសមុខវិជ្ជា</option>
                <option v-for="s in subjects" :key="s._id" :value="s._id">
                  {{ s.subjectName }}
                </option>
              </select>
            </div>

            <div>
              <label class="form-label">គ្រូបង្រៀន</label>
              <select v-model="form.teacher" class="form-input">
                <option :value="null">មិនទាន់មានគ្រូ</option>
                <option v-for="t in teachers" :key="t._id" :value="t._id">
                  {{ t.khmerName || t.englishName }}
                </option>
              </select>
            </div>

            <div>
              <label class="form-label">ថ្ងៃ <span class="text-red-500">*</span></label>
              <select v-model="form.day" required class="form-input">
                <option v-for="d in daysOfWeek" :key="d" :value="d">
                  {{ translateDay(d) }}
                </option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="form-label">ម៉ោងចាប់ផ្ដើម <span class="text-red-500">*</span></label>
                <input type="time" v-model="form.startTime" required class="form-input" />
              </div>

              <div>
                <label class="form-label">ម៉ោងបញ្ចប់ <span class="text-red-500">*</span></label>
                <input type="time" v-model="form.endTime" required class="form-input" />
              </div>
            </div>

            <div>
              <label class="form-label">បន្ទប់</label>
              <input
                type="text"
                v-model="form.room"
                class="form-input"
                placeholder="ឧ. A1 / Room 101"
              />
            </div>

            <div class="pt-3 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                @click="showModal = false"
                class="px-3.5 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
              >
                បោះបង់
              </button>

              <button
                type="submit"
                class="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
              >
                <i class="fa-solid fa-floppy-disk text-[10px]"></i>
                រក្សាទុក
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Modal -->
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-3"
        @click="closeDeleteModal"
      >
        <div
          class="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-100"
          @click.stop
        >
          <div class="px-4 py-3 bg-red-50 border-b border-red-100 flex items-center gap-3">
            <div class="h-10 w-10 rounded-full bg-white text-red-600 flex items-center justify-center shadow-sm border border-red-100">
              <i class="fa-solid fa-trash"></i>
            </div>

            <div>
              <h3 class="text-sm font-extrabold text-slate-800">លុបកាលវិភាគ?</h3>
              <p class="text-[11px] text-red-600 font-bold">សកម្មភាពនេះមិនអាចត្រឡប់ក្រោយបានទេ</p>
            </div>
          </div>

          <div class="p-4">
            <p class="text-xs text-slate-600 leading-relaxed">
              តើអ្នកពិតជាចង់លុបកាលវិភាគ
              <span class="font-extrabold text-slate-800">
                {{ scheduleToDelete?.subject?.subjectName || '' }}
              </span>
              មែនទេ?
            </p>
          </div>

          <div class="px-4 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
            <button
              @click="closeDeleteModal"
              class="px-3.5 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition"
            >
              បោះបង់
            </button>

            <button
              @click="confirmDelete"
              class="px-3.5 py-1.5 text-xs font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition shadow-sm flex items-center gap-1.5"
            >
              <i class="fa-solid fa-trash text-[10px]"></i>
              លុប
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useQuery } from "../hooks/useQuery";
import { useCollection } from "../hooks/useCollection";
import api from "../config/api";
import { useToast } from "vue-toastification";

const toast = useToast();
const { createDoc, updateDoc, deleteDoc } = useCollection('schedules');

const { data: classes } = useQuery('classes');
const { data: subjects } = useQuery('subjects');
const { data: teachers } = useQuery('teachers');

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

const schedules = ref([]);
const classFilter = ref("");
const classSearchQuery = ref("");
const loading = ref(false);
const showModal = ref(false);
const isEditing = ref(false);
const editId = ref(null);

const showDeleteModal = ref(false);
const scheduleToDelete = ref(null);

const form = ref({
  class: "",
  subject: "",
  teacher: null,
  day: "Monday",
  startTime: "07:00",
  endTime: "08:00",
  room: "A1"
});

const filteredClasses = computed(() => {
  if (!classes.value) return [];

  const query = classSearchQuery.value.toLowerCase().trim();

  if (!query) return classes.value;

  return classes.value.filter((c) => {
    const text = `${c.className || ''} ${c.classGrade || ''} ${c.timeStudy || ''}`.toLowerCase();
    return text.includes(query);
  });
});

const selectedClassName = computed(() => {
  if (!classFilter.value || !classes.value) return '';

  const selected = classes.value.find(c => c._id === classFilter.value);
  return selected ? selected.className : '';
});

const activeDaysCount = computed(() => {
  return daysOfWeek.filter(day => getSchedulesForDay(day).length > 0).length;
});

const fetchSchedules = async () => {
  if (!classFilter.value) {
    schedules.value = [];
    return;
  }

  loading.value = true;

  try {
    const res = await api.get('/schedules', {
      params: { classId: classFilter.value }
    });

    schedules.value = res.data || [];
  } catch (e) {
    console.error(e);
    toast.error("មិនអាចទាញយកកាលវិភាគបានទេ");
  } finally {
    loading.value = false;
  }
};

watch(classFilter, () => {
  fetchSchedules();
});

const translateDay = (day) => {
  const map = {
    Monday: 'ថ្ងៃចន្ទ',
    Tuesday: 'ថ្ងៃអង្គារ',
    Wednesday: 'ថ្ងៃពុធ',
    Thursday: 'ថ្ងៃព្រហស្បតិ៍',
    Friday: 'ថ្ងៃសុក្រ',
    Saturday: 'ថ្ងៃសៅរ៍',
    Sunday: 'ថ្ងៃអាទិត្យ'
  };

  return map[day] || day;
};

const goBackToClasses = () => {
  classFilter.value = "";
  schedules.value = [];
};

const selectClass = (classId) => {
  classFilter.value = classId;
};

const getSchedulesForDay = (day) => {
  return schedules.value.filter(s => s.day === day);
};

const openCreateModal = () => {
  if (!classFilter.value) {
    toast.warning("សូមជ្រើសរើសថ្នាក់ជាមុនសិន");
    return;
  }

  isEditing.value = false;
  editId.value = null;

  form.value = {
    class: classFilter.value,
    subject: "",
    teacher: null,
    day: "Monday",
    startTime: "07:00",
    endTime: "08:00",
    room: "A1"
  };

  showModal.value = true;
};

const openEditModal = (item) => {
  isEditing.value = true;
  editId.value = item._id;

  form.value = {
    class: item.class?._id || item.class,
    subject: item.subject?._id || item.subject,
    teacher: item.teacher ? (item.teacher._id || item.teacher) : null,
    day: item.day,
    startTime: item.startTime,
    endTime: item.endTime,
    room: item.room
  };

  showModal.value = true;
};

const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      await updateDoc(editId.value, form.value);
      toast.success("បានកែប្រែកាលវិភាគដោយជោគជ័យ");
    } else {
      await createDoc(form.value);
      toast.success("បានបង្កើតកាលវិភាគដោយជោគជ័យ");
    }

    showModal.value = false;
    fetchSchedules();
  } catch (e) {
    console.error(e);
    toast.error("មិនអាចរក្សាទុកកាលវិភាគបានទេ");
  }
};

const openDeleteModal = (item) => {
  scheduleToDelete.value = item;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  scheduleToDelete.value = null;
  showDeleteModal.value = false;
};

const confirmDelete = async () => {
  if (!scheduleToDelete.value?._id) return;

  try {
    await deleteDoc(scheduleToDelete.value._id);
    toast.success("បានលុបកាលវិភាគដោយជោគជ័យ");
    closeDeleteModal();
    fetchSchedules();
  } catch (e) {
    console.error(e);
    toast.error("មិនអាចលុបកាលវិភាគបានទេ");
  }
};
</script>

<style scoped>
.form-label {
  display: block;
  font-size: 0.72rem;
  font-weight: 800;
  color: #475569;
  margin-bottom: 0.25rem;
}

.form-input {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 0.5rem 0.7rem;
  font-size: 0.75rem;
  color: #334155;
  background: #ffffff;
  outline: none;
  min-height: 2.2rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgb(59 130 246 / 0.12);
}
</style>