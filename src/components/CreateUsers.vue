<template>
  <div class="bg-slate-50 p-2 sm:p-3 md:p-4">
    <div class="max-w-7xl mx-auto space-y-3 md:space-y-4">
      <!-- Header -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm px-2.5 sm:px-3 py-3 md:px-4">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3">
          <div class="min-w-0">
            <h1 class="text-base sm:text-lg md:text-xl font-extrabold text-slate-800 flex items-center gap-2">
              <span class="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs sm:text-sm shrink-0">
                <i class="fa-solid fa-users-gear"></i>
              </span>

              <span class="truncate">
                គ្រប់គ្រងអ្នកប្រើប្រាស់
              </span>
            </h1>

            <p class="text-slate-500 text-[11px] sm:text-xs mt-1 truncate">
              គ្រប់គ្រងគណនីអ្នកគ្រប់គ្រង គ្រូបង្រៀន និងអ្នកប្រើប្រាស់ក្នុងប្រព័ន្ធ
            </p>
          </div>

          <button
            @click="openAddModal"
            class="w-full sm:w-auto flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition shadow-sm text-[11px] sm:text-xs"
          >
            <i class="fa-solid fa-plus text-[10px] sm:text-xs"></i>
            បន្ថែមអ្នកប្រើប្រាស់
          </button>
        </div>
      </div>

      <!-- Error -->
      <div
        v-if="error"
        class="p-2.5 sm:p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start shadow-sm"
      >
        <i class="fa-solid fa-triangle-exclamation text-red-500 mt-0.5 mr-2.5"></i>

        <div class="min-w-0">
          <p class="font-bold text-xs sm:text-sm">មានបញ្ហាក្នុងប្រព័ន្ធ</p>
          <p class="text-[11px] sm:text-xs text-red-600 mt-0.5 break-words">{{ error }}</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl border border-slate-200 p-2.5 sm:p-3 shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-[1fr_180px_auto] gap-2 md:gap-3 items-end">
          <div>
            <label class="form-label">ស្វែងរក</label>

            <div class="relative">
              <i class="search-icon fa-solid fa-magnifying-glass"></i>

              <input
                v-model="filters.search"
                @input="debounceSearch"
                type="text"
                placeholder="ស្វែងរកតាមឈ្មោះអ្នកប្រើប្រាស់..."
                class="form-input search-input"
              />
            </div>
          </div>

          <div>
            <label class="form-label">តួនាទី</label>

            <select
              v-model="filters.role"
              @change="handleFilterChange"
              class="form-input"
            >
              <option value="">តួនាទីទាំងអស់</option>
              <option value="admin">អ្នកគ្រប់គ្រង</option>
              <option value="teacher">គ្រូបង្រៀន</option>
              <option value="user">អ្នកប្រើប្រាស់ធម្មតា</option>
            </select>
          </div>

          <div class="flex items-center gap-2 text-[11px] sm:text-xs text-slate-600">
            <span>បង្ហាញ</span>

            <select
              v-model.number="pagination.limit"
              @change="handleFilterChange"
              class="border border-slate-200 rounded-lg px-2 py-1.5 bg-white font-bold outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-[11px] sm:text-xs cursor-pointer"
            >
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
            </select>

            <span>ក្នុងមួយទំព័រ</span>
          </div>
        </div>
      </div>

      <!-- Users List -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <!-- Loading -->
        <div
          v-if="isLoading && users.length === 0"
          class="p-7 sm:p-8 text-center text-slate-400"
        >
          <div class="mx-auto mb-2 h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <i class="fa-solid fa-circle-notch fa-spin text-lg sm:text-xl"></i>
          </div>

          <span class="text-xs sm:text-sm font-bold text-slate-500">
            កំពុងទាញយកទិន្នន័យ...
          </span>
        </div>

        <!-- Empty -->
        <div
          v-else-if="users.length === 0"
          class="px-4 py-10 text-center text-slate-500"
        >
          <div class="mx-auto mb-2 h-10 w-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
            <i class="fa-solid fa-users-slash text-xl"></i>
          </div>

          <p class="text-xs sm:text-sm font-bold text-slate-700">
            មិនមានទិន្នន័យអ្នកប្រើប្រាស់
          </p>

          <p class="text-[11px] sm:text-xs text-slate-400 mt-1">
            សូមកែប្រែការស្វែងរក ឬបន្ថែមគណនីអ្នកប្រើប្រាស់ថ្មី
          </p>
        </div>

        <template v-else>
          <!-- Mobile Cards -->
          <div class="lg:hidden bg-slate-50 p-2.5 space-y-2">
            <div
              v-for="user in users"
              :key="user._id"
              class="bg-white rounded-xl border border-slate-200 shadow-sm p-2.5"
            >
              <div class="flex items-start gap-2">
                <div class="w-10 h-10 rounded-full bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center font-extrabold shadow-sm text-sm shrink-0 font-khmer overflow-hidden">
                  {{ getUserInitial(user) }}
                </div>

                <div class="min-w-0 flex-1">
                  <div class="flex items-start justify-between gap-2">
                    <div class="min-w-0">
                      <p class="font-extrabold text-sm text-slate-800 leading-tight truncate font-khmer">
                        {{ user.username }}
                      </p>

                      <p class="text-[10px] font-mono text-slate-400 leading-tight truncate mt-0.5">
                        UID: {{ getShortId(user._id) }}
                      </p>
                    </div>

                    <span
                      :class="getRoleClass(user.role)"
                      class="px-2 py-0.5 text-[10px] font-bold rounded-full border whitespace-nowrap shrink-0"
                    >
                      {{ translateRole(user.role) }}
                    </span>
                  </div>

                  <div class="mt-2 grid grid-cols-1 min-[420px]:grid-cols-2 gap-2">
                    <div class="rounded-lg border border-slate-100 bg-slate-50 px-2 py-1.5">
                      <p class="text-[10px] font-bold text-slate-400 mb-0.5">
                        ភ្ជាប់ទៅគ្រូ
                      </p>

                      <template v-if="user.role === 'teacher'">
                        <p class="text-[11px] font-extrabold text-slate-700 truncate font-khmer">
                          {{ getTeacherDisplayName(user) }}
                        </p>

                        <p
                          v-if="user.teacher?._id"
                          class="text-[10px] font-mono text-slate-400 truncate mt-0.5"
                        >
                          TID: {{ getShortId(user.teacher._id) }}
                        </p>

                        <span
                          v-else
                          class="inline-flex mt-1 px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold"
                        >
                          ត្រូវភ្ជាប់ Teacher profile
                        </span>
                      </template>

                      <span
                        v-else
                        class="text-slate-400 text-[11px] font-bold"
                      >
                        -
                      </span>
                    </div>

                    <div class="rounded-lg border border-slate-100 bg-slate-50 px-2 py-1.5">
                      <p class="text-[10px] font-bold text-slate-400 mb-0.5">
                        កាលបរិច្ឆេទបង្កើត
                      </p>

                      <p class="text-[11px] font-bold text-slate-700">
                        {{ formatDate(user.createdAt) }}
                      </p>
                    </div>
                  </div>

                  <div class="mt-2 flex items-center justify-end gap-1.5 border-t border-slate-100 pt-2">
                    <button
                      @click="openEditModal(user)"
                      class="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                      title="កែប្រែគណនី"
                    >
                      <i class="fa-solid fa-pen-to-square text-[10px]"></i>
                      កែ
                    </button>

                    <button
                      @click="handleDelete(user._id, user.username)"
                      class="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition disabled:opacity-40"
                      title="លុបគណនី"
                      :disabled="isDeleting === user._id"
                    >
                      <i
                        v-if="isDeleting === user._id"
                        class="fa-solid fa-circle-notch fa-spin text-[10px]"
                      ></i>

                      <i
                        v-else
                        class="fa-solid fa-trash text-[10px]"
                      ></i>

                      លុប
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Desktop Table -->
          <div class="hidden lg:block overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs min-w-[950px]">
              <thead>
                <tr class="bg-slate-100 border-b border-slate-200 text-slate-700">
                  <th class="table-th min-w-[260px]">
                    ព័ត៌មានគណនី
                  </th>

                  <th class="table-th w-36">
                    តួនាទី
                  </th>

                  <th class="table-th min-w-[220px]">
                    ភ្ជាប់ទៅគ្រូ
                  </th>

                  <th class="table-th w-48">
                    កាលបរិច្ឆេទបង្កើត
                  </th>

                  <th class="table-th text-right w-32">
                    សកម្មភាព
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="user in users"
                  :key="user._id"
                  class="hover:bg-slate-50 transition border-b border-slate-100"
                >
                  <td class="table-td">
                    <div class="flex items-center gap-2">
                      <div class="w-9 h-9 rounded-full bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center font-extrabold shadow-sm text-sm shrink-0 font-khmer overflow-hidden">
                        {{ getUserInitial(user) }}
                      </div>

                      <div class="min-w-0">
                        <p class="font-bold text-slate-800 truncate font-khmer">
                          {{ user.username }}
                        </p>

                        <p class="text-[10px] font-mono text-slate-400 mt-0.5 truncate">
                          UID: {{ user._id }}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td class="table-td">
                    <span
                      :class="getRoleClass(user.role)"
                      class="px-2.5 py-1 text-[11px] font-bold rounded-full border"
                    >
                      {{ translateRole(user.role) }}
                    </span>
                  </td>

                  <td class="table-td">
                    <div
                      v-if="user.role === 'teacher'"
                      class="min-w-0"
                    >
                      <p class="font-bold text-slate-700 truncate font-khmer">
                        {{ getTeacherDisplayName(user) }}
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

                    <span
                      v-else
                      class="text-slate-400 text-[11px]"
                    >
                      -
                    </span>
                  </td>

                  <td class="table-td text-slate-600 font-medium">
                    {{ formatDate(user.createdAt) }}
                  </td>

                  <td class="table-td text-right">
                    <div class="flex items-center justify-end gap-1.5">
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

                        <i
                          v-else
                          class="fa-solid fa-trash"
                        ></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>

        <!-- Pagination -->
        <div
          v-if="users.length > 0"
          class="bg-slate-50 px-2.5 sm:px-4 py-2.5 sm:py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3"
        >
          <div class="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-600 font-medium">
            <span>ទំព័រ</span>

            <span class="text-slate-800 font-extrabold">
              {{ pagination.page }}
            </span>

            <span>នៃ</span>

            <span class="text-slate-800 font-extrabold">
              {{ totalPages }}
            </span>
          </div>

          <div class="flex items-center gap-1.5 sm:gap-2">
            <button
              @click="changePage(pagination.page - 1)"
              :disabled="pagination.page <= 1 || isLoading"
              class="px-2.5 sm:px-3 py-1.5 border border-slate-200 rounded-lg text-[11px] sm:text-xs font-bold bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1"
            >
              <i class="fa-solid fa-chevron-left text-[10px]"></i>
              <span class="hidden min-[380px]:inline">មុន</span>
            </button>

            <button
              @click="changePage(pagination.page + 1)"
              :disabled="pagination.page >= totalPages || isLoading"
              class="px-2.5 sm:px-3 py-1.5 border border-slate-200 rounded-lg text-[11px] sm:text-xs font-bold bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1"
            >
              <span class="hidden min-[380px]:inline">បន្ទាប់</span>
              <i class="fa-solid fa-chevron-right text-[10px]"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <Transition name="fade">
        <div
          v-if="modal.isOpen"
          class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-2 sm:p-4 z-50"
          @click.self="closeModal"
        >
          <Transition name="scale">
            <div
              class="bg-white rounded-t-2xl sm:rounded-xl shadow-xl max-w-md w-full border border-slate-100 overflow-hidden flex flex-col max-h-[94dvh] sm:max-h-[90vh]"
              @click.stop
            >
              <div class="px-3 sm:px-4 py-2.5 sm:py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
                <h3 class="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2 min-w-0">
                  <i
                    :class="
                      modal.mode === 'add'
                        ? 'fa-solid fa-user-plus text-blue-600'
                        : 'fa-solid fa-user-pen text-blue-600'
                    "
                  ></i>

                  <span class="truncate">
                    {{ modal.mode === 'add' ? 'បង្កើតគណនីថ្មី' : 'កែប្រែព័ត៌មានគណនី' }}
                  </span>
                </h3>

                <button
                  @click="closeModal"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition shrink-0"
                >
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>

              <form
                @submit.prevent="handleModalSubmit"
                class="p-3 sm:p-4 space-y-3 overflow-y-auto modal-scroll"
              >
                <div>
                  <label class="form-label">
                    ឈ្មោះអ្នកប្រើប្រាស់
                  </label>

                  <input
                    v-model="modal.form.username"
                    type="text"
                    required
                    placeholder="ឧ. admin01"
                    class="form-input"
                  />
                </div>

                <div v-if="modal.mode === 'add'">
                  <label class="form-label">
                    ពាក្យសម្ងាត់
                  </label>

                  <input
                    v-model="modal.form.password"
                    type="password"
                    required
                    placeholder="••••••••"
                    class="form-input"
                  />
                </div>

                <div>
                  <label class="form-label">
                    តួនាទីអ្នកប្រើប្រាស់
                  </label>

                  <select
                    v-model="modal.form.role"
                    required
                    class="form-input"
                  >
                    <option value="user">អ្នកប្រើប្រាស់ធម្មតា</option>
                    <option value="teacher">គ្រូបង្រៀន</option>
                    <option value="admin">អ្នកគ្រប់គ្រងប្រព័ន្ធ</option>
                  </select>
                </div>

                <div v-if="modal.form.role === 'teacher'">
                  <label class="form-label">
                    ជ្រើសគ្រូបង្រៀន
                  </label>

                  <select
                    v-model="modal.form.teacher"
                    required
                    class="form-input"
                  >
                    <option
                      value=""
                      disabled
                    >
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

                <div class="sticky bottom-0 -mx-3 sm:-mx-4 px-3 sm:px-4 py-2.5 flex items-center justify-end gap-2 border-t border-slate-100 bg-white">
                  <button
                    type="button"
                    @click="closeModal"
                    :disabled="modal.isSubmitting"
                    class="px-3 sm:px-4 py-1.5 sm:py-2 border border-slate-200 text-slate-700 text-[11px] sm:text-sm font-bold rounded-lg hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    បោះបង់
                  </button>

                  <button
                    type="submit"
                    :disabled="modal.isSubmitting"
                    class="px-4 sm:px-5 py-1.5 sm:py-2 bg-blue-600 text-white text-[11px] sm:text-sm font-bold rounded-lg hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition flex items-center gap-2"
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

const normalizeArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.result)) return value.result;
  if (Array.isArray(value?.items)) return value.items;
  return [];
};

const teachersList = computed(() => {
  return normalizeArray(teachers.value);
});

watch(
  () => modal.form.role,
  (role) => {
    if (role !== "teacher") {
      modal.form.teacher = "";
    }
  }
);

const getShortId = (value) => {
  const text = String(value || "");
  if (text.length <= 10) return text || "-";
  return `${text.slice(0, 8)}...`;
};

const getUserInitial = (user) => {
  const teacherKhmerName = String(user?.teacher?.khmerName || "").trim();

  if (teacherKhmerName) {
    return teacherKhmerName.charAt(0);
  }

  const username = String(user?.username || "").trim();

  if (username) {
    return username.charAt(0).toUpperCase();
  }

  return "អ";
};

const getTeacherDisplayName = (user) => {
  return user.teacher?.khmerName || user.teacher?.englishName || "មិនទាន់ភ្ជាប់";
};

const getRoleClass = (role) => {
  if (role === "admin") {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }

  if (role === "teacher") {
    return "bg-purple-50 text-purple-700 border-purple-200";
  }

  return "bg-slate-100 text-slate-700 border-slate-200";
};

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
.form-label {
  display: block;
  font-size: 0.62rem;
  font-weight: 800;
  color: #64748b;
  margin-bottom: 0.2rem;
}

