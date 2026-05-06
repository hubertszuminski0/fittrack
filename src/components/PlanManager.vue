<script setup>
import { computed, reactive, ref } from 'vue';
import { Check, Pencil, Power, Save, Trash2, X } from 'lucide-vue-next';
import { activityTypes } from '../data/defaults';

const props = defineProps({
  plans: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['create-plan', 'update-plan', 'delete-plan', 'toggle-plan']);
const days = ['Pon', 'Wt', 'Sro', 'Czw', 'Pia', 'Sob', 'Nd'];
const editingId = ref('');
const message = ref('');

const form = reactive({
  name: '',
  type: activityTypes[0],
  days: ['Pon', 'Sro', 'Pia'],
  duration: 45,
  intensity: 'Srednia',
  exercisesText: ''
});

const activePlans = computed(() => props.plans.filter((plan) => plan.active).length);

function resetForm() {
  editingId.value = '';
  message.value = '';
  form.name = '';
  form.type = activityTypes[0];
  form.days = ['Pon', 'Sro', 'Pia'];
  form.duration = 45;
  form.intensity = 'Srednia';
  form.exercisesText = '';
}

function toggleDay(day) {
  form.days = form.days.includes(day) ? form.days.filter((item) => item !== day) : [...form.days, day];
}

function editPlan(plan) {
  editingId.value = plan.id;
  message.value = '';
  form.name = plan.name;
  form.type = plan.type;
  form.days = [...plan.days];
  form.duration = plan.duration;
  form.intensity = plan.intensity;
  form.exercisesText = (plan.exercises || []).join('\n');
}

function submit() {
  if (!form.name.trim() || !form.days.length) {
    message.value = 'Podaj nazwe planu i wybierz przynajmniej jeden dzien.';
    return;
  }

  const payload = {
    name: form.name.trim(),
    type: form.type,
    days: [...form.days],
    duration: Number(form.duration),
    intensity: form.intensity,
    exercises: form.exercisesText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
  };

  if (editingId.value) {
    emit('update-plan', { ...payload, id: editingId.value });
  } else {
    emit('create-plan', payload);
  }

  resetForm();
}
</script>

<template>
  <section class="management-layout">
    <aside class="panel form-panel">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Plany treningowe</p>
          <h2>{{ editingId ? 'Edycja planu' : 'Nowy plan' }}</h2>
        </div>
        <span class="counter-pill">{{ activePlans }} aktywne</span>
      </div>

      <form class="stack-form" @submit.prevent="submit">
        <label>
          Nazwa planu
          <input v-model.trim="form.name" type="text" placeholder="np. Masa i sila" />
        </label>

        <div class="form-grid two">
          <label>
            Typ aktywnosci
            <select v-model="form.type">
              <option v-for="type in activityTypes" :key="type" :value="type">{{ type }}</option>
            </select>
          </label>

          <label>
            Czas jednostki
            <input v-model.number="form.duration" min="5" type="number" />
          </label>
        </div>

        <label>
          Intensywnosc
          <select v-model="form.intensity">
            <option>Lekka</option>
            <option>Srednia</option>
            <option>Wysoka</option>
            <option>Rosnaca</option>
          </select>
        </label>

        <fieldset>
          <legend>Dni treningowe</legend>
          <div class="day-picker">
            <button
              v-for="day in days"
              :key="day"
              type="button"
              :class="{ active: form.days.includes(day) }"
              @click="toggleDay(day)"
            >
              {{ day }}
            </button>
          </div>
        </fieldset>

        <label>
          Cwiczenia / etapy
          <textarea
            v-model="form.exercisesText"
            rows="5"
            placeholder="Jedna pozycja w kazdej linii"
          ></textarea>
        </label>

        <p v-if="message" class="form-error" role="alert">{{ message }}</p>

        <div class="button-row">
          <button class="primary-button compact" type="submit">
            <Save :size="18" />
            {{ editingId ? 'Zapisz zmiany' : 'Dodaj plan' }}
          </button>
          <button v-if="editingId" class="ghost-button compact" type="button" @click="resetForm">
            <X :size="18" />
            Anuluj
          </button>
        </div>
      </form>
    </aside>

    <section class="records-column" aria-label="Lista planow">
      <article v-for="plan in plans" :key="plan.id" class="record-card">
        <div class="record-main">
          <div>
            <p class="eyebrow">{{ plan.type }} / {{ plan.duration }} min</p>
            <h3>{{ plan.name }}</h3>
          </div>
          <span :class="plan.active ? 'status-pill active' : 'status-pill'">
            {{ plan.active ? 'Aktywny' : 'Pauza' }}
          </span>
        </div>

        <div class="meta-row">
          <span>{{ plan.days.join(', ') }}</span>
          <span>{{ plan.intensity }}</span>
        </div>

        <ul class="clean-list exercise-list">
          <li v-for="exercise in plan.exercises" :key="exercise">
            <Check :size="16" />
            {{ exercise }}
          </li>
        </ul>

        <div class="record-actions">
          <button class="icon-button" type="button" title="Edytuj plan" @click="editPlan(plan)">
            <Pencil :size="18" />
          </button>
          <button class="icon-button" type="button" title="Wlacz lub wstrzymaj" @click="emit('toggle-plan', plan.id)">
            <Power :size="18" />
          </button>
          <button class="icon-button danger" type="button" title="Usun plan" @click="emit('delete-plan', plan.id)">
            <Trash2 :size="18" />
          </button>
        </div>
      </article>
    </section>
  </section>
</template>
