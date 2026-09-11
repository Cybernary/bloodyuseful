import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

const PERIOD_FILE = 'bloody-useful.json';

export function loadPeriodData() {
  const saved = localStorage.getItem('periodData');
  return saved ? JSON.parse(saved) : {};
}

export function savePeriodData(data) {
  localStorage.setItem('periodData', JSON.stringify(data));
}

export function getSetting(key) {
  return localStorage.getItem(key);
}

export function setSetting(key, value) {
  localStorage.setItem(key, value);
}

export async function exportPeriodData(periodData) {
  const dataStr = JSON.stringify(periodData, null, 2);

  if (Capacitor.isNativePlatform()) {
    await Filesystem.writeFile({
      path: PERIOD_FILE,
      data: dataStr,
      directory: Directory.Documents,
      encoding: Encoding.UTF8
    });
    const uri = await Filesystem.getUri({ directory: Directory.Documents, path: PERIOD_FILE });
    return { native: true, path: decodeURIComponent(uri.uri.replace('file://', '')) };
  }

  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = PERIOD_FILE;
  a.click();
  URL.revokeObjectURL(url);
  return { native: false };
}

export function readPeriodFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = event => {
      try {
        resolve(JSON.parse(event.target.result));
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
