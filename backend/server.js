const app = require('./src/app');

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`AssetFlow AI server running on http://localhost:${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      const nextPort = port + 1;
      console.warn(`Port ${port} is busy. Trying ${nextPort}...`);
      server.close(() => startServer(nextPort));
    } else {
      console.error('Server failed to start:', error);
      process.exit(1);
    }
  });
};

const PORT = Number(process.env.PORT) || 5000;
startServer(PORT);
