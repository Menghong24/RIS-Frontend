<template>
  <div class=" bg-slate-50 p-3 md:p-4 text-slate-800">
    <div class="max-w-7xl mx-auto space-y-4">
      <!-- Header -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm px-3 py-3 md:px-4">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div class="min-w-0">
            <h1 class="text-lg md:text-xl font-extrabold text-slate-800 flex items-center gap-2">
              <span class="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-sm shrink-0">
                <i class="fa-solid fa-money-bill-wave"></i>
              </span>

              <span class="truncate">
                ការគ្រប់គ្រងការបង់ប្រាក់
              </span>
            </h1>

            <p class="text-xs text-slate-500 mt-1 truncate">
              <span v-if="currentView === 'classes'">
                សូមជ្រើសរើសថ្នាក់រៀនដើម្បីគ្រប់គ្រងការបង់ប្រាក់
              </span>

              <span v-else>
                គ្រប់គ្រងការបង់ប្រាក់សម្រាប់ថ្នាក់៖
                <strong class="text-blue-600">{{ selectedClass?.className }}</strong>
              </span>
            </p>
          </div>

          <button
            v-if="currentView === 'students'"
            @click="backToClasses"
            class="w-full md:w-auto bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-2 rounded-lg text-xs font-bold transition shadow-sm flex items-center justify-center gap-2"
          >
            <i class="fa-solid fa-arrow-left text-[10px]"></i>
            ត្រឡប់ទៅថ្នាក់រៀនវិញ
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div
        v-if="currentView === 'students'"
        class="bg-white p-3 rounded-xl shadow-sm border border-slate-200"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[160px_160px_160px_1fr_auto] gap-2 items-end">
          <!-- Month -->
          <div>
            <label class="form-label">ខែបង់ប្រាក់</label>

            <input
              type="month"
              v-model="filters.month"
              class="form-input"
            />
          </div>

          <!-- Status -->
          <div>
            <label class="form-label">ស្ថានភាព</label>

            <select v-model="filters.status" class="form-input">
              <option value="All">ស្ថានភាពទាំងអស់</option>
              <option value="paid">បានបង់ប្រាក់</option>
              <option value="partial">បង់ខ្លះ</option>
              <option value="unpaid">មិនទាន់បង់</option>
              <option value="late">យឺតយ៉ាវ</option>
            </select>
          </div>

          <!-- Default Due Amount -->
          <div>
            <label class="form-label">តម្លៃត្រូវបង់លំនាំដើម</label>

            <input
              v-model.number="filters.defaultDueAmount"
              type="number"
              min="0"
              class="form-input text-right font-bold"
              placeholder="0"
            />
          </div>

          <!-- Search -->
          <div>
            <label class="form-label">ស្វែងរក</label>

            <div class="relative">
              <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs z-10">
                <i class="fa-solid fa-magnifying-glass"></i>
              </span>

              <input
                type="text"
                v-model="filters.searchQuery"
                placeholder="ស្វែងរកឈ្មោះ / អត្តលេខ..."
                class="form-input search-input"
              />
            </div>
          </div>

          <!-- Total -->
          <div class="bg-blue-50 border border-blue-100 px-3 py-2 rounded-lg flex flex-col justify-center min-w-[180px] shadow-sm h-[2.45rem]">
            <div class="text-[10px] text-blue-600 font-bold leading-none mb-1">
              លុយប្រមូលបានសរុប
            </div>

            <div class="text-base font-extrabold text-blue-700 leading-none">
              ៛{{ formatMoney(totalCollectedThisMonth) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Class Cards -->
      <div
        v-if="currentView === 'classes'"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3"
      >
        <div
          v-for="c in classesList"
          :key="c._id"
          @click="selectClass(c)"
          class="bg-white p-3 rounded-xl shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer group relative overflow-hidden"
        >
          <div class="absolute top-0 left-0 w-full h-1 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

          <div class="flex items-start justify-between gap-2 mb-2">
            <div class="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition shrink-0">
              <i class="fa-solid fa-school"></i>
            </div>

            <span class="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-600 rounded-full truncate max-w-[90px]">
              {{ c.classGrade || 'N/A' }}
            </span>
          </div>

          <h3 class="text-sm font-extrabold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors truncate">
            {{ c.className }}
          </h3>

          <div class="flex items-center gap-2 mb-2 text-[11px] text-slate-600">
            <span class="text-slate-400">
              <i class="fa-solid fa-chalkboard-user"></i>
            </span>

            <span class="font-medium text-slate-700 truncate">
              {{ c.teacher?.khmerName || c.teacherName || 'មិនទាន់មាន' }}
            </span>
          </div>

          <div class="mt-2 flex justify-between items-center text-[11px] text-slate-600 bg-slate-50 px-2 py-1.5 rounded-lg">
            <span>សិស្សសរុប:</span>
            <span class="font-bold text-blue-600">{{ c.students?.length || 0 }} នាក់</span>
          </div>
        </div>
      </div>

      <!-- Empty Classes -->
      <div
        v-if="currentView === 'classes' && !loadingClasses && classesList.length === 0"
        class="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center text-slate-400"
      >
        <div class="text-2xl mb-2">
          <i class="fa-solid fa-school-circle-xmark"></i>
        </div>

        <p class="text-sm font-bold text-slate-500">
          មិនមានថ្នាក់រៀនទេ
        </p>
      </div>

      <!-- Students Payment Table -->
      <div
        v-if="currentView === 'students'"
        class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
      >
        <!-- Loading -->
        <div v-if="loadingPayments" class="p-8 text-center text-slate-400">
          <div class="mx-auto mb-2 h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <i class="fa-solid fa-circle-notch fa-spin text-xl"></i>
          </div>

          <span class="text-sm font-bold text-slate-500">
            កំពុងទាញយកទិន្នន័យ...
          </span>
        </div>

        <div v-else>
          <div class="overflow-x-auto scroll-smooth">
            <table class="w-full text-left border-collapse text-xs min-w-[1260px]">
              <thead>
                <tr class="bg-slate-100 text-slate-700">
                  <th class="table-th min-w-[220px]">
                    ព័ត៌មានសិស្ស
                  </th>

                  <th class="table-th w-36">
                    ថ្ងៃត្រូវបង់
                  </th>

                  <th class="table-th w-32 text-center">
                    តម្លៃត្រូវបង់
                  </th>

                  <th class="table-th w-32 text-center">
                    បានបង់
                  </th>

                  <th class="table-th w-32 text-center">
                    នៅខ្វះ
                  </th>

                  <th class="table-th w-36 text-center">
                    បង់បន្ថែម
                  </th>

                  <th class="table-th w-52">
                    ផ្សេងៗ
                  </th>

                  <th class="table-th w-32 text-center">
                    ស្ថានភាព
                  </th>

                  <th class="table-th w-36 text-right">
                    សកម្មភាព
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="row in paginatedList"
                  :key="row.uniqueKey"
                  class="hover:bg-blue-50/40 transition border-b border-slate-100"
                >
                  <!-- Student -->
                  <td class="table-td">
                    <div class="flex items-center gap-2">
                      <div class="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700 font-bold border border-blue-100 shadow-sm shrink-0">
                        {{ row.student?.englishName?.charAt(0) || row.student?.khmerName?.charAt(0) || '?' }}
                      </div>

                      <div class="min-w-0">
                        <div class="text-sm font-bold text-slate-800 truncate">
                          {{ row.student?.khmerName || '-' }}
                        </div>

                        <div class="text-[11px] text-slate-500 truncate">
                          {{ row.student?.englishName || '-' }}
                        </div>

                        <div class="text-[10px] text-purple-600 font-medium mt-0.5 truncate">
                          <i class="fa-solid fa-phone mr-1"></i>
                          ម្តាយ: {{ row.student?.family?.motherNumber || 'គ្មានទិន្នន័យ' }}
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- Due Date -->
                  <td class="table-td">
                    <input
                      type="date"
                      v-model="row.dueDate"
                      :disabled="!row.isVirtual"
                      class="date-input"
                    />

                    <div class="text-[10px] text-slate-400 mt-1">
                      ចូលរៀន: {{ formatDate(row.student?.joinDate) }}
                    </div>
                  </td>

                  <!-- Expected Amount -->
                  <td class="table-td">
                    <input
                      type="number"
                      v-model.number="row.inputExpectedAmount"
                      :disabled="!row.isVirtual"
                      class="money-input"
                      placeholder="0"
                    />

                    <div class="text-[10px] text-slate-400 mt-1">
                      ត្រូវបង់
                    </div>
                  </td>

                  <!-- Paid Amount -->
                  <td class="table-td">
                    <input
                      type="number"
                      v-model.number="row.inputPaidAmount"
                      :disabled="!row.isVirtual"
                      class="money-input"
                      placeholder="0"
                    />

                    <div class="text-[10px] text-slate-400 mt-1">
                      បានបង់
                    </div>
                  </td>

                  <!-- Balance -->
                  <td class="table-td text-right font-extrabold text-red-600">
                    ៛{{ formatMoney(getBalanceAmount(row)) }}
                  </td>

                  <!-- Add More Payment -->
                  <td class="table-td">
                    <template v-if="!row.isVirtual && getBalanceAmount(row) > 0">
                      <input
                        type="number"
                        v-model.number="row.additionalAmount"
                        min="0"
                        :max="getBalanceAmount(row)"
                        class="additional-input"
                        placeholder="0"
                      />

                      <div class="text-[10px] text-orange-500 mt-1 font-bold">
                        ខ្វះ: ៛{{ formatMoney(getBalanceAmount(row)) }}
                      </div>
                    </template>

                    <template v-else>
                      <div class="text-[11px] text-slate-400 text-center">
                        -
                      </div>
                    </template>
                  </td>

                  <!-- Remark -->
                  <td class="table-td">
                    <input
                      type="text"
                      v-model="row.remark"
                      :disabled="!row.isVirtual && getBalanceAmount(row) <= 0"
                      class="remark-input"
                      placeholder="កំណត់សម្គាល់"
                    />
                  </td>

                  <!-- Status -->
                  <td class="table-td text-center">
                    <span
                      :class="getStatusClass(getDisplayStatus(row))"
                      class="px-2.5 py-1 text-[11px] font-bold rounded-full inline-flex items-center justify-center gap-1 border whitespace-nowrap"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {{ translateStatus(getDisplayStatus(row)) }}
                    </span>

                    <div
                      v-if="row.payDate"
                      class="text-[10px] text-slate-400 mt-1"
                    >
                      {{ formatDate(row.payDate) }}
                    </div>
                  </td>

                  <!-- Actions -->
                  <td class="table-td text-right">
                    <button
                      v-if="row.isVirtual"
                      @click="handleOneClickPay(row)"
                      class="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm inline-flex items-center gap-1"
                    >
                      <i class="fa-solid fa-circle-check"></i>
                      បង់ប្រាក់
                    </button>

                    <div v-else class="flex items-center justify-end gap-2">
                      <button
                        v-if="getBalanceAmount(row) > 0"
                        @click="handleAddPayment(row)"
                        class="bg-orange-600 text-white hover:bg-orange-700 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm inline-flex items-center gap-1"
                      >
                        <i class="fa-solid fa-plus-circle"></i>
                        បង់បន្ថែម
                      </button>

                      <span
                        v-else
                        class="text-green-600 bg-green-50 text-xs font-bold px-2 py-1 rounded-lg"
                      >
                        រួចរាល់
                      </span>

                      <button
                        @click="handleDelete(row)"
                        class="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1"
                      >
                        <i class="fa-solid fa-trash"></i>
                        លុប
                      </button>
                    </div>
                  </td>
                </tr>

                <tr v-if="paginatedList.length === 0">
                  <td colspan="9" class="px-4 py-10 text-center text-slate-400">
                    <div class="mx-auto mb-2 h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                      <i class="fa-solid fa-receipt text-xl"></i>
                    </div>

                    <p class="text-sm font-bold text-slate-500">
                      មិនមានទិន្នន័យសិស្សឡើយ
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="bg-slate-50 px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div class="flex items-center gap-2 text-xs text-slate-600">
              <span>បង្ហាញ</span>

              <select
                v-model.number="perPage"
                @change="currentPage = 1"
                class="border border-slate-200 rounded-lg px-2 py-1.5 bg-white font-bold outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-xs cursor-pointer"
              >
                <option :value="6">6</option>
                <option :value="10">10</option>
                <option :value="20">20</option>
              </select>

              <span>ជួរ ក្នុងចំណោមសិស្សសរុប {{ processedList.length }} នាក់</span>
            </div>

            <div class="flex items-center gap-2">
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1"
              >
                <i class="fa-solid fa-chevron-left"></i>
                មុន
              </button>

              <span class="text-xs text-slate-700 font-bold mx-1">
                ទំព័រ {{ currentPage }} នៃ {{ totalPages }}
              </span>

              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1"
              >
                បន្ទាប់
                <i class="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <DeleteConfirmationModal
      :is-open="showDeleteModal"
      item-name="ទិន្នន័យបង់ប្រាក់"
      title="លុបទិន្នន័យបង់ប្រាក់"
      message="តើអ្នកពិតជាចង់លុបទិន្នន័យបង់ប្រាក់នេះមែនទេ?"
      @close="closeDeleteModal"
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

const paymentsQuery = useQuery("payments");
const classesQuery = useQuery("classes");

const payments = paymentsQuery.data;
const classes = classesQuery.data;

const refreshPayments = paymentsQuery.fetchData || paymentsQuery.refetch;

const loadingPayments = computed(() => {
  return paymentsQuery.isLoading?.value || paymentsQuery.loading?.value || false;
});

const loadingClasses = computed(() => {
  return classesQuery.isLoading?.value || classesQuery.loading?.value || false;
});

const { createDoc, updateDoc, deleteDoc } = useCollection("payments");

const currentView = ref("classes");
const selectedClass = ref(null);

const filters = reactive({
  month: new Date().toISOString().slice(0, 7),
  searchQuery: "",
  status: "All",
  defaultDueAmount: 0
});

const showDeleteModal = ref(false);
const paymentToDelete = ref(null);

const currentPage = ref(1);
const perPage = ref(6);

const normalizeArray = (responseData) => {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.result)) return responseData.result;
  if (Array.isArray(responseData?.data)) return responseData.data;
  if (Array.isArray(responseData?.items)) return responseData.items;
  return [];
};

