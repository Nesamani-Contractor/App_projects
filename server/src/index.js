const path = require('path');
const express = require('express');
const cors = require('cors');
const config = require('./config');
const analyzeRoute = require('./routes/analyze');

config._validate();

const app = express();
app.use(cors());
app.use('/celebrities', express.static(path.join(__dirname, '..', 'public', 'celebrities')));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api', analyzeRoute);

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Shine Me face-analysis server listening on :${config.port}`);
  // eslint-disable-next-line no-console
  console.log(`  skin/makeup provider: ${config.skinMakeupProvider}`);
  // eslint-disable-next-line no-console
  console.log(`  celebrity match provider: ${config.celebrityMatchProvider}`);
});
