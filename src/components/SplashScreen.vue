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

<script setup>
import { computed } from 'vue';
import { useTheme } from '../composables/useTheme.js';
import { useI18n } from '../composables/useI18n.js';

const emit = defineEmits(['start']);

const { isDarkMode } = useTheme();
const { currentLanguage } = useI18n();

const isDark = isDarkMode;
const startLabel = computed(() => (currentLanguage.value === 'es' ? 'Empezar' : 'Start'));

function start() {
  emit('start');
}
</script>

<style scoped src="./SplashScreen.scss"></style>
