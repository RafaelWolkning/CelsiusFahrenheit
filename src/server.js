const express = require('express');
const path = require('path');
const convert = require('./convert');
const health = require('./health');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json(health.status);
});

// Temperature conversion API
app.post('/api/convert', (req, res) => {
  try {
    const { value, unit } = req.body;
    if (!value || !unit) {
      return res.status(400).json({ error: 'Preciso de "valor" e "unidade"' });
    }
    const fn = unit === 'cf' ? convert.celsiusToFahrenheit : convert.fahrenheitToCelsius;
    const result = fn(Number(value));
    if (Number.isNaN(result)) throw new Error('Valor inválido');
    res.json({ value, unit, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Catch-all: serve index.html for SPA routing
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
