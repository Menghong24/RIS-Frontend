<template>
  <div class="bg-slate-50 p-3 md:p-4">
    <!-- Header -->
    <div class="max-w-7xl mx-auto mb-4">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 class="text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <span class="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-sm">
              <i class="fa-solid fa-users-gear"></i>
            </span>
            គ្រប់គ្រងអ្នកប្រើប្រាស់
          </h1>

          <p class="text-slate-500 text-xs mt-1">
            គ្រប់គ្រងគណនីអ្នកគ្រប់គ្រង គ្រូបង្រៀន និងអ្នកប្រើប្រាស់ក្នុងប្រព័ន្ធ
          </p>
        </div>

        <button
          @click="openAddModal"
          class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition shadow-sm text-xs"
        >
          <i class="fa-solid fa-plus"></i>
          បន្ថែមអ្នកប្រើប្រាស់
        </button>
      </div>
    </div>

    <div class="max-w-7xl mx-auto">
      <!-- Error -->
      <div
        v-if="error"
        class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start shadow-sm"
      >
        <i class="fa-solid fa-triangle-exclamation text-red-500 mt-0.5 mr-3"></i>

        <div>
          <p class="font-bold text-sm">មានបញ្ហាក្នុងប្រព័ន្ធ</p>
          <p class="text-xs text-red-600 mt-0.5">{{ error }}</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl border border-slate-200 p-3 mb-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
          <div class="relative flex-1 sm:w-72">
            <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>

            <input
              v-model="filters.search"
              @input="debounceSearch"
              type="text"
              placeholder="ស្វែងរកតាមឈ្មោះអ្នកប្រើប្រាស់..."
              class="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
            />
          </div>

          <select
            v-model="filters.role"
            @change="handleFilterChange"
            class="px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
          >
            <option value="">តួនាទីទាំងអស់</option>
            <option value="admin">អ្នកគ្រប់គ្រង</option>
            <option value="teacher">គ្រូបង្រៀន</option>
            <option value="user">អ្នកប្រើប្រាស់ធម្មតា</option>
          </select>
        </div>

        <div class="flex items-center gap-2 self-end md:self-auto text-xs text-slate-600">
          <span>បង្ហាញ</span>

          <select
            v-model.number="pagination.limit"
            @change="handleFilterChange"
            class="px-2 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>

          <span>ក្នុងមួយទំព័រ</span>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs min-w-[950px]">
            <thead>
              <tr class="bg-slate-100 border-b border-slate-200 text-slate-700">
                <th class="p-2 pl-4 font-bold border border-slate-200">
                  ព័ត៌មានគណនី
                </th>

                <th class="p-2 font-bold border border-slate-200">
                  តួនាទី
                </th>

                <th class="p-2 font-bold border border-slate-200">
                  ភ្ជាប់ទៅគ្រូ
                </th>

                <th class="p-2 font-bold border border-slate-200">
                  កាលបរិច្ឆេទបង្កើត
                </th>

                <th class="p-2 pr-4 font-bold border border-slate-200 text-right">
                  សកម្មភាព
                </th>
              </tr>
            </thead>

            <tbody>
              <!-- Loading -->
              <tr v-if="isLoading && users.length === 0">
                <td colspan="5" class="p-8 text-center text-slate-400">
                  <div class="mx-auto mb-2 h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <i class="fa-solid fa-circle-notch fa-spin text-xl"></i>
                  </div>

                  <span class="text-sm font-bold text-slate-500">
                    កំពុងទាញយកទិន្នន័យ...
                  </span>
                </td>
              </tr>

              <!-- Empty -->
              <tr v-else-if="users.length === 0">
                <td colspan="5" class="p-10 text-center text-slate-500">
                  <div class="mx-auto mb-2 h-10 w-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
                    <i class="fa-solid fa-users-slash text-xl"></i>
                  </div>

                  <p class="text-sm font-bold text-slate-700">
                    មិនមានទិន្នន័យអ្នកប្រើប្រាស់
                  </p>

                  <p class="text-xs text-slate-400 mt-1">
                    សូមកែប្រែការស្វែងរក ឬបន្ថែមគណនីអ្នកប្រើប្រាស់ថ្មី
                  </p>
                </td>
              </tr>

              <!-- Rows -->
              <tr
                v-else
                v-for="user in users"
                :key="user._id"
                class="hover:bg-slate-50 transition border-b border-slate-100"
              >
                <td class="p-2 pl-4 border border-slate-100">
                  <div class="flex items-center">
                    <div class="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center font-bold mr-3 shadow-sm text-sm">
                      {{ user.username?.charAt(0).toUpperCase() }}
                    </div>

                    <div class="min-w-0">
                      <p class="font-bold text-slate-800 truncate">
                        {{ user.username }}
                      </p>

                      <p class="text-[10px] font-mono text-slate-400 mt-0.5 truncate">
                        UID: {{ user._id }}
                      </p>
                    </div>
                  </div>
                </td>

                <td class="p-2 border border-slate-100">
                  <span
                    :class="[
                      'px-2.5 py-1 text-[11px] font-bold rounded-full border',
                      user.role === 'admin'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : user.role === 'teacher'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                    ]"
                  >
                    {{ translateRole(user.role) }}
                  </span>
                </td>

                <td class="p-2 border border-slate-100">
                  <div v-if="user.role === 'teacher'" class="min-w-0">
                    <p class="font-bold text-slate-700 truncate">
                      {{ user.teacher?.khmerName || user.teacher?.englishName || 'មិនទាន់ភ្ជាប់' }}
                    </p>

                    <p
                      v-if="user.teacher?._id"
                      class="text-[10px] font-mono text-slate-400 mt-0.5 truncate"
                    >
                      TID: {{ user.teacher._id }}
                    </p>

                    <span
                      v-else
                      class="inline-flex mt-1 px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold"
                    >
                      ត្រូវភ្ជាប់ Teacher profile
                    </span>
                  </div>

                  <span v-else class="text-slate-400 text-[11px]">
                    -
                  </span>
                </td>

                <td class="p-2 border border-slate-100 text-slate-600 font-medium text-xs">
                  {{ formatDate(user.createdAt) }}
                </td>

                <td class="p-2 pr-4 border border-slate-100 text-right">
                  <div class="flex items-center justify-end space-x-1.5">
                    <button
                      @click="openEditModal(user)"
                      class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="កែប្រែគណនី"
                    >
                      <i class="fa-solid fa-pen-to-square"></i>
                    </button>

                    <button
                      @click="handleDelete(user._id, user.username)"
                      class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-40"
                      title="លុបគណនី"
                      :disabled="isDeleting === user._id"
                    >
                      <i
                        v-if="isDeleting === user._id"
                        class="fa-solid fa-circle-notch fa-spin text-red-600"
                      ></i>

                      <i v-else class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          v-if="users.length > 0"
          class="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 p-3 px-4 gap-3 bg-slate-50"
        >
          <div class="text-xs text-slate-500 font-medium">
            ទំព័រ
            <span class="text-slate-800 font-bold">{{ pagination.page }}</span>
            នៃ
            <span class="text-slate-800 font-bold">{{ totalPages }}</span>
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="changePage(pagination.page - 1)"
              :disabled="pagination.page <= 1 || isLoading"
              class="p-2 border border-slate-200 rounded-lg text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition shadow-sm"
            >
              <i class="fa-solid fa-chevron-left text-xs"></i>
            </button>

            <button
              @click="changePage(pagination.page + 1)"
              :disabled="pagination.page >= totalPages || isLoading"
              class="p-2 border border-slate-200 rounded-lg text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition shadow-sm"
            >
              <i class="fa-solid fa-chevron-right text-xs"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <Transition name="fade">
        <div
          v-if="modal.isOpen"
          class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          @click="closeModal"
        >
          <Transition name="scale">
            <div
              class="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-100 overflow-hidden"
              @click.stop
            >
              <div class="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 class="font-bold text-slate-800 text-base flex items-center gap-2">
                  <i
                    :class="modal.mode === 'add'
                      ? 'fa-solid fa-user-plus text-blue-600'
                      : 'fa-solid fa-user-pen text-blue-600'"
                  ></i>

                  {{ modal.mode === 'add' ? 'បង្កើតគណនីថ្មី' : 'កែប្រែព័ត៌មានគណនី' }}
                </h3>

                <button
                  @click="closeModal"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                >
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>

              <form @submit.prevent="handleModalSubmit" class="p-4 space-y-4">
                <div>
                  <label class="block text-xs font-bold text-slate-600 mb-1.5">
                    ឈ្មោះអ្នកប្រើប្រាស់
                  </label>

                  <input
                    v-model="modal.form.username"
                    type="text"
                    required
                    placeholder="ឧ. admin01"
                    class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                  />
                </div>

                <div v-if="modal.mode === 'add'">
                  <label class="block text-xs font-bold text-slate-600 mb-1.5">
                    ពាក្យសម្ងាត់
                  </label>

                  <input
                    v-model="modal.form.password"
                    type="password"
                    required
                    placeholder="••••••••"
                    class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-600 mb-1.5">
                    តួនាទីអ្នកប្រើប្រាស់
                  </label>

                  <select
                    v-model="modal.form.role"
                    required
                    class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                  >
                    <option value="user">អ្នកប្រើប្រាស់ធម្មតា</option>
                    <option value="teacher">គ្រូបង្រៀន</option>
                    <option value="admin">អ្នកគ្រប់គ្រងប្រព័ន្ធ</option>
                  </select>
                </div>

                <div v-if="modal.form.role === 'teacher'">
                  <label class="block text-xs font-bold text-slate-600 mb-1.5">
                    ជ្រើសគ្រូបង្រៀន
                  </label>

                  <select
                    v-model="modal.form.teacher"
                    required
                    class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                  >
                    <option value="" disabled>
                      ជ្រើសរើស Teacher profile...
                    </option>

                    <option
                      v-for="teacher in teachersList"
                      :key="teacher._id"
                      :value="teacher._id"
                    >
                      {{ teacher.khmerName || teacher.englishName || teacher.name || teacher.username || teacher._id }}
                    </option>
                  </select>

                  <p class="text-[11px] text-slate-400 mt-1">
                    គណនី role គ្រូបង្រៀន ត្រូវភ្ជាប់ទៅ Teacher profile ដើម្បីកំណត់សិទ្ធិថ្នាក់។
                  </p>
                </div>

                <div class="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100 mt-6">
                  <button
                    type="button"
                    @click="closeModal"
                    class="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-50 transition"
                  >
                    បោះបង់
                  </button>

                  <button
                    type="submit"
                    :disabled="modal.isSubmitting"
                    class="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition flex items-center gap-2"
                  >
                    <i
                      v-if="modal.isSubmitting"
                      class="fa-solid fa-circle-notch fa-spin"
                    ></i>

                    {{ modal.mode === 'add' ? 'រក្សាទុកគណនី' : 'រក្សាទុកការកែប្រែ' }}
                  </button>
                </div>
              </form>
            </div>
          </Transition>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, reactive, onMounted, watch } from "vue";
