// src/pages/DashboardPage.jsx
import React from 'react';
import { Typography, Paper, Grid, Box } from '@mui/material';

const DashboardPage = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'medium' }}>
        Dashboard SakuBijak
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 180, justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h6" color="primary">Total Pengeluaran Bulan Ini</Typography>
            <Typography component="p" variant="h4" sx={{ mt: 1 }}>
              Rp 0 {/* Placeholder */}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1, mt:1 }}>
              (Data akan diisi nanti)
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 180, justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h6" color="secondary">Transaksi Terakhir</Typography>
            <Typography component="p" variant="body1" sx={{ mt: 1 }}>
              Belum ada transaksi {/* Placeholder */}
            </Typography>
             <Typography color="text.secondary" sx={{ flex: 1, mt:1 }}>
              (Data akan diisi nanti)
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 180, justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h6">Pengeluaran per Kategori</Typography>
            <Typography component="p" variant="body1" sx={{ mt: 1 }}>
              Visualisasi nanti di sini {/* Placeholder */}
            </Typography>
             <Typography color="text.secondary" sx={{ flex: 1, mt:1 }}>
              (Data akan diisi nanti)
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;