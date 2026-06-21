<template>
  <div v-if="isLoading" class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm transition-opacity">
    <LoaderCircle class="w-12 h-12 text-blue-600 animate-spin mb-4" />
    <p class="text-lg font-semibold text-gray-800">Authenticating...</p>
  </div>

  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">Welcome Back</h1>
        <p class="mt-2 text-gray-600">Sign in to your NUBB Dashboard</p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="relative">
          <label for="username" class="sr-only">Username</label>
          <input 
            id="username" 
            v-model="username" 
            name="username" 
            type="text" 
            autocomplete="username" 
            required 
            class="w-full px-4 py-3 text-gray-900 placeholder-gray-500 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" 
            placeholder="Username"
          >
        </div>
        
        <div class="relative">
          <label for="password" class="sr-only">Password</label>
          <input 
            id="password" 
            v-model="password" 
            name="password" 
            :type="showPassword ? 'text' : 'password'" 
            autocomplete="current-password" 
            required 
            class="w-full px-4 py-3 pr-12 text-gray-900 placeholder-gray-500 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" 
            placeholder="Password"
          >
          <button 
            type="button"
            @click="showPassword = !showPassword"
            class="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <Eye v-if="!showPassword" class="w-5 h-5" />
            <EyeOff v-else class="w-5 h-5" />
          </button>
        </div>

        <div>
          <button 
            type="submit" 
            class="w-full flex justify-center px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-400"
            :disabled="isLoading"
          >
            <LoaderCircle v-if="isLoading" class="animate-spin w-5 h-5 mr-2" />
            {{ isLoading ? 'Signing In...' : 'Sign In' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { LoaderCircle, Eye, EyeOff } from 'lucide-vue-next';
import { useToast } from 'vue-toastification';
import { useAuth } from '../hooks/useAuth';

const router = useRouter();
const toast = useToast();
const { login, isLoading } = useAuth();

const username = ref('');
const password = ref('');
const showPassword = ref(false);

const handleLogin = async () => {
  try {
    // Attempt to log in via the composable
    // The useAuth composable automatically sets isLoading to true here
    await login(username.value, password.value);
    
    toast.success('Login successful! Redirecting...', {
      timeout: 1500
    });
    
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);

  } catch (err) {
    const errorMessage = err.response?.data?.err || 'Invalid username or password.';
    toast.error(errorMessage);
    console.error("Login process failed:", err);
  }
};
</script>