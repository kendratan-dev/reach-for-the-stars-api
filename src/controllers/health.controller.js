// Translates between HTTP and the service. No SQL, no business rules.
const pkg = require('../../package.json');
const healthService = require('../services/health.service');

async function getHealth(req, res) {
  const database = await healthService.checkDatabase();
  const healthy = database === 'up';

  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'ok' : 'degraded',
    service: pkg.name,
    version: pkg.version,
    database,
    uptime_seconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
}

module.exports = { getHealth };
