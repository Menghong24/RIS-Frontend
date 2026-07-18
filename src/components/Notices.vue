<template>
  <div class="announcements-page-mobile-safe bg-slate-50 p-2 sm:p-3 md:p-4 text-slate-800">
    <div class="max-w-7xl mx-auto space-y-3 md:space-y-4">
      <!-- Header -->
      <div class="bg-white p-2.5 sm:p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 sm:gap-3">
          <div class="min-w-0">
            <h1 class="text-base sm:text-lg md:text-xl font-extrabold text-slate-800 flex items-center gap-2">
              <span class="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs sm:text-sm shrink-0">
                <i class="fa-solid fa-bullhorn"></i>
              </span>

              <span class="truncate">
                គ្រប់គ្រងសេចក្តីជូនដំណឹង
              </span>
            </h1>

            <p class="text-[11px] sm:text-xs text-slate-500 mt-1 truncate">
              {{
                isAdmin
                  ? "បង្កើត កែប្រែ លុប និងផ្សាយសេចក្តីជូនដំណឹងសម្រាប់សិស្ស ឬថ្នាក់រៀន"
                  : "មើលសេចក្តីជូនដំណឹងដែលបានផ្សព្វផ្សាយ"
              }}
            </p>
          </div>

          <button
            v-if="isAdmin"
            @click="openCreateModal"
            class="w-full sm:w-auto bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-blue-700 font-bold shadow-sm transition active:scale-95 flex items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs"
          >
            <i class="fa-solid fa-plus text-[10px] sm:text-xs"></i>
            បន្ថែមសេចក្តីជូនដំណឹង
          </button>

          <span
            v-else
            class="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-slate-100 text-slate-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold text-[11px] sm:text-xs border border-slate-200"
          >
            <i class="fa-solid fa-eye text-[10px] sm:text-xs"></i>
            មើលបានប៉ុណ្ណោះ
          </span>
        </div>
      </div>

      <!-- Notice for non-admin -->
      <div
        v-if="!isAdmin"
        class="bg-blue-50 border border-blue-100 text-blue-700 rounded-xl px-3 py-2 text-[11px] sm:text-xs font-bold flex items-start gap-2"
      >
        <i class="fa-solid fa-circle-info mt-0.5"></i>

        <span>
          គណនីនេះអាចមើលសេចក្តីជូនដំណឹងបានប៉ុណ្ណោះ។ ការបង្កើត កែប្រែ លុប ឬផ្សាយដំណឹង អនុញ្ញាតសម្រាប់ admin ប៉ុណ្ណោះ។
        </span>
      </div>


      <!-- Month Navigation -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm px-2.5 sm:px-3 py-2.5 sm:py-3">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 md:gap-3">
          <div class="min-w-0">
            <p class="text-[10px] sm:text-[11px] font-extrabold text-slate-400 uppercase tracking-wide">
              ខែដែលកំពុងបង្ហាញ
            </p>

            <h2 class="text-sm sm:text-base font-extrabold text-slate-800 mt-0.5 flex items-center gap-1.5">
              <i class="fa-solid fa-calendar-days text-blue-600 text-xs sm:text-sm"></i>
              <span class="truncate">
                {{ selectedMonthLabel }}
              </span>
            </h2>

            <p class="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">
              បង្ហាញសេចក្តីជូនដំណឹងក្នុងខែដែលបានជ្រើសរើសប៉ុណ្ណោះ
            </p>
          </div>

          <div class="grid grid-cols-3 sm:flex sm:items-center gap-1.5 sm:gap-2 w-full md:w-auto">
            <button
              type="button"
              @click="goToPreviousMonth"
              class="inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-[10px] sm:text-xs font-bold transition"
            >
              <i class="fa-solid fa-chevron-left text-[9px]"></i>
              ខែមុន
            </button>

            <button
              type="button"
              @click="goToCurrentMonth"
              :disabled="isViewingCurrentMonth"
              class="inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-blue-100 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] sm:text-xs font-bold transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <i class="fa-solid fa-calendar-check text-[9px]"></i>
              ខែនេះ
            </button>

            <button
              type="button"
              @click="goToNextMonth"
              class="inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-[10px] sm:text-xs font-bold transition"
            >
              ខែបន្ទាប់
              <i class="fa-solid fa-chevron-right text-[9px]"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div
        v-if="loading"
        class="bg-white rounded-xl border border-slate-200 p-7 sm:p-8 text-center text-slate-400"
      >
        <div class="mx-auto mb-2 h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <i class="fa-solid fa-circle-notch fa-spin text-lg sm:text-xl"></i>
        </div>

        <p class="text-xs sm:text-sm font-bold text-slate-500">
          កំពុងទាញយកទិន្នន័យ...
        </p>
      </div>

      <!-- Announcement List -->
      <div v-else class="announcements-list-mobile-safe grid gap-2.5 sm:gap-3">
        <div
          v-for="item in visibleAnnouncementsList"
          :key="item._id"
          class="bg-white p-2.5 sm:p-3 md:p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-200 transition relative group"
        >
          <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-2.5 md:gap-3">
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span
                  v-if="item.targetType === 'all'"
                  class="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full"
                >
                  <i class="fa-solid fa-users mr-1"></i>
                  សិស្សទាំងអស់
                </span>

                <span
                  v-else
                  class="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full"
                >
                  <i class="fa-solid fa-school mr-1"></i>
                  {{ getClassName(item.targetClass) }}
                </span>

                <span
                  v-if="isAdmin"
                  :class="getStatusClass(item.status)"
                  class="text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border"
                >
                  {{ translateStatus(item.status) }}
                </span>

                <span
                  v-else
                  class="text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border bg-green-50 text-green-700 border-green-200"
                >
                  បានផ្សព្វផ្សាយ
                </span>
              </div>

              <h3 class="text-sm sm:text-base font-extrabold text-slate-800 mt-2 sm:mt-3 leading-tight">
                {{ item.title || "-" }}
              </h3>

              <p class="text-xs sm:text-sm text-slate-600 mt-1 whitespace-pre-wrap leading-relaxed">
                {{ item.content || "-" }}
              </p>
            </div>

            <div class="text-left md:text-right text-[10px] sm:text-[11px] text-slate-400 shrink-0">
              <p class="font-bold text-slate-500">
                <i class="fa-solid fa-calendar-days mr-1"></i>
                {{ formatDate(item.postDate || item.createdAt) }}
              </p>

              <p v-if="item.postedBy" class="mt-1">
                <i class="fa-solid fa-user-pen mr-1"></i>
                ដោយ៖ {{ getPostedByName(item.postedBy) }}
              </p>
            </div>
          </div>

          <!-- Actions: Admin Only -->
          <div
            v-if="isAdmin"
            class="mt-3 sm:mt-4 flex items-center justify-end gap-2 md:absolute md:top-3 md:right-3 md:mt-0 md:hidden md:group-hover:flex"
          >
            <button
              @click="openEditModal(item)"
              class="px-2.5 sm:px-3 py-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 text-[11px] sm:text-xs font-bold transition flex items-center gap-1"
            >
              <i class="fa-solid fa-pen-to-square text-[10px]"></i>
              កែប្រែ
            </button>

            <button
              @click="openDeleteModal(item)"
              :disabled="isDeleting"
              class="px-2.5 sm:px-3 py-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 text-[11px] sm:text-xs font-bold transition flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="fa-solid fa-trash text-[10px]"></i>
              លុប
            </button>
          </div>
        </div>

        <!-- Empty -->
        <div
          v-if="visibleAnnouncementsList.length === 0"
          class="announcements-empty-mobile-safe text-center py-10 text-slate-400 bg-white border border-dashed border-slate-300 rounded-xl"
        >
          <div class="mx-auto mb-2 h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
            <i class="fa-solid fa-bell-slash text-xl"></i>
          </div>

          <p class="text-xs sm:text-sm font-bold text-slate-600">
            មិនមានសេចក្តីជូនដំណឹង
          </p>

          <p class="text-[11px] sm:text-xs text-slate-400 mt-1">
            {{
              isAdmin
                ? `មិនមានសេចក្តីជូនដំណឹងក្នុង ${selectedMonthLabel}។ សូមបន្ថែមសេចក្តីជូនដំណឹងថ្មី`
                : `មិនទាន់មានសេចក្តីជូនដំណឹងដែលបានផ្សព្វផ្សាយក្នុង ${selectedMonthLabel} ទេ`
            }}
          </p>
        </div>
      </div>

      <!-- Create/Edit Modal: Admin Only -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showModal && isAdmin"
          class="announcement-modal-overlay-mobile-safe fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-2 sm:p-4"
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
              v-if="showModal && isAdmin"
              class="announcement-modal-panel-mobile-safe bg-white rounded-t-2xl sm:rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col max-h-[94dvh] sm:max-h-[90vh]"
            >
              <div class="px-3 sm:px-4 py-2.5 sm:py-3 border-b border-slate-100 flex justify-between items-start gap-2 bg-slate-50 shrink-0">
                <div class="min-w-0">
                  <h3 class="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
                    <i
                      :class="
                        isEditing
                          ? 'fa-solid fa-pen-to-square text-blue-600'
                          : 'fa-solid fa-plus text-blue-600'
                      "
                    ></i>

                    <span class="truncate">
                      {{ isEditing ? "កែប្រែសេចក្តីជូនដំណឹង" : "បង្កើតសេចក្តីជូនដំណឹងថ្មី" }}
                    </span>
                  </h3>

                  <p class="text-[10px] sm:text-xs text-slate-500 mt-0.5 truncate">
                    បំពេញព័ត៌មានសេចក្តីជូនដំណឹងខាងក្រោម
                  </p>
                </div>

                <button
                  @click="closeModal"
                  :disabled="isSaving"
                  class="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>

              <form
                @submit.prevent="handleSubmit"
                class="announcement-modal-body-mobile-safe p-3 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto modal-scroll"
              >
                <!-- Title -->
                <div>
                  <label class="form-label">
                    ចំណងជើង <span class="text-red-500">*</span>
                  </label>

                  <input
                    v-model.trim="form.title"
                    required
                    type="text"
                    placeholder="បញ្ចូលចំណងជើង..."
                    class="form-input"
                  />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  <!-- Target -->
                  <div>
                    <label class="form-label">
                      ផ្ញើទៅ
                    </label>

                    <select
                      v-model="form.targetType"
                      class="form-input"
                    >
                      <option value="all">សិស្សទាំងអស់</option>
                      <option value="class">ថ្នាក់ជាក់លាក់</option>
                    </select>
                  </div>

                  <!-- Status -->
                  <div>
                    <label class="form-label">
                      ស្ថានភាព
                    </label>

                    <select
                      v-model="form.status"
                      class="form-input"
                    >
                      <option value="published">ផ្សព្វផ្សាយ</option>
                      <option value="draft">ព្រាង</option>
                      <option value="archived">រក្សាទុក</option>
                    </select>
                  </div>
                </div>

                <!-- Select Class -->
                <div v-if="form.targetType === 'class'">
                  <label class="form-label">
                    ជ្រើសរើសថ្នាក់ <span class="text-red-500">*</span>
                  </label>

                  <select
                    v-model="form.targetClass"
                    required
                    class="form-input"
                  >
                    <option :value="null">-- ជ្រើសរើសថ្នាក់ --</option>

                    <option
                      v-for="c in classesList"
                      :key="c._id"
                      :value="c._id"
                    >
                      {{ c.className }}
                    </option>
                  </select>
                </div>

                <!-- Content -->
                <div>
                  <label class="form-label">
                    ខ្លឹមសារ <span class="text-red-500">*</span>
                  </label>

                  <textarea
                    v-model.trim="form.content"
                    required
                    rows="4"
                    placeholder="បញ្ចូលខ្លឹមសារសេចក្តីជូនដំណឹង..."
                    class="form-input resize-none min-h-[6.5rem]"
                  ></textarea>
                </div>

                <!-- Posted By -->
                <div>
                  <label class="form-label">
                    អ្នកប្រកាស
                  </label>

                  <select
                    v-model="form.postedBy"
                    class="form-input"
                  >
                    <option :value="null">-- អ្នកគ្រប់គ្រង --</option>

                    <option
                      v-for="t in teachersList"
                      :key="t._id"
                      :value="t._id"
                    >
                      {{ t.khmerName || t.englishName }} ({{ t.englishName || "-" }})
                    </option>
                  </select>
                </div>

                <!-- Actions -->
                <div class="announcement-modal-footer-mobile-safe sticky bottom-0 -mx-3 sm:-mx-4 px-3 sm:px-4 py-2.5 flex justify-end gap-2.5 border-t border-slate-100 bg-white">
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

                    <i
                      v-else
                      class="fa-solid fa-floppy-disk"
                    ></i>

                    {{ isSaving ? "កំពុងរក្សាទុក..." : (isEditing ? "រក្សាទុកការកែប្រែ" : "រក្សាទុក") }}
                  </button>
                </div>
              </form>
            </div>
          </Transition>
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
          v-if="showDeleteModal && isAdmin"
          class="announcement-modal-overlay-mobile-safe fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[60] p-3 sm:p-4"
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
              v-if="showDeleteModal && isAdmin"
              class="announcement-modal-panel-mobile-safe bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100"
            >
              <div class="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div class="min-w-0">
                  <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
                    <i class="fa-solid fa-triangle-exclamation text-red-600"></i>
                    បញ្ជាក់ការលុប
                  </h3>

                  <p class="text-xs text-slate-500 mt-0.5">
                    សូមពិនិត្យមុនពេលបន្តលុបសេចក្តីជូនដំណឹង
                  </p>
                </div>

                <button
                  type="button"
                  @click="closeDeleteModal"
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
                  តើអ្នកពិតជាចង់លុបសេចក្តីជូនដំណឹង
                  <span class="font-extrabold text-slate-900">
                    "{{ announcementToDelete?.title || 'នេះ' }}"
                  </span>
                  មែនទេ?
                </p>

                <div class="mt-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-[12px] font-bold text-red-700">
                  <i class="fa-solid fa-circle-info mr-1"></i>
                  សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
                </div>
              </div>

              <div class="announcement-modal-footer-mobile-safe px-4 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2.5">
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
                  <i
                    v-if="isDeleting"
                    class="fa-solid fa-circle-notch fa-spin"
                  ></i>

                  <i
                    v-else
                    class="fa-solid fa-trash"
                  ></i>

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
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
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

