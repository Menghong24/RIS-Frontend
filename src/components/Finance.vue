<template>
  <div class="payment-page-mobile-safe bg-slate-50 p-2 sm:p-3 md:p-4 text-slate-800">
    <div class="max-w-7xl mx-auto space-y-3 md:space-y-4">
      <!-- Header -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm px-2.5 sm:px-3 py-3 md:px-4">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-2.5 md:gap-3">
          <div class="min-w-0">
            <h1 class="text-base sm:text-lg md:text-xl font-extrabold text-slate-800 flex items-center gap-2">
              <span class="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs sm:text-sm shrink-0">
                <i class="fa-solid fa-money-bill-wave"></i>
              </span>

              <span class="truncate">
                ការគ្រប់គ្រងការបង់ប្រាក់
              </span>
            </h1>

            <p class="text-[11px] sm:text-xs text-slate-500 mt-1 truncate">
              <span v-if="currentView === 'classes'">
                សូមជ្រើសរើសថ្នាក់រៀនដើម្បីគ្រប់គ្រងការបង់ប្រាក់
              </span>

              <span v-else>
                គ្រប់គ្រងការបង់ប្រាក់សម្រាប់ថ្នាក់៖
                <strong class="text-blue-600">{{ selectedClass?.className }}</strong>
              </span>
            </p>
          </div>

          <button
            v-if="currentView === 'students'"
            @click="backToClasses"
            class="w-full md:w-auto bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5 sm:gap-2"
          >
            <i class="fa-solid fa-arrow-left text-[10px]"></i>
            ត្រឡប់ទៅថ្នាក់រៀនវិញ
          </button>
        </div>
      </div>

      <!-- Class Search -->
      <div
        v-if="currentView === 'classes'"
        class="bg-white p-2.5 sm:p-3 rounded-xl shadow-sm border border-slate-200"
      >
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
          <div class="relative w-full sm:w-80">
            <i class="search-icon fa-solid fa-magnifying-glass"></i>

            <input
              type="text"
              v-model="classSearchQuery"
              placeholder="ស្វែងរកថ្នាក់ / គ្រូ / កម្រិត..."
              class="form-input search-input"
            />
          </div>

          <div class="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 w-fit">
            <i class="fa-solid fa-layer-group text-[10px]"></i>
            សរុប {{ filteredClassesList.length }} ថ្នាក់
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div
        v-if="currentView === 'students'"
        class="bg-white p-2.5 sm:p-3 rounded-xl shadow-sm border border-slate-200"
      >
        <div class="grid grid-cols-2 lg:grid-cols-[160px_160px_160px_1fr_auto] gap-2 items-end">
          <!-- Month -->
          <div>
            <label class="form-label">ខែបង់ប្រាក់</label>

            <input
              type="month"
              v-model="filters.month"
              class="form-input"
            />
          </div>

          <!-- Status -->
          <div>
            <label class="form-label">ស្ថានភាព</label>

            <select v-model="filters.status" class="form-input">
              <option value="All">ស្ថានភាពទាំងអស់</option>
              <option value="paid">បានបង់ប្រាក់</option>
              <option value="partial">បង់ខ្លះ</option>
              <option value="unpaid">មិនទាន់បង់</option>
              <option value="late">យឺតយ៉ាវ</option>
            </select>
          </div>

          <!-- Default Due Amount -->
          <div>
            <label class="form-label">តម្លៃត្រូវបង់</label>

            <input
              v-model.number="filters.defaultDueAmount"
              type="number"
              min="0"
              class="form-input text-right font-bold"
              placeholder="0"
            />
          </div>

          <!-- Search -->
          <div class="col-span-2 lg:col-span-1">
            <label class="form-label">ស្វែងរក</label>

            <div class="relative">
              <i class="search-icon fa-solid fa-magnifying-glass"></i>

              <input
                type="text"
                v-model="filters.searchQuery"
                placeholder="ស្វែងរកឈ្មោះ / អត្តលេខ..."
                class="form-input search-input"
              />
            </div>
          </div>

          <!-- Total -->
          <div class="col-span-2 lg:col-span-1 bg-blue-50 border border-blue-100 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg flex flex-col justify-center shadow-sm min-h-[2.15rem] sm:min-h-[2.45rem]">
            <div class="text-[10px] text-blue-600 font-bold leading-none mb-1">
              លុយប្រមូលបានសរុប
            </div>

            <div class="text-sm sm:text-base font-extrabold text-blue-700 leading-none">
              ៛{{ formatMoney(totalCollectedThisMonth) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Class Cards -->
      <div
        v-if="currentView === 'classes'"
        class="payment-class-list-mobile-safe grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-3"
      >
        <div
          v-for="c in filteredClassesList"
          :key="c._id"
          @click="selectClass(c)"
          class="bg-white p-2.5 sm:p-3 rounded-xl shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer group relative overflow-hidden"
        >
          <div class="absolute top-0 left-0 w-full h-1 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

          <div class="flex items-start justify-between gap-2 mb-2">
            <div class="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition shrink-0">
              <i class="fa-solid fa-school text-xs sm:text-sm"></i>
            </div>

            <span class="px-1.5 sm:px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-600 rounded-full truncate max-w-[90px]">
              {{ c.classGrade || "N/A" }}
            </span>
          </div>

          <h3 class="text-xs sm:text-sm font-extrabold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors truncate">
            {{ c.className }}
          </h3>

          <div class="flex items-center gap-1.5 sm:gap-2 mb-2 text-[10px] sm:text-[11px] text-slate-600">
            <span class="text-slate-400">
              <i class="fa-solid fa-chalkboard-user"></i>
            </span>

            <span class="font-medium text-slate-700 truncate">
              {{ c.teacher?.khmerName || c.teacher?.englishName || c.teacherName || "មិនទាន់មាន" }}
            </span>
          </div>

          <div class="mt-2 flex justify-between items-center text-[10px] sm:text-[11px] text-slate-600 bg-slate-50 px-2 py-1.5 rounded-lg">
            <span>សិស្សសរុប:</span>
            <span class="font-bold text-blue-600">{{ getClassStudents(c).length }} នាក់</span>
          </div>
        </div>
      </div>

      <!-- Empty Classes -->
      <div
        v-if="currentView === 'classes' && !loadingClasses && filteredClassesList.length === 0"
        class="bg-white border border-dashed border-slate-300 rounded-xl p-7 sm:p-8 text-center text-slate-400"
      >
        <div class="text-xl sm:text-2xl mb-2">
          <i class="fa-solid fa-school-circle-xmark"></i>
        </div>

        <p class="text-xs sm:text-sm font-bold text-slate-500">
          មិនមានថ្នាក់រៀនដែលត្រូវនឹងការស្វែងរកទេ
        </p>
      </div>

      <!-- Students Payment -->
      <div
        v-if="currentView === 'students'"
        class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
      >
        <!-- Loading -->
        <div v-if="loadingPayments || loadingStudents" class="p-7 sm:p-8 text-center text-slate-400">
          <div class="mx-auto mb-2 h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <i class="fa-solid fa-circle-notch fa-spin text-lg sm:text-xl"></i>
          </div>

          <span class="text-xs sm:text-sm font-bold text-slate-500">
            កំពុងទាញយកទិន្នន័យ...
          </span>
        </div>

        <div v-else>
          <!-- Mobile Cards -->
          <div class="payment-mobile-list lg:hidden bg-slate-50 p-2.5 space-y-2">
            <div
              v-for="row in paginatedList"
              :key="row.uniqueKey"
              class="bg-white rounded-xl border border-slate-200 shadow-sm p-2.5"
            >
              <!-- Student -->
              <div class="flex items-start gap-2">
                <div class="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 font-extrabold border border-blue-100 shadow-sm shrink-0 overflow-hidden">
                  <span class="font-khmer text-sm">
                    {{ getStudentInitial(row.student) }}
                  </span>
                </div>

                <div class="min-w-0 flex-1">
                  <div class="flex items-start justify-between gap-2">
                    <div class="min-w-0">
                      <div class="text-sm font-extrabold text-slate-800 truncate">
                        {{ row.student?.khmerName || "-" }}
                      </div>

                      <div class="text-[10px] text-slate-500 truncate">
                        {{ row.student?.englishName || "-" }}
                      </div>
                    </div>

                    <span
                      :class="getStatusClass(getDisplayStatus(row))"
                      class="px-2 py-0.5 text-[10px] font-bold rounded-full inline-flex items-center justify-center gap-1 border whitespace-nowrap shrink-0"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {{ translateStatus(getDisplayStatus(row)) }}
                    </span>
                  </div>

                  <div class="mt-1 flex flex-wrap items-center gap-1 text-[10px] text-slate-500">
                    <span class="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-1.5 py-0.5 font-bold">
                      <i class="fa-solid fa-id-card text-slate-400"></i>
                      {{ row.student?.studentId || row.student?.idCode || "-" }}
                    </span>

                    <span class="inline-flex items-center gap-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100 px-1.5 py-0.5 font-bold">
                      <i class="fa-solid fa-phone text-purple-500"></i>
                      {{ row.student?.family?.motherNumber || "គ្មាន" }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Payment Info -->
              <div class="mt-2 grid grid-cols-2 gap-2">
                <div>
                  <label class="mobile-label">ថ្ងៃត្រូវបង់</label>

                  <input
                    type="date"
                    v-model="row.dueDate"
                    :disabled="true"
                    class="date-input mobile-input"
                  />

                  <div class="text-[10px] text-slate-400 mt-1 truncate">
                    ចូលរៀន: {{ formatDate(row.student?.joinDate) }}
                  </div>
                </div>

                <div>
                  <label class="mobile-label">តម្លៃត្រូវបង់</label>

                  <input
                    type="number"
                    v-model.number="row.inputExpectedAmount"
                    :disabled="!row.isVirtual"
                    class="money-input mobile-input"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label class="mobile-label">បានបង់</label>

                  <input
                    type="number"
                    v-model.number="row.inputPaidAmount"
                    :disabled="!row.isVirtual"
                    class="money-input mobile-input"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label class="mobile-label">នៅខ្វះ</label>

                  <div class="h-[1.95rem] rounded-lg bg-red-50 text-red-600 border border-red-100 flex items-center justify-end px-2 text-[11px] font-extrabold">
                    ៛{{ formatMoney(getBalanceAmount(row)) }}
                  </div>
                </div>
              </div>

              <!-- Add More / Remark -->
              <div class="mt-2 grid grid-cols-1 min-[420px]:grid-cols-2 gap-2">
                <div>
                  <label class="mobile-label">បង់បន្ថែម</label>

                  <template v-if="!row.isVirtual && getBalanceAmount(row) > 0">
                    <input
                      type="number"
                      v-model.number="row.additionalAmount"
                      min="0"
                      :max="getBalanceAmount(row)"
                      class="additional-input mobile-input"
                      placeholder="0"
                    />
                  </template>

                  <template v-else>
                    <div class="h-[1.95rem] rounded-lg bg-slate-50 text-slate-400 border border-slate-200 flex items-center justify-center text-[11px] font-bold">
                      -
                    </div>
                  </template>
                </div>

                <div>
                  <label class="mobile-label">ផ្សេងៗ</label>

                  <input
                    type="text"
                    v-model="row.remark"
                    :disabled="!row.isVirtual && getBalanceAmount(row) <= 0"
                    class="remark-input mobile-input"
                    placeholder="កំណត់សម្គាល់"
                  />
                </div>
              </div>

              <!-- Actions -->
              <div class="mt-2 flex items-center justify-end gap-2 border-t border-slate-100 pt-2">
                <button
                  v-if="row.isVirtual"
                  @click="handleOneClickPay(row)"
                  class="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-lg text-[11px] font-bold transition shadow-sm inline-flex items-center gap-1"
                >
                  <i class="fa-solid fa-circle-check text-[10px]"></i>
                  បង់ប្រាក់
                </button>

                <template v-else>
                  <button
                    v-if="getBalanceAmount(row) > 0"
                    @click="handleAddPayment(row)"
                    class="bg-orange-600 text-white hover:bg-orange-700 px-3 py-1.5 rounded-lg text-[11px] font-bold transition shadow-sm inline-flex items-center gap-1"
                  >
                    <i class="fa-solid fa-plus-circle text-[10px]"></i>
                    បង់បន្ថែម
                  </button>

                  <span
                    v-else
                    class="text-green-600 bg-green-50 text-[11px] font-bold px-2 py-1 rounded-lg"
                  >
                    រួចរាល់
                  </span>

                  <button
                    @click="handleDelete(row)"
                    class="text-red-500 hover:text-red-700 text-[11px] font-bold flex items-center gap-1"
                  >
                    <i class="fa-solid fa-trash"></i>
                    លុប
                  </button>
                </template>
              </div>
            </div>

            <div
              v-if="paginatedList.length === 0"
              class="px-4 py-10 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-300"
            >
              <div class="mx-auto mb-2 h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <i class="fa-solid fa-receipt text-xl"></i>
              </div>

              <p class="text-xs font-bold text-slate-500">
                មិនមានទិន្នន័យសិស្សឡើយ
              </p>
            </div>
          </div>

          <!-- Desktop Table -->
          <div class="hidden lg:block overflow-x-auto scroll-smooth">
            <table class="w-full text-left border-collapse text-xs min-w-[1260px]">
              <thead>
                <tr class="bg-slate-100 text-slate-700">
                  <th class="table-th min-w-[220px]">
                    ព័ត៌មានសិស្ស
                  </th>

                  <th class="table-th w-36">
                    ថ្ងៃត្រូវបង់
                  </th>

                  <th class="table-th w-32 text-center">
                    តម្លៃត្រូវបង់
                  </th>

                  <th class="table-th w-32 text-center">
                    បានបង់
                  </th>

                  <th class="table-th w-32 text-center">
                    នៅខ្វះ
                  </th>

                  <th class="table-th w-36 text-center">
                    បង់បន្ថែម
                  </th>

                  <th class="table-th w-52">
                    ផ្សេងៗ
                  </th>

                  <th class="table-th w-32 text-center">
                    ស្ថានភាព
                  </th>

                  <th class="table-th w-36 text-right">
                    សកម្មភាព
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="row in paginatedList"
                  :key="row.uniqueKey"
                  class="hover:bg-blue-50/40 transition border-b border-slate-100"
                >
                  <!-- Student -->
                  <td class="table-td">
                    <div class="flex items-center gap-2">
                      <div class="h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 font-extrabold border border-blue-100 shadow-sm shrink-0 overflow-hidden">
                        <span class=" text-sm">
                          {{ getStudentInitial(row.student) }}
                        </span>
                      </div>

                      <div class="min-w-0">
                        <div class="text-sm font-bold text-slate-800 truncate font-khmer">
                          {{ row.student?.khmerName || "-" }}
                        </div>

                        <div class="text-[11px] text-slate-500 truncate">
                          {{ row.student?.englishName || "-" }}
                        </div>

                        <div class="text-[10px] text-purple-600 font-medium mt-0.5 truncate">
                          <i class="fa-solid fa-phone mr-1"></i>
                          ម្តាយ: {{ row.student?.family?.motherNumber || "គ្មានទិន្នន័យ" }}
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- Due Date -->
                  <td class="table-td">
                    <input
                      type="date"
                      v-model="row.dueDate"
                      :disabled="true"
                      class="date-input"
                    />

                    <div class="text-[10px] text-slate-400 mt-1">
                      ចូលរៀន: {{ formatDate(row.student?.joinDate) }}
                    </div>
                  </td>

                  <!-- Expected Amount -->
                  <td class="table-td">
                    <input
                      type="number"
                      v-model.number="row.inputExpectedAmount"
                      :disabled="!row.isVirtual"
                      class="money-input"
                      placeholder="0"
                    />

                    <div class="text-[10px] text-slate-400 mt-1">
                      ត្រូវបង់
                    </div>
                  </td>

                  <!-- Paid Amount -->
                  <td class="table-td">
                    <input
                      type="number"
                      v-model.number="row.inputPaidAmount"
                      :disabled="!row.isVirtual"
                      class="money-input"
                      placeholder="0"
                    />

                    <div class="text-[10px] text-slate-400 mt-1">
                      បានបង់
                    </div>
                  </td>

                  <!-- Balance -->
                  <td class="table-td text-right font-extrabold text-red-600">
                    ៛{{ formatMoney(getBalanceAmount(row)) }}
                  </td>

                  <!-- Add More Payment -->
                  <td class="table-td">
                    <template v-if="!row.isVirtual && getBalanceAmount(row) > 0">
                      <input
                        type="number"
                        v-model.number="row.additionalAmount"
                        min="0"
                        :max="getBalanceAmount(row)"
                        class="additional-input"
                        placeholder="0"
                      />

                      <div class="text-[10px] text-orange-500 mt-1 font-bold">
                        ខ្វះ: ៛{{ formatMoney(getBalanceAmount(row)) }}
                      </div>
                    </template>

                    <template v-else>
                      <div class="text-[11px] text-slate-400 text-center">
                        -
                      </div>
                    </template>
                  </td>

                  <!-- Remark -->
                  <td class="table-td">
                    <input
                      type="text"
                      v-model="row.remark"
                      :disabled="!row.isVirtual && getBalanceAmount(row) <= 0"
                      class="remark-input"
                      placeholder="កំណត់សម្គាល់"
                    />
                  </td>

                  <!-- Status -->
                  <td class="table-td text-center">
                    <span
                      :class="getStatusClass(getDisplayStatus(row))"
                      class="px-2.5 py-1 text-[11px] font-bold rounded-full inline-flex items-center justify-center gap-1 border whitespace-nowrap"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {{ translateStatus(getDisplayStatus(row)) }}
                    </span>

                    <div
                      v-if="row.payDate"
                      class="text-[10px] text-slate-400 mt-1"
                    >
                      {{ formatDate(row.payDate) }}
                    </div>
                  </td>

                  <!-- Actions -->
                  <td class="table-td text-right">
                    <button
                      v-if="row.isVirtual"
                      @click="handleOneClickPay(row)"
                      class="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm inline-flex items-center gap-1"
                    >
                      <i class="fa-solid fa-circle-check"></i>
                      បង់ប្រាក់
                    </button>

                    <div v-else class="flex items-center justify-end gap-2">
                      <button
                        v-if="getBalanceAmount(row) > 0"
                        @click="handleAddPayment(row)"
                        class="bg-orange-600 text-white hover:bg-orange-700 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm inline-flex items-center gap-1"
                      >
                        <i class="fa-solid fa-plus-circle"></i>
                        បង់បន្ថែម
                      </button>

                      <span
                        v-else
                        class="text-green-600 bg-green-50 text-xs font-bold px-2 py-1 rounded-lg"
                      >
                        រួចរាល់
                      </span>

                      <button
                        @click="handleDelete(row)"
                        class="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1"
                      >
                        <i class="fa-solid fa-trash"></i>
                        លុប
                      </button>
                    </div>
                  </td>
                </tr>

                <tr v-if="paginatedList.length === 0">
                  <td colspan="9" class="px-4 py-10 text-center text-slate-400">
                    <div class="mx-auto mb-2 h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                      <i class="fa-solid fa-receipt text-xl"></i>
                    </div>

                    <p class="text-sm font-bold text-slate-500">
                      មិនមានទិន្នន័យសិស្សឡើយ
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="payment-pagination-mobile-safe bg-slate-50 px-2.5 sm:px-4 py-2.5 sm:py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
            <div class="flex items-center gap-2 text-[11px] sm:text-xs text-slate-600">
              <span>បង្ហាញ</span>

              <select
                v-model.number="perPage"
                @change="currentPage = 1"
                class="border border-slate-200 rounded-lg px-2 py-1.5 bg-white font-bold outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-[11px] sm:text-xs cursor-pointer"
              >
                <option :value="6">6</option>
                <option :value="10">10</option>
                <option :value="20">20</option>
              </select>

              <span class="hidden sm:inline">ជួរ ក្នុងចំណោមសិស្សសរុប {{ processedList.length }} នាក់</span>
              <span class="sm:hidden">/ {{ processedList.length }} នាក់</span>
            </div>

            <div class="flex items-center gap-1.5 sm:gap-2">
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="px-2.5 sm:px-3 py-1.5 border border-slate-200 rounded-lg text-[11px] sm:text-xs font-bold bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1"
              >
                <i class="fa-solid fa-chevron-left text-[10px]"></i>
                <span class="hidden min-[380px]:inline">មុន</span>
              </button>

              <span class="text-[11px] sm:text-xs text-slate-700 font-bold mx-1 whitespace-nowrap">
                {{ currentPage }} / {{ totalPages }}
              </span>

              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-2.5 sm:px-3 py-1.5 border border-slate-200 rounded-lg text-[11px] sm:text-xs font-bold bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1"
              >
                <span class="hidden min-[380px]:inline">បន្ទាប់</span>
                <i class="fa-solid fa-chevron-right text-[10px]"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        :is-open="showDeleteModal"
        item-name="ទិន្នន័យបង់ប្រាក់"
        title="លុបទិន្នន័យបង់ប្រាក់"
        message="តើអ្នកពិតជាចង់លុបទិន្នន័យបង់ប្រាក់នេះមែនទេ?"
        @close="closeDeleteModal"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useQuery } from "../hooks/useQuery";
import { useCollection } from "../hooks/useCollection";
import { useToast } from "vue-toastification";
import DeleteConfirmationModal from "../components/shared/DeleteConfirmationModal.vue";

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

const paymentsQuery = useQuery("payments");
const classesQuery = useQuery("classes");
const studentsQuery = useQuery("students");

const payments = paymentsQuery.data;
const classes = classesQuery.data;
const allStudents = studentsQuery.data;

const refreshPayments = paymentsQuery.fetchData || paymentsQuery.refetch;

const loadingPayments = computed(() => {
  return paymentsQuery.isLoading?.value || paymentsQuery.loading?.value || false;
});

const loadingClasses = computed(() => {
  return classesQuery.isLoading?.value || classesQuery.loading?.value || false;
});

const loadingStudents = computed(() => {
  return studentsQuery.isLoading?.value || studentsQuery.loading?.value || false;
});

const { createDoc, updateDoc, deleteDoc } = useCollection("payments");

const currentView = ref("classes");
const selectedClass = ref(null);
const classSearchQuery = ref("");

const filters = reactive({
  month: new Date().toISOString().slice(0, 7),
  searchQuery: "",
  status: "All",
  defaultDueAmount: 0
});

const showDeleteModal = ref(false);
const paymentToDelete = ref(null);

const currentPage = ref(1);
const perPage = ref(6);

const normalizeArray = (responseData) => {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.result)) return responseData.result;
  if (Array.isArray(responseData?.data)) return responseData.data;
  if (Array.isArray(responseData?.items)) return responseData.items;
  return [];
};

