<template>
  <div class="bg-slate-50 p-2 sm:p-3 md:p-4 text-slate-800">
    <div class="max-w-7xl mx-auto space-y-3 md:space-y-4">
      <!-- Header -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm px-2.5 sm:px-3 py-3 md:px-4">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 md:gap-3">
          <div class="min-w-0">
            <h1 class="text-base sm:text-lg md:text-xl font-extrabold text-slate-800 flex items-center gap-2">
              <span class="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs sm:text-sm shrink-0">
                <i class="fa-solid fa-file-invoice-dollar"></i>
              </span>

              <span class="truncate">
                របាយការណ៍បង់ប្រាក់សិស្ស
              </span>
            </h1>

            <p class="text-[11px] sm:text-xs text-slate-500 mt-1 truncate">
              ត្រួតពិនិត្យការបង់ប្រាក់តាមថ្នាក់ ខែ ស្ថានភាព និងសិស្ស
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              @click="exportPDF"
              :disabled="!canExport || exportingPdf"
              class="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-[11px] sm:text-xs font-bold shadow-sm transition"
            >
              <i
                class="fa-solid text-[10px]"
                :class="exportingPdf ? 'fa-circle-notch fa-spin' : 'fa-file-pdf'"
              ></i>
              PDF
            </button>

            <button
              @click="exportExcel"
              :disabled="!canExport || exportingExcel"
              class="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-[11px] sm:text-xs font-bold shadow-sm transition"
            >
              <i
                class="fa-solid text-[10px]"
                :class="exportingExcel ? 'fa-circle-notch fa-spin' : 'fa-file-excel'"
              ></i>
              Excel
            </button>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-2.5 sm:p-3">
        <div class="grid grid-cols-2 lg:grid-cols-[1.3fr_150px_150px_150px_1fr_auto] gap-2 items-end">
          <div class="col-span-2 lg:col-span-1">
            <label class="form-label">ថ្នាក់រៀន</label>

            <select
              v-model="filters.classId"
              class="form-input"
            >
              <option value="">ថ្នាក់ទាំងអស់</option>

              <option
                v-for="cls in classesList"
                :key="cls._id"
                :value="cls._id"
              >
                {{ cls.className }} {{ cls.timeStudy ? `(${cls.timeStudy})` : "" }}
              </option>
            </select>
          </div>

          <div>
            <label class="form-label">ខែបង់ប្រាក់</label>

            <input
              v-model="filters.month"
              type="month"
              class="form-input"
            />
          </div>

          <div>
            <label class="form-label">ស្ថានភាព</label>

            <select
              v-model="filters.status"
              class="form-input"
            >
              <option value="All">ទាំងអស់</option>
              <option value="paid">បានបង់</option>
              <option value="partial">បង់ខ្លះ</option>
              <option value="unpaid">មិនទាន់បង់</option>
              <option value="late">យឺតយ៉ាវ</option>
            </select>
          </div>

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

          <div class="col-span-2 lg:col-span-1">
            <label class="form-label">ស្វែងរក</label>

            <div class="relative">
              <i class="search-icon fa-solid fa-magnifying-glass"></i>

              <input
                v-model="filters.search"
                type="text"
                placeholder="ឈ្មោះ / អត្តលេខ / ថ្នាក់..."
                class="form-input search-input"
              />
            </div>
          </div>

          <button
            @click="resetFilters"
            class="col-span-2 lg:col-span-1 w-full lg:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-[11px] sm:text-xs font-bold shadow-sm transition"
          >
            <i class="fa-solid fa-rotate-left text-[10px]"></i>
            សម្អាត
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div
        v-if="isPageLoading"
        class="bg-white rounded-xl border border-slate-200 shadow-sm p-7 sm:p-8 text-center text-slate-400"
      >
        <div class="mx-auto mb-2 h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <i class="fa-solid fa-circle-notch fa-spin text-lg sm:text-xl"></i>
        </div>

        <p class="text-xs sm:text-sm font-bold text-slate-500">
          កំពុងទាញយកទិន្នន័យ...
        </p>
      </div>

      <!-- Report -->
      <div v-else>
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <!-- Screen Report Header -->
          <div class="px-2.5 sm:px-3 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div class="min-w-0">
              <h2 class="text-sm font-extrabold text-slate-800 truncate">
                {{ selectedClassName }}
              </h2>

              <p class="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">
                ខែ {{ selectedMonthLabel }} · {{ selectedStatusLabel }} · សិស្ស {{ reportRows.length }} នាក់
              </p>
            </div>

            <span class="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-1 w-fit">
              <i class="fa-solid fa-chart-pie text-[10px]"></i>
              Paid Rate {{ summary.paidRate }}%
            </span>
          </div>

          <!-- Summary Cards -->
          <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 p-2.5 sm:p-3 border-b border-slate-200 bg-white">
            <div class="summary-card">
              <p class="summary-label">សិស្សសរុប</p>
              <p class="summary-value text-slate-800">{{ summary.totalStudents }}</p>
            </div>

            <div class="summary-card bg-green-50 border-green-100">
              <p class="summary-label text-green-600">បានបង់</p>
              <p class="summary-value text-green-700">{{ summary.paidCount }}</p>
            </div>

            <div class="summary-card bg-orange-50 border-orange-100">
              <p class="summary-label text-orange-600">បង់ខ្លះ</p>
              <p class="summary-value text-orange-700">{{ summary.partialCount }}</p>
            </div>

            <div class="summary-card bg-slate-50 border-slate-200">
              <p class="summary-label text-slate-600">មិនទាន់បង់</p>
              <p class="summary-value text-slate-700">{{ summary.unpaidCount }}</p>
            </div>

            <div class="summary-card bg-red-50 border-red-100">
              <p class="summary-label text-red-600">យឺតយ៉ាវ</p>
              <p class="summary-value text-red-700">{{ summary.lateCount }}</p>
            </div>

            <div class="summary-card bg-blue-50 border-blue-100">
              <p class="summary-label text-blue-600">បានប្រមូល</p>
              <p class="summary-value text-blue-700">៛{{ formatMoney(summary.collectedAmount) }}</p>
            </div>

            <div class="summary-card bg-amber-50 border-amber-100">
              <p class="summary-label text-amber-600">នៅខ្វះ</p>
              <p class="summary-value text-amber-700">៛{{ formatMoney(summary.balanceAmount) }}</p>
            </div>
          </div>

          <!-- Mobile Cards -->
          <div class="lg:hidden bg-slate-50 p-2.5 space-y-2">
            <div
              v-for="(row, index) in paginatedRows"
              :key="row.uniqueKey"
              class="bg-white rounded-xl border border-slate-200 shadow-sm p-2.5"
            >
              <div class="flex items-start gap-2">
                <div class="h-10 w-10 rounded-full bg-blue-50 text-blue-700 border border-blue-100 shadow-sm flex items-center justify-center font-extrabold shrink-0 overflow-hidden font-khmer">
                  {{ getStudentInitial(row.student) }}
                </div>

                <div class="min-w-0 flex-1">
                  <div class="flex items-start justify-between gap-2">
                    <div class="min-w-0">
                      <p class="text-sm font-extrabold text-slate-800 leading-tight truncate ">
                        {{ row.student?.khmerName || "-" }}
                      </p>

                      <p class="text-[10px] text-slate-500 leading-tight truncate mt-0.5">
                        {{ row.student?.englishName || "-" }}
                      </p>
                    </div>

                    <span
                      :class="getStatusClass(row.status)"
                      class="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-extrabold whitespace-nowrap shrink-0"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {{ translateStatus(row.status) }}
                    </span>
                  </div>

                  <div class="mt-1 flex flex-wrap items-center gap-1 text-[10px] text-slate-500">
                    <span class="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-1.5 py-0.5 font-bold">
                      <i class="fa-solid fa-id-card text-slate-400"></i>
                      {{ row.student?.studentId || row.student?.idCode || "-" }}
                    </span>

                    <span class="inline-flex items-center gap-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100 px-1.5 py-0.5 font-bold">
                      <i class="fa-solid fa-venus-mars text-purple-500"></i>
                      {{ getStudentGender(row.student) }}
                    </span>

                    <span class="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 px-1.5 py-0.5 font-bold">
                      <i class="fa-solid fa-school text-blue-500"></i>
                      {{ row.className }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="mt-2 grid grid-cols-3 gap-1.5">
                <div class="mobile-money-box bg-blue-50 border-blue-100">
                  <p class="mobile-money-label text-blue-600">ត្រូវបង់</p>
                  <p class="mobile-money-value text-blue-700">៛{{ formatMoney(row.expectedAmount) }}</p>
                </div>

                <div class="mobile-money-box bg-green-50 border-green-100">
                  <p class="mobile-money-label text-green-600">បានបង់</p>
                  <p class="mobile-money-value text-green-700">៛{{ formatMoney(row.paidAmount) }}</p>
                </div>

                <div class="mobile-money-box bg-red-50 border-red-100">
                  <p class="mobile-money-label text-red-600">នៅខ្វះ</p>
                  <p class="mobile-money-value text-red-700">៛{{ formatMoney(row.balanceAmount) }}</p>
                </div>
              </div>

              <div class="mt-2 grid grid-cols-2 gap-2 text-[10px]">
                <div class="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
                  <p class="font-bold text-slate-400">ថ្ងៃត្រូវបង់</p>
                  <p class="font-extrabold text-slate-700 mt-0.5">
                    {{ formatDate(row.dueDate || row.paymentDeadline) }}
                  </p>
                </div>

                <div class="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
                  <p class="font-bold text-slate-400">ថ្ងៃបង់ប្រាក់</p>
                  <p class="font-extrabold text-slate-700 mt-0.5">
                    {{ formatDate(row.payDate) }}
                  </p>
                </div>
              </div>

              <div class="mt-2 grid grid-cols-1 min-[420px]:grid-cols-2 gap-2 text-[10px]">
                <div class="rounded-lg border border-pink-100 bg-pink-50 px-2 py-1.5">
                  <p class="font-bold text-pink-600">លេខទូរស័ព្ទម្ដាយ</p>
                  <p class="font-extrabold text-slate-700 mt-0.5">
                    {{ getStudentMotherPhone(row.student) }}
                  </p>
                </div>

                <div class="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
                  <p class="font-bold text-slate-400">ផ្សេងៗ</p>
                  <p class="font-bold text-slate-700 mt-0.5">
                    {{ row.remark || "-" }}
                  </p>
                </div>
              </div>
            </div>

            <div
              v-if="reportRows.length === 0"
              class="px-4 py-10 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-300"
            >
              <div class="mx-auto mb-2 h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <i class="fa-solid fa-receipt text-xl"></i>
              </div>

              <p class="text-xs font-bold text-slate-500">
                មិនមានទិន្នន័យសម្រាប់បង្ហាញ
              </p>
            </div>
          </div>

          <!-- Desktop Table -->
          <div class="hidden lg:block report-table-wrap overflow-x-auto">
            <table class="report-table w-full text-left border-collapse text-xs min-w-[1240px]">
              <thead>
                <tr class="bg-slate-100 text-slate-700">
                  <th class="table-th text-center w-10">ល.រ</th>
                  <th class="table-th min-w-[220px]">ព័ត៌មានសិស្ស</th>
                  <th class="table-th text-center w-20">ភេទ</th>
                  <th class="table-th min-w-[135px]">លេខទូរស័ព្ទម្ដាយ</th>
                  <th class="table-th min-w-[120px]">ថ្នាក់</th>
                  <th class="table-th text-center w-28">ថ្ងៃត្រូវបង់</th>
                  <th class="table-th text-right w-28">ត្រូវបង់សរុប</th>
                  <th class="table-th text-right w-28">បានបង់</th>
                  <th class="table-th text-right w-28">នៅខ្វះ</th>
                  <th class="table-th text-center w-28">ស្ថានភាព</th>
                  <th class="table-th min-w-[140px]">ផ្សេងៗ</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(row, index) in paginatedRows"
                  :key="row.uniqueKey"
                  class="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td class="table-td text-center text-slate-500">
                    {{ rowNumber(index) }}
                  </td>

                  <td class="table-td">
                    <div class="flex items-center gap-2">
                      <div class="h-8 w-8 rounded-full bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center font-extrabold shrink-0 font-khmer">
                        {{ getStudentInitial(row.student) }}
                      </div>

                      <div class="min-w-0">
                        <div class="font-extrabold text-slate-800 leading-tight truncate">
                          {{ row.student?.khmerName || "-" }}
                        </div>

                        <div class="text-[10px] text-slate-500 leading-tight truncate">
                          {{ row.student?.englishName || "-" }}
                        </div>

                        <div class="text-[10px] text-slate-400 leading-tight truncate">
                          ID: {{ row.student?.studentId || row.student?.idCode || "-" }}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td class="table-td text-center font-bold text-purple-700">
                    {{ getStudentGender(row.student) }}
                  </td>

                  <td class="table-td font-bold text-slate-700">
                    {{ getStudentMotherPhone(row.student) }}
                  </td>

                  <td class="table-td">
                    {{ row.className }}
                  </td>

                  <td class="table-td text-center">
                    {{ formatDate(row.dueDate || row.paymentDeadline) }}
                  </td>

                  <td class="table-td text-right font-extrabold text-blue-700">
                    ៛{{ formatMoney(row.expectedAmount) }}
                  </td>

                  <td class="table-td text-right font-extrabold text-green-700">
                    ៛{{ formatMoney(row.paidAmount) }}
                  </td>

                  <td class="table-td text-right font-extrabold text-red-600">
                    ៛{{ formatMoney(row.balanceAmount) }}
                  </td>

                  <td class="table-td text-center">
                    <span
                      :class="getStatusClass(row.status)"
                      class="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-extrabold whitespace-nowrap"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {{ translateStatus(row.status) }}
                    </span>

                    <div
                      v-if="row.payDate"
                      class="text-[10px] text-slate-400 mt-0.5"
                    >
                      {{ formatDate(row.payDate) }}
                    </div>
                  </td>

                  <td class="table-td text-slate-500">
                    {{ row.remark || "-" }}
                  </td>
                </tr>

                <tr v-if="reportRows.length === 0">
                  <td
                    colspan="11"
                    class="px-4 py-10 text-center text-slate-400"
                  >
                    <div class="mx-auto mb-2 h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                      <i class="fa-solid fa-receipt text-xl"></i>
                    </div>

                    <p class="text-sm font-bold text-slate-500">
                      មិនមានទិន្នន័យសម្រាប់បង្ហាញ
                    </p>
                  </td>
                </tr>
              </tbody>

              <tfoot v-if="reportRows.length > 0">
                <tr class="bg-slate-100 font-extrabold">
                  <td
                    colspan="6"
                    class="table-td text-right"
                  >
                    សរុប
                  </td>

                  <td class="table-td text-right text-blue-700">
                    ៛{{ formatMoney(summary.expectedAmount) }}
                  </td>

                  <td class="table-td text-right text-green-700">
                    ៛{{ formatMoney(summary.collectedAmount) }}
                  </td>

                  <td class="table-td text-right text-red-600">
                    ៛{{ formatMoney(summary.balanceAmount) }}
                  </td>

                  <td
                    colspan="2"
                    class="table-td"
                  >
                    Paid Rate: {{ summary.paidRate }}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Pagination -->
          <div
            v-if="reportRows.length > 0"
            class="bg-slate-50 px-2.5 sm:px-4 py-2.5 sm:py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3"
          >
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

              <span class="hidden sm:inline">ជួរ ក្នុងចំណោមសិស្សសរុប {{ reportRows.length }} នាក់</span>
              <span class="sm:hidden">/ {{ reportRows.length }} នាក់</span>
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

      <!-- Hidden A4 Portrait PDF Summary -->
      <div class="pdf-paper-wrap">
        <div
          ref="pdfPaperRef"
          class="pdf-document"
        >
          <div
            v-for="(page, pageIndex) in pdfPages"
            :key="`pdf-page-${pageIndex}`"
            class="pdf-paper pdf-page"
          >
            <div class="pdf-header">
              <div class="pdf-logo-wrap">
                <img
                  :src="schoolLogoUrl"
                  alt="RIS Logo"
                  class="pdf-logo"
                />
              </div>

              <div class="pdf-title">
                <h2>ព្រះរាជាណាចក្រកម្ពុជា</h2>
                <h3>ជាតិ សាសនា ព្រះមហាក្សត្រ</h3>
                <h1>របាយការណ៍សង្ខេបការបង់ប្រាក់សិស្ស</h1>

                <p>
                  ខែ {{ selectedMonthLabel }} | ថ្នាក់៖ {{ selectedClassName }}
                </p>

                <p>
                  ស្ថានភាព៖ {{ selectedStatusLabel }} | កាលបរិច្ឆេទ៖ {{ todayLabel }}
                </p>

                <p v-if="pdfPages.length > 1">
                  ទំព័រ៖ {{ pageIndex + 1 }} / {{ pdfPages.length }}
                </p>
              </div>

              <div></div>
            </div>

            

            <table class="pdf-table">
              <thead>
                <tr>
                  <th class="pdf-no-col">ល.រ</th>
                  <th class="pdf-name-col">ឈ្មោះសិស្ស</th>
                  <th class="pdf-gender-col">ភេទ</th>
                  <th class="pdf-phone-col">លេខទូរស័ព្ទម្ដាយ</th>
                  <th class="pdf-class-col">ថ្នាក់</th>
                  <th class="pdf-status-col">ស្ថានភាព</th>
                  <th class="pdf-money-col">ចំនួនត្រូវបង់</th>
                  <th class="pdf-money-col">ចំនួនបានបង់</th>
                  <th class="pdf-money-col">នៅខ្វះ</th>
                  <th class="pdf-remark-col">ផ្សេងៗ</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(row, index) in page.rows"
                  :key="row.uniqueKey"
                >
                  <td>{{ page.startIndex + index + 1 }}</td>

                  <td class="pdf-name-col">
                    {{ row.student?.khmerName || "-" }}
                  </td>

                  <td class="pdf-gender-col">
                    {{ getStudentGender(row.student) }}
                  </td>

                  <td class="pdf-phone-col">
                    {{ getStudentMotherPhone(row.student) }}
                  </td>

                  <td>
                    {{ row.className || "-" }}
                  </td>

                  <td
                    class="pdf-status-cell"
                    :class="getPdfStatusClass(row.status)"
                  >
                    {{ translateStatus(row.status) }}
                  </td>

                  <td class="pdf-money-due">
                    ៛{{ formatMoney(row.expectedAmount) }}
                  </td>

                  <td class="pdf-money-paid">
                    ៛{{ formatMoney(row.paidAmount) }}
                  </td>

                  <td class="pdf-money-balance">
                    ៛{{ formatMoney(row.balanceAmount) }}
                  </td>

                  <td class="pdf-remark-col">
                    {{ row.remark || "-" }}
                  </td>
                </tr>
              </tbody>

              <tfoot v-if="isLastPdfPage(pageIndex)">
                <tr>
                  <td
                    colspan="6"
                    class="pdf-total-label"
                  >
                    សរុប
                  </td>

                  <td>
                    ៛{{ formatMoney(summary.expectedAmount) }}
                  </td>

                  <td>
                    ៛{{ formatMoney(summary.collectedAmount) }}
                  </td>

                  <td>
                    ៛{{ formatMoney(summary.balanceAmount) }}
                  </td>

                  <td>-</td>
                </tr>
              </tfoot>
            </table>

            <div
              v-if="isLastPdfPage(pageIndex)"
              class="pdf-signature"
            >
              <div>
                <p class="bold">បានឃើញ និងឯកភាព</p>
                <p class="bold">នាយកសាលា</p>
                <div class="signature-space"></div>
                <p>.......................................</p>
              </div>

              <div>
                <p>ថ្ងៃទី........ខែ........ឆ្នាំ........</p>
                <p class="bold">អ្នកទទួលប្រាក់</p>
                <div class="signature-space"></div>
                <p>.......................................</p>
              </div>
            </div>

            <div
              v-else
              class="pdf-continued"
            >
              បន្តទំព័របន្ទាប់...
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick } from "vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ExcelJS from "exceljs";
import { useQuery } from "../hooks/useQuery";
import schoolLogoUrl from "../assets/logoRIS.jpg";

