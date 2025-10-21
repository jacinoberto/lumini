<script lang="ts">
import { defineComponent } from 'vue';

// Importa os componentes necessários
import BaseHeader from '@/components/base/BaseHeader.vue';
import TeamMemberCard from '@/components/cards/TeamMemberCard.vue';

export default defineComponent({
  name: 'ManageTeamPage',
  components: {
    BaseHeader,
    TeamMemberCard,
  },
  data() {
    return {
      // Dados de exemplo (virão da API)
      teamMembers: [
        { id: 1, name: 'Carlos Eduardo', avatar: null, specialties: 'Cortes clássicos, Barboterapia', rating: 4.9, cutsCount: 97 },
        { id: 2, name: 'Ana Silva', avatar: null, specialties: 'Coloração, Penteados', rating: 4.8, cutsCount: 112 },
        // Adicione mais membros aqui
      ],
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    // --- ALTERAÇÃO AQUI ---
    addTeamMember() {
      // Navega para a rota nomeada 'AddTeamMember'
      this.$router.push({ name: 'AddTeamMember' });
    },
    handleMemberOptions(memberId: number | string) {
      console.log('Abrir opções para o membro ID:', memberId);
      // Adicionar lógica para editar/remover membro
    },
  },
});
</script>

<template>
  <div class="manage-team-layout">
    <BaseHeader title="Gerenciar Equipe" @click="goBack" />

    <main class="team-content">
      <div class="team-list">
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
</style>