const getMonthStart = (value = new Date()) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }

  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const getMonthEnd = (value = new Date()) => {
  const date = getMonthStart(value);
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
};

const getMonthLabel = (value = new Date()) => {
  const date = getMonthStart(value);

  return date.toLocaleDateString("km-KH", {
    month: "long",
    year: "numeric"
  });
};

const getAnnouncementDate = (item) => {
  const dateValue = item?.postDate || item?.createdAt || item?.updatedAt;

  if (!dateValue) return null;

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return null;

  return date;
};

const getAnnouncementTime = (item) => {
  const date = getAnnouncementDate(item);
  return date ? date.getTime() : 0;
};

const selectedMonthDate = ref(getMonthStart(new Date()));

const {
  data: announcements,
  fetchData,
  loading
} = useQuery("announcements");

const { data: classes } = useQuery("classes");
const { data: teachers } = useQuery("teachers");

const {
  createDoc,
  updateDoc,
  deleteDoc
} = useCollection("announcements", {
  toast: false
});

const showModal = ref(false);
const isEditing = ref(false);
const editId = ref(null);
const isSaving = ref(false);

const showDeleteModal = ref(false);
const announcementToDelete = ref(null);
const isDeleting = ref(false);

const defaultForm = () => ({
  title: "",
  content: "",
  targetType: "all",
  targetClass: null,
  postedBy: null,
  status: "published"
});

