import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  Slide,
  Tooltip,
  ListItemIcon,
  Stack
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';

import {
  fetchCategories,
  createCategory,
  updateCategory, 
  deleteCategory, 
  resetCategoryStatus,
} from '../features/categories/categorySlice'; 

// Transisi untuk Snackbar
function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const { categories, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.categories 
  );

  // State lokal untuk form dialog
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null); // Menyimpan data kategori yang akan diedit/dihapus
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [formError, setFormError] = useState(''); // Error spesifik untuk validasi form lokal

  // State lokal untuk dialog konfirmasi hapus
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // State lokal untuk Snackbar notifikasi
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch kategori saat komponen dimuat pertama kali
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Efek untuk menangani notifikasi dan menutup dialog berdasarkan state Redux
  useEffect(() => {
    if ((isError || isSuccess) && message) {
      setNotification({ 
        open: true, 
        message: message, 
        severity: isError ? 'error' : 'success' 
      });
      dispatch(resetCategoryStatus()); // Reset status Redux setelah notifikasi disiapkan
      
      // Jika operasi (tambah/edit/hapus) sukses, tutup dialog yang mungkin terbuka
      if (isSuccess) {
        if (openFormDialog) {
          handleCloseFormDialog(); // Fungsi ini akan mereset state form juga
        }
        if (openDeleteDialog) {
          handleCloseDeleteDialog();
        }
      }
    }
  }, [isError, isSuccess, message, dispatch, openFormDialog, openDeleteDialog]); 


  const handleOpenFormDialog = (category = null) => {
    setFormError(''); // Reset error form lokal
    if (category) { // Jika ada objek category, berarti mode edit
      setIsEditing(true);
      setCurrentCategory(category);
      setCategoryName(category.name || '');
      setCategoryDescription(category.description || '');
    } else { // Mode tambah baru
      setIsEditing(false);
      setCurrentCategory(null);
      setCategoryName('');
      setCategoryDescription('');
    }
    setOpenFormDialog(true);
  };

  const handleCloseFormDialog = () => {
    setOpenFormDialog(false);
    // Reset field form setelah dialog tertutup (dengan sedikit delay untuk transisi)
    setTimeout(() => {
        setCategoryName('');
        setCategoryDescription('');
        setIsEditing(false);
        setCurrentCategory(null);
        setFormError('');
    }, 300);
  };

  const handleFormSubmit = () => {
    if (!categoryName.trim()) {
      setFormError('Nama kategori tidak boleh kosong.'); // Set error form lokal
      return;
    }
    setFormError(''); // Hapus error form lokal jika validasi lolos

    const categoryData = { 
        name: categoryName.trim(), 
        description: categoryDescription.trim() 
    };

    if (isEditing && currentCategory && currentCategory.id) {
      // Dispatch action updateCategory dengan menyertakan ID kategori
      dispatch(updateCategory({ ...categoryData, id: currentCategory.id }));
    } else {
      dispatch(createCategory(categoryData));
    }
    // Dialog akan ditutup oleh useEffect jika isSuccess menjadi true
  };
  
  const handleOpenDeleteDialog = (category) => {
    if (category && category.id) {
        setCurrentCategory(category); // Simpan kategori yang akan dihapus
        setOpenDeleteDialog(true);
    } else {
        console.error("Kategori tidak valid untuk dihapus:", category);
        setNotification({ open: true, message: "Error: Kategori tidak valid untuk dihapus.", severity: 'error' });
    }
  };

  const handleCloseDeleteDialog = () => {
    setCurrentCategory(null); // Hapus referensi kategori yang akan dihapus
    setOpenDeleteDialog(false);
  };

  const handleDeleteConfirm = () => {
    if (currentCategory && currentCategory.id) {
      dispatch(deleteCategory(currentCategory.id));
    }
    // Dialog akan ditutup oleh useEffect jika isSuccess menjadi true
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  // Komponen untuk menampilkan daftar kategori
  const CategoryListDisplay = () => {
    if (!Array.isArray(categories) || categories.length === 0) {
      if (!isLoading && !isError) {
        return (
            <Paper elevation={0} sx={{p:3, textAlign: 'center', backgroundColor: 'transparent'}}>
                <CategoryOutlinedIcon sx={{fontSize: 60, color: 'action.disabled', mb: 2}}/>
                <Typography variant="h6" color="text.secondary">
                Belum Ada Kategori
                </Typography>
                <Typography color="text.secondary">
                Silakan tambahkan kategori pengeluaran pertama Anda.
                </Typography>
            </Paper>
        );
      }
      return null;
    }

    return (
      <Paper elevation={0} sx={{ width: '100%', border: '1px solid', borderColor: 'divider', borderRadius: '12px' }}>
        <List sx={{padding: 0}}>
          {categories.map((category, index) => {
            if (!category || typeof category.id === 'undefined' || typeof category.name === 'undefined') {
              console.warn("CategoriesPage: Invalid category object found in list:", category);
              return null;
            }
            return (
              <ListItem 
                key={category.id} 
                divider={index < categories.length - 1}
                sx={{ 
                    paddingY: 1.5, paddingX: 2,
                    '&:hover': { backgroundColor: 'action.hover' }
                }}
                secondaryAction={
                  <Stack direction="row" spacing={0.5}>
                    <Tooltip title="Edit Kategori">
                      <IconButton edge="end" aria-label="edit" onClick={() => handleOpenFormDialog(category)} size="small" disabled={isLoading}>
                        <EditIcon fontSize="small"/>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Hapus Kategori">
                      <IconButton edge="end" aria-label="delete" onClick={() => handleOpenDeleteDialog(category)} size="small" disabled={isLoading}>
                        <DeleteIcon fontSize="small"/>
                      </IconButton>
                    </Tooltip>
                  </Stack>
                }
              >
                <ListItemIcon sx={{minWidth: 40}}>
                    <CategoryOutlinedIcon sx={{color: 'primary.main'}}/>
                </ListItemIcon>
                <ListItemText 
                    primary={<Typography variant="subtitle1" sx={{fontWeight: 500}}>{category.name}</Typography>} 
                    secondary={category.description || 'Tidak ada deskripsi'} 
                />
              </ListItem>
            );
          })}
        </List>
      </Paper>
    );
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'medium' }}>
        Manajemen Kategori Pengeluaran
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => handleOpenFormDialog()}
        sx={{ mb: 3 }}
        disabled={isLoading && (!Array.isArray(categories) || categories.length === 0)}
      >
        Tambah Kategori Baru
      </Button>

      {/* Tampilkan loading spinner hanya saat fetch awal dan belum ada data */}
      {isLoading && (!Array.isArray(categories) || categories.length === 0) && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Tampilkan pesan error jika fetch awal gagal dan belum ada data */}
      {!isLoading && isError && (!Array.isArray(categories) || categories.length === 0) && (
         <Alert severity="error" sx={{ mt: 2 }}>
            Gagal memuat kategori: {typeof message === 'string' ? message : 'Terjadi kesalahan tidak diketahui.'}
        </Alert>
      )}
      
      <CategoryListDisplay />


      {/* Dialog untuk Tambah/Edit Kategori */}
      <Dialog open={openFormDialog} onClose={handleCloseFormDialog} maxWidth="sm" fullWidth PaperProps={{component: 'form', onSubmit: (e) => {e.preventDefault(); handleFormSubmit();}}}>
        <DialogTitle>{isEditing ? 'Edit Kategori' : 'Tambah Kategori Baru'}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{mb: 2}}>
            {isEditing ? 'Ubah detail kategori Anda di bawah ini.' : 'Masukkan nama dan deskripsi untuk kategori baru.'}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="categoryName"
            label="Nama Kategori"
            type="text"
            fullWidth
            variant="outlined"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            error={!!formError} // Menggunakan state formError lokal
            helperText={formError}
            sx={{ mb: 2 }}
            disabled={isLoading} // Nonaktifkan field saat operasi Redux berjalan
          />
          <TextField
            margin="dense"
            id="categoryDescription"
            label="Deskripsi (Opsional)"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
            disabled={isLoading} // Nonaktifkan field saat operasi Redux berjalan
          />
        </DialogContent>
        <DialogActions sx={{pb:2, pr:2}}>
          <Button onClick={handleCloseFormDialog} disabled={isLoading}>Batal</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {/* Tampilkan spinner di tombol jika isLoading dari Redux (untuk CUD) true */}
            {isLoading && !categories.length ? <CircularProgress size={24} /> : (isEditing ? 'Simpan Perubahan' : 'Tambah')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialog Konfirmasi Hapus */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Konfirmasi Hapus Kategori</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Apakah Anda yakin ingin menghapus kategori "<b>{currentCategory?.name || ''}</b>"? Tindakan ini tidak dapat diurungkan.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{pb:2, pr:2}}>
          <Button onClick={handleCloseDeleteDialog} disabled={isLoading}>Batal</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" autoFocus disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : 'Hapus'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar untuk notifikasi */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        TransitionComponent={SlideTransition}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          elevation={6}
          sx={{ width: '100%' }}
        >
          {typeof notification.message === 'string' ? notification.message : 'Terjadi pembaruan.'}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CategoriesPage;