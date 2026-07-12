import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2563eb', light: '#60a5fa', dark: '#1d4ed8' },
    secondary: { main: '#0f172a' },
    success: { main: '#16a34a' },
    warning: { main: '#f59e0b' },
    error: { main: '#dc2626' },
    background: { default: '#f8fafc', paper: '#ffffff' },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
  },
  components: {
    MuiCard: { styleOverrides: { root: { boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)' } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 999, textTransform: 'none', px: 18, py: 10 } } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 20 } } },
  },
});

export default theme;