const paymentsList = computed(() => normalizeArray(payments?.value));
const classesList = computed(() => normalizeArray(classes?.value));
const allStudentsList = computed(() => normalizeArray(allStudents?.value));

const filteredClassesList = computed(() => {
  const keyword = classSearchQuery.value.trim().toLowerCase();

  if (!keyword) return classesList.value;

  return classesList.value.filter((cls) => {
    const className = String(cls.className || "").toLowerCase();
    const classGrade = String(cls.classGrade || "").toLowerCase();
    const classNumber = String(cls.classNumber || "").toLowerCase();
    const timeStudy = String(cls.timeStudy || "").toLowerCase();
    const teacherName = String(
      cls.teacher?.khmerName ||
        cls.teacher?.englishName ||
        cls.teacherName ||
        ""
    ).toLowerCase();

    return (
      className.includes(keyword) ||
      classGrade.includes(keyword) ||
      classNumber.includes(keyword) ||
      timeStudy.includes(keyword) ||
      teacherName.includes(keyword)
    );
  });
});

const pad2 = (value) => String(value).padStart(2, "0");

const toLocalDateInput = (year, month, day) => {
  return `${year}-${pad2(month)}-${pad2(day)}`;
};

const getId = (value) => {
  return String(value?._id || value || "");
};

