import { createTheme } from '@mui/material/styles';

import '@fontsource/poppins';

export default createTheme({
  typography: {
    fontFamily: '"Poppins", sans-serif',
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#2979ff',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff4081',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#555555',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});
