<template>
  <div class="booking-screen">
    <!-- Header -->
    <header class="booking-header">
      <button class="back-btn" @click="goBack">← Voltar</button>
      <h1 class="header-title">Agendar Horário</h1>
      <p class="header-subtitle">{{ barbershop?.name }}</p>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <p>Carregando...</p>
    </div>

    <!-- Form -->
    <main v-else-if="barbershop" class="booking-form">
      <!-- Service Selection -->
      <fieldset class="form-section">
        <legend class="section-legend">Escolha o Serviço</legend>
        <div class="selection-list">
          <label
              v-for="service in barbershop.services"
              :key="service.id"
              class="radio-card-label"
          >
            <input
                type="radio"
                name="service"
                :value="service.id"
                v-model="selectedService"
                class="radio-hidden-peer"
            >
            <div class="radio-card-content">
              <div class="service-details">
                <p class="service-name">{{ service.name }}</p>
                <span class="service-duration">{{ service.duration_minutes }} min</span>
              </div>
              <span class="service-price">R$ {{ formatPrice(service.price) }}</span>
            </div>
          </label>
        </div>
      </fieldset>

      <!-- Barber Selection -->
      <fieldset class="form-section">
        <legend class="section-legend">Escolha o Profissional</legend>
        <div class="barbers-grid">
          <label
              v-for="barber in barbershop.barbers"
              :key="barber.id"
              class="barber-card-label"
          >
            <input
                type="radio"
                name="barber"
                :value="barber.id"
                v-model="selectedBarber"
                class="radio-hidden-peer"
                @change="loadAvailableSlots"
            >
            <div class="barber-card-content">
              <div class="barber-avatar">{{ getInitials(barber.name) }}</div>
              <p class="barber-name">{{ barber.name }}</p>
            </div>
          </label>
        </div>
      </fieldset>

      <!-- Date Selection -->
      <fieldset class="form-section">
        <legend class="section-legend">Data</legend>
        <input
            type="date"
            class="date-input"
            v-model="selectedDate"
            :min="minDate"
            @change="loadAvailableSlots"
        >
      </fieldset>

      <!-- Time Slots -->
      <fieldset class="form-section" v-if="selectedDate && selectedBarber">
        <legend class="section-legend">Horário</legend>
        <div v-if="loadingSlots" class="loading-slots">
          Carregando horários...
        </div>
        <div v-else-if="availableSlots.length === 0" class="no-slots">
          Nenhum horário disponível para esta data
        </div>
        <div v-else class="time-slots-grid">
          <button
              v-for="slot in availableSlots"
              :key="slot"
              class="time-slot"
              :class="{ active: selectedTime === slot }"
              @click="selectedTime = slot"
          >
            {{ slot }}
          </button>
        </div>
      </fieldset>

      <!-- Notes -->
      <fieldset class="form-section">
        <legend class="section-legend">Observações (opcional)</legend>
        <textarea
            v-model="notes"
            class="notes-input"
            placeholder="Ex: Gostaria de um corte mais curto nas laterais..."
            rows="3"
        ></textarea>
      </fieldset>

      <!-- Payment Notice -->
      <div class="payment-notice" v-if="barbershop.requires_prepayment">
        <svg class="notice-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
          <line x1="1" y1="10" x2="23" y2="10"></line>
        </svg>
        <div class="notice-text">
          <p class="notice-title">Pagamento Antecipado</p>
          <p class="notice-description">Esta barbearia requer pagamento antecipado para confirmar.</p>
        </div>
      </div>
    </main>

    <!-- CTA Button -->
    <div class="cta-container">
      <button
          class="btn btn-primary"
          @click="confirmBooking"
          :disabled="!canConfirm || submitting"
      >
        {{ submitting ? 'Confirmando...' : `Confirmar • R$ ${totalPrice}` }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { barbershopService } from '@/services/barbershopService';
import { appointmentService } from '@/services/appointmentService';

const route = useRoute();
const router = useRouter();

const barbershop = ref<any>(null);
const loading = ref(true);
const loadingSlots = ref(false);
const submitting = ref(false);

const selectedService = ref('');
const selectedBarber = ref('');
const selectedDate = ref('');
const selectedTime = ref('');
const notes = ref('');
const availableSlots = ref<string[]>([]);

const minDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});

const canConfirm = computed(() => {
  return selectedService.value && selectedBarber.value && selectedDate.value && selectedTime.value;
});

const totalPrice = computed(() => {
  if (!selectedService.value || !barbershop.value) return '0';
  const service = barbershop.value.services?.find((s: any) => s.id === selectedService.value);
  return service ? formatPrice(service.price) : '0';
});

async function loadBarbershop() {
  try {
    loading.value = true;
    const response = await barbershopService.show(route.params.id as string);
    barbershop.value = response.data;

    // Auto-select first service and barber if available
    if (barbershop.value.services?.length > 0) {
      selectedService.value = barbershop.value.services[0].id;
    }
    if (barbershop.value.barbers?.length > 0) {
      selectedBarber.value = barbershop.value.barbers[0].id;
    }

    // Set today as default date
    selectedDate.value = minDate.value;

    // Load slots
    if (selectedBarber.value && selectedDate.value) {
      await loadAvailableSlots();
    }
  } catch (err: any) {
    alert(err.response?.data?.message || 'Erro ao carregar barbearia');
    router.back();
  } finally {
    loading.value = false;
  }
}

