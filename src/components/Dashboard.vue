<template>
  <div class=" bg-slate-50 p-3 md:p-4 animate-fade-in-up">
    <div class="max-w-7xl mx-auto space-y-4">
      <!-- Header -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-3 md:p-4">
        <div>
          <h1 class="text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <span class="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-sm">
              <i class="fa-solid fa-gauge-high"></i>
            </span>
            ផ្ទាំងគ្រប់គ្រងសាលា
          </h1>
          <p class="text-xs text-slate-500 mt-1">
            សង្ខេបចំនួនសិស្ស គ្រូ ថ្នាក់រៀន ចំណូល និងរបាយការណ៍សំខាន់ៗ
          </p>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="(stat, index) in statCards"
          :key="stat.title"
          class="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 cursor-pointer p-3 animate-fade-in-up"
          :style="{ animationDelay: `${index * 100}ms` }"
          @click="navigate(stat.targetMenu)"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="text-xs font-bold text-slate-500 truncate">
                {{ stat.title }}
              </p>

              <p class="text-2xl font-extrabold text-slate-900 mt-1">
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

              <p class="text-[11px] text-slate-400 mt-0.5">
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
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div
          class="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-3 md:p-4 animate-fade-in-up"
          style="animation-delay: 500ms;"
        >
          <div class="flex items-center justify-between gap-2 mb-3">
            <div>
              <h2 class="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <span class="h-7 w-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs">
                  <i class="fa-solid fa-chart-column"></i>
                </span>
                វត្តមានសិស្សប្រចាំសប្តាហ៍
              </h2>
              <p class="text-[11px] text-slate-500 mt-0.5">
                ភាគរយវត្តមានតាមថ្ងៃ
              </p>
            </div>
          </div>

          <div class="chart-container">
            <canvas ref="attendanceChartCanvas"></canvas>
          </div>
        </div>

        <div
          class="bg-white rounded-xl border border-slate-200 shadow-sm p-3 md:p-4 animate-fade-in-up"
          style="animation-delay: 650ms;"
        >
          <div class="flex items-center justify-between gap-2 mb-3">
            <div>
              <h2 class="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <span class="h-7 w-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs">
                  <i class="fa-solid fa-chart-pie"></i>
                </span>
                សិស្សតាមកម្រិតថ្នាក់
              </h2>
              <p class="text-[11px] text-slate-500 mt-0.5">
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
import { ref, onMounted, computed, watch } from 'vue';
import { useQuery } from '../hooks/useQuery';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const emit = defineEmits(['navigateTo']);

// ទាញយកទិន្នន័យពី Backend
const { data: studentsList } = useQuery('students');
const { data: teachersList } = useQuery('teachers');
const { data: classesList } = useQuery('classes');
const { data: attendancesList } = useQuery('attendances');
const { data: paymentsList } = useQuery('payments');

// Chart Instances
let attendanceChartInstance = null;
let studentDistChartInstance = null;

const attendanceChartCanvas = ref(null);
const studentDistChartCanvas = ref(null);

// គណនាចំណូលប្រចាំខែនេះ
const thisMonthRevenue = computed(() => {
  if (!paymentsList.value) return null;
  if (paymentsList.value.length === 0) return '៛0';

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const total = paymentsList.value.reduce((sum, payment) => {
    if (payment.status === 'paid') {
      const dateString = payment.payDate || payment.createdAt;

      if (dateString) {
        const dateToUse = new Date(dateString);

        if (
          dateToUse.getMonth() === currentMonth &&
          dateToUse.getFullYear() === currentYear
        ) {
          return sum + (payment.amount || 0);
        }
      }
    }

    return sum;
  }, 0);

  return `៛${total.toLocaleString('en-US')}`;
});

// Stat Cards
const statCards = computed(() => [
  {
    title: 'សិស្សសរុប',
    value: studentsList.value ? studentsList.value.length : null,
    subtitle: 'សិស្សកំពុងសិក្សា',
    icon: 'fa-solid fa-user-graduate',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    targetMenu: 'សិស្ស'
  },
  {
    title: 'គ្រូបង្រៀន',
    value: teachersList.value ? teachersList.value.length : null,
    subtitle: 'គ្រូសកម្ម',
    icon: 'fa-solid fa-chalkboard-user',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    targetMenu: 'គ្រូបង្រៀន'
  },
  {
    title: 'ថ្នាក់រៀន',
    value: classesList.value ? classesList.value.length : null,
    subtitle: 'ឆ្នាំសិក្សាបច្ចុប្បន្ន',
    icon: 'fa-solid fa-school',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
    targetMenu: 'ថ្នាក់'
  },
  {
    title: 'ចំណូល',
    value: thisMonthRevenue.value,
    subtitle: 'ប្រចាំខែនេះ',
    icon: 'fa-solid fa-money-bill-wave',
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600',
    targetMenu: 'Finance'
  }
]);

function navigate(menuName) {
  if (menuName) emit('navigateTo', menuName);
}

// Chart 1: ចំនួនសិស្សតាមកម្រិតថ្នាក់
function renderStudentDistChart() {
  if (!studentDistChartCanvas.value || !classesList.value) return;

  const gradeCounts = {};

  classesList.value.forEach(cls => {
    const grade = cls.classGrade || 'ផ្សេងៗ';
    const studentCount = cls.students ? cls.students.length : 0;

    if (!gradeCounts[grade]) gradeCounts[grade] = 0;
    gradeCounts[grade] += studentCount;
  });

  const labels = Object.keys(gradeCounts);
  const data = Object.values(gradeCounts);

  const bgColors = [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#ec4899',
    '#14b8a6'
  ];

  if (studentDistChartInstance) {
    studentDistChartInstance.destroy();
  }

  const ctx = studentDistChartCanvas.value.getContext('2d');

  studentDistChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels.length ? labels : ['មិនទាន់មានទិន្នន័យ'],
      datasets: [{
        data: data.length ? data : [1],
        backgroundColor: data.length ? bgColors : ['#e5e7eb'],
        hoverOffset: 8
      }]
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
          position: 'bottom',
          labels: {
            boxWidth: 10,
            font: {
              size: 10
            }
          }
        }
      },
    }
  });
}

// Chart 2: វត្តមាន
function renderAttendanceChart() {
  if (!attendanceChartCanvas.value) return;

  const labels = ['ចន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហ', 'សុក្រ'];
  const data = [95, 92, 96, 98, 94];

  if (attendanceChartInstance) {
    attendanceChartInstance.destroy();
  }

  const ctx = attendanceChartCanvas.value.getContext('2d');

  attendanceChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'វត្តមាន (%)',
        data,
        backgroundColor: 'rgba(37, 99, 235, 0.6)',
        borderColor: 'rgba(37, 99, 235, 1)',
        borderWidth: 1,
        borderRadius: 6,
        barThickness: 26,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        y: {
          duration: 1000,
          easing: 'easeOutQuart'
        }
      },
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            font: {
              size: 10
            }
          }
        },
        x: {
          ticks: {
            font: {
              size: 10
            }
          }
        }
      },
    }
  });
}

watch(classesList, (newData) => {
  if (newData && newData.length > 0) {
    renderStudentDistChart();
  }
}, { deep: true });

onMounted(() => {
  renderStudentDistChart();
  renderAttendanceChart();
});
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 260px;
  width: 100%;
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
</style>