<template>
  <div class=" bg-slate-50 p-3 md:p-4 text-slate-800">
    <div class="max-w-7xl mx-auto space-y-4">

      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 class="text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <span class="h-8 w-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-sm">
              <i class="fa-solid fa-book-open"></i>
            </span>
            គ្រប់គ្រងមុខវិជ្ជាសិក្សា
          </h1>
          <p class="text-xs text-slate-500 mt-1">
            គ្រប់គ្រងមុខវិជ្ជា ថ្នាក់រៀន គ្រូបង្រៀន ប្រភេទមុខវិជ្ជា និងថ្លៃសិក្សា
          </p>
        </div>

        <button
          @click="openCreateModal"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-bold transition active:scale-95 flex items-center justify-center gap-2 shadow-sm text-xs whitespace-nowrap"
        >
          <i class="fa-solid fa-plus"></i>
          បន្ថែមមុខវិជ្ជា
        </button>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div class="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
            <i class="fa-solid fa-list-check"></i>
          </div>
          <div>
            <p class="text-[11px] font-bold text-slate-400">មុខវិជ្ជាទាំងអស់</p>
            <p class="text-xl font-extrabold text-slate-900">{{ subjects?.length || 0 }}</p>
          </div>
        </div>

        <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div class="h-10 w-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <div>
            <p class="text-[11px] font-bold text-slate-400">កំពុងដំណើរការ</p>
            <p class="text-xl font-extrabold text-slate-900">
              {{ subjects?.filter(s => s.status === 'active').length || 0 }}
            </p>
          </div>
        </div>

        <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div class="h-10 w-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
            <i class="fa-solid fa-school"></i>
          </div>
          <div>
            <p class="text-[11px] font-bold text-slate-400">ថ្នាក់រៀន</p>
            <p class="text-xl font-extrabold text-slate-900">{{ classesList?.length || 0 }}</p>
          </div>
        </div>

        <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div class="h-10 w-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
            <i class="fa-solid fa-dollar-sign"></i>
          </div>
          <div>
            <p class="text-[11px] font-bold text-slate-400">ថ្លៃសិក្សាមធ្យម</p>
            <p class="text-xl font-extrabold text-slate-900">${{ calculateAvgFee() }}</p>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-3 items-center">
        <div class="flex items-center gap-2 text-slate-500 text-xs self-start md:self-auto font-bold">
          <i class="fa-solid fa-filter text-slate-400"></i>
          តម្រងទិន្នន័យ
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto">
          <div class="relative">
            <select
              v-model="classFilter"
              class="w-full md:w-44 appearance-none border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-medium bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 cursor-pointer transition"
            >
              <option value="All">ថ្នាក់ទាំងអស់</option>
              <option v-for="c in filteredClassesForFilter" :key="c._id" :value="c._id">
                {{ c.className }}
              </option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
              <i class="fa-solid fa-chevron-down text-[10px]"></i>
            </div>
          </div>

          <div class="relative">
            <select
              v-model="typeFilter"
              class="w-full md:w-44 appearance-none border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-medium bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 cursor-pointer transition"
            >
              <option value="All">ប្រភេទទាំងអស់</option>
              <option value="general">មុខវិជ្ជាទូទៅ</option>
              <option value="optional">មុខវិជ្ជាជម្រើស</option>
              <option value="skill">ជំនាញ / វិជ្ជាជីវៈ</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
              <i class="fa-solid fa-chevron-down text-[10px]"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div v-if="loading" class="p-8 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
          <div class="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <i class="fa-solid fa-circle-notch fa-spin text-xl"></i>
          </div>
          <span class="text-sm font-bold text-slate-500">កំពុងទាញយកទិន្នន័យ...</span>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs min-w-[1050px]">
            <thead>
              <tr class="bg-slate-100 text-slate-700">
                <th class="p-2 font-bold border border-slate-200">ព័ត៌មានមុខវិជ្ជា</th>
                <th class="p-2 font-bold border border-slate-200">ថ្នាក់ / កម្រិត</th>
                <th class="p-2 font-bold border border-slate-200">ប្រភេទ</th>
                <th class="p-2 font-bold border border-slate-200">គ្រូបង្រៀន</th>
                <th class="p-2 font-bold border border-slate-200">ថ្លៃសិក្សា</th>
                <th class="p-2 font-bold border border-slate-200 text-center">ស្ថានភាព</th>
                <th class="p-2 font-bold border border-slate-200 text-right">សកម្មភាព</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="sub in filteredSubjects"
                :key="sub._id"
                class="hover:bg-slate-50 transition border-b border-slate-100 group"
              >
                <td class="p-2 border border-slate-100 whitespace-nowrap">
                  <div class="font-bold text-slate-800 group-hover:text-blue-600 transition">
                    {{ sub.subjectName }}
                  </div>
                  <div class="text-[10px] text-slate-400 mt-0.5">
                    ID: {{ sub._id.substring(0, 8) }}...
                  </div>
                </td>

                <td class="p-2 border border-slate-100 whitespace-nowrap">
                  <div class="flex flex-col">
                    <span v-if="sub.classId" class="font-bold text-slate-800">
                      {{ sub.classId.className }}
                    </span>
                    <span v-else class="text-slate-400 text-[11px] italic bg-slate-100 px-2 py-0.5 rounded w-max">
                      មិនទាន់ភ្ជាប់ថ្នាក់
                    </span>
                    <span class="text-[10px] text-slate-400 font-medium mt-0.5">
                      {{ sub.gradeLevel }}
                    </span>
                  </div>
                </td>

                <td class="p-2 border border-slate-100 whitespace-nowrap">
                  <span :class="getTypeClass(sub.type)" class="px-2.5 py-1 rounded-full text-[11px] font-bold border">
                    {{ translateType(sub.type) }}
                  </span>
                </td>

                <td class="p-2 border border-slate-100 whitespace-nowrap">
                  <div v-if="sub.teacher" class="flex flex-col">
                    <span class="font-bold text-slate-800">
                      {{ sub.teacher.khmerName || sub.teacher.englishName }}
                    </span>
                    <span class="text-[10px] text-slate-400 mt-0.5">
                      {{ sub.teacher.englishName }}
                    </span>
                  </div>

                  <span v-else class="text-slate-400 text-[11px] italic flex items-center gap-1">
                    <span class="h-1.5 w-1.5 bg-amber-400 rounded-full animate-pulse"></span>
                    មិនទាន់កំណត់គ្រូ
                  </span>
                </td>

                <td class="p-2 border border-slate-100 whitespace-nowrap font-mono text-slate-900 font-bold">
                  ${{ sub.fee?.toFixed(2) }}
                </td>

                <td class="p-2 border border-slate-100 whitespace-nowrap text-center">
                  <span
                    :class="sub.status === 'active'
                      ? 'text-green-700 bg-green-50 border-green-200'
                      : 'text-slate-500 bg-slate-50 border-slate-200'"
                    class="px-2.5 py-1 rounded-full text-[11px] font-bold border inline-block"
                  >
                    {{ translateStatus(sub.status) }}
                  </span>
                </td>

                <td class="p-2 border border-slate-100 whitespace-nowrap text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <button
                      @click="openEditModal(sub)"
                      class="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                      title="កែប្រែ"
                    >
                      <i class="fa-solid fa-pen-to-square"></i>
                    </button>

                    <button
                      @click="handleDelete(sub._id)"
                      class="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                      title="លុប"
                    >
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="filteredSubjects.length === 0">
                <td colspan="7" class="text-center py-10 text-slate-400 bg-slate-50">
                  <div class="max-w-xs mx-auto flex flex-col items-center">
                    <div class="h-10 w-10 bg-slate-100 rounded-xl text-slate-400 mb-2 flex items-center justify-center">
                      <i class="fa-solid fa-face-frown"></i>
                    </div>
                    <p class="text-sm font-bold text-slate-700">
                      មិនមានមុខវិជ្ជាដែលត្រូវនឹងតម្រង
                    </p>
                    <p class="text-xs text-slate-400 mt-1">
                      សូមកែតម្រង ឬបន្ថែមមុខវិជ្ជាថ្មី
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <div class="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden border border-slate-100">
          <div class="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div>
              <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
                <i
                  :class="isEditing
                    ? 'fa-solid fa-pen-to-square text-blue-600'
                    : 'fa-solid fa-plus text-blue-600'"
                ></i>
                {{ isEditing ? 'កែប្រែមុខវិជ្ជា' : 'បង្កើតមុខវិជ្ជាថ្មី' }}
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">
                បំពេញព័ត៌មានមុខវិជ្ជាខាងក្រោម
              </p>
            </div>

            <button
              @click="showModal = false"
              class="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="p-4 space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1.5">
                ឈ្មោះមុខវិជ្ជា <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.subjectName"
                required
                type="text"
                placeholder="ឧ. គណិតវិទ្យា"
                class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-white transition"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1.5">
                ថ្នាក់រៀនដែលភ្ជាប់
              </label>
              <select
                v-model="form.classId"
                class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-white cursor-pointer transition"
              >
                <option :value="null">-- មុខវិជ្ជាឯករាជ្យ / មិនភ្ជាប់ថ្នាក់ --</option>
                <option v-for="c in classesList" :key="c._id" :value="c._id">
                  {{ c.className }} ({{ c.classGrade }})
                </option>
              </select>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-600 mb-1.5">
                  ប្រភេទមុខវិជ្ជា
                </label>
                <select
                  v-model="form.type"
                  class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-white cursor-pointer transition"
                >
                  <option value="general">មុខវិជ្ជាទូទៅ</option>
                  <option value="optional">មុខវិជ្ជាជម្រើស</option>
                  <option value="skill">ជំនាញ / វិជ្ជាជីវៈ</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-600 mb-1.5">
                  ថ្លៃសិក្សា ($)
                </label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-mono text-sm font-bold">
                    $
                  </span>
                  <input
                    v-model.number="form.fee"
                    type="number"
                    min="0"
                    step="0.01"
                    class="w-full border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-white font-mono font-bold transition"
                  />
                </div>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1.5">
                គ្រូបង្រៀន
              </label>
              <select
                v-model="form.teacher"
                class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-white cursor-pointer transition"
              >
                <option :value="null">-- មិនទាន់កំណត់គ្រូ --</option>
                <option v-for="t in teachers" :key="t._id" :value="t._id">
                  {{ t.khmerName }} ({{ t.englishName }})
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1.5">
                ស្ថានភាព
              </label>
              <div class="flex gap-4 mt-1">
                <label class="flex items-center gap-2 text-sm font-medium cursor-pointer text-slate-700">
                  <input
                    type="radio"
                    v-model="form.status"
                    value="active"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  កំពុងដំណើរការ
                </label>

                <label class="flex items-center gap-2 text-sm font-medium cursor-pointer text-slate-700">
                  <input
                    type="radio"
                    v-model="form.status"
                    value="disabled"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  ផ្អាកដំណើរការ
                </label>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1.5">
                កំណត់ចំណាំ
              </label>
              <textarea
                v-model="form.remark"
                rows="2"
                placeholder="បញ្ចូលកំណត់ចំណាំ..."
                class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-white transition resize-none"
              ></textarea>
            </div>

            <div class="pt-4 flex justify-end gap-2.5 border-t border-slate-100 mt-5">
              <button
                type="button"
                @click="showModal = false"
                class="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                បោះបង់
              </button>

              <button
                type="submit"
                class="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition active:scale-95 flex items-center gap-2"
              >
                <i class="fa-solid fa-floppy-disk"></i>
                {{ isEditing ? 'រក្សាទុកការកែប្រែ' : 'រក្សាទុកមុខវិជ្ជា' }}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuery } from "../hooks/useQuery";
