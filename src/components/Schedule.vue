<template>
  <div class="bg-slate-50 p-2 sm:p-3 md:p-4 text-slate-800">
    <div class="max-w-7xl mx-auto space-y-3 md:space-y-4">
      <!-- Header -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm px-2.5 sm:px-3 py-3 md:px-4">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 md:gap-3">
          <div class="flex items-start gap-2.5 min-w-0">
            <div class="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 text-xs sm:text-sm">
              <i class="fa-solid fa-calendar-days"></i>
            </div>

            <div class="min-w-0">
              <h1 class="text-base sm:text-lg md:text-xl font-extrabold text-slate-800 leading-tight truncate">
                {{ classFilter ? `កាលវិភាគ - ${selectedClassName}` : "ជ្រើសរើសថ្នាក់" }}
              </h1>

              <p class="text-[11px] sm:text-xs text-slate-500 mt-1 truncate">
                {{
                  classFilter
                    ? "គ្រប់គ្រងម៉ោងសិក្សា មុខវិជ្ជា គ្រូបង្រៀន និងបន្ទប់រៀនតាមថ្ងៃ"
                    : "ជ្រើសរើសថ្នាក់មួយ ដើម្បីមើល ឬបង្កើតកាលវិភាគសិក្សា"
                }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-2 md:flex md:items-center gap-2 w-full md:w-auto">
            <button
              v-if="classFilter"
              type="button"
              @click="goBackToClasses"
              :disabled="loading || isSaving || isDeleting"
              class="inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-extrabold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="fa-solid fa-arrow-left text-[10px]"></i>
              ត្រឡប់ក្រោយ
            </button>

            <button
              v-if="classFilter"
              type="button"
              @click="openCreateModal"
              :disabled="loading || isSaving || isDeleting"
              class="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="fa-solid fa-plus text-[10px]"></i>
              បន្ថែមកាលវិភាគ
            </button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div
        v-if="loading && !classFilter"
        class="bg-white rounded-xl border border-slate-200 shadow-sm py-10 sm:py-12 flex flex-col items-center justify-center"
      >
        <div class="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <i class="fa-solid fa-circle-notch fa-spin text-lg"></i>
        </div>

        <p class="text-xs font-bold text-slate-500 mt-3">
          កំពុងទាញយកទិន្នន័យ...
        </p>
      </div>

      <!-- Class Selection -->
      <template v-else-if="!classFilter">
        <!-- Search -->
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-2.5 sm:p-3">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 md:gap-3">
            <div class="relative flex-1 w-full">
              <i class="search-icon fa-solid fa-magnifying-glass"></i>

              <input
                v-model="classSearchQuery"
                type="text"
                placeholder="ស្វែងរកថ្នាក់តាមឈ្មោះ កម្រិត ម៉ោងសិក្សា ឬគ្រូ..."
                class="search-input w-full border border-slate-200 rounded-lg bg-white text-[11px] sm:text-xs text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
              />
            </div>

            <div class="grid grid-cols-2 gap-2 md:flex md:items-center w-full md:w-auto">
              <div class="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-center md:text-left">
                <p class="text-[10px] font-bold text-slate-400 leading-none">
                  ថ្នាក់សរុប
                </p>
                <p class="mt-1 text-xs font-extrabold text-blue-700 leading-none">
                  {{ classesList.length }} ថ្នាក់
                </p>
              </div>

              <div class="rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-1.5 text-center md:text-left">
                <p class="text-[10px] font-bold text-blue-500 leading-none">
                  លទ្ធផលស្វែងរក
                </p>
                <p class="mt-1 text-xs font-extrabold text-blue-700 leading-none">
                  {{ filteredClasses.length }} ថ្នាក់
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Classes Grid -->
        <div
          v-if="classesList.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-3"
        >
          <button
            v-for="c in filteredClasses"
            :key="c._id"
            type="button"
            @click="selectClass(c._id)"
            class="group text-left relative overflow-hidden bg-white rounded-xl shadow-sm border border-slate-200 p-2.5 sm:p-3 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all"
          >
            <div class="absolute inset-x-0 top-0 h-1 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>

            <div class="flex items-start justify-between gap-2 mb-2">
              <div class="h-9 w-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-black group-hover:bg-blue-600 group-hover:text-white transition shrink-0">
                {{ getClassInitial(c) }}
              </div>

              <span class="max-w-[120px] inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-full truncate">
                <i class="fa-regular fa-clock text-[9px]"></i>
                {{ c.timeStudy || "-" }}
              </span>
            </div>

            <h3 class="text-xs sm:text-sm font-extrabold text-slate-800 leading-tight truncate group-hover:text-blue-700 transition">
              {{ c.className || "មិនមានឈ្មោះថ្នាក់" }}
            </h3>

            <p class="text-[10px] sm:text-[11px] text-slate-500 mt-1 truncate">
              កម្រិត: {{ c.classGrade || "-" }}
            </p>

            <p class="text-[10px] sm:text-[11px] text-slate-500 mt-1 truncate">
              គ្រូបន្ទុក: {{ getTeacherName(c.teacher) || c.teacherName || "មិនទាន់មាន" }}
            </p>

            <div class="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-[11px]">
              <span class="text-slate-400 font-bold">
                <i class="fa-solid fa-users mr-1"></i>
                {{ getClassStudentCount(c) }} នាក់
              </span>

              <span class="text-blue-600 font-extrabold">
                ចូល
                <i class="fa-solid fa-chevron-right ml-1 text-[9px]"></i>
              </span>
            </div>
          </button>

          <div
            v-if="filteredClasses.length === 0"
            class="col-span-full bg-white rounded-xl border border-dashed border-slate-300 py-9 sm:py-10 text-center"
          >
            <div class="h-12 w-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
              <i class="fa-solid fa-school-circle-xmark text-xl"></i>
            </div>

            <p class="text-xs sm:text-sm font-extrabold text-slate-600">
              មិនមានថ្នាក់ត្រូវនឹងការស្វែងរកទេ
            </p>

            <p class="text-[11px] text-slate-400 mt-1">
              សូមសាកល្បងពាក្យស្វែងរកផ្សេងទៀត
            </p>
          </div>
        </div>

        <div
          v-else
          class="bg-white rounded-xl border border-slate-200 shadow-sm py-10 sm:py-12 text-center"
        >
          <div class="h-12 w-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
            <i class="fa-solid fa-school text-xl"></i>
          </div>

          <p class="text-xs sm:text-sm font-extrabold text-slate-600">
            មិនទាន់មានទិន្នន័យថ្នាក់រៀន
          </p>
        </div>
      </template>

      <!-- Schedule Board -->
      <template v-else>
        <!-- Summary -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          <div class="summary-card">
            <p class="summary-label">ថ្នាក់</p>
            <p class="summary-value text-slate-800">
              {{ selectedClassName || "-" }}
            </p>
          </div>

          <div class="summary-card bg-blue-50 border-blue-100">
            <p class="summary-label text-blue-600">ចំនួនកាលវិភាគ</p>
            <p class="summary-value text-blue-700">
              {{ schedules.length }} មុខ
            </p>
          </div>

          <div class="summary-card bg-emerald-50 border-emerald-100">
            <p class="summary-label text-emerald-600">ថ្ងៃសិក្សា</p>
            <p class="summary-value text-emerald-700">
              {{ activeDaysCount }} ថ្ងៃ
            </p>
          </div>

          <div class="summary-card bg-indigo-50 border-indigo-100">
            <p class="summary-label text-indigo-600">ម៉ោងសិក្សា</p>
            <p class="summary-value text-indigo-700">
              {{ scheduleTimeRangeLabel }}
            </p>
          </div>
        </div>

        <div
          v-if="loading"
          class="bg-white rounded-xl border border-slate-200 shadow-sm py-10 sm:py-12 flex flex-col items-center justify-center"
        >
          <div class="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <i class="fa-solid fa-circle-notch fa-spin text-lg"></i>
          </div>

          <p class="text-xs font-bold text-slate-500 mt-3">
            កំពុងទាញយកកាលវិភាគ...
          </p>
        </div>

        <!-- Days -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2.5 sm:gap-3">
          <div
            v-for="day in daysOfWeek"
            :key="day.id"
            class="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden min-h-[220px]"
          >
            <div class="px-2.5 sm:px-3 py-2 bg-blue-50 border-b border-blue-100 flex items-center justify-between gap-2">
              <h3 class="font-extrabold text-blue-800 text-xs sm:text-sm flex items-center gap-1.5 min-w-0">
                <i class="fa-solid fa-calendar-day text-[10px]"></i>
                <span class="truncate">{{ day.label }}</span>
              </h3>

              <span class="h-6 min-w-6 px-2 rounded-full bg-white text-blue-600 border border-blue-100 text-[10px] sm:text-[11px] font-extrabold flex items-center justify-center shrink-0">
                {{ getSchedulesForDay(day.id).length }}
              </span>
            </div>

            <div class="p-2.5 sm:p-3 space-y-2 flex-grow bg-slate-50/40">
              <div
                v-if="getSchedulesForDay(day.id).length === 0"
                class="h-full min-h-[145px] flex flex-col items-center justify-center text-center text-slate-400 border border-dashed border-slate-200 rounded-xl bg-white"
              >
                <i class="fa-regular fa-calendar-xmark text-xl mb-2"></i>
                <p class="text-xs font-bold">មិនមានម៉ោងសិក្សា</p>
              </div>

              <div
                v-for="item in getSchedulesForDay(day.id)"
                :key="item._id"
                class="group relative bg-white border border-slate-200 rounded-xl p-2.5 sm:p-3 shadow-sm hover:shadow-md hover:border-blue-200 transition"
              >
                <div class="flex items-start justify-between gap-2 mb-2 pr-16">
                  <span class="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold text-blue-700 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100 whitespace-nowrap">
                    <i class="fa-regular fa-clock text-[9px]"></i>
                    {{ item.startTime || "--:--" }} - {{ item.endTime || "--:--" }}
                  </span>

                  <span class="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg whitespace-nowrap">
                    <i class="fa-solid fa-door-open text-[9px]"></i>
                    {{ item.room || "-" }}
                  </span>
                </div>

                <h4 class="font-extrabold text-slate-800 text-xs sm:text-sm leading-tight truncate pr-16">
                  {{ getSubjectName(item.subject) }}
                </h4>

                <p class="text-[11px] sm:text-xs text-slate-500 truncate mt-1 pr-16">
                  <i class="fa-solid fa-chalkboard-user mr-1 text-slate-400"></i>
                  {{ getTeacherName(item.teacher) || "មិនទាន់មានគ្រូ" }}
                </p>

                <div class="absolute top-2 right-2 flex bg-white shadow-sm rounded-lg border border-slate-200 overflow-hidden opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                  <button
                    type="button"
                    @click="openEditModal(item)"
                    :disabled="isSaving || isDeleting"
                    class="h-7 w-7 text-blue-600 hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    title="កែប្រែ"
                  >
                    <i class="fa-solid fa-pen-to-square text-xs"></i>
                  </button>

                  <div class="w-px bg-slate-200"></div>

                  <button
                    type="button"
                    @click="openDeleteModal(item)"
                    :disabled="isSaving || isDeleting"
                    class="h-7 w-7 text-red-500 hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    title="លុប"
                  >
                    <i class="fa-solid fa-trash text-xs"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Create/Edit Modal -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showModal"
          class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-2 sm:p-4"
          @click.self="closeModal"
        >
          <Transition
            appear
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              v-if="showModal"
              class="bg-white rounded-t-2xl sm:rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col max-h-[94dvh] sm:max-h-[90vh]"
            >
              <div class="px-3 sm:px-4 py-2.5 sm:py-3 border-b border-slate-100 flex justify-between items-start gap-2 bg-slate-50 shrink-0">
                <div class="min-w-0">
                  <h3 class="text-sm sm:text-base font-extrabold text-slate-800 flex items-center gap-2">
                    <span class="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs shrink-0">
                      <i :class="isEditing ? 'fa-solid fa-pen-to-square' : 'fa-solid fa-plus'"></i>
                    </span>

                    <span class="truncate">
                      {{ isEditing ? "កែប្រែកាលវិភាគ" : "បន្ថែមកាលវិភាគ" }}
                    </span>
                  </h3>

                  <p class="text-[10px] sm:text-xs text-slate-500 mt-0.5 truncate">
                    បំពេញព័ត៌មានកាលវិភាគសិក្សា
                  </p>
                </div>

                <button
                  type="button"
                  @click="closeModal"
                  :disabled="isSaving"
                  class="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>

              <form @submit.prevent="handleSubmit" class="overflow-y-auto modal-scroll">
                <div class="p-3 sm:p-4 space-y-3 sm:space-y-4">
                  <div class="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-[11px] font-bold text-blue-700">
                    <i class="fa-solid fa-school mr-1"></i>
                    ថ្នាក់: {{ selectedClassName || "-" }}
                  </div>

                  <div>
                    <label class="form-label">
                      មុខវិជ្ជា <span class="text-red-500">*</span>
                    </label>

                    <select v-model="form.subject" required class="form-input">
                      <option disabled value="">ជ្រើសរើសមុខវិជ្ជា</option>

                      <option v-for="s in subjectsList" :key="s._id" :value="s._id">
                        {{ s.subjectName }}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label class="form-label">
                      គ្រូបង្រៀន
                    </label>

                    <select v-model="form.teacher" class="form-input">
                      <option :value="null">មិនទាន់មានគ្រូ</option>

                      <option v-for="t in teachersList" :key="t._id" :value="t._id">
                        {{ t.khmerName || t.englishName || t.username }}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label class="form-label">
                      ថ្ងៃ <span class="text-red-500">*</span>
                    </label>

                    <select v-model="form.day" required class="form-input">
                      <option v-for="d in daysOfWeek" :key="d.id" :value="d.id">
                        {{ d.label }}
                      </option>
                    </select>
                  </div>

                  <div class="grid grid-cols-2 gap-2.5 sm:gap-3">
                    <div>
                      <label class="form-label">
                        ម៉ោងចាប់ផ្ដើម <span class="text-red-500">*</span>
                      </label>

                      <input type="time" v-model="form.startTime" required class="form-input" />
                    </div>

                    <div>
                      <label class="form-label">
                        ម៉ោងបញ្ចប់ <span class="text-red-500">*</span>
                      </label>

                      <input type="time" v-model="form.endTime" required class="form-input" />
                    </div>
                  </div>

                  <div>
                    <label class="form-label">
                      បន្ទប់
                    </label>

                    <input
                      type="text"
                      v-model.trim="form.room"
                      class="form-input"
                      placeholder="ឧ. A1 / Room 101"
                    />
                  </div>
                </div>

                <div class="sticky bottom-0 px-3 sm:px-4 py-2.5 flex justify-end gap-2.5 border-t border-slate-100 bg-white shrink-0">
                  <button
                    type="button"
                    @click="closeModal"
                    :disabled="isSaving"
                    class="px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    បោះបង់
                  </button>

                  <button
                    type="submit"
                    :disabled="isSaving"
                    class="px-4 sm:px-5 py-1.5 sm:py-2 text-[11px] sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i v-if="isSaving" class="fa-solid fa-circle-notch fa-spin"></i>
                    <i v-else class="fa-solid fa-floppy-disk"></i>
                    {{ isSaving ? "កំពុងរក្សាទុក..." : "រក្សាទុក" }}
                  </button>
                </div>
              </form>
            </div>
          </Transition>
        </div>
      </Transition>

      <!-- Delete Modal -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showDeleteModal"
          class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[60] p-3 sm:p-4"
          @click.self="closeDeleteModal"
        >
          <Transition
            appear
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="showDeleteModal"
              class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100"
            >
              <div class="px-4 py-3 bg-red-50 border-b border-red-100 flex items-start justify-between gap-3">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="h-10 w-10 rounded-full bg-white text-red-600 flex items-center justify-center shadow-sm border border-red-100 shrink-0">
                    <i class="fa-solid fa-trash"></i>
                  </div>

                  <div class="min-w-0">
                    <h3 class="text-sm font-extrabold text-slate-800">
                      បញ្ជាក់ការលុប
                    </h3>

                    <p class="text-[11px] text-red-600 font-bold mt-0.5 truncate">
                      សកម្មភាពនេះមិនអាចត្រឡប់ក្រោយបានទេ
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  @click="closeDeleteModal"
                  :disabled="isDeleting"
                  class="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-red-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>

              <div class="p-5 text-center">
                <div class="mx-auto mb-4 h-14 w-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                  <i class="fa-solid fa-trash-can text-2xl"></i>
                </div>

                <p class="text-sm text-slate-600 leading-7">
                  តើអ្នកពិតជាចង់លុបកាលវិភាគ
                  <span class="font-extrabold text-slate-900">
                    "{{ getSubjectName(scheduleToDelete?.subject) }}"
                  </span>
                  មែនទេ?
                </p>

                <div class="mt-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-[12px] font-bold text-red-700">
                  <i class="fa-solid fa-circle-info mr-1"></i>
                  ប្រសិនបើលុបរួច វាមិនអាចយកមកវិញបានទេ។
                </div>
              </div>

              <div class="px-4 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  @click="closeDeleteModal"
                  :disabled="isDeleting"
                  class="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  បោះបង់
                </button>

                <button
                  type="button"
                  @click="confirmDelete"
                  :disabled="isDeleting"
                  class="px-5 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i v-if="isDeleting" class="fa-solid fa-circle-notch fa-spin"></i>
                  <i v-else class="fa-solid fa-trash"></i>
                  {{ isDeleting ? "កំពុងលុប..." : "លុប" }}
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useQuery } from "../hooks/useQuery";
import { useCollection } from "../hooks/useCollection";
import api from "../config/api";
import { useToast } from "vue-toastification";

