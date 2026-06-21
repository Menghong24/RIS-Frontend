<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto space-y-6">
      
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold text-blue-900 font-khmer">ការគ្រប់គ្រងការបង់ប្រាក់ (Payments)</h1>
          <p class="text-gray-500 text-sm mt-1">Manage tuition fees and payment history</p>
        </div>
        
        <div class="flex gap-4 w-full md:w-auto">
          <div class="bg-white p-3 rounded-lg shadow-sm border border-green-100 flex-1 md:w-48">
              <div class="text-xs text-gray-500 font-semibold uppercase">Total Collected</div>
              <div class="text-xl font-bold text-green-600">${{ stats.totalCollected }}</div>
          </div>
          <div class="bg-white p-3 rounded-lg shadow-sm border border-orange-100 flex-1 md:w-48">
              <div class="text-xs text-gray-500 font-semibold uppercase">Unpaid Students</div>
              <div class="text-xl font-bold text-orange-600">{{ stats.unpaidCount }}</div>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-wrap gap-4 items-center justify-between">
        <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
          
          <div class="relative">
            <span class="absolute left-3 top-2 text-xs text-gray-400 font-bold">MONTH</span>
            <input 
              type="month" 
              v-model="filters.month" 
              class="pt-5 pb-1 pl-3 pr-3 border border-gray-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 h-12"
            />
          </div>

          <select v-model="filters.classId" class="h-12 border border-gray-300 rounded-lg px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-w-[150px]">
            <option value="">All Classes</option>
            <option v-for="c in classes" :key="c._id" :value="c._id">
              {{ c.className }}
            </option>
          </select>

          <select v-model="filters.status" class="h-12 border border-gray-300 rounded-lg px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="All">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="late">Late</option>
          </select>
        </div>

        <button 
          @click="openCreateModal" 
          class="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center shadow-md font-khmer font-bold"
        >
          <span class="mr-2 text-xl">+</span> បង់ប្រាក់ថ្មី
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div v-if="loading" class="p-12 text-center">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <span class="text-gray-500">Loading payment data...</span>
        </div>
        
        <div v-else>
          <table class="min-w-full divide-y divide-gray-100">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Student Info</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Class</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Payment Period</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 bg-white">
              <tr 
                v-for="row in paginatedList" 
                :key="row.uniqueKey" 
                class="hover:bg-blue-50/50 transition-colors duration-150 group"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold mr-3 border border-blue-100 shadow-sm">
                        {{ row.student?.englishName?.charAt(0) || '?' }}
                    </div>
                    <div>
                      <div class="text-sm font-bold text-gray-900 font-khmer">{{ row.student?.khmerName }}</div>
                      <div class="text-xs text-gray-500">{{ row.student?.englishName }}</div>
                    </div>
                  </div>
                </td>

                <td class="px-6 py-4 text-sm text-gray-600">
                  <span class="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                    {{ row.className }}
                  </span>
                </td>

                <td class="px-6 py-4">
                   <div v-if="!row.isVirtual" class="flex flex-col text-sm">
                     <span class="font-medium text-gray-700">{{ formatDate(row.startDate) }}</span>
                     <span class="text-xs text-gray-400">to {{ formatDate(row.endDate) }}</span>
                   </div>
                   <div v-else class="text-sm text-gray-400 italic">
                     Not paid for {{ formatMonth(filters.month) }}
                   </div>
                </td>

                <td class="px-6 py-4">
                  <div class="text-sm font-bold" :class="row.amount > 0 ? 'text-gray-900' : 'text-gray-400'">
                    ${{ row.amount }}
                  </div>
                </td>

                <td class="px-6 py-4">
                  <span 
                    :class="getStatusClass(row.status)" 
                    class="px-2.5 py-1 text-xs font-bold rounded-full capitalize inline-flex items-center gap-1"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {{ row.status }}
                  </span>
                  <div v-if="row.status === 'paid' && row.payDate" class="text-[10px] text-gray-400 mt-1 pl-1">
                     {{ formatDate(row.payDate) }}
                  </div>
                </td>

                <td class="px-6 py-4 text-right">
                  <button 
                    v-if="row.isVirtual" 
                    @click="openCreateForStudent(row.student)" 
                    class="bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 hover:border-green-300 px-3 py-1.5 rounded-md text-sm font-bold transition shadow-sm"
                  >
                    Pay Now
                  </button>

                  <div v-else class="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button @click="openEditModal(row)" class="text-blue-600 hover:text-blue-800 font-medium text-sm">Edit</button>
                     <button @click="handleDelete(row)" class="text-red-500 hover:text-red-700 font-medium text-sm">Delete</button>
                  </div>
                </td>
              </tr>

              <tr v-if="processedList.length === 0">
                 <td colspan="6" class="px-6 py-12 text-center">
                   <div class="flex flex-col items-center justify-center text-gray-400">
                      <p>No payment records found.</p>
                   </div>
                 </td>
              </tr>
            </tbody>
          </table>

          <div v-if="processedList.length > 0" class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div class="text-sm text-gray-500">
              Showing <span class="font-bold">{{ startIndex + 1 }}</span> to <span class="font-bold">{{ endIndex }}</span> of <span class="font-bold">{{ processedList.length }}</span> results
            </div>
            <div class="flex items-center space-x-2">
              <button 
                @click="prevPage" 
                :disabled="currentPage === 1"
                class="px-3 py-1 rounded border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div class="px-3 py-1 bg-blue-600 text-white rounded text-sm font-bold">
                {{ currentPage }}
              </div>

              <button 
                @click="nextPage" 
                :disabled="currentPage >= totalPages"
                class="px-3 py-1 rounded border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <PaymentFormModal 
      v-if="showFormModal"
      :is-open="showFormModal"
      :is-editing="!isNewPayment" 
      :payment-data="selectedPaymentData"
      :classes="classes"
      @close="showFormModal = false"
      @save="onSavePayment"
    />

    <DeleteConfirmationModal 
      :is-open="showDeleteModal" 
      item-name="Payment Record" 
      @close="showDeleteModal = false" 
      @confirm="confirmDelete" 
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { useQuery } from "../hooks/useQuery";
import { useCollection } from "../hooks/useCollection";
import { useToast } from "vue-toastification";
import PaymentFormModal from "../components/payments/PaymentFormModal.vue";
import DeleteConfirmationModal from "../components/shared/DeleteConfirmationModal.vue";