import { useUsers } from "../hooks/useUsers";
import { useQuery } from "../hooks/useQuery";
import { useToast } from "vue-toastification";

const toast = useToast();

const {
  users,
  isLoading,
  error,
  totalPage,
  findAllUser,
  deleteUser,
  createUser,
  updateUser
} = useUsers();

const { data: teachers } = useQuery("teachers");

const isDeleting = ref(null);
const totalPages = ref(1);

const filters = reactive({
  search: "",
  role: ""
});

const pagination = reactive({
  page: 1,
  limit: 10
});

const modal = reactive({
  isOpen: false,
  mode: "add",
  targetId: null,
  isSubmitting: false,
  form: {
    username: "",
    password: "",
    role: "user",
    teacher: ""
  }
});

let searchDebounceTimeout = null;

const allowedRoles = ["admin", "teacher", "user"];

const teachersList = computed(() => {
  return Array.isArray(teachers.value) ? teachers.value : [];
});

watch(
  () => modal.form.role,
  (role) => {
    if (role !== "teacher") {
      modal.form.teacher = "";
    }
  }
);

const buildUserQuery = () => {
  const query = {
    search: filters.search.trim(),
    page: pagination.page,
    limit: Number(pagination.limit) || 10
  };

  if (allowedRoles.includes(filters.role)) {
    query.role = filters.role;
  }

  return query;
};

