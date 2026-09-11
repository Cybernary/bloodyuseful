import { ref, computed, watch } from 'vue';
import { getSetting, setSetting } from '../lib/storage.js';

const sizeVariables = {
  small: { '--base-font-size': '14px', '--title-font-size': '1.3rem' },
  medium: { '--base-font-size': '16px', '--title-font-size': '1.5rem' },
  large: { '--base-font-size': '18px', '--title-font-size': '1.7rem' },
  xlarge: { '--base-font-size': '22px', '--title-font-size': '1.9rem' }
};

const fontSizes = [
  { value: 'small', label: 'smallFont' },
  { value: 'medium', label: 'mediumFont' },
  { value: 'large', label: 'largeFont' },
  { value: 'xlarge', label: 'xlargeFont' }
];

const currentFontSize = ref(getSetting('fontSize') || 'medium');

watch(currentFontSize, size => setSetting('fontSize', size));

const fontStyle = computed(() => sizeVariables[currentFontSize.value]);

export function useFontSize() {
  return { currentFontSize, fontSizes, fontStyle };
}