const paymentsQuery = useQuery("payments");
const classesQuery = useQuery("classes");
const studentsQuery = useQuery("students");

const payments = paymentsQuery.data;
const classes = classesQuery.data;
const students = studentsQuery.data;

const excelFontName = "Khmer OS Battambang";

const loadingPayments = computed(() => {
  return paymentsQuery.isLoading?.value || paymentsQuery.loading?.value || false;
});

const loadingClasses = computed(() => {
  return classesQuery.isLoading?.value || classesQuery.loading?.value || false;
});

const loadingStudents = computed(() => {
  return studentsQuery.isLoading?.value || studentsQuery.loading?.value || false;
});

const getCurrentMonth = () => new Date().toISOString().slice(0, 7);

const filters = reactive({
  classId: "",
  month: getCurrentMonth(),
  status: "All",
  search: "",
  defaultDueAmount: 0
});

const currentPage = ref(1);
const perPage = ref(6);
const exportingPdf = ref(false);
const exportingExcel = ref(false);
const pdfPaperRef = ref(null);

const normalizeArray = (responseData) => {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.result)) return responseData.result;
  if (Array.isArray(responseData?.data)) return responseData.data;
  if (Array.isArray(responseData?.items)) return responseData.items;

  return [];
};

const getId = (value) => {
  return String(value?._id || value || "").trim();
};

