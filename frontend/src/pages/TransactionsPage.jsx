// src/pages/TransactionsPage.jsx
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
  Tooltip,
  ListItemIcon,
  MenuItem, // Untuk Select Kategori
  FormControl, // Untuk Select Kategori
  InputLabel,  // Untuk Select Kategori
  Select,      // Untuk Select Kategori
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Toolbar, // Untuk filter
  InputAdornment,
  Chip
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'; // Ikon untuk transaksi
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NotesIcon from '@mui/icons-material/Notes';

import {
  fetchTransactions,
  createTransaction,
  updateTransaction, // Akan digunakan nanti
  deleteTransaction, // Akan digunakan nanti
  resetTransactionStatus,
} from '../features/transactions/transactionSlice';
import { fetchCategories } from '../features/categories/categorySlice'; // Untuk dropdown kategori

// Transisi untuk Snackbar
function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

// Fungsi untuk format mata uang (Rupiah)
const formatCurrency = (amount) => {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0, // Tidak menampilkan desimal jika 0
  }).format(amount);
};

// Fungsi untuk format tanggal
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

const TransactionsPage = () => {
  const dispatch = useDispatch();
  
  const { 
    transactions, 
    isLoading: isLoadingTransactions, 
    isError: isErrorTransactions, 
    isSuccess: isSuccessTransactionAction, // Sukses untuk CUD action
    message: transactionMessage 
  } = useSelector((state) => state.transactions);
  
  const { 
    categories, 
    isLoading: isLoadingCategories 
  } = useSelector((state) => state.categories);

  // State untuk form tambah/edit transaksi
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [transactionData, setTransactionData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0], // Default ke hari ini YYYY-MM-DD
    categoryId: '',
    type: 'expense', // 'expense' atau 'income' (untuk pengembangan mendatang)
  });
  const [formError, setFormError] = useState({});


  // State untuk dialog konfirmasi hapus
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  // State untuk Snackbar notifikasi
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  
  // State untuk pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch data saat komponen dimuat
  useEffect(() => {
    dispatch(fetchTransactions()); // Tambahkan parameter filter jika ada
    dispatch(fetchCategories());
  }, [dispatch]);

  // Efek untuk menangani notifikasi dari Redux state transaksi
  useEffect(() => {
    if ((isErrorTransactions || isSuccessTransactionAction) && transactionMessage) {
      setNotification({ 
        open: true, 
        message: transactionMessage, 
        severity: isErrorTransactions ? 'error' : 'success' 
      });
      dispatch(resetTransactionStatus());
      
      if (isSuccessTransactionAction) {
        if (openFormDialog) handleCloseFormDialog();
        if (openDeleteDialog) handleCloseDeleteDialog();
      }
    }
  }, [isErrorTransactions, isSuccessTransactionAction, transactionMessage, dispatch, openFormDialog, openDeleteDialog]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransactionData({ ...transactionData, [name]: value });
    // Hapus error spesifik saat user mulai mengetik
    if (formError[name]) {
        setFormError({...formError, [name]: ''});
    }
  };
  
  const validateForm = () => {
    let errors = {};
    if (!transactionData.description.trim()) errors.description = "Deskripsi tidak boleh kosong.";
    if (!transactionData.amount || isNaN(parseFloat(transactionData.amount)) || parseFloat(transactionData.amount) <= 0) {
        errors.amount = "Jumlah harus angka positif.";
    }
    if (!transactionData.date) errors.date = "Tanggal tidak boleh kosong.";
    if (!transactionData.categoryId) errors.categoryId = "Kategori harus dipilih.";
    
    setFormError(errors);
    return Object.keys(errors).length === 0; // Return true jika tidak ada error
  };


  const handleOpenFormDialog = (transaction = null) => {
    setFormError({});
    if (transaction) {
      setIsEditing(true);
      setCurrentTransaction(transaction);
      setTransactionData({
        description: transaction.description || '',
        amount: transaction.amount?.toString() || '', // Pastikan amount adalah string untuk TextField
        date: transaction.date ? transaction.date.split('T')[0] : new Date().toISOString().split('T')[0],
        categoryId: transaction.categoryId || '',
        type: transaction.type || 'expense',
      });
    } else {
      setIsEditing(false);
      setCurrentTransaction(null);
      setTransactionData({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        categoryId: '',
        type: 'expense',
      });
    }
    setOpenFormDialog(true);
  };

  const handleCloseFormDialog = () => {
    setOpenFormDialog(false);
    setTimeout(() => { // Reset setelah dialog tertutup
        setIsEditing(false);
        setCurrentTransaction(null);
        setTransactionData({ description: '', amount: '', date: new Date().toISOString().split('T')[0], categoryId: '', type: 'expense' });
        setFormError({});
    }, 300);
  };

  const handleFormSubmit = () => {
    if (!validateForm()) return;

    const finalTransactionData = {
      ...transactionData,
      amount: parseFloat(transactionData.amount), // Pastikan amount adalah number
    };

    if (isEditing && currentTransaction) {
      dispatch(updateTransaction({ ...finalTransactionData, id: currentTransaction.id }));
    } else {
      dispatch(createTransaction(finalTransactionData));
    }
  };
  
  const handleOpenDeleteDialog = (transaction) => {
    if (transaction && transaction.id) {
        setTransactionToDelete(transaction);
        setOpenDeleteDialog(true);
    } else {
        console.error("Attempted to delete invalid transaction object:", transaction);
        setNotification({ open: true, message: "Error: Transaksi tidak valid untuk dihapus.", severity: 'error' });
    }
  };

  const handleCloseDeleteDialog = () => {
    setTransactionToDelete(null);
    setOpenDeleteDialog(false);
  };

  const handleDeleteConfirm = () => {
    if (transactionToDelete && transactionToDelete.id) {
      dispatch(deleteTransaction(transactionToDelete.id));
    }
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') return;
    setNotification({ ...notification, open: false });
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Menghitung transaksi untuk halaman saat ini
  const paginatedTransactions = Array.isArray(transactions) 
    ? transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : [];

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'N/A';
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'medium' }}>
        Manajemen Transaksi
      </Typography>

      <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 }, mb: 2, justifyContent: 'space-between' }}>
        <Typography variant="h6" id="tableTitle" component="div">
          Daftar Pengeluaran
        </Typography>
        <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => handleOpenFormDialog()}
            disabled={isLoadingTransactions && !transactions.length}
        >
            Tambah Transaksi
        </Button>
      </Toolbar>

      {isLoadingTransactions && !transactions.length && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoadingTransactions && !transactions.length && !isErrorTransactions && (
        <Paper elevation={0} sx={{p:3, textAlign: 'center', backgroundColor: 'transparent'}}>
            <ReceiptLongIcon sx={{fontSize: 60, color: 'action.disabled', mb: 2}}/>
            <Typography variant="h6" color="text.secondary">Belum Ada Transaksi</Typography>
            <Typography color="text.secondary">Silakan tambahkan transaksi pengeluaran pertama Anda.</Typography>
        </Paper>
      )}
      
      {isErrorTransactions && !isLoadingTransactions && !transactions.length && (
         <Alert severity="error" sx={{ mt: 2 }}>
            Gagal memuat transaksi: {transactionMessage}
        </Alert>
      )}

      {Array.isArray(transactions) && transactions.length > 0 && (
        <Paper elevation={2} sx={{ width: '100%', mb: 2 }}>
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <TableHead>
                <TableRow>
                  <TableCell sx={{fontWeight: 'bold'}}>Tanggal</TableCell>
                  <TableCell sx={{fontWeight: 'bold'}}>Deskripsi</TableCell>
                  <TableCell sx={{fontWeight: 'bold'}} align="right">Jumlah</TableCell>
                  <TableCell sx={{fontWeight: 'bold'}}>Kategori</TableCell>
                  <TableCell sx={{fontWeight: 'bold'}} align="center">Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTransactions.map((transaction) => (
                  <TableRow hover key={transaction.id}>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell align="right">{formatCurrency(transaction.amount)}</TableCell>
                    <TableCell>
                        <Chip label={getCategoryName(transaction.categoryId)} size="small" />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit Transaksi">
                        <IconButton onClick={() => handleOpenFormDialog(transaction)} size="small" sx={{mr:0.5}}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Hapus Transaksi">
                        <IconButton onClick={() => handleOpenDeleteDialog(transaction)} size="small">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={transactions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Baris per halaman:"
          />
        </Paper>
      )}

      {/* Dialog untuk Tambah/Edit Transaksi */}
      <Dialog open={openFormDialog} onClose={handleCloseFormDialog} maxWidth="sm" fullWidth PaperProps={{component: 'form', onSubmit: (e) => {e.preventDefault(); handleFormSubmit();}}}>
        <DialogTitle>{isEditing ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{mb: 1}}>
            {isEditing ? 'Ubah detail transaksi Anda.' : 'Masukkan detail untuk transaksi baru.'}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="description"
            label="Deskripsi Pengeluaran"
            type="text"
            fullWidth
            variant="outlined"
            value={transactionData.description}
            onChange={handleInputChange}
            error={!!formError.description}
            helperText={formError.description}
            sx={{ mb: 2 }}
            InputProps={{
                startAdornment: (
                <InputAdornment position="start">
                    <NotesIcon color="action" />
                </InputAdornment>
                ),
            }}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="amount"
                label="Jumlah (Rp)"
                type="number" // Gunakan type number untuk input angka
                fullWidth
                variant="outlined"
                value={transactionData.amount}
                onChange={handleInputChange}
                error={!!formError.amount}
                helperText={formError.amount}
                InputProps={{
                    startAdornment: (
                    <InputAdornment position="start">
                        <AttachMoneyIcon color="action" />
                    </InputAdornment>
                    ),
                    inputProps: { min: 0 } // Mencegah angka negatif
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="date"
                label="Tanggal Transaksi"
                type="date" // Input tanggal
                fullWidth
                variant="outlined"
                value={transactionData.date}
                onChange={handleInputChange}
                error={!!formError.date}
                helperText={formError.date}
                InputLabelProps={{ shrink: true }} // Agar label tidak tumpang tindih dengan tanggal
                InputProps={{
                    startAdornment: (
                    <InputAdornment position="start">
                        <CalendarTodayIcon color="action" />
                    </InputAdornment>
                    ),
                }}
              />
            </Grid>
          </Grid>
          <FormControl fullWidth margin="dense" sx={{ mt: 2 }} error={!!formError.categoryId}>
            <InputLabel id="category-select-label">Kategori</InputLabel>
            <Select
              labelId="category-select-label"
              id="categoryId"
              name="categoryId"
              value={transactionData.categoryId}
              label="Kategori"
              onChange={handleInputChange}
              variant="outlined"
              disabled={isLoadingCategories}
            >
              <MenuItem value="" disabled>
                <em>Pilih Kategori</em>
              </MenuItem>
              {isLoadingCategories ? (
                <MenuItem disabled><CircularProgress size={20} /></MenuItem>
              ) : (
                categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))
              )}
            </Select>
            {formError.categoryId && <Typography variant="caption" color="error" sx={{ml:1.5, mt:0.5}}>{formError.categoryId}</Typography>}
          </FormControl>
        </DialogContent>
        <DialogActions sx={{pb:2, pr:2}}>
          <Button onClick={handleCloseFormDialog}>Batal</Button>
          <Button type="submit" variant="contained" disabled={isLoadingTransactions}>
            {isLoadingTransactions ? <CircularProgress size={24} /> : (isEditing ? 'Simpan Perubahan' : 'Tambah')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialog Konfirmasi Hapus */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Konfirmasi Hapus Transaksi</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Apakah Anda yakin ingin menghapus transaksi "<b>{transactionToDelete?.description}</b>" sejumlah <b>{formatCurrency(transactionToDelete?.amount || 0)}</b>? Tindakan ini tidak dapat diurungkan.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{pb:2, pr:2}}>
          <Button onClick={handleCloseDeleteDialog}>Batal</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" autoFocus disabled={isLoadingTransactions}>
            {isLoadingTransactions ? <CircularProgress size={24} /> : 'Hapus'}
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
        <Alert onClose={handleCloseNotification} severity={notification.severity} variant="filled" elevation={6} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TransactionsPage;
