import { ref } from "vue";
import api from "../config/api";

const users = ref([]);
const isLoading = ref(false);
const error = ref(null);
const totalPage = ref(1);
const totalUsers = ref(0);

export function useUsers() {
  // Get Users
  const findAllUser = async (params = {}) => {
    isLoading.value = true;
    error.value = null;

    try {
      const query = {
        search: params.search || "",
        page: params.page || 1,
        limit: Number(params.limit) || 10
      };

      // ✅ សំខាន់: ផ្ញើ role ទៅ backend ពេលមានតម្លៃ admin / teacher / user
      if (params.role) {
        query.role = params.role;
      }

      console.log("Final User Request Params:", query);

      const response = await api.get("/user", {
        params: query
      });

      console.log("Users Response:", response.data);

      users.value = response.data.result || [];
      totalPage.value = response.data.total || 1;
      totalUsers.value = response.data.totalUsers || users.value.length;

      console.log("Users:", users.value);

      return response.data;
    } catch (err) {
      error.value =
        err.response?.data?.err ||
        err.response?.data?.message ||
        "Failed to fetch users";

      console.error("findAllUser Error:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Create User
  const createUser = async (userData) => {
    isLoading.value = true;
    error.value = null;

    try {
      const payload = {
        username: String(userData.username || "").trim(),
        password: userData.password,
        role: userData.role || "user"
      };

      const response = await api.post("/user/signup", payload);

      console.log("Create User:", response.data);

      return response.data;
    } catch (err) {
      error.value =
        err.response?.data?.err ||
        err.response?.data?.message ||
        "Failed to create user";

      console.error("createUser Error:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Update User
  const updateUser = async (id, updatedData) => {
    isLoading.value = true;
    error.value = null;

    try {
      const payload = {
        username: String(updatedData.username || "").trim(),
        role: updatedData.role || "user"
      };

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
      error.value =
        err.response?.data?.err ||
        err.response?.data?.message ||
        "Failed to update user";

      console.error("updateUser Error:", err);
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
      console.log("Deleting User ID:", id);

      if (!id) {
        throw new Error("User ID is undefined");
      }

      const response = await api.delete(`/user/${id}`);

      users.value = users.value.filter((user) => user._id !== id);

      return response.data;
    } catch (err) {
      error.value =
        err.response?.data?.err ||
        err.response?.data?.message ||
        err.message ||
        "Failed to delete user";

      console.error("deleteUser Error:", err);
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
    findAllUser,
    createUser,
    updateUser,
    deleteUser
  };
}