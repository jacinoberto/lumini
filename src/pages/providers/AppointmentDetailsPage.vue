<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { appointmentService, type Appointment } from '@/services/appointmentService';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const appointmentId = computed(() => route.params.id as string);

const loading = ref(true);
const updating = ref(false);
const appointment = ref<Appointment | null>(null);

async function loadAppointment() {
  const barbershopId = authStore.barbershopId;
  if (!barbershopId) return;

  try {
    loading.value = true;
    const response = await appointmentService.getById(barbershopId, appointmentId.value);
    appointment.value = response.data || response;
  } catch (error: any) {
    console.error('Erro ao carregar agendamento:', error);
    alert('Erro ao carregar agendamento');
    router.push({ name: 'Appointments' });
  } finally {
    loading.value = false;
  }
}

function getClientInitials(name: string): string {
  // 1. Garante que temos um nome e removemos espaços extras
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return '';
  }

  // 2. Limpa o nome e filtra palavras vazias
  const words = name.trim().split(/\s+/).filter(Boolean);

  // 3. Pega a primeira palavra (se existir)
  const firstWord = words[0];
  // 4. Pega a última palavra (se houver mais de uma)
  const lastWord = words.length > 1 ? words[words.length - 1] : undefined;

  // 5. Agora, com variáveis seguras, montamos as iniciais

  if (firstWord && lastWord) {
    // Caso com 2 ou mais nomes (ex: "Jonas Silva" -> "JS")
    return `${firstWord[0]}${lastWord[0]}`.toUpperCase();
  }

  if (firstWord) {
    // Caso com 1 nome (ex: "Jonas" -> "JO")
    return firstWord.substring(0, 2).toUpperCase();
  }

  // Caso não haja nenhuma palavra válida (ex: name era " ")
  return '';
}

