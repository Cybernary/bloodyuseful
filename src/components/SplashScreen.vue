<template>
  <div class="splash" :class="{ dark: isDark }" role="dialog" aria-modal="true" aria-label="Bloody Useful">
    <div class="splash-stage">
    <svg class="band" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
      <path fill="#ff4785" d="M0,6.5 C16,6.5 34,6.5 50,6.5 C66,6.5 84,6.5 100,6.5 L100,40 L0,40 Z">
        <animate
          attributeName="d"
          begin="1s"
          dur="1.3s"
          fill="freeze"
          calcMode="spline"
          keyTimes="0; 0.22; 0.5; 0.75; 1"
          keySplines="0.34 0 0.25 1; 0.34 0 0.25 1; 0.34 0 0.25 1; 0.34 0 0.25 1"
          values="M0,6.5 C16,6.5 34,6.5 50,6.5 C66,6.5 84,6.5 100,6.5 L100,40 L0,40 Z;
                  M0,6.5 C16,3.5 34,0.5 50,0.5 C66,0.5 84,3.5 100,6.5 L100,40 L0,40 Z;
                  M0,6.5 C16,8.75 34,11 50,11 C66,11 84,8.75 100,6.5 L100,40 L0,40 Z;
                  M0,6.5 C16,5.25 34,4 50,4 C66,4 84,5.25 100,6.5 L100,40 L0,40 Z;
                  M0,6.5 C16,6.5 34,6.5 50,6.5 C66,6.5 84,6.5 100,6.5 L100,40 L0,40 Z"
        />
      </path>
    </svg>
    <div class="drop-wrap" aria-hidden="true">
      <svg class="drop" viewBox="0 0 100 100" width="240" height="240">
        <path
          d="M50 12 C 70 42, 82 56, 82 69 A 32 32 0 1 1 18 69 C 18 56 30 42 50 12 Z"
          fill="#ff4785"
        />
      </svg>
    </div>
    <div class="content">
      <h1 class="title">Bloody<span class="useful">Useful</span></h1>
      <button class="start-button" @click="start">{{ startLabel }}</button>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SplashScreen',
  data() {
    const pref = localStorage.getItem('userThemePreference');
    const dark = pref
      ? pref === 'dark'
      : !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    return {
      isDark: dark
    };
  },
  computed: {
    startLabel() {
      const lang = (localStorage.getItem('userLanguage') || navigator.language || 'en').toLowerCase();
      return lang.startsWith('es') ? 'Empezar' : 'Start';
    }
  },
  mounted() {
    document.documentElement.classList.toggle('app-dark', this.isDark);
  },
  methods: {
    start() {
      this.$emit('start');
    }
  }
};
</script>

<style scoped>
.splash {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #ffffff;
  font-family: var(--app-font);
}

.splash.dark {
  background: #1a1a1a;
}

.splash-stage {
  position: relative;
  width: 100%;
  max-width: 600px;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.band {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 15vh;
  z-index: 1;
  animation: grow 1.3s cubic-bezier(0.22, 1, 0.36, 1) 1s both;
}

.drop-wrap {
  position: absolute;
  top: 0;
  left: calc(50% - 120px);
  z-index: 2;
  animation: fall 1s cubic-bezier(0.5, 0, 0.75, 0.35) forwards;
}

.drop {
  display: block;
  transform-origin: 50% 100%;
  animation: merge 0.55s cubic-bezier(0.25, 0.6, 0.25, 1) 1s both;
}

.content {
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.75rem;
  opacity: 0;
  animation: rise 1.3s ease-out 1s both;
}

.title {
  margin: 0;
  font-size: 2.6rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: #2c3e50;
  text-align: center;
}

.splash.dark .title {
  color: #f0f0f0;
}

.useful {
  color: #ff85b8;
}

.start-button {
  font-family: var(--app-font);
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  background: #ff4785;
  border: none;
  border-radius: 6px;
  padding: 1rem 3.5rem;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease;
}

.start-button:hover {
  background: #ff2d70;
}

.start-button:active {
  transform: scale(0.97);
}

@keyframes fall {
  0% {
    transform: translateY(-35vh);
    opacity: 0;
  }
  12% {
    opacity: 1;
  }
  100% {
    transform: translateY(60vh);
    opacity: 1;
  }
}

@keyframes merge {
  0% {
    transform: translateY(0) scaleX(1) scaleY(1);
    opacity: 1;
  }
  60% {
    opacity: 0.85;
  }
  100% {
    transform: translateY(8%) scaleX(1.5) scaleY(0.08);
    opacity: 0;
  }
}

@keyframes grow {
  from {
    height: 15vh;
  }
  to {
    height: 30vh;
  }
}

@keyframes rise {
  0% {
    opacity: 0;
    transform: translateY(18px);
  }
  25% {
    opacity: 0;
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .drop-wrap {
    display: none;
  }

  .band {
    animation: none;
    height: 30vh;
  }

  .content {
    animation: none;
    opacity: 1;
  }
}
</style>
