// src/features/transactions/transactionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import apiClient from '../../services/apiClient'; // Menggunakan apiClient yang sudah ada

// Helper untuk mendapatkan tanggal hari ini dalam format YYYY-MM-DD
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const initialState = {
  transactions: [],
  isLoading: false,
  isError: false,
  isSuccess: false, // Untuk menandakan operasi individu sukses
  message: '',
  // Mungkin ada state tambahan seperti metadata pagination atau filter
  // totalTransactions: 0,
  // currentPage: 1,
  // totalPages: 1,
};

// --- Async Thunks untuk Transaksi ---

// 1. Fetch Transactions
// Anda mungkin ingin menambahkan parameter untuk filter (misalnya, tanggal, kategori)
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchAll',
  async (filters, thunkAPI) => { // filters bisa berupa objek { dateFrom, dateTo, categoryId }
    try {
      // AKTIFKAN KETIKA BACKEND SIAP
      // const queryParams = new URLSearchParams(filters).toString();
      // const response = await apiClient.get(`/api/transactions?${queryParams}`);
      // return response.data; // Asumsi backend mengembalikan { transactions: [], total: X, ... }

      // --- MOCKUP RESPONSE ---
      await new Promise(resolve => setTimeout(resolve, 800));
      // Ambil dari localStorage jika ada untuk persistensi mockup sederhana
      let mockTransactions = JSON.parse(localStorage.getItem('mockTransactions') || '[]');
      
      // Contoh filter mockup sederhana (jika ada)
      if (filters) {
        if (filters.categoryId) {
          mockTransactions = mockTransactions.filter(t => t.categoryId === filters.categoryId);
        }
        // Filter tanggal bisa lebih kompleks, ini contoh sederhana
        if (filters.dateFrom) {
          mockTransactions = mockTransactions.filter(t => new Date(t.date) >= new Date(filters.dateFrom));
        }
        if (filters.dateTo) {
          mockTransactions = mockTransactions.filter(t => new Date(t.date) <= new Date(filters.dateTo));
        }
      }
      
      // Urutkan berdasarkan tanggal terbaru
      mockTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

      return mockTransactions; // Mengembalikan array transaksi untuk mockup
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

// 2. Create Transaction
export const createTransaction = createAsyncThunk(
  'transactions/create',
  async (transactionData, thunkAPI) => {
    try {
      // AKTIFKAN KETIKA BACKEND SIAP
      // const response = await apiClient.post('/api/transactions', transactionData);
      // return response.data; // Asumsi backend mengembalikan transaksi yang baru dibuat

      // --- MOCKUP RESPONSE ---
      await new Promise(resolve => setTimeout(resolve, 500));
      const newTransaction = { 
        id: `txn${Date.now()}`, 
        ...transactionData,
        date: transactionData.date || getTodayDate(), // Pastikan ada tanggal
        amount: parseFloat(transactionData.amount) || 0 // Pastikan amount adalah angka
      };
      const existingTransactions = JSON.parse(localStorage.getItem('mockTransactions') || '[]');
      const updatedTransactions = [...existingTransactions, newTransaction];
      localStorage.setItem('mockTransactions', JSON.stringify(updatedTransactions));
      return newTransaction;
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

// 3. Update Transaction
export const updateTransaction = createAsyncThunk(
  'transactions/update',
  async (transactionData, thunkAPI) => { // transactionData harus berisi id
    try {
      // AKTIFKAN KETIKA BACKEND SIAP
      // const response = await apiClient.put(`/api/transactions/${transactionData.id}`, transactionData);
      // return response.data; // Asumsi backend mengembalikan transaksi yang sudah diupdate

      // --- MOCKUP RESPONSE ---
      await new Promise(resolve => setTimeout(resolve, 500));
      let existingTransactions = JSON.parse(localStorage.getItem('mockTransactions') || '[]');
      const updatedData = {
        ...transactionData,
        amount: parseFloat(transactionData.amount) || 0
      };
      existingTransactions = existingTransactions.map(txn => 
        txn.id === updatedData.id ? { ...txn, ...updatedData } : txn
      );
      localStorage.setItem('mockTransactions', JSON.stringify(existingTransactions));
      return updatedData;
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

// 4. Delete Transaction
export const deleteTransaction = createAsyncThunk(
  'transactions/delete',
  async (transactionId, thunkAPI) => {
    try {
      // AKTIFKAN KETIKA BACKEND SIAP
      // await apiClient.delete(`/api/transactions/${transactionId}`);
      // return transactionId; // Mengembalikan ID transaksi yang dihapus

      // --- MOCKUP RESPONSE ---
      await new Promise(resolve => setTimeout(resolve, 500));
      let existingTransactions = JSON.parse(localStorage.getItem('mockTransactions') || '[]');
      existingTransactions = existingTransactions.filter(txn => txn.id !== transactionId);
      localStorage.setItem('mockTransactions', JSON.stringify(existingTransactions));
      return transactionId;
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

export const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    resetTransactionStatus: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload; // Untuk mockup, langsung array transaksi
        // Jika backend mengembalikan objek:
        // state.transactions = action.payload.transactions;
        // state.totalTransactions = action.payload.total;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.transactions = [];
      })
      // Create Transaction
      .addCase(createTransaction.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.transactions.unshift(action.payload); // Tambah di awal array agar tampil paling atas
        state.message = 'Transaksi berhasil ditambahkan!';
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update Transaction
      .addCase(updateTransaction.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.transactions.findIndex(txn => txn.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
        // Urutkan kembali jika perlu setelah update
        state.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        state.message = 'Transaksi berhasil diperbarui!';
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete Transaction
      .addCase(deleteTransaction.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.transactions = state.transactions.filter(txn => txn.id !== action.payload);
        state.message = 'Transaksi berhasil dihapus!';
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetTransactionStatus } = transactionSlice.actions;
export default transactionSlice.reducer;
