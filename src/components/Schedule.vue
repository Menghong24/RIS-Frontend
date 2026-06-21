<template>
  <div class="p-4 md:p-8 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto">
      
      <div class="flex flex-wrap justify-between items-center mb-6 border-b pb-4">
        <div class="flex items-center gap-3">
          <button 
            v-if="classFilter" 
            @click="classFilter = ''" 
            class="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition"
            title="Back to Classes"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>
          
          <h1 class="text-2xl font-bold text-blue-800 font-khmer">
            {{ classFilter ? `កាលវិភាគ - ${selectedClassName}` : 'ជ្រើសរើសថ្នាក់ (Select Class)' }}
          </h1>
        </div>
        
        <div v-if="classFilter" class="flex gap-3">
           <button @click="openCreateModal" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition flex items-center shadow-sm">
             + Add Schedule
           </button>
        </div>
      </div>

      <div v-if="loading" class="text-center py-20 text-gray-500">
        <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        Loading...
      </div>

      <div v-else-if="!classFilter" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
         <div 
           v-for="c in classes" 
           :key="c._id" 
           @click="selectClass(c._id)"
           class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-lg hover:border-blue-400 hover:-translate-y-1 transition-all group flex flex-col items-center text-center"
         >
            <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl font-bold mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              {{ c.className.substring(0,2).toUpperCase() }}
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-1">{{ c.className }}</h3>
            <div class="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
               <span>Grade: {{ c.classGrade }}</span>
               <span class="w-1 h-1 bg-gray-400 rounded-full"></span>
               <span>{{ c.timeStudy }}</span>
            </div>
         </div>
         
         <div v-if="classes?.length === 0" class="col-span-full text-center py-10 text-gray-400">
           No classes found. Please create a class first.
         </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="day in daysOfWeek" :key="day" class="bg-white rounded-xl shadow border border-gray-200 flex flex-col h-full">
           <div class="bg-blue-50 p-3 border-b border-gray-100 rounded-t-xl">
              <h3 class="font-bold text-blue-800 text-center">{{ day }}</h3>
           </div>
           
           <div class="p-3 space-y-3 flex-grow min-h-[150px]">
              <div v-if="getSchedulesForDay(day).length === 0" class="text-center text-xs text-gray-400 py-4 italic">
                No classes
              </div>

              <div 
                v-for="item in getSchedulesForDay(day)" 
                :key="item._id" 
                class="bg-white border border-gray-100 rounded-lg p-3 shadow-sm hover:shadow-md transition group relative"
              >
                 <div class="flex justify-between items-start mb-1">
                    <span class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{{ item.startTime }} - {{ item.endTime }}</span>
                    <span class="text-xs text-gray-400">{{ item.room }}</span>
                 </div>
                 
                 <h4 class="font-bold text-gray-800 text-sm mb-0.5">{{ item.subject?.subjectName }}</h4>
                 <p class="text-xs text-gray-500">{{ item.teacher?.englishName || 'No Teacher' }}</p>

                 <div class="absolute top-2 right-2 hidden group-hover:flex bg-white shadow rounded border overflow-hidden">
                    <button @click="openEditModal(item)" class="p-1.5 text-blue-600 hover:bg-blue-50 transition"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg></button>
                    <div class="w-px bg-gray-200"></div>
                    <button @click="handleDelete(item._id)" class="p-1.5 text-red-500 hover:bg-red-50 transition"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div v-if="showModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
         <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div class="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
               <h3 class="text-lg font-bold text-gray-800">{{ isEditing ? 'Edit Schedule' : 'Add Schedule' }}</h3>
               <button @click="showModal = false" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            
            <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
               <div>
                 <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                 <select v-model="form.subject" required class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none">
                    <option v-for="s in subjects" :key="s._id" :value="s._id">{{ s.subjectName }}</option>
                 </select>
               </div>

               <div>
                 <label class="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
                 <select v-model="form.teacher" class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none">
                    <option :value="null">-- No Teacher --</option>
                    <option v-for="t in teachers" :key="t._id" :value="t._id">{{ t.englishName }} ({{ t.khmerName }})</option>
                 </select>
               </div>

               <div>
                 <label class="block text-sm font-medium text-gray-700 mb-1">Day</label>
                 <select v-model="form.day" required class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none">
                    <option v-for="d in daysOfWeek" :key="d" :value="d">{{ d }}</option>
                 </select>
               </div>

               <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input type="time" v-model="form.startTime" required class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input type="time" v-model="form.endTime" required class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none">
                  </div>
               </div>

               <div>
                 <label class="block text-sm font-medium text-gray-700 mb-1">Room</label>
                 <input type="text" v-model="form.room" class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g., Room 101">
               </div>

               <div class="pt-4 flex justify-end gap-3 border-t mt-4">
                  <button type="button" @click="showModal = false" class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition">Cancel</button>
                  <button type="submit" class="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium transition shadow-sm">Save</button>
               </div>
            </form>
         </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useQuery } from "../hooks/useQuery";
