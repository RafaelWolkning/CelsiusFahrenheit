<script setup>
import { computed } from 'vue';
import { CLIMATES, formatTemperature, sourceSymbol, targetSymbol } from '../utils/climate.js';

const value = defineModel('value', { type: [String, Number], default: '' });
const unit = defineModel('unit', { type: String, default: 'cf' });

const props = defineProps({
  conversion: { type: Object, default: null },
  error: { type: String, default: '' },
  climate: { type: String, default: 'neutral' },
});

const emit = defineEmits(['submit']);

const resultText = computed(() => {
  if (!props.conversion) return '—';
  return formatTemperature(props.conversion.result, targetSymbol(props.conversion.unit));
});

const mood = computed(() => CLIMATES[props.climate] ?? null);
</script>

<template>
  <form
    class="card"
    novalidate
    @submit.prevent="emit('submit')"
  >
    <h1>🌡️ Conversor de Temperatura</h1>
    <p class="hint">
      Digite uma temperatura e veja o clima mudar
    </p>

    <label for="value">Valor</label>
    <div class="input-wrap">
      <input
        id="value"
        v-model="value"
        type="number"
        step="any"
        inputmode="decimal"
        placeholder="Ex: 100"
        autocomplete="off"
      >
      <span class="suffix">{{ sourceSymbol(unit) }}</span>
    </div>

    <label for="unit">De / Para</label>
    <select
      id="unit"
      v-model="unit"
    >
      <option value="cf">
        Celsius → Fahrenheit
      </option>
      <option value="fc">
        Fahrenheit → Celsius
      </option>
    </select>

    <button type="submit">
      Converter
    </button>

    <div
      class="result"
      :class="{ error }"
      role="status"
      aria-live="polite"
    >
      <span
        v-if="error"
        class="result-error"
      >⚠️ {{ error }}</span>
      <template v-else>
        <span class="result-value">{{ resultText }}</span>
        <span
          v-if="mood"
          class="mood"
        >{{ mood.emoji }} {{ mood.label }}</span>
      </template>
    </div>
  </form>
</template>

<style scoped>
.card {
  width: min(420px, 100%);
  padding: 40px;
  border-radius: 24px;
  background-color: var(--card-bg);
  color: var(--text);
  border: 1px solid var(--card-border);
  box-shadow: 0 24px 60px var(--card-shadow);
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  transition: background-color 0.8s, color 0.8s, border-color 0.8s, box-shadow 0.8s;
}

h1 {
  text-align: center;
  font-size: 1.5rem;
  line-height: 1.25;
}

.hint {
  text-align: center;
  font-size: 0.85rem;
  color: var(--muted);
  margin: 6px 0 28px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--muted);
}

.input-wrap {
  position: relative;
}

input,
select {
  width: 100%;
  padding: 12px 14px;
  margin-bottom: 20px;
  border-radius: 12px;
  border: 1px solid transparent;
  background-color: var(--field-bg);
  color: var(--text);
  font: inherit;
  font-size: 1rem;
  transition: background-color 0.8s, color 0.8s, border-color 0.2s;
}

input {
  padding-right: 48px;
  appearance: textfield;
  -moz-appearance: textfield;
}

/* Esconde as setinhas do input number, que ficariam sobre o símbolo °C/°F */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input:focus,
select:focus {
  outline: none;
  border-color: var(--accent);
}

input::placeholder {
  color: var(--muted);
}

select option {
  color: #000;
}

.suffix {
  position: absolute;
  right: 14px;
  top: 12px;
  font-weight: 600;
  color: var(--muted);
  pointer-events: none;
}

button {
  width: 100%;
  padding: 14px;
  margin-bottom: 20px;
  border: none;
  border-radius: 12px;
  background-color: var(--accent);
  color: var(--accent-text);
  font: inherit;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
}

button:hover {
  background-color: var(--accent-hover);
}

button:active {
  transform: scale(0.98);
}

.result {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 84px;
  padding: 16px;
  border-radius: 14px;
  background-color: var(--field-bg);
  text-align: center;
  transition: background-color 0.8s;
}

.result-value {
  font-size: 1.9rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.result-error {
  color: var(--error);
  font-weight: 600;
}

.mood {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--muted);
}

@media (max-width: 480px) {
  .card {
    padding: 28px 22px;
  }
}
</style>