.form-input {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.36rem 0.55rem;
  font-size: 0.7rem;
  color: #334155;
  background: #ffffff;
  outline: none;
  min-height: 1.95rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
}

.search-icon {
  position: absolute;
  left: 0.72rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 0.68rem;
  pointer-events: none;
  z-index: 2;
}

.search-input {
  padding-left: 2.15rem !important;
  padding-right: 0.75rem !important;
}

.table-th {
  padding: 0.5rem 0.6rem;
  font-size: 0.68rem;
  font-weight: 900;
  color: #475569;
  border: 1px solid #e2e8f0;
  white-space: nowrap;
}

.table-td {
  padding: 0.5rem 0.6rem;
  border: 1px solid #f1f5f9;
  font-size: 0.7rem;
  vertical-align: middle;
}

.font-khmer {
  font-family: "Battambang", "Siemreap", "Kantumruy Pro", sans-serif;
}

.modal-scroll::-webkit-scrollbar {
  width: 4px;
}

.modal-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 999px;
}

.modal-scroll::-webkit-scrollbar-track {
  background: transparent;
}

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

@media (min-width: 640px) {
  .form-label {
    font-size: 0.68rem;
  }

  .form-input {
    padding: 0.44rem 0.6rem;
    font-size: 0.75rem;
    min-height: 2.25rem;
  }
}
</style>