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

<script>
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

export default {
  name: 'BloodyUseful',
  data() {
    const now = new Date();
    return {
      currentDate: new Date(now.getFullYear(), now.getMonth(), 1),
      periodData: {},
      predictedPeriod: null,
      flowLevels: {
        0: 'bg-white',
        1: 'flow-light',
        2: 'flow-medium',
        3: 'flow-heavy'
      },
      showMonthYearPicker: false,
      exportModal: { show: false, location: '' },
      activeInfo: null,
      showToolsMenu: false,
      toolsMenuTop: 0,
      toolsMenuLeft: 0,
      toolsMenuWidth: 0,
      swiped: false,
      selectedYear: now.getFullYear(),
      selectedMonth: now.getMonth(),
      darkMode: null,
      userThemePreference: localStorage.getItem('userThemePreference'),
      currentLanguage: localStorage.getItem('userLanguage') || ((navigator.language || '').toLowerCase().startsWith('es') ? 'es' : 'en'),
      currentFontSize: localStorage.getItem('fontSize') || 'medium',
      fontSizes: [
        { value: 'small', label: 'smallFont' },
        { value: 'medium', label: 'mediumFont' },
        { value: 'large', label: 'largeFont' },
        { value: 'xlarge', label: 'xlargeFont' }
      ],
      availableLanguages: {
        en: { nativeName: 'English', translations: this.getEnglishTranslations() },
        es: { nativeName: 'Español', translations: this.getSpanishTranslations() }
      }
    };
  },
  computed: {
    infoTitle() {
      if (!this.activeInfo) return '';
      return this.t(this.activeInfo === 'instructions' ? 'instructionsTitle' : 'legalTitle');
    },
    infoBody() {
      if (!this.activeInfo) return [];
      return this.tList(this.activeInfo === 'instructions' ? 'instructionsBody' : 'legalBody');
    },
    fontStyle() {
      const sizes = {
        small: { '--base-font-size': '14px', '--title-font-size': '1.3rem' },
        medium: { '--base-font-size': '16px', '--title-font-size': '1.5rem' },
        large: { '--base-font-size': '18px', '--title-font-size': '1.7rem' },
        xlarge: { '--base-font-size': '22px', '--title-font-size': '1.9rem' }
      };
      return sizes[this.currentFontSize];
    },
    firstDayOfWeek() {
      try {
        const locale = new Intl.Locale(this.currentLanguage);
        const info = typeof locale.getWeekInfo === 'function' ? locale.getWeekInfo() : locale.weekInfo;
        if (info && info.firstDay) {
          return info.firstDay % 7;
        }
      } catch (e) {
        return 0;
      }
      return 0;
    },
    calendarDays() {
      const daysInMonth = this.getDaysInMonth(this.currentDate);
      const firstDay = this.getFirstDayOfMonth(this.currentDate);
      const offset = (firstDay - this.firstDayOfWeek + 7) % 7;
      const days = [];

      for (let i = 0; i < offset; i++) {
        days.push(null);
      }

      for (let day = 1; day <= daysInMonth; day++) {
        days.push(day);
      }

      return days;
    },
    isDarkMode() {
      if (this.darkMode === null) return false;
      return this.darkMode;
    },
    periodGroups() {
      const dates = Object.keys(this.periodData)
        .filter(date => this.periodData[date].flow > 0)
        .sort();

      const groups = [];
      let current = [];

      for (let i = 0; i < dates.length; i++) {
        const currentDate = new Date(dates[i]);
        const prevDate = i > 0 ? new Date(dates[i - 1]) : null;
        const gap = prevDate ? Math.round((currentDate - prevDate) / (1000 * 60 * 60 * 24)) : null;

        if (gap === 1) {
          current.push(currentDate);
        } else {
          if (current.length > 0) groups.push(current);
          current = [currentDate];
        }
      }

      if (current.length > 0) groups.push(current);

      return groups;
    },
    periodStartDates() {
      return this.periodGroups.map(group => group[0]);
    },
    lastPeriodStart() {
      const starts = this.periodStartDates;
      return starts.length > 0 ? starts[starts.length - 1] : null;
    },
    averageCycleLength() {
      const starts = this.periodStartDates;

      if (starts.length < 2) return null;

      let totalDays = 0;
      for (let i = 1; i < starts.length; i++) {
        totalDays += Math.round((starts[i] - starts[i - 1]) / (1000 * 60 * 60 * 24));
      }

      return Math.round(totalDays / (starts.length - 1));
    },
    averagePeriodLength() {
      const groups = this.periodGroups;

      if (groups.length === 0) return null;

      const totalDays = groups.reduce((sum, group) => sum + group.length, 0);
      return Math.round(totalDays / groups.length);
    },
    ovulationDates() {
      const set = new Set();
      this.periodStartDates.forEach(start => {
        const from = this.calculateOvulationStart(start);
        const to = this.calculateOvulationEnd(start);
        const day = new Date(from);
        while (day <= to) {
          set.add(this.formatDate(day));
          day.setDate(day.getDate() + 1);
        }
      });
      return set;
    },
    months() {
      const formatter = new Intl.DateTimeFormat(this.currentLanguage, { month: 'long' });
      return Array.from({ length: 12 }, (_, i) => {
        const date = new Date(2000, i, 1);
        return formatter.format(date);
      });
    },
    weekdays() {
      const formatter = new Intl.DateTimeFormat(this.currentLanguage, { weekday: 'short' });
      const start = this.firstDayOfWeek;
      return Array.from({ length: 7 }, (_, i) => {
        const dayIndex = (start + i) % 7;
        const date = new Date(2023, 0, 1 + dayIndex);
        return formatter.format(date);
      });
    }
  },
  watch: {
    currentLanguage(newLang) {
      localStorage.setItem('userLanguage', newLang);
      document.documentElement.lang = newLang;
    },
    currentFontSize(newSize) {
      localStorage.setItem('fontSize', newSize);
    },
    periodData: {
      handler(newData) {
        this.saveData(newData);
        this.calculateNextPeriod();
      },
      deep: true
    },
    isDarkMode: {
      handler(val) {
        document.documentElement.classList.toggle('app-dark', val);
      },
      immediate: true
    }
  },
  created() {
    this.loadData();
    this.initTheme();
    document.documentElement.lang = this.currentLanguage;
  },
  mounted() {
    window.addEventListener('keydown', this.onKeydown);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.onKeydown);
  },
  methods: {
    onKeydown(event) {
      if (event.key !== 'Escape') return;
      if (this.activeInfo) {
        this.activeInfo = null;
      } else if (this.exportModal.show) {
        this.exportModal.show = false;
      } else if (this.showMonthYearPicker) {
        this.showMonthYearPicker = false;
      } else if (this.showToolsMenu) {
        this.showToolsMenu = false;
      }
    },
    t(key, params = {}) {
      const translation = this.availableLanguages[this.currentLanguage].translations[key] ||
                         this.availableLanguages['en'].translations[key] ||
                         key;

      return translation.replace(/\{(\w+)\}/g, (_, param) => params[param] || '');
    },

    tList(key) {
      return this.availableLanguages[this.currentLanguage].translations[key] ||
             this.availableLanguages['en'].translations[key] ||
             [];
    },

    getEnglishTranslations() {
      return {
        previousMonth: 'Previous month',
        nextMonth: 'Next month',
        selectMonthYear: 'Select month and year',
        previousYear: 'Previous year',
        nextYear: 'Next year',
        selectMonth: 'Select month {month}',
        apply: 'Apply',
        cancel: 'Cancel',
        selectLanguage: 'Select language',
        selectFontSize: 'Select font size',
        tools: 'Settings',
        switchToLightMode: 'Switch to light mode',
        switchToDarkMode: 'Switch to dark mode',

        smallFont: 'Small',
        mediumFont: 'Medium',
        largeFont: 'Large',
        xlargeFont: 'Extra Large',

        exportData: 'Export Data',
        dataExported: 'Data exported',
        savedTo: 'File saved to:',
        downloadsFolder: 'your Downloads folder (bloody-useful.json)',
        exportError: 'Could not save the file',
        ok: 'OK',
        importData: 'Import Data',
        clearData: 'Clear Data',
        instructions: 'Instructions',
        legalNotice: 'Legal notice',
        close: 'Close',
        suggestionsHeading: 'Suggestions',
        suggestionsText: 'Have an idea or found a problem? I would love to hear from you.',
        sendSuggestion: 'Send a suggestion',
        suggestionSubject: 'BloodyUseful suggestion',

        instructionsTitle: 'Instructions',
        instructionsBody: [
          { heading: 'Log your bleeding', text: 'Tap a day on the calendar to log bleeding. Each tap changes the intensity: none → light → medium → heavy, then starts over.' },
          { heading: 'Move between months', text: 'Swipe the calendar left or right, or use the arrows. The calendar button lets you jump to a specific month and year.' },
          { heading: 'Automatic predictions', text: 'From the days you log, the app estimates your average cycle and period length, the ovulation window and the predicted next period. The more cycles you log, the more accurate they get.' },
          { heading: 'Settings', text: 'From the gear menu you can change the font size, the language and switch between light and dark mode.' },
          { heading: 'Backups', text: 'Export your data to a bloody-useful.json file to keep it or move it to another device, and import it whenever you like. Clearing data removes all records.' }
        ],

        legalTitle: 'Legal notice',
        legalBody: [
          { heading: 'Your data privacy', text: 'All your data is stored only on this device. It is never sent to any server, shared with third parties, or accessible to anyone else.' },
          { heading: 'Keep your backups', text: 'If you clear the data, uninstall the app or wipe the device storage, the information will be lost permanently. Export backups regularly.' },
          { heading: 'Not medical advice', text: 'BloodyUseful is an informational tracking tool. Cycle, ovulation and next-period predictions are estimates and do not constitute medical advice or a contraceptive method. Consult a healthcare professional for any health-related decision.' },
          { heading: 'No warranty', text: 'The app is provided "as is", with no guarantee of accuracy. Your use of it and its predictions is your own responsibility.' }
        ],

        lightFlow: 'Light Flow',
        mediumFlow: 'Medium Flow',
        heavyFlow: 'Heavy Flow',
        ovulationWindow: 'Ovulation Window',
        predictedNextPeriod: 'Predicted Next Period',

        cycleInformation: 'Cycle Information',
        nextPeriod: 'Next Period',
        notEnoughData: 'Not enough data to predict',
        ovulationWindow: 'Ovulation Window',
        cycleLength: 'Cycle Length',
        periodDuration: 'Period Duration',
        daysAverage: '{days} days (average)',

        january: 'January',
        february: 'February',
        march: 'March',
        april: 'April',
        may: 'May',
        june: 'June',
        july: 'July',
        august: 'August',
        september: 'September',
        october: 'October',
        november: 'November',
        december: 'December',

        sunday: 'Sun',
        monday: 'Mon',
        tuesday: 'Tue',
        wednesday: 'Wed',
        thursday: 'Thu',
        friday: 'Fri',
        saturday: 'Sat'
      };
    },

    getSpanishTranslations() {
      return {
        previousMonth: 'Mes anterior',
        nextMonth: 'Próximo mes',
        selectMonthYear: 'Seleccionar mes y año',
        previousYear: 'Año anterior',
        nextYear: 'Próximo año',
        selectMonth: 'Seleccionar mes {month}',
        apply: 'Aplicar',
        cancel: 'Cancelar',
        selectLanguage: 'Seleccionar idioma',
        selectFontSize: 'Tamaño de fuente',
        tools: 'Ajustes',
        switchToLightMode: 'Cambiar a modo claro',
        switchToDarkMode: 'Cambiar a modo oscuro',
        smallFont: 'Pequeño',
        mediumFont: 'Mediano',
        largeFont: 'Grande',
        xlargeFont: 'Extra Grande',
        exportData: 'Exportar Datos',
        dataExported: 'Datos exportados',
        savedTo: 'Archivo guardado en:',
        downloadsFolder: 'tu carpeta de Descargas (bloody-useful.json)',
        exportError: 'No se pudo guardar el archivo',
        ok: 'Aceptar',
        importData: 'Importar Datos',
        clearData: 'Borrar Datos',
        instructions: 'Instrucciones',
        legalNotice: 'Aviso legal',
        close: 'Cerrar',
        suggestionsHeading: 'Sugerencias',
        suggestionsText: '¿Tienes una idea o encontraste un problema? Me encantará leerte.',
        sendSuggestion: 'Enviar una sugerencia',
        suggestionSubject: 'Sugerencia BloodyUseful',
        instructionsTitle: 'Instrucciones',
        instructionsBody: [
          { heading: 'Registrar el sangrado', text: 'Toca un día del calendario para registrar el sangrado. Cada toque cambia la intensidad: sin flujo → ligero → medio → abundante, y vuelve a empezar.' },
          { heading: 'Cambiar de mes', text: 'Desliza el calendario a izquierda o derecha, o usa las flechas. El botón del calendario te permite saltar a un mes y año concretos.' },
          { heading: 'Predicciones automáticas', text: 'A partir de los días que registres, la app calcula la duración media del ciclo y del periodo, la ventana de ovulación estimada y la fecha prevista del próximo periodo. Cuantos más ciclos registres, más precisas serán.' },
          { heading: 'Ajustes', text: 'Desde el menú del engranaje puedes cambiar el tamaño de letra, el idioma y alternar entre modo claro y oscuro.' },
          { heading: 'Copias de seguridad', text: 'Exporta tus datos a un archivo bloody-useful.json para guardarlos o pasarlos a otro dispositivo, e impórtalos cuando quieras. Borrar datos elimina todos los registros.' }
        ],
        legalTitle: 'Aviso legal',
        legalBody: [
          { heading: 'Privacidad de tus datos', text: 'Todos tus datos se guardan únicamente en este dispositivo. No se envían a ningún servidor, no se comparten con terceros y nadie más puede acceder a ellos.' },
          { heading: 'Conserva tus copias', text: 'Si borras los datos, desinstalas la app o limpias el almacenamiento del dispositivo, la información se perderá de forma irreversible. Exporta copias de seguridad con regularidad.' },
          { heading: 'No es consejo médico', text: 'BloodyUseful es una herramienta informativa de seguimiento. Las predicciones de ciclo, ovulación y próximo periodo son estimaciones y no constituyen consejo médico ni un método anticonceptivo. Consulta a un profesional sanitario para cualquier decisión relacionada con tu salud.' },
          { heading: 'Sin garantías', text: 'La aplicación se ofrece «tal cual», sin garantía de exactitud. El uso que hagas de ella y de sus predicciones es tu responsabilidad.' }
        ],
        lightFlow: 'Flujo Ligero',
        mediumFlow: 'Flujo Medio',
        heavyFlow: 'Flujo Abundante',
        ovulationWindow: 'Ventana de Ovulación',
        predictedNextPeriod: 'Próximo Período Previsto',
        cycleInformation: 'Información del Ciclo',
        nextPeriod: 'Próximo Período',
        notEnoughData: 'Datos insuficientes para predecir',
        ovulationWindow: 'Ventana de Ovulación',
        cycleLength: 'Duración del Ciclo',
        periodDuration: 'Duración del Período',
        daysAverage: '{days} días (promedio)'
      };
    },

    getDayAriaLabel(day) {
      if (day === null) return '';

      const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
      const dateStr = this.formatDate(date);
      const dayData = this.periodData[dateStr] || {};

      let label = `${day} ${this.currentDate.toLocaleDateString(this.currentLanguage, { month: 'long' })}`;

      if (dayData.flow > 0) {
        const flowLabels = ['', this.t('lightFlow'), this.t('mediumFlow'), this.t('heavyFlow')];
        label += `, ${flowLabels[dayData.flow]}`;
      }

      if (dayData.ovulation || this.ovulationDates.has(dateStr)) {
        label += `, ${this.t('ovulationWindow')}`;
      }

      if (this.predictedPeriod && this.formatDate(this.predictedPeriod) === dateStr) {
        label += `, ${this.t('predictedNextPeriod')}`;
      }

      if (this.isToday(day)) {
        label += `, ${this.t('today')}`;
      }

      return label;
    },

    formatMonthTitle(date) {
      return date.toLocaleDateString(this.currentLanguage, { month: 'long', year: 'numeric' });
    },

    formatDate(date) {
      if (!date) return '';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    initTheme() {
      if (this.userThemePreference) {
        this.darkMode = this.userThemePreference === 'dark';
        return;
      }
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.darkMode = prefersDark;
    },
    toggleTheme() {
      this.darkMode = !this.darkMode;
      localStorage.setItem('userThemePreference', this.darkMode ? 'dark' : 'light');
    },
    loadData() {
      const savedData = localStorage.getItem('periodData');
      if (savedData) {
        this.periodData = JSON.parse(savedData);
      }
    },
    saveData(data) {
      localStorage.setItem('periodData', JSON.stringify(data));
    },
    isToday(day) {
      if (day === null) return false;
      const today = new Date();
      return (
        this.currentDate.getFullYear() === today.getFullYear() &&
        this.currentDate.getMonth() === today.getMonth() &&
        day === today.getDate()
      );
    },
    calculateNextPeriod() {
      const lastStart = this.lastPeriodStart;

      if (!lastStart) {
        this.predictedPeriod = null;
        return;
      }

      const avgCycle = this.averageCycleLength || 28;
      const predicted = new Date(lastStart);
      predicted.setDate(lastStart.getDate() + avgCycle);
      this.predictedPeriod = predicted;
    },
    calculateOvulationStart(periodStartDate) {
      const date = new Date(periodStartDate);
      date.setDate(date.getDate() + 12);
      return date;
    },
    calculateOvulationEnd(periodStartDate) {
      const date = new Date(periodStartDate);
      date.setDate(date.getDate() + 16);
      return date;
    },
    calculateOvulation(periodStartDate) {
      return this.calculateOvulationStart(periodStartDate);
    },
    getDaysInMonth(date) {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    },
    getFirstDayOfMonth(date) {
      return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    },
    getDayClasses(day) {
      if (day === null) return 'calendar-day empty';

      const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
      const dateStr = this.formatDate(date);
      const dayData = this.periodData[dateStr] || {};

      const classes = ['calendar-day', this.flowLevels[dayData.flow || 0]];

      if (dayData.ovulation || this.ovulationDates.has(dateStr)) {
        classes.push('ovulation');
      }

      if (this.predictedPeriod && this.formatDate(this.predictedPeriod) === dateStr) {
        classes.push('predicted');
      }

      if (this.isToday(day)) {
        classes.push('today');
      }

      return classes.join(' ');
    },
    toggleTools() {
      if (!this.showToolsMenu && this.$refs.headerTop) {
        this.toolsMenuTop = Math.round(this.$refs.headerTop.getBoundingClientRect().bottom + 6);
        if (this.$refs.calendarGrid) {
          const rect = this.$refs.calendarGrid.getBoundingClientRect();
          this.toolsMenuLeft = Math.round(rect.left);
          this.toolsMenuWidth = Math.round(rect.width);
        }
      }
      this.showToolsMenu = !this.showToolsMenu;
    },
    onTouchStart(event) {
      const touch = event.changedTouches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
      this.swiped = false;
    },
    onTouchEnd(event) {
      if (this.touchStartX == null) return;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - this.touchStartX;
      const dy = touch.clientY - this.touchStartY;
      this.touchStartX = null;

      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        this.swiped = true;
        if (dx < 0) {
          this.handleNextMonth();
        } else {
          this.handlePrevMonth();
        }
      }
    },
    handleDayClick(day) {
      if (day === null) return;

      if (this.swiped) {
        this.swiped = false;
        return;
      }

      const clickedDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth(),
        day
      );
      const dateStr = this.formatDate(clickedDate);
      if (!dateStr) return;

      const currentFlow = this.periodData[dateStr]?.flow || 0;
      const newFlow = (currentFlow + 1) % 4;

      const newData = {
        ...this.periodData,
        [dateStr]: {
          flow: newFlow,
          ovulation: false
        }
      };

      if (newFlow === 1) {
        const ovulationDate = this.calculateOvulation(clickedDate);
        if (ovulationDate) {
          const ovulationDateStr = this.formatDate(ovulationDate);
          if (ovulationDateStr) {
            newData[ovulationDateStr] = {
              ...newData[ovulationDateStr],
              ovulation: true
            };
          }
        }
      }

      this.periodData = newData;
    },
    handlePrevMonth() {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() - 1,
        1
      );
    },
    handleNextMonth() {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 1,
        1
      );
    },
    async downloadData() {
      const dataStr = JSON.stringify(this.periodData, null, 2);
      const fileName = 'bloody-useful.json';

      if (Capacitor.isNativePlatform()) {
        try {
          await Filesystem.writeFile({
            path: fileName,
            data: dataStr,
            directory: Directory.Documents,
            encoding: Encoding.UTF8
          });
          const uri = await Filesystem.getUri({ directory: Directory.Documents, path: fileName });
          this.exportModal = { show: true, location: decodeURIComponent(uri.uri.replace('file://', '')) };
        } catch (e) {
          this.exportModal = { show: true, location: this.t('exportError') };
        }
        return;
      }

      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      this.exportModal = { show: true, location: this.t('downloadsFolder') };
    },
    triggerFileUpload() {
      document.getElementById('file-upload').click();
    },
    uploadData(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = JSON.parse(e.target.result);
          this.periodData = data;
        };
        reader.readAsText(file);
      }
    },
    clearData() {
      this.periodData = {};
      this.predictedPeriod = null;
    },
    showMonthYearSelection() {
      this.selectedYear = this.currentDate.getFullYear();
      this.selectedMonth = this.currentDate.getMonth();
      this.showMonthYearPicker = true;
    },
    selectMonth(monthIndex) {
      this.selectedMonth = monthIndex;
    },
    incrementYear() {
      this.selectedYear++;
    },
    decrementYear() {
      this.selectedYear--;
    },
    applyMonthYearSelection() {
      this.currentDate = new Date(this.selectedYear, this.selectedMonth, 1);
      this.showMonthYearPicker = false;
    }
  }
};
</script>

