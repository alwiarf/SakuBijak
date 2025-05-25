// src/pages/TransactionsPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  TextField,
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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Toolbar,
  InputAdornment,
  Chip
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NotesIcon from '@mui/icons-material/Notes';

import {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  resetTransactionStatus,
} from '../features/transactions/transactionSlice';
import { fetchCategories } from '../features/categories/categorySlice';

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
    minimumFractionDigits: 0,
  }).format(amount);
};

// Fungsi untuk format tanggal
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  // Pastikan tanggal dalam format yang bisa di-parse oleh new Date()
  // Jika dateString sudah YYYY-MM-DD, ini aman.
  return new Date(dateString + 'T00:00:00').toLocaleDateString('id-ID', options);
};

const TransactionsPage = () => {
  const dispatch = useDispatch();
  
  const { 
    transactions, 
    isLoading: isLoadingTransactions, // Ini akan true untuk semua operasi CUD dan Fetch di slice
    isError: isErrorTransactions, 
    isSuccess: isSuccessTransactionAction,
    message: transactionMessage 
  } = useSelector((state) => state.transactions);
  
  const { 
    categories, 
    isLoading: isLoadingCategories 
  } = useSelector((state) => state.categories);

  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [transactionData, setTransactionData] = useState({
    description: '',
    amount: '', // Biarkan string untuk input form, konversi saat submit
    date: new Date().toISOString().split('T')[0], 
    categoryId: '',
  });
  const [formError, setFormError] = useState({});

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchCategories());
  }, [dispatch]);
  
  useEffect(() => {
    // Log untuk memantau perubahan state dari Redux
    // console.log("TransactionsPage - Redux State Update:", { isLoadingTransactions, isErrorTransactions, isSuccessTransactionAction, transactionMessage });
    // console.log("Categories State:", { categories, isLoadingCategories });

    if ((isErrorTransactions || isSuccessTransactionAction) && transactionMessage) {
      setNotification({ 
        open: true, 
        message: transactionMessage, 
        severity: isErrorTransactions ? 'error' : 'success' 
      });
      dispatch(resetTransactionStatus());
      
      if (isSuccessTransactionAction) {
        if (openFormDialog) {
          handleCloseFormDialog();
        }
        if (openDeleteDialog) {
          handleCloseDeleteDialog();
        }
        // Pertimbangkan untuk fetch ulang transaksi jika operasi CUD berhasil dan slice tidak mengupdate list secara optimis dengan sempurna
        // dispatch(fetchTransactions()); 
      }
    }
  }, [isErrorTransactions, isSuccessTransactionAction, transactionMessage, dispatch, openFormDialog, openDeleteDialog]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransactionData({ ...transactionData, [name]: value });
    if (formError[name]) {
        setFormError({...formError, [name]: ''});
    }
  };
  
  const validateForm = () => {
    let errors = {};
    if (!transactionData.description.trim()) errors.description = "Deskripsi tidak boleh kosong.";
    const amountValue = parseFloat(transactionData.amount); // Validasi amount sebagai angka
    if (isNaN(amountValue) || amountValue <= 0) {
        errors.amount = "Jumlah harus angka positif.";
    }
    if (!transactionData.date) errors.date = "Tanggal tidak boleh kosong.";
    if (transactionData.categoryId === '' || transactionData.categoryId === null || typeof transactionData.categoryId === 'undefined') {
      errors.categoryId = "Kategori harus dipilih.";
    }
    
    setFormError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenFormDialog = (transaction = null) => {
    setFormError({});
    if (transaction) {
      setIsEditing(true);
      setCurrentTransaction(transaction);
      setTransactionData({
        description: transaction.description || '',
        amount: transaction.amount?.toString() || '', // amount dari transaksi biasanya angka
        date: transaction.date ? transaction.date.split('T')[0] : new Date().toISOString().split('T')[0],
        categoryId: transaction.categoryId || '',
      });
    } else {
      setIsEditing(false);
      setCurrentTransaction(null);
      setTransactionData({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        categoryId: '',
      });
    }
    setOpenFormDialog(true);
  };

  const handleCloseFormDialog = () => {
    setOpenFormDialog(false);
    setTimeout(() => {
        setIsEditing(false);
        setCurrentTransaction(null);
        setTransactionData({ description: '', amount: '', date: new Date().toISOString().split('T')[0], categoryId: '' });
        setFormError({});
    }, 300);
  };

  const handleFormSubmit = () => {
    if (!validateForm()) {
        console.error("Frontend: Validasi form gagal:", formError);
        // Tampilkan notifikasi error validasi form jika perlu
        let errorMessages = Object.values(formError).join(' ');
        if (!errorMessages) errorMessages = "Harap periksa kembali input Anda."; // Pesan default jika tidak ada error spesifik
        setNotification({ open: true, message: errorMessages, severity: 'error' });
        return;
    }

    // Data yang akan dikirim ke slice. Slice akan menangani parseFloat(amount) jika perlu.
    // categoryId sudah berupa ID (angka atau string angka) dari Select.
    const dataToDispatch = { 
      description: transactionData.description.trim(),
      amount: transactionData.amount, // Kirim sebagai string, slice akan mem-parse
      date: transactionData.date,
      categoryId: transactionData.categoryId 
    };
    
    // console.log("--- Frontend (TransactionsPage): Data akan di-dispatch (handleFormSubmit) ---", dataToDispatch);

    if (isEditing && currentTransaction && currentTransaction.id) {
      dispatch(updateTransaction({ ...dataToDispatch, id: currentTransaction.id }));
    } else {
      dispatch(createTransaction(dataToDispatch));
    }
  };
  
  const handleOpenDeleteDialog = (transaction) => {
    if (transaction && transaction.id) {
        setCurrentTransaction(transaction);
        setOpenDeleteDialog(true);
    } else {
        console.error("Transaksi tidak valid untuk dihapus:", transaction);
        setNotification({ open: true, message: "Error: Transaksi tidak valid untuk dihapus.", severity: 'error' });
    }
  };

  const handleCloseDeleteDialog = () => {
    setCurrentTransaction(null);
    setOpenDeleteDialog(false);
  };

  const handleDeleteConfirm = () => {
    if (currentTransaction && currentTransaction.id) {
      dispatch(deleteTransaction(currentTransaction.id));
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
  
  const paginatedTransactions = Array.isArray(transactions) 
    ? transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : [];

  const getCategoryName = (categoryId) => {
    if (isLoadingCategories && (!Array.isArray(categories) || categories.length === 0)) return 'Memuat kat...'; 
    if (!Array.isArray(categories) || categories.length === 0) return 'Tidak Ada Kategori';
    
    // Pastikan categoryId dan cat.id dibandingkan dengan tipe yang sama
    const idToCompare = Number(categoryId);
    const category = categories.find(cat => Number(cat.id) === idToCompare);
    return category ? category.name : 'Tidak Diketahui';
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'medium' }}>
        Manajemen Transaksi Pengeluaran
      </Typography>

      <Toolbar sx={{ pl: { sm: 0 }, pr: { xs: 0, sm: 0 }, mb: 2, justifyContent: 'space-between', p:0 }}>
        <Typography variant="h6" id="tableTitle" component="div">
          Daftar Pengeluaran
        </Typography>
        <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => handleOpenFormDialog()}
            disabled={isLoadingCategories || (isLoadingTransactions && !transactions.length)}
        >
            Tambah Transaksi
        </Button>
      </Toolbar>

      {isLoadingTransactions && paginatedTransactions.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 3, p:3, border: '1px dashed', borderColor: 'divider', borderRadius: '8px' }}>
          <CircularProgress sx={{mr: 2}} />
          <Typography color="text.secondary">Memuat data transaksi...</Typography>
        </Box>
      )}

      {!isLoadingTransactions && !isErrorTransactions && transactions.length === 0 && (
        <Paper elevation={0} sx={{p:3, textAlign: 'center', backgroundColor: 'transparent', mt: 2}}>
            <ReceiptLongIcon sx={{fontSize: 60, color: 'action.disabled', mb: 2}}/>
            <Typography variant="h6" color="text.secondary">Belum Ada Transaksi</Typography>
            <Typography color="text.secondary">Silakan tambahkan transaksi pengeluaran pertama Anda.</Typography>
        </Paper>
      )}
      
      {!isLoadingTransactions && isErrorTransactions && transactions.length === 0 && (
         <Alert severity="error" sx={{ mt: 2 }}>
            Gagal memuat transaksi: {transactionMessage}
        </Alert>
      )}

      {Array.isArray(transactions) && transactions.length > 0 && (
        <Paper elevation={0} sx={{ width: '100%', mb: 2, border: '1px solid', borderColor: 'divider', borderRadius: '12px' }}>
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <TableHead>
                <TableRow sx={{ '& th': { backgroundColor: 'grey.100' } }}> {/* Header tabel dengan background */}
                  <TableCell sx={{fontWeight: '600'}}>Tanggal</TableCell>
                  <TableCell sx={{fontWeight: '600'}}>Deskripsi</TableCell>
                  <TableCell sx={{fontWeight: '600'}} align="right">Jumlah</TableCell>
                  <TableCell sx={{fontWeight: '600'}}>Kategori</TableCell>
                  <TableCell sx={{fontWeight: '600'}} align="center">Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTransactions.map((transaction) => (
                  <TableRow hover key={transaction.id}>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell align="right">{formatCurrency(transaction.amount)}</TableCell>
                    <TableCell>
                        <Chip 
                            label={getCategoryName(transaction.categoryId)} 
                            size="small" 
                            variant="outlined"
                            color={getCategoryName(transaction.categoryId) === 'Tidak Diketahui' || getCategoryName(transaction.categoryId) === 'Memuat kat...' ? 'default' : 'primary'}
                        />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit Transaksi">
                        <IconButton onClick={() => handleOpenFormDialog(transaction)} size="small" sx={{mr:0.5}} disabled={isLoadingTransactions}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Hapus Transaksi">
                        <IconButton onClick={() => handleOpenDeleteDialog(transaction)} size="small" disabled={isLoadingTransactions}>
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
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={transactions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Baris:"
            labelDisplayedRows={({ from, to, count }) => `${from}–${to} dari ${count !== -1 ? count : `lebih dari ${to}`}`}
          />
        </Paper>
      )}

      <Dialog open={openFormDialog} onClose={handleCloseFormDialog} maxWidth="sm" fullWidth PaperProps={{component: 'form', onSubmit: (e) => {e.preventDefault(); handleFormSubmit();}}}>
        <DialogTitle>{isEditing ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus={!isEditing}
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
                startAdornment: (<InputAdornment position="start"><NotesIcon color="action" /></InputAdornment>),
            }}
            disabled={isLoadingTransactions}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="amount"
                label="Jumlah (Rp)"
                type="number"
                fullWidth
                variant="outlined"
                value={transactionData.amount}
                onChange={handleInputChange}
                error={!!formError.amount}
                helperText={formError.amount}
                InputProps={{
                    startAdornment: (<InputAdornment position="start"><AttachMoneyIcon color="action" /></InputAdornment>),
                    inputProps: { min: 0.01, step: "any" }
                }}
                disabled={isLoadingTransactions}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="date"
                label="Tanggal Transaksi"
                type="date"
                fullWidth
                variant="outlined"
                value={transactionData.date}
                onChange={handleInputChange}
                error={!!formError.date}
                helperText={formError.date}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                    startAdornment: (<InputAdornment position="start"><CalendarTodayIcon color="action" /></InputAdornment>),
                }}
                disabled={isLoadingTransactions}
              />
            </Grid>
          </Grid>
          <FormControl fullWidth margin="dense" sx={{ mt: 2 }} error={!!formError.categoryId} disabled={isLoadingTransactions || isLoadingCategories}>
            <InputLabel id="category-select-label">Kategori</InputLabel>
            <Select
              labelId="category-select-label"
              id="categoryId"
              name="categoryId"
              value={transactionData.categoryId}
              label="Kategori"
              onChange={handleInputChange}
              variant="outlined"
              MenuProps={{ // Untuk tampilan dropdown yang lebih baik
                PaperProps: {
                  style: {
                    maxHeight: 200, 
                  },
                },
              }}
            >
              <MenuItem value="" disabled>
                <em>Pilih Kategori...</em>
              </MenuItem>
              {isLoadingCategories && (!Array.isArray(categories) || categories.length === 0) ? (
                <MenuItem disabled><CircularProgress size={20} sx={{mr:1}}/> Memuat kategori...</MenuItem>
              ) : (
                Array.isArray(categories) && categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))
              )}
              {!isLoadingCategories && Array.isArray(categories) && categories.length === 0 && (
                  <MenuItem disabled><em>Belum ada kategori. Buat dulu di halaman Kategori.</em></MenuItem>
              )}
            </Select>
            {formError.categoryId && <Typography variant="caption" color="error" sx={{ml:1.75, mt:0.5}}>{formError.categoryId}</Typography>}
          </FormControl>
        </DialogContent>
        <DialogActions sx={{pb:2, pr:2}}>
          <Button onClick={handleCloseFormDialog} disabled={isLoadingTransactions}>Batal</Button>
          <Button type="submit" variant="contained" disabled={isLoadingTransactions}>
            {isLoadingTransactions ? <CircularProgress size={24} color="inherit"/> : (isEditing ? 'Simpan Perubahan' : 'Tambah')}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Konfirmasi Hapus Transaksi</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Apakah Anda yakin ingin menghapus transaksi "<b>{currentTransaction?.description || ''}</b>" sejumlah <b>{formatCurrency(currentTransaction?.amount || 0)}</b>? Tindakan ini tidak dapat diurungkan.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{pb:2, pr:2}}>
          <Button onClick={handleCloseDeleteDialog} disabled={isLoadingTransactions}>Batal</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" autoFocus disabled={isLoadingTransactions}>
            {isLoadingTransactions ? <CircularProgress size={24} color="inherit"/> : 'Hapus'}
          </Button>
        </DialogActions>
      </Dialog>

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