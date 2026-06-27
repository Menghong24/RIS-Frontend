<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-3"
  >
    <div
      class="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[88vh] overflow-y-auto border border-slate-100"
    >
      <!-- Header -->
      <div class="px-3 py-2.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div>
          <h2 class="text-base font-extrabold text-slate-800 flex items-center gap-2">
            <span class="h-7 w-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs">
              <i :class="isEditing ? 'fa-solid fa-user-pen' : 'fa-solid fa-user-plus'"></i>
            </span>
            {{ isEditing ? "កែប្រែទិន្នន័យសិស្ស" : "បញ្ចូលសិស្សថ្មី" }}
          </h2>
          <p class="text-[11px] text-slate-500 mt-0.5">
            សូមបំពេញព័ត៌មានសិស្ស និងព័ត៌មានអាណាព្យាបាល
          </p>
        </div>

        <button
          type="button"
          @click="$emit('close')"
          class="h-7 w-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <i class="fa-solid fa-xmark text-sm"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-3 space-y-3">

        <!-- Student Info -->
        <div class="bg-white border border-slate-200 p-3 rounded-xl">
          <div class="flex items-center gap-2 mb-2">
            <span class="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[10px]">
              <i class="fa-solid fa-id-card"></i>
            </span>
            <h3 class="text-xs font-extrabold text-slate-800">
              ព័ត៌មានសិស្ស
            </h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">
                ឈ្មោះខ្មែរ <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                v-model="form.khmerName"
                placeholder="ឈ្មោះខ្មែរ"
                class="form-input"
                required
              />
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">
                ឈ្មោះឡាតាំង <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                v-model="form.englishName"
                placeholder="ឈ្មោះឡាតាំង"
                class="form-input"
                required
              />
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">
                អត្តលេខ <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                v-model="form.studentId"
                placeholder="អត្តលេខ"
                class="form-input"
                required
              />
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">
                សញ្ជាតិ <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                v-model="form.nationality.student"
                placeholder="សញ្ជាតិ"
                class="form-input"
                required
              />
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">
                ភេទ <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.gender"
                class="form-input"
                required
              >
                <option disabled value="">ជ្រើសរើសភេទ</option>
                <option value="ស្រី">ស្រី</option>
                <option value="ប្រុស">ប្រុស</option>
                <option value="Other">ផ្សេងៗ</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Date & Address -->
        <div class="bg-white border border-slate-200 p-3 rounded-xl">
          <div class="flex items-center gap-2 mb-2">
            <span class="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[10px]">
              <i class="fa-solid fa-location-dot"></i>
            </span>
            <h3 class="text-xs font-extrabold text-slate-800">
              ថ្ងៃខែឆ្នាំកំណើត និងទីលំនៅបច្ចុប្បន្ន
            </h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">
                ថ្ងៃកំណើត <span class="text-red-500">*</span>
              </label>
              <input
                type="date"
                v-model="form.dob"
                class="form-input"
                required
              />
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">
                ភូមិ
              </label>
              <input
                type="text"
                v-model="form.currentResidence.village"
                placeholder="ភូមិ"
                class="form-input"
                required
              />
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">
                ឃុំ/សង្កាត់
              </label>
              <input
                type="text"
                v-model="form.currentResidence.commune"
                placeholder="ឃុំ/សង្កាត់"
                class="form-input"
                required
              />
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">
                ស្រុក/ខណ្ឌ
              </label>
              <input
                type="text"
                v-model="form.currentResidence.district"
                placeholder="ស្រុក/ខណ្ឌ"
                class="form-input"
                required
              />
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">
                ខេត្ត/ក្រុង
              </label>
              <input
                type="text"
                v-model="form.currentResidence.province"
                placeholder="ខេត្ត/ក្រុង"
                class="form-input"
                required
              />
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">
                ថ្ងៃចូលរៀន <span class="text-red-500">*</span>
              </label>
              <input
                type="date"
                v-model="form.joinDate"
                class="form-input"
                required
              />
            </div>
          </div>
        </div>

        <!-- Guardian Info -->
        <div class="bg-white border border-slate-200 p-3 rounded-xl">
          <div class="flex items-center gap-2 mb-2">
            <span class="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[10px]">
              <i class="fa-solid fa-user-shield"></i>
            </span>
            <h3 class="text-xs font-extrabold text-slate-800">
              ព័ត៌មានអាណាព្យាបាល
            </h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">
                ឈ្មោះអាណាព្យាបាល
              </label>
              <input
                type="text"
                v-model="form.family.motherName"
                placeholder="ឈ្មោះអាណាព្យាបាល"
                class="form-input"
              />
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">
                លេខទូរស័ព្ទ
              </label>
              <input
                type="text"
                v-model="form.family.motherNumber"
                placeholder="លេខទូរស័ព្ទ"
                class="form-input"
              />
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">
                Facebook
              </label>
              <input
                type="text"
                v-model="form.family.motherFacebook"
                placeholder="Facebook Account"
                class="form-input"
              />
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="pt-3 flex justify-end gap-2 border-t border-slate-100">
          <button
            type="button"
            @click="$emit('close')"
            class="px-3.5 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            បោះបង់
          </button>

          <button
            type="submit"
            :disabled="students.loading.value"
            class="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <i
              v-if="students.loading.value"
              class="fa-solid fa-circle-notch fa-spin"
            ></i>
            <i
              v-else
              class="fa-solid fa-floppy-disk"
            ></i>
            {{ students.loading.value ? 'កំពុងរក្សាទុក...' : (isEditing ? "រក្សាទុកការកែប្រែ" : "បញ្ចូលសិស្សថ្មី") }}
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
  dob: "",
  gender: "",
  joinDate: "",
  grade: "",
  nationality: { student: "ខ្មែរ" },
  placeOfBirth: { village: "", commune: "", district: "", province: "" },
  currentResidence: { village: "", commune: "", district: "", province: "" },
  family: {
    motherName: "",
    motherNumber: "",
    motherFacebook: "",
  },
  status: "active",
};

