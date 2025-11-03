<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { appointmentService, type Appointment } from '@/services/appointmentService';
import BottomNavigation from '@/components/ui/BottomNavigation.vue';

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(true);
const appointments = ref<Appointment[]>([]);
const selectedDate = ref(new Date());
const dates = ref<Date[]>([]);

// Gera os próximos 7 dias
function generateDates() {
  const today = new Date();
  const datesArray: Date[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    datesArray.push(date);
  }

  dates.value = datesArray;
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0] ?? '';
}

function getDayName(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  if (targetDate.getTime() === today.getTime()) {
    return 'Hoje';
  }

  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  return date.toISOString().split('T')[0] ?? '';
}

function getDayNumber(date: Date): string {
  return date.getDate().toString();
}

function isSelectedDate(date: Date): boolean {
  return formatDate(date) === formatDate(selectedDate.value);
}

async function loadAppointments(date: Date) {
  const barbershopId = authStore.barbershopId;
  if (!barbershopId) return;

  try {
    loading.value = true;
    const response = await appointmentService.list(barbershopId, {
      date: formatDate(date)
    });
    appointments.value = response.data || response;
  } catch (error: any) {
    console.error('Erro ao carregar agendamentos:', error);
  } finally {
    loading.value = false;
  }
}

function selectDate(date: Date) {
  selectedDate.value = date;
  loadAppointments(date);
}

function getStatusClass(statusId: number): string {
  const statusMap: Record<number, string> = {
    1: 'pending',
    2: 'confirmed',
    3: 'completed',
    4: 'cancelled'
  };
  return statusMap[statusId] || 'pending';
}

function getStatusLabel(statusId: number): string {
  const statusMap: Record<number, string> = {
    1: 'Pendente',
    2: 'Confirmado',
    3: 'Concluído',
    4: 'Cancelado'
  };
  return statusMap[statusId] || 'Pendente';
}

function formatTime(datetime: string): string {
  const date = new Date(datetime);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function viewAppointmentDetails(appointmentId: string) {
  router.push({ name: 'AppointmentDetails', params: { id: appointmentId } });
}

function goBack() {
  router.push({ name: 'Dashboard' });
}

onMounted(() => {
  generateDates();
  loadAppointments(selectedDate.value);
});
</script>

<template>
  <div class="appointments-screen">
    <header class="appointments-header">
      <button class="back-btn" @click="goBack">← Voltar</button>
      <h1>Meus Agendamentos</h1>
    </header>

    <main class="appointments-content">
      <!-- Date Selector -->
      <div class="date-selector-scroll">
        <div
            v-for="date in dates"
            :key="date.toISOString()"
            class="date-item"
            :class="{ active: isSelectedDate(date) }"
            @click="selectDate(date)"
        >
          <span class="day-name">{{ getDayName(date) }}</span>
          <span class="day-number">{{ getDayNumber(date) }}</span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Carregando agendamentos...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="appointments.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <p>Nenhum agendamento para esta data</p>
      </div>

      <!-- Appointments List -->
      <div v-else class="daily-appointments-list">
        <div
            v-for="appointment in appointments"
            :key="appointment.id"
            class="appointment-card"
            @click="viewAppointmentDetails(appointment.id)"
        >
          <div class="apt-time">{{ formatTime(appointment.start_time) }}</div>
          <div class="apt-details">
            <p class="apt-name">{{ appointment.client?.name || 'Cliente' }}</p>
            <p class="apt-service">{{ appointment.service?.name || 'Serviço' }}</p>
          </div>
          <div
              class="apt-status"
              :class="getStatusClass(appointment.status_id)"
          >
            {{ getStatusLabel(appointment.status_id) }}
          </div>
        </div>
      </div>
    </main>

    <BottomNavigation />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap');

.appointments-screen {
  min-height: 100vh;
  background-color: var(--color-background-primary);
  padding-bottom: 100px;
}

.appointments-header {
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

.appointments-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
}

.appointments-content {
  padding: 1.5rem;
}

.date-selector-scroll {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  scrollbar-width: none;
}

.date-selector-scroll::-webkit-scrollbar {
  display: none;
}

.date-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  background-color: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 70px;
}

.date-item.active {
  background-image: linear-gradient(to right, var(--color-accent-primary), #047857);
  border-color: var(--color-accent-primary);
  color: var(--color-text-primary);
}

.day-name {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.date-item.active .day-name {
  color: rgba(255, 255, 255, 0.8);
}

.day-number {
  font-size: 1.25rem;
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
  margin-top: 2rem;
}

.empty-state svg {
  margin: 0 auto 1rem;
  color: var(--color-text-secondary);
}

.empty-state p {
  font-size: 1rem;
}

.daily-appointments-list {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.appointment-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: var(--color-background-secondary);
  padding: 1.25rem;
  border-radius: 1rem;
  border-left: 4px solid var(--color-accent-primary);
  cursor: pointer;
  transition: transform 0.2s;
}

.appointment-card:hover {
  transform: translateX(4px);
}

.apt-time {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text-secondary);
  min-width: 60px;
}

.apt-details {
  flex-grow: 1;
}

.apt-name {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 1.125rem;
}

.apt-service {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.apt-status {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  white-space: nowrap;
}

.apt-status.pending {
  background-color: rgba(251, 191, 36, 0.1);
  color: #fbbf24;
}

.apt-status.confirmed {
  background-color: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.apt-status.completed {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.apt-status.cancelled {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}
</style>