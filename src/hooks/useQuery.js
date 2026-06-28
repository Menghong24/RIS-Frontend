import { ref, onMounted } from "vue";
import api from "../config/api";

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

const normalizeResponseData = (responseData) => {
  if (Array.isArray(responseData)) {
    return responseData;
  }

  if (Array.isArray(responseData?.result)) {
    return responseData.result;
  }

  if (Array.isArray(responseData?.data)) {
    return responseData.data;
  }

  return responseData || [];
};

const getErrorMessage = (err, fallback = "Failed to fetch data") => {
  return (
    err.response?.data?.err ||
    err.response?.data?.message ||
    err.message ||
    fallback
  );
};

export function useQuery(collectionName, options = {}) {
  const data = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  const endpoint = resolveEndpoint(collectionName);

  const fetchData = async (params = options.params || {}) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.get(endpoint, {
        params
      });

      data.value = normalizeResponseData(response.data);

      return response.data;
    } catch (err) {
      error.value = getErrorMessage(err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const refetch = async (params = options.params || {}) => {
    return fetchData(params);
  };

  if (options.immediate !== false) {
    onMounted(() => {
      fetchData();
    });
  }

  return {
    data,
    isLoading,
    error,
    fetchData,
    refetch
  };
}