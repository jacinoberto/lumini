<template>
  <div class="working-hours-layout">
    <BaseHeader title="Horários de Funcionamento" @click="goBack">
      <template #subtitle>
        <p class="header-subtitle">Defina sua agenda semanal padrão.</p>
      </template>
    </BaseHeader>

    <main class="form-content">
      <form @submit.prevent="saveHours" class="hours-form">
        <div class="day-group-card" :class="{ 'is-open': uiHours.weekdays.is_open }">
          <div class="day-header" @click="uiHours.weekdays.is_open = !uiHours.weekdays.is_open">
            <span class="day-name">Segunda à Sexta</span>
            <BaseToggle v-model="uiHours.weekdays.is_open" />
          </div>
          <div class="time-inputs-wrapper">
            <div class="time-input-group">
              <div class="time-input"><label>Das</label><input type="time" v-model="uiHours.weekdays.start_time"></div>
              <div class="time-input"><label>Às</label><input type="time" v-model="uiHours.weekdays.end_time"></div>
            </div>
          </div>
        </div>

        <div class="day-group-card" :class="{ 'is-open': uiHours.saturday.is_open }">
          <div class="day-header" @click="uiHours.saturday.is_open = !uiHours.saturday.is_open">
            <span class="day-name">Sábado</span>
            <BaseToggle v-model="uiHours.saturday.is_open" />
          </div>
          <div class="time-inputs-wrapper">
            <div class="time-input-group">
              <div class="time-input"><label>Das</label><input type="time" v-model="uiHours.saturday.start_time"></div>
              <div class="time-input"><label>Às</label><input type="time" v-model="uiHours.saturday.end_time"></div>
            </div>
          </div>
        </div>

        <div class="day-group-card" :class="{ 'is-open': uiHours.sunday.is_open }">
          <div class="day-header" @click="uiHours.sunday.is_open = !uiHours.sunday.is_open">
            <span class="day-name">Domingo</span>
            <BaseToggle v-model="uiHours.sunday.is_open" />
          </div>
          <div class="time-inputs-wrapper">
            <div class="time-input-group">
              <div class="time-input"><label>Das</label><input type="time" v-model="uiHours.sunday.start_time"></div>
              <div class="time-input"><label>Às</label><input type="time" v-model="uiHours.sunday.end_time"></div>
            </div>
          </div>
        </div>

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
import BaseToggle from '@/components/base/BaseToggle.vue';
import BaseButton from '@/components/base/BaseButton.vue';

// Tipo para a estrutura da API (exemplo)
type ApiWorkingHour = {
  day_of_week: number; // 0=Domingo, 1=Segunda, ..., 6=Sábado
  start_time: string | null;
  end_time: string | null;
  is_active: boolean;
};

// Tipo para a estrutura interna da UI
type UiHourGroup = {
  is_open: boolean;
  start_time: string;
  end_time: string;
};

