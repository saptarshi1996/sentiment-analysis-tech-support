// src/theme.js
import { createTheme } from '@mui/material/styles';

import '@fontsource/poppins';

const theme = createTheme({
  typography: {
    fontFamily: '"Poppins", sans-serif',
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#2979ff', // Bright Blue
      contrastText: '#ffffff', // White text for contrast
    },
    secondary: {
      main: '#ff4081', // Bright Pink
      contrastText: '#ffffff', // White text for contrast
    },
    background: {
      default: '#f4f6f8', // Light grey background for the app
      paper: '#ffffff',   // White background for paper components
    },
    text: {
      primary: '#000000', // Black text for readability
      secondary: '#555555', // Dark grey text for secondary content
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

export default theme;
