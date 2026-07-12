import { useEffect, useMemo, useState } from 'react';
import { Box, Card, CardContent, Grid, Stack, Typography, Table, TableBody, TableCell, TableHead, TableRow, Chip } from '@mui/material';
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import BuildRoundedIcon from '@mui/icons-material/BuildRounded';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import api from '../services/api';
import DashboardCard from '../components/DashboardCard';
import Loading from '../components/Loading';
import MainLayout from '../layouts/MainLayout';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get('/dashboard');
        setData(response?.data?.data || {});
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const pieData = useMemo(() => ({
    labels: ['Available', 'Assigned', 'Maintenance'],
    datasets: [{
      data: [Math.max((data?.totalAssets || 0) - (data?.assignedAssets || 0) - (data?.maintenanceDue || 0), 0), data?.assignedAssets || 0, data?.maintenanceDue || 0],
      backgroundColor: ['#60a5fa', '#2563eb', '#f59e0b'],
    }],
  }), [data]);

  const barData = useMemo(() => ({
    labels: ['Assets', 'Employees', 'Assigned', 'Maintenance'],
    datasets: [{
      label: 'Current State',
      data: [data?.totalAssets || 0, data?.totalEmployees || 0, data?.assignedAssets || 0, data?.maintenanceDue || 0],
      backgroundColor: '#2563eb',
    }],
  }), [data]);

  if (loading) return <MainLayout><Loading label="Loading dashboard insights..." /></MainLayout>;

  return (
    <MainLayout>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight={800}>Operations overview</Typography>
          <Typography variant="body1" color="text.secondary">A real-time view of your asset landscape and team activity.</Typography>
        </Box>

        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard title="Total Assets" value={data?.totalAssets || 0} subtitle="Tracked in inventory" icon={<DevicesRoundedIcon />} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard title="Employees" value={data?.totalEmployees || 0} subtitle="Active workforce" icon={<GroupRoundedIcon />} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard title="Assigned Assets" value={data?.assignedAssets || 0} subtitle="Currently deployed" icon={<AssignmentRoundedIcon />} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard title="Maintenance Due" value={data?.maintenanceDue || 0} subtitle="Scheduled services" icon={<BuildRoundedIcon />} />
          </Grid>
        </Grid>

        <Grid container spacing={2.5}>
          <Grid item xs={12} lg={6}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Asset distribution</Typography>
                <Pie data={pieData} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Operational metrics</Typography>
                <Bar data={barData} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Recent activities</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Activity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(data?.recentActivities || []).map((activity, index) => (
                  <TableRow key={`${activity.type}-${index}`}>
                    <TableCell>
                      <Chip label={activity.type} color="primary" variant="outlined" />
                    </TableCell>
                    <TableCell>{activity.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Stack>
    </MainLayout>
  );
}
