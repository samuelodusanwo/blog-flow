import axios from 'axios';

// Create axios instance with base configuration
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend URL
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add auth token to requests
API.interceptors.request.use(
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

// Response interceptor to handle common errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => API.post('/auth/register', userData),
  login: (credentials) => API.post('/auth/login', credentials),
  getMe: () => API.get('/auth/me'),
  updateProfile: (userData) => API.put('/auth/updatedetails', userData),
  updatePassword: (passwordData) => API.put('/auth/updatepassword', passwordData),
};

// Posts API calls
export const postsAPI = {
  getAll: (params = {}) => API.get('/posts', { params }),
  getById: (id) => API.get(`/posts/${id}`),
  create: (postData) => API.post('/posts', postData),
  update: (id, postData) => API.put(`/posts/${id}`, postData),
  delete: (id) => API.delete(`/posts/${id}`),
  getByCategory: (categoryId) => API.get(`/posts/category/${categoryId}`),
};

// Categories API calls
export const categoriesAPI = {
  getAll: () => API.get('/categories'),
  getById: (id) => API.get(`/categories/${id}`),
  create: (categoryData) => API.post('/categories', categoryData),
  update: (id, categoryData) => API.put(`/categories/${id}`, categoryData),
  delete: (id) => API.delete(`/categories/${id}`),
};

export default API;