const toast = useToast();
const { createDoc, updateDoc, deleteDoc } = useCollection("schedules");

const { data: classes } = useQuery("classes");
const { data: subjects } = useQuery("subjects");
const { data: teachers } = useQuery("teachers");

const khmerCollator = new Intl.Collator("km-KH", {
  numeric: true,
  sensitivity: "base"
});

const daysOfWeek = [
  { id: "Monday", label: "ថ្ងៃចន្ទ" },
  { id: "Tuesday", label: "ថ្ងៃអង្គារ" },
  { id: "Wednesday", label: "ថ្ងៃពុធ" },
  { id: "Thursday", label: "ថ្ងៃព្រហស្បតិ៍" },
  { id: "Friday", label: "ថ្ងៃសុក្រ" },
  { id: "Saturday", label: "ថ្ងៃសៅរ៍" },
  { id: "Sunday", label: "ថ្ងៃអាទិត្យ" }
];

const schedules = ref([]);
const classFilter = ref("");
const classSearchQuery = ref("");
const loading = ref(false);

const showModal = ref(false);
const isEditing = ref(false);
const editId = ref(null);
const isSaving = ref(false);

const showDeleteModal = ref(false);
const scheduleToDelete = ref(null);
const isDeleting = ref(false);

const defaultForm = () => ({
  class: "",
  classId: "",
  subject: "",
  teacher: null,
  day: "Monday",
  startTime: "07:00",
  endTime: "08:00",
  room: "A1"
});

