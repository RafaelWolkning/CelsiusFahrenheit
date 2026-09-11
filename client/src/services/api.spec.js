import { afterEach, describe, expect, it, vi } from 'vitest';
import { convertTemperature } from './api.js';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('convertTemperature', () => {
  it('chama GET /api/convert com value e unit', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ value: 100, unit: 'cf', result: 212 }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const data = await convertTemperature(100, 'cf');

    expect(fetchMock).toHaveBeenCalledWith('/api/convert?value=100&unit=cf');
    expect(data.result).toBe(212);
  });

  it('propaga a mensagem de erro da API', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Valor inválido' }),
    }));

    await expect(convertTemperature('abc', 'cf')).rejects.toThrow('Valor inválido');
  });

  it('usa mensagem genérica quando a API falha sem mensagem', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) }));

    await expect(convertTemperature(1, 'cf')).rejects.toThrow('Erro na conversão');
  });

  it('falha de rede vira "Erro de conexão"', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await expect(convertTemperature(1, 'cf')).rejects.toThrow('Erro de conexão');
  });
});