const paymentsList = computed(() => normalizeArray(payments?.value));
const classesList = computed(() => normalizeArray(classes?.value));

watch(
  filters,
  () => {
    currentPage.value = 1;
  },
  { deep: true }
);

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
  currentPage.value = 1;
};

const getClassDefaultDueAmount = (cls) => {
  return Number(
    cls?.dueAmount ||
    cls?.tuitionFee ||
    cls?.monthlyFee ||
    cls?.fee ||
    cls?.price ||
    filters.defaultDueAmount ||
    0
  );
};

const getDeadlineDate = (student) => {
  if (!filters.month) return "";

  const [year, month] = filters.month.split("-");
  const joinDate = student?.joinDate ? new Date(student.joinDate) : null;
  const joinDay = joinDate && !Number.isNaN(joinDate.getTime()) ? joinDate.getDate() : 1;
  const lastDay = new Date(Number(year), Number(month), 0).getDate();
  const safeDay = Math.min(joinDay, lastDay);
  const dueDate = new Date(Number(year), Number(month) - 1, safeDay);

  return dueDate.toISOString().split("T")[0];
};

const totalCollectedThisMonth = computed(() => {
  if (!selectedClass.value) return 0;

  const targetMonth = filters.month;
  const classId = selectedClass.value._id;

  return paymentsList.value
    .filter((payment) =>
      String(payment.class?._id || payment.class) === String(classId) &&
      String(payment.paymentMonth || "").slice(0, 7) === targetMonth &&
      ["paid", "partial"].includes(payment.status)
    )
    .reduce((sum, payment) => {
      return sum + Number(payment.paidAmount || payment.amount || 0);
    }, 0);
});

