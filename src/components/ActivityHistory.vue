<script setup>
import { computed, reactive } from 'vue';
import { Search, Trash2 } from 'lucide-vue-next';

const props = defineProps({
  workouts: {
    type: Array,
    required: true
  },
  plans: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['delete-workout']);

const filters = reactive({
  query: '',
  type: 'all',
  sort: 'newest'
});

const activityOptions = computed(() => ['all', ...new Set(props.workouts.map((workout) => workout.type))]);

const filteredWorkouts = computed(() => {
  const query = filters.query.trim().toLowerCase();

  return props.workouts
    .filter((workout) => {
      const matchesType = filters.type === 'all' || workout.type === filters.type;
      const text = `${workout.type} ${workout.notes} ${planName(workout.planId)}`.toLowerCase();
      return matchesType && (!query || text.includes(query));
    })
    .slice()
    .sort((a, b) => {
      const direction = filters.sort === 'newest' ? -1 : 1;
      return direction * a.date.localeCompare(b.date);
    });
});

function planName(planId) {
  return props.plans.find((plan) => plan.id === planId)?.name || 'Bez planu';
}
</script>

<template>
  <section class="history-layout">
    <div class="panel">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Historia</p>
          <h2>Aktywnosci i statystyki</h2>
        </div>
      </div>

      <div class="filters-bar">
        <label class="search-field">
          <Search :size="18" />
          <input v-model.trim="filters.query" type="search" placeholder="Szukaj po notatkach lub planie" />
        </label>

        <label>
          Typ
          <select v-model="filters.type">
            <option value="all">Wszystkie</option>
            <option v-for="type in activityOptions.filter((type) => type !== 'all')" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </label>

        <label>
          Sortowanie
          <select v-model="filters.sort">
            <option value="newest">Najnowsze</option>
            <option value="oldest">Najstarsze</option>
          </select>
        </label>
      </div>
    </div>

    <section class="records-column wide-list" aria-label="Historia treningow">
      <article v-for="workout in filteredWorkouts" :key="workout.id" class="record-card workout-card">
        <div class="record-main">
          <div>
            <p class="eyebrow">{{ workout.date }} / {{ planName(workout.planId) }}</p>
            <h3>{{ workout.type }}</h3>
          </div>
          <span class="status-pill active">{{ workout.intensity }}</span>
        </div>

        <div class="metric-strip">
          <span><strong>{{ workout.duration }}</strong> min</span>
          <span><strong>{{ workout.distance }}</strong> km</span>
          <span><strong>{{ workout.calories }}</strong> kcal</span>
        </div>

        <p v-if="workout.notes" class="record-note">{{ workout.notes }}</p>

        <div class="record-actions">
          <button
            class="icon-button danger"
            type="button"
            title="Usun wpis"
            @click="emit('delete-workout', workout.id)"
          >
            <Trash2 :size="18" />
          </button>
        </div>
      </article>

      <p v-if="!filteredWorkouts.length" class="empty-state">Brak aktywnosci dla wybranych filtrow.</p>
    </section>
  </section>
</template>