const getStudentInitial = (student) => {
  const khmerName = String(student?.khmerName || "").trim();

  if (khmerName) {
    return khmerName.charAt(0);
  }

  const englishName = String(student?.englishName || "").trim();

  if (englishName) {
    return englishName.charAt(0).toUpperCase();
  }

  return "?";
};

const getStudentClassId = (student) => {
  return getId(
    student?.grade?._id ||
      student?.grade ||
      student?.class?._id ||
      student?.class ||
      student?.classId?._id ||
      student?.classId
  );
};

const getClassStudents = (cls) => {
  if (!cls) return [];

  const classStudents = Array.isArray(cls.students) ? cls.students : [];
  const populatedStudents = classStudents.filter((student) => {
    return typeof student === "object" && student?._id;
  });

  if (populatedStudents.length > 0) {
    return populatedStudents;
  }

  const classStudentIds = classStudents.map((student) => getId(student));

  return allStudentsList.value.filter((student) => {
    const inClassArray = classStudentIds.includes(getId(student));
    const inStudentClassField = getStudentClassId(student) === getId(cls);

    return inClassArray || inStudentClassField;
  });
};

watch(
  filters,
  () => {
    currentPage.value = 1;
  },
  {
    deep: true
  }
);

const selectClass = (cls) => {
  selectedClass.value = cls;
  currentView.value = "students";
  filters.searchQuery = "";
  filters.status = "All";
  currentPage.value = 1;
};

