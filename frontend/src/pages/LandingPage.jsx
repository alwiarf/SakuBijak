import React from 'react';
import { Box, Container, Typography, Button, Grid, Paper, Avatar } from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Komponen Styled untuk Hero Section
const HeroSectionStyled = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(10, 2, 12), 
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center', // Ini akan memusatkan Container di dalamnya
  justifyContent: 'center',
  minHeight: 'calc(75vh - 64px)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(8, 2, 10),
    minHeight: 'calc(70vh - 56px)',
  },
}));

const HeroTitleStyled = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
  maxWidth: '780px',
  lineHeight: 1.25,
  fontSize: '2.8rem',
   [theme.breakpoints.up('sm')]: {
    fontSize: '3.5rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '4.0rem',
  },
}));

const HeroSubtitleStyled = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  color: theme.palette.text.secondary,
  maxWidth: '680px',
  lineHeight: 1.65,
  fontSize: '1.05rem',
  [theme.breakpoints.up('md')]: {
    fontSize: '1.2rem',
  },
}));

// Komponen untuk Kartu Fitur
const FeatureCardStyled = ({ icon, title, description }) => {
  const theme = useTheme();
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: {xs: 2.5, sm: 3},
        height: '100%',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        textAlign: 'left',
        transition: 'box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out',
        '&:hover': {
            boxShadow: `0 6px 20px 0 ${alpha(theme.palette.grey[400], 0.12)}`,
            transform: 'translateY(-4px)',
        }
      }}
    >
      <Avatar 
        sx={{ 
            bgcolor: alpha(theme.palette.primary.main, 0.1), 
            color: 'primary.main', 
            width: 50, height: 50,
            mb: 2
        }}
      >
        {React.cloneElement(icon, { sx: { fontSize: 26 } })}
      </Avatar>
      <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.75 }}>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{lineHeight: 1.6}}>
        {description}
      </Typography>
    </Paper>
  );
};

const LandingPage = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <EditNoteOutlinedIcon />,
      title: "Pencatatan Mudah & Cepat",
      description: "Catat setiap transaksi pengeluaran Anda dengan antarmuka yang intuitif dan proses yang efisien.",
    },
    {
      icon: <CategoryOutlinedIcon />,
      title: "Kategori yang Fleksibel",
      description: "Kelompokkan pengeluaran ke dalam berbagai kategori yang dapat Anda personalisasi sesuai kebutuhan.",
    },
    {
      icon: <BarChartOutlinedIcon />,
      title: "Ringkasan Visual Informatif",
      description: "Dapatkan pemahaman mendalam tentang kebiasaan belanja Anda melalui visualisasi data yang mudah dimengerti.",
    },
  ];

  const primaryButtonStyle = {
    py: 1.5, px: {xs:3.5, sm:5}, 
    borderRadius: '8px', 
    fontWeight: 600, 
    fontSize: {xs: '0.9rem', sm: '1rem'},
    boxShadow: `0 4px 10px ${alpha(theme.palette.primary.main, 0.25)}`,
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: `0 6px 14px ${alpha(theme.palette.primary.main, 0.35)}`,
        transform: 'translateY(-2px)',
        backgroundColor: theme.palette.primary.dark,
    }
  };
  
  const secondaryButtonStyle = {
    py: 1.5, px: {xs:3.5, sm:5}, 
    borderRadius: '8px', 
    fontWeight: 600, 
    fontSize: {xs: '0.9rem', sm: '1rem'},
    borderColor: alpha(theme.palette.primary.main, 0.5),
    '&:hover': {
        borderColor: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.04),
    }
  };

  return (
    <Box sx={{backgroundColor: 'background.default'}}>
      {/* Hero Section */}
      <HeroSectionStyled>
        <Container 
          maxWidth="md" 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Avatar 
            sx={{ 
                bgcolor: 'primary.main', 
                width: {xs: 64, sm: 80}, 
                height: {xs: 64, sm: 80}, 
                mb: 3
            }}
          >
            <AccountBalanceWalletIcon sx={{ fontSize: {xs: 36, sm: 48}, color: 'white' }}/>
          </Avatar>
          {/* HeroTitleStyled dan HeroSubtitleStyled sudah memiliki textAlign: 'center' dari HeroSectionStyled */}
          <HeroTitleStyled>
            SakuBijak: Kelola Keuangan, Raih Kebebasan Finansial Anda!
          </HeroTitleStyled>
          <HeroSubtitleStyled>
            Dengan SakuBijak, mencatat pengeluaran harian menjadi lebih mudah, teratur, dan menyenangkan. Mulai kendalikan keuangan pribadi Anda untuk masa depan yang lebih cerah.
          </HeroSubtitleStyled>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              component={RouterLink} 
              to="/register"
              endIcon={<ArrowForwardIcon />}
              sx={primaryButtonStyle}
            >
              Mulai Gratis Sekarang
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              size="large" 
              component={RouterLink} 
              to="/login"
              sx={secondaryButtonStyle}
            >
              Login
            </Button>
          </Box>
        </Container>
      </HeroSectionStyled>

      {/* Features Section */}
      <Box sx={{ backgroundColor: 'background.paper', py: {xs: 6, sm: 8, md:10} }}>
        <Container maxWidth="lg">
          <Box sx={{textAlign: 'center', mb: {xs:5, sm:7}}}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                Kenapa Memilih SakuBijak?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto', lineHeight: 1.65 }}>
                Kami menyediakan alat yang Anda butuhkan untuk mengelola keuangan pribadi dengan lebih cerdas dan efisien.
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FeatureCardStyled 
                  icon={feature.icon} 
                  title={feature.title} 
                  description={feature.description} 
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      {/* Call to Action Section */}
      <Box sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.03), py: {xs:6, sm:8, md:10}, textAlign: 'center' }}>
        <Container maxWidth="md">
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
                Siap Mengatur Keuangan Anda?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: '600px', mx: 'auto', lineHeight: 1.6 }}>
                Jangan tunda lagi. Bergabunglah dengan SakuBijak dan mulailah perjalanan finansial Anda yang lebih terencana hari ini.
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              size="large" 
              component={RouterLink} 
              to="/register"
              endIcon={<ChevronRightIcon />}
              sx={{ ...primaryButtonStyle, py: 1.75, px: 6, fontSize: '1.05rem' }}
            >
              Daftar Sekarang, Gratis!
            </Button>
        </Container>
      </Box>

      {/* Footer Section */}
      <Box component="footer" sx={{ py: {xs:3, sm:4}, backgroundColor: theme.palette.background.default, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Container maxWidth="lg">
          <Box sx={{display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, alignItems: 'center', justifyContent: 'space-between'}}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: {xs: 2, sm: 0} }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, mr: 1.5 }}>
                    <AccountBalanceWalletIcon sx={{ fontSize: 20, color: 'white' }}/>
                </Avatar>
                <Typography variant="h6" color="text.primary" sx={{fontWeight: 600}}>
                    SakuBijak
                </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{textAlign: {xs: 'center', sm: 'right'} }}>
                {'© '} {new Date().getFullYear()}
                {' Dibuat oleh Alwi Arfan Solin.'}
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
