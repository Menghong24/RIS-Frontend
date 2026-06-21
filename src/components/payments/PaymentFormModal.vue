<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" @click="closeModal"></div>

      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div class="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 class="text-xl font-bold text-gray-800 font-khmer">
              {{ isEditing ? 'កែប្រែការបង់ប្រាក់ (Edit)' : 'បង់ប្រាក់ថ្មី (New)' }}
            </h3>
            <p class="text-sm text-gray-500 mt-1">
              {{ isEditing ? 'Update existing record' : 'Create a new payment record' }}
            </p>
          </div>
          <button @click="closeModal" class="p-2 bg-white rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 transition shadow-sm border border-gray-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div class="p-6 overflow-y-auto custom-scrollbar">
          <form @submit.prevent="handleSubmit" id="paymentForm" class="space-y-6">
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Class Name</label>
                <div class="relative">
                  <select 
                    v-model="form.class" 
                    @change="onClassChange"
                    required 
                    class="w-full border border-gray-300 rounded-lg pl-3 pr-8 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                  >
                    <option value="" disabled>Select Class</option>
                    <option v-for="c in classes" :key="c._id" :value="c._id">
                      {{ c.className }}
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Student</label>
                <div class="relative">
                  <select 
                    v-model="form.student" 
                    :disabled="!form.class || availableStudents.length === 0" 
                    required 
                    class="w-full border border-gray-300 rounded-lg pl-3 pr-8 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition disabled:bg-gray-50 disabled:text-gray-400"
                  >
                    <option value="" disabled>
                      {{ availableStudents.length === 0 && form.class ? 'No Students in Class' : 'Select Student' }}
                    </option>
                    <option v-for="s in availableStudents" :key="s._id" :value="s._id">
                      {{ s.khmerName }} - {{ s.englishName }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <hr class="border-gray-100">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Start Date</label>
                <input 
                  type="date" 
                  v-model="form.startDate" 
                  @change="autoFillEndDate"
                  required 
                  class="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                >
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">End Date</label>
                <input 
                  type="date" 
                  v-model="form.endDate" 
                  required 
                  class="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                >
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Amount ($)</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                  <input 
                    type="number" 
                    v-model.number="form.amount" 
                    min="0" 
                    step="0.01" 
                    required 
                    class="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="0.00"
                  >
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
                <select 
                  v-model="form.status" 
                  @change="handleStatusChange"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  :class="{
                    'text-green-600 bg-green-50 font-medium': form.status === 'paid',
                    'text-red-600 bg-red-50 font-medium': form.status === 'late',
                    'text-gray-600': form.status === 'unpaid'
                  }"
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                  <option value="late">Late</option>
                </select>
              </div>
            </div>

            <Transition name="fade">
              <div v-if="form.status === 'paid'" class="bg-green-50 p-4 rounded-lg border border-green-100">
                <label class="block text-sm font-semibold text-green-800 mb-1.5">Payment Date</label>
                <input 
                  type="date" 
                  v-model="form.payDate" 
                  required
                  class="w-full border border-green-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-green-500 outline-none bg-white"
                >
              </div>
            </Transition>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Remark</label>
              <textarea 
                v-model="form.remark" 
                rows="2" 
                class="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Optional notes..."
              ></textarea>
            </div>
          </form>
        </div>

        <div class="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button 
            type="button" 
            @click="closeModal" 
            class="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="paymentForm"
            class="px-6 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium shadow-md transition"
          >
            {{ isEditing ? 'Update Payment' : 'Create Payment' }}
          </button>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup>
import { reactive, watch, nextTick, computed } from "vue";

const props = defineProps({
  isOpen: Boolean,
  isEditing: Boolean,
  paymentData: Object,
  classes: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['close', 'save']);

// --- State ---
const form = reactive({
  class: "",
  student: "",
  startDate: "",
  endDate: "",
  amount: 0,
  status: "unpaid",
  payDate: "",
  remark: ""
});

// --- Computed ---
// Automatically derives students from the selected Class ID
const availableStudents = computed(() => {
  if (!form.class) return [];
  const selectedClass = props.classes.find(c => String(c._id) === String(form.class));
  return selectedClass?.students || [];
});

// --- Logic ---

const onClassChange = () => {
  // When class changes manually, we must reset the student
  form.student = ""; 
};

const autoFillEndDate = () => {
  if (form.startDate && !form.endDate) {
    const date = new Date(form.startDate);
    // Set to last day of that month
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    form.endDate = formatDate(lastDay);
  }
};

const handleStatusChange = () => {
  if (form.status === 'paid' && !form.payDate) {
    form.payDate = formatDate(new Date());
  } else if (form.status === 'unpaid') {
    form.payDate = "";
  }
};

const closeModal = () => {
  emit('close');
};

const handleSubmit = () => {
  const payload = { ...form };
  // Clean up data before sending
  if (payload.status !== 'paid') {
    payload.payDate = null;
  }
  emit('save', payload);
};

// --- Helpers ---
// Use 'en-CA' for YYYY-MM-DD format based on LOCAL time (not UTC)
const formatDate = (val) => {
  if (!val) return "";
  const d = new Date(val);
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString('en-CA');
};

// --- Initialization Logic ---

const resetForm = () => {
  const today = new Date();
  // Default: Start of current month
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  
  Object.assign(form, {
    class: "",
    student: "",
    startDate: formatDate(firstDay),
    endDate: "",
    amount: 0,
    status: "unpaid",
    payDate: "",
    remark: ""
  });
  
  // Trigger auto-fill for end date based on the default start date
  autoFillEndDate();
};

const populateForm = async (data) => {
  // Extract IDs safely
  const classId = (typeof data.class === 'object' && data.class) ? data.class._id : data.class;
  const studentId = (typeof data.student === 'object' && data.student) ? data.student._id : data.student;

  // 1. Set Class (Triggering computed availableStudents)
  form.class = classId || "";

  // 2. Wait for Vue to update DOM/Reactivity for the Select options
  await nextTick();

  // 3. Set the rest
  Object.assign(form, {
    student: studentId || "", 
    startDate: formatDate(data.startDate),
    endDate: formatDate(data.endDate),
    amount: data.amount || 0,
    status: data.status || "unpaid",
    payDate: formatDate(data.payDate),
    remark: data.remark || ""
  });
};

// --- Watcher ---
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    if (props.paymentData) {
      await populateForm(props.paymentData);
    } else {
      resetForm();
    }
  }
});
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
</style>