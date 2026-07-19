<template>
  <div class="dashboard-page-mobile-safe bg-slate-50 p-3 md:p-4 animate-fade-in-up">
    <div class="max-w-7xl mx-auto space-y-4">
      <!-- Header -->
      <div
        class="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 md:p-4"
      >
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div class="min-w-0">
            <h1
              class="text-lg md:text-xl font-extrabold text-slate-800 flex items-start gap-2 leading-snug"
            >
              <span
                class="h-9 w-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-sm shrink-0"
              >
                <i class="fa-solid fa-gauge-high"></i>
              </span>
              <span class="break-words leading-snug">ផ្ទាំងគ្រប់គ្រងសាលា</span>
            </h1>

            <p class="text-xs text-slate-500 mt-1 leading-relaxed break-words">
              សង្ខេបចំនួនសិស្ស គ្រូ ថ្នាក់រៀន ចំណូល និងរបាយការណ៍សំខាន់ៗ
            </p>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div
          v-for="(stat, index) in statCards"
          :key="stat.title"
          class="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 cursor-pointer p-3 animate-fade-in-up"
          :style="{ animationDelay: `${index * 80}ms` }"
          @click="navigate(stat.targetMenu)"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="text-[11px] sm:text-xs font-bold text-slate-500 break-words leading-snug">
                {{ stat.title }}
              </p>

              <p class="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                <span
                  v-if="stat.value === null"
                  class="animate-pulse text-slate-300"
                >
                  ...
                </span>

                <span v-else>
                  {{ stat.value }}
                </span>
              </p>

              <p class="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 break-words leading-snug">
                {{ stat.subtitle }}
              </p>
            </div>

            <div
              class="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
              :class="stat.bgColor"
            >
              <i :class="[stat.icon, stat.iconColor, 'text-base']"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div
          class="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-3 md:p-4 animate-fade-in-up"
          style="animation-delay: 360ms;"
        >
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <div class="min-w-0">
              <h2 class="text-sm font-extrabold text-slate-800 flex items-start gap-2 leading-snug">
                <span
                  class="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xs shrink-0"
                >
                  <i class="fa-solid fa-chart-column"></i>
                </span>
                <span class="break-words leading-snug">វត្តមានសិស្សប្រចាំសប្តាហ៍</span>
              </h2>

              <p class="text-[11px] text-slate-500 mt-0.5 break-words leading-snug">
                ភាគរយវត្តមានតាមថ្ងៃ
              </p>
            </div>

            <button
              @click="fetchWeeklyAttendance"
              :disabled="isAttendanceLoading"
              class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition"
              type="button"
            >
              <i
                class="fa-solid mr-1"
                :class="isAttendanceLoading ? 'fa-circle-notch fa-spin' : 'fa-rotate-right'"
              ></i>
              Refresh
            </button>
          </div>

          <div
            v-if="attendanceError"
            class="mb-3 rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-xs font-bold text-red-600"
          >
            {{ attendanceError }}
          </div>

          <div class="chart-container">
            <canvas ref="attendanceChartCanvas"></canvas>
          </div>
        </div>

        <div
          class="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 md:p-4 animate-fade-in-up"
          style="animation-delay: 460ms;"
        >
          <div class="flex items-center justify-between gap-2 mb-3">
            <div class="min-w-0">
              <h2 class="text-sm font-extrabold text-slate-800 flex items-start gap-2 leading-snug">
                <span
                  class="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xs shrink-0"
                >
                  <i class="fa-solid fa-chart-pie"></i>
                </span>
                <span class="break-words leading-snug">សិស្សតាមកម្រិតថ្នាក់</span>
              </h2>

              <p class="text-[11px] text-slate-500 mt-0.5 break-words leading-snug">
                ចំនួនសិស្សតាម classGrade
              </p>
            </div>
          </div>

          <div class="chart-container">
            <canvas ref="studentDistChartCanvas"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  nextTick
} from "vue";
import api from "../config/api";
import { useAuth } from "../hooks/useAuth";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const khmerChartFontFamily =
  '"Noto Sans Khmer", "Khmer OS Battambang", "Battambang", "Khmer OS", system-ui, sans-serif';

