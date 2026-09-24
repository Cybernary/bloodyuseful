import { ref, computed } from 'vue';
import {
  formatDate,
  formatMonthTitle,
  isToday,
  firstDayOfWeek,
  buildCalendarDays,
  monthNames,
  weekdayNames
} from '../lib/dates.js';

const flowLevels = {
  0: 'bg-white',
  1: 'flow-light',
  2: 'flow-medium',
  3: 'flow-heavy'
};

export function useCalendar({ currentLanguage, periodData, predictedPeriod, ovulationDates, t }) {
  const now = new Date();
  const currentDate = ref(new Date(now.getFullYear(), now.getMonth(), 1));
  const selectedYear = ref(now.getFullYear());
  const selectedMonth = ref(now.getMonth());
  const showMonthYearPicker = ref(false);

  let swiped = false;
  let touchStartX = null;
  let touchStartY = null;

  const weekStart = computed(() => firstDayOfWeek(currentLanguage.value));
  const calendarDays = computed(() => buildCalendarDays(currentDate.value, weekStart.value));
  const months = computed(() => monthNames(currentLanguage.value));
  const weekdays = computed(() => weekdayNames(currentLanguage.value, weekStart.value));

  function monthTitle() {
    return formatMonthTitle(currentDate.value, currentLanguage.value);
  }

  function getDayClasses(day) {
    if (day === null) return 'calendar-day empty';

    const date = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), day);
    const dateStr = formatDate(date);
    const dayData = periodData.value[dateStr] || {};

    const classes = ['calendar-day', flowLevels[dayData.flow || 0]];

    if (ovulationDates.value.has(dateStr)) {
      classes.push('ovulation');
    }

    if (predictedPeriod.value && formatDate(predictedPeriod.value) === dateStr) {
      classes.push('predicted');
    }

    if (isToday(currentDate.value, day)) {
      classes.push('today');
    }

    return classes.join(' ');
  }

  function getDayAriaLabel(day) {
    if (day === null) return '';

    const date = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), day);
    const dateStr = formatDate(date);
    const dayData = periodData.value[dateStr] || {};

    let label = `${day} ${currentDate.value.toLocaleDateString(currentLanguage.value, { month: 'long' })}`;

    if (dayData.flow > 0) {
      const flowLabels = ['', t('lightFlow'), t('mediumFlow'), t('heavyFlow')];
      label += `, ${flowLabels[dayData.flow]}`;
    }

    if (ovulationDates.value.has(dateStr)) {
      label += `, ${t('ovulationWindow')}`;
    }

    if (predictedPeriod.value && formatDate(predictedPeriod.value) === dateStr) {
      label += `, ${t('predictedNextPeriod')}`;
    }

    if (isToday(currentDate.value, day)) {
      label += `, ${t('today')}`;
    }

    return label;
  }

  function handleDayClick(day) {
    if (day === null) return;

    if (swiped) {
      swiped = false;
      return;
    }

    const clickedDate = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), day);
    const dateStr = formatDate(clickedDate);
    if (!dateStr) return;

    const currentFlow = periodData.value[dateStr]?.flow || 0;
    const newFlow = (currentFlow + 1) % 4;

    const newData = { ...periodData.value };

    if (newFlow === 0) {
      delete newData[dateStr];
    } else {
      newData[dateStr] = { flow: newFlow };
    }

    periodData.value = newData;
  }

  function handlePrevMonth() {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
  }

  function handleNextMonth() {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
  }

  function onTouchStart(event) {
    const touch = event.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    swiped = false;
  }

  function onTouchEnd(event) {
    if (touchStartX == null) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;
    touchStartX = null;

    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      swiped = true;
      if (dx < 0) {
        handleNextMonth();
      } else {
        handlePrevMonth();
      }
    }
  }

  function selectMonth(monthIndex) {
    selectedMonth.value = monthIndex;
  }

  function incrementYear() {
    selectedYear.value++;
  }

  function decrementYear() {
    selectedYear.value--;
  }

  function applyMonthYearSelection() {
    currentDate.value = new Date(selectedYear.value, selectedMonth.value, 1);
    showMonthYearPicker.value = false;
  }

  return {
    currentDate,
    calendarDays,
    months,
    weekdays,
    selectedYear,
    selectedMonth,
    showMonthYearPicker,
    monthTitle,
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
  };
}
