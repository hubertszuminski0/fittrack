<script setup>
import { computed, reactive, ref } from 'vue';
import { LogIn, Play, UserPlus } from 'lucide-vue-next';

defineProps({
  error: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['auth-submit', 'demo-login']);
const mode = ref('login');
const form = reactive({
  name: '',
  email: '',
  password: ''
});

const submitLabel = computed(() => (mode.value === 'login' ? 'Zaloguj' : 'Utworz konto'));
const SubmitIcon = computed(() => (mode.value === 'login' ? LogIn : UserPlus));

function submit() {
  emit('auth-submit', {
    mode: mode.value,
    name: form.name,
    email: form.email,
    password: form.password
  });
}
</script>

<template>
  <main class="auth-layout">
    <section class="auth-visual" aria-labelledby="fittrack-title">
      <div class="brand-mark">FT</div>
      <div>
        <p class="eyebrow">FitTrack</p>
        <h1 id="fittrack-title">Menedzer treningow i postepow</h1>
        <p class="auth-lead">
          Jeden panel do planow, aktywnosci, celow i statystyk. Dane testowe sa gotowe od razu po
          wejsciu w tryb demo.
        </p>
      </div>
      <div class="phone-preview" aria-hidden="true">
        <div class="preview-topline"></div>
        <div class="preview-card wide"></div>
        <div class="preview-grid">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div class="preview-bars">
          <span style="height: 46%"></span>
          <span style="height: 72%"></span>
          <span style="height: 36%"></span>
          <span style="height: 88%"></span>
          <span style="height: 58%"></span>
        </div>
      </div>
    </section>

    <section class="auth-card" aria-label="Dostep do aplikacji">
      <div class="segmented-control" role="tablist" aria-label="Tryb dostepu">
        <button
          type="button"
          :class="{ active: mode === 'login' }"
          role="tab"
          :aria-selected="mode === 'login'"
          @click="mode = 'login'"
        >
          Logowanie
        </button>
        <button
          type="button"
          :class="{ active: mode === 'register' }"
          role="tab"
          :aria-selected="mode === 'register'"
          @click="mode = 'register'"
        >
          Rejestracja
        </button>
      </div>

      <form class="stack-form" @submit.prevent="submit">
        <label v-if="mode === 'register'">
          Nazwa profilu
          <input v-model.trim="form.name" type="text" autocomplete="name" placeholder="np. Anna" />
        </label>

        <label>
          E-mail
          <input v-model.trim="form.email" type="email" autocomplete="email" placeholder="ty@fittrack.pl" />
        </label>

        <label>
          Haslo
          <input
            v-model="form.password"
            type="password"
            autocomplete="current-password"
            placeholder="minimum 6 znakow"
          />
        </label>

        <p v-if="error" class="form-error" role="alert">{{ error }}</p>

        <button class="primary-button" type="submit">
          <component :is="SubmitIcon" :size="18" />
          {{ submitLabel }}
        </button>

        <button class="ghost-button" type="button" @click="emit('demo-login')">
          <Play :size="18" />
          Otworz demo
        </button>
      </form>
    </section>
  </main>
</template>
