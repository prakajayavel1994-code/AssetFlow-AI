import { Card, CardContent, Stack, Typography, Box } from '@mui/material';

export default function DashboardCard({ title, value, subtitle, icon, color = 'primary.main' }) {
  return (
    <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 14px 40px rgba(15, 23, 42, 0.06)' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="body2" color="text.secondary">{title}</Typography>
            <Typography variant="h4" fontWeight={800} sx={{ my: 1 }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
          </Box>
          <Box sx={{ bgcolor: `${color}20`, color, borderRadius: 2, p: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