const form = ref(JSON.parse(JSON.stringify(initialFormState)));

watch(
  () => props.student,
  (newStudent) => {
    if (newStudent) {
      const mergedData = {
        ...JSON.parse(JSON.stringify(initialFormState)),
        ...JSON.parse(JSON.stringify(newStudent)),
      };

      if (mergedData.birthDate) {
        const dateObj = new Date(mergedData.birthDate);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");

        mergedData.dob = `${year}-${month}-${day}`;
      } else {
        mergedData.dob = "";
      }

      if (mergedData.joinDate) {
        const dateObj = new Date(mergedData.joinDate);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");

        mergedData.joinDate = `${year}-${month}-${day}`;
      } else {
        mergedData.joinDate = "";
      }

      if (mergedData.grade && typeof mergedData.grade === "object") {
        mergedData.grade = mergedData.grade._id;
      }

      form.value = mergedData;
    } else {
      form.value = JSON.parse(JSON.stringify(initialFormState));
    }
  },
  { immediate: true, deep: true }
);

const handleSubmit = async () => {
  try {
    const payload = { ...form.value };

    if (payload.dob) {
      payload.birthDate = new Date(payload.dob);
    }

    if (payload.joinDate) {
      payload.joinDate = new Date(payload.joinDate);
    }

    delete payload.dob;

    if (!payload.grade) {
      delete payload.grade;
    }

    emit("save", payload);
  } catch (err) {
    console.error(err);
    toast.error(err.message || "មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ");
  }
};
</script>

<style scoped>
.form-input {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 0.45rem;
  padding: 0.38rem 0.6rem;
  font-size: 0.75rem;
  color: #334155;
  background: #ffffff;
  outline: none;
  transition: all 0.2s ease;
}

.form-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.12);
}
</style>