const paymentsList = computed(() => normalizeArray(payments?.value));
const classesList = computed(() => normalizeArray(classes?.value));
const studentsList = computed(() => normalizeArray(students?.value));

const isPageLoading = computed(() => {
  return loadingPayments.value || loadingClasses.value || loadingStudents.value;
});

const selectedClass = computed(() => {
  if (!filters.classId) return null;

  return classesList.value.find((cls) => {
    return String(cls._id) === String(filters.classId);
  }) || null;
});

const selectedClassName = computed(() => {
  return selectedClass.value?.className || "ថ្នាក់ទាំងអស់";
});

const selectedStatusLabel = computed(() => {
  if (filters.status === "paid") return "បានបង់";
  if (filters.status === "partial") return "បង់ខ្លះ";
  if (filters.status === "unpaid") return "មិនទាន់បង់";
  if (filters.status === "late") return "យឺតយ៉ាវ";

  return "ស្ថានភាពទាំងអស់";
});

const selectedMonthLabel = computed(() => {
  if (!filters.month) return "-";

  const [year, month] = filters.month.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);

  return date.toLocaleDateString("km-KH", {
    month: "long",
    year: "numeric"
  });
});

const todayLabel = computed(() => {
  return new Date().toLocaleDateString("km-KH", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
});

const canExport = computed(() => {
  return reportRows.value.length > 0;
});

const pdfRowsPerPage = 40;

const pdfPages = computed(() => {
  const rows = reportRows.value;

  if (!rows.length) return [];

  if (rows.length <= pdfRowsPerPage) {
    return [
      {
        startIndex: 0,
        rows
      }
    ];
  }

  const pages = [];

  for (let start = 0; start < rows.length; start += pdfRowsPerPage) {
    pages.push({
      startIndex: start,
      rows: rows.slice(start, start + pdfRowsPerPage)
    });
  }

  return pages;
});

const isLastPdfPage = (pageIndex) => {
  return pageIndex === pdfPages.value.length - 1;
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

const getStudentGender = (student) => {
  return student?.gender || student?.sex || "-";
};

const getStudentMotherPhone = (student) => {
  return (
    student?.family?.motherNumber ||
    student?.family?.motherPhone ||
    student?.motherPhone ||
    student?.motherPhoneNumber ||
    student?.motherTel ||
    student?.mother?.phone ||
    student?.mother?.phoneNumber ||
    student?.guardianPhone ||
    student?.parentPhone ||
    "-"
  );
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

const getStudentClassIds = (student) => {
  const ids = [];

  const directClassId = getStudentClassId(student);
  if (directClassId) ids.push(directClassId);

  if (Array.isArray(student?.classes)) {
    student.classes.forEach((classItem) => {
      const id = getId(classItem);
      if (id) ids.push(id);
    });
  }

  if (Array.isArray(student?.classIds)) {
    student.classIds.forEach((classItem) => {
      const id = getId(classItem);
      if (id) ids.push(id);
    });
  }

  return [...new Set(ids)];
};

const getClassStudentIds = (cls) => {
  return Array.isArray(cls?.students)
    ? cls.students.map((student) => getId(student)).filter(Boolean)
    : [];
};

const getClassPopulatedStudents = (cls) => {
  return Array.isArray(cls?.students)
    ? cls.students.filter((student) => typeof student === "object" && student?._id)
    : [];
};

const uniqueRows = (rows) => {
  const seen = new Set();

  return rows.filter((row) => {
    const key = `${getId(row.classObject)}_${getId(row.student)}`;

    if (!key || seen.has(key)) return false;

    seen.add(key);
    return true;
  });
};

const getClassStudents = (cls) => {
  if (!cls) return [];

  const classId = getId(cls);
  const classStudentIds = getClassStudentIds(cls);
  const populatedStudents = getClassPopulatedStudents(cls);

  if (populatedStudents.length > 0) {
    return populatedStudents;
  }

  return studentsList.value.filter((student) => {
    const studentId = getId(student);
    const inClassArray = classStudentIds.includes(studentId);
    const inStudentClassField = getStudentClassIds(student).includes(classId);

    return inClassArray || inStudentClassField;
  });
};

const baseStudents = computed(() => {
  const rows = [];

  if (selectedClass.value) {
    getClassStudents(selectedClass.value).forEach((student) => {
      rows.push({
        student,
        classObject: selectedClass.value
      });
    });

    return rows;
  }

  classesList.value.forEach((cls) => {
    getClassStudents(cls).forEach((student) => {
      rows.push({
        student,
        classObject: cls
      });
    });
  });

  return uniqueRows(rows);
});

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

const getMonthDeadline = (student) => {
  if (!filters.month) return null;

  const [year, month] = filters.month.split("-");
  const joinDate = student?.joinDate ? new Date(student.joinDate) : null;
  const joinDay = joinDate && !Number.isNaN(joinDate.getTime()) ? joinDate.getDate() : 1;
  const lastDayOfMonth = new Date(Number(year), Number(month), 0).getDate();
  const safeDay = Math.min(joinDay, lastDayOfMonth);
  const deadline = new Date(Number(year), Number(month) - 1, safeDay);

  return deadline.toISOString().split("T")[0];
};

const findPayment = (studentId, classId) => {
  return paymentsList.value.find((payment) => {
    const paymentMonth = String(payment.paymentMonth || payment.month || "").slice(0, 7);

    return (
      getId(payment.student) === getId(studentId) &&
      getId(payment.class) === getId(classId) &&
      paymentMonth === String(filters.month)
    );
  });
};

const computeStatus = ({ paidAmount, balanceAmount, dueDate, backendStatus }) => {
  const today = new Date().toISOString().split("T")[0];

  if (paidAmount > 0 && balanceAmount <= 0) return "paid";
  if (paidAmount > 0 && balanceAmount > 0) return "partial";
  if (dueDate && today > dueDate) return "late";

  return backendStatus || "unpaid";
};

const buildRow = ({ student, classObject }) => {
  const existingPayment = findPayment(student._id, classObject._id);
  const paymentDeadline = getMonthDeadline(student);
  const defaultExpected = getClassDefaultDueAmount(classObject);

  if (existingPayment) {
    const tuitionFee = Number(existingPayment.tuitionFee || 0);
    const extraFee = Number(existingPayment.extraFee || 0);
    const amount = Number(existingPayment.amount || 0);
    const recordedTotal = tuitionFee + extraFee;

    const expectedAmount = Number(
      existingPayment.expectedAmount ||
        existingPayment.dueAmount ||
        defaultExpected ||
        recordedTotal ||
        amount ||
        0
    );

    const paidAmount = Number(
      existingPayment.paidAmount !== undefined
        ? existingPayment.paidAmount
        : amount || recordedTotal || 0
    );

    const balanceAmount = Number(
      existingPayment.balance !== undefined
        ? existingPayment.balance
        : Math.max(expectedAmount - paidAmount, 0)
    );

    const dueDate = existingPayment.dueDate
      ? new Date(existingPayment.dueDate).toISOString().split("T")[0]
      : paymentDeadline;

    const status = computeStatus({
      paidAmount,
      balanceAmount,
      dueDate,
      backendStatus: existingPayment.status
    });

    return {
      uniqueKey: existingPayment._id,
      student:
        existingPayment.student && typeof existingPayment.student === "object"
          ? existingPayment.student
          : student,
      classId: classObject._id,
      className: classObject.className || "-",
      paymentId: existingPayment._id,
      dueDate,
      paymentDeadline: dueDate,
      payDate: existingPayment.payDate || null,
      expectedAmount,
      paidAmount,
      balanceAmount,
      status,
      remark: existingPayment.remark || ""
    };
  }

  const dueDate = paymentDeadline;
  const paidAmount = 0;
  const balanceAmount = defaultExpected;

  const status = computeStatus({
    paidAmount,
    balanceAmount,
    dueDate,
    backendStatus: "unpaid"
  });

  return {
    uniqueKey: `virtual_${classObject._id}_${student._id}`,
    student,
    classId: classObject._id,
    className: classObject.className || "-",
    paymentId: null,
    dueDate,
    paymentDeadline: dueDate,
    payDate: null,
    expectedAmount: defaultExpected,
    paidAmount,
    balanceAmount,
    status,
    remark: ""
  };
};

const allRows = computed(() => {
  return baseStudents.value.map(buildRow);
});

const reportRows = computed(() => {
  const keyword = filters.search.trim().toLowerCase();

  return allRows.value.filter((row) => {
    const student = row.student || {};

    const keywordMatch =
      !keyword ||
      String(student.khmerName || "").toLowerCase().includes(keyword) ||
      String(student.englishName || "").toLowerCase().includes(keyword) ||
      String(student.studentId || "").toLowerCase().includes(keyword) ||
      String(student.idCode || "").toLowerCase().includes(keyword) ||
      String(student.gender || "").toLowerCase().includes(keyword) ||
      String(getStudentMotherPhone(student)).toLowerCase().includes(keyword) ||
      String(row.className || "").toLowerCase().includes(keyword);

    const statusMatch = filters.status === "All" || row.status === filters.status;

    return keywordMatch && statusMatch;
  });
});

const totalPages = computed(() => {
  return Math.ceil(reportRows.value.length / perPage.value) || 1;
});

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;

  return reportRows.value.slice(start, end);
});

const rowNumber = (index) => {
  return (currentPage.value - 1) * perPage.value + index + 1;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value -= 1;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value += 1;
};

watch(
  () => [
    filters.classId,
    filters.month,
    filters.status,
    filters.search,
    filters.defaultDueAmount
  ],
  () => {
    currentPage.value = 1;
  }
);

watch(totalPages, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value;
  }
});