const backToClasses = () => {
  currentView.value = "classes";
  selectedClass.value = null;
  currentPage.value = 1;
};

const getClassDefaultDueAmount = (cls) => {
  return Number(
    cls?.dueAmount ||
      cls?.tuitionFee ||
      cls?.monthlyFee ||
      cls?.fee ||
      cls?.price ||
      filters.defaultDueAmount ||
      0
  );
};

const getDeadlineDate = (student) => {
  if (!filters.month) return "";

  const [yearText, monthText] = filters.month.split("-");
  const year = Number(yearText);
  const month = Number(monthText);

  const joinDate = student?.joinDate ? new Date(student.joinDate) : null;
  const joinDay =
    joinDate && !Number.isNaN(joinDate.getTime()) ? joinDate.getDate() : 1;

  const lastDayOfMonth = new Date(year, month, 0).getDate();
  const safeDay = Math.min(joinDay, lastDayOfMonth);

  return toLocalDateInput(year, month, safeDay);
};

const getPaymentMonth = (payment) => {
  return String(payment.paymentMonth || "").slice(0, 7);
};

const isSamePaymentRecord = ({ payment, studentId, classId, month }) => {
  return (
    getId(payment.student) === getId(studentId) &&
    getId(payment.class) === getId(classId) &&
    getPaymentMonth(payment) === String(month)
  );
};