async function loadAvailableSlots() {
  if (!selectedBarber.value || !selectedDate.value) return;

  try {
    loadingSlots.value = true;
    const response = await barbershopService.availableSlots(
        barbershop.value.id,
        selectedDate.value,
        selectedBarber.value
    );
    availableSlots.value = response.data;

    // Reset selected time if not available anymore
    if (!availableSlots.value.includes(selectedTime.value)) {
      selectedTime.value = '';
    }
  } catch (err: any) {
    console.error('Erro ao carregar horários:', err);
    availableSlots.value = [];
  } finally {
    loadingSlots.value = false;
  }
}

async function confirmBooking() {
  if (!canConfirm.value) return;

  try {
    submitting.value = true;

    await appointmentService.create({
      barbershop_id: barbershop.value.id,
      service_id: selectedService.value,
      barber_id: selectedBarber.value,
      date: selectedDate.value,
      time: selectedTime.value,
      notes: notes.value || undefined
    });

    alert('Agendamento realizado com sucesso!');
    router.push({ name: 'ClientAppointments' });
  } catch (err: any) {
    alert(err.response?.data?.message || 'Erro ao criar agendamento');
  } finally {
    submitting.value = false;
  }
}

function goBack() {
  router.back();
}

function formatPrice(price: number): string {
  return price.toFixed(0);
}

function getInitials(name: string): string {
  return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
}

// Watch for changes
watch([selectedBarber, selectedDate], () => {
  if (selectedBarber.value && selectedDate.value) {
    loadAvailableSlots();
  }
});

onMounted(() => {
  loadBarbershop();
});
</script>

<style scoped>
.booking-screen { padding-bottom: 120px; }
.booking-header { background-image: linear-gradient(to right, var(--color-accent-primary), var(--color-accent-primary)); padding: 1.5rem; padding-top: 3rem; border-radius: 0 0 1.75rem 1.75rem; color: var(--text-primary); }
.back-btn { background: none; border: none; color: rgba(255, 255, 255, 0.8); font-size: 1rem; font-weight: 600; margin-bottom: 1rem; cursor: pointer; }
.header-title { font-size: 1.75rem; font-weight: 700; }
.header-subtitle { font-size: 1rem; opacity: 0.8; }
.booking-form { padding: 1.5rem; display: flex; flex-direction: column; gap: 2rem; }
.form-section { border: none; }
.section-legend { font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; color: var(--color-text-primary); }
.radio-hidden-peer { display: none; }
.radio-card-label, .barber-card-label { display: block; cursor: pointer; }
.selection-list { display: flex; flex-direction: column; gap: 0.75rem; }
.radio-card-content { background-color: var(--color-background-secondary); border: 2px solid var(--color-border); border-radius: 1rem; padding: 1.25rem; display: flex; justify-content: space-between; align-items: center; transition: border-color 0.3s ease; }
.radio-hidden-peer:checked + .radio-card-content { border-color: var(--color-accent-primary); }
.service-name { font-weight: 600; }
.service-duration { font-size: 0.875rem; color: var(--color-text-secondary); margin-top: 0.25rem; }
.service-price { font-size: 1.125rem; font-weight: 700; color: var(--color-accent-primary); }
.barbers-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.barber-card-content { background-color: var(--color-background-secondary); border: 2px solid var(--color-border); border-radius: 1rem; padding: 1rem; text-align: center; transition: border-color 0.3s ease; }
.radio-hidden-peer:checked + .barber-card-content { border-color: var(--color-accent-primary); }
.barber-avatar { width: 56px; height: 56px; border-radius: 50%; background-image: linear-gradient(to top right, var(--color-accent-primary), #065f46); display: flex; justify-content: center; align-items: center; font-weight: 700; font-size: 1.25rem; margin: 0 auto 0.75rem; }
.barber-name { font-weight: 600; }
.date-input, .notes-input { width: 100%; padding: 1rem; background-color: var(--color-background-secondary); border: 1px solid var(--color-border); border-radius: 1rem; color: var(--color-text-primary); font-size: 1rem; font-family: 'Sora', sans-serif; }
.notes-input { resize: vertical; }
.time-slots-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; }
.time-slot { padding: 0.875rem 0; border-radius: 0.75rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; border: 1px solid var(--color-border); background-color: var(--color-background-secondary); color: var(--color-text-secondary); transition: all 0.2s; }
.time-slot.active { background-image: linear-gradient(to right, var(--color-accent-primary), var(--color-accent-secondary)); color: var(--color-text-primary); border-color: var(--color-accent-primary); }
.loading-slots, .no-slots { padding: 1rem; text-align: center; color: var(--color-text-secondary); }
.payment-notice { background-color: rgba(217, 119, 6, 0.1); border: 1px solid rgba(217, 119, 6, 0.3); border-radius: 1rem; padding: 1rem; display: flex; align-items: flex-start; gap: 1rem; }
.notice-icon { color: var(--color-accent-secondary); margin-top: 3px; flex-shrink: 0; }
.notice-title { color: var(--color-accent-secondary); font-weight: 600; }
.notice-description { color: var(--color-text-secondary); font-size: 0.875rem; margin-top: 0.25rem; }
.cta-container { position: fixed; bottom: 0; left: 0; right: 0; padding: 1.5rem; background: linear-gradient(to top, var(--color-background-primary) 70%, transparent); z-index: 100; }
.btn { display: inline-block; width: 100%; padding: 1.125rem; border-radius: 1rem; font-size: 1rem; font-weight: 700; text-align: center; border: none; cursor: pointer; transition: opacity 0.2s; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-primary { background-image: linear-gradient(to right, var(--color-accent-primary), var(--color-accent-primary)); color: var(--color-text-primary); }
.loading-container { padding: 2rem; text-align: center; }
</style>