const form = ref(defaultForm());

const normalizeArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.result)) return value.result;
  if (Array.isArray(value?.items)) return value.items;
  return [];
};

const getId = (value) => {
  return String(value?._id || value || "").trim();
};

const getText = (value) => {
  return String(value || "").trim();
};

const compareKhmerText = (a, b) => {
  return khmerCollator.compare(getText(a), getText(b));
};

const timeToMinutes = (time = "") => {
  const [hour, minute] = String(time || "00:00")
    .split(":")
    .map((value) => Number(value));

  if (Number.isNaN(hour) || Number.isNaN(minute)) return 0;
  return hour * 60 + minute;
};

const classesList = computed(() => {
  return [...normalizeArray(classes.value)].sort((a, b) => {
    return compareKhmerText(a.className, b.className);
  });
});

const subjectsList = computed(() => {
  return [...normalizeArray(subjects.value)].sort((a, b) => {
    return compareKhmerText(a.subjectName, b.subjectName);
  });
});

const teachersList = computed(() => {
  return [...normalizeArray(teachers.value)].sort((a, b) => {
    return compareKhmerText(
      a.khmerName || a.englishName || a.username,
      b.khmerName || b.englishName || b.username
    );
  });
});

const selectedClass = computed(() => {
  return classesList.value.find((classItem) => {
    return getId(classItem) === getId(classFilter.value);
  });
});