import { useCollection } from "../hooks/useCollection";
import { useToast } from "vue-toastification";

const toast = useToast();

// --- Data Fetching ---
const { data: subjects, fetchData, loading } = useQuery('subjects');
const { data: teachers } = useQuery('teachers');
const { data: classesList } = useQuery('classes');

// --- CRUD Hooks ---
const { createDoc, updateDoc, deleteDoc } = useCollection('subjects');

// --- Options ---
const grades = ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

// --- State ---
const gradeFilter = ref('All');
const typeFilter = ref('All');
const classFilter = ref('All');
const showModal = ref(false);
const isEditing = ref(false);
const editId = ref(null);

const form = ref({
  subjectName: '',
  gradeLevel: 'Grade 7',
  classId: null,
  type: 'general',
  teacher: null,
  fee: 0,
  status: 'active',
  remark: ''
});

// --- Helpers ---
const calculateAvgFee = () => {
  if (!subjects.value || subjects.value.length === 0) return '0.00';

  const total = subjects.value.reduce((acc, curr) => acc + (Number(curr.fee) || 0), 0);
  return (total / subjects.value.length).toFixed(2);
};

const translateType = (type) => {
  if (type === 'general') return 'ទូទៅ';
  if (type === 'optional') return 'ជម្រើស';
  if (type === 'skill') return 'ជំនាញ';
  return type || 'មិនមាន';
};

