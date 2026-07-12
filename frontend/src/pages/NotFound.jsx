import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', p: 3 }}>
      <Typography variant="h3" fontWeight={800}>Page not found</Typography>
      <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>The page you are looking for does not exist.</Typography>
      <Button component={Link} to="/dashboard" variant="contained">Go to dashboard</Button>
    </Box>
  );
}
