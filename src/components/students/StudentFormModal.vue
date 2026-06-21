<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  >
    <div
      class="bg-white/60 rounded-xl shadow-xl p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto"
    >
      <h2 class="text-2xl mb-4 font-bold text-center text-gray-800">
        {{ isEditing ? "កែប្រែទន្ន័យរបស់សិស្ស" : "បញ្ចូលសិស្សថ្មី" }}
      </h2>

      <hr class="mb-6" />

      <form @submit.prevent="handleSubmit">
        <div class="space-y-5 bg-white/60 border border-gray-300 p-4 rounded-xl">
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >ឈ្មោះរបស់សិស្ស</label
            >
            <div class="grid grid-cols-1 sm:grid-cols-5 gap-5">
              <input
                type="text"
                v-model="form.khmerName"
                placeholder="ឈ្មោះ(ជាភាសាខ្មែរ)*"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <input
                type="text"
                v-model="form.englishName"
                placeholder="ឈ្មោះ(ជាភាសាឡាតាំង)*"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <input
                type="text"
                v-model="form.studentId"
                placeholder="អត្តលេខ *"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <input
                type="text"
                v-model="form.nationality.student"
                placeholder="សញ្ជាតិ *"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <select
                v-model="form.gender"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option disabled value="">ភេទ *</option>
                <option value="ស្រី">ស្រី</option>
                <option value="ប្រុស">ប្រុស</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >ថ្ងៃខែឆ្នាំកំណើត (ទីលំនៅបច្ចុប្បន្ន)</label
            >
            <div class="grid grid-cols-1 sm:grid-cols-5 gap-5">
              
              <input
                type="date"
                v-model="form.dob"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />

         
              <input
                type="text"
                v-model="form.currentResidence.village"
                placeholder="ភូមិបច្ចុប្បន្ន"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <input
                type="text"
                v-model="form.currentResidence.commune"
                placeholder="ឃុំ/សង្កាត់បច្ចុប្បន្ន"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <input
                type="text"
                v-model="form.currentResidence.district"
                placeholder="ស្រុកបច្ចុប្បន្ន"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <input
                type="text"
                v-model="form.currentResidence.province"
                placeholder="ខេត្តបច្ចុប្បន្ន"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
              
              <input
                type="text"
                v-model="form.phone"
                placeholder="ថ្ងៃ/ខែ/ឆ្នាំចូលរៀន"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >ពត៌មានអាណាព្យាបាល (Mother/Guardian)</label
            >
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <input
                type="text"
                v-model="form.family.motherName"
                placeholder="ឈ្មោះអាណាព្យាបាល"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                
              />
              <input
                type="text"
                v-model="form.family.motherNumber"
                placeholder="លេខទូរស័ព្ទអាណាព្យាបាល"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                v-model="form.family.motherFacebook"
                placeholder="Facebook Account"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                
              />
            </div>
          </div>

        </div>

        <div class="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            @click="$emit('close')"
            class="bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            ថយក្រោយ
          </button>
          <button
            type="submit"
            :disabled="students.loading.value"
            class="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ students.loading.value ? 'Loading...' : (isEditing ? "រក្សាទុក" : "បញ្ចូលសិស្សថ្មី") }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useCollection } from "../../hooks/useCollection";
import { useQuery } from "../../hooks/useQuery"; 
import { useToast } from "vue-toastification";

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  isEditing: { type: Boolean, default: false },
  student: { type: Object, default: null },
});

const emit = defineEmits(["close", "save"]);
const students = useCollection("students");
const classesList = useQuery("classes"); 
const toast = useToast();

const initialFormState = {
  khmerName: "",
  englishName: "",
  studentId: "",
  dob: "", // Used for input, mapped to birthDate on submit
  gender: "",
  // email: "", // Removed (Not in model)
  phone: "",
  grade: "", 
  nationality: { student: "ខ្មែរ" }, // Added default
  placeOfBirth: { village: "", commune: "", district: "", province: "" },
  currentResidence: { village: "", commune: "", district: "", province: "" },
  family: {
    motherName: "",
    motherNumber: "",
    motherFacebook: "", // Renamed to match model
  },
  status: "active",
};

const form = ref({ ...initialFormState });

// Watcher to handle filling data when editing
watch(
  () => props.student,
  (newStudent) => {
    if (newStudent) {
      // 1. Merge with initialFormState to ensure structure exists
      const mergedData = { 
        ...JSON.parse(JSON.stringify(initialFormState)), 
        ...JSON.parse(JSON.stringify(newStudent)) 
      };

      // 2. Format Date (YYYY-MM-DD) for input field
      const rawDate = mergedData.birthDate || mergedData.dob ;
      if (rawDate) {
         const dateObj = new Date(rawDate);
         const year = dateObj.getFullYear();
         const month = String(dateObj.getMonth() + 1).padStart(2, '0');
         const day = String(dateObj.getDate()).padStart(2, '0');
         mergedData.dob = `${year}-${month}-${day}`;
      } else {
         mergedData.dob = "";
      }
      
      // 3. Handle Grade ID population (if populated object is returned)
      if (mergedData.grade && typeof mergedData.grade === 'object') {
        mergedData.grade = mergedData.grade._id;
      }

      form.value = mergedData;
    } else {
      // Reset to clean state
      form.value = JSON.parse(JSON.stringify(initialFormState));
    }
  },
  { immediate: true, deep: true }
);

const handleSubmit = async () => {
  try {
    const payload = { ...form.value };
    
    // 1. Map 'dob' back to 'birthDate' for the backend
    if (payload.dob) {
      payload.birthDate = payload.dob;
      // delete payload.dob; // Optional: keep it or remove it, Mongoose will ignore fields not in schema
    }

    // 2. Only send Class ID if one is selected
    if (!payload.grade) delete payload.grade;

    emit("save", payload);
  } catch (err) {
    console.error(err);
    toast.error(err.message || "Something went wrong");
  }
};
</script>