<style lang="scss" scoped>
$primary-color: #4a00e0;
$accent-color: #ff4785;
$accent-hover: #ff2d70;
$danger-color: #d6003a;
$light-bg: #f8f9fa;
$dark-bg: #2d2d2d;
$border-light: #dee2e6;
$border-dark: #444;
$text-light: #333;
$text-dark: #f0f0f0;
$ovulation-dark: #38bdf8;
$predicted-dark: #c4b2f5;

.period-tracker {
  font-family: var(--app-font);
  font-size: var(--base-font-size);
  line-height: 1.6;
  letter-spacing: 0.05em;
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
  color: $text-light;
  background-color: white;
  transition: background-color 0.3s, color 0.3s;

  &.dark-mode {
    background-color: #1a1a1a;
    color: $text-dark;

    .calendar-header,
    .legend,
    .info-box {
      background-color: $dark-bg;
      border-color: $border-dark;
    }

    .month-title {
      color: $text-dark;
    }

    .nav-button,
    .control-button {
      background-color: #333;
      border-color: $border-dark;
      color: $text-dark;

      &:hover {
        background-color: #444;
      }
    }

    .tools-menu {
      background: $dark-bg;
      border-color: $border-dark;
    }

    .clear-button {
      background-color: #3a1a1a;
      border-color: #5a2a2a;
      color: #ff9999;

      &:hover {
        background-color: #4a2a2a;
      }
    }

    .calendar-day {
      border-color: $border-dark;

      &.empty {
        background: transparent;
      }

      &.bg-white {
        background-color: $dark-bg;
        border-color: $border-dark;
        color: $text-dark;
      }

      &.flow-light {
        color: $text-light;
      }
    }

    .weekday-header {
      color: #aaa;
    }

    .legend-text {
      color: #ddd;
    }

    .legend {
      .legend-color.ovulation {
        background: transparent;

        &::after {
          background: $ovulation-dark;
        }
      }

      .legend-color.predicted {
        background: transparent;
        border-color: $predicted-dark;
      }
    }

    .info-box {
      .info-title {
        color: $text-dark;
        border-bottom-color: $border-dark;
      }

      .info-label {
        color: #bbb;
      }

      .info-value {
        color: $text-dark;
      }
    }

    .month-year-picker {
      background: $dark-bg;
      color: $text-dark;
    }

    .save-label {
      color: #aaa;
    }

    .picker-header {
      background: #333;
      border-color: $border-dark;

      h3 {
        color: $text-dark;
      }
    }

    .year-nav-button {
      border-color: $border-dark;
      color: $text-dark;

      &:hover {
        background: #444;
      }
    }

    .month-button {
      background: #333;
      border-color: $border-dark;
      color: $text-dark;

      &:hover {
        background: #444;
      }

      &.selected-month {
        background: $accent-color;
        border-color: $accent-color;
        color: white;
      }
    }

    .cancel-button {
      background: #333;
      border-color: $border-dark;
      color: $text-dark;

      &:hover {
        background: #444;
      }
    }

    .ovulation {
      background: $dark-bg;

      &::after {
        background: $ovulation-dark;
      }
    }

    .calendar-day.predicted {
      background: $dark-bg;
      border: 2px dashed $predicted-dark;
    }
  }
}

