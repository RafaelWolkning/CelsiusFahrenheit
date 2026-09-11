const express = require('express');
const path = require('path');
const convert = require('./convert');
const health = require('./health');

// Frontend Vue compilado pelo Vite (npm run build)
const DIST_DIR = path.join(__dirname, '../dist');

const app = express();
app.use(express.json());
app.use(express.static(DIST_DIR));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: health.status, timestamp: health.timestamp });
});

function performConversion(value, unit) {
  if (value === undefined || unit === undefined) {
    const err = new Error('Preciso de "valor" e "unidade"');
    err.status = 400;
    throw err;
  }
  if (unit !== 'cf' && unit !== 'fc') {
    const err = new Error('Unidade inválida');
    err.status = 400;
    throw err;
  }
  const fn = unit === 'cf' ? convert.celsiusToFahrenheit : convert.fahrenheitToCelsius;
  const result = fn(value);
  if (Number.isNaN(result)) {
    const err = new Error('Valor inválido');
    err.status = 400;
    throw err;
  }
  return { value: Number(value), unit, result };
}

// Temperature conversion API
app.post('/api/convert', (req, res) => {
  try {
    res.json(performConversion(req.body.value, req.body.unit));
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// Temperature conversion API (GET, usada pelo frontend)
app.get('/api/convert', (req, res) => {
  try {
    res.json(performConversion(req.query.value, req.query.unit));
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// Catch-all: serve index.html for SPA routing
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

module.exports = app;

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}
