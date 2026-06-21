<template>
  <div class="p-4 md:p-8 min-h-screen antialiased text-slate-800">
    <div class="max-w-7xl mx-auto space-y-6">
      
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 class="text-2xl font-extrabold text-blue-600 tracking-tight font-khmer flex items-center gap-2">
            <span class="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </span>
            មុខវិជ្ជាសិក្សា 
          </h1>
          <p class="text-sm text-slate-500 mt-1">គ្រប់គ្រងកម្មវិធីសិក្សា ចំនួនថ្ថ្នាក់រៀន កិច្ចការសិក្សា និងថ្លៃបង្រៀនបន្ថែម</p>
        </div>
        
        <button @click="openCreateModal" class="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 font-semibold transition active:scale-95 flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20 whitespace-nowrap self-start md:self-auto">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5 a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" /></svg>
          បន្ថែមមុខវិជ្ជា
        </button>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div class="p-3 bg-blue-50 text-blue-600 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg></div>
          <div><p class="text-xs font-semibold uppercase text-slate-400 tracking-wider">មុខវិជ្ជាទាំងអស់</p><p class="text-xl font-bold text-slate-900">{{ subjects?.length || 0 }}</p></div>
        </div>
        <div class="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div class="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
          <div><p class="text-xs font-semibold uppercase text-slate-400 tracking-wider">ដំណើរការ</p><p class="text-xl font-bold text-slate-900">{{ subjects?.filter(s => s.status === 'active').length || 0 }}</p></div>
        </div>
        <div class="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div class="p-3 bg-purple-50 text-purple-600 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div>
          <div><p class="text-xs font-semibold uppercase text-slate-400 tracking-wider">ថ្នាក់រៀន</p><p class="text-xl font-bold text-slate-900">{{ classesList?.length || 0 }}</p></div>
        </div>
        <div class="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div class="p-3 bg-amber-50 text-amber-600 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
          <div><p class="text-xs font-semibold uppercase text-slate-400 tracking-wider">ថ្លៃសិក្សា</p><p class="text-xl font-bold text-slate-900">${{ calculateAvgFee() }}</p></div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between gap-4 items-center">
        <div class="flex items-center gap-2 text-slate-500 text-sm self-start md:self-auto font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          Filter Records:
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto">
          <!-- <div class="relative">
            <select v-model="gradeFilter" class="w-full md:w-44 appearance-none border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-sm font-medium bg-slate-50 hover:bg-slate-100/70 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition">
              <option value="All">All Grades</option>
              <option v-for="g in grades" :key="g" :value="g">{{ g }}</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg></div>
          </div> -->

          <div class="relative">
            <select v-model="classFilter" class="w-full md:w-44 appearance-none border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-sm font-medium bg-slate-50 hover:bg-slate-100/70 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition">
              <option value="All">ថ្នាក់ទាំងអស់</option>
              <option v-for="c in filteredClassesForFilter" :key="c._id" :value="c._id">{{ c.className }}</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg></div>
          </div>

          <div class="relative">
            <select v-model="typeFilter" class="w-full md:w-44 appearance-none border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-sm font-medium bg-slate-50 hover:bg-slate-100/70 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition">
              <option value="All">ប្រភេទ</option>
              <option value="general">General Course</option>
              <option value="optional">Optional Course</option>
              <option value="skill">Skill / Vocational</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg></div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div v-if="loading" class="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
          <div class="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
          <span class="text-sm font-medium tracking-wide">Syncing data engine...</span>
        </div>
        
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-100">
            <thead class="bg-slate-50/70 text-slate-500">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Subject Specifications</th>
                <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Target Base</th> 
                <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Classification</th>
                <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Assigned Lecturer</th>
                <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Tuition Fee</th>
                <th class="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">Operational Status</th>
                <th class="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider">Management</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr v-for="sub in filteredSubjects" :key="sub._id" class="hover:bg-slate-50/60 transition-colors group">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{{ sub.subjectName }}</div>
                  <div class="text-xs text-slate-400 mt-0.5">ID: {{ sub._id.substring(0,8) }}...</div>
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-col">
                    <span v-if="sub.classId" class="font-bold text-slate-800 text-sm">
                      {{ sub.classId.className }}
                    </span>
                    <span v-else class="text-slate-400 text-xs italic bg-slate-100 px-2 py-0.5 rounded w-max">Unbound Course</span>
                    <span class="text-xs text-slate-400 font-medium mt-0.5">{{ sub.gradeLevel }}</span>
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getTypeClass(sub.type)" class="px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide uppercase">
                    {{ sub.type }}
                  </span>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-if="sub.teacher" class="flex flex-col">
                    <span class="font-semibold text-slate-800 text-sm">{{ sub.teacher.englishName }}</span>
                    <span class="text-xs text-slate-400 font-khmer mt-0.5">{{ sub.teacher.khmerName }}</span>
                  </div>
                  <span v-else class="text-slate-400 text-xs italic flex items-center gap-1">
                    <span class="h-1.5 w-1.5 bg-amber-400 rounded-full animate-pulse"></span> Vacant Slot
                  </span>
                </td>

                <td class="px-6 py-4 whitespace-nowrap font-mono text-sm text-slate-900 font-semibold">
                  ${{ sub.fee?.toFixed(2) }}
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span :class="sub.status === 'active' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-slate-500 bg-slate-50 border-slate-200'" 
                        class="px-2.5 py-1 rounded-full text-xs font-bold border tracking-wide uppercase inline-block">
                    {{ sub.status }}
                  </span>
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                   <div class="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                     <button @click="openEditModal(sub)" class="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition" title="Modify Configuration">
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                     </button>
                     <button @click="handleDelete(sub._id)" class="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition" title="Purge Record">
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                     </button>
                   </div>
                </td>
              </tr>
              
              <tr v-if="filteredSubjects.length === 0">
                 <td colspan="7" class="text-center py-16 text-slate-400 bg-slate-50/30">
                    <div class="max-w-xs mx-auto flex flex-col items-center">
                      <div class="p-4 bg-slate-100 rounded-full text-slate-400 mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <p class="text-base font-semibold text-slate-700">No subjects matches criteria</p>
                      <p class="text-xs text-slate-400 mt-1">Adjust your parameters or introduce a new subject structure.</p>
                    </div>
                 </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="showModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
         <div class="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden border border-slate-100 transform transition-all duration-300 scale-100">
            <div class="px-6 py-4.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div>
                 <h3 class="text-lg font-bold text-slate-900">{{ isEditing ? 'Edit Subject Registry' : 'Initialize New Subject' }}</h3>
                 <p class="text-xs text-slate-500 mt-0.5">Fill out database parameters for this program line item.</p>
               </div>
               <button @click="showModal = false" class="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-xl transition text-xl">&times;</button>
            </div>
            
            <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
               <div>
                 <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">មុខវិជ្ជា <span class="text-rose-500">*</span></label>
                 <input v-model="form.subjectName" required type="text" placeholder="e.g. Advanced Organic Chemistry" class="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50 transition placeholder:text-slate-400 font-medium">
               </div>

               <div class="grid grid-cols-1 sm:grid-cols-1 gap-4">
                 <!-- <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Grade Architecture</label>
                    <select v-model="form.gradeLevel" class="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white cursor-pointer transition font-medium">
                      <option v-for="g in grades" :key="g" :value="g">{{ g }}</option>
                    </select>
                 </div>
                  -->
                 <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Associated Room / Class</label>
                    <select v-model="form.classId" class="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white cursor-pointer transition font-medium">
                      <option :value="null">-- Free Course (No Class Mapping) --</option>
                      <option v-for="c in classesList" :key="c._id" :value="c._id">
                        {{ c.className }} ({{ c.classGrade }})
                      </option>
                    </select>
                 </div>
               </div>

               <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Course Classification</label>
                    <select v-model="form.type" class="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white cursor-pointer transition font-medium">
                       <option value="general">General</option>
                       <option value="optional">Optional</option>
                       <option value="skill">Skill</option>
                    </select>
                 </div>
                 <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Base Pricing Rate ($)</label>
                    <div class="relative">
                      <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-mono text-sm font-semibold">$</span>
                      <input v-model.number="form.fee" type="number" min="0" step="0.01" class="w-full border border-slate-200 rounded-xl pl-8 pr-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50 font-mono font-semibold transition">
                    </div>
                 </div>
               </div>

               <div>
                 <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Appointed Primary Lecturer</label>
                 <select v-model="form.teacher" class="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white cursor-pointer transition font-medium">
                    <option :value="null">-- Keep Position Vacant --</option>
                    <option v-for="t in teachers" :key="t._id" :value="t._id">
                       {{ t.englishName }} ({{ t.khmerName }})
                    </option>
                 </select>
               </div>

               <div>
                 <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Administrative Status</label>
                 <div class="flex gap-4 mt-1">
                    <label class="flex items-center gap-2 text-sm font-medium cursor-pointer text-slate-700">
                      <input type="radio" v-model="form.status" value="active" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300">
                      Active Deployment
                    </label>
                    <label class="flex items-center gap-2 text-sm font-medium cursor-pointer text-slate-700">
                      <input type="radio" v-model="form.status" value="disabled" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300">
                      On Hold / Disabled
                    </label>
                 </div>
               </div>
               
               <div>
                 <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Internal Remarks / Notes</label>
                 <textarea v-model="form.remark" rows="2" placeholder="Enter course notes, room requirements, or schedule preferences..." class="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50 transition placeholder:text-slate-400 font-medium resize-none"></textarea>
               </div>

               <div class="pt-4 flex justify-end gap-2.5 border-t border-slate-100 mt-5">
                  <button type="button" @click="showModal = false" class="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition">Dismiss</button>
                  <button type="submit" class="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/10 transition transform active:scale-95">Commit Records</button>
               </div>
            </form>
         </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuery } from "../hooks/useQuery";
