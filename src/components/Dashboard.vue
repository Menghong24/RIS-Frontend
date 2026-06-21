<template>
  <div class="animate-fade-in-up">
    <h1 class="text-2xl font-bold text-blue-600 font-khmer">ផ្ទាំងគ្រប់គ្រងសាលា</h1>

    <div class="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="(stat, index) in statCards"
        :key="stat.title"
        class="p-6 bg-white rounded-xl shadow-md flex items-center justify-between hover:ring-2 hover:scale-[1.05] transition-all duration-300 cursor-pointer animate-fade-in-up"
        :class="`hover:ring-${stat.color}-500`"
        :style="{ animationDelay: `${index * 150}ms` }"
        @click="navigate(stat.targetMenu)"
      >
        <div>
          <p class="text-sm font-medium text-gray-500">{{ stat.title }}</p>
          <p class="text-3xl font-bold text-gray-900 mt-1">
            <span v-if="stat.value === null" class="animate-pulse text-gray-300">...</span>
            <span v-else>{{ stat.value }}</span>
          </p>
          <p class="text-sm text-gray-500 mt-1">{{ stat.subtitle }}</p>
        </div>
        
        <div class="p-4 rounded-full transition-transform duration-300 hover:rotate-12" :class="stat.bgColor">
          <component :is="stat.icon" class="w-7 h-7" :class="stat.iconColor" />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-3">
      <div 
        class="lg:col-span-2 p-6 bg-white rounded-xl shadow-md animate-fade-in-up" 
        style="animation-delay: 600ms;"
      >
        <h2 class="text-xl font-semibold text-gray-800 font-khmer">វត្តមានសិស្សប្រចាំសប្តាហ៍</h2>
        <div class="chart-container mt-4">
          <canvas ref="attendanceChartCanvas"></canvas>
        </div>
      </div>

      <div 
        class="p-6 bg-white rounded-xl shadow-md animate-fade-in-up" 
        style="animation-delay: 750ms;"
      >
        <h2 class="text-xl font-semibold text-gray-800 font-khmer">ចំនួនសិស្សតាមកម្រិតថ្នាក់</h2>
        <div class="chart-container mt-4">
          <canvas ref="studentDistChartCanvas"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useQuery } from '../hooks/useQuery';
import { Chart, registerables } from 'chart.js';
import { 
  Users, 
  GraduationCap, 
  CalendarDays, 
  Banknote 
} from 'lucide-vue-next';

Chart.register(...registerables);

const emit = defineEmits(['navigateTo']);

// 1. ទាញយកទិន្នន័យពិតពី Backend
const { data: studentsList } = useQuery('students');
const { data: teachersList } = useQuery('teachers');
const { data: classesList } = useQuery('classes');
const { data: attendancesList } = useQuery('attendances');
const { data: paymentsList } = useQuery('payments');

// 2. State សម្រាប់ផ្ទុក Chart Instances
let attendanceChartInstance = null;
let studentDistChartInstance = null;

const attendanceChartCanvas = ref(null);
const studentDistChartCanvas = ref(null);

// 3. បង្កើត Computed Property ដើម្បីគណនាចំណូលប្រចាំខែនេះ
const thisMonthRevenue = computed(() => {
  // បើទិន្នន័យមិនទាន់លោតមកដល់ទេ អោយវាបង្ហាញ null ដើម្បីចេញ Loading (សញ្ញា ...)
  if (!paymentsList.value) return null;
  // បើមានទិន្នន័យ តែគ្មានការបង់ប្រាក់សោះ នោះស្មើ $0
  if (paymentsList.value.length === 0) return '$0';

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const total = paymentsList.value.reduce((sum, payment) => {
    // គណនាតែអ្នកដែលបង់លុយហើយ (paid)
    if (payment.status === 'paid') {
      // យក payDate មកប្រើ បើអត់មានយក createdAt (Fallback)
      const dateString = payment.payDate || payment.createdAt;
      if (dateString) {
        const dateToUse = new Date(dateString);
        // ឆែកមើលថាតើការបង់ប្រាក់នេះនៅក្នុងខែ និងឆ្នាំបច្ចុប្បន្នដែរឬទេ
        if (dateToUse.getMonth() === currentMonth && dateToUse.getFullYear() === currentYear) {
          return sum + (payment.amount || 0);
        }
      }
    }
    return sum;
  }, 0);

  // បំប្លែងតួលេខទៅជាទម្រង់លុយ
  return `$${total.toLocaleString('en-US')}`;
});

// 4. Computed Stat Cards
const statCards = computed(() => [
  {
    title: 'សិស្សសរុប (Total Students)',
    value: studentsList.value ? studentsList.value.length : null,
    subtitle: 'Active Students',
    icon: GraduationCap,
    color: 'blue',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    targetMenu: 'សិស្ស' 
  },
  {
    title: 'គ្រូបង្រៀន (Total Teachers)',
    value: teachersList.value ? teachersList.value.length : null,
    subtitle: 'Active Teachers',
    icon: Users,
    color: 'green',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    targetMenu: 'គ្រូបង្រៀន'
  },
  {
    title: 'ថ្នាក់រៀន (Total Classes)',
    value: classesList.value ? classesList.value.length : null,
    subtitle: 'This Academic Year',
    icon: CalendarDays,
    color: 'purple',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
    targetMenu: 'ថ្នាក់'
  },
  {
    title: 'ចំណូល (Revenue)',
    value: thisMonthRevenue.value, // បានភ្ជាប់ជាមួយទិន្នន័យពិត!
    subtitle: 'This Month',
    icon: Banknote,
    color: 'orange',
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600',
    targetMenu: 'Finance'
  }
]);

function navigate(menuName) {
  if (menuName) emit('navigateTo', menuName);
}

// 5. អនុគមន៍គូរ Chart ទី១៖ ចំនួនសិស្សតាមថ្នាក់
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
  const bgColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

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
        hoverOffset: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        animateScale: true,
        animateRotate: true,
        duration: 1500,
        easing: 'easeOutBounce'
      },
      plugins: { legend: { position: 'bottom' } },
    }
  });
}

// 6. អនុគមន៍គូរ Chart ទី២៖ វត្តមាន
function renderAttendanceChart() {
  if (!attendanceChartCanvas.value) return;

  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const data = [95, 92, 96, 98, 94];

  if (attendanceChartInstance) {
    attendanceChartInstance.destroy();
  }

  const ctx = attendanceChartCanvas.value.getContext('2d');
  attendanceChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Attendance (%)',
        data: data,
        backgroundColor: 'rgba(37, 99, 235, 0.6)',
        borderColor: 'rgba(37, 99, 235, 1)',
        borderWidth: 1,
        borderRadius: 6,
        barThickness: 30,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        y: {
          duration: 1200,
          easing: 'easeOutQuart'
        }
      },
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, max: 100 } },
    }
  });
}

// 7. រង់ចាំតាមដានមើលទិន្នន័យ (Watchers)
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
  height: 320px;
  width: 100%;
}

/* Custom Keyframe Animations */
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>