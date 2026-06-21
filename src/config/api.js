import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',//'https://school-api-4k69.onrender.com', // Adjust to match your Express server port
  headers: {
    'Content-Type': 'application/json',
  }
});

// Automatically attach the JWT token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;