<script lang="ts">
import { defineComponent, type PropType } from 'vue';
// Importe date-fns se precisar formatar datas de forma mais complexa
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type ServiceDetails = {
  serviceName: string;
  professionalName?: string; // Opcional
  dateTime: string; // Formato ISO 8601 (ex: "2025-10-09T14:00:00")
  durationMinutes: number;
  totalValue: number;
};

export default defineComponent({
  name: 'ServiceDetailsCard',
  props: {
    details: {
      type: Object as PropType<ServiceDetails>,
      required: true,
    },
  },
  methods: {
    formatCurrency(value: number): string {
      return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    },
    formatDateTime(isoString: string): string {
      try {
        const date = parseISO(isoString);
        // Ex: "Hoje, 09 de Outubro de 2025 às 14:00"
        // Adapte o formato 'PPPp' se precisar de algo diferente
        return format(date, "PPPp", { locale: ptBR });
      } catch (e) {
        console.error("Erro ao formatar data:", e);
        return isoString; // Retorna a string original em caso de erro
      }
    },
  },
});
</script>

<template>
  <div class="service-details-card">
    <h2 class="card-title">Serviço Agendado</h2>
    <div class="detail-item">
      <vue-feather type="scissors" size="20"></vue-feather>
      <div class="detail-text">
        <p class="detail-value">{{ details.serviceName }}</p>
        <p v-if="details.professionalName" class="detail-label">com {{ details.professionalName }}</p>
      </div>
    </div>
    <div class="detail-item">
      <vue-feather type="clock" size="20"></vue-feather>
      <div class="detail-text">
        <p class="detail-value">{{ formatDateTime(details.dateTime) }}</p>
        <p class="detail-label">(duração {{ details.durationMinutes }}min)</p>
      </div>
    </div>
    <div class="detail-item">
      <vue-feather type="dollar-sign" size="20"></vue-feather>
      <div class="detail-text">
        <p class="detail-label">Valor Total</p>
        <p class="detail-value">{{ formatCurrency(details.totalValue) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.service-details-card {
  padding: 1.5rem; /* 24px */
  background-color: var(--color-background-secondary);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* 24px */
}

.card-title {
  color: var(--color-text-primary);
  font-size: 1.125rem; /* 18px */
  font-weight: var(--font-weight-bold);
  margin-bottom: 0.5rem; /* 8px */
}

.detail-item {
  display: flex;
  align-items: flex-start; /* Alinha ícone com a primeira linha de texto */
  gap: 1rem; /* 16px */
  color: var(--color-text-secondary);
}

.detail-item .vue-feather {
  flex-shrink: 0;
  margin-top: 2px; /* Ajuste fino do alinhamento vertical do ícone */
}

.detail-text {
  display: flex;
  flex-direction: column;
}

.detail-label {
  font-size: 0.875rem; /* 14px */
  color: var(--color-text-secondary);
}

.detail-value {
  font-size: 1rem; /* 16px */
  color: var(--color-text-primary);
  font-weight: var(--font-weight-semibold);
}
</style>