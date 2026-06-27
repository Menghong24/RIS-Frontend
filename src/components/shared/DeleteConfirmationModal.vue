<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-3"
    role="dialog"
    aria-modal="true"
  >
    <!-- Prevent background click from closing -->
    <div
      @click.stop
      class="bg-white rounded-xl shadow-xl w-full max-w-sm border border-slate-100 overflow-hidden"
    >
      <!-- Header -->
      <div class="px-4 py-3 bg-red-50 border-b border-red-100 flex items-center gap-3">
        <div class="h-10 w-10 rounded-full bg-white text-red-600 flex items-center justify-center shadow-sm border border-red-100">
          <i class="fa-solid fa-trash text-base"></i>
        </div>

        <div class="min-w-0 text-left">
          <h2 class="text-sm font-extrabold text-slate-800 truncate">
            {{ title }}
          </h2>
          <p class="text-[11px] text-red-600 font-bold mt-0.5">
            សកម្មភាពលុប
          </p>
        </div>
      </div>

      <!-- Body -->
      <div class="p-4 text-left">
        <p class="text-xs text-slate-600 leading-relaxed">
          {{ message }}

          <span
            v-if="itemName"
            class="font-extrabold text-slate-800"
          >
            {{ itemName }}
          </span>

          <span>
            ? សកម្មភាពនេះអ្នកមិនអាចត្រឡប់ក្រោយបានទេ។
          </span>
        </p>
      </div>

      <!-- Actions -->
      <div class="px-4 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
        <button
          @click="$emit('close')"
          class="px-3.5 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition"
        >
          បោះបង់
        </button>

        <button
          @click="$emit('confirm')"
          class="px-3.5 py-1.5 text-xs font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition shadow-sm flex items-center gap-1.5"
        >
          <i class="fa-solid fa-trash text-[10px]"></i>
          លុប
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: { type: Boolean, default: false },
  title: { type: String, default: 'លុបមែនទេ?' },
  message: { type: String, default: 'តើអ្នកប្រាកដទេថាចង់លុប' },
  itemName: { type: String, default: '' },
})

defineEmits(['close', 'confirm'])
</script>