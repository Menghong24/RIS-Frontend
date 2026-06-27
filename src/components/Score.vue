<template>
  <div class=" bg-slate-50 p-3 md:p-4">
    <!-- Header -->
    <div class="max-w-7xl mx-auto mb-4">
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm px-3 py-3 md:px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div class="min-w-0">
          <h2 class="text-lg md:text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <span class="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-sm shrink-0">
              <i class="fa-solid fa-book-open-reader"></i>
            </span>

            <span class="truncate">
              {{ selectedClass ? `${selectedClass.className} - បញ្ចូលពិន្ទុ` : 'ជ្រើសរើសថ្នាក់រៀន' }}
            </span>
          </h2>

          <p class="text-xs text-slate-500 mt-1 truncate">
            {{ selectedClass ? 'គ្រប់គ្រងពិន្ទុសិស្សតាមមុខវិជ្ជា និងខែ' : 'សូមជ្រើសរើសថ្នាក់ ដើម្បីបញ្ចូល ឬកែប្រែពិន្ទុសិស្ស' }}
          </p>
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto">
          <div v-if="!selectedClass" class="relative w-full sm:w-72">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-xs">
              <i class="fa-solid fa-magnifying-glass"></i>
            </span>

            <input
              v-model="classSearch"
              type="text"
              placeholder="ស្វែងរកថ្នាក់រៀន..."
              class="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-white text-xs text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
            />
          </div>

          <button
            v-if="selectedClass"
            @click="clearSelection"
            class="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-extrabold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-blue-700 transition shadow-sm whitespace-nowrap"
          >
            <i class="fa-solid fa-arrow-left text-[10px]"></i>
            ត្រឡប់ក្រោយ
          </button>
        </div>
      </div>
    </div>

    <!-- Class Selection -->
    <div v-if="!selectedClass" class="max-w-7xl mx-auto animate-fade-in">
      <!-- Loading Classes -->
      <div
        v-if="!classesList.length"
        class="text-center py-8 bg-white rounded-xl border border-slate-200 shadow-sm"
      >
        <div class="mx-auto mb-2 h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <i class="fa-solid fa-circle-notch fa-spin text-lg"></i>
        </div>

        <p class="text-xs font-bold text-slate-500">
          កំពុងទាញយកថ្នាក់រៀន...
        </p>
      </div>

      <!-- Class Cards -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3"
      >
        <div
          v-for="cls in filteredClasses"
          :key="cls._id"
          @click="selectClass(cls)"
          class="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer transition-all duration-200 group relative overflow-hidden"
        >
          <div class="absolute top-0 left-0 w-full h-1 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

          <div class="flex justify-between items-start mb-2">
            <div class="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <i class="fa-solid fa-school"></i>
            </div>

            <span class="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-600 rounded-full">
              {{ cls.timeStudy || 'General' }}
            </span>
          </div>

          <h3 class="text-sm font-extrabold text-slate-800 leading-tight truncate">
            {{ cls.className }}
          </h3>

          <p class="text-[11px] text-slate-500 mt-0.5 truncate">
            កម្រិត: {{ cls.classGrade || 'N/A' }}
          </p>

          <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span class="text-slate-400 font-bold">
              <i class="fa-solid fa-users mr-1"></i>
              {{ cls.students?.length || 0 }} នាក់
            </span>

            <span class="text-blue-600 font-extrabold">
              ចូល
              <i class="fa-solid fa-chevron-right ml-1 text-[9px]"></i>
            </span>
          </div>
        </div>
      </div>

      <!-- Empty Search -->
      <div
        v-if="classesList.length && filteredClasses.length === 0"
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

    <!-- Gradebook Panel -->
    <div v-else class="animate-fade-in-up max-w-7xl mx-auto">
      <!-- Filters -->
      <div class="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-200 mb-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_auto] gap-2 items-end">
          <!-- Subject -->
          <div>
            <label class="form-label">
              មុខវិជ្ជា
            </label>

            <select
              v-model="filters.subjectId"
              class="form-input"
            >
              <option value="" disabled>ជ្រើសរើសមុខវិជ្ជា...</option>
              <option
                v-for="sub in subjectsList"
                :key="sub._id"
                :value="sub._id"
              >
                {{ sub.subjectName }}
              </option>
            </select>
          </div>

          <!-- Year -->
          <div>
            <label class="form-label">
              ឆ្នាំសិក្សា
            </label>

            <input
              type="text"
              v-model="filters.academicYear"
              class="form-input"
              placeholder="2025-2026"
            />
          </div>

          <!-- Month -->
          <div>
            <label class="form-label">
              ខែ
            </label>

            <select
              v-model="filters.month"
              class="form-input"
            >
              <option
                v-for="m in months"
                :key="m.value"
                :value="m.value"
              >
                {{ m.label }}
              </option>
            </select>
          </div>

          <!-- Load Button -->
          <button
            @click="loadGradebook"
            :disabled="!isFilterValid || loading"
            class="w-full lg:w-auto flex justify-center items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-extrabold text-white shadow-sm hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition whitespace-nowrap"
          >
            <span v-if="loading" class="flex items-center gap-1.5">
              <i class="fa-solid fa-circle-notch fa-spin text-[10px]"></i>
              កំពុងទាញ...
            </span>

            <span v-else class="flex items-center gap-1.5">
              <i class="fa-solid fa-magnifying-glass-chart text-[10px]"></i>
              បង្ហាញតារាង
            </span>
          </button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div
        v-if="students.length > 0"
        class="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4"
      >
        <div class="bg-white rounded-xl border border-slate-200 px-3 py-2 shadow-sm">
          <p class="text-[10px] font-bold text-slate-400">សិស្សសរុប</p>
          <p class="text-lg font-extrabold text-slate-800">{{ tableData.length }}</p>
        </div>

        <div class="bg-white rounded-xl border border-blue-100 px-3 py-2 shadow-sm">
          <p class="text-[10px] font-bold text-blue-500">មុខវិជ្ជា</p>
          <p class="text-sm font-extrabold text-blue-700 truncate">{{ selectedSubjectName }}</p>
        </div>

        <div class="bg-white rounded-xl border border-indigo-100 px-3 py-2 shadow-sm">
          <p class="text-[10px] font-bold text-indigo-500">ខែ / ឆ្នាំ</p>
          <p class="text-sm font-extrabold text-indigo-700 truncate">
            {{ selectedMonthLabel }} · {{ filters.academicYear }}
          </p>
        </div>

        <div
          class="bg-white rounded-xl border px-3 py-2 shadow-sm"
          :class="hasUnsavedChanges ? 'border-amber-200 bg-amber-50' : 'border-green-100 bg-green-50'"
        >
          <p class="text-[10px] font-bold" :class="hasUnsavedChanges ? 'text-amber-600' : 'text-green-600'">
            ស្ថានភាព
          </p>

          <p class="text-sm font-extrabold" :class="hasUnsavedChanges ? 'text-amber-700' : 'text-green-700'">
            {{ hasUnsavedChanges ? 'មានការកែប្រែ' : 'រក្សាទុករួច' }}
          </p>
        </div>
      </div>

      <!-- Table -->
      <div
        v-if="students.length > 0"
        class="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200"
      >
        <!-- Table Header -->
        <div class="px-3 py-2 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <div class="flex flex-wrap items-center gap-2 text-[11px]">
            <span class="font-extrabold text-slate-700 flex items-center gap-1.5">
              <i class="fa-solid fa-users text-blue-600"></i>
              សិស្សសរុប: {{ tableData.length }}
            </span>

            <span class="text-slate-300">|</span>

            <span class="font-bold text-slate-500">
              {{ selectedSubjectName }}
            </span>

            <span class="text-slate-300">|</span>

            <span class="font-bold text-slate-500">
              {{ selectedMonthLabel }} · {{ filters.academicYear }}
            </span>

            <span
              v-if="hasUnsavedChanges"
              class="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 font-extrabold"
            >
              <span class="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
              មានការកែប្រែ
            </span>
          </div>

          <button
            @click="saveAllScores"
            :disabled="isSaving || !hasUnsavedChanges"
            class="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-extrabold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <i
              v-if="isSaving"
              class="fa-solid fa-circle-notch fa-spin text-[10px]"
            ></i>

            <i
              v-else
              class="fa-solid fa-floppy-disk text-[10px]"
            ></i>

            រក្សាទុកទាំងអស់
          </button>
        </div>

        <!-- Table Body -->
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs min-w-[760px]">
            <thead>
              <tr class="bg-slate-100 text-slate-700">
                <th class="table-th text-center w-10">
                  ល.រ
                </th>

                <th class="table-th min-w-[190px]">
                  ឈ្មោះសិស្ស
                </th>

                <th class="table-th text-center w-24">
                  ពិន្ទុ
                </th>

                <th class="table-th min-w-[200px]">
                  ផ្សេងៗ
                </th>

                <th class="table-th text-center w-28">
                  ស្ថានភាព
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(student, index) in tableData"
                :key="student.studentId"
                class="hover:bg-slate-50 transition border-b border-slate-100"
              >
                <td class="table-td text-center text-slate-500">
                  {{ index + 1 }}
                </td>

                <td class="table-td">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center font-extrabold text-[11px] shrink-0">
                      {{ student.khmerName?.charAt(0) || '?' }}
                    </div>

                    <div class="min-w-0">
                      <p class="font-extrabold text-slate-800 leading-tight truncate">
                        {{ student.khmerName }}
                      </p>

                      <p class="text-[10px] text-slate-400 leading-tight font-mono truncate">
                        {{ student.idCode }}
                      </p>
                    </div>
                  </div>
                </td>

                <td class="table-td text-center">
                  <input
                    type="number"
                    v-model.number="student.score"
                    min="0"
                    max="100"
                    @input="student.isDirty = true"
                    class="w-20 rounded-lg border border-slate-200 px-2 py-1 text-center text-[11px] font-mono outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                    :class="student.isDirty ? 'border-amber-400 bg-amber-50 ring-2 ring-amber-100' : ''"
                  />
                </td>

                <td class="table-td">
                  <input
                    type="text"
                    v-model="student.remark"
                    placeholder="កំណត់ចំណាំ..."
                    @input="student.isDirty = true"
                    class="w-full rounded-lg border border-slate-200 px-2 py-1 text-[11px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </td>

                <td class="table-td text-center">
                  <span
                    v-if="student.isDirty"
                    class="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-700 whitespace-nowrap"
                  >
                    <span class="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                    មិនទាន់រក្សា
                  </span>

                  <span
                    v-else
                    class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold text-slate-600 whitespace-nowrap"
                  >
                    <span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    រក្សាទុក
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- No Students -->
      <div
        v-else-if="!loading && hasSearched"
        class="text-center py-8 bg-white rounded-xl border border-dashed border-slate-300"
      >
        <div class="mx-auto mb-2 h-10 w-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
          <i class="fa-solid fa-user-slash"></i>
        </div>

        <h3 class="text-sm font-extrabold text-slate-700">
          មិនមានសិស្ស
        </h3>

        <p class="mt-0.5 text-[11px] text-slate-500">
          មិនទាន់មានសិស្សក្នុងថ្នាក់នេះនៅឡើយទេ។
        </p>
      </div>

      <!-- Initial State -->
      <div
        v-else-if="!loading && !hasSearched"
        class="text-center py-8 bg-white rounded-xl border border-dashed border-slate-300"
      >
        <div class="mx-auto mb-2 h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <i class="fa-solid fa-clipboard-list"></i>
        </div>

        <p class="text-[11px] text-slate-500">
          ជ្រើសរើស <strong>មុខវិជ្ជា</strong> និង <strong>ខែ</strong> ខាងលើ ដើម្បីបង្ហាញតារាងពិន្ទុ។
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import api from '../config/api';
import { useQuery } from '../hooks/useQuery';
import { useCollection } from '../hooks/useCollection';
import { useToast } from 'vue-toastification';