const summary = computed(() => {
  const rows = reportRows.value;

  const paidRows = rows.filter((row) => row.status === "paid");
  const partialRows = rows.filter((row) => row.status === "partial");
  const unpaidRows = rows.filter((row) => row.status === "unpaid");
  const lateRows = rows.filter((row) => row.status === "late");

  const expectedAmount = rows.reduce((sum, row) => sum + Number(row.expectedAmount || 0), 0);
  const collectedAmount = rows.reduce((sum, row) => sum + Number(row.paidAmount || 0), 0);
  const balanceAmount = rows.reduce((sum, row) => sum + Number(row.balanceAmount || 0), 0);

  return {
    totalStudents: rows.length,
    paidCount: paidRows.length,
    partialCount: partialRows.length,
    unpaidCount: unpaidRows.length,
    lateCount: lateRows.length,
    expectedAmount,
    collectedAmount,
    balanceAmount,
    paidRate: rows.length
      ? Math.round(((paidRows.length + partialRows.length) / rows.length) * 100)
      : 0
  };
});

const resetFilters = () => {
  filters.classId = "";
  filters.month = getCurrentMonth();
  filters.status = "All";
  filters.search = "";
  filters.defaultDueAmount = 0;
  currentPage.value = 1;
};

const translateStatus = (status) => {
  if (status === "paid") return "បានបង់";
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

const getPdfStatusClass = (status) => {
  if (status === "paid") return "pdf-status-paid";
  if (status === "partial") return "pdf-status-partial";
  if (status === "late") return "pdf-status-late";

  return "pdf-status-unpaid";
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

const buildFileName = (extension) => {
  const className = selectedClassName.value || "payment";
  const month = filters.month || "all";
  const status = filters.status || "all";
  const safeClassName = className.replace(/[\\/:*?"<>|]/g, "-");

  return `payment-report-${safeClassName}-${month}-${status}.${extension}`;
};

const exportPDF = async () => {
  if (!canExport.value || exportingPdf.value) return;

  exportingPdf.value = true;

  try {
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 250));

    const element = pdfPaperRef.value;

    if (!element) return;

    const wrapper = element.closest(".pdf-paper-wrap");
    const pages = Array.from(element.querySelectorAll(".pdf-page"));

    if (pages.length === 0) return;

    const originalWrapperStyle = wrapper
      ? {
          display: wrapper.style.display,
          position: wrapper.style.position,
          left: wrapper.style.left,
          top: wrapper.style.top,
          width: wrapper.style.width,
          height: wrapper.style.height,
          overflow: wrapper.style.overflow,
          zIndex: wrapper.style.zIndex
        }
      : null;

    const originalElementStyle = {
      width: element.style.width,
      height: element.style.height,
      minHeight: element.style.minHeight,
      maxHeight: element.style.maxHeight,
      overflow: element.style.overflow,
      transform: element.style.transform,
      transformOrigin: element.style.transformOrigin
    };

    const originalPageStyles = pages.map((page) => ({
      width: page.style.width,
      height: page.style.height,
      minHeight: page.style.minHeight,
      maxHeight: page.style.maxHeight,
      overflow: page.style.overflow
    }));

    try {
      if (wrapper) {
        wrapper.style.display = "block";
        wrapper.style.position = "fixed";
        wrapper.style.left = "-99999px";
        wrapper.style.top = "0";
        wrapper.style.width = "794px";
        wrapper.style.height = "auto";
        wrapper.style.overflow = "visible";
        wrapper.style.zIndex = "-1";
      }

      element.style.width = "794px";
      element.style.height = "auto";
      element.style.minHeight = "1123px";
      element.style.maxHeight = "none";
      element.style.overflow = "visible";
      element.style.transform = "none";
      element.style.transformOrigin = "top left";

      pages.forEach((page) => {
        page.style.width = "794px";
        page.style.height = "1123px";
        page.style.minHeight = "1123px";
        page.style.maxHeight = "1123px";
        page.style.overflow = "hidden";
      });

      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 250));

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let pageIndex = 0; pageIndex < pages.length; pageIndex += 1) {
        const pageElement = pages[pageIndex];

        const canvas = await html2canvas(pageElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "rgb(255, 255, 255)",
          width: 794,
          height: 1123,
          windowWidth: 794,
          windowHeight: 1123,
          scrollX: 0,
          scrollY: 0,
          logging: false
        });

        const imageData = canvas.toDataURL("image/png");

        if (pageIndex > 0) {
          pdf.addPage();
        }

        pdf.addImage(
          imageData,
          "PNG",
          0,
          0,
          pageWidth,
          pageHeight,
          undefined,
          "FAST"
        );
      }

      pdf.save(buildFileName("pdf"));
    } finally {
      if (wrapper && originalWrapperStyle) {
        wrapper.style.display = originalWrapperStyle.display;
        wrapper.style.position = originalWrapperStyle.position;
        wrapper.style.left = originalWrapperStyle.left;
        wrapper.style.top = originalWrapperStyle.top;
        wrapper.style.width = originalWrapperStyle.width;
        wrapper.style.height = originalWrapperStyle.height;
        wrapper.style.overflow = originalWrapperStyle.overflow;
        wrapper.style.zIndex = originalWrapperStyle.zIndex;
      }

      element.style.width = originalElementStyle.width;
      element.style.height = originalElementStyle.height;
      element.style.minHeight = originalElementStyle.minHeight;
      element.style.maxHeight = originalElementStyle.maxHeight;
      element.style.overflow = originalElementStyle.overflow;
      element.style.transform = originalElementStyle.transform;
      element.style.transformOrigin = originalElementStyle.transformOrigin;

      pages.forEach((page, index) => {
        const style = originalPageStyles[index];

        page.style.width = style.width;
        page.style.height = style.height;
        page.style.minHeight = style.minHeight;
        page.style.maxHeight = style.maxHeight;
        page.style.overflow = style.overflow;
      });
    }
  } catch (err) {
    console.error("PDF export error:", err);
  } finally {
    exportingPdf.value = false;
  }
};

