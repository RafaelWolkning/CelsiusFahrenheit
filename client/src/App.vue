<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import ConverterCard from './components/ConverterCard.vue';
import ColdScene from './components/scenes/ColdScene.vue';
import HotScene from './components/scenes/HotScene.vue';
import MildScene from './components/scenes/MildScene.vue';
import { convertTemperature } from './services/api.js';
import { getClimate, getIntensity, toCelsius } from './utils/climate.js';

const DEBOUNCE_MS = 400;
const SCENES = { hot: HotScene, cold: ColdScene, mild: MildScene };

const value = ref('');
const unit = ref('cf');
const conversion = ref(null);
const error = ref('');

const celsius = computed(() => toCelsius(conversion.value));
const climate = computed(() => getClimate(celsius.value));
const intensity = computed(() => getIntensity(celsius.value));
const scene = computed(() => SCENES[climate.value] ?? null);

let debounceTimer = null;
let lastRequestId = 0;

async function convert() {
  clearTimeout(debounceTimer);
  const requestId = ++lastRequestId;

  if (value.value === '') {
    conversion.value = null;
    error.value = '';
    return;
  }

  try {
    const data = await convertTemperature(value.value, unit.value);
    if (requestId !== lastRequestId) return; // resposta antiga, ignora
    conversion.value = data;
    error.value = '';
  } catch (err) {
    if (requestId !== lastRequestId) return;
    conversion.value = null;
    error.value = err.message;
  }
}

function onSubmit() {
  if (value.value === '') {
    clearTimeout(debounceTimer);
    lastRequestId++;
    conversion.value = null;
    error.value = 'Insira um valor';
    return;
  }
  convert();
}

// Converte automaticamente enquanto o usuário digita
watch([value, unit], () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(convert, DEBOUNCE_MS);
});

onBeforeUnmount(() => clearTimeout(debounceTimer));
</script>

<template>
  <div
    class="app"
    :class="`climate-${climate}`"
    :style="{ '--intensity': intensity }"
  >
    <div
      class="backdrop"
      aria-hidden="true"
    >
      <Transition name="scene">
        <component
          :is="scene"
          v-if="scene"
          :key="climate"
          :intensity="intensity"
        />
      </Transition>
    </div>

    <main class="stage">
      <ConverterCard
        v-model:value="value"
        v-model:unit="unit"
        :conversion="conversion"
        :error="error"
        :climate="climate"
        @submit="onSubmit"
      />
    </main>
  </div>
</template>
