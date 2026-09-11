<script setup>
import { computed } from 'vue';
import { randomBetween } from '../../utils/random.js';

const props = defineProps({
  intensity: { type: Number, default: 0 },
});

const MIN_FLAKES = 40;
const MAX_FLAKES = 110;
const ICICLE_COUNT = 26;
const SPARKLE_COUNT = 14;

const flakes = Array.from({ length: MAX_FLAKES }, () => ({
  left: randomBetween(0, 100),
  size: randomBetween(4, 12),
  duration: randomBetween(7, 16),
  delay: -randomBetween(0, 16),
  sway: randomBetween(15, 60),
  swayDuration: randomBetween(2.5, 5),
  opacity: randomBetween(0.55, 1),
  crystal: Math.random() < 0.35,
}));

const icicles = Array.from({ length: ICICLE_COUNT }, (_, i) => ({
  width: randomBetween(16, 42),
  height: randomBetween(40, 150),
  drip: i % 4 === 1,
  dripDelay: randomBetween(0, 4),
}));

const sparkles = Array.from({ length: SPARKLE_COUNT }, () => ({
  left: randomBetween(3, 97),
  bottom: randomBetween(2, 14),
  size: randomBetween(8, 16),
  delay: -randomBetween(0, 3),
}));

const visibleFlakes = computed(() =>
  flakes.slice(0, Math.round(MIN_FLAKES + props.intensity * (MAX_FLAKES - MIN_FLAKES))),
);

// U+FE0E força o ❄ a ser desenhado como texto (branco), não como emoji colorido
const CRYSTAL = '❄︎';
</script>

<template>
  <div class="scene cold">
    <svg
      class="mountains"
      viewBox="0 0 1440 400"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient
          id="ice-mountain"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0"
            stop-color="#d7ecfb"
          />
          <stop
            offset="1"
            stop-color="#6fa8d8"
          />
        </linearGradient>
      </defs>
      <path
        d="M0 400 L0 250 L160 120 L300 230 L470 60 L640 240 L800 140 L960 260 L1140 80 L1300 220 L1440 150 L1440 400 Z"
        fill="url(#ice-mountain)"
      />
      <g fill="#fff">
        <polygon points="111 160 160 120 211 160 185 150 160 165 135 152" />
        <polygon points="420 110 470 60 517 110 490 100 465 115 440 102" />
        <polygon points="744 175 800 140 847 175 820 168 800 180 775 168" />
        <polygon points="1090 130 1140 80 1197 130 1165 120 1140 136 1115 122" />
      </g>
    </svg>

    <svg
      class="ground"
      viewBox="0 0 1440 200"
      preserveAspectRatio="none"
    >
      <path
        d="M0 80 C 240 20 480 120 720 70 C 960 20 1200 110 1440 60 L1440 200 L0 200 Z"
        fill="#dcefff"
      />
      <path
        d="M0 130 C 300 80 600 170 900 120 C 1140 80 1300 140 1440 110 L1440 200 L0 200 Z"
        fill="#ffffff"
      />
    </svg>

    <span
      v-for="(sparkle, i) in sparkles"
      :key="`s${i}`"
      class="sparkle"
      :style="{
        left: `${sparkle.left}%`,
        bottom: `${sparkle.bottom}vh`,
        width: `${sparkle.size}px`,
        height: `${sparkle.size}px`,
        animationDelay: `${sparkle.delay}s`,
      }"
    />

    <div class="snow">
      <span
        v-for="(flake, i) in visibleFlakes"
        :key="i"
        class="flake"
        :style="{
          left: `${flake.left}%`,
          opacity: flake.opacity,
          animationDuration: `${flake.duration}s`,
          animationDelay: `${flake.delay}s`,
        }"
      >
        <span
          class="flake-body"
          :class="{ crystal: flake.crystal }"
          :style="{
            '--size': `${flake.size}px`,
            '--sway': `${flake.sway}px`,
            animationDuration: `${flake.swayDuration}s`,
          }"
        >{{ flake.crystal ? CRYSTAL : '' }}</span>
      </span>
    </div>

    <div class="ice-edge">
      <div class="snow-cap" />
      <div class="icicles">
        <div
          v-for="(icicle, i) in icicles"
          :key="i"
          class="icicle"
          :style="{ '--w': `${icicle.width}px`, '--h': `${icicle.height}px` }"
        >
          <span
            v-if="icicle.drip"
            class="drop"
            :style="{ animationDelay: `${icicle.dripDelay}s` }"
          />
        </div>
      </div>
    </div>

    <div class="frost" />
  </div>