const { data: classes } = useQuery('classes');
const { data: subjects } = useQuery('subjects');
const { createDoc, loading: isSaving } = useCollection('scores');
const toast = useToast();

const selectedClass = ref(null);
const loading = ref(false);
const hasSearched = ref(false);
const students = ref([]);
const tableData = ref([]);
const classSearch = ref('');

const months = [
  { value: 'January', label: 'មករា' },
  { value: 'February', label: 'កុម្ភៈ' },
  { value: 'March', label: 'មីនា' },
  { value: 'April', label: 'មេសា' },
  { value: 'May', label: 'ឧសភា' },
  { value: 'June', label: 'មិថុនា' },
  { value: 'July', label: 'កក្កដា' },
  { value: 'August', label: 'សីហា' },
  { value: 'September', label: 'កញ្ញា' },
  { value: 'October', label: 'តុលា' },
  { value: 'November', label: 'វិច្ឆិកា' },
  { value: 'December', label: 'ធ្នូ' }
];

const filters = ref({
  classId: '',
  subjectId: '',
  academicYear: '2025-2026',
  month: 'January',
  semester: 'Semester 1',
  type: 'monthly'
});

const classesList = computed(() => {
  return Array.isArray(classes.value) ? classes.value : [];
});

const subjectsList = computed(() => {
  return Array.isArray(subjects.value) ? subjects.value : [];
});