.theme-toggle {
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
}

.calendar-header {
  margin-bottom: 1rem;
  padding: 0.5rem;

  .header-top {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .month-title {
    margin: 0;
    flex: 1;
    font-size: var(--title-font-size);
    color: #2c3e50;
    text-align: center;
  }

  .tools {
    position: relative;
    flex-shrink: 0;
    z-index: 1101;
  }

  .tools-menu {
    position: fixed;
    z-index: 1100;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    background: white;
    border: 1px solid $border-light;
    border-radius: 8px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);

    .tools-selectors {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .nav-button,
    .control-button,
    .clear-button {
      width: 100%;
    }
  }

  .navigation-buttons {
    display: flex;
    gap: 0.5rem;

    .nav-button {
      flex: 1;
    }
  }

  .nav-button {
    background: $light-bg;
    border: 1px solid $border-light;
    border-radius: 4px;
    padding: 0.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--app-font);
    font-size: var(--base-font-size);
    min-height: calc(var(--base-font-size) + 30px);

    &:hover {
      background: #e9ecef;
    }
  }

  .language-selector {
    min-width: 120px;
  }
}

.tools-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1050;
  background: rgba(0, 0, 0, 0.5);
  animation: backdrop-in 0.2s ease both;
}

@keyframes backdrop-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.icon {
  fill: currentColor;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.month-year-picker {
  background: white;
  border-radius: 8px;
  width: 300px;
  max-width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  font-family: var(--app-font);

  .picker-header {
    padding: 1rem;
    background: $light-bg;
    border-bottom: 1px solid $border-light;
    text-align: center;

    h3 {
      margin: 0;
      font-size: calc(var(--base-font-size) + 2px);
      color: #2c3e50;
    }
  }

  .picker-body {
    padding: 1rem;
  }

  .info-body {
    padding: 1rem;
    max-height: 60vh;
    overflow-y: auto;
  }

  .info-section {
    margin-bottom: 1rem;

    &:last-child {
      margin-bottom: 0;
    }

    h4 {
      margin: 0 0 0.25rem;
      font-size: var(--base-font-size);
      color: $accent-color;
    }

    p {
      margin: 0;
      font-size: var(--base-font-size);
      line-height: 1.5;
    }
  }

  .suggestion-link {
    display: inline-block;
    margin-top: 0.6rem;
    padding: 0.6rem 1.25rem;
    background: $accent-color;
    color: #ffffff;
    font-size: var(--base-font-size);
    font-weight: 600;
    text-decoration: none;
    border-radius: 4px;

    &:hover {
      background: $accent-hover;
    }
  }

  .save-label {
    margin: 0 0 0.5rem;
    font-size: var(--base-font-size);
    color: #6c757d;
  }

  .save-path {
    margin: 0;
    font-size: var(--base-font-size);
    font-weight: 500;
    word-break: break-all;
  }

  .year-selector {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    gap: 1rem;
  }

  .year-nav-button {
    background: none;
    border: 1px solid $border-light;
    border-radius: 4px;
    padding: 0.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: #f1f3f5;
    }
  }

  .year-display {
    font-size: calc(var(--base-font-size) + 2px);
    font-weight: bold;
    min-width: 60px;
    text-align: center;
  }

  .month-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .month-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 0.4rem;
    min-height: calc(var(--base-font-size) + 30px);
    font-family: var(--app-font);
    font-size: min(var(--base-font-size), 1.05rem);
    border: 1px solid $border-light;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    transition: all 0.2s;

    &:hover {
      background: #f1f3f5;
    }

    &.selected-month {
      background: $accent-color;
      color: white;
      border-color: $accent-color;
    }
  }

  .picker-footer {
    display: flex;
    padding: 1rem;
    border-top: 1px solid $border-light;
    gap: 0.5rem;
  }

  .apply-button, .cancel-button {
    flex: 1;
    padding: 0.5rem 1rem;
    min-height: calc(var(--base-font-size) + 26px);
    font-family: var(--app-font);
    font-size: var(--base-font-size);
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
  }

  .apply-button {
    background: $accent-color;
    color: white;
    border: 1px solid $accent-color;

    &:hover {
      background: $accent-hover;
    }
  }

  .cancel-button {
    background: white;
    border: 1px solid $border-light;

    &:hover {
      background: #f1f3f5;
    }
  }
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.weekday-header {
  text-align: center;
  font-weight: bold;
  padding: 0.5rem 0;
  color: #6c757d;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  &.empty {
    background: transparent;
    cursor: default;
  }

  &.bg-white {
    background: white;
    border: 1px solid $border-light;
  }

  &.flow-light {
    background: #ffd6e7;
    border: 1px solid #ff85b8;
  }

  &.flow-medium {
    background: #ff85b8;
    border: 1px solid #ff4785;
    color: white;
  }

  &.flow-heavy {
    background: #ff4785;
    border: 1px solid $danger-color;
    color: white;
  }

  &.ovulation {
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: 3px;
      left: 50%;
      transform: translateX(-50%);
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $primary-color;
    }
  }

  &.predicted {
    position: relative;
    border: 2px dashed $primary-color;
  }

  &.today {
    position: relative;
    border: 2px solid #00e0d5 !important;
    box-shadow: 0 0 0 2px rgba(0, 224, 213, 0.2);
  }
}