const form = ref(defaultForm());

const normalizeArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.result)) return value.result;
  if (Array.isArray(value?.items)) return value.items;
  return [];
};

const announcementsList = computed(() => normalizeArray(announcements.value));
const classesList = computed(() => normalizeArray(classes.value));
const teachersList = computed(() => normalizeArray(teachers.value));

const currentUser = computed(() => {
  try {
    const savedUser = JSON.parse(localStorage.getItem("user") || "{}");

    return savedUser?.user || savedUser?.data || savedUser;
  } catch (error) {
    return {};
  }
});

const userRole = computed(() => {
  return String(currentUser.value?.role || "").toLowerCase();
});

const isAdmin = computed(() => {
  return userRole.value === "admin";
});

const selectedMonthLabel = computed(() => {
  return getMonthLabel(selectedMonthDate.value);
});

const isViewingCurrentMonth = computed(() => {
  const currentMonth = getMonthStart(new Date());
  const selectedMonth = getMonthStart(selectedMonthDate.value);

  return currentMonth.getTime() === selectedMonth.getTime();
});

const isAnnouncementInSelectedMonth = (item) => {
  const announcementDate = getAnnouncementDate(item);

  if (!announcementDate) return false;

  const monthStart = getMonthStart(selectedMonthDate.value);
  const nextMonthStart = getMonthEnd(selectedMonthDate.value);

  return announcementDate >= monthStart && announcementDate < nextMonthStart;
};

