import { useState } from 'react';
import { Box, Button, Card, CardContent, Paper, Stack, TextField, Typography } from '@mui/material';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import api from '../services/api';
import MainLayout from '../layouts/MainLayout';

export default function AIAssistant() {
  const [messages, setMessages] = useState([{ sender: 'assistant', text: 'How can I assist with your asset operations today?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const response = await api.post('/ai/chat', { message: input });
      const reply = response?.data?.data?.response?.reply || 'I am here to help.';
      setMessages((prev) => [...prev, { sender: 'assistant', text: reply }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight={800}>AI Assistant</Typography>
          <Typography variant="body1" color="text.secondary">Use intelligent recommendations for maintenance and operations.</Typography>
        </Box>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack spacing={2}>
              {messages.map((message, index) => (
                <Box key={`${message.sender}-${index}`} sx={{ display: 'flex', justifyContent: message.sender === 'assistant' ? 'flex-start' : 'flex-end' }}>
                  <Paper sx={{ p: 2, maxWidth: '75%', bgcolor: message.sender === 'assistant' ? 'grey.100' : 'primary.main', color: message.sender === 'assistant' ? 'text.primary' : 'white' }}>
                    <Typography>{message.text}</Typography>
                  </Paper>
                </Box>
              ))}
              {loading ? <Typography color="text.secondary">Thinking...</Typography> : null}
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ mt: 3 }}>
              <TextField fullWidth label="Ask AI Assistant" value={input} onChange={(e) => setInput(e.target.value)} />
              <Button variant="contained" endIcon={<SendRoundedIcon />} onClick={send}>Send</Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </MainLayout>
  );
}
