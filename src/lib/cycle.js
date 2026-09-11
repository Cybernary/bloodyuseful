import { formatDate } from './dates.js';

const DAY = 1000 * 60 * 60 * 24;

export function groupPeriods(periodData) {
  const dates = Object.keys(periodData)
    .filter(date => periodData[date].flow > 0)
    .sort();

  const groups = [];
  let current = [];

  for (let i = 0; i < dates.length; i++) {
    const currentDate = new Date(dates[i]);
    const prevDate = i > 0 ? new Date(dates[i - 1]) : null;
    const gap = prevDate ? Math.round((currentDate - prevDate) / DAY) : null;

    if (gap === 1) {
      current.push(currentDate);
    } else {
      if (current.length > 0) groups.push(current);
      current = [currentDate];
    }
  }

  if (current.length > 0) groups.push(current);

  return groups;
}

export function periodStartDates(periodData) {
  return groupPeriods(periodData).map(group => group[0]);
}

export function lastPeriodStart(periodData) {
  const starts = periodStartDates(periodData);
  return starts.length > 0 ? starts[starts.length - 1] : null;
}

export function averageCycleLength(periodData) {
  const starts = periodStartDates(periodData);
  if (starts.length < 2) return null;

  let totalDays = 0;
  for (let i = 1; i < starts.length; i++) {
    totalDays += Math.round((starts[i] - starts[i - 1]) / DAY);
  }

  return Math.round(totalDays / (starts.length - 1));
}

export function averagePeriodLength(periodData) {
  const groups = groupPeriods(periodData);
  if (groups.length === 0) return null;

  const totalDays = groups.reduce((sum, group) => sum + group.length, 0);
  return Math.round(totalDays / groups.length);
}

export function ovulationStart(startDate) {
  const date = new Date(startDate);
  date.setDate(date.getDate() + 12);
  return date;
}

export function ovulationEnd(startDate) {
  const date = new Date(startDate);
  date.setDate(date.getDate() + 16);
  return date;
}

export function predictNextPeriod(periodData) {
  const lastStart = lastPeriodStart(periodData);
  if (!lastStart) return null;

  const avgCycle = averageCycleLength(periodData) || 28;
  const predicted = new Date(lastStart);
  predicted.setDate(lastStart.getDate() + avgCycle);
  return predicted;
}

export function ovulationDates(periodData) {
  const set = new Set();
  periodStartDates(periodData).forEach(start => {
    const day = ovulationStart(start);
    const end = ovulationEnd(start);
    while (day <= end) {
      set.add(formatDate(day));
      day.setDate(day.getDate() + 1);
    }
  });
  return set;
}
