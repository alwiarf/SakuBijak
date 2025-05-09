// File: src/pages/auth/RegisterPage.jsx
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
  Alert
} from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import apiClient from '../../services/apiClient';
import { Link as RouterLink, useNavigate } from 'react-router-dom'; // IMPORT YANG BENAR

const RegisterPage = () => {
  const navigate = useNavigate(); // Aktifkan dan inisialisasi useNavigate

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      setError('Semua field wajib diisi.');
      setSnackbarOpen(true); // Tampilkan notifikasi error juga
      setSnackbarMessage('Semua field wajib diisi.');
      setSnackbarSeverity('error');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.');
      setSnackbarOpen(true);
      setSnackbarMessage('Password dan konfirmasi password tidak cocok.');
      setSnackbarSeverity('error');
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
        setError('Format email tidak valid.');
        setSnackbarOpen(true);
        setSnackbarMessage('Format email tidak valid.');
        setSnackbarSeverity('error');
        setLoading(false);
        return;
    }

    if (password.length < 6) {
        setError('Password minimal harus 6 karakter.');
        setSnackbarOpen(true);
        setSnackbarMessage('Password minimal harus 6 karakter.');
        setSnackbarSeverity('error');
        setLoading(false);
        return;
    }

    try {
      // --- AWAL BLOK MOCKUP ---
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Mock Registrasi berhasil untuk:', name, email);
      
      setSnackbarMessage('Registrasi berhasil! Anda akan diarahkan ke halaman login.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      setTimeout(() => {
        navigate('/login'); 
      }, 2500);
      // --- AKHIR BLOK MOCKUP ---
    } catch (err) {
      console.error('Error saat registrasi:', err);
      let errorMessage = 'Terjadi kesalahan saat registrasi. Silakan coba lagi.';
      if (err.response) {
        errorMessage = err.response.data.message || 'Registrasi gagal. Server error.';
      } else if (err.request) {
        errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi Anda.';
      }
      setError(errorMessage);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
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
              error={!!error && (error.includes('Nama') || error.includes('wajib'))}
              disabled={loading}
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
              error={!!error && (error.includes('Email') || error.includes('wajib') || error.includes('Format email'))}
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!error && (error.includes('Password') || error.includes('wajib') || error.includes('minimal harus') || error.includes('tidak cocok'))}
              disabled={loading}
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
              error={!!error && (error.includes('Konfirmasi') || error.includes('wajib') || error.includes('tidak cocok'))}
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
              color="secondary" 
              sx={{ mt: error ? 2 : 3, mb: 2, py: 1.5, position: 'relative' }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Daftar'}
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
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        // TransitionComponent={SlideTransition} // Bisa ditambahkan jika SlideTransition diimpor
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RegisterPage;
