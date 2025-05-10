// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ProtectedLayout from '../components/layout/ProtectedLayout';
import DashboardPage from '../pages/DashboardPage';
import CategoriesPage from '../pages/CategoriesPage'; // Impor CategoriesPage

// Placeholder untuk halaman lain yang mungkin Anda buat
// const TransactionsPage = () => <div>Halaman Transaksi</div>;
// const ProfilePage = () => <div>Halaman Profil Pengguna</div>;

// Komponen untuk konten 404 di dalam layout
const NotFoundContent = () => (
    <Box sx={{textAlign: 'center', mt: 5, p:3}}> {/* Tambahkan Box dan padding */}
      <Typography variant="h4" gutterBottom>404 - Halaman Tidak Ditemukan</Typography>
      <Typography variant="body1">Maaf, halaman yang Anda cari tidak ada.</Typography>
    </Box>
  );


const AppRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* Rute Publik */}
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
            <Navigate to="/login" replace />
          )
        } 
      />
      <Route 
        path="/categories" 
        element={
          isAuthenticated ? (
            <ProtectedLayout>
              <CategoriesPage /> {/* Tambahkan rute untuk CategoriesPage */}
            </ProtectedLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      {/* Tambahkan rute terproteksi lainnya di sini, contoh: */}
      {/* <Route 
        path="/transactions" 
        element={isAuthenticated ? <ProtectedLayout><TransactionsPage /></ProtectedLayout> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/profile" 
        element={isAuthenticated ? <ProtectedLayout><ProfilePage /></ProtectedLayout> : <Navigate to="/login" replace />} 
      />
      */}
      
      {/* Rute Default */}
      <Route 
        path="/" 
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
      />
      
      {/* Rute Not Found */}
      <Route 
        path="*" 
        element={
          isAuthenticated ? (
            <ProtectedLayout>
              <NotFoundContent />
            </ProtectedLayout>
          ) : (
            <Navigate to="/login" replace /> 
          )
        } 
      />
    </Routes>
  );
};

export default AppRoutes;
