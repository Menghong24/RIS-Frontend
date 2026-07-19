<template>
  <div class="subjects-page-mobile-safe bg-slate-50 p-2 sm:p-3 md:p-4 text-slate-800">
    <div class="max-w-7xl mx-auto space-y-3 md:space-y-4">
      <!-- Header -->
      <div
        class="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 md:gap-3 bg-white p-2.5 sm:p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm"
      >
        <div class="min-w-0">
          <h1
            class="text-base sm:text-lg md:text-xl font-extrabold text-slate-800 flex items-start gap-2 leading-snug"
          >
            <span
              class="h-7 w-7 sm:h-8 sm:w-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-xs sm:text-sm shrink-0"
            >
              <i class="fa-solid fa-book-open"></i>
            </span>

            <span class="break-words leading-snug">
              គ្រប់គ្រងមុខវិជ្ជាសិក្សា
            </span>
          </h1>

          <p class="text-[11px] sm:text-xs text-slate-500 mt-1 break-words leading-snug">
            គ្រប់គ្រងមុខវិជ្ជា ឈ្មោះថ្នាក់រៀន គ្រូបង្រៀន ប្រភេទមុខវិជ្ជា និងថ្លៃសិក្សា
          </p>
        </div>

        <button
          type="button"
          @click="openCreateModal"
          class="w-full md:w-auto bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-blue-700 font-bold transition active:scale-95 flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm text-[11px] sm:text-xs whitespace-nowrap"
        >
          <i class="fa-solid fa-plus text-[10px] sm:text-xs"></i>
          បន្ថែមមុខវិជ្ជា
        </button>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <div class="summary-card">
          <div class="summary-icon bg-blue-50 text-blue-600">
            <i class="fa-solid fa-list-check"></i>
          </div>

          <div class="min-w-0">
            <p class="summary-label">មុខវិជ្ជាទាំងអស់</p>
            <p class="summary-value">
              {{ subjectsList.length }}
            </p>
          </div>
        </div>

        <div class="summary-card">
          <div class="summary-icon bg-green-50 text-green-600">
            <i class="fa-solid fa-circle-check"></i>
          </div>

          <div class="min-w-0">
            <p class="summary-label">កំពុងដំណើរការ</p>
            <p class="summary-value">
              {{ activeSubjectsCount }}
            </p>
          </div>
        </div>

        <div class="summary-card">
          <div class="summary-icon bg-purple-50 text-purple-600">
            <i class="fa-solid fa-school"></i>
          </div>

          <div class="min-w-0">
            <p class="summary-label">ថ្នាក់រៀន</p>
            <p class="summary-value">
              {{ classesOptions.length }}
            </p>
          </div>
        </div>

        <div class="summary-card">
          <div class="summary-icon bg-amber-50 text-amber-600">
            <i class="fa-solid fa-money-bill-wave"></i>
          </div>

          <div class="min-w-0">
            <p class="summary-label">ថ្លៃសិក្សាមធ្យម</p>
            <p class="summary-value text-[0.86rem] sm:text-lg break-words leading-snug">
              {{ formatRiel(calculateAvgFee()) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200 shadow-sm">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_180px_180px_auto] gap-2 items-end">
          <div>
            <label class="form-label">ស្វែងរក</label>

            <div class="relative">
              <i class="search-icon fa-solid fa-magnifying-glass"></i>

              <input
                v-model="searchText"
                type="text"
                placeholder="ស្វែងរកមុខវិជ្ជា / ថ្នាក់ / គ្រូ..."
                class="form-input search-input"
              />
            </div>
          </div>

          <div>
            <label class="form-label">ថ្នាក់រៀន</label>

            <select
              v-model="classFilter"
              class="form-input"
            >
              <option value="All">ថ្នាក់ទាំងអស់</option>

              <option
                v-for="c in classesOptions"
                :key="c._id"
                :value="c._id"
              >
                {{ c.className }}
              </option>
            </select>
          </div>

          <div>
            <label class="form-label">ប្រភេទ</label>

            <select
              v-model="typeFilter"
              class="form-input"
            >
              <option value="All">ប្រភេទទាំងអស់</option>
              <option value="general">មុខវិជ្ជាទូទៅ</option>
              <option value="optional">មុខវិជ្ជាជម្រើស</option>
              <option value="skill">ជំនាញ / វិជ្ជាជីវៈ</option>
            </select>
          </div>

          <button
            type="button"
            @click="resetFilters"
            class="w-full lg:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
          >
            <i class="fa-solid fa-rotate-left text-[10px]"></i>
            សម្អាត
          </button>
        </div>
      </div>

      <!-- Subject List -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div
          v-if="loading"
          class="p-7 sm:p-8 text-center text-slate-400 flex flex-col items-center justify-center gap-2"
        >
          <div class="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <i class="fa-solid fa-circle-notch fa-spin text-lg sm:text-xl"></i>
          </div>

          <span class="text-xs sm:text-sm font-bold text-slate-500">
            កំពុងទាញយកទិន្នន័យ...
          </span>
        </div>

        <template v-else>
          <!-- Mobile Cards -->
          <div class="subjects-mobile-list lg:hidden bg-slate-50 p-2.5 space-y-2">
            <div
              v-for="sub in filteredSubjects"
              :key="sub._id"
              class="bg-white rounded-xl border border-slate-200 shadow-sm p-2.5"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0">
                  <h3 class="text-sm font-extrabold text-slate-800 leading-snug break-words">
                    {{ sub.subjectName }}
                  </h3>

                  <p class="text-[10px] text-slate-400 mt-0.5 font-mono break-words leading-snug">
                    ID: {{ String(sub._id || "").substring(0, 8) }}...
                  </p>
                </div>

                <span
                  :class="
                    sub.status === 'active'
                      ? 'text-green-700 bg-green-50 border-green-200'
                      : 'text-slate-500 bg-slate-50 border-slate-200'
                  "
                  class="px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0"
                >
                  {{ translateStatus(sub.status) }}
                </span>
              </div>

              <div class="mt-2 flex flex-wrap items-center gap-1.5">
                <span
                  :class="getTypeClass(sub.type)"
                  class="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                >
                  {{ translateType(sub.type) }}
                </span>

                <span
                  class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100"
                >
                  {{ formatRiel(sub.fee) }}
                </span>
              </div>

              <div class="mt-2 rounded-lg border border-slate-100 bg-slate-50 px-2 py-1.5">
                <p class="text-[10px] font-bold text-slate-400 mb-1">
                  ថ្នាក់រៀន
                </p>

                <div
                  v-if="getSubjectClasses(sub).length > 0"
                  class="flex flex-wrap gap-1"
                >
                  <span
                    v-for="cls in getSubjectClasses(sub)"
                    :key="getId(cls)"
                    class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-bold text-[10px]"
                  >
                    <i class="fa-solid fa-school text-[9px]"></i>
                    {{ getClassDisplayName(cls) }}
                  </span>
                </div>

                <span
                  v-else
                  class="text-slate-400 text-[10px] italic"
                >
                  មិនទាន់ភ្ជាប់ថ្នាក់
                </span>
              </div>

              <div class="mt-2 rounded-lg border border-slate-100 bg-slate-50 px-2 py-1.5">
                <p class="text-[10px] font-bold text-slate-400 mb-0.5">
                  គ្រូបង្រៀន
                </p>

                <div v-if="sub.teacher" class="min-w-0">
                  <p class="text-[11px] font-extrabold text-slate-800 break-words leading-snug">
                    {{ sub.teacher.khmerName || sub.teacher.englishName || "បានកំណត់" }}
                  </p>

                  <p class="text-[10px] text-slate-400 break-words leading-snug">
                    {{ sub.teacher.englishName || "" }}
                  </p>
                </div>

                <span
                  v-else
                  class="text-slate-400 text-[10px] italic inline-flex items-center gap-1"
                >
                  <span class="h-1.5 w-1.5 bg-amber-400 rounded-full animate-pulse"></span>
                  មិនទាន់កំណត់គ្រូ
                </span>
              </div>

              <div class="mt-2 flex items-center justify-end gap-1.5 border-t border-slate-100 pt-2">
                <button
                  type="button"
                  @click="openEditModal(sub)"
                  class="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                >
                  <i class="fa-solid fa-pen-to-square text-[10px]"></i>
                  កែ
                </button>

                <button
                  type="button"
                  @click="openDeleteConfirm(sub)"
                  class="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                >
                  <i class="fa-solid fa-trash text-[10px]"></i>
                  លុប
                </button>
              </div>
            </div>

            <div
              v-if="filteredSubjects.length === 0"
              class="bg-white border border-dashed border-slate-300 rounded-xl px-4 py-10 text-center text-slate-400"
            >
              <div class="mx-auto mb-2 h-10 w-10 bg-slate-100 rounded-xl text-slate-400 flex items-center justify-center">
                <i class="fa-solid fa-face-frown text-xl"></i>
              </div>

              <p class="text-xs font-bold text-slate-500">
                មិនមានមុខវិជ្ជាដែលត្រូវនឹងតម្រង
              </p>
            </div>
          </div>

          <!-- Desktop Table -->
          <div class="hidden lg:block overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs min-w-[1050px]">
              <thead>
                <tr class="bg-slate-100 text-slate-700">
                  <th class="table-th">ព័ត៌មានមុខវិជ្ជា</th>
                  <th class="table-th">ឈ្មោះថ្នាក់រៀន</th>
                  <th class="table-th">ប្រភេទ</th>
                  <th class="table-th">គ្រូបង្រៀន</th>
                  <th class="table-th">ថ្លៃសិក្សា</th>
                  <th class="table-th text-center">ស្ថានភាព</th>
                  <th class="table-th text-right">សកម្មភាព</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="sub in filteredSubjects"
                  :key="sub._id"
                  class="hover:bg-slate-50 transition border-b border-slate-100 group"
                >
                  <td class="table-td">
                    <div class="font-bold text-slate-800 group-hover:text-blue-600 transition break-words leading-snug">
                      {{ sub.subjectName }}
                    </div>

                    <div class="text-[10px] text-slate-400 mt-0.5">
                      ID: {{ String(sub._id || "").substring(0, 8) }}...
                    </div>
                  </td>

                  <td class="table-td">
                    <div
                      v-if="getSubjectClasses(sub).length > 0"
                      class="flex flex-wrap gap-1.5"
                    >
                      <span
                        v-for="cls in getSubjectClasses(sub)"
                        :key="getId(cls)"
                        class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-bold text-[11px]"
                      >
                        <i class="fa-solid fa-school text-[10px]"></i>
                        {{ getClassDisplayName(cls) }}
                      </span>
                    </div>

                    <span
                      v-else
                      class="text-slate-400 text-[11px] italic bg-slate-100 px-2 py-0.5 rounded w-max inline-block"
                    >
                      មិនទាន់ភ្ជាប់ថ្នាក់
                    </span>
                  </td>

                  <td class="table-td">
                    <span
                      :class="getTypeClass(sub.type)"
                      class="px-2.5 py-1 rounded-full text-[11px] font-bold border"
                    >
                      {{ translateType(sub.type) }}
                    </span>
                  </td>

                  <td class="table-td">
                    <div v-if="sub.teacher" class="flex flex-col">
                      <span class="font-bold text-slate-800 break-words leading-snug">
                        {{ sub.teacher.khmerName || sub.teacher.englishName || "បានកំណត់" }}
                      </span>

                      <span class="text-[10px] text-slate-400 mt-0.5 break-words leading-snug">
                        {{ sub.teacher.englishName || "" }}
                      </span>
                    </div>

                    <span
                      v-else
                      class="text-slate-400 text-[11px] italic flex items-center gap-1"
                    >
                      <span class="h-1.5 w-1.5 bg-amber-400 rounded-full animate-pulse"></span>
                      មិនទាន់កំណត់គ្រូ
                    </span>
                  </td>

                  <td class="table-td whitespace-nowrap font-mono text-slate-900 font-bold">
                    {{ formatRiel(sub.fee) }}
                  </td>

                  <td class="table-td whitespace-nowrap text-center">
                    <span
                      :class="
                        sub.status === 'active'
                          ? 'text-green-700 bg-green-50 border-green-200'
                          : 'text-slate-500 bg-slate-50 border-slate-200'
                      "
                      class="px-2.5 py-1 rounded-full text-[11px] font-bold border inline-block"
                    >
                      {{ translateStatus(sub.status) }}
                    </span>
                  </td>

                  <td class="table-td whitespace-nowrap text-right">
                    <div class="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        @click="openEditModal(sub)"
                        class="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                        title="កែប្រែ"
                      >
                        <i class="fa-solid fa-pen-to-square"></i>
                      </button>

                      <button
                        type="button"
                        @click="openDeleteConfirm(sub)"
                        class="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                        title="លុប"
                      >
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>

                <tr v-if="filteredSubjects.length === 0">
                  <td colspan="7" class="text-center py-10 text-slate-400 bg-slate-50">
                    <div class="max-w-xs mx-auto flex flex-col items-center">
                      <div class="h-10 w-10 bg-slate-100 rounded-xl text-slate-400 mb-2 flex items-center justify-center">
                        <i class="fa-solid fa-face-frown"></i>
                      </div>

                      <p class="text-sm font-bold text-slate-700">
                        មិនមានមុខវិជ្ជាដែលត្រូវនឹងតម្រង
                      </p>

                      <p class="text-xs text-slate-400 mt-1">
                        សូមកែតម្រង ឬបន្ថែមមុខវិជ្ជាថ្មី
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </div>

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
          class="subject-modal-overlay-mobile-safe fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm overflow-y-auto"
          @click.self="closeModal"
        >
          <div class="subject-modal-wrapper-mobile-safe min-h-full flex items-end sm:items-center justify-center p-2 sm:p-4">
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
                v-if="showModal"
                class="subject-modal-panel-mobile-safe bg-white rounded-t-2xl sm:rounded-xl shadow-xl w-full max-w-xl overflow-hidden border border-slate-100 flex flex-col max-h-[94dvh] sm:max-h-[90vh]"
              >
                <div class="px-3 sm:px-4 py-2.5 sm:py-3 border-b border-slate-100 flex justify-between items-start gap-2 bg-slate-50 shrink-0">
                  <div class="min-w-0">
                    <h3 class="text-sm sm:text-base font-bold text-slate-900 flex items-start gap-2 leading-snug">
                      <i
                        :class="
                          isEditing
                            ? 'fa-solid fa-pen-to-square text-blue-600'
                            : 'fa-solid fa-plus text-blue-600'
                        "
                      ></i>
                      <span class="break-words leading-snug">
                        {{ isEditing ? "កែប្រែមុខវិជ្ជា" : "បង្កើតមុខវិជ្ជាថ្មី" }}
                      </span>
                    </h3>

                    <p class="text-[10px] sm:text-xs text-slate-500 mt-0.5 break-words leading-snug">
                      បំពេញព័ត៌មានមុខវិជ្ជាខាងក្រោម
                    </p>
                  </div>

                  <button
                    type="button"
                    @click="closeModal"
                    class="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition shrink-0"
                  >
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>

                <form
                  @submit.prevent="handleSubmit"
                  class="subject-modal-body-mobile-safe p-3 sm:p-4 space-y-3 overflow-y-auto modal-scroll"
                >
                  <div>
                    <label class="form-label">
                      ឈ្មោះមុខវិជ្ជា <span class="text-red-500">*</span>
                    </label>

                    <input
                      v-model.trim="form.subjectName"
                      required
                      type="text"
                      placeholder="ឧ. គណិតវិទ្យា"
                      class="form-input"
                    />
                  </div>

                  <div>
                    <label class="form-label">
                      ឈ្មោះថ្នាក់រៀនដែលភ្ជាប់
                    </label>

                    <div
                      v-if="selectedClasses.length > 0"
                      class="mb-2 flex flex-wrap gap-1.5 rounded-lg border border-blue-100 bg-blue-50/50 p-2"
                    >
                      <span
                        v-for="cls in selectedClasses"
                        :key="cls._id"
                        class="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-white px-2 py-1 text-[11px] font-bold text-blue-700"
                      >
                        <i class="fa-solid fa-school text-[10px]"></i>
                        {{ cls.className }}

                        <button
                          type="button"
                          @click="removeClass(cls._id)"
                          class="ml-0.5 h-4 w-4 rounded-full bg-blue-100 text-blue-700 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition"
                          title="ដកចេញ"
                        >
                          <i class="fa-solid fa-xmark text-[10px]"></i>
                        </button>
                      </span>
                    </div>

                    <div
                      v-else
                      class="mb-2 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-bold text-slate-400"
                    >
                      មិនទាន់ជ្រើសថ្នាក់រៀន
                    </div>

                    <div class="max-h-44 overflow-y-auto rounded-lg border border-slate-200 bg-white p-2 space-y-1 modal-scroll">
                      <label
                        v-for="c in classesOptions"
                        :key="c._id"
                        class="flex items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-slate-50 cursor-pointer transition"
                        :class="isClassSelected(c._id) ? 'bg-blue-50 text-blue-700' : 'text-slate-700'"
                      >
                        <span class="min-w-0 flex items-center gap-2">
                          <input
                            type="checkbox"
                            :checked="isClassSelected(c._id)"
                            @change="toggleClass(c._id)"
                            class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />

                          <span class="break-words leading-snug text-xs font-bold">
                            {{ c.className }}
                          </span>
                        </span>

                        <span
                          v-if="c.classGrade"
                          class="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500"
                        >
                          {{ c.classGrade }}
                        </span>
                      </label>

                      <div
                        v-if="classesOptions.length === 0"
                        class="px-3 py-6 text-center text-xs font-bold text-slate-400"
                      >
                        មិនមានថ្នាក់រៀនសម្រាប់ជ្រើស
                      </div>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-2">
                    <div>
                      <label class="form-label">
                        ប្រភេទមុខវិជ្ជា
                      </label>

                      <select
                        v-model="form.type"
                        class="form-input"
                      >
                        <option value="general">មុខវិជ្ជាទូទៅ</option>
                        <option value="optional">មុខវិជ្ជាជម្រើស</option>
                        <option value="skill">ជំនាញ / វិជ្ជាជីវៈ</option>
                      </select>
                    </div>

                    <div>
                      <label class="form-label">
                        ថ្លៃសិក្សា (៛)
                      </label>

                      <div class="relative">
                        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-mono text-sm font-bold">
                          ៛
                        </span>

                        <input
                          v-model.number="form.fee"
                          type="number"
                          min="0"
                          step="100"
                          class="form-input pl-8 font-mono font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label class="form-label">
                      គ្រូបង្រៀន
                    </label>

                    <select
                      v-model="form.teacher"
                      class="form-input"
                    >
                      <option :value="null">-- មិនទាន់កំណត់គ្រូ --</option>
                      <option
                        v-for="t in teachersOptions"
                        :key="t._id"
                        :value="t._id"
                      >
                        {{ t.khmerName }} ({{ t.englishName }})
                      </option>
                    </select>
                  </div>

                  <div>
                    <label class="form-label">
                      ស្ថានភាព
                    </label>

                    <div class="grid grid-cols-2 gap-2 mt-1">
                      <label
                        class="flex items-center justify-center gap-2 rounded-lg border px-2 py-2 text-xs font-bold cursor-pointer transition"
                        :class="form.status === 'active' ? 'border-green-200 bg-green-50 text-green-700' : 'border-slate-200 text-slate-600'"
                      >
                        <input
                          type="radio"
                          v-model="form.status"
                          value="active"
                          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                        />
                        កំពុងដំណើរការ
                      </label>

                      <label
                        class="flex items-center justify-center gap-2 rounded-lg border px-2 py-2 text-xs font-bold cursor-pointer transition"
                        :class="form.status === 'disabled' ? 'border-slate-300 bg-slate-100 text-slate-700' : 'border-slate-200 text-slate-600'"
                      >
                        <input
                          type="radio"
                          v-model="form.status"
                          value="disabled"
                          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                        />
                        ផ្អាកដំណើរការ
                      </label>
                    </div>
                  </div>

                  <div>
                    <label class="form-label">
                      កំណត់ចំណាំ
                    </label>

                    <textarea
                      v-model.trim="form.remark"
                      rows="2"
                      placeholder="បញ្ចូលកំណត់ចំណាំ..."
                      class="form-input resize-none"
                    ></textarea>
                  </div>

                  <div class="subject-modal-footer-mobile-safe sticky bottom-0 -mx-3 sm:-mx-4 px-3 sm:px-4 py-2.5 flex justify-end gap-2.5 border-t border-slate-100 bg-white">
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
                      <i
                        v-if="isSaving"
                        class="fa-solid fa-circle-notch fa-spin"
                      ></i>
                      <i v-else class="fa-solid fa-floppy-disk"></i>
                      {{ isSaving ? "កំពុងរក្សាទុក..." : (isEditing ? "រក្សាទុកការកែប្រែ" : "រក្សាទុកមុខវិជ្ជា") }}
                    </button>
                  </div>
                </form>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>

      <!-- Delete Confirmation Modal -->
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
          class="subject-modal-overlay-mobile-safe fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm overflow-y-auto"
          @click.self="closeDeleteConfirm"
        >
          <div class="subject-modal-wrapper-mobile-safe min-h-full flex items-center justify-center p-3 sm:p-4">
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
                class="subject-modal-panel-mobile-safe bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100"
              >
                <div class="px-4 py-3 border-b border-slate-100 flex justify-between items-start gap-2 bg-slate-50">
                  <div class="min-w-0">
                    <h3 class="text-base font-bold text-slate-900 flex items-start gap-2 leading-snug">
                      <i class="fa-solid fa-triangle-exclamation text-red-600"></i>
                      បញ្ជាក់ការលុប
                    </h3>

                    <p class="text-xs text-slate-500 mt-0.5 break-words leading-snug">
                      សូមពិនិត្យមុនពេលបន្តលុបមុខវិជ្ជា
                    </p>
                  </div>

                  <button
                    type="button"
                    @click="closeDeleteConfirm"
                    :disabled="isDeleting"
                    class="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>

                <div class="p-5 text-center">
                  <div class="mx-auto mb-4 h-14 w-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                    <i class="fa-solid fa-trash-can text-2xl"></i>
                  </div>

                  <p class="text-sm text-slate-600 leading-7">
                    តើអ្នកពិតជាចង់លុបមុខវិជ្ជា
                    <span class="font-extrabold text-slate-900 break-words leading-snug">
                      "{{ subjectToDelete?.subjectName || 'មុខវិជ្ជានេះ' }}"
                    </span>
                    មែនទេ?
                  </p>

                  <div class="mt-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-[12px] font-bold text-red-700">
                    <i class="fa-solid fa-circle-info mr-1"></i>
                    សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
                  </div>
                </div>

                <div class="subject-modal-footer-mobile-safe px-4 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2.5">
                  <button
                    type="button"
                    @click="closeDeleteConfirm"
                    :disabled="isDeleting"
                    class="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    បោះបង់
                  </button>

                  <button
                    type="button"
                    @click="confirmDeleteSubject"
                    :disabled="isDeleting"
                    class="px-5 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i
                      v-if="isDeleting"
                      class="fa-solid fa-circle-notch fa-spin"
                    ></i>
                    <i v-else class="fa-solid fa-trash"></i>
                    លុប
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useQuery } from "../hooks/useQuery";
import { useCollection } from "../hooks/useCollection";
import { useToast } from "vue-toastification";

const toast = useToast();


const originalViewportContent = ref("");
const viewportMetaWasCreated = ref(false);

const setNoZoomViewport = () => {
  if (typeof document === "undefined") return;

  let viewportMeta = document.querySelector('meta[name="viewport"]');

  if (!viewportMeta) {
    viewportMeta = document.createElement("meta");
    viewportMeta.setAttribute("name", "viewport");
    document.head.appendChild(viewportMeta);
    viewportMetaWasCreated.value = true;
  } else {
    viewportMetaWasCreated.value = false;
    originalViewportContent.value = viewportMeta.getAttribute("content") || "";
  }

  viewportMeta.setAttribute(
    "content",
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
  );
};

const restoreViewport = () => {
  if (typeof document === "undefined") return;

  const viewportMeta = document.querySelector('meta[name="viewport"]');

  if (!viewportMeta) return;

  if (viewportMetaWasCreated.value) {
    viewportMeta.remove();
    return;
  }

  viewportMeta.setAttribute(
    "content",
    originalViewportContent.value || "width=device-width, initial-scale=1"
  );
};

onMounted(() => {
  setNoZoomViewport();
});

onBeforeUnmount(() => {
  restoreViewport();
});

const { data: subjects, fetchData, loading } = useQuery("subjects");
const { data: teachers } = useQuery("teachers");
const { data: classesList } = useQuery("classes");

const { createDoc, updateDoc, deleteDoc } = useCollection("subjects", {
  toast: false
});

const searchText = ref("");
const typeFilter = ref("All");
const classFilter = ref("All");

const showModal = ref(false);
const isEditing = ref(false);
const isSaving = ref(false);
const editId = ref(null);

const showDeleteModal = ref(false);
const subjectToDelete = ref(null);
const isDeleting = ref(false);

const defaultForm = () => ({
  subjectName: "",
  classIds: [],
  type: "general",
  teacher: null,
  fee: 0,
  status: "active",
  remark: ""
});

const form = ref(defaultForm());

const normalizeArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.result)) return value.result;
  if (Array.isArray(value?.items)) return value.items;
  return [];
};

