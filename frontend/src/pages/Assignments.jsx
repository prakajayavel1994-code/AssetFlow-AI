import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import api from '../services/api';
import MainLayout from '../layouts/MainLayout';
import Loading from '../components/Loading';

const emptyForm = { assetId: '', employeeId: '', remarks: '' };

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchData = async () => {
    try {
      const [assignRes, assetRes, empRes] = await Promise.all([
        api.get('/assignments/history'),
        api.get('/assets'),
        api.get('/employees'),
      ]);
      setAssignments(assignRes?.data?.data?.assignments || []);
      setAssets(assetRes?.data?.data?.assets || []);
      setEmployees(empRes?.data?.data?.employees || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await api.post('/assignments/assign', form);
    setOpen(false);
    setForm(emptyForm);
    await fetchData();
  };

  if (loading) return <MainLayout><Loading label="Loading assignments..." /></MainLayout>;

  return (
    <MainLayout>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} spacing={2}>
          <Box>
            <Typography variant="h4" fontWeight={800}>Assignments</Typography>
            <Typography variant="body1" color="text.secondary">Assign equipment to employees and track asset handoff.</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setOpen(true)}>Assign Asset</Button>
        </Stack>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Asset</TableCell>
                  <TableCell>Employee</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Remarks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignments.map((assignment) => (
                  <TableRow key={assignment._id} hover>
                    <TableCell>{assignment.asset?.assetName || '—'}</TableCell>
                    <TableCell>{assignment.employee?.name || '—'}</TableCell>
                    <TableCell><Chip label={assignment.status} color={assignment.status === 'active' ? 'primary' : 'success'} size="small" /></TableCell>
                    <TableCell>{assignment.remarks || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Stack>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Asset</DialogTitle>
        <DialogContent>
          <Box component="form" id="assignment-form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField select fullWidth label="Asset" value={form.assetId} onChange={(e) => setForm({ ...form, assetId: e.target.value })}>
                  {assets.filter((asset) => asset.status === 'available').map((asset) => <MenuItem key={asset._id} value={asset._id}>{asset.assetName}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField select fullWidth label="Employee" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}>
                  {employees.map((employee) => <MenuItem key={employee._id} value={employee._id}>{employee.name}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Remarks" multiline rows={3} value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit" form="assignment-form" variant="contained">Assign</Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
}
