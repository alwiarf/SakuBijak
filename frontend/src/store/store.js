// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'; // Impor reducer kita

export const store = configureStore({
  reducer: {
    auth: authReducer, // Tambahkan authReducer ke store
    // Tambahkan reducer lain di sini jika ada fitur lain
  },
});