<script lang="ts">
import { defineComponent, type PropType, computed } from 'vue';

// Define o formato do objeto que o card espera
// Adicione mais campos se necessário (ex: status para a cor da borda)
type Appointment = {
  id: number | string;
  clientName: string;
  serviceName: string;
  time: string;
  status?: 'pending' | 'confirmed' | 'completed'; // Exemplo para a cor da borda
};

export default defineComponent({
  name: 'AppointmentCard',
  props: {
    appointment: {
      type: Object as PropType<Appointment>,
      required: true,
    },
  },
  emits: ['options-click'],
  setup(props) {
    // Calcula a classe da borda baseada no status (exemplo)
    const statusClass = computed(() => {
      switch (props.appointment.status) {
        case 'confirmed': return 'border-confirmed';
        case 'completed': return 'border-completed';
        default: return 'border-pending';
      }
    });
    return { statusClass };
  },
  methods: {
    emitOptionsClick() {
      this.$emit('options-click', this.appointment.id);
    },
  },
});
</script>

<template>
  <div class="appointment-card" :class="statusClass">
    <div class="appointment-details">
      <h3 class="client-name">{{ appointment.clientName }}</h3>
      <p class="service-time">{{ appointment.serviceName }} - {{ appointment.time }}</p>
    </div>
    <button class="options-btn" @click="emitOptionsClick">
      <vue-feather type="more-vertical" size="20"></vue-feather>
    </button>
  </div>
</template>

<style scoped>
.appointment-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1rem 1.25rem; /* 16px 20px */
  background-color: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl); /* 24px */
  position: relative; /* Para a borda colorida */
  overflow: hidden; /* Garante que a borda não vaze */
}

/* Borda colorida à esquerda */
.appointment-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 6px;
  background-color: var(--color-border); /* Cor padrão/pendente */
  transition: background-color 0.3s;
}

/* Cores da borda baseadas no status (exemplo) */
.appointment-card.border-pending::before {
  background-color: var(--color-accent-secondary); /* Laranja */
}
.appointment-card.border-confirmed::before {
  background-color: var(--color-accent-primary); /* Verde */
}
.appointment-card.border-completed::before {
  background-color: var(--color-info); /* Azul */
}


.appointment-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem; /* 4px */
}

.client-name {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-bold);
  font-size: 1rem; /* 16px */
}

.service-time {
  color: var(--color-text-secondary);
  font-size: 0.875rem; /* 14px */
}

.options-btn {
  /* Mesmo estilo do botão de opções anterior */
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  color: var(--color-text-secondary);
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s, color 0.2s;
  flex-shrink: 0;
}

.options-btn:hover {
  background-color: var(--color-border);
  color: var(--color-text-primary);
}
</style>