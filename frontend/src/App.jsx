// src/App.jsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes'; // Impor konfigurasi rute kita

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
