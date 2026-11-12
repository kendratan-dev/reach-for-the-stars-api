// Week 15: the API documentation.
//   GET /api/v1/openapi.json   the OpenAPI 3 document (for tools, the Hub, SE2)
//   GET /api/v1/docs           Swagger UI: read it and try every endpoint in the browser
const fs = require('fs');
const path = require('path');
const { Router } = require('express');
const YAML = require('yaml');
const swaggerUi = require('swagger-ui-express');
const pkg = require('../../package.json');

// Written by hand in src/docs/openapi.yaml, read ONCE when the API starts.
const spec = YAML.parse(fs.readFileSync(path.join(__dirname, '..', 'docs', 'openapi.yaml'), 'utf8'));
spec.info.version = pkg.version;       // one version number, kept in package.json

const router = Router();
router.get('/openapi.json', (req, res) => res.json(spec));
router.use('/docs', swaggerUi.serve, swaggerUi.setup(spec, { customSiteTitle: 'AklatArena API docs' }));

module.exports = router;