const toast = useToast();

// --- Data Hooks ---
const { data: payments, fetchData: refreshPayments, loading } = useQuery("payments");
const { data: classes } = useQuery("classes");
const { createDoc, updateDoc, deleteDoc } = useCollection("payments");

// --- Filters State ---
const filters = reactive({
  month: new Date().toISOString().slice(0, 7), // YYYY-MM
  classId: "", 
  status: "All"
});

// --- Modal State ---
const showFormModal = ref(false);
const showDeleteModal = ref(false);
const isNewPayment = ref(true);
const selectedPaymentData = ref(null);
const paymentToDelete = ref(null);

// --- Pagination State ---
const currentPage = ref(1);
const itemsPerPage = 10;

// =========================================================
//  CORE LOGIC: Merging Class Students with Payments
// =========================================================

const processedList = computed(() => {
  if (!classes.value || !payments.value) return [];

  let results = [];
  const targetMonth = filters.month; 

  if (filters.classId) {
    const selectedClass = classes.value.find(c => c._id === filters.classId);
    const classStudents = (selectedClass && Array.isArray(selectedClass.students)) 
      ? selectedClass.students 
      : [];

    results = classStudents.map(student => {
      const existingPayment = payments.value.find(p => {
        const pStudentId = p.student?._id || p.student;
        const pDate = p.startDate ? p.startDate.slice(0, 7) : '';
        return pStudentId === student._id && pDate === targetMonth;
      });

      if (existingPayment) {
        return { 
          ...existingPayment, 
          uniqueKey: existingPayment._id,
          isVirtual: false,
          className: selectedClass.className 
        };
      }

      return {
        uniqueKey: `virtual_${student._id}`,
        student: student, 
        className: selectedClass.className,
        amount: 0,
        status: 'unpaid',
        isVirtual: true 
      };
    });

  } else {
    results = payments.value.filter(p => {
       const pDate = p.startDate ? p.startDate.slice(0, 7) : '';
       return pDate === targetMonth;
    }).map(p => ({
       ...p,
       uniqueKey: p._id,
       isVirtual: false,
       className: getClassName(p.class)
    }));
  }

  if (filters.status !== 'All') {
    results = results.filter(row => row.status === filters.status);
  }

  return results;
});

