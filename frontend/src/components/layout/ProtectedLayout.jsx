// src/components/layout/ProtectedLayout.jsx
import React from 'react';
import { useNavigate, Link as RouterLink, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, resetAuthStates } from '../../features/auth/authSlice';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
  Snackbar,
  Alert,
  Slide,
  Tooltip,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider
} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'; // Ikon untuk Transaksi
import MenuIcon from '@mui/icons-material/Menu';

// Transisi untuk Snackbar
function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

// Komponen tombol navigasi dengan styling untuk NavLink
const NavButton = ({ to, icon, children }) => (
  <Button 
    component={NavLink}
    to={to}
    startIcon={icon}
    sx={{ 
      textTransform: 'none',
      fontWeight: 500,
      color: 'text.secondary', 
      py: 1,
      px: 2,
      borderRadius: '4px',
      '&:hover': {
        backgroundColor: 'action.hover',
        color: 'primary.main',
      },
      '&.active': { 
        backgroundColor: 'primary.light', // Warna latar saat aktif
        color: 'primary.contrastText',    // Warna teks kontras saat aktif
        fontWeight: 'bold',
      }
    }}
  >
    {children}
  </Button>
);

const ProtectedLayout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = (path) => {
    setAnchorElNav(null);
    if (typeof path === 'string') {
      navigate(path);
    }
  };

  const handleLogout = () => {
    handleCloseNavMenu();
    dispatch(logoutUser());
    dispatch(resetAuthStates());
    setSnackbarMessage('Anda telah berhasil logout.');
    setSnackbarOpen(true);
    setTimeout(() => {
        navigate('/login');
    }, 1500);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  
  // Definisikan item navigasi dalam array agar mudah dikelola
  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon fontSize="small"/>, path: '/dashboard' },
    { text: 'Kategori', icon: <CategoryIcon fontSize="small"/>, path: '/categories' },
    { text: 'Transaksi', icon: <ReceiptLongIcon fontSize="small"/>, path: '/transactions' }, // Tambahkan item Transaksi
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar 
        position="sticky"
        elevation={1} // Shadow yang lebih lembut
        sx={{ 
          backgroundColor: 'white', // AppBar putih
          color: 'text.primary',    // Warna teks utama untuk AppBar putih
          borderBottom: (theme) => `1px solid ${theme.palette.divider}` // Garis bawah tipis
        }}
      >
        <Container maxWidth="lg"> {/* Membatasi lebar Toolbar */}
          <Toolbar disableGutters>
            {/* Logo dan Judul Aplikasi (Kiri) */}
            <AccountBalanceWalletIcon sx={{ color: 'primary.main', mr: 1, display: 'flex' }} /> 
            <Typography 
              variant="h6" 
              component={RouterLink}
              to="/dashboard"
              noWrap
              sx={{ 
                mr: 2,
                fontWeight: 600,
                color: 'primary.main',
                textDecoration: 'none',
                display: 'flex' 
              }}
            >
              SakuBijak
            </Typography>

            {/* Spacer untuk mendorong elemen ke kanan */}
            <Box sx={{ flexGrow: 1 }} />

            {/* Navigasi Links untuk layar besar (md ke atas) */}
            <Stack 
              direction="row" 
              spacing={0.5} // Jarak antar tombol navigasi
              sx={{ display: { xs: 'none', md: 'flex' } }}
            >
              {navItems.map((item) => (
                <NavButton key={item.text} to={item.path} icon={item.icon}>{item.text}</NavButton>
              ))}
            </Stack>
            
            {/* User Info dan Logout untuk layar besar (md ke atas) */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', ml: 2 }}> {/* ml:2 untuk jarak */}
              {user && (
                <Tooltip title={user.name || user.email}>
                  <Typography variant="body2" sx={{ mr: 2, color: 'text.secondary', cursor: 'default' }}>
                    Halo, {user.name ? user.name.split(' ')[0] : user.email}!
                  </Typography>
                </Tooltip>
              )}
              <Button 
                variant="outlined"
                color="primary"
                onClick={handleLogout} 
                startIcon={<ExitToAppIcon />}
                size="small"
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 500,
                }}
              >
                Logout
              </Button>
            </Box>

            {/* Menu Mobile (Hamburger Icon) - Tampil di layar kecil (xs dan sm) */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="navigation menu"
                aria-controls="menu-appbar-nav"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit" // Mengambil warna dari parent (AppBar -> text.primary)
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar-nav"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right', 
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElNav)}
                onClose={() => handleCloseNavMenu()} // Tutup menu tanpa navigasi jika diklik di luar
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {navItems.map((item) => ( // Menggunakan array navItems untuk menu mobile
                  <MenuItem key={item.text} onClick={() => handleCloseNavMenu(item.path)}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <Typography textAlign="left">{item.text}</Typography>
                  </MenuItem>
                ))}
                <Divider />
                 {user && (
                    <MenuItem disabled sx={{ justifyContent: 'center' }}>
                        <Typography variant="caption">Halo, {user.name ? user.name.split(' ')[0] : user.email}!</Typography>
                    </MenuItem>
                 )}
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon><ExitToAppIcon fontSize="small" /></ListItemIcon>
                  <Typography textAlign="left">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
            
          </Toolbar>
        </Container>
      </AppBar>
      
      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, py: {xs: 2, sm: 3}, mt: 2 }}>
        {children}
      </Container>

      <Box
        component="footer"
        sx={{
          py: 2.5,
          px: 2,
          mt: 'auto',
          backgroundColor: 'white',
          borderTop: (theme) => `1px solid ${theme.palette.divider}`
        }}
      >
        <Typography variant="body2" color="text.secondary" align="center">
          {'© SakuBijak '}
          {new Date().getFullYear()}
          {'. Dibuat oleh Alwi Arfan Solin.'}
        </Typography>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        TransitionComponent={SlideTransition}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" variant="filled" elevation={6} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProtectedLayout;
