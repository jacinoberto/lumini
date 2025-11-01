<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { barberService, type Barber } from '@/services/barberService';
import ButtomNavigation from '@/components/ui/BottomNavigation.vue';

const router = useRouter();
const authStore = useAuthStore();

const barbers = ref<Barber[]>([]);
const loading = ref(true);
const showOptions = ref<string | null>(null);

async function loadBarbers() {
  const barbershopId = authStore.barbershopId;

  if (!barbershopId) {
    console.error('Barbershop ID não encontrado');
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    const response = await barberService.list(barbershopId);
    barbers.value = response.data || response;
  } catch (error: any) {
    console.error('Erro ao carregar barbeiros:', error);
    alert('Erro ao carregar equipe');
  } finally {
    loading.value = false;
  }
}

function goBack() {
  router.push({ name: 'Dashboard' });
}

function addBarber() {
  router.push({ name: 'AddTeamMember' });
}

function editBarber(barber: Barber) {
  router.push({
    name: 'EditTeamMember',
    params: { memberId: barber.id },
    state: { barber }
  });
}

async function deleteBarber(barber: Barber) {
  const confirmed = confirm(`Tem certeza que deseja excluir "${barber.name}" da equipe?`);
  if (!confirmed) return;

  const barbershopId = authStore.barbershopId;
  if (!barbershopId) return;

  try {
    await barberService.delete(barbershopId, barber.id);
    barbers.value = barbers.value.filter(b => b.id !== barber.id);
  } catch (error: any) {
    console.error('Erro ao excluir barbeiro:', error);
    alert(error.response?.data?.message || 'Erro ao excluir barbeiro');
  }
}

function toggleOptions(barberId: string) {
  showOptions.value = showOptions.value === barberId ? null : barberId;
}

function getImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  return url;
}

onMounted(() => {
  loadBarbers();
});
</script>

<template>
  <div class="team-management-screen">
    <header class="team-header">
      <button class="back-btn" @click="goBack">← Voltar</button>
      <h1>Gerenciar Equipe</h1>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando equipe...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="barbers.length === 0" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
      <p>Nenhum profissional cadastrado ainda</p>
      <button class="btn-primary" @click="addBarber">Adicionar Primeiro Profissional</button>
    </div>

    <!-- Team List -->
    <main v-else class="team-content">
      <div class="team-list">
        <div
            v-for="barber in barbers"
            :key="barber.id"
            class="barber-card"
        >
          <div
              class="barber-avatar"
              :style="barber.profile_image_url ? `background-image: url('${getImageUrl(barber.profile_image_url)}')` : ''"
          >
            <svg v-if="!barber.profile_image_url" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>

          <div class="barber-info">
            <p class="name">{{ barber.name }}</p>
            <p class="specialties">{{ barber.specialties || 'Especialidades não informadas' }}</p>

            <div class="barber-stats">
              <div class="stat-item">
                <svg class="star-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span class="value">{{ barber.rating_average || '0.0' }}</span>
              </div>

              <div class="stat-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="6" cy="6" r="3"></circle>
                  <circle cx="6" cy="18" r="3"></circle>
                  <line x1="20" y1="4" x2="8.12" y2="15.88"></line>
                  <line x1="14.47" y1="14.48" x2="20" y2="20"></line>
                  <line x1="8.12" y1="8.12" x2="12" y2="12"></line>
                </svg>
                <span class="value">{{ barber.rating_count || 0 }}</span>
                <span>cortes</span>
              </div>
            </div>
          </div>

          <div class="options-container">
            <button class="options-btn" @click="toggleOptions(barber.id)">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
              </svg>
            </button>

            <div v-if="showOptions === barber.id" class="options-menu">
              <button @click="editBarber(barber)">Editar</button>
              <button @click="deleteBarber(barber)" class="delete-option">Excluir</button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Floating Action Button -->
    <button class="fab" @click="addBarber">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </button>

    <ButtomNavigation />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap');

.team-management-screen {
  min-height: 100vh;
  background-color: var(--color-background-primary);
  padding-bottom: 100px;
}

.team-header {
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

.team-header h1 {
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

.team-content {
  padding: 1.5rem;
}

.team-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.barber-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  background-color: var(--color-background-secondary);
  border-radius: 1rem;
  border: 1px solid var(--color-border);
  transition: transform 0.2s;
}

.barber-card:hover {
  transform: translateX(4px);
}

.barber-avatar {
  width: 60px;
  height: 60px;
  min-width: 60px;
  border-radius: 50%;
  background-color: var(--color-border);
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--color-text-secondary);
}

.barber-info {
  flex-grow: 1;
}

.barber-info .name {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.barber-info .specialties {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-top: 0.25rem;
  margin-bottom: 0.75rem;
}

.barber-stats {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  font-weight: 600;
}

.stat-item svg {
  width: 16px;
  height: 16px;
}

.stat-item .star-icon {
  color: #D97706;
}

.stat-item .value {
  color: var(--color-text-primary);
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
  margin-top: -0.5rem;
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