import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import api from '../services/api';
import MainLayout from '../layouts/MainLayout';
import Loading from '../components/Loading';

const emptyForm = { asset: '', maintenanceType: '', description: '', scheduledDate: '', status: 'upcoming' };

export default function Maintenance() {
  const [maintenance, setMaintenance] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchData = async () => {
    try {
      const [maintenanceRes, assetRes] = await Promise.all([api.get('/maintenance'), api.get('/assets')]);
      setMaintenance(maintenanceRes?.data?.data?.maintenance || []);
      setAssets(assetRes?.data?.data?.assets || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await api.post('/maintenance', form);
    setOpen(false);
    setForm(emptyForm);
    await fetchData();
  };

  if (loading) return <MainLayout><Loading label="Loading maintenance records..." /></MainLayout>;

  return (
    <MainLayout>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} spacing={2}>
          <Box>
            <Typography variant="h4" fontWeight={800}>Maintenance</Typography>
            <Typography variant="body1" color="text.secondary">Keep operations reliable with proactive maintenance tasks.</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setOpen(true)}>Log Maintenance</Button>
        </Stack>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Asset</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Scheduled</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {maintenance.map((entry) => (
                  <TableRow key={entry._id} hover>
                    <TableCell>{entry.asset?.assetName || '—'}</TableCell>
                    <TableCell>{entry.maintenanceType}</TableCell>
                    <TableCell><Chip label={entry.status} color={entry.status === 'completed' ? 'success' : 'warning'} size="small" /></TableCell>
                    <TableCell>{entry.scheduledDate ? new Date(entry.scheduledDate).toLocaleDateString() : '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Stack>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Log Maintenance</DialogTitle>
        <DialogContent>
          <Box component="form" id="maintenance-form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField select fullWidth label="Asset" value={form.asset} onChange={(e) => setForm({ ...form, asset: e.target.value })}>
                  {assets.map((asset) => <MenuItem key={asset._id} value={asset._id}>{asset.assetName}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Maintenance Type" value={form.maintenanceType} onChange={(e) => setForm({ ...form, maintenanceType: e.target.value })} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Description" multiline rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Scheduled Date" type="date" InputLabelProps={{ shrink: true }} value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit" form="maintenance-form" variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
}
