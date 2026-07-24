<template>
  <div class="classes-page-mobile-safe bg-slate-50 p-2 sm:p-3 md:p-4">
    <div class="max-w-7xl mx-auto space-y-3 md:space-y-4">
      <!-- Header -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm px-2.5 py-3 md:px-4">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-2.5 md:gap-3">
          <div class="min-w-0">
            <h1 class="text-base sm:text-lg md:text-xl font-extrabold text-slate-800 flex items-start gap-2 leading-snug">
              <span class="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs sm:text-sm shrink-0">
                <i class="fa-solid fa-school"></i>
              </span>

              <span class="break-words leading-snug">
                {{ selectedClass ? `បញ្ជីសិស្សក្នុងថ្នាក់: ${selectedClass.className}` : "បញ្ជីថ្នាក់រៀនទាំងអស់" }}
              </span>
            </h1>

            <p class="text-[11px] sm:text-xs text-slate-500 mt-1 break-words leading-snug">
              {{ selectedClass ? "គ្រប់គ្រងសិស្សក្នុងថ្នាក់ ផ្ទេរ បញ្ចូល និងដកចេញ" : "ស្វែងរក បង្កើត កែប្រែ និងគ្រប់គ្រងថ្នាក់រៀន" }}
            </p>
          </div>

          <div class="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 sm:gap-2 w-full md:w-auto">
            <button
              v-if="selectedClass"
              type="button"
              @click="openTransferModal"
              :disabled="!isAdmin"
              :title="!isAdmin ? 'មានតែ Admin ប៉ុណ្ណោះអាចផ្ទេរសិស្សបាន' : 'ផ្ទេរសិស្ស'"
              class="inline-flex justify-center items-center gap-1.5 bg-orange-500 text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-orange-600 transition shadow-sm active:scale-95 text-[11px] sm:text-xs font-bold whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-500 disabled:active:scale-100"
            >
              <i class="fa-solid fa-right-left text-[10px]"></i>
              ផ្លាស់ប្ដូរ
            </button>

            <button
              @click="selectedClass ? openEnrollModal() : openAddClassModal()"
              :disabled="!isAdmin || isClassSaving"
              :title="
                !isAdmin
                  ? (selectedClass
                      ? 'មានតែ Admin ប៉ុណ្ណោះអាចបញ្ចូលសិស្សក្នុងថ្នាក់បាន'
                      : 'មានតែ Admin ប៉ុណ្ណោះអាចបង្កើតថ្នាក់ថ្មីបាន')
                  : (selectedClass ? 'បញ្ចូលសិស្សក្នុងថ្នាក់' : 'បង្កើតថ្នាក់ថ្មី')
              "
              class="inline-flex justify-center items-center gap-1.5 bg-blue-600 text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-blue-700 transition shadow-sm active:scale-95 text-[11px] sm:text-xs font-bold whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 disabled:active:scale-100"
              :class="selectedClass ? '' : 'col-span-2 sm:col-span-1'"
            >
              <i class="fa-solid fa-plus text-[10px]"></i>
              {{ selectedClass ? "បញ្ចូលសិស្ស" : "បង្កើតថ្នាក់ថ្មី" }}
            </button>

            <button
              v-if="selectedClass"
              @click="clearSelection"
              class="col-span-2 sm:col-span-1 inline-flex justify-center items-center gap-1.5 text-slate-600 hover:text-blue-600 transition bg-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow-sm border border-slate-200 whitespace-nowrap text-[11px] sm:text-xs font-bold"
            >
              <i class="fa-solid fa-arrow-left text-[10px]"></i>
              ត្រឡប់ក្រោយ
            </button>
          </div>
        </div>
      </div>

      <!-- Class View -->
      <div v-if="!selectedClass" class="classes-view-mobile-safe space-y-3 md:space-y-4">
        <!-- Class Search -->
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-2.5 sm:p-3">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
            <div class="relative w-full sm:w-80">
              <i class="search-icon fa-solid fa-magnifying-glass"></i>

              <input
                v-model="classSearchQuery"
                type="text"
                placeholder="ស្វែងរកថ្នាក់..."
                class="search-input w-full border border-slate-200 rounded-lg text-[11px] sm:text-xs text-slate-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
              />
            </div>

            <div class="inline-flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 w-fit">
              <i class="fa-solid fa-layer-group text-[10px] sm:text-xs"></i>
              សរុប {{ filteredClassesList.length }} ថ្នាក់
            </div>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="isInitialLoadingClasses" class="bg-white rounded-xl border border-slate-200 p-7 sm:p-8 text-center">
          <div class="mx-auto h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <i class="fa-solid fa-circle-notch fa-spin text-lg sm:text-xl"></i>
          </div>

          <p class="text-[11px] sm:text-xs font-bold text-slate-500 mt-2">
            កំពុងទាញយកទិន្នន័យ...
          </p>
        </div>

        <!-- Class Cards -->
        <div v-else class="classes-list-mobile-safe grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-3">
          <div
            v-for="cls in filteredClassesList"
            :key="cls._id"
            @click="selectClass(cls)"
            class="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-slate-200 hover:border-blue-300 group relative overflow-hidden cursor-pointer"
          >
            <div class="h-1 bg-blue-600 w-full"></div>

            <div class="p-2.5 sm:p-3">
              <div class="flex justify-between items-start gap-2 mb-2">
                <div class="min-w-0">
                  <h3 class="text-xs sm:text-sm font-extrabold text-slate-800 group-hover:text-blue-600 transition break-words leading-snug">
                    {{ cls.className }}
                  </h3>

                  <span class="text-[10px] sm:text-[11px] text-slate-500">
                    កម្រិត: {{ cls.classGrade || "N/A" }}
                  </span>
                </div>

                <span class="bg-blue-50 text-blue-700 text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full border border-blue-100 shrink-0">
                  #{{ cls.classNumber || "-" }}
                </span>
              </div>

              <div class="space-y-1 text-[10px] sm:text-[11px] text-slate-600">
                <div class="flex items-center gap-1.5 sm:gap-2">
                  <i class="fa-solid fa-clock text-slate-400 w-3 text-[10px]"></i>
                  <span class="font-bold text-blue-600 break-words leading-snug">
                    {{ cls.timeStudy || "មិនមាន" }}
                  </span>
                </div>

                <div class="flex items-center gap-1.5 sm:gap-2">
                  <i class="fa-solid fa-chalkboard-user text-slate-400 w-3 text-[10px]"></i>
                  <span class="break-words leading-snug">
                    {{ getTeacherName(cls.teacher) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div class="flex items-center gap-1.5 sm:gap-2 text-slate-700">
                <i class="fa-solid fa-users text-slate-500 text-[10px]"></i>
                <span class="font-bold text-[10px] sm:text-[11px]">
                  {{ cls.students?.length || 0 }} សិស្ស
                </span>
              </div>

              <div class="flex items-center gap-1">
                <button
                  type="button"
                  @click.stop="isAdmin ? openEditClassModal(cls) : selectClass(cls)"
                  :disabled="isAdmin && isClassSaving"
                  :title="isAdmin ? 'កែប្រែថ្នាក់' : 'មើលព័ត៌មានថ្នាក់'"
                  class="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-slate-500 disabled:hover:bg-transparent"
                >
                  <i
                    :class="
                      isAdmin
                        ? 'fa-solid fa-pen-to-square text-[11px] sm:text-xs'
                        : 'fa-solid fa-eye text-[11px] sm:text-xs'
                    "
                  ></i>
                </button>

                <button
                  type="button"
                  @click.stop="openDeleteClassModal(cls)"
                  :disabled="!isAdmin || isClassDeleting"
                  :title="!isAdmin ? 'មានតែ Admin ប៉ុណ្ណោះអាចលុបថ្នាក់បាន' : 'លុបថ្នាក់'"
                  class="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-slate-500 disabled:hover:bg-transparent"
                >
                  <i class="fa-solid fa-trash text-[11px] sm:text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty Class -->
        <div
          v-if="!isInitialLoadingClasses && filteredClassesList.length === 0"
          class="text-center py-8 sm:py-10 bg-white border border-dashed border-slate-300 rounded-xl text-slate-400"
        >
          <i class="fa-solid fa-school-circle-xmark text-xl sm:text-2xl mb-2"></i>
          <p class="text-xs sm:text-sm font-bold text-slate-600">
            មិនមានថ្នាក់ដែលត្រូវនឹងការស្វែងរកទេ
          </p>
        </div>
      </div>

      <!-- Student View -->
      <div v-else class="class-students-view-mobile-safe animate-fade-in-up space-y-3 md:space-y-4">
        <!-- Student Filters -->
        <div class="bg-white p-2.5 sm:p-3 rounded-xl shadow-sm border border-slate-200">
          <div class="grid grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_auto] gap-2 items-end">
            <div class="col-span-2 md:col-span-1">
              <label class="form-label">ស្វែងរកសិស្ស</label>

              <div class="relative">
                <i class="search-icon fa-solid fa-magnifying-glass"></i>

                <input
                  v-model="studentSearchQuery"
                  type="text"
                  placeholder="ស្វែងរកតាមឈ្មោះ ឬអត្តលេខ..."
                  class="form-input search-input"
                />
              </div>
            </div>

            <div>
              <label class="form-label">ភេទ</label>

              <select
                v-model="genderFilter"
                class="form-input"
              >
                <option value="All">ភេទទាំងអស់</option>
                <option value="ប្រុស">ប្រុស</option>
                <option value="ស្រី">ស្រី</option>
              </select>
            </div>

            <div>
              <label class="form-label">ស្ថានភាព</label>

              <select
                v-model="statusFilter"
                class="form-input"
              >
                <option value="All">ស្ថានភាពទាំងអស់</option>
                <option value="active">ដំណើរការ</option>
                <option value="inactive">ផ្អាក</option>
              </select>
            </div>

            <div class="col-span-2 md:col-span-1 bg-blue-50 border border-blue-100 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs text-blue-700 font-bold h-[2rem] sm:h-[2.1rem] flex items-center justify-center whitespace-nowrap">
              <i class="fa-solid fa-users mr-1 text-[10px]"></i>
              សរុប:
              <span class="font-extrabold ml-1">{{ filteredStudents.length }}</span>
              នាក់
            </div>
          </div>
        </div>

        <!-- Mobile Student Cards -->
        <div class="class-students-mobile-list lg:hidden space-y-2">
          <div
            v-if="filteredStudents.length === 0"
            class="text-center py-8 bg-white rounded-xl border border-dashed border-slate-300 text-slate-400"
          >
            <div class="mx-auto mb-2 h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center">
              <i class="fa-solid fa-users-slash text-lg"></i>
            </div>

            <p class="text-xs font-bold text-slate-500">
              មិនមានទិន្នន័យសិស្សឡើយ
            </p>
          </div>

          <div
            v-for="student in paginatedStudents"
            :key="student._id"
            class="bg-white rounded-xl border border-slate-200 shadow-sm p-2.5 active:bg-blue-50/40 transition"
            @click="openViewModal(student)"
          >
            <div class="flex items-start gap-2">
              <div
                class="h-9 w-9 rounded-full overflow-hidden border border-blue-100 bg-blue-50 text-blue-700 flex items-center justify-center font-extrabold shrink-0"
              >
                <img
                  v-if="getStudentImageUrl(student)"
                  :src="getStudentImageUrl(student)"
                  :alt="getStudentFullName(student)"
                  class="h-full w-full object-cover"
                />

                <span v-else class="text-[11px]">
                  {{ getStudentInitial(student) }}
                </span>
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-2">
                  <div class="min-w-0">
                    <p class="font-khmer text-sm font-extrabold text-slate-800 leading-snug break-words">
                      {{ student.khmerName || "-" }}
                    </p>

                    <p
                      v-if="student.englishName"
                      class="text-[10px] text-slate-400 break-words leading-snug mt-0.5"
                    >
                      {{ student.englishName }}
                    </p>
                  </div>

                  <div class="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      @click.stop="openViewModal(student)"
                      title="មើល"
                      class="h-7 w-7 inline-flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition"
                    >
                      <i class="fa-solid fa-eye text-[11px]"></i>
                    </button>

                    <button
                      type="button"
                      @click.stop="openDeleteStudentModal(student)"
                      :disabled="!isAdmin || isStudentRemoving"
                      :title="!isAdmin ? 'មានតែ Admin ប៉ុណ្ណោះអាចដកសិស្សចេញពីថ្នាក់បាន' : 'ដកចេញ'"
                      class="h-7 w-7 inline-flex items-center justify-center rounded-lg bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-red-50"
                    >
                      <i class="fa-solid fa-trash text-[11px]"></i>
                    </button>
                  </div>
                </div>

                <div class="mt-1.5 flex flex-wrap items-center gap-1">
                  <span class="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 text-[10px] font-bold leading-snug">
                    <i class="fa-solid fa-id-card text-[9px] text-slate-400"></i>
                    {{ student.studentId || student.idCode || "-" }}
                  </span>

                  <span
                    :class="
                      student.gender === 'ស្រី'
                        ? 'bg-pink-50 text-pink-700 border-pink-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    "
                    class="inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-bold leading-snug"
                  >
                    <i class="fa-solid fa-user text-[9px]"></i>
                    {{ student.gender || "-" }}
                  </span>

                  <span
                    v-if="getStudentClassName(student)"
                    class="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 text-[10px] font-bold leading-snug"
                  >
                    <i class="fa-solid fa-school text-[9px]"></i>
                    {{ getStudentClassName(student) }}
                  </span>

                  <span
                    v-if="getStudentClassGrade(student)"
                    class="inline-flex items-center rounded-full bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.5 text-[10px] font-bold leading-snug"
                  >
                    {{ getStudentClassGrade(student) }}
                  </span>
                </div>

                <div class="mt-1.5 grid grid-cols-1 min-[390px]:grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] text-slate-500">
                  <div class="flex items-center gap-1 min-w-0">
                    <i class="fa-solid fa-cake-candles text-[9px] text-slate-400 w-3 shrink-0"></i>
                    <span class="break-words leading-snug">
                      កំណើត៖ {{ formatDate(student.birthDate || student.dob) }}
                    </span>
                  </div>

                  <div class="flex items-center gap-1 min-w-0">
                    <i class="fa-solid fa-phone text-[9px] text-slate-400 w-3 shrink-0"></i>
                    <span class="break-words leading-snug">
                      {{ student.phone || student.family?.motherNumber || "-" }}
                    </span>
                  </div>

                  <div class="flex items-center gap-1 min-w-0">
                    <i class="fa-solid fa-flag text-[9px] text-slate-400 w-3 shrink-0"></i>
                    <span class="break-words leading-snug">
                      សញ្ជាតិ៖ {{ student.nationality?.student || "ខ្មែរ" }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop Student Table -->
        <div class="hidden lg:block overflow-x-auto rounded-xl shadow-sm border border-slate-200 bg-white">
          <table class="w-full text-left border-collapse text-xs min-w-[1050px]">
            <thead>
              <tr class="bg-slate-100 text-slate-700 border-b border-slate-200">
                <th class="table-th w-20">រូបថត</th>
                 <th class="hidden lg:table-cell table-th">អត្តលេខ</th>
                <th class="table-th">ឈ្មោះខ្មែរ</th>
                   <th class="hidden lg:table-cell table-th">ឈ្មោះអង់គ្លេស</th>
                <th class="table-th">ភេទ</th>
                <th class="hidden lg:table-cell table-th">ថ្ងៃខែឆ្នាំកំណើត</th>
                <th class="hidden lg:table-cell table-th">សញ្ជាតិ</th>
                <th class="hidden lg:table-cell table-th">លេខទូរស័ព្ទ</th>
                <th class="hidden lg:table-cell table-th">បន្ទប់</th>
                <th class="hidden lg:table-cell table-th">កម្រិត</th>
                <th class="hidden lg:table-cell table-th text-right">មើល</th>
                <th class="table-th text-right w-24 pr-4">លុប</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-100">
              <tr v-if="filteredStudents.length === 0">
                <td colspan="12" class="text-center py-10 text-slate-400">
                  <div class="mx-auto mb-2 h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <i class="fa-solid fa-users-slash text-xl"></i>
                  </div>

                  <p class="text-sm font-bold text-slate-500">
                    មិនមានទិន្នន័យសិស្សឡើយ
                  </p>
                </td>
              </tr>

              <StudentCard
                v-for="student in paginatedStudents"
                :key="student._id"
                :student="student"
                class="class-student-view-eye"
                :class="{ 'non-admin-student-remove-disabled': !isAdmin }"
                @view="openViewModal"
                @edit="openViewModal"
                @delete="openDeleteStudentModal"
              />
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          v-if="filteredStudents.length > 0"
          class="class-students-pagination-mobile-safe flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-3 bg-white p-2.5 sm:p-3 rounded-xl shadow-sm border border-slate-200"
        >
          <div class="flex items-center gap-1.5 sm:gap-2">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="px-2.5 sm:px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 text-[11px] sm:text-xs font-bold text-slate-700 transition flex items-center gap-1"
            >
              <i class="fa-solid fa-chevron-left text-[10px]"></i>
              <span class="hidden min-[380px]:inline">មុន</span>
            </button>

            <span class="text-[11px] sm:text-xs text-slate-600 font-bold whitespace-nowrap px-1">
              {{ currentPage }} / {{ totalPages }}
            </span>

            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="px-2.5 sm:px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 text-[11px] sm:text-xs font-bold text-slate-700 transition flex items-center gap-1"
            >
              <span class="hidden min-[380px]:inline">បន្ទាប់</span>
              <i class="fa-solid fa-chevron-right text-[10px]"></i>
            </button>
          </div>

          <div class="flex items-center gap-2 text-[11px] sm:text-xs text-slate-600">
            <span class="font-bold">បង្ហាញ</span>

            <select
              v-model.number="rowsPerPage"
              class="border border-slate-200 rounded-lg px-2 py-1.5 text-[11px] sm:text-xs outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 w-20 bg-white"
            >
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Modals -->
      <EnrollStudentModal
        :is-open="isEnrollModalOpen"
        :current-class-id="selectedClass ? selectedClass._id : ''"
        :mode="modalMode"
        @close="closeEnrollModal"
        @refresh="handleRefreshData"
      />

      <ClassFormModal
        :is-open="isClassModalOpen"
        :is-editing="isEditingClass"
        :class-data="classToEdit"
        :teachers="teachersList"
        :create-disabled="!isAdmin"
        :save-disabled="!isAdmin"
        @close="closeClassModal"
        @save="saveClass"
      />

      <StudentViewModal
        :is-open="isViewModalOpen"
        :student="studentToView"
        @close="closeViewModal"
      />

      <DeleteConfirmationModal
        :is-open="isDeleteStudentModalOpen"
        :item-name="studentToDelete?.englishName || studentToDelete?.khmerName"
        title="ដកសិស្សចេញពីថ្នាក់"
        message="តើអ្នកពិតជាចង់ដកសិស្សនេះចេញពីថ្នាក់មែនទេ? ទិន្នន័យសិស្សនឹងមិនត្រូវបានលុបទេ។"
        @close="closeDeleteStudentModal"
        @confirm="confirmDeleteStudent"
      />

      <DeleteConfirmationModal
        :is-open="isDeleteClassModalOpen"
        :item-name="classToDelete?.className"
        title="លុបថ្នាក់រៀន"
        @close="closeDeleteClassModal"
        @confirm="confirmDeleteClass"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";

// Components
import StudentCard from "./students/StudentCard.vue";
import EnrollStudentModal from "./classes/EnrollStudentModal.vue";
import StudentViewModal from "./students/StudentViewModal.vue";
import ClassFormModal from "./classes/ClassFormModal.vue";
import DeleteConfirmationModal from "./shared/DeleteConfirmationModal.vue";

// API & Hooks
import api from "../config/api";
import { useQuery } from "../hooks/useQuery.js";
import { useCollection } from "../hooks/useCollection.js";
import { useToast } from "vue-toastification";

const toast = useToast();

const readStoredUser = () => {
  if (typeof localStorage === "undefined") return {};

  const keys = ["user", "currentUser", "authUser", "auth"];

  for (const key of keys) {
    try {
      const rawValue = localStorage.getItem(key);

      if (!rawValue) continue;

      const parsedValue = JSON.parse(rawValue);
      return parsedValue?.user || parsedValue?.data || parsedValue;
    } catch (error) {
      // Ignore malformed or non-JSON values and continue to the next key.
    }
  }

  return {
    role: localStorage.getItem("role") || ""
  };
};

const currentUser = ref(readStoredUser());

const isAdmin = computed(() => {
  return String(currentUser.value?.role || "").toLowerCase() === "admin";
});

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
  } else if (!originalViewportContent.value) {
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


// --- Data Fetching ---
const {
  data: classes,
  isLoading: loadingClasses,
  fetchData: refetchClasses
} = useQuery("classes");

const {
  createDoc: createClassDoc,
  updateDoc: updateClassDoc,
  deleteDoc: deleteClassDoc
} = useCollection("classes", {
  toast: false
});

const {
  data: students,
  fetchData: refetchStudents
} = useQuery("students");

const { data: teachers } = useQuery("teachers");

const teachersList = computed(() => normalizeArray(teachers.value));

// --- State Management ---
const selectedClass = ref(null);
const classSearchQuery = ref("");

// --- Filter States (Student View) ---
const studentSearchQuery = ref("");
const genderFilter = ref("All");
const statusFilter = ref("All");

// --- Modal States ---
const isEnrollModalOpen = ref(false);
const modalMode = ref("enroll");
const isDeleteStudentModalOpen = ref(false);
const isViewModalOpen = ref(false);
const studentToDelete = ref(null);
const studentToView = ref(null);

// Classes
const isClassModalOpen = ref(false);
const isDeleteClassModalOpen = ref(false);
const isEditingClass = ref(false);
const classToEdit = ref(null);
const classToDelete = ref(null);

const isClassSaving = ref(false);
const isClassDeleting = ref(false);
const isStudentRemoving = ref(false);

const localClasses = ref([]);
const localStudents = ref([]);

// --- Pagination ---
const currentPage = ref(1);
const rowsPerPage = ref(10);

const normalizeArray = (responseData) => {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.result)) return responseData.result;
  if (Array.isArray(responseData?.data)) return responseData.data;
  if (Array.isArray(responseData?.items)) return responseData.items;

  return [];
};

watch(
  classes,
  (value) => {
    localClasses.value = [...normalizeArray(value)];
  },
  {
    immediate: true,
    deep: true
  }
);

watch(
  students,
  (value) => {
    localStudents.value = [...normalizeArray(value)];
  },
  {
    immediate: true,
    deep: true
  }
);

const classesList = computed(() => localClasses.value);
const studentsList = computed(() => localStudents.value);

const isInitialLoadingClasses = computed(() => {
  const queryIsLoading = loadingClasses?.value ?? loadingClasses ?? false;
  return Boolean(queryIsLoading) && localClasses.value.length === 0;
});

const isClassCreationRestricted = computed(() => {
  return !selectedClass.value && !isAdmin.value;
});

const getId = (value) => {
  return String(value?._id || value?.id || value || "").trim();
};

const extractSavedEntity = (response, entityKey) => {
  const root = response?.data ?? response;

  const candidates = [
    root?.data,
    root?.result,
    root?.item,
    root?.[entityKey],
    root
  ];

  return (
    candidates.find((candidate) => {
      return candidate && typeof candidate === "object" && !Array.isArray(candidate);
    }) || {}
  );
};

const mergeClassData = (baseClass = {}, changes = {}) => {
  return {
    ...baseClass,
    ...changes,
    students: Array.isArray(changes.students)
      ? changes.students
      : (Array.isArray(baseClass.students) ? baseClass.students : [])
  };
};

const upsertClassLocally = (classData, fallbackId = "") => {
  const classId = getId(classData) || String(fallbackId || "").trim();

  const nextClass = {
    ...classData,
    ...(classId && !classData?._id && !classData?.id ? { _id: classId } : {})
  };

  const existingIndex = localClasses.value.findIndex((item) => {
    return getId(item) === classId;
  });

  if (existingIndex >= 0) {
    const nextList = [...localClasses.value];
    const mergedClass = mergeClassData(nextList[existingIndex], nextClass);

    nextList.splice(existingIndex, 1, mergedClass);
    localClasses.value = nextList;

    if (getId(selectedClass.value) === classId) {
      selectedClass.value = mergedClass;
    }

    return;
  }

  localClasses.value = [nextClass, ...localClasses.value];
};

const removeClassLocally = (classId) => {
  const normalizedId = String(classId || "").trim();

  localClasses.value = localClasses.value.filter((classItem) => {
    return getId(classItem) !== normalizedId;
  });
};

const removeStudentFromSelectedClassLocally = (studentId) => {
  const normalizedStudentId = String(studentId || "").trim();
  const selectedClassId = getId(selectedClass.value);

  localStudents.value = localStudents.value.map((student) => {
    if (getId(student) !== normalizedStudentId) return student;

    return {
      ...student,
      grade: null,
      class: null,
      classId: null
    };
  });

  if (!selectedClassId) return;

  const currentClass =
    localClasses.value.find((classItem) => getId(classItem) === selectedClassId) ||
    selectedClass.value;

  const updatedClass = {
    ...currentClass,
    students: (currentClass?.students || []).filter((student) => {
      return getId(student) !== normalizedStudentId;
    })
  };

  localClasses.value = localClasses.value.map((classItem) => {
    return getId(classItem) === selectedClassId ? updatedClass : classItem;
  });

  selectedClass.value = updatedClass;
};

let classesSyncPromise = null;
let studentsSyncPromise = null;

const syncClassesSilently = () => {
  if (classesSyncPromise) return classesSyncPromise;

  classesSyncPromise = Promise.resolve(refetchClasses())
    .catch((error) => {
      console.error("Class background sync failed:", error);
    })
    .finally(() => {
      classesSyncPromise = null;
    });

  return classesSyncPromise;
};

const syncStudentsSilently = () => {
  if (studentsSyncPromise) return studentsSyncPromise;

  studentsSyncPromise = Promise.resolve(refetchStudents())
    .catch((error) => {
      console.error("Student background sync failed:", error);
    })
    .finally(() => {
      studentsSyncPromise = null;
    });

  return studentsSyncPromise;
};

const activeToastIds = new Map();
const recentToastSignatures = new Map();

const showToastOnce = (type, message, actionKey) => {
  const normalizedMessage = String(message || "").trim();
  const signature = `${type}:${actionKey}:${normalizedMessage}`;
  const now = Date.now();
  const previousTime = recentToastSignatures.get(signature) || 0;

  if (!normalizedMessage || now - previousTime < 1400) return;

  recentToastSignatures.set(signature, now);

  const previousToastId = activeToastIds.get(actionKey);

  if (previousToastId !== undefined && previousToastId !== null) {
    toast.dismiss(previousToastId);
  }

  const toastMethod = type === "error" ? toast.error : toast.success;
  const toastId = toastMethod(normalizedMessage, {
    timeout: 3500,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true
  });

  activeToastIds.set(actionKey, toastId);
};

const getErrorMessage = (error, fallback) => {
  return (
    error?.response?.data?.err ||
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
};

const getApiOrigin = () => {
  const baseURL = api.defaults?.baseURL || import.meta.env.VITE_API_URL || "";

  if (!baseURL || baseURL === "/api") {
    return window.location.origin;
  }

  if (baseURL.startsWith("http")) {
    return baseURL.replace(/\/api\/?$/, "").replace(/\/$/, "");
  }

  return window.location.origin;
};

const getImageUrl = (imagePath = "") => {
  if (!imagePath) return "";

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  return `${getApiOrigin()}${imagePath}`;
};

const getStudentImageUrl = (student) => {
  return getImageUrl(student?.profileImage);
};

const getStudentFullName = (student) => {
  return `${student?.khmerName || ""} ${student?.englishName || ""}`.trim();
};

const getStudentInitial = (student) => {
  return (
    student?.khmerName?.charAt(0) ||
    student?.englishName?.charAt(0)?.toUpperCase() ||
    "S"
  );
};

const getStudentClassObject = (student) => {
  if (student?.grade && typeof student.grade === "object") return student.grade;
  if (student?.class && typeof student.class === "object") return student.class;
  if (student?.classId && typeof student.classId === "object") return student.classId;

  return null;
};

const getStudentClassId = (student) => {
  return (
    getId(student?.grade) ||
    getId(student?.class) ||
    getId(student?.classId) ||
    ""
  );
};

const getStudentClassName = (student) => {
  const classObject = getStudentClassObject(student);

  if (classObject?.className) return classObject.className;

  const classId = getStudentClassId(student);
  const foundClass = classesList.value.find((cls) => getId(cls) === classId);

  return foundClass?.className || "";
};

const getStudentClassGrade = (student) => {
  const classObject = getStudentClassObject(student);

  if (classObject?.classGrade) return classObject.classGrade;

  const classId = getStudentClassId(student);
  const foundClass = classesList.value.find((cls) => getId(cls) === classId);

  return foundClass?.classGrade || "";
};

const formatDate = (date) => {
  if (!date) return "-";

  const d = new Date(date);

  if (Number.isNaN(d.getTime())) {
    return "-";
  }

  return d.toLocaleDateString("km-KH", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
};

// ==========================================
// 1. CLASS LOGIC
// ==========================================
watch(
  localClasses,
  (classItems) => {
    const selectedClassId = getId(selectedClass.value);

    if (!selectedClassId) return;

    const refreshedClass = classItems.find((classItem) => {
      return getId(classItem) === selectedClassId;
    });

    if (refreshedClass) {
      selectedClass.value = refreshedClass;
    }
  },
  {
    deep: true
  }
);

const filteredClassesList = computed(() => {
  if (!classSearchQuery.value.trim()) return classesList.value;

  const query = classSearchQuery.value.trim().toLowerCase();

  return classesList.value.filter((c) =>
    c.className?.toLowerCase().includes(query) ||
    String(c.classNumber || "").toLowerCase().includes(query) ||
    c.classGrade?.toLowerCase().includes(query) ||
    c.timeStudy?.toLowerCase().includes(query)
  );
});

const getTeacherName = (teacher) => {
  if (!teacher) return "មិនទាន់មានគ្រូ";

  return typeof teacher === "object"
    ? (teacher.khmerName || teacher.englishName || teacher.username || "បានកំណត់គ្រូ")
    : "បានកំណត់គ្រូ";
};

const selectClass = (cls) => {
  selectedClass.value = cls;
  currentPage.value = 1;
  studentSearchQuery.value = "";
  genderFilter.value = "All";
  statusFilter.value = "All";
};

const clearSelection = () => {
  selectedClass.value = null;
  currentPage.value = 1;
  studentSearchQuery.value = "";
};

const openAddClassModal = () => {
  if (isClassSaving.value || !isAdmin.value) return;

  isEditingClass.value = false;
  classToEdit.value = null;
  isClassModalOpen.value = true;
};

const openEditClassModal = (cls) => {
  if (isClassSaving.value || !isAdmin.value) return;

  isEditingClass.value = true;
  classToEdit.value = cls;
  isClassModalOpen.value = true;
};

const openDeleteClassModal = (cls) => {
  if (isClassDeleting.value || !isAdmin.value) return;

  classToDelete.value = cls;
  isDeleteClassModalOpen.value = true;
};

const forceCloseClassModal = () => {
  isClassModalOpen.value = false;
  isEditingClass.value = false;
  classToEdit.value = null;
};

const closeClassModal = () => {
  if (isClassSaving.value) return;
  forceCloseClassModal();
};

const forceCloseDeleteClassModal = () => {
  isDeleteClassModalOpen.value = false;
  classToDelete.value = null;
};

const closeDeleteClassModal = () => {
  if (isClassDeleting.value) return;
  forceCloseDeleteClassModal();
};

const saveClass = async (classData) => {
  if (isClassSaving.value) return;

  const wasEditing = isEditingClass.value;
  const editingId = getId(classData) || getId(classToEdit.value);

  // All Class Create/Edit/Update/Delete actions are admin-only.
  // Student enrollment, transfer, view and removal remain unchanged.
  if (!isAdmin.value) {
    showToastOnce(
      "error",
      wasEditing
        ? "មានតែ Admin ប៉ុណ្ណោះអាចកែប្រែថ្នាក់បាន"
        : "មានតែ Admin ប៉ុណ្ណោះអាចបង្កើតថ្នាក់ថ្មីបាន",
      wasEditing ? "class-update-permission" : "class-create-permission"
    );
    return;
  }

  isClassSaving.value = true;

  try {
    if (wasEditing) {
      if (!editingId) {
        throw new Error("Class ID is missing");
      }

      const existingClass =
        localClasses.value.find((classItem) => getId(classItem) === editingId) ||
        classToEdit.value ||
        {};

      const response = await updateClassDoc(editingId, classData);
      const responseClass = extractSavedEntity(response, "class");

      upsertClassLocally(
        mergeClassData(existingClass, {
          ...classData,
          ...responseClass
        }),
        editingId
      );
    } else {
      const response = await createClassDoc(classData);
      const responseClass = extractSavedEntity(response, "class");
      const temporaryId =
        getId(responseClass) ||
        `local-class-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      upsertClassLocally(
        {
          ...classData,
          ...responseClass
        },
        temporaryId
      );
    }

    forceCloseClassModal();

    showToastOnce(
      "success",
      wasEditing
        ? "បានកែប្រែថ្នាក់ដោយជោគជ័យ"
        : "បានបង្កើតថ្នាក់ថ្មីដោយជោគជ័យ",
      wasEditing ? "class-update" : "class-create"
    );

    void syncClassesSilently();
  } catch (error) {
    console.error("Error saving class:", error);

    showToastOnce(
      "error",
      getErrorMessage(error, "មិនអាចរក្សាទុកថ្នាក់បានទេ"),
      wasEditing ? "class-update-error" : "class-create-error"
    );
  } finally {
    isClassSaving.value = false;
  }
};

const confirmDeleteClass = async () => {
  if (!classToDelete.value || isClassDeleting.value) return;

  if (!isAdmin.value) {
    showToastOnce(
      "error",
      "មានតែ Admin ប៉ុណ្ណោះអាចលុបថ្នាក់បាន",
      "class-delete-permission"
    );
    return;
  }

  const classId = getId(classToDelete.value);

  if (!classId) {
    showToastOnce(
      "error",
      "Class ID is missing",
      "class-delete-error"
    );
    return;
  }

  isClassDeleting.value = true;

  try {
    await deleteClassDoc(classId);

    removeClassLocally(classId);

    if (getId(selectedClass.value) === classId) {
      clearSelection();
    }

    forceCloseDeleteClassModal();

    showToastOnce(
      "success",
      "បានលុបថ្នាក់ដោយជោគជ័យ",
      "class-delete"
    );

    void syncClassesSilently();
  } catch (error) {
    console.error("Error deleting class:", error);

    showToastOnce(
      "error",
      getErrorMessage(error, "មិនអាចលុបថ្នាក់បានទេ"),
      "class-delete-error"
    );
  } finally {
    isClassDeleting.value = false;
  }
};

// ==========================================
// 2. STUDENT LOGIC
// ==========================================
const selectedClassStudentIds = computed(() => {
  return (selectedClass.value?.students || []).map((student) => student._id || student);
});

const filteredStudents = computed(() => {
  if (!selectedClass.value) return [];

  const keyword = studentSearchQuery.value.trim().toLowerCase();

  return studentsList.value.filter((student) => {
    const studentId = student._id;
    const gradeId = typeof student.grade === "object" && student.grade !== null
      ? student.grade._id
      : student.grade;

    const inClassByList = selectedClassStudentIds.value.includes(studentId);
    const inClassByGrade = gradeId === selectedClass.value._id;

    if (!inClassByList && !inClassByGrade) return false;

    const fullName = `${student.khmerName || ""} ${student.englishName || ""}`.toLowerCase();

    const nameMatch =
      !keyword ||
      fullName.includes(keyword) ||
      String(student.studentId || "").toLowerCase().includes(keyword) ||
      String(student.idCode || "").toLowerCase().includes(keyword);

    const genderMatch = genderFilter.value === "All" || student.gender === genderFilter.value;
    const statusMatch = statusFilter.value === "All" || student.status === statusFilter.value;

    return nameMatch && genderMatch && statusMatch;
  });
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredStudents.value.length / rowsPerPage.value))
);

const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  return filteredStudents.value.slice(start, start + rowsPerPage.value);
});

watch([filteredStudents, rowsPerPage], () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value;
  }
});

watch([studentSearchQuery, genderFilter, statusFilter], () => {
  currentPage.value = 1;
});

watch(isAdmin, (adminAllowed) => {
  if (adminAllowed) return;

  isEnrollModalOpen.value = false;
  isDeleteStudentModalOpen.value = false;
  studentToDelete.value = null;
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value += 1;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value -= 1;
};

const handleRefreshData = async () => {
  await Promise.all([
    syncStudentsSilently(),
    syncClassesSilently()
  ]);
};

const openEnrollModal = () => {
  if (!isAdmin.value) return;

  modalMode.value = "enroll";
  isEnrollModalOpen.value = true;
};

const openTransferModal = () => {
  if (!isAdmin.value) return;

  modalMode.value = "transfer";
  isEnrollModalOpen.value = true;
};

const closeEnrollModal = () => {
  isEnrollModalOpen.value = false;
};

const openViewModal = (student) => {
  studentToView.value = student;
  isViewModalOpen.value = true;
};

const openDeleteStudentModal = (student) => {
  if (!isAdmin.value || isStudentRemoving.value) return;

  studentToDelete.value = student;
  isDeleteStudentModalOpen.value = true;
};

const closeViewModal = () => {
  isViewModalOpen.value = false;
  studentToView.value = null;
};

const forceCloseDeleteStudentModal = () => {
  isDeleteStudentModalOpen.value = false;
  studentToDelete.value = null;
};

const closeDeleteStudentModal = () => {
  if (isStudentRemoving.value) return;
  forceCloseDeleteStudentModal();
};

const confirmDeleteStudent = async () => {
  if (!studentToDelete.value || !selectedClass.value || isStudentRemoving.value) {
    return;
  }

  if (!isAdmin.value) {
    showToastOnce(
      "error",
      "មានតែ Admin ប៉ុណ្ណោះអាចដកសិស្សចេញពីថ្នាក់បាន",
      "class-student-remove-permission"
    );
    return;
  }

  const studentId = getId(studentToDelete.value);
  const classId = getId(selectedClass.value);

  if (!studentId || !classId) {
    showToastOnce(
      "error",
      "Student or Class ID is missing",
      "class-student-remove-error"
    );
    return;
  }

  isStudentRemoving.value = true;

  try {
    await api.delete(`/classes/${classId}/students/${studentId}`);

    removeStudentFromSelectedClassLocally(studentId);

    if (paginatedStudents.value.length === 0 && currentPage.value > 1) {
      currentPage.value -= 1;
    }

    forceCloseDeleteStudentModal();

    showToastOnce(
      "success",
      "បានដកសិស្សចេញពីថ្នាក់ដោយជោគជ័យ",
      "class-student-remove"
    );

    void Promise.all([
      syncStudentsSilently(),
      syncClassesSilently()
    ]);
  } catch (error) {
    console.error("Error removing student:", error);

    showToastOnce(
      "error",
      getErrorMessage(error, "មិនអាចដកសិស្សចេញពីថ្នាក់បានទេ"),
      "class-student-remove-error"
    );
  } finally {
    isStudentRemoving.value = false;
  }
};

onMounted(() => {
  currentUser.value = readStoredUser();
  setNoZoomViewport();
});

onBeforeUnmount(() => {
  restoreViewport();
});
</script>

<style scoped>

.classes-page-mobile-safe {
  font-family: "Noto Sans Khmer", "Khmer OS Battambang", "Battambang", "Khmer OS", system-ui, sans-serif;
  line-height: 1.45;
}

.classes-page-mobile-safe h1,
.classes-page-mobile-safe h3,
.classes-page-mobile-safe p,
.classes-page-mobile-safe span,
.classes-page-mobile-safe label,
.classes-page-mobile-safe button,
.classes-page-mobile-safe th,
.classes-page-mobile-safe td {
  line-height: 1.45;
}

.classes-page-mobile-safe .break-words {
  overflow-wrap: anywhere;
  word-break: break-word;
}

.classes-page-mobile-safe input,
.classes-page-mobile-safe select,
.classes-page-mobile-safe textarea,
.classes-page-mobile-safe option,
.classes-page-mobile-safe input::placeholder {
  font-family: "Noto Sans Khmer", "Khmer OS Battambang", "Battambang", "Khmer OS", system-ui, sans-serif !important;
  font-size: 12px !important;
  line-height: 1.9 !important;
  font-weight: 500;
  -webkit-font-smoothing: antialiased;
  text-rendering: geometricPrecision;
}

.classes-page-mobile-safe input,
.classes-page-mobile-safe select {
  min-height: 2.65rem !important;
  height: 2.65rem !important;
  padding-top: 0.58rem !important;
  padding-bottom: 0.58rem !important;
  overflow: visible !important;
}

.table-th {
  line-height: 1.45;
}

.form-label {
  display: block;
  font-size: 0.68rem;
  font-weight: 800;
  color: #64748b;
  margin-bottom: 0.2rem;
}

.form-input {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.44rem 0.6rem;
  font-size: 0.75rem;
  color: #334155;
  background: #ffffff;
  outline: none;
  min-height: 2.1rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
}

.search-icon {
  position: absolute;
  left: 0.78rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 0.7rem;
  pointer-events: none;
  z-index: 2;
}

.search-input {
  padding-left: 2.25rem !important;
  padding-right: 0.75rem !important;
  min-height: 2.1rem;
}

.table-th {
  padding: 0.5rem 0.6rem;
  font-size: 0.7rem;
  font-weight: 900;
  color: #475569;
  border: 1px solid #e2e8f0;
  white-space: nowrap;
}

.font-khmer {
  font-family: "Battambang", "Siemreap", sans-serif;
}

.animate-fade-in-up {
  animation: fadeInUp 0.25s ease-out forwards;
}

@media (max-width: 640px) {
  .classes-page-mobile-safe {
    padding-bottom: calc(2.75rem + env(safe-area-inset-bottom));
  }

  .classes-page-mobile-safe > .max-w-7xl {
    padding-bottom: calc(1.5rem + env(safe-area-inset-bottom));
  }

  .classes-list-mobile-safe,
  .class-students-mobile-list {
    padding-bottom: calc(1rem + env(safe-area-inset-bottom));
  }

  .classes-list-mobile-safe > :last-child,
  .class-students-mobile-list > :last-child,
  .class-students-pagination-mobile-safe {
    margin-bottom: calc(1.25rem + env(safe-area-inset-bottom));
  }

  .form-label {
    font-size: 0.64rem;
  }

  .form-input {
    min-height: 2.65rem !important;
    font-size: 12px !important;
    line-height: 1.9 !important;
    padding-top: 0.58rem !important;
    padding-bottom: 0.58rem !important;
  }

  .search-input {
    padding-left: 2.05rem !important;
  }

  .search-icon {
    left: 0.7rem;
    font-size: 0.65rem;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Toasts stay above Header, Sidebar and all teleported forms/modals. */
:global(.Vue-Toastification__container) {
  z-index: 12050 !important;
  pointer-events: none;
}

:global(.Vue-Toastification__toast) {
  pointer-events: auto;
  font-family: "Noto Sans Khmer", "Khmer OS Battambang", "Battambang", "Khmer OS", system-ui, sans-serif !important;
  line-height: 1.45 !important;
  overflow-wrap: anywhere;
  word-break: break-word;
}

:global(.Vue-Toastification__toast-body) {
  font-family: inherit !important;
  line-height: 1.45 !important;
}

@media (max-width: 640px) {
  :global(.Vue-Toastification__container.top-right),
  :global(.Vue-Toastification__container.top-center) {
    top: calc(0.75rem + env(safe-area-inset-top)) !important;
    left: 0.75rem !important;
    right: 0.75rem !important;
    width: auto !important;
  }

  :global(.Vue-Toastification__toast) {
    margin-bottom: 0.5rem !important;
  }
}



/* Desktop class-student table: the first action is View, not Edit. */
.class-student-view-eye :deep(td:nth-last-child(2) button) {
  color: #2563eb;
}

.class-student-view-eye :deep(td:nth-last-child(2) .fa-pen-to-square::before) {
  content: "\f06e" !important;
}

/* Non-admin: keep View enabled and disable only the final Remove/Delete action in StudentCard. */
.non-admin-student-remove-disabled :deep(td:last-child button),
.non-admin-student-remove-disabled :deep(button[title*="ដក"]),
.non-admin-student-remove-disabled :deep(button[title*="លុប"]) {
  pointer-events: none !important;
  opacity: 0.4 !important;
  cursor: not-allowed !important;
}

</style>