import { useCollection } from "../hooks/useCollection";
import { useToast } from "vue-toastification";

const toast = useToast();

// --- Data Fetching ---
const { data: subjects, fetchData, loading } = useQuery('subjects');
const { data: teachers } = useQuery('teachers'); 
const { data: classesList } = useQuery('classes');

// --- CRUD Hooks ---
const { createDoc, updateDoc, deleteDoc } = useCollection('subjects');

// --- Options ---
const grades = ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

// --- State ---
const gradeFilter = ref('All');
const typeFilter = ref('All');
const classFilter = ref('All');
const showModal = ref(false);
const isEditing = ref(false);
const editId = ref(null);

const form = ref({
  subjectName: '',
  gradeLevel: 'Grade 7',
  classId: null,
  type: 'general',
  teacher: null,
  fee: 0,
  status: 'active',
  remark: ''
});

// --- Smart Dashboard Helpers ---
const calculateAvgFee = () => {
  if (!subjects.value || subjects.value.length === 0) return '0.00';
  const total = subjects.value.reduce((acc, curr) => acc + (Number(curr.fee) || 0), 0);
  return (total / subjects.value.length).toFixed(2);
};

// --- Computed Filters ---
const filteredClassesForFilter = computed(() => {
    if(!classesList.value) return [];
    if(gradeFilter.value === 'All') return classesList.value;
    return classesList.value.filter(c => c.classGrade === gradeFilter.value);
});

