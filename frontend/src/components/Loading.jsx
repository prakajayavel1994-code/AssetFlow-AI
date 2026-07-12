import { Box, CircularProgress, Stack, Typography } from '@mui/material';

export default function Loading({ message = 'Loading data...' }) {
  return (
    <Box minHeight="60vh" display="flex" alignItems="center" justifyContent="center">
      <Stack spacing={2} alignItems="center">
        <CircularProgress size={44} />
        <Typography color="text.secondary">{message}</Typography>
      </Stack>
    </Box>
  );
}
