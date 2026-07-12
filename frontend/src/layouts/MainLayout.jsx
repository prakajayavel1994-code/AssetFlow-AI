import { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function MainLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - 260px)` } }}>
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <Toolbar />
        <Box sx={{ p: { xs: 2, md: 3 } }}>{children}</Box>
      </Box>
    </Box>
  );
}
