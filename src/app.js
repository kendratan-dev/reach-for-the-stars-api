// Builds the Express app. Does NOT start listening - server.js does that.
const express = require('express');
const routes = require('./routes');
const notFound = require('./middlewares/not-found');
const errorHandler = require('./middlewares/error-handler');

const app = express();

app.use(express.json());

// Hub Contract: every endpoint lives under /api/v1
app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
