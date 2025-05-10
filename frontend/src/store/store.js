// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import categoryReducer from '../features/categories/categorySlice';
import transactionReducer from '../features/transactions/transactionSlice'; // Impor transactionReducer

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoryReducer,
    transactions: transactionReducer, // Tambahkan transactionReducer ke store
  },
  // Middleware bisa ditambahkan di sini jika diperlukan
  // devTools: process.env.NODE_ENV !== 'production', // Aktifkan Redux DevTools hanya di development
});