const selectedClassName = computed(() => {
  return selectedClass.value?.className || "";
});

const filteredClasses = computed(() => {
  const query = classSearchQuery.value.toLowerCase().trim();

  if (!query) return classesList.value;

  return classesList.value.filter((classItem) => {
    const teacherName = getTeacherName(classItem.teacher) || classItem.teacherName || "";
    const text = [
      classItem.className,
      classItem.classGrade,
      classItem.timeStudy,
      classItem.classNumber,
      teacherName
    ]
      .join(" ")
      .toLowerCase();

    return text.includes(query);
  });
});

const activeDaysCount = computed(() => {
  return daysOfWeek.filter((day) => getSchedulesForDay(day.id).length > 0).length;
});

const scheduleTimeRangeLabel = computed(() => {
  if (schedules.value.length === 0) return "-";

  const sortedSchedules = [...schedules.value].sort((a, b) => {
    return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
  });

  const first = sortedSchedules[0];
  const last = sortedSchedules[sortedSchedules.length - 1];

  return `${first?.startTime || "--:--"} - ${last?.endTime || "--:--"}`;
});

const getClassInitial = (classItem) => {
  const className = getText(classItem?.className);
  if (!className) return "CL";
  return className.slice(0, 2).toUpperCase();
};

const getClassStudentCount = (classItem) => {
  return Array.isArray(classItem?.students) ? classItem.students.length : 0;
};

