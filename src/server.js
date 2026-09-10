const express = require('express');
const path = require('path');
const convert = require('./convert');
const health = require('./health');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: health.status, timestamp: health.timestamp });
});

// Temperature conversion API
app.post('/api/convert', (req, res) => {
  try {
    const { value, unit } = req.body;
    if (value === undefined || unit === undefined) {
      return res.status(400).json({ error: 'Preciso de "valor" e "unidade"' });
    }
    if (unit !== 'cf' && unit !== 'fc') {
      return res.status(400).json({ error: 'Unidade inválida' });
    }
    const fn = unit === 'cf' ? convert.celsiusToFahrenheit : convert.fahrenheitToCelsius;
    const result = fn(value);
    if (Number.isNaN(result)) throw new Error('Valor inválido');
    res.json({ value: Number(value), unit, result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Catch-all: serve index.html for SPA routing
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = app;

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}
