<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { serviceService, type Service } from '@/services/serviceService';
import BottomNavigation from '@/components/ui/BottomNavigation.vue';

const router = useRouter();
const authStore = useAuthStore();

const services = ref<Service[]>([]);
const loading = ref(true);
const showOptions = ref<string | null>(null);

async function loadServices() {
  const barbershopId = authStore.barbershopId;

  if (!barbershopId) {
    console.error('Barbershop ID não encontrado');
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    const response = await serviceService.list(barbershopId);
    services.value = response.data || response;
  } catch (error: any) {
    console.error('Erro ao carregar serviços:', error);
    alert('Erro ao carregar serviços');
  } finally {
    loading.value = false;
  }
}

function goBack() {
  router.push({ name: 'Dashboard' });
}

function addService() {
  router.push({ name: 'AddService' });
}

function editService(service: Service) {
  router.push({
    name: 'EditService',
    params: { id: service.id },
    state: { service }
  });
}

async function deleteService(service: Service) {
  const confirmed = confirm(`Tem certeza que deseja excluir "${service.name}"?`);
  if (!confirmed) return;

  const barbershopId = authStore.barbershopId;
  if (!barbershopId) return;

  try {
    await serviceService.delete(barbershopId, service.id);
    services.value = services.value.filter(s => s.id !== service.id);
  } catch (error: any) {
    console.error('Erro ao excluir serviço:', error);
    alert(error.response?.data?.message || 'Erro ao excluir serviço');
  }
}

function toggleOptions(serviceId: string) {
  showOptions.value = showOptions.value === serviceId ? null : serviceId;
}

function formatPrice(price: number): string {
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

onMounted(() => {
  loadServices();
});
</script>

<template>
  <div class="services-screen">
    <header class="services-header">
      <button class="back-btn" @click="goBack">← Voltar</button>
      <h1>Meus Serviços</h1>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando serviços...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="services.length === 0" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="6" cy="6" r="3"></circle>
        <circle cx="6" cy="18" r="3"></circle>
        <line x1="20" y1="4" x2="8.12" y2="15.88"></line>
        <line x1="14.47" y1="14.48" x2="20" y2="20"></line>
        <line x1="8.12" y1="8.12" x2="12" y2="12"></line>
      </svg>
      <p>Nenhum serviço cadastrado ainda</p>
      <button class="btn-primary" @click="addService">Adicionar Primeiro Serviço</button>
    </div>

    <!-- Services List -->
    <main v-else class="services-content">
      <div class="services-list">
        <div
            v-for="service in services"
            :key="service.id"
            class="service-card"
        >
          <div class="service-info">
            <h3 class="service-name">{{ service.name }}</h3>
            <p class="service-duration">{{ service.duration_minutes }} min</p>
          </div>
          <div class="service-actions">
            <span class="service-price">{{ formatPrice(service.price) }}</span>
            <div class="options-container">
              <button class="options-btn" @click="toggleOptions(service.id)">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="5" r="1"></circle>
                  <circle cx="12" cy="19" r="1"></circle>
                </svg>
              </button>

              <div v-if="showOptions === service.id" class="options-menu">
                <button @click="editService(service)">Editar</button>
                <button @click="deleteService(service)" class="delete-option">Excluir</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Floating Action Button -->
    <button class="fab" @click="addService">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </button>

    <BottomNavigation />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap');

.services-screen {
  min-height: 100vh;
  background-color: var(--color-background-primary);
  padding-bottom: 100px;
}

.services-header {
  padding: 3rem 1.5rem 1.5rem;
  background-color: var(--color-background-secondary);
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

.services-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
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
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.btn-primary {
  background-image: linear-gradient(to right, var(--color-accent-primary), #047857);
  color: var(--color-text-primary);
  padding: 1rem 2rem;
  border-radius: 1rem;
  border: none;
  font-weight: 700;
  cursor: pointer;
  font-family: 'Sora', sans-serif;
}

.services-content {
  padding: 1.5rem;
}

.services-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.service-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  background-color: var(--color-background-secondary);
  border-radius: 1rem;
  border: 1px solid var(--color-border);
  transition: transform 0.2s;
}

.service-card:hover {
  transform: translateX(4px);
}

.service-info {
  flex: 1;
}

.service-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 0.25rem;
}

.service-duration {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.service-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.service-price {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-accent-primary);
}

.options-container {
  position: relative;
}

.options-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0.5rem;
}

.options-btn:hover {
  color: var(--color-text-primary);
}

.options-menu {
  position: absolute;
  right: 0;
  top: 100%;
  background-color: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  overflow: hidden;
  z-index: 10;
  min-width: 120px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.options-menu button {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: var(--color-text-primary);
  text-align: left;
  cursor: pointer;
  font-family: 'Sora', sans-serif;
  font-weight: 600;
  transition: background-color 0.2s;
}

.options-menu button:hover {
  background-color: var(--color-border);
}

.options-menu button.delete-option {
  color: #ef4444;
}

.fab {
  position: fixed;
  bottom: 120px;
  right: 2rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-image: linear-gradient(to right, var(--color-accent-primary), #047857);
  border: none;
  color: var(--color-text-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.2s ease;
  z-index: 100;
}

.fab:hover {
  transform: scale(1.1);
}

.fab:active {
  transform: scale(0.95);
}
</style>