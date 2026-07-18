<template>
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="class-form-modal-overlay-mobile-safe fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-3"
      @click.self="handleClose"
    >
      <Transition name="scale">
        <div
          v-if="isOpen"
          class="class-form-modal-panel-mobile-safe bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col max-h-[86vh] border border-slate-100"
        >
          <!-- Header -->
          <div class="px-3 py-2.5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div>
              <h2 class="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <span class="h-6 w-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-[10px]">
                  <i :class="isEditing ? 'fa-solid fa-pen-to-square' : 'fa-solid fa-plus'"></i>
                </span>
                {{ isEditing ? 'កែប្រែព័ត៌មានថ្នាក់' : 'បង្កើតថ្នាក់ថ្មី' }}
              </h2>
              <p class="text-[10px] text-slate-500 mt-0.5">
                បំពេញព័ត៌មានថ្នាក់រៀនខាងក្រោម
              </p>
            </div>

            <button
              type="button"
              @click="handleClose"
              class="h-7 w-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <i class="fa-solid fa-xmark text-xs"></i>
            </button>
          </div>

          <!-- Form -->
          <div class="class-form-modal-body-mobile-safe overflow-y-auto flex-1 p-3">
            <form id="classForm" @submit.prevent="submitForm" class="space-y-3">

              <!-- Class Basic Info -->
              <div class="bg-white border border-slate-200 rounded-xl p-3">
                <div class="flex items-center gap-2 mb-2">
                  <span class="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[10px]">
                    <i class="fa-solid fa-school"></i>
                  </span>
                  <h3 class="text-xs font-extrabold text-slate-800">
                    ព័ត៌មានថ្នាក់
                  </h3>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                  <div class="sm:col-span-1">
                    <label class="form-label">
                      លេខថ្នាក់ <span class="text-red-500">*</span>
                    </label>
                    <input
                      ref="firstInput"
                      type="number"
                      v-model.number="form.classNumber"
                      placeholder="101"
                      required
                      class="form-input"
                    />
                  </div>

                  <div class="sm:col-span-3">
                    <label class="form-label">
                      ឈ្មោះថ្នាក់ <span class="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      v-model="form.className"
                      placeholder="ឧ. ភាសាអង់គ្លេស កម្រិតដំបូង"
                      required
                      class="form-input"
                    />
                  </div>
                </div>
              </div>

              <!-- Grade & Type -->
              <div class="bg-white border border-slate-200 rounded-xl p-3">
                <div class="flex items-center gap-2 mb-2">
                  <span class="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[10px]">
                    <i class="fa-solid fa-layer-group"></i>
                  </span>
                  <h3 class="text-xs font-extrabold text-slate-800">
                    កម្រិត និងប្រភេទថ្នាក់
                  </h3>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label class="form-label">
                      កម្រិត <span class="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      v-model="form.classGrade"
                      placeholder="Grade 10 / Year 1"
                      required
                      class="form-input"
                    />
                  </div>

                  <div>
                    <label class="form-label">
                      ប្រភេទថ្នាក់ <span class="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      v-model="form.typeOfClass"
                      placeholder="Part-time / Full-time"
                      required
                      class="form-input"
                    />
                  </div>
                </div>
              </div>

              <!-- Year & Time -->
              <div class="bg-white border border-slate-200 rounded-xl p-3">
                <div class="flex items-center gap-2 mb-2">
                  <span class="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[10px]">
                    <i class="fa-solid fa-clock"></i>
                  </span>
                  <h3 class="text-xs font-extrabold text-slate-800">
                    ឆ្នាំសិក្សា និងវេនសិក្សា
                  </h3>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label class="form-label">
                      ឆ្នាំសិក្សា <span class="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      v-model="form.yearOnStudy"
                      placeholder="2024-2025"
                      required
                      class="form-input"
                    />
                  </div>

                  <div>
                    <label class="form-label">
                      វេនសិក្សា <span class="text-red-500">*</span>
                    </label>
                    <select
                      v-model="form.timeStudy"
                      required
                      class="form-input"
                    >
                      <option disabled value="">ជ្រើសរើសវេន</option>
                      <option value="ព្រឹក">ព្រឹក</option>
                      <option value="ល្ងាច">ល្ងាច</option>
                      <option value="យប់">យប់</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Teacher & Status -->
              <div class="bg-white border border-slate-200 rounded-xl p-3">
                <div class="flex items-center gap-2 mb-2">
                  <span class="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[10px]">
                    <i class="fa-solid fa-chalkboard-user"></i>
                  </span>
                  <h3 class="text-xs font-extrabold text-slate-800">
                    គ្រូបង្រៀន និងស្ថានភាព
                  </h3>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label class="form-label">
                      គ្រូបង្រៀន
                    </label>
                    <select
                      v-model="form.teacher"
                      class="form-input"
                    >
                      <option value="">មិនទាន់មានគ្រូ</option>
                      <option
                        v-for="t in teachers"
                        :key="t._id"
                        :value="t._id"
                      >
                        {{ t.khmerName || t.englishName }}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label class="form-label">
                      ស្ថានភាព
                    </label>
                    <select
                      v-model="form.status"
                      class="form-input"
                    >
                      <option value="active">ដំណើរការ</option>
                      <option value="finished">បានបញ្ចប់</option>
                      <option value="archived">រក្សាទុក</option>
                    </select>
                  </div>
                </div>
              </div>

            </form>
          </div>

          <!-- Actions -->
          <div class="class-form-modal-footer-mobile-safe px-3 py-2.5 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              @click="handleClose"
              class="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              បោះបង់
            </button>

            <button
              type="submit"
              form="classForm"
              :disabled="isSubmitting"
              class="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm text-xs font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i
                v-if="isSubmitting"
                class="fa-solid fa-circle-notch fa-spin text-[10px]"
              ></i>
              <i
                v-else
                class="fa-solid fa-floppy-disk text-[10px]"
              ></i>
              {{ isEditing ? 'រក្សាទុក' : 'បង្កើត' }}
            </button>
          </div>

        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { ref, reactive, watch, nextTick, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  isEditing: Boolean,
  classData: Object,
  teachers: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'save'])

