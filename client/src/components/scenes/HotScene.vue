<script setup>
import { computed } from 'vue';
import { randomBetween } from '../../utils/random.js';

const props = defineProps({
  intensity: { type: Number, default: 0 },
});

const MIN_EMBERS = 25;
const MAX_EMBERS = 70;
const FLAME_COUNT = 16;

// Gerados uma vez; a intensidade só decide quantas brasas aparecem
const embers = Array.from({ length: MAX_EMBERS }, () => ({
  left: randomBetween(0, 100),
  size: randomBetween(3, 9),
  duration: randomBetween(4, 9),
  delay: -randomBetween(0, 9),
  drift: randomBetween(-80, 80),
}));

const flames = Array.from({ length: FLAME_COUNT }, (_, i) => ({
  left: (i / (FLAME_COUNT - 1)) * 100,
  scale: randomBetween(0.75, 1.25),
  duration: randomBetween(0.9, 1.7),
  delay: -randomBetween(0, 1.7),
}));

const visibleEmbers = computed(() =>
  embers.slice(0, Math.round(MIN_EMBERS + props.intensity * (MAX_EMBERS - MIN_EMBERS))),
);
</script>

<template>
  <div class="scene hot">
    <div class="sun" />
    <div class="heat-glow" />

    <div class="embers">
      <span
        v-for="(ember, i) in visibleEmbers"
        :key="i"
        class="ember"
        :style="{
          left: `${ember.left}%`,
          width: `${ember.size}px`,
          height: `${ember.size}px`,
          animationDuration: `${ember.duration}s`,
          animationDelay: `${ember.delay}s`,
          '--drift': `${ember.drift}px`,
        }"
      />
    </div>

    <div class="fire">
      <div
        v-for="(flame, i) in flames"
        :key="i"
        class="flame"
        :style="{
          left: `${flame.left}%`,
          '--scale': flame.scale,
          animationDuration: `${flame.duration}s`,
          animationDelay: `${flame.delay}s`,
        }"
      >
        <span class="layer outer" />
        <span class="layer middle" />
        <span class="layer inner" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.scene {
  position: absolute;
  inset: 0;
  overflow: hidden;
  isolation: isolate;
  background: linear-gradient(180deg, #ffe680 0%, #ffb347 32%, #ff7b1c 62%, #d9380b 88%, #8f1d05 100%);
}

.sun {
  position: absolute;
  top: -18vmin;
  right: -12vmin;
  width: 70vmin;
  height: 70vmin;
  border-radius: 50%;
  background: radial-gradient(circle, #fffef0 0%, #fff59d 22%, rgba(255, 214, 79, 0.6) 42%, rgba(255, 160, 0, 0) 70%);
  animation: pulse 5s ease-in-out infinite;
}

.heat-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 90% 55% at 50% 100%, rgba(255, 70, 0, 0.7), rgba(255, 70, 0, 0) 70%);
  animation: glow 2.5s ease-in-out infinite alternate;
}

.embers {
  position: absolute;
  inset: 0;
  z-index: 2;
}

.ember {
  position: absolute;
  bottom: 8vh;
  border-radius: 50%;
  opacity: 0;
  background: radial-gradient(circle, #fffbd1 0%, #ffc233 45%, #ff5a00 75%, rgba(255, 90, 0, 0) 100%);
  box-shadow: 0 0 8px 2px rgba(255, 150, 0, 0.7);
  animation: rise 6s ease-out infinite;
  will-change: transform, opacity;
}

.fire {
  position: absolute;
  left: -6%;
  right: -6%;
  bottom: 0;
  height: 30vh;
  z-index: 1;
}

/* Base de brasas escuras para "assentar" as chamas */
.fire::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 22%;
  background: linear-gradient(to top, #5c0f00 0%, rgba(140, 25, 0, 0.75) 45%, rgba(140, 25, 0, 0) 100%);
}

.flame {
  --size: calc(11vh + var(--intensity, 0) * 9vh);

  position: absolute;
  bottom: -4vh;
  width: var(--size);
  height: var(--size);
  margin-left: calc(var(--size) / -2);
  transform-origin: 50% 100%;
  animation: flicker 1.2s ease-in-out infinite alternate;
}

/* Gota com a ponta para cima: quadrado com um canto reto girado 45° */
.layer {
  position: absolute;
  left: 50%;
  bottom: 0;
  border-radius: 0 50% 50% 50%;
  transform: translateX(-50%) rotate(45deg);
}

.layer.outer {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(230, 40, 0, 0.15) 0%, #ff4d00 45%, #ff8f00 100%);
  filter: blur(6px);
  opacity: 0.9;
}

.layer.middle {
  width: 66%;
  height: 66%;
  background: linear-gradient(135deg, rgba(255, 120, 0, 0.2) 0%, #ff9800 45%, #ffd54f 100%);
  filter: blur(3px);
}

.layer.inner {
  width: 36%;
  height: 36%;
  background: linear-gradient(135deg, rgba(255, 240, 150, 0.3) 0%, #ffe082 40%, #fffde7 100%);
  filter: blur(2px);
}

@keyframes flicker {
  0% {
    transform: scale(calc(var(--scale) * 0.95), calc(var(--scale) * 1.45)) skewX(2deg);
  }
  50% {
    transform: scale(calc(var(--scale) * 1.05), calc(var(--scale) * 1.8)) skewX(-3deg);
  }
  100% {
    transform: scale(calc(var(--scale) * 0.9), calc(var(--scale) * 1.55)) skewX(3deg);
  }
}

@keyframes rise {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  70% {
    opacity: 0.9;
  }
  100% {
    transform: translate3d(var(--drift), -95vh, 0) scale(0.2);
    opacity: 0;
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.08);
    opacity: 1;
  }
}

@keyframes glow {
  from {
    opacity: 0.7;
  }
  to {
    opacity: 1;
  }
}
</style>
