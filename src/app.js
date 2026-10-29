const express = require('express');
const hubRoutes = require('./routes/hub.routes');

const app = express();

app.use(express.json());

// 1. Mount Hub Routes directly at root level
app.use('/', hubRoutes);

// 2. Mount API Module Routes
app.use('/api/v1', require('./routes'));

// 3. Catch-all 404 Handler (must remain at the very end)
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl}`
    }
  });
});

module.exports = app;