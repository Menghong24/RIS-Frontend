<template>
  <div
    ref="paperRef"
    class="paper"
    :class="rowDensityClass"
  >
    <!-- Header -->
    <div class="header">
      <div class="logo-wrap">
        <img
          v-if="logoUrl"
          :src="logoUrl"
          class="logo"
          alt="School Logo"
        />

        <div
          v-else
          class="logo-placeholder"
        >
          RIS
        </div>
      </div>

      <div class="title-wrap">
        <h2>ព្រះរាជាណាចក្រកម្ពុជា</h2>
        <h3>ជាតិ សាសនា ព្រះមហាក្សត្រ</h3>
        <h1>របាយការណ៍វត្តមានសិស្ស</h1>

        <p>
          ថ្នាក់រៀន៖ <strong>{{ className || "............" }}</strong>
        </p>

        <p>
          ប្រចាំ៖ <strong>{{ periodLabel || "............" }}</strong>
          &nbsp;&nbsp;
          សិស្ស៖ <strong>{{ studentLabel || "សិស្សទាំងអស់" }}</strong>
        </p>
      </div>

      <div></div>
    </div>

    <div class="info-row">
      <span>បានបង្កើតនៅ៖ {{ exportedAtLabel || "-" }}</span>
      <span>ចំនួនសិស្ស៖ {{ formatKhmerNumber(realRows.length) }} នាក់</span>
    </div>

    <!-- Report Table -->
    <table class="report-table">
      <thead>
        <tr>
          <th class="no-col">
            <span class="cell-text">ល.រ</span>
          </th>

          <th class="name-col">
            <span class="cell-text">ឈ្មោះសិស្ស</span>
          </th>

          <th class="gender-col">
            <span class="cell-text">ភេទ</span>
          </th>

          <th class="num-col present-text">
            <span class="cell-text">វត្តមាន</span>
          </th>

          <th class="num-col late-text">
            <span class="cell-text">យឺត</span>
          </th>

          <th class="num-col permission-text">
            <span class="cell-text">ច្បាប់</span>
          </th>

          <th class="num-col absent-text">
            <span class="cell-text">អវត្តមាន</span>
          </th>

          <th class="total-col">
            <span class="cell-text">សរុបថ្ងៃ</span>
          </th>

          <th class="percent-col">
            <span class="cell-text">ភាគរយ</span>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(row, index) in realRows"
          :key="row?.student?._id || index"
        >
          <td class="no-col">
            <span class="cell-text">
              {{ formatKhmerNumber(index + 1) }}
            </span>
          </td>

          <td class="name-col">
            <span class="cell-text">
              {{ row?.student?.khmerName || "-" }}
            </span>
          </td>

          <td class="gender-col">
            <span class="cell-text">
              {{ row?.student?.gender || "-" }}
            </span>
          </td>

          <td class="num-col present-text">
            <span class="cell-text">
              {{ getNumberCell(row?.present) }}
            </span>
          </td>

          <td class="num-col late-text">
            <span class="cell-text">
              {{ getNumberCell(row?.late) }}
            </span>
          </td>

          <td class="num-col permission-text">
            <span class="cell-text">
              {{ getNumberCell(row?.permission) }}
            </span>
          </td>

          <td class="num-col absent-text">
            <span class="cell-text">
              {{ getNumberCell(row?.absent) }}
            </span>
          </td>

          <td class="total-col">
            <span class="cell-text">
              {{ getNumberCell(row?.totalDays) }}
            </span>
          </td>

          <td class="percent-col percent-text">
            <span class="cell-text">
              {{ formatKhmerNumber(calculatePercentage(row?.present, row?.totalDays)) }}%
            </span>
          </td>
        </tr>
      </tbody>

      <tfoot v-if="realRows.length > 0">
        <tr>
          <td
            colspan="3"
            class="total-label"
          >
            <span class="cell-text">សរុប</span>
          </td>

          <td class="present-text">
            <span class="cell-text">
              {{ formatKhmerNumber(summary.present) }}
            </span>
          </td>

          <td class="late-text">
            <span class="cell-text">
              {{ formatKhmerNumber(summary.late) }}
            </span>
          </td>

          <td class="permission-text">
            <span class="cell-text">
              {{ formatKhmerNumber(summary.permission) }}
            </span>
          </td>

          <td class="absent-text">
            <span class="cell-text">
              {{ formatKhmerNumber(summary.absent) }}
            </span>
          </td>

          <td>
            <span class="cell-text">
              {{ formatKhmerNumber(summary.totalDays) }}
            </span>
          </td>

          <td class="percent-text">
            <span class="cell-text">
              {{ formatKhmerNumber(summary.averagePercentage) }}%
            </span>
          </td>
        </tr>
      </tfoot>
    </table>

    <div class="summary-box">
      <p>
        វត្តមានសរុប៖ <strong>{{ formatKhmerNumber(summary.present) }}</strong>
        &nbsp;&nbsp;
        យឺត៖ <strong>{{ formatKhmerNumber(summary.late) }}</strong>
        &nbsp;&nbsp;
        ច្បាប់៖ <strong>{{ formatKhmerNumber(summary.permission) }}</strong>
        &nbsp;&nbsp;
        អវត្តមាន៖ <strong>{{ formatKhmerNumber(summary.absent) }}</strong>
      </p>
    </div>

    <div class="signature-area">
      <div class="signature-box">
        <p class="bold">បានឃើញ និងឯកភាព</p>
        <p class="bold">នាយកសាលា</p>

        <div class="signature-space"></div>

        <p class="bold">ឈ្មោះ ........................</p>
      </div>

      <div class="signature-box">
        <p>
          ធ្វើនៅ ............ ថ្ងៃទី ............ ខែ ............
          ឆ្នាំ {{ currentYearKhmer }}
        </p>

        <p class="bold">អ្នករៀបចំរបាយការណ៍</p>

        <div class="signature-space"></div>

        <p class="bold">ឈ្មោះ ........................</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  reportData: {
    type: Array,
    default: () => []
  },
  className: {
    type: String,
    default: ""
  },
  periodLabel: {
    type: String,
    default: ""
  },
  studentLabel: {
    type: String,
    default: "សិស្សទាំងអស់"
  },
  exportedAtLabel: {
    type: String,
    default: ""
  },
  logoUrl: {
    type: String,
    default: ""
  }
});