const findExistingPayment = (studentId, classId, month) => {
  return paymentsList.value.find((payment) =>
    isSamePaymentRecord({
      payment,
      studentId,
      classId,
      month
    })
  );
};

const totalCollectedThisMonth = computed(() => {
  if (!selectedClass.value) return 0;

  const targetMonth = filters.month;
  const classId = selectedClass.value._id;

  return paymentsList.value
    .filter((payment) => {
      return (
        getId(payment.class) === getId(classId) &&
        getPaymentMonth(payment) === targetMonth &&
        ["paid", "partial"].includes(payment.status)
      );
    })
    .reduce((sum, payment) => {
      return sum + Number(payment.paidAmount || payment.amount || 0);
    }, 0);
});

const processedList = computed(() => {
  if (!selectedClass.value) return [];

  const targetMonth = filters.month;

  let classStudents = getClassStudents(selectedClass.value);

  if (filters.searchQuery.trim() !== "") {
    const query = filters.searchQuery.toLowerCase().trim();

    classStudents = classStudents.filter((student) => {
      return (
        student.khmerName?.toLowerCase().includes(query) ||
        student.englishName?.toLowerCase().includes(query) ||
        String(student.studentId || "").toLowerCase().includes(query) ||
        String(student.idCode || "").toLowerCase().includes(query)
      );
    });
  }

  const todayStr = new Date().toISOString().split("T")[0];
  const defaultDueAmount = getClassDefaultDueAmount(selectedClass.value);

  let mappedList = classStudents.map((student) => {
    const dueDate = getDeadlineDate(student);

    const existingPayment = findExistingPayment(
      student._id,
      selectedClass.value._id,
      targetMonth
    );

    if (existingPayment) {
      const expectedAmount = Number(
        existingPayment.expectedAmount ||
          Number(existingPayment.tuitionFee || 0) +
            Number(existingPayment.extraFee || 0) ||
          existingPayment.amount ||
          defaultDueAmount ||
          0
      );

      const paidAmount = Number(
        existingPayment.paidAmount || existingPayment.amount || 0
      );

      const balance = Number(
        existingPayment.balance !== undefined
          ? existingPayment.balance
          : Math.max(expectedAmount - paidAmount, 0)
      );

      const savedDueDate = existingPayment.dueDate
        ? new Date(existingPayment.dueDate)
        : null;

      const paymentDueDate =
        savedDueDate && !Number.isNaN(savedDueDate.getTime())
          ? toLocalDateInput(
              savedDueDate.getFullYear(),
              savedDueDate.getMonth() + 1,
              savedDueDate.getDate()
            )
          : dueDate;

      return {
        ...existingPayment,
        uniqueKey: existingPayment._id,
        isVirtual: false,
        student:
          existingPayment.student && typeof existingPayment.student === "object"
            ? existingPayment.student
            : student,
        dueDate: paymentDueDate,
        paymentDeadline: paymentDueDate,
        inputExpectedAmount: expectedAmount,
        inputPaidAmount: paidAmount,
        expectedAmount,
        paidAmount,
        balance,
        additionalAmount: balance > 0 ? balance : 0,
        remark: existingPayment.remark || ""
      };
    }

    const computedStatus = dueDate && todayStr > dueDate ? "late" : "unpaid";

    return {
      uniqueKey: `virtual_${student._id}`,
      student,
      status: computedStatus,
      isVirtual: true,
      dueDate,
      paymentDeadline: dueDate,
      inputExpectedAmount: defaultDueAmount,
      inputPaidAmount: defaultDueAmount,
      expectedAmount: defaultDueAmount,
      paidAmount: 0,
      balance: defaultDueAmount,
      additionalAmount: 0,
      remark: ""
    };
  });

  if (filters.status === "paid") {
    mappedList = mappedList.filter((row) => {
      return !row.isVirtual && getDisplayStatus(row) === "paid";
    });
  }

  if (filters.status === "partial") {
    mappedList = mappedList.filter((row) => {
      return !row.isVirtual && getDisplayStatus(row) === "partial";
    });
  }

  if (filters.status === "unpaid") {
    mappedList = mappedList.filter((row) => {
      return getDisplayStatus(row) === "unpaid";
    });
  }

  if (filters.status === "late") {
    mappedList = mappedList.filter((row) => {
      return getDisplayStatus(row) === "late";
    });
  }

  return mappedList;
});

