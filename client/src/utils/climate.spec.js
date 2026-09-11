import { describe, expect, it } from 'vitest';
import {
  formatTemperature,
  getClimate,
  getIntensity,
  sourceSymbol,
  targetSymbol,
  toCelsius,
} from './climate.js';

describe('getClimate — faixas de temperatura', () => {
  it.each([
    [-30, 'cold'],
    [0, 'cold'],
    [15.99, 'cold'],
    [16, 'mild'],
    [22, 'mild'],
    [28, 'mild'],
    [28.01, 'hot'],
    [45, 'hot'],
  ])('%s °C → %s', (celsius, expected) => {
    expect(getClimate(celsius)).toBe(expected);
  });

  it('aceita número em string', () => {
    expect(getClimate('30')).toBe('hot');
  });

  it.each([null, undefined, '', 'abc', NaN, Infinity])('valor inválido (%s) → neutral', (input) => {
    expect(getClimate(input)).toBe('neutral');
  });
});

describe('toCelsius', () => {
  it('cf: o valor digitado já está em °C', () => {
    expect(toCelsius({ value: 40, unit: 'cf', result: 104 })).toBe(40);
  });

  it('fc: usa o resultado da conversão', () => {
    expect(toCelsius({ value: 77, unit: 'fc', result: 25 })).toBe(25);
  });

  it('sem conversão → null', () => {
    expect(toCelsius(null)).toBeNull();
  });
});

describe('getIntensity', () => {
  it('calor aumenta com a temperatura e satura em 1', () => {
    expect(getIntensity(39)).toBeCloseTo(0.5);
    expect(getIntensity(80)).toBe(1);
  });

  it('frio aumenta conforme esfria e satura em 1', () => {
    expect(getIntensity(-2)).toBeCloseTo(0.5);
    expect(getIntensity(-100)).toBe(1);
  });

  it('clima agradável ou inválido não tem intensidade', () => {
    expect(getIntensity(22)).toBe(0);
    expect(getIntensity('')).toBe(0);
  });
});

describe('símbolos e formatação', () => {
  it('símbolos de origem e destino por unidade', () => {
    expect(sourceSymbol('cf')).toBe('°C');
    expect(targetSymbol('cf')).toBe('°F');
    expect(sourceSymbol('fc')).toBe('°F');
    expect(targetSymbol('fc')).toBe('°C');
  });

  it('formata com vírgula decimal (pt-BR)', () => {
    expect(formatTemperature(37.78, '°C')).toBe('37,78 °C');
    expect(formatTemperature(212, '°F')).toBe('212 °F');
  });
});
