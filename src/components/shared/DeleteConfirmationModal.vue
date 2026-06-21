<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50"
    role="dialog"
    aria-modal="true"
  >
    <!-- Prevent background click from closing -->
    <div
      @click.stop
      class="bg-white/10 rounded-xl shadow-3xl p-2 w-full max-w-md text-center transform transition-all border border-white/80">
      <div class="bg-white/60 p-6 rounded-md">
      <div class="flex gap-4 justify-start">
        <!-- Icon -->
      <div class=" bg-white/30 rounded-full h-14 w-14 flex items-center justify-center">
        <Trash2 class="h-8 w-8 text-red-600" />
      </div>
      
       <!-- Title -->
      <h2 class="text-2xl font-bold my-4 text-gray-900">
        {{ title }}
      </h2>
      </div>
      

     

      <!-- Message -->
      <p class="text-gray-600">
        {{ message }}
        <span v-if="itemName" class="font-semibold text-gray-800">
          {{ itemName }}
        </span>
        ? សកម្មភាពនេះអ្នកមិនអាចត្រឡប់ក្រោយបានទេ.
      </p>

      <!-- Buttons -->
      <div class="mt-8 flex justify-end space-x-4">
        <button
          @click="$emit('close')"
          class="bg-gray-300 text-gray-700 font-semibold px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>

        <button
          @click="$emit('confirm')"
          class="bg-red-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Trash2 } from 'lucide-vue-next'

defineProps({
  isOpen: { type: Boolean, default: false },
  title: { type: String, default: 'Delete Item?' },
  message: { type: String, default: 'ប្រាដកទេថាចង់លុប' },
  itemName: { type: String, default: '' },
})

defineEmits(['close', 'confirm'])
</script>