const visibleAnnouncementsList = computed(() => {
  let list = announcementsList.value.filter((item) => {
    return isAnnouncementInSelectedMonth(item);
  });

  if (!isAdmin.value) {
    list = list.filter((item) => item.status === "published");
  }

  return [...list].sort((a, b) => {
    return getAnnouncementTime(b) - getAnnouncementTime(a);
  });
});

const goToPreviousMonth = () => {
  const current = getMonthStart(selectedMonthDate.value);
  selectedMonthDate.value = new Date(current.getFullYear(), current.getMonth() - 1, 1);
};

const goToNextMonth = () => {
  const current = getMonthStart(selectedMonthDate.value);
  selectedMonthDate.value = new Date(current.getFullYear(), current.getMonth() + 1, 1);
};

const goToCurrentMonth = () => {
  selectedMonthDate.value = getMonthStart(new Date());
};

const getErrorMessage = (error, fallback = "មានបញ្ហា") => {
  return (
    error.response?.data?.err ||
    error.response?.data?.message ||
    error.message ||
    fallback
  );
};

const formatDate = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleDateString("km-KH", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};

const translateStatus = (status) => {
  if (status === "published") return "បានផ្សព្វផ្សាយ";
  if (status === "draft") return "ព្រាង";
  if (status === "archived") return "រក្សាទុក";
  return status || "មិនមាន";
};

