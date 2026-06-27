<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-2"
    >
      <div
        class="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[86vh] overflow-y-auto border border-slate-100"
      >
        <!-- Header -->
        <div class="px-3 py-2 border-b border-slate-100 bg-slate-50 sticky top-0 z-10 flex items-center justify-between">
          <div>
            <h1 class="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <span class="h-6 w-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-[10px]">
                <i :class="isEditing ? 'fa-solid fa-user-pen' : 'fa-solid fa-user-plus'"></i>
              </span>
              {{ isEditing ? 'កែប្រែព័ត៌មានគ្រូ' : 'បញ្ចូលគ្រូបង្រៀនថ្មី' }}
            </h1>
            <p class="text-[10px] text-slate-500 mt-0.5">
              បំពេញព័ត៌មានគ្រូបង្រៀន
            </p>
          </div>

          <button
            type="button"
            @click="$emit('close')"
            class="h-6 w-6 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <i class="fa-solid fa-xmark text-xs"></i>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="p-2.5 space-y-2.5">

          <!-- Name Info -->
          <div class="bg-white border border-slate-200 p-2.5 rounded-lg">
            <div class="flex items-center gap-1.5 mb-2">
              <span class="h-5 w-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center text-[9px]">
                <i class="fa-solid fa-id-card"></i>
              </span>
              <h3 class="text-[11px] font-extrabold text-slate-800">
                ព័ត៌មានឈ្មោះគ្រូ
              </h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-2">
              <div>
                <label class="form-label">ឈ្មោះខ្មែរ <span class="text-red-500">*</span></label>
                <input
                  type="text"
                  v-model="form.khmerName"
                  class="form-input"
                  placeholder="ឈ្មោះខ្មែរ"
                  required
                />
              </div>

              <div>
                <label class="form-label">ឈ្មោះឡាតាំង <span class="text-red-500">*</span></label>
                <input
                  type="text"
                  v-model="form.englishName"
                  class="form-input"
                  placeholder="ឈ្មោះឡាតាំង"
                  required
                />
              </div>

              <div>
                <label class="form-label">សញ្ជាតិ <span class="text-red-500">*</span></label>
                <input
                  type="text"
                  v-model="form.nationality"
                  class="form-input"
                  placeholder="សញ្ជាតិ"
                  required
                />
              </div>

              <div>
                <label class="form-label">ភេទ <span class="text-red-500">*</span></label>
                <select
                  v-model="form.gender"
                  class="form-input"
                  required
                >
                  <option value="" disabled>ជ្រើសរើសភេទ</option>
                  <option value="ប្រុស">ប្រុស</option>
                  <option value="ស្រី">ស្រី</option>
                  <option value="other">ផ្សេងៗ</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Contact -->
          <div class="bg-white border border-slate-200 p-2.5 rounded-lg">
            <div class="flex items-center gap-1.5 mb-2">
              <span class="h-5 w-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center text-[9px]">
                <i class="fa-solid fa-address-book"></i>
              </span>
              <h3 class="text-[11px] font-extrabold text-slate-800">
                ថ្ងៃកំណើត និងទំនាក់ទំនង
              </h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <label class="form-label">ថ្ងៃខែឆ្នាំកំណើត <span class="text-red-500">*</span></label>
                <input
                  type="date"
                  v-model="form.dateOfBirth"
                  class="form-input"
                  required
                />
              </div>

              <div>
                <label class="form-label">លេខទូរស័ព្ទ <span class="text-red-500">*</span></label>
                <input
                  type="text"
                  v-model="form.phone"
                  class="form-input"
                  placeholder="លេខទូរស័ព្ទ"
                  required
                />
              </div>

              <div>
                <label class="form-label">Telegram</label>
                <input
                  type="text"
                  v-model="form.telegram"
                  class="form-input"
                  placeholder="Telegram"
                />
              </div>
            </div>
          </div>

          <!-- Address -->
          <div class="bg-white border border-slate-200 p-2.5 rounded-lg">
            <div class="flex items-center gap-1.5 mb-2">
              <span class="h-5 w-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center text-[9px]">
                <i class="fa-solid fa-location-dot"></i>
              </span>
              <h3 class="text-[11px] font-extrabold text-slate-800">
                លំនៅដ្ឋានបច្ចុប្បន្ន
              </h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-2">
              <div>
                <label class="form-label">ភូមិ</label>
                <input
                  type="text"
                  v-model="form.currentResidence.village"
                  class="form-input"
                  placeholder="ភូមិ"
                />
              </div>

              <div>
                <label class="form-label">ឃុំ/សង្កាត់</label>
                <input
                  type="text"
                  v-model="form.currentResidence.commune"
                  class="form-input"
                  placeholder="ឃុំ/សង្កាត់"
                />
              </div>

              <div>
                <label class="form-label">ស្រុក/ខណ្ឌ</label>
                <input
                  type="text"
                  v-model="form.currentResidence.district"
                  class="form-input"
                  placeholder="ស្រុក/ខណ្ឌ"
                />
              </div>

              <div>
                <label class="form-label">ខេត្ត/ក្រុង</label>
                <input
                  type="text"
                  v-model="form.currentResidence.province"
                  class="form-input"
                  placeholder="ខេត្ត/ក្រុង"
                />
              </div>
            </div>
          </div>

          <!-- Skill -->
          <div class="bg-white border border-slate-200 p-2.5 rounded-lg">
            <div class="flex items-center gap-1.5 mb-2">
              <span class="h-5 w-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center text-[9px]">
                <i class="fa-solid fa-briefcase"></i>
              </span>
              <h3 class="text-[11px] font-extrabold text-slate-800">
                ជំនាញ និងព័ត៌មានផ្សេងៗ
              </h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
              <div>
                <label class="form-label">ជំនាញឯកទេស <span class="text-red-500">*</span></label>
                <input
                  type="text"
                  v-model="form.skill"
                  class="form-input"
                  placeholder="ជំនាញឯកទេស"
                  required
                />
              </div>

              <div>
                <label class="form-label">អ៊ីមែល</label>
                <input
                  type="email"
                  v-model="form.email"
                  class="form-input"
                  placeholder="Email"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label class="form-label">Facebook</label>
                <input
                  type="text"
                  v-model="form.facebook"
                  class="form-input"
                  placeholder="Facebook"
                />
              </div>

              <div>
                <label class="form-label">កំណត់សម្គាល់</label>
                <input
                  type="text"
                  v-model="form.note"
                  class="form-input"
                  placeholder="កំណត់សម្គាល់"
                />
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              @click="$emit('close')"
              class="px-3 py-1.5 text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              បោះបង់
            </button>

            <button
              type="submit"
              class="px-3.5 py-1.5 text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition flex items-center gap-1.5"
            >
              <i class="fa-solid fa-floppy-disk text-[10px]"></i>
              {{ isEditing ? 'រក្សាទុក' : 'បញ្ចូលគ្រូថ្មី' }}
            </button>
          </div>

        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  isEditing: Boolean,
  teacher: {
    type: Object,
    default: () => null
  },
});

const emit = defineEmits(['close', 'save']);

const defaultForm = {
  khmerName: '',
  englishName: '',
  gender: '',
  nationality: '',
  dateOfBirth: '',
  email: '',
  phone: '',
  skill: '',
  facebook: '',
  telegram: '',
  currentResidence: {
    village: '',
    commune: '',
    district: '',
    province: ''
  },
  note: ''
};

const form = ref(JSON.parse(JSON.stringify(defaultForm)));

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.isEditing && props.teacher) {
      const data = JSON.parse(JSON.stringify(props.teacher));

      if (!data.currentResidence) {
        data.currentResidence = { ...defaultForm.currentResidence };
      }

      form.value = data;
    } else {
      form.value = JSON.parse(JSON.stringify(defaultForm));
    }
  }
}, { immediate: true });

const handleSubmit = () => {
  emit('save', form.value);
};
</script>

<style scoped>
.form-label {
  display: block;
  font-size: 0.62rem;
  font-weight: 700;
  color: #475569;
  margin-bottom: 0.18rem;
}

.form-input {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 0.4rem;
  padding: 0.3rem 0.5rem;
  font-size: 0.7rem;
  color: #334155;
  background: #ffffff;
  outline: none;
  min-height: 1.95rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.12);
}
</style>