const isSubmitting = ref(false)
const firstInput = ref(null)


const originalViewportContent = ref("")
const viewportMetaWasCreated = ref(false)

const setNoZoomViewport = () => {
  if (typeof document === "undefined") return

  let viewportMeta = document.querySelector('meta[name="viewport"]')

  if (!viewportMeta) {
    viewportMeta = document.createElement("meta")
    viewportMeta.setAttribute("name", "viewport")
    document.head.appendChild(viewportMeta)
    viewportMetaWasCreated.value = true
  } else if (!originalViewportContent.value) {
    viewportMetaWasCreated.value = false
    originalViewportContent.value = viewportMeta.getAttribute("content") || ""
  }

  viewportMeta.setAttribute(
    "content",
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
  )
}

const restoreViewport = () => {
  if (typeof document === "undefined") return

  const viewportMeta = document.querySelector('meta[name="viewport"]')

  if (!viewportMeta) return

  if (viewportMetaWasCreated.value) {
    viewportMeta.remove()
    return
  }

  viewportMeta.setAttribute(
    "content",
    originalViewportContent.value || "width=device-width, initial-scale=1"
  )
}

const initialForm = {
  classNumber: '',
  className: '',
  classGrade: '',
  typeOfClass: '',
  yearOnStudy: '',
  timeStudy: '',
  teacher: '',
  status: 'active'
}

const form = reactive({ ...initialForm })

watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    setNoZoomViewport()
    isSubmitting.value = false

    if (props.isEditing && props.classData) {
      Object.assign(form, {
        classNumber: props.classData.classNumber,
        className: props.classData.className,
        classGrade: props.classData.classGrade,
        typeOfClass: props.classData.typeOfClass,
        yearOnStudy: props.classData.yearOnStudy,
        timeStudy: props.classData.timeStudy,
        status: props.classData.status || 'active',
      })

      form.teacher = props.classData.teacher
        ? (typeof props.classData.teacher === 'object' ? props.classData.teacher._id : props.classData.teacher)
        : ''
    } else {
      Object.assign(form, initialForm)
    }

    await nextTick()
    if (firstInput.value) firstInput.value.focus()
  } else {
    restoreViewport()
  }
})

const submitForm = async () => {
  isSubmitting.value = true

  const payload = { ...form }

  if (props.isEditing && props.classData?._id) {
    payload._id = props.classData._id
  }

  emit('save', payload)

  setTimeout(() => isSubmitting.value = false, 2000)
}

const handleClose = () => {
  restoreViewport()
  emit('close')
}

const onKeydown = (e) => {
  if (e.key === 'Escape' && props.isOpen) handleClose()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  restoreViewport()
  window.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>

/* Chrome mobile bottom toolbar fix + no visual input-size changes */
@media (max-width: 640px) {
  .class-form-modal-overlay-mobile-safe {
    min-height: 100vh;
    min-height: 100dvh;
    align-items: flex-end;
    padding-bottom: calc(0.5rem + env(safe-area-inset-bottom));
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }

  .class-form-modal-panel-mobile-safe {
    max-height: calc(100vh - 0.75rem);
    max-height: calc(100dvh - 0.75rem);
  }

  .class-form-modal-body-mobile-safe {
    max-height: calc(100vh - 8.5rem);
    max-height: calc(100dvh - 8.5rem);
    -webkit-overflow-scrolling: touch;
  }

  .class-form-modal-footer-mobile-safe {
    position: sticky;
    bottom: 0;
    z-index: 5;
    padding-bottom: calc(0.65rem + env(safe-area-inset-bottom)) !important;
  }
}

.form-label {
  display: block;
  font-size: 0.68rem;
  font-weight: 700;
  color: #475569;
  margin-bottom: 0.2rem;
}

.form-input {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.42rem 0.6rem;
  font-size: 0.75rem;
  color: #334155;
  background: #ffffff;
  outline: none;
  min-height: 2rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.12);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s ease;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
</style>