<template>
  <div class=" bg-slate-50 p-3 md:p-4 text-slate-800 print:p-0 print:bg-white">
    <div class="max-w-7xl mx-auto space-y-4 print:max-w-full print:space-y-0">
      <!-- Header -->
      <div class="no-print bg-white rounded-xl border border-slate-200 shadow-sm px-3 py-3 md:px-4">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div class="min-w-0">
            <h1 class="text-lg md:text-xl font-extrabold text-slate-800 flex items-center gap-2">
              <span class="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-sm shrink-0">
                <i class="fa-solid fa-file-invoice-dollar"></i>
              </span>

              <span class="truncate">
                របាយការណ៍បង់ប្រាក់សិស្ស
              </span>
            </h1>

            <p class="text-xs text-slate-500 mt-1 truncate">
              ត្រួតពិនិត្យការបង់ប្រាក់តាមថ្នាក់ ខែ ស្ថានភាព និងសិស្ស
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              @click="exportCsv"
              :disabled="reportRows.length === 0"
              class="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold shadow-sm transition"
            >
              <i class="fa-solid fa-file-csv text-[10px]"></i>
              Export CSV
            </button>

            <button
              @click="printReport"
              :disabled="reportRows.length === 0"
              class="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold shadow-sm transition"
            >
              <i class="fa-solid fa-print text-[10px]"></i>
              បោះពុម្ព
            </button>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="no-print bg-white rounded-xl border border-slate-200 shadow-sm p-3">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.3fr_150px_150px_150px_1fr_auto] gap-2 items-end">
          <!-- Class -->
          <div>
            <label class="form-label">ថ្នាក់រៀន</label>

            <select v-model="filters.classId" class="form-input">
              <option value="">ថ្នាក់ទាំងអស់</option>
              <option
                v-for="cls in classesList"
                :key="cls._id"
                :value="cls._id"
              >
                {{ cls.className }} {{ cls.timeStudy ? `(${cls.timeStudy})` : '' }}
              </option>
            </select>
          </div>

          <!-- Month -->
          <div>
            <label class="form-label">ខែបង់ប្រាក់</label>

            <input
              v-model="filters.month"
              type="month"
              class="form-input"
            />
          </div>

          <!-- Status -->
          <div>
            <label class="form-label">ស្ថានភាព</label>

            <select v-model="filters.status" class="form-input">
              <option value="All">ទាំងអស់</option>
              <option value="paid">បានបង់</option>
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
                v-model="filters.search"
                type="text"
                placeholder="ឈ្មោះ / អត្តលេខ / ថ្នាក់..."
                class="form-input search-input"
              />
            </div>
          </div>

          <button
            @click="resetFilters"
            class="w-full lg:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold shadow-sm transition"
          >
            <i class="fa-solid fa-rotate-left text-[10px]"></i>
            សម្អាត
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div
        v-if="isPageLoading"
        class="no-print bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center text-slate-400"
      >
        <div class="mx-auto mb-2 h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <i class="fa-solid fa-circle-notch fa-spin text-xl"></i>
        </div>

        <p class="text-sm font-bold text-slate-500">
          កំពុងទាញយកទិន្នន័យ...
        </p>
      </div>

      <!-- Report -->
      <div v-else class="print-area">
        <div class="print-page bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden print:border-none print:shadow-none print:rounded-none">
          <!-- Print Header -->
          <div class="hidden print:block text-center mb-4">
            <h1 class="text-xl font-extrabold text-slate-900">
              របាយការណ៍បង់ប្រាក់សិស្ស
            </h1>

            <p class="text-xs text-slate-700 mt-1">
              ខែ {{ selectedMonthLabel }} | ថ្នាក់៖ {{ selectedClassName }}
            </p>

            <p class="text-xs text-slate-700 mt-1">
              ស្ថានភាព៖ {{ selectedStatusLabel }} | កាលបរិច្ឆេទបោះពុម្ព៖ {{ todayLabel }}
            </p>
          </div>

          <!-- Screen Report Header -->
          <div class="no-print px-3 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div class="min-w-0">
              <h2 class="text-sm font-extrabold text-slate-800 truncate">
                {{ selectedClassName }}
              </h2>

              <p class="text-[11px] text-slate-500 mt-0.5">
                ខែ {{ selectedMonthLabel }} · {{ selectedStatusLabel }} · សិស្ស {{ reportRows.length }} នាក់
              </p>
            </div>

            <span class="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-1 w-fit">
              <i class="fa-solid fa-chart-pie text-[10px]"></i>
              Paid Rate {{ summary.paidRate }}%
            </span>
          </div>

          <!-- Summary Cards -->
          <div class="no-print grid grid-cols-2 lg:grid-cols-7 gap-2 p-3 border-b border-slate-200 bg-white">
            <div class="summary-card">
              <p class="summary-label">សិស្សសរុប</p>
              <p class="summary-value text-slate-800">{{ summary.totalStudents }}</p>
            </div>

            <div class="summary-card bg-green-50 border-green-100">
              <p class="summary-label text-green-600">បានបង់</p>
              <p class="summary-value text-green-700">{{ summary.paidCount }}</p>
            </div>

            <div class="summary-card bg-orange-50 border-orange-100">
              <p class="summary-label text-orange-600">បង់ខ្លះ</p>
              <p class="summary-value text-orange-700">{{ summary.partialCount }}</p>
            </div>

            <div class="summary-card bg-slate-50 border-slate-200">
              <p class="summary-label text-slate-600">មិនទាន់បង់</p>
              <p class="summary-value text-slate-700">{{ summary.unpaidCount }}</p>
            </div>

            <div class="summary-card bg-red-50 border-red-100">
              <p class="summary-label text-red-600">យឺតយ៉ាវ</p>
              <p class="summary-value text-red-700">{{ summary.lateCount }}</p>
            </div>

            <div class="summary-card bg-blue-50 border-blue-100">
              <p class="summary-label text-blue-600">បានប្រមូល</p>
              <p class="summary-value text-blue-700">៛{{ formatMoney(summary.collectedAmount) }}</p>
            </div>

            <div class="summary-card bg-amber-50 border-amber-100">
              <p class="summary-label text-amber-600">នៅខ្វះ</p>
              <p class="summary-value text-amber-700">៛{{ formatMoney(summary.balanceAmount) }}</p>
            </div>
          </div>

          <!-- Print Summary -->
          <div class="hidden print:grid grid-cols-7 gap-1 mb-3 text-[8px]">
            <div class="print-summary-box">សិស្សសរុប<br /><strong>{{ summary.totalStudents }}</strong></div>
            <div class="print-summary-box">បានបង់<br /><strong>{{ summary.paidCount }}</strong></div>
            <div class="print-summary-box">បង់ខ្លះ<br /><strong>{{ summary.partialCount }}</strong></div>
            <div class="print-summary-box">មិនទាន់បង់<br /><strong>{{ summary.unpaidCount }}</strong></div>
            <div class="print-summary-box">យឺតយ៉ាវ<br /><strong>{{ summary.lateCount }}</strong></div>
            <div class="print-summary-box">បានប្រមូល<br /><strong>៛{{ formatMoney(summary.collectedAmount) }}</strong></div>
            <div class="print-summary-box">នៅខ្វះ<br /><strong>៛{{ formatMoney(summary.balanceAmount) }}</strong></div>
          </div>

          <!-- Table -->
          <div class="report-table-wrap overflow-x-auto">
            <table class="report-table w-full text-left border-collapse text-xs min-w-[1080px]">
              <thead>
                <tr class="bg-slate-100 text-slate-700">
                  <th class="table-th text-center w-10">ល.រ</th>
                  <th class="table-th min-w-[190px]">ព័ត៌មានសិស្ស</th>
                  <th class="table-th min-w-[120px]">ថ្នាក់</th>
                  <th class="table-th text-center w-28">ថ្ងៃត្រូវបង់</th>
                  <th class="table-th text-right w-28">ត្រូវបង់សរុប</th>
                  <th class="table-th text-right w-28">បានបង់</th>
                  <th class="table-th text-right w-28">នៅខ្វះ</th>
                  <th class="table-th text-center w-28">ស្ថានភាព</th>
                  <th class="table-th min-w-[140px]">ផ្សេងៗ</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(row, index) in paginatedRows"
                  :key="row.uniqueKey"
                  class="border-b border-slate-100 hover:bg-slate-50 print:hover:bg-transparent"
                >
                  <td class="table-td text-center text-slate-500">
                    {{ rowNumber(index) }}
                  </td>

                  <td class="table-td">
                    <div class="font-extrabold text-slate-800 leading-tight">
                      {{ row.student?.khmerName || '-' }}
                    </div>

                    <div class="text-[10px] text-slate-500 leading-tight">
                      {{ row.student?.englishName || '-' }}
                    </div>

                    <div class="text-[10px] text-slate-400 leading-tight">
                      ID: {{ row.student?.studentId || row.student?.idCode || '-' }}
                    </div>
                  </td>

                  <td class="table-td">
                    {{ row.className }}
                  </td>

                  <td class="table-td text-center">
                    {{ formatDate(row.dueDate || row.paymentDeadline) }}
                  </td>

                  <td class="table-td text-right font-extrabold text-blue-700 print:text-black">
                    ៛{{ formatMoney(row.expectedAmount) }}
                  </td>

                  <td class="table-td text-right font-extrabold text-green-700 print:text-black">
                    ៛{{ formatMoney(row.paidAmount) }}
                  </td>

                  <td class="table-td text-right font-extrabold text-red-600 print:text-black">
                    ៛{{ formatMoney(row.balanceAmount) }}
                  </td>

                  <td class="table-td text-center">
                    <span
                      :class="getStatusClass(row.status)"
                      class="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-extrabold whitespace-nowrap print:border-0 print:bg-transparent print:text-black"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-current print:hidden"></span>
                      {{ translateStatus(row.status) }}
                    </span>

                    <div
                      v-if="row.payDate"
                      class="text-[10px] text-slate-400 mt-0.5 print:text-black"
                    >
                      {{ formatDate(row.payDate) }}
                    </div>
                  </td>

                  <td class="table-td text-slate-500">
                    {{ row.remark || '-' }}
                  </td>
                </tr>

                <tr v-if="reportRows.length === 0">
                  <td colspan="9" class="px-4 py-10 text-center text-slate-400">
                    <div class="mx-auto mb-2 h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                      <i class="fa-solid fa-receipt text-xl"></i>
                    </div>

                    <p class="text-sm font-bold text-slate-500">
                      មិនមានទិន្នន័យសម្រាប់បង្ហាញ
                    </p>
                  </td>
                </tr>
              </tbody>

              <tfoot v-if="reportRows.length > 0">
                <tr class="bg-slate-100 font-extrabold">
                  <td colspan="4" class="table-td text-right">
                    សរុប
                  </td>

                  <td class="table-td text-right text-blue-700 print:text-black">
                    ៛{{ formatMoney(summary.expectedAmount) }}
                  </td>

                  <td class="table-td text-right text-green-700 print:text-black">
                    ៛{{ formatMoney(summary.collectedAmount) }}
                  </td>

                  <td class="table-td text-right text-red-600 print:text-black">
                    ៛{{ formatMoney(summary.balanceAmount) }}
                  </td>

                  <td colspan="2" class="table-td">
                    Paid Rate: {{ summary.paidRate }}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Pagination -->
          <div
            v-if="reportRows.length > 0"
            class="no-print bg-slate-50 px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3"
          >
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

              <span>ជួរ ក្នុងចំណោមសិស្សសរុប {{ reportRows.length }} នាក់</span>
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

          <!-- Print Signature -->
          <div class="hidden print:flex justify-between mt-8 px-8 text-xs">
            <div class="text-center">
              <p class="mb-16 font-bold">
                បានឃើញ និងឯកភាព<br />
                នាយកសាលា
              </p>
              <p>.......................................</p>
            </div>

            <div class="text-center">
              <p class="mb-16">
                ថ្ងៃទី........ខែ........ឆ្នាំ........<br />
                <strong class="font-bold">អ្នកទទួលប្រាក់</strong>
              </p>
              <p>.......................................</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { useQuery } from "../hooks/useQuery";

