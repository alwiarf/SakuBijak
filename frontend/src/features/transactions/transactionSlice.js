import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/apiClient'; 

// Fungsi helper untuk mendapatkan tanggal hari ini dalam format YYYY-MM-DD
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const initialState = {
  transactions: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Fetch Transactions
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchAll',
  async (filters, thunkAPI) => {
    try {
      const queryParams = filters ? new URLSearchParams(filters).toString() : '';
      const response = await apiClient.get(`/api/transactions?${queryParams}`);
      return response.data.transactions; 
    } catch (error) {
      const message =
        (error.response && error.response.data && (error.response.data.error || error.response.data.message)) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create Transaction
export const createTransaction = createAsyncThunk(
  'transactions/create',
  async (transactionDataFromPage, thunkAPI) => { 
    try {
      // Pastikan console.log ini ada untuk debugging jika masih bermasalah
      console.log("--- Slice: Menerima data dari halaman (createTransaction) ---", transactionDataFromPage);

      const dateToSend = transactionDataFromPage.date && transactionDataFromPage.date.trim() !== '' 
                         ? transactionDataFromPage.date 
                         : getTodayDate(); // Implementasi getTodayDate

      // Validasi dan penyesuaian payload sebelum dikirim ke backend
      const amountValue = parseFloat(transactionDataFromPage.amount);
      if (isNaN(amountValue) || amountValue <= 0) {
        return thunkAPI.rejectWithValue('Jumlah (amount) harus berupa angka positif.');
      }
      if (transactionDataFromPage.categoryId === '' || transactionDataFromPage.categoryId === null || typeof transactionDataFromPage.categoryId === 'undefined') {
        return thunkAPI.rejectWithValue('ID Kategori (categoryId) wajib dipilih.');
      }
      if (!transactionDataFromPage.description || transactionDataFromPage.description.trim() === '') {
        return thunkAPI.rejectWithValue('Deskripsi tidak boleh kosong.');
      }


      const payload = {
        description: transactionDataFromPage.description.trim(),
        amount: String(transactionDataFromPage.amount), // Kirim sebagai string, backend akan parse ke float/numeric
        date: dateToSend,
        category_id: String(transactionDataFromPage.categoryId) // Kirim sebagai string, backend akan parse ke integer
      };
      console.log("--- Slice: Payload ke Backend (createTransaction) ---", payload);
      
      const response = await apiClient.post('/api/transactions', payload);
      return response.data.transaction; 
    } catch (error) {
      const message =
        (error.response && error.response.data && (error.response.data.error || error.response.data.message)) ||
        error.message ||
        error.toString();
      console.error("Error in createTransaction thunk:", message, error.response?.data);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update Transaction
export const updateTransaction = createAsyncThunk(
  'transactions/update',
  async (transactionDataFromPage, thunkAPI) => { 
    try {
      const { id, ...dataToUpdate } = transactionDataFromPage;
      console.log("--- Slice: Menerima data dari halaman (updateTransaction) ---", transactionDataFromPage);

      // Validasi untuk update
      const amountValue = parseFloat(dataToUpdate.amount);
      if (dataToUpdate.amount && (isNaN(amountValue) || amountValue <= 0)) {
         return thunkAPI.rejectWithValue('Jika diupdate, jumlah (amount) harus berupa angka positif.');
      }
      if (dataToUpdate.categoryId && (dataToUpdate.categoryId === '' || dataToUpdate.categoryId === null || typeof dataToUpdate.categoryId === 'undefined')) {
        return thunkAPI.rejectWithValue('Jika diupdate, ID Kategori (categoryId) wajib dipilih.');
      }
      if (dataToUpdate.description && dataToUpdate.description.trim() === '') {
        return thunkAPI.rejectWithValue('Jika diupdate, deskripsi tidak boleh kosong.');
      }
      if (dataToUpdate.date && (!dataToUpdate.date.trim() || !(new Date(dataToUpdate.date).toString() !== "Invalid Date"))) {
        return thunkAPI.rejectWithValue('Jika diupdate, format tanggal tidak valid.');
      }


      const payload = {
        description: dataToUpdate.description,
        amount: String(dataToUpdate.amount), // Kirim sebagai string
        date: dataToUpdate.date,
        category_id: String(dataToUpdate.categoryId) // Kirim sebagai string
      };
      // Hapus field yang undefined agar tidak menimpa data yang sudah ada dengan null jika tidak diisi di form edit
      Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);
      
      console.log("--- Slice: Payload ke Backend (updateTransaction) ---", { id, ...payload });

      const response = await apiClient.put(`/api/transactions/${id}`, payload);
      return response.data.transaction; 
    } catch (error) {
      const message =
        (error.response && error.response.data && (error.response.data.error || error.response.data.message)) ||
        error.message ||
        error.toString();
      console.error("Error in updateTransaction thunk:", message, error.response?.data);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete Transaction
export const deleteTransaction = createAsyncThunk(
  'transactions/delete',
  async (transactionId, thunkAPI) => {
    try {
      console.log("--- Slice: Menghapus transaksi ID ---", transactionId);
      await apiClient.delete(`/api/transactions/${transactionId}`);
      return transactionId; 
    } catch (error) {
      const message =
        (error.response && error.response.data && (error.response.data.error || error.response.data.message)) ||
        error.message ||
        error.toString();
      console.error("Error in deleteTransaction thunk:", message, error.response?.data);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    resetTransactionStatus: (state) => {
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
        state.isError = false;
        state.message = '';
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Gagal memuat transaksi.';
        state.transactions = [];
      })
      // Create Transaction
      .addCase(createTransaction.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.transactions.unshift(action.payload); 
        state.transactions.sort((a, b) => new Date(b.date) - new Date(a.date) || new Date(b.created_at) - new Date(a.created_at));
        state.message = 'Transaksi berhasil ditambahkan!';
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Gagal menambahkan transaksi.';
      })
      // Update Transaction
      .addCase(updateTransaction.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.transactions.findIndex(txn => txn.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
        state.transactions.sort((a, b) => new Date(b.date) - new Date(a.date) || new Date(b.created_at) - new Date(a.created_at));
        state.message = 'Transaksi berhasil diperbarui!';
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Gagal memperbarui transaksi.';
      })
      // Delete Transaction
      .addCase(deleteTransaction.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
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
        state.message = action.payload || 'Gagal menghapus transaksi.';
      });
  },
});

export const { resetTransactionStatus } = transactionSlice.actions;
export default transactionSlice.reducer;