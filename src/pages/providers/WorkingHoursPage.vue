<template>
  <div class="working-hours-layout">
    <BaseHeader title="Horários de Funcionamento" @click="goBack">
      <template #subtitle>
        <p class="header-subtitle">Defina sua agenda semanal padrão.</p>
      </template>
    </BaseHeader>

    <main class="form-content">
      <form @submit.prevent="saveHours" class="hours-form">
        <DayScheduleCard
            v-for="(day, index) in workingDays"
            :key="day.day_of_week"
            v-model="workingDays[index]!"
        />

        <p v-if="apiErrorMessage" class="error-feedback">{{ apiErrorMessage }}</p>

        <BaseButton
            class="save-button"
            label="Salvar Horários"
            type="primary"
            :disabled="isLoading"
        />
      </form>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import api from '@/services/api';

// Componentes
import BaseHeader from '@/components/base/BaseHeader.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import DayScheduleCard from '@/components/ui/DayScheduleCard.vue'; // Usando o card do onboarding

// Tipos
type ApiWorkingHour = {
  day_of_week: number; // 0=Domingo, 1=Segunda, ..., 6=Sábado
  start_time: string | null;
  end_time: string | null;
  is_active: boolean;
};

// Tipo usado pelo DayScheduleCard (adaptado se necessário)
type DayScheduleData = {
  day_of_week: number; // Adicionamos day_of_week para facilitar o mapeamento
  day_name: string;
  is_open: boolean;
  start_time: string;
  end_time: string;
};

// Nomes dos dias para inicialização
const dayNames = [
  'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
  'Quinta-feira', 'Sexta-feira', 'Sábado'
];

export default defineComponent({
  name: 'WorkingHoursPage',
  components: { BaseHeader, BaseButton, DayScheduleCard },
  data() {
    return {
      // MUDANÇA: Estrutura de dados agora é um array de 7 dias
      workingDays: dayNames.map((name, index) => ({
        day_of_week: index, // Domingo = 0, Sábado = 6
        day_name: name,
        is_open: index >= 1 && index <= 5, // Abre Seg-Sex por padrão
        start_time: '09:00',
        end_time: '18:00',
      })) as DayScheduleData[],
      isLoading: false,
      apiErrorMessage: '',
      barbershopId: localStorage.getItem('barbershopId'),
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },

    // Mapeia a estrutura da UI (7 dias) para o formato da API (7 dias)
    mapUiToApi(): ApiWorkingHour[] {
      return this.workingDays.map(day => {
        // CORREÇÃO: Garante que o formato seja HH:MM
        const startTime = day.is_open && day.start_time ? day.start_time.substring(0, 5) : null;
        const endTime = day.is_open && day.end_time ? day.end_time.substring(0, 5) : null;

        return {
          day_of_week: day.day_of_week,
          start_time: startTime,
          end_time: endTime,
          is_active: day.is_open,
        };
      });
    },

    // Mapeia os dados da API (7 dias) para a estrutura da UI (7 dias)
    mapApiToUi(apiData: ApiWorkingHour[]) {
      const sortedApiData = [...apiData].sort((a, b) => a.day_of_week - b.day_of_week);

      this.workingDays = sortedApiData.map((apiDay) => {
        // CORREÇÃO: Adiciona um fallback '??' para day_name
        const dayName = dayNames[apiDay.day_of_week] ?? 'Dia Inválido'; // Ou use '' como fallback

        return {
          day_of_week: apiDay.day_of_week,
          day_name: dayName, // Usa a variável com fallback
          is_open: apiDay.is_active,
          start_time: apiDay.start_time || '09:00',
          end_time: apiDay.end_time || '18:00',
        };
      });
    },

    async fetchWorkingHours() {
      // (Lógica de fetch permanece a mesma da resposta anterior)
      if (!this.barbershopId) { /* ... */ return; }
      this.isLoading = true;
      this.apiErrorMessage = '';
      try {
        const response = await api.get(`/barbershops/${this.barbershopId}/business-hours`);
        if (response.data && Array.isArray(response.data) && response.data.length === 7) {
          this.mapApiToUi(response.data);
        } else if (response.data.business_hours && Array.isArray(response.data.business_hours) && response.data.business_hours.length === 7){
          this.mapApiToUi(response.data.business_hours);
        } else {
          console.warn("API não retornou 7 dias de horários.", response.data);
          // Poderia manter os dados padrão ou mostrar erro
        }
      } catch (error) { /* ... */ }
      finally { this.isLoading = false; }
    },

    async saveHours() {
      // (Lógica de save permanece a mesma, pois mapUiToApi já está correta)
      if (!this.barbershopId) { /* ... */ return; }
      this.isLoading = true;
      this.apiErrorMessage = '';
      try {
        const payload = { business_hours: this.mapUiToApi() };
        await api.put(`/barbershops/${this.barbershopId}/business-hours`, payload);
        this.goBack();
      } catch (error: any) { /* ... */ }
      finally { this.isLoading = false; }
    },
  },
  mounted() {
    this.fetchWorkingHours();
  },
});
</script>

<style scoped>
.working-hours-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--color-background-primary);
}

.header-subtitle {
  color: var(--color-text-secondary);
  font-size: 1rem;
  margin-top: -16px;
}

.form-content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1.5rem; /* 24px */
}

/* Agora o form contém a lista de cards */
.hours-form {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Espaço entre os DayScheduleCards */
}

.error-feedback {
  color: var(--color-danger);
  text-align: center;
  font-weight: var(--font-weight-semibold);
  margin-top: 1rem;
}

.save-button {
  margin-top: 2rem; /* Espaço antes do botão salvar */
  position: sticky; /* Faz o botão ficar fixo no final enquanto rola a lista */
  bottom: 1.5rem; /* Alinha com o padding do form-content */
}
</style>