<script lang="ts">
import { defineComponent } from 'vue';

// Importa os componentes necessários
import { BaseHeader, ServiceCard } from "@/components";

export default defineComponent({
  name: 'ServicesProviderPage',
  components: {
    BaseHeader,
    ServiceCard,
  },
  data() {
    return {
      // Dados de exemplo (virão da API depois)
      services: [
        { id: 1, name: 'Corte Tradicional', duration: 30, price: 35 },
        { id: 2, name: 'Corte Militar', duration: 30, price: 45 },
        { id: 3, name: 'Corte + Barba', duration: 30, price: 55 },
        { id: 4, name: 'Mullet', duration: 30, price: 45 },
      ],
    };
  },
  methods: {
    goBack() {
      // Lógica para voltar para a tela anterior
      this.$router.go(-1);
    },
    addService() {
      // Navega para a rota nomeada 'AddService' (que definimos no router/index.ts)
      this.$router.push({ name: 'AddService' });
    },
    // Lógica para editar/deletar (pode ser adicionada depois)
    handleServiceOptions(serviceId: number | string) {
      console.log('Abrir opções para serviço ID:', serviceId);
      // Exemplo: this.$router.push({ name: 'EditService', params: { id: serviceId } });
    }
  },
});
</script>

<template>
  <div class="services-page-layout">
    <BaseHeader title="Meus Serviços" @click="goBack" />

    <main class="services-content">
      <div class="services-list">
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