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
  Divider,
  Avatar // Untuk menampilkan inisial pengguna jika tidak ada foto
} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import MenuIcon from '@mui/icons-material/Menu';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'; // Ikon untuk user

// Transisi untuk Snackbar
function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

// Komponen tombol navigasi dengan styling untuk NavLink
const NavButton = ({ to, icon, children, onClick }) => (
  <Button 
    component={onClick ? Button : NavLink} // Jadi Button jika ada onClick, NavLink jika tidak
    to={onClick ? undefined : to}
    onClick={onClick}
    startIcon={icon}
    sx={{ 
      textTransform: 'none',
      fontWeight: 500,
      color: 'text.secondary', 
      py: 0.75, // Padding vertikal sedikit dikurangi untuk AppBar yang lebih ramping
      px: 1.5,  // Padding horizontal
      borderRadius: '4px',
      minWidth: 'auto', // Agar tombol tidak terlalu lebar jika teksnya pendek
      '&:hover': {
        backgroundColor: 'action.hover', // Warna hover dari tema
        color: 'primary.main',
      },
      // Styling untuk NavLink aktif
      '&.active': { 
        backgroundColor: 'primary.light', // Warna latar saat aktif dari tema
        color: 'primary.main',    // Warna teks utama saat aktif
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
  const [anchorElNav, setAnchorElNav] = React.useState(null); // Untuk menu navigasi mobile
  const [anchorElUser, setAnchorElUser] = React.useState(null); // Untuk menu user mobile/desktop

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = (path) => {
    setAnchorElNav(null);
    if (typeof path === 'string') navigate(path);
  };

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleLogout = () => {
    handleCloseUserMenu(); // Tutup menu user jika terbuka
    handleCloseNavMenu();   // Tutup menu nav jika terbuka
    dispatch(logoutUser());
    dispatch(resetAuthStates());
    setSnackbarMessage('Anda telah berhasil logout.');
    setSnackbarOpen(true);
    setTimeout(() => navigate('/login'), 1500);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };
  
  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon fontSize="small"/>, path: '/dashboard' },
    { text: 'Kategori', icon: <CategoryIcon fontSize="small"/>, path: '/categories' },
    { text: 'Transaksi', icon: <ReceiptLongIcon fontSize="small"/>, path: '/transactions' },
  ];

  const userDisplayName = user?.name ? user.name.split(' ')[0] : (user?.email || 'User');
  const userInitial = userDisplayName.charAt(0).toUpperCase();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar 
        position="sticky"
        elevation={0} // AppBar flat, border dari sx
        sx={{ 
          backgroundColor: 'background.paper', // Menggunakan background.paper dari tema
          color: 'text.primary',
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: { xs: 56, sm: 64 } }}> {/* Tinggi AppBar standar */}
            {/* Logo dan Judul Aplikasi (Kiri) */}
            <Box component={RouterLink} to="/dashboard" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
              <AccountBalanceWalletIcon sx={{ color: 'primary.main', mr: 1, fontSize: '28px' }} /> 
              <Typography 
                variant="h6" 
                noWrap
                sx={{ 
                  fontWeight: 600,
                  color: 'text.primary', // Warna teks primary agar lebih tegas
                  display: { xs: 'none', sm: 'block' } // Judul teks tampil di sm ke atas
                }}
              >
                SakuBijak
              </Typography>
            </Box>

            {/* Navigasi Links untuk layar besar (md ke atas) di tengah */}
            <Stack 
              direction="row" 
              spacing={1} // Spacing antar tombol
              sx={{ flexGrow: 1, justifyContent: 'center', display: { xs: 'none', md: 'flex' } }}
            >
              {navItems.map((item) => (
                <NavButton key={item.text} to={item.path} icon={item.icon}>{item.text}</NavButton>
              ))}
            </Stack>
            
            {/* Spacer untuk layar kecil, agar logo di kiri dan menu di kanan */}
            <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />


            {/* User Avatar dan Menu untuk layar besar */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              <Tooltip title={user?.name || user?.email || 'Akun Pengguna'}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontSize: '1rem' }}>{userInitial}</Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar-user-desktop"
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem disabled>
                  <Typography variant="subtitle2" sx={{fontWeight: 'medium'}}>{userDisplayName}</Typography>
                </MenuItem>
                <Divider/>
                {/* <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/profile'); }}>
                  <ListItemIcon><PersonOutlineIcon fontSize="small" /></ListItemIcon>
                  Profil Saya
                </MenuItem> */}
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon><ExitToAppIcon fontSize="small" /></ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>

            {/* Menu Mobile (Hamburger Icon) - Tampil di layar kecil (xs dan sm) */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <Tooltip title={user?.name || user?.email || 'Akun Pengguna'}>
                 <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, mr: 1 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: '0.875rem' }}>{userInitial}</Avatar>
                </IconButton>
              </Tooltip>
              <IconButton
                size="medium" // Ukuran ikon disesuaikan
                aria-label="navigation menu"
                aria-controls="menu-appbar-nav"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar-nav"
                anchorEl={anchorElNav}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorElNav)}
                onClose={() => handleCloseNavMenu()}
              >
                {navItems.map((item) => (
                  <MenuItem key={item.text} onClick={() => handleCloseNavMenu(item.path)}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <Typography textAlign="left">{item.text}</Typography>
                  </MenuItem>
                ))}
                {/* User-specific menu items for mobile can be added here if different from desktop */}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, py: {xs: 2, sm: 3}, mt: {xs: 1, sm: 2} }}> {/* Margin atas disesuaikan */}
        {children}
      </Container>

      <Box
        component="footer"
        sx={{
          py: 2, // Padding footer dikurangi sedikit
          px: 2,
          mt: 'auto',
          backgroundColor: 'background.paper', // Footer dengan warna paper
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
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Notifikasi di atas
      >
        <Alert onClose={handleCloseSnackbar} severity="success" variant="filled" elevation={6} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProtectedLayout;
