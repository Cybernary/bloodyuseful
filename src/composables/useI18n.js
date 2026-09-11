import { ref, watch } from 'vue';
import { messages, detectLanguage } from '../i18n/index.js';
import { setSetting } from '../lib/storage.js';

const currentLanguage = ref(detectLanguage());

const availableLanguages = {
  en: { nativeName: 'English' },
  es: { nativeName: 'Español' }
};

document.documentElement.lang = currentLanguage.value;

watch(currentLanguage, lang => {
  setSetting('userLanguage', lang);
  document.documentElement.lang = lang;
});

function t(key, params = {}) {
  const value = messages[currentLanguage.value][key] || messages.en[key] || key;
  return value.replace(/\{(\w+)\}/g, (_, param) => params[param] || '');
}

function tList(key) {
  return messages[currentLanguage.value][key] || messages.en[key] || [];
}

export function useI18n() {
  return { currentLanguage, availableLanguages, t, tList };
}
