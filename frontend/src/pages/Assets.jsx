import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  TablePagination,
  InputAdornment,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import QrCodeRoundedIcon from '@mui/icons-material/QrCodeRounded';
import { QRCodeSVG } from 'qrcode.react';
import api from '../services/api';
import MainLayout from '../layouts/MainLayout';
import Loading from '../components/Loading';

const emptyForm = {
  assetName: '',
  category: 'Hardware',
  brand: '',
  model: '',
  serialNumber: '',
  status: 'available',
  purchasePrice: 0,
};

export default function Assets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [qrAsset, setQrAsset] = useState(null);

  const fetchAssets = async () => {
    try {
      const response = await api.get('/assets');
      setAssets(response?.data?.data?.assets || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAssets(); }, []);

  const filteredAssets = useMemo(() => assets.filter((asset) => `${asset.assetName} ${asset.brand} ${asset.serialNumber}`.toLowerCase().includes(search.toLowerCase())), [assets, search]);

  const handleOpenCreate = () => { setEditingAsset(null); setForm(emptyForm); setOpen(true); };
  const handleOpenEdit = (asset) => { setEditingAsset(asset); setForm({ ...asset, purchasePrice: asset.purchasePrice || 0 }); setOpen(true); };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingAsset) {
        await api.put(`/assets/${editingAsset._id}`, form);
      } else {
        await api.post('/assets', form);
      }
      setOpen(false);
      await fetchAssets();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this asset?')) return;
    await api.delete(`/assets/${id}`);
    await fetchAssets();
  };

  if (loading) return <MainLayout><Loading label="Loading assets..." /></MainLayout>;

  return (
    <MainLayout>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} spacing={2}>
          <Box>
            <Typography variant="h4" fontWeight={800}>Asset inventory</Typography>
            <Typography variant="body1" color="text.secondary">Track hardware, manage lifecycle, and generate QR codes.</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={handleOpenCreate}>Add Asset</Button>
        </Stack>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
              <TextField
                size="small"
                placeholder="Search assets"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment> }}
                sx={{ minWidth: { md: 280 } }}
              />
            </Stack>
            <Paper variant="outlined" sx={{ mt: 2, borderRadius: 2, overflow: 'hidden' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Asset</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Serial</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAssets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((asset) => (
                    <TableRow key={asset._id} hover>
                      <TableCell>
                        <Typography fontWeight={700}>{asset.assetName}</Typography>
                        <Typography variant="caption" color="text.secondary">{asset.brand} · {asset.model}</Typography>
                      </TableCell>
                      <TableCell>{asset.category}</TableCell>
                      <TableCell><Chip label={asset.status} color={asset.status === 'assigned' ? 'primary' : asset.status === 'maintenance' ? 'warning' : 'success'} size="small" /></TableCell>
                      <TableCell>{asset.serialNumber}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => setQrAsset(asset)}><QrCodeRoundedIcon /></IconButton>
                        <IconButton onClick={() => handleOpenEdit(asset)}><EditRoundedIcon /></IconButton>
                        <IconButton onClick={() => handleDelete(asset._id)}><DeleteRoundedIcon /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={filteredAssets.length}
                page={page}
                onPageChange={(_, value) => setPage(value)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); }}
                rowsPerPageOptions={[5, 8, 12]}
              />
            </Paper>
          </CardContent>
        </Card>
      </Stack>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingAsset ? 'Edit Asset' : 'New Asset'}</DialogTitle>
        <DialogContent>
          <Box component="form" id="asset-form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Asset Name" required value={form.assetName} onChange={(e) => setForm({ ...form, assetName: e.target.value })} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Category" required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Model" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Serial Number" value={form.serialNumber} onChange={(e) => setForm({ ...form, serialNumber: e.target.value })} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Purchase Price" type="number" value={form.purchasePrice} onChange={(e) => setForm({ ...form, purchasePrice: Number(e.target.value) })} /></Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <MenuItem value="available">Available</MenuItem>
                  <MenuItem value="assigned">Assigned</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="retired">Retired</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit" form="asset-form" variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(qrAsset)} onClose={() => setQrAsset(null)}>
        <DialogTitle>QR Code</DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          {qrAsset ? <QRCodeSVG value={qrAsset.assetCode || qrAsset._id} size={220} /> : null}
          <Typography sx={{ mt: 2 }}>{qrAsset?.assetName}</Typography>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