function formatDateTime(datetime: string): string {
  const date = new Date(datetime);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

function formatTime(datetime: string): string {
  const date = new Date(datetime);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function formatPrice(price: number): string {
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

async function completeAppointment() {
  if (!appointment.value) return;

  const confirmed = confirm('Deseja marcar este agendamento como concluído?');
  if (!confirmed) return;

  const barbershopId = authStore.barbershopId;
  if (!barbershopId) return;

  try {
    updating.value = true;
    await appointmentService.updateStatus(barbershopId, appointmentId.value, {
      status_id: 3 // 3 = Concluído
    });
    alert('Agendamento finalizado com sucesso!');
    router.push({ name: 'Appointments' });
  } catch (error: any) {
    console.error('Erro ao finalizar agendamento:', error);
    alert(error.response?.data?.message || 'Erro ao finalizar agendamento');
  } finally {
    updating.value = false;
  }
}

async function cancelAppointment() {
  if (!appointment.value) return;

  const confirmed = confirm('Tem certeza que deseja cancelar este agendamento?');
  if (!confirmed) return;

  const barbershopId = authStore.barbershopId;
  if (!barbershopId) return;

  try {
    updating.value = true;
    await appointmentService.updateStatus(barbershopId, appointmentId.value, {
      status_id: 4 // 4 = Cancelado
    });
    alert('Agendamento cancelado com sucesso!');
    router.push({ name: 'Appointments' });
  } catch (error: any) {
    console.error('Erro ao cancelar agendamento:', error);
    alert(error.response?.data?.message || 'Erro ao cancelar agendamento');
  } finally {
    updating.value = false;
  }
}

function goBack() {
  router.push({ name: 'Appointments' });
}

onMounted(() => {
  loadAppointment();
});
</script>

<template>
  <div class="appointment-detail-screen">
    <header class="detail-header">
      <button class="back-btn" @click="goBack">← Voltar</button>
      <h1>Detalhes do Agendamento</h1>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando detalhes...</p>
    </div>

    <main v-else-if="appointment" class="detail-content">
      <!-- Client Info Card -->
      <section class="client-info-card">
        <div class="client-avatar">
          {{ getClientInitials(appointment.client?.name || 'Cliente') }}
        </div>
        <div class="client-info">
          <p class="name">{{ appointment.client?.name || 'Cliente' }}</p>
          <p class="history">{{ appointment.client?.email || '' }}</p>
        </div>
      </section>

      <!-- Appointment Details -->
      <section class="details-section">
        <h2>Serviço Agendado</h2>
        <div class="details-list">
          <!-- Service & Barber -->
          <div class="detail-item">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="6" cy="6" r="3"></circle>
                <circle cx="6" cy="18" r="3"></circle>
                <line x1="20" y1="4" x2="8.12" y2="15.88"></line>
                <line x1="14.47" y1="14.48" x2="20" y2="20"></line>
                <line x1="8.12" y1="8.12" x2="12" y2="12"></line>
              </svg>
            </span>
            <div>
              <p class="label">{{ appointment.service?.name || 'Serviço' }}</p>
              <p class="value">com {{ appointment.barber?.name || 'Barbeiro' }}</p>
            </div>
          </div>

          <!-- Date & Time -->
          <div class="detail-item">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </span>
            <div>
              <p class="label">{{ formatDateTime(appointment.start_time) }}</p>
              <p class="value">
                às {{ formatTime(appointment.start_time) }}
                (duração de {{ appointment.service?.duration_minutes || 0 }} min)
              </p>
            </div>
          </div>

          <!-- Price -->
          <div class="detail-item price-item">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" x2="12" y1="1" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </span>
            <div>
              <p class="label">Valor Total</p>
              <p class="value">{{ formatPrice(appointment.service?.price || 0) }}</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Action Buttons -->
    <div v-if="appointment && appointment.status_id !== 3 && appointment.status_id !== 4" class="cta-container">
      <button
          class="btn btn-primary"
          @click="completeAppointment"
          :disabled="updating"
      >
        {{ updating ? 'Processando...' : 'Finalizar Atendimento' }}
      </button>
      <button
          class="btn btn-secondary-outline"
          @click="cancelAppointment"
          :disabled="updating"
      >
        Cancelar Agendamento
      </button>
    </div>

    <!-- Status Info (if completed or cancelled) -->
    <div v-else-if="appointment" class="status-info">
      <p v-if="appointment.status_id === 3" class="completed">✓ Atendimento Concluído</p>
      <p v-if="appointment.status_id === 4" class="cancelled">✗ Agendamento Cancelado</p>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap');

.appointment-detail-screen {
  min-height: 100vh;
  background-color: var(--color-background-primary);
  padding-bottom: 150px;
}

.detail-header {
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

.detail-header h1 {
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

.detail-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.client-info-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background-color: var(--color-background-secondary);
  border-radius: 1.5rem;
  border: 1px solid var(--color-border);
}

.client-avatar {
  width: 60px;
  height: 60px;
  min-width: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-accent-primary), #047857);
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--color-text-primary);
}

.client-info .name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.client-info .history {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.details-section {
  background-color: var(--color-background-secondary);
  padding: 1.5rem;
  border-radius: 1.5rem;
  border: 1px solid var(--color-border);
}

.details-section h2 {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.details-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.detail-item .icon {
  color: var(--color-text-secondary);
  width: 20px;
  min-width: 20px;
  margin-top: 2px;
}

.detail-item .label {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 1rem;
}

.detail-item .value {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.price-item .value {
  color: var(--color-accent-primary);
  font-size: 1.25rem;
  font-weight: 700;
}

.cta-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: linear-gradient(to top, var(--color-background-primary) 80%, transparent);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn {
  display: inline-block;
  width: 100%;
  padding: 1.125rem;
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: opacity 0.3s ease;
  font-family: 'Sora', sans-serif;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-image: linear-gradient(to right, var(--color-accent-primary), #047857);
  color: var(--color-text-primary);
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-secondary-outline {
  background-color: transparent;
  border: 2px solid var(--color-border);
  color: var(--color-text-secondary);
}

.btn-secondary-outline:hover:not(:disabled) {
  border-color: #ef4444;
  color: #ef4444;
}

.status-info {
  padding: 2rem 1.5rem;
  text-align: center;
}

.status-info p {
  padding: 1rem;
  border-radius: 1rem;
  font-weight: 700;
  font-size: 1.125rem;
}

.status-info .completed {
  background-color: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.status-info .cancelled {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}
</style>