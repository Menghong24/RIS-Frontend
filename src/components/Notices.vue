<template>
  <div class=" bg-slate-50 p-3 md:p-4 text-slate-800">
    <div class="max-w-7xl mx-auto space-y-4">

      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 class="text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <span class="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-sm">
              <i class="fa-solid fa-bullhorn"></i>
            </span>
            គ្រប់គ្រងសេចក្តីជូនដំណឹង
          </h1>
          <p class="text-xs text-slate-500 mt-1">
            បង្កើត កែប្រែ និងគ្រប់គ្រងសេចក្តីជូនដំណឹងសម្រាប់សិស្ស ឬថ្នាក់រៀន
          </p>
        </div>

        <button
          @click="openCreateModal"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-bold shadow-sm transition active:scale-95 flex items-center gap-2 text-xs"
        >
          <i class="fa-solid fa-plus"></i>
          បន្ថែមសេចក្តីជូនដំណឹង
        </button>
      </div>

      <!-- Loading -->
      <div
        v-if="loading"
        class="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400"
      >
        <div class="mx-auto mb-2 h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <i class="fa-solid fa-circle-notch fa-spin text-xl"></i>
        </div>
        <p class="text-sm font-bold text-slate-500">កំពុងទាញយកទិន្នន័យ...</p>
      </div>

      <!-- Announcement List -->
      <div v-else class="grid gap-3">
        <div
          v-for="item in announcements"
          :key="item._id"
          class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-200 transition relative group"
        >
          <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
            <div class="flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span
                  v-if="item.targetType === 'all'"
                  class="bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-bold px-2.5 py-1 rounded-full"
                >
                  <i class="fa-solid fa-users mr-1"></i>
                  សិស្សទាំងអស់
                </span>

                <span
                  v-else
                  class="bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold px-2.5 py-1 rounded-full"
                >
                  <i class="fa-solid fa-school mr-1"></i>
                  {{ item.targetClass ? item.targetClass.className : 'ថ្នាក់រៀន' }}
                </span>

                <span
                  :class="getStatusClass(item.status)"
                  class="text-[11px] font-bold px-2.5 py-1 rounded-full border"
                >
                  {{ translateStatus(item.status) }}
                </span>
              </div>

              <h3 class="text-base font-extrabold text-slate-800 mt-3 leading-tight">
                {{ item.title }}
              </h3>

              <p class="text-sm text-slate-600 mt-1 whitespace-pre-wrap leading-relaxed">
                {{ item.content }}
              </p>
            </div>

            <div class="text-left md:text-right text-[11px] text-slate-400 shrink-0">
              <p class="font-bold text-slate-500">
                <i class="fa-solid fa-calendar-days mr-1"></i>
                {{ formatDate(item.postDate) }}
              </p>
              <p v-if="item.postedBy" class="mt-1">
                <i class="fa-solid fa-user-pen mr-1"></i>
                ដោយ៖ {{ item.postedBy.khmerName || item.postedBy.englishName }}
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-4 flex items-center justify-end gap-2 md:absolute md:top-3 md:right-3 md:mt-0 md:hidden md:group-hover:flex">
            <button
              @click="openEditModal(item)"
              class="px-3 py-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 text-xs font-bold transition flex items-center gap-1"
            >
              <i class="fa-solid fa-pen-to-square"></i>
              កែប្រែ
            </button>

            <button
              @click="handleDelete(item._id)"
              class="px-3 py-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 text-xs font-bold transition flex items-center gap-1"
            >
              <i class="fa-solid fa-trash"></i>
              លុប
            </button>
          </div>
        </div>

        <!-- Empty -->
        <div
          v-if="announcements.length === 0"
          class="text-center py-10 text-slate-400 bg-white border border-dashed border-slate-300 rounded-xl"
        >
          <div class="mx-auto mb-2 h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
            <i class="fa-solid fa-bell-slash text-xl"></i>
          </div>
          <p class="text-sm font-bold text-slate-600">
            មិនមានសេចក្តីជូនដំណឹង
          </p>
          <p class="text-xs text-slate-400 mt-1">
            សូមបន្ថែមសេចក្តីជូនដំណឹងថ្មី
          </p>
        </div>
      </div>

      <!-- Modal -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <div class="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100">
          <div class="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div>
              <h3 class="text-base font-bold text-slate-800 flex items-center gap-2">
                <i
                  :class="isEditing
                    ? 'fa-solid fa-pen-to-square text-blue-600'
                    : 'fa-solid fa-plus text-blue-600'"
                ></i>
                {{ isEditing ? 'កែប្រែសេចក្តីជូនដំណឹង' : 'បង្កើតសេចក្តីជូនដំណឹងថ្មី' }}
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">
                បំពេញព័ត៌មានសេចក្តីជូនដំណឹងខាងក្រោម
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

            <!-- Title -->
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1.5">
                ចំណងជើង <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.title"
                required
                type="text"
                placeholder="បញ្ចូលចំណងជើង..."
                class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Target -->
              <div>
                <label class="block text-xs font-bold text-slate-600 mb-1.5">
                  ផ្ញើទៅ
                </label>
                <select
                  v-model="form.targetType"
                  class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                >
                  <option value="all">សិស្សទាំងអស់</option>
                  <option value="class">ថ្នាក់ជាក់លាក់</option>
                </select>
              </div>

              <!-- Status -->
              <div>
                <label class="block text-xs font-bold text-slate-600 mb-1.5">
                  ស្ថានភាព
                </label>
                <select
                  v-model="form.status"
                  class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                >
                  <option value="published">ផ្សព្វផ្សាយ</option>
                  <option value="draft">ព្រាង</option>
                  <option value="archived">រក្សាទុក</option>
                </select>
              </div>
            </div>

            <!-- Select Class -->
            <div v-if="form.targetType === 'class'">
              <label class="block text-xs font-bold text-slate-600 mb-1.5">
                ជ្រើសរើសថ្នាក់
              </label>
              <select
                v-model="form.targetClass"
                class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
              >
                <option :value="null">-- ជ្រើសរើសថ្នាក់ --</option>
                <option v-for="c in classes" :key="c._id" :value="c._id">
                  {{ c.className }}
                </option>
              </select>
            </div>

            <!-- Content -->
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1.5">
                ខ្លឹមសារ <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="form.content"
                required
                rows="4"
                placeholder="បញ្ចូលខ្លឹមសារសេចក្តីជូនដំណឹង..."
                class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition resize-none"
              ></textarea>
            </div>

            <!-- Posted By -->
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1.5">
                អ្នកប្រកាស
              </label>
              <select
                v-model="form.postedBy"
                class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
              >
                <option :value="null">-- អ្នកគ្រប់គ្រង --</option>
                <option v-for="t in teachers" :key="t._id" :value="t._id">
                  {{ t.khmerName || t.englishName }} ({{ t.englishName }})
                </option>
              </select>
            </div>

            <!-- Actions -->
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
                {{ isEditing ? 'រក្សាទុកការកែប្រែ' : 'រក្សាទុក' }}
              </button>
            </div>

          </form>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useQuery } from "../hooks/useQuery";
