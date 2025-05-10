import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, resetAuthStates } from '../../features/auth/authSlice';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
  Snackbar, // Untuk notifikasi logout
  Alert,    // Untuk notifikasi logout
  Slide     // Transisi untuk Snackbar
} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Ikon untuk logout
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'; // Ikon untuk SakuBijak

// Transisi untuk Snackbar
function SlideTransition(props) {
  return <Slide {...props} direction="down" />; // Arah transisi dari atas
}

const ProtectedLayout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); // Ambil data pengguna jika perlu

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  const handleLogout = () => {
    dispatch(logoutUser()); // Dispatch action logout
    dispatch(resetAuthStates()); // Reset state auth lainnya jika perlu
    setSnackbarMessage('Anda telah berhasil logout.');
    setSnackbarOpen(true);
    // Navigasi akan di-handle oleh AppRoutes yang mendeteksi perubahan isAuthenticated
    // atau bisa juga ditambahkan navigasi eksplisit setelah timeout di sini
    setTimeout(() => {
        navigate('/login');
    }, 1500); // Beri waktu snackbar tampil sebelum redirect
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar 
        position="sticky" // AppBar akan tetap di atas saat scroll
        sx={{ 
          backgroundColor: 'primary.main', // Menggunakan warna primer dari tema
          // Alternatif: Gaya Google dengan AppBar putih dan shadow tipis
          // backgroundColor: 'white',
          // color: 'text.primary',
          // boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 2px 6px 2px rgba(60,64,67,0.15)'
        }}
      >
        <Toolbar>
          <AccountBalanceWalletIcon sx={{ mr: 2 }} /> 
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            SakuBijak
          </Typography>
          {user && (
            <Typography variant="subtitle2" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
              Halo, {user.name || user.email}! {/* Tampilkan nama atau email pengguna */}
            </Typography>
          )}
          <Button 
            color="inherit" 
            onClick={handleLogout} 
            startIcon={<ExitToAppIcon />}
            sx={{ 
              borderColor: 'rgba(255,255,255,0.7)', // Border putih transparan
              // color: 'text.secondary', // Jika AppBar putih
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)', // Efek hover lembut
                // backgroundColor: 'rgba(0,0,0,0.04)', // Jika AppBar putih
              }
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      
      {/* Konten Utama Halaman */}
      <Container component="main" sx={{ flexGrow: 1, py: 3, mt: 2 }}> 
        {/* py: padding atas bawah, mt: margin atas sedikit dari AppBar */}
        {children}
      </Container>

      {/* Footer Sederhana (Opsional) */}
      <Box
        component="footer"
        sx={{
          py: 2,
          px: 2,
          mt: 'auto', // Mendorong footer ke bawah
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
          textAlign: 'center'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {'© SakuBijak '}
          {new Date().getFullYear()}
          {'. Dibuat oleh Alwi Arfan Solin.'}
        </Typography>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        TransitionComponent={SlideTransition}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Notifikasi di atas tengah
      >
        <Alert onClose={handleCloseSnackbar} severity="success" variant="filled" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProtectedLayout;
