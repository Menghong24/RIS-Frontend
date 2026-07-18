<template>
  <!-- Loading Overlay -->
  <div
    v-if="isLoading"
    class="login-loading-overlay-mobile-safe fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm"
  >
    <div class="h-14 w-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-sm">
      <LoaderCircle class="w-8 h-8 text-blue-600 animate-spin" />
    </div>

    <p class="mt-3 text-sm font-extrabold text-slate-700">
      កំពុងចូលប្រើប្រាស់...
    </p>

    <p class="mt-1 text-xs text-slate-500">
      សូមរង់ចាំបន្តិច
    </p>
  </div>

  <!-- Login Page -->
  <div class="login-page-mobile-safe min-h-screen flex items-center justify-center bg-slate-100 p-4">
    <div class="w-full max-w-sm">
      <div class="bg-white rounded-lg shadow-lg border border-slate-200 p-5 md:p-6">
        <!-- Logo -->
        <div class="text-center mb-5">
          <div class="mx-auto h-20 w-20 rounded-lg bg-blue-50 border border-blue-100 shadow-sm flex items-center justify-center overflow-hidden">
            <img
              :src="logoRIS"
              alt="RIS Logo"
              class="h-16 w-16 object-contain"
            />
          </div>

          <h1 class="mt-4 text-xl md:text-2xl font-black text-slate-800">
            សូមស្វាគមន៍
          </h1>

          <p class="mt-1.5 text-xs text-slate-500">
            ចូលប្រើប្រាស់ប្រព័ន្ធគ្រប់គ្រងសាលា RIS
          </p>
        </div>

        <!-- Form -->
        <form class="space-y-3.5" @submit.prevent="handleLogin">
          <!-- Username -->
          <div>
            <label class="form-label">
              ឈ្មោះអ្នកប្រើប្រាស់
            </label>

            <div class="relative">
              <User class="input-icon" />

              <input
                v-model="username"
                type="text"
                autocomplete="username"
                placeholder="បញ្ចូលឈ្មោះអ្នកប្រើប្រាស់"
                class="form-input"
                :class="{ 'input-error': usernameError }"
                @input="usernameError = ''"
              />
            </div>

            <p v-if="usernameError" class="error-text">
              {{ usernameError }}
            </p>
          </div>

          <!-- Password -->
          <div>
            <label class="form-label">
              ពាក្យសម្ងាត់
            </label>

            <div class="relative">
              <LockKeyhole class="input-icon" />

              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="បញ្ចូលពាក្យសម្ងាត់"
                class="form-input pr-11"
                :class="{ 'input-error': passwordError }"
                @input="passwordError = ''"
              />

              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-blue-600 transition"
                :aria-label="showPassword ? 'លាក់ពាក្យសម្ងាត់' : 'បង្ហាញពាក្យសម្ងាត់'"
              >
                <Eye v-if="!showPassword" class="w-4.5 h-4.5" />
                <EyeOff v-else class="w-4.5 h-4.5" />
              </button>
            </div>

            <p v-if="passwordError" class="error-text">
              {{ passwordError }}
            </p>
          </div>

          <!-- Remember -->
          <div class="flex items-center justify-between gap-3 pt-0.5">
            <label class="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />

              <span>ចងចាំឈ្មោះអ្នកប្រើប្រាស់</span>
            </label>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full mt-1 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-extrabold hover:bg-blue-700 active:bg-blue-800 transition disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
          >
            {{ isLoading ? 'កំពុងចូល...' : 'ចូលប្រើប្រាស់' }}
          </button>
        </form>

        <!-- Footer -->
        <div class="mt-5 text-center">
          <p class="text-[11px] font-bold text-slate-500">
            RIS School Management System
          </p>

          <p class="mt-1 text-[10px] text-slate-400">
            ប្រព័ន្ធគ្រប់គ្រងសាលារៀន
          </p>
        </div>
      </div>

      <p class="mt-4 text-center text-[11px] text-slate-400">
        © {{ currentYear }} RIS. រក្សាសិទ្ធិគ្រប់យ៉ាង។
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  LoaderCircle,
  Eye,
  EyeOff,
  User,
  LockKeyhole
} from "lucide-vue-next";
import { useToast } from "vue-toastification";
import { useAuth } from "../hooks/useAuth";

const logoRIS = new URL("../assets/logoRIS.jpg", import.meta.url).href;
// បើរូបជា png សូមប្រើ line ខាងក្រោមជំនួស៖
// const logoRIS = new URL("../assets/logoRIS.png", import.meta.url).href;

