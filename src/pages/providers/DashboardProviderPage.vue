<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { dashboardService, type DashboardStats, type TodayAppointment } from '@/services/dashboardService';
import BottomNavigation from '@/components/ui/BottomNavigation.vue';

const router = useRouter();
const authStore = useAuthStore();

const stats = ref<DashboardStats>({
  today_appointments: 0,
  monthly_revenue: 0,
  average_rating: 0,
  rating_count: 0 // ADICIONAR
});

const todayAppointments = ref<TodayAppointment[]>([]);
const loading = ref(true);

async function loadDashboardData() {
  const barbershopId = authStore.barbershopId;
  if (!barbershopId) {
    loading.value = false;
    return;
  }

  try {
    loading.value = true;

    // Carrega estatísticas
    const statsResponse = await dashboardService.getStats(barbershopId);
    const statsData = statsResponse.data || statsResponse;

    console.log('Stats recebidas:', statsData);

    stats.value = {
      today_appointments: Number(statsData.today_appointments) || 0,
      monthly_revenue: Number(statsData.monthly_revenue) || 0,
      average_rating: Number(statsData.average_rating) || 0,
      rating_count: Number(statsData.rating_count) || 0 // ADICIONAR
    };

    // Carrega agendamentos de hoje
    const appointmentsResponse = await dashboardService.getTodayAppointments(barbershopId);
    todayAppointments.value = appointmentsResponse.data || appointmentsResponse;
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error);
  } finally {
    loading.value = false;
  }
}

function getInitials(name: string): string {
  // 1. Guarda de segurança
  if (!name || typeof name !== 'string') {
    return '';
  }

  // 2. Limpa e filtra
  const names = name.trim().split(/\s+/).filter(Boolean);

  // 3. Se tivermos 2 ou mais nomes
  if (names.length >= 2) {
    // Adicionamos '!' para garantir ao TS que names[0] e names[1] existem
    return `${names[0]![0]}${names[1]![0]}`.toUpperCase();
  }

  // 4. Se tiver apenas 1 nome
  if (names.length === 1) {
    // Adicionamos '!' para garantir ao TS que names[0] existe
    return names[0]!.substring(0, 2).toUpperCase();
  }

  // 5. Se não houver nome
  return '';
}

