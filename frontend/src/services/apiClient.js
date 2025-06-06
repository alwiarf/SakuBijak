import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:6543';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Menambahkan token ke header Authorization untuk setiap request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Ambil token dari localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor (opsional, untuk penanganan error global)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized access - 401. Token might be invalid or expired.');
    }
    return Promise.reject(error);
  }
);

export default apiClient;