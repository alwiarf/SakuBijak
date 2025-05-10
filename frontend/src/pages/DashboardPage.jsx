// src/pages/DashboardPage.jsx
import React from 'react';
import { 
  Typography, 
  Paper, 
  Grid, 
  Box, 
  Avatar,
  Divider, // Untuk garis pemisah
  Button // Untuk potensi aksi
} from '@mui/material';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import DonutLargeOutlinedIcon from '@mui/icons-material/DonutLargeOutlined';
import BarChartIcon from '@mui/icons-material/BarChart'; // Ikon untuk placeholder grafik
import SpeedIcon from '@mui/icons-material/Speed';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // Untuk tombol aksi
import { useNavigate } from 'react-router-dom'; // Untuk navigasi tombol aksi

// Komponen Card Kustom untuk Dashboard
const SummaryCard = ({ title, value, detail, icon, color = 'primary.main', action = null }) => {
  return (
    <Paper 
      elevation={0} // Mengurangi shadow, lebih flat ala Google
      sx={{ 
        p: 3, // Padding lebih seragam
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', // Konten terdistribusi vertikal
        height: '100%', // Agar semua kartu sama tinggi
        borderRadius: '16px', // Border radius lebih besar
        border: '1px solid', // Border tipis
        borderColor: 'divider', // Warna border dari tema
        // backgroundColor: 'background.paper', // Warna latar default paper
        transition: 'border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          borderColor: color, // Warna border berubah saat hover
          boxShadow: `0 4px 12px 0 ${color}33`, // Shadow lembut dengan warna kartu
        }
      }}
    >
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'text.secondary' }}>
            {title}
          </Typography>
          <Avatar sx={{ bgcolor: `${color}20`, /* Warna latar lebih soft */ color: color, width: 44, height: 44 }}> 
            {icon}
          </Avatar>
        </Box>
        <Typography component="p" variant="h3" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.5, lineHeight: 1.2 }}>
          {value}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          {detail}
        </Typography>
      </Box>
      {action && (
        <Button 
            variant="text" 
            size="small" 
            onClick={action.onClick} 
            startIcon={action.icon || <AddCircleOutlineIcon />}
            sx={{ mt: 2, alignSelf: 'flex-start', color: color, '&:hover': {backgroundColor: `${color}1A`} }}
        >
            {action.label}
        </Button>
      )}
    </Paper>
  );
};


const DashboardPage = () => {
  const navigate = useNavigate(); // Untuk tombol aksi

  // Data placeholder (nantinya akan dari state atau API)
  const summaryData = [
    {
      title: "Pengeluaran Bulan Ini",
      value: "Rp 1.250.000",
      detail: "Total dari semua transaksi bulan ini.",
      icon: <AccountBalanceWalletOutlinedIcon />,
      color: 'primary.main',
      action: { label: "Lihat Transaksi", onClick: () => navigate('/transactions'), icon: <ReceiptOutlinedIcon fontSize="small"/> }
    },
    {
      title: "Jumlah Kategori",
      value: "4 Kategori", // Contoh data
      detail: "Kategori pengeluaran yang aktif.",
      icon: <DonutLargeOutlinedIcon />,
      color: 'secondary.main',
      action: { label: "Kelola Kategori", onClick: () => navigate('/categories'), icon: <AddCircleOutlineIcon fontSize="small"/> }
    },
    {
      title: "Transaksi Terakhir", // Kartu ketiga bisa jadi ringkasan lain atau link cepat
      value: "Rp 75.000",
      detail: "Pembelian Kopi Susu",
      icon: <ReceiptOutlinedIcon />,
      color: '#FFA000', // Oranye
      action: { label: "Tambah Transaksi", onClick: () => {/* Logika buka dialog transaksi */ navigate('/transactions')}, icon: <AddCircleOutlineIcon fontSize="small"/> }
    },
  ];

  return (
    <Box sx={{pb: 4}}> {/* Padding bawah untuk keseluruhan halaman */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.light', width: 48, height: 48, mr: 2 }}>
            <SpeedIcon sx={{color: 'primary.main', fontSize: '28px'}}/>
        </Avatar>
        <Box>
            <Typography 
            variant="h4" 
            sx={{ 
                fontWeight: 700, // Lebih tebal
                color: 'text.primary',
                lineHeight: 1.2
            }}
            >
            Dashboard SakuBijak
            </Typography>
        </Box>
      </Box>
      <Divider sx={{my: 3}}/> {/* Pemisah antar bagian */}

      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2.5, color: 'text.primary' }}>
        Ringkasan Cepat
      </Typography>
      <Grid container spacing={3}>
        {summaryData.map((data, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <SummaryCard
              title={data.title}
              value={data.value}
              detail={data.detail}
              icon={data.icon}
              color={data.color}
              action={data.action}
            />
          </Grid>
        ))}
      </Grid>

      <Divider sx={{my: 4}}/>

      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2.5, color: 'text.primary' }}>
        Analisis Pengeluaran
      </Typography>
      <Paper 
        elevation={0}
        sx={{ 
            p: 3, 
            borderRadius: '16px',
            border: '1px solid',
            borderColor: 'divider',
            minHeight: 350,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            // backgroundColor: 'background.paper'
        }}
      >
        <Avatar sx={{ bgcolor: 'primary.lighter', width: 60, height: 60, mb: 2}}> {/* Warna lebih soft untuk background avatar */}
            <BarChartIcon sx={{color: 'primary.main', fontSize: '32px'}}/>
        </Avatar>
        <Typography variant="h6" sx={{ mb: 1, color: 'text.primary' }}>
          Grafik Pengeluaran Mingguan
        </Typography>
        <Typography color="text.secondary" sx={{maxWidth: '400px', mb: 2}}>
            Visualisasikan tren pengeluaran Anda dari waktu ke waktu untuk mendapatkan wawasan yang lebih baik.
        </Typography>
        <Button variant="outlined" color="primary" onClick={() => alert('Fitur grafik segera hadir!')}>
            Lihat Detail Grafik (Segera Hadir)
        </Button>
        {/* Anda bisa menggunakan library chart seperti Recharts atau Chart.js di sini */}
      </Paper>
    </Box>
  );
};

export default DashboardPage;
