<script setup>
import { randomBetween } from '../../utils/random.js';

defineProps({
  intensity: { type: Number, default: 0 },
});

// Onda com período de 720px repetida 4x em 2880px: deslocar -50% (2 períodos) fica contínuo
function wavePath(amplitude, closed) {
  let d = `M0 50 Q 180 ${50 - amplitude} 360 50`;
  for (let x = 720; x <= 2880; x += 360) d += ` T ${x} 50`;
  return closed ? `${d} V100 H0 Z` : d;
}

const WAVE_BACK = wavePath(18, true);
const WAVE_MID = wavePath(26, true);
const WAVE_FRONT = wavePath(34, true);
const FOAM = wavePath(34, false);

const clouds = [
  { top: 8, scale: 1.1, duration: 90, delay: -20, opacity: 0.95 },
  { top: 22, scale: 0.7, duration: 120, delay: -75, opacity: 0.85 },
  { top: 4, scale: 0.8, duration: 105, delay: -50, opacity: 0.9 },
  { top: 30, scale: 0.55, duration: 140, delay: -110, opacity: 0.8 },
  { top: 15, scale: 0.95, duration: 100, delay: -5, opacity: 0.9 },
];

const birds = [
  { top: 18, scale: 1, duration: 28, delay: -6 },
  { top: 21, scale: 0.75, duration: 32, delay: -9 },
  { top: 14, scale: 0.6, duration: 36, delay: -22 },
];

const glints = Array.from({ length: 16 }, () => ({
  left: randomBetween(0, 80),
  top: randomBetween(4, 90),
  width: randomBetween(10, 40),
  delay: -randomBetween(0, 2.5),
}));
</script>

<template>
  <div class="scene mild">
    <div class="sun">
      <div class="rays" />
    </div>

    <div
      v-for="(cloud, i) in clouds"
      :key="`c${i}`"
      class="cloud-track"
      :style="{
        top: `${cloud.top}%`,
        animationDuration: `${cloud.duration}s`,
        animationDelay: `${cloud.delay}s`,
      }"
    >
      <div
        class="cloud"
        :style="{ '--s': cloud.scale, opacity: cloud.opacity }"
      />
    </div>

    <div
      v-for="(bird, i) in birds"
      :key="`b${i}`"
      class="bird-track"
      :style="{
        top: `${bird.top}%`,
        animationDuration: `${bird.duration}s`,
        animationDelay: `${bird.delay}s`,
      }"
    >
      <svg
        class="bird"
        viewBox="0 0 40 16"
        :style="{ '--s': bird.scale }"
      >
        <path
          d="M2 12 Q 11 2 20 12 Q 29 2 38 12"
          fill="none"
          stroke="#1f3b4d"
          stroke-width="2.5"
          stroke-linecap="round"
        />
      </svg>
    </div>

    <div class="sea">
      <div class="reflection">
        <span
          v-for="(glint, i) in glints"
          :key="`g${i}`"
          class="glint"
          :style="{
            left: `${glint.left}%`,
            top: `${glint.top}%`,
            width: `${glint.width}px`,
            animationDelay: `${glint.delay}s`,
          }"
        />
      </div>

      <div class="wave wave-back">
        <svg
          viewBox="0 0 2880 100"
          preserveAspectRatio="none"
        >
          <path
            :d="WAVE_BACK"
            fill="currentColor"
          />
        </svg>
      </div>

      <svg
        class="boat"
        viewBox="0 0 100 100"
      >
        <path
          d="M50 8 L50 72"
          stroke="#5d4037"
          stroke-width="3"
        />
        <path
          d="M53 12 L84 66 L53 66 Z"
          fill="#fff"
        />
        <path
          d="M47 22 L22 66 L47 66 Z"
          fill="#ff7043"
        />
        <path
          d="M12 72 L88 72 L75 88 L25 88 Z"
          fill="#6d4c41"
        />
      </svg>

      <div class="wave wave-mid">
        <svg
          viewBox="0 0 2880 100"
          preserveAspectRatio="none"
        >
          <path
            :d="WAVE_MID"
            fill="currentColor"
          />
        </svg>
      </div>

      <div class="wave wave-front">
        <svg
          viewBox="0 0 2880 100"
          preserveAspectRatio="none"
        >
          <path
            :d="WAVE_FRONT"
            fill="currentColor"
          />
          <path
            :d="FOAM"
            fill="none"
            stroke="rgba(255, 255, 255, 0.7)"
            stroke-width="4"
            vector-effect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>

    <svg
      class="beach"
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
    >
      <path
        d="M0 60 C 360 10 720 90 1080 40 C 1260 15 1380 30 1440 40 L1440 120 L0 120 Z"
        fill="#f4d19b"
      />
      <path
        class="foam-line"
        d="M0 60 C 360 10 720 90 1080 40 C 1260 15 1380 30 1440 40"
        fill="none"
        stroke="rgba(255, 255, 255, 0.85)"
        stroke-width="6"
      />
    </svg>
  </div>