const getSubjectName = (subject) => {
  if (!subject) return "មិនមានមុខវិជ្ជា";

  if (typeof subject === "object") {
    return subject.subjectName || "មិនមានមុខវិជ្ជា";
  }

  const foundSubject = subjectsList.value.find((item) => {
    return getId(item) === getId(subject);
  });

  return foundSubject?.subjectName || "មិនមានមុខវិជ្ជា";
};

const getTeacherName = (teacher) => {
  if (!teacher) return "";

  if (typeof teacher === "object") {
    return teacher.khmerName || teacher.englishName || teacher.username || "";
  }

  const foundTeacher = teachersList.value.find((item) => {
    return getId(item) === getId(teacher);
  });

  return foundTeacher?.khmerName || foundTeacher?.englishName || foundTeacher?.username || "";
};

const getSchedulesForDay = (day) => {
  return schedules.value
    .filter((schedule) => schedule.day === day)
    .sort((a, b) => {
      const timeCompare = timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
      if (timeCompare !== 0) return timeCompare;
      return compareKhmerText(getSubjectName(a.subject), getSubjectName(b.subject));
    });
};

const fetchSchedules = async () => {
  if (!classFilter.value) {
    schedules.value = [];
    return;
  }

  loading.value = true;

  try {
    const response = await api.get("/schedules", {
      params: {
        class: classFilter.value,
        classId: classFilter.value
      }
    });

    schedules.value = normalizeArray(response.data);
  } catch (error) {
    console.error(error);
    toast.error(
      error.response?.data?.err ||
        error.response?.data?.message ||
        "មិនអាចទាញយកកាលវិភាគបានទេ"
    );
  } finally {
    loading.value = false;
  }
};

