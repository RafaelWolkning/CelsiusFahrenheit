// Faixas de clima em graus Celsius
export const COLD_MAX = 16; // abaixo disso é frio
export const HOT_MIN = 28; // acima disso é quente

// Temperaturas usadas como "extremo" para calcular a intensidade dos efeitos
const HOT_EXTREME = 50;
const COLD_EXTREME = -20;

export const CLIMATES = {
  hot: { emoji: '🔥', label: 'Que calor! Cuidado com o fogo' },
  cold: { emoji: '❄️', label: 'Que frio! Hora do casaco' },
  mild: { emoji: '🌊', label: 'Dia lindo, clima tranquilo' },
};

/** Retorna a temperatura em °C de uma resposta da API ({ value, unit, result }). */
export function toCelsius(conversion) {
  if (!conversion) return null;
  return conversion.unit === 'cf' ? conversion.value : conversion.result;
}

/** Classifica uma temperatura em °C: 'cold' | 'mild' | 'hot' | 'neutral'. */
export function getClimate(celsius) {
  if (celsius === null || celsius === undefined || celsius === '') return 'neutral';
  const c = Number(celsius);
  if (!Number.isFinite(c)) return 'neutral';
  if (c < COLD_MAX) return 'cold';
  if (c > HOT_MIN) return 'hot';
  return 'mild';
}

const clamp = (n) => Math.min(1, Math.max(0, n));

/** Intensidade de 0 a 1 dos efeitos (mais fogo / mais neve em temperaturas extremas). */
export function getIntensity(celsius) {
  const climate = getClimate(celsius);
  const c = Number(celsius);
  if (climate === 'hot') return clamp((c - HOT_MIN) / (HOT_EXTREME - HOT_MIN));
  if (climate === 'cold') return clamp((COLD_MAX - c) / (COLD_MAX - COLD_EXTREME));
  return 0;
}

export function sourceSymbol(unit) {
  return unit === 'fc' ? '°F' : '°C';
}

export function targetSymbol(unit) {
  return unit === 'fc' ? '°C' : '°F';
}

const numberFormat = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });

export function formatTemperature(value, symbol) {
  return `${numberFormat.format(value)} ${symbol}`;
}
