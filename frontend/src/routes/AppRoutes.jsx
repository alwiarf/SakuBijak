// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
// Import halaman lain di sini nanti, contoh:
// import DashboardPage from '../pages/DashboardPage';
// import NotFoundPage from '../pages/NotFoundPage';

const AppRoutes = () => {
  // Contoh state untuk autentikasi (nantinya akan dari Redux atau Context)
  // Untuk sekarang, kita asumsikan token disimpan di localStorage
  const isAuthenticated = !!localStorage.getItem('authToken'); 

  return (
    <Routes>
      {/* Rute Publik */}
      {/* Jika pengguna sudah terautentikasi dan mencoba mengakses /login atau /register, arahkan ke dashboard */}
      <Route 
        path="/login" 
        element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} 
      />
      <Route 
        path="/register" 
        element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" replace />} 
      />

      {/* Rute Terproteksi (Contoh untuk Dashboard) */}
      {/* Jika belum ada DashboardPage, Anda bisa mengarahkannya ke halaman placeholder atau login */}
      <Route 
        path="/dashboard" 
        element={isAuthenticated ? (<div>Halaman Dashboard (Belum Dibuat)</div>) : <Navigate to="/login" replace />} 
      />
      
      {/* Rute Default */}
      {/* Jika mengakses root path '/', arahkan ke dashboard jika sudah login, atau ke login jika belum */}
      <Route 
        path="/" 
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
      />
      
      {/* Rute Not Found (Contoh) */}
      {/* Jika tidak ada DashboardPage, arahkan semua rute tak dikenal ke halaman utama (login/dashboard) */}
      <Route 
        path="*" 
        element={<Navigate to="/" replace />} 
      />
      {/* Alternatif untuk halaman 404 khusus:
      <Route path="*" element={<NotFoundPage />} /> 
      */}
    </Routes>
  );
};

export default AppRoutes;