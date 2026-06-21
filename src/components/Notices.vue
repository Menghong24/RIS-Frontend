<template>
  <div class="p-4 md:p-8 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto">
      
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-blue-800 font-khmer">សេចក្តីជូនដំណឹង (Announcements)</h1>
        <button @click="openCreateModal" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium shadow-sm transition">
          + Create Announcement
        </button>
      </div>

      <div v-if="loading" class="text-center py-10 text-gray-500">Loading...</div>
      
      <div v-else class="grid gap-4">
        <div v-for="item in announcements" :key="item._id" class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition relative group">
           
           <div class="flex justify-between items-start">
              <div>
                 <span v-if="item.targetType === 'all'" class="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded uppercase">All Students</span>
                 <span v-else class="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded uppercase">
                    {{ item.targetClass ? item.targetClass.className : 'Class' }}
                 </span>
                 
                 <span :class="item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'" class="ml-2 text-xs font-bold px-2 py-1 rounded uppercase">
                    {{ item.status }}
                 </span>

                 <h3 class="text-lg font-bold text-gray-900 mt-2">{{ item.title }}</h3>
                 <p class="text-gray-600 mt-1 whitespace-pre-wrap">{{ item.content }}</p>
              </div>
              
              <div class="text-right text-xs text-gray-400">
                 <p>{{ formatDate(item.postDate) }}</p>
                 <p v-if="item.postedBy">By: {{ item.postedBy.englishName }}</p>
              </div>
           </div>

           <div class="absolute top-4 right-4 hidden group-hover:flex space-x-2">
              <button @click="openEditModal(item)" class="p-2 text-blue-600 bg-blue-50 rounded hover:bg-blue-100">Edit</button>
              <button @click="handleDelete(item._id)" class="p-2 text-red-600 bg-red-50 rounded hover:bg-red-100">Delete</button>
           </div>

        </div>
        
        <div v-if="announcements.length === 0" class="text-center py-10 text-gray-400">No announcements found.</div>
      </div>

      <div v-if="showModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
         <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div class="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
               <h3 class="text-lg font-bold text-gray-800">{{ isEditing ? 'Edit Announcement' : 'New Announcement' }}</h3>
               <button @click="showModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            
            <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
               
               <div>
                 <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
                 <input v-model="form.title" required type="text" class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500">
               </div>

               <div class="grid grid-cols-2 gap-4">
                  <div>
                     <label class="block text-sm font-medium text-gray-700 mb-1">Target</label>
                     <select v-model="form.targetType" class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500">
                        <option value="all">All Students</option>
                        <option value="class">Specific Class</option>
                     </select>
                  </div>
                  
                  <div>
                     <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                     <select v-model="form.status" class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500">
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                     </select>
                  </div>
               </div>

               <div v-if="form.targetType === 'class'">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Select Class</label>
                  <select v-model="form.targetClass" class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500">
                     <option :value="null">-- Select Class --</option>
                     <option v-for="c in classes" :key="c._id" :value="c._id">{{ c.className }}</option>
                  </select>
               </div>

               <div>
                 <label class="block text-sm font-medium text-gray-700 mb-1">Content</label>
                 <textarea v-model="form.content" required rows="4" class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"></textarea>
               </div>

               <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Posted By (Teacher)</label>
                  <select v-model="form.postedBy" class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500">
                     <option :value="null">-- Admin --</option>
                     <option v-for="t in teachers" :key="t._id" :value="t._id">{{ t.englishName }}</option>
                  </select>
               </div>

               <div class="pt-4 flex justify-end gap-3 border-t mt-4">
                  <button type="button" @click="showModal = false" class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                  <button type="submit" class="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium">Save</button>
               </div>
            </form>
         </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
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
   if(!date) return '';
   return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const openCreateModal = () => {
   isEditing.value = false;
   form.value = { title: '', content: '', targetType: 'all', targetClass: null, postedBy: null, status: 'published' };
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
      if(isEditing.value) {
         await updateDoc(editId.value, form.value);
         toast.success("Updated successfully");
      } else {
         await createDoc(form.value);
         toast.success("Created successfully");
      }
      showModal.value = false;
      fetchData();
   } catch(e) {
      toast.error("Failed to save");
   }
};

const handleDelete = async (id) => {
   if(!confirm("Delete this announcement?")) return;
   await deleteDoc(id);
   fetchData();
};
</script>