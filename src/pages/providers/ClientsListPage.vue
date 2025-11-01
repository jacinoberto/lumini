<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { clientService, type Client } from '@/services/clientService';
import BottomNavigation from '@/components/ui/BottomNavigation.vue';

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(true);
const clients = ref<Client[]>([]);
const searchQuery = ref('');

const filteredClients = computed(() => {
  if (!searchQuery.value) return clients.value;

  const query = searchQuery.value.toLowerCase();
  return clients.value.filter(client =>
      client.name.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query)
  );
});

async function loadClients() {
  const barbershopId = authStore.barbershopId;
  if (!barbershopId) return;

  try {
    loading.value = true;
    const response = await clientService.list(barbershopId);
    clients.value = response.data || response;
  } catch (error: any) {
    console.error('Erro ao carregar clientes:', error);
  } finally {
    loading.value = false;
  }
}

function getInitials(name: string): string {
  const names = name.split(' ');
  if (names.length >= 2) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
}

function viewClientDetails(clientId: string) {
  router.push({ name: 'ClientDetails', params: { clientId } });
}

function goBack() {
  router.push({ name: 'Dashboard' });
}

onMounted(() => {
  loadClients();
});
</script>

<template>
  <div class="clients-screen">
    <header class="clients-header">
      <button class="back-btn" @click="goBack">← Voltar</button>
      <h1>Meus Clientes</h1>
    </header>

    <main class="clients-content">
      <!-- Search Bar -->
      <div class="search-bar-container">
        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
            type="text"
            placeholder="Buscar cliente pelo nome..."
            v-model="searchQuery"
        >
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Carregando clientes...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredClients.length === 0 && !searchQuery" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        <p>Nenhum cliente cadastrado ainda</p>
      </div>

      <!-- No Results -->
      <div v-else-if="filteredClients.length === 0" class="empty-state">
        <p>Nenhum cliente encontrado com "{{ searchQuery }}"</p>
      </div>

      <!-- Client List -->
      <div v-else class="client-list">
        <button
            v-for="client in filteredClients"
            :key="client.id"
            class="client-card"
            @click="viewClientDetails(client.id)"
        >
          <div class="client-avatar">{{ getInitials(client.name) }}</div>
          <div class="client-info">
            <p class="name">{{ client.name }}</p>
            <p class="summary">
              {{ client.total_appointments || 0 }} agendamento{{ client.total_appointments !== 1 ? 's' : '' }}
              <template v-if="client.created_at">
                • Cliente desde {{ formatDate(client.created_at) }}
              </template>
            </p>
          </div>
          <div class="client-chevron">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </button>
      </div>
    </main>

    <BottomNavigation />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap');

.clients-screen {
  min-height: 100vh;
  background-color: var(--color-background-primary);
  padding-bottom: 100px;
}

.clients-header {
  padding: 3rem 1.5rem 1.5rem;
  background-color: var(--color-background-secondary);
  border-bottom: 1px solid var(--color-border);
}

.back-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-weight: 600;
  margin-bottom: 1rem;
  cursor: pointer;
  font-size: 1rem;
  font-family: 'Sora', sans-serif;
}

.back-btn:hover {
  color: var(--color-accent-primary);
}

.clients-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
}

.clients-content {
  padding: 1.5rem;
}

.search-bar-container {
  position: relative;
  margin-bottom: 2rem;
}

.search-bar-container .search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
}

.search-bar-container input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background-color: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  color: var(--color-text-primary);
  font-size: 1rem;
  font-family: 'Sora', sans-serif;
}

.search-bar-container input:focus {
  outline: none;
  border-color: var(--color-accent-primary);
}

.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  color: var(--color-text-secondary);
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--color-border);
  border-top-color: var(--color-accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 3rem 1.5rem;
  color: var(--color-text-secondary);
}

.empty-state svg {
  margin: 0 auto 1rem;
  color: var(--color-text-secondary);
}

.empty-state p {
  font-size: 1rem;
}

.client-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.client-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--color-background-secondary);
  border-radius: 1rem;
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  transition: background-color 0.3s ease, transform 0.2s;
  cursor: pointer;
  width: 100%;
  text-align: left;
  font-family: 'Sora', sans-serif;
}

.client-card:hover {
  background-color: var(--color-border);
  transform: translateX(4px);
}

.client-avatar {
  width: 48px;
  height: 48px;
  min-width: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-accent-primary), #047857);
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  color: var(--color-text-primary);
}

.client-info {
  flex-grow: 1;
}

.client-info .name {
  font-weight: 600;
  font-size: 1rem;
}

.client-info .summary {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-top: 0.25rem;
}

.client-chevron {
  color: var(--color-text-secondary);
}
</style>