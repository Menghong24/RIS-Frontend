<template>
  <div class="p-2 ">
    <div class="max-w-7xl mx-auto space-y-6">
      
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold text-blue-900 font-khmer">ការគ្រប់គ្រងការបង់ប្រាក់ (Finance)</h1>
          <p class="text-gray-500 text-sm mt-1">
            <span v-if="currentView === 'classes'">សូមជ្រើសរើសថ្នាក់រៀនដើម្បីគ្រប់គ្រងការបង់ប្រាក់</span>
            <span v-else>គ្រប់គ្រងការបង់ប្រាក់សម្រាប់ថ្នាក់៖ <strong class="text-blue-600">{{ selectedClass?.className }}</strong></span>
          </p>
        </div>
        
        <button 
          v-if="currentView === 'students'" 
          @click="backToClasses"
          class="w-full md:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-bold font-khmer transition shadow-sm"
        >
          ← ត្រឡប់ទៅថ្នាក់រៀនវិញ
        </button>
      </div>

      <div v-if="currentView === 'students'" class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        
        <div class="flex flex-wrap items-center gap-3 flex-1">
          <div class="relative">
            <span class="absolute left-3 top-2 text-xs text-gray-400 font-bold">MONTH</span>
            <input 
              type="month" 
              v-model="filters.month" 
              class="pt-5 pb-1 pl-3 pr-3 border border-gray-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 h-12"
            />
          </div>

          <select 
            v-model="filters.status" 
            class="h-12 border border-gray-300 rounded-lg px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 font-khmer font-medium min-w-[140px]"
          >
            <option value="All">ស្ថានភាពទាំងអស់</option>
            <option value="paid">បានបង់ប្រាក់</option>
            <option value="unpaid">មិនទាន់បង់</option>
            <option value="late">យឺតយ៉ាវ</option>
          </select>

          <div class="relative flex-1 min-w-[240px]">
            <span class="absolute left-3 top-3.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </span>
            <input 
              type="text" 
              v-model="filters.searchQuery" 
              placeholder="ស្វែងរកឈ្មោះសិស្ស..." 
              class="h-12 w-full pl-10 pr-4 border border-gray-300 rounded-lg text-sm font-khmer focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div class="bg-green-50 border border-green-200 px-5 py-2 rounded-xl flex flex-col justify-center min-w-[180px] text-right shadow-sm lg:h-12">
          <div class="text-[10px] text-green-600 font-bold uppercase tracking-wider leading-none mb-1">លុយប្រមូលបានសរុប</div>
          <div class="text-xl font-black text-green-700 leading-none">${{ totalCollectedThisMonth }}</div>
        </div>
      </div>

      <div v-if="currentView === 'classes'" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div 
          v-for="c in classes" 
          :key="c._id"
          @click="selectClass(c)"
          class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer group relative overflow-hidden"
        >
          <div class="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
          <h3 class="text-lg font-bold text-gray-900 font-khmer mb-1 group-hover:text-blue-600 transition-colors">
            {{ c.className }}
          </h3>
          <p class="text-xs text-gray-500 font-semibold uppercase mb-3">Grade: {{ c.classGrade }}</p>
          
          <div class="flex items-center gap-2 mb-4 text-sm text-gray-600 font-khmer">
            <span class="text-gray-400">👨‍🏫 គ្រូបង្គោល:</span>
            <span class="font-medium text-gray-800">{{ c.teacher?.khmerName || c.teacherName || 'មិនទាន់មាន' }}</span>
          </div>

          <div class="mt-2 flex justify-between items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
            <span class="font-khmer">សិស្សសរុប:</span>
            <span class="font-bold text-blue-600">{{ c.students?.length || 0 }} នាក់</span>
          </div>
        </div>
      </div>

      <div v-if="currentView === 'students'" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div v-if="loading" class="p-12 text-center">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <span class="text-gray-500 font-khmer">កំពុងទាញយកទិន្នន័យ...</span>
        </div>
        
        <div v-else>
          <table class="min-w-full divide-y divide-gray-100">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ព័ត៌មានសិស្ស</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-44">ថ្លៃសិក្សា ($)</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-44">សេវាបន្ថែម ($)</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ស្ថានភាពបង់ប្រាក់</th>
                <th class="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 bg-white">
              <tr v-for="row in paginatedList" :key="row.uniqueKey" class="hover:bg-blue-50/50 transition-colors duration-150">
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

                <td class="px-6 py-4">
                  <input 
                    type="number" 
                    v-model.number="row.inputAmount"
                    :disabled="!row.isVirtual"
                    class="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                    placeholder="0.00"
                  />
                </td>

                <td class="px-6 py-4">
                  <input 
                    type="number" 
                    v-model.number="row.inputExtraFee"
                    :disabled="!row.isVirtual"
                    class="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                    placeholder="0.00"
                  />
                </td>

                <td class="px-6 py-4">
                  <span :class="getStatusClass(row.status)" class="px-2.5 py-1 text-xs font-bold rounded-full capitalize inline-flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {{ row.status === 'paid' ? 'បានបង់ប្រាក់' : row.status === 'late' ? 'យឺតយ៉ាវ' : 'មិនទាន់បង់' }}
                  </span>
                  <div v-if="row.status === 'paid' && row.payDate" class="text-[10px] text-gray-400 mt-1 pl-1">
                     {{ formatDate(row.payDate) }}
                  </div>
                </td>

                <td class="px-6 py-4 text-right">
                  <button 
                    v-if="row.isVirtual" 
                    @click="handleOneClickPay(row)" 
                    class="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-bold transition shadow-sm font-khmer flex items-center gap-1 ml-auto"
                  >
                    ✓ 1-Click Pay
                  </button>

                  <div v-else class="flex items-center justify-end gap-3">
                     <span class="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded font-khmer">រួចរាល់</span>
                     <button @click="handleDelete(row)" class="text-red-500 hover:text-red-700 text-xs font-khmer">លុប</button>
                  </div>
                </td>
              </tr>

              <tr v-if="paginatedList.length === 0">
                 <td colspan="5" class="px-6 py-12 text-center text-gray-400 font-khmer">
                    មិនមានទិន្នន័យសិស្សឡើយ។
                 </td>
              </tr>
            </tbody>
          </table>

          <div class="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-2 text-sm text-gray-600 font-khmer">
              <span>បង្ហាញ</span>
              <select 
                v-model="perPage" 
                @change="currentPage = 1"
                class="border border-gray-300 rounded px-2 py-1 bg-white font-semibold outline-none focus:ring-1 focus:ring-blue-500 text-sm cursor-pointer"
              >
                <option :value="5">5</option>
                <option :value="10">10</option>
                <option :value="20">20</option>
              </select>
              <span>ជួរ ក្នុងចំណោមសិស្សសរុប {{ processedList.length }} នាក់</span>
            </div>

            <div class="flex items-center gap-2 font-khmer">
              <button 
                @click="prevPage" 
                :disabled="currentPage === 1"
                class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                មុន
              </button>
              
              <span class="text-sm text-gray-700 font-semibold mx-1">
                ទំព័រ {{ currentPage }} នៃ {{ totalPages }}
              </span>

              <button 
                @click="nextPage" 
                :disabled="currentPage === totalPages"
                class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                បន្ទាប់
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>

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
import DeleteConfirmationModal from "../components/shared/DeleteConfirmationModal.vue";

