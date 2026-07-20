<template>
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="class-form-modal-overlay-mobile-safe fixed inset-0 z-50 flex items-stretch sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-0 sm:p-3"
      @click.self="handleClose"
    >
      <Transition name="scale">
        <div
          v-if="isOpen"
          class="class-form-modal-panel-mobile-safe bg-white rounded-none sm:rounded-xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col h-[100dvh] sm:h-auto max-h-[100dvh] sm:max-h-[86vh] border-0 sm:border sm:border-slate-100"
        >
          <!-- Header -->
          <div class="px-3 py-2.5 border-b border-slate-100 flex justify-between items-start gap-2 bg-slate-50 shrink-0">
            <div class="min-w-0">
              <h2 class="text-base sm:text-sm font-extrabold text-slate-800 flex items-start gap-2 leading-snug">
                <span class="h-6 w-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-[10px]">
                  <i :class="isEditing ? 'fa-solid fa-pen-to-square' : 'fa-solid fa-plus'"></i>
                </span>
                <span class="break-words leading-snug">{{ isEditing ? 'កែប្រែព័ត៌មានថ្នាក់' : 'បង្កើតថ្នាក់ថ្មី' }}</span>
              </h2>
              <p class="text-xs sm:text-[10px] text-slate-500 mt-0.5 break-words leading-snug">
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
          <div class="class-form-modal-body-mobile-safe overflow-y-auto flex-1 min-h-0 p-3 modal-scroll">
            <form id="classForm" @submit.prevent="submitForm" class="space-y-3">

              <!-- Class Basic Info -->
              <div class="bg-white border border-slate-200 rounded-xl p-3">
                <div class="flex items-center gap-2 mb-2">
                  <span class="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[10px]">
                    <i class="fa-solid fa-school"></i>
                  </span>
                  <h3 class="text-sm sm:text-xs font-extrabold text-slate-800">
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
                  <h3 class="text-sm sm:text-xs font-extrabold text-slate-800">
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
                  <h3 class="text-sm sm:text-xs font-extrabold text-slate-800">
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
                  <h3 class="text-sm sm:text-xs font-extrabold text-slate-800">
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
          <div class="class-form-modal-footer-mobile-safe px-3 py-2.5 bg-slate-50 border-t border-slate-100 flex justify-end gap-2 shrink-0">
            <button
              type="button"
              @click="handleClose"
              class="px-3 py-1.5 text-sm sm:text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              បោះបង់
            </button>

            <button
              type="submit"
              form="classForm"
              :disabled="isSubmitting"
              class="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm text-sm sm:text-xs font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
const lockedScrollY = ref(0)
const originalBodyStyles = ref(null)