const processedList = computed(() => {
  if (!selectedClass.value) return [];

  const targetMonth = filters.month;

  let classStudents = Array.isArray(selectedClass.value.students)
    ? selectedClass.value.students
    : [];

  if (filters.searchQuery.trim() !== "") {
    const query = filters.searchQuery.toLowerCase().trim();

    classStudents = classStudents.filter((student) =>
      student.khmerName?.toLowerCase().includes(query) ||
      student.englishName?.toLowerCase().includes(query) ||
      String(student.studentId || "").toLowerCase().includes(query) ||
      String(student.idCode || "").toLowerCase().includes(query)
    );
  }

  const todayStr = new Date().toISOString().split("T")[0];
  const defaultDueAmount = getClassDefaultDueAmount(selectedClass.value);

  let mappedList = classStudents.map((student) => {
    const dueDate = getDeadlineDate(student);

    const existingPayment = paymentsList.value.find((payment) =>
      String(payment.student?._id || payment.student) === String(student._id) &&
      String(payment.class?._id || payment.class) === String(selectedClass.value._id) &&
      String(payment.paymentMonth || "").slice(0, 7) === targetMonth
    );

    if (existingPayment) {
      const expectedAmount = Number(
        existingPayment.expectedAmount ||
        Number(existingPayment.tuitionFee || 0) + Number(existingPayment.extraFee || 0) ||
        existingPayment.amount ||
        0
      );

      const paidAmount = Number(
        existingPayment.paidAmount ||
        existingPayment.amount ||
        0
      );

      const balance = Number(
        existingPayment.balance !== undefined
          ? existingPayment.balance
          : Math.max(expectedAmount - paidAmount, 0)
      );

      return {
        ...existingPayment,
        uniqueKey: existingPayment._id,
        isVirtual: false,
        student: existingPayment.student && typeof existingPayment.student === "object"
          ? existingPayment.student
          : student,
        dueDate: existingPayment.dueDate
          ? new Date(existingPayment.dueDate).toISOString().split("T")[0]
          : dueDate,
        paymentDeadline: existingPayment.dueDate || dueDate,
        inputExpectedAmount: expectedAmount,
        inputPaidAmount: paidAmount,
        expectedAmount,
        paidAmount,
        balance,
        additionalAmount: balance > 0 ? balance : 0,
        remark: existingPayment.remark || ""
      };
    }

    const computedStatus = dueDate && todayStr > dueDate ? "late" : "unpaid";

    return {
      uniqueKey: `virtual_${student._id}`,
      student,
      status: computedStatus,
      isVirtual: true,
      dueDate,
      paymentDeadline: dueDate,
      inputExpectedAmount: defaultDueAmount,
      inputPaidAmount: defaultDueAmount,
      expectedAmount: defaultDueAmount,
      paidAmount: 0,
      balance: defaultDueAmount,
      additionalAmount: 0,
      remark: ""
    };
  });

  if (filters.status === "paid") {
    mappedList = mappedList.filter((row) => !row.isVirtual && getDisplayStatus(row) === "paid");
  }

  if (filters.status === "partial") {
    mappedList = mappedList.filter((row) => !row.isVirtual && getDisplayStatus(row) === "partial");
  }

  if (filters.status === "unpaid") {
    mappedList = mappedList.filter((row) => row.isVirtual && getDisplayStatus(row) === "unpaid");
  }

  if (filters.status === "late") {
    mappedList = mappedList.filter((row) => getDisplayStatus(row) === "late");
  }

  return mappedList;
});

