<script setup>
import { computed } from 'vue';

const props = defineProps({
  timeline: {
    type: Array,
    required: true
  }
});

const maxMinutes = computed(() => Math.max(30, ...props.timeline.map((day) => day.minutes)));

function barHeight(minutes) {
  return `${Math.max(8, Math.round((minutes / maxMinutes.value) * 100))}%`;
}
</script>

<template>
  <div class="timeline-chart" aria-label="Minuty treningu w obecnym tygodniu">
    <div v-for="day in timeline" :key="day.date" class="timeline-day">
      <div class="bar-track">
        <span class="bar-fill" :style="{ height: barHeight(day.minutes) }"></span>
      </div>
      <strong>{{ day.minutes }}</strong>
      <span>{{ day.label }}</span>
    </div>
  </div>
</template>
