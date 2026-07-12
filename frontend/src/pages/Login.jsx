import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  CircularProgress,
  Grid,
} from '@mui/material';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [role, setRole] = useState('ADMIN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await login(form.email, form.password, role);
      const user = response?.data?.data?.user;
      if (user) {
        if (response?.data?.data?.mustChangePassword) {
          navigate('/change-password');
        } else {
          navigate(user?.role === 'employee' ? '/employee/dashboard' : '/admin/dashboard');
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 3 }}>
      <Container maxWidth="sm">
        <Card elevation={0} sx={{ borderRadius: 4, p: 1, boxShadow: '0 20px 60px rgba(15, 23, 42, 0.12)' }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Box sx={{ bgcolor: 'primary.main', borderRadius: 3, p: 1.5, color: 'white' }}>
                <LockRoundedIcon />
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={800}>AssetFlow AI</Typography>
                <Typography variant="body2" color="text.secondary">Enterprise Asset Intelligence</Typography>
              </Box>
            </Stack>

            <Stack spacing={2} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={700}>Role Selection</Typography>
              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={6}>
                  <Card variant={role === 'ADMIN' ? 'elevation' : 'outlined'} sx={{ cursor: 'pointer', borderColor: role === 'ADMIN' ? 'primary.main' : 'divider', bgcolor: role === 'ADMIN' ? 'primary.main' : 'background.paper', color: role === 'ADMIN' ? 'white' : 'inherit' }} onClick={() => setRole('ADMIN')}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <AdminPanelSettingsRoundedIcon />
                      <Box>
                        <Typography fontWeight={700}>Admin</Typography>
                        <Typography variant="caption">Manage the ERP</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card variant={role === 'EMPLOYEE' ? 'elevation' : 'outlined'} sx={{ cursor: 'pointer', borderColor: role === 'EMPLOYEE' ? 'primary.main' : 'divider', bgcolor: role === 'EMPLOYEE' ? 'primary.main' : 'background.paper', color: role === 'EMPLOYEE' ? 'white' : 'inherit' }} onClick={() => setRole('EMPLOYEE')}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <BadgeRoundedIcon />
                      <Box>
                        <Typography fontWeight={700}>Employee</Typography>
                        <Typography variant="caption">Access your workspace</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Stack>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  InputProps={{ startAdornment: <InputAdornment position="start"><EmailRoundedIcon /></InputAdornment> }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                {error ? <Typography color="error.main">{error}</Typography> : null}
                <Button type="submit" variant="contained" size="large" disabled={loading}>
                  {loading ? <CircularProgress size={22} color="inherit" /> : 'Login'}
                </Button>
                {role === 'ADMIN' ? (
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <Link to="/register">Create Admin Account</Link>
                    <Typography color="text.secondary">•</Typography>
                    <Typography color="text.secondary">Forgot Password</Typography>
                  </Stack>
                ) : null}
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