const toast = useToast();

const { data: payments, fetchData: refreshPayments, loading } = useQuery("payments");
const { data: classes } = useQuery("classes");
const { createDoc, deleteDoc } = useCollection("payments");

const currentView = ref("classes");
const selectedClass = ref(null);

const filters = reactive({
  month: new Date().toISOString().slice(0, 7), // Format YYYY-MM
  searchQuery: "",
  status: "All" 
});

const showDeleteModal = ref(false);
const paymentToDelete = ref(null);

const currentPage = ref(1);
const perPage = ref(5);

watch(filters, () => {
  currentPage.value = 1;
});

const selectClass = (cls) => {
  selectedClass.value = cls;
  currentView.value = "students";
  filters.searchQuery = "";
  filters.status = "All"; 
  currentPage.value = 1; 
};

const backToClasses = () => {
  currentView.value = "classes";
  selectedClass.value = null;
};

// ⚡ គណនាលុយសរុបប្រចាំខែ (យោងតាម Schema ថ្មីប្រើ field `payDate` និង `amount`)
const totalCollectedThisMonth = computed(() => {
  if (!selectedClass.value || !payments.value) return 0;
  const targetMonth = filters.month; // YYYY-MM
  const classId = selectedClass.value._id;

  return payments.value
    .filter(p => 
      (p.class?._id || p.class) === classId && 
      p.payDate && p.payDate.slice(0, 7) === targetMonth && 
      p.status === 'paid'
    )
    .reduce((sum, p) => sum + (p.amount || 0), 0);
});

