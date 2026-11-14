const path = require('path');
const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml');
const env = require('./config/env');
const { sequelize } = require('./models');
const hubRoutes = require('./routes/hub.routes');
const apiRoutes = require('./routes');

const app = express();

app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: (origin, done) => done(null, !origin || env.corsOrigins.includes(origin)),
  })
);

app.use(morgan('dev'));
app.use(express.json());

// Explicit health check endpoint for Render (placed AFTER CORS middleware)
app.get('/api/v1/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({ database: 'up' });
  } catch (err) {
    res.status(500).json({ database: 'down', error: err.message });
  }
});

// Serve uploaded cover images statically
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Mount Swagger UI and OpenAPI JSON
try {
  let file;
  if (fs.existsSync(path.join(__dirname, 'docs', 'openapi.yaml'))) {
    file = fs.readFileSync(path.join(__dirname, 'docs', 'openapi.yaml'), 'utf8');
  } else if (fs.existsSync(path.join(__dirname, 'src', 'docs', 'openapi.yaml'))) {
    file = fs.readFileSync(path.join(__dirname, 'src', 'docs', 'openapi.yaml'), 'utf8');
  }
  if (file) {
    const swaggerDocument = YAML.parse(file);
    app.get('/openapi.json', (req, res) => res.json(swaggerDocument));
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }
} catch (e) {
  console.warn('Swagger UI setup warning:', e.message);
}

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

// Global JSON error handler
app.use((err, req, res, next) => {
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors?.[0]?.path || 'field';
    return res.status(409).json({
      error: {
        code: `DUPLICATE_${field.toUpperCase()}`,
        message: `${field} is already taken`
      }
    });
  }

  const status = err.statusCode || err.status || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'Something went wrong';

  res.status(status).json({
    error: { code, message }
  });
});

module.exports = app;