const translateStatus = (status) => {
  if (status === 'active') return 'ដំណើរការ';
  if (status === 'disabled') return 'ផ្អាក';
  return status || 'មិនមាន';
};

// --- Computed Filters ---
const filteredClassesForFilter = computed(() => {
  if (!classesList.value) return [];
  if (gradeFilter.value === 'All') return classesList.value;

  return classesList.value.filter(c => c.classGrade === gradeFilter.value);
});

const filteredSubjects = computed(() => {
  if (!subjects.value) return [];

  return subjects.value.filter(s => {
    const matchGrade = gradeFilter.value === 'All' || s.gradeLevel === gradeFilter.value;
    const matchType = typeFilter.value === 'All' || s.type === typeFilter.value;

    const subjectClassId = s.classId && typeof s.classId === 'object' ? s.classId._id : s.classId;
    const matchClass = classFilter.value === 'All' || subjectClassId === classFilter.value;

    return matchGrade && matchType && matchClass;
  });
});

// --- Badge Logic ---
const getTypeClass = (type) => {
  switch (type) {
    case 'general':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'skill':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    default:
      return 'bg-amber-50 text-amber-700 border-amber-200';
  }
};

// --- Actions ---
const openCreateModal = () => {
  isEditing.value = false;
  editId.value = null;

  form.value = {
    subjectName: '',
    gradeLevel: 'Grade 7',
    classId: null,
    type: 'general',
    teacher: null,
    fee: 0,
    status: 'active',
    remark: ''
  };

  showModal.value = true;
};