// ⚡ Logic ផ្គូផ្គង និង Filter សិស្សឱ្យត្រូវនឹង Schema ថ្មី
const processedList = computed(() => {
  if (!selectedClass.value || !payments.value) return [];
  const targetMonth = filters.month;
  let classStudents = Array.isArray(selectedClass.value.students) ? selectedClass.value.students : [];

  // 1. Filter តាមការស្វែងរកឈ្មោះ
  if (filters.searchQuery.trim() !== "") {
    const query = filters.searchQuery.toLowerCase().trim();
    classStudents = classStudents.filter(s => 
      (s.khmerName && s.khmerName.toLowerCase().includes(query)) || 
      (s.englishName && s.englishName.toLowerCase().includes(query))
    );
  }

  // 2. ផ្គូផ្គងសិស្សជាមួយ Payment (`payDate` ជំនួស `startDate`)
  let mappedList = classStudents.map(student => {
    const existingPayment = payments.value.find(p => 
      (p.student?._id || p.student) === student._id && 
      p.payDate && p.payDate.slice(0, 7) === targetMonth && 
      (p.class?._id || p.class) === selectedClass.value._id
    );

    if (existingPayment) {
      return { 
        ...existingPayment, 
        uniqueKey: existingPayment._id,
        isVirtual: false,
        inputAmount: existingPayment.tuitionFee || 0,
        inputExtraFee: existingPayment.extraFee || 0 
      };
    }

    return {
      uniqueKey: `virtual_${student._id}`,
      student, 
      status: 'unpaid',
      isVirtual: true,
      inputAmount: 0,      
      inputExtraFee: 0     
    };
  });

  // 3. Filter តាមស្ថានភាព (All / paid / unpaid / late)
  if (filters.status !== "All") {
    mappedList = mappedList.filter(row => row.status === filters.status);
  }

  return mappedList;
});

// Pagination Calculations
const totalPages = computed(() => {
  return Math.ceil(processedList.value.length / perPage.value) || 1;
});

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return processedList.value.slice(start, end);
});

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

// ⚡ មុខងារ 1-Click Pay កែសម្រួលឱ្យត្រូវនឹង Field របស់ Schema ថ្មី
const handleOneClickPay = async (row) => {
  if (row.inputAmount <= 0 && row.inputExtraFee <= 0) {
    toast.warning("សូមបំពេញចំនួនទឹកប្រាក់មុននឹងចុចបង់!");
    return;
  }

  // បង្កើតកាលបរិច្ឆេទសម្រាប់ថ្ងៃបច្ចុប្បន្ន (Format: YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];

  const payload = {
    student: row.student._id,        
    class: selectedClass.value._id,              
    teacher: selectedClass.value.teacher?._id || selectedClass.value.teacher || null,
    payDate: today, // ⚡ ប្រើ payDate ជំនួសអោយ startDate/endDate តាម Schema ថ្មី
    tuitionFee: row.inputAmount,
    extraFee: row.inputExtraFee,
    status: 'paid',
    remark: ''
  };

  try {
    await createDoc(payload);
    toast.success(`បានបង់ប្រាក់សម្រាប់សិស្ស ${row.student.khmerName} រួចរាល់!`);
    await refreshPayments();
  } catch (err) {
    console.error(err);
    toast.error("ការបង់ប្រាក់បានបរាជ័យ");
  }
};

const handleDelete = (payment) => {
  paymentToDelete.value = payment;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (paymentToDelete.value) {
    await deleteDoc(paymentToDelete.value._id);
    toast.success("បានលុបទិន្នន័យបង់ប្រាក់");
    await refreshPayments();
    showDeleteModal.value = false;
  }
};

// ⚡ បន្ថែមពណ៌សម្រាប់ស្ថានភាព 'late'
const getStatusClass = (status) => {
  if (status === 'paid') return 'bg-green-100 text-green-700';
  if (status === 'late') return 'bg-amber-100 text-amber-700';
  return 'bg-gray-100 text-gray-500';
};

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB') : '-';
</script>