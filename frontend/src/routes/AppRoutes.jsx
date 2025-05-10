// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Impor useSelector

import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ProtectedLayout from '../components/layout/ProtectedLayout'; // Impor ProtectedLayout yang benar
import DashboardPage from '../pages/DashboardPage'; // Impor DashboardPage yang sebenarnya

// Placeholder untuk halaman lain yang mungkin Anda buat
// const TransactionsPage = () => <div>Halaman Transaksi</div>;
// const CategoriesPage = () => <div>Halaman Kategori</div>;
// const ProfilePage = () => <div>Halaman Profil Pengguna</div>;
const NotFoundContent = () => ( // Komponen untuk konten 404 di dalam layout
    <div>
      <h2>404 - Halaman Tidak Ditemukan</h2>
      <p>Maaf, halaman yang Anda cari tidak ada.</p>
    </div>
  );


const AppRoutes = () => {
  // Mengambil status autentikasi dari Redux store
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
              <DashboardPage /> {/* Menggunakan komponen DashboardPage yang sebenarnya */}
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
        path="/categories" 
        element={isAuthenticated ? <ProtectedLayout><CategoriesPage /></ProtectedLayout> : <Navigate to="/login" replace />} 
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
              <NotFoundContent /> {/* Menggunakan komponen konten 404 */}
            </ProtectedLayout>
          ) : (
            // Jika ingin halaman 404 publik yang berbeda saat belum login:
            // <PublicNotFoundPage /> 
            // Untuk sekarang, arahkan ke login jika rute tidak dikenal dan belum auth
            <Navigate to="/login" replace /> 
          )
        } 
      />
    </Routes>
  );
};

export default AppRoutes;
