import { ref } from "vue";
import api from "../config/api";

const users = ref([]);
const isLoading = ref(false);
const error = ref(null);
const totalPage = ref(1);
const totalUsers = ref(0);
const lastQuery = ref({});

const allowedRoles = ["admin", "teacher", "user"];

const isValidRole = (role) => {
  return allowedRoles.includes(String(role || "").trim().toLowerCase());
};

const normalizeRole = (role) => {
  const value = String(role || "user").trim().toLowerCase();
  return isValidRole(value) ? value : "user";
};

const normalizeUsername = (username) => {
  return String(username || "").trim().toLowerCase();
};

const getErrorMessage = (err, fallback = "មានបញ្ហាក្នុងប្រព័ន្ធ") => {
  return (
    err.response?.data?.err ||
    err.response?.data?.message ||
    err.message ||
    fallback
  );
};

const buildUserPayload = (userData = {}, includePassword = false) => {
  const role = normalizeRole(userData.role);

  const payload = {
    username: normalizeUsername(userData.username),
    role
  };

  if (includePassword) {
    payload.password = userData.password;
  }

  payload.teacher = role === "teacher" ? userData.teacher || null : null;

  return payload;
};

export function useUsers() {
  const resetUsersState = () => {
    users.value = [];
    isLoading.value = false;
    error.value = null;
    totalPage.value = 1;
    totalUsers.value = 0;
    lastQuery.value = {};
  };

  // Get Users
  const findAllUser = async (params = {}) => {
    isLoading.value = true;
    error.value = null;

    try {
      const query = {
        search: String(params.search || "").trim(),
        page: Math.max(Number(params.page) || 1, 1),
        limit: Math.max(Number(params.limit) || 10, 1)
      };

      if (isValidRole(params.role)) {
        query.role = normalizeRole(params.role);
      }

      lastQuery.value = { ...query };

      const response = await api.get("/user", {
        params: query
      });

      users.value = Array.isArray(response.data.result)
        ? response.data.result
        : [];

      totalPage.value = response.data.total || 1;
      totalUsers.value = response.data.totalUsers || users.value.length;

      return response.data;
    } catch (err) {
      error.value = getErrorMessage(err, "មិនអាចទាញយកអ្នកប្រើប្រាស់បានទេ");
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const refreshUsers = async () => {
    return findAllUser(lastQuery.value);
  };

  // Create User
  const createUser = async (userData = {}) => {
    isLoading.value = true;
    error.value = null;

    try {
      const payload = buildUserPayload(userData, true);

      if (!payload.username) {
        throw new Error("សូមបញ្ចូលឈ្មោះអ្នកប្រើប្រាស់");
      }

      if (!payload.password) {
        throw new Error("សូមបញ្ចូលពាក្យសម្ងាត់");
      }

      if (payload.role === "teacher" && !payload.teacher) {
        throw new Error("សូមជ្រើស Teacher profile សម្រាប់គណនីគ្រូ");
      }

      const response = await api.post("/user/signup", payload);

      return response.data;
    } catch (err) {
      error.value = getErrorMessage(err, "មិនអាចបង្កើតគណនីបានទេ");
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Update User
  const updateUser = async (id, updatedData = {}) => {
    isLoading.value = true;
    error.value = null;

    try {
      if (!id) {
        throw new Error("User ID is undefined");
      }

      const payload = buildUserPayload(updatedData, false);

      if (!payload.username) {
        throw new Error("សូមបញ្ចូលឈ្មោះអ្នកប្រើប្រាស់");
      }

      if (payload.role === "teacher" && !payload.teacher) {
        throw new Error("សូមជ្រើស Teacher profile សម្រាប់គណនីគ្រូ");
      }

      const response = await api.patch(`/user/${id}`, payload);

      const index = users.value.findIndex((user) => user._id === id);

      if (index !== -1) {
        users.value[index] = {
          ...users.value[index],
          ...response.data.result
        };
      }

      return response.data;
    } catch (err) {
      error.value = getErrorMessage(err, "មិនអាចកែប្រែគណនីបានទេ");
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Delete User
  const deleteUser = async (id) => {
    isLoading.value = true;
    error.value = null;

    try {
      if (!id) {
        throw new Error("User ID is undefined");
      }

      const response = await api.delete(`/user/${id}`);

      users.value = users.value.filter((user) => user._id !== id);

      return response.data;
    } catch (err) {
      error.value = getErrorMessage(err, "មិនអាចលុបគណនីបានទេ");
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    users,
    isLoading,
    error,
    totalPage,
    totalUsers,
    lastQuery,

    findAllUser,
    refreshUsers,
    createUser,
    updateUser,
    deleteUser,
    resetUsersState
  };
}