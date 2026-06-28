import { ref } from "vue";
import api from "../config/api";
import { useToast } from "vue-toastification";

const endpointMap = {
  users: "/user",
  user: "/user",

  classes: "/classes",
  class: "/classes",

  students: "/students",
  student: "/students",

  teachers: "/teachers",
  teacher: "/teachers",

  subjects: "/subjects",
  subject: "/subjects",

  schedules: "/schedules",
  schedule: "/schedules",

  scores: "/scores",
  score: "/scores",

  attendances: "/attendance",
  attendance: "/attendance",

  attendanceReport: "/attendance/report",
  attendance_report: "/attendance/report",

  payments: "/payments",
  payment: "/payments",

  announcements: "/announcements",
  announcement: "/announcements"
};

const resolveEndpoint = (collectionName) => {
  return endpointMap[collectionName] || `/${collectionName}`;
};

const getErrorMessage = (err, fallback = "មានបញ្ហាក្នុងប្រព័ន្ធ") => {
  return (
    err.response?.data?.err ||
    err.response?.data?.message ||
    err.message ||
    fallback
  );
};

export function useCollection(collectionName, options = {}) {
  const loading = ref(false);
  const isLoading = loading;
  const error = ref(null);
  const toast = useToast();

  const endpoint = resolveEndpoint(collectionName);

  const showSuccessToast = (message) => {
    if (options.toast === false) return;
    if (!message) return;

    toast.success(message);
  };

  const showErrorToast = (message) => {
    if (options.toast === false) return;
    if (!message) return;

    toast.error(message);
  };

  // ✅ Get one document
  const getOneDoc = async (id, params = {}) => {
    loading.value = true;
    error.value = null;

    try {
      if (!id) {
        throw new Error("ID is required");
      }

      const response = await api.get(`${endpoint}/${id}`, {
        params
      });

      return response.data;
    } catch (err) {
      const message = getErrorMessage(err, "មិនអាចទាញយកទិន្នន័យបានទេ");
      error.value = message;
      showErrorToast(message);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // ✅ Create new document
  const createDoc = async (data, config = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post(endpoint, data, config);

      showSuccessToast(options.createSuccessMessage);

      return response.data;
    } catch (err) {
      const message = getErrorMessage(err, "មិនអាចបង្កើតទិន្នន័យបានទេ");
      error.value = message;
      showErrorToast(message);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // ✅ Update existing document
  const updateDoc = async (id, data, config = {}) => {
    loading.value = true;
    error.value = null;

    try {
      if (!id) {
        throw new Error("ID is required");
      }

      const response = await api.patch(`${endpoint}/${id}`, data, config);

      showSuccessToast(options.updateSuccessMessage);

      return response.data;
    } catch (err) {
      const message = getErrorMessage(err, "មិនអាចកែប្រែទិន្នន័យបានទេ");
      error.value = message;
      showErrorToast(message);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // ✅ Delete document
  const deleteDoc = async (id, config = {}) => {
    loading.value = true;
    error.value = null;

    try {
      if (!id) {
        throw new Error("ID is required");
      }

      const response = await api.delete(`${endpoint}/${id}`, config);

      showSuccessToast(options.deleteSuccessMessage);

      return response.data;
    } catch (err) {
      const message = getErrorMessage(err, "មិនអាចលុបទិន្នន័យបានទេ");
      error.value = message;
      showErrorToast(message);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    createDoc,
    updateDoc,
    deleteDoc,
    getOneDoc,

    loading,
    isLoading,
    error
  };
}