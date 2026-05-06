<script setup>
import { computed, reactive, ref } from 'vue';
import { RotateCcw, Save } from 'lucide-vue-next';
import { activityTypes } from '../data/defaults';

const props = defineProps({
  plans: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['create-workout']);
const message = ref('');
const activePlans = computed(() => props.plans.filter((plan) => plan.active));

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

const form = reactive({
  date: todayIso(),
  type: activityTypes[0],
  planId: '',
  duration: 45,
  distance: 0,
  calories: 300,
  intensity: 'Srednia',
  notes: ''
});

function resetForm() {
  message.value = '';
  form.date = todayIso();
  form.type = activityTypes[0];
  form.planId = '';
  form.duration = 45;
  form.distance = 0;
  form.calories = 300;
  form.intensity = 'Srednia';
  form.notes = '';
}

function submit() {
  if (!form.date || Number(form.duration) <= 0) {
    message.value = 'Podaj date oraz dodatni czas treningu.';
    return;
  }

  emit('create-workout', {
    date: form.date,
    type: form.type,
    planId: form.planId,
    duration: Number(form.duration),
    distance: Number(form.distance || 0),
    calories: Number(form.calories || 0),
    intensity: form.intensity,
    notes: form.notes.trim()
  });

  resetForm();
}
</script>

<template>
  <section class="management-layout single-form">
    <article class="panel form-panel">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Dziennik aktywnosci</p>
          <h2>Zapisz wykonany trening</h2>
        </div>
      </div>

      <form class="stack-form" @submit.prevent="submit">
        <div class="form-grid two">
          <label>
            Data
            <input v-model="form.date" type="date" />
          </label>

          <label>
            Typ aktywnosci
            <select v-model="form.type">
              <option v-for="type in activityTypes" :key="type" :value="type">{{ type }}</option>
            </select>
          </label>
        </div>

        <label>
          Powiazany plan
          <select v-model="form.planId">
            <option value="">Bez planu</option>
            <option v-for="plan in activePlans" :key="plan.id" :value="plan.id">{{ plan.name }}</option>
          </select>
        </label>

        <div class="form-grid three">
          <label>
            Czas (min)
            <input v-model.number="form.duration" min="1" type="number" />
          </label>
          <label>
            Dystans (km)
            <input v-model.number="form.distance" min="0" step="0.1" type="number" />
          </label>
          <label>
            Kalorie
            <input v-model.number="form.calories" min="0" type="number" />
          </label>
        </div>

        <label>
          Intensywnosc
          <select v-model="form.intensity">
            <option>Lekka</option>
            <option>Srednia</option>
            <option>Wysoka</option>
          </select>
        </label>

        <label>
          Notatki
          <textarea v-model="form.notes" rows="4" placeholder="Samopoczucie, rekordy, uwagi"></textarea>
        </label>

        <p v-if="message" class="form-error" role="alert">{{ message }}</p>

        <div class="button-row">
          <button class="primary-button compact" type="submit">
            <Save :size="18" />
            Zapisz trening
          </button>
          <button class="ghost-button compact" type="button" @click="resetForm">
            <RotateCcw :size="18" />
            Wyczysc
          </button>
        </div>
      </form>
    </article>
  </section>
</template>
