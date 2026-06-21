<template>
  <tr 
    class="border-b border-gray-100 hover:bg-blue-50 transition-colors cursor-pointer group"
    @click="$emit('view', student)"
  >
    <td class="p-2 w-16">
      <img 
        :src="student.photo || placeholderAvatar" 
        class="w-10 h-10 rounded-full object-cover border border-gray-200" 
        :alt="`${student.khmerName} ${student.englishName}`"
      />
    </td>

    <td class="p-2 text-gray-700 text-sm font-medium hidden lg:table-cell">
      {{ student.studentId }}
    </td>

    <td class="p-2 text-gray-800 text-sm font-khmer">
      {{ student.khmerName }} 
    </td>

    <td class="p-2 text-gray-800 text-sm hidden lg:table-cell">
     {{ student.englishName }}
    </td>

    <td class="p-2 text-gray-600 text-sm hidden lg:table-cell">
      <span :class="student.gender === 'ស្រី' ? 'text-pink-600 bg-pink-50 px-2 py-0.5 rounded' : 'text-blue-600 bg-blue-50 px-2 py-0.5 rounded'">
        {{ student.gender }}
      </span>
    </td>

    <td class="p-2 text-gray-600 text-sm hidden lg:table-cell">
      {{ formatDate(student.birthDate) }}
    </td>

    <td class="p-2 text-gray-600 text-sm hidden lg:table-cell">
      {{ student.nationality?.student || 'Cambodian' }}
    </td>

    <td class="p-2 text-gray-600 text-sm hidden lg:table-cell">
      {{ student.phone }}
    </td>

    <td class="p-2 text-gray-600 text-sm hidden lg:table-cell">
      <span v-if="student.grade && typeof student.grade === 'object'" class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">
         {{ student.grade.className }}
      </span>
    </td>

    <td class="p-2 text-gray-600 text-sm hidden lg:table-cell">
      <span v-if="student.grade && typeof student.grade === 'object'" class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">
         {{ student.grade.classGrade }}
      </span>
    </td>

    <td class="p-2 text-right w-14">
       <button 
         @click.stop="$emit('edit', student)"
         class="inline-flex items-center justify-center p-2 bg-gray-100 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
         title="Edit"
       >
         <FilePenLine class="w-4 h-4" />
       </button>
    </td>
  
    <td class="p-2 text-right pr-4 w-14">
       <button 
         @click.stop="$emit('delete', student)"
         class="inline-flex items-center justify-center p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition"
         title="Delete"
       >
         <Trash2 class="w-4 h-4" />
       </button>
    </td>
  </tr>
</template>

<script setup>
import { computed } from 'vue'
import { FilePenLine, Trash2 } from 'lucide-vue-next'

const props = defineProps({
  student: {
    type: Object,
    required: true
  }
})

defineEmits(['view', 'edit', 'delete'])

const placeholderAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4cXH1syfrG2BHeN176taDZCnbb5AiP5Y9sw&s'

const formatDate = (date) => {
  if (!date) return '-'
  const d = new Date(date)
  return d.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })
}

const isActive = computed(() => {
   const s = props.student.status?.toLowerCase();
   return s === 'active';
})
</script>

<style scoped>
.font-khmer {
  font-family: 'Battambang', 'Siemreap', sans-serif;
}
</style>