const paperRef = ref(null);

const khmerDigits = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];

const realRows = computed(() => {
  return Array.isArray(props.reportData) ? props.reportData : [];
});

const rowDensityClass = computed(() => {
  const count = realRows.value.length;

  if (count <= 25) return "normal-density";
  if (count <= 35) return "compact-density";
  if (count <= 45) return "dense-density";
  return "super-dense-density";
});

const currentYearKhmer = computed(() => {
  return formatKhmerNumber(new Date().getFullYear());
});

const summary = computed(() => {
  const total = realRows.value.reduce(
    (acc, row) => {
      acc.present += Number(row.present || 0);
      acc.late += Number(row.late || 0);
      acc.permission += Number(row.permission || 0);
      acc.absent += Number(row.absent || 0);
      acc.totalDays += Number(row.totalDays || 0);
      return acc;
    },
    {
      present: 0,
      late: 0,
      permission: 0,
      absent: 0,
      totalDays: 0
    }
  );

  const averagePercentage =
    total.totalDays > 0
      ? ((total.present / total.totalDays) * 100).toFixed(1)
      : "0.0";

  return {
    ...total,
    averagePercentage
  };
});

const formatKhmerNumber = (value) => {
  if (value === undefined || value === null || value === "") return "";

  return String(value).replace(/[0-9]/g, (digit) => {
    return khmerDigits[Number(digit)];
  });
};

const getNumberCell = (value) => {
  if (value === undefined || value === null || value === "") return "០";
  return formatKhmerNumber(Number(value));
};

