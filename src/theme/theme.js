import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#64b5f6',    // 300
      main: '#2196f3',     // 500
      dark: '#1976d2',     // 700
      contrastText: '#fff',
    },
    secondary: {
      light: '#ce93d8',    // 300
      main: '#9c27b0',     // 500
      dark: '#7b1fa2',     // 700
      contrastText: '#fff',
    },
    success: {
      light: '#81c784',    // 300
      main: '#4caf50',     // 500
      dark: '#388e3c',     // 700
      contrastText: '#fff',
    },
    error: {
      light: '#e57373',    // 300
      main: '#f44336',     // 500
      dark: '#d32f2f',     // 700
      contrastText: '#fff',
    },
    warning: {
      light: '#ffb74d',    // 300
      main: '#ff9800',     // 500
      dark: '#f57c00',     // 700
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    info: {
      light: '#4fc3f7',    // 300
      main: '#2196f3',     // 500
      dark: '#1976d2',     // 700
      contrastText: '#fff',
    },
    background: {
      default: '#f5f5f5',  // 100
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 16,
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 16,
          },
        },
      },
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    button: {
      fontWeight: 500,
    },
  },
});

export default theme;
