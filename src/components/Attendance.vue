<template>
  <div class=" bg-slate-50 p-3 md:p-4">
    <!-- Header -->
    <div class="max-w-7xl mx-auto mb-4">
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm px-3 py-3 md:px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div class="min-w-0">
          <h1 class="text-lg md:text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <span class="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm shrink-0">
              <i class="fa-solid fa-clipboard-check"></i>
            </span>
            គ្រប់គ្រងវត្តមានសិស្ស
          </h1>

          <p class="text-slate-500 text-xs mt-1 truncate" v-if="!selectedClass">
            សូមជ្រើសរើសថ្នាក់ដើម្បីកត់ត្រាវត្តមាន
          </p>

          <p class="text-slate-500 text-xs mt-1 truncate" v-else>
            ថ្នាក់រៀន៖
            <span class="font-bold text-slate-700">{{ selectedClass.className }}</span>
            <span class="mx-1 text-slate-300">•</span>
            សិស្សសរុប៖
            <span class="font-bold text-emerald-700">{{ attendance.length }}</span>
            នាក់
          </p>
        </div>

        <div class="flex items-center gap-2 w-full md:w-auto">
          <div v-if="!selectedClass" class="relative w-full md:w-72">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-xs">
              <i class="fa-solid fa-magnifying-glass"></i>
            </span>

            <input
              v-model="searchQuery"
              type="text"
              placeholder="ស្វែងរកថ្នាក់រៀន..."
              class="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-white text-xs text-slate-700 outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition"
            />
          </div>

          <button
            v-else
            @click="closeAttendance"
            class="whitespace-nowrap flex items-center gap-2 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-bold transition shadow-sm"
          >
            <i class="fa-solid fa-arrow-left"></i>
            ត្រឡប់ក្រោយ
          </button>
        </div>
      </div>
    </div>

    <!-- Class Cards -->
    <div
      v-if="!selectedClass"
      class="max-w-7xl mx-auto"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        <div
          v-for="cls in filteredClasses"
          :key="cls._id"
          @click="openAttendance(cls)"
          class="bg-white p-3 rounded-xl shadow-sm border border-slate-200 hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all group"
        >
          <div class="flex items-start justify-between gap-2 mb-2">
            <div class="w-9 h-9 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center text-base group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
              <i class="fa-solid fa-school"></i>
            </div>

            <span class="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] rounded-full font-bold">
              សកម្ម
            </span>
          </div>

          <h3 class="font-extrabold text-sm text-slate-800 leading-tight truncate">
            {{ cls.className }}
          </h3>

          <p class="text-slate-500 text-[11px] mt-1 truncate">
            គ្រូបន្ទុក៖ {{ cls.teacherName || 'មិនទាន់កំណត់' }}
          </p>

          <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-400 text-[11px]">
            <span>
              <i class="fa-solid fa-users mr-1"></i>
              {{ cls.students?.length || 0 }} នាក់
            </span>

            <span class="text-emerald-600 font-bold">
              ចូល
              <i class="fa-solid fa-chevron-right ml-1"></i>
            </span>
          </div>
        </div>
      </div>

      <div
        v-if="filteredClasses.length === 0"
        class="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 mt-3"
      >
        <div class="text-2xl mb-2">
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>

        <p class="text-sm font-bold text-slate-500">
          មិនមានថ្នាក់រៀនដែលត្រូវនឹងការស្វែងរក
        </p>
      </div>
    </div>

    <!-- Attendance Panel -->
    <div
      v-else
      class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-7xl mx-auto"
    >
      <!-- Toolbar -->
      <div class="p-3 bg-slate-50 border-b border-slate-200">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[180px_180px_1fr_auto] gap-2 items-end">
          <div>
            <label class="block text-[11px] font-bold text-slate-500 mb-1">
              កាលបរិច្ឆេទ
            </label>

            <input
              v-model="filters.date"
              type="date"
              @change="fetchData"
              class="w-full border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-700 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition bg-white"
            />
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-500 mb-1">
              វេនសិក្សា
            </label>

            <select
              v-model="filters.session"
              @change="fetchData"
              class="w-full border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-700 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none bg-white transition"
            >
              <option value="morning">វេនព្រឹក</option>
              <option value="afternoon">វេនរសៀល</option>
              <option value="evening">វេនល្ងាច</option>
            </select>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div class="rounded-lg border border-slate-200 bg-white px-3 py-2">
              <p class="text-[10px] text-slate-400 font-bold">សរុប</p>
              <p class="text-sm font-extrabold text-slate-800">{{ attendance.length }}</p>
            </div>

            <div class="rounded-lg border border-green-100 bg-green-50 px-3 py-2">
              <p class="text-[10px] text-green-600 font-bold">វត្តមាន</p>
              <p class="text-sm font-extrabold text-green-700">{{ countByStatus.present }}</p>
            </div>

            <div class="rounded-lg border border-red-100 bg-red-50 px-3 py-2">
              <p class="text-[10px] text-red-600 font-bold">អវត្តមាន</p>
              <p class="text-sm font-extrabold text-red-700">{{ countByStatus.absent }}</p>
            </div>

            <div class="rounded-lg border border-orange-100 bg-orange-50 px-3 py-2">
              <p class="text-[10px] text-orange-600 font-bold">យឺត/ច្បាប់</p>
              <p class="text-sm font-extrabold text-orange-700">
                {{ countByStatus.late + countByStatus.permission }}
              </p>
            </div>
          </div>

          <div class="text-left lg:text-right">
            <p class="text-[10px] text-slate-400 font-bold">ស្ថានភាព</p>

            <span
              v-if="mode === 'edit'"
              class="inline-flex items-center gap-1 mt-1 px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-[11px] font-bold whitespace-nowrap"
            >
              <i class="fa-solid fa-pen-to-square"></i>
              កែប្រែ
            </span>

            <span
              v-else
              class="inline-flex items-center gap-1 mt-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold whitespace-nowrap"
            >
              <i class="fa-solid fa-plus"></i>
              បង្កើតថ្មី
            </span>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="p-8 text-center text-slate-400">
        <div class="mx-auto mb-2 h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <i class="fa-solid fa-circle-notch fa-spin text-xl"></i>
        </div>

        <p class="font-bold text-sm text-slate-500">
          កំពុងទាញយកទិន្នន័យ...
        </p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs min-w-[850px]">
          <thead>
            <tr class="bg-slate-100 text-slate-700">
              <th class="p-2 font-bold border border-slate-200 text-center w-10">
                ល.រ
              </th>

              <th class="p-2 font-bold border border-slate-200">
                ព័ត៌មានសិស្ស
              </th>

              <th class="p-2 font-bold border border-slate-200 text-center w-[330px]">
                ស្ថានភាពវត្តមាន
              </th>

              <th class="p-2 font-bold border border-slate-200 w-52">
                សម្គាល់
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(record, index) in attendance"
              :key="record.student?._id || record.student"
              class="hover:bg-slate-50 transition border-b border-slate-100"
            >
              <td class="p-2 border border-slate-100 text-center text-slate-500">
                {{ index + 1 }}
              </td>

              <td class="p-2 border border-slate-100">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold overflow-hidden shrink-0">
                    <img
                      v-if="record.student?.photo"
                      :src="record.student.photo"
                      class="w-full h-full object-cover"
                    />

                    <span v-else class="text-xs">
                      {{ getStudentInitial(record.student) }}
                    </span>
                  </div>

                  <div class="min-w-0">
                    <p class="font-bold text-slate-800 leading-tight truncate">
                      {{ record.student?.khmerName || 'មិនមានឈ្មោះ' }}
                    </p>

                    <p class="text-[10px] text-slate-400 font-mono leading-tight truncate">
                      {{ record.student?.studentId || '-' }} - {{ record.student?.gender || '-' }}
                    </p>
                  </div>
                </div>
              </td>

              <td class="p-2 border border-slate-100">
                <div class="flex items-center justify-center gap-1 flex-wrap">
                  <button
                    v-for="status in statusOptions"
                    :key="status.id"
                    @click="record.status = status.id"
                    :class="[
                      'px-2.5 py-1 rounded-md text-[11px] font-bold border transition-all whitespace-nowrap',
                      record.status === status.id
                        ? status.activeClass
                        : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'
                    ]"
                    type="button"
                  >
                    <i :class="status.icon" class="mr-1"></i>
                    {{ status.label }}
                  </button>
                </div>
              </td>

              <td class="p-2 border border-slate-100 text-center">
                <input
                  v-model="record.remark"
                  placeholder="សម្គាល់..."
                  class="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-md focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none bg-white transition"
                />
              </td>
            </tr>

            <tr v-if="attendance.length === 0">
              <td colspan="4" class="p-8 text-center text-slate-400">
                <div class="text-2xl mb-2">
                  <i class="fa-solid fa-clipboard-list"></i>
                </div>

                <p class="text-sm font-bold text-slate-500">
                  មិនមានទិន្នន័យសិស្សក្នុងថ្នាក់នេះ
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div class="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div class="text-[11px] text-slate-500 font-bold flex flex-wrap items-center gap-2">
          <span>
            <i class="fa-solid fa-users mr-1 text-slate-400"></i>
            សរុបសិស្ស៖ {{ attendance.length }} នាក់
          </span>

          <span class="hidden sm:inline text-slate-300">|</span>

          <span>
            ថ្ងៃទី៖ {{ filters.date }}
          </span>

          <span class="hidden sm:inline text-slate-300">|</span>

          <span>
            វេន៖ {{ sessionLabel }}
          </span>
        </div>

        <button
          @click="onSave"
          :disabled="loading || attendance.length === 0"
          class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <i class="fa-solid fa-floppy-disk"></i>
          រក្សាទុកវត្តមាន
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAttendance } from '../hooks/useAttendance';
import api from '../config/api';