const lockPageScroll = () => {
  if (typeof document === "undefined" || originalBodyStyles.value) return

  lockedScrollY.value = window.scrollY || window.pageYOffset || 0
  originalBodyStyles.value = {
    overflow: document.body.style.overflow,
    position: document.body.style.position,
    top: document.body.style.top,
    width: document.body.style.width,
    paddingRight: document.body.style.paddingRight
  }

  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

  document.body.style.overflow = "hidden"
  document.body.style.position = "fixed"
  document.body.style.top = `-${lockedScrollY.value}px`
  document.body.style.width = "100%"

  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`
  }
}

const unlockPageScroll = () => {
  if (typeof document === "undefined" || !originalBodyStyles.value) return

  const styles = originalBodyStyles.value
  document.body.style.overflow = styles.overflow
  document.body.style.position = styles.position
  document.body.style.top = styles.top
  document.body.style.width = styles.width
  document.body.style.paddingRight = styles.paddingRight

  window.scrollTo(0, lockedScrollY.value)
  originalBodyStyles.value = null
}

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

const getCurrentAcademicYear = () => {
  const currentYear = new Date().getFullYear()
  return `${currentYear}-${currentYear + 1}`
}

const initialForm = {
  classNumber: '',
  className: '',
  classGrade: '',
  typeOfClass: '',
  yearOnStudy: getCurrentAcademicYear(),
  timeStudy: '',
  teacher: '',
  status: 'active'
}

const form = reactive({ ...initialForm })

watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    setNoZoomViewport()
    lockPageScroll()
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
      Object.assign(form, { ...initialForm, yearOnStudy: getCurrentAcademicYear() })
    }

    await nextTick()
    if (firstInput.value) firstInput.value.focus()
  } else {
    restoreViewport()
    unlockPageScroll()
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
  unlockPageScroll()
  emit('close')
}

const onKeydown = (e) => {
  if (e.key === 'Escape' && props.isOpen) handleClose()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  restoreViewport()
  unlockPageScroll()
  window.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
.class-form-modal-panel-mobile-safe {
  font-family: "Noto Sans Khmer", "Khmer OS Battambang", "Battambang", "Khmer OS", system-ui, sans-serif;
  line-height: 1.45;
}

.class-form-modal-panel-mobile-safe h2,
.class-form-modal-panel-mobile-safe h3,
.class-form-modal-panel-mobile-safe p,
.class-form-modal-panel-mobile-safe span,
.class-form-modal-panel-mobile-safe label,
.class-form-modal-panel-mobile-safe button,
.class-form-modal-panel-mobile-safe input,
.class-form-modal-panel-mobile-safe select,
.class-form-modal-panel-mobile-safe textarea,
.class-form-modal-panel-mobile-safe option {
  font-family: "Noto Sans Khmer", "Khmer OS Battambang", "Battambang", "Khmer OS", system-ui, sans-serif;
  line-height: 1.45;
}

.class-form-modal-panel-mobile-safe .break-words,
.form-label {
  overflow-wrap: anywhere;
  word-break: break-word;
}

.form-label {
  display: block;
  font-size: 13px;
  line-height: 1.45;
  font-weight: 700;
  color: #475569;
  margin-bottom: 0.25rem;
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
}

.form-input {
  width: 100%;
  min-height: 35px;
  height: 35px;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0 0.625rem;
  font-size: 14px;
  line-height: 1.45;
  font-weight: 500;
  color: #334155;
  background: #ffffff;
  outline: none;
  transition: all 0.2s ease;
  -webkit-font-smoothing: antialiased;
  text-rendering: geometricPrecision;
}

.form-input::placeholder {
  font-family: inherit;
  font-size: 14px;
  line-height: 1.45;
}

select.form-input,
input[type="date"].form-input,
input[type="number"].form-input,
input[type="text"].form-input {
  min-height: 35px;
  height: 35px;
  padding-top: 0;
  padding-bottom: 0;
}

input[type="date"].form-input {
  appearance: none;
  -webkit-appearance: none;
}

.form-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.12);
}

.modal-scroll {
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

.modal-scroll::-webkit-scrollbar {
  width: 4px;
}

.modal-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 999px;
}

.modal-scroll::-webkit-scrollbar-track {
  background: transparent;
}

/* Mobile only: full-height modal with fixed header/footer and scrollable fields. */
@media (max-width: 639px) {
  .class-form-modal-overlay-mobile-safe {
    width: 100vw;
    height: 100vh;
    height: 100dvh;
    min-height: 100vh;
    min-height: 100dvh;
    align-items: stretch;
    padding: 0 !important;
    overscroll-behavior: none;
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }

  .class-form-modal-panel-mobile-safe {
    width: 100%;
    height: 100vh;
    height: 100dvh;
    max-height: 100vh !important;
    max-height: 100dvh !important;
    border: 0;
    border-radius: 0;
  }

  .class-form-modal-body-mobile-safe {
    flex: 1 1 auto;
    min-height: 0;
    max-height: none;
    overflow-y: auto;
    padding-bottom: 0.75rem;
  }

  .class-form-modal-footer-mobile-safe {
    position: relative;
    z-index: 5;
    padding-bottom: calc(0.625rem + env(safe-area-inset-bottom)) !important;
    box-shadow: 0 -8px 20px rgb(15 23 42 / 0.05);
  }

  .class-form-modal-footer-mobile-safe button {
    min-height: 35px;
    font-size: 14px;
    line-height: 1.2;
  }
}

/* Preserve the original desktop sizing and layout from sm and above. */
@media (min-width: 640px) {
  .form-label {
    font-size: 0.68rem;
    margin-bottom: 0.2rem;
  }

  .form-input,
  select.form-input,
  input[type="date"].form-input,
  input[type="number"].form-input,
  input[type="text"].form-input {
    min-height: 2.65rem;
    height: 2.65rem;
    padding: 0.58rem 0.6rem;
    font-size: 12px;
    line-height: 1.9;
  }

  .form-input::placeholder {
    font-size: 12px;
    line-height: 1.9;
  }
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