const syncUserDirectory = async () => {
  try {
    const query = buildUserQuery();

    const response = await findAllUser(query);

    if (response?.total) {
      totalPages.value = response.total;
    } else if (totalPage?.value) {
      totalPages.value = totalPage.value;
    } else {
      totalPages.value = 1;
    }
  } catch (err) {
    console.error("Critical framework error fetching table payload.", err);
  }
};

onMounted(() => {
  syncUserDirectory();
});

const debounceSearch = () => {
  clearTimeout(searchDebounceTimeout);

  searchDebounceTimeout = setTimeout(() => {
    pagination.page = 1;
    syncUserDirectory();
  }, 400);
};

const handleFilterChange = () => {
  pagination.page = 1;
  syncUserDirectory();
};

const changePage = (targetPageIndex) => {
  if (
    targetPageIndex >= 1 &&
    targetPageIndex <= totalPages.value &&
    !isLoading.value
  ) {
    pagination.page = targetPageIndex;
    syncUserDirectory();
  }
};

const openAddModal = () => {
  modal.mode = "add";
  modal.targetId = null;
  modal.form.username = "";
  modal.form.password = "";
  modal.form.role = "user";
  modal.form.teacher = "";
  modal.isSubmitting = false;
  modal.isOpen = true;
};

const openEditModal = (userData) => {
  modal.mode = "edit";
  modal.targetId = userData._id;
  modal.form.username = userData.username || "";
  modal.form.role = allowedRoles.includes(userData.role) ? userData.role : "user";
  modal.form.password = "";
  modal.form.teacher = userData.teacher?._id || userData.teacher || "";
  modal.isSubmitting = false;
  modal.isOpen = true;
};