const totalPages = computed(() => {
  return Math.ceil(processedList.value.length / perPage.value) || 1;
});

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;

  return processedList.value.slice(start, end);
});

watch(totalPages, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value;
  }
});

const getExpectedAmount = (row) => {
  if (row.isVirtual) {
    return Number(row.inputExpectedAmount || 0);
  }

  return Number(row.expectedAmount || row.amount || 0);
};

const getPaidAmount = (row) => {
  if (row.isVirtual) {
    return Number(row.inputPaidAmount || 0);
  }

  return Number(row.paidAmount || row.amount || 0);
};

const getBalanceAmount = (row) => {
  return Math.max(getExpectedAmount(row) - getPaidAmount(row), 0);
};

const getDisplayStatus = (row) => {
  if (!row.isVirtual) {
    const balance = getBalanceAmount(row);

    if (balance > 0) return "partial";
    return "paid";
  }

  const expectedAmount = getExpectedAmount(row);
  const paidAmount = getPaidAmount(row);
  const balance = getBalanceAmount(row);
  const todayStr = new Date().toISOString().split("T")[0];

  if (paidAmount <= 0) {
    return row.dueDate && todayStr > row.dueDate ? "late" : "unpaid";
  }

  if (balance > 0) return "partial";

  if (expectedAmount > 0 && paidAmount >= expectedAmount) return "paid";

  return "unpaid";
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value -= 1;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value += 1;
};

