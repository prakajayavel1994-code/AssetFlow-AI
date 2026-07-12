import { AppBar, Box, IconButton, Stack, Toolbar, Typography, Avatar, useTheme } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onMenuClick }) {
  const theme = useTheme();
  const { user } = useAuth();

  return (
    <AppBar position="sticky" color="transparent" elevation={0} sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 3 } }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <IconButton color="inherit" onClick={onMenuClick} sx={{ display: { md: 'none' } }}>
            <MenuRoundedIcon />
          </IconButton>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Asset Operations Console
            </Typography>
            <Typography variant="caption" color="text.secondary">
              AI-powered resource intelligence
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton color="inherit">
            <NotificationsRoundedIcon />
          </IconButton>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 1 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
              {user?.fullName?.charAt(0) || 'A'}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={700}>{user?.fullName || 'Admin'}</Typography>
              <Typography variant="caption" color="text.secondary">{user?.role || 'Admin'}</Typography>
            </Box>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