const paymentsQuery = useQuery("payments");
const classesQuery = useQuery("classes");
const studentsQuery = useQuery("students");

const payments = paymentsQuery.data;
const classes = classesQuery.data;
const students = studentsQuery.data;

const loadingPayments = computed(() => {
  return paymentsQuery.isLoading?.value || paymentsQuery.loading?.value || false;
});

const loadingClasses = computed(() => {
  return classesQuery.isLoading?.value || classesQuery.loading?.value || false;
});

const loadingStudents = computed(() => {
  return studentsQuery.isLoading?.value || studentsQuery.loading?.value || false;
});

const getCurrentMonth = () => new Date().toISOString().slice(0, 7);

const filters = reactive({
  classId: "",
  month: getCurrentMonth(),
  status: "All",
  search: "",
  defaultDueAmount: 0
});

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
const studentsList = computed(() => normalizeArray(students?.value));

const isPageLoading = computed(() => {
  return loadingPayments.value || loadingClasses.value || loadingStudents.value;
});

const selectedClass = computed(() => {
  if (!filters.classId) return null;
  return classesList.value.find((cls) => String(cls._id) === String(filters.classId)) || null;
});

const selectedClassName = computed(() => {
  return selectedClass.value?.className || "ថ្នាក់ទាំងអស់";
});