const refreshPaymentList = async () => {
  if (typeof refreshPayments === "function") {
    await refreshPayments();
  }
};

const handleOneClickPay = async (row) => {
  const expectedAmount = Number(row.inputExpectedAmount || 0);
  const paidAmount = Number(row.inputPaidAmount || 0);
  const balance = Math.max(expectedAmount - paidAmount, 0);

  if (expectedAmount <= 0) {
    toast.warning("សូមកំណត់តម្លៃដែលត្រូវបង់ជាមុនសិន!");
    return;
  }

  if (paidAmount <= 0) {
    toast.warning("សូមបញ្ចូលចំនួនទឹកប្រាក់ដែលបានបង់!");
    return;
  }

  if (paidAmount > expectedAmount) {
    toast.warning("ចំនួនបានបង់ មិនអាចធំជាងតម្លៃត្រូវបង់បានទេ!");
    return;
  }

  if (!row.dueDate) {
    toast.warning("សូមកំណត់ថ្ងៃត្រូវបង់!");
    return;
  }

  const today = new Date().toISOString().split("T")[0];

  const payload = {
    student: row.student._id,
    class: selectedClass.value._id,
    teacher: selectedClass.value.teacher?._id || selectedClass.value.teacher || null,

    paymentMonth: filters.month,
    dueDate: row.dueDate,
    payDate: today,

    tuitionFee: expectedAmount,
    extraFee: 0,
    expectedAmount,

    paidAmount,
    amount: paidAmount,
    balance,

    status: balance > 0 ? "partial" : "paid",
    remark: row.remark || ""
  };

  try {
    await createDoc(payload);
    toast.success(`បានបង់ប្រាក់សម្រាប់សិស្ស ${row.student.khmerName} រួចរាល់!`);

    await refreshPaymentList();
  } catch (err) {
    console.error(err);
    toast.error(
      err.response?.data?.err ||
      err.response?.data?.message ||
      "ការបង់ប្រាក់បានបរាជ័យ"
    );
  }
};

