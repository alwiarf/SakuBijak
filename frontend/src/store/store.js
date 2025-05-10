// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import categoryReducer from '../features/categories/categorySlice'; // Impor categoryReducer

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoryReducer, // Tambahkan categoryReducer ke store
    // Tambahkan reducer lain di sini jika ada fitur lain
  },
  // Middleware bisa ditambahkan di sini jika diperlukan
  // devTools: process.env.NODE_ENV !== 'production', // Aktifkan Redux DevTools hanya di development
});
