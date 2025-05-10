// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import apiClient from '../../services/apiClient'; // API client kita

// Mengambil data pengguna dari localStorage jika ada (misalnya setelah refresh)
const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('authToken');

// Definisi initial state
const initialState = {
  user: user ? user : null,
  token: token ? token : null,
  isAuthenticated: user && token ? true : false,
  isLoading: false,
  isSuccess: false, // Untuk menandakan operasi sukses (misalnya login/register)
  isError: false,
  message: '',
};

// Async Thunk untuk Registrasi Pengguna
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      // AKTIFKAN INI KETIKA BACKEND SIAP
      // const response = await apiClient.post('/api/auth/register', userData);
      // return response.data; // Asumsi backend mengembalikan data pengguna atau pesan sukses

      // --- MOCKUP RESPONSE (HAPUS/GANTI NANTI) ---
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (userData.email === 'test@example.com') { // Contoh email yang sudah terdaftar (mock)
        return thunkAPI.rejectWithValue('Email sudah terdaftar (mock).');
      }
      const mockRegisteredUser = { id: Date.now(), name: userData.name, email: userData.email };
      // Tidak ada token yang dikembalikan saat registrasi di mockup ini, hanya user data
      return { user: mockRegisteredUser, message: 'Registrasi berhasil! Silakan login.' };
      // --- AKHIR MOCKUP ---

    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async Thunk untuk Login Pengguna
export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      // AKTIFKAN INI KETIKA BACKEND SIAP
      // const response = await apiClient.post('/api/auth/login', userData);
      // if (response.data && response.data.token) {
      //   localStorage.setItem('authToken', response.data.token);
      //   // Asumsi backend juga mengembalikan data pengguna
      //   // Jika tidak, Anda mungkin perlu memanggil /api/users/me setelah login
      //   localStorage.setItem('user', JSON.stringify(response.data.user || response.data));
      //   return response.data;
      // } else {
      //   return thunkAPI.rejectWithValue('Login gagal: Token tidak diterima.');
      // }

      // --- MOCKUP RESPONSE (HAPUS/GANTI NANTI) ---
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (userData.email === 'user@example.com' && userData.password === 'password123') {
        const mockToken = 'mockToken12345';
        const mockUser = { id: 1, name: 'User Contoh', email: userData.email };
        localStorage.setItem('authToken', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        return { user: mockUser, token: mockToken, message: 'Login berhasil!' };
      } else {
        return thunkAPI.rejectWithValue('Email atau password salah (mock).');
      }
      // --- AKHIR MOCKUP ---

    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async Thunk untuk Logout Pengguna
export const logoutUser = createAsyncThunk('auth/logout', async () => {
  // Di sini Anda bisa memanggil API logout jika ada
  // await apiClient.post('/api/auth/logout');
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Reset state ke initial state atau state tertentu
    resetAuthStates: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Kasus untuk Registrasi
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // state.user = action.payload.user; // User tidak login otomatis setelah registrasi di flow ini
        state.message = action.payload.message || 'Registrasi berhasil!';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload; // Pesan error dari rejectWithValue
        state.user = null;
      })
      // Kasus untuk Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.message = action.payload.message || 'Login berhasil!';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload; // Pesan error dari rejectWithValue
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
      })
      // Kasus untuk Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
        state.message = 'Logout berhasil!';
      });
  },
});

export const { resetAuthStates } = authSlice.actions;
export default authSlice.reducer;
