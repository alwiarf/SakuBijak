// src/features/categories/categorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import apiClient from '../../services/apiClient'; // Menggunakan apiClient yang sudah ada

const initialState = {
  categories: [],
  isLoading: false,
  isError: false,
  isSuccess: false, // Untuk menandakan operasi individu sukses
  message: '',
};

// --- Async Thunks untuk Kategori ---

// 1. Fetch Categories
export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, thunkAPI) => { // Argumen pertama tidak digunakan, jadi pakai _
    try {
      // AKTIFKAN KETIKA BACKEND SIAP
      // const response = await apiClient.get('/api/categories');
      // return response.data; // Asumsi backend mengembalikan array of categories

      // --- MOCKUP RESPONSE ---
      await new Promise(resolve => setTimeout(resolve, 700));
      const mockCategories = [
        { id: 'cat1', name: 'Makanan & Minuman', description: 'Pengeluaran untuk bahan makanan dan jajan' },
        { id: 'cat2', name: 'Transportasi', description: 'Bensin, parkir, transportasi umum' },
        { id: 'cat3', name: 'Tagihan', description: 'Listrik, air, internet, cicilan' },
        { id: 'cat4', name: 'Hiburan', description: 'Film, konser, langganan streaming' },
      ];
      // Ambil dari localStorage jika ada untuk persistensi mockup sederhana
      const localCategories = localStorage.getItem('mockCategories');
      return localCategories ? JSON.parse(localCategories) : mockCategories;
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

// 2. Create Category
export const createCategory = createAsyncThunk(
  'categories/create',
  async (categoryData, thunkAPI) => {
    try {
      // AKTIFKAN KETIKA BACKEND SIAP
      // const response = await apiClient.post('/api/categories', categoryData);
      // return response.data; // Asumsi backend mengembalikan kategori yang baru dibuat

      // --- MOCKUP RESPONSE ---
      await new Promise(resolve => setTimeout(resolve, 500));
      const newCategory = { id: `cat${Date.now()}`, ...categoryData };
      // Simpan ke localStorage untuk persistensi mockup
      const existingCategories = JSON.parse(localStorage.getItem('mockCategories') || '[]');
      const updatedCategories = [...existingCategories, newCategory];
      localStorage.setItem('mockCategories', JSON.stringify(updatedCategories));
      return newCategory;
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

// 3. Update Category
export const updateCategory = createAsyncThunk(
  'categories/update',
  async (categoryData, thunkAPI) => { // categoryData harus berisi id
    try {
      // AKTIFKAN KETIKA BACKEND SIAP
      // const response = await apiClient.put(`/api/categories/${categoryData.id}`, categoryData);
      // return response.data; // Asumsi backend mengembalikan kategori yang sudah diupdate

      // --- MOCKUP RESPONSE ---
      await new Promise(resolve => setTimeout(resolve, 500));
      // Update di localStorage untuk persistensi mockup
      let existingCategories = JSON.parse(localStorage.getItem('mockCategories') || '[]');
      existingCategories = existingCategories.map(cat => 
        cat.id === categoryData.id ? { ...cat, ...categoryData } : cat
      );
      localStorage.setItem('mockCategories', JSON.stringify(existingCategories));
      return categoryData; // Mengembalikan data yang dikirim untuk update di state
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

// 4. Delete Category
export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (categoryId, thunkAPI) => {
    try {
      // AKTIFKAN KETIKA BACKEND SIAP
      // await apiClient.delete(`/api/categories/${categoryId}`);
      // return categoryId; // Mengembalikan ID kategori yang dihapus

      // --- MOCKUP RESPONSE ---
      await new Promise(resolve => setTimeout(resolve, 500));
      // Hapus dari localStorage untuk persistensi mockup
      let existingCategories = JSON.parse(localStorage.getItem('mockCategories') || '[]');
      existingCategories = existingCategories.filter(cat => cat.id !== categoryId);
      localStorage.setItem('mockCategories', JSON.stringify(existingCategories));
      return categoryId;
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

export const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    resetCategoryStatus: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.categories = [];
      })
      // Create Category
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false; // Reset isSuccess sebelum operasi baru
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories.push(action.payload);
        state.message = 'Kategori berhasil ditambahkan!';
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update Category
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.categories.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        state.message = 'Kategori berhasil diperbarui!';
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete Category
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories = state.categories.filter(cat => cat.id !== action.payload);
        state.message = 'Kategori berhasil dihapus!';
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetCategoryStatus } = categorySlice.actions;
export default categorySlice.reducer;