.control-button,
.clear-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: var(--app-font);
  font-size: var(--base-font-size);
  min-height: calc(var(--base-font-size) + 30px);
  color: inherit;
  text-decoration: none;
}

.control-button {
  background: $light-bg;
  border: 1px solid $border-light;

  &:hover {
    background: #e9ecef;
  }
}

.clear-button {
  background: #fff5f5;
  border: 1px solid #ffd6d6;
  color: $danger-color;

  &:hover {
    background: #ffecec;
  }
}

.hidden {
  display: none;
}

.legend {
  background: $light-bg;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;

  .legend-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .legend-color {
    width: 1.3em;
    height: 1.3em;
    flex-shrink: 0;
    border-radius: 4px;

    &.flow-light {
      background: #ffd6e7;
      border: 1px solid #ff85b8;
    }

    &.flow-medium {
      background: #ff85b8;
      border: 1px solid #ff4785;
    }

    &.flow-heavy {
      background: #ff4785;
      border: 1px solid $danger-color;
    }

    &.ovulation {
      background: white;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        top: 0.18em;
        left: 0.18em;
        width: 0.95em;
        height: 0.95em;
        border-radius: 50%;
        background: $primary-color;
      }
    }

    &.predicted {
      background: white;
      border: 2px dashed $primary-color;
    }
  }
}