const getExcelStatusFill = (status) => {
  if (status === "paid") return "FFDCFCE7";
  if (status === "partial") return "FFFFEDD5";
  if (status === "late") return "FFFEE2E2";

  return "FFF1F5F9";
};

const getExcelStatusFont = (status) => {
  if (status === "paid") return "FF15803D";
  if (status === "partial") return "FFC2410C";
  if (status === "late") return "FFB91C1C";

  return "FF475569";
};

const applyCellBorder = (cell, color = "FFE2E8F0") => {
  cell.border = {
    top: { style: "thin", color: { argb: color } },
    left: { style: "thin", color: { argb: color } },
    bottom: { style: "thin", color: { argb: color } },
    right: { style: "thin", color: { argb: color } }
  };
};

const styleHeaderRow = (row) => {
  row.height = 24;

  row.eachCell((cell) => {
    cell.font = {
      name: excelFontName,
      bold: true,
      color: { argb: "FF1E3A8A" }
    };

    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true
    };

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFDBEAFE" }
    };

    applyCellBorder(cell, "FF93C5FD");
  });
};

const styleDataRow = (row, status) => {
  row.height = 22;

  row.eachCell((cell) => {
    cell.font = {
      name: excelFontName,
      size: 11,
      color: { argb: "FF334155" }
    };

    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true
    };

    applyCellBorder(cell);
  });

  row.getCell("J").numFmt = '"៛"#,##0';
  row.getCell("K").numFmt = '"៛"#,##0';
  row.getCell("L").numFmt = '"៛"#,##0';

  row.getCell("J").font = {
    name: excelFontName,
    bold: true,
    color: { argb: "FF1D4ED8" }
  };

  row.getCell("K").font = {
    name: excelFontName,
    bold: true,
    color: { argb: "FF15803D" }
  };

  row.getCell("L").font = {
    name: excelFontName,
    bold: true,
    color: { argb: "FFDC2626" }
  };

  row.getCell("M").font = {
    name: excelFontName,
    bold: true,
    color: { argb: getExcelStatusFont(status) }
  };

  row.getCell("M").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: getExcelStatusFill(status) }
  };
};

