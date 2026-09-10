const request = require('supertest');
const app = require('../src/server');

describe('API — GET /health', () => {
  test('returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.timestamp).toBeDefined();
  });
});

describe('API — POST /api/convert', () => {
  test('100°C → 212°F (cf)', async () => {
    const res = await request(app)
      .post('/api/convert')
      .send({ value: 100, unit: 'cf' });
    expect(res.status).toBe(200);
    expect(res.body.result).toBe(212);
  });

  test('212°F → 100°C (fc)', async () => {
    const res = await request(app)
      .post('/api/convert')
      .send({ value: 212, unit: 'fc' });
    expect(res.status).toBe(200);
    expect(res.body.result).toBe(100);
  });

  test('missing fields → 400', async () => {
    const res = await request(app).post('/api/convert').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Preciso de "valor" e "unidade"');
  });

  test('invalid unit → 400', async () => {
    const res = await request(app)
      .post('/api/convert')
      .send({ value: 100, unit: 'xx' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Unidade inválida');
  });

  test('invalid value → 400', async () => {
    const res = await request(app)
      .post('/api/convert')
      .send({ value: 'abc', unit: 'cf' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Valor inválido');
  });
});

describe('API — GET /api/convert', () => {
  test('100°C → 212°F via query string (usado pelo frontend)', async () => {
    const res = await request(app).get('/api/convert?value=100&unit=cf');
    expect(res.status).toBe(200);
    expect(res.body.result).toBe(212);
  });

  test('212°F → 100°C via query string', async () => {
    const res = await request(app).get('/api/convert?value=212&unit=fc');
    expect(res.status).toBe(200);
    expect(res.body.result).toBe(100);
  });

  test('missing params → 400', async () => {
    const res = await request(app).get('/api/convert');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Preciso de "valor" e "unidade"');
  });

  test('invalid unit → 400', async () => {
    const res = await request(app).get('/api/convert?value=100&unit=xx');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Unidade inválida');
  });
});

describe('API — Serve index.html', () => {
  test('GET / returns HTML', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/html');
    expect(res.text).toContain('Conversor de Temperatura');
  });

  test('GET /unknown-route falls back to index.html', async () => {
    const res = await request(app).get('/alguna-ruta');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Conversor de Temperatura');
  });
});