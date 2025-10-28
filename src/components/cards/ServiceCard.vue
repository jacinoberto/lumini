<script lang="ts">
import { defineComponent, type PropType, computed } from 'vue';

type Service = {
  id: number | string;
  name: string;
  duration: number;
  price: number | string | null | undefined; // Permite receber string ou null temporariamente
};

export default defineComponent({
  name: 'ServiceCard',
  props: {
    service: {
      type: Object as PropType<Service>,
      required: true,
    },
  },
  emits: ['edit', 'delete'],
  // MUDANÇA: Use uma computed property para formatar o preço com segurança
  computed: {
    formattedPrice(): string {
      const price = Number(this.service.price); // Tenta converter para número
      if (!isNaN(price)) { // Verifica se a conversão foi bem-sucedida
        return price.toFixed(2).replace('.', ',');
      }
      return 'N/A'; // Ou '0,00' ou outra coisa se o preço for inválido
    }
  }
});
</script>

<template>
  <div class="service-card">
    <div class="service-details">
      <h3 class="service-name">{{ service.name }}</h3>
      <p class="service-info">{{ service.duration }}min - R$ {{ formattedPrice }}</p>
    </div>
    <button class="options-btn">
      <vue-feather type="more-vertical" size="20"></vue-feather>
    </button>
  </div>
</template>

<style scoped>
.service-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1.25rem; /* 20px */
  background-color: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl); /* 24px */
}

.service-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem; /* 4px */
}

.service-name {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-bold);
  font-size: 1rem; /* 16px */
}

.service-info {
  color: var(--color-text-secondary);
  font-size: 0.875rem; /* 14px */
}

.options-btn {
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
}

.options-btn:hover {
  background-color: var(--color-border);
  color: var(--color-text-primary);
}
</style>