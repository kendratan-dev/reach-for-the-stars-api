// Week 16: writes docs/api-reference.md from src/docs/openapi.yaml, so the
// printed reference and Swagger UI never disagree.  npm run docs:api
const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const pkg = require('../package.json');

const spec = YAML.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'docs', 'openapi.yaml'), 'utf8'));
const verbs = ['get', 'post', 'put', 'patch', 'delete'];
const lines = [`# API reference: ${spec.info.title} ${pkg.version}`, '',
  `Generated from \`src/docs/openapi.yaml\` by \`npm run docs:api\`. Base URL: \`/api/v1\`. Try every endpoint in Swagger UI at \`/api/v1/docs/\`.`, '',
  'Every error answers `{ "error": { "code": "...", "message": "..." } }`. "Login" means the header `Authorization: Bearer <token>`.', ''];
const byTag = {};
for (const [url, item] of Object.entries(spec.paths)) {
  for (const verb of verbs.filter((v) => item[v])) {
    const op = item[verb];
    const tag = (op.tags || ['Other'])[0];
    (byTag[tag] = byTag[tag] || []).push({ url, verb, op });
  }
}
for (const [tag, ops] of Object.entries(byTag)) {
  lines.push(`## ${tag}`, '', '| Method | Path | What it does | Needs | Answers |', '|---|---|---|---|---|');
  for (const { url, verb, op } of ops) {
    const needs = (op.security || []).map((s) => (s.bearerAuth ? 'login' : 'X-Hub-Key')).join(', ') || 'nothing';
    const answers = Object.keys(op.responses).join(', ');
    lines.push(`| ${verb.toUpperCase()} | \`${url}\` | ${op.summary.replace(/\|/g, '/')} | ${needs} | ${answers} |`);
  }
  lines.push('');
}
fs.writeFileSync(path.join(__dirname, '..', 'docs', 'api-reference.md'), `${lines.join('\n')}\n`);
console.log(`Wrote docs/api-reference.md: ${Object.values(byTag).flat().length} operations.`);
