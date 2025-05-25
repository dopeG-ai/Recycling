import { createTheme } from '@mui/material/styles';
import { colors } from './theme';

const muiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.brand[500],
      light: colors.brand[300],
      dark: colors.brand[700],
      contrastText: '#fff',
    },
    secondary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
      contrastText: '#fff',
    },
    background: {
      default: '#f8faf8',
      paper: '#fff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
  },
  typography: {
    fontFamily: [
      'Poppins',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 64,
          padding: '0 24px',
          '@media (min-width:600px)': {
            minHeight: 70,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          backgroundColor: 'transparent',
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 12,
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 24,
          paddingRight: 24,
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  mixins: {
    toolbar: {
      minHeight: 64,
      '@media (min-width:600px)': {
        minHeight: 70,
      },
    },
  },
});

export default muiTheme;
