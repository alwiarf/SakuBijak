// src/styles/theme.js
import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Tema ini dirancang untuk memberikan nuansa modern dan bersih, terinspirasi dari Google Material Design.
const theme = createTheme({
  palette: {
    primary: {
      main: '#1A73E8', // Biru khas Google
    },
    secondary: {
      main: '#FF6F00', // Oranye sebagai warna aksen, bisa disesuaikan
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#f7f9fc', // Latar belakang abu-abu sangat muda, umum di aplikasi Google
      paper: '#ffffff',   // Latar belakang untuk elemen seperti Card, Paper
    },
    text: {
      primary: '#202124', // Warna teks utama (abu-abu tua, bukan hitam pekat)
      secondary: '#5f6368', // Warna teks sekunder
    }
  },
  typography: {
    // Menggunakan Google Sans sebagai font utama, dengan fallback ke Roboto.
    // Pastikan untuk mengimpor Google Sans (lihat MuiCssBaseline di bawah).
    fontFamily: '"Google Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: { // Contoh kustomisasi untuk judul
      fontWeight: 500,
      color: '#202124',
    },
    button: {
      textTransform: 'none', // Teks tombol tidak kapital semua, sesuai gaya Google
      fontWeight: 500,
    }
  },
  shape: {
    borderRadius: 8, // Sudut yang sedikit membulat untuk konsistensi
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Roboto:wght@300;400;500;700&display=swap');
        body {
          font-family: "Google Sans", "Roboto", "Helvetica", "Arial", sans-serif;
          background-color: #f7f9fc; // Pastikan background default diterapkan
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Konsisten dengan shape.borderRadius
          paddingTop: '10px',
          paddingBottom: '10px',
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#1558B0', // Warna hover yang sedikit lebih gelap
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& label.Mui-focused': {
            color: '#1A73E8', // Warna label saat field aktif
          },
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: '#1A73E8', // Warna border saat field aktif
            },
            // Sedikit membulatkan sudut input field juga
            borderRadius: 8,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Paper/Card dengan sudut lebih bulat
          padding: '24px', // Padding default untuk Paper
        },
        elevation1: { // Shadow yang lembut untuk elevasi dasar
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
        },
        elevation6: { // Shadow yang lebih tegas untuk elemen yang lebih menonjol
             boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
        }
      }
    },
    MuiAvatar: {
        styleOverrides: {
            root: {
                backgroundColor: '#1A73E8', // Warna avatar sesuai primary
            }
        }
    },
    MuiAppBar: { // Contoh untuk AppBar jika Anda menggunakannya
        styleOverrides: {
            root: {
                backgroundColor: '#ffffff', // AppBar putih seperti gaya Google
                color: '#5f6368', // Warna teks ikon/judul di AppBar
                boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)', // Shadow tipis
            }
        }
    }
  }
});

export default theme;