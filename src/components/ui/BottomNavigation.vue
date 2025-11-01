<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const isActive = (routeName: string) => {
  return route.name === routeName;
};

function navigateTo(routeName: string) {
  router.push({ name: routeName });
}
</script>

<template>
  <nav class="bottom-nav">
    <div class="bottom-nav-inner">
      <button
          class="nav-item"
          :class="{ active: isActive('Dashboard') }"
          @click="navigateTo('Dashboard')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span>Início</span>
      </button>

      <button
          class="nav-item"
          :class="{ active: isActive('Appointments') }"
          @click="navigateTo('Appointments')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span>Agendas</span>
      </button>

      <button
          class="nav-item"
          :class="{ active: isActive('ClientsList') || isActive('ClientDetails') }"
          @click="navigateTo('ClientsList')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        <span>Clientes</span>
      </button>

      <button
          class="nav-item"
          :class="{ active: isActive('ProviderProfile') }"
          @click="navigateTo('ProviderProfile')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span>Perfil</span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(31, 41, 55, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--color-border);
  z-index: 1000;
  max-width: 800px;
  margin: 0 auto;
}

.bottom-nav-inner {
  display: flex;
  justify-content: space-around;
  padding: 0.75rem 0;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  color: var(--color-text-secondary);
  font-size: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s;
  font-family: 'Sora', sans-serif;
  padding: 0.25rem 0.5rem;
}

.nav-item svg {
  width: 24px;
  height: 24px;
}

.nav-item.active {
  color: var(--color-accent-primary);
  font-weight: 600;
}

.nav-item:hover {
  color: var(--color-text-primary);
}
</style>