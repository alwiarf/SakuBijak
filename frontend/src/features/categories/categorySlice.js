import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/apiClient'; 

const initialState = {
  categories: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};



// 1. Fetch Categories
export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get('/api/categories');
      return response.data.categories; 
    } catch (error) {
      const message =
        (error.response && error.response.data && (error.response.data.error || error.response.data.message)) ||
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
      const response = await apiClient.post('/api/categories', categoryData);
      return response.data.category; 
    } catch (error) {
      const message =
        (error.response && error.response.data && (error.response.data.error || error.response.data.message)) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 3. Update Category
export const updateCategory = createAsyncThunk(
  'categories/update',
  async (categoryData, thunkAPI) => { 
    try {
      const { id, ...dataToUpdate } = categoryData;
      const response = await apiClient.put(`/api/categories/${id}`, dataToUpdate);
      return response.data.category; 
    } catch (error) {
      const message =
        (error.response && error.response.data && (error.response.data.error || error.response.data.message)) ||
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
      await apiClient.delete(`/api/categories/${categoryId}`);
      return categoryId; 
    } catch (error) {
      const message =
        (error.response && error.response.data && (error.response.data.error || error.response.data.message)) ||
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
      // state.isLoading tidak direset di sini agar loading fetch tetap terlihat jika ada
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
        state.isError = false; // Reset error state saat memulai fetch baru
        state.message = '';    // Reset message
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload; // Payload adalah array of categories
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Gagal memuat kategori.';
        state.categories = []; // Kosongkan jika gagal
      })
      // Create Category
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true; // Bisa juga state loading spesifik untuk action ini
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories.push(action.payload); // action.payload adalah objek kategori baru
        state.categories.sort((a, b) => a.name.localeCompare(b.name)); // Jaga urutan
        state.message = 'Kategori berhasil ditambahkan!';
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Gagal menambahkan kategori.';
      })
      // Update Category
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.categories.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload; // action.payload adalah objek kategori yang diupdate
        }
        state.categories.sort((a, b) => a.name.localeCompare(b.name)); // Jaga urutan
        state.message = 'Kategori berhasil diperbarui!';
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Gagal memperbarui kategori.';
      })
      // Delete Category
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories = state.categories.filter(cat => cat.id !== action.payload); // action.payload adalah categoryId
        state.message = 'Kategori berhasil dihapus!';
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Gagal menghapus kategori.';
      });
  },
});

export const { resetCategoryStatus } = categorySlice.actions;
export default categorySlice.reducer;
