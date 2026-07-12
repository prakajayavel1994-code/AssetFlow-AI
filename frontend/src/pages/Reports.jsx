import { useEffect, useMemo, useState } from 'react';
import { Box, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import api from '../services/api';
import MainLayout from '../layouts/MainLayout';
import Loading from '../components/Loading';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get('/reports');
        setData(response?.data?.data || {});
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const assetStats = useMemo(() => ({
    labels: ['Available', 'Assigned', 'Maintenance'],
    datasets: [{ data: [Math.max((data?.assets || []).length - 1, 0), 1, 1], backgroundColor: ['#60a5fa', '#2563eb', '#f59e0b'] }],
  }), [data]);

  const maintenanceStats = useMemo(() => ({
    labels: ['Upcoming', 'Completed'],
    datasets: [{ label: 'Maintenance', data: [(data?.maintenance || []).filter((item) => item.status === 'upcoming').length, (data?.maintenance || []).filter((item) => item.status === 'completed').length], backgroundColor: ['#2563eb', '#16a34a'] }],
  }), [data]);

  if (loading) return <MainLayout><Loading label="Generating reports..." /></MainLayout>;

  return (
    <MainLayout>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight={800}>Performance reports</Typography>
          <Typography variant="body1" color="text.secondary">Visual summaries of asset, employee, and maintenance health.</Typography>
        </Box>

        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: 3 }}><CardContent><Typography variant="body2" color="text.secondary">Assets</Typography><Typography variant="h4" fontWeight={800}>{(data?.assets || []).length}</Typography></CardContent></Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: 3 }}><CardContent><Typography variant="body2" color="text.secondary">Employees</Typography><Typography variant="h4" fontWeight={800}>{(data?.employees || []).length}</Typography></CardContent></Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: 3 }}><CardContent><Typography variant="body2" color="text.secondary">Maintenance</Typography><Typography variant="h4" fontWeight={800}>{(data?.maintenance || []).length}</Typography></CardContent></Card>
          </Grid>
        </Grid>

        <Grid container spacing={2.5}>
          <Grid item xs={12} lg={6}>
            <Card sx={{ borderRadius: 3 }}><CardContent><Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Asset status</Typography><Pie data={assetStats} /></CardContent></Card>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Card sx={{ borderRadius: 3 }}><CardContent><Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Maintenance trend</Typography><Bar data={maintenanceStats} /></CardContent></Card>
          </Grid>
        </Grid>
      </Stack>
    </MainLayout>
  );
}
