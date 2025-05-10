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
  ListItemSecondaryAction,
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
  Grid,
  Tooltip
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CategoryIcon from '@mui/icons-material/Category'; // Ikon generik untuk kategori

import {
  fetchCategories,
  createCategory,
//   updateCategory, // Akan digunakan nanti
//   deleteCategory, // Akan digunakan nanti
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

  // State untuk form tambah/edit kategori
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null); // Untuk menyimpan data kategori yang diedit
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [formError, setFormError] = useState('');


  // State untuk dialog konfirmasi hapus
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // State untuk Snackbar notifikasi
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch kategori saat komponen dimuat pertama kali
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Efek untuk menangani notifikasi dari Redux state
  useEffect(() => {
    if (isError && message) {
      setNotification({ open: true, message: message, severity: 'error' });
      dispatch(resetCategoryStatus());
    }
    if (isSuccess && message) {
      setNotification({ open: true, message: message, severity: 'success' });
      dispatch(resetCategoryStatus());
      if (openFormDialog) { // Tutup dialog form jika operasi sukses
        handleCloseFormDialog();
      }
    }
  }, [isError, isSuccess, message, dispatch, openFormDialog]);


  const handleOpenFormDialog = (category = null) => {
    setFormError('');
    if (category) {
      setIsEditing(true);
      setCurrentCategory(category);
      setCategoryName(category.name);
      setCategoryDescription(category.description || '');
    } else {
      setIsEditing(false);
      setCurrentCategory(null);
      setCategoryName('');
      setCategoryDescription('');
    }
    setOpenFormDialog(true);
  };

  const handleCloseFormDialog = () => {
    setOpenFormDialog(false);
    // Reset form fields setelah beberapa saat agar transisi dialog selesai
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
      setFormError('Nama kategori tidak boleh kosong.');
      return;
    }
    setFormError('');

    const categoryData = { 
        name: categoryName.trim(), 
        description: categoryDescription.trim() 
    };

    if (isEditing && currentCategory) {
      // dispatch(updateCategory({ ...categoryData, id: currentCategory.id })); // Untuk fitur update nanti
      console.log("Dispatch update (belum diimplementasi penuh):", { ...categoryData, id: currentCategory.id })
      // Untuk sementara, kita tutup dialog dan beri notif placeholder
      setNotification({ open: true, message: "Fitur update belum diimplementasikan sepenuhnya.", severity: 'info' });
      handleCloseFormDialog();
    } else {
      dispatch(createCategory(categoryData));
    }
  };
  
  const handleOpenDeleteDialog = (category) => {
    setCategoryToDelete(category);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setCategoryToDelete(null);
    setOpenDeleteDialog(false);
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      // dispatch(deleteCategory(categoryToDelete.id)); // Untuk fitur delete nanti
      console.log("Dispatch delete (belum diimplementasi penuh):", categoryToDelete.id)
      // Untuk sementara, kita tutup dialog dan beri notif placeholder
      setNotification({ open: true, message: "Fitur delete belum diimplementasikan sepenuhnya.", severity: 'info' });
      handleCloseDeleteDialog();
    }
  };


  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={{ p: 0 }}> {/* Mengurangi padding default dari Box agar Container yang mengatur */}
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'medium' }}>
        Manajemen Kategori
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => handleOpenFormDialog()}
        sx={{ mb: 3 }}
      >
        Tambah Kategori Baru
      </Button>

      {isLoading && !categories.length && ( // Tampilkan loading hanya jika belum ada kategori
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoading && !categories.length && !isError && (
        <Typography sx={{ textAlign: 'center', mt: 3 }}>
          Belum ada kategori. Silakan tambahkan kategori baru.
        </Typography>
      )}
      
      {/* Tampilkan error jika ada dan tidak sedang loading atau tidak ada kategori */}
      {isError && !isLoading && !categories.length && (
         <Alert severity="error" sx={{ mt: 2 }}>
            Gagal memuat kategori: {message}
        </Alert>
      )}


      {categories.length > 0 && (
        <Paper elevation={2} sx={{ width: '100%'}}>
          <List>
            {categories.map((category) => (
              <ListItem 
                key={category.id} 
                divider
                secondaryAction={
                  <>
                    <Tooltip title="Edit Kategori">
                      <IconButton edge="end" aria-label="edit" onClick={() => handleOpenFormDialog(category)} sx={{mr: 0.5}}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Hapus Kategori">
                      <IconButton edge="end" aria-label="delete" onClick={() => handleOpenDeleteDialog(category)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                }
              >
                <CategoryIcon sx={{mr: 2, color: 'action.active'}}/> {/* Ikon di samping nama kategori */}
                <ListItemText 
                    primary={category.name} 
                    secondary={category.description || 'Tidak ada deskripsi'} 
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Dialog untuk Tambah/Edit Kategori */}
      <Dialog open={openFormDialog} onClose={handleCloseFormDialog} maxWidth="sm" fullWidth>
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
            error={!!formError}
            helperText={formError}
            sx={{ mb: 2 }}
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
          />
        </DialogContent>
        <DialogActions sx={{pb:2, pr:2}}>
          <Button onClick={handleCloseFormDialog}>Batal</Button>
          <Button onClick={handleFormSubmit} variant="contained" disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : (isEditing ? 'Simpan Perubahan' : 'Tambah')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialog Konfirmasi Hapus */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Konfirmasi Hapus Kategori</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Apakah Anda yakin ingin menghapus kategori "<b>{categoryToDelete?.name}</b>"? Tindakan ini tidak dapat diurungkan.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{pb:2, pr:2}}>
          <Button onClick={handleCloseDeleteDialog}>Batal</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" autoFocus disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : 'Hapus'}
          </Button>
        </DialogActions>
      </Dialog>


      {/* Snackbar untuk Notifikasi Global */}
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
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CategoriesPage;
