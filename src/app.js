const express = require('express');
const hubRoutes = require('./routes/hub.routes');
const apiRoutes = require('./routes');

const app = express();

app.use(express.json());

// Mount hub routes under /api/v1 (matches BASE URL in ci-check.js)
app.use('/api/v1', hubRoutes);

// Mount remaining module routes
app.use('/api/v1', apiRoutes);

// Catch-all 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl}`
    }
  });
});

module.exports = app;