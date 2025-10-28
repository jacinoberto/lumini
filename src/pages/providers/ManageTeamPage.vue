<script lang="ts">
import { defineComponent } from 'vue';
import api from '@/services/api'; // Importa a instância do Axios

// Componentes
import BaseHeader from '@/components/base/BaseHeader.vue';
import TeamMemberCard from '@/components/cards/TeamMemberCard.vue';
import type { TeamMember } from '@/types/barber'; // Reutiliza o tipo

export default defineComponent({
  name: 'ManageTeamPage',
  components: { BaseHeader, TeamMemberCard },
  data() {
    return {
      teamMembers: [] as TeamMember[], // Começa com lista vazia
      isLoading: false,
      apiErrorMessage: '',
      barbershopId: localStorage.getItem('barbershopId'), // Pega o ID salvo
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    addTeamMember() {
      // Navega para a rota de adicionar membro
      this.$router.push({ name: 'AddTeamMember' });
    },
    handleMemberOptions(memberId: number | string) {
      console.log('Abrir opções para o membro ID:', memberId);
      // Navega para a rota de edição (precisa ser criada no router)
      // Exemplo: this.$router.push({ name: 'EditTeamMember', params: { memberId: memberId } });
    },
    // --- NOVO MÉTODO PARA BUSCAR MEMBROS ---
    async fetchTeamMembers() {
      if (!this.barbershopId) {
        this.apiErrorMessage = "Erro: ID da barbearia não encontrado.";
        return;
      }
      this.isLoading = true;
      this.apiErrorMessage = '';
      try {
        // Usa o endpoint GET fornecido
        const response = await api.get(`/barbershops/${this.barbershopId}/barbers`);

        // A API retorna diretamente o array de barbeiros
        if (response.data && Array.isArray(response.data)) {
          // Adapte o mapeamento se os nomes dos campos da API forem diferentes do tipo TeamMember
          this.teamMembers = response.data.map(apiMember => ({
            id: apiMember.id, // Supondo que a API retorna 'id'
            name: apiMember.name,
            avatar: apiMember.profile_image, // Mapeia profile_image para avatar
            specialties: apiMember.specialties,
            rating: apiMember.rating ?? 0, // Adicione fallback se a API não retornar
            cutsCount: apiMember.cuts_count ?? 0 // Adicione fallback se a API não retornar
          }));
        } else {
          console.warn("API não retornou uma lista de barbeiros esperada.", response.data);
          this.teamMembers = [];
        }
      } catch (error) {
        console.error("Erro ao buscar membros da equipe:", error);
        this.apiErrorMessage = "Não foi possível carregar a equipe.";
        this.teamMembers = [];
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    // Busca os membros ao carregar a página
    this.fetchTeamMembers();
  },
});
</script>

<template>
  <div class="manage-team-layout">
    <BaseHeader title="Gerenciar Equipe" @click="goBack" />

    <main class="team-content">
      <div v-if="isLoading" class="loading-state">Carregando equipe...</div>
      <div v-else-if="apiErrorMessage" class="error-state">{{ apiErrorMessage }}</div>
      <div v-else-if="teamMembers.length === 0" class="empty-state">Nenhum barbeiro cadastrado.</div>

      <div v-else class="team-list">
        <TeamMemberCard
            v-for="member in teamMembers"
            :key="member.id"
            :member="member"
            @options-click="handleMemberOptions"
        />
      </div>
    </main>

    <button class="fab-add" @click="addTeamMember">
      <vue-feather type="plus" size="32"></vue-feather>
    </button>
  </div>
</template>

<style scoped>
.manage-team-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--color-background-primary);
}

.team-content {
  flex-grow: 1;
  overflow-y: auto; /* Scroll apenas nesta área */
  padding: 1.5rem; /* 24px */
}

.team-list {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* 16px */
}

/* Mesmo estilo do FAB da tela de serviços */
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
  z-index: 100; /* Garante que fique acima da lista */
}

.fab-add:hover {
  transform: scale(1.05);
}

.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--color-text-secondary);
}
</style>