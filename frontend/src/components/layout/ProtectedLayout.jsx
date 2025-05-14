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
  Avatar
} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import MenuIcon from '@mui/icons-material/Menu';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

// Transisi untuk Snackbar
function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

// Komponen tombol navigasi
const NavButton = ({ to, icon, children, onClick }) => (
  <Button 
    component={onClick ? Button : NavLink}
    to={onClick ? undefined : to}
    onClick={onClick}
    startIcon={icon}
    sx={{ 
      textTransform: 'none',
      fontWeight: 500,
      color: 'text.secondary', 
      py: 0.75,
      px: 1.5,
      borderRadius: '4px',
      minWidth: 'auto',
      '&:hover': {
        backgroundColor: 'action.hover',
        color: 'primary.main',
      },
      '&.active': { 
        backgroundColor: 'primary.light',
        color: 'primary.main',
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
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = (path) => {
    setAnchorElNav(null);
    if (typeof path === 'string') navigate(path);
  };

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleLogout = () => {
    handleCloseUserMenu();
    handleCloseNavMenu();
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
        elevation={0}
        sx={{ 
          backgroundColor: 'background.paper',
          color: 'text.primary',
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`
        }}
      >
        <Toolbar 
            disableGutters
            sx={{ 
                minHeight: { xs: 56, sm: 64 },
                px: { xs: 1, sm: 2, md: 3 } // Padding horizontal untuk Toolbar
            }}
        >
            {/* Grup Kiri: Logo dan Judul Aplikasi */}
            <Box 
              component={RouterLink} 
              to="/dashboard" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none', 
                color: 'inherit',
                // mr: { md: 2 } // Margin kanan untuk memisahkan dari navigasi tengah di desktop
              }}
            >
              <AccountBalanceWalletIcon sx={{ color: 'primary.main', mr: 1, fontSize: '28px' }} /> 
              <Typography 
                variant="h6" 
                noWrap
                sx={{ 
                  fontWeight: 600,
                  color: 'text.primary',
                  display: { xs: 'none', sm: 'block' } 
                }}
              >
                SakuBijak
              </Typography>
            </Box>

            {/* Spacer untuk mendorong navigasi tengah (desktop) atau menu mobile (mobile) */}
            <Box sx={{ flexGrow: 1 }} />

            {/* Grup Tengah: Navigasi Links untuk layar besar (md ke atas) */}
            <Stack 
              direction="row" 
              spacing={1}
              sx={{ 
                display: { xs: 'none', md: 'flex' },
                // justifyContent: 'center', // Dihapus agar tidak "memakan" ruang yang seharusnya untuk spacer
                // mx: 'auto' // Ini akan memusatkan stack jika parentnya flex dan ada ruang
              }}
            >
              {navItems.map((item) => (
                <NavButton key={item.text} to={item.path} icon={item.icon}>{item.text}</NavButton>
              ))}
            </Stack>
            
            {/* Spacer lagi untuk memastikan grup kanan benar-benar di kanan jika ada navigasi tengah */}
            <Box sx={{ flexGrow: { xs: 0, md: 1 }, display: {xs: 'none', md: 'block'} }} />


            {/* Grup Kanan (Desktop): User Avatar dan Menu */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', ml: {md: 1} /* Sedikit margin kiri jika ada nav desktop */}}>
              <Tooltip title={user?.name || user?.email || 'Akun Pengguna'}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
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
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon><ExitToAppIcon fontSize="small" /></ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>

            {/* Grup Kanan (Mobile): Avatar Pengguna dan Menu Hamburger */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
              <Tooltip title={user?.name || user?.email || 'Akun Pengguna'}>
                 <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, mr: 0.5 /* Sedikit jarak antara avatar dan hamburger */ }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: '0.875rem' }}>{userInitial}</Avatar>
                </IconButton>
              </Tooltip>
              <IconButton
                size="medium"
                aria-label="navigation menu"
                aria-controls="menu-appbar-nav"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu // Menu untuk navigasi mobile
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
                {/* Menu Logout bisa juga ditambahkan di sini jika menu user mobile terpisah tidak digunakan */}
              </Menu>
              <Menu // Menu untuk user mobile (jika diklik avatar mobile)
                sx={{ mt: '40px' }}
                id="menu-appbar-user-mobile"
                anchorEl={anchorElUser} // Menggunakan anchorElUser yang sama
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorElUser) && Boolean(document.getElementById('menu-appbar-user-mobile'))} // Hanya buka jika menu ini yang ditargetkan
                onClose={handleCloseUserMenu}
              >
                <MenuItem disabled>
                  <Typography variant="subtitle2" sx={{fontWeight: 'medium'}}>{userDisplayName}</Typography>
                </MenuItem>
                <Divider/>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon><ExitToAppIcon fontSize="small" /></ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
      </AppBar>
      
      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, py: {xs: 2, sm: 3}, mt: {xs: 1, sm: 2} }}>
        {children}
      </Container>

      <Box
        component="footer"
        sx={{
          py: 2,
          px: 2,
          mt: 'auto',
          backgroundColor: 'background.paper',
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