</template>

<style scoped>
.scene {
  position: absolute;
  inset: 0;
  overflow: hidden;
  isolation: isolate;
  background: linear-gradient(180deg, #2f9ff0 0%, #6cc2f7 40%, #bfe7fb 62%, #ffe9c7 66%);
}

.sun {
  position: absolute;
  top: 9%;
  right: 18%;
  width: 15vmin;
  height: 15vmin;
  margin-right: -7.5vmin;
  border-radius: 50%;
  background: radial-gradient(circle, #fffde7 0%, #fff59d 55%, #ffe082 100%);
  box-shadow:
    0 0 60px 20px rgba(255, 241, 118, 0.6),
    0 0 160px 60px rgba(255, 255, 255, 0.35);
}

.rays {
  position: absolute;
  inset: -140%;
  z-index: -1;
  border-radius: 50%;
  background: repeating-conic-gradient(rgba(255, 255, 255, 0.22) 0deg 6deg, rgba(255, 255, 255, 0) 6deg 18deg);
  -webkit-mask-image: radial-gradient(circle, #000 15%, transparent 70%);
  mask-image: radial-gradient(circle, #000 15%, transparent 70%);
  animation: spin 80s linear infinite;
}

.cloud-track {
  position: absolute;
  left: 0;
  animation: drift 100s linear infinite;
}

.cloud {
  position: relative;
  width: 180px;
  height: 60px;
  border-radius: 60px;
  background: #fff;
  transform: scale(var(--s));
  transform-origin: left center;
  filter: drop-shadow(0 10px 12px rgba(30, 90, 140, 0.15));
}

.cloud::before,
.cloud::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  background: #fff;
}

.cloud::before {
  width: 80px;
  height: 80px;
  top: -40px;
  left: 30px;
}

.cloud::after {
  width: 100px;
  height: 100px;
  top: -55px;
  right: 25px;
}

.bird-track {
  position: absolute;
  left: 0;
  animation: fly 30s linear infinite;
}

.bird {
  display: block;
  width: 34px;
  height: 14px;
  transform: scale(var(--s));
  animation: flap 0.6s ease-in-out infinite alternate;
}

.sea {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 36vh;
  overflow: hidden;
  background: linear-gradient(180deg, #5cc6f2 0%, #1e9bd7 35%, #0a6fb0 75%, #07558c 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.reflection {
  position: absolute;
  top: 0;
  bottom: 40%;
  right: calc(18% - 70px);
  width: 140px;
}

.glint {
  position: absolute;
  height: 3px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.95);
  opacity: 0;
  animation: shimmer 2.5s ease-in-out infinite;
}

.wave {
  position: absolute;
  left: 0;
  width: 200%;
  animation: wave 12s linear infinite;
}

.wave svg {
  display: block;
  width: 100%;
  height: 100%;
}

/* Bloco sólido abaixo da crista para preencher o mar até o fundo */
.wave::after {
  content: '';
  position: absolute;
  top: 99%;
  left: 0;
  right: 0;
  height: 100vh;
  background: currentColor;
}

.wave-back {
  top: 18%;
  height: 22px;
  color: #3db1e6;
  animation-duration: 20s;
}

.wave-mid {
  top: 44%;
  height: 32px;
  color: #1690d0;
  animation-duration: 13s;
}

.wave-front {
  top: 68%;
  height: 44px;
  color: #26b5d6;
  animation-duration: 8s;
}

.boat {
  position: absolute;
  left: 20%;
  top: calc(47% - 72px);
  width: 80px;
  height: 80px;
  transform-origin: 50% 90%;
  animation: bob 4s ease-in-out infinite;
}

.beach {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 12vh;
}

.foam-line {
  animation: foam 5s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes drift {
  from {
    transform: translateX(-30vw);
  }
  to {
    transform: translateX(120vw);
  }
}

@keyframes fly {
  from {
    transform: translate(-10vw, 0);
  }
  to {
    transform: translate(110vw, -5vh);
  }
}

@keyframes flap {
  from {
    transform: scale(var(--s)) scaleY(1);
  }
  to {
    transform: scale(var(--s)) scaleY(0.35);
  }
}

@keyframes wave {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@keyframes bob {
  0%,
  100% {
    transform: translateY(0) rotate(-3deg);
  }
  50% {
    transform: translateY(6px) rotate(3deg);
  }
}

@keyframes shimmer {
  0%,
  100% {
    opacity: 0;
    transform: scaleX(0.4);
  }
  50% {
    opacity: 1;
    transform: scaleX(1);
  }
}

@keyframes foam {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.85;
  }
  50% {
    transform: translateY(6px);
    opacity: 0.5;
  }
}
</style>
