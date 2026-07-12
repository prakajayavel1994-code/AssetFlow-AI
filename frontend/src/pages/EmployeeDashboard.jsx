import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Grid, Stack, Typography, Chip } from '@mui/material';
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import BuildRoundedIcon from '@mui/icons-material/BuildRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import api from '../services/api';
import MainLayout from '../layouts/MainLayout';
import Loading from '../components/Loading';

export default function EmployeeDashboard() {
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

  if (loading) return <MainLayout><Loading label="Loading employee dashboard..." /></MainLayout>;

  return (
    <MainLayout>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight={800}>My workspace</Typography>
          <Typography variant="body1" color="text.secondary">Track your assigned assets, maintenance needs, and updates.</Typography>
        </Box>

        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Assigned assets</Typography>
                <Typography variant="h4" fontWeight={800}>{data?.assignedAssets || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Maintenance items</Typography>
                <Typography variant="h4" fontWeight={800}>{data?.maintenanceDue || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Notifications</Typography>
                <Typography variant="h4" fontWeight={800}>{(data?.notifications || []).length}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={2.5}>
          <Grid item xs={12} lg={7}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>My assigned assets</Typography>
                <Stack spacing={1.5}>
                  {(data?.myAssets || []).map((asset) => (
                    <Box key={asset?._id} sx={{ p: 2, borderRadius: 2, bgcolor: 'grey.50', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography fontWeight={700}>{asset?.assetName || 'Unnamed asset'}</Typography>
                        <Typography variant="body2" color="text.secondary">{asset?.category || 'Asset'}</Typography>
                      </Box>
                      <Chip label={asset?.status || 'assigned'} color="primary" size="small" />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={5}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Recent updates</Typography>
                <Stack spacing={1.5}>
                  {(data?.notifications || []).slice(0, 4).map((item) => (
                    <Box key={item?._id} sx={{ display: 'flex', gap: 1 }}>
                      <NotificationsRoundedIcon color="primary" />
                      <Box>
                        <Typography fontWeight={600}>{item?.title || 'Update'}</Typography>
                        <Typography variant="body2" color="text.secondary">{item?.message || 'No details'}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </MainLayout>
  );
}