const handleAddPayment = async (row) => {
  const expectedAmount = Number(row.expectedAmount || row.inputExpectedAmount || 0);
  const oldPaidAmount = Number(row.paidAmount || row.amount || 0);
  const oldBalance = Math.max(expectedAmount - oldPaidAmount, 0);
  const addAmount = Number(row.additionalAmount || 0);

  if (!row._id) {
    toast.warning("រកមិនឃើញលេខសម្គាល់ការបង់ប្រាក់!");
    return;
  }

  if (oldBalance <= 0) {
    toast.info("សិស្សនេះបានបង់គ្រប់ហើយ!");
    return;
  }

  if (addAmount <= 0) {
    toast.warning("សូមបញ្ចូលចំនួនទឹកប្រាក់បន្ថែម!");
    return;
  }

  if (addAmount > oldBalance) {
    toast.warning("ចំនួនបង់បន្ថែម មិនអាចលើសចំនួននៅខ្វះបានទេ!");
    return;
  }

  const newPaidAmount = oldPaidAmount + addAmount;
  const newBalance = Math.max(expectedAmount - newPaidAmount, 0);
  const today = new Date().toISOString().split("T")[0];

  const payload = {
    student: row.student?._id || row.student,
    class: selectedClass.value._id,
    teacher: selectedClass.value.teacher?._id || selectedClass.value.teacher || null,

    paymentMonth: filters.month,
    dueDate: row.dueDate,
    payDate: today,

    tuitionFee: expectedAmount,
    extraFee: 0,
    expectedAmount,

    paidAmount: newPaidAmount,
    amount: newPaidAmount,
    balance: newBalance,

    status: newBalance > 0 ? "partial" : "paid",
    remark: row.remark || ""
  };

  try {
    await updateDoc(row._id, payload);

    toast.success(
      newBalance > 0
        ? `បានបង់បន្ថែម ៛${formatMoney(addAmount)} នៅខ្វះ ៛${formatMoney(newBalance)}`
        : "បានបង់បន្ថែម និងបង់គ្រប់រួចរាល់!"
    );

    await refreshPaymentList();
  } catch (err) {
    console.error(err);
    toast.error(
      err.response?.data?.err ||
      err.response?.data?.message ||
      "មិនអាចបង់បន្ថែមបានទេ"
    );
  }
};