const emit = defineEmits(["navigateTo"]);

const { user } = useAuth();

const studentsList = ref([]);
const teachersList = ref([]);
const classesList = ref([]);
const paymentsList = ref([]);

const isDashboardLoading = ref(false);
const isAttendanceLoading = ref(false);
const attendanceError = ref("");

let attendanceChartInstance = null;
let studentDistChartInstance = null;

const attendanceChartCanvas = ref(null);
const studentDistChartCanvas = ref(null);

const userRole = computed(() => {
  return String(user.value?.role || "").trim().toLowerCase();
});

const isAdmin = computed(() => userRole.value === "admin");

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.result)) return payload.result;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

const getErrorMessage = (err, fallback = "មានបញ្ហាក្នុងប្រព័ន្ធ") => {
  return (
    err.response?.data?.err ||
    err.response?.data?.message ||
    err.message ||
    fallback
  );
};

const safeGetList = async (endpoint, params = {}) => {
  try {
    const response = await api.get(endpoint, {
      params
    });

    return normalizeList(response.data);
  } catch (err) {
    return [];
  }
};

const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getCurrentWeekDays = () => {
  const today = new Date();
  const day = today.getDay();

  const mondayOffset = day === 0 ? -6 : 1 - day;

  const monday = new Date(today);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(today.getDate() + mondayOffset);

  const khmerLabels = ["ចន្ទ", "អង្គារ", "ពុធ", "ព្រហ", "សុក្រ"];

  return khmerLabels.map((label, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);

    return {
      label,
      date,
      dateKey: formatDateKey(date)
    };
  });
};

const normalizeAttendanceRecords = (payload) => {
  const data = payload?.result || payload?.data || payload;

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.records)) {
    return data.records;
  }

  if (Array.isArray(data?.attendances)) {
    return data.attendances;
  }

  if (Array.isArray(data?.students)) {
    return data.students;
  }

  return [];
};

const isPresentRecord = (record) => {
  if (record?.present === true) return true;
  if (record?.isPresent === true) return true;

  const status = String(
    record?.status ||
      record?.attendanceStatus ||
      record?.value ||
      ""
  )
    .trim()
    .toLowerCase();

  return [
    "present",
    "late",
    "វត្តមាន",
    "មករៀន",
    "យឺត"
  ].includes(status);
};

const fetchAttendanceByClassAndDate = async (classId, dateKey) => {
  const response = await api.get("/attendance", {
    params: {
      classId,
      date: dateKey,
      session: "morning"
    }
  });

  return normalizeAttendanceRecords(response.data);
};

const weeklyAttendanceData = ref({
  labels: [],
  percentages: [],
  totals: [],
  presents: []
});

const setEmptyWeeklyAttendance = async () => {
  weeklyAttendanceData.value = {
    labels: getCurrentWeekDays().map((day) => day.label),
    percentages: [0, 0, 0, 0, 0],
    totals: [0, 0, 0, 0, 0],
    presents: [0, 0, 0, 0, 0]
  };

  await nextTick();
  renderAttendanceChart();
};

const fetchWeeklyAttendance = async () => {
  if (!classesList.value.length) {
    await setEmptyWeeklyAttendance();
    return;
  }

  isAttendanceLoading.value = true;
  attendanceError.value = "";

  try {
    const days = getCurrentWeekDays();

    const dayResults = await Promise.all(
      days.map(async (day) => {
        let totalRecords = 0;
        let totalPresent = 0;

        await Promise.all(
          classesList.value.map(async (cls) => {
            try {
              const classId = cls._id || cls.id;

              if (!classId) return;

              const records = await fetchAttendanceByClassAndDate(
                classId,
                day.dateKey
              );

              totalRecords += records.length;
              totalPresent += records.filter(isPresentRecord).length;
            } catch (err) {
              // បើ class មួយមិនទាន់មាន attendance សម្រាប់ថ្ងៃនោះ មិនបង្ហាញ error ទេ
            }
          })
        );

        const percentage =
          totalRecords > 0
            ? Math.round((totalPresent / totalRecords) * 100)
            : 0;

        return {
          label: day.label,
          percentage,
          totalRecords,
          totalPresent
        };
      })
    );

    weeklyAttendanceData.value = {
      labels: dayResults.map((item) => item.label),
      percentages: dayResults.map((item) => item.percentage),
      totals: dayResults.map((item) => item.totalRecords),
      presents: dayResults.map((item) => item.totalPresent)
    };

    await nextTick();
    renderAttendanceChart();
  } catch (err) {
    attendanceError.value = getErrorMessage(
      err,
      "មិនអាចទាញយកទិន្នន័យវត្តមានបានទេ"
    );
  } finally {
    isAttendanceLoading.value = false;
  }
};