watch(classFilter, () => {
  fetchSchedules();
});

const goBackToClasses = () => {
  if (loading.value || isSaving.value || isDeleting.value) return;

  classFilter.value = "";
  schedules.value = [];
};

const selectClass = (classId) => {
  classFilter.value = classId;
};

const closeModal = () => {
  if (isSaving.value) return;

  showModal.value = false;
  isEditing.value = false;
  editId.value = null;
  form.value = defaultForm();
};

const forceCloseModal = () => {
  showModal.value = false;
  isEditing.value = false;
  editId.value = null;
  form.value = defaultForm();
};

const openCreateModal = () => {
  if (!classFilter.value) {
    toast.warning("សូមជ្រើសរើសថ្នាក់ជាមុនសិន");
    return;
  }

  isEditing.value = false;
  editId.value = null;

  form.value = {
    ...defaultForm(),
    class: classFilter.value,
    classId: classFilter.value
  };

  showModal.value = true;
};

const openEditModal = (item) => {
  if (!item) return;

  isEditing.value = true;
  editId.value = item._id;

  form.value = {
    class: getId(item.class) || classFilter.value,
    classId: getId(item.class) || classFilter.value,
    subject: getId(item.subject),
    teacher: item.teacher ? getId(item.teacher) : null,
    day: item.day || "Monday",
    startTime: item.startTime || "07:00",
    endTime: item.endTime || "08:00",
    room: item.room || ""
  };

  showModal.value = true;
};

