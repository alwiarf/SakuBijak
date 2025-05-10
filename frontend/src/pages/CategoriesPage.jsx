// src/pages/CategoriesPage.jsx
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
  // ListItemSecondaryAction, // Tidak digunakan secara langsung lagi, diganti Stack
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
  // Grid, // Tidak digunakan secara langsung di level atas
  Tooltip,
  ListItemIcon,
  Stack // Untuk tombol aksi di ListItem
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

  // Logging state dari Redux untuk debugging
  useEffect(() => {
    console.log('CategoriesPage - Redux state:', { categories, isLoading, isError, isSuccess, message });
  }, [categories, isLoading, isError, isSuccess, message]);


  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [formError, setFormError] = useState('');

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    console.log('CategoriesPage: Attempting to fetch categories.');
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    // Pastikan message adalah string dan ada isinya sebelum menampilkan notifikasi
    if ((isError || isSuccess) && typeof message === 'string' && message.trim() !== '') {
      console.log('CategoriesPage - Notification effect triggered:', { isError, isSuccess, message });
      setNotification({ 
        open: true, 
        message: message, 
        severity: isError ? 'error' : 'success' 
      });
      dispatch(resetCategoryStatus());
      
      if (isSuccess) {
        if (openFormDialog) {
          handleCloseFormDialog();
        }
        if (openDeleteDialog) {
          handleCloseDeleteDialog();
        }
      }
    }
  }, [isError, isSuccess, message, dispatch, openFormDialog, openDeleteDialog]);


  const handleOpenFormDialog = (category = null) => {
    setFormError('');
    if (category) {
      setIsEditing(true);
      setCurrentCategory(category);
      setCategoryName(category.name || ''); // Fallback jika name tidak ada
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

    if (isEditing && currentCategory && currentCategory.id) { // Pastikan currentCategory dan id nya ada
      dispatch(updateCategory({ ...categoryData, id: currentCategory.id }));
    } else {
      dispatch(createCategory(categoryData));
    }
  };
  
  const handleOpenDeleteDialog = (category) => {
    if (category && category.id) { // Pastikan category dan id nya ada
        setCategoryToDelete(category);
        setOpenDeleteDialog(true);
    } else {
        console.error("Attempted to delete invalid category object:", category);
        setNotification({ open: true, message: "Error: Kategori tidak valid untuk dihapus.", severity: 'error' });
    }
  };

  const handleCloseDeleteDialog = () => {
    setCategoryToDelete(null);
    setOpenDeleteDialog(false);
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete && categoryToDelete.id) { // Pastikan categoryToDelete dan id nya ada
      dispatch(deleteCategory(categoryToDelete.id));
    }
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  // Komponen untuk menampilkan daftar kategori
  const CategoryListDisplay = () => {
    // Pengecekan ketat bahwa categories adalah array dan memiliki isi
    if (!Array.isArray(categories) || categories.length === 0) {
      // Kondisi ini seharusnya sudah ditangani oleh blok loading/empty/error di bawah,
      // tapi ini sebagai lapisan pertahanan tambahan jika logika tersebut terlewat.
      if (!isLoading && !isError) { // Jika tidak loading dan tidak error, berarti memang kosong
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
      return null; // Jangan render apa-apa jika sedang loading atau ada error yang sudah ditangani
    }

    console.log("CategoriesPage: Rendering category list with data:", categories);
    return (
      <Paper elevation={2} sx={{ width: '100%'}}>
        <List sx={{padding: 0}}>
          {categories.map((category, index) => {
            // Pastikan category adalah objek dan memiliki id & name sebelum render
            if (!category || typeof category.id === 'undefined' || typeof category.name === 'undefined') {
              console.warn("CategoriesPage: Invalid category object found in list:", category);
              return null; // Lewati item yang tidak valid
            }
            return (
              <ListItem 
                key={category.id} 
                divider={index < categories.length - 1}
                sx={{ 
                    paddingY: 1.5,
                    '&:hover': { backgroundColor: 'action.hover' }
                }}
                secondaryAction={
                  <Stack direction="row" spacing={0.5}>
                    <Tooltip title="Edit Kategori">
                      <IconButton edge="end" aria-label="edit" onClick={() => handleOpenFormDialog(category)} size="small">
                        <EditIcon fontSize="small"/>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Hapus Kategori">
                      <IconButton edge="end" aria-label="delete" onClick={() => handleOpenDeleteDialog(category)} size="small">
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

      {isLoading && (!Array.isArray(categories) || categories.length === 0) && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoading && isError && (!Array.isArray(categories) || categories.length === 0) && (
         <Alert severity="error" sx={{ mt: 2 }}>
            Gagal memuat kategori: {typeof message === 'string' ? message : 'Terjadi kesalahan tidak diketahui.'}
        </Alert>
      )}
      
      {/* Selalu coba render CategoryListDisplay, logika internalnya akan menangani kasus kosong/error */}
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
          <Button type="submit" variant="contained" disabled={isLoading}>
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
            Apakah Anda yakin ingin menghapus kategori "<b>{categoryToDelete?.name || ''}</b>"? Transaksi yang terkait dengan kategori ini mungkin perlu diperbarui. Tindakan ini tidak dapat diurungkan.
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