function formatCurrency(value: number | undefined | null): string {
  const numValue = Number(value) || 0;
  return numValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatRating(value: number | undefined | null): string {
  const numValue = Number(value) || 0;
  return numValue.toFixed(1);
}

function navigateTo(routeName: string) {
  router.push({ name: routeName });
}

function viewAllAppointments() {
  router.push({ name: 'Appointments' });
}

onMounted(() => {
  loadDashboardData();
});
</script>

<template>
  <div class="dashboard-screen">
    <!-- Header -->
    <header class="dashboard-header">
      <div class="header-content">
        <div class="user-avatar">
          <span>{{ getInitials(authStore.user?.barbershop?.name || authStore.user?.name || 'SL') }}</span>
        </div>
        <div class="header-text">
          <p class="greeting">Bem-vindo</p>
          <h1 class="user-name">{{ authStore.user?.barbershop?.name || authStore.user?.name || 'Studio Lumini' }}</h1>
        </div>
      </div>
      <button class="notification-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
      </button>
    </header>

    <main class="dashboard-content">
      <!-- Stats Cards -->
      <section class="stats-section">
        <div class="stat-card">
          <p class="stat-label">Hoje</p>
          <p class="stat-value">{{ loading ? '...' : stats.today_appointments }}</p>
          <p class="stat-description">agendamentos</p>
        </div>

        <div class="stat-card">
          <p class="stat-label">Receita</p>
          <p class="stat-value">{{ loading ? '...' : formatCurrency(stats.monthly_revenue) }}</p>
          <p class="stat-description">este mês</p>
        </div>

        <div class="stat-card">
          <p class="stat-label">Avaliação</p>
          <div class="rating-display">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" class="star-icon">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <p class="stat-value">{{ loading ? '...' : formatRating(stats.average_rating) }}</p>
          </div>
          <p class="stat-description">{{ stats.rating_count }} avaliações</p>
        </div>
      </section>

      <!-- Quick Actions -->
      <section class="quick-actions">
        <button class="action-btn" @click="navigateTo('Appointments')">
          <div class="action-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <span>Agendamentos</span>
        </button>

        <button class="action-btn" @click="navigateTo('WorkingHours')">
          <div class="action-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <span>Meus Horários</span>
        </button>

        <button class="action-btn" @click="navigateTo('Services')">
          <div class="action-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="6" cy="6" r="3"></circle>
              <circle cx="6" cy="18" r="3"></circle>
              <line x1="20" y1="4" x2="8.12" y2="15.88"></line>
              <line x1="14.47" y1="14.48" x2="20" y2="20"></line>
              <line x1="8.12" y1="8.12" x2="12" y2="12"></line>
            </svg>
          </div>
          <span>Serviços</span>
        </button>

        <button class="action-btn" @click="navigateTo('ManageTeam')">
          <div class="action-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <span>Equipe</span>
        </button>
      </section>

      <!-- Today's Appointments -->
      <section class="today-section">
        <div class="section-header">
          <h2>Hoje</h2>
          <button class="view-all-btn" @click="viewAllAppointments">Ver todos</button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="todayAppointments.length === 0" class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <p>Nenhum agendamento para hoje</p>
        </div>

        <!-- Appointments List -->
        <div v-else class="appointments-list">
          <div
              v-for="appointment in todayAppointments"
              :key="appointment.id"
              class="appointment-item"
          >
            <div class="appointment-time">{{ appointment.time }}</div>
            <div class="appointment-avatar">
              {{ getInitials(appointment.client_name) }}
            </div>
            <div class="appointment-info">
              <p class="client-name">{{ appointment.client_name }}</p>
              <p class="service-name">{{ appointment.service_name }}</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <BottomNavigation />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap');

.dashboard-screen {
  min-height: 100vh;
  background-color: var(--color-background-primary);
  padding-bottom: 100px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 1.5rem;
  background: linear-gradient(135deg, var(--color-accent-primary), #047857);
  border-radius: 0 0 1.5rem 1.5rem;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-primary);
  font-weight: 700;
  font-size: 1.125rem;
}

.header-text .greeting {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
}

.header-text .user-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-top: 0.25rem;
}

.notification-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: var(--color-text-primary);
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 50%;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.dashboard-content {
  padding: 1.5rem;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: var(--color-background-secondary);
  padding: 1.25rem 1rem;
  border-radius: 1rem;
  border: 1px solid var(--color-border);
  text-align: center;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  font-weight: 600;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0.5rem 0;
}

.stat-description {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 1rem;
  background-color: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  color: var(--color-text-primary);
  font-family: 'Sora', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  background-color: var(--color-border);
  transform: translateY(-2px);
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-accent-primary), #047857);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-primary);
}

.action-icon svg {
  width: 24px;
  height: 24px;
}

.today-section {
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
}

.view-all-btn {
  background: none;
  border: none;
  color: var(--color-accent-primary);
  font-weight: 600;
  cursor: pointer;
  font-family: 'Sora', sans-serif;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-border);
  border-top-color: var(--color-accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 3rem 1.5rem;
  color: var(--color-text-secondary);
  background-color: var(--color-background-secondary);
  border-radius: 1rem;
  border: 1px solid var(--color-border);
}

.empty-state svg {
  margin: 0 auto 1rem;
}

.empty-state p {
  font-size: 1rem;
}

.appointments-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.appointment-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--color-background-secondary);
  border-radius: 1rem;
  border: 1px solid var(--color-border);
  border-left: 4px solid var(--color-accent-primary);
}

.appointment-time {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-accent-primary);
  min-width: 50px;
}

.appointment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-accent-primary), #047857);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--color-text-primary);
}

.appointment-info {
  flex: 1;
}

.client-name {
  font-weight: 600;
  color: var(--color-text-primary);
}

.service-name {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-top: 0.25rem;
}

.rating-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  margin: 0.5rem 0;
}

.star-icon {
  color: #FFA500;
}
</style>