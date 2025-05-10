// File: src/pages/auth/LoginPage.jsx
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
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, resetAuthStates } from '../../features/auth/authSlice';

// Transisi untuk Snackbar
function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State lokal untuk input form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State lokal untuk Snackbar (akan dikontrol oleh state Redux)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Mengambil state dari Redux store
  const { 
    // user, // Bisa digunakan untuk menyapa pengguna atau keperluan lain
    isAuthenticated, 
    isLoading, 
    isError, 
    isSuccess, 
    message 
  } = useSelector((state) => state.auth);

  useEffect(() => {
    // Jika ada error dari Redux, tampilkan di Snackbar
    if (isError && message) {
      setSnackbarMessage(message);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      dispatch(resetAuthStates()); // Reset state error setelah ditampilkan
    }

    // Jika login sukses dan pengguna terautentikasi
    if (isSuccess && isAuthenticated && message.includes('Login berhasil')) { // Lebih spesifik untuk pesan sukses login
      setSnackbarMessage(message);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      // Pengalihan akan dilakukan setelah Snackbar tampil
      setTimeout(() => {
        navigate('/dashboard');
        dispatch(resetAuthStates()); // Reset state sukses setelah navigasi
      }, 1500); // Beri waktu Snackbar untuk tampil
    }

  }, [isError, isSuccess, isAuthenticated, message, navigate, dispatch]);


  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email || !password) {
      setSnackbarMessage('Email dan password tidak boleh kosong.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    
    const userData = {
      email,
      password,
    };
    dispatch(loginUser(userData)); // Dispatch action loginUser
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'auto', 
        bgcolor: 'background.default'
      }}
    >
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 4,
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
          <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
            <LockOutlinedIcon fontSize="large" />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mt: 2, mb: 1 }}>
            Login ke SakuBijak
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            Masukkan detail akun Anda untuk melanjutkan.
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Alamat Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading} // Nonaktifkan saat loading dari Redux
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading} // Nonaktifkan saat loading dari Redux
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
              disabled={isLoading} // Nonaktifkan saat loading dari Redux
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>
            
            <Grid container justifyContent="space-between">
              <Grid item>
                <MuiLink href="#" variant="body2">
                  Lupa password?
                </MuiLink>
              </Grid>
              <Grid item>
                <MuiLink component={RouterLink} to="/register" variant="body2">
                  {"Belum punya akun? Daftar"}
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
        
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000} // Durasi bisa disesuaikan
          onClose={handleCloseSnackbar}
          TransitionComponent={SlideTransition}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbarSeverity}
            variant="filled"
            sx={{ 
              width: '100%',
              borderRadius: '4px',
              fontWeight: 500,
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
              '& .MuiAlert-icon': {
                fontSize: '24px'
              }
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default LoginPage;
