// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';

import LandingPage from '../pages/LandingPage'; // Impor LandingPage
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ProtectedLayout from '../components/layout/ProtectedLayout';
import DashboardPage from '../pages/DashboardPage';
import CategoriesPage from '../pages/CategoriesPage';
import TransactionsPage from '../pages/TransactionsPage';

// Komponen untuk konten 404 di dalam layout
const NotFoundContent = () => (
    <Box sx={{textAlign: 'center', mt: 5, p:3}}>
      <Typography variant="h4" gutterBottom>404 - Halaman Tidak Ditemukan</Typography>
      <Typography variant="body1">Maaf, halaman yang Anda cari tidak ada.</Typography>
    </Box>
  );


const AppRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* Rute untuk Landing Page - menjadi halaman utama jika belum login */}
      <Route 
        path="/" 
        element={!isAuthenticated ? <LandingPage /> : <Navigate to="/dashboard" replace />} 
      />

      {/* Rute Publik Lainnya */}
      <Route 
        path="/login" 
        element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} 
      />
      <Route 
        path="/register" 
        element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" replace />} 
      />

      {/* Rute Terproteksi di dalam ProtectedLayout */}
      <Route 
        path="/dashboard" 
        element={
          isAuthenticated ? (
            <ProtectedLayout>
              <DashboardPage />
            </ProtectedLayout>
          ) : (
            // Jika mencoba akses dashboard tanpa auth, arahkan ke Landing Page (atau Login)
            <Navigate to="/" replace /> 
          )
        } 
      />
      <Route 
        path="/categories" 
        element={
          isAuthenticated ? (
            <ProtectedLayout>
              <CategoriesPage />
            </ProtectedLayout>
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/transactions"
        element={
          isAuthenticated ? (
            <ProtectedLayout>
              <TransactionsPage />
            </ProtectedLayout>
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      {/* Tambahkan rute terproteksi lainnya di sini */}
      
      {/* Rute Not Found */}
      {/* Jika path tidak cocok dan sudah login, tampilkan 404 dalam layout */}
      {/* Jika belum login, akan diarahkan ke Landing Page oleh logika di atas atau rute "/" */}
      <Route 
        path="*" 
        element={
          isAuthenticated ? (
            <ProtectedLayout>
              <NotFoundContent />
            </ProtectedLayout>
          ) : (
            // Jika belum login dan akses rute aneh, arahkan ke Landing Page
            <Navigate to="/" replace /> 
          )
        } 
      />
    </Routes>
  );
};

export default AppRoutes;