const handleDelete = (payment) => {
  paymentToDelete.value = payment;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  paymentToDelete.value = null;
};

const confirmDelete = async () => {
  if (!paymentToDelete.value?._id) return;

  try {
    await deleteDoc(paymentToDelete.value._id);
    toast.success("បានលុបទិន្នន័យបង់ប្រាក់");

    await refreshPaymentList();
  } catch (err) {
    console.error(err);
    toast.error(
      err.response?.data?.err ||
      err.response?.data?.message ||
      "មិនអាចលុបទិន្នន័យបង់ប្រាក់បានទេ"
    );
  } finally {
    closeDeleteModal();
  }
};

const translateStatus = (status) => {
  if (status === "paid") return "បានបង់ប្រាក់";
  if (status === "partial") return "បង់ខ្លះ";
  if (status === "late") return "យឺតយ៉ាវ";
  return "មិនទាន់បង់";
};

const getStatusClass = (status) => {
  if (status === "paid") return "bg-green-50 text-green-700 border-green-200";
  if (status === "partial") return "bg-orange-50 text-orange-700 border-orange-200";
  if (status === "late") return "bg-red-50 text-red-700 border-red-200";
  return "bg-slate-100 text-slate-600 border-slate-200";
};

const formatMoney = (value) => {
  return Number(value || 0).toLocaleString("km-KH");
};

const formatDate = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "-";

  return parsedDate.toLocaleDateString("km-KH", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};
</script>

<style scoped>
.form-label {
  display: block;
  font-size: 0.68rem;
  font-weight: 800;
  color: #64748b;
  margin-bottom: 0.2rem;
}

.form-input {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.44rem 0.6rem;
  font-size: 0.75rem;
  color: #334155;
  background: #ffffff;
  outline: none;
  min-height: 2.45rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
}

.search-input {
  padding-left: 2.35rem !important;
}

.table-th {
  padding: 0.5rem 0.6rem;
  font-size: 0.7rem;
  font-weight: 900;
  color: #475569;
  border: 1px solid #e2e8f0;
  white-space: nowrap;
}

.table-td {
  padding: 0.5rem 0.6rem;
  border: 1px solid #f1f5f9;
  font-size: 0.72rem;
}

.money-input,
.remark-input,
.date-input {
  width: 100%;
  padding: 0.38rem 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.72rem;
  outline: none;
  transition: all 0.2s ease;
  background: #ffffff;
}

.money-input {
  text-align: right;
  font-weight: 800;
}

.money-input:focus,
.remark-input:focus,
.date-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
}

.money-input:disabled,
.remark-input:disabled,
.date-input:disabled {
  background: #f1f5f9;
  color: #64748b;
}

.additional-input {
  width: 100%;
  padding: 0.38rem 0.5rem;
  border: 1px solid #fed7aa;
  border-radius: 0.5rem;
  font-size: 0.72rem;
  outline: none;
  background: #fff7ed;
  color: #9a3412;
  font-weight: 800;
  text-align: right;
  transition: all 0.2s ease;
}

.additional-input:focus {
  border-color: #f97316;
  box-shadow: 0 0 0 3px rgb(249 115 22 / 0.12);
}
</style>