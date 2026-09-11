import en from './en.js';
import es from './es.js';

export const messages = { en, es };

export const languages = [
  { code: 'en', nativeName: 'English' },
  { code: 'es', nativeName: 'Español' }
];

export function detectLanguage() {
  const stored = localStorage.getItem('userLanguage');
  if (stored && messages[stored]) {
    return stored;
  }
  return (navigator.language || '').toLowerCase().startsWith('es') ? 'es' : 'en';
}