const exportExcel = async () => {
  if (!canExport.value || exportingExcel.value) return;

  exportingExcel.value = true;

  try {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "RIS School Management System";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Payment Report");

    worksheet.columns = [
      { header: "ល.រ", key: "no", width: 8 },
      { header: "ឈ្មោះខ្មែរ", key: "khmerName", width: 22 },
      { header: "ឈ្មោះឡាតាំង", key: "englishName", width: 22 },
      { header: "ភេទ", key: "gender", width: 10 },
      { header: "អត្តលេខ", key: "studentId", width: 15 },
      { header: "លេខទូរស័ព្ទម្ដាយ", key: "motherPhone", width: 20 },
      { header: "ថ្នាក់", key: "className", width: 18 },
      { header: "ខែបង់ប្រាក់", key: "paymentMonth", width: 16 },
      { header: "ថ្ងៃត្រូវបង់", key: "dueDate", width: 18 },
      { header: "ត្រូវបង់សរុប", key: "expectedAmount", width: 16 },
      { header: "បានបង់", key: "paidAmount", width: 16 },
      { header: "នៅខ្វះ", key: "balanceAmount", width: 16 },
      { header: "ស្ថានភាព", key: "status", width: 16 },
      { header: "ថ្ងៃបង់ប្រាក់", key: "payDate", width: 18 },
      { header: "កំណត់សម្គាល់", key: "remark", width: 24 }
    ];

    worksheet.spliceRows(
      1,
      0,
      ["របាយការណ៍បង់ប្រាក់សិស្ស"],
      [`ថ្នាក់រៀន: ${selectedClassName.value}`],
      [`ខែ: ${selectedMonthLabel.value}`],
      [`ស្ថានភាព: ${selectedStatusLabel.value}`],
      [`បានបង្កើតនៅ: ${todayLabel.value}`],
      []
    );

    worksheet.mergeCells("A1:O1");

    worksheet.getCell("A1").font = {
      name: excelFontName,
      bold: true,
      size: 16,
      color: { argb: "FF1E40AF" }
    };

    worksheet.getCell("A1").alignment = {
      horizontal: "center",
      vertical: "middle"
    };

    worksheet.getCell("A1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFEFF6FF" }
    };

    ["A2", "A3", "A4", "A5"].forEach((cellKey) => {
      worksheet.getCell(cellKey).font = {
        name: excelFontName,
        bold: true,
        size: 11,
        color: { argb: "FF334155" }
      };
    });

    const headerRow = worksheet.getRow(7);
    styleHeaderRow(headerRow);

    reportRows.value.forEach((row, index) => {
      const dataRow = worksheet.addRow({
        no: index + 1,
        khmerName: row.student?.khmerName || "",
        englishName: row.student?.englishName || "",
        gender: getStudentGender(row.student),
        studentId: row.student?.studentId || row.student?.idCode || "",
        motherPhone: getStudentMotherPhone(row.student),
        className: row.className || "",
        paymentMonth: filters.month || "",
        dueDate: formatDate(row.dueDate || row.paymentDeadline),
        expectedAmount: Number(row.expectedAmount || 0),
        paidAmount: Number(row.paidAmount || 0),
        balanceAmount: Number(row.balanceAmount || 0),
        status: translateStatus(row.status),
        payDate: formatDate(row.payDate),
        remark: row.remark || ""
      });

      styleDataRow(dataRow, row.status);
    });

    const totalRow = worksheet.addRow({
      dueDate: "សរុប",
      expectedAmount: summary.value.expectedAmount,
      paidAmount: summary.value.collectedAmount,
      balanceAmount: summary.value.balanceAmount,
      status: `Paid Rate ${summary.value.paidRate}%`
    });

    totalRow.height = 24;

    totalRow.eachCell((cell) => {
      cell.font = {
        name: excelFontName,
        bold: true,
        color: { argb: "FF0F172A" }
      };

      cell.alignment = {
        vertical: "middle",
        horizontal: "center"
      };

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF1F5F9" }
      };

      applyCellBorder(cell, "FFCBD5E1");
    });

    totalRow.getCell("J").numFmt = '"៛"#,##0';
    totalRow.getCell("K").numFmt = '"៛"#,##0';
    totalRow.getCell("L").numFmt = '"៛"#,##0';

    totalRow.getCell("J").font = {
      name: excelFontName,
      bold: true,
      color: { argb: "FF1D4ED8" }
    };

    totalRow.getCell("K").font = {
      name: excelFontName,
      bold: true,
      color: { argb: "FF15803D" }
    };

    totalRow.getCell("L").font = {
      name: excelFontName,
      bold: true,
      color: { argb: "FFDC2626" }
    };

    worksheet.views = [
      {
        state: "frozen",
        ySplit: 7
      }
    ];

    worksheet.pageSetup = {
      paperSize: 9,
      orientation: "landscape",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0
    };

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = buildFileName("xlsx");

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Excel export error:", err);
  } finally {
    exportingExcel.value = false;
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
}

