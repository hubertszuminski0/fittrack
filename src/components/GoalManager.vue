<script setup>
import { computed, reactive, watch } from 'vue';
import { Save, Target, Trash2 } from 'lucide-vue-next';
import { evaluateGoals } from '../lib/fittrackLogic';

const props = defineProps({
  goals: {
    type: Array,
    required: true
  },
  workouts: {
    type: Array,
    required: true
  },
  profile: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['create-goal', 'delete-goal', 'update-profile']);

const profileForm = reactive({
  name: props.profile.name,
  weight: props.profile.weight,
  height: props.profile.height,
  targetWeight: props.profile.targetWeight
});

const goalForm = reactive({
  name: '',
  type: 'weekly_workouts',
  target: 4,
  startValue: props.profile.weight,
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
});

const typeOptions = [
  { value: 'weekly_workouts', label: 'Treningi tygodniowo', unit: 'treningow' },
  { value: 'weekly_distance', label: 'Dystans tygodniowy', unit: 'km' },
  { value: 'total_minutes', label: 'Minuty lacznie', unit: 'min' },
  { value: 'target_weight', label: 'Masa ciala', unit: 'kg' }
];

const selectedType = computed(() => typeOptions.find((option) => option.value === goalForm.type));
const goalProgress = computed(() => evaluateGoals(props.goals, props.workouts, props.profile));

watch(
  () => props.profile,
  (profile) => {
    profileForm.name = profile.name;
    profileForm.weight = profile.weight;
    profileForm.height = profile.height;
    profileForm.targetWeight = profile.targetWeight;
    goalForm.startValue = profile.weight;
  },
  { deep: true }
);

function saveProfile() {
  emit('update-profile', {
    name: profileForm.name.trim() || 'Uzytkownik FitTrack',
    weight: Number(profileForm.weight || 0),
    height: Number(profileForm.height || 0),
    targetWeight: Number(profileForm.targetWeight || 0)
  });
}

function createGoal() {
  const name = goalForm.name.trim() || selectedType.value.label;
  emit('create-goal', {
    name,
    type: goalForm.type,
    target: Number(goalForm.target),
    startValue: goalForm.type === 'target_weight' ? Number(goalForm.startValue) : undefined,
    dueDate: goalForm.dueDate
  });

  goalForm.name = '';
  goalForm.target = goalForm.type === 'weekly_workouts' ? 4 : 20;
}
</script>

<template>
  <section class="management-layout">
    <aside class="panel form-panel">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Cele i profil</p>
          <h2>Aktualne parametry</h2>
        </div>
      </div>

      <form class="stack-form" @submit.prevent="saveProfile">
        <label>
          Nazwa profilu
          <input v-model.trim="profileForm.name" type="text" />
        </label>

        <div class="form-grid three">
          <label>
            Masa (kg)
            <input v-model.number="profileForm.weight" min="20" step="0.1" type="number" />
          </label>
          <label>
            Wzrost (cm)
            <input v-model.number="profileForm.height" min="100" type="number" />
          </label>
          <label>
            Cel kg
            <input v-model.number="profileForm.targetWeight" min="20" step="0.1" type="number" />
          </label>
        </div>

        <button class="primary-button compact" type="submit">
          <Save :size="18" />
          Zapisz profil
        </button>
      </form>

      <hr class="soft-divider" />

      <form class="stack-form" @submit.prevent="createGoal">
        <label>
          Nazwa celu
          <input v-model.trim="goalForm.name" type="text" placeholder="np. 4 treningi w tygodniu" />
        </label>

        <div class="form-grid two">
          <label>
            Typ celu
            <select v-model="goalForm.type">
              <option v-for="option in typeOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </label>
          <label>
            Cel ({{ selectedType.unit }})
            <input v-model.number="goalForm.target" min="0" step="0.1" type="number" />
          </label>
        </div>

        <label v-if="goalForm.type === 'target_weight'">
          Wartosc startowa (kg)
          <input v-model.number="goalForm.startValue" min="20" step="0.1" type="number" />
        </label>

        <label>
          Termin
          <input v-model="goalForm.dueDate" type="date" />
        </label>

        <button class="primary-button compact" type="submit">
          <Target :size="18" />
          Dodaj cel
        </button>
      </form>
    </aside>

    <section class="records-column" aria-label="Lista celow">
      <article v-for="goal in goalProgress" :key="goal.id" class="record-card">
        <div class="record-main">
          <div>
            <p class="eyebrow">Termin: {{ goal.dueDate || 'bez terminu' }}</p>
            <h3>{{ goal.name }}</h3>
          </div>
          <span :class="goal.completed ? 'status-pill active' : 'status-pill'">
            {{ goal.completed ? 'Zrealizowany' : `${goal.progress}%` }}
          </span>
        </div>

        <div class="progress-row wide">
          <div>
            <strong>{{ goal.current }} / {{ goal.target }} {{ goal.unit }}</strong>
            <span>Pozostalo: {{ goal.remaining.toFixed ? goal.remaining.toFixed(1) : goal.remaining }} {{ goal.unit }}</span>
          </div>
          <div class="progress-track">
            <span :style="{ width: `${goal.progress}%` }"></span>
          </div>
        </div>

        <div class="record-actions">
          <button class="icon-button danger" type="button" title="Usun cel" @click="emit('delete-goal', goal.id)">
            <Trash2 :size="18" />
          </button>
        </div>
      </article>
    </section>
  </section>
</template>
