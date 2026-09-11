<template>
  <SplashScreen v-if="showSplash" @start="dismissSplash" />
  <BloodyUseful v-else />
</template>

<script setup>
import { ref } from 'vue';
import { Capacitor } from '@capacitor/core';
import BloodyUseful from './components/BloodyUseful.vue';
import SplashScreen from './components/SplashScreen.vue';

function initialSplash() {
  if (Capacitor.isNativePlatform()) return true;
  try {
    return localStorage.getItem('splashSeen') !== '1';
  } catch (e) {
    return true;
  }
}

const showSplash = ref(initialSplash());

function dismissSplash() {
  showSplash.value = false;
  try {
    localStorage.setItem('splashSeen', '1');
  } catch (e) {
    return;
  }
}
</script>
