import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('agrismart_token');
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
      // Token expired or invalid
      // localStorage.removeItem('agrismart_token');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateFavorites: (data) => api.put('/auth/favorites', data),
  forgotCheck: (data) => api.post('/auth/forgot-password-check', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

export const priceAPI = {
  getPrices: (params) => api.get('/prices', { params }),
  comparePrices: (crop) => api.get('/prices/compare', { params: { crop } }),
  getHistory: (params) => api.get('/prices/history', { params }),
  getSummary: () => api.get('/prices/summary'),
  getMeta: () => api.get('/prices/meta'),
  createPrice: (data) => api.post('/prices', data),
  updatePrice: (id, data) => api.put(`/prices/${id}`, data),
  deletePrice: (id) => api.delete(`/prices/${id}`),
};

export const weatherAPI = {
  getWeather: (city) => api.get('/weather', { params: { city } }),
};

export const notificationAPI = {
  getNotifications: (params) => api.get('/notifications', { params }),
  createNotification: (data) => api.post('/notifications', data),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

export default api;