const subjectsList = computed(() => normalizeArray(subjects.value));
const teachersOptions = computed(() => normalizeArray(teachers.value));
const classesOptions = computed(() => normalizeArray(classesList.value));

const activeSubjectsCount = computed(() => {
  return subjectsList.value.filter((subject) => subject.status === "active").length;
});

const getId = (value) => {
  return String(value?._id || value?.id || value || "").trim();
};

const formatRiel = (value) => {
  const amount = Number(value || 0);

  return `៛${amount.toLocaleString("en-US", {
    maximumFractionDigits: 0
  })}`;
};

const calculateAvgFee = () => {
  if (!subjectsList.value.length) return 0;

  const total = subjectsList.value.reduce((acc, curr) => {
    return acc + Number(curr.fee || 0);
  }, 0);

  return Math.round(total / subjectsList.value.length);
};

const translateType = (type) => {
  if (type === "general") return "ទូទៅ";
  if (type === "optional") return "ជម្រើស";
  if (type === "skill") return "ជំនាញ";
  return type || "មិនមាន";
};

const translateStatus = (status) => {
  if (status === "active") return "ដំណើរការ";
  if (status === "disabled") return "ផ្អាក";
  return status || "មិនមាន";
};

const getTypeClass = (type) => {
  switch (type) {
    case "general":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "skill":
      return "bg-purple-50 text-purple-700 border-purple-200";
    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
};

const getClassNameById = (classId) => {
  const id = getId(classId);
  const foundClass = classesOptions.value.find((cls) => getId(cls) === id);

  return foundClass?.className || "មិនស្គាល់ថ្នាក់";
};

const getClassDisplayName = (classValue) => {
  if (typeof classValue === "object" && classValue !== null) {
    return classValue.className || getClassNameById(classValue);
  }

  return getClassNameById(classValue);
};

const getSubjectClassIds = (subject) => {
  if (Array.isArray(subject?.classIds)) {
    return subject.classIds.map((cls) => getId(cls)).filter(Boolean);
  }

  if (Array.isArray(subject?.classes)) {
    return subject.classes.map((cls) => getId(cls)).filter(Boolean);
  }

  const legacyClassId = getId(subject?.classId || subject?.class);

  return legacyClassId ? [legacyClassId] : [];
};

const getSubjectClasses = (subject) => {
  if (Array.isArray(subject?.classIds) && subject.classIds.length > 0) {
    return subject.classIds;
  }

  if (Array.isArray(subject?.classes) && subject.classes.length > 0) {
    return subject.classes;
  }

  if (subject?.classId) {
    return [subject.classId];
  }

  if (subject?.class) {
    return [subject.class];
  }

  return [];
};

const getSubjectClassNames = (subject) => {
  return getSubjectClasses(subject)
    .map((cls) => getClassDisplayName(cls))
    .join(" ");
};

const selectedClasses = computed(() => {
  const ids = Array.isArray(form.value.classIds) ? form.value.classIds : [];

  return classesOptions.value.filter((cls) => {
    return ids.includes(getId(cls));
  });
});

const isClassSelected = (classId) => {
  const id = getId(classId);
  const ids = Array.isArray(form.value.classIds) ? form.value.classIds : [];

  return ids.includes(id);
};

const toggleClass = (classId) => {
  const id = getId(classId);

  if (!id) return;

  const ids = Array.isArray(form.value.classIds)
    ? [...form.value.classIds]
    : [];

  if (ids.includes(id)) {
    form.value.classIds = ids.filter((item) => item !== id);
    return;
  }

  form.value.classIds = [...ids, id];
};

const removeClass = (classId) => {
  const id = getId(classId);

  form.value.classIds = Array.isArray(form.value.classIds)
    ? form.value.classIds.filter((item) => item !== id)
    : [];
};

const filteredSubjects = computed(() => {
  const keyword = searchText.value.trim().toLowerCase();

  return subjectsList.value.filter((subject) => {
    const matchType =
      typeFilter.value === "All" || subject.type === typeFilter.value;

    const subjectClassIds = getSubjectClassIds(subject);
    const matchClass =
      classFilter.value === "All" || subjectClassIds.includes(classFilter.value);

    const teacherName = String(
      subject.teacher?.khmerName ||
        subject.teacher?.englishName ||
        ""
    ).toLowerCase();

    const classNames = getSubjectClassNames(subject).toLowerCase();

    const matchSearch =
      !keyword ||
      String(subject.subjectName || "").toLowerCase().includes(keyword) ||
      String(subject.remark || "").toLowerCase().includes(keyword) ||
      String(subject.fee || "").toLowerCase().includes(keyword) ||
      teacherName.includes(keyword) ||
      classNames.includes(keyword);

    return matchType && matchClass && matchSearch;
  });
});

const resetFilters = () => {
  searchText.value = "";
  typeFilter.value = "All";
  classFilter.value = "All";
};

const openCreateModal = () => {
  isEditing.value = false;
  editId.value = null;
  form.value = defaultForm();
  showModal.value = true;
};

const openEditModal = (subject) => {
  isEditing.value = true;
  editId.value = subject._id;

  const teacherId =
    subject.teacher && typeof subject.teacher === "object"
      ? subject.teacher._id
      : subject.teacher;

  form.value = {
    subjectName: subject.subjectName || "",
    classIds: getSubjectClassIds(subject),
    type: subject.type || "general",
    teacher: teacherId || null,
    fee: Number(subject.fee || 0),
    status: subject.status || "active",
    remark: subject.remark || ""
  };

  showModal.value = true;
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

const handleSubmit = async () => {
  if (isSaving.value) return;

  isSaving.value = true;

  try {
    const classIds = Array.isArray(form.value.classIds)
      ? form.value.classIds.filter(Boolean)
      : [];

    const payload = {
      ...form.value,
      classIds,
      classId: classIds[0] || null
    };

    if (isEditing.value && editId.value) {
      await updateDoc(editId.value, payload);
      toast.success("បានកែប្រែមុខវិជ្ជាដោយជោគជ័យ");
    } else {
      await createDoc(payload);
      toast.success("បានបង្កើតមុខវិជ្ជាថ្មីដោយជោគជ័យ");
    }

    await fetchData();
    forceCloseModal();
  } catch (error) {
    console.error("Database save exception:", error);
    toast.error(
      error.response?.data?.err ||
        error.response?.data?.message ||
        error.message ||
        "មិនអាចរក្សាទុកមុខវិជ្ជាបានទេ"
    );
  } finally {
    isSaving.value = false;
  }
};

const openDeleteConfirm = (subject) => {
  subjectToDelete.value = subject;
  showDeleteModal.value = true;
};

const forceCloseDeleteConfirm = () => {
  showDeleteModal.value = false;
  subjectToDelete.value = null;
};

const closeDeleteConfirm = () => {
  if (isDeleting.value) return;
  forceCloseDeleteConfirm();
};

const confirmDeleteSubject = async () => {
  if (!subjectToDelete.value?._id || isDeleting.value) return;

  const subjectId = subjectToDelete.value._id;
  const subjectName = subjectToDelete.value.subjectName || "មុខវិជ្ជា";

  isDeleting.value = true;

  try {
    await deleteDoc(subjectId);
    await fetchData();

    toast.success(`បានលុបមុខវិជ្ជា "${subjectName}" ដោយជោគជ័យ`);

    forceCloseDeleteConfirm();
  } catch (error) {
    console.error(error);
    toast.error(
      error.response?.data?.err ||
        error.response?.data?.message ||
        "មិនអាចលុបមុខវិជ្ជាបានទេ"
    );
  } finally {
    isDeleting.value = false;
  }
};
</script>

<style scoped>

.subjects-page-mobile-safe,
.subject-modal-panel-mobile-safe {
  font-family: "Noto Sans Khmer", "Khmer OS Battambang", "Battambang", "Khmer OS", system-ui, sans-serif;
  line-height: 1.45;
}

.subjects-page-mobile-safe h1,
.subjects-page-mobile-safe h3,
.subjects-page-mobile-safe p,
.subjects-page-mobile-safe span,
.subjects-page-mobile-safe label,
.subjects-page-mobile-safe button,
.subjects-page-mobile-safe th,
.subjects-page-mobile-safe td,
.subject-modal-panel-mobile-safe h3,
.subject-modal-panel-mobile-safe p,
.subject-modal-panel-mobile-safe span,
.subject-modal-panel-mobile-safe label,
.subject-modal-panel-mobile-safe button {
  line-height: 1.45;
}

.subjects-page-mobile-safe .break-words,
.subject-modal-panel-mobile-safe .break-words,
.form-label,
.summary-label,
.summary-value {
  overflow-wrap: anywhere;
  word-break: break-word;
}

.subjects-page-mobile-safe input,
.subjects-page-mobile-safe select,
.subjects-page-mobile-safe textarea,
.subjects-page-mobile-safe option,
.subjects-page-mobile-safe input::placeholder,
.subjects-page-mobile-safe textarea::placeholder,
.subject-modal-panel-mobile-safe input,
.subject-modal-panel-mobile-safe select,
.subject-modal-panel-mobile-safe textarea,
.subject-modal-panel-mobile-safe option,
.subject-modal-panel-mobile-safe input::placeholder,
.subject-modal-panel-mobile-safe textarea::placeholder {
  font-family: "Noto Sans Khmer", "Khmer OS Battambang", "Battambang", "Khmer OS", system-ui, sans-serif !important;
  font-size: 12px !important;
  line-height: 1.9 !important;
  font-weight: 500;
  -webkit-font-smoothing: antialiased;
  text-rendering: geometricPrecision;
}

.subjects-page-mobile-safe input,
.subjects-page-mobile-safe select,
.subject-modal-panel-mobile-safe input,
.subject-modal-panel-mobile-safe select {
  min-height: 2.65rem !important;
  height: 2.65rem !important;
  padding-top: 0.58rem !important;
  padding-bottom: 0.58rem !important;
  overflow: visible !important;
}

.subjects-page-mobile-safe textarea,
.subject-modal-panel-mobile-safe textarea {
  min-height: 4.75rem !important;
  padding-top: 0.6rem !important;
  padding-bottom: 0.6rem !important;
}

.form-label {
  display: block;
  font-size: 0.62rem;
  font-weight: 800;
  color: #64748b;
  margin-bottom: 0.2rem;
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
}

.form-input {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.58rem 0.55rem;
  font-size: 12px;
  line-height: 1.9;
  color: #334155;
  background: #ffffff;
  outline: none;
  min-height: 2.65rem;
  height: auto;
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
}

.summary-card {
  background: #ffffff;
  padding: 0.6rem;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.04);
  display: flex;
  align-items: center;
  gap: 0.55rem;
  min-width: 0;
}

.summary-icon {
  height: 2rem;
  width: 2rem;
  border-radius: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  flex-shrink: 0;
}

.summary-label {
  font-size: 0.58rem;
  font-weight: 800;
  color: #94a3b8;
  line-height: 1.45;
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
}

.summary-value {
  margin-top: 0.1rem;
  font-size: 1rem;
  font-weight: 900;
  color: #0f172a;
  line-height: 1.35;
}

.table-th {
  padding: 0.5rem 0.6rem;
  font-size: 0.68rem;
  font-weight: 900;
  color: #475569;
  border: 1px solid #e2e8f0;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.table-td {
  padding: 0.5rem 0.6rem;
  border: 1px solid #f1f5f9;
  font-size: 0.7rem;
  vertical-align: middle;
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


/* Chrome mobile bottom toolbar fix + no visual input-size changes */
@media (max-width: 640px) {
  .subjects-page-mobile-safe {
    padding-bottom: calc(2.75rem + env(safe-area-inset-bottom));
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }

  .subjects-page-mobile-safe > .max-w-7xl {
    padding-bottom: calc(1.5rem + env(safe-area-inset-bottom));
  }

  .subjects-mobile-list {
    padding-bottom: calc(1rem + env(safe-area-inset-bottom));
  }

  .subjects-mobile-list > :last-child {
    margin-bottom: calc(1.25rem + env(safe-area-inset-bottom));
  }

  .subject-modal-overlay-mobile-safe {
    min-height: 100vh;
    min-height: 100dvh;
  }

  .subject-modal-wrapper-mobile-safe {
    min-height: 100vh;
    min-height: 100dvh;
    align-items: flex-end;
    padding-bottom: calc(0.5rem + env(safe-area-inset-bottom));
  }

  .subject-modal-panel-mobile-safe {
    max-height: calc(100vh - 0.75rem);
    max-height: calc(100dvh - 0.75rem);
  }

  .subject-modal-body-mobile-safe {
    max-height: calc(100vh - 8.5rem);
    max-height: calc(100dvh - 8.5rem);
    -webkit-overflow-scrolling: touch;
  }

  .subject-modal-footer-mobile-safe {
    position: sticky;
    bottom: 0;
    z-index: 5;
    padding-bottom: calc(0.65rem + env(safe-area-inset-bottom)) !important;
  }
}

@media (min-width: 640px) {
  .form-label {
    font-size: 0.68rem;
  }

  .form-input {
    padding: 0.62rem 0.6rem;
    font-size: 12px !important;
    line-height: 1.9 !important;
    min-height: 2.65rem !important;
    height: auto;
  }

  .summary-card {
    padding: 0.75rem;
    gap: 0.75rem;
  }

  .summary-icon {
    height: 2.5rem;
    width: 2.5rem;
    font-size: 0.9rem;
  }

  .summary-label {
    font-size: 0.68rem;
  }

  .summary-value {
    font-size: 1.25rem;
  }
}
</style>