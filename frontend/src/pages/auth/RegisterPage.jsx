// File: src/pages/auth/RegisterPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Link as MuiLink,
  Paper,
  Avatar,
  CircularProgress,
  Snackbar,
  Alert,
  Slide
} from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, resetAuthStates } from '../../features/auth/authSlice';

// Transisi untuk Snackbar
function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State lokal untuk input form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // State lokal untuk Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Mengambil state dari Redux store
  const { 
    isLoading, 
    isError, 
    isSuccess, // isSuccess dari Redux menandakan thunk berhasil (bukan berarti user langsung login)
    message 
  } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError && message) {
      setSnackbarMessage(message);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      dispatch(resetAuthStates());
    }

    // Jika registrasi sukses (berdasarkan state Redux)
    if (isSuccess && message.includes('Registrasi berhasil')) { // Lebih spesifik untuk pesan sukses registrasi
      setSnackbarMessage(message);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      // Arahkan ke halaman login setelah Snackbar tampil
      setTimeout(() => {
        navigate('/login');
        dispatch(resetAuthStates()); // Reset state sukses setelah navigasi
      }, 2500); // Beri waktu Snackbar untuk tampil
    }
  }, [isError, isSuccess, message, navigate, dispatch]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setSnackbarMessage('Semua field wajib diisi.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    if (password !== confirmPassword) {
      setSnackbarMessage('Password dan konfirmasi password tidak cocok.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setSnackbarMessage('Format email tidak valid.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    if (password.length < 6) {
      setSnackbarMessage('Password minimal harus 6 karakter.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    
    const userData = {
      name,
      email,
      password,
    };
    dispatch(registerUser(userData)); // Dispatch action registerUser
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'auto',
        bgcolor: 'background.default',
        py: 4 
      }}
    >
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: { xs: 3, sm: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 3,
            width: '100%',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 56, height: 56 }}>
            <PersonAddOutlinedIcon fontSize="large" />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mt: 2, mb: 1 }}>
            Daftar Akun SakuBijak
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            Buat akun baru untuk mulai mencatat pengeluaran Anda.
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Nama Lengkap"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Alamat Email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Konfirmasi Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
            
            {/* Pesan error dari form lokal bisa dihapus jika semua error ditangani via Snackbar Redux */}
            {/* {error && (
              <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                {error}
              </Typography>
            )} */}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary" 
              sx={{ 
                mt: 3, // Margin atas disesuaikan
                mb: 2, 
                py: 1.5, 
                position: 'relative',
                borderRadius: '4px',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.9rem',
                boxShadow: '0 1px 2px rgba(0,0,0,0.12)'
              }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Daftar'}
            </Button>
            
            <Grid container justifyContent="flex-end">
              <Grid item>
                <MuiLink component={RouterLink} to="/login" variant="body2">
                  Sudah punya akun? Login
                </MuiLink>
              </Grid>
            </Grid>
          </Box>
        </Paper>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 5 }}>
          {'© '}
          <MuiLink color="inherit" href="#">
            SakuBijak
          </MuiLink>{' '}
          {new Date().getFullYear()}
          {'. Dibuat oleh Alwi Arfan Solin (122140197).'}
        </Typography>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000} // Durasi bisa disesuaikan
        onClose={handleCloseSnackbar}
        TransitionComponent={SlideTransition}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RegisterPage;