const totalPages = computed(() => {
  return Math.ceil(processedList.value.length / perPage.value) || 1;
});

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;

  return processedList.value.slice(start, end);
});

watch(totalPages, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value;
  }
});

const getExpectedAmount = (row) => {
  if (row.isVirtual) {
    return Number(row.inputExpectedAmount || 0);
  }

  return Number(row.expectedAmount || row.amount || 0);
};

const getPaidAmount = (row) => {
  if (row.isVirtual) {
    return Number(row.inputPaidAmount || 0);
  }

  return Number(row.paidAmount || row.amount || 0);
};

const getBalanceAmount = (row) => {
  return Math.max(getExpectedAmount(row) - getPaidAmount(row), 0);
};

const getDisplayStatus = (row) => {
  const expectedAmount = getExpectedAmount(row);
  const paidAmount = getPaidAmount(row);
  const balance = getBalanceAmount(row);
  const todayStr = new Date().toISOString().split("T")[0];

  if (paidAmount <= 0) {
    return row.dueDate && todayStr > row.dueDate ? "late" : "unpaid";
  }

  if (balance > 0) {
    return "partial";
  }

  if (expectedAmount > 0 && paidAmount >= expectedAmount) {
    return "paid";
  }

  return "unpaid";
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value -= 1;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value += 1;
};