const filteredClasses = computed(() => {
  if (!classSearch.value.trim()) return classesList.value;

  const keyword = classSearch.value.trim().toLowerCase();

  return classesList.value.filter((cls) =>
    cls.className?.toLowerCase().includes(keyword) ||
    cls.classGrade?.toLowerCase().includes(keyword) ||
    cls.timeStudy?.toLowerCase().includes(keyword)
  );
});

watch(selectedClass, (newClass) => {
  students.value = [];
  tableData.value = [];
  hasSearched.value = false;

  if (newClass) {
    filters.value.classId = newClass._id;
  } else {
    filters.value.classId = '';
    filters.value.subjectId = '';
  }
}, { deep: true });

const isFilterValid = computed(() => {
  return filters.value.classId && filters.value.subjectId && filters.value.academicYear;
});

const hasUnsavedChanges = computed(() => {
  return tableData.value.some((student) => student.isDirty);
});

const selectedSubjectName = computed(() => {
  const subject = subjectsList.value.find((sub) => sub._id === filters.value.subjectId);
  return subject ? subject.subjectName : 'មិនទាន់ជ្រើសរើសមុខវិជ្ជា';
});

const selectedMonthLabel = computed(() => {
  const month = months.find((m) => m.value === filters.value.month);
  return month ? month.label : filters.value.month;
});