const selectedStatusLabel = computed(() => {
  if (filters.status === "paid") return "បានបង់";
  if (filters.status === "partial") return "បង់ខ្លះ";
  if (filters.status === "unpaid") return "មិនទាន់បង់";
  if (filters.status === "late") return "យឺតយ៉ាវ";
  return "ស្ថានភាពទាំងអស់";
});

const selectedMonthLabel = computed(() => {
  if (!filters.month) return "-";

  const [year, month] = filters.month.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);

  return date.toLocaleDateString("km-KH", {
    month: "long",
    year: "numeric"
  });
});

const todayLabel = computed(() => {
  return new Date().toLocaleDateString("km-KH", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
});

const getStudentClassId = (student) => {
  return String(
    student?.grade?._id ||
    student?.grade ||
    student?.class?._id ||
    student?.class ||
    ""
  );
};

const getClassStudents = (cls) => {
  if (!cls) return [];

  const classStudentIds = Array.isArray(cls.students)
    ? cls.students.map((student) => String(student._id || student))
    : [];

  const populatedStudents = Array.isArray(cls.students)
    ? cls.students.filter((student) => typeof student === "object" && student?._id)
    : [];

  if (populatedStudents.length > 0) return populatedStudents;

  return studentsList.value.filter((student) => {
    const inClassArray = classStudentIds.includes(String(student._id));
    const inGradeField = getStudentClassId(student) === String(cls._id);
    return inClassArray || inGradeField;
  });
};

const baseStudents = computed(() => {
  const rows = [];

  if (selectedClass.value) {
    getClassStudents(selectedClass.value).forEach((student) => {
      rows.push({
        student,
        classObject: selectedClass.value
      });
    });

    return rows;
  }

  classesList.value.forEach((cls) => {
    getClassStudents(cls).forEach((student) => {
      rows.push({
        student,
        classObject: cls
      });
    });
  });

  const seen = new Set();

  return rows.filter((row) => {
    const key = `${row.classObject?._id}_${row.student?._id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
});

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

const getMonthDeadline = (student) => {
  if (!filters.month) return null;

  const [year, month] = filters.month.split("-");
  const joinDate = student?.joinDate ? new Date(student.joinDate) : null;
  const joinDay = joinDate && !Number.isNaN(joinDate.getTime()) ? joinDate.getDate() : 1;
  const lastDayOfMonth = new Date(Number(year), Number(month), 0).getDate();
  const safeDay = Math.min(joinDay, lastDayOfMonth);
  const deadline = new Date(Number(year), Number(month) - 1, safeDay);

  return deadline.toISOString().split("T")[0];
};

const findPayment = (studentId, classId) => {
  return paymentsList.value.find((payment) =>
    String(payment.student?._id || payment.student) === String(studentId) &&
    String(payment.class?._id || payment.class) === String(classId) &&
    String(payment.paymentMonth || "").slice(0, 7) === String(filters.month)
  );
};

const computeStatus = ({ paidAmount, balanceAmount, dueDate, backendStatus }) => {
  const today = new Date().toISOString().split("T")[0];

  if (paidAmount > 0 && balanceAmount <= 0) return "paid";
  if (paidAmount > 0 && balanceAmount > 0) return "partial";
  if (dueDate && today > dueDate) return "late";

  return backendStatus || "unpaid";
};

const buildRow = ({ student, classObject }) => {
  const existingPayment = findPayment(student._id, classObject._id);
  const paymentDeadline = getMonthDeadline(student);
  const defaultExpected = getClassDefaultDueAmount(classObject);

  if (existingPayment) {
    const expectedAmount = Number(
      existingPayment.expectedAmount ||
      Number(existingPayment.tuitionFee || 0) + Number(existingPayment.extraFee || 0) ||
      existingPayment.amount ||
      defaultExpected ||
      0
    );

    const paidAmount = Number(
      existingPayment.paidAmount ||
      existingPayment.amount ||
      0
    );

    const balanceAmount = Number(
      existingPayment.balance !== undefined
        ? existingPayment.balance
        : Math.max(expectedAmount - paidAmount, 0)
    );

    const dueDate = existingPayment.dueDate
      ? new Date(existingPayment.dueDate).toISOString().split("T")[0]
      : paymentDeadline;

    const status = computeStatus({
      paidAmount,
      balanceAmount,
      dueDate,
      backendStatus: existingPayment.status
    });

    return {
      uniqueKey: existingPayment._id,
      student: existingPayment.student && typeof existingPayment.student === "object"
        ? existingPayment.student
        : student,
      classId: classObject._id,
      className: classObject.className || "-",
      paymentId: existingPayment._id,
      dueDate,
      paymentDeadline: dueDate,
      payDate: existingPayment.payDate || null,
      expectedAmount,
      paidAmount,
      balanceAmount,
      status,
      remark: existingPayment.remark || ""
    };
  }

  const dueDate = paymentDeadline;
  const paidAmount = 0;
  const balanceAmount = defaultExpected;
  const status = computeStatus({
    paidAmount,
    balanceAmount,
    dueDate,
    backendStatus: "unpaid"
  });

  return {
    uniqueKey: `virtual_${classObject._id}_${student._id}`,
    student,
    classId: classObject._id,
    className: classObject.className || "-",
    paymentId: null,
    dueDate,
    paymentDeadline: dueDate,
    payDate: null,
    expectedAmount: defaultExpected,
    paidAmount,
    balanceAmount,
    status,
    remark: ""
  };
};

const allRows = computed(() => {
  return baseStudents.value.map(buildRow);
});

const reportRows = computed(() => {
  const keyword = filters.search.trim().toLowerCase();

  return allRows.value.filter((row) => {
    const student = row.student || {};

    const keywordMatch =
      !keyword ||
      String(student.khmerName || "").toLowerCase().includes(keyword) ||
      String(student.englishName || "").toLowerCase().includes(keyword) ||
      String(student.studentId || "").toLowerCase().includes(keyword) ||
      String(student.idCode || "").toLowerCase().includes(keyword) ||
      String(row.className || "").toLowerCase().includes(keyword);

    const statusMatch =
      filters.status === "All" ||
      row.status === filters.status;

    return keywordMatch && statusMatch;
  });
});

const totalPages = computed(() => {
  return Math.ceil(reportRows.value.length / perPage.value) || 1;
});

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;

  return reportRows.value.slice(start, end);
});

const rowNumber = (index) => {
  return (currentPage.value - 1) * perPage.value + index + 1;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value -= 1;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value += 1;
};

watch(
  () => [
    filters.classId,
    filters.month,
    filters.status,
    filters.search,
    filters.defaultDueAmount
  ],
  () => {
    currentPage.value = 1;
  }
);

watch(totalPages, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value;
  }
});

const summary = computed(() => {
  const rows = reportRows.value;

  const paidRows = rows.filter((row) => row.status === "paid");
  const partialRows = rows.filter((row) => row.status === "partial");
  const unpaidRows = rows.filter((row) => row.status === "unpaid");
  const lateRows = rows.filter((row) => row.status === "late");

  const expectedAmount = rows.reduce((sum, row) => sum + Number(row.expectedAmount || 0), 0);
  const collectedAmount = rows.reduce((sum, row) => sum + Number(row.paidAmount || 0), 0);
  const balanceAmount = rows.reduce((sum, row) => sum + Number(row.balanceAmount || 0), 0);

  return {
    totalStudents: rows.length,
    paidCount: paidRows.length,
    partialCount: partialRows.length,
    unpaidCount: unpaidRows.length,
    lateCount: lateRows.length,
    expectedAmount,
    collectedAmount,
    balanceAmount,
    paidRate: rows.length ? Math.round(((paidRows.length + partialRows.length) / rows.length) * 100) : 0
  };
});

const resetFilters = () => {
  filters.classId = "";
  filters.month = getCurrentMonth();
  filters.status = "All";
  filters.search = "";
  filters.defaultDueAmount = 0;
  currentPage.value = 1;
};

const translateStatus = (status) => {
  if (status === "paid") return "បានបង់";
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

const printReport = () => {
  window.print();
};

const exportCsv = () => {
  const headers = [
    "No",
    "Khmer Name",
    "English Name",
    "Student ID",
    "Class",
    "Payment Month",
    "Due Date",
    "Expected",
    "Paid",
    "Balance",
    "Status",
    "Pay Date",
    "Remark"
  ];

  const rows = reportRows.value.map((row, index) => [
    index + 1,
    row.student?.khmerName || "",
    row.student?.englishName || "",
    row.student?.studentId || row.student?.idCode || "",
    row.className || "",
    filters.month || "",
    row.dueDate || row.paymentDeadline || "",
    row.expectedAmount || 0,
    row.paidAmount || 0,
    row.balanceAmount || 0,
    translateStatus(row.status),
    row.payDate || "",
    row.remark || ""
  ]);

  const csvContent = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
        .join(",")
    )
    .join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `payment-report-${filters.month || "all"}.csv`;
  link.click();

  URL.revokeObjectURL(url);
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
  min-height: 2.35rem;
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

.summary-card {
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 0.75rem;
  padding: 0.6rem 0.7rem;
}

.summary-label {
  font-size: 0.62rem;
  font-weight: 800;
  color: #64748b;
}

.summary-value {
  font-size: 1rem;
  font-weight: 900;
  line-height: 1.25;
  margin-top: 0.1rem;
}

.table-th {
  padding: 0.5rem 0.6rem;
  font-size: 0.68rem;
  font-weight: 900;
  color: #475569;
  border: 1px solid #e2e8f0;
  white-space: nowrap;
}

.table-td {
  padding: 0.5rem 0.6rem;
  border: 1px solid #f1f5f9;
  font-size: 0.7rem;
  vertical-align: middle;
}

.print-summary-box {
  border: 1px solid #334155;
  padding: 4px;
  text-align: center;
}

@media print {
  @page {
    size: A4 portrait;
    margin: 8mm;
  }

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    box-sizing: border-box !important;
  }

  html,
  body {
    width: 210mm !important;
    min-height: 297mm !important;
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
    overflow: visible !important;
  }

  body * {
    visibility: hidden !important;
  }

  .print-area,
  .print-area * {
    visibility: visible !important;
  }

  .no-print,
  .no-print *,
  button,
  header,
  nav,
  aside,
  .sidebar,
  .navbar {
    display: none !important;
    visibility: hidden !important;
  }

  .print-area {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
    overflow: visible !important;
  }

  .print-page {
    width: 194mm !important;
    max-width: 194mm !important;
    margin: 0 auto !important;
    padding: 0 !important;
    border: none !important;
    box-shadow: none !important;
    background: white !important;
    overflow: visible !important;
  }

  .report-table-wrap,
  .overflow-x-auto {
    overflow: visible !important;
    width: 100% !important;
    max-width: 100% !important;
  }

  .report-table,
  table {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    border-collapse: collapse !important;
    table-layout: fixed !important;
    font-size: 7.5px !important;
  }

  thead {
    display: table-header-group !important;
  }

  tfoot {
    display: table-footer-group !important;
  }

  tr {
    page-break-inside: avoid !important;
    page-break-after: auto !important;
  }

  th,
  td {
    border: 1px solid #334155 !important;
    padding: 2.5px !important;
    font-size: 7.5px !important;
    color: #000 !important;
    white-space: normal !important;
    word-break: break-word !important;
    overflow-wrap: anywhere !important;
    vertical-align: middle !important;
  }

  th {
    background: #e5e7eb !important;
    font-weight: 900 !important;
  }

  .table-th,
  .table-td {
    padding: 2.5px !important;
    font-size: 7.5px !important;
  }

  .rounded-xl,
  .rounded-lg,
  .rounded-md,
  .rounded-full {
    border-radius: 0 !important;
  }

  .shadow,
  .shadow-sm,
  .shadow-md,
  .shadow-lg {
    box-shadow: none !important;
  }

  .min-w-\[1080px\],
  .min-w-\[1050px\] {
    min-width: 0 !important;
  }
}
</style>