.summary-card {
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 0.75rem;
  padding: 0.48rem 0.55rem;
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
  font-size: 0.82rem;
  font-weight: 900;
  line-height: 1.2;
  margin-top: 0.18rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mobile-money-box {
  border-width: 1px;
  border-radius: 0.6rem;
  padding: 0.42rem 0.45rem;
  min-width: 0;
}

.mobile-money-label {
  font-size: 0.56rem;
  font-weight: 900;
  line-height: 1;
  white-space: nowrap;
}

.mobile-money-value {
  margin-top: 0.2rem;
  font-size: 0.68rem;
  font-weight: 900;
  line-height: 1.1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.table-th {
  padding: 0.5rem 0.6rem;
  font-size: 0.68rem;
  font-weight: 900;
  color: #475569;
  border: 1px solid #e2e8f0;
  white-space: nowrap;
}

.table-td {
  padding: 0.5rem 0.6rem;
  border: 1px solid #f1f5f9;
  font-size: 0.7rem;
  vertical-align: middle;
}

.font-khmer {
  font-family: "Battambang", "Siemreap", "Kantumruy Pro", sans-serif;
}

.pdf-paper-wrap {
  position: fixed;
  left: -99999px;
  top: 0;
  display: block;
  width: 794px;
  height: auto;
  min-height: 1123px;
  overflow: visible;
  background: #ffffff;
  z-index: -1;
  pointer-events: none;
}

.pdf-document {
  width: 794px;
  height: auto;
  overflow: visible;
  background: #ffffff;
}

.pdf-paper {
  width: 794px;
  height: 1123px;
  min-height: 1123px;
  max-height: 1123px;
  box-sizing: border-box;
  padding: 12px 10px 9px;
  overflow: hidden;
  background: #ffffff;
  color: #000000;
  font-family: "Khmer OS Battambang", "Noto Sans Khmer", "Battambang", Arial, sans-serif;
}

.pdf-page + .pdf-page {
  margin-top: 12px;
}

.pdf-header {
  display: grid;
  grid-template-columns: 58px 1fr 58px;
  align-items: start;
  margin-bottom: 4px;
}

.pdf-logo-wrap {
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.pdf-logo {
  width: 46px;
  height: 46px;
  object-fit: contain;
}

.pdf-title {
  text-align: center;
  color: #0f172a;
}

.pdf-title h2 {
  margin: 0;
  font-size: 14px;
  line-height: 1.08;
  font-weight: 900;
}

.pdf-title h3 {
  margin: 1px 0 0;
  font-size: 11px;
  line-height: 1.08;
  font-weight: 900;
}

.pdf-title h1 {
  margin: 3px 0 1px;
  font-size: 14px;
  line-height: 1.08;
  font-weight: 900;
  color: #1d4ed8;
}

.pdf-title p {
  margin: 0;
  font-size: 8.2px;
  line-height: 1.18;
  font-weight: 700;
  color: #334155;
}

.pdf-summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  margin-bottom: 5px;
}

.pdf-summary-box {
  border: 1px solid #bfdbfe;
  background: #eff6ff;
  padding: 3px 4px;
  text-align: center;
  border-radius: 5px;
}

.pdf-summary-box span {
  display: block;
  font-size: 7.5px;
  color: #1e40af;
  line-height: 1.15;
  font-weight: 800;
}

.pdf-summary-box strong {
  display: block;
  font-size: 9px;
  line-height: 1.15;
  font-weight: 900;
  color: #0f172a;
}

.pdf-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  font-size: 6.85px;
  color: #000000;
  font-family: "Khmer OS Battambang", "Noto Sans Khmer", "Battambang", Arial, sans-serif;
}

.pdf-table th,
.pdf-table td {
  border: 1px solid #475569;
  padding: 1px 1.5px;
  height: 18px;
  line-height: 1.08;
  vertical-align: middle;
  text-align: center;
  box-sizing: border-box;
  background: #ffffff;
  color: #000000;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-family: "Khmer OS Battambang", "Noto Sans Khmer", "Battambang", Arial, sans-serif;
}

.pdf-table th {
  height: 21px;
  font-weight: 900;
  background: #dbeafe;
  color: #1e3a8a;
  white-space: nowrap;
}

.pdf-table tr {
  page-break-inside: avoid;
  break-inside: avoid;
}

.pdf-no-col {
  width: 24px;
}

.pdf-name-col {
  width: 78px;
  text-align: center;
  font-weight: 800;
}

.pdf-gender-col {
  width: 28px;
}

.pdf-phone-col {
  width: 68px;
}

.pdf-class-col {
  width: 54px;
}

.pdf-status-col {
  width: 52px;
}

.pdf-money-col {
  width: 66px;
}

.pdf-remark-col {
  width: 60px;
}

.pdf-status-cell {
  font-weight: 900;
}

.pdf-status-paid {
  background: #dcfce7 !important;
  color: #15803d !important;
}

.pdf-status-partial {
  background: #ffedd5 !important;
  color: #c2410c !important;
}

.pdf-status-late {
  background: #fee2e2 !important;
  color: #b91c1c !important;
}

.pdf-status-unpaid {
  background: #f1f5f9 !important;
  color: #475569 !important;
}

.pdf-money-due {
  color: #1d4ed8 !important;
  font-weight: 900;
}

.pdf-money-paid {
  color: #15803d !important;
  font-weight: 900;
}

.pdf-money-balance {
  color: #dc2626 !important;
  font-weight: 900;
}

.pdf-table tfoot td {
  height: 21px;
  font-weight: 900;
  background: #e2e8f0;
  color: #0f172a;
  text-align: center;
  vertical-align: middle;
}

.pdf-total-label {
  text-align: center;
  font-weight: 900;
}

.pdf-signature {
  margin-top: 7px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  font-size: 8.5px;
  line-height: 1.16;
  text-align: center;
  page-break-inside: avoid;
  break-inside: avoid;
}

.signature-space {
  height: 24px;
}

.pdf-continued {
  margin-top: 5px;
  text-align: center;
  font-size: 8px;
  font-weight: 800;
  color: #64748b;
}

.bold {
  font-weight: 900;
}

@media (min-width: 640px) {
  .form-label {
    font-size: 0.68rem;
  }

  .form-input {
    padding: 0.44rem 0.6rem;
    font-size: 0.75rem;
    min-height: 2.35rem;
  }

  .summary-card {
    padding: 0.6rem 0.7rem;
  }

  .summary-label {
    font-size: 0.62rem;
  }

  .summary-value {
    font-size: 1rem;
  }
}
</style>