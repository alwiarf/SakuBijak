// src/styles/theme.js
import { createTheme, alpha } from '@mui/material/styles'; // Impor alpha untuk opacity
import { red, blueGrey } from '@mui/material/colors';

// Tema ini dirancang untuk memberikan nuansa modern dan bersih, terinspirasi dari Google Material Design.
const theme = createTheme({
  palette: {
    primary: {
      main: '#1A73E8', // Biru khas Google
      light: alpha('#1A73E8', 0.1), // Warna light untuk background NavButton aktif & Avatar
      contrastText: '#ffffff', // Teks putih untuk kontras di atas primary.main
    },
    secondary: {
      main: '#FF6F00', // Oranye sebagai warna aksen
      light: alpha('#FF6F00', 0.1),
      contrastText: '#ffffff',
    },
    error: {
      main: red.A400,
    },
    success: { // Tambahkan palet sukses untuk notifikasi atau indikator positif
        main: '#34A853', // Hijau Google
        light: alpha('#34A853', 0.1),
        contrastText: '#ffffff',
    },
    warning: { // Tambahkan palet warning
        main: '#FBBC05', // Kuning Google
        light: alpha('#FBBC05', 0.1),
        contrastText: '#202124', // Teks gelap untuk kontras dengan kuning
    },
    info: { // Tambahkan palet info
        main: '#4285F4', // Biru lain Google
        light: alpha('#4285F4', 0.1),
        contrastText: '#ffffff',
    },
    background: {
      default: '#f7f9fc', 
      paper: '#ffffff',   
    },
    text: {
      primary: '#202124', 
      secondary: '#5f6368', 
      disabled: alpha('#202124', 0.38), // Warna teks disabled
    },
    divider: blueGrey[200], // Warna divider yang lebih lembut
    action: { // Warna untuk action states
        active: alpha('#202124', 0.54),
        hover: alpha('#202124', 0.04), // Hover yang sangat lembut untuk AppBar putih
        hoverOpacity: 0.04,
        selected: alpha('#202124', 0.08),
        disabled: alpha('#202124', 0.26),
        disabledBackground: alpha('#202124', 0.12),
        focus: alpha('#202124', 0.12),
        focusOpacity: 0.12,
    }
  },
  typography: {
    fontFamily: '"Google Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: { // Digunakan di DashboardPage SummaryCard value
        fontWeight: 700, // Lebih tebal untuk angka besar
        fontSize: '2.25rem', // Ukuran disesuaikan
        lineHeight: 1.2,
    },
    h4: { // Digunakan untuk judul halaman
        fontWeight: 600,
        fontSize: '2rem', // Sedikit lebih besar dari default
        color: '#202124',
    },
    h5: { // Digunakan untuk sub-judul bagian
      fontWeight: 600, // Lebih tebal dari default
      fontSize: '1.6rem',
      color: '#202124',
    },
    h6: { // Digunakan untuk judul kartu atau bagian kecil
      fontWeight: 500,
      fontSize: '1.25rem',
      color: '#202124',
    },
    subtitle1: { // Digunakan untuk judul kartu di SummaryCard dan subjudul halaman
        fontWeight: 500,
        fontSize: '1rem',
        color: '#5f6368', // text.secondary
    },
    body1: {
        fontSize: '1rem',
        lineHeight: 1.5,
    },
    body2: {
        fontSize: '0.875rem',
        lineHeight: 1.43,
        color: '#5f6368', // text.secondary
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '0.875rem', // Sedikit lebih kecil untuk tombol standar
    },
    caption: {
        fontSize: '0.75rem',
        color: '#5f6368', // text.secondary
    }
  },
  shape: {
    borderRadius: 8, // Default border radius
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Roboto:wght@300;400;500;700&display=swap');
        body {
          font-family: "Google Sans", "Roboto", "Helvetica", "Arial", sans-serif;
          background-color: #f7f9fc;
        }
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }
      `,
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true, // Tombol lebih flat secara default
      },
      styleOverrides: {
        root: {
          borderRadius: '4px', // Lebih kotak ala Google
          padding: '8px 16px', // Padding default yang lebih pas
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#1366D1', // Sedikit lebih gelap dari primary.main
          },
        },
        outlinedPrimary: { // Styling untuk tombol outlined
            borderColor: alpha('#1A73E8', 0.5), // Border lebih soft
            '&:hover': {
                borderColor: '#1A73E8',
                backgroundColor: alpha('#1A73E8', 0.04), // Hover sangat lembut
            }
        },
        textPrimary: { // Styling untuk tombol text
            '&:hover': {
                backgroundColor: alpha('#1A73E8', 0.04),
            }
        }
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '4px', // Lebih kotak
            '& fieldset': {
              // borderColor: blueGrey[200], // Border default lebih soft
            },
            '&:hover fieldset': {
              // borderColor: blueGrey[400],
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1A73E8',
              borderWidth: '1px', // Pastikan border tidak terlalu tebal saat fokus
            },
          },
          '& label.Mui-focused': {
            color: '#1A73E8',
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0, // Default paper lebih flat
      },
      styleOverrides: {
        root: {
          borderRadius: '12px', // Default radius untuk Paper
          // backgroundColor: '#ffffff', // Dikelola oleh palette.background.paper
        },
        // Anda bisa menambahkan varian elevation kustom jika perlu
        // Contoh: elevation={2} akan menggunakan shadow default MUI
      },
    },
    MuiAvatar: { // Styling default untuk Avatar
        styleOverrides: {
            root: {
                // backgroundColor: '#1A73E8', // Dihapus agar bisa di-override per instance
                // color: '#ffffff', // Dihapus agar bisa di-override per instance
            }
        }
    },
    MuiAppBar: {
        defaultProps: {
            elevation: 0, // AppBar flat secara default
        },
        styleOverrides: {
            root: {
                backgroundColor: '#ffffff', 
                color: '#5f6368', 
                borderBottom: `1px solid ${blueGrey[200]}`, // Menggunakan warna divider
            }
        }
    },
    MuiTooltip: { // Styling untuk Tooltip
        styleOverrides: {
            tooltip: {
                backgroundColor: alpha('#202124', 0.92), // Latar belakang tooltip lebih gelap
                borderRadius: '4px',
                fontSize: '0.75rem',
            },
            arrow: {
                color: alpha('#202124', 0.92),
            }
        }
    },
    MuiChip: { // Styling untuk Chip (digunakan di TransactionsPage)
        styleOverrides: {
            root: {
                borderRadius: '4px',
                fontSize: '0.75rem',
                height: '24px',
            },
            // Anda bisa menambahkan style untuk variant atau color tertentu
            // colorPrimary: { backgroundColor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }
        }
    },
    MuiListItem: { // Styling untuk ListItem
        styleOverrides: {
            root: {
                // '&:hover': { // Efek hover bisa ditambahkan di sini secara global jika diinginkan
                //     backgroundColor: alpha('#202124', 0.03),
                // }
            }
        }
    },
    MuiMenu: { // Styling untuk Menu dropdown
        styleOverrides: {
            paper: {
                borderRadius: '4px', // Menu lebih kotak
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)', // Shadow yang lebih halus
            }
        }
    },
    MuiMenuItem: { // Styling untuk MenuItem
        styleOverrides: {
            root: {
                fontSize: '0.875rem',
                '&:hover': {
                    backgroundColor: alpha('#202124', 0.04),
                }
            }
        }
    }
  }
});

export default theme;