export default defineComponent({
  name: 'WorkingHoursPage',
  components: { BaseHeader, BaseToggle, BaseButton },
  data() {
    return {
      // Estrutura de dados para a UI
      uiHours: {
        weekdays: { is_open: true, start_time: '09:00', end_time: '19:00' } as UiHourGroup,
        saturday: { is_open: true, start_time: '08:00', end_time: '18:00' } as UiHourGroup,
        sunday: { is_open: false, start_time: '09:00', end_time: '12:00' } as UiHourGroup,
      },
      isLoading: false,
      apiErrorMessage: '',
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },

    // Mapeia a estrutura da UI para o formato da API
    mapUiToApi(): ApiWorkingHour[] {
      const apiHours: ApiWorkingHour[] = [];

      // Segunda a Sexta (days 1 to 5)
      for (let i = 1; i <= 5; i++) {
        apiHours.push({
          day_of_week: i,
          start_time: this.uiHours.weekdays.is_open ? this.uiHours.weekdays.start_time : null,
          end_time: this.uiHours.weekdays.is_open ? this.uiHours.weekdays.end_time : null,
          is_active: this.uiHours.weekdays.is_open,
        });
      }
      // Sábado (day 6)
      apiHours.push({
        day_of_week: 6,
        start_time: this.uiHours.saturday.is_open ? this.uiHours.saturday.start_time : null,
        end_time: this.uiHours.saturday.is_open ? this.uiHours.saturday.end_time : null,
        is_active: this.uiHours.saturday.is_open,
      });
      // Domingo (day 0)
      apiHours.push({
        day_of_week: 0,
        start_time: this.uiHours.sunday.is_open ? this.uiHours.sunday.start_time : null,
        end_time: this.uiHours.sunday.is_open ? this.uiHours.sunday.end_time : null,
        is_active: this.uiHours.sunday.is_open,
      });

      return apiHours;
    },

    // Mapeia os dados da API para a estrutura da UI
    mapApiToUi(apiData: ApiWorkingHour[]) {
      // Assume que a API retorna 7 dias ordenados por day_of_week (ou precisa ordenar)
      const monday = apiData.find(d => d.day_of_week === 1);
      const saturday = apiData.find(d => d.day_of_week === 6);
      const sunday = apiData.find(d => d.day_of_week === 0);

      if (monday) {
        this.uiHours.weekdays.is_open = monday.is_active;
        this.uiHours.weekdays.start_time = monday.start_time || '09:00';
        this.uiHours.weekdays.end_time = monday.end_time || '19:00';
        // Assume que Seg-Sex terão os mesmos horários ou precisa de lógica mais complexa
      }
      if (saturday) {
        this.uiHours.saturday.is_open = saturday.is_active;
        this.uiHours.saturday.start_time = saturday.start_time || '08:00';
        this.uiHours.saturday.end_time = saturday.end_time || '18:00';
      }
      if (sunday) {
        this.uiHours.sunday.is_open = sunday.is_active;
        this.uiHours.sunday.start_time = sunday.start_time || '09:00';
        this.uiHours.sunday.end_time = sunday.end_time || '12:00';
      }
    },

    async fetchWorkingHours() {
      this.isLoading = true;
      this.apiErrorMessage = '';
      try {
        // CONFIRMAR ENDPOINT: GET /working-hours ou GET /barbershops/{id} ?
        const response = await api.get('/working-hours'); // Ajuste conforme necessário
        if (response.data && Array.isArray(response.data)) {
          this.mapApiToUi(response.data);
        } else {
          console.warn("API não retornou dados de horários esperados.");
        }

      } catch (error) {
        console.error("Erro ao buscar horários:", error);
        this.apiErrorMessage = "Não foi possível carregar os horários atuais.";
      } finally {
        this.isLoading = false;
      }
    },

    async saveHours() {
      // Adicionar validação Vuelidate aqui se necessário
      this.isLoading = true;
      this.apiErrorMessage = '';
      try {
        const payload = this.mapUiToApi();
        // CONFIRMAR ENDPOINT: PUT /working-hours ou PUT /barbershops/{id} ?
        await api.put('/working-hours', payload); // Ajuste conforme necessário

        // Sucesso!
        this.goBack(); // Ou mostrar notificação de sucesso

      } catch (error: any) {
        if (error.response?.data?.errors) {
          const apiErrors = error.response.data.errors;
          // Lógica para exibir erros específicos se a API retornar
        } else {
          this.apiErrorMessage = 'Erro ao salvar os horários.';
        }
        console.error("Erro ao salvar horários:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    this.fetchWorkingHours(); // Busca os horários ao carregar a página
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
  margin-top: -16px; /* Ajusta o espaçamento abaixo do título principal */
}

.form-content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1.5rem; /* 24px */
}

.hours-form {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* 16px */
}

/* Estilos do card de grupo de dias (similar ao DayScheduleCard) */
.day-group-card {
  background-color: var(--color-background-secondary);
  border-radius: 1rem; /* 16px */
  border: 1px solid var(--color-border);
  overflow: hidden;
  transition: all 0.3s ease-in-out;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem; /* 20px */
  cursor: pointer;
}

.day-name {
  font-size: 1.125rem; /* 18px */
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.time-inputs-wrapper {
  background-color: var(--color-background-primary);
  border-top: 1px solid var(--color-border);
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  overflow: hidden;
  transition: all 0.4s ease-in-out;
}

.day-group-card.is-open .time-inputs-wrapper {
  max-height: 150px; /* Altura suficiente */
  padding: 1.25rem; /* 20px */
}

.time-input-group { display: flex; gap: 1rem; align-items: center; }
.time-input { flex: 1; display: flex; align-items: center; gap: 0.5rem; background-color: var(--color-background-secondary); padding: 0.75rem 1rem; border-radius: 0.75rem; }
.time-input label { font-weight: var(--font-weight-semibold); color: var(--color-text-secondary); }
.time-input input[type="time"] { background: none; border: none; color: var(--color-text-primary); font-family: 'Sora', sans-serif; font-size: 1.125rem; font-weight: 700; width: 100%; outline: none; }
input[type="time"]::-webkit-calendar-picker-indicator { display: none; }

.error-feedback {
  color: var(--color-danger);
  text-align: center;
  font-weight: var(--font-weight-semibold);
  margin-top: 1rem;
}

.save-button {
  margin-top: 2rem;
}
</style>