const { attendance, mode, loading, getAttendance, saveAttendance } = useAttendance();

const classes = ref([]);
const selectedClass = ref(null);
const searchQuery = ref('');

const filters = ref({
  date: new Date().toISOString().split('T')[0],
  session: 'morning'
});

const statusOptions = [
  {
    id: 'present',
    label: 'វត្តមាន',
    icon: 'fa-solid fa-check',
    activeClass: 'bg-green-600 text-white border-green-600 shadow-sm'
  },
  {
    id: 'absent',
    label: 'អវត្តមាន',
    icon: 'fa-solid fa-xmark',
    activeClass: 'bg-red-600 text-white border-red-600 shadow-sm'
  },
  {
    id: 'permission',
    label: 'ច្បាប់',
    icon: 'fa-solid fa-file-circle-check',
    activeClass: 'bg-yellow-500 text-white border-yellow-500 shadow-sm'
  },
  {
    id: 'late',
    label: 'យឺត',
    icon: 'fa-solid fa-clock',
    activeClass: 'bg-orange-500 text-white border-orange-500 shadow-sm'
  }
];

const filteredClasses = computed(() => {
  if (!searchQuery.value) return classes.value;

  const keyword = searchQuery.value.toLowerCase();

  return classes.value.filter((c) =>
    c.className?.toLowerCase().includes(keyword) ||
    c.teacherName?.toLowerCase().includes(keyword)
  );
});

