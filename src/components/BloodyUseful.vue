<template>
  <div class="period-tracker" :class="{ 'dark-mode': isDarkMode }" :lang="currentLanguage" :style="fontStyle">
    <div class="calendar-header">
      <div class="header-top" ref="headerTop">
        <h2 class="month-title">
          {{ formatMonthTitle(currentDate) }}
        </h2>
        <div class="tools">
          <button
            class="nav-button tools-toggle"
            @click="toggleTools"
            :aria-label="t('tools')"
            aria-haspopup="true"
            :aria-expanded="showToolsMenu ? 'true' : 'false'"
          >
            <svg class="icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
            </svg>
          </button>
          <div v-if="showToolsMenu" class="tools-menu" role="menu" :style="{ top: toolsMenuTop + 'px', left: toolsMenuLeft + 'px', width: toolsMenuWidth + 'px' }">
            <div class="tools-selectors">
              <select v-model="currentFontSize" class="nav-button" :aria-label="t('selectFontSize')" @change="showToolsMenu = false">
                <option v-for="size in fontSizes" :key="size.value" :value="size.value">
                  {{ t(size.label) }}
                </option>
              </select>
              <select v-model="currentLanguage" class="nav-button language-selector" :aria-label="t('selectLanguage')" @change="showToolsMenu = false">
                <option v-for="(lang, code) in availableLanguages" :key="code" :value="code">
                  {{ lang.nativeName }}
                </option>
              </select>
            </div>
            <button @click="downloadData(); showToolsMenu = false" class="control-button">
              <svg class="icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
              </svg>
              {{ t('exportData') }}
            </button>
            <button @click="triggerFileUpload(); showToolsMenu = false" class="control-button">
              <svg class="icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              {{ t('importData') }}
            </button>
            <button @click="clearData(); showToolsMenu = false" class="clear-button">
              <svg class="icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
              {{ t('clearData') }}
            </button>
            <button @click="activeInfo = 'instructions'; showToolsMenu = false" class="control-button">
              <svg class="icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M11 7h2v2h-2V7zm0 4h2v6h-2v-6zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
              {{ t('instructions') }}
            </button>
            <button @click="activeInfo = 'legal'; showToolsMenu = false" class="control-button">
              <svg class="icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
              </svg>
              {{ t('legalNotice') }}
            </button>
            <a
              class="control-button"
              :href="`mailto:noemi@sanchezdelrio.dev?subject=${encodeURIComponent(t('suggestionSubject'))}`"
              @click="showToolsMenu = false"
            >
              <svg class="icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              {{ t('sendSuggestion') }}
            </a>
          </div>
        </div>
      </div>

      <input
        id="file-upload"
        type="file"
        accept=".json"
        @change="uploadData"
        class="hidden"
      />
      <div class="navigation-buttons">
        <button @click="handlePrevMonth" class="nav-button" :aria-label="t('previousMonth')">
          <svg class="icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M15.41 16.58L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.42z"/>
          </svg>
        </button>
        <button @click="showMonthYearPicker = true" class="nav-button" :aria-label="t('selectMonthYear')">
          <svg class="icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
          </svg>
        </button>
        <button @click="handleNextMonth" class="nav-button" :aria-label="t('nextMonth')">
          <svg class="icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.42z"/>
          </svg>
        </button>
        <button class="theme-toggle nav-button" @click="toggleTheme" :aria-label="isDarkMode ? t('switchToLightMode') : t('switchToDarkMode')">
          {{ isDarkMode ? '&#9790;' : '&#9728;' }}
        </button>
      </div>
    </div>

    <div v-if="showToolsMenu" class="tools-backdrop" @click="showToolsMenu = false"></div>

    <div v-if="showMonthYearPicker" class="modal-overlay" @click.self="showMonthYearPicker = false">
      <div class="month-year-picker" role="dialog" aria-modal="true" :aria-label="t('monthYearPicker')">
        <div class="picker-header">
          <h3>{{ t('selectMonthYear') }}</h3>
        </div>
        <div class="picker-body">
          <div class="year-selector">
            <button @click="decrementYear" class="year-nav-button" :aria-label="t('previousYear')">
              <svg class="icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path d="M15.41 16.58L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.42z"/>
              </svg>
            </button>
            <span class="year-display">{{ selectedYear }}</span>
            <button @click="incrementYear" class="year-nav-button" :aria-label="t('nextYear')">
              <svg class="icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path d="M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.42z"/>
              </svg>
            </button>
          </div>
          <div class="month-grid">
            <button
              v-for="(month, index) in months"
              :key="index"
              @click="selectMonth(index)"
              :class="{ 'selected-month': index === selectedMonth }"
              class="month-button"
              :aria-label="t('selectMonth', { month: month })"
            >
              {{ month }}
            </button>
          </div>
        </div>
        <div class="picker-footer">
          <button @click="applyMonthYearSelection" class="apply-button">{{ t('apply') }}</button>
          <button @click="showMonthYearPicker = false" class="cancel-button">{{ t('cancel') }}</button>
        </div>
      </div>
    </div>

    <div v-if="exportModal.show" class="modal-overlay" @click.self="exportModal.show = false">
      <div class="month-year-picker" role="dialog" aria-modal="true" :aria-label="t('dataExported')">
        <div class="picker-header">
          <h3>{{ t('dataExported') }}</h3>
        </div>
        <div class="picker-body">
          <p class="save-label">{{ t('savedTo') }}</p>
          <p class="save-path">{{ exportModal.location }}</p>
        </div>
        <div class="picker-footer">
          <button @click="exportModal.show = false" class="apply-button">{{ t('ok') }}</button>
        </div>
      </div>
    </div>

    <div v-if="activeInfo" class="modal-overlay" @click.self="activeInfo = null">
      <div class="month-year-picker info-modal" role="dialog" aria-modal="true" :aria-label="infoTitle">
        <div class="picker-header">
          <h3>{{ infoTitle }}</h3>
        </div>
        <div class="info-body">
          <div v-for="(section, index) in infoBody" :key="index" class="info-section">
            <h4>{{ section.heading }}</h4>
            <p>{{ section.text }}</p>
          </div>
          <div v-if="activeInfo === 'instructions'" class="info-section">
            <h4>{{ t('suggestionsHeading') }}</h4>
            <p>{{ t('suggestionsText') }}</p>
            <a
              class="apply-button suggestion-link"
              :href="`mailto:noemi@sanchezdelrio.dev?subject=${encodeURIComponent(t('suggestionSubject'))}`"
            >{{ t('sendSuggestion') }}</a>
          </div>
        </div>
        <div class="picker-footer">
          <button @click="activeInfo = null" class="apply-button">{{ t('close') }}</button>
        </div>
      </div>
    </div>

    <div class="calendar-grid" ref="calendarGrid" @touchstart="onTouchStart" @touchend="onTouchEnd">
      <div v-for="day in weekdays" :key="day" class="weekday-header">
        {{ day }}
      </div>
      <div
        v-for="(day, index) in calendarDays"
        :key="`day-${index}`"
        :class="getDayClasses(day)"
        @click="handleDayClick(day)"
        :aria-label="day !== null ? getDayAriaLabel(day) : null"
        :aria-hidden="day === null ? 'true' : null"
        :role="day !== null ? 'button' : null"
        :tabindex="day !== null ? 0 : -1"
        @keydown.enter="handleDayClick(day)"
        @keydown.space.prevent="handleDayClick(day)"
      >
        {{ day !== null ? day : '' }}
      </div>
    </div>

    <div class="legend">
      <div class="legend-row">
        <div class="legend-item">
          <div class="legend-color flow-light" />
          <span class="legend-text">{{ t('lightFlow') }}</span>
        </div>
        <div class="legend-item">
          <div class="legend-color flow-medium" />
          <span class="legend-text">{{ t('mediumFlow') }}</span>
        </div>
        <div class="legend-item">
          <div class="legend-color flow-heavy" />
          <span class="legend-text">{{ t('heavyFlow') }}</span>
        </div>
      </div>
      <div class="legend-row">
        <div class="legend-item">
          <div class="legend-color ovulation" />
          <span class="legend-text">{{ t('ovulationWindow') }}</span>
        </div>
        <div class="legend-item">
          <div class="legend-color predicted" />
          <span class="legend-text">{{ t('predictedNextPeriod') }}</span>
        </div>
      </div>
    </div>

    <div class="info-box">
      <h3 class="info-title">{{ t('cycleInformation') }}</h3>
      <div class="info-content">
        <div class="info-item" v-if="predictedPeriod">
          <span class="info-label">{{ t('nextPeriod') }}:</span>
          <span class="info-value">{{ formatDate(predictedPeriod) }}</span>
        </div>
        <div class="info-item" v-else>
          <span class="info-label">{{ t('nextPeriod') }}:</span>
          <span class="info-value">{{ t('notEnoughData') }}</span>
        </div>

        <div class="info-item" v-if="lastPeriodStart">
          <span class="info-label">{{ t('ovulationWindow') }}:</span>
          <span class="info-value">
            {{ formatDate(calculateOvulationStart(lastPeriodStart)) }} -
            {{ formatDate(calculateOvulationEnd(lastPeriodStart)) }}
          </span>
        </div>

        <div class="info-item" v-if="averageCycleLength">
          <span class="info-label">{{ t('cycleLength') }}:</span>
          <span class="info-value">{{ t('daysAverage', { days: averageCycleLength }) }}</span>
        </div>

        <div class="info-item" v-if="averagePeriodLength">
          <span class="info-label">{{ t('periodDuration') }}:</span>
          <span class="info-value">{{ t('daysAverage', { days: averagePeriodLength }) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from '../composables/useI18n.js';
import { useTheme } from '../composables/useTheme.js';
import { useFontSize } from '../composables/useFontSize.js';
import { usePeriodData } from '../composables/usePeriodData.js';
import { useCalendar } from '../composables/useCalendar.js';
import { formatDate, formatMonthTitle as buildMonthTitle } from '../lib/dates.js';
import { ovulationStart, ovulationEnd } from '../lib/cycle.js';
import { exportPeriodData, readPeriodFile } from '../lib/storage.js';

const { currentLanguage, availableLanguages, t, tList } = useI18n();
const { isDarkMode, toggleTheme } = useTheme();
const { currentFontSize, fontSizes, fontStyle } = useFontSize();
const {
  periodData,
  predictedPeriod,
  lastPeriodStart,
  averageCycleLength,
  averagePeriodLength,
  ovulationDates,
  clearData
} = usePeriodData();

const {
  currentDate,
  calendarDays,
  months,
  weekdays,
  selectedYear,
  selectedMonth,
  showMonthYearPicker,
  getDayClasses,
  getDayAriaLabel,
  handleDayClick,
  handlePrevMonth,
  handleNextMonth,
  onTouchStart,
  onTouchEnd,
  selectMonth,
  incrementYear,
  decrementYear,
  applyMonthYearSelection
} = useCalendar({ currentLanguage, periodData, predictedPeriod, ovulationDates, t });

const calculateOvulationStart = ovulationStart;
const calculateOvulationEnd = ovulationEnd;

const headerTop = ref(null);
const calendarGrid = ref(null);
const showToolsMenu = ref(false);
const toolsMenuTop = ref(0);
const toolsMenuLeft = ref(0);
const toolsMenuWidth = ref(0);
const activeInfo = ref(null);
const exportModal = ref({ show: false, location: '' });

function formatMonthTitle(date) {
  return buildMonthTitle(date, currentLanguage.value);
}

const infoTitle = computed(() => {
  if (!activeInfo.value) return '';
  return t(activeInfo.value === 'instructions' ? 'instructionsTitle' : 'legalTitle');
});

const infoBody = computed(() => {
  if (!activeInfo.value) return [];
  return tList(activeInfo.value === 'instructions' ? 'instructionsBody' : 'legalBody');
});

function toggleTools() {
  if (!showToolsMenu.value && headerTop.value) {
    toolsMenuTop.value = Math.round(headerTop.value.getBoundingClientRect().bottom + 6);
    if (calendarGrid.value) {
      const rect = calendarGrid.value.getBoundingClientRect();
      toolsMenuLeft.value = Math.round(rect.left);
      toolsMenuWidth.value = Math.round(rect.width);
    }
  }
  showToolsMenu.value = !showToolsMenu.value;
}

async function downloadData() {
  try {
    const result = await exportPeriodData(periodData.value);
    exportModal.value = { show: true, location: result.native ? result.path : t('downloadsFolder') };
  } catch (e) {
    exportModal.value = { show: true, location: t('exportError') };
  }
}

function triggerFileUpload() {
  document.getElementById('file-upload').click();
}

async function uploadData(event) {
  const file = event.target.files[0];
  if (!file) return;
  try {
    periodData.value = await readPeriodFile(file);
  } catch (e) {
    return;
  }
}

function onKeydown(event) {
  if (event.key !== 'Escape') return;
  if (activeInfo.value) {
    activeInfo.value = null;
  } else if (exportModal.value.show) {
    exportModal.value.show = false;
  } else if (showMonthYearPicker.value) {
    showMonthYearPicker.value = false;
  } else if (showToolsMenu.value) {
    showToolsMenu.value = false;
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown));
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
</script>

<style scoped lang="scss" src="./BloodyUseful.scss"></style>
