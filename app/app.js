const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
const LOG_NOISE = (process.env.LOG_NOISE || 'true').toLowerCase() === 'true';
const LOG_INTERVAL_MS = parseInt(process.env.LOG_INTERVAL_MS || '2000', 10);

function log(level, msg, extra = {}) {
  // JSON logs so Datadog auto-parses fields
  const payload = {
    level,                      // "info" | "warn" | "error" | "success"
    msg,
    service: "hello-argo",
    ts: new Date().toISOString(),
    ...extra,
  };
  console.log(JSON.stringify(payload));
}

app.get('/', (_req, res) => {
  log('success', 'Hello endpoint hit');
  res.send('Hello World from Argo CD!');
});

app.get('/log/:level', (req, res) => {
  const level = req.params.level.toLowerCase();
  const allowed = ['info','warn','error','success'];
  if (!allowed.includes(level)) {
    return res.status(400).send(`level must be one of ${allowed.join(', ')}`);
  }
  log(level, `Manual log: ${level}`);
  res.send(`Emitted a ${level} log`);
});

app.get('/boom', (_req, res) => {
  log('error', 'Simulated error happened', {code: 'BOOM_SIM'});
  res.status(500).send('Boom!');
});

app.listen(PORT, () => {
  log('info', `App running on port ${PORT}`);
});

if (LOG_NOISE) {
  const levels = ['info','warn','error','success'];
  setInterval(() => {
    const level = levels[Math.floor(Math.random() * levels.length)];
    log(level, 'Periodic random log');
  }, LOG_INTERVAL_MS);
}