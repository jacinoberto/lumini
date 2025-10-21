<template>
  <div class="appointments-layout">
    <BaseHeader title="Meus Agendamentos" @click="goBack" />

    <div class="date-selector-container">
      <div class="date-selector-scroll">
        <button
            v-for="dateObj in datesToShow"
            :key="dateObj.iso"
            class="date-pill"
            :class="{ active: isSelected(dateObj.date) }"
            @click="selectDate(dateObj.date)"
        >
          <span class="date-weekday">{{ dateObj.weekday }}</span>
          <span class="date-day">{{ dateObj.day }}</span>
        </button>
      </div>
    </div>

    <main class="appointments-content">
      <div v-if="isLoading" class="loading-state">
        <vue-feather type="loader" animation="spin"></vue-feather>
        <span>Carregando agendamentos...</span>
      </div>
      <div v-else-if="appointments.length === 0" class="empty-state">
        <vue-feather type="calendar" size="48"></vue-feather>
        <p>Nenhum agendamento para {{ formattedSelectedDate }}.</p>
      </div>
      <div v-else class="appointments-list">
        <AppointmentCard
            v-for="appointment in appointments"
            :key="appointment.id"
            :appointment="appointment"
            @options-click="handleAppointmentOptions"
        />
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import api from '@/services/api';

// Funções do date-fns
import { format, addDays, startOfToday, isToday, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale'; // Importa locale pt-BR

// Componentes
import BaseHeader from '@/components/base/BaseHeader.vue';
import AppointmentCard from '@/components/cards/AppointmentCard.vue';

// Tipos
import type { Appointment } from '@/types/appointment.ts'; // Reutiliza o tipo

type DateObject = {
  date: Date;
  iso: string;
  day: string;
  weekday: string;
  isToday: boolean;
};

export default defineComponent({
  name: 'AppointmentsPage',
  components: { BaseHeader, AppointmentCard },
  setup() {
    const today = startOfToday();
    const selectedDate = ref<Date>(today);
    const datesToShow = ref<DateObject[]>([]);
    const appointments = ref<Appointment[]>([]);
    const isLoading = ref(false);
    const apiErrorMessage = ref('');

    // --- Lógica de Datas ---
    const generateDates = (start: Date, count: number = 7): DateObject[] => {
      const dates: DateObject[] = [];
      for (let i = 0; i < count; i++) {
        const currentDate = addDays(start, i);
        dates.push({
          date: currentDate,
          iso: format(currentDate, 'yyyy-MM-dd'),
          day: format(currentDate, 'dd'),
          // Formata dia da semana (ex: 'Ter') ou 'Hoje'
          weekday: isToday(currentDate) ? 'Hoje' : format(currentDate, 'EEE', { locale: ptBR }),
          isToday: isToday(currentDate),
        });
      }
      return dates;
    };

    const isSelected = (date: Date): boolean => {
      return isSameDay(date, selectedDate.value);
    };

    const selectDate = (date: Date) => {
      selectedDate.value = date;
    };

    const formattedSelectedDate = computed(() => {
      return format(selectedDate.value, "dd 'de' MMMM", { locale: ptBR });
    });

    // --- Lógica da API ---
    const fetchAppointments = async (date: Date) => {
      isLoading.value = true;
      apiErrorMessage.value = '';
      appointments.value = []; // Limpa a lista antes de buscar
      try {
        const dateString = format(date, 'yyyy-MM-dd');
        // ATENÇÃO: Confirme o endpoint com o Orion (GET /appointments/me?date=YYYY-MM-DD ?)
        const response = await api.get(`/appointments/me?date=${dateString}`);
        // Adapte a linha abaixo se a estrutura da resposta for diferente
        appointments.value = response.data;
      } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
        apiErrorMessage.value = "Não foi possível carregar os agendamentos.";
      } finally {
        isLoading.value = false;
      }
    };

    // --- Ciclo de Vida e Watchers ---
    onMounted(() => {
      datesToShow.value = generateDates(today); // Gera as datas ao montar
      fetchAppointments(selectedDate.value); // Busca agendamentos para hoje
    });

    // Observa mudanças na data selecionada e busca novos agendamentos
    watch(selectedDate, (newDate) => {
      fetchAppointments(newDate);
    });

    // --- Métodos de Ação ---
    const goBack = () => {
      // Idealmente, use this.$router.go(-1) se estiver usando Options API
      // Como estamos em setup, a injeção do router seria necessária
      // router.go(-1); // Exemplo se router fosse injetado
      console.log('Voltar');
    };

    const handleAppointmentOptions = (appointmentId: number | string) => {
      console.log('Abrir opções para agendamento ID:', appointmentId);
    };

    return {
      selectedDate,
      datesToShow,
      appointments,
      isLoading,
      apiErrorMessage,
      isSelected,
      selectDate,
      formattedSelectedDate,
      goBack,
      handleAppointmentOptions,
    };
  }
});
</script>

<style scoped>
.appointments-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden; /* Impede scroll da página inteira */
  background-color: var(--color-background-primary);
}

/* Container do seletor de data */
.date-selector-container {
  padding: 0 1.5rem 1rem; /* 0 24px 16px */
  overflow-x: auto; /* Permite scroll horizontal */
  background-color: var(--color-background-primary); /* Garante fundo sólido */
  flex-shrink: 0; /* Impede que encolha */

  /* Esconde a barra de rolagem visualmente (mas ainda funciona) */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.date-selector-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}


.date-selector-scroll {
  display: flex;
  gap: 0.75rem; /* 12px */
  white-space: nowrap; /* Impede quebra de linha */
}

.date-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  height: 68px;
  padding: 0.5rem; /* 8px */
  border-radius: var(--radius-lg); /* 16px */
  border: 1px solid var(--color-border);
  background-color: var(--color-background-secondary);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.date-pill:hover {
  border-color: var(--color-accent-primary);
}

.date-pill.active {
  background-color: var(--color-accent-primary);
  color: var(--color-text-primary);
  border-color: var(--color-accent-primary);
}

.date-weekday {
  font-size: 0.75rem; /* 12px */
  font-weight: var(--font-weight-semibold);
  text-transform: capitalize;
}

.date-day {
  font-size: 1.25rem; /* 20px */
  font-weight: var(--font-weight-bold);
  line-height: 1.2;
}

/* Conteúdo principal com a lista */
.appointments-content {
  flex-grow: 1; /* Ocupa o espaço restante */
  overflow-y: auto; /* Scroll SÓ AQUI */
  padding: 0 1.5rem 1.5rem; /* 0 24px 24px */
}

.appointments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* 16px */
}

/* Estados de Carregamento e Vazio */
.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--color-text-secondary);
  padding: 3rem 1rem;
  gap: 1rem;
}
.loading-state .vue-feather {
  width: 32px;
  height: 32px;
}
</style>