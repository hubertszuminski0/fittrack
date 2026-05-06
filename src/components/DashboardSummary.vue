<script setup>
import { computed } from 'vue';
import { Award, Bike, CalendarPlus, Flame, Gauge, Target, Timer } from 'lucide-vue-next';
import ProgressCharts from './ProgressCharts.vue';
import {
  buildAchievementSummary,
  buildWeeklyTimeline,
  evaluateGoals,
  summarizeWorkouts
} from '../lib/fittrackLogic';

const props = defineProps({
  workouts: {
    type: Array,
    required: true
  },
  plans: {
    type: Array,
    required: true
  },
  goals: {
    type: Array,
    required: true
  },
  profile: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['quick-log']);

const summary = computed(() => summarizeWorkouts(props.workouts));
const timeline = computed(() => buildWeeklyTimeline(props.workouts));
const goalProgress = computed(() => evaluateGoals(props.goals, props.workouts, props.profile));
const achievements = computed(() => buildAchievementSummary(props.workouts, goalProgress.value));
const nextPlans = computed(() => props.plans.filter((plan) => plan.active).slice(0, 3));

const statCards = computed(() => [
  {
    label: 'Treningi w tygodniu',
    value: summary.value.currentWeekWorkouts,
    detail: `${summary.value.currentWeekMinutes} min`,
    icon: Flame
  },
  {
    label: 'Laczny dystans',
    value: `${summary.value.totalDistance.toFixed(1)} km`,
    detail: `${summary.value.currentWeekDistance.toFixed(1)} km w tygodniu`,
    icon: Bike
  },
  {
    label: 'Sredni czas',
    value: `${summary.value.averageDuration} min`,
    detail: `${summary.value.totalCalories} kcal lacznie`,
    icon: Timer
  },
  {
    label: 'Seria dni',
    value: summary.value.currentStreak,
    detail: 'aktywne dni z rzedu',
    icon: Gauge
  }
]);
</script>

<template>
  <section class="dashboard-grid">
    <div class="panel hero-panel">
      <div>
        <p class="eyebrow">Panel uzytkownika</p>
        <h2>Witaj, {{ profile.name }}.</h2>
        <p>Dzisiejszy status treningowy, cele i najblizsze plany sa zebrane w jednym widoku.</p>
      </div>
      <button class="primary-button compact" type="button" @click="emit('quick-log')">
        <CalendarPlus :size="18" />
        Zapisz trening
      </button>
    </div>

    <article v-for="card in statCards" :key="card.label" class="stat-card">
      <component :is="card.icon" :size="22" />
      <span>{{ card.label }}</span>
      <strong>{{ card.value }}</strong>
      <small>{{ card.detail }}</small>
    </article>

    <section class="panel chart-panel">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Tydzien</p>
          <h3>Minuty aktywnosci</h3>
        </div>
      </div>
      <ProgressCharts :timeline="timeline" />
    </section>

    <section class="panel">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Cele</p>
          <h3>Postep realizacji</h3>
        </div>
        <Target :size="20" />
      </div>
      <div class="progress-list">
        <article v-for="goal in goalProgress.slice(0, 4)" :key="goal.id" class="progress-row">
          <div>
            <strong>{{ goal.name }}</strong>
            <span>{{ goal.current }} / {{ goal.target }} {{ goal.unit }}</span>
          </div>
          <div class="progress-track" :aria-label="`Postep: ${goal.progress}%`">
            <span :style="{ width: `${goal.progress}%` }"></span>
          </div>
        </article>
      </div>
    </section>

    <section class="panel">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Plany</p>
          <h3>Aktywne jednostki</h3>
        </div>
      </div>
      <ul class="clean-list plan-short-list">
        <li v-for="plan in nextPlans" :key="plan.id">
          <span>{{ plan.name }}</span>
          <strong>{{ plan.days.join(', ') }}</strong>
        </li>
      </ul>
    </section>

    <section class="panel achievements-panel">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Osiagniecia</p>
          <h3>{{ achievements.completionRate }}% odblokowane</h3>
        </div>
        <Award :size="20" />
      </div>
      <div class="badge-list">
        <span v-for="badge in achievements.earned" :key="badge.id" class="earned-badge">
          {{ badge.title }}
        </span>
        <span v-for="badge in achievements.locked" :key="badge.id" class="locked-badge">
          {{ badge.title }}
        </span>
      </div>
    </section>
  </section>
</template>