const refreshPaymentList = async () => {
  if (typeof refreshPayments === "function") {
    await refreshPayments();
  }
};

const handleOneClickPay = async (row) => {
  const expectedAmount = Number(row.inputExpectedAmount || 0);
  const paidAmount = Number(row.inputPaidAmount || 0);
  const balance = Math.max(expectedAmount - paidAmount, 0);

  const alreadyPaid = findExistingPayment(
    row.student?._id,
    selectedClass.value?._id,
    filters.month
  );

  if (alreadyPaid) {
    toast.warning("សិស្សនេះបានបង់ប្រាក់សម្រាប់ខែនេះរួចហើយ!");
    await refreshPaymentList();
    return;
  }

  if (expectedAmount <= 0) {
    toast.warning("សូមកំណត់តម្លៃដែលត្រូវបង់ជាមុនសិន!");
    return;
  }

  if (paidAmount <= 0) {
    toast.warning("សូមបញ្ចូលចំនួនទឹកប្រាក់ដែលបានបង់!");
    return;
  }

  if (paidAmount > expectedAmount) {
    toast.warning("ចំនួនបានបង់ មិនអាចធំជាងតម្លៃត្រូវបង់បានទេ!");
    return;
  }

  if (!row.dueDate) {
    toast.warning("សូមកំណត់ថ្ងៃត្រូវបង់!");
    return;
  }

  const today = new Date().toISOString().split("T")[0];

  const payload = {
    student: row.student._id,
    class: selectedClass.value._id,
    teacher: selectedClass.value.teacher?._id || selectedClass.value.teacher || null,
    paymentMonth: filters.month,
    dueDate: row.dueDate,
    payDate: today,
    tuitionFee: expectedAmount,
    extraFee: 0,
    expectedAmount,
    paidAmount,
    amount: paidAmount,
    balance,
    status: balance > 0 ? "partial" : "paid",
    remark: row.remark || ""
  };

  try {
    await createDoc(payload);
    toast.success(`បានបង់ប្រាក់សម្រាប់សិស្ស ${row.student.khmerName} រួចរាល់!`);

    await refreshPaymentList();
  } catch (err) {
    console.error(err);
    toast.error(
      err.response?.data?.err ||
        err.response?.data?.message ||
        "ការបង់ប្រាក់បានបរាជ័យ"
    );
  }
};

const handleAddPayment = async (row) => {
  const expectedAmount = Number(row.expectedAmount || row.inputExpectedAmount || 0);
  const oldPaidAmount = Number(row.paidAmount || row.amount || 0);
  const oldBalance = Math.max(expectedAmount - oldPaidAmount, 0);
  const addAmount = Number(row.additionalAmount || 0);

  if (!row._id) {
    toast.warning("រកមិនឃើញលេខសម្គាល់ការបង់ប្រាក់!");
    return;
  }

  if (oldBalance <= 0) {
    toast.info("សិស្សនេះបានបង់គ្រប់ហើយ!");
    return;
  }

  if (addAmount <= 0) {
    toast.warning("សូមបញ្ចូលចំនួនទឹកប្រាក់បន្ថែម!");
    return;
  }

  if (addAmount > oldBalance) {
    toast.warning("ចំនួនបង់បន្ថែម មិនអាចលើសចំនួននៅខ្វះបានទេ!");
    return;
  }

  const newPaidAmount = oldPaidAmount + addAmount;
  const newBalance = Math.max(expectedAmount - newPaidAmount, 0);
  const today = new Date().toISOString().split("T")[0];

  const payload = {
    dueDate: row.dueDate,
    payDate: today,
    tuitionFee: expectedAmount,
    extraFee: 0,
    expectedAmount,
    paidAmount: newPaidAmount,
    amount: newPaidAmount,
    balance: newBalance,
    status: newBalance > 0 ? "partial" : "paid",
    remark: row.remark || ""
  };

  try {
    await updateDoc(row._id, payload);

    toast.success(
      newBalance > 0
        ? `បានបង់បន្ថែម ៛${formatMoney(addAmount)} នៅខ្វះ ៛${formatMoney(newBalance)}`
        : "បានបង់បន្ថែម និងបង់គ្រប់រួចរាល់!"
    );

    await refreshPaymentList();
  } catch (err) {
    console.error(err);
    toast.error(
      err.response?.data?.err ||
        err.response?.data?.message ||
        "មិនអាចបង់បន្ថែមបានទេ"
    );
  }
};