const fetchDashboardData = async () => {
  isDashboardLoading.value = true;

  try {
    const [students, classes] = await Promise.all([
      safeGetList("/students"),
      safeGetList("/classes")
    ]);

    studentsList.value = students;
    classesList.value = classes;

    if (isAdmin.value) {
      const [teachers, payments] = await Promise.all([
        safeGetList("/teachers"),
        safeGetList("/payments")
      ]);

      teachersList.value = teachers;
      paymentsList.value = payments;
    } else {
      teachersList.value = [];
      paymentsList.value = [];
    }

    await nextTick();

    renderStudentDistChart();
    await fetchWeeklyAttendance();
  } finally {
    isDashboardLoading.value = false;
  }
};

// គណនាចំណូលប្រចាំខែនេះ
const thisMonthRevenue = computed(() => {
  if (!isAdmin.value) return "-";
  if (!paymentsList.value) return null;
  if (paymentsList.value.length === 0) return "៛0";

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const total = paymentsList.value.reduce((sum, payment) => {
    if (payment.status === "paid") {
      const dateString = payment.payDate || payment.createdAt;

      if (dateString) {
        const dateToUse = new Date(dateString);

        if (
          dateToUse.getMonth() === currentMonth &&
          dateToUse.getFullYear() === currentYear
        ) {
          return sum + Number(payment.amount || payment.paidAmount || 0);
        }
      }
    }

    return sum;
  }, 0);

  return `៛${total.toLocaleString("en-US")}`;
});

// Stat Cards
const statCards = computed(() => {
  const cards = [
    {
      title: "សិស្សសរុប",
      value: studentsList.value ? studentsList.value.length : null,
      subtitle: "សិស្សកំពុងសិក្សា",
      icon: "fa-solid fa-user-graduate",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      targetMenu: "សិស្ស",
      roles: ["admin", "teacher"]
    },
    {
      title: "គ្រូបង្រៀន",
      value: teachersList.value ? teachersList.value.length : null,
      subtitle: "គ្រូសកម្ម",
      icon: "fa-solid fa-chalkboard-user",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      targetMenu: "គ្រូបង្រៀន",
      roles: ["admin"]
    },
    {
      title: "ថ្នាក់រៀន",
      value: classesList.value ? classesList.value.length : null,
      subtitle: "ឆ្នាំសិក្សាបច្ចុប្បន្ន",
      icon: "fa-solid fa-school",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      targetMenu: "ថ្នាក់",
      roles: ["admin", "teacher"]
    },
    {
      title: "ចំណូល",
      value: thisMonthRevenue.value,
      subtitle: "ប្រចាំខែនេះ",
      icon: "fa-solid fa-money-bill-wave",
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
      targetMenu: "បង់ប្រាក់",
      roles: ["admin"]
    }
  ];

  return cards.filter((card) => card.roles.includes(userRole.value));
});

function navigate(menuName) {
  if (menuName) emit("navigateTo", menuName);
}

