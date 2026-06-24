<template>
  <!-- Loading Overlay -->
  <div
    v-if="isLoading"
    class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md"
  >
    <LoaderCircle class="w-14 h-14 text-blue-600 animate-spin" />
    <p class="mt-4 text-lg font-semibold text-gray-700">
      Signing In...
    </p>
  </div>

  <!-- Login Page -->
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-4"
  >
    <div class="w-full max-w-md">
      <div class="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">

        <!-- Logo -->
        <div class="text-center mb-8">
          <div
            class="mx-auto w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-lg overflow-hidden"
          >
            <img
              :src="logoRIS"
              alt="RIS Logo"
              class="w-20 h-20 object-contain"
            />
          </div>

          <h1 class="mt-5 text-3xl font-bold text-gray-900">
            Welcome Back
          </h1>

          <p class="mt-2 text-gray-500">
            Sign in to your RIS Dashboard
          </p>
        </div>

        <!-- Form -->
        <form class="space-y-5" @submit.prevent="handleLogin">

          <!-- Username -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700">
              Username
            </label>

            <input
              v-model="username"
              type="text"
              autocomplete="username"
              placeholder="Enter your username"
              class="w-full px-4 py-3 bg-gray-100 rounded-xl border-2 border-transparent focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>

            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="Enter your password"
                class="w-full px-4 py-3 pr-12 bg-gray-100 rounded-xl border-2 border-transparent focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
              />

              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500"
              >
                <Eye v-if="!showPassword" class="w-5 h-5" />
                <EyeOff v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Remember -->
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <input v-model="rememberMe" type="checkbox" />
            <span>Remember me</span>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center"
          >
            <LoaderCircle
              v-if="isLoading"
              class="w-5 h-5 mr-2 animate-spin"
            />
            {{ isLoading ? 'Signing In...' : 'Sign In' }}
          </button>
        </form>

        <!-- Footer -->
        <div class="mt-8 text-center text-sm text-gray-500">
          RIS School Management System
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { LoaderCircle, Eye, EyeOff } from 'lucide-vue-next'
import { useToast } from 'vue-toastification'
import { useAuth } from '../hooks/useAuth'

// ✅ import logo
import logoRIS from '../assets/logoRIS.jpg'

const router = useRouter()
const toast = useToast()
const { login, isLoading } = useAuth()

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)

const handleLogin = async () => {
  if (!username.value.trim()) {
    toast.error('Please enter username')
    return
  }

  if (!password.value.trim()) {
    toast.error('Please enter password')
    return
  }

  try {
    await login(username.value, password.value)

    toast.success('Login successful!')
    router.push('/dashboard')
  } catch (err) {
    toast.error(
      err?.response?.data?.err || 'Invalid username or password'
    )
  }
}
</script>