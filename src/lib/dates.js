export function formatDate(date) {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDaysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function getFirstDayOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
}

export function isToday(currentDate, day) {
  if (day === null) return false;
  const today = new Date();
  return (
    currentDate.getFullYear() === today.getFullYear() &&
    currentDate.getMonth() === today.getMonth() &&
    day === today.getDate()
  );
}

export function firstDayOfWeek(locale) {
  try {
    const info = new Intl.Locale(locale);
    const week = typeof info.getWeekInfo === 'function' ? info.getWeekInfo() : info.weekInfo;
    if (week && week.firstDay) {
      return week.firstDay % 7;
    }
  } catch (e) {
    return 0;
  }
  return 0;
}

export function buildCalendarDays(currentDate, weekStart) {
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const offset = (firstDay - weekStart + 7) % 7;
  const days = [];

  for (let i = 0; i < offset; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return days;
}

export function monthNames(locale) {
  const formatter = new Intl.DateTimeFormat(locale, { month: 'long' });
  return Array.from({ length: 12 }, (_, i) => formatter.format(new Date(2000, i, 1)));
}

export function weekdayNames(locale, weekStart) {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  return Array.from({ length: 7 }, (_, i) => {
    const dayIndex = (weekStart + i) % 7;
    return formatter.format(new Date(2023, 0, 1 + dayIndex));
  });
}

export function formatMonthTitle(date, locale) {
  return date.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
}