const closeModal = () => {
  if (modal.isSubmitting) return;

  modal.isOpen = false;
  modal.mode = "add";
  modal.targetId = null;
  modal.form.username = "";
  modal.form.password = "";
  modal.form.role = "user";
  modal.form.teacher = "";
};

const buildPayload = () => {
  const payload = {
    username: modal.form.username.trim(),
    role: modal.form.role
  };

  if (modal.mode === "add") {
    payload.password = modal.form.password;
  }

  if (modal.form.role === "teacher") {
    payload.teacher = modal.form.teacher;
  }

  return payload;
};

const handleModalSubmit = async () => {
  if (!modal.form.username.trim()) {
    toast.error("សូមបញ្ចូលឈ្មោះអ្នកប្រើប្រាស់");
    return;
  }

  if (modal.mode === "add" && !modal.form.password.trim()) {
    toast.error("សូមបញ្ចូលពាក្យសម្ងាត់");
    return;
  }

  if (!allowedRoles.includes(modal.form.role)) {
    toast.error("សូមជ្រើសតួនាទីឱ្យត្រឹមត្រូវ");
    return;
  }

  if (modal.form.role === "teacher" && !modal.form.teacher) {
    toast.error("សូមជ្រើស Teacher profile សម្រាប់គណនីគ្រូបង្រៀន");
    return;
  }

  modal.isSubmitting = true;

  try {
    const payload = buildPayload();

    if (modal.mode === "add") {
      await createUser(payload);
      toast.success(`បានបង្កើតគណនី "${modal.form.username}" ដោយជោគជ័យ`);
    } else {
      await updateUser(modal.targetId, payload);
      toast.success("បានកែប្រែព័ត៌មានគណនីដោយជោគជ័យ");
    }

    modal.isOpen = false;
    await syncUserDirectory();
  } catch (err) {
    toast.error(err.response?.data?.err || "មិនអាចរក្សាទុកទិន្នន័យបានទេ");
  } finally {
    modal.isSubmitting = false;
  }
};

const handleDelete = async (userId, username) => {
  if (!confirm(`តើអ្នកពិតជាចង់លុបគណនី "${username}" មែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។`)) {
    return;
  }

  isDeleting.value = userId;

  try {
    await deleteUser(userId);
    toast.success(`បានលុបគណនី "${username}" ដោយជោគជ័យ`);

    if (users.value.length === 1 && pagination.page > 1) {
      pagination.page -= 1;
    }

    await syncUserDirectory();
  } catch (err) {
    toast.error(err.response?.data?.err || "មិនអាចលុបគណនីបានទេ");
  } finally {
    isDeleting.value = null;
  }
};

const translateRole = (role) => {
  if (role === "admin") return "អ្នកគ្រប់គ្រង";
  if (role === "teacher") return "គ្រូបង្រៀន";
  return "អ្នកប្រើប្រាស់";
};

const formatDate = (dateString) => {
  if (!dateString) return "មិនមាន";

  return new Date(dateString).toLocaleDateString("km-KH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0.96);
  opacity: 0;
}
</style>