const filteredSubjects = computed(() => {
   if(!subjects.value) return [];
   return subjects.value.filter(s => {
      const matchGrade = gradeFilter.value === 'All' || s.gradeLevel === gradeFilter.value;
      const matchType = typeFilter.value === 'All' || s.type === typeFilter.value;
      
      const subjectClassId = s.classId && typeof s.classId === 'object' ? s.classId._id : s.classId;
      const matchClass = classFilter.value === 'All' || subjectClassId === classFilter.value;

      return matchGrade && matchType && matchClass;
   });
});

// --- Smart Badge Logic ---
const getTypeClass = (type) => {
   switch(type) {
     case 'general': return 'bg-blue-50 text-blue-700 border border-blue-200';
     case 'skill': return 'bg-purple-50 text-purple-700 border border-purple-200';
     default: return 'bg-amber-50 text-amber-700 border border-amber-200';
   }
};

// --- Actions ---
const openCreateModal = () => {
   isEditing.value = false;
   editId.value = null;
   form.value = {
     subjectName: '',
     gradeLevel: 'Grade 7',
     classId: null,
     type: 'general',
     teacher: null,
     fee: 0,
     status: 'active',
     remark: ''
   };
   showModal.value = true;
};

const openEditModal = (sub) => {
   isEditing.value = true;
   editId.value = sub._id;
   
   const teacherId = (sub.teacher && typeof sub.teacher === 'object') ? sub.teacher._id : sub.teacher;
   const clsId = (sub.classId && typeof sub.classId === 'object') ? sub.classId._id : sub.classId;

   form.value = {
     subjectName: sub.subjectName,
     gradeLevel: sub.gradeLevel,
     classId: clsId || null,
     type: sub.type,
     teacher: teacherId || null,
     fee: sub.fee,
     status: sub.status,
     remark: sub.remark
   };
   showModal.value = true;
};

const handleSubmit = async () => {
   try {
     const payload = { ...form.value };
     
     if(isEditing.value && editId.value) {
        await updateDoc(editId.value, payload);
        toast.success("Subject modified safely in directory.");
     } else {
        await createDoc(payload);
        toast.success("Subject systematically initialized.");
     }
     
     await fetchData();
     showModal.value = false;
     
   } catch(e) {
     console.error("Database save exception:", e);
     toast.error(e.message || "Failed to finalize database injection.");
   }
};

const handleDelete = async (id) => {
   if(!confirm('Are you absolutely sure you want to drop this subject record permanently?')) return;
   
   try {
     await deleteDoc(id);
     toast.success("Subject dropped from registry.");
     await fetchData();
   } catch (e) {
     console.error(e);
     toast.error("Process aborted. Purge failure.");
   }
};
</script>