const calculatePercentage = (present, total) => {
  if (!total) return "0.0";
  return ((Number(present || 0) / Number(total || 0)) * 100).toFixed(1);
};

defineExpose({
  getElement: () => paperRef.value
});
</script>

<style scoped>
.paper {
  width: 794px;
  height: 1123px;
  box-sizing: border-box;
  padding: 22px 22px 16px;
  overflow: hidden;
  background-color: rgb(255, 255, 255);
  color: rgb(0, 0, 0);
  font-family: "Khmer OS Battambang", "Noto Sans Khmer", Arial, sans-serif;
}

/* Header */
.header {
  display: grid;
  grid-template-columns: 100px 1fr 100px;
  align-items: start;
  margin-bottom: 6px;
}

.logo-wrap {
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.logo {
  width: 78px;
  height: 78px;
  object-fit: contain;
}

.logo-placeholder {
  width: 76px;
  height: 76px;
  border-radius: 999px;
  border: 3px solid rgb(245, 158, 11);
  color: rgb(30, 64, 175);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 900;
}

.title-wrap {
  text-align: center;
}

.title-wrap h2 {
  margin: 0;
  font-size: 20px;
  line-height: 1.12;
  font-weight: 900;
}

.title-wrap h3 {
  margin: 2px 0 0;
  font-size: 16px;
  line-height: 1.12;
  font-weight: 900;
}

.title-wrap h1 {
  margin: 6px 0 3px;
  font-size: 19px;
  line-height: 1.12;
  font-weight: 900;
}

.title-wrap p {
  margin: 1px 0;
  font-size: 11px;
  line-height: 1.25;
  font-weight: 700;
}

/* Info */
.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 10px;
  color: rgb(71, 85, 105);
}

/* Table */
.report-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  font-size: 10.5px;
  color: rgb(0, 0, 0);
}

.report-table th,
.report-table td {
  border: 1px solid rgb(80, 80, 80);
  padding: 0;
  height: 22px;
  line-height: 1;
  vertical-align: middle;
  text-align: center;
  background-color: rgb(255, 255, 255);
  color: rgb(0, 0, 0);
}

.report-table th {
  height: 27px;
  font-weight: 900;
  background-color: rgb(241, 245, 249);
  white-space: nowrap;
}

.cell-text {
  width: 100%;
  height: 100%;
  min-height: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  padding-top: 1px;
  box-sizing: border-box;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
}

.no-col {
  width: 34px;
}

.name-col {
  width: 210px;
  font-weight: 800;
}

.gender-col {
  width: 38px;
}

.num-col {
  width: 55px;
}

.total-col {
  width: 58px;
}

.percent-col {
  width: 58px;
}

.total-label {
  font-weight: 900;
}

.report-table tfoot td {
  height: 27px;
  font-weight: 900;
  background-color: rgb(241, 245, 249);
}

/* Colors: RGB only for html2canvas */
.present-text {
  color: rgb(21, 128, 61) !important;
  font-weight: 900;
}

.late-text {
  color: rgb(194, 65, 12) !important;
  font-weight: 900;
}

.permission-text {
  color: rgb(161, 98, 7) !important;
  font-weight: 900;
}

.absent-text {
  color: rgb(220, 38, 38) !important;
  font-weight: 900;
}

.percent-text {
  color: rgb(37, 99, 235) !important;
  font-weight: 900;
}

/* Summary */
.summary-box {
  margin-top: 7px;
  padding: 5px 8px;
  border: 1px solid rgb(203, 213, 225);
  background-color: rgb(248, 250, 252);
  font-size: 10.5px;
  line-height: 1.4;
  text-align: center;
}

.summary-box p {
  margin: 0;
}

/* Signature */
.signature-area {
  margin-top: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  font-size: 11.5px;
  line-height: 1.35;
}

.signature-box {
  text-align: center;
}

.signature-box p {
  margin: 1px 0;
}

.bold {
  font-weight: 900;
}

