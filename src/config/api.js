import axios from 'axios';

const api = axios.create({
  baseURL: 'http://217.217.252.140:3000',// 'http://localhost:3000',//
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==============================
// 🔐 REQUEST INTERCEPTOR
// ==============================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==============================
// 🚨 RESPONSE INTERCEPTOR (IMPORTANT)
// ==============================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // ❌ Unauthorized → auto logout
    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // force redirect to login
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;