import { useCollection } from "../hooks/useCollection";
import api from "../config/api"; // for direct filter call
import { useToast } from "vue-toastification";

const toast = useToast();
const { createDoc, updateDoc, deleteDoc } = useCollection('schedules');

// --- Data ---
const { data: classes } = useQuery('classes');
const { data: subjects } = useQuery('subjects');
const { data: teachers } = useQuery('teachers');

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// --- State ---
const schedules = ref([]);
const classFilter = ref("");
const loading = ref(false);
const showModal = ref(false);
const isEditing = ref(false);
const editId = ref(null);

const form = ref({
  class: "",
  subject: "",
  teacher: null,
  day: "Monday",
  startTime: "07:00",
  endTime: "08:00",
  room: "A1"
});

// --- Computed ---
const selectedClassName = computed(() => {
  if (!classFilter.value || !classes.value) return '';
  const selected = classes.value.find(c => c._id === classFilter.value);
  return selected ? selected.className : '';
});

// --- Fetch Logic ---
const fetchSchedules = async () => {
  if(!classFilter.value) {
    schedules.value = [];
    return;
  }
  loading.value = true;
  try {
     const res = await api.get('/schedules', { params: { classId: classFilter.value } });
     schedules.value = res.data;
  } catch(e) {
     console.error(e);
     toast.error("Failed to load schedules");
  } finally {
     loading.value = false;
  }
};

// Re-fetch when class changes
watch(classFilter, () => {
   fetchSchedules();
});

// --- Helpers & Actions ---
const selectClass = (classId) => {
  classFilter.value = classId;
};

const getSchedulesForDay = (day) => {
   return schedules.value.filter(s => s.day === day);
};

const openCreateModal = () => {
   if(!classFilter.value) {
      toast.warning("Please select a class first");
      return;
   }
   isEditing.value = false;
   form.value = {
     class: classFilter.value,
     subject: "",
     teacher: null,
     day: "Monday",
     startTime: "07:00",
     endTime: "08:00",
     room: "A1"
   };
   showModal.value = true;
};

const openEditModal = (item) => {
   isEditing.value = true;
   editId.value = item._id;
   form.value = {
     class: item.class._id || item.class,
     subject: item.subject._id || item.subject,
     teacher: item.teacher ? (item.teacher._id || item.teacher) : null,
     day: item.day,
     startTime: item.startTime,
     endTime: item.endTime,
     room: item.room
   };
   showModal.value = true;
};

const handleSubmit = async () => {
   try {
     if(isEditing.value) {
        await updateDoc(editId.value, form.value);
     } else {
        await createDoc(form.value);
     }
     showModal.value = false;
     fetchSchedules();
   } catch(e) {
     toast.error("Failed to save schedule");
   }
};

const handleDelete = async (id) => {
   if(!confirm("Are you sure you want to remove this schedule?")) return;
   await deleteDoc(id);
   fetchSchedules();
};
</script>