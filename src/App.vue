<template>
  
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuth } from './hooks/useAuth'; // ត្រូវប្រាកដថា Path នេះត្រឹមត្រូវ

// ទាញយក token និងមុខងារ fetchProfile ពី useAuth
const { token, fetchProfile } = useAuth();

// នៅពេលកម្មវិធីបើកដំណើរការដំបូង (Refresh)
onMounted(() => {
  // ប្រសិនបើមាន Token រួចហើយ វាទាញយកទិន្នន័យ Profile មកបង្ហាញលើ Header
  if (token.value) {
    fetchProfile();
  }
});
</script>

<style>
/* Global styles សម្រាប់កម្មវិធីទាំងមូល */
</style>