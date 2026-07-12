import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, Container, Stack, TextField, Typography, InputAdornment, CircularProgress } from '@mui/material';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await register(form.fullName, form.email, form.password, form.phone, 'admin');
      if (response?.data?.data?.user) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 3 }}>
      <Container maxWidth="sm">
        <Card elevation={0} sx={{ borderRadius: 4, p: 1 }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Box sx={{ bgcolor: 'primary.main', borderRadius: 3, p: 1.5, color: 'white' }}>
                <PersonRoundedIcon />
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={800}>Create account</Typography>
                <Typography variant="body2" color="text.secondary">Register to start managing your asset operations</Typography>
              </Box>
            </Stack>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField fullWidth label="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} InputProps={{ startAdornment: <InputAdornment position="start"><PersonRoundedIcon /></InputAdornment> }} />
                <TextField fullWidth label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} InputProps={{ startAdornment: <InputAdornment position="start"><EmailRoundedIcon /></InputAdornment> }} />
                <TextField fullWidth label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} InputProps={{ startAdornment: <InputAdornment position="start"><LockRoundedIcon /></InputAdornment> }} />
                <TextField fullWidth label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} InputProps={{ startAdornment: <InputAdornment position="start"><PhoneRoundedIcon /></InputAdornment> }} />
                {error ? <Typography color="error.main">{error}</Typography> : null}
                <Button type="submit" variant="contained" size="large" disabled={loading}>
                  {loading ? <CircularProgress size={22} color="inherit" /> : 'Create account'}
                </Button>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Already have an account? <Link to="/login">Sign in</Link>
                </Typography>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
