<script lang="ts">
import { defineComponent, type PropType, computed } from 'vue';
import BaseToggle from '@/components/base/BaseToggle.vue';
import type { WorkingHour } from '@/types/service';
// Este é o tipo que o componente espera receber via v-model
// Certifique-se de que ele existe no seu arquivo de tipos

export default defineComponent({
  name: 'DayScheduleCard',
  components: {
    BaseToggle,
  },
  props: {
    // Prop para o v-model
    modelValue: {
      type: Object as PropType<WorkingHour>,
      required: true,
    },
  },
  emits: ['update:modelValue'],

  setup(props, { emit }) {
    // Computed property para gerenciar o v-model com o objeto do dia
    const dayData = computed({
      get: () => props.modelValue,
      set: (value) => {
        emit('update:modelValue', value);
      },
    });

    return {
      dayData,
    };
  },
});
</script>

<template>
  <div class="day-schedule-card" :class="{ 'is-open': dayData.is_open }">
    <div class="day-header">
      <span class="day-name">{{ dayData.day_name }}</span>
      <BaseToggle v-model="dayData.is_open" />
    </div>

    <div class="time-inputs-wrapper">
      <div class="time-input-group">
        <div class="time-input">
          <label for="start-time">Das</label>
          <input type="time" id="start-time" v-model="dayData.start_time" />
        </div>
        <div class="time-input">
          <label for="end-time">Às</label>
          <input type="time" id="end-time" v-model="dayData.end_time" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.day-schedule-card {
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

/* Animação de "acordeão" */
.time-inputs-wrapper {
  background-color: var(--color-background-primary);
  border-top: 1px solid var(--color-border);

  /* Estado fechado */
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  overflow: hidden;

  /* Transição suave */
  transition: all 0.4s ease-in-out;
}

/* Quando o card tem a classe 'is-open', a wrapper se expande */
.day-schedule-card.is-open .time-inputs-wrapper {
  max-height: 150px; /* Altura suficiente para o conteúdo */
  padding: 1.25rem; /* 20px */
}

.time-input-group {
  display: flex;
  gap: 1rem; /* 16px */
  align-items: center;
}

.time-input {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem; /* 8px */
  background-color: var(--color-background-secondary);
  padding: 0.75rem 1rem; /* 12px 16px */
  border-radius: 0.75rem; /* 12px */
}

.time-input label {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
}

/* Estilizando o input de tempo para o tema escuro */
.time-input input[type="time"] {
  background: none;
  border: none;
  color: var(--color-text-primary);
  font-family: 'Sora', sans-serif;
  font-size: 1.125rem; /* 18px */
  font-weight: 700;
  width: 100%;
  outline: none;
}

/* Remove o ícone padrão do seletor de tempo no Chrome/Edge */
input[type="time"]::-webkit-calendar-picker-indicator {
  display: none;
}
</style>