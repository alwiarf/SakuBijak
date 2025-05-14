// src/pages/DashboardPage.jsx
import React from 'react';
import { 
  Typography, 
  Paper, 
  Grid, 
  Box, 
  Avatar,
  Divider,
  Button,
  useTheme // Untuk mengakses objek tema
} from '@mui/material';
import { alpha } from '@mui/material/styles'; // Impor alpha untuk opacity
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import DonutLargeOutlinedIcon from '@mui/icons-material/DonutLargeOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';
import SpeedIcon from '@mui/icons-material/Speed';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigate } from 'react-router-dom';

// Komponen Card Kustom untuk Dashboard
const SummaryCard = ({ title, value, detail, icon, color = 'primary.main', action = null }) => {
  const theme = useTheme(); // Akses objek tema
  
  // Fungsi untuk mendapatkan warna dari path tema atau menggunakan warna langsung
  const getColorValue = (colorInput) => {
    if (typeof colorInput === 'string' && colorInput.includes('.')) {
      const [palette, shade] = colorInput.split('.');
      return theme.palette[palette]?.[shade] || theme.palette.primary.main; // Fallback ke primary.main
    }
    return colorInput; // Asumsi ini adalah kode warna valid (misal, hex)
  };

  const mainColor = getColorValue(color);
  const avatarBgColor = alpha(mainColor, 0.12); // Opacity 12% untuk background Avatar
  const iconColor = mainColor; // Warna ikon adalah warna utama

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        height: '100%',
        borderRadius: '16px',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          borderColor: mainColor,
          boxShadow: `0 4px 16px 0 ${alpha(mainColor, 0.2)}`, // Shadow lebih jelas dengan warna kartu
        }
      }}
    >
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 500, 
              color: 'text.secondary', 
              mr: 2, // Tambah margin kanan pada judul agar tidak menempel ikon
              // Opsi untuk teks panjang:
              // whiteSpace: 'nowrap',
              // overflow: 'hidden',
              // textOverflow: 'ellipsis',
            }}
          >
            {title}
          </Typography>
          <Avatar sx={{ bgcolor: avatarBgColor, color: iconColor, width: 48, height: 48 }}> 
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
            startIcon={action.icon || <AddCircleOutlineIcon fontSize="small"/>}
            sx={{ 
                mt: 2, 
                alignSelf: 'flex-start', 
                color: mainColor, 
                fontWeight: 500,
                '&:hover': {backgroundColor: alpha(mainColor, 0.08)} 
            }}
        >
            {action.label}
        </Button>
      )}
    </Paper>
  );
};


const DashboardPage = () => {
  const navigate = useNavigate();
  const theme = useTheme(); // Akses tema di sini juga jika perlu

  const summaryData = [
    {
      title: "Pengeluaran Bulan Ini",
      value: "Rp 1.250.000",
      detail: "Total dari semua transaksi bulan ini.",
      icon: <AccountBalanceWalletOutlinedIcon />,
      color: 'primary.main', // Ini akan di-resolve oleh getColorValue di SummaryCard
      action: { label: "Lihat Transaksi", onClick: () => navigate('/transactions'), icon: <ReceiptOutlinedIcon fontSize="small"/> }
    },
    {
      title: "Jumlah Kategori",
      value: "4 Kategori",
      detail: "Kategori pengeluaran yang aktif.",
      icon: <DonutLargeOutlinedIcon />,
      color: 'secondary.main', // Ini akan di-resolve
      action: { label: "Kelola Kategori", onClick: () => navigate('/categories'), icon: <AddCircleOutlineIcon fontSize="small"/> }
    },
    {
      title: "Transaksi Terakhir",
      value: "Rp 75.000",
      detail: "Pembelian Kopi Susu",
      icon: <ReceiptOutlinedIcon />,
      color: theme.palette.warning.main, // Menggunakan warna dari tema secara eksplisit
      action: { label: "Tambah Transaksi", onClick: () => navigate('/transactions'), icon: <AddCircleOutlineIcon fontSize="small"/> }
    },
  ];

  return (
    <Box sx={{pb: 4}}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), width: 48, height: 48, mr: 2 }}>
            <SpeedIcon sx={{color: 'primary.main', fontSize: '28px'}}/>
        </Avatar>
        <Box>
            <Typography 
            variant="h4" 
            sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}
            >
            Dashboard SakuBijak
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
                Selamat datang kembali! Berikut ringkasan keuangan Anda.
            </Typography>
        </Box>
      </Box>
      <Divider sx={{my: 3}}/>

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
              color={data.color} // Prop color bisa berupa path tema atau hex
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
        }}
      >
        <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), /* Menggunakan alpha untuk konsistensi */ width: 60, height: 60, mb: 2}}>
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
      </Paper>
    </Box>
  );
};

export default DashboardPage;