const openEditModal = (sub) => {
  isEditing.value = true;
  editId.value = sub._id;

  const teacherId = (sub.teacher && typeof sub.teacher === 'object') ? sub.teacher._id : sub.teacher;
  const clsId = (sub.classId && typeof sub.classId === 'object') ? sub.classId._id : sub.classId;

  form.value = {
    subjectName: sub.subjectName,
    gradeLevel: sub.gradeLevel,
    classId: clsId || null,
    type: sub.type,
    teacher: teacherId || null,
    fee: sub.fee,
    status: sub.status,
    remark: sub.remark
  };

  showModal.value = true;
};

const handleSubmit = async () => {
  try {
    const payload = { ...form.value };

    if (isEditing.value && editId.value) {
      await updateDoc(editId.value, payload);
      toast.success("បានកែប្រែមុខវិជ្ជាដោយជោគជ័យ");
    } else {
      await createDoc(payload);
      toast.success("បានបង្កើតមុខវិជ្ជាថ្មីដោយជោគជ័យ");
    }

    await fetchData();
    showModal.value = false;

  } catch (e) {
    console.error("Database save exception:", e);
    toast.error(e.message || "មិនអាចរក្សាទុកមុខវិជ្ជាបានទេ");
  }
};

const handleDelete = async (id) => {
  if (!confirm('តើអ្នកពិតជាចង់លុបមុខវិជ្ជានេះមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។')) return;

  try {
    await deleteDoc(id);
    toast.success("បានលុបមុខវិជ្ជាដោយជោគជ័យ");
    await fetchData();
  } catch (e) {
    console.error(e);
    toast.error("មិនអាចលុបមុខវិជ្ជាបានទេ");
  }
};
</script>