<template>
  <div class="screen-container">
    <!-- Header -->
    <header class="page-header">
      <h1>Meus Agendamentos</h1>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando...</p>
    </div>

    <!-- Main Content -->
    <main v-else class="page-content">
      <!-- Upcoming Appointments -->
      <section class="content-section" v-if="upcomingAppointments.length > 0">
        <h2>Próximos</h2>
        <div class="appointments-list">
          <div
              v-for="appointment in upcomingAppointments"
              :key="appointment.id"
              class="appointment-card upcoming"
          >
            <div class="card-header">
              <p class="shop-name">{{ appointment.barbershop?.name }}</p>
              <p class="date">{{ formatAppointmentDate(appointment.start_time) }}</p>
            </div>
            <div class="card-body">
              <div class="detail-item">
                <span class="label">Serviço:</span>
                <span class="value">{{ appointment.service?.name }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Profissional:</span>
                <span class="value">{{ appointment.barber?.name }}</span>
              </div>
              <div class="detail-item" v-if="appointment.service?.price">
                <span class="label">Valor:</span>
                <span class="value">R$ {{ formatPrice(appointment.service.price) }}</span>
              </div>
            </div>
            <div class="card-footer">
              <button
                  class="btn btn-danger-outline"
                  @click="confirmCancel(appointment)"
                  :disabled="cancelling === appointment.id"
              >
                {{ cancelling === appointment.id ? 'Cancelando...' : 'Cancelar Agendamento' }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Empty State for Upcoming -->
      <section class="content-section" v-else>
        <h2>Próximos</h2>
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <p>Você não tem agendamentos futuros</p>
          <button class="btn btn-primary" @click="goToDashboard" style="max-width: 200px; margin-top: 1rem;">
            Agendar Agora
          </button>
        </div>
      </section>

      <!-- Past Appointments -->
      <section class="content-section" v-if="pastAppointments.length > 0">
        <h2>Histórico</h2>
        <div class="appointments-list">
          <div
              v-for="appointment in pastAppointments"
              :key="appointment.id"
              class="appointment-card"
          >
            <div class="card-header">
              <p class="shop-name">{{ appointment.barbershop?.name }}</p>
              <p class="date">{{ formatPastDate(appointment.start_time) }}</p>
            </div>
            <div class="card-body">
              <div class="detail-item">
                <span class="label">Serviço:</span>
                <span class="value">{{ appointment.service?.name }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Profissional:</span>
                <span class="value">{{ appointment.barber?.name }}</span>
              </div>
            </div>
            <div class="card-footer">
              <button
                  class="btn btn-primary"
                  style="flex: 2;"
                  @click="bookAgain(appointment)"
              >
                Agendar Novamente
              </button>
              <button
                  class="btn btn-accent-outline"
                  style="flex: 1;"
                  @click="leaveReview(appointment)"
                  v-if="!appointment.has_review"
              >
                Deixar Avaliação
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav">
      <div class="bottom-nav-inner">
        <router-link to="/client/dashboard" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>Início</span>
        </router-link>

        <router-link to="/client/appointments" class="nav-item active">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>Agendas</span>
        </router-link>

        <router-link to="/client/favorites" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
          </svg>
          <span>Favoritos</span>
        </router-link>

        <router-link to="/client/profile" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>Perfil</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { appointmentService } from '@/services/appointmentService';

const router = useRouter();

const appointments = ref<any[]>([]);
const loading = ref(true);
const cancelling = ref<string | null>(null);

const upcomingAppointments = computed(() => {
  const now = new Date();
  return appointments.value.filter(apt => {
    const startTime = new Date(apt.start_time);
    return startTime >= now && apt.status_id !== 4; // 4 = CANCELLED
  });
});

const pastAppointments = computed(() => {
  const now = new Date();
  return appointments.value.filter(apt => {
    const startTime = new Date(apt.start_time);
    return startTime < now || apt.status_id === 3; // 3 = COMPLETED
  });
});

async function loadAppointments() {
  try {
    loading.value = true;
    const response = await appointmentService.list();
    appointments.value = response.data;
  } catch (err: any) {
    console.error('Erro ao carregar agendamentos:', err);
    alert(err.response?.data?.message || 'Erro ao carregar agendamentos');
  } finally {
    loading.value = false;
  }
}

async function confirmCancel(appointment: any) {
  const confirmed = confirm(
      `Tem certeza que deseja cancelar o agendamento em ${appointment.barbershop?.name}?`
  );

  if (!confirmed) return;

  try {
    cancelling.value = appointment.id;
    await appointmentService.cancel(appointment.id);

    // Remove da lista ou atualiza status
    appointments.value = appointments.value.filter(apt => apt.id !== appointment.id);

    alert('Agendamento cancelado com sucesso!');
  } catch (err: any) {
    alert(err.response?.data?.message || 'Erro ao cancelar agendamento');
  } finally {
    cancelling.value = null;
  }
}

function bookAgain(appointment: any) {
  router.push({
    name: 'BarbershopBooking',
    params: { id: appointment.barbershop_id }
  });
}

function leaveReview(appointment: any) {
  // Implementar modal de avaliação ou navegar para página
  alert('Funcionalidade de avaliação em desenvolvimento');
}

function goToDashboard() {
  router.push({ name: 'ClientDashboard' });
}

function formatAppointmentDate(dateTime: string): string {
  const date = new Date(dateTime);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const timeStr = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Verifica se é hoje
  if (date.toDateString() === now.toDateString()) {
    return `Hoje, às ${timeStr}`;
  }

  // Verifica se é amanhã
  if (date.toDateString() === tomorrow.toDateString()) {
    return `Amanhã, às ${timeStr}`;
  }

  // Data completa
  const dateStr = date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return `${dateStr}, às ${timeStr}`;
}

function formatPastDate(dateTime: string): string {
  const date = new Date(dateTime);
  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function formatPrice(price: number | string | undefined): string {
  if (price === undefined || price === null) return '0';
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return '0';
  return numPrice.toFixed(0);
}

onMounted(() => {
  loadAppointments();
});
</script>

<style scoped>
.screen-container {
  padding-bottom: 100px;
}

.page-header {
  padding: 3rem 1.5rem 1.5rem;
  background-color: var(--color-background-secondary);
}

.page-header h1 {
  font-size: 1.75rem;
  font-weight: var(--font-weight-bold);
}

.page-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.content-section h2 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-bold);
}

.appointments-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.appointment-card {
  background-color: var(--color-background-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.appointment-card.upcoming {
  border-left: 4px solid var(--color-accent-primary);
}

.card-header {
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.card-header .shop-name {
  font-weight: var(--font-weight-bold);
  font-size: 1.125rem;
}

.card-header .date {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.card-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
}

.detail-item .label {
  color: var(--color-text-secondary);
}

.detail-item .value {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-semibold);
}

.card-footer {
  padding: 1rem;
  background-color: var(--color-background-primary);
  display: flex;
  gap: 0.75rem;
}

.btn {
  display: inline-block;
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: var(--font-weight-bold);
  text-align: center;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-image: linear-gradient(to right, var(--color-accent-primary), #047857);
  color: var(--color-text-primary);
}

.btn-danger-outline {
  background-color: transparent;
  border: 2px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.btn-danger-outline:hover:not(:disabled) {
  background-color: rgba(239, 68, 68, 0.1);
}

.btn-accent-outline {
  background-color: transparent;
  border: 2px solid rgba(217, 119, 6, 0.3);
  color: var(--color-accent-secondary);
}

.btn-accent-outline:hover {
  background-color: rgba(217, 119, 6, 0.1);
}

.loading-container {
  padding: 3rem 1.5rem;
  text-align: center;
  color: var(--color-text-secondary);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-accent-primary);
  border-radius: var(--radius-full);
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
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
  margin-bottom: 0.5rem;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(31, 41, 55, 0.8);
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--color-border);
  z-index: 1000;
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
  text-decoration: none;
  font-size: 0.75rem;
  font-weight: var(--font-weight-medium);
  transition: color 0.3s ease;
}

.nav-item svg {
  width: 24px;
  height: 24px;
}

.nav-item.active,
.nav-item:hover {
  color: var(--color-accent-primary);
  font-weight: var(--font-weight-semibold);
}
</style>