</template>

<style scoped>
.scene {
  position: absolute;
  inset: 0;
  overflow: hidden;
  isolation: isolate;
  background: linear-gradient(180deg, #0d3b7a 0%, #2f74c0 35%, #7fbcec 65%, #d9efff 100%);
}

.mountains {
  position: absolute;
  left: 0;
  bottom: 9vh;
  width: 100%;
  height: 38vh;
}

.ground {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 18vh;
}

.sparkle {
  position: absolute;
  background: #fff;
  clip-path: polygon(50% 0, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0 50%, 40% 40%);
  animation: twinkle 2.4s ease-in-out infinite;
}

.snow {
  position: absolute;
  inset: 0;
}

.flake {
  position: absolute;
  top: -6vh;
  animation: fall 10s linear infinite;
  will-change: transform;
}

.flake-body {
  display: block;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
  animation: sway 3s ease-in-out infinite alternate;
}

.flake-body.crystal {
  width: auto;
  height: auto;
  background: none;
  box-shadow: none;
  color: #fff;
  font-size: calc(var(--size) * 1.8);
  line-height: 1;
  text-shadow: 0 0 6px rgba(255, 255, 255, 0.9);
}

.ice-edge {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  filter: drop-shadow(0 6px 8px rgba(10, 40, 90, 0.35));
}

.snow-cap {
  position: relative;
  z-index: 1;
  height: 22px;
  background: linear-gradient(#ffffff, #e8f5ff);
  border-radius: 0 0 40px 40px / 0 0 18px 18px;
}

.icicles {
  display: flex;
  justify-content: space-between;
  margin: -6px -10px 0;
}

.icicle {
  position: relative;
  flex: none;
  width: var(--w);
  height: calc(var(--h) * (0.55 + var(--intensity, 0) * 0.9));
}

.icicle::before {
  content: '';
  position: absolute;
  inset: 0;
  clip-path: polygon(0 0, 100% 0, 62% 70%, 50% 100%, 40% 72%);
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.95) 0%, rgba(214, 238, 255, 0.9) 45%, rgba(150, 200, 240, 0.8) 100%);
}

.drop {
  position: absolute;
  left: 50%;
  top: 100%;
  width: 6px;
  height: 9px;
  margin-left: -3px;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  background: rgba(225, 243, 255, 0.95);
  opacity: 0;
  animation: drip 3.5s ease-in infinite;
}

.frost {
  position: absolute;
  inset: 0;
  pointer-events: none;
  box-shadow:
    inset 0 0 90px 30px rgba(255, 255, 255, 0.55),
    inset 0 0 220px 60px rgba(200, 230, 255, 0.35);
}

@keyframes fall {
  to {
    transform: translateY(112vh);
  }
}

@keyframes sway {
  from {
    transform: translateX(calc(var(--sway) * -1)) rotate(-40deg);
  }
  to {
    transform: translateX(var(--sway)) rotate(40deg);
  }
}

@keyframes twinkle {
  0%,
  100% {
    transform: scale(0.2) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: scale(1) rotate(45deg);
    opacity: 1;
  }
}

@keyframes drip {
  0%,
  60% {
    transform: translateY(-6px) scale(0.3);
    opacity: 0;
  }
  70% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(60vh);
    opacity: 0;
  }
}
</style>
