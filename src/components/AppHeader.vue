<script setup>
import { LogOut } from 'lucide-vue-next';

defineProps({
  user: {
    type: Object,
    required: true
  },
  tabs: {
    type: Array,
    required: true
  },
  activeTab: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['select-tab', 'logout']);
</script>

<template>
  <header class="app-header">
    <div class="header-brand" aria-label="FitTrack">
      <span class="brand-mark small">FT</span>
      <div>
        <p>FitTrack</p>
        <span>{{ user.name }}</span>
      </div>
    </div>

    <nav class="tab-nav" aria-label="Nawigacja aplikacji">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        :class="{ active: activeTab === tab.id }"
        :aria-current="activeTab === tab.id ? 'page' : undefined"
        @click="emit('select-tab', tab.id)"
      >
        <component :is="tab.icon" :size="18" />
        <span>{{ tab.label }}</span>
      </button>
    </nav>

    <button class="icon-text-button" type="button" title="Wyloguj" @click="emit('logout')">
      <LogOut :size="18" />
      <span>Wyloguj</span>
    </button>
  </header>
</template>
