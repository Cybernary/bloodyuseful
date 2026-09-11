import { ref, watch } from 'vue';
import { getSetting, setSetting } from '../lib/storage.js';

function initialDarkMode() {
  const preference = getSetting('userThemePreference');
  if (preference) {
    return preference === 'dark';
  }
  return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
}

const isDarkMode = ref(initialDarkMode());

watch(
  isDarkMode,
  val => document.documentElement.classList.toggle('app-dark', val),
  { immediate: true }
);

function toggleTheme() {
  isDarkMode.value = !isDarkMode.value;
  setSetting('userThemePreference', isDarkMode.value ? 'dark' : 'light');
}

export function useTheme() {
  return { isDarkMode, toggleTheme };
}