// --- Pagination Computed & Logic ---

// 1. Calculate the slice of data to show
const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return processedList.value.slice(start, end);
});

// 2. Calculate totals
const totalPages = computed(() => Math.ceil(processedList.value.length / itemsPerPage));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, processedList.value.length));

// 3. Navigation
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

// 4. Watcher: Reset to page 1 if filters change
watch(() => [filters.classId, filters.month, filters.status], () => {
  currentPage.value = 1;
});


// --- Stats ---
const stats = computed(() => {
  const list = processedList.value;
  const paid = list.filter(i => i.status === 'paid');
  const totalCollected = paid.reduce((sum, item) => sum + (item.amount || 0), 0);
  const unpaidCount = list.filter(i => i.status !== 'paid').length;
  return { totalCollected, unpaidCount };
});

// --- Actions ---

const openCreateModal = () => {
  isNewPayment.value = true;
  selectedPaymentData.value = {
    startDate: `${filters.month}-01`,
    class: filters.classId 
  };
  showFormModal.value = true;
};

const openCreateForStudent = (student) => {
  isNewPayment.value = true;
  const classId = filters.classId; 
  selectedPaymentData.value = {
    student: student._id,        
    class: classId,              
    startDate: `${filters.month}-01`,
    endDate: getLastDayOfMonth(filters.month),
    amount: 0,
    status: 'paid',              
    payDate: new Date().toISOString().split('T')[0]
  };
  showFormModal.value = true;
};

const openEditModal = (payment) => {
  isNewPayment.value = false;
  selectedPaymentData.value = { ...payment }; 
  showFormModal.value = true;
};

const onSavePayment = async (payload) => {
  try {
    if (isNewPayment.value) {
      await createDoc(payload);
      toast.success("Payment recorded successfully");
    } else {
      await updateDoc(selectedPaymentData.value._id, payload);
      toast.success("Payment updated successfully");
    }
    showFormModal.value = false;
    await refreshPayments();
  } catch (err) {
    console.error(err);
    toast.error("Failed to save payment");
  }
};

const handleDelete = (payment) => {
  paymentToDelete.value = payment;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (paymentToDelete.value) {
    await deleteDoc(paymentToDelete.value._id);
    toast.success("Payment deleted");
    await refreshPayments();
    showDeleteModal.value = false;
  }
};

// --- Helpers ---
const getClassName = (cls) => {
  if (!cls) return 'N/A';
  if (typeof cls === 'object' && cls.className) return cls.className;
  const found = classes.value?.find(c => c._id === cls);
  return found ? found.className : 'Unknown Class';
};

const getStatusClass = (status) => {
  switch(status) {
    case 'paid': return 'bg-green-100 text-green-700';
    case 'late': return 'bg-orange-100 text-orange-700';
    default: return 'bg-gray-100 text-gray-500';
  }
};

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB') : '-';

const formatMonth = (ym) => {
  if(!ym) return '';
  const [y, m] = ym.split('-');
  const date = new Date(y, m - 1);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};

const getLastDayOfMonth = (ym) => {
  const [y, m] = ym.split('-');
  const date = new Date(y, m, 0);
  return date.toISOString().slice(0, 10);
};
</script>