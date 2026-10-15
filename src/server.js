// Entry point: load config, then start listening.
const env = require('./config/env');
const app = require('./app');

// Express 5 hands a start-up failure (for example, port already in use)
// to this callback as "error", so we must check it before claiming success.
app.listen(env.port, (error) => {
  if (error) {
    console.error(`Could not start the API: ${error.message}`);
    process.exit(1);
  }
  console.log(`API listening on http://localhost:${env.port}/api/v1`);
});
