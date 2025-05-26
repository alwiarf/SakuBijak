// src/pages/TransactionsPage.jsx
import React, { useEffect, useState, useCallback, useMemo } from 'react'; // Tambahkan useMemo
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Button, TextField, IconButton, Paper, CircularProgress,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Snackbar, Alert, Slide, Grid, Tooltip, MenuItem, FormControl,
  InputLabel, Select, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, Toolbar, InputAdornment, Chip
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NotesIcon from '@mui/icons-material/Notes';

import {
  fetchTransactions, createTransaction, updateTransaction,
  deleteTransaction, resetTransactionStatus,
} from '../features/transactions/transactionSlice';
import { fetchCategories } from '../features/categories/categorySlice';

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const formatCurrency = (amount) => {
  let numAmount = parseFloat(amount);
  if (isNaN(numAmount)) numAmount = 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(numAmount);
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  try {
    const date = new Date(dateString + 'T00:00:00');
    if (isNaN(date.getTime())) return "Tanggal Tidak Valid";
    return date.toLocaleDateString('id-ID', options);
  } catch (e) { return "Tanggal Error"; }
};

const TransactionsPage = () => {
  const dispatch = useDispatch();
  
  const { 
    transactions, isLoading: isLoadingTransactions,
    isError: isErrorTransactions, isSuccess: isSuccessTransactionAction,
    message: transactionMessage 
  } = useSelector((state) => state.transactions);
  
  const { 
    categories, isLoading: isLoadingCategories 
  } = useSelector((state) => state.categories);

  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [transactionData, setTransactionData] = useState({
    description: '', amount: '', date: new Date().toISOString().split('T')[0], category_id: '',
  });
  const [formError, setFormError] = useState({});
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchCategories());
  }, [dispatch]);

  // useEffect untuk logging data kategori ketika berubah (bisa di-uncomment untuk debug)
  // useEffect(() => {
  //   if (!isLoadingCategories && Array.isArray(categories)) {
  //     console.log("TRANSACTIONSPAGE - Data Kategori dari Redux:", JSON.stringify(categories.map(c => ({id: c.id, name: c.name, typeId: typeof c.id}))));
  //   }
  //   if (!isLoadingTransactions && Array.isArray(transactions)) {
  //      console.log("TRANSACTIONSPAGE - Data Transaksi dari Redux:", JSON.stringify(transactions.map(t => ({id: t.id, category_id: t.category_id, typeCatId: typeof t.category_id }))));
  //   }
  // }, [categories, isLoadingCategories, transactions, isLoadingTransactions]);

  const handleCloseFormDialog = useCallback(() => {
    setOpenFormDialog(false);
    setTimeout(() => {
        setIsEditing(false); setCurrentTransaction(null);
        setTransactionData({ description: '', amount: '', date: new Date().toISOString().split('T')[0], category_id: '' });
        setFormError({});
    }, 300);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setCurrentTransaction(null); setOpenDeleteDialog(false);
  }, []);

  useEffect(() => {
    if ((isErrorTransactions || isSuccessTransactionAction) && transactionMessage) {
      setNotification({ open: true, message: transactionMessage, severity: isErrorTransactions ? 'error' : 'success' });
      dispatch(resetTransactionStatus());
      if (isSuccessTransactionAction) {
        if (openFormDialog) handleCloseFormDialog();
        if (openDeleteDialog) handleCloseDeleteDialog();
      }
    }
  }, [isErrorTransactions, isSuccessTransactionAction, transactionMessage, dispatch, openFormDialog, openDeleteDialog, handleCloseFormDialog, handleCloseDeleteDialog]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setTransactionData(prevData => ({ ...prevData, [name]: value }));
    // Hapus error untuk field yang sedang diubah saja
    if (formError[name]) {
        setFormError(prevErrors => {
            const newErrors = {...prevErrors};
            delete newErrors[name];
            return newErrors;
        });
    }
  }, [formError]); // Hanya bergantung pada formError untuk meresetnya
  
  const validateForm = useCallback(() => {
    const errors = {}; // Buat objek error baru setiap validasi
    if (!transactionData.description.trim()) errors.description = "Deskripsi tidak boleh kosong.";
    const amountValue = parseFloat(transactionData.amount);
    if (isNaN(amountValue) || amountValue <= 0) {
        errors.amount = "Jumlah harus angka positif.";
    }
    if (!transactionData.date) errors.date = "Tanggal tidak boleh kosong.";
    if (transactionData.category_id === '' || transactionData.category_id == null) {
      errors.category_id = "Kategori harus dipilih.";
    }
    setFormError(errors);
    return Object.keys(errors).length === 0;
  }, [transactionData]);

  const handleOpenFormDialog = useCallback((transaction = null) => {
    setFormError({});
    if (transaction) {
      setIsEditing(true);
      setCurrentTransaction(transaction);
      setTransactionData({
        description: transaction.description || '',
        amount: transaction.amount?.toString() || '',
        date: transaction.date ? (String(transaction.date).includes('T') ? transaction.date.split('T')[0] : transaction.date) : new Date().toISOString().split('T')[0],
        category_id: transaction.category_id !== null && typeof transaction.category_id !== 'undefined' ? String(transaction.category_id) : '',
      });
    } else {
      setIsEditing(false);
      setCurrentTransaction(null);
      setTransactionData({ description: '', amount: '', date: new Date().toISOString().split('T')[0], category_id: '' });
    }
    setOpenFormDialog(true);
  }, []);

  const handleFormSubmit = useCallback(() => {
    if (!validateForm()) {
        // Gabungkan semua pesan error dari state formError untuk ditampilkan di Snackbar
        let errorMessages = Object.values(formError).filter(Boolean).join(' ');
        if (errorMessages.length === 0 && !transactionData.description.trim()) errorMessages = "Deskripsi tidak boleh kosong."; // Default jika formError belum terupdate cepat
        else if (errorMessages.length === 0 && (isNaN(parseFloat(transactionData.amount)) || parseFloat(transactionData.amount) <= 0)) errorMessages = "Jumlah harus angka positif.";
        else if (errorMessages.length === 0 && !transactionData.date) errorMessages = "Tanggal tidak boleh kosong.";
        else if (errorMessages.length === 0 && (transactionData.category_id === '' || transactionData.category_id == null)) errorMessages = "Kategori harus dipilih.";
        
        if (!errorMessages) errorMessages = "Harap periksa kembali input Anda.";
        setNotification({ open: true, message: errorMessages, severity: 'error' });
        return;
    }

    // Pastikan field category_id ada di dataToDispatch
    const dataToDispatch = { 
      description: transactionData.description.trim(),
      amount: transactionData.amount, 
      date: transactionData.date,
      // Gunakan nama field yang konsisten dengan state dan apa yang diharapkan slice
      categoryId: transactionData.category_id // Slice akan mengubah ini menjadi category_id jika perlu
    };
        
    if (isEditing && currentTransaction && currentTransaction.id) {
      dispatch(updateTransaction({ ...dataToDispatch, id: currentTransaction.id }));
    } else {
      dispatch(createTransaction(dataToDispatch));
    }
  }, [dispatch, transactionData, isEditing, currentTransaction, validateForm, formError]);
  
  const handleOpenDeleteDialog = useCallback((transaction) => {
    if (transaction && transaction.id) {
        setCurrentTransaction(transaction); setOpenDeleteDialog(true);
    } else {
        setNotification({ open: true, message: "Error: Transaksi tidak valid untuk dihapus.", severity: 'error' });
    }
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (currentTransaction && currentTransaction.id) {
      dispatch(deleteTransaction(currentTransaction.id));
    }
  }, [dispatch, currentTransaction]);

  const handleCloseNotification = useCallback((event, reason) => {
    setNotification(prev => ({ ...prev, open: false }));
  }, []);
  
  const handleChangePage = useCallback((event, newPage) => { setPage(newPage); }, []);
  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10)); setPage(0);
  }, []);
  
  const getCategoryName = useCallback((transactionCategoryId) => {
    if (isLoadingCategories && (!Array.isArray(categories) || categories.length === 0)) return 'Memuat...'; 
    if (!Array.isArray(categories) || categories.length === 0) return 'Tidak Ada Kategori';
    if (transactionCategoryId === null || typeof transactionCategoryId === 'undefined' || String(transactionCategoryId).trim() === '') return 'Belum Dikategorikan';
    const idToCompare = Number(String(transactionCategoryId).trim());
    if (isNaN(idToCompare)) return 'ID Kategori Invalid';
    const category = categories.find(cat => cat && typeof cat.id !== 'undefined' && Number(String(cat.id).trim()) === idToCompare);
    return category ? category.name : 'Tidak Diketahui';
  }, [categories, isLoadingCategories]);

  const paginatedTransactions = useMemo(() => 
    Array.isArray(transactions) 
      ? transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : [],
  [transactions, page, rowsPerPage]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'medium' }}>
        Manajemen Transaksi Pengeluaran
      </Typography>

      <Toolbar sx={{ pl: { sm: 0 }, pr: { xs: 0, sm: 0 }, mb: 2, justifyContent: 'space-between', p:0 }}>
        <Typography variant="h6" id="tableTitle" component="div">Daftar Pengeluaran</Typography>
        <Button
            variant="contained" startIcon={<AddCircleOutlineIcon />}
            onClick={() => handleOpenFormDialog()}
            disabled={(isLoadingCategories && (!Array.isArray(categories) || categories.length === 0)) || (isLoadingTransactions && paginatedTransactions.length === 0 && page === 0)}
        >
            Tambah Transaksi
        </Button>
      </Toolbar>

      {isLoadingTransactions && paginatedTransactions.length === 0 && page === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 3, p:3, border: '1px dashed', borderColor: 'divider', borderRadius: '8px' }}>
          <CircularProgress sx={{mr: 2}} /> <Typography color="text.secondary">Memuat data transaksi...</Typography>
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
         <Alert severity="error" sx={{ mt: 2 }}>Gagal memuat transaksi: {transactionMessage}</Alert>
      )}

      {Array.isArray(transactions) && transactions.length > 0 && (
        <Paper elevation={0} sx={{ width: '100%', mb: 2, border: '1px solid', borderColor: 'divider', borderRadius: '12px' }}>
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <TableHead>
                <TableRow sx={{ '& th': { backgroundColor: 'grey.100', fontWeight: '600' } }}>
                  <TableCell>Tanggal</TableCell><TableCell>Deskripsi</TableCell>
                  <TableCell align="right">Jumlah</TableCell><TableCell>Kategori</TableCell>
                  <TableCell align="center">Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTransactions.map((transaction) => {
                  const categoryNameToDisplay = getCategoryName(transaction.category_id); // Gunakan category_id (underscore)
                  return (
                    <TableRow hover key={transaction.id}>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell align="right">{formatCurrency(transaction.amount)}</TableCell>
                      <TableCell>
                          <Chip 
                              label={categoryNameToDisplay} size="small" variant="outlined"
                              color={categoryNameToDisplay.includes('Tidak') || categoryNameToDisplay.includes('Memuat') || categoryNameToDisplay.includes('Invalid') || categoryNameToDisplay.includes('Kosong') || categoryNameToDisplay.includes('Belum') ? 'default' : 'primary'}
                          />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit Transaksi"><span><IconButton onClick={() => handleOpenFormDialog(transaction)} size="small" sx={{mr:0.5}} disabled={isLoadingTransactions}><EditIcon fontSize="small" /></IconButton></span></Tooltip>
                        <Tooltip title="Hapus Transaksi"><span><IconButton onClick={() => handleOpenDeleteDialog(transaction)} size="small" disabled={isLoadingTransactions}><DeleteIcon fontSize="small" /></IconButton></span></Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]} component="div"
            count={transactions.length} rowsPerPage={rowsPerPage} page={page}
            onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Baris:"
            labelDisplayedRows={({ from, to, count }) => `${from}–${to} dari ${count !== -1 ? count : `lebih dari ${to}`}`}
          />
        </Paper>
      )}

      <Dialog open={openFormDialog} onClose={handleCloseFormDialog} maxWidth="sm" fullWidth PaperProps={{component: 'form', onSubmit: (e) => {e.preventDefault(); handleFormSubmit();}}}>
        <DialogTitle>{isEditing ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus={!isEditing} margin="dense" name="description" label="Deskripsi Pengeluaran" type="text" fullWidth variant="outlined" value={transactionData.description} onChange={handleInputChange} error={!!formError.description} helperText={formError.description} sx={{ mb: 2 }} InputProps={{ startAdornment: (<InputAdornment position="start"><NotesIcon color="action" /></InputAdornment>)}} disabled={isLoadingTransactions} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField margin="dense" name="amount" label="Jumlah (Rp)" type="number" fullWidth variant="outlined" value={transactionData.amount} onChange={handleInputChange} error={!!formError.amount} helperText={formError.amount} InputProps={{ startAdornment: (<InputAdornment position="start"><AttachMoneyIcon color="action" /></InputAdornment>), inputProps: { min: 0.01, step: "any" }}} disabled={isLoadingTransactions} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField margin="dense" name="date" label="Tanggal Transaksi" type="date" fullWidth variant="outlined" value={transactionData.date} onChange={handleInputChange} error={!!formError.date} helperText={formError.date} InputLabelProps={{ shrink: true }} InputProps={{ startAdornment: (<InputAdornment position="start"><CalendarTodayIcon color="action" /></InputAdornment>) }} disabled={isLoadingTransactions} />
            </Grid>
          </Grid>
          <FormControl fullWidth margin="dense" sx={{ mt: 2 }} error={!!formError.category_id} disabled={isLoadingTransactions || isLoadingCategories}>
            <InputLabel id="category-select-label">Kategori</InputLabel>
            <Select
              labelId="category-select-label"
              id="category_id" // Sesuaikan dengan state
              name="category_id" // Sesuaikan dengan state
              value={transactionData.category_id} // Bind ke transactionData.category_id
              label="Kategori"
              onChange={handleInputChange}
              variant="outlined"
              MenuProps={{ PaperProps: { style: { maxHeight: 224 } } }}
            >
              <MenuItem value="" disabled><em>Pilih Kategori...</em></MenuItem>
              {isLoadingCategories && (!Array.isArray(categories) || categories.length === 0) ? (
                <MenuItem disabled sx={{justifyContent: 'center'}}><CircularProgress size={20}/></MenuItem>
              ) : (
                Array.isArray(categories) && categories.map((category) => (
                  <MenuItem key={category.id} value={String(category.id)}> {/* Value di Select adalah string ID */}
                    {category.name}
                  </MenuItem>
                ))
              )}
              {!isLoadingCategories && Array.isArray(categories) && categories.length === 0 && (
                  <MenuItem disabled><em>Belum ada kategori.</em></MenuItem>
              )}
            </Select>
            {formError.category_id && <Typography variant="caption" color="error" sx={{ml:1.75, mt:0.5}}>{formError.category_id}</Typography>}
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
        <DialogContent><DialogContentText>Apakah Anda yakin ingin menghapus transaksi "<b>{currentTransaction?.description || ''}</b>" sejumlah <b>{formatCurrency(currentTransaction?.amount || 0)}</b>? Tindakan ini tidak dapat diurungkan.</DialogContentText></DialogContent>
        <DialogActions sx={{pb:2, pr:2}}>
          <Button onClick={handleCloseDeleteDialog} disabled={isLoadingTransactions}>Batal</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" autoFocus disabled={isLoadingTransactions}>{isLoadingTransactions ? <CircularProgress size={24} color="inherit"/> : 'Hapus'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={notification.open} autoHideDuration={4000} onClose={handleCloseNotification} TransitionComponent={SlideTransition} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert key={notification.message} onClose={handleCloseNotification} severity={notification.severity} variant="filled" elevation={6} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TransactionsPage;