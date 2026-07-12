import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Stack,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import BuildRoundedIcon from '@mui/icons-material/BuildRounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 260;

const adminMenuItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: DashboardRoundedIcon },
  { label: 'Assets', path: '/admin/assets', icon: DevicesRoundedIcon },
  { label: 'Employees', path: '/admin/employees', icon: GroupRoundedIcon },
  { label: 'Assignments', path: '/admin/assignments', icon: AssignmentRoundedIcon },
  { label: 'Maintenance', path: '/admin/maintenance', icon: BuildRoundedIcon },
  { label: 'Reports', path: '/admin/reports', icon: AssessmentRoundedIcon },
  { label: 'AI Assistant', path: '/admin/ai', icon: SmartToyRoundedIcon },
];

const employeeMenuItems = [
  { label: 'Dashboard', path: '/employee/dashboard', icon: DashboardRoundedIcon },
  { label: 'My Assets', path: '/employee/assets', icon: DevicesRoundedIcon },
  { label: 'Maintenance Requests', path: '/employee/maintenance', icon: BuildRoundedIcon },
  { label: 'Notifications', path: '/employee/notifications', icon: AssessmentRoundedIcon },
  { label: 'Profile', path: '/employee/profile', icon: GroupRoundedIcon },
];

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';
  const menuItems = isAdmin ? adminMenuItems : employeeMenuItems;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const content = useMemo(
    () => (
      <Box sx={{ width: drawerWidth, height: '100%', bgcolor: 'background.paper', p: 3 }}>
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={800} color="primary.main">
            AssetFlow AI
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enterprise Asset Intelligence
          </Typography>
        </Stack>

        <Chip label="ERP Control Center" color="primary" variant="outlined" sx={{ mb: 2 }} />

        <List dense>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <ListItemButton
                key={item.path}
                selected={active}
                onClick={() => {
                  navigate(item.path);
                  if (onClose) onClose();
                }}
                sx={{ borderRadius: 2, mb: 0.5 }}
              >
                <ListItemIcon>
                  <Icon color={active ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            );
          })}
        </List>

        <Divider sx={{ my: 2 }} />

        <List dense>
          <ListItemButton
            onClick={() => {
              logout();
              navigate('/login');
            }}
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon>
              <LogoutRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>

        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Signed in as
          </Typography>
          <Typography variant="body2" fontWeight={700}>
            {user?.fullName || 'Operations Team'}
          </Typography>
        </Box>
      </Box>
    ),
    [location.pathname, navigate, onClose, logout, user?.fullName],
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? open : true}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': { boxSizing: 'border-box', borderRight: 1 },
      }}
    >
      {content}
    </Drawer>
  );
}