const countByStatus = computed(() => {
  return attendance.value.reduce(
    (acc, record) => {
      const status = record.status || 'present';

      if (acc[status] !== undefined) {
        acc[status] += 1;
      }

      return acc;
    },
    {
      present: 0,
      absent: 0,
      permission: 0,
      late: 0
    }
  );
});

const sessionLabel = computed(() => {
  if (filters.value.session === 'afternoon') return 'វេនរសៀល';
  if (filters.value.session === 'evening') return 'វេនល្ងាច';
  return 'វេនព្រឹក';
});

const fetchClasses = async () => {
  try {
    const res = await api.get('/classes');
    classes.value = res.data.data || res.data.result || res.data || [];
  } catch (err) {
    console.error('Error fetching classes:', err);
  }
};

const openAttendance = (cls) => {
  selectedClass.value = cls;
  fetchData();
};

const closeAttendance = () => {
  selectedClass.value = null;
  attendance.value = [];
};

const fetchData = () => {
  if (!selectedClass.value) return;

  getAttendance(
    selectedClass.value._id,
    filters.value.date,
    filters.value.session
  );
};

const getStudentInitial = (student) => {
  return (
    student?.englishName?.charAt(0) ||
    student?.khmerName?.charAt(0) ||
    '?'
  );
};

const onSave = async () => {
  try {
    const payload = {
      classId: selectedClass.value._id,
      date: filters.value.date,
      session: filters.value.session,
      records: attendance.value.map((r) => ({
        student: r.student?._id || r.student,
        status: r.status || 'present',
        remark: r.remark || ''
      }))
    };

    await saveAttendance(payload);
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => {
  fetchClasses();
});
</script>

<style scoped>
table {
  font-family: 'Kantumruy Pro', sans-serif;
}
</style>