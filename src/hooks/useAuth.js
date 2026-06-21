import { ref } from 'vue';
import api from '../config/api';

// --- Local Storage Helper Functions ---
const getToken = () => localStorage.getItem('token');
const saveToken = (newToken) => localStorage.setItem('token', newToken);
const removeToken = () => localStorage.removeItem('token');

const getUser = () => {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
};
const saveUser = (userData) => localStorage.setItem('user', JSON.stringify(userData));
const removeUser = () => localStorage.removeItem('user');


// --- Global Singleton State ---
const user = ref(getUser());
const token = ref(getToken());
const isLoading = ref(false);
const error = ref(null);


export function useAuth() {
  
  const login = async (username, password) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.post('/user/login', { username, password });
      
      // Update global states and localStorage references
      token.value = response.data.token;
      saveToken(token.value);
      
      // Immediately fetch the user's full profile profile context
      await fetchProfile();
      
    } catch (err) {
      error.value = err.response?.data?.err || 'Login failed';
      throw err; 
    } finally {
      isLoading.value = false;
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      
      // FIX: Map directly to the 'result' key sent by your backend controller
      user.value = response.data.result;
      saveUser(user.value);

    } catch (err) {
      console.error("Profile validation failed. Clearing context tokens.", err);
      // If the token is invalid or expired, forcefully scrub local states
      logout(); 
    }
  };

  const logout = async () => {
    try {
        // Optional backend sync signature
        await api.post('/user/logout'); 
    } catch (err) {
        console.error("Error during server session invalidation:", err);
    } finally {
        // Absolute local cleanup regardless of network status
        user.value = null;
        token.value = null;
        
        removeToken();
        removeUser();
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

    // Storage Utilities
    getToken,
    saveToken,
    removeToken,
    getUser,
    saveUser,
    removeUser
  };
}