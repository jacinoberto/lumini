<template>
  <div class="details-layout">
    <BaseHeader :title="pageTitle" @click="goBack" />

    <main class="details-content">
      <div v-if="isLoading" class="loading-state">Carregando...</div>
      <div v-else-if="apiErrorMessage" class="error-state">{{ apiErrorMessage }}</div>
      <div v-else-if="appointment" class="details-wrapper">
        <ClientInfoCard :client="appointment.client" />
        <ServiceDetailsCard :details="appointment.serviceDetails" />

        <div class="action-buttons">
          <BaseButton label="Finalizar Agendamento" type="primary" @click="finalizeAppointment" />
          <BaseButton label="Cancelar Agendamento" type="secondary" variant="danger" @click="cancelAppointment" />
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // Composition API para acesso à rota/router
import api from '@/services/api';

// Componentes
import BaseHeader from '@/components/base/BaseHeader.vue';
import ClientInfoCard from '@/components/cards/ClientInfoCard.vue';
import ServiceDetailsCard from '@/components/cards/ServiceDetailsCard.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseAvatar from '@/components/base/BaseAvatar.vue'; // Importar se ClientInfoCard não for usado

// Tipos (Adapte conforme a resposta da API)
type ApiAppointmentDetails = {
  id: string | number;
  client: { name: string; avatar: string | null; appointmentCount?: number; };
  serviceDetails: { serviceName: string; professionalName?: string; dateTime: string; durationMinutes: number; totalValue: number; };
  status: string; // Ex: 'pending', 'confirmed', 'completed', 'cancelled'
};

export default defineComponent({
  name: 'AppointmentDetailsPage',
  components: { BaseHeader, ClientInfoCard, ServiceDetailsCard, BaseButton },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const appointment = ref<ApiAppointmentDetails | null>(null);
    const isLoading = ref(true);
    const apiErrorMessage = ref('');

    const appointmentId = computed(() => route.params.id as string); // Pega o ID da URL

    const pageTitle = computed(() => {
      // Exemplo de título dinâmico
      return appointment.value ? 'Agendamento' : 'Detalhes do Agendamento';
    });

    const fetchDetails = async () => {
      isLoading.value = true;
      apiErrorMessage.value = '';
      try {
        // CONFIRMAR ENDPOINT: GET /appointments/{id}
        const response = await api.get(`/appointments/${appointmentId.value}`);
        appointment.value = response.data; // Adapte se necessário
      } catch (error) {
        console.error("Erro ao buscar detalhes:", error);
        apiErrorMessage.value = "Não foi possível carregar os detalhes.";
      } finally {
        isLoading.value = false;
      }
    };

    const goBack = () => {
      router.go(-1);
    };

    const finalizeAppointment = async () => {
      // Lógica para chamar API de finalização
      // CONFIRMAR ENDPOINT: PATCH /appointments/{id}/complete ?
      console.log('Finalizar Agendamento ID:', appointmentId.value);
      try {
        await api.patch(`/appointments/${appointmentId.value}/complete`);
        goBack(); // Volta após sucesso
      } catch(error) {
        console.error("Erro ao finalizar:", error);
        // Mostrar notificação de erro
      }
    };

    const cancelAppointment = async () => {
      // Lógica para chamar API de cancelamento
      // CONFIRMAR ENDPOINT: PATCH /appointments/{id}/cancel ?
      console.log('Cancelar Agendamento ID:', appointmentId.value);
      try {
        await api.patch(`/appointments/${appointmentId.value}/cancel`);
        goBack(); // Volta após sucesso
      } catch(error) {
        console.error("Erro ao cancelar:", error);
        // Mostrar notificação de erro
      }
    };

    onMounted(() => {
      fetchDetails();
    });

    return {
      appointment,
      isLoading,
      apiErrorMessage,
      pageTitle,
      goBack,
      finalizeAppointment,
      cancelAppointment,
    };
  },
});
</script>

<style scoped>
.details-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--color-background-primary);
}

.details-content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1.5rem; /* 24px */
}

.details-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* 24px */
}

.action-buttons {
  margin-top: 1rem; /* Espaço acima dos botões */
  display: flex;
  flex-direction: column;
  gap: 1rem; /* 16px */
}

/* Estados de loading/erro */
.loading-state, .error-state {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-secondary);
}
</style>