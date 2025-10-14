<script lang="ts">
import { defineComponent, PropType } from 'vue';
import BaseAvatar from '@/components/base/BaseAvatar.vue';

import type { Appointment } from '@/types/service.ts';

export default defineComponent({
  name: 'PrimaryScheduleCard',
  components: {
    BaseAvatar,
  },
  props: {
    // A única prop é o objeto 'appointment' completo
    appointment: {
      type: Object as PropType<Appointment>,
      required: true,
    },
  },
});
</script>

<template>
  <div class="schedule-card">
    <BaseAvatar :src="appointment.profile" :name="appointment.name" />

    <div class="details">
      <p class="name">{{ appointment.name }}</p>
      <p class="service">{{ appointment.service }}</p>
    </div>

    <div class="time">
      {{ appointment.hour }}
    </div>
  </div>
</template>

<style scoped>
.schedule-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md); /* 16px */
  width: 100%;
  padding: var(--spacing-md); /* 16px */
  background-color: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl); /* 24px */
}

.details {
  /* Faz esta div crescer e ocupar o espaço disponível, empurrando o 'time' para a direita */
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.name {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-body); /* 16px */
}

.service {
  color: var(--color-text-secondary);
  font-size: var(--font-size-input); /* 14px */
}

.time {
  color: var(--color-accent-secondary); /* A cor laranja do Design System */
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-body); /* 16px */
}
</style>