<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';

const router = useRouter();

interface Appointment {
  id: string;
  barbershop_id: string;
  service_id: string;
  barber_id: string;
  start_time: string;
  barbershop_name: string;
  service_name: string;
  service_price: number;
  service_duration: number;
  barber_name: string;
}

const appointments = ref<Appointment[]>([]);
const loading = ref(true);
const error = ref('');
const showRatingModal = ref(false);
const selectedAppointment = ref<Appointment | null>(null);
const rating = ref(0);
const comment = ref('');

async function loadAppointments() {
  try {
    loading.value = true;
    error.value = '';

    const response = await api.get('/client/appointments');
    const data = response.data.data || response.data;

    appointments.value = Array.isArray(data) ? data : [];

    console.log('Agendamentos carregados:', appointments.value);
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Erro ao carregar agendamentos';
    console.error('Erro:', err);
  } finally {
    loading.value = false;
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

function bookAgain(appointment: Appointment) {
  // Redireciona para página de agendamento com dados pré-setados
  router.push({
    name: 'BarbershopDetails',
    params: { id: appointment.barbershop_id },
    query: {
      service_id: appointment.service_id,
      barber_id: appointment.barber_id
    }
  });
}

function openRatingModal(appointment: Appointment) {
  selectedAppointment.value = appointment;
  rating.value = 0;
  comment.value = '';
  showRatingModal.value = true;
}

function closeRatingModal() {
  showRatingModal.value = false;
  selectedAppointment.value = null;
  rating.value = 0;
  comment.value = '';
}

async function submitRating() {
  if (rating.value === 0) {
    alert('Por favor, selecione uma avaliação');
    return;
  }

  try {
    await api.post(`/client/appointments/${selectedAppointment.value?.id}/rating`, {
      rating: rating.value,
      comment: comment.value
    });

    alert('Avaliação enviada com sucesso!');
    closeRatingModal();
  } catch (err: any) {
    alert(err.response?.data?.message || 'Erro ao enviar avaliação');
  }
}

function goBack() {
  router.push({ name: 'ClientDashboard' });
}

onMounted(() => {
  loadAppointments();
});
</script>

<template>
  <div class="appointments-screen">
    <header class="appointments-header">
      <button class="back-btn" @click="goBack">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <h1>Meus Agendamentos</h1>
      <div style="width: 24px;"></div>
    </header>

    <main class="appointments-content">
      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Carregando agendamentos...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p>{{ error }}</p>
        <button class="retry-btn" @click="loadAppointments">Tentar Novamente</button>
      </div>

      <!-- Empty State -->
      <div v-else-if="appointments.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <p>Você ainda não tem agendamentos concluídos</p>
        <button class="primary-btn" @click="goBack">Explorar Barbearias</button>
      </div>

      <!-- Appointments List -->
      <div v-else class="appointments-container">
        <h2 class="section-title">Histórico</h2>
        <div class="appointments-list">
          <div
              v-for="appointment in appointments"
              :key="appointment.id"
              class="appointment-card"
          >
            <!-- Header -->
            <div class="card-header">
              <h3>{{ appointment.barbershop_name }}</h3>
              <p class="appointment-date">{{ formatDate(appointment.start_time) }}</p>
            </div>

            <!-- Divider -->
            <div class="card-divider"></div>

            <!-- Details -->
            <div class="card-details">
              <div class="detail-row">
                <span class="detail-label">Serviço:</span>
                <span class="detail-value">{{ appointment.service_name }}</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <button
                  class="book-again-btn"
                  @click="bookAgain(appointment)"
              >
                Agendar Novamente
              </button>
              <button
                  class="review-btn"
                  @click="openRatingModal(appointment)"
              >
                Deixar Avaliação
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Rating Modal -->
    <div v-if="showRatingModal" class="modal-overlay" @click="closeRatingModal">
      <div class="modal-content" @click.stop>
        <h2>Avaliar Atendimento</h2>
        <p class="modal-subtitle">{{ selectedAppointment?.barbershop_name }}</p>

        <div class="rating-stars">
          <button
              v-for="star in 5"
              :key="star"
              class="star-btn"
              :class="{ active: star <= rating }"
              @click="rating = star"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" :fill="star <= rating ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </button>
        </div>

        <textarea
            v-model="comment"
            placeholder="Deixe um comentário (opcional)"
            rows="4"
        ></textarea>

        <div class="modal-actions">
          <button class="cancel-modal-btn" @click="closeRatingModal">Cancelar</button>
          <button class="submit-modal-btn" @click="submitRating">Enviar Avaliação</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.appointments-screen {
  min-height: 100vh;
  background-color: var(--color-background-primary);
  padding-bottom: 2rem;
}

.appointments-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 1.5rem;
  background-color: var(--color-background-secondary);
  border-bottom: 1px solid var(--color-border);
}

.back-btn {
  background: none;
  border: none;
  color: var(--color-text-primary);
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  transition: background-color 0.2s;
}

.back-btn:hover {
  background-color: var(--color-border);
}

.appointments-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
}

.appointments-content {
  padding: 1.5rem;
}

.loading-container,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
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

.retry-btn,
.primary-btn {
  margin-top: 1rem;
  padding: 0.875rem 2rem;
  background-color: var(--color-accent-primary);
  color: var(--color-text-primary);
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.retry-btn:hover,
.primary-btn:hover {
  opacity: 0.9;
}

.appointments-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
}

.appointments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.appointment-card {
  background-color: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 1.25rem;
}

.card-header h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.appointment-date {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-top: 0.25rem;
  text-transform: capitalize;
}

.card-divider {
  height: 1px;
  background-color: var(--color-border);
  margin: 1rem 0;
}

.card-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

.detail-label {
  color: var(--color-text-secondary);
}

.detail-value {
  color: var(--color-text-primary);
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
}

.book-again-btn,
.review-btn {
  flex: 1;
  padding: 0.875rem;
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  font-family: inherit;
}

.book-again-btn {
  background-color: var(--color-accent-primary);
  color: var(--color-text-primary);
}

.review-btn {
  background-color: #FFA500;
  color: white;
}

.book-again-btn:hover,
.review-btn:hover {
  opacity: 0.9;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1.5rem;
}

.modal-content {
  background-color: var(--color-background-secondary);
  border-radius: var(--radius-xl);
  padding: 2rem;
  max-width: 500px;
  width: 100%;
}

.modal-content h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.modal-subtitle {
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
}

.rating-stars {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.star-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-border);
  transition: all 0.2s;
  padding: 0.25rem;
}

.star-btn.active {
  color: #FFA500;
}

.star-btn:hover {
  transform: scale(1.1);
}

.modal-content textarea {
  width: 100%;
  padding: 1rem;
  background-color: var(--color-background-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  color: var(--color-text-primary);
  font-family: inherit;
  font-size: 0.875rem;
  resize: vertical;
  margin-bottom: 1.5rem;
}

.modal-content textarea:focus {
  outline: none;
  border-color: var(--color-accent-primary);
}

.modal-content textarea::placeholder {
  color: var(--color-text-secondary);
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
}

.cancel-modal-btn,
.submit-modal-btn {
  flex: 1;
  padding: 0.875rem;
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  font-family: inherit;
}

.cancel-modal-btn {
  background-color: transparent;
  border: 2px solid var(--color-border);
  color: var(--color-text-primary);
}

.submit-modal-btn {
  background-color: var(--color-accent-primary);
  color: var(--color-text-primary);
}

.cancel-modal-btn:hover,
.submit-modal-btn:hover {
  opacity: 0.9;
}
</style>