const normalizeArray = (responseData) => {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.result)) return responseData.result;
  if (Array.isArray(responseData?.data)) return responseData.data;
  if (Array.isArray(responseData?.items)) return responseData.items;

  return [];
};

const selectClass = (cls) => {
  selectedClass.value = cls;
};

const clearSelection = () => {
  selectedClass.value = null;
  classSearch.value = '';
};

const loadGradebook = async () => {
  if (!isFilterValid.value) return;

  loading.value = true;
  hasSearched.value = true;

  students.value = [];
  tableData.value = [];

  try {
    const [studentsRes, scoresRes] = await Promise.all([
      api.get('/students'),
      api.get('/scores', { params: filters.value })
    ]);

    const allStudents = normalizeArray(studentsRes.data);
    const existingScores = normalizeArray(scoresRes.data);

    const enrolledStudentIds = (selectedClass.value.students || []).map((s) => s._id || s);
    const classStudents = allStudents.filter((stu) => enrolledStudentIds.includes(stu._id));

    students.value = classStudents;

    tableData.value = classStudents.map((stu) => {
      const foundScore = existingScores.find((s) => {
        const sId = s.studentId?._id || s.studentId;
        return sId === stu._id;
      });

      return {
        studentId: stu._id,
        khmerName: stu.khmerName,
        idCode: stu.idCode || stu.studentId || 'N/A',
        score: foundScore ? foundScore.score : 0,
        remark: foundScore ? foundScore.remark : '',
        isDirty: false
      };
    });
  } catch (error) {
    console.error('Error loading gradebook data arrays:', error);
    toast.error('មិនអាចទាញយកតារាងពិន្ទុបានទេ');
  } finally {
    loading.value = false;
  }
};

const saveAllScores = async () => {
  const dirtyStudents = tableData.value.filter((stu) => stu.isDirty);

  if (dirtyStudents.length === 0) return;

  const invalidStudent = dirtyStudents.find((stu) =>
    stu.score === '' ||
    stu.score === null ||
    Number(stu.score) < 0 ||
    Number(stu.score) > 100
  );

  if (invalidStudent) {
    toast.warning(`សូមបញ្ចូលពិន្ទុត្រឹមត្រូវ 0-100 សម្រាប់ ${invalidStudent.khmerName}`);
    return;
  }

  const payload = dirtyStudents.map((stu) => ({
    studentId: stu.studentId,
    classId: filters.value.classId,
    subjectId: filters.value.subjectId,
    academicYear: filters.value.academicYear,
    month: filters.value.month,
    semester: filters.value.semester,
    type: filters.value.type,
    score: Number(stu.score),
    remark: stu.remark || ''
  }));

  const result = await createDoc({ scores: payload });

  if (result) {
    dirtyStudents.forEach((stu) => {
      stu.isDirty = false;
    });

    toast.success('បានរក្សាទុកពិន្ទុដោយជោគជ័យ');
  }
};
</script>

<style scoped>
.form-label {
  display: block;
  font-size: 0.68rem;
  font-weight: 800;
  color: #64748b;
  margin-bottom: 0.2rem;
}

.form-input {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.44rem 0.6rem;
  font-size: 0.75rem;
  color: #334155;
  background: #ffffff;
  outline: none;
  min-height: 2.2rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
}

.table-th {
  padding: 0.46rem 0.6rem;
  font-size: 0.66rem;
  font-weight: 900;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.table-td {
  padding: 0.46rem 0.6rem;
  border: 1px solid #f1f5f9;
  font-size: 0.72rem;
}

.animate-fade-in {
  animation: fadeIn 0.25s ease-out forwards;
}

.animate-fade-in-up {
  animation: fadeInUp 0.25s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>