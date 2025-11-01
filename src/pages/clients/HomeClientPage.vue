<template>
  <div class="client-home-screen">
    <TheHeader role="client" :user-data="userData" />

    <main class="home-content">
      <section class="categories-section">
        <p>Categorias aqui...</p>
      </section>

      <section class="barbershop-list-section">
        <div class="section-header">
          <h2>Perto de você</h2>
          <RouterLink :to="{ name: 'NearbyBarbershops' }">Ver todos</RouterLink> </div>
        <div v-if="isLoading">Carregando barbearias...</div>
        <div v-else-if="barbershops.length === 0">Nenhuma barbearia encontrada.</div>
        <div v-else class="barbershop-list">
          <p>Lista de Barbearias aqui...</p>
        </div>
      </section>
    </main>

    <TheBottomNav />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import api from '@/services/api';

// Componentes Layout
import TheHeader from '@/components/layouts/TheHeader.vue';
import TheBottomNav from '@/components/layouts/TheButtonNav.vue';
// Componentes a criar:
// import CategoryPills from '@/components/clients/CategoryPills.vue';
// import BarbershopCard from '@/components/cards/BarbershopCard.vue';

export default defineComponent({
  name: 'HomeClientPage',
  components: {
    TheHeader,
    TheBottomNav,
    // CategoryPills,
    // BarbershopCard,
  },
  data() {
    return {
      userData: null, // Buscar do localStorage ou store
      searchQuery: '', // Ligado ao BaseSearchBar dentro do TheHeader
      categories: ['Todos', 'Perto de mim', 'Top Avaliados', 'Novos'],
      selectedCategory: 'Todos',
      barbershops: [], // Virá da API
      isLoading: false,
    };
  },
  methods: {
    fetchUserData() {
      const data = localStorage.getItem('userData');
      if (data) {
        this.userData = JSON.parse(data);
      }
    },
    async fetchBarbershops() {
      this.isLoading = true;
      try {
        // CONFIRMAR ENDPOINT com Orion (ex: GET /barbershops?category=...)
        const response = await api.get('/barbershops', {
          params: { category: this.selectedCategory } // Exemplo de filtro
        });
        this.barbershops = response.data;
      } catch (error) {
        console.error("Erro ao buscar barbearias:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
  watch: {
    selectedCategory() {
      // Busca novas barbearias quando a categoria muda
      this.fetchBarbershops();
    }
  },
  mounted() {
    this.fetchUserData();
    this.fetchBarbershops(); // Busca inicial
  }
});
</script>

<style scoped>
/* Estilos extraídos do home_cliente.html */
/* Adapte conforme necessário */
.client-home-screen { padding-bottom: 80px; /* Espaço para TheBottomNav */ }
.home-content { padding: 1.5rem; display: flex; flex-direction: column; gap: 2rem; }
.categories-section { /* ... */ }
.categories-scroll { display: flex; gap: 0.75rem; overflow-x: auto; padding-bottom: 0.5rem; scrollbar-width: none; }
.categories-scroll::-webkit-scrollbar { display: none; }
/* Estilos para CategoryPills e BarbershopCard virão de seus próprios componentes */
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.section-header h2 { font-size: 1.5rem; }
.section-header a { color: var(--color-accent-primary); font-weight: 600; text-decoration: none; }
.barbershop-list { display: flex; flex-direction: column; gap: 1.5rem; }
</style>