<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import BaseAvatar from '@/components/base/BaseAvatar.vue';

type Client = {
  name: string;
  avatar: string | null;
  appointmentCount?: number; // Opcional
};

export default defineComponent({
  name: 'ClientInfoCard',
  components: { BaseAvatar },
  props: {
    client: {
      type: Object as PropType<Client>,
      required: true,
    },
  },
});
</script>

<template>
  <div class="client-info-card">
    <BaseAvatar :src="client.avatar" :name="client.name" size="md" />
    <div class="client-details">
      <p class="client-name">{{ client.name }}</p>
      <p v-if="client.appointmentCount" class="appointment-count">
        {{ client.appointmentCount }} agendamento{{ client.appointmentCount > 1 ? 's' : '' }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.client-info-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: 1rem;
  background-color: var(--color-background-secondary);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
}

.client-details {
  display: flex;
  flex-direction: column;
}

.client-name {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-bold);
}

.appointment-count {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}
</style>