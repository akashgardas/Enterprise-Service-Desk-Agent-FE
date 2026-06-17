import axios from 'axios';
import { USE_MOCK } from '../config/constants';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Helper to simulate API delay for mock data
 * @param {any} data - Data to return
 * @param {number} delay - Delay in ms
 * @returns {Promise<any>}
 */
export const mockResponse = (data, delay = 800) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data });
    }, delay);
  });
};

export default api;