const handleDelete = (payment) => {
  paymentToDelete.value = payment;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  paymentToDelete.value = null;
};

const confirmDelete = async () => {
  if (!paymentToDelete.value?._id) return;

  try {
    await deleteDoc(paymentToDelete.value._id);
    toast.success("បានលុបទិន្នន័យបង់ប្រាក់");

    await refreshPaymentList();
  } catch (err) {
    console.error(err);
    toast.error(
      err.response?.data?.err ||
        err.response?.data?.message ||
        "មិនអាចលុបទិន្នន័យបង់ប្រាក់បានទេ"
    );
  } finally {
    closeDeleteModal();
  }
};

const translateStatus = (status) => {
  if (status === "paid") return "បានបង់ប្រាក់";
  if (status === "partial") return "បង់ខ្លះ";
  if (status === "late") return "យឺតយ៉ាវ";
  return "មិនទាន់បង់";
};

const getStatusClass = (status) => {
  if (status === "paid") return "bg-green-50 text-green-700 border-green-200";
  if (status === "partial") return "bg-orange-50 text-orange-700 border-orange-200";
  if (status === "late") return "bg-red-50 text-red-700 border-red-200";
  return "bg-slate-100 text-slate-600 border-slate-200";
};

const formatMoney = (value) => {
  return Number(value || 0).toLocaleString("km-KH");
};

const formatDate = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "-";

  return parsedDate.toLocaleDateString("km-KH", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};

onMounted(() => {
  setNoZoomViewport();
});

onBeforeUnmount(() => {
  restoreViewport();
});

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
}

.table-th {
  padding: 0.5rem 0.6rem;
  font-size: 0.7rem;
  font-weight: 900;
  color: #475569;
  border: 1px solid #e2e8f0;
  white-space: nowrap;
}

.table-td {
  padding: 0.5rem 0.6rem;
  border: 1px solid #f1f5f9;
  font-size: 0.72rem;
}

.money-input,
.remark-input,
.date-input {
  width: 100%;
  padding: 0.36rem 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.7rem;
  outline: none;
  transition: all 0.2s ease;
  background: #ffffff;
}

.mobile-input {
  min-height: 1.95rem;
}

.mobile-label {
  display: block;
  font-size: 0.6rem;
  font-weight: 800;
  color: #64748b;
  margin-bottom: 0.15rem;
}

.money-input {
  text-align: right;
  font-weight: 800;
}

.money-input:focus,
.remark-input:focus,
.date-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
}

.money-input:disabled,
.remark-input:disabled,
.date-input:disabled {
  background: #f1f5f9;
  color: #64748b;
}

.additional-input {
  width: 100%;
  padding: 0.36rem 0.5rem;
  border: 1px solid #fed7aa;
  border-radius: 0.5rem;
  font-size: 0.7rem;
  outline: none;
  background: #fff7ed;
  color: #9a3412;
  font-weight: 800;
  text-align: right;
  transition: all 0.2s ease;
}

.additional-input:focus {
  border-color: #f97316;
  box-shadow: 0 0 0 3px rgb(249 115 22 / 0.12);
}

.font-khmer {
  font-family: "Battambang", "Siemreap", "Kantumruy Pro", sans-serif;
}


/* Chrome mobile bottom toolbar fix + no visual input-size changes */
@media (max-width: 640px) {
  .payment-page-mobile-safe {
    padding-bottom: calc(2.75rem + env(safe-area-inset-bottom));
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }

  .payment-page-mobile-safe > .max-w-7xl {
    padding-bottom: calc(1.5rem + env(safe-area-inset-bottom));
  }

  .payment-class-list-mobile-safe,
  .payment-mobile-list {
    padding-bottom: calc(1rem + env(safe-area-inset-bottom));
  }

  .payment-class-list-mobile-safe > :last-child,
  .payment-mobile-list > :last-child,
  .payment-pagination-mobile-safe {
    margin-bottom: calc(1.25rem + env(safe-area-inset-bottom));
  }

  .payment-pagination-mobile-safe {
    padding-bottom: calc(0.75rem + env(safe-area-inset-bottom)) !important;
  }
}

@media (min-width: 640px) {
  .form-label {
    font-size: 0.68rem;
  }

  .form-input {
    padding: 0.44rem 0.6rem;
    font-size: 0.75rem;
    min-height: 2.45rem;
  }

  .money-input,
  .remark-input,
  .date-input,
  .additional-input {
    padding: 0.38rem 0.5rem;
    font-size: 0.72rem;
  }
}
</style>