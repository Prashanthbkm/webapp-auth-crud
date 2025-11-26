import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => 
    api.post('/login', { email, password }),
  
  register: (name, email, password) => 
    api.post('/register', { name, email, password }),
  
  getProfile: () => 
    api.get('/profile')
};

export const tasksAPI = {
  getAll: () => 
    api.get('/tasks'),
  
  create: (title, status = 'pending') => 
    api.post('/tasks', { title, status }),
  
  update: (id, updates) => 
    api.put(`/tasks/${id}`, updates),
  
  delete: (id) => 
    api.delete(`/tasks/${id}`)
};

export default api;