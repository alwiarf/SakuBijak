import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/apiClient';

// Mengambil data pengguna dari localStorage jika ada
const userFromStorage = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null;
const tokenFromStorage = localStorage.getItem('authToken');

// Definisi initial state
const initialState = {
  user: userFromStorage,
  token: tokenFromStorage,
  isAuthenticated: !!userFromStorage && !!tokenFromStorage,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Async Thunk untuk Registrasi Pengguna via API
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      // Menggunakan apiClient untuk memanggil endpoint registrasi di backend
      const response = await apiClient.post('/api/auth/register', userData);
      // Asumsi backend mengembalikan objek dengan 'message' dan 'user' saat sukses
      return response.data;
    } catch (error) {
      // Menangani error dari respons API atau error jaringan
      const message =
        (error.response && error.response.data && (error.response.data.error || error.response.data.message)) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async Thunk untuk Login Pengguna via API
export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      // Menggunakan apiClient untuk memanggil endpoint login di backend
      const response = await apiClient.post('/api/auth/login', userData);
      // Backend diharapkan mengembalikan message, access_token, token_type, expires_in, user
      if (response.data && response.data.access_token) {
        localStorage.setItem('authToken', response.data.access_token);
        // Simpan hanya data user yang relevan, jangan simpan token di dalam objek user di localStorage
        const userToStore = {
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email
        };
        localStorage.setItem('user', JSON.stringify(userToStore));
        return { // Kembalikan data yang akan disimpan di state Redux
            user: userToStore,
            token: response.data.access_token,
            message: response.data.message || 'Login berhasil!' // Ambil pesan dari respons jika ada
        };
      } else {
        // Jika respons tidak sesuai harapan (misalnya tidak ada access_token)
        return thunkAPI.rejectWithValue(response.data.error || response.data.message || 'Login gagal: Respons tidak valid dari server.');
      }
    } catch (error) {
      const message =
        (error.response && error.response.data && (error.response.data.error || error.response.data.message)) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async Thunk untuk Logout Pengguna
export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  } catch (error) {
     localStorage.removeItem('authToken');
     localStorage.removeItem('user');
     console.error("Error during API logout, client-side cleanup performed.", error);
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
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
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message || 'Registrasi berhasil! Silakan login.';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Registrasi gagal.';
        state.user = null;
      })
      // Kasus untuk Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
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
        state.message = action.payload || 'Login gagal.';
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
      })
      // Kasus untuk Logout
      .addCase(logoutUser.pending, (state) => { 
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
        state.isLoading = false;
        state.isSuccess = true; // Menandakan logout sukses
        state.message = 'Anda telah berhasil logout.';
      })
      .addCase(logoutUser.rejected, (state, action) => { 
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Logout gagal.';
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
      });
  },
});

export const { resetAuthStates } = authSlice.actions;
export default authSlice.reducer;