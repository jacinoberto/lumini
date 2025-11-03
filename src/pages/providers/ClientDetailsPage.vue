<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { clientService, type Client, type ClientAppointmentHistory } from '@/services/clientService';
import type { Appointment } from '@/services/appointmentService';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const clientId = computed(() => route.params.clientId as string);

const loading = ref(true);
const saving = ref(false);
const client = ref<Client | null>(null);
const appointmentHistory = ref<ClientAppointmentHistory[]>([]);
const notes = ref('');

// -------------------------------
// Carregar dados do cliente e histórico
// -------------------------------
async function loadClientDetails() {
  const barbershopId = authStore.barbershopId;
  if (!barbershopId) return;

  try {
    loading.value = true;

    const clientResponse = await clientService.getById(barbershopId, clientId.value);
    const clientData = clientResponse.data;

    // Popula dados do cliente e estatísticas
    client.value = {
      ...clientData.client,
      total_appointments: clientData.stats.total_appointments,
      completed_appointments: clientData.stats.completed_appointments,
      cancelled_appointments: clientData.stats.cancelled_appointments,
      last_appointment: clientData.stats.last_appointment
    };

    notes.value = client.value?.notes || '';

    // Popula histórico de agendamentos
    appointmentHistory.value = clientData.recent_appointments.map((a: Appointment) => ({
      ...a,
      service_price: a.price ?? 0
    }));

    // Calcula total gasto com agendamentos concluídos (status_id = 3)
    if (client.value) {
      // Calcula total gasto com agendamentos concluídos (status_id = 3)
      client.value.total_spent = appointmentHistory.value
          .filter(a => a.status_id === 3)
          .reduce((sum, a) => sum + a.service_price, 0);
    }

  } catch (error: any) {
    console.error('Erro ao carregar cliente:', error);
    alert('Erro ao carregar dados do cliente');
    router.push({ name: 'ClientsList' });
  } finally {
    loading.value = false;
  }
}

// -------------------------------
// Funções utilitárias
// -------------------------------
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

function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function formatPrice(price: number): string {
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatMonthYear(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR', {
    month: 'short',
    year: 'numeric'
  });
}

// -------------------------------
// Salvar anotações
// -------------------------------
async function saveNotes() {
  const barbershopId = authStore.barbershopId;
  if (!barbershopId) return;

  try {
    saving.value = true;
    await clientService.updateNotes(barbershopId, clientId.value, { notes: notes.value });
    alert('Anotações salvas com sucesso!');
  } catch (error: any) {
    console.error('Erro ao salvar anotações:', error);
    alert(error.response?.data?.message || 'Erro ao salvar anotações');
  } finally {
    saving.value = false;
  }
}

// -------------------------------
// Navegação
// -------------------------------
function goBack() {
  router.push({ name: 'ClientsList' });
}

// -------------------------------
// Lifecycle
// -------------------------------
onMounted(() => {
  loadClientDetails();
});
</script>



<template>
  <div class="client-detail-screen">
    <header class="client-detail-header">
      <button class="back-btn" @click="goBack">← Voltar para Clientes</button>
      <h1>{{ client?.name || 'Cliente' }}</h1>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando dados...</p>
    </div>

    <main v-else-if="client" class="client-detail-content">
      <!-- Client Summary Card -->
      <section class="client-summary-card">
        <div class="client-avatar">{{ getInitials(client.name) }}</div>
        <p class="name">{{ client.name }}</p>
        <p class="email">{{ client.email }}</p>
        <p v-if="client.created_at" class="since">
          Cliente desde {{ formatMonthYear(client.created_at) }}
        </p>

        <div class="client-stats">
          <div class="stat-item">
            <p class="label">Total de Cortes</p>
            <p class="value">{{ client.total_appointments || 0 }}</p>
          </div>
          <div class="stat-item">
            <p class="label">Gasto Total</p>
            <p class="value">{{ formatPrice(client.total_spent || 0) }}</p>
          </div>
        </div>
      </section>

      <!-- Appointment History -->
      <section v-if="appointmentHistory.length > 0" class="content-section">
        <h2>Histórico de Agendamentos</h2>
        <div class="history-list">
          <div
              v-for="appointment in appointmentHistory"
              :key="appointment.id"
              class="history-item"
          >
            <div>
              <p class="service">{{ appointment.service_name }}</p>
              <p class="date">{{ formatDate(appointment.start_time) }}</p>
            </div>
            <span class="price">{{ formatPrice(appointment.service_price) }}</span>
          </div>
        </div>
      </section>

      <!-- Empty History -->
      <section v-else class="content-section">
        <h2>Histórico de Agendamentos</h2>
        <div class="empty-history">
          <p>Nenhum agendamento registrado ainda</p>
        </div>
      </section>

      <!-- Client Notes -->
      <section class="content-section notes-section">
        <h2>Anotações sobre o Cliente</h2>
        <textarea
            v-model="notes"
            placeholder="Adicione detalhes sobre as preferências do cliente, como tipo de corte, produtos usados, assuntos da conversa, etc."
        ></textarea>
        <button
            class="btn btn-secondary"
            @click="saveNotes"
            :disabled="saving"
        >
          {{ saving ? 'Salvando...' : 'Salvar Anotações' }}
        </button>
      </section>
    </main>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap');

.client-detail-screen {
  min-height: 100vh;
  background-color: var(--color-background-primary);
  padding-bottom: 2rem;
}

.client-detail-header {
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

.client-detail-header h1 {
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

.client-detail-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.client-summary-card {
  background-color: var(--color-background-secondary);
  padding: 1.5rem;
  border-radius: 1.5rem;
  border: 1px solid var(--color-border);
  text-align: center;
}

.client-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-accent-primary), #047857);
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: 2rem;
  color: var(--color-text-primary);
  margin: 0 auto 1rem;
}

.client-summary-card .name {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.client-summary-card .email {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-top: 0.25rem;
}

.client-summary-card .since {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-top: 0.5rem;
}

.client-stats {
  margin-top: 1.5rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  background-color: var(--color-border);
  padding: 1px;
  border-radius: 0.75rem;
  overflow: hidden;
}

.stat-item {
  background-color: var(--color-background-secondary);
  padding: 1rem;
}

.stat-item .label {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.stat-item .value {
  font-weight: 700;
  font-size: 1.25rem;
  margin-top: 0.25rem;
  color: var(--color-text-primary);
}

.content-section h2 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-background-secondary);
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid var(--color-border);
}

.history-item .service {
  font-weight: 600;
  color: var(--color-text-primary);
}

.history-item .date {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-top: 0.25rem;
}

.history-item .price {
  font-weight: 700;
  color: var(--color-accent-primary);
  font-size: 1rem;
}

.empty-history {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-secondary);
  background-color: var(--color-background-secondary);
  border-radius: 0.75rem;
  border: 1px solid var(--color-border);
}

.notes-section textarea {
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  background-color: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  color: var(--color-text-primary);
  font-size: 1rem;
  font-family: 'Sora', sans-serif;
  resize: vertical;
}

.notes-section textarea:focus {
  outline: none;
  border-color: var(--color-accent-primary);
}

.notes-section .btn {
  margin-top: 1rem;
  width: 100%;
  padding: 1.125rem;
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-family: 'Sora', sans-serif;
}

.btn-secondary {
  background-color: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--color-border);
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>