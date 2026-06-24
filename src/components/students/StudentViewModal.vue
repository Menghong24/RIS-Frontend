<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/10 backdrop-blur-md flex items-center justify-center z-50 p-4">
    <div class="bg-white/60 rounded-xl shadow-xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <div class="flex  space-x-6 ">
        <img :src="avatar" class="w-30 h-30 rounded-full object-cover ring-4 ring-blue-200" :alt="student?.khmerName">
         <h2 class="text-2xl text-center  text-blue-600  font-bold">{{ student?.khmerName }} </h2>
      </div>
        <div class="">
         
          <!-- <span :class="student?.status === 'active'||'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="mt-2 inline-block px-3 py-1 text-sm font-semibold rounded-full">
            {{ status= "Active" }}
          </span> -->
        </div>
      <div class="mt-4 border-t"></div>
      <div class="mt-6 border-t pt-6 border border-gray-300 p-4 rounded-xl bg-white ">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 ">ពត៌មានលំអិតរបស់សិស្ស</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 px-4 text-sm">
              <div class="flex items-center space-x-2">
                 <strong class="text-gray-500">សិស្សឈ្មោះ៖</strong>
                  <p class="text-gray-800">{{ student?.khmerName }}</p>
              </div>
              <div class="flex items-center space-x-2"><strong class="text-gray-500">ជាអក្សរឡាំតាំង:</strong><p>{{ student?.englishName }}</p></div >
              <div class="flex items-center space-x-2"><strong class="text-gray-500">ភេទ</strong><p>{{ student?.gender }}</p></div >
              <div class="flex items-center space-x-2"><strong class="text-gray-500">សញ្ជាតិ</strong><p>{{ student?.nationality.student }}</p></div >
              <div class="flex items-center space-x-2"><strong class="text-gray-500">ថ្ងៃខែឆ្នាំកំណើត:</strong><p>{{ new Date(student?.birthDate).toLocaleDateString('en-CA') }}</p></div >
             
              <div class="flex items-center space-x-2"><strong class="text-gray-500">អត្តលេខ:</strong><p>{{ student?.studentId }}</p></div >
              <!-- <div class="flex items-center space-x-2"><strong class="text-gray-500">ថ្នាក់ទី</strong><p>{{ student?.grade.className }}</p></div > -->
              <div class="flex items-center space-x-2"><strong class="text-gray-500">ថ្ងៃចូលរៀន</strong><p>{{ student?.phone }}</p></div >
              <!-- <div class="flex items-center space-x-2"><strong class="text-gray-500">Email:</strong><p>{{ student?.email }}</p></div> -->
          </div>
             <!-- <div class="flex items-center space-x-2 text-sm p-4">
            <strong class="text-gray-500 text-sm ">ទីកន្លែងកំណើត:</strong>
              <p>
                ភូមិ<span class="text-blue-500">{{ student?.placeOfBirth.village }}</span>,ឃុំ/សង្កាត់<span class="text-blue-500">{{ student?.placeOfBirth.commune }}</span>,
                ស្រុក/ខាន់<span class="text-blue-500">{{ student?.placeOfBirth.district }}</span>,ខេត្ត/ក្រុង<span class="text-blue-500">{{ student?.placeOfBirth.province }}</span>
              </p>
          </div> -->
           <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 px-4 text-sm">
        
                 <div class="flex items-center space-x-2"><strong class="text-gray-500 ">ម្ដាយឈ្មោះ:</strong><p>{{ student?.family.motherName }}</p></div >
              <!-- <div class="flex items-center space-x-2"><strong class="text-gray-500">មុខរបរ</strong><p>{{ student?.family.motherOccupation }}</p></div > -->
              <div class="flex items-center space-x-2"><strong class="text-gray-500">លេខទំនាក់ទំនង</strong><p>{{ student?.family.motherNumber }}</p></div >
              
          </div>
          <div class="flex items-center space-x-2 text-sm px-4 pt-4 "><strong class="text-gray-500 text-sm ">លំនៅដ្ឋានបច្ចុប្បន្ន:</strong></div>
           <div class="flex items-center space-x-2 text-sm px-4 pt-2 py-4">
            
              <p>
                ភូមិ<span class="text-blue-500">{{ student?.currentResidence.village }}</span>,ឃុំ/សង្កាត់<span class="text-blue-500">{{ student?.currentResidence.commune }}</span>,
                ស្រុក/ខាន់<span class="text-blue-500">{{ student?.currentResidence.district }}</span>,ខេត្ត/ក្រុង<span class="text-blue-500">{{ student?.currentResidence.province }}</span>
              </p>
          </div>

              <!-- <h3 class="text-lg font-semibold text-gray-800 mt-6 mb-4 ">ពត៌មានលំអិតរបស់អាណាព្យាបាល</h3> -->
         
             <!-- <div class="flex items-center space-x-2 text-sm p-4">
            <strong class="text-gray-500 text-sm ">លំនៅដ្ឋានបច្ចុប្បន្ន:</strong>
              <p>
                ភូមិ<span class="text-blue-500">{{ student?.placeOfBirth.village }}</span>,ឃុំ/សង្កាត់<span class="text-blue-500">{{ student?.placeOfBirth.commune }}</span>,
                ស្រុក/ខាន់<span class="text-blue-500">{{ student?.placeOfBirth.district }}</span>,ខេត្ត/ក្រុង<span class="text-blue-500">{{ student?.placeOfBirth.province }}</span>
              </p>
          </div> -->

          <!-- <div class="grid grid-cols-1 sm:grid-cols-1 gap-4 px-4 py-3 text-sm"> -->
        
              <!-- <div class="flex items-center space-x-2"><strong class="text-gray-500">ឪពុកឈ្មោះ:</strong><p>{{ student?.family.motherFacebook }}</p></div > -->
              <!-- <div class="flex items-center space-x-2"><strong class="text-gray-500">មុខរបរ</strong><p>{{ student?.family.fatherOccupation }}</p></div >
              <div class="flex items-center space-x-2"><strong class="text-gray-500">លេខទំនាក់ទំនង</strong><p>{{ student?.family.fatherNumber }}</p></div > -->
              
          <!-- </div> -->
             <!-- <div class="flex items-center space-x-2 text-sm p-4">
            <strong class="text-gray-500 text-sm ">លំនៅដ្ឋានបច្ចុប្បន្ន:</strong>
              <p>
                ភូមិ<span class="text-blue-500">{{ student?.placeOfBirth.village }}</span>,ឃុំ/សង្កាត់<span class="text-blue-500">{{ student?.placeOfBirth.commune }}</span>,
                ស្រុក/ខាន់<span class="text-blue-500">{{ student?.placeOfBirth.district }}</span>,ខេត្ត/ក្រុង<span class="text-blue-500">{{ student?.placeOfBirth.province }}</span>
              </p>
          </div> -->


      </div>
       <div class="mt-6 border-t pt-2"></div>
      <div class="mt-8 flex justify-end">
        <button @click="$emit('close')" class="bg-gray-200 text-gray-700 font-semibold px-6 py-2 rounded-lg hover:bg-gray-300">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: Boolean,
  student: Object,
});
import { ref } from 'vue';

const avatar = ref('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4cXH1syfrG2BHeN176taDZCnbb5AiP5Y9sw&s')


defineEmits(['close']);
</script>
