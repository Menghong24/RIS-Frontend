import { ref } from "vue";
import api from "../config/api";
import { useToast } from "vue-toastification"; // ហៅប្រើប្រាស់ Toast ដូច useCollection

export function useAttendance() {
  const attendance = ref([]); // ទុកសម្រាប់ផ្ទុក records សិស្ស
  const mode = ref("create");  // ទុកសម្រាប់ដឹងថាជាទម្រង់បង្កើតថ្មី ឬកែប្រែ ("create" ឬ "edit")
  const loading = ref(false);
  const error = ref(null);
  const toast = useToast();

  // ==========================
  // GET Attendance
  // ==========================
  // បន្ថែម session (លំនាំដើមគឺ "morning") ដើម្បីឱ្យត្រូវនឹង Unique Index របស់ Backend
  const getAttendance = async (classId, date, session = "morning") => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.get("/attendance", {
        params: {
          classId,
          date,
          session, // បញ្ជូន session ទៅកាន់ backend ផងដែរ
        },
      });

      // បំបែកទិន្នន័យយកមកលាក់ក្នុង Ref នីមួយៗឱ្យងាយស្រួលប្រើក្នុង UI
      attendance.value = response.data.data?.records || [];
      mode.value = response.data.mode || "create";
    } catch (err) {
      console.error(err);
      error.value = err.response?.data?.message || err.message;
      toast.error(error.value);
    } finally {
      loading.value = false;
    }
  };

  // ==========================
  // SAVE Attendance
  // ==========================
  const saveAttendance = async (payload) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post("/attendance", payload);

      // រក្សាទុកទិន្នន័យថ្មីដែលបានមកពី Backend
      attendance.value = response.data.data?.records || [];
      mode.value = "edit"; // ក្រោយរក្សាទុករួច ស្ថានភាពនឹងក្លាយជា Edit Mode វិញ

      toast.success(response.data.message || "រក្សាទុកវត្តមានជោគជ័យដឹង!");
      return response.data;
    } catch (err) {
      console.error(err);
      error.value = err.response?.data?.message || err.message;
      toast.error(error.value || "មានបញ្ហាក្នុងការរក្សាទុកវត្តមាន!");
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    attendance,
    mode,
    loading,
    error,
    getAttendance,
    saveAttendance,
  };
}