const getStatusClass = (status) => {
  if (status === "published") {
    return "bg-green-50 text-green-700 border-green-200";
  }

  if (status === "draft") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  return "bg-slate-100 text-slate-600 border-slate-200";
};

const getClassName = (targetClass) => {
  if (!targetClass) return "ថ្នាក់រៀន";

  if (typeof targetClass === "object") {
    return targetClass.className || "ថ្នាក់រៀន";
  }

  const foundClass = classesList.value.find((cls) => {
    return String(cls._id) === String(targetClass);
  });

  return foundClass?.className || "ថ្នាក់រៀន";
};

const getPostedByName = (postedBy) => {
  if (!postedBy) return "អ្នកគ្រប់គ្រង";

  if (typeof postedBy === "object") {
    return postedBy.khmerName || postedBy.englishName || postedBy.username || "អ្នកគ្រប់គ្រង";
  }

  const foundTeacher = teachersList.value.find((teacher) => {
    return String(teacher._id) === String(postedBy);
  });

  return foundTeacher?.khmerName || foundTeacher?.englishName || "អ្នកគ្រប់គ្រង";
};

const resetFormState = () => {
  showModal.value = false;
  isEditing.value = false;
  editId.value = null;
  form.value = defaultForm();
};

const openCreateModal = () => {
  if (!isAdmin.value) {
    toast.error("មានតែ admin ប៉ុណ្ណោះអាចបង្កើតសេចក្តីជូនដំណឹងបាន");
    return;
  }

  isEditing.value = false;
  editId.value = null;
  form.value = defaultForm();
  showModal.value = true;
};

const openEditModal = (item) => {
  if (!isAdmin.value) {
    toast.error("មានតែ admin ប៉ុណ្ណោះអាចកែប្រែសេចក្តីជូនដំណឹងបាន");
    return;
  }

  isEditing.value = true;
  editId.value = item._id;

  form.value = {
    title: item.title || "",
    content: item.content || "",
    targetType: item.targetType || "all",
    targetClass:
      item.targetClass && typeof item.targetClass === "object"
        ? item.targetClass._id
        : item.targetClass || null,
    postedBy:
      item.postedBy && typeof item.postedBy === "object"
        ? item.postedBy._id
        : item.postedBy || null,
    status: item.status || "published"
  };

  showModal.value = true;
};

const closeModal = () => {
  if (isSaving.value) return;

  resetFormState();
};

const forceCloseModal = () => {
  resetFormState();
};

watch(
  () => form.value.targetType,
  (targetType) => {
    if (targetType === "all") {
      form.value.targetClass = null;
    }
  }
);

