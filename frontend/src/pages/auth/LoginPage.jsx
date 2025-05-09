// File: src/pages/auth/LoginPage.jsx
import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Link as MuiLink, // Memberi alias pada Link dari MUI
  Paper,
  Avatar,
  CircularProgress,
  Snackbar,
  Alert,
  Slide
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import apiClient from '../../services/apiClient';
import { Link as RouterLink, useNavigate } from 'react-router-dom'; // IMPORT YANG BENAR

// Transisi untuk Snackbar
function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const LoginPage = () => {
  const navigate = useNavigate(); // Inisialisasi useNavigate
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') return;
    setNotification({ ...notification, open: false });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Email dan password tidak boleh kosong.');
      setNotification({
        open: true,
        message: 'Email dan password tidak boleh kosong.',
        severity: 'error'
      });
      setLoading(false);
      return;
    }

    try {
      // Panggil API backend untuk login
      // Untuk sekarang, kita bisa mengomentari ini atau membuat mock response
      // karena backend belum siap.

      // --- AWAL BLOK UNTUK INTEGRASI API SEBENARNYA (AKTIFKAN NANTI) ---
      /*
      const response = await apiClient.post('/api/auth/login', {
        email: email,
        password: password,
      });

      console.log('Login berhasil:', response.data);
      // TODO: Simpan token autentikasi (misalnya di localStorage atau Redux state)
      // localStorage.setItem('authToken', response.data.token);
      // TODO: Arahkan pengguna ke halaman dashboard
      // navigate('/dashboard'); // Jika menggunakan react-router-dom
      setNotification({
        open: true,
        message: 'Login berhasil!',
        severity: 'success'
      });
      */
      // --- AKHIR BLOK UNTUK INTEGRASI API SEBENARNYA ---
      // --- AWAL BLOK MOCKUP ---
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (email === "user@example.com" && password === "password123") {
        console.log('Mock Login berhasil untuk:', email);
        localStorage.setItem('authToken', 'mockToken12345');
        setNotification({
          open: true,
          message: 'Login berhasil! Mengarahkan...',
          severity: 'success'
        });
        setTimeout(() => {         
          navigate('/dashboard'); 
        }, 1500);
      } else {
        setError('Login gagal. Email atau password salah.');
        setNotification({
          open: true,
          message: 'Login gagal. Email atau password salah.',
          severity: 'error'
        });
      }
      // --- AKHIR BLOK MOCKUP ---
    } catch (err) {
      console.error('Error saat login:', err);
      let errorMessage = 'Terjadi kesalahan. Silakan coba lagi.';
      if (err.response) {
        errorMessage = err.response.data.message || 'Login gagal. Periksa kembali kredensial Anda.';
      } else if (err.request) {
        errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
      }
      setError(errorMessage);
      setNotification({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // Menghapus position: 'absolute' agar lebih standar dengan flex centering dari App/Router
        overflow: 'auto', 
        bgcolor: 'background.default' // Pastikan tema diterapkan
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
              error={!!error.includes('Email') || (!!error && !error.includes('password') && !error.includes('koneksi') && !error.includes('kesalahan'))}
              disabled={loading}
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
              error={!!error.includes('password')}
              disabled={loading}
            />
            
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: error ? 2 : 3, 
                mb: 2, 
                py: 1.5, 
                position: 'relative',
                borderRadius: '4px', // Sesuai style Google
                textTransform: 'none', 
                fontWeight: 500,
                fontSize: '0.9rem',
                boxShadow: '0 1px 2px rgba(0,0,0,0.12)'
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>
            
            <Grid container justifyContent="space-between">
              <Grid item>
                <MuiLink href="#" variant="body2"> {/* Untuk Lupa Password, bisa jadi link biasa atau rute lain */}
                  Lupa password?
                </MuiLink>
              </Grid>
              <Grid item>
                {/* Menggunakan MuiLink sebagai wrapper dan component prop untuk RouterLink */}
                <MuiLink component={RouterLink} to="/register" variant="body2">
                  {"Belum punya akun? Daftar"}
                </MuiLink>
              </Grid>
            </Grid>
          </Box>
        </Paper>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 5 }}>
          {'© '}
          <MuiLink color="inherit" href="#"> {/* Ganti dengan URL Anda */}
            SakuBijak
          </MuiLink>{' '}
          {new Date().getFullYear()}
          {'. Dibuat oleh Alwi Arfan Solin (122140197).'}
        </Typography>
        
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          TransitionComponent={SlideTransition}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.severity}
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
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default LoginPage;
