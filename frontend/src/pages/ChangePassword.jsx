import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, Container, Stack, TextField, Typography, CircularProgress } from '@mui/material';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ChangePassword() {
  const navigate = useNavigate();
  const { updateUser, user } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/change-password', form);
      updateUser((current) => (current ? { ...current, mustChangePassword: false } : current));
      navigate(user?.role === 'employee' ? '/employee/dashboard' : '/admin/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to change password');
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
                <LockRoundedIcon />
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={800}>Change password</Typography>
                <Typography variant="body2" color="text.secondary">You must update your temporary password before continuing.</Typography>
              </Box>
            </Stack>
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField fullWidth label="Current password" type="password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} />
                <TextField fullWidth label="New password" type="password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
                {error ? <Typography color="error.main">{error}</Typography> : null}
                <Button type="submit" variant="contained" size="large" disabled={loading}>
                  {loading ? <CircularProgress size={22} color="inherit" /> : 'Save password'}
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