const validateForm = () => {
  if (!form.value.subject) {
    toast.warning("សូមជ្រើសរើសមុខវិជ្ជា");
    return false;
  }

  if (!form.value.day) {
    toast.warning("សូមជ្រើសរើសថ្ងៃ");
    return false;
  }

  if (!form.value.startTime || !form.value.endTime) {
    toast.warning("សូមបញ្ចូលម៉ោងចាប់ផ្ដើម និងម៉ោងបញ្ចប់");
    return false;
  }

  if (timeToMinutes(form.value.endTime) <= timeToMinutes(form.value.startTime)) {
    toast.warning("ម៉ោងបញ្ចប់ត្រូវធំជាងម៉ោងចាប់ផ្ដើម");
    return false;
  }

  return true;
};

const buildPayload = () => {
  return {
    class: classFilter.value,
    classId: classFilter.value,
    subject: form.value.subject,
    teacher: form.value.teacher || null,
    day: form.value.day,
    startTime: form.value.startTime,
    endTime: form.value.endTime,
    room: form.value.room || ""
  };
};

const handleSubmit = async () => {
  if (isSaving.value) return;
  if (!validateForm()) return;

  isSaving.value = true;

  try {
    const payload = buildPayload();

    if (isEditing.value) {
      if (!editId.value) {
        throw new Error("Schedule ID is missing");
      }

      await updateDoc(editId.value, payload);
      toast.success("បានកែប្រែកាលវិភាគដោយជោគជ័យ");
    } else {
      await createDoc(payload);
      toast.success("បានបង្កើតកាលវិភាគដោយជោគជ័យ");
    }

    await fetchSchedules();
    forceCloseModal();
  } catch (error) {
    console.error(error);
    toast.error(
      error.response?.data?.err ||
        error.response?.data?.message ||
        error.message ||
        "មិនអាចរក្សាទុកកាលវិភាគបានទេ"
    );
  } finally {
    isSaving.value = false;
  }
};

const openDeleteModal = (item) => {
  scheduleToDelete.value = item;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  if (isDeleting.value) return;

  scheduleToDelete.value = null;
  showDeleteModal.value = false;
};

const forceCloseDeleteModal = () => {
  scheduleToDelete.value = null;
  showDeleteModal.value = false;
};

const confirmDelete = async () => {
  if (!scheduleToDelete.value?._id || isDeleting.value) return;

  isDeleting.value = true;

  try {
    await deleteDoc(scheduleToDelete.value._id);
    toast.success("បានលុបកាលវិភាគដោយជោគជ័យ");
    await fetchSchedules();
    forceCloseDeleteModal();
  } catch (error) {
    console.error(error);
    toast.error(
      error.response?.data?.err ||
        error.response?.data?.message ||
        "មិនអាចលុបកាលវិភាគបានទេ"
    );
  } finally {
    isDeleting.value = false;
  }
};
</script>

<style scoped>
.form-label {
  display: block;
  font-size: 0.62rem;
  font-weight: 800;
  color: #64748b;
  margin-bottom: 0.2rem;
}

.form-input {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.36rem 0.55rem;
  font-size: 0.7rem;
  color: #334155;
  background: #ffffff;
  outline: none;
  min-height: 1.95rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
}

.search-icon {
  position: absolute;
  left: 0.72rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 0.68rem;
  pointer-events: none;
  z-index: 2;
}

.search-input {
  padding-left: 2.15rem !important;
  padding-right: 0.75rem !important;
  min-height: 2rem;
}

.summary-card {
  border: 1px solid #e2e8f0;
  background: #ffffff;
  border-radius: 0.75rem;
  padding: 0.52rem 0.62rem;
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.04);
  min-width: 0;
}

.summary-label {
  font-size: 0.58rem;
  font-weight: 800;
  color: #64748b;
  line-height: 1;
  white-space: nowrap;
}

.summary-value {
  margin-top: 0.24rem;
  font-size: 0.82rem;
  font-weight: 900;
  line-height: 1.15;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

@media (min-width: 640px) {
  .form-label {
    font-size: 0.68rem;
  }

  .form-input {
    padding: 0.44rem 0.6rem;
    font-size: 0.75rem;
    min-height: 2.2rem;
  }

  .summary-card {
    padding: 0.65rem 0.75rem;
  }

  .summary-label {
    font-size: 0.62rem;
  }

  .summary-value {
    font-size: 0.92rem;
  }

  .search-input {
    min-height: 2.2rem;
  }
}
</style>