// Chart 1: ចំនួនសិស្សតាមកម្រិតថ្នាក់
function renderStudentDistChart() {
  if (!studentDistChartCanvas.value) return;

  const gradeCounts = {};

  classesList.value.forEach((cls) => {
    const grade = cls.classGrade || "ផ្សេងៗ";
    const studentCount = Array.isArray(cls.students)
      ? cls.students.length
      : Number(cls.studentCount || 0);

    if (!gradeCounts[grade]) gradeCounts[grade] = 0;
    gradeCounts[grade] += studentCount;
  });

  const labels = Object.keys(gradeCounts);
  const data = Object.values(gradeCounts);

  const bgColors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6"
  ];

  if (studentDistChartInstance) {
    studentDistChartInstance.destroy();
  }

  const ctx = studentDistChartCanvas.value.getContext("2d");

  studentDistChartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels.length ? labels : ["មិនទាន់មានទិន្នន័យ"],
      datasets: [
        {
          data: data.length ? data : [1],
          backgroundColor: data.length ? bgColors : ["#e5e7eb"],
          hoverOffset: 8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        animateScale: true,
        animateRotate: true,
        duration: 1000
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 10,
            font: {
              family: khmerChartFontFamily,
              size: 10
            }
          }
        }
      }
    }
  });
}

// Chart 2: វត្តមានពី Backend ពិតៗ
function renderAttendanceChart() {
  if (!attendanceChartCanvas.value) return;

  const labels = weeklyAttendanceData.value.labels.length
    ? weeklyAttendanceData.value.labels
    : ["ចន្ទ", "អង្គារ", "ពុធ", "ព្រហ", "សុក្រ"];

  const data = weeklyAttendanceData.value.percentages.length
    ? weeklyAttendanceData.value.percentages
    : [0, 0, 0, 0, 0];

  if (attendanceChartInstance) {
    attendanceChartInstance.destroy();
  }

  const ctx = attendanceChartCanvas.value.getContext("2d");

  attendanceChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "វត្តមាន (%)",
          data,
          backgroundColor: "rgba(37, 99, 235, 0.65)",
          borderColor: "rgba(37, 99, 235, 1)",
          borderWidth: 1,
          borderRadius: 8,
          barThickness: 26
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        y: {
          duration: 1000,
          easing: "easeOutQuart"
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          titleFont: {
            family: khmerChartFontFamily
          },
          bodyFont: {
            family: khmerChartFontFamily
          },
          callbacks: {
            label: (context) => {
              const index = context.dataIndex;
              const percentage = weeklyAttendanceData.value.percentages[index] || 0;
              const present = weeklyAttendanceData.value.presents[index] || 0;
              const total = weeklyAttendanceData.value.totals[index] || 0;

              return `វត្តមាន ${percentage}% (${present}/${total})`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: (value) => `${value}%`,
            font: {
              family: khmerChartFontFamily,
              size: 10
            }
          }
        },
        x: {
          ticks: {
            font: {
              family: khmerChartFontFamily,
              size: 10
            }
          }
        }
      }
    }
  });
}

onMounted(() => {
  fetchDashboardData();
});

onBeforeUnmount(() => {
  if (attendanceChartInstance) {
    attendanceChartInstance.destroy();
  }

  if (studentDistChartInstance) {
    studentDistChartInstance.destroy();
  }
});
</script>

<style scoped>

.dashboard-page-mobile-safe {
  font-family: "Noto Sans Khmer", "Khmer OS Battambang", "Battambang", "Khmer OS", system-ui, sans-serif;
  line-height: 1.45;
}

.dashboard-page-mobile-safe h1,
.dashboard-page-mobile-safe h2,
.dashboard-page-mobile-safe p,
.dashboard-page-mobile-safe span,
.dashboard-page-mobile-safe button {
  line-height: 1.45;
}

.dashboard-page-mobile-safe .break-words {
  overflow-wrap: anywhere;
  word-break: break-word;
}

.chart-container {
  position: relative;
  height: 240px;
  width: 100%;
}

@media (min-width: 640px) {
  .chart-container {
    height: 260px;
  }
}

@media (min-width: 1280px) {
  .chart-container {
    height: 280px;
  }
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(18px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@media (max-width: 640px) {
  .dashboard-page-mobile-safe {
    padding-bottom: calc(2.75rem + env(safe-area-inset-bottom));
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }

  .dashboard-page-mobile-safe > .max-w-7xl {
    padding-bottom: calc(1.5rem + env(safe-area-inset-bottom));
  }
}

</style>