.info-box {
  background: $light-bg;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid $border-light;

  .info-title {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #2c3e50;
    font-size: 1.2rem;
    border-bottom: 1px solid $border-light;
    padding-bottom: 0.5rem;
  }

  .info-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .info-item {
    display: flex;
    justify-content: space-between;
  }

  .info-label {
    font-weight: 500;
    color: #555;
  }

  .info-value {
    font-weight: 600;
    color: #2c3e50;
    text-align: right;
  }
}

@media (max-width: 480px) {
  .period-tracker {
    padding: 0.5rem;
  }

  .calendar-grid {
    gap: 0.35rem;
  }

  .calendar-day {
    font-size: min(var(--base-font-size), 1.4rem);
  }

  .weekday-header {
    font-size: 0.75rem;
    letter-spacing: 0;
  }

  .month-title {
    font-size: 1.3rem;
  }

  .control-button, .clear-button {
    padding: 0.5rem;
    justify-content: center;
  }

  .nav-button .icon {
    width: 28px;
    height: 28px;
  }

  .control-button .icon,
  .clear-button .icon {
    width: 1.75em;
    height: 1.75em;
  }

  .legend-row {
    flex-direction: column;
    gap: 0.75rem;
  }

  .legend-item {
    gap: 0.3rem;
  }

  .legend-text {
    font-size: calc(var(--base-font-size) - 2px);
  }

  .month-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .calendar-header .theme-toggle {
    font-size: 1.75rem;
  }

  .info-item {
    flex-direction: column;
    gap: 0.2rem;
  }

  .info-box .info-value {
    text-align: left;
  }
}
</style>
