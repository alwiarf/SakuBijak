// Konfigurasi instance Axios untuk berinteraksi dengan API backend SakuBijak.

import axios from 'axios';

// Base URL untuk API backend Anda.
// Ganti dengan URL backend Anda yang sebenarnya jika berbeda.
// Contoh: 'http://localhost:6543/api' jika semua endpoint API Anda diawali dengan /api
// atau 'http://localhost:6543' jika endpoint yang Anda berikan sudah lengkap.
// Berdasarkan endpoint yang Anda berikan (misal: /api/auth/login),
// maka baseURL sebaiknya adalah alamat server backend Anda.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:6543'; // Default ke port Pyramid

// Membuat instance Axios dengan konfigurasi default
const apiClient = axios.create({
  baseURL: API_BASE_URL, // URL dasar untuk semua permintaan
  headers: {
    'Content-Type': 'application/json', // Tipe konten default untuk permintaan
  },
});

// Interceptor untuk permintaan (Request Interceptor)
// Ini akan dijalankan sebelum setiap permintaan dikirim.
// Kita bisa menggunakannya untuk menambahkan token autentikasi ke header.
apiClient.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage (atau Redux store, atau di mana pun Anda menyimpannya)
    // Untuk contoh ini, kita asumsikan token disimpan di localStorage
    const token = localStorage.getItem('authToken'); // 'authToken' adalah contoh nama key

    if (token) {
      // Jika token ada, tambahkan ke header Authorization
      // Formatnya biasanya 'Bearer <token>'
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config; // Kembalikan konfigurasi yang sudah dimodifikasi
  },
  (error) => {
    // Lakukan sesuatu dengan error permintaan
    return Promise.reject(error);
  }
);

// Interceptor untuk respons (Response Interceptor)
// Ini akan dijalankan setelah setiap respons diterima.
// Kita bisa menggunakannya untuk menangani error global atau melakukan refresh token.
apiClient.interceptors.response.use(
  (response) => {
    // Setiap status code yang berada dalam rentang 2xx akan memicu fungsi ini
    // Lakukan sesuatu dengan data respons
    return response;
  },
  (error) => {
    // Setiap status code yang berada di luar rentang 2xx akan memicu fungsi ini
    // Contoh penanganan error:
    if (error.response) {
      // Permintaan dibuat dan server merespons dengan status code
      // yang keluar dari rentang 2xx
      console.error('API Error Response:', error.response.data);
      console.error('Status Code:', error.response.status);
      console.error('Headers:', error.response.headers);

      if (error.response.status === 401) {
        // Jika error adalah 401 (Unauthorized), mungkin token tidak valid atau kedaluwarsa.
        // Anda bisa mengarahkan pengguna ke halaman login atau mencoba refresh token.
        // Contoh: localStorage.removeItem('authToken');
        // window.location.href = '/login'; // Redirect ke login
        console.warn('Unauthorized access - 401. Redirecting to login or refreshing token might be needed.');
      }
    } else if (error.request) {
      // Permintaan dibuat tapi tidak ada respons yang diterima
      // `error.request` adalah instance dari XMLHttpRequest di browser
      console.error('API No Response:', error.request);
    } else {
      // Sesuatu terjadi dalam menyiapkan permintaan yang memicu Error
      console.error('API Request Setup Error:', error.message);
    }
    return Promise.reject(error); // Kembalikan error agar bisa ditangani di tempat pemanggilan API
  }
);

export default apiClient;