const handleSubmit = async () => {
  if (!isAdmin.value) {
    toast.error("មានតែ admin ប៉ុណ្ណោះអាចរក្សាទុក ឬផ្សាយសេចក្តីជូនដំណឹងបាន");
    return;
  }

  if (isSaving.value) return;

  if (!form.value.title.trim()) {
    toast.error("សូមបញ្ចូលចំណងជើង");
    return;
  }

  if (!form.value.content.trim()) {
    toast.error("សូមបញ្ចូលខ្លឹមសារ");
    return;
  }

  if (form.value.targetType === "class" && !form.value.targetClass) {
    toast.error("សូមជ្រើសរើសថ្នាក់");
    return;
  }

  isSaving.value = true;

  try {
    const payload = {
      ...form.value,
      targetClass: form.value.targetType === "class" ? form.value.targetClass : null
    };

    if (isEditing.value) {
      if (!editId.value) {
        throw new Error("Announcement ID is missing");
      }

      await updateDoc(editId.value, payload);
      toast.success("បានកែប្រែសេចក្តីជូនដំណឹងដោយជោគជ័យ");
    } else {
      await createDoc(payload);
      toast.success("បានបង្កើតសេចក្តីជូនដំណឹងដោយជោគជ័យ");
    }

    await fetchData();
    forceCloseModal();
  } catch (error) {
    toast.error(
      getErrorMessage(error, "មិនអាចរក្សាទុកសេចក្តីជូនដំណឹងបានទេ")
    );
  } finally {
    isSaving.value = false;
  }
};

const openDeleteModal = (item) => {
  if (!isAdmin.value) {
    toast.error("មានតែ admin ប៉ុណ្ណោះអាចលុបសេចក្តីជូនដំណឹងបាន");
    return;
  }

  announcementToDelete.value = item;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  if (isDeleting.value) return;

  showDeleteModal.value = false;
  announcementToDelete.value = null;
};

const forceCloseDeleteModal = () => {
  showDeleteModal.value = false;
  announcementToDelete.value = null;
};

const confirmDelete = async () => {
  if (!isAdmin.value) {
    toast.error("មានតែ admin ប៉ុណ្ណោះអាចលុបសេចក្តីជូនដំណឹងបាន");
    return;
  }

  if (!announcementToDelete.value?._id || isDeleting.value) return;

  const announcementTitle = announcementToDelete.value.title || "សេចក្តីជូនដំណឹង";

  isDeleting.value = true;

  try {
    await deleteDoc(announcementToDelete.value._id);
    toast.success(`បានលុប "${announcementTitle}" ដោយជោគជ័យ`);
    await fetchData();

    forceCloseDeleteModal();
  } catch (error) {
    toast.error(
      getErrorMessage(error, "មិនអាចលុបសេចក្តីជូនដំណឹងបានទេ")
    );
  } finally {
    isDeleting.value = false;
  }
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
  .announcements-page-mobile-safe {
    padding-bottom: calc(2.75rem + env(safe-area-inset-bottom));
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }

  .announcements-page-mobile-safe > .max-w-7xl {
    padding-bottom: calc(1.5rem + env(safe-area-inset-bottom));
  }

  .announcements-list-mobile-safe {
    padding-bottom: calc(1rem + env(safe-area-inset-bottom));
  }

  .announcements-list-mobile-safe > :last-child,
  .announcements-empty-mobile-safe {
    margin-bottom: calc(1.25rem + env(safe-area-inset-bottom));
  }

  .announcement-modal-overlay-mobile-safe {
    min-height: 100vh;
    min-height: 100dvh;
    align-items: flex-end;
    padding-bottom: calc(0.5rem + env(safe-area-inset-bottom));
  }

  .announcement-modal-panel-mobile-safe {
    max-height: calc(100vh - 0.75rem);
    max-height: calc(100dvh - 0.75rem);
  }

  .announcement-modal-body-mobile-safe {
    max-height: calc(100vh - 8.5rem);
    max-height: calc(100dvh - 8.5rem);
    -webkit-overflow-scrolling: touch;
  }

  .announcement-modal-footer-mobile-safe {
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
    padding: 0.44rem 0.6rem;
    font-size: 0.75rem;
    min-height: 2.25rem;
  }
}
</style>