.signature-space {
  height: 45px;
}

/* Compact modes: keep one A4 page */
.compact-density {
  padding: 18px 20px 14px;
}

.compact-density .logo {
  width: 68px;
  height: 68px;
}

.compact-density .logo-placeholder {
  width: 66px;
  height: 66px;
  font-size: 18px;
}

.compact-density .title-wrap h2 {
  font-size: 18px;
}

.compact-density .title-wrap h3 {
  font-size: 15px;
}

.compact-density .title-wrap h1 {
  font-size: 17px;
  margin-top: 4px;
}

.compact-density .title-wrap p {
  font-size: 10px;
}

.compact-density .report-table {
  font-size: 9.5px;
}

.compact-density .report-table th,
.compact-density .report-table td {
  height: 19px;
  padding: 0;
  line-height: 1;
}

.compact-density .cell-text {
  line-height: 1;
  padding-top: 1px;
}

.compact-density .summary-box {
  font-size: 9.5px;
  text-align: center;
}

.compact-density .signature-area {
  margin-top: 8px;
  font-size: 10px;
}

.compact-density .signature-space {
  height: 34px;
}

.dense-density {
  padding: 14px 18px 12px;
}

.dense-density .header {
  grid-template-columns: 78px 1fr 78px;
  margin-bottom: 4px;
}

.dense-density .logo {
  width: 58px;
  height: 58px;
}

.dense-density .logo-placeholder {
  width: 56px;
  height: 56px;
  font-size: 16px;
}

.dense-density .title-wrap h2 {
  font-size: 16px;
}

.dense-density .title-wrap h3 {
  font-size: 13px;
}

.dense-density .title-wrap h1 {
  font-size: 15px;
  margin-top: 3px;
}

.dense-density .title-wrap p {
  font-size: 9px;
}

.dense-density .info-row {
  font-size: 8.5px;
}

.dense-density .report-table {
  font-size: 8.4px;
}

.dense-density .report-table th,
.dense-density .report-table td {
  height: 16px;
  padding: 0;
  line-height: 1;
}

.dense-density .report-table th {
  height: 21px;
}

.dense-density .cell-text {
  line-height: 1;
  padding-top: 1px;
}

.dense-density .summary-box {
  margin-top: 5px;
  padding: 4px 6px;
  font-size: 8.8px;
  text-align: center;
}

.dense-density .signature-area {
  margin-top: 7px;
  font-size: 9px;
}

.dense-density .signature-space {
  height: 28px;
}

.super-dense-density {
  padding: 10px 14px 8px;
}

.super-dense-density .header {
  grid-template-columns: 64px 1fr 64px;
  margin-bottom: 3px;
}

.super-dense-density .logo {
  width: 46px;
  height: 46px;
}

.super-dense-density .logo-placeholder {
  width: 44px;
  height: 44px;
  font-size: 13px;
}

.super-dense-density .title-wrap h2 {
  font-size: 14px;
}

.super-dense-density .title-wrap h3 {
  font-size: 11px;
}

.super-dense-density .title-wrap h1 {
  font-size: 13px;
  margin-top: 2px;
}

.super-dense-density .title-wrap p {
  font-size: 8px;
}

.super-dense-density .info-row {
  font-size: 7.5px;
  margin-bottom: 3px;
}

.super-dense-density .report-table {
  font-size: 7.4px;
}

.super-dense-density .report-table th,
.super-dense-density .report-table td {
  height: 13px;
  padding: 0;
  line-height: 1;
}

.super-dense-density .report-table th {
  height: 18px;
}

.super-dense-density .cell-text {
  line-height: 1;
  padding-top: 1px;
}

.super-dense-density .summary-box {
  margin-top: 4px;
  padding: 3px 5px;
  font-size: 7.8px;
  text-align: center;
}

.super-dense-density .signature-area {
  margin-top: 5px;
  font-size: 8px;
}

.super-dense-density .signature-space {
  height: 20px;
}
</style>