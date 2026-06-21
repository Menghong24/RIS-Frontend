<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 class="text-2xl font-bold text-blue-800 font-khmer flex items-center gap-2">
        <span class="w-2 h-8 bg-blue-600 rounded-full inline-block"></span>
        គ្រូបង្រៀនទាំងអស់
      </h1>
      <button 
        @click="openAddModal" 
        class="flex items-center justify-center bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 hover:shadow-md transition-all duration-300 w-full sm:w-auto"
      >
        <UserPlus class="w-5 h-5 mr-2" />
        បញ្ចូលគ្រូថ្មី
      </button>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 mt-6">
      <TeacherCard 
        v-for="teacher in teachers" 
        :key="teacher._id || teacher.id"
        :teacher="teacher"
        @view="openViewModal"
        @edit="openEditModal"
        @delete="openDeleteModal"
      />
    </div>

    <div v-if="teachers && teachers.length === 0" class="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm mt-6">
      <div class="text-gray-400 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <p class="text-lg font-medium text-gray-500">មិនទាន់មានទិន្នន័យគ្រូបង្រៀននៅឡើយទេ</p>
      </div>
      <button @click="openAddModal" class="text-blue-600 hover:text-blue-700 font-medium hover:underline mt-2">
        + ចុចទីនេះដើម្បីបញ្ចូលថ្មី
      </button>
    </div>

    <TeacherFormModal 
      v-if="isFormModalOpen" 
      :is-open="isFormModalOpen"
      :is-editing="isEditing"
      :teacher="teacherToEdit"
      @close="closeFormModal"
      @save="saveTeacher"
    />

    <TeacherViewModal 
      :is-open="isViewModalOpen"
      :teacher="teacherToView"
      @close="closeViewModal"
    />

    <DeleteConfirmationModal 
      :is-open="isDeleteModalOpen"
      :item-name="`${teacherToDelete?.khmerName} ${teacherToDelete?.englishName}`"
      title="Delete Teacher?"
      @close="closeDeleteModal"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { UserPlus } from 'lucide-vue-next';

// 1. Import Composables
import { useQuery } from '../hooks/useQuery'; 
import { useCollection } from '../hooks/useCollection'; 

// Import child components
import TeacherCard from './teachers/TeacherCard.vue';
import TeacherFormModal from './teachers/TeacherFormModal.vue'; 
import TeacherViewModal from './teachers/TeacherViewModal.vue';
import DeleteConfirmationModal from './shared/DeleteConfirmationModal.vue';

// 2. Initialize Composables
const { data: teachers, fetchData } = useQuery('teachers'); 
const { createDoc, updateDoc, deleteDoc } = useCollection('teachers');

// State
const isFormModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isViewModalOpen = ref(false);
const isEditing = ref(false);
const teacherToEdit = ref(null);
const teacherToDelete = ref(null);
const teacherToView = ref(null);

// --- Modal Handling ---
const openAddModal = () => {
  isEditing.value = false;
  // UPDATED: Removed placeOfBirth, added telegram to match Schema
  teacherToEdit.value = { 
    khmerName: '',
    englishName: '',
    gender: 'ប្រុស',
    nationality: 'Cambodian',
    dateOfBirth: '',
    email: '',
    phone: '',
    telegram: '',
    skill: '',
    facebook: '',
    currentResidence: { village: '', commune: '', district: '', province: '' },
    note: ''
  };
  isFormModalOpen.value = true;
};

const openEditModal = (teacher) => {
  isEditing.value = true;
  // Create a deep copy to avoid immediate mutation issues
  teacherToEdit.value = JSON.parse(JSON.stringify(teacher));
  isFormModalOpen.value = true;
};

const openViewModal = (teacher) => {
  teacherToView.value = teacher;
  isViewModalOpen.value = true;
};

const openDeleteModal = (teacher) => {
  teacherToDelete.value = teacher;
  isDeleteModalOpen.value = true;
};

const closeFormModal = () => isFormModalOpen.value = false;
const closeViewModal = () => isViewModalOpen.value = false;
const closeDeleteModal = () => isDeleteModalOpen.value = false;

// --- Data Actions ---
const saveTeacher = async (teacherData) => {
  try {
    if (isEditing.value) {
      // Use _id for MongoDB
      const id = teacherData._id || teacherData.id;
      await updateDoc(id, teacherData);
    } else {
      await createDoc(teacherData);
    }
    // Refresh the list after save
    await fetchData(); 
    closeFormModal();
  } catch (error) {
    console.error("Failed to save teacher:", error);
  }
};

const confirmDelete = async () => {
  if (teacherToDelete.value) {
    try {
      const id = teacherToDelete.value._id || teacherToDelete.value.id;
      await deleteDoc(id);
      // Refresh the list after delete
      await fetchData();
    } catch (error) {
      console.error("Failed to delete teacher:", error);
    }
  }
  closeDeleteModal();
};
</script>