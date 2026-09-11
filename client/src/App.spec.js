import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import App from './App.vue';

// Simula o backend real (mesma fórmula de src/convert.js)
function fakeApi(url) {
  const params = new URL(url, 'http://localhost').searchParams;
  const value = Number(params.get('value'));
  const unit = params.get('unit');
  const raw = unit === 'cf' ? (value * 9) / 5 + 32 : ((value - 32) * 5) / 9;
  return Promise.resolve({
    ok: true,
    json: async () => ({ value, unit, result: Math.round(raw * 100) / 100 }),
  });
}

async function convertWith(wrapper, value, unit = 'cf') {
  await wrapper.find('#unit').setValue(unit);
  await wrapper.find('#value').setValue(value);
  await wrapper.find('form').trigger('submit');
  await flushPromises();
}

let wrapper;

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(fakeApi));
  wrapper = mount(App);
});

afterEach(() => {
  wrapper.unmount();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('App — tema conforme a temperatura', () => {
  it('começa neutro, sem cenário e sem resultado', () => {
    expect(wrapper.classes()).toContain('climate-neutral');
    expect(wrapper.find('.scene').exists()).toBe(false);
    expect(wrapper.find('.result-value').text()).toBe('—');
  });

  it('40 °C → 104 °F e cenário de fogo', async () => {
    await convertWith(wrapper, 40, 'cf');

    expect(wrapper.find('.result-value').text()).toBe('104 °F');
    expect(wrapper.classes()).toContain('climate-hot');
    expect(wrapper.find('.scene.hot').exists()).toBe(true);
    expect(wrapper.find('.mood').text()).toContain('calor');
  });

  it('0 °C → cenário de gelo', async () => {
    await convertWith(wrapper, 0, 'cf');

    expect(wrapper.find('.result-value').text()).toBe('32 °F');
    expect(wrapper.classes()).toContain('climate-cold');
    expect(wrapper.find('.scene.cold').exists()).toBe(true);
  });

  it('77 °F → 25 °C → cenário de dia tranquilo (usa o resultado em °C)', async () => {
    await convertWith(wrapper, 77, 'fc');

    expect(wrapper.find('.result-value').text()).toBe('25 °C');
    expect(wrapper.classes()).toContain('climate-mild');
    expect(wrapper.find('.scene.mild').exists()).toBe(true);
  });

  it('100 °F → 37,78 °C → cenário de fogo', async () => {
    await convertWith(wrapper, 100, 'fc');

    expect(wrapper.find('.result-value').text()).toBe('37,78 °C');
    expect(wrapper.classes()).toContain('climate-hot');
  });

  it('converte automaticamente após parar de digitar', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    await wrapper.find('#value').setValue(-5);

    expect(fetch).not.toHaveBeenCalled();
    vi.advanceTimersByTime(400);
    await flushPromises();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(wrapper.classes()).toContain('climate-cold');
  });

  it('apagar o valor volta ao tema neutro', async () => {
    await convertWith(wrapper, 40, 'cf');
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    await wrapper.find('#value').setValue('');
    vi.advanceTimersByTime(400);
    await flushPromises();

    expect(wrapper.classes()).toContain('climate-neutral');
    expect(wrapper.find('.result-value').text()).toBe('—');
  });
});

describe('App — erros', () => {
  it('converter sem valor mostra "Insira um valor"', async () => {
    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(wrapper.find('.result-error').text()).toContain('Insira um valor');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('erro da API é exibido e o tema volta ao neutro', async () => {
    await convertWith(wrapper, 40, 'cf');
    fetch.mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'Valor inválido' }) });
    await convertWith(wrapper, 41, 'cf');

    expect(wrapper.find('.result-error').text()).toContain('Valor inválido');
    expect(wrapper.classes()).toContain('climate-neutral');
  });

  it('falha de rede mostra "Erro de conexão"', async () => {
    fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));
    await convertWith(wrapper, 10, 'cf');

    expect(wrapper.find('.result-error').text()).toContain('Erro de conexão');
  });

  it('ignora resposta antiga que chega depois de uma mais nova', async () => {
    let resolveSlow;
    fetch.mockImplementationOnce(() => new Promise((resolve) => { resolveSlow = resolve; }));

    await wrapper.find('#value').setValue(40);
    await wrapper.find('form').trigger('submit'); // lenta (quente)
    await wrapper.find('#value').setValue(0);
    await wrapper.find('form').trigger('submit'); // rápida (fria)
    await flushPromises();

    resolveSlow({ ok: true, json: async () => ({ value: 40, unit: 'cf', result: 104 }) });
    await flushPromises();

    expect(wrapper.classes()).toContain('climate-cold');
  });
});
