<script lang="ts">
import { defineComponent } from 'vue';
import api from '@/services/api'; // Importa a instância do Axios

// Importa os componentes necessários
import BaseHeader from '@/components/base/BaseHeader.vue';
import ServiceCard from '@/components/cards/ServiceCard.vue';
import type { Service } from '@/types/service.ts'; // Reutiliza o tipo do card

export default defineComponent({
  name: 'ServicesProviderPage',
  components: {
    BaseHeader,
    ServiceCard,
  },
  data() {
    return {
      services: [] as Service[], // Começa com uma lista vazia
      isLoading: false,
      apiErrorMessage: '',
      barbershopId: localStorage.getItem('barbershopId'), // Pega o ID salvo
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    addService() {
      this.$router.push({ name: 'AddService' });
    },
    handleServiceOptions(serviceId: number | string) {
      console.log('Abrir opções para serviço ID:', serviceId);
      // Navega para a edição
      this.$router.push({ name: 'EditService', params: { id: serviceId } });
    },
    // --- NOVO MÉTODO PARA BUSCAR SERVIÇOS ---
    async fetchServices() {
      if (!this.barbershopId) {
        this.apiErrorMessage = "Erro: ID da barbearia não encontrado.";
        return;
      }
      this.isLoading = true;
      this.apiErrorMessage = '';
      try {
        // Usa o endpoint GET fornecido
        const response = await api.get(`/barbershops/${this.barbershopId}/services`);

        // A API retorna diretamente o array de serviços
        if (response.data && Array.isArray(response.data)) {
          this.services = response.data; // Atualiza a lista
        } else {
          console.warn("API não retornou uma lista de serviços esperada.", response.data);
          this.services = []; // Garante que seja um array vazio
        }

      } catch (error) {
        console.error("Erro ao buscar serviços:", error);
        this.apiErrorMessage = "Não foi possível carregar os serviços.";
        this.services = []; // Limpa a lista em caso de erro
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    // Busca os serviços ao carregar a página
    this.fetchServices();
  },
});
</script>

<template>
  <div class="services-page-layout">
    <BaseHeader title="Meus Serviços" @click="goBack" />

    <main class="services-content">
      <div v-if="isLoading" class="loading-state">Carregando serviços...</div>
      <div v-else-if="apiErrorMessage" class="error-state">{{ apiErrorMessage }}</div>
      <div v-else-if="services.length === 0" class="empty-state">Nenhum serviço cadastrado ainda.</div>

      <div v-else class="services-list">
        <ServiceCard
            v-for="service in services"
            :key="service.id"
            :service="service"
            @options-click="handleServiceOptions"
        />
      </div>
    </main>

    <button class="fab-add" @click="addService">
      <vue-feather type="plus" size="32"></vue-feather>
    </button>
  </div>
</template>

<style scoped>
.services-page-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--color-background-primary);
}

/* Garante que o conteúdo principal ocupe o espaço e permite scroll interno */
.services-content {
  flex-grow: 1;
  overflow-y: auto; /* Scroll apenas nesta área */
  padding: 1.5rem; /* 24px */
}

.services-list {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* 16px */
}

/* Estilo para o botão flutuante (Floating Action Button - FAB) */
.fab-add {
  position: fixed;
  bottom: 1.5rem; /* 24px */
  right: 1.5rem; /* 24px */
  width: 60px;
  height: 60px;
  background-image: linear-gradient(to right, var(--color-accent-primary), var(--color-accent-primary-hover, #047857));
  border-radius: 50%;
  border: none;
  color: var(--color-text-primary);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease-out;
}

.fab-add:hover {
  transform: scale(1.05);
}
</style>