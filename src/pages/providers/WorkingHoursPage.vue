<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { workingHourService, type WorkingHour } from '@/services/workingHourService';

const router = useRouter();
const authStore = useAuthStore();

interface DaySchedule {
  day_of_week: number;
  dayName: string;
  is_open: boolean;
  start_time: string;
  end_time: string;
  id?: string;
}

const loading = ref(true);
const saving = ref(false);

const weekDays = ref<DaySchedule[]>([
  { day_of_week: 0, dayName: 'Domingo', is_open: false, start_time: '09:00', end_time: '18:00' },
  { day_of_week: 1, dayName: 'Segunda-feira', is_open: true, start_time: '09:00', end_time: '18:00' },
  { day_of_week: 2, dayName: 'Terça-feira', is_open: true, start_time: '09:00', end_time: '18:00' },
  { day_of_week: 3, dayName: 'Quarta-feira', is_open: true, start_time: '09:00', end_time: '18:00' },
  { day_of_week: 4, dayName: 'Quinta-feira', is_open: true, start_time: '09:00', end_time: '18:00' },
  { day_of_week: 5, dayName: 'Sexta-feira', is_open: true, start_time: '09:00', end_time: '20:00' },
  { day_of_week: 6, dayName: 'Sábado', is_open: true, start_time: '09:00', end_time: '18:00' }
]);

function formatTimeFromAPI(time: string | null): string {
  if (!time) return '09:00';
  // Converte "10:00:00" para "10:00"
  return time.substring(0, 5);
}

async function loadWorkingHours() {
  const barbershopId = authStore.barbershopId;

  if (!barbershopId) {
    console.error('Barbershop ID não encontrado');
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    const response = await workingHourService.list(barbershopId);
    const hours: WorkingHour[] = response.data || response;

    console.log('Horários recebidos:', hours);

    // Atualiza os dados com o que veio da API
    hours.forEach(hour => {
      const day = weekDays.value.find(d => d.day_of_week === hour.day_of_week);
      if (day) {
        day.is_open = hour.is_active; // CORRIGIDO: is_active -> is_open
        day.start_time = formatTimeFromAPI(hour.start_time);
        day.end_time = formatTimeFromAPI(hour.end_time);
        day.id = hour.id;
      }
    });

    console.log('Dias atualizados:', weekDays.value);
  } catch (error: any) {
    console.error('Erro ao carregar horários:', error);
    // Se não houver horários, mantém os padrões
  } finally {
    loading.value = false;
  }
}

async function saveWorkingHours() {
  const barbershopId = authStore.barbershopId;
  if (!barbershopId) return;

  try {
    saving.value = true;

    // Salva cada dia
    for (const day of weekDays.value) {
      const data = {
        day_of_week: day.day_of_week,
        is_active: day.is_open, // CORRIGIDO: is_open -> is_active
        start_time: day.is_open ? day.start_time : '00:00',
        end_time: day.is_open ? day.end_time : '00:00'
      };

      if (day.id) {
        // Atualiza existente
        await workingHourService.update(barbershopId, day.id, {
          ...data,
          id: day.id
        });
      } else {
        // Cria novo
        const response = await workingHourService.create(barbershopId, data);
        day.id = response.data?.id || response.id;
      }
    }

    alert('Horários salvos com sucesso!');
  } catch (error: any) {
    console.error('Erro ao salvar horários:', error);
    alert(error.response?.data?.message || 'Erro ao salvar horários');
  } finally {
    saving.value = false;
  }
}

function goBack() {
  router.push({ name: 'Dashboard' });
}

onMounted(() => {
  loadWorkingHours();
});
</script>

<template>
  <div class="schedule-screen">
    <header class="schedule-header">
      <button class="back-btn" @click="goBack">← Voltar</button>
      <h1>Horários de Funcionamento</h1>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando horários...</p>
    </div>

    <main v-else class="schedule-content">
      <div class="schedule-list">
        <div
            v-for="day in weekDays"
            :key="day.day_of_week"
            class="day-schedule-card"
            :class="{ 'is-open': day.is_open }"
        >
          <div class="day-header">
            <span class="day-name">{{ day.dayName }}</span>
            <label class="toggle-switch">
              <input
                  type="checkbox"
                  v-model="day.is_open"
              >
              <span class="slider"></span>
            </label>
          </div>

          <transition name="expand">
            <div v-if="day.is_open" class="time-inputs-wrapper">
              <div class="time-input-group">
                <div class="time-input">
                  <label>Das</label>
                  <input
                      type="time"
                      v-model="day.start_time"
                  >
                </div>
                <div class="time-input">
                  <label>Às</label>
                  <input
                      type="time"
                      v-model="day.end_time"
                  >
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </main>

    <div class="cta-container">
      <button
          class="btn btn-primary"
          @click="saveWorkingHours"
          :disabled="saving || loading"
      >
        {{ saving ? 'Salvando...' : 'Salvar Horários' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap');

.schedule-screen {
  min-height: 100vh;
  background-color: var(--color-background-primary);
  padding-bottom: 120px;
}

.schedule-header {
  padding: 3rem 1.5rem 2rem;
  background-color: var(--color-background-primary);
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

.schedule-header h1 {
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

.schedule-content {
  padding: 0 1.5rem 1.5rem;
}

.schedule-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.day-schedule-card {
  background-color: var(--color-background-secondary);
  border-radius: 1rem;
  border: 1px solid var(--color-border);
  overflow: hidden;
  transition: all 0.3s ease;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
}

.day-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
  cursor: pointer;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-border);
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

.toggle-switch input:checked + .slider {
  background-color: var(--color-accent-primary);
}

.toggle-switch input:checked + .slider:before {
  transform: translateX(22px);
}

/* Time Inputs */
.time-inputs-wrapper {
  padding: 0 1.25rem 1.25rem;
  border-top: 1px solid var(--color-border);
}

.time-input-group {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding-top: 1rem;
}

.time-input {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--color-background-primary);
  padding: 0.875rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid var(--color-border);
}

.time-input label {
  font-weight: 600;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  min-width: 30px;
}

.time-input input[type="time"] {
  background: none;
  border: none;
  color: var(--color-text-primary);
  font-family: 'Sora', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  width: 100%;
  outline: none;
}

.time-input input[type="time"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}

/* Expand Animation */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 200px;
  opacity: 1;
}

.cta-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: linear-gradient(to top, var(--color-background-primary) 70%, transparent);
  z-index: 100;
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
</style>