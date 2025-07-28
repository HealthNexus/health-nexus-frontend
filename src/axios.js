// src/axios.js
import axios from 'axios';

// Create an instance of axios
const axiosInstance = axios.create({
  baseURL: 'https://081e984f29ba.ngrok-free.app', // Replace with your Laravel backend URL
  withCredentials: false // Don't send cookies, we use Bearer tokens
});

// Add a request interceptor to include the token in the Authorization header
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Add ngrok headers to bypass browser warning for programmatic requests
  config.headers['ngrok-skip-browser-warning'] = 'true';
  
  return config;
}, error => {
  return Promise.reject(error);
});

export default axiosInstance;
