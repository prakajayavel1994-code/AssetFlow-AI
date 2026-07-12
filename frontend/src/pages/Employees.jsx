import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, InputAdornment, Paper, Stack, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { toast } from 'react-toastify';
import api from '../services/api';
import MainLayout from '../layouts/MainLayout';
import Loading from '../components/Loading';

const emptyForm = {
  name: '',
  department: '',
  designation: '',
  email: '',
  phone: '',
  status: 'active',
};

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees');
      setEmployees(response?.data?.data?.employees || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const filteredEmployees = useMemo(() => employees.filter((employee) => `${employee.name} ${employee.department} ${employee.email}`.toLowerCase().includes(search.toLowerCase())), [employees, search]);

  const handleOpenCreate = () => { setEditingEmployee(null); setForm(emptyForm); setOpen(true); };
  const handleOpenEdit = (employee) => { setEditingEmployee(employee); setForm(employee); setOpen(true); };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingEmployee) {
        await api.put(`/employees/${editingEmployee._id}`, form);
        toast.success('Employee updated successfully');
      } else {
        const response = await api.post('/employees', form);
        const account = response?.data?.data?.account;
        toast.success(`Employee account created. Temporary password: ${account?.temporaryPassword || 'Welcome@123'}`);
      }
      setOpen(false);
      await fetchEmployees();
    } catch (error) { console.error(error); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    await api.delete(`/employees/${id}`);
    toast.success('Employee deleted');
    await fetchEmployees();
  };

  if (loading) return <MainLayout><Loading label="Loading employees..." /></MainLayout>;

  return (
    <MainLayout>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} spacing={2}>
          <Box>
            <Typography variant="h4" fontWeight={800}>Employees</Typography>
            <Typography variant="body1" color="text.secondary">Manage your workforce and employee records.</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={handleOpenCreate}>Add Employee</Button>
        </Stack>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <TextField size="small" placeholder="Search employees" value={search} onChange={(e) => setSearch(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment> }} sx={{ minWidth: { md: 280 } }} />
            <Paper variant="outlined" sx={{ mt: 2, borderRadius: 2, overflow: 'hidden' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEmployees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((employee) => (
                    <TableRow key={employee._id} hover>
                      <TableCell>
                        <Typography fontWeight={700}>{employee.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{employee.designation}</Typography>
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell><Chip label={employee.status} color="success" size="small" /></TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleOpenEdit(employee)}><EditRoundedIcon /></IconButton>
                        <IconButton onClick={() => handleDelete(employee._id)}><DeleteRoundedIcon /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination count={filteredEmployees.length} page={page} onPageChange={(_, value) => setPage(value)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(event) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); }} rowsPerPageOptions={[5, 8, 12]} />
            </Paper>
          </CardContent>
        </Card>
      </Stack>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingEmployee ? 'Edit Employee' : 'New Employee'}</DialogTitle>
        <DialogContent>
          <Box component="form" id="employee-form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Department" required value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Designation" required value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit" form="employee-form" variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
}
