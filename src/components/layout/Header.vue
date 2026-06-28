<template>
  <div class="shrink-0">
    <!-- Header -->
    <header
      class="h-16 px-3 md:px-5 bg-white border-b border-slate-200 shadow-sm shrink-0 flex items-center justify-between"
    >
      <!-- Toggle Sidebar -->
      <button
        @click="$emit('toggle-sidebar')"
        class="h-9 w-9 rounded-lg hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition flex items-center justify-center"
        title="បើក/បិទម៉ឺនុយ"
      >
        <i class="fa-solid fa-bars text-base"></i>
      </button>

      <!-- Right Side -->
      <div class="flex items-center gap-3">
        <!-- Notification Button -->
        <button
          @click="isNoticeModalOpen = true"
          class="h-9 w-9 rounded-lg hover:bg-blue-50 relative transition text-slate-600 hover:text-blue-600 flex items-center justify-center"
          title="សេចក្តីជូនដំណឹង"
        >
          <i class="fa-solid fa-bell text-base"></i>

          <span
            v-if="unreadAnnouncements.length > 0"
            class="absolute -top-1 -right-1 h-5 min-w-5 px-1 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-extrabold border-2 border-white animate-pulse"
          >
            {{ unreadAnnouncements.length > 9 ? "9+" : unreadAnnouncements.length }}
          </span>
        </button>

        <!-- User Profile -->
        <div
          v-if="user"
          @click="isProfileModalOpen = true"
          class="flex items-center cursor-pointer group pl-3 border-l border-slate-200"
        >
          <div class="w-9 h-9 rounded-full overflow-hidden ring-2 ring-blue-50 group-hover:ring-blue-200 transition-all shadow-sm bg-blue-100 flex items-center justify-center">
            <img
              v-if="profileImageUrl"
              class="w-full h-full object-cover"
              :src="profileImageUrl"
              alt="User avatar"
            />

            <span
              v-else
              class="text-sm font-extrabold text-blue-700"
            >
              {{ userInitial }}
            </span>
          </div>

          <div class="ml-3 select-none hidden sm:block">
            <span class="font-extrabold text-sm capitalize text-slate-800 leading-none">
              {{ user?.username }}
            </span>

            <p class="text-[11px] text-slate-500 font-bold mt-0.5">
              {{ formattedRole }}
            </p>
          </div>

          <i class="fa-solid fa-chevron-down text-[10px] text-slate-400 ml-2 hidden sm:block"></i>
        </div>
      </div>
    </header>

    <!-- Notice Modal -->
    <div
      v-if="isNoticeModalOpen"
      class="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-40 p-3"
      @click="isNoticeModalOpen = false"
    >
      <div
        class="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden border border-slate-100"
        @click.stop
      >
        <!-- Notice Header -->
        <div class="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div class="flex items-center gap-2">
            <div class="h-8 w-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <i class="fa-solid fa-bell text-sm"></i>
            </div>

            <div>
              <h3 class="font-extrabold text-sm text-slate-800">
                សេចក្តីជូនដំណឹង
              </h3>

              <p class="text-[10px] text-slate-500">
                ព័ត៌មានថ្មីៗសម្រាប់អ្នក
              </p>
            </div>

            <span
              v-if="unreadAnnouncements.length > 0"
              class="bg-red-50 text-red-600 border border-red-100 text-[10px] font-extrabold px-2 py-0.5 rounded-full"
            >
              {{ unreadAnnouncements.length }} ថ្មី
            </span>
          </div>

          <button
            @click="isNoticeModalOpen = false"
            class="h-7 w-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        <!-- Notice List -->
        <div class="overflow-y-auto flex-1 p-3 bg-slate-50">
          <div
            v-if="unreadAnnouncements.length === 0"
            class="flex flex-col items-center justify-center py-12 text-center bg-white rounded-xl border border-dashed border-slate-300"
          >
            <div class="w-14 h-14 bg-green-50 text-green-500 rounded-xl flex items-center justify-center mb-3">
              <i class="fa-solid fa-circle-check text-2xl"></i>
            </div>

            <p class="text-slate-600 font-extrabold text-sm">
              មិនមានសេចក្តីជូនដំណឹងថ្មីទេ
            </p>

            <p class="text-slate-400 text-xs mt-1">
              អ្នកបានអានអស់ហើយ!
            </p>
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="notice in unreadAnnouncements"
              :key="notice._id || notice.id"
              @click="handleNoticeClick(notice)"
              class="p-3 bg-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition group cursor-pointer relative overflow-hidden"
            >
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>

              <div class="flex justify-between items-start gap-3 pl-2">
                <div class="min-w-0">
                  <h4 class="font-extrabold text-sm text-slate-800 group-hover:text-blue-600 transition pr-6 truncate">
                    {{ notice.title || "គ្មានចំណងជើង" }}
                  </h4>

                  <p class="text-xs text-slate-500 leading-relaxed line-clamp-2 mt-1">
                    {{ notice.content || notice.description || "មិនមានព័ត៌មានបន្ថែម។" }}
                  </p>

                  <span class="inline-flex mt-2 text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                    <i class="fa-regular fa-clock mr-1"></i>
                    {{ formatDate(notice.createdAt || notice.date) }}
                  </span>
                </div>

                <button
                  @click.stop="clearNotice(notice._id || notice.id)"
                  class="h-7 w-7 rounded-lg text-slate-400 hover:text-green-600 bg-slate-50 hover:bg-green-50 transition flex items-center justify-center"
                  title="Mark as read"
                >
                  <i class="fa-solid fa-check text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Notice Footer -->
        <div
          v-if="unreadAnnouncements.length > 0"
          class="p-3 border-t border-slate-100 bg-white flex justify-between items-center"
        >
          <button
            @click="clearAllNotices"
            class="text-xs font-extrabold text-slate-500 hover:text-slate-800 transition"
          >
            <i class="fa-solid fa-check-double mr-1"></i>
            សម្អាតទាំងអស់
          </button>

          <button
            @click="handleNoticeClick"
            class="text-xs font-extrabold text-blue-600 hover:text-blue-800 transition"
          >
            មើលទាំងអស់
            <i class="fa-solid fa-arrow-right ml-1"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Profile Modal -->
    <div
      v-if="isProfileModalOpen"
      class="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-40 p-3"
      @click="isProfileModalOpen = false"
    >
      <div
        class="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-100"
        @click.stop
      >
        <!-- Profile Header -->
        <div class="px-4 py-5 bg-blue-50 border-b border-blue-100 text-center relative">
          <button
            @click="isProfileModalOpen = false"
            class="absolute top-3 right-3 h-7 w-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white transition"
          >
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>

          <div class="relative w-20 h-20 mx-auto">
            <div class="w-20 h-20 rounded-full overflow-hidden ring-4 ring-white shadow-sm bg-blue-100 flex items-center justify-center">
              <img
                v-if="profileImageUrl"
                class="w-full h-full object-cover"
                :src="profileImageUrl"
                alt="User avatar"
              />

              <span
                v-else
                class="text-2xl font-extrabold text-blue-700"
              >
                {{ userInitial }}
              </span>
            </div>

            <label
              class="absolute -right-1 -bottom-1 h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md border-2 border-white cursor-pointer hover:bg-blue-700 transition"
              title="ប្ដូររូប Profile"
            >
              <i
                v-if="isUploadingProfile"
                class="fa-solid fa-circle-notch fa-spin text-xs"
              ></i>

              <i
                v-else
                class="fa-solid fa-camera text-xs"
              ></i>

              <input
                type="file"
                class="hidden"
                accept="image/jpeg,image/png,image/webp"
                :disabled="isUploadingProfile"
                @change="handleProfileImageChange"
              />
            </label>
          </div>

          <h3 class="mt-3 text-base font-extrabold text-slate-800 capitalize">
            {{ user?.username || "User" }}
          </h3>

          <p class="text-xs font-bold text-blue-600 mt-0.5">
            {{ formattedRole }}
          </p>

          <button
            v-if="user?.profileImage"
            type="button"
            @click="handleRemoveProfileImage"
            :disabled="isUploadingProfile"
            class="mt-3 px-3 py-1.5 rounded-lg bg-white border border-red-100 text-red-600 hover:bg-red-50 text-xs font-bold transition disabled:opacity-50"
          >
            <i class="fa-solid fa-trash-can mr-1"></i>
            លុបរូប Profile
          </button>
        </div>

        <!-- Profile Body -->
        <div class="p-3 space-y-3">
          <!-- User Info -->
          <div class="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
            <div class="flex items-center gap-2">
              <span class="h-7 w-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
                <i class="fa-solid fa-user"></i>
              </span>

              <div class="min-w-0">
                <p class="text-[11px] font-bold text-slate-500">
                  ឈ្មោះអ្នកប្រើប្រាស់
                </p>

                <p class="text-xs font-extrabold text-slate-800 truncate">
                  {{ user?.username || "មិនមានទិន្នន័យ" }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <span class="h-7 w-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
                <i class="fa-solid fa-user-shield"></i>
              </span>

              <div class="min-w-0">
                <p class="text-[11px] font-bold text-slate-500">
                  តួនាទី
                </p>

                <p class="text-xs font-extrabold text-slate-800 truncate">
                  {{ formattedRole }}
                </p>
              </div>
            </div>

            <div
              v-if="user?.email"
              class="flex items-center gap-2"
            >
              <span class="h-7 w-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
                <i class="fa-solid fa-envelope"></i>
              </span>

              <div class="min-w-0">
                <p class="text-[11px] font-bold text-slate-500">
                  អ៊ីមែល
                </p>

                <p class="text-xs font-extrabold text-slate-800 truncate">
                  {{ user.email }}
                </p>
              </div>
            </div>

            <div
              v-if="user?.phone"
              class="flex items-center gap-2"
            >
              <span class="h-7 w-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
                <i class="fa-solid fa-phone"></i>
              </span>

              <div class="min-w-0">
                <p class="text-[11px] font-bold text-slate-500">
                  លេខទូរស័ព្ទ
                </p>

                <p class="text-xs font-extrabold text-slate-800 truncate">
                  {{ user.phone }}
                </p>
              </div>
            </div>

            <div
              v-if="user?._id || user?.id"
              class="flex items-center gap-2"
            >
              <span class="h-7 w-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
                <i class="fa-solid fa-id-card"></i>
              </span>

              <div class="min-w-0">
                <p class="text-[11px] font-bold text-slate-500">
                  User ID
                </p>

                <p class="text-[11px] font-bold text-slate-700 truncate">
                  {{ user?._id || user?.id }}
                </p>
              </div>
            </div>
          </div>

          <div
            v-if="profileUploadError"
            class="rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-xs font-bold text-red-600"
          >
            {{ profileUploadError }}
          </div>

          <!-- Actions -->
          <button
            type="button"
            @click="isLogoutConfirmOpen = true"
            class="w-full px-3 py-2 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 transition flex items-center gap-2"
          >
            <i class="fa-solid fa-right-from-bracket w-4"></i>
            ចាកចេញ
          </button>
        </div>

        <!-- Profile Footer -->
        <div class="px-3 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            @click="isProfileModalOpen = false"
            class="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition"
          >
            បិទ
          </button>
        </div>
      </div>
    </div>

    <!-- Logout Confirm Modal -->
    <div
      v-if="isLogoutConfirmOpen"
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-3"
      @click="isLogoutConfirmOpen = false"
    >
      <div
        class="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-100"
        @click.stop
      >
        <!-- Logout Header -->
        <div class="px-4 py-3 bg-red-50 border-b border-red-100 flex items-center gap-3">
          <div class="h-10 w-10 rounded-full bg-white text-red-600 flex items-center justify-center shadow-sm border border-red-100">
            <i class="fa-solid fa-right-from-bracket text-base"></i>
          </div>

          <div>
            <h3 class="text-sm font-extrabold text-slate-800">
              បញ្ជាក់ការចាកចេញ
            </h3>

            <p class="text-[11px] text-red-600 font-bold mt-0.5">
              Logout Confirmation
            </p>
          </div>
        </div>

        <!-- Logout Body -->
        <div class="p-4">
          <p class="text-xs text-slate-600 leading-relaxed">
            តើអ្នកពិតជាចង់ចាកចេញពីប្រព័ន្ធមែនទេ?
          </p>
        </div>

        <!-- Logout Actions -->
        <div class="px-4 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
          <button
            @click="isLogoutConfirmOpen = false"
            class="px-3.5 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition"
            :disabled="isLoggingOut"
          >
            បោះបង់
          </button>

          <button
            @click="handleLogout"
            class="px-3.5 py-1.5 text-xs font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition shadow-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isLoggingOut"
          >
            <i
              v-if="isLoggingOut"
              class="fa-solid fa-circle-notch fa-spin text-[10px]"
            ></i>

            <i
              v-else
              class="fa-solid fa-right-from-bracket text-[10px]"
            ></i>

            {{ isLoggingOut ? "កំពុងចាកចេញ..." : "ចាកចេញ" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useQuery } from "../../hooks/useQuery";
import { useAuth } from "../../hooks/useAuth";

const emit = defineEmits(["toggle-sidebar", "navigate"]);

const router = useRouter();

const {
  user,
  logout,
  updateProfileImage,
  removeProfileImage,
  getProfileImageUrl
} = useAuth();

const { data: announcements } = useQuery("announcements");

// State
const isNoticeModalOpen = ref(false);
const isProfileModalOpen = ref(false);
const isLogoutConfirmOpen = ref(false);
const isLoggingOut = ref(false);
const isUploadingProfile = ref(false);
const profileUploadError = ref("");

// Cleared notices
const clearedNoticeIds = ref([]);

onMounted(() => {
  const userId = user.value?._id || user.value?.id || "guest";
  const savedClearedNotices = localStorage.getItem(`cleared_notices_${userId}`);

  if (savedClearedNotices) {
    try {
      clearedNoticeIds.value = JSON.parse(savedClearedNotices);
    } catch (error) {
      clearedNoticeIds.value = [];
    }
  }
});

const profileImageUrl = computed(() => {
  return getProfileImageUrl(user.value?.profileImage);
});

const unreadAnnouncements = computed(() => {
  if (!announcements.value) return [];

  return announcements.value.filter((notice) => {
    const id = notice._id || notice.id;
    return !clearedNoticeIds.value.includes(id);
  });
});

const saveClearedNotices = () => {
  const userId = user.value?._id || user.value?.id || "guest";

  localStorage.setItem(
    `cleared_notices_${userId}`,
    JSON.stringify(clearedNoticeIds.value)
  );
};

const clearNotice = (id) => {
  if (!id) return;

  if (!clearedNoticeIds.value.includes(id)) {
    clearedNoticeIds.value.push(id);
    saveClearedNotices();
  }
};

const clearAllNotices = () => {
  if (!announcements.value) return;

  const allIds = announcements.value
    .map((notice) => notice._id || notice.id)
    .filter(Boolean);

  clearedNoticeIds.value = [
    ...new Set([
      ...clearedNoticeIds.value,
      ...allIds
    ])
  ];

  saveClearedNotices();
};

const handleNoticeClick = (notice) => {
  isNoticeModalOpen.value = false;

  if (notice?._id || notice?.id) {
    clearNotice(notice._id || notice.id);
  }

  emit("navigate", "សេចក្ដីជូនដំណឹង");
};

const formattedRole = computed(() => {
  if (!user.value?.role) return "User";

  const role = String(user.value.role).toLowerCase();

  if (role === "admin") return "អ្នកគ្រប់គ្រង";
  if (role === "teacher") return "គ្រូបង្រៀន";
  if (role === "student") return "សិស្ស";
  if (role === "user") return "អ្នកប្រើប្រាស់";

  return role.charAt(0).toUpperCase() + role.slice(1);
});

const userInitial = computed(() => {
  return user.value?.username
    ? user.value.username.charAt(0).toUpperCase()
    : "U";
});

const getErrorMessage = (error, fallback = "មានបញ្ហាក្នុងប្រព័ន្ធ") => {
  return (
    error.response?.data?.err ||
    error.response?.data?.message ||
    error.message ||
    fallback
  );
};

const handleProfileImageChange = async (event) => {
  const file = event.target.files?.[0];

  if (!file) return;

  profileUploadError.value = "";
  isUploadingProfile.value = true;

  try {
    await updateProfileImage(file);
  } catch (error) {
    profileUploadError.value = getErrorMessage(
      error,
      "មិនអាចប្ដូររូប Profile បានទេ"
    );
  } finally {
    isUploadingProfile.value = false;
    event.target.value = "";
  }
};

const handleRemoveProfileImage = async () => {
  profileUploadError.value = "";
  isUploadingProfile.value = true;

  try {
    await removeProfileImage();
  } catch (error) {
    profileUploadError.value = getErrorMessage(
      error,
      "មិនអាចលុបរូប Profile បានទេ"
    );
  } finally {
    isUploadingProfile.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "ឥឡូវនេះ";

  try {
    const date = new Date(dateString);

    return new Intl.DateTimeFormat("km-KH", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }).format(date);
  } catch (error) {
    return "ថ្មីៗនេះ";
  }
};

const handleLogout = async () => {
  isLoggingOut.value = true;

  try {
    await logout();

    isLogoutConfirmOpen.value = false;
    isProfileModalOpen.value = false;

    router.push("/login");
  } catch (error) {
    // logout already clears local state in useAuth
  } finally {
    isLoggingOut.value = false;
  }
};
</script>