import { useCollection } from "../hooks/useCollection";
import { useToast } from "vue-toastification";

const toast = useToast();

const { data: announcements, fetchData, loading } = useQuery('announcements');
const { data: classes } = useQuery('classes');
const { data: teachers } = useQuery('teachers');
const { createDoc, updateDoc, deleteDoc } = useCollection('announcements');

const showModal = ref(false);
const isEditing = ref(false);
const editId = ref(null);

const form = ref({
  title: '',
  content: '',
  targetType: 'all',
  targetClass: null,
  postedBy: null,
  status: 'published'
});

const formatDate = (date) => {
  if (!date) return '';

  return new Date(date).toLocaleDateString('km-KH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const translateStatus = (status) => {
  if (status === 'published') return 'បានផ្សព្វផ្សាយ';
  if (status === 'draft') return 'ព្រាង';
  if (status === 'archived') return 'រក្សាទុក';
  return status || 'មិនមាន';
};

const getStatusClass = (status) => {
  if (status === 'published') {
    return 'bg-green-50 text-green-700 border-green-200';
  }

  if (status === 'draft') {
    return 'bg-amber-50 text-amber-700 border-amber-200';
  }

  return 'bg-slate-100 text-slate-600 border-slate-200';
};

const openCreateModal = () => {
  isEditing.value = false;
  editId.value = null;

  form.value = {
    title: '',
    content: '',
    targetType: 'all',
    targetClass: null,
    postedBy: null,
    status: 'published'
  };

  showModal.value = true;
};

const openEditModal = (item) => {
  isEditing.value = true;
  editId.value = item._id;

  form.value = {
    title: item.title,
    content: item.content,
    targetType: item.targetType,
    targetClass: item.targetClass ? item.targetClass._id : null,
    postedBy: item.postedBy ? item.postedBy._id : null,
    status: item.status
  };

  showModal.value = true;
};

const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      await updateDoc(editId.value, form.value);
      toast.success("បានកែប្រែសេចក្តីជូនដំណឹងដោយជោគជ័យ");
    } else {
      await createDoc(form.value);
      toast.success("បានបង្កើតសេចក្តីជូនដំណឹងដោយជោគជ័យ");
    }

    showModal.value = false;
    fetchData();
  } catch (e) {
    toast.error("មិនអាចរក្សាទុកសេចក្តីជូនដំណឹងបានទេ");
  }
};

const handleDelete = async (id) => {
  if (!confirm("តើអ្នកពិតជាចង់លុបសេចក្តីជូនដំណឹងនេះមែនទេ?")) return;

  try {
    await deleteDoc(id);
    toast.success("បានលុបសេចក្តីជូនដំណឹងដោយជោគជ័យ");
    fetchData();
  } catch (e) {
    toast.error("មិនអាចលុបសេចក្តីជូនដំណឹងបានទេ");
  }
};
</script>