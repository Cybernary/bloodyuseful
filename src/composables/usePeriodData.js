import { ref, computed, watch } from 'vue';
import { loadPeriodData, savePeriodData } from '../lib/storage.js';
import {
  predictNextPeriod,
  lastPeriodStart,
  averageCycleLength,
  averagePeriodLength,
  ovulationDates
} from '../lib/cycle.js';

export function usePeriodData() {
  const periodData = ref(loadPeriodData());
  const predictedPeriod = ref(predictNextPeriod(periodData.value));

  watch(
    periodData,
    data => {
      savePeriodData(data);
      predictedPeriod.value = predictNextPeriod(data);
    },
    { deep: true }
  );

  function clearData() {
    periodData.value = {};
    predictedPeriod.value = null;
  }

  return {
    periodData,
    predictedPeriod,
    lastPeriodStart: computed(() => lastPeriodStart(periodData.value)),
    averageCycleLength: computed(() => averageCycleLength(periodData.value)),
    averagePeriodLength: computed(() => averagePeriodLength(periodData.value)),
    ovulationDates: computed(() => ovulationDates(periodData.value)),
    clearData
  };
}
