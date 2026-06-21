import { ref } from "vue";
import api from "../config/api";

const users = ref([]);
const isLoading = ref(false);
const error = ref(null);
const totalPage = ref(1);

export function useUsers() {

  // Get Users
  const findAllUser = async (params = {}) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.get("/user", {
        params: {
          search: params.search || "",
          page: params.page || 1,
          limit: params.limit || 10,
        },
      });

      console.log("Users Response:", response.data);

      // Backend response:
      // {
      //   msg: "Get",
      //   total: 5,
      //   result: [...]
      // }

      users.value = response.data.result || [];
      totalPage.value = response.data.total || 1;

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
      const response = await api.post("/user/signup", userData);

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
      const response = await api.patch(`/user/${id}`, updatedData);

      const index = users.value.findIndex(
        user => user._id === id
      );

      if (index !== -1) {
        users.value[index] = {
          ...users.value[index],
          ...response.data.result,
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

      users.value = users.value.filter(
        user => user._id !== id
      );

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
    findAllUser,
    createUser,
    updateUser,
    deleteUser,
  };
}