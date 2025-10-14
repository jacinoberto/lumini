<script lang="ts">
import { defineComponent } from 'vue';
import BaseSearchBar from '@/components/base/BaseSearchBar.vue';

export default defineComponent({
  name: 'ClientHeader',
  components: { BaseSearchBar },
  props: {
    userName: { type: String, default: 'Cliente' },
  },
  data() {
    return {
      searchQuery: '',
    };
  },
});
</script>

<template>
  <header class="home-header">
    <div class="header-top">
      <div>
        <p class="greeting">Olá 👋</p>
        <h1 class="user-name">{{ userName }}</h1>
      </div>
      <div class="header-actions">
        <button class="header-btn">
          <vue-feather type="bell" size="22"></vue-feather>
        </button>
        <button class="header-btn">
          <vue-feather type="user" size="22"></vue-feather>
        </button>
      </div>
    </div>
    <BaseSearchBar
        v-model="searchQuery"
        placeholder="Buscar barbearias..."
    />
  </header>
</template>

<style scoped>
/* Estilos extraídos do home-cliente.html */
.home-header { padding: 3rem 1.5rem 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; background-image: linear-gradient(to right, var(--color-accent-primary), var(--color-accent-primary-dark, #047857)); border-radius: 0 0 1.5rem 1.5rem;  }
.header-top { display: flex; justify-content: space-between; align-items: center; }
.greeting { color: var(--color-text-secondary); }
.user-name { font-size: 1.75rem; font-weight: 700; margin-top: 0.25rem; }
.header-actions { display: flex; gap: 0.75rem; }
.header-btn { background: none; border: none; color: var(--color-text-primary); cursor: pointer; }
</style>