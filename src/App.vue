<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuth } from './hooks/useAuth';
import { useRouter } from 'vue-router';

const { token, fetchProfile, logout } = useAuth();
const router = useRouter();

onMounted(async () => {
  // 1. If token exists → restore session
  if (token.value) {
    try {
      await fetchProfile();
    } catch (err) {
      // 2. If token invalid → force logout
      await logout();
      router.replace('/login');
    }
  } else {
    // 3. No token → ensure user stays on login
    if (router.currentRoute.value.meta.requiresAuth) {
      router.replace('/login');
    }
  }
});
</script>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
  overflow: hidden;
}
</style>