const router = useRouter();
const toast = useToast();
const { login, isLoading } = useAuth();

const username = ref("");
const password = ref("");
const showPassword = ref(false);
const rememberMe = ref(false);

const usernameError = ref("");
const passwordError = ref("");

const originalViewportContent = ref("");
const viewportMetaWasCreated = ref(false);

const currentYear = computed(() => new Date().getFullYear());

const setNoZoomViewport = () => {
  if (typeof document === "undefined") return;

  let viewportMeta = document.querySelector('meta[name="viewport"]');

  if (!viewportMeta) {
    viewportMeta = document.createElement("meta");
    viewportMeta.setAttribute("name", "viewport");
    document.head.appendChild(viewportMeta);
    viewportMetaWasCreated.value = true;
  } else if (!originalViewportContent.value) {
    viewportMetaWasCreated.value = false;
    originalViewportContent.value = viewportMeta.getAttribute("content") || "";
  }

  viewportMeta.setAttribute(
    "content",
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
  );
};

const restoreViewport = () => {
  if (typeof document === "undefined") return;

  const viewportMeta = document.querySelector('meta[name="viewport"]');

  if (!viewportMeta) return;

  if (viewportMetaWasCreated.value) {
    viewportMeta.remove();
    return;
  }

  viewportMeta.setAttribute(
    "content",
    originalViewportContent.value || "width=device-width, initial-scale=1"
  );
};

onMounted(() => {
  setNoZoomViewport();

  const rememberedUsername = localStorage.getItem("remembered_username");

  if (rememberedUsername) {
    username.value = rememberedUsername;
    rememberMe.value = true;
  }
});

onBeforeUnmount(() => {
  restoreViewport();
});

const validateForm = () => {
  usernameError.value = "";
  passwordError.value = "";

  let isValid = true;

  if (!username.value.trim()) {
    usernameError.value = "សូមបញ្ចូលឈ្មោះអ្នកប្រើប្រាស់";
    isValid = false;
  }

  if (!password.value.trim()) {
    passwordError.value = "សូមបញ្ចូលពាក្យសម្ងាត់";
    isValid = false;
  }

  return isValid;
};

const handleLogin = async () => {
  if (!validateForm()) {
    toast.error("សូមបំពេញព័ត៌មានចូលប្រើប្រាស់ឱ្យបានត្រឹមត្រូវ");
    return;
  }

  try {
    await login(username.value.trim(), password.value);

    if (rememberMe.value) {
      localStorage.setItem("remembered_username", username.value.trim());
    } else {
      localStorage.removeItem("remembered_username");
    }

    toast.success("ចូលប្រើប្រាស់បានជោគជ័យ!");
    router.push("/dashboard");
  } catch (err) {
    toast.error(
      err?.response?.data?.err ||
      err?.response?.data?.message ||
      "ឈ្មោះអ្នកប្រើប្រាស់ ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ"
    );
  }
};
</script>

<style scoped>
.form-label {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.76rem;
  font-weight: 800;
  color: #334155;
}

.input-icon {
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  width: 0.95rem;
  height: 0.95rem;
  color: #94a3b8;
  pointer-events: none;
  z-index: 10;
}

.form-input {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 0.55rem;
  background: #f8fafc;
  padding: 0.65rem 0.85rem 0.65rem 2.35rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: #0f172a;
  outline: none;
  transition: all 0.2s ease;
}

.form-input::placeholder {
  color: #94a3b8;
  font-weight: 500;
}

.form-input:focus {
  border-color: #2563eb;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgb(37 99 235 / 0.1);
}

.input-error {
  border-color: #fca5a5 !important;
  background: #fef2f2 !important;
}

.error-text {
  margin-top: 0.28rem;
  font-size: 0.68rem;
  font-weight: 700;
  color: #dc2626;
}

/* Chrome mobile bottom toolbar fix + no visual input-size changes */
@media (max-width: 640px) {
  .login-page-mobile-safe {
    min-height: 100vh;
    min-height: 100dvh;
    padding-bottom: calc(2.75rem + env(safe-area-inset-bottom));
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }

  .login-page-mobile-safe > .w-full {
    padding-bottom: calc(1.5rem + env(safe-area-inset-bottom));
  }

  .login-loading-overlay-mobile-safe {
    min-height: 100vh;
    min-height: 100dvh;
    padding-bottom: calc(1rem + env(safe-area-inset-bottom));
  }
}
</style>
