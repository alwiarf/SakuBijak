import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Typography, Paper, Grid, Box, Avatar, Divider, Button,
  useTheme, CircularProgress, Alert, List, ListItem,
  ListItemText, ListItemAvatar
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import DonutLargeOutlinedIcon from '@mui/icons-material/DonutLargeOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';
import SpeedIcon from '@mui/icons-material/Speed';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

import { fetchDashboardSummary } from '../features/transactions/transactionSlice';

// Fungsi format mata uang
const formatCurrency = (amount) => {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(amount);
};

// Palet warna untuk Bar Chart
const BAR_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919', '#FF40E0', '#40E0D0'];


const SummaryCard = ({ title, value, detail, icon, color = 'primary.main', action = null, isLoading = false }) => {
    const theme = useTheme();
    const getColorValue = (colorInput) => {
      if (typeof colorInput === 'string' && colorInput.includes('.')) {
        const [palette, shade] = colorInput.split('.');
        return theme.palette[palette]?.[shade] || theme.palette.primary.main;
      } return colorInput;
    };
    const mainColor = getColorValue(color);
    const avatarBgColor = alpha(mainColor, 0.12);
    const iconColor = mainColor;

    return (
        <Paper
          elevation={0}
          sx={{
            p: {xs: 2, sm: 3}, 
            display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between', height: '100%',
            borderRadius: '16px', border: '1px solid', borderColor: 'divider',
            transition: 'border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              borderColor: mainColor, boxShadow: `0 4px 16px 0 ${alpha(mainColor, 0.2)}`,
            }
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'text.secondary', mr: 1, flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</Typography>
              <Avatar sx={{ bgcolor: avatarBgColor, color: iconColor, width: 48, height: 48, flexShrink: 0 }}>
                {isLoading ? <CircularProgress size={24} sx={{color: iconColor}} /> : icon}
              </Avatar>
            </Box>
            <Typography component="div" variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.5, lineHeight: 1.2, minHeight: {xs: '40px', sm:'48px'}, display: 'flex', alignItems: 'center', wordBreak: 'break-word' }}>
              {isLoading ? <CircularProgress size={30} /> : value}
            </Typography>
            <Typography color="text.secondary" variant="body2" sx={{minHeight: '20px'}}>
              {isLoading ? 'Memuat...' : detail}
            </Typography>
          </Box>
          {action && !isLoading && (
            <Button
                variant="text" size="small" onClick={action.onClick} startIcon={action.icon || <AddCircleOutlineIcon fontSize="small"/>}
                sx={{ mt: 2, alignSelf: 'flex-start', color: mainColor, fontWeight: 500, '&:hover': {backgroundColor: alpha(mainColor, 0.08)}, textTransform: 'none' }}
            >
                {action.label}
            </Button>
          )}
        </Paper>
    );
};


const DashboardPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { dashboardSummary, isLoadingSummary, message, isError } = useSelector(
    (state) => ({
      dashboardSummary: state.transactions.dashboardSummary,
      isLoadingSummary: state.transactions.isLoadingSummary,
      message: state.transactions.message,
      isError: state.transactions.isError,
    })
  );

  useEffect(() => {
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  const barChartData = dashboardSummary?.expenses_per_category && Array.isArray(dashboardSummary.expenses_per_category)
    ? dashboardSummary.expenses_per_category
    : [];

  const summaryDataCards = [
    {
      title: "Pengeluaran Bulan Ini",
      value: formatCurrency(dashboardSummary?.total_expenses_this_month),
      detail: `Dari ${dashboardSummary?.total_transactions_this_month || 0} transaksi`,
      icon: <AccountBalanceWalletOutlinedIcon />,
      color: 'primary.main',
      action: { label: "Lihat Transaksi", onClick: () => navigate('/transactions'), icon: <ReceiptOutlinedIcon fontSize="small"/> }
    },
    {
      title: "Kategori Teratas",
      value: dashboardSummary?.top_category_this_month?.name || "N/A",
      detail: dashboardSummary?.top_category_this_month?.name !== "N/A" ? `Pengeluaran: ${formatCurrency(dashboardSummary?.top_category_this_month?.total)}` : "Belum ada data",
      icon: <DonutLargeOutlinedIcon />,
      color: 'secondary.main',
      action: { label: "Kelola Kategori", onClick: () => navigate('/categories'), icon: <AddCircleOutlineIcon fontSize="small"/> }
    },
    {
      title: "Tambah Transaksi Cepat",
      value: <AddCircleOutlineIcon sx={{ fontSize: {xs:32, sm:40}, color: theme.palette.success.main }} />,
      detail: "Catat pengeluaran baru.",
      icon: <ReceiptOutlinedIcon />,
      color: 'success.main',
      action: { label: "Tambah Sekarang", onClick: () => navigate('/transactions', { state: { openAddDialog: true }}) }
    },
  ];

  const formatXAxisTick = (tick) => {
    const maxLength = 10; 
    if (tick && tick.length > maxLength) {
      return `${tick.substring(0, maxLength)}...`;
    }
    return tick;
  };

  return (
    <Box sx={{pb: 4, px: { xs: 1, sm: 2, md: 3 } }}> {/* Padding utama halaman */}
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), width: 48, height: 48, mr: 2 }}>
            <SpeedIcon sx={{color: 'primary.main', fontSize: '28px'}}/>
        </Avatar>
        <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2, fontSize: {xs: '1.75rem', sm: '2.125rem'} }}>
              Dashboard SakuBijak
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Selamat datang! Berikut ringkasan keuangan Anda.
            </Typography>
        </Box>
      </Box>
      <Divider sx={{my: 3}}/>

      {/* Ringkasan Cepat (Kartu-kartu) */}
      <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2.5, color: 'text.primary', fontSize: {xs: '1.25rem', sm: '1.5rem'} }}>
        Ringkasan Cepat
      </Typography>
      {isLoadingSummary && !(dashboardSummary && dashboardSummary.total_expenses_this_month !== undefined) && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 5, p:3, flexDirection: 'column' }}>
              <CircularProgress size={40} /> 
              <Typography sx={{mt:2}} color="text.secondary">Memuat ringkasan dashboard...</Typography>
          </Box>
      )}
      {!isLoadingSummary && isError && !(dashboardSummary && dashboardSummary.total_expenses_this_month !== undefined) && (
          <Alert severity="error" sx={{ mb: 3 }}>Gagal memuat data dashboard: {message || "Terjadi kesalahan."}</Alert>
      )}
      {(!isError || (dashboardSummary && dashboardSummary.total_expenses_this_month !== undefined)) && (
        <Grid container spacing={3} sx={{ mb: 4 }}> {/* mb untuk jarak ke section berikutnya */}
          {summaryDataCards.map((data, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <SummaryCard 
                {...data} 
                isLoading={isLoadingSummary && data.title === "Pengeluaran Bulan Ini" && dashboardSummary?.total_expenses_this_month === undefined}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* --- BAGIAN AKTIVITAS TERAKHIR (jika masih mau ditampilkan di atas chart) --- */}
      {(!isError || (dashboardSummary && dashboardSummary.latest_transactions?.length > 0)) && (
        <Box sx={{mb: 4}}> {/* Box untuk memberi jarak ke Bar Chart di bawahnya */}
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2.5, color: 'text.primary', fontSize: {xs: '1.25rem', sm: '1.5rem'} }}>
            Aktivitas Terakhir
          </Typography>
          <Paper elevation={0} sx={{ p: {xs:2, sm:3}, borderRadius: '16px', border: '1px solid', borderColor: 'divider', width: '100%'}}>
            {isLoadingSummary && !dashboardSummary?.latest_transactions?.length ? (
                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200}}>
                    <CircularProgress />
                </Box>
            ) : dashboardSummary?.latest_transactions?.length === 0 ? (
                <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 200, textAlign: 'center', p:2}}>
                    <ReceiptOutlinedIcon sx={{fontSize: 48, color: 'text.disabled', mb:1}} />
                    <Typography color="text.secondary">Belum ada transaksi.</Typography>
                </Box>
            ) : (
              <>
                <List sx={{ overflow: 'auto', maxHeight: {xs: 300, sm: 350} , pr:1 }}> {/* Batasi tinggi list jika terlalu panjang */}
                    {(dashboardSummary?.latest_transactions || []).slice(0, 5).map((tx, index) => (
                        <React.Fragment key={tx.id}>
                            <ListItem disablePadding sx={{ py: 1.25, alignItems: 'flex-start' }}>
                                <ListItemAvatar sx={{mt: 0.5}}>
                                    <Avatar sx={{ bgcolor: alpha(theme.palette.secondary.light, 0.15), color: 'secondary.main' }}>
                                        <ReceiptOutlinedIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={tx.description}
                                    secondary={`${tx.category_name} - ${new Date(tx.date + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                                    primaryTypographyProps={{ fontWeight: 500, color: 'text.primary', mb: 0.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'calc(100% - 90px)' }}
                                    secondaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                />
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary', textAlign: 'right', whiteSpace: 'nowrap', ml:1, flexShrink: 0 }}>
                                    {formatCurrency(tx.amount)}
                                </Typography>
                            </ListItem>
                            {index < Math.min(dashboardSummary.latest_transactions.length, 5) - 1 && <Divider variant="inset" component="li" sx={{ml: {xs:'56px', sm:'72px'}}}/>}
                        </React.Fragment>
                    ))}
                </List>
                {dashboardSummary?.latest_transactions?.length > 0 && (
                  <Box sx={{ pt: 2, mt: 'auto', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid', borderColor: 'divider' }}>
                    <Button onClick={() => navigate('/transactions')} size="small" endIcon={<ArrowForwardIcon />} sx={{textTransform: 'none'}}>
                      Lihat Semua Transaksi
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Paper>
        </Box>
      )}


      {/*BAGIAN GRAFIK PENGELUARAN PER KATEGORI*/}
      {(!isError || (dashboardSummary && barChartData.length > 0)) && (
        <Box>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2.5, color: 'text.primary', fontSize: {xs: '1.25rem', sm: '1.5rem'} }}>
            Pengeluaran per Kategori
            </Typography>
            <Paper elevation={0} sx={{ p: {xs:2, sm:3}, borderRadius: '16px', border: '1px solid', borderColor: 'divider', width: '100%'}}>
                <Box 
                    sx={{ 
                        width: '100%', 
                        height: { xs: 350, sm: 400, md: 450 },
                }}>
                {isLoadingSummary && barChartData.length === 0 ? ( // Jika masih loading dan belum ada data chart
                    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}><CircularProgress /></Box>
                ) : !isLoadingSummary && barChartData.length === 0 ? ( // Jika sudah tidak loading tapi data chart kosong
                    <Box sx={{textAlign: 'center', p:2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                        <BarChartIcon sx={{fontSize: 48, color: 'text.disabled', mb:1}} />
                        <Typography color="text.secondary">Belum ada data pengeluaran untuk ditampilkan.</Typography>
                    </Box>
                ) : ( // Jika ada data chart
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={barChartData}
                            margin={{
                                top: 5,
                                right: 25,
                                left: 10, 
                                bottom: barChartData.length > 4 ? 70 : 50, 
                            }}
                            barSize={barChartData.length < 5 ? 60 : (barChartData.length < 10 ? 40 : 30)}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis 
                                dataKey="name" 
                                tickFormatter={formatXAxisTick} 
                                angle={barChartData.length > 5 ? -35 : 0} 
                                textAnchor={barChartData.length > 5 ? "end" : "middle"}
                                interval={0} 
                                height={barChartData.length > 5 ? 80 : 50}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis 
                                tickFormatter={(value) => {
                                    if (value >= 1000000) return `${formatCurrency(value/1000000)}jt`;
                                    if (value >= 1000) return `${formatCurrency(value/1000)}rb`;
                                    return formatCurrency(value);
                                }}
                                allowDecimals={false}
                                tick={{ fontSize: 12 }}
                                width={80}
                            />
                            <Tooltip 
                                formatter={(value, name, props) => [formatCurrency(value), props.payload.name]}
                                cursor={{fill: alpha(theme.palette.action.hover, 0.1)}}
                            />
                            <Legend verticalAlign="bottom" height={36}/>
                            <Bar dataKey="total" radius={[4, 4, 0, 0]} >
                                {barChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
                </Box>
            </Paper>
        </Box>
      )}
    </Box>
  );
};

export default DashboardPage;