<script lang="ts">
import { defineComponent } from 'vue';
// Você pode usar o BaseAvatar que criamos anteriormente!
// import BaseAvatar from '@/components/base/BaseAvatar.vue';

export default defineComponent({
  name: 'BarberHeader',
  // components: { BaseAvatar },
  props: {
    shopName: { type: String, default: 'Sua Barbearia' },
  },
});
</script>

<template>
  <header class="dashboard-header">
    <div class="user-info">
      <div class="user-avatar">
        <vue-feather type="user" size="24"></vue-feather>
      </div>
      <div>
        <p class="welcome-text">Bem-vindo</p>
        <h1 class="shop-name">{{ shopName }}</h1>
      </div>
    </div>
    <button class="notification-btn">
      <vue-feather type="bell" size="24"></vue-feather>
    </button>
  </header>
</template>

<style scoped>
/* Estilos extraídos do deashboardBarber.html */
.dashboard-header { background-image: linear-gradient(to right, var(--color-accent-primary), var(--color-accent-primary-dark, #047857)); padding: 1.5rem; padding-top: 32px; border-radius: 0 0 1.5rem 1.5rem; display: flex; justify-content: space-between; align-items: center; color: var(--text-primary); }
.user-info { display: flex; align-items: center; gap: 0.75rem; }
.user-avatar { width: 48px; height: 48px; background-color: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 50%; display: flex; justify-content: center; align-items: center; }
.welcome-text { font-size: 0.875rem; opacity: 0.8; }
.shop-name { font-size: 1.25rem; font-weight: 700; }
.notification-btn { background-color: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 50%; width: 40px; height: 40px; color: var(--text-primary); cursor: pointer; display: inline-flex; justify-content: center; align-items: center; }
</style>