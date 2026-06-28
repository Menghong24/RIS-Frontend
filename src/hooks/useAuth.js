import { ref } from "vue";
import api from "../config/api";

// --- Local Storage Helper Functions ---
const getToken = () => localStorage.getItem("token");

const saveToken = (newToken) => {
  localStorage.setItem("token", newToken);
};

const removeToken = () => {
  localStorage.removeItem("token");
};

const getUser = () => {
  const storedUser = localStorage.getItem("user");

  if (
    !storedUser ||
    storedUser === "undefined" ||
    storedUser === "null"
  ) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    localStorage.removeItem("user");
    return null;
  }
};

const saveUser = (userData) => {
  localStorage.setItem("user", JSON.stringify(userData));
};

const removeUser = () => {
  localStorage.removeItem("user");
};

const clearAuthState = () => {
  user.value = null;
  token.value = null;

  removeToken();
  removeUser();
};

const getApiOrigin = () => {
  const baseURL = api.defaults?.baseURL || import.meta.env.VITE_API_URL || "";

  if (!baseURL || baseURL === "/api") {
    return window.location.origin;
  }

  if (baseURL.startsWith("http")) {
    return baseURL.replace(/\/api\/?$/, "").replace(/\/$/, "");
  }

  return window.location.origin;
};

// --- Global Singleton State ---
const user = ref(getUser());
const token = ref(getToken());
const isLoading = ref(false);
const error = ref(null);

export function useAuth() {
  const getProfileImageUrl = (profileImage = user.value?.profileImage) => {
    if (!profileImage) return "";

    if (profileImage.startsWith("http://") || profileImage.startsWith("https://")) {
      return profileImage;
    }

    return `${getApiOrigin()}${profileImage}`;
  };

  const fetchProfile = async () => {
    try {
      const response = await api.get("/user/profile");

      user.value = response.data.result;
      saveUser(user.value);

      return response.data;
    } catch (err) {
      const status = err.response?.status;

      if (status === 401 || status === 403) {
        clearAuthState();
      }

      error.value =
        err.response?.data?.err ||
        err.message ||
        "Profile validation failed";

      throw err;
    }
  };

  const login = async (username, password) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.post("/user/login", {
        username,
        password
      });

      token.value = response.data.token;
      saveToken(token.value);

      await fetchProfile();

      return response.data;
    } catch (err) {
      error.value = err.response?.data?.err || "Login failed";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    try {
      await api.post("/user/logout");
    } catch (err) {
      // Ignore backend logout error; frontend must clear local session
    } finally {
      clearAuthState();
    }
  };

  const updateProfileImage = async (file) => {
    isLoading.value = true;
    error.value = null;

    try {
      if (!file) {
        throw new Error("សូមជ្រើសរូបភាព");
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

      if (!allowedTypes.includes(file.type)) {
        throw new Error("សូមជ្រើសរូបភាពប្រភេទ JPG, PNG ឬ WEBP ប៉ុណ្ណោះ");
      }

      if (file.size > 2 * 1024 * 1024) {
        throw new Error("រូបភាពមិនអាចលើស 2MB បានទេ");
      }

      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await api.patch("/user/profile-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      user.value = response.data.result;
      saveUser(user.value);

      return response.data;
    } catch (err) {
      error.value =
        err.response?.data?.err ||
        err.message ||
        "មិនអាចប្ដូររូប Profile បានទេ";

      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const removeProfileImage = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.delete("/user/profile-image");

      user.value = response.data.result;
      saveUser(user.value);

      return response.data;
    } catch (err) {
      error.value =
        err.response?.data?.err ||
        err.message ||
        "មិនអាចលុបរូប Profile បានទេ";

      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    // Global State Elements
    user,
    token,
    isLoading,
    error,

    // Auth Mechanics
    login,
    logout,
    fetchProfile,

    // Profile Image
    updateProfileImage,
    removeProfileImage,
    getProfileImageUrl,

    // Storage Utilities
    getToken,
    saveToken,
    removeToken,
    getUser,
    saveUser